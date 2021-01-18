const partition = require('lodash.partition')

function parseCommandArgs (commandArgs) {
  const [commandFlags, remainingArgs] = partition(commandArgs, arg => /-\w+/.test(arg))
  const flagsInOrder = commandFlags.map(arg => arg.substring(1))
    .join('')
    .split('')

  return [flagsInOrder, remainingArgs]
}

module.exports = parseCommandArgs
