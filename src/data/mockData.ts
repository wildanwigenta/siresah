export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: 'Belum Ditanggapi' | 'Diproses' | 'Selesai';
  priority: 'Rendah' | 'Sedang' | 'Tinggi';
  isAnonymous: boolean;
  authorName?: string;
  authorNim?: string;
  faculty: string;
  votes: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  adminResponse?: string;
}

export interface Comment {
  id: string;
  complaintId: string;
  authorName: string;
  content: string;
  createdAt: string;
  isAnonymous: boolean;
}

export interface User {
  id: string;
  name: string;
  nim: string;
  faculty: string;
  role: 'mahasiswa' | 'admin';
}

export const faculties = [
  'Fakultas Teknik',
  'Fakultas Ekonomi dan Bisnis',
  'Fakultas Ilmu Sosial dan Politik',
  'Fakultas Hukum',
  'Fakultas Kedokteran',
  'Fakultas Pertanian',
  'Fakultas Keguruan dan Ilmu Pendidikan',
  'Fakultas Matematika dan Ilmu Pengetahuan Alam'
];

export const categories = [
  'Fasilitas Kampus',
  'Akademik',
  'Administrasi',
  'Keamanan',
  'Kebersihan',
  'Transportasi',
  'Kantin/Kafeteria',
  'Perpustakaan',
  'Laboratorium',
  'Lainnya'
];

export const locations = [
  'Gedung Rektorat',
  'Gedung Fakultas Teknik',
  'Gedung Fakultas Ekonomi',
  'Gedung Fakultas Hukum',
  'Perpustakaan Pusat',
  'Laboratorium Komputer',
  'Kantin Pusat',
  'Masjid Kampus',
  'Lapangan Olahraga',
  'Parkiran',
  'Asrama',
  'Klinik Kampus'
];

export const mockComplaints: Complaint[] = [
  {
    id: '1',
    title: 'AC Ruang Kuliah Rusak',
    description: 'AC di ruang kuliah A301 sudah rusak sejak 2 minggu yang lalu. Suhu ruangan sangat panas dan mengganggu konsentrasi belajar.',
    category: 'Fasilitas Kampus',
    location: 'Gedung Fakultas Teknik',
    status: 'Diproses',
    priority: 'Tinggi',
    isAnonymous: false,
    authorName: 'Ahmad Rizki',
    authorNim: '2021001001',
    faculty: 'Fakultas Teknik',
    votes: 15,
    comments: [
      {
        id: 'c1',
        complaintId: '1',
        authorName: 'Sari Dewi',
        content: 'Setuju banget, kemarin pas ujian jadi tidak fokus karena kepanasan',
        createdAt: '2024-01-15T10:30:00Z',
        isAnonymous: false
      },
      {
        id: 'c2',
        complaintId: '1',
        authorName: 'Anonim',
        content: 'Sudah lapor ke teknisi belum?',
        createdAt: '2024-01-15T14:20:00Z',
        isAnonymous: true
      }
    ],
    createdAt: '2024-01-14T08:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
    adminResponse: 'Terima kasih atas laporannya. Tim teknisi sudah dihubungi dan akan segera memperbaiki AC tersebut.'
  },
  {
    id: '2',
    title: 'Antrian Kantin Terlalu Panjang',
    description: 'Setiap jam istirahat, antrian di kantin pusat sangat panjang. Mahasiswa sering kehabisan waktu istirahat hanya untuk mengantri.',
    category: 'Kantin/Kafeteria',
    location: 'Kantin Pusat',
    status: 'Belum Ditanggapi',
    priority: 'Sedang',
    isAnonymous: true,
    faculty: 'Fakultas Ekonomi dan Bisnis',
    votes: 23,
    comments: [
      {
        id: 'c3',
        complaintId: '2',
        authorName: 'Budi Santoso',
        content: 'Benar sekali, perlu ditambah kasir atau buka kantin cabang',
        createdAt: '2024-01-16T12:15:00Z',
        isAnonymous: false
      }
    ],
    createdAt: '2024-01-16T11:30:00Z',
    updatedAt: '2024-01-16T11:30:00Z'
  },
  {
    id: '3',
    title: 'WiFi Kampus Sering Putus',
    description: 'Koneksi WiFi di area perpustakaan sering terputus, mengganggu aktivitas penelitian dan belajar online.',
    category: 'Fasilitas Kampus',
    location: 'Perpustakaan Pusat',
    status: 'Selesai',
    priority: 'Tinggi',
    isAnonymous: false,
    authorName: 'Lisa Permata',
    authorNim: '2020002003',
    faculty: 'Fakultas Ilmu Sosial dan Politik',
    votes: 31,
    comments: [
      {
        id: 'c4',
        complaintId: '3',
        authorName: 'Anonim',
        content: 'Iya nih, kemarin pas ngerjain tugas jadi terganggu',
        createdAt: '2024-01-10T15:45:00Z',
        isAnonymous: true
      },
      {
        id: 'c5',
        complaintId: '3',
        authorName: 'Admin IT',
        content: 'Masalah sudah diperbaiki, silakan coba kembali',
        createdAt: '2024-01-12T09:00:00Z',
        isAnonymous: false
      }
    ],
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-12T09:00:00Z',
    adminResponse: 'WiFi sudah diperbaiki dan ditingkatkan kapasitasnya. Terima kasih atas laporannya.'
  },
  {
    id: '4',
    title: 'Lampu Parkiran Mati',
    description: 'Beberapa lampu di area parkiran motor mati, membuat area tersebut gelap dan tidak aman di malam hari.',
    category: 'Keamanan',
    location: 'Parkiran',
    status: 'Diproses',
    priority: 'Tinggi',
    isAnonymous: false,
    authorName: 'Doni Pratama',
    authorNim: '2021003004',
    faculty: 'Fakultas Hukum',
    votes: 18,
    comments: [],
    createdAt: '2024-01-17T19:30:00Z',
    updatedAt: '2024-01-18T08:00:00Z',
    adminResponse: 'Laporan diterima, tim maintenance sedang memeriksa dan akan segera mengganti lampu yang rusak.'
  },
  {
    id: '5',
    title: 'Toilet Kotor dan Bau',
    description: 'Kondisi toilet di lantai 2 gedung fakultas sangat kotor dan berbau tidak sedap. Perlu pembersihan rutin.',
    category: 'Kebersihan',
    location: 'Gedung Fakultas Ekonomi',
    status: 'Belum Ditanggapi',
    priority: 'Sedang',
    isAnonymous: true,
    faculty: 'Fakultas Ekonomi dan Bisnis',
    votes: 12,
    comments: [
      {
        id: 'c6',
        complaintId: '5',
        authorName: 'Anonim',
        content: 'Setuju, sangat mengganggu kenyamanan',
        createdAt: '2024-01-18T10:15:00Z',
        isAnonymous: true
      }
    ],
    createdAt: '2024-01-18T09:45:00Z',
    updatedAt: '2024-01-18T09:45:00Z'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ahmad Rizki',
    nim: '2021001001',
    faculty: 'Fakultas Teknik',
    role: 'mahasiswa'
  },
  {
    id: '2',
    name: 'Admin Kampus',
    nim: 'ADM001',
    faculty: 'Administrasi',
    role: 'admin'
  }
];

// Statistics data
export const getStatistics = () => {
  const totalComplaints = mockComplaints.length;
  const statusCounts = {
    'Belum Ditanggapi': mockComplaints.filter(c => c.status === 'Belum Ditanggapi').length,
    'Diproses': mockComplaints.filter(c => c.status === 'Diproses').length,
    'Selesai': mockComplaints.filter(c => c.status === 'Selesai').length
  };
  
  const categoryCounts = categories.map(category => ({
    category,
    count: mockComplaints.filter(c => c.category === category).length
  })).filter(item => item.count > 0);
  
  const facultyCounts = faculties.map(faculty => ({
    faculty,
    count: mockComplaints.filter(c => c.faculty === faculty).length
  })).filter(item => item.count > 0);
  
  return {
    totalComplaints,
    statusCounts,
    categoryCounts,
    facultyCounts,
    averageVotes: Math.round(mockComplaints.reduce((sum, c) => sum + c.votes, 0) / totalComplaints),
    totalVotes: mockComplaints.reduce((sum, c) => sum + c.votes, 0)
  };
};