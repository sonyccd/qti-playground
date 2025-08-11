import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { projectService } from '../projectService';
import { Project, ProjectSummary, CreateProjectRequest } from '@/types/project';

// Mock localStorage
class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem = vi.fn((key: string) => this.store[key] || null);
  
  setItem = vi.fn((key: string, value: string) => {
    this.store[key] = value;
  });

  removeItem = vi.fn((key: string) => {
    delete this.store[key];
  });

  clear = vi.fn(() => {
    this.store = {};
  });
}

const localStorageMock = new LocalStorageMock();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('ProjectService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('createProject', () => {
    it('should create a temporary project when no userId is provided', async () => {
      const request: CreateProjectRequest = {
        name: 'Test Project',
        description: 'Test Description',
      };

      const project = await projectService.createProject(request);

      expect(project).toMatchObject({
        name: 'Test Project',
        description: 'Test Description',
        items: [],
        assessments: [],
        isTemporary: true,
        ownerId: undefined,
      });
      expect(project.id).toBeDefined();
      expect(project.createdAt).toBeInstanceOf(Date);
      expect(project.updatedAt).toBeInstanceOf(Date);

      // Verify it was saved to localStorage
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'qti_temp_projects',
        expect.any(String)
      );
    });

    it('should create a project with userId when provided', async () => {
      const request: CreateProjectRequest = {
        name: 'User Project',
        description: 'User Description',
      };

      const project = await projectService.createProject(request, 'user-123');

      expect(project).toMatchObject({
        name: 'User Project',
        description: 'User Description',
        items: [],
        assessments: [],
        isTemporary: false,
        ownerId: 'user-123',
      });
    });

    it('should create a temporary project when isTemporary is explicitly true', async () => {
      const request: CreateProjectRequest = {
        name: 'Temp Project',
        isTemporary: true,
      };

      const project = await projectService.createProject(request, 'user-123');

      expect(project.isTemporary).toBe(true);
      expect(project.ownerId).toBe('user-123');
    });

    it('should handle localStorage errors gracefully', async () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('QuotaExceededError');
      });

      const request: CreateProjectRequest = {
        name: 'Test Project',
      };

      await expect(projectService.createProject(request)).rejects.toThrow(
        'Failed to save project. Storage may be full.'
      );
    });

    it('should generate unique IDs for each project', async () => {
      const project1 = await projectService.createProject({ name: 'Project 1' });
      const project2 = await projectService.createProject({ name: 'Project 2' });

      expect(project1.id).not.toBe(project2.id);
      expect(project1.id).toMatch(/^project_\d+_[a-z0-9]+$/);
    });
  });

  describe('getProjects', () => {
    beforeEach(() => {
      const mockProjects: Project[] = [
        {
          id: 'project-1',
          name: 'Project 1',
          description: 'Description 1',
          items: [
            {
              id: 'item-1',
              title: 'Item 1',
              content: '<assessmentItem></assessmentItem>',
              qtiVersion: '2.1',
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            },
          ],
          assessments: [],
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
          ownerId: 'user-1',
          isTemporary: false,
        },
        {
          id: 'project-2',
          name: 'Project 2',
          items: [],
          assessments: [
            {
              id: 'assessment-1',
              title: 'Assessment 1',
              itemIds: [],
              settings: {},
              createdAt: new Date('2024-01-03'),
              updatedAt: new Date('2024-01-03'),
            },
          ],
          createdAt: new Date('2024-01-03'),
          updatedAt: new Date('2024-01-03'),
          isTemporary: true,
        },
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockProjects));
    });

    it('should return temporary projects when no userId is provided', async () => {
      const projects = await projectService.getProjects();

      expect(projects).toHaveLength(2);
      expect(projects[0]).toMatchObject({
        id: 'project-1',
        name: 'Project 1',
        description: 'Description 1',
        itemCount: 1,
        assessmentCount: 0,
        isTemporary: true, // All projects are marked as temporary when no user
      });
      expect(projects[1]).toMatchObject({
        id: 'project-2',
        name: 'Project 2',
        itemCount: 0,
        assessmentCount: 1,
        isTemporary: true,
      });
    });

    it('should filter projects by userId when provided', async () => {
      const projects = await projectService.getProjects('user-1');

      expect(projects).toHaveLength(1);
      expect(projects[0]).toMatchObject({
        id: 'project-1',
        name: 'Project 1',
        ownerId: undefined, // ProjectSummary doesn't include ownerId
        isTemporary: false,
      });
    });

    it('should handle empty localStorage gracefully', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const projects = await projectService.getProjects();

      expect(projects).toEqual([]);
    });

    it('should handle corrupted localStorage data', async () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const projects = await projectService.getProjects();

      expect(projects).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error loading temp projects:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should properly convert date strings to Date objects', async () => {
      const projects = await projectService.getProjects();

      expect(projects[0].createdAt).toBeInstanceOf(Date);
      expect(projects[0].updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('getProject', () => {
    const mockProject: Project = {
      id: 'project-1',
      name: 'Test Project',
      items: [],
      assessments: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
      ownerId: 'user-1',
      isTemporary: false,
    };

    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([mockProject]));
    });

    it('should return a specific project by ID', async () => {
      const project = await projectService.getProject('project-1', 'user-1');

      expect(project).toMatchObject({
        id: 'project-1',
        name: 'Test Project',
        ownerId: 'user-1',
      });
    });

    it('should return null if project does not exist', async () => {
      const project = await projectService.getProject('non-existent', 'user-1');

      expect(project).toBeNull();
    });

    it('should throw error if user does not have access to project', async () => {
      await expect(
        projectService.getProject('project-1', 'different-user')
      ).rejects.toThrow('Access denied');
    });

    it('should allow access to projects without ownerId', async () => {
      const publicProject: Project = {
        ...mockProject,
        ownerId: undefined,
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify([publicProject]));

      const project = await projectService.getProject('project-1', 'any-user');

      expect(project).toBeDefined();
      expect(project?.id).toBe('project-1');
    });

    it('should allow access to own projects', async () => {
      const project = await projectService.getProject('project-1', 'user-1');

      expect(project).toBeDefined();
      expect(project?.id).toBe('project-1');
    });
  });

  describe('updateProject', () => {
    const mockProject: Project = {
      id: 'project-1',
      name: 'Original Name',
      description: 'Original Description',
      items: [],
      assessments: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
      ownerId: 'user-1',
      isTemporary: false,
    };

    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([mockProject]));
    });

    it('should update an existing project', async () => {
      const updates = {
        name: 'Updated Name',
        description: 'Updated Description',
      };

      const updatedProject = await projectService.updateProject(
        'project-1',
        updates,
        'user-1'
      );

      expect(updatedProject).toMatchObject({
        id: 'project-1',
        name: 'Updated Name',
        description: 'Updated Description',
        ownerId: 'user-1',
      });
      expect(updatedProject.updatedAt).toBeInstanceOf(Date);
      expect(updatedProject.updatedAt.getTime()).toBeGreaterThan(
        mockProject.updatedAt.getTime()
      );

      // Verify it was saved to localStorage
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should preserve ID when updating', async () => {
      const updates = {
        id: 'different-id',
        name: 'Updated Name',
      };

      const updatedProject = await projectService.updateProject(
        'project-1',
        updates,
        'user-1'
      );

      expect(updatedProject.id).toBe('project-1');
      expect(updatedProject.name).toBe('Updated Name');
    });

    it('should throw error if project does not exist', async () => {
      await expect(
        projectService.updateProject('non-existent', { name: 'New Name' }, 'user-1')
      ).rejects.toThrow('Project not found');
    });

    it('should throw error if user does not have access', async () => {
      await expect(
        projectService.updateProject('project-1', { name: 'New Name' }, 'different-user')
      ).rejects.toThrow('Access denied');
    });

    it('should allow partial updates', async () => {
      const updatedProject = await projectService.updateProject(
        'project-1',
        { description: 'Only Description Updated' },
        'user-1'
      );

      expect(updatedProject.name).toBe('Original Name');
      expect(updatedProject.description).toBe('Only Description Updated');
    });
  });

  describe('deleteProject', () => {
    const mockProjects: Project[] = [
      {
        id: 'project-1',
        name: 'Project 1',
        items: [],
        assessments: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        ownerId: 'user-1',
        isTemporary: false,
      },
      {
        id: 'project-2',
        name: 'Project 2',
        items: [],
        assessments: [],
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-04'),
        ownerId: 'user-2',
        isTemporary: false,
      },
    ];

    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockProjects));
    });

    it('should delete an existing project', async () => {
      await projectService.deleteProject('project-1', 'user-1');

      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedData).toHaveLength(1);
      expect(savedData[0].id).toBe('project-2');
    });

    it('should throw error if project does not exist', async () => {
      await expect(
        projectService.deleteProject('non-existent', 'user-1')
      ).rejects.toThrow('Project not found');
    });

    it('should throw error if user does not have access', async () => {
      await expect(
        projectService.deleteProject('project-1', 'different-user')
      ).rejects.toThrow('Access denied');
    });

    it('should allow deleting projects without ownerId', async () => {
      const publicProject: Project = {
        ...mockProjects[0],
        ownerId: undefined,
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify([publicProject]));

      await expect(
        projectService.deleteProject('project-1', 'any-user')
      ).resolves.not.toThrow();
    });
  });

  describe('convertTempProjectToPermanent', () => {
    const tempProject: Project = {
      id: 'temp-project',
      name: 'Temporary Project',
      items: [],
      assessments: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
      isTemporary: true,
    };

    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([tempProject]));
    });

    it('should convert temporary project to permanent', async () => {
      const permanentProject = await projectService.convertTempProjectToPermanent(
        'temp-project',
        'user-123'
      );

      expect(permanentProject).toMatchObject({
        id: 'temp-project',
        name: 'Temporary Project',
        ownerId: 'user-123',
        isTemporary: false,
      });
    });

    it('should throw error if project does not exist', async () => {
      await expect(
        projectService.convertTempProjectToPermanent('non-existent', 'user-123')
      ).rejects.toThrow('Project not found or not temporary');
    });

    it('should throw error if project is already permanent', async () => {
      const permanentProject: Project = {
        ...tempProject,
        isTemporary: false,
        ownerId: 'user-456',
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify([permanentProject]));

      await expect(
        projectService.convertTempProjectToPermanent('temp-project', 'user-123')
      ).rejects.toThrow('Project not found or not temporary');
    });
  });

  describe('localStorage edge cases', () => {
    it('should handle localStorage being unavailable', async () => {
      const originalLocalStorage = window.localStorage;
      Object.defineProperty(window, 'localStorage', {
        get: () => {
          throw new Error('localStorage is not available');
        },
      });

      const service = new (await import('../projectService')).ProjectService();
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(service.getProjects()).resolves.toEqual([]);

      consoleErrorSpy.mockRestore();
      Object.defineProperty(window, 'localStorage', { value: originalLocalStorage });
    });

    it('should handle very large projects', async () => {
      const largeDescription = 'x'.repeat(10000);
      
      const project = await projectService.createProject({
        name: 'Large Project',
        description: largeDescription,
      });

      expect(project.description).toBe(largeDescription);
      expect(localStorageMock.setItem).toHaveBeenCalled();
      const savedData = localStorageMock.setItem.mock.calls[0][1];
      expect(savedData.length).toBeGreaterThan(10000);
    });
  });
});