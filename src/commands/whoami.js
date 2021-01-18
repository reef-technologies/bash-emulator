function whoami (env) {
  env.output(env.system.state.user)
  env.exit()
}

module.exports = whoami
