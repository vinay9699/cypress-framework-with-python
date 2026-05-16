// =============================================================================
// LoginPage.js — Page Object for OrangeHRM Login Page
// URL: https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
// =============================================================================
// Extends BasePage so it inherits all shared methods:
//   navigateTo(), waitForElement(), verifyUrl(), verifyText(), etc.
//
// This file is responsible ONLY for the Login page's own selectors and actions.
// =============================================================================

import BasePage from './BasePage'

class LoginPage extends BasePage {

  // ---------------------------------------------------------------------------
  // SELECTORS
  // Each getter returns a Cypress chainable for that element.
  // Keeping selectors here means if the HTML changes, you fix it in ONE place.
  // ---------------------------------------------------------------------------

  /** Username text input */
  get usernameInput() {
    return cy.get('[name="username"]')
  }

  /** Password text input */
  get passwordInput() {
    return cy.get('[name="password"]')
  }

  /** Login submit button */
  get loginButton() {
    return cy.get('[type="submit"]')
  }

  /** Red error alert shown when credentials are wrong */
  get errorAlert() {
    return cy.get('.oxd-alert-content-text')
  }

  /** "Required" validation messages shown under empty fields */
  get validationMessages() {
    return cy.get('.oxd-input-field-error-message')
  }

  /** OrangeHRM logo image on the login page */
  get orangeHrmLogo() {
    return cy.get('.orangehrm-login-logo img')
  }

  /** "Forgot your password?" link */
  get forgotPasswordLink() {
    return cy.get('.orangehrm-login-forgot p')
  }

  // ---------------------------------------------------------------------------
  // ACTIONS — what a user CAN DO on this page
  // ---------------------------------------------------------------------------

  /**
   * Navigate to the OrangeHRM login page.
   * Inherits navigateTo() from BasePage.
   */
  visit() {
    this.navigateTo('/web/index.php/auth/login')
  }

  /**
   * Type into the username field.
   * @param {string} username
   */
  enterUsername(username) {
    this.usernameInput.clear().type(username)
  }

  /**
   * Type into the password field.
   * @param {string} password
   */
  enterPassword(password) {
    this.passwordInput.clear().type(password)
  }

  /**
   * Click the Login submit button.
   */
  clickLogin() {
    this.loginButton.click()
  }

  /**
   * Full login — enter username + password + click login button.
   * Use this in tests as a single clean one-liner.
   * @param {string} username
   * @param {string} password
   */
  login(username, password) {
    this.enterUsername(username)
    this.enterPassword(password)
    this.clickLogin()
  }

  /**
   * Click the "Forgot your password?" link.
   */
  clickForgotPassword() {
    this.forgotPasswordLink.click()
  }

  // ---------------------------------------------------------------------------
  // ASSERTIONS — what you can VERIFY on this page
  // Grouping assertions into named methods keeps test files clean and readable.
  // Instead of repeating cy.get(...).should(...) in every test,
  // you call a single descriptive method.
  // ---------------------------------------------------------------------------

  /**
   * Assert the login page has fully loaded with all expected elements visible.
   * Use this as your first check in any login page test.
   */
  verifyPageLoaded() {
    this.verifyUrl('/auth/login')
    this.orangeHrmLogo.should('be.visible')
    this.usernameInput.should('be.visible')
    this.passwordInput.should('be.visible')
    this.loginButton.should('be.visible')
  }

  /**
   * Assert the error alert is visible and contains the expected message.
   * @param {string} message - expected error text (default: 'Invalid credentials')
   */
  verifyErrorMessage(message = 'Invalid credentials') {
    this.errorAlert
      .should('be.visible')
      .and('contain.text', message)
  }

  /**
   * Assert that validation messages appear under empty required fields.
   * @param {number} count - expected number of validation messages (default: 2)
   */
  verifyValidationMessages(count = 2) {
    this.validationMessages
      .should('have.length', count)
      .each(($msg) => {
        expect($msg.text().trim()).to.equal('Required')
      })
  }

  /**
   * Assert the login button is visible and has the correct label.
   * @param {string} label - expected button text (default: 'Login')
   */
  verifyLoginButtonLabel(label = 'Login') {
    this.loginButton
      .should('be.visible')
      .and('contain.text', label)
  }

  /**
   * Assert that the user is still on the login page (login was blocked).
   * Combines URL check + login button visibility in one call.
   */
  verifyStillOnLoginPage() {
    this.verifyUrl('/auth/login')
    this.loginButton.should('be.visible')
  }
}

export default new LoginPage()
