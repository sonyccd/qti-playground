import { describe, it, expect } from 'vitest';
import type {
  QTIItem,
  ItemBlock,
  InstructionBlock,
  TimelineBlock,
  Assessment,
  PackagedAssessment,
  Project
} from '../project';

describe('Project Types', () => {
  describe('QTIItem', () => {
    it('should have required properties', () => {
      const item: QTIItem = {
        id: 'item-1',
        title: 'Test Item',
        content: '<assessmentItem>...</assessmentItem>',
        qtiVersion: '2.1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(item.id).toBe('item-1');
      expect(item.title).toBe('Test Item');
      expect(item.qtiVersion).toBe('2.1');
    });

    it('should support optional itemType and groups', () => {
      const item: QTIItem = {
        id: 'item-1',
        title: 'Test Item',
        content: '<assessmentItem>...</assessmentItem>',
        qtiVersion: '2.1',
        itemType: 'choice',
        groups: ['algebra', 'easy'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(item.itemType).toBe('choice');
      expect(item.groups).toEqual(['algebra', 'easy']);
    });

    it('should support all item types', () => {
      const itemTypes = ['choice', 'text-entry', 'essay', 'drag-drop', 'hotspot', 'ordering'] as const;
      
      itemTypes.forEach(type => {
        const item: QTIItem = {
          id: `item-${type}`,
          title: `Test ${type} Item`,
          content: '<assessmentItem>...</assessmentItem>',
          qtiVersion: '2.1',
          itemType: type,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        expect(item.itemType).toBe(type);
      });
    });
  });

  describe('ItemBlock', () => {
    it('should create random selection item block', () => {
      const block: ItemBlock = {
        id: 'block-1',
        type: 'item',
        order: 0,
        selectionType: 'random',
        itemType: 'choice',
        count: 5,
        randomize: true,
        groups: ['algebra'],
      };

      expect(block.selectionType).toBe('random');
      expect(block.itemType).toBe('choice');
      expect(block.count).toBe(5);
      expect(block.groups).toEqual(['algebra']);
    });

    it('should create specific selection item block', () => {
      const block: ItemBlock = {
        id: 'block-2',
        type: 'item',
        order: 1,
        selectionType: 'specific',
        specificItemIds: ['item-1', 'item-2', 'item-3'],
      };

      expect(block.selectionType).toBe('specific');
      expect(block.specificItemIds).toEqual(['item-1', 'item-2', 'item-3']);
      expect(block.itemType).toBeUndefined();
      expect(block.count).toBeUndefined();
    });
  });

  describe('InstructionBlock', () => {
    it('should create instruction block with required properties', () => {
      const block: InstructionBlock = {
        id: 'instruction-1',
        type: 'instruction',
        order: 0,
        title: 'Test Instructions',
        content: 'Please read carefully...',
      };

      expect(block.type).toBe('instruction');
      expect(block.title).toBe('Test Instructions');
      expect(block.content).toBe('Please read carefully...');
    });

    it('should support optional allowSkip property', () => {
      const block: InstructionBlock = {
        id: 'instruction-1',
        type: 'instruction',
        order: 0,
        title: 'Test Instructions',
        content: 'Please read carefully...',
        allowSkip: false,
      };

      expect(block.allowSkip).toBe(false);
    });
  });

  describe('TimelineBlock Union Type', () => {
    it('should accept ItemBlock', () => {
      const itemBlock: ItemBlock = {
        id: 'block-1',
        type: 'item',
        order: 0,
        selectionType: 'random',
        itemType: 'choice',
        count: 3,
      };

      const timelineBlock: TimelineBlock = itemBlock;
      expect(timelineBlock.type).toBe('item');
    });

    it('should accept InstructionBlock', () => {
      const instructionBlock: InstructionBlock = {
        id: 'instruction-1',
        type: 'instruction',
        order: 0,
        title: 'Instructions',
        content: 'Read carefully',
      };

      const timelineBlock: TimelineBlock = instructionBlock;
      expect(timelineBlock.type).toBe('instruction');
    });
  });

  describe('Assessment', () => {
    it('should create assessment with timeline blocks', () => {
      const assessment: Assessment = {
        id: 'assessment-1',
        title: 'Test Assessment',
        description: 'A test assessment',
        blocks: [
          {
            id: 'block-1',
            type: 'item',
            order: 0,
            selectionType: 'random',
            itemType: 'choice',
            count: 3,
          },
          {
            id: 'instruction-1',
            type: 'instruction',
            order: 1,
            title: 'Instructions',
            content: 'Read carefully',
          },
        ],
        settings: {
          timeLimit: 60,
          maxAttempts: 2,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(assessment.blocks).toHaveLength(2);
      expect(assessment.blocks[0].type).toBe('item');
      expect(assessment.blocks[1].type).toBe('instruction');
    });

    it('should maintain backward compatibility with itemIds', () => {
      const assessment: Assessment = {
        id: 'assessment-1',
        title: 'Legacy Assessment',
        blocks: [],
        settings: {},
        itemIds: ['item-1', 'item-2'], // Legacy support
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(assessment.itemIds).toEqual(['item-1', 'item-2']);
    });
  });

  describe('PackagedAssessment', () => {
    it('should create packaged assessment with selected items', () => {
      const packagedAssessment: PackagedAssessment = {
        id: 'packaged-1',
        sourceAssessmentId: 'assessment-1',
        title: 'Packaged Test',
        selectedItems: [
          {
            id: 'item-1',
            title: 'Selected Item 1',
            content: '<assessmentItem>...</assessmentItem>',
            qtiVersion: '2.1',
            itemType: 'choice',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        instructionBlocks: [
          {
            id: 'instruction-1',
            type: 'instruction',
            order: 0,
            title: 'Test Instructions',
            content: 'Please read carefully',
          },
        ],
        settings: {
          timeLimit: 30,
        },
        packagedAt: new Date(),
        isPublished: false,
      };

      expect(packagedAssessment.selectedItems).toHaveLength(1);
      expect(packagedAssessment.instructionBlocks).toHaveLength(1);
      expect(packagedAssessment.isPublished).toBe(false);
    });
  });

  describe('Project', () => {
    it('should create project with items and assessments', () => {
      const project: Project = {
        id: 'project-1',
        name: 'Test Project',
        description: 'A test project',
        items: [
          {
            id: 'item-1',
            title: 'Test Item',
            content: '<assessmentItem>...</assessmentItem>',
            qtiVersion: '2.1',
            itemType: 'choice',
            groups: ['math', 'easy'],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        assessments: [
          {
            id: 'assessment-1',
            title: 'Test Assessment',
            blocks: [
              {
                id: 'block-1',
                type: 'item',
                order: 0,
                selectionType: 'specific',
                specificItemIds: ['item-1'],
              },
            ],
            settings: {},
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(project.items).toHaveLength(1);
      expect(project.assessments).toHaveLength(1);
      expect(project.items[0].groups).toEqual(['math', 'easy']);
      expect((project.assessments[0].blocks[0] as ItemBlock).specificItemIds).toEqual(['item-1']);
    });
  });
});