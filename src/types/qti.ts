export interface QTIItem {
  id: string;
  title: string;
  type: 'choice' | 'multipleResponse' | 'textEntry' | 'extendedText' | 'hottext' | 'slider' | 'order' | 'unknown';
  prompt: string;
  choices?: QTIChoice[];
  hottextChoices?: QTIHottextChoice[];
  sliderConfig?: QTISliderConfig;
  orderChoices?: QTIOrderChoice[];
  correctResponse?: string | string[];
  responseIdentifier?: string;
}

export interface QTIChoice {
  identifier: string;
  text: string;
}

export interface QTIHottextChoice {
  identifier: string;
  text: string;
}

export interface QTIOrderChoice {
  identifier: string;
  text: string;
}

export interface QTISliderConfig {
  lowerBound: number;
  upperBound: number;
  step?: number;
  stepLabel?: boolean;
  orientation?: 'horizontal' | 'vertical';
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