
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  onSearch: (term: string) => void;
  searchTerm: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onSearch, searchTerm }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${scrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-2xl font-black text-indigo-500 tracking-tighter shrink-0 flex items-center gap-2">
            <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-base">M</span>
            KURD<span className="text-white">MANHUA</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-400">
            <Link to="/" className={`hover:text-white transition ${location.pathname === '/' ? 'text-white' : ''}`}>سەرەکی</Link>
            <Link to="/profile" className={`hover:text-white transition ${location.pathname === '/profile' ? 'text-white' : ''}`}>دڵخوازەکان</Link>
            <a href="#" className="hover:text-white transition">مانگا</a>
            <a href="#" className="hover:text-white transition">نوێترینەکان</a>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-10 hidden md:block">
          <div className="relative group">
            <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="بگەڕێ بۆ ناونیشانی مانھوا..."
              className="w-full bg-slate-900/50 border border-slate-800 text-sm rounded-2xl py-3 pr-12 pl-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-slate-900 outline-none transition-all placeholder:text-slate-500"
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/profile" className="flex items-center gap-3 bg-slate-900/50 hover:bg-slate-800 transition rounded-2xl pl-2 pr-4 py-2 border border-slate-800 shrink-0">
             <div className="text-right hidden sm:block">
                <p className="text-xs font-black truncate max-w-[100px]">{user.name}</p>
                <p className={`text-[9px] font-bold ${user.isPremium ? 'text-amber-400' : 'text-slate-500'}`}>
                  {user.isPremium ? '👑 PREMIUM' : 'FREE USER'}
                </p>
             </div>
             <img src={user.avatar} className="w-8 h-8 rounded-xl border border-slate-700 shadow-lg" alt="Avatar" />
          </Link>
          
          {(user.role === 'SUPER_ADMIN' || user.role === 'EDITOR') && (
            <Link 
              to="/admin" 
              className="p-3 bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition hover:bg-slate-700 hidden sm:block"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          )}

          <button onClick={onLogout} className="p-3 text-slate-500 hover:text-red-500 transition">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
             </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
