import { PlayStrategy } from './playStrategy.js';

export class SmartPlayStrategy extends PlayStrategy {
  constructor(player) {
    super(player);
  }

  chooseCardToPlay(validPlays, playerForPlayedCardMap, leadingCard) {
    const partnerCard = this.getPartnerCard(playerForPlayedCardMap);

    // Check if partner has already won a book
    if (partnerCard && partnerCard.player.hasWonBook) {
      return this.throwLowestRankingCard(validPlays);
    }

    // Check if partner has cut a player and will win the turn
    if (partnerCard && this.partnerHasCutAndWillWin(partnerCard, playerForPlayedCardMap)) {
      return this.throwLowestCardInCutSuit(validPlays, partnerCard);
    }

    // Check if partner leads with the only opponent left to play
    if (partnerCard && this.partnerLeadsWithLastOpponent(partnerCard, playerForPlayedCardMap)) {
      return this.playHighestCardInLeadSuit(validPlays, leadingCard);
    }

    // Default strategy: play the highest-ranking card
    return this.playHighestRankingCard(validPlays);
  }
}
