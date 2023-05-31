// player.js

import { getSuitSymbol } from './deck.js';

const rankOrder = ['BigJoker', 'ExtraJoker', 'A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

export class Player {
    constructor(name, isComputer = false) {
        this.name = name;
        this.hand = [];
        this.partner = null;
        this.isComputer = isComputer;
    }

    setPartner(partner) {
        this.partner = partner;
    }

    setHand(hand) {
        this.hand = hand;
    }

    sortHand() {
        this.hand.sort((a, b) => {
            if (a.suit !== b.suit) {
                const suitOrder = ['spades', 'hearts', 'diamonds', 'clubs'];
                return suitOrder.indexOf(a.suit) - suitOrder.indexOf(b.suit);
            } else {
                return rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank);
            }
        });
    }

    populateHandElement(handElement) {
        if (!handElement) {
            return;
        }

        handElement.innerHTML = '';

        const cardsBySuit = {};
        this.hand.forEach(card => {
            if (!cardsBySuit[card.suit]) {
                cardsBySuit[card.suit] = [];
            }
            cardsBySuit[card.suit].push(card);
        });

        Object.values(cardsBySuit).forEach(cards => {
            cards.sort((a, b) => rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank));

            const cardGroup = document.createElement('div');
            cardGroup.classList.add('card-group');

            cards.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.classList.add('card');
                cardElement.classList.add('south');
                cardElement.classList.add(`suit-${card.suit.toLowerCase()}`);
                cardElement.innerHTML = `<div class="card-content">${card.rank}&nbsp;${getSuitSymbol(card.suit)}</div>`;
                cardGroup.appendChild(cardElement);
            });

            handElement.appendChild(cardGroup);
        });
    }
}
