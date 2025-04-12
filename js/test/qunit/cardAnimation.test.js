// QUnit test file for card animations
import { Turn } from '../../turn.js';
import { Card } from '../../card.js';
import { Player } from '../../player.js';

// Define a QUnit module for card animation tests
QUnit.module('Card Animation Tests', {
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
    
    // Create players for testing
    this.players = [
      new Player('South', false),
      new Player('West', true),
      new Player('North', true),
      new Player('East', true)
    ];
    
    // Set player teams
    this.players[0].setTeam(1); // South is on team 1
    this.players[1].setTeam(2); // West is on team 2
    this.players[2].setTeam(2); // North is on team 2
    this.players[3].setTeam(1); // East is on team 1
    
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

// Test that card content remains visible during winning animation
QUnit.test('Card content remains visible during winning animation', function(assert) {
  // This is an async test because we need to wait for animations
  const done = assert.async();
  
  // Create a Turn instance with the game players
  const turn = new this.TestTurn(this.players, this.mockPlayerHandElement);
  
  // Manually set up a trick with known cards
  const heartsA = new Card('A', 'Hearts');
  const heartsK = new Card('K', 'Hearts');
  const heartsQ = new Card('Q', 'Hearts');
  const heartsJ = new Card('J', 'Hearts');
  
  // Create card elements in the play area
  const player0Card = document.createElement('div');
  player0Card.className = 'card south';
  player0Card.innerHTML = '<div class="card-content">A&nbsp;♥</div>';
  this.mockPlayArea.appendChild(player0Card);
  
  const player1Card = document.createElement('div');
  player1Card.className = 'card west';
  player1Card.innerHTML = '<div class="card-content">K&nbsp;♥</div>';
  this.mockPlayArea.appendChild(player1Card);
  
  const player2Card = document.createElement('div');
  player2Card.className = 'card north';
  player2Card.innerHTML = '<div class="card-content">Q&nbsp;♥</div>';
  this.mockPlayArea.appendChild(player2Card);
  
  const player3Card = document.createElement('div');
  player3Card.className = 'card east';
  player3Card.innerHTML = '<div class="card-content">J&nbsp;♥</div>';
  this.mockPlayArea.appendChild(player3Card);
  
  // Set up the playerForPlayedCardMap
  turn.playerForPlayedCardMap.set(heartsA, this.players[0]);
  turn.playerForPlayedCardMap.set(heartsK, this.players[1]);
  turn.playerForPlayedCardMap.set(heartsQ, this.players[2]);
  turn.playerForPlayedCardMap.set(heartsJ, this.players[3]);
  
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
      
      // Assert that the card content is still visible
      const cardContent = player0Card.querySelector('.card-content');
      assert.ok(cardContent, 'Card content element should exist');
      
      // The textContent might have non-breaking spaces, so we need to normalize it
      const normalizedText = cardContent.textContent.replace(/\s+/g, ' ').trim();
      assert.equal(normalizedText, 'A ♥', 'Card content should display the correct value');
      
      // Assert that the card content is visible (not hidden by CSS)
      const cardContentStyle = window.getComputedStyle(cardContent);
      assert.notEqual(cardContentStyle.display, 'none', 'Card content should not be hidden');
      assert.notEqual(cardContentStyle.visibility, 'hidden', 'Card content should be visible');
      
      // Signal that the async test is complete
      done();
    } catch (e) {
      assert.ok(false, `Test failed with error: ${e.message}`);
      done();
    }
  }, 500); // Wait for animation to be applied
});

// Test that winning card is properly highlighted
QUnit.test('Winning card is properly highlighted with animation', function(assert) {
  // This is an async test because we need to wait for animations
  const done = assert.async();
  
  // Create a Turn instance with the game players
  const turn = new this.TestTurn(this.players, this.mockPlayerHandElement);
  
  // Manually set up a trick with known cards
  const heartsA = new Card('A', 'Hearts');
  const heartsK = new Card('K', 'Hearts');
  const heartsQ = new Card('Q', 'Hearts');
  const heartsJ = new Card('J', 'Hearts');
  
  // Create card elements in the play area
  const player0Card = document.createElement('div');
  player0Card.className = 'card south';
  player0Card.innerHTML = '<div class="card-content">A&nbsp;♥</div>';
  this.mockPlayArea.appendChild(player0Card);
  
  const player1Card = document.createElement('div');
  player1Card.className = 'card west';
  player1Card.innerHTML = '<div class="card-content">K&nbsp;♥</div>';
  this.mockPlayArea.appendChild(player1Card);
  
  const player2Card = document.createElement('div');
  player2Card.className = 'card north';
  player2Card.innerHTML = '<div class="card-content">Q&nbsp;♥</div>';
  this.mockPlayArea.appendChild(player2Card);
  
  const player3Card = document.createElement('div');
  player3Card.className = 'card east';
  player3Card.innerHTML = '<div class="card-content">J&nbsp;♥</div>';
  this.mockPlayArea.appendChild(player3Card);
  
  // Set up the playerForPlayedCardMap
  turn.playerForPlayedCardMap.set(heartsA, this.players[0]);
  turn.playerForPlayedCardMap.set(heartsK, this.players[1]);
  turn.playerForPlayedCardMap.set(heartsQ, this.players[2]);
  turn.playerForPlayedCardMap.set(heartsJ, this.players[3]);
  
  // Set cardsPlayed to 4 to trigger trick completion
  turn.cardsPlayed = 4;
  
  // Call playNextTurn to process the trick
  turn.playNextTurn();
  
  // Wait for the animation to be applied
  setTimeout(() => {
    try {
      // Assert that only the winning card gets the animation class
      assert.ok(player0Card.classList.contains('winning-card-animation'), 
               'Winning card should have the winning-card-animation class');
      assert.notOk(player1Card.classList.contains('winning-card-animation'), 
                  'Non-winning cards should not have the winning-card-animation class');
      assert.notOk(player2Card.classList.contains('winning-card-animation'), 
                  'Non-winning cards should not have the winning-card-animation class');
      assert.notOk(player3Card.classList.contains('winning-card-animation'), 
                  'Non-winning cards should not have the winning-card-animation class');
      
      // Assert that the books count was updated for team 1
      const team1Books = parseInt(this.team1BooksElement.textContent.split(':')[1].trim());
      assert.equal(team1Books, 1, 'Team 1 books should be incremented');
      
      // Signal that the async test is complete
      done();
    } catch (e) {
      assert.ok(false, `Test failed with error: ${e.message}`);
      done();
    }
  }, 500); // Wait for animation to be applied
});

// Test that animation works for all player positions
QUnit.test('Animation works for all player positions', function(assert) {
  // Create an array to hold the async test completions
  const doneArray = [
    assert.async(), // South
    assert.async(), // West
    assert.async(), // North
    assert.async()  // East
  ];
  
  // Test each player position
  for (let i = 0; i < 4; i++) {
    // Create a Turn instance with the game players
    const turn = new this.TestTurn(this.players, this.mockPlayerHandElement);
    
    // Clear the play area
    this.mockPlayArea.innerHTML = '';
    
    // Manually set up a trick with known cards
    const cards = [
      new Card('A', 'Hearts'),
      new Card('K', 'Hearts'),
      new Card('Q', 'Hearts'),
      new Card('J', 'Hearts')
    ];
    
    // Create card elements in the play area
    const cardElements = [];
    const positions = ['south', 'west', 'north', 'east'];
    
    for (let j = 0; j < 4; j++) {
      const cardElement = document.createElement('div');
      cardElement.className = `card ${positions[j]}`;
      cardElement.innerHTML = `<div class="card-content">${cards[j].rank}&nbsp;${cards[j].suit === 'Hearts' ? '♥' : cards[j].suit}</div>`;
      this.mockPlayArea.appendChild(cardElement);
      cardElements.push(cardElement);
    }
    
    // Set up the playerForPlayedCardMap with the current player as the winner
    turn.playerForPlayedCardMap.clear();
    for (let j = 0; j < 4; j++) {
      turn.playerForPlayedCardMap.set(cards[j], this.players[j]);
    }
    
    // Set cardsPlayed to 4 to trigger trick completion
    turn.cardsPlayed = 4;
    
    // Call playNextTurn to process the trick
    turn.playNextTurn();
    
    // Wait for the animation to be applied
    setTimeout(() => {
      try {
        // Assert that the winning card gets the animation class
        assert.ok(cardElements[i].classList.contains('winning-card-animation'), 
                 `${positions[i]} card should have the winning-card-animation class when it wins`);
        
        // Signal that this async test is complete
        doneArray[i]();
      } catch (e) {
        assert.ok(false, `Test for ${positions[i]} failed with error: ${e.message}`);
        doneArray[i]();
      }
    }, 500); // Wait for animation to be applied
  }
});
