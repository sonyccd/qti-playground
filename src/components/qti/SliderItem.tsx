import { useState } from 'react';
import { QTIItem } from '@/types/qti';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface SliderItemProps {
  item: QTIItem;
}

export function SliderItem({ item }: SliderItemProps) {
  const config = item.sliderConfig;
  const [value, setValue] = useState<number[]>([config?.lowerBound || 0]);

  if (!config) {
    return <div>Slider configuration not found</div>;
  }

  const { lowerBound, upperBound, step, stepLabel } = config;

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg border border-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-card-foreground">
          {item.title}
        </CardTitle>
        {item.prompt && (
          <div className="text-muted-foreground mt-2 leading-relaxed">
            {item.prompt}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor={`slider-${item.id}`} className="text-sm font-medium">
            Select a value between {lowerBound} and {upperBound}:
          </Label>
          
          <div className="px-3">
            <Slider
              id={`slider-${item.id}`}
              min={lowerBound}
              max={upperBound}
              step={step || 1}
              value={value}
              onValueChange={setValue}
              className="w-full"
            />
          </div>
          
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{lowerBound}</span>
            <div className="text-center">
              <div className="font-medium text-foreground text-lg">
                {value[0]}
              </div>
              <div className="text-xs">Selected Value</div>
            </div>
            <span>{upperBound}</span>
          </div>
          
          {stepLabel && step && (
            <div className="text-xs text-muted-foreground text-center">
              Step size: {step}
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            Use the slider to select your answer
          </div>
          {item.correctResponse && (
            <div className="text-xs text-green-600 mt-1">
              ✓ Correct value: {item.correctResponse}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}