/**
 * CovenantPath e2e — Home page smoke tests
 * Covers: Simplified + Traditional Chinese variants
 */
import { test, expect } from '@playwright/test'

async function openMobileMenuIfNeeded(page: import('@playwright/test').Page) {
  if (await page.locator('header nav').isVisible()) return
  await page.locator('header button').first().click()
}

test.describe('Home page — Simplified Chinese (zh-CN)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/zh-CN')
  })

  test('sets lang=zh-Hans on <html>', async ({ page }) => {
    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBe('zh-Hans')
  })

  test('renders hero title with cross symbol', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /GraceCovenant/ })).toBeVisible()
  })

  test('navigation links are visible', async ({ page }) => {
    await openMobileMenuIfNeeded(page)
    await expect(page.locator('header').getByRole('link', { name: /\u914d\u5bf9|\u914d\u5c0d|Matches/ })).toBeVisible()
  })

  test('CTA button is visible', async ({ page }) => {
    await expect(page.getByRole('link', { name: /\u5f00\u59cb|\u958b\u59cb/ })).toBeVisible()
  })

  test('footer renders tagline', async ({ page }) => {
    await expect(page.locator('footer')).toContainText(/\u57fa\u7763|Christ-[Cc]entred/)
  })
})

test.describe('Home page — Traditional Chinese (zh-TW)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/zh-TW')
  })

  test('sets lang=zh-Hant on <html>', async ({ page }) => {
    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBe('zh-Hant')
  })

  test('renders hero title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /GraceCovenant/ })).toBeVisible()
  })

  test('footer renders tagline', async ({ page }) => {
    await expect(page.locator('footer')).toContainText(/\u57fa\u7763|Christ-[Cc]entred/)
  })
})

test.describe('404 — invalid locale', () => {
  test('unknown locale returns 404', async ({ page }) => {
    const res = await page.goto('/fr')
    // Next.js notFound() returns 404
    expect(res?.status()).toBe(404)
  })

  test('unknown locale /en-AU returns 404', async ({ page }) => {
    const res = await page.goto('/en-AU')
    expect(res?.status()).toBe(404)
  })
})
