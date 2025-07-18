export type ContentFormat = 'xml' | 'json';

export interface ContentFormatInfo {
  format: ContentFormat;
  name: string;
  description: string;
  fileExtension: string;
  mimeType: string;
  editorMode: string;
}

export const CONTENT_FORMATS: Record<ContentFormat, ContentFormatInfo> = {
  xml: {
    format: 'xml',
    name: 'XML',
    description: 'Traditional QTI 3.0 XML format',
    fileExtension: '.xml',
    mimeType: 'application/xml',
    editorMode: 'xml'
  },
  json: {
    format: 'json',
    name: 'JSON',
    description: 'Modern QTI 3.0 JSON format',
    fileExtension: '.json',
    mimeType: 'application/json',
    editorMode: 'json'
  }
};

export const detectContentFormat = (content: string): ContentFormat => {
  const trimmed = content.trim();
  
  // Check for JSON format
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      // If JSON parsing fails, fall back to XML
    }
  }
  
  // Check for XML format
  if (trimmed.startsWith('<') && trimmed.includes('assessmentItem') || trimmed.includes('assessmentTest')) {
    return 'xml';
  }
  
  // Default to XML for QTI 3.0
  return 'xml';
};