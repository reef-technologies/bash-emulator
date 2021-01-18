const test = require('tape')
const parseCommandArgs = require('../../src/utils/parseCommandArgs')

test('parseCommandArgs', function (t) {
  t.plan(1)

  const expectedResult = [['l', 'a', '1', 'l', 'a', '1'], ['/home', '.']]

  const result = parseCommandArgs(['-la', '-1', '/home', '.', '-la1'])

  t.deepEqual(result, expectedResult, 'parse multiple flags with args')
})
