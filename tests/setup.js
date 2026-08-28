import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from '../src/mocks/server.js';

// The jsdom environment does not expose Storage on the test global.
if (typeof globalThis.localStorage === 'undefined') {
  class MemoryStorage {
    #entries = new Map();

    get length() {
      return this.#entries.size;
    }

    key(index) {
      return [...this.#entries.keys()][index] ?? null;
    }

    getItem(key) {
      return this.#entries.get(String(key)) ?? null;
    }

    setItem(key, value) {
      this.#entries.set(String(key), String(value));
    }

    removeItem(key) {
      this.#entries.delete(String(key));
    }

    clear() {
      this.#entries.clear();
    }
  }

  const storage = new MemoryStorage();
  globalThis.localStorage = storage;
  if (globalThis.window) globalThis.window.localStorage = storage;
}

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});

afterAll(() => server.close());
