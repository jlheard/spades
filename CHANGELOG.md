# Changelog

All notable changes to the Spades project will be documented in this file.

## [Unreleased]

### Fixed
- Fixed incorrect card rank comparison in PlayStrategy methods by using getRankValue instead of direct string comparison
- Fixed issue where computer players weren't following suit by correctly determining the leading suit from the playerForPlayedCardMap
- Fixed critical bug where human player's hand wasn't updating correctly when a computer player led a trick, allowing invalid plays
- Fixed incorrect card comparison logic that sometimes caused lower-ranked cards to incorrectly win tricks
- Fixed card comparison logic to correctly handle spades and jokers, ensuring Ace of Spades beats King of Spades, Queen of Spades beats 2 of Spades, and jokers beat all other cards
- Fixed bug where computer players were playing more than one card per turn, causing them to run out of cards prematurely
- Fixed game crash that occurred when players had 5 or fewer cards in their hand
- Added comprehensive error handling to prevent null reference errors
- Added integration tests for leading suit validation and card comparison to prevent regression

### Changed
- Migrated testing framework from custom solution to QUnit
- Rewrote integration tests for trick flow and animation
- Improved test reliability for DOM interactions
- Enhanced winning card animation with "WINNER" label and improved visibility
- Changed hand sorting to display cards in descending order (highest value first) to match how most players read cards from left to right

### Fixed
- Fixed critical bug where spadesBroken flag was incorrectly reset after each trick, causing valid plays to run out
- Moved spadesBroken state from Turn to Game class for better architectural design and state persistence

### Future Considerations
- Consider implementing a dedicated GameState engine to manage all game state in a centralized, consistent manner

### Additional Fixes
- Fixed rule enforcement bug: Players can now play spades when they don't have the leading suit
- Fixed card value display during winning animation
- Fixed integration tests for "Complete trick flow with rule enforcement"
- Fixed integration tests for "Winning card determination and animation"
- Simplified rule logic in LegalPlayRules.js for better maintainability

### Added
- Added comprehensive QUnit unit tests for core components:
  - Card class tests with full coverage of all methods and edge cases
  - Deck class tests for initialization, shuffling, and dealing
  - Hand class tests for card management and legal play determination
  - LegalPlayRules tests for all rule combinations and edge cases
  - CardComparer tests for trick winning determination
- Added specific tests for rule enforcement edge cases
- Added tests for card animation visibility and behavior
- Added support for asynchronous testing of animations
- Added better error reporting for test failures
- Added test fixtures for DOM testing
- Added documentation for Python server requirements for browser testing
- Added server configuration instructions to test files
- Added debug logging to rule enforcement logic
- Added comprehensive integration tests:
  - Game initialization tests for proper setup and card dealing
  - Spades breaking rule tests for correct rule enforcement
  - Trick winning logic tests for various card combinations
  - Player strategy tests for AI decision-making
  - Unusual card distribution tests for edge cases
  - Error handling tests for invalid plays and state changes
- Added testing-notes.md documentation with specific guidance for testing the Spades game implementation
- Added documentation about joker naming conventions and test reliability
- Added guidance on refreshing the page to ensure tests pass consistently

### Fixed
- Fixed joker card creation in trickWinning.test.js to use correct rank names ('BigJoker' and 'ExtraJoker')
- Updated gameRules.md to clarify the naming discrepancy between documentation and code implementation
- Enhanced testing-notes.md with specific examples of correct joker card creation
- Fixed timing issues in animation tests by increasing timeouts
- Improved DOM cleanup in gameInitialization.test.js using try/finally blocks
- Enhanced SmartPlayStrategy to properly handle partner-winning scenarios
- Fixed joker card creation in unusualDistributions.test.js to use correct rank names
- Fixed computer players not following suit by correcting leading card determination in Turn.js
- Improved PlayStrategy implementation to prioritize following suit when possible
- Added extensive logging to help diagnose gameplay issues
