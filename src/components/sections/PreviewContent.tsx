import React from 'react';
import { Box, Alert, AlertTitle, Typography, Chip } from '@mui/material';
import { Description } from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { QTIItem, UnsupportedElement } from '@/types/qti';
import { SortableQTIItem } from '../qti/SortableQTIItem';
import { AddItemButton } from '../qti/AddItemButton';
import { ItemScore } from '@/scoring/types';

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
  // Scoring props
  onResponseChange?: (itemId: string, responseId: string, value: any) => void;
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

export const PreviewContent: React.FC<PreviewContentProps> = ({
  errors,
  qtiItems,
  unsupportedElements,
  newlyAddedItemId,
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
        onResponseChange={onResponseChange}
        itemScores={itemScores}
        scoringEnabled={scoringEnabled}
      />
    ) : !errors.length ? (
      <EmptyState onAddItem={onAddItem} />
    ) : null}
  </>
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
  onResponseChange?: (itemId: string, responseId: string, value: any) => void;
  itemScores?: Record<string, ItemScore>;
  scoringEnabled?: boolean;
}

const ItemsList: React.FC<ItemsListProps> = ({
  qtiItems,
  newlyAddedItemId,
  onAddItem,
  onCorrectResponseChange,
  onDragEnd,
  sensors,
  getItemTypeLabel,
  getItemTypeColor,
  onResponseChange,
  itemScores,
  scoringEnabled = false
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
                color={getItemTypeColor(item.type) as 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'default' | 'error'} 
                size="small" 
              />
            </Box>
            <SortableQTIItem 
              item={item} 
              isNewlyAdded={item.id === newlyAddedItemId}
              onCorrectResponseChange={onCorrectResponseChange}
              onResponseChange={onResponseChange}
              itemScore={itemScores?.[item.id || item.identifier]}
              scoringEnabled={scoringEnabled}
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