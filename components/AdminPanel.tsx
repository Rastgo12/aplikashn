
import React, { useState, useRef, useMemo } from 'react';
import { Manhua, Chapter, User, UserRole, SupportContact } from '../types';

interface Props {
  manhuas: Manhua[];
  onUpdateManhuas: (manhuas: Manhua[]) => void;
  currentUser: User;
  supportContacts: SupportContact[];
  onUpdateSupportContacts: (contacts: SupportContact[]) => void;
}

interface DraftChapter {
  title: string;
  isPremium: boolean;
  pages: string[];
}

const AdminPanel: React.FC<Props> = ({ manhuas, onUpdateManhuas, currentUser, supportContacts, onUpdateSupportContacts }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'slider' | 'users' | 'settings'>('content');
  const [managingManhuaId, setManagingManhuaId] = useState<string | null>(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newManhua, setNewManhua] = useState<Partial<Manhua>>({ 
    title: '', 
    description: '', 
    category: 'ئاکشن', 
    coverImage: '',
    showInSlider: false 
  });
  const [draftChapters, setDraftChapters] = useState<DraftChapter[]>([]);
  
  const [newChapter, setNewChapter] = useState<Partial<Chapter>>({ number: 1, title: '', isPremium: false, pages: [] });

  const coverFileRef = useRef<HTMLInputElement>(null);
  const existingPagesRef = useRef<HTMLInputElement>(null);
  const draftPagesRef = useRef<HTMLInputElement>(null);
  const [activeDraftIndex, setActiveDraftIndex] = useState<number | null>(null);

  const accounts = JSON.parse(localStorage.getItem('kurd_manhua_accounts') || '{}');

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'new-cover' | 'draft-pages' | 'existing-pages') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (type === 'new-cover') {
      const base64 = await fileToBase64(files[0] as File);
      setNewManhua({ ...newManhua, coverImage: base64 });
    } else if (type === 'draft-pages' && activeDraftIndex !== null) {
      const base64Array = await Promise.all((Array.from(files) as File[]).map(file => fileToBase64(file)));
      const updated = [...draftChapters];
      updated[activeDraftIndex] = { ...updated[activeDraftIndex], pages: base64Array };
      setDraftChapters(updated);
      setActiveDraftIndex(null);
    } else if (type === 'existing-pages') {
      const base64Array = await Promise.all((Array.from(files) as File[]).map(file => fileToBase64(file)));
      setNewChapter({ ...newChapter, pages: base64Array });
    }
    e.target.value = '';
  };

  const handleAddManhua = () => {
    if (!newManhua.title || !newManhua.coverImage) return alert("ناوی مانهوا و وێنەی بەرگ پێویستە");
    const m: Manhua = {
      id: Math.random().toString(36).substr(2, 9),
      title: newManhua.title!,
      description: newManhua.description || '',
      category: newManhua.category || 'ئاکشن',
      coverImage: newManhua.coverImage!,
      rating: 5.0,
      views: 0,
      favorites: 0,
      showInSlider: !!newManhua.showInSlider,
      chapters: draftChapters.map((dc, index) => ({
        id: Math.random().toString(36).substr(2, 9),
        number: index + 1,
        title: dc.title,
        isPremium: dc.isPremium,
        pages: dc.pages
      }))
    };
    onUpdateManhuas([...manhuas, m]);
    setIsAddingNew(false);
    setNewManhua({ title: '', coverImage: '', showInSlider: false });
    setDraftChapters([]);
    alert("سەرکەوتوو بوو!");
  };

  const handleToggleSliderStatus = (manhuaId: string) => {
    const updated = manhuas.map(m => m.id === manhuaId ? { ...m, showInSlider: !m.showInSlider } : m);
    onUpdateManhuas(updated);
  };

  const handleAddChapterToExisting = (manhuaId: string) => {
    if (!newChapter.title || !newChapter.pages || newChapter.pages.length === 0) return alert("تکایە ناونیشان و وێنەی لاپەڕەکان دیاری بکە");
    const updated = manhuas.map(m => {
      if (m.id === manhuaId) {
        const ch: Chapter = {
          id: Math.random().toString(36).substr(2, 9),
          number: m.chapters.length + 1,
          title: newChapter.title!,
          isPremium: !!newChapter.isPremium,
          pages: newChapter.pages!
        };
        return { ...m, chapters: [...m.chapters, ch] };
      }
      return m;
    });
    onUpdateManhuas(updated);
    setNewChapter({ title: '', pages: [] });
    alert("چاپتەر زیادکرا!");
  };

  const sliderManhuas = useMemo(() => manhuas.filter(m => m.showInSlider), [manhuas]);

  return (
    <div className="py-6 max-w-7xl mx-auto px-4">
      {/* Hidden File Inputs */}
      <input type="file" ref={coverFileRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'new-cover')} />
      <input type="file" ref={existingPagesRef} className="hidden" accept="image/*" multiple onChange={(e) => handleFileChange(e, 'existing-pages')} />
      <input type="file" ref={draftPagesRef} className="hidden" accept="image/*" multiple onChange={(e) => handleFileChange(e, 'draft-pages')} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <h1 className="text-3xl font-black">کۆنترۆڵ پانێڵ</h1>
        <div className="flex bg-slate-800 p-1 rounded-2xl border border-slate-700 overflow-x-auto no-scrollbar max-w-full">
          <button onClick={() => setActiveTab('content')} className={`px-6 py-2 rounded-xl font-bold transition whitespace-nowrap ${activeTab === 'content' ? 'bg-indigo-600' : 'text-slate-400'}`}>مانهواکان</button>
          <button onClick={() => setActiveTab('slider')} className={`px-6 py-2 rounded-xl font-bold transition whitespace-nowrap ${activeTab === 'slider' ? 'bg-indigo-600' : 'text-slate-400'}`}>سلایدەر</button>
          {currentUser.role === UserRole.SUPER_ADMIN && (
            <button onClick={() => setActiveTab('users')} className={`px-6 py-2 rounded-xl font-bold transition whitespace-nowrap ${activeTab === 'users' ? 'bg-indigo-600' : 'text-slate-400'}`}>ئەندامان</button>
          )}
        </div>
      </div>

      {activeTab === 'content' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">بەڕێوەبردنی ناوەڕۆک</h2>
            <button onClick={() => setIsAddingNew(!isAddingNew)} className="bg-indigo-600 px-6 py-3 rounded-2xl font-black">
              {isAddingNew ? 'داخستن' : '+ زیادکردنی مانهوای نوێ'}
            </button>
          </div>

          {isAddingNew && (
            <div className="bg-slate-800 p-8 rounded-[32px] border border-slate-700 space-y-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <input placeholder="ناوی مانهوا" className="w-full bg-slate-900 p-4 rounded-xl border border-slate-700 outline-none focus:border-indigo-500" value={newManhua.title} onChange={e => setNewManhua({...newManhua, title: e.target.value})} />
                  <div className="flex gap-4 items-center">
                    <button onClick={() => coverFileRef.current?.click()} className="bg-slate-700 px-6 py-3 rounded-xl text-xs font-bold border border-slate-600 hover:bg-slate-600">
                      {newManhua.coverImage ? "وێنەی بەرگ گۆڕدرا ✓" : "هەڵبژاردنی وێنەی بەرگ"}
                    </button>
                    <label className="flex items-center gap-3 cursor-pointer bg-slate-900/50 px-4 py-3 rounded-xl border border-slate-700">
                      <div className={`w-10 h-5 rounded-full relative transition-colors ${newManhua.showInSlider ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                        <input type="checkbox" className="hidden" checked={newManhua.showInSlider} onChange={e => setNewManhua({...newManhua, showInSlider: e.target.checked})} />
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${newManhua.showInSlider ? 'left-6' : 'left-1'}`} />
                      </div>
                      <span className="text-xs font-bold">لە سلایدەر پیشان بدرێت؟</span>
                    </label>
                  </div>
                </div>
                
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                  <h4 className="font-bold mb-4 text-sm text-indigo-400">بەشی چاپتەرە سەرەتاییەکان</h4>
                  <button onClick={() => setDraftChapters([...draftChapters, { title: `چاپتەری ${draftChapters.length+1}`, isPremium: false, pages: [] }])} className="text-[10px] bg-indigo-500 px-4 py-2 rounded-lg mb-4 font-black">+ چاپتەر</button>
                  <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {draftChapters.map((dc, i) => (
                      <div key={i} className="flex flex-wrap gap-4 items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <input className="bg-slate-900 p-2 rounded-lg text-[10px] flex-1 outline-none" value={dc.title} onChange={e => {
                          const up = [...draftChapters]; up[i].title = e.target.value; setDraftChapters(up);
                        }} />
                        <button onClick={() => { setActiveDraftIndex(i); draftPagesRef.current?.click(); }} className="bg-emerald-600 px-3 py-1.5 rounded-lg text-[10px] font-black">
                          {dc.pages.length > 0 ? `✓ ${dc.pages.length} وێنە` : "هەڵبژاردنی وێنەکان"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={handleAddManhua} className="w-full bg-indigo-600 py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 active:scale-95 transition-transform">بڵاوکردنەوەی مانهوا</button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {manhuas.map(m => (
              <div key={m.id} className="bg-slate-800 rounded-[24px] border border-slate-700 overflow-hidden group shadow-lg">
                <div className="p-4 flex gap-4">
                  <div className="relative shrink-0">
                    <img src={m.coverImage} className="w-16 h-24 object-cover rounded-xl shadow-md" alt="" />
                    {m.showInSlider && <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-900 p-1 rounded-lg text-[8px] font-black shadow-lg">SLIDER</span>}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm line-clamp-1">{m.title}</h3>
                    <p className="text-[10px] text-slate-500 mb-3">{m.chapters.length} چاپتەر</p>
                    <div className="flex gap-2">
                       <button onClick={() => setManagingManhuaId(managingManhuaId === m.id ? null : m.id)} className="text-[10px] bg-indigo-600 px-4 py-2 rounded-lg font-black flex-1 transition hover:bg-indigo-500">بەڕێوەبردن</button>
                       <button onClick={() => handleToggleSliderStatus(m.id)} className={`p-2 rounded-lg transition border ${m.showInSlider ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-slate-700 border-slate-600 text-slate-400'}`}>
                         ⭐
                       </button>
                    </div>
                  </div>
                </div>
                {managingManhuaId === m.id && (
                  <div className="p-4 bg-slate-900/50 border-t border-slate-700 space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-indigo-400">زیادکردنی چاپتەری نوێ</h4>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">لە سلایدەر؟</span>
                        <div 
                          onClick={() => handleToggleSliderStatus(m.id)}
                          className={`w-8 h-4 rounded-full relative transition-colors ${m.showInSlider ? 'bg-indigo-600' : 'bg-slate-700'}`}
                        >
                          <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${m.showInSlider ? 'left-4.5' : 'left-0.5'}`} />
                        </div>
                      </label>
                    </div>
                    <input placeholder="ناوی چاپتەر" className="w-full bg-slate-800 p-3 rounded-xl text-[10px] border border-slate-700 outline-none" value={newChapter.title} onChange={e => setNewChapter({...newChapter, title: e.target.value})} />
                    <button onClick={() => existingPagesRef.current?.click()} className="w-full bg-emerald-600 py-3 rounded-xl text-[10px] font-black shadow-lg">
                      {newChapter.pages?.length ? `✓ ${newChapter.pages.length} وێنە ئامادەیە` : "هەڵبژاردنی وێنەی چاپتەر"}
                    </button>
                    <button onClick={() => handleAddChapterToExisting(m.id)} className="w-full bg-indigo-600 py-3 rounded-xl text-[10px] font-black">بڵاوکردنەوە</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'slider' && (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold">بەڕێوەبردنی سلایدەری سەرەکی</h2>
              <p className="text-xs text-slate-400">هەموو ئەو مانهوایانەی لێرە چالاک دەکرێن لە لاپەڕەی سەرەکیدا پیشان دەدرێن.</p>
           </div>
           
           <div className="bg-slate-800 rounded-[32px] border border-slate-700 overflow-hidden shadow-xl">
              <div className="grid grid-cols-1 divide-y divide-slate-700">
                 {manhuas.map(m => (
                   <div key={m.id} className="p-6 flex items-center justify-between hover:bg-slate-700/20 transition-colors">
                      <div className="flex items-center gap-6">
                         <img src={m.coverImage} className="w-16 h-20 object-cover rounded-xl shadow-lg" alt="" />
                         <div>
                            <h3 className="font-black text-sm">{m.title}</h3>
                            <p className="text-[10px] text-slate-500 mt-1">{m.category}</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => handleToggleSliderStatus(m.id)}
                        className={`px-6 py-2.5 rounded-xl font-black text-xs transition-all border ${
                          m.showInSlider 
                            ? 'bg-amber-500 border-amber-400 text-slate-900 shadow-lg shadow-amber-500/20' 
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        {m.showInSlider ? 'چالاککراوە ✓' : 'چالاک بکە'}
                      </button>
                   </div>
                 ))}
                 {manhuas.length === 0 && (
                   <div className="p-20 text-center text-slate-500">هیچ مانهوایەک بۆ دەستکاریکردن نییە.</div>
                 )}
              </div>
           </div>
           
           <div className="bg-indigo-900/10 p-6 rounded-[24px] border border-indigo-500/20 flex gap-4 items-center">
              <div className="bg-indigo-600/20 p-3 rounded-xl text-xl">💡</div>
              <p className="text-xs text-indigo-300 leading-relaxed font-bold">تێبینی: پێشنیار دەکرێت تەنها ٣ بۆ ٥ مانهوای سەرنجڕاکێش لە سلایدەر دابنرێت بۆ ئەوەی خێرایی ئەپڵیکەیشنەکە باش بمێنێتەوە.</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
