// =============================================================================
// all-actions-reference.cy.js
// =============================================================================
// PURPOSE:
//   This file is a REFERENCE GUIDE, not a test suite to be run blindly.
//   Every snippet below shows how to use the framework's reusable methods
//   from BasePage, custom commands (commands.js), and Cypress built-ins.
//
// HOW TO READ THIS FILE:
//   Each section maps one category from the action table to the
//   corresponding framework method.  The raw Cypress command is shown
//   in a comment above each snippet so you can see the equivalence.
//
// APP:  https://opensource-demo.orangehrmlive.com  (Admin / admin123)
// =============================================================================

import BasePage from '../../pages/BasePage'
import LoginPage from '../../pages/LoginPage'
import DashboardPage from '../../pages/DashboardPage'

// We instantiate BasePage directly here only for illustration.
// In a real test you would use a specific Page Object (LoginPage, etc.)
const page = new BasePage()

// =============================================================================
// 🌐  SECTION 1 — BROWSER & NAVIGATION ACTIONS
// =============================================================================
describe('Section 1 — Browser & Navigation Actions', { tags: ['@reference'] }, () => {
  // ---------------------------------------------------------------------------
  // Raw:  cy.visit('https://example.com')
  // Framework: page.navigateTo(path) — relative path, baseUrl is prepended
  //            page.navigateToFullUrl(url) — absolute URL
  // ---------------------------------------------------------------------------
  it('visit a URL', () => {
    page.navigateTo('/web/index.php/auth/login') // relative → baseUrl + path
    page.navigateToFullUrl('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
  })

  // ---------------------------------------------------------------------------
  // Raw:  cy.go('back') / cy.go('forward')
  // Framework: page.goBack() / page.goForward()
  // ---------------------------------------------------------------------------
  it('go back and forward', () => {
    page.navigateTo('/web/index.php/auth/login')
    page.goBack() // cy.go('back')
    page.goForward() // cy.go('forward')
  })

  // ---------------------------------------------------------------------------
  // Raw:  cy.reload() / cy.reload(true)
  // Framework: page.reloadPage()
  // ---------------------------------------------------------------------------
  it('reload page', () => {
    page.navigateTo('/web/index.php/auth/login')
    page.reloadPage() // cy.reload()
    cy.reload(true) // hard reload (no cache) — no framework wrapper; call directly
  })

  // ---------------------------------------------------------------------------
  // Raw:  cy.url() / cy.title() / cy.document() / cy.window()
  // Framework: page.getCurrentUrl() / page.getPageTitle()
  // ---------------------------------------------------------------------------
  it('get URL, title, document, window', () => {
    page.navigateTo('/web/index.php/auth/login')

    // URL — returns a Cypress chainable
    page.getCurrentUrl().should('include', '/auth/login') // cy.url()

    // Page title
    page.getPageTitle().should('include', 'OrangeHRM') // cy.title()

    // document and window have no framework wrappers — use Cypress directly
    cy.document().its('title').should('include', 'OrangeHRM')
    cy.window().its('location.pathname').should('include', '/auth/login')
  })

  // ---------------------------------------------------------------------------
  // Raw:  cy.viewport(1920, 1080) / cy.viewport('macbook-15')
  // Framework: page.setViewport(width, height)
  //            cy.setViewportDesktop() / cy.setViewportMobile() (custom commands)
  // ---------------------------------------------------------------------------
  it('set viewport size', () => {
    page.setViewport(1920, 1080) // cy.viewport(1920, 1080)
    cy.viewport('macbook-15') // preset — call directly; no framework wrapper needed

    cy.setViewportMobile() // custom command → 375 × 667  (iPhone SE)
    cy.setViewportTablet() // custom command → 768 × 1024 (iPad)
    cy.setViewportDesktop() // custom command → 1280 × 720
    cy.setViewportWidescreen() // custom command → 1920 × 1080
  })
})

// =============================================================================
// 🔍  SECTION 2 — ELEMENT SELECTION ACTIONS
// =============================================================================
describe('Section 2 — Element Selection Actions', { tags: ['@reference'] }, () => {
  before(() => LoginPage.visit())

  // All standard Cypress selectors still work — framework adds helpers on top.
  it('selecting elements — all patterns', () => {
    // CSS class
    cy.get('.oxd-input') // by class
    cy.get('#app') // by ID
    cy.get('[name="username"]') // by attribute

    // By text content
    cy.contains('Login') // any element with text
    cy.contains('button', 'Login') // tag + text

    // Traversal — all standard Cypress chainables
    cy.get('.oxd-form').find('.oxd-input') // find child
    cy.get('.oxd-input').first() // first match
    cy.get('.oxd-input').last() // last match
    cy.get('.oxd-input').eq(1) // by index (0-based)
    cy.get('.oxd-input').next() // next sibling
    cy.get('.oxd-input').prev() // previous sibling
    cy.get('.oxd-input').parent() // immediate parent
    cy.get('.oxd-form').children() // all direct children
    cy.get('.oxd-input').siblings() // all siblings
    cy.get('.oxd-input').filter(':visible') // filter matching elements
    cy.get('.oxd-input').not('[disabled]') // exclude elements
    cy.get('.oxd-input').closest('.oxd-form') // nearest ancestor matching selector

    // Framework helpers — cy.getByDataCy / cy.getByLabel / cy.getByPlaceholder
    cy.getByPlaceholder('Username') // cy custom command → cy.get('[placeholder="Username"]')
    cy.getByLabel('Username') // cy custom command → cy.contains('label', ...).siblings('input')
  })
})

// =============================================================================
// 🖱️  SECTION 3 — CLICK ACTIONS
// =============================================================================
describe('Section 3 — Click Actions', { tags: ['@reference'] }, () => {
  beforeEach(() => LoginPage.visit())

  // ---------------------------------------------------------------------------
  // Raw:  cy.get('button').click()
  // Framework: page.clickElement(selector)
  // ---------------------------------------------------------------------------
  it('standard click', () => {
    page.clickElement('[type="submit"]') // waits for visible then clicks
  })

  // ---------------------------------------------------------------------------
  // Raw:  cy.get('button').dblclick()
  // Framework: page.doubleClick(selector)
  // ---------------------------------------------------------------------------
  it('double click', () => {
    page.doubleClick('[type="submit"]') // cy.get(...).dblclick()
  })

  // ---------------------------------------------------------------------------
  // Raw:  cy.get('button').rightclick()
  // Framework: page.rightClick(selector)
  // ---------------------------------------------------------------------------
  it('right click', () => {
    page.rightClick('[type="submit"]') // cy.get(...).rightclick()
  })

  // ---------------------------------------------------------------------------
  // Raw:  cy.get('button').click('topLeft')
  //       cy.get('button').click(50, 100)
  // No framework wrapper — call directly
  // ---------------------------------------------------------------------------
  it('click at position or coordinates', () => {
    cy.get('[type="submit"]').click('topLeft') // position string
    cy.get('[type="submit"]').click(50, 10) // x, y coordinates
  })

  // ---------------------------------------------------------------------------
  // Raw:  cy.get('button').click({ force: true })
  // Framework: page.forceClick(selector)
  // ---------------------------------------------------------------------------
  it('force click (bypasses visibility check)', () => {
    page.forceClick('[type="submit"]') // { force: true }
  })

  // ---------------------------------------------------------------------------
  // Raw:  cy.get('button').click({ multiple: true })
  // No framework wrapper — call directly
  // ---------------------------------------------------------------------------
  it('click multiple elements', () => {
    cy.get('.oxd-checkbox-input').click({ multiple: true })
  })

  // ---------------------------------------------------------------------------
  // Raw:  modifier key clicks — ctrlKey, shiftKey, altKey
  // No framework wrapper — call directly
  // ---------------------------------------------------------------------------
  it('ctrl / shift / alt click', () => {
    cy.get('a').first().click({ ctrlKey: true })
    cy.get('a').first().click({ shiftKey: true })
    cy.get('a').first().click({ altKey: true })
  })

  // ---------------------------------------------------------------------------
  // Framework: page.clickByText(tag, text) — click by visible text
  //            page.clickNthElement(selector, index) — click by position
  //            page.scrollAndClick(selector) — scroll then click
  // ---------------------------------------------------------------------------
  it('click by text / nth / scroll', () => {
    page.clickByText('button', 'Login') // cy.contains('button', 'Login').click()
    page.clickNthElement('.oxd-input', 0) // .eq(0).click()
    page.scrollAndClick('[type="submit"]') // .scrollIntoView().click()
  })
})

// =============================================================================
// ⌨️  SECTION 4 — KEYBOARD & TYPING ACTIONS
// =============================================================================
describe('Section 4 — Keyboard & Typing Actions', { tags: ['@reference'] }, () => {
  beforeEach(() => LoginPage.visit())

  // ---------------------------------------------------------------------------
  // Raw:  cy.get('input').type('Hello World')
  // Framework: page.typeInto(selector, text) — clears first then types
  //            page.appendText(selector, text) — appends without clearing
  // ---------------------------------------------------------------------------
  it('type text', () => {
    page.typeInto('[name="username"]', 'Admin') // clear + type
    page.appendText('[name="username"]', '_extra') // append without clear
  })

  // ---------------------------------------------------------------------------
  // Raw:  cy.get('input').type('text', { delay: 100 })
  // Framework: page.typeSlowly(selector, text, delayMs)
  // ---------------------------------------------------------------------------
  it('type with delay (autocomplete / type-ahead)', () => {
    page.typeSlowly('[name="username"]', 'Admin', 100) // 100ms between keystrokes
  })

  // ---------------------------------------------------------------------------
  // Raw:  cy.get('input').clear()
  // Framework: page.clearField(selector)
  // ---------------------------------------------------------------------------
  it('clear field', () => {
    page.typeInto('[name="username"]', 'Admin')
    page.clearField('[name="username"]')
  })

  // ---------------------------------------------------------------------------
  // Raw:  cy.get('input').clear().type('new text')
  // Framework: page.typeInto(selector, text) — already does clear + type
  // ---------------------------------------------------------------------------
  it('clear and type', () => {
    page.typeInto('[name="username"]', 'new value') // clear().type() under the hood
  })

  // ---------------------------------------------------------------------------
  // Raw:  Special keys — {enter}, {tab}, {esc}, {backspace}, {del}, {uparrow}
  // Framework: page.pressEnter() / page.pressTab() / page.pressEscape()
  //            page.pressKey(key, selector) — generic
  // ---------------------------------------------------------------------------
  it('special keys', () => {
    page.pressEnter('[name="username"]') // {enter}
    page.pressTab('[name="username"]') // {tab}
    page.pressEscape() // {esc} on body

    cy.get('[name="username"]').type('{backspace}') // {backspace} — call directly
    cy.get('[name="username"]').type('{del}') // {del}
    cy.get('[name="username"]').type('{uparrow}') // arrow keys

    page.pressKey('{downarrow}', '[name="username"]') // generic pressKey wrapper
  })

  // ---------------------------------------------------------------------------
  // Raw:  Select all / Ctrl+A / Ctrl+C / Ctrl+V
  // Framework: page.selectAllText(selector) — {selectAll}
  // ---------------------------------------------------------------------------
  it('select all, copy, paste shortcuts', () => {
    page.typeInto('[name="username"]', 'Admin')
    page.selectAllText('[name="username"]') // {selectAll}

    cy.get('[name="username"]').type('{ctrl}a') // Ctrl+A — call directly
    cy.get('[name="username"]').type('{ctrl}c') // Ctrl+C
    cy.get('[name="username"]').type('{ctrl}v') // Ctrl+V
  })

  // ---------------------------------------------------------------------------
  // Raw:  cy.get('input').focus() / .blur()
  // Framework: page.focusElement(selector) / page.blurElement(selector)
  // ---------------------------------------------------------------------------
  it('focus and blur', () => {
    page.focusElement('[name="username"]') // .focus()
    page.blurElement('[name="username"]') // .blur()
  })

  // ---------------------------------------------------------------------------
  // Raw:  paste via clipboard / invoke
  // Framework: page.pasteText(selector, text) — uses invoke('val') + trigger
  // ---------------------------------------------------------------------------
  it('paste text into field', () => {
    page.pasteText('[name="username"]', 'PastedAdmin') // invoke('val') + trigger('input')
  })
})

// =============================================================================
// 📋  SECTION 5 — FORM ACTIONS
// =============================================================================
describe('Section 5 — Form Actions', { tags: ['@reference'] }, () => {
  beforeEach(() => LoginPage.visit())

  // ---------------------------------------------------------------------------
  // Typing — covered in Section 4
  // Checkbox & Radio — framework: page.checkCheckbox / page.uncheckCheckbox
  //                               page.selectRadioButton
  // ---------------------------------------------------------------------------
  it('checkbox and radio button', () => {
    // Checkbox
    page.checkCheckbox('[type="checkbox"]') // .check()
    page.uncheckCheckbox('[type="checkbox"]') // .uncheck()
    cy.get('[type="checkbox"]').check('value1') // check by value — call directly

    // Radio button
    page.selectRadioButton('[type="radio"]', 'Male') // .check('Male')

    // Verify state
    page.verifyCheckboxState('[type="checkbox"]', false) // should('not.be.checked')
    page.verifyRadioSelected('[value="Male"]') // should('be.checked')
  })

  // ---------------------------------------------------------------------------
  // Native <select> dropdown
  // Framework: page.selectNativeDropdown(selector, optionText)
  //            page.selectNativeDropdownByValue(selector, optionValue)
  //            page.selectDropdown(selector, value) — auto-detects native vs custom
  // ---------------------------------------------------------------------------
  it('native select dropdown', () => {
    // By visible text
    page.selectNativeDropdown('select[name="status"]', 'Active')

    // By value attribute
    page.selectNativeDropdownByValue('select[name="status"]', 'active')

    // By index — call directly
    cy.get('select[name="status"]').select(2)

    // Multiple selection — call directly
    cy.get('select[multiple]').select(['option1', 'option2'])

    // Smart wrapper — detects native vs OrangeHRM custom dropdown
    page.selectDropdown('select[name="status"]', 'Active')
    page.selectDropdown('.oxd-select-wrapper', 'Full Time') // custom Vue dropdown
  })

  // ---------------------------------------------------------------------------
  // OrangeHRM custom dropdown (.oxd-select)
  // Framework: page.selectCustomDropdown(containerSelector, optionText)
  // ---------------------------------------------------------------------------
  it('OrangeHRM custom dropdown', () => {
    page.selectCustomDropdown('.oxd-select-wrapper', 'Full Time') // click wrapper → click option
  })

  // ---------------------------------------------------------------------------
  // Submit form
  // Framework: page.submitForm(selector)
  // ---------------------------------------------------------------------------
  it('submit form', () => {
    page.typeInto('[name="username"]', 'Admin')
    page.typeInto('[name="password"]', 'admin123')
    page.submitForm('form') // cy.get('form').submit()
    // OR just click the button
    page.clickElement('[type="submit"]')
  })

  // ---------------------------------------------------------------------------
  // File upload
  // Framework: page.uploadFile(selector, fileName)
  //            page.uploadMultipleFiles(selector, fileNames)
  //            page.dropFile(selector, fileName)
  // ---------------------------------------------------------------------------
  it('file upload', () => {
    // Single file — file must be in cypress/fixtures/
    page.uploadFile('input[type="file"]', 'sample.pdf')

    // Multiple files
    page.uploadMultipleFiles('input[type="file"]', ['photo.jpg', 'doc.pdf'])

    // Drag-and-drop file onto drop zone
    page.dropFile('.upload-dropzone', 'sample.pdf')

    // Direct Cypress call with drag-drop action
    cy.get('input[type="file"]').selectFile('cypress/fixtures/sample.pdf', { action: 'drag-drop' })
  })
})

// =============================================================================
// 🖱️  SECTION 6 — MOUSE & HOVER ACTIONS
// =============================================================================
describe('Section 6 — Mouse & Hover Actions', { tags: ['@reference'] }, () => {
  beforeEach(() => {
    cy.loginBySession(
      Cypress.env('validUsername') || 'Admin',
      Cypress.env('validPassword') || 'admin123'
    )
    DashboardPage.visit()
  })

  // ---------------------------------------------------------------------------
  // Framework: page.hoverOver(selector) — trigger('mouseover')
  //            page.mouseOut(selector)  — trigger('mouseout')
  // ---------------------------------------------------------------------------
  it('hover and mouse events', () => {
    page.hoverOver('.oxd-main-menu-item') // trigger('mouseover')
    page.mouseOut('.oxd-main-menu-item') // trigger('mouseout')

    // Other mouse events — call directly
    cy.get('.oxd-main-menu-item').trigger('mouseenter')
    cy.get('.oxd-main-menu-item').trigger('mouseleave')
    cy.get('.oxd-main-menu-item').trigger('mousedown')
    cy.get('.oxd-main-menu-item').trigger('mouseup')
    cy.get('.oxd-main-menu-item').trigger('mousemove')
  })

  // ---------------------------------------------------------------------------
  // Drag and drop
  // Framework: page.dragAndDrop(sourceSelector, targetSelector)
  // ---------------------------------------------------------------------------
  it('drag and drop', () => {
    // Framework method — uses trigger events
    page.dragAndDrop('.drag-handle', '.drop-zone')

    // Direct Cypress (with cypress-drag-drop plugin installed)
    // cy.get('.drag').drag('.drop')
  })
})

// =============================================================================
// 📜  SECTION 7 — SCROLL ACTIONS
// =============================================================================
describe('Section 7 — Scroll Actions', { tags: ['@reference'] }, () => {
  beforeEach(() => {
    cy.loginBySession(
      Cypress.env('validUsername') || 'Admin',
      Cypress.env('validPassword') || 'admin123'
    )
    DashboardPage.visit()
  })

  // ---------------------------------------------------------------------------
  // Framework: page.scrollToTop() / page.scrollToBottom() / page.scrollByPixels()
  //            page.scrollToElement(selector)
  // ---------------------------------------------------------------------------
  it('scroll actions', () => {
    page.scrollToBottom() // cy.scrollTo('bottom')
    page.scrollToTop() // cy.scrollTo('top')
    page.scrollByPixels(0, 500) // cy.scrollTo(0, 500)

    // Scroll to percentage — call directly (no framework wrapper)
    cy.scrollTo('50%', '50%')

    // Scroll element into view
    page.scrollToElement('.oxd-main-menu') // cy.get(...).scrollIntoView()

    // Scroll a specific container to its bottom — call directly
    cy.get('.oxd-sidepanel-body').scrollTo('bottom')
  })
})

// =============================================================================
// ✅  SECTION 8 — ASSERTION ACTIONS
// =============================================================================
describe('Section 8 — Assertion Actions', { tags: ['@reference'] }, () => {
  beforeEach(() => LoginPage.visit())

  it('existence and visibility assertions', () => {
    // Framework wrappers
    page.verifyVisible('[name="username"]') // should('be.visible')
    page.verifyNotVisible('.nonexistent') // should('not.be.visible')
    page.verifyDoesNotExist('.nonexistent') // should('not.exist')
    page.elementExists('[name="username"]') // should('exist')
  })

  it('state assertions', () => {
    page.verifyEnabled('[type="submit"]') // should('not.be.disabled')
    page.verifyDisabled('[name="employeeId"]') // should('be.disabled') — if applicable
    page.isElementChecked('[type="checkbox"]') // should('be.checked')
    page.isElementEnabled('[type="submit"]') // should('not.be.disabled')
    page.isElementDisabled('[type="submit"]') // should('be.disabled')
  })

  it('text assertions', () => {
    // Partial text match
    page.verifyText('.orangehrm-login-title', 'Login') // should('contain.text', ...)

    // Exact text match
    page.verifyExactText('.oxd-text', 'Login') // should('have.text', ...)
  })

  it('value and attribute assertions', () => {
    page.typeInto('[name="username"]', 'Admin')
    page.verifyInputValue('[name="username"]', 'Admin') // should('have.value', ...)
    page.verifyInputIsEmpty('[name="password"]') // should('have.value', '')

    page.verifyAttribute('input[name="username"]', 'type', 'text') // should('have.attr', ...)
    page.verifyCssProperty('[type="submit"]', 'display', 'flex') // should('have.css', ...)
    page.verifyHasClass('[type="submit"]', 'oxd-button') // should('have.class', ...)
    page.verifyDoesNotHaveClass('[type="submit"]', 'disabled') // should('not.have.class', ...)
  })

  it('URL and title assertions', () => {
    page.verifyUrl('/auth/login') // cy.url().should('include', ...)
    page.verifyUrlContains('/auth/login') // alias for verifyUrl()
    page.verifyExactUrl('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    page.verifyPageTitle('OrangeHRM') // cy.title().should('include', ...)
  })

  it('count assertions', () => {
    page.verifyElementCount('.oxd-input', 2) // should('have.length', 2)
    page.verifyCount('.oxd-input', 2) // alias
    page.verifyElementCountGreaterThan('.oxd-input', 0) // .its('length').should('be.gt', 0)

    // Direct Cypress — greater than / less than / at least
    cy.get('.oxd-input').should('have.length.gt', 1)
    cy.get('.oxd-input').should('have.length.gte', 2)
  })

  it('link and image assertions', () => {
    page.verifyLinkHref('.orangehrm-copyright-wrapper a', 'https://www.orangehrm.com')
    page.verifyOpensInNewTab('.orangehrm-copyright-wrapper a') // target="_blank"
    page.verifyImageLoaded('.orangehrm-login-branding img') // naturalWidth > 0
  })

  it('focus assertion', () => {
    page.focusElement('[name="username"]')
    page.verifyFocused('[name="username"]') // should('be.focused')
  })
})

// =============================================================================
// 🌐  SECTION 9 — API / NETWORK ACTIONS
// =============================================================================
describe('Section 9 — API / Network Actions', { tags: ['@reference'] }, () => {
  const BASE = 'https://opensource-demo.orangehrmlive.com/web/index.php'
  const USERNAME = Cypress.env('validUsername') || 'Admin'
  const PASSWORD = Cypress.env('validPassword') || 'admin123'

  // ---------------------------------------------------------------------------
  // Raw cy.request() — GET / POST / PUT / DELETE
  // Framework: cy.apiGet() / cy.apiPost() / cy.apiPut() / cy.apiDelete()
  //   (custom commands that add Authorization header automatically)
  // ---------------------------------------------------------------------------
  it('HTTP requests via raw cy.request()', () => {
    // GET
    cy.request('GET', `${BASE}/api/v2/pim/employees?limit=5`).its('status').should('eq', 200)

    // POST with body
    cy.request({
      method: 'POST',
      url: `${BASE}/auth/validate`,
      body: { username: USERNAME, password: PASSWORD },
      failOnStatusCode: false,
    })
      .its('status')
      .should('be.oneOf', [200, 302])

    // PUT — generic structure
    cy.request({
      method: 'PUT',
      url: `${BASE}/api/v2/pim/employees/1`,
      headers: { 'Content-Type': 'application/json' },
      body: { firstName: 'Updated' },
      failOnStatusCode: false,
    })

    // DELETE
    cy.request({
      method: 'DELETE',
      url: `${BASE}/api/v2/pim/employees/999`,
      failOnStatusCode: false,
    })

    // With custom headers
    cy.request({
      method: 'GET',
      url: `${BASE}/api/v2/pim/employees`,
      headers: { Accept: 'application/json', Authorization: 'Bearer mytoken' },
    })
  })

  // ---------------------------------------------------------------------------
  // Framework custom commands: cy.apiGet / cy.apiPost / cy.apiPut / cy.apiDelete
  //   These auto-read the auth token from localStorage and set the header.
  // ---------------------------------------------------------------------------
  it('HTTP requests via framework custom commands', () => {
    cy.loginBySession(USERNAME, PASSWORD)

    cy.apiGet(`${BASE}/api/v2/pim/employees?limit=5`).its('status').should('eq', 200)

    cy.apiPost(`${BASE}/api/v2/some-endpoint`, { key: 'value' })

    cy.apiPut(`${BASE}/api/v2/some-endpoint/1`, { key: 'updated' })

    cy.apiDelete(`${BASE}/api/v2/some-endpoint/1`)
  })

  // ---------------------------------------------------------------------------
  // Intercept (spy on real requests)
  // Raw:  cy.intercept('GET', '/api/users').as('getUsers')
  // Framework: cy.interceptApi(method, urlPattern, alias)
  // ---------------------------------------------------------------------------
  it('intercept — spy on real API call', () => {
    // Framework command
    cy.interceptApi('GET', '**/api/v2/pim/employees**', 'employeeList')

    cy.loginBySession(USERNAME, PASSWORD)
    cy.visit('/web/index.php/pim/viewEmployeeList')

    // Wait for intercepted call
    cy.wait('@employeeList').its('response.statusCode').should('eq', 200) // cy.wait('@alias')
  })

  // ---------------------------------------------------------------------------
  // Mock API response (stub with fixture)
  // Raw:  cy.intercept('GET', '/api/users', { fixture: 'users.json' })
  // Framework: cy.stubApiResponse(method, urlPattern, fixtureName, alias)
  // ---------------------------------------------------------------------------
  it('intercept — stub with fixture file', () => {
    cy.stubApiResponse('GET', '**/api/v2/pim/employees**', 'users.json', 'stubbedList')

    cy.loginBySession(USERNAME, PASSWORD)
    cy.visit('/web/index.php/pim/viewEmployeeList')

    cy.wait('@stubbedList')
  })

  // ---------------------------------------------------------------------------
  // Stub with inline object
  // Framework: cy.mockApiResponse(method, urlPattern, body, alias)
  // ---------------------------------------------------------------------------
  it('intercept — stub with inline mock object', () => {
    const mockData = {
      data: [{ empNumber: 1, firstName: 'Mock', lastName: 'User' }],
      meta: { total: 1 },
    }
    cy.mockApiResponse('GET', '**/api/v2/pim/employees**', mockData, 'mockedList')

    cy.loginBySession(USERNAME, PASSWORD)
    cy.visit('/web/index.php/pim/viewEmployeeList')

    cy.wait('@mockedList')
  })

  // ---------------------------------------------------------------------------
  // Stub API error
  // Raw:  cy.intercept(..., { statusCode: 500, body: 'Server Error' })
  // Framework: cy.stubApiError(method, urlPattern, statusCode, alias)
  // ---------------------------------------------------------------------------
  it('intercept — simulate error responses', () => {
    cy.stubApiError('GET', '**/api/v2/pim/employees**', 500, 'serverError')

    cy.loginBySession(USERNAME, PASSWORD)
    cy.visit('/web/index.php/pim/viewEmployeeList')

    cy.wait('@serverError').its('response.statusCode').should('eq', 500)
  })

  // ---------------------------------------------------------------------------
  // Verify request body and response
  // ---------------------------------------------------------------------------
  it('verify request body and response after intercept', () => {
    cy.interceptApi('POST', '**/auth/validate**', 'loginRequest')

    LoginPage.visit()
    LoginPage.login(USERNAME, PASSWORD)

    cy.wait('@loginRequest').then((interception) => {
      // Verify request body contains username
      expect(interception.request.body).to.include(USERNAME)

      // Verify response status
      expect(interception.response.statusCode).to.be.oneOf([200, 302])
    })
  })
})

// =============================================================================
// 🍪  SECTION 10 — COOKIE ACTIONS
// =============================================================================
describe('Section 10 — Cookie Actions', { tags: ['@reference'] }, () => {
  beforeEach(() => LoginPage.visit())

  // ---------------------------------------------------------------------------
  // Framework: page.getCookie(name) / page.setCookie(name, value)
  //            page.deleteCookie(name) / page.verifyCookie(name, value)
  //            page.clearCookies()
  // ---------------------------------------------------------------------------
  it('cookie operations', () => {
    // Set a cookie
    page.setCookie('consent', 'accepted') // cy.setCookie(...)

    // Get a specific cookie
    page.getCookie('consent').should('have.property', 'value', 'accepted') // cy.getCookie(...)

    // Get all cookies — call directly (no framework wrapper)
    cy.getCookies().should('not.be.empty')

    // Verify cookie value
    page.verifyCookie('consent', 'accepted') // getCookie().should('have.property', ...)

    // Delete specific cookie
    page.deleteCookie('consent') // cy.clearCookie(...)

    // Clear all cookies
    page.clearCookies() // cy.clearCookies()
  })
})

// =============================================================================
// 💾  SECTION 11 — LOCAL & SESSION STORAGE ACTIONS
// =============================================================================
describe('Section 11 — Local & Session Storage Actions', { tags: ['@reference'] }, () => {
  beforeEach(() => LoginPage.visit())

  // ---------------------------------------------------------------------------
  // Framework: page.setLocalStorageItem / page.getLocalStorageItem
  //            page.removeLocalStorageItem / page.clearLocalStorage
  //            page.setSessionStorage / page.getSessionStorage / page.clearSessionStorage
  // ---------------------------------------------------------------------------
  it('localStorage operations', () => {
    // Set
    page.setLocalStorageItem('featureFlag', 'true') // win.localStorage.setItem(...)

    // Get
    page
      .getLocalStorageItem('featureFlag') // cy.window().its('localStorage.featureFlag')
      .should('eq', 'true')

    // Raw Cypress way
    cy.window().then((win) => win.localStorage.setItem('key', 'value'))
    cy.window().then((win) => win.localStorage.getItem('key'))

    // Remove one key
    page.removeLocalStorageItem('featureFlag')

    // Clear all localStorage
    page.clearLocalStorage() // cy.clearLocalStorage()
  })

  it('sessionStorage operations', () => {
    // Set
    page.setSessionStorage('cart', '{"items":[]}') // win.sessionStorage.setItem(...)

    // Get
    page
      .getSessionStorage('cart') // win.sessionStorage.getItem(...)
      .should('eq', '{"items":[]}')

    // Raw Cypress way
    cy.window().then((win) => win.sessionStorage.setItem('key', 'value'))
    cy.window().then((win) => win.sessionStorage.getItem('key'))

    // Clear all sessionStorage
    page.clearSessionStorage() // win.sessionStorage.clear()
  })

  // Custom commands
  it('localStorage via custom commands', () => {
    cy.setLocalStorage('token', 'abc123') // custom command wrapper
    cy.getLocalStorage('token').should('eq', 'abc123') // custom command wrapper
  })
})

// =============================================================================
// 🪟  SECTION 12 — WINDOW & TAB ACTIONS
// =============================================================================
describe('Section 12 — Window & Tab Actions', { tags: ['@reference'] }, () => {
  beforeEach(() => LoginPage.visit())

  // ---------------------------------------------------------------------------
  // Handle new tab — remove target="_blank" so Cypress stays in same tab
  // Framework: no wrapper — call directly
  // ---------------------------------------------------------------------------
  it('handle new tab by removing target attribute', () => {
    cy.get('a[target="_blank"]')
      .invoke('removeAttr', 'target') // remove target="_blank"
      .click() // now opens in same tab
  })

  // ---------------------------------------------------------------------------
  // Get window / set property / trigger event / stub method
  // Framework: page.getWindowProperty(property)
  //            page.switchToNewTab(url)
  // ---------------------------------------------------------------------------
  it('window object operations', () => {
    // Get window object
    cy.window().its('location.href').should('include', '/auth/login')

    // Get window property via framework
    page.getWindowProperty('innerWidth').should('be.gt', 0)

    // Set a property on the window
    cy.window().then((win) => {
      win.myCustomFlag = true
    })

    // Trigger a resize event on window
    cy.window().trigger('resize')

    // Stub window.open so new-tab links stay in test context
    cy.window().then((win) => cy.stub(win, 'open').as('windowOpen'))
  })

  // ---------------------------------------------------------------------------
  // Framework: page.switchToIframe / page.switchToNewTab
  // ---------------------------------------------------------------------------
  it('iframes and tab switching', () => {
    // Interact with an element inside an iframe
    page.getInsideIframe('#payment-iframe', '#card-number').type('4111111111111111')

    // Navigate to a URL (simulates "new tab" — Cypress is single-tab)
    page.switchToNewTab('https://opensource-demo.orangehrmlive.com')
  })
})

// =============================================================================
// 📸  SECTION 13 — SCREENSHOT & VISUAL ACTIONS
// =============================================================================
describe('Section 13 — Screenshot & Visual Actions', { tags: ['@reference'] }, () => {
  beforeEach(() => LoginPage.visit())

  // ---------------------------------------------------------------------------
  // Framework: page.takeScreenshot(name)
  //            page.takeElementScreenshot(selector, name)
  //            page.compareScreenshot(name) — visual comparison (plugin-dependent)
  // ---------------------------------------------------------------------------
  it('screenshots', () => {
    // Full-page screenshot
    page.takeScreenshot('login-page-full') // cy.screenshot('name')

    // Element-only screenshot (crops to the element bounding box)
    page.takeElementScreenshot('.orangehrm-login-form', 'login-form-only')

    // cy.screenshot() auto-triggered on failure — no code needed

    // Visual comparison (requires cypress-image-snapshot plugin)
    page.compareScreenshot('login-page-baseline') // graceful fallback if plugin absent
  })
})

// =============================================================================
// ⏳  SECTION 14 — WAIT ACTIONS
// =============================================================================
describe('Section 14 — Wait Actions', { tags: ['@reference'] }, () => {
  beforeEach(() => LoginPage.visit())

  // ---------------------------------------------------------------------------
  // Framework: page.hardWait(ms) / page.waitForTimeout(ms) — LAST RESORT
  //            page.waitForElement(selector, timeout)
  //            page.waitForText(selector, text, timeout)
  //            page.waitForUrl(expectedPath, timeout)
  //            page.waitForElementToDisappear(selector, timeout)
  // ---------------------------------------------------------------------------
  it('wait methods', () => {
    // Hard wait — avoid unless absolutely necessary
    page.hardWait(1000) // cy.wait(1000)
    page.waitForTimeout(2000) // alias for hardWait()

    // Wait for element to be visible
    page.waitForElement('[name="username"]', 10000) // cy.get(..., {timeout}).should('be.visible')

    // Wait for element to exist (even if hidden)
    page.waitForElementToExist('.oxd-form', 5000)

    // Wait for element to disappear (spinner, overlay)
    page.waitForElementToDisappear('.oxd-loading-spinner', 15000)

    // Wait for specific text to appear
    page.waitForText('.orangehrm-login-title', 'Login', 8000)

    // Wait for URL change
    page.waitForUrl('/auth/login', 10000)

    // Wait for a cy.intercept() alias
    cy.interceptApi('GET', '**/api/v2/pim/employees**', 'empList')
    cy.wait('@empList') // wait for alias — call directly

    // Wait for element with custom timeout — call directly
    cy.get('.oxd-main-menu', { timeout: 10000 }).should('be.visible')

    // Wait for text to appear with timeout
    cy.contains('Success', { timeout: 8000 }).should('be.visible')
  })
})

// =============================================================================
// 📁  SECTION 15 — FIXTURE & FILE ACTIONS
// =============================================================================
describe('Section 15 — Fixture & File Actions', { tags: ['@reference'] }, () => {
  // ---------------------------------------------------------------------------
  // Framework: cy.loadFixture(fixtureName) — custom command
  //            cy.readExcel(file, sheet) — reads Excel fixture via cy.task()
  //            cy.readExcelRow(file, sheet, col, val) — single row lookup
  //            cy.readExcelRows(file, sheet, col, val) — filtered rows
  // ---------------------------------------------------------------------------
  it('JSON fixture loading', () => {
    // Standard Cypress
    cy.fixture('users.json').then((data) => {
      expect(data.validUser.username).to.equal('Admin')
    })

    // Framework custom command
    cy.loadFixture('users').then((data) => {
      expect(data.validUser.username).to.equal('Admin')
    })
  })

  it('Excel fixture loading', () => {
    // Read entire sheet as array of objects keyed by column header
    cy.readExcel('users.xlsx', 'LoginUsers').then((rows) => {
      cy.log(`Total rows: ${rows.length}`)
    })

    // Read one specific row by column=value lookup
    cy.readExcelRow('users.xlsx', 'LoginUsers', 'type', 'valid').then((row) => {
      expect(row.username).to.equal('Admin')
    })

    // Read all rows matching column=value
    cy.readExcelRows('users.xlsx', 'LoginUsers', 'type', 'invalid').then((rows) => {
      expect(rows.length).to.be.greaterThan(0)
    })
  })

  it('file read and write', () => {
    // Read a file — call directly (no framework wrapper)
    cy.readFile('cypress/fixtures/users.json').then((content) => {
      expect(content).to.have.property('validUser')
    })

    // Write a file — call directly
    cy.writeFile(
      '/var/folders/8b/k1fwj27145g5xsp0bpck4_cw0000gs/T/opencode/test-output.txt',
      'hello world'
    )
  })
})

// =============================================================================
// ⚡  SECTION 16 — JAVASCRIPT EXECUTION ACTIONS
// =============================================================================
describe('Section 16 — JavaScript Execution Actions', { tags: ['@reference'] }, () => {
  beforeEach(() => LoginPage.visit())

  it('execute JavaScript in the browser', () => {
    // Execute arbitrary JS via window.eval()
    cy.window().then((win) => win.eval('console.log("Hello from eval")'))

    // Get an element property via invoke
    cy.get('.orangehrm-login-title').invoke('text').should('include', 'Login')

    // Set a property via invoke('val')
    cy.get('[name="username"]').invoke('val', 'InjectedValue')

    // Invoke a method — show a hidden element
    cy.get('.hidden-element').invoke('show') // jQuery .show()

    // Trigger a custom JS event
    cy.get('[name="username"]').trigger('keydown', { keyCode: 13 }) // Enter key
    cy.get('[name="username"]').trigger('input')
    cy.get('[name="username"]').trigger('change')
  })
})

// =============================================================================
// 🔧  SECTION 17 — CYPRESS UTILITY ACTIONS
// =============================================================================
describe('Section 17 — Cypress Utility Actions', { tags: ['@reference'] }, () => {
  // ---------------------------------------------------------------------------
  // Framework: page.log(message) — adds [INFO] prefix
  //            logger.step() / logger.info() / logger.success() etc.
  // ---------------------------------------------------------------------------
  it('logging', () => {
    cy.log('Raw Cypress log message') // cy.log()
    page.log('Framework log — adds [INFO] prefix') // page.log()
  })

  // ---------------------------------------------------------------------------
  // Wrap a value to make it a Cypress chainable
  // ---------------------------------------------------------------------------
  it('wrap a value', () => {
    const myValue = { name: 'Admin' }
    cy.wrap(myValue).should('have.property', 'name', 'Admin')

    cy.wrap(42).should('be.greaterThan', 0)
  })

  // ---------------------------------------------------------------------------
  // Execute a Cypress task (Node.js-side code)
  // Framework tasks: readExcel, readExcelRow, readExcelRows
  // ---------------------------------------------------------------------------
  it('execute task', () => {
    cy.task('readExcel', { file: 'users.xlsx', sheet: 'LoginUsers' }).then((rows) => {
      expect(rows.length).to.be.greaterThan(0)
    })
  })

  // ---------------------------------------------------------------------------
  // Spy and stub
  // ---------------------------------------------------------------------------
  it('spy and stub methods', () => {
    cy.window().then((win) => {
      // Spy — observes calls without changing behaviour
      cy.spy(win.console, 'log').as('consoleSpy')

      // Stub — replaces the method with a controlled fake
      cy.stub(win, 'open').as('windowOpen').returns(null)

      cy.wrap(null).then(() => {
        win.console.log('test message')
        expect(win.console.log).to.be.calledWith('test message')
      })
    })
  })

  // ---------------------------------------------------------------------------
  // Clock and tick — freeze time for date/timer dependent tests
  // ---------------------------------------------------------------------------
  it('clock control and tick', () => {
    cy.clock() // freeze the clock
    cy.tick(5000) // advance 5 seconds

    // Useful for testing session timeouts, countdown timers, debounce logic
    cy.clock(new Date('2025-01-01').getTime()) // set clock to specific date
  })

  // ---------------------------------------------------------------------------
  // Environment variables and config
  // ---------------------------------------------------------------------------
  it('read environment variables and config', () => {
    const username = Cypress.env('validUsername') // Cypress.env('KEY')
    const baseUrl = Cypress.config('baseUrl') // Cypress.config('key')

    cy.log(`Username from env: ${username}`)
    cy.log(`BaseUrl from config: ${baseUrl}`)

    expect(baseUrl).to.include('orangehrmlive')
  })

  // ---------------------------------------------------------------------------
  // Skip a test conditionally
  // Framework: page.skipTest(condition, reason) — logs and throws
  // Raw Cypress: this.skip()
  // ---------------------------------------------------------------------------
  it('skip test conditionally', function () {
    // Raw Cypress skip (must use function keyword, not arrow function)
    const isProduction = Cypress.env('ENV') === 'prod'
    if (isProduction) this.skip()

    // Framework method (works with arrow functions)
    page.skipTest(false, 'Skipping this on staging') // condition=false → does not skip

    cy.log('Test continues here')
  })

  // ---------------------------------------------------------------------------
  // Soft assertion — logs failure but does not stop the test
  // Framework: page.softAssert(condition, message)
  // ---------------------------------------------------------------------------
  it('soft assertion', () => {
    page.softAssert(1 + 1 === 2, 'Basic math works') // passes silently
    page.softAssert(1 + 1 === 3, 'This is wrong') // logs failure, test continues
    cy.log('Test continues after soft assert failure')
  })

  // ---------------------------------------------------------------------------
  // Run only on a specific environment
  // Framework: page.runOnlyOn(environment, testFn)
  // ---------------------------------------------------------------------------
  it('run only on specific environment', () => {
    page.runOnlyOn('staging', () => {
      cy.log('This block only runs when ENV=staging')
    })
  })
})
