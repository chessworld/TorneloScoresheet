# Tornelo Scoresheet App

A Chess Scoresheet App for iOS.


## Development:

### Chess engine

> go to chess.ts directory

- `npm install`
- `npx tsc`
- `npm link`

### Build app dependancies

> go to TorneloScoresheet directory
- `npm link ..\chess.ts`
- `npm install`

### iOS:

> go to TorneloScoresheet directory

> Make sure you have CocoaPods installed. (This should be installed when you run `xcode-select --install`

- `cd ios`
- `pod install`
- `cd ..`
- `npm run ios`

### Android:

> go to TorneloScoresheet directory

- `npm run android`
