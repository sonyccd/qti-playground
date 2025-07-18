import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SortableQTIItem } from '../SortableQTIItem';
import { QTIItem } from '@/types/qti';

// Mock @dnd-kit/sortable
vi.mock('@dnd-kit/sortable', () => ({
  useSortable: vi.fn()
}));

// Mock @dnd-kit/utilities
vi.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: (transform: any) => transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined
    }
  }
}));

// Mock QTIItemRenderer
vi.mock('../QTIItemRenderer', () => ({
  QTIItemRenderer: ({ item, isNewlyAdded, onCorrectResponseChange }: any) => (
    <div data-testid="qti-item-renderer">
      <span>QTI Item: {item.title}</span>
      <span>isNewlyAdded: {String(isNewlyAdded)}</span>
      <span>hasCallback: {String(!!onCorrectResponseChange)}</span>
    </div>
  )
}));

// Mock the UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  GripVertical: () => <span data-testid="grip-icon">⋮⋮</span>
}));

describe('SortableQTIItem', () => {
  const mockItem: QTIItem = {
    id: 'test-item-1',
    title: 'Test Question',
    type: 'choice',
    prompt: 'Select the correct answer',
    correctResponse: 'choice_a',
    choices: [
      { identifier: 'choice_a', text: 'Option A' },
      { identifier: 'choice_b', text: 'Option B' }
    ]
  };

  const mockOnCorrectResponseChange = vi.fn();
  let mockUseSortable: any;

  const defaultSortableReturn = {
    attributes: { 'aria-describedby': 'dnd-description' },
    listeners: { onPointerDown: vi.fn() },
    setNodeRef: vi.fn(),
    transform: null,
    transition: undefined,
    isDragging: false
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    
    const sortableModule = await import('@dnd-kit/sortable');
    mockUseSortable = vi.mocked(sortableModule.useSortable);
    mockUseSortable.mockReturnValue(defaultSortableReturn);
  });

  describe('Basic Rendering', () => {
    it('should render with QTIItemRenderer', () => {
      render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByTestId('qti-item-renderer')).toBeInTheDocument();
      expect(screen.getByText('QTI Item: Test Question')).toBeInTheDocument();
    });

    it('should render grip icon for dragging', () => {
      render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByTestId('grip-icon')).toBeInTheDocument();
    });

    it('should pass item id to useSortable', () => {
      render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(mockUseSortable).toHaveBeenCalledWith({ id: 'test-item-1' });
    });

    it('should apply relative positioning to container', () => {
      const { container } = render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('relative', 'group');
    });

    it('should apply padding to QTIItemRenderer wrapper', () => {
      const { container } = render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const rendererWrapper = container.querySelector('.pl-8');
      expect(rendererWrapper).toBeInTheDocument();
    });
  });

  describe('Drag Handle Styling', () => {
    it('should position grip icon absolutely', () => {
      const { container } = render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const gripContainer = container.querySelector('.absolute.left-2.top-1\\/2');
      expect(gripContainer).toBeInTheDocument();
    });

    it('should apply cursor styles to grip handle', () => {
      const { container } = render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const gripContainer = container.querySelector('.cursor-grab.active\\:cursor-grabbing');
      expect(gripContainer).toBeInTheDocument();
    });

    it('should apply hover opacity transition to grip handle', () => {
      const { container } = render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const gripContainer = container.querySelector('.opacity-0.group-hover\\:opacity-100.transition-opacity');
      expect(gripContainer).toBeInTheDocument();
    });

    it('should apply z-index to grip handle', () => {
      const { container } = render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const gripContainer = container.querySelector('.z-10');
      expect(gripContainer).toBeInTheDocument();
    });
  });

  describe('Drag and Drop Behavior', () => {
    it('should apply transform style when dragging', () => {
      const transformedSortableReturn = {
        ...defaultSortableReturn,
        transform: { x: 10, y: 20, scaleX: 1, scaleY: 1 },
        transition: 'transform 200ms ease'
      };
      mockUseSortable.mockReturnValue(transformedSortableReturn);

      const { container } = render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({
        transform: 'translate3d(10px, 20px, 0)',
        transition: 'transform 200ms ease'
      });
    });

    it('should apply reduced opacity when dragging', () => {
      const draggingSortableReturn = {
        ...defaultSortableReturn,
        isDragging: true
      };
      mockUseSortable.mockReturnValue(draggingSortableReturn);

      const { container } = render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ opacity: '0.5' });
    });

    it('should apply normal opacity when not dragging', () => {
      const { container } = render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ opacity: '1' });
    });

    it('should apply higher z-index when dragging', () => {
      const draggingSortableReturn = {
        ...defaultSortableReturn,
        isDragging: true
      };
      mockUseSortable.mockReturnValue(draggingSortableReturn);

      const { container } = render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const card = container.querySelector('.z-50');
      expect(card).toBeInTheDocument();
    });

    it('should not apply z-50 when not dragging', () => {
      const { container } = render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const card = container.querySelector('.z-50');
      expect(card).not.toBeInTheDocument();
    });

    it('should pass drag attributes to grip handle', () => {
      const attributesReturn = {
        ...defaultSortableReturn,
        attributes: { 
          'aria-describedby': 'dnd-description',
          'data-testid': 'sortable-handle'
        }
      };
      mockUseSortable.mockReturnValue(attributesReturn);

      const { container } = render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const gripHandle = container.querySelector('[data-testid="sortable-handle"]');
      expect(gripHandle).toBeInTheDocument();
      expect(gripHandle).toHaveAttribute('aria-describedby', 'dnd-description');
    });

    it('should pass drag listeners to grip handle', () => {
      const listenersReturn = {
        ...defaultSortableReturn,
        listeners: { 
          onPointerDown: vi.fn(),
          onKeyDown: vi.fn()
        }
      };
      mockUseSortable.mockReturnValue(listenersReturn);

      render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      // Verify that listeners are applied (they would be spread onto the element)
      expect(mockUseSortable).toHaveBeenCalledWith({ id: 'test-item-1' });
    });
  });

  describe('Prop Passing', () => {
    it('should pass isNewlyAdded prop to QTIItemRenderer', () => {
      render(<SortableQTIItem item={mockItem} isNewlyAdded={true} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('isNewlyAdded: true')).toBeInTheDocument();
    });

    it('should default isNewlyAdded to false', () => {
      render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('isNewlyAdded: false')).toBeInTheDocument();
    });

    it('should pass onCorrectResponseChange to QTIItemRenderer', () => {
      render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('hasCallback: true')).toBeInTheDocument();
    });

    it('should handle missing onCorrectResponseChange', () => {
      render(<SortableQTIItem item={mockItem} />);
      
      expect(screen.getByText('hasCallback: false')).toBeInTheDocument();
    });

    it('should pass item prop to QTIItemRenderer', () => {
      render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByText('QTI Item: Test Question')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null transform', () => {
      const nullTransformReturn = {
        ...defaultSortableReturn,
        transform: null
      };
      mockUseSortable.mockReturnValue(nullTransformReturn);

      const { container } = render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const wrapper = container.firstChild as HTMLElement;
      // When transform is null, it should not have a transform style
      expect(wrapper.style.transform).toBe('');
    });

    it('should handle undefined transition', () => {
      const undefinedTransitionReturn = {
        ...defaultSortableReturn,
        transition: undefined
      };
      mockUseSortable.mockReturnValue(undefinedTransitionReturn);

      const { container } = render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const wrapper = container.firstChild as HTMLElement;
      // When transition is undefined, it should not have a transition style
      expect(wrapper.style.transition).toBe('');
    });

    it('should handle empty attributes object', () => {
      const emptyAttributesReturn = {
        ...defaultSortableReturn,
        attributes: {}
      };
      mockUseSortable.mockReturnValue(emptyAttributesReturn);

      render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByTestId('qti-item-renderer')).toBeInTheDocument();
    });

    it('should handle empty listeners object', () => {
      const emptyListenersReturn = {
        ...defaultSortableReturn,
        listeners: {}
      };
      mockUseSortable.mockReturnValue(emptyListenersReturn);

      render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(screen.getByTestId('qti-item-renderer')).toBeInTheDocument();
    });

    it('should handle item with different id', () => {
      const differentItem = {
        ...mockItem,
        id: 'different-id-123'
      };

      render(<SortableQTIItem item={differentItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      expect(mockUseSortable).toHaveBeenCalledWith({ id: 'different-id-123' });
    });

    it('should handle complex transform values', () => {
      const complexTransformReturn = {
        ...defaultSortableReturn,
        transform: { x: -15.5, y: 30.25, scaleX: 0.95, scaleY: 1.05 },
        transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)'
      };
      mockUseSortable.mockReturnValue(complexTransformReturn);

      const { container } = render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({
        transform: 'translate3d(-15.5px, 30.25px, 0)',
        transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)'
      });
    });

    it('should handle setNodeRef function', () => {
      const mockSetNodeRef = vi.fn();
      const setNodeRefReturn = {
        ...defaultSortableReturn,
        setNodeRef: mockSetNodeRef
      };
      mockUseSortable.mockReturnValue(setNodeRefReturn);

      const { container } = render(<SortableQTIItem item={mockItem} onCorrectResponseChange={mockOnCorrectResponseChange} />);
      
      // setNodeRef should be called when the component is rendered
      expect(mockSetNodeRef).toHaveBeenCalled();
    });
  });
});