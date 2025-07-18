import React from 'react';
import { Box, Button, Chip, Typography } from '@mui/material';
import { CheckCircle, Download, Description } from '@mui/icons-material';
import { QTIItem } from '@/types/qti';

interface ControlBarProps {
  selectedFile?: File;
  qtiItems: QTIItem[];
  xmlContent: string;
  onDownloadXml: () => void;
  onClearFile: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  selectedFile,
  qtiItems,
  xmlContent,
  onDownloadXml,
  onClearFile
}) => (
  <Box sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 2
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Chip label={selectedFile?.name || 'sample-qti.xml'} variant="outlined" size="small" />
      {qtiItems.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircle color="success" fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {qtiItems.length} item{qtiItems.length !== 1 ? 's' : ''} parsed
          </Typography>
        </Box>
      )}
    </Box>
    
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Button 
        variant="outlined" 
        size="small" 
        onClick={onDownloadXml}
        startIcon={<Download />}
        disabled={!xmlContent.trim()}
      >
        Download
      </Button>
      <Button variant="outlined" size="small" onClick={onClearFile} startIcon={<Description />}>
        New File
      </Button>
    </Box>
  </Box>
);