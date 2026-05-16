// =============================================================================
// e2e.js — Global Support File
// =============================================================================
// Cypress automatically loads this file before EVERY test file in the suite.
//
// Use this file to:
//   1. Import custom commands (so cy.login(), cy.verifyToast() etc. are available)
//   2. Register @cypress/grep for tag-based test filtering (@smoke, @regression)
//   3. Reset the step logger counter before each test
//   4. Set up global before/afterEach hooks that apply to ALL tests
//   5. Handle uncaught application errors gracefully
// =============================================================================

// Import all custom cy.* commands from commands.js
import './commands'

// Register Allure Cypress support so each test automatically gets
// Allure metadata (title, status, attachments) written to allure-results/.
import 'allure-cypress'

// Register @cypress/grep so tests can be filtered by tag from the CLI:
//   npx cypress run --env grep=@smoke
//   npx cypress run --env grep=@regression
import { register as registerCypressGrep } from '@cypress/grep'
registerCypressGrep()

// Import the step counter reset from the centralised logger
import { resetStepCounter } from './logger'

// -----------------------------------------------------------------------------
// Global beforeEach — runs before EVERY single test across the entire framework
// -----------------------------------------------------------------------------
beforeEach(() => {
  // Reset the step counter so each test starts at STEP 1
  resetStepCounter()

  // OrangeHRM sometimes throws Vue/ResizeObserver errors that are harmless.
  // We suppress them here so they don't fail unrelated tests.
  Cypress.on('uncaught:exception', (err) => {
    const ignoredErrors = [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Cannot read properties of undefined',
      'ChunkLoadError',
    ]
    const shouldIgnore = ignoredErrors.some((msg) => err.message.includes(msg))
    if (shouldIgnore) return false
  })
})

// -----------------------------------------------------------------------------
// Global afterEach — runs after EVERY single test
// -----------------------------------------------------------------------------
afterEach(function () {
  if (this.currentTest.state === 'failed') {
    cy.log(`[FAIL] TEST FAILED: ${this.currentTest.fullTitle()}`)
  }
})
