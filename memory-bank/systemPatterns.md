# System Patterns - Spades (Single Player Implementation)

This document describes the core software design patterns used in the architecture of the single-player Spades game. These patterns enable flexible, scalable, and testable code that can adapt as the game logic and complexity evolve.

## Strategy Pattern

### Purpose

The **Strategy Pattern** is used to define how computer-controlled players choose cards to play during their turns. This pattern allows each AI player to have a distinct decision-making strategy, while the main game engine can remain agnostic to the specific behavior of each player.

### How It’s Used

- Each computer player is assigned an instance of a `PlayStrategy` object.
- The `PlayStrategy` encapsulates logic for selecting a card based on:
  - The current hand.
  - The trick’s lead suit.
  - The game state (e.g., broken spades, known cards, player position).
- Strategies can be easily swapped or extended:
  - For example, `BasicStrategy`, `AggressiveStrategy`, or `NilStrategy`.

### Benefits

- Promotes separation of concerns between game engine and player logic.
- Makes it easier to test individual strategies.
- Supports future enhancements like difficulty levels or bluffing behavior.

---

## Other Patterns (Planned or In Use)

### Module Pattern (ES6 Modules)

- The codebase is organized into logical modules (`Card`, `Player`, `Deck`, `Game`, etc.).
- This improves readability, testability, and separation of responsibilities.

### Observer Pattern (Planned for UI Updates)

- May be implemented to coordinate state changes between the game logic and the UI.
- Would allow the UI to respond dynamically to card plays, trick results, or game completion.

### Factory Pattern (Planned for Game Setup)

- Could be used to encapsulate the setup process (deck generation, player creation, dealing hands).
- Would allow for easy setup variations (e.g., 3-player, 6-player, multiplayer variants).

---

## Summary

The Strategy pattern is currently the primary design pattern driving decision-making for AI players. As development continues, additional patterns may be introduced to support advanced features, multiplayer functionality, and a more reactive UI.

This file (`docs/systemPatterns.md`) acts as the canonical record of architecture decisions for reference by developers, testers, and future contributors.
