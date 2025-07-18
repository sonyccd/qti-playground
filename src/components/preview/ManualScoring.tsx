import React, { useState } from 'react';
import { ItemScore } from '../../scoring/types';

interface ManualScoringProps {
  itemScore: ItemScore;
  userResponse: string;
  onScoreUpdate: (itemId: string, score: number, feedback?: string) => void;
  disabled?: boolean;
}

export const ManualScoring: React.FC<ManualScoringProps> = ({
  itemScore,
  userResponse,
  onScoreUpdate,
  disabled = false
}) => {
  const [manualScore, setManualScore] = useState(itemScore.score);
  const [feedback, setFeedback] = useState(itemScore.feedback || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    const clampedScore = Math.max(0, Math.min(itemScore.maxScore, manualScore));
    onScoreUpdate(itemScore.itemId, clampedScore, feedback);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setManualScore(itemScore.score);
    setFeedback(itemScore.feedback || '');
    setIsEditing(false);
  };

  const getScorePercentage = () => {
    if (itemScore.maxScore === 0) return 0;
    return Math.round((manualScore / itemScore.maxScore) * 100);
  };

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-amber-600 text-lg">📝</span>
          <h4 className="font-semibold text-amber-800">Manual Scoring Required</h4>
        </div>
        {!isEditing && !disabled && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-amber-600 hover:text-amber-800 text-sm underline"
          >
            Edit Score
          </button>
        )}
      </div>

      {/* User Response Display */}
      <div className="mb-4">
        <h5 className="font-medium text-gray-700 mb-2">Student Response:</h5>
        <div className="bg-white p-3 rounded border border-gray-200 max-h-40 overflow-y-auto">
          <p className="text-gray-800 whitespace-pre-wrap">
            {userResponse || <em className="text-gray-500">No response provided</em>}
          </p>
        </div>
      </div>

      {/* Scoring Interface */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Score Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Score (0-{itemScore.maxScore})
          </label>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max={itemScore.maxScore}
                step="0.1"
                value={manualScore}
                onChange={(e) => setManualScore(Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-gray-600">/ {itemScore.maxScore}</span>
              <span className="text-sm text-gray-500">({getScorePercentage()}%)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-800">
                {itemScore.score} / {itemScore.maxScore}
              </span>
              <span className="text-sm text-gray-500">
                ({Math.round((itemScore.score / itemScore.maxScore) * 100)}%)
              </span>
            </div>
          )}
        </div>

        {/* Quick Score Buttons */}
        {isEditing && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quick Score
            </label>
            <div className="flex gap-1">
              <button
                onClick={() => setManualScore(0)}
                className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
              >
                0
              </button>
              <button
                onClick={() => setManualScore(itemScore.maxScore * 0.5)}
                className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200"
              >
                50%
              </button>
              <button
                onClick={() => setManualScore(itemScore.maxScore * 0.75)}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
              >
                75%
              </button>
              <button
                onClick={() => setManualScore(itemScore.maxScore)}
                className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
              >
                100%
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Feedback */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Feedback (Optional)
        </label>
        {isEditing ? (
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Provide feedback to the student..."
          />
        ) : (
          <div className="bg-gray-50 p-3 rounded border border-gray-200 min-h-[80px]">
            {feedback ? (
              <p className="text-gray-800">{feedback}</p>
            ) : (
              <em className="text-gray-500">No feedback provided</em>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            Save Score
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

interface ManualScoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemScores: ItemScore[];
  userResponses: Record<string, string>;
  onScoreUpdate: (itemId: string, score: number, feedback?: string) => void;
}

export const ManualScoringModal: React.FC<ManualScoringModalProps> = ({
  isOpen,
  onClose,
  itemScores,
  userResponses,
  onScoreUpdate
}) => {
  const manualScoringItems = itemScores.filter(score => score.requiresManualScoring);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manual Scoring</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {manualScoringItems.map((itemScore) => (
            <div key={itemScore.itemId} className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-3">
                Item: {itemScore.itemId}
              </h3>
              <ManualScoring
                itemScore={itemScore}
                userResponse={userResponses[itemScore.itemId] || ''}
                onScoreUpdate={onScoreUpdate}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};