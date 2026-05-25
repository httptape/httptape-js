import { describe, it, expect } from 'vitest';
import httptape from '../src/index.js';

describe('proxy rewrite', () => {
  async function getRewrite(
    route: string,
  ): Promise<(path: string) => string> {
    const plugin = httptape({ route, port: 1 });

    // config() returns a partial Vite config; call it to get the proxy setup.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cfg = await (plugin as any).config();
    const proxyEntry = cfg.server.proxy[route];
    return proxyEntry.rewrite;
  }

  it('strips a simple route prefix', async () => {
    const rewrite = await getRewrite('/api');

    expect(rewrite('/api/users')).toBe('/users');
    expect(rewrite('/api')).toBe('');
  });

  it('does not strip a path that does not start with the prefix', async () => {
    const rewrite = await getRewrite('/api');

    expect(rewrite('/other/api/users')).toBe('/other/api/users');
  });

  it('handles route prefixes containing regex metacharacters', async () => {
    const rewrite = await getRewrite('/api.v1');

    // Correct: exact prefix match strips the route.
    expect(rewrite('/api.v1/users')).toBe('/users');

    // Incorrect with regex: "." would match any character (e.g. "X").
    // With startsWith, this path must pass through unchanged.
    expect(rewrite('/apiXv1/users')).toBe('/apiXv1/users');
  });

  it('handles route with multiple regex metacharacters', async () => {
    const rewrite = await getRewrite('/v1+beta/api');

    expect(rewrite('/v1+beta/api/data')).toBe('/data');
    expect(rewrite('/v1Xbeta/api/data')).toBe('/v1Xbeta/api/data');
  });
});
