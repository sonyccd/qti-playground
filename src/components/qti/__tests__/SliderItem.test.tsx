import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SliderItem } from '../SliderItem';
import { QTIItem } from '@/types/qti';

// Mock the UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardHeader: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardTitle: ({ children, className }: any) => <h2 className={className}>{children}</h2>
}));

vi.mock('@/components/ui/slider', () => ({
  Slider: ({ id, min, max, step, value, onValueChange, className }: any) => (
    <input
      type="range"
      id={id}
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onValueChange([parseFloat(e.target.value)])}
      className={className}
      data-testid={`slider-${id}`}
    />
  )
}));

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor, className }: any) => (
    <label htmlFor={htmlFor} className={className}>{children}</label>
  )
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, size, className, disabled }: any) => (
    <button 
      onClick={onClick} 
      className={`button ${variant} ${size} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  )
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: any) => (
    <span className={`badge ${variant} ${className}`}>{children}</span>
  )
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({ type, min, max, step, value, onChange, className }: any) => (
    <input
      type={type}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className={className}
      data-testid="correct-value-input"
    />
  )
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Edit3: () => <span data-testid="edit-icon">Edit</span>,
  Save: () => <span data-testid="save-icon">Save</span>,
  X: () => <span data-testid="x-icon">X</span>
}));

describe('SliderItem', () => {
  const mockSliderItem: QTIItem = {
    id: 'slider-item-1',
    title: 'Temperature Rating',
    type: 'slider',
    prompt: 'Rate the temperature from cold to hot',
    correctResponse: 75,
    sliderConfig: {
      lowerBound: 0,
      upperBound: 100,
      step: 5,
      stepLabel: true
    }
  };

  const mockSliderItemString: QTIItem = {
    id: 'slider-item-2',
    title: 'Scale Rating',
    type: 'slider',
    prompt: 'Rate on a scale',
    correctResponse: '50',
    sliderConfig: {
      lowerBound: 0,
      upperBound: 100,
      step: 1
    }
  };

  const mockSliderItemNoCorrect: QTIItem = {
    id: 'slider-item-3',
    title: 'No Correct Answer',
    type: 'slider',
    prompt: 'Select any value',
    sliderConfig: {
      lowerBound: 10,
      upperBound: 90,
      step: 10
    }
  };

  const mockOnCorrectResponseChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render slider item with title and prompt', () => {
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Temperature Rating')).toBeInTheDocument();
      expect(screen.getByText('Rate the temperature from cold to hot')).toBeInTheDocument();
    });

    it('should render without prompt when not provided', () => {
      const itemWithoutPrompt = { ...mockSliderItem, prompt: undefined as any };
      render(<SliderItem item={itemWithoutPrompt} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Temperature Rating')).toBeInTheDocument();
    });

    it('should display slider configuration bounds', () => {
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Select a value between 0 and 100:')).toBeInTheDocument();
      expect(screen.getAllByText('0')).toHaveLength(2); // One for min, one for selected value
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('should display step size when stepLabel is true', () => {
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Step size: 5')).toBeInTheDocument();
    });

    it('should not display step size when stepLabel is false', () => {
      const itemWithoutStepLabel = {
        ...mockSliderItem,
        sliderConfig: {
          ...mockSliderItem.sliderConfig!,
          stepLabel: false
        }
      };
      render(<SliderItem item={itemWithoutStepLabel} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.queryByText('Step size: 5')).not.toBeInTheDocument();
    });

    it('should show correct response badge when available', () => {
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Correct: 75')).toBeInTheDocument();
    });

    it('should not show correct response badge when correctResponse is 0', () => {
      const itemWithZeroCorrect = { ...mockSliderItem, correctResponse: 0 };
      render(<SliderItem item={itemWithZeroCorrect} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.queryByText('Correct: 0')).not.toBeInTheDocument();
    });
  });

  describe('Slider Functionality', () => {
    it('should render slider with correct attributes', () => {
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const slider = screen.getByTestId('slider-slider-slider-item-1');
      expect(slider).toHaveAttribute('min', '0');
      expect(slider).toHaveAttribute('max', '100');
      expect(slider).toHaveAttribute('step', '5');
    });

    it('should initialize slider with lowerBound value', () => {
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const slider = screen.getByTestId('slider-slider-slider-item-1');
      expect(slider).toHaveValue('0');
      expect(screen.getAllByText('0')).toHaveLength(2); // One for min, one for selected value
    });

    it('should update value when slider changes', async () => {
      const user = userEvent.setup();
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const slider = screen.getByTestId('slider-slider-slider-item-1');
      fireEvent.change(slider, { target: { value: '50' } });
      
      expect(slider).toHaveValue('50');
    });

    it('should use default step of 1 when not provided', () => {
      const itemWithoutStep = {
        ...mockSliderItem,
        sliderConfig: {
          lowerBound: 0,
          upperBound: 100
        }
      };
      render(<SliderItem item={itemWithoutStep} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const slider = screen.getByTestId('slider-slider-slider-item-1');
      expect(slider).toHaveAttribute('step', '1');
    });
  });

  describe('Correct Value Detection', () => {
    it('should show green checkmark when selected value matches correct answer', async () => {
      const user = userEvent.setup();
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const slider = screen.getByTestId('slider-slider-slider-item-1');
      fireEvent.change(slider, { target: { value: '75' } });
      
      // Check for green styling and checkmark
      expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('should not show checkmark when value does not match', async () => {
      const user = userEvent.setup();
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const slider = screen.getByTestId('slider-slider-slider-item-1');
      fireEvent.change(slider, { target: { value: '25' } });
      
      expect(screen.queryByText('✓')).not.toBeInTheDocument();
    });

    it('should handle string correct response', () => {
      render(<SliderItem item={mockSliderItemString} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Correct: 50')).toBeInTheDocument();
    });

    it('should handle tolerance with step size', async () => {
      const user = userEvent.setup();
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const slider = screen.getByTestId('slider-slider-slider-item-1');
      
      // Test within tolerance (step/2 = 2.5)
      fireEvent.change(slider, { target: { value: '77' } }); // Within 2.5 of 75
      expect(screen.getByText('✓')).toBeInTheDocument();
      
      fireEvent.change(slider, { target: { value: '73' } }); // Within 2.5 of 75
      expect(screen.getByText('✓')).toBeInTheDocument();
    });
  });

  describe('Edit Mode Functionality', () => {
    it('should enter edit mode when Set Correct button is clicked', async () => {
      const user = userEvent.setup();
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      expect(screen.getByText('Set the correct value:')).toBeInTheDocument();
      expect(screen.getByTestId('correct-value-input')).toBeInTheDocument();
      expect(screen.getByTestId('save-icon')).toBeInTheDocument();
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    });

    it('should show correct edit mode instruction', async () => {
      const user = userEvent.setup();
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      expect(screen.getByText('Enter the correct value above')).toBeInTheDocument();
    });

    it('should pre-populate input with current correct value', async () => {
      const user = userEvent.setup();
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      const input = screen.getByTestId('correct-value-input');
      expect(input).toHaveValue(75);
    });

    it('should update temp value when input changes', async () => {
      const user = userEvent.setup();
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      const input = screen.getByTestId('correct-value-input');
      await user.clear(input);
      await user.type(input, '85');
      
      expect(input).toHaveValue(85);
    });

    it('should configure input with slider bounds and step', async () => {
      const user = userEvent.setup();
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      const input = screen.getByTestId('correct-value-input');
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '100');
      expect(input).toHaveAttribute('step', '5');
    });

    it('should save changes when save button is clicked', async () => {
      const user = userEvent.setup();
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      const input = screen.getByTestId('correct-value-input');
      await user.clear(input);
      await user.type(input, '85');
      
      const saveButton = screen.getByTestId('save-icon').closest('button')!;
      await user.click(saveButton);
      
      expect(mockOnCorrectResponseChange).toHaveBeenCalledWith('slider-item-1', 85);
      expect(screen.queryByTestId('correct-value-input')).not.toBeInTheDocument(); // Exit edit mode
      expect(screen.getByText('Correct: 85')).toBeInTheDocument();
    });

    it('should cancel changes when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      const input = screen.getByTestId('correct-value-input');
      await user.clear(input);
      await user.type(input, '85');
      
      const cancelButton = screen.getByTestId('x-icon').closest('button')!;
      await user.click(cancelButton);
      
      expect(mockOnCorrectResponseChange).not.toHaveBeenCalled();
      expect(screen.queryByTestId('correct-value-input')).not.toBeInTheDocument(); // Exit edit mode
      expect(screen.getByText('Correct: 75')).toBeInTheDocument(); // Original value preserved
    });

    it('should not call onCorrectResponseChange when not provided', async () => {
      const user = userEvent.setup();
      render(<SliderItem item={mockSliderItem} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      const input = screen.getByTestId('correct-value-input');
      await user.clear(input);
      await user.type(input, '85');
      
      const saveButton = screen.getByTestId('save-icon').closest('button')!;
      await user.click(saveButton);
      
      // Should not throw error when callback is not provided
      expect(screen.queryByTestId('correct-value-input')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should render error message when slider config is missing', () => {
      const itemWithoutConfig = { ...mockSliderItem, sliderConfig: undefined };
      render(<SliderItem item={itemWithoutConfig} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Slider configuration not found')).toBeInTheDocument();
    });

    it('should handle null slider config', () => {
      const itemWithNullConfig = { ...mockSliderItem, sliderConfig: null as any };
      render(<SliderItem item={itemWithNullConfig} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Slider configuration not found')).toBeInTheDocument();
    });

    it('should handle undefined correct response', () => {
      render(<SliderItem item={mockSliderItemNoCorrect} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.queryByText(/Correct:/)).not.toBeInTheDocument();
      expect(screen.getByText('Set Correct')).toBeInTheDocument();
    });

    it('should handle invalid string correct response', () => {
      const itemWithInvalidCorrect = { ...mockSliderItem, correctResponse: 'invalid' };
      render(<SliderItem item={itemWithInvalidCorrect} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.queryByText(/Correct:/)).not.toBeInTheDocument();
    });

    it('should handle empty string correct response', () => {
      const itemWithEmptyCorrect = { ...mockSliderItem, correctResponse: '' };
      render(<SliderItem item={itemWithEmptyCorrect} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.queryByText(/Correct:/)).not.toBeInTheDocument();
    });

    it('should handle parseFloat returning NaN from input', async () => {
      const user = userEvent.setup();
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      const input = screen.getByTestId('correct-value-input');
      await user.clear(input);
      await user.type(input, 'invalid');
      
      const saveButton = screen.getByTestId('save-icon').closest('button')!;
      await user.click(saveButton);
      
      expect(mockOnCorrectResponseChange).toHaveBeenCalledWith('slider-item-1', 0);
    });

    it('should reset temp value to current correct value on cancel', async () => {
      const user = userEvent.setup();
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      // Enter edit mode
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      // Change value
      const input = screen.getByTestId('correct-value-input');
      await user.clear(input);
      await user.type(input, '85');
      
      // Cancel
      const cancelButton = screen.getByTestId('x-icon').closest('button')!;
      await user.click(cancelButton);
      
      // Verify we're out of edit mode
      expect(screen.queryByTestId('correct-value-input')).not.toBeInTheDocument();
      
      // Enter edit mode again
      const editButtonAgain = screen.getByText('Set Correct');
      await user.click(editButtonAgain);
      
      // Should show original value
      const inputAgain = screen.getByTestId('correct-value-input');
      expect(inputAgain).toHaveValue(75);
    });

    it('should handle slider value changes during edit mode', async () => {
      const user = userEvent.setup();
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      // Change slider value while in edit mode
      const slider = screen.getByTestId('slider-slider-slider-item-1');
      fireEvent.change(slider, { target: { value: '60' } });
      
      // Should still be in edit mode
      expect(screen.getByTestId('correct-value-input')).toBeInTheDocument();
    });

    it('should show regular instruction when not in edit mode', () => {
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('Use the slider to select your answer')).toBeInTheDocument();
    });

    it('should handle different step values correctly', () => {
      const itemWithDecimalStep = {
        ...mockSliderItem,
        sliderConfig: {
          ...mockSliderItem.sliderConfig!,
          step: 0.1
        }
      };
      render(<SliderItem item={itemWithDecimalStep} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const slider = screen.getByTestId('slider-slider-slider-item-1');
      expect(slider).toHaveAttribute('step', '0.1');
    });

    it('should handle bounds validation in tolerance calculation', async () => {
      const user = userEvent.setup();
      const itemWithSmallStep = {
        ...mockSliderItem,
        sliderConfig: {
          ...mockSliderItem.sliderConfig!,
          step: 0.1
        }
      };
      render(<SliderItem item={itemWithSmallStep} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const slider = screen.getByTestId('slider-slider-slider-item-1');
      
      // Test very close value (within 0.05 tolerance)
      fireEvent.change(slider, { target: { value: '75.04' } });
      expect(screen.getByText('✓')).toBeInTheDocument();
    });
  });

  describe('UI States', () => {
    it('should apply hover and transition classes', () => {
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      // Find the card container by looking for the outermost div with the card classes
      const cardContainer = screen.getByText('Temperature Rating').closest('[class*="transition-all"]');
      expect(cardContainer).toHaveClass('transition-all', 'duration-300', 'hover:shadow-lg');
    });

    it('should show edit button with correct styling', () => {
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      expect(editButton).toHaveClass('button', 'outline');
    });

    it('should display badge with correct styling', () => {
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const badge = screen.getByText('Correct: 75');
      // Check that it's a MUI Chip component by checking for MuiChip class
      expect(badge.closest('.MuiChip-root')).toBeInTheDocument();
    });

    it('should show blue background for edit section', async () => {
      const user = userEvent.setup();
      render(<SliderItem item={mockSliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const editButton = screen.getByText('Set Correct');
      await user.click(editButton);
      
      const editSection = screen.getByText('Set the correct value:').closest('div');
      expect(editSection).toHaveClass('bg-blue-50', 'border-blue-200');
    });
  });
});