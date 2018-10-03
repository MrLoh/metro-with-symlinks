const fs = require('fs')
const getDependencyPath = require('./getDependencyPath')

const isSymlink = dependency => fs.lstatSync(dependency).isSymbolicLink()

const getSymlinkedDependencies = directory => {
    const packageJson = require(`${directory}/package.json`)
    return [
        ...Object.keys(packageJson.devDependencies || {}),
        ...Object.keys(packageJson.dependencies || {}),
    ]
        .map(dep => `${directory}/node_modules/${dep}`)
        .filter(isSymlink)
        .filter(dep => fs.existsSync(dep))
        .map(getDependencyPath)
        .map(getSymlinkedDependencies)
        .reduce(
            (accumulator, currentValue) => accumulator.concat(currentValue),
            [],
        )
        .concat(directory)
}

getSymlinkedDependenciesExternal = dir =>
    getSymlinkedDependencies(dir, true).slice(0, -1)

module.exports = getSymlinkedDependenciesExternal
