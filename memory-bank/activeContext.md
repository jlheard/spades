# Active Development Context

## Current Focus

We've made progress on improving the user experience by changing the hand sorting to display cards in descending order (highest value first), which matches how most players naturally read their hand from left to right. This change has been documented in CHANGELOG.md, README.md, and docs/gameRules.md.

We've identified a critical bug in the spades breaking logic. The spadesBroken flag is incorrectly reset to false at the end of each trick in turn.js, which contradicts the game rules. Once spades are broken, they should remain broken for the rest of the game.

We're implementing an architectural improvement by moving the spadesBroken state from the Turn class to the Game class, which is a more appropriate location for game-wide state that persists across turns.

In the future, we may consider implementing a dedicated GameState engine to manage all game state in a centralized manner, but for now, moving the state to the Game class is a pragmatic improvement that addresses the immediate issue.

The immediate goal is to continue addressing specific gameplay issues identified during testing. We've successfully migrated to QUnit for testing, but have discovered two critical issues that need to be fixed:

1. **Rule Enforcement Bug**: Players cannot play spades when they don't have the leading suit (clubs), which contradicts the game rules.
2. **UI/Animation Issue**: The winning card animation works, but the value of the card isn't displayed properly.

We will prioritize fixing the rule enforcement issue first, followed by the UI/animation improvements.

### Specific Issues Identified

1. **Rule Enforcement Issue**:
   - When East player plays a King of Clubs
   - Human player has no Clubs in their hand
   - Spades are incorrectly grayed out (invalid play) when they should be valid options
   - According to game rules: "If a player has no cards in the suit led, they may play any card, including jokers and spades"

2. **UI/Animation Issue**:
   - When East player wins a book
   - The winning animation (gold glow and pulse) works correctly
   - But the card value doesn't display properly during the animation
   - Integration test #14 "Animation works for all player positions" is failing

## Implementation Plan

### Phase 1: Complete Unit Test Suite

We'll create a comprehensive set of unit tests for each core component, ensuring we test all public methods and key functionality:

#### 1. Core Component Testing
- **Card & Deck Tests**:
  - Test card creation, comparison, and validation
  - Test deck creation, shuffling, and dealing

- **LegalPlayRules Tests**:
  - Test all rule combinations (leading, following, spades broken/not broken)
  - Test edge cases for rule enforcement
  - Verify correct behavior when player has no cards of the leading suit

- **Hand Tests**:
  - Test card management (adding/removing cards)
  - Test sorting functionality
  - Test legal play determination with various hand configurations

- **Player Tests**:
  - Test hand population and UI representation
  - Test valid/invalid play determination
  - Test team assignment and scoring

- **Turn Tests**:
  - Test turn progression
  - Test card playing logic
  - Test trick completion and winner determination

#### 2. Manual Test Verification
- Create a checklist of all public methods in each class
- Ensure each method has at least one test case
- Add temporary console logging to track method execution
- Create visual test pages that demonstrate specific functionality

### Phase 2: Rule Enforcement Fix (Priority)

#### 1. Diagnostic Testing
- Create `js/test/qunit/ruleEnforcement.test.js` with specific test cases:
  - Test playing spades when player has no cards of the leading suit
  - Test playing other suits when player has no cards of the leading suit
  - Test the UI state (valid/invalid classes) for these scenarios
- Add logging to key functions to track values during gameplay:
  - `LegalPlayRules.isCardLegalToPlay()`
  - `Hand.getLegalPlaysMap()`
  - `Player.populateHandElement()`

#### 2. Fix Implementation
- Fix the rule enforcement logic:
  - Ensure `handDoesNotHaveLeadingSuit` is correctly determined
  - Verify the logic in `LegalPlayRules.isCardLegalToPlay()` for playing spades
  - Check how `validPlays` are determined in `Player.populateHandElement()`
- Implement a more robust validation system:
  - Create a `ValidationResult` class with reason codes and messages
  - Update `LegalPlayRules` to return these detailed results
  - Ensure UI properly reflects these validation results

#### 3. Verification
- Create a specific test HTML file that focuses on this scenario
- Implement a simplified game setup that consistently reproduces the issue
- Verify the fix works in both test and actual gameplay

### Phase 3: UI/Animation Improvements

#### 1. Card Animation Diagnostics
- Fix the failing integration test #14 "Animation works for all player positions"
- Create `js/test/qunit/cardAnimation.test.js` with test cases for:
  - Card content visibility during animation
  - Animation highlighting for the winning card
  - Animation behavior for all player positions

#### 2. Animation Improvements
- Enhance the winning card animation:
  - Ensure card content (rank and suit) remains visible
  - Add a "Winner" label or icon to the winning card
  - Improve the visual distinction of the winning card
- Implement a card value display enhancement:
  - Add a larger, centered display of the winning card value
  - Ensure consistent rendering across different card ranks and suits

### Phase 4: Integration Tests

- Create comprehensive integration tests for common gameplay scenarios
- Test the interaction between multiple components
- Verify that all components work together correctly
- Test edge cases and unusual card distributions

## Technical Approach

### Rule Enforcement Fix

The core issue appears to be in how legal plays are determined. We'll focus on:

1. **Debugging the Legal Play Logic**:
   - Verify that `handDoesNotHaveLeadingSuit` is correctly calculated
   - Ensure the condition for playing spades when not having the leading suit is working
   - Check that the UI correctly reflects the legal plays

2. **Test-Driven Development**:
   - Create QUnit tests that specifically test the edge case
   - Use these tests to verify the fix works correctly
   - Add integration tests that simulate the full gameplay scenario

3. **Code Improvements**:
   - Enhance error handling and logging
   - Improve the validation logic to be more robust
   - Add comments explaining the rule enforcement logic

### UI/Animation Improvements

For the animation issues, we'll focus on:

1. **CSS Enhancements**:
   - Ensure card content remains visible during animations
   - Add better visual indicators for the winning card
   - Improve the animation timing and effects

2. **DOM Structure Improvements**:
   - Ensure consistent card element structure
   - Add specific classes for animation states
   - Improve the z-index and positioning of animated elements

## Success Criteria

1. **Rule Enforcement**:
   - All tests pass, including the new edge case tests
   - In actual gameplay, players can play spades when they don't have the leading suit
   - The UI correctly shows which cards are valid plays

2. **UI/Animation**:
   - Card values are clearly visible during animations
   - The winning card is prominently highlighted
   - Animations provide clear feedback about game state

## Next Steps After Completion

Once these issues are fixed, we'll focus on:
1. Migrating the remaining tests to QUnit
2. Implementing additional gameplay features
3. Improving overall game performance and user experience
