import { createServer } from 'node:net';
import type { AddressInfo } from 'node:net';

/**
 * Picks a free TCP port by briefly binding to port 0 and reading the
 * OS-assigned port number.
 *
 * There is a small TOCTOU window between closing this server and the
 * httptape binary binding to the same port. This is acceptable for
 * dev-server usage.
 */
export function pickFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.unref();
    srv.on('error', reject);
    srv.listen(0, () => {
      const { port } = srv.address() as AddressInfo;
      srv.close(() => resolve(port));
    });
  });
}
