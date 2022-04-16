# Project Management Plan

## Project Wide Vision Statement
The aim of this project is to create an iOS application that can be used to record the moves made in chess tournaments. Tornelo is a company that hosts chess tournaments that are recognised by the world chess federation, and until recently the only approved method to record moves during games was to use paper and pen. Recently however, the world chess federation has approved the use of apps on mobile devices, and the goal of the project is to get the app endorsed by the federation for its use in official chess tournaments by Tornelo.

## Stakeholders
Our primary stakeholders are the Tornelo team, who will be deploying the app in their tournaments. The tournament invigilators and organizers will also be our stakeholders, as they will be relying on the application to record the moves made by players during the matches. This means the application needs to work correctly and be intuitive to use. The players in these tournaments will also be our stakeholders as they will rely on our app to work correctly so that their games are properly recorded. The World Chess Federation will also be a stakeholder of the project as they will be endorsing our final app and will rely on it to work properly.

## Sprint Planning Methodology
During our sprint planning sessions, the development team will meet with our product owner to determine which stories will be included in the next sprint. The Product owner will detail which user stories the team must implement in the coming sprint. The team will then ask questions about the story to ensure that everyone understands what must be done, and what the scope of the story is. The team will then estimate the story points of the story and any discrepancies will be addressed. This process will be repeated until enough stories have been added to the sprint to last the full duration. Once this process is completed, the team will then have an internal meeting where they will discuss the implementation details and break down the responsibilities of each team member.

## Sprint Review Methodology
During our sprint review meeting, the team and product owner will meet to review the progress of the previous sprint. The team will go through each user story one by one and demo the story in action. Once this is done the product owner will give their feedback, and we will then move on the next story. Once all stories have been discussed, the sprint can be finalized and the meeting is over.

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
- Facebook: for team member communication, such as asking quick questions and organising meetings.
- Slack: for more significant team member communication, such as announcements or discussing larger and more complex problems. 
- Email: for communicating with clients and supervisor to ask questions and/or organise meetings.
- Meetings (Zoom/in-person): meetings with client, supervisor or between team members. These meetings will be used for requirement gathering, sprint planning, retrospectives or to resolve larger and more complex issues that require a more in-depth discussion. 

Meetings will form an essential part of the project process, and will play a key role in the way all parties will stay in the loop. Meetings will likely be held in a mixture of online and/or in-person mode due to the client being located overseas, and some team members occasionally being unavailable for in-person meetings. It is expected that within the team meetings will be occurring more than once per week, client meetings should occur approximately once per fortnight, and meetings with the project supervisor to occur around once per month. During more formal meetings such as sprint planning and retrospectives, minutes should be noted down and made accessible to the entire team for future reference. 

## Process Information

This project will follow an adapted Agile methodology, which will involve sprint planning meetings, individual and team-based work during the sprint, and conclude with a retrospective session to reflect and improve upon the last sprint before beginning the next one. 

Due to being a university project and the team not always being available at the same time, this project agile method will omit daily stand-ups from the methodology. However, to compensate for this and not lose team awareness and focus, we will be using Slack to post updates on progress whenever a task is being completed or worked on, or if an issue is encountered. 

### Sprint Planning
Sprint planning meetings will be held on a fortnightly basis to prepare for the sprint. This will be used to work through and decide which backlog items to be worked on in the coming fortnight. It can also be used to allocate specific tasks or tickets to individual team members. If the client is involved, this is a good time to continue to gather and understand requirements. 

### Working During Sprint 
During the sprint, team members will work mostly independently or in small sub-teams on pre-allocated tasks. Progress or roadblocks should be posted to the Slack channel in lieu of daily stand ups to keep the entire team informed. 

### Retrospective
Retrospective sessions will be held by the team on a fortnightly basis. These meetings will identify what the team did well, what did not go well, and highlight any areas of confusion. Teams should document the outcomes and the possible improvements that can be made in the next sprint. If the client is involved, it is a good time to also perform some requirement validation to ensure the project is going in the right direction.  

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
