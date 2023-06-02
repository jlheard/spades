import { RANKS } from './card.js';

export function compareCardsForTurn(leadCard, card2, card3, card4) {
  const cards = [leadCard, card2, card3, card4];

  // Check if the lead card is a spade
  if (leadCard.suit === 'Spades') {
    // Check if any other card is also a spade
    const otherSpades = cards.slice(1).filter(card => card.suit === 'Spades');

    if (otherSpades.length === 0) {
      return leadCard; // Lead card wins as no other spades present
    }

    const winningSpade = otherSpades.reduce((minSpade, spade) => {
      return RANKS.indexOf(spade.rank) < RANKS.indexOf(minSpade.rank) ? spade : minSpade;
    }, otherSpades[0]);

    return winningSpade;
  } else {
    // Check if any other card is a spade
    const hasSpades = cards.slice(1).some(card => card.suit === 'Spades');

    if (hasSpades) {
      return cards.find(card => card.suit === 'Spades'); // Other spades present, find the first spade card as the winner
    } else {
      let winningCard = leadCard;

      for (const card of cards.slice(1)) {
        if (card.suit === leadCard.suit && RANKS.indexOf(card.rank) < RANKS.indexOf(winningCard.rank)) {
          winningCard = card;
        }
      }

      return winningCard;
    }
  }
}
