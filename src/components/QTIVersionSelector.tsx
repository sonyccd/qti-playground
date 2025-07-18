import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { QTIVersion, QTI_VERSIONS } from '@/types/qtiVersions';

interface QTIVersionSelectorProps {
  selectedVersion: QTIVersion;
  onVersionChange: (version: QTIVersion) => void;
  disabled?: boolean;
}

export const QTIVersionSelector: React.FC<QTIVersionSelectorProps> = ({
  selectedVersion,
  onVersionChange,
  disabled = false
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Card sx={{ bgcolor: 'background.paper' }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              QTI Version:
            </Typography>
            
            <Select
              value={selectedVersion}
              onValueChange={(value) => onVersionChange(value as QTIVersion)}
              disabled={disabled}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select QTI version" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(QTI_VERSIONS).map(([key, info]) => (
                  <SelectItem key={key} value={key}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        {info.name}
                      </Typography>
                      <Chip 
                        label={info.version} 
                        size="small" 
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.75rem' }}
                      />
                    </Box>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
              {QTI_VERSIONS[selectedVersion].description}
              {selectedVersion === '3.0' && ' (Recommended)'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};