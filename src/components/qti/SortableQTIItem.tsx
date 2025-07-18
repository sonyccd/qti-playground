import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { QTIItemRenderer } from './QTIItemRenderer';
import { QTIItem } from '@/types/qti';
import { Card } from '@/components/ui/card';
import { GripVertical } from 'lucide-react';
import { ItemScore } from '@/scoring/types';

interface SortableQTIItemProps {
  item: QTIItem;
  isNewlyAdded?: boolean;
  onCorrectResponseChange?: (itemId: string, correctResponse: string | string[] | number) => void;
  onResponseChange?: (itemId: string, responseId: string, value: any) => void;
  itemScore?: ItemScore;
  scoringEnabled?: boolean;
}

export function SortableQTIItem({ 
  item, 
  isNewlyAdded = false, 
  onCorrectResponseChange,
  onResponseChange,
  itemScore,
  scoringEnabled = false
}: SortableQTIItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <Card className={`relative ${isDragging ? 'z-50' : ''}`}>
        <div 
          {...attributes}
          {...listeners}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="pl-8">
          <QTIItemRenderer
            item={item}
            isNewlyAdded={isNewlyAdded}
            onCorrectResponseChange={onCorrectResponseChange}
            onResponseChange={onResponseChange}
            itemScore={itemScore}
            scoringEnabled={scoringEnabled}
          />
        </div>
      </Card>
    </div>
  );
}