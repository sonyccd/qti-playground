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
            color={getItemTypeColor(type) as 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'default' | 'error'} 
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
                color={getItemTypeColor(item.type) as 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'default' | 'error'} 
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