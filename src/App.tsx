import React, { useState, useEffect } from 'react';
import { Building2, LogOut, Smartphone, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Import Types & Constants
import { Employee } from './types';
import { INITIAL_EMPLOYEES } from './constants';

// Import Pages
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import AttendancePage from './pages/Attendance';
import ProfilePage from './pages/Profile';
import FinancePage from './pages/Finance';
import SubmissionPage from './pages/Submission';
import ReportPage from './pages/Report';
import ControlPanel from './pages/ControlPanel';

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('portal_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });
  
  // authUser: The actual person who logged in
  const [authUser, setAuthUser] = useState<Employee | null>(() => {
    const saved = sessionStorage.getItem('portal_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  // currentUser: The user whose data we are currently viewing
  const [currentUser, setCurrentUser] = useState<Employee | null>(() => {
    const saved = sessionStorage.getItem('portal_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDexMode, setIsDexMode] = useState(false);
  const [dexScale, setDexScale] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(!!authUser);

  // Calculate scale for Dex Mode on mobile
  useEffect(() => {
    const updateScale = () => {
      if (isDexMode && window.innerWidth < 1200) {
        setDexScale(window.innerWidth / 1200);
      } else {
        setDexScale(1);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [isDexMode]);

  // Save employees to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('portal_employees', JSON.stringify(employees));
  }, [employees]);

  // Handle Login
  const handleLogin = (id: string, pass: string) => {
    const user = employees.find(e => e.id === id && e.password === pass);
    if (user) {
      setAuthUser(user);
      setCurrentUser(user);
      setIsLoggedIn(true);
      sessionStorage.setItem('portal_auth_user', JSON.stringify(user));
      sessionStorage.setItem('portal_current_user', JSON.stringify(user));
    } else {
      alert('ID atau Password salah!');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setAuthUser(null);
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActiveTab('dashboard');
    sessionStorage.removeItem('portal_auth_user');
    sessionStorage.removeItem('portal_current_user');
  };

  // Admin: Change context to another employee
  const handleSwitchEmployee = (id: string) => {
    const user = employees.find(e => e.id === id);
    if (user) {
      setCurrentUser(user);
      sessionStorage.setItem('portal_current_user', JSON.stringify(user));
    }
  };

  // Update employee data (used when Admin edits profile)
  const handleUpdateEmployee = (updatedEmp: Employee) => {
    setEmployees(prev => prev.map(e => e.id === updatedEmp.id ? updatedEmp : e));
    if (currentUser?.id === updatedEmp.id) {
      setCurrentUser(updatedEmp);
    }
    if (authUser?.id === updatedEmp.id) {
      setAuthUser(updatedEmp);
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      {/* Background for Dex Mode */}
      {isDexMode && (
        <div className="fixed inset-0 bg-[#0f172a] z-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 opacity-40 bg-cover bg-center" 
            style={{ backgroundImage: "url('https://picsum.photos/seed/desktop/1920/1080')" }}
          />
        </div>
      )}

      {/* Main App Container */}
      <div 
        className={`min-h-screen text-slate-800 font-sans ${isDexMode ? 'dex-mode relative z-10' : 'bg-[#F8FAFC]'}`}
        style={isDexMode ? { 
          width: window.innerWidth < 1200 ? '1200px' : '100%',
          transform: window.innerWidth < 1200 ? `scale(${dexScale})` : 'none',
          transformOrigin: 'top left',
          height: window.innerWidth < 1200 ? `${100 / dexScale}vh` : '100vh',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          margin: window.innerWidth < 1200 ? '0' : '0 auto',
        } : {}}
      >
        {/* Header (Navbar) */}
        <header className={`bg-white border-b border-slate-200 ${isDexMode ? 'relative' : 'sticky top-0 z-50'}`}>
          <div className={`${isDexMode ? 'w-full' : 'max-w-7xl'} mx-auto px-4 h-16 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-theme-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Building2 size={24} />
              </div>
              <div>
                <h1 className="font-bold text-slate-900 leading-tight">Secure Attendance</h1>
                <p className="text-[10px] text-primary font-bold tracking-widest uppercase">Astra Cibubur Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Dex Mode Toggle */}
              <div className="flex items-center">
                <button 
                  onClick={() => setIsDexMode(!isDexMode)}
                  className={`relative w-16 h-8 rounded-full transition-all duration-300 flex items-center px-1 ${isDexMode ? 'bg-primary' : 'bg-slate-200'}`}
                >
                  <motion.div 
                    animate={{ x: isDexMode ? 32 : 0 }}
                    className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center z-10"
                  >
                    {isDexMode ? <Monitor size={14} className="text-primary" /> : <Smartphone size={14} className="text-primary" />}
                  </motion.div>
                  <div className="absolute inset-0 flex items-center justify-between px-2 text-slate-400 pointer-events-none">
                    <Smartphone size={12} className={!isDexMode ? 'text-slate-600' : 'opacity-20'} />
                    <Monitor size={12} className={isDexMode ? 'text-white' : 'opacity-20'} />
                  </div>
                </button>
              </div>

              {/* Admin Dropdown */}
              {authUser?.role === 'ADMIN' && (
                <div className="hidden md:block">
                  <select 
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-primary focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                    onChange={(e) => handleSwitchEmployee(e.target.value)}
                    value={currentUser?.id}
                  >
                    <option value="admin">Data Admin</option>
                    <optgroup label="Pilih Data Karyawan">
                      {employees.filter(e => e.role === 'EMPLOYEE').map(e => (
                        <option key={e.id} value={e.id}>{e.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              )}

              {/* User Info & Logout */}
              <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900">{authUser?.name}</p>
                  <p className="text-[10px] text-primary font-bold uppercase">{authUser?.role}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content (Pages) */}
        <main className={`${isDexMode ? 'w-full' : 'max-w-7xl'} mx-auto px-4 py-6`}>
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <Dashboard key="dashboard" role={authUser?.role || 'EMPLOYEE'} onNavigate={setActiveTab} />
            )}
            {activeTab === 'absen' && (
              <AttendancePage key="absen" user={currentUser!} onBack={() => setActiveTab('dashboard')} />
            )}
            {activeTab === 'profil' && (
              <ProfilePage 
                key="profil"
                user={currentUser!} 
                onBack={() => setActiveTab('dashboard')} 
                isEditable={authUser?.role === 'ADMIN'}
                onSave={handleUpdateEmployee}
              />
            )}
            {activeTab === 'finance' && (
              <FinancePage key="finance" onBack={() => setActiveTab('dashboard')} userRole={currentUser.role} />
            )}
            {activeTab === 'pengajuan' && (
              <SubmissionPage key="pengajuan" user={currentUser!} onBack={() => setActiveTab('dashboard')} />
            )}
            {activeTab === 'laporan' && (
              <ReportPage key="laporan" onBack={() => setActiveTab('dashboard')} />
            )}
            {activeTab === 'control' && authUser?.role === 'ADMIN' && (
              <ControlPanel key="control" employees={employees} setEmployees={setEmployees} onBack={() => setActiveTab('dashboard')} />
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}
