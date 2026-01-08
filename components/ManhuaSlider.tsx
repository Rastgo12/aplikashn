
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Manhua } from '../types';

interface Props {
  manhuas: Manhua[];
}

const ManhuaSlider: React.FC<Props> = ({ manhuas }) => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  // Only show manhuas marked for slider
  const sliderItems = useMemo(() => {
    const filtered = manhuas.filter(m => m.showInSlider);
    return filtered.length > 0 ? filtered : manhuas.slice(0, 3); // Fallback to first 3 if none selected
  }, [manhuas]);

  const current = sliderItems[index];

  if (!current) return null;

  const nextSlide = () => setIndex((index + 1) % sliderItems.length);
  const prevSlide = () => setIndex((index - 1 + sliderItems.length) % sliderItems.length);

  return (
    <div className="relative h-64 md:h-[450px] rounded-3xl overflow-hidden group shadow-2xl">
      <img 
        src={current.coverImage} 
        alt={current.title} 
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
      
      <div className="absolute bottom-0 right-0 p-8 md:p-12 w-full md:w-2/3 animate-in fade-in slide-in-from-right-10 duration-700">
        <span className="bg-indigo-600 text-[10px] md:text-xs px-3 py-1 rounded-full font-black mb-4 inline-block uppercase tracking-widest shadow-lg">تایبەت</span>
        <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight drop-shadow-lg">{current.title}</h1>
        <p className="text-slate-300 line-clamp-2 mb-6 text-sm md:text-base max-w-xl">{current.description}</p>
        <button 
          onClick={() => navigate(`/manhua/${current.id}`)}
          className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-black hover:bg-indigo-600 hover:text-white transition-all transform active:scale-95 shadow-xl"
        >
          ئێستا بخوێنەرەوە
        </button>
      </div>

      {sliderItems.length > 1 && (
        <div className="absolute bottom-10 left-10 flex gap-3">
           <button onClick={prevSlide} className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-indigo-600 transition-all flex items-center justify-center border border-white/10 shadow-lg group">
             <span className="group-hover:scale-125 transition-transform text-lg">←</span>
           </button>
           <button onClick={nextSlide} className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-indigo-600 transition-all flex items-center justify-center border border-white/10 shadow-lg group">
             <span className="group-hover:scale-125 transition-transform text-lg">→</span>
           </button>
        </div>
      )}

      {/* Slide Indicators */}
      <div className="absolute top-10 left-10 flex gap-2">
         {sliderItems.map((_, i) => (
           <div 
             key={i} 
             className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]' : 'w-2 bg-white/30'}`}
           />
         ))}
      </div>
    </div>
  );
};

export default ManhuaSlider;
