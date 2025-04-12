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
  
  setStrategy(strategy) {
    if (!this.isComputer) {
      throw new Error('A strategy must not be provided for the human player');
    }
    this.strategy = strategy;
  }  

  getHand() {
    return this.hand;
  }

  getInvalidReason(card, leadingSuit, spadesBroken) {
    if (leadingSuit === null && card.suit === 'Spades' && !spadesBroken) {
      return "Can't lead with Spades until they're broken";
    } else if (leadingSuit !== null && card.suit !== leadingSuit && 
               this.hand.cards.some(c => c.suit === leadingSuit)) {
      return `Must follow suit (${leadingSuit})`;
    }
    return "Invalid play";
  }

  populateHandElement(handElement, spadesBroken = false, leadingSuit = null) {
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

    const validPlaysMap = this.hand.getLegalPlaysMap(leadingSuit, spadesBroken);
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
        
        // Check if the card value exists in validPlays
        const isValid = validPlays.some(validCard => 
          validCard.rank === card.rank && validCard.suit === card.suit);
        
        if (isValid) {
          cardElement.classList.add('valid-play');
        } else {
          cardElement.classList.add('invalid-play');
          
          // Add title attribute with reason for invalid play
          const reason = this.getInvalidReason(card, leadingSuit, spadesBroken);
          cardElement.setAttribute('title', reason);
          
          // Add event listeners for hover to show tooltip
          cardElement.addEventListener('mouseover', () => {
            if (cardElement.querySelector('.error-tooltip')) return;
            
            const tooltip = document.createElement('div');
            tooltip.classList.add('error-tooltip');
            tooltip.textContent = reason;
            cardElement.appendChild(tooltip);
          });
          
          cardElement.addEventListener('mouseout', () => {
            const tooltip = cardElement.querySelector('.error-tooltip');
            if (tooltip) cardElement.removeChild(tooltip);
          });
        }
        
        cardElement.innerHTML = `<div class="card-content">${card.rank}&nbsp;${getSuitSymbol(card.suit)}</div>`;
        cardGroup.appendChild(cardElement);
      });

      handElement.appendChild(cardGroup);
    });
  }

  updateHandElement(spadesBroken, leadingSuit = null) {
    const handElement = document.getElementById('player-hand');
    this.populateHandElement(handElement, spadesBroken, leadingSuit);
  }
}
