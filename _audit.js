const fs = require('fs');
const lines = fs.readFileSync('src/app/admin/page.tsx','utf8').split('\n');
lines.forEach((l,i)=>{
  if(l.match(/activeTab === "|NavItem.*tab="|function \w+Manager|function \w+Viewer/))
    console.log((i+1)+': '+l.trim());
});
