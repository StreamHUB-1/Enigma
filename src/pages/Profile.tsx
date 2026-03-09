import React, { useState, useEffect } from 'react';
import { UserCircle, Send, Building2, BarChart3, Settings, Users, Calendar, ArrowLeft, CheckCircle2, Edit, CreditCard, Briefcase, FileText, Wallet } from 'lucide-react';
import { motion } from 'motion/react';
import { Employee } from '../types';
import { BRANCHES } from '../constants';

interface ProfilePageProps {
  user: Employee;
  onBack: () => void;
  isEditable?: boolean;
  onSave?: (emp: Employee) => void;
}

export default function ProfilePage({ user, onBack, isEditable, onSave }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Employee>(user);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
      setIsEditing(false);
      alert('Data profil berhasil diperbarui!');
    }
  };

  // Menggabungkan semua data karyawan, KECUALI ID dan Password
  const details = [
    // Data Personal & Pekerjaan
    { label: 'Nama Lengkap', value: formData.name, icon: UserCircle, key: 'name' },
    { label: 'No Telepon', value: formData.phone, icon: Send, key: 'phone' },
    { label: 'Cabang', value: formData.branch, icon: Building2, key: 'branch', isSelect: true, options: BRANCHES },
    { label: 'Jabatan', value: formData.position, icon: Users, key: 'position' },
    { label: 'Bidang', value: formData.field, icon: Settings, key: 'field' },
    { label: 'Golongan', value: formData.grade, icon: BarChart3, key: 'grade' },
    { label: 'Lama Bekerja', value: formData.workDuration || '-', icon: Calendar, key: 'workDuration' },
    { label: 'Alamat', value: formData.address, icon: Building2, key: 'address' },
    
    // Data Administrasi & Benefit
    { label: 'No Slip Gaji', value: formData.slipNo || '-', icon: FileText, key: 'slipNo' },
    { label: 'No Anggota Kokas', value: formData.anggotaKokas || '-', icon: Briefcase, key: 'anggotaKokas' },
    { label: 'No Kokas', value: formData.noKokas || '-', icon: Briefcase, key: 'noKokas' },
    { label: 'No BPJS Kesehatan', value: formData.bpjsKesehatan || '-', icon: CreditCard, key: 'bpjsKesehatan' },
    { label: 'No BPJS Ketenagakerjaan', value: formData.bpjsKetenagakerjaan || '-', icon: CreditCard, key: 'bpjsKetenagakerjaan' },
    { label: 'Nama Bank', value: formData.bankName || '-', icon: Wallet, key: 'bankName' },
    { label: 'No Rekening', value: formData.bankAccount || '-', icon: Wallet, key: 'bankAccount' },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-3xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">Profil Karyawan</h2>
        </div>
        {isEditable && (
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${isEditing ? 'bg-emerald-600 text-white shadow-emerald-100' : 'bg-red-600 text-white shadow-red-600/20 hover:bg-red-700'}`}
          >
            {isEditing ? <CheckCircle2 size={18} /> : <Edit size={18} />}
            {isEditing ? 'Simpan Perubahan' : 'Edit Profil'}
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
        {/* Banner Merah Tema Enigma */}
        <div className="h-32 bg-gradient-to-r from-red-600 to-red-800 relative">
          <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white rounded-2xl p-1 shadow-xl">
            <div className="w-full h-full bg-slate-50 rounded-xl flex items-center justify-center text-red-500">
              <UserCircle size={48} />
            </div>
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-4 sm:px-8">
          <div className="mb-8 flex justify-between items-start sm:items-end">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{formData.name}</h3>
              <p className="text-red-600 font-semibold text-sm mt-1">{formData.position} • {formData.branch}</p>
            </div>
            {isEditing && (
              <button onClick={() => { setIsEditing(false); setFormData(user); }} className="text-xs font-bold text-red-500 hover:underline bg-red-50 px-3 py-1.5 rounded-lg">Batal Edit</button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {details.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-red-100 transition-colors group">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-500 shadow-sm group-hover:bg-red-50 transition-colors shrink-0">
                  <item.icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                  {isEditing && !item.readOnly ? (
                    item.isSelect ? (
                      <select 
                        value={formData[item.key as keyof Employee] as string || ''}
                        onChange={(e) => setFormData({...formData, [item.key as string]: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                      >
                        <option value="">Pilih {item.label}</option>
                        {item.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <input 
                        type="text"
                        value={formData[item.key as keyof Employee] as string || ''}
                        onChange={(e) => setFormData({...formData, [item.key as string]: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                        placeholder={`Masukkan ${item.label.toLowerCase()}...`}
                      />
                    )
                  ) : (
                    <p className="text-sm font-semibold text-slate-700 break-words">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
