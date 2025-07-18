export interface QTIItem {
  id: string;
  identifier: string;
  title: string;
  type: 'choice' | 'multipleResponse' | 'textEntry' | 'extendedText' | 'hottext' | 'slider' | 'order' | 'unknown';
  interactionType?: 'choice' | 'multipleResponse' | 'textEntry' | 'extendedText' | 'hottext' | 'slider' | 'order';
  prompt: string;
  choices?: QTIChoice[];
  hottextChoices?: QTIHottextChoice[];
  sliderConfig?: QTISliderConfig;
  orderChoices?: QTIOrderChoice[];
  correctResponse?: string | string[];
  responseIdentifier?: string;
  maxScore?: number;
  mapping?: Record<string, number>;
  responseProcessing?: {
    template?: string;
    customLogic?: unknown;
  };
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

export interface QTIAssessmentTest {
  identifier: string;
  title: string;
  testParts: QTITestPart[];
  outcomeDeclarations?: QTIOutcomeDeclaration[];
}

export interface QTITestPart {
  identifier: string;
  navigationMode: 'linear' | 'nonlinear';
  submissionMode: 'individual' | 'simultaneous';
  scoreAggregation?: 'sum' | 'avg' | 'max' | 'min';
  assessmentSections: QTIAssessmentSection[];
}

export interface QTIAssessmentSection {
  identifier: string;
  title: string;
  visible: boolean;
  assessmentItems: QTIItem[];
}

export interface QTIOutcomeDeclaration {
  identifier: string;
  cardinality: 'single' | 'multiple' | 'ordered' | 'record';
  baseType: 'boolean' | 'directedPair' | 'duration' | 'file' | 'float' | 'identifier' | 'integer' | 'pair' | 'point' | 'string' | 'uri';
  defaultValue?: string | number;
}

export interface QTIParseResult {
  success: boolean;
  items: QTIItem[];
  errors: string[];
  unsupportedElements: UnsupportedElement[];
  assessmentTest?: QTIAssessmentTest;
}

export interface UnsupportedElement {
  type: string;
  count: number;
  description: string;
}