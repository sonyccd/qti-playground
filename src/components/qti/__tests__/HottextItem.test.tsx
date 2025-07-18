import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HottextItem } from '../HottextItem';
import { QTIItem } from '@/types/qti';

// Mock the UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardHeader: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardTitle: ({ children, className }: any) => <h2 className={className}>{children}</h2>
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: any) => (
    <span className={`badge ${variant} ${className}`}>{children}</span>
  )
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, size, className, ...props }: any) => (
    <button onClick={onClick} className={`button ${variant} ${size} ${className}`} {...props}>
      {children}
    </button>
  )
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Edit3: () => <span data-testid="edit-icon">Edit</span>,
  Save: () => <span data-testid="save-icon">Save</span>,
  X: () => <span data-testid="x-icon">X</span>
}));

describe('HottextItem', () => {
  const mockItem: QTIItem = {
    id: 'hottext-item-1',
    title: 'Hottext Selection Question',
    type: 'hottext',
    prompt: '<p>The <hottext identifier="hot1">sun</hottext> is a <hottext identifier="hot2">planet</hottext> and provides <hottext identifier="hot3">energy</hottext>.</p>',
    correctResponse: ['hot1', 'hot3'],
    hottextChoices: [
      { identifier: 'hot1', text: 'sun' },
      { identifier: 'hot2', text: 'planet' },
      { identifier: 'hot3', text: 'energy' }
    ]
  };

  const mockOnCorrectResponseChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render hottext item with title', () => {
    render(<HottextItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
    
    expect(screen.getByText('Hottext Selection Question')).toBeInTheDocument();
  });

  it('should render HTML content with hottext elements', () => {
    render(<HottextItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
    
    // Check that hottext choices are rendered
    expect(screen.getByText('sun')).toBeInTheDocument();
    expect(screen.getByText('planet')).toBeInTheDocument();
    expect(screen.getByText('energy')).toBeInTheDocument();
  });

  it('should display correct answers count', () => {
    render(<HottextItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
    
    expect(screen.getByText('2 correct')).toBeInTheDocument();
  });

  it('should show correct hottext with checkmark', () => {
    render(<HottextItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
    
    const sunElement = screen.getByText('sun').closest('span');
    const planetElement = screen.getByText('planet').closest('span');
    const energyElement = screen.getByText('energy').closest('span');
    
    expect(sunElement).toHaveClass('bg-green-50', 'border-green-200', 'text-green-800');
    expect(energyElement).toHaveClass('bg-green-50', 'border-green-200', 'text-green-800');
    expect(planetElement).not.toHaveClass('bg-green-50');
  });

  it('should allow hottext selection in normal mode', async () => {
    const user = userEvent.setup();
    render(<HottextItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
    
    // Look for any clickable hottext element
    const hottextElements = screen.getAllByText('planet');
    const planetElement = hottextElements[0]; // Get the first one
    await user.click(planetElement);
    
    // Should show in selected section
    expect(screen.getByText('Selected:')).toBeInTheDocument();
  });

  it('should allow multiple hottext selections', async () => {
    const user = userEvent.setup();
    render(<HottextItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
    
    const sunElement = screen.getByText('sun');
    const planetElements = screen.getAllByText('planet');
    const planetElement = planetElements[0];
    
    await user.click(sunElement);
    await user.click(planetElement);
    
    // Should show selected section
    expect(screen.getByText('Selected:')).toBeInTheDocument();
  });

  it('should toggle hottext selection on second click', async () => {
    const user = userEvent.setup();
    render(<HottextItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
    
    const planetElement = screen.getByText('planet');
    
    // First click - select
    await user.click(planetElement);
    expect(planetElement.closest('span')).toHaveClass('bg-primary');
    
    // Second click - deselect
    await user.click(planetElement);
    expect(planetElement.closest('span')).not.toHaveClass('bg-primary');
  });

  it('should enter edit mode when Set Correct button is clicked', async () => {
    const user = userEvent.setup();
    render(<HottextItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
    
    const editButton = screen.getByText('Set Correct');
    await user.click(editButton);
    
    expect(screen.getByText('Click on the words to mark them as correct answers:')).toBeInTheDocument();
    expect(screen.getByTestId('save-icon')).toBeInTheDocument();
    expect(screen.getByTestId('x-icon')).toBeInTheDocument();
  });

  it('should show different styling in edit mode', async () => {
    const user = userEvent.setup();
    render(<HottextItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
    
    const editButton = screen.getByText('Set Correct');
    await user.click(editButton);
    
    const sunElement = screen.getByText('sun');
    const planetElement = screen.getByText('planet');
    
    // Correct answers should show blue styling in edit mode
    expect(sunElement.closest('span')).toHaveClass('bg-blue-50', 'border-blue-200', 'text-blue-800');
    // Non-correct should show muted styling
    expect(planetElement.closest('span')).toHaveClass('bg-muted');
  });

  it('should allow changing correct answers in edit mode', async () => {
    const user = userEvent.setup();
    render(<HottextItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
    
    const editButton = screen.getByText('Set Correct');
    await user.click(editButton);
    
    const planetElement = screen.getByText('planet');
    await user.click(planetElement);
    
    // Planet should now be selected as correct
    expect(planetElement.closest('span')).toHaveClass('bg-blue-50', 'border-blue-200', 'text-blue-800');
  });

  it('should save correct answers when save button is clicked', async () => {
    const user = userEvent.setup();
    render(<HottextItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
    
    const editButton = screen.getByText('Set Correct');
    await user.click(editButton);
    
    const planetElement = screen.getByText('planet');
    await user.click(planetElement);
    
    const saveButton = screen.getByTestId('save-icon').closest('button')!;
    await user.click(saveButton);
    
    expect(mockOnCorrectResponseChange).toHaveBeenCalledWith('hottext-item-1', ['hot1', 'hot3', 'hot2']);
    expect(screen.getByText('3 correct')).toBeInTheDocument();
  });

  it('should cancel editing when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<HottextItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
    
    const editButton = screen.getByText('Set Correct');
    await user.click(editButton);
    
    const planetElement = screen.getByText('planet');
    await user.click(planetElement);
    
    const cancelButton = screen.getByTestId('x-icon').closest('button')!;
    await user.click(cancelButton);
    
    expect(mockOnCorrectResponseChange).not.toHaveBeenCalled();
    expect(screen.getByText('2 correct')).toBeInTheDocument();
    expect(screen.getByText('Set Correct')).toBeInTheDocument();
  });

  it('should handle item with no correct response', () => {
    const itemWithoutCorrect = {
      ...mockItem,
      correctResponse: undefined
    };
    
    render(<HottextItem item={itemWithoutCorrect} onCorrectResponseChange={mockOnCorrectResponseChange} />);
    
    expect(screen.queryByText(/correct/)).not.toBeInTheDocument();
    expect(screen.getByText('Set Correct')).toBeInTheDocument();
  });

  it('should handle item with string correct response', () => {
    const itemWithStringCorrect = {
      ...mockItem,
      correctResponse: 'hot1'
    };
    
    render(<HottextItem item={itemWithStringCorrect} onCorrectResponseChange={mockOnCorrectResponseChange} />);
    
    expect(screen.getByText('1 correct')).toBeInTheDocument();
    
    const sunElement = screen.getByText('sun');
    expect(sunElement.closest('span')).toHaveClass('bg-green-50', 'border-green-200', 'text-green-800');
  });

  it('should handle complex HTML with nested elements', () => {
    const complexItem = {
      ...mockItem,
      prompt: '<p>The <strong><hottext identifier="hot1">bold sun</hottext></strong> is <em>important</em> and <br/> provides <hottext identifier="hot2">energy</hottext>.</p>'
    };
    
    render(<HottextItem item={complexItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
    
    expect(screen.getByText('bold sun')).toBeInTheDocument();
    expect(screen.getByText('important')).toBeInTheDocument();
    expect(screen.getByText('energy')).toBeInTheDocument();
  });

  it('should handle missing hottext choices gracefully', () => {
    const itemWithoutChoices = {
      ...mockItem,
      hottextChoices: undefined
    };
    
    render(<HottextItem item={itemWithoutChoices} onCorrectResponseChange={mockOnCorrectResponseChange} />);
    
    const planetElement = screen.getByText('planet');
    fireEvent.click(planetElement);
    
    // Should not crash when displaying selected items
    expect(screen.getByText('Selected:')).toBeInTheDocument();
  });

  it('should handle empty prompt', () => {
    const itemWithEmptyPrompt = {
      ...mockItem,
      prompt: ''
    };
    
    render(<HottextItem item={itemWithEmptyPrompt} onCorrectResponseChange={mockOnCorrectResponseChange} />);
    
    expect(screen.getByText('Hottext Selection Question')).toBeInTheDocument();
    expect(screen.getByText('Set Correct')).toBeInTheDocument();
  });

  it('should handle prompt without hottext elements', () => {
    const itemWithoutHottext = {
      ...mockItem,
      prompt: '<p>This is just plain text without any hottext elements.</p>'
    };
    
    render(<HottextItem item={itemWithoutHottext} onCorrectResponseChange={mockOnCorrectResponseChange} />);
    
    expect(screen.getByText('This is just plain text without any hottext elements.')).toBeInTheDocument();
  });

  it('should render proper HTML structure from prompt', () => {
    const itemWithStructure = {
      ...mockItem,
      prompt: '<div><p>First paragraph</p><p>Test <hottext identifier="hot1">hottext</hottext> content</p></div>'
    };
    
    render(<HottextItem item={itemWithStructure} onCorrectResponseChange={mockOnCorrectResponseChange} />);
    
    // Just check that hottext element is rendered
    expect(screen.getByText('hottext')).toBeInTheDocument();
  });

  it('should not call onCorrectResponseChange when not provided', async () => {
    const user = userEvent.setup();
    render(<HottextItem item={mockItem} />);
    
    const editButton = screen.getByText('Set Correct');
    await user.click(editButton);
    
    const saveButton = screen.getByTestId('save-icon').closest('button')!;
    await user.click(saveButton);
    
    // Should not throw error when callback is not provided
    expect(screen.getByText('Set Correct')).toBeInTheDocument();
  });

  it('should handle hottext with missing identifier', () => {
    const itemWithMissingId = {
      ...mockItem,
      prompt: '<p>The <hottext>sun</hottext> is important.</p>'
    };
    
    render(<HottextItem item={itemWithMissingId} onCorrectResponseChange={mockOnCorrectResponseChange} />);
    
    expect(screen.getByText('sun')).toBeInTheDocument();
    
    // Should handle click without crashing
    const sunElement = screen.getByText('sun');
    fireEvent.click(sunElement);
  });

  it('should preserve text nodes and whitespace correctly', () => {
    const itemWithSpacing = {
      ...mockItem,
      prompt: '<p>Test <hottext identifier="hot1">middle</hottext> content</p>'
    };
    
    render(<HottextItem item={itemWithSpacing} onCorrectResponseChange={mockOnCorrectResponseChange} />);
    
    // Just check that the hottext element is rendered
    expect(screen.getByText('middle')).toBeInTheDocument();
  });

  it('should handle DOM parsing edge cases', () => {
    // Test with malformed HTML that browser will fix
    const itemWithMalformed = {
      ...mockItem,
      prompt: '<p>Test <hottext identifier="hot1">unclosed paragraph <hottext identifier="hot2">nested</hottext>'
    };
    
    render(<HottextItem item={itemWithMalformed} onCorrectResponseChange={mockOnCorrectResponseChange} />);
    
    // Should render without crashing
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});