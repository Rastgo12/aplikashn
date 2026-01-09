
import React, { useState, useRef, useEffect } from 'react';
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
  const [ghToken, setGhToken] = useState(localStorage.getItem('gh_BpDy4wdPdzF32Oki5IVPdoihAwG27r2tseIH') || '');
  const [ghRepo, setGhRepo] = useState(localStorage.getItem('gh_Rastgo12/aplikashn') || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  const [newManhua, setNewManhua] = useState<Partial<Manhua>>({ title: '', coverImage: '', showInSlider: false });

  useEffect(() => {
    const checkConnection = async () => {
      if (ghToken && ghRepo) {
        const data = await fetchFromGitHub(ghToken, ghRepo);
        setIsConnected(!!data);
      }
    };
    checkConnection();
  }, [ghToken, ghRepo]);

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
    setNewManhua({ title: '', coverImage: '', showInSlider: false });
  };

  const handlePush = async () => {
    if (!ghToken || !ghRepo) return alert("تکایە زانیارییەکان پڕ بکەرەوە");
    setIsSyncing(true);
    localStorage.setItem('gh_token', ghToken);
    localStorage.setItem('gh_repo', ghRepo);
    
    const db = { 
      manhuas, 
      accounts: JSON.parse(localStorage.getItem('kurd_manhua_accounts') || '{}'),
      contacts: supportContacts
    };
    
    const ok = await syncToGitHub(ghToken, ghRepo, db);
    setIsSyncing(false);
    if (ok) {
      setIsConnected(true);
      alert("داتاکان لە گیتھەب پاشەکەوت کران!");
    } else {
      alert("هەڵەیەک ڕوویدا! دڵنیابەرەوە لە ڕاستی Token و Repo.");
    }
  };

  return (
    <div className="py-8 max-w-5xl mx-auto px-4">
      <div className="flex flex-wrap gap-4 mb-10 bg-slate-800 p-2 rounded-2xl border border-slate-700 w-fit">
        <button onClick={() => setActiveTab('content')} className={`px-6 py-2 rounded-xl font-bold transition ${activeTab === 'content' ? 'bg-indigo-600' : 'text-slate-400'}`}>مانهواکان</button>
        <button onClick={() => setActiveTab('slider')} className={`px-6 py-2 rounded-xl font-bold transition ${activeTab === 'slider' ? 'bg-indigo-600' : 'text-slate-400'}`}>سلایدەر</button>
        <button onClick={() => setActiveTab('github')} className={`px-6 py-2 rounded-xl font-bold transition ${activeTab === 'github' ? 'bg-indigo-600' : 'text-slate-400'} flex items-center gap-2`}>
          GitHub Sync
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 animate-pulse'}`}></span>
        </button>
      </div>

      {activeTab === 'github' && (
        <div className="bg-slate-800 p-8 rounded-[32px] border border-slate-700 space-y-6 animate-in fade-in duration-500">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-black">بەستنەوە بە داتابەیسی گیتھەب</h2>
            <div className={`px-4 py-1 rounded-full text-[10px] font-black ${isConnected ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
              {isConnected ? 'پەیوەستە ✓' : 'پەیوەست نییە !'}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 mb-2 block font-bold">GitHub Token (نهێنییە)</label>
              <input 
                type="password" 
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" 
                className="w-full bg-slate-900 p-4 rounded-xl border border-slate-700 focus:border-indigo-500 outline-none" 
                value={ghToken} 
                onChange={e => setGhToken(e.target.value)} 
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-2 block font-bold">Repository Path</label>
              <input 
                placeholder="Username/RepositoryName" 
                className="w-full bg-slate-900 p-4 rounded-xl border border-slate-700 focus:border-indigo-500 outline-none" 
                value={ghRepo} 
                onChange={e => setGhRepo(e.target.value)} 
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button 
              disabled={isSyncing} 
              onClick={handlePush} 
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl font-black shadow-xl transition active:scale-95 disabled:opacity-50"
            >
              {isSyncing ? "خەریکی ناردنی داتاکانە..." : "پاشەکەوتکردن لە گیتھەب (Sync Now)"}
            </button>
            <p className="text-[10px] text-slate-500 text-center">تێبینی: هەر مانهوایەک یان چاپتەرێک زیاد بکەیت، پێویستە لێرە پاشەکەوتی بکەیت تا نەفەوتێت.</p>
          </div>
        </div>
      )}

      {/* Content and Slider tabs remain similar to before but with improved styling */}
      {activeTab === 'content' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
           <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
             <h3 className="font-black text-indigo-400">زیادکردنی مانهوای نوێ</h3>
             <input placeholder="ناوی مانهوا" className="w-full bg-slate-900 p-4 rounded-xl border border-slate-700 outline-none" value={newManhua.title} onChange={e => setNewManhua({...newManhua, title: e.target.value})} />
             <div className="flex items-center gap-4">
                <input type="file" className="text-xs text-slate-400" onChange={async e => {
                  const file = e.target.files?.[0];
                  if(file) setNewManhua({...newManhua, coverImage: await fileToBase64(file)});
                }} />
                {newManhua.coverImage && <img src={newManhua.coverImage} className="w-10 h-14 object-cover rounded border border-slate-600" />}
             </div>
             <button onClick={handleAddManhua} className="w-full bg-indigo-600 py-3 rounded-xl font-bold">زیادکردن</button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {manhuas.map(m => (
               <div key={m.id} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                   <img src={m.coverImage} className="w-12 h-16 object-cover rounded-lg shadow-md" />
                   <div>
                      <h3 className="font-bold text-sm">{m.title}</h3>
                      <p className="text-[10px] text-slate-500">{m.chapters.length} چاپتەر</p>
                   </div>
                 </div>
                 <button onClick={() => {
                   const updated = manhuas.map(item => item.id === m.id ? {...item, showInSlider: !item.showInSlider} : item);
                   onUpdateManhuas(updated);
                 }} className={`px-4 py-2 rounded-xl text-[10px] font-black transition ${m.showInSlider ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-slate-400'}`}>
                   {m.showInSlider ? 'لە سلایدەرە ✓' : 'بیکە بە سلایدەر'}
                 </button>
               </div>
             ))}
           </div>
        </div>
      )}

      {activeTab === 'slider' && (
        <div className="bg-slate-800 p-8 rounded-[32px] border border-slate-700 space-y-6 animate-in fade-in duration-500">
           <h2 className="text-xl font-black mb-4">ڕێکخستنی سلایدەر</h2>
           <div className="space-y-3">
             {manhuas.filter(m => m.showInSlider).map(m => (
               <div key={m.id} className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-800">
                 <div className="flex items-center gap-4">
                   <img src={m.coverImage} className="w-10 h-10 object-cover rounded-full" />
                   <span className="font-bold">{m.title}</span>
                 </div>
                 <button onClick={() => {
                   const updated = manhuas.map(item => item.id === m.id ? {...item, showInSlider: false} : item);
                   onUpdateManhuas(updated);
                 }} className="text-red-400 text-xs font-black hover:underline">لابردن</button>
               </div>
             ))}
             {manhuas.filter(m => m.showInSlider).length === 0 && <p className="text-center text-slate-500 py-10">هیچ مانهوایەک لە سلایدەر نییە.</p>}
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
