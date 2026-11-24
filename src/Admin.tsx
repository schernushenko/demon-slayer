import { useEffect, useState, type FormEvent } from 'react'
import './Admin.css'

type AdminStats = {
  totalVisits: number
}

async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
  const responseBody = await response.text()
  let result: T & { error?: string }
  try {
    result = JSON.parse(responseBody) as T & { error?: string }
  } catch {
    throw new Error(
      `Сервер вернул некорректный ответ (HTTP ${response.status}). Перезапустите проект командой npm run dev.`,
    )
  }
  if (!response.ok) {
    throw new Error(result.error ?? 'Не удалось выполнить запрос.')
  }
  return result
}

function Admin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(true)

  useEffect(() => {
    document.title = 'Вход администратора'
    let active = true
    const meta = document.querySelector('meta[name="robots"]') ?? document.createElement('meta')
    meta.setAttribute('name', 'robots')
    meta.setAttribute('content', 'noindex, nofollow, noarchive')
    document.head.append(meta)

    adminRequest<AdminStats>('/api/admin/stats')
      .then((data) => {
        if (active) setStats(data)
      })
      .catch(() => {
        if (active) setStats(null)
      })
      .finally(() => {
        if (active) setBusy(false)
      })

    return () => {
      active = false
    }
  }, [])

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await adminRequest('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })
      const data = await adminRequest<AdminStats>('/api/admin/stats')
      setStats(data)
      setPassword('')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Ошибка входа.')
    } finally {
      setBusy(false)
    }
  }

  async function handleLogout() {
    setBusy(true)
    try {
      await adminRequest('/api/admin/logout', { method: 'POST', body: '{}' })
      setStats(null)
      setUsername('')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не удалось выйти.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="admin-page">
      <section aria-labelledby="admin-title" className="admin-panel">
        <p className="admin-kicker">ЗАКРЫТЫЙ РАЗДЕЛ</p>
        <h1 id="admin-title">Панель администратора</h1>
        {busy && !stats ? (
          <p className="admin-status" role="status">Проверяем сессию…</p>
        ) : stats ? (
          <>
            <div className="admin-stat">
              <span className="admin-stat-label">Всего посещений</span>
              <strong aria-live="polite">{stats.totalVisits.toLocaleString('ru-RU')}</strong>
            </div>
            <button className="admin-button" disabled={busy} onClick={handleLogout} type="button">
              Выйти
            </button>
          </>
        ) : (
          <form className="admin-form" onSubmit={handleLogin}>
            <label>
              Логин
              <input
                autoComplete="username"
                onChange={(event) => setUsername(event.target.value)}
                required
                value={username}
              />
            </label>
            <label>
              Пароль
              <input
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </label>
            {error && <p className="admin-error" role="alert">{error}</p>}
            <button className="admin-button" disabled={busy} type="submit">
              {busy ? 'Входим…' : 'Войти'}
            </button>
          </form>
        )}
        {stats && error && <p className="admin-error" role="alert">{error}</p>}
      </section>
    </main>
  )
}

export default Admin
