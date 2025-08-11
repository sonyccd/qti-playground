import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  FormControlLabel,
  Slider,
  Autocomplete,
  Fab,
  Menu,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
} from '@mui/material';
import {
  Save,
  Cancel,
  Visibility,
  Code,
  DragIndicator,
  Add,
  Delete,
  Edit,
  Preview,
  CheckCircle,
  Timeline,
  Assignment,
  Info,
  PlayArrow,
  Publish,
  ExpandMore,
  QuestionAnswer,
  TextSnippet,
  School,
  TouchApp,
  MyLocation,
  ViewList,
  ContentCopy,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useAuth } from '@/contexts/AuthContext';
import { projectService } from '@/services/projectService';
import { 
  Assessment, 
  TimelineBlock, 
  ItemBlock, 
  InstructionBlock, 
  QTIItem, 
  Project,
  PackagedAssessment,
} from '@/types/project';

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
      id={`assessment-editor-tabpanel-${index}`}
      aria-labelledby={`assessment-editor-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

// Block type definitions for the timeline
const BLOCK_TYPES = [
  {
    id: 'choice',
    type: 'item' as const,
    selectionType: 'random' as const,
    name: 'Multiple Choice (Random)',
    description: 'Randomly select from multiple choice questions',
    icon: <QuestionAnswer />,
    color: '#1976d2',
  },
  {
    id: 'text-entry',
    type: 'item' as const,
    selectionType: 'random' as const,
    name: 'Text Entry (Random)',
    description: 'Randomly select from text input questions',
    icon: <Edit />,
    color: '#388e3c',
  },
  {
    id: 'essay',
    type: 'item' as const,
    selectionType: 'random' as const,
    name: 'Essay (Random)',
    description: 'Randomly select from essay questions',
    icon: <TextSnippet />,
    color: '#f57c00',
  },
  {
    id: 'specific-items',
    type: 'item' as const,
    selectionType: 'specific' as const,
    name: 'Specific Items',
    description: 'Choose exact items from your item bank',
    icon: <ViewList />,
    color: '#d32f2f',
  },
  {
    id: 'instruction',
    type: 'instruction' as const,
    name: 'Instructions',
    description: 'Information or directions for test-takers',
    icon: <Info />,
    color: '#7b1fa2',
  },
];

interface BlockCardProps {
  block: TimelineBlock;
  index: number;
  availableGroups: string[];
  project: Project | null;
  onUpdate: (block: TimelineBlock) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

const BlockCard: React.FC<BlockCardProps> = ({
  block,
  index,
  availableGroups,
  project,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const blockType = BLOCK_TYPES.find(bt => {
    if (block.type === 'instruction') {
      return bt.type === 'instruction';
    } else {
      const itemBlock = block as ItemBlock;
      return bt.type === 'item' && 
        ((itemBlock.selectionType === 'random' && bt.id === itemBlock.itemType) ||
         (itemBlock.selectionType === 'specific' && bt.id === 'specific-items'));
    }
  });

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Draggable draggableId={block.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          sx={{
            mb: 2,
            border: snapshot.isDragging ? '2px solid #1976d2' : '1px solid #e0e0e0',
            bgcolor: snapshot.isDragging ? 'action.hover' : 'background.paper',
          }}
        >
          <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
            <AccordionSummary>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box 
                  {...provided.dragHandleProps}
                  sx={{ display: 'flex', alignItems: 'center', mr: 2, cursor: 'grab' }}
                >
                  <DragIndicator sx={{ color: 'text.secondary' }} />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  {blockType?.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {index + 1}. {blockType?.name}
                  </Typography>
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                  {block.type === 'item' && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {(block as ItemBlock).selectionType === 'random' && (
                        <>
                          <Chip 
                            label={`${(block as ItemBlock).count} items`} 
                            size="small" 
                            variant="outlined" 
                          />
                          {(block as ItemBlock).groups?.map(group => (
                            <Chip 
                              key={group} 
                              label={group} 
                              size="small" 
                              color="secondary"
                            />
                          ))}
                        </>
                      )}
                      {(block as ItemBlock).selectionType === 'specific' && (
                        <Chip 
                          label={`${(block as ItemBlock).specificItemIds?.length || 0} specific items`} 
                          size="small" 
                          variant="outlined"
                          color="error"
                        />
                      )}
                    </Box>
                  )}
                  {block.type === 'instruction' && (
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {(block as InstructionBlock).title}
                    </Typography>
                  )}
                </Box>

                <IconButton size="small" onClick={handleMenuClick}>
                  <Edit />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem onClick={() => { onDuplicate(); handleMenuClose(); }}>
                    <ContentCopy sx={{ mr: 1 }} fontSize="small" />
                    Duplicate
                  </MenuItem>
                  <MenuItem 
                    onClick={() => { onMoveUp(); handleMenuClose(); }} 
                    disabled={!canMoveUp}
                  >
                    <ArrowUpward sx={{ mr: 1 }} fontSize="small" />
                    Move Up
                  </MenuItem>
                  <MenuItem 
                    onClick={() => { onMoveDown(); handleMenuClose(); }} 
                    disabled={!canMoveDown}
                  >
                    <ArrowDownward sx={{ mr: 1 }} fontSize="small" />
                    Move Down
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => { onDelete(); handleMenuClose(); }} sx={{ color: 'error.main' }}>
                    <Delete sx={{ mr: 1 }} fontSize="small" />
                    Delete
                  </MenuItem>
                </Menu>
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              {block.type === 'item' && (block as ItemBlock).selectionType === 'random' && (
                <RandomItemBlockEditor 
                  block={block as ItemBlock}
                  availableGroups={availableGroups}
                  onUpdate={onUpdate}
                />
              )}
              {block.type === 'item' && (block as ItemBlock).selectionType === 'specific' && (
                <SpecificItemBlockEditor 
                  block={block as ItemBlock}
                  availableItems={project?.items || []}
                  onUpdate={onUpdate}
                />
              )}
              {block.type === 'instruction' && (
                <InstructionBlockEditor 
                  block={block as InstructionBlock}
                  onUpdate={onUpdate}
                />
              )}
            </AccordionDetails>
          </Accordion>
        </Card>
      )}
    </Draggable>
  );
};

interface RandomItemBlockEditorProps {
  block: ItemBlock;
  availableGroups: string[];
  onUpdate: (block: TimelineBlock) => void;
}

const RandomItemBlockEditor: React.FC<RandomItemBlockEditorProps> = ({ block, availableGroups, onUpdate }) => {
  return (
    <Grid container spacing={2}>
      <Grid size={{xs: 12, md: 6}}>
        <TextField
          label="Number of Items"
          type="number"
          fullWidth
          value={block.count || 1}
          onChange={(e) => onUpdate({ 
            ...block, 
            count: Math.max(1, parseInt(e.target.value) || 1) 
          })}
          inputProps={{ min: 1, max: 50 }}
        />
      </Grid>
      <Grid size={{xs: 12, md: 6}}>
        <FormControlLabel
          control={
            <Switch
              checked={block.randomize || false}
              onChange={(e) => onUpdate({ ...block, randomize: e.target.checked })}
            />
          }
          label="Randomize Selection"
        />
      </Grid>
      <Grid size={12}>
        <Autocomplete
          multiple
          options={availableGroups}
          value={block.groups || []}
          onChange={(e, newValue) => onUpdate({ ...block, groups: newValue })}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Filter by Groups" 
              placeholder="Select groups to filter items (leave empty for all)"
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip 
                key={option}
                variant="outlined" 
                label={option} 
                {...getTagProps({ index })} 
                color="secondary"
              />
            ))
          }
        />
      </Grid>
    </Grid>
  );
};

interface SpecificItemBlockEditorProps {
  block: ItemBlock;
  availableItems: QTIItem[];
  onUpdate: (block: TimelineBlock) => void;
}

const SpecificItemBlockEditor: React.FC<SpecificItemBlockEditorProps> = ({ block, availableItems, onUpdate }) => {
  const selectedItems = availableItems.filter(item => 
    block.specificItemIds?.includes(item.id) || false
  );

  const handleItemToggle = (itemId: string) => {
    const currentIds = block.specificItemIds || [];
    const newIds = currentIds.includes(itemId)
      ? currentIds.filter(id => id !== itemId)
      : [...currentIds, itemId];
    
    onUpdate({ ...block, specificItemIds: newIds });
  };

  const handleSelectAll = () => {
    const allIds = availableItems.map(item => item.id);
    onUpdate({ ...block, specificItemIds: allIds });
  };

  const handleClearAll = () => {
    onUpdate({ ...block, specificItemIds: [] });
  };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1">
            Selected Items ({selectedItems.length} of {availableItems.length})
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" onClick={handleSelectAll} disabled={availableItems.length === 0}>
              Select All
            </Button>
            <Button size="small" onClick={handleClearAll} disabled={selectedItems.length === 0}>
              Clear All
            </Button>
          </Box>
        </Box>
      </Grid>
      
      <Grid size={12}>
        {availableItems.length === 0 ? (
          <Alert severity="info">
            No items available in the item bank. Create some items first.
          </Alert>
        ) : (
          <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto' }}>
            <List dense>
              {availableItems.map((item) => (
                <ListItem key={item.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={block.specificItemIds?.includes(item.id) || false}
                        onChange={() => handleItemToggle(item.id)}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1">{item.title}</Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          <Chip 
                            label={`QTI ${item.qtiVersion}`} 
                            size="small" 
                            variant="outlined" 
                          />
                          {item.itemType && (
                            <Chip 
                              label={item.itemType} 
                              size="small" 
                              variant="outlined"
                              color="primary"
                            />
                          )}
                          {item.groups?.map(group => (
                            <Chip 
                              key={group}
                              label={group} 
                              size="small" 
                              variant="outlined"
                              color="secondary"
                            />
                          ))}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

interface InstructionBlockEditorProps {
  block: InstructionBlock;
  onUpdate: (block: TimelineBlock) => void;
}

const InstructionBlockEditor: React.FC<InstructionBlockEditorProps> = ({ block, onUpdate }) => {
  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <TextField
          label="Instruction Title"
          fullWidth
          value={block.title}
          onChange={(e) => onUpdate({ ...block, title: e.target.value })}
        />
      </Grid>
      <Grid size={12}>
        <TextField
          label="Content"
          fullWidth
          multiline
          rows={4}
          value={block.content}
          onChange={(e) => onUpdate({ ...block, content: e.target.value })}
          placeholder="Enter instructions for test-takers..."
        />
      </Grid>
      <Grid size={12}>
        <FormControlLabel
          control={
            <Switch
              checked={block.allowSkip || false}
              onChange={(e) => onUpdate({ ...block, allowSkip: e.target.checked })}
            />
          }
          label="Allow test-takers to skip this instruction"
        />
      </Grid>
    </Grid>
  );
};

const AssessmentEditor: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const assessmentId = searchParams.get('assessmentId');
  const isNew = searchParams.get('new') === 'true';

  // Editor state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [addBlockDialogOpen, setAddBlockDialogOpen] = useState(false);

  // Data
  const [project, setProject] = useState<Project | null>(null);
  const [originalAssessment, setOriginalAssessment] = useState<Assessment | null>(null);
  const [assessment, setAssessment] = useState<Assessment>({
    id: '',
    title: '',
    description: '',
    blocks: [],
    settings: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [packagedAssessment, setPackagedAssessment] = useState<PackagedAssessment | null>(null);

  const steps = ['Design Timeline', 'Configure Settings', 'Package & Preview'];

  // Load data
  const loadProjectCallback = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      const projectData = await projectService.getProject(projectId, user?.uid);
      setProject(projectData);

      if (!isNew && assessmentId) {
        const existingAssessment = projectData?.assessments.find(a => a.id === assessmentId);
        if (existingAssessment) {
          setOriginalAssessment(existingAssessment);
          setAssessment({
            ...existingAssessment,
            // Ensure blocks array exists for new timeline-based assessments
            blocks: existingAssessment.blocks || [],
          });
          setCurrentStep(0);
        } else {
          setError('Assessment not found');
        }
      } else if (isNew) {
        setAssessment({
          id: Date.now().toString(),
          title: 'New Assessment',
          description: '',
          blocks: [],
          settings: {
            shuffleItems: false,
            timeLimit: undefined,
            allowReview: true,
            showFeedback: true,
            maxAttempts: undefined,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        setCurrentStep(0);
      }
    } catch (err) {
      console.error('Error loading project:', err);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [projectId, user?.uid, assessmentId, isNew]);

  useEffect(() => {
    loadProjectCallback();
  }, [loadProjectCallback]);


  // Get available groups from items
  const availableGroups = project?.items.reduce((groups: string[], item) => {
    if (item.groups) {
      item.groups.forEach(group => {
        if (!groups.includes(group)) {
          groups.push(group);
        }
      });
    }
    return groups;
  }, []) || [];

  const updateAssessment = (updates: Partial<Assessment>) => {
    setAssessment(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const addBlock = (blockTypeId: string) => {
    const blockType = BLOCK_TYPES.find(bt => bt.id === blockTypeId);
    
    const newBlock: TimelineBlock = blockTypeId === 'instruction' 
      ? {
          id: Date.now().toString(),
          type: 'instruction',
          order: assessment.blocks.length,
          title: 'New Instruction',
          content: '',
          allowSkip: true,
        } as InstructionBlock
      : blockTypeId === 'specific-items'
      ? {
          id: Date.now().toString(),
          type: 'item',
          order: assessment.blocks.length,
          selectionType: 'specific',
          specificItemIds: [],
        } as ItemBlock
      : {
          id: Date.now().toString(),
          type: 'item',
          order: assessment.blocks.length,
          selectionType: 'random',
          itemType: blockTypeId as 'choice' | 'text-entry' | 'essay' | 'drag-drop' | 'hotspot' | 'ordering',
          count: 1,
          randomize: true,
        } as ItemBlock;

    updateAssessment({
      blocks: [...assessment.blocks, newBlock],
    });
    setAddBlockDialogOpen(false);
  };

  const updateBlock = (blockId: string, updatedBlock: TimelineBlock) => {
    updateAssessment({
      blocks: assessment.blocks.map(block => 
        block.id === blockId ? updatedBlock : block
      ),
    });
  };

  const deleteBlock = (blockId: string) => {
    updateAssessment({
      blocks: assessment.blocks.filter(block => block.id !== blockId),
    });
  };

  const duplicateBlock = (blockId: string) => {
    const blockToDuplicate = assessment.blocks.find(b => b.id === blockId);
    if (blockToDuplicate) {
      const duplicatedBlock: TimelineBlock = {
        ...blockToDuplicate,
        id: Date.now().toString(),
        order: assessment.blocks.length,
      };
      updateAssessment({
        blocks: [...assessment.blocks, duplicatedBlock],
      });
    }
  };

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    const currentIndex = assessment.blocks.findIndex(b => b.id === blockId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= assessment.blocks.length) return;

    const newBlocks = [...assessment.blocks];
    [newBlocks[currentIndex], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[currentIndex]];
    
    // Update order values
    newBlocks.forEach((block, index) => {
      block.order = index;
    });

    updateAssessment({ blocks: newBlocks });
  };

  const onDragEnd = (result: { destination?: { index: number }; source: { index: number } }) => {
    if (!result.destination) return;

    const items = Array.from(assessment.blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order values
    items.forEach((block, index) => {
      block.order = index;
    });

    updateAssessment({ blocks: items });
  };

  // Package assessment - select actual items based on blocks
  const packageAssessment = () => {
    if (!project) return;

    const selectedItems: QTIItem[] = [];
    const instructionBlocks: InstructionBlock[] = [];

    assessment.blocks.forEach(block => {
      if (block.type === 'item') {
        const itemBlock = block as ItemBlock;
        
        if (itemBlock.selectionType === 'specific') {
          // Add specific items directly
          const specificItems = project.items.filter(item =>
            itemBlock.specificItemIds?.includes(item.id) || false
          );
          selectedItems.push(...specificItems);
        } else if (itemBlock.selectionType === 'random' && itemBlock.itemType) {
          // Filter items by type and groups (existing logic)
          let availableItems = project.items.filter(item => 
            item.itemType === itemBlock.itemType
          );

          if (itemBlock.groups && itemBlock.groups.length > 0) {
            availableItems = availableItems.filter(item =>
              item.groups && item.groups.some(group => 
                itemBlock.groups!.includes(group)
              )
            );
          }

          // Randomly select items
          const shuffled = itemBlock.randomize 
            ? [...availableItems].sort(() => Math.random() - 0.5)
            : availableItems;
          
          const selected = shuffled.slice(0, Math.min(itemBlock.count || 1, shuffled.length));
          selectedItems.push(...selected);
        }
      } else if (block.type === 'instruction') {
        instructionBlocks.push(block as InstructionBlock);
      }
    });

    const packaged: PackagedAssessment = {
      id: `packaged_${assessment.id}_${Date.now()}`,
      sourceAssessmentId: assessment.id,
      title: assessment.title,
      description: assessment.description,
      selectedItems,
      instructionBlocks,
      settings: assessment.settings,
      packagedAt: new Date(),
      isPublished: false,
    };

    setPackagedAssessment(packaged);
    setCurrentStep(2);
  };

  const handleSave = async () => {
    if (!projectId || !assessment.title.trim()) {
      setError('Please provide a title for the assessment');
      return;
    }

    try {
      setLoading(true);
      const project = await projectService.getProject(projectId, user?.uid);
      if (!project) return;

      if (isNew) {
        const updatedAssessments = [...project.assessments, assessment];
        await projectService.updateProject(
          projectId,
          { assessments: updatedAssessments },
          user?.uid
        );
      } else if (originalAssessment) {
        const updatedAssessments = project.assessments.map(a =>
          a.id === originalAssessment.id
            ? { ...assessment, updatedAt: new Date() }
            : a
        );
        await projectService.updateProject(
          projectId,
          { assessments: updatedAssessments },
          user?.uid
        );
      }

      setHasUnsavedChanges(false);
      window.close();
    } catch (err) {
      console.error('Error saving assessment:', err);
      setError('Failed to save assessment');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowCancelDialog(true);
    } else {
      window.close();
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading assessment editor...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h1">
            {isNew ? 'Create New Assessment' : `Edit Assessment: ${originalAssessment?.title}`}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={!assessment.title.trim()}
            >
              Save Assessment
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Progress Stepper */}
        <Stepper activeStep={currentStep} sx={{ mt: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Container maxWidth="lg">
        {/* Step 0: Design Timeline */}
        {currentStep === 0 && (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Assessment Timeline
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Design your assessment by adding blocks to the timeline. Each block can be an item type or instruction screen.
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{xs: 12, md: 6}}>
                  <TextField
                    label="Assessment Title"
                    fullWidth
                    value={assessment.title}
                    onChange={(e) => updateAssessment({ title: e.target.value })}
                  />
                </Grid>
                <Grid size={{xs: 12, md: 6}}>
                  <TextField
                    label="Description (optional)"
                    fullWidth
                    value={assessment.description}
                    onChange={(e) => updateAssessment({ description: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Timeline */}
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="timeline">
                {(provided) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    sx={{ mb: 3 }}
                  >
                    {assessment.blocks.length === 0 ? (
                      <Card sx={{ p: 4, textAlign: 'center' }}>
                        <Timeline sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                          No blocks in timeline
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                          Add your first block to start building the assessment
                        </Typography>
                      </Card>
                    ) : (
                      assessment.blocks.map((block, index) => (
                        <BlockCard
                          key={block.id}
                          block={block}
                          index={index}
                          availableGroups={availableGroups}
                          project={project}
                          onUpdate={(updatedBlock) => updateBlock(block.id, updatedBlock)}
                          onDelete={() => deleteBlock(block.id)}
                          onDuplicate={() => duplicateBlock(block.id)}
                          onMoveUp={() => moveBlock(block.id, 'up')}
                          onMoveDown={() => moveBlock(block.id, 'down')}
                          canMoveUp={index > 0}
                          canMoveDown={index < assessment.blocks.length - 1}
                        />
                      ))
                    )}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>

            {/* Add Block Button */}
            <Fab
              color="primary"
              sx={{ position: 'fixed', bottom: 16, right: 16 }}
              onClick={() => setAddBlockDialogOpen(true)}
            >
              <Add />
            </Fab>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="contained"
                onClick={() => setCurrentStep(1)}
                disabled={assessment.blocks.length === 0}
                size="large"
              >
                Configure Settings
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 1: Configure Settings */}
        {currentStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Assessment Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{xs: 12, md: 6}}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Timing & Attempts
                  </Typography>
                  <TextField
                    label="Time Limit (minutes)"
                    type="number"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={assessment.settings.timeLimit || ''}
                    onChange={(e) => updateAssessment({
                      settings: {
                        ...assessment.settings,
                        timeLimit: e.target.value ? parseInt(e.target.value) : undefined,
                      }
                    })}
                  />
                  <TextField
                    label="Max Attempts"
                    type="number"
                    fullWidth
                    value={assessment.settings.maxAttempts || ''}
                    onChange={(e) => updateAssessment({
                      settings: {
                        ...assessment.settings,
                        maxAttempts: e.target.value ? parseInt(e.target.value) : undefined,
                      }
                    })}
                  />
                </Paper>
              </Grid>
              <Grid size={{xs: 12, md: 6}}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Navigation & Feedback
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={assessment.settings.allowReview || false}
                        onChange={(e) => updateAssessment({
                          settings: {
                            ...assessment.settings,
                            allowReview: e.target.checked,
                          }
                        })}
                      />
                    }
                    label="Allow review of answers"
                    sx={{ display: 'block', mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={assessment.settings.showFeedback || false}
                        onChange={(e) => updateAssessment({
                          settings: {
                            ...assessment.settings,
                            showFeedback: e.target.checked,
                          }
                        })}
                      />
                    }
                    label="Show feedback after submission"
                    sx={{ display: 'block', mb: 1 }}
                  />
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button onClick={() => setCurrentStep(0)}>
                Back to Timeline
              </Button>
              <Button
                variant="contained"
                onClick={packageAssessment}
                size="large"
              >
                Package Assessment
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 2: Package & Preview */}
        {currentStep === 2 && packagedAssessment && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Package Preview
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              This is what test-takers will see. Items have been selected based on your timeline blocks.
            </Alert>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                {packagedAssessment.title}
              </Typography>
              {packagedAssessment.description && (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {packagedAssessment.description}
                </Typography>
              )}

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid>
                  <Chip 
                    icon={<Assignment />}
                    label={`${packagedAssessment.selectedItems.length} items`} 
                    color="primary"
                  />
                </Grid>
                <Grid>
                  <Chip 
                    icon={<Info />}
                    label={`${packagedAssessment.instructionBlocks.length} instruction screens`} 
                    color="secondary"
                  />
                </Grid>
                {packagedAssessment.settings.timeLimit && (
                  <Grid>
                    <Chip label={`${packagedAssessment.settings.timeLimit} min limit`} />
                  </Grid>
                )}
              </Grid>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="h6" gutterBottom>
                Selected Items:
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  By Type:
                </Typography>
                {Object.entries(
                  packagedAssessment.selectedItems.reduce((acc, item) => {
                    const type = item.itemType || 'unknown';
                    acc[type] = (acc[type] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([type, count]) => (
                  <Chip 
                    key={type}
                    label={`${count} ${type} items`} 
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Selection Method:
                </Typography>
                {assessment.blocks.filter(b => b.type === 'item').map((block, index) => {
                  const itemBlock = block as ItemBlock;
                  return (
                    <Chip
                      key={block.id}
                      label={
                        itemBlock.selectionType === 'specific' 
                          ? `Block ${index + 1}: ${itemBlock.specificItemIds?.length || 0} specific items`
                          : `Block ${index + 1}: ${itemBlock.count || 0} random ${itemBlock.itemType} items`
                      }
                      color={itemBlock.selectionType === 'specific' ? 'error' : 'primary'}
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  );
                })}
              </Box>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setCurrentStep(1)}>
                Back to Settings
              </Button>
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<Preview />}
                  sx={{ mr: 1 }}
                  onClick={() => {
                    // TODO: Open preview in new tab
                    console.log('Preview assessment:', packagedAssessment);
                  }}
                >
                  Preview Assessment
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Publish />}
                  onClick={() => {
                    // TODO: Publish assessment
                    console.log('Publish assessment:', packagedAssessment);
                    handleSave();
                  }}
                >
                  Save & Publish
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        {/* Add Block Dialog */}
        <Dialog 
          open={addBlockDialogOpen} 
          onClose={() => setAddBlockDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Add Block to Timeline</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              {BLOCK_TYPES.map((blockType) => (
                <Grid size={{xs: 12, sm: 6, md: 3}} key={blockType.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4,
                      },
                      border: `2px solid ${blockType.color}`,
                      bgcolor: `${blockType.color}08`,
                    }}
                    onClick={() => addBlock(blockType.id)}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Box sx={{ color: blockType.color, mb: 1 }}>
                        {blockType.icon}
                      </Box>
                      <Typography variant="h6" gutterBottom>
                        {blockType.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {blockType.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddBlockDialogOpen(false)}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Cancel Confirmation Dialog */}
        <Dialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)}>
          <DialogTitle>Unsaved Changes</DialogTitle>
          <DialogContent>
            <Typography>
              You have unsaved changes. If you cancel now, all changes will be lost.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCancelDialog(false)}>
              Continue Editing
            </Button>
            <Button onClick={() => window.close()} color="error" variant="contained">
              Discard Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AssessmentEditor;