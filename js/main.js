import { Game } from './game.js';

// Create a new game instance
const game = new Game();

// Get the player's hand element
const playerHandElement = document.getElementById('player-hand');

// Keep track of the selected card
let selectedCard = null;

// hack for tracking card selection
let cardNotPlayed = true;

// Add a click event listener to the player's hand element
playerHandElement.addEventListener('click', handleCardClick);

function handleCardClick(event) {
    // Check if a card element was clicked
    if (event.target.classList.contains('card')) {
      const clickedCardElement = event.target;
      
      // Check if a card is already selected
      if (selectedCard) {
        // Check if the clicked card is the same as the selected card
        if (clickedCardElement === selectedCard && cardNotPlayed) {
          // Put the selected card in the pile
          putCardInPile();
        } else {
          // Deselect the previously selected card
          selectedCard.classList.remove('selected');
          // Select the new clicked card
          selectedCard = clickedCardElement;
          selectedCard.classList.add('selected');
        }
      } else {
        // Select the clicked card
        selectedCard = clickedCardElement;
        selectedCard.classList.add('selected');
      }
    }
  }
  


  function putCardInPile() {
    if (selectedCard) {
      // Remove the card from its current parent (player's hand or play area)
      selectedCard.parentElement.removeChild(selectedCard);
      // Add the card to the play area (pile)
      const playAreaElement = document.querySelector('.play-area');
      playAreaElement.appendChild(selectedCard);
      // Reset the selected card
      selectedCard.classList.remove('selected');
      selectedCard = null;
      // Hack to track a card until turns are implemented
      cardNotPlayed = false;
    }
  }
  
  
