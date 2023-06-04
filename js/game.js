// game.js

import { Player } from './player.js';
import { Deck, getSuitSymbol } from './deck.js';
import { PlayStrategy } from './stratagies/play/playStrategy.js';

export class Game {
    constructor() {
        this.players = [];
        this.deck = new Deck();
        this.initializePlayers();
        this.scoreThreshold = 500;
        this.currentScore = 0;        
    }

    initializePlayers() {
        const you = new Player('You');
        
        const north = new Player('North', true);
        north.setStrategy(new PlayStrategy(north));

        const east = new Player('East', true);
        east.setStrategy(new PlayStrategy(east));

        const west = new Player('West', true);
        west.setStrategy(new PlayStrategy(west));

        // Set teams
        you.setTeam(1);
        north.setTeam(1);
        east.setTeam(2);
        west.setTeam(2);

        // this sets the initial turn but it will need to be updated later
        this.players.push(you, west, north, east);

        this.dealHands();

        // Sort the cards in the player's hand
        this.players.forEach(player => {
            player.hand.sortCards();
        });

        // Populate the cards in the hand of player "You"
        const youHandElement = document.getElementById('player-hand');
        if (youHandElement) {
            you.populateHandElement(youHandElement);
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
