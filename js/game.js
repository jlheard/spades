import { Player } from './player.js';
import { Deck, getSuitSymbol } from './deck.js';

export class Game {
    constructor() {
        this.players = [];
        this.deck = new Deck()
        this.initializePlayers()
    }

    initializePlayers() {
        const you = new Player('You');
        const north = new Player('North');
        const east = new Player('East');
        const west = new Player('West');

        // Set partnerships
        you.setPartner(north);
        north.setPartner(you);
        east.setPartner(west);
        west.setPartner(east);

        this.players.push(you, north, east, west);

        this.dealHands();

        // Sort the cards in the player's hand by suit and rank
        const rankOrder = ['BigJoker', 'ExtraJoker', 'A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
        you.hand.sort((a, b) => {
            if (a.suit !== b.suit) {
                // Sort by suit in the order: spades, hearts, diamonds, clubs
                const suitOrder = ['spades', 'hearts', 'diamonds', 'clubs'];
                return suitOrder.indexOf(a.suit) - suitOrder.indexOf(b.suit);
            } else {
                // Sort cards of the same suit by rank
                return rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank);
            }
        });

        // Populate the cards in the hand of player "You"
        const youHandElement = document.getElementById('player-hand');
        if (youHandElement) {
            // Clear the existing cards
            youHandElement.innerHTML = '';

            // Group the cards by suit
            const cardsBySuit = {};
            you.hand.forEach(card => {
                if (!cardsBySuit[card.suit]) {
                    cardsBySuit[card.suit] = [];
                }
                cardsBySuit[card.suit].push(card);
            });

            // Add the cards to the hand element, grouped by suit
            Object.values(cardsBySuit).forEach(cards => {
                // Sort the cards within each suit by rank
                cards.sort((a, b) => rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank));

                // Create a card group container
                const cardGroup = document.createElement('div');
                cardGroup.classList.add('card-group');

                // Add the cards to the card group
                cards.forEach(card => {
                    const cardElement = document.createElement('div');
                    cardElement.classList.add('card');
                    cardElement.classList.add(`suit-${card.suit.toLowerCase()}`);
                    cardElement.innerHTML = `<div class="card-content">${card.rank}&nbsp;${getSuitSymbol(card.suit)}</div>`;
                    cardGroup.appendChild(cardElement);
                });

                // Add the card group to the player's hand element
                youHandElement.appendChild(cardGroup);
            });
        }
    }


    dealHands() {
        const numCardsPerHand = 13;

        // Shuffle the deck
        this.deck.shuffleDeck();

        // Deal cards to each player
        this.players.forEach(player => {
            const hand = this.deck.dealCards(numCardsPerHand);
            player.setHand(hand);
        });
    }

}