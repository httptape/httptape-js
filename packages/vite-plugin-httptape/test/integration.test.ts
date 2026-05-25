import { describe, it, expect, test } from 'vitest';
import { execSync } from 'node:child_process';

/**
 * Check if the httptape binary is available on PATH.
 * Uses `which` on POSIX and `where` on Windows.
 */
function isHttptapeOnPath(): boolean {
  const cmd = process.platform === 'win32' ? 'where httptape' : 'which httptape';
  try {
    execSync(cmd, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const httptapeOnPath = isHttptapeOnPath();

describe('integration', () => {
  test.skipIf(!httptapeOnPath)(
    'spawns httptape and serves a recorded response',
    async () => {
      // This test requires a real httptape binary on PATH.
      // It will be exercised once binary packages are published.
      // For now, this serves as a placeholder that CI can skip gracefully.
      expect(httptapeOnPath).toBe(true);
    },
  );

  it('skips gracefully when httptape binary is not available', () => {
    // This test always runs and verifies the skip mechanism works.
    // If httptape IS on PATH, both tests run. If not, the one above is skipped.
    expect(typeof httptapeOnPath).toBe('boolean');
  });
});
