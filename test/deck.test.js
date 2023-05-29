import { shuffleDeck, dealCards, initializeDeck } from '../js/deck.js';
import { beforeEach, test, assert, setTestFile } from './testUtils.js';

export function deckTest() {
  let deck = initializeDeck();
  setTestFile('deck.test.js')

  beforeEach(() => {
    deck = initializeDeck(); // Reset the deck before each test
  });

  test('Deck should be initialized correctly', () => {
    assert(deck.length === 52, 'Deck size is incorrect');
    const bigJoker = deck.find(card => card.rank === 'BigJoker');
    const extraJoker = deck.find(card => card.rank === 'ExtraJoker');    
    assert(bigJoker !== undefined, 'Big Joker is missing from the deck');    
    assert(extraJoker !== undefined, 'Extra Joker is missing from the deck');
    const twoOfClubs = deck.find(card => card.rank === '2' && card.suit === 'Clubs');
    const twoOfHearts = deck.find(card => card.rank === '2' && card.suit === 'Hearts');
    assert(twoOfClubs === undefined, '2 of Clubs should be removed from the deck');
    assert(twoOfHearts === undefined, '2 of Hearts should be removed from the deck');    
  });

  test('Shuffling the deck should change the order of cards', () => {
    const originalDeck = deck.slice();
    console.log('original deck:', originalDeck);
    const shuffledDeck = shuffleDeck(deck);
    console.log('Shuffled deck:', shuffledDeck);
    assert(JSON.stringify(shuffledDeck) !== JSON.stringify(originalDeck), 'Deck order is not changed');
  });

  test('Dealing cards should reduce the deck size', () => {
    const numCardsToDeal = 5;
    const initialDeckSize = deck.length;
    const dealtCards = dealCards(deck, numCardsToDeal);
    console.log('Dealt cards:', dealtCards);
    console.log('Remaining deck:', deck);
    assert(deck.length === initialDeckSize - numCardsToDeal, 'Deck size is not reduced');
    assert(dealtCards.length === numCardsToDeal, 'Incorrect number of cards dealt');
  });

  test('Resetting the deck should bring back all the cards', () => {
    shuffleDeck(deck);
    const shuffledDeck = deck.slice();
    initializeDeck();
    console.log('Reset deck:', deck);
    assert(JSON.stringify(deck) === JSON.stringify(shuffledDeck), 'Deck is not reset');
  });
}
