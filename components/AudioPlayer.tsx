
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { decode, decodeAudioData } from '../utils/audio';

interface AudioPlayerProps {
  audioData: string | null;
  isGeneratingAudio: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioData, isGeneratingAudio }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const cleanup = useCallback(() => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current.disconnect();
      audioSourceRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
    }
    audioContextRef.current = null;
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const handlePlay = useCallback(async () => {
    if (isPlaying) {
      cleanup();
      return;
    }

    if (!audioData) return;

    setIsDecoding(true);
    try {
      const audioBytes = decode(audioData);
      
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const newContext = new AudioContext({ sampleRate: 24000 });
      audioContextRef.current = newContext;
      
      const audioBuffer = await decodeAudioData(audioBytes, newContext, 24000, 1);
      
      const newSource = newContext.createBufferSource();
      newSource.buffer = audioBuffer;
      newSource.connect(newContext.destination);
      newSource.start();
      audioSourceRef.current = newSource;
      setIsPlaying(true);

      newSource.onended = () => {
        setIsPlaying(false);
        // Clean up only the source, context might be reused
        if (audioSourceRef.current) {
            audioSourceRef.current.disconnect();
            audioSourceRef.current = null;
        }
      };
    } catch (error) {
      console.error("Failed to play audio:", error);
      alert("Sorry, couldn't play the audio for the reading.");
    } finally {
      setIsDecoding(false);
    }
  }, [audioData, isPlaying, cleanup]);

  const isLoading = isGeneratingAudio || isDecoding;

  return (
    <button
      onClick={handlePlay}
      disabled={isLoading || !audioData}
      className="p-2 rounded-full text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={isPlaying ? 'Stop reading' : 'Listen to reading'}
    >
      {isLoading ? (
        <svg className="h-6 w-6 animate-spin" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : isPlaying ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M8 5v14l11-7z"/>
        </svg>
      )}
    </button>
  );
};

export default AudioPlayer;
