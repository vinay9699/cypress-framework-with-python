// =============================================================================
// cypress.d.ts — TypeScript Type Definitions for Custom Cypress Commands
// =============================================================================
// Even though the framework is written in JavaScript, adding this file gives
// every developer:
//   - Full autocomplete for cy.login(), cy.readExcel(), etc. in VS Code
//   - Inline JSDoc descriptions when hovering over commands
//   - Type checking if the project is ever migrated to TypeScript
//
// This file is auto-loaded by TypeScript/VS Code via tsconfig.json.
// No import needed — it augments the global Cypress namespace.
// =============================================================================

/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {

    // =========================================================================
    // AUTHENTICATION
    // =========================================================================

    /**
     * Log in via the OrangeHRM UI form.
     * Use ONLY when testing the login feature itself.
     * For all other tests, use loginBySession() instead.
     */
    login(username: string, password: string): Chainable<void>

    /**
     * Log in using Cypress Sessions API (cached — 10x faster than UI login).
     * Use this in beforeEach() of any test suite where login is a precondition.
     */
    loginBySession(username: string, password: string): Chainable<void>

    /**
     * Alias for login() — logs in through the browser UI form.
     */
    loginViaUI(username: string, password: string): Chainable<void>

    /**
     * Log in by calling OrangeHRM's auth API directly.
     * Bypasses the UI entirely — fastest approach for non-login test suites.
     */
    loginViaApi(username: string, password: string): Chainable<void>

    /**
     * Log out of OrangeHRM via the user dropdown menu.
     */
    logout(): Chainable<void>

    /**
     * Wipe ALL browser storage: cookies, localStorage, sessionStorage.
     * Call this in beforeEach() of login tests.
     */
    clearSession(): Chainable<void>

    /**
     * Persist an auth token to localStorage and Cypress.env.
     */
    saveAuthToken(token: string): Chainable<void>

    /**
     * Read the stored auth token from localStorage.
     */
    getAuthToken(): Chainable<string>

    // =========================================================================
    // NAVIGATION
    // =========================================================================

    /**
     * Navigate to a URL path with query string parameters.
     */
    visitWithParams(path: string, params: Record<string, string | number>): Chainable<void>

    // =========================================================================
    // WAITING
    // =========================================================================

    /**
     * Wait for OrangeHRM's loading spinner to disappear.
     */
    waitForPageLoad(): Chainable<void>

    /**
     * Wait for a previously intercepted API request to complete.
     */
    waitForApiResponse(alias: string): Chainable<void>

    /**
     * Wait until no active network requests are in flight.
     */
    waitForNetworkIdle(idleMs?: number, timeout?: number): Chainable<void>

    // =========================================================================
    // FORMS
    // =========================================================================

    /**
     * Fill multiple form fields at once using a selector→value object.
     */
    fillForm(formData: Record<string, string>): Chainable<void>

    /**
     * Select an option from OrangeHRM's custom .oxd-select dropdown.
     */
    selectOxdDropdown(containerSelector: string, optionText: string): Chainable<void>

    /**
     * Clear a field and type new text — shorthand for clear().type().
     */
    clearAndType(selector: string, text: string): Chainable<void>

    // =========================================================================
    // API REQUESTS
    // =========================================================================

    /** Authenticated HTTP GET */
    apiGet(url: string, options?: Partial<RequestBody>): Chainable<Response>

    /** Authenticated HTTP POST */
    apiPost(url: string, body: object, options?: Partial<RequestBody>): Chainable<Response>

    /** Authenticated HTTP PUT */
    apiPut(url: string, body: object, options?: Partial<RequestBody>): Chainable<Response>

    /** Authenticated HTTP DELETE */
    apiDelete(url: string, options?: Partial<RequestBody>): Chainable<Response>

    // =========================================================================
    // NETWORK INTERCEPT
    // =========================================================================

    /** Spy on an API request without modifying it. */
    interceptApi(method: string, urlPattern: string, alias: string): Chainable<void>

    /** Alias for interceptApi(). */
    interceptRequest(method: string, url: string, alias: string): Chainable<void>

    /** Intercept and return a fake response from a fixture or inline object. */
    stubApiResponse(method: string, urlPattern: string, fixture: string, alias: string): Chainable<void>

    /** Alias for stubApiResponse() — accepts fixture filename or inline body. */
    mockApiResponse(method: string, url: string, response: string | object, alias: string): Chainable<void>

    /** Intercept and force an HTTP error response. */
    stubApiError(method: string, urlPattern: string, statusCode: number, alias: string): Chainable<void>

    // =========================================================================
    // NOTIFICATIONS
    // =========================================================================

    /** Assert a toast notification appears with the expected text. */
    verifyToast(expectedMessage: string): Chainable<void>

    /** Assert the type of toast shown (success, error, warn, info). */
    verifyToastType(toastType: 'success' | 'error' | 'warn' | 'info'): Chainable<void>

    // =========================================================================
    // TABLES
    // =========================================================================

    /** Assert the exact number of rows in OrangeHRM's result table. */
    verifyTableRowCount(expectedCount: number): Chainable<void>

    /** Assert the table shows "No Records Found". */
    verifyTableIsEmpty(): Chainable<void>

    /** Find the table row containing specific text. */
    getTableRowByText(text: string): Chainable<JQuery<HTMLElement>>

    // =========================================================================
    // SEARCH
    // =========================================================================

    /** Type into a live-search field and wait for results. */
    typeAndSearch(inputSelector: string, searchText: string): Chainable<void>

    // =========================================================================
    // STORAGE
    // =========================================================================

    /** Set a localStorage key/value pair. */
    setLocalStorage(key: string, value: string): Chainable<void>

    /** Read a localStorage value by key. */
    getLocalStorage(key: string): Chainable<string>

    // =========================================================================
    // VIEWPORT
    // =========================================================================

    /** Set viewport to iPhone 14 (390×844). */
    setViewportMobile(): Chainable<void>

    /** Set viewport to iPad Air (820×1180). */
    setViewportTablet(): Chainable<void>

    /** Set viewport to standard HD desktop (1280×720). */
    setViewportDesktop(): Chainable<void>

    /** Set viewport to full widescreen (1920×1080). */
    setViewportWidescreen(): Chainable<void>

    /** Set viewport to any custom width and height. */
    setViewport(width: number, height: number): Chainable<void>

    // =========================================================================
    // ACCESSIBILITY
    // =========================================================================

    /** Assert an element has the correct aria-label attribute. */
    verifyAriaLabel(selector: string, expectedLabel: string): Chainable<void>

    /** Assert an element has the correct ARIA role attribute. */
    verifyRole(selector: string, expectedRole: string): Chainable<void>

    /** Verify keyboard Tab order through a list of selectors. */
    verifyTabOrder(selectors: string[]): Chainable<void>

    // =========================================================================
    // PERFORMANCE
    // =========================================================================

    /** Navigate to a page and assert it loads within maxMs milliseconds. */
    measurePageLoadTime(path: string, maxMs?: number): Chainable<void>

    // =========================================================================
    // ELEMENT FINDERS
    // =========================================================================

    /** Find element by data-cy attribute. */
    getByDataCy(selector: string): Chainable<JQuery<HTMLElement>>

    /** Find form input by its associated label text. */
    getByLabel(labelText: string): Chainable<JQuery<HTMLElement>>

    /** Find input by placeholder text. */
    getByPlaceholder(placeholderText: string): Chainable<JQuery<HTMLElement>>

    /** Find element by data-testid attribute. */
    getByTestId(testId: string): Chainable<JQuery<HTMLElement>>

    // =========================================================================
    // RETRY & RESILIENCE
    // =========================================================================

    /** Execute an action and retry it on failure. */
    retryAction(actionFn: () => void, retries?: number, delay?: number): Chainable<void>

    // =========================================================================
    // FIXTURE & DATA
    // =========================================================================

    /** Load a JSON fixture file by name (without extension). */
    loadFixture(fileName: string): Chainable<any>

    // =========================================================================
    // EXCEL DATA
    // =========================================================================

    /**
     * Read ALL rows from a named sheet in an Excel (.xlsx) file.
     * Returns an array of objects — one per data row, keyed by header row.
     *
     * @param filePath - path relative to project root e.g. 'cypress/fixtures/users.xlsx'
     * @param sheet    - sheet tab name e.g. 'LoginUsers'
     */
    readExcel(filePath: string, sheet: string): Chainable<Record<string, string>[]>

    /**
     * Find and return the FIRST row where a column matches a value.
     *
     * @param filePath    - path to the .xlsx file
     * @param sheet       - sheet tab name
     * @param matchColumn - column header to search in (e.g. 'type')
     * @param matchValue  - value to match (e.g. 'validUser')
     */
    readExcelRow(
      filePath: string,
      sheet: string,
      matchColumn: string,
      matchValue: string
    ): Chainable<Record<string, string> | null>

    /**
     * Find and return ALL rows where a column matches a value.
     *
     * @param filePath    - path to the .xlsx file
     * @param sheet       - sheet tab name
     * @param matchColumn - column header to filter by
     * @param matchValue  - value to match
     */
    readExcelRows(
      filePath: string,
      sheet: string,
      matchColumn: string,
      matchValue: string
    ): Chainable<Record<string, string>[]>
  }
}
