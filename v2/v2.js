(function(){
  var hall=document.getElementById('hall'), typed=document.getElementById('typed'), line=document.getElementById('ledLine');
  var sw=document.getElementById('switch'), swl=document.getElementById('switchLabel');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MOODS={
    convention:{glow:'#2C3BFF',screen:'Convention annuelle',k:'Convention',t:'Séminaires et conventions',d:'Plénières, ateliers, intervenants : un programme mis en scène, de l\u2019accueil à la clôture.',c:'Préparer votre convention',l:[['Le lieu','Hôtel, centre de conférence ou espace atypique, selon la jauge.'],['La scène','Écran LED, habillage à vos couleurs, pupitre et régie.'],['Le jour J','Accueil, badges, timing des interventions, pauses.']]},
    lancement:{glow:'#3EE0F5',screen:'Le lancement',k:'Lancement',t:'Lancements de produit',d:'Un moment fort pour révéler une nouveauté à la presse, aux partenaires et au réseau.',c:'Préparer votre lancement',l:[['Le dévoilement','Mise en scène de la révélation : lumière, son, compte à rebours.'],['Les invités','Presse, distributeurs, partenaires : invitations et accueil.'],['L\u2019image','Photo et vidéo prêtes pour vos réseaux le soir même.']]},
    gala:{glow:'#F4B63F',screen:'Soirée de gala',k:'Gala',t:'Soirées de gala et dîners',d:'Décor, lumière et déroulé pour remercier, célébrer et marquer les esprits.',c:'Préparer votre soirée',l:[['Le décor','Tables, centres de table, éclairage d\u2019ambiance.'],['Le déroulé','Discours, remises de prix, animation et musique.'],['Le dîner','Traiteur, service et plan de table.']]},
    congres:{glow:'#2CFFC4',screen:'Journées d\u2019étude',k:'Congrès',t:'Congrès et journées d\u2019étude',d:'Salles, badges, régie et écrans pour des journées professionnelles fluides.',c:'Préparer votre congrès',l:[['Les inscriptions','Liste des participants, badges et accueil.'],['Les salles','Plénière et ateliers, sonorisés et équipés.'],['La logistique','Pauses, déjeuners, hébergement des intervenants.']]}
  };
  var mood='convention', on=false;
  var timer=null;
  function type(txt,cb){clearTimeout(timer);var i=0;(function step(){typed.innerHTML=txt.slice(0,i)+'<span class="c"></span>';if(i++<txt.length){timer=setTimeout(step,reduce?0:55);}else if(cb){timer=setTimeout(cb,700);}})();}
  type('On imagine.');
  var K=document.getElementById('sceneK'),T=document.getElementById('sceneT'),D=document.getElementById('sceneD'),L=document.getElementById('sceneL'),C=document.getElementById('sceneC'),panel=document.getElementById('scene');
  function setMood(k,anim){mood=k;var m=MOODS[k];hall.style.setProperty('--glow',m.glow);document.documentElement.style.setProperty('--accent',m.glow);line.textContent=m.screen;
    document.querySelectorAll('#console button').forEach(function(b){b.setAttribute('aria-checked',b.dataset.mood===k);});
    document.querySelectorAll('#screen .shot').forEach(function(im){im.classList.toggle('on',im.dataset.mood===k);});
    if(anim){panel.classList.remove('swap');void panel.offsetWidth;panel.classList.add('swap');hall.classList.remove('blink');void hall.offsetWidth;hall.classList.add('blink');}
    K.textContent=m.k;T.textContent=m.t;D.textContent=m.d;C.textContent=m.c;
    L.innerHTML=m.l.map(function(x){return '<li><strong>'+x[0]+'</strong><span>'+x[1]+'</span></li>';}).join('');}
  setMood('convention',false);
  sw.addEventListener('click',function(){
    on=!on;hall.dataset.state=on?'on':'off';swl.textContent=on?'Éteindre la salle':'Allumer la salle';
    if(on){type('On crée.',function(){type('Vous vibrez.');});}else{type('On imagine.');}
  });
  document.querySelectorAll('#console button').forEach(function(b){b.addEventListener('click',function(){
    if(!on){on=true;hall.dataset.state='on';swl.textContent='Éteindre la salle';type('Vous vibrez.');}
    setMood(b.dataset.mood,true);});});
})();
