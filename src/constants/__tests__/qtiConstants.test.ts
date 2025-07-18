import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getItemTypeLabel, 
  getItemTypeColor, 
  getSupportedItemTypes, 
  getQTIConstants 
} from '../qtiConstants';

// Mock the QTIParserFactory
vi.mock('@/parsers/QTIParserFactory', () => ({
  QTIParserFactory: {
    getParser: vi.fn().mockImplementation((version) => {
      if (version === '2.1') {
        return {
          getSupportedItemTypes: vi.fn().mockReturnValue(['choice', 'multipleResponse', 'textEntry', 'extendedText', 'hottext', 'slider', 'order']),
          getConstants: vi.fn().mockReturnValue({
            itemTypeLabels: {
              choice: 'Multiple Choice',
              multipleResponse: 'Multiple Response',
              textEntry: 'Fill in the Blank',
              extendedText: 'Extended Text',
              hottext: 'Hottext Selection',
              slider: 'Slider',
              order: 'Order Interaction',
            },
            itemTypeColors: {
              choice: 'primary',
              multipleResponse: 'secondary',
              textEntry: 'success',
              extendedText: 'info',
              hottext: 'warning',
              slider: 'default',
              order: 'destructive',
            },
            namespace: 'http://www.imsglobal.org/xsd/imsqti_v2p1',
            schemaLocation: 'http://www.imsglobal.org/xsd/imsqti_v2p1 http://www.imsglobal.org/xsd/qti/qtiv2p1/imsqti_v2p1.xsd'
          })
        };
      } else if (version === '3.0') {
        return {
          getSupportedItemTypes: vi.fn().mockReturnValue(['choice', 'multipleResponse', 'textEntry', 'extendedText', 'hottext', 'slider', 'order', 'match', 'associate']),
          getConstants: vi.fn().mockReturnValue({
            itemTypeLabels: {
              choice: 'Multiple Choice',
              multipleResponse: 'Multiple Response',
              textEntry: 'Fill in the Blank',
              extendedText: 'Extended Text',
              hottext: 'Hottext Selection',
              slider: 'Slider',
              order: 'Order Interaction',
              match: 'Match Interaction',
              associate: 'Associate Interaction',
            },
            itemTypeColors: {
              choice: 'primary',
              multipleResponse: 'secondary',
              textEntry: 'success',
              extendedText: 'info',
              hottext: 'warning',
              slider: 'default',
              order: 'destructive',
              match: 'primary',
              associate: 'secondary',
            },
            namespace: 'http://www.imsglobal.org/xsd/imsqti_v3p0',
            schemaLocation: 'http://www.imsglobal.org/xsd/imsqti_v3p0 http://www.imsglobal.org/xsd/qti/qtiv3p0/imsqti_v3p0.xsd'
          })
        };
      }
      throw new Error(`Unsupported version: ${version}`);
    })
  }
}));

describe('qtiConstants', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getItemTypeLabel', () => {
    it('should return correct label for QTI 2.1', () => {
      expect(getItemTypeLabel('choice', '2.1')).toBe('Multiple Choice');
      expect(getItemTypeLabel('textEntry', '2.1')).toBe('Fill in the Blank');
    });

    it('should return correct label for QTI 3.0', () => {
      expect(getItemTypeLabel('choice', '3.0')).toBe('Multiple Choice');
      expect(getItemTypeLabel('match', '3.0')).toBe('Match Interaction');
      expect(getItemTypeLabel('associate', '3.0')).toBe('Associate Interaction');
    });

    it('should return Unknown for unsupported type', () => {
      expect(getItemTypeLabel('unsupported', '2.1')).toBe('Unknown');
    });

    it('should default to QTI 3.0 when no version specified', () => {
      expect(getItemTypeLabel('choice')).toBe('Multiple Choice');
    });
  });

  describe('getItemTypeColor', () => {
    it('should return correct color for QTI 2.1', () => {
      expect(getItemTypeColor('choice', '2.1')).toBe('primary');
      expect(getItemTypeColor('textEntry', '2.1')).toBe('success');
    });

    it('should return correct color for QTI 3.0', () => {
      expect(getItemTypeColor('choice', '3.0')).toBe('primary');
      expect(getItemTypeColor('match', '3.0')).toBe('primary');
      expect(getItemTypeColor('associate', '3.0')).toBe('secondary');
    });

    it('should return error for unsupported type', () => {
      expect(getItemTypeColor('unsupported', '2.1')).toBe('error');
    });

    it('should default to QTI 3.0 when no version specified', () => {
      expect(getItemTypeColor('choice')).toBe('primary');
    });
  });

  describe('getSupportedItemTypes', () => {
    it('should return supported item types for QTI 2.1', () => {
      const types = getSupportedItemTypes('2.1');
      expect(types).toContain('choice');
      expect(types).toContain('multipleResponse');
      expect(types).toContain('textEntry');
      expect(types).toContain('extendedText');
      expect(types).toContain('hottext');
      expect(types).toContain('slider');
      expect(types).toContain('order');
      expect(types).not.toContain('match');
      expect(types).not.toContain('associate');
    });

    it('should return supported item types for QTI 3.0', () => {
      const types = getSupportedItemTypes('3.0');
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

  describe('getQTIConstants', () => {
    it('should return constants for QTI 2.1', () => {
      const constants = getQTIConstants('2.1');
      expect(constants.namespace).toBe('http://www.imsglobal.org/xsd/imsqti_v2p1');
      expect(constants.schemaLocation).toContain('qtiv2p1');
      expect(constants.itemTypeLabels.choice).toBe('Multiple Choice');
      expect(constants.itemTypeColors.choice).toBe('primary');
    });

    it('should return constants for QTI 3.0', () => {
      const constants = getQTIConstants('3.0');
      expect(constants.namespace).toBe('http://www.imsglobal.org/xsd/imsqti_v3p0');
      expect(constants.schemaLocation).toContain('qtiv3p0');
      expect(constants.itemTypeLabels.choice).toBe('Multiple Choice');
      expect(constants.itemTypeLabels.match).toBe('Match Interaction');
      expect(constants.itemTypeColors.choice).toBe('primary');
      expect(constants.itemTypeColors.match).toBe('primary');
    });
  });
});