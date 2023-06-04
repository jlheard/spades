import { RANKS } from './card.js';

export function compareCardsForTurn(playerForPlayedCardMap) {
  const cardsArray = Array.from(playerForPlayedCardMap.keys()); // Convert Map values to an array of cards

  const leadCard = cardsArray[0];
  const otherCards = cardsArray.slice(1);

  // Check if the lead card is a spade
  if (leadCard.suit === 'Spades') {
    // Check if any other card is also a spade
    const otherSpades = otherCards.filter(card => card.suit === 'Spades');

    if (otherSpades.length === 0) {
      return leadCard; // Lead card wins as no other spades present
    }

    const winningSpade = otherSpades.reduce((minSpade, spade) => {
      return RANKS.indexOf(spade.rank) < RANKS.indexOf(minSpade.rank) ? spade : minSpade;
    }, otherSpades[0]);

    return winningSpade;
  } else {
    // Check if any other card is a spade
    const hasSpades = otherCards.some(card => card.suit === 'Spades');

    if (hasSpades) {
      return otherCards.find(card => card.suit === 'Spades'); // Other spades present, find the first spade card as the winner
    } else {
      let winningCard = leadCard;

      for (const card of otherCards) {
        if (card.suit === leadCard.suit && RANKS.indexOf(card.rank) < RANKS.indexOf(winningCard.rank)) {
          winningCard = card;
        }
      }

      return winningCard;
    }
  }
}
