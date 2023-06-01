// player.js

import { getSuitSymbol } from './deck.js';
import { Hand, RANK_ORDER } from './hand.js';

export class Player {
    constructor(name, isComputer = false) {
      this.name = name;
      this.hand = new Hand();
      this.partner = null;
      this.isComputer = isComputer;
    }
  
    setPartner(partner) {
      this.partner = partner;
    }
  
    setHand(hand) {
      this.hand.setCards(hand);
    }
  
    getHand() {
      return this.hand;
    }

    populateHandElement(handElement) {
      if (!handElement) {
        return;
      }
    
      handElement.innerHTML = '';
    
      const cardsBySuit = {};
      this.hand.cards.forEach(card => {
        if (!cardsBySuit[card.suit]) {
          cardsBySuit[card.suit] = [];
        }
        cardsBySuit[card.suit].push(card);
      });
    
      const validPlaysMap = this.hand.getLegalPlaysMap(null, false);
      const validPlays = Array.from(validPlaysMap.values());
    
      Object.values(cardsBySuit).forEach(cards => {
        cards.sort((a, b) => RANK_ORDER.indexOf(a.rank) - RANK_ORDER.indexOf(b.rank));
    
        const cardGroup = document.createElement('div');
        cardGroup.classList.add('card-group');
    
        cards.forEach(card => {
          const cardElement = document.createElement('div');
          cardElement.classList.add('card');
          cardElement.classList.add('south');
          cardElement.classList.add(`suit-${card.suit.toLowerCase()}`);
          cardElement.innerHTML = `<div class="card-content">${card.rank}&nbsp;${getSuitSymbol(card.suit)}</div>`;
    
          // Check if the card value exists in validPlays
          if (validPlays.includes(card)) {
            cardElement.classList.add('valid-play');
          }
    
          cardGroup.appendChild(cardElement);
        });
    
        handElement.appendChild(cardGroup);
      });
    } 
}
