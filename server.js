import bcrypt from 'bcryptjs'
import Database from 'better-sqlite3'
import cors from 'cors'
import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(root, 'data')
fs.mkdirSync(dataDir, { recursive: true })

const db = new Database(path.join(dataDir, 'codex-vue.db'))
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`)

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/auth/register', async (req, res) => {
  const username = String(req.body?.username || '').trim()
  const password = String(req.body?.password || '')
  if (!username || !password) return res.status(400).json({ message: '用户名和密码不能为空' })
  if (username.length > 64) return res.status(400).json({ message: '用户名不能超过 64 个字符' })
  if (password.length < 6) return res.status(400).json({ message: '密码至少需要 6 个字符' })

  try {
    const passwordHash = await bcrypt.hash(password, 12)
    db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, passwordHash)
    res.status(201).json({ message: '注册成功，请登录' })
  } catch (error) {
    if (String(error.message).includes('UNIQUE constraint failed')) {
      return res.status(409).json({ message: '该用户名已存在' })
    }
    console.error(error)
    res.status(500).json({ message: '注册失败，请稍后重试' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  const username = String(req.body?.username || '').trim()
  const password = String(req.body?.password || '')
  if (!username || !password) return res.status(400).json({ message: '用户名和密码不能为空' })

  const user = db.prepare('SELECT id, username, password_hash FROM users WHERE username = ?').get(username)
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ message: '用户名或密码错误' })
  }
  res.json({ message: `登录成功，欢迎你，${user.username}`, user: { id: user.id, username: user.username } })
})

app.listen(3000, () => console.log('API server: http://localhost:3000'))
