import { describe, it, expect } from 'vitest';
import { QTI_ITEM_TEMPLATES, ITEM_TYPE_LABELS, generateItemId, insertItemIntoXML } from '../qtiTemplates';

describe('QTI Templates', () => {
  describe('generateItemId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateItemId();
      const id2 = generateItemId();
      
      expect(id1).toMatch(/^item-\d+-[a-z0-9]+$/);
      expect(id2).toMatch(/^item-\d+-[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('QTI_ITEM_TEMPLATES', () => {
    it('should generate valid choice item template', () => {
      const itemId = 'test-choice-1';
      const xml = QTI_ITEM_TEMPLATES.choice(itemId);
      
      expect(xml).toContain(`identifier="${itemId}"`);
      expect(xml).toContain('title="Multiple Choice Question"');
      expect(xml).toContain('choiceInteraction');
      expect(xml).toContain('maxChoices="1"');
      expect(xml).toContain('simpleChoice');
    });

    it('should generate valid multiple response template', () => {
      const itemId = 'test-multi-1';
      const xml = QTI_ITEM_TEMPLATES.multipleResponse(itemId);
      
      expect(xml).toContain(`identifier="${itemId}"`);
      expect(xml).toContain('title="Multiple Response Question"');
      expect(xml).toContain('maxChoices="0"');
      expect(xml).toContain('cardinality="multiple"');
    });

    it('should generate valid text entry template', () => {
      const itemId = 'test-text-1';
      const xml = QTI_ITEM_TEMPLATES.textEntry(itemId);
      
      expect(xml).toContain(`identifier="${itemId}"`);
      expect(xml).toContain('title="Fill in the Blank"');
      expect(xml).toContain('textEntryInteraction');
      expect(xml).toContain('baseType="string"');
    });

    it('should generate valid extended text template', () => {
      const itemId = 'test-essay-1';
      const xml = QTI_ITEM_TEMPLATES.extendedText(itemId);
      
      expect(xml).toContain(`identifier="${itemId}"`);
      expect(xml).toContain('title="Extended Text Response"');
      expect(xml).toContain('extendedTextInteraction');
    });

    it('should generate valid hottext template', () => {
      const itemId = 'test-hottext-1';
      const xml = QTI_ITEM_TEMPLATES.hottext(itemId);
      
      expect(xml).toContain(`identifier="${itemId}"`);
      expect(xml).toContain('title="Hottext Selection"');
      expect(xml).toContain('hottextInteraction');
      expect(xml).toContain('<hottext identifier=');
    });

    it('should generate valid slider template', () => {
      const itemId = 'test-slider-1';
      const xml = QTI_ITEM_TEMPLATES.slider(itemId);
      
      expect(xml).toContain(`identifier="${itemId}"`);
      expect(xml).toContain('title="Slider Question"');
      expect(xml).toContain('sliderInteraction');
      expect(xml).toContain('lowerBound="0"');
      expect(xml).toContain('upperBound="100"');
    });

    it('should generate valid order template', () => {
      const itemId = 'test-order-1';
      const xml = QTI_ITEM_TEMPLATES.order(itemId);
      
      expect(xml).toContain(`identifier="${itemId}"`);
      expect(xml).toContain('title="Order Interaction"');
      expect(xml).toContain('orderInteraction');
      expect(xml).toContain('cardinality="ordered"');
    });
  });

  describe('ITEM_TYPE_LABELS', () => {
    it('should have labels for all item types', () => {
      expect(ITEM_TYPE_LABELS.choice).toBe('Multiple Choice');
      expect(ITEM_TYPE_LABELS.multipleResponse).toBe('Multiple Response');
      expect(ITEM_TYPE_LABELS.textEntry).toBe('Fill in the Blank');
      expect(ITEM_TYPE_LABELS.extendedText).toBe('Extended Text');
      expect(ITEM_TYPE_LABELS.hottext).toBe('Hottext Selection');
      expect(ITEM_TYPE_LABELS.slider).toBe('Slider');
      expect(ITEM_TYPE_LABELS.order).toBe('Order Interaction');
    });
  });

  describe('insertItemIntoXML', () => {
    it('should handle empty content by returning new item with XML declaration', () => {
      const newItem = '<assessmentItem identifier="new-1">test</assessmentItem>';
      const result = insertItemIntoXML('', newItem);
      
      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(result).toContain(newItem);
    });

    it('should insert item into assessmentTest at the end', () => {
      const existingXML = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentTest identifier="test">
  <assessmentItem identifier="item-1">
    <itemBody><p>Item 1</p></itemBody>
  </assessmentItem>
</assessmentTest>`;
      
      const newItem = '<assessmentItem identifier="item-2"><itemBody><p>Item 2</p></itemBody></assessmentItem>';
      const result = insertItemIntoXML(existingXML, newItem);
      
      expect(result).toContain('item-1');
      expect(result).toContain('item-2');
      expect(result.indexOf('item-1')).toBeLessThan(result.indexOf('item-2'));
    });

    it('should insert item at the beginning when insertAfterIndex is -1', () => {
      const existingXML = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentTest identifier="test">
  <assessmentItem identifier="item-1">
    <itemBody><p>Item 1</p></itemBody>
  </assessmentItem>
</assessmentTest>`;
      
      const newItem = '<assessmentItem identifier="item-new"><itemBody><p>New Item</p></itemBody></assessmentItem>';
      const result = insertItemIntoXML(existingXML, newItem, -1);
      
      expect(result).toContain('item-new');
      expect(result).toContain('item-1');
      expect(result.indexOf('item-new')).toBeLessThan(result.indexOf('item-1'));
    });

    it('should convert single item to assessmentTest when adding second item', () => {
      const singleItemXML = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1" identifier="item-1">
  <itemBody><p>Item 1</p></itemBody>
</assessmentItem>`;
      
      const newItem = '<assessmentItem identifier="item-2"><itemBody><p>Item 2</p></itemBody></assessmentItem>';
      const result = insertItemIntoXML(singleItemXML, newItem);
      
      expect(result).toContain('<assessmentTest');
      expect(result).toContain('item-1');
      expect(result).toContain('item-2');
      expect(result).not.toContain('xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1"');
    });

    it('should handle standalone items without namespaces', () => {
      const standaloneXML = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem identifier="item-1">
  <itemBody><p>Item 1</p></itemBody>
</assessmentItem>`;
      
      const newItem = '<assessmentItem identifier="item-2"><itemBody><p>Item 2</p></itemBody></assessmentItem>';
      const result = insertItemIntoXML(standaloneXML, newItem);
      
      expect(result).toContain('<assessmentTest');
      expect(result).toContain('item-1');
      expect(result).toContain('item-2');
    });

    it('should preserve XML declaration from original content', () => {
      const existingXML = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem identifier="item-1">
  <itemBody><p>Item 1</p></itemBody>
</assessmentItem>`;
      
      const newItem = '<assessmentItem identifier="item-2"><itemBody><p>Item 2</p></itemBody></assessmentItem>';
      const result = insertItemIntoXML(existingXML, newItem);
      
      expect(result).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    });

    it('should handle insertion at specific index', () => {
      const existingXML = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentTest identifier="test">
  <assessmentItem identifier="item-1">
    <itemBody><p>Item 1</p></itemBody>
  </assessmentItem>
  <assessmentItem identifier="item-3">
    <itemBody><p>Item 3</p></itemBody>
  </assessmentItem>
</assessmentTest>`;
      
      const newItem = '<assessmentItem identifier="item-2"><itemBody><p>Item 2</p></itemBody></assessmentItem>';
      const result = insertItemIntoXML(existingXML, newItem, 0);
      
      expect(result).toContain('item-1');
      expect(result).toContain('item-2');
      expect(result).toContain('item-3');
      
      // Item 2 should be between item 1 and item 3
      const item1Index = result.indexOf('item-1');
      const item2Index = result.indexOf('item-2');
      const item3Index = result.indexOf('item-3');
      
      expect(item1Index).toBeLessThan(item2Index);
      expect(item2Index).toBeLessThan(item3Index);
    });
  });
});