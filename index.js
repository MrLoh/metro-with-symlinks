/*
   - check symlink in depencency and devDepency
   - if found, generate rn-cli-config.js
   - react-native start with rn-cli-config

   Sources:
   https://github.com/facebook/metro/issues/1#issuecomment-346502388
   https://github.com/facebook/metro/issues/1#issuecomment-334546083
*/

const fs = require('fs');
const exec = require('child_process').execSync;

const getDependencyPath = (dependency) => fs.realpathSync(`node_modules/${dependency}`);

const getSymlinkedDependencies = () => {
  const packageJson = require(`${process.cwd()}/package.json`);
  const dependencies = [
    ...Object.keys(packageJson.dependencies),
    ...Object.keys(packageJson.devDependencies),
  ];
  return dependencies.filter((dependency) =>
    fs.lstatSync(`node_modules/${dependency}`).isSymbolicLink()
  );
};

const generateMetroConfig = (symlinkedDependencies) => {
  const symlinkedDependenciesPaths = symlinkedDependencies.map(getDependencyPath);

  const peerDependenciesOfSymlinkedDependencies = symlinkedDependenciesPaths
    .map((path) => require(`${path}/package.json`).peerDependencies)
    .map((peerDependencies) => (peerDependencies ? Object.keys(peerDependencies) : []))
    // flatten the array of arrays
    .reduce((flatDependencies, dependencies) => [...flatDependencies, ...dependencies], [])
    // filter to make array elements unique
    .filter((dependency, i, dependencies) => dependencies.indexOf(dependency) === i);

  fs.writeFileSync(
    'metro.config.js',
    `/* eslint-disable */
const path = require('path');
const blacklist = require('metro/src/blacklist');

module.exports = {
  extraNodeModules: {
    ${peerDependenciesOfSymlinkedDependencies
      .map((name) => `'${name}': path.resolve(__dirname, 'node_modules/${name}')`)
      .join(',\n    ')}
  },
  getBlacklistRE: () => blacklist([
    ${symlinkedDependenciesPaths
      .map(
        (path) =>
          `/${path.replace(/\//g, '[/\\\\]')}[/\\\\]node_modules[/\\\\]react-native[/\\\\].*/`
      )
      .join(',\n    ')}
  ]),
  getProjectRoots: () => [
    // Include current package as project root
    path.resolve(__dirname),
    // Include symlinked packages as project roots
    ${symlinkedDependenciesPaths.map((path) => `path.resolve('${path}')`).join(',\n    ')}
  ],
};`
  );
};

/* global process */

const symlinkedDependencies = getSymlinkedDependencies();
// eslint-disable-next-line no-console
console.log(`
Detected symlinked packaged:
${symlinkedDependencies
  .map((dependency) => `   ${dependency} -> ${getDependencyPath(dependency)}`)
  .join('\n')}
`);

generateMetroConfig(symlinkedDependencies, 'metro.config.js');
// eslint-disable-next-line no-console
console.log('Generated custom metro.config.js to support symlinks\n');

const command = process.argv[2];
const flags = process.argv.slice(3).join(' ');
exec(
  `node node_modules/react-native/local-cli/cli.js ${command} --config ../../../../metro.config.js ${flags}`,
  { stdio: [0, 1, 2] }
);
