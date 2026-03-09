import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, X, Eye, EyeOff, MapPin, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Employee, Role } from '../types';
import { BRANCHES } from '../constants';
import { supabase } from '../lib/supabase';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix icon leaflet di React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ControlPanelProps {
  onBack: () => void;
  // SINKRONISASI: Nambahin fungsi pelatuk untuk refresh aplikasi utama
  onDataChange?: () => void; 
}

export default function ControlPanel({ onBack, onDataChange }: ControlPanelProps) {
  // State Data Supabase
  const [employeesData, setEmployeesData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // State Modal & UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  
  // State Pengaturan Lokasi
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);
  const [locBranch, setLocBranch] = useState<string>(BRANCHES[0] || 'Cibubur');
  const [latInput, setLatInput] = useState('-6.3761176');
  const [lngInput, setLngInput] = useState('106.897086');
  const [radiusInput, setRadiusInput] = useState('200');
  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.3761176, 106.897086]);

  const [formData, setFormData] = useState<any>({
    id: '', name: '', phone: '', address: '', branch: '', grade: '', field: '', position: '', password: '', role: 'EMPLOYEE',
    anggotaKokas: '', noKokas: '', workDuration: '', bpjsKesehatan: '', bpjsKetenagakerjaan: '',
    slipNo: '', bankName: 'PERMATA', bankAccount: ''
  });

  const fetchEmployees = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('id', { ascending: true }); 

    if (error) {
      console.error('Error fetching employees:', error);
      alert('Gagal mengambil data dari database!');
    } else {
      setEmployeesData(data as Employee[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employeesData.filter(emp => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = emp.name.toLowerCase().includes(query) || 
                          emp.id.toLowerCase().includes(query) ||
                          emp.branch.toLowerCase().includes(query);
    const matchesBranch = filterBranch === '' || emp.branch === filterBranch;
    return matchesSearch && matchesBranch;
  });

  const openAdd = () => {
    setEditingEmp(null);
    setFormData({ 
      id: '', name: '', phone: '', address: '', branch: '', grade: '', field: '', position: '', password: '', role: 'EMPLOYEE',
      anggotaKokas: '', noKokas: '', workDuration: '', bpjsKesehatan: '', bpjsKetenagakerjaan: '',
      slipNo: '', bankName: 'PERMATA', bankAccount: '' 
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const openEdit = (emp: any) => {
    setEditingEmp(emp);
    setFormData({
      ...emp,
      anggotaKokas: emp.anggotaKokas || '',
      noKokas: emp.noKokas || '',
      workDuration: emp.workDuration || '',
      bpjsKesehatan: emp.bpjsKesehatan || '',
      bpjsKetenagakerjaan: emp.bpjsKetenagakerjaan || '',
      slipNo: emp.slipNo || '',
      bankName: emp.bankName || 'PERMATA',
      bankAccount: emp.bankAccount || ''
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.id || !formData.name || !formData.password || !formData.branch) {
      return alert('ID Login, Nama, Password, dan Cabang wajib diisi!');
    }

    if (editingEmp) {
      if (editingEmp.id !== formData.id) {
        const isDuplicate = employeesData.some(e => e.id === formData.id);
        if (isDuplicate) return alert('ID Login baru sudah digunakan! Silakan pilih ID lain.');
      }

      const { error } = await supabase
        .from('employees')
        .update(formData)
        .eq('id', editingEmp.id);

      if (error) {
        alert('Gagal update karyawan: ' + error.message);
      } else {
        alert('✅ Data karyawan berhasil diupdate!');
        setIsModalOpen(false);
        fetchEmployees(); 
        if (onDataChange) onDataChange(); // <-- Sinkronisasi App.tsx
      }
    } else {
      const isDuplicate = employeesData.some(e => e.id === formData.id);
      if (isDuplicate) return alert('ID Karyawan sudah terdaftar! Gunakan ID lain.');

      const { error } = await supabase
        .from('employees')
        .insert([formData]);

      if (error) {
        alert('Gagal menambah karyawan: ' + error.message);
      } else {
        alert('✅ Karyawan baru berhasil ditambahkan!');
        setIsModalOpen(false);
        fetchEmployees(); 
        if (onDataChange) onDataChange(); // <-- Sinkronisasi App.tsx
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (id === 'admin') return alert('Akun Admin utama tidak boleh dihapus!');
    
    if (confirm('Yakin ingin menghapus karyawan ini dari database?')) {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Gagal menghapus: ' + error.message);
      } else {
        fetchEmployees(); 
        if (onDataChange) onDataChange(); // <-- Sinkronisasi App.tsx
      }
    }
  };

  // --- LOGIKA LOKASI (GPS) ---
  useEffect(() => {
    const savedLat = localStorage.getItem(`enigma_office_lat_${locBranch}`);
    const savedLng = localStorage.getItem(`enigma_office_lng_${locBranch}`);
    const savedRad = localStorage.getItem(`enigma_office_radius_${locBranch}`);
    
    if (savedLat && savedLng) {
      setLatInput(savedLat);
      setLngInput(savedLng);
      setMapCenter([parseFloat(savedLat), parseFloat(savedLng)]);
    } else {
      setLatInput('-6.3761176');
      setLngInput('106.897086');
      setMapCenter([-6.3761176, 106.897086]);
    }
    setRadiusInput(savedRad || '200');
  }, [locBranch, isLocModalOpen]);

  const saveLocationSettings = () => {
    localStorage.setItem(`enigma_office_lat_${locBranch}`, latInput);
    localStorage.setItem(`enigma_office_lng_${locBranch}`, lngInput);
    localStorage.setItem(`enigma_office_radius_${locBranch}`, radiusInput);
    alert(`✅ Pengaturan Lokasi Absen untuk Cabang ${locBranch} Berhasil Disimpan!`);
    setIsLocModalOpen(false);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toString();
          const lng = pos.coords.longitude.toString();
          setLatInput(lat);
          setLngInput(lng);
          setMapCenter([pos.coords.latitude, pos.coords.longitude]);
        },
        () => alert("Gagal mengambil lokasi GPS. Pastikan izin diberikan.")
      );
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setLatInput(e.latlng.lat.toString());
        setLngInput(e.latlng.lng.toString());
        setMapCenter([e.latlng.lat, e.latlng.lng]);
      },
    });
    return mapCenter ? (
      <>
        <Marker position={mapCenter}></Marker>
        <Circle center={mapCenter} radius={Number(radiusInput)} pathOptions={{ color: '#e11d48', fillColor: '#f43f5e', fillOpacity: 0.2 }} />
      </>
    ) : null;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto pb-20">
      
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-gray-800">Control Panel</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* SEARCH BAR ANIMASI */}
          <div className="relative group w-full sm:w-80 z-20">
            <div className="absolute w-32 rotate-6 h-10 bg-red-500 rounded-full blur-[12px] -left-2 top-1 opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="absolute w-32 rotate-6 h-10 group-hover:w-44 transition-all duration-300 ease-out bg-slate-800 rounded-2xl blur-[12px] -right-2 bottom-1 opacity-40 group-hover:opacity-70"></div>
            <div className="absolute w-32 h-14 group-hover:h-6 group-hover:blur-[25px] group-hover:w-56 transition-all ease-out duration-300 bg-red-600 rounded-full blur-[20px] -left-5 -top-1 opacity-30"></div>
            <div className="absolute w-32 h-14 group-hover:h-6 group-hover:blur-[25px] group-hover:w-56 transition-all ease-out duration-300 bg-slate-700 rounded-full blur-[20px] -right-3 -bottom-2 opacity-30"></div>

            <div className="relative w-full h-12 overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm z-10 flex items-center">
              <div className="absolute z-10 -translate-x-44 group-hover:translate-x-[30rem] ease-in transition-all duration-700 h-full w-44 bg-gradient-to-r from-transparent via-red-100 to-transparent opacity-50 -skew-x-12 pointer-events-none"></div>

              <div className="absolute group-focus-within:-left-[5px] group-focus-within:-top-[20px] transition-all duration-300 ease-out w-32 h-32 bg-red-50 blur-[20px] -left-[100px] -top-[100px] z-0 pointer-events-none"></div>
              <div className="absolute group-focus-within:-right-[5px] group-focus-within:-bottom-[20px] transition-all duration-300 ease-out w-32 h-32 bg-slate-50 blur-[20px] -right-[100px] -bottom-[100px] z-0 pointer-events-none"></div>

              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 z-[20] pointer-events-none">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"></path>
              </svg>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Nama / ID / Cabang..."
                className="relative w-full h-full outline-none text-sm font-bold text-gray-800 bg-transparent placeholder:font-normal placeholder:text-gray-400 pl-12 pr-16 z-[30]"
              />

              <div 
                className="absolute overflow-hidden top-[6px] right-2 bottom-[6px] rounded-xl bg-gray-50 border border-gray-100 p-[2px] z-[40] cursor-pointer group/filter transition-all hover:border-red-200 shadow-sm"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                <div className="absolute group-hover/filter:-left-8 transition-all duration-300 ease-out w-16 h-5 bg-red-200 rounded-full blur-[8px] -left-4 -top-3 pointer-events-none"></div>
                <div className="absolute group-hover/filter:-left-8 transition-all duration-300 ease-out w-16 h-5 bg-red-200 rounded-full blur-[8px] -left-4 -bottom-3 pointer-events-none"></div>
                <div className="bg-white relative rounded-lg px-2.5 h-full flex items-center justify-center transition-colors group-hover/filter:text-red-600 text-gray-500">
                  <svg className="size-4" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" strokeLinejoin="round" strokeLinecap="round"></path>
                  </svg>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {showFilterDropdown && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[100] max-h-64 overflow-y-auto">
                  <div className="p-2 space-y-1">
                    <button onClick={() => { setFilterBranch(''); setShowFilterDropdown(false); }} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${filterBranch === '' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}>Semua Cabang</button>
                    {BRANCHES.map(b => (
                      <button key={b} onClick={() => { setFilterBranch(b); setShowFilterDropdown(false); }} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${filterBranch === b ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}>{b}</button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button onClick={() => setIsLocModalOpen(true)} className="bg-white border-2 border-gray-200 text-gray-600 px-4 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:border-red-600 hover:text-red-600 transition-all active:scale-95 shadow-sm">
              <MapPin size={18} />
            </button>
            <button onClick={openAdd} className="flex-1 sm:flex-none bg-red-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all active:scale-95">
              <Plus size={18} /> Tambah
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID / Nama</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Jabatan / Cabang</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-bold">Memuat Data dari Database...</td></tr>
              ) : filteredEmployees.length > 0 ? filteredEmployees.map(emp => (
                <tr key={emp.id} className="hover:bg-red-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{emp.name}</p>
                    <p className="text-[11px] font-medium text-gray-400">{emp.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-700">{emp.position === '-' ? 'Belum Diatur' : emp.position}</p>
                    <p className="text-[10px] font-bold text-red-600 uppercase tracking-wide mt-0.5">{emp.branch}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide ${emp.role === 'ADMIN' ? 'bg-gray-800 text-white' : 'bg-blue-50 text-blue-600'}`}>
                      {emp.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(emp)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(emp.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium">Tidak ada data karyawan yang ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="text-xl font-bold text-gray-800">{editingEmp ? 'Edit Profil Karyawan' : 'Tambah Karyawan Baru'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"><X size={20} /></button>
              </div>
              
              <div className="p-8 space-y-8">
                
                <div>
                  <h4 className="text-xs font-black text-red-600 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">1. Data Akun & Personal</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">ID Login</label>
                      <input value={formData.id} onChange={(e) => setFormData({...formData, id: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:border-red-500 font-medium transition-colors" placeholder="Contoh: emp001" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          value={formData.password} 
                          onChange={(e) => setFormData({...formData, password: e.target.value})} 
                          className="w-full p-3.5 pr-12 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:border-red-500 font-medium transition-colors" 
                          placeholder="••••••••" 
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nama Lengkap</label>
                      <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:border-red-500 font-medium transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">No Telepon</label>
                      <input value={formData.phone === '-' ? '' : formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:border-red-500 font-medium transition-colors" placeholder="08..." />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Alamat Domisili</label>
                      <textarea value={formData.address === '-' ? '' : formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:border-red-500 font-medium transition-colors h-20" placeholder="Alamat lengkap..." />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black text-red-600 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">2. Data Pekerjaan</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Cabang Penempatan</label>
                      <select value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:border-red-500 font-bold transition-colors">
                        <option value="">Pilih Cabang</option>
                        {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Jabatan</label>
                      <input value={formData.position === '-' ? '' : formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:border-red-500 font-medium transition-colors" placeholder="Contoh: Mekanik" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Golongan</label>
                      <input value={formData.grade === '-' ? '' : formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:border-red-500 font-medium transition-colors" placeholder="Contoh: 3A" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Bidang / Departemen</label>
                      <input value={formData.field === '-' ? '' : formData.field} onChange={(e) => setFormData({...formData, field: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:border-red-500 font-medium transition-colors" placeholder="Contoh: Service" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Lama Bekerja</label>
                      <input value={formData.workDuration} onChange={(e) => setFormData({...formData, workDuration: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:border-red-500 font-medium transition-colors" placeholder="Contoh: 2 Tahun 3 Bulan" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Role Sistem</label>
                      <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value as Role})} className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:border-red-500 font-bold transition-colors">
                        <option value="EMPLOYEE">Karyawan (EMPLOYEE)</option>
                        <option value="ADMIN">Administrator (ADMIN)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black text-red-600 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">3. Administrasi & Benefit</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">No Slip Gaji</label>
                      <input value={formData.slipNo} onChange={(e) => setFormData({...formData, slipNo: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:border-red-500 font-medium transition-colors" placeholder="Contoh: SLP-001" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nomor Anggota Kokas</label>
                      <input value={formData.anggotaKokas} onChange={(e) => setFormData({...formData, anggotaKokas: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:border-red-500 font-medium transition-colors" placeholder="Masukkan nomor anggota" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">No Kokas</label>
                      <input value={formData.noKokas} onChange={(e) => setFormData({...formData, noKokas: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:border-red-500 font-medium transition-colors" placeholder="Masukkan no kokas" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">No. BPJS Kesehatan</label>
                      <input value={formData.bpjsKesehatan} onChange={(e) => setFormData({...formData, bpjsKesehatan: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:border-red-500 font-medium transition-colors" placeholder="Masukkan nomor BPJS Kes" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">No. BPJS Ketenagakerjaan</label>
                      <input value={formData.bpjsKetenagakerjaan} onChange={(e) => setFormData({...formData, bpjsKetenagakerjaan: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:border-red-500 font-medium transition-colors" placeholder="Masukkan nomor BPJS TK" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nama Bank</label>
                      <input value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:border-red-500 font-bold transition-colors" placeholder="Contoh: PERMATA" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">No. Rekening</label>
                      <input value={formData.bankAccount} onChange={(e) => setFormData({...formData, bankAccount: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:border-red-500 font-medium transition-colors" placeholder="Masukkan Nomor Rekening" />
                    </div>
                  </div>
                </div>

              </div>

              <div className="p-6 border-t border-gray-100 flex gap-4 bg-gray-50/50 sticky bottom-0 z-10">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors active:scale-95 shadow-sm">Batal</button>
                <button onClick={handleSave} className="flex-1 py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-600/30 transition-all active:scale-95">Simpan Data</button>
              </div>
            </motion.div>
          </div>
        )}

        {isLocModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
              <div className="p-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-full"><MapPin size={20}/></div>
                  <div>
                    <h3 className="font-bold text-gray-800">Pengaturan Lokasi</h3>
                    <p className="text-[10px] text-gray-500">Pusat & Radius per Cabang</p>
                  </div>
                </div>
                <button onClick={() => setIsLocModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Pilih Cabang</label>
                  <select value={locBranch} onChange={(e) => setLocBranch(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl text-sm font-bold outline-none focus:border-red-500">
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="h-48 w-full rounded-xl overflow-hidden border border-gray-200 relative z-0">
                  <MapContainer center={mapCenter} zoom={15} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker />
                  </MapContainer>
                </div>
                <button onClick={getCurrentLocation} className="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all">
                  <Navigation size={16} /> AMBIL LOKASI SAAT INI (GPS)
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-[10px] font-bold text-gray-500 mb-1">Latitude</label><input type="text" value={latInput} onChange={(e) => setLatInput(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" /></div>
                  <div><label className="block text-[10px] font-bold text-gray-500 mb-1">Longitude</label><input type="text" value={lngInput} onChange={(e) => setLngInput(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" /></div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-[10px] font-bold text-gray-500">Radius Toleransi (Meter)</label>
                    <span className="text-sm font-bold text-blue-600">{radiusInput} Meter</span>
                  </div>
                  <input type="range" min="10" max="500" step="10" value={radiusInput} onChange={(e) => setRadiusInput(e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>10m</span><span>500m</span></div>
                </div>
              </div>

              <div className="p-5 bg-white border-t border-gray-100">
                <button onClick={saveLocationSettings} className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all">
                  SIMPAN PENGATURAN
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
