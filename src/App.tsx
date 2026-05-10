import React, { useState, useEffect } from 'react';
import { User, UserRole, Warga, Iuran, LaporanKeuangan } from './types';
import { LayoutDashboard, Users, CreditCard, PieChart, ShieldCheck, LogOut, Menu, X, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// --- INITIAL MOCK DATA ---
const MOCK_WARGA: Warga[] = [
  { id: '1', nama: 'Budi Santoso', blok: 'A', nomor: '12', status: 'aktif' },
  { id: '2', nama: 'Siti Aminah', blok: 'B', nomor: '05', status: 'aktif' },
  { id: '3', nama: 'Agus Salim', blok: 'C', nomor: '21', status: 'aktif' },
];

const MOCK_IURAN: Iuran[] = [
  { id: '1', wargaId: '1', nominal: 50000, tanggal: new Date().toISOString(), bulan: 4, tahun: 2024, kategori: 'wajib' },
  { id: '2', wargaId: '2', nominal: 50000, tanggal: new Date().toISOString(), bulan: 4, tahun: 2024, kategori: 'wajib' },
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'warga' | 'iuran' | 'laporan'>('dashboard');
  const [warga, setWarga] = useState<Warga[]>(MOCK_WARGA);
  const [iuran, setIuran] = useState<Iuran[]>(MOCK_IURAN);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Persistence (Simulated Database)
  useEffect(() => {
    const savedWarga = localStorage.getItem('kas_rt_warga');
    const savedIuran = localStorage.getItem('kas_rt_iuran');
    const savedUser = localStorage.getItem('kas_rt_user');
    
    if (savedWarga) setWarga(JSON.parse(savedWarga));
    if (savedIuran) setIuran(JSON.parse(savedIuran));
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    localStorage.setItem('kas_rt_warga', JSON.stringify(warga));
    localStorage.setItem('kas_rt_iuran', JSON.stringify(iuran));
  }, [warga, iuran]);

  const handleLogin = (role: UserRole) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: role === 'vip' ? 'VIP Resident' : 'Tamu Warga',
      email: `${role}@example.com`,
      role
    };
    setUser(newUser);
    localStorage.setItem('kas_rt_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('kas_rt_user');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100"
        >
          <div className="text-center mb-8">
            <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <ShieldCheck className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Kas RT Pintar</h1>
            <p className="text-slate-500 mt-2">Pilih mode akses aplikasi iuran warga</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => handleLogin('tamu')}
              className="w-full py-4 px-6 rounded-2xl border-2 border-slate-100 flex items-center justify-between hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="text-left">
                <span className="block font-semibold text-slate-800 group-hover:text-blue-700">Akses Tamu</span>
                <span className="text-xs text-slate-500">Hanya melihat data & laporan publik</span>
              </div>
              <Menu className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
            </button>

            <button 
              onClick={() => handleLogin('vip')}
              className="w-full py-4 px-6 rounded-2xl border-2 border-amber-100 bg-amber-50/30 flex items-center justify-between hover:border-amber-500 hover:bg-amber-50 transition-all group"
            >
              <div className="text-left">
                <span className="block font-semibold text-amber-900 group-hover:text-amber-700 flex items-center gap-2">
                  Akses VIP <Coins className="w-4 h-4 text-amber-500" />
                </span>
                <span className="text-xs text-amber-700/60">Kelola data, input iuran & fitur cuan</span>
              </div>
              <ShieldCheck className="w-5 h-5 text-amber-500 group-hover:text-amber-600" />
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">
            Versi Demo 1.0 - Mendukung Sinkronisasi Local
          </p>
        </motion.div>
      </div>
    );
  }

  const isVIP = user.role === 'vip' || user.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-2 rounded-lg">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-slate-800">Kas RT</span>
          </div>
          
          <nav className="space-y-1">
            <NavButton 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
              icon={<LayoutDashboard size={20} />} 
              label="Dashboard" 
            />
            <NavButton 
              active={activeTab === 'warga'} 
              onClick={() => setActiveTab('warga')} 
              icon={<Users size={20} />} 
              label="Data Warga" 
            />
            <NavButton 
              active={activeTab === 'iuran'} 
              onClick={() => setActiveTab('iuran')} 
              icon={<CreditCard size={20} />} 
              label={isVIP ? "Kelola Iuran" : "Riwayat Iuran"} 
            />
            <NavButton 
              active={activeTab === 'laporan'} 
              onClick={() => setActiveTab('laporan')} 
              icon={<PieChart size={20} />} 
              label="Laporan Keuangan" 
            />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              {user.name[0]}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
              <p className={cn("text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full w-fit", 
                isVIP ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600")}>
                {user.role}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-red-500 text-sm font-medium hover:bg-red-50 p-2 rounded-lg transition-colors"
          >
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-slate-800">Kas RT</span>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="p-4 space-y-1">
              <NavButton mobile active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsMenuOpen(false); }} icon={<LayoutDashboard size={20} />} label="Dashboard" />
              <NavButton mobile active={activeTab === 'warga'} onClick={() => { setActiveTab('warga'); setIsMenuOpen(false); }} icon={<Users size={20} />} label="Data Warga" />
              <NavButton mobile active={activeTab === 'iuran'} onClick={() => { setActiveTab('iuran'); setIsMenuOpen(false); }} icon={<CreditCard size={20} />} label={isVIP ? "Kelola Iuran" : "Riwayat Iuran"} />
              <NavButton mobile active={activeTab === 'laporan'} onClick={() => { setActiveTab('laporan'); setIsMenuOpen(false); }} icon={<PieChart size={20} />} label="Laporan Keuangan" />
              <div className="pt-4 mt-4 border-t border-slate-100">
                <button onClick={handleLogout} className="w-full flex items-center gap-2 text-red-500 font-medium p-2"><LogOut size={18} /> Keluar</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard user={user} iuran={iuran} warga={warga} />}
          {activeTab === 'warga' && <WargaManager isVIP={isVIP} warga={warga} setWarga={setWarga} />}
          {activeTab === 'iuran' && <IuranManager isVIP={isVIP} iuran={iuran} setIuran={setIuran} warga={warga} />}
          {activeTab === 'laporan' && <ReportsView iuran={iuran} />}
        </div>
      </main>
    </div>
  );
}

function NavButton({ icon, label, active, onClick, mobile }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, mobile?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
        active 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
        mobile && "text-lg"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// --- SUBMODUL DASHBOARD ---
function Dashboard({ user, iuran, warga }: { user: User, iuran: Iuran[], warga: Warga[] }) {
  const totalKas = iuran.reduce((acc, curr) => acc + curr.nominal, 0);
  const totalBulanIni = iuran
    .filter(i => i.bulan === new Date().getMonth() + 1 && i.tahun === new Date().getFullYear())
    .reduce((acc, curr) => acc + curr.nominal, 0);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Selamat datang, {user.name}!</h2>
        <p className="text-slate-500">Ringkasan pengelolaan iuran RT 001 bulan ini.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Saldo Kas" 
          value={`Rp ${totalKas.toLocaleString()}`} 
          trend="+5.2%" 
          color="blue" 
          icon={<Coins className="w-6 h-6" />}
        />
        <StatCard 
          title="Iuran Bulan Ini" 
          value={`Rp ${totalBulanIni.toLocaleString()}`} 
          trend="85% Target" 
          color="emerald" 
          icon={<CreditCard className="w-6 h-6" />}
        />
        <StatCard 
          title="Total Warga" 
          value={warga.length.toString()} 
          trend="Aktif" 
          color="slate" 
          icon={<Users className="w-6 h-6" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Iuran Terbaru</h3>
          <div className="space-y-4">
            {iuran.slice(0, 5).reverse().map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Coins className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{warga.find(w => w.id === item.wargaId)?.nama || 'Warga Anonim'}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{item.kategori} - {item.bulan}/{item.tahun}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-emerald-600">+ Rp {item.nominal.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              Ingin Dapat Cuan Tambahan? <Coins className="w-5 h-5 text-amber-300" />
            </h3>
            <p className="text-blue-100 text-sm mb-6 max-w-sm">
              Upgrade ke VIP untuk mengaktifkan fitur Marketplace RT dan Iklan Lokal. Kelola jualan warga dan dapatkan bagi hasil admin!
            </p>
            <button className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-colors">
              Upgrade VIP Sekarang
            </button>
          </div>
          <div className="absolute -bottom-8 -right-8 opacity-10 blur-2xl flex gap-4">
            <Coins size={150} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, color, icon }: { title: string, value: string, trend: string, color: 'blue' | 'emerald' | 'slate', icon: React.ReactNode }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100 shadow-blue-50/50",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-50/50",
    slate: "bg-slate-50 text-slate-600 border-slate-100 shadow-slate-50/50",
  };

  return (
    <div className={cn("bg-white p-6 rounded-3xl border shadow-md", colors[color])}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-2xl bg-white shadow-sm border border-inherit">
          {icon}
        </div>
        <span className="text-xs font-bold px-2 py-1 bg-white/80 rounded-full border border-inherit">
          {trend}
        </span>
      </div>
      <p className="text-sm font-medium opacity-70">{title}</p>
      <h4 className="text-2xl font-bold mt-1">{value}</h4>
    </div>
  );
}

// --- SUBMODUL WARGA ---
function WargaManager({ isVIP, warga, setWarga }: { isVIP: boolean, warga: Warga[], setWarga: (w: Warga[]) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newWarga, setNewWarga] = useState({ nama: '', blok: '', nomor: '' });

  const addWarga = () => {
    if (!newWarga.nama) return;
    const item: Warga = {
      id: Math.random().toString(36).substr(2, 9),
      ...newWarga,
      status: 'aktif'
    };
    setWarga([...warga, item]);
    setIsAdding(false);
    setNewWarga({ nama: '', blok: '', nomor: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Daftar Warga</h2>
          <p className="text-slate-500">Katalog penduduk RT 001</p>
        </div>
        {isVIP && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Users size={18} /> Tambah Warga
          </button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-3xl border border-blue-100 shadow-xl"
          >
            <h3 className="font-bold mb-4">Warga Baru</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input 
                type="text" placeholder="Nama Lengkap" 
                className="p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500" 
                value={newWarga.nama} onChange={e => setNewWarga({...newWarga, nama: e.target.value})}
              />
              <input 
                type="text" placeholder="Blok" 
                className="p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500" 
                value={newWarga.blok} onChange={e => setNewWarga({...newWarga, blok: e.target.value})}
              />
              <input 
                type="text" placeholder="Nomor" 
                className="p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500" 
                value={newWarga.nomor} onChange={e => setNewWarga({...newWarga, nomor: e.target.value})}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsAdding(false)} className="text-slate-500 px-4 py-2">Batal</button>
              <button onClick={addWarga} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold">Simpan</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Nama</th>
              <th className="px-6 py-4 font-semibold">Lokasi</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              {isVIP && <th className="px-6 py-4 font-semibold text-right">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {warga.map(w => (
              <tr key={w.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {w.nama[0]}
                    </div>
                    <span className="font-medium text-slate-800">{w.nama}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">Blok {w.blok} No. {w.nomor}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase">
                    {w.status}
                  </span>
                </td>
                {isVIP && (
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setWarga(warga.filter(item => item.id !== w.id))} className="text-red-400 hover:text-red-600 transition-colors">
                      Hapus
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- SUBMODUL IURAN ---
function IuranManager({ isVIP, iuran, setIuran, warga }: { isVIP: boolean, iuran: Iuran[], setIuran: (i: Iuran[]) => void, warga: Warga[] }) {
  const [formData, setFormData] = useState({ wargaId: '', nominal: 50000, kategori: 'wajib' as any });

  const addIuran = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.wargaId) return;
    const now = new Date();
    const item: Iuran = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      tanggal: now.toISOString(),
      bulan: now.getMonth() + 1,
      tahun: now.getFullYear(),
    };
    setIuran([...iuran, item]);
    setFormData({ ...formData, wargaId: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Catat Iuran</h2>
          <p className="text-slate-500">Kelola setoran warga bulan ini</p>
        </div>
      </div>

      {isVIP ? (
        <form onSubmit={addIuran} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2 w-full">
            <label className="text-xs font-bold text-slate-400 uppercase">Warga</label>
            <select 
              className="w-full p-3 bg-slate-50 border-none rounded-xl"
              value={formData.wargaId}
              onChange={e => setFormData({...formData, wargaId: e.target.value})}
            >
              <option value="">Pilih Warga...</option>
              {warga.map(w => <option key={w.id} value={w.id}>{w.nama} (Blok {w.blok})</option>)}
            </select>
          </div>
          <div className="flex-1 space-y-2 w-full">
            <label className="text-xs font-bold text-slate-400 uppercase">Kategori</label>
            <select 
              className="w-full p-3 bg-slate-50 border-none rounded-xl"
              value={formData.kategori}
              onChange={e => setFormData({...formData, kategori: e.target.value as any})}
            >
              <option value="wajib">Iuran Wajib</option>
              <option value="sampah">Sampah</option>
              <option value="keamanan">Keamanan</option>
              <option value="sukarela">Sukarela</option>
            </select>
          </div>
          <div className="flex-1 space-y-2 w-full">
            <label className="text-xs font-bold text-slate-400 uppercase">Nominal</label>
            <input 
              type="number" 
              className="w-full p-3 bg-slate-50 border-none rounded-xl"
              value={formData.nominal}
              onChange={e => setFormData({...formData, nominal: Number(e.target.value)})}
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
            Simpan
          </button>
        </form>
      ) : (
        <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-center gap-4">
          <ShieldCheck className="text-amber-500 shrink-0" />
          <p className="text-sm text-amber-800">
            Hanya user dengan akses **VIP** yang dapat mencatat iuran baru. Silahkan hubungi bendahara untuk input data.
          </p>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Warga</th>
              <th className="px-6 py-4 font-semibold">Kategori</th>
              <th className="px-6 py-4 font-semibold">Bulan/Tahun</th>
              <th className="px-6 py-4 font-semibold">Nominal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {iuran.slice().reverse().map(i => (
              <tr key={i.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-medium text-slate-800">{warga.find(w => w.id === i.wargaId)?.nama || 'Dihapus'}</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-600 capitalize">{i.kategori}</span>
                </td>
                <td className="px-6 py-4 text-slate-600">{i.bulan} / {i.tahun}</td>
                <td className="px-6 py-4 font-bold text-emerald-600">Rp {i.nominal.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- SUBMODUL LAPORAN ---
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function ReportsView({ iuran }: { iuran: Iuran[] }) {
  const chartData = [
    { name: 'Jan', total: 0 }, { name: 'Feb', total: 0 }, { name: 'Mar', total: 0 },
    { name: 'Apr', total: 100000 }, { name: 'Mei', total: 0 }, { name: 'Jun', total: 0 },
  ];

  // Map iuran to months
  iuran.forEach(item => {
    if (item.tahun === 2024 && item.bulan <= 6) {
      chartData[item.bulan - 1].total += item.nominal;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Laporan Grafik</h2>
          <p className="text-slate-500">Visualisasi pemasukan kas RT</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <Tooltip 
              cursor={{fill: '#f8fafc'}}
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="total" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.total > 0 ? '#2563eb' : '#e2e8f0'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold mb-4">Pengeluaran Rutin</h3>
          <p className="text-slate-400 text-sm mb-6">Fitur pencatatan pengeluaran (Gaji satpam, kebersihan) hanya tersedia di versi VIP Pro.</p>
          <div className="space-y-3 opacity-30 select-none">
            <div className="flex justify-between p-3 bg-red-50 rounded-xl">
              <span className="font-medium">Gaji Satpam</span>
              <span className="font-bold text-red-600">Rp 1.500.000</span>
            </div>
            <div className="flex justify-between p-3 bg-red-50 rounded-xl">
              <span className="font-medium">Kebersihan</span>
              <span className="font-bold text-red-600">Rp 500.000</span>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 shadow-sm">
          <h3 className="font-bold text-emerald-900 mb-2">Export Data (Excel/PDF)</h3>
          <p className="text-emerald-700 text-sm mb-6">Minta laporan resmi untuk rapat RT. Fitur ini membantu transparansi pengurus ke warga.</p>
          <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
            Download Laporan
          </button>
        </div>
      </div>
    </div>
  );
}
