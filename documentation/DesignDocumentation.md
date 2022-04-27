# Design Documentation

### Choice of Software

#### Swift
- Because the client is only intrested in creating an iOS application, an obvious candidate framework would be swift.
  - Advantages
    - native to iOS
    - Rapid development
  - Disadvantages
    - Requires compilation in mac environment
    - Team is unfamiliar
    - Poor tooling in windows
- Since not all members of the team are working on macs, swift programming was determined to not be the best solution.

#### React Native
- React native is a popular framework for developping cross plarform apps, it is compatible with windows and has a wide support base.
  - Advantages
    - Team is familiar with react
    - Ability to use Typescript 
    - Live reloading
  - Disadvantages 
    - Difficult to debug
- Due to the team's familiarity with React, React native is an obvious choice for our app


#### Flutter
- Flutter is a cross platform app development framework by Google written in Dart.
  - Advantages
    - Growing popularity
    - Strong community 
  - Disadvantages 
    - Team is unfamiliar with Dart language
    - Limited tools and libraries
    - Large file sizes and slow build times
- Given the team is unfamiliar with the Dart language, Flutter is not the best solution however it remains as a strong candidate 


#### Xamarin
- Xanarin is a Microsoft framework for developping cross plarform apps, it is compatible with windows and is written in C#.
  - Advantages
    - Cross platform development
    - Many free packages available  
  - Disadvantages 
    - Poor tooling availability in mac environments
    - Team is unfamiliar with C# 
    - Proprietary
- Due to some of the team's unfamiliarity with C# and the poor tooling available on macs, we will not opt for a Xamarin solution
