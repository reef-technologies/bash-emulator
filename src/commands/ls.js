var sprintf = require('sprintf-js').sprintf

function ls (env, args) {
  // Ignore command name
  args.shift()

  var aFlagIndex = args.findIndex(function (arg) {
    return arg === '-a'
  })
  var showHidden = aFlagIndex !== -1
  if (showHidden) {
    args.splice(aFlagIndex, 1)
  }

  var lFlagIndex = args.findIndex(function (arg) {
    return arg === '-l'
  })
  var longFormat = lFlagIndex !== -1
  if (longFormat) {
    args.splice(lFlagIndex, 1)
  }

  var laFlagIndex = args.findIndex(function (arg) {
    return arg === '-la'
  })
  if (laFlagIndex !== -1) {
    showHidden = true
    longFormat = true
    args.splice(laFlagIndex, 1)
  }

  var alFlagIndex = args.findIndex(function (arg) {
    return arg === '-al'
  })
  if (alFlagIndex !== -1) {
    showHidden = true
    longFormat = true
    args.splice(alFlagIndex, 1)
  }

  if (!args.length) {
    args.push('.')
  }

  function excludeHidden (listing) {
    if (showHidden) {
      return listing
    }
    return listing.filter(function (item) {
      return item[0] !== '.'
    })
  }

  function formatListing (base, listing) {
    return Promise.all(listing.map(function (filePath) {
      return env.system.stat(base + '/' + filePath).then(function (stats) {
        var type = stats.type
        var name = stats.name
        if (type === 'dir') {
          name = '\u001b[94m' + name + '\u001b[97m'
        }
        if (!longFormat) {
          return name
        }
        var date = new Date(stats.modified)
        var timestamp = date.toDateString().slice(4, 10) + ' ' + date.toTimeString().slice(0, 5)
        var chmod = (type === 'dir') ? 'drwxrwxr-x' : '-rw-rw-r--'
        var size = sprintf('%5s', stats.size)
        return chmod + ' ' + env.system.state.user + ' ' + env.system.state.group + ' ' + size + ' ' + timestamp + '  ' + name
      })
    })).then(function (lines) {
      if (!longFormat) {
        return lines.join(' ')
      }
      return 'total ' + lines.length + '\n' + lines.join('\n')
    })
  }

  Promise.all(args.sort().map(function (path) {
    return env.system.readDir(path)
      .then(excludeHidden)
      .then(function (listing) {
        return formatListing(path, listing)
      })
      .then(function (formattedListing) {
        if (args.length === 1) {
          return formattedListing
        }
        return path + ':\n' + formattedListing
      })
  }))
  .then(function (listings) {
    return listings.join('\n\n')
  })
  .then(function (result) {
    env.output(result)
    env.exit()
  }, function (err) {
    env.output('ls: ' + err)
    env.exit(2)
  })
}

module.exports = ls
