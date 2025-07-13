import { useState } from 'react';
import { QTIItem } from '@/types/qti';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HottextItemProps {
  item: QTIItem;
}

export function HottextItem({ item }: HottextItemProps) {
  const [selectedHottexts, setSelectedHottexts] = useState<string[]>([]);

  const toggleHottext = (identifier: string) => {
    setSelectedHottexts(prev => 
      prev.includes(identifier) 
        ? prev.filter(id => id !== identifier)
        : [...prev, identifier]
    );
  };

  // Parse the HTML content and render it with interactive hottext elements
  const renderContent = () => {
    if (!item.prompt) return null;

    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = item.prompt;

    // Find all hottext elements and make them interactive
    const hottextElements = tempDiv.querySelectorAll('hottext');
    hottextElements.forEach(hottextEl => {
      const identifier = hottextEl.getAttribute('identifier') || '';
      const isSelected = selectedHottexts.includes(identifier);
      
      // Replace the hottext element with a styled span
      const span = document.createElement('span');
      span.className = isSelected 
        ? 'inline-block px-2 py-1 mx-1 rounded cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 transition-colors'
        : 'inline-block px-2 py-1 mx-1 rounded cursor-pointer bg-muted hover:bg-accent transition-colors border-2 border-dashed border-muted-foreground/30';
      span.textContent = hottextEl.textContent || '';
      span.onclick = () => toggleHottext(identifier);
      
      hottextEl.replaceWith(span);
    });

    return (
      <div 
        className="leading-relaxed"
        dangerouslySetInnerHTML={{ __html: tempDiv.innerHTML }}
      />
    );
  };

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg border border-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-card-foreground">
          {item.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-3">
            Click on the highlighted words to select them:
          </div>
          
          {renderContent()}
          
          {selectedHottexts.length > 0 && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium mb-2">Selected:</div>
              <div className="flex flex-wrap gap-1">
                {selectedHottexts.map(id => {
                  const choice = item.hottextChoices?.find(c => c.identifier === id);
                  return choice ? (
                    <Badge key={id} variant="default">
                      {choice.text}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            Select the appropriate text segments by clicking on them
          </div>
        </div>
      </CardContent>
    </Card>
  );
}