# Technical Context - Spades (Single Player Implementation)

This document provides an overview of the technical context and the tools/technologies used in the development of the Spades game, with a focus on the core technologies and testing frameworks employed for validating the game's rules and functionality.

## Core Technologies

### HTML5 & JavaScript

- **HTML5** is used for building the user interface (UI), including rendering the game board, cards, and interactive elements.
- **JavaScript** is the core language that drives game logic, handles player inputs, manages the game state, and communicates with the UI.
- Both HTML5 and JavaScript are chosen for their versatility and wide support across browsers, making the game accessible to a broad audience without requiring complex installations or plugins.
  
#### Key Features:
- **DOM Manipulation** is used for handling user interactions (card clicks, turn order, etc.).
- **Event Listeners** manage user input and game flow.
- **CSS Animations** provide visual feedback for game events like winning tricks.
- The game is designed to be responsive, ensuring a smooth experience on different screen sizes.

---

## QUnit Testing Framework

### Overview

We've migrated from a custom testing framework to QUnit, which provides more robust capabilities for testing both game logic and UI interactions. QUnit is specifically configured to test the key components of the Spades game, including card gameplay, turn order, rule enforcement, and UI behavior.

- The framework is located in the `js/test/qunit` directory and is used for both unit and integration testing.

### Features of the QUnit Framework

- **Unit Tests** focus on testing individual game logic components like card comparison, player actions, and rules enforcement.
- **Integration Tests** validate the interaction between various components (e.g., the gameplay logic, the AI decision-making, and the UI).
- **Asynchronous Testing** allows for testing animations and timing-dependent operations.
- **DOM Fixtures** provide isolated environments for UI testing.

#### Testing Strategies for Rule Enforcement

1. **Edge Case Testing**: 
   - Create specific test cases for edge scenarios like playing spades when a player has no cards of the leading suit.
   - Test all possible combinations of card plays to ensure rules are enforced correctly.
   - Verify that the UI correctly reflects which cards are valid plays.

2. **Debugging Approaches**:
   - Add logging to key functions to track values during gameplay:
     ```javascript
     console.log(`Leading suit: ${leadingSuit}, Hand has leading suit: ${!handDoesNotHaveLeadingSuit}`);
     console.log(`Cards in hand:`, this.cards.map(c => `${c.rank} of ${c.suit}`));
     ```
   - Use QUnit's assertion messages to provide detailed information about test failures:
     ```javascript
     assert.ok(
       LegalPlayRules.isCardLegalToPlay(card, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit),
       `${card.rank} of ${card.suit} should be legal to play when player has no ${leadingSuit}`
     );
     ```
   - Create simplified test scenarios that isolate specific rule enforcement logic.

3. **Integration Testing**:
   - Simulate complete game scenarios to verify rule enforcement in context.
   - Test the interaction between rule enforcement and UI updates.
   - Verify that computer players follow the same rules as human players.

#### UI/UX Testing Best Practices

1. **Animation Testing**:
   - Use QUnit's async testing capabilities to wait for animations to complete:
     ```javascript
     const done = assert.async();
     setTimeout(() => {
       assert.ok(element.classList.contains('winning-card-animation'), 'Animation class should be applied');
       done();
     }, 500);
     ```
   - Test that UI elements remain visible and functional during animations.
   - Verify that animations provide clear feedback about game state changes.

2. **Card Game UI Best Practices**:
   - Ensure card values are clearly visible at all times.
   - Provide visual feedback for valid and invalid plays.
   - Use consistent visual language for game state (e.g., whose turn it is, which cards are playable).
   - Implement clear animations for important game events (winning tricks, completing rounds).

3. **Accessibility Considerations**:
   - Ensure sufficient color contrast for card suits.
   - Add text alternatives for visual elements.
   - Make sure animations don't interfere with game usability.
   - Consider keyboard navigation for card selection and play.

#### Automation Setup and Environment Configuration

##### Python Server for Browser Testing

When executing browser-related tests, it is crucial to ensure that the Python server is running on **port 8000**. The server should be started before any tests that require browser interaction, and it should be stopped after the tests are complete.

For detailed instructions on how to start and stop the Python server, please refer to the **[Python Browser Server Configuration](docs/browserServerConfig.md)**.

##### Automation Flow:

1. **Start Python Server**:
   - Before running browser tests, execute the command `python -m http.server 8000` to start the server.
  
2. **Test Execution**:
   - Run the tests by navigating to `http://localhost:8000/qunit-test.html` in a browser.
  
3. **Stop Python Server**:
   - After the tests are finished, stop the server using **Ctrl+C**.

The proper server setup ensures that module imports work correctly and that the tests run in an environment similar to actual gameplay.

## Code Organization and Patterns

### Key Components

1. **Game Logic**:
   - `LegalPlayRules.js`: Enforces the rules of the game
   - `cardComparer.js`: Determines which card wins in a trick
   - `game.js`: Manages the overall game state and flow

2. **Player Logic**:
   - `player.js`: Represents a player in the game
   - `hand.js`: Manages a player's hand of cards
   - `stratagies/play/`: Contains AI strategies for computer players

3. **UI Components**:
   - `turn.js`: Manages the UI for a single turn of play
   - `css/style.css`: Contains styles and animations for the game

### Design Patterns

1. **Strategy Pattern**:
   - Used for AI player decision-making
   - Allows for different computer player behaviors
   - Facilitates testing of different play strategies

2. **Observer Pattern**:
   - Used for updating the UI when game state changes
   - Helps maintain separation between game logic and UI

3. **Factory Pattern**:
   - Used for creating card objects
   - Ensures consistency in card creation and validation

## Future Considerations

- As the game moves from a single-player to a multiplayer format, there may be a need to enhance the testing framework to support server-client interactions, networked games, and multiplayer game rules.
- The HTML5 and JavaScript technologies used in the project allow for easy transitions into a server-based version in the future if the project evolves to support multiplayer gameplay.

---

This document serves as a high-level reference for developers and testers to understand the core technologies and testing infrastructure used in the game. It will be updated as new tools, frameworks, or features are added.
