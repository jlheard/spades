# ADR-001: Migration to QUnit for Integration Testing

## Status
Proposed

## Context
Our current custom testing framework is experiencing issues with integration tests, particularly:
- Tests for "Complete trick flow with rule enforcement" are failing
- Tests for "Winning card determination and animation" are failing

These failures appear to be related to DOM manipulation, event handling, and timing issues that are difficult to manage in our current testing approach.

The current testing approach uses a simple custom framework defined in `js/test/testUtils.js` that provides basic test and assertion functions. While this approach works for simple unit tests, it lacks the robustness needed for complex integration tests that involve DOM manipulation, event simulation, and timing-dependent operations like animations.

## Decision
We will migrate our testing framework to QUnit, a lightweight browser-based testing framework that:
- Can be included via a simple CDN link
- Provides better test isolation
- Offers improved DOM testing capabilities
- Has better support for asynchronous testing (animations, timing)
- Maintains our ability to run tests directly in the browser without Node.js dependencies

QUnit was chosen over alternatives like Jasmine for the following reasons:
1. Simpler setup - requires only a single script tag
2. Better DOM-centric testing capabilities which are crucial for our card game
3. Minimal changes required to our existing test structure
4. Lightweight approach that matches our current testing philosophy

## Consequences

### Positive
- More reliable integration tests
- Better test isolation preventing test interference
- Improved error reporting and debugging
- Better handling of DOM-based tests
- Simplified test setup and teardown
- Support for async testing with proper timing controls
- Rich assertion library with better error messages

### Negative
- Learning curve for team members unfamiliar with QUnit
- Migration effort for existing tests
- External dependency on QUnit CDN (or need to host locally)
- Potential compatibility issues with older browsers (though this is minimal)

## Implementation Plan
1. Create a new QUnit-based test runner (`qunit-test.html`)
2. Create a test migration guide for developers
3. Ensure Python server configuration for browser testing
   - All tests must be run through a Python server on port 8000
   - Documentation updated to include server start/stop instructions
   - Test runner configured to work with server paths
4. Migrate existing unit tests first to validate the approach
5. Rewrite failing integration tests using QUnit's features
   - Leverage QUnit's async testing capabilities for animations
   - Use QUnit fixtures for DOM testing
   - Ensure tests work correctly when run through the Python server
6. Update documentation and test running instructions
7. Once all tests are migrated, replace the original test.html with the QUnit version

## Server Requirements

As specified in the project's technical documentation (`docs/browserServerConfig.md`), all browser-based tests must be run through a Python server on port 8000. This requirement has been incorporated into the QUnit migration plan to ensure:

1. Proper module loading in the browser environment
2. Consistent test execution across different environments
3. Accurate simulation of production conditions

The test migration guide includes detailed instructions for starting and stopping the Python server, as well as accessing the QUnit tests through the server.
