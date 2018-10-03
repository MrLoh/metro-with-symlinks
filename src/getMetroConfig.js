// Check for symlinks in node_modules
// If found generate and use metro config.
//
// Sources:
//     - https://github.com/facebook/metro/issues/1#issuecomment-346502388
//     - https://github.com/facebook/metro/issues/1#issuecomment-334546083

const fs = require('fs')
const exec = require('child_process').execSync
const dedent = require('dedent-js')

const mapModule = name =>
    `'${name}': path.resolve(__dirname, 'node_modules/${name}')`

const mapPath = path => `/${path.replace(/\//g, '[/\\\\]')}[/\\\\].*/`

const flatten = arr =>
    arr.reduce(
        (flatDependencies, dependencies) => [
            ...flatDependencies,
            ...dependencies,
        ],
        [],
    )

const unique = arr => Array.from(new Set(arr))

module.exports = symlinkedDependenciesPaths => {
    const rawPeerDeps = symlinkedDependenciesPaths
        .map(path => require(`${path}/package.json`).peerDependencies)
        .map(
            peerDependencies =>
                peerDependencies ? Object.keys(peerDependencies) : [],
        )

    const peerDepsOfSymlinkedDeps = unique(flatten(rawPeerDeps))

    const peerDepsOfSymlinkedDepsWithPaths = unique(
        flatten(
            rawPeerDeps.map((depsList, i) =>
                depsList.map(
                    dep =>
                        `${symlinkedDependenciesPaths[i]}/node_modules/${dep}`,
                ),
            ),
        ),
    )

    const extraNodeModules = peerDepsOfSymlinkedDeps
        .map(mapModule)
        .join(',\n  ')

    const getBlacklistPeerRE = peerDepsOfSymlinkedDepsWithPaths.map(mapPath)

    const getProjectRoots = symlinkedDependenciesPaths
        .map(path => `path.resolve('${path.replace(/\\/g, '\\\\')}')`)
        .join(',\n  ')

    return dedent`
      const path = require('path');

      const extraNodeModules = {
        ${extraNodeModules}
      };
      const blacklistRegexes = [
        ${getBlacklistPeerRE}
      ];
      const watchFolders = [
        ${getProjectRoots}
      ];

      const metroVersion = require('metro/package.json').version;
      const metroVersionComponents = metroVersion.match(/^(\\d+)\\.(\\d+)\\.(\\d+)/);
      if (metroVersionComponents[1] === '0' && parseInt(metroVersionComponents[2], 10) >= 43) {
          module.exports = {
            resolver: {
              extraNodeModules,
              blacklistRE: require('metro-config/src/defaults/blacklist')(blacklistRegexes)
            },
            watchFolders
          };
      } else {
          module.exports = {
            extraNodeModules,
            getBlacklistRE: () => require('metro/src/blacklist')(blacklistRegexes),
            getProjectRoots: () => [path.resolve(__dirname)].concat(watchFolders)
          };
      }



   `
}
