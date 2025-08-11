import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  FormControlLabel,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Add,
  ArrowBack,
  Edit,
  Delete,
  MoreVert,
  Assessment,
  QuestionAnswer,
  PlayArrow,
  ContentCopy,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { projectService } from '@/services/projectService';
import { Project, QTIItem, Assessment as AssessmentType, CreateProjectRequest, ItemBlock } from '@/types/project';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface ItemRowProps {
  item: QTIItem;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

const ItemRow: React.FC<ItemRowProps> = ({ item, onEdit, onDelete, onDuplicate }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <TableRow hover>
      <TableCell>{item.title}</TableCell>
      <TableCell>
        <Chip label={`QTI ${item.qtiVersion}`} size="small" variant="outlined" />
      </TableCell>
      <TableCell>{item.updatedAt.toLocaleDateString()}</TableCell>
      <TableCell align="right">
        <IconButton size="small" onClick={handleMenuClick}>
          <MoreVert />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { onEdit(); handleMenuClose(); }}>
            <Edit sx={{ mr: 1 }} fontSize="small" />
            Edit
          </MenuItem>
          <MenuItem onClick={() => { onDuplicate(); handleMenuClose(); }}>
            <ContentCopy sx={{ mr: 1 }} fontSize="small" />
            Duplicate
          </MenuItem>
          <MenuItem onClick={() => { onDelete(); handleMenuClose(); }} sx={{ color: 'error.main' }}>
            <Delete sx={{ mr: 1 }} fontSize="small" />
            Delete
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
};

interface AssessmentRowProps {
  assessment: AssessmentType;
  itemCount: number;
  onEdit: () => void;
  onDelete: () => void;
  onRun: () => void;
}

const AssessmentRow: React.FC<AssessmentRowProps> = ({ assessment, itemCount, onEdit, onDelete, onRun }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <TableRow hover>
      <TableCell>{assessment.title}</TableCell>
      <TableCell>{assessment.description || '-'}</TableCell>
      <TableCell>{itemCount}</TableCell>
      <TableCell>{assessment.settings.timeLimit ? `${assessment.settings.timeLimit} min` : '-'}</TableCell>
      <TableCell>{assessment.settings.maxAttempts || 'Unlimited'}</TableCell>
      <TableCell>{assessment.updatedAt.toLocaleDateString()}</TableCell>
      <TableCell align="right">
        <IconButton size="small" onClick={handleMenuClick}>
          <MoreVert />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { onRun(); handleMenuClose(); }}>
            <PlayArrow sx={{ mr: 1 }} fontSize="small" />
            Run Assessment
          </MenuItem>
          <MenuItem onClick={() => { onEdit(); handleMenuClose(); }}>
            <Edit sx={{ mr: 1 }} fontSize="small" />
            Edit
          </MenuItem>
          <MenuItem onClick={() => { onDelete(); handleMenuClose(); }} sx={{ color: 'error.main' }}>
            <Delete sx={{ mr: 1 }} fontSize="small" />
            Delete
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
};


interface CreateAssessmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (assessment: Partial<AssessmentType>) => void;
  items: QTIItem[];
  editingAssessment?: AssessmentType | null;
}

const CreateAssessmentDialog: React.FC<CreateAssessmentDialogProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  items,
  editingAssessment 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [timeLimit, setTimeLimit] = useState('');
  const [maxAttempts, setMaxAttempts] = useState('');
  const [showFeedback, setShowFeedback] = useState(true);

  useEffect(() => {
    if (editingAssessment) {
      setTitle(editingAssessment.title);
      setDescription(editingAssessment.description || '');
      setSelectedItems(editingAssessment.itemIds);
      setTimeLimit(editingAssessment.settings.timeLimit?.toString() || '');
      setMaxAttempts(editingAssessment.settings.maxAttempts?.toString() || '');
      setShowFeedback(editingAssessment.settings.showFeedback ?? true);
    } else {
      setTitle('');
      setDescription('');
      setSelectedItems([]);
      setTimeLimit('');
      setMaxAttempts('');
      setShowFeedback(true);
    }
  }, [editingAssessment, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedItems.length === 0) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      itemIds: selectedItems,
      settings: {
        timeLimit: timeLimit ? parseInt(timeLimit) : undefined,
        maxAttempts: maxAttempts ? parseInt(maxAttempts) : undefined,
        showFeedback,
      },
    });
    onClose();
  };

  const handleToggleItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{editingAssessment ? 'Edit Assessment' : 'Create New Assessment'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Assessment Title"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description (optional)"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Select Items</Typography>
          <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto', mb: 2 }}>
            <List dense>
              {items.map((item) => (
                <ListItem key={item.id} button onClick={() => handleToggleItem(item.id)}>
                  <Checkbox
                    edge="start"
                    checked={selectedItems.includes(item.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText 
                    primary={item.title} 
                    secondary={`QTI ${item.qtiVersion}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Time Limit (minutes)"
                fullWidth
                variant="outlined"
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Max Attempts"
                fullWidth
                variant="outlined"
                type="number"
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showFeedback}
                    onChange={(e) => setShowFeedback(e.target.checked)}
                  />
                }
                label="Show feedback after submission"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={selectedItems.length === 0}>
            {editingAssessment ? 'Save Changes' : 'Create Assessment'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<AssessmentType | null>(null);

  const loadProject = useCallback(async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      const projectData = await projectService.getProject(projectId, user?.uid);
      setProject(projectData);
    } catch (err) {
      console.error('Error loading project:', err);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [projectId, user?.uid]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);


  const handleDeleteItem = async (itemId: string) => {
    if (!project || !window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const updatedItems = project.items.filter(item => item.id !== itemId);
      await projectService.updateProject(
        project.id,
        { items: updatedItems },
        user?.uid
      );
      setProject({ ...project, items: updatedItems });
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item');
    }
  };

  const handleDuplicateItem = async (item: QTIItem) => {
    if (!project) return;

    try {
      const duplicatedItem: QTIItem = {
        ...item,
        id: Date.now().toString(),
        title: `${item.title} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedItems = [...project.items, duplicatedItem];
      await projectService.updateProject(
        project.id,
        { items: updatedItems },
        user?.uid
      );
      setProject({ ...project, items: updatedItems });
    } catch (err) {
      console.error('Error duplicating item:', err);
      setError('Failed to duplicate item');
    }
  };

  const handleCreateAssessment = async (assessmentData: Partial<AssessmentType>) => {
    if (!project) return;

    try {
      const newAssessment: AssessmentType = {
        id: editingAssessment?.id || Date.now().toString(),
        title: assessmentData.title || 'New Assessment',
        description: assessmentData.description,
        itemIds: assessmentData.itemIds || [],
        settings: assessmentData.settings || {},
        createdAt: editingAssessment?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      const updatedAssessments = editingAssessment
        ? project.assessments.map(a => a.id === editingAssessment.id ? newAssessment : a)
        : [...project.assessments, newAssessment];

      await projectService.updateProject(
        project.id,
        { assessments: updatedAssessments },
        user?.uid
      );

      setProject({ ...project, assessments: updatedAssessments });
      setEditingAssessment(null);
    } catch (err) {
      console.error('Error saving assessment:', err);
      setError('Failed to save assessment');
    }
  };

  const handleDeleteAssessment = async (assessmentId: string) => {
    if (!project || !window.confirm('Are you sure you want to delete this assessment?')) return;

    try {
      const updatedAssessments = project.assessments.filter(a => a.id !== assessmentId);
      await projectService.updateProject(
        project.id,
        { assessments: updatedAssessments },
        user?.uid
      );
      setProject({ ...project, assessments: updatedAssessments });
    } catch (err) {
      console.error('Error deleting assessment:', err);
      setError('Failed to delete assessment');
    }
  };

  const handleRunAssessment = (assessmentId: string) => {
    navigate(`/playground?assessmentId=${assessmentId}&projectId=${projectId}`);
  };

  const handleEditItem = (itemId: string) => {
    const url = `/project/${projectId}/item-editor?itemId=${itemId}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading project...</Typography>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container>
        <Alert severity="error">Project not found</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/')}>
          Back to Projects
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={() => navigate('/')}
            sx={{ mb: 2 }}
          >
            Back to Projects
          </Button>
          
          <Typography variant="h4" component="h1" gutterBottom>
            {project.name}
          </Typography>
          {project.description && (
            <Typography variant="body1" color="text.secondary">
              {project.description}
            </Typography>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab 
              label={`Item Bank (${project.items.length})`} 
              icon={<QuestionAnswer />} 
              iconPosition="start"
            />
            <Tab 
              label={`Assessments (${project.assessments.length})`} 
              icon={<Assessment />} 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Items Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                const url = `/project/${projectId}/item-editor?new=true`;
                window.open(url, '_blank');
              }}
            >
              Create New Item
            </Button>
          </Box>

          {project.items.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                No items yet
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Create your first assessment item to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  const url = `/project/${projectId}/item-editor?new=true`;
                  window.open(url, '_blank');
                }}
              >
                Create First Item
              </Button>
            </Card>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>QTI Version</TableCell>
                    <TableCell>Last Updated</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {project.items.map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      onEdit={() => handleEditItem(item.id)}
                      onDelete={() => handleDeleteItem(item.id)}
                      onDuplicate={() => handleDuplicateItem(item)}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        {/* Assessments Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                const url = `/project/${projectId}/assessment-editor?new=true`;
                window.open(url, '_blank');
              }}
            >
              Create New Assessment
            </Button>
          </Box>

          {project.items.length === 0 ? (
            <Alert severity="info">
              You need to create items before you can create assessments
            </Alert>
          ) : project.assessments.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                No assessments yet
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Create an assessment to organize your items into a test
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  const url = `/project/${projectId}/assessment-editor?new=true`;
                  window.open(url, '_blank');
                }}
              >
                Create First Assessment
              </Button>
            </Card>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Time Limit</TableCell>
                    <TableCell>Max Attempts</TableCell>
                    <TableCell>Last Updated</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {project.assessments.map((assessment) => (
                    <AssessmentRow
                      key={assessment.id}
                      assessment={assessment}
                      itemCount={assessment.itemIds?.length || assessment.blocks?.filter(b => b.type === 'item').reduce((sum, block) => {
                        const itemBlock = block as ItemBlock;
                        return sum + (itemBlock.selectionType === 'specific' 
                          ? (itemBlock.specificItemIds?.length || 0)
                          : (itemBlock.count || 0)
                        );
                      }, 0) || 0}
                      onEdit={() => {
                        const url = `/project/${projectId}/assessment-editor?assessmentId=${assessment.id}`;
                        window.open(url, '_blank');
                      }}
                      onDelete={() => handleDeleteAssessment(assessment.id)}
                      onRun={() => handleRunAssessment(assessment.id)}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        {/* Dialogs */}
        <CreateAssessmentDialog
          open={assessmentDialogOpen}
          onClose={() => {
            setAssessmentDialogOpen(false);
            setEditingAssessment(null);
          }}
          onSubmit={handleCreateAssessment}
          items={project.items}
          editingAssessment={editingAssessment}
        />
      </Container>
    </Box>
  );
};

export default ProjectDetail;