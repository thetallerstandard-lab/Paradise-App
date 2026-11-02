import { expect, test } from "@playwright/test";

// Signed-out behaviour only: these run in CI without real credentials.
// The signed-in journey is verified manually (see docs/development/TESTING.md).

test("protected pages send visitors to sign-in and remember where they were going", async ({ page }) => {
  await page.goto("/profile");
  await expect(page).toHaveURL(/\/sign-in\?next=%2Fprofile$/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
});

test("sign-up form shows validation errors without losing input", async ({ page }) => {
  await page.goto("/sign-up");
  await page.getByLabel("Your name").fill("Test Contractor");
  await page.getByLabel("Email").fill("not-an-email");
  await page.getByLabel("Password").fill("short");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByText("Enter a valid email address")).toBeVisible();
  await expect(page.getByText("Use at least 10 characters")).toBeVisible();
  await expect(page.getByLabel("Your name")).toHaveValue("Test Contractor");
  await expect(page.getByLabel("Email")).toHaveValue("not-an-email");
});

test("sign-in page links to password reset and sign-up", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(page.getByRole("link", { name: "Forgot your password?" })).toHaveAttribute("href", "/forgot-password");
  await expect(page.getByRole("link", { name: "Create an account" })).toHaveAttribute("href", "/sign-up");
});

test("expired email links land on sign-in with an explanation", async ({ page }) => {
  await page.goto("/auth/callback?code=not-a-real-code&next=/dashboard");
  await expect(page).toHaveURL(/\/sign-in\?error=link/);
  // Production builds also render Next.js's empty route-announcer alert, so filter by text.
  await expect(page.getByRole("alert").filter({ hasText: "invalid or has expired" })).toBeVisible();
});

test("unknown contractor profile returns 404", async ({ page }) => {
  const response = await page.goto("/c/no-such-contractor-xyz");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});
