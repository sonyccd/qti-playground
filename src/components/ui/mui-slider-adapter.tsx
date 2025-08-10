import * as React from "react";
import { Slider as MuiSlider, SliderProps as MuiSliderProps } from "@mui/material";

export interface SliderProps extends Omit<MuiSliderProps, 'value' | 'onChange'> {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  className?: string;
}

export const Slider = React.forwardRef<HTMLSpanElement, SliderProps>(
  ({ value, onValueChange, className, sx, ...props }, ref) => {
    const handleChange = (_event: Event, newValue: number | number[]) => {
      const valueArray = Array.isArray(newValue) ? newValue : [newValue];
      onValueChange?.(valueArray);
      props.onChange?.(_event, newValue, 0);
    };

    return (
      <MuiSlider
        ref={ref}
        value={value?.[0] || 0}
        onChange={handleChange}
        sx={{
          height: '8px',
          '& .MuiSlider-thumb': {
            height: '20px',
            width: '20px',
            backgroundColor: 'primary.main',
            border: '2px solid currentColor',
            '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
              boxShadow: 'inherit',
            },
          },
          '& .MuiSlider-track': {
            height: '8px',
            borderRadius: '4px',
          },
          '& .MuiSlider-rail': {
            height: '8px',
            borderRadius: '4px',
            backgroundColor: 'grey.300',
          },
          ...sx
        }}
        {...props}
      />
    );
  }
);

Slider.displayName = "Slider";