import { Player } from './player.js';
import { Deck } from './deck.js';

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

    // Populate the cards in the hand of player "You"
    // const youHandElement = document.getElementById('player-hand');
    // you.hand.forEach(card => {
    //   const cardElement = document.createElement('div');
    //   cardElement.classList.add('card');
    //   cardElement.innerHTML = `<div class="card rank">${card.rank}</div>
    //                            <div class="card suit ${card.suit}">${getSuitSymbol(card.suit)}</div>`;
    //   youHandElement.appendChild(cardElement);
    // });  

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