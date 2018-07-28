const fs = require('fs')

const isSymlink = dependency =>
    fs.lstatSync(`node_modules/${dependency}`).isSymbolicLink()

module.exports = directory => {
    const pacakgeJson = require(`${directory}/package.json`)
    return [
        ...Object.keys(pacakgeJson.devDependencies || {}),
        ...Object.keys(pacakgeJson.dependencies || {}),
    ]
        .filter(isSymlink)
        .filter(dep => fs.existsSync(`node_modules/${dep}`))
}
