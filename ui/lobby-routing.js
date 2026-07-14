(()=>{
  const originalVersion='1.9';

  renderMainLobby=function(scene){
    const destination=scene.destination||'guild';
    const guildActive=destination==='guild';
    const lodgingActive=destination==='lodging';
    const exteriorActive=destination==='exterior';
    const guide=guildActive?'빛나는 길드 타일을 선택하세요':lodgingActive?'새로 열린 숙소 타일을 선택하세요':'새로 열린 외곽 타일을 선택하세요';

    mount(`<main class="screen main-lobby"><header class="lobby-top"><div class="level-badge">Lv. ${state.level}</div><div class="stamina"><span>활력도</span><div><i></i></div><b>100 / 100</b></div><button class="mission-btn">임무</button></header><section class="hero-zone"><div class="hero-placeholder">HEROINE</div><div class="speech"><strong>${scene.speaker||'하루'}</strong><p>${scene.text.replace(/\n/g,'<br>')}</p></div></section><nav class="tiles"><button class="tile guild-tile ${guildActive?'active-tile':''}" ${guildActive?'':'disabled'}><span>01</span><strong>길드</strong></button><button class="tile lodging-tile ${lodgingActive?'active-tile':''}" ${lodgingActive?'':'disabled'}><span>02</span><strong>숙소</strong></button><button class="tile exterior-tile ${exteriorActive?'active-tile':''}" ${exteriorActive?'':'disabled'}><span>03</span><strong>외곽</strong></button>${[4,5,6].map(n=>`<button class="tile" disabled><span>0${n}</span><strong>잠김</strong></button>`).join('')}</nav><div class="tile-guide">${guide}</div><div class="version">Ver. ${originalVersion}</div></main>`,()=>{
      const target=guildActive?document.querySelector('.guild-tile'):lodgingActive?document.querySelector('.lodging-tile'):document.querySelector('.exterior-tile');
      if(target)target.onclick=next;
    });
  };
})();
