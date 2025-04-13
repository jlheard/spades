# ADR 003: Leading Suit Validation Fix

## Status

Accepted

## Context

We identified a critical bug in the game's rule enforcement logic. When a computer player led a trick (after winning the previous trick), the human player's hand wasn't properly updated to show only cards of the leading suit as valid plays. This resulted in:

1. The player being able to play cards that should be invalid (not following suit)
2. The game allowing plays that violate the core rule: "Players must follow suit if they have a card in that suit"

Specific scenario:
1. Human player starts and plays a 5 of hearts
2. East player wins and leads with a 3 of diamonds in the next round
3. Human player's hand incorrectly shows hearts and clubs as valid plays (spades are correctly shown as invalid if not broken)
4. Human player can play an Ace of clubs, which should be invalid if they have any diamonds

## Decision

We decided to fix this issue by updating the `computerPlayCard` method in the `Turn` class to update the human player's hand after a computer player plays a card, especially when they lead a trick.

The fix involves:

1. Adding code to the `computerPlayCard` method to update the human player's hand after a computer player plays a card
2. Ensuring the leading suit is correctly determined and passed to the `updateHandElement` method
3. Adding appropriate logging to track the leading suit throughout the trick

```javascript
// Update the human player's hand to reflect the new leading suit
// This is especially important when a computer player leads a trick
if (this.cardsPlayed === 1) {
    // This is the first card played in the trick, so it's the leading suit
    console.log(`Computer player ${this.currentPlayer.name} led with ${playedCard.suit}, updating human player's hand`);
    this.players[0].updateHandElement(this.game.getSpadesBroken(), playedCard.suit);
}
```

## Consequences

### Positive

- The game now correctly enforces the rule that players must follow suit if they have cards of the leading suit
- The UI correctly shows which cards are valid plays based on the leading suit
- The fix is minimal and focused, only affecting the specific code path that needed to be fixed
- We've added comprehensive integration tests to ensure this behavior works correctly and prevent regression

### Negative

- The fix adds a bit more complexity to the `computerPlayCard` method
- We're still relying on the UI to enforce the rules, rather than having a more robust validation system

### Neutral

- This fix doesn't address the broader issue of state management in the game, which might benefit from a more comprehensive refactoring in the future
- We've added more logging, which helps with debugging but might need to be cleaned up in a production release

## Related Issues

This is distinct from the previously fixed issues:
- The spadesBroken state persistence issue (which has been fixed by moving state to the Game class)
- The UI animation issues with card values not displaying properly

## References

- [Game Rules Documentation](../gameRules.md)
- [Leading Suit Validation Tests](../../js/test/qunit/integration/leadingSuitValidation.test.js)
