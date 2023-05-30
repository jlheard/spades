// game.js

import { Player } from './player.js';
import { Deck, getSuitSymbol } from './deck.js';

export class Game {
  constructor() {
    this.players = [];
    this.deck = new Deck();
    this.initializePlayers();
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

    // Sort the cards in the player's hand
    this.players.forEach(player => {
      player.sortHand();
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
