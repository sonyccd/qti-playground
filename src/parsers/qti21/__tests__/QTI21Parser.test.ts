import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QTI21Parser } from '../QTI21Parser';

// Mock the utilities
vi.mock('@/utils/qtiParser', () => ({
  parseQTIXML: vi.fn().mockReturnValue({
    items: [
      {
        id: 'item1',
        title: 'Test Item',
        type: 'choice',
        prompt: 'Test prompt',
        choices: [
          { identifier: 'A', text: 'Option A' },
          { identifier: 'B', text: 'Option B' }
        ]
      }
    ],
    errors: [],
    unsupportedElements: []
  })
}));

vi.mock('@/utils/qtiTemplates', () => ({
  insertItemIntoXML: vi.fn().mockReturnValue('<updated>xml</updated>')
}));

vi.mock('@/utils/xmlUpdater', () => ({
  updateQTIXMLWithCorrectResponse: vi.fn().mockReturnValue('<updated>xml</updated>'),
  formatXML: vi.fn().mockReturnValue('<formatted>xml</formatted>'),
  reorderQTIItems: vi.fn().mockReturnValue('<reordered>xml</reordered>')
}));

describe('QTI21Parser', () => {
  let parser: QTI21Parser;

  beforeEach(() => {
    vi.clearAllMocks();
    parser = new QTI21Parser();
  });

  describe('version', () => {
    it('should return version 2.1', () => {
      expect(parser.version).toBe('2.1');
    });
  });

  describe('parse', () => {
    it('should parse QTI 2.1 XML content', () => {
      const xmlContent = '<assessmentItem></assessmentItem>';
      const result = parser.parse(xmlContent);
      
      expect(result.version).toBe('2.1');
      expect(result.items).toHaveLength(1);
      expect(result.items[0].type).toBe('choice');
    });
  });

  describe('isCompatible', () => {
    it('should return true for QTI 2.1 XML', () => {
      const xml = '<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1"></assessmentItem>';
      expect(parser.isCompatible(xml)).toBe(true);
    });

    it('should return true for qtiv2p1 schema', () => {
      const xml = '<assessmentItem xsi:schemaLocation="qtiv2p1"></assessmentItem>';
      expect(parser.isCompatible(xml)).toBe(true);
    });

    it('should return false for QTI 3.0 XML', () => {
      const xml = '<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v3p0"></assessmentItem>';
      expect(parser.isCompatible(xml)).toBe(false);
    });

    it('should return false for generic assessmentItem without version info', () => {
      const xml = '<assessmentItem></assessmentItem>';
      expect(parser.isCompatible(xml)).toBe(false);
    });
  });

  describe('getBlankTemplate', () => {
    it('should return QTI 2.1 blank template', () => {
      const template = parser.getBlankTemplate();
      expect(template).toContain('imsqti_v2p1');
      expect(template).toContain('QTI 2.1 Item');
      expect(template).toContain('assessmentItem');
    });
  });

  describe('getSupportedItemTypes', () => {
    it('should return supported item types', () => {
      const types = parser.getSupportedItemTypes();
      expect(types).toContain('choice');
      expect(types).toContain('multipleResponse');
      expect(types).toContain('textEntry');
      expect(types).toContain('extendedText');
      expect(types).toContain('hottext');
      expect(types).toContain('slider');
      expect(types).toContain('order');
    });
  });

  describe('getConstants', () => {
    it('should return QTI 2.1 constants', () => {
      const constants = parser.getConstants();
      
      expect(constants.itemTypeLabels.choice).toBe('Multiple Choice');
      expect(constants.itemTypeColors.choice).toBe('primary');
      expect(constants.namespace).toBe('http://www.imsglobal.org/xsd/imsqti_v2p1');
      expect(constants.schemaLocation).toContain('qtiv2p1');
    });
  });

  describe('insertItem', () => {
    it('should insert item into XML', () => {
      const result = parser.insertItem('<xml></xml>', '<item></item>');
      expect(result).toBe('<updated>xml</updated>');
    });
  });

  describe('updateCorrectResponse', () => {
    it('should update correct response in XML', () => {
      const result = parser.updateCorrectResponse('<xml></xml>', 'item1', 'A');
      expect(result).toBe('<updated>xml</updated>');
    });
  });

  describe('reorderItems', () => {
    it('should reorder items in XML', () => {
      const result = parser.reorderItems('<xml></xml>', 0, 1);
      expect(result).toBe('<reordered>xml</reordered>');
    });
  });

  describe('formatXML', () => {
    it('should format XML', () => {
      const result = parser.formatXML('<xml></xml>');
      expect(result).toBe('<formatted>xml</formatted>');
    });
  });
});