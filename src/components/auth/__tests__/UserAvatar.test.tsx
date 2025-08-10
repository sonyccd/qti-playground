import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserAvatar } from '../UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { mockUser } from '@/test/firebase-mocks';

// Mock the useAuth hook
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockUseAuth = useAuth as vi.MockedFunction<typeof useAuth>;

describe('UserAvatar', () => {
  beforeEach(() => {
    mockUseAuth.mockClear();
  });

  describe('When user is not logged in', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        currentUser: null,
        loading: false,
        signup: vi.fn(),
        login: vi.fn(),
        logout: vi.fn(),
        updateUserProfile: vi.fn(),
      });
    });

    it('should not render when no user is logged in', () => {
      const { container } = render(<UserAvatar />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('When user is logged in', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        currentUser: mockUser,
        loading: false,
        signup: vi.fn(),
        login: vi.fn(),
        logout: vi.fn(),
        updateUserProfile: vi.fn(),
      });
    });

    it('should render user avatar with first letter', () => {
      render(<UserAvatar />);
      
      const avatar = screen.getByRole('button');
      expect(avatar).toBeInTheDocument();
      expect(screen.getByText('J')).toBeInTheDocument(); // First letter of 'John'
    });

    it('should use first letter of email if no display name', () => {
      mockUseAuth.mockReturnValue({
        currentUser: { ...mockUser, displayName: null },
        loading: false,
        signup: vi.fn(),
        login: vi.fn(),
        logout: vi.fn(),
        updateUserProfile: vi.fn(),
      });

      render(<UserAvatar />);
      
      expect(screen.getByText('T')).toBeInTheDocument(); // First letter of 'test@example.com'
    });

    it('should handle empty user info gracefully', () => {
      mockUseAuth.mockReturnValue({
        currentUser: { ...mockUser, displayName: '', email: '' },
        loading: false,
        signup: vi.fn(),
        login: vi.fn(),
        logout: vi.fn(),
        updateUserProfile: vi.fn(),
      });

      render(<UserAvatar />);
      
      const avatar = screen.getByRole('button');
      expect(avatar).toBeInTheDocument();
    });
  });
});