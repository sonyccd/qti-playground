import React from 'react';
import { ItemScore } from '../../scoring/types';

interface ScoreDisplayProps {
  score: ItemScore;
  showDetails?: boolean;
  compact?: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  score, 
  showDetails = false, 
  compact = false 
}) => {
  const getScoreColor = () => {
    if (score.requiresManualScoring) return 'text-amber-600';
    if (score.isCorrect) return 'text-green-600';
    if (score.partialCredit) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = () => {
    if (score.requiresManualScoring) return '⏳';
    if (score.isCorrect) return '✓';
    if (score.partialCredit) return '◐';
    return '✗';
  };

  const getScoreLabel = () => {
    if (score.requiresManualScoring) return 'Manual Review';
    if (score.isCorrect) return 'Correct';
    if (score.partialCredit) return 'Partial Credit';
    return 'Incorrect';
  };

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1 text-sm ${getScoreColor()}`}>
        <span className="text-base">{getScoreIcon()}</span>
        <span>{score.score}/{score.maxScore}</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-3 border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getScoreIcon()}</span>
          <span className={`font-medium ${getScoreColor()}`}>
            {getScoreLabel()}
          </span>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${getScoreColor()}`}>
            {score.score}/{score.maxScore}
          </div>
          {score.maxScore > 0 && (
            <div className="text-sm text-gray-500">
              {Math.round((score.score / score.maxScore) * 100)}%
            </div>
          )}
        </div>
      </div>
      
      {showDetails && score.feedback && (
        <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
          {score.feedback}
        </div>
      )}
      
      {score.requiresManualScoring && (
        <div className="mt-2 text-sm text-amber-600">
          This item requires manual scoring by an instructor.
        </div>
      )}
    </div>
  );
};

interface TotalScoreDisplayProps {
  totalScore: number;
  maxTotalScore: number;
  correctItems: number;
  totalItems: number;
  percentageScore: number;
  requiresManualScoring: boolean;
}

export const TotalScoreDisplay: React.FC<TotalScoreDisplayProps> = ({
  totalScore,
  maxTotalScore,
  correctItems,
  totalItems,
  percentageScore,
  requiresManualScoring
}) => {
  const getGradeColor = () => {
    if (requiresManualScoring) return 'text-amber-600';
    if (percentageScore >= 90) return 'text-green-600';
    if (percentageScore >= 80) return 'text-blue-600';
    if (percentageScore >= 70) return 'text-yellow-600';
    if (percentageScore >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeLetter = () => {
    if (requiresManualScoring) return 'Pending';
    if (percentageScore >= 90) return 'A';
    if (percentageScore >= 80) return 'B';
    if (percentageScore >= 70) return 'C';
    if (percentageScore >= 60) return 'D';
    return 'F';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Total Score</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className={`text-3xl font-bold ${getGradeColor()}`}>
            {totalScore}/{maxTotalScore}
          </div>
          <div className="text-sm text-gray-600">Points</div>
        </div>
        
        <div className="text-center">
          <div className={`text-3xl font-bold ${getGradeColor()}`}>
            {requiresManualScoring ? 'Pending' : `${Math.round(percentageScore)}%`}
          </div>
          <div className="text-sm text-gray-600">
            {requiresManualScoring ? 'Manual Review' : 'Percentage'}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-800">
            {correctItems}/{totalItems}
          </div>
          <div className="text-sm text-gray-600">Items Correct</div>
        </div>
        
        <div className="text-center">
          <div className={`text-xl font-semibold ${getGradeColor()}`}>
            {getGradeLetter()}
          </div>
          <div className="text-sm text-gray-600">Grade</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            requiresManualScoring ? 'bg-amber-500' : 
            percentageScore >= 70 ? 'bg-green-500' : 
            percentageScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${Math.min(100, percentageScore)}%` }}
        />
      </div>
      
      {requiresManualScoring && (
        <div className="text-sm text-amber-600 text-center">
          <span className="mr-1">⏳</span>
          Some items require manual scoring. Final score pending instructor review.
        </div>
      )}
    </div>
  );
};