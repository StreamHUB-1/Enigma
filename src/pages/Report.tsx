import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BRANCHES, JOB_TYPES } from '../constants';

interface ReportPageProps {
  onBack: () => void;
}

export default function ReportPage({ onBack }: ReportPageProps) {
  const [branch, setBranch] = useState('');
  const [jobType, setJobType] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Laporan Berhasil Dikirim!');
    onBack();
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold">Laporan Pekerjaan</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Cabang</label>
          <select 
            required
            value={branch} 
            onChange={(e) => setBranch(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Pilih Cabang</option>
            {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Type Pekerjaan</label>
          <select 
            required
            value={jobType} 
            onChange={(e) => setJobType(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Pilih Type Pekerjaan</option>
            {JOB_TYPES.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tanggal Entry Cabang</label>
          <input 
            required
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <AnimatePresence mode="wait">
          {jobType && (
            <motion.div 
              key={jobType}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 border-t border-slate-100"
            >
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                {jobType === 'Rematching' ? 'RMC (Jumlah)' : jobType === 'Salon' ? 'SM (Jumlah)' : 'AC Care (Jumlah)'}
              </label>
              <input 
                required
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Masukkan jumlah unit"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          type="submit"
          className="w-full py-4 bg-theme-gradient text-white rounded-2xl font-bold shadow-lg shadow-primary/10 mt-4"
        >
          Submit Laporan
        </button>
      </form>
    </motion.div>
  );
}
