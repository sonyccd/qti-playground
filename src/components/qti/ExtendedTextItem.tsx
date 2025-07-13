import { useState } from 'react';
import { QTIItem } from '@/types/qti';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ExtendedTextItemProps {
  item: QTIItem;
}

export function ExtendedTextItem({ item }: ExtendedTextItemProps) {
  const [response, setResponse] = useState('');

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
        <div className="space-y-2">
          <Label htmlFor={`response-${item.id}`} className="text-sm font-medium">
            Your answer:
          </Label>
          <Textarea
            id={`response-${item.id}`}
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Type your detailed answer here..."
            className="w-full min-h-[120px] resize-y"
            rows={5}
          />
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            Provide a detailed written response
          </div>
        </div>
      </CardContent>
    </Card>
  );
}