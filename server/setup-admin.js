import { createInterface } from 'node:readline'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { hashPassword, readAdminConfig, configPath } from './admin-config.js'

function question(prompt) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout })
    rl.question(prompt, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

function hiddenQuestion(prompt) {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== 'function') {
    throw new Error('Запустите npm run admin:setup в интерактивном терминале.')
  }

  return new Promise((resolve, reject) => {
    process.stdout.write(prompt)
    let value = ''
    process.stdin.setRawMode(true)
    process.stdin.resume()

    const onData = (chunk) => {
      for (const character of chunk.toString('utf8')) {
        if (character === '\u0003') {
          process.stdin.setRawMode(false)
          process.stdin.off('data', onData)
          process.stdout.write('\n')
          reject(new Error('Настройка отменена.'))
          return
        }
        if (character === '\r' || character === '\n') {
          process.stdin.setRawMode(false)
          process.stdin.off('data', onData)
          process.stdout.write('\n')
          resolve(value)
          return
        }
        if (character === '\u007f' || character === '\b') {
          value = value.slice(0, -1)
        } else if (character >= ' ') {
          value += character
        }
      }
    }

    process.stdin.on('data', onData)
  })
}

try {
  const existing = readAdminConfig()
  const defaultUsername = existing?.username ?? 'admin'
  const usernameInput = await question(`Логин администратора (${defaultUsername}): `)
  const username = usernameInput.trim() || defaultUsername
  const password = await hiddenQuestion('Новый пароль (минимум 12 символов): ')
  const confirmation = await hiddenQuestion('Повторите пароль: ')

  if (password.length < 12) {
    throw new Error('Пароль должен содержать не менее 12 символов.')
  }
  if (password !== confirmation) {
    throw new Error('Пароли не совпадают.')
  }

  mkdirSync(dirname(configPath), { recursive: true })
  writeFileSync(
    configPath,
    `${JSON.stringify({ username, passwordHash: hashPassword(password) }, null, 2)}\n`,
    { mode: 0o600 },
  )
  console.log(`Настройки сохранены в ${configPath}`)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
