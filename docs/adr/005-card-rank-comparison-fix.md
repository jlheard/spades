# [ADR-005] Card Rank Comparison Fix

## Status
Accepted

## Context
The Spades game was experiencing issues with card comparison logic, particularly in the PlayStrategy class. The problem was that card ranks were being compared directly as strings (e.g., `a.rank - b.rank` or `card.rank < minCard.rank`), which is incorrect because:

1. Rank is a string, not a number, so direct mathematical operations like subtraction don't work correctly
2. String comparison doesn't respect the card rank hierarchy (e.g., "10" would be considered less than "2" in lexicographical ordering)

This was causing incorrect card selection in various strategy methods:
- `throwLowestRankingCard`
- `throwLowestCardInCutSuit`
- `playHighestCardInLeadSuit`
- `playHighestRankingCard`

These issues were manifesting in gameplay as computer players not following suit when they should, and incorrect cards being selected for play, leading to unexpected behavior and failing integration tests.

## Decision
We decided to modify all card rank comparison methods in the PlayStrategy class to use the existing `getRankValue` method, which correctly maps rank strings to numeric values. This method was already defined in the class but wasn't being used consistently.

The specific changes were:

1. Update `throwLowestRankingCard` to use `this.getRankValue(a.rank) - this.getRankValue(b.rank)` for sorting
2. Refactor `throwLowestCardInCutSuit` to use sorting with `getRankValue` instead of direct rank comparison
3. Refactor `playHighestCardInLeadSuit` to use sorting with `getRankValue` instead of direct rank comparison
4. Update `playHighestRankingCard` to use `this.getRankValue(b.rank) - this.getRankValue(a.rank)` for sorting

## Consequences

### Positive
- Computer players now correctly select cards based on their rank value
- Computer players now properly follow suit when they have cards of the leading suit
- Integration tests for card comparison now pass correctly
- The code is more consistent, using the same rank comparison method throughout
- The fix is isolated to the PlayStrategy class, minimizing the risk of introducing new bugs

### Negative
- None identified. The changes are straightforward and don't introduce any new complexity or dependencies.

## Implementation Plan
1. Update the `throwLowestRankingCard` method to use `getRankValue` for sorting
2. Refactor the `throwLowestCardInCutSuit` method to use sorting with `getRankValue`
3. Refactor the `playHighestCardInLeadSuit` method to use sorting with `getRankValue`
4. Update the `playHighestRankingCard` method to use `getRankValue` for sorting
5. Update the CHANGELOG.md to document the changes
6. Run integration tests to verify the fix works correctly
