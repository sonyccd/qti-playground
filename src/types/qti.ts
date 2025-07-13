export interface QTIItem {
  id: string;
  title: string;
  type: 'choice' | 'multipleResponse' | 'textEntry' | 'unknown';
  prompt: string;
  choices?: QTIChoice[];
  correctResponse?: string | string[];
  responseIdentifier?: string;
}

export interface QTIChoice {
  identifier: string;
  text: string;
}

export interface QTIParseResult {
  success: boolean;
  items: QTIItem[];
  errors: string[];
  unsupportedElements: UnsupportedElement[];
}

export interface UnsupportedElement {
  type: string;
  count: number;
  description: string;
}