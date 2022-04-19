# Setup

## Pre-Commit

1. Install `pre-commit` via either:
   - `pip install pre-commit` (requires pip and python to be installed), or
   - `brew install pre-commit`.
2. Install the hooks: `pre-commit install`

## iOS:

### System prerequisites

| Software                      | Version |
|-------------------------------|---------|
| `CocoaPods` (Xcode CLI tools) | N/A     |
| `node`                        | v16+    |
| `Xcode`                       | N/A     |

### Setup steps
0. Install prerequisites - Skip if already installed

    1. Install XCode via app store (This can take between 10 minutes to 3 hours).

    1. Install CocoaPods. This should be part of XCode command line tools.
        ```bash
        xcode-select --install
        ```

    1. Install `node` v16+

1. Install npm packages
    ```bash
    npm install
    ```

1. Install iOS packages
    ```bash
    cd <project_directory>/ios
    pod install
    cd ..
    ```

1. Run simulator

    1. Start `Xcode`

    1. Run the following in the terminal
        ```bash
        cd <project_directory>
        npm run ios
        ```


### Android (WIP):

>https://reactnative.dev/docs/running-on-device

### Prerequisites:

### Steps
0. Install prerequisites:

    1. `Android Debug Bridge`
        > https://developer.android.com/studio/command-line/adb

    1. Java runtime
        > https://java.com/en/

    1. Android Development Environment (Android Studio)
        > https://developer.android.com/studio/install

        > https://developer.android.com/studio#downloads

        > https://guides.codepath.com/android/installing-android-sdk-tools#installing-the-android-sdk-via-homebrew

    1. For mac users, add this to your `~/.bash_profile` or `~/.zprofile` or whatever environment you use:
        > `export ANDROID_SDK_ROOT=~/Library/Android/sdk`

1. Enable debugging over USB on android device

1. Plug in USB and connect to device

1. Run `npm run android`
