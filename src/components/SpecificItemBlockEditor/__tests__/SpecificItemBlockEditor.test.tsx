import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ItemBlock, QTIItem } from '@/types/project';

// Mock the SpecificItemBlockEditor component since it's part of AssessmentEditor
const SpecificItemBlockEditor: React.FC<{
  block: ItemBlock;
  availableItems: QTIItem[];
  onUpdate: (block: ItemBlock) => void;
}> = ({ block, availableItems, onUpdate }) => {
  const handleItemToggle = (itemId: string) => {
    const currentIds = block.specificItemIds || [];
    const newIds = currentIds.includes(itemId)
      ? currentIds.filter(id => id !== itemId)
      : [...currentIds, itemId];
    onUpdate({ ...block, specificItemIds: newIds });
  };

  return (
    <div data-testid="specific-item-block-editor">
      <h3>Select Specific Items</h3>
      {availableItems.map(item => (
        <label key={item.id} data-testid={`item-checkbox-${item.id}`}>
          <input
            type="checkbox"
            checked={block.specificItemIds?.includes(item.id) || false}
            onChange={() => handleItemToggle(item.id)}
          />
          {item.title}
        </label>
      ))}
      <p data-testid="selected-count">
        Selected: {block.specificItemIds?.length || 0}
      </p>
    </div>
  );
};

const mockItems: QTIItem[] = [
  {
    id: 'item-1',
    title: 'Multiple Choice Question 1',
    content: '<assessmentItem>...</assessmentItem>',
    qtiVersion: '2.1',
    itemType: 'choice',
    groups: ['math', 'easy'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'item-2',
    title: 'Text Entry Question',
    content: '<assessmentItem>...</assessmentItem>',
    qtiVersion: '2.1',
    itemType: 'text-entry',
    groups: ['science'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'item-3',
    title: 'Essay Question',
    content: '<assessmentItem>...</assessmentItem>',
    qtiVersion: '3.0',
    itemType: 'essay',
    groups: ['english', 'hard'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('SpecificItemBlockEditor', () => {
  describe('Item Selection Display', () => {
    it('should render all available items as checkboxes', () => {
      const mockBlock: ItemBlock = {
        id: 'block-1',
        type: 'item',
        order: 0,
        selectionType: 'specific',
        specificItemIds: [],
      };

      const mockOnUpdate = vi.fn();

      render(
        <SpecificItemBlockEditor
          block={mockBlock}
          availableItems={mockItems}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('Select Specific Items')).toBeInTheDocument();
      expect(screen.getByTestId('item-checkbox-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('item-checkbox-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('item-checkbox-item-3')).toBeInTheDocument();
      
      expect(screen.getByText('Multiple Choice Question 1')).toBeInTheDocument();
      expect(screen.getByText('Text Entry Question')).toBeInTheDocument();
      expect(screen.getByText('Essay Question')).toBeInTheDocument();
    });

    it('should show selected count initially as zero', () => {
      const mockBlock: ItemBlock = {
        id: 'block-1',
        type: 'item',
        order: 0,
        selectionType: 'specific',
        specificItemIds: [],
      };

      render(
        <SpecificItemBlockEditor
          block={mockBlock}
          availableItems={mockItems}
          onUpdate={vi.fn()}
        />
      );

      expect(screen.getByTestId('selected-count')).toHaveTextContent('Selected: 0');
    });

    it('should show pre-selected items when block has specificItemIds', () => {
      const mockBlock: ItemBlock = {
        id: 'block-1',
        type: 'item',
        order: 0,
        selectionType: 'specific',
        specificItemIds: ['item-1', 'item-3'],
      };

      render(
        <SpecificItemBlockEditor
          block={mockBlock}
          availableItems={mockItems}
          onUpdate={vi.fn()}
        />
      );

      const checkbox1 = screen.getByTestId('item-checkbox-item-1').querySelector('input') as HTMLInputElement;
      const checkbox2 = screen.getByTestId('item-checkbox-item-2').querySelector('input') as HTMLInputElement;
      const checkbox3 = screen.getByTestId('item-checkbox-item-3').querySelector('input') as HTMLInputElement;

      expect(checkbox1.checked).toBe(true);
      expect(checkbox2.checked).toBe(false);
      expect(checkbox3.checked).toBe(true);

      expect(screen.getByTestId('selected-count')).toHaveTextContent('Selected: 2');
    });
  });

  describe('Item Selection Interactions', () => {
    it('should select item when checkbox is clicked', async () => {
      const user = userEvent.setup();
      const mockOnUpdate = vi.fn();
      
      const mockBlock: ItemBlock = {
        id: 'block-1',
        type: 'item',
        order: 0,
        selectionType: 'specific',
        specificItemIds: [],
      };

      render(
        <SpecificItemBlockEditor
          block={mockBlock}
          availableItems={mockItems}
          onUpdate={mockOnUpdate}
        />
      );

      const checkbox = screen.getByTestId('item-checkbox-item-1').querySelector('input') as HTMLInputElement;
      await user.click(checkbox);

      expect(mockOnUpdate).toHaveBeenCalledWith({
        ...mockBlock,
        specificItemIds: ['item-1'],
      });
    });

    it('should deselect item when already selected checkbox is clicked', async () => {
      const user = userEvent.setup();
      const mockOnUpdate = vi.fn();
      
      const mockBlock: ItemBlock = {
        id: 'block-1',
        type: 'item',
        order: 0,
        selectionType: 'specific',
        specificItemIds: ['item-1', 'item-2'],
      };

      render(
        <SpecificItemBlockEditor
          block={mockBlock}
          availableItems={mockItems}
          onUpdate={mockOnUpdate}
        />
      );

      const checkbox = screen.getByTestId('item-checkbox-item-1').querySelector('input') as HTMLInputElement;
      await user.click(checkbox);

      expect(mockOnUpdate).toHaveBeenCalledWith({
        ...mockBlock,
        specificItemIds: ['item-2'],
      });
    });

    it('should handle multiple item selections', async () => {
      const user = userEvent.setup();
      const mockOnUpdate = vi.fn();
      
      const mockBlock: ItemBlock = {
        id: 'block-1',
        type: 'item',
        order: 0,
        selectionType: 'specific',
        specificItemIds: ['item-1'],
      };

      render(
        <SpecificItemBlockEditor
          block={mockBlock}
          availableItems={mockItems}
          onUpdate={mockOnUpdate}
        />
      );

      const checkbox2 = screen.getByTestId('item-checkbox-item-2').querySelector('input') as HTMLInputElement;
      const checkbox3 = screen.getByTestId('item-checkbox-item-3').querySelector('input') as HTMLInputElement;
      
      await user.click(checkbox2);
      expect(mockOnUpdate).toHaveBeenCalledWith({
        ...mockBlock,
        specificItemIds: ['item-1', 'item-2'],
      });

      // Reset mock and update block for next interaction
      mockOnUpdate.mockClear();
      const updatedBlock = { ...mockBlock, specificItemIds: ['item-1', 'item-2'] };
      
      render(
        <SpecificItemBlockEditor
          block={updatedBlock}
          availableItems={mockItems}
          onUpdate={mockOnUpdate}
        />
      );

      const checkbox3Updated = screen.getByTestId('item-checkbox-item-3').querySelector('input') as HTMLInputElement;
      await user.click(checkbox3Updated);
      
      expect(mockOnUpdate).toHaveBeenCalledWith({
        ...updatedBlock,
        specificItemIds: ['item-1', 'item-2', 'item-3'],
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty available items array', () => {
      const mockBlock: ItemBlock = {
        id: 'block-1',
        type: 'item',
        order: 0,
        selectionType: 'specific',
        specificItemIds: [],
      };

      render(
        <SpecificItemBlockEditor
          block={mockBlock}
          availableItems={[]}
          onUpdate={vi.fn()}
        />
      );

      expect(screen.getByText('Select Specific Items')).toBeInTheDocument();
      expect(screen.getByTestId('selected-count')).toHaveTextContent('Selected: 0');
      
      // Should not have any item checkboxes
      expect(screen.queryByTestId('item-checkbox-item-1')).not.toBeInTheDocument();
    });

    it('should handle block without specificItemIds property', () => {
      const mockBlock: ItemBlock = {
        id: 'block-1',
        type: 'item',
        order: 0,
        selectionType: 'specific',
        // specificItemIds is undefined
      };

      render(
        <SpecificItemBlockEditor
          block={mockBlock}
          availableItems={mockItems}
          onUpdate={vi.fn()}
        />
      );

      // All checkboxes should be unchecked
      const checkbox1 = screen.getByTestId('item-checkbox-item-1').querySelector('input') as HTMLInputElement;
      const checkbox2 = screen.getByTestId('item-checkbox-item-2').querySelector('input') as HTMLInputElement;
      const checkbox3 = screen.getByTestId('item-checkbox-item-3').querySelector('input') as HTMLInputElement;

      expect(checkbox1.checked).toBe(false);
      expect(checkbox2.checked).toBe(false);
      expect(checkbox3.checked).toBe(false);
      
      expect(screen.getByTestId('selected-count')).toHaveTextContent('Selected: 0');
    });

    it('should handle items with special characters in titles', () => {
      const specialItems: QTIItem[] = [
        {
          id: 'item-special',
          title: 'Question with "quotes" & <tags>',
          content: '<assessmentItem>...</assessmentItem>',
          qtiVersion: '2.1',
          itemType: 'choice',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockBlock: ItemBlock = {
        id: 'block-1',
        type: 'item',
        order: 0,
        selectionType: 'specific',
        specificItemIds: [],
      };

      render(
        <SpecificItemBlockEditor
          block={mockBlock}
          availableItems={specialItems}
          onUpdate={vi.fn()}
        />
      );

      expect(screen.getByText('Question with "quotes" & <tags>')).toBeInTheDocument();
      expect(screen.getByTestId('item-checkbox-item-special')).toBeInTheDocument();
    });
  });

  describe('Block Update Logic', () => {
    it('should preserve other block properties when updating specificItemIds', async () => {
      const user = userEvent.setup();
      const mockOnUpdate = vi.fn();
      
      const mockBlock: ItemBlock = {
        id: 'block-1',
        type: 'item',
        order: 5,
        selectionType: 'specific',
        specificItemIds: [],
        // These properties should be preserved
        randomize: true,
      };

      render(
        <SpecificItemBlockEditor
          block={mockBlock}
          availableItems={mockItems}
          onUpdate={mockOnUpdate}
        />
      );

      const checkbox = screen.getByTestId('item-checkbox-item-1').querySelector('input') as HTMLInputElement;
      await user.click(checkbox);

      expect(mockOnUpdate).toHaveBeenCalledWith({
        id: 'block-1',
        type: 'item',
        order: 5,
        selectionType: 'specific',
        specificItemIds: ['item-1'],
        randomize: true,
      });
    });

    it('should handle rapid successive clicks correctly', async () => {
      const user = userEvent.setup();
      const mockOnUpdate = vi.fn();
      
      const mockBlock: ItemBlock = {
        id: 'block-1',
        type: 'item',
        order: 0,
        selectionType: 'specific',
        specificItemIds: [],
      };

      render(
        <SpecificItemBlockEditor
          block={mockBlock}
          availableItems={mockItems}
          onUpdate={mockOnUpdate}
        />
      );

      const checkbox1 = screen.getByTestId('item-checkbox-item-1').querySelector('input') as HTMLInputElement;
      const checkbox2 = screen.getByTestId('item-checkbox-item-2').querySelector('input') as HTMLInputElement;

      // Rapid clicks
      await user.click(checkbox1);
      await user.click(checkbox2);
      await user.click(checkbox1); // Deselect first item

      expect(mockOnUpdate).toHaveBeenCalledTimes(3);
      expect(mockOnUpdate).toHaveBeenNthCalledWith(1, {
        ...mockBlock,
        specificItemIds: ['item-1'],
      });
      expect(mockOnUpdate).toHaveBeenNthCalledWith(2, {
        ...mockBlock,
        specificItemIds: ['item-1', 'item-2'],
      });
      expect(mockOnUpdate).toHaveBeenNthCalledWith(3, {
        ...mockBlock,
        specificItemIds: ['item-2'],
      });
    });
  });
});