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

export function reorderQTIItems(xmlContent: string, fromIndex: number, toIndex: number): string {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
    
    // Find all assessmentItem elements
    const assessmentItems = Array.from(xmlDoc.querySelectorAll('assessmentItem'));
    
    if (fromIndex < 0 || fromIndex >= assessmentItems.length || 
        toIndex < 0 || toIndex >= assessmentItems.length) {
      return xmlContent;
    }
    
    // Get the item to move
    const itemToMove = assessmentItems[fromIndex];
    const parent = itemToMove.parentNode;
    
    if (!parent) return xmlContent;
    
    // Remove the item from its current position
    parent.removeChild(itemToMove);
    
    // Find the new position and insert
    const remainingItems = Array.from(parent.querySelectorAll('assessmentItem'));
    
    if (toIndex >= remainingItems.length) {
      // Insert at the end
      parent.appendChild(itemToMove);
    } else {
      // Insert before the item at toIndex
      const referenceItem = remainingItems[toIndex];
      parent.insertBefore(itemToMove, referenceItem);
    }
    
    const serializer = new XMLSerializer();
    const result = serializer.serializeToString(xmlDoc);
    return formatXML(result);
  } catch (error) {
    console.error('Error reordering QTI items:', error);
    return xmlContent;
  }
}

export function formatXML(xml: string): string {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    
    // Remove all text nodes that are just whitespace
    function removeWhitespaceNodes(node: Node) {
      for (let i = node.childNodes.length - 1; i >= 0; i--) {
        const child = node.childNodes[i];
        if (child.nodeType === Node.TEXT_NODE && /^\s*$/.test(child.textContent || '')) {
          node.removeChild(child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          removeWhitespaceNodes(child);
        }
      }
    }
    
    removeWhitespaceNodes(xmlDoc);
    
    const serializer = new XMLSerializer();
    let formatted = serializer.serializeToString(xmlDoc);
    
    // Simple but effective formatting
    formatted = formatted.replace(/></g, '>\n<');
    
    const lines = formatted.split('\n');
    let indent = 0;
    const indentStr = '  ';
    
    return lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      // Decrease indent for closing tags
      if (trimmed.startsWith('</')) {
        indent = Math.max(0, indent - 1);
      }
      
      const result = indentStr.repeat(indent) + trimmed;
      
      // Increase indent for opening tags (but not self-closing or if followed by closing tag)
      if (trimmed.startsWith('<') && 
          !trimmed.startsWith('</') && 
          !trimmed.endsWith('/>') &&
          !trimmed.includes('</')) {
        indent++;
      }
      
      return result;
    }).filter(line => line.trim()).join('\n');
  } catch (error) {
    console.error('Error formatting XML:', error);
    return xml;
  }
}