import { describe, it, expect, beforeEach } from 'vitest';
import type { 
  Assessment, 
  QTIItem, 
  PackagedAssessment, 
  ItemBlock, 
  InstructionBlock,
  TimelineBlock 
} from '@/types/project';

// Mock implementation of assessment packaging service
class AssessmentPackagingService {
  packageAssessment(
    assessment: Assessment, 
    availableItems: QTIItem[]
  ): PackagedAssessment {
    const selectedItems: QTIItem[] = [];
    const instructionBlocks: InstructionBlock[] = [];

    // Process each block in order
    for (const block of assessment.blocks.sort((a, b) => a.order - b.order)) {
      if (block.type === 'item') {
        const itemBlock = block as ItemBlock;
        const blockItems = this.selectItemsFromBlock(itemBlock, availableItems);
        selectedItems.push(...blockItems);
      } else if (block.type === 'instruction') {
        instructionBlocks.push(block as InstructionBlock);
      }
    }

    return {
      id: `packaged-${assessment.id}-${Date.now()}`,
      sourceAssessmentId: assessment.id,
      title: assessment.title,
      description: assessment.description,
      selectedItems,
      instructionBlocks,
      settings: assessment.settings,
      packagedAt: new Date(),
      isPublished: false,
    };
  }

  private selectItemsFromBlock(block: ItemBlock, availableItems: QTIItem[]): QTIItem[] {
    if (block.selectionType === 'specific') {
      // Return specific items in the order they were selected
      const specificItems: QTIItem[] = [];
      for (const itemId of block.specificItemIds || []) {
        const item = availableItems.find(i => i.id === itemId);
        if (item) {
          specificItems.push(item);
        }
      }
      return specificItems;
    } else if (block.selectionType === 'random') {
      // Filter items by type and groups
      let filteredItems = availableItems;
      
      if (block.itemType) {
        filteredItems = filteredItems.filter(item => item.itemType === block.itemType);
      }
      
      if (block.groups && block.groups.length > 0) {
        filteredItems = filteredItems.filter(item => 
          item.groups?.some(group => block.groups!.includes(group))
        );
      }

      // Select up to 'count' items
      const count = Math.min(block.count || filteredItems.length, filteredItems.length);
      
      if (block.randomize) {
        // Shuffle and take first 'count' items
        const shuffled = [...filteredItems].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
      } else {
        // Take first 'count' items in original order
        return filteredItems.slice(0, count);
      }
    }

    return [];
  }

  validatePackaging(assessment: Assessment, availableItems: QTIItem[]): string[] {
    const errors: string[] = [];

    if (!assessment.title?.trim()) {
      errors.push('Assessment must have a title');
    }

    if (assessment.blocks.length === 0) {
      errors.push('Assessment must have at least one block');
    }

    // Check each item block
    const itemBlocks = assessment.blocks.filter(b => b.type === 'item') as ItemBlock[];
    for (const block of itemBlocks) {
      if (block.selectionType === 'specific') {
        if (!block.specificItemIds || block.specificItemIds.length === 0) {
          errors.push(`Block ${block.id} has no specific items selected`);
        } else {
          // Check if all specified items exist
          for (const itemId of block.specificItemIds) {
            if (!availableItems.find(item => item.id === itemId)) {
              errors.push(`Block ${block.id} references non-existent item: ${itemId}`);
            }
          }
        }
      } else if (block.selectionType === 'random') {
        if (!block.count || block.count <= 0) {
          errors.push(`Block ${block.id} must specify a count for random selection`);
        }
        
        // Check if there are enough items available
        let filteredItems = availableItems;
        if (block.itemType) {
          filteredItems = filteredItems.filter(item => item.itemType === block.itemType);
        }
        if (block.groups && block.groups.length > 0) {
          filteredItems = filteredItems.filter(item => 
            item.groups?.some(group => block.groups!.includes(group))
          );
        }
        
        if (filteredItems.length < (block.count || 0)) {
          errors.push(`Block ${block.id} requests ${block.count} items but only ${filteredItems.length} available`);
        }
      }
    }

    return errors;
  }
}

describe('AssessmentPackagingService', () => {
  let packagingService: AssessmentPackagingService;
  let mockItems: QTIItem[];
  let mockAssessment: Assessment;

  beforeEach(() => {
    packagingService = new AssessmentPackagingService();
    
    mockItems = [
      {
        id: 'item-1',
        title: 'Multiple Choice 1',
        content: '<assessmentItem>...</assessmentItem>',
        qtiVersion: '2.1',
        itemType: 'choice',
        groups: ['math', 'easy'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'item-2',
        title: 'Multiple Choice 2',
        content: '<assessmentItem>...</assessmentItem>',
        qtiVersion: '2.1',
        itemType: 'choice',
        groups: ['math', 'medium'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'item-3',
        title: 'Text Entry 1',
        content: '<assessmentItem>...</assessmentItem>',
        qtiVersion: '2.1',
        itemType: 'text-entry',
        groups: ['science'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'item-4',
        title: 'Essay Question',
        content: '<assessmentItem>...</assessmentItem>',
        qtiVersion: '3.0',
        itemType: 'essay',
        groups: ['english', 'hard'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockAssessment = {
      id: 'assessment-1',
      title: 'Test Assessment',
      description: 'A test assessment',
      blocks: [
        {
          id: 'block-1',
          type: 'item',
          order: 0,
          selectionType: 'specific',
          specificItemIds: ['item-1', 'item-2'],
        } as ItemBlock,
        {
          id: 'instruction-1',
          type: 'instruction',
          order: 1,
          title: 'Test Instructions',
          content: 'Please read carefully',
          allowSkip: false,
        } as InstructionBlock,
        {
          id: 'block-2',
          type: 'item',
          order: 2,
          selectionType: 'random',
          itemType: 'text-entry',
          count: 1,
          randomize: false,
        } as ItemBlock,
      ],
      settings: {
        timeLimit: 60,
        maxAttempts: 2,
        showFeedback: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  describe('Basic Packaging', () => {
    it('should create a packaged assessment', () => {
      const packaged = packagingService.packageAssessment(mockAssessment, mockItems);

      expect(packaged).toMatchObject({
        sourceAssessmentId: 'assessment-1',
        title: 'Test Assessment',
        description: 'A test assessment',
        settings: mockAssessment.settings,
        isPublished: false,
      });

      expect(packaged.id).toMatch(/^packaged-assessment-1-\d+$/);
      expect(packaged.packagedAt).toBeInstanceOf(Date);
    });

    it('should include selected items in correct order', () => {
      const packaged = packagingService.packageAssessment(mockAssessment, mockItems);

      expect(packaged.selectedItems).toHaveLength(3);
      expect(packaged.selectedItems[0].id).toBe('item-1'); // First specific item
      expect(packaged.selectedItems[1].id).toBe('item-2'); // Second specific item  
      expect(packaged.selectedItems[2].id).toBe('item-3'); // Random text-entry item
    });

    it('should include instruction blocks', () => {
      const packaged = packagingService.packageAssessment(mockAssessment, mockItems);

      expect(packaged.instructionBlocks).toHaveLength(1);
      expect(packaged.instructionBlocks[0]).toMatchObject({
        id: 'instruction-1',
        type: 'instruction',
        title: 'Test Instructions',
        content: 'Please read carefully',
        allowSkip: false,
      });
    });
  });

  describe('Specific Item Selection', () => {
    it('should select specific items by ID', () => {
      const assessment: Assessment = {
        ...mockAssessment,
        blocks: [
          {
            id: 'block-1',
            type: 'item',
            order: 0,
            selectionType: 'specific',
            specificItemIds: ['item-3', 'item-1'], // Different order
          } as ItemBlock,
        ],
      };

      const packaged = packagingService.packageAssessment(assessment, mockItems);

      expect(packaged.selectedItems).toHaveLength(2);
      expect(packaged.selectedItems[0].id).toBe('item-3');
      expect(packaged.selectedItems[1].id).toBe('item-1');
    });

    it('should skip non-existent items in specific selection', () => {
      const assessment: Assessment = {
        ...mockAssessment,
        blocks: [
          {
            id: 'block-1',
            type: 'item',
            order: 0,
            selectionType: 'specific',
            specificItemIds: ['item-1', 'non-existent', 'item-2'],
          } as ItemBlock,
        ],
      };

      const packaged = packagingService.packageAssessment(assessment, mockItems);

      expect(packaged.selectedItems).toHaveLength(2);
      expect(packaged.selectedItems[0].id).toBe('item-1');
      expect(packaged.selectedItems[1].id).toBe('item-2');
    });

    it('should handle empty specific item list', () => {
      const assessment: Assessment = {
        ...mockAssessment,
        blocks: [
          {
            id: 'block-1',
            type: 'item',
            order: 0,
            selectionType: 'specific',
            specificItemIds: [],
          } as ItemBlock,
        ],
      };

      const packaged = packagingService.packageAssessment(assessment, mockItems);
      expect(packaged.selectedItems).toHaveLength(0);
    });
  });

  describe('Random Item Selection', () => {
    it('should select items by type', () => {
      const assessment: Assessment = {
        ...mockAssessment,
        blocks: [
          {
            id: 'block-1',
            type: 'item',
            order: 0,
            selectionType: 'random',
            itemType: 'choice',
            count: 2,
            randomize: false,
          } as ItemBlock,
        ],
      };

      const packaged = packagingService.packageAssessment(assessment, mockItems);

      expect(packaged.selectedItems).toHaveLength(2);
      expect(packaged.selectedItems.every(item => item.itemType === 'choice')).toBe(true);
    });

    it('should select items by groups', () => {
      const assessment: Assessment = {
        ...mockAssessment,
        blocks: [
          {
            id: 'block-1',
            type: 'item',
            order: 0,
            selectionType: 'random',
            groups: ['math'],
            count: 2,
            randomize: false,
          } as ItemBlock,
        ],
      };

      const packaged = packagingService.packageAssessment(assessment, mockItems);

      expect(packaged.selectedItems).toHaveLength(2);
      expect(packaged.selectedItems.every(item => 
        item.groups?.includes('math')
      )).toBe(true);
    });

    it('should combine type and group filters', () => {
      const assessment: Assessment = {
        ...mockAssessment,
        blocks: [
          {
            id: 'block-1',
            type: 'item',
            order: 0,
            selectionType: 'random',
            itemType: 'choice',
            groups: ['easy'],
            count: 1,
            randomize: false,
          } as ItemBlock,
        ],
      };

      const packaged = packagingService.packageAssessment(assessment, mockItems);

      expect(packaged.selectedItems).toHaveLength(1);
      expect(packaged.selectedItems[0].id).toBe('item-1'); // Only choice with 'easy' group
    });

    it('should limit selection to count', () => {
      const assessment: Assessment = {
        ...mockAssessment,
        blocks: [
          {
            id: 'block-1',
            type: 'item',
            order: 0,
            selectionType: 'random',
            itemType: 'choice',
            count: 1,
            randomize: false,
          } as ItemBlock,
        ],
      };

      const packaged = packagingService.packageAssessment(assessment, mockItems);

      expect(packaged.selectedItems).toHaveLength(1);
    });

    it('should handle count exceeding available items', () => {
      const assessment: Assessment = {
        ...mockAssessment,
        blocks: [
          {
            id: 'block-1',
            type: 'item',
            order: 0,
            selectionType: 'random',
            itemType: 'essay',
            count: 5, // Only 1 essay item available
            randomize: false,
          } as ItemBlock,
        ],
      };

      const packaged = packagingService.packageAssessment(assessment, mockItems);

      expect(packaged.selectedItems).toHaveLength(1); // Should get all available
    });
  });

  describe('Block Order Processing', () => {
    it('should process blocks in order', () => {
      const assessment: Assessment = {
        ...mockAssessment,
        blocks: [
          {
            id: 'block-2',
            type: 'item',
            order: 1,
            selectionType: 'specific',
            specificItemIds: ['item-2'],
          } as ItemBlock,
          {
            id: 'block-1',
            type: 'item',
            order: 0,
            selectionType: 'specific',
            specificItemIds: ['item-1'],
          } as ItemBlock,
        ],
      };

      const packaged = packagingService.packageAssessment(assessment, mockItems);

      expect(packaged.selectedItems).toHaveLength(2);
      expect(packaged.selectedItems[0].id).toBe('item-1'); // Block with order 0 first
      expect(packaged.selectedItems[1].id).toBe('item-2'); // Block with order 1 second
    });
  });

  describe('Validation', () => {
    it('should validate successful assessment', () => {
      const errors = packagingService.validatePackaging(mockAssessment, mockItems);
      expect(errors).toHaveLength(0);
    });

    it('should require assessment title', () => {
      const assessment = { ...mockAssessment, title: '' };
      const errors = packagingService.validatePackaging(assessment, mockItems);
      
      expect(errors).toContain('Assessment must have a title');
    });

    it('should require at least one block', () => {
      const assessment = { ...mockAssessment, blocks: [] };
      const errors = packagingService.validatePackaging(assessment, mockItems);
      
      expect(errors).toContain('Assessment must have at least one block');
    });

    it('should validate specific item selection', () => {
      const assessment: Assessment = {
        ...mockAssessment,
        blocks: [
          {
            id: 'block-1',
            type: 'item',
            order: 0,
            selectionType: 'specific',
            specificItemIds: [],
          } as ItemBlock,
        ],
      };

      const errors = packagingService.validatePackaging(assessment, mockItems);
      expect(errors).toContain('Block block-1 has no specific items selected');
    });

    it('should validate non-existent specific items', () => {
      const assessment: Assessment = {
        ...mockAssessment,
        blocks: [
          {
            id: 'block-1',
            type: 'item',
            order: 0,
            selectionType: 'specific',
            specificItemIds: ['item-1', 'non-existent-item'],
          } as ItemBlock,
        ],
      };

      const errors = packagingService.validatePackaging(assessment, mockItems);
      expect(errors).toContain('Block block-1 references non-existent item: non-existent-item');
    });

    it('should validate random selection count', () => {
      const assessment: Assessment = {
        ...mockAssessment,
        blocks: [
          {
            id: 'block-1',
            type: 'item',
            order: 0,
            selectionType: 'random',
            itemType: 'choice',
            count: 0,
          } as ItemBlock,
        ],
      };

      const errors = packagingService.validatePackaging(assessment, mockItems);
      expect(errors).toContain('Block block-1 must specify a count for random selection');
    });

    it('should validate available items for random selection', () => {
      const assessment: Assessment = {
        ...mockAssessment,
        blocks: [
          {
            id: 'block-1',
            type: 'item',
            order: 0,
            selectionType: 'random',
            itemType: 'choice',
            groups: ['nonexistent-group'],
            count: 5,
          } as ItemBlock,
        ],
      };

      const errors = packagingService.validatePackaging(assessment, mockItems);
      expect(errors).toContain('Block block-1 requests 5 items but only 0 available');
    });
  });

  describe('Edge Cases', () => {
    it('should handle assessment without description', () => {
      const assessment = { ...mockAssessment };
      delete assessment.description;

      const packaged = packagingService.packageAssessment(assessment, mockItems);
      expect(packaged.description).toBeUndefined();
    });

    it('should handle empty available items', () => {
      const packaged = packagingService.packageAssessment(mockAssessment, []);
      expect(packaged.selectedItems).toHaveLength(0);
    });

    it('should handle blocks without groups', () => {
      const itemsWithoutGroups: QTIItem[] = [
        {
          id: 'item-no-groups',
          title: 'Item without groups',
          content: '<assessmentItem>...</assessmentItem>',
          qtiVersion: '2.1',
          itemType: 'choice',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const assessment: Assessment = {
        ...mockAssessment,
        blocks: [
          {
            id: 'block-1',
            type: 'item',
            order: 0,
            selectionType: 'random',
            itemType: 'choice',
            count: 1,
            groups: ['math'], // Looking for group that doesn't exist on item
          } as ItemBlock,
        ],
      };

      const packaged = packagingService.packageAssessment(assessment, itemsWithoutGroups);
      expect(packaged.selectedItems).toHaveLength(0);
    });
  });
});