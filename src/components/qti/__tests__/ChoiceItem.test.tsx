import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChoiceItem } from '../ChoiceItem';
import { QTIItem } from '@/types/qti';

// Mock the UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardHeader: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardTitle: ({ children, className }: any) => <h2 className={className}>{children}</h2>
}));

vi.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({ id, checked, onCheckedChange, className }: any) => (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className={className}
      data-testid={`checkbox-${id}`}
    />
  )
}));

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor, className }: any) => (
    <label htmlFor={htmlFor} className={className}>{children}</label>
  )
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, size, className }: any) => (
    <button onClick={onClick} className={`button ${variant} ${size} ${className}`}>
      {children}
    </button>
  )
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: any) => (
    <span className={`badge ${variant} ${className}`}>{children}</span>
  )
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Edit3: () => <span data-testid="edit-icon">Edit</span>,
  Save: () => <span data-testid="save-icon">Save</span>,
  X: () => <span data-testid="x-icon">X</span>
}));

describe('ChoiceItem', () => {
  const mockSingleChoiceItem: QTIItem = {
    id: 'choice-item-1',
    title: 'Multiple Choice Question',
    type: 'choice',
    prompt: 'What is the capital of France?',
    correctResponse: 'choice_b',
    choices: [
      { identifier: 'choice_a', text: 'London' },
      { identifier: 'choice_b', text: 'Paris' },
      { identifier: 'choice_c', text: 'Berlin' },
      { identifier: 'choice_d', text: 'Madrid' }
    ]
  };

  const mockMultipleResponseItem: QTIItem = {
    id: 'multi-item-1',
    title: 'Multiple Response Question',
    type: 'multipleResponse',
    prompt: 'Which are programming languages?',
    correctResponse: ['choice_a', 'choice_c'],
    choices: [
      { identifier: 'choice_a', text: 'Python' },
      { identifier: 'choice_b', text: 'HTML' },
      { identifier: 'choice_c', text: 'JavaScript' },
      { identifier: 'choice_d', text: 'CSS' }
    ]
  };

  const mockOnCorrectResponseChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Single Choice (Multiple Choice)', () => {
    it('should render single choice item with title and prompt', () => {
      render(<ChoiceItem item={mockSingleChoiceItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Multiple Choice Question')).toBeInTheDocument();
      expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
    });

    it('should render all choices', () => {
      render(<ChoiceItem item={mockSingleChoiceItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('London')).toBeInTheDocument();
      expect(screen.getByText('Paris')).toBeInTheDocument();
      expect(screen.getByText('Berlin')).toBeInTheDocument();
      expect(screen.getByText('Madrid')).toBeInTheDocument();
    });

    it('should show correct answer with green styling', () => {
      render(<ChoiceItem item={mockSingleChoiceItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const parisChoice = screen.getByText('Paris').closest('div');
      expect(parisChoice).toHaveClass('bg-green-50', 'border-green-200');
      
      const londonChoice = screen.getByText('London').closest('div');
      expect(londonChoice).not.toHaveClass('bg-green-50');
    });

    it('should display correct answers count', () => {
      render(<ChoiceItem item={mockSingleChoiceItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('1 correct')).toBeInTheDocument();
    });

    it('should allow single selection only', async () => {
      const user = userEvent.setup();
      render(<ChoiceItem item={mockSingleChoiceItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const londonCheckbox = screen.getByTestId('checkbox-choice_a');
      const berlinCheckbox = screen.getByTestId('checkbox-choice_c');
      
      await user.click(londonCheckbox);
      expect(londonCheckbox).toBeChecked();
      
      await user.click(berlinCheckbox);
      expect(berlinCheckbox).toBeChecked();
      expect(londonCheckbox).not.toBeChecked(); // Should be deselected
    });

    it('should show correct instruction text', () => {
      render(<ChoiceItem item={mockSingleChoiceItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Select one option')).toBeInTheDocument();
    });
  });

  describe('Multiple Response', () => {
    it('should render multiple response item', () => {
      render(<ChoiceItem item={mockMultipleResponseItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Multiple Response Question')).toBeInTheDocument();
      expect(screen.getByText('Which are programming languages?')).toBeInTheDocument();
    });

    it('should show multiple correct answers', () => {
      render(<ChoiceItem item={mockMultipleResponseItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('2 correct')).toBeInTheDocument();
      
      const pythonChoice = screen.getByText('Python').closest('div');
      const jsChoice = screen.getByText('JavaScript').closest('div');
      
      expect(pythonChoice).toHaveClass('bg-green-50', 'border-green-200');
      expect(jsChoice).toHaveClass('bg-green-50', 'border-green-200');
    });

    it('should allow multiple selections', async () => {
      const user = userEvent.setup();
      render(<ChoiceItem item={mockMultipleResponseItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const pythonCheckbox = screen.getByTestId('checkbox-choice_a');
      const htmlCheckbox = screen.getByTestId('checkbox-choice_b');
      const jsCheckbox = screen.getByTestId('checkbox-choice_c');
      
      await user.click(pythonCheckbox);
      await user.click(htmlCheckbox);
      await user.click(jsCheckbox);
      
      expect(pythonCheckbox).toBeChecked();
      expect(htmlCheckbox).toBeChecked();
      expect(jsCheckbox).toBeChecked();
    });

    it('should show correct instruction text for multiple response', () => {
      render(<ChoiceItem item={mockMultipleResponseItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Select one or more options')).toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    it('should enter edit mode when Set Correct button is clicked', async () => {
      const user = userEvent.setup();
      render(<ChoiceItem item={mockSingleChoiceItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      expect(screen.getByText('Select the correct answer above')).toBeInTheDocument();
      expect(screen.getByTestId('save-icon')).toBeInTheDocument();
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();
      
      // Should show editing checkboxes
      expect(screen.getAllByText('Mark as correct answer')).toHaveLength(4);
    });

    it('should show different instruction for multiple response in edit mode', async () => {
      const user = userEvent.setup();
      render(<ChoiceItem item={mockMultipleResponseItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      expect(screen.getByText('Select the correct answers above')).toBeInTheDocument();
    });

    it('should pre-select current correct answers in edit mode', async () => {
      const user = userEvent.setup();
      render(<ChoiceItem item={mockSingleChoiceItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      const correctCheckbox = screen.getByTestId('checkbox-correct-choice_b');
      expect(correctCheckbox).toBeChecked();
      
      const incorrectCheckbox = screen.getByTestId('checkbox-correct-choice_a');
      expect(incorrectCheckbox).not.toBeChecked();
    });

    it('should allow changing correct answers in single choice mode', async () => {
      const user = userEvent.setup();
      render(<ChoiceItem item={mockSingleChoiceItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      const londonCorrectCheckbox = screen.getByTestId('checkbox-correct-choice_a');
      await user.click(londonCorrectCheckbox);
      
      expect(londonCorrectCheckbox).toBeChecked();
      
      // Previous correct answer should be deselected
      const parisCorrectCheckbox = screen.getByTestId('checkbox-correct-choice_b');
      expect(parisCorrectCheckbox).not.toBeChecked();
    });

    it('should allow changing correct answers in multiple response mode', async () => {
      const user = userEvent.setup();
      render(<ChoiceItem item={mockMultipleResponseItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      // Add HTML as correct
      const htmlCorrectCheckbox = screen.getByTestId('checkbox-correct-choice_b');
      await user.click(htmlCorrectCheckbox);
      
      expect(htmlCorrectCheckbox).toBeChecked();
      
      // Previous correct answers should still be selected
      const pythonCorrectCheckbox = screen.getByTestId('checkbox-correct-choice_a');
      const jsCorrectCheckbox = screen.getByTestId('checkbox-correct-choice_c');
      expect(pythonCorrectCheckbox).toBeChecked();
      expect(jsCorrectCheckbox).toBeChecked();
    });

    it('should save changes when save button is clicked', async () => {
      const user = userEvent.setup();
      render(<ChoiceItem item={mockSingleChoiceItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      const londonCorrectCheckbox = screen.getByTestId('checkbox-correct-choice_a');
      await user.click(londonCorrectCheckbox);
      
      const saveButton = screen.getByTestId('save-icon').closest('button')!;
      await user.click(saveButton);
      
      expect(mockOnCorrectResponseChange).toHaveBeenCalledWith('choice-item-1', 'choice_a');
      expect(screen.getByText('Set Correct')).toBeInTheDocument(); // Should exit edit mode
    });

    it('should save multiple correct answers for multiple response', async () => {
      const user = userEvent.setup();
      render(<ChoiceItem item={mockMultipleResponseItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      // Add HTML as correct
      const htmlCorrectCheckbox = screen.getByTestId('checkbox-correct-choice_b');
      await user.click(htmlCorrectCheckbox);
      
      const saveButton = screen.getByTestId('save-icon').closest('button')!;
      await user.click(saveButton);
      
      expect(mockOnCorrectResponseChange).toHaveBeenCalledWith('multi-item-1', ['choice_a', 'choice_c', 'choice_b']);
    });

    it('should cancel changes when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<ChoiceItem item={mockSingleChoiceItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      const londonCorrectCheckbox = screen.getByTestId('checkbox-correct-choice_a');
      await user.click(londonCorrectCheckbox);
      
      const cancelButton = screen.getByTestId('x-icon').closest('button')!;
      await user.click(cancelButton);
      
      expect(mockOnCorrectResponseChange).not.toHaveBeenCalled();
      expect(screen.getByText('Set Correct')).toBeInTheDocument(); // Should exit edit mode
      expect(screen.getByText('1 correct')).toBeInTheDocument(); // Should maintain original count
    });
  });

  describe('Edge Cases', () => {
    it('should handle item with no choices', () => {
      const itemWithoutChoices = {
        ...mockSingleChoiceItem,
        choices: undefined
      };
      
      render(<ChoiceItem item={itemWithoutChoices} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Multiple Choice Question')).toBeInTheDocument();
      expect(screen.getByText('Set Correct')).toBeInTheDocument();
    });

    it('should handle item with empty choices array', () => {
      const itemWithEmptyChoices = {
        ...mockSingleChoiceItem,
        choices: []
      };
      
      render(<ChoiceItem item={itemWithEmptyChoices} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Multiple Choice Question')).toBeInTheDocument();
      expect(screen.getByText('Select one option')).toBeInTheDocument();
    });

    it('should handle item with no correct response', () => {
      const itemWithoutCorrect = {
        ...mockSingleChoiceItem,
        correctResponse: undefined
      };
      
      render(<ChoiceItem item={itemWithoutCorrect} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.queryByText(/correct/)).not.toBeInTheDocument();
      expect(screen.getByText('Set Correct')).toBeInTheDocument();
    });

    it('should handle item with empty string correct response', () => {
      const itemWithEmptyCorrect = {
        ...mockSingleChoiceItem,
        correctResponse: ''
      };
      
      render(<ChoiceItem item={itemWithEmptyCorrect} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.queryByText(/correct/)).not.toBeInTheDocument();
    });

    it('should handle item with array correct response for single choice', () => {
      const itemWithArrayCorrect = {
        ...mockSingleChoiceItem,
        correctResponse: ['choice_b', 'choice_c'] // Multiple answers for single choice
      };
      
      render(<ChoiceItem item={itemWithArrayCorrect} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('2 correct')).toBeInTheDocument();
    });

    it('should handle item without prompt', () => {
      const itemWithoutPrompt = {
        ...mockSingleChoiceItem,
        prompt: undefined
      };
      
      render(<ChoiceItem item={itemWithoutPrompt} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Multiple Choice Question')).toBeInTheDocument();
      expect(screen.getByText('London')).toBeInTheDocument();
    });

    it('should not call onCorrectResponseChange when not provided', async () => {
      const user = userEvent.setup();
      render(<ChoiceItem item={mockSingleChoiceItem} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      const saveButton = screen.getByTestId('save-icon').closest('button')!;
      await user.click(saveButton);
      
      // Should not throw error when callback is not provided
      expect(screen.getByText('Set Correct')).toBeInTheDocument();
    });

    it('should handle saving with no selections in single choice', async () => {
      const itemWithoutCorrect = {
        ...mockSingleChoiceItem,
        correctResponse: undefined
      };
      
      const user = userEvent.setup();
      render(<ChoiceItem item={itemWithoutCorrect} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      const saveButton = screen.getByTestId('save-icon').closest('button')!;
      await user.click(saveButton);
      
      expect(mockOnCorrectResponseChange).toHaveBeenCalledWith('choice-item-1', '');
    });

    it('should handle saving with no selections in multiple response', async () => {
      const itemWithoutCorrect = {
        ...mockMultipleResponseItem,
        correctResponse: []
      };
      
      const user = userEvent.setup();
      render(<ChoiceItem item={itemWithoutCorrect} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      const saveButton = screen.getByTestId('save-icon').closest('button')!;
      await user.click(saveButton);
      
      expect(mockOnCorrectResponseChange).toHaveBeenCalledWith('multi-item-1', []);
    });

    it('should toggle choice selection correctly', async () => {
      const user = userEvent.setup();
      render(<ChoiceItem item={mockSingleChoiceItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const londonCheckbox = screen.getByTestId('checkbox-choice_a');
      
      // First click - select
      await user.click(londonCheckbox);
      expect(londonCheckbox).toBeChecked();
      
      // Second click - deselect
      await user.click(londonCheckbox);
      expect(londonCheckbox).not.toBeChecked();
    });

    it('should handle deselecting in multiple response', async () => {
      const user = userEvent.setup();
      render(<ChoiceItem item={mockMultipleResponseItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const pythonCheckbox = screen.getByTestId('checkbox-choice_a');
      const htmlCheckbox = screen.getByTestId('checkbox-choice_b');
      
      await user.click(pythonCheckbox);
      await user.click(htmlCheckbox);
      
      expect(pythonCheckbox).toBeChecked();
      expect(htmlCheckbox).toBeChecked();
      
      // Deselect python
      await user.click(pythonCheckbox);
      expect(pythonCheckbox).not.toBeChecked();
      expect(htmlCheckbox).toBeChecked(); // Should remain checked
    });
  });
});