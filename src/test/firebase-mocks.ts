import { vi } from 'vitest';

// Simple mock user
export const mockUser = {
  uid: 'test-uid-123',
  email: 'test@example.com',
  displayName: 'John',
  emailVerified: true,
  reload: vi.fn().mockResolvedValue(undefined),
};

// Mock functions
export const mockSignOut = vi.fn().mockResolvedValue(undefined);
export const mockSignInWithEmailAndPassword = vi.fn().mockResolvedValue({
  user: mockUser,
});
export const mockCreateUserWithEmailAndPassword = vi.fn().mockResolvedValue({
  user: mockUser,
});
export const mockUpdateProfile = vi.fn().mockResolvedValue(undefined);
export const mockOnAuthStateChanged = vi.fn();

// Mock Firebase auth object
export const mockAuth = {
  currentUser: null,
};

// Mock Firebase modules
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => mockAuth),
  onAuthStateChanged: mockOnAuthStateChanged,
  signOut: mockSignOut,
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
  createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
  updateProfile: mockUpdateProfile,
}));

// Utility to simulate auth state changes
export const simulateAuthStateChange = (user: unknown) => {
  const callback = mockOnAuthStateChanged.mock.calls[0]?.[1];
  if (callback) {
    callback(user);
  }
};

// Reset all mocks utility
export const resetFirebaseMocks = () => {
  mockSignOut.mockClear();
  mockSignInWithEmailAndPassword.mockClear();
  mockCreateUserWithEmailAndPassword.mockClear();
  mockUpdateProfile.mockClear();
  mockOnAuthStateChanged.mockClear();
  mockUser.reload.mockClear();
  mockAuth.currentUser = null;
};