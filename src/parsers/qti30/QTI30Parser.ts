import { QTIParserInterface, QTIParseResult } from '../base/QTIParserInterface';
import { QTIVersion } from '@/types/qtiVersions';
import { QTIItem, QTIChoice, QTIHottextChoice, QTIOrderChoice, QTISliderConfig, UnsupportedElement, QTIAssessmentTest, QTITestPart, QTIAssessmentSection, QTIOutcomeDeclaration } from '@/types/qti';
import { detectFormat, jsonToXml } from '@/utils/jsonXmlConverter';
import { ContentFormat } from '@/types/contentFormat';
import { getBlankJsonTemplate } from '@/utils/qtiJsonTemplates';

export class QTI30Parser implements QTIParserInterface {
  readonly version: QTIVersion = '3.0';

  parse(content: string): QTIParseResult {
    const errors: string[] = [];
    const items: QTIItem[] = [];
    const unsupportedElements: Map<string, UnsupportedElement> = new Map();

    try {
      // Auto-detect format and convert JSON to XML if needed
      const format = detectFormat(content);
      let xmlContent = content;
      
      if (format === 'json') {
        try {
          xmlContent = jsonToXml(content);
        } catch (jsonError) {
          return {
            items: [],
            errors: ['Invalid JSON format: ' + (jsonError as Error).message],
            unsupportedElements: [],
            version: this.version
          };
        }
      }

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

      // Check for parsing errors
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        return {
          items: [],
          errors: ['Invalid XML format'],
          unsupportedElements: [],
          version: this.version
        };
      }

      // Check if this is an assessmentTest or individual assessmentItem
      const assessmentTest = xmlDoc.querySelector('assessmentTest');
      let assessmentTestData: QTIAssessmentTest | undefined;
      
      if (assessmentTest) {
        // Parse full assessment test
        assessmentTestData = this.parseAssessmentTest(assessmentTest, unsupportedElements);
        // Extract all items from test structure
        if (assessmentTestData.testParts && Array.isArray(assessmentTestData.testParts)) {
          assessmentTestData.testParts.forEach(testPart => {
            if (testPart.assessmentSections && Array.isArray(testPart.assessmentSections)) {
              testPart.assessmentSections.forEach(section => {
                if (section.assessmentItems && Array.isArray(section.assessmentItems)) {
                  items.push(...section.assessmentItems);
                }
              });
            }
          });
        }
        
        // Also check for direct assessmentItem elements under assessmentTest (non-standard but common)
        const directItems = assessmentTest.querySelectorAll(':scope > assessmentItem');
        directItems.forEach((itemElement, index) => {
          try {
            const item = this.parseAssessmentItem(itemElement, unsupportedElements);
            if (item) {
              items.push(item);
            }
          } catch (error) {
            errors.push(`Error parsing direct item ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        });
      } else {
        // Find all assessmentItem elements (individual items)
        const assessmentItems = xmlDoc.querySelectorAll('assessmentItem');
        
        if (assessmentItems.length === 0) {
          errors.push('No assessment items found in the QTI 3.0 file');
        }

        assessmentItems.forEach((itemElement, index) => {
          try {
            const item = this.parseAssessmentItem(itemElement, unsupportedElements);
            if (item) {
              items.push(item);
            }
          } catch (error) {
            errors.push(`Error parsing item ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        });
      }

      // Scan for unsupported elements
      this.scanForUnsupportedElements(xmlDoc, unsupportedElements);

      return {
        items,
        errors,
        unsupportedElements: Array.from(unsupportedElements.values()),
        version: this.version,
        assessmentTest: assessmentTestData
      };
    } catch (error) {
      return {
        items: [],
        errors: [`Failed to parse QTI 3.0 XML: ${error instanceof Error ? error.message : 'Unknown error'}`],
        unsupportedElements: [],
        version: this.version
      };
    }
  }

  isCompatible(content: string): boolean {
    // Check for QTI 3.0 specific namespace or schema in XML
    const hasQTI30Xml = content.includes('imsqti_v3p0') || 
                        content.includes('qtiv3p0') ||
                        content.includes('qti-3-0');
    
    // Check for QTI 3.0 JSON format
    const format = detectFormat(content);
    if (format === 'json') {
      try {
        const jsonData = JSON.parse(content);
        return jsonData['@type'] === 'assessmentItem' || jsonData['@type'] === 'assessmentTest';
      } catch {
        return false;
      }
    }
    
    return hasQTI30Xml;
  }

  getBlankTemplate(format: ContentFormat = 'xml'): string {
    if (format === 'json') {
      return JSON.stringify(getBlankJsonTemplate(), null, 2);
    }
    return this.getBlankXmlTemplate();
  }

  getBlankXmlTemplate(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v3p0" 
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v3p0 http://www.imsglobal.org/xsd/qti/qtiv3p0/imsqti_v3p0.xsd"
                identifier="sample-item" 
                title="New QTI 3.0 Item" 
                adaptive="false" 
                timeDependent="false">
  
  <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier">
    <correctResponse>
      <value>ChoiceA</value>
    </correctResponse>
  </responseDeclaration>
  
  <outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float">
    <defaultValue>
      <value>0</value>
    </defaultValue>
  </outcomeDeclaration>
  
  <itemBody>
    <div>
      <p>Enter your question text here.</p>
      <choiceInteraction responseIdentifier="RESPONSE" shuffle="false" maxChoices="1">
        <prompt>Select the correct answer:</prompt>
        <simpleChoice identifier="ChoiceA">Option A</simpleChoice>
        <simpleChoice identifier="ChoiceB">Option B</simpleChoice>
        <simpleChoice identifier="ChoiceC">Option C</simpleChoice>
        <simpleChoice identifier="ChoiceD">Option D</simpleChoice>
      </choiceInteraction>
    </div>
  </itemBody>
  
  <responseProcessing template="http://www.imsglobal.org/question/qti_v3p0/rptemplates/match_correct"/>
  
</assessmentItem>`;
  }

  insertItem(xmlContent: string, itemXML: string, insertAfterIndex?: number): string {
    // For now, use the same logic as QTI 2.1 but with QTI 3.0 adjustments
    return this.insertItemIntoXML(xmlContent, itemXML, insertAfterIndex);
  }

  updateCorrectResponse(xmlContent: string, itemId: string, correctResponse: string | string[] | number): string {
    // For now, use similar logic to QTI 2.1 but with QTI 3.0 adjustments
    return this.updateQTIXMLWithCorrectResponse(xmlContent, itemId, correctResponse);
  }

  reorderItems(xmlContent: string, oldIndex: number, newIndex: number): string {
    // For now, use similar logic to QTI 2.1
    return this.reorderQTIItems(xmlContent, oldIndex, newIndex);
  }

  formatXML(xmlContent: string): string {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
      const serializer = new XMLSerializer();
      return serializer.serializeToString(xmlDoc);
    } catch (error) {
      return xmlContent;
    }
  }

  getSupportedItemTypes(): string[] {
    // QTI 3.0 supports similar item types plus some additional ones
    return ['choice', 'multipleResponse', 'textEntry', 'extendedText', 'hottext', 'slider', 'order', 'match', 'associate'];
  }

  getConstants() {
    return {
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
    };
  }

  private parseAssessmentTest(testElement: Element, unsupportedElements: Map<string, UnsupportedElement>): QTIAssessmentTest {
    const identifier = testElement.getAttribute('identifier') || `test-${Date.now()}`;
    const title = testElement.getAttribute('title') || 'Untitled Test';
    
    // Parse outcome declarations at test level
    const outcomeDeclarations = this.parseOutcomeDeclarations(testElement);
    
    // Parse test parts
    const testParts: QTITestPart[] = [];
    const testPartElements = testElement.querySelectorAll('testPart');
    
    testPartElements.forEach(testPartElement => {
      const testPart = this.parseTestPart(testPartElement, unsupportedElements);
      if (testPart) {
        testParts.push(testPart);
      }
    });
    
    // If no testParts found, create a default one for non-standard structure
    if (testParts.length === 0) {
      testParts.push({
        identifier: 'default-testpart',
        navigationMode: 'linear',
        submissionMode: 'individual',
        assessmentSections: [{
          identifier: 'default-section',
          title: 'Default Section',
          visible: true,
          assessmentItems: [] // Items will be added as direct children
        }]
      });
    }
    
    return {
      identifier,
      title,
      testParts,
      outcomeDeclarations
    };
  }

  private parseTestPart(testPartElement: Element, unsupportedElements: Map<string, UnsupportedElement>): QTITestPart | null {
    const identifier = testPartElement.getAttribute('identifier') || `testPart-${Date.now()}`;
    const navigationMode = testPartElement.getAttribute('navigationMode') as 'linear' | 'nonlinear' || 'linear';
    const submissionMode = testPartElement.getAttribute('submissionMode') as 'individual' | 'simultaneous' || 'individual';
    const scoreAggregation = testPartElement.getAttribute('scoreAggregation') as 'sum' | 'avg' | 'max' | 'min' || undefined;
    
    // Parse assessment sections
    const assessmentSections: QTIAssessmentSection[] = [];
    const sectionElements = testPartElement.querySelectorAll('assessmentSection');
    
    sectionElements.forEach(sectionElement => {
      const section = this.parseAssessmentSection(sectionElement, unsupportedElements);
      if (section) {
        assessmentSections.push(section);
      }
    });
    
    return {
      identifier,
      navigationMode,
      submissionMode,
      scoreAggregation,
      assessmentSections
    };
  }

  private parseAssessmentSection(sectionElement: Element, unsupportedElements: Map<string, UnsupportedElement>): QTIAssessmentSection | null {
    const identifier = sectionElement.getAttribute('identifier') || `section-${Date.now()}`;
    const title = sectionElement.getAttribute('title') || 'Untitled Section';
    const visible = sectionElement.getAttribute('visible') !== 'false';
    
    // Parse assessment items within this section
    const assessmentItems: QTIItem[] = [];
    const itemElements = sectionElement.querySelectorAll('assessmentItem');
    
    itemElements.forEach(itemElement => {
      const item = this.parseAssessmentItem(itemElement, unsupportedElements);
      if (item) {
        assessmentItems.push(item);
      }
    });
    
    return {
      identifier,
      title,
      visible,
      assessmentItems
    };
  }

  private parseOutcomeDeclarations(element: Element): QTIOutcomeDeclaration[] {
    const declarations: QTIOutcomeDeclaration[] = [];
    const outcomeElements = element.querySelectorAll(':scope > outcomeDeclaration');
    
    outcomeElements.forEach(outcomeElement => {
      const identifier = outcomeElement.getAttribute('identifier') || '';
      const cardinality = outcomeElement.getAttribute('cardinality') as 'single' | 'multiple' | 'ordered' | 'record' || 'single';
      const baseType = outcomeElement.getAttribute('baseType') as QTIOutcomeDeclaration['baseType'] || 'float';
      
      // Parse default value
      let defaultValue: string | number | undefined;
      const defaultValueElement = outcomeElement.querySelector('defaultValue value');
      if (defaultValueElement && defaultValueElement.textContent) {
        const textValue = defaultValueElement.textContent.trim();
        if (baseType === 'float' || baseType === 'integer') {
          defaultValue = parseFloat(textValue);
        } else {
          defaultValue = textValue;
        }
      }
      
      if (identifier) {
        declarations.push({
          identifier,
          cardinality,
          baseType,
          defaultValue
        });
      }
    });
    
    return declarations;
  }

  private parseAssessmentItem(itemElement: Element, unsupportedElements: Map<string, UnsupportedElement>): QTIItem | null {
    const id = itemElement.getAttribute('identifier') || `item-${Date.now()}`;
    const title = itemElement.getAttribute('title') || 'Untitled Item';

    // Get the item body
    const itemBody = itemElement.querySelector('itemBody');
    if (!itemBody) {
      throw new Error('No itemBody found');
    }

    // Extract prompt text
    const prompt = this.extractPromptText(itemBody);

    // Determine item type and parse accordingly
    const choiceInteraction = itemBody.querySelector('choiceInteraction');
    const textEntryInteraction = itemBody.querySelector('textEntryInteraction');
    const extendedTextInteraction = itemBody.querySelector('extendedTextInteraction');
    const hottextInteraction = itemBody.querySelector('hottextInteraction');
    const sliderInteraction = itemBody.querySelector('sliderInteraction');
    const orderInteraction = itemBody.querySelector('orderInteraction');
    
    if (choiceInteraction) {
      return this.parseChoiceInteraction(id, title, prompt, choiceInteraction, itemElement);
    } else if (textEntryInteraction) {
      return this.parseTextEntryInteraction(id, title, prompt, textEntryInteraction, itemElement);
    } else if (extendedTextInteraction) {
      return this.parseExtendedTextInteraction(id, title, prompt, extendedTextInteraction, itemElement);
    } else if (hottextInteraction) {
      return this.parseHottextInteraction(id, title, prompt, hottextInteraction, itemElement);
    } else if (sliderInteraction) {
      return this.parseSliderInteraction(id, title, prompt, sliderInteraction, itemElement);
    } else if (orderInteraction) {
      return this.parseOrderInteraction(id, title, prompt, orderInteraction, itemElement);
    }

    return {
      id,
      identifier: id,
      title,
      type: 'unknown',
      interactionType: 'unknown',
      prompt,
      maxScore: this.parseMaxScore(itemElement),
      responseProcessing: this.parseResponseProcessing(itemElement)
    };
  }

  private extractPromptText(itemBody: Element): string {
    const clone = itemBody.cloneNode(true) as Element;
    const interactions = clone.querySelectorAll('choiceInteraction, textEntryInteraction, extendedTextInteraction, hottextInteraction, sliderInteraction, orderInteraction');
    interactions.forEach(interaction => interaction.remove());
    return clone.textContent?.trim() || '';
  }

  private parseChoiceInteraction(
    id: string, 
    title: string, 
    prompt: string, 
    choiceInteraction: Element,
    itemElement: Element
  ): QTIItem {
    const responseIdentifier = choiceInteraction.getAttribute('responseIdentifier') || 'RESPONSE';
    const maxChoices = parseInt(choiceInteraction.getAttribute('maxChoices') || '1');
    
    const choices: QTIChoice[] = [];
    const simpleChoices = choiceInteraction.querySelectorAll('simpleChoice');
    
    simpleChoices.forEach(choice => {
      const identifier = choice.getAttribute('identifier') || '';
      const text = choice.textContent?.trim() || '';
      if (identifier && text) {
        choices.push({ identifier, text });
      }
    });

    const correctResponse = this.findCorrectResponse(itemElement, responseIdentifier);

    return {
      id,
      identifier: id,
      title,
      type: maxChoices === 1 ? 'choice' : 'multipleResponse',
      interactionType: maxChoices === 1 ? 'choice' : 'multipleResponse',
      prompt,
      choices,
      correctResponse,
      responseIdentifier,
      maxScore: this.parseMaxScore(itemElement),
      mapping: this.parseMapping(itemElement, responseIdentifier),
      responseProcessing: this.parseResponseProcessing(itemElement)
    };
  }

  private parseTextEntryInteraction(
    id: string,
    title: string,
    prompt: string,
    textEntryInteraction: Element,
    itemElement: Element
  ): QTIItem {
    const responseIdentifier = textEntryInteraction.getAttribute('responseIdentifier') || 'RESPONSE';
    const correctResponse = this.findCorrectResponse(itemElement, responseIdentifier);

    return {
      id,
      identifier: id,
      title,
      type: 'textEntry',
      interactionType: 'textEntry',
      prompt,
      correctResponse,
      responseIdentifier,
      maxScore: this.parseMaxScore(itemElement),
      mapping: this.parseMapping(itemElement, responseIdentifier),
      responseProcessing: this.parseResponseProcessing(itemElement)
    };
  }

  private parseExtendedTextInteraction(
    id: string,
    title: string,
    prompt: string,
    extendedTextInteraction: Element,
    itemElement: Element
  ): QTIItem {
    const responseIdentifier = extendedTextInteraction.getAttribute('responseIdentifier') || 'RESPONSE';
    const correctResponse = this.findCorrectResponse(itemElement, responseIdentifier);

    return {
      id,
      identifier: id,
      title,
      type: 'extendedText',
      interactionType: 'extendedText',
      prompt,
      correctResponse,
      responseIdentifier,
      maxScore: this.parseMaxScore(itemElement),
      mapping: this.parseMapping(itemElement, responseIdentifier),
      responseProcessing: this.parseResponseProcessing(itemElement)
    };
  }

  private parseHottextInteraction(
    id: string,
    title: string,
    prompt: string,
    hottextInteraction: Element,
    itemElement: Element
  ): QTIItem {
    const responseIdentifier = hottextInteraction.getAttribute('responseIdentifier') || 'RESPONSE';
    
    const hottextChoices: QTIHottextChoice[] = [];
    const hottextElements = hottextInteraction.querySelectorAll('hottext');
    
    hottextElements.forEach(hottext => {
      const identifier = hottext.getAttribute('identifier') || '';
      const text = hottext.textContent?.trim() || '';
      if (identifier && text) {
        hottextChoices.push({ identifier, text });
      }
    });

    const correctResponse = this.findCorrectResponse(itemElement, responseIdentifier);

    return {
      id,
      identifier: id,
      title,
      type: 'hottext',
      interactionType: 'hottext',
      prompt: hottextInteraction.innerHTML,
      hottextChoices,
      correctResponse,
      responseIdentifier,
      maxScore: this.parseMaxScore(itemElement),
      mapping: this.parseMapping(itemElement, responseIdentifier),
      responseProcessing: this.parseResponseProcessing(itemElement)
    };
  }

  private parseSliderInteraction(
    id: string,
    title: string,
    prompt: string,
    sliderInteraction: Element,
    itemElement: Element
  ): QTIItem {
    const responseIdentifier = sliderInteraction.getAttribute('responseIdentifier') || 'RESPONSE';
    const lowerBound = parseFloat(sliderInteraction.getAttribute('lowerBound') || '0');
    const upperBound = parseFloat(sliderInteraction.getAttribute('upperBound') || '100');
    const step = parseFloat(sliderInteraction.getAttribute('step') || '1');
    const stepLabel = sliderInteraction.getAttribute('stepLabel') === 'true';
    const orientation = sliderInteraction.getAttribute('orientation') as 'horizontal' | 'vertical' || 'horizontal';

    const sliderConfig: QTISliderConfig = {
      lowerBound,
      upperBound,
      step,
      stepLabel,
      orientation
    };

    const correctResponse = this.findCorrectResponse(itemElement, responseIdentifier);

    return {
      id,
      identifier: id,
      title,
      type: 'slider',
      interactionType: 'slider',
      prompt,
      sliderConfig,
      correctResponse,
      responseIdentifier,
      maxScore: this.parseMaxScore(itemElement),
      mapping: this.parseMapping(itemElement, responseIdentifier),
      responseProcessing: this.parseResponseProcessing(itemElement)
    };
  }

  private parseOrderInteraction(
    id: string,
    title: string,
    prompt: string,
    orderInteraction: Element,
    itemElement: Element
  ): QTIItem {
    const responseIdentifier = orderInteraction.getAttribute('responseIdentifier') || 'RESPONSE';
    
    const orderChoices: QTIOrderChoice[] = [];
    const simpleChoices = orderInteraction.querySelectorAll('simpleChoice');
    
    simpleChoices.forEach(choice => {
      const identifier = choice.getAttribute('identifier') || '';
      const text = choice.textContent?.trim() || '';
      if (identifier && text) {
        orderChoices.push({ identifier, text });
      }
    });

    const correctResponse = this.findCorrectResponse(itemElement, responseIdentifier);

    return {
      id,
      identifier: id,
      title,
      type: 'order',
      interactionType: 'order',
      prompt,
      orderChoices,
      correctResponse,
      responseIdentifier,
      maxScore: this.parseMaxScore(itemElement),
      mapping: this.parseMapping(itemElement, responseIdentifier),
      responseProcessing: this.parseResponseProcessing(itemElement)
    };
  }

  private findCorrectResponse(itemElement: Element, responseIdentifier: string): string | string[] | undefined {
    const responseDeclaration = itemElement.querySelector(`responseDeclaration[identifier="${responseIdentifier}"]`);
    if (!responseDeclaration) return undefined;

    const correctResponse = responseDeclaration.querySelector('correctResponse');
    if (!correctResponse) return undefined;

    const values = correctResponse.querySelectorAll('value');
    if (values.length === 0) return undefined;

    if (values.length === 1) {
      return values[0].textContent?.trim();
    } else {
      return Array.from(values).map(value => value.textContent?.trim() || '');
    }
  }

  private parseMapping(itemElement: Element, responseIdentifier: string): Record<string, number> | undefined {
    const responseDeclaration = itemElement.querySelector(`responseDeclaration[identifier="${responseIdentifier}"]`);
    if (!responseDeclaration) return undefined;

    const mapping = responseDeclaration.querySelector('mapping');
    if (!mapping) return undefined;

    const mappingObj: Record<string, number> = {};
    const mapEntries = mapping.querySelectorAll('mapEntry');
    
    mapEntries.forEach(entry => {
      const mapKey = entry.getAttribute('mapKey');
      const mappedValue = entry.getAttribute('mappedValue');
      
      if (mapKey && mappedValue) {
        mappingObj[mapKey] = parseFloat(mappedValue);
      }
    });

    return Object.keys(mappingObj).length > 0 ? mappingObj : undefined;
  }

  private parseMaxScore(itemElement: Element): number | undefined {
    const outcomeDeclaration = itemElement.querySelector('outcomeDeclaration[identifier="SCORE"]');
    if (!outcomeDeclaration) return undefined;

    // Check for explicit max score in defaultValue
    const defaultValue = outcomeDeclaration.querySelector('defaultValue value');
    if (defaultValue && defaultValue.textContent) {
      const maxScore = parseFloat(defaultValue.textContent.trim());
      if (!isNaN(maxScore) && maxScore > 0) {
        return maxScore;
      }
    }

    // Check for max score in other common patterns
    const maxScoreAttr = outcomeDeclaration.getAttribute('maxScore');
    if (maxScoreAttr) {
      const maxScore = parseFloat(maxScoreAttr);
      if (!isNaN(maxScore) && maxScore > 0) {
        return maxScore;
      }
    }

    // Default to 1 if no explicit max score found
    return 1;
  }

  private parseResponseProcessing(itemElement: Element): { template?: string; customLogic?: unknown } | undefined {
    const responseProcessing = itemElement.querySelector('responseProcessing');
    if (!responseProcessing) return undefined;

    const template = responseProcessing.getAttribute('template');
    if (template) {
      return { template };
    }

    // For custom logic, we could parse responseCondition elements
    // For now, we'll just indicate that custom logic exists
    const responseConditions = responseProcessing.querySelectorAll('responseCondition');
    if (responseConditions.length > 0) {
      return { customLogic: true };
    }

    return undefined;
  }

  private scanForUnsupportedElements(xmlDoc: Document, unsupportedElements: Map<string, UnsupportedElement>) {
    // QTI 3.0 specific unsupported elements
    const unsupportedInteractions = [
      'associateInteraction',
      'matchInteraction',
      'gapMatchInteraction',
      'inlineChoiceInteraction',
      'hotspotInteraction',
      'graphicOrderInteraction',
      'graphicAssociateInteraction',
      'graphicGapMatchInteraction',
      'positionObjectInteraction',
      'drawingInteraction',
      'uploadInteraction',
      'mediaInteraction' // QTI 3.0 specific
    ];

    unsupportedInteractions.forEach(interactionType => {
      const elements = xmlDoc.querySelectorAll(interactionType);
      if (elements.length > 0) {
        this.addUnsupportedElement(unsupportedElements, interactionType, this.getInteractionDescription(interactionType));
      }
    });
  }

  private addUnsupportedElement(unsupportedElements: Map<string, UnsupportedElement>, type: string, description: string) {
    if (unsupportedElements.has(type)) {
      const existing = unsupportedElements.get(type)!;
      existing.count++;
    } else {
      unsupportedElements.set(type, {
        type,
        count: 1,
        description
      });
    }
  }

  private getInteractionDescription(interactionType: string): string {
    const descriptions: Record<string, string> = {
      'associateInteraction': 'Association/matching pairs',
      'matchInteraction': 'Matrix matching questions',
      'gapMatchInteraction': 'Gap matching with draggable items',
      'inlineChoiceInteraction': 'Inline dropdown selections',
      'hotspotInteraction': 'Image hotspot clicking',
      'graphicOrderInteraction': 'Graphic ordering tasks',
      'graphicAssociateInteraction': 'Graphic association tasks',
      'graphicGapMatchInteraction': 'Graphic gap matching',
      'positionObjectInteraction': 'Object positioning',
      'drawingInteraction': 'Drawing/sketching',
      'uploadInteraction': 'File upload questions',
      'mediaInteraction': 'Media interaction elements'
    };
    
    return descriptions[interactionType] || `${interactionType} elements`;
  }

  // Helper methods for XML manipulation (simplified versions)
  private insertItemIntoXML(xmlContent: string, itemXML: string, insertAfterIndex?: number): string {
    // Basic implementation - would need more sophisticated logic for QTI 3.0
    return xmlContent + '\n' + itemXML;
  }

  private updateQTIXMLWithCorrectResponse(xmlContent: string, itemId: string, correctResponse: string | string[] | number): string {
    // Basic implementation - would need proper QTI 3.0 XML manipulation
    return xmlContent;
  }

  private reorderQTIItems(xmlContent: string, oldIndex: number, newIndex: number): string {
    // Basic implementation - would need proper QTI 3.0 XML manipulation
    return xmlContent;
  }
}