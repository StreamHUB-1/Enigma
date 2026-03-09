import React, { useState, useEffect } from 'react';
import { Building2, LogOut, ChevronDown, Search, X, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Employee } from './types'; 
import { supabase } from './lib/supabase';

import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import AttendancePage from './pages/Absensi';
import ProfilePage from './pages/Profile';
import FinancePage from './pages/Finance';
import SubmissionPage from './pages/Submission';
import ReportPage from './pages/Report';
import ControlPanel from './pages/ControlPanel';
import SocialMediaPage from './pages/SocialMedia'; 

/**
 * Komponen Utama Enigma System.
 * Mengelola state global, autentikasi, dan navigasi aplikasi.
 */
export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  // State Autentikasi dengan pengamanan ekstra terhadap data null/invalid
  const [authUser, setAuthUser] = useState<Employee | null>(() => {
    try {
      const saved = sessionStorage.getItem('portal_auth_user');
      if (!saved || saved === "undefined" || saved === "null") return null;
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const [currentUser, setCurrentUser] = useState<Employee | null>(() => {
    try {
      const saved = sessionStorage.getItem('portal_current_user');
      if (!saved || saved === "undefined" || saved === "null") return null;
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(!!authUser);

  // --- STATE BARU BUAT FITUR POPUP PENCARIAN KARYAWAN (KHUSUS ADMIN) ---
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [selectorSearch, setSelectorSearch] = useState('');

  /**
   * Mengambil data seluruh karyawan dari Supabase.
   * Digunakan universal untuk pengisian data pada dropdown admin dan filter absensi.
   */
  useEffect(() => {
    if (isLoggedIn) {
      const fetchAllEmployees = async () => {
        try {
          const { data, error } = await supabase
            .from('employees')
            .select('*')
            .order('name', { ascending: true });
            
          if (data && !error) {
            setEmployees(data as Employee[]);
          }
        } catch (err) {
          console.error("Gagal memuat data dari Supabase:", err);
        }
      };
      fetchAllEmployees();
    }
  }, [isLoggedIn]);

  /**
   * Logika verifikasi login ke database.
   */
  const handleLogin = async (id: string, pass: string) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .eq('password', pass)
        .single();

      if (data && !error) {
        setAuthUser(data as Employee);
        setCurrentUser(data as Employee);
        setIsLoggedIn(true);
        sessionStorage.setItem('portal_auth_user', JSON.stringify(data));
        sessionStorage.setItem('portal_current_user', JSON.stringify(data));
      } else {
        alert('ID atau Password salah! Silakan cek kembali.');
      }
    } catch (err) {
      alert('Koneksi ke server Enigma gagal. Periksa internet Anda.');
    }
  };

  /**
   * Logout dan membersihkan seluruh penyimpanan sesi.
   */
  const handleLogout = () => {
    setAuthUser(null);
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActiveTab('dashboard');
    sessionStorage.clear();
  };

  /**
   * Beralih profil data (Khusus Role ADMIN).
   */
  const handleSwitchEmployee = (id: string) => {
    if (id === 'admin') {
      setCurrentUser(authUser);
      if (authUser) sessionStorage.setItem('portal_current_user', JSON.stringify(authUser));
      return;
    }
    const user = employees.find(e => e.id === id);
    if (user) {
      setCurrentUser(user);
      sessionStorage.setItem('portal_current_user', JSON.stringify(user));
    }
  };

  const handleUpdateEmployee = (updatedEmp: Employee) => {
    setEmployees(prev => prev.map(e => e.id === updatedEmp.id ? updatedEmp : e));
    if (currentUser?.id === updatedEmp.id) setCurrentUser(updatedEmp);
    if (authUser?.id === updatedEmp.id) setAuthUser(updatedEmp);
  };

  // --- FILTER PENCARIAN POPUP KARYAWAN ---
  const filteredSelectorEmployees = employees.filter(emp => {
    if (emp.role !== 'EMPLOYEE') return false;
    const query = selectorSearch.toLowerCase();
    return emp.name.toLowerCase().includes(query) ||
           emp.id.toLowerCase().includes(query) ||
           emp.branch.toLowerCase().includes(query);
  });

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Pengaman Render Utama: Menampilkan status pemuatan jika data belum siap
  if (!currentUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white flex-col gap-5">
        <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold text-slate-400 tracking-[0.3em] animate-pulse text-xs uppercase">Menghubungkan ke Enigma...</p>
        <button onClick={() => { sessionStorage.clear(); window.location.reload(); }} className="mt-4 text-[10px] font-bold text-red-500 underline">RESET SESSION</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-800 font-sans bg-[#F8FAFC]">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm text-black">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-600/20">
              <Building2 size={24} />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight tracking-tight uppercase text-sm md:text-base">Enigma System</h1>
              <p className="text-[9px] md:text-[10px] text-red-600 font-bold tracking-widest uppercase">Internal Employee Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* TAMPILAN BARU UNTUK ADMIN SWITCHER */}
            {authUser?.role === 'ADMIN' && (
              <div className="hidden md:block relative">
                <button 
                  onClick={() => setIsSelectorOpen(true)}
                  className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[12px] font-bold text-red-600 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm max-w-[250px]"
                >
                  <span className="truncate">
                    {currentUser.id === authUser.id ? 'Data Admin Utama' : currentUser.name}
                  </span>
                  <ChevronDown size={14} className="text-red-400 flex-shrink-0" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-[12px] font-semibold text-slate-900">{authUser?.name}</p>
                <p className="text-[9px] text-red-600 font-bold uppercase tracking-tighter">{authUser?.role}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Keluar"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* POPUP MODAL PENCARIAN KARYAWAN */}
      <AnimatePresence>
        {isSelectorOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-sm" onClick={() => setIsSelectorOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()} 
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[80vh]"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Users size={20} className="text-red-600"/> Akses Data Karyawan
                </h3>
                <button onClick={() => setIsSelectorOpen(false)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 border-b border-slate-100">
                <div className="relative flex items-center">
                  <Search size={18} className="absolute left-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari Nama / ID / Cabang..."
                    value={selectorSearch}
                    onChange={(e) => setSelectorSearch(e.target.value)}
                    className="w-full bg-slate-100 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-red-500/50 transition-all placeholder:font-normal"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                <button
                  onClick={() => {
                    handleSwitchEmployee('admin');
                    setIsSelectorOpen(false);
                    setSelectorSearch('');
                  }}
                  className={`w-full text-left px-5 py-4 rounded-2xl mb-2 flex flex-col transition-all ${currentUser.id === authUser?.id ? 'bg-red-50 border border-red-100 shadow-sm' : 'hover:bg-slate-50 border border-transparent'}`}
                >
                  <span className={`text-sm font-black ${currentUser.id === authUser?.id ? 'text-red-600' : 'text-slate-800'}`}>Data Admin Utama</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Kembali ke profil admin</span>
                </button>

                <div className="px-5 py-3 mt-2">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Daftar Karyawan</span>
                </div>

                {filteredSelectorEmployees.length > 0 ? filteredSelectorEmployees.map(emp => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      handleSwitchEmployee(emp.id);
                      setIsSelectorOpen(false);
                      setSelectorSearch('');
                    }}
                    className={`w-full text-left px-5 py-4 rounded-2xl mb-1 flex items-center justify-between transition-all ${currentUser.id === emp.id ? 'bg-red-50 border border-red-100 shadow-sm' : 'hover:bg-slate-50 border border-transparent'}`}
                  >
                    <div>
                      <span className={`block text-sm font-bold ${currentUser.id === emp.id ? 'text-red-600' : 'text-slate-800'}`}>{emp.name}</span>
                      <span className="block text-[11px] font-medium text-slate-400 mt-1">{emp.id} • <span className="font-bold text-slate-500">{emp.branch}</span></span>
                    </div>
                    {currentUser.id === emp.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.6)]"></div>
                    )}
                  </button>
                )) : (
                  <div className="py-12 text-center text-slate-400 text-sm font-medium">
                    Data karyawan tidak ditemukan.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <Dashboard key="dashboard" role={authUser?.role || 'EMPLOYEE'} onNavigate={setActiveTab} />
          )}
          {activeTab === 'absen' && (
            <AttendancePage 
              key="absen" 
              user={currentUser} 
              employees={employees} 
              onBack={() => setActiveTab('dashboard')} 
            />
          )}
          {activeTab === 'profil' && (
            <ProfilePage 
              key="profil"
              user={currentUser} 
              onBack={() => setActiveTab('dashboard')} 
              isEditable={authUser?.role === 'ADMIN'}
              onSave={handleUpdateEmployee}
            />
          )}
          {activeTab === 'finance' && (
            <FinancePage 
              key="finance" 
              onBack={() => setActiveTab('dashboard')} 
              user={currentUser} 
            />
          )}
          {activeTab === 'pengajuan' && (
            <SubmissionPage 
              key="pengajuan" 
              user={currentUser} 
              onBack={() => setActiveTab('dashboard')} 
            />
          )}
          {activeTab === 'laporan' && (
            <ReportPage 
              key="laporan" 
              onBack={() => setActiveTab('dashboard')} 
            />
          )}
          {activeTab === 'control' && authUser?.role === 'ADMIN' && (
            <ControlPanel 
              key="control" 
              onBack={() => setActiveTab('dashboard')} 
            />
          )}
          
          {/* TAMPILAN HALAMAN SOCIAL MEDIA */}
          {activeTab === 'social' && (
            <SocialMediaPage 
              key="social" 
              onBack={() => setActiveTab('dashboard')} 
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
