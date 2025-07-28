import { QTIItem } from '../types/qti';
import { 
  ScoreResult, 
  ItemResponse, 
  ItemScore, 
  ResponseProcessingRule, 
  ScoringContext,
  ResponseProcessingTemplate 
} from './types';

export class ScoringEngine {
  private static instance: ScoringEngine;

  public static getInstance(): ScoringEngine {
    if (!ScoringEngine.instance) {
      ScoringEngine.instance = new ScoringEngine();
    }
    return ScoringEngine.instance;
  }

  /**
   * Calculate score for a single QTI item based on user response
   */
  public calculateItemScore(
    item: QTIItem, 
    userResponse: ItemResponse
  ): ItemScore {
    try {
      // Debug multi-select items specifically
      if (item.type === 'multipleResponse' || (Array.isArray(item.correctResponse) && item.correctResponse.length > 1)) {
        console.log('DEBUG Multi-select - item:', item.identifier, 'type:', item.type);
        console.log('DEBUG Multi-select - correctResponse:', item.correctResponse);
        console.log('DEBUG Multi-select - userResponse:', userResponse.value);
      }
      
      const responseProcessing = this.parseResponseProcessing(item);
      const scoreResult = this.executeResponseProcessing(
        responseProcessing, 
        item, 
        userResponse
      );

      return {
        itemId: item.id || item.identifier,
        score: scoreResult.score,
        maxScore: scoreResult.maxScore,
        feedback: scoreResult.feedback,
        isCorrect: scoreResult.isCorrect,
        partialCredit: scoreResult.partialCredit,
        requiresManualScoring: this.requiresManualScoring(item)
      };
    } catch (error) {
      console.error('Error calculating score for item:', item.identifier, error);
      return {
        itemId: item.id || item.identifier,
        score: 0,
        maxScore: this.getMaxScore(item),
        requiresManualScoring: true
      };
    }
  }

  /**
   * Calculate total score across multiple items
   */
  public calculateTotalScore(itemScores: ItemScore[]): {
    totalScore: number;
    maxTotalScore: number;
    percentageScore: number;
    correctItems: number;
    totalItems: number;
    requiresManualScoring: boolean;
  } {
    const totalScore = itemScores.reduce((sum, item) => sum + item.score, 0);
    const maxTotalScore = itemScores.reduce((sum, item) => sum + item.maxScore, 0);
    const correctItems = itemScores.filter(item => item.isCorrect === true).length;
    const requiresManualScoring = itemScores.some(item => item.requiresManualScoring);
    
    return {
      totalScore,
      maxTotalScore,
      percentageScore: maxTotalScore > 0 ? (totalScore / maxTotalScore) * 100 : 0,
      correctItems,
      totalItems: itemScores.length,
      requiresManualScoring
    };
  }

  /**
   * Parse response processing rules from QTI item
   */
  private parseResponseProcessing(item: QTIItem): ResponseProcessingRule {
    // Debug multi-select items specifically 
    if (item.type === 'multipleResponse' || (Array.isArray(item.correctResponse) && item.correctResponse.length > 1)) {
      console.log('DEBUG Multi-select responseProcessing:', item.responseProcessing);
    }
    
    if (item.responseProcessing?.template) {
      return {
        template: item.responseProcessing.template,
        customScore: this.parseCustomScore(item)
      };
    }
    
    // Check for custom logic in XML comments
    if (item.responseProcessing?.customLogic) {
      if (item.type === 'multipleResponse' || (Array.isArray(item.correctResponse) && item.correctResponse.length > 1)) {
        console.log('DEBUG Multi-select using custom logic:', item.responseProcessing.customLogic);
      }
      return {
        customLogic: item.responseProcessing.customLogic
      };
    }
    
    // For now, default to match_correct template
    return {
      template: 'match_correct'
    };
  }

  /**
   * Parse custom score from response processing attributes
   */
  private parseCustomScore(item: QTIItem): number | undefined {
    // Check for data-custom-score attribute in response processing
    // This would come from JSON conversion
    return undefined; // Will be enhanced later
  }

  /**
   * Execute response processing logic
   */
  private executeResponseProcessing(
    rule: ResponseProcessingRule,
    item: QTIItem,
    userResponse: ItemResponse
  ): ScoreResult {
    if (rule.customLogic) {
      return this.executeCustomLogic(rule.customLogic, item, userResponse);
    }
    
    if (rule.template) {
      return this.executeTemplate(rule.template as ResponseProcessingTemplate, item, userResponse);
    }
    
    // Handle custom logic (future implementation)
    return this.executeMatchCorrect(item, userResponse);
  }

  /**
   * Execute custom logic from JSON QTI
   */
  private executeCustomLogic(
    customLogic: unknown,
    item: QTIItem,
    userResponse: ItemResponse
  ): ScoreResult {
    const maxScore = this.getMaxScore(item);
    
    try {
      const logic = customLogic as Record<string, unknown>;
      switch (logic.type) {
        case 'conditional':
          return this.executeConditionalLogic(logic, item, userResponse, maxScore);
        case 'range_scoring':
          return this.executeRangeScoring(logic, item, userResponse, maxScore);
        case 'string_match':
          return this.executeStringMatch(logic, item, userResponse, maxScore);
        case 'length_based_scoring':
          return this.executeLengthBasedScoring(logic, item, userResponse, maxScore);
        default:
          console.warn(`Unknown custom logic type: ${logic.type}`);
          return this.executeMatchCorrect(item, userResponse);
      }
    } catch (error) {
      console.error('Error executing custom logic:', error);
      return {
        score: 0,
        maxScore,
        isCorrect: false
      };
    }
  }

  /**
   * Execute conditional logic (exact_match, partial_match)
   */
  private executeConditionalLogic(
    logic: Record<string, unknown>,
    item: QTIItem,
    userResponse: ItemResponse,
    maxScore: number
  ): ScoreResult {
    const userValue = Array.isArray(userResponse.value) ? userResponse.value : [userResponse.value];
    const correctResponse = Array.isArray(item.correctResponse) ? item.correctResponse : [item.correctResponse];
    
    if (!logic.conditions || !Array.isArray(logic.conditions)) {
      return { score: 0, maxScore, isCorrect: false };
    }

    // Convert to string arrays for comparison
    const userStrings = userValue.map(v => String(v));
    const correctStrings = correctResponse.map(v => String(v));
    
    // First check for exact match
    const exactMatchCondition = (logic.conditions as Record<string, unknown>[]).find((c: Record<string, unknown>) => c.if === 'exact_match');
    if (exactMatchCondition) {
      const isExactMatch = this.compareMultipleResponses(userStrings, correctStrings);
      if (isExactMatch) {
        return {
          score: (exactMatchCondition.score as number) || maxScore,
          maxScore,
          isCorrect: true,
          partialCredit: false
        };
      }
    }
    
    // Then check for partial match
    const partialMatchCondition = (logic.conditions as Record<string, unknown>[]).find((c: Record<string, unknown>) => c.if === 'partial_match');
    if (partialMatchCondition && partialMatchCondition.requirement) {
      const requirements = partialMatchCondition.requirement as string[];
      const hasRequiredItems = requirements.every((req: string) => 
        userStrings.some(val => val.toLowerCase() === String(req).toLowerCase())
      );
      if (hasRequiredItems) {
        return {
          score: (partialMatchCondition.score as number) || maxScore / 2,
          maxScore,
          isCorrect: false,
          partialCredit: true
        };
      }
    }
    
    // Finally, use else condition or default to 0
    const elseCondition = (logic.conditions as Record<string, unknown>[]).find((c: Record<string, unknown>) => c.else !== undefined);
    if (elseCondition) {
      return {
        score: elseCondition.else as number,
        maxScore,
        isCorrect: false
      };
    }
    
    return { score: 0, maxScore, isCorrect: false };
  }

  /**
   * Execute range-based scoring for sliders
   */
  private executeRangeScoring(
    logic: Record<string, unknown>,
    item: QTIItem,
    userResponse: ItemResponse,
    maxScore: number
  ): ScoreResult {
    const userValue = parseFloat(String(userResponse.value));
    
    if (isNaN(userValue) || !logic.score_ranges) {
      return { score: 0, maxScore, isCorrect: false };
    }
    
    for (const range of logic.score_ranges) {
      if (range.condition === 'exact' && userValue === range.value) {
        return {
          score: range.score,
          maxScore,
          isCorrect: true,
          partialCredit: false
        };
      } else if (range.condition === 'range' && userValue >= range.min && userValue <= range.max) {
        return {
          score: range.score,
          maxScore,
          isCorrect: range.score === maxScore,
          partialCredit: range.score > 0 && range.score < maxScore
        };
      }
    }
    
    // Default case
    const defaultRange = logic.score_ranges.find((r: Record<string, unknown>) => r.condition === 'default');
    return {
      score: defaultRange?.score || 0,
      maxScore,
      isCorrect: false
    };
  }

  /**
   * Execute string matching logic
   */
  private executeStringMatch(
    logic: Record<string, unknown>,
    item: QTIItem,
    userResponse: ItemResponse,
    maxScore: number
  ): ScoreResult {
    const userValue = String(userResponse.value).trim();
    const acceptableValues = logic.acceptable_values || [item.correctResponse];
    const caseSensitive = logic.caseSensitive !== false; // Default to true
    
    for (const acceptable of acceptableValues) {
      const acceptableStr = String(acceptable);
      const matches = caseSensitive ? 
        userValue === acceptableStr : 
        userValue.toLowerCase() === acceptableStr.toLowerCase();
      
      if (matches) {
        return {
          score: logic.score || maxScore,
          maxScore,
          isCorrect: true,
          partialCredit: false
        };
      }
    }
    
    return { score: 0, maxScore, isCorrect: false };
  }

  /**
   * Execute length-based scoring for essays
   */
  private executeLengthBasedScoring(
    logic: Record<string, unknown>,
    item: QTIItem,
    userResponse: ItemResponse,
    maxScore: number
  ): ScoreResult {
    const userText = String(userResponse.value).trim();
    const wordCount = userText.split(/\s+/).filter(word => word.length > 0).length;
    
    if (!logic.score_ranges) {
      return { score: 0, maxScore, isCorrect: false };
    }
    
    for (const range of logic.score_ranges) {
      if (range.condition === 'length_gte' && wordCount >= range.value) {
        return {
          score: range.score,
          maxScore,
          isCorrect: range.score === maxScore,
          partialCredit: range.score > 0 && range.score < maxScore
        };
      }
    }
    
    // Default case
    const defaultRange = logic.score_ranges.find((r: Record<string, unknown>) => r.condition === 'default');
    return {
      score: defaultRange?.score || 0,
      maxScore,
      isCorrect: false
    };
  }

  /**
   * Execute template-based response processing
   */
  private executeTemplate(
    template: ResponseProcessingTemplate,
    item: QTIItem,
    userResponse: ItemResponse
  ): ScoreResult {
    switch (template) {
      case 'match_correct':
        return this.executeMatchCorrect(item, userResponse);
      case 'map_response':
        return this.executeMapResponse(item, userResponse);
      case 'match_none':
        return this.executeMatchNone(item, userResponse);
      case 'match_correct_multiple':
        return this.executeMatchCorrectMultiple(item, userResponse);
      default:
        console.warn(`Unknown template: ${template}, falling back to match_correct`);
        return this.executeMatchCorrect(item, userResponse);
    }
  }

  /**
   * Execute match_correct template
   */
  private executeMatchCorrect(item: QTIItem, userResponse: ItemResponse): ScoreResult {
    const maxScore = this.getMaxScore(item);
    const correctResponse = item.correctResponse;
    
    if (!correctResponse) {
      return {
        score: 0,
        maxScore,
        isCorrect: false
      };
    }

    const isCorrect = this.compareResponses(userResponse.value, correctResponse);
    
    return {
      score: isCorrect ? maxScore : 0,
      maxScore,
      isCorrect,
      partialCredit: false
    };
  }

  /**
   * Execute map_response template (partial credit)
   */
  private executeMapResponse(item: QTIItem, userResponse: ItemResponse): ScoreResult {
    const maxScore = this.getMaxScore(item);
    
    // Check if item has mapping information
    if (item.mapping) {
      const mappedScore = this.getMappedScore(item.mapping, userResponse.value);
      const clampedScore = Math.max(0, Math.min(maxScore, mappedScore));
      
      return {
        score: clampedScore,
        maxScore,
        isCorrect: clampedScore === maxScore,
        partialCredit: clampedScore > 0 && clampedScore < maxScore
      };
    }
    
    // Fall back to match_correct if no mapping
    return this.executeMatchCorrect(item, userResponse);
  }

  /**
   * Execute match_none template (no scoring)
   */
  private executeMatchNone(item: QTIItem, userResponse: ItemResponse): ScoreResult {
    return {
      score: 0,
      maxScore: 0,
      isCorrect: undefined
    };
  }

  /**
   * Execute match_correct_multiple template (for multiple response items)
   */
  private executeMatchCorrectMultiple(item: QTIItem, userResponse: ItemResponse): ScoreResult {
    const maxScore = this.getMaxScore(item);
    const correctResponse = item.correctResponse;
    
    if (!correctResponse || !Array.isArray(userResponse.value)) {
      return {
        score: 0,
        maxScore,
        isCorrect: false
      };
    }

    const isCorrect = this.compareMultipleResponses(
      userResponse.value as string[], 
      correctResponse as string[]
    );
    
    return {
      score: isCorrect ? maxScore : 0,
      maxScore,
      isCorrect,
      partialCredit: false
    };
  }

  /**
   * Compare user response with correct response
   */
  private compareResponses(userValue: unknown, correctValue: unknown): boolean {
    if (Array.isArray(correctValue)) {
      return Array.isArray(userValue) && 
             this.compareMultipleResponses(userValue, correctValue);
    }
    
    return String(userValue).toLowerCase().trim() === String(correctValue).toLowerCase().trim();
  }

  /**
   * Compare multiple responses (for multiple choice/select all)
   */
  private compareMultipleResponses(userValues: string[], correctValues: string[]): boolean {
    // Filter out empty or null values
    const filteredUserValues = userValues.filter(v => v && String(v).trim());
    const filteredCorrectValues = correctValues.filter(v => v && String(v).trim());
    
    if (filteredUserValues.length !== filteredCorrectValues.length) {
      return false;
    }
    
    const normalizedUser = filteredUserValues.map(v => String(v).toLowerCase().trim()).sort();
    const normalizedCorrect = filteredCorrectValues.map(v => String(v).toLowerCase().trim()).sort();
    
    return normalizedUser.every((value, index) => value === normalizedCorrect[index]);
  }

  /**
   * Get mapped score from response mapping
   */
  private getMappedScore(mapping: Record<string, number>, userValue: unknown): number {
    if (Array.isArray(userValue)) {
      return userValue.reduce((total, value) => {
        return total + (mapping[value] || 0);
      }, 0);
    }
    
    return mapping[String(userValue)] || 0;
  }

  /**
   * Get maximum score for an item
   */
  private getMaxScore(item: QTIItem): number {
    // Check if item has explicit max score
    if (item.maxScore !== undefined) {
      return item.maxScore;
    }
    
    // For mapped responses, sum all positive values
    if (item.mapping) {
      const positiveValues = Object.values(item.mapping).filter(v => v > 0);
      return positiveValues.length > 0 ? Math.max(...positiveValues) : 1;
    }
    
    // Default to 1 point
    return 1;
  }

  /**
   * Check if item requires manual scoring
   */
  private requiresManualScoring(item: QTIItem): boolean {
    // Extended text interactions typically require manual scoring
    if (item.interactionType === 'extendedText') {
      return true;
    }
    
    // Items without correct responses need manual scoring
    if (!item.correctResponse) {
      return true;
    }
    
    // Items with custom response processing might need manual scoring
    if (item.responseProcessing && !item.responseProcessing.template) {
      return true;
    }
    
    return false;
  }
}