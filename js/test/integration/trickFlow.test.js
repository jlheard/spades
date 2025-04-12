import { Game } from '../../game.js';
import { Turn } from '../../turn.js';
import { Card } from '../../card.js';
import { Hand } from '../../hand.js';
import { assert, test, beforeEach, setTestFile } from '../testUtils.js';

export function trickFlowIntegrationTest() {
  beforeEach(() => {
    // Set up any necessary test data or configurations
  });

  setTestFile('integration/trickFlow.test.js');

  test('Integration - Complete trick flow with rule enforcement', () => {
    // Arrange
    const game = new Game();
    
    // Create a mock playerHandElement for the Turn constructor
    const mockPlayerHandElement = document.createElement('div');
    mockPlayerHandElement.id = 'player-hand';
    document.body.appendChild(mockPlayerHandElement);
    
    // Create a mock play area
    const mockPlayArea = document.createElement('div');
    mockPlayArea.className = 'play-area';
    document.body.appendChild(mockPlayArea);
    
    // Create mock book elements
    const team1BooksElement = document.createElement('div');
    team1BooksElement.className = 'team1-books';
    team1BooksElement.textContent = 'Our Books: 0 / Bid: 0';
    document.body.appendChild(team1BooksElement);
    
    const team2BooksElement = document.createElement('div');
    team2BooksElement.className = 'team2-books';
    team2BooksElement.textContent = 'Their Books: 0 / Bid: 0';
    document.body.appendChild(team2BooksElement);
    
    // Set up known hands for testing
    game.players[0].hand.setCards([
      new Card('A', 'Hearts'), 
      new Card('K', 'Hearts'),
      new Card('Q', 'Spades'),
      new Card('J', 'Diamonds')
    ]);
    
    game.players[1].hand.setCards([
      new Card('K', 'Diamonds'), 
      new Card('Q', 'Hearts'),
      new Card('J', 'Spades'),
      new Card('10', 'Clubs')
    ]);
    
    game.players[2].hand.setCards([
      new Card('Q', 'Diamonds'), 
      new Card('J', 'Hearts'),
      new Card('10', 'Spades'),
      new Card('9', 'Clubs')
    ]);
    
    game.players[3].hand.setCards([
      new Card('J', 'Diamonds'), 
      new Card('10', 'Hearts'),
      new Card('9', 'Spades'),
      new Card('8', 'Clubs')
    ]);
    
    // Create a Turn instance with the game players
    const turn = new Turn(game.players, mockPlayerHandElement);
    
    // Test 1: Verify that the human player can only play valid cards
    // First, let's test that the player can't lead with Spades when they're not broken
    
    // Create a mock card element for the Spades card (which should be invalid as a lead)
    const mockSpadesCard = document.createElement('div');
    mockSpadesCard.className = 'card';
    mockSpadesCard.innerHTML = '<div class="card-content">Q&nbsp;♠</div>';
    
    // Simulate clicking the Spades card
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    
    // Set the current player to the human player (index 0)
    turn.currentPlayerIndex = 0;
    turn.currentPlayer = game.players[0];
    turn.cardNotPlayed = true;
    turn.spadesBroken = false; // Spades not broken yet
    
    // Dispatch the click event on the Spades card
    Object.defineProperty(clickEvent, 'target', { value: mockSpadesCard });
    turn.handleCardClick(clickEvent);
    
    // Assert that the Spades card was not selected (invalid play)
    assert(turn.selectedCard === null, 'Spades card should not be selectable when Spades are not broken');
    
    // Test 2: Verify that the player can lead with a non-Spades card
    // Create a mock card element for the Hearts card (which should be valid as a lead)
    const mockHeartsCard = document.createElement('div');
    mockHeartsCard.className = 'card valid-play';
    mockHeartsCard.innerHTML = '<div class="card-content">A&nbsp;♥</div>';
    
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
    assert(turn.selectedCard === mockHeartsCard, 'Hearts card should be selectable when Spades are not broken');
    
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
    assert(turn.cardsPlayed === 1, 'Card should be played after second click');
    assert(turn.cardNotPlayed === false, 'cardNotPlayed should be false after playing a card');
    
    // Clean up
    document.body.removeChild(mockPlayerHandElement);
    document.body.removeChild(mockPlayArea);
    document.body.removeChild(team1BooksElement);
    document.body.removeChild(team2BooksElement);
  });

  test('Integration - Winning card determination and animation', () => {
    // Arrange
    const game = new Game();
    
    // Create a mock playerHandElement for the Turn constructor
    const mockPlayerHandElement = document.createElement('div');
    mockPlayerHandElement.id = 'player-hand';
    document.body.appendChild(mockPlayerHandElement);
    
    // Create a mock play area
    const mockPlayArea = document.createElement('div');
    mockPlayArea.className = 'play-area';
    document.body.appendChild(mockPlayArea);
    
    // Create mock book elements
    const team1BooksElement = document.createElement('div');
    team1BooksElement.className = 'team1-books';
    team1BooksElement.textContent = 'Our Books: 0 / Bid: 0';
    document.body.appendChild(team1BooksElement);
    
    const team2BooksElement = document.createElement('div');
    team2BooksElement.className = 'team2-books';
    team2BooksElement.textContent = 'Their Books: 0 / Bid: 0';
    document.body.appendChild(team2BooksElement);
    
    // Create a Turn instance with the game players
    const turn = new Turn(game.players, mockPlayerHandElement);
    
    // Manually set up a trick with known cards
    const heartsA = new Card('A', 'Hearts');
    const heartsK = new Card('K', 'Hearts');
    const heartsQ = new Card('Q', 'Hearts');
    const heartsJ = new Card('J', 'Hearts');
    
    // Create card elements in the play area
    const player0Card = document.createElement('div');
    player0Card.className = 'card you';
    player0Card.innerHTML = '<div class="card-content">A&nbsp;♥</div>';
    mockPlayArea.appendChild(player0Card);
    
    const player1Card = document.createElement('div');
    player1Card.className = 'card west';
    player1Card.innerHTML = '<div class="card-content">K&nbsp;♥</div>';
    mockPlayArea.appendChild(player1Card);
    
    const player2Card = document.createElement('div');
    player2Card.className = 'card north';
    player2Card.innerHTML = '<div class="card-content">Q&nbsp;♥</div>';
    mockPlayArea.appendChild(player2Card);
    
    const player3Card = document.createElement('div');
    player3Card.className = 'card east';
    player3Card.innerHTML = '<div class="card-content">J&nbsp;♥</div>';
    mockPlayArea.appendChild(player3Card);
    
    // Set up the playerForPlayedCardMap
    turn.playerForPlayedCardMap.set(heartsA, game.players[0]);
    turn.playerForPlayedCardMap.set(heartsK, game.players[1]);
    turn.playerForPlayedCardMap.set(heartsQ, game.players[2]);
    turn.playerForPlayedCardMap.set(heartsJ, game.players[3]);
    
    // Set cardsPlayed to 4 to trigger trick completion
    turn.cardsPlayed = 4;
    
    // Call playNextTurn to process the trick
    turn.playNextTurn();
    
    // Assert that the winning card (Ace of Hearts) gets the animation class
    // Note: In a real test environment, we'd need to wait for the animation,
    // but for this test we'll just check that the class was added
    assert(player0Card.classList.contains('winning-card-animation'), 
           'Winning card should have the winning-card-animation class');
    
    // Assert that the books count was updated for team 1
    const team1Books = parseInt(team1BooksElement.textContent.split(':')[1].trim());
    assert(team1Books === 1, 'Team 1 books should be incremented');
    
    // Clean up
    document.body.removeChild(mockPlayerHandElement);
    document.body.removeChild(mockPlayArea);
    document.body.removeChild(team1BooksElement);
    document.body.removeChild(team2BooksElement);
  });
}
