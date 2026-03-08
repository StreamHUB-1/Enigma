import React, { useState } from 'react';
import { Wallet, Calendar, ArrowLeft, X, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Employee } from '../types';

interface SubmissionPageProps {
  onBack: () => void;
  user: Employee;
}

export default function SubmissionPage({ onBack, user }: SubmissionPageProps) {
  const [activeForm, setActiveForm] = useState<string | null>(null);

  const ComingSoonAlert = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    >
      <div className="bg-white rounded-3xl p-8 max-w-xs w-full text-center shadow-2xl">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Coming Soon</h3>
        <p className="text-slate-500 mt-2">Fitur ini sedang dalam tahap pengembangan.</p>
        <button 
          onClick={() => setActiveForm(null)}
          className="mt-6 w-full py-3 bg-theme-gradient text-white rounded-xl font-bold"
        >
          Tutup
        </button>
      </div>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold">Pengajuan</h2>
      </div>

      {!activeForm ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button 
            onClick={() => setActiveForm('kokas')}
            className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all text-left"
          >
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Wallet size={32} />
            </div>
            <h3 className="text-xl font-bold">Pengajuan Kokas</h3>
            <p className="text-slate-500 mt-2">Formulir pengajuan pinjaman atau simpanan anggota koperasi.</p>
          </button>

          <button 
            onClick={() => setActiveForm('cuti')}
            className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all text-left"
          >
            <div className="w-16 h-16 bg-theme-gradient text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Calendar size={32} />
            </div>
            <h3 className="text-xl font-bold">Pengajuan Cuti</h3>
            <p className="text-slate-500 mt-2">Formulir pengajuan cuti tahunan, sakit, atau izin khusus.</p>
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold">Form {activeForm === 'kokas' ? 'Pengajuan Kokas' : 'Pengajuan Cuti'}</h3>
            <button onClick={() => setActiveForm(null)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Alasan Pengajuan</label>
              <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary min-h-[120px]" placeholder="Tuliskan detail pengajuan anda..." />
            </div>
            <button 
              onClick={() => setActiveForm('coming-soon')}
              className="w-full py-4 bg-theme-gradient text-white rounded-2xl font-bold shadow-lg shadow-primary/10"
            >
              Kirim Pengajuan
            </button>
          </div>
        </motion.div>
      )}

      {activeForm === 'coming-soon' && <ComingSoonAlert />}
    </motion.div>
  );
}
