import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQTIPreview } from '../useQTIPreview';

// Mock external dependencies
vi.mock('@/lib/posthog', () => ({
  posthog: { capture: vi.fn() }
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() })
}));

vi.mock('@/parsers/QTIParserFactory', () => ({
  QTIParserFactory: {
    getParser: vi.fn().mockReturnValue({
      parse: vi.fn().mockReturnValue({
        items: [
          {
            id: 'item1',
            title: 'Test Item',
            type: 'choice',
            prompt: 'Test prompt',
            choices: [
              { identifier: 'A', text: 'Option A' },
              { identifier: 'B', text: 'Option B' }
            ]
          }
        ],
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

// Mock dnd-kit
vi.mock('@dnd-kit/sortable', () => ({
  arrayMove: vi.fn().mockImplementation((items, oldIndex, newIndex) => {
    const newItems = [...items];
    const [removed] = newItems.splice(oldIndex, 1);
    newItems.splice(newIndex, 0, removed);
    return newItems;
  })
}));

// Mock global fetch
global.fetch = vi.fn();

describe('useQTIPreview', () => {

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('<sample>xml</sample>')
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useQTIPreview());
    
    expect(result.current.state.selectedVersion).toBe('3.0');
    expect(result.current.state.qtiItems).toEqual([]);
    expect(result.current.state.errors).toEqual([]);
    expect(result.current.state.hasContent).toBe(false);
    expect(result.current.state.isLoading).toBe(false);
    expect(result.current.state.layoutMode).toBe('split');
  });

  it('should update state when updateState is called', () => {
    const { result } = renderHook(() => useQTIPreview());
    
    act(() => {
      result.current.actions.updateState({ selectedVersion: '3.0' });
    });
    
    expect(result.current.state.selectedVersion).toBe('3.0');
  });

  it('should handle version change', () => {
    const { result } = renderHook(() => useQTIPreview());
    
    act(() => {
      result.current.actions.handleVersionChange('3.0');
    });
    
    expect(result.current.state.selectedVersion).toBe('3.0');
  });

  it('should handle file selection', async () => {
    const { result } = renderHook(() => useQTIPreview());
    
    const mockFile = new File(['<xml>content</xml>'], 'test.xml', { type: 'text/xml' });
    Object.defineProperty(mockFile, 'text', {
      value: vi.fn().mockResolvedValue('<xml>content</xml>')
    });
    
    await act(async () => {
      await result.current.actions.handleFileSelect(mockFile);
    });
    
    expect(result.current.state.selectedFile).toBe(mockFile);
    expect(result.current.state.hasContent).toBe(true);
    expect(result.current.state.xmlContent).toBe('<xml>content</xml>');
  });

  it('should handle XML content change', () => {
    const { result } = renderHook(() => useQTIPreview());
    
    act(() => {
      result.current.actions.handleXmlChange('<new>xml</new>');
    });
    
    expect(result.current.state.xmlContent).toBe('<new>xml</new>');
  });

  it('should handle loading example', async () => {
    const { result } = renderHook(() => useQTIPreview());
    
    await act(async () => {
      await result.current.actions.handleLoadExample();
    });
    
    expect(global.fetch).toHaveBeenCalledWith('/sample-qti.xml');
    expect(result.current.state.hasContent).toBe(true);
    expect(result.current.state.xmlContent).toBe('<sample>xml</sample>');
  });

  it('should handle creating blank file', () => {
    const { result } = renderHook(() => useQTIPreview());
    
    act(() => {
      result.current.actions.handleCreateBlankFile();
    });
    
    expect(result.current.state.hasContent).toBe(true);
    expect(result.current.state.xmlContent).toBe('<blank>template</blank>');
  });

  it('should handle clearing file', () => {
    const { result } = renderHook(() => useQTIPreview());
    
    // First set some content
    act(() => {
      result.current.actions.updateState({ 
        hasContent: true, 
        xmlContent: '<content>test</content>',
        qtiItems: [{ id: 'item1', title: 'Test', type: 'choice', prompt: 'Test' }] as any
      });
    });
    
    // Then clear
    act(() => {
      result.current.actions.handleClearFile();
    });
    
    expect(result.current.state.hasContent).toBe(false);
    expect(result.current.state.xmlContent).toBe('');
    expect(result.current.state.qtiItems).toEqual([]);
  });

  it('should handle adding item', () => {
    const { result } = renderHook(() => useQTIPreview());
    
    // Set initial state
    act(() => {
      result.current.actions.updateState({ 
        xmlContent: '<xml>content</xml>',
        qtiItems: [] as any,
        selectedVersion: '2.1'
      });
    });
    
    act(() => {
      result.current.actions.handleAddItem('<new>item</new>', 0);
    });
    
    expect(result.current.state.xmlContent).toBe('<updated>xml</updated>');
  });

  it('should handle correct response change', () => {
    const { result } = renderHook(() => useQTIPreview());
    
    // Set initial state
    act(() => {
      result.current.actions.updateState({ 
        xmlContent: '<xml>content</xml>',
        selectedVersion: '2.1'
      });
    });
    
    act(() => {
      result.current.actions.handleCorrectResponseChange('item1', 'A');
    });
    
    expect(result.current.state.xmlContent).toBe('<formatted>xml</formatted>');
  });

  it('should handle drag end', () => {
    const { result } = renderHook(() => useQTIPreview());
    
    // Set initial state with items
    act(() => {
      result.current.actions.updateState({ 
        xmlContent: '<xml>content</xml>',
        qtiItems: [
          { id: 'item1', title: 'Item 1', type: 'choice', prompt: 'Test 1' },
          { id: 'item2', title: 'Item 2', type: 'choice', prompt: 'Test 2' }
        ] as any,
        selectedVersion: '2.1'
      });
    });
    
    const dragEvent = {
      active: { id: 'item1' },
      over: { id: 'item2' }
    };
    
    act(() => {
      result.current.actions.handleDragEnd(dragEvent);
    });
    
    expect(result.current.state.xmlContent).toBe('<reordered>xml</reordered>');
  });

  it('should handle download XML', () => {
    const { result } = renderHook(() => useQTIPreview());
    
    // Mock DOM methods
    const mockCreateElement = vi.fn().mockReturnValue({
      href: '',
      download: '',
      click: vi.fn()
    });
    const mockCreateObjectURL = vi.fn().mockReturnValue('blob:url');
    const mockRevokeObjectURL = vi.fn();
    
    Object.defineProperty(document, 'createElement', { value: mockCreateElement });
    Object.defineProperty(document.body, 'appendChild', { value: vi.fn() });
    Object.defineProperty(document.body, 'removeChild', { value: vi.fn() });
    Object.defineProperty(URL, 'createObjectURL', { value: mockCreateObjectURL });
    Object.defineProperty(URL, 'revokeObjectURL', { value: mockRevokeObjectURL });
    
    // Set initial state
    act(() => {
      result.current.actions.updateState({ 
        xmlContent: '<xml>content</xml>',
        qtiItems: [{ id: 'item1', title: 'Test', type: 'choice', prompt: 'Test' }] as any,
        selectedVersion: '2.1'
      });
    });
    
    act(() => {
      result.current.actions.downloadXML();
    });
    
    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });

});