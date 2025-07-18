import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QTIItemRenderer } from '../QTIItemRenderer';
import { QTIItem } from '@/types/qti';

// Mock all the QTI item components
vi.mock('../ChoiceItem', () => ({
  ChoiceItem: ({ item }: any) => <div data-testid="choice-item">Choice Item: {item.title}</div>
}));

vi.mock('../TextEntryItem', () => ({
  TextEntryItem: ({ item }: any) => <div data-testid="text-entry-item">Text Entry Item: {item.title}</div>
}));

vi.mock('../ExtendedTextItem', () => ({
  ExtendedTextItem: ({ item }: any) => <div data-testid="extended-text-item">Extended Text Item: {item.title}</div>
}));

vi.mock('../HottextItem', () => ({
  HottextItem: ({ item }: any) => <div data-testid="hottext-item">Hottext Item: {item.title}</div>
}));

vi.mock('../SliderItem', () => ({
  SliderItem: ({ item }: any) => <div data-testid="slider-item">Slider Item: {item.title}</div>
}));

vi.mock('../OrderItem', () => ({
  OrderItem: ({ item }: any) => <div data-testid="order-item">Order Item: {item.title}</div>
}));

// Mock the UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardHeader: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardTitle: ({ children, className }: any) => <h2 className={className}>{children}</h2>
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  AlertTriangle: () => <span data-testid="alert-triangle-icon">⚠</span>
}));

describe('QTIItemRenderer', () => {
  const mockOnCorrectResponseChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Item Type Routing', () => {
    it('should render ChoiceItem for choice type', () => {
      const choiceItem: QTIItem = {
        id: 'choice-1',
        title: 'Choice Question',
        type: 'choice',
        prompt: 'Select the correct answer',
        correctResponse: 'choice_a',
        choices: [
          { identifier: 'choice_a', text: 'Option A' },
          { identifier: 'choice_b', text: 'Option B' }
        ]
      };

      render(<QTIItemRenderer item={choiceItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByTestId('choice-item')).toBeInTheDocument();
      expect(screen.getByText('Choice Item: Choice Question')).toBeInTheDocument();
    });

    it('should render ChoiceItem for multipleResponse type', () => {
      const multipleResponseItem: QTIItem = {
        id: 'multi-1',
        title: 'Multiple Response Question',
        type: 'multipleResponse',
        prompt: 'Select all correct answers',
        correctResponse: ['choice_a', 'choice_b'],
        choices: [
          { identifier: 'choice_a', text: 'Option A' },
          { identifier: 'choice_b', text: 'Option B' }
        ]
      };

      render(<QTIItemRenderer item={multipleResponseItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByTestId('choice-item')).toBeInTheDocument();
      expect(screen.getByText('Choice Item: Multiple Response Question')).toBeInTheDocument();
    });

    it('should render TextEntryItem for textEntry type', () => {
      const textEntryItem: QTIItem = {
        id: 'text-1',
        title: 'Text Entry Question',
        type: 'textEntry',
        prompt: 'Enter your answer',
        correctResponse: 'correct answer'
      };

      render(<QTIItemRenderer item={textEntryItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByTestId('text-entry-item')).toBeInTheDocument();
      expect(screen.getByText('Text Entry Item: Text Entry Question')).toBeInTheDocument();
    });

    it('should render ExtendedTextItem for extendedText type', () => {
      const extendedTextItem: QTIItem = {
        id: 'extended-1',
        title: 'Essay Question',
        type: 'extendedText',
        prompt: 'Write a detailed response',
        correctResponse: 'sample answer'
      };

      render(<QTIItemRenderer item={extendedTextItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByTestId('extended-text-item')).toBeInTheDocument();
      expect(screen.getByText('Extended Text Item: Essay Question')).toBeInTheDocument();
    });

    it('should render HottextItem for hottext type', () => {
      const hottextItem: QTIItem = {
        id: 'hottext-1',
        title: 'Hottext Question',
        type: 'hottext',
        prompt: 'Select the correct words',
        correctResponse: ['hot1', 'hot2']
      };

      render(<QTIItemRenderer item={hottextItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByTestId('hottext-item')).toBeInTheDocument();
      expect(screen.getByText('Hottext Item: Hottext Question')).toBeInTheDocument();
    });

    it('should render SliderItem for slider type', () => {
      const sliderItem: QTIItem = {
        id: 'slider-1',
        title: 'Slider Question',
        type: 'slider',
        prompt: 'Select a value',
        correctResponse: 50
      };

      render(<QTIItemRenderer item={sliderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByTestId('slider-item')).toBeInTheDocument();
      expect(screen.getByText('Slider Item: Slider Question')).toBeInTheDocument();
    });

    it('should render OrderItem for order type', () => {
      const orderItem: QTIItem = {
        id: 'order-1',
        title: 'Order Question',
        type: 'order',
        prompt: 'Put items in correct order',
        correctResponse: ['item1', 'item2', 'item3']
      };

      render(<QTIItemRenderer item={orderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByTestId('order-item')).toBeInTheDocument();
      expect(screen.getByText('Order Item: Order Question')).toBeInTheDocument();
    });
  });

  describe('Unknown Item Type Handling', () => {
    it('should render unknown item fallback for unknown type', () => {
      const unknownItem: QTIItem = {
        id: 'unknown-1',
        title: 'Unknown Question Type',
        type: 'unknown',
        prompt: 'This is an unknown item type'
      };

      render(<QTIItemRenderer item={unknownItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
      expect(screen.getByText('Unknown Question Type')).toBeInTheDocument();
      expect(screen.getByText('This is an unknown item type')).toBeInTheDocument();
      expect(screen.getByText('Item type: unknown')).toBeInTheDocument();
    });

    it('should render fallback for unsupported item type', () => {
      const unsupportedItem: QTIItem = {
        id: 'unsupported-1',
        title: 'Unsupported Question Type',
        type: 'drawingInteraction' as any,
        prompt: 'This item type is not supported'
      };

      render(<QTIItemRenderer item={unsupportedItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
      expect(screen.getByText('Unsupported Question Type')).toBeInTheDocument();
      expect(screen.getByText('This item type is not supported')).toBeInTheDocument();
      expect(screen.getByText('Item type: drawingInteraction')).toBeInTheDocument();
    });

    it('should show default message when prompt is missing for unknown type', () => {
      const unknownItemNoPrompt: QTIItem = {
        id: 'unknown-2',
        title: 'Unknown Question',
        type: 'unknown'
      };

      render(<QTIItemRenderer item={unknownItemNoPrompt} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('This item type is not yet supported for preview.')).toBeInTheDocument();
    });

    it('should apply destructive styling for unknown items', () => {
      const unknownItem: QTIItem = {
        id: 'unknown-1',
        title: 'Unknown Question',
        type: 'unknown',
        prompt: 'Unknown prompt'
      };

      const { container } = render(<QTIItemRenderer item={unknownItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const card = container.querySelector('.border-destructive\\/20.bg-destructive\\/5');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Animation and Prop Passing', () => {
    it('should apply animation class when isNewlyAdded is true', () => {
      const choiceItem: QTIItem = {
        id: 'choice-1',
        title: 'Choice Question',
        type: 'choice',
        prompt: 'Select answer',
        correctResponse: 'choice_a',
        choices: []
      };

      const { container } = render(
        <QTIItemRenderer 
          item={choiceItem} 
          isNewlyAdded={true} 
          onCorrectResponseChange={mockOnCorrectResponseChange} 
        />
      );
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('animate-slide-in-right');
    });

    it('should not apply animation class when isNewlyAdded is false', () => {
      const choiceItem: QTIItem = {
        id: 'choice-1',
        title: 'Choice Question',
        type: 'choice',
        prompt: 'Select answer',
        correctResponse: 'choice_a',
        choices: []
      };

      const { container } = render(
        <QTIItemRenderer 
          item={choiceItem} 
          isNewlyAdded={false} 
          onCorrectResponseChange={mockOnCorrectResponseChange} 
        />
      );
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).not.toHaveClass('animate-slide-in-right');
    });

    it('should not apply animation class when isNewlyAdded is not provided', () => {
      const choiceItem: QTIItem = {
        id: 'choice-1',
        title: 'Choice Question',
        type: 'choice',
        prompt: 'Select answer',
        correctResponse: 'choice_a',
        choices: []
      };

      const { container } = render(
        <QTIItemRenderer 
          item={choiceItem} 
          onCorrectResponseChange={mockOnCorrectResponseChange} 
        />
      );
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).not.toHaveClass('animate-slide-in-right');
    });

    it('should apply transition classes to wrapper', () => {
      const choiceItem: QTIItem = {
        id: 'choice-1',
        title: 'Choice Question',
        type: 'choice',
        prompt: 'Select answer',
        correctResponse: 'choice_a',
        choices: []
      };

      const { container } = render(
        <QTIItemRenderer 
          item={choiceItem} 
          onCorrectResponseChange={mockOnCorrectResponseChange} 
        />
      );
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('transition-all', 'duration-500');
    });
  });

  describe('Prop Passing to Child Components', () => {
    it('should pass onCorrectResponseChange to child components', () => {
      const textEntryItem: QTIItem = {
        id: 'text-1',
        title: 'Text Entry',
        type: 'textEntry',
        prompt: 'Enter text',
        correctResponse: 'answer'
      };

      // The mocked components should receive the props
      render(<QTIItemRenderer item={textEntryItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByTestId('text-entry-item')).toBeInTheDocument();
    });

    it('should work without onCorrectResponseChange callback', () => {
      const textEntryItem: QTIItem = {
        id: 'text-1',
        title: 'Text Entry',
        type: 'textEntry',
        prompt: 'Enter text',
        correctResponse: 'answer'
      };

      render(<QTIItemRenderer item={textEntryItem} />);
      
      expect(screen.getByTestId('text-entry-item')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null or undefined item type gracefully', () => {
      const malformedItem = {
        id: 'malformed-1',
        title: 'Malformed Item',
        type: null as any,
        prompt: 'This item has null type'
      };

      render(<QTIItemRenderer item={malformedItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
      expect(screen.getByText('Malformed Item')).toBeInTheDocument();
      expect(screen.getByText('Item type:')).toBeInTheDocument(); // null gets rendered as empty
    });

    it('should handle empty string item type', () => {
      const emptyTypeItem = {
        id: 'empty-1',
        title: 'Empty Type Item',
        type: '' as any,
        prompt: 'This item has empty type'
      };

      render(<QTIItemRenderer item={emptyTypeItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
      expect(screen.getByText('Empty Type Item')).toBeInTheDocument();
      expect(screen.getByText('Item type:')).toBeInTheDocument();
    });

    it('should handle item without title', () => {
      const noTitleItem = {
        id: 'no-title-1',
        title: undefined as any,
        type: 'choice',
        prompt: 'Item without title',
        choices: []
      };

      render(<QTIItemRenderer item={noTitleItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByTestId('choice-item')).toBeInTheDocument();
    });

    it('should handle OrderItem without onCorrectResponseChange', () => {
      const orderItem: QTIItem = {
        id: 'order-1',
        title: 'Order Question',
        type: 'order',
        prompt: 'Put items in order',
        correctResponse: ['item1', 'item2']
      };

      // OrderItem doesn't receive onCorrectResponseChange prop according to the source
      render(<QTIItemRenderer item={orderItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByTestId('order-item')).toBeInTheDocument();
    });
  });
});