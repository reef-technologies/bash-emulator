var test = require('tape')
var bashEmulator = require('../../src')

test('whoami', function (t) {
  t.plan(1)

  var emulator = bashEmulator()

  emulator.run('whoami').then(function (output) {
    t.equal(output, 'reef technologies', 'Company Name')
  })
})
