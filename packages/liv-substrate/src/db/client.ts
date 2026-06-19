// @liv-standard v1.5.2
// Built with LIV · livai.dev
// Vendored — portable substrate package. Canonical home: src/core/db/client.ts (d6d13c8).
// The raw pool — pure infrastructure underneath the store. Zero business logic.
// DATABASE_URL from env only. statement_timeout=30s. Structured error log.
// `pg` is the package's single runtime dependency; nothing else is required for
// the store to run standalone and live.

function getDbUrl(): string {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('[liv-substrate/db] DATABASE_URL is not set.')
  return url
}

// A transactional connection handle — query() runs on one pooled connection.
interface TxClient {
  query<R = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<{ rows: R[] }>
}

export interface DbPool {
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<{ rows: T[] }>
  // Run fn inside a single BEGIN/COMMIT transaction on one pooled connection
  // from the shared singleton pool. On any throw: ROLLBACK and rethrow. The
  // connection is always released.
  transaction<T>(fn: (tx: TxClient) => Promise<T>): Promise<T>
  end(): Promise<void>
}

let _client: DbPool | null = null

function getClient(): DbPool {
  if (_client) return _client

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pool } = require('pg') as typeof import('pg')

  const pool = new Pool({
    connectionString: getDbUrl(),
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    options: '-c statement_timeout=30000',
  })

  pool.on('error', (err: Error) => {
    console.error(JSON.stringify({
      level: 'error',
      event: 'db.pool.error',
      message: err.message,
      timestamp: new Date().toISOString(),
    }))
  })

  _client = {
    async query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<{ rows: T[] }> {
      const result = await pool.query(sql, params)
      return { rows: result.rows as T[] }
    },
    async transaction<T>(
      fn: (tx: TxClient) => Promise<T>,
    ): Promise<T> {
      // One connection from the existing singleton pool — BEGIN, the work, and
      // COMMIT all share it. No second pool.
      const client = await pool.connect()
      const tx: TxClient = {
        async query<R = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<{ rows: R[] }> {
          const result = await client.query(sql, params)
          return { rows: result.rows as R[] }
        },
      }
      try {
        await client.query('BEGIN')
        const out = await fn(tx)
        await client.query('COMMIT')
        return out
      } catch (err) {
        await client.query('ROLLBACK')
        throw err
      } finally {
        client.release()
      }
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
