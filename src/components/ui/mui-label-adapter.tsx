import * as React from "react";
import { FormLabel, FormLabelProps } from "@mui/material";

export interface LabelProps extends Omit<FormLabelProps, 'component'> {
  htmlFor?: string;
  className?: string;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ htmlFor, className, sx, children, ...props }, ref) => {
    return (
      <FormLabel
        ref={ref}
        component="label"
        htmlFor={htmlFor}
        sx={{
          fontSize: '0.875rem',
          fontWeight: 500,
          lineHeight: 1,
          cursor: 'pointer',
          '&.Mui-disabled': {
            cursor: 'not-allowed',
            opacity: 0.7
          },
          ...sx
        }}
        {...props}
      >
        {children}
      </FormLabel>
    );
  }
);

Label.displayName = "Label";