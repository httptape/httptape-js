import { createRequire } from 'node:module';

/**
 * Resolves the path to the httptape binary.
 *
 * If `explicitPath` is provided, it is returned as-is.
 * Otherwise, the binary is resolved from the platform-specific
 * `@httptape/binary-<platform>-<arch>` optional dependency.
 *
 * @throws {Error} If the platform-specific binary package is not installed.
 */
export function resolveBinary(explicitPath?: string): string {
  if (explicitPath) {
    return explicitPath;
  }

  const pkg = `@httptape/binary-${process.platform}-${process.arch}`;
  const require = createRequire(import.meta.url);

  try {
    return require.resolve(`${pkg}/bin/httptape`);
  } catch {
    throw new Error(
      `[httptape] Could not find the httptape binary for your platform.\n` +
        `\n` +
        `  Expected package: ${pkg}\n` +
        `\n` +
        `Troubleshooting:\n` +
        `  1. Run "pnpm install" (or "npm install") to install optional dependencies.\n` +
        `  2. If you are on an unsupported platform, set the "binary" option to the\n` +
        `     path of a manually installed httptape binary.\n` +
        `  3. See https://httptape.dev/docs/js for more information.\n`,
    );
  }
}
