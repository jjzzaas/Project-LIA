(()=>{
  const versionText=()=>window.gameVersionText?.()||'Ver. 3.5';

  function topBar(){return `<header class="lobby-top"><div class="level-badge">Lv. ${state.level}</div><div class="stamina"><span>활력</span><b>${state.stamina} / ${state.maxStamina}</b></div><div class="credits"><span>크레딧</span><b>${state.credits.toLocaleString()}</b></div><button class="mission-btn" type="button">임무</button></header>`}

  function openMission(scene){
    const overlay=document.createElement('section');overlay.className='mission-overlay';
    overlay.innerHTML=`<div class="mission-panel"><button class="mission-close">×</button><div class="mission-kicker">MAIN MISSION</div><h2>${scene.missionTitle||'CHAPTER 3 · 낯선 동침자'}</h2><div class="mission-current"><small>현재 목표</small><strong>${scene.missionGoal||'외곽으로 이동하세요.'}</strong></div><div class="mission-progress"><span style="width:${scene.missionProgress||60}%"></span></div><div class="mission-reward"><small>챕터 클리어 보상</small><strong>10,000 크레딧</strong></div></div>`;
    document.querySelector('.main-lobby').appendChild(overlay);overlay.querySelector('.mission-close').onclick=()=>overlay.remove();
  }

  renderMainLobby=function(scene){
    const destination=scene.destination||'guild';
    const guildActive=destination==='guild';
    const lodgingActive=destination==='lodging';
    const exteriorActive=destination==='exterior';
    const villageActive=destination==='village';
    const guide=guildActive?'길드로 이동하세요':lodgingActive?'숙소로 이동하세요':exteriorActive?'외곽으로 이동하세요':'헌터 지구로 이동하세요';

    mount(`<main class="screen main-lobby">${topBar()}<section class="hero-zone"><div class="hero-placeholder">HEROINE</div><div class="speech"><strong>${scene.speaker||'하루'}</strong><p>${scene.text.replace(/\n/g,'<br>')}</p></div></section><nav class="tiles"><button class="tile guild-tile ${guildActive?'active-tile':''}" ${guildActive?'':'disabled'}><span>01</span><strong>길드</strong></button><button class="tile lodging-tile ${lodgingActive?'active-tile':''}" ${lodgingActive?'':'disabled'}><span>02</span><strong>숙소</strong></button><button class="tile exterior-tile ${exteriorActive?'active-tile':''}" ${exteriorActive?'':'disabled'}><span>03</span><strong>외곽</strong></button><button class="tile village-tile ${villageActive?'active-tile':''}" ${villageActive?'':'disabled'}><span>04</span><strong>헌터 지구</strong></button>${[5,6].map(n=>`<button class="tile" disabled><span>0${n}</span><strong>잠김</strong></button>`).join('')}</nav><div class="tile-guide">${guide}</div><div class="version">${versionText()}</div></main>`,()=>{
      const target=guildActive?document.querySelector('.guild-tile'):lodgingActive?document.querySelector('.lodging-tile'):exteriorActive?document.querySelector('.exterior-tile'):document.querySelector('.village-tile');
      if(target)target.onclick=next;
      document.querySelector('.mission-btn').onclick=()=>openMission(scene);
    });
  };
})();
