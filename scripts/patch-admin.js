var fs = require('fs');
var c = fs.readFileSync('src/app/admin/page.tsx', 'utf8');
var lines = c.split('\n');

// Insert after line 1799 (index 1798)
var insertAfter = 1798; // 0-indexed = line 1799
var newLines = [
  '',
  '                      {activeTab === "indexing" && (',
  '                        <IndexingPanel isDark={isDark} t={t} setSuccess={setSuccess} setError={setError} />',
  '                      )}',
];

lines.splice(insertAfter + 1, 0, newLines.join('\n'));
fs.writeFileSync('src/app/admin/page.tsx', lines.join('\n'), 'utf8');
console.log('Inserted render block after line', insertAfter + 1);
