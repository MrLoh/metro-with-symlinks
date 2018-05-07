#!/usr/bin/env node

'use strict'

const cwd = process.cwd()
const command = process.argv[2]
const flags = process.argv.slice(3).join(' ')

require('../src/cli')(cwd, command, flags)
