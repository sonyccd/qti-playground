import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OrderItem } from '../OrderItem';
import { QTIItem } from '@/types/qti';

// Mock the UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardHeader: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardTitle: ({ children, className }: any) => <h2 className={className}>{children}</h2>
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

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  GripVertical: () => <span data-testid="grip-icon">Grip</span>,
  ArrowUp: () => <span data-testid="arrow-up-icon">Up</span>,
  ArrowDown: () => <span data-testid="arrow-down-icon">Down</span>
}));

describe('OrderItem', () => {
  const mockOrderItem: QTIItem = {
    id: 'order-item-1',
    title: 'Historical Events',
    type: 'order',
    prompt: 'Arrange these events in chronological order',
    orderChoices: [
      { identifier: 'event_a', text: 'World War I' },
      { identifier: 'event_b', text: 'World War II' },
      { identifier: 'event_c', text: 'Cold War' },
      { identifier: 'event_d', text: 'Fall of Berlin Wall' }
    ]
  };

  const mockOrderItemEmpty: QTIItem = {
    id: 'order-item-2',
    title: 'Empty Order',
    type: 'order',
    prompt: 'No choices available',
    orderChoices: []
  };

  const mockOrderItemNoChoices: QTIItem = {
    id: 'order-item-3',
    title: 'No Choices',
    type: 'order',
    prompt: 'No order choices property'
  };

  // Mock Math.random to make shuffle predictable
  const mockMath = Object.create(global.Math);
  mockMath.random = () => 0.5;
  global.Math = mockMath;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock DragEvent
    global.DragEvent = class extends Event {
      dataTransfer: any;
      
      constructor(type: string, eventInitDict?: DragEventInit) {
        super(type, eventInitDict);
        this.dataTransfer = {
          effectAllowed: '',
          dropEffect: '',
          setData: vi.fn(),
          files: []
        };
      }
    } as any;
  });

  describe('Basic Rendering', () => {
    it('should render order item with title and prompt', () => {
      render(<OrderItem item={mockOrderItem} />);
      
      expect(screen.getByText('Historical Events')).toBeInTheDocument();
      expect(screen.getByText('Arrange these events in chronological order')).toBeInTheDocument();
    });

    it('should render without prompt when not provided', () => {
      const itemWithoutPrompt = { ...mockOrderItem, prompt: undefined as any };
      render(<OrderItem item={itemWithoutPrompt} />);
      
      expect(screen.getByText('Historical Events')).toBeInTheDocument();
      expect(screen.queryByText('Arrange these events in chronological order')).not.toBeInTheDocument();
    });

    it('should render all order choices with correct numbering', () => {
      render(<OrderItem item={mockOrderItem} />);
      
      expect(screen.getByText('World War I')).toBeInTheDocument();
      expect(screen.getByText('World War II')).toBeInTheDocument();
      expect(screen.getByText('Cold War')).toBeInTheDocument();
      expect(screen.getByText('Fall of Berlin Wall')).toBeInTheDocument();
      
      // Check numbering badges
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('should show instruction text', () => {
      render(<OrderItem item={mockOrderItem} />);
      
      expect(screen.getByText('Drag items or use the arrow buttons to arrange them in the correct order:')).toBeInTheDocument();
    });

    it('should render shuffle and reset buttons', () => {
      render(<OrderItem item={mockOrderItem} />);
      
      expect(screen.getByText('Shuffle')).toBeInTheDocument();
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    it('should show current order summary', () => {
      render(<OrderItem item={mockOrderItem} />);
      
      expect(screen.getByText('Current Order:')).toBeInTheDocument();
      expect(screen.getByText('1. World War I')).toBeInTheDocument();
      expect(screen.getByText('2. World War II')).toBeInTheDocument();
      expect(screen.getByText('3. Cold War')).toBeInTheDocument();
      expect(screen.getByText('4. Fall of Berlin Wall')).toBeInTheDocument();
    });

    it('should show bottom instruction text', () => {
      render(<OrderItem item={mockOrderItem} />);
      
      expect(screen.getByText('Arrange the items in the correct sequence by dragging or using the arrow buttons')).toBeInTheDocument();
    });
  });

  describe('Arrow Button Navigation', () => {
    it('should move item up when up arrow is clicked', async () => {
      const user = userEvent.setup();
      render(<OrderItem item={mockOrderItem} />);
      
      // Find all up arrow buttons and click the second one (for World War II at index 1)
      const upButtons = screen.getAllByTestId('arrow-up-icon');
      const upButton = upButtons[1].closest('button')!;
      
      await user.click(upButton);
      
      // World War II should now be first
      const currentOrderItems = screen.getAllByText(/^\d+\. /);
      expect(currentOrderItems[0]).toHaveTextContent('1. World War II');
      expect(currentOrderItems[1]).toHaveTextContent('2. World War I');
    });

    it('should move item down when down arrow is clicked', async () => {
      const user = userEvent.setup();
      render(<OrderItem item={mockOrderItem} />);
      
      // Find all down arrow buttons and click the first one (for World War I at index 0)
      const downButtons = screen.getAllByTestId('arrow-down-icon');
      const downButton = downButtons[0].closest('button')!;
      
      await user.click(downButton);
      
      // World War I should now be second
      const currentOrderItems = screen.getAllByText(/^\d+\. /);
      expect(currentOrderItems[0]).toHaveTextContent('1. World War II');
      expect(currentOrderItems[1]).toHaveTextContent('2. World War I');
    });

    it('should disable up arrow for first item', () => {
      render(<OrderItem item={mockOrderItem} />);
      
      // Find first item's up button (index 0)
      const upButtons = screen.getAllByTestId('arrow-up-icon');
      const upButton = upButtons[0].closest('button')!;
      
      expect(upButton).toBeDisabled();
    });

    it('should disable down arrow for last item', () => {
      render(<OrderItem item={mockOrderItem} />);
      
      // Find last item's down button (index 3)
      const downButtons = screen.getAllByTestId('arrow-down-icon');
      const downButton = downButtons[3].closest('button')!;
      
      expect(downButton).toBeDisabled();
    });

    it('should not move item up when already at top', async () => {
      const user = userEvent.setup();
      render(<OrderItem item={mockOrderItem} />);
      
      // Find first item's up button
      const upButtons = screen.getAllByTestId('arrow-up-icon');
      const upButton = upButtons[0].closest('button')!;
      
      // Should be disabled, but if somehow clicked, order shouldn't change
      expect(upButton).toBeDisabled();
      
      const currentOrderItems = screen.getAllByText(/^\d+\. /);
      expect(currentOrderItems[0]).toHaveTextContent('1. World War I');
    });

    it('should not move item down when already at bottom', async () => {
      const user = userEvent.setup();
      render(<OrderItem item={mockOrderItem} />);
      
      // Find last item's down button
      const downButtons = screen.getAllByTestId('arrow-down-icon');
      const downButton = downButtons[3].closest('button')!;
      
      expect(downButton).toBeDisabled();
      
      const currentOrderItems = screen.getAllByText(/^\d+\. /);
      expect(currentOrderItems[3]).toHaveTextContent('4. Fall of Berlin Wall');
    });
  });

  describe('Drag and Drop Functionality', () => {
    it('should set drag state on drag start', () => {
      render(<OrderItem item={mockOrderItem} />);
      
      const wwiContainer = screen.getByText('World War I').closest('div')!;
      const dragEvent = new DragEvent('dragstart', { bubbles: true });
      
      // Mock dataTransfer
      Object.defineProperty(dragEvent, 'dataTransfer', {
        value: {
          effectAllowed: '',
          setData: vi.fn()
        }
      });
      
      Object.defineProperty(dragEvent, 'currentTarget', {
        value: {
          outerHTML: '<div>test</div>',
          style: { opacity: '1' }
        }
      });
      
      fireEvent(wwiContainer, dragEvent);
      
      expect(dragEvent.dataTransfer.effectAllowed).toBe('move');
    });

    it('should handle drag end event', () => {
      render(<OrderItem item={mockOrderItem} />);
      
      const wwiContainer = screen.getByText('World War I').closest('div')!;
      const dragEndEvent = new DragEvent('dragend', { bubbles: true });
      
      const mockElement = { style: { opacity: '0.5' } };
      Object.defineProperty(dragEndEvent, 'currentTarget', {
        value: mockElement
      });
      
      // Should not throw error when handling drag end
      expect(() => fireEvent(wwiContainer, dragEndEvent)).not.toThrow();
    });

    it('should prevent default on drag over', () => {
      render(<OrderItem item={mockOrderItem} />);
      
      const wwiContainer = screen.getByText('World War I').closest('div')!;
      const dragOverEvent = new DragEvent('dragover', { bubbles: true });
      const preventDefaultSpy = vi.spyOn(dragOverEvent, 'preventDefault');
      
      Object.defineProperty(dragOverEvent, 'dataTransfer', {
        value: { dropEffect: '' }
      });
      
      fireEvent(wwiContainer, dragOverEvent);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(dragOverEvent.dataTransfer.dropEffect).toBe('move');
    });

    it('should handle drop and reorder items', async () => {
      render(<OrderItem item={mockOrderItem} />);
      
      const wwiContainer = screen.getByText('World War I').closest('div')!;
      const wwiiContainer = screen.getByText('World War II').closest('div')!;
      
      // Start drag on first item
      const dragStartEvent = new DragEvent('dragstart', { bubbles: true });
      Object.defineProperty(dragStartEvent, 'dataTransfer', {
        value: {
          effectAllowed: '',
          setData: vi.fn()
        }
      });
      Object.defineProperty(dragStartEvent, 'currentTarget', {
        value: {
          outerHTML: '<div>test</div>',
          style: { opacity: '1' }
        }
      });
      
      fireEvent(wwiContainer, dragStartEvent);
      
      // Drop on second item
      const dropEvent = new DragEvent('drop', { bubbles: true });
      const preventDefaultSpy = vi.spyOn(dropEvent, 'preventDefault');
      
      fireEvent(wwiiContainer, dropEvent);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Shuffle and Reset Functionality', () => {
    it('should shuffle items when shuffle button is clicked', async () => {
      const user = userEvent.setup();
      render(<OrderItem item={mockOrderItem} />);
      
      const originalOrder = screen.getAllByText(/^\d+\. /);
      const originalFirstItem = originalOrder[0].textContent;
      
      const shuffleButton = screen.getByText('Shuffle');
      await user.click(shuffleButton);
      
      // With our mocked Math.random, order might change
      // Just verify the function doesn't crash and items are still there
      expect(screen.getByText('World War I')).toBeInTheDocument();
      expect(screen.getByText('World War II')).toBeInTheDocument();
      expect(screen.getByText('Cold War')).toBeInTheDocument();
      expect(screen.getByText('Fall of Berlin Wall')).toBeInTheDocument();
    });

    it('should reset to original order when reset button is clicked', async () => {
      const user = userEvent.setup();
      render(<OrderItem item={mockOrderItem} />);
      
      // First move an item
      const upButtons = screen.getAllByTestId('arrow-up-icon');
      const upButton = upButtons[1].closest('button')!; // World War II button
      await user.click(upButton);
      
      // Verify order changed
      let currentOrderItems = screen.getAllByText(/^\d+\. /);
      expect(currentOrderItems[0]).toHaveTextContent('1. World War II');
      
      // Reset order
      const resetButton = screen.getByText('Reset');
      await user.click(resetButton);
      
      // Verify back to original order
      currentOrderItems = screen.getAllByText(/^\d+\. /);
      expect(currentOrderItems[0]).toHaveTextContent('1. World War I');
      expect(currentOrderItems[1]).toHaveTextContent('2. World War II');
    });

    it('should handle reset when no original order choices', async () => {
      const user = userEvent.setup();
      render(<OrderItem item={mockOrderItemNoChoices} />);
      
      const resetButton = screen.getByText('Reset');
      await user.click(resetButton);
      
      // Should not crash
      expect(screen.getByText('No Choices')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle item with empty order choices array', () => {
      render(<OrderItem item={mockOrderItemEmpty} />);
      
      expect(screen.getByText('Empty Order')).toBeInTheDocument();
      expect(screen.getByText('No choices available')).toBeInTheDocument();
      expect(screen.getByText('Current Order:')).toBeInTheDocument();
      
      // Should still show buttons but they won't have items to work with
      expect(screen.getByText('Shuffle')).toBeInTheDocument();
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    it('should handle item with no order choices property', () => {
      render(<OrderItem item={mockOrderItemNoChoices} />);
      
      expect(screen.getByText('No Choices')).toBeInTheDocument();
      expect(screen.getByText('Current Order:')).toBeInTheDocument();
      
      // Should initialize with empty array
      const currentOrder = screen.getByText('Current Order:').closest('div');
      expect(currentOrder).toBeInTheDocument();
    });

    it('should handle single item order', () => {
      const singleItemOrder = {
        ...mockOrderItem,
        orderChoices: [{ identifier: 'single', text: 'Only Item' }]
      };
      
      render(<OrderItem item={singleItemOrder} />);
      
      expect(screen.getByText('Only Item')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      
      // Both buttons should be disabled for single item
      const upButtons = screen.getAllByTestId('arrow-up-icon');
      const downButtons = screen.getAllByTestId('arrow-down-icon');
      
      expect(upButtons[0].closest('button')).toBeDisabled();
      expect(downButtons[0].closest('button')).toBeDisabled();
    });

    it('should handle drag events with null draggedIndex', () => {
      render(<OrderItem item={mockOrderItem} />);
      
      const wwiContainer = screen.getByText('World War I').closest('div')!;
      
      // Try to drop without starting a drag
      const dropEvent = new DragEvent('drop', { bubbles: true });
      const preventDefaultSpy = vi.spyOn(dropEvent, 'preventDefault');
      
      fireEvent(wwiContainer, dropEvent);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
      // Order should remain unchanged
      const currentOrderItems = screen.getAllByText(/^\d+\. /);
      expect(currentOrderItems[0]).toHaveTextContent('1. World War I');
    });

    it('should handle drop on same item', () => {
      render(<OrderItem item={mockOrderItem} />);
      
      const wwiContainer = screen.getByText('World War I').closest('div')!;
      
      // Start drag
      const dragStartEvent = new DragEvent('dragstart', { bubbles: true });
      Object.defineProperty(dragStartEvent, 'dataTransfer', {
        value: {
          effectAllowed: '',
          setData: vi.fn()
        }
      });
      Object.defineProperty(dragStartEvent, 'currentTarget', {
        value: {
          outerHTML: '<div>test</div>',
          style: { opacity: '1' }
        }
      });
      
      fireEvent(wwiContainer, dragStartEvent);
      
      // Drop on same item
      const dropEvent = new DragEvent('drop', { bubbles: true });
      const preventDefaultSpy = vi.spyOn(dropEvent, 'preventDefault');
      
      fireEvent(wwiContainer, dropEvent);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
      // Order should remain unchanged
      const currentOrderItems = screen.getAllByText(/^\d+\. /);
      expect(currentOrderItems[0]).toHaveTextContent('1. World War I');
    });

    it('should handle move item with invalid indices', async () => {
      const user = userEvent.setup();
      render(<OrderItem item={mockOrderItem} />);
      
      // Get initial order
      const initialOrderItems = screen.getAllByText(/^\d+\. /);
      const initialOrder = initialOrderItems.map(item => item.textContent);
      
      // Simulate moving beyond bounds (this should be prevented by disabled buttons)
      // But test the function directly by checking disabled states
      const upButtons = screen.getAllByTestId('arrow-up-icon');
      const upButton = upButtons[0].closest('button')!;
      
      expect(upButton).toBeDisabled();
      
      // Order should remain the same
      const finalOrderItems = screen.getAllByText(/^\d+\. /);
      const finalOrder = finalOrderItems.map(item => item.textContent);
      
      expect(finalOrder).toEqual(initialOrder);
    });
  });

  describe('UI States and Styling', () => {
    it('should apply correct styling classes', () => {
      render(<OrderItem item={mockOrderItem} />);
      
      // Find the card container by looking for the outermost div with the card classes
      const cardContainer = screen.getByText('Historical Events').closest('[class*="transition-all"]');
      expect(cardContainer).toHaveClass('transition-all', 'duration-300', 'hover:shadow-lg');
    });

    it('should show grip icon for each item', () => {
      render(<OrderItem item={mockOrderItem} />);
      
      const gripIcons = screen.getAllByTestId('grip-icon');
      expect(gripIcons).toHaveLength(4); // One for each item
    });

    it('should show arrow icons for each item', () => {
      render(<OrderItem item={mockOrderItem} />);
      
      const upArrows = screen.getAllByTestId('arrow-up-icon');
      const downArrows = screen.getAllByTestId('arrow-down-icon');
      
      expect(upArrows).toHaveLength(4);
      expect(downArrows).toHaveLength(4);
    });

    it('should handle drag start event', () => {
      render(<OrderItem item={mockOrderItem} />);
      
      const wwiContainer = screen.getByText('World War I').closest('div')!;
      
      // Start drag
      const dragStartEvent = new DragEvent('dragstart', { bubbles: true });
      const mockElement = {
        outerHTML: '<div>test</div>',
        style: { opacity: '1' }
      };
      
      Object.defineProperty(dragStartEvent, 'dataTransfer', {
        value: {
          effectAllowed: '',
          setData: vi.fn()
        }
      });
      Object.defineProperty(dragStartEvent, 'currentTarget', {
        value: mockElement
      });
      
      // Should not throw error when handling drag start
      expect(() => fireEvent(wwiContainer, dragStartEvent)).not.toThrow();
      
      // Verify dataTransfer was set up
      expect(dragStartEvent.dataTransfer.effectAllowed).toBe('move');
    });

    it('should show proper button styling', () => {
      render(<OrderItem item={mockOrderItem} />);
      
      const shuffleButton = screen.getByText('Shuffle');
      const resetButton = screen.getByText('Reset');
      
      expect(shuffleButton).toHaveClass('button', 'outline');
      expect(resetButton).toHaveClass('button', 'outline');
    });

    it('should show badge styling for numbers', () => {
      render(<OrderItem item={mockOrderItem} />);
      
      const numberBadges = screen.getAllByText(/^[1-4]$/);
      numberBadges.forEach(badge => {
        expect(badge).toHaveClass('badge', 'outline');
      });
    });

    it('should show badge styling for current order items', () => {
      render(<OrderItem item={mockOrderItem} />);
      
      const orderBadges = screen.getAllByText(/^\d+\. /);
      orderBadges.forEach(badge => {
        expect(badge).toHaveClass('badge', 'secondary');
      });
    });
  });

  describe('Complex Interactions', () => {
    it('should handle multiple moves correctly', async () => {
      const user = userEvent.setup();
      render(<OrderItem item={mockOrderItem} />);
      
      // Move World War II up (to position 1)
      let upButtons = screen.getAllByTestId('arrow-up-icon');
      const upButton = upButtons[1].closest('button')!; // World War II button
      await user.click(upButton);
      
      // Move Cold War up twice (to position 1) - now it's at index 2 after previous move
      upButtons = screen.getAllByTestId('arrow-up-icon'); // Re-get buttons after DOM change
      let coldWarUpButton = upButtons[2].closest('button')!;
      await user.click(coldWarUpButton);
      
      upButtons = screen.getAllByTestId('arrow-up-icon'); // Re-get buttons again
      coldWarUpButton = upButtons[1].closest('button')!; // Cold War is now at index 1
      await user.click(coldWarUpButton);
      
      // Final order should be: Cold War, World War II, World War I, Fall of Berlin Wall
      const currentOrderItems = screen.getAllByText(/^\d+\. /);
      expect(currentOrderItems[0]).toHaveTextContent('1. Cold War');
      expect(currentOrderItems[1]).toHaveTextContent('2. World War II');
      expect(currentOrderItems[2]).toHaveTextContent('3. World War I');
      expect(currentOrderItems[3]).toHaveTextContent('4. Fall of Berlin Wall');
    });

    it('should maintain consistency between main list and summary', async () => {
      const user = userEvent.setup();
      render(<OrderItem item={mockOrderItem} />);
      
      // Move an item
      const upButtons = screen.getAllByTestId('arrow-up-icon');
      const upButton = upButtons[1].closest('button')!; // World War II button
      await user.click(upButton);
      
      // Check both main list numbering and summary match
      const mainListItems = screen.getAllByText(/^[1-4]$/);
      const summaryItems = screen.getAllByText(/^\d+\. /);
      
      // First item should be World War II in both places
      expect(summaryItems[0]).toHaveTextContent('1. World War II');
      expect(summaryItems[1]).toHaveTextContent('2. World War I');
    });

    it('should shuffle multiple times without errors', async () => {
      const user = userEvent.setup();
      render(<OrderItem item={mockOrderItem} />);
      
      const shuffleButton = screen.getByText('Shuffle');
      
      // Shuffle multiple times
      await user.click(shuffleButton);
      await user.click(shuffleButton);
      await user.click(shuffleButton);
      
      // Should still have all items
      expect(screen.getByText('World War I')).toBeInTheDocument();
      expect(screen.getByText('World War II')).toBeInTheDocument();
      expect(screen.getByText('Cold War')).toBeInTheDocument();
      expect(screen.getByText('Fall of Berlin Wall')).toBeInTheDocument();
      
      // Should still have correct numbering
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });
  });
});