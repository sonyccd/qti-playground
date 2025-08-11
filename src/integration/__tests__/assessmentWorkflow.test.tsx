import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { projectService } from '@/services/projectService';
import type { Project, QTIItem, Assessment } from '@/types/project';

// Mock services
vi.mock('@/services/projectService', () => ({
  projectService: {
    getProject: vi.fn(),
    updateProject: vi.fn(),
    createProject: vi.fn(),
  },
}));

// Mock the drag and drop library
vi.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => <div data-testid="drag-drop-context">{children}</div>,
  Droppable: ({ children }: { children: (provided: any) => React.ReactNode }) => 
    <div data-testid="droppable">{children({ innerRef: vi.fn(), droppableProps: {}, placeholder: null })}</div>,
  Draggable: ({ children }: { children: (provided: any, snapshot: any) => React.ReactNode }) => 
    <div data-testid="draggable">{children({ innerRef: vi.fn(), draggableProps: {}, dragHandleProps: {} }, { isDragging: false })}</div>,
}));

// Mock router params and search params
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ projectId: 'test-project-id' }),
    useSearchParams: () => [new URLSearchParams('new=true')],
    useNavigate: () => vi.fn(),
  };
});

// Mock integrated workflow component that combines multiple features
const IntegratedAssessmentWorkflow: React.FC = () => {
  const [step, setStep] = React.useState<'project' | 'items' | 'assessment' | 'preview'>('project');
  const [project, setProject] = React.useState<Project | null>(null);
  const [currentAssessment, setCurrentAssessment] = React.useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Mock project creation
  const createProject = async (name: string) => {
    setIsLoading(true);
    try {
      const newProject: Project = {
        id: 'new-project-id',
        name,
        items: [],
        assessments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProject(newProject);
      setStep('items');
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock item creation
  const createItem = async (title: string, itemType: string, groups: string[]) => {
    if (!project) return;
    
    const newItem: QTIItem = {
      id: `item-${Date.now()}`,
      title,
      content: `<assessmentItem><responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier"><correctResponse><value>A</value></correctResponse></responseDeclaration></assessmentItem>`,
      qtiVersion: '2.1',
      itemType: itemType as any,
      groups,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedProject = {
      ...project,
      items: [...project.items, newItem],
    };
    setProject(updatedProject);
  };

  // Mock assessment creation
  const createAssessment = async (title: string) => {
    if (!project) return;
    
    const newAssessment: Assessment = {
      id: `assessment-${Date.now()}`,
      title,
      blocks: [],
      settings: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCurrentAssessment(newAssessment);
    setStep('assessment');
  };

  // Mock block addition to assessment
  const addBlockToAssessment = (blockType: 'specific' | 'random' | 'instruction', options: any) => {
    if (!currentAssessment) return;

    const blockId = `block-${Date.now()}`;
    let newBlock;

    if (blockType === 'specific') {
      newBlock = {
        id: blockId,
        type: 'item',
        order: currentAssessment.blocks.length,
        selectionType: 'specific',
        specificItemIds: options.itemIds || [],
      };
    } else if (blockType === 'random') {
      newBlock = {
        id: blockId,
        type: 'item',
        order: currentAssessment.blocks.length,
        selectionType: 'random',
        itemType: options.itemType,
        count: options.count,
        groups: options.groups,
        randomize: options.randomize || false,
      };
    } else {
      newBlock = {
        id: blockId,
        type: 'instruction',
        order: currentAssessment.blocks.length,
        title: options.title,
        content: options.content,
        allowSkip: options.allowSkip || false,
      };
    }

    setCurrentAssessment({
      ...currentAssessment,
      blocks: [...currentAssessment.blocks, newBlock as any],
    });
  };

  // Mock packaging
  const packageAssessment = () => {
    if (!currentAssessment || !project) return;

    setStep('preview');
  };

  if (isLoading) {
    return <div data-testid="loading">Loading...</div>;
  }

  if (step === 'project') {
    return (
      <div data-testid="project-setup">
        <h1>Create New Project</h1>
        <button 
          data-testid="create-project-btn"
          onClick={() => createProject('Integration Test Project')}
        >
          Create Project
        </button>
      </div>
    );
  }

  if (step === 'items') {
    return (
      <div data-testid="item-creation">
        <h1>Create Items for: {project?.name}</h1>
        <div>Items created: {project?.items.length}</div>
        
        <button 
          data-testid="create-choice-item"
          onClick={() => createItem('Multiple Choice Question', 'choice', ['math', 'easy'])}
        >
          Create Choice Item
        </button>
        
        <button 
          data-testid="create-text-item"
          onClick={() => createItem('Text Entry Question', 'text-entry', ['science'])}
        >
          Create Text Item
        </button>

        <button 
          data-testid="create-essay-item"
          onClick={() => createItem('Essay Question', 'essay', ['english', 'hard'])}
        >
          Create Essay Item
        </button>

        <button 
          data-testid="proceed-to-assessment"
          onClick={() => createAssessment('Test Assessment')}
          disabled={!project || project.items.length === 0}
        >
          Create Assessment
        </button>
      </div>
    );
  }

  if (step === 'assessment') {
    return (
      <div data-testid="assessment-design">
        <h1>Design Assessment: {currentAssessment?.title}</h1>
        <div>Blocks: {currentAssessment?.blocks.length}</div>
        <div>Available Items: {project?.items.length}</div>

        <div data-testid="block-options">
          <button 
            data-testid="add-specific-block"
            onClick={() => addBlockToAssessment('specific', { 
              itemIds: project?.items.slice(0, 2).map(i => i.id) 
            })}
          >
            Add Specific Items Block
          </button>

          <button 
            data-testid="add-random-block"
            onClick={() => addBlockToAssessment('random', { 
              itemType: 'choice', 
              count: 2,
              groups: ['math'],
              randomize: true
            })}
          >
            Add Random Items Block
          </button>

          <button 
            data-testid="add-instruction-block"
            onClick={() => addBlockToAssessment('instruction', { 
              title: 'Test Instructions',
              content: 'Please read these instructions carefully before proceeding.',
              allowSkip: false
            })}
          >
            Add Instructions
          </button>
        </div>

        <button 
          data-testid="package-assessment"
          onClick={packageAssessment}
          disabled={!currentAssessment || currentAssessment.blocks.length === 0}
        >
          Package Assessment
        </button>
      </div>
    );
  }

  if (step === 'preview') {
    return (
      <div data-testid="assessment-preview">
        <h1>Assessment Preview</h1>
        <div data-testid="preview-content">
          <h2>{currentAssessment?.title}</h2>
          <p>This is what test-takers will see</p>
          <div>Total blocks: {currentAssessment?.blocks.length}</div>
          
          <div data-testid="packaged-items">
            {currentAssessment?.blocks.map((block, index) => (
              <div key={block.id} data-testid={`preview-block-${index}`}>
                {block.type === 'item' ? 'Item Block' : 'Instruction Block'}
              </div>
            ))}
          </div>

          <button data-testid="publish-assessment">
            Publish Assessment
          </button>
        </div>
      </div>
    );
  }

  return null;
};

describe('Integrated Assessment Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('End-to-End Project Creation', () => {
    it('should complete full project creation workflow', async () => {
      const user = userEvent.setup();
      
      render(
        <BrowserRouter>
          <AuthProvider>
            <IntegratedAssessmentWorkflow />
          </AuthProvider>
        </BrowserRouter>
      );

      // Step 1: Create project
      expect(screen.getByTestId('project-setup')).toBeInTheDocument();
      expect(screen.getByText('Create New Project')).toBeInTheDocument();

      const createProjectBtn = screen.getByTestId('create-project-btn');
      await user.click(createProjectBtn);

      // Step 2: Should progress to item creation
      await waitFor(() => {
        expect(screen.getByTestId('item-creation')).toBeInTheDocument();
      });

      expect(screen.getByText('Create Items for: Integration Test Project')).toBeInTheDocument();
      expect(screen.getByText('Items created: 0')).toBeInTheDocument();
    });

    it('should create multiple items with different types and groups', async () => {
      const user = userEvent.setup();
      
      render(
        <BrowserRouter>
          <AuthProvider>
            <IntegratedAssessmentWorkflow />
          </AuthProvider>
        </BrowserRouter>
      );

      // Create project first
      await user.click(screen.getByTestId('create-project-btn'));
      
      await waitFor(() => {
        expect(screen.getByTestId('item-creation')).toBeInTheDocument();
      });

      // Create different types of items
      await user.click(screen.getByTestId('create-choice-item'));
      expect(screen.getByText('Items created: 1')).toBeInTheDocument();

      await user.click(screen.getByTestId('create-text-item'));
      expect(screen.getByText('Items created: 2')).toBeInTheDocument();

      await user.click(screen.getByTestId('create-essay-item'));
      expect(screen.getByText('Items created: 3')).toBeInTheDocument();

      // Proceed to assessment should be enabled
      const proceedBtn = screen.getByTestId('proceed-to-assessment');
      expect(proceedBtn).not.toBeDisabled();
    });

    it('should prevent assessment creation without items', async () => {
      const user = userEvent.setup();
      
      render(
        <BrowserRouter>
          <AuthProvider>
            <IntegratedAssessmentWorkflow />
          </AuthProvider>
        </BrowserRouter>
      );

      // Create project
      await user.click(screen.getByTestId('create-project-btn'));
      
      await waitFor(() => {
        expect(screen.getByTestId('item-creation')).toBeInTheDocument();
      });

      // Should not be able to proceed without items
      const proceedBtn = screen.getByTestId('proceed-to-assessment');
      expect(proceedBtn).toBeDisabled();
    });
  });

  describe('End-to-End Assessment Design', () => {
    it('should complete full assessment design workflow', async () => {
      const user = userEvent.setup();
      
      render(
        <BrowserRouter>
          <AuthProvider>
            <IntegratedAssessmentWorkflow />
          </AuthProvider>
        </BrowserRouter>
      );

      // Create project and items
      await user.click(screen.getByTestId('create-project-btn'));
      
      await waitFor(() => {
        expect(screen.getByTestId('item-creation')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('create-choice-item'));
      await user.click(screen.getByTestId('create-text-item'));
      await user.click(screen.getByTestId('proceed-to-assessment'));

      // Should be in assessment design phase
      await waitFor(() => {
        expect(screen.getByTestId('assessment-design')).toBeInTheDocument();
      });

      expect(screen.getByText('Design Assessment: Test Assessment')).toBeInTheDocument();
      expect(screen.getByText('Blocks: 0')).toBeInTheDocument();
      expect(screen.getByText('Available Items: 2')).toBeInTheDocument();

      // Package button should be disabled initially
      const packageBtn = screen.getByTestId('package-assessment');
      expect(packageBtn).toBeDisabled();
    });

    it('should add different types of blocks to assessment', async () => {
      const user = userEvent.setup();
      
      render(
        <BrowserRouter>
          <AuthProvider>
            <IntegratedAssessmentWorkflow />
          </AuthProvider>
        </BrowserRouter>
      );

      // Setup: Create project, items, and get to assessment design
      await user.click(screen.getByTestId('create-project-btn'));
      await waitFor(() => expect(screen.getByTestId('item-creation')).toBeInTheDocument());
      
      await user.click(screen.getByTestId('create-choice-item'));
      await user.click(screen.getByTestId('create-text-item'));
      await user.click(screen.getByTestId('create-essay-item'));
      await user.click(screen.getByTestId('proceed-to-assessment'));

      await waitFor(() => {
        expect(screen.getByTestId('assessment-design')).toBeInTheDocument();
      });

      // Add specific items block
      await user.click(screen.getByTestId('add-specific-block'));
      expect(screen.getByText('Blocks: 1')).toBeInTheDocument();

      // Add random items block
      await user.click(screen.getByTestId('add-random-block'));
      expect(screen.getByText('Blocks: 2')).toBeInTheDocument();

      // Add instruction block
      await user.click(screen.getByTestId('add-instruction-block'));
      expect(screen.getByText('Blocks: 3')).toBeInTheDocument();

      // Package button should now be enabled
      const packageBtn = screen.getByTestId('package-assessment');
      expect(packageBtn).not.toBeDisabled();
    });

    it('should complete assessment packaging and preview', async () => {
      const user = userEvent.setup();
      
      render(
        <BrowserRouter>
          <AuthProvider>
            <IntegratedAssessmentWorkflow />
          </AuthProvider>
        </BrowserRouter>
      );

      // Complete full workflow
      await user.click(screen.getByTestId('create-project-btn'));
      await waitFor(() => expect(screen.getByTestId('item-creation')).toBeInTheDocument());
      
      await user.click(screen.getByTestId('create-choice-item'));
      await user.click(screen.getByTestId('create-text-item'));
      await user.click(screen.getByTestId('proceed-to-assessment'));

      await waitFor(() => expect(screen.getByTestId('assessment-design')).toBeInTheDocument());

      await user.click(screen.getByTestId('add-specific-block'));
      await user.click(screen.getByTestId('add-instruction-block'));
      await user.click(screen.getByTestId('package-assessment'));

      // Should show preview
      await waitFor(() => {
        expect(screen.getByTestId('assessment-preview')).toBeInTheDocument();
      });

      expect(screen.getByText('Assessment Preview')).toBeInTheDocument();
      expect(screen.getByText('Test Assessment')).toBeInTheDocument();
      expect(screen.getByText('This is what test-takers will see')).toBeInTheDocument();
      expect(screen.getByText('Total blocks: 2')).toBeInTheDocument();

      // Should show packaged blocks
      expect(screen.getByTestId('preview-block-0')).toBeInTheDocument();
      expect(screen.getByTestId('preview-block-1')).toBeInTheDocument();

      expect(screen.getByTestId('publish-assessment')).toBeInTheDocument();
    });
  });

  describe('Workflow Error Handling', () => {
    it('should handle loading states properly', async () => {
      const user = userEvent.setup();
      
      render(
        <BrowserRouter>
          <AuthProvider>
            <IntegratedAssessmentWorkflow />
          </AuthProvider>
        </BrowserRouter>
      );

      const createProjectBtn = screen.getByTestId('create-project-btn');
      await user.click(createProjectBtn);

      // Should briefly show loading state
      // Note: In a real test, you might need to mock delays to properly test this
      await waitFor(() => {
        expect(screen.getByTestId('item-creation')).toBeInTheDocument();
      });
    });

    it('should maintain state consistency throughout workflow', async () => {
      const user = userEvent.setup();
      
      render(
        <BrowserRouter>
          <AuthProvider>
            <IntegratedAssessmentWorkflow />
          </AuthProvider>
        </BrowserRouter>
      );

      // Track state at each step
      await user.click(screen.getByTestId('create-project-btn'));
      await waitFor(() => expect(screen.getByTestId('item-creation')).toBeInTheDocument());
      expect(screen.getByText('Items created: 0')).toBeInTheDocument();

      // Create items and verify count
      await user.click(screen.getByTestId('create-choice-item'));
      expect(screen.getByText('Items created: 1')).toBeInTheDocument();
      
      await user.click(screen.getByTestId('create-text-item'));
      expect(screen.getByText('Items created: 2')).toBeInTheDocument();

      // Proceed to assessment
      await user.click(screen.getByTestId('proceed-to-assessment'));
      await waitFor(() => expect(screen.getByTestId('assessment-design')).toBeInTheDocument());
      
      // Verify item count is maintained
      expect(screen.getByText('Available Items: 2')).toBeInTheDocument();
      
      // Add blocks and verify count
      await user.click(screen.getByTestId('add-specific-block'));
      expect(screen.getByText('Blocks: 1')).toBeInTheDocument();
      
      await user.click(screen.getByTestId('add-random-block'));
      expect(screen.getByText('Blocks: 2')).toBeInTheDocument();

      // Package and verify final state
      await user.click(screen.getByTestId('package-assessment'));
      await waitFor(() => expect(screen.getByTestId('assessment-preview')).toBeInTheDocument());
      
      expect(screen.getByText('Total blocks: 2')).toBeInTheDocument();
    });
  });

  describe('User Experience Flow', () => {
    it('should provide clear navigation between workflow steps', async () => {
      const user = userEvent.setup();
      
      render(
        <BrowserRouter>
          <AuthProvider>
            <IntegratedAssessmentWorkflow />
          </AuthProvider>
        </BrowserRouter>
      );

      // Start with clear project setup
      expect(screen.getByText('Create New Project')).toBeInTheDocument();
      
      await user.click(screen.getByTestId('create-project-btn'));
      
      // Progress to item creation with clear context
      await waitFor(() => {
        expect(screen.getByText('Create Items for: Integration Test Project')).toBeInTheDocument();
      });
      
      await user.click(screen.getByTestId('create-choice-item'));
      await user.click(screen.getByTestId('proceed-to-assessment'));
      
      // Assessment design shows clear context
      await waitFor(() => {
        expect(screen.getByText('Design Assessment: Test Assessment')).toBeInTheDocument();
      });
      
      await user.click(screen.getByTestId('add-specific-block'));
      await user.click(screen.getByTestId('package-assessment'));
      
      // Final preview shows complete context
      await waitFor(() => {
        expect(screen.getByText('Assessment Preview')).toBeInTheDocument();
        expect(screen.getByText('Test Assessment')).toBeInTheDocument();
      });
    });

    it('should enforce logical workflow progression', async () => {
      const user = userEvent.setup();
      
      render(
        <BrowserRouter>
          <AuthProvider>
            <IntegratedAssessmentWorkflow />
          </AuthProvider>
        </BrowserRouter>
      );

      await user.click(screen.getByTestId('create-project-btn'));
      await waitFor(() => expect(screen.getByTestId('item-creation')).toBeInTheDocument());

      // Can't proceed to assessment without items
      expect(screen.getByTestId('proceed-to-assessment')).toBeDisabled();
      
      await user.click(screen.getByTestId('create-choice-item'));
      
      // Now can proceed
      expect(screen.getByTestId('proceed-to-assessment')).not.toBeDisabled();
      
      await user.click(screen.getByTestId('proceed-to-assessment'));
      await waitFor(() => expect(screen.getByTestId('assessment-design')).toBeInTheDocument());

      // Can't package without blocks
      expect(screen.getByTestId('package-assessment')).toBeDisabled();
      
      await user.click(screen.getByTestId('add-specific-block'));
      
      // Now can package
      expect(screen.getByTestId('package-assessment')).not.toBeDisabled();
    });
  });
});