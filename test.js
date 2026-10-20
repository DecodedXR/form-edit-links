// Self-check for matching responses to rows: node test.js
const vm = require('vm'), fs = require('fs'), assert = require('assert');
const ctx = {}; vm.runInNewContext(fs.readFileSync(__dirname + '/Code.gs', 'utf8'), ctx);
const t = s => new Date('2026-10-19T10:00:' + s + 'Z');
const responses = [
  { ts: t('05.400').getTime(), url: 'A' },
  { ts: t('09.999').getTime(), url: 'B' },
  { ts: t('30.000').getTime(), url: 'C' },
];
const plain = x => JSON.parse(JSON.stringify(x));
// Sheet times are whole seconds: 05 matches A, 10 matches B (rounded up), 31 is 1s off C, 50 has no response.
assert.deepEqual(plain(ctx.matchLinks_([t('05'), t('10'), t('31'), t('50')], responses, ['', '', '', ''])), ['A', 'B', 'C', '']);
// Existing links are kept; blank or text timestamps get nothing.
assert.deepEqual(plain(ctx.matchLinks_([t('05'), '', 'x'], responses, ['KEEP', '', ''])), ['KEEP', '', '']);
console.log('ok');
