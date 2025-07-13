import { useState } from 'react';
import { QTIItem } from '@/types/qti';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TextEntryItemProps {
  item: QTIItem;
}

export function TextEntryItem({ item }: TextEntryItemProps) {
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
          <Input
            id={`response-${item.id}`}
            type="text"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full"
          />
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            Fill in the blank with your answer
          </div>
        </div>
      </CardContent>
    </Card>
  );
}