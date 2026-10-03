/* Scènes d'ambiance animées (canvas) : salle, gala, lancement, congrès, cocktail */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var P = {
    conference:{bg:['#0d0b33','#040310'],beams:['#3EE0F5','#2C3BFF','#8A5BFF','#3EE0F5'],bokeh:['#3EE0F5','#8A5BFF','#ffffff']},
    gala:{bg:['#241006','#070302'],beams:['#F4B63F','#FFD98A','#E3247A'],bokeh:['#F4B63F','#FFD98A','#ffefc8']},
    lancement:{bg:['#2a0630','#07010b'],beams:['#E3247A','#8A5BFF','#3EE0F5','#E3247A'],bokeh:['#E3247A','#8A5BFF','#ffffff']},
    congres:{bg:['#04252b','#020809'],beams:['#3EE0F5','#2CFFC4','#2C3BFF'],bokeh:['#2CFFC4','#3EE0F5','#ffffff']},
    cocktail:{bg:['#1d0c3d','#05030c'],beams:['#E3247A','#F4B63F','#8A5BFF'],bokeh:['#F4B63F','#E3247A','#8A5BFF','#ffffff']}
  };
  function rnd(s){return function(){s=(s*9301+49297)%233280;return s/233280;};}
  function Scene(cv){
    this.cv=cv;this.ctx=cv.getContext('2d');this.type=cv.dataset.scene||'conference';this.p=P[this.type];
    var r=rnd(this.type.length*97+cv.dataset.seed*1||13);
    this.bokeh=[];for(var i=0;i<46;i++)this.bokeh.push({x:r(),y:r()*.62,s:.006+r()*.03,c:this.p.bokeh[Math.floor(r()*this.p.bokeh.length)],ph:r()*6.3,a:.15+r()*.45});
    this.beams=[];for(var j=0;j<7;j++)this.beams.push({x:.08+j*.14+r()*.05,base:(r()-.5)*.6,sp:.25+r()*.35,ph:r()*6.3,w:.05+r()*.05,c:this.p.beams[j%this.p.beams.length]});
    this.heads=[];for(var k=0;k<3;k++){var n=7+k*2;for(var m=0;m<n;m++)this.heads.push({row:k,x:(m+.5+(r()-.5)*.35)/n,s:.9+r()*.25});}
    this.rand=r;this.size();this.on=false;
  }
  Scene.prototype.size=function(){var b=this.cv.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2);this.W=this.cv.width=Math.max(1,b.width*d);this.H=this.cv.height=Math.max(1,b.height*d);};
  Scene.prototype.draw=function(t){
    var c=this.ctx,W=this.W,H=this.H,p=this.p,i;
    c.globalCompositeOperation='source-over';c.globalAlpha=1;
    var g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,p.bg[0]);g.addColorStop(1,p.bg[1]);c.fillStyle=g;c.fillRect(0,0,W,H);
    /* halo central */
    var h=c.createRadialGradient(W*.5,H*.45,0,W*.5,H*.45,W*.6);h.addColorStop(0,p.beams[0]+'40');h.addColorStop(1,'transparent');c.fillStyle=h;c.fillRect(0,0,W,H);
    c.globalCompositeOperation='lighter';
    /* bokeh */
    for(i=0;i<this.bokeh.length;i++){var b=this.bokeh[i],R=b.s*W,a=b.a*(.6+.4*Math.sin(t*.8+b.ph));var bg=c.createRadialGradient(b.x*W,b.y*H,0,b.x*W,b.y*H,R);bg.addColorStop(0,b.c);bg.addColorStop(.55,b.c+'55');bg.addColorStop(1,'transparent');c.globalAlpha=a;c.fillStyle=bg;c.beginPath();c.arc(b.x*W,b.y*H,R,0,6.29);c.fill();}
    /* faisceaux lumineux */
    for(i=0;i<this.beams.length;i++){var e=this.beams[i],ang=e.base+Math.sin(t*e.sp+e.ph)*.32,x0=e.x*W,len=H*1.25,w=e.w*W;
      var x1=x0+Math.sin(ang)*len,y1=Math.cos(ang)*len;
      var lg=c.createLinearGradient(x0,0,x1,y1);lg.addColorStop(0,e.c+'cc');lg.addColorStop(.5,e.c+'33');lg.addColorStop(1,'transparent');
      c.globalAlpha=.55;c.fillStyle=lg;c.beginPath();c.moveTo(x0-w*.08,0);c.lineTo(x0+w*.08,0);c.lineTo(x1+w,y1);c.lineTo(x1-w,y1);c.closePath();c.fill();
      c.globalAlpha=1;var sp=c.createRadialGradient(x0,0,0,x0,0,w*.6);sp.addColorStop(0,'#ffffff');sp.addColorStop(1,'transparent');c.fillStyle=sp;c.beginPath();c.arc(x0,0,w*.6,0,6.29);c.fill();}
    c.globalCompositeOperation='source-over';c.globalAlpha=1;
    this['d_'+this.type](c,W,H,t);
    /* fumée basse */
    var f=c.createLinearGradient(0,H*.62,0,H);f.addColorStop(0,'transparent');f.addColorStop(1,p.beams[0]+'26');c.fillStyle=f;c.fillRect(0,H*.62,W,H*.38);
  };
  /* public de dos (aucun visage) */
  Scene.prototype.crowd=function(c,W,H,rim){
    for(var k=2;k>=0;k--){var y=H*(.86+k*.075)-H*.02,sc=W*(.028+k*.012);
      for(var i=0;i<this.heads.length;i++){var o=this.heads[i];if(o.row!==k)continue;var x=o.x*W,s=sc*o.s;
        c.fillStyle='#050308';c.beginPath();c.ellipse(x,y+s*1.9,s*1.9,s*1.4,0,Math.PI,0);c.fill();c.beginPath();c.ellipse(x,y,s*.78,s*.95,0,0,6.29);c.fill();
        c.strokeStyle=rim;c.globalAlpha=.55;c.lineWidth=Math.max(1,s*.12);c.beginPath();c.ellipse(x,y,s*.78,s*.95,0,Math.PI*1.1,Math.PI*1.9);c.stroke();c.globalAlpha=1;}}
  };
  Scene.prototype.led=function(c,x,y,w,h,cols,t){
    c.fillStyle='#000';c.fillRect(x-w*.012,y-w*.012,w*1.024,h+w*.024);
    var g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'#03051a');g.addColorStop(1,cols[1]+'aa');c.fillStyle=g;c.fillRect(x,y,w,h);
    c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.globalCompositeOperation='lighter';c.lineCap='round';
    for(var s=-1;s<=1;s+=2)for(var k=0;k<16;k++){var a=(10+k*5+Math.sin(t*.6+k)*2)*Math.PI/180,L=h*(.7+(k%5)*.12);
      c.strokeStyle=cols[k%cols.length];c.globalAlpha=.65;c.lineWidth=Math.max(1,w*.004*(1+k%3));c.beginPath();c.moveTo(x+w/2,y+h);
      c.quadraticCurveTo(x+w/2+s*L*.4*Math.cos(a*.7),y+h-L*.95,x+w/2+s*L*Math.cos(a)*1.5,y+h-L*Math.sin(a)*1.1-h*.15);c.stroke();}
    c.restore();c.globalAlpha=1;
  };
  Scene.prototype.d_conference=function(c,W,H,t){this.led(c,W*.2,H*.16,W*.6,H*.42,this.p.beams,t);c.fillStyle='#07060f';c.fillRect(W*.14,H*.6,W*.72,H*.05);this.crowd(c,W,H,this.p.beams[0]);};
  Scene.prototype.d_congres=function(c,W,H,t){this.led(c,W*.08,H*.18,W*.36,H*.26,this.p.beams,t);this.led(c,W*.56,H*.18,W*.36,H*.26,this.p.beams,t+2);
    c.fillStyle='#0a0f12';c.beginPath();c.moveTo(W*.45,H*.5);c.lineTo(W*.55,H*.5);c.lineTo(W*.53,H*.68);c.lineTo(W*.47,H*.68);c.fill();c.fillStyle=this.p.beams[1];c.fillRect(W*.45,H*.5,W*.1,H*.008);
    this.crowd(c,W,H,this.p.beams[1]);};
  Scene.prototype.d_lancement=function(c,W,H,t){var cx=W*.5,g=c.createRadialGradient(cx,H*.55,0,cx,H*.55,W*.3);g.addColorStop(0,'#ffffff55');g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(0,0,W,H);
    c.fillStyle='#0c0710';c.beginPath();c.ellipse(cx,H*.7,W*.2,H*.045,0,0,6.29);c.fill();c.fillRect(cx-W*.2,H*.66,W*.4,H*.04);
    var d=c.createLinearGradient(cx-W*.1,0,cx+W*.1,0);d.addColorStop(0,'#3a0b2a');d.addColorStop(.45,'#E3247A');d.addColorStop(.6,'#ff8fc0');d.addColorStop(1,'#3a0b2a');c.fillStyle=d;
    c.beginPath();c.moveTo(cx-W*.09,H*.66);c.quadraticCurveTo(cx-W*.1,H*.42,cx,H*.36);c.quadraticCurveTo(cx+W*.1,H*.42,cx+W*.09,H*.66);c.closePath();c.fill();
    this.crowd(c,W,H,this.p.beams[0]);};
  Scene.prototype.d_gala=function(c,W,H,t){var p=this.p;
    for(var s=0;s<3;s++){c.strokeStyle='#ffffff22';c.lineWidth=1;c.beginPath();var y0=H*(.08+s*.07);c.moveTo(0,y0);c.quadraticCurveTo(W*.5,y0+H*.12,W,y0);c.stroke();
      for(var i=0;i<=24;i++){var u=i/24,x=u*W,y=(1-u)*(1-u)*y0+2*u*(1-u)*(y0+H*.12)+u*u*y0;var a=.6+.4*Math.sin(t*2+i+s);var gl=c.createRadialGradient(x,y,0,x,y,W*.012);gl.addColorStop(0,'#FFE7A8');gl.addColorStop(1,'transparent');c.globalAlpha=a;c.fillStyle=gl;c.beginPath();c.arc(x,y,W*.012,0,6.29);c.fill();}}
    c.globalAlpha=1;
    var rows=[[.6,5,.055],[.72,4,.072],[.88,3,.1]];
    rows.forEach(function(r){for(var i=0;i<r[1];i++){var x=W*((i+.5)/r[1]),y=H*r[0],rw=W*r[2];
      var cl=c.createLinearGradient(x-rw,0,x+rw,0);cl.addColorStop(0,'#5a3d22');cl.addColorStop(.5,'#c9a46a');cl.addColorStop(1,'#5a3d22');c.fillStyle=cl;c.fillRect(x-rw,y,rw*2,rw*.6);c.beginPath();c.ellipse(x,y+rw*.6,rw,rw*.26,0,0,Math.PI);c.fill();c.fillStyle='#efdcb8';c.beginPath();c.ellipse(x,y,rw,rw*.26,0,0,6.29);c.fill();c.fillStyle='#1a0d06';for(var q=-1;q<=1;q+=2){c.fillRect(x+q*rw*1.12-rw*.08,y-rw*.35,rw*.16,rw*1);}
      c.fillStyle='#c9922e';c.fillRect(x-rw*.04,y-rw*.55,rw*.08,rw*.5);
      var fl=c.createRadialGradient(x,y-rw*.6,0,x,y-rw*.6,rw*.5);fl.addColorStop(0,'#FFE7A8');fl.addColorStop(1,'transparent');c.globalAlpha=.8+.2*Math.sin(t*5+i);c.fillStyle=fl;c.beginPath();c.arc(x,y-rw*.6,rw*.5,0,6.29);c.fill();c.globalAlpha=1;}});
  };
  Scene.prototype.d_cocktail=function(c,W,H,t){for(var i=0;i<5;i++){var x=W*(.12+i*.19),y=H*(.62+(i%2)*.1),r=W*.05;
      c.fillStyle='#0b0718';c.fillRect(x-r*.08,y,r*.16,H*.3);c.fillStyle='#f1eaff';c.beginPath();c.ellipse(x,y,r,r*.25,0,0,6.29);c.fill();
      for(var k=-1;k<=1;k+=2){c.strokeStyle='#ffffffcc';c.lineWidth=Math.max(1,W*.002);c.beginPath();c.moveTo(x+k*r*.4,y-r*.05);c.lineTo(x+k*r*.4,y-r*.35);c.stroke();c.fillStyle=this.p.beams[(i+k+2)%3]+'aa';c.beginPath();c.moveTo(x+k*r*.4-r*.15,y-r*.75);c.lineTo(x+k*r*.4+r*.15,y-r*.75);c.lineTo(x+k*r*.4,y-r*.35);c.fill();}}
    this.crowd(c,W,H,this.p.beams[0]);};
  var scenes=[];
  document.querySelectorAll('canvas[data-scene]').forEach(function(cv,i){cv.dataset.seed=i+1;var s=new Scene(cv);scenes.push(s);s.draw(1.5);});
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){scenes.forEach(function(s){if(s.cv===e.target)s.on=e.isIntersecting;});});});scenes.forEach(function(s){io.observe(s.cv);});}else scenes.forEach(function(s){s.on=true;});
  window.addEventListener('resize',function(){scenes.forEach(function(s){s.size();s.draw(1.5);});});
  if(reduce)return;
  var t0=performance.now();
  (function loop(now){var t=(now-t0)/1000;scenes.forEach(function(s){if(s.on)s.draw(t);});requestAnimationFrame(loop);})(t0);
})();
