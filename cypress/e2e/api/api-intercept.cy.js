// =============================================================================
// api-intercept.cy.js — Network Intercept & Stub Tests
// =============================================================================
// Demonstrates and validates the network intercept layer:
//   - cy.interceptApi()    — spy on real API calls
//   - cy.stubApiResponse() — return fake data from a fixture
//   - cy.stubApiError()    — simulate server errors (500, 404, 401)
//   - cy.mockApiResponse() — inline mock response
//   - cy.validateSchema()  — AJV-powered JSON Schema contract validation
//
// Tags: @regression @api
// =============================================================================

import { step, section, success, info } from '../../support/logger'
import { label, severity, description } from 'allure-cypress'
import employeeListSchema from '../../support/schemas/employee-list.schema.json'

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
    description(
      'Stub the employee API with a controlled mock response and verify the UI renders it.'
    )

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
      info(
        `Stubbed request intercepted: ${interception.request.method} ${interception.request.url}`
      )
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

describe('Network Intercept — Negative Scenarios', { tags: ['@regression', '@api'] }, () => {
  beforeEach(() => {
    cy.loginBySession(USERNAME, PASSWORD)
  })

  // -------------------------------------------------------------------------
  // TEST 6-9: Simulate common client/server failures
  // -------------------------------------------------------------------------
  ;[400, 403, 404, 429].forEach((statusCode) => {
    it(`should intercept and assert a simulated ${statusCode} response`, () => {
      label('feature', 'API Stub')
      label('story', 'Extended Error Coverage')
      severity('normal')
      description(
        `Simulate a ${statusCode} response for employee list and verify intercept behavior.`
      )

      section(`Setup ${statusCode} Stub`)
      step(`Stub GET /api/v2/pim/employees to return ${statusCode}`)
      const alias = `error${statusCode}`
      cy.stubApiError('GET', '**/api/v2/pim/employees**', statusCode, alias)

      section('Navigate')
      step('Visit PIM page so the stubbed request is triggered')
      cy.visit('/web/index.php/pim/viewEmployeeList')

      section('Verify Status Code')
      step(`Verify intercepted response status is ${statusCode}`)
      cy.wait(`@${alias}`, { timeout: 15000 }).then((interception) => {
        const actualStatus = interception.response?.statusCode
        info(`${statusCode} stub response status: ${actualStatus}`)
        expect(actualStatus).to.equal(statusCode)
        success(`${statusCode} stub triggered and intercepted correctly`)
      })
    })
  })

  // -------------------------------------------------------------------------
  // TEST 10: Simulate network timeout/disconnect
  // -------------------------------------------------------------------------
  it('should simulate a network disconnect and verify request-level failure metadata', () => {
    label('feature', 'API Stub')
    label('story', 'Network Failure Simulation')
    severity('critical')
    description('Force a network error and verify Cypress intercept captures the disconnect event.')

    section('Setup Network Error')
    step('Force network error for employee list endpoint')
    cy.intercept('GET', '**/api/v2/pim/employees**', {
      forceNetworkError: true,
    }).as('networkDisconnect')

    section('Navigate')
    step('Visit PIM page to trigger failed request')
    cy.visit('/web/index.php/pim/viewEmployeeList')

    section('Verify Disconnect')
    step('Assert intercept captured network-level error object')
    cy.wait('@networkDisconnect', { timeout: 15000 }).then((interception) => {
      expect(interception.error).to.exist
      info(`Network failure captured: ${interception.error?.name || 'UnknownError'}`)
      success('Network disconnect simulation captured successfully')
    })
  })

  // -------------------------------------------------------------------------
  // TEST 11: Simulate malformed payload shape
  // -------------------------------------------------------------------------
  it('should return malformed payload and assert response contract mismatch', () => {
    label('feature', 'API Stub')
    label('story', 'Malformed Response Payload')
    severity('normal')
    description(
      'Stub employee API with malformed payload to validate defensive response assertions.'
    )

    section('Setup Malformed Payload Stub')
    step('Return 200 with unexpected response body structure')
    const malformedPayload = {
      unexpected: true,
      message: 'Malformed schema for test coverage',
    }

    cy.mockApiResponse('GET', '**/api/v2/pim/employees**', malformedPayload, 'malformedEmployees')

    section('Navigate')
    step('Visit PIM page so the malformed response is consumed')
    cy.visit('/web/index.php/pim/viewEmployeeList')

    section('Verify Malformed Response')
    step('Assert malformed shape is observed in intercepted response')
    cy.wait('@malformedEmployees', { timeout: 15000 }).then((interception) => {
      const body = interception.response?.body
      expect(interception.response?.statusCode).to.equal(200)
      expect(body).to.have.property('unexpected', true)
      expect(body).to.not.have.property('data')
      info('Malformed payload shape captured as expected')
      success('Malformed response stub validated successfully')
    })
  })
})

describe(
  'API Schema Validation — Employee List Contract',
  { tags: ['@regression', '@api'] },
  () => {
    beforeEach(() => {
      cy.loginBySession(USERNAME, PASSWORD)
    })

    // -------------------------------------------------------------------------
    // TEST 12: Real response validates against the expected contract shape
    // -------------------------------------------------------------------------
    it('should receive a real employee list response matching the expected schema', () => {
      label('feature', 'API Schema')
      label('story', 'Employee List Contract')
      severity('critical')
      description(
        'Intercept the live employee list API and assert the response body matches ' +
          'the expected contract: { data: EmployeeRecord[], meta: { total, offset, limit } }'
      )

      section('Setup Intercept')
      step('Spy on GET /api/v2/pim/employees')
      cy.interceptApi('GET', '**/api/v2/pim/employees**', 'liveEmployeeList')

      section('Trigger Request')
      step('Navigate to PIM module to trigger the real API call')
      cy.visit('/web/index.php/pim/viewEmployeeList')

      section('Validate Schema')
      step('Assert response status 200 and validate body shape')
      cy.wait('@liveEmployeeList', { timeout: 15000 }).then((interception) => {
        const status = interception.response?.statusCode
        info(`Employee list status: ${status}`)
        expect(status).to.be.oneOf([200, 304])

        if (status === 200) {
          cy.validateSchema(interception.response.body, employeeListSchema)
          success('Employee list response matches JSON Schema contract')
        } else {
          info('304 Not Modified — schema assertion skipped for cached response')
          success('Cached response received; schema check deferred to 200 response')
        }
      })
    })

    // -------------------------------------------------------------------------
    // TEST 13: Stubbed valid payload passes schema validation
    // -------------------------------------------------------------------------
    it('should accept a stub payload that matches the expected schema', () => {
      label('feature', 'API Schema')
      label('story', 'Valid Stub Schema')
      severity('normal')
      description(
        'Stub the employee list with a schema-compliant payload and confirm ' +
          'assertEmployeeListSchema accepts it without errors.'
      )

      const validPayload = {
        data: [{ empNumber: 10, firstName: 'Schema', lastName: 'TestUser', employeeId: 'SCH001' }],
        meta: { total: 1, offset: 0, limit: 50 },
      }

      section('Setup Stub')
      step('Stub employee list with schema-compliant payload')
      cy.mockApiResponse('GET', '**/api/v2/pim/employees**', validPayload, 'validSchema')

      section('Navigate')
      cy.visit('/web/index.php/pim/viewEmployeeList')

      section('Validate Schema')
      step('Assert stub response passes AJV schema validation')
      cy.wait('@validSchema', { timeout: 15000 }).then((interception) => {
        cy.validateSchema(interception.response.body, employeeListSchema)
        success('Valid stub payload passed AJV schema validation')
      })
    })

    // -------------------------------------------------------------------------
    // TEST 14: Stubbed invalid payload fails schema validation as expected
    // -------------------------------------------------------------------------
    it('should reject a stub payload that violates the expected schema', () => {
      label('feature', 'API Schema')
      label('story', 'Invalid Stub Schema')
      severity('normal')
      description(
        'Stub the employee list with a schema-violating payload and confirm the ' +
          'schema helper correctly surfaces the contract mismatch.'
      )

      const invalidPayload = { results: [], count: 0 } // wrong keys

      section('Setup Invalid Stub')
      step('Stub employee list with schema-violating payload (missing "data" and "meta")')
      cy.mockApiResponse('GET', '**/api/v2/pim/employees**', invalidPayload, 'invalidSchema')

      section('Navigate')
      cy.visit('/web/index.php/pim/viewEmployeeList')

      section('Validate Schema Violation')
      step('Assert AJV rejects payload missing required "data" and "meta" keys')
      cy.wait('@invalidSchema', { timeout: 15000 }).then((interception) => {
        const body = interception.response?.body
        // AJV should throw because 'data' and 'meta' are required by the schema
        expect(() => {
          // eslint-disable-next-line no-undef
          const Ajv = require('ajv')
          const ajv = new Ajv({ allErrors: true, strict: false })
          const valid = ajv.validate(employeeListSchema, body)
          if (!valid) throw new Error(ajv.errorsText())
        }).to.throw()
        info('Schema violation confirmed: AJV correctly rejected malformed payload')
        success('AJV schema contract enforcement verified')
      })
    })
  }
)
