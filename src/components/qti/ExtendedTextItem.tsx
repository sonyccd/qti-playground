import { useState } from 'react';
import { QTIItem } from '@/types/qti';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit3, Save, X } from 'lucide-react';

interface ExtendedTextItemProps {
  item: QTIItem;
  onCorrectResponseChange?: (itemId: string, correctResponse: string) => void;
}

export function ExtendedTextItem({ item, onCorrectResponseChange }: ExtendedTextItemProps) {
  const [userResponse, setUserResponse] = useState('');
  const [isEditingCorrect, setIsEditingCorrect] = useState(false);
  const [tempSampleAnswer, setTempSampleAnswer] = useState<string>(
    typeof item.correctResponse === 'string' ? item.correctResponse : ''
  );
  const [sampleAnswer, setSampleAnswer] = useState<string>(
    typeof item.correctResponse === 'string' ? item.correctResponse : ''
  );

  const saveSampleAnswer = () => {
    setSampleAnswer(tempSampleAnswer);
    setIsEditingCorrect(false);
    onCorrectResponseChange?.(item.id, tempSampleAnswer);
  };

  const cancelEditing = () => {
    setTempSampleAnswer(sampleAnswer);
    setIsEditingCorrect(false);
  };

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
            {sampleAnswer && (
              <Badge variant="secondary" className="text-green-600">
                Sample set
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
                Set Sample
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={saveSampleAnswer} className="gap-1">
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
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`extended-text-${item.id}`} className="text-sm font-medium">
            Your response:
          </Label>
          <Textarea
            id={`extended-text-${item.id}`}
            placeholder="Write your detailed response here..."
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            className="min-h-[120px] resize-vertical"
          />
        </div>

        {isEditingCorrect && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <Label className="text-sm font-medium text-blue-800 mb-2 block">
              Set a sample answer:
            </Label>
            <Textarea
              placeholder="Enter a sample correct response..."
              value={tempSampleAnswer}
              onChange={(e) => setTempSampleAnswer(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        )}

        {sampleAnswer && !isEditingCorrect && (
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <Label className="text-sm font-medium text-green-800 mb-2 block">
              Sample Answer:
            </Label>
            <div className="text-sm text-green-700 whitespace-pre-wrap">
              {sampleAnswer}
            </div>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            {isEditingCorrect 
              ? 'Enter a sample answer above'
              : 'Provide a detailed written response'
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}