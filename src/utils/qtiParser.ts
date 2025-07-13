import { QTIItem, QTIChoice, QTIParseResult, UnsupportedElement } from '@/types/qti';

export function parseQTIXML(xmlContent: string): QTIParseResult {
  const errors: string[] = [];
  const items: QTIItem[] = [];
  const unsupportedElements: Map<string, UnsupportedElement> = new Map();

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

    // Check for parsing errors
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      return {
        success: false,
        items: [],
        errors: ['Invalid XML format'],
        unsupportedElements: []
      };
    }

    // Find all assessmentItem elements
    const assessmentItems = xmlDoc.querySelectorAll('assessmentItem');
    
    if (assessmentItems.length === 0) {
      errors.push('No assessment items found in the QTI file');
    }

    // Scan for unsupported elements
    scanForUnsupportedElements(xmlDoc, unsupportedElements);

    assessmentItems.forEach((itemElement, index) => {
      try {
        const item = parseAssessmentItem(itemElement, unsupportedElements);
        if (item) {
          items.push(item);
        }
      } catch (error) {
        errors.push(`Error parsing item ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    return {
      success: errors.length === 0 || items.length > 0,
      items,
      errors,
      unsupportedElements: Array.from(unsupportedElements.values())
    };
  } catch (error) {
    return {
      success: false,
      items: [],
      errors: [`Failed to parse QTI XML: ${error instanceof Error ? error.message : 'Unknown error'}`],
      unsupportedElements: []
    };
  }
}

function parseAssessmentItem(itemElement: Element, unsupportedElements: Map<string, UnsupportedElement>): QTIItem | null {
  const id = itemElement.getAttribute('identifier') || `item-${Date.now()}`;
  const title = itemElement.getAttribute('title') || 'Untitled Item';

  // Get the item body
  const itemBody = itemElement.querySelector('itemBody');
  if (!itemBody) {
    throw new Error('No itemBody found');
  }

  // Extract prompt text
  const prompt = extractPromptText(itemBody);

  // Determine item type and parse accordingly
  const choiceInteraction = itemBody.querySelector('choiceInteraction');
  const textEntryInteraction = itemBody.querySelector('textEntryInteraction');
  
  // Look for unsupported interaction types
  const allInteractions = itemBody.querySelectorAll('[class*="Interaction"], [tagName*="Interaction"]');
  allInteractions.forEach(interaction => {
    const tagName = interaction.tagName.toLowerCase();
    if (!['choiceinteraction', 'textentryinteraction'].includes(tagName)) {
      addUnsupportedElement(unsupportedElements, tagName, getInteractionDescription(tagName));
    }
  });

  if (choiceInteraction) {
    return parseChoiceInteraction(id, title, prompt, choiceInteraction, itemElement);
  } else if (textEntryInteraction) {
    return parseTextEntryInteraction(id, title, prompt, textEntryInteraction, itemElement);
  }

  return {
    id,
    title,
    type: 'unknown',
    prompt,
  };
}

function extractPromptText(itemBody: Element): string {
  // Clone the element to avoid modifying the original
  const clone = itemBody.cloneNode(true) as Element;
  
  // Remove interaction elements to get just the prompt
  const interactions = clone.querySelectorAll('choiceInteraction, textEntryInteraction, extendedTextInteraction');
  interactions.forEach(interaction => interaction.remove());
  
  return clone.textContent?.trim() || '';
}

function parseChoiceInteraction(
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

  // Try to find correct response
  const correctResponse = findCorrectResponse(itemElement, responseIdentifier);

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

function parseTextEntryInteraction(
  id: string,
  title: string,
  prompt: string,
  textEntryInteraction: Element,
  itemElement: Element
): QTIItem {
  const responseIdentifier = textEntryInteraction.getAttribute('responseIdentifier') || 'RESPONSE';
  const correctResponse = findCorrectResponse(itemElement, responseIdentifier);

  return {
    id,
    title,
    type: 'textEntry',
    prompt,
    correctResponse,
    responseIdentifier
  };
}

function findCorrectResponse(itemElement: Element, responseIdentifier: string): string | string[] | undefined {
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

function scanForUnsupportedElements(xmlDoc: Document, unsupportedElements: Map<string, UnsupportedElement>) {
  // Common QTI interaction types that are not supported
  const unsupportedInteractions = [
    'extendedTextInteraction',
    'orderInteraction', 
    'associateInteraction',
    'matchInteraction',
    'gapMatchInteraction',
    'inlineChoiceInteraction',
    'textEntryInteraction',
    'hottextInteraction',
    'hotspotInteraction',
    'graphicOrderInteraction',
    'graphicAssociateInteraction',
    'graphicGapMatchInteraction',
    'positionObjectInteraction',
    'sliderInteraction',
    'drawingInteraction',
    'uploadInteraction'
  ];

  unsupportedInteractions.forEach(interactionType => {
    const elements = xmlDoc.querySelectorAll(interactionType);
    if (elements.length > 0) {
      addUnsupportedElement(unsupportedElements, interactionType, getInteractionDescription(interactionType));
    }
  });

  // Look for any custom interactions
  const customInteractions = xmlDoc.querySelectorAll('customInteraction');
  if (customInteractions.length > 0) {
    addUnsupportedElement(unsupportedElements, 'customInteraction', 'Custom interaction elements');
  }

  // Look for modal feedback
  const modalFeedback = xmlDoc.querySelectorAll('modalFeedback');
  if (modalFeedback.length > 0) {
    addUnsupportedElement(unsupportedElements, 'modalFeedback', 'Modal feedback elements');
  }

  // Look for outcome processing
  const outcomeProcessing = xmlDoc.querySelectorAll('outcomeProcessing');
  if (outcomeProcessing.length > 0) {
    addUnsupportedElement(unsupportedElements, 'outcomeProcessing', 'Outcome processing rules');
  }
}

function addUnsupportedElement(unsupportedElements: Map<string, UnsupportedElement>, type: string, description: string) {
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

function getInteractionDescription(interactionType: string): string {
  const descriptions: Record<string, string> = {
    'extendedTextInteraction': 'Extended text input fields',
    'orderInteraction': 'Drag and drop ordering',
    'associateInteraction': 'Association/matching pairs',
    'matchInteraction': 'Matrix matching questions',
    'gapMatchInteraction': 'Gap matching with draggable items',
    'inlineChoiceInteraction': 'Inline dropdown selections',
    'hottextInteraction': 'Hottext selection',
    'hotspotInteraction': 'Image hotspot clicking',
    'graphicOrderInteraction': 'Graphic ordering tasks',
    'graphicAssociateInteraction': 'Graphic association tasks',
    'graphicGapMatchInteraction': 'Graphic gap matching',
    'positionObjectInteraction': 'Object positioning',
    'sliderInteraction': 'Slider controls',
    'drawingInteraction': 'Drawing/sketching',
    'uploadInteraction': 'File upload questions'
  };
  
  return descriptions[interactionType] || `${interactionType} elements`;
}