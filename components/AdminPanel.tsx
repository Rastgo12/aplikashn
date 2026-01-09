
import React, { useState, useRef, useMemo } from 'react';
import { Manhua, Chapter, User, UserRole, SupportContact } from '../types';
import { syncToGitHub, fetchFromGitHub } from '../services/githubService';

interface Props {
  manhuas: Manhua[];
  onUpdateManhuas: (manhuas: Manhua[]) => void;
  currentUser: User;
  supportContacts: SupportContact[];
  onUpdateSupportContacts: (contacts: SupportContact[]) => void;
}

const AdminPanel: React.FC<Props> = ({ manhuas, onUpdateManhuas, currentUser, supportContacts, onUpdateSupportContacts }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'slider' | 'github'>('content');
  const [ghToken, setGhToken] = useState(localStorage.getItem('gh_token') || '');
  const [ghRepo, setGhRepo] = useState(localStorage.getItem('gh_repo') || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  const [newManhua, setNewManhua] = useState<Partial<Manhua>>({ title: '', coverImage: '', showInSlider: false });
  const coverFileRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
    });
  };

  const handleAddManhua = async () => {
    if (!newManhua.title || !newManhua.coverImage) return alert("زانیارییەکان تەواو بکە");
    const m: Manhua = {
      id: Math.random().toString(36).substr(2, 9),
      title: newManhua.title,
      description: '',
      category: 'ئاکشن',
      coverImage: newManhua.coverImage,
      rating: 5.0,
      views: 0,
      favorites: 0,
      showInSlider: !!newManhua.showInSlider,
      chapters: []
    };
    onUpdateManhuas([...manhuas, m]);
    setIsAddingNew(false);
    setNewManhua({ title: '', coverImage: '', showInSlider: false });
  };

  const handleToggleSlider = (id: string) => {
    const updated = manhuas.map(m => m.id === id ? { ...m, showInSlider: !m.showInSlider } : m);
    onUpdateManhuas(updated);
  };

  const handlePush = async () => {
    setIsSyncing(true);
    localStorage.setItem('gh_token', ghToken);
    localStorage.setItem('gh_repo', ghRepo);
    const db = { manhuas, accounts: JSON.parse(localStorage.getItem('kurd_manhua_accounts') || '{}') };
    const ok = await syncToGitHub(ghToken, ghRepo, db);
    setIsSyncing(false);
    alert(ok ? "پاشەکەوت کرا!" : "هەڵە هەیە");
  };

  return (
    <div className="py-8 max-w-5xl mx-auto px-4">
      <div className="flex gap-4 mb-10 bg-slate-800 p-2 rounded-2xl border border-slate-700 w-fit">
        <button onClick={() => setActiveTab('content')} className={`px-6 py-2 rounded-xl font-bold transition ${activeTab === 'content' ? 'bg-indigo-600' : 'text-slate-400'}`}>مانهواکان</button>
        <button onClick={() => setActiveTab('slider')} className={`px-6 py-2 rounded-xl font-bold transition ${activeTab === 'slider' ? 'bg-indigo-600' : 'text-slate-400'}`}>سلایدەر</button>
        <button onClick={() => setActiveTab('github')} className={`px-6 py-2 rounded-xl font-bold transition ${activeTab === 'github' ? 'bg-indigo-600' : 'text-slate-400'}`}>GitHub Sync</button>
      </div>

      {activeTab === 'github' && (
        <div className="bg-slate-800 p-8 rounded-[32px] border border-slate-700 space-y-6">
          <h2 className="text-xl font-black">GitHub Database</h2>
          <input type="password" placeholder="Token (ghp_...)" className="w-full bg-slate-900 p-4 rounded-xl border border-slate-700" value={ghToken} onChange={e => setGhToken(e.target.value)} />
          <input placeholder="Repo (username/repo)" className="w-full bg-slate-900 p-4 rounded-xl border border-slate-700" value={ghRepo} onChange={e => setGhRepo(e.target.value)} />
          <button disabled={isSyncing} onClick={handlePush} className="w-full bg-indigo-600 py-4 rounded-xl font-black">{isSyncing ? "چاوەڕوان بە..." : "پاشەکەوتکردن لە گیتھەب"}</button>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="space-y-6">
           <button onClick={() => setIsAddingNew(!isAddingNew)} className="bg-indigo-600 px-6 py-3 rounded-xl font-bold">+ زیادکردن</button>
           {isAddingNew && (
             <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
               <input placeholder="ناو" className="w-full bg-slate-900 p-3 rounded-lg" value={newManhua.title} onChange={e => setNewManhua({...newManhua, title: e.target.value})} />
               <input type="file" onChange={async e => {
                 const file = e.target.files?.[0];
                 if(file) setNewManhua({...newManhua, coverImage: await fileToBase64(file)});
               }} />
               <label className="flex items-center gap-2">
                 <input type="checkbox" checked={newManhua.showInSlider} onChange={e => setNewManhua({...newManhua, showInSlider: e.target.checked})} />
                 لە سلایدەر بێت؟
               </label>
               <button onClick={handleAddManhua} className="bg-indigo-600 w-full py-3 rounded-lg">تۆمارکردن</button>
             </div>
           )}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {manhuas.map(m => (
               <div key={m.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                   <img src={m.coverImage} className="w-12 h-16 object-cover rounded" />
                   <h3 className="font-bold">{m.title}</h3>
                 </div>
                 <button onClick={() => handleToggleSlider(m.id)} className={`px-3 py-1 rounded-lg text-xs ${m.showInSlider ? 'bg-amber-500 text-slate-900' : 'bg-slate-700'}`}>
                   {m.showInSlider ? 'لە سلایدەرە ✓' : 'بیکە بە سلایدەر'}
                 </button>
               </div>
             ))}
           </div>
        </div>
      )}

      {activeTab === 'slider' && (
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
           <h2 className="text-xl font-black mb-4">مانهواکانی ناو سلایدەر</h2>
           {manhuas.filter(m => m.showInSlider).map(m => (
             <div key={m.id} className="flex items-center justify-between p-4 bg-slate-900 rounded-xl">
               <span className="font-bold">{m.title}</span>
               <button onClick={() => handleToggleSlider(m.id)} className="text-red-400 text-xs">لابردن لە سلایدەر</button>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
