// QUnit test file for Card class
import { Card, RANKS, SUITS } from '../../card.js';

// Define a QUnit module for Card tests
QUnit.module('Card Tests', function() {
  
  // Test card creation
  QUnit.test('Card creation with valid parameters', function(assert) {
    const card = new Card('A', 'Spades');
    assert.equal(card.rank, 'A', 'Card has correct rank');
    assert.equal(card.suit, 'Spades', 'Card has correct suit');
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
  });
  
  // Test card equality
  QUnit.test('Card equality', function(assert) {
    const card1 = new Card('A', 'Spades');
    const card2 = new Card('A', 'Spades');
    const card3 = new Card('K', 'Spades');
    
    assert.ok(card1.equals(card2), 'Cards with same rank and suit are equal');
    assert.notOk(card1.equals(card3), 'Cards with different ranks are not equal');
  });
  
  // Test card toString
  QUnit.test('Card toString', function(assert) {
    const card = new Card('A', 'Spades');
    assert.equal(card.toString(), 'A of Spades', 'toString returns correct string representation');
  });
  
  // Test fromCardContentDivElement
  QUnit.test('fromCardContentDivElement', function(assert) {
    // Create a mock card content div element
    const element = document.createElement('div');
    element.innerHTML = 'A&nbsp;♠';
    
    const card = Card.fromCardContentDivElement(element);
    
    assert.equal(card.rank, 'A', 'Extracted correct rank from element');
    assert.equal(card.suit, 'Spades', 'Extracted correct suit from element');
  });
});
