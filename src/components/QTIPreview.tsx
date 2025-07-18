import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Container, Button, Chip, Alert, AlertTitle, useTheme, CircularProgress } from '@mui/material';
import { Description, CheckCircle, Download, Code, Visibility, OpenInFull, Add } from '@mui/icons-material';
import CodeMirror from '@uiw/react-codemirror';
import { xml } from '@codemirror/lang-xml';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { FileUpload } from './FileUpload';
import { SortableQTIItem } from './qti/SortableQTIItem';
import { AddItemButton } from './qti/AddItemButton';
import { parseQTIXML } from '@/utils/qtiParser';
import { insertItemIntoXML } from '@/utils/qtiTemplates';
import { updateQTIXMLWithCorrectResponse, formatXML, reorderQTIItems } from '@/utils/xmlUpdater';
import { QTIItem, UnsupportedElement } from '@/types/qti';
import { useToast } from '@/hooks/use-toast';
import { posthog } from '@/lib/posthog';

// Types
type LayoutMode = 'split' | 'editor-only' | 'preview-only';

interface QTIPreviewState {
  selectedFile?: File;
  qtiItems: QTIItem[];
  errors: string[];
  isLoading: boolean;
  xmlContent: string;
  hasContent: boolean;
  layoutMode: LayoutMode;
  unsupportedElements: UnsupportedElement[];
  newlyAddedItemId: string | null;
}

// Constants
const BLANK_QTI_TEMPLATE = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1" 
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v2p1 http://www.imsglobal.org/xsd/qti/qtiv2p1/imsqti_v2p1.xsd"
                identifier="sample-item" 
                title="New QTI Item" 
                adaptive="false" 
                timeDependent="false">
  
  <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier">
    <correctResponse>
      <value>ChoiceA</value>
    </correctResponse>
  </responseDeclaration>
  
  <outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float">
    <defaultValue>
      <value>0</value>
    </defaultValue>
  </outcomeDeclaration>
  
  <itemBody>
    <div>
      <p>Enter your question text here.</p>
      <choiceInteraction responseIdentifier="RESPONSE" shuffle="false" maxChoices="1">
        <prompt>Select the correct answer:</prompt>
        <simpleChoice identifier="ChoiceA">Option A</simpleChoice>
        <simpleChoice identifier="ChoiceB">Option B</simpleChoice>
        <simpleChoice identifier="ChoiceC">Option C</simpleChoice>
        <simpleChoice identifier="ChoiceD">Option D</simpleChoice>
      </choiceInteraction>
    </div>
  </itemBody>
  
  <responseProcessing template="http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct"/>
  
</assessmentItem>`;

const ITEM_TYPE_LABELS: Record<string, string> = {
  choice: 'Multiple Choice',
  multipleResponse: 'Multiple Response',
  textEntry: 'Fill in the Blank',
  extendedText: 'Extended Text',
  hottext: 'Hottext Selection',
  slider: 'Slider',
  order: 'Order Interaction',
};

const ITEM_TYPE_COLORS: Record<string, string> = {
  choice: 'primary',
  multipleResponse: 'secondary',
  textEntry: 'success',
  extendedText: 'info',
  hottext: 'warning',
  slider: 'default',
  order: 'destructive',
};

export function QTIPreview() {
  const [state, setState] = useState<QTIPreviewState>({
    qtiItems: [],
    errors: [],
    isLoading: false,
    xmlContent: '',
    hasContent: false,
    layoutMode: 'split',
    unsupportedElements: [],
    newlyAddedItemId: null,
  });
  
  const { toast } = useToast();
  const theme = useTheme();
  // Helper functions
  const updateState = (updates: Partial<QTIPreviewState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const parseXMLContent = (xmlText: string) => {
    try {
      const parseResult = parseQTIXML(xmlText);
      updateState({
        qtiItems: parseResult.items,
        errors: parseResult.errors,
        unsupportedElements: parseResult.unsupportedElements,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'XML Parse Error';
      updateState({
        errors: [errorMessage],
        qtiItems: [],
        unsupportedElements: [],
      });
    }
  };

  const handleFileSelect = async (file: File) => {
    updateState({
      selectedFile: file,
      isLoading: true,
      errors: [],
      qtiItems: [],
    });
    
    try {
      const text = await file.text();
      updateState({
        xmlContent: text,
        hasContent: true,
      });
      parseXMLContent(text);
      
      posthog.capture('qti_file_uploaded', {
        file_name: file.name,
        file_size: file.size,
        file_type: file.type
      });
      
      toast({
        title: "QTI file loaded",
        description: "File content loaded in editor"
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateState({ errors: [`Failed to read file: ${errorMessage}`] });
      toast({
        title: "Error",
        description: "Failed to process the QTI file",
        variant: "destructive"
      });
    } finally {
      updateState({ isLoading: false });
    }
  };
  const handleXmlChange = (value: string) => {
    updateState({ xmlContent: value });
    parseXMLContent(value);
  };
  const handleLoadExample = async () => {
    updateState({
      isLoading: true,
      errors: [],
      qtiItems: [],
      selectedFile: undefined,
    });
    
    try {
      const response = await fetch('/sample-qti.xml');
      if (!response.ok) {
        throw new Error('Failed to load example file');
      }
      const xmlText = await response.text();
      
      const mockFile = new File([xmlText], 'sample-qti.xml', { type: 'text/xml' });
      updateState({
        xmlContent: xmlText,
        hasContent: true,
        selectedFile: mockFile,
      });
      parseXMLContent(xmlText);
      
      posthog.capture('qti_example_loaded');
      
      toast({
        title: "Example QTI file loaded",
        description: "Content loaded in editor"
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateState({ errors: [`Failed to load example file: ${errorMessage}`] });
      toast({
        title: "Error",
        description: "Failed to load the example QTI file",
        variant: "destructive"
      });
    } finally {
      updateState({ isLoading: false });
    }
  };

  const handleCreateBlankFile = () => {
    updateState({
      xmlContent: BLANK_QTI_TEMPLATE,
      hasContent: true,
      selectedFile: undefined,
    });
    parseXMLContent(BLANK_QTI_TEMPLATE);
    
    posthog.capture('qti_blank_file_created');
    
    toast({
      title: "Blank QTI file created",
      description: "A new blank QTI template is ready for editing"
    });
  };
  const handleClearFile = () => {
    updateState({
      selectedFile: undefined,
      qtiItems: [],
      errors: [],
      xmlContent: '',
      hasContent: false,
      unsupportedElements: [],
    });
  };

  const handleAddItem = (itemXML: string, insertAfterIndex?: number) => {
    try {
      const prevItemCount = state.qtiItems.length;
      const updatedXML = insertItemIntoXML(state.xmlContent, itemXML, insertAfterIndex);
      
      posthog.capture('qti_item_added', {
        item_count: prevItemCount + 1,
        insert_position: insertAfterIndex
      });
      
      updateState({ xmlContent: updatedXML });
      parseXMLContent(updatedXML);
      
      // Calculate new item index for animation
      const newItemIndex = insertAfterIndex !== undefined && insertAfterIndex >= 0 
        ? insertAfterIndex + 1 
        : insertAfterIndex === -1 
          ? 0
          : prevItemCount;
      
      // Trigger animation
      setTimeout(() => {
        const parseResult = parseQTIXML(updatedXML);
        if (parseResult.items[newItemIndex]) {
          updateState({ newlyAddedItemId: parseResult.items[newItemIndex].id });
          
          setTimeout(() => {
            updateState({ newlyAddedItemId: null });
          }, 600);
        }
      }, 100);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleCorrectResponseChange = (itemId: string, correctResponse: string | string[] | number) => {
    const updatedXML = updateQTIXMLWithCorrectResponse(state.xmlContent, itemId, correctResponse);
    const formattedXML = formatXML(updatedXML);
    updateState({ xmlContent: formattedXML });
    parseXMLContent(formattedXML);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = state.qtiItems.findIndex((item) => item.id === active.id);
      const newIndex = state.qtiItems.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        posthog.capture('qti_item_reordered', {
          from_position: oldIndex,
          to_position: newIndex,
          total_items: state.qtiItems.length
        });
        
        const updatedXML = reorderQTIItems(state.xmlContent, oldIndex, newIndex);
        const newItems = arrayMove(state.qtiItems, oldIndex, newIndex);
        
        updateState({
          xmlContent: updatedXML,
          qtiItems: newItems,
        });
      }
    }
  };

  // Utility functions
  const getItemTypeLabel = (type: string) => ITEM_TYPE_LABELS[type] || 'Unknown';
  const getItemTypeColor = (type: string) => ITEM_TYPE_COLORS[type] || 'error';
  
  const downloadXML = () => {
    posthog.capture('qti_xml_downloaded', {
      file_size: state.xmlContent.length,
      item_count: state.qtiItems.length
    });
    
    const blob = new Blob([state.xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qti-item.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <Box sx={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[50]} 100%)`,
      py: 3,
      px: 2
    }}>
      <Container maxWidth="xl">
        {!state.hasContent && (
          <FileUploadSection 
            onFileSelect={handleFileSelect}
            onClear={handleClearFile}
            onLoadExample={handleLoadExample}
            onCreateBlank={handleCreateBlankFile}
            selectedFile={state.selectedFile}
            isLoading={state.isLoading}
          />
        )}

        {state.isLoading && <LoadingCard />}

        {state.hasContent && !state.isLoading && (
          <MainContent
            state={state}
            onXmlChange={handleXmlChange}
            onLayoutModeChange={(mode) => updateState({ layoutMode: mode })}
            onDownloadXml={downloadXML}
            onClearFile={handleClearFile}
            onAddItem={handleAddItem}
            onCorrectResponseChange={handleCorrectResponseChange}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            getItemTypeLabel={getItemTypeLabel}
            getItemTypeColor={getItemTypeColor}
          />
        )}
      </Container>
    </Box>
  );
}

// Sub-components
interface FileUploadSectionProps {
  onFileSelect: (file: File) => void;
  onClear: () => void;
  onLoadExample: () => void;
  onCreateBlank: () => void;
  selectedFile?: File;
  isLoading: boolean;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  onFileSelect,
  onClear,
  onLoadExample,
  onCreateBlank,
  selectedFile,
  isLoading
}) => (
  <Box sx={{ mb: 4 }}>
    <FileUpload onFileSelect={onFileSelect} onClear={onClear} selectedFile={selectedFile} />
    
    <Box textAlign="center" sx={{
      mt: 2,
      display: 'flex',
      gap: 2,
      justifyContent: 'center'
    }}>
      <Button variant="outlined" onClick={onLoadExample} startIcon={<Download />} disabled={isLoading}>
        Try Example QTI File
      </Button>
      <Button variant="outlined" onClick={onCreateBlank} startIcon={<Add />} disabled={isLoading}>
        Create Blank File
      </Button>
    </Box>
  </Box>
);

const LoadingCard: React.FC = () => (
  <Card sx={{ mb: 4 }}>
    <CardContent sx={{ textAlign: 'center', py: 8 }}>
      <CircularProgress size={40} sx={{ mb: 2 }} />
      <Typography color="text.secondary">Processing QTI file...</Typography>
    </CardContent>
  </Card>
);

interface MainContentProps {
  state: QTIPreviewState;
  onXmlChange: (value: string) => void;
  onLayoutModeChange: (mode: LayoutMode) => void;
  onDownloadXml: () => void;
  onClearFile: () => void;
  onAddItem: (itemXML: string, insertAfterIndex?: number) => void;
  onCorrectResponseChange: (itemId: string, correctResponse: string | string[] | number) => void;
  onDragEnd: (event: DragEndEvent) => void;
  sensors: ReturnType<typeof useSensors>;
  getItemTypeLabel: (type: string) => string;
  getItemTypeColor: (type: string) => string;
}

const MainContent: React.FC<MainContentProps> = ({
  state,
  onXmlChange,
  onLayoutModeChange,
  onDownloadXml,
  onClearFile,
  onAddItem,
  onCorrectResponseChange,
  onDragEnd,
  sensors,
  getItemTypeLabel,
  getItemTypeColor
}) => (
  <Box sx={{ mb: 4 }}>
    <ControlBar
      selectedFile={state.selectedFile}
      qtiItems={state.qtiItems}
      xmlContent={state.xmlContent}
      onDownloadXml={onDownloadXml}
      onClearFile={onClearFile}
    />

    <EditorLayout
      layoutMode={state.layoutMode}
      xmlContent={state.xmlContent}
      errors={state.errors}
      qtiItems={state.qtiItems}
      unsupportedElements={state.unsupportedElements}
      newlyAddedItemId={state.newlyAddedItemId}
      onXmlChange={onXmlChange}
      onLayoutModeChange={onLayoutModeChange}
      onAddItem={onAddItem}
      onCorrectResponseChange={onCorrectResponseChange}
      onDragEnd={onDragEnd}
      sensors={sensors}
      getItemTypeLabel={getItemTypeLabel}
      getItemTypeColor={getItemTypeColor}
    />
  </Box>
);

interface ControlBarProps {
  selectedFile?: File;
  qtiItems: QTIItem[];
  xmlContent: string;
  onDownloadXml: () => void;
  onClearFile: () => void;
}

const ControlBar: React.FC<ControlBarProps> = ({
  selectedFile,
  qtiItems,
  xmlContent,
  onDownloadXml,
  onClearFile
}) => (
  <Box sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 2
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Chip label={selectedFile?.name || 'sample-qti.xml'} variant="outlined" size="small" />
      {qtiItems.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircle color="success" fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {qtiItems.length} item{qtiItems.length !== 1 ? 's' : ''} parsed
          </Typography>
        </Box>
      )}
    </Box>
    
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Button 
        variant="outlined" 
        size="small" 
        onClick={onDownloadXml}
        startIcon={<Download />}
        disabled={!xmlContent.trim()}
      >
        Download XML
      </Button>
      <Button variant="outlined" size="small" onClick={onClearFile} startIcon={<Description />}>
        New File
      </Button>
    </Box>
  </Box>
);

interface EditorLayoutProps {
  layoutMode: LayoutMode;
  xmlContent: string;
  errors: string[];
  qtiItems: QTIItem[];
  unsupportedElements: UnsupportedElement[];
  newlyAddedItemId: string | null;
  onXmlChange: (value: string) => void;
  onLayoutModeChange: (mode: LayoutMode) => void;
  onAddItem: (itemXML: string, insertAfterIndex?: number) => void;
  onCorrectResponseChange: (itemId: string, correctResponse: string | string[] | number) => void;
  onDragEnd: (event: DragEndEvent) => void;
  sensors: ReturnType<typeof useSensors>;
  getItemTypeLabel: (type: string) => string;
  getItemTypeColor: (type: string) => string;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({
  layoutMode,
  xmlContent,
  errors,
  qtiItems,
  unsupportedElements,
  newlyAddedItemId,
  onXmlChange,
  onLayoutModeChange,
  onAddItem,
  onCorrectResponseChange,
  onDragEnd,
  sensors,
  getItemTypeLabel,
  getItemTypeColor
}) => (
  <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 200px)' }}>
    {(layoutMode === 'editor-only' || layoutMode === 'split') && (
      <XMLEditor
        layoutMode={layoutMode}
        xmlContent={xmlContent}
        onXmlChange={onXmlChange}
        onLayoutModeChange={onLayoutModeChange}
      />
    )}

    {(layoutMode === 'preview-only' || layoutMode === 'split') && (
      <PreviewPanel
        layoutMode={layoutMode}
        errors={errors}
        qtiItems={qtiItems}
        unsupportedElements={unsupportedElements}
        newlyAddedItemId={newlyAddedItemId}
        onLayoutModeChange={onLayoutModeChange}
        onAddItem={onAddItem}
        onCorrectResponseChange={onCorrectResponseChange}
        onDragEnd={onDragEnd}
        sensors={sensors}
        getItemTypeLabel={getItemTypeLabel}
        getItemTypeColor={getItemTypeColor}
      />
    )}
  </Box>
);

interface XMLEditorProps {
  layoutMode: LayoutMode;
  xmlContent: string;
  onXmlChange: (value: string) => void;
  onLayoutModeChange: (mode: LayoutMode) => void;
}

const XMLEditor: React.FC<XMLEditorProps> = ({
  layoutMode,
  xmlContent,
  onXmlChange,
  onLayoutModeChange
}) => (
  <Box sx={{ flex: 1, minWidth: 0 }}>
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Code fontSize="small" />
            <Typography variant="h6" component="h3">
              QTI XML Editor
            </Typography>
          </Box>
          <Button 
            size="small" 
            variant={layoutMode === 'editor-only' ? 'contained' : 'outlined'}
            onClick={() => onLayoutModeChange(layoutMode === 'editor-only' ? 'split' : 'editor-only')}
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <OpenInFull fontSize="small" />
          </Button>
        </Box>
      </CardContent>
      <Box sx={{ flex: 1, overflow: 'auto', height: 0 }}>
        <CodeMirror 
          value={xmlContent} 
          onChange={onXmlChange} 
          extensions={[xml(), EditorView.lineWrapping]} 
          theme={oneDark} 
          style={{ height: '100%' }} 
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: true,
            autocompletion: true
          }}
        />
      </Box>
    </Card>
  </Box>
);

interface PreviewPanelProps {
  layoutMode: LayoutMode;
  errors: string[];
  qtiItems: QTIItem[];
  unsupportedElements: UnsupportedElement[];
  newlyAddedItemId: string | null;
  onLayoutModeChange: (mode: LayoutMode) => void;
  onAddItem: (itemXML: string, insertAfterIndex?: number) => void;
  onCorrectResponseChange: (itemId: string, correctResponse: string | string[] | number) => void;
  onDragEnd: (event: DragEndEvent) => void;
  sensors: ReturnType<typeof useSensors>;
  getItemTypeLabel: (type: string) => string;
  getItemTypeColor: (type: string) => string;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  layoutMode,
  errors,
  qtiItems,
  unsupportedElements,
  newlyAddedItemId,
  onLayoutModeChange,
  onAddItem,
  onCorrectResponseChange,
  onDragEnd,
  sensors,
  getItemTypeLabel,
  getItemTypeColor
}) => (
  <Box sx={{ flex: 1, minWidth: 0 }}>
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Visibility fontSize="small" />
            <Typography variant="h6" component="h3">
              Live Preview
            </Typography>
          </Box>
          <Button 
            size="small" 
            variant={layoutMode === 'preview-only' ? 'contained' : 'outlined'}
            onClick={() => onLayoutModeChange(layoutMode === 'preview-only' ? 'split' : 'preview-only')}
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <OpenInFull fontSize="small" />
          </Button>
        </Box>
      </CardContent>
      <CardContent sx={{ flex: 1, overflow: 'auto', pt: 0 }}>
        <PreviewContent
          errors={errors}
          qtiItems={qtiItems}
          unsupportedElements={unsupportedElements}
          newlyAddedItemId={newlyAddedItemId}
          onAddItem={onAddItem}
          onCorrectResponseChange={onCorrectResponseChange}
          onDragEnd={onDragEnd}
          sensors={sensors}
          getItemTypeLabel={getItemTypeLabel}
          getItemTypeColor={getItemTypeColor}
        />
      </CardContent>
    </Card>
  </Box>
);

interface PreviewContentProps {
  errors: string[];
  qtiItems: QTIItem[];
  unsupportedElements: UnsupportedElement[];
  newlyAddedItemId: string | null;
  onAddItem: (itemXML: string, insertAfterIndex?: number) => void;
  onCorrectResponseChange: (itemId: string, correctResponse: string | string[] | number) => void;
  onDragEnd: (event: DragEndEvent) => void;
  sensors: ReturnType<typeof useSensors>;
  getItemTypeLabel: (type: string) => string;
  getItemTypeColor: (type: string) => string;
}

const PreviewContent: React.FC<PreviewContentProps> = ({
  errors,
  qtiItems,
  unsupportedElements,
  newlyAddedItemId,
  onAddItem,
  onCorrectResponseChange,
  onDragEnd,
  sensors,
  getItemTypeLabel,
  getItemTypeColor
}) => (
  <>
    {errors.length > 0 && (
      <Alert severity="error" sx={{ mb: 2 }}>
        <AlertTitle>Parsing Errors</AlertTitle>
        {errors.map((error, index) => (
          <Typography key={index} variant="body2">
            {error}
          </Typography>
        ))}
      </Alert>
    )}

    {qtiItems.length > 0 && (
      <ItemTypeSummary qtiItems={qtiItems} getItemTypeLabel={getItemTypeLabel} getItemTypeColor={getItemTypeColor} />
    )}

    {unsupportedElements.length > 0 && (
      <UnsupportedElementsAlert unsupportedElements={unsupportedElements} />
    )}

    {qtiItems.length > 0 ? (
      <ItemsList
        qtiItems={qtiItems}
        newlyAddedItemId={newlyAddedItemId}
        onAddItem={onAddItem}
        onCorrectResponseChange={onCorrectResponseChange}
        onDragEnd={onDragEnd}
        sensors={sensors}
        getItemTypeLabel={getItemTypeLabel}
        getItemTypeColor={getItemTypeColor}
      />
    ) : !errors.length ? (
      <EmptyState onAddItem={onAddItem} />
    ) : null}
  </>
);

interface ItemTypeSummaryProps {
  qtiItems: QTIItem[];
  getItemTypeLabel: (type: string) => string;
  getItemTypeColor: (type: string) => string;
}

const ItemTypeSummary: React.FC<ItemTypeSummaryProps> = ({ qtiItems, getItemTypeLabel, getItemTypeColor }) => (
  <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
    <Typography variant="subtitle2" gutterBottom>
      Parsed Items
    </Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {Array.from(new Set(qtiItems.map(item => item.type))).map(type => {
        const count = qtiItems.filter(item => item.type === type).length;
        return (
          <Chip 
            key={type} 
            label={`${count} ${getItemTypeLabel(type)}`} 
            color={getItemTypeColor(type) as any} 
            size="small" 
          />
        );
      })}
    </Box>
  </Box>
);

interface UnsupportedElementsAlertProps {
  unsupportedElements: UnsupportedElement[];
}

const UnsupportedElementsAlert: React.FC<UnsupportedElementsAlertProps> = ({ unsupportedElements }) => (
  <Alert severity="warning" sx={{ mb: 3 }}>
    <AlertTitle>Unsupported Elements Found</AlertTitle>
    <Box sx={{ mt: 1 }}>
      {unsupportedElements.map((element, index) => (
        <Box key={index} sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="body2">
            {element.description}
          </Typography>
          <Chip label={element.count} size="small" variant="outlined" />
        </Box>
      ))}
    </Box>
    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
      These elements were found but are not currently supported by the previewer.
    </Typography>
  </Alert>
);

interface ItemsListProps {
  qtiItems: QTIItem[];
  newlyAddedItemId: string | null;
  onAddItem: (itemXML: string, insertAfterIndex?: number) => void;
  onCorrectResponseChange: (itemId: string, correctResponse: string | string[] | number) => void;
  onDragEnd: (event: DragEndEvent) => void;
  sensors: ReturnType<typeof useSensors>;
  getItemTypeLabel: (type: string) => string;
  getItemTypeColor: (type: string) => string;
}

const ItemsList: React.FC<ItemsListProps> = ({
  qtiItems,
  newlyAddedItemId,
  onAddItem,
  onCorrectResponseChange,
  onDragEnd,
  sensors,
  getItemTypeLabel,
  getItemTypeColor
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    <AddItemButton onAddItem={(itemXML) => onAddItem(itemXML, -1)} />
    
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext 
        items={qtiItems.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        {qtiItems.map((item, index) => (
          <Box key={item.id} sx={{ mb: 2 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 2
            }}>
              <Chip label={`#${index + 1}`} variant="outlined" size="small" />
              <Chip 
                label={getItemTypeLabel(item.type)} 
                color={getItemTypeColor(item.type) as any} 
                size="small" 
              />
            </Box>
            <SortableQTIItem 
              item={item} 
              isNewlyAdded={item.id === newlyAddedItemId}
              onCorrectResponseChange={onCorrectResponseChange}
            />
            
            <AddItemButton onAddItem={(itemXML) => onAddItem(itemXML, index)} />
          </Box>
        ))}
      </SortableContext>
    </DndContext>
  </Box>
);

interface EmptyStateProps {
  onAddItem: (itemXML: string, insertAfterIndex?: number) => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddItem }) => (
  <Box sx={{ textAlign: 'center', py: 6 }}>
    <Description sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
    <Typography variant="h6" color="text.secondary">
      No valid QTI items found
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
      Check your XML structure or add a new item below
    </Typography>
    <AddItemButton onAddItem={(itemXML) => onAddItem(itemXML)} />
  </Box>
);