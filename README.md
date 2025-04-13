# Spades
Online HTML5 spades game experimenting with using [Cline](https://cline.bot/) to build it, and ChatGPT to generate the Cline initialize the Cline rules.

## Recent Updates (April 13, 2025)
- Fixed critical bug where human player's hand wasn't updating correctly when a computer player led a trick, allowing invalid plays
- Changed hand sorting to display cards by suit (Spades, Hearts, Diamonds, Clubs) with ranks in descending order within each suit to match how most players read cards from left to right
- Fixed card comparison logic to correctly identify the highest spade when multiple spades are present
- Fixed animation tests to work correctly for all player positions
- Fixed hand sorting test to match the expected card order
- Added comprehensive integration test suite with 6 new test files and 30+ test cases
- Fixed joker naming conventions in tests to use 'BigJoker' and 'ExtraJoker'
- Improved DOM cleanup in tests using try/finally blocks
- Enhanced SmartPlayStrategy to properly handle partner-winning scenarios
- Added detailed testing-notes.md documentation with troubleshooting tips
- Increased timeouts for animation tests to improve reliability
- Fixed computer players not following suit by correcting leading card determination
- Improved PlayStrategy implementation to prioritize following suit when possible
- Added extensive logging to help diagnose gameplay issues
- All tests are now passing

## Game Features
- Single-player Spades game against computer opponents
- Follows standard Spades rules with proper trick-taking mechanics
- Visual card animations with winning card highlighting
- Rule enforcement for legal card plays
- Team-based scoring system

### Testing Framework
This project uses QUnit for unit and integration testing. Tests can be run through a Python server.

Key features of our testing approach:
- Browser-based testing without Node.js dependencies
- DOM testing with QUnit fixtures
- Asynchronous testing for animations and timing-dependent operations
- Comprehensive integration tests for game rules and UI interactions

#### Integration Test Coverage
The project includes extensive integration tests for:
- Game initialization and card dealing
- Spades breaking rules enforcement
- Trick winning logic with various card combinations
- Player strategy decision-making
- Unusual card distributions and edge cases
- Error handling and invalid play prevention

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
- [Spades Game Testing Notes](docs/testing-notes.md)
