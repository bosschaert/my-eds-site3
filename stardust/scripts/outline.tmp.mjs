import * as cheerio from 'cheerio';
import fs from 'fs';
const $ = cheerio.load(fs.readFileSync(process.argv[2],'utf8'));
const root = $(process.argv[3]);
function walk(el, depth, maxd){
  $(el).children().each((_,c)=>{
    const tag=c.tagName; if(['script','style','link','noscript','svg','source'].includes(tag)) return;
    const cls=($(c).attr('class')||'').split(/\s+/).slice(0,3).join('.');
    const txt=$(c).clone().children().remove().end().text().trim().replace(/\s+/g,' ').slice(0,50);
    console.log('  '.repeat(depth)+tag+(cls?'.'+cls:'')+($(c).attr('id')?'#'+$(c).attr('id'):'')+(txt?'  "'+txt+'"':''));
    if(depth<maxd) walk(c,depth+1,maxd);
  });
}
walk(root, 0, +process.argv[4]||3);
