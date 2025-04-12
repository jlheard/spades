// QUnit test file for rule enforcement edge cases
import { LegalPlayRules } from '../../legalPlayRules.js';
import { Hand } from '../../hand.js';
import { Card } from '../../card.js';
import { Player } from '../../player.js';

// Define a QUnit module for rule enforcement tests
QUnit.module('Rule Enforcement Tests', {
  beforeEach: function() {
    // Set up the DOM elements needed for testing
    this.fixture = document.getElementById('qunit-fixture');
    
    // Create a mock player hand element
    this.mockPlayerHandElement = document.createElement('div');
    this.mockPlayerHandElement.id = 'player-hand';
    this.fixture.appendChild(this.mockPlayerHandElement);
    
    // Create a player for testing
    this.player = new Player('TestPlayer');
  }
});

// Test playing spades when player has no cards of the leading suit
QUnit.test('Player can play spades when they have no cards of the leading suit', function(assert) {
  // Arrange
  const spadeCard = new Card('Q', 'Spades');
  const heartCard = new Card('K', 'Hearts');
  const diamondCard = new Card('A', 'Diamonds');
  
  // Set up a hand with no clubs
  this.player.hand.setCards([spadeCard, heartCard, diamondCard]);
  
  // Act
  const leadingSuit = 'Clubs';
  const spadesBroken = false; // Spades not broken yet
  const handDoesNotHaveLeadingSuit = !this.player.hand.cards.some(c => c.suit === leadingSuit);
  
  // Log for debugging
  console.log(`Hand has leading suit (${leadingSuit}): ${!handDoesNotHaveLeadingSuit}`);
  console.log(`Cards in hand:`, this.player.hand.cards.map(c => `${c.rank} of ${c.suit}`));
  
  // Assert
  assert.strictEqual(handDoesNotHaveLeadingSuit, true, 'Player should not have any clubs in hand');
  
  // Test if spades can be played
  const isSpadePlayable = LegalPlayRules.isCardLegalToPlay(
    spadeCard, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit
  );
  
  assert.strictEqual(isSpadePlayable, true, 
    'Spades should be playable when player has no cards of the leading suit');
  
  // Test if other suits can be played
  const isHeartPlayable = LegalPlayRules.isCardLegalToPlay(
    heartCard, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit
  );
  
  assert.strictEqual(isHeartPlayable, true, 
    'Hearts should be playable when player has no cards of the leading suit');
});

// Test playing spades when player has cards of the leading suit
QUnit.test('Player cannot play spades when they have cards of the leading suit', function(assert) {
  // Arrange
  const spadeCard = new Card('Q', 'Spades');
  const clubCard = new Card('K', 'Clubs');
  const diamondCard = new Card('A', 'Diamonds');
  
  // Set up a hand with clubs
  this.player.hand.setCards([spadeCard, clubCard, diamondCard]);
  
  // Act
  const leadingSuit = 'Clubs';
  const spadesBroken = false; // Spades not broken yet
  const handDoesNotHaveLeadingSuit = !this.player.hand.cards.some(c => c.suit === leadingSuit);
  
  // Log for debugging
  console.log(`Hand has leading suit (${leadingSuit}): ${!handDoesNotHaveLeadingSuit}`);
  console.log(`Cards in hand:`, this.player.hand.cards.map(c => `${c.rank} of ${c.suit}`));
  
  // Assert
  assert.strictEqual(handDoesNotHaveLeadingSuit, false, 'Player should have clubs in hand');
  
  // Test if spades can be played
  const isSpadePlayable = LegalPlayRules.isCardLegalToPlay(
    spadeCard, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit
  );
  
  assert.strictEqual(isSpadePlayable, false, 
    'Spades should not be playable when player has cards of the leading suit');
  
  // Test if clubs can be played
  const isClubPlayable = LegalPlayRules.isCardLegalToPlay(
    clubCard, leadingSuit, spadesBroken, handDoesNotHaveLeadingSuit
  );
  
  assert.strictEqual(isClubPlayable, true, 
    'Clubs should be playable when clubs are the leading suit');
});

// Test UI state for valid plays
QUnit.test('UI correctly shows valid plays when player has no cards of the leading suit', function(assert) {
  // Arrange
  const spadeCard = new Card('Q', 'Spades');
  const heartCard = new Card('K', 'Hearts');
  const diamondCard = new Card('A', 'Diamonds');
  
  // Set up a hand with no clubs
  this.player.hand.setCards([spadeCard, heartCard, diamondCard]);
  
  // Act
  const leadingSuit = 'Clubs';
  const spadesBroken = false; // Spades not broken yet
  
  // Populate the hand element
  this.player.populateHandElement(this.mockPlayerHandElement, spadesBroken, leadingSuit);
  
  // Assert
  // Get all card elements
  const cardElements = this.mockPlayerHandElement.querySelectorAll('.card');
  
  // Check that all cards are marked as valid plays
  let allCardsValid = true;
  cardElements.forEach(cardElement => {
    if (!cardElement.classList.contains('valid-play')) {
      allCardsValid = false;
      
      // Log for debugging
      const cardContent = cardElement.querySelector('.card-content').textContent;
      console.log(`Card ${cardContent} is not marked as valid`);
    }
  });
  
  assert.strictEqual(allCardsValid, true, 
    'All cards should be marked as valid plays when player has no cards of the leading suit');
});

// Test integration with Hand.getLegalPlaysMap()
QUnit.test('Hand.getLegalPlaysMap() correctly identifies legal plays when player has no cards of the leading suit', function(assert) {
  // Arrange
  const spadeCard = new Card('Q', 'Spades');
  const heartCard = new Card('K', 'Hearts');
  const diamondCard = new Card('A', 'Diamonds');
  
  // Set up a hand with no clubs
  const hand = new Hand();
  hand.setCards([spadeCard, heartCard, diamondCard]);
  
  // Act
  const leadingSuit = 'Clubs';
  const spadesBroken = false; // Spades not broken yet
  
  const legalPlaysMap = hand.getLegalPlaysMap(leadingSuit, spadesBroken);
  
  // Log for debugging
  console.log('Legal plays:', Array.from(legalPlaysMap.values()).map(c => `${c.rank} of ${c.suit}`));
  
  // Assert
  assert.strictEqual(legalPlaysMap.size, 3, 
    'All 3 cards should be legal plays when player has no cards of the leading suit');
  
  // Check if spades are included in legal plays
  let spadesIncluded = false;
  legalPlaysMap.forEach((card) => {
    if (card.suit === 'Spades') {
      spadesIncluded = true;
    }
  });
  
  assert.strictEqual(spadesIncluded, true, 
    'Spades should be included in legal plays when player has no cards of the leading suit');
});
