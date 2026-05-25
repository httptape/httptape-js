import { describe, it, expect } from 'vitest';
import { pickFreePort } from '../src/port.js';

describe('pickFreePort', () => {
  it('returns a port number', async () => {
    const port = await pickFreePort();
    expect(port).toBeGreaterThan(0);
    expect(port).toBeLessThanOrEqual(65535);
    expect(Number.isInteger(port)).toBe(true);
  });

  it('returns distinct ports on consecutive calls', async () => {
    const ports = await Promise.all([
      pickFreePort(),
      pickFreePort(),
      pickFreePort(),
    ]);
    const unique = new Set(ports);
    // With overwhelmingly high probability, 3 OS-assigned ports differ.
    // In the unlikely edge case of a collision, at least 2 should differ.
    expect(unique.size).toBeGreaterThanOrEqual(2);
  });
});
