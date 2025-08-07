'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockComplaints, categories, locations, faculties } from '@/data/mockData';
import type { Complaint } from '@/data/mockData';

export default function MahasiswaPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState({
    category: '',
    status: '',
    search: ''
  });

  const [newComplaint, setNewComplaint] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    faculty: '',
    isAnonymous: false,
    authorName: '',
    authorNim: ''
  });

  const filteredComplaints = complaints.filter(complaint => {
    const matchesCategory = !filter.category || complaint.category === filter.category;
    const matchesStatus = !filter.status || complaint.status === filter.status;
    const matchesSearch = !filter.search || 
      complaint.title.toLowerCase().includes(filter.search.toLowerCase()) ||
      complaint.description.toLowerCase().includes(filter.search.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    
    const complaint: Complaint = {
      id: Date.now().toString(),
      title: newComplaint.title,
      description: newComplaint.description,
      category: newComplaint.category,
      location: newComplaint.location,
      status: 'Belum Ditanggapi',
      priority: 'Sedang',
      isAnonymous: newComplaint.isAnonymous,
      authorName: newComplaint.isAnonymous ? undefined : newComplaint.authorName,
      authorNim: newComplaint.isAnonymous ? undefined : newComplaint.authorNim,
      faculty: newComplaint.faculty,
      votes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setComplaints([complaint, ...complaints]);
    setNewComplaint({
      title: '',
      description: '',
      category: '',
      location: '',
      faculty: '',
      isAnonymous: false,
      authorName: '',
      authorNim: ''
    });
    setShowForm(false);
    alert('Keluhan berhasil dikirim!');
  };

  const handleVote = (complaintId: string) => {
    setComplaints(complaints.map(complaint => 
      complaint.id === complaintId 
        ? { ...complaint, votes: complaint.votes + 1 }
        : complaint
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Belum Ditanggapi': return 'bg-red-100 text-red-800';
      case 'Diproses': return 'bg-yellow-100 text-yellow-800';
      case 'Selesai': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ← Kembali
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Portal Mahasiswa</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Kirim Keluhan
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Filter Keluhan</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select
                value={filter.category}
                onChange={(e) => setFilter({...filter, category: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Kategori</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({...filter, status: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Status</option>
                <option value="Belum Ditanggapi">Belum Ditanggapi</option>
                <option value="Diproses">Diproses</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari</label>
              <input
                type="text"
                value={filter.search}
                onChange={(e) => setFilter({...filter, search: e.target.value})}
                placeholder="Cari keluhan..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {filteredComplaints.map(complaint => (
            <div key={complaint.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{complaint.title}</h3>
                  <p className="text-gray-600 mb-3">{complaint.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {complaint.category}
                    </span>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                      {complaint.location}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span>Oleh: {complaint.isAnonymous ? 'Anonim' : complaint.authorName}</span>
                    <span className="mx-2">•</span>
                    <span>{complaint.faculty}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(complaint.createdAt).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 ml-4">
                  <button
                    onClick={() => handleVote(complaint.id)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <span>{complaint.votes}</span>
                  </button>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600">
                    {complaint.comments.length} komentar
                  </span>
                </div>
              </div>
              
              {complaint.adminResponse && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">
                        <strong>Respon Admin:</strong> {complaint.adminResponse}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {complaint.comments.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-medium text-gray-800 mb-3">Komentar:</h4>
                  <div className="space-y-3">
                    {complaint.comments.map(comment => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm text-gray-800">
                            {comment.isAnonymous ? 'Anonim' : comment.authorName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Kirim Keluhan/Aspirasi</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmitComplaint} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Judul Keluhan *</label>
                  <input
                    type="text"
                    required
                    value={newComplaint.title}
                    onChange={(e) => setNewComplaint({...newComplaint, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan judul keluhan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi *</label>
                  <textarea
                    required
                    rows={4}
                    value={newComplaint.description}
                    onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Jelaskan keluhan Anda secara detail"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
                    <select
                      required
                      value={newComplaint.category}
                      onChange={(e) => setNewComplaint({...newComplaint, category: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi *</label>
                    <select
                      required
                      value={newComplaint.location}
                      onChange={(e) => setNewComplaint({...newComplaint, location: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Lokasi</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fakultas *</label>
                  <select
                    required
                    value={newComplaint.faculty}
                    onChange={(e) => setNewComplaint({...newComplaint, faculty: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Fakultas</option>
                    {faculties.map(faculty => (
                      <option key={faculty} value={faculty}>{faculty}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={newComplaint.isAnonymous}
                    onChange={(e) => setNewComplaint({...newComplaint, isAnonymous: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                    Kirim sebagai anonim
                  </label>
                </div>

                {!newComplaint.isAnonymous && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nama *</label>
                      <input
                        type="text"
                        required={!newComplaint.isAnonymous}
                        value={newComplaint.authorName}
                        onChange={(e) => setNewComplaint({...newComplaint, authorName: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nama lengkap"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">NIM *</label>
                      <input
                        type="text"
                        required={!newComplaint.isAnonymous}
                        value={newComplaint.authorNim}
                        onChange={(e) => setNewComplaint({...newComplaint, authorNim: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nomor Induk Mahasiswa"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Kirim Keluhan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}