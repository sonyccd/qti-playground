import React from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { Code, OpenInFull } from '@mui/icons-material';
import CodeMirror from '@uiw/react-codemirror';
import { xml } from '@codemirror/lang-xml';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
import { LayoutMode } from '@/hooks/useQTIPreview';

interface XMLEditorProps {
  layoutMode: LayoutMode;
  xmlContent: string;
  onXmlChange: (value: string) => void;
  onLayoutModeChange: (mode: LayoutMode) => void;
}

export const XMLEditor: React.FC<XMLEditorProps> = ({
  layoutMode,
  xmlContent,
  onXmlChange,
  onLayoutModeChange
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
            <Code fontSize="small" />
            <Typography variant="h6" component="h3">
              QTI XML Editor
            </Typography>
          </Box>
          <Button 
            size="small" 
            variant={layoutMode === 'editor-only' ? 'contained' : 'outlined'}
            onClick={() => onLayoutModeChange(layoutMode === 'editor-only' ? 'split' : 'editor-only')}
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <OpenInFull fontSize="small" />
          </Button>
        </Box>
      </CardContent>
      <Box sx={{ flex: 1, overflow: 'auto', height: 0 }}>
        <CodeMirror 
          value={xmlContent} 
          onChange={onXmlChange} 
          extensions={[xml(), EditorView.lineWrapping]} 
          theme={oneDark} 
          style={{ height: '100%' }} 
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: true,
            autocompletion: true
          }}
        />
      </Box>
    </Card>
  </Box>
);