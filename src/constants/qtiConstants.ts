import { QTIParserFactory } from '@/parsers/QTIParserFactory';
import { QTIVersion } from '@/types/qtiVersions';

export const getItemTypeLabel = (type: string, version: QTIVersion = '2.1') => {
  const parser = QTIParserFactory.getParser(version);
  const constants = parser.getConstants();
  return constants.itemTypeLabels[type] || 'Unknown';
};

export const getItemTypeColor = (type: string, version: QTIVersion = '2.1') => {
  const parser = QTIParserFactory.getParser(version);
  const constants = parser.getConstants();
  return constants.itemTypeColors[type] || 'error';
};

export const getSupportedItemTypes = (version: QTIVersion) => {
  const parser = QTIParserFactory.getParser(version);
  return parser.getSupportedItemTypes();
};

export const getQTIConstants = (version: QTIVersion) => {
  const parser = QTIParserFactory.getParser(version);
  return parser.getConstants();
};