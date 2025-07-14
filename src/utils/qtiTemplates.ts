export const QTI_ITEM_TEMPLATES = {
  choice: (itemId: string) => `<assessmentItem identifier="${itemId}" 
                   title="Multiple Choice Question" 
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
    
  </assessmentItem>`,

  multipleResponse: (itemId: string) => `<assessmentItem identifier="${itemId}" 
                   title="Multiple Response Question" 
                   adaptive="false" 
                   timeDependent="false">
    
    <responseDeclaration identifier="RESPONSE" cardinality="multiple" baseType="identifier">
      <correctResponse>
        <value>ChoiceA</value>
        <value>ChoiceC</value>
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
        <choiceInteraction responseIdentifier="RESPONSE" shuffle="false" maxChoices="0">
          <prompt>Select all correct answers:</prompt>
          <simpleChoice identifier="ChoiceA">Option A</simpleChoice>
          <simpleChoice identifier="ChoiceB">Option B</simpleChoice>
          <simpleChoice identifier="ChoiceC">Option C</simpleChoice>
          <simpleChoice identifier="ChoiceD">Option D</simpleChoice>
        </choiceInteraction>
      </div>
    </itemBody>
    
    <responseProcessing template="http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct"/>
    
  </assessmentItem>`,

  textEntry: (itemId: string) => `<assessmentItem identifier="${itemId}" 
                   title="Fill in the Blank" 
                   adaptive="false" 
                   timeDependent="false">
    
    <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="string">
      <correctResponse>
        <value>answer</value>
      </correctResponse>
    </responseDeclaration>
    
    <outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float">
      <defaultValue>
        <value>0</value>
      </defaultValue>
    </outcomeDeclaration>
    
    <itemBody>
      <div>
        <p>Complete the sentence: The capital of France is <textEntryInteraction responseIdentifier="RESPONSE" expectedLength="10"/>.</p>
      </div>
    </itemBody>
    
    <responseProcessing template="http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct"/>
    
  </assessmentItem>`,

  extendedText: (itemId: string) => `<assessmentItem identifier="${itemId}" 
                   title="Extended Text Response" 
                   adaptive="false" 
                   timeDependent="false">
    
    <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="string">
    </responseDeclaration>
    
    <outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float">
      <defaultValue>
        <value>0</value>
      </defaultValue>
    </outcomeDeclaration>
    
    <itemBody>
      <div>
        <p>Explain your understanding of the topic in detail:</p>
        <extendedTextInteraction responseIdentifier="RESPONSE" expectedLines="5"/>
      </div>
    </itemBody>
    
    <responseProcessing template="http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct"/>
    
  </assessmentItem>`,

  hottext: (itemId: string) => `<assessmentItem identifier="${itemId}" 
                   title="Hottext Selection" 
                   adaptive="false" 
                   timeDependent="false">
    
    <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier">
      <correctResponse>
        <value>H1</value>
      </correctResponse>
    </responseDeclaration>
    
    <outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float">
      <defaultValue>
        <value>0</value>
      </defaultValue>
    </outcomeDeclaration>
    
    <itemBody>
      <div>
        <p>Select the correct word in the following sentence:</p>
        <hottextInteraction responseIdentifier="RESPONSE" maxChoices="1">
          <p>The <hottext identifier="H1">sun</hottext> is a <hottext identifier="H2">planet</hottext> that provides <hottext identifier="H3">light</hottext> to Earth.</p>
        </hottextInteraction>
      </div>
    </itemBody>
    
    <responseProcessing template="http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct"/>
    
  </assessmentItem>`,

  slider: (itemId: string) => `<assessmentItem identifier="${itemId}" 
                   title="Slider Question" 
                   adaptive="false" 
                   timeDependent="false">
    
    <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="integer">
      <correctResponse>
        <value>50</value>
      </correctResponse>
    </responseDeclaration>
    
    <outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float">
      <defaultValue>
        <value>0</value>
      </defaultValue>
    </outcomeDeclaration>
    
    <itemBody>
      <div>
        <p>Use the slider to select your answer (0-100):</p>
        <sliderInteraction responseIdentifier="RESPONSE" lowerBound="0" upperBound="100" step="1" stepLabel="true"/>
      </div>
    </itemBody>
    
    <responseProcessing template="http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct"/>
    
  </assessmentItem>`,

  order: (itemId: string) => `<assessmentItem identifier="${itemId}" 
                   title="Order Interaction" 
                   adaptive="false" 
                   timeDependent="false">
    
    <responseDeclaration identifier="RESPONSE" cardinality="ordered" baseType="identifier">
      <correctResponse>
        <value>ChoiceA</value>
        <value>ChoiceB</value>
        <value>ChoiceC</value>
      </correctResponse>
    </responseDeclaration>
    
    <outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float">
      <defaultValue>
        <value>0</value>
      </defaultValue>
    </outcomeDeclaration>
    
    <itemBody>
      <div>
        <p>Arrange the following items in the correct order:</p>
        <orderInteraction responseIdentifier="RESPONSE" shuffle="true">
          <prompt>Drag to reorder:</prompt>
          <simpleChoice identifier="ChoiceA">First item</simpleChoice>
          <simpleChoice identifier="ChoiceB">Second item</simpleChoice>
          <simpleChoice identifier="ChoiceC">Third item</simpleChoice>
        </orderInteraction>
      </div>
    </itemBody>
    
    <responseProcessing template="http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct"/>
    
  </assessmentItem>`
};

export const ITEM_TYPE_LABELS = {
  choice: 'Multiple Choice',
  multipleResponse: 'Multiple Response',
  textEntry: 'Fill in the Blank',
  extendedText: 'Extended Text',
  hottext: 'Hottext Selection',
  slider: 'Slider',
  order: 'Order Interaction'
};

export function generateItemId(): string {
  return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function insertItemIntoXML(xmlContent: string, newItemXML: string, insertAfterIndex?: number): string {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
  
  // Check if this is an assessmentTest or standalone items
  const assessmentTest = xmlDoc.querySelector('assessmentTest');
  const assessmentItems = xmlDoc.querySelectorAll('assessmentItem');
  
  if (assessmentItems.length === 0) {
    // No existing items, return just the new item with proper XML declaration
    return `<?xml version="1.0" encoding="UTF-8"?>\n${newItemXML.trim()}`;
  }
  
  if (assessmentTest) {
    // We have an assessmentTest container - need to insert properly
    const itemsInTest = assessmentTest.querySelectorAll('assessmentItem');
    
    // Calculate insertion position
    let insertIndex: number;
    if (insertAfterIndex === -1) {
      insertIndex = 0; // Insert at beginning
    } else if (insertAfterIndex === undefined || insertAfterIndex >= itemsInTest.length - 1) {
      insertIndex = itemsInTest.length; // Insert at end
    } else {
      insertIndex = insertAfterIndex + 1; // Insert after specified index
    }
    
    // Parse the new item to add proper indentation
    const newItemDoc = parser.parseFromString(`<root>${newItemXML.trim()}</root>`, 'text/xml');
    const newItemElement = newItemDoc.querySelector('assessmentItem');
    
    if (!newItemElement) {
      throw new Error('Invalid new item XML');
    }
    
    // Import the new node into the target document
    const importedNode = xmlDoc.importNode(newItemElement, true);
    
    // Insert the new item without adding extra whitespace nodes
    if (insertIndex === 0) {
      // Insert as first child
      const firstItem = itemsInTest[0];
      assessmentTest.insertBefore(importedNode, firstItem);
    } else if (insertIndex >= itemsInTest.length) {
      // Insert at the end
      assessmentTest.appendChild(importedNode);
    } else {
      // Insert after the specified item
      const nextItem = itemsInTest[insertIndex];
      assessmentTest.insertBefore(importedNode, nextItem);
    }
    
    // Serialize back to string with proper formatting
    const serializer = new XMLSerializer();
    let result = serializer.serializeToString(xmlDoc);
    
    // Clean up the XML formatting to ensure consistent spacing
    result = result.replace(/><assessmentItem/g, '>\n\n  <assessmentItem');
    result = result.replace(/<\/assessmentItem><assessmentItem/g, '</assessmentItem>\n\n  <assessmentItem');
    result = result.replace(/<\/assessmentItem><\/assessmentTest>/g, '</assessmentItem>\n\n</assessmentTest>');
    
    return result;
  } else {
    // Standalone items - need to handle namespaces properly
    const firstItem = assessmentItems[0];
    const hasNamespaces = firstItem && firstItem.hasAttribute('xmlns');
    
    // If the existing items have namespaces, add them to the new item
    let finalNewItemXML = newItemXML.trim();
    if (hasNamespaces) {
      const xmlns = firstItem.getAttribute('xmlns') || '';
      const xmlnsXsi = firstItem.getAttribute('xmlns:xsi') || '';
      const schemaLocation = firstItem.getAttribute('xsi:schemaLocation') || '';
      
      // Add namespaces to the new item
      finalNewItemXML = finalNewItemXML.replace(
        '<assessmentItem identifier=',
        `<assessmentItem xmlns="${xmlns}" xmlns:xsi="${xmlnsXsi}" xsi:schemaLocation="${schemaLocation}" identifier=`
      );
    }
    
    const insertIndex = insertAfterIndex !== undefined && insertAfterIndex >= 0 
      ? insertAfterIndex + 1
      : insertAfterIndex === -1 
        ? 0 
        : assessmentItems.length;
    
    // Extract XML declaration
    const xmlDeclarationMatch = xmlContent.match(/^<\?xml[^>]*>\s*/);
    const xmlDeclaration = xmlDeclarationMatch ? xmlDeclarationMatch[0] : '';
    const contentWithoutDeclaration = xmlContent.replace(/^<\?xml[^>]*>\s*/, '');
    
    // Split content into individual assessment items
    const itemRegex = /<assessmentItem[\s\S]*?<\/assessmentItem>/g;
    const itemMatches: string[] = contentWithoutDeclaration.match(itemRegex) || [];
    
    // Insert new item at specified position
    if (insertIndex === 0) {
      itemMatches.unshift(finalNewItemXML);
    } else if (insertIndex >= itemMatches.length) {
      itemMatches.push(finalNewItemXML);
    } else {
      itemMatches.splice(insertIndex, 0, finalNewItemXML);
    }
    
    return xmlDeclaration + itemMatches.join('\n\n');
  }
}