(()=>{
  const versionText=()=>window.gameVersionText?.()||'Ver. 3.6';

  function renderTrainingBattle(){
    const player={name:state.playerName,hp:42,maxHp:42,damage:8};
    const haru={name:'하루',hp:38,maxHp:38,damage:7};
    let playerTurn=true;
    let ended=false;

    mount(`<main class="screen battle-intro">
      <div class="battle-start-flash">BATTLE START</div>
      <div class="battle-start-sub">하루와의 기초 공격 훈련</div>
      <div class="version">${versionText()}</div>
    </main>`,()=>setTimeout(startBattle,1050));

    function startBattle(){
      mount(`<main class="screen battle-screen training-battle-screen">
        <div class="battle-controls"><button class="control-btn locked" disabled>🔒 ×1</button><button class="control-btn locked" disabled>🔒 AUTO</button></div>
        <div class="battle-layout battle-layout-v24">
          <section class="enemy-formation chapter3-enemies">
            <button class="battle-enemy-card is-targeted" data-training-enemy>
              <strong>하루</strong>
              <div class="hp enemy-hp"><span id="trainingHaruHp"></span></div>
              <em id="trainingHaruText">${haru.hp} / ${haru.maxHp}</em>
            </button>
            ${[2,3,4,5].map(slot=>`<div class="battle-enemy-card is-empty"><span>적 ${slot}</span></div>`).join('')}
          </section>
          <section class="battle-middle">
            <div class="turn-label" id="trainingTurnLabel">아군 턴 · 행동할 캐릭터 선택</div>
            <div class="battle-line" id="trainingBattleLine">주인공 카드를 터치하세요.</div>
          </section>
          <section class="battle-cards">
            <button class="battle-character-card" data-training-player>
              <span class="battle-card-order"></span>
              <strong>${player.name}</strong>
              <small>맨손 공격 · 피해 ${player.damage}</small>
              <div class="hp"><span id="trainingPlayerHp"></span></div>
              <em id="trainingPlayerText">${player.hp} / ${player.maxHp}</em>
            </button>
            ${[2,3,4].map(slot=>`<div class="battle-character-card is-locked"><strong>슬롯 ${slot}</strong><small>파티원 미참가</small></div>`).join('')}
          </section>
        </div>
        <div class="battle-version">${versionText()}</div>
      </main>`,()=>{
        const playerCard=document.querySelector('[data-training-player]');
        const enemyCard=document.querySelector('[data-training-enemy]');
        const line=document.getElementById('trainingBattleLine');
        const label=document.getElementById('trainingTurnLabel');

        function sync(){
          document.getElementById('trainingHaruHp').style.width=`${Math.max(0,haru.hp)/haru.maxHp*100}%`;
          document.getElementById('trainingPlayerHp').style.width=`${Math.max(0,player.hp)/player.maxHp*100}%`;
          document.getElementById('trainingHaruText').textContent=`${Math.max(0,haru.hp)} / ${haru.maxHp}`;
          document.getElementById('trainingPlayerText').textContent=`${Math.max(0,player.hp)} / ${player.maxHp}`;
          enemyCard.classList.toggle('is-defeated',haru.hp<=0);
          playerCard.classList.toggle('is-defeated',player.hp<=0);
        }

        function complete(result){
          if(ended)return;
          ended=true;
          playerCard.disabled=true;
          enemyCard.disabled=true;
          label.textContent='TRAINING COMPLETE';
          line.textContent=result==='win'?'하루가 한 걸음 물러서며 훈련을 종료했습니다.':'하루가 쓰러지는 주인공을 붙잡고 훈련을 종료했습니다.';
          localStorage.setItem('mongyeong.speedUnlocked','1');
          setTimeout(()=>{
            line.textContent+=' 화면을 터치하여 계속';
            app.firstElementChild.addEventListener('click',next,{once:true});
          },650);
        }

        function haruTurn(){
          if(ended)return;
          playerTurn=false;
          playerCard.disabled=true;
          label.textContent='상대 턴 · 하루';
          setTimeout(()=>{
            player.hp-=haru.damage;
            line.textContent=`하루가 주인공의 빈틈을 짚었습니다. ${haru.damage}의 피해.`;
            sync();
            if(player.hp<=0){setTimeout(()=>complete('lose'),500);return;}
            setTimeout(()=>{
              playerTurn=true;
              playerCard.disabled=false;
              playerCard.classList.remove('is-acted');
              playerCard.querySelector('.battle-card-order').textContent='';
              label.textContent='아군 턴 · 행동할 캐릭터 선택';
              line.textContent='주인공 카드를 터치하세요.';
            },600);
          },450);
        }

        playerCard.onclick=()=>{
          if(!playerTurn||ended||playerCard.disabled)return;
          playerTurn=false;
          playerCard.disabled=true;
          playerCard.classList.add('is-acted');
          playerCard.querySelector('.battle-card-order').textContent='1번째 행동';
          haru.hp-=player.damage;
          line.textContent=`${player.name}이 맨손으로 하루를 공격했습니다. ${player.damage}의 피해.`;
          sync();
          if(haru.hp<=0){setTimeout(()=>complete('win'),500);return;}
          setTimeout(haruTurn,450);
        };

        sync();
      });
    }
  }

  function renderSpeedUnlock(){
    mount(`<main class="screen status speed-unlock-screen"><section class="box"><div class="chapter-title">SPEED UNLOCK</div><div class="text" style="margin-top:18px">전투 배속 기능이 활성화되었습니다.<br>×1 · ×2 · ×3</div></section><div class="hint">터치하여 계속</div><div class="version">${versionText()}</div></main>`,()=>{app.firstElementChild.onclick=next;});
  }

  const originalRenderScene=renderScene;
  renderScene=function(scene){
    if(scene.type==='trainingBattle'){renderTrainingBattle();return;}
    if(scene.type==='speedUnlock'){renderSpeedUnlock();return;}
    originalRenderScene(scene);
  };
})();
