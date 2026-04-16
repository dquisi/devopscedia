# Agent Instructions for DevOps Web App

This document provides specific guidance for AI coding agents (Claude, Copilot, etc.) working on this DevOps Web App project.

## Quick Start for Agents

### Initial Context Loading
Before making changes, agents should:
1. Read `.github/copilot-instructions.md` for architectural overview
2. Review the appropriate source files based on the task
3. Understand the ES6 module system and test patterns

### Critical Files to Know
- **Architecture**: `app.js`, `src/api.js`, `src/validator.js`
- **Testing**: `tests/api.test.js`, `tests/validator.test.js`
- **CI/CD**: `.github/workflows/ci-cd.yml`
- **Config**: `jest.config.js`, `package.json`

---

## Task-Specific Workflows

### Adding a New Feature

1. **Identify the layer**: API (src/api.js), Validation (src/validator.js), or UI (app.js)
2. **Create the function**: Follow existing patterns with JSDoc comments
3. **Write tests first**: Create test cases in `tests/` covering success + error scenarios
4. **Run locally**: `npm test` to verify all 23+ tests pass
5. **Commit with message**: Use format `feat: description of what was added`
6. **Push**: To `developer` branch first, then merge to `main` when ready

### Fixing a Bug

1. **Reproduce**: Write a failing test case that captures the bug
2. **Fix**: Make minimal changes to fix the bug (not refactoring)
3. **Verify**: Ensure all tests pass and no regressions
4. **Commit**: Use format `fix: description of what was fixed`
5. **Test CI/CD**: Push to `developer` to trigger GitHub Actions

### Updating CI/CD

1. **Edit**: `.github/workflows/ci-cd.yml` directly
2. **Test locally** (optional): Use `act` tool to simulate GitHub Actions locally
3. **Commit**: `ci: description of CI/CD change`
4. **Push to developer first**: To test workflow behavior before affecting `main`

---

## Code Generation Guidelines

### When Writing API Functions
```javascript
/**
 * Fetches resource from API
 * @param {string} id - Resource identifier
 * @returns {Promise<Object>} Resource data
 * @throws {Error} Network or HTTP errors
 */
export async function fetchResource(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/resource/${id}`);
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: Failed to fetch`);
        }
        const data = await response.json();
        return { /* extract needed fields */ };
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('Error de conexión: Network unavailable');
        }
        throw error;
    }
}
```

### When Writing Validator Functions
```javascript
/**
 * Validates resource
 * @param {Object} resource - Resource to validate
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export function validateResource(resource) {
    const errors = [];
    
    if (!resource || typeof resource !== 'object') {
        errors.push('Resource must be an object');
        return { isValid: false, errors };
    }
    
    if (!isValidField(resource.field)) {
        errors.push('Field validation failed');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}
```

### When Writing Tests
```javascript
describe('Feature - function', () => {
    beforeEach(() => {
        jest.clearAllMocks();  // Reset mocks before each test
    });

    test('happy path: does X when given valid input', async () => {
        // Mock setup
        global.fetch.mockResolvedValueOnce({ /* mock response */ });
        
        // Execute
        const result = await functionUnderTest('input');
        
        // Assert
        expect(result).toEqual({ /* expected */ });
    });

    test('error case: throws when network fails', async () => {
        global.fetch.mockRejectedValueOnce(new TypeError('Network error'));
        
        await expect(functionUnderTest('input'))
            .rejects.toThrow('Error de conexión');
    });

    test('edge case: handles empty response', async () => {
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
        
        const result = await functionUnderTest('input');
        
        expect(result).toEqual({ /* expected with defaults */ });
    });
});
```

---

## Common Agent Mistakes to Avoid

### ❌ Don't
- Use `require()` — always use `import`/`export`
- Write async functions without proper error handling
- Skip tests when adding features
- Ignore type checking in validators
- Use `var` — use `const` or `let`
- Add console.log() in production code (only in debugging)
- Modify `node_modules` or `.git` files
- Push directly to `main` without testing in `developer` first
- Use external UI frameworks (keep it minimal)
- Forget to update both validator AND its tests when changing validation rules

### ✅ Do
- Follow the existing error handling pattern (distinguish TypeError from HTTP errors)
- Write descriptive error messages in Spanish for user-facing, English for technical
- Test both success and failure cases
- Use JSDoc for all exported functions
- Keep functions small and focused (single responsibility)
- Use meaningful variable names (`userData`, not `data` or `d`)
- Add comments for non-obvious logic
- Always run tests before committing
- Keep HTML/CSS/JS separation minimal but clear
- Validate input types at function entry points

---

## Git Workflow for Agents

```bash
# Before starting work
git checkout developer
git pull origin developer

# Create feature branch (optional but recommended for complex features)
git checkout -b feature/feature-name

# Make changes and test
npm test

# When ready to commit
git add .
git commit -m "type: description"  # type: feat, fix, docs, ci, refactor, etc.

# Push to developer
git push origin developer  # or origin feature/feature-name if using branches

# Merge to main when feature is complete and tested
git checkout main
git pull origin main
git merge developer
git push origin main

# Return to developer for next task
git checkout developer
```

---

## Testing Checklist for Agents

Before pushing any code:

- [ ] Run `npm test` and all tests pass (23+ tests)
- [ ] New functions have JSDoc comments
- [ ] New functions have test cases (minimum 2: success + error)
- [ ] Type safety: Tests check for invalid types
- [ ] Error handling: Distinguish between TypeError and other errors
- [ ] No console.log() in production code
- [ ] No unused imports or variables
- [ ] Code follows existing patterns in the repo
- [ ] Commit message is clear and follows convention

---

## Emergency Procedures

### If Tests Fail Locally
1. Run `npm test` again to check for flaky tests
2. Check if you're using correct Node version (20+)
3. Clear Jest cache: `rm -rf node_modules/.cache`
4. Verify all dependencies: `npm install`
5. Check the test file for mock setup issues

### If GitHub Actions Fails
1. Check the workflow file `.github/workflows/ci-cd.yml`
2. Verify you're pushing to correct branch (`developer` for testing, `main` for deployment)
3. Look at the GitHub Actions logs for specific errors
4. Common issues:
   - Missing files (validation job checks for 5 required files)
   - Invalid JSON in package.json
   - Tests timeout (increase timeout if needed)
   - Environment variables missing

### If Merge Conflict Occurs
1. Never force push to main or developer
2. Resolve conflicts locally with `git merge --abort` if uncertain
3. Always test after resolving conflicts
4. Ask for human review before pushing resolved conflicts

---

## Performance Considerations

- **Tests should run in < 1 second** (currently ~250ms)
- **No external API calls in tests** (all mocked)
- **Minimal DOM manipulation** — batch changes when possible
- **Cache fetch responses** if calling same API multiple times

---

## Documentation Standards

### Commit Messages
```
feat: add new API endpoint for users
fix: handle null city in address response
docs: update README with setup instructions
ci: improve GitHub Actions workflow
refactor: simplify error handling logic
test: add edge case for empty email validation
```

### Code Comments
```javascript
// Use for WHY, not WHAT
// Good: "Extract only needed fields to reduce payload size"
// Bad: "Extract name, email, city from data"

// Use for complex logic
// Good: "Check TypeError separately to distinguish network failure from malformed response"
// Bad: "Check error type"
```

---

## References

- **Main instructions**: `.github/copilot-instructions.md`
- **API reference**: [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
- **Testing framework**: [Jest Documentation](https://jestjs.io/)
- **ES6 Modules**: [MDN - Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- **GitHub Actions**: [Actions Documentation](https://docs.github.com/en/actions)

