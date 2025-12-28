/**
 * Indeed credential testing
 * Performs a lightweight login check to verify credentials
 */

import { chromium, type Browser, type Page } from "playwright";

export interface TestCredentialsResult {
  success: boolean;
  error?: string;
}

/**
 * Test Indeed credentials by attempting to log in
 * Uses headless browser automation
 */
export async function testIndeedCredentials(
  username: string,
  password: string
): Promise<TestCredentialsResult> {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    // Launch browser in headless mode
    browser = await chromium.launch({
      headless: true,
      timeout: 30000,
    });

    // Create new page
    page = await browser.newPage({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    });

    // Set timeout for navigation
    page.setDefaultTimeout(15000);

    // Navigate to Indeed login page
    await page.goto("https://secure.indeed.com/account/login", {
      waitUntil: "domcontentloaded",
    });

    // Wait for email input
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    // Fill in email
    await page.fill('input[type="email"]', username);

    // Click continue button
    await page.click('button[type="submit"]');

    // Wait for password input
    await page.waitForSelector('input[type="password"]', { timeout: 10000 });

    // Fill in password
    await page.fill('input[type="password"]', password);

    // Click sign in button
    await page.click('button[type="submit"]');

    // Wait for navigation or error
    await Promise.race([
      // Success case: redirected to Indeed homepage or account page
      page.waitForURL(
        (url) => url.hostname === "www.indeed.com" || url.pathname.includes("/account"),
        {
          timeout: 10000,
        }
      ),
      // Error case: error message appears
      page.waitForSelector('[data-testid="error-message"], .error-message, .alert-danger', {
        timeout: 10000,
      }),
    ]);

    // Check if we're logged in successfully
    const currentUrl = page.url();
    if (currentUrl.includes("indeed.com") && !currentUrl.includes("/account/login")) {
      // Successfully logged in
      return {
        success: true,
      };
    }

    // Check for error messages
    const errorElement = await page.$(
      '[data-testid="error-message"], .error-message, .alert-danger'
    );
    if (errorElement) {
      const errorText = await errorElement.textContent();
      return {
        success: false,
        error: errorText || "Invalid credentials",
      };
    }

    // If still on login page, credentials are likely invalid
    if (currentUrl.includes("/account/login")) {
      return {
        success: false,
        error: "Invalid credentials - could not log in",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        return {
          success: false,
          error: "Connection timeout - please try again",
        };
      }
      return {
        success: false,
        error: `Login test failed: ${error.message}`,
      };
    }

    return {
      success: false,
      error: "Unknown error occurred during login test",
    };
  } finally {
    // Clean up
    if (page) {
      await page.close().catch(() => {});
    }
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
