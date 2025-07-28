import { QTIItem } from '@/types/qti';
import { ChoiceItem } from './ChoiceItem';
import { TextEntryItem } from './TextEntryItem';
import { ExtendedTextItem } from './ExtendedTextItem';
import { HottextItem } from './HottextItem';
import { SliderItem } from './SliderItem';
import { OrderItem } from './OrderItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { ItemScore } from '@/scoring/types';

interface QTIItemRendererProps {
  item: QTIItem;
  isNewlyAdded?: boolean;
  onCorrectResponseChange?: (itemId: string, correctResponse: string | string[] | number) => void;
  onResponseChange?: (itemId: string, responseId: string, value: string | string[] | number | boolean) => void;
  itemScore?: ItemScore;
  scoringEnabled?: boolean;
}

export function QTIItemRenderer({ 
  item, 
  isNewlyAdded = false, 
  onCorrectResponseChange, 
  onResponseChange, 
  itemScore, 
  scoringEnabled = false 
}: QTIItemRendererProps) {
  const animationClass = isNewlyAdded ? "animate-slide-in-right" : "";
  const renderItem = () => {
    switch (item.type) {
      case 'choice':
      case 'multipleResponse':
        return (
          <ChoiceItem 
            item={item} 
            onCorrectResponseChange={onCorrectResponseChange} 
            onResponseChange={onResponseChange}
            itemScore={itemScore}
            scoringEnabled={scoringEnabled}
          />
        );
      
      case 'textEntry':
        return (
          <TextEntryItem 
            item={item} 
            onCorrectResponseChange={onCorrectResponseChange} 
            onResponseChange={onResponseChange}
            itemScore={itemScore}
            scoringEnabled={scoringEnabled}
          />
        );
      
      case 'extendedText':
        return (
          <ExtendedTextItem 
            item={item} 
            onCorrectResponseChange={onCorrectResponseChange} 
            onResponseChange={onResponseChange}
            itemScore={itemScore}
            scoringEnabled={scoringEnabled}
          />
        );
      
      case 'hottext':
        return (
          <HottextItem 
            item={item} 
            onCorrectResponseChange={onCorrectResponseChange} 
            onResponseChange={onResponseChange}
            itemScore={itemScore}
            scoringEnabled={scoringEnabled}
          />
        );
      
      case 'slider':
        return (
          <SliderItem 
            item={item} 
            onCorrectResponseChange={onCorrectResponseChange} 
            onResponseChange={onResponseChange}
            itemScore={itemScore}
            scoringEnabled={scoringEnabled}
          />
        );
      
      case 'order':
        return (
          <OrderItem 
            item={item} 
            onCorrectResponseChange={onCorrectResponseChange}
            onResponseChange={onResponseChange}
            itemScore={itemScore}
            scoringEnabled={scoringEnabled}
          />
        );
      
      case 'unknown':
      default:
        return (
          <Card className="w-full border border-destructive/20 bg-destructive/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">
                {item.prompt || 'This item type is not yet supported for preview.'}
              </div>
              <div className="mt-3 text-sm text-destructive">
                Item type: {item.type}
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className={`${animationClass} transition-all duration-500`}>
      {renderItem()}
    </div>
  );
}