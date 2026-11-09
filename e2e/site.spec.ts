import { expect, test } from '@playwright/test';

// The site end to end, as a visitor meets it. The apps' check endpoints are answered here, so
// these tests don't depend on chef or chess being up.
test.beforeEach(async ({ page }) => {
  await page.route('**/api/check?**', (route) => {
    const q = new URL(route.request().url()).searchParams.get('q') ?? '';
    const ok = !q.endsWith('$4');
    route.fulfill({
      json: {
        check: ok
          ? { ok: true, tokens: [{ text: 'plan', at: 0, role: 'verb' }], canonical: q }
          : { ok: false, tokens: [], message: 'Budgets go from $5 to $1000.', at: q.length - 2 },
      },
    });
  });
});

test('the front page offers every app and a command line', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'I build things, then explain them.',
  );
  await expect(page.getByRole('link', { name: /LazyGrocer/ }).first()).toBeVisible();
  await expect(page.getByRole('combobox')).toBeVisible();
});

test('a request an app refuses says why and offers nothing to open', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('combobox').fill('plan 4 dinners for 2 under $4');
  await expect(page.getByText('Budgets go from $5 to $1000.')).toBeVisible();
  await expect(page.getByRole('option')).toHaveCount(0);
});

test('a request it understands can be opened in the app', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('combobox').fill('plan 4 dinners for 2 under $40');
  await expect(page.getByRole('option', { name: /Open in LazyGrocer/ })).toBeVisible();
});

test('/ opens the command line from any page', async ({ page }) => {
  await page.goto('/writing');
  // The shortcut listens once the page has drawn.
  await expect(page.getByRole('heading', { level: 1, name: 'Writing' })).toBeVisible();
  await page.keyboard.press('/');
  await expect(page.getByRole('dialog', { name: 'Command line' })).toBeVisible();
});

test('a post has its own address, and the old blog address finds it', async ({ page }) => {
  await page.goto('/writing/talking-docs');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Talking Docs');
  await page.goto('/blog');
  await expect(page).toHaveURL(/\/writing$/);
});
