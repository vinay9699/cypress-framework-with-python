# Cypress Framework Troubleshooting

This guide helps quickly diagnose common failures in this framework.

## 1. Login Fails Or Redirect Loop

Symptoms:

- Tests stay on login page
- `cy.loginBySession()` does not reach dashboard

Checks:

- Verify credentials in `cypress.env.json`
- Confirm target environment in command (`CYPRESS_ENV=dev|staging|prod`)
- Run one focused spec: `npm run test:login`

Fixes:

- Clear cached session by rerunning with clean browser state
- Validate the environment config in `config/cypress.<env>.json`
- Re-run with visible browser: `npm run cy:run:headed -- --spec cypress/e2e/login/login.cy.js`

## 2. Intercept Alias Timeout (`cy.wait('@alias')`)

Symptoms:

- Timed out waiting for route alias

Checks:

- Alias name in `cy.wait()` exactly matches `.as('alias')`
- Intercept is registered before navigation/action triggers request
- URL pattern is broad enough (`**/api/v2/...**`)

Fixes:

- Move `cy.intercept*` setup earlier in the test
- Confirm request method (`GET`, `POST`, etc.)
- Use Cypress runner network tab to inspect real endpoint path

## 3. Flaky Element Not Found

Symptoms:

- Intermittent `expected '<element>' to be visible` or not found

Checks:

- Ensure page transition completed
- Ensure API response completed before asserting UI

Fixes:

- Use framework waits: `cy.waitForPageLoad()` and `cy.waitForApiResponse('@alias')`
- Replace static waits with route alias waits
- Prefer stable selectors (`data-cy`, `data-testid`)

## 4. Environment Config Not Applied

Symptoms:

- Tests always hit dev URL

Checks:

- Script uses `CYPRESS_ENV` (not `ENV`) in this framework
- Verify command: `CYPRESS_ENV=staging npm run cy:run`

Fixes:

- Use existing scripts in `package.json`:
  - `npm run cy:run:dev`
  - `npm run cy:run:staging`
  - `npm run cy:run:prod`

## 5. Reports Missing Or Empty

Symptoms:

- No merged HTML report
- Missing Allure results

Checks:

- Ensure test run completed and wrote JSON outputs
- Verify reporter paths in `reporter-config.json`

Fixes:

- Regenerate report:
  - `npm run report:mochawesome`
  - `npm run report:allure`
- Clean and rerun:
  - `npm run report:clean`
  - `npm run cy:run`

## 6. CI Passes Locally But Fails In Workflow

Symptoms:

- Local pass, GitHub Actions failure

Checks:

- Confirm `CYPRESS_validUsername` and `CYPRESS_validPassword` secrets exist
- Compare local browser vs matrix browser (`chrome`, `firefox`, `edge`)

Fixes:

- Re-run specific tag locally used by CI: `npm run cy:smoke`
- Run headed mode for local debugging
- Inspect uploaded artifacts: screenshots/videos/mochawesome/junit/allure

## 7. Excel Fixture Read Errors

Symptoms:

- Task errors from `readExcel*`

Checks:

- File exists under `cypress/fixtures/`
- Sheet name and column keys are correct

Fixes:

- Validate with targeted run:
  - `npm run test:excel`
- Keep fixture schema consistent across rows

## Debugging Workflow

1. Reproduce with a single spec using `--spec`.
2. Add/verify route aliases around failing API calls.
3. Assert request and response details from intercept object.
4. Capture artifacts (screenshot/video/report) and compare across browsers.
5. Promote fix into reusable command if pattern repeats.
