var test = require('tape')
var bashEmulator = require('../../src')

test('clear', function (t) {
  t.plan(2)

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
})