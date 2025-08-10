import * as React from "react";
import { TextField, TextFieldProps } from "@mui/material";

export interface TextareaProps extends Omit<TextFieldProps, 'variant' | 'multiline'> {
  className?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, sx, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        multiline
        variant="outlined"
        minRows={3}
        size="small"
        sx={{
          '& .MuiOutlinedInput-root': {
            fontSize: '0.875rem',
            minHeight: '80px',
            alignItems: 'flex-start',
            '&:focus-within': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: '2px'
              }
            }
          },
          '& .MuiOutlinedInput-input': {
            padding: '12px'
          },
          ...sx
        }}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";