# vite-plugin-httptape

Vite plugin that manages an [httptape](https://github.com/httptape/httptape) process during `vite dev`. Automatically starts httptape when the dev server starts, proxies your API route through it, and stops it when the server shuts down.

## Install

```bash
pnpm add -D vite-plugin-httptape
```

The correct platform-specific binary (`@httptape/binary-*`) is installed automatically as an optional dependency.

## Quickstart

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import httptape from 'vite-plugin-httptape';

export default defineConfig({
  plugins: [
    httptape({
      upstream: 'https://api.example.com',
      route: '/api',       // default
      tapeDir: '.httptape', // default
      mode: 'auto',        // default -- replay if tapes exist, else record
    }),
  ],
});
```

That is it. Run `vite dev` and requests to `/api/**` are routed through httptape.

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `mode` | `'record' \| 'replay' \| 'proxy' \| 'auto'` | `'auto'` | Recording/replay mode |
| `upstream` | `string` | -- | Upstream URL (required for `record` and `proxy` modes) |
| `tapeDir` | `string` | `'.httptape'` | Directory for recorded tapes |
| `route` | `string` | `'/api'` | Route prefix to proxy through httptape |
| `port` | `number` | auto | Fixed port for the httptape process |
| `binary` | `string` | auto | Path to the httptape binary |

## License

Apache-2.0
