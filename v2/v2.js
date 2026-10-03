(function(){
  var hall=document.getElementById('hall'), cv=document.getElementById('led'), ctx=cv.getContext('2d');
  var typed=document.getElementById('typed'), line=document.getElementById('ledLine');
  var sw=document.getElementById('switch'), swl=document.getElementById('switchLabel');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MOODS={
    convention:{cols:['#9EE6FF','#38B6FF','#2F6BFF','#1E2FD8','#d8f3ff'],glow:'#1E2FD8',speed:.6,spread:1,text:'Convention annuelle',bg:['#02061c','#071a66']},
    lancement:{cols:['#ffffff','#9EE6FF','#38B6FF','#d8f3ff'],glow:'#38B6FF',speed:1.6,spread:1.25,text:'Le lancement',bg:['#00040f','#04335a']},
    gala:{cols:['#FFE7C4','#E9B65C','#C9922E','#fff4e0'],glow:'#C9922E',speed:.4,spread:.85,text:'Soirée de gala',bg:['#0c0602','#3a2208']},
    congres:{cols:['#9EE6FF','#3FD0C9','#127C86','#e6fffd'],glow:'#127C86',speed:.5,spread:.95,text:'Journées d\u2019étude',bg:['#000c0d','#073b40']}
  };
  var mood='convention', on=false, power=0, t0=performance.now();
  var rays=[];
  function seed(){rays=[];for(var s=-1;s<=1;s+=2)for(var k=0;k<38;k++)rays.push({s:s,a:8+k*2.3+Math.random()*2,L:.45+Math.random()*.6,w:.6+Math.random()*2.2,o:.35+Math.random()*.6,c:Math.random(),ph:Math.random()*6.28});}
  seed();
  function size(){var r=cv.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2);cv.width=r.width*d;cv.height=r.height*d;}
  size(); window.addEventListener('resize',size);
  function frame(now){
    var m=MOODS[mood], W=cv.width, H=cv.height, t=(now-t0)/1000;
    power+=((on?1:0)-power)*0.04;
    var g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,m.bg[0]);g.addColorStop(1,m.bg[1]);
    ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;ctx.fillStyle='#03040c';ctx.fillRect(0,0,W,H);
    ctx.globalAlpha=power;ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
    var x0=W/2,y0=H*0.98;
    for(var i=0;i<rays.length;i++){
      var r=rays[i];var sway=reduce?0:Math.sin(t*m.speed+r.ph)*3;
      var ang=(r.a*m.spread+sway)*Math.PI/180, L=r.L*H*1.15;
      var grow=Math.min(1,power*1.15);
      var x1=x0+r.s*L*Math.cos(ang)*1.55*grow, y1=y0-(L*Math.sin(ang)*1.1+H*.12)*grow;
      var cx=x0+r.s*L*.42*Math.cos(ang*.7)*grow, cy=y0-L*.95*grow;
      ctx.globalAlpha=r.o*power;ctx.strokeStyle=m.cols[Math.floor(r.c*m.cols.length)];ctx.lineWidth=r.w*(W/600);
      ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo(cx,cy,x1,y1);ctx.stroke();
    }
    for(var j=0;j<40;j++){var px=(Math.sin(j*91.7)*.5+.5)*W, py=(Math.cos(j*37.3)*.5+.5)*H*.9;var tw=.5+.5*Math.sin(t*2+j);ctx.globalAlpha=power*tw*.8;ctx.fillStyle='#e8f7ff';ctx.beginPath();ctx.arc(px,py,(1+(j%3))*(W/900),0,6.28);ctx.fill();}
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  /* texte écrit en JS (pas d'animation CSS width : Safari iPhone) */
  var timer=null;
  function type(txt,cb){clearTimeout(timer);var i=0;(function step(){typed.innerHTML=txt.slice(0,i).replace(/\n/g,'<br>')+'<span class="c"></span>';if(i++<txt.length){timer=setTimeout(step,reduce?0:55);}else if(cb){timer=setTimeout(cb,700);}})();}
  type('On imagine.');
  function setMood(k){mood=k;var m=MOODS[k];hall.style.setProperty('--glow',m.glow);line.textContent=m.text;
    document.querySelectorAll('#console button').forEach(function(b){b.setAttribute('aria-checked',b.dataset.mood===k);});}
  setMood('convention');
  sw.addEventListener('click',function(){
    on=!on;hall.dataset.state=on?'on':'off';swl.textContent=on?'Éteindre la salle':'Allumer la salle';
    if(on){type('On crée.',function(){type('Vous vibrez.');});}else{type('On imagine.');}
  });
  document.querySelectorAll('#console button').forEach(function(b){b.addEventListener('click',function(){setMood(b.dataset.mood);seed();});});
})();
