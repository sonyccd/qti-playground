import * as React from "react";
import { TextField, TextFieldProps } from "@mui/material";

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", size = "small", sx, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        type={type}
        size={size}
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            height: '40px',
            fontSize: '0.875rem',
            '&:focus-within': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: '2px'
              }
            }
          },
          ...sx
        }}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";