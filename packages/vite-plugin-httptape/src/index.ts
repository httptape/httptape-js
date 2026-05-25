import type { Plugin } from 'vite';
import type { ChildProcess } from 'node:child_process';
import type { HttptapeOptions } from './options.js';
import { resolveOptions } from './options.js';
import { resolveBinary } from './binary.js';
import { pickFreePort } from './port.js';
import { spawnHttptape, killGracefully } from './process.js';

export type { HttptapeOptions };

/**
 * Vite plugin that manages an httptape process during `vite dev`.
 *
 * Automatically starts httptape when the dev server starts and stops it
 * when the dev server shuts down. Configures Vite's built-in proxy to
 * route the specified path prefix through httptape.
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import httptape from 'vite-plugin-httptape';
 *
 * export default defineConfig({
 *   plugins: [
 *     httptape({
 *       upstream: 'https://api.example.com',
 *       route: '/api',
 *     }),
 *   ],
 * });
 * ```
 */
export default function httptape(options: HttptapeOptions = {}): Plugin {
  const opts = resolveOptions(options);
  let child: ChildProcess | undefined;
  let port: number;

  return {
    name: 'vite-plugin-httptape',
    apply: 'serve', // dev only

    async config() {
      port = opts.port || (await pickFreePort());
      const routePrefix = opts.route;

      return {
        server: {
          proxy: {
            [routePrefix]: {
              target: `http://localhost:${port}`,
              changeOrigin: true,
              rewrite: (path: string) =>
                path.replace(new RegExp(`^${routePrefix}`), ''),
            },
          },
        },
      };
    },

    configureServer(server) {
      const binaryPath = resolveBinary(opts.binary);
      child = spawnHttptape(binaryPath, opts, port, server.config.logger);

      server.httpServer?.on('close', () => {
        killGracefully(child);
      });
    },
  };
}
