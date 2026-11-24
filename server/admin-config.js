import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export const configPath = resolve(
  process.env.ADMIN_CONFIG_PATH || resolve(process.cwd(), 'admin.config.json'),
)

export function readAdminConfig() {
  try {
    const config = JSON.parse(readFileSync(configPath, 'utf8'))
    const hasPasswordHash = typeof config.passwordHash === 'string' && !!config.passwordHash
    const hasPlainPassword = typeof config.password === 'string'
      && config.password.length >= 12
      && config.password.length <= 1024
    if (
      typeof config.username !== 'string'
      || !config.username
      || config.username.length > 100
      || hasPasswordHash === hasPlainPassword
    ) {
      return null
    }

    if (
      config.passwordHash
      && !/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/i.test(config.passwordHash)
    ) {
      return null
    }

    return {
      ...config,
      credentialHash: createHash('sha256')
        .update(config.passwordHash || `plain\0${config.password}`)
        .digest('hex'),
    }
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `scrypt$${salt}$${hash}`
}

export function verifyPassword(password, encodedHash) {
  const [algorithm, salt, expectedHex] = encodedHash.split('$')
  if (algorithm !== 'scrypt' || !salt || !/^[a-f0-9]{128}$/i.test(expectedHex ?? '')) {
    return false
  }

  const expected = Buffer.from(expectedHex, 'hex')
  const actual = scryptSync(password, salt, expected.length)
  return timingSafeEqual(actual, expected)
}

export function configPasswordMatches(password, config) {
  if (typeof config.passwordHash === 'string' && config.passwordHash) {
    return verifyPassword(password, config.passwordHash)
  }
  return typeof config.password === 'string' && safeEqual(password, config.password)
}

export function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer)
}
