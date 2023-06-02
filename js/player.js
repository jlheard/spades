// player.js

import { RANKS } from './card.js';
import { getSuitSymbol } from './deck.js';
import { Hand } from './hand.js';

export class Player {
    constructor(name, isComputer = false) {
      this.name = name;
      this.hand = new Hand();
      this.team = null;
      this.isComputer = isComputer;
    }
  
    setTeam(teamNumber) {
      this.team = teamNumber;
    }
  
    setHand(hand) {
      this.hand.setCards(hand);
    }
  
    getHand() {
      return this.hand;
    }

    populateHandElement(handElement, spadesBroken = false) {
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
    
      const validPlaysMap = this.hand.getLegalPlaysMap(null, spadesBroken);
      const validPlays = Array.from(validPlaysMap.values());
    
      Object.values(cardsBySuit).forEach(cards => {
        cards.sort((a, b) => RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank));
    
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

    updateHandElement(spadesBroken) {
      const handElement = document.getElementById('player-hand');
      this.populateHandElement(handElement, spadesBroken);
    }    
}
