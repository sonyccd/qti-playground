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
          
          return (
            <span
              key={`hottext-${identifier}-${index}`}
              className={`inline-block px-2 py-1 mx-1 rounded cursor-pointer transition-colors ${
                isSelected 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : 'bg-muted hover:bg-accent border-2 border-dashed border-muted-foreground/30'
              }`}
              onClick={() => toggleHottext(identifier)}
            >
              {text}
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