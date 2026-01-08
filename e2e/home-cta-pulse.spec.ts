import { test, expect } from "@playwright/test";

test("cta buttons have pulse animation", async ({ page }) => {
  await page.goto("/");

  const buttons = page.locator("button.cta-pulse");
  await expect(buttons.first()).toBeVisible();

  const animation = await buttons.first().evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return {
      name: styles.animationName,
      duration: styles.animationDuration,
      direction: styles.animationDirection,
    };
  });

  expect(animation.name).toContain("cta-pulse");
  expect(animation.duration).toContain("0.7s");
  expect(animation.direction).toContain("alternate");
});
