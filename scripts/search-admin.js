var c = require('fs').readFileSync('src/app/admin/page.tsx', 'utf8');
var lines = c.split('\n');
lines.forEach(function(l, i) {
  if (
    l.indexOf('Webmaster') > -1 ||
    l.indexOf('webmaster') > -1 ||
    l.indexOf('WebmasterPing') > -1 ||
    l.indexOf('seo-') > -1 ||
    l.indexOf('activeTab') > -1 ||
    l.indexOf('navItems') > -1 ||
    l.indexOf('navItem') > -1 ||
    l.indexOf('"seo') > -1 ||
    l.indexOf('indexing') > -1 ||
    l.indexOf('Indexing') > -1 ||
    l.indexOf('tab:') > -1 ||
    l.indexOf("id: '") > -1
  ) {
    console.log((i + 1) + ': ' + l.substring(0, 150));
  }
});
