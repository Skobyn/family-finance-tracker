# Component Testing Skill

Comprehensive testing setup and implementation for React components and services.

## What This Skill Does

Establishes complete testing infrastructure:
- Jest and React Testing Library setup
- Component test creation
- Service module unit tests
- Coverage reporting

## Available Tasks

### 1. Set Up Jest Testing Framework
Configures complete testing infrastructure.

**Use when:**
- Starting testing implementation
- Setting up new projects
- Configuring CI/CD testing

**Output:**
- Jest configuration
- Testing utilities
- Mock providers
- Test scripts
- Coverage setup

### 2. Create Tests for Critical Components
Writes comprehensive component tests.

**Use when:**
- Testing UI components
- Ensuring component behavior
- Preventing regressions

**Output:**
- Component test suites
- User interaction tests
- State management tests
- 80%+ component coverage

### 3. Unit Test Service Modules
Creates unit tests for business logic.

**Use when:**
- Testing service layer
- Validating business rules
- Mocking external dependencies

**Output:**
- Service test suites
- Firestore mocks
- Edge case coverage
- 90%+ service coverage

## How to Use

```bash
# In Claude Code:
/skill component-testing
```

## Testing Standards

- **Minimum Coverage**: 80% overall, 90% for services
- **Test Structure**: AAA (Arrange, Act, Assert)
- **Naming**: `describe` for components, `it` for behaviors
- **Mocking**: Mock all external dependencies
- **Assertions**: Use jest-dom matchers

## Commands

```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## Integration Points

- **Components**: `src/components/**`
- **Services**: `src/services/**`
- **Utilities**: `src/lib/**`, `src/utils/**`
- **Mocks**: `src/test-utils/mocks/`
