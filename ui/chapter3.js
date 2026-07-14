(()=>{
  const previousRenderScene=renderScene;
  const exitButtonStyle='position:absolute;left:18px;top:calc(18px + env(safe-area-inset-top));z-index:4;border:1px solid rgba(255,255,255,.28);background:rgba(5,8,14,.72);color:#fff;border-radius:12px;padding:11px 15px;font-size:15px;backdrop-filter:blur(8px)';
  const rollbackKey='mongyeong.v21FieldRewardRollback';

  if(!localStorage.getItem(rollbackKey)){
    if(state.credits===5000){state.credits=0;save()}
    localStorage.setItem(rollbackKey,'1');
  }

  function renderMomoService(){mount(`<main class="screen lodging"><section class="box"><div class="text">처음 보는 여자아이가—<br><br>바로 옆에서 자고 있었다.</div></section><div class="hint">터치하여 계속</div><div class="version">Ver. 2.1</div></main>`,()=>app.firstElementChild.onclick=next)}
  function renderMomoAwake(scene){mount(`<main class="screen lodging"><section class="box"><div class="speaker">${scene.speaker}</div><div class="text">${scene.text}</div></section><div class="hint">터치하여 계속</div><div class="version">Ver. 2.1</div></main>`,()=>app.firstElementChild.onclick=next)}
  function renderExit(scene,screenType,label){mount(`<main class="screen ${screenType}"><button id="sceneExit" aria-label="${label}" style="${exitButtonStyle}">← ${label}</button><section class="box"><div class="text">${scene.text}</div></section><div class="version">Ver. 2.1</div></main>`,()=>document.getElementById('sceneExit').onclick=next)}
  function renderLobbyPause(scene){mount(`<main class="screen main-lobby"><header class="lobby-top"><div class="level-badge">Lv. ${state.level}</div><div class="stamina"><span>활력</span><b>${state.stamina} / ${state.maxStamina}</b></div><div class="credits"><span>크레딧</span><b>${state.credits.toLocaleString()}</b></div><button class="mission-btn">임무</button></header><section class="hero-zone"><div class="hero-placeholder">HEROINE</div><div class="speech"><strong>${scene.speaker||'모모'}</strong><p>${scene.text.replace(/\n/g,'<br>')}</p></div></section><nav class="tiles"><button class="tile" disabled><span>01</span><strong>길드</strong></button><button class="tile" disabled><span>02</span><strong>숙소</strong></button><button class="tile" disabled><span>03</span><strong>잠김</strong></button>${[4,5,6].map(n=>`<button class="tile" disabled><span>0${n}</span><strong>잠김</strong></button>`).join('')}</nav><div class="hint">터치하여 계속</div><div class="version">Ver. 2.1</div></main>`,()=>app.firstElementChild.onclick=next)}
  function renderMissionComplete(scene){mount(`<main class="screen reward-screen"><section class="reward-panel"><div class="reward-kicker">OBJECTIVE COMPLETE</div><div class="reward-title">목표 달성</div><div class="reward-exp">${scene.title}<br><strong>보상은 길드 보고 후 지급됩니다.</strong><br><small>현재 보유 크레딧 ${state.credits.toLocaleString()}</small></div></section><div class="hint">터치하여 계속</div><div class="version">Ver. 2.1</div></main>`,()=>app.firstElementChild.onclick=next)}

  renderScene=function(scene){
    if(scene.type==='momo-service'){renderMomoService();return}
    if(scene.type==='momo-awake'){renderMomoAwake(scene);return}
    if(scene.type==='lodgingExit'){renderExit(scene,'lodging','나가기');return}
    if(scene.type==='guildExit'){renderExit(scene,'guild','나가기');return}
    if(scene.type==='lobbyPause'){renderLobbyPause(scene);return}
    if(scene.type==='missionComplete'){renderMissionComplete(scene);return}
    previousRenderScene(scene);
  };
})();