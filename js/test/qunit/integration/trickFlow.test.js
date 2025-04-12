// QUnit integration test for trick flow
import { Game } from '../../../game.js';
import { Turn } from '../../../turn.js';
import { Card } from '../../../card.js';

// Define a QUnit module for integration tests
QUnit.module('Integration - Trick Flow', {
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
    
    // Create mock book elements
    this.team1BooksElement = document.createElement('div');
    this.team1BooksElement.className = 'team1-books';
    this.team1BooksElement.textContent = 'Our Books: 0 / Bid: 0';
    this.fixture.appendChild(this.team1BooksElement);
    
    this.team2BooksElement = document.createElement('div');
    this.team2BooksElement.className = 'team2-books';
    this.team2BooksElement.textContent = 'Their Books: 0 / Bid: 0';
    this.fixture.appendChild(this.team2BooksElement);
    
    // Create a new game
    this.game = new Game();
    
    // Set up known hands for testing
    this.game.players[0].hand.setCards([
      new Card('A', 'Hearts'), 
      new Card('K', 'Hearts'),
      new Card('Q', 'Spades'),
      new Card('J', 'Diamonds')
    ]);
    
    this.game.players[1].hand.setCards([
      new Card('K', 'Diamonds'), 
      new Card('Q', 'Hearts'),
      new Card('J', 'Spades'),
      new Card('10', 'Clubs')
    ]);
    
    this.game.players[2].hand.setCards([
      new Card('Q', 'Diamonds'), 
      new Card('J', 'Hearts'),
      new Card('10', 'Spades'),
      new Card('9', 'Clubs')
    ]);
    
    this.game.players[3].hand.setCards([
      new Card('J', 'Diamonds'), 
      new Card('10', 'Hearts'),
      new Card('9', 'Spades'),
      new Card('8', 'Clubs')
    ]);
  }
});

// Test rule enforcement for leading with Spades
QUnit.test('Complete trick flow with rule enforcement', function(assert) {
  // Create a custom Turn class for testing that doesn't auto-play computer cards
  class TestTurn extends Turn {
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
  }
  
  // Create a TestTurn instance with the game players
  const turn = new TestTurn(this.game.players, this.mockPlayerHandElement);
  
  // Set the current player to the human player (index 0)
  turn.currentPlayerIndex = 0;
  turn.currentPlayer = this.game.players[0];
  turn.cardNotPlayed = true;
  turn.spadesBroken = false; // Spades not broken yet
  
  // Create a mock card element for the Spades card (which should be invalid as a lead)
  const mockSpadesCard = document.createElement('div');
  mockSpadesCard.className = 'card';
  mockSpadesCard.innerHTML = '<div class="card-content">Q&nbsp;♠</div>';
  
  // Add the card to the player hand element (needed for DOM operations)
  this.mockPlayerHandElement.appendChild(mockSpadesCard);
  
  // Simulate clicking the Spades card
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  
  // Dispatch the click event on the Spades card
  Object.defineProperty(clickEvent, 'target', { value: mockSpadesCard });
  turn.handleCardClick(clickEvent);
  
  // Assert that the Spades card was not selected (invalid play)
  assert.strictEqual(turn.selectedCard, null, 'Spades card should not be selectable when Spades are not broken');
  
  // Create a mock card element for the Hearts card (which should be valid as a lead)
  const mockHeartsCard = document.createElement('div');
  mockHeartsCard.className = 'card valid-play';
  mockHeartsCard.innerHTML = '<div class="card-content">A&nbsp;♥</div>';
  
  // Add the card to the player hand element (needed for DOM operations)
  this.mockPlayerHandElement.appendChild(mockHeartsCard);
  
  // Simulate clicking the Hearts card
  const clickEvent2 = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  
  // Dispatch the click event on the Hearts card
  Object.defineProperty(clickEvent2, 'target', { value: mockHeartsCard });
  turn.handleCardClick(clickEvent2);
  
  // Assert that the Hearts card was selected (valid play)
  assert.strictEqual(turn.selectedCard, mockHeartsCard, 'Hearts card should be selectable when Spades are not broken');
  
  // Simulate playing the Hearts card
  const clickEvent3 = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  
  // Dispatch the click event on the Hearts card again to play it
  Object.defineProperty(clickEvent3, 'target', { value: mockHeartsCard });
  turn.handleCardClick(clickEvent3);
  
  // Assert that the card was played
  assert.strictEqual(turn.cardsPlayed, 1, 'Card should be played after second click');
  assert.strictEqual(turn.cardNotPlayed, false, 'cardNotPlayed should be false after playing a card');
  
  // Reset the turn state for the next test
  turn.cardsPlayed = 0;
});

// Test winning card determination and animation
QUnit.test('Winning card determination and animation', function(assert) {
  // This is an async test because we need to wait for animations
  const done = assert.async();
  
  // Create a custom Turn class for testing that doesn't auto-play computer cards
  class TestTurn extends Turn {
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
  }
  
  // Create a TestTurn instance with the game players
  const turn = new TestTurn(this.game.players, this.mockPlayerHandElement);
  
  // Manually set up a trick with known cards
  const heartsA = new Card('A', 'Hearts');
  const heartsK = new Card('K', 'Hearts');
  const heartsQ = new Card('Q', 'Hearts');
  const heartsJ = new Card('J', 'Hearts');
  
  // Set player names for testing
  this.game.players[0].name = 'South';
  this.game.players[1].name = 'West';
  this.game.players[2].name = 'North';
  this.game.players[3].name = 'East';
  
  // Set player teams for testing
  this.game.players[0].team = 1; // South is on team 1
  this.game.players[1].team = 2; // West is on team 2
  this.game.players[2].team = 2; // North is on team 2
  this.game.players[3].team = 1; // East is on team 1
  
  // Create card elements in the play area
  const player0Card = document.createElement('div');
  player0Card.className = 'card south'; // Match player name in lowercase
  player0Card.innerHTML = '<div class="card-content">A&nbsp;♥</div>';
  this.mockPlayArea.appendChild(player0Card);
  
  const player1Card = document.createElement('div');
  player1Card.className = 'card west'; // Match player name in lowercase
  player1Card.innerHTML = '<div class="card-content">K&nbsp;♥</div>';
  this.mockPlayArea.appendChild(player1Card);
  
  const player2Card = document.createElement('div');
  player2Card.className = 'card north'; // Match player name in lowercase
  player2Card.innerHTML = '<div class="card-content">Q&nbsp;♥</div>';
  this.mockPlayArea.appendChild(player2Card);
  
  const player3Card = document.createElement('div');
  player3Card.className = 'card east'; // Match player name in lowercase
  player3Card.innerHTML = '<div class="card-content">J&nbsp;♥</div>';
  this.mockPlayArea.appendChild(player3Card);
  
  // Set up the playerForPlayedCardMap
  turn.playerForPlayedCardMap.set(heartsA, this.game.players[0]);
  turn.playerForPlayedCardMap.set(heartsK, this.game.players[1]);
  turn.playerForPlayedCardMap.set(heartsQ, this.game.players[2]);
  turn.playerForPlayedCardMap.set(heartsJ, this.game.players[3]);
  
  // Set cardsPlayed to 4 to trigger trick completion
  turn.cardsPlayed = 4;
  
  // Call playNextTurn to process the trick
  turn.playNextTurn();
  
  // Wait for the animation to be applied
  setTimeout(() => {
    try {
      // Assert that the winning card (Ace of Hearts) gets the animation class
      assert.ok(player0Card.classList.contains('winning-card-animation'), 
               'Winning card should have the winning-card-animation class');
      
      // Assert that the books count was updated for team 1
      const team1Books = parseInt(this.team1BooksElement.textContent.split(':')[1].trim());
      assert.equal(team1Books, 1, 'Team 1 books should be incremented');
      
      // Signal that the async test is complete
      done();
    } catch (e) {
      assert.ok(false, `Test failed with error: ${e.message}`);
      done();
    }
  }, 500); // Longer timeout for animation to be applied
});
