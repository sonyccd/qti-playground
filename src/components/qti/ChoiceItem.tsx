import { useState } from 'react';
import { QTIItem } from '@/types/qti';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ChoiceItemProps {
  item: QTIItem;
}

export function ChoiceItem({ item }: ChoiceItemProps) {
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const isMultipleChoice = item.type === 'choice';

  const handleChoiceChange = (choiceId: string, checked: boolean) => {
    if (isMultipleChoice) {
      setSelectedChoices(checked ? [choiceId] : []);
    } else {
      setSelectedChoices(prev => 
        checked 
          ? [...prev, choiceId]
          : prev.filter(id => id !== choiceId)
      );
    }
  };

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
      
      <CardContent className="space-y-3">
        {item.choices?.map((choice) => (
          <div key={choice.identifier} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <Checkbox
              id={choice.identifier}
              checked={selectedChoices.includes(choice.identifier)}
              onCheckedChange={(checked) => 
                handleChoiceChange(choice.identifier, checked as boolean)
              }
              className="mt-0.5"
            />
            <Label 
              htmlFor={choice.identifier}
              className="flex-1 text-sm leading-relaxed cursor-pointer"
            >
              {choice.text}
            </Label>
          </div>
        ))}
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            {isMultipleChoice ? 'Select one option' : 'Select one or more options'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}