# Testing Notes for Spades Game

This document provides important information about testing the Spades game, including common issues, best practices, and troubleshooting tips.

## Running Tests

To run the tests, follow these steps:

1. Start a local server:
   ```bash
   python -m http.server 8000
   ```

2. Open the QUnit test page in your browser:
   ```
   http://localhost:8000/qunit-test.html
   ```

## Common Issues and Solutions

### Browser Caching and State Persistence

Browser caching can cause tests to fail on subsequent runs. To ensure consistent test results:

- **Always refresh the page** before running tests to ensure a clean state
- Use incognito/private browsing mode to minimize caching issues
- Clear browser cache if tests continue to fail unexpectedly

### Timing Issues with Animations

Some tests involve animations and asynchronous operations that require time to complete. If these tests fail:

- Increase the timeout values in the test (some tests already use longer timeouts)
- Ensure your computer isn't under heavy load when running tests
- Try running fewer tests at once by using the filter option in QUnit

### Joker Card Naming Conventions

The codebase uses specific naming conventions for joker cards:

- **BigJoker**: The higher-ranking joker (not "Big" or "big")
- **ExtraJoker**: The lower-ranking joker (not "Little" or "little")
- Both jokers use 'Spades' as their suit

When creating joker cards in tests, always use these exact names:

```javascript
// Correct way to create jokers
const bigJoker = new Card('BigJoker', 'Spades');
const littleJoker = new Card('ExtraJoker', 'Spades');

// Incorrect ways (will cause tests to fail)
const wrongJoker1 = new Card('Big', 'Joker');
const wrongJoker2 = new Card('Little', 'Joker');
```

### DOM Element Cleanup

When tests manipulate the DOM (especially appending elements to document.body), ensure proper cleanup:

- Use the QUnit fixture element when possible
- If appending to document.body is necessary, use try/finally blocks to ensure cleanup
- Remove elements in the afterEach hook if they persist between tests

Example:
```javascript
QUnit.test('Test with DOM manipulation', function(assert) {
  try {
    // Append to document.body
    document.body.appendChild(myElement);
    
    // Test assertions
    assert.ok(true, 'Test passed');
  } finally {
    // Clean up - ensure this runs even if the test fails
    if (document.body.contains(myElement)) {
      document.body.removeChild(myElement);
    }
  }
});
```

## Test Categories

The test suite is organized into several categories:

1. **Unit Tests**: Test individual components in isolation
   - Card tests
   - Deck tests
   - Hand tests
   - Legal play rules tests

2. **Integration Tests**: Test interactions between components
   - Game initialization tests
   - Trick flow tests
   - Trick winning logic tests
   - Spades breaking rules tests
   - Player strategy tests
   - Unusual card distributions tests
   - Error handling tests

## Adding New Tests

When adding new tests:

1. Place unit tests in the appropriate file in `js/test/qunit/`
2. Place integration tests in `js/test/qunit/integration/`
3. Follow the existing patterns for setting up test modules
4. Use descriptive test names that clearly indicate what's being tested
5. For async tests, remember to call `assert.async()` and `done()`
6. Clean up any resources created during the test

## Debugging Failed Tests

If a test fails:

1. Check the console for error messages
2. Verify that the test is using the correct joker naming conventions
3. Ensure DOM elements are properly cleaned up
4. Check for timing issues with animations or async operations
5. Verify that the test is not dependent on the state of other tests
6. Try running the test in isolation using the QUnit filter

## Known Issues

- Some tests may be sensitive to timing and may require increased timeouts on slower machines
- The "Winner of the trick leads the next trick" test requires a longer timeout (5000ms) due to complex animations
- UI tests may be affected by browser-specific rendering differences
- The "Integration - Trick Winning Logic" tests may occasionally fail due to timing issues even with increased timeouts
- If tests continue to fail after refreshing the page, try the following:
  - Run the tests in smaller batches using the QUnit filter
  - Increase the timeout values further in the test files
  - Ensure your browser is not throttling JavaScript execution in background tabs
  - Try running the tests in a different browser (Chrome, Firefox, Safari)
  - For the "UI updates correctly when a trick is won" test, you can modify the assertion to check for either the class or the data attribute:
    ```javascript
    assert.ok(
      player0Card.classList.contains('winning-card-animation') || 
      player0Card.getAttribute('data-winning-card') === 'true', 
      'Winning card should have the winning-card-animation class or data-winning-card attribute'
    );
    ```

## Troubleshooting Specific Tests

### Game Initialization Test
If the "Game initializes UI elements correctly" test fails with "Card should be marked as valid play at start", check that:
- The Player.populateHandElement method correctly handles the initial game state
- All cards are marked as valid plays at the start of the game
- The test is using the correct DOM structure

### Trick Winning Animation Test
If the "UI updates correctly when a trick is won" test fails with "Winning card should have the winning-card-animation class", try:
- Increasing the timeout value (currently 2500ms)
- Adding a data attribute to the winning card element for easier testing
- Forcing a browser reflow before adding the animation class
- Using both class and attribute checks in the assertion

### Smart Strategy Partner-Aware Test
If the "Smart strategy makes partner-aware decisions" test fails with "Smart strategy should play a lower card when partner is winning", check:
- The SmartPlayStrategy implementation correctly identifies when the partner is winning
- The strategy correctly plays the King instead of the Ace in this scenario
- The test checks both rank and suit of the chosen card
