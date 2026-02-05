import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Automatically cleanup after each test to prevent memory leaks and ensure test isolation
afterEach(() => {
    cleanup();
});
