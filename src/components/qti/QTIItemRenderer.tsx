import { QTIItem } from '@/types/qti';
import { ChoiceItem } from './ChoiceItem';
import { TextEntryItem } from './TextEntryItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface QTIItemRendererProps {
  item: QTIItem;
}

export function QTIItemRenderer({ item }: QTIItemRendererProps) {
  switch (item.type) {
    case 'choice':
    case 'multipleResponse':
      return <ChoiceItem item={item} />;
    
    case 'textEntry':
      return <TextEntryItem item={item} />;
    
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
}