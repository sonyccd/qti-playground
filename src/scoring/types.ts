export interface ScoreResult {
  score: number;
  maxScore: number;
  feedback?: string;
  isCorrect?: boolean;
  partialCredit?: boolean;
}

export interface ItemResponse {
  itemId: string;
  responseId: string;
  value: string | string[] | number | boolean;
  timestamp: number;
}

export interface ItemScore {
  itemId: string;
  score: number;
  maxScore: number;
  feedback?: string;
  isCorrect?: boolean;
  partialCredit?: boolean;
  requiresManualScoring?: boolean;
}

export interface ResponseProcessingRule {
  template?: string;
  customLogic?: unknown;
  customScore?: number;
}

export interface ResponseCondition {
  type: 'if' | 'elseif' | 'else';
  condition?: LogicalExpression;
  actions: ScoringAction[];
}

export interface LogicalExpression {
  operator: 'match' | 'equal' | 'member' | 'not' | 'and' | 'or';
  operands: (string | number | boolean | LogicalExpression)[];
}

export interface ScoringAction {
  type: 'setScore' | 'addScore' | 'setFeedback';
  value: string | number;
}

export interface ScoringContext {
  responses: Record<string, ItemResponse>;
  correctResponses: Record<string, string | string[]>;
  mappings?: Record<string, Record<string, number>>;
  outcomes?: Record<string, any>;
}

export type ResponseProcessingTemplate = 
  | 'match_correct'
  | 'map_response'
  | 'match_none'
  | 'map_response_point'
  | 'match_correct_multiple';