import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, X, MapPin, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Employee, Role } from '../types';
import { BRANCHES } from '../constants';
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
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  onBack: () => void;
}

export default function ControlPanel({ employees, setEmployees, onBack }: ControlPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // --- STATE PENGATURAN LOKASI (PER CABANG) ---
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);
  const [locBranch, setLocBranch] = useState<string>(BRANCHES[0] || 'Cibubur');
  const [latInput, setLatInput] = useState('-6.3761176');
  const [lngInput, setLngInput] = useState('106.897086');
  const [radiusInput, setRadiusInput] = useState('200');
  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.3761176, 106.897086]);

  const [formData, setFormData] = useState<Partial<Employee>>({
    id: '', name: '', phone: '', address: '', branch: '', grade: '', field: '', position: '', password: '', role: 'EMPLOYEE'
  });

  // Load data lokasi berdasarkan Cabang yang dipilih
  useEffect(() => {
    const savedLat = localStorage.getItem(`enigma_office_lat_${locBranch}`);
    const savedLng = localStorage.getItem(`enigma_office_lng_${locBranch}`);
    const savedRad = localStorage.getItem(`enigma_office_radius_${locBranch}`);
    
    if (savedLat && savedLng) {
      setLatInput(savedLat);
      setLngInput(savedLng);
      setMapCenter([parseFloat(savedLat), parseFloat(savedLng)]);
    } else {
      // Default jika belum diset
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

  // Komponen Marker Interaktif
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
        {/* Lingkaran Radius */}
        <Circle 
          center={mapCenter} 
          radius={Number(radiusInput)} 
          pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.2 }} 
        />
      </>
    ) : null;
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = filterBranch === '' || emp.branch === filterBranch;
    return matchesSearch && matchesBranch;
  });

  const openAdd = () => {
    setEditingEmp(null);
    setFormData({ id: '', name: '', phone: '', address: '', branch: '', grade: '', field: '', position: '', password: '', role: 'EMPLOYEE' });
    setIsModalOpen(true);
  };

  const openEdit = (emp: Employee) => {
    setEditingEmp(emp);
    setFormData(emp);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingEmp) {
      setEmployees(prev => prev.map(e => e.id === editingEmp.id ? (formData as Employee) : e));
    } else {
      if (employees.some(e => e.id === formData.id)) return alert('ID Karyawan sudah ada!');
      setEmployees(prev => [...prev, formData as Employee]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (id === 'admin') return alert('Admin utama tidak bisa dihapus!');
    if (confirm('Hapus karyawan ini?')) setEmployees(prev => prev.filter(e => e.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><ArrowLeft size={20} /></button>
          <h2 className="text-xl font-bold">Control Panel</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari Nama / ID..." className="px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:border-primary w-full sm:w-64" />
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button onClick={() => setIsLocModalOpen(true)} className="bg-white border-2 border-slate-200 text-slate-600 px-4 py-3 rounded-2xl font-bold flex items-center gap-2 hover:border-red-600 hover:text-red-600 transition-all active:scale-95 shadow-sm">
              <MapPin size={20} />
            </button>
            <button onClick={openAdd} className="flex-1 sm:flex-none bg-red-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-red-700 transition-all active:scale-95">
              <Plus size={20} /> Tambah
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">ID / Nama</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Jabatan / Cabang</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length > 0 ? filteredEmployees.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4"><p className="font-bold text-slate-900">{emp.name}</p><p className="text-xs text-slate-500">{emp.id}</p></td>
                  <td className="px-6 py-4"><p className="text-sm font-medium text-slate-700">{emp.position}</p><p className="text-xs text-red-600 font-bold uppercase">{emp.branch}</p></td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-md text-[10px] font-bold ${emp.role === 'ADMIN' ? 'bg-slate-800 text-white' : 'bg-red-50 text-red-600'}`}>{emp.role}</span></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(emp)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(emp.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">Tidak ada data karyawan yang ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {/* MODAL KARYAWAN */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="text-xl font-bold">{editingEmp ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">ID Login</label><input disabled={!!editingEmp} value={formData.id} onChange={(e) => setFormData({...formData, id: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-red-500" /></div>
                  <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Password</label><input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-red-500" /></div>
                  <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Nama Lengkap</label><input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-red-500" /></div>
                  <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">No Telepon</label><input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-red-500" /></div>
                </div>
                <div className="space-y-4">
                  <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Cabang</label><select value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-red-500"><option value="">Pilih</option>{BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}</select></div>
                  <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Jabatan</label><input value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-red-500" /></div>
                  <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Role</label><select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value as Role})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-red-500"><option value="EMPLOYEE">Karyawan</option><option value="ADMIN">Admin</option></select></div>
                  <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Alamat</label><textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-red-500" /></div>
                </div>
              </div>
              <div className="p-6 border-t flex gap-4"><button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Batal</button><button onClick={handleSave} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold">Simpan</button></div>
            </motion.div>
          </div>
        )}

        {/* MODAL PENGATURAN LOKASI */}
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
                
                {/* Dropdown Pemilihan Cabang */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Pilih Cabang</label>
                  <select 
                    value={locBranch} 
                    onChange={(e) => setLocBranch(e.target.value)} 
                    className="w-full p-3 bg-gray-100 border border-gray-300 text-gray-800 rounded-xl text-sm font-bold outline-none focus:border-red-500"
                  >
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                {/* Peta */}
                <div className="h-48 w-full rounded-xl overflow-hidden border border-gray-200 relative z-0">
                  <MapContainer center={mapCenter} zoom={15} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker />
                  </MapContainer>
                </div>

                <button onClick={getCurrentLocation} className="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                  <Navigation size={16} /> AMBIL LOKASI SAAT INI (GPS)
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Latitude</label>
                    <input type="text" value={latInput} onChange={(e) => setLatInput(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Longitude</label>
                    <input type="text" value={lngInput} onChange={(e) => setLngInput(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-[10px] font-bold text-gray-500">Radius Toleransi (Meter)</label>
                    <span className="text-sm font-bold text-blue-600">{radiusInput} Meter</span>
                  </div>
                  <input 
                    type="range" min="10" max="500" step="10"
                    value={radiusInput} onChange={(e) => setRadiusInput(e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>10m (Sempit)</span><span>500m (Luas)</span>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-white border-t border-gray-100">
                <button onClick={saveLocationSettings} className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-600/30 flex items-center justify-center gap-2">
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
