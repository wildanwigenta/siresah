'use client';

import Link from 'next/link';
import { getStatistics, mockComplaints } from '@/data/mockData';

export default function StatistikPage() {
  const stats = getStatistics();
  
  // Weekly data simulation
  const weeklyData = [
    { week: 'Minggu 1', complaints: 8, resolved: 3 },
    { week: 'Minggu 2', complaints: 12, resolved: 7 },
    { week: 'Minggu 3', complaints: 6, resolved: 4 },
    { week: 'Minggu 4', complaints: 9, resolved: 6 }
  ];
  
  // Monthly data simulation
  const monthlyData = [
    { month: 'Jan', complaints: 25, resolved: 18 },
    { month: 'Feb', complaints: 32, resolved: 24 },
    { month: 'Mar', complaints: 28, resolved: 22 },
    { month: 'Apr', complaints: 35, resolved: 28 },
    { month: 'Mei', complaints: 30, resolved: 25 },
    { month: 'Jun', complaints: 22, resolved: 20 }
  ];
  
  const maxWeeklyComplaints = Math.max(...weeklyData.map(d => d.complaints));
  const maxMonthlyComplaints = Math.max(...monthlyData.map(d => d.complaints));
  
  // Recent activity
  const recentActivity = mockComplaints
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-blue-600 hover:text-blue-800">
                ← Kembali ke Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Statistik & Laporan</h1>
            </div>
            <div className="text-sm text-gray-500">
              Data diperbarui: {new Date().toLocaleDateString('id-ID')}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Keluhan</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalComplaints}</p>
                <p className="text-sm text-green-600">+12% dari bulan lalu</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tingkat Penyelesaian</p>
                <p className="text-3xl font-bold text-gray-900">
                  {Math.round((stats.statusCounts.Selesai / stats.totalComplaints) * 100)}%
                </p>
                <p className="text-sm text-green-600">+5% dari bulan lalu</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rata-rata Votes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.averageVotes}</p>
                <p className="text-sm text-blue-600">Per keluhan</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Votes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalVotes}</p>
                <p className="text-sm text-purple-600">Engagement tinggi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Statistik Mingguan</h3>
            <div className="space-y-4">
              {weeklyData.map((data, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-20 text-sm text-gray-600">{data.week}</div>
                  <div className="flex-1 mx-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                        <div 
                          className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                          style={{ width: `${(data.complaints / maxWeeklyComplaints) * 100}%` }}
                        ></div>
                        <div 
                          className="bg-green-500 h-4 rounded-full absolute top-0 transition-all duration-500"
                          style={{ width: `${(data.resolved / maxWeeklyComplaints) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 w-24">
                    {data.complaints} / {data.resolved} selesai
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center space-x-6 mt-6 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>Total Keluhan</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Selesai</span>
              </div>
            </div>
          </div>

          {/* Monthly Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Statistik Bulanan</h3>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-12 text-sm text-gray-600">{data.month}</div>
                  <div className="flex-1 mx-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                        <div 
                          className="bg-indigo-500 h-4 rounded-full transition-all duration-500"
                          style={{ width: `${(data.complaints / maxMonthlyComplaints) * 100}%` }}
                        ></div>
                        <div 
                          className="bg-emerald-500 h-4 rounded-full absolute top-0 transition-all duration-500"
                          style={{ width: `${(data.resolved / maxMonthlyComplaints) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 w-24">
                    {data.complaints} / {data.resolved} selesai
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center space-x-6 mt-6 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                <span>Total Keluhan</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                <span>Selesai</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category and Faculty Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Categories */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Kategori Terbanyak</h3>
            <div className="space-y-4">
              {stats.categoryCounts.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-gray-800">{item.category}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(item.count / stats.totalComplaints) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-600 font-medium w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Faculty Statistics */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Keluhan per Fakultas</h3>
            <div className="space-y-4">
              {stats.facultyCounts.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-gray-800 text-sm">{item.faculty.replace('Fakultas ', '')}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(item.count / stats.totalComplaints) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-600 font-medium w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Distribusi Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Belum Ditanggapi</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.statusCounts['Belum Ditanggapi']}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Diproses</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.statusCounts['Diproses']}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Selesai</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.statusCounts['Selesai']}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Aktivitas Terbaru</h3>
            <div className="space-y-4">
              {recentActivity.map((complaint, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      complaint.status === 'Selesai' ? 'bg-green-500' :
                      complaint.status === 'Diproses' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {complaint.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {complaint.category} • {complaint.faculty}
                    </p>
                    <p className="text-xs text-gray-400">
                      Diperbarui {new Date(complaint.updatedAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      complaint.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                      complaint.status === 'Diproses' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Export Laporan</h3>
          <p className="text-gray-600 mb-6">Unduh laporan statistik dalam berbagai format untuk analisis lebih lanjut.</p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              📊 Export Excel
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              📄 Export PDF
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              📈 Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}