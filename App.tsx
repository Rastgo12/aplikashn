
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, SubscriptionType, UserRole, Manhua, Chapter, Bookmark, SupportContact } from './types';
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
    const initApp = async () => {
      // 1. Check for GitHub Credentials
      const ghToken = localStorage.getItem('gh_token');
      const ghRepo = localStorage.getItem('gh_repo');
      
      let initialManhuas = MOCK_MANHUAS;
      let initialContacts: SupportContact[] = [
        { id: '1', name: 'سەرۆک', whatsapp: '07500000000', telegram: 'yeeruru', messenger: 'yeeruru', viber: '07500000000' }
      ];

      if (ghToken && ghRepo) {
        const cloudData = await fetchFromGitHub(ghToken, ghRepo);
        if (cloudData) {
          if (cloudData.manhuas) initialManhuas = cloudData.manhuas;
          if (cloudData.contacts) initialContacts = cloudData.contacts;
          if (cloudData.accounts) localStorage.setItem('kurd_manhua_accounts', JSON.stringify(cloudData.accounts));
          console.log("Data synced from GitHub successfully.");
        }
      } else {
        // Fallback to local storage if no GitHub
        const savedManhuas = localStorage.getItem('kurd_manhua_data');
        if (savedManhuas) initialManhuas = JSON.parse(savedManhuas);
        
        const savedContacts = localStorage.getItem('kurd_manhua_contacts');
        if (savedContacts) initialContacts = JSON.parse(savedContacts);
      }

      setManhuas(initialManhuas.map(m => ({ ...m, views: m.views || 0, favorites: m.favorites || 0 })));
      setSupportContacts(initialContacts);

      // Load User
      const savedUser = localStorage.getItem('kurd_manhua_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser) as User;
        if (parsed.deviceId === getDeviceId()) {
          setUser({ ...parsed, favoriteIds: parsed.favoriteIds || [] });
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
      if (account.deviceId !== currentDeviceId) return alert("تەنها لە یەک ئامێر ڕێگەپێدراوە.");

      const userData = { ...account, bookmarks: account.bookmarks || [], favoriteIds: account.favoriteIds || [] };
      setUser(userData);
      localStorage.setItem('kurd_manhua_user', JSON.stringify(userData));
    } else {
      const isAdminEmail = email.toLowerCase() === targetAdminEmail;
      const role = isAdminEmail ? UserRole.SUPER_ADMIN : UserRole.USER;
      
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
  };

  const toggleFavorite = (manhuaId: string) => {
    if (!user) return;
    const isFavorited = user.favoriteIds.includes(manhuaId);
    const newFavoriteIds = isFavorited ? user.favoriteIds.filter(id => id !== manhuaId) : [...user.favoriteIds, manhuaId];
    const updatedUser = { ...user, favoriteIds: newFavoriteIds };
    setUser(updatedUser);
    
    const storedAccounts = JSON.parse(localStorage.getItem('kurd_manhua_accounts') || '{}');
    storedAccounts[user.email] = updatedUser;
    localStorage.setItem('kurd_manhua_accounts', JSON.stringify(storedAccounts));
    localStorage.setItem('kurd_manhua_user', JSON.stringify(updatedUser));

    const updatedManhuas = manhuas.map(m => m.id === manhuaId ? { ...m, favorites: Math.max(0, (m.favorites || 0) + (isFavorited ? -1 : 1)) } : m);
    setManhuas(updatedManhuas);
  };

  const toggleBookmark = (bookmark: Bookmark) => {
    if (!user) return;
    const exists = (user.bookmarks || []).find(b => b.manhuaId === bookmark.manhuaId && b.chapterId === bookmark.chapterId && b.pageIndex === bookmark.pageIndex);
    const updatedBookmarks = exists ? user.bookmarks.filter(b => b !== exists) : [bookmark, ...(user.bookmarks || [])];
    const updatedUser = { ...user, bookmarks: updatedBookmarks };
    setUser(updatedUser);
    
    const storedAccounts = JSON.parse(localStorage.getItem('kurd_manhua_accounts') || '{}');
    storedAccounts[user.email] = updatedUser;
    localStorage.setItem('kurd_manhua_accounts', JSON.stringify(storedAccounts));
    localStorage.setItem('kurd_manhua_user', JSON.stringify(updatedUser));
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900 text-white font-black animate-pulse">KURDMANHUA ...</div>;

  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
        {user && <Navbar user={user} onLogout={handleLogout} onSearch={setSearchTerm} searchTerm={searchTerm} />}
        <main className="container mx-auto px-4 pt-6">
          <Routes>
            <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
            <Route path="/" element={user ? (
              <div className="space-y-12">
                {!searchTerm && <ManhuaSlider manhuas={manhuas} />}
                <section>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                    {searchTerm ? `ئەنجامەکان: ${searchTerm}` : 'نوێترین مانهواکان'}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {manhuas.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase())).map(m => <ManhuaCard key={m.id} manhua={m} />)}
                  </div>
                </section>
              </div>
            ) : <Navigate to="/login" />} />
            <Route path="/manhua/:id" element={<ManhuaDetail user={user!} manhuas={manhuas} onIncrementViews={incrementViews} onToggleFavorite={toggleFavorite} />} />
            <Route path="/reader/:manhuaId/:chapterId" element={<Reader user={user!} manhuas={manhuas} onToggleBookmark={toggleBookmark} />} />
            <Route path="/profile" element={<Profile user={user!} manhuas={manhuas} onUpdateSub={() => {}} supportContacts={supportContacts} onLogout={handleLogout} />} />
            <Route path="/admin" element={user?.role === UserRole.SUPER_ADMIN ? <AdminPanel manhuas={manhuas} onUpdateManhuas={updateManhuas} currentUser={user!} supportContacts={supportContacts} onUpdateSupportContacts={updateSupportContacts} /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
