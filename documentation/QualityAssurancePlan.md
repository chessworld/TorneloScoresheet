# Quality Assurance Plan

## Approach

All code that is committed to the repo should be accompanied by unit tests. Tests are automatically run through the CI pipeline (See 'CI / CD' below). The tests should cover all reasonable inputs/states, as well as any edge cases. If the behaviour/expected output for a function changes, the unit tests should be updated to reflect this. Code should not be merged into main if it does not have accompanying unit tests.

## Testing

### Unit Testing

For testing, the "Jest" library, along with "@testing-library/react-hooks" will be used for unit testing
functionality. This will ensure that functionality is implemented according to spec and that corner cases
are considered.

### Snapshot Testing

The "Jest" library will also be used for snapshot testing. This will allow the team to iterate on the code
without fear of unintentionally changing the UI.

All tests will be required to be passing in order for Pull Requests to be accepted into "main".

Each feature introduced should also include appropriate unit tests.

## GitHub Management Policies

### Branching

- Feature branches should be rebased to be up to date with "main" before being merged.
- Branch names should clearly describe what feature is being implemented and can optionally include the name of the developer implementing it.
- Any naming convention is acceptable as long as it is easily readable.
- Branches should not be merged to main until they have been approved by another developer and the CI/CD pipeline has successfully completed.

### Commit Rules

- Commit messages should be meaningful and describe what changes have been made.
- Each commit should be atomic, such that it makes a single, isolated change
- Each Pull Request should correspond to one feature / change

## Code Review

All Pull Requests for the project are to be reviewed before being merged.

The Code Review process involves the following:

1. The author describes the changes:

   1. Describe which of the story/requirement's acceptance criterias are fulfilled
   2. Include screenshots (if necessary)
   3. Any caveats or potential impact to other parts of the codebase

2. If necessary the author demonstrates and describes the code to the reviewer

3. The reviewer identifies issues and asks questions about the code. Things to look at (in order)

   1. Correctness - Does it work?
   2. Secure - Does it have glaring security holes like plaintext passwords?
   3. Readable - Can you clearly understand the code if the author disappears?
   4. Elegant - Does the code use well-known patterns? Is it concise?
   5. Altruist - Does the code leave the codebase better than what it was? It's better to do small-scale refactoring iteratively.
   6. (For more info, see https://www.dein.fr/posts/2015-02-18-maslows-pyramid-of-code-review)

4. The author answers questions and fixes issues as requested

5. When no more issues are identified, the branch is merged and deleted.

After the code is reviewed either:

- The branch is merged and deleted.
- The merge is declined. Small changes are requested

## Definition Of Done

The definition of done for any task is met when the following are complete:

- All the work meets the requirements specified on the Trello ticket
- A pull request has been made and approved by another team member
- Any relevant documentation has been completed.
- A description of the task, acceptance criteria, and the outcome is available on the Trello ticket

If the Trello ticket is code based, the following additional requirements need to be met:

- All code is functional and passes the CI/CD pipeline
- Any relevant test cases have been written
- The code is commented such that another developer on the team can understand what it does by reading it.
- The code has the correct syntax for the language being used, and syntax is consistent across the entire code base.
- The branch has been merged into main and deleted

When all the relevant points above have been fulfilled, the Trello ticket can be closed

## Trello Management Policies

The following Trello management policies should be implemented to minimuse mis-communication and enable effective collaboration across the team

### Epics

All large tasks (e.g assignments) should be created as epics. The epics should contain:

- a description of the task
- an acceptance criteria
- labels
- links to all stories invovled in that epic
- a due date (if applicable)

### Stories

Stories should be short requirements that are part of a larger Epic. A story should contain:

- A name that clearly defines what the task is
- A summary of the task (if not clear in the task name)
- Acceptance criteria (if not clear in the task name and summary)
- Labels (indicating both the epic and the level of priority)
- An assignee (if work is in progress)

Stories should be moved from the backlog into the current sprint during sprint planning. At the beginning of each sprint, stories will be assigned to team members depending on their availability. There should be no more than two people assigned to each development ticket, these will be the ticket owners. The ticket owners are responsible for the delivery of the task. Other (non-assigned) team members may also work on the ticket if they have permission from the owner.

As the developer works on the story, they should move the ticket through the 'Current Sprint', 'Doing', 'In Review' and 'Done' colums and add comments as needed. Stories should only be moved into the current sprint section during sprint planning.

## Artifacts

The following artifacts will be produced over the course of the year:

- Product Backlog (available on [Trello](https://trello.com/b/q6F86G6q/tornelo-scoresheet-app))
- Sprint Backlog (available on [Trello](https://trello.com/b/q6F86G6q/tornelo-scoresheet-app))
- The code base (available on the [GitHub repository](https://github.com/chessworld/scoresheet-app))
- The roadmap (available on the [GitHub repository](https://github.com/chessworld/scoresheet-app))
- Documentation including the Quality Assurance Plan (QAP), Project Management Plan (PMP) and Risk Register (available on the [GitHub repository](https://github.com/chessworld/scoresheet-app))
