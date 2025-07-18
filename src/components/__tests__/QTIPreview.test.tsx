import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QTIPreview } from '../QTIPreview';

// Mock all external dependencies to prevent complex interactions
vi.mock('@/lib/posthog', () => ({
  posthog: { capture: vi.fn() }
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() })
}));

vi.mock('@/utils/qtiParser', () => ({
  parseQTIXML: vi.fn().mockReturnValue({
    success: true,
    items: [],
    errors: [],
    unsupportedElements: []
  })
}));

vi.mock('@/utils/qtiTemplates', () => ({
  insertItemIntoXML: vi.fn().mockReturnValue('<updated>xml</updated>')
}));

vi.mock('@/utils/xmlUpdater', () => ({
  updateQTIXMLWithCorrectResponse: vi.fn().mockReturnValue('<updated>xml</updated>'),
  formatXML: vi.fn().mockReturnValue('<formatted>xml</formatted>'),
  reorderQTIItems: vi.fn().mockReturnValue('<reordered>xml</reordered>')
}));

// Simple mocks that don't cause prop warnings
vi.mock('@mui/material', () => ({
  Box: ({ children }: any) => <div>{children}</div>,
  Container: ({ children }: any) => <div>{children}</div>,
  Card: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  Typography: ({ children }: any) => <span>{children}</span>,
  Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
  Chip: ({ label }: any) => <span>{label}</span>,
  Alert: ({ children, severity }: any) => <div data-testid={`alert-${severity}`}>{children}</div>,
  AlertTitle: ({ children }: any) => <div>{children}</div>,
  CircularProgress: () => <div data-testid="loading">Loading...</div>,
  useTheme: () => ({ palette: { background: { default: '#fff' }, grey: { 50: '#f5f5f5' } } })
}));

vi.mock('@mui/icons-material', () => ({
  Description: () => <span>Description</span>,
  Download: () => <span>Download</span>,
  Code: () => <span>Code</span>,
  Visibility: () => <span>Visibility</span>,
  OpenInFull: () => <span>OpenInFull</span>,
  Add: () => <span>Add</span>
}));

vi.mock('@uiw/react-codemirror', () => ({
  default: () => <div data-testid="code-editor">Editor</div>
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children }: any) => <a>{children}</a>
}));

vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: any) => <div>{children}</div>,
  useSensor: vi.fn(),
  useSensors: () => [],
  PointerSensor: vi.fn(),
  KeyboardSensor: vi.fn(),
  closestCenter: vi.fn()
}));

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: any) => <div>{children}</div>,
  arrayMove: vi.fn(),
  sortableKeyboardCoordinates: vi.fn(),
  verticalListSortingStrategy: vi.fn()
}));

vi.mock('../FileUpload', () => ({
  FileUpload: () => <div data-testid="file-upload">File Upload Component</div>
}));

vi.mock('../qti/SortableQTIItem', () => ({
  SortableQTIItem: () => <div data-testid="sortable-item">QTI Item</div>
}));

vi.mock('../qti/AddItemButton', () => ({
  AddItemButton: () => <button data-testid="add-item-button">Add Item</button>
}));

describe('QTIPreview - Basic Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('<sample>xml</sample>')
    });
  });

  it('should render the component without crashing', () => {
    render(<QTIPreview />);
    expect(screen.getByTestId('file-upload')).toBeInTheDocument();
  });

  it('should render example and create buttons', () => {
    render(<QTIPreview />);
    expect(screen.getByText('Try Example QTI File')).toBeInTheDocument();
    expect(screen.getByText('Create Blank File')).toBeInTheDocument();
  });

  it('should render file upload component initially', () => {
    render(<QTIPreview />);
    expect(screen.getByTestId('file-upload')).toBeInTheDocument();
  });
});