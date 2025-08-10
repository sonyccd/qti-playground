import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';

// Mock Firebase modules using factory functions
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn().mockResolvedValue(undefined),
  signInWithEmailAndPassword: vi.fn().mockResolvedValue({ 
    user: { 
      uid: 'test', 
      email: 'test@example.com',
      reload: vi.fn().mockResolvedValue(undefined)
    } 
  }),
  createUserWithEmailAndPassword: vi.fn().mockResolvedValue({ 
    user: { 
      uid: 'test', 
      email: 'test@example.com',
      reload: vi.fn().mockResolvedValue(undefined)
    } 
  }),
  updateProfile: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/firebase', () => ({
  auth: {}
}));

import { AuthProvider, useAuth } from '../AuthContext';
import * as firebaseAuth from 'firebase/auth';

// Get the mocked functions
const mockOnAuthStateChanged = vi.mocked(firebaseAuth.onAuthStateChanged);
const mockSignInWithEmailAndPassword = vi.mocked(firebaseAuth.signInWithEmailAndPassword);
const mockCreateUserWithEmailAndPassword = vi.mocked(firebaseAuth.createUserWithEmailAndPassword);
const mockSignOut = vi.mocked(firebaseAuth.signOut);
const mockUpdateProfile = vi.mocked(firebaseAuth.updateProfile);

describe('AuthContext', () => {
  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');
      
      consoleSpy.mockRestore();
    });
  });

  describe('AuthProvider', () => {
    beforeEach(() => {
      // Clear all mocks
      mockSignInWithEmailAndPassword.mockClear();
      mockCreateUserWithEmailAndPassword.mockClear();
      mockSignOut.mockClear();
      mockOnAuthStateChanged.mockClear();
      
      // Mock onAuthStateChanged to immediately call callback with null
      mockOnAuthStateChanged.mockImplementation((auth, callback) => {
        setTimeout(() => callback(null), 0); // Use setTimeout to ensure async callback
        return vi.fn(); // unsubscribe function
      });
    });

    it('should render children when loaded', async () => {
      render(
        <AuthProvider>
          <div>Test Content</div>
        </AuthProvider>
      );

      await screen.findByText('Test Content');
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should provide auth functions through context', async () => {
      const TestComponent = () => {
        const auth = useAuth();
        return (
          <div>
            <span data-testid="current-user">{auth.currentUser ? 'logged-in' : 'logged-out'}</span>
            <span data-testid="loading">{auth.loading ? 'loading' : 'loaded'}</span>
            <button onClick={() => auth.login('test', 'test')}>Login</button>
            <button onClick={() => auth.signup('test', 'test', 'Test')}>Signup</button>
            <button onClick={() => auth.logout()}>Logout</button>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await screen.findByTestId('current-user');
      expect(screen.getByTestId('current-user')).toHaveTextContent('logged-out');
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Signup')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('should call Firebase auth functions', async () => {
      let authRef: any = null;
      const TestComponent = () => {
        const auth = useAuth();
        authRef = auth;
        return <div>Auth Ready</div>;
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await screen.findByText('Auth Ready');
      
      // Call auth functions directly
      if (authRef) {
        await act(async () => {
          try {
            console.log('Calling login...');
            await authRef.login('test@example.com', 'password');
            console.log('Login called, mockSignInWithEmailAndPassword call count:', mockSignInWithEmailAndPassword.mock.calls.length);
            await authRef.signup('test@example.com', 'password', 'John');  
            await authRef.logout();
          } catch (e) {
            console.log('Error in auth functions:', e);
          }
        });
      }

      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.any(Object),
        'test@example.com',
        'password'
      );
      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.any(Object),
        'test@example.com',
        'password'
      );
      expect(mockSignOut).toHaveBeenCalled();
    });
  });
});