import React, { useState } from 'react';
import { 
  Box, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography,
  Chip,
  Alert,
  AlertTitle,
  Badge,
  Button,
  Divider,
  Grid
} from '@mui/material';
import { 
  ExpandMore, 
  Assessment, 
  Warning, 
  Score,
  Download,
  Description,
  Settings
} from '@mui/icons-material';
import { QTIItem, UnsupportedElement } from '@/types/qti';
import { TotalScoreDisplay } from '@/components/preview/ScoreDisplay';
import { ItemScore } from '@/scoring/types';
import { QTIVersionSelector } from '@/components/QTIVersionSelector';
import ContentFormatSelector from '@/components/ContentFormatSelector';
import { QTIVersion } from '@/types/qtiVersions';
import { ContentFormat } from '@/types/contentFormat';

interface AssessmentDetailsAccordionProps {
  qtiItems: QTIItem[];
  unsupportedElements: UnsupportedElement[];
  getItemTypeLabel: (type: string) => string;
  getItemTypeColor: (type: string) => string;
  // Scoring props
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
  // File controls props
  selectedFile?: File;
  selectedVersion: QTIVersion;
  selectedFormat: ContentFormat;
  xmlContent: string;
  isLoading: boolean;
  isFormatLocked: boolean;
  hasContent: boolean;
  onVersionChange: (version: QTIVersion) => void;
  onFormatChange: (format: ContentFormat) => void;
  onDownloadXml: () => void;
  onClearFile: () => void;
}

export const AssessmentDetailsAccordion: React.FC<AssessmentDetailsAccordionProps> = ({
  qtiItems,
  unsupportedElements,
  getItemTypeLabel,
  getItemTypeColor,
  itemScores,
  totalScore,
  scoringEnabled = false,
  selectedFile,
  selectedVersion,
  selectedFormat,
  xmlContent,
  isLoading,
  isFormatLocked,
  hasContent,
  onVersionChange,
  onFormatChange,
  onDownloadXml,
  onClearFile
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const hasScoreData = scoringEnabled && totalScore && Object.keys(itemScores || {}).length > 0;
  const hasItems = qtiItems.length > 0;
  const hasUnsupportedElements = unsupportedElements.length > 0;

  // Always show the accordion since it now contains important controls

  const getSummaryText = () => {
    const parts = [];
    
    // Add file info
    parts.push(`${selectedFile?.name || 'sample-qti.xml'}`);
    parts.push(`QTI ${selectedVersion}`);
    parts.push(selectedFormat.toUpperCase());
    
    if (hasItems) {
      parts.push(`${qtiItems.length} item${qtiItems.length !== 1 ? 's' : ''}`);
    }
    
    if (hasUnsupportedElements) {
      parts.push(`${unsupportedElements.length} warning${unsupportedElements.length !== 1 ? 's' : ''}`);
    }
    
    if (hasScoreData) {
      parts.push(`${totalScore.correctItems}/${totalScore.totalItems} correct`);
    }
    
    return parts.join(' • ');
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Accordion 
        expanded={expanded} 
        onChange={handleAccordionChange}
        sx={{
          '&:before': {
            display: 'none',
          },
          boxShadow: 'none',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: 1,
          '&:not(:last-child)': {
            borderBottom: 0,
          },
          '&.Mui-expanded': {
            margin: 0,
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            borderRadius: expanded ? '4px 4px 0 0' : '4px',
            '&.Mui-expanded': {
              minHeight: 48,
            },
            '& .MuiAccordionSummary-content': {
              alignItems: 'center',
              gap: 2,
            },
            '& .MuiAccordionSummary-content.Mui-expanded': {
              margin: '12px 0',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Settings fontSize="small" color="action" />
            <Typography variant="subtitle2" color="text.secondary">
              Assessment Settings & Details
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto', mr: 2 }}>
            {hasUnsupportedElements && (
              <Badge badgeContent={unsupportedElements.length} color="warning" max={99}>
                <Warning fontSize="small" color="warning" />
              </Badge>
            )}
            
            {hasScoreData && (
              <Badge badgeContent={`${totalScore.correctItems}/${totalScore.totalItems}`} color="primary" max={999}>
                <Score fontSize="small" color="primary" />
              </Badge>
            )}
            
            <Typography variant="caption" color="text.secondary">
              {getSummaryText()}
            </Typography>
          </Box>
        </AccordionSummary>
        
        <AccordionDetails sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* File Controls Section */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                File & Format Settings
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <QTIVersionSelector
                    selectedVersion={selectedVersion}
                    onVersionChange={onVersionChange}
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <ContentFormatSelector
                    selectedFormat={selectedFormat}
                    onFormatChange={onFormatChange}
                    qtiVersion={selectedVersion}
                    disabled={isLoading}
                    isLocked={isFormatLocked}
                    hasContent={hasContent}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={onDownloadXml}
                    startIcon={<Download />}
                    disabled={!xmlContent.trim()}
                    fullWidth
                  >
                    Download
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={onClearFile} 
                    startIcon={<Description />}
                    fullWidth
                  >
                    New File
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Item Type Summary */}
            {hasItems && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Parsed Items
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Array.from(new Set(qtiItems.map(item => item.type))).map(type => {
                    const count = qtiItems.filter(item => item.type === type).length;
                    return (
                      <Chip
                        key={type}
                        label={`${getItemTypeLabel(type)} (${count})`}
                        size="small"
                        color={getItemTypeColor(type) as 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'default' | 'error'}
                        variant="outlined"
                      />
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* Unsupported Elements Alert */}
            {hasUnsupportedElements && (
              <Alert severity="warning" sx={{ mb: 0 }}>
                <AlertTitle>Unsupported Elements</AlertTitle>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  The following elements are not yet supported by this preview:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {unsupportedElements.map((element, index) => (
                    <Chip
                      key={index}
                      label={`${element.type} (${element.count})`}
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Alert>
            )}

            {/* Total Score Display */}
            {hasScoreData && (
              <>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Assessment Score
                  </Typography>
                  <TotalScoreDisplay
                    totalScore={totalScore.score}
                    maxTotalScore={totalScore.maxScore}
                    correctItems={totalScore.correctItems}
                    totalItems={totalScore.totalItems}
                    percentageScore={totalScore.percentage}
                    requiresManualScoring={totalScore.requiresManualScoring}
                  />
                </Box>
              </>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};