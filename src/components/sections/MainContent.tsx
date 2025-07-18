import React from 'react';
import { Box } from '@mui/material';
import { DragEndEvent } from '@dnd-kit/core';
import { useSensors } from '@dnd-kit/core';
import { QTIPreviewState, LayoutMode } from '@/hooks/useQTIPreview';
import { EditorLayout } from './EditorLayout';
import { AssessmentDetailsAccordion } from './AssessmentDetailsAccordion';
import { QTIVersion } from '@/types/qtiVersions';
import { ContentFormat } from '@/types/contentFormat';

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
  onResponseChange: (itemId: string, responseId: string, value: any) => void;
  onVersionChange: (version: QTIVersion) => void;
  onFormatChange: (format: ContentFormat) => void;
}

export const MainContent: React.FC<MainContentProps> = ({
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
  getItemTypeColor,
  onResponseChange,
  onVersionChange,
  onFormatChange
}) => (
  <Box sx={{ mb: 4 }}>
    {/* Assessment Details Accordion - Global View */}
    <AssessmentDetailsAccordion
      qtiItems={state.qtiItems}
      unsupportedElements={state.unsupportedElements}
      getItemTypeLabel={getItemTypeLabel}
      getItemTypeColor={getItemTypeColor}
      itemScores={state.itemScores}
      totalScore={state.totalScore}
      scoringEnabled={state.scoringEnabled}
      selectedFile={state.selectedFile}
      selectedVersion={state.selectedVersion}
      selectedFormat={state.selectedFormat}
      xmlContent={state.xmlContent}
      isLoading={state.isLoading}
      isFormatLocked={state.isFormatLocked}
      hasContent={state.hasContent}
      onVersionChange={onVersionChange}
      onFormatChange={onFormatChange}
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
      contentFormat={state.selectedFormat}
      onXmlChange={onXmlChange}
      onLayoutModeChange={onLayoutModeChange}
      onAddItem={onAddItem}
      onCorrectResponseChange={onCorrectResponseChange}
      onDragEnd={onDragEnd}
      sensors={sensors}
      getItemTypeLabel={getItemTypeLabel}
      getItemTypeColor={getItemTypeColor}
      // Scoring props
      onResponseChange={onResponseChange}
      itemScores={state.itemScores}
      totalScore={state.totalScore}
      scoringEnabled={state.scoringEnabled}
    />
  </Box>
);