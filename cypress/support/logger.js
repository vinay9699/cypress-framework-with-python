// =============================================================================
// logger.js — Centralised Step Logger
// =============================================================================
// Import and use this in any test file or page object for consistent,
// structured logging that appears in the Cypress command log panel.
//
// Import in test files:
//   import { step, info, warn, success, fail, section } from '../support/logger'
//
// Import in page objects (BasePage already calls this internally):
//   import { step, info } from '../support/logger'
//
// Log levels:
//   step()    — a named test step  e.g. "STEP 1: Navigate to login page"
//   info()    — general info       e.g. "[INFO] Filling username field"
//   success() — assertion passed   e.g. "[PASS] Dashboard loaded correctly"
//   warn()    — soft warning       e.g. "[WARN] Element not found, skipping"
//   fail()    — soft failure       e.g. "[FAIL] Expected 'Admin', got 'Guest'"
//   section() — block separator    e.g. "=== Authentication ==="
//   api()     — API-related logs   e.g. "[API] POST /auth/login → 200"
//   data()    — test data logs     e.g. "[DATA] username=Admin"
// =============================================================================

// Internal counter — resets between tests via beforeEach in e2e.js
let _stepCounter = 0

/**
 * Reset the step counter. Called automatically in global beforeEach.
 * You do NOT need to call this manually in tests.
 */
export const resetStepCounter = () => {
  _stepCounter = 0
}

/**
 * Log a numbered test step.
 * Steps are numbered automatically so you can track test progress.
 *
 * Usage: step('Navigate to the login page')
 * Output in Cypress log: "STEP 1: Navigate to the login page"
 *
 * @param {string} description - what this step does
 */
export const step = (description) => {
  _stepCounter++
  cy.log(`**STEP ${_stepCounter}:** ${description}`)
}

/**
 * Log a general informational message.
 *
 * Usage: info('Filling in the username field with Admin')
 * Output: "[INFO] Filling in the username field with Admin"
 *
 * @param {string} message
 */
export const info = (message) => {
  cy.log(`[INFO] ${message}`)
}

/**
 * Log a successful assertion or outcome.
 *
 * Usage: success('Dashboard loaded and sidebar is visible')
 * Output: "[PASS] Dashboard loaded and sidebar is visible"
 *
 * @param {string} message
 */
export const success = (message) => {
  cy.log(`[PASS] ✓ ${message}`)
}

/**
 * Log a soft warning — something unexpected but not fatal.
 *
 * Usage: warn('Spinner still visible after 2s, waiting longer')
 * Output: "[WARN] Spinner still visible after 2s, waiting longer"
 *
 * @param {string} message
 */
export const warn = (message) => {
  cy.log(`[WARN] ⚠ ${message}`)
}

/**
 * Log a soft failure — assertion failed but test continues.
 * Use alongside BasePage.softAssert() for non-blocking checks.
 *
 * Usage: fail('Expected username "Admin" but got "Guest"')
 * Output: "[FAIL] ✗ Expected username "Admin" but got "Guest""
 *
 * @param {string} message
 */
export const fail = (message) => {
  cy.log(`[FAIL] ✗ ${message}`)
}

/**
 * Log a visual section separator — helps group related steps in the log.
 *
 * Usage: section('Authentication')
 * Output: "─── Authentication ───"
 *
 * @param {string} title - section title
 */
export const section = (title) => {
  cy.log(`**─── ${title.toUpperCase()} ───**`)
}

/**
 * Log an API request/response summary.
 *
 * Usage: api('POST', '/auth/login', 200)
 * Output: "[API] POST /auth/login → 200"
 *
 * @param {string} method     - HTTP method (GET, POST, etc.)
 * @param {string} url        - endpoint URL
 * @param {number} statusCode - HTTP response status code
 */
export const api = (method, url, statusCode) => {
  cy.log(`[API] ${method.toUpperCase()} ${url} → ${statusCode}`)
}

/**
 * Log a test data value — useful for showing what data a test is using.
 * Automatically masks values that look like passwords.
 *
 * Usage: data('username', 'Admin')
 *        data('password', 'admin123')   → "[DATA] password=ad****23"
 *
 * @param {string} key   - field name
 * @param {string} value - field value (passwords are auto-masked)
 */
export const data = (key, value) => {
  const sensitiveKeys = ['password', 'secret', 'token', 'key', 'credential']
  const isSensitive = sensitiveKeys.some((k) => key.toLowerCase().includes(k))

  let displayValue = String(value)
  if (isSensitive && displayValue.length > 4) {
    displayValue = displayValue.substring(0, 2) + '****' + displayValue.slice(-2)
  }

  cy.log(`[DATA] ${key}=${displayValue}`)
}

// Default export — object form for convenient destructuring
export default { step, info, success, warn, fail, section, api, data, resetStepCounter }
