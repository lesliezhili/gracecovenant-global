/**
 * CovenantPath e2e — Language toggle + SEO metadata
 * Verifies: toggle button switches locale, hreflang links present, OG locale correct
 */
import { test, expect } from '@playwright/test'

async function getLanguageSelect(page: import('@playwright/test').Page) {
  const selects = page.locator('header select')

  async function findVisibleSelect() {
    const count = await selects.count()
    for (let i = 0; i < count; i += 1) {
      const select = selects.nth(i)
      const hasLocaleOptions = await select.locator('option[value="zh-TW"]').count()
      if (hasLocaleOptions > 0 && await select.isVisible()) return select
    }
    return null
  }

  const visibleSelect = await findVisibleSelect()
  if (visibleSelect) return visibleSelect

  await page.locator('header button').first().click()
  const mobileSelect = await findVisibleSelect()
  if (!mobileSelect) throw new Error('Language select not found')
  return mobileSelect
}

test.describe('Language toggle', () => {
  test('language select on zh-CN switches to zh-TW', async ({ page }) => {
    await page.goto('/zh-CN')
    const languageSelect = await getLanguageSelect(page)
    await languageSelect.selectOption('zh-TW')
    // Should land on /zh-TW
    await expect(page).toHaveURL(/\/zh-TW/)
    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBe('zh-Hant')
  })

  test('language select on zh-TW switches to zh-CN', async ({ page }) => {
    await page.goto('/zh-TW')
    const languageSelect = await getLanguageSelect(page)
    await languageSelect.selectOption('zh-CN')
    await expect(page).toHaveURL(/\/zh-CN/)
    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBe('zh-Hans')
  })

  test('toggle preserves sub-path', async ({ page }) => {
    await page.goto('/zh-CN/matches')
    const languageSelect = await getLanguageSelect(page)
    await languageSelect.selectOption('zh-TW')
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
