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
  


