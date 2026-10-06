import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const distDir = path.resolve(root, 'dist')
const htmlPath = path.join(distDir, 'index.html')
let html = await fs.readFile(htmlPath, 'utf8')

const scriptMatch = html.match(/<script[^>]*src="([^"]+)"[^>]*><\/script>/i)
if (!scriptMatch) throw new Error('Standalone build failed: bundle script not found in dist/index.html')
const scriptPath = path.join(distDir, scriptMatch[1].replace(/^\//, ''))
let script = await fs.readFile(scriptPath, 'utf8')
script = script.replace(/<\/script/gi, '<\\/script')
html = html.replace(scriptMatch[0], () => `<script type="module">\n${script}\n</script>`)

const styleMatch = html.match(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/i)
if (!styleMatch) throw new Error('Standalone build failed: stylesheet not found in dist/index.html')
const stylePath = path.join(distDir, styleMatch[1].replace(/^\//, ''))
const style = await fs.readFile(stylePath, 'utf8')
html = html.replace(styleMatch[0], () => `<style>\n${style}\n</style>`)

const outputName = 'MindType-standalone.html'
await fs.writeFile(path.join(distDir, outputName), html, 'utf8')
const outputsDir = path.resolve(root, 'outputs')
await fs.mkdir(outputsDir, { recursive: true })
await fs.writeFile(path.join(outputsDir, outputName), html, 'utf8')

console.log(`Standalone build written to dist/${outputName} and outputs/${outputName}`)
