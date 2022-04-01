# Road Map

## MVP Goals/Mission Statement
The main goal of the MVP is to implement the required feature set to gain FIDE approval. The MVP will be missing key networking capabilities, and will mostly be a client-only, offline implementation. Thus, there won’t be much integration with existing Tornelo infrastructure - this can be saved for after FIDE approval.
At a high level, the goals of the MVP are:
- Client UI in line with existing Tornelo style guide
- Deployment to the App Store
- An implementation of the four modes outlined under `Business Requirements`
- Conformance with the FIDE guidelines
- Read from PGN to configure tournament
- Write to PGN when a move is made / ability to serialise game as PGN


## Proposed 1st iteration (28/04)
- 4 Modes of operation implemented with basic features in all
  - Arbiter mode:
    - Able to enter url to get PGN file for this round of the tournament
    - Able to assign each ipad with a table number
  - Table Pairing mode:
    - Display upcomning games with basic info (player names, nationalities, table number)
    - Able to start the game
  - Recording mode:
    - Players see the chess board with the tornelo pieces 
    - Players able to click and drag the chess pieces to record their moves
  - Results display:
    - Results are shown
    - Players/arbiter able to generate a PGN file and send it to email addresses

## Proposed 2nd iteration (26/May)
  - Arbiter mode:
    - Able to create a security pin 
    - Able to use security pin to cycle between modes
  - Table Pairing mode:
    - Add extra info in pairing mode (ELO, rankings)
    - Improve UI
  - Recording mode:
    - Implemnt scrollable list of past moves 
    - Implement skipping turn funtions
    - Implement clock time functionality

## Uni holidays 30 May - 25 July

## Proposed 3rd iteration (18/August)
  - Arbiter mode:
    - Able check the legality of moves
  - Recording mode:
    - Implement draw request
    - Implement editing moves
    - Move counter
  - Other
    - Battery life   
    - Lock app if app is switched

## Proposed 4th iteration (15/September)
  - Arbiter mode:
    - Threefold rule, 50 rule move, 75 move rule etc
    - Login as arbiter using tornelo API?
    - Download PGN File automatically using tournament ID
  - Recording mode:
    -  Record check
    -  Record En Passant
    -  Record Castleing
    -  Record Captures 
  - Owner Mode:
    - Add customisability features 
  - Other:
    - Ensure app works well on multiple devices


## Final Work
- Check every Regulation requirement 1 by 1
- Iron out all Bugs
- Connect to tornello APIs ?






