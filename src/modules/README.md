# Domain modules

Business logic lives here, one folder per domain. Routes in `src/app` call into
modules; modules call infrastructure in `src/lib`. Modules never import from
`src/app` or from each other's internals — only from another module's `index.ts`.

| Module | Ecosystem | Status |
| --- | --- | --- |
| `identity` | Platform | Validation schemas only |
| `organizations` | Platform | Validation schemas only |
| `network` | Paradise Network | Validation schemas only |
| `marketplace` | Paradise Exchange | Validation schemas only |
| `points` | Paradise Exchange | Planned — README only |
| `business` | Paradise Business | Planned — README only |
| `marketing` | Paradise Media | Planned — README only |
| `billing` | Platform | Planned — README only |

See [docs/architecture/DIRECTORY_STRUCTURE.md](../../docs/architecture/DIRECTORY_STRUCTURE.md).
