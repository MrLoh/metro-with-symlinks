# Run Metro with Symlinks

There is a longstanding [issue](https://github.com/facebook/metro/issues/1#issuecomment-386852670) with [Metro](https://github.com/facebook/metro) not accepting symlinks and thus making it hard to use in monorepo setups or example projects. This script provides a solution. 

All this does is generate a custom `metro.config.js` file based on checking for symlinks inside the `node_modules` folder and then starting the packager with this custom config. 
