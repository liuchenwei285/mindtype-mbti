import { spawn } from 'node:child_process'
import path from 'node:path'

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:4173'
const serverPort = new URL(baseURL).port || '4173'

async function isServerReady() {
  try {
    const response = await fetch(baseURL)
    return response.ok
  } catch {
    return false
  }
}

async function waitForServer() {
  const deadline = Date.now() + 30_000
  while (Date.now() < deadline) {
    if (await isServerReady()) return
    await new Promise((resolve) => setTimeout(resolve, 400))
  }
  throw new Error(`Vite preview did not start at ${baseURL}`)
}

let server
if (!(await isServerReady())) {
  const viteBin = path.resolve('node_modules/vite/bin/vite.js')
  server = spawn(
    process.execPath,
    [viteBin, 'preview', '--host', '127.0.0.1', '--port', serverPort],
    { stdio: 'ignore', windowsHide: true },
  )
  await waitForServer()
}

try {
  await import('./e2e-flow.mjs')
} finally {
  if (server) server.kill()
}
