# spades
Online HTML5 spades game experimenting with using [Cline](https://cline.bot/) to build it, and ChatGPT to generate the Cline initialize the Cline rules. 

## Tests
The tests can be found at /test.html

### Testing Framework
This project uses QUnit for unit and integration testing. Tests can be run through a Python server.

Key features of our testing approach:
- Browser-based testing without Node.js dependencies
- DOM testing with QUnit fixtures
- Asynchronous testing for animations and timing-dependent operations
- Comprehensive integration tests for game rules and UI interactions

### Running Tests

All tests must be run through a Python server on port 8000:

1. Start the Python server:
   ```bash
   python -m http.server 8000
   ```
   or
   ```bash
   python3 -m http.server 8000
   ```

2. Access the tests in your browser:
   - Original tests: http://localhost:8000/test.html
   - QUnit tests: http://localhost:8000/qunit-test.html

3. Stop the server with `Ctrl+C` when finished.

For more details on testing, see:
- [Browser Server Configuration](docs/browserServerConfig.md)
- [Test Migration Guide](docs/test-migration-guide.md)
