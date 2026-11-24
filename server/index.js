import { randomBytes, createHash } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import express from 'express'
import Database from 'better-sqlite3'
import {
  configPasswordMatches,
  readAdminConfig,
  safeEqual,
} from './admin-config.js'

const app = express()
const isProduction = !process.argv.includes('--dev')
const port = Number(process.env.PORT) || (isProduction ? 3000 : 5173)
const databasePath = resolve(
  process.env.DATABASE_PATH || (isProduction ? '/data/visits.sqlite' : 'data/visits.sqlite'),
)
const sessionLifetimeSeconds = 8 * 60 * 60
const loginWindowMs = 15 * 60 * 1000
const maxLoginAttempts = 8
const loginAttempts = new Map()

mkdirSync(dirname(databasePath), { recursive: true })
const database = new Database(databasePath)
database.pragma('journal_mode = WAL')
database.pragma('busy_timeout = 5000')
database.exec(`
  CREATE TABLE IF NOT EXISTS site_stats (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    total_visits INTEGER NOT NULL DEFAULT 0
  );
  INSERT OR IGNORE INTO site_stats (id, total_visits) VALUES (1, 0);
  CREATE TABLE IF NOT EXISTS admin_sessions (
    token_hash TEXT PRIMARY KEY,
    credential_hash TEXT NOT NULL,
    expires_at INTEGER NOT NULL
  );
`)
database.prepare('DELETE FROM admin_sessions WHERE expires_at <= ?').run(Date.now())

app.disable('x-powered-by')
app.set('trust proxy', process.env.TRUST_PROXY === '1' ? 1 : false)
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  })
  next()
})
app.use(express.json({ limit: '10kb' }))

function sendApiError(res, status, message) {
  res.set('Cache-Control', 'no-store')
  res.status(status).json({ error: message })
}

function tokenHash(token) {
  return createHash('sha256').update(token).digest('hex')
}

function readCookie(req, name) {
  const cookies = req.headers.cookie?.split(';') ?? []
  for (const item of cookies) {
    const separator = item.indexOf('=')
    if (separator < 0 || item.slice(0, separator).trim() !== name) continue
    try {
      return decodeURIComponent(item.slice(separator + 1).trim())
    } catch {
      return null
    }
  }
  return null
}

function cookieOptions() {
  return [
    'Path=/api/admin',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${sessionLifetimeSeconds}`,
    ...(isProduction ? ['Secure'] : []),
  ].join('; ')
}

function requireSameOrigin(req, res, next) {
  const origin = req.get('origin')
  if (!origin) return sendApiError(res, 403, 'Запрос отклонён.')
  try {
    if (new URL(origin).host !== req.get('host')) {
      return sendApiError(res, 403, 'Запрос отклонён.')
    }
  } catch {
    return sendApiError(res, 403, 'Запрос отклонён.')
  }
  if (req.get('sec-fetch-site') === 'cross-site') {
    return sendApiError(res, 403, 'Запрос отклонён.')
  }
  next()
}

function requireAdmin(req, res, next) {
  const token = readCookie(req, 'admin_session')
  if (!token) return sendApiError(res, 401, 'Требуется вход.')

  const session = database.prepare(
    'SELECT credential_hash, expires_at FROM admin_sessions WHERE token_hash = ?',
  ).get(tokenHash(token))
  let config
  try {
    config = readAdminConfig()
  } catch (error) {
    console.error('Не удалось прочитать admin.config.json:', error)
    return sendApiError(res, 500, 'Ошибка чтения файла настроек администратора.')
  }
  if (
    !session
    || session.expires_at <= Date.now()
    || !config
    || !safeEqual(session.credential_hash, config.credentialHash)
  ) {
    if (session) {
      database.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').run(tokenHash(token))
    }
    res.set('Set-Cookie', 'admin_session=; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=0')
    return sendApiError(res, 401, 'Сессия истекла. Войдите снова.')
  }

  next()
}

function getAttemptState(ip) {
  const now = Date.now()
  const state = loginAttempts.get(ip)
  if (!state || state.resetAt <= now) {
    const freshState = { count: 0, resetAt: now + loginWindowMs }
    loginAttempts.set(ip, freshState)
    if (loginAttempts.size > 1000) {
      for (const [attemptIp, attemptState] of loginAttempts) {
        if (attemptState.resetAt <= now) loginAttempts.delete(attemptIp)
      }
    }
    return freshState
  }
  return state
}

app.post('/api/admin/login', requireSameOrigin, (req, res) => {
  const ip = req.ip
  const attempt = getAttemptState(ip)
  if (attempt.count >= maxLoginAttempts) {
    return sendApiError(res, 429, 'Слишком много попыток. Попробуйте позже.')
  }

  let config
  try {
    config = readAdminConfig()
  } catch (error) {
    console.error('Не удалось прочитать admin.config.json:', error)
    return sendApiError(res, 500, 'Ошибка чтения файла настроек администратора.')
  }
  if (!config) {
    return sendApiError(res, 503, 'Администратор не настроен. Запустите npm run admin:setup.')
  }

  const { username, password } = req.body ?? {}
  const validUsername = typeof username === 'string' && safeEqual(username, config.username)
  const validPassword = typeof password === 'string'
    && password.length <= 1024
    && configPasswordMatches(password, config)

  if (!validUsername || !validPassword) {
    attempt.count += 1
    return sendApiError(res, 401, 'Неверный логин или пароль.')
  }

  loginAttempts.delete(ip)
  const token = randomBytes(32).toString('base64url')
  const expiresAt = Date.now() + sessionLifetimeSeconds * 1000
  database.prepare(
    'INSERT INTO admin_sessions (token_hash, credential_hash, expires_at) VALUES (?, ?, ?)',
  ).run(tokenHash(token), config.credentialHash, expiresAt)
  database.prepare('DELETE FROM admin_sessions WHERE expires_at <= ?').run(Date.now())

  res.set('Cache-Control', 'no-store')
  res.set('Set-Cookie', `admin_session=${token}; ${cookieOptions()}`)
  res.json({ ok: true })
})

app.get('/api/admin/stats', requireAdmin, (_req, res) => {
  res.set('Cache-Control', 'no-store')
  const { total_visits: totalVisits } = database.prepare(
    'SELECT total_visits FROM site_stats WHERE id = 1',
  ).get()
  res.json({ totalVisits })
})

app.post('/api/admin/logout', requireSameOrigin, requireAdmin, (req, res) => {
  const token = readCookie(req, 'admin_session')
  if (token) {
    database.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').run(tokenHash(token))
  }
  res.set('Cache-Control', 'no-store')
  res.set('Set-Cookie', 'admin_session=; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=0')
  res.json({ ok: true })
})

app.get('/', (req, _res, next) => {
  if (req.accepts('html')) {
    database.prepare('UPDATE site_stats SET total_visits = total_visits + 1 WHERE id = 1').run()
  }
  next()
})

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error)
  if (error.status === 400 && req.path.startsWith('/api/')) {
    return sendApiError(res, 400, 'Некорректный JSON в запросе.')
  }
  if (error.status === 413 && req.path.startsWith('/api/')) {
    return sendApiError(res, 413, 'Слишком большой запрос.')
  }
  next(error)
})

let viteServer

if (isProduction) {
  const distPath = resolve('dist')
  app.use(express.static(distPath, { index: false }))
  const sendApp = (_req, res) => res.sendFile(resolve(distPath, 'index.html'))
  app.get('/admin', sendApp)
  app.get('/admin/', sendApp)
  app.get('/{*path}', (req, res) => {
    if (req.path.startsWith('/api/')) return res.sendStatus(404)
    sendApp(req, res)
  })
} else {
  const { createServer } = await import('vite')
  viteServer = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  })
  app.use(viteServer.middlewares)
}

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on http://localhost:${port}`)
  try {
    if (!readAdminConfig()) console.warn('Admin login is not configured. Run npm run admin:setup.')
  } catch (error) {
    console.error('Unable to read admin configuration:', error)
  }
})

function shutdown() {
  server.close(() => {
    Promise.resolve(viteServer?.close()).finally(() => {
      database.close()
      process.exit(0)
    })
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
