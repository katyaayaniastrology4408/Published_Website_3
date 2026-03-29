const fs = require('fs');
const c = fs.readFileSync('src/app/admin/page.tsx','utf8').split('\n');
c.forEach((l,i)=>{
  if(l.includes('SidebarContent') || l.includes('sidebar') || l.includes('Sidebar')) {
    console.log((i+1)+': '+l.trim().substring(0,120));
  }
});
