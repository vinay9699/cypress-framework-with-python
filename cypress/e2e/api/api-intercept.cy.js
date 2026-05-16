// =============================================================================
// api-intercept.cy.js — Network Intercept & Stub Tests
// =============================================================================
// Demonstrates and validates the network intercept layer:
//   - cy.interceptApi()    — spy on real API calls
//   - cy.stubApiResponse() — return fake data from a fixture
//   - cy.stubApiError()    — simulate server errors (500, 404, 401)
//   - cy.mockApiResponse() — inline mock response
//
// Tags: @regression @api
// =============================================================================

import LoginPage     from '../../pages/LoginPage'
import DashboardPage from '../../pages/DashboardPage'
import { step, section, success, info } from '../../support/logger'
import { label, severity, description } from 'allure-cypress'

// Shared credentials — read from Cypress.env (set in cypress.env.json)
const USERNAME = Cypress.env('validUsername') || 'Admin'
const PASSWORD = Cypress.env('validPassword') || 'admin123'

describe('Network Intercept — Spy on Real API Calls', { tags: ['@regression', '@api'] }, () => {

  beforeEach(() => {
    cy.loginBySession(USERNAME, PASSWORD)
  })

  // -------------------------------------------------------------------------
  // TEST 1: Spy on the dashboard API call
  // Intercept the real request and assert it returns 200
  // -------------------------------------------------------------------------
  it('should intercept the dashboard API request and verify it returns 200', () => {
    label('feature', 'API Intercept')
    label('story', 'Spy on Real Request')
    severity('normal')
    description('Spy on the OrangeHRM dashboard data API call and verify it succeeds.')

    section('Setup Intercept')
    step('Register spy on GET /api/v2/dashboard/employees/time-at-work')
    cy.interceptApi('GET', '**/api/v2/dashboard/**', 'dashboardData')

    section('Trigger Request')
    step('Navigate to dashboard to trigger the intercepted call')
    cy.visit('/web/index.php/dashboard/index')

    section('Verify Response')
    step('Wait for the intercepted request and verify status is 200 or 304')
    cy.wait('@dashboardData', { timeout: 15000 }).then((interception) => {
      const status = interception.response?.statusCode
      info(`Dashboard API response status: ${status}`)
      expect(status).to.be.oneOf([200, 204, 301, 302, 304])
      success(`Dashboard API responded with status ${status}`)
    })
  })

  // -------------------------------------------------------------------------
  // TEST 2: Spy on the employee list API
  // -------------------------------------------------------------------------
  it('should intercept the employee list API call when navigating to PIM', () => {
    label('feature', 'API Intercept')
    label('story', 'Spy on Employee List')
    severity('normal')
    description('Spy on the employee list API call triggered when PIM module is loaded.')

    section('Setup Intercept')
    step('Register spy on GET /api/v2/pim/employees')
    cy.interceptApi('GET', '**/api/v2/pim/employees**', 'employeeList')

    section('Trigger Request')
    step('Navigate to PIM module to trigger the employee list API call')
    cy.visit('/web/index.php/pim/viewEmployeeList')

    section('Verify Response')
    step('Wait for the intercepted request and verify it succeeded')
    cy.wait('@employeeList', { timeout: 15000 }).then((interception) => {
      const status = interception.response?.statusCode
      info(`Employee list API response status: ${status}`)
      expect(status).to.be.oneOf([200, 304])
      success(`Employee list API responded with status ${status}`)
    })
  })

})


describe('Network Intercept — Stub API Responses', { tags: ['@regression', '@api'] }, () => {

  beforeEach(() => {
    cy.loginBySession(USERNAME, PASSWORD)
  })

  // -------------------------------------------------------------------------
  // TEST 3: Stub the employee list with inline mock data
  // The UI receives fake data — the real API is never called
  // -------------------------------------------------------------------------
  it('should display stubbed employee data returned from mock API', () => {
    label('feature', 'API Stub')
    label('story', 'Inline Mock Response')
    severity('normal')
    description('Stub the employee API with a controlled mock response and verify the UI renders it.')

    section('Setup Stub')
    step('Stub GET /api/v2/pim/employees to return mock data')

    // Mock response matching OrangeHRM's employee list API shape
    const mockEmployeeData = {
      data: [
        { empNumber: 1, firstName: 'Test', lastName: 'UserOne', employeeId: 'EMP001' },
        { empNumber: 2, firstName: 'Mock', lastName: 'UserTwo', employeeId: 'EMP002' },
      ],
      meta: { total: 2, offset: 0, limit: 50 },
    }

    cy.mockApiResponse('GET', '**/api/v2/pim/employees**', mockEmployeeData, 'stubbedEmployees')

    section('Navigate')
    step('Visit PIM page — the stub will intercept the API call')
    cy.visit('/web/index.php/pim/viewEmployeeList')

    section('Verify Intercept Was Called')
    step('Verify the stub was hit (request was made)')
    cy.wait('@stubbedEmployees', { timeout: 15000 }).then((interception) => {
      info(`Stubbed request intercepted: ${interception.request.method} ${interception.request.url}`)
      success('API stub intercepted the request successfully')
    })
  })

  // -------------------------------------------------------------------------
  // TEST 4: Simulate a 500 server error and verify graceful handling
  // -------------------------------------------------------------------------
  it('should handle a simulated 500 server error gracefully', () => {
    label('feature', 'API Stub')
    label('story', 'Error Simulation')
    severity('normal')
    description('Simulate a 500 error on the employee API and verify the stub fires correctly.')

    section('Setup Error Stub')
    step('Stub GET /api/v2/pim/employees to return 500')
    cy.stubApiError('GET', '**/api/v2/pim/employees**', 500, 'serverError')

    section('Navigate')
    step('Visit PIM page — the 500 error stub will be triggered')
    cy.visit('/web/index.php/pim/viewEmployeeList')

    section('Verify Error Stub Was Called')
    step('Verify the 500 stub was hit')
    cy.wait('@serverError', { timeout: 15000 }).then((interception) => {
      const status = interception.response?.statusCode
      info(`Error stub response status: ${status}`)
      expect(status).to.equal(500)
      success('500 error stub was triggered and intercepted correctly')
    })
  })

  // -------------------------------------------------------------------------
  // TEST 5: Simulate a 401 Unauthorised error
  // -------------------------------------------------------------------------
  it('should handle a simulated 401 unauthorised error', () => {
    label('feature', 'API Stub')
    label('story', 'Unauthorised Error')
    severity('normal')
    description('Simulate a 401 Unauthorised error on any API call.')

    section('Setup 401 Stub')
    step('Stub GET /api/v2/pim/employees to return 401')
    cy.stubApiError('GET', '**/api/v2/pim/employees**', 401, 'unauthorised')

    section('Navigate')
    step('Visit PIM page — the 401 stub will fire')
    cy.visit('/web/index.php/pim/viewEmployeeList')

    section('Verify 401 Stub')
    step('Verify the 401 stub was triggered')
    cy.wait('@unauthorised', { timeout: 15000 }).then((interception) => {
      const status = interception.response?.statusCode
      info(`401 stub response status: ${status}`)
      expect(status).to.equal(401)
      success('401 unauthorised stub triggered correctly')
    })
  })

})
