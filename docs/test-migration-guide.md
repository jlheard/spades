# Test Migration Guide: Custom Framework to QUnit

This guide provides step-by-step instructions for migrating tests from our custom testing framework to QUnit.

## Why QUnit?

Our custom testing framework has served us well for simple unit tests, but as we've added more complex integration tests involving DOM manipulation, event handling, and animations, we've encountered limitations. QUnit provides:

- Better test isolation
- Improved DOM testing capabilities
- Support for asynchronous testing
- Rich assertion library
- Better error reporting

## Migration Steps

### Step 1: Update Test Structure

#### Before (Custom Framework):
```javascript
import { test, assert } from '../testUtils.js';

test('Card creation', () => {
  const card = new Card('A', 'Spades');
  assert(card.rank === 'A', 'Card has correct rank');
  assert(card.suit === 'Spades', 'Card has correct suit');
});
```

#### After (QUnit):
```javascript
QUnit.module('Card Tests', () => {
  QUnit.test('Card creation', assert => {
    const card = new Card('A', 'Spades');
    assert.equal(card.rank, 'A', 'Card has correct rank');
    assert.equal(card.suit, 'Spades', 'Card has correct suit');
  });
});
```

### Step 2: Update Assertions

| Custom Framework | QUnit Equivalent |
|------------------|------------------|
| `assert(condition, message)` | `assert.ok(condition, message)` |
| `assert(a === b, message)` | `assert.equal(a, b, message)` |
| `assert(a !== b, message)` | `assert.notEqual(a, b, message)` |
| `assert(a === b && c === d, message)` | Use multiple assertions: `assert.equal(a, b, message1)` and `assert.equal(c, d, message2)` |

QUnit provides many more assertion methods:
- `assert.deepEqual(actual, expected, message)` - Deep comparison
- `assert.strictEqual(actual, expected, message)` - Strict equality (===)
- `assert.true(actual, message)` - Check if value is true
- `assert.false(actual, message)` - Check if value is false

### Step 3: Handle DOM Testing

#### Before (Custom Framework):
```javascript
test('DOM manipulation', () => {
  const element = document.createElement('div');
  document.body.appendChild(element);
  
  // Test code that manipulates the element
  
  document.body.removeChild(element);
});
```

#### After (QUnit):
```javascript
QUnit.test('DOM manipulation', assert => {
  // QUnit automatically creates and cleans up the fixture
  const fixture = document.getElementById('qunit-fixture');
  const element = document.createElement('div');
  fixture.appendChild(element);
  
  // Test code that manipulates the element
  // No need to clean up - QUnit resets the fixture after each test
});
```

### Step 4: Handle Asynchronous Tests

#### Before (Custom Framework):
```javascript
test('Animation test', () => {
  const element = document.createElement('div');
  document.body.appendChild(element);
  
  element.classList.add('animate');
  
  // Problematic: No way to wait for animation
  // Often used setTimeout as a workaround
  
  document.body.removeChild(element);
});
```

#### After (QUnit):
```javascript
QUnit.test('Animation test', assert => {
  const done = assert.async(); // Signal async test
  const fixture = document.getElementById('qunit-fixture');
  const element = document.createElement('div');
  fixture.appendChild(element);
  
  element.classList.add('animate');
  
  // Wait for animation to complete
  setTimeout(() => {
    assert.ok(element.classList.contains('animation-complete'), 'Animation completed');
    done(); // Signal test completion
  }, 1000);
});
```

### Step 5: Use Setup and Teardown

#### Before (Custom Framework):
```javascript
import { test, beforeEach } from '../testUtils.js';

let testCard;

beforeEach(() => {
  testCard = new Card('A', 'Spades');
});

test('Test with setup', () => {
  assert(testCard.rank === 'A', 'Card has correct rank');
});
```

#### After (QUnit):
```javascript
QUnit.module('Card Tests', {
  beforeEach: function() {
    this.testCard = new Card('A', 'Spades');
  }
});

QUnit.test('Test with setup', function(assert) {
  assert.equal(this.testCard.rank, 'A', 'Card has correct rank');
});
```

## Common Patterns for Integration Tests

### Testing Event Handlers

```javascript
QUnit.test('Card click handler', function(assert) {
  const fixture = document.getElementById('qunit-fixture');
  
  // Create card element
  const cardElement = document.createElement('div');
  cardElement.className = 'card';
  cardElement.innerHTML = '<div class="card-content">A&nbsp;♠</div>';
  fixture.appendChild(cardElement);
  
  // Create click event
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  
  // Dispatch event
  cardElement.dispatchEvent(clickEvent);
  
  // Assert expected behavior
  assert.ok(cardElement.classList.contains('selected'), 'Card should be selected after click');
});
```

### Testing Animations

```javascript
QUnit.test('Winning card animation', function(assert) {
  const done = assert.async();
  const fixture = document.getElementById('qunit-fixture');
  
  // Create card element
  const cardElement = document.createElement('div');
  cardElement.className = 'card';
  fixture.appendChild(cardElement);
  
  // Add animation class
  cardElement.classList.add('winning-card-animation');
  
  // Wait for animation to complete (animation duration is 1.5s)
  setTimeout(() => {
    assert.ok(true, 'Animation completed without errors');
    done();
  }, 2000); // Wait a bit longer than the animation duration
});
```

## Running Tests

### Python Server Requirement

As specified in the project's technical documentation, all browser-based tests must be run through a Python server on port 8000. This ensures proper loading of modules and accurate simulation of the production environment.

#### Starting the Python Server

Before running any tests, start the Python server with:

```bash
python -m http.server 8000
```

or if that doesn't work:

```bash
python3 -m http.server 8000
```

#### Accessing QUnit Tests

Once the server is running, access the QUnit tests by navigating to:

```
http://localhost:8000/qunit-test.html
```

QUnit will display a summary of all tests, with passed tests in green and failed tests in red. You can click on a failed test to see details about the failure.

#### Stopping the Python Server

After completing your testing, stop the server by pressing `Ctrl+C` in the terminal where the server is running.

### Important Notes

- Never open the test files directly from the filesystem, as this can cause module loading issues and inconsistent test results.
- The Python server must be running on port 8000 specifically, as this is the port configured in the project.
- For more details on the server configuration, refer to `docs/browserServerConfig.md`.
