
import React from 'react';
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

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="container mx-auto px-4 h-20 md:h-16 flex flex-col md:flex-row items-center justify-between py-2 md:py-0 gap-2 md:gap-0">
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <Link to="/" className="text-2xl font-black text-indigo-500 tracking-tighter shrink-0">
            KURD<span className="text-white">MANHUA</span>
          </Link>
          
          <div className="flex items-center gap-3 md:hidden">
            <button 
              onClick={onLogout}
              className="p-2 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20"
              title="چوونە دەرەوە"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
            <Link to="/profile">
              <img src={user.avatar} className="w-8 h-8 rounded-full border border-slate-700" alt="Avatar" />
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:max-w-xs lg:max-w-md mx-0 md:mx-4">
          <span className="absolute inset-y-0 right-3 flex items-center pl-3 pointer-events-none text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="بگەڕێ بۆ ناونیشانی مانهوا..."
            className="w-full bg-slate-800/50 border border-slate-700 text-sm rounded-xl py-2 pr-10 pl-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-500"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 md:gap-6 overflow-x-auto w-full md:w-auto no-scrollbar">
          <Link 
            to="/" 
            className={`whitespace-nowrap hover:text-indigo-400 transition text-sm md:text-base ${location.pathname === '/' ? 'text-indigo-400 font-bold' : ''}`}
          >
            سەرەکی
          </Link>
          <Link 
            to="/profile" 
            className={`whitespace-nowrap hover:text-indigo-400 transition text-sm md:text-base ${location.pathname === '/profile' ? 'text-indigo-400 font-bold' : ''}`}
          >
            پڕۆفایل
          </Link>
          {(user.role === 'SUPER_ADMIN' || user.role === 'EDITOR') && (
            <Link 
              to="/admin" 
              className="whitespace-nowrap text-slate-400 hover:text-white text-xs md:text-sm"
            >
              کۆنترۆڵ
            </Link>
          )}
          
          <div className="hidden md:flex items-center gap-3">
             <Link to="/profile" className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 transition rounded-full pl-1 pr-4 py-1 shrink-0 cursor-pointer">
               <div className="text-right">
                  <p className="text-xs font-bold truncate max-w-[80px]">{user.name}</p>
                  <p className={`text-[10px] ${user.isPremium ? 'text-amber-400' : 'text-slate-400'}`}>
                    {user.isPremium ? 'پریمیۆم 👑' : 'بەکارهێنەر'}
                  </p>
               </div>
               <img src={user.avatar} className="w-8 h-8 rounded-full border border-slate-700" alt="Avatar" />
             </Link>
             <button 
               onClick={onLogout}
               className="p-2 text-slate-500 hover:text-red-500 transition-colors"
               title="چوونە دەرەوە"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
               </svg>
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
