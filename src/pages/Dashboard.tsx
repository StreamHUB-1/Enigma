import { Camera, UserCircle, FileText, Send, BarChart3, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { Role } from '../types';

interface DashboardProps {
  role: Role;
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ role, onNavigate }: DashboardProps) {
  const menus = [
    { id: 'absen', label: 'Absen', icon: Camera, desc: 'Catat kehadiran harian' },
    { id: 'profil', label: 'Profil', icon: UserCircle, desc: 'Detail data diri anda' },
    { id: 'finance', label: 'Keuangan & Cuti', icon: FileText, desc: 'Slip gaji & saldo kokas' },
    { id: 'pengajuan', label: 'Pengajuan', icon: Send, desc: 'Form cuti & kokas' },
    { id: 'laporan', label: 'Laporan', icon: BarChart3, desc: 'Input laporan pekerjaan' },
    ...(role === 'ADMIN' ? [{ id: 'control', label: 'Control Panel', icon: Settings, desc: 'Manajemen karyawan' }] : [])
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="dashboard-cards"
    >
      {menus.map((menu, idx) => (
        <motion.button
          key={menu.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05 }}
          onClick={() => onNavigate(menu.id)}
          className="dashboard-card"
        >
          <p className="tip">{menu.label}</p>
          <p className="second-text">{menu.desc}</p>
          <div className="icon-bg">
            <menu.icon size={80} />
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
}
