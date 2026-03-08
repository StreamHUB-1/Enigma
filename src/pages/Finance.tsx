import React, { useState, useEffect, useRef } from 'react';
import { Wallet, CreditCard, Calendar, ArrowLeft, ChevronDown, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion'; 
import { Role } from '../types';

// --- Komponen Input Uang ---
const CurrencyInput = ({ defaultValue = "-", className = "", style = {} }: any) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/\D/g, ''); // Cuma ambil angka
    
    if (!numericValue) {
      setValue(""); // Biarin kosong pas lagi diketik
      return;
    }

    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setValue(formattedValue);
  };

  const handleFocus = () => {
    if (value === "-") setValue("");
  };

  const handleBlur = () => {
    if (value === "") setValue("-");
  };

  return (
    <input
      type="text"
      className={className}
      style={style}
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};

// --- Komponen Input Teks Biasa & Textarea ---
const TextInput = ({ defaultValue = "-", className = "", style = {}, isTextArea = false, rows = 3 }: any) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e: any) => {
    setValue(e.target.value);
  };

  const handleFocus = () => {
    if (value === "-") setValue("");
  };

  const handleBlur = () => {
    if (value === "") setValue("-");
  };

  if (isTextArea) {
    return (
      <textarea
        className={className}
        style={style}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        rows={rows}
      />
    );
  }

  return (
    <input
      type="text"
      className={className}
      style={style}
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};

// --- Sub-Komponen Dokumen ---
const SalarySlip = ({ isAdmin }: { isAdmin: boolean }) => {
  return (
    <div className="sg-wrapper" style={{ position: 'relative' }}>
      {isAdmin && <input type="checkbox" id="sg-editToggle" style={{ display: 'none' }} />}

      <div className="sg-container">
        <div className="sg-header">
          <div className="sg-company">
            <strong>CV. ENIGMA/PEKA GROUP</strong><br />
            Jl. Griya Mulatama Blok A5 No 2 Pondok Cabe Ilir<br />
            Pamulang Tangerang Selatan 15418
          </div>
          <div className="sg-title">SLIP GAJI</div>
        </div>

        <div className="sg-emp-info">
          <div className="sg-grid-info">
            <span>No</span><span>:</span>
            <TextInput className="editable" /> 
            <span>Nama</span><span>:</span>
            <TextInput className="editable" />
            <span>Cabang</span><span>:</span>
            <TextInput className="editable" /> 
            <span>Golongan</span><span>:</span>
            <TextInput className="editable" />
          </div>
          <div className="sg-grid-info">
            <span>Bidang</span><span>:</span>
            <TextInput className="editable" /> 
            <span>Jabatan</span><span>:</span>
            <TextInput className="editable" />
            <span>Periode</span><span>:</span>
            <TextInput className="editable" /> 
            <span></span><span></span><span></span>
          </div>
        </div>

        <div className="sg-table-header">
          <div className="sg-col-left">PENERIMAAN</div>
          <div className="sg-col-right">POTONGAN</div>
        </div>

        <div className="sg-table-body">
          <div className="sg-body-left">
            <div className="sg-list">
              <span>Gaji Pokok</span><span>:</span>
              <CurrencyInput className="editable sg-right-align" />
              <span>Tunj Makan</span><span>:</span>
              <CurrencyInput className="editable sg-right-align" />
              <span>Tunj Transport</span><span>:</span>
              <CurrencyInput className="editable sg-right-align" />
              <span>Tunjangan Kinerja</span><span>:</span>
              <CurrencyInput className="editable sg-right-align" />
              <span>Tunj Beras</span><span>:</span>
              <CurrencyInput className="editable sg-right-align" />
              <span>Insentif Rematching</span><span>:</span>
              <CurrencyInput className="editable sg-right-align" />
              <span>Insentif Salon</span><span>:</span>
              <CurrencyInput className="editable sg-right-align" />
              <span>Insentif AC</span><span>:</span>
              <CurrencyInput className="editable sg-right-align" />
              <span>Insentif HCS</span><span>:</span>
              <CurrencyInput className="editable sg-right-align" />
              <span>Insentif Catalytic</span><span>:</span>
              <CurrencyInput className="editable sg-right-align" />
              <span>Backup</span><span>:</span>
              <CurrencyInput className="editable sg-right-align" />
              <span>Tunj Lembur/Piket</span><span>:</span>
              <CurrencyInput className="editable sg-right-align" />
            </div>
          </div>
          <div className="sg-body-right">
            <div className="sg-list">
              <span>Pot. Absensi</span><span>:</span>
              <CurrencyInput className="editable sg-right-align" />
              <span>Pot. Keterlambatan</span><span>:</span>
              <CurrencyInput className="editable sg-right-align" />
              <span>Pot. BPJS Kesehatan</span><span>:</span>
              <CurrencyInput className="editable sg-right-align" />
              <span>Pot. BPJS Ketenagakerjaan</span><span>:</span>
              <CurrencyInput className="editable sg-right-align" />
              <span>Pot. Accident</span><span>:</span>
              <CurrencyInput className="editable sg-right-align" />
              <span>Pinj. Uang Kokas</span><span>:</span>
              <CurrencyInput className="editable sg-right-align" />
              <span>Sim. Pokok kokas</span><span>:</span>
              <CurrencyInput className="editable sg-right-align" />
              <span>Sim. Wajib kokas</span><span>:</span>
              <CurrencyInput className="editable sg-right-align" />
              <span>Sim. Sukarela kokas</span><span>:</span>
              <CurrencyInput className="editable sg-right-align" />
            </div>
          </div>
        </div>

        <div className="sg-total-row">
          <div className="sg-total-left">
            <strong>Total Penerimaan</strong>
            <div className="sg-value-group">
              <strong>Rp</strong>
              <CurrencyInput className="editable sg-right-align fw-bold" />
            </div>
          </div>
          <div className="sg-total-right">
            <strong>Total Potongan</strong>
            <div className="sg-value-group">
              <strong>Rp</strong>
              <CurrencyInput className="editable sg-right-align fw-bold" />
            </div>
          </div>
        </div>

        <div className="sg-footer">
          <div className="sg-thp-row">
            <div className="sg-thp-box">
              <strong>TAKE HOME PAY</strong>
              <div className="sg-value-group">
                <strong>Rp</strong>
                <CurrencyInput className="editable sg-right-align fw-bold" />
              </div>
            </div>
            <div className="sg-accident-box">
              <span>Sisa Accident</span><span>:</span>
              <div className="sg-value-group">
                <span>Rp</span>
                <CurrencyInput className="editable sg-right-align" />
              </div>
            </div>
          </div>

          <div className="sg-bpjs-info">
            <div className="sg-grid-info">
              <span>No. BPJS Kesehatan</span><span>:</span>
              <TextInput className="editable" />
              <span>No. BPJS Ketenagakerjaan</span><span>:</span>
              <TextInput className="editable" />
            </div>
          </div>

          <div className="sg-signatures">
            <div className="sg-bank-info">
              <strong>Di Transfer ke</strong>
              <div className="sg-grid-info" style={{ marginTop: '5px' }}>
                <span>Bank</span><span>:</span>
                <TextInput className="editable" /> 
                <span>No Rek</span><span>:</span>
                <TextInput className="editable" />
                <span>Atas Nama</span><span>:</span>
                <TextInput className="editable" />
              </div>
            </div>
            <div className="sg-sign-box">
              <div className="sg-sign-title">CV ENIGMA</div>
              <div className="sg-sign-name">Human Capital</div>
            </div>
            <div className="sg-sign-box">
              <div className="sg-sign-title">Penerima</div>
              <TextInput className="editable sg-sign-name fw-bold" style={{ width: '100%', textAlign: 'center' }} />
            </div>
          </div>
        </div>
      </div>

      {isAdmin && (
        <label htmlFor="sg-editToggle" className="sg-edit-button">
          <svg className="sg-edit-svgIcon" viewBox="0 0 512 512">
            <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
          </svg>
        </label>
      )}
    </div>
  );
};

const KokasBalance = ({ isAdmin }: { isAdmin: boolean }) => {
  return (
    <div className="document-wrapper">
      {isAdmin && <input type="checkbox" id="kokas-editToggle" style={{ display: 'none' }} />}

      <div className="kokas-container">
        <div className="header-title">Saldo Simpanan dan Pinjaman Anggota Kokas</div>

        <div className="info-grid">
          <div>Periode</div><div className="colon">:</div>
          <div><TextInput className="editable-input mw-200" /></div>
          <div>No</div><div className="colon">:</div>
          <div><TextInput className="editable-input mw-200" /></div>
          <div>Nama</div><div className="colon">:</div>
          <div><TextInput className="editable-input mw-350" /></div>
          <div>Nomor Anggota</div><div className="colon">:</div>
          <div><TextInput className="editable-input mw-200" /></div>
          <div>Cabang</div><div className="colon">:</div>
          <div><TextInput className="editable-input mw-350" /></div>
        </div>

        <div className="sub-header">
          <div className="sub-header-col border-right">SALDO SIMPANAN</div>
          <div className="sub-header-col">SALDO PINJAMAN</div>
        </div>

        <div className="content-body">
          <div className="col-padding border-right">
            <div className="data-row"><div className="label-left">Simpanan Pokok</div><div className="colon">:</div><div className="value-group"><span className="rp-symbol">Rp</span><CurrencyInput className="editable-input align-right" /></div></div>
            <div className="data-row"><div className="label-left">Simpanan Wajib</div><div className="colon">:</div><div className="value-group"><span className="rp-symbol">Rp</span><CurrencyInput className="editable-input align-right" /></div></div>
            <div className="data-row"><div className="label-left">Simpanan Sukarela</div><div className="colon">:</div><div className="value-group"><span className="rp-symbol">Rp</span><CurrencyInput className="editable-input align-right" /></div></div>
          </div>

          <div className="col-padding">
            <div className="data-row"><div className="label-right">Pinjaman</div><div className="colon">:</div><div className="value-group"><span className="rp-symbol">Rp</span><CurrencyInput className="editable-input align-right" /></div></div>
            <div className="data-row"><div className="label-right">Angsuran ke 1</div><div className="colon">:</div><div className="value-group"><span className="rp-symbol">Rp</span><CurrencyInput className="editable-input align-right" /></div></div>
            <div className="data-row"><div className="label-right">Angsuran ke 2</div><div className="colon">:</div><div className="value-group"><span className="rp-symbol">Rp</span><CurrencyInput className="editable-input align-right" /></div></div>
            <div className="data-row"><div className="label-right">Angsuran ke 3</div><div className="colon">:</div><div className="value-group"><span className="rp-symbol">Rp</span><CurrencyInput className="editable-input align-right" /></div></div>
            <div className="data-row"><div className="label-right">Angsuran ke 4</div><div className="colon">:</div><div className="value-group"><span className="rp-symbol">Rp</span><CurrencyInput className="editable-input align-right" /></div></div>
            <div className="data-row"><div className="label-right">Angsuran ke 5</div><div className="colon">:</div><div className="value-group"><span className="rp-symbol">Rp</span><CurrencyInput className="editable-input align-right" /></div></div>
            <div className="data-row"><div className="label-right">Angsuran ke 6</div><div className="colon">:</div><div className="value-group"><span className="rp-symbol">Rp</span><CurrencyInput className="editable-input align-right" /></div></div>
            <div className="spacer-row"></div>
            <div className="data-row"><div className="label-right">Jumlah Angsuran</div><div className="colon">:</div><div className="value-group"><span className="rp-symbol">Rp</span><CurrencyInput className="editable-input align-right" /></div></div>
          </div>
        </div>

        <div className="footer-total">
          <div className="footer-col border-right">
            <div className="label-left">Jumlah Simpanan</div>
            <div className="value-group"><span className="rp-symbol">Rp</span><CurrencyInput className="editable-input align-right" /></div>
          </div>
          <div className="footer-col">
            <div className="label-right">Sisa Pinjaman</div>
            <div className="value-group"><span className="rp-symbol">Rp</span><CurrencyInput className="editable-input align-right" /></div>
          </div>
        </div>

        <div className="ttd-section">
          <div className="ttd-box">
            <span>TTD</span>
            <div className="ttd-space"></div>
            <TextInput defaultValue="Septi Listiarini ( KOKAS )" className="editable-input mw-200" style={{ fontWeight: 'bold' }} />
          </div>
        </div>
      </div>

      {isAdmin && (
        <label htmlFor="kokas-editToggle" className="kokas-edit-button">
          <svg className="kokas-edit-svgIcon" viewBox="0 0 512 512">
            <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
          </svg>
        </label>
      )}
    </div>
  );
};

const LeaveFormDocument = ({ isAdmin }: { isAdmin: boolean }) => {
  return (
    <div className="fc-wrapper">
      {isAdmin && <input type="checkbox" id="fc-editToggle" style={{ display: 'none' }} />}

      <div className="fc-container">
        <div className="fc-header">
          <div className="fc-header-left">FORM CUTI</div>
          <div className="fc-header-center">
            <span>No</span> <span className="fc-space-mx">:</span>
            <TextInput className="fc-editable-input fc-w-120" />
          </div>
          <div className="fc-header-right">
            <span>Tanggal</span> <span className="fc-space-mx">:</span>
            <TextInput className="fc-editable-input fc-w-100" />
          </div>
        </div>

        <div className="fc-line"></div>

        <div className="fc-body-container">
          <div className="fc-item"><div className="fc-label">Nama</div><div className="fc-colon">:</div><div className="fc-val"><TextInput className="fc-editable-input fc-fw-bold" /></div></div>
          <div className="fc-item"><div className="fc-label">Lama Bekerja</div><div className="fc-colon">:</div><div className="fc-val"><TextInput className="fc-editable-input" /></div></div>
          <div className="fc-item"><div className="fc-label">Hp</div><div className="fc-colon">:</div><div className="fc-val"><TextInput className="fc-editable-input" /></div></div>
          <div className="fc-item"><div className="fc-label">Departemen</div><div className="fc-colon">:</div><div className="fc-val"><TextInput className="fc-editable-input" /></div></div>
          
          <div className="fc-item">
            <div className="fc-label">Alamat</div><div className="fc-colon">:</div>
            <div className="fc-val"><TextInput isTextArea={true} className="fc-editable-input fc-textarea" rows={3} /></div>
          </div>
          <div className="fc-empty"></div>
          
          <div className="fc-item"><div className="fc-label">Hak Cuti</div><div className="fc-colon">:</div><div className="fc-val fc-val-group"><TextInput className="fc-editable-input fc-w-30" /><span>(Hari)</span></div></div>
          <div className="fc-item"><div className="fc-label">Sisa Cuti</div><div className="fc-colon">:</div><div className="fc-val fc-val-group"><TextInput className="fc-editable-input fc-w-30" /><span>(Hari)</span></div></div>
          <div className="fc-item"><div className="fc-label">Cuti Yang Diambil</div><div className="fc-colon">:</div><div className="fc-val fc-val-group"><TextInput className="fc-editable-input fc-w-30" /><span>(Hari)</span></div></div>
          <div className="fc-empty"></div>
          <div className="fc-item"><div className="fc-label">Tanggal Cuti</div><div className="fc-colon">:</div><div className="fc-val"><TextInput className="fc-editable-input" /></div></div>
          <div className="fc-empty"></div>
          <div className="fc-item"><div className="fc-label">Alasan Cuti</div><div className="fc-colon">:</div><div className="fc-val"><TextInput className="fc-editable-input" /></div></div>
          <div className="fc-empty"></div>
        </div>

        <div className="fc-line"></div>

        <div className="fc-signatures">
          <div className="fc-sign-box">
            <div className="fc-sign-title"><strong>Menyetujui<br />Manager</strong></div>
            <div className="fc-sign-bottom">(<TextInput className="fc-editable-input fc-sign-input" />)</div>
          </div>
          <div className="fc-sign-box">
            <div className="fc-sign-title"><strong><br />HRD</strong></div>
            <div className="fc-sign-bottom">(<TextInput defaultValue="SEPTI LISTIARINI" className="fc-editable-input fc-sign-input" style={{ fontWeight: 'bold' }} />)</div>
          </div>
          <div className="fc-sign-box">
            <div className="fc-sign-title"><br /><strong>Karyawan</strong></div>
            <div className="fc-sign-bottom">(<TextInput className="fc-editable-input fc-sign-input" />)</div>
          </div>
        </div>
      </div>

      {isAdmin && (
        <label htmlFor="fc-editToggle" className="fc-edit-button">
          <svg className="fc-edit-svgIcon" viewBox="0 0 512 512">
            <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
          </svg>
        </label>
      )}
    </div>
  );
};

// --- Komponen Utama ---
interface FinancePageProps {
  onBack: () => void;
  userRole: Role; 
}

export default function FinancePage({ onBack, userRole }: FinancePageProps) {
  const [salaryPeriod, setSalaryPeriod] = useState('Maret 2024');
  const [kokasPeriod, setKokasPeriod] = useState('Maret 2024');
  const [cutiPeriod, setCutiPeriod] = useState('Maret 2024');

  const isAdmin = userRole === 'ADMIN';

  const DocumentCard = ({ title, icon: Icon, colorClass, period, setPeriod, children }: any) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [containerHeight, setContainerHeight] = useState<number | 'auto'>('auto');

    useEffect(() => {
      const calculateLayout = () => {
        const width = window.innerWidth;
        if (width >= 1024) {
          setScale(1);
          setContainerHeight('auto');
        } else {
          let newScale = 0.4;
          if (width >= 640) newScale = 0.6;
          if (width >= 768) newScale = 0.8;
          setScale(newScale);
          if (contentRef.current) {
            setContainerHeight(contentRef.current.scrollHeight * newScale);
          }
        }
      };

      calculateLayout();
      window.addEventListener('resize', calculateLayout);
      const timer = setTimeout(calculateLayout, 100);
      return () => {
        window.removeEventListener('resize', calculateLayout);
        clearTimeout(timer);
      };
    }, [children]);

    return (
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${colorClass} rounded-2xl flex items-center justify-center`}>
              <Icon size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-900">{title}</h3>
          </div>
          <div className="relative">
            <select 
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold py-2 pl-4 pr-10 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option>Maret 2024</option>
              <option>Februari 2024</option>
              <option>Januari 2024</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        <div 
          className="w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-all duration-300 ease-out flex justify-center"
          style={{ height: containerHeight === 'auto' ? 'auto' : `${containerHeight}px` }}
        >
          <div 
            ref={contentRef}
            className={`origin-top transition-transform duration-300 ease-out bg-white shadow-lg`}
            style={{ transform: scale === 1 ? 'none' : `scale(${scale})` }}
          >
            {children}
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
            Lihat Detail Penuh <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold">Laporan Keuangan & Cuti</h2>
      </div>

      <div className="space-y-8">
        <DocumentCard title="Slip Gaji" icon={Wallet} colorClass="bg-amber-100 text-amber-600" period={salaryPeriod} setPeriod={setSalaryPeriod}>
          <SalarySlip isAdmin={isAdmin} />
        </DocumentCard>
        <DocumentCard title="Saldo Kokas" icon={CreditCard} colorClass="bg-emerald-100 text-emerald-600" period={kokasPeriod} setPeriod={setKokasPeriod}>
          <KokasBalance isAdmin={isAdmin} />
        </DocumentCard>
        <DocumentCard title="Form Cuti" icon={Calendar} colorClass="bg-blue-100 text-blue-600" period={cutiPeriod} setPeriod={setCutiPeriod}>
          <LeaveFormDocument isAdmin={isAdmin} />
        </DocumentCard>
      </div>
    </motion.div>
  );
}
