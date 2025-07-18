import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip
} from '@mui/material';
import { Code, DataObject, Lock } from '@mui/icons-material';
import { ContentFormat, CONTENT_FORMATS, ContentFormatInfo } from '@/types/contentFormat';
import { QTIVersion } from '@/types/qtiVersions';

interface ContentFormatSelectorProps {
  selectedFormat: ContentFormat;
  onFormatChange: (format: ContentFormat) => void;
  qtiVersion: QTIVersion;
  disabled?: boolean;
  isLocked?: boolean;
  hasContent?: boolean;
}

const ContentFormatSelector: React.FC<ContentFormatSelectorProps> = ({
  selectedFormat,
  onFormatChange,
  qtiVersion,
  disabled = false,
  isLocked = false,
  hasContent = false
}) => {
  const isQTI3 = qtiVersion === '3.0';
  const showSelector = isQTI3 && !isLocked;
  const formatInfo = CONTENT_FORMATS[selectedFormat];

  const getFormatIcon = (format: ContentFormat) => {
    switch (format) {
      case 'xml':
        return <Code sx={{ fontSize: 18 }} />;
      case 'json':
        return <DataObject sx={{ fontSize: 18 }} />;
      default:
        return <Code sx={{ fontSize: 18 }} />;
    }
  };

  const handleFormatChange = (event: any) => {
    const newFormat = event.target.value as ContentFormat;
    onFormatChange(newFormat);
  };

  if (!isQTI3) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Format:
        </Typography>
        <Chip
          icon={getFormatIcon('xml')}
          label="XML"
          size="small"
          variant="outlined"
        />
        <Typography variant="caption" color="text.secondary">
          (QTI 2.1 uses XML only)
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography variant="caption" color="text.secondary">
        Format:
      </Typography>
      
      {showSelector ? (
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={selectedFormat}
            onChange={handleFormatChange}
            disabled={disabled}
            sx={{ height: 32 }}
          >
            {Object.entries(CONTENT_FORMATS).map(([key, info]) => (
              <MenuItem key={key} value={key}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getFormatIcon(info.format)}
                  <Typography variant="body2">
                    {info.name}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <Tooltip title={isLocked ? "Format is locked once content is created" : formatInfo.description}>
          <Chip
            icon={getFormatIcon(selectedFormat)}
            label={formatInfo.name}
            size="small"
            variant="outlined"
            deleteIcon={isLocked ? <Lock sx={{ fontSize: 16 }} /> : undefined}
            onDelete={isLocked ? () => {} : undefined}
          />
        </Tooltip>
      )}
      
      <Typography variant="caption" color="text.secondary">
        {formatInfo.description}
      </Typography>
      
      {hasContent && isLocked && (
        <Tooltip title="Create a new file to change format">
          <Typography variant="caption" color="warning.main" sx={{ fontStyle: 'italic' }}>
            Format locked
          </Typography>
        </Tooltip>
      )}
    </Box>
  );
};

export default ContentFormatSelector;