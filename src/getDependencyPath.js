const fs = require('fs')

module.exports = dependency => fs.realpathSync(dependency)
