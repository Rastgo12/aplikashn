
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Manhua } from '../types';

interface Props {
  manhua: Manhua;
}

const ManhuaCard: React.FC<Props> = ({ manhua }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/manhua/${manhua.id}`)}
      className="relative bg-slate-900 rounded-[32px] overflow-hidden cursor-pointer group border border-slate-800 hover:border-indigo-500/50 transition-all duration-500 shadow-xl"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={manhua.coverImage} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          alt={manhua.title} 
        />
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-2xl text-[10px] font-black flex items-center gap-1.5 border border-white/5 shadow-xl">
          <span className="text-amber-400">⭐</span>
          <span>{manhua.rating}</span>
        </div>

        {/* Categories Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{manhua.category}</p>
           <h3 className="font-black text-sm text-white leading-tight truncate">{manhua.title}</h3>
        </div>

        {/* Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
           <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
           </div>
        </div>
      </div>
      
      <div className="p-4 bg-slate-900 group-hover:bg-slate-800 transition-colors">
        <h3 className="font-bold text-xs mb-1 truncate text-slate-200 group-hover:text-white">{manhua.title}</h3>
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
           <span>{manhua.chapters?.length || 0} چاپتەر</span>
           <span className="flex items-center gap-1">👁️ {manhua.views || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default ManhuaCard;
