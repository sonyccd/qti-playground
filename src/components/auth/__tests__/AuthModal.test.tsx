import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthModal } from '../AuthModal';
import { useAuth } from '@/contexts/AuthContext';

// Mock the useAuth hook
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockUseAuth = useAuth as vi.MockedFunction<typeof useAuth>;
const mockLogin = vi.fn();
const mockSignup = vi.fn();

beforeEach(() => {
  mockLogin.mockClear();
  mockSignup.mockClear();
  mockUseAuth.mockReturnValue({
    currentUser: null,
    loading: false,
    login: mockLogin,
    signup: mockSignup,
    logout: vi.fn(),
    updateUserProfile: vi.fn(),
  });
});

describe('AuthModal', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
  };

  describe('Modal Display', () => {
    it('should render when open is true', () => {
      render(<AuthModal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should not render when open is false', () => {
      render(<AuthModal {...defaultProps} open={false} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should display login and signup tabs', () => {
      render(<AuthModal {...defaultProps} />);
      expect(screen.getByRole('tab', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /sign up/i })).toBeInTheDocument();
    });
  });

  describe('Login Form', () => {
    it('should display login form fields', () => {
      render(<AuthModal {...defaultProps} />);
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
    });

    it('should call login when form is submitted', async () => {
      const user = userEvent.setup();
      render(<AuthModal {...defaultProps} />);

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /^login$/i }));

      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  describe('Signup Form', () => {
    const renderSignupForm = async () => {
      render(<AuthModal {...defaultProps} />);
      const user = userEvent.setup();
      await user.click(screen.getByRole('tab', { name: /sign up/i }));
      return user;
    };

    it('should display signup form fields', async () => {
      await renderSignupForm();
      
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getAllByLabelText(/password/i)).toHaveLength(2); // Password and Confirm Password
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('should show error for password mismatch', async () => {
      const user = await renderSignupForm();

      const passwordFields = screen.getAllByLabelText(/password/i);
      
      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await user.type(passwordFields[0], 'password123'); // Password field
      await user.type(passwordFields[1], 'password456'); // Confirm password field
      await user.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });

    it('should show error for missing first name', async () => {
      const user = await renderSignupForm();

      const passwordFields = screen.getAllByLabelText(/password/i);

      // Fill in email and passwords, but leave first name empty
      await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await user.type(passwordFields[0], 'password123');
      await user.type(passwordFields[1], 'password123');
      
      // Check if the first name field is actually empty
      const firstNameField = screen.getByLabelText(/first name/i);
      expect(firstNameField).toHaveValue('');
      
      // Find and submit the form directly
      const form = screen.getByRole('dialog').querySelector('form');
      expect(form).toBeInTheDocument();
      
      // Submit using fireEvent instead of user click
      fireEvent.submit(form!);

      // Wait for the error message to appear
      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
      });
      
      // Verify that signup was never called due to validation failure
      expect(mockSignup).not.toHaveBeenCalled();
    });
  });

  describe('Tab Switching', () => {
    it('should switch between login and signup modes', async () => {
      const user = userEvent.setup();
      render(<AuthModal {...defaultProps} />);

      // Start in login mode
      expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();

      // Switch to signup
      await user.click(screen.getByRole('tab', { name: /sign up/i }));
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();

      // Switch back to login
      await user.click(screen.getByRole('tab', { name: /^login$/i }));
      expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
    });
  });
});