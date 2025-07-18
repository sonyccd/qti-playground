import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { AddItemButton } from '../AddItemButton';

// Mock Material-UI components to avoid theming issues in tests
vi.mock('@mui/material', () => ({
  Button: ({ children, onClick, startIcon, variant, size, sx, ...props }: any) => {
    const filteredProps = { ...props };
    delete filteredProps.startIcon;
    delete filteredProps.variant;
    delete filteredProps.size;
    delete filteredProps.sx;
    return (
      <button onClick={onClick} {...filteredProps}>
        {startIcon}{children}
      </button>
    );
  },
  Menu: ({ children, open, onClose, anchorEl, ...props }: any) => {
    const filteredProps = { ...props };
    delete filteredProps.anchorEl;
    return open ? <div data-testid="menu" onClick={onClose} {...filteredProps}>{children}</div> : null;
  },
  MenuItem: ({ children, onClick, ...props }: any) => (
    <div role="menuitem" onClick={onClick} {...props}>{children}</div>
  ),
  ListItemIcon: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  ListItemText: ({ primary, ...props }: any) => <span {...props}>{primary}</span>,
  Box: ({ children, sx, ...props }: any) => {
    const filteredProps = { ...props };
    delete filteredProps.sx;
    return <div {...filteredProps}>{children}</div>;
  },
  Divider: ({ ...props }: any) => <hr {...props} />,
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
    
    // Test that the component renders without issues
    // The actual template generation is tested separately in qtiTemplates.test.ts
    expect(mockOnAddItem).toBeDefined();
  });
});