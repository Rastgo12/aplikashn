
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Manhua } from '../types';

interface Props {
  user: User;
  manhuas: Manhua[];
  onIncrementViews: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const ManhuaDetail: React.FC<Props> = ({ user, manhuas, onIncrementViews, onToggleFavorite }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const manhua = manhuas.find(m => m.id === id);

  useEffect(() => {
    if (manhua) {
      onIncrementViews(manhua.id);
    }
  }, [id]);

  if (!manhua) return <div className="p-10 text-center">ببورە، ئەم مانھوایە نەدۆزرایەوە.</div>;

  const isFavorited = user.favoriteIds.includes(manhua.id);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="relative shrink-0">
          <img src={manhua.coverImage} className="w-full md:w-64 aspect-[3/4] object-cover rounded-2xl shadow-2xl" alt="" />
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className="bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-700 shadow-xl flex items-center gap-2">
              <span className="text-amber-400">⭐</span> {manhua.rating}
            </div>
            <div className="bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-700 shadow-xl flex items-center gap-2">
              <span className="text-indigo-400">👁️</span> {manhua.views || 0}
            </div>
            <div className="bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-700 shadow-xl flex items-center gap-2">
              <span className="text-red-500">❤️</span> {manhua.favorites || 0}
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <h1 className="text-4xl font-black mb-4 leading-tight">{manhua.title}</h1>
          <div className="flex flex-wrap gap-4 mb-6">
            <span className="bg-slate-800 px-4 py-1.5 rounded-xl text-xs font-bold text-indigo-400 border border-slate-700/50">{manhua.category}</span>
          </div>
          <p className="text-slate-300 leading-relaxed mb-8 text-sm md:text-base">{manhua.description}</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {manhua.chapters.length > 0 && (
              <button 
                 onClick={() => navigate(`/reader/${manhua.id}/${manhua.chapters[0].id}`)}
                 className="flex-1 bg-indigo-600 px-10 py-4 rounded-2xl font-black hover:bg-indigo-700 transition active:scale-95 shadow-xl shadow-indigo-600/20"
              >
                خوێندنەوەی ئێستا
              </button>
            )}
            <button 
              onClick={() => onToggleFavorite(manhua.id)}
              className={`flex-1 px-6 py-4 rounded-2xl font-bold transition flex items-center justify-center gap-2 border ${
                isFavorited 
                  ? 'bg-red-600/10 border-red-500 text-red-500 hover:bg-red-600/20' 
                  : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <span className="text-lg">{isFavorited ? '❤️' : '🤍'}</span>
              {isFavorited ? 'لە لیستی دڵخوازە' : 'زیادکردن بۆ دڵخواز'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-[32px] p-6 md:p-8 border border-slate-700 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
          هەموو چاپتەرەکان ({manhua.chapters.length})
        </h2>
        <div className="space-y-3">
          {manhua.chapters.length === 0 && (
            <div className="text-center py-10">
              <p className="text-slate-500 mb-2">هیچ چاپتەرێک بەردەست نییە هێشتا.</p>
            </div>
          )}
          {manhua.chapters.map(ch => {
            const isLocked = ch.isPremium && !user.isPremium;
            return (
              <div 
                key={ch.id}
                onClick={() => !isLocked && navigate(`/reader/${manhua.id}/${ch.id}`)}
                className={`flex items-center justify-between p-4 md:p-5 rounded-2xl border transition-all duration-300 ${
                  isLocked 
                    ? 'bg-slate-900/50 border-slate-800 opacity-60 cursor-not-allowed' 
                    : 'bg-slate-800 border-slate-700 hover:border-indigo-500/50 hover:bg-slate-700/50 cursor-pointer shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg font-black text-slate-500">#{ch.number}</span>
                  <span className="font-bold text-sm md:text-base">{ch.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  {ch.isPremium && (
                    <span className="bg-amber-500/10 text-amber-500 text-[10px] font-black px-2.5 py-1 rounded-lg border border-amber-500/20">PREMIUM</span>
                  )}
                  {isLocked ? (
                    <span className="text-slate-500 flex items-center gap-1 text-xs">
                      🔒 قفڵکراوە
                    </span>
                  ) : (
                    <span className="text-indigo-400 font-bold text-xs flex items-center gap-1">
                      خوێندنەوە <span className="text-sm">→</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ManhuaDetail;
