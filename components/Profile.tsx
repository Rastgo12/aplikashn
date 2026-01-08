
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, SubscriptionType, Manhua, SupportContact } from '../types';
import { SUBSCRIPTION_OPTIONS } from '../constants';
import ManhuaCard from './ManhuaCard';

interface Props {
  user: User;
  manhuas: Manhua[];
  onUpdateSub: (type: SubscriptionType) => void;
  supportContacts: SupportContact[];
  onLogout: () => void;
}

const Profile: React.FC<Props> = ({ user, manhuas, onUpdateSub, supportContacts, onLogout }) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionType | null>(null);
  const navigate = useNavigate();

  const favoriteManhuas = manhuas.filter(m => user.favoriteIds.includes(m.id));

  const handleLogoutClick = () => {
    if (window.confirm("ئایا دڵنیایت دەتەوێت لە ئەکاونتەکەت بچیتە دەرەوە؟")) {
      onLogout();
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-16">
      {/* Profile Info */}
      <div className="bg-slate-800 rounded-[40px] p-8 md:p-10 border border-slate-700 flex flex-col md:flex-row items-center gap-10 shadow-2xl">
        <img src={user.avatar} className="w-40 h-40 rounded-[40px] border-4 border-indigo-500/20 shadow-xl" alt="" />
        <div className="flex-1 text-center md:text-right">
          <div className="mb-6">
            <h1 className="text-4xl font-black mb-2">{user.name}</h1>
            <p className="text-slate-400 font-medium">{user.email}</p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
             <div className="bg-slate-900 px-5 py-3 rounded-2xl border border-slate-700">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">ئایدی بەکارهێنەر</p>
                <p className="font-mono text-indigo-400 font-bold">{user.id}</p>
             </div>
             <div className="bg-slate-900 px-5 py-3 rounded-2xl border border-slate-700">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">ئامێری چالاک</p>
                <p className="font-mono text-emerald-400 font-bold">{user.deviceId.slice(0, 10)}...</p>
             </div>
             <div className="bg-slate-900 px-5 py-3 rounded-2xl border border-slate-700">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">دۆخی ئەکاونت</p>
                <p className={`font-black ${user.isPremium ? 'text-amber-400' : 'text-slate-400'}`}>
                   {user.isPremium ? '👑 پریمیۆم' : 'بێبەرامبەر'}
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Favorites Section */}
      <section>
        <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
           <span className="w-2.5 h-10 bg-red-500 rounded-full"></span>
           مانهوا دڵخوازەکان ({favoriteManhuas.length})
        </h2>
        {favoriteManhuas.length === 0 ? (
          <div className="bg-slate-800/30 rounded-[32px] p-16 text-center border-2 border-dashed border-slate-700/50">
            <p className="text-slate-500 text-lg">هێشتا هیچ مانهوایەکت نەکردووە بە دڵخواز.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {favoriteManhuas.map(m => (
              <ManhuaCard key={m.id} manhua={m} />
            ))}
          </div>
        )}
      </section>

      {/* Bookmarks Section */}
      <section>
        <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
           <span className="w-2.5 h-10 bg-indigo-500 rounded-full"></span>
           نیشانەکراوەکان (Bookmarks)
        </h2>
        {(!user.bookmarks || user.bookmarks.length === 0) ? (
          <div className="bg-slate-800/30 rounded-[32px] p-16 text-center border-2 border-dashed border-slate-700/50">
            <p className="text-slate-500 text-lg">هیچ لاپەڕەیەکت نیشانە نەکردووە بۆ گەڕانەوە.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.bookmarks.map((bm, i) => (
              <div 
                key={i}
                onClick={() => navigate(`/reader/${bm.manhuaId}/${bm.chapterId}`)}
                className="bg-slate-800 p-6 rounded-3xl border border-slate-700 hover:border-indigo-500 transition-all cursor-pointer flex justify-between items-center group shadow-lg hover:shadow-indigo-500/10"
              >
                <div>
                  <h3 className="font-black text-indigo-400 mb-1">{bm.manhuaTitle}</h3>
                  <p className="text-sm text-slate-300 font-bold">{bm.chapterTitle}</p>
                  <p className="text-xs text-slate-500 mt-2 bg-slate-900/50 w-fit px-2 py-1 rounded-lg border border-slate-700">لاپەڕەی {bm.pageIndex + 1}</p>
                </div>
                <div className="bg-indigo-500 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100">
                  <span className="text-xl">→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Subscription Section */}
      <section className="bg-slate-800/50 p-10 rounded-[40px] border border-slate-700 shadow-xl">
        <h2 className="text-3xl font-black mb-10 text-center">پریمیۆم چالاک بکە</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {SUBSCRIPTION_OPTIONS.map((opt) => (
            <div 
              key={opt.type}
              onClick={() => setSelectedPlan(opt.type)}
              className={`p-8 rounded-[32px] border-2 cursor-pointer transition-all duration-300 text-center flex flex-col justify-center gap-4 ${
                selectedPlan === opt.type 
                  ? 'bg-indigo-600 border-indigo-400 scale-105 shadow-2xl shadow-indigo-500/30' 
                  : 'bg-slate-900 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
              }`}
            >
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{opt.label}</p>
              <p className="text-xl font-black">{opt.price}</p>
            </div>
          ))}
        </div>
        
        {selectedPlan && (
          <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
             <div className="bg-indigo-900/20 border border-indigo-500/30 p-8 rounded-[32px] text-center">
                <h3 className="text-2xl font-black mb-4">چۆنیەتی چالاککردن</h3>
                <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
                  تکایە پەیوەندی بکە بە یەکێک لە ئەندامانی پشتیوانی بۆ چالاککردنی پلانی <span className="text-amber-400 font-black">{selectedPlan}</span>. 
                  پێویستە ناوی ئەکاونت و <span className="bg-indigo-600/30 px-2 py-0.5 rounded font-mono text-indigo-400">ئایدی بەکارهێنەر: {user.id}</span> بنێریت بۆیان.
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {supportContacts.map(contact => (
                  <div key={contact.id} className="bg-slate-800 p-8 rounded-[32px] border border-slate-700 shadow-lg">
                    <h4 className="text-lg font-black text-indigo-400 mb-6 flex items-center gap-2">
                       <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                       پەیوەندی بە {contact.name}
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                       {contact.whatsapp && (
                         <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" className="flex items-center justify-center gap-2 bg-emerald-600/10 hover:bg-emerald-600 transition p-3 rounded-2xl border border-emerald-500/20 text-emerald-400 hover:text-white font-bold text-xs">
                           WhatsApp
                         </a>
                       )}
                       {contact.telegram && (
                         <a href={`https://t.me/${contact.telegram}`} target="_blank" className="flex items-center justify-center gap-2 bg-blue-600/10 hover:bg-blue-600 transition p-3 rounded-2xl border border-blue-500/20 text-blue-400 hover:text-white font-bold text-xs">
                           Telegram
                         </a>
                       )}
                       {contact.messenger && (
                         <a href={`https://m.me/${contact.messenger}`} target="_blank" className="flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500 transition p-3 rounded-2xl border border-blue-500/20 text-blue-300 hover:text-white font-bold text-xs">
                           Messenger
                         </a>
                       )}
                       {contact.viber && (
                         <a href={`viber://add?number=${contact.viber}`} className="flex items-center justify-center gap-2 bg-purple-600/10 hover:bg-purple-600 transition p-3 rounded-2xl border border-purple-500/20 text-purple-400 hover:text-white font-bold text-xs">
                           Viber
                         </a>
                       )}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </section>

      {/* Account Protection & Logout */}
      <section className="flex flex-col gap-6">
        <div className="bg-red-900/10 border border-red-500/20 p-8 rounded-[32px] flex items-start gap-4">
          <div className="bg-red-500/20 p-3 rounded-2xl text-xl">🛡️</div>
          <div>
              <h3 className="text-red-500 font-black mb-2">پاراستنی ئەکاونت</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                ئەم ئەکاونتە بەستراوەتەوە بە ئامێرەکەت (Device ID: {user.deviceId}). بەکارهێنان لە چەند ئامێرێکدا قەدەغەیە.
              </p>
          </div>
        </div>

        <button 
          onClick={handleLogoutClick}
          className="w-full bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white py-5 rounded-[32px] font-black transition-all border border-slate-700 hover:border-red-500 flex items-center justify-center gap-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          چوونە دەرەوە لە ئەکاونت
        </button>
      </section>
    </div>
  );
};

export default Profile;
