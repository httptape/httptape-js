import { createInterface } from 'node:readline';
import type { ChildProcess } from 'node:child_process';
import type { Logger } from 'vite';

const PREFIX = '[httptape]';

/**
 * Pipes a child process's stdout and stderr to a Vite logger,
 * line-buffered, with a `[httptape]` prefix.
 */
export function pipeToLogger(child: ChildProcess, logger: Logger): void {
  if (child.stdout) {
    const rl = createInterface({ input: child.stdout });
    rl.on('line', (line) => {
      logger.info(`${PREFIX} ${line}`);
    });
  }

  if (child.stderr) {
    const rl = createInterface({ input: child.stderr });
    rl.on('line', (line) => {
      logger.error(`${PREFIX} ${line}`);
    });
  }
}
