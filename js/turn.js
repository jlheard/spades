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
        this.cardsPlayed = 0;
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
            
            // Check if the card is a valid play
            if (!clickedCardElement.classList.contains('valid-play')) {
                // Show error message or tooltip
                this.showInvalidCardMessage(clickedCardElement);
                return;
            }

            if (this.selectedCard) {
                if (clickedCardElement === this.selectedCard && this.cardNotPlayed) {
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
    
    // New method to show invalid card message
    showInvalidCardMessage(cardElement) {
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.classList.add('error-tooltip');
        
        // Get card details
        const cardContent = cardElement.querySelector('.card-content');
        const card = Card.fromCardContentDivElement(cardContent);
        
        // Determine reason for invalid play
        let reason = "Invalid play";
        const leadingSuit = this.cardsPlayed > 0 ? 
            Card.fromCardContentDivElement(document.querySelector('.play-area .card:first-child .card-content')).suit : null;
        
        if (leadingSuit === null && card.suit === 'Spades' && !this.spadesBroken) {
            reason = "Can't lead with Spades until they're broken";
        } else if (leadingSuit !== null && card.suit !== leadingSuit && 
                this.currentPlayer.hand.cards.some(c => c.suit === leadingSuit)) {
            reason = `Must follow suit (${leadingSuit})`;
        }
        
        tooltip.textContent = reason;
        cardElement.appendChild(tooltip);
        
        // Remove tooltip after delay
        setTimeout(() => {
            if (tooltip.parentNode === cardElement) {
                cardElement.removeChild(tooltip);
            }
        }, 3000);
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

            if(!this.spadesBroken && card.suit === 'Spades') {
                this.spadesBroken = true
            }            

            this.selectedCard = null;
            this.cardNotPlayed = false;

            // Update the hand element for the current player
            // Get the leading suit from the first card played in this trick
            const leadingSuit = this.cardsPlayed > 0 ? 
                Card.fromCardContentDivElement(document.querySelector('.play-area .card:first-child .card-content')).suit : null;
            this.currentPlayer.updateHandElement(this.spadesBroken, leadingSuit);

            this.cardsPlayed++; // Increment cardsPlayed
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
        const strategy = this.currentPlayer.strategy;

        const lastPlayedCardElement = document.querySelector('.play-area .card:last-child .card-content');
        const lastPlayedCard = lastPlayedCardElement != null 
            ? Card.fromCardContentDivElement(lastPlayedCardElement) : null;
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

        this.cardsPlayed++;

        this.playNextTurn();
    }

    updateBooks(winningPlayer) {
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
    }

    playNextTurn() {
        if(this.cardsPlayed >= 4) {
            // All players have played a card, compare and determine the winning player
            const winningCard = compareCardsForTurn(this.playerForPlayedCardMap);
            const winningPlayer = this.playerForPlayedCardMap.get(winningCard);
            
            // Find the winning card element
            const winningCardElement = document.querySelector(`.play-area .card.${winningPlayer.name.toLowerCase()}`);
            
            // Highlight winning card with animation
            if (winningCardElement) {
                // Force a reflow before adding the animation class to ensure it's applied
                void winningCardElement.offsetWidth;
                winningCardElement.classList.add('winning-card-animation');
                
                // Also add a data attribute to make it easier to test
                winningCardElement.setAttribute('data-winning-card', 'true');
            }
            
            // Update books
            this.updateBooks(winningPlayer);
            
            // Use animation to transition between tricks
            setTimeout(() => {
                const playAreaElement = document.querySelector('.play-area');
                playAreaElement.classList.add('fade-out');
                
                setTimeout(() => {
                    // Reset for next trick
                    this.playerForPlayedCardMap.clear();
                    this.cardsPlayed = 0;
                    this.spadesBroken = false;
                    
                    // Set the current player index to the winner
                    this.currentPlayerIndex = this.players.findIndex(player => player.name === winningPlayer.name);
                    this.currentPlayer = winningPlayer;
                    
                    // Clear the play area
                    playAreaElement.innerHTML = '';
                    playAreaElement.classList.remove('fade-out');
                    
                    // Update the hand element for the human player
                    // No leading suit at the start of a new trick
                    this.players[0].updateHandElement(this.spadesBroken, null);
                    
                    // Continue with next trick
                    this.playCard();
                    this.cardNotPlayed = !this.currentPlayer.isComputer;
                }, 1000); // Wait for fade-out animation
            }, 2000); // Show winning card for 2 seconds
            
            return; // Important: return early to prevent immediate next turn
        } else {
            this.setNextPlayerToCurrent();
            
            // Play the card for the current player
            this.playCard();
            this.cardNotPlayed = !this.currentPlayer.isComputer; // this is only set to true when the human player has yet to play.
        }
    }



    setNextPlayerToCurrent() {
        const currentPlayerIndex = this.players.findIndex(player => player.name === this.currentPlayer.name);
        const nextPlayerIndex = (currentPlayerIndex + 1) % this.players.length;
        this.currentPlayer = this.players[nextPlayerIndex];
        this.currentPlayerIndex = nextPlayerIndex;
    }
}
