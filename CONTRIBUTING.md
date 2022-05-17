# Contributing Guidelines

Thankyou for showing interest in contributing to the Tornelo Scoresheet code base!

This file contains some high level guidelines for getting started. Anybody is welcom...

## Text Formatting

No pull request should be approved if it uses the <Text> component, all text should be formatted using <PrimaryText> which has been made to align with Tornelo branding.

## Style Formatting

All style components should be in a different file (excluding text styling which should be placed inline for ease of understanding).

## Return Values

Repeated HTML should be implemented as a different component.

- Commit messages should be atomic
- Only PRs that are up to date with `main` and have a linear history will be accepted
- Run `eslint` and `prettier` on commits before opening PRs
- PRs should focus on a single feature/change
- Each commit message should clearly describe:
  - What it changes
  - What the goal/motivation of the changes are
  - Any necessary justification for why a particular approach/implementation was used
- Always prefer expressions over statements (unless it severely reduces readability) (e.g. prefer `expr ? 0 : 1` over `if (expr) { return 0; } else { return 1; }`)
- Never mutate a prop
- Avoid side effects
- Avoid mutation
- All colours used in the project should be added to `colours.ts` -> no inline colours
- There should be a single return statement from each Component
- Each Component should only have one block of `JSX`
- Prefer [short hand object initialisation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer) (e.g. prefer `{ a }` over `{ a: a }`)
- Prefer clear, descriptive names over short names (e.g. `chessBoardUid` should be preferred over `uid`)
- No abbreviations
- Prefer `array.prototype.map` over raw for loops
- Avoid `else` statements unless they add clarity/readability
- Prefer early return statements on bad conditions
- Types should reflect the concept they represent as strictly as possible (e.g. prefer `type Players = { white: Player, black: Player }` over `type Players = Player[]`)
