import { describe, it, expect } from 'vitest';
import { resolveOptions } from '../src/options.js';

describe('resolveOptions', () => {
  it('applies defaults for an empty options object', () => {
    const opts = resolveOptions({});
    expect(opts.mode).toBe('auto');
    expect(opts.upstream).toBe('');
    expect(opts.tapeDir).toBe('.httptape');
    expect(opts.route).toBe('/api');
    expect(opts.port).toBe(0);
    expect(opts.binary).toBe('');
  });

  it('preserves explicitly set values', () => {
    const opts = resolveOptions({
      mode: 'replay',
      upstream: 'https://api.example.com',
      tapeDir: 'fixtures',
      route: '/v2',
      port: 9090,
      binary: '/usr/local/bin/httptape',
    });
    expect(opts.mode).toBe('replay');
    expect(opts.upstream).toBe('https://api.example.com');
    expect(opts.tapeDir).toBe('fixtures');
    expect(opts.route).toBe('/v2');
    expect(opts.port).toBe(9090);
    expect(opts.binary).toBe('/usr/local/bin/httptape');
  });

  it('throws when mode is "record" but upstream is missing', () => {
    expect(() => resolveOptions({ mode: 'record' })).toThrow(
      'mode "record" requires the "upstream" option',
    );
  });

  it('throws when mode is "proxy" but upstream is missing', () => {
    expect(() => resolveOptions({ mode: 'proxy' })).toThrow(
      'mode "proxy" requires the "upstream" option',
    );
  });

  it('allows mode "record" when upstream is set', () => {
    const opts = resolveOptions({
      mode: 'record',
      upstream: 'https://api.example.com',
    });
    expect(opts.mode).toBe('record');
    expect(opts.upstream).toBe('https://api.example.com');
  });

  it('allows mode "replay" without upstream', () => {
    const opts = resolveOptions({ mode: 'replay' });
    expect(opts.mode).toBe('replay');
    expect(opts.upstream).toBe('');
  });

  it('allows mode "auto" without upstream', () => {
    const opts = resolveOptions({ mode: 'auto' });
    expect(opts.mode).toBe('auto');
  });

  it('throws when port is negative', () => {
    expect(() => resolveOptions({ port: -1 })).toThrow(
      '"port" must be an integer between 1 and 65535',
    );
  });

  it('throws when port is above 65535', () => {
    expect(() => resolveOptions({ port: 70000 })).toThrow(
      '"port" must be an integer between 1 and 65535',
    );
  });

  it('throws when port is a float', () => {
    expect(() => resolveOptions({ port: 3.14 })).toThrow(
      '"port" must be an integer between 1 and 65535',
    );
  });

  it('accepts port 1 as valid', () => {
    const opts = resolveOptions({ port: 1 });
    expect(opts.port).toBe(1);
  });

  it('accepts port 65535 as valid', () => {
    const opts = resolveOptions({ port: 65535 });
    expect(opts.port).toBe(65535);
  });
});
