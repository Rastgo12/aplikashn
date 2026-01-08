
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, SubscriptionType, UserRole, Manhua, Chapter, Bookmark, SupportContact } from './types';
import { MOCK_MANHUAS } from './constants';
import Navbar from './components/Navbar';
import ManhuaSlider from './components/ManhuaSlider';
import ManhuaCard from './components/ManhuaCard';
import ManhuaDetail from './components/ManhuaDetail';
import Reader from './components/Reader';
import Profile from './components/Profile';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [manhuas, setManhuas] = useState<Manhua[]>([]);
  const [supportContacts, setSupportContacts] = useState<SupportContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [trendingFilter, setTrendingFilter] = useState<'day' | 'week' | 'month'>('day');

  const getDeviceId = () => {
    let id = localStorage.getItem('kurd_manhua_device_id');
    if (!id) {
      id = 'device_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('kurd_manhua_device_id', id);
    }
    return id;
  };

  useEffect(() => {
    // Load Manhuas
    const savedManhuas = localStorage.getItem('kurd_manhua_data');
    if (savedManhuas) {
      setManhuas(JSON.parse(savedManhuas));
    } else {
      const initial = MOCK_MANHUAS.map(m => ({ ...m, views: m.views || 0, favorites: m.favorites || 0 }));
      setManhuas(initial);
      localStorage.setItem('kurd_manhua_data', JSON.stringify(initial));
    }

    // Load Support Contacts
    const savedContacts = localStorage.getItem('kurd_manhua_contacts');
    if (savedContacts) {
      setSupportContacts(JSON.parse(savedContacts));
    } else {
      const initialContacts: SupportContact[] = [
        { id: '1', name: 'سەرۆک', whatsapp: '07500000000', telegram: 'yeeruru', messenger: 'yeeruru', viber: '07500000000' }
      ];
      setSupportContacts(initialContacts);
      localStorage.setItem('kurd_manhua_contacts', JSON.stringify(initialContacts));
    }

    // Load User
    const savedUser = localStorage.getItem('kurd_manhua_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser) as User;
      const currentDeviceId = getDeviceId();
      if (parsed.deviceId === currentDeviceId) {
        setUser({ ...parsed, favoriteIds: parsed.favoriteIds || [] });
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (email: string, name: string, password?: string) => {
    const storedAccounts = JSON.parse(localStorage.getItem('kurd_manhua_accounts') || '{}');
    const currentDeviceId = getDeviceId();
    const targetAdminEmail = 'yeeruru@gmail.com';

    if (storedAccounts[email]) {
      const account = storedAccounts[email];
      if (account.password !== password) {
        alert("وشەی نهێنی هەڵەیە!");
        return;
      }
      
      if (account.deviceId !== currentDeviceId) {
        alert("ئەم ئەکاونتە لەسەر ئامێرێکی ترە! تەنها لە یەک ئامێر ڕێگەپێدراوە.");
        return;
      }

      if (email.toLowerCase() === targetAdminEmail && account.role !== UserRole.SUPER_ADMIN) {
        account.role = UserRole.SUPER_ADMIN;
        account.isPremium = true;
        account.subscriptionType = SubscriptionType.ONE_YEAR;
        storedAccounts[email] = account;
        localStorage.setItem('kurd_manhua_accounts', JSON.stringify(storedAccounts));
      }

      const userData = { ...account, bookmarks: account.bookmarks || [], favoriteIds: account.favoriteIds || [] };
      setUser(userData);
      localStorage.setItem('kurd_manhua_user', JSON.stringify(userData));
    } else {
      const isAdminEmail = email.toLowerCase() === targetAdminEmail;
      const isFirst = Object.keys(storedAccounts).length === 0;
      const role = isAdminEmail ? UserRole.SUPER_ADMIN : (isFirst ? UserRole.SUPER_ADMIN : UserRole.USER);
      
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        password,
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

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('kurd_manhua_user');
  };

  const updateManhuas = (newManhuas: Manhua[]) => {
    setManhuas(newManhuas);
    localStorage.setItem('kurd_manhua_data', JSON.stringify(newManhuas));
  };

  const updateSupportContacts = (contacts: SupportContact[]) => {
    setSupportContacts(contacts);
    localStorage.setItem('kurd_manhua_contacts', JSON.stringify(contacts));
  };

  const incrementViews = (manhuaId: string) => {
    const updated = manhuas.map(m => m.id === manhuaId ? { ...m, views: (m.views || 0) + 1 } : m);
    setManhuas(updated);
    localStorage.setItem('kurd_manhua_data', JSON.stringify(updated));
  };

  const toggleFavorite = (manhuaId: string) => {
    if (!user) return;
    const isFavorited = user.favoriteIds.includes(manhuaId);
    let newFavoriteIds;
    
    if (isFavorited) {
      newFavoriteIds = user.favoriteIds.filter(id => id !== manhuaId);
    } else {
      newFavoriteIds = [...user.favoriteIds, manhuaId];
    }

    const updatedUser = { ...user, favoriteIds: newFavoriteIds };
    setUser(updatedUser);
    saveUserData(updatedUser);

    const updatedManhuas = manhuas.map(m => {
      if (m.id === manhuaId) {
        return { ...m, favorites: Math.max(0, (m.favorites || 0) + (isFavorited ? -1 : 1)) };
      }
      return m;
    });
    setManhuas(updatedManhuas);
    localStorage.setItem('kurd_manhua_data', JSON.stringify(updatedManhuas));
  };

  const saveUserData = (updatedUser: User) => {
    localStorage.setItem('kurd_manhua_user', JSON.stringify(updatedUser));
    const storedAccounts = JSON.parse(localStorage.getItem('kurd_manhua_accounts') || '{}');
    storedAccounts[updatedUser.email] = updatedUser;
    localStorage.setItem('kurd_manhua_accounts', JSON.stringify(storedAccounts));
  };

  const updateUserSubscription = (type: SubscriptionType) => {
    if (!user) return;
    const updated = { ...user, isPremium: true, subscriptionType: type };
    setUser(updated);
    saveUserData(updated);
  };

  const toggleBookmark = (bookmark: Bookmark) => {
    if (!user) return;
    const currentBookmarks = user.bookmarks || [];
    const exists = currentBookmarks.find(b => 
      b.manhuaId === bookmark.manhuaId && 
      b.chapterId === bookmark.chapterId && 
      b.pageIndex === bookmark.pageIndex
    );

    let updatedBookmarks;
    if (exists) {
      updatedBookmarks = currentBookmarks.filter(b => b !== exists);
    } else {
      updatedBookmarks = [bookmark, ...currentBookmarks];
    }

    const updatedUser = { ...user, bookmarks: updatedBookmarks };
    setUser(updatedUser);
    saveUserData(updatedUser);
  };

  const filteredManhuas = manhuas.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mostViewedManhuas = [...manhuas].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900 text-white">چاوەڕوان بە...</div>;

  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
        {user && (
          <Navbar 
            user={user} 
            onLogout={handleLogout} 
            onSearch={setSearchTerm} 
            searchTerm={searchTerm} 
          />
        )}
        
        <main className="container mx-auto px-4 pt-6">
          <Routes>
            <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
            
            <Route path="/" element={
              user ? (
                <div className="space-y-12">
                  {!searchTerm && <ManhuaSlider manhuas={manhuas} />}
                  
                  <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                      {searchTerm ? `ئەنجامەکانی گەڕان بۆ "${searchTerm}"` : 'نوێترین مانھواکان'}
                    </h2>
                    {filteredManhuas.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {filteredManhuas.map(m => <ManhuaCard key={m.id} manhua={m} />)}
                      </div>
                    ) : (
                      <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-dashed border-slate-700">
                        <p className="text-slate-500 mb-2">هیچ مانهوایەک نەدۆزرایەوە</p>
                        <button onClick={() => setSearchTerm('')} className="text-indigo-400 font-bold hover:underline">هەموو مانهواکان نیشان بدە</button>
                      </div>
                    )}
                  </section>

                  {!searchTerm && (
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                          <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
                          پڕ بینەرترین مانهواکان
                        </h2>
                        <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700">
                          <button 
                            onClick={() => setTrendingFilter('day')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-black transition ${trendingFilter === 'day' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
                          >ڕۆژی</button>
                          <button 
                            onClick={() => setTrendingFilter('week')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-black transition ${trendingFilter === 'week' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
                          >حەفتەیی</button>
                          <button 
                            onClick={() => setTrendingFilter('month')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-black transition ${trendingFilter === 'month' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
                          >مانگانە</button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {mostViewedManhuas.map((m, index) => (
                          <div key={m.id} className="relative group">
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 text-slate-900 rounded-full z-10 flex items-center justify-center font-black shadow-lg border-2 border-slate-900 text-sm">
                              {index + 1}
                            </div>
                            <ManhuaCard manhua={m} />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              ) : <Navigate to="/login" />
            } />

            <Route path="/manhua/:id" element={user ? <ManhuaDetail user={user} manhuas={manhuas} onIncrementViews={incrementViews} onToggleFavorite={toggleFavorite} /> : <Navigate to="/login" />} />
            <Route path="/reader/:manhuaId/:chapterId" element={user ? <Reader user={user} manhuas={manhuas} onToggleBookmark={toggleBookmark} /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile user={user} manhuas={manhuas} onUpdateSub={updateUserSubscription} supportContacts={supportContacts} onLogout={handleLogout} /> : <Navigate to="/login" />} />
            <Route path="/admin" element={(user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.EDITOR) ? <AdminPanel manhuas={manhuas} onUpdateManhuas={updateManhuas} currentUser={user} supportContacts={supportContacts} onUpdateSupportContacts={updateSupportContacts} /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
