import React from 'react';
import { Box, Button } from '@mui/material';
import { Download, Add } from '@mui/icons-material';
import { FileUpload } from '../FileUpload';

interface FileUploadSectionProps {
  onFileSelect: (file: File) => void;
  onClear: () => void;
  onLoadExample: () => void;
  onCreateBlank: () => void;
  selectedFile?: File;
  isLoading: boolean;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  onFileSelect,
  onClear,
  onLoadExample,
  onCreateBlank,
  selectedFile,
  isLoading
}) => (
  <Box sx={{ mb: 4 }}>
    <FileUpload onFileSelect={onFileSelect} onClear={onClear} selectedFile={selectedFile} />
    
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