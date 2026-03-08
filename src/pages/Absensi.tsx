import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MapPin, RefreshCcw, Map, Camera, Upload, X, ChevronDown, AlertTriangle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Employee } from '../types';
import { BRANCHES, WORK_TYPES } from '../constants';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';

// Inisialisasi konfigurasi aset Leaflet agar tidak terjadi error pada proses render awal
if (typeof L !== 'undefined' && L.Icon) {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

// Konfigurasi ikon kustom untuk penanda lokasi pengguna (Warna Merah)
const userMarkerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

/**
 * Komponen Halaman Absensi Enigma System.
 * Bertanggung jawab memproses verifikasi lokasi GPS, pengambilan bukti foto, serta pengajuan ketidakhadiran.
 */
export default function AttendancePage({ user, onBack, employees = [] }: { user: Employee, onBack: () => void, employees: Employee[] }) {
  // Inisialisasi state dengan penanganan fleksibel untuk menghindari kendala saat data belum terurai
  const [branch, setBranch] = useState(user?.branch || '');
  const [selectedEmpId, setSelectedEmpId] = useState(user?.id || '');
  const [type, setType] = useState<'MASUK' | 'PULANG' | null>(null);
  const [workType, setWorkType] = useState('Reguler');
  
  const [photo, setPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);

  // State untuk kebutuhan Verifikasi Lokasi
  const [officeLoc, setOfficeLoc] = useState({ lat: 0, lng: 0, radius: 200 });
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [locStatus, setLocStatus] = useState<'LOADING' | 'OUT_OF_RANGE' | 'IN_RANGE' | 'ERROR' | 'NO_CONFIG'>('LOADING');

  // State untuk mengontrol visibilitas Modal
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<'SAKIT' | 'IZIN'>('SAKIT');
  const [leaveDescription, setLeaveDescription] = useState('');
  const [leavePreview, setLeavePreview] = useState<string | null>(null);
  const leaveFileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = user?.role === 'ADMIN';
  const branchEmployees = employees.filter(emp => emp.branch === branch);

  /**
   * Fungsi untuk memproses data lokasi dan melakukan sinkronisasi dengan radius absensi cabang.
   */
  const fetchLocationData = () => {
    if (!branch) return;
    setLocStatus('LOADING');
    
    const savedLat = localStorage.getItem(`enigma_office_lat_${branch}`);
    const savedLng = localStorage.getItem(`enigma_office_lng_${branch}`);
    const savedRadius = localStorage.getItem(`enigma_office_radius_${branch}`);

    if (!savedLat || !savedLng) {
      setLocStatus('NO_CONFIG');
      return;
    }

    const lat = parseFloat(savedLat);
    const lng = parseFloat(savedLng);
    const rad = parseFloat(savedRadius || '200');
    setOfficeLoc({ lat, lng, radius: rad });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
           const uLat = position.coords.latitude;
           const uLng = position.coords.longitude;
           setUserLoc([uLat, uLng]);
           
           // Perhitungan Jarak menggunakan formula Haversine
           const R = 6371000; 
           const dLat = (lat - uLat) * Math.PI / 180;
           const dLon = (lng - uLng) * Math.PI / 180;
           const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(uLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
           const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
           const dist = Math.round(R * c);
           
           setDistance(dist);
           if (dist <= rad) setLocStatus('IN_RANGE');
           else setLocStatus('OUT_OF_RANGE');
        },
        () => setLocStatus('ERROR'),
        { enableHighAccuracy: true }
      );
    } else {
      setLocStatus('ERROR');
    }
  };

  useEffect(() => {
    if (branch) fetchLocationData();
  }, [branch]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch {
      alert('Terdapat kendala dalam mengakses kamera. Mohon berikan izin pada pengaturan peramban (browser) Anda.');
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        setPhoto(canvasRef.current.toDataURL('image/png'));
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        setCameraActive(false);
      }
    }
  };

  const handleSubmit = () => {
    if (!selectedEmpId) return alert('Data identitas karyawan tidak ditemukan.');
    if (!type) return alert('Mohon pilih status kehadiran (MASUK / PULANG).');
    if (!photo) return alert('Foto bukti kehadiran wajib disertakan.');

    if (type === 'MASUK' && locStatus === 'OUT_OF_RANGE') {
      return alert('Penyimpanan dibatalkan. Posisi Anda saat ini berada di luar radius area kantor.');
    }
    
    setLoading(true);
    setTimeout(() => {
      alert(`✅ Data Absensi ${type} telah berhasil tersimpan dalam sistem.`);
      setLoading(false);
      onBack();
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col relative shadow-2xl pb-10">
      {/* Bagian Navigasi Atas */}
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm border-b border-gray-100 text-black">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600"><ArrowLeft size={24} /></button>
        <h2 className="font-bold text-gray-800 text-xs tracking-widest uppercase">Enigma Attendance</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1">
        {/* Banner Utama - Mengurangi tinggi padding (py-10 menjadi py-8) */}
        <div className="bg-red-600 text-center py-8 px-4 rounded-b-[40px] shadow-lg">
          <h3 className="text-white font-black text-2xl tracking-tighter">ENIGMA SYSTEM</h3>
          <p className="text-red-100 text-[10px] font-bold uppercase tracking-[0.3em] mt-1 opacity-90">Portal Absensi Mekanik</p>
        </div>

        {/* Wadah Konten - Mengurangi jarak margin atas (-mt-10 menjadi -mt-8) dan jarak antar elemen (space-y-6 menjadi space-y-4) */}
        <div className="p-5 space-y-4 -mt-8">
          
          {/* Kartu Status Lokasi */}
          <div className={`p-4 rounded-2xl border shadow-sm relative overflow-hidden bg-white ${
            locStatus === 'IN_RANGE' ? 'border-emerald-200' :
            locStatus === 'OUT_OF_RANGE' ? 'border-red-200' :
            'border-gray-200'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <MapPin size={18} className={locStatus === 'IN_RANGE' ? 'text-emerald-600' : locStatus === 'NO_CONFIG' ? 'text-slate-400' : 'text-red-600'} />
                <span className="font-bold text-sm text-gray-800">Status Lokasi</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsMapModalOpen(true)} className="px-2 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-blue-100 hover:bg-blue-100">
                  <Map size={12}/> Lihat Peta
                </button>
                <button onClick={fetchLocationData} className="px-2 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-gray-200 shadow-sm hover:bg-gray-100">
                  <RefreshCcw size={12} className={locStatus === 'LOADING' ? 'animate-spin' : ''}/> Refresh
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-end bg-gray-50/50 p-3 rounded-xl border border-gray-100">
              <div>
                <p className="text-[10px] text-gray-500 mb-0.5 font-bold">Jarak ke Kantor</p>
                <h4 className={`text-xl font-black tracking-tight ${locStatus === 'IN_RANGE' ? 'text-emerald-600' : locStatus === 'NO_CONFIG' ? 'text-slate-500' : 'text-red-600'}`}>
                  {locStatus === 'LOADING' ? 'Mencari...' : locStatus === 'NO_CONFIG' ? 'Bebas Absen' : distance !== null ? `${distance} Meter` : 'GPS Error'}
                </h4>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 mb-0.5 font-bold">Batas Radius</p>
                <p className="text-sm font-bold text-gray-800">{locStatus === 'NO_CONFIG' ? '-' : `${officeLoc.radius} Meter`}</p>
              </div>
            </div>
          </div>

          {/* Kartu Formulir Utama - Mengurangi padding (p-8 menjadi p-6) dan jarak vertikal (space-y-7 menjadi space-y-5) */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 space-y-5">
            
            {/* Mengurangi jarak antar input (space-y-6 menjadi space-y-4) */}
            <div className="space-y-4">
              <div>
                <label className="block text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Cabang Penempatan</label>
                {isAdmin ? (
                  <div className="relative">
                    {/* Padding pada input dikurangi menjadi p-3 */}
                    <select value={branch} onChange={(e) => setBranch(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-center text-gray-800 appearance-none outline-none focus:border-red-500">
                      {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl font-black text-center text-gray-600 text-sm shadow-inner uppercase tracking-tight">{user?.branch}</div>
                )}
              </div>

              <div>
                <label className="block text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Pilih Nama Mekanik</label>
                {isAdmin ? (
                  <div className="relative">
                    {/* Padding pada input dikurangi menjadi p-3 */}
                    <select value={selectedEmpId} onChange={(e) => setSelectedEmpId(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-center text-gray-800 appearance-none outline-none focus:border-red-500">
                      <option value="">-- PILIH NAMA --</option>
                      {branchEmployees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl font-black text-center text-gray-800 text-sm shadow-inner uppercase tracking-tight">{user?.name}</div>
                )}
                {branchEmployees.length === 0 && isAdmin && <p className="text-[9px] text-red-500 text-center mt-3 font-bold uppercase">DATABASE CABANG KOSONG</p>}
              </div>
            </div>

            {/* Pilihan MASUK / PULANG - Mengurangi padding vertikal tombol (py-6 menjadi py-4) */}
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setType('MASUK')} className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center ${type === 'MASUK' ? 'border-emerald-500 bg-emerald-50 text-emerald-600 shadow-md' : 'border-gray-100 text-gray-400 font-bold'}`}>
                <span className="block font-black text-base">MASUK</span>
                <span className="text-[8px] uppercase tracking-tighter opacity-70 mt-1">RADIUS WAJIB</span>
              </button>
              <button onClick={() => setType('PULANG')} className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center ${type === 'PULANG' ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-md' : 'border-gray-100 text-gray-400 font-bold'}`}>
                <span className="block font-black text-base">PULANG</span>
                <span className="text-[8px] uppercase tracking-tighter opacity-70 mt-1">RADIUS BEBAS</span>
              </button>
            </div>

            {/* Area Kamera - Mengurangi jarak padding atas (pt-6 menjadi pt-4) */}
            <div className="pt-4 border-t border-gray-50">
              <div className="aspect-video bg-gray-100 rounded-3xl overflow-hidden border-2 border-dashed border-gray-200 relative flex items-center justify-center shadow-inner group">
                {!photo ? (
                  !cameraActive ? (
                    <div onClick={startCamera} className="text-center cursor-pointer p-6 group-hover:scale-110 transition-transform">
                      <Camera size={40} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Buka Kamera</p>
                    </div>
                  ) : (
                    <>
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100" />
                      <button onClick={takePhoto} className="absolute bottom-4 w-14 h-14 bg-white rounded-full border-[5px] border-red-600 shadow-2xl active:scale-90 transition-transform flex items-center justify-center">
                        <div className="w-8 h-8 bg-red-600 rounded-full animate-pulse"></div>
                      </button>
                    </>
                  )
                ) : (
                  <img src={photo} className="w-full h-full object-cover transform -scale-x-100" alt="bukti-absen" />
                )}
              </div>
              {photo && <button onClick={() => { setPhoto(null); startCamera(); }} className="w-full mt-4 text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">Ambil Ulang Foto</button>}
            </div>

            {/* Tombol Kirim - Mengurangi padding vertikal (py-6 menjadi py-4) */}
            <button 
              onClick={handleSubmit} 
              disabled={loading || (type === 'MASUK' && locStatus === 'OUT_OF_RANGE')} 
              className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 text-sm ${ (type === 'MASUK' && locStatus === 'OUT_OF_RANGE') ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-red-600 shadow-red-600/30 hover:bg-red-700'}`}
            >
              {loading ? 'MENYIMPAN DATA...' : <><Upload size={20} /> KIRIM DATA ABSENSI</>}
            </button>
          </div>

          {/* Pemisah Opsi Lain */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">Opsi Lain</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Tombol Tidak Hadir - Mengurangi padding vertikal (py-5 menjadi py-4) */}
          <button 
            onClick={() => setLeaveModalOpen(true)}
            className="w-full py-4 rounded-2xl font-bold text-sm text-orange-600 bg-orange-50 border-2 border-orange-100 hover:bg-orange-100 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <AlertTriangle size={18} /> TIDAK BISA HADIR
          </button>

        </div>
      </div>

      <AnimatePresence>
        {/* Modal Peta Lokasi */}
        {isMapModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative">
              <button onClick={() => setIsMapModalOpen(false)} className="absolute top-4 right-4 z-[999] bg-white p-2 text-gray-500 hover:text-red-500 rounded-full shadow-md"><X size={20} /></button>
              
              <div className="h-96 w-full relative z-0">
                <MapContainer center={[officeLoc.lat, officeLoc.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  
                  <Marker position={[officeLoc.lat, officeLoc.lng]}></Marker>
                  <Circle 
                    center={[officeLoc.lat, officeLoc.lng]} 
                    radius={officeLoc.radius} 
                    pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.2 }} 
                  />

                  {userLoc && (
                    <Marker position={userLoc} icon={userMarkerIcon} />
                  )}
                </MapContainer>
              </div>
              
              <div className="p-4 bg-white text-center border-t border-gray-100">
                 <p className="text-xs font-bold text-gray-800">Keterangan Peta</p>
                 <div className="flex justify-center gap-6 mt-3">
                   <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600"><MapPin size={16} className="text-blue-500"/> Pusat Kantor</div>
                   <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600"><MapPin size={16} className="text-red-500"/> Lokasi Anda</div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal Pengajuan Ketidakhadiran */}
        {leaveModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl p-6 relative">
                <button onClick={() => setLeaveModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full p-1"><X size={20}/></button>
                
                <div className="text-center mb-6 mt-2">
                    <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-orange-500 border-2 border-orange-100"><FileText size={32}/></div>
                    <h3 className="font-bold text-gray-800 text-lg">Form Ketidakhadiran</h3>
                    <p className="text-[10px] text-gray-500 mt-1">Pengajuan izin khusus karyawan</p>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1.5 rounded-xl">
                        <button onClick={() => setLeaveType('SAKIT')} className={`py-2 rounded-lg text-xs font-bold transition-all ${leaveType === 'SAKIT' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'}`}>SAKIT</button>
                        <button onClick={() => setLeaveType('IZIN')} className={`py-2 rounded-lg text-xs font-bold transition-all ${leaveType === 'IZIN' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>IZIN</button>
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 mb-1.5 block">Keterangan (Wajib)</label>
                        <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-orange-500 outline-none h-24" placeholder="Contoh: Demam tinggi sejak semalam..." value={leaveDescription} onChange={(e) => setLeaveDescription(e.target.value)} required></textarea>
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 mb-1.5 block">Bukti Foto (Opsional)</label>
                        <div onClick={() => leaveFileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl h-20 flex items-center justify-center cursor-pointer hover:bg-gray-100 overflow-hidden relative transition-colors">
                            {leavePreview ? <img src={leavePreview} className="w-full h-full object-cover" alt="preview" /> : <div className="text-center text-gray-400"><Camera size={20} className="mx-auto mb-1"/><span className="text-[10px] font-bold">Tap untuk upload</span></div>}
                            <input ref={leaveFileInputRef} type="file" accept="image/*" onChange={(e) => {
                                if(e.target.files && e.target.files[0]) {
                                    setLeavePreview(URL.createObjectURL(e.target.files[0]));
                                }
                            }} className="hidden" />
                        </div>
                    </div>
                    
                    <button onClick={() => {
                        if(!leaveDescription) return alert('Mohon lengkapi kolom keterangan yang diwajibkan.');
                        alert(`✅ Laporan ${leaveType} telah berhasil dikirim kepada administrator.`);
                        setLeaveModalOpen(false);
                        onBack();
                    }} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-orange-500/30 transition-all active:scale-95 mt-2">
                        Kirim Laporan
                    </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}