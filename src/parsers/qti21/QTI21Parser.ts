import { QTIParserInterface, QTIParseResult } from '../base/QTIParserInterface';
import { QTIVersion } from '@/types/qtiVersions';
import { parseQTIXML } from '@/utils/qtiParser';
import { insertItemIntoXML } from '@/utils/qtiTemplates';
import { updateQTIXMLWithCorrectResponse, formatXML, reorderQTIItems } from '@/utils/xmlUpdater';

export class QTI21Parser implements QTIParserInterface {
  readonly version: QTIVersion = '2.1';

  parse(xmlContent: string): QTIParseResult {
    const result = parseQTIXML(xmlContent);
    return {
      items: result.items,
      errors: result.errors,
      unsupportedElements: result.unsupportedElements,
      version: this.version,
      assessmentTest: undefined // QTI 2.1 doesn't support assessmentTest parsing in this implementation
    };
  }

  isCompatible(xmlContent: string): boolean {
    // Check for QTI 2.1 specific namespace or schema
    return xmlContent.includes('imsqti_v2p1') || 
           xmlContent.includes('qtiv2p1');
  }

  getBlankTemplate(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1" 
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v2p1 http://www.imsglobal.org/xsd/qti/qtiv2p1/imsqti_v2p1.xsd"
                identifier="sample-item" 
                title="New QTI 2.1 Item" 
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
  
  <responseProcessing template="http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct"/>
  
</assessmentItem>`;
  }

  insertItem(xmlContent: string, itemXML: string, insertAfterIndex?: number): string {
    return insertItemIntoXML(xmlContent, itemXML, insertAfterIndex);
  }

  updateCorrectResponse(xmlContent: string, itemId: string, correctResponse: string | string[] | number): string {
    return updateQTIXMLWithCorrectResponse(xmlContent, itemId, correctResponse);
  }

  reorderItems(xmlContent: string, oldIndex: number, newIndex: number): string {
    return reorderQTIItems(xmlContent, oldIndex, newIndex);
  }

  formatXML(xmlContent: string): string {
    return formatXML(xmlContent);
  }

  getSupportedItemTypes(): string[] {
    return ['choice', 'multipleResponse', 'textEntry', 'extendedText', 'hottext', 'slider', 'order'];
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
    };
  }
}