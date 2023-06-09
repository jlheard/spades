import { Card } from '../card.js';
import { compareCardsForTurn } from '../cardComparer.js';
import { assert, test, beforeEach, setTestFile } from './testUtils.js';

export function cardComparerTest() {
  beforeEach(() => {
    // Set up any necessary test data or configurations
  });

  // Set the current test file name
  setTestFile('cardComparer.test.js');

  // Test case: All cards have the same suit, compare their ranks
  test('Compare cards of the same suit', () => {
    const leadCard = new Card('K', 'Hearts');
    const card2 = new Card('Q', 'Hearts');
    const card3 = new Card('A', 'Hearts');
    const card4 = new Card('J', 'Hearts');
    const playerForPlayedCardMap = new Map([
      [leadCard, 'Player 1'],
      [card2, 'Player 2'],
      [card3, 'Player 3'],
      [card4, 'Player 4'],
    ]);

    assert(
      compareCardsForTurn(playerForPlayedCardMap) === card3,
      'Expected card3 to win'
    );
  });

  // Test case: Lead card is a spade, no other spades present
  test('Lead card wins if it is a spade and no other spades present', () => {
    const leadCard = new Card('K', 'Spades');
    const card2 = new Card('A', 'Hearts');
    const card3 = new Card('Q', 'Diamonds');
    const card4 = new Card('J', 'Clubs');
    const playerForPlayedCardMap = new Map([
      [leadCard, 'Player 1'],
      [card2, 'Player 2'],
      [card3, 'Player 3'],
      [card4, 'Player 4'],
    ]);

    assert(
      compareCardsForTurn(playerForPlayedCardMap) === leadCard,
      'Expected lead card to win as no other spades present'
    );
  });

  // Test case: Lead card is a spade, other spades present
  test('Lead card does not win if it is a spade but other spades present', () => {
    const leadCard = new Card('K', 'Spades');
    const card2 = new Card('A', 'Spades');
    const card3 = new Card('Q', 'Diamonds');
    const card4 = new Card('J', 'Clubs');
    const playerForPlayedCardMap = new Map([
      [leadCard, 'Player 1'],
      [card2, 'Player 2'],
      [card3, 'Player 3'],
      [card4, 'Player 4'],
    ]);

    assert(
      compareCardsForTurn(playerForPlayedCardMap) === card2,
      'Expected card2 to win as other spades present'
    );
  });

  // Test case: Lead card is not a spade, other spades present
  test('Lead card does not win if it is not a spade but other spades present', () => {
    const leadCard = new Card('K', 'Hearts');
    const card2 = new Card('A', 'Spades');
    const card3 = new Card('Q', 'Diamonds');
    const card4 = new Card('J', 'Clubs');
    const playerForPlayedCardMap = new Map([
      [leadCard, 'Player 1'],
      [card2, 'Player 2'],
      [card3, 'Player 3'],
      [card4, 'Player 4'],
    ]);

    assert(
      compareCardsForTurn(playerForPlayedCardMap) === card2,
      'Expected card2 to win as other spades present'
    );
  });

  // Test case: Lead card is not a spade, no other spades present
  test('Lead card wins if it is not a spade and no other spades present', () => {
    const leadCard = new Card('K', 'Hearts');
    const card2 = new Card('A', 'Diamonds');
    const card3 = new Card('Q', 'Clubs');
    const card4 = new Card('J', 'Clubs');
    const playerForPlayedCardMap = new Map([
      [leadCard, 'Player 1'],
      [card2, 'Player 2'],
      [card3, 'Player 3'],
      [card4, 'Player 4'],
    ]);

    assert(
      compareCardsForTurn(playerForPlayedCardMap) === leadCard,
      'Expected lead card to win as no other spades present'
    );
  });

  // Test case: Spades test
  test('Correct card should win when all spades present', () => {
    const leadCard = new Card('K', 'Spades');
    const card2 = new Card('A', 'Spades');
    const card3 = new Card('Q', 'Spades');
    const card4 = new Card('J', 'Spades');
    const playerForPlayedCardMap = new Map([
      [leadCard, 'Player 1'],
      [card2, 'Player 2'],
      [card3, 'Player 3'],
      [card4, 'Player 4'],
    ]);

    assert(
      compareCardsForTurn(playerForPlayedCardMap) === card2,
      'Expected lead card to win as no other spades present'
    );
  });  
}
