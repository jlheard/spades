import { compareCardsForTurn } from "../../cardComparer.js";

export class PlayStrategy {
    constructor(player) {
        this.player = player;
    }

    playCard(playerForPlayedCardMap, leadingCard, spadesBroken) {
        const leadingSuit = leadingCard ? leadingCard.suit : null;
        const validPlaysMap = this.player.hand.getLegalPlaysMap(leadingSuit, spadesBroken);
        const validPlays = Array.from(validPlaysMap.values());

        // Choose a card to play based on the computer player's strategy
        const cardToPlay = this.chooseCardToPlay(validPlays, playerForPlayedCardMap, leadingCard);

        // Remove the played card from the computer player's hand
        this.player.hand.removeCard(cardToPlay);

        return cardToPlay;
    }

    chooseCardToPlay(validPlays, playerForPlayedCardMap, leadingCard) {
        // If there are no valid plays, return null
        if (!validPlays || validPlays.length === 0) {
            console.log("No valid plays available");
            return null;
        }
        
        // Log the valid plays for debugging
        console.log(`Valid plays for ${this.player.name}:`, validPlays.map(card => `${card.rank} of ${card.suit}`).join(', '));
        
        // If there's a leading card, prioritize following suit
        if (leadingCard) {
            const leadingSuit = leadingCard.suit;
            console.log(`Leading suit is ${leadingSuit}`);
            
            // Filter cards that match the leading suit
            const suitMatchingCards = validPlays.filter(card => card.suit === leadingSuit);
            
            // If we have cards of the leading suit, play one of those
            if (suitMatchingCards.length > 0) {
                console.log(`${this.player.name} has ${suitMatchingCards.length} cards of the leading suit`);
                
                // Sort by rank (lowest to highest) and play the lowest card that follows suit
                suitMatchingCards.sort((a, b) => this.getRankValue(a.rank) - this.getRankValue(b.rank));
                return suitMatchingCards[0];
            } else {
                console.log(`${this.player.name} has no cards of the leading suit`);
            }
        }
        
        // If no leading card or no cards of the leading suit, play strategically
        // For now, just play the lowest card to avoid wasting high cards
        validPlays.sort((a, b) => this.getRankValue(a.rank) - this.getRankValue(b.rank));
        return validPlays[0];
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

    throwLowestRankingCard(validPlays) {
        // Sort the valid plays in ascending order based on rank
        const sortedPlays = validPlays.sort((a, b) => a.rank - b.rank);

        // Choose the lowest-ranking card from the sorted plays
        const chosenCard = sortedPlays[0];

        return chosenCard;
    }

    partnerHasCutAndWillWin(partnerCard, playerForPlayedCardMap) {
        // Check if partner has cut a player (played a spade) and will win the turn
        const lastPlayedCard = Array.from(playerForPlayedCardMap.keys()).pop();
        return partnerCard.suit === 'Spades' && partnerCard !== lastPlayedCard && partnerCard === compareCardsForTurn(playerForPlayedCardMap);
      }      

    throwLowestCardInCutSuit(validPlays, partnerCard) {
        // Find the lowest-ranked card in the cut suit (spades)
        const cutSuitCards = validPlays.filter(card => card.suit === 'Spades');
        const lowestCutCard = cutSuitCards.reduce((minCard, card) => card.rank < minCard.rank ? card : minCard);

        // If there are cut suit cards, play the lowest-ranked card
        if (lowestCutCard) {
            return lowestCutCard;
        }

        // If there are no cut suit cards, find the lowest-ranked card in another suit
        const nonCutSuitCards = validPlays.filter(card => card.suit !== 'Spades');
        const lowestNonCutCard = nonCutSuitCards.reduce((minCard, card) => card.rank < minCard.rank ? card : minCard);

        return lowestNonCutCard;
    }

    partnerLeadsWithLastOpponent(partnerCard, playerForPlayedCardMap) {
        // Check if partner leads with the only opponent left to play
        if (partnerCard) {
            const winningCard = compareCardsForTurn(playerForPlayedCardMap);
            return winningCard === partnerCard; // Partner leads if partnerCard is the winning card
        }

        return false;
    }


    playHighestCardInLeadSuit(validPlays, leadingCard) {
        // Find the highest-ranked card in the leading suit
        const leadSuitCards = validPlays.filter(card => card.suit === leadingCard.suit);
        const highestLeadCard = leadSuitCards.reduce((maxCard, card) => card.rank > maxCard.rank ? card : maxCard);

        return highestLeadCard;
    }

    playHighestRankingCard(validPlays) {
        // Sort the valid plays in descending order based on rank
        const sortedPlays = validPlays.sort((a, b) => b.rank - a.rank);

        // Choose the highest-ranking card from the sorted plays
        const chosenCard = sortedPlays[0];

        return chosenCard;
    }

    getPartnerCard(playerForPlayedCardMap) {
        const team1Player = this.getTeamPlayer(playerForPlayedCardMap, 1);
        const team2Player = this.getTeamPlayer(playerForPlayedCardMap, 2);

        if (team1Player && team2Player) {
            return playerForPlayedCardMap.get(team2Player);
        }

        return null;
    }


    getTeamPlayer(playerForPlayedCardMap, team) {
        for (const [player, card] of playerForPlayedCardMap.entries()) {
            if (player.team === team) {
                return player; // Return the player object
            }
        }
        return null; // Return null if no player from the team is found
    }


    getWinningPlayer(playerForPlayedCardMap) {
        const winningCard = compareCardsForTurn(playerForPlayedCardMap);
      
        for (const [card, player] of playerForPlayedCardMap.entries()) {
          if (card === winningCard) {
            return player;
          }
        }
      
        return null; // Return null if no winning player is found
      }


}
