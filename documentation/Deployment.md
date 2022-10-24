## Releasing the App to TestFlight

The app will be manually deployed to TestFlight. The following steps must be done on an Apple device that is logged into a developer account that has access to the project in App Store Connect.

1. Bump the `packages/TorneloScoresheet/package.json` version by a minor or major version. (example: 1.4.0 => 1.5.0)
2. Bump the `packages/TorneloScoresheet/ios/TorneloScoresheet/Info.plist` “CFBundleShortVersionString” Key. (example: 1.4 => 1.5)
3. Optionally edit the `packages/TorneloScoresheet/.env` configuration to point at different API endpoints (rather than staging)
4. Open `packages/TorneloScoresheet/ios/TorneloScoresheet.xcworkspace` in XCode.
5. Make sure “Any iOS Device” is selected as the build target.
6. Build the project. (`Product > Build` in the menu bar)
7. Archive the project. (`Product > Archive` in the menu bar)
8. After the archive is completed, select `Distribute App`
9. Step through the wizard to “Upload” the app to “App Store Connect”
10. Go to “App Store Connect” in your browser (It’s easily accessible by googling it)
11. Select “My apps”
12. Select “Tornelo Scoresheet” from the list
13. Select “TestFlight”
14. Select the dropdown for the newly Uploaded version
15. Click on the latest build from the list under the dropdown.
16. Add the “TorneloScoresheet Testers” group under “Group”
