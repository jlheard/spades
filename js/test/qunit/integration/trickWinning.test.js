// QUnit integration test for trick winning logic
import { Game } from '../../../game.js';
import { Turn } from '../../../turn.js';
import { Card } from '../../../card.js';
import { compareCardsForTurn } from '../../../cardComparer.js';

// Define a QUnit module for trick winning logic tests
QUnit.module('Integration - Trick Winning Logic', {
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

// Test winning with highest card of led suit
QUnit.test('Highest card of led suit wins when no spades are played', function(assert) {
  // Create a Turn instance with the game players
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  
  // Create cards for the trick
  const heartsA = new Card('A', 'Hearts');
  const hearts10 = new Card('10', 'Hearts');
  const hearts5 = new Card('5', 'Hearts');
  const hearts2 = new Card('2', 'Hearts');
  
  // Create a map of cards to players
  const playerForPlayedCardMap = new Map();
  playerForPlayedCardMap.set(heartsA, this.game.players[0]); // South
  playerForPlayedCardMap.set(hearts10, this.game.players[1]); // West
  playerForPlayedCardMap.set(hearts5, this.game.players[2]); // North
  playerForPlayedCardMap.set(hearts2, this.game.players[3]); // East
  
  // Determine the winning card
  const winningCard = compareCardsForTurn(playerForPlayedCardMap);
  
  // Assert that the Ace of Hearts wins
  assert.strictEqual(winningCard, heartsA, 'Ace of Hearts should win when all cards are Hearts');
  
  // Assert that the winning player is South
  const winningPlayer = playerForPlayedCardMap.get(winningCard);
  assert.strictEqual(winningPlayer, this.game.players[0], 'South should win the trick');
});

// Test winning with spades when led suit is not spades
QUnit.test('Highest spade wins when led suit is not spades', function(assert) {
  // Create a Turn instance with the game players
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  
  // Create cards for the trick
  const heartsA = new Card('A', 'Hearts');
  const spades2 = new Card('2', 'Spades');
  const hearts5 = new Card('5', 'Hearts');
  const hearts2 = new Card('2', 'Hearts');
  
  // Create a map of cards to players
  const playerForPlayedCardMap = new Map();
  playerForPlayedCardMap.set(heartsA, this.game.players[0]); // South
  playerForPlayedCardMap.set(spades2, this.game.players[1]); // West
  playerForPlayedCardMap.set(hearts5, this.game.players[2]); // North
  playerForPlayedCardMap.set(hearts2, this.game.players[3]); // East
  
  // Determine the winning card
  const winningCard = compareCardsForTurn(playerForPlayedCardMap);
  
  // Assert that the 2 of Spades wins
  assert.strictEqual(winningCard, spades2, '2 of Spades should win when led suit is Hearts');
  
  // Assert that the winning player is West
  const winningPlayer = playerForPlayedCardMap.get(winningCard);
  assert.strictEqual(winningPlayer, this.game.players[1], 'West should win the trick');
});

// Test multiple spades played in the same trick
QUnit.test('Highest spade wins when multiple spades are played', function(assert) {
  // Create a Turn instance with the game players
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  
  // Create cards for the trick
  const heartsA = new Card('A', 'Hearts');
  const spadesA = new Card('A', 'Spades');
  const spades5 = new Card('5', 'Spades');
  const spades10 = new Card('10', 'Spades');
  
  // Create a map of cards to players
  const playerForPlayedCardMap = new Map();
  playerForPlayedCardMap.set(heartsA, this.game.players[0]); // South
  playerForPlayedCardMap.set(spades5, this.game.players[1]); // West
  playerForPlayedCardMap.set(spadesA, this.game.players[2]); // North
  playerForPlayedCardMap.set(spades10, this.game.players[3]); // East
  
  // Determine the winning card
  const winningCard = compareCardsForTurn(playerForPlayedCardMap);
  
  // Assert that the Ace of Spades wins
  assert.strictEqual(winningCard, spadesA, 'Ace of Spades should win when multiple spades are played');
  
  // Assert that the winning player is North
  const winningPlayer = playerForPlayedCardMap.get(winningCard);
  assert.strictEqual(winningPlayer, this.game.players[2], 'North should win the trick');
});

// Test winning with jokers
QUnit.test('Jokers win over all other cards', function(assert) {
  // Create a Turn instance with the game players
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  
  // Create cards for the trick
  const heartsA = new Card('A', 'Hearts');
  const spadesA = new Card('A', 'Spades');
  const bigJoker = new Card('BigJoker', 'Spades');
  const littleJoker = new Card('ExtraJoker', 'Spades');
  
  // Create a map of cards to players
  const playerForPlayedCardMap = new Map();
  playerForPlayedCardMap.set(heartsA, this.game.players[0]); // South
  playerForPlayedCardMap.set(spadesA, this.game.players[1]); // West
  playerForPlayedCardMap.set(littleJoker, this.game.players[2]); // North
  playerForPlayedCardMap.set(bigJoker, this.game.players[3]); // East
  
  // Determine the winning card
  const winningCard = compareCardsForTurn(playerForPlayedCardMap);
  
  // Assert that the Big Joker wins
  assert.strictEqual(winningCard, bigJoker, 'Big Joker should win over all other cards');
  
  // Assert that the winning player is East
  const winningPlayer = playerForPlayedCardMap.get(winningCard);
  assert.strictEqual(winningPlayer, this.game.players[3], 'East should win the trick');
});

// Test that Big Joker beats Little Joker
QUnit.test('Big Joker beats Little Joker', function(assert) {
  // Create a Turn instance with the game players
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  
  // Create cards for the trick
  const heartsA = new Card('A', 'Hearts');
  const spadesA = new Card('A', 'Spades');
  const bigJoker = new Card('BigJoker', 'Spades');
  const littleJoker = new Card('ExtraJoker', 'Spades');
  
  // Create a map of cards to players
  const playerForPlayedCardMap = new Map();
  playerForPlayedCardMap.set(heartsA, this.game.players[0]); // South
  playerForPlayedCardMap.set(spadesA, this.game.players[1]); // West
  playerForPlayedCardMap.set(bigJoker, this.game.players[2]); // North
  playerForPlayedCardMap.set(littleJoker, this.game.players[3]); // East
  
  // Determine the winning card
  const winningCard = compareCardsForTurn(playerForPlayedCardMap);
  
  // Assert that the Big Joker wins
  assert.strictEqual(winningCard, bigJoker, 'Big Joker should beat Little Joker');
  
  // Assert that the winning player is North
  const winningPlayer = playerForPlayedCardMap.get(winningCard);
  assert.strictEqual(winningPlayer, this.game.players[2], 'North should win the trick');
});

// Test that Little Joker beats all non-joker cards
QUnit.test('Little Joker beats all non-joker cards', function(assert) {
  // Create a Turn instance with the game players
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  
  // Create cards for the trick
  const heartsA = new Card('A', 'Hearts');
  const spadesA = new Card('A', 'Spades');
  const spades10 = new Card('10', 'Spades');
  const littleJoker = new Card('ExtraJoker', 'Spades');
  
  // Create a map of cards to players
  const playerForPlayedCardMap = new Map();
  playerForPlayedCardMap.set(heartsA, this.game.players[0]); // South
  playerForPlayedCardMap.set(spadesA, this.game.players[1]); // West
  playerForPlayedCardMap.set(spades10, this.game.players[2]); // North
  playerForPlayedCardMap.set(littleJoker, this.game.players[3]); // East
  
  // Determine the winning card
  const winningCard = compareCardsForTurn(playerForPlayedCardMap);
  
  // Assert that the Little Joker wins
  assert.strictEqual(winningCard, littleJoker, 'Little Joker should beat all non-joker cards');
  
  // Assert that the winning player is East
  const winningPlayer = playerForPlayedCardMap.get(winningCard);
  assert.strictEqual(winningPlayer, this.game.players[3], 'East should win the trick');
});

// Test edge case: all players play the same suit
QUnit.test('Highest card wins when all players play the same suit', function(assert) {
  // Create a Turn instance with the game players
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  
  // Create cards for the trick (all diamonds)
  const diamondsA = new Card('A', 'Diamonds');
  const diamondsK = new Card('K', 'Diamonds');
  const diamondsQ = new Card('Q', 'Diamonds');
  const diamondsJ = new Card('J', 'Diamonds');
  
  // Create a map of cards to players
  const playerForPlayedCardMap = new Map();
  playerForPlayedCardMap.set(diamondsK, this.game.players[0]); // South
  playerForPlayedCardMap.set(diamondsQ, this.game.players[1]); // West
  playerForPlayedCardMap.set(diamondsJ, this.game.players[2]); // North
  playerForPlayedCardMap.set(diamondsA, this.game.players[3]); // East
  
  // Determine the winning card
  const winningCard = compareCardsForTurn(playerForPlayedCardMap);
  
  // Assert that the Ace of Diamonds wins
  assert.strictEqual(winningCard, diamondsA, 'Ace of Diamonds should win when all cards are Diamonds');
  
  // Assert that the winning player is East
  const winningPlayer = playerForPlayedCardMap.get(winningCard);
  assert.strictEqual(winningPlayer, this.game.players[3], 'East should win the trick');
});

// Test that the UI correctly updates when a trick is won
QUnit.test('UI updates correctly when a trick is won', function(assert) {
  // This is an async test because we need to wait for animations
  const done = assert.async();
  
  // Create a Turn instance with the game players
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  
  // Set player teams for testing
  this.game.players[0].team = 1; // South is on team 1
  this.game.players[1].team = 2; // West is on team 2
  this.game.players[2].team = 1; // North is on team 1
  this.game.players[3].team = 2; // East is on team 2
  
  // Create cards for the trick
  const heartsA = new Card('A', 'Hearts');
  const hearts10 = new Card('10', 'Hearts');
  const hearts5 = new Card('5', 'Hearts');
  const hearts2 = new Card('2', 'Hearts');
  
  // Create card elements in the play area
  const player0Card = document.createElement('div');
  player0Card.className = 'card south';
  player0Card.innerHTML = '<div class="card-content">A&nbsp;♥</div>';
  this.mockPlayArea.appendChild(player0Card);
  
  const player1Card = document.createElement('div');
  player1Card.className = 'card west';
  player1Card.innerHTML = '<div class="card-content">10&nbsp;♥</div>';
  this.mockPlayArea.appendChild(player1Card);
  
  const player2Card = document.createElement('div');
  player2Card.className = 'card north';
  player2Card.innerHTML = '<div class="card-content">5&nbsp;♥</div>';
  this.mockPlayArea.appendChild(player2Card);
  
  const player3Card = document.createElement('div');
  player3Card.className = 'card east';
  player3Card.innerHTML = '<div class="card-content">2&nbsp;♥</div>';
  this.mockPlayArea.appendChild(player3Card);
  
  // Set up the playerForPlayedCardMap
  turn.playerForPlayedCardMap.set(heartsA, this.game.players[0]);
  turn.playerForPlayedCardMap.set(hearts10, this.game.players[1]);
  turn.playerForPlayedCardMap.set(hearts5, this.game.players[2]);
  turn.playerForPlayedCardMap.set(hearts2, this.game.players[3]);
  
  // Set cardsPlayed to 4 to trigger trick completion
  turn.cardsPlayed = 4;
  
  // Call playNextTurn to process the trick
  turn.playNextTurn();
  
  // Wait for the animation to be applied
  setTimeout(() => {
    try {
      // Assert that the winning card (Ace of Hearts) gets the animation class
      assert.ok(player0Card.classList.contains('winning-card-animation') || 
                player0Card.getAttribute('data-winning-card') === 'true', 
               'Winning card should have the winning-card-animation class or data-winning-card attribute');
      
      // Assert that the books count was updated for team 1
      const team1Books = parseInt(this.team1BooksElement.textContent.split(':')[1].trim());
      assert.equal(team1Books, 1, 'Team 1 books should be incremented');
      
      // Assert that team 2 books remain at 0
      const team2Books = parseInt(this.team2BooksElement.textContent.split(':')[1].trim());
      assert.equal(team2Books, 0, 'Team 2 books should remain at 0');
      
      // Signal that the async test is complete
      done();
    } catch (e) {
      assert.ok(false, `Test failed with error: ${e.message}`);
      done();
    }
  }, 2500); // Further increased timeout to wait for animation to be applied
});

// Test that the next player to lead is the winner of the trick
QUnit.test('Winner of the trick leads the next trick', function(assert) {
  // This is an async test because we need to wait for animations
  const done = assert.async();
  
  // Create a Turn instance with the game players
  const turn = new this.TestTurn(this.game.players, this.mockPlayerHandElement);
  
  // Create cards for the trick
  const heartsA = new Card('A', 'Hearts');
  const hearts10 = new Card('10', 'Hearts');
  const hearts5 = new Card('5', 'Hearts');
  const hearts2 = new Card('2', 'Hearts');
  
  // Create card elements in the play area
  const player0Card = document.createElement('div');
  player0Card.className = 'card south';
  player0Card.innerHTML = '<div class="card-content">A&nbsp;♥</div>';
  this.mockPlayArea.appendChild(player0Card);
  
  const player1Card = document.createElement('div');
  player1Card.className = 'card west';
  player1Card.innerHTML = '<div class="card-content">10&nbsp;♥</div>';
  this.mockPlayArea.appendChild(player1Card);
  
  const player2Card = document.createElement('div');
  player2Card.className = 'card north';
  player2Card.innerHTML = '<div class="card-content">5&nbsp;♥</div>';
  this.mockPlayArea.appendChild(player2Card);
  
  const player3Card = document.createElement('div');
  player3Card.className = 'card east';
  player3Card.innerHTML = '<div class="card-content">2&nbsp;♥</div>';
  this.mockPlayArea.appendChild(player3Card);
  
  // Set up the playerForPlayedCardMap
  turn.playerForPlayedCardMap.set(heartsA, this.game.players[0]);
  turn.playerForPlayedCardMap.set(hearts10, this.game.players[1]);
  turn.playerForPlayedCardMap.set(hearts5, this.game.players[2]);
  turn.playerForPlayedCardMap.set(hearts2, this.game.players[3]);
  
  // Set cardsPlayed to 4 to trigger trick completion
  turn.cardsPlayed = 4;
  
  // Override the playCard method to capture the next player
  let nextPlayer = null;
  turn.playCard = function() {
    nextPlayer = this.currentPlayer;
  };
  
  // Call playNextTurn to process the trick
  turn.playNextTurn();
  
  // Wait for the trick to be processed
  setTimeout(() => {
    try {
      // Assert that the next player to lead is the winner of the trick (South)
      assert.strictEqual(nextPlayer, this.game.players[0], 'South should lead the next trick');
      
      // Signal that the async test is complete
      done();
    } catch (e) {
      assert.ok(false, `Test failed with error: ${e.message}`);
      done();
    }
  }, 5000); // Increased timeout to wait for trick processing and animations
});
