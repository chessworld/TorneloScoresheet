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


## Proposed 1st iteration
- 4 Modes of operation implemented with basic features in all
  - Arbiter mode:
    - Able to enter url to get PGN file for this round of the tournament
    - Able to assign each ipad with a table number
  - Table Pairing mode:
    - Display upcomning games with basic info (player names, nationalities, table number)
    - Able to start the game
  - Recording mode:
    - Players able to click and drag the chess pieces to record their moves
  - Results display:
    - Results are shown
    - Players/arbiter able to generate a PGN file and send it to email addresses

## Proposed 2nd iteration
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
  - Results display:
    - Results are shown
    - Players/arbiter able to generate a PGN file and send it to email addresses

## Proposed 3rd iteration
  - Arbiter mode:
    - Able check the legality of moves
  - Table Pairing mode:
    - 
  - Recording mode:
    - Implement draw request
    - Implement editing moves
    - Move counter
    - Lock app if app is switched
    - 
  - Results display:

## Proposed 4th iteration
  - Arbiter mode:
    - Threefold rule etc
  - Table Pairing mode:
    - 
  - Recording mode:
    -  Record check
    -  Record En Passant
    -  Record Castleing
    -  Record Captures
    - 
  - Results display:






