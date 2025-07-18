import React from 'react';
import { Box } from '@mui/material';
import { DragEndEvent } from '@dnd-kit/core';
import { useSensors } from '@dnd-kit/core';
import { QTIPreviewState, LayoutMode } from '@/hooks/useQTIPreview';
import { ControlBar } from './ControlBar';
import { EditorLayout } from './EditorLayout';

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
  onResponseChange
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