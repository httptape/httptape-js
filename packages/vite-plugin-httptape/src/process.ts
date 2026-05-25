import { spawn } from 'node:child_process';
import type { ChildProcess } from 'node:child_process';
import type { Logger } from 'vite';
import type { HttptapeOptions } from './options.js';
import { pipeToLogger } from './log.js';

const GRACEFUL_SHUTDOWN_MS = 3_000;

/** Tracked child processes for belt-and-suspenders cleanup on exit. */
const tracked = new Set<ChildProcess>();

// Register a single top-level exit handler that kills any orphaned children.
// This runs when the parent Node process exits, regardless of how.
process.on('exit', () => {
  for (const child of tracked) {
    try {
      child.kill('SIGKILL');
    } catch {
      // Process may already be dead -- ignore ESRCH / ECHILD.
    }
  }
});

/**
 * Builds the CLI arguments for the httptape binary.
 */
function buildArgs(
  opts: Required<HttptapeOptions>,
  port: number,
): string[] {
  const args = ['serve', '--port', String(port), '--tape-dir', opts.tapeDir];

  if (opts.mode !== 'auto') {
    args.push('--mode', opts.mode);
  }

  if (opts.upstream) {
    args.push('--upstream', opts.upstream);
  }

  return args;
}

/**
 * Spawns the httptape binary as a child process and pipes its output
 * to the Vite logger.
 *
 * @returns The spawned child process.
 */
export function spawnHttptape(
  binaryPath: string,
  opts: Required<HttptapeOptions>,
  port: number,
  logger: Logger,
): ChildProcess {
  const args = buildArgs(opts, port);

  logger.info(`[httptape] starting: ${binaryPath} ${args.join(' ')}`);

  const child = spawn(binaryPath, args, {
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false,
  });

  tracked.add(child);

  child.on('close', () => {
    tracked.delete(child);
  });

  pipeToLogger(child, logger);

  return child;
}

/**
 * Gracefully kills a child process: sends SIGTERM, waits up to 3 seconds,
 * then sends SIGKILL.
 */
export function killGracefully(child: ChildProcess | undefined): void {
  if (!child || child.exitCode !== null) {
    return;
  }

  try {
    child.kill('SIGTERM');
  } catch {
    // Already dead.
    return;
  }

  const timeout = setTimeout(() => {
    try {
      child.kill('SIGKILL');
    } catch {
      // Already dead.
    }
  }, GRACEFUL_SHUTDOWN_MS);
  timeout.unref();

  child.on('close', () => {
    clearTimeout(timeout);
  });
}
