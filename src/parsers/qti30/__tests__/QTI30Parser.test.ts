import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QTI30Parser } from '../QTI30Parser';

// Mock DOMParser
global.DOMParser = vi.fn().mockImplementation(() => ({
  parseFromString: vi.fn().mockReturnValue({
    querySelector: vi.fn().mockReturnValue(null),
    querySelectorAll: vi.fn().mockReturnValue([])
  })
}));

global.XMLSerializer = vi.fn().mockImplementation(() => ({
  serializeToString: vi.fn().mockReturnValue('<serialized>xml</serialized>')
}));

describe('QTI30Parser', () => {
  let parser: QTI30Parser;

  beforeEach(() => {
    vi.clearAllMocks();
    parser = new QTI30Parser();
  });

  describe('version', () => {
    it('should return version 3.0', () => {
      expect(parser.version).toBe('3.0');
    });
  });

  describe('parse', () => {
    it('should parse QTI 3.0 XML content', () => {
      const xmlContent = '<assessmentItem></assessmentItem>';
      const result = parser.parse(xmlContent);
      
      expect(result.version).toBe('3.0');
      expect(result.items).toHaveLength(0);
      expect(result.errors).toContain('No assessment items found in the QTI 3.0 file');
    });

    it('should handle parsing errors', () => {
      // Mock parseFromString to return parsererror
      const mockDoc = {
        querySelector: vi.fn().mockReturnValue({ tagName: 'parsererror' }),
        querySelectorAll: vi.fn().mockReturnValue([])
      };
      
      global.DOMParser = vi.fn().mockImplementation(() => ({
        parseFromString: vi.fn().mockReturnValue(mockDoc)
      }));

      const result = parser.parse('<invalid>xml');
      expect(result.errors).toContain('Invalid XML format');
    });
  });

  describe('isCompatible', () => {
    it('should return true for QTI 3.0 XML', () => {
      const xml = '<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v3p0"></assessmentItem>';
      expect(parser.isCompatible(xml)).toBe(true);
    });

    it('should return true for qtiv3p0 schema', () => {
      const xml = '<assessmentItem xsi:schemaLocation="qtiv3p0"></assessmentItem>';
      expect(parser.isCompatible(xml)).toBe(true);
    });

    it('should return true for qti-3-0 marker', () => {
      const xml = '<assessmentItem qti-3-0="true"></assessmentItem>';
      expect(parser.isCompatible(xml)).toBe(true);
    });

    it('should return false for QTI 2.1 XML', () => {
      const xml = '<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1"></assessmentItem>';
      expect(parser.isCompatible(xml)).toBe(false);
    });
  });

  describe('getBlankTemplate', () => {
    it('should return QTI 3.0 blank template', () => {
      const template = parser.getBlankTemplate();
      expect(template).toContain('imsqti_v3p0');
      expect(template).toContain('QTI 3.0 Item');
      expect(template).toContain('assessmentItem');
    });
  });

  describe('getSupportedItemTypes', () => {
    it('should return supported item types including QTI 3.0 specific ones', () => {
      const types = parser.getSupportedItemTypes();
      expect(types).toContain('choice');
      expect(types).toContain('multipleResponse');
      expect(types).toContain('textEntry');
      expect(types).toContain('extendedText');
      expect(types).toContain('hottext');
      expect(types).toContain('slider');
      expect(types).toContain('order');
      expect(types).toContain('match');
      expect(types).toContain('associate');
    });
  });

  describe('getConstants', () => {
    it('should return QTI 3.0 constants', () => {
      const constants = parser.getConstants();
      
      expect(constants.itemTypeLabels.choice).toBe('Multiple Choice');
      expect(constants.itemTypeLabels.match).toBe('Match Interaction');
      expect(constants.itemTypeLabels.associate).toBe('Associate Interaction');
      expect(constants.itemTypeColors.choice).toBe('primary');
      expect(constants.itemTypeColors.match).toBe('primary');
      expect(constants.itemTypeColors.associate).toBe('secondary');
      expect(constants.namespace).toBe('http://www.imsglobal.org/xsd/imsqti_v3p0');
      expect(constants.schemaLocation).toContain('qtiv3p0');
    });
  });

  describe('insertItem', () => {
    it('should insert item into XML', () => {
      const result = parser.insertItem('<xml></xml>', '<item></item>');
      expect(result).toContain('<xml></xml>');
      expect(result).toContain('<item></item>');
    });
  });

  describe('updateCorrectResponse', () => {
    it('should return XML unchanged for now', () => {
      const xml = '<xml></xml>';
      const result = parser.updateCorrectResponse(xml, 'item1', 'A');
      expect(result).toBe(xml);
    });
  });

  describe('reorderItems', () => {
    it('should return XML unchanged for now', () => {
      const xml = '<xml></xml>';
      const result = parser.reorderItems(xml, 0, 1);
      expect(result).toBe(xml);
    });
  });

  describe('formatXML', () => {
    it('should format XML using XMLSerializer', () => {
      const result = parser.formatXML('<xml></xml>');
      expect(result).toBe('<serialized>xml</serialized>');
    });

    it('should return original XML if formatting fails', () => {
      // Mock XMLSerializer to throw error
      global.XMLSerializer = vi.fn().mockImplementation(() => ({
        serializeToString: vi.fn().mockImplementation(() => {
          throw new Error('Serialization failed');
        })
      }));

      const xml = '<xml></xml>';
      const result = parser.formatXML(xml);
      expect(result).toBe(xml);
    });
  });
});