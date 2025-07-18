import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExtendedTextItem } from '../ExtendedTextItem';
import { QTIItem } from '@/types/qti';

// Mock the UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardHeader: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardTitle: ({ children, className }: any) => <h2 className={className}>{children}</h2>
}));

vi.mock('@/components/ui/textarea', () => ({
  Textarea: ({ id, placeholder, value, onChange, className }: any) => (
    <textarea
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
      data-testid={`textarea-${id}`}
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

describe('ExtendedTextItem', () => {
  const mockExtendedTextItem: QTIItem = {
    id: 'extended-text-1',
    title: 'Essay Question',
    type: 'extendedText',
    prompt: 'Explain the importance of renewable energy sources.',
    correctResponse: 'Renewable energy sources are important because they are sustainable, reduce greenhouse gas emissions, and help combat climate change.'
  };

  const mockOnCorrectResponseChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render extended text item with title and prompt', () => {
      render(<ExtendedTextItem item={mockExtendedTextItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Essay Question')).toBeInTheDocument();
      expect(screen.getByText('Explain the importance of renewable energy sources.')).toBeInTheDocument();
    });

    it('should render user response textarea', () => {
      render(<ExtendedTextItem item={mockExtendedTextItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const textarea = screen.getByTestId('textarea-extended-text-extended-text-1');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute('placeholder', 'Write your detailed response here...');
      expect(textarea).toHaveClass('min-h-[120px]', 'resize-vertical');
    });

    it('should render correct response label', () => {
      render(<ExtendedTextItem item={mockExtendedTextItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Your response:')).toBeInTheDocument();
    });

    it('should show "Sample set" badge when sample answer exists', () => {
      render(<ExtendedTextItem item={mockExtendedTextItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Sample set')).toBeInTheDocument();
    });

    it('should show instruction text', () => {
      render(<ExtendedTextItem item={mockExtendedTextItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Provide a detailed written response')).toBeInTheDocument();
    });

    it('should display sample answer when available', () => {
      render(<ExtendedTextItem item={mockExtendedTextItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Sample Answer:')).toBeInTheDocument();
      expect(screen.getByText('Renewable energy sources are important because they are sustainable, reduce greenhouse gas emissions, and help combat climate change.')).toBeInTheDocument();
    });
  });

  describe('User Input Functionality', () => {
    it('should accept user input', async () => {
      const user = userEvent.setup();
      render(<ExtendedTextItem item={mockExtendedTextItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const textarea = screen.getByTestId('textarea-extended-text-extended-text-1');
      await user.type(textarea, 'Renewable energy is crucial for our future...');
      
      expect(textarea).toHaveValue('Renewable energy is crucial for our future...');
    });

    it('should handle multiline text input', async () => {
      const user = userEvent.setup();
      render(<ExtendedTextItem item={mockExtendedTextItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const textarea = screen.getByTestId('textarea-extended-text-extended-text-1');
      const multilineText = 'Line 1\nLine 2\nLine 3';
      await user.type(textarea, multilineText);
      
      expect(textarea).toHaveValue(multilineText);
    });
  });

  describe('Edit Mode Functionality', () => {
    it('should enter edit mode when Set Sample button is clicked', async () => {
      const user = userEvent.setup();
      render(<ExtendedTextItem item={mockExtendedTextItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Sample');
      await user.click(editButton);
      
      expect(screen.getByText('Set a sample answer:')).toBeInTheDocument();
      expect(screen.getByText('Enter a sample answer above')).toBeInTheDocument();
      expect(screen.getByTestId('save-icon')).toBeInTheDocument();
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    });

    it('should show sample answer textarea in edit mode', async () => {
      const user = userEvent.setup();
      render(<ExtendedTextItem item={mockExtendedTextItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Sample');
      await user.click(editButton);
      
      const sampleAnswerTextarea = screen.getByPlaceholderText('Enter a sample correct response...');
      expect(sampleAnswerTextarea).toBeInTheDocument();
      expect(sampleAnswerTextarea).toHaveValue('Renewable energy sources are important because they are sustainable, reduce greenhouse gas emissions, and help combat climate change.');
      expect(sampleAnswerTextarea).toHaveClass('min-h-[100px]');
    });

    it('should hide sample answer display when in edit mode', async () => {
      const user = userEvent.setup();
      render(<ExtendedTextItem item={mockExtendedTextItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Sample Answer:')).toBeInTheDocument();
      
      const editButton = screen.getByText('Set Sample');
      await user.click(editButton);
      
      expect(screen.queryByText('Sample Answer:')).not.toBeInTheDocument();
    });

    it('should save changes when save button is clicked', async () => {
      const user = userEvent.setup();
      render(<ExtendedTextItem item={mockExtendedTextItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Sample');
      await user.click(editButton);
      
      const sampleAnswerTextarea = screen.getByPlaceholderText('Enter a sample correct response...');
      await user.clear(sampleAnswerTextarea);
      await user.type(sampleAnswerTextarea, 'Updated sample answer for renewable energy.');
      
      const saveButton = screen.getByTestId('save-icon').closest('button')!;
      await user.click(saveButton);
      
      expect(mockOnCorrectResponseChange).toHaveBeenCalledWith('extended-text-1', 'Updated sample answer for renewable energy.');
      expect(screen.getByText('Set Sample')).toBeInTheDocument(); // Should exit edit mode
    });

    it('should cancel changes when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<ExtendedTextItem item={mockExtendedTextItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Sample');
      await user.click(editButton);
      
      const sampleAnswerTextarea = screen.getByPlaceholderText('Enter a sample correct response...');
      await user.clear(sampleAnswerTextarea);
      await user.type(sampleAnswerTextarea, 'Changed sample answer');
      
      const cancelButton = screen.getByTestId('x-icon').closest('button')!;
      await user.click(cancelButton);
      
      expect(mockOnCorrectResponseChange).not.toHaveBeenCalled();
      expect(screen.getByText('Set Sample')).toBeInTheDocument(); // Should exit edit mode
      
      // Should revert to original value when re-entering edit mode
      const editButtonAgain = screen.getByText('Set Sample');
      await user.click(editButtonAgain);
      const revertedTextarea = screen.getByPlaceholderText('Enter a sample correct response...');
      expect(revertedTextarea).toHaveValue('Renewable energy sources are important because they are sustainable, reduce greenhouse gas emissions, and help combat climate change.');
    });

    it('should handle editing sample answer textarea', async () => {
      const user = userEvent.setup();
      render(<ExtendedTextItem item={mockExtendedTextItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Sample');
      await user.click(editButton);
      
      const sampleAnswerTextarea = screen.getByPlaceholderText('Enter a sample correct response...');
      await user.clear(sampleAnswerTextarea);
      await user.type(sampleAnswerTextarea, 'New sample answer with multiple lines\nLine 2\nLine 3');
      
      expect(sampleAnswerTextarea).toHaveValue('New sample answer with multiple lines\nLine 2\nLine 3');
    });

    it('should preserve whitespace in sample answer display', () => {
      const itemWithWhitespace = {
        ...mockExtendedTextItem,
        correctResponse: 'Sample answer\nwith line breaks\n\nand extra spacing'
      };
      
      render(<ExtendedTextItem item={itemWithWhitespace} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      // Use a custom matcher to find the element containing the text
      const sampleDisplay = screen.getByText((content, element) => {
        return element?.textContent === 'Sample answer\nwith line breaks\n\nand extra spacing';
      });
      expect(sampleDisplay).toHaveClass('whitespace-pre-wrap');
    });
  });

  describe('Edge Cases', () => {
    it('should handle item without prompt', () => {
      const itemWithoutPrompt = {
        ...mockExtendedTextItem,
        prompt: undefined
      };
      
      render(<ExtendedTextItem item={itemWithoutPrompt} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Essay Question')).toBeInTheDocument();
      expect(screen.getByTestId('textarea-extended-text-extended-text-1')).toBeInTheDocument();
    });

    it('should handle item without sample answer', () => {
      const itemWithoutSample = {
        ...mockExtendedTextItem,
        correctResponse: undefined
      };
      
      render(<ExtendedTextItem item={itemWithoutSample} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.queryByText('Sample set')).not.toBeInTheDocument();
      expect(screen.queryByText('Sample Answer:')).not.toBeInTheDocument();
      expect(screen.getByText('Set Sample')).toBeInTheDocument();
    });

    it('should handle empty string sample answer', () => {
      const itemWithEmptySample = {
        ...mockExtendedTextItem,
        correctResponse: ''
      };
      
      render(<ExtendedTextItem item={itemWithEmptySample} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.queryByText('Sample set')).not.toBeInTheDocument();
      expect(screen.queryByText('Sample Answer:')).not.toBeInTheDocument();
    });

    it('should handle non-string sample answer', () => {
      const itemWithNonStringSample = {
        ...mockExtendedTextItem,
        correctResponse: ['Sample 1', 'Sample 2'] as any
      };
      
      render(<ExtendedTextItem item={itemWithNonStringSample} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.queryByText('Sample set')).not.toBeInTheDocument();
      expect(screen.queryByText('Sample Answer:')).not.toBeInTheDocument();
    });

    it('should not call onCorrectResponseChange when not provided', async () => {
      const user = userEvent.setup();
      render(<ExtendedTextItem item={mockExtendedTextItem} />);
      
      const editButton = screen.getByText('Set Sample');
      await user.click(editButton);
      
      const saveButton = screen.getByTestId('save-icon').closest('button')!;
      await user.click(saveButton);
      
      // Should not throw error when callback is not provided
      expect(screen.getByText('Set Sample')).toBeInTheDocument();
    });

    it('should handle saving empty sample answer', async () => {
      const user = userEvent.setup();
      render(<ExtendedTextItem item={mockExtendedTextItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Sample');
      await user.click(editButton);
      
      const sampleAnswerTextarea = screen.getByPlaceholderText('Enter a sample correct response...');
      await user.clear(sampleAnswerTextarea);
      
      const saveButton = screen.getByTestId('save-icon').closest('button')!;
      await user.click(saveButton);
      
      expect(mockOnCorrectResponseChange).toHaveBeenCalledWith('extended-text-1', '');
    });

    it('should not show sample answer display when sample is empty after editing', async () => {
      const user = userEvent.setup();
      render(<ExtendedTextItem item={mockExtendedTextItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Sample');
      await user.click(editButton);
      
      const sampleAnswerTextarea = screen.getByPlaceholderText('Enter a sample correct response...');
      await user.clear(sampleAnswerTextarea);
      
      const saveButton = screen.getByTestId('save-icon').closest('button')!;
      await user.click(saveButton);
      
      // Sample answer display should be hidden when sample is empty
      expect(screen.queryByText('Sample Answer:')).not.toBeInTheDocument();
      expect(screen.queryByText('Sample set')).not.toBeInTheDocument();
    });

    it('should show sample answer display after setting a new sample', async () => {
      const itemWithoutSample = {
        ...mockExtendedTextItem,
        correctResponse: ''
      };
      
      const user = userEvent.setup();
      render(<ExtendedTextItem item={itemWithoutSample} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Sample');
      await user.click(editButton);
      
      const sampleAnswerTextarea = screen.getByPlaceholderText('Enter a sample correct response...');
      await user.type(sampleAnswerTextarea, 'New sample answer');
      
      const saveButton = screen.getByTestId('save-icon').closest('button')!;
      await user.click(saveButton);
      
      expect(screen.getByText('Sample Answer:')).toBeInTheDocument();
      expect(screen.getByText('New sample answer')).toBeInTheDocument();
      expect(screen.getByText('Sample set')).toBeInTheDocument();
    });
  });
});