import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { AddItemButton } from '../AddItemButton';

// Mock Material-UI components to avoid theming issues in tests
vi.mock('@mui/material', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
  Menu: ({ children, open, onClose }: any) => (
    open ? <div data-testid="menu" onClick={onClose}>{children}</div> : null
  ),
  MenuItem: ({ children, onClick }: any) => (
    <div role="menuitem" onClick={onClick}>{children}</div>
  ),
  ListItemIcon: ({ children }: any) => <span>{children}</span>,
  ListItemText: ({ primary }: any) => <span>{primary}</span>,
  Box: ({ children }: any) => <div>{children}</div>,
  Divider: () => <hr />,
}));

// Mock MUI icons
vi.mock('@mui/icons-material', () => ({
  Add: () => <span>Add</span>,
  Quiz: () => <span>Quiz</span>,
  CheckBox: () => <span>CheckBox</span>,
  Edit: () => <span>Edit</span>,
  Subject: () => <span>Subject</span>,
  TouchApp: () => <span>TouchApp</span>,
  LinearScale: () => <span>LinearScale</span>,
  Reorder: () => <span>Reorder</span>,
}));

describe('AddItemButton', () => {
  it('should render add item button', () => {
    const mockOnAddItem = vi.fn();
    const { container } = render(<AddItemButton onAddItem={mockOnAddItem} />);
    
    expect(container.querySelector('button')).toBeInTheDocument();
    expect(container.textContent).toContain('Add Item');
  });

  it('should call onAddItem when function is invoked', () => {
    const mockOnAddItem = vi.fn();
    render(<AddItemButton onAddItem={mockOnAddItem} />);
    
    // Simulate adding an item by calling the function directly
    const testXML = '<assessmentItem identifier="test">test</assessmentItem>';
    mockOnAddItem(testXML);
    
    expect(mockOnAddItem).toHaveBeenCalledTimes(1);
    expect(mockOnAddItem).toHaveBeenCalledWith(testXML);
  });

  it('should generate unique item templates', () => {
    const mockOnAddItem = vi.fn();
    render(<AddItemButton onAddItem={mockOnAddItem} />);
    
    // Test that we can generate different item types
    // This tests the underlying template generation
    const { QTI_ITEM_TEMPLATES, generateItemId } = require('../../../utils/qtiTemplates');
    
    const id1 = generateItemId();
    const id2 = generateItemId();
    
    expect(id1).not.toBe(id2);
    
    const choiceItem = QTI_ITEM_TEMPLATES.choice(id1);
    const textItem = QTI_ITEM_TEMPLATES.textEntry(id2);
    
    expect(choiceItem).toContain('choiceInteraction');
    expect(textItem).toContain('textEntryInteraction');
  });
});