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
    // We have an assessmentTest container - insert inside it
    const itemsInTest = assessmentTest.querySelectorAll('assessmentItem');
    const insertIndex = insertAfterIndex !== undefined && insertAfterIndex >= 0 
      ? Math.min(insertAfterIndex + 1, itemsInTest.length)
      : insertAfterIndex === -1 
        ? 0 
        : itemsInTest.length;
    
    // Convert to string and find insertion point
    const serializer = new XMLSerializer();
    let testXML = serializer.serializeToString(xmlDoc);
    
    if (itemsInTest.length === 0) {
      // Empty test, insert before closing tag
      testXML = testXML.replace('</assessmentTest>', `\n  ${newItemXML.trim()}\n\n</assessmentTest>`);
    } else {
      // Insert at the specified position
      const targetItem = itemsInTest[insertIndex - 1] || itemsInTest[itemsInTest.length - 1];
      const targetItemXML = serializer.serializeToString(targetItem);
      const insertPoint = testXML.indexOf(targetItemXML) + targetItemXML.length;
      testXML = testXML.slice(0, insertPoint) + `\n\n  ${newItemXML.trim()}` + testXML.slice(insertPoint);
    }
    
    return testXML;
  } else {
    // Standalone items - simple concatenation
    const insertIndex = insertAfterIndex !== undefined && insertAfterIndex >= 0 
      ? insertAfterIndex + 1
      : insertAfterIndex === -1 
        ? 0 
        : assessmentItems.length;
    
    // Split content by items and reassemble
    const lines = xmlContent.split('\n');
    const result: string[] = [];
    let currentItemLines: string[] = [];
    let inItem = false;
    let itemCount = 0;
    
    for (const line of lines) {
      if (line.trim().startsWith('<?xml') || line.trim().startsWith('<assessmentItem')) {
        if (inItem && currentItemLines.length > 0) {
          // Finish previous item
          if (itemCount === insertIndex) {
            result.push(newItemXML.trim());
          }
          result.push(currentItemLines.join('\n'));
          currentItemLines = [];
          itemCount++;
        }
        inItem = line.trim().startsWith('<assessmentItem');
        currentItemLines.push(line);
      } else if (line.trim() === '</assessmentItem>') {
        currentItemLines.push(line);
        if (itemCount === insertIndex) {
          result.push(newItemXML.trim());
        }
        result.push(currentItemLines.join('\n'));
        currentItemLines = [];
        itemCount++;
        inItem = false;
      } else {
        currentItemLines.push(line);
      }
    }
    
    // Handle any remaining content
    if (currentItemLines.length > 0) {
      result.push(currentItemLines.join('\n'));
    }
    
    // If inserting at the end or at the beginning
    if (insertIndex === 0) {
      result.unshift(newItemXML.trim());
    } else if (insertIndex >= assessmentItems.length) {
      result.push(newItemXML.trim());
    }
    
    return result.filter(item => item.trim()).join('\n\n');
  }
}