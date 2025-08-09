import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { useState, useEffect } from 'react'
import { mockComplaints } from '@/data/mockData'
import type { Complaint } from '@/data/mockData'
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Shared complaints store with localStorage persistence
const COMPLAINTS_STORAGE_KEY = 'siresah_complaints'

export function useComplaintsStore() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load complaints from localStorage on mount
  useEffect(() => {
    const loadComplaints = () => {
      try {
        const stored = localStorage.getItem(COMPLAINTS_STORAGE_KEY)
        if (stored) {
          const parsedComplaints = JSON.parse(stored)
          setComplaints(parsedComplaints)
        } else {
          // Initialize with mock data if no stored data
          setComplaints(mockComplaints)
          localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(mockComplaints))
        }
      } catch (error) {
        console.error('Error loading complaints from localStorage:', error)
        setComplaints(mockComplaints)
      } finally {
        setIsLoaded(true)
      }
    }

    loadComplaints()
  }, [])

  // Save to localStorage whenever complaints change
  useEffect(() => {
    if (isLoaded && complaints.length > 0) {
      try {
        localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(complaints))
      } catch (error) {
        console.error('Error saving complaints to localStorage:', error)
      }
    }
  }, [complaints, isLoaded])

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === COMPLAINTS_STORAGE_KEY && e.newValue) {
        try {
          const newComplaints = JSON.parse(e.newValue)
          setComplaints(newComplaints)
        } catch (error) {
          console.error('Error parsing complaints from storage event:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const addComplaint = (complaint: Complaint) => {
    setComplaints(prev => [complaint, ...prev])
  }

  const updateComplaint = (id: string, updates: Partial<Complaint>) => {
    setComplaints(prev => 
      prev.map(complaint => 
        complaint.id === id 
          ? { ...complaint, ...updates, updatedAt: new Date().toISOString() }
          : complaint
      )
    )
  }

  const incrementVotes = (id: string) => {
    setComplaints(prev =>
      prev.map(complaint =>
        complaint.id === id
          ? { ...complaint, votes: complaint.votes + 1 }
          : complaint
      )
    )
  }

  const addComment = (complaintId: string, comment: any) => {
    setComplaints(prev =>
      prev.map(complaint =>
        complaint.id === complaintId
          ? { 
              ...complaint, 
              comments: [...complaint.comments, comment],
              updatedAt: new Date().toISOString()
            }
          : complaint
      )
    )
  }

  return {
    complaints,
    isLoaded,
    addComplaint,
    updateComplaint,
    incrementVotes,
    addComment
  }
}

// Authentication store - Updated to support both admin and mahasiswa
interface User {
  id: string;
  name: string;
  email: string;
  nim?: string; // Only for mahasiswa
  faculty?: string; // Only for mahasiswa
  role: 'admin' | 'mahasiswa';
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  userType: 'admin' | 'mahasiswa' | null;
  loginAdmin: (username: string, password: string) => boolean;
  loginMahasiswa: (email: string, password: string) => { success: boolean; user?: User };
  registerMahasiswa: (userData: { name: string; email: string; password: string; nim: string; faculty: string }) => boolean;
  logout: () => void;
}

// Mock mahasiswa users for demo
const mockMahasiswaUsers = [
  {
    id: '1',
    name: 'Ahmad Rizki',
    email: 'ahmad.rizki@student.univ.ac.id',
    password: 'password123',
    nim: '2021001001',
    faculty: 'Fakultas Teknik',
    role: 'mahasiswa' as const
  },
  {
    id: '2',
    name: 'Sari Dewi',
    email: 'sari.dewi@student.univ.ac.id',
    password: 'password123',
    nim: '2021002002',
    faculty: 'Fakultas Ekonomi dan Bisnis',
    role: 'mahasiswa' as const
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      userType: null,
      loginAdmin: (username: string, password: string) => {
        if (username === 'admin' && password === 'admin') {
          const adminUser: User = {
            id: 'admin',
            name: 'Admin Kampus',
            email: 'admin@univ.ac.id',
            role: 'admin'
          };
          set({ isAuthenticated: true, user: adminUser, userType: 'admin' });
          return true;
        }
        return false;
      },
      loginMahasiswa: (email: string, password: string) => {
        const user = mockMahasiswaUsers.find(u => u.email === email && u.password === password);
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ isAuthenticated: true, user: userWithoutPassword, userType: 'mahasiswa' });
          return { success: true, user: userWithoutPassword };
        }
        return { success: false };
      },
      registerMahasiswa: (userData) => {
        // Check if email already exists
        const existingUser = mockMahasiswaUsers.find(u => u.email === userData.email);
        if (existingUser) {
          return false;
        }
        
        // In a real app, this would save to a database
        const newUser = {
          id: Date.now().toString(),
          ...userData,
          password: userData.password,
          role: 'mahasiswa' as const
        };
        mockMahasiswaUsers.push(newUser);
        
        return true;
      },
      logout: () => set({ isAuthenticated: false, user: null, userType: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Authentication hook - Updated
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user, userType, loginAdmin, loginMahasiswa, registerMahasiswa, logout } = useAuthStore();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return {
    isAuthenticated,
    user,
    userType,
    isLoading,
    loginAdmin,
    loginMahasiswa,
    registerMahasiswa,
    logout,
  };
};