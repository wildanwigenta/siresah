'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { categories, locations, faculties } from '@/data/mockData';
import type { Complaint } from '@/data/mockData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useComplaintsStore } from '@/lib/utils';

export default function MahasiswaPage() {
  const { complaints, isLoaded, addComplaint, incrementVotes, addComment } = useComplaintsStore();
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

  // State for comment functionality
  const [showCommentForm, setShowCommentForm] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState({
    content: '',
    isAnonymous: false,
    authorName: ''
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const complaintsPerPage = 5;

  const filteredComplaints = complaints.filter(complaint => {
    const matchesCategory = !filter.category || complaint.category === filter.category;
    const matchesStatus = !filter.status || complaint.status === filter.status;
    const matchesSearch = !filter.search ||
      complaint.title.toLowerCase().includes(filter.search.toLowerCase()) ||
      complaint.description.toLowerCase().includes(filter.search.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);
  const startIndex = (currentPage - 1) * complaintsPerPage;
  const endIndex = startIndex + complaintsPerPage;
  const currentComplaints = filteredComplaints.slice(startIndex, endIndex);

  // Trending complaints (sorted by votes + comments engagement)
  const getTrendingComplaints = () => {
    return complaints
      .map(complaint => ({
        ...complaint,
        engagement: complaint.votes + (complaint.comments.length * 2) // Weight comments more
      }))
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 5);
  };

  const trendingComplaints = getTrendingComplaints();

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

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

    addComplaint(complaint);
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
    incrementVotes(complaintId);
  };

  const handleAddComment = (complaintId: string) => {
    if (!newComment.content.trim()) return;

    const comment = {
      id: Date.now().toString(),
      complaintId,
      authorName: newComment.isAnonymous ? 'Anonim' : newComment.authorName,
      content: newComment.content,
      createdAt: new Date().toISOString(),
      isAnonymous: newComment.isAnonymous
    };

    addComment(complaintId, comment);
    setNewComment({ content: '', isAnonymous: false, authorName: '' });
    setShowCommentForm(null);
    alert('Komentar berhasil ditambahkan!');
  };

  const toggleComments = (complaintId: string) => {
    setExpandedComments(prev =>
      prev.includes(complaintId)
        ? prev.filter(id => id !== complaintId)
        : [...prev, complaintId]
    );
  };

  const toggleCommentForm = (complaintId: string) => {
    setShowCommentForm(showCommentForm === complaintId ? null : complaintId);
    setNewComment({ content: '', isAnonymous: false, authorName: '' });
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Filter Keluhan</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                  <select
                    value={filter.category}
                    onChange={(e) => setFilter({ ...filter, category: e.target.value })}
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
                    onChange={(e) => setFilter({ ...filter, status: e.target.value })}
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
                    onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                    placeholder="Cari keluhan..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Pagination Info */}
            {filteredComplaints.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredComplaints.length)} dari {filteredComplaints.length} keluhan
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Halaman:</span>
                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 text-sm rounded-md transition-colors ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Complaints List */}
            <div className="space-y-4">
              {currentComplaints.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada keluhan ditemukan</h3>
                  <p className="text-gray-600">Coba ubah filter atau kriteria pencarian Anda.</p>
                </div>
              ) : (
                currentComplaints.map(complaint => (
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
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleVote(complaint.id)}
                                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                                <span>{complaint.votes}</span>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Dukung Naik</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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

                    {/* Comment section */}
                    <div className="mt-4 border-t pt-4">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => toggleComments(complaint.id)}
                          className="text-sm text-blue-600 hover:underline flex gap-x-2 items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle-icon lucide-message-circle"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" /></svg>
                          {expandedComments.includes(complaint.id) ? 'Sembunyikan Komentar' : `Lihat Komentar (${complaint.comments.length})`}
                        </button>
                        <button
                          onClick={() => toggleCommentForm(complaint.id)}
                          className="text-sm text-blue-600 hover:underline flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Tambah Komentar
                        </button>
                      </div>

                      {expandedComments.includes(complaint.id) && (
                        <div className="mt-4">
                          {complaint.comments.length === 0 ? (
                            <p className="text-sm text-gray-500 italic py-4">Belum ada komentar. Jadilah yang pertama berkomentar!</p>
                          ) : (
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
                          )}
                        </div>
                      )}

                      {/* New comment form */}
                      {showCommentForm === complaint.id && (
                        <div className="mt-4 bg-blue-50 rounded-lg p-4">
                          <h5 className="font-medium text-gray-800 mb-3">Tambah Komentar</h5>
                          <textarea
                            value={newComment.content}
                            onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Tulis komentar Anda..."
                            rows={3}
                          />

                          <div className="flex items-center mt-3">
                            <input
                              type="checkbox"
                              id={`anonymous-${complaint.id}`}
                              checked={newComment.isAnonymous}
                              onChange={(e) => setNewComment({ ...newComment, isAnonymous: e.target.checked })}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`anonymous-${complaint.id}`} className="ml-2 block text-sm text-gray-700">
                              Kirim sebagai anonim
                            </label>
                          </div>

                          {!newComment.isAnonymous && (
                            <div className="mt-3">
                              <input
                                type="text"
                                value={newComment.authorName}
                                onChange={(e) => setNewComment({ ...newComment, authorName: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nama Anda"
                                required={!newComment.isAnonymous}
                              />
                            </div>
                          )}

                          <div className="flex justify-end space-x-3 mt-4">
                            <button
                              onClick={() => setShowCommentForm(null)}
                              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                              Batal
                            </button>
                            <button
                              onClick={() => handleAddComment(complaint.id)}
                              disabled={!newComment.content.trim() || (!newComment.isAnonymous && !newComment.authorName.trim())}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Kirim Komentar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Navigation */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Sebelumnya
                </button>
                <span className="text-sm text-gray-600">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Selanjutnya
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Trending Complaints Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800">Trending</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Keluhan paling populer minggu ini</p>
              
              <div className="space-y-3">
                {trendingComplaints.map((complaint, index) => (
                  <div key={complaint.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <span className="flex items-center justify-center w-6 h-6 bg-orange-100 text-orange-600 text-xs font-bold rounded-full mr-2">
                          {index + 1}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </div>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                      {complaint.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          <span>{complaint.votes}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.013 8.013 0 01-2.5-.4l-3.5 2.9V15c-3-1-5-4-5-8 0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                          </svg>
                          <span>{complaint.comments.length}</span>
                        </div>
                      </div>
                      <span className="text-blue-600">#{complaint.category}</span>
                    </div>
                  </div>
                ))}
              </div>

              {trendingComplaints.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">Belum ada keluhan trending</p>
                </div>
              )}
            </div>
          </div>
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
                    onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
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
                    onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
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
                      onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
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
                      onChange={(e) => setNewComplaint({ ...newComplaint, location: e.target.value })}
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
                    onChange={(e) => setNewComplaint({ ...newComplaint, faculty: e.target.value })}
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
                    onChange={(e) => setNewComplaint({ ...newComplaint, isAnonymous: e.target.checked })}
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
                        onChange={(e) => setNewComplaint({ ...newComplaint, authorName: e.target.value })}
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
                        onChange={(e) => setNewComplaint({ ...newComplaint, authorNim: e.target.value })}
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