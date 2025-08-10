import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import TopNavigation from '../TopNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { mockUser } from '@/test/firebase-mocks';

// Mock the useAuth hook
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockUseAuth = useAuth as vi.MockedFunction<typeof useAuth>;

const renderWithRouter = (initialRoute = '/', authState = { currentUser: null }) => {
  mockUseAuth.mockReturnValue({
    currentUser: authState.currentUser,
    loading: false,
    signup: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    updateUserProfile: vi.fn(),
  });

  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <TopNavigation />
    </MemoryRouter>
  );
};

describe('TopNavigation', () => {
  beforeEach(() => {
    mockUseAuth.mockClear();
  });

  describe('Navigation Links', () => {
    it('should render all navigation links', () => {
      renderWithRouter();

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Playground')).toBeInTheDocument();
      expect(screen.getByText('Learn')).toBeInTheDocument();
    });

    it('should highlight active home route', () => {
      renderWithRouter('/');

      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink).toHaveClass('text-foreground');
    });

    it('should highlight active playground route', () => {
      renderWithRouter('/playground');

      const playgroundLink = screen.getByText('Playground').closest('a');
      expect(playgroundLink).toHaveClass('text-foreground');
    });

    it('should highlight learn route and subroutes', () => {
      renderWithRouter('/learn/introduction');

      const learnLink = screen.getByText('Learn').closest('a');
      expect(learnLink).toHaveClass('text-foreground');
    });
  });

  describe('Authentication UI - Logged Out', () => {
    it('should show login button when user is not logged in', () => {
      renderWithRouter('/', { currentUser: null });

      expect(screen.getByRole('button', { name: /login.*sign up/i })).toBeInTheDocument();
    });

    it('should not show user avatar when user is not logged in', () => {
      renderWithRouter('/', { currentUser: null });

      // Look for avatar specifically (button with user initial)
      expect(screen.queryByText('J')).not.toBeInTheDocument();
    });

    it('should open auth modal when login button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter('/', { currentUser: null });

      const loginButton = screen.getByRole('button', { name: /login.*sign up/i });
      await user.click(loginButton);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Authentication UI - Logged In', () => {
    it('should show user avatar when user is logged in', () => {
      renderWithRouter('/', { currentUser: mockUser });

      expect(screen.getByText('J')).toBeInTheDocument(); // First letter of John
    });

    it('should not show login button when user is logged in', () => {
      renderWithRouter('/', { currentUser: mockUser });

      expect(screen.queryByRole('button', { name: /login.*sign up/i })).not.toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('should have proper navigation structure', () => {
      renderWithRouter();

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveClass('sticky', 'top-0');
    });

    it('should display navigation with icons', () => {
      renderWithRouter();

      // Check that the links contain SVG icons
      const homeLink = screen.getByText('Home').closest('a');
      const playgroundLink = screen.getByText('Playground').closest('a');
      const learnLink = screen.getByText('Learn').closest('a');

      expect(homeLink?.querySelector('svg')).toBeInTheDocument();
      expect(playgroundLink?.querySelector('svg')).toBeInTheDocument();
      expect(learnLink?.querySelector('svg')).toBeInTheDocument();
    });
  });
});