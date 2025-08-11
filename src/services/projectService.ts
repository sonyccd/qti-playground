import { Project, ProjectSummary, CreateProjectRequest, QTIItem, Assessment } from '@/types/project';

const TEMP_PROJECTS_KEY = 'qti_temp_projects';

export class ProjectService {
  // Generate unique IDs
  private generateId(): string {
    return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Local Storage methods for temporary projects
  private getTempProjects(): Project[] {
    try {
      const stored = localStorage.getItem(TEMP_PROJECTS_KEY);
      if (!stored) return [];
      const projects = JSON.parse(stored);
      // Convert date strings back to Date objects
      return projects.map((p: Project) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
        items: p.items.map((item: QTIItem) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        })),
        assessments: p.assessments.map((assessment: Assessment) => ({
          ...assessment,
          createdAt: new Date(assessment.createdAt),
          updatedAt: new Date(assessment.updatedAt),
        })),
      }));
    } catch (error) {
      console.error('Error loading temp projects:', error);
      return [];
    }
  }

  private saveTempProjects(projects: Project[]): void {
    try {
      localStorage.setItem(TEMP_PROJECTS_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Error saving temp projects:', error);
      throw new Error('Failed to save project. Storage may be full.');
    }
  }

  // Create a new project
  async createProject(request: CreateProjectRequest, userId?: string): Promise<Project> {
    const now = new Date();
    const project: Project = {
      id: this.generateId(),
      name: request.name,
      description: request.description,
      items: [],
      assessments: [],
      createdAt: now,
      updatedAt: now,
      ownerId: userId,
      isTemporary: request.isTemporary || !userId,
    };

    if (project.isTemporary || !userId) {
      // Save to localStorage
      const tempProjects = this.getTempProjects();
      tempProjects.push(project);
      this.saveTempProjects(tempProjects);
    } else {
      // TODO: Save to Firebase when user is authenticated
      // For now, save to localStorage as fallback
      const tempProjects = this.getTempProjects();
      tempProjects.push(project);
      this.saveTempProjects(tempProjects);
    }

    return project;
  }

  // Get all projects for a user (or temp projects)
  async getProjects(userId?: string): Promise<ProjectSummary[]> {
    if (!userId) {
      // Return temporary projects
      const tempProjects = this.getTempProjects();
      return tempProjects.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        itemCount: p.items.length,
        assessmentCount: p.assessments.length,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        isTemporary: true,
      }));
    } else {
      // TODO: Fetch from Firebase when implemented
      // For now, return temp projects as fallback
      const tempProjects = this.getTempProjects();
      return tempProjects
        .filter(p => p.ownerId === userId)
        .map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          itemCount: p.items.length,
          assessmentCount: p.assessments.length,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          isTemporary: false,
        }));
    }
  }

  // Get a specific project
  async getProject(projectId: string, userId?: string): Promise<Project | null> {
    const tempProjects = this.getTempProjects();
    const project = tempProjects.find(p => p.id === projectId);
    
    if (!project) return null;
    
    // Check permissions
    if (project.ownerId && project.ownerId !== userId) {
      throw new Error('Access denied');
    }
    
    return project;
  }

  // Update a project
  async updateProject(projectId: string, updates: Partial<Project>, userId?: string): Promise<Project> {
    const tempProjects = this.getTempProjects();
    const projectIndex = tempProjects.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    const project = tempProjects[projectIndex];
    
    // Check permissions
    if (project.ownerId && project.ownerId !== userId) {
      throw new Error('Access denied');
    }

    // Update project
    const updatedProject = {
      ...project,
      ...updates,
      id: project.id, // Preserve ID
      updatedAt: new Date(),
    };

    tempProjects[projectIndex] = updatedProject;
    this.saveTempProjects(tempProjects);

    return updatedProject;
  }

  // Delete a project
  async deleteProject(projectId: string, userId?: string): Promise<void> {
    const tempProjects = this.getTempProjects();
    const projectIndex = tempProjects.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    const project = tempProjects[projectIndex];
    
    // Check permissions
    if (project.ownerId && project.ownerId !== userId) {
      throw new Error('Access denied');
    }

    tempProjects.splice(projectIndex, 1);
    this.saveTempProjects(tempProjects);
  }

  // Convert temporary project to permanent (when user signs up/logs in)
  async convertTempProjectToPermanent(projectId: string, userId: string): Promise<Project> {
    const project = await this.getProject(projectId, userId);
    if (!project || !project.isTemporary) {
      throw new Error('Project not found or not temporary');
    }

    const updatedProject = await this.updateProject(projectId, {
      ownerId: userId,
      isTemporary: false,
    });

    // TODO: Move to Firebase when implemented
    return updatedProject;
  }
}

export const projectService = new ProjectService();