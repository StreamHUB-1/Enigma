import { Employee } from '../types';

export const BRANCHES = ['Cibubur', 'Jakarta Selatan', 'Bekasi', 'Tangerang', 'Depok'];
export const WORK_TYPES = ['Reguler', 'WFH', 'Dinas', 'Piket Reguler', 'Backup', 'Piket Hari Besar', 'Piket Hari Raya'];
export const JOB_TYPES = ['Rematching', 'Salon', 'AC'];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'admin',
    name: 'Administrator Utama',
    phone: '08123456789',
    address: 'Kantor Pusat Cibubur',
    branch: 'Cibubur',
    grade: 'A1',
    field: 'Manajemen',
    position: 'General Manager',
    joinDate: '2020-01-01',
    password: 'admin',
    role: 'ADMIN'
  },
  {
    id: 'emp001',
    name: 'Budi Santoso',
    phone: '08571234567',
    address: 'Jl. Merdeka No. 10, Jakarta',
    branch: 'Jakarta Selatan',
    grade: 'B2',
    field: 'Teknis',
    position: 'Senior Technician',
    joinDate: '2022-03-15',
    password: 'user123',
    role: 'EMPLOYEE'
  }
];
