import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, LogOut, MapPin, RefreshCcw, Map, Camera, Upload, X, FileText, AlertTriangle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Employee } from '../types';
import { BRANCHES, WORK_TYPES } from '../constants';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';

// Fix Icon Leaflet di React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon buat penanda lokasi User (Warna Merah)
const userMarkerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Rumus Haversine untuk hitung jarak dari koordinat
function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c); 
}

interface AttendancePageProps {
  user: Employee;
  onBack: () => void;
  // Menerima data seluruh karyawan dari parent component
  employees?: Employee[]; 
}

export default function AttendancePage({ user, onBack, employees = [] }: AttendancePageProps) {
  const [branch, setBranch] = useState(user.branch || BRANCHES[0]);
  const [selectedEmpId, setSelectedEmpId] = useState(user.id);
  const [type, setType] = useState<'MASUK' | 'PULANG' | null>(null);
  const [workType, setWorkType] = useState('Reguler');
  
  const [photo, setPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- STATE LOKASI / GPS ---
  const [officeLoc, setOfficeLoc] = useState({ lat: 0, lng: 0, radius: 200 });
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [locStatus, setLocStatus] = useState<'LOADING' | 'OUT_OF_RANGE' | 'IN_RANGE' | 'ERROR' | 'NO_CONFIG'>('LOADING');

  // --- STATE MODAL ---
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<'SAKIT' | 'IZIN'>('SAKIT');
  const [leaveDescription, setLeaveDescription] = useState('');
  const [leavePreview, setLeavePreview] = useState<string | null>(null);
  const leaveFileInputRef = useRef<HTMLInputElement>(null);

  // Cek apakah Admin yang login
  const isAdmin = user.role === 'ADMIN';

  // Filter karyawan berdasarkan cabang yang dipilih
  const branchEmployees = employees.filter(emp => emp.branch === branch);

  // Jalankan tracking lokasi berdasarkan cabang yang dipilih
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
           
           const dist = getDistanceFromLatLonInM(uLat, uLng, lat, lng);
           setDistance(dist);
           
           if (dist <= rad) setLocStatus('IN_RANGE');
           else setLocStatus('OUT_OF_RANGE');
        },
        (error) => {
           console.error("GPS Error:", error);
           setLocStatus('ERROR');
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocStatus('ERROR');
    }
  };

  useEffect(() => {
    fetchLocationData();
    // Kalau cabang diganti (oleh admin), balikin ID yang kepilih jadi kosong
    // biar dia milih ulang dari list karyawan cabang tersebut
    if (isAdmin && branch !== user.branch) {
      setSelectedEmpId('');
    } else if (!isAdmin) {
      setSelectedEmpId(user.id);
    }
  }, [branch]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      alert('Gagal mengakses kamera. Pastikan izin diberikan.');
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const data = canvasRef.current.toDataURL('image/png');
        setPhoto(data);
        
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        setCameraActive(false);
      }
    }
  };

  const handleSubmit = () => {
    if (!selectedEmpId) return alert('Mohon pilih Nama Peserta terlebih dahulu.');
    if (!type) return alert('Mohon pilih status MASUK / PULANG terlebih dahulu.');
    if (!photo) return alert('Foto bukti wajib diambil!');

    if (type === 'MASUK' && (locStatus === 'OUT_OF_RANGE' || locStatus === 'ERROR' || locStatus === 'LOADING')) {
      alert('Gagal! Lokasi Anda tidak valid untuk Absen Masuk.');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      alert(`✅ Absensi ${type} untuk karyawan terpilih Berhasil Disimpan!`);
      setLoading(false);
      onBack();
    }, 1000);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col relative shadow-2xl pb-10">
      
      {/* Header Bar */}
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600"><ArrowLeft size={24} /></button>
        <h2 className="font-bold text-gray-800 text-base flex-1 text-center tracking-wide">FORMULIR ABSENSI</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1">
        {/* Banner Merah */}
        <div className="bg-red-600 text-center py-6 px-4 rounded-b-3xl shadow-md">
          <h3 className="text-white font-bold text-lg uppercase tracking-wider">ASTRA DAIHATSU CIBUBUR</h3>
          <p className="text-red-200 text-xs font-medium mt-1">Absen System</p>
        </div>

        <div className="p-5 space-y-6 -mt-4">
          
          {/* Card Status Lokasi */}
          <div className={`p-4 rounded-2xl border shadow-sm relative overflow-hidden bg-white ${
            locStatus === 'IN_RANGE' ? 'border-emerald-200' :
            locStatus === 'OUT_OF_RANGE' ? 'border-red-200' :
            'border-gray-200'
          }`}>
            <div className="flex justify-between items-start mb-3">
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

          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-6">
            
            {/* Cabang Karyawan */}
            <div className="space-y-2">
              <label className="block text-center text-xs font-bold text-gray-500 uppercase tracking-widest">CABANG KARYAWAN</label>
              {isAdmin ? (
                <div className="relative">
                  <select 
                    value={branch} 
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-500 font-bold text-center text-gray-800 appearance-none cursor-pointer"
                  >
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              ) : (
                <div className="w-full p-4 bg-gray-100 border border-gray-200 rounded-xl font-bold text-gray-800 text-center cursor-not-allowed opacity-80">
                  {branch}
                </div>
              )}
            </div>

            {/* Nama Peserta (Sekarang selalu dropdown untuk SEMUA user) */}
            <div className="space-y-2">
              <label className="block text-center text-xs font-bold text-gray-500 uppercase tracking-widest">NAMA PESERTA</label>
              <div className="relative">
                <select 
                  value={selectedEmpId} 
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full p-4 bg-red-50 border border-red-100 rounded-xl outline-none focus:border-red-500 font-bold text-center text-red-700 appearance-none cursor-pointer"
                >
                  <option value="">-- Pilih Karyawan --</option>
                  {branchEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 pointer-events-none" size={20} />
              </div>
            </div>

            {/* Pilihan Masuk / Pulang */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
              <button onClick={() => setType('MASUK')} className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${type === 'MASUK' ? 'border-gray-800 bg-gray-50 shadow-inner' : 'border-gray-100 bg-white'}`}>
                <span className="font-bold text-gray-800">MASUK</span>
                <span className={`text-[9px] font-bold px-2 py-1 rounded ${type === 'MASUK' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>Wajib Lokasi</span>
              </button>
              <button onClick={() => setType('PULANG')} className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${type === 'PULANG' ? 'border-gray-800 bg-gray-50 shadow-inner' : 'border-gray-100 bg-white'}`}>
                <span className="font-bold text-gray-800">PULANG</span>
                <span className={`text-[9px] font-bold px-2 py-1 rounded ${type === 'PULANG' ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-gray-400'}`}>Bebas Lokasi</span>
              </button>
            </div>

            {/* Tipe Hari Kerja */}
            <div>
              <label className="block text-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">TIPE HARI KERJA</label>
              <div className="relative">
                <select value={workType} onChange={(e) => setWorkType(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-500 font-bold text-center text-gray-800 appearance-none cursor-pointer">
                  {WORK_TYPES.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>

            {/* Foto Bukti */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="block text-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">FOTO BUKTI (WAJIB)</label>
              
              <div className="relative aspect-square sm:aspect-video bg-gray-100 rounded-3xl overflow-hidden border-2 border-dashed border-gray-300 shadow-inner mx-auto max-w-sm flex items-center justify-center">
                {!photo ? (
                  !cameraActive ? (
                    <div onClick={startCamera} className="text-center p-6 cursor-pointer hover:scale-105 transition-transform w-full h-full flex flex-col items-center justify-center">
                      <div className="bg-white p-4 rounded-full shadow-sm mb-3 inline-block">
                        <Camera size={36} className="text-red-600" />
                      </div>
                      <p className="text-sm font-bold text-gray-700">Buka Kamera</p>
                      <p className="text-[10px] text-gray-400 mt-1">Tap untuk mengambil foto</p>
                    </div>
                  ) : (
                    <>
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100 absolute inset-0" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-48 h-48 border-2 border-white/60 rounded-full border-dashed animate-pulse" />
                      </div>
                      <button onClick={takePhoto} className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform">
                        <div className="w-12 h-12 border-[5px] border-red-600 rounded-full" />
                      </button>
                    </>
                  )
                ) : (
                  <img src={photo} className="w-full h-full object-cover transform -scale-x-100 absolute inset-0" alt="Capture" />
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />

              {photo && (
                <div className="pt-2 flex justify-center">
                  <button onClick={() => { setPhoto(null); startCamera(); }} className="px-6 py-2 bg-gray-200 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-300 transition-colors">
                    Ulangi Foto
                  </button>
                </div>
              )}
            </div>

            {/* Kirim Absensi */}
            <button 
              onClick={handleSubmit}
              disabled={loading || (type === 'MASUK' && locStatus === 'OUT_OF_RANGE')}
              className={`w-full py-4 rounded-xl font-bold text-white text-base shadow-lg transition-all ${
                (type === 'MASUK' && locStatus === 'OUT_OF_RANGE') ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-red-600 hover:bg-red-700 shadow-red-600/30'
              }`}
            >
              {loading ? 'Mengirim Data...' : type === 'MASUK' && locStatus === 'OUT_OF_RANGE' ? 'LOKASI TIDAK VALID' : <span className="flex items-center justify-center gap-2"><Upload size={20} /> KIRIM ABSENSI</span>}
            </button>
          </div>

          {/* Opsi Lain (Sakit/Izin) */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">Opsi Lain</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button 
            onClick={() => setLeaveModalOpen(true)}
            className="w-full py-4 rounded-2xl font-bold text-sm text-orange-600 bg-orange-50 border-2 border-orange-100 hover:bg-orange-100 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <AlertTriangle size={18} /> TIDAK BISA HADIR
          </button>

        </div>
      </div>

      <AnimatePresence>
        {/* MODAL PETA LOKASI IN-APP */}
        {isMapModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative">
              <button onClick={() => setIsMapModalOpen(false)} className="absolute top-4 right-4 z-[999] bg-white p-2 text-gray-500 hover:text-red-500 rounded-full shadow-md"><X size={20} /></button>
              
              <div className="h-96 w-full relative z-0">
                <MapContainer center={[officeLoc.lat, officeLoc.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  
                  {/* Titik Kantor (Biru) + Radius */}
                  <Marker position={[officeLoc.lat, officeLoc.lng]}></Marker>
                  <Circle 
                    center={[officeLoc.lat, officeLoc.lng]} 
                    radius={officeLoc.radius} 
                    pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.2 }} 
                  />

                  {/* Titik Karyawan (Merah) */}
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

        {/* MODAL TIDAK BISA HADIR (SAKIT/IZIN) */}
        {leaveModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 relative">
                <button onClick={() => setLeaveModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full p-1"><X size={20}/></button>
                
                <div className="text-center mb-6">
                    <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-orange-500 border-2 border-orange-100"><FileText size={32}/></div>
                    <h3 className="font-bold text-gray-800 text-lg">Form Ketidakhadiran</h3>
                    <p className="text-[10px] text-gray-500 mt-1">Pengajuan izin khusus karyawan</p>
                </div>

                <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1.5 rounded-xl">
                        <button onClick={() => setLeaveType('SAKIT')} className={`py-2 rounded-lg text-xs font-bold transition-all ${leaveType === 'SAKIT' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'}`}>SAKIT</button>
                        <button onClick={() => setLeaveType('IZIN')} className={`py-2 rounded-lg text-xs font-bold transition-all ${leaveType === 'IZIN' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>IZIN</button>
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 mb-1.5 block">Keterangan (Wajib)</label>
                        <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:border-orange-500 outline-none h-28" placeholder="Contoh: Demam tinggi sejak semalam..." value={leaveDescription} onChange={(e) => setLeaveDescription(e.target.value)} required></textarea>
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 mb-1.5 block">Bukti Foto (Opsional)</label>
                        <div onClick={() => leaveFileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl h-24 flex items-center justify-center cursor-pointer hover:bg-gray-100 overflow-hidden relative transition-colors">
                            {leavePreview ? <img src={leavePreview} className="w-full h-full object-cover" alt="preview" /> : <div className="text-center text-gray-400"><Camera size={24} className="mx-auto mb-1"/><span className="text-[10px] font-bold">Tap untuk upload</span></div>}
                            <input ref={leaveFileInputRef} type="file" accept="image/*" onChange={(e) => {
                                if(e.target.files && e.target.files[0]) {
                                    setLeavePreview(URL.createObjectURL(e.target.files[0]));
                                }
                            }} className="hidden" />
                        </div>
                    </div>
                    
                    <button onClick={() => {
                        if(!leaveDescription) return alert('Mohon isi keterangan wajib!');
                        alert(`✅ Laporan ${leaveType} Berhasil Dikirim.`);
                        setLeaveModalOpen(false);
                        onBack();
                    }} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-500/30 transition-all active:scale-95">
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
