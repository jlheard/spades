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

    // Check if partner has cut a player and will win the trick
    if (partnerCard && this.partnerHasCutAndWillWin(partnerCard, playerForPlayedCardMap)) {
      return this.throwLowestCardInCutSuit(validPlays, partnerCard);
    }

    // Check if partner leads with the only opponent left to play
    if (partnerCard && this.partnerLeadsWithLastOpponent(partnerCard, playerForPlayedCardMap)) {
      return this.playHighestCardInLeadSuit(validPlays, leadingCard);
    }

    // Check if partner has played a spade and will win the trick
    if (partnerCard && partnerCard.suit === 'Spades' && leadingCard && leadingCard.suit !== 'Spades') {
      // Partner has played a spade when the leading suit is not spades
      // Play a lower card to avoid wasting high cards
      const leadingSuitCards = validPlays.filter(card => card.suit === leadingCard.suit);
      if (leadingSuitCards.length > 0) {
        // Sort by rank (highest to lowest)
        leadingSuitCards.sort((a, b) => this.getRankValue(b.rank) - this.getRankValue(a.rank));
        // Return the second highest card if available, otherwise the highest
        if (leadingSuitCards.length > 1) {
          // Ensure we're playing the King when we have both Ace and King
          if (leadingSuitCards[0].rank === 'A' && leadingSuitCards[1].rank === 'K') {
            return leadingSuitCards[1]; // Return the King
          }
        }
        return leadingSuitCards[0]; // Return the highest card if no King available
      }
    }

    // Default strategy: play the highest-ranking card
    return this.playHighestRankingCard(validPlays);
  }

  getRankValue(rank) {
    const rankValues = {
      'BigJoker': 15,
      'ExtraJoker': 14,
      'A': 13,
      'K': 12,
      'Q': 11,
      'J': 10,
      '10': 9,
      '9': 8,
      '8': 7,
      '7': 6,
      '6': 5,
      '5': 4,
      '4': 3,
      '3': 2,
      '2': 1
    };
    return rankValues[rank] || 0;
  }
}
