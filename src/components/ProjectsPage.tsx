import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  Avatar,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Add,
  FolderOpen,
  Assessment,
  MoreVert,
  Delete,
  Edit,
  Person,
  PersonOff,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { projectService } from '@/services/projectService';
import { ProjectSummary, CreateProjectRequest } from '@/types/project';

interface ProjectCardProps {
  project: ProjectSummary;
  onEdit: (project: ProjectSummary) => void;
  onDelete: (projectId: string) => void;
  onOpen: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete, onOpen }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(project);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(project.id);
    handleMenuClose();
  };

  return (
    <Card 
      sx={{
        height: '100%',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8]
        }
      }}
      onClick={() => onOpen(project.id)}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Avatar sx={{ 
            width: 48, 
            height: 48, 
            bgcolor: theme.palette.primary.light,
            mb: 1
          }}>
            <FolderOpen />
          </Avatar>
          <IconButton 
            size="small" 
            onClick={handleMenuClick}
            sx={{ color: 'text.secondary' }}
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEdit}>
              <Edit sx={{ mr: 1 }} fontSize="small" />
              Edit
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <Delete sx={{ mr: 1 }} fontSize="small" />
              Delete
            </MenuItem>
          </Menu>
        </Box>

        <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
          {project.name}
        </Typography>

        {project.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
            {project.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip 
            icon={<Assessment />} 
            label={`${project.itemCount} items`} 
            size="small" 
            variant="outlined"
          />
          <Chip 
            label={`${project.assessmentCount} assessments`} 
            size="small" 
            variant="outlined"
          />
          {project.isTemporary && (
            <Chip 
              icon={<PersonOff />} 
              label="Temporary" 
              size="small" 
              color="warning"
            />
          )}
        </Box>

        <Typography variant="caption" color="text.secondary">
          Updated {project.updatedAt.toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (request: CreateProjectRequest) => void;
  editingProject?: ProjectSummary | null;
}

const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({ 
  open, 
  onClose, 
  onSubmit,
  editingProject 
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingProject) {
      setName(editingProject.name);
      setDescription(editingProject.description || '');
    } else {
      setName('');
      setDescription('');
    }
    setError('');
  }, [editingProject, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingProject ? 'Edit Project' : 'Create New Project'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description (optional)"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {editingProject ? 'Save Changes' : 'Create Project'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const ProjectsPage: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectSummary | null>(null);
  const [error, setError] = useState('');

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const projectList = await projectService.getProjects(user?.uid);
      setProjects(projectList);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadProjects();
  }, [user?.uid, loadProjects]);

  const handleCreateProject = async (request: CreateProjectRequest) => {
    try {
      if (editingProject) {
        // Edit existing project
        await projectService.updateProject(
          editingProject.id,
          { name: request.name, description: request.description },
          user?.uid
        );
      } else {
        // Create new project
        await projectService.createProject(request, user?.uid);
      }
      await loadProjects();
      setEditingProject(null);
    } catch (err) {
      console.error('Error saving project:', err);
      setError(editingProject ? 'Failed to update project' : 'Failed to create project');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await projectService.deleteProject(projectId, user?.uid);
        await loadProjects();
      } catch (err) {
        console.error('Error deleting project:', err);
        setError('Failed to delete project');
      }
    }
  };

  const handleEditProject = (project: ProjectSummary) => {
    setEditingProject(project);
    setCreateDialogOpen(true);
  };

  const handleOpenProject = (projectId: string) => {
    window.location.href = `/project/${projectId}`;
  };

  const handleCreateNewProject = () => {
    if (!user) {
      // Prompt for auth or create temp project
      if (window.confirm('You can create a temporary project that saves locally, or sign up/login to save your projects permanently. Would you like to sign up/login?')) {
        setAuthModalOpen(true);
      } else {
        setCreateDialogOpen(true);
      }
    } else {
      setCreateDialogOpen(true);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[50]} 100%)`,
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Avatar sx={{ 
            width: 80, 
            height: 80, 
            bgcolor: theme.palette.primary.light, 
            mx: 'auto', 
            mb: 2 
          }}>
            <Assessment sx={{ fontSize: 40, color: 'white' }} />
          </Avatar>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Assessment Prototyping
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Create and manage assessment projects with items and tests
          </Typography>

          {/* User Status */}
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            {user ? (
              <Chip 
                icon={<Person />} 
                label={`Signed in as ${user.displayName || user.email}`}
                color="success"
              />
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  icon={<PersonOff />} 
                  label="Working with temporary projects"
                  color="warning"
                />
                <Button 
                  size="small" 
                  onClick={() => setAuthModalOpen(true)}
                  variant="outlined"
                >
                  Sign In
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Create New Project Button */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={handleCreateNewProject}
            sx={{ px: 4, py: 1.5 }}
          >
            Create New Project
          </Button>
        </Box>

        {/* Projects Grid */}
        {loading ? (
          <Typography textAlign="center">Loading projects...</Typography>
        ) : projects.length === 0 ? (
          <Card sx={{ p: 6, textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: theme.palette.grey[200], 
              mx: 'auto', 
              mb: 2 
            }}>
              <FolderOpen sx={{ fontSize: 40, color: theme.palette.grey[500] }} />
            </Avatar>
            <Typography variant="h5" gutterBottom>
              No projects yet
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Create your first assessment project to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateNewProject}
            >
              Create Your First Project
            </Button>
          </Card>
        ) : (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 3
          }}>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
                onOpen={handleOpenProject}
              />
            ))}
          </Box>
        )}

        {/* Dialogs */}
        <CreateProjectDialog
          open={createDialogOpen}
          onClose={() => {
            setCreateDialogOpen(false);
            setEditingProject(null);
          }}
          onSubmit={handleCreateProject}
          editingProject={editingProject}
        />

        <AuthModal
          open={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </Container>
    </Box>
  );
};

export default ProjectsPage;