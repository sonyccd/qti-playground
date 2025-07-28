import React from 'react';
import { Box } from '@mui/material';
import { DragEndEvent } from '@dnd-kit/core';
import { useSensors } from '@dnd-kit/core';
import { QTIItem, UnsupportedElement } from '@/types/qti';
import { LayoutMode } from '@/hooks/useQTIPreview';
import { ContentFormat } from '@/types/contentFormat';
import { XMLEditor } from './XMLEditor';
import { PreviewPanel } from './PreviewPanel';
import { ItemScore } from '@/scoring/types';

interface EditorLayoutProps {
  layoutMode: LayoutMode;
  xmlContent: string;
  errors: string[];
  qtiItems: QTIItem[];
  unsupportedElements: UnsupportedElement[];
  newlyAddedItemId: string | null;
  contentFormat: ContentFormat;
  onXmlChange: (value: string) => void;
  onLayoutModeChange: (mode: LayoutMode) => void;
  onAddItem: (itemXML: string, insertAfterIndex?: number) => void;
  onCorrectResponseChange: (itemId: string, correctResponse: string | string[] | number) => void;
  onDragEnd: (event: DragEndEvent) => void;
  sensors: ReturnType<typeof useSensors>;
  getItemTypeLabel: (type: string) => string;
  getItemTypeColor: (type: string) => string;
  // Scoring props
  onResponseChange?: (itemId: string, responseId: string, value: string | string[] | number | boolean) => void;
  itemScores?: Record<string, ItemScore>;
  totalScore?: {
    score: number;
    maxScore: number;
    percentage: number;
    correctItems: number;
    totalItems: number;
    requiresManualScoring: boolean;
  };
  scoringEnabled?: boolean;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({
  layoutMode,
  xmlContent,
  errors,
  qtiItems,
  unsupportedElements,
  newlyAddedItemId,
  contentFormat,
  onXmlChange,
  onLayoutModeChange,
  onAddItem,
  onCorrectResponseChange,
  onDragEnd,
  sensors,
  getItemTypeLabel,
  getItemTypeColor,
  onResponseChange,
  itemScores,
  totalScore,
  scoringEnabled = false
}) => (
  <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 200px)' }}>
    {(layoutMode === 'editor-only' || layoutMode === 'split') && (
      <XMLEditor
        layoutMode={layoutMode}
        xmlContent={xmlContent}
        onXmlChange={onXmlChange}
        onLayoutModeChange={onLayoutModeChange}
        contentFormat={contentFormat}
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
        onResponseChange={onResponseChange}
        itemScores={itemScores}
        totalScore={totalScore}
        scoringEnabled={scoringEnabled}
      />
    )}
  </Box>
);