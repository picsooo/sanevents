(function(){
  var root = document.documentElement.getAttribute('data-root') || '';
  var isV2 = document.documentElement.getAttribute('data-version') === 'moderne';
  var bar = document.createElement('div');
  bar.className = 'demo-bar';
  bar.textContent = 'Maquette de démonstration réalisée par Webminds · aucun formulaire n\u2019est enregistré';
  document.body.appendChild(bar);
  var pill = document.createElement('a');
  pill.className = 'vpill';
  pill.href = isV2 ? root + 'index.html' : root + 'v2/index.html';
  pill.innerHTML = '<i></i><span>' + (isV2 ? 'Découvrir la version corporate' : 'Découvrir la version moderne') + '</span>';
  document.body.appendChild(pill);
  var toast = document.createElement('div'); toast.className = 'toast'; toast.setAttribute('role','status'); document.body.appendChild(toast);
  window.sanToast = function(msg){ toast.textContent = msg; toast.classList.add('on'); clearTimeout(window.__tt); window.__tt = setTimeout(function(){toast.classList.remove('on')}, 4200); };
  document.querySelectorAll('form[data-fake]').forEach(function(f){
    f.addEventListener('submit', function(e){
      e.preventDefault();
      var ok = f.querySelector('.form-ok');
      if (ok){ ok.hidden = false; ok.scrollIntoView({block:'nearest',behavior:'smooth'}); }
      window.sanToast('Demande envoyée. L\u2019équipe SAN EVENT vous rappelle pour fixer le rendez-vous. (Démonstration : rien n\u2019est enregistré.)');
      f.reset();
    });
  });
  /* simulateur de salle */
  document.querySelectorAll('[data-calc]').forEach(function(c){
    var n = c.querySelector('[name=pax]'), out = c.querySelector('[data-out]'), nv = c.querySelector('[data-paxv]');
    var ratio = {theatre:1.0, classe:1.8, cabaret:1.6, banquet:1.4, cocktail:0.9};
    var label = {theatre:'en théâtre', classe:'en classe', cabaret:'en cabaret', banquet:'en banquet', cocktail:'en cocktail debout'};
    function run(){
      var p = +n.value, d = (c.querySelector('[name=dispo]:checked')||{}).value || 'theatre';
      nv.textContent = p;
      var m2 = Math.round(p * ratio[d] / 5) * 5;
      var extra = '';
      if (d === 'banquet') extra = ' · environ ' + Math.ceil(p/10) + ' tables rondes de 10';
      if (d === 'cabaret') extra = ' · environ ' + Math.ceil(p/6) + ' tables de 6';
      out.innerHTML = '<strong>' + m2 + ' m²</strong><span>de surface utile pour ' + p + ' personnes ' + label[d] + extra + '</span>';
    }
    c.addEventListener('input', run); run();
  });
  var y = document.querySelectorAll('[data-year]'); y.forEach(function(e){e.textContent = new Date().getFullYear();});
})();
