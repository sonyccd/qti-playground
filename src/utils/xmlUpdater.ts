import { QTIItem } from '@/types/qti';

export function updateQTIXMLWithCorrectResponse(
  xmlContent: string,
  itemId: string,
  correctResponse: string | string[] | number
): string {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
    
    // Find the assessment item
    const assessmentItem = xmlDoc.querySelector(`assessmentItem[identifier="${itemId}"]`);
    if (!assessmentItem) {
      console.warn(`Could not find assessment item with identifier: ${itemId}`);
      return xmlContent;
    }

    // Find or create responseDeclaration
    let responseDeclaration = assessmentItem.querySelector('responseDeclaration');
    if (!responseDeclaration) {
      responseDeclaration = xmlDoc.createElement('responseDeclaration');
      responseDeclaration.setAttribute('identifier', 'RESPONSE');
      responseDeclaration.setAttribute('cardinality', 'single');
      responseDeclaration.setAttribute('baseType', 'identifier');
      
      // Insert after outcomeDeclaration or at the beginning
      const outcomeDeclaration = assessmentItem.querySelector('outcomeDeclaration');
      if (outcomeDeclaration) {
        assessmentItem.insertBefore(responseDeclaration, outcomeDeclaration.nextSibling);
      } else {
        assessmentItem.insertBefore(responseDeclaration, assessmentItem.firstChild);
      }
    }

    // Find or create correctResponse
    let correctResponseElement = responseDeclaration.querySelector('correctResponse');
    if (!correctResponseElement) {
      correctResponseElement = xmlDoc.createElement('correctResponse');
      responseDeclaration.appendChild(correctResponseElement);
    }

    // Clear existing values
    correctResponseElement.innerHTML = '';

    // Add new values based on type
    if (Array.isArray(correctResponse)) {
      // Multiple values (choice, hottext)
      responseDeclaration.setAttribute('cardinality', 'multiple');
      correctResponse.forEach(value => {
        const valueElement = xmlDoc.createElement('value');
        valueElement.textContent = value;
        correctResponseElement.appendChild(valueElement);
      });
    } else {
      // Single value (textEntry, slider, extendedText)
      responseDeclaration.setAttribute('cardinality', 'single');
      const valueElement = xmlDoc.createElement('value');
      valueElement.textContent = String(correctResponse);
      correctResponseElement.appendChild(valueElement);
    }

    // Serialize back to string
    const serializer = new XMLSerializer();
    return serializer.serializeToString(xmlDoc);
  } catch (error) {
    console.error('Error updating XML:', error);
    return xmlContent;
  }
}

export function formatXML(xml: string): string {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    const serializer = new XMLSerializer();
    let formatted = serializer.serializeToString(xmlDoc);
    
    // Simple formatting with indentation
    formatted = formatted.replace(/></g, '>\n<');
    const lines = formatted.split('\n');
    let indent = 0;
    const indentStr = '  ';
    
    return lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('</')) {
        indent = Math.max(0, indent - 1);
      }
      const result = indentStr.repeat(indent) + trimmed;
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
        indent++;
      }
      return result;
    }).join('\n');
  } catch (error) {
    console.error('Error formatting XML:', error);
    return xml;
  }
}