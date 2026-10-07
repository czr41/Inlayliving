import fs from 'node:fs';
import path from 'node:path';
import { CategoryCard } from '../src/components/category.mjs';
fs.mkdirSync('dist',{recursive:true});fs.cpSync('public','dist',{recursive:true});
const categories=JSON.parse(fs.readFileSync('src/content/categories.json','utf8'));
function render(template){return template.replace(/\{\{([a-z]+)\}\}/g,(_,name)=>name==='categories'?categories.map(CategoryCard).join(''):render(fs.readFileSync(path.join('src/components',name+'.html'),'utf8')));}
fs.writeFileSync('dist/index.html',render(fs.readFileSync('src/layout.html','utf8')));
fs.writeFileSync('dist/robots.txt','User-agent: *\nAllow: /\nDisallow: /staff\nSitemap: https://inlayliving.in/sitemap.xml\n');
fs.writeFileSync('dist/sitemap.xml','<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://inlayliving.in/</loc></url></urlset>');
console.log('Built modular Inlay site.');
