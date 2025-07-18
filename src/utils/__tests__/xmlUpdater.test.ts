import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { updateQTIXMLWithCorrectResponse, reorderQTIItems, formatXML } from '../xmlUpdater';

describe('xmlUpdater', () => {
  describe('updateQTIXMLWithCorrectResponse', () => {
    // Mock console.warn to prevent console output during tests
    const originalWarn = console.warn;
    beforeEach(() => {
      console.warn = vi.fn();
    });
    
    afterEach(() => {
      console.warn = originalWarn;
    });

    const basicXML = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem identifier="test-item" title="Test Question">
  <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier">
  </responseDeclaration>
  <itemBody>
    <p>Test question</p>
  </itemBody>
</assessmentItem>`;

    it('should update XML with single string correct response', () => {
      const result = updateQTIXMLWithCorrectResponse(basicXML, 'test-item', 'choice_a');
      
      expect(result).toContain('<correctResponse>');
      expect(result).toContain('<value>choice_a</value>');
      expect(result).toContain('cardinality="single"');
    });

    it('should update XML with multiple string correct responses', () => {
      const result = updateQTIXMLWithCorrectResponse(basicXML, 'test-item', ['choice_a', 'choice_b']);
      
      expect(result).toContain('<correctResponse>');
      expect(result).toContain('<value>choice_a</value>');
      expect(result).toContain('<value>choice_b</value>');
      expect(result).toContain('cardinality="multiple"');
    });

    it('should update XML with numeric correct response', () => {
      const result = updateQTIXMLWithCorrectResponse(basicXML, 'test-item', 42);
      
      expect(result).toContain('<correctResponse>');
      expect(result).toContain('<value>42</value>');
      expect(result).toContain('cardinality="single"');
    });

    it('should create responseDeclaration if it does not exist', () => {
      const xmlWithoutResponse = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem identifier="test-item" title="Test Question">
  <itemBody>
    <p>Test question</p>
  </itemBody>
</assessmentItem>`;
      
      const result = updateQTIXMLWithCorrectResponse(xmlWithoutResponse, 'test-item', 'answer');
      
      expect(result).toContain('<responseDeclaration');
      expect(result).toContain('identifier="RESPONSE"');
      expect(result).toContain('<correctResponse>');
      expect(result).toContain('<value>answer</value>');
    });

    it('should create correctResponse if it does not exist', () => {
      const xmlWithoutCorrectResponse = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem identifier="test-item" title="Test Question">
  <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier">
  </responseDeclaration>
  <itemBody>
    <p>Test question</p>
  </itemBody>
</assessmentItem>`;
      
      const result = updateQTIXMLWithCorrectResponse(xmlWithoutCorrectResponse, 'test-item', 'answer');
      
      expect(result).toContain('<correctResponse>');
      expect(result).toContain('<value>answer</value>');
    });

    it('should clear existing values before adding new ones', () => {
      const xmlWithExistingValues = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem identifier="test-item" title="Test Question">
  <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier">
    <correctResponse>
      <value>old_value</value>
    </correctResponse>
  </responseDeclaration>
  <itemBody>
    <p>Test question</p>
  </itemBody>
</assessmentItem>`;
      
      const result = updateQTIXMLWithCorrectResponse(xmlWithExistingValues, 'test-item', 'new_value');
      
      expect(result).toContain('<value>new_value</value>');
      expect(result).not.toContain('<value>old_value</value>');
    });

    it('should handle XML with outcomeDeclaration and insert responseDeclaration correctly', () => {
      const xmlWithOutcome = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem identifier="test-item" title="Test Question">
  <outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float">
    <defaultValue>
      <value>0</value>
    </defaultValue>
  </outcomeDeclaration>
  <itemBody>
    <p>Test question</p>
  </itemBody>
</assessmentItem>`;
      
      const result = updateQTIXMLWithCorrectResponse(xmlWithOutcome, 'test-item', 'answer');
      
      expect(result).toContain('<responseDeclaration');
      expect(result).toContain('<outcomeDeclaration');
      expect(result).toContain('<correctResponse>');
    });

    it('should return original XML if item not found', () => {
      const result = updateQTIXMLWithCorrectResponse(basicXML, 'non-existent-item', 'answer');
      
      expect(result).toBe(basicXML);
    });

    it('should handle malformed XML gracefully', () => {
      const malformedXML = '<invalid>xml<unclosed>';
      
      const result = updateQTIXMLWithCorrectResponse(malformedXML, 'test-item', 'answer');
      
      expect(result).toBe(malformedXML);
    });

    it('should handle empty array correctly', () => {
      const result = updateQTIXMLWithCorrectResponse(basicXML, 'test-item', []);
      
      expect(result).toContain('<correctResponse');
      expect(result).toContain('cardinality="multiple"');
      expect(result).not.toContain('<value>');
    });
  });

  describe('reorderQTIItems', () => {
    const multiItemXML = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentTest identifier="test">
  <assessmentItem identifier="item-1">
    <itemBody><p>Item 1</p></itemBody>
  </assessmentItem>
  <assessmentItem identifier="item-2">
    <itemBody><p>Item 2</p></itemBody>
  </assessmentItem>
  <assessmentItem identifier="item-3">
    <itemBody><p>Item 3</p></itemBody>
  </assessmentItem>
</assessmentTest>`;

    it('should reorder items from start to middle', () => {
      const result = reorderQTIItems(multiItemXML, 0, 1);
      
      expect(result.indexOf('item-2')).toBeLessThan(result.indexOf('item-1'));
      expect(result.indexOf('item-1')).toBeLessThan(result.indexOf('item-3'));
    });

    it('should reorder items from middle to start', () => {
      const result = reorderQTIItems(multiItemXML, 1, 0);
      
      expect(result.indexOf('item-2')).toBeLessThan(result.indexOf('item-1'));
      expect(result.indexOf('item-1')).toBeLessThan(result.indexOf('item-3'));
    });

    it('should reorder items from start to end', () => {
      const result = reorderQTIItems(multiItemXML, 0, 2);
      
      expect(result.indexOf('item-2')).toBeLessThan(result.indexOf('item-3'));
      expect(result.indexOf('item-3')).toBeLessThan(result.indexOf('item-1'));
    });

    it('should reorder items from end to start', () => {
      const result = reorderQTIItems(multiItemXML, 2, 0);
      
      expect(result.indexOf('item-3')).toBeLessThan(result.indexOf('item-1'));
      expect(result.indexOf('item-1')).toBeLessThan(result.indexOf('item-2'));
    });

    it('should handle same index (no change)', () => {
      const result = reorderQTIItems(multiItemXML, 1, 1);
      
      expect(result.indexOf('item-1')).toBeLessThan(result.indexOf('item-2'));
      expect(result.indexOf('item-2')).toBeLessThan(result.indexOf('item-3'));
    });

    it('should return original XML for invalid fromIndex', () => {
      const result = reorderQTIItems(multiItemXML, -1, 1);
      expect(result).toBe(multiItemXML);
      
      const result2 = reorderQTIItems(multiItemXML, 5, 1);
      expect(result2).toBe(multiItemXML);
    });

    it('should return original XML for invalid toIndex', () => {
      const result = reorderQTIItems(multiItemXML, 1, -1);
      expect(result).toBe(multiItemXML);
      
      const result2 = reorderQTIItems(multiItemXML, 1, 5);
      expect(result2).toBe(multiItemXML);
    });

    it('should handle single item XML', () => {
      const singleItemXML = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentTest identifier="test">
  <assessmentItem identifier="item-1">
    <itemBody><p>Item 1</p></itemBody>
  </assessmentItem>
</assessmentTest>`;
      
      const result = reorderQTIItems(singleItemXML, 0, 0);
      expect(result).toContain('item-1');
    });

    it('should handle malformed XML gracefully', () => {
      const malformedXML = '<invalid>xml<unclosed>';
      
      const result = reorderQTIItems(malformedXML, 0, 1);
      
      expect(result).toBe(malformedXML);
    });

    it('should format the result XML', () => {
      const result = reorderQTIItems(multiItemXML, 0, 1);
      
      // Should have proper indentation
      expect(result).toMatch(/\n\s+<assessmentItem/);
    });
  });

  describe('formatXML', () => {
    it('should format simple XML with proper indentation', () => {
      const unformatted = '<root><child>text</child></root>';
      const result = formatXML(unformatted);
      
      expect(result).toBe('<root>\n  <child>text</child>\n</root>');
    });

    it('should format nested XML correctly', () => {
      const unformatted = '<root><parent><child>text</child></parent></root>';
      const result = formatXML(unformatted);
      
      expect(result).toBe('<root>\n  <parent>\n    <child>text</child>\n  </parent>\n</root>');
    });

    it('should handle self-closing tags', () => {
      const unformatted = '<root><empty/><child>text</child></root>';
      const result = formatXML(unformatted);
      
      expect(result).toBe('<root>\n  <empty/>\n  <child>text</child>\n</root>');
    });

    it('should handle tags with attributes', () => {
      const unformatted = '<root attr="value"><child id="test">text</child></root>';
      const result = formatXML(unformatted);
      
      expect(result).toBe('<root attr="value">\n  <child id="test">text</child>\n</root>');
    });

    it('should remove whitespace-only text nodes', () => {
      const unformatted = '<root>   <child>   </child>   </root>';
      const result = formatXML(unformatted);
      
      // Accept either self-closing or empty tag format
      expect(result).toMatch(/<root>\s+<child\/>\s+<\/root>|<root>\s+<child><\/child>\s+<\/root>/);
    });

    it('should handle XML declaration', () => {
      const unformatted = '<?xml version="1.0"?><root><child>text</child></root>';
      const result = formatXML(unformatted);
      
      // jsdom might strip XML declaration, so test for content structure
      expect(result).toContain('<root>');
      expect(result).toContain('  <child>text</child>');
    });

    it('should handle mixed content correctly', () => {
      const unformatted = '<root>Some text<child>nested</child>more text</root>';
      const result = formatXML(unformatted);
      
      expect(result).toContain('<root>Some text');
      expect(result).toContain('<child>nested</child>');
      expect(result).toContain('more text</root>');
    });

    it('should handle empty XML', () => {
      const result = formatXML('');
      // jsdom might return error for empty XML, just check it doesn't crash
      expect(typeof result).toBe('string');
    });

    it('should handle malformed XML gracefully', () => {
      const malformedXML = '<invalid>xml<unclosed>';
      
      const result = formatXML(malformedXML);
      
      // Should return something (either original or error message) without crashing
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle complex QTI XML structure', () => {
      const qtiXML = `<assessmentItem identifier="test"><responseDeclaration identifier="RESPONSE"><correctResponse><value>a</value></correctResponse></responseDeclaration><itemBody><p>Question</p><choiceInteraction><simpleChoice identifier="a">Choice A</simpleChoice></choiceInteraction></itemBody></assessmentItem>`;
      
      const result = formatXML(qtiXML);
      
      expect(result).toContain('<assessmentItem identifier="test">');
      expect(result).toContain('  <responseDeclaration identifier="RESPONSE">');
      expect(result).toContain('    <correctResponse>');
      expect(result).toContain('      <value>a</value>');
    });

    it('should handle multiple siblings at same level', () => {
      const unformatted = '<root><first>1</first><second>2</second><third>3</third></root>';
      const result = formatXML(unformatted);
      
      expect(result).toBe('<root>\n  <first>1</first>\n  <second>2</second>\n  <third>3</third>\n</root>');
    });
  });
});