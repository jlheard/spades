# ADR-002: Spades Broken State Management

## Status
Accepted

## Context
In the Spades game implementation, we need to track whether spades have been "broken" (played in a trick) as this affects the legality of certain plays. Once spades are broken, they remain broken for the remainder of the game.

The original implementation stored the `spadesBroken` flag in the Turn class and incorrectly reset it to false at the end of each trick. This caused a critical bug where valid plays would run out as the game progressed.

## Decision
We will move the `spadesBroken` state from the Turn class to the Game class. The Game class is a more appropriate location for game-wide state that persists across turns.

## Alternatives Considered
1. **Fix the reset bug in Turn**: Simply remove the line that resets spadesBroken. This would fix the immediate issue but wouldn't address the architectural concern.

2. **Create a dedicated GameState class**: Implement a separate class to manage all game state. While this would be the most flexible and extensible solution, it would require significant refactoring and might be overkill for the current needs.

## Future Considerations
In the future, as the game grows in complexity, we may want to revisit the third option and implement a dedicated GameState engine. This would provide:
- Centralized state management
- Clear state transitions
- Better testability
- Support for more complex game features like bidding, scoring, and game progression

## Consequences

### Positive
- The `spadesBroken` state will correctly persist throughout the game
- Better separation of concerns: game-wide state belongs in the Game class
- Improved code maintainability and clarity
- Fixes the critical bug where valid plays run out

### Negative
- Requires changes across multiple files
- Slightly more complex parameter passing

## Implementation Plan
1. Add `spadesBroken` property to Game class with a default value of `false`
2. Add getter/setter methods for the property
3. Modify Turn constructor to accept the game instance instead of just players
4. Update all references to `this.spadesBroken` in Turn to use `this.game.spadesBroken`
5. Remove the line in Turn.playNextTurn that resets spadesBroken
6. Update main.js to pass the game instance to Turn
7. Update tests to reflect the new structure
