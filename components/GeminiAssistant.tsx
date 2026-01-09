
import React, { useState } from 'react';
import { getManhuaRecommendation } from '../services/geminiService';

const GeminiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const text = await getManhuaRecommendation(query);
    setResult(text || '');
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="bg-slate-800 border border-slate-700 w-80 md:w-96 rounded-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          <div className="bg-indigo-600 p-4 flex justify-between items-center">
            <h3 className="font-black text-sm flex items-center gap-2">
              <span>✨</span> یاریدەدەری زیرەک
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">✕</button>
          </div>
          <div className="p-4 space-y-4">
            <div className="bg-slate-900 rounded-2xl p-3 min-h-[100px] max-h-60 overflow-y-auto text-xs leading-relaxed text-slate-300">
              {loading ? <div className="animate-pulse">خەریکی بیرکردنەوەم...</div> : (result || "چی جۆرە مانهوایەکت دەوێت؟ بۆم بنووسە تا پێشنیارت بۆ بکەم.")}
            </div>
            <div className="flex gap-2">
              <input 
                value={query} 
                onChange={e => setQuery(e.target.value)}
                placeholder="بنووسە (بۆ نموونە: ئاکشن)..." 
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
              />
              <button 
                onClick={handleAsk}
                disabled={loading}
                className="bg-indigo-600 px-4 py-2 rounded-xl text-xs font-bold"
              >
                بپرسە
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform border-4 border-slate-900"
        >
          ✨
        </button>
      )}
    </div>
  );
};

export default GeminiAssistant;
