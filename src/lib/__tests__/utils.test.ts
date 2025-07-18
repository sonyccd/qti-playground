import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cn } from '../utils';

// Mock clsx and twMerge
vi.mock('clsx', () => ({
  clsx: vi.fn()
}));

vi.mock('tailwind-merge', () => ({
  twMerge: vi.fn()
}));

describe('cn utility function', () => {
  let mockClsx: any;
  let mockTwMerge: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    const clsxModule = await import('clsx');
    const twMergeModule = await import('tailwind-merge');
    
    mockClsx = vi.mocked(clsxModule.clsx);
    mockTwMerge = vi.mocked(twMergeModule.twMerge);
    
    // Set up default mock returns
    mockClsx.mockImplementation((...args) => args.filter(Boolean).join(' '));
    mockTwMerge.mockImplementation((str) => str);
  });

  describe('Basic Functionality', () => {
    it('should call clsx with provided inputs', () => {
      const inputs = ['class1', 'class2', 'class3'];
      cn(...inputs);
      
      expect(mockClsx).toHaveBeenCalledWith(inputs);
    });

    it('should call twMerge with clsx result', () => {
      const clsxResult = 'class1 class2 class3';
      mockClsx.mockReturnValue(clsxResult);
      
      cn('class1', 'class2', 'class3');
      
      expect(mockTwMerge).toHaveBeenCalledWith(clsxResult);
    });

    it('should return twMerge result', () => {
      const mergedResult = 'merged-classes';
      mockTwMerge.mockReturnValue(mergedResult);
      
      const result = cn('class1', 'class2');
      
      expect(result).toBe(mergedResult);
    });
  });

  describe('Input Handling', () => {
    it('should handle single string input', () => {
      cn('single-class');
      
      expect(mockClsx).toHaveBeenCalledWith(['single-class']);
    });

    it('should handle multiple string inputs', () => {
      cn('class1', 'class2', 'class3');
      
      expect(mockClsx).toHaveBeenCalledWith(['class1', 'class2', 'class3']);
    });

    it('should handle conditional classes with objects', () => {
      const conditionalClass = { 'active': true, 'disabled': false };
      cn('base-class', conditionalClass);
      
      expect(mockClsx).toHaveBeenCalledWith(['base-class', conditionalClass]);
    });

    it('should handle arrays of classes', () => {
      const classArray = ['class1', 'class2'];
      cn(classArray, 'class3');
      
      expect(mockClsx).toHaveBeenCalledWith([classArray, 'class3']);
    });

    it('should handle mixed input types', () => {
      const inputs = [
        'string-class',
        { 'conditional': true },
        ['array-class1', 'array-class2'],
        undefined,
        null,
        'another-string'
      ];
      cn(...inputs);
      
      expect(mockClsx).toHaveBeenCalledWith(inputs);
    });

    it('should handle no inputs', () => {
      cn();
      
      expect(mockClsx).toHaveBeenCalledWith([]);
    });

    it('should handle undefined and null inputs', () => {
      cn(undefined, null, 'valid-class');
      
      expect(mockClsx).toHaveBeenCalledWith([undefined, null, 'valid-class']);
    });

    it('should handle empty string inputs', () => {
      cn('', 'valid-class', '');
      
      expect(mockClsx).toHaveBeenCalledWith(['', 'valid-class', '']);
    });
  });

  describe('Integration with clsx and twMerge', () => {
    it('should handle clsx conditional logic correctly', () => {
      // Mock clsx to behave more like the real clsx
      mockClsx.mockImplementation((...args) => {
        return args.flat().filter(arg => {
          if (typeof arg === 'string') return arg.trim() !== '';
          if (typeof arg === 'object' && arg !== null) {
            return Object.entries(arg).filter(([_, value]) => value).map(([key]) => key).join(' ');
          }
          return false;
        }).join(' ');
      });

      const result = cn('base', { 'active': true, 'disabled': false }, 'extra');
      
      expect(mockClsx).toHaveBeenCalledWith(['base', { 'active': true, 'disabled': false }, 'extra']);
    });

    it('should handle twMerge conflicting classes', () => {
      // Mock twMerge to demonstrate conflict resolution
      mockTwMerge.mockImplementation((classString) => {
        // Simulate tailwind-merge removing conflicting classes
        const classes = classString.split(' ');
        const filtered = classes.filter((cls, index) => {
          // Simple simulation: remove earlier padding classes if later ones exist
          if (cls.startsWith('p-') && classes.slice(index + 1).some(c => c.startsWith('p-'))) {
            return false;
          }
          return true;
        });
        return filtered.join(' ');
      });

      mockClsx.mockReturnValue('p-4 bg-red-500 p-6');
      
      const result = cn('p-4', 'bg-red-500', 'p-6');
      
      expect(result).toBe('bg-red-500 p-6'); // p-4 should be removed by twMerge
    });

    it('should preserve order for non-conflicting classes', () => {
      mockClsx.mockReturnValue('flex items-center justify-center bg-blue-500');
      mockTwMerge.mockReturnValue('flex items-center justify-center bg-blue-500');
      
      const result = cn('flex', 'items-center', 'justify-center', 'bg-blue-500');
      
      expect(result).toBe('flex items-center justify-center bg-blue-500');
    });
  });

  describe('Error Handling', () => {
    it('should handle clsx throwing an error', () => {
      const error = new Error('clsx error');
      mockClsx.mockImplementation(() => {
        throw error;
      });

      expect(() => cn('class1', 'class2')).toThrow('clsx error');
    });

    it('should handle twMerge throwing an error', () => {
      const error = new Error('twMerge error');
      mockClsx.mockReturnValue('valid-classes');
      mockTwMerge.mockImplementation(() => {
        throw error;
      });

      expect(() => cn('class1', 'class2')).toThrow('twMerge error');
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle large number of inputs', () => {
      const manyInputs = Array.from({ length: 100 }, (_, i) => `class-${i}`);
      cn(...manyInputs);
      
      expect(mockClsx).toHaveBeenCalledWith(manyInputs);
    });

    it('should handle deeply nested arrays', () => {
      const nestedInput = [['deep', ['deeper', 'classes']], 'surface'];
      cn(nestedInput);
      
      expect(mockClsx).toHaveBeenCalledWith([nestedInput]);
    });

    it('should handle special characters in class names', () => {
      const specialClasses = ['class-with-dashes', 'class_with_underscores', 'class:with:colons'];
      cn(...specialClasses);
      
      expect(mockClsx).toHaveBeenCalledWith(specialClasses);
    });

    it('should handle numeric inputs', () => {
      cn('base', 42 as any, 'end');
      
      expect(mockClsx).toHaveBeenCalledWith(['base', 42, 'end']);
    });

    it('should handle boolean inputs', () => {
      cn('base', true as any, false as any, 'end');
      
      expect(mockClsx).toHaveBeenCalledWith(['base', true, false, 'end']);
    });
  });

  describe('Real-world Usage Patterns', () => {
    it('should handle typical component styling pattern', () => {
      const baseClasses = 'px-4 py-2 rounded';
      const variant = 'primary';
      const size = 'lg';
      const disabled = false;
      
      cn(
        baseClasses,
        variant === 'primary' && 'bg-blue-500 text-white',
        size === 'lg' && 'text-lg px-6 py-3',
        disabled && 'opacity-50 cursor-not-allowed'
      );
      
      expect(mockClsx).toHaveBeenCalledWith([
        'px-4 py-2 rounded',
        'bg-blue-500 text-white',
        'text-lg px-6 py-3',
        false
      ]);
    });

    it('should handle conditional classes with object syntax', () => {
      const isActive = true;
      const isDisabled = false;
      const hasError = true;
      
      cn('base-class', {
        'active': isActive,
        'disabled': isDisabled,
        'error': hasError
      });
      
      expect(mockClsx).toHaveBeenCalledWith([
        'base-class',
        {
          'active': true,
          'disabled': false,
          'error': true
        }
      ]);
    });

    it('should handle responsive and state-based classes', () => {
      cn(
        'w-full',
        'sm:w-auto',
        'md:w-1/2',
        'lg:w-1/3',
        'hover:bg-gray-100',
        'focus:ring-2',
        'focus:ring-blue-500'
      );
      
      expect(mockClsx).toHaveBeenCalledWith([
        'w-full',
        'sm:w-auto',
        'md:w-1/2',
        'lg:w-1/3',
        'hover:bg-gray-100',
        'focus:ring-2',
        'focus:ring-blue-500'
      ]);
    });
  });
});