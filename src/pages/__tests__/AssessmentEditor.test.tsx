import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AssessmentEditor from '../AssessmentEditor';
import { AuthProvider } from '@/contexts/AuthContext';
import { projectService } from '@/services/projectService';
import type { Project, QTIItem, Assessment } from '@/types/project';

// Mock the project service
vi.mock('@/services/projectService', () => ({
  projectService: {
    getProject: vi.fn(),
    updateProject: vi.fn(),
  },
}));

// Mock DragDropContext from @hello-pangea/dnd
vi.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => <div data-testid="drag-drop-context">{children}</div>,
  Droppable: ({ children }: { children: (provided: any) => React.ReactNode }) => 
    <div data-testid="droppable">{children({ innerRef: vi.fn(), droppableProps: {}, placeholder: null })}</div>,
  Draggable: ({ children }: { children: (provided: any, snapshot: any) => React.ReactNode }) => 
    <div data-testid="draggable">{children({ innerRef: vi.fn(), draggableProps: {}, dragHandleProps: {} }, { isDragging: false })}</div>,
}));

// Mock URL search params
let mockSearchParams = new URLSearchParams();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ projectId: 'test-project-id' }),
    useSearchParams: () => [mockSearchParams],
  };
});

const mockProject: Project = {
  id: 'test-project-id',
  name: 'Test Project',
  items: [
    {
      id: 'item-1',
      title: 'Multiple Choice Item',
      content: '<assessmentItem>...</assessmentItem>',
      qtiVersion: '2.1',
      itemType: 'choice',
      groups: ['math', 'easy'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'item-2',
      title: 'Text Entry Item',
      content: '<assessmentItem>...</assessmentItem>',
      qtiVersion: '2.1',
      itemType: 'text-entry',
      groups: ['science'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  assessments: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockAssessment: Assessment = {
  id: 'test-assessment-id',
  title: 'Test Assessment',
  description: 'Test description',
  blocks: [
    {
      id: 'block-1',
      type: 'item',
      order: 0,
      selectionType: 'random',
      itemType: 'choice',
      count: 2,
      groups: ['math'],
      randomize: true,
    },
    {
      id: 'instruction-1',
      type: 'instruction',
      order: 1,
      title: 'Test Instructions',
      content: 'Please read carefully',
      allowSkip: true,
    },
  ],
  settings: {
    timeLimit: 60,
    maxAttempts: 3,
    allowReview: true,
    showFeedback: true,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

const renderAssessmentEditor = (searchParams = '') => {
  if (searchParams) {
    mockSearchParams = new URLSearchParams(searchParams);
  }

  return render(
    <BrowserRouter>
      <AuthProvider>
        <AssessmentEditor />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('AssessmentEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  describe('Component Rendering', () => {
    it('should render loading state initially', () => {
      vi.mocked(projectService.getProject).mockResolvedValue(mockProject);
      
      renderAssessmentEditor('new=true');
      
      expect(screen.getByText('Loading assessment editor...')).toBeInTheDocument();
    });

    it('should render create new assessment header', async () => {
      vi.mocked(projectService.getProject).mockResolvedValue(mockProject);
      
      renderAssessmentEditor('new=true');
      
      await waitFor(() => {
        expect(screen.getByText('Create New Assessment')).toBeInTheDocument();
      });
    });

    it('should render edit assessment header', async () => {
      const projectWithAssessment = {
        ...mockProject,
        assessments: [mockAssessment],
      };
      vi.mocked(projectService.getProject).mockResolvedValue(projectWithAssessment);
      
      renderAssessmentEditor('assessmentId=test-assessment-id');
      
      await waitFor(() => {
        expect(screen.getByText('Edit Assessment: Test Assessment')).toBeInTheDocument();
      });
    });
  });

  describe('Assessment Timeline', () => {
    beforeEach(async () => {
      vi.mocked(projectService.getProject).mockResolvedValue(mockProject);
      renderAssessmentEditor('new=true');
      
      await waitFor(() => {
        expect(screen.getByText('Create New Assessment')).toBeInTheDocument();
      });
    });

    it('should show empty timeline initially', () => {
      expect(screen.getByText('No blocks in timeline')).toBeInTheDocument();
      expect(screen.getByText('Add your first block to start building the assessment')).toBeInTheDocument();
    });

    it('should open add block dialog when floating action button is clicked', async () => {
      const user = userEvent.setup();
      
      const addButton = screen.getByRole('button', { name: /add/i });
      await user.click(addButton);
      
      expect(screen.getByText('Add Block to Timeline')).toBeInTheDocument();
    });

    it('should display block type options in add dialog', async () => {
      const user = userEvent.setup();
      
      const addButton = screen.getByRole('button', { name: /add/i });
      await user.click(addButton);
      
      expect(screen.getByText('Multiple Choice (Random)')).toBeInTheDocument();
      expect(screen.getByText('Text Entry (Random)')).toBeInTheDocument();
      expect(screen.getByText('Specific Items')).toBeInTheDocument();
      expect(screen.getByText('Instructions')).toBeInTheDocument();
    });
  });

  describe('Block Creation', () => {
    beforeEach(async () => {
      vi.mocked(projectService.getProject).mockResolvedValue(mockProject);
      renderAssessmentEditor('new=true');
      
      await waitFor(() => {
        expect(screen.getByText('Create New Assessment')).toBeInTheDocument();
      });
    });

    it('should create random item block', async () => {
      const user = userEvent.setup();
      
      // Open add block dialog
      const addButton = screen.getByRole('button', { name: /add/i });
      await user.click(addButton);
      
      // Click on Multiple Choice block
      const choiceBlock = screen.getByText('Multiple Choice (Random)');
      await user.click(choiceBlock);
      
      // Should close dialog and add block
      await waitFor(() => {
        expect(screen.queryByText('Add Block to Timeline')).not.toBeInTheDocument();
      });
    });

    it('should create specific items block', async () => {
      const user = userEvent.setup();
      
      const addButton = screen.getByRole('button', { name: /add/i });
      await user.click(addButton);
      
      const specificBlock = screen.getByText('Specific Items');
      await user.click(specificBlock);
      
      await waitFor(() => {
        expect(screen.queryByText('Add Block to Timeline')).not.toBeInTheDocument();
      });
    });

    it('should create instruction block', async () => {
      const user = userEvent.setup();
      
      const addButton = screen.getByRole('button', { name: /add/i });
      await user.click(addButton);
      
      const instructionBlock = screen.getByText('Instructions');
      await user.click(instructionBlock);
      
      await waitFor(() => {
        expect(screen.queryByText('Add Block to Timeline')).not.toBeInTheDocument();
      });
    });
  });

  describe('Assessment Settings', () => {
    it('should load existing assessment with settings', async () => {
      const projectWithAssessment = {
        ...mockProject,
        assessments: [mockAssessment],
      };
      vi.mocked(projectService.getProject).mockResolvedValue(projectWithAssessment);
      
      renderAssessmentEditor('assessmentId=test-assessment-id');
      
      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Assessment')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
      });
    });
  });

  describe('Save and Cancel', () => {
    it('should show cancel dialog when there are unsaved changes', async () => {
      vi.mocked(projectService.getProject).mockResolvedValue(mockProject);
      const user = userEvent.setup();
      
      renderAssessmentEditor('new=true');
      
      await waitFor(() => {
        expect(screen.getByText('Create New Assessment')).toBeInTheDocument();
      });
      
      // Make a change to create unsaved changes
      const titleInput = screen.getByDisplayValue('New Assessment');
      await user.clear(titleInput);
      await user.type(titleInput, 'Modified Assessment');
      
      // Click cancel
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
      
      expect(screen.getByText('Unsaved Changes')).toBeInTheDocument();
      expect(screen.getByText('You have unsaved changes. If you cancel now, all changes will be lost.')).toBeInTheDocument();
    });

    it('should save assessment successfully', async () => {
      vi.mocked(projectService.getProject).mockResolvedValue(mockProject);
      vi.mocked(projectService.updateProject).mockResolvedValue(mockProject);
      
      const user = userEvent.setup();
      
      renderAssessmentEditor('new=true');
      
      await waitFor(() => {
        expect(screen.getByText('Create New Assessment')).toBeInTheDocument();
      });
      
      // Modify title
      const titleInput = screen.getByDisplayValue('New Assessment');
      await user.clear(titleInput);
      await user.type(titleInput, 'My New Assessment');
      
      // Click save
      const saveButton = screen.getByRole('button', { name: /save assessment/i });
      await user.click(saveButton);
      
      await waitFor(() => {
        expect(projectService.updateProject).toHaveBeenCalled();
      });
    });
  });

  describe('Assessment Packaging', () => {
    beforeEach(async () => {
      const projectWithAssessment = {
        ...mockProject,
        assessments: [mockAssessment],
      };
      vi.mocked(projectService.getProject).mockResolvedValue(projectWithAssessment);
      
      renderAssessmentEditor('assessmentId=test-assessment-id');
      
      await waitFor(() => {
        expect(screen.getByText('Edit Assessment: Test Assessment')).toBeInTheDocument();
      });
    });

    it('should navigate to configuration settings', async () => {
      const user = userEvent.setup();
      
      const configureButton = screen.getByRole('button', { name: /configure settings/i });
      await user.click(configureButton);
      
      expect(screen.getByText('Assessment Settings')).toBeInTheDocument();
      expect(screen.getByLabelText('Time Limit (minutes)')).toBeInTheDocument();
      expect(screen.getByLabelText('Max Attempts')).toBeInTheDocument();
    });

    it('should package assessment and show preview', async () => {
      const user = userEvent.setup();
      
      // Navigate to settings first
      const configureButton = screen.getByRole('button', { name: /configure settings/i });
      await user.click(configureButton);
      
      // Click package assessment
      const packageButton = screen.getByRole('button', { name: /package assessment/i });
      await user.click(packageButton);
      
      expect(screen.getByText('Package Preview')).toBeInTheDocument();
      expect(screen.getByText('This is what test-takers will see. Items have been selected based on your timeline blocks.')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error when project fails to load', async () => {
      vi.mocked(projectService.getProject).mockRejectedValue(new Error('Failed to load'));
      
      renderAssessmentEditor('new=true');
      
      await waitFor(() => {
        expect(screen.getByText('Failed to load project')).toBeInTheDocument();
      });
    });

    it('should display error when assessment not found', async () => {
      vi.mocked(projectService.getProject).mockResolvedValue(mockProject);
      
      renderAssessmentEditor('assessmentId=non-existent-id');
      
      await waitFor(() => {
        expect(screen.getByText('Assessment not found')).toBeInTheDocument();
      });
    });

    it('should require assessment title for saving', async () => {
      vi.mocked(projectService.getProject).mockResolvedValue(mockProject);
      const user = userEvent.setup();
      
      renderAssessmentEditor('new=true');
      
      await waitFor(() => {
        expect(screen.getByText('Create New Assessment')).toBeInTheDocument();
      });
      
      // Clear title
      const titleInput = screen.getByDisplayValue('New Assessment');
      await user.clear(titleInput);
      
      // Try to save
      const saveButton = screen.getByRole('button', { name: /save assessment/i });
      expect(saveButton).toBeDisabled();
    });
  });

  describe('Stepper Navigation', () => {
    it('should show correct step indicators', async () => {
      vi.mocked(projectService.getProject).mockResolvedValue(mockProject);
      
      renderAssessmentEditor('new=true');
      
      await waitFor(() => {
        expect(screen.getByText('Design Timeline')).toBeInTheDocument();
        expect(screen.getByText('Configure Settings')).toBeInTheDocument();
        expect(screen.getByText('Package & Preview')).toBeInTheDocument();
      });
    });
  });
});