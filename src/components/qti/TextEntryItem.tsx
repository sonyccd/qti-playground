import { useState } from 'react';
import { QTIItem } from '@/types/qti';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit3, Save, X } from 'lucide-react';

interface TextEntryItemProps {
  item: QTIItem;
}

export function TextEntryItem({ item }: TextEntryItemProps) {
  const [userResponse, setUserResponse] = useState('');
  const [isEditingCorrect, setIsEditingCorrect] = useState(false);
  const [tempCorrectAnswer, setTempCorrectAnswer] = useState<string>(
    typeof item.correctResponse === 'string' ? item.correctResponse : ''
  );
  const [correctAnswer, setCorrectAnswer] = useState<string>(
    typeof item.correctResponse === 'string' ? item.correctResponse : ''
  );

  const saveCorrectAnswer = () => {
    setCorrectAnswer(tempCorrectAnswer);
    setIsEditingCorrect(false);
  };

  const cancelEditing = () => {
    setTempCorrectAnswer(correctAnswer);
    setIsEditingCorrect(false);
  };

  const isCorrectResponse = userResponse.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

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
            {correctAnswer && (
              <Badge variant="secondary" className="text-green-600">
                Answer set
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
                <Button variant="outline" size="sm" onClick={saveCorrectAnswer} className="gap-1">
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
          <Label htmlFor={`text-entry-${item.id}`} className="text-sm font-medium">
            Your response:
          </Label>
          <div className="relative">
            <Input
              id={`text-entry-${item.id}`}
              type="text"
              placeholder="Type your answer here..."
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              className={`w-full ${
                isCorrectResponse ? 'border-green-500 bg-green-50' : ''
              }`}
            />
            {isCorrectResponse && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600">
                ✓
              </span>
            )}
          </div>
        </div>

        {isEditingCorrect && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <Label className="text-sm font-medium text-blue-800 mb-2 block">
              Set the correct answer:
            </Label>
            <Input
              type="text"
              placeholder="Enter the correct answer..."
              value={tempCorrectAnswer}
              onChange={(e) => setTempCorrectAnswer(e.target.value)}
              className="w-full"
            />
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            {isEditingCorrect 
              ? 'Enter the correct answer above'
              : 'Type your answer in the text field'
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}