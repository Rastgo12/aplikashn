
import React, { useState } from 'react';

interface Props {
  onLogin: (email: string, name: string, password?: string) => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && (!isRegister || name)) {
      onLogin(email, name || email.split('@')[0], password);
    }
  };

  const handleForgotPassword = () => {
    const userEmail = prompt("تکایە جیمەیڵەکەت بنووسە بۆ ناردنی داواکاری گۆڕینی وشەی نهێنی:");
    if (userEmail) {
      const accounts = JSON.parse(localStorage.getItem('kurd_manhua_accounts') || '{}');
      if (accounts[userEmail]) {
        alert("داواکاریەکەت گەیشتە سەرۆک! تکایە پەیوەندی بە بەڕێوبەرایەتی بکە بۆ وەرگرتنەوەی وشەی نهێنی نوێ.");
      } else {
        alert("ئەم جیمەیڵە تۆمار نەکراوە.");
      }
    }
  };

  return (
    <div className="h-[85vh] flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 md:p-12 rounded-[40px] border border-slate-700 shadow-2xl w-full max-w-md text-center transition-all duration-500">
        <div className="mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-4xl mb-4 shadow-xl shadow-indigo-500/20">📖</div>
          <h1 className="text-3xl font-black mb-2">
            {isRegister ? 'دروستکردنی ئەکاونت' : 'بەخێربێیتەوە'}
          </h1>
          <p className="text-slate-400">
            {isRegister ? 'ببە بە ئەندام لە جیهانی مانھوا' : 'بۆ چوونە ناو ئەکاونتەکەت زانیاریەکان بنوسە'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          {isRegister && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-xs font-bold text-slate-500 mb-2 mr-1">ناوی تەواو</label>
              <input 
                type="text" 
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                placeholder="بۆ نموونە: ئاراس ئەحمەد"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 mr-1">جیمەیڵ (Gmail)</label>
            <input 
              type="email" 
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-2 mr-1">
              <label className="block text-xs font-bold text-slate-500">وشەی نهێنی (Password)</label>
              {!isRegister && (
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  className="text-[10px] text-indigo-400 hover:underline font-bold"
                >
                  لەبیرچوونی وشەی نهێنی؟
                </button>
              )}
            </div>
            <input 
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-4 bottom-4 text-slate-500 hover:text-indigo-400"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-lg transition transform active:scale-95 flex items-center justify-center gap-3 mt-6"
          >
             {isRegister ? 'تۆمارکردن' : 'چوونەژوورەوە'}
          </button>
        </form>

        <div className="mt-8 text-sm">
          <p className="text-slate-500">
            {isRegister ? 'ئەکاونتت هەیە؟' : 'ئەکاونتت نییە؟'} 
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="text-indigo-400 font-bold mr-2 hover:underline"
            >
              {isRegister ? 'چوونەژوورەوە' : 'دروستکردنی ئەکاونت'}
            </button>
          </p>
        </div>

        <p className="mt-8 text-[10px] text-slate-500 leading-relaxed border-t border-slate-700/50 pt-4">
           تێبینی: ئەکاونتەکەت تەنها لەسەر ئەم ئامێرە کار دەکات و وشەی نهێنیەکەت بە پارێزراوی دەمێنێتەوە.
        </p>
      </div>
    </div>
  );
};

export default Login;
