export const QTI_ITEM_TEMPLATES = {
  choice: (itemId: string) => `
  <assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1" 
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v2p1 http://www.imsglobal.org/xsd/qti/qtiv2p1/imsqti_v2p1.xsd"
                   identifier="${itemId}" 
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

  multipleResponse: (itemId: string) => `
  <assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1" 
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v2p1 http://www.imsglobal.org/xsd/qti/qtiv2p1/imsqti_v2p1.xsd"
                   identifier="${itemId}" 
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

  textEntry: (itemId: string) => `
  <assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1" 
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v2p1 http://www.imsglobal.org/xsd/qti/qtiv2p1/imsqti_v2p1.xsd"
                   identifier="${itemId}" 
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

  extendedText: (itemId: string) => `
  <assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1" 
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v2p1 http://www.imsglobal.org/xsd/qti/qtiv2p1/imsqti_v2p1.xsd"
                   identifier="${itemId}" 
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

  hottext: (itemId: string) => `
  <assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1" 
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v2p1 http://www.imsglobal.org/xsd/qti/qtiv2p1/imsqti_v2p1.xsd"
                   identifier="${itemId}" 
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

  slider: (itemId: string) => `
  <assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1" 
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v2p1 http://www.imsglobal.org/xsd/qti/qtiv2p1/imsqti_v2p1.xsd"
                   identifier="${itemId}" 
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

  order: (itemId: string) => `
  <assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1" 
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v2p1 http://www.imsglobal.org/xsd/qti/qtiv2p1/imsqti_v2p1.xsd"
                   identifier="${itemId}" 
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
  
  // Check if we have a single assessmentItem or multiple in a test
  const assessmentItems = xmlDoc.querySelectorAll('assessmentItem');
  
  if (assessmentItems.length === 0) {
    // No existing items, replace entire content
    return newItemXML.trim();
  }
  
  if (assessmentItems.length === 1) {
    // Single item file, convert to multi-item format
    const singleItem = assessmentItems[0];
    const newItemDoc = parser.parseFromString(newItemXML.trim(), 'text/xml');
    const newItem = newItemDoc.querySelector('assessmentItem');
    
    if (!newItem) return xmlContent;
    
    // Create a simple container with both items
    if (insertAfterIndex === undefined || insertAfterIndex === 0) {
      return `${xmlContent.trim()}\n\n${newItemXML.trim()}`;
    } else {
      return `${newItemXML.trim()}\n\n${xmlContent.trim()}`;
    }
  }
  
  // Multiple items - insert at specified position
  const items = Array.from(assessmentItems);
  const insertIndex = insertAfterIndex !== undefined ? insertAfterIndex + 1 : items.length;
  
  // Convert all items to string representations
  const itemStrings = items.map(item => {
    const serializer = new XMLSerializer();
    return serializer.serializeToString(item);
  });
  
  // Insert new item
  itemStrings.splice(insertIndex, 0, newItemXML.trim());
  
  return itemStrings.join('\n\n');
}