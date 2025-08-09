import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            SiResah
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Sistem Aspirasi & Resah Mahasiswa
          </p>
          <p className="text-lg text-gray-500">
            Platform untuk menyampaikan aspirasi dan keluhan mahasiswa
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Mahasiswa Card */}
          <Link href="/mahasiswa/login" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Mahasiswa</h2>
                <p className="text-gray-600 mb-6">
                  Sampaikan aspirasi dan keluhan Anda untuk perbaikan kampus
                </p>
                <ul className="text-left text-sm text-gray-500 space-y-2 mb-6">
                  <li>• Kirim keluhan/aspirasi</li>
                  <li>• Pilih kategori dan lokasi</li>
                  <li>• Voting dan komentar</li>
                  <li>• Pantau status keluhan</li>
                  <li>• Dashboard pribadi (dengan login)</li>
                </ul>
              </div>
            </div>
          </Link>

          {/* Admin Card */}
          <Link href="/admin" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin</h2>
                <p className="text-gray-600 mb-6">
                  Kelola dan tanggapi aspirasi mahasiswa dengan efektif
                </p>
                <ul className="text-left text-sm text-gray-500 space-y-2">
                  <li>• Dashboard keluhan</li>
                  <li>• Filter berdasarkan kategori</li>
                  <li>• Respon resmi</li>
                  <li>• Statistik dan laporan</li>
                </ul>
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-500">
            Bersama membangun kampus yang lebih baik
          </p>
        </div>
      </div>
    </div>
  );
}
