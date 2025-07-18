import React from 'react';
import { Box, Container, useTheme } from '@mui/material';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { useQTIPreview } from '@/hooks/useQTIPreview';
import { getItemTypeLabel, getItemTypeColor } from '@/constants/qtiConstants';
import { FileUploadSection } from './sections/FileUploadSection';
import { LoadingCard } from './sections/LoadingCard';
import { MainContent } from './sections/MainContent';
import { ErrorBoundary } from './ErrorBoundary';


export function QTIPreview() {
  const { state, actions } = useQTIPreview();
  const theme = useTheme();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  return (
    <ErrorBoundary>
      <Box sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[50]} 100%)`,
        py: 3,
        px: 2
      }}>
        <Container maxWidth="xl">
          {!state.hasContent && (
            <FileUploadSection 
              onFileSelect={actions.handleFileSelect}
              onClear={actions.handleClearFile}
              onLoadExample={actions.handleLoadExample}
              onCreateBlank={actions.handleCreateBlankFile}
              selectedFile={state.selectedFile}
              isLoading={state.isLoading}
            />
          )}

          {state.isLoading && <LoadingCard />}

          {state.hasContent && !state.isLoading && (
            <MainContent
              state={state}
              onXmlChange={actions.handleXmlChange}
              onLayoutModeChange={(mode) => actions.updateState({ layoutMode: mode })}
              onDownloadXml={actions.downloadXML}
              onClearFile={actions.handleClearFile}
              onAddItem={actions.handleAddItem}
              onCorrectResponseChange={actions.handleCorrectResponseChange}
              onDragEnd={actions.handleDragEnd}
              sensors={sensors}
              getItemTypeLabel={getItemTypeLabel}
              getItemTypeColor={getItemTypeColor}
            />
          )}
        </Container>
      </Box>
    </ErrorBoundary>
  );
}

