
function alias (env) {
  for (const [key, value] of Object.entries(env.system.aliases)) {
    env.output(key + "='" + value.join(' ') + "'\n")
  }
  env.exit()
}

module.exports = alias
