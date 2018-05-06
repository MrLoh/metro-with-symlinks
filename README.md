# Run Metro with Symlinks

There is a longstanding [issue](https://github.com/facebook/metro/issues/1#issuecomment-386852670) with [Metro](https://github.com/facebook/metro) not accepting symlinks and thus making it hard to use in monorepo setups or example projects. This script provides a solution. 

All this does is generate a custom `metro.config.js` file based on checking for symlinks inside the `node_modules` folder and then starting the packager with this custom config. It also takes care of making peer dependencies available to those symlinked modules. 

## Usage

You use this by simply running this script from your node modules `node ./node_modules/metro-with-symlinks` instead of the standard metro bundler. It takes the same arguments as the Metro bundler. 

For example you can replace the start script in your `package.json` with this: 

```json
"scripts": {
    "start": "node ./node_modules/metro-with-symlinks start",
    ...
}
```

## Contributing

If there is a specific feature you are missing, please create an issue or ideally open a pull request. 