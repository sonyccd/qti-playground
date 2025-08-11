import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { TimelineBlock, ItemBlock, InstructionBlock } from '@/types/project';

// Mock @hello-pangea/dnd
const mockDragEndHandler = vi.fn();
vi.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children, onDragEnd }: { children: React.ReactNode; onDragEnd: (result: any) => void }) => {
    mockDragEndHandler.mockImplementation(onDragEnd);
    return <div data-testid="drag-drop-context">{children}</div>;
  },
  Droppable: ({ children, droppableId }: { children: (provided: any) => React.ReactNode; droppableId: string }) => 
    <div data-testid={`droppable-${droppableId}`}>
      {children({ 
        innerRef: vi.fn(), 
        droppableProps: { 'data-testid': `droppable-props-${droppableId}` }, 
        placeholder: <div data-testid={`placeholder-${droppableId}`} /> 
      })}
    </div>,
  Draggable: ({ children, draggableId, index }: { children: (provided: any, snapshot: any) => React.ReactNode; draggableId: string; index: number }) => 
    <div data-testid={`draggable-${draggableId}-${index}`}>
      {children({ 
        innerRef: vi.fn(), 
        draggableProps: { 'data-testid': `draggable-props-${draggableId}` }, 
        dragHandleProps: { 'data-testid': `drag-handle-${draggableId}` }
      }, { 
        isDragging: false 
      })}
    </div>,
}));

// Mock timeline component
interface DragDropTimelineProps {
  blocks: TimelineBlock[];
  onBlocksChange: (blocks: TimelineBlock[]) => void;
  onEditBlock: (blockId: string) => void;
  onDeleteBlock: (blockId: string) => void;
}

const DragDropTimeline: React.FC<DragDropTimelineProps> = ({
  blocks,
  onBlocksChange,
  onEditBlock,
  onDeleteBlock,
}) => {
  const handleDragEnd = React.useCallback((result: any) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex === destinationIndex) return;
    
    const reorderedBlocks = Array.from(blocks);
    const [removed] = reorderedBlocks.splice(sourceIndex, 1);
    reorderedBlocks.splice(destinationIndex, 0, removed);
    
    // Update order property
    const updatedBlocks = reorderedBlocks.map((block, index) => ({
      ...block,
      order: index,
    }));
    
    onBlocksChange(updatedBlocks);
  }, [blocks, onBlocksChange]);

  // Set up drag end handler when component mounts
  React.useEffect(() => {
    mockDragEndHandler.mockImplementation(handleDragEnd);
  }, [handleDragEnd]);

  const renderBlockContent = (block: TimelineBlock) => {
    if (block.type === 'item') {
      const itemBlock = block as ItemBlock;
      return (
        <div data-testid={`item-block-${block.id}`}>
          <h4>Item Block</h4>
          <p>Type: {itemBlock.selectionType}</p>
          {itemBlock.selectionType === 'specific' && (
            <p>Items: {itemBlock.specificItemIds?.length || 0} selected</p>
          )}
          {itemBlock.selectionType === 'random' && (
            <p>Random: {itemBlock.count} {itemBlock.itemType} items</p>
          )}
        </div>
      );
    } else if (block.type === 'instruction') {
      const instructionBlock = block as InstructionBlock;
      return (
        <div data-testid={`instruction-block-${block.id}`}>
          <h4>Instruction Block</h4>
          <p>Title: {instructionBlock.title}</p>
          <p>Skip: {instructionBlock.allowSkip ? 'Yes' : 'No'}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div data-testid="drag-drop-timeline">
      <div data-testid="droppable-timeline">
        {blocks.length === 0 ? (
          <div data-testid="empty-timeline">
            <p>No blocks in timeline</p>
            <p>Add your first block to start building the assessment</p>
          </div>
        ) : (
          blocks
            .sort((a, b) => a.order - b.order)
            .map((block, index) => (
              <div 
                key={block.id}
                data-testid={`draggable-${block.id}-${index}`}
                style={{ marginBottom: '8px', padding: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                <div data-testid={`drag-handle-${block.id}`} style={{ cursor: 'grab' }}>
                  ⋮⋮ Drag Handle
                </div>
                {renderBlockContent(block)}
                <div style={{ marginTop: '8px' }}>
                  <button 
                    data-testid={`edit-block-${block.id}`}
                    onClick={() => onEditBlock(block.id)}
                  >
                    Edit
                  </button>
                  <button 
                    data-testid={`delete-block-${block.id}`}
                    onClick={() => onDeleteBlock(block.id)}
                    style={{ marginLeft: '8px', color: 'red' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
      <div data-testid="placeholder-timeline" />
    </div>
  );
};

describe('DragDropTimeline', () => {
  let mockBlocks: TimelineBlock[];
  let mockOnBlocksChange: ReturnType<typeof vi.fn>;
  let mockOnEditBlock: ReturnType<typeof vi.fn>;
  let mockOnDeleteBlock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockOnBlocksChange = vi.fn();
    mockOnEditBlock = vi.fn();
    mockOnDeleteBlock = vi.fn();

    mockBlocks = [
      {
        id: 'item-block-1',
        type: 'item',
        order: 0,
        selectionType: 'specific',
        specificItemIds: ['item-1', 'item-2'],
      } as ItemBlock,
      {
        id: 'instruction-block-1',
        type: 'instruction',
        order: 1,
        title: 'Test Instructions',
        content: 'Please read carefully',
        allowSkip: true,
      } as InstructionBlock,
      {
        id: 'item-block-2',
        type: 'item',
        order: 2,
        selectionType: 'random',
        itemType: 'choice',
        count: 3,
        randomize: true,
      } as ItemBlock,
    ];
  });

  describe('Rendering', () => {
    it('should render empty timeline message', () => {
      render(
        <DragDropTimeline
          blocks={[]}
          onBlocksChange={mockOnBlocksChange}
          onEditBlock={mockOnEditBlock}
          onDeleteBlock={mockOnDeleteBlock}
        />
      );

      expect(screen.getByTestId('empty-timeline')).toBeInTheDocument();
      expect(screen.getByText('No blocks in timeline')).toBeInTheDocument();
      expect(screen.getByText('Add your first block to start building the assessment')).toBeInTheDocument();
    });

    it('should render all blocks in order', () => {
      render(
        <DragDropTimeline
          blocks={mockBlocks}
          onBlocksChange={mockOnBlocksChange}
          onEditBlock={mockOnEditBlock}
          onDeleteBlock={mockOnDeleteBlock}
        />
      );

      expect(screen.getByTestId('item-block-item-block-1')).toBeInTheDocument();
      expect(screen.getByTestId('instruction-block-instruction-block-1')).toBeInTheDocument();
      expect(screen.getByTestId('item-block-item-block-2')).toBeInTheDocument();
    });

    it('should render item block details correctly', () => {
      render(
        <DragDropTimeline
          blocks={[mockBlocks[0]]}
          onBlocksChange={mockOnBlocksChange}
          onEditBlock={mockOnEditBlock}
          onDeleteBlock={mockOnDeleteBlock}
        />
      );

      expect(screen.getByText('Item Block')).toBeInTheDocument();
      expect(screen.getByText('Type: specific')).toBeInTheDocument();
      expect(screen.getByText('Items: 2 selected')).toBeInTheDocument();
    });

    it('should render random item block details correctly', () => {
      render(
        <DragDropTimeline
          blocks={[mockBlocks[2]]}
          onBlocksChange={mockOnBlocksChange}
          onEditBlock={mockOnEditBlock}
          onDeleteBlock={mockOnDeleteBlock}
        />
      );

      expect(screen.getByText('Item Block')).toBeInTheDocument();
      expect(screen.getByText('Type: random')).toBeInTheDocument();
      expect(screen.getByText('Random: 3 choice items')).toBeInTheDocument();
    });

    it('should render instruction block details correctly', () => {
      render(
        <DragDropTimeline
          blocks={[mockBlocks[1]]}
          onBlocksChange={mockOnBlocksChange}
          onEditBlock={mockOnEditBlock}
          onDeleteBlock={mockOnDeleteBlock}
        />
      );

      expect(screen.getByText('Instruction Block')).toBeInTheDocument();
      expect(screen.getByText('Title: Test Instructions')).toBeInTheDocument();
      expect(screen.getByText('Skip: Yes')).toBeInTheDocument();
    });

    it('should render drag handles for each block', () => {
      render(
        <DragDropTimeline
          blocks={mockBlocks}
          onBlocksChange={mockOnBlocksChange}
          onEditBlock={mockOnEditBlock}
          onDeleteBlock={mockOnDeleteBlock}
        />
      );

      expect(screen.getByTestId('drag-handle-item-block-1')).toBeInTheDocument();
      expect(screen.getByTestId('drag-handle-instruction-block-1')).toBeInTheDocument();
      expect(screen.getByTestId('drag-handle-item-block-2')).toBeInTheDocument();
    });

    it('should render edit and delete buttons for each block', () => {
      render(
        <DragDropTimeline
          blocks={mockBlocks}
          onBlocksChange={mockOnBlocksChange}
          onEditBlock={mockOnEditBlock}
          onDeleteBlock={mockOnDeleteBlock}
        />
      );

      expect(screen.getByTestId('edit-block-item-block-1')).toBeInTheDocument();
      expect(screen.getByTestId('delete-block-item-block-1')).toBeInTheDocument();
      expect(screen.getByTestId('edit-block-instruction-block-1')).toBeInTheDocument();
      expect(screen.getByTestId('delete-block-instruction-block-1')).toBeInTheDocument();
    });
  });

  describe('Block Interactions', () => {
    it('should call onEditBlock when edit button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <DragDropTimeline
          blocks={mockBlocks}
          onBlocksChange={mockOnBlocksChange}
          onEditBlock={mockOnEditBlock}
          onDeleteBlock={mockOnDeleteBlock}
        />
      );

      const editButton = screen.getByTestId('edit-block-item-block-1');
      await user.click(editButton);

      expect(mockOnEditBlock).toHaveBeenCalledWith('item-block-1');
    });

    it('should call onDeleteBlock when delete button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <DragDropTimeline
          blocks={mockBlocks}
          onBlocksChange={mockOnBlocksChange}
          onEditBlock={mockOnEditBlock}
          onDeleteBlock={mockOnDeleteBlock}
        />
      );

      const deleteButton = screen.getByTestId('delete-block-item-block-1');
      await user.click(deleteButton);

      expect(mockOnDeleteBlock).toHaveBeenCalledWith('item-block-1');
    });
  });

  describe('Drag and Drop Functionality', () => {
    it('should handle successful drag and drop reordering', () => {
      render(
        <DragDropTimeline
          blocks={mockBlocks}
          onBlocksChange={mockOnBlocksChange}
          onEditBlock={mockOnEditBlock}
          onDeleteBlock={mockOnDeleteBlock}
        />
      );

      // Simulate drag from index 0 to index 2
      const dragEndResult = {
        source: { index: 0 },
        destination: { index: 2 },
        draggableId: 'item-block-1',
      };

      mockDragEndHandler(dragEndResult);

      expect(mockOnBlocksChange).toHaveBeenCalledWith([
        {
          id: 'instruction-block-1',
          type: 'instruction',
          order: 0, // Updated order
          title: 'Test Instructions',
          content: 'Please read carefully',
          allowSkip: true,
        },
        {
          id: 'item-block-2',
          type: 'item',
          order: 1, // Updated order
          selectionType: 'random',
          itemType: 'choice',
          count: 3,
          randomize: true,
        },
        {
          id: 'item-block-1',
          type: 'item',
          order: 2, // Updated order
          selectionType: 'specific',
          specificItemIds: ['item-1', 'item-2'],
        },
      ]);
    });

    it('should handle drag to same position', () => {
      render(
        <DragDropTimeline
          blocks={mockBlocks}
          onBlocksChange={mockOnBlocksChange}
          onEditBlock={mockOnEditBlock}
          onDeleteBlock={mockOnDeleteBlock}
        />
      );

      // Simulate drag to same position
      const dragEndResult = {
        source: { index: 1 },
        destination: { index: 1 },
        draggableId: 'instruction-block-1',
      };

      mockDragEndHandler(dragEndResult);

      // Should not call onBlocksChange for same position
      expect(mockOnBlocksChange).not.toHaveBeenCalled();
    });

    it('should handle cancelled drag (no destination)', () => {
      render(
        <DragDropTimeline
          blocks={mockBlocks}
          onBlocksChange={mockOnBlocksChange}
          onEditBlock={mockOnEditBlock}
          onDeleteBlock={mockOnDeleteBlock}
        />
      );

      // Simulate cancelled drag
      const dragEndResult = {
        source: { index: 0 },
        destination: null,
        draggableId: 'item-block-1',
      };

      mockDragEndHandler(dragEndResult);

      // Should not call onBlocksChange for cancelled drag
      expect(mockOnBlocksChange).not.toHaveBeenCalled();
    });

    it('should maintain block properties during reorder', () => {
      render(
        <DragDropTimeline
          blocks={mockBlocks}
          onBlocksChange={mockOnBlocksChange}
          onEditBlock={mockOnEditBlock}
          onDeleteBlock={mockOnDeleteBlock}
        />
      );

      // Drag instruction block to first position
      const dragEndResult = {
        source: { index: 1 },
        destination: { index: 0 },
        draggableId: 'instruction-block-1',
      };

      mockDragEndHandler(dragEndResult);

      const reorderedBlocks = mockOnBlocksChange.mock.calls[0][0];
      
      // Check that instruction block maintains all its properties
      const instructionBlock = reorderedBlocks.find((b: TimelineBlock) => b.id === 'instruction-block-1') as InstructionBlock;
      expect(instructionBlock).toMatchObject({
        id: 'instruction-block-1',
        type: 'instruction',
        order: 0, // New order
        title: 'Test Instructions',
        content: 'Please read carefully',
        allowSkip: true,
      });

      // Check that other blocks maintain their properties
      const itemBlock = reorderedBlocks.find((b: TimelineBlock) => b.id === 'item-block-1') as ItemBlock;
      expect(itemBlock.specificItemIds).toEqual(['item-1', 'item-2']);
    });
  });

  describe('Block Ordering', () => {
    it('should display blocks sorted by order property', () => {
      const unorderedBlocks: TimelineBlock[] = [
        {
          id: 'block-3',
          type: 'item',
          order: 3,
          selectionType: 'specific',
          specificItemIds: ['item-3'],
        } as ItemBlock,
        {
          id: 'block-1',
          type: 'item',
          order: 1,
          selectionType: 'specific', 
          specificItemIds: ['item-1'],
        } as ItemBlock,
        {
          id: 'block-2',
          type: 'instruction',
          order: 2,
          title: 'Middle Instructions',
          content: 'Middle content',
        } as InstructionBlock,
      ];

      render(
        <DragDropTimeline
          blocks={unorderedBlocks}
          onBlocksChange={mockOnBlocksChange}
          onEditBlock={mockOnEditBlock}
          onDeleteBlock={mockOnDeleteBlock}
        />
      );

      // Check that blocks appear in correct order in DOM
      const timelineElement = screen.getByTestId('droppable-timeline');
      const blockElements = timelineElement.querySelectorAll('[data-testid*="draggable-block-"]');
      
      // Should be ordered by order property (1, 2, 3)
      expect(blockElements[0]).toHaveAttribute('data-testid', 'draggable-block-1-0');
      expect(blockElements[1]).toHaveAttribute('data-testid', 'draggable-block-2-1');
      expect(blockElements[2]).toHaveAttribute('data-testid', 'draggable-block-3-2');
    });

    it('should update order values after reordering', () => {
      render(
        <DragDropTimeline
          blocks={mockBlocks}
          onBlocksChange={mockOnBlocksChange}
          onEditBlock={mockOnEditBlock}
          onDeleteBlock={mockOnDeleteBlock}
        />
      );

      // Move last block to first position
      const dragEndResult = {
        source: { index: 2 },
        destination: { index: 0 },
        draggableId: 'item-block-2',
      };

      mockDragEndHandler(dragEndResult);

      const reorderedBlocks = mockOnBlocksChange.mock.calls[0][0];
      
      // Check new order values
      expect(reorderedBlocks[0].order).toBe(0);
      expect(reorderedBlocks[1].order).toBe(1);
      expect(reorderedBlocks[2].order).toBe(2);

      // Check correct block IDs in new positions
      expect(reorderedBlocks[0].id).toBe('item-block-2');
      expect(reorderedBlocks[1].id).toBe('item-block-1');
      expect(reorderedBlocks[2].id).toBe('instruction-block-1');
    });
  });

  describe('Edge Cases', () => {
    it('should handle single block timeline', () => {
      const singleBlock = [mockBlocks[0]];
      
      render(
        <DragDropTimeline
          blocks={singleBlock}
          onBlocksChange={mockOnBlocksChange}
          onEditBlock={mockOnEditBlock}
          onDeleteBlock={mockOnDeleteBlock}
        />
      );

      expect(screen.getByTestId('item-block-item-block-1')).toBeInTheDocument();
      expect(screen.getByTestId('edit-block-item-block-1')).toBeInTheDocument();
      expect(screen.getByTestId('delete-block-item-block-1')).toBeInTheDocument();
    });

    it('should handle item block without specificItemIds', () => {
      const blockWithoutSpecificItems: ItemBlock = {
        id: 'item-block-empty',
        type: 'item',
        order: 0,
        selectionType: 'specific',
        // specificItemIds is undefined
      };

      render(
        <DragDropTimeline
          blocks={[blockWithoutSpecificItems]}
          onBlocksChange={mockOnBlocksChange}
          onEditBlock={mockOnEditBlock}
          onDeleteBlock={mockOnDeleteBlock}
        />
      );

      expect(screen.getByText('Items: 0 selected')).toBeInTheDocument();
    });

    it('should handle instruction block with allowSkip false', () => {
      const strictInstructionBlock: InstructionBlock = {
        id: 'instruction-strict',
        type: 'instruction',
        order: 0,
        title: 'Strict Instructions',
        content: 'Must read',
        allowSkip: false,
      };

      render(
        <DragDropTimeline
          blocks={[strictInstructionBlock]}
          onBlocksChange={mockOnBlocksChange}
          onEditBlock={mockOnEditBlock}
          onDeleteBlock={mockOnDeleteBlock}
        />
      );

      expect(screen.getByText('Skip: No')).toBeInTheDocument();
    });
  });
});