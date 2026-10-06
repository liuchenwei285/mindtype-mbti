import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'

const executablePath = process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:4173'
const workDir = path.resolve(process.env.E2E_OUTPUT_DIR ?? 'work/e2e')
await fs.mkdir(workDir, { recursive: true })

const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
  permissions: ['clipboard-read', 'clipboard-write'],
})
const page = await context.newPage()
page.on('console', (message) => {
  if (message.type() === 'error') console.error('[browser console]', message.text())
})
page.on('pageerror', (error) => console.error('[page error]', error.message))

async function text(locator) {
  return (await locator.textContent())?.replace(/\s+/g, ' ').trim() ?? ''
}

async function choose(letterLabel) {
  const radio = page.getByRole('radio', { name: letterLabel })
  await radio.click()
  await assert.equal(await radio.getAttribute('aria-checked'), 'true')
}

async function answerCurrent(questionId) {
  const desired = questionId <= 12 ? 'I' : questionId <= 24 ? 'N' : questionId <= 36 ? 'F' : 'P'
  const firstLetter = questionId <= 12 ? 'E' : questionId <= 24 ? 'S' : questionId <= 36 ? 'T' : 'J'
  const supportsFirst = questionId % 2 === 1
  const supportsDesired = desired === firstLetter ? supportsFirst : !supportsFirst
  await choose(supportsDesired ? '非常同意' : '非常不同意')
}

await page.goto(baseURL, { waitUntil: 'networkidle' })
assert.match(await page.title(), /MindType/)
assert.ok((await text(page.locator('h1').first())).includes('更懂自己'))
await page.screenshot({ path: path.join(workDir, 'desktop-home.png'), fullPage: true })

await page.getByRole('button', { name: '开始测试' }).first().click()
await page.waitForURL(/#\/test/)

// Answer first question, go back and modify it, then restore the intended answer.
await answerCurrent(1)
await page.getByRole('button', { name: /下一题/ }).click()
assert.ok((await text(page.locator('main'))).includes('第 2 / 48 题'))
await page.getByRole('button', { name: /上一题/ }).click()
await page.getByText('第 1 / 48 题').waitFor()
assert.ok((await text(page.locator('main'))).includes('第 1 / 48 题'))
await choose('非常同意')
await choose('非常不同意')
await page.getByRole('button', { name: /下一题/ }).click()

// Answer questions 2-5, then refresh and verify progress plus answers persist.
for (let questionId = 2; questionId <= 5; questionId += 1) {
  await answerCurrent(questionId)
  await page.getByRole('button', { name: /下一题/ }).click()
}
await page.reload({ waitUntil: 'networkidle' })
assert.ok((await text(page.locator('main'))).includes('第 6 / 48 题'), 'refresh should restore current question')
const restoredChecked = await page.getByRole('radio', { name: '非常同意' }).getAttribute('aria-checked')
assert.notEqual(restoredChecked, 'true', 'question 6 should be unanswered')

// Complete the remaining questions.
for (let questionId = 6; questionId <= 48; questionId += 1) {
  await answerCurrent(questionId)
  if (questionId === 48) {
    await page.getByRole('button', { name: /查看我的结果/ }).click()
  } else {
    await page.getByRole('button', { name: /下一题/ }).click()
  }
}

await page.waitForURL(/#\/result/)
await page.waitForSelector('text=INFP')
const resultText = await text(page.locator('main'))
for (const expected of ['INFP', '调停者', 'Mediator', '四维度倾向', '优势', '挑战', '学习方式', '工作方式', '人际交往特点', '压力下的表现']) {
  assert.ok(resultText.includes(expected), `result page should include ${expected}`)
}
assert.ok(resultText.includes('不代表严格的心理学诊断'))

await page.screenshot({ path: path.join(workDir, 'desktop-result.png'), fullPage: true })

await page.getByRole('button', { name: '复制结果' }).click()
await page.waitForSelector('text=结果文字已复制')

const downloadPromise = page.waitForEvent('download')
await page.getByRole('button', { name: '下载结果卡片' }).click()
const download = await downloadPromise
const cardPath = path.join(workDir, 'result-card.png')
await download.saveAs(cardPath)
const cardStat = await fs.stat(cardPath)
assert.ok(cardStat.size > 20_000, `share card should not be empty, got ${cardStat.size} bytes`)

await page.getByRole('button', { name: '重新测试' }).first().click()
await page.waitForURL(/#\/test/)
await page.getByText('第 1 / 48 题').waitFor()
assert.ok((await text(page.locator('main'))).includes('第 1 / 48 题'))
const sessionAnswers = await page.evaluate(() => JSON.parse(localStorage.getItem('mindtype.session.v1') ?? '{}').answers ?? {})
assert.deepEqual(sessionAnswers, {})

// Mobile layout smoke test and screenshots.
const mobileContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
})
const mobile = await mobileContext.newPage()
await mobile.goto(baseURL, { waitUntil: 'networkidle' })
const mobileHomeOverflow = await mobile.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
assert.ok(mobileHomeOverflow <= 1, `mobile home overflow: ${mobileHomeOverflow}px`)
await mobile.screenshot({ path: path.join(workDir, 'mobile-home.png'), fullPage: true })
await mobile.getByRole('button', { name: '开始测试' }).first().click()
await mobile.waitForURL(/#\/test/)
await mobile.getByRole('radio').first().waitFor()
const mobileQuizOverflow = await mobile.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
assert.ok(mobileQuizOverflow <= 1, `mobile quiz overflow: ${mobileQuizOverflow}px`)
assert.equal(await mobile.getByRole('radio').count(), 7)
await mobile.screenshot({ path: path.join(workDir, 'mobile-quiz.png'), fullPage: true })

console.log(JSON.stringify({
  result: 'INFP',
  checks: 16,
  shareCardBytes: cardStat.size,
  mobileHomeOverflow,
  mobileQuizOverflow,
  screenshots: ['desktop-home.png', 'desktop-result.png', 'mobile-home.png', 'mobile-quiz.png', 'result-card.png'],
}, null, 2))

await mobileContext.close()
await context.close()
await browser.close()






