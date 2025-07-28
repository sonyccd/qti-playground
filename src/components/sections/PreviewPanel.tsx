import React from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { Visibility, OpenInFull } from '@mui/icons-material';
import { DragEndEvent } from '@dnd-kit/core';
import { useSensors } from '@dnd-kit/core';
import { QTIItem, UnsupportedElement } from '@/types/qti';
import { LayoutMode } from '@/hooks/useQTIPreview';
import { PreviewContent } from './PreviewContent';
import { ItemScore } from '@/scoring/types';

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

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
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
  getItemTypeColor,
  onResponseChange,
  itemScores,
  totalScore,
  scoringEnabled = false
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
          onResponseChange={onResponseChange}
          itemScores={itemScores}
          totalScore={totalScore}
          scoringEnabled={scoringEnabled}
        />
      </CardContent>
    </Card>
  </Box>
);