# Run Metro with Symlinks

There is a longstanding [issue](https://github.com/facebook/metro/issues/1#issuecomment-386852670) with [Metro](https://github.com/facebook/metro) not accepting symlinks and thus making it hard to use in monorepo setups or example projects. This script provides a solution. 

All this does is generate a custom `metro.config.js` file based on checking for symlinks inside the `node_modules` folder and then starting the packager with this custom config. It also takes care of making peer dependencies available to those symlinked modules. 

## Usage

You can install this via `yarn add -D metro-with-symlinks` (or `npm i -D`).

You use this by simply running this script from your node modules `node ./node_modules/metro-with-symlinks` instead of the standard metro bundler. It takes the same arguments as the Metro bundler. 

For example you can replace the start script in your `package.json` with this: 

```
"start": "node ./node_modules/metro-with-symlinks start"
```

You can also configure the generated condig to be picked up by Xcode and Android Studio, you will need to ensure it was created by using the start script at least once, which will create a `metro.config.js` file in your root directory. 

In Xcode you can assign an environment variable in the build phase `Bundle React Native code and images` by adding the line `export BUNDLE_CONFIG=./metro.config.js` to the script: 

![Xcode bundle config](https://raw.githubusercontent.com/MrLoh/metro-with-symlinks/master/assets/xcode_screenshot.png)

In Android you just have to include `bundleConfig: "./metro.config.js"` in the `project.ext.react` field of your `android/app/build.gradle`:

![Android Studio bundle config](https://github.com/MrLoh/metro-with-symlinks/raw/master/assets/androidstudio_screenshot.png)

## Contributing

If there is a specific feature you are missing, please create an issue or ideally open a pull request. 