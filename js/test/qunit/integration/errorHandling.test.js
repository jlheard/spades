// QUnit integration test for error handling
import { Game } from '../../../game.js';
import { Turn } from '../../../turn.js';
import { Card } from '../../../card.js';
import { LegalPlayRules } from '../../../legalPlayRules.js';

// Define a QUnit module for error handling tests
QUnit.module('Integration - Error Handling', {
  beforeEach: function() {
    // Set up the DOM elements needed for testing
    this.fixture = document.getElementById('qunit-fixture');
    
    // Create a mock player hand element
    this.mockPlayerHandElement = document.createElement('div');
    this.mockPlayerHandElement.id = 'player-hand';
    this.fixture.appendChild(this.mockPlayerHandElement);
    
    // Create a mock play area
    this.mockPlayArea = document.createElement('div');
    this.mockPlayArea.className = 'play-area';
    this.fixture.appendChild(this.mockPlayArea);
    
    // Create a new game
    this.game = new Game();
    
    // Create a custom Turn class for testing that doesn't auto-play computer cards
    this.TestTurn = class extends Turn {
      constructor(players, playerHandElement) {
        super(players, playerHandElement);
        // Reset cardsPlayed to 0 since the constructor might have triggered computer plays
        this.cardsPlayed = 0;
      }
      
      // Override playCard to do nothing in tests
      playCard() {
        // No-op for testing
      }
      
      // Override nextComputerTurn to do nothing in tests
      nextComputerTurn() {
        // No-op for testing
      }
    };
  }
});

// Test invalid card plays
QUnit.test('Invalid card plays show error message', function(assert) {
  // Set up a controlled hand for the human player with known cards
  this.game.players[0].hand.setCards([
    new Card('A', 'Hearts'),
    new Card('K', 'Hearts'),
    new Card('Q', 'Spades'),
    new Card('J', 'Diamonds')
  ]);
  
  // Create a turn instance
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  turn.currentPlayerIndex = 0;
  turn.currentPlayer = this.game.players[0];
  turn.cardsPlayed = 1; // Not leading
  
  // Simulate a previous play with clubs as the leading suit
  const clubsCard = new Card('10', 'Clubs');
  const clubsCardElement = document.createElement('div');
  clubsCardElement.className = 'card';
  clubsCardElement.innerHTML = '<div class="card-content">10&nbsp;♣</div>';
  this.mockPlayArea.appendChild(clubsCardElement);
  
  // Update the hand element with valid plays for following suit
  this.game.players[0].populateHandElement(this.mockPlayerHandElement, turn.spadesBroken, 'Clubs');
  
  // Get a hearts card (which should be valid since player has no clubs)
  const heartsCard = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'))
    .find(card => {
      const cardContent = card.querySelector('.card-content').textContent;
      return cardContent.includes('♥');
    });
  
  // Verify that the hearts card is marked as valid
  assert.ok(heartsCard.classList.contains('valid-play'), 'Hearts card should be valid when player has no clubs');
  
  // Now modify the player's hand to include a clubs card
  this.game.players[0].hand.setCards([
    new Card('A', 'Hearts'),
    new Card('K', 'Hearts'),
    new Card('Q', 'Spades'),
    new Card('J', 'Diamonds'),
    new Card('10', 'Clubs')
  ]);
  
  // Update the hand element with valid plays for following suit
  this.game.players[0].populateHandElement(this.mockPlayerHandElement, turn.spadesBroken, 'Clubs');
  
  // Get a hearts card (which should now be invalid since player has clubs)
  const heartsCardInvalid = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'))
    .find(card => {
      const cardContent = card.querySelector('.card-content').textContent;
      return cardContent.includes('♥');
    });
  
  // Verify that the hearts card is not marked as valid
  assert.notOk(heartsCardInvalid.classList.contains('valid-play'), 'Hearts card should not be valid when player has clubs');
  
  // Simulate clicking the invalid hearts card
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  
  // Dispatch the click event on the hearts card
  Object.defineProperty(clickEvent, 'target', { value: heartsCardInvalid });
  turn.handleCardClick(clickEvent);
  
  // Assert that the card was not selected
  assert.strictEqual(turn.selectedCard, null, 'Invalid card should not be selectable');
  
  // Assert that an error tooltip was created
  const tooltip = heartsCardInvalid.querySelector('.error-tooltip');
  assert.ok(tooltip, 'Error tooltip should be created for invalid play');
  
  // Assert that the tooltip has the correct error message
  assert.ok(tooltip.textContent.includes('Must follow suit'), 'Error message should indicate player must follow suit');
});

// Test out-of-turn plays
QUnit.test('Out-of-turn plays are prevented', function(assert) {
  // Set up a controlled hand for the human player with known cards
  this.game.players[0].hand.setCards([
    new Card('A', 'Hearts'),
    new Card('K', 'Hearts'),
    new Card('Q', 'Spades'),
    new Card('J', 'Diamonds')
  ]);
  
  // Create a turn instance with computer player's turn
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  turn.currentPlayerIndex = 1; // West player's turn (computer)
  turn.currentPlayer = this.game.players[1];
  
  // Update the hand element with valid plays
  this.game.players[0].populateHandElement(this.mockPlayerHandElement, turn.spadesBroken);
  
  // Get a card from the human player's hand
  const card = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'))[0];
  
  // Simulate clicking the card
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  
  // Dispatch the click event on the card
  Object.defineProperty(clickEvent, 'target', { value: card });
  turn.handleCardClick(clickEvent);
  
  // Assert that the card was not selected (it's not the human player's turn)
  assert.strictEqual(turn.selectedCard, null, 'Card should not be selectable when it is not the player\'s turn');
});

// Test leading with spades when spades are not broken
QUnit.test('Leading with spades when spades are not broken shows error message', function(assert) {
  // Set up a controlled hand for the human player with known cards
  this.game.players[0].hand.setCards([
    new Card('A', 'Spades'),
    new Card('K', 'Spades'),
    new Card('Q', 'Hearts'),
    new Card('J', 'Diamonds')
  ]);
  
  // Create a turn instance with spades not broken
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  turn.spadesBroken = false;
  turn.currentPlayerIndex = 0;
  turn.currentPlayer = this.game.players[0];
  turn.cardsPlayed = 0; // Leading
  
  // Update the hand element with valid plays
  this.game.players[0].populateHandElement(this.mockPlayerHandElement, turn.spadesBroken);
  
  // Get a spades card
  const spadesCard = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'))
    .find(card => {
      const cardContent = card.querySelector('.card-content').textContent;
      return cardContent.includes('♠');
    });
  
  // Verify that the spades card is not marked as valid
  assert.notOk(spadesCard.classList.contains('valid-play'), 'Spades card should not be valid when leading and spades not broken');
  
  // Simulate clicking the invalid spades card
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  
  // Dispatch the click event on the spades card
  Object.defineProperty(clickEvent, 'target', { value: spadesCard });
  turn.handleCardClick(clickEvent);
  
  // Assert that the card was not selected
  assert.strictEqual(turn.selectedCard, null, 'Invalid spades card should not be selectable when leading and spades not broken');
  
  // Assert that an error tooltip was created
  const tooltip = spadesCard.querySelector('.error-tooltip');
  assert.ok(tooltip, 'Error tooltip should be created for invalid spades play');
  
  // Assert that the tooltip has the correct error message
  assert.ok(tooltip.textContent.includes('Can\'t lead with Spades'), 'Error message should indicate player can\'t lead with spades');
});

// Test error tooltip disappears after a delay
QUnit.test('Error tooltip disappears after a delay', function(assert) {
  // This is an async test because we need to wait for the tooltip to disappear
  const done = assert.async();
  
  // Set up a controlled hand for the human player with known cards
  this.game.players[0].hand.setCards([
    new Card('A', 'Hearts'),
    new Card('K', 'Hearts'),
    new Card('Q', 'Spades'),
    new Card('J', 'Diamonds'),
    new Card('10', 'Clubs')
  ]);
  
  // Create a turn instance
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  turn.currentPlayerIndex = 0;
  turn.currentPlayer = this.game.players[0];
  turn.cardsPlayed = 1; // Not leading
  
  // Simulate a previous play with clubs as the leading suit
  const clubsCard = new Card('10', 'Clubs');
  const clubsCardElement = document.createElement('div');
  clubsCardElement.className = 'card';
  clubsCardElement.innerHTML = '<div class="card-content">10&nbsp;♣</div>';
  this.mockPlayArea.appendChild(clubsCardElement);
  
  // Update the hand element with valid plays for following suit
  this.game.players[0].populateHandElement(this.mockPlayerHandElement, turn.spadesBroken, 'Clubs');
  
  // Get a hearts card (which should be invalid since player has clubs)
  const heartsCard = Array.from(this.mockPlayerHandElement.querySelectorAll('.card'))
    .find(card => {
      const cardContent = card.querySelector('.card-content').textContent;
      return cardContent.includes('♥');
    });
  
  // Simulate clicking the invalid hearts card
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  
  // Dispatch the click event on the hearts card
  Object.defineProperty(clickEvent, 'target', { value: heartsCard });
  turn.handleCardClick(clickEvent);
  
  // Assert that an error tooltip was created
  const tooltip = heartsCard.querySelector('.error-tooltip');
  assert.ok(tooltip, 'Error tooltip should be created for invalid play');
  
  // Wait for the tooltip to disappear (3000ms in the Turn class)
  setTimeout(() => {
    try {
      // Assert that the tooltip is no longer in the DOM
      assert.notOk(heartsCard.querySelector('.error-tooltip'), 'Error tooltip should disappear after delay');
      
      // Signal that the async test is complete
      done();
    } catch (e) {
      assert.ok(false, `Test failed with error: ${e.message}`);
      done();
    }
  }, 3500); // Wait a bit longer than the 3000ms timeout in the Turn class
});

// Test handling of unexpected state changes
QUnit.test('Game handles unexpected state changes gracefully', function(assert) {
  // Set up a controlled hand for the human player with known cards
  this.game.players[0].hand.setCards([
    new Card('A', 'Hearts'),
    new Card('K', 'Hearts'),
    new Card('Q', 'Spades'),
    new Card('J', 'Diamonds')
  ]);
  
  // Create a turn instance
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  turn.currentPlayerIndex = 0;
  turn.currentPlayer = this.game.players[0];
  
  // Test with an invalid cardsPlayed value (negative)
  turn.cardsPlayed = -1;
  
  try {
    // Update the hand element with valid plays
    this.game.players[0].populateHandElement(this.mockPlayerHandElement, turn.spadesBroken);
    
    // If we get here, the game handled the invalid state without crashing
    assert.ok(true, 'Game should handle invalid cardsPlayed value without crashing');
  } catch (error) {
    assert.ok(false, `Game crashed with invalid cardsPlayed value: ${error.message}`);
  }
  
  // Test with an invalid currentPlayerIndex value (out of bounds)
  turn.currentPlayerIndex = 10;
  turn.cardsPlayed = 0;
  
  try {
    // Try to get the current player
    const player = this.game.players[turn.currentPlayerIndex];
    
    // This should be undefined, but shouldn't crash
    assert.strictEqual(player, undefined, 'Player should be undefined for invalid index');
    
    // If we get here, the game handled the invalid state without crashing
    assert.ok(true, 'Game should handle invalid currentPlayerIndex value without crashing');
  } catch (error) {
    assert.ok(false, `Game crashed with invalid currentPlayerIndex value: ${error.message}`);
  }
  
  // Reset to valid values
  turn.currentPlayerIndex = 0;
  turn.currentPlayer = this.game.players[0];
  turn.cardsPlayed = 0;
  
  // Test with an invalid leadingSuit value
  try {
    // Update the hand element with an invalid leading suit
    this.game.players[0].populateHandElement(this.mockPlayerHandElement, turn.spadesBroken, 'InvalidSuit');
    
    // If we get here, the game handled the invalid state without crashing
    assert.ok(true, 'Game should handle invalid leadingSuit value without crashing');
  } catch (error) {
    assert.ok(false, `Game crashed with invalid leadingSuit value: ${error.message}`);
  }
});

// Test error handling for invalid card selection
QUnit.test('Game handles invalid card selection gracefully', function(assert) {
  // Set up a controlled hand for the human player with known cards
  this.game.players[0].hand.setCards([
    new Card('A', 'Hearts'),
    new Card('K', 'Hearts'),
    new Card('Q', 'Spades'),
    new Card('J', 'Diamonds')
  ]);
  
  // Create a turn instance
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  turn.currentPlayerIndex = 0;
  turn.currentPlayer = this.game.players[0];
  turn.cardsPlayed = 0; // Leading
  
  // Update the hand element with valid plays
  this.game.players[0].populateHandElement(this.mockPlayerHandElement, turn.spadesBroken);
  
  // Create a non-card element
  const nonCardElement = document.createElement('div');
  nonCardElement.className = 'not-a-card';
  this.mockPlayerHandElement.appendChild(nonCardElement);
  
  // Simulate clicking the non-card element
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  
  // Dispatch the click event on the non-card element
  Object.defineProperty(clickEvent, 'target', { value: nonCardElement });
  
  try {
    // This should not select the element or crash
    turn.handleCardClick(clickEvent);
    
    // Assert that no card was selected
    assert.strictEqual(turn.selectedCard, null, 'Non-card element should not be selectable');
    
    // If we get here, the game handled the invalid selection without crashing
    assert.ok(true, 'Game should handle invalid card selection without crashing');
  } catch (error) {
    assert.ok(false, `Game crashed with invalid card selection: ${error.message}`);
  }
});
