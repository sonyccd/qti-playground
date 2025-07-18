import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QTIParserFactory } from '../QTIParserFactory';

// Mock the individual parsers
vi.mock('../qti21/QTI21Parser', () => ({
  QTI21Parser: vi.fn().mockImplementation(() => ({
    version: '2.1',
    parse: vi.fn().mockReturnValue({
      items: [],
      errors: [],
      unsupportedElements: [],
      version: '2.1'
    }),
    isCompatible: vi.fn().mockImplementation((xml) => 
      xml.includes('imsqti_v2p1') || xml.includes('qtiv2p1')
    ),
    getBlankTemplate: vi.fn().mockReturnValue('<qti21>template</qti21>'),
    getConstants: vi.fn().mockReturnValue({
      itemTypeLabels: { choice: 'Multiple Choice' },
      itemTypeColors: { choice: 'primary' }
    })
  }))
}));

vi.mock('../qti30/QTI30Parser', () => ({
  QTI30Parser: vi.fn().mockImplementation(() => ({
    version: '3.0',
    parse: vi.fn().mockReturnValue({
      items: [],
      errors: [],
      unsupportedElements: [],
      version: '3.0'
    }),
    isCompatible: vi.fn().mockImplementation((xml) => 
      xml.includes('imsqti_v3p0') || xml.includes('qtiv3p0') || xml.includes('qti-3-0')
    ),
    getBlankTemplate: vi.fn().mockReturnValue('<qti30>template</qti30>'),
    getConstants: vi.fn().mockReturnValue({
      itemTypeLabels: { choice: 'Multiple Choice', match: 'Match Interaction' },
      itemTypeColors: { choice: 'primary', match: 'secondary' }
    })
  }))
}));

describe('QTIParserFactory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getParser', () => {
    it('should return QTI 2.1 parser for version 2.1', () => {
      const parser = QTIParserFactory.getParser('2.1');
      expect(parser.version).toBe('2.1');
    });

    it('should return QTI 3.0 parser for version 3.0', () => {
      const parser = QTIParserFactory.getParser('3.0');
      expect(parser.version).toBe('3.0');
    });

    it('should throw error for unsupported version', () => {
      expect(() => QTIParserFactory.getParser('4.0' as any)).toThrow();
    });
  });

  describe('getParserFromXML', () => {
    it('should detect QTI 2.1 from XML namespace', () => {
      const xml = '<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1"></assessmentItem>';
      const parser = QTIParserFactory.getParserFromXML(xml);
      expect(parser.version).toBe('2.1');
    });

    it('should detect QTI 3.0 from XML namespace', () => {
      const xml = '<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v3p0"></assessmentItem>';
      const parser = QTIParserFactory.getParserFromXML(xml);
      expect(parser.version).toBe('3.0');
    });

    it('should detect QTI 2.1 from schema location', () => {
      const xml = '<assessmentItem xsi:schemaLocation="http://www.imsglobal.org/xsd/qti/qtiv2p1/imsqti_v2p1.xsd"></assessmentItem>';
      const parser = QTIParserFactory.getParserFromXML(xml);
      expect(parser.version).toBe('2.1');
    });

    it('should default to QTI 3.0 for unknown XML', () => {
      const xml = '<assessmentItem></assessmentItem>';
      const parser = QTIParserFactory.getParserFromXML(xml);
      expect(parser.version).toBe('3.0');
    });
  });

  describe('getSupportedVersions', () => {
    it('should return all supported versions', () => {
      const versions = QTIParserFactory.getSupportedVersions();
      expect(versions).toEqual(['2.1', '3.0']);
    });
  });

  describe('getAllParsers', () => {
    it('should return all parsers', () => {
      const parsers = QTIParserFactory.getAllParsers();
      expect(parsers.size).toBe(2);
      expect(parsers.has('2.1')).toBe(true);
      expect(parsers.has('3.0')).toBe(true);
    });
  });
});