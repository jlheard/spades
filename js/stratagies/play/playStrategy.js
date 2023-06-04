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
        // Implement your smart player strategy here
        // Use the information of played cards and the leading card to make a strategic decision
        // Consider factors such as card valuation, suit management, trump management, trick-taking estimation, and risk assessment
        // Analyze the game state, remaining cards, and opponent behavior to determine the best card to play

        // Placeholder implementation: Randomly choose a card from the valid plays
        const randomIndex = Math.floor(Math.random() * validPlays.length);
        return validPlays[randomIndex];
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
