import { getSuitSymbol } from './deck.js';

export class Turn {
    constructor(players, playerHandElement) {
        this.players = players;
        this.playerHandElement = playerHandElement;
        this.currentPlayerIndex = 0;
        this.currentPlayer = this.players[this.currentPlayerIndex];
        this.selectedCard = null;
        this.cardNotPlayed = true;
        this.computerCardsPlayed = 0;

        this.playerHandElement.addEventListener('click', this.handleCardClick.bind(this));

        this.playCard();
    }

    handleCardClick(event) {
        const playAreaElement = document.querySelector('.play-area');
        if (event.target.classList.contains('card')) {
            const clickedCardElement = event.target;

            if (this.currentPlayer.isComputer) {
                // Ignore card clicks for computer players
                return;
            }

            if (this.selectedCard) {
                if (clickedCardElement === this.selectedCard && this.cardNotPlayed) {
                    // Clear the play area
                    playAreaElement.innerHTML = '';
                    this.putCardInPile(playAreaElement);
                    this.playNextTurn();
                } else {
                    this.selectedCard.classList.remove('selected');
                    this.selectedCard = clickedCardElement;
                    this.selectedCard.classList.add('selected');
                }
            } else {
                this.selectedCard = clickedCardElement;
                this.selectedCard.classList.add('selected');
            }
        }
    }

    putCardInPile(playAreaElement) {
        if (this.selectedCard) {
            this.selectedCard.parentElement.removeChild(this.selectedCard);
            playAreaElement.appendChild(this.selectedCard);
            this.selectedCard.classList.remove('selected');
            this.selectedCard = null;
            this.cardNotPlayed = false;

            // It's the player's turn, so initiate the turn for the next computer player
            this.nextComputerTurn();
        }
    }

    nextComputerTurn() {
        this.setNextPlayerToCurrent()
        this.computerPlayCard();
    }


    playCard() {
        if (this.currentPlayer.isComputer) {
            this.computerPlayCard();
        }
    }

    computerPlayCard() {
        // Add your logic for the computer player to select and play a card from their hand
        // ...      

        // Example: Remove the first card from the computer player's hand
        const playedCard = this.currentPlayer.hand.shift();

        // Update the UI by creating a new card element for the played card
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.classList.add(this.currentPlayer.name.toLowerCase());
        cardElement.classList.add(`suit-${playedCard.suit.toLowerCase()}`);
        cardElement.innerHTML = `<div class="card-content">${playedCard.rank}&nbsp;${getSuitSymbol(playedCard.suit)}</div>`;

        // Add the card element to the play area
        const playAreaElement = document.querySelector('.play-area');
        playAreaElement.appendChild(cardElement);

        this.computerCardsPlayed++;

        if (this.computerCardsPlayed <= 3) {
            // Pass the turn to the next player
            this.playNextTurn();

            if (this.computerCardsPlayed == 3) {
                this.computerCardsPlayed = 0;
            }
        }

    }

    playNextTurn() {
        // Play the card for the current player
        this.setNextPlayerToCurrent();
        this.playCard();
        this.cardNotPlayed = true;
    }

    setNextPlayerToCurrent() {
        const currentPlayerIndex = this.players.findIndex(player => player.name === this.currentPlayer.name);
        const nextPlayerIndex = (currentPlayerIndex + 1) % this.players.length;
        this.currentPlayer = this.players[nextPlayerIndex];
        this.currentPlayerIndex = nextPlayerIndex;
    }
}
