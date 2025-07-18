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
      const responseProcessing = this.parseResponseProcessing(item);
      const scoreResult = this.executeResponseProcessing(
        responseProcessing, 
        item, 
        userResponse
      );

      return {
        itemId: item.identifier,
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
        itemId: item.identifier,
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
    if (item.responseProcessing?.template) {
      return {
        template: item.responseProcessing.template
      };
    }
    
    // For now, default to match_correct template
    return {
      template: 'match_correct'
    };
  }

  /**
   * Execute response processing logic
   */
  private executeResponseProcessing(
    rule: ResponseProcessingRule,
    item: QTIItem,
    userResponse: ItemResponse
  ): ScoreResult {
    if (rule.template) {
      return this.executeTemplate(rule.template as ResponseProcessingTemplate, item, userResponse);
    }
    
    // Handle custom logic (future implementation)
    return this.executeMatchCorrect(item, userResponse);
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
  private compareResponses(userValue: any, correctValue: any): boolean {
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
    if (userValues.length !== correctValues.length) {
      return false;
    }
    
    const normalizedUser = userValues.map(v => v.toLowerCase().trim()).sort();
    const normalizedCorrect = correctValues.map(v => v.toLowerCase().trim()).sort();
    
    return normalizedUser.every((value, index) => value === normalizedCorrect[index]);
  }

  /**
   * Get mapped score from response mapping
   */
  private getMappedScore(mapping: Record<string, number>, userValue: any): number {
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