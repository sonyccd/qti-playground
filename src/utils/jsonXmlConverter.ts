import { QTIItem, QTIChoice, QTIParseResult } from '@/types/qti';
import { ContentFormat } from '@/types/contentFormat';

// JSON representation of QTI 3.0 structures
export interface QTIJsonItem {
  '@type': 'assessmentItem';
  identifier: string;
  title: string;
  adaptive?: boolean;
  timeDependent?: boolean;
  responseDeclaration?: QTIJsonResponseDeclaration;
  outcomeDeclaration?: QTIJsonOutcomeDeclaration | QTIJsonOutcomeDeclaration[];
  itemBody: QTIJsonItemBody;
  responseProcessing?: QTIJsonResponseProcessing;
}

export interface QTIJsonResponseDeclaration {
  identifier: string;
  cardinality: 'single' | 'multiple' | 'ordered' | 'record';
  baseType: string;
  correctResponse?: {
    value: string | string[];
  };
  mapping?: {
    defaultValue?: number;
    mapEntry?: Array<{
      mapKey: string;
      mappedValue: number;
    }>;
    mapEntries?: Array<{
      mapKey: string;
      mappedValue: number;
    }>;
  };
}

export interface QTIJsonOutcomeDeclaration {
  identifier: string;
  cardinality: 'single' | 'multiple' | 'ordered' | 'record';
  baseType: string;
  defaultValue?: {
    value: string | number;
  };
}

export interface QTIJsonItemBody {
  content: Array<QTIJsonElement>;
}

export interface QTIJsonElement {
  '@type': string;
  text?: string;
  children?: QTIJsonElement[];
  attributes?: Record<string, string | number | boolean>;
  responseIdentifier?: string;
  prompt?: string;
  choices?: Array<{
    identifier: string;
    text: string;
  }>;
  content?: QTIJsonElement[];
  identifier?: string;
}

export interface QTIJsonResponseProcessing {
  template?: string;
  responseRules?: unknown[]; // For custom response processing
  customLogic?: unknown;
  score?: number;
}

export interface QTIJsonChoiceInteraction extends QTIJsonElement {
  '@type': 'choiceInteraction';
  responseIdentifier: string;
  shuffle: boolean;
  maxChoices: number;
  prompt?: string;
  choices: Array<{
    identifier: string;
    text: string;
  }>;
}

export interface QTIJsonTest {
  '@type': 'assessmentTest';
  identifier: string;
  title: string;
  outcomeDeclarations?: QTIJsonOutcomeDeclaration[];
  testParts?: QTIJsonTestPart[];
  items?: QTIJsonItem[]; // For backward compatibility
}

export interface QTIJsonTestPart {
  identifier: string;
  navigationMode: 'linear' | 'nonlinear';
  submissionMode: 'individual' | 'simultaneous';
  scoreAggregation?: 'sum' | 'avg' | 'max' | 'min';
  assessmentSections: QTIJsonAssessmentSection[];
}

export interface QTIJsonAssessmentSection {
  identifier: string;
  title: string;
  visible: boolean;
  assessmentItems: QTIJsonItem[];
}

/**
 * Converts QTI XML content to JSON format
 */
export const xmlToJson = (xmlContent: string): string => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
  
  // Check for parsing errors
  const parseError = xmlDoc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Invalid XML format');
  }

  const rootElement = xmlDoc.documentElement;
  
  if (rootElement.tagName === 'assessmentItem') {
    return JSON.stringify(convertXmlItemToJson(rootElement), null, 2);
  } else if (rootElement.tagName === 'assessmentTest') {
    return JSON.stringify(convertXmlTestToJson(rootElement), null, 2);
  } else {
    throw new Error('Unknown QTI root element');
  }
};

/**
 * Converts QTI JSON content to XML format
 */
export const jsonToXml = (jsonContent: string): string => {
  try {
    const jsonData = JSON.parse(jsonContent);
    
    if (jsonData['@type'] === 'assessmentItem') {
      return convertJsonItemToXml(jsonData as QTIJsonItem);
    } else if (jsonData['@type'] === 'assessmentTest') {
      return convertJsonTestToXml(jsonData as QTIJsonTest);
    } else {
      throw new Error('Unknown QTI JSON type');
    }
  } catch (error) {
    throw new Error('Invalid JSON format: ' + (error as Error).message);
  }
};

/**
 * Converts XML assessment item to JSON
 */
const convertXmlItemToJson = (itemElement: Element): QTIJsonItem => {
  const item: QTIJsonItem = {
    '@type': 'assessmentItem',
    identifier: itemElement.getAttribute('identifier') || '',
    title: itemElement.getAttribute('title') || '',
    adaptive: itemElement.getAttribute('adaptive') === 'true',
    timeDependent: itemElement.getAttribute('timeDependent') === 'true',
    itemBody: { content: [] }
  };

  // Parse response declaration
  const responseDecl = itemElement.querySelector('responseDeclaration');
  if (responseDecl) {
    item.responseDeclaration = {
      identifier: responseDecl.getAttribute('identifier') || '',
      cardinality: responseDecl.getAttribute('cardinality') as 'single' | 'multiple' | 'ordered' | 'record' || 'single',
      baseType: responseDecl.getAttribute('baseType') || 'identifier'
    };

    // Parse correct response
    const correctResponse = responseDecl.querySelector('correctResponse');
    if (correctResponse) {
      const values = Array.from(correctResponse.querySelectorAll('value')).map(v => v.textContent || '');
      item.responseDeclaration!.correctResponse = {
        value: values.length === 1 ? values[0] : values
      };
    }
  }

  // Parse outcome declarations
  const outcomeDecls = itemElement.querySelectorAll('outcomeDeclaration');
  if (outcomeDecls.length > 0) {
    item.outcomeDeclaration = Array.from(outcomeDecls).map(outcomeDecl => ({
      identifier: outcomeDecl.getAttribute('identifier') || '',
      cardinality: outcomeDecl.getAttribute('cardinality') as 'single' | 'multiple' | 'ordered' | 'record' || 'single',
      baseType: outcomeDecl.getAttribute('baseType') || 'float'
    }));
  }

  // Parse item body
  const itemBody = itemElement.querySelector('itemBody');
  if (itemBody) {
    item.itemBody = convertXmlItemBodyToJson(itemBody);
  }

  // Parse response processing
  const responseProcessing = itemElement.querySelector('responseProcessing');
  if (responseProcessing) {
    const template = responseProcessing.getAttribute('template');
    if (template) {
      item.responseProcessing = { template };
    }
  }

  return item;
};

/**
 * Converts XML test to JSON
 */
const convertXmlTestToJson = (testElement: Element): QTIJsonTest => {
  const test: QTIJsonTest = {
    '@type': 'assessmentTest',
    identifier: testElement.getAttribute('identifier') || '',
    title: testElement.getAttribute('title') || '',
    items: []
  };

  // Parse assessment items
  const items = testElement.querySelectorAll('assessmentItem');
  test.items = Array.from(items).map(item => convertXmlItemToJson(item));

  return test;
};

/**
 * Converts XML item body to JSON
 */
const convertXmlItemBodyToJson = (itemBodyElement: Element): QTIJsonItemBody => {
  const content: QTIJsonElement[] = [];

  Array.from(itemBodyElement.children).forEach(child => {
    if (child.tagName === 'choiceInteraction') {
      const choiceInteraction: QTIJsonChoiceInteraction = {
        '@type': 'choiceInteraction',
        responseIdentifier: child.getAttribute('responseIdentifier') || '',
        shuffle: child.getAttribute('shuffle') === 'true',
        maxChoices: parseInt(child.getAttribute('maxChoices') || '1'),
        choices: []
      };

      // Parse prompt
      const prompt = child.querySelector('prompt');
      if (prompt) {
        choiceInteraction.prompt = prompt.textContent || '';
      }

      // Parse choices
      const choices = child.querySelectorAll('simpleChoice');
      choiceInteraction.choices = Array.from(choices).map(choice => ({
        identifier: choice.getAttribute('identifier') || '',
        text: choice.textContent || ''
      }));

      content.push(choiceInteraction);
    } else if (child.tagName === 'p') {
      content.push({
        '@type': 'paragraph',
        text: child.textContent || ''
      });
    } else {
      // Generic element conversion
      content.push({
        '@type': child.tagName,
        text: child.textContent || '',
        attributes: getElementAttributes(child)
      });
    }
  });

  return { content };
};

/**
 * Converts JSON item to XML
 */
const convertJsonItemToXml = (jsonItem: QTIJsonItem): string => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += `<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v3p0"\n`;
  xml += `                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n`;
  xml += `                xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v3p0 http://www.imsglobal.org/xsd/qti/qtiv3p0/imsqti_v3p0.xsd"\n`;
  xml += `                identifier="${jsonItem.identifier}"\n`;
  xml += `                title="${jsonItem.title}"\n`;
  xml += `                adaptive="${jsonItem.adaptive || false}"\n`;
  xml += `                timeDependent="${jsonItem.timeDependent || false}">\n\n`;

  // Add response declaration
  if (jsonItem.responseDeclaration) {
    xml += `  <responseDeclaration identifier="${jsonItem.responseDeclaration.identifier}" cardinality="${jsonItem.responseDeclaration.cardinality}" baseType="${jsonItem.responseDeclaration.baseType}">\n`;
    
    if (jsonItem.responseDeclaration.correctResponse) {
      xml += `    <correctResponse>\n`;
      const values = Array.isArray(jsonItem.responseDeclaration.correctResponse.value) 
        ? jsonItem.responseDeclaration.correctResponse.value 
        : [jsonItem.responseDeclaration.correctResponse.value];
      
      values.forEach(value => {
        xml += `      <value>${value}</value>\n`;
      });
      xml += `    </correctResponse>\n`;
    }
    
    // Add mapping if present
    if (jsonItem.responseDeclaration.mapping) {
      xml += `    <mapping`;
      if (jsonItem.responseDeclaration.mapping.defaultValue !== undefined) {
        xml += ` defaultValue="${jsonItem.responseDeclaration.mapping.defaultValue}"`;
      }
      xml += `>\n`;
      
      // Handle both mapEntry and mapEntries
      const mapEntries = jsonItem.responseDeclaration.mapping.mapEntries || jsonItem.responseDeclaration.mapping.mapEntry || [];
      if (Array.isArray(mapEntries)) {
        mapEntries.forEach(entry => {
          xml += `      <mapEntry mapKey="${entry.mapKey}" mappedValue="${entry.mappedValue}"/>\n`;
        });
      }
      
      xml += `    </mapping>\n`;
    }
    
    xml += `  </responseDeclaration>\n\n`;
  }

  // Add outcome declarations
  if (jsonItem.outcomeDeclaration) {
    // Handle both single outcomeDeclaration and array of outcomeDeclarations
    const outcomeDeclarations = Array.isArray(jsonItem.outcomeDeclaration) 
      ? jsonItem.outcomeDeclaration 
      : [jsonItem.outcomeDeclaration];
    
    outcomeDeclarations.forEach(outcome => {
      xml += `  <outcomeDeclaration identifier="${outcome.identifier}" cardinality="${outcome.cardinality}" baseType="${outcome.baseType}">\n`;
      if (outcome.defaultValue !== undefined) {
        xml += `    <defaultValue>\n`;
        xml += `      <value>${outcome.defaultValue.value || outcome.defaultValue}</value>\n`;
        xml += `    </defaultValue>\n`;
      }
      xml += `  </outcomeDeclaration>\n\n`;
    });
  }

  // Add item body
  xml += `  <itemBody>\n`;
  xml += convertJsonItemBodyToXml(jsonItem.itemBody, 4);
  xml += `  </itemBody>\n\n`;

  // Add response processing
  if (jsonItem.responseProcessing?.template) {
    xml += `  <responseProcessing template="${jsonItem.responseProcessing.template}"`;
    if (jsonItem.responseProcessing.score) {
      xml += ` data-custom-score="${jsonItem.responseProcessing.score}"`;
    }
    xml += `/>\n\n`;
  } else if (jsonItem.responseProcessing?.customLogic) {
    // Convert custom logic to QTI XML responseProcessing
    const customLogicStr = JSON.stringify(jsonItem.responseProcessing.customLogic).replace(/"/g, '&quot;');
    console.log('DEBUG: Converting JSON custom logic to XML:', jsonItem.responseProcessing.customLogic);
    console.log('DEBUG: XML comment string:', customLogicStr);
    xml += `  <responseProcessing>\n`;
    xml += `    <!-- Custom Logic: ${customLogicStr} -->\n`;
    xml += `    <responseCondition>\n`;
    xml += `      <responseIf>\n`;
    xml += `        <isNull>\n`;
    xml += `          <variable identifier="RESPONSE"/>\n`;
    xml += `        </isNull>\n`;
    xml += `        <setOutcomeValue identifier="SCORE">\n`;
    xml += `          <baseValue baseType="float">0</baseValue>\n`;
    xml += `        </setOutcomeValue>\n`;
    xml += `      </responseIf>\n`;
    xml += `      <responseElse>\n`;
    xml += `        <setOutcomeValue identifier="SCORE">\n`;
    xml += `          <baseValue baseType="float">0</baseValue>\n`;
    xml += `        </setOutcomeValue>\n`;
    xml += `      </responseElse>\n`;
    xml += `    </responseCondition>\n`;
    xml += `  </responseProcessing>\n\n`;
  }

  xml += `</assessmentItem>`;
  return xml;
};

/**
 * Converts JSON test to XML
 */
const convertJsonTestToXml = (jsonTest: QTIJsonTest): string => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += `<assessmentTest xmlns="http://www.imsglobal.org/xsd/imsqti_v3p0"\n`;
  xml += `                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n`;
  xml += `                xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v3p0 http://www.imsglobal.org/xsd/qti/qtiv3p0/imsqti_v3p0.xsd"\n`;
  xml += `                identifier="${jsonTest.identifier}"\n`;
  xml += `                title="${jsonTest.title}">\n\n`;

  // Add outcome declarations
  if (jsonTest.outcomeDeclarations && Array.isArray(jsonTest.outcomeDeclarations)) {
    jsonTest.outcomeDeclarations.forEach(outcome => {
      xml += `  <outcomeDeclaration identifier="${outcome.identifier}" cardinality="${outcome.cardinality}" baseType="${outcome.baseType}">\n`;
      if (outcome.defaultValue) {
        xml += `    <defaultValue>\n`;
        xml += `      <value>${outcome.defaultValue.value}</value>\n`;
        xml += `    </defaultValue>\n`;
      }
      xml += `  </outcomeDeclaration>\n\n`;
    });
  }

  // Add test parts structure
  if (jsonTest.testParts && Array.isArray(jsonTest.testParts)) {
    jsonTest.testParts.forEach(testPart => {
      xml += `  <testPart identifier="${testPart.identifier}" navigationMode="${testPart.navigationMode}" submissionMode="${testPart.submissionMode}"`;
      if (testPart.scoreAggregation) {
        xml += ` scoreAggregation="${testPart.scoreAggregation}"`;
      }
      xml += `>\n`;
      
      // Add assessment sections
      if (testPart.assessmentSections && Array.isArray(testPart.assessmentSections)) {
        testPart.assessmentSections.forEach(section => {
          xml += `    <assessmentSection identifier="${section.identifier}" title="${section.title}" visible="${section.visible}">\n`;
          
          // Add assessment items
          if (section.assessmentItems && Array.isArray(section.assessmentItems)) {
            section.assessmentItems.forEach(item => {
              const itemXml = convertJsonItemToXml(item).replace(/^<\?xml.*?\n/, '').replace(/xmlns[^>]*>/g, '>');
              // Indent the item XML
              const indentedItemXml = itemXml.split('\n').map(line => line ? `      ${line}` : line).join('\n');
              xml += indentedItemXml;
              xml += '\n';
            });
          }
          
          xml += `    </assessmentSection>\n`;
        });
      }
      
      xml += `  </testPart>\n\n`;
    });
  }

  // Add items directly (for backward compatibility)
  if (jsonTest.items && Array.isArray(jsonTest.items)) {
    jsonTest.items.forEach(item => {
      xml += convertJsonItemToXml(item).replace(/^<\?xml.*?\n/, '').replace(/xmlns[^>]*>/g, '>');
      xml += '\n\n';
    });
  }

  xml += `</assessmentTest>`;
  return xml;
};

/**
 * Converts JSON item body to XML
 */
const convertJsonItemBodyToXml = (itemBody: QTIJsonItemBody, indent: number = 0): string => {
  let xml = '';
  const spaces = ' '.repeat(indent);

  if (itemBody.content && Array.isArray(itemBody.content)) {
    itemBody.content.forEach(element => {
    if (element['@type'] === 'choiceInteraction') {
      const choice = element as QTIJsonChoiceInteraction;
      xml += `${spaces}<choiceInteraction responseIdentifier="${choice.responseIdentifier}" shuffle="${choice.shuffle}" maxChoices="${choice.maxChoices}">\n`;
      
      if (choice.prompt) {
        xml += `${spaces}  <prompt>${choice.prompt}</prompt>\n`;
      }
      
      if (choice.choices && Array.isArray(choice.choices)) {
        choice.choices.forEach(simpleChoice => {
          xml += `${spaces}  <simpleChoice identifier="${simpleChoice.identifier}">${simpleChoice.text}</simpleChoice>\n`;
        });
      }
      
      xml += `${spaces}</choiceInteraction>\n`;
    } else if (element['@type'] === 'paragraph') {
      xml += `${spaces}<p>${element.text}</p>\n`;
    } else if (element['@type'] === 'textEntryInteraction') {
      xml += `${spaces}<textEntryInteraction responseIdentifier="${element.responseIdentifier || 'RESPONSE'}"`;
      if (element.attributes?.expectedLength) {
        xml += ` expectedLength="${element.attributes.expectedLength}"`;
      }
      xml += `/>\n`;
    } else if (element['@type'] === 'extendedTextInteraction') {
      xml += `${spaces}<extendedTextInteraction responseIdentifier="${element.responseIdentifier || 'RESPONSE'}"`;
      if (element.attributes?.expectedLength) {
        xml += ` expectedLength="${element.attributes.expectedLength}"`;
      }
      xml += `/>\n`;
    } else if (element['@type'] === 'sliderInteraction') {
      xml += `${spaces}<sliderInteraction responseIdentifier="${element.responseIdentifier || 'RESPONSE'}"`;
      if (element.attributes) {
        if (element.attributes.lowerBound) xml += ` lowerBound="${element.attributes.lowerBound}"`;
        if (element.attributes.upperBound) xml += ` upperBound="${element.attributes.upperBound}"`;
        if (element.attributes.step) xml += ` step="${element.attributes.step}"`;
        if (element.attributes.orientation) xml += ` orientation="${element.attributes.orientation}"`;
      }
      xml += `/>\n`;
    } else if (element['@type'] === 'orderInteraction') {
      xml += `${spaces}<orderInteraction responseIdentifier="${element.responseIdentifier || 'RESPONSE'}"`;
      if (element.attributes?.shuffle) {
        xml += ` shuffle="${element.attributes.shuffle}"`;
      }
      xml += `>\n`;
      if (element.choices && Array.isArray(element.choices)) {
        element.choices.forEach(simpleChoice => {
          xml += `${spaces}  <simpleChoice identifier="${simpleChoice.identifier}">${simpleChoice.text}</simpleChoice>\n`;
        });
      }
      xml += `${spaces}</orderInteraction>\n`;
    } else if (element['@type'] === 'hottextInteraction') {
      xml += `${spaces}<hottextInteraction responseIdentifier="${element.responseIdentifier || 'RESPONSE'}"`;
      if (element.attributes?.maxChoices) {
        xml += ` maxChoices="${element.attributes.maxChoices}"`;
      }
      xml += `>\n`;
      // Process hottext content
      if (element.content && Array.isArray(element.content)) {
        element.content.forEach(contentItem => {
          if (contentItem['@type'] === 'paragraph' && contentItem.children) {
            contentItem.children.forEach((child: QTIJsonElement) => {
              if (child['@type'] === 'hottext') {
                xml += `${spaces}  <hottext identifier="${child.identifier}">${child.text}</hottext>\n`;
              } else if (child['@type'] === 'text') {
                xml += `${spaces}  ${child.text}\n`;
              }
            });
          }
        });
      }
      xml += `${spaces}</hottextInteraction>\n`;
    } else {
      xml += `${spaces}<${element['@type']}>${element.text || ''}</${element['@type']}>\n`;
    }
    });
  }

  return xml;
};

/**
 * Gets all attributes from an element
 */
const getElementAttributes = (element: Element): Record<string, string> => {
  const attributes: Record<string, string> = {};
  Array.from(element.attributes).forEach(attr => {
    attributes[attr.name] = attr.value;
  });
  return attributes;
};

/**
 * Detects the format of content
 */
export const detectFormat = (content: string): ContentFormat => {
  const trimmed = content.trim();
  
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      return 'xml';
    }
  }
  
  return 'xml';
};