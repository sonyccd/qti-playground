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

// Mock the new parser factory
vi.mock('@/parsers/QTIParserFactory', () => ({
  QTIParserFactory: {
    getParser: vi.fn().mockReturnValue({
      parse: vi.fn().mockReturnValue({
        items: [],
        errors: [],
        unsupportedElements: [],
        version: '3.0'
      }),
      getBlankTemplate: vi.fn().mockReturnValue('<blank>template</blank>'),
      insertItem: vi.fn().mockReturnValue('<updated>xml</updated>'),
      updateCorrectResponse: vi.fn().mockReturnValue('<updated>xml</updated>'),
      formatXML: vi.fn().mockReturnValue('<formatted>xml</formatted>'),
      reorderItems: vi.fn().mockReturnValue('<reordered>xml</reordered>'),
      getConstants: vi.fn().mockReturnValue({
        itemTypeLabels: { choice: 'Multiple Choice' },
        itemTypeColors: { choice: 'primary' }
      })
    }),
    getParserFromXML: vi.fn().mockReturnValue({
      parse: vi.fn().mockReturnValue({
        items: [],
        errors: [],
        unsupportedElements: [],
        version: '3.0'
      })
    })
  }
}));

vi.mock('@/constants/qtiConstants', () => ({
  getItemTypeLabel: vi.fn().mockReturnValue('Multiple Choice'),
  getItemTypeColor: vi.fn().mockReturnValue('primary')
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
  FormControl: ({ children }: any) => <div>{children}</div>,
  InputLabel: ({ children }: any) => <label>{children}</label>,
  Select: ({ children, value, onChange }: any) => <select value={value} onChange={onChange}>{children}</select>,
  MenuItem: ({ children, value }: any) => <option value={value}>{children}</option>,
  Tooltip: ({ children }: any) => <div>{children}</div>,
  Grid: ({ children }: any) => <div>{children}</div>,
  useTheme: () => ({ palette: { background: { default: '#fff' }, grey: { 50: '#f5f5f5' } } })
}));

vi.mock('@mui/icons-material', () => ({
  Description: () => <span>Description</span>,
  Download: () => <span>Download</span>,
  Code: () => <span>Code</span>,
  Visibility: () => <span>Visibility</span>,
  OpenInFull: () => <span>OpenInFull</span>,
  Add: () => <span>Add</span>,
  DataObject: () => <span>DataObject</span>,
  Lock: () => <span>Lock</span>,
  Error: () => <span>Error</span>,
  Refresh: () => <span>Refresh</span>
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

vi.mock('../QTIVersionSelector', () => ({
  QTIVersionSelector: ({ selectedVersion, onVersionChange }: any) => (
    <div data-testid="version-selector">
      <select 
        value={selectedVersion} 
        onChange={(e) => onVersionChange(e.target.value)}
        data-testid="version-select"
      >
        <option value="2.1">QTI 2.1</option>
        <option value="3.0">QTI 3.0</option>
      </select>
    </div>
  )
}));

vi.mock('../ContentFormatSelector', () => ({
  default: ({ selectedFormat, onFormatChange }: any) => (
    <div data-testid="format-selector">
      <select 
        value={selectedFormat} 
        onChange={(e) => onFormatChange(e.target.value)}
        data-testid="format-select"
      >
        <option value="xml">XML</option>
        <option value="json">JSON</option>
      </select>
    </div>
  )
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

  it('should render version selector', () => {
    render(<QTIPreview />);
    expect(screen.getByTestId('version-selector')).toBeInTheDocument();
    expect(screen.getByTestId('version-select')).toBeInTheDocument();
  });

  it('should default to QTI 3.0 version', () => {
    render(<QTIPreview />);
    const versionSelect = screen.getByTestId('version-select') as HTMLSelectElement;
    expect(versionSelect.value).toBe('3.0');
  });
});