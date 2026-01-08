
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
      className="bg-slate-800 rounded-2xl overflow-hidden cursor-pointer group hover:-translate-y-2 transition-all duration-300 border border-slate-700/50 hover:border-indigo-500/50"
    >
      <div className="relative aspect-[3/4]">
        <img src={manhua.coverImage} className="w-full h-full object-cover" alt={manhua.title} />
        <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold">
          ⭐ {manhua.rating}
        </div>
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <span className="bg-indigo-600 px-4 py-2 rounded-lg text-sm font-bold scale-75 group-hover:scale-100 transition-transform">بێنە</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-sm mb-1 truncate">{manhua.title}</h3>
        <p className="text-slate-400 text-xs">{manhua.category}</p>
      </div>
    </div>
  );
};

export default ManhuaCard;
