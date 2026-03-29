const fs = require('fs');
const lines = fs.readFileSync('src/app/admin/page.tsx', 'utf8').split('\n');
lines.forEach((l, i) => {
  if (l.includes('lucky_number') || l.includes('lucky_color')) {
    console.log((i+1) + ': ' + l.trim());
  }
});
