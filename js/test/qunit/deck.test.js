// QUnit test file for Deck class
import { Deck, getSuitSymbol } from '../../deck.js';
import { Card } from '../../card.js';

// Define a QUnit module for Deck tests
QUnit.module('Deck Tests', {
  beforeEach: function() {
    this.deck = new Deck();
    this.cardsInDeck = this.deck.cards;
  }
});

// Test deck initialization
QUnit.test('Deck should be initialized correctly', function(assert) {
  assert.equal(this.cardsInDeck.length, 52, 'Deck size is correct (52 cards)');
  
  // Check for jokers
  const bigJoker = this.cardsInDeck.find(card => card.rank === 'BigJoker');
  const extraJoker = this.cardsInDeck.find(card => card.rank === 'ExtraJoker');
  assert.ok(bigJoker !== undefined, 'Big Joker is present in the deck');
  assert.ok(extraJoker !== undefined, 'Extra Joker is present in the deck');
  
  // Check that 2 of Clubs and 2 of Hearts are removed
  const twoOfClubs = this.cardsInDeck.find(card => card.rank === '2' && card.suit === 'Clubs');
  const twoOfHearts = this.cardsInDeck.find(card => card.rank === '2' && card.suit === 'Hearts');
  assert.ok(twoOfClubs === undefined, '2 of Clubs is removed from the deck');
  assert.ok(twoOfHearts === undefined, '2 of Hearts is removed from the deck');
  
  // Check that other cards are present
  const aceOfSpades = this.cardsInDeck.find(card => card.rank === 'A' && card.suit === 'Spades');
  const kingOfHearts = this.cardsInDeck.find(card => card.rank === 'K' && card.suit === 'Hearts');
  assert.ok(aceOfSpades !== undefined, 'Ace of Spades is present in the deck');
  assert.ok(kingOfHearts !== undefined, 'King of Hearts is present in the deck');
  
  // Check that each suit has the correct number of cards (13 - 1 for Hearts and Clubs, 13 for others)
  const spadesCount = this.cardsInDeck.filter(card => card.suit === 'Spades' && card.rank !== 'BigJoker' && card.rank !== 'ExtraJoker').length;
  const heartsCount = this.cardsInDeck.filter(card => card.suit === 'Hearts').length;
  const diamondsCount = this.cardsInDeck.filter(card => card.suit === 'Diamonds').length;
  const clubsCount = this.cardsInDeck.filter(card => card.suit === 'Clubs').length;
  
  assert.equal(spadesCount, 13, 'Spades has 13 cards (excluding jokers)');
  assert.equal(heartsCount, 12, 'Hearts has 12 cards (2 of Hearts removed)');
  assert.equal(diamondsCount, 13, 'Diamonds has 13 cards');
  assert.equal(clubsCount, 12, 'Clubs has 12 cards (2 of Clubs removed)');
});

// Test deck shuffling
QUnit.test('Shuffling the deck should change the order of cards', function(assert) {
  // Create a copy of the original deck
  const originalDeck = this.cardsInDeck.slice();
  
  // Shuffle the deck
  const shuffledDeck = this.deck.shuffleDeck();
  
  // Check that the shuffled deck has the same number of cards
  assert.equal(shuffledDeck.length, originalDeck.length, 'Shuffled deck has the same number of cards');
  
  // Check that the shuffled deck contains all the same cards (but in a different order)
  let allCardsPresent = true;
  for (const originalCard of originalDeck) {
    const foundCard = shuffledDeck.find(card => 
      card.rank === originalCard.rank && card.suit === originalCard.suit);
    if (!foundCard) {
      allCardsPresent = false;
      break;
    }
  }
  assert.ok(allCardsPresent, 'All cards are present in the shuffled deck');
  
  // Check that the order has changed (this could theoretically fail if the shuffle doesn't change the order,
  // but the probability is extremely low)
  let orderChanged = false;
  for (let i = 0; i < originalDeck.length; i++) {
    if (originalDeck[i].rank !== shuffledDeck[i].rank || originalDeck[i].suit !== shuffledDeck[i].suit) {
      orderChanged = true;
      break;
    }
  }
  assert.ok(orderChanged, 'The order of cards has changed after shuffling');
});

// Test dealing cards
QUnit.test('Dealing cards should reduce the deck size', function(assert) {
  const numCardsToDeal = 13;
  const initialDeckSize = this.cardsInDeck.length;
  
  // Deal cards
  const dealtCards = this.deck.dealCards(numCardsToDeal);
  
  // Check that the correct number of cards were dealt
  assert.equal(dealtCards.length, numCardsToDeal, 'Correct number of cards were dealt');
  
  // Check that the deck size was reduced
  assert.equal(this.cardsInDeck.length, initialDeckSize - numCardsToDeal, 'Deck size was reduced correctly');
  
  // Check that the dealt cards are no longer in the deck
  for (const dealtCard of dealtCards) {
    const foundCard = this.cardsInDeck.find(card => 
      card.rank === dealtCard.rank && card.suit === dealtCard.suit);
    assert.ok(!foundCard, `${dealtCard.rank} of ${dealtCard.suit} is no longer in the deck`);
  }
});

// Test dealing more cards than available
QUnit.test('Dealing more cards than available should return an empty array', function(assert) {
  const initialDeckSize = this.cardsInDeck.length;
  
  // Deal more cards than available
  const dealtCards = this.deck.dealCards(initialDeckSize + 1);
  
  // Check that an empty array was returned
  assert.equal(dealtCards.length, 0, 'An empty array was returned');
  
  // Check that the deck size was not changed
  assert.equal(this.cardsInDeck.length, initialDeckSize, 'Deck size was not changed');
});

// Test dealing all cards
QUnit.test('Dealing all cards should empty the deck', function(assert) {
  const initialDeckSize = this.cardsInDeck.length;
  
  // Deal all cards
  const dealtCards = this.deck.dealCards(initialDeckSize);
  
  // Check that all cards were dealt
  assert.equal(dealtCards.length, initialDeckSize, 'All cards were dealt');
  
  // Check that the deck is empty
  assert.equal(this.cardsInDeck.length, 0, 'Deck is empty');
});

// Test creating a new deck after dealing cards
QUnit.test('Creating a new deck should reset the deck', function(assert) {
  // Deal some cards
  this.deck.dealCards(10);
  
  // Create a new deck
  const newDeck = new Deck();
  
  // Check that the new deck has the correct number of cards
  assert.equal(newDeck.cards.length, 52, 'New deck has 52 cards');
});

// Define a QUnit module for utility functions
QUnit.module('Deck Utility Functions');

// Test getSuitSymbol
QUnit.test('getSuitSymbol should return the correct HTML symbol for each suit', function(assert) {
  assert.equal(getSuitSymbol('Hearts'), '&hearts;', 'Returns correct HTML entity for Hearts');
  assert.equal(getSuitSymbol('Diamonds'), '&diams;', 'Returns correct HTML entity for Diamonds');
  assert.equal(getSuitSymbol('Clubs'), '&clubs;', 'Returns correct HTML entity for Clubs');
  assert.equal(getSuitSymbol('Spades'), '&spades;', 'Returns correct HTML entity for Spades');
  assert.equal(getSuitSymbol('InvalidSuit'), '', 'Returns empty string for invalid suit');
});
