var c = require('fs').readFileSync('src/app/admin/page.tsx', 'utf8');
var lines = c.split('\n');
lines.forEach(function(l, i) {
  if (l.indexOf('indexing') > -1 || l.indexOf('IndexingPanel') > -1) {
    console.log((i+1) + ': ' + l.substring(0, 150));
  }
});
