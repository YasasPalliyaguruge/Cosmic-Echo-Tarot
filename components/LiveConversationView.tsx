import React, { useEffect, useState } from 'react';
import useLiveConversation from '../hooks/useLiveConversation';

interface LiveConversationViewProps {
  onClose: () => void;
}

const LiveConversationView: React.FC<LiveConversationViewProps> = ({ onClose }) => {
  const { start, stop, isConnected, isConnecting, userTranscript, modelTranscript, error } = useLiveConversation();
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (hasStarted) {
      start();
    }
    return () => {
      stop();
    };
  }, [hasStarted]);

  const handleToggleConnection = () => {
    if(isConnected || isConnecting) {
        stop();
        setHasStarted(false);
    } else {
        setHasStarted(true);
    }
  };

  const buttonText = isConnecting ? "Connecting..." : isConnected ? "End Conversation" : "Start Conversation";

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-4 text-center">
      <button onClick={onClose} className="absolute top-4 right-4 text-4xl text-slate-400 hover:text-white transition-colors">&times;</button>
      
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-indigo-300 mb-2">Speak with Aura</h2>
        <p className="text-slate-400">Have a natural conversation about your path.</p>
      </div>

      <div className="relative w-48 h-48 flex items-center justify-center mb-8">
        <div className={`absolute inset-0 bg-indigo-500/20 rounded-full transition-transform duration-500 ${isConnected ? 'animate-pulse scale-100' : 'scale-0'}`}></div>
        <div className={`absolute inset-2 bg-indigo-500/20 rounded-full transition-transform duration-500 delay-200 ${isConnected ? 'animate-pulse scale-100' : 'scale-0'}`}></div>
        <div className="relative z-10 w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-700">
           <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 transition-colors duration-300 ${isConnected ? 'text-indigo-400' : 'text-slate-500'}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"/>
           </svg>
        </div>
      </div>

      <div className="w-full max-w-2xl h-24 mb-8 text-2xl font-light text-slate-200 flex flex-col justify-center">
        <p className="transition-opacity duration-300" style={{ opacity: userTranscript ? 1 : 0 }}>
          <span className="text-slate-400">You: </span>{userTranscript}
        </p>
        <p className="transition-opacity duration-300" style={{ opacity: modelTranscript ? 1 : 0 }}>
          <span className="text-indigo-300">Aura: </span>{modelTranscript}
        </p>
      </div>

      <button
        onClick={handleToggleConnection}
        disabled={isConnecting}
        className="px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-lg shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
      >
        {buttonText}
      </button>
      {error && <p className="text-red-400 mt-4">{error}</p>}
    </div>
  );
};

export default LiveConversationView;