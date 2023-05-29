import { Deck, getSuitSymbol } from '../deck.js';
import { beforeEach, test, assert, setTestFile } from './testUtils.js';

export function deckTest() {
  let deck;
  let cardsInDeck;
  setTestFile('deck.test.js')

  beforeEach(() => {
    deck = new Deck();
    cardsInDeck = deck.cards;
  });

  test('Deck should be initialized correctly', () => {
    assert(cardsInDeck.length === 52, 'Deck size is incorrect');
    const bigJoker = cardsInDeck.find(card => card.rank === 'BigJoker');
    const extraJoker = cardsInDeck.find(card => card.rank === 'ExtraJoker');    
    assert(bigJoker !== undefined, 'Big Joker is missing from the deck');    
    assert(extraJoker !== undefined, 'Extra Joker is missing from the deck');
    const twoOfClubs = cardsInDeck.find(card => card.rank === '2' && card.suit === 'Clubs');
    const twoOfHearts = cardsInDeck.find(card => card.rank === '2' && card.suit === 'Hearts');
    assert(twoOfClubs === undefined, '2 of Clubs should be removed from the deck');
    assert(twoOfHearts === undefined, '2 of Hearts should be removed from the deck');    
  });

  test('Shuffling the deck should change the order of cardsInDeck', () => {
    const originalDeck = cardsInDeck.slice();
    console.log('original deck:', originalDeck);
    const shuffledDeck = deck.shuffleDeck();
    console.log('Shuffled deck:', shuffledDeck);
    assert(JSON.stringify(shuffledDeck) !== JSON.stringify(originalDeck), 'Deck order is not changed');
  });

  test('Dealing cardsInDeck should reduce the deck size', () => {
    const numCardsInDeckToDeal = 52;
    const initialDeckSize = cardsInDeck.length;
    const dealtCardsInDeck = deck.dealCards(numCardsInDeckToDeal);
    console.log('Dealt cardsInDeck:', dealtCardsInDeck);
    console.log('Remaining deck:', deck);
    assert(cardsInDeck.length === initialDeckSize - numCardsInDeckToDeal, 'Deck size is not reduced');
    assert(dealtCardsInDeck.length === numCardsInDeckToDeal, 'Incorrect number of cardsInDeck dealt');
  });

  test('Resetting the deck should bring back all the cardsInDeck', () => {
    deck.shuffleDeck();
    const shuffledDeck = cardsInDeck.slice();
    deck = new Deck();
    console.log('Reset deck:', cardsInDeck);
    assert(JSON.stringify(cardsInDeck) === JSON.stringify(shuffledDeck), 'Deck is not reset');
  });

  test('getSuitSymbol should return the correct HTML symbol for each suit', () => {
    const heartsSymbol = getSuitSymbol('Hearts');
    assert(heartsSymbol === '&hearts;', 'Incorrect symbol for Hearts');

    const diamondsSymbol = getSuitSymbol('Diamonds');
    assert(diamondsSymbol === '&diams;', 'Incorrect symbol for Diamonds');

    const clubsSymbol = getSuitSymbol('Clubs');
    assert(clubsSymbol === '&clubs;', 'Incorrect symbol for Clubs');

    const spadesSymbol = getSuitSymbol('Spades');
    assert(spadesSymbol === '&spades;', 'Incorrect symbol for Spades');

    const invalidSuitSymbol = getSuitSymbol('InvalidSuit');
    assert(invalidSuitSymbol === '', 'Invalid suit should return an empty string');
  });  
}
