import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QTIVersionSelector } from '../QTIVersionSelector';

// Mock the UI components
vi.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange, disabled }: any) => (
    <div data-testid="version-select-container">
      <select 
        value={value} 
        onChange={(e) => onValueChange(e.target.value)}
        disabled={disabled}
        data-testid="version-select"
      >
        <option value="2.1">QTI 2.1</option>
        <option value="3.0">QTI 3.0</option>
      </select>
    </div>
  ),
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <div data-testid={`select-item-${value}`}>{children}</div>
  ),
  SelectTrigger: ({ children }: any) => <div data-testid="select-trigger">{children}</div>,
  SelectValue: ({ placeholder }: any) => <span data-testid="select-value">{placeholder}</span>
}));

vi.mock('@mui/material', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
  Typography: ({ children, variant }: any) => <span data-testid={`typography-${variant}`}>{children}</span>,
  Box: ({ children }: any) => <div data-testid="box">{children}</div>,
  Chip: ({ label, size, variant }: any) => (
    <span data-testid="chip" data-size={size} data-variant={variant}>{label}</span>
  )
}));

describe('QTIVersionSelector', () => {
  const mockOnVersionChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with default props', () => {
    render(
      <QTIVersionSelector 
        selectedVersion="2.1" 
        onVersionChange={mockOnVersionChange} 
      />
    );

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('version-select')).toBeInTheDocument();
    expect(screen.getByText('QTI Version:')).toBeInTheDocument();
  });

  it('should display the selected version', () => {
    render(
      <QTIVersionSelector 
        selectedVersion="2.1" 
        onVersionChange={mockOnVersionChange} 
      />
    );

    const select = screen.getByTestId('version-select') as HTMLSelectElement;
    expect(select.value).toBe('2.1');
  });

  it('should call onVersionChange when version is changed', () => {
    render(
      <QTIVersionSelector 
        selectedVersion="2.1" 
        onVersionChange={mockOnVersionChange} 
      />
    );

    const select = screen.getByTestId('version-select');
    fireEvent.change(select, { target: { value: '3.0' } });

    expect(mockOnVersionChange).toHaveBeenCalledWith('3.0');
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <QTIVersionSelector 
        selectedVersion="2.1" 
        onVersionChange={mockOnVersionChange} 
        disabled={true}
      />
    );

    const select = screen.getByTestId('version-select') as HTMLSelectElement;
    expect(select.disabled).toBe(true);
  });

  it('should not be disabled when disabled prop is false', () => {
    render(
      <QTIVersionSelector 
        selectedVersion="2.1" 
        onVersionChange={mockOnVersionChange} 
        disabled={false}
      />
    );

    const select = screen.getByTestId('version-select') as HTMLSelectElement;
    expect(select.disabled).toBe(false);
  });

  it('should display version description', () => {
    render(
      <QTIVersionSelector 
        selectedVersion="2.1" 
        onVersionChange={mockOnVersionChange} 
      />
    );

    expect(screen.getByText('Question & Test Interoperability 2.1')).toBeInTheDocument();
  });

  it('should display QTI 3.0 description when selected', () => {
    render(
      <QTIVersionSelector 
        selectedVersion="3.0" 
        onVersionChange={mockOnVersionChange} 
      />
    );

    expect(screen.getByText(/Question & Test Interoperability 3\.0.*\(Recommended\)/)).toBeInTheDocument();
  });

  it('should render version options', () => {
    render(
      <QTIVersionSelector 
        selectedVersion="2.1" 
        onVersionChange={mockOnVersionChange} 
      />
    );

    // Check that both version options are in the select
    expect(screen.getByText('QTI 2.1')).toBeInTheDocument();
    expect(screen.getByText('QTI 3.0')).toBeInTheDocument();
  });
});