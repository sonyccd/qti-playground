import * as React from "react";
import { Checkbox as MuiCheckbox, CheckboxProps as MuiCheckboxProps } from "@mui/material";

export interface CheckboxProps extends Omit<MuiCheckboxProps, 'checked'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ onCheckedChange, className, sx, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(event.target.checked);
      props.onChange?.(event, event.target.checked);
    };

    return (
      <MuiCheckbox
        ref={ref}
        size="small"
        sx={{
          width: '16px',
          height: '16px',
          padding: '0px',
          '& .MuiSvgIcon-root': {
            fontSize: '16px'
          },
          ...sx
        }}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";