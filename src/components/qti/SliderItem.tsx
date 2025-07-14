import { useState } from 'react';
import { QTIItem } from '@/types/qti';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Edit3, Save, X } from 'lucide-react';

interface SliderItemProps {
  item: QTIItem;
}

export function SliderItem({ item }: SliderItemProps) {
  const config = item.sliderConfig;
  const [value, setValue] = useState<number[]>([config?.lowerBound || 0]);
  const [isEditingCorrect, setIsEditingCorrect] = useState(false);
  const [tempCorrectValue, setTempCorrectValue] = useState<number>(() => {
    if (typeof item.correctResponse === 'string') {
      return parseFloat(item.correctResponse) || 0;
    } else if (typeof item.correctResponse === 'number') {
      return item.correctResponse;
    }
    return 0;
  });
  const [correctValue, setCorrectValue] = useState<number>(() => {
    if (typeof item.correctResponse === 'string') {
      return parseFloat(item.correctResponse) || 0;
    } else if (typeof item.correctResponse === 'number') {
      return item.correctResponse;
    }
    return 0;
  });

  if (!config) {
    return <div>Slider configuration not found</div>;
  }

  const { lowerBound, upperBound, step, stepLabel } = config;

  const saveCorrectValue = () => {
    setCorrectValue(tempCorrectValue);
    setIsEditingCorrect(false);
  };

  const cancelEditing = () => {
    setTempCorrectValue(correctValue);
    setIsEditingCorrect(false);
  };

  const isCorrectValue = Math.abs(value[0] - correctValue) < (step || 1) / 2;

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg border border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-card-foreground">
              {item.title}
            </CardTitle>
            {item.prompt && (
              <div className="text-muted-foreground mt-2 leading-relaxed">
                {item.prompt}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {correctValue !== 0 && (
              <Badge variant="secondary" className="text-green-600">
                Correct: {correctValue}
              </Badge>
            )}
            {!isEditingCorrect ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingCorrect(true)}
                className="gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Set Correct
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={saveCorrectValue} className="gap-1">
                  <Save className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={cancelEditing} className="gap-1">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
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
              <div className={`font-medium text-lg ${isCorrectValue ? 'text-green-600' : 'text-foreground'}`}>
                {value[0]}
                {isCorrectValue && <span className="ml-1 text-green-600">✓</span>}
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

        {isEditingCorrect && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <Label className="text-sm font-medium text-blue-800 mb-2 block">
              Set the correct value:
            </Label>
            <Input
              type="number"
              min={lowerBound}
              max={upperBound}
              step={step || 1}
              value={tempCorrectValue}
              onChange={(e) => setTempCorrectValue(parseFloat(e.target.value) || 0)}
              className="w-full"
            />
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            {isEditingCorrect 
              ? 'Enter the correct value above'
              : 'Use the slider to select your answer'
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}