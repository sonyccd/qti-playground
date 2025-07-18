import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUpload } from '../FileUpload';

// Mock the UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children, className }: any) => <div className={className}>{children}</div>
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, size, className }: any) => (
    <button 
      onClick={onClick} 
      className={`button ${variant} ${size} ${className}`}
    >
      {children}
    </button>
  )
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Upload: ({ className }: any) => <span className={className} data-testid="upload-icon">Upload</span>,
  FileText: ({ className }: any) => <span className={className} data-testid="file-text-icon">FileText</span>,
  X: ({ className }: any) => <span className={className} data-testid="x-icon">X</span>
}));

// Mock react-dropzone
vi.mock('react-dropzone', () => ({
  useDropzone: ({ onDrop, accept, multiple, onDragEnter, onDragLeave, onDropAccepted, onDropRejected }: any) => {
    return {
      getRootProps: () => ({
        onClick: () => {
          // Simulate file input click
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = Object.keys(accept).join(',');
          input.multiple = multiple;
          input.onchange = (e: any) => {
            const files = Array.from(e.target.files || []);
            if (files.length > 0) {
              onDrop(files);
              onDropAccepted(files);
            } else {
              onDropRejected([]);
            }
          };
          input.click();
        },
        onDragEnter: () => onDragEnter(),
        onDragLeave: () => onDragLeave(),
        onDrop: (e: any) => {
          e.preventDefault();
          const files = Array.from(e.dataTransfer?.files || []);
          if (files.length > 0) {
            onDrop(files);
            onDropAccepted(files);
          } else {
            onDropRejected([]);
          }
        },
        'data-testid': 'dropzone'
      }),
      getInputProps: () => ({
        type: 'file',
        accept: Object.keys(accept).join(','),
        multiple,
        style: { display: 'none' },
        'data-testid': 'file-input'
      })
    };
  }
}));

// Mock cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
}));

describe('FileUpload', () => {
  const mockOnFileSelect = vi.fn();
  const mockOnClear = vi.fn();

  const createMockFile = (name: string, type: string, size: number = 1024): File => {
    const file = new File(['mock content'], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Upload State (No File Selected)', () => {
    it('should render upload interface when no file is selected', () => {
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
        />
      );
      
      expect(screen.getByTestId('upload-icon')).toBeInTheDocument();
      expect(screen.getByText('Upload QTI XML File')).toBeInTheDocument();
      expect(screen.getByText('Drag and drop your QTI XML file here, or click to browse')).toBeInTheDocument();
      expect(screen.getByText('Supports: .xml files')).toBeInTheDocument();
    });

    it('should show drag active state when dragging over', () => {
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
        />
      );
      
      const dropzone = screen.getByTestId('dropzone');
      
      fireEvent.dragEnter(dropzone);
      
      expect(screen.getByText('Drop your QTI file here')).toBeInTheDocument();
    });

    it('should reset drag state when drag leaves', () => {
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
        />
      );
      
      const dropzone = screen.getByTestId('dropzone');
      
      fireEvent.dragEnter(dropzone);
      expect(screen.getByText('Drop your QTI file here')).toBeInTheDocument();
      
      fireEvent.dragLeave(dropzone);
      expect(screen.getByText('Upload QTI XML File')).toBeInTheDocument();
    });

    it('should apply custom className when provided', () => {
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
          className="custom-class"
        />
      );
      
      const card = screen.getByTestId('upload-icon').closest('.custom-class');
      expect(card).toBeInTheDocument();
    });

    it('should not render file input when not in upload state', () => {
      const mockFile = createMockFile('test.xml', 'text/xml');
      
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
          selectedFile={mockFile}
        />
      );
      
      expect(screen.queryByTestId('file-input')).not.toBeInTheDocument();
    });
  });

  describe('File Selected State', () => {
    it('should render selected file information', () => {
      const mockFile = createMockFile('test-file.xml', 'text/xml', 2048);
      
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
          selectedFile={mockFile}
        />
      );
      
      expect(screen.getByTestId('file-text-icon')).toBeInTheDocument();
      expect(screen.getByText('test-file.xml')).toBeInTheDocument();
      expect(screen.getByText('2.0 KB')).toBeInTheDocument();
    });

    it('should show clear button when file is selected', () => {
      const mockFile = createMockFile('test.xml', 'text/xml');
      
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
          selectedFile={mockFile}
        />
      );
      
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    });

    it('should call onClear when clear button is clicked', async () => {
      const user = userEvent.setup();
      const mockFile = createMockFile('test.xml', 'text/xml');
      
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
          selectedFile={mockFile}
        />
      );
      
      const clearButton = screen.getByTestId('x-icon').closest('button')!;
      await user.click(clearButton);
      
      expect(mockOnClear).toHaveBeenCalledTimes(1);
    });

    it('should format file size correctly', () => {
      const testCases = [
        { size: 1024, expected: '1.0 KB' },
        { size: 1536, expected: '1.5 KB' },
        { size: 2048, expected: '2.0 KB' },
        { size: 512, expected: '0.5 KB' },
        { size: 10240, expected: '10.0 KB' }
      ];
      
      testCases.forEach(({ size, expected }) => {
        const mockFile = createMockFile('test.xml', 'text/xml', size);
        
        const { unmount } = render(
          <FileUpload 
            onFileSelect={mockOnFileSelect} 
            onClear={mockOnClear} 
            selectedFile={mockFile}
          />
        );
        
        expect(screen.getByText(expected)).toBeInTheDocument();
        unmount();
      });
    });

    it('should not show upload interface when file is selected', () => {
      const mockFile = createMockFile('test.xml', 'text/xml');
      
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
          selectedFile={mockFile}
        />
      );
      
      expect(screen.queryByTestId('upload-icon')).not.toBeInTheDocument();
      expect(screen.queryByText('Upload QTI XML File')).not.toBeInTheDocument();
    });
  });

  describe('File Selection and Validation', () => {
    it('should accept valid XML files by type', async () => {
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
        />
      );
      
      const dropzone = screen.getByTestId('dropzone');
      const mockFile = createMockFile('test.xml', 'text/xml');
      
      const dropEvent = new Event('drop', { bubbles: true });
      Object.defineProperty(dropEvent, 'dataTransfer', {
        value: {
          files: [mockFile]
        }
      });
      
      fireEvent(dropzone, dropEvent);
      
      await waitFor(() => {
        expect(mockOnFileSelect).toHaveBeenCalledWith(mockFile);
      });
    });

    it('should accept valid XML files by extension', async () => {
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
        />
      );
      
      const dropzone = screen.getByTestId('dropzone');
      const mockFile = createMockFile('test.xml', 'application/octet-stream'); // Wrong MIME type but correct extension
      
      const dropEvent = new Event('drop', { bubbles: true });
      Object.defineProperty(dropEvent, 'dataTransfer', {
        value: {
          files: [mockFile]
        }
      });
      
      fireEvent(dropzone, dropEvent);
      
      await waitFor(() => {
        expect(mockOnFileSelect).toHaveBeenCalledWith(mockFile);
      });
    });

    it('should reject non-XML files', async () => {
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
        />
      );
      
      const dropzone = screen.getByTestId('dropzone');
      const mockFile = createMockFile('test.txt', 'text/plain');
      
      const dropEvent = new Event('drop', { bubbles: true });
      Object.defineProperty(dropEvent, 'dataTransfer', {
        value: {
          files: [mockFile]
        }
      });
      
      fireEvent(dropzone, dropEvent);
      
      await waitFor(() => {
        expect(mockOnFileSelect).not.toHaveBeenCalled();
      });
    });

    it('should handle multiple files by selecting the first one', async () => {
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
        />
      );
      
      const dropzone = screen.getByTestId('dropzone');
      const mockFile1 = createMockFile('test1.xml', 'text/xml');
      const mockFile2 = createMockFile('test2.xml', 'text/xml');
      
      const dropEvent = new Event('drop', { bubbles: true });
      Object.defineProperty(dropEvent, 'dataTransfer', {
        value: {
          files: [mockFile1, mockFile2]
        }
      });
      
      fireEvent(dropzone, dropEvent);
      
      await waitFor(() => {
        expect(mockOnFileSelect).toHaveBeenCalledWith(mockFile1);
        expect(mockOnFileSelect).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle empty file list', async () => {
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
        />
      );
      
      const dropzone = screen.getByTestId('dropzone');
      
      const dropEvent = new Event('drop', { bubbles: true });
      Object.defineProperty(dropEvent, 'dataTransfer', {
        value: {
          files: []
        }
      });
      
      fireEvent(dropzone, dropEvent);
      
      await waitFor(() => {
        expect(mockOnFileSelect).not.toHaveBeenCalled();
      });
    });

    it('should handle application/xml MIME type', async () => {
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
        />
      );
      
      const dropzone = screen.getByTestId('dropzone');
      const mockFile = createMockFile('test.xml', 'application/xml');
      
      const dropEvent = new Event('drop', { bubbles: true });
      Object.defineProperty(dropEvent, 'dataTransfer', {
        value: {
          files: [mockFile]
        }
      });
      
      fireEvent(dropzone, dropEvent);
      
      await waitFor(() => {
        expect(mockOnFileSelect).toHaveBeenCalledWith(mockFile);
      });
    });
  });

  describe('Drag and Drop States', () => {
    it('should reset drag state on drop accepted', async () => {
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
        />
      );
      
      const dropzone = screen.getByTestId('dropzone');
      
      // Enter drag state
      fireEvent.dragEnter(dropzone);
      expect(screen.getByText('Drop your QTI file here')).toBeInTheDocument();
      
      // Drop valid file
      const mockFile = createMockFile('test.xml', 'text/xml');
      const dropEvent = new Event('drop', { bubbles: true });
      Object.defineProperty(dropEvent, 'dataTransfer', {
        value: {
          files: [mockFile]
        }
      });
      
      fireEvent(dropzone, dropEvent);
      
      await waitFor(() => {
        expect(screen.getByText('Upload QTI XML File')).toBeInTheDocument();
      });
    });

    it('should reset drag state on drop rejected', async () => {
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
        />
      );
      
      const dropzone = screen.getByTestId('dropzone');
      
      // Enter drag state
      fireEvent.dragEnter(dropzone);
      expect(screen.getByText('Drop your QTI file here')).toBeInTheDocument();
      
      // Drop invalid file
      const mockFile = createMockFile('test.txt', 'text/plain');
      const dropEvent = new Event('drop', { bubbles: true });
      Object.defineProperty(dropEvent, 'dataTransfer', {
        value: {
          files: [mockFile]
        }
      });
      
      fireEvent(dropzone, dropEvent);
      
      await waitFor(() => {
        expect(screen.getByText('Upload QTI XML File')).toBeInTheDocument();
      });
    });

    it('should handle click to browse files', async () => {
      const user = userEvent.setup();
      
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
        />
      );
      
      const dropzone = screen.getByTestId('dropzone');
      
      // Click should trigger file browser (mocked)
      await user.click(dropzone);
      
      // In real implementation, this would open file browser
      // Our mock will simulate file selection
      expect(dropzone).toBeInTheDocument();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle files without proper extension or MIME type', async () => {
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
        />
      );
      
      const dropzone = screen.getByTestId('dropzone');
      const mockFile = createMockFile('test', 'application/octet-stream'); // No extension, wrong type
      
      const dropEvent = new Event('drop', { bubbles: true });
      Object.defineProperty(dropEvent, 'dataTransfer', {
        value: {
          files: [mockFile]
        }
      });
      
      fireEvent(dropzone, dropEvent);
      
      await waitFor(() => {
        expect(mockOnFileSelect).not.toHaveBeenCalled();
      });
    });

    it('should handle very large files', () => {
      const largeFile = createMockFile('large.xml', 'text/xml', 1024 * 1024 * 10); // 10MB
      
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
          selectedFile={largeFile}
        />
      );
      
      expect(screen.getByText('10240.0 KB')).toBeInTheDocument();
    });

    it('should handle files with special characters in name', () => {
      const specialFile = createMockFile('test file (1) [copy].xml', 'text/xml');
      
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
          selectedFile={specialFile}
        />
      );
      
      expect(screen.getByText('test file (1) [copy].xml')).toBeInTheDocument();
    });

    it('should handle zero-size files', () => {
      const emptyFile = createMockFile('empty.xml', 'text/xml', 0);
      
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
          selectedFile={emptyFile}
        />
      );
      
      expect(screen.getByText('0.0 KB')).toBeInTheDocument();
    });

    it('should handle undefined selectedFile gracefully', () => {
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
          selectedFile={undefined}
        />
      );
      
      expect(screen.getByText('Upload QTI XML File')).toBeInTheDocument();
    });

    it('should handle null dataTransfer in drop event', () => {
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
        />
      );
      
      const dropzone = screen.getByTestId('dropzone');
      
      const dropEvent = new Event('drop', { bubbles: true });
      // Don't set dataTransfer property
      
      fireEvent(dropzone, dropEvent);
      
      // Should not crash
      expect(mockOnFileSelect).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility and Styling', () => {
    it('should apply correct CSS classes for upload state', () => {
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
        />
      );
      
      const dropzone = screen.getByTestId('dropzone');
      expect(dropzone).toHaveClass('border-2', 'border-dashed', 'rounded-lg', 'cursor-pointer');
    });

    it('should apply correct CSS classes for drag active state', () => {
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
        />
      );
      
      const dropzone = screen.getByTestId('dropzone');
      
      fireEvent.dragEnter(dropzone);
      
      // In the real component, this would apply drag active classes
      // Our mock doesn't update classes, but we can verify the state change
      expect(screen.getByText('Drop your QTI file here')).toBeInTheDocument();
    });

    it('should show clear button with correct styling', () => {
      const mockFile = createMockFile('test.xml', 'text/xml');
      
      render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
          selectedFile={mockFile}
        />
      );
      
      const clearButton = screen.getByTestId('x-icon').closest('button')!;
      expect(clearButton).toHaveClass('button', 'outline');
    });

    it('should maintain consistent layout between states', () => {
      const mockFile = createMockFile('test.xml', 'text/xml');
      
      // Render upload state
      const { rerender } = render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
        />
      );
      
      expect(screen.getByTestId('upload-icon')).toBeInTheDocument();
      
      // Render selected state
      rerender(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
          selectedFile={mockFile}
        />
      );
      
      expect(screen.getByTestId('file-text-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('upload-icon')).not.toBeInTheDocument();
    });
  });

  describe('useCallback Dependencies', () => {
    it('should maintain onDrop function stability', () => {
      const { rerender } = render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
        />
      );
      
      // Rerender with same props
      rerender(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
        />
      );
      
      // Component should render without issues
      expect(screen.getByTestId('upload-icon')).toBeInTheDocument();
    });

    it('should handle onFileSelect callback changes', () => {
      const newOnFileSelect = vi.fn();
      
      const { rerender } = render(
        <FileUpload 
          onFileSelect={mockOnFileSelect} 
          onClear={mockOnClear} 
        />
      );
      
      rerender(
        <FileUpload 
          onFileSelect={newOnFileSelect} 
          onClear={mockOnClear} 
        />
      );
      
      expect(screen.getByTestId('upload-icon')).toBeInTheDocument();
    });
  });
});