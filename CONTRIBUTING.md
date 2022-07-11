# Contributing Guidelines

Thank you for showing interest in contributing to the Tornelo Scoresheet code base!

This file contains some high level guidelines for getting started and rules that should be followed when reviewing pull requests.

## 1. Style Guidelines 

  1. All style components should be in a different file (excluding text styling which should be placed inline for ease of understanding)
  2. The Text component should never be used, all text should be formatted using PrimaryText
  3. All colours used in the project should be added to `colours.ts` -> no inline colours
    
## 2. Return Values

  1. Repeated HTML should be implemented as a component.
  2. There should be a single return statement from each component
  3. It is preferable to have early return statements on bad conditions

## 4. Commits

  1. Commit messages should be atomic
  2. Each commit message should clearly describe:
    - What it changes
    - What the goal/motivation of the changes are
    - Any necessary justification for why a particular approach/implementation was used

## 5. Pull Request Guidelines

  1.  Only pull requests that are up to date with `main` and have a linear history will be accepted
  2.  Run `eslint` and `prettier` on commits before opening pull requests
  3.  Pull requests should focus on a single feature/change
 
## 6. Code Guidelines 

  1.  Expressions are preferred over statements unless it severely reduces readability (e.g. prefer `expr ? 0 : 1` over `if (expr) { return 0; } else { return 1; }' 
  2. Props should never be mutated
  3. Side effects should be avoided
  4. Mutation should be avoided
  5. Each Component should only have one block of `JSX`
  6. Prefer [short hand object initialisation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer) (e.g. prefer `{ a }`     over `{ a: a }`)
  7. Prefer `array.prototype.map` over raw for loops
  8. Avoid `else` statements unless they add clarity/readability
  9. Types should reflect the concept they represent as strictly as possible (e.g. prefer `type Players = { white: Player, black: Player }` over `type Players =  Player[]`)
  10. Function naming should be in the format of onEvent = {handleEvent}
 
## 7. Naming Guidelines 
  
  1. Prefer clear, descriptive names over short names (e.g. `chessBoardUid` should be preferred over `uid`)
  2. Variables referring to colours should use the 'colour' spelling (as opposed to color)
  
 ## 8. General Guidelines 

  1. No abbreviations  
