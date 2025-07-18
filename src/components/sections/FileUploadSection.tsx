import React from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import { Download, Add } from '@mui/icons-material';
import { FileUpload } from '../FileUpload';
import { QTIVersionSelector } from '../QTIVersionSelector';
import ContentFormatSelector from '../ContentFormatSelector';
import { QTIVersion } from '@/types/qtiVersions';
import { ContentFormat } from '@/types/contentFormat';

interface FileUploadSectionProps {
  onFileSelect: (file: File) => void;
  onClear: () => void;
  onLoadExample: () => void;
  onCreateBlank: () => void;
  selectedFile?: File;
  isLoading: boolean;
  selectedVersion: QTIVersion;
  selectedFormat: ContentFormat;
  onVersionChange: (version: QTIVersion) => void;
  onFormatChange: (format: ContentFormat) => void;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  onFileSelect,
  onClear,
  onLoadExample,
  onCreateBlank,
  selectedFile,
  isLoading,
  selectedVersion,
  selectedFormat,
  onVersionChange,
  onFormatChange
}) => (
  <Box sx={{ mb: 4 }}>
    <FileUpload onFileSelect={onFileSelect} onClear={onClear} selectedFile={selectedFile} />
    
    {/* Format and Version Selection */}
    <Box sx={{ mt: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
        File Settings
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <QTIVersionSelector
            selectedVersion={selectedVersion}
            onVersionChange={onVersionChange}
            disabled={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ContentFormatSelector
            selectedFormat={selectedFormat}
            onFormatChange={onFormatChange}
            qtiVersion={selectedVersion}
            disabled={isLoading}
            isLocked={false}
            hasContent={false}
          />
        </Grid>
      </Grid>
    </Box>
    
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