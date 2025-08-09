import { useState, useEffect } from 'react';
import { QTIItem } from '@/types/qti';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Chip } from '@mui/material';
import { Edit3, Save, X } from 'lucide-react';
import { ScoreDisplay } from '@/components/preview/ScoreDisplay';
import { ItemScore } from '@/scoring/types';

interface ChoiceItemProps {
  item: QTIItem;
  onCorrectResponseChange?: (itemId: string, correctResponse: string | string[]) => void;
  onResponseChange?: (itemId: string, responseId: string, value: string | string[]) => void;
  itemScore?: ItemScore;
  scoringEnabled?: boolean;
}

export function ChoiceItem({ 
  item, 
  onCorrectResponseChange, 
  onResponseChange, 
  itemScore, 
  scoringEnabled = false 
}: ChoiceItemProps) {
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [isEditingCorrect, setIsEditingCorrect] = useState(false);
  const [tempCorrectAnswers, setTempCorrectAnswers] = useState<string[]>(
    Array.isArray(item.correctResponse) 
      ? item.correctResponse 
      : item.correctResponse 
        ? [item.correctResponse] 
        : []
  );
  const [correctAnswers, setCorrectAnswers] = useState<string[]>(
    Array.isArray(item.correctResponse) 
      ? item.correctResponse 
      : item.correctResponse 
        ? [item.correctResponse] 
        : []
  );
  
  const isMultipleChoice = item.type === 'choice';

  const handleChoiceChange = (choiceId: string, checked: boolean) => {
    let newSelection: string[];
    
    if (isMultipleChoice) {
      newSelection = checked ? [choiceId] : [];
    } else {
      newSelection = checked 
        ? [...selectedChoices, choiceId]
        : selectedChoices.filter(id => id !== choiceId);
    }
    
    setSelectedChoices(newSelection);
    
    // Emit response to scoring system
    if (onResponseChange && scoringEnabled) {
      const responseValue = isMultipleChoice ? newSelection[0] || '' : newSelection;
      onResponseChange(item.id || item.identifier, item.responseIdentifier || 'RESPONSE', responseValue);
    }
  };

  const handleCorrectAnswerToggle = (choiceId: string, checked: boolean) => {
    if (isMultipleChoice) {
      setTempCorrectAnswers(checked ? [choiceId] : []);
    } else {
      setTempCorrectAnswers(prev => 
        checked 
          ? [...prev, choiceId]
          : prev.filter(id => id !== choiceId)
      );
    }
  };

  const saveCorrectAnswers = () => {
    setCorrectAnswers(tempCorrectAnswers);
    setIsEditingCorrect(false);
    // Notify parent component of the change
    onCorrectResponseChange?.(item.id, isMultipleChoice ? tempCorrectAnswers[0] || '' : tempCorrectAnswers);
  };

  const cancelEditing = () => {
    setTempCorrectAnswers(correctAnswers);
    setIsEditingCorrect(false);
  };

  // Check if a choice is correct
  const isCorrectChoice = (choiceId: string): boolean => {
    return correctAnswers.includes(choiceId);
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
            {correctAnswers.length > 0 && (
              <Chip 
                label={`${correctAnswers.length} correct`}
                color="success"
                size="small"
                sx={{ color: 'green' }}
              />
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
                <Button variant="outline" size="sm" onClick={saveCorrectAnswers} className="gap-1">
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
      
      <CardContent className="space-y-3">
        {item.choices?.map((choice) => {
          const isCorrect = isCorrectChoice(choice.identifier);
          const isSelectedAsCorrect = tempCorrectAnswers.includes(choice.identifier);
          
          return (
            <div key={choice.identifier} className="space-y-2">
              {/* User response section */}
              <div 
                className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                  isCorrect 
                    ? 'bg-green-50 border border-green-200 hover:bg-green-100' 
                    : 'hover:bg-muted/50'
                }`}
              >
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
                  className={`flex-1 text-sm leading-relaxed cursor-pointer ${
                    isCorrect ? 'text-green-800 font-medium' : ''
                  }`}
                >
                  {choice.text}
                </Label>
              </div>
              
              {/* Correct answer editing section */}
              {isEditingCorrect && (
                <div className="ml-6 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`correct-${choice.identifier}`}
                      checked={isSelectedAsCorrect}
                      onCheckedChange={(checked) => 
                        handleCorrectAnswerToggle(choice.identifier, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`correct-${choice.identifier}`}
                      className="text-blue-800 cursor-pointer font-medium"
                    >
                      Mark as correct answer
                    </Label>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        <div className="mt-4 pt-4 border-t border-border space-y-3">
          <div className="text-xs text-muted-foreground">
            {isEditingCorrect 
              ? `Select the correct answer${isMultipleChoice ? '' : 's'} above`
              : `${isMultipleChoice ? 'Select one option' : 'Select one or more options'}`
            }
          </div>
          
          {/* Score Display */}
          {scoringEnabled && itemScore && selectedChoices.length > 0 && (
            <div className="mt-3">
              <ScoreDisplay score={itemScore} compact={true} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}