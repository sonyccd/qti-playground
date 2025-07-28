import { useState, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { QTIItem, UnsupportedElement } from '@/types/qti';
import { QTIVersion } from '@/types/qtiVersions';
import { QTIParserFactory } from '@/parsers/QTIParserFactory';
import { useToast } from '@/hooks/use-toast';
import { posthog } from '@/lib/posthog';
import { ContentFormat, detectContentFormat } from '@/types/contentFormat';
import { ItemResponse, ItemScore } from '@/scoring/types';
import { ScoringEngine } from '@/scoring/ScoringEngine';

export type LayoutMode = 'split' | 'editor-only' | 'preview-only';

export interface QTIPreviewState {
  selectedFile?: File;
  qtiItems: QTIItem[];
  errors: string[];
  isLoading: boolean;
  xmlContent: string;
  hasContent: boolean;
  layoutMode: LayoutMode;
  unsupportedElements: UnsupportedElement[];
  newlyAddedItemId: string | null;
  selectedVersion: QTIVersion;
  detectedVersion?: QTIVersion;
  selectedFormat: ContentFormat;
  detectedFormat?: ContentFormat;
  isFormatLocked: boolean;
  // Scoring-related state
  itemResponses: Record<string, ItemResponse>;
  itemScores: Record<string, ItemScore>;
  totalScore: {
    score: number;
    maxScore: number;
    percentage: number;
    correctItems: number;
    totalItems: number;
    requiresManualScoring: boolean;
  };
  scoringEnabled: boolean;
}


export function useQTIPreview() {
  const [state, setState] = useState<QTIPreviewState>({
    qtiItems: [],
    errors: [],
    isLoading: false,
    xmlContent: '',
    hasContent: false,
    layoutMode: 'split',
    unsupportedElements: [],
    newlyAddedItemId: null,
    selectedVersion: '3.0',
    selectedFormat: 'xml',
    isFormatLocked: false,
    // Scoring-related state
    itemResponses: {},
    itemScores: {},
    totalScore: {
      score: 0,
      maxScore: 0,
      percentage: 0,
      correctItems: 0,
      totalItems: 0,
      requiresManualScoring: false,
    },
    scoringEnabled: true,
  });
  
  const { toast } = useToast();
  const scoringEngine = ScoringEngine.getInstance();

  const updateState = useCallback((updates: Partial<QTIPreviewState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const parseXMLContent = useCallback((content: string, version?: QTIVersion) => {
    try {
      const parser = version ? QTIParserFactory.getParser(version) : QTIParserFactory.getParserFromXML(content);
      const parseResult = parser.parse(content);
      
      // Detect format and lock it if content exists
      const detectedFormat = detectContentFormat(content);
      
      updateState({
        qtiItems: parseResult.items,
        errors: parseResult.errors,
        unsupportedElements: parseResult.unsupportedElements,
        detectedVersion: parseResult.version,
        detectedFormat,
        isFormatLocked: content.trim().length > 0,
        selectedFormat: detectedFormat,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Parse Error';
      updateState({
        errors: [errorMessage],
        qtiItems: [],
        unsupportedElements: [],
      });
    }
  }, [updateState]);

  const handleFileSelect = useCallback(async (file: File) => {
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
      parseXMLContent(text, state.selectedVersion);
      
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
  }, [updateState, parseXMLContent, toast, state.selectedVersion]);

  const handleXmlChange = useCallback((value: string) => {
    updateState({ xmlContent: value });
    parseXMLContent(value, state.selectedVersion);
  }, [updateState, parseXMLContent, state.selectedVersion]);

  const handleLoadExample = useCallback(async () => {
    updateState({
      isLoading: true,
      errors: [],
      qtiItems: [],
      selectedFile: undefined,
    });
    
    try {
      const fileExtension = state.selectedFormat === 'json' ? 'json' : 'xml';
      const mimeType = state.selectedFormat === 'json' ? 'application/json' : 'text/xml';
      const response = await fetch(`/sample-qti.${fileExtension}`);
      
      if (!response.ok) {
        throw new Error('Failed to load example file');
      }
      const content = await response.text();
      
      const mockFile = new File([content], `sample-qti.${fileExtension}`, { type: mimeType });
      updateState({
        xmlContent: content,
        hasContent: true,
        selectedFile: mockFile,
        selectedFormat: state.selectedFormat,
        isFormatLocked: true,
      });
      parseXMLContent(content, state.selectedVersion);
      
      posthog.capture('qti_example_loaded', {
        format: state.selectedFormat,
        version: state.selectedVersion
      });
      
      toast({
        title: "Example QTI file loaded",
        description: `Content loaded in editor (${state.selectedFormat.toUpperCase()} format)`
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
  }, [updateState, parseXMLContent, toast, state.selectedFormat, state.selectedVersion]);

  const handleCreateBlankFile = useCallback((format?: ContentFormat) => {
    const parser = QTIParserFactory.getParser(state.selectedVersion);
    const useFormat = format || state.selectedFormat;
    
    let template: string;
    if (state.selectedVersion === '3.0' && parser.getBlankTemplate) {
      template = parser.getBlankTemplate(useFormat);
    } else {
      template = parser.getBlankTemplate();
    }
    
    updateState({
      xmlContent: template,
      hasContent: true,
      selectedFile: undefined,
      selectedFormat: useFormat,
      isFormatLocked: true,
    });
    parseXMLContent(template, state.selectedVersion);
    
    posthog.capture('qti_blank_file_created', {
      version: state.selectedVersion,
      format: useFormat
    });
    
    toast({
      title: "Blank QTI file created",
      description: `A new blank QTI ${state.selectedVersion} ${useFormat.toUpperCase()} template is ready for editing`
    });
  }, [updateState, parseXMLContent, toast, state.selectedVersion, state.selectedFormat]);

  const handleFormatChange = useCallback((format: ContentFormat) => {
    if (state.isFormatLocked) {
      toast({
        title: "Format locked",
        description: "Format cannot be changed once content is created. Create a new file to use a different format.",
        variant: "destructive"
      });
      return;
    }
    
    updateState({
      selectedFormat: format
    });
  }, [updateState, state.isFormatLocked, toast]);

  const handleClearFile = useCallback(() => {
    updateState({
      selectedFile: undefined,
      qtiItems: [],
      errors: [],
      xmlContent: '',
      hasContent: false,
      unsupportedElements: [],
      isFormatLocked: false,
      selectedFormat: 'xml'
    });
  }, [updateState]);

  const handleAddItem = useCallback((itemXML: string, insertAfterIndex?: number) => {
    try {
      const parser = QTIParserFactory.getParser(state.selectedVersion);
      const prevItemCount = state.qtiItems.length;
      const updatedXML = parser.insertItem(state.xmlContent, itemXML, insertAfterIndex);
      
      posthog.capture('qti_item_added', {
        item_count: prevItemCount + 1,
        insert_position: insertAfterIndex,
        version: state.selectedVersion
      });
      
      updateState({ xmlContent: updatedXML });
      parseXMLContent(updatedXML, state.selectedVersion);
      
      const newItemIndex = insertAfterIndex !== undefined && insertAfterIndex >= 0 
        ? insertAfterIndex + 1 
        : insertAfterIndex === -1 
          ? 0
          : prevItemCount;
      
      setTimeout(() => {
        const parseResult = parser.parse(updatedXML);
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
  }, [state.qtiItems.length, state.xmlContent, state.selectedVersion, updateState, parseXMLContent]);

  const handleCorrectResponseChange = useCallback((itemId: string, correctResponse: string | string[] | number) => {
    const parser = QTIParserFactory.getParser(state.selectedVersion);
    const updatedXML = parser.updateCorrectResponse(state.xmlContent, itemId, correctResponse);
    const formattedXML = parser.formatXML(updatedXML);
    updateState({ xmlContent: formattedXML });
    parseXMLContent(formattedXML, state.selectedVersion);
  }, [state.xmlContent, state.selectedVersion, updateState, parseXMLContent]);

  const handleDragEnd = useCallback((event: { active: { id: string }; over: { id: string } | null }) => {
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
        
        const parser = QTIParserFactory.getParser(state.selectedVersion);
        const updatedXML = parser.reorderItems(state.xmlContent, oldIndex, newIndex);
        updateState({ xmlContent: updatedXML });
        parseXMLContent(updatedXML, state.selectedVersion);
      }
    }
  }, [state.qtiItems, state.xmlContent, state.selectedVersion, updateState, parseXMLContent]);

  const downloadXML = useCallback(() => {
    posthog.capture('qti_xml_downloaded', {
      file_size: state.xmlContent.length,
      item_count: state.qtiItems.length,
      version: state.selectedVersion
    });
    
    const blob = new Blob([state.xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qti-${state.selectedVersion}-item.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [state.xmlContent, state.qtiItems.length, state.selectedVersion]);

  const handleVersionChange = useCallback((version: QTIVersion) => {
    updateState({ selectedVersion: version });
    
    // Re-parse current content with new version if content exists
    if (state.xmlContent) {
      parseXMLContent(state.xmlContent, version);
    }
  }, [state.xmlContent, updateState, parseXMLContent]);

  // Scoring-related functions
  const handleItemResponse = useCallback((itemId: string, responseId: string, value: string | string[] | number | boolean) => {
    console.log('handleItemResponse called:', { itemId, responseId, value });
    
    const response: ItemResponse = {
      itemId,
      responseId,
      value,
      timestamp: Date.now(),
    };

    setState(currentState => {
      console.log('setState callback executing for:', itemId);
      console.log('Current scores before update:', currentState.itemScores);
      
      const updatedResponses = {
        ...currentState.itemResponses,
        [itemId]: response,
      };

      // Calculate score for this item
      const item = currentState.qtiItems.find(item => item.id === itemId || item.identifier === itemId);
      console.log('Found item:', item ? `${item.title} (${item.id || item.identifier})` : 'NOT FOUND');
      
      if (item && currentState.scoringEnabled) {
        const itemScore = scoringEngine.calculateItemScore(item, response);
        console.log('Calculated score:', itemScore);
        
        const updatedScores = {
          ...currentState.itemScores,
          [itemId]: itemScore,
        };

        // Calculate total score
        const totalScore = scoringEngine.calculateTotalScore(Object.values(updatedScores));
        console.log('Updated scores:', updatedScores);
        console.log('Total score:', totalScore);

        return {
          ...currentState,
          itemResponses: updatedResponses,
          itemScores: updatedScores,
          totalScore: {
            score: totalScore.totalScore,
            maxScore: totalScore.maxTotalScore,
            percentage: totalScore.percentageScore,
            correctItems: totalScore.correctItems,
            totalItems: totalScore.totalItems,
            requiresManualScoring: totalScore.requiresManualScoring,
          },
        };
      } else {
        console.log('Scoring not enabled or item not found');
        return {
          ...currentState,
          itemResponses: updatedResponses,
        };
      }
    });
  }, [scoringEngine]);

  const handleManualScore = useCallback((itemId: string, score: number, feedback?: string) => {
    setState(currentState => {
      const existingScore = currentState.itemScores[itemId];
      if (!existingScore) return currentState;

      const updatedScore: ItemScore = {
        ...existingScore,
        score,
        feedback,
        requiresManualScoring: false,
        isCorrect: score === existingScore.maxScore,
        partialCredit: score > 0 && score < existingScore.maxScore,
      };

      const updatedScores = {
        ...currentState.itemScores,
        [itemId]: updatedScore,
      };

      // Recalculate total score
      const totalScore = scoringEngine.calculateTotalScore(Object.values(updatedScores));

      return {
        ...currentState,
        itemScores: updatedScores,
        totalScore: {
          score: totalScore.totalScore,
          maxScore: totalScore.maxTotalScore,
          percentage: totalScore.percentageScore,
          correctItems: totalScore.correctItems,
          totalItems: totalScore.totalItems,
          requiresManualScoring: totalScore.requiresManualScoring,
        },
      };
    });
  }, [scoringEngine]);

  const toggleScoring = useCallback((enabled: boolean) => {
    setState(currentState => {
      if (enabled) {
        // Recalculate all scores
        const updatedScores: Record<string, ItemScore> = {};
        Object.entries(currentState.itemResponses || {}).forEach(([itemId, response]) => {
          const item = currentState.qtiItems.find(item => item.id === itemId || item.identifier === itemId);
          if (item) {
            updatedScores[itemId] = scoringEngine.calculateItemScore(item, response);
          }
        });

        const totalScore = scoringEngine.calculateTotalScore(Object.values(updatedScores));
        return {
          ...currentState,
          scoringEnabled: enabled,
          itemScores: updatedScores,
          totalScore: {
            score: totalScore.totalScore,
            maxScore: totalScore.maxTotalScore,
            percentage: totalScore.percentageScore,
            correctItems: totalScore.correctItems,
            totalItems: totalScore.totalItems,
            requiresManualScoring: totalScore.requiresManualScoring,
          },
        };
      } else {
        return {
          ...currentState,
          scoringEnabled: enabled,
        };
      }
    });
  }, [scoringEngine]);

  const resetScoring = useCallback(() => {
    updateState({
      itemResponses: {},
      itemScores: {},
      totalScore: {
        score: 0,
        maxScore: 0,
        percentage: 0,
        correctItems: 0,
        totalItems: 0,
        requiresManualScoring: false,
      },
    });
  }, [updateState]);

  return {
    state,
    actions: {
      updateState,
      handleFileSelect,
      handleXmlChange,
      handleLoadExample,
      handleCreateBlankFile,
      handleClearFile,
      handleAddItem,
      handleCorrectResponseChange,
      handleDragEnd,
      downloadXML,
      handleVersionChange,
      handleFormatChange,
      // Scoring functions
      handleItemResponse,
      handleManualScore,
      toggleScoring,
      resetScoring,
    },
  };
}