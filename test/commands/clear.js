var test = require('tape')
var bashEmulator = require('../../src')

test('clear', function (t) {
  t.plan(5)

  var emulator = bashEmulator({
    workingDirectory: '/',
    fileSystem: {
      '/': {
        type: 'dir',
        modified: Date.now(),
        size: 4096
      },
      '/etc': {
        type: 'dir',
        modified: Date.now(),
        size: 4096
      },
      '/home': {
        type: 'dir',
        modified: Date.now(),
        size: 4096
      },
      '/home/README.txt': {
        type: 'file',
        modified: Date.now(),
        content: 'foo bar baz'
      }
    }
  })

  emulator.run('cat home/README.txt').then(function (output) {
    t.equal(output, 'foo bar baz\n', 'print file content')
  })
  .then(function () {
    return emulator.run('clear')
  })
  .then(function (output) {
    t.equal(output, '', 'clear screen')
  })
  .then(function () {
    return emulator.run('ls')
  })
  .then(function (output) {
    t.equal(output, 'etc home', 'list directories')
  })
  .then(function () {
    return emulator.run('cls')
  })
  .then(function (output) {
    t.equal(output, '', 'clears screen using "cls" alias')
  })
  .then(function () {
    return emulator.run('ls | clear')
  })
  .then(function (output) {
    t.equal(output, '', 'clears screen after pipe')
  })
})
