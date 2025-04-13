# ADR 004: Card Comparison and Error Handling Improvements

## Status

Accepted

## Context

We identified two critical bugs in the game:

1. **Incorrect Card Comparison**: In some cases, lower-ranked cards were incorrectly winning tricks. For example, a 5 of diamonds would beat a 10 of diamonds. This was particularly noticeable with the West player's cards.

2. **Game Crash with Few Cards**: Towards the end of a round, when players had 5 or fewer cards in their hand, the game would crash with the error: "Uncaught TypeError: Cannot read properties of null (reading 'rank')" at Turn.computerPlayCard (turn.js:143:85).

These issues significantly impacted gameplay, causing incorrect trick winners and preventing players from completing games.

## Decision

We decided to implement the following fixes:

### 1. Improved Card Comparison Logic

We enhanced the card comparison logic in `cardComparer.js` to:
- Add detailed logging to track the comparison process
- Make the rank comparison more explicit and readable
- Ensure that higher-ranked cards of the same suit always win
- Fix issues with spades comparison to ensure higher-ranked spades win
- Properly handle jokers to ensure they beat all other cards

```javascript
// Before
if (card.suit === leadCard.suit && RANKS.indexOf(card.rank) < RANKS.indexOf(winningCard.rank)) {
  winningCard = card;
}

// After (initial improvement)
if (card.suit === leadCard.suit) {
  // Only compare ranks if the card is of the same suit as the lead card
  const cardRankIndex = RANKS.indexOf(card.rank);
  const winningRankIndex = RANKS.indexOf(winningCard.rank);
  
  console.log(`Rank indices: ${card.rank}=${cardRankIndex}, ${winningCard.rank}=${winningRankIndex}`);
  
  // Lower index in RANKS array means higher rank
  if (cardRankIndex < winningRankIndex) {
    console.log(`${card.rank} of ${card.suit} beats ${winningCard.rank} of ${winningCard.suit}`);
    winningCard = card;
  } else {
    console.log(`${winningCard.rank} of ${winningCard.suit} remains the winner`);
  }
}
```

We later completely refactored the card comparison logic to address additional issues with spades and jokers:

```javascript
export function compareCardsForTurn(playerForPlayedCardMap) {
  const cardsArray = Array.from(playerForPlayedCardMap.keys());
  
  // First, check for jokers which beat everything
  const jokers = cardsArray.filter(card => card.rank === 'BigJoker' || card.rank === 'ExtraJoker');
  
  if (jokers.length > 0) {
    // If there are jokers, find the highest ranked one (lowest index in RANKS)
    return jokers.reduce((highestJoker, joker) => {
      return RANKS.indexOf(joker.rank) < RANKS.indexOf(highestJoker.rank) ? joker : highestJoker;
    }, jokers[0]);
  }
  
  // No jokers, so check for spades
  const spades = cardsArray.filter(card => card.suit === 'Spades');
  
  if (spades.length > 0) {
    // If there are spades, find the highest ranked one (lowest index in RANKS)
    return spades.reduce((highestSpade, spade) => {
      return RANKS.indexOf(spade.rank) < RANKS.indexOf(highestSpade.rank) ? spade : highestSpade;
    }, spades[0]);
  }
  
  // No spades or jokers, so follow the lead suit
  const leadCard = cardsArray[0];
  const leadSuitCards = cardsArray.filter(card => card.suit === leadCard.suit);
  
  // Find the highest ranked card of the lead suit
  return leadSuitCards.reduce((highestCard, card) => {
    return RANKS.indexOf(card.rank) < RANKS.indexOf(highestCard.rank) ? card : highestCard;
  }, leadSuitCards[0]);
}
```

This refactored approach:
1. First checks for jokers and returns the highest-ranked joker if any are present
2. If no jokers, checks for spades and returns the highest-ranked spade if any are present
3. If no jokers or spades, follows the lead suit and returns the highest-ranked card of that suit

### 2. Comprehensive Error Handling

We added robust error handling to prevent crashes when a computer player has no valid plays:

1. **Refactored the `computerPlayCard` method** in `Turn.js` to:
   - Check if the strategy returns a null card
   - Provide a fallback mechanism to use any card in the player's hand
   - End the trick early if no cards are available

2. **Updated the strategy classes** (`PlayStrategy` and `SmartPlayStrategy`) to:
   - Check if the player has any cards left in their hand
   - Use a fallback card if there are no valid plays
   - Add detailed logging to track the decision-making process

3. **Added helper methods** to `Turn.js`:
   - `handleComputerCardPlay`: Centralizes the logic for playing a computer player's card
   - `getFallbackCard`: Provides a fallback card if the strategy returns null
   - `endTrickEarly`: Gracefully ends a trick if no cards can be played

## Consequences

### Positive

- The game now correctly determines the winning card in all cases
- The game no longer crashes when players have few cards
- The code is more robust with better error handling
- Detailed logging helps diagnose any future issues
- New integration tests ensure these bugs don't return

### Negative

- The code is slightly more complex with additional error handling
- The additional logging might impact performance (though this is negligible)

### Neutral

- The fixes are focused on the specific issues and don't address broader architectural concerns
- The error handling is defensive rather than preventative (we handle errors when they occur rather than preventing them entirely)

## Testing

We created a new integration test file `js/test/qunit/integration/cardComparison.test.js` that specifically tests:
- Higher-ranked cards of the same suit winning
- Spades beating other suits
- The highest spade winning
- The highest card of the leading suit winning when no spades are played
- Jokers beating all other cards
- The specific case of 10 of diamonds beating 5 of diamonds

These tests ensure that the card comparison logic works correctly in all cases.

## References

- [Card Comparison Tests](../../js/test/qunit/integration/cardComparison.test.js)
- [Leading Suit Validation Tests](../../js/test/qunit/integration/leadingSuitValidation.test.js)
