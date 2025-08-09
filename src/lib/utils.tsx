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

// Authentication store
interface AuthState {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (username: string, password: string) => {
        if (username === 'admin' && password === 'admin') {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Authentication hook
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, login, logout } = useAuthStore();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};