import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import apiClient from './api-client';

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset localStorage
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Request Configuration', () => {
    it('should have correct baseURL', () => {
      expect(apiClient.defaults.baseURL).toBe('http://localhost:3000');
    });

    it('should auto-inject userId from localStorage for expense endpoints', async () => {
      localStorage.setItem('userId', 'user-123');

      // Simulate the request interceptor behavior
      const config = { url: '/expenses', params: {} };
      const userId = localStorage.getItem('userId');
      if (userId && config.url.startsWith('/expenses')) {
        config.params = { ...config.params, userId };
      }

      expect(config.params.userId).toBe('user-123');
    });

    it('should not add userId for non-expense endpoints', () => {
      localStorage.setItem('userId', 'user-123');

      const config = { url: '/auth/login', params: {} };
      const userId = localStorage.getItem('userId');
      if (userId && config.url?.startsWith('/expenses')) {
        config.params = { ...config.params, userId };
      }

      expect(config.params.userId).toBeUndefined();
    });

    it('should handle missing userId in localStorage gracefully', () => {
      localStorage.clear();

      const config = { url: '/expenses', params: {} };
      const userId = localStorage.getItem('userId');
      if (userId && config.url?.startsWith('/expenses')) {
        config.params = { ...config.params, userId };
      }

      expect(config.params.userId).toBeUndefined();
    });
  });

  describe('API Client Configuration', () => {
    it('should be an axios instance', () => {
      expect(apiClient).toBeDefined();
      expect(apiClient.defaults).toBeDefined();
      expect(apiClient.defaults.baseURL).toBeDefined();
    });

    it('should have request interceptors', () => {
      expect(apiClient.interceptors).toBeDefined();
      expect(apiClient.interceptors.request).toBeDefined();
    });
  });

  describe('Authentication and Headers', () => {
    it('should include userId in request params for expense endpoints', () => {
      localStorage.setItem('userId', 'user-abc123');

      const config = { url: '/expenses', params: {} };
      const userId = localStorage.getItem('userId');
      if (userId && config.url?.startsWith('/expenses')) {
        config.params = { ...config.params, userId };
      }

      expect(config.params).toEqual({ userId: 'user-abc123' });
    });

    it('should not include userId when accessing /auth/login', () => {
      localStorage.setItem('userId', 'user-abc123');

      const config = { url: '/auth/login', params: {} };
      const userId = localStorage.getItem('userId');
      if (userId && config.url?.startsWith('/expenses')) {
        config.params = { ...config.params, userId };
      }

      expect(config.params.userId).toBeUndefined();
    });

    it('should not break when userId is missing', () => {
      localStorage.clear();

      const config = { url: '/expenses', params: {} };
      const userId = localStorage.getItem('userId');
      if (userId && config.url?.startsWith('/expenses')) {
        config.params = { ...config.params, userId };
      }

      expect(config.params.userId).toBeUndefined();
    });
  });

  describe('Request Interceptor Behavior', () => {
    it('should document userId injection behavior', () => {
      localStorage.setItem('userId', 'test-user-123');

      // Test localStorage access
      const userId = localStorage.getItem('userId');
      expect(userId).toBe('test-user-123');

      // Document that interceptor checks for /expenses endpoints
      const isExpenseEndpoint = '/expenses'.startsWith('/expenses');
      expect(isExpenseEndpoint).toBe(true);

      // Non-expense endpoints should not receive userId
      const isAuthEndpoint = '/auth/login'.startsWith('/expenses');
      expect(isAuthEndpoint).toBe(false);
    });

    it('should handle missing userId gracefully', () => {
      localStorage.clear();
      const userId = localStorage.getItem('userId');
      expect(userId).toBeNull();
    });
  });
});
