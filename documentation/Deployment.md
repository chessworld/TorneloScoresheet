# Deployment

Currently, deployment is done in CI using `fastlane`, which is a ruby dependency in the `ios`
directory of the `TorneloScoresheet` package. Please see the [fastlane](https://docs.fastlane.tools/getting-started/ios/setup/)
docs for further information.

### CI/CD

For setting up CI, we followed this [blog post](https://byteable.medium.com/build-and-deploy-your-ios-app-with-github-actions-and-fastlane-48c328cc5541).
This tutorial isn't specifically for React Native, so we've added some extra steps to the GitHub Actions pipeline.

We are currently using one of the developers accounts to authenticate deployment to TestFlight.
Because of this, a 2FA session has to be created in order for CI to successfully authenticate. This is done
with: `bundle exec fastlane spaceauth -u user@email.com`. The session lasts 30 days.

In order to change the account the following "Github Action" variables need to be updated:

### Manual deployment

To do a manual deployment (you will need `ruby v2.5` or greater):

- Move to the `ios` directory: `cd ./packages/TorneloScoresheet/ios`
- Install dependencies with: `bundle install`
- Bump the version and deploy to TestFlight: `bundle exec fastlane beta`
