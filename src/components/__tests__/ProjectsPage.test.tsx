import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ProjectsPage from '../ProjectsPage';
import { useAuth } from '@/contexts/AuthContext';
import { projectService } from '@/services/projectService';

// Mock the auth context
vi.mock('@/contexts/AuthContext');
const mockUseAuth = vi.mocked(useAuth);

// Mock the project service
vi.mock('@/services/projectService');
const mockProjectService = vi.mocked(projectService);

// Mock the AuthModal component
vi.mock('@/components/auth/AuthModal', () => ({
  AuthModal: ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    return open ? (
      <div data-testid="auth-modal">
        <button onClick={onClose}>Close Auth Modal</button>
      </div>
    ) : null;
  },
}));

// Mock data
const mockProjects = [
  {
    id: 'project-1',
    name: 'Test Project 1',
    description: 'A test project',
    itemCount: 5,
    assessmentCount: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
    isTemporary: false,
  },
  {
    id: 'project-2',
    name: 'Temp Project',
    description: '',
    itemCount: 1,
    assessmentCount: 0,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
    isTemporary: true,
  },
];

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ProjectsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockProjectService.getProjects.mockResolvedValue(mockProjects);
  });

  describe('Authentication Status', () => {
    it('should show signed in status when user is authenticated', async () => {
      mockUseAuth.mockReturnValue({
        user: { uid: 'user-1', displayName: 'Test User', email: 'test@example.com' },
        signup: vi.fn(),
        login: vi.fn(),
        logout: vi.fn(),
        loading: false,
      });

      renderWithRouter(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText(/Signed in as Test User/)).toBeInTheDocument();
      });
    });

    it('should show temporary projects warning when user is not authenticated', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        signup: vi.fn(),
        login: vi.fn(),
        logout: vi.fn(),
        loading: false,
      });

      renderWithRouter(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText(/Working with temporary projects/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
      });
    });
  });

  describe('Project Display', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { uid: 'user-1', displayName: 'Test User', email: 'test@example.com' },
        signup: vi.fn(),
        login: vi.fn(),
        logout: vi.fn(),
        loading: false,
      });
    });

    it('should display projects when available', async () => {
      renderWithRouter(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
        expect(screen.getByText('Temp Project')).toBeInTheDocument();
        expect(screen.getByText('5 items')).toBeInTheDocument();
        expect(screen.getByText('2 assessments')).toBeInTheDocument();
        expect(screen.getByText('Temporary')).toBeInTheDocument();
      });
    });

    it('should show empty state when no projects exist', async () => {
      mockProjectService.getProjects.mockResolvedValue([]);

      renderWithRouter(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('No projects yet')).toBeInTheDocument();
        expect(screen.getByText('Create your first assessment project to get started')).toBeInTheDocument();
      });
    });

    it('should show loading state initially', () => {
      mockProjectService.getProjects.mockImplementation(() => new Promise(() => {})); // Never resolves

      renderWithRouter(<ProjectsPage />);

      expect(screen.getByText('Loading projects...')).toBeInTheDocument();
    });
  });

  describe('Project Creation', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { uid: 'user-1', displayName: 'Test User', email: 'test@example.com' },
        signup: vi.fn(),
        login: vi.fn(),
        logout: vi.fn(),
        loading: false,
      });
    });

    it('should open create project dialog when authenticated user clicks create button', async () => {
      renderWithRouter(<ProjectsPage />);

      const createButton = screen.getByRole('button', { name: /Create New Project/i });
      fireEvent.click(createButton);

      expect(screen.getByText('Create New Project')).toBeInTheDocument();
      expect(screen.getByLabelText('Project Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Description (optional)')).toBeInTheDocument();
    });

    it('should create project when form is submitted', async () => {
      mockProjectService.createProject.mockResolvedValue({
        id: 'new-project',
        name: 'New Project',
        description: 'New project description',
        items: [],
        assessments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: 'user-1',
        isTemporary: false,
      });

      renderWithRouter(<ProjectsPage />);

      // Open create dialog
      const createButton = screen.getByRole('button', { name: /Create New Project/i });
      fireEvent.click(createButton);

      // Fill form
      fireEvent.change(screen.getByLabelText('Project Name'), {
        target: { value: 'New Project' }
      });
      fireEvent.change(screen.getByLabelText('Description (optional)'), {
        target: { value: 'New project description' }
      });

      // Submit form
      const submitButton = screen.getByRole('button', { name: 'Create Project' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockProjectService.createProject).toHaveBeenCalledWith(
          {
            name: 'New Project',
            description: 'New project description',
          },
          'user-1'
        );
      });
    });
  });

  describe('Unauthenticated User Flow', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        signup: vi.fn(),
        login: vi.fn(),
        logout: vi.fn(),
        loading: false,
      });

      // Mock window.confirm for unauthenticated user prompts
      global.confirm = vi.fn();
    });

    it('should prompt for authentication when unauthenticated user tries to create project', async () => {
      (global.confirm as any).mockReturnValue(true);

      renderWithRouter(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText(/Working with temporary projects/)).toBeInTheDocument();
      });

      const createButton = screen.getByRole('button', { name: /Create New Project/i });
      fireEvent.click(createButton);

      expect(global.confirm).toHaveBeenCalledWith(
        expect.stringContaining('You can create a temporary project that saves locally')
      );
    });

    it('should open create dialog for temporary project when user declines authentication', async () => {
      (global.confirm as any).mockReturnValue(false);

      renderWithRouter(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText(/Working with temporary projects/)).toBeInTheDocument();
      });

      const createButton = screen.getByRole('button', { name: /Create New Project/i });
      fireEvent.click(createButton);

      expect(screen.getByText('Create New Project')).toBeInTheDocument();
    });
  });

  describe('Project Management', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { uid: 'user-1', displayName: 'Test User', email: 'test@example.com' },
        signup: vi.fn(),
        login: vi.fn(),
        logout: vi.fn(),
        loading: false,
      });
      global.confirm = vi.fn();
    });

    it('should handle project editing', async () => {
      mockProjectService.updateProject.mockResolvedValue({
        id: 'project-1',
        name: 'Updated Project Name',
        description: 'Updated description',
        items: [],
        assessments: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        ownerId: 'user-1',
        isTemporary: false,
      });

      renderWithRouter(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      // Find and click the menu button for the first project
      const moreButtons = screen.getAllByTestId('MoreVertIcon');
      const menuButton = moreButtons[0].closest('button');
      fireEvent.click(menuButton!);

      // Click edit in the menu
      const editMenuItem = screen.getByRole('menuitem', { name: /Edit/i });
      fireEvent.click(editMenuItem);

      // Verify edit dialog opens with existing values
      expect(screen.getByText('Edit Project')).toBeInTheDocument();
      const nameInput = screen.getByLabelText('Project Name') as HTMLInputElement;
      expect(nameInput.value).toBe('Test Project 1');

      // Update the project name
      fireEvent.change(nameInput, { target: { value: 'Updated Project Name' } });
      
      const saveButton = screen.getByRole('button', { name: 'Save Changes' });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockProjectService.updateProject).toHaveBeenCalledWith(
          'project-1',
          { name: 'Updated Project Name', description: 'A test project' },
          'user-1'
        );
      });
    });

    it('should handle project deletion', async () => {
      (global.confirm as any).mockReturnValue(true);
      mockProjectService.deleteProject.mockResolvedValue(undefined);

      renderWithRouter(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      // Find and click the menu button for the first project
      const moreButtons = screen.getAllByTestId('MoreVertIcon');
      const menuButton = moreButtons[0].closest('button');
      fireEvent.click(menuButton!);

      // Click delete in the menu
      const deleteMenuItem = screen.getByRole('menuitem', { name: /Delete/i });
      fireEvent.click(deleteMenuItem);

      expect(global.confirm).toHaveBeenCalledWith(
        'Are you sure you want to delete this project? This action cannot be undone.'
      );

      await waitFor(() => {
        expect(mockProjectService.deleteProject).toHaveBeenCalledWith('project-1', 'user-1');
        expect(mockProjectService.getProjects).toHaveBeenCalledTimes(2); // Initial load + after delete
      });
    });

    it('should not delete project when user cancels confirmation', async () => {
      (global.confirm as any).mockReturnValue(false);

      renderWithRouter(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      // Find and click the menu button for the first project
      const moreButtons = screen.getAllByTestId('MoreVertIcon');
      const menuButton = moreButtons[0].closest('button');
      fireEvent.click(menuButton!);

      // Click delete in the menu
      const deleteMenuItem = screen.getByRole('menuitem', { name: /Delete/i });
      fireEvent.click(deleteMenuItem);

      expect(mockProjectService.deleteProject).not.toHaveBeenCalled();
    });

    it('should handle clicking on a project card', async () => {
      // Mock window.location.href since we now navigate directly
      const originalLocation = window.location;
      delete (window as any).location;
      window.location = { ...originalLocation, href: '' };
      
      renderWithRouter(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      // Click on the project card
      const projectCard = screen.getByText('Test Project 1').closest('[class*="MuiCard-root"]');
      fireEvent.click(projectCard!);

      expect(window.location.href).toBe('/project/project-1');
      
      // Restore window.location
      window.location = originalLocation;
    });

    it('should show validation error when creating project without name', async () => {
      renderWithRouter(<ProjectsPage />);

      const createButton = screen.getByRole('button', { name: /Create New Project/i });
      fireEvent.click(createButton);

      // Try to submit without entering a name
      const submitButton = screen.getByRole('button', { name: 'Create Project' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Project name is required')).toBeInTheDocument();
      });

      expect(mockProjectService.createProject).not.toHaveBeenCalled();
    });

    it('should trim whitespace from project name and description', async () => {
      mockProjectService.createProject.mockResolvedValue({
        id: 'new-project',
        name: 'Trimmed Project',
        description: 'Trimmed description',
        items: [],
        assessments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: 'user-1',
        isTemporary: false,
      });

      renderWithRouter(<ProjectsPage />);

      const createButton = screen.getByRole('button', { name: /Create New Project/i });
      fireEvent.click(createButton);

      // Enter name and description with whitespace
      fireEvent.change(screen.getByLabelText('Project Name'), {
        target: { value: '  Trimmed Project  ' }
      });
      fireEvent.change(screen.getByLabelText('Description (optional)'), {
        target: { value: '  Trimmed description  ' }
      });

      const submitButton = screen.getByRole('button', { name: 'Create Project' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockProjectService.createProject).toHaveBeenCalledWith(
          {
            name: 'Trimmed Project',
            description: 'Trimmed description',
          },
          'user-1'
        );
      });
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { uid: 'user-1', displayName: 'Test User', email: 'test@example.com' },
        signup: vi.fn(),
        login: vi.fn(),
        logout: vi.fn(),
        loading: false,
      });
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should display error when projects fail to load', async () => {
      mockProjectService.getProjects.mockRejectedValue(new Error('Network error'));

      renderWithRouter(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load projects')).toBeInTheDocument();
      });
    });

    it('should display error when project creation fails', async () => {
      mockProjectService.createProject.mockRejectedValue(new Error('Creation failed'));

      renderWithRouter(<ProjectsPage />);

      const createButton = screen.getByRole('button', { name: /Create New Project/i });
      fireEvent.click(createButton);

      fireEvent.change(screen.getByLabelText('Project Name'), {
        target: { value: 'New Project' }
      });

      const submitButton = screen.getByRole('button', { name: 'Create Project' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to create project')).toBeInTheDocument();
      });
    });

    it('should display error when project update fails', async () => {
      mockProjectService.updateProject.mockRejectedValue(new Error('Update failed'));

      renderWithRouter(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      // Open edit menu
      const moreButtons = screen.getAllByTestId('MoreVertIcon');
      const menuButton = moreButtons[0].closest('button');
      fireEvent.click(menuButton!);

      const editMenuItem = screen.getByRole('menuitem', { name: /Edit/i });
      fireEvent.click(editMenuItem);

      fireEvent.change(screen.getByLabelText('Project Name'), {
        target: { value: 'Updated Name' }
      });

      const saveButton = screen.getByRole('button', { name: 'Save Changes' });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to update project')).toBeInTheDocument();
      });
    });

    it('should display error when project deletion fails', async () => {
      (global.confirm as any).mockReturnValue(true);
      mockProjectService.deleteProject.mockRejectedValue(new Error('Delete failed'));

      renderWithRouter(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      // Open delete menu
      const moreButtons = screen.getAllByTestId('MoreVertIcon');
      const menuButton = moreButtons[0].closest('button');
      fireEvent.click(menuButton!);

      const deleteMenuItem = screen.getByRole('menuitem', { name: /Delete/i });
      fireEvent.click(deleteMenuItem);

      await waitFor(() => {
        expect(screen.getByText('Failed to delete project')).toBeInTheDocument();
      });
    });

    it('should allow closing error alerts', async () => {
      mockProjectService.getProjects.mockRejectedValue(new Error('Network error'));

      renderWithRouter(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load projects')).toBeInTheDocument();
      });

      // Find and click the close button on the alert
      const alert = screen.getByText('Failed to load projects').closest('.MuiAlert-root');
      const closeButton = within(alert!).getByRole('button');
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('Failed to load projects')).not.toBeInTheDocument();
      });
    });
  });

  describe('Auth Modal Integration', () => {
    it('should open auth modal when sign in button is clicked', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        signup: vi.fn(),
        login: vi.fn(),
        logout: vi.fn(),
        loading: false,
      });

      renderWithRouter(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText(/Working with temporary projects/)).toBeInTheDocument();
      });

      const signInButton = screen.getByRole('button', { name: /Sign In/i });
      fireEvent.click(signInButton);

      expect(screen.getByTestId('auth-modal')).toBeInTheDocument();
    });

    it('should close auth modal when close button is clicked', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        signup: vi.fn(),
        login: vi.fn(),
        logout: vi.fn(),
        loading: false,
      });

      renderWithRouter(<ProjectsPage />);

      const signInButton = screen.getByRole('button', { name: /Sign In/i });
      fireEvent.click(signInButton);

      expect(screen.getByTestId('auth-modal')).toBeInTheDocument();

      const closeButton = screen.getByText('Close Auth Modal');
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId('auth-modal')).not.toBeInTheDocument();
      });
    });
  });
});