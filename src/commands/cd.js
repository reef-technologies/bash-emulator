function cd (env, args) {
  // Ignore command name
  args.shift()

  var path = args[0] || '/home/' + env.system.state.user

  env.system.stat(path).then(function (stats) {
    if (stats.type !== 'dir') {
      return Promise.reject('cd: not a directory: ' + path)
    }
  })
  .then(function () {
    env.system.changeDir(path).then(
      env.exit,
      function (errorMessage) {
        env.error(errorMessage)
        env.exit(1)
      }
    )
  })
  .catch(function (err) {
    env.error(err)
    env.exit(1)
  })
}

module.exports = cd

