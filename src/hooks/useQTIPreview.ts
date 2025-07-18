import { useState, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { parseQTIXML } from '@/utils/qtiParser';
import { insertItemIntoXML } from '@/utils/qtiTemplates';
import { updateQTIXMLWithCorrectResponse, formatXML, reorderQTIItems } from '@/utils/xmlUpdater';
import { QTIItem, UnsupportedElement } from '@/types/qti';
import { useToast } from '@/hooks/use-toast';
import { posthog } from '@/lib/posthog';

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
}

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
  });
  
  const { toast } = useToast();

  const updateState = useCallback((updates: Partial<QTIPreviewState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const parseXMLContent = useCallback((xmlText: string) => {
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
  }, [updateState, parseXMLContent, toast]);

  const handleXmlChange = useCallback((value: string) => {
    updateState({ xmlContent: value });
    parseXMLContent(value);
  }, [updateState, parseXMLContent]);

  const handleLoadExample = useCallback(async () => {
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
  }, [updateState, parseXMLContent, toast]);

  const handleCreateBlankFile = useCallback(() => {
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
  }, [updateState, parseXMLContent, toast]);

  const handleClearFile = useCallback(() => {
    updateState({
      selectedFile: undefined,
      qtiItems: [],
      errors: [],
      xmlContent: '',
      hasContent: false,
      unsupportedElements: [],
    });
  }, [updateState]);

  const handleAddItem = useCallback((itemXML: string, insertAfterIndex?: number) => {
    try {
      const prevItemCount = state.qtiItems.length;
      const updatedXML = insertItemIntoXML(state.xmlContent, itemXML, insertAfterIndex);
      
      posthog.capture('qti_item_added', {
        item_count: prevItemCount + 1,
        insert_position: insertAfterIndex
      });
      
      updateState({ xmlContent: updatedXML });
      parseXMLContent(updatedXML);
      
      const newItemIndex = insertAfterIndex !== undefined && insertAfterIndex >= 0 
        ? insertAfterIndex + 1 
        : insertAfterIndex === -1 
          ? 0
          : prevItemCount;
      
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
  }, [state.qtiItems.length, state.xmlContent, updateState, parseXMLContent]);

  const handleCorrectResponseChange = useCallback((itemId: string, correctResponse: string | string[] | number) => {
    const updatedXML = updateQTIXMLWithCorrectResponse(state.xmlContent, itemId, correctResponse);
    const formattedXML = formatXML(updatedXML);
    updateState({ xmlContent: formattedXML });
    parseXMLContent(formattedXML);
  }, [state.xmlContent, updateState, parseXMLContent]);

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
        
        const updatedXML = reorderQTIItems(state.xmlContent, oldIndex, newIndex);
        updateState({ xmlContent: updatedXML });
        parseXMLContent(updatedXML);
      }
    }
  }, [state.qtiItems, state.xmlContent, updateState, parseXMLContent]);

  const downloadXML = useCallback(() => {
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
  }, [state.xmlContent, state.qtiItems.length]);

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
    },
  };
}