import { getSuitSymbol } from './deck.js';

export class Turn {
    constructor(players, playerHandElement) {
        this.players = players;
        this.playerHandElement = playerHandElement;
        this.currentPlayerIndex = 0;
        this.currentPlayer = this.players[this.currentPlayerIndex];
        this.selectedCard = null;
        this.cardNotPlayed = true;

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

            // Automatically play a card for the computer player
            if (this.currentPlayer !== 'You') {
                this.computerPlayCard();
            } else {
                // It's the player's turn, so initiate the turn for the next computer player
                this.nextComputerTurn();
            }
        }
    }


    nextComputerTurn() {
        const currentPlayerIndex = this.players.findIndex(player => player.name === this.currentPlayer);
        const nextPlayerIndex = (currentPlayerIndex + 1) % this.players.length;
        const nextPlayer = this.players[nextPlayerIndex];

        if (nextPlayer.name !== 'You') {
            setTimeout(() => {
                this.currentPlayer = nextPlayer.name;
                this.computerPlayCard();
            }, 1000);
        }
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
        cardElement.classList.add(`suit-${playedCard.suit.toLowerCase()}`);
        cardElement.innerHTML = `<div class="card-content">${playedCard.rank}&nbsp;${getSuitSymbol(playedCard.suit)}</div>`;

        // Add the card element to the play area
        const playAreaElement = document.querySelector('.play-area');
        playAreaElement.appendChild(cardElement);

        // Pass the turn to the next player
        this.playNextTurn();
    }

    playNextTurn() {
        // Update the current player index
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;

        // Update the current player
        this.currentPlayer = this.players[this.currentPlayerIndex];

        if (this.currentPlayerIndex < 3) {
            // Play the card for the current player
            this.playCard();
            this.cardNotPlayed = true;
        }
    }
}