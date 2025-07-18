import { QTIParserInterface, QTIParseResult } from '../base/QTIParserInterface';
import { QTIVersion } from '@/types/qtiVersions';
import { QTIItem, QTIChoice, QTIHottextChoice, QTIOrderChoice, QTISliderConfig, UnsupportedElement } from '@/types/qti';
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

      // Find all assessmentItem elements (QTI 3.0 uses the same structure)
      const assessmentItems = xmlDoc.querySelectorAll('assessmentItem');
      
      if (assessmentItems.length === 0) {
        errors.push('No assessment items found in the QTI 3.0 file');
      }

      // Scan for unsupported elements
      this.scanForUnsupportedElements(xmlDoc, unsupportedElements);

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

      return {
        items,
        errors,
        unsupportedElements: Array.from(unsupportedElements.values()),
        version: this.version
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
      title,
      type: 'unknown',
      prompt,
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
      title,
      type: maxChoices === 1 ? 'choice' : 'multipleResponse',
      prompt,
      choices,
      correctResponse,
      responseIdentifier
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
      title,
      type: 'textEntry',
      prompt,
      correctResponse,
      responseIdentifier
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
      title,
      type: 'extendedText',
      prompt,
      correctResponse,
      responseIdentifier
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
      title,
      type: 'hottext',
      prompt: hottextInteraction.innerHTML,
      hottextChoices,
      correctResponse,
      responseIdentifier
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
      title,
      type: 'slider',
      prompt,
      sliderConfig,
      correctResponse,
      responseIdentifier
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
      title,
      type: 'order',
      prompt,
      orderChoices,
      correctResponse,
      responseIdentifier
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