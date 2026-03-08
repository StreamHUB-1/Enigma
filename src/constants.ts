import { Employee } from './types';

export const BRANCHES = [
  'ASTRA DAIHATSU PAMULANG',
  'ASTRA DAIHATSU PLUIT',
  'ASTRA DAIHATSU SUNTER',
  'ASTRA DAIHATSU HARAPAN INDAH',
  'ASTRA DAIHATSU NAROGONG',
  'ASTRA DAIHATSU KARAWACI',
  'ASTRA DAIHATSU KARAWANG',
  'ASTRA DAIHATSU CIBUBUR',
  'ASTRA DAIHATSU DEPOK',
  'ASTRA DAIHATSU KRANJI BEKASI',
  'ASTRA DAIHATSU ABC SERPONG',
  'ASTRA DAIHATSU CIKUPA',
  'ASTRA DAIHATSU BINTARO',
  'ASTRA DAIHATSU PONDOK CABE',
  'ASTRA DAIHATSU CIKARANG',
  'ASTRA DAIHATSU YASMIN BOGOR',
  'ASTRA DAIHATSU PONDOK PINANG',
  'ASTRA DAIHATSU PAJAJARAN BOGOR',
  'ASTRA DAIHATSU CIBINONG',
  'ASTRA DAIHATSU TAJUR',
  'ASTRA DAIHATSU KELAPA GADING',
  'ASTRA DAIHATSU RADIO DALAM',
  'ASTRA DAIHATSU CILEDUG',
  'ASTRA DAIHATSU PANGERAN JAYAKARTA',
  'AUTO 2000 PRAMUKA',
  'AUTO 2000 RADIO DALAM',
  'AUTO 2000 DAAN MOGOT',
  'AUTO 2000 KAPUK',
  'AUTO 2000 CEMPAKA PUTIH',
  'AUTO 2000 YOS SUDARSO',
  'AUTO 2000 KALIMALANG',
  'AUTO 2000 KRAMATJATI',
  'AUTO 2000 PLUIT',
  'AUTO 2000 LENTENG AGUNG',
  'AUTO 2000 GARUDA',
  'AUTO 2000 SALEMBA',
  'AUTO 2000 BINTARO',
  'AUTO 2000 BEKASI TIMUR',
  'AUTO 2000 JATIASIH',
  'AUTO 2000 BSD',
  'AUTO 2000 CIKOKOL',
  'AUTO 2000 DEPOK',
  'AUTO 2000 CIKARANG UTARA',
  'AUTO 2000 KARAWANG',
  'HONDA PERMATA HIJAU',
  'HONDA PERMATA GADING SERPONG',
  'HONDA ARTA CIKUPA',
  'HONDA PLUIT',
  'HONDA SHOLEH ISKANDAR'
];

export const WORK_TYPES = ['Reguler', 'WFH', 'Dinas', 'Piket Reguler', 'Backup', 'Piket Hari Besar', 'Piket Hari Raya'];

// Menambahkan konstanta JOB_TYPES yang sebelumnya tidak ada agar dapat diimpor oleh halaman Report.tsx.
// Nilai array disesuaikan dengan logika kondisional yang terdapat pada Report.tsx.
export const JOB_TYPES = ['Rematching', 'Salon', 'AC Care'];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'admin',
    name: 'Administrator Utama',
    phone: '08123456789',
    address: 'Kantor Pusat Enigma',
    branch: 'ASTRA DAIHATSU CIBUBUR',
    grade: 'A1',
    field: 'Manajemen',
    position: 'General Manager',
    joinDate: '2020-01-01',
    password: 'admin',
    role: 'ADMIN'
  }
];