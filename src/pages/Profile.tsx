import React, { useState, useEffect } from 'react';
import { UserCircle, Send, Building2, BarChart3, Settings, Users, Calendar, ArrowLeft, CheckCircle2, Edit } from 'lucide-react';
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

  const details = [
    { label: 'Nama Lengkap', value: formData.name, icon: UserCircle, key: 'name' },
    { label: 'No Telepon', value: formData.phone, icon: Send, key: 'phone' },
    { label: 'Alamat', value: formData.address, icon: Building2, key: 'address' },
    { label: 'Cabang', value: formData.branch, icon: Building2, key: 'branch', isSelect: true, options: BRANCHES },
    { label: 'Golongan', value: formData.grade, icon: BarChart3, key: 'grade' },
    { label: 'Bidang', value: formData.field, icon: Settings, key: 'field' },
    { label: 'Jabatan', value: formData.position, icon: Users, key: 'position' },
    { label: 'Lama Bekerja', value: '2 Tahun 4 Bulan', icon: Calendar, readOnly: true },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">Profil Karyawan</h2>
        </div>
        {isEditable && (
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all ${isEditing ? 'bg-emerald-600 text-white shadow-emerald-100' : 'bg-theme-gradient text-white shadow-primary/10'}`}
          >
            {isEditing ? <CheckCircle2 size={18} /> : <Edit size={18} />}
            {isEditing ? 'Simpan Perubahan' : 'Edit Profil'}
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
        <div className="h-32 bg-theme-gradient relative">
          <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white rounded-2xl p-1 shadow-xl">
            <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
              <UserCircle size={48} />
            </div>
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{formData.name}</h3>
              <p className="text-primary font-semibold">{formData.position} • {formData.id}</p>
            </div>
            {isEditing && (
              <button onClick={() => { setIsEditing(false); setFormData(user); }} className="text-xs font-bold text-red-500 hover:underline">Batal</button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {details.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                  <item.icon size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                  {isEditing && !item.readOnly ? (
                    item.isSelect ? (
                      <select 
                        value={formData[item.key as keyof Employee] as string}
                        onChange={(e) => setFormData({...formData, [item.key as string]: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-primary mt-1"
                      >
                        {item.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <input 
                        type="text"
                        value={formData[item.key as keyof Employee] as string}
                        onChange={(e) => setFormData({...formData, [item.key as string]: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-primary mt-1"
                      />
                    )
                  ) : (
                    <p className="text-sm font-semibold text-slate-700">{item.value}</p>
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
