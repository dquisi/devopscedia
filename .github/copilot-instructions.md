# Copilot Instructions for DevOps Web App

## Project Overview

**DevOps Web App** is a minimal JavaScript web application designed for DevOps practice. It demonstrates:
- ES6 module architecture with clear separation of concerns
- Modular service layer (API, validation) decoupled from UI logic
- Comprehensive testing with Jest (23 tests across 2 test suites)
- CI/CD pipeline with GitHub Actions (test, validate, deploy)
- Deployment to GitHub Pages on main branch

**Architecture**: Static HTML+JS deployed to GitHub Pages. Single entry point: `index.html` + `app.js`. Services: `src/api.js` (data fetching), `src/validator.js` (data validation).

---

## Key Technical Decisions

### 1. **ES6 Modules with Node.js Experimental Flag**
- `package.json` declares `"type": "module"`
- Tests run with `node --experimental-vm-modules` to support ES6 imports
- **Why**: Ensures consistent module syntax between browser and Node.js tests
- **Pattern**: All `.js` files use `export`/`import` syntax, never `require()`

### 2. **Explicit Error Handling & Type Checking**
- Validator functions perform strict type checks (`typeof email !== 'string'`)
- API layer catches `TypeError` separately from other errors (distinguish network vs. HTTP errors)
- **Pattern**: Functions return clear error objects or throw descriptive errors
- **Example**: `validateUser()` returns `{ isValid, errors: [] }` (not boolean)

### 3. **Modular Service-First Design**
- `src/api.js`: Handles external API calls, data extraction, network errors
- `src/validator.js`: Pure validation functions (no side effects)
- `app.js`: UI orchestration and event binding
- **Why**: Each module has one responsibility; easy to test and replace

### 4. **Mock-Based Testing (No Integration Tests)**
- All tests use Jest mocks (`jest.fn()`, `mockResolvedValueOnce()`)
- `global.fetch` is mocked for API tests—no real network calls
- Tests verify contract between modules, not end-to-end behavior
- **Coverage**: 100% on src/ modules (23/23 tests passing)

### 5. **GitHub Pages Deployment via GitHub Actions**
- `main` branch triggers deploy job after test + validation pass
- `developer` branch only runs tests + validation (no deploy)
- Deployment uploads entire repository root as artifact (includes HTML, JS, assets)
- **Limitation**: No build step; all files must be browser-ready

---

## Developer Workflows

### **Local Development**

```bash
# Run tests once (watch off)
npm test

# Run tests for CI (with coverage, no watch)
npm run test:ci

# Verify project structure
./verify_project.sh
```

### **Git Workflow**
1. **Feature branch**: Create from `developer`
2. **Push to developer**: Runs tests + validation on GitHub Actions
3. **When ready**: Merge `developer` → `main` locally, push both
4. **Deploy**: `main` branch auto-deploys to GitHub Pages on push

### **File Organization**
```
.github/workflows/ci-cd.yml      # GitHub Actions pipeline definition
src/api.js                       # Public API client (fetchUser)
src/validator.js                 # Validation utilities (isValidEmail, etc.)
tests/                          # Jest test files (api.test.js, validator.test.js)
jest.config.js                  # Test runner configuration
index.html                      # Single entry point (UI)
app.js                          # Main application logic + event handlers
```

---

## Coding Patterns & Conventions

### **Function Documentation**
All exported functions have JSDoc comments:
```javascript
/**
 * Validates that an email has valid format
 * @param {string} email - Email to validate
 * @returns {boolean} true if email is valid
 */
export function isValidEmail(email) { ... }
```

### **Error Messages**
- Network errors: `"Error de conexión: ..."` (clearly marks network vs. API)
- HTTP errors: `"Error HTTP {status}: ..."` (includes status code)
- Validation errors: Array of specific messages (e.g., `"El nombre no puede estar vacío"`)

### **Testing Patterns**
- **Setup**: `beforeEach(() => fetch.mockClear())` — reset mocks before each test
- **Happy path + error cases**: Each function has ≥2 tests (success + failure)
- **Type safety**: Tests check both valid inputs and type mismatches (e.g., `isValidEmail(123)`)
- **Naming**: `test('describes the specific behavior')` — not just function names

### **HTML/DOM Integration**
- IDs as data locators: `getElementById('loadButton')`, `getElementById('userCard')`
- CSS classes for visibility: `.visible` class toggles with `classList.add/remove`
- No framework: Direct DOM manipulation for clarity and simplicity

---

## Common Tasks & Code Locations

| Task | File(s) | Pattern |
|------|---------|---------|
| Add new API endpoint | `src/api.js` | Mirror `fetchUser()` pattern: fetch → extract fields → handle errors |
| Add new validation rule | `src/validator.js` | Create pure function, test with type checks + edge cases |
| Fix UI bug | `app.js` | Find relevant event handler or DOM update function |
| Add new test | `tests/` | Mock dependencies, test both success and specific error case |
| Update CI/CD rules | `.github/workflows/ci-cd.yml` | Follows GitHub Actions syntax; validate locally with `act` if available |

---

## Integration Points & Dependencies

- **External**: JSONPlaceholder API (`https://jsonplaceholder.typicode.com/users/{id}`)
- **Dev Tools**: Jest 29.7.0, Node.js 20 (specified in CI/CD)
- **Hosting**: GitHub Pages (configured via GitHub Actions `deploy-pages@v4`)
- **Browser APIs**: `fetch()`, DOM selection (`getElementById`), `classList` API

---

## Gotchas & Common Mistakes

1. **Module syntax**: Never use `require()` in this project—always use `import`/`export`
2. **Test execution**: Tests require `--experimental-vm-modules` flag (already in package.json scripts)
3. **Deployment**: Only `main` branch deploys. Merge `developer` → `main` to trigger deploy
4. **HTML entity**: Tests validate `index.html` exists and contains `app.js` reference (CI/CD validation job)
5. **Email validation**: Regex is intentionally simple (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`); not RFC-compliant, but appropriate for this scope

---

## When to Ask for Help

- Adding new external APIs (review error handling pattern in `src/api.js`)
- Modifying test setup or mocks (inspect `beforeEach` and mock declarations)
- Updating deployment logic (see `.github/workflows/ci-cd.yml` for branch conditions)
- Changing validation rules (update both `src/validator.js` and corresponding test cases)
