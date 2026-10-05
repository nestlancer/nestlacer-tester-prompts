const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const OUT='/home/bhumukul-raj/Music/nestlacer-test-output/reports/P03/form_inventory'; fs.mkdirSync(OUT,{recursive:true});
(async()=>{
 const b=await chromium.launch({ channel: 'chrome', headless: true});
 const c=await b.newContext({viewport:{width:1365,height:900},ignoreHTTPSErrors:true});
 const p=await c.newPage();
 const routes=['/login','/register','/forgot-password','/reset-password','/verify-email'];
 for(const route of routes){
  await p.goto('https://app.nestlancer.com'+route,{waitUntil:'networkidle',timeout:60000}).catch(e=>console.log(route,e.message));
  await p.screenshot({path:path.join(OUT,route.replace(/\W+/g,'_')+'.png'),fullPage:true});
  const info=await p.evaluate(()=>({
    url: location.href,
    title: document.title,
    text: document.body.innerText,
    forms:[...document.forms].map(f=>({action:f.action, method:f.method, fields:[...f.querySelectorAll('input,textarea,select,button')].map(el=>({tag:el.tagName,type:el.getAttribute('type'),name:el.getAttribute('name'),id:el.id,placeholder:el.getAttribute('placeholder'),aria:el.getAttribute('aria-label'),text:el.textContent?.trim(), required:el.hasAttribute('required'), autocomplete:el.getAttribute('autocomplete')}))})),
    buttons:[...document.querySelectorAll('button')].map(b=>({text:b.textContent.trim(), type:b.getAttribute('type'), disabled:b.disabled, aria:b.getAttribute('aria-label')})),
    links:[...document.querySelectorAll('a[href]')].map(a=>({text:a.textContent.trim(),href:a.href})).slice(0,50),
  }));
  fs.writeFileSync(path.join(OUT,route.replace(/\W+/g,'_')+'.json'),JSON.stringify(info,null,2));
  fs.writeFileSync(path.join(OUT,route.replace(/\W+/g,'_')+'.txt'),`URL ${info.url}\nTITLE ${info.title}\n\n${info.text}`);
 }
 await b.close();
})();
