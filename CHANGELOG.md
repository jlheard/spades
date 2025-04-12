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
- Added specific tests for rule enforcement edge cases
- Added tests for card animation visibility and behavior
- Added support for asynchronous testing of animations
- Added better error reporting for test failures
- Added test fixtures for DOM testing
- Added documentation for Python server requirements for browser testing
- Added server configuration instructions to test files
- Added debug logging to rule enforcement logic
