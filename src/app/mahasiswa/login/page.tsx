'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/utils';
import { faculties } from '@/data/mockData';

// Login Component
function LoginForm({ switchToRegister }: { switchToRegister: () => void }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginMahasiswa } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = loginMahasiswa(credentials.email, credentials.password);
    
    if (result.success) {
      // Redirect to mahasiswa dashboard on successful login
      window.location.href = '/mahasiswa';
    } else {
      setError('Email atau password salah');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Login Mahasiswa
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Masuk ke akun mahasiswa SiResah
        </p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="nama@student.univ.ac.id"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan password"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="text-center text-sm text-gray-500 bg-blue-50 p-3 rounded">
          <strong>Demo Account:</strong><br />
          Email: ahmad.rizki@student.univ.ac.id<br />
          Password: password123
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Masuk'}
          </button>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Belum punya akun?{' '}
            <button
              type="button"
              onClick={switchToRegister}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Daftar di sini
            </button>
          </p>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Kembali ke Beranda
          </Link>
        </div>
      </form>
    </div>
  );
}

// Register Component
function RegisterForm({ switchToLogin }: { switchToLogin: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    nim: '',
    faculty: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { registerMahasiswa } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak sama');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      setIsLoading(false);
      return;
    }

    const success = registerMahasiswa({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      nim: formData.nim,
      faculty: formData.faculty
    });
    
    if (success) {
      alert('Registrasi berhasil! Silakan login dengan akun Anda.');
      switchToLogin();
    } else {
      setError('Email sudah terdaftar');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Daftar Mahasiswa
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Buat akun mahasiswa SiResah
        </p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan nama lengkap"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="nama@student.univ.ac.id"
            />
          </div>

          <div>
            <label htmlFor="nim" className="block text-sm font-medium text-gray-700 mb-2">
              NIM
            </label>
            <input
              id="nim"
              name="nim"
              type="text"
              required
              value={formData.nim}
              onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nomor Induk Mahasiswa"
            />
          </div>

          <div>
            <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-2">
              Fakultas
            </label>
            <select
              id="faculty"
              name="faculty"
              required
              value={formData.faculty}
              onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Fakultas</option>
              {faculties.map(faculty => (
                <option key={faculty} value={faculty}>{faculty}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Konfirmasi Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ulangi password"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{' '}
            <button
              type="button"
              onClick={switchToLogin}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Login di sini
            </button>
          </p>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Kembali ke Beranda
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function MahasiswaLoginPage() {
  const { isAuthenticated, userType, isLoading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  // Redirect to dashboard if already authenticated as mahasiswa
  useEffect(() => {
    if (isAuthenticated && userType === 'mahasiswa') {
      window.location.href = '/mahasiswa';
    }
  }, [isAuthenticated, userType]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login/register form if not authenticated or not mahasiswa
  if (!isAuthenticated || userType !== 'mahasiswa') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {showRegister ? (
          <RegisterForm switchToLogin={() => setShowRegister(false)} />
        ) : (
          <LoginForm switchToRegister={() => setShowRegister(true)} />
        )}
      </div>
    );
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}