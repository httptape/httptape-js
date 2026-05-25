/**
 * Configuration options for the httptape Vite plugin.
 */
export interface HttptapeOptions {
  /**
   * The recording/replay mode.
   *
   * - `"record"` — proxy requests to `upstream` and record them to `tapeDir`.
   * - `"replay"` — serve recorded responses from `tapeDir`.
   * - `"proxy"` — proxy requests to `upstream` without recording.
   * - `"auto"` — replay if tapes exist, otherwise record.
   *
   * @default "auto"
   */
  mode?: 'record' | 'replay' | 'proxy' | 'auto';

  /**
   * The upstream URL to proxy requests to (required for `"record"` and `"proxy"` modes).
   */
  upstream?: string;

  /**
   * Directory where recorded tapes are stored.
   *
   * @default ".httptape"
   */
  tapeDir?: string;

  /**
   * The route prefix to proxy through httptape.
   *
   * @default "/api"
   */
  route?: string;

  /**
   * Fixed port for the httptape process. If not specified, a free port is picked automatically.
   */
  port?: number;

  /**
   * Path to the httptape binary. If not specified, the binary is resolved from
   * the platform-specific `@httptape/binary-*` optional dependency.
   */
  binary?: string;
}

/**
 * Resolves defaults and validates the provided options.
 *
 * @throws {Error} If `mode` is `"record"` or `"proxy"` but `upstream` is not set.
 * @throws {Error} If `port` is set but not a valid port number.
 */
export function resolveOptions(raw: HttptapeOptions): Required<HttptapeOptions> {
  const mode = raw.mode ?? 'auto';
  const upstream = raw.upstream ?? '';
  const tapeDir = raw.tapeDir ?? '.httptape';
  const route = raw.route ?? '/api';
  const port = raw.port ?? 0;
  const binary = raw.binary ?? '';

  if ((mode === 'record' || mode === 'proxy') && !upstream) {
    throw new Error(
      `[httptape] mode "${mode}" requires the "upstream" option to be set`,
    );
  }

  if (port !== 0 && (!Number.isInteger(port) || port < 1 || port > 65535)) {
    throw new Error(
      `[httptape] "port" must be an integer between 1 and 65535, got ${port}`,
    );
  }

  return { mode, upstream, tapeDir, route, port, binary };
}
