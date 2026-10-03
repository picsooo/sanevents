(function(){
  var bar=document.querySelector('.bar');
  function onScroll(){bar.classList.toggle('solid',window.scrollY>40);}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  /* horloge du jour J */
  var moments=[].slice.call(document.querySelectorAll('.moment')), H=document.getElementById('clockH'), M=document.getElementById('clockM');
  var stack=[].slice.call(document.querySelectorAll('.st')), prog=document.getElementById('prog'), cur=-1;
  function setTime(t){var p=t.split(':');[[H,p[0]],[M,p[1]]].forEach(function(x){if(x[0].textContent!==x[1]){x[0].textContent=x[1];x[0].classList.remove('tick');void x[0].offsetWidth;x[0].classList.add('tick');}});}
  function activate(i){if(i===cur)return;cur=i;setTime(moments[i].dataset.time);
    moments.forEach(function(m,j){m.classList.toggle('on',j===i);});stack.forEach(function(s,j){s.classList.toggle('on',j===i);});
    prog.style.transform='scaleX('+((i+1)/moments.length)+')';}
  function pick(){var mid=window.innerHeight*0.5,best=0,bd=1e9;moments.forEach(function(m,i){var r=m.getBoundingClientRect(),d=Math.abs(r.top+r.height/2-mid);if(d<bd){bd=d;best=i;}});activate(best);}
  window.addEventListener('scroll',pick,{passive:true});pick();
  /* image qui suit le curseur sur les formats (ordinateur) */
  var fl=document.getElementById('fFloat');
  if(window.matchMedia('(hover:hover) and (min-width:960px)').matches){
    document.querySelectorAll('.f-list a').forEach(function(a){
      a.addEventListener('mouseenter',function(){fl.src=a.dataset.img;fl.classList.add('on');});
      a.addEventListener('mouseleave',function(){fl.classList.remove('on');});
      a.addEventListener('mousemove',function(e){fl.style.left=(e.clientX+170)+'px';fl.style.top=e.clientY+'px';});
    });
  }
  /* apparitions */
  var els=document.querySelectorAll('.day-head,.f-list li,.ref,.sizer,.contact h2,.phone,.form');
  els.forEach(function(e){e.classList.add('rv');});
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -10% 0px'});els.forEach(function(e){io.observe(e);});}
  else els.forEach(function(e){e.classList.add('in');});
})();
