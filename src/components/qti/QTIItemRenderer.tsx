import { QTIItem } from '@/types/qti';
import { ChoiceItem } from './ChoiceItem';
import { TextEntryItem } from './TextEntryItem';
import { ExtendedTextItem } from './ExtendedTextItem';
import { HottextItem } from './HottextItem';
import { SliderItem } from './SliderItem';
import { OrderItem } from './OrderItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface QTIItemRendererProps {
  item: QTIItem;
  isNewlyAdded?: boolean;
}

export function QTIItemRenderer({ item, isNewlyAdded = false }: QTIItemRendererProps) {
  const animationClass = isNewlyAdded ? "animate-slide-in-right" : "";
  const renderItem = () => {
    switch (item.type) {
      case 'choice':
      case 'multipleResponse':
        return <ChoiceItem item={item} />;
      
      case 'textEntry':
        return <TextEntryItem item={item} />;
      
      case 'extendedText':
        return <ExtendedTextItem item={item} />;
      
      case 'hottext':
        return <HottextItem item={item} />;
      
      case 'slider':
        return <SliderItem item={item} />;
      
      case 'order':
        return <OrderItem item={item} />;
      
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