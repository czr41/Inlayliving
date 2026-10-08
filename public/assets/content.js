export async function loadContent(){
  try{let response=await fetch('/api/content',{cache:'no-store'});if(!response.ok)response=await fetch('/assets/defaults.json',{cache:'no-store'});const content=await response.json();window.inlayContent=content;
    for(const el of document.querySelectorAll('[data-content]')){const value=content.text?.[el.dataset.content];if(typeof value==='string')el.textContent=value;}
    for(const el of document.querySelectorAll('[data-media]')){const media=content.media?.[el.dataset.media];if(media?.url&&/^https:\/\//.test(media.url)){el.style.backgroundImage=`url(${JSON.stringify(media.url)})`;el.setAttribute('role','img');el.setAttribute('aria-label',media.alt||'Inlay interior');}}
    const c=content.contact||{};
    for(const el of document.querySelectorAll('[data-contact]')){const key=el.dataset.contact,v=c[key];if(!v)continue;el.hidden=false;el.href=key==='phone'?'tel:'+v:key==='email'?'mailto:'+v:'https://wa.me/'+v.replace(/\D/g,'');if(key!=='whatsapp')el.textContent=v;}
    document.querySelectorAll('[data-careers]').forEach(el=>el.href='mailto:info@inlayliving.in?subject=Careers%20at%20INLAY');
    if(c.directions&&/^https:\/\//.test(c.directions))document.querySelectorAll('[data-directions]').forEach(el=>{el.href=c.directions;el.hidden=false;});
    document.querySelectorAll('[data-address]').forEach(el=>el.textContent=c.address||'');
  }catch{ /* The static site remains available during backend outages. */ }
}
