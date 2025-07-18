import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextEntryItem } from '../TextEntryItem';
import { QTIItem } from '@/types/qti';

// Mock the UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardHeader: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardTitle: ({ children, className }: any) => <h2 className={className}>{children}</h2>
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({ id, type, placeholder, value, onChange, className }: any) => (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
      data-testid={`input-${id}`}
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

describe('TextEntryItem', () => {
  const mockTextEntryItem: QTIItem = {
    id: 'text-entry-1',
    title: 'Text Entry Question',
    type: 'textEntry',
    prompt: 'What is the chemical symbol for gold?',
    correctResponse: 'Au'
  };

  const mockOnCorrectResponseChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render text entry item with title and prompt', () => {
      render(<TextEntryItem item={mockTextEntryItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Text Entry Question')).toBeInTheDocument();
      expect(screen.getByText('What is the chemical symbol for gold?')).toBeInTheDocument();
    });

    it('should render user response input field', () => {
      render(<TextEntryItem item={mockTextEntryItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const input = screen.getByTestId('input-text-entry-text-entry-1');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'Type your answer here...');
    });

    it('should render correct response label', () => {
      render(<TextEntryItem item={mockTextEntryItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Your response:')).toBeInTheDocument();
    });

    it('should show "Answer set" badge when correct response exists', () => {
      render(<TextEntryItem item={mockTextEntryItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Answer set')).toBeInTheDocument();
    });

    it('should show instruction text', () => {
      render(<TextEntryItem item={mockTextEntryItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Type your answer in the text field')).toBeInTheDocument();
    });
  });

  describe('User Input Functionality', () => {
    it('should accept user input', async () => {
      const user = userEvent.setup();
      render(<TextEntryItem item={mockTextEntryItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const input = screen.getByTestId('input-text-entry-text-entry-1');
      await user.type(input, 'Au');
      
      expect(input).toHaveValue('Au');
    });

    it('should show correct response indicator when answer is correct', async () => {
      const user = userEvent.setup();
      render(<TextEntryItem item={mockTextEntryItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const input = screen.getByTestId('input-text-entry-text-entry-1');
      await user.type(input, 'Au');
      
      expect(screen.getByText('✓')).toBeInTheDocument();
      expect(input).toHaveClass('border-green-500', 'bg-green-50');
    });

    it('should handle case-insensitive comparison', async () => {
      const user = userEvent.setup();
      render(<TextEntryItem item={mockTextEntryItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const input = screen.getByTestId('input-text-entry-text-entry-1');
      await user.type(input, 'au');
      
      expect(screen.getByText('✓')).toBeInTheDocument();
      expect(input).toHaveClass('border-green-500', 'bg-green-50');
    });

    it('should handle whitespace trimming', async () => {
      const user = userEvent.setup();
      render(<TextEntryItem item={mockTextEntryItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const input = screen.getByTestId('input-text-entry-text-entry-1');
      await user.type(input, '  Au  ');
      
      expect(screen.getByText('✓')).toBeInTheDocument();
      expect(input).toHaveClass('border-green-500', 'bg-green-50');
    });

    it('should not show correct indicator for wrong answer', async () => {
      const user = userEvent.setup();
      render(<TextEntryItem item={mockTextEntryItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const input = screen.getByTestId('input-text-entry-text-entry-1');
      await user.type(input, 'Ag');
      
      expect(screen.queryByText('✓')).not.toBeInTheDocument();
      expect(input).not.toHaveClass('border-green-500', 'bg-green-50');
    });
  });

  describe('Edit Mode Functionality', () => {
    it('should enter edit mode when Set Correct button is clicked', async () => {
      const user = userEvent.setup();
      render(<TextEntryItem item={mockTextEntryItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      expect(screen.getByText('Set the correct answer:')).toBeInTheDocument();
      expect(screen.getByText('Enter the correct answer above')).toBeInTheDocument();
      expect(screen.getByTestId('save-icon')).toBeInTheDocument();
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    });

    it('should show correct answer input field in edit mode', async () => {
      const user = userEvent.setup();
      render(<TextEntryItem item={mockTextEntryItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      const correctAnswerInput = screen.getByPlaceholderText('Enter the correct answer...');
      expect(correctAnswerInput).toBeInTheDocument();
      expect(correctAnswerInput).toHaveValue('Au');
    });

    it('should save changes when save button is clicked', async () => {
      const user = userEvent.setup();
      render(<TextEntryItem item={mockTextEntryItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      const correctAnswerInput = screen.getByPlaceholderText('Enter the correct answer...');
      await user.clear(correctAnswerInput);
      await user.type(correctAnswerInput, 'Gold');
      
      const saveButton = screen.getByTestId('save-icon').closest('button')!;
      await user.click(saveButton);
      
      expect(mockOnCorrectResponseChange).toHaveBeenCalledWith('text-entry-1', 'Gold');
      expect(screen.getByText('Set Correct')).toBeInTheDocument(); // Should exit edit mode
    });

    it('should cancel changes when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<TextEntryItem item={mockTextEntryItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      const correctAnswerInput = screen.getByPlaceholderText('Enter the correct answer...');
      await user.clear(correctAnswerInput);
      await user.type(correctAnswerInput, 'Gold');
      
      const cancelButton = screen.getByTestId('x-icon').closest('button')!;
      await user.click(cancelButton);
      
      expect(mockOnCorrectResponseChange).not.toHaveBeenCalled();
      expect(screen.getByText('Set Correct')).toBeInTheDocument(); // Should exit edit mode
      
      // Should revert to original value when re-entering edit mode
      const editButtonAgain = screen.getByText('Set Correct');
      await user.click(editButtonAgain);
      const revertedInput = screen.getByPlaceholderText('Enter the correct answer...');
      expect(revertedInput).toHaveValue('Au');
    });

    it('should handle editing correct answer input', async () => {
      const user = userEvent.setup();
      render(<TextEntryItem item={mockTextEntryItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      const correctAnswerInput = screen.getByPlaceholderText('Enter the correct answer...');
      await user.clear(correctAnswerInput);
      await user.type(correctAnswerInput, 'Silver');
      
      expect(correctAnswerInput).toHaveValue('Silver');
    });
  });

  describe('Edge Cases', () => {
    it('should handle item without prompt', () => {
      const itemWithoutPrompt = {
        ...mockTextEntryItem,
        prompt: undefined
      };
      
      render(<TextEntryItem item={itemWithoutPrompt} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Text Entry Question')).toBeInTheDocument();
      expect(screen.getByTestId('input-text-entry-text-entry-1')).toBeInTheDocument();
    });

    it('should handle item without correct response', () => {
      const itemWithoutCorrect = {
        ...mockTextEntryItem,
        correctResponse: undefined
      };
      
      render(<TextEntryItem item={itemWithoutCorrect} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.queryByText('Answer set')).not.toBeInTheDocument();
      expect(screen.getByText('Set Correct')).toBeInTheDocument();
    });

    it('should handle empty string correct response', () => {
      const itemWithEmptyCorrect = {
        ...mockTextEntryItem,
        correctResponse: ''
      };
      
      render(<TextEntryItem item={itemWithEmptyCorrect} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.queryByText('Answer set')).not.toBeInTheDocument();
    });

    it('should handle non-string correct response', () => {
      const itemWithNonStringCorrect = {
        ...mockTextEntryItem,
        correctResponse: ['Au', 'Gold'] as any
      };
      
      render(<TextEntryItem item={itemWithNonStringCorrect} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.queryByText('Answer set')).not.toBeInTheDocument();
    });

    it('should not call onCorrectResponseChange when not provided', async () => {
      const user = userEvent.setup();
      render(<TextEntryItem item={mockTextEntryItem} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      const saveButton = screen.getByTestId('save-icon').closest('button')!;
      await user.click(saveButton);
      
      // Should not throw error when callback is not provided
      expect(screen.getByText('Set Correct')).toBeInTheDocument();
    });

    it('should handle saving empty correct answer', async () => {
      const user = userEvent.setup();
      render(<TextEntryItem item={mockTextEntryItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      const correctAnswerInput = screen.getByPlaceholderText('Enter the correct answer...');
      await user.clear(correctAnswerInput);
      
      const saveButton = screen.getByTestId('save-icon').closest('button')!;
      await user.click(saveButton);
      
      expect(mockOnCorrectResponseChange).toHaveBeenCalledWith('text-entry-1', '');
    });

    it('should correctly validate empty user input against empty correct answer', async () => {
      const itemWithEmptyCorrect = {
        ...mockTextEntryItem,
        correctResponse: ''
      };
      
      const user = userEvent.setup();
      render(<TextEntryItem item={itemWithEmptyCorrect} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const input = screen.getByTestId('input-text-entry-text-entry-1');
      
      // Empty input should match empty correct answer
      expect(screen.getByText('✓')).toBeInTheDocument();
      expect(input).toHaveClass('border-green-500', 'bg-green-50');
      
      // Non-empty input should not match empty correct answer
      await user.type(input, 'test');
      expect(screen.queryByText('✓')).not.toBeInTheDocument();
      expect(input).not.toHaveClass('border-green-500', 'bg-green-50');
    });
  });
});