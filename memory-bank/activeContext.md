# Active Development Context

## Current Focus

The immediate goal is to ensure the **Spades game rules function correctly** during actual gameplay — not just in tests. While many unit tests are passing, the in-game experience reveals multiple issues that need to be addressed. 

This phase focuses on bringing the rules and gameplay behavior in line with expectations as described in code comments and prior discussions.

### Problems Observed During Gameplay

- **Cards disappear too quickly** after being played, making it hard to see what was just played.
- **Human player can make illegal plays**, even when the rules should prevent them.
- **Rules enforcement** does not match what is commented or expected.
- **Inappropriate plays are allowed** — for example, not following suit when required, or leading with spades before they're broken.

## Next Steps

1. **Write valid integration tests** that simulate actual in-game card sequences and interactions to catch rule-breaking behaviors that unit tests may miss.
2. **Fix the rules engine** so that it behaves as expected during real play — particularly around card validation and turn progression.
   - The file `docs/gameRules.md` contains the canonical list of gameplay rules to be enforced during development.
3. **Improve playability**:
   - Visually show which cards were just played before they disappear.
   - Implement timing or transitions to give players feedback.
   - Provide better feedback or blocking for invalid plays.
4. **Enforce correct rules for human player moves**, particularly:
   - Cannot play out of turn
   - Must follow suit if possible
   - Cannot lead with Spades unless broken

## Additional Context

A set of valid rules was provided earlier in this project context. These rules are important for enforcing proper Spades gameplay and may need to be:
- Added to the rules engine (possibly `rules.js`)
- Documented in a permanent shared config or reference file (e.g., `ruleset.md` or `gameRules.json`)
- Referenced by both the logic engine and UI feedback system

## Technical Stack

- **Frontend:** HTML5, JavaScript
- **Tests:** Custom framework in `js/test/`
- **Game Logic:** Spread across multiple modules (Cards, Player, Turn Manager, Rules, etc.)

## Cline Role

Cline is expected to:
- Identify mismatches between tests and gameplay
- Help fix rule enforcement bugs
- Guide integration test development
- Propose UI changes to improve play feedback and experience
- Eventually support multiplayer upgrades (future phase)
