const fs = require('fs')

module.exports = dependency => fs.realpathSync(`node_modules/${dependency}`)
