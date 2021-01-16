function clear (env) {
    // clear command is already built-in
  // we just need to expose it in our bash emulator (index.js)
  env.exit()
}

module.exports = clear
