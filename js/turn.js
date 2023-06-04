import { Card } from './card.js';
import { getSuitSymbol } from './deck.js';
import { compareCardsForTurn } from './cardComparer.js';
import { PlayStrategy } from './stratagies/play/playStrategy.js';

export class Turn {
    constructor(players, playerHandElement) {
        this.players = players;
        this.playerHandElement = playerHandElement;
        this.currentPlayerIndex = 0;
        this.currentPlayer = this.players[this.currentPlayerIndex];
        this.selectedCard = null;
        this.cardNotPlayed = true;
        this.computerCardsPlayed = 0;
        this.spadesBroken = false;
        this.playerForPlayedCardMap = new Map(); // Map to track played cards and corresponding players

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
                    this.nextComputerTurn();
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

            // Remove the card from the player's hand
            const card = Card.fromCardContentDivElement(this.selectedCard.querySelector('.card-content'));
            this.currentPlayer.hand.removeCard(card);

            // Track the played card and corresponding player
            this.playerForPlayedCardMap.set(card, this.currentPlayer);

            this.selectedCard = null;
            this.cardNotPlayed = false;

            // Update the hand element for the current player
            this.currentPlayer.updateHandElement(this.spadesBroken);
        }
    }

    nextComputerTurn() {
        this.setNextPlayerToCurrent();
        this.computerPlayCard();
    }

    playCard() {
        if (this.currentPlayer.isComputer) {
            this.computerPlayCard();
        }
    }

    computerPlayCard() {
        const strategy = new PlayStrategy(this.currentPlayer);

        const lastPlayedCardElement = document.querySelector('.play-area .card:last-child .card-content');
        const lastPlayedCard = Card.fromCardContentDivElement(lastPlayedCardElement);
        const playedCard = strategy.playCard(this.playerForPlayedCardMap, lastPlayedCard, this.spadesBroken);

        if (!this.spadesBroken && playedCard.suit === 'Spades') {
            this.spadesBroken = true;
        }

        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.classList.add(this.currentPlayer.name.toLowerCase());
        cardElement.classList.add(`suit-${playedCard.suit.toLowerCase()}`);
        cardElement.innerHTML = `<div class="card-content">${playedCard.rank}&nbsp;${getSuitSymbol(playedCard.suit)}</div>`;

        const playAreaElement = document.querySelector('.play-area');
        playAreaElement.appendChild(cardElement);

        this.playerForPlayedCardMap.set(playedCard, this.currentPlayer);

        this.computerCardsPlayed++;

        if (this.computerCardsPlayed <= 3) {
            this.playNextTurn();

            if (this.computerCardsPlayed === 3) {
                this.computerCardsPlayed = 0;
            }
        }
    }

    playNextTurn() {
        if (this.computerCardsPlayed === 3) {
            // All four players have played a card, compare and determine the winning player
            const winningCard = compareCardsForTurn(this.playerForPlayedCardMap);
            const winningPlayer = this.playerForPlayedCardMap.get(winningCard);

            // Update the number of books made by the winning player's team
            if (winningPlayer.team === 1) {
                // Update team 1's books
                const team1BooksElement = document.querySelector('.team1-books');
                let team1Books = parseInt(team1BooksElement.textContent.split(':')[1].trim());
                team1Books++;
                team1BooksElement.textContent = `Our Books: ${team1Books} / Bid: 0`;
            } else if (winningPlayer.team === 2) {
                // Update team 2's books
                const team2BooksElement = document.querySelector('.team2-books');
                let team2Books = parseInt(team2BooksElement.textContent.split(':')[1].trim());
                team2Books++;
                team2BooksElement.textContent = `Their Books: ${team2Books} / Bid: 0`;
            }

            this.playerForPlayedCardMap.clear();
        }

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
