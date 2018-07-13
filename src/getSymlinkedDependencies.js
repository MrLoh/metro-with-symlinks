const fs = require('fs')

const isSymlink = dependency =>
    fs.lstatSync(`node_modules/${dependency}`).isSymbolicLink()

module.exports = directory =>
    Object.keys(require(`${directory}/package.json`).dependencies || {}).filter(
        isSymlink,
    )
