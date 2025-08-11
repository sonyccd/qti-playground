import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { projectService } from '@/services/projectService';
import { QTIItem } from '@/types/project';

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
      id={`editor-tabpanel-${index}`}
      aria-labelledby={`editor-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

// Item types available for authoring
const ITEM_TYPES = [
  {
    id: 'choice',
    name: 'Multiple Choice',
    description: 'Single or multiple correct answers from a list of options',
    icon: '🔘',
  },
  {
    id: 'text-entry',
    name: 'Text Entry',
    description: 'Short text or numeric input response',
    icon: '✏️',
  },
  {
    id: 'essay',
    name: 'Essay',
    description: 'Extended text response for open-ended questions',
    icon: '📝',
  },
  {
    id: 'drag-drop',
    name: 'Drag & Drop',
    description: 'Drag items to correct positions or categories',
    icon: '🔄',
  },
  {
    id: 'hotspot',
    name: 'Hotspot',
    description: 'Click on areas of an image or graphic',
    icon: '🎯',
  },
  {
    id: 'ordering',
    name: 'Ordering',
    description: 'Arrange items in the correct sequence',
    icon: '📋',
  },
];

interface ChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface ItemContent {
  type: string;
  title: string;
  stem: string;
  choices?: ChoiceOption[];
  correctAnswer?: string;
  allowMultiple?: boolean;
  groups?: string[];
  feedback?: {
    correct?: string;
    incorrect?: string;
  };
}

const ItemEditor: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get('itemId');
  const isNew = searchParams.get('new') === 'true';

  // Editor state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  // Item data
  const [originalItem, setOriginalItem] = useState<QTIItem | null>(null);
  const [itemContent, setItemContent] = useState<ItemContent>({
    type: '',
    title: '',
    stem: '',
    choices: [],
    feedback: {},
  });
  const [qtiVersion, setQtiVersion] = useState<'2.1' | '3.0'>('2.1');

  const steps = ['Select Type', 'Design Item', 'Preview & Test'];

  const loadItemCallback = useCallback(async () => {
    if (!projectId || !itemId) return;
    
    try {
      setLoading(true);
      const project = await projectService.getProject(projectId, user?.uid);
      const item = project?.items.find(i => i.id === itemId);
      
      if (item) {
        setOriginalItem(item);
        setQtiVersion(item.qtiVersion);
        // Parse existing content - this would need more sophisticated parsing in a real app
        setItemContent({
          type: item.itemType || 'choice',
          title: item.title,
          stem: 'Edit your question here...',
          groups: item.groups || [],
          choices: [
            { id: '1', text: 'Option A', isCorrect: true },
            { id: '2', text: 'Option B', isCorrect: false },
          ],
        });
        setCurrentStep(1); // Skip type selection for existing items
      } else {
        setError('Item not found');
      }
    } catch (err) {
      console.error('Error loading item:', err);
      setError('Failed to load item');
    } finally {
      setLoading(false);
    }
  }, [projectId, itemId, user?.uid]);

  // Load existing item if editing
  useEffect(() => {
    if (!isNew && itemId && projectId) {
      loadItemCallback();
    } else if (isNew) {
      setCurrentStep(0);
    }
  }, [isNew, itemId, projectId, loadItemCallback]);


  // Generate QTI XML from current content
  const generateQTI = useCallback(() => {
    if (!itemContent.type || !itemContent.title) return '';

    // Basic QTI 2.1 structure for multiple choice
    if (itemContent.type === 'choice' && itemContent.choices) {
      const responseIdentifier = 'RESPONSE';
      const outcomeIdentifier = 'SCORE';
      
      const choiceElements = itemContent.choices.map(choice => 
        `    <simpleChoice identifier="${choice.id}">${choice.text}</simpleChoice>`
      ).join('\n');
      
      const correctResponses = itemContent.choices
        .filter(choice => choice.isCorrect)
        .map(choice => `      <value>${choice.id}</value>`)
        .join('\n');

      return `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1"
                identifier="item_${Date.now()}"
                title="${itemContent.title}"
                adaptive="false"
                timeDependent="false">
  <responseDeclaration identifier="${responseIdentifier}" cardinality="${itemContent.allowMultiple ? 'multiple' : 'single'}" baseType="identifier">
    <correctResponse>
${correctResponses}
    </correctResponse>
  </responseDeclaration>
  <outcomeDeclaration identifier="${outcomeIdentifier}" cardinality="single" baseType="float">
    <defaultValue>
      <value>0</value>
    </defaultValue>
  </outcomeDeclaration>
  <itemBody>
    <div>
      <p>${itemContent.stem}</p>
      <choiceInteraction responseIdentifier="${responseIdentifier}" shuffle="false" maxChoices="${itemContent.allowMultiple ? itemContent.choices.length : 1}">
${choiceElements}
      </choiceInteraction>
    </div>
  </itemBody>
  <responseProcessing template="http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct"/>
</assessmentItem>`;
    }

    return '<!-- QTI content will be generated based on item type -->';
  }, [itemContent]);

  const handleSave = async () => {
    if (!projectId || !itemContent.title.trim()) {
      setError('Please provide a title for the item');
      return;
    }

    try {
      setLoading(true);
      const qtiContent = generateQTI();
      
      const itemData: Partial<QTIItem> = {
        title: itemContent.title,
        content: qtiContent,
        qtiVersion,
        itemType: itemContent.type as 'choice' | 'text-entry' | 'essay' | 'drag-drop' | 'hotspot' | 'ordering',
        groups: itemContent.groups,
      };

      if (isNew) {
        const project = await projectService.getProject(projectId, user?.uid);
        if (project) {
          const newItem: QTIItem = {
            id: Date.now().toString(),
            title: itemContent.title,
            content: qtiContent,
            qtiVersion,
            itemType: itemContent.type as 'choice' | 'text-entry' | 'essay' | 'drag-drop' | 'hotspot' | 'ordering',
            groups: itemContent.groups,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const updatedItems = [...project.items, newItem];
          await projectService.updateProject(
            projectId,
            { items: updatedItems },
            user?.uid
          );
        }
      } else if (originalItem) {
        const project = await projectService.getProject(projectId, user?.uid);
        if (project) {
          const updatedItems = project.items.map(item =>
            item.id === originalItem.id
              ? { ...item, ...itemData, updatedAt: new Date() }
              : item
          );
          await projectService.updateProject(
            projectId,
            { items: updatedItems },
            user?.uid
          );
        }
      }

      setHasUnsavedChanges(false);
      // Close the tab and return to project
      window.close();
    } catch (err) {
      console.error('Error saving item:', err);
      setError('Failed to save item');
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

  const handleCancelConfirm = () => {
    setShowCancelDialog(false);
    window.close();
  };

  const handleTypeSelect = (type: string) => {
    setItemContent(prev => ({ ...prev, type }));
    setCurrentStep(1);
    setHasUnsavedChanges(true);
  };

  const updateContent = (updates: Partial<ItemContent>) => {
    setItemContent(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const addChoice = () => {
    const newChoice: ChoiceOption = {
      id: Date.now().toString(),
      text: 'New option',
      isCorrect: false,
    };
    updateContent({
      choices: [...(itemContent.choices || []), newChoice],
    });
  };

  const updateChoice = (choiceId: string, updates: Partial<ChoiceOption>) => {
    const updatedChoices = itemContent.choices?.map(choice =>
      choice.id === choiceId ? { ...choice, ...updates } : choice
    ) || [];
    updateContent({ choices: updatedChoices });
  };

  const removeChoice = (choiceId: string) => {
    const updatedChoices = itemContent.choices?.filter(choice => choice.id !== choiceId) || [];
    updateContent({ choices: updatedChoices });
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading item editor...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h1">
            {isNew ? 'Create New Item' : `Edit Item: ${originalItem?.title}`}
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
              disabled={!itemContent.title.trim()}
            >
              Save Item
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
        {/* Step 0: Select Item Type */}
        {currentStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Choose Item Type
            </Typography>
            <Grid container spacing={2}>
              {ITEM_TYPES.map((type) => (
                <Grid item xs={12} sm={6} md={4} key={type.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => handleTypeSelect(type.id)}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                        {type.icon}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        {type.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {type.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Step 1: Design Item */}
        {currentStep === 1 && itemContent.type && (
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
                <Tab label="Editor" icon={<Edit />} iconPosition="start" />
                <Tab label="Preview" icon={<Visibility />} iconPosition="start" />
                <Tab label="QTI Source" icon={<Code />} iconPosition="start" />
              </Tabs>
            </Box>

            {/* Editor Tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                {/* Item Properties */}
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Item Properties
                    </Typography>
                    <TextField
                      fullWidth
                      label="Item Title"
                      value={itemContent.title}
                      onChange={(e) => updateContent({ title: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>QTI Version</InputLabel>
                      <Select
                        value={qtiVersion}
                        onChange={(e) => setQtiVersion(e.target.value as '2.1' | '3.0')}
                        label="QTI Version"
                      >
                        <MenuItem value="2.1">QTI 2.1</MenuItem>
                        <MenuItem value="3.0">QTI 3.0</MenuItem>
                      </Select>
                    </FormControl>
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={ITEM_TYPES.find(t => t.id === itemContent.type)?.name || 'Unknown'} 
                        color="primary" 
                        icon={<CheckCircle />}
                      />
                    </Box>
                    <TextField
                      fullWidth
                      label="Groups (comma-separated)"
                      value={itemContent.groups?.join(', ') || ''}
                      onChange={(e) => {
                        const groupsText = e.target.value;
                        const groups = groupsText
                          .split(',')
                          .map(g => g.trim())
                          .filter(g => g.length > 0);
                        updateContent({ groups });
                      }}
                      placeholder="e.g., algebra, easy, practice"
                      helperText="Used for organizing and filtering items in assessments"
                      sx={{ mb: 2 }}
                    />
                  </Paper>
                </Grid>

                {/* Content Editor */}
                <Grid item xs={12} md={8}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Question Content
                    </Typography>
                    
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Question Stem"
                      value={itemContent.stem}
                      onChange={(e) => updateContent({ stem: e.target.value })}
                      sx={{ mb: 3 }}
                      placeholder="Enter your question here..."
                    />

                    {/* Multiple Choice Editor */}
                    {itemContent.type === 'choice' && (
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle1">Answer Choices</Typography>
                          <Button
                            startIcon={<Add />}
                            onClick={addChoice}
                            variant="outlined"
                            size="small"
                          >
                            Add Choice
                          </Button>
                        </Box>

                        {itemContent.choices?.map((choice, index) => (
                          <Box key={choice.id} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                            <DragIndicator sx={{ color: 'text.secondary', cursor: 'grab' }} />
                            <TextField
                              fullWidth
                              size="small"
                              value={choice.text}
                              onChange={(e) => updateChoice(choice.id, { text: e.target.value })}
                              placeholder={`Option ${String.fromCharCode(65 + index)}`}
                            />
                            <Button
                              variant={choice.isCorrect ? 'contained' : 'outlined'}
                              size="small"
                              color={choice.isCorrect ? 'success' : 'primary'}
                              onClick={() => updateChoice(choice.id, { isCorrect: !choice.isCorrect })}
                            >
                              {choice.isCorrect ? 'Correct' : 'Mark Correct'}
                            </Button>
                            <IconButton
                              size="small"
                              onClick={() => removeChoice(choice.id)}
                              disabled={itemContent.choices?.length <= 2}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    )}

                    {/* Other item types would have their own editors here */}
                    {itemContent.type !== 'choice' && (
                      <Alert severity="info">
                        Editor for {ITEM_TYPES.find(t => t.id === itemContent.type)?.name} items coming soon!
                      </Alert>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Preview Tab */}
            <TabPanel value={tabValue} index={1}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Item Preview
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {itemContent.stem || 'No question text entered yet.'}
                </Typography>

                {itemContent.type === 'choice' && itemContent.choices && (
                  <Box>
                    {itemContent.choices.map((choice, index) => (
                      <Box key={choice.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <input type="radio" name="preview" disabled style={{ marginRight: 8 }} />
                        <Typography>{String.fromCharCode(65 + index)}. {choice.text}</Typography>
                        {choice.isCorrect && (
                          <Chip label="Correct" color="success" size="small" sx={{ ml: 1 }} />
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
            </TabPanel>

            {/* QTI Source Tab */}
            <TabPanel value={tabValue} index={2}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Generated QTI {qtiVersion}
                  </Typography>
                  <Tooltip title="This QTI is automatically generated from your item design">
                    <Button startIcon={<Code />} variant="outlined" size="small">
                      Export QTI
                    </Button>
                  </Tooltip>
                </Box>
                <Box
                  component="pre"
                  sx={{
                    bgcolor: 'grey.100',
                    p: 2,
                    borderRadius: 1,
                    overflow: 'auto',
                    fontSize: '0.875rem',
                    fontFamily: 'monospace',
                  }}
                >
                  {generateQTI()}
                </Box>
              </Paper>
            </TabPanel>

            {/* Next Step Button */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                onClick={() => setCurrentStep(2)}
                disabled={!itemContent.title.trim() || !itemContent.stem.trim()}
              >
                Preview & Test
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 2: Preview & Test */}
        {currentStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Final Preview & Test
            </Typography>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                {itemContent.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {itemContent.stem}
              </Typography>

              {itemContent.type === 'choice' && itemContent.choices && (
                <Box sx={{ mb: 3 }}>
                  {itemContent.choices.map((choice, index) => (
                    <Box key={choice.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <input type="radio" name="test" style={{ marginRight: 8 }} />
                      <Typography>{String.fromCharCode(65 + index)}. {choice.text}</Typography>
                    </Box>
                  ))}
                </Box>
              )}

              <Alert severity="info" sx={{ mb: 2 }}>
                This is how your item will appear to test-takers. Test the functionality to ensure it works as expected.
              </Alert>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => setCurrentStep(1)}
                >
                  Back to Editor
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  disabled={loading}
                >
                  Save & Close
                </Button>
              </Box>
            </Paper>
          </Box>
        )}

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
            <Button onClick={handleCancelConfirm} color="error" variant="contained">
              Discard Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ItemEditor;