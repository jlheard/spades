import { Player } from './player.js';
import { shuffleDeck } from './deck.js';

export class Game {
  constructor() {
    this.players = [];
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
  }

  dealHands() {
    const numCardsPerHand = 13;

    // Shuffle the deck
    shuffleDeck();

    // Deal cards to each player
    this.players.forEach(player => {
      const hand = dealCards(numCardsPerHand);
      player.setHand(hand);
    });
  }
  
}
