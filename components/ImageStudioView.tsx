
import React, { useState, useRef } from 'react';
import { Theme } from '../types';
import { generateImage, editImage } from '../services/geminiService';
import { blobToBase64 } from '../utils/image';

interface ImageStudioViewProps {
  theme: Theme;
}

const ASPECT_RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:4"];

const ImageStudioView: React.FC<ImageStudioViewProps> = ({ theme }) => {
  const [mode, setMode] = useState<'generate' | 'edit'>('generate');
  const [prompt, setPrompt] = useState('');
  const [editPrompt, setEditPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageResult, setImageResult] = useState<{ data: string; mimeType: string; } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { classNames: themeClasses } = theme;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setImageResult(null);

    try {
      const base64Data = await generateImage(prompt, aspectRatio);
      setImageResult({ data: base64Data, mimeType: 'image/png' });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEdit = async () => {
    if (!editPrompt.trim() || !imageResult) return;
    setIsLoading(true);
    setError(null);
    
    try {
        const base64Data = await editImage(imageResult.data, imageResult.mimeType, editPrompt);
        setImageResult({ data: base64Data, mimeType: 'image/png' }); // Gemini API often returns PNG
        setEditPrompt('');
    } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setError(null);
      try {
        const base64Data = await blobToBase64(file);
        setImageResult({ data: base64Data, mimeType: file.type });
        setMode('edit');
      } catch (e) {
        setError("Failed to load image. Please try another file.");
      } finally {
          setIsLoading(false);
          // Reset file input value to allow re-uploading the same file
          if (fileInputRef.current) {
              fileInputRef.current.value = '';
          }
      }
    }
  };
  
  const switchToEditMode = () => {
      if(imageResult) {
          setMode('edit');
      }
  }

  const imageToDisplay = imageResult ? `data:${imageResult.mimeType};base64,${imageResult.data}` : null;

  return (
    <div className="flex flex-col items-center animate-fade-in-up">
      <h2 className={`text-4xl md:text-5xl font-bold ${themeClasses.textPrimary} mb-4`}>Image Studio</h2>
      <p className={`text-lg ${themeClasses.textSecondary} mb-8 max-w-2xl text-center`}>
        Create and transform visions with the power of AI. Generate new worlds or modify your own images with a few words.
      </p>

      <div className="w-full max-w-4xl">
        <div className={`flex space-x-1 p-1 rounded-lg mb-6 max-w-xs mx-auto ${themeClasses.cardBackground} border ${themeClasses.cardBorder}`}>
            <button onClick={() => setMode('generate')} className={`w-full py-2 rounded ${mode === 'generate' ? `${themeClasses.button} text-white` : `${themeClasses.textSecondary} hover:bg-slate-500/10`} transition-colors`}>Generate</button>
            <button onClick={() => setMode('edit')} className={`w-full py-2 rounded ${mode === 'edit' ? `${themeClasses.button} text-white` : `${themeClasses.textSecondary} hover:bg-slate-500/10`} transition-colors`}>Edit</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className={`relative w-full aspect-[${aspectRatio.replace(':', '/')}] ${themeClasses.cardBackground} border ${themeClasses.cardBorder} rounded-xl flex items-center justify-center p-4 transition-all duration-300`}>
                {isLoading && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-xl z-10">
                        <div className="w-12 h-12 border-4 border-t-4 border-t-pink-400 border-slate-600 rounded-full animate-spin"></div>
                        <p className={`${themeClasses.textSecondary} mt-4`}>Conjuring visuals...</p>
                    </div>
                )}
                {imageToDisplay ? (
                    <img src={imageToDisplay} alt="Generated or uploaded art" className="object-contain w-full h-full rounded-md"/>
                ) : (
                    <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${themeClasses.textSecondary} mx-auto`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <p className={`${themeClasses.textSecondary} mt-2`}>Your image will appear here</p>
                    </div>
                )}
            </div>

            <div className={`${themeClasses.cardBackground} border ${themeClasses.cardBorder} rounded-xl p-6`}>
                {mode === 'generate' ? (
                    <div className="space-y-6">
                        <div>
                            <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>Prompt</label>
                            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="A celestial fox drinking from a nebula..." rows={4} className={`w-full bg-slate-700/50 border ${themeClasses.cardBorder} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pink-400`}></textarea>
                        </div>
                        <div>
                            <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>Aspect Ratio</label>
                            <div className="grid grid-cols-5 gap-2">
                                {ASPECT_RATIOS.map(ratio => (
                                    <button key={ratio} onClick={() => setAspectRatio(ratio)} className={`py-2 text-sm rounded-md ${aspectRatio === ratio ? `${themeClasses.button} text-white` : `bg-slate-700/50 ${themeClasses.textSecondary} hover:bg-slate-700`} transition-colors`}>{ratio}</button>
                                ))}
                            </div>
                        </div>
                        <button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className={`w-full py-3 font-bold text-white ${themeClasses.button} ${themeClasses.buttonHover} rounded-lg shadow-lg shadow-pink-600/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}>
                            Generate Image
                        </button>
                        {imageResult && <button onClick={switchToEditMode} className={`w-full py-3 font-bold ${themeClasses.textPrimary} bg-slate-500/10 rounded-lg border ${themeClasses.cardBorder} hover:bg-slate-500/20 transition-colors`}>Edit This Image &rarr;</button>}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <h3 className={`text-lg font-semibold ${themeClasses.textPrimary} mb-2`}>Edit your Image</h3>
                            {!imageResult && <p className={`${themeClasses.textSecondary} text-sm`}>Upload an image to get started.</p>}
                        </div>
                         <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg" />
                        <button onClick={() => fileInputRef.current?.click()} disabled={isLoading} className={`w-full py-3 font-bold ${themeClasses.textPrimary} bg-slate-500/10 rounded-lg border ${themeClasses.cardBorder} hover:bg-slate-500/20 transition-colors`}>
                            {imageResult ? 'Upload a Different Image' : 'Upload Image'}
                        </button>
                        
                        {imageResult && (
                             <div>
                                <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>Edit Instruction</label>
                                <textarea value={editPrompt} onChange={e => setEditPrompt(e.target.value)} placeholder="Add a retro film grain effect..." rows={3} className={`w-full bg-slate-700/50 border ${themeClasses.cardBorder} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pink-400`}></textarea>
                            </div>
                        )}
                        <button onClick={handleEdit} disabled={isLoading || !editPrompt.trim() || !imageResult} className={`w-full py-3 font-bold text-white ${themeClasses.button} ${themeClasses.buttonHover} rounded-lg shadow-lg shadow-pink-600/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}>
                            Apply Edit
                        </button>
                    </div>
                )}
                 {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ImageStudioView;
