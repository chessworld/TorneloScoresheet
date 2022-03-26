# Quality Assurance Plan

## Approach

## Testing

## GitHub Management Policies

## Continuous Integration/Continuous Deployment

## Code Review

All Pull Requests for the project are to be reviewed before being merged.

The Code Review process involves the following:
1. The author demonstrates and describes the code to the reviewer
2. The reviewer asks questions about the code
3. The reviewer identifies issues

After the code is reviewed either:
- The code is merged
- The merge is declined
- Minor changes are made and the code is rereviewed

## Definition Of Done

The definition of done for any task is met when the following are complete:

* All the work meets the requirements specified on the Trello ticket
* A pull request has been made and approved by another team member
* Any relevant documentation has been completed.
* A description of the task, acceptance criteria, and the outcome is available on the Trello ticket

If the Trello ticket is code based, the following additional requirements need to be met:

* All code is functional and passes the CI/CD pipeline
* Any relevant test cases have been written
* The code is commented such that another developer on the team can understand what it does by reading it.
* The code has the correct syntax for the language being used, and syntax is consistent across the entire code base.
* All code has undergone testing (black box, integration, system or acceptance depending on what the deliverable is)	
* The Trello ticket contains a link to the pull request 
* The branch has been merged into main and deleted

When all the relevant points above have been fulfilled, the Trello ticket can be closed

## Trello Management Policies 
The following Trello management policies should be implemented to minimuse mis-communication and enable effective collaboration across the team

### Epics
All large tasks (e.g assignments) should be created as epics. The epics should contain:
* a description of the task
* an acceptance criteria
* labels
* links to all stories invovled in that epic
* a due date (if applicable)

### Stories
Stories should be short requirements that are part of a larger Epic. A story should contain:
* A name that clearly defines what the task is
* A summary of the task
* An acceptance criteria
* Labels (indicating both the epic and the level of priority)
* A link to the branch where the work is being commited 
* An assignee (if work is in progress) 
* A description of the outcome (when completed)

Stories should be moved from the backlog into the current sprint during sprint planning. All stories will initially be unassigned, and team members should assign stories to themselves as needed. This prevents developers being blocked and unable to pick up any new work. It also allows team members to take on work according to their current capacity. 

As the developer works on the story, they should move the ticket through the 'Current Sprint', 'Doing', 'In Review' and 'Done' colums and add comments as needed. When a code review is completed, the ticket should be updated to indicate who performed the review and the outcome. Stories should only be moved into the current sprint section during sprint planning. 

## Artifacts
The following artifacts will be produced over the course of the year:
* Product Backlog (available on [Trello](https://trello.com/b/q6F86G6q/tornelo-scoresheet-app))
* Sprint Backlog (available on [Trello](https://trello.com/b/q6F86G6q/tornelo-scoresheet-app))
* The code base (available on the [GitHub repository](https://github.com/chessworld/scoresheet-app))
* The roadmap (available on the [GitHub repository](https://github.com/chessworld/scoresheet-app))
* Documentation including the Quality Assurance Plan (QAP), Project Management Plan (PMP) and Risk register (available on the [GitHub repository](https://github.com/chessworld/scoresheet-app))


