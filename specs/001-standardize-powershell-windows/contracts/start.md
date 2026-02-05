# Contract: start.ps1

Starts the development environment for both client and server.

## Interface

```powershell
./scripts/powershell/start.ps1 [-ClientOnly] [-ServerOnly] [-Port <Int>]
```

## Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `ClientOnly` | Switch | Only starts the Vite frontend. | False |
| `ServerOnly` | Switch | Only starts the NestJS backend. | False |
| `Port` | Int | Overrides the default server port. | 3000 |

## Expected Behavior
- If no switches are provided, both client and server are started in parallel.
- Uses `pnpm run dev` internally.
- Logs from both services are streamed to the console with prefixes.
