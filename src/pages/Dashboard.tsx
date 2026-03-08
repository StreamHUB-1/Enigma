import { Camera, UserCircle, FileText, Send, BarChart3, Settings, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Role } from '../types';

interface DashboardProps {
  role: Role;
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ role, onNavigate }: DashboardProps) {
  // Tambahin menu "Social" di array ini biar tombolnya nampil di layar
  const menus = [
    { id: 'absen', label: 'Absen', icon: Camera, desc: 'Catat kehadiran' },
    { id: 'profil', label: 'Profil', icon: UserCircle, desc: 'Detail data diri' },
    { id: 'finance', label: 'Keuangan', icon: FileText, desc: 'Gaji & Kokas' },
    { id: 'pengajuan', label: 'Pengajuan', icon: Send, desc: 'Form cuti & absen' },
    { id: 'laporan', label: 'Laporan', icon: BarChart3, desc: 'Input laporan' },
    // Menu Social Media Baru Ditambahkan di Sini:
    { id: 'social', label: 'Social', icon: Share2, desc: 'Koneksi Enigma' },
    ...(role === 'ADMIN' ? [{ id: 'control', label: 'Control Panel', icon: Settings, desc: 'Manajemen sistem' }] : [])
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-6 py-10 place-items-center max-w-5xl mx-auto"
    >
      {menus.map((menu, idx) => (
        <motion.div
          key={menu.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
          className="cyber-container noselect"
          onClick={() => onNavigate(menu.id)}
        >
          <div className="canvas">
            {[...Array(25)].map((_, i) => (
              <div key={i} className={`tracker tr-${i + 1}`}></div>
            ))}
            
            <div className="cyber-card">
              <div className="card-content">
                <div className="card-glare"></div>
                <div className="cyber-lines">
                  <span></span><span></span><span></span><span></span>
                </div>
                
                <div className="cyber-prompt">
                  <menu.icon size={56} className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                  <span>{menu.label}</span>
                </div>
                
                <div className="title">{menu.label}</div>
                
                <div className="glowing-elements">
                  <div className="glow-1"></div>
                  <div className="glow-2"></div>
                  <div className="glow-3"></div>
                </div>
                
                {/* BRANDING ENIGMA DI KARTU */}
                <div className="subtitle">
                  <span className="font-semibold text-red-500">ENIGMA</span>
                  <span className="highlight uppercase ml-2 opacity-70">| {menu.desc}</span>
                </div>
                
                <div className="card-particles">
                  <span></span><span></span><span></span><span></span><span></span><span></span>
                </div>
                
                <div className="corner-elements">
                  <span></span><span></span><span></span><span></span>
                </div>
                <div className="scan-line"></div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}