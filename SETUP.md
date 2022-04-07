# Setup

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

- `npm run android`
