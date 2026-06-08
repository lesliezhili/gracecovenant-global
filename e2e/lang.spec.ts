/**
 * CovenantPath e2e — Language toggle + SEO metadata
 * Verifies: toggle button switches locale, hreflang links present, OG locale correct
 */
import { test, expect } from '@playwright/test'

test.describe('Language toggle', () => {
  test('繁體 button on zh-CN switches to zh-TW', async ({ page }) => {
    await page.goto('/zh-CN')
    // Button shows '繁體' when currently on Simplified
    const toggleBtn = page.locator('button', { hasText: '\u7e41\u9ad4' })
    await expect(toggleBtn).toBeVisible()
    await toggleBtn.click()
    // Should land on /zh-TW
    await expect(page).toHaveURL(/\/zh-TW/)
    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBe('zh-Hant')
  })

  test('简体 button on zh-TW switches to zh-CN', async ({ page }) => {
    await page.goto('/zh-TW')
    const toggleBtn = page.locator('button', { hasText: '\u7b80\u4f53' })
    await expect(toggleBtn).toBeVisible()
    await toggleBtn.click()
    await expect(page).toHaveURL(/\/zh-CN/)
    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBe('zh-Hans')
  })

  test('toggle preserves sub-path', async ({ page }) => {
    await page.goto('/zh-CN/matches')
    const toggleBtn = page.locator('button', { hasText: '\u7e41\u9ad4' })
    await toggleBtn.click()
    await expect(page).toHaveURL(/\/zh-TW\/matches/)
  })
})

test.describe('SEO metadata', () => {
  test('zh-CN has canonical link pointing to zh-CN', async ({ page }) => {
    await page.goto('/zh-CN')
    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveAttribute('href', /zh-CN/)
  })

  test('zh-CN has hreflang alternate for zh-Hant', async ({ page }) => {
    await page.goto('/zh-CN')
    const hreflang = page.locator('link[hreflang="zh-Hant"]')
    await expect(hreflang).toHaveAttribute('href', /zh-TW/)
  })

  test('OG meta locale is zh_Hans on zh-CN', async ({ page }) => {
    await page.goto('/zh-CN')
    const og = page.locator('meta[property="og:locale"]')
    await expect(og).toHaveAttribute('content', 'zh_Hans')
  })
})
