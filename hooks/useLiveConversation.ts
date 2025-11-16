import { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { decode, decodeAudioData, createBlob } from '../utils/audio';

type LiveSession = Awaited<ReturnType<typeof GoogleGenAI.prototype.live.connect>>;

const useLiveConversation = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [modelTranscript, setModelTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);

  const cleanup = useCallback(() => {
    scriptProcessorRef.current?.disconnect();
    inputAudioContextRef.current?.close();
    outputAudioContextRef.current?.close();
    streamRef.current?.getTracks().forEach(track => track.stop());

    scriptProcessorRef.current = null;
    inputAudioContextRef.current = null;
    outputAudioContextRef.current = null;
    streamRef.current = null;
    
    audioSourcesRef.current.forEach(source => source.stop());
    audioSourcesRef.current.clear();
    nextStartTimeRef.current = 0;
    
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  const stop = useCallback(async () => {
    if (sessionPromiseRef.current) {
        const session = await sessionPromiseRef.current;
        session.close();
        sessionPromiseRef.current = null;
    }
    cleanup();
  }, [cleanup]);

  const start = useCallback(async () => {
    if (isConnected || isConnecting) return;

    setIsConnecting(true);
    setError(null);
    setUserTranscript('');
    setModelTranscript('');

    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsConnected(true);
            
            // FIX: Cast window to `any` to support `webkitAudioContext` for Safari compatibility without TypeScript errors.
            const InputAudioContext = window.AudioContext || (window as any).webkitAudioContext;
            inputAudioContextRef.current = new InputAudioContext({ sampleRate: 16000 });
            
            const source = inputAudioContextRef.current.createMediaStreamSource(streamRef.current!);
            scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            
            scriptProcessorRef.current.onaudioprocess = (event) => {
              const inputData = event.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromiseRef.current?.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessorRef.current);
            scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              setUserTranscript(message.serverContent.inputTranscription.text);
            }
            if (message.serverContent?.outputTranscription) {
              setModelTranscript(message.serverContent.outputTranscription.text);
            }
            if (message.serverContent?.turnComplete) {
                setUserTranscript('');
                setModelTranscript('');
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
                if (!outputAudioContextRef.current || outputAudioContextRef.current.state === 'closed') {
                    // FIX: Cast window to `any` to support `webkitAudioContext` for Safari compatibility without TypeScript errors.
                    const OutputAudioContext = window.AudioContext || (window as any).webkitAudioContext;
                    outputAudioContextRef.current = new OutputAudioContext({ sampleRate: 24000 });
                }

                const ctx = outputAudioContextRef.current;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
                
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(ctx.destination);
                
                source.addEventListener('ended', () => {
                    audioSourcesRef.current.delete(source);
                });

                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                audioSourcesRef.current.add(source);
            }
          },
          onerror: (e: ErrorEvent) => {
            console.error('Live session error:', e);
            setError('A connection error occurred.');
            cleanup();
          },
          onclose: (e: CloseEvent) => {
            cleanup();
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are Aura, a wise, empathetic, and modern tarot guide. Your goal is to help users explore their tarot readings and questions with insight and clarity. Be supportive and thoughtful. Keep responses concise and easy to understand.',
        },
      });
    } catch (err) {
      console.error('Failed to start live session:', err);
      setError('Could not access microphone or start session.');
      cleanup();
    }
  }, [isConnected, isConnecting, cleanup]);

  return { start, stop, isConnected, isConnecting, userTranscript, modelTranscript, error };
};

export default useLiveConversation;