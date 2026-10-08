import { loadContent } from "./content.js?v=2";
await loadContent();

(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* preloader */
  var n=0, pct=document.getElementById('pct'), bar=document.getElementById('bootbar'), boot=document.getElementById('boot');
  var tick=setInterval(function(){
    n += Math.random()*11;
    if(n>=100){n=100;clearInterval(tick);setTimeout(function(){boot.classList.add('gone')},420);}
    pct.textContent=Math.floor(n)+'%'; bar.style.width=n+'%';
  }, reduce?10:70);

  /* scroll rail + hero strip drift */
  var rail=document.getElementById('rail'), strip=document.getElementById('strip');
  function onScroll(){
    var h=document.documentElement.scrollHeight-window.innerHeight;
    rail.style.width=(h>0?(window.scrollY/h)*100:0)+'%';
    if(strip && !reduce) strip.style.transform='translateX('+(-window.scrollY*0.22)+'px)';
  }
  window.addEventListener('scroll',function(){onScroll();tone();},{passive:true}); onScroll();

  /* The solid header keeps its light logo and text on every section. */
  function tone(){}

  /* nav */
  var nav=document.getElementById('nav'), navbtn=document.getElementById('navbtn');
  function toggleNav(f){ nav.classList.toggle('open',f); navbtn.setAttribute('aria-expanded',f); navbtn.textContent=f?'Close':'Menu'; tone(); }
  navbtn.addEventListener('click',function(){toggleNav(!nav.classList.contains('open'))});
  nav.addEventListener('click',function(e){ if(e.target.tagName==='A') toggleNav(false); });

  /* reveals */
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  tone();
  document.querySelectorAll('.rise').forEach(function(el,i){ el.style.transitionDelay=(i%4*60)+'ms'; io.observe(el); });

  /* process: cards deal in and stack as you scroll the pinned track */
  var track=document.getElementById('procTrack'), cards=[], count=document.getElementById('procCount');
  if(track){
    cards=[].slice.call(track.querySelectorAll('.card'));
    track.style.height=(cards.length*85+60)+'vh';
    var place=function(){
      var r=track.getBoundingClientRect();
      var total=track.offsetHeight-window.innerHeight;
      var p=total>0 ? Math.min(Math.max(-r.top/total,0),1) : 0;
      var pos=p*cards.length;
      var active=Math.min(cards.length,Math.max(1,Math.ceil(pos)||1));
      count.textContent=('0'+active).slice(-2);
      cards.forEach(function(c,i){
        var d=pos-i;                       // >1 = settled, 0..1 = arriving, <0 = waiting
        var h=c.offsetHeight||320, y,x,s,o;
        if(d<=0){ y=h*1.15; x=0; s=1; o=0; }
        else if(d<1){ y=h*1.15*(1-d); x=0; s=1; o=d; }
        else {
          var back=Math.min(d-1,3);        // three cards deep, so the stack can't climb into the heading
          y=-back*13; x=back*clampPx(); s=1-back*.05; o=1;
        }
        c.style.transform='translate3d('+x+'px,'+y+'px,0) scale('+s.toFixed(3)+')';
        c.style.transformOrigin='top left';
        c.style.opacity=o;
        c.style.zIndex=100+i;
      });
    };
    var clampPx=function(){ return Math.min(window.innerWidth*0.06,52); };
    if(reduce){
      cards.forEach(function(c,i){ c.style.position='relative'; c.style.width='100%'; c.style.marginBottom='14px'; });
      document.getElementById('procCards').style.height='auto';
      track.style.height='auto';
      document.querySelector('.proc-stage').style.position='static';
      document.querySelector('.proc-stage').style.height='auto';
    } else {
      window.addEventListener('scroll',place,{passive:true});
      window.addEventListener('resize',place); place();
    }
  }

  /* calculator */
  var calc=document.getElementById('calc'), step=1;
  var fill=document.getElementById('barfill'), sname=document.getElementById('stepname'), sno=document.getElementById('stepno');
  var names={1:'your home',2:'what you need',3:'where to send it'};
  function render(){
    document.querySelectorAll('.pane').forEach(function(p){ p.classList.toggle('on', +p.dataset.pane===step); });
    document.getElementById('acts').style.display = step>3 ? 'none':'flex';
    document.getElementById('back').style.visibility = step>1 ? 'visible':'hidden';
    document.getElementById('next').textContent = step===3 ? 'Get my costing' : 'Continue';
    fill.style.width=Math.min(step,3)*33.34+'%';
    if(step<=3){ sname.textContent=names[step]; sno.textContent=step+' / 3'; }
  }
  function open(){ calc.classList.add('on'); document.body.style.overflow='hidden'; step=1; render(); }
  function close(){ calc.classList.remove('on'); document.body.style.overflow=''; }
  document.querySelectorAll('[data-calc]').forEach(function(b){ b.addEventListener('click',function(e){e.preventDefault();open();}); });
  calc.addEventListener('click',function(e){ if(e.target.hasAttribute('data-close')) close(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ close(); toggleNav(false);} });
  document.getElementById('next').addEventListener('click',async function(){
    if(step===3){
      const name=document.getElementById('nm'),phone=document.getElementById('ph');
      name.required=true;phone.required=true;phone.pattern='[+0-9 ()-]{10,18}';
      if(!name.reportValidity()||!phone.reportValidity())return;
      const config=window.inlayContent?.contact||{};
      const message=['INLAY costing enquiry', 'Name: '+name.value,'Phone: '+phone.value,'Area: '+document.getElementById('area').value,'Locality: '+document.getElementById('loc').value,'Possession: '+document.getElementById('poss').value,'Call: '+document.getElementById('tm').value,...Array.from(document.querySelectorAll('.chip[aria-pressed="true"]')).map(x=>x.textContent)].join('\n');
      if(config.whatsapp)window.open('https://wa.me/'+config.whatsapp.replace(/\D/g,'')+'?text='+encodeURIComponent(message),'_blank','noopener');
      else if(config.email)window.location.href='mailto:'+config.email+'?subject=INLAY%20costing%20enquiry&body='+encodeURIComponent(message);
      else {document.getElementById('calc-status').textContent='Online enquiries will open soon. Please check back for our contact details.';return;}
    }
    step++;render();
  });
  document.getElementById('back').addEventListener('click',function(){ step--; render(); });
  document.querySelectorAll('.chips').forEach(function(g){
    g.addEventListener('click',function(e){
      if(!e.target.classList.contains('chip')) return;
      g.querySelectorAll('.chip').forEach(function(c){ c.setAttribute('aria-pressed','false'); });
      e.target.setAttribute('aria-pressed','true');
    });
  });
})();
