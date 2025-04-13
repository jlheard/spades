import { RANKS } from './card.js';

export function compareCardsForTurn(playerForPlayedCardMap) {
  const cardsArray = Array.from(playerForPlayedCardMap.keys()); // Convert Map values to an array of cards
  
  // First, check for jokers which beat everything
  const jokers = cardsArray.filter(card => card.rank === 'BigJoker' || card.rank === 'ExtraJoker');
  
  if (jokers.length > 0) {
    // If there are jokers, find the highest ranked one (lowest index in RANKS)
    return jokers.reduce((highestJoker, joker) => {
      return RANKS.indexOf(joker.rank) < RANKS.indexOf(highestJoker.rank) ? joker : highestJoker;
    }, jokers[0]);
  }
  
  // No jokers, so check for spades
  const spades = cardsArray.filter(card => card.suit === 'Spades');
  
  if (spades.length > 0) {
    // If there are spades, find the highest ranked one (lowest index in RANKS)
    return spades.reduce((highestSpade, spade) => {
      return RANKS.indexOf(spade.rank) < RANKS.indexOf(highestSpade.rank) ? spade : highestSpade;
    }, spades[0]);
  }
  
  // No spades or jokers, so follow the lead suit
  const leadCard = cardsArray[0];
  const leadSuitCards = cardsArray.filter(card => card.suit === leadCard.suit);
  
  // Find the highest ranked card of the lead suit
  return leadSuitCards.reduce((highestCard, card) => {
    return RANKS.indexOf(card.rank) < RANKS.indexOf(highestCard.rank) ? card : highestCard;
  }, leadSuitCards[0]);
}
