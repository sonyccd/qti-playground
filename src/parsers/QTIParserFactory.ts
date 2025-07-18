import { QTIParserInterface } from './base/QTIParserInterface';
import { QTI21Parser } from './qti21/QTI21Parser';
import { QTI30Parser } from './qti30/QTI30Parser';
import { QTIVersion } from '@/types/qtiVersions';

export class QTIParserFactory {
  private static parsers: Map<QTIVersion, QTIParserInterface> = new Map();
  
  static {
    // Initialize parsers
    this.parsers.set('2.1', new QTI21Parser());
    this.parsers.set('3.0', new QTI30Parser());
  }
  
  /**
   * Get parser for specific QTI version
   */
  static getParser(version: QTIVersion): QTIParserInterface {
    const parser = this.parsers.get(version);
    if (!parser) {
      throw new Error(`No parser available for QTI version ${version}`);
    }
    return parser;
  }
  
  /**
   * Auto-detect QTI version from XML content and return appropriate parser
   */
  static getParserFromXML(xmlContent: string): QTIParserInterface {
    // Try to detect version from XML content
    const detectedVersion = this.detectVersion(xmlContent);
    
    if (detectedVersion) {
      return this.getParser(detectedVersion);
    }
    
    // Fallback: try each parser to see which one is compatible
    for (const [version, parser] of this.parsers) {
      if (parser.isCompatible(xmlContent)) {
        return parser;
      }
    }
    
    // Default to QTI 2.1 if no compatible parser found
    return this.getParser('2.1');
  }
  
  /**
   * Detect QTI version from XML content
   */
  private static detectVersion(xmlContent: string): QTIVersion | null {
    // Look for version-specific namespaces
    if (xmlContent.includes('imsqti_v3p0')) {
      return '3.0';
    }
    if (xmlContent.includes('imsqti_v2p1')) {
      return '2.1';
    }
    
    // Look for version-specific elements or attributes
    if (xmlContent.includes('qti-3-0')) {
      return '3.0';
    }
    
    return null;
  }
  
  /**
   * Get all available parsers
   */
  static getAllParsers(): Map<QTIVersion, QTIParserInterface> {
    return new Map(this.parsers);
  }
  
  /**
   * Get all supported versions
   */
  static getSupportedVersions(): QTIVersion[] {
    return Array.from(this.parsers.keys());
  }
}