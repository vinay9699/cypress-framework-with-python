// =============================================================================
// BasePage.js — Base Class for All Page Objects
// =============================================================================
// Every Page Object extends this class and inherits ALL methods below.
//
//   class LoginPage    extends BasePage { ... }
//   class DashboardPage extends BasePage { ... }
//
// Categories of methods in this file:
//   1.  NAVIGATION          — visit, reload, back, forward, open new tab
//   2.  WAITING             — wait for element, text, URL, API response
//   3.  CLICKING            — click, double-click, right-click, force-click
//   4.  TYPING              — type, clear+type, tab through, paste
//   5.  KEYBOARD            — press key, keyboard shortcuts
//   6.  HOVER & FOCUS       — hover over element, focus, blur
//   7.  DROPDOWNS           — native select, custom dropdown, multi-select
//   8.  CHECKBOXES & RADIO  — check, uncheck, toggle, select radio
//   9.  FILE UPLOAD         — single file, multiple files
//   10. SCROLLING           — scroll to element, to top, to bottom, by pixels
//   11. ASSERTIONS          — visible, hidden, text, count, URL, attribute, CSS
//   12. ATTRIBUTE & CSS     — read attribute value, CSS property value
//   13. TABLES              — get cell, get row, get column, verify cell text
//   14. ALERTS & DIALOGS    — browser alert, confirm, prompt
//   15. FRAMES (iframes)    — interact with elements inside an iframe
//   16. CLIPBOARD           — read clipboard content
//   17. LOCAL STORAGE       — get/set/remove localStorage items
//   18. COOKIES             — get/set/delete cookies
//   19. SCREENSHOTS         — take named screenshot
//   20. MISCELLANEOUS       — get count, get text, get attribute value
// =============================================================================

class BasePage {

  // ===========================================================================
  // 1. NAVIGATION
  // ===========================================================================

  /**
   * Navigate to a relative URL path.
   * The baseUrl from cypress.config.js is automatically prepended.
   *
   * Usage: this.navigateTo('/web/index.php/auth/login')
   */
  navigateTo(path) {
    cy.visit(path)
  }

  /**
   * Navigate to a full absolute URL (overrides baseUrl).
   *
   * Usage: this.navigateToFullUrl('https://google.com')
   */
  navigateToFullUrl(url) {
    cy.visit(url)
  }

  /**
   * Reload / refresh the current page.
   * Use this to test that data persists after a page refresh.
   */
  reloadPage() {
    cy.reload()
  }

  /**
   * Click the browser Back button.
   * Use this to verify navigation history works correctly.
   */
  goBack() {
    cy.go('back')
  }

  /**
   * Click the browser Forward button.
   */
  goForward() {
    cy.go('forward')
  }

  /**
   * Get the current page URL as a Cypress chainable.
   *
   * Usage: this.getCurrentUrl().then(url => expect(url).to.include('/dashboard'))
   */
  getCurrentUrl() {
    return cy.url()
  }

  /**
   * Get the current page title as a Cypress chainable.
   *
   * Usage: this.getPageTitle().then(title => expect(title).to.equal('OrangeHRM'))
   */
  getPageTitle() {
    return cy.title()
  }

  // ===========================================================================
  // 2. WAITING
  // ===========================================================================

  /**
   * Wait for an element to exist and be VISIBLE.
   * Prevents flakiness caused by elements not yet rendered or animating in.
   *
   * Usage: this.waitForElement('.oxd-topbar-header')
   *
   * @param {string} selector - CSS selector
   * @param {number} timeout  - max wait time in ms (default: 8000)
   */
  waitForElement(selector, timeout = 8000) {
    return cy.get(selector, { timeout }).should('be.visible')
  }

  /**
   * Wait for an element to exist in the DOM (even if not visible).
   * Use this for hidden elements you need to interact with via force.
   *
   * @param {string} selector - CSS selector
   * @param {number} timeout  - max wait time in ms (default: 8000)
   */
  waitForElementToExist(selector, timeout = 8000) {
    return cy.get(selector, { timeout }).should('exist')
  }

  /**
   * Wait for an element to disappear completely from the DOM.
   * Perfect for waiting on loading spinners, overlays, or modals to close.
   *
   * Usage: this.waitForElementToDisappear('.oxd-loading-spinner')
   *
   * @param {string} selector - CSS selector
   * @param {number} timeout  - max wait time in ms (default: 15000)
   */
  waitForElementToDisappear(selector, timeout = 15000) {
    return cy.get(selector, { timeout }).should('not.exist')
  }

  /**
   * Wait for an element to contain specific text.
   * Useful when content loads asynchronously (e.g. from an API call).
   *
   * Usage: this.waitForText('.oxd-userdropdown-name', 'Admin')
   *
   * @param {string} selector     - CSS selector
   * @param {string} expectedText - text to wait for
   * @param {number} timeout      - max wait time in ms (default: 8000)
   */
  waitForText(selector, expectedText, timeout = 8000) {
    return cy.get(selector, { timeout }).should('contain.text', expectedText)
  }

  /**
   * Wait for the URL to contain an expected string.
   * Use after clicks that trigger navigation, to confirm the route changed.
   *
   * Usage: this.waitForUrl('/dashboard/index')
   *
   * @param {string} expectedPath - URL fragment to wait for
   * @param {number} timeout      - max wait time in ms (default: 10000)
   */
  waitForUrl(expectedPath, timeout = 10000) {
    cy.url({ timeout }).should('include', expectedPath)
  }

  /**
   * Pause test execution for a fixed number of milliseconds.
   *
   * IMPORTANT: Only use this as a LAST RESORT when no waitFor* method works.
   * Hard waits make tests slow and brittle. Always prefer waitForElement() etc.
   *
   * Usage: this.hardWait(1000)   // waits exactly 1 second
   *
   * @param {number} ms - milliseconds to wait
   */
  hardWait(ms) {
    cy.wait(ms)
  }

  // ===========================================================================
  // 3. CLICKING
  // ===========================================================================

  /**
   * Wait for an element to be visible, then click it.
   *
   * Usage: this.clickElement('[type="submit"]')
   *
   * @param {string} selector - CSS selector
   */
  clickElement(selector) {
    this.waitForElement(selector).click()
  }

  /**
   * Double-click an element.
   * Use this for actions that require a double-click (e.g. inline edit).
   *
   * Usage: this.doubleClick('.editable-cell')
   *
   * @param {string} selector - CSS selector
   */
  doubleClick(selector) {
    cy.get(selector).dblclick()
  }

  /**
   * Right-click an element to open its context menu.
   *
   * Usage: this.rightClick('.file-item')
   *
   * @param {string} selector - CSS selector
   */
  rightClick(selector) {
    cy.get(selector).rightclick()
  }

  /**
   * Force-click an element even if it is covered, hidden, or disabled.
   * Use this ONLY when the element is technically interactive but
   * Cypress cannot click it normally (e.g. overlapping elements).
   *
   * Usage: this.forceClick('.hidden-trigger')
   *
   * @param {string} selector - CSS selector
   */
  forceClick(selector) {
    cy.get(selector).click({ force: true })
  }

  /**
   * Click an element containing specific text (finds by text content).
   *
   * Usage: this.clickByText('button', 'Save')
   *
   * @param {string} tag  - HTML tag to search within (e.g. 'button', 'a', 'li')
   * @param {string} text - visible text of the element to click
   */
  clickByText(tag, text) {
    cy.contains(tag, text).click()
  }

  /**
   * Scroll an element into the viewport, then click it.
   * Use this for buttons or links below the visible screen area.
   *
   * Usage: this.scrollAndClick('.save-button')
   *
   * @param {string} selector - CSS selector
   */
  scrollAndClick(selector) {
    cy.get(selector).scrollIntoView().click()
  }

  /**
   * Click the nth element in a list of matching elements (0-indexed).
   * Use this when multiple elements share the same selector and you need a specific one.
   *
   * Usage: this.clickNthElement('.oxd-table-row', 0)  // clicks the first row
   *
   * @param {string} selector - CSS selector
   * @param {number} index    - zero-based index of the element to click
   */
  clickNthElement(selector, index) {
    cy.get(selector).eq(index).click()
  }

  // ===========================================================================
  // 4. TYPING
  // ===========================================================================

  /**
   * Clear a field and type new text into it.
   * The most common way to fill in any input in your tests.
   *
   * Usage: this.typeInto('[name="username"]', 'Admin')
   *
   * @param {string} selector - CSS selector
   * @param {string} text     - text to type
   */
  typeInto(selector, text) {
    this.waitForElement(selector).clear().type(text)
  }

  /**
   * Type text WITHOUT clearing first — appends to whatever is already there.
   * Use this when you want to add to an existing value.
   *
   * Usage: this.appendText('[name="notes"]', ' additional text')
   *
   * @param {string} selector - CSS selector
   * @param {string} text     - text to append
   */
  appendText(selector, text) {
    cy.get(selector).type(text)
  }

  /**
   * Clear an input field completely.
   *
   * Usage: this.clearField('[name="username"]')
   *
   * @param {string} selector - CSS selector
   */
  clearField(selector) {
    cy.get(selector).clear()
  }

  /**
   * Type text slowly — one character at a time with a delay between each.
   * Useful for inputs that use autocomplete / type-ahead suggestions.
   *
   * Usage: this.typeSlowly('[name="search"]', 'John', 100)
   *
   * @param {string} selector  - CSS selector
   * @param {string} text      - text to type
   * @param {number} delayMs   - delay between keystrokes in ms (default: 80)
   */
  typeSlowly(selector, text, delayMs = 80) {
    cy.get(selector).clear().type(text, { delay: delayMs })
  }

  /**
   * Simulate pasting text into a field using the native clipboard paste event.
   * Some fields block .type() but allow paste — this handles that case.
   *
   * Usage: this.pasteText('[name="description"]', 'Pasted content here')
   *
   * @param {string} selector - CSS selector
   * @param {string} text     - text to paste
   */
  pasteText(selector, text) {
    cy.get(selector).invoke('val', text).trigger('input').trigger('change')
  }

  // ===========================================================================
  // 5. KEYBOARD
  // ===========================================================================

  /**
   * Press a keyboard key on the currently focused element.
   * Key names: 'Enter', 'Tab', 'Escape', 'ArrowDown', 'ArrowUp', 'Space',
   *            'Backspace', 'Delete', '{ctrl}a', '{shift}{home}', etc.
   *
   * Usage: this.pressKey('{Enter}')
   *        this.pressKey('{Escape}')
   *
   * @param {string} key      - the key or key combination to press
   * @param {string} selector - CSS selector of the target element (optional)
   */
  pressKey(key, selector = 'body') {
    cy.get(selector).type(key)
  }

  /**
   * Press Tab to move focus to the next focusable element.
   * Use this to test keyboard navigation and field tab order.
   *
   * Usage: this.pressTab('[name="username"]')
   *
   * @param {string} selector - CSS selector of the element to start from
   */
  pressTab(selector) {
    cy.get(selector).type('{tab}')
  }

  /**
   * Press Enter on an element (e.g. submit a form without clicking the button).
   *
   * Usage: this.pressEnter('[name="search"]')
   *
   * @param {string} selector - CSS selector
   */
  pressEnter(selector) {
    cy.get(selector).type('{enter}')
  }

  /**
   * Press Escape — commonly used to close modals, dropdowns, or dialogs.
   *
   * Usage: this.pressEscape()
   */
  pressEscape() {
    cy.get('body').type('{esc}')
  }

  /**
   * Select all text in an element using Ctrl+A (or Cmd+A on Mac).
   *
   * Usage: this.selectAllText('[name="description"]')
   *
   * @param {string} selector - CSS selector
   */
  selectAllText(selector) {
    cy.get(selector).type('{selectAll}')
  }

  // ===========================================================================
  // 6. HOVER & FOCUS
  // ===========================================================================

  /**
   * Hover over an element to trigger its hover/tooltip state.
   * Uses the 'mouseover' event since Cypress does not have a native hover().
   *
   * Usage: this.hoverOver('.tooltip-trigger')
   *
   * @param {string} selector - CSS selector
   */
  hoverOver(selector) {
    cy.get(selector).trigger('mouseover')
  }

  /**
   * Move the mouse away from an element (mouseout) — the opposite of hover.
   * Use this to close tooltips or undo hover states.
   *
   * Usage: this.mouseOut('.tooltip-trigger')
   *
   * @param {string} selector - CSS selector
   */
  mouseOut(selector) {
    cy.get(selector).trigger('mouseout')
  }

  /**
   * Focus on an input element (simulates clicking into it).
   * Useful for testing focus-triggered UI behavior (e.g. dropdown opens on focus).
   *
   * Usage: this.focusElement('[name="username"]')
   *
   * @param {string} selector - CSS selector
   */
  focusElement(selector) {
    cy.get(selector).focus()
  }

  /**
   * Remove focus from an element (simulate clicking away).
   * Use this to trigger validation messages that appear on blur.
   *
   * Usage: this.blurElement('[name="email"]')
   *
   * @param {string} selector - CSS selector
   */
  blurElement(selector) {
    cy.get(selector).blur()
  }

  // ===========================================================================
  // 7. DROPDOWNS
  // ===========================================================================

  /**
   * Select an option from a native HTML <select> element by its visible text.
   *
   * Usage: this.selectNativeDropdown('select[name="country"]', 'United States')
   *
   * @param {string} selector   - CSS selector of the <select> element
   * @param {string} optionText - visible text of the option to select
   */
  selectNativeDropdown(selector, optionText) {
    cy.get(selector).select(optionText)
  }

  /**
   * Select an option from a native <select> element by its VALUE attribute.
   *
   * Usage: this.selectNativeDropdownByValue('select[name="status"]', 'active')
   *
   * @param {string} selector    - CSS selector of the <select> element
   * @param {string} optionValue - value attribute of the option to select
   */
  selectNativeDropdownByValue(selector, optionValue) {
    cy.get(selector).select(optionValue)
  }

  /**
   * Select an option from OrangeHRM's custom Vue .oxd-select dropdown.
   * These are NOT native <select> elements — they are styled divs that
   * require a click to open and then another click on the desired option.
   *
   * Usage: this.selectCustomDropdown('.oxd-select-wrapper', 'Full Time')
   *
   * @param {string} containerSelector - selector of the dropdown wrapper div
   * @param {string} optionText        - visible text of the option to select
   */
  selectCustomDropdown(containerSelector, optionText) {
    cy.get(containerSelector).click()
    cy.get('.oxd-select-dropdown')
      .should('be.visible')
      .contains(optionText)
      .click()
  }

  /**
   * Verify that a native <select> element currently has a specific option selected.
   *
   * Usage: this.verifyDropdownSelection('select[name="status"]', 'Active')
   *
   * @param {string} selector     - CSS selector of the <select> element
   * @param {string} expectedText - the text of the expected selected option
   */
  verifyDropdownSelection(selector, expectedText) {
    cy.get(selector).find('option:selected').should('have.text', expectedText)
  }

  // ===========================================================================
  // 8. CHECKBOXES & RADIO BUTTONS
  // ===========================================================================

  /**
   * Check a checkbox that is currently unchecked.
   *
   * Usage: this.checkCheckbox('[name="rememberMe"]')
   *
   * @param {string} selector - CSS selector
   */
  checkCheckbox(selector) {
    cy.get(selector).check()
  }

  /**
   * Uncheck a checkbox that is currently checked.
   *
   * @param {string} selector - CSS selector
   */
  uncheckCheckbox(selector) {
    cy.get(selector).uncheck()
  }

  /**
   * Assert whether a checkbox is checked or unchecked.
   *
   * Usage: this.verifyCheckboxState('[name="rememberMe"]', true)
   *        this.verifyCheckboxState('[name="rememberMe"]', false)
   *
   * @param {string}  selector  - CSS selector
   * @param {boolean} isChecked - true = assert checked, false = assert unchecked
   */
  verifyCheckboxState(selector, isChecked) {
    if (isChecked) {
      cy.get(selector).should('be.checked')
    } else {
      cy.get(selector).should('not.be.checked')
    }
  }

  /**
   * Select a radio button by its value attribute.
   *
   * Usage: this.selectRadioButton('[name="gender"]', 'Male')
   *
   * @param {string} selector - CSS selector (targets the radio group)
   * @param {string} value    - value attribute of the radio to select
   */
  selectRadioButton(selector, value) {
    cy.get(selector).check(value)
  }

  /**
   * Assert that a specific radio button is selected.
   *
   * @param {string} selector - CSS selector of the specific radio input
   */
  verifyRadioSelected(selector) {
    cy.get(selector).should('be.checked')
  }

  // ===========================================================================
  // 9. FILE UPLOAD
  // ===========================================================================

  /**
   * Upload a single file to a file input element.
   * The file must exist in the cypress/fixtures/ folder.
   *
   * Usage: this.uploadFile('input[type="file"]', 'sample.pdf')
   *
   * @param {string} selector - CSS selector of the <input type="file"> element
   * @param {string} fileName - name of the file in cypress/fixtures/
   */
  uploadFile(selector, fileName) {
    cy.get(selector).selectFile(`cypress/fixtures/${fileName}`)
  }

  /**
   * Upload multiple files at once to a file input element.
   * All files must exist in the cypress/fixtures/ folder.
   *
   * Usage: this.uploadMultipleFiles('input[type="file"]', ['photo.jpg', 'doc.pdf'])
   *
   * @param {string}   selector   - CSS selector of the <input type="file"> element
   * @param {string[]} fileNames  - array of file names in cypress/fixtures/
   */
  uploadMultipleFiles(selector, fileNames) {
    const filePaths = fileNames.map((f) => `cypress/fixtures/${f}`)
    cy.get(selector).selectFile(filePaths)
  }

  /**
   * Simulate dropping a file onto a drag-and-drop zone element.
   *
   * Usage: this.dropFile('.upload-dropzone', 'sample.pdf')
   *
   * @param {string} selector - CSS selector of the drop zone element
   * @param {string} fileName - name of the file in cypress/fixtures/
   */
  dropFile(selector, fileName) {
    cy.get(selector).selectFile(`cypress/fixtures/${fileName}`, { action: 'drag-drop' })
  }

  // ===========================================================================
  // 10. SCROLLING
  // ===========================================================================

  /**
   * Scroll an element into the visible viewport.
   * Cypress must be able to see an element to interact with it.
   *
   * Usage: this.scrollToElement('.save-button')
   *
   * @param {string} selector - CSS selector
   */
  scrollToElement(selector) {
    cy.get(selector).scrollIntoView()
  }

  /**
   * Scroll the entire page to the very top.
   */
  scrollToTop() {
    cy.scrollTo('top')
  }

  /**
   * Scroll the entire page to the very bottom.
   * Useful for triggering infinite scroll / lazy load.
   */
  scrollToBottom() {
    cy.scrollTo('bottom')
  }

  /**
   * Scroll the page by a specific number of pixels.
   *
   * Usage: this.scrollByPixels(0, 500)   // scroll down 500px
   *
   * @param {number} x - horizontal scroll distance in pixels
   * @param {number} y - vertical scroll distance in pixels
   */
  scrollByPixels(x, y) {
    cy.scrollTo(x, y)
  }

  // ===========================================================================
  // 11. ASSERTIONS
  // ===========================================================================

  /**
   * Assert the current URL contains an expected path segment.
   *
   * Usage: this.verifyUrl('/dashboard/index')
   *
   * @param {string} expectedPath - URL fragment to check for
   */
  verifyUrl(expectedPath) {
    cy.url().should('include', expectedPath)
  }

  /**
   * Assert the current URL matches exactly (full URL).
   *
   * Usage: this.verifyExactUrl('https://example.com/login')
   *
   * @param {string} fullUrl - the exact full URL expected
   */
  verifyExactUrl(fullUrl) {
    cy.url().should('eq', fullUrl)
  }

  /**
   * Assert the browser tab title contains an expected string.
   *
   * Usage: this.verifyPageTitle('OrangeHRM')
   *
   * @param {string} expectedTitle - title fragment to check for
   */
  verifyPageTitle(expectedTitle) {
    cy.title().should('include', expectedTitle)
  }

  /**
   * Assert an element IS visible on the page.
   *
   * Usage: this.verifyVisible('.oxd-topbar-header')
   *
   * @param {string} selector - CSS selector
   */
  verifyVisible(selector) {
    cy.get(selector).should('be.visible')
  }

  /**
   * Assert an element is NOT visible (exists in DOM but hidden).
   *
   * @param {string} selector - CSS selector
   */
  verifyNotVisible(selector) {
    cy.get(selector).should('not.be.visible')
  }

  /**
   * Assert an element does NOT exist in the DOM at all.
   *
   * Usage: this.verifyDoesNotExist('.error-banner')
   *
   * @param {string} selector - CSS selector
   */
  verifyDoesNotExist(selector) {
    cy.get(selector).should('not.exist')
  }

  /**
   * Assert an element contains specific text (partial match).
   *
   * Usage: this.verifyText('.oxd-userdropdown-name', 'Admin')
   *
   * @param {string} selector     - CSS selector
   * @param {string} expectedText - text the element should contain
   */
  verifyText(selector, expectedText) {
    cy.get(selector).should('contain.text', expectedText)
  }

  /**
   * Assert an element has EXACTLY this text (no partial match).
   *
   * Usage: this.verifyExactText('.validation-msg', 'Required')
   *
   * @param {string} selector     - CSS selector
   * @param {string} expectedText - the exact text expected
   */
  verifyExactText(selector, expectedText) {
    cy.get(selector).should('have.text', expectedText)
  }

  /**
   * Assert the number of elements matching a selector.
   *
   * Usage: this.verifyElementCount('.oxd-table-row', 5)
   *
   * @param {string} selector      - CSS selector
   * @param {number} expectedCount - how many elements should match
   */
  verifyElementCount(selector, expectedCount) {
    cy.get(selector).should('have.length', expectedCount)
  }

  /**
   * Assert the number of matching elements is GREATER THAN a minimum.
   *
   * Usage: this.verifyElementCountGreaterThan('.result-row', 0)
   *
   * @param {string} selector - CSS selector
   * @param {number} min      - the count must be greater than this number
   */
  verifyElementCountGreaterThan(selector, min) {
    cy.get(selector).its('length').should('be.gt', min)
  }

  /**
   * Assert an element is ENABLED (not disabled).
   * Use this to verify buttons become clickable after a form is filled in.
   *
   * Usage: this.verifyEnabled('[type="submit"]')
   *
   * @param {string} selector - CSS selector
   */
  verifyEnabled(selector) {
    cy.get(selector).should('not.be.disabled')
  }

  /**
   * Assert an element is DISABLED.
   * Use this to verify read-only or locked fields.
   *
   * Usage: this.verifyDisabled('[name="employeeId"]')
   *
   * @param {string} selector - CSS selector
   */
  verifyDisabled(selector) {
    cy.get(selector).should('be.disabled')
  }

  /**
   * Assert an element has a specific HTML attribute set to a specific value.
   *
   * Usage: this.verifyAttribute('input[name="email"]', 'type', 'email')
   *        this.verifyAttribute('img.logo', 'alt', 'OrangeHRM')
   *
   * @param {string} selector        - CSS selector
   * @param {string} attributeName   - the attribute to check (e.g. 'type', 'href', 'alt')
   * @param {string} expectedValue   - the expected value of that attribute
   */
  verifyAttribute(selector, attributeName, expectedValue) {
    cy.get(selector).should('have.attr', attributeName, expectedValue)
  }

  /**
   * Assert an element has a specific CSS property set to a specific value.
   *
   * Usage: this.verifyCssProperty('.submit-btn', 'background-color', 'rgb(255, 123, 29)')
   *
   * @param {string} selector       - CSS selector
   * @param {string} property       - CSS property name (e.g. 'color', 'display')
   * @param {string} expectedValue  - expected CSS value
   */
  verifyCssProperty(selector, property, expectedValue) {
    cy.get(selector).should('have.css', property, expectedValue)
  }

  /**
   * Assert an element has a specific CSS class applied.
   *
   * Usage: this.verifyHasClass('.nav-item', 'active')
   *
   * @param {string} selector   - CSS selector
   * @param {string} className  - the class name to check for (without the dot)
   */
  verifyHasClass(selector, className) {
    cy.get(selector).should('have.class', className)
  }

  /**
   * Assert an element does NOT have a specific CSS class.
   *
   * Usage: this.verifyDoesNotHaveClass('.nav-item', 'disabled')
   *
   * @param {string} selector   - CSS selector
   * @param {string} className  - the class name that should be absent
   */
  verifyDoesNotHaveClass(selector, className) {
    cy.get(selector).should('not.have.class', className)
  }

  /**
   * Assert an input field's current value equals an expected string.
   *
   * Usage: this.verifyInputValue('[name="username"]', 'Admin')
   *
   * @param {string} selector       - CSS selector
   * @param {string} expectedValue  - expected value of the input
   */
  verifyInputValue(selector, expectedValue) {
    cy.get(selector).should('have.value', expectedValue)
  }

  /**
   * Assert an input field is empty (has no value).
   *
   * Usage: this.verifyInputIsEmpty('[name="search"]')
   *
   * @param {string} selector - CSS selector
   */
  verifyInputIsEmpty(selector) {
    cy.get(selector).should('have.value', '')
  }

  /**
   * Assert that an element is focused (has browser focus).
   * Use this to test keyboard navigation and accessibility.
   *
   * Usage: this.verifyFocused('[name="username"]')
   *
   * @param {string} selector - CSS selector
   */
  verifyFocused(selector) {
    cy.get(selector).should('be.focused')
  }

  /**
   * Assert that a link element has the correct href URL.
   *
   * Usage: this.verifyLinkHref('.logo-link', 'https://www.orangehrm.com')
   *
   * @param {string} selector      - CSS selector of the <a> element
   * @param {string} expectedHref  - expected href attribute value
   */
  verifyLinkHref(selector, expectedHref) {
    cy.get(selector).should('have.attr', 'href', expectedHref)
  }

  /**
   * Assert that a link opens in a new browser tab.
   * Checks that the target attribute is "_blank".
   *
   * Usage: this.verifyOpensInNewTab('.external-link')
   *
   * @param {string} selector - CSS selector of the <a> element
   */
  verifyOpensInNewTab(selector) {
    cy.get(selector).should('have.attr', 'target', '_blank')
  }

  /**
   * Assert that an image element has actually loaded (is not broken).
   *
   * Usage: this.verifyImageLoaded('.logo img')
   *
   * @param {string} selector - CSS selector of the <img> element
   */
  verifyImageLoaded(selector) {
    cy.get(selector).should(($img) => {
      expect($img[0].naturalWidth).to.be.greaterThan(0)
    })
  }

  // ===========================================================================
  // 12. READING VALUES FROM THE PAGE
  // ===========================================================================

  /**
   * Read the text content of an element and pass it to a callback.
   *
   * Usage:
   *   this.getElementText('.page-heading').then(text => {
   *     expect(text).to.include('Dashboard')
   *   })
   *
   * @param {string} selector - CSS selector
   */
  getElementText(selector) {
    return cy.get(selector).invoke('text')
  }

  /**
   * Read the value of an HTML attribute from an element.
   *
   * Usage:
   *   this.getAttributeValue('img.logo', 'src').then(src => {
   *     expect(src).to.include('/images/logo.png')
   *   })
   *
   * @param {string} selector       - CSS selector
   * @param {string} attributeName  - attribute to read (e.g. 'href', 'src', 'value')
   */
  getAttributeValue(selector, attributeName) {
    return cy.get(selector).invoke('attr', attributeName)
  }

  /**
   * Get the current value of an input field.
   *
   * Usage:
   *   this.getInputValue('[name="username"]').then(val => {
   *     expect(val).to.equal('Admin')
   *   })
   *
   * @param {string} selector - CSS selector
   */
  getInputValue(selector) {
    return cy.get(selector).invoke('val')
  }

  /**
   * Get the total count of elements matching a selector.
   *
   * Usage:
   *   this.getElementCount('.oxd-table-row').then(count => {
   *     expect(count).to.be.greaterThan(0)
   *   })
   *
   * @param {string} selector - CSS selector
   */
  getElementCount(selector) {
    return cy.get(selector).its('length')
  }

  // ===========================================================================
  // 13. TABLES
  // ===========================================================================

  /**
   * Get a specific cell from a table by row and column index (both 0-based).
   *
   * Usage: this.getTableCell('table', 0, 1)  // row 0, column 1
   *
   * @param {string} tableSelector - CSS selector of the <table> element
   * @param {number} rowIndex      - zero-based row index
   * @param {number} colIndex      - zero-based column index
   */
  getTableCell(tableSelector, rowIndex, colIndex) {
    return cy.get(tableSelector)
      .find('tr').eq(rowIndex)
      .find('td').eq(colIndex)
  }

  /**
   * Verify text in a specific table cell by row and column index (both 0-based).
   *
   * Usage: this.verifyTableCellText('table', 0, 2, 'John Smith')
   *
   * @param {string} tableSelector - CSS selector of the <table> element
   * @param {number} rowIndex      - zero-based row index
   * @param {number} colIndex      - zero-based column index
   * @param {string} expectedText  - text expected in that cell
   */
  verifyTableCellText(tableSelector, rowIndex, colIndex, expectedText) {
    this.getTableCell(tableSelector, rowIndex, colIndex)
      .should('contain.text', expectedText)
  }

  /**
   * Get all cells in a specific column of a table.
   * Use .then() to iterate or assert on all values in that column.
   *
   * Usage:
   *   this.getTableColumnValues('table', 1).then($cells => {
   *     $cells.each((i, cell) => { expect(cell.text).to.not.be.empty })
   *   })
   *
   * @param {string} tableSelector - CSS selector of the <table> element
   * @param {number} colIndex      - zero-based column index
   */
  getTableColumnValues(tableSelector, colIndex) {
    return cy.get(tableSelector)
      .find('tr')
      .find(`td:nth-child(${colIndex + 1})`)
  }

  // ===========================================================================
  // 14. ALERTS & BROWSER DIALOGS
  // ===========================================================================

  /**
   * Accept (click OK on) a browser alert or confirm dialog.
   * Must be called BEFORE the action that triggers the alert.
   *
   * Usage:
   *   this.acceptAlert()
   *   this.clickElement('.delete-button')  // this triggers the alert
   */
  acceptAlert() {
    cy.on('window:confirm', () => true)
  }

  /**
   * Dismiss (click Cancel on) a browser confirm dialog.
   * Must be called BEFORE the action that triggers the dialog.
   *
   * Usage:
   *   this.dismissAlert()
   *   this.clickElement('.delete-button')
   */
  dismissAlert() {
    cy.on('window:confirm', () => false)
  }

  /**
   * Verify the text message shown in a browser alert/confirm dialog.
   * Must be called BEFORE the action that triggers the alert.
   *
   * Usage:
   *   this.verifyAlertText('Are you sure you want to delete?')
   *   this.clickElement('.delete-button')
   *
   * @param {string} expectedText - expected text of the alert
   */
  verifyAlertText(expectedText) {
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.include(expectedText)
    })
  }

  // ===========================================================================
  // 15. IFRAMES
  // ===========================================================================

  /**
   * Find an element INSIDE an iframe and return it for further interaction.
   * Standard cy.get() cannot reach elements inside iframes — use this instead.
   *
   * Usage:
   *   this.getInsideIframe('#my-iframe', '#submit-btn').click()
   *
   * @param {string} iframeSelector   - CSS selector of the <iframe> element
   * @param {string} elementSelector  - CSS selector of the element INSIDE the iframe
   */
  getInsideIframe(iframeSelector, elementSelector) {
    return cy.get(iframeSelector)
      .its('0.contentDocument.body')
      .should('not.be.empty')
      .then(cy.wrap)
      .find(elementSelector)
  }

  // ===========================================================================
  // 16. LOCAL STORAGE
  // ===========================================================================

  /**
   * Get a value from the browser's localStorage by key.
   *
   * Usage:
   *   this.getLocalStorageItem('authToken').then(token => {
   *     expect(token).to.not.be.null
   *   })
   *
   * @param {string} key - the localStorage key to read
   */
  getLocalStorageItem(key) {
    return cy.window().its(`localStorage.${key}`)
  }

  /**
   * Set a value in the browser's localStorage.
   * Use this to pre-populate state instead of going through the UI.
   *
   * Usage: this.setLocalStorageItem('featureFlag', 'true')
   *
   * @param {string} key   - the localStorage key
   * @param {string} value - the value to store
   */
  setLocalStorageItem(key, value) {
    cy.window().then((win) => win.localStorage.setItem(key, value))
  }

  /**
   * Remove a specific key from localStorage.
   *
   * Usage: this.removeLocalStorageItem('authToken')
   *
   * @param {string} key - the localStorage key to remove
   */
  removeLocalStorageItem(key) {
    cy.window().then((win) => win.localStorage.removeItem(key))
  }

  // ===========================================================================
  // 17. COOKIES
  // ===========================================================================

  /**
   * Get the value of a specific browser cookie.
   *
   * Usage:
   *   this.getCookie('session_id').then(cookie => {
   *     expect(cookie.value).to.not.be.empty
   *   })
   *
   * @param {string} name - the cookie name
   */
  getCookie(name) {
    return cy.getCookie(name)
  }

  /**
   * Set a browser cookie with a given name and value.
   *
   * Usage: this.setCookie('consent', 'accepted')
   *
   * @param {string} name  - cookie name
   * @param {string} value - cookie value
   */
  setCookie(name, value) {
    cy.setCookie(name, value)
  }

  /**
   * Delete a specific browser cookie by name.
   *
   * Usage: this.deleteCookie('session_id')
   *
   * @param {string} name - cookie name to delete
   */
  deleteCookie(name) {
    cy.clearCookie(name)
  }

  /**
   * Assert a specific cookie exists and has the expected value.
   *
   * Usage: this.verifyCookie('consent', 'accepted')
   *
   * @param {string} name          - cookie name
   * @param {string} expectedValue - expected cookie value
   */
  verifyCookie(name, expectedValue) {
    cy.getCookie(name).should('have.property', 'value', expectedValue)
  }

  // ===========================================================================
  // 18. SCREENSHOTS
  // ===========================================================================

  /**
   * Take a named screenshot and save it to cypress/screenshots/.
   * Useful for capturing evidence at key points in a test.
   *
   * Usage: this.takeScreenshot('after-login')
   *
   * @param {string} name - filename for the screenshot (no extension needed)
   */
  takeScreenshot(name) {
    cy.screenshot(name)
  }

  /**
   * Take a screenshot of a specific element only (crops to that element).
   *
   * Usage: this.takeElementScreenshot('.oxd-table', 'results-table')
   *
   * @param {string} selector - CSS selector of the element to capture
   * @param {string} name     - filename for the screenshot
   */
  takeElementScreenshot(selector, name) {
    cy.get(selector).screenshot(name)
  }

  // ===========================================================================
  // 19. ALIASES — friendly names matching the standard method list
  // These call the existing methods above under the exact names
  // documented in the framework reference table.
  // ===========================================================================

  /** Alias for goBack() — matches navigateBack() naming convention */
  navigateBack() { this.goBack() }

  /** Alias for goForward() — matches navigateForward() naming convention */
  navigateForward() { this.goForward() }

  /** Alias for typeInto() — matches typeText() naming convention */
  typeText(selector, text) { this.typeInto(selector, text) }

  /** Alias for typeInto() with clear — matches clearAndType() naming convention */
  clearAndType(selector, text) { this.typeInto(selector, text) }

  /**
   * Unified selectDropdown — delegates to native or custom dropdown.
   * If the selector targets a <select> element use native; otherwise custom.
   *
   * Usage: this.selectDropdown('select[name="status"]', 'Active')
   *        this.selectDropdown('.oxd-select-wrapper', 'Full Time')
   *
   * @param {string} selector - CSS selector
   * @param {string} value    - option text to select
   */
  selectDropdown(selector, value) {
    cy.get(selector).then(($el) => {
      if ($el.is('select')) {
        cy.wrap($el).select(value)
      } else {
        this.selectCustomDropdown(selector, value)
      }
    })
  }

  /** Alias for waitForElement() — matches waitForElementVisible() convention */
  waitForElementVisible(selector, timeout = 8000) {
    return this.waitForElement(selector, timeout)
  }

  /** Alias for verifyVisible() — matches verifyElementVisible() convention */
  verifyElementVisible(selector) { this.verifyVisible(selector) }

  /** Alias for verifyNotVisible() — matches verifyElementNotVisible() convention */
  verifyElementNotVisible(selector) { this.verifyNotVisible(selector) }

  /** Alias for verifyUrl() — explicit verifyUrlContains name for clarity */
  verifyUrlContains(partial) { this.verifyUrl(partial) }

  /** Alias for verifyAttribute() — matches verifyAttributeValue() convention */
  verifyAttributeValue(selector, attr, value) {
    this.verifyAttribute(selector, attr, value)
  }

  /** Alias for verifyCssProperty() — matches verifyCSSProperty() convention */
  verifyCSSProperty(selector, property, value) {
    this.verifyCssProperty(selector, property, value)
  }

  /** Alias for verifyElementCount() — matches verifyCount() convention */
  verifyCount(selector, count) { this.verifyElementCount(selector, count) }

  /** Alias for getInputValue() — matches getFieldValue() convention */
  getFieldValue(selector) { return this.getInputValue(selector) }

  /** Alias for hardWait() — matches waitForTimeout() convention */
  waitForTimeout(ms) { this.hardWait(ms) }

  // ===========================================================================
  // 20. DRAG AND DROP
  // ===========================================================================

  /**
   * Drag one element and drop it onto another element.
   * Uses Cypress's built-in trigger events for drag-and-drop simulation.
   *
   * Usage: this.dragAndDrop('.drag-handle', '.drop-zone')
   *
   * @param {string} sourceSelector - CSS selector of the element to drag
   * @param {string} targetSelector - CSS selector of the drop target
   */
  dragAndDrop(sourceSelector, targetSelector) {
    cy.get(sourceSelector).trigger('mousedown', { button: 0 })
    cy.get(targetSelector).trigger('mousemove').trigger('mouseup', { force: true })
  }

  // ===========================================================================
  // 21. ELEMENT STATE QUERIES (return boolean-style Cypress assertions)
  // ===========================================================================

  /**
   * Assert and return whether an element is currently visible.
   * Useful for conditional logic in tests.
   *
   * Usage: this.isElementVisible('.error-banner')
   *
   * @param {string} selector - CSS selector
   */
  isElementVisible(selector) {
    return cy.get(selector).should('be.visible')
  }

  /**
   * Assert an element is enabled (not disabled).
   *
   * Usage: this.isElementEnabled('[type="submit"]')
   *
   * @param {string} selector - CSS selector
   */
  isElementEnabled(selector) {
    return cy.get(selector).should('not.be.disabled')
  }

  /**
   * Assert an element is disabled.
   *
   * Usage: this.isElementDisabled('[name="employeeId"]')
   *
   * @param {string} selector - CSS selector
   */
  isElementDisabled(selector) {
    return cy.get(selector).should('be.disabled')
  }

  /**
   * Assert a checkbox or radio button is checked.
   *
   * Usage: this.isElementChecked('[name="rememberMe"]')
   *
   * @param {string} selector - CSS selector
   */
  isElementChecked(selector) {
    return cy.get(selector).should('be.checked')
  }

  /**
   * Assert an element exists somewhere in the DOM (even if hidden).
   *
   * Usage: this.elementExists('.sidebar-menu')
   *
   * @param {string} selector - CSS selector
   */
  elementExists(selector) {
    return cy.get(selector).should('exist')
  }

  // ===========================================================================
  // 22. FORM HELPERS
  // ===========================================================================

  /**
   * Submit a form by clicking its submit button or triggering submit event.
   *
   * Usage: this.submitForm('form')
   *        this.submitForm('[data-cy="login-form"]')
   *
   * @param {string} selector - CSS selector of the <form> element
   */
  submitForm(selector) {
    cy.get(selector).submit()
  }

  // ===========================================================================
  // 23. STORAGE — ADDITIONAL
  // ===========================================================================

  /**
   * Clear ALL cookies from the browser.
   * Useful in beforeEach to ensure no leftover session state.
   *
   * Usage: this.clearCookies()
   */
  clearCookies() {
    cy.clearCookies()
  }

  /**
   * Clear ALL localStorage entries.
   *
   * Usage: this.clearLocalStorage()
   */
  clearLocalStorage() {
    cy.clearLocalStorage()
  }

  /**
   * Get a value from sessionStorage by key.
   *
   * Usage:
   *   this.getSessionStorage('cart').then(val => {
   *     expect(val).to.not.be.null
   *   })
   *
   * @param {string} key - the sessionStorage key to read
   */
  getSessionStorage(key) {
    return cy.window().then((win) => win.sessionStorage.getItem(key))
  }

  /**
   * Set a value in sessionStorage.
   *
   * Usage: this.setSessionStorage('cart', JSON.stringify({ items: [] }))
   *
   * @param {string} key   - sessionStorage key
   * @param {string} value - value to store
   */
  setSessionStorage(key, value) {
    cy.window().then((win) => win.sessionStorage.setItem(key, value))
  }

  /**
   * Clear ALL sessionStorage entries.
   *
   * Usage: this.clearSessionStorage()
   */
  clearSessionStorage() {
    cy.window().then((win) => win.sessionStorage.clear())
  }

  // ===========================================================================
  // 24. WINDOW & TAB HANDLING
  // ===========================================================================

  /**
   * Get a property from the browser window object.
   *
   * Usage:
   *   this.getWindowProperty('innerWidth').then(width => {
   *     expect(width).to.be.greaterThan(768)
   *   })
   *
   * @param {string} property - window property name (e.g. 'innerWidth', 'location')
   */
  getWindowProperty(property) {
    return cy.window().its(property)
  }

  /**
   * Switch focus into an iframe and interact with an element inside it.
   * Returns the found element so you can chain .click(), .type(), etc.
   *
   * This is an alias for getInsideIframe() with a more intuitive name.
   *
   * Usage:
   *   this.switchToIframe('#payment-iframe', '#card-number').type('4111111111111111')
   *
   * @param {string} iframeSelector   - CSS selector of the <iframe> element
   * @param {string} elementSelector  - CSS selector of the element inside the iframe
   */
  switchToIframe(iframeSelector, elementSelector) {
    return this.getInsideIframe(iframeSelector, elementSelector)
  }

  /**
   * Open a URL in a new browser tab and switch Cypress focus to it.
   *
   * NOTE: Cypress does not natively support multi-tab testing.
   * This method uses window.open() via invoke and then switches the test
   * to the new URL. For true multi-tab testing consider using cy.origin().
   *
   * Usage: this.switchToNewTab('https://example.com/terms')
   *
   * @param {string} url - URL to open in the new tab
   */
  switchToNewTab(url) {
    cy.window().then((win) => {
      win.open(url, '_blank')
    })
    cy.visit(url)
  }

  /**
   * Simulate closing the current tab by navigating back to the previous page.
   * Cypress controls a single tab — this navigates back as a close equivalent.
   *
   * Usage: this.closeCurrentTab()
   */
  closeCurrentTab() {
    cy.go('back')
  }

  // ===========================================================================
  // 25. SCREENSHOT — VISUAL COMPARISON
  // ===========================================================================

  /**
   * Compare the current page screenshot against a saved baseline image.
   * Requires the cypress-image-snapshot plugin to be installed.
   *
   * If the plugin is NOT installed this will fall back to a named screenshot.
   * Install: npm install --save-dev @sinonjs/fake-timers cypress-image-snapshot
   *
   * Usage: this.compareScreenshot('login-page')
   *
   * @param {string} name - name of the baseline snapshot to compare against
   */
  compareScreenshot(name) {
    // If matchImageSnapshot is available (plugin installed), use it
    if (typeof cy.matchImageSnapshot === 'function') {
      cy.matchImageSnapshot(name)
    } else {
      // Fallback: take a regular screenshot for manual review
      cy.screenshot(`${name}_actual`)
      cy.log(`Visual comparison skipped — install cypress-image-snapshot plugin.`)
    }
  }

  // ===========================================================================
  // 26. TABLE — ADDITIONAL
  // ===========================================================================

  /**
   * Get the total number of rows in an OrangeHRM results table.
   * Returns a Cypress chainable — chain .then(count => ...) to use the value.
   *
   * Usage:
   *   this.getTableRowCount().then(count => {
   *     expect(count).to.be.greaterThan(0)
   *   })
   *
   * @param {string} rowSelector - CSS selector for table rows
   *                              (default: OrangeHRM table row class)
   */
  getTableRowCount(rowSelector = '.oxd-table-body .oxd-table-row') {
    return cy.get(rowSelector).its('length')
  }

  /**
   * Get the text value of a specific cell in an OrangeHRM results table.
   * Row and column are both zero-based.
   *
   * Usage:
   *   this.getTableCellValue(0, 1).then(text => {
   *     expect(text).to.equal('John Smith')
   *   })
   *
   * @param {number} rowIndex - zero-based row index
   * @param {number} colIndex - zero-based column index
   */
  getTableCellValue(rowIndex, colIndex) {
    return cy.get('.oxd-table-body .oxd-table-row')
      .eq(rowIndex)
      .find('.oxd-table-cell')
      .eq(colIndex)
      .invoke('text')
      .then((text) => text.trim())
  }

  /**
   * Search for a specific text value within a table and verify it exists.
   *
   * Usage: this.searchInTable('John Smith')
   *
   * @param {string} value           - text to find in the table
   * @param {string} tableSelector   - CSS selector for the table body
   */
  searchInTable(value, tableSelector = '.oxd-table-body') {
    cy.get(tableSelector).should('contain.text', value)
  }

  // ===========================================================================
  // 27. LIST HELPERS
  // ===========================================================================

  /**
   * Get all items in a list (ul/ol or any repeated selector).
   * Returns a Cypress chainable of the matched elements.
   *
   * Usage:
   *   this.getListItems('.oxd-main-menu-item').then($items => {
   *     expect($items).to.have.length.greaterThan(0)
   *   })
   *
   * @param {string} selector - CSS selector for list items
   */
  getListItems(selector) {
    return cy.get(selector)
  }

  /**
   * Verify that a list contains at least one item with specific text.
   *
   * Usage: this.verifyListContains('.oxd-main-menu-item', 'PIM')
   *
   * @param {string} selector     - CSS selector for the list items
   * @param {string} expectedText - text that should appear in the list
   */
  verifyListContains(selector, expectedText) {
    cy.get(selector).should('contain.text', expectedText)
  }

  // ===========================================================================
  // 28. LOGGING & TEST CONTROL
  // ===========================================================================

  /**
   * Log a custom message to the Cypress command log.
   * Visible in the Cypress Test Runner left panel during a test run.
   *
   * Usage: this.log('Filling in the employee form now')
   *
   * @param {string} message - message to display in the Cypress log
   */
  log(message) {
    cy.log(`[INFO] ${message}`)
  }

  /**
   * Perform a soft assertion — logs the failure but does NOT stop the test.
   * Useful when you want to collect multiple assertion results in one test run.
   *
   * Usage: this.softAssert('Admin' === 'Admin', 'Username should be Admin')
   *
   * @param {boolean} condition - the condition to evaluate
   * @param {string}  message   - message to show if condition is false
   */
  softAssert(condition, message) {
    if (!condition) {
      cy.log(`[SOFT ASSERT FAILED] ${message}`)
      // Intentionally does not throw — test continues
    } else {
      cy.log(`[SOFT ASSERT PASSED] ${message}`)
    }
  }

  /**
   * Conditionally skip a test with a reason.
   * The test is marked as pending instead of failed.
   *
   * Usage: this.skipTest(Cypress.env('ENV') === 'prod', 'Not safe to run on production')
   *
   * @param {boolean} condition - if true, the test is skipped
   * @param {string}  reason    - reason shown in the Cypress log
   */
  skipTest(condition, reason) {
    if (condition) {
      cy.log(`[TEST SKIPPED] ${reason}`)
      this.hardWait(0)  // yields control cleanly
      throw new Error(`Skipped: ${reason}`)
    }
  }

  /**
   * Set the browser viewport to a custom width and height.
   *
   * Usage: this.setViewport(1440, 900)
   *
   * @param {number} width  - viewport width in pixels
   * @param {number} height - viewport height in pixels
   */
  setViewport(width, height) {
    cy.viewport(width, height)
  }

  /**
   * Run the test body only when executing on a specific named environment.
   * Skips gracefully when the current environment does not match.
   *
   * Set the environment via: cypress run --env ENV=staging
   *
   * Usage:
   *   this.runOnlyOn('staging', () => {
   *     // test steps that only apply to staging
   *   })
   *
   * @param {string}   environment - environment name (e.g. 'staging', 'prod', 'dev')
   * @param {Function} testFn      - callback containing the test steps to run
   */
  runOnlyOn(environment, testFn) {
    const currentEnv = Cypress.env('ENV') || 'dev'
    if (currentEnv === environment) {
      testFn()
    } else {
      cy.log(`[SKIPPED] Test only runs on environment: ${environment} (current: ${currentEnv})`)
    }
  }
}

export default BasePage
