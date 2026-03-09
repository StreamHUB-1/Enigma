export type Role = 'ADMIN' | 'EMPLOYEE';

export interface Employee {
  id: string;
  name: string;
  phone: string;
  address: string;
  branch: string;
  grade: string;
  field: string;
  position: string;
  joinDate: string;
  password: string;
  role: Role;
  
  // --- Tambahan Data Baru Administrasi & Benefit ---
  anggotaKokas?: string;
  noKokas?: string;
  workDuration?: string;
  bpjsKesehatan?: string;
  bpjsKetenagakerjaan?: string;

  // --- Tambahan Data Bank & Slip Gaji ---
  slipNo?: string;
  bankName?: string;
  bankAccount?: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  branch: string;
  type: 'MASUK' | 'PULANG';
  workType: string;
  photo: string;
  timestamp: string;
}
