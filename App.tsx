
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, SubscriptionType, UserRole, Manhua, Bookmark, SupportContact } from './types';
import { MOCK_MANHUAS } from './constants';
import { fetchFromGitHub } from './services/githubService';
import Navbar from './components/Navbar';
import ManhuaSlider from './components/ManhuaSlider';
import ManhuaCard from './components/ManhuaCard';
import ManhuaDetail from './components/ManhuaDetail';
import Reader from './components/Reader';
import Profile from './components/Profile';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import GeminiAssistant from './components/GeminiAssistant';

// Scroll to top on page change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [manhuas, setManhuas] = useState<Manhua[]>([]);
  const [supportContacts, setSupportContacts] = useState<SupportContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const getDeviceId = () => {
    let id = localStorage.getItem('kurd_manhua_device_id');
    if (!id) {
      id = 'device_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('kurd_manhua_device_id', id);
    }
    return id;
  };

  const syncData = async () => {
    const ghToken = localStorage.getItem('gh_token');
    const ghRepo = localStorage.getItem('gh_repo');
    
    let initialManhuas = MOCK_MANHUAS;
    let initialContacts: SupportContact[] = [
      { id: '1', name: 'سەرۆک', whatsapp: '07500000000', telegram: 'yeeruru' }
    ];

    if (ghToken && ghRepo) {
      const cloudData = await fetchFromGitHub(ghToken, ghRepo);
      if (cloudData) {
        if (cloudData.manhuas) initialManhuas = cloudData.manhuas;
        if (cloudData.contacts) initialContacts = cloudData.contacts;
        if (cloudData.accounts) localStorage.setItem('kurd_manhua_accounts', JSON.stringify(cloudData.accounts));
      }
    }

    setManhuas(initialManhuas.map(m => ({ 
      ...m, 
      views: m.views || 0, 
      favorites: m.favorites || 0,
      showInSlider: m.showInSlider ?? false
    })));
    setSupportContacts(initialContacts);
  };

  useEffect(() => {
    const initApp = async () => {
      await syncData();

      const savedUser = localStorage.getItem('kurd_manhua_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser) as User;
        if (parsed.deviceId === getDeviceId()) {
          setUser({ ...parsed, favoriteIds: parsed.favoriteIds || [], bookmarks: parsed.bookmarks || [] });
        }
      }
      setLoading(false);
    };

    initApp();
  }, []);

  const handleLogin = (email: string, name: string, password?: string) => {
    const storedAccounts = JSON.parse(localStorage.getItem('kurd_manhua_accounts') || '{}');
    const currentDeviceId = getDeviceId();
    const targetAdminEmail = 'yeeruru@gmail.com';

    if (storedAccounts[email]) {
      const account = storedAccounts[email];
      if (account.password !== password) return alert("وشەی نهێنی هەڵەیە!");
      const userData = { ...account, bookmarks: account.bookmarks || [], favoriteIds: account.favoriteIds || [] };
      setUser(userData);
      localStorage.setItem('kurd_manhua_user', JSON.stringify(userData));
    } else {
      const role = email.toLowerCase() === targetAdminEmail ? UserRole.SUPER_ADMIN : UserRole.USER;
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email, name, password,
        avatar: `https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff`,
        deviceId: currentDeviceId,
        role: role,
        isPremium: role === UserRole.SUPER_ADMIN,
        subscriptionType: role === UserRole.SUPER_ADMIN ? SubscriptionType.ONE_YEAR : SubscriptionType.FREE,
        isApproved: true,
        bookmarks: [],
        favoriteIds: []
      };
      storedAccounts[email] = newUser;
      localStorage.setItem('kurd_manhua_accounts', JSON.stringify(storedAccounts));
      setUser(newUser);
      localStorage.setItem('kurd_manhua_user', JSON.stringify(newUser));
    }
  };

  const updateManhuas = (newManhuas: Manhua[]) => {
    setManhuas(newManhuas);
    // Note: In a real website, this would push to a DB. For this "serverless" version, we rely on Admin to Sync.
    localStorage.setItem('kurd_manhua_data', JSON.stringify(newManhuas));
  };

  const incrementViews = (manhuaId: string) => {
    const updated = manhuas.map(m => m.id === manhuaId ? { ...m, views: (m.views || 0) + 1 } : m);
    setManhuas(updated);
  };

  const toggleFavorite = (manhuaId: string) => {
    if (!user) return;
    const isFavorited = (user.favoriteIds || []).includes(manhuaId);
    const newFavoriteIds = isFavorited 
      ? user.favoriteIds.filter(id => id !== manhuaId) 
      : [...(user.favoriteIds || []), manhuaId];
    
    const updatedUser = { ...user, favoriteIds: newFavoriteIds };
    setUser(updatedUser);
    
    const storedAccounts = JSON.parse(localStorage.getItem('kurd_manhua_accounts') || '{}');
    storedAccounts[user.email] = updatedUser;
    localStorage.setItem('kurd_manhua_accounts', JSON.stringify(storedAccounts));
    localStorage.setItem('kurd_manhua_user', JSON.stringify(updatedUser));

    const updatedManhuas = manhuas.map(m => m.id === manhuaId ? { ...m, favorites: Math.max(0, (m.favorites || 0) + (isFavorited ? -1 : 1)) } : m);
    setManhuas(updatedManhuas);
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#020617] text-white">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h1 className="text-xl font-black tracking-widest animate-pulse">KURDMANHUA</h1>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-500 selection:text-white">
        {user && <Navbar user={user} onLogout={() => { setUser(null); localStorage.removeItem('kurd_manhua_user'); }} onSearch={setSearchTerm} searchTerm={searchTerm} />}
        
        <main className={`${user ? 'pt-6 pb-24' : ''}`}>
          <Routes>
            <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
            
            <Route path="/" element={user ? (
              <div className="container mx-auto px-4 space-y-16 animate-in fade-in duration-700">
                {!searchTerm && <ManhuaSlider manhuas={manhuas} />}
                
                <section>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-black flex items-center gap-3">
                      <span className="w-2 h-10 bg-indigo-500 rounded-full"></span>
                      {searchTerm ? `ئەنجامەکانی گەڕان: ${searchTerm}` : 'نوێترین مانھواکان'}
                    </h2>
                    {!searchTerm && (
                      <div className="flex gap-2">
                        <span className="bg-slate-800 px-3 py-1 rounded-full text-[10px] font-bold text-slate-400">هەمووی</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {manhuas
                      .filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(m => <ManhuaCard key={m.id} manhua={m} />)
                    }
                  </div>

                  {manhuas.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                    <div className="text-center py-20 bg-slate-900/50 rounded-[40px] border border-dashed border-slate-800">
                      <p className="text-slate-500 font-bold">ببورە، هیچ مانھوایەک بەو ناوە نەدۆزرایەوە.</p>
                    </div>
                  )}
                </section>

                {!searchTerm && (
                  <section className="bg-gradient-to-r from-indigo-900/20 to-slate-900/20 p-8 md:p-12 rounded-[48px] border border-indigo-500/10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl text-center md:text-right">
                      <h2 className="text-3xl font-black mb-4">ئەکاونتەکەت بکە بە <span className="text-amber-400">پریمیۆم</span></h2>
                      <p className="text-slate-400 leading-relaxed mb-6">بە پریمیۆمکردنی ئەکاونتەکەت دەتوانیت زووتر چاپتەرەکان ببینی و پشتگیری تیمی وەرگێڕان بکەیت بۆ بەردەوامبوون.</p>
                      <button 
                        onClick={() => window.location.hash = '#/profile'} 
                        className="bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-2xl font-black shadow-xl transition transform active:scale-95"
                      >
                        پلانی پریمیۆم ببینە
                      </button>
                    </div>
                    <div className="text-8xl opacity-20 md:opacity-100">👑</div>
                  </section>
                )}
                
                <GeminiAssistant />
              </div>
            ) : <Navigate to="/login" />} />

            <Route path="/manhua/:id" element={<ManhuaDetail user={user!} manhuas={manhuas} onIncrementViews={incrementViews} onToggleFavorite={toggleFavorite} />} />
            <Route path="/reader/:manhuaId/:chapterId" element={<Reader user={user!} manhuas={manhuas} onToggleBookmark={() => {}} />} />
            <Route path="/profile" element={<Profile user={user!} manhuas={manhuas} onUpdateSub={() => {}} supportContacts={supportContacts} onLogout={() => {setUser(null); localStorage.removeItem('kurd_manhua_user');}} />} />
            <Route path="/admin" element={user?.role === UserRole.SUPER_ADMIN ? <AdminPanel manhuas={manhuas} onUpdateManhuas={updateManhuas} currentUser={user!} supportContacts={supportContacts} onUpdateSupportContacts={() => {}} /> : <Navigate to="/" />} />
          </Routes>
        </main>

        {user && (
          <footer className="mt-20 border-t border-slate-900 py-12 bg-slate-950/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-right">
                <h3 className="text-xl font-black text-indigo-500 mb-2">KURD<span className="text-white">MANHUA</span></h3>
                <p className="text-slate-500 text-sm">گەورەترین پلاتفۆرمی کوردی بۆ خوێندنەوەی مانھوا.</p>
              </div>
              <div className="flex gap-8 text-xs font-bold text-slate-500">
                <a href="#" className="hover:text-indigo-400 transition">یاسا و مەرجەکان</a>
                <a href="#" className="hover:text-indigo-400 transition">پەیوەندی</a>
                <a href="#" className="hover:text-indigo-400 transition">دەربارەی ئێمە</a>
              </div>
              <div className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                © 2025 KurdManhua Team
              </div>
            </div>
          </footer>
        )}
      </div>
    </Router>
  );
};

export default App;
