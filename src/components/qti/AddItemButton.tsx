import { useState } from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText, Box, Divider } from '@mui/material';
import { Add, Quiz, CheckBox, Edit, Subject, TouchApp, LinearScale, Reorder } from '@mui/icons-material';
import { QTI_ITEM_TEMPLATES, ITEM_TYPE_LABELS, generateItemId } from '@/utils/qtiTemplates';

interface AddItemButtonProps {
  onAddItem: (itemXML: string) => void;
}

export function AddItemButton({ onAddItem }: AddItemButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddItem = (itemType: keyof typeof QTI_ITEM_TEMPLATES) => {
    const itemId = generateItemId();
    const itemXML = QTI_ITEM_TEMPLATES[itemType](itemId);
    onAddItem(itemXML);
    handleClose();
  };

  const getItemIcon = (itemType: string) => {
    switch (itemType) {
      case 'choice':
        return <Quiz />;
      case 'multipleResponse':
        return <CheckBox />;
      case 'textEntry':
        return <Edit />;
      case 'extendedText':
        return <Subject />;
      case 'hottext':
        return <TouchApp />;
      case 'slider':
        return <LinearScale />;
      case 'order':
        return <Reorder />;
      default:
        return <Quiz />;
    }
  };

  return (
    <>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        py: 2,
        position: 'relative'
      }}>
        <Divider sx={{ flexGrow: 1 }} />
        <Button
          variant="outlined"
          size="small"
          startIcon={<Add />}
          onClick={handleClick}
          sx={{ 
            mx: 2,
            minWidth: 120,
            borderRadius: 2,
            backgroundColor: 'background.paper',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              borderColor: 'primary.main'
            }
          }}
        >
          Add Item
        </Button>
        <Divider sx={{ flexGrow: 1 }} />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: { minWidth: 200 }
        }}
      >
        <MenuItem disabled sx={{ opacity: 0.7 }}>
          <ListItemText primary="Select Item Type" secondary="Choose the type of question to add" />
        </MenuItem>
        <Divider />
        
        {Object.entries(ITEM_TYPE_LABELS).map(([itemType, label]) => (
          <MenuItem
            key={itemType}
            onClick={() => handleAddItem(itemType as keyof typeof QTI_ITEM_TEMPLATES)}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {getItemIcon(itemType)}
            </ListItemIcon>
            <ListItemText 
              primary={label}
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}