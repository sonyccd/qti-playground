import { QTIItem, QTIChoice, QTIParseResult } from '@/types/qti';

export function parseQTIXML(xmlContent: string): QTIParseResult {
  const errors: string[] = [];
  const items: QTIItem[] = [];

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

    // Check for parsing errors
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      return {
        success: false,
        items: [],
        errors: ['Invalid XML format']
      };
    }

    // Find all assessmentItem elements
    const assessmentItems = xmlDoc.querySelectorAll('assessmentItem');
    
    if (assessmentItems.length === 0) {
      errors.push('No assessment items found in the QTI file');
    }

    assessmentItems.forEach((itemElement, index) => {
      try {
        const item = parseAssessmentItem(itemElement);
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
      errors
    };
  } catch (error) {
    return {
      success: false,
      items: [],
      errors: [`Failed to parse QTI XML: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
}

function parseAssessmentItem(itemElement: Element): QTIItem | null {
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