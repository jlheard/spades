// QUnit test file for Card class
import { Card, RANKS, SUITS, getSuitSymbol, getSuitFromSymbol } from '../../card.js';

// Define a QUnit module for Card tests
QUnit.module('Card Tests', function() {
  
  // Test card creation
  QUnit.test('Card creation with valid parameters', function(assert) {
    const card = new Card('A', 'Spades');
    assert.equal(card.rank, 'A', 'Card has correct rank');
    assert.equal(card.suit, 'Spades', 'Card has correct suit');
    
    // Test creating cards with different ranks and suits
    const jokerCard = new Card('BigJoker', 'Spades');
    assert.equal(jokerCard.rank, 'BigJoker', 'Joker card has correct rank');
    assert.equal(jokerCard.suit, 'Spades', 'Joker card has correct suit');
    
    const numberCard = new Card('10', 'Hearts');
    assert.equal(numberCard.rank, '10', 'Number card has correct rank');
    assert.equal(numberCard.suit, 'Hearts', 'Number card has correct suit');
  });
  
  // Test card creation with invalid parameters
  QUnit.test('Card creation with invalid parameters', function(assert) {
    assert.throws(
      function() {
        new Card('Z', 'Spades'); // Invalid rank
      },
      /Invalid card rank/,
      'Throws error for invalid rank'
    );
    
    assert.throws(
      function() {
        new Card('A', 'Stars'); // Invalid suit
      },
      /Invalid card suit/,
      'Throws error for invalid suit'
    );
    
    assert.throws(
      function() {
        new Card(null, 'Spades'); // Null rank
      },
      /Invalid card rank/,
      'Throws error for null rank'
    );
    
    assert.throws(
      function() {
        new Card('A', null); // Null suit
      },
      /Invalid card suit/,
      'Throws error for null suit'
    );
  });
  
  // Test card equality
  QUnit.test('Card equality', function(assert) {
    const card1 = new Card('A', 'Spades');
    const card2 = new Card('A', 'Spades');
    const card3 = new Card('K', 'Spades');
    const card4 = new Card('A', 'Hearts');
    
    assert.ok(card1.equals(card2), 'Cards with same rank and suit are equal');
    assert.notOk(card1.equals(card3), 'Cards with different ranks are not equal');
    assert.notOk(card1.equals(card4), 'Cards with different suits are not equal');
    assert.notOk(card3.equals(card4), 'Cards with different ranks and suits are not equal');
  });
  
  // Test card hashCode
  QUnit.test('Card hashCode', function(assert) {
    const card1 = new Card('A', 'Spades');
    const card2 = new Card('A', 'Spades');
    const card3 = new Card('K', 'Spades');
    const card4 = new Card('A', 'Hearts');
    
    assert.equal(card1.hashCode(), card2.hashCode(), 'Equal cards have equal hash codes');
    assert.notEqual(card1.hashCode(), card3.hashCode(), 'Different cards have different hash codes');
    assert.notEqual(card1.hashCode(), card4.hashCode(), 'Different cards have different hash codes');
    assert.notEqual(card3.hashCode(), card4.hashCode(), 'Different cards have different hash codes');
    
    // Verify hashCode is consistent
    assert.equal(card1.hashCode(), card1.hashCode(), 'Hash code is consistent for the same card');
  });
  
  // Test card toString
  QUnit.test('Card toString', function(assert) {
    const card = new Card('A', 'Spades');
    assert.equal(card.toString(), 'A of Spades', 'toString returns correct string representation');
    
    const jokerCard = new Card('BigJoker', 'Spades');
    assert.equal(jokerCard.toString(), 'BigJoker of Spades', 'toString works for joker cards');
    
    const numberCard = new Card('10', 'Hearts');
    assert.equal(numberCard.toString(), '10 of Hearts', 'toString works for number cards');
  });
  
  // Test fromCardContentDivElement
  QUnit.test('fromCardContentDivElement', function(assert) {
    // Create a mock card content div element
    const element = document.createElement('div');
    element.innerHTML = 'A&nbsp;♠';
    
    const card = Card.fromCardContentDivElement(element);
    
    assert.equal(card.rank, 'A', 'Extracted correct rank from element');
    assert.equal(card.suit, 'Spades', 'Extracted correct suit from element');
    
    // Test with different suits
    const heartElement = document.createElement('div');
    heartElement.innerHTML = 'K&nbsp;♥';
    const heartCard = Card.fromCardContentDivElement(heartElement);
    assert.equal(heartCard.rank, 'K', 'Extracted correct rank from heart element');
    assert.equal(heartCard.suit, 'Hearts', 'Extracted correct suit from heart element');
    
    // Test with number rank
    const numberElement = document.createElement('div');
    numberElement.innerHTML = '10&nbsp;♦';
    const numberCard = Card.fromCardContentDivElement(numberElement);
    assert.equal(numberCard.rank, '10', 'Extracted correct number rank from element');
    assert.equal(numberCard.suit, 'Diamonds', 'Extracted correct suit from diamond element');
  });
});

// Define a QUnit module for utility functions
QUnit.module('Card Utility Functions', function() {
  
  // Test getSuitSymbol
  QUnit.test('getSuitSymbol', function(assert) {
    assert.equal(getSuitSymbol('Hearts'), '&hearts;', 'Returns correct HTML entity for Hearts');
    assert.equal(getSuitSymbol('Diamonds'), '&diams;', 'Returns correct HTML entity for Diamonds');
    assert.equal(getSuitSymbol('Clubs'), '&clubs;', 'Returns correct HTML entity for Clubs');
    assert.equal(getSuitSymbol('Spades'), '&spades;', 'Returns correct HTML entity for Spades');
    assert.equal(getSuitSymbol('InvalidSuit'), '', 'Returns empty string for invalid suit');
  });
  
  // Test getSuitFromSymbol
  QUnit.test('getSuitFromSymbol', function(assert) {
    assert.equal(getSuitFromSymbol('♥'), 'Hearts', 'Returns correct suit for Hearts symbol');
    assert.equal(getSuitFromSymbol('♦'), 'Diamonds', 'Returns correct suit for Diamonds symbol');
    assert.equal(getSuitFromSymbol('♣'), 'Clubs', 'Returns correct suit for Clubs symbol');
    assert.equal(getSuitFromSymbol('♠'), 'Spades', 'Returns correct suit for Spades symbol');
    assert.equal(getSuitFromSymbol('X'), '', 'Returns empty string for invalid symbol');
  });
  
  // Test RANKS and SUITS constants
  QUnit.test('RANKS and SUITS constants', function(assert) {
    assert.ok(Array.isArray(RANKS), 'RANKS is an array');
    assert.ok(RANKS.includes('A'), 'RANKS includes Ace');
    assert.ok(RANKS.includes('K'), 'RANKS includes King');
    assert.ok(RANKS.includes('Q'), 'RANKS includes Queen');
    assert.ok(RANKS.includes('J'), 'RANKS includes Jack');
    assert.ok(RANKS.includes('10'), 'RANKS includes 10');
    assert.ok(RANKS.includes('BigJoker'), 'RANKS includes BigJoker');
    assert.ok(RANKS.includes('ExtraJoker'), 'RANKS includes ExtraJoker');
    
    assert.ok(Array.isArray(SUITS), 'SUITS is an array');
    assert.ok(SUITS.includes('Hearts'), 'SUITS includes Hearts');
    assert.ok(SUITS.includes('Diamonds'), 'SUITS includes Diamonds');
    assert.ok(SUITS.includes('Clubs'), 'SUITS includes Clubs');
    assert.ok(SUITS.includes('Spades'), 'SUITS includes Spades');
    
    // Verify order for game logic
    assert.equal(RANKS[0], 'BigJoker', 'BigJoker is the highest rank');
    assert.equal(RANKS[1], 'ExtraJoker', 'ExtraJoker is the second highest rank');
    assert.equal(RANKS[2], 'A', 'Ace is the third highest rank');
  });
});
