import { describe, it, expect } from 'vitest';
import { parseQTIXML } from '../qtiParser';

describe('QTI Parser', () => {
  describe('parseQTIXML', () => {
    it('should parse a valid single choice item', () => {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem identifier="choice_1" title="Test Question" adaptive="false" timeDependent="false">
  <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier">
    <correctResponse>
      <value>choice_a</value>
    </correctResponse>
  </responseDeclaration>
  <itemBody>
    <p>What is the capital of France?</p>
    <choiceInteraction responseIdentifier="RESPONSE" shuffle="false" maxChoices="1">
      <simpleChoice identifier="choice_a">Paris</simpleChoice>
      <simpleChoice identifier="choice_b">London</simpleChoice>
    </choiceInteraction>
  </itemBody>
</assessmentItem>`;

      const result = parseQTIXML(xml);

      expect(result.success).toBe(true);
      expect(result.items).toHaveLength(1);
      expect(result.errors).toHaveLength(0);
      
      const item = result.items[0];
      expect(item.id).toBe('choice_1');
      expect(item.title).toBe('Test Question');
      expect(item.type).toBe('choice');
      expect(item.prompt).toBe('What is the capital of France?');
      expect(item.choices).toHaveLength(2);
      expect(item.correctResponse).toBe('choice_a');
    });

    it('should parse a multiple response item', () => {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem identifier="multi_1" title="Multiple Choice" adaptive="false" timeDependent="false">
  <responseDeclaration identifier="RESPONSE" cardinality="multiple" baseType="identifier">
    <correctResponse>
      <value>choice_a</value>
      <value>choice_c</value>
    </correctResponse>
  </responseDeclaration>
  <itemBody>
    <p>Select all programming languages:</p>
    <choiceInteraction responseIdentifier="RESPONSE" shuffle="false" maxChoices="0">
      <simpleChoice identifier="choice_a">Python</simpleChoice>
      <simpleChoice identifier="choice_b">HTML</simpleChoice>
      <simpleChoice identifier="choice_c">JavaScript</simpleChoice>
    </choiceInteraction>
  </itemBody>
</assessmentItem>`;

      const result = parseQTIXML(xml);

      expect(result.success).toBe(true);
      expect(result.items).toHaveLength(1);
      
      const item = result.items[0];
      expect(item.type).toBe('multipleResponse');
      expect(item.correctResponse).toEqual(['choice_a', 'choice_c']);
    });

    it('should parse a text entry item', () => {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem identifier="text_1" title="Fill in Blank" adaptive="false" timeDependent="false">
  <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="string">
    <correctResponse>
      <value>Paris</value>
    </correctResponse>
  </responseDeclaration>
  <itemBody>
    <p>The capital of France is <textEntryInteraction responseIdentifier="RESPONSE" expectedLength="10"/>.</p>
  </itemBody>
</assessmentItem>`;

      const result = parseQTIXML(xml);

      expect(result.success).toBe(true);
      expect(result.items).toHaveLength(1);
      
      const item = result.items[0];
      expect(item.type).toBe('textEntry');
      expect(item.correctResponse).toBe('Paris');
    });

    it('should parse an extended text item', () => {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem identifier="essay_1" title="Essay Question" adaptive="false" timeDependent="false">
  <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="string">
  </responseDeclaration>
  <itemBody>
    <p>Explain your answer:</p>
    <extendedTextInteraction responseIdentifier="RESPONSE" expectedLines="5"/>
  </itemBody>
</assessmentItem>`;

      const result = parseQTIXML(xml);

      expect(result.success).toBe(true);
      expect(result.items).toHaveLength(1);
      
      const item = result.items[0];
      expect(item.type).toBe('extendedText');
    });

    it('should parse a hottext item', () => {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem identifier="hottext_1" title="Hottext Question" adaptive="false" timeDependent="false">
  <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier">
    <correctResponse>
      <value>hot1</value>
    </correctResponse>
  </responseDeclaration>
  <itemBody>
    <p>Select the correct word:</p>
    <hottextInteraction responseIdentifier="RESPONSE" maxChoices="1">
      <p>The <hottext identifier="hot1">sun</hottext> is a <hottext identifier="hot2">planet</hottext>.</p>
    </hottextInteraction>
  </itemBody>
</assessmentItem>`;

      const result = parseQTIXML(xml);

      expect(result.success).toBe(true);
      expect(result.items).toHaveLength(1);
      
      const item = result.items[0];
      expect(item.type).toBe('hottext');
      expect(item.hottextChoices).toHaveLength(2);
    });

    it('should parse a slider item', () => {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem identifier="slider_1" title="Slider Question" adaptive="false" timeDependent="false">
  <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="float">
    <correctResponse>
      <value>7.5</value>
    </correctResponse>
  </responseDeclaration>
  <itemBody>
    <p>Rate your satisfaction:</p>
    <sliderInteraction responseIdentifier="RESPONSE" lowerBound="0" upperBound="10" step="0.5"/>
  </itemBody>
</assessmentItem>`;

      const result = parseQTIXML(xml);

      expect(result.success).toBe(true);
      expect(result.items).toHaveLength(1);
      
      const item = result.items[0];
      expect(item.type).toBe('slider');
      expect(item.sliderConfig).toEqual({
        lowerBound: 0,
        upperBound: 10,
        step: 0.5,
        stepLabel: false,
        orientation: 'horizontal'
      });
    });

    it('should parse an order item', () => {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem identifier="order_1" title="Order Question" adaptive="false" timeDependent="false">
  <responseDeclaration identifier="RESPONSE" cardinality="ordered" baseType="identifier">
    <correctResponse>
      <value>item_a</value>
      <value>item_b</value>
    </correctResponse>
  </responseDeclaration>
  <itemBody>
    <p>Put in order:</p>
    <orderInteraction responseIdentifier="RESPONSE" shuffle="true">
      <simpleChoice identifier="item_a">First</simpleChoice>
      <simpleChoice identifier="item_b">Second</simpleChoice>
    </orderInteraction>
  </itemBody>
</assessmentItem>`;

      const result = parseQTIXML(xml);

      expect(result.success).toBe(true);
      expect(result.items).toHaveLength(1);
      
      const item = result.items[0];
      expect(item.type).toBe('order');
      expect(item.orderChoices).toHaveLength(2);
    });

    it('should handle assessment test with multiple items', () => {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentTest identifier="test_1" title="Sample Test">
  <assessmentItem identifier="item_1" title="Question 1">
    <itemBody>
      <p>Question 1</p>
      <choiceInteraction responseIdentifier="RESPONSE" maxChoices="1">
        <simpleChoice identifier="a">A</simpleChoice>
      </choiceInteraction>
    </itemBody>
  </assessmentItem>
  <assessmentItem identifier="item_2" title="Question 2">
    <itemBody>
      <p>Question 2</p>
      <textEntryInteraction responseIdentifier="RESPONSE"/>
    </itemBody>
  </assessmentItem>
</assessmentTest>`;

      const result = parseQTIXML(xml);

      expect(result.success).toBe(true);
      expect(result.items).toHaveLength(2);
      expect(result.items[0].id).toBe('item_1');
      expect(result.items[1].id).toBe('item_2');
    });

    it('should handle invalid XML', () => {
      const invalidXml = `<?xml version="1.0"?>
<assessmentItem>
  <unclosed-tag>
</assessmentItem>`;

      const result = parseQTIXML(invalidXml);

      expect(result.success).toBe(false);
      expect(result.items).toHaveLength(0);
      expect(result.errors).toContain('Invalid XML format');
    });

    it('should handle empty XML', () => {
      const result = parseQTIXML('');

      expect(result.success).toBe(false);
      expect(result.items).toHaveLength(0);
      expect(result.errors).toHaveLength(1);
    });

    it('should detect unsupported elements', () => {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem identifier="unsupported_1" title="Unsupported">
  <itemBody>
    <p>This has unsupported elements:</p>
    <associateInteraction responseIdentifier="RESPONSE">
      <simpleMatchSet>
        <simpleAssociableChoice identifier="A">Choice A</simpleAssociableChoice>
      </simpleMatchSet>
    </associateInteraction>
    <modalFeedback identifier="feedback">Good job!</modalFeedback>
  </itemBody>
</assessmentItem>`;

      const result = parseQTIXML(xml);

      expect(result.success).toBe(true);
      expect(result.unsupportedElements).toHaveLength(2);
      expect(result.unsupportedElements.some(e => e.type === 'associateInteraction')).toBe(true);
      expect(result.unsupportedElements.some(e => e.type === 'modalFeedback')).toBe(true);
    });

    it('should return unknown type for unsupported interaction', () => {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem identifier="unknown_1" title="Unknown Type">
  <itemBody>
    <p>This has no supported interactions</p>
  </itemBody>
</assessmentItem>`;

      const result = parseQTIXML(xml);

      expect(result.success).toBe(true);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].type).toBe('unknown');
    });
  });
});