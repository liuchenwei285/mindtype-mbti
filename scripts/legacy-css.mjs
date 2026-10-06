import fs from 'node:fs/promises'
import path from 'node:path'

function findMatchingBrace(text, openIndex) {
  let depth = 0
  let quote = ''
  let escaped = false

  for (let index = openIndex; index < text.length; index += 1) {
    const character = text[index]

    if (quote) {
      if (escaped) {
        escaped = false
      } else if (character === '\\') {
        escaped = true
      } else if (character === quote) {
        quote = ''
      }
      continue
    }

    if (character === '"' || character === "'") {
      quote = character
      continue
    }

    if (character === '{') depth += 1
    if (character === '}') {
      depth -= 1
      if (depth === 0) return index
    }
  }

  throw new Error('Legacy CSS transform failed: unmatched brace')
}

function flattenLayers(css) {
  let output = ''
  let index = 0

  while (index < css.length) {
    if (!css.startsWith('@layer', index)) {
      output += css[index]
      index += 1
      continue
    }

    const openBrace = css.indexOf('{', index)
    const semicolon = css.indexOf(';', index)
    const isStatement = semicolon !== -1 && (openBrace === -1 || semicolon < openBrace)

    if (isStatement) {
      index = semicolon + 1
      continue
    }

    if (openBrace === -1) {
      output += css[index]
      index += 1
      continue
    }

    const closeBrace = findMatchingBrace(css, openBrace)
    output += flattenLayers(css.slice(openBrace + 1, closeBrace))
    index = closeBrace + 1
  }

  return output
}

const distDir = path.resolve(process.cwd(), 'dist')
const assetsDir = path.join(distDir, 'assets')
const files = await fs.readdir(assetsDir)
const cssFiles = files.filter((file) => file.endsWith('.css'))

if (cssFiles.length === 0) {
  throw new Error('Legacy CSS transform failed: no CSS file found in dist/assets')
}

for (const file of cssFiles) {
  const filePath = path.join(assetsDir, file)
  const source = await fs.readFile(filePath, 'utf8')
  const flattened = flattenLayers(source)
  await fs.writeFile(filePath, flattened, 'utf8')
  console.log(`Legacy-compatible CSS written: assets/${file}`)
}
