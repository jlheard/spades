# Changelog

All notable changes to the Spades project will be documented in this file.

## [Unreleased]

### Changed
- Migrated testing framework from custom solution to QUnit
- Rewrote integration tests for trick flow and animation
- Improved test reliability for DOM interactions
- Enhanced winning card animation with "WINNER" label and improved visibility

### Fixed
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
