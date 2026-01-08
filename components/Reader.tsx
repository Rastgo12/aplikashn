
import React, { useEffect, useState, useMemo } from 'react';
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
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p')) {
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
      }
    };

    let timeout: number;
    const resetTimer = () => {
      setShowHeader(true);
      clearTimeout(timeout);
      timeout = window.setTimeout(() => setShowHeader(false), 3000);
    };

    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('touchstart', resetTimer);

    resetTimer();

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
      clearTimeout(timeout);
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

  const handleExit = () => {
    navigate(`/manhua/${manhuaId}`);
  };

  const goToChapter = (id: string, isPrem: boolean) => {
    if (isPrem && !user.isPremium) {
      alert("ئەم چاپتەرە پریمیۆمە! تکایە ئەکاونتەکەت چالاک بکە.");
      return;
    }
    navigate(`/reader/${manhuaId}/${id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div 
      className="relative min-h-screen bg-black overflow-x-hidden select-none cursor-default"
      onDoubleClick={handleExit}
    >
      {/* Invisible Watermark */}
      <div className="fixed inset-0 pointer-events-none z-50 flex flex-wrap opacity-[0.02] overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="p-24 text-white font-black rotate-[-35deg] whitespace-nowrap text-lg">
            {user.email} • {user.id}
          </div>
        ))}
      </div>

      {showWarning && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-8 py-4 rounded-full font-black shadow-[0_0_50px_rgba(220,38,38,0.5)] animate-bounce border-2 border-white/20">
          ⚠️ سکرین شۆتکردن قەدەغەیە!
        </div>
      )}

      {/* Header */}
      <div className={`fixed top-0 inset-x-0 z-[70] bg-black/60 backdrop-blur-xl border-b border-white/5 p-4 flex justify-between items-center transition-transform duration-500 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        <button onClick={handleExit} className="text-white hover:text-indigo-400 p-2"><span className="text-2xl">←</span></button>
        <div className="text-center">
          <h2 className="font-black text-[10px] truncate max-w-[150px] text-white/90">{manhua.title}</h2>
          <p className="text-indigo-500 text-[9px] font-black uppercase tracking-widest mt-0.5">#{chapter.number}: {chapter.title}</p>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Pages */}
      <div className="w-full flex flex-col items-center">
        {chapter.pages.map((p, idx) => (
          <div key={idx} className="relative w-full">
            <img 
              src={p} 
              className="w-full h-auto block" 
              alt=""
              onContextMenu={(e) => e.preventDefault()}
              loading={idx < 2 ? "eager" : "lazy"}
            />
            <button
              onClick={(e) => handleToggleBookmark(idx, e)}
              className={`absolute top-4 left-4 p-2 rounded-xl backdrop-blur-md border border-white/10 transition-all z-10 ${isBookmarked(idx) ? 'bg-amber-500 text-white opacity-100' : 'bg-black/20 text-white/40 opacity-0 group-hover:opacity-100'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Compact Navigation Row */}
      <div className="bg-black py-16 px-4 flex flex-col items-center gap-8">
        <div className="flex items-center justify-center gap-2 w-full">
          {chapterNav.prev && (
            <button 
              onClick={() => goToChapter(chapterNav.prev!.id, chapterNav.prev!.isPremium)}
              className="flex-1 max-w-[140px] flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:border-indigo-500 hover:text-white transition-all active:scale-95"
            >
              <span className="text-sm">←</span>
              <span className="text-[10px] font-black uppercase">پێشوو</span>
            </button>
          )}

          {chapterNav.next && (
            <button 
              onClick={() => goToChapter(chapterNav.next!.id, chapterNav.next!.isPremium)}
              className="flex-1 max-w-[140px] flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-indigo-600 border border-indigo-400 text-white shadow-lg active:scale-95 transition-all"
            >
              <span className="text-[10px] font-black uppercase">دواتر</span>
              <span className="text-sm">→</span>
              {chapterNav.next.isPremium && <span className="text-[8px] bg-amber-400 text-black px-1 rounded ml-1">🔒</span>}
            </button>
          )}
        </div>
        <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.6em]">KURDMANHUA SECURE</p>
      </div>
    </div>
  );
};

export default Reader;
