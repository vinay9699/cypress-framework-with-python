// =============================================================================
// login.cy.js — Login Tests for OrangeHRM Demo
// App: https://opensource-demo.orangehrmlive.com
// =============================================================================
// Tags:
//   @smoke      — fast critical path tests run on every deployment
//   @regression — full suite run on every release candidate
//   @login      — all login-related tests
// =============================================================================

import LoginPage    from '../../pages/LoginPage'
import DashboardPage from '../../pages/DashboardPage'
import { step, section, data, success } from '../../support/logger'
import { label, severity, description } from 'allure-cypress'

// Load test data from fixtures/users.json ONCE before the entire suite
let users

before(() => {
  cy.fixture('users').then((d) => { users = d })
})

describe('OrangeHRM — Login Page', { tags: ['@regression', '@login'] }, () => {

  beforeEach(() => {
    cy.clearSession()
    LoginPage.visit()
  })

  // -------------------------------------------------------------------------
  // TEST 1: Page load — @smoke
  // -------------------------------------------------------------------------
  it('should display the login form correctly on page load',
    { tags: ['@smoke'] },
    () => {
      label('feature', 'Login')
      label('story', 'Page Load')
      severity('critical')
      description('Verifies the login page renders all required elements on first load.')

      section('Page Load Verification')
      step('Verify URL contains /auth/login')
      step('Verify logo, username, password and button are visible')
      LoginPage.verifyPageLoaded()

      step('Verify login button label is "Login"')
      LoginPage.verifyLoginButtonLabel('Login')

      step('Verify forgot password link is visible')
      LoginPage.forgotPasswordLink.should('be.visible')
      success('Login page loaded with all elements present')
    }
  )

  // -------------------------------------------------------------------------
  // TEST 2: Successful login — @smoke
  // -------------------------------------------------------------------------
  it('should log in successfully with valid credentials',
    { tags: ['@smoke'] },
    () => {
      label('feature', 'Login')
      label('story', 'Valid Login')
      severity('blocker')
      description('Happy path — valid credentials should redirect to the dashboard.')

      const { username, password, name } = users.validUser

      section('Login with Valid Credentials')
      step('Enter valid username and password')
      data('username', username)
      data('password', password)
      LoginPage.login(username, password)

      step('Verify dashboard URL and top bar are visible')
      DashboardPage.verifyLoaded()

      step('Verify logged-in user display name is visible')
      DashboardPage.verifyLoggedInUser(name)

      step('Verify sidebar navigation is visible')
      DashboardPage.verifySidebarVisible()
      success('User logged in and dashboard loaded correctly')
    }
  )

  // -------------------------------------------------------------------------
  // TEST 3: Invalid credentials — @smoke
  // -------------------------------------------------------------------------
  it('should show an error alert with invalid credentials',
    { tags: ['@smoke'] },
    () => {
      label('feature', 'Login')
      label('story', 'Invalid Credentials')
      severity('critical')
      description('Sad path — invalid credentials should show an error alert and keep the user on the login page.')

      const { username, password } = users.invalidUser

      section('Login with Invalid Credentials')
      step('Enter invalid username and password')
      data('username', username)
      data('password', password)
      LoginPage.login(username, password)

      step('Verify error alert is visible with correct message')
      LoginPage.verifyErrorMessage('Invalid credentials')

      step('Verify user is still on the login page')
      LoginPage.verifyStillOnLoginPage()
      success('Error message displayed and user remains on login page')
    }
  )

  // -------------------------------------------------------------------------
  // TEST 4: Empty form — @regression
  // -------------------------------------------------------------------------
  it('should show Required validation messages when fields are empty',
    () => {
      label('feature', 'Login')
      label('story', 'Form Validation')
      severity('normal')
      description('Submitting an empty form should show 2 Required messages, one per field.')

      section('Empty Form Submission')
      step('Click Login without entering any credentials')
      LoginPage.clickLogin()

      step('Verify exactly 2 Required validation messages appear')
      LoginPage.verifyValidationMessages(2)

      step('Verify user is still on the login page')
      LoginPage.verifyStillOnLoginPage()
      success('Two Required messages displayed for empty form')
    }
  )

  // -------------------------------------------------------------------------
  // TEST 5: Missing password — @regression
  // -------------------------------------------------------------------------
  it('should show a single Required message when only password is empty',
    () => {
      label('feature', 'Login')
      label('story', 'Form Validation')
      severity('minor')
      description('Entering username but leaving password empty should show exactly 1 Required message.')

      const { username } = users.validUser

      section('Partial Form Submission')
      step('Enter username only, leave password empty')
      data('username', username)
      LoginPage.enterUsername(username)

      step('Click Login without password')
      LoginPage.clickLogin()

      step('Verify exactly 1 Required message appears (password field only)')
      LoginPage.verifyValidationMessages(1)
      success('Single Required message shown for missing password')
    }
  )

  // -------------------------------------------------------------------------
  // TEST 6: Forgot password navigation — @regression
  // -------------------------------------------------------------------------
  it('should navigate to the Forgot Password page',
    () => {
      label('feature', 'Login')
      label('story', 'Forgot Password')
      severity('normal')
      description('Clicking "Forgot your password?" should navigate to the password reset page.')

      section('Forgot Password Navigation')
      step('Click the Forgot Password link')
      LoginPage.clickForgotPassword()

      step('Verify URL contains /requestPasswordResetCode')
      LoginPage.verifyUrl('/requestPasswordResetCode')

      step('Verify Reset Password heading is visible')
      cy.get('h6').should('contain.text', 'Reset Password')
      success('Navigated to Forgot Password page successfully')
    }
  )

  // -------------------------------------------------------------------------
  // TEST 7: Logout — @smoke
  // -------------------------------------------------------------------------
  it('should log out successfully and return to login page',
    { tags: ['@smoke'] },
    () => {
      label('feature', 'Login')
      label('story', 'Logout')
      severity('critical')
      description('Logging out via the user dropdown should redirect back to the login page.')

      const { username, password } = users.validUser

      section('Login')
      step('Log in with valid credentials')
      data('username', username)
      data('password', password)
      LoginPage.login(username, password)
      DashboardPage.verifyLoaded()

      section('Logout')
      step('Click user dropdown and select Logout')
      DashboardPage.logout()

      step('Verify login page is shown after logout')
      LoginPage.verifyPageLoaded()
      success('User logged out and returned to login page')
    }
  )

  // -------------------------------------------------------------------------
  // TEST 8: Page title — @regression
  // -------------------------------------------------------------------------
  it('should have the correct browser tab title',
    () => {
      label('feature', 'Login')
      label('story', 'Page Title')
      severity('minor')
      description('The browser tab title should contain "OrangeHRM".')

      section('Browser Tab Title')
      step('Verify browser tab title contains "OrangeHRM"')
      LoginPage.verifyPageTitle('OrangeHRM')
      success('Page title verified')
    }
  )

})
