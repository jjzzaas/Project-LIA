(()=>{
  const versionText=()=>window.gameVersionText?.()||'Ver. 3.8';
  const wait=(ms,speed=1)=>new Promise(resolve=>setTimeout(resolve,Math.max(140,Math.round(ms/speed))));

  function renderSwordTraining(){
    const player={name:state.playerName,hp:48,maxHp:48,damage:14};
    const haru={name:'하루',hp:52,maxHp:52,damage:8};
    let turn='player',ended=false,speed=1;
    mount(`<main class="screen battle-intro"><div class="battle-start-flash">BATTLE START</div><div class="battle-start-sub">불완전한 한손검 실전 훈련</div><div class="version">${versionText()}</div></main>`,()=>setTimeout(start,1050));
    function start(){
      mount(`<main class="screen battle-screen training-battle-screen"><div class="battle-controls"><button id="swordSpeed" class="control-btn">×1</button><button class="control-btn locked" disabled>🔒 AUTO</button></div><div class="battle-layout battle-layout-v24"><section class="enemy-formation chapter3-enemies"><button class="battle-enemy-card is-targeted" data-sword-enemy><strong>하루</strong><div class="hp enemy-hp"><span id="swordHaruHp"></span></div><em id="swordHaruText">52 / 52</em></button>${[2,3,4,5].map(slot=>`<div class="battle-enemy-card is-empty"><span>적 ${slot}</span></div>`).join('')}</section><section class="battle-middle"><div class="turn-label" id="swordTurnLabel">아군 턴 · 행동할 캐릭터 선택</div><div class="battle-line" id="swordBattleLine">한손검을 든 주인공 카드를 터치하세요.</div></section><section class="battle-cards"><button class="battle-character-card" data-sword-player><span class="battle-card-order"></span><strong>${player.name}</strong><small>불완전한 한손검 · 피해 14</small><div class="hp"><span id="swordPlayerHp"></span></div><em id="swordPlayerText">48 / 48</em></button>${[2,3,4].map(slot=>`<div class="battle-character-card is-locked"><strong>슬롯 ${slot}</strong><small>파티원 미참가</small></div>`).join('')}</section></div><div class="battle-version">${versionText()}</div></main>`,()=>{
        const card=document.querySelector('[data-sword-player]'),enemy=document.querySelector('[data-sword-enemy]'),line=document.getElementById('swordBattleLine'),label=document.getElementById('swordTurnLabel'),speedBtn=document.getElementById('swordSpeed');
        const sync=()=>{document.getElementById('swordHaruHp').style.width=`${Math.max(0,haru.hp)/haru.maxHp*100}%`;document.getElementById('swordPlayerHp').style.width=`${Math.max(0,player.hp)/player.maxHp*100}%`;document.getElementById('swordHaruText').textContent=`${Math.max(0,haru.hp)} / ${haru.maxHp}`;document.getElementById('swordPlayerText').textContent=`${Math.max(0,player.hp)} / ${player.maxHp}`;};
        const complete=result=>{if(ended)return;ended=true;card.disabled=true;enemy.disabled=true;label.textContent='TRAINING COMPLETE';line.textContent=result==='win'?'흔들리던 검신이 마지막 일격에서 선명하게 고정되었습니다.':'주인공은 쓰러졌지만 손에서 검을 놓지 않았습니다.';localStorage.setItem('mongyeong.weapon','안정화된 한손검');setTimeout(()=>{line.textContent+=' 화면을 터치하여 계속';app.firstElementChild.addEventListener('click',next,{once:true});},650);};
        const haruTurn=async()=>{if(ended)return;turn='haru';card.disabled=true;label.textContent='상대 턴 · 하루';await wait(450,speed);player.hp-=haru.damage;line.textContent=`하루가 검의 빈틈을 파고들었습니다. ${haru.damage}의 피해.`;sync();if(player.hp<=0){await wait(500,speed);complete('lose');return;}await wait(600,speed);turn='player';card.disabled=false;card.classList.remove('is-acted');card.querySelector('.battle-card-order').textContent='';label.textContent='아군 턴 · 행동할 캐릭터 선택';line.textContent='한손검을 든 주인공 카드를 터치하세요.';};
        card.onclick=async()=>{if(turn!=='player'||ended||card.disabled)return;turn='busy';card.disabled=true;card.classList.add('is-acted');card.querySelector('.battle-card-order').textContent='1번째 행동';haru.hp-=player.damage;line.textContent=`${player.name}이 불완전한 한손검을 휘둘렀습니다. ${player.damage}의 피해.`;sync();if(haru.hp<=0){await wait(500,speed);complete('win');return;}await wait(450,speed);haruTurn();};
        speedBtn.onclick=()=>{speed=speed===1?2:speed===2?3:1;speedBtn.textContent=`×${speed}`;};sync();
      });
    }
  }

  function renderMomoRetry(){
    const momo={name:'모모',hp:34,maxHp:34,damage:6};
    const haru={name:'하루',hp:120,maxHp:120,damage:10};
    let turn='momo',ended=false,speed=1;
    mount(`<main class="screen battle-intro"><div class="battle-start-flash">BATTLE START</div><div class="battle-start-sub">모모의 재도전</div><div class="version">${versionText()}</div></main>`,()=>setTimeout(start,1050));
    function start(){
      mount(`<main class="screen battle-screen training-battle-screen"><div class="battle-controls"><button id="retrySpeed" class="control-btn">×1</button><button class="control-btn locked" disabled>🔒 AUTO</button></div><div class="battle-layout battle-layout-v24"><section class="enemy-formation chapter3-enemies"><button class="battle-enemy-card is-targeted" data-retry-enemy><strong>하루</strong><div class="hp enemy-hp"><span id="retryHaruHp"></span></div><em id="retryHaruText">120 / 120</em></button>${[2,3,4,5].map(slot=>`<div class="battle-enemy-card is-empty"><span>적 ${slot}</span></div>`).join('')}</section><section class="battle-middle"><div class="turn-label" id="retryTurnLabel">아군 턴 · 행동할 캐릭터 선택</div><div class="battle-line" id="retryBattleLine">모모 카드를 터치하세요. 이번에도 다크사이트는 사용하지 않습니다.</div></section><section class="battle-cards"><button class="battle-character-card" data-retry-player><span class="battle-card-order"></span><strong>모모</strong><small>투척 단검 · 피해 6</small><div class="hp"><span id="retryMomoHp"></span></div><em id="retryMomoText">34 / 34</em></button>${[2,3,4].map(slot=>`<div class="battle-character-card is-locked"><strong>슬롯 ${slot}</strong><small>파티원 미참가</small></div>`).join('')}</section></div><div class="battle-version">${versionText()}</div></main>`,()=>{
        const card=document.querySelector('[data-retry-player]'),enemy=document.querySelector('[data-retry-enemy]'),line=document.getElementById('retryBattleLine'),label=document.getElementById('retryTurnLabel'),speedBtn=document.getElementById('retrySpeed');
        const sync=()=>{document.getElementById('retryHaruHp').style.width=`${Math.max(0,haru.hp)/haru.maxHp*100}%`;document.getElementById('retryMomoHp').style.width=`${Math.max(0,momo.hp)/momo.maxHp*100}%`;document.getElementById('retryHaruText').textContent=`${Math.max(0,haru.hp)} / ${haru.maxHp}`;document.getElementById('retryMomoText').textContent=`${Math.max(0,momo.hp)} / ${momo.maxHp}`;};
        const complete=()=>{if(ended)return;ended=true;card.disabled=true;enemy.disabled=true;label.textContent='TRAINING COMPLETE';line.textContent='모모는 다시 쓰러졌지만, 첫 훈련보다 훨씬 오래 버텼습니다.';localStorage.setItem('mongyeong.autoUnlocked','1');setTimeout(()=>{line.textContent+=' 화면을 터치하여 계속';app.firstElementChild.addEventListener('click',next,{once:true});},650);};
        const haruTurn=async()=>{if(ended)return;turn='haru';card.disabled=true;label.textContent='상대 턴 · 하루';await wait(450,speed);momo.hp-=haru.damage;line.textContent=`하루가 모모의 빈틈을 짚었습니다. ${haru.damage}의 피해.`;sync();if(momo.hp<=0){await wait(500,speed);complete();return;}await wait(600,speed);turn='momo';card.disabled=false;card.classList.remove('is-acted');card.querySelector('.battle-card-order').textContent='';label.textContent='아군 턴 · 행동할 캐릭터 선택';line.textContent='모모 카드를 터치하세요. 이번에도 다크사이트는 사용하지 않습니다.';};
        card.onclick=async()=>{if(turn!=='momo'||ended||card.disabled)return;turn='busy';card.disabled=true;card.classList.add('is-acted');card.querySelector('.battle-card-order').textContent='1번째 행동';haru.hp=Math.max(1,haru.hp-momo.damage);line.textContent='모모가 하루를 똑바로 바라보며 단검을 던졌습니다. 6의 피해.';sync();await wait(450,speed);haruTurn();};
        speedBtn.onclick=()=>{speed=speed===1?2:speed===2?3:1;speedBtn.textContent=`×${speed}`;};sync();
      });
    }
  }

  function renderWeaponUpgrade(){
    localStorage.setItem('mongyeong.weapon','안정화된 한손검');
    mount(`<main class="screen status weapon-unlock-screen"><section class="box weapon-unlock-panel"><div class="reward-kicker">WEAPON STABILIZED</div><div class="weapon-glyph">†</div><div class="chapter-title">한손검</div><div class="text" style="margin-top:18px">불안정하던 검신이 형태를 유지하기 시작했습니다.<br>공격력이 상승했습니다.</div></section><div class="hint">터치하여 계속</div><div class="version">${versionText()}</div></main>`,()=>{app.firstElementChild.onclick=next;});
  }

  function renderAutoUnlock(){
    mount(`<main class="screen status speed-unlock-screen"><section class="box"><div class="chapter-title">AUTO UNLOCK</div><div class="text" style="margin-top:18px">전투 자동 진행 기능이 활성화되었습니다.</div></section><div class="hint">터치하여 계속</div><div class="version">${versionText()}</div></main>`,()=>{app.firstElementChild.onclick=next;});
  }

  const previousRenderScene=renderScene;
  renderScene=function(scene){
    if(scene.type==='swordTrainingBattle'){renderSwordTraining();return;}
    if(scene.type==='momoRetryBattle'){renderMomoRetry();return;}
    if(scene.type==='weaponUpgrade'){renderWeaponUpgrade();return;}
    if(scene.type==='autoUnlock'){renderAutoUnlock();return;}
    previousRenderScene(scene);
  };
})();
