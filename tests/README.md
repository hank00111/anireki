# Tests

This directory contains all test files for the Anireki project.

## Structure

```
tests/
├── setup.ts                    # Global test setup
├── vitest.config.ts            # Vitest configuration
├── unit/                       # Unit tests
│   ├── components/             # Component unit tests
│   │   └── LoginModal.test.ts
│   └── stores/                 # Store unit tests
│       └── loginModalStore.test.ts
└── integration/                # Integration tests
    └── LoginFlow.test.ts       # Login flow integration tests
```

## Running Tests

### All tests
```bash
npm run test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests once
```bash
npm run test:run
```

### Run specific test file
```bash
npm run test -- LoginModal.test.ts
```

### Run tests with coverage
```bash
npm run test:coverage
```

## Test Categories

### Unit Tests (`tests/unit/`)
- **Components**: Test individual Vue components in isolation
- **Stores**: Test Pinia stores and their state management logic
- **Utils**: Test utility functions and helpers

### Integration Tests (`tests/integration/`)
- Test complete user flows and component interactions
- Test router behavior and navigation guards
- Test complex state changes across multiple components

## Writing Tests

### Component Tests
- Use `@vue/test-utils` for mounting and testing Vue components
- Mock external dependencies and stores
- Test user interactions, props, events, and rendering

### Store Tests
- Use Pinia testing utilities
- Test state changes, actions, and getters
- Mock external API calls

### Integration Tests
- Test complete user workflows
- Use real router and store instances
- Test cross-component communication

## Best Practices

1. **Descriptive test names**: Use clear, descriptive test names in Chinese/Japanese
2. **Setup and teardown**: Use `beforeEach` and `afterEach` for consistent test state
3. **Mock external dependencies**: Mock API calls, external libraries, and browser APIs
4. **Test user behavior**: Focus on testing what users can see and do
5. **Keep tests isolated**: Each test should be independent and not rely on other tests
