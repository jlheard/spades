# Game Rules - Spades (Single Player Implementation)

This file defines the canonical rules for the Spades card game as implemented in the HTML5/JavaScript single-player version. This serves as the authoritative source for both gameplay logic and automated testing.

## General Rules

1. **Players and Teams**

   - There are four players.
   - The game is played with two teams: Player and Partner vs. Opponents.

2. **Card Deck**

   - Custom 52-card deck including:
     - **Two Jokers**: Big Joker and Little Joker (implemented as 'BigJoker' and 'ExtraJoker' in code).
     - **Removed Cards**: 2 of Clubs and 2 of Hearts.
   - Suits: Spades, Hearts, Diamonds, Clubs.
   - Ranks (high to low): Big Joker, Little Joker, A, K, Q, J, 10, 9, 8, 7, 6, 5, 4, 3, 2 (excluding 2♣ and 2♥).
   - **Note for Developers**: In the code implementation, jokers have the suit 'Spades' and ranks 'BigJoker' and 'ExtraJoker'.

3. **Spades Are Always Trump**

   - Spades beat all other suits.
   - Jokers beat all other cards, including spades.
   - Big Joker > Little Joker > any Spade > all other suits.
   - You cannot lead with spades until they have been "broken" (played in a previous trick by another player).
   - Jokers **can** be played anytime the player cannot follow suit.

4. **Leading and Following Suit**

   - The player who wins the previous trick leads the next.
   - Players must follow suit if they have a card in that suit.
   - If a player has no cards in the suit led, they may play any card, including jokers and spades.

5. **Winning a Trick**

   - Jokers win over all other cards.
   - If multiple jokers are played, the Big Joker wins.
   - If no jokers are played:
     - If no spades are played, the highest card of the suit led wins.
     - If one or more spades are played, the highest spade wins.

6. **Turn Order and Trick Flow**

   - Turn order is clockwise.
   - Each player plays one card per trick.
   - The winning card remains visible until the next trick starts.

## UI and UX Rules

1. **Card Visibility and Play Flow**

   - After the human player plays a card, the card should remain visible on the board until the trick ends.
   - Players should not be allowed to play cards out of turn.
   - The UI should indicate which cards were played during the current trick.

2. **Validation**

   - Enforce suit-following rules strictly.
   - Do not allow invalid plays (e.g., playing off-suit when holding matching suit).
   - Validate Joker play: Jokers may only be played if the player cannot follow suit.

3. **Player Experience**

   - Allow time for the player to see what happened in a trick before clearing the board.
   - Animate or highlight the winning card of the trick.

## Testing and Automation Notes

- These rules should be enforced via integration tests.
- Unit tests should test individual rule scenarios (e.g., Joker beats Spade, must follow suit).
- The file `docs/gameRules.md` is referenced in tests and logic as the source of truth.

---

This ruleset may evolve as the game becomes more advanced or if multiplayer/networking support is added.
