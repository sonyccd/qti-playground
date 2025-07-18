import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, ButtonGroup } from '@mui/material';
import { Code, DataObject } from '@mui/icons-material';
import { XmlCodeBlock } from './XmlCodeBlock';
import { ContentFormat } from '@/types/contentFormat';

interface DualFormatCodeBlockProps {
  xmlCode: string;
  jsonCode: string;
  title?: string;
  className?: string;
  defaultFormat?: ContentFormat;
}

export const DualFormatCodeBlock: React.FC<DualFormatCodeBlockProps> = ({ 
  xmlCode, 
  jsonCode, 
  title = "Example", 
  className = "mb-6",
  defaultFormat = 'xml'
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ContentFormat>(defaultFormat);

  return (
    <Card className={className}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="h4">
            {title}
          </Typography>
          <ButtonGroup size="small" variant="outlined">
            <Button
              variant={selectedFormat === 'xml' ? 'contained' : 'outlined'}
              onClick={() => setSelectedFormat('xml')}
              startIcon={<Code />}
            >
              XML
            </Button>
            <Button
              variant={selectedFormat === 'json' ? 'contained' : 'outlined'}
              onClick={() => setSelectedFormat('json')}
              startIcon={<DataObject />}
            >
              JSON
            </Button>
          </ButtonGroup>
        </Box>
        
        <XmlCodeBlock 
          code={selectedFormat === 'xml' ? xmlCode : jsonCode}
          format={selectedFormat}
          className="mb-0"
        />
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          {selectedFormat === 'xml' 
            ? 'Traditional QTI XML format - compatible with all QTI versions'
            : 'Modern QTI JSON format - available in QTI 3.0 only'
          }
        </Typography>
      </CardContent>
    </Card>
  );
};