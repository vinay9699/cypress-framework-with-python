// =============================================================================
// commands.js — Custom Cypress Commands
// =============================================================================
// All commands defined here are globally available as cy.<commandName>()
// in EVERY test file across the entire framework — no import needed.
//
// Commands are grouped into these categories:
//   1.  AUTHENTICATION     — login (UI), loginBySession, logout, clearSession
//   2.  NAVIGATION         — visit with query params, open in new tab
//   3.  WAITING            — wait for page load, API response, spinner
//   4.  FORMS              — fill form by object, select OXD dropdown
//   5.  API REQUESTS       — GET, POST, PUT, PATCH, DELETE helpers
//   6.  NETWORK INTERCEPT  — stub/spy on API calls, wait for requests
//   7.  NOTIFICATIONS      — verify toast messages
//   8.  TABLES             — row count, find row by text
//   9.  SEARCH             — type and search with debounce
//   10. STORAGE & COOKIES  — localStorage helpers
//   11. RESPONSIVE         — set viewport to common device sizes
//   12. ACCESSIBILITY      — basic a11y assertions
//   13. PERFORMANCE        — measure page load timing
//   14. UTILITIES          — getByDataCy, getByLabel, getByPlaceholder
// =============================================================================


// =============================================================================
// 1. AUTHENTICATION
// =============================================================================

/**
 * cy.login(username, password)
 *
 * Logs into OrangeHRM through the UI by filling the form.
 * Use ONLY when you are testing the login feature itself.
 * For all other tests, use cy.loginBySession() which is 10x faster.
 *
 * Usage: cy.login('Admin', 'admin123')
 */
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/web/index.php/auth/login')
  cy.get('[name="username"]').clear().type(username)
  cy.get('[name="password"]').clear().type(password)
  cy.get('[type="submit"]').click()
  cy.url().should('include', '/dashboard/index')
})

/**
 * cy.loginBySession(username, password)
 *
 * Logs in using Cypress Sessions — the recommended approach for ALL
 * test suites where login is just a PRECONDITION (not what you're testing).
 *
 * HOW IT WORKS:
 *   - First call: logs in via UI and caches the entire browser session
 *     (cookies + localStorage + sessionStorage).
 *   - Subsequent calls with same credentials: instantly restores the cached
 *     session — no form filling, no page load.
 *   - Different credentials = different cache key = separate session.
 *
 * Usage in beforeEach:
 *   beforeEach(() => { cy.loginBySession('Admin', 'admin123') })
 */
Cypress.Commands.add('loginBySession', (username, password) => {
  cy.session(
    [username, password],
    () => {
      cy.visit('/web/index.php/auth/login')
      cy.get('[name="username"]').clear().type(username)
      cy.get('[name="password"]').clear().type(password)
      cy.get('[type="submit"]').click()
      cy.url().should('include', '/dashboard/index')
    },
    {
      validate() {
        cy.visit('/web/index.php/dashboard/index')
        cy.url().should('include', '/dashboard/index')
      },
    }
  )
})

/**
 * cy.logout()
 *
 * Logs out of OrangeHRM via the user dropdown menu.
 * After calling this, the browser should redirect to the login page.
 *
 * Usage: cy.logout()
 */
Cypress.Commands.add('logout', () => {
  cy.get('.oxd-userdropdown-tab').click()
  cy.contains('.oxd-userdropdown-link', 'Logout').click()
  cy.url().should('include', '/auth/login')
})

/**
 * cy.clearSession()
 *
 * Wipes ALL browser storage: cookies, localStorage, sessionStorage.
 * Call this in beforeEach() of login tests to guarantee a clean slate.
 *
 * Usage: beforeEach(() => { cy.clearSession() })
 */
Cypress.Commands.add('clearSession', () => {
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.window().then((win) => win.sessionStorage.clear())
})


// =============================================================================
// 2. NAVIGATION
// =============================================================================

/**
 * cy.visitWithParams(path, params)
 *
 * Navigate to a URL path with query string parameters.
 * Automatically builds the query string from the params object.
 *
 * Usage: cy.visitWithParams('/search', { q: 'John', page: 2 })
 *        → visits /search?q=John&page=2
 *
 * @param {string} path   - URL path
 * @param {object} params - key/value query parameters
 */
Cypress.Commands.add('visitWithParams', (path, params) => {
  const query = new URLSearchParams(params).toString()
  cy.visit(`${path}?${query}`)
})


// =============================================================================
// 3. WAITING
// =============================================================================

/**
 * cy.waitForPageLoad()
 *
 * Waits for OrangeHRM's loading spinner to disappear.
 * Call this after any navigation that shows the spinner before content loads.
 *
 * Usage:
 *   cy.visit('/some/page')
 *   cy.waitForPageLoad()
 */
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('.oxd-loading-spinner', { timeout: 15000 }).should('not.exist')
})

/**
 * cy.waitForApiResponse(alias)
 *
 * Wait for a previously intercepted API request to complete.
 * Must be used AFTER cy.interceptApi() sets up the intercept.
 *
 * Usage:
 *   cy.interceptApi('GET', '/api/employees', 'getEmployees')
 *   cy.visit('/pim')
 *   cy.waitForApiResponse('@getEmployees')
 *
 * @param {string} alias - the intercept alias (with @ prefix)
 */
Cypress.Commands.add('waitForApiResponse', (alias) => {
  cy.wait(alias).its('response.statusCode').should('be.oneOf', [200, 201])
})


// =============================================================================
// 4. FORMS
// =============================================================================

/**
 * cy.fillForm(formData)
 *
 * Fill in multiple form fields in a single call using an object.
 * Each key is a CSS selector, each value is the text to type.
 * Much cleaner than writing cy.get().type() for every field individually.
 *
 * Usage:
 *   cy.fillForm({
 *     '[name="firstName"]': 'John',
 *     '[name="lastName"]':  'Smith',
 *     '[name="jobTitle"]':  'Engineer',
 *   })
 *
 * @param {object} formData - { selector: value } pairs
 */
Cypress.Commands.add('fillForm', (formData) => {
  Object.entries(formData).forEach(([selector, value]) => {
    cy.get(selector).clear().type(value)
  })
})

/**
 * cy.selectOxdDropdown(containerSelector, optionText)
 *
 * Select an option from OrangeHRM's custom Vue .oxd-select dropdown.
 * These are NOT native <select> elements. They require:
 *   1. A click to open the dropdown list
 *   2. A click on the desired option
 *
 * Usage: cy.selectOxdDropdown('.oxd-select-wrapper', 'Full Time')
 *
 * @param {string} containerSelector - selector wrapping the oxd-select
 * @param {string} optionText        - visible text of the option to select
 */
Cypress.Commands.add('selectOxdDropdown', (containerSelector, optionText) => {
  cy.get(containerSelector).click()
  cy.get('.oxd-select-dropdown')
    .should('be.visible')
    .contains(optionText)
    .click()
})

/**
 * cy.clearAndType(selector, text)
 *
 * Clear a field and type new text — combines two operations into one command.
 * Shorthand for the very common clear().type() pattern.
 *
 * Usage: cy.clearAndType('[name="username"]', 'Admin')
 *
 * @param {string} selector - CSS selector
 * @param {string} text     - text to type after clearing
 */
Cypress.Commands.add('clearAndType', (selector, text) => {
  cy.get(selector).clear().type(text)
})


// =============================================================================
// 5. API REQUESTS
// =============================================================================

/**
 * cy.apiGet(url, options)
 *
 * Make an authenticated HTTP GET request.
 * Reads the auth token from localStorage and adds it to the Authorization header.
 * Use this for test setup/teardown (creating or reading data via API).
 *
 * Usage:
 *   cy.apiGet('/api/v2/pim/employees').then(response => {
 *     expect(response.status).to.eq(200)
 *   })
 *
 * @param {string} url     - API endpoint path (relative to baseUrl)
 * @param {object} options - additional cy.request() options
 */
Cypress.Commands.add('apiGet', (url, options = {}) => {
  cy.window().then((win) => {
    const token = win.localStorage.getItem('authToken') || ''
    cy.request({
      method: 'GET',
      url,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
      ...options,
    })
  })
})

/**
 * cy.apiPost(url, body, options)
 *
 * Make an authenticated HTTP POST request.
 * Use this to create test data via API (faster and more reliable than UI).
 *
 * Usage:
 *   cy.apiPost('/api/v2/pim/employees', { firstName: 'John', lastName: 'Doe' })
 *     .then(response => { expect(response.status).to.eq(200) })
 *
 * @param {string} url     - API endpoint path
 * @param {object} body    - request body
 * @param {object} options - additional cy.request() options
 */
Cypress.Commands.add('apiPost', (url, body, options = {}) => {
  cy.window().then((win) => {
    const token = win.localStorage.getItem('authToken') || ''
    cy.request({
      method: 'POST',
      url,
      headers: { Authorization: `Bearer ${token}` },
      body,
      failOnStatusCode: false,
      ...options,
    })
  })
})

/**
 * cy.apiPut(url, body, options)
 *
 * Make an authenticated HTTP PUT request.
 * Use this to update existing data via API during test setup.
 *
 * @param {string} url     - API endpoint path
 * @param {object} body    - request body
 * @param {object} options - additional cy.request() options
 */
Cypress.Commands.add('apiPut', (url, body, options = {}) => {
  cy.window().then((win) => {
    const token = win.localStorage.getItem('authToken') || ''
    cy.request({
      method: 'PUT',
      url,
      headers: { Authorization: `Bearer ${token}` },
      body,
      failOnStatusCode: false,
      ...options,
    })
  })
})

/**
 * cy.apiDelete(url, options)
 *
 * Make an authenticated HTTP DELETE request.
 * Use this in afterEach/after hooks to clean up test data created during tests.
 *
 * Usage: cy.apiDelete('/api/v2/pim/employees/123')
 *
 * @param {string} url     - API endpoint path
 * @param {object} options - additional cy.request() options
 */
Cypress.Commands.add('apiDelete', (url, options = {}) => {
  cy.window().then((win) => {
    const token = win.localStorage.getItem('authToken') || ''
    cy.request({
      method: 'DELETE',
      url,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
      ...options,
    })
  })
})


// =============================================================================
// 6. NETWORK INTERCEPT
// =============================================================================

/**
 * cy.interceptApi(method, urlPattern, alias)
 *
 * Set up a network spy on a specific API request.
 * After calling this, use cy.waitForApiResponse('@alias') to wait for the
 * request to complete before making assertions on the response data.
 *
 * Usage:
 *   cy.interceptApi('GET', '/api/v2/pim/employees**', 'employees')
 *   cy.visit('/web/index.php/pim/viewEmployeeList')
 *   cy.waitForApiResponse('@employees')
 *
 * @param {string} method      - HTTP method: 'GET', 'POST', 'PUT', 'DELETE'
 * @param {string} urlPattern  - URL pattern to match (supports glob: **)
 * @param {string} alias       - alias name to reference later (without @)
 */
Cypress.Commands.add('interceptApi', (method, urlPattern, alias) => {
  cy.intercept(method, urlPattern).as(alias)
})

/**
 * cy.stubApiResponse(method, urlPattern, fixture, alias)
 *
 * Intercept an API call and return a FAKE response from a fixture file
 * instead of hitting the real server.
 *
 * WHY USE THIS:
 *   - Tests that depend on unstable APIs or third-party services
 *   - Testing error handling by returning 500 or 404 responses
 *   - Making tests run faster and more deterministic
 *
 * Usage:
 *   cy.stubApiResponse('GET', '/api/employees**', 'employees.json', 'employees')
 *   // Now any GET to /api/employees returns the data in fixtures/employees.json
 *
 * @param {string} method      - HTTP method
 * @param {string} urlPattern  - URL pattern to intercept
 * @param {string} fixture     - fixture filename in cypress/fixtures/
 * @param {string} alias       - alias name (without @)
 */
Cypress.Commands.add('stubApiResponse', (method, urlPattern, fixture, alias) => {
  cy.intercept(method, urlPattern, { fixture }).as(alias)
})

/**
 * cy.stubApiError(method, urlPattern, statusCode, alias)
 *
 * Intercept an API call and force it to return an HTTP error response.
 * Use this to test how your UI handles server errors (500, 404, 401, etc.).
 *
 * Usage:
 *   cy.stubApiError('GET', '/api/employees**', 500, 'serverError')
 *   cy.visit('/employees')
 *   cy.get('.error-banner').should('be.visible')
 *
 * @param {string} method      - HTTP method
 * @param {string} urlPattern  - URL pattern to intercept
 * @param {number} statusCode  - HTTP status code to return (e.g. 500, 404, 401)
 * @param {string} alias       - alias name (without @)
 */
Cypress.Commands.add('stubApiError', (method, urlPattern, statusCode, alias) => {
  cy.intercept(method, urlPattern, {
    statusCode,
    body: { error: `Simulated ${statusCode} error` },
  }).as(alias)
})


// =============================================================================
// 7. NOTIFICATIONS / TOASTS
// =============================================================================

/**
 * cy.verifyToast(expectedMessage)
 *
 * Assert that OrangeHRM's toast notification appears with the expected text,
 * then wait for it to disappear automatically.
 *
 * OrangeHRM shows green toasts after: Save, Update, Delete, Submit.
 * The toast auto-dismisses after ~3 seconds.
 *
 * Usage:
 *   cy.verifyToast('Successfully Saved')
 *   cy.verifyToast('Successfully Deleted')
 *
 * @param {string} expectedMessage - text the toast should contain
 */
Cypress.Commands.add('verifyToast', (expectedMessage) => {
  cy.get('.oxd-toast-content', { timeout: 8000 })
    .should('be.visible')
    .and('contain.text', expectedMessage)

  cy.get('.oxd-toast-content', { timeout: 8000 }).should('not.exist')
})

/**
 * cy.verifyToastType(toastType)
 *
 * Assert the TYPE of toast shown (success = green, error = red, warn = yellow).
 * Use this to verify the correct category of feedback is shown.
 *
 * Usage:
 *   cy.verifyToastType('success')
 *   cy.verifyToastType('error')
 *
 * OrangeHRM toast type classes:
 *   success → .oxd-toast--success
 *   error   → .oxd-toast--error
 *   warn    → .oxd-toast--warn
 *   info    → .oxd-toast--info
 *
 * @param {string} toastType - 'success' | 'error' | 'warn' | 'info'
 */
Cypress.Commands.add('verifyToastType', (toastType) => {
  cy.get(`.oxd-toast--${toastType}`, { timeout: 8000 }).should('be.visible')
})


// =============================================================================
// 8. TABLES
// =============================================================================

/**
 * cy.verifyTableRowCount(expectedCount)
 *
 * Assert the exact number of data rows in OrangeHRM's result table.
 * Use after a search to confirm the correct number of records are returned.
 *
 * Usage: cy.verifyTableRowCount(5)
 *
 * @param {number} expectedCount - expected number of table rows
 */
Cypress.Commands.add('verifyTableRowCount', (expectedCount) => {
  cy.get('.oxd-table-body .oxd-table-row').should('have.length', expectedCount)
})

/**
 * cy.verifyTableIsEmpty()
 *
 * Assert the table shows a "No Records Found" state.
 * Use this after a search that should return zero results.
 *
 * Usage: cy.verifyTableIsEmpty()
 */
Cypress.Commands.add('verifyTableIsEmpty', () => {
  cy.get('.oxd-table-body').contains('No Records Found').should('be.visible')
})

/**
 * cy.getTableRowByText(text)
 *
 * Find the table row that contains a specific piece of text.
 * Use this to locate a specific record in the results table without
 * knowing its row index.
 *
 * Usage:
 *   cy.getTableRowByText('John Smith').find('.oxd-icon-button').first().click()
 *
 * @param {string} text - text to search for in the table rows
 */
Cypress.Commands.add('getTableRowByText', (text) => {
  return cy.get('.oxd-table-body .oxd-table-row').contains(text).parents('.oxd-table-row')
})


// =============================================================================
// 9. SEARCH
// =============================================================================

/**
 * cy.typeAndSearch(inputSelector, searchText)
 *
 * Type into a live-search/autocomplete field and wait for results to appear.
 * OrangeHRM search fields debounce API calls while you type — the small
 * wait ensures the results have loaded before your test continues.
 *
 * Usage: cy.typeAndSearch('[name="employeeName"] input', 'John')
 *
 * @param {string} inputSelector - CSS selector for the search input
 * @param {string} searchText    - text to search for
 */
Cypress.Commands.add('typeAndSearch', (inputSelector, searchText) => {
  cy.get(inputSelector).clear().type(searchText)
  cy.wait(500)
})


// =============================================================================
// 10. STORAGE
// =============================================================================

/**
 * cy.setLocalStorage(key, value)
 *
 * Set a key/value pair in the browser's localStorage.
 * Use this to inject feature flags, tokens, or preferences before a test.
 *
 * Usage: cy.setLocalStorage('featureFlag_darkMode', 'true')
 *
 * @param {string} key   - localStorage key
 * @param {string} value - value to store
 */
Cypress.Commands.add('setLocalStorage', (key, value) => {
  cy.window().then((win) => win.localStorage.setItem(key, value))
})

/**
 * cy.getLocalStorage(key)
 *
 * Read a value from localStorage and return it as a Cypress chainable.
 *
 * Usage:
 *   cy.getLocalStorage('authToken').then(token => {
 *     expect(token).to.not.be.null
 *   })
 *
 * @param {string} key - localStorage key to read
 */
Cypress.Commands.add('getLocalStorage', (key) => {
  return cy.window().its(`localStorage.${key}`)
})


// =============================================================================
// 11. RESPONSIVE / VIEWPORT
// =============================================================================

/**
 * cy.setViewportMobile()
 *
 * Set the browser viewport to iPhone 14 dimensions.
 * Use this to test the mobile-responsive version of your app.
 *
 * Usage: cy.setViewportMobile()
 */
Cypress.Commands.add('setViewportMobile', () => {
  cy.viewport(390, 844)   // iPhone 14
})

/**
 * cy.setViewportTablet()
 *
 * Set the browser viewport to iPad Air dimensions.
 *
 * Usage: cy.setViewportTablet()
 */
Cypress.Commands.add('setViewportTablet', () => {
  cy.viewport(820, 1180)  // iPad Air
})

/**
 * cy.setViewportDesktop()
 *
 * Reset the browser viewport to standard HD desktop dimensions.
 *
 * Usage: cy.setViewportDesktop()
 */
Cypress.Commands.add('setViewportDesktop', () => {
  cy.viewport(1280, 720)
})

/**
 * cy.setViewportWidescreen()
 *
 * Set the browser viewport to full 1920x1080 widescreen.
 *
 * Usage: cy.setViewportWidescreen()
 */
Cypress.Commands.add('setViewportWidescreen', () => {
  cy.viewport(1920, 1080)
})


// =============================================================================
// 12. ACCESSIBILITY
// =============================================================================

/**
 * cy.verifyAriaLabel(selector, expectedLabel)
 *
 * Assert that an element has the correct aria-label attribute.
 * Screen readers use aria-label to describe elements to visually impaired users.
 *
 * Usage: cy.verifyAriaLabel('.close-button', 'Close dialog')
 *
 * @param {string} selector      - CSS selector
 * @param {string} expectedLabel - expected aria-label value
 */
Cypress.Commands.add('verifyAriaLabel', (selector, expectedLabel) => {
  cy.get(selector).should('have.attr', 'aria-label', expectedLabel)
})

/**
 * cy.verifyRole(selector, expectedRole)
 *
 * Assert that an element has the correct ARIA role attribute.
 * Roles tell assistive technologies what type of element this is.
 *
 * Usage: cy.verifyRole('.nav-menu', 'navigation')
 *        cy.verifyRole('.alert-banner', 'alert')
 *
 * @param {string} selector     - CSS selector
 * @param {string} expectedRole - expected role attribute value
 */
Cypress.Commands.add('verifyRole', (selector, expectedRole) => {
  cy.get(selector).should('have.attr', 'role', expectedRole)
})

/**
 * cy.verifyTabOrder(selectors)
 *
 * Verify that pressing Tab moves focus through elements in the expected order.
 * Important for keyboard-only users and accessibility compliance.
 *
 * Usage:
 *   cy.verifyTabOrder([
 *     '[name="username"]',
 *     '[name="password"]',
 *     '[type="submit"]',
 *   ])
 *
 * @param {string[]} selectors - ordered array of CSS selectors
 */
Cypress.Commands.add('verifyTabOrder', (selectors) => {
  cy.get(selectors[0]).focus()
  selectors.forEach((selector, index) => {
    cy.focused().should('match', selector)
    if (index < selectors.length - 1) {
      cy.focused().type('{tab}')
    }
  })
})


// =============================================================================
// 13. PERFORMANCE
// =============================================================================

/**
 * cy.measurePageLoadTime(path, maxMs)
 *
 * Navigate to a page and measure how long it takes to load.
 * Fails the test if the page takes longer than maxMs milliseconds.
 *
 * This uses the browser's window.performance API to get accurate timing.
 * The assertion gives you a baseline performance benchmark in your tests.
 *
 * Usage:
 *   cy.measurePageLoadTime('/web/index.php/dashboard/index', 5000)
 *   // Fails if dashboard takes more than 5 seconds to load
 *
 * @param {string} path  - URL path to visit and measure
 * @param {number} maxMs - maximum acceptable load time in milliseconds
 */
Cypress.Commands.add('measurePageLoadTime', (path, maxMs = 5000) => {
  cy.visit(path)
  cy.window().then((win) => {
    const { loadEventEnd, navigationStart } = win.performance.timing
    const loadTime = loadEventEnd - navigationStart
    cy.log(`Page load time: ${loadTime}ms`)
    expect(loadTime).to.be.lessThan(maxMs)
  })
})


// =============================================================================
// 14. UTILITIES — element finders
// =============================================================================

/**
 * cy.getByDataCy(selector)
 *
 * Shorthand for cy.get('[data-cy="..."]').
 * Enforces consistent use of data-cy test attributes across the project.
 *
 * Usage: cy.getByDataCy('submit-button').click()
 *
 * @param {string} selector - value of the data-cy attribute (without quotes or brackets)
 */
Cypress.Commands.add('getByDataCy', (selector) => {
  return cy.get(`[data-cy="${selector}"]`)
})

/**
 * cy.getByLabel(labelText)
 *
 * Find a form input element by the text of its associated <label>.
 * More robust than using CSS selectors because it tests the real
 * accessible name of the field — exactly how a screen reader finds it.
 *
 * Usage: cy.getByLabel('Username').type('Admin')
 *
 * @param {string} labelText - visible text of the label element
 */
Cypress.Commands.add('getByLabel', (labelText) => {
  return cy.contains('label', labelText)
    .invoke('attr', 'for')
    .then((id) => cy.get(`#${id}`))
})

/**
 * cy.getByPlaceholder(placeholderText)
 *
 * Find an input by its placeholder attribute text.
 * Useful when elements lack other stable identifiers.
 *
 * Usage: cy.getByPlaceholder('Search').type('John')
 *
 * @param {string} placeholderText - placeholder text of the input
 */
Cypress.Commands.add('getByPlaceholder', (placeholderText) => {
  return cy.get(`[placeholder="${placeholderText}"]`)
})

/**
 * cy.getByTestId(testId)
 *
 * Find an element by its data-testid attribute.
 * data-testid is an alternative convention to data-cy used in
 * React Testing Library and some other frameworks.
 *
 * Usage: cy.getByTestId('login-form').should('be.visible')
 *
 * @param {string} testId - value of the data-testid attribute
 */
Cypress.Commands.add('getByTestId', (testId) => {
  return cy.get(`[data-testid="${testId}"]`)
})


// =============================================================================
// 15. AUTHENTICATION — ADDITIONAL
// =============================================================================

/**
 * cy.loginViaUI(username, password)
 *
 * Alias for cy.login() — logs in through the browser UI form.
 * Use when testing the login feature itself.
 *
 * Usage: cy.loginViaUI('Admin', 'admin123')
 */
Cypress.Commands.add('loginViaUI', (username, password) => {
  cy.visit('/web/index.php/auth/login')
  cy.get('[name="username"]').clear().type(username)
  cy.get('[name="password"]').clear().type(password)
  cy.get('[type="submit"]').click()
  cy.url().should('include', '/dashboard/index')
})

/**
 * cy.loginViaApi(username, password)
 *
 * Log in by calling OrangeHRM's auth API directly, then inject the returned
 * token into localStorage so the app treats the browser as authenticated.
 *
 * WHY USE THIS:
 *   - Bypasses the login UI entirely — much faster
 *   - No risk of UI login tests interfering with each other
 *   - Ideal for test setup in non-login test suites
 *
 * Usage: cy.loginViaApi('Admin', 'admin123')
 *
 * @param {string} username
 * @param {string} password
 */
Cypress.Commands.add('loginViaApi', (username, password) => {
  cy.request({
    method: 'POST',
    url: '/web/index.php/auth/validate',
    form: true,
    body: { _username: username, _password: password },
    failOnStatusCode: false,
  }).then((response) => {
    // Store any returned token or cookie for subsequent requests
    if (response.body && response.body.token) {
      cy.saveAuthToken(response.body.token)
    }
    cy.log(`[loginViaApi] Status: ${response.status}`)
  })
})

/**
 * cy.saveAuthToken(token)
 *
 * Persist an authentication token to localStorage and as a Cypress env variable.
 * Call this after a programmatic login to make the token available to all
 * subsequent API calls (apiGet, apiPost, etc.) in the same test session.
 *
 * Usage: cy.saveAuthToken('eyJhbGciOiJIUzI1NiJ9...')
 *
 * @param {string} token - the bearer token to store
 */
Cypress.Commands.add('saveAuthToken', (token) => {
  cy.window().then((win) => {
    win.localStorage.setItem('authToken', token)
  })
  Cypress.env('authToken', token)
  cy.log('[saveAuthToken] Token saved to localStorage and Cypress.env')
})

/**
 * cy.getAuthToken()
 *
 * Retrieve the stored auth token from localStorage.
 * Returns a Cypress chainable — use .then(token => ...) to access the value.
 *
 * Usage:
 *   cy.getAuthToken().then(token => {
 *     expect(token).to.not.be.null
 *   })
 */
Cypress.Commands.add('getAuthToken', () => {
  return cy.window().its('localStorage.authToken')
})


// =============================================================================
// 16. NETWORK ALIASES — matching the standard method name list
// =============================================================================

/**
 * cy.interceptRequest(method, url, alias)
 *
 * Alias for cy.interceptApi() — same behaviour, standard naming.
 *
 * Usage:
 *   cy.interceptRequest('GET', '/api/v2/pim/employees**', 'employees')
 *   cy.visit('/pim')
 *   cy.waitForApiResponse('@employees')
 *
 * @param {string} method - HTTP method
 * @param {string} url    - URL pattern (supports glob **)
 * @param {string} alias  - alias name (without @)
 */
Cypress.Commands.add('interceptRequest', (method, url, alias) => {
  cy.intercept(method, url).as(alias)
})

/**
 * cy.mockApiResponse(method, url, response, alias)
 *
 * Alias for cy.stubApiResponse() — intercept a request and return mock data.
 * Pass either a fixture filename (string) or an inline response object.
 *
 * Usage with fixture file:
 *   cy.mockApiResponse('GET', '/api/employees**', 'employees.json', 'employees')
 *
 * Usage with inline object:
 *   cy.mockApiResponse('GET', '/api/employees**', { data: [] }, 'employees')
 *
 * @param {string}        method   - HTTP method
 * @param {string}        url      - URL pattern
 * @param {string|object} response - fixture filename OR inline response body
 * @param {string}        alias    - alias name (without @)
 */
Cypress.Commands.add('mockApiResponse', (method, url, response, alias) => {
  const body = typeof response === 'string' ? { fixture: response } : { body: response }
  cy.intercept(method, url, body).as(alias)
})


// =============================================================================
// 17. WAIT & RETRY — ADDITIONAL
// =============================================================================

/**
 * cy.retryAction(actionFn, retries, delay)
 *
 * Execute an action function and automatically retry it if it throws an error.
 * Useful for flaky UI states where an element may not respond the first time.
 *
 * Usage:
 *   cy.retryAction(() => {
 *     cy.get('.dynamic-button').click()
 *     cy.get('.confirmation').should('be.visible')
 *   }, 3)
 *
 * @param {Function} actionFn - the Cypress action to attempt
 * @param {number}   retries  - maximum number of retry attempts (default: 3)
 * @param {number}   delay    - milliseconds to wait between retries (default: 500)
 */
Cypress.Commands.add('retryAction', (actionFn, retries = 3, delay = 500) => {
  let attempts = 0

  const attempt = () => {
    attempts++
    cy.log(`[retryAction] Attempt ${attempts} of ${retries}`)

    try {
      actionFn()
    } catch (err) {
      if (attempts < retries) {
        cy.wait(delay)
        attempt()
      } else {
        throw err
      }
    }
  }

  attempt()
})

/**
 * cy.waitForNetworkIdle(timeout)
 *
 * Wait until there are no active XHR or fetch requests in flight.
 * Uses cy.intercept to monitor all requests and waits for them to settle.
 *
 * Call this after a page action that triggers multiple API calls,
 * to ensure all data has loaded before you start asserting on the UI.
 *
 * Usage:
 *   cy.get('.search-btn').click()
 *   cy.waitForNetworkIdle()
 *
 * @param {number} idleMs   - milliseconds of inactivity = "idle" (default: 500)
 * @param {number} timeout  - max total wait time in ms (default: 10000)
 */
Cypress.Commands.add('waitForNetworkIdle', (idleMs = 500, timeout = 10000) => {
  // Intercept all requests and tag them
  cy.intercept('**').as('anyRequest')

  // Wait for the last request to complete, then wait for idle period
  cy.wait('@anyRequest', { timeout }).then(() => {
    cy.wait(idleMs)
  })
})


// =============================================================================
// 18. FIXTURE & DATA
// =============================================================================

/**
 * cy.loadFixture(fileName)
 *
 * Load a JSON fixture file and return its content as a Cypress chainable.
 * Shorthand for cy.fixture() with a consistent API.
 *
 * Usage:
 *   cy.loadFixture('users').then(data => {
 *     cy.login(data.validUser.username, data.validUser.password)
 *   })
 *
 * @param {string} fileName - fixture file name without extension (e.g. 'users')
 */
Cypress.Commands.add('loadFixture', (fileName) => {
  return cy.fixture(fileName)
})


// =============================================================================
// 19. VIEWPORT — generic setter
// =============================================================================

/**
 * cy.setViewport(width, height)
 *
 * Set the browser viewport to any custom width and height.
 * More flexible than the preset commands (setViewportMobile, etc.).
 *
 * Usage: cy.setViewport(1440, 900)
 *        cy.setViewport(375, 667)   // iPhone SE
 *
 * @param {number} width  - viewport width in pixels
 * @param {number} height - viewport height in pixels
 */
Cypress.Commands.add('setViewport', (width, height) => {
  cy.viewport(width, height)
})


// =============================================================================
// 20. EXCEL DATA — read test data from .xlsx files
// =============================================================================

/**
 * cy.readExcel(filePath, sheet)
 *
 * Read ALL rows from a named sheet in an Excel file.
 * Returns an array of objects — one object per data row.
 * The first row of the sheet is used as the property names (headers).
 *
 * HOW IT WORKS:
 *   Cypress tests run inside the browser and cannot read files directly.
 *   This command uses cy.task() to ask the Node.js process (which CAN read
 *   files) to open the Excel file and return the parsed data as plain JSON.
 *
 * Usage:
 *   cy.readExcel('cypress/fixtures/users.xlsx', 'LoginUsers').then((rows) => {
 *     // rows is an array like:
 *     // [
 *     //   { type: 'validUser', username: 'Admin', password: 'admin123', ... },
 *     //   { type: 'invalidUser', username: 'invaliduser', ... },
 *     // ]
 *     const validUser = rows.find(r => r.type === 'validUser')
 *     cy.login(validUser.username, validUser.password)
 *   })
 *
 * @param {string} filePath - path to the .xlsx file relative to project root
 * @param {string} sheet    - name of the sheet tab to read
 */
Cypress.Commands.add('readExcel', (filePath, sheet) => {
  return cy.task('readExcel', { filePath, sheet })
})

/**
 * cy.readExcelRow(filePath, sheet, matchColumn, matchValue)
 *
 * Find and return a SINGLE row from an Excel sheet where a column matches
 * a specific value. Ideal for looking up one test user by type/name.
 *
 * Usage:
 *   cy.readExcelRow('cypress/fixtures/users.xlsx', 'LoginUsers', 'type', 'validUser')
 *     .then((user) => {
 *       cy.login(user.username, user.password)
 *     })
 *
 * @param {string} filePath    - path to the .xlsx file relative to project root
 * @param {string} sheet       - sheet tab name
 * @param {string} matchColumn - column header name to search in (e.g. 'type')
 * @param {string} matchValue  - value to match in that column (e.g. 'validUser')
 */
Cypress.Commands.add('readExcelRow', (filePath, sheet, matchColumn, matchValue) => {
  return cy.task('readExcelRow', { filePath, sheet, matchColumn, matchValue })
})

/**
 * cy.readExcelRows(filePath, sheet, matchColumn, matchValue)
 *
 * Find and return ALL rows from an Excel sheet where a column matches
 * a specific value. Use this when multiple rows share the same type
 * (e.g. multiple 'negativeTest' rows you want to iterate over).
 *
 * Usage:
 *   cy.readExcelRows('cypress/fixtures/users.xlsx', 'LoginUsers', 'type', 'invalidUser')
 *     .then((users) => {
 *       users.forEach((user) => {
 *         cy.login(user.username, user.password)
 *         cy.verifyErrorMessage(user.expectedError)
 *       })
 *     })
 *
 * @param {string} filePath    - path to the .xlsx file relative to project root
 * @param {string} sheet       - sheet tab name
 * @param {string} matchColumn - column header name to filter by
 * @param {string} matchValue  - value to match
 */
Cypress.Commands.add('readExcelRows', (filePath, sheet, matchColumn, matchValue) => {
  return cy.task('readExcelRows', { filePath, sheet, matchColumn, matchValue })
})
