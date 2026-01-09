
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Manhua } from '../types';

interface Props {
  manhuas: Manhua[];
}

const ManhuaSlider: React.FC<Props> = ({ manhuas }) => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const sliderItems = useMemo(() => {
    const filtered = manhuas.filter(m => m.showInSlider);
    return filtered.length > 0 ? filtered : manhuas.slice(0, 3);
  }, [manhuas]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % sliderItems.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [sliderItems.length]);

  const current = sliderItems[index];
  if (!current) return null;

  return (
    <div className="relative h-[400px] md:h-[600px] w-full rounded-[48px] overflow-hidden group mt-24">
      {/* Background with Blur for wide screens */}
      <img 
        key={current.id + '-bg'}
        src={current.coverImage} 
        alt="" 
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-3xl opacity-30"
      />
      
      {/* Main Image */}
      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-12">
        <div className="relative w-full h-full rounded-[36px] overflow-hidden shadow-2xl border border-white/5">
          <img 
            key={current.id}
            src={current.coverImage} 
            alt={current.title} 
            className="w-full h-full object-cover animate-in fade-in zoom-in-110 duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          
          <div className="absolute bottom-0 right-0 p-8 md:p-16 w-full md:w-3/4 text-right animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-indigo-600 text-[10px] md:text-xs px-4 py-1.5 rounded-full font-black uppercase tracking-widest shadow-lg">نوێکراوەتەوە</span>
              <span className="bg-amber-500/20 text-amber-500 text-[10px] md:text-xs px-4 py-1.5 rounded-full font-black uppercase tracking-widest border border-amber-500/20">گرینگترین</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black mb-6 leading-tight drop-shadow-2xl">{current.title}</h1>
            <p className="text-slate-300 line-clamp-2 mb-8 text-sm md:text-lg max-w-2xl leading-relaxed drop-shadow-md">{current.description}</p>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(`/manhua/${current.id}`)}
                className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-black hover:bg-indigo-600 hover:text-white transition-all transform active:scale-95 shadow-2xl flex items-center gap-3"
              >
                <span>خوێندنەوەی ئێستا</span>
                <span className="text-xl">→</span>
              </button>
              <button 
                onClick={() => navigate(`/manhua/${current.id}`)}
                className="bg-slate-900/50 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-black border border-white/10 hover:bg-white/10 transition-all"
              >
                زانیاری زیاتر
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
         {sliderItems.map((_, i) => (
           <button 
             key={i} 
             onClick={() => setIndex(i)}
             className={`h-2 rounded-full transition-all duration-500 ${i === index ? 'w-10 bg-indigo-500 shadow-[0_0_15px_#6366f1]' : 'w-2 bg-white/30 hover:bg-white/50'}`}
           />
         ))}
      </div>

      {/* Arrows */}
      <div className="absolute inset-y-0 left-8 md:left-20 flex items-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
         <button onClick={() => setIndex((index - 1 + sliderItems.length) % sliderItems.length)} className="w-14 h-14 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors shadow-2xl">
           <span className="text-2xl text-white">←</span>
         </button>
      </div>
    </div>
  );
};

export default ManhuaSlider;
