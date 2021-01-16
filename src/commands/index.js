var commands = {
  alias: require('./alias'),
  cat: require('./cat'),
  cd: require('./cd'),
  cp: require('./cp'),
  history: require('./history'),
  ls: require('./ls'),
  mkdir: require('./mkdir'),
  mv: require('./mv'),
  pwd: require('./pwd'),
  rm: require('./rm'),
  rmdir: require('./rmdir'),
  touch: require('./touch'),
  clear: require('./clear')
}

module.exports = commands
