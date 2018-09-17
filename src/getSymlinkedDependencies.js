const fs = require('fs')

const isSymlink = dependency =>
    fs.lstatSync(`node_modules/${dependency}`).isSymbolicLink()

module.exports = directory =>
    fs.readdirSync(`${directory}/node_modules`).filter(isSymlink)
