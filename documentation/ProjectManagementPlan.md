# Project Management Plan

## Project Wide Vision Statement
The aim of this project is to create an iOS application that can be used to record the moves made in chess tournaments. Our client, Tornelo, is a company that provides a variety of services to support the organisation and running of chess tournaments. Recently, the International Chess Federation (FIDE) approved the use of digital recordkeeping. Our goal is to create an app that is endorsed for use by FIDE and can be used by Tornelo during chess tournaments. 

## Stakeholders
- Our primary stakeholder is the Tornelo team, who will be deploying the app in their tournaments.

- Arbiters and organizers will use our app during the tournament set up, requiring tablets displaying the correct game to be put on each table. These stakeholders will also rely on our app to record moves made by players, prevent cheating, and allow them to verify whether specific moves were legal.

- The chess players in these tournaments will rely on our app to work correctly so that their games are properly recorded. 

- The FIDE will also be a stakeholder of the project as they will be endorsing our final app and will rely on it to work properly.

## Sprint Retrospective Methodology
- During our sprint review meeting, all team members will summarise the work they completed during the sprint. 
- The team will then discuss and document what could have been improved and what went well. 
- The team should discuss possible solutions to problems encountered during the sprint, and create Trello tickets accordingly. 
- If needed, team documents (e.g QAP or PMP) should be updated to include any changes to team processes. 

## Sprint Planning Methodology
Upon completion of the sprint review, the team will plan the upcoming sprint as follows: 
1. The team will decide which tasks should be implemented. This will be done based on team availability and task priority. 
2. The team will estimate the tasks according to the story point table

| Story points | Description                                                                 | Time estimate |
|--------------|-----------------------------------------------------------------------------|---------------|
| 1            | Answering a question, quick investigation                                   | < 30 mins     |
| 2            | Copy text / very minor code edits                                           | < 1 hour      |
| 3            | Extensive docs / minor code edits                                           | < 3 hours     |
| 5            | Substantial work, like a sub-feature                                        | < 1 day       |
| 8            | Substantial work, with potentially unknown technology                       | < 2 days      |
| 13           | Too big, like a full feature. Break down the task or convert it to an epic. | Full sprint   |

3. At most two team members will be assigned to each development ticket.

- Immediately after our sprint planning sessions, the development team will meet with the product owner/client to showcase the work done in the previous sprint and get approval for the work in the upcoming sprint.
- If the client requests any changes, steps 1-3 above will be repeated until the client has approved the sprint backlog.

### Working During Sprint 
During the sprint, team members will work mostly independently or in pairs on pre-allocated tasks. Progress or roadblocks should be posted to messenger in lieu of daily stand ups to keep the entire team informed. If breaking changes are being made, the team should be informed in advance via Slack and Messenger.

## CI/CD Solutions
Our project will require a CI pipeline to perform the following tasks:
- Install our chess engine's dependancies
- Compile our chess engine
- Run the unit tests for our chess engine
- Install our app's node dependancies
- Install our app's pod dependancies
- Build our ios app
- Run the unit tests
- Run integration tests
- Deploy the app to the App Store

We have considered the following CI/CD tools:
- Gitlab
  - Advantages:
    - The pipelines are configured out of the box, so little configuration time is required, this allows the team to iterate faster.
    - Plug-ins and third party components are available to customize the pipeline quickly and easily (File Hooks).   
    - It can be run in self hosted servers (such as monash's)
  - Disadvantages
    - Using plug-ins couples the CI pipeline with  third party maintainers - if they are to stop maintaining the plug in, the pipeline may fail without notice.
    - The free tier provides little minutes per month
- GitHub Actions
  - Advantages
    - Integrated with our repository
    - Customizable CPU, GPU and memory for build machines
    - Configuration as code makes it easy for software engineers on the team to manage the configuration
  - Disadvantages
    - No support for third-party plug-ins
    - No ability to rerun jobs after failure

Because our repo is hosted in Github, it makes the most sense to host our CI/CD pipelines with Github actions, and we will therefore use it for our project
  
## Policies for Communication
Communication and keeping all stakeholders and team members informed is a priority for this project. This will help keep a consistent understanding of expectations across the project, decrease risks associated with experience disparities, and improve team efficiency. It can also help prevent bottlenecks that occur when there are a limited number of team members with the necessary knowledge and skills, or if there are other roadblocks that could be resolved. 

The key stakeholders that need to be kept informed are
- Team members (informed across all levels of the project, including low-level things, such as bugs or specific tasks).
- Client and client team (informed only about higher levels, like project requirements issues, overall project progress, high-level roadblocks such as issues accessing a database etc). 
- Supervisor (informed only about big-picture and project progress)

The methods for keeping all parties informed and up-to-speed with the project progress have been agreed upon as follows: 
- Facebook Messenger: for team member communication, such as asking quick questions and organising meetings. Team members should check this daily.
- Slack: for more significant team member communication, such as announcements or discussing larger and more complex problems. All pull requests should be posted in the dedicated Slack channel. Team members should check the Slack at least weekly.
- Email: for communicating with clients and supervisor to ask questions and/or organise meetings. Team members should check this at least weekly, Llio, who is responsible for client communication should check daily.
- Meetings (Zoom/in-person): meetings with client, supervisor or between team members. These meetings will be used for requirement gathering, sprint planning, retrospectives or to resolve larger and more complex issues that require a more in-depth discussion. Client and supervisor meetings will happen fortnightly. 

Meetings will form an essential part of the project process, and will play a key role in the way all parties will stay in the loop. Meetings will likely be held in a mixture of online and/or in-person mode due to the client preferring Zoom communication, and some team members occasionally being unavailable for in-person meetings. During more formal meetings such as sprint planning and retrospectives, minutes should be noted down and made accessible to the entire team for future reference. 

## Team Management
The team is following a modified version of the Agile methodology. As such, there are three main roles being used: product owner, scrum master, and developer. 

### Product Owner
The responsibilities of the product owner in this team include:
- Indicating the priority of different tasks
- Representing Tornelo's interests
- Communicating client needs and considerations
- Answering questions from the development team

The role of product owner has been assigned to David Cordover.

### Scrum Master
The responsibilities of the scrum master include:
- Facilitating the weekly stand-ups
- Monitoring scope creep 
- Running sprint planning and retrospectives each sprint

The team has nominated Malo Hamon for this role.

### Developer
The responsibilities of a developer include:
- Estimating task difficulty
- Management and planning of tasks
- Reporting on progress
- Monitoring pull requests

All team members will act as developers for the duration of the project.
