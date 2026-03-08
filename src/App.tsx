import React, { useState, useEffect } from 'react';
import { Building2, LogOut } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
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
// 1. TAMBAHIN IMPORT INI
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
            {authUser?.role === 'ADMIN' && (
              <div className="hidden md:block">
                <select 
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[12px] font-bold text-red-600 focus:ring-2 focus:ring-red-500 outline-none cursor-pointer max-w-[220px] truncate"
                  onChange={(e) => handleSwitchEmployee(e.target.value)}
                  value={currentUser?.id || 'admin'}
                >
                  <option value="admin">Data Admin Utama</option>
                  <optgroup label="Pilih Data Karyawan">
                    {employees.filter(e => e.role === 'EMPLOYEE').map(e => (
                      <option key={e.id} value={e.id}>{e.name} - {e.branch}</option>
                    ))}
                  </optgroup>
                </select>
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
              userRole={currentUser?.role || 'EMPLOYEE'} 
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
          
          {/* 2. TAMBAHIN ROUTING SOCIAL MEDIA DI SINI */}
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