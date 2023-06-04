import { compareCardsForTurn } from "../../cardComparer.js";

export class PlayStrategy {
    constructor(player) {
        this.player = player;
    }

    playCard(playedCards, leadingCard, spadesBroken) {
        const leadingSuit = leadingCard ? leadingCard.suit : null;
        const validPlaysMap = this.player.hand.getLegalPlaysMap(leadingSuit, spadesBroken);
        const validPlays = Array.from(validPlaysMap.values());

        // Choose a card to play based on the computer player's strategy
        const cardToPlay = this.chooseCardToPlay(validPlays, playedCards, leadingCard);

        // Remove the played card from the computer player's hand
        this.player.hand.removeCard(cardToPlay);

        return cardToPlay;
    }

    chooseCardToPlay(validPlays, playedCards, leadingCard) {
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

    partnerHasCutAndWillWin(partnerCard, playedCards) {
        // Check if partner has cut a player (played a spade) and will win the turn
        const lastPlayedCard = Array.from(playedCards.values()).pop();
        return partnerCard.suit === 'Spades' && partnerCard !== lastPlayedCard && partnerCard === compareCardsForTurn(Array.from(playedCards.values()));
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

    partnerLeadsWithLastOpponent(partnerCard, playedCards) {
        // Check if partner leads with the only opponent left to play
        if (playedCards.length === 1 && partnerCard) {
            const lastOpponentCard = Array.from(playedCards.values())[0];
            const winningCard = compareCardsForTurn([partnerCard, lastOpponentCard]);
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

    getPartnerCard(playedCards) {
        const team1Player = this.getTeamPlayer(playedCards, 1);
        const team2Player = this.getTeamPlayer(playedCards, 2);

        if (team1Player && team2Player) {
            return playedCards.get(team2Player);
        }

        return null;
    }


    getTeamPlayer(playedCards, team) {
        for (const [player, card] of playedCards.entries()) {
            if (player.team === team) {
                return player; // Return the player object
            }
        }
        return null; // Return null if no player from the team is found
    }


    getWinningPlayer(playedCards) {
        let winningCard = compareCardsForTurn(Array.from(playedCards.values()));
        for (const [player, card] of playedCards.entries()) {
            if (card === winningCard) {
                return player;
            }
        }
        return null; // Return null if no winning player is found
    }


}
