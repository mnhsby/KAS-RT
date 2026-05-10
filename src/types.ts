export type UserRole = 'tamu' | 'vip' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Warga {
  id: string;
  nama: string;
  blok: string;
  nomor: string;
  status: 'aktif' | 'non-aktif';
}

export interface Iuran {
  id: string;
  wargaId: string;
  nominal: number;
  tanggal: string;
  bulan: number;
  tahun: number;
  kategori: 'wajib' | 'sukarela' | 'sampah' | 'keamanan';
}

export interface LaporanKeuangan {
  totalPemasukan: number;
  totalPengeluaran: number;
  saldo: number;
  riwayat: {
    id: string;
    tipe: 'masuk' | 'keluar';
    jumlah: number;
    keterangan: string;
    tanggal: string;
  }[];
}
