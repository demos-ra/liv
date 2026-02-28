// [core/db/client.ts]
// R5 — pure infrastructure. Zero business logic.
// O6: DATABASE_URL from env only. O3: statement_timeout=30s. O5: structured error log.

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
    async end(): Promise<void> {
      await pool.end()
      _client = null
    },
  }

  return _client
}

export const db: DbPool = new Proxy({} as DbPool, {
  get(_target, prop) {
    return (getClient() as Record<string, unknown>)[prop as string]
  },
})

export async function closeDb(): Promise<void> {
  if (_client) await _client.end()
}

// Tagged template adapter — makes db compatible with auth-db's sql`` interface
export function taggedDb(rawDb: typeof db) {
  return function sql(strings: TemplateStringsArray, ...values: unknown[]) {
    let query = ''
    const params: unknown[] = []
    strings.forEach((str, i) => {
      query += str
      if (i < values.length) {
        params.push(values[i])
        query += `$${params.length}`
      }
    })
    return rawDb.query(query, params).then((r: { rows: unknown[] }) => r.rows)
  }
}
