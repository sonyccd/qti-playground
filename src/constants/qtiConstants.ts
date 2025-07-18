export const ITEM_TYPE_LABELS: Record<string, string> = {
  choice: 'Multiple Choice',
  multipleResponse: 'Multiple Response',
  textEntry: 'Fill in the Blank',
  extendedText: 'Extended Text',
  hottext: 'Hottext Selection',
  slider: 'Slider',
  order: 'Order Interaction',
};

export const ITEM_TYPE_COLORS: Record<string, string> = {
  choice: 'primary',
  multipleResponse: 'secondary',
  textEntry: 'success',
  extendedText: 'info',
  hottext: 'warning',
  slider: 'default',
  order: 'destructive',
};

export const getItemTypeLabel = (type: string) => ITEM_TYPE_LABELS[type] || 'Unknown';
export const getItemTypeColor = (type: string) => ITEM_TYPE_COLORS[type] || 'error';