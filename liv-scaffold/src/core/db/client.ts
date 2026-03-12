// @liv-standard v1.3
// [core/db/client.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      core
// layer:      R5
// wires-in:   none
// wires-out:
//   W-ATOM  db       →  all R4 exec files
//   W-ATOM  closeDb  →  shutdown handlers
// deps:       none
// validated:  2026-03-12

// R5: pure infrastructure. Zero business logic.
// DATABASE_URL from env only. statement_timeout=30s. Structured error log.

function getDbUrl(): string {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('[core/db] DATABASE_URL is not set.')
  return url
}

interface DbPool {
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<{ rows: T[] }>
  end(): Promise<void>
}

let _client: DbPool | null = null

function getClient(): DbPool {
  if (_client) return _client

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pool } = require('pg') as typeof import('pg')

  const pool = new Pool({
    connectionString:        getDbUrl(),
    max:                     10,
    idleTimeoutMillis:       30_000,
    connectionTimeoutMillis: 5_000,
    options:                 '-c statement_timeout=30000',
  })

  pool.on('error', (err: Error) => {
    console.error(JSON.stringify({
      level:     'error',
      event:     'db.pool.error',
      message:   err.message,
      timestamp: new Date().toISOString(),
    }))
  })

  _client = {
    async query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<{ rows: T[] }> {
      const result = await pool.query(sql, params)
      return { rows: result.rows as T[] }
    },
    async end(): Promise<void> {
      await pool.end()
      _client = null
    },
  }

  return _client
}

export const db: DbPool = new Proxy({} as DbPool, {
  get(_target, prop) {
    return (getClient() as unknown as Record<string, unknown>)[prop as string]
  },
})

export async function closeDb(): Promise<void> {
  if (_client) await _client.end()
}
