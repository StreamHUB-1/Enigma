import React, { useState } from 'react';
import { User, Lock, Building2 } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginPageProps {
  onLogin: (id: string, pass: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-primary/10 p-8 border border-slate-100"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-theme-gradient rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-primary/20">
            <Building2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Selamat Datang</h2>
          <p className="text-slate-500 mt-1">Silakan masuk ke portal karyawan</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">ID Karyawan</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Masukkan ID anda"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <button 
            onClick={() => onLogin(id, pass)}
            className="w-full bg-theme-gradient text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-4"
          >
            Masuk Sekarang
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-medium">
            &copy; 2024 Astra Cibubur Secure Attendance System
          </p>
        </div>
      </motion.div>
    </div>
  );
}
