# Cypress Automation Framework

A clean, scalable Cypress E2E test automation framework built with the **Page Object Model (POM)** design pattern.

---

## Prerequisites

- Node.js v16+ (`node --version`)
- npm v8+ (`npm --version`)

---

## Setup

```bash
npm install
```

---

## Running Tests

| Command | Description |
|---|---|
| `npm run cy:open` | Open Cypress Test Runner (GUI) |
| `npm run cy:run` | Run all tests headlessly |
| `npm run cy:run:chrome` | Run all tests in Chrome headlessly |
| `npm run cy:run:headed` | Run tests with browser visible |
| `npm run cy:run:login` | Run only the login test suite |

---

## Folder Structure

```
cypress/
├── e2e/              # Test spec files, organized by feature
│   └── login/
│       └── login.cy.js
├── fixtures/         # Test data (JSON)
│   └── users.json
├── pages/            # Page Object Model classes
│   ├── LoginPage.js
│   └── DashboardPage.js
├── support/
│   ├── commands.js   # Custom cy.* commands
│   └── e2e.js        # Global hooks and imports
└── screenshots/      # Auto-saved on test failure
```

---

## Configuration

Edit `cypress.config.js` to set:
- `baseUrl` — point this to your application URL
- `viewportWidth` / `viewportHeight` — browser window size
- `retries` — auto-retry flaky tests
- `defaultCommandTimeout` — how long to wait for elements

---

## Best Practices

- Use `data-cy` attributes as selectors — never CSS classes or XPath
- Keep all selectors inside Page Object files — never in test files
- Store all test data in `cypress/fixtures/` — never hardcode in tests
- Each `it()` block tests exactly one behaviour
- Use `cy.loginByApi()` for programmatic login when testing non-login pages
