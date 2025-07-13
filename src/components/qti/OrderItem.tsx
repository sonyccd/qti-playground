import { useState } from 'react';
import { QTIItem } from '@/types/qti';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GripVertical, ArrowUp, ArrowDown } from 'lucide-react';

interface OrderItemProps {
  item: QTIItem;
}

export function OrderItem({ item }: OrderItemProps) {
  const [orderedChoices, setOrderedChoices] = useState(
    item.orderChoices ? [...item.orderChoices] : []
  );

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= orderedChoices.length) return;
    
    const newChoices = [...orderedChoices];
    const [movedItem] = newChoices.splice(fromIndex, 1);
    newChoices.splice(toIndex, 0, movedItem);
    setOrderedChoices(newChoices);
  };

  const shuffleChoices = () => {
    const shuffled = [...orderedChoices];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setOrderedChoices(shuffled);
  };

  const resetOrder = () => {
    if (item.orderChoices) {
      setOrderedChoices([...item.orderChoices]);
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
      
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-3">
            Drag items or use the arrow buttons to arrange them in the correct order:
          </div>
          
          <div className="space-y-2">
            {orderedChoices.map((choice, index) => (
              <div
                key={choice.identifier}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="min-w-[2rem] justify-center">
                    {index + 1}
                  </Badge>
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                </div>
                
                <div className="flex-1 text-sm font-medium">
                  {choice.text}
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveItem(index, index - 1)}
                    disabled={index === 0}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveItem(index, index + 1)}
                    disabled={index === orderedChoices.length - 1}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={shuffleChoices}>
              Shuffle
            </Button>
            <Button variant="outline" size="sm" onClick={resetOrder}>
              Reset
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium mb-2">Current Order:</div>
            <div className="flex flex-wrap gap-1">
              {orderedChoices.map((choice, index) => (
                <Badge key={choice.identifier} variant="secondary">
                  {index + 1}. {choice.text}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            Arrange the items in the correct sequence by dragging or using the arrow buttons
          </div>
        </div>
      </CardContent>
    </Card>
  );
}