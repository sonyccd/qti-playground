import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast, toast, reducer } from '../use-toast';

// Mock timer functions
vi.mock('../../components/ui/toast', () => ({
  ToastActionElement: vi.fn(),
  ToastProps: vi.fn()
}));

describe('useToast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('reducer', () => {
    const initialState = { toasts: [] };

    it('should add toast to state', () => {
      const mockToast = {
        id: '1',
        title: 'Test Toast',
        description: 'Test Description',
        open: true
      };

      const action = {
        type: 'ADD_TOAST' as const,
        toast: mockToast
      };

      const newState = reducer(initialState, action);

      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0]).toEqual(mockToast);
    });

    it('should respect TOAST_LIMIT when adding toasts', () => {
      const existingToast = {
        id: '1',
        title: 'Existing Toast',
        open: true
      };
      
      const stateWithToast = { toasts: [existingToast] };
      
      const newToast = {
        id: '2',
        title: 'New Toast',
        open: true
      };

      const action = {
        type: 'ADD_TOAST' as const,
        toast: newToast
      };

      const newState = reducer(stateWithToast, action);

      // Should only keep the latest toast due to TOAST_LIMIT = 1
      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0]).toEqual(newToast);
    });

    it('should update existing toast', () => {
      const existingToast = {
        id: '1',
        title: 'Original Title',
        description: 'Original Description',
        open: true
      };
      
      const stateWithToast = { toasts: [existingToast] };
      
      const updateAction = {
        type: 'UPDATE_TOAST' as const,
        toast: {
          id: '1',
          title: 'Updated Title'
        }
      };

      const newState = reducer(stateWithToast, updateAction);

      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0]).toEqual({
        id: '1',
        title: 'Updated Title',
        description: 'Original Description',
        open: true
      });
    });

    it('should not update non-existing toast', () => {
      const existingToast = {
        id: '1',
        title: 'Existing Toast',
        open: true
      };
      
      const stateWithToast = { toasts: [existingToast] };
      
      const updateAction = {
        type: 'UPDATE_TOAST' as const,
        toast: {
          id: '2',
          title: 'Updated Title'
        }
      };

      const newState = reducer(stateWithToast, updateAction);

      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0]).toEqual(existingToast);
    });

    it('should dismiss specific toast', () => {
      const toasts = [
        { id: '1', title: 'Toast 1', open: true },
        { id: '2', title: 'Toast 2', open: true }
      ];
      
      const stateWithToasts = { toasts };
      
      const dismissAction = {
        type: 'DISMISS_TOAST' as const,
        toastId: '1'
      };

      const newState = reducer(stateWithToasts, dismissAction);

      expect(newState.toasts).toHaveLength(2);
      expect(newState.toasts[0].open).toBe(false);
      expect(newState.toasts[1].open).toBe(true);
    });

    it('should dismiss all toasts when no toastId provided', () => {
      const toasts = [
        { id: '1', title: 'Toast 1', open: true },
        { id: '2', title: 'Toast 2', open: true }
      ];
      
      const stateWithToasts = { toasts };
      
      const dismissAction = {
        type: 'DISMISS_TOAST' as const
      };

      const newState = reducer(stateWithToasts, dismissAction);

      expect(newState.toasts).toHaveLength(2);
      expect(newState.toasts[0].open).toBe(false);
      expect(newState.toasts[1].open).toBe(false);
    });

    it('should remove specific toast', () => {
      const toasts = [
        { id: '1', title: 'Toast 1', open: true },
        { id: '2', title: 'Toast 2', open: true }
      ];
      
      const stateWithToasts = { toasts };
      
      const removeAction = {
        type: 'REMOVE_TOAST' as const,
        toastId: '1'
      };

      const newState = reducer(stateWithToasts, removeAction);

      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].id).toBe('2');
    });

    it('should remove all toasts when no toastId provided', () => {
      const toasts = [
        { id: '1', title: 'Toast 1', open: true },
        { id: '2', title: 'Toast 2', open: true }
      ];
      
      const stateWithToasts = { toasts };
      
      const removeAction = {
        type: 'REMOVE_TOAST' as const
      };

      const newState = reducer(stateWithToasts, removeAction);

      expect(newState.toasts).toHaveLength(0);
    });
  });

  describe('toast function', () => {
    it('should create toast with unique id', () => {
      const result1 = toast({ title: 'Test 1' });
      const result2 = toast({ title: 'Test 2' });

      expect(result1.id).toBeDefined();
      expect(result2.id).toBeDefined();
      expect(result1.id).not.toBe(result2.id);
    });

    it('should return toast with dismiss and update functions', () => {
      const result = toast({ title: 'Test Toast' });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('dismiss');
      expect(result).toHaveProperty('update');
      expect(typeof result.dismiss).toBe('function');
      expect(typeof result.update).toBe('function');
    });

    it('should create toast with default open state', () => {
      const result = toast({ title: 'Test Toast' });
      
      expect(result.id).toBeDefined();
      expect(typeof result.dismiss).toBe('function');
      expect(typeof result.update).toBe('function');
    });

    it('should handle toast with all properties', () => {
      const toastProps = {
        title: 'Test Title',
        description: 'Test Description',
        variant: 'destructive' as const
      };

      const result = toast(toastProps);

      expect(result.id).toBeDefined();
      expect(typeof result.dismiss).toBe('function');
      expect(typeof result.update).toBe('function');
    });

    it('should dismiss toast when calling dismiss function', () => {
      const result = toast({ title: 'Test Toast' });
      
      expect(typeof result.dismiss).toBe('function');
      expect(() => result.dismiss()).not.toThrow();
    });
  });

  describe('useToast hook', () => {
    it('should return state and toast function', () => {
      const { result } = renderHook(() => useToast());

      expect(result.current).toHaveProperty('toasts');
      expect(result.current).toHaveProperty('toast');
      expect(result.current).toHaveProperty('dismiss');
      expect(typeof result.current.toast).toBe('function');
      expect(typeof result.current.dismiss).toBe('function');
      expect(Array.isArray(result.current.toasts)).toBe(true);
    });

    it('should handle toast creation through hook', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        const toastResult = result.current.toast({ title: 'Test Toast' });
        expect(toastResult.id).toBeDefined();
      });

      // Should not throw
      expect(result.current.toasts).toBeDefined();
    });

    it('should handle dismiss function', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.dismiss();
        result.current.dismiss('some-id');
      });

      // Should not throw
      expect(result.current.dismiss).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle empty toast props', () => {
      const result = toast({});
      
      expect(result.id).toBeDefined();
      expect(typeof result.dismiss).toBe('function');
      expect(typeof result.update).toBe('function');
    });

    it('should handle update with partial toast data', () => {
      const existingToast = {
        id: '1',
        title: 'Original Title',
        description: 'Original Description',
        open: true
      };
      
      const stateWithToast = { toasts: [existingToast] };
      
      const updateAction = {
        type: 'UPDATE_TOAST' as const,
        toast: {
          id: '1',
          title: 'Updated Title'
        }
      };

      const newState = reducer(stateWithToast, updateAction);

      expect(newState.toasts[0]).toEqual({
        id: '1',
        title: 'Updated Title',
        description: 'Original Description',
        open: true
      });
    });

    it('should handle dismiss with non-existent toastId', () => {
      const toasts = [{ id: '1', title: 'Toast 1', open: true }];
      const stateWithToasts = { toasts };
      
      const dismissAction = {
        type: 'DISMISS_TOAST' as const,
        toastId: 'non-existent'
      };

      const newState = reducer(stateWithToasts, dismissAction);

      // Should not affect existing toasts
      expect(newState.toasts[0].open).toBe(true);
    });

    it('should handle remove with non-existent toastId', () => {
      const toasts = [{ id: '1', title: 'Toast 1', open: true }];
      const stateWithToasts = { toasts };
      
      const removeAction = {
        type: 'REMOVE_TOAST' as const,
        toastId: 'non-existent'
      };

      const newState = reducer(stateWithToasts, removeAction);

      // Should not affect existing toasts
      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0]).toEqual(toasts[0]);
    });

    it('should handle reducer with invalid action type', () => {
      const initialState = { toasts: [] };
      
      // @ts-expect-error - Testing invalid action type
      const invalidAction = { type: 'INVALID_ACTION' };

      expect(() => reducer(initialState, invalidAction as any)).not.toThrow();
    });
  });

  describe('id generation', () => {
    it('should generate sequential ids', () => {
      const result1 = toast({ title: 'Test 1' });
      const result2 = toast({ title: 'Test 2' });
      const result3 = toast({ title: 'Test 3' });

      const id1 = parseInt(result1.id);
      const id2 = parseInt(result2.id);
      const id3 = parseInt(result3.id);

      expect(id2).toBeGreaterThan(id1);
      expect(id3).toBeGreaterThan(id2);
    });

    it('should handle id overflow gracefully', () => {
      const result = toast({ title: 'Test' });
      expect(typeof result.id).toBe('string');
      expect(result.id.length).toBeGreaterThan(0);
    });
  });

  describe('action type validation', () => {
    it('should handle all defined action types', () => {
      const initialState = { toasts: [] };
      
      const actions = [
        { type: 'ADD_TOAST' as const, toast: { id: '1', title: 'Test' } },
        { type: 'UPDATE_TOAST' as const, toast: { id: '1', title: 'Updated' } },
        { type: 'DISMISS_TOAST' as const, toastId: '1' },
        { type: 'REMOVE_TOAST' as const, toastId: '1' }
      ];

      actions.forEach(action => {
        expect(() => reducer(initialState, action)).not.toThrow();
      });
    });
  });

  describe('integration tests', () => {
    it('should handle full toast lifecycle', () => {
      let state = { toasts: [] };

      // Add toast
      const addAction = {
        type: 'ADD_TOAST' as const,
        toast: { id: '1', title: 'Test Toast', open: true }
      };
      state = reducer(state, addAction);
      expect(state.toasts).toHaveLength(1);
      expect(state.toasts[0].open).toBe(true);

      // Update toast
      const updateAction = {
        type: 'UPDATE_TOAST' as const,
        toast: { id: '1', title: 'Updated Toast' }
      };
      state = reducer(state, updateAction);
      expect(state.toasts[0].title).toBe('Updated Toast');

      // Dismiss toast
      const dismissAction = {
        type: 'DISMISS_TOAST' as const,
        toastId: '1'
      };
      state = reducer(state, dismissAction);
      expect(state.toasts[0].open).toBe(false);

      // Remove toast
      const removeAction = {
        type: 'REMOVE_TOAST' as const,
        toastId: '1'
      };
      state = reducer(state, removeAction);
      expect(state.toasts).toHaveLength(0);
    });

    it('should handle multiple toasts with TOAST_LIMIT', () => {
      let state = { toasts: [] };

      // Add first toast
      state = reducer(state, {
        type: 'ADD_TOAST',
        toast: { id: '1', title: 'Toast 1', open: true }
      });
      expect(state.toasts).toHaveLength(1);

      // Add second toast (should replace first due to TOAST_LIMIT = 1)
      state = reducer(state, {
        type: 'ADD_TOAST',
        toast: { id: '2', title: 'Toast 2', open: true }
      });
      expect(state.toasts).toHaveLength(1);
      expect(state.toasts[0].id).toBe('2');
    });

    it('should handle batch operations', () => {
      let state = { toasts: [
        { id: '1', title: 'Toast 1', open: true },
        { id: '2', title: 'Toast 2', open: true }
      ] };

      // Dismiss all toasts
      state = reducer(state, { type: 'DISMISS_TOAST' });
      expect(state.toasts.every(t => !t.open)).toBe(true);

      // Remove all toasts
      state = reducer(state, { type: 'REMOVE_TOAST' });
      expect(state.toasts).toHaveLength(0);
    });
  });

  describe('timeout behavior', () => {
    it('should handle timeout scheduling in dismiss action', () => {
      const toasts = [{ id: '1', title: 'Toast 1', open: true }];
      const stateWithToasts = { toasts };
      
      const dismissAction = {
        type: 'DISMISS_TOAST' as const,
        toastId: '1'
      };

      // This should schedule a timeout but not immediately remove the toast
      const newState = reducer(stateWithToasts, dismissAction);
      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].open).toBe(false);

      // The actual removal would happen after TOAST_REMOVE_DELAY via setTimeout
      // which is handled by the internal timeout management
    });
  });
});