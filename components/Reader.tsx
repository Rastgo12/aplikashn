
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Manhua, Bookmark, Chapter } from '../types';

interface Props {
  user: User;
  manhuas: Manhua[];
  onToggleBookmark: (bookmark: Bookmark) => void;
}

const Reader: React.FC<Props> = ({ user, manhuas, onToggleBookmark }) => {
  const { manhuaId, chapterId } = useParams();
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const manhua = manhuas.find(m => m.id === manhuaId);
  const chapter = manhua?.chapters.find(c => c.id === chapterId);

  const chapterNav = useMemo(() => {
    if (!manhua || !chapter) return { prev: null, next: null };
    const currentIndex = manhua.chapters.findIndex(c => c.id === chapterId);
    return {
      prev: currentIndex > 0 ? manhua.chapters[currentIndex - 1] : null,
      next: currentIndex < manhua.chapters.length - 1 ? manhua.chapters[currentIndex + 1] : null,
    };
  }, [manhua, chapterId]);

  useEffect(() => {
    if (chapter?.isPremium && !user.isPremium) {
      navigate(`/manhua/${manhuaId}`);
      return;
    }

    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setReadingProgress(scrolled);
      
      // Auto-hide header
      if (winScroll > 100) setShowHeader(false);
      else setShowHeader(true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p') || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('contextmenu', e => e.preventDefault());

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [chapter, user, navigate, manhuaId]);

  if (!chapter || !manhua) return null;

  const isBookmarked = (pageIndex: number) => {
    return (user.bookmarks || []).some(b => 
      b.manhuaId === manhuaId && 
      b.chapterId === chapterId && 
      b.pageIndex === pageIndex
    );
  };

  const handleToggleBookmark = (pageIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleBookmark({
      manhuaId: manhuaId!,
      chapterId: chapterId!,
      pageIndex,
      manhuaTitle: manhua.title,
      chapterTitle: chapter.title,
      addedAt: new Date().toISOString()
    });
  };

  return (
    <div className="relative min-h-screen bg-[#020617] overflow-x-hidden select-none cursor-default">
      {/* Progress Bar */}
      <div className="fixed top-0 inset-x-0 h-1.5 z-[100] bg-white/5">
        <div className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1] transition-all duration-200" style={{ width: `${readingProgress}%` }}></div>
      </div>

      {/* Dynamic Header */}
      <header className={`fixed top-0 inset-x-0 z-[90] bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 p-4 flex justify-between items-center transition-all duration-500 ${showHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <button onClick={() => navigate(`/manhua/${manhuaId}`)} className="bg-slate-900/50 hover:bg-slate-800 p-2.5 rounded-xl text-white transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        
        <div className="text-center">
          <h2 className="font-black text-xs md:text-sm text-white truncate max-w-[200px] mb-0.5">{manhua.title}</h2>
          <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">چاپتەر {chapter.number}: {chapter.title}</p>
        </div>

        <div className="flex items-center gap-2">
           <button onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})} className="bg-slate-900/50 hover:bg-slate-800 p-2.5 rounded-xl text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
              </svg>
           </button>
        </div>
      </header>

      {/* Security Watermark */}
      <div className="fixed inset-0 pointer-events-none z-[80] opacity-[0.03] flex flex-wrap gap-40 rotate-12 scale-150">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="text-white font-black text-2xl whitespace-nowrap">
            {user.email} • ID: {user.id}
          </div>
        ))}
      </div>

      {showWarning && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-red-600 text-white px-10 py-5 rounded-[32px] font-black shadow-2xl animate-bounce border-2 border-white/20">
          ⚠️ ئاگاداری: سکرین شۆتکردن قەدەغەیە و دەبێتە هۆی قفڵکردنی ئەکاونتەکەت!
        </div>
      )}

      {/* Pages Container */}
      <div className="max-w-[900px] mx-auto pt-24 pb-40 px-0 md:px-4 space-y-0.5 md:space-y-4">
        {chapter.pages.map((p, idx) => (
          <div key={idx} className="relative group overflow-hidden md:rounded-[24px] shadow-2xl border border-white/5">
            <img 
              src={p} 
              className="w-full h-auto block" 
              alt={`Page ${idx + 1}`}
              loading={idx < 3 ? "eager" : "lazy"}
              onContextMenu={e => e.preventDefault()}
            />
            
            {/* Page Watermark Overlay (very subtle) */}
            <div className="absolute inset-x-0 bottom-4 text-center opacity-10 pointer-events-none text-[8px] font-bold text-white uppercase tracking-[1em]">
               KURDMANHUA PROTECTED CONTENT
            </div>

            <button
              onClick={(e) => handleToggleBookmark(idx, e)}
              className={`absolute top-6 left-6 p-4 rounded-2xl backdrop-blur-xl border border-white/10 transition-all z-10 shadow-2xl ${isBookmarked(idx) ? 'bg-amber-500 text-white opacity-100 scale-100' : 'bg-black/40 text-white/50 opacity-0 group-hover:opacity-100 scale-75'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </button>
          </div>
        ))}

        {/* Navigation Section */}
        <div className="pt-20 pb-10 flex flex-col items-center gap-12 text-center">
           <div className="w-16 h-1 w-20 bg-indigo-500/20 rounded-full"></div>
           
           <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-md">
             {chapterNav.prev && (
               <button 
                 onClick={() => {
                   if (chapterNav.prev!.isPremium && !user.isPremium) return alert("ئەم چاپتەرە پریمیۆمە!");
                   navigate(`/reader/${manhuaId}/${chapterNav.prev!.id}`);
                   window.scrollTo(0, 0);
                 }}
                 className="w-full bg-slate-900 border border-slate-800 hover:border-indigo-500 p-5 rounded-[32px] font-black transition-all flex items-center justify-center gap-3 text-slate-300"
               >
                 <span className="text-xl">←</span>
                 <span>چاپتەری پێشوو</span>
               </button>
             )}

             {chapterNav.next && (
               <button 
                 onClick={() => {
                   if (chapterNav.next!.isPremium && !user.isPremium) return alert("ئەم چاپتەرە پریمیۆمە!");
                   navigate(`/reader/${manhuaId}/${chapterNav.next!.id}`);
                   window.scrollTo(0, 0);
                 }}
                 className="w-full bg-indigo-600 hover:bg-indigo-500 p-5 rounded-[32px] font-black transition-all flex items-center justify-center gap-3 text-white shadow-2xl shadow-indigo-600/20"
               >
                 <span>چاپتەری دواتر</span>
                 <span className="text-xl">→</span>
                 {chapterNav.next.isPremium && <span className="text-xs bg-amber-400 text-black px-2 py-0.5 rounded-lg shadow-md">🔒</span>}
               </button>
             )}
           </div>

           {!chapterNav.next && (
             <div className="bg-slate-900/50 p-10 rounded-[48px] border border-slate-800 border-dashed">
                <h3 className="text-2xl font-black mb-2">گەیشتیتە کۆتایی!</h3>
                <p className="text-slate-500 text-sm">چاوەڕوانی نوێکردنەوە بن بۆ چاپتەرەکانی تر.</p>
                <button 
                  onClick={() => navigate(`/manhua/${manhuaId}`)}
                  className="mt-6 bg-slate-800 hover:bg-slate-700 px-8 py-3 rounded-2xl font-bold transition"
                >
                  گەڕانەوە بۆ مانیفێست
                </button>
             </div>
           )}

           <div className="text-slate-800 font-black text-[10px] uppercase tracking-[1em] mt-10">
              KURDMANHUA • OFFICIALLY SECURED
           </div>
        </div>
      </div>
    </div>
  );
};

export default Reader;
