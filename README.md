# httptape-js

JavaScript/TypeScript SDK for [httptape](https://github.com/httptape/httptape) -- HTTP traffic recording, sanitization, and replay.

## Packages

| Package | Description |
|---|---|
| [`vite-plugin-httptape`](./packages/vite-plugin-httptape/) | Vite plugin that manages an httptape process during `vite dev` |
| `@httptape/binary-*` | Platform-specific httptape binaries (installed automatically) |

## Monorepo structure

This is a [pnpm workspace](https://pnpm.io/workspaces) monorepo. The Vite plugin is the primary user-facing package. The `@httptape/binary-*` packages are platform-specific wrappers around the httptape Go binary, installed automatically as optional dependencies.

## Development

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm test
```

## License

Apache-2.0
