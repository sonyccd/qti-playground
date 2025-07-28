// Simple test to verify scoring system integration
import { ScoringEngine } from './ScoringEngine';
import { QTIItem } from '../types/qti';
import { ItemResponse } from './types';

export function testScoring() {
  console.log('🧮 Testing QTI Real-time Scoring System');
  
  const scoringEngine = ScoringEngine.getInstance();
  
  // Test item with multiple choice
  const testItem: QTIItem = {
    id: 'test-item-1',
    identifier: 'test-item-1',
    title: 'Test Multiple Choice',
    type: 'choice',
    interactionType: 'choice',
    prompt: 'What is 2 + 2?',
    choices: [
      { identifier: 'A', text: '3' },
      { identifier: 'B', text: '4' },
      { identifier: 'C', text: '5' },
      { identifier: 'D', text: '6' }
    ],
    correctResponse: 'B',
    responseIdentifier: 'RESPONSE',
    maxScore: 1,
    responseProcessing: {
      template: 'http://www.imsglobal.org/question/qti_v3p0/rptemplates/match_correct'
    }
  };

  // Test correct response
  const correctResponse: ItemResponse = {
    itemId: 'test-item-1',
    responseId: 'RESPONSE',
    value: 'B',
    timestamp: Date.now()
  };

  // Test incorrect response
  const incorrectResponse: ItemResponse = {
    itemId: 'test-item-1',
    responseId: 'RESPONSE',
    value: 'A',
    timestamp: Date.now()
  };

  // Test scoring
  console.log('Testing correct response:');
  const correctScore = scoringEngine.calculateItemScore(testItem, correctResponse);
  console.log('✅ Correct response score:', correctScore);
  
  console.log('\nTesting incorrect response:');
  const incorrectScore = scoringEngine.calculateItemScore(testItem, incorrectResponse);
  console.log('❌ Incorrect response score:', incorrectScore);

  // Test multiple items
  console.log('\nTesting total score calculation:');
  const totalScore = scoringEngine.calculateTotalScore([correctScore, incorrectScore]);
  console.log('📊 Total score:', totalScore);

  return {
    correctScore,
    incorrectScore,
    totalScore
  };
}

// Run test if this file is executed directly
if (typeof window !== 'undefined') {
  (window as unknown as { testScoring: typeof testScoring }).testScoring = testScoring;
}