const fs = require('fs')
const _ = require('lodash')

const isSymlink = dependency =>
    fs.lstatSync(`node_modules/${dependency}`).isSymbolicLink()

module.exports = directory =>
    _.keys(require(`${directory}/package.json`).dependencies).filter(isSymlink)
