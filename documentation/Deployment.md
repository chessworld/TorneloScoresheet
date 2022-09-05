# Deployment

Currently, deployment is done in CI using `fastlane`, which is a ruby dependency in the `ios`
directory of the `TorneloScoresheet` package. Please see the [fastlane](https://docs.fastlane.tools/getting-started/ios/setup/)
docs for further information.

### Manual deployment

To do a manual deployment (you will need `ruby v2.5` or greater):

- Move to the `ios` directory: `cd ./packages/TorneloScoresheet/ios`
- Install dependencies with: `bundle install`
- Bump the version and deploy to TestFlight: `bundle exec fastlane beta`
