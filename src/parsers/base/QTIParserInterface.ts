import { QTIItem, UnsupportedElement, QTIAssessmentTest } from '@/types/qti';
import { QTIVersion } from '@/types/qtiVersions';

export interface QTIParseResult {
  items: QTIItem[];
  errors: string[];
  unsupportedElements: UnsupportedElement[];
  version: QTIVersion;
  assessmentTest?: QTIAssessmentTest;
}

export interface QTIParserInterface {
  readonly version: QTIVersion;
  
  /**
   * Parse QTI XML content and return structured data
   */
  parse(xmlContent: string): QTIParseResult;
  
  /**
   * Validate if the XML content is compatible with this parser version
   */
  isCompatible(xmlContent: string): boolean;
  
  /**
   * Get a blank template for this QTI version
   */
  getBlankTemplate(): string;
  
  /**
   * Insert a new item into existing XML at specified position
   */
  insertItem(xmlContent: string, itemXML: string, insertAfterIndex?: number): string;
  
  /**
   * Update correct response for a specific item
   */
  updateCorrectResponse(xmlContent: string, itemId: string, correctResponse: string | string[] | number): string;
  
  /**
   * Reorder items in the XML
   */
  reorderItems(xmlContent: string, oldIndex: number, newIndex: number): string;
  
  /**
   * Format XML content for display
   */
  formatXML(xmlContent: string): string;
  
  /**
   * Get supported item types for this version
   */
  getSupportedItemTypes(): string[];
  
  /**
   * Get version-specific constants
   */
  getConstants(): {
    itemTypeLabels: Record<string, string>;
    itemTypeColors: Record<string, string>;
    namespace: string;
    schemaLocation: string;
  };
}