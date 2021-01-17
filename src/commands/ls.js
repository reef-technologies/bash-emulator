const sprintf = require('sprintf-js').sprintf
const partition = require('lodash.partition')

const LS_COMMAND_FLAGS = Object.freeze({
  SHOW_HIDDEN: 'a',
  LONG_FORMAT: 'l',
  ENTRY_PER_ROW: '1'
})

function parseCommandFlagsAndArgs(commandArgs) {
  let [commandFlags, args] = partition(commandArgs, arg => /-\w+/.test(arg))
  
  if (args.length === 0) { args.push('.') }

  const uniqueFlags = new Set(
    commandFlags.map(arg => arg.substring(1))
      .join('')
      .split('')
  )
  return [uniqueFlags, args]
}

function ls (env, commandOptions) {
  // Ignore command name
  commandOptions.shift()

  let [flags, args] = parseCommandFlagsAndArgs(commandOptions)
  
  const showHidden = flags.has(LS_COMMAND_FLAGS.SHOW_HIDDEN)
  const longFormat = flags.has(LS_COMMAND_FLAGS.LONG_FORMAT)
  const entryPerRow = flags.has(LS_COMMAND_FLAGS.ENTRY_PER_ROW)

  function sortEntries (a, b) {
    var isFirstDir = a.type === 'dir'
    var isSecondDir = b.type === 'dir'
    if (isFirstDir && !isSecondDir) return -1
    if (!isFirstDir && isSecondDir) return 1
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  }

  function formatListing (base, listing) {
    const getFileStats = filePath => env.system.stat(`${base}/${filePath}`)
    const formatLines = lines => {
      if (longFormat) {
        return `total ${lines.length}\n${lines.join('\n')}`
      } else if (entryPerRow) {
        return lines.join('\n')
      }
      return lines.join(' ')
    }

    const extractTimestamp = date => {
      const dateString = date.toString()
      const day = dateString.match(/(\w+\s\d+)/)[1]
      const hour = dateString.match(/(\d+:\d+)/)[1]
      return `${day} ${hour}`
    }

    const getChmod = fileType => (fileType === 'dir') ? 'drwxrwxr-x' : '-rw-rw-r--'

    return Promise.all(listing.map(getFileStats))
      .then(filesStats => {
        filesStats.sort(sortEntries)
        return filesStats.map(stats => {
          const type = stats.type
          const lsColor = env.system.state.addons.ls_colors[type]

          let name = stats.name
          if (lsColor) {
            name = lsColor(name)
          }
          if (!longFormat) {
            return name
          }
          if (type === 'dir') {
            name = name + '/'
          }
          const date = new Date(stats.modified)
          const timestamp = extractTimestamp(date)
          const chmod = getChmod(type)
          const size = sprintf('%5s', stats.size)
          return `${chmod} ${env.system.state.user} ${env.system.state.group} ${size} ${timestamp}  ${name}`
        })
      }).then(formatLines)
  }

  const excludeHidden = listing => showHidden ? listing : listing.filter(l => !l.startsWith('.'))

  Promise.all(args.sort().map(path => {
    return env.system.readDir(path)
      .then(excludeHidden)
      .then(listing => formatListing(path, listing))
      .then(formattedListing => {
        if (args.length === 1) {
          return formattedListing
        }
        return `${path}:\n${formattedListing}`
      })
  }))
  .then(listings => listings.join('\n\n'))
  .then(result => {
    env.output(result)
    env.exit()
  }, err => {
    env.output('ls: ' + err)
    env.exit(2)
  })
}

module.exports = ls
