import { PlayStrategy } from './playStrategy.js';

export class SmartPlayStrategy extends PlayStrategy {
  constructor(player) {
    super(player);
  }

  chooseCardToPlay(validPlays, playerForPlayedCardMap, leadingCard) {
    // If there are no valid plays, return null
    if (!validPlays || validPlays.length === 0) {
      console.log("No valid plays available for SmartPlayStrategy");
      return null;
    }
    
    // Log the valid plays for debugging
    console.log(`SmartPlayStrategy - Valid plays for ${this.player.name}:`, validPlays.map(card => `${card.rank} of ${card.suit}`).join(', '));
    
    const partnerCard = this.getPartnerCard(playerForPlayedCardMap);
    console.log(`Partner card: ${partnerCard ? partnerCard.rank + ' of ' + partnerCard.suit : 'none'}`);

    // Check if partner has already won a book
    if (partnerCard && partnerCard.player && partnerCard.player.hasWonBook) {
      console.log("Partner has already won a book, throwing lowest ranking card");
      return this.throwLowestRankingCard(validPlays);
    }

    // Check if partner has cut a player and will win the trick
    if (partnerCard && this.partnerHasCutAndWillWin(partnerCard, playerForPlayedCardMap)) {
      console.log("Partner has cut and will win, throwing lowest card in cut suit");
      return this.throwLowestCardInCutSuit(validPlays, partnerCard);
    }

    // Check if partner leads with the only opponent left to play
    if (partnerCard && this.partnerLeadsWithLastOpponent(partnerCard, playerForPlayedCardMap)) {
      console.log("Partner leads with last opponent, playing highest card in lead suit");
      return this.playHighestCardInLeadSuit(validPlays, leadingCard);
    }

    // Check if partner has played a spade and will win the trick
    if (partnerCard && partnerCard.suit === 'Spades' && leadingCard && leadingCard.suit !== 'Spades') {
      console.log("Partner has played a spade and will win the trick");
      // Partner has played a spade when the leading suit is not spades
      // Play a lower card to avoid wasting high cards
      const leadingSuitCards = validPlays.filter(card => card.suit === leadingCard.suit);
      if (leadingSuitCards.length > 0) {
        console.log(`Found ${leadingSuitCards.length} cards of the leading suit`);
        // Sort by rank (highest to lowest)
        leadingSuitCards.sort((a, b) => this.getRankValue(b.rank) - this.getRankValue(a.rank));
        // Return the second highest card if available, otherwise the highest
        if (leadingSuitCards.length > 1) {
          // Ensure we're playing the King when we have both Ace and King
          if (leadingSuitCards[0].rank === 'A' && leadingSuitCards[1].rank === 'K') {
            console.log("Playing King instead of Ace since partner will win");
            return leadingSuitCards[1]; // Return the King
          }
        }
        return leadingSuitCards[0]; // Return the highest card if no King available
      }
    }

    // If there's a leading card, prioritize following suit (use the base class behavior)
    if (leadingCard) {
      const leadingSuit = leadingCard.suit;
      console.log(`Leading suit is ${leadingSuit}`);
      
      // Filter cards that match the leading suit
      const suitMatchingCards = validPlays.filter(card => card.suit === leadingSuit);
      
      // If we have cards of the leading suit, play one of those
      if (suitMatchingCards.length > 0) {
        console.log(`${this.player.name} has ${suitMatchingCards.length} cards of the leading suit`);
        
        // Sort by rank (highest to lowest) and play the highest card that follows suit
        // This is different from the base strategy which plays the lowest card
        suitMatchingCards.sort((a, b) => this.getRankValue(b.rank) - this.getRankValue(a.rank));
        return suitMatchingCards[0];
      } else {
        console.log(`${this.player.name} has no cards of the leading suit`);
      }
    }

    // Default strategy: play the highest-ranking card
    console.log("Using default strategy: play highest ranking card");
    return this.playHighestRankingCard(validPlays);
  }
}
