// =============================================================================
// visual-regression.cy.js — Percy Visual Regression Tests
// =============================================================================
// Captures baseline screenshots of critical pages using Percy and compares
// them against the stored baseline on each run.
//
// SETUP (one-time):
//   1. Add PERCY_TOKEN to your GitHub Actions secrets
//   2. Run `npx percy exec -- cypress run --spec cypress/e2e/visual/**` locally
//      to create the initial baselines in Percy's dashboard
//   3. Subsequent CI runs diff against those baselines automatically
//
// Without PERCY_TOKEN:  cy.percySnapshot() is a harmless no-op —
//   tests pass locally without uploading anything.
//
// Tags: @visual @regression
// =============================================================================

import LoginPage from '../../pages/LoginPage'
import DashboardPage from '../../pages/DashboardPage'
import { label, severity, description } from 'allure-cypress'

const USERNAME = Cypress.env('validUsername') || 'Admin'
const PASSWORD = Cypress.env('validPassword') || 'admin123'

describe('Visual Regression — Critical Pages', { tags: ['@visual', '@regression'] }, () => {
  // -------------------------------------------------------------------------
  // LOGIN PAGE
  // -------------------------------------------------------------------------
  describe('Login Page', () => {
    beforeEach(() => {
      cy.clearSession()
      LoginPage.visit()
    })

    it('should match the login page baseline', () => {
      label('feature', 'Visual Regression')
      label('story', 'Login Page Baseline')
      severity('critical')
      description('Snapshot the login page and compare against stored Percy baseline.')

      LoginPage.verifyPageLoaded()
      cy.percySnapshot('Login Page — Default State', { widths: [1280, 375] })
    })

    it('should match the invalid credentials error state', () => {
      label('feature', 'Visual Regression')
      label('story', 'Login Error State')
      severity('normal')
      description('Snapshot the login page after submitting invalid credentials.')

      LoginPage.login('invalid_user', 'wrong_pass')
      LoginPage.verifyErrorMessage('Invalid credentials')
      cy.percySnapshot('Login Page — Error State', { widths: [1280, 375] })
    })
  })

  // -------------------------------------------------------------------------
  // DASHBOARD PAGE
  // -------------------------------------------------------------------------
  describe('Dashboard Page', () => {
    beforeEach(() => {
      cy.loginBySession(USERNAME, PASSWORD)
    })

    it('should match the dashboard baseline after successful login', () => {
      label('feature', 'Visual Regression')
      label('story', 'Dashboard Baseline')
      severity('critical')
      description('Snapshot the dashboard page and compare against stored Percy baseline.')

      cy.visit('/web/index.php/dashboard/index')
      DashboardPage.verifyLoaded()
      // Wait for any charts/lazy content to finish rendering
      cy.waitForPageLoad()
      cy.percySnapshot('Dashboard — Default State', { widths: [1280, 1920] })
    })
  })
})
