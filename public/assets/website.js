

(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches, WA='918688887979';
  var $=function(s,c){return (c||document).querySelector(s)}, $$=function(s,c){return [].slice.call((c||document).querySelectorAll(s))};


  /* preloader */
  (function(){ var n=0, pct=$('#pct'), bar=$('#bootbar'), boot=$('#boot');
    var tick=setInterval(function(){ n+=Math.random()*11; if(n>=100){ n=100; clearInterval(tick); setTimeout(function(){ boot.classList.add('gone'); document.body.classList.remove('booting'); },420); }
      pct.textContent=Math.floor(n)+'%'; bar.style.width=n+'%'; }, reduce?10:70); })();

  /* header state */
  var hdr=$('#hdr');
  var mbar=document.getElementById('mbar');
  function onScroll(){ hdr.classList.toggle('solid', scrollY>60); mbar.classList.toggle('show', scrollY>innerHeight*.5); }
  addEventListener('scroll',onScroll,{passive:true}); onScroll();

  /* desktop dropdown (click/touch support) */
  var dd=$('#dd');
  $('button',dd).addEventListener('click',function(e){ e.stopPropagation(); var o=dd.classList.toggle('open'); this.setAttribute('aria-expanded',o); });
  document.addEventListener('click',function(){ dd.classList.remove('open'); });

  /* drawer */
  var drawer=$('#drawer');
  function drw(o){ drawer.classList.toggle('open',o); drawer.setAttribute('aria-hidden',!o); document.body.style.overflow=o?'hidden':''; }
  $('#burger').addEventListener('click',function(){drw(true)});
  $$('[data-dclose]').forEach(function(b){b.addEventListener('click',function(){drw(false)})});
  $$('#drawer nav a').forEach(function(a){a.addEventListener('click',function(){drw(false)})});
  $('#acc').addEventListener('click',function(){ var o=$('#accSub').classList.toggle('open'); this.setAttribute('aria-expanded',o); });

  /* hero slider */
  var slides=$$('.hero .slide'), hc=0, ht, dots=$('#heroDots');
  slides.forEach(function(_,i){ var b=document.createElement('button'); b.setAttribute('aria-label','Slide '+(i+1)); if(!i)b.className='on'; b.onclick=function(){hgo(i);hstart()}; dots.appendChild(b); });
  function hgo(n){ slides[hc].classList.remove('on'); dots.children[hc].classList.remove('on'); hc=(n+slides.length)%slides.length; slides[hc].classList.add('on'); dots.children[hc].classList.add('on');  }
  function hstart(){ clearInterval(ht); if(!reduce) ht=setInterval(function(){hgo(hc+1)},6000); }
  /* restart the first slide's zoom once the loading screen has gone */
  (function kick(){ var bt=$('#boot'); if(bt && !bt.classList.contains('gone')){ return setTimeout(kick,120); }
    var bg=slides[hc].querySelector('.bg'); bg.style.transition='none'; bg.style.transform='scale(1.12)'; void bg.offsetWidth; bg.style.transition=''; bg.style.transform=''; hstart(); })();
  /* swipe on phones */
  (function(){ var hero=$('#hero'), x0=null, y0=0;
    hero.addEventListener('touchstart',function(e){ x0=e.touches[0].clientX; y0=e.touches[0].clientY; },{passive:true});
    hero.addEventListener('touchend',function(e){ if(x0===null) return; var dx=e.changedTouches[0].clientX-x0, dy=e.changedTouches[0].clientY-y0;
      if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)){ hgo(hc+(dx<0?1:-1)); hstart(); } x0=null; },{passive:true}); })();
  $('#heroNext').onclick=function(){hgo(hc+1);hstart()}; $('#heroPrev').onclick=function(){hgo(hc-1);hstart()};

  /* looks slider */
  var ls=$$('#stage .sl'), tb=$$('#thumbs button'), lc=0, lt, bar=$('#lkBar'), DUR=5500, t0;
  $('#lkTot').textContent=('0'+ls.length).slice(-2);
  function lgo(n){ ls[lc].classList.remove('on'); tb[lc].classList.remove('on'); lc=(n+ls.length)%ls.length; ls[lc].classList.add('on'); tb[lc].classList.add('on');
    $('#lkCur').textContent=('0'+(lc+1)).slice(-2); $('#lkTag').textContent=ls[lc].dataset.tag; $('#lkTitle').textContent=ls[lc].dataset.t; t0=performance.now(); }
  tb.forEach(function(b,i){ b.onclick=function(){lgo(i)}; });
  $('#lkNext').onclick=function(){lgo(lc+1)}; $('#lkPrev').onclick=function(){lgo(lc-1)};
  t0=performance.now();
  (function loop(now){ if(!reduce){ var p=(now-t0)/DUR; if(p>=1){ lgo(lc+1); p=0; } bar.style.width=(p*100)+'%'; } requestAnimationFrame(loop); })(performance.now());

  /* process: scroll-driven stacking cards */
  var track=$('#procTrack'), pcs=$$('#pcards .pcard'), steps=$$('#steps .step'), N=steps.length, pc=-1;
  var pinned=function(){ return !reduce && matchMedia('(min-width:901px) and (min-height:621px)').matches; };
  function setActive(k){ if(k===pc) return; if(pc>=0) steps[pc].classList.remove('on'); pc=k; steps[pc].classList.add('on');
    var nn=('0'+(pc+1)).slice(-2); $('#procCur').textContent=nn; $('#procBig').textContent=nn; }
  function layout(){
    if(!pinned()){ track.style.height=''; pcs.forEach(function(c){ c.style.transform=''; c.style.opacity=''; }); return; }
    track.style.height=(N*70+100)+'vh'; place();
  }
  function place(){
    if(!pinned()) return;
    var r=track.getBoundingClientRect(), total=track.offsetHeight-innerHeight;
    var p=total>0?Math.min(Math.max(-r.top/total,0),1):0, pos=1+p*(N-1);
    pcs.forEach(function(c,i){
      var d=pos-i, h=c.offsetHeight||160, y, x=0, s=1, o;
      if(d<=0){ y=h*1.3; o=0; }
      else if(d<1){ y=h*1.3*(1-d); o=Math.min(1,d*2.2); }
      else { var back=Math.min(d-1,3); y=-back*14; x=back*22; s=1-back*.045; o=1-Math.max(0,back-2)*.6; }
      c.style.transform='translate3d('+x+'px,'+y+'px,0) scale('+s.toFixed(3)+')';
      c.style.transformOrigin='top left'; c.style.opacity=o; c.style.zIndex=10+i;
    });
    $('#procBar').style.width=(p*100)+'%';
    setActive(Math.min(N-1,Math.max(0,Math.round(pos)-1)));
  }
  function goStep(k){ k=Math.max(0,Math.min(N-1,k)); var top=track.getBoundingClientRect().top+scrollY, total=track.offsetHeight-innerHeight;
    scrollTo({top:top+total*(k/(N-1))+2,behavior:'smooth'}); }
  $('#procNext').onclick=function(){ goStep(pc+1); }; $('#procPrev').onclick=function(){ goStep(pc-1); };
  setActive(0); layout();
  addEventListener('scroll',place,{passive:true}); addEventListener('resize',layout);

  /* testimonials */
  var tt=$('#tTrack');
  function tstep(d){ var c=$('.t-card',tt); tt.scrollBy({left:d*(c.offsetWidth+20),behavior:reduce?'auto':'smooth'}); }
  $('#tNext').onclick=function(){ if(tt.scrollLeft+tt.clientWidth>=tt.scrollWidth-5) tt.scrollTo({left:0,behavior:'smooth'}); else tstep(1); };
  $('#tPrev').onclick=function(){ tstep(-1); };

  /* reveal + counters */
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(!e.isIntersecting) return; e.target.classList.add('in'); io.unobserve(e.target);
    $$('[data-count]',e.target).forEach(function(c){ var to=+c.dataset.count, s=performance.now(); (function f(t){ var p=Math.min((t-s)/1400,1); c.textContent=Math.round(to*(1-Math.pow(1-p,3))); if(p<1) requestAnimationFrame(f); })(s); });
  }); },{threshold:.15});
  $$('.rv').forEach(function(el){ io.observe(el); });
  $$('.svc-grid .rv,.why-grid .rv,.miles-grid .rv,.exp-grid .rv').forEach(function(el,i){ el.style.transitionDelay=(i%3*90)+'ms'; });

  /* estimate modal */
  var m=$('#est'), form=$('#estForm'), thanks=$('#thanks');
  function mopen(scope){ form.style.display=''; thanks.style.display='none'; m.classList.add('on'); document.body.style.overflow='hidden';
    if(scope){ var s=$('#fScope'); $$('option',s).forEach(function(o){ if(o.textContent.toLowerCase()===scope.toLowerCase()) s.value=o.value||o.textContent; }); } }
  function mclose(){ m.classList.remove('on'); document.body.style.overflow=''; }
  $$('[data-est]').forEach(function(b){ b.addEventListener('click',function(e){ e.preventDefault(); drw(false); mopen(b.dataset.scope); }); });
  $$('.menu a[data-scope]').forEach(function(a){ a.addEventListener('click',function(){ dd.classList.remove('open'); }); });
  $$('[data-mclose]').forEach(function(b){ b.addEventListener('click',mclose); });
  addEventListener('keydown',function(e){ if(e.key==='Escape'){ mclose(); drw(false); } });
  form.addEventListener('submit',function(e){
    e.preventDefault(); var ok=true;
    $$('[required]',form).forEach(function(f){ var bad=!f.value.trim()||(f.id==='fPhone'&&f.value.replace(/\D/g,'').length<10); f.classList.toggle('bad',bad); if(bad) ok=false; });
    if(!$('#fAgree').checked) ok=false;
    if(!ok || !form.reportValidity()) return;
    var lines=['Hi INLAY, I would like a free estimate for my home.'];
    $$('[data-k]',form).forEach(function(f){ if(f.value.trim()) lines.push(f.dataset.k+': '+f.value.trim()); });
    window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(lines.join('\n')),'_blank','noopener');
    form.style.display='none'; thanks.style.display='block';
  });
  $$('input,select',form).forEach(function(f){ f.addEventListener('input',function(){ f.classList.remove('bad'); }); });
})();

