import { useState } from 'react';
import { QTIItem } from '@/types/qti';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chip } from '@mui/material';
import { Button } from '@/components/ui/button';
import { Edit3, Save, X } from 'lucide-react';

interface HottextItemProps {
  item: QTIItem;
  onCorrectResponseChange?: (itemId: string, correctResponse: string[]) => void;
}

export function HottextItem({ item, onCorrectResponseChange }: HottextItemProps) {
  const [selectedHottexts, setSelectedHottexts] = useState<string[]>([]);
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

  const toggleHottext = (identifier: string) => {
    if (isEditingCorrect) {
      // Toggle in editing mode
      setTempCorrectAnswers(prev => 
        prev.includes(identifier)
          ? prev.filter(id => id !== identifier)
          : [...prev, identifier]
      );
    } else {
      // Toggle in selection mode
      setSelectedHottexts(prev => 
        prev.includes(identifier)
          ? prev.filter(id => id !== identifier)
          : [...prev, identifier]
      );
    }
  };

  const saveCorrectAnswers = () => {
    setCorrectAnswers(tempCorrectAnswers);
    setIsEditingCorrect(false);
    onCorrectResponseChange?.(item.id, tempCorrectAnswers);
  };

  const cancelEditing = () => {
    setTempCorrectAnswers(correctAnswers);
    setIsEditingCorrect(false);
  };

  // Check if a hottext is correct
  const isCorrectHottext = (identifier: string): boolean => {
    return correctAnswers.includes(identifier);
  };

  // Parse the HTML content and render it with React components
  const renderContent = () => {
    if (!item.prompt) return null;

    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = item.prompt;

    // Convert DOM nodes to React elements
    const convertNodeToReact = (node: Node, index: number): React.ReactNode => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }
      
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();
        
        if (tagName === 'hottext') {
          const identifier = element.getAttribute('identifier') || '';
          const text = element.textContent || '';
          const isSelected = selectedHottexts.includes(identifier);
          const isCorrect = isCorrectHottext(identifier);
          const isSelectedAsCorrect = tempCorrectAnswers.includes(identifier);
          
          return (
            <span
              key={`hottext-${identifier}-${index}`}
              className={`inline-block px-2 py-1 mx-1 rounded cursor-pointer transition-colors border-2 ${
                isEditingCorrect
                  ? isSelectedAsCorrect
                    ? 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100'
                    : 'bg-muted hover:bg-accent border-dashed border-muted-foreground/30'
                  : isCorrect
                    ? 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100'
                    : isSelected 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-primary' 
                      : 'bg-muted hover:bg-accent border-dashed border-muted-foreground/30'
              }`}
              onClick={() => toggleHottext(identifier)}
            >
              {text}
              {!isEditingCorrect && isCorrect && <span className="ml-1 text-green-600">✓</span>}
            </span>
          );
        }
        
        // Handle other HTML elements
        const children = Array.from(element.childNodes).map((child, childIndex) => 
          convertNodeToReact(child, childIndex)
        );
        
        // Return appropriate JSX element based on tag name
        switch (tagName) {
          case 'p':
            return <p key={index} className="mb-2">{children}</p>;
          case 'strong':
            return <strong key={index}>{children}</strong>;
          case 'em':
            return <em key={index}>{children}</em>;
          case 'br':
            return <br key={index} />;
          default:
            return <span key={index}>{children}</span>;
        }
      }
      
      return null;
    };

    // Convert all child nodes to React elements
    const reactElements = Array.from(tempDiv.childNodes).map((node, index) => 
      convertNodeToReact(node, index)
    );

    return <div className="leading-relaxed">{reactElements}</div>;
  };

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg border border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-card-foreground">
              {item.title}
            </CardTitle>
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
      
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-3">
            {isEditingCorrect 
              ? 'Click on the words to mark them as correct answers:'
              : 'Click on the highlighted words to select them:'
            }
          </div>
          
          {renderContent()}
          
          {!isEditingCorrect && selectedHottexts.length > 0 && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium mb-2">Selected:</div>
              <div className="flex flex-wrap gap-1">
                {selectedHottexts.map(id => {
                  const choice = item.hottextChoices?.find(c => c.identifier === id);
                  return choice ? (
                    <Chip 
                      key={id} 
                      label={choice.text}
                      color="primary"
                      size="small"
                    />
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            {isEditingCorrect 
              ? 'Click on text segments above to mark them as correct'
              : 'Select the appropriate text segments by clicking on them'
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}