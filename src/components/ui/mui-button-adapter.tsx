import * as React from "react";
import { Button as MuiButton, ButtonProps as MuiButtonProps } from "@mui/material";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const mapVariantToMui = (variant?: ButtonVariant): MuiButtonProps['variant'] => {
  switch (variant) {
    case "outline":
      return "outlined";
    case "ghost":
    case "link":
      return "text";
    case "secondary":
    case "default":
    case "destructive":
    default:
      return "contained";
  }
};

const mapSizeToMui = (size?: ButtonSize): MuiButtonProps['size'] => {
  switch (size) {
    case "sm":
      return "small";
    case "lg":
      return "large";
    case "icon":
    case "default":
    default:
      return "medium";
  }
};

const getColorFromVariant = (variant?: ButtonVariant): MuiButtonProps['color'] => {
  switch (variant) {
    case "destructive":
      return "error";
    case "secondary":
      return "secondary";
    default:
      return "primary";
  }
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", asChild = false, sx, children, ...props }, ref) => {
    const muiVariant = mapVariantToMui(variant);
    const muiSize = mapSizeToMui(size);
    const muiColor = getColorFromVariant(variant);
    
    const isIcon = size === "icon";
    
    const customSx = {
      textTransform: 'none',
      gap: 1,
      ...(isIcon && {
        minWidth: '40px',
        width: '40px',
        height: '40px',
        padding: 0,
      }),
      ...(variant === "link" && {
        textDecoration: 'underline',
        textUnderlineOffset: '4px',
        '&:hover': {
          textDecoration: 'underline',
        }
      }),
      ...sx
    };

    return (
      <MuiButton
        ref={ref}
        variant={muiVariant}
        size={muiSize}
        color={muiColor}
        sx={customSx}
        {...props}
      >
        {children}
      </MuiButton>
    );
  }
);

Button.displayName = "Button";

// Export for compatibility with existing code
export const buttonVariants = () => "";