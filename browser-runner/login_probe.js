const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const OUT='/home/bhumukul-raj/Music/nestlacer-test-output/reports/P46/login_probe'; fs.mkdirSync(OUT,{recursive:true});
const password='Brick2@Build';
function redact(s){return String(s||'').replaceAll(password,'<redacted-password>').replace(/([A-Za-z0-9._%+-]+)@nestlancer\.com/g,'<demo-email>@nestlancer.com').replace(/(accessToken|refreshToken|token|otp|code|password|secret|cookie|authorization)\s*[:=]\s*["']?[^,"'\s}]+/gi,'$1:<redacted>')}
async function probe(base,email,label){
 const browser=await chromium.launch({ channel: 'chrome', headless: true});
 const ctx=await browser.newContext({viewport:{width:1365,height:900},ignoreHTTPSErrors:true});
 const page=await ctx.newPage();
 const net=[]; const responses=[];
 page.on('response', async res=>{const req=res.request(); if(/auth|profile|dashboard|users|system/.test(res.url())){let body=''; if(req.method()==='POST'||/auth\/login|users\/profile/.test(res.url())){try{body=redact((await res.text()).slice(0,1000))}catch{}} net.push({method:req.method(),url:res.url(),status:res.status(),type:req.resourceType(),body});}});
 page.on('console',m=>console.log(label,'console',m.type(),redact(m.text())));
 await page.goto(base+'/login',{waitUntil:'networkidle',timeout:60000});
 // dismiss cookie if visible
 for(const text of ['Accept','Dismiss']){try{const b=page.getByRole('button',{name:text}).first(); if(await b.isVisible({timeout:1000})) await b.click({timeout:1000});}catch{}}
 await page.locator('input[type="email"], input[name="email"], input[autocomplete="email"]').first().fill(email);
 await page.locator('input[type="password"], input[name="password"], input[autocomplete="current-password"]').first().fill(password);
 await page.screenshot({path:path.join(OUT,label+'_before_submit.png'),fullPage:true});
 await Promise.allSettled([
   page.waitForURL(url=>!url.pathname.includes('/login'),{timeout:20000}),
   page.locator('button[type="submit"]').first().click()
 ]);
 await page.waitForLoadState('networkidle',{timeout:15000}).catch(()=>{});
 await page.waitForTimeout(4000);
 await page.screenshot({path:path.join(OUT,label+'_after_wait.png'),fullPage:true});
 let text=redact(await page.locator('body').innerText().catch(()=>''));
 fs.writeFileSync(path.join(OUT,label+'_after_wait.txt'),`URL ${page.url()}\nTITLE ${await page.title()}\n\n${text}`);
 // try dashboard after login
 await page.goto(base+'/dashboard',{waitUntil:'networkidle',timeout:60000}).catch(e=>net.push({error:'dashboard goto '+e.message}));
 await page.waitForTimeout(2000);
 await page.screenshot({path:path.join(OUT,label+'_dashboard.png'),fullPage:true});
 text=redact(await page.locator('body').innerText().catch(()=>''));
 fs.writeFileSync(path.join(OUT,label+'_dashboard.txt'),`URL ${page.url()}\nTITLE ${await page.title()}\n\n${text}`);
 await ctx.storageState({path:path.join(OUT,label+'_storage.json')});
 fs.writeFileSync(path.join(OUT,label+'_net.json'),JSON.stringify(net,null,2));
 await browser.close();
 console.log(label, 'final', page.url(), 'net', net.map(n=>({method:n.method,status:n.status,url:n.url,body:n.body})));
}
(async()=>{await probe('https://app.nestlancer.com','arjun.mehta@nestlancer.com','client'); await probe('https://admin.nestlancer.com','admin@nestlancer.com','admin');})();
