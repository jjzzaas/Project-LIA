(()=>{
  const effects=window.BattleEffects;
  if(!effects||typeof window.renderBattle!=='function')return;

  window.renderBattle=function renderChapter1BattleWithEffects(){
    let enemy=90;
    let player=42;
    let haru=48;
    let phase='player';
    let haruSpecialUsed=false;
    let actionLocked=false;

    mount(`<main class="screen battle-screen chapter1-effect-battle">
      <div class="battle-controls">
        <button class="control-btn locked">×1 잠김</button>
        <button class="control-btn locked">AUTO 잠김</button>
      </div>
      <div class="battle-layout">
        <section class="battle-top" id="chapter1Enemy">
          <div class="unit-head"><span>정체불명의 생명체</span><span id="enemyText">90 / 90</span></div>
          <div class="hp enemy-hp"><span id="enemyHp"></span></div>
        </section>
        <section class="battle-middle">
          <div class="turn-label" id="turnLabel"></div>
          <div class="battle-line" id="battleLine"></div>
        </section>
        <section class="allies">
          <div class="ally-panel battle-unit-card" id="chapter1Player" role="button" tabindex="0" aria-label="${state.playerName} 일반 공격">
            <div class="unit-head"><span>${state.playerName}</span><span id="playerText">42 / 42</span></div>
            <div class="hp"><span id="playerHp"></span></div>
            <div class="unit-action-label">카드를 터치해 공격</div>
          </div>
          <div class="ally-panel battle-unit-card" id="chapter1Haru" role="button" tabindex="0" aria-label="하루 일반 공격">
            <div class="unit-head"><span>하루</span><span id="haruText">48 / 48</span></div>
            <div class="hp"><span id="haruHp"></span></div>
            <div class="unit-action-label">카드를 터치해 공격</div>
          </div>
        </section>
      </div>
      <div class="battle-version">${window.gameVersionText?window.gameVersionText():'Ver. 8.0'}</div>
    </main>`,()=>{
      const line=document.getElementById('battleLine');
      const label=document.getElementById('turnLabel');
      const enemyElement=document.getElementById('chapter1Enemy');
      const playerElement=document.getElementById('chapter1Player');
      const haruElement=document.getElementById('chapter1Haru');
      const allyCards=[playerElement,haruElement];

      function sync(){
        document.getElementById('enemyHp').style.width=`${Math.max(0,enemy)/90*100}%`;
        document.getElementById('playerHp').style.width=`${Math.max(0,player)/42*100}%`;
        document.getElementById('haruHp').style.width=`${Math.max(0,haru)/48*100}%`;
        document.getElementById('enemyText').textContent=`${Math.max(0,enemy)} / 90`;
        document.getElementById('playerText').textContent=`${Math.max(0,player)} / 42`;
        document.getElementById('haruText').textContent=`${Math.max(0,haru)} / 48`;
      }

      function setPhase(nextPhase){
        phase=nextPhase;
        allyCards.forEach(card=>card.classList.remove('active-turn','disabled-turn'));
        if(actionLocked){
          allyCards.forEach(card=>card.classList.add('disabled-turn'));
        }else if(phase==='player'){
          playerElement.classList.add('active-turn');
          haruElement.classList.add('disabled-turn');
        }else if(phase==='haru'){
          haruElement.classList.add('active-turn');
          playerElement.classList.add('disabled-turn');
        }else{
          allyCards.forEach(card=>card.classList.add('disabled-turn'));
        }
        if(phase==='player')label.textContent=`아군 1 · ${state.playerName}`;
        else if(phase==='haru')label.textContent='아군 2 · 하루';
        else label.textContent='적 1 · 정체불명의 생명체';
      }

      function victory(){
        actionLocked=true;
        setPhase('enemy');
        label.textContent='VICTORY';
        line.textContent='화면을 터치하여 계속';
        app.firstElementChild.addEventListener('click',next,{once:true});
      }

      async function enemyTurn(){
        actionLocked=true;
        setPhase('enemy');
        await effects.wait(300);
        const targetPlayer=Math.random()<0.5;
        const damage=8;
        const targetElement=targetPlayer?playerElement:haruElement;
        await effects.playAttack({
          attacker:enemyElement,
          target:targetElement,
          type:'claw',
          damage,
          onImpact:()=>{
            if(targetPlayer){
              player-=damage;
              line.textContent=`검은 발톱이 ${state.playerName}을 덮쳤다. ${damage}의 피해.`;
            }else{
              haru-=damage;
              line.textContent=`검은 생명체가 하루에게 달려들었다. ${damage}의 피해.`;
            }
            sync();
          }
        });
        await effects.wait(260);
        actionLocked=false;
        line.textContent=`${state.playerName}의 차례입니다. 카드를 터치하세요.`;
        setPhase('player');
      }

      async function tryHaruSpecial(){
        if(haruSpecialUsed||Math.random()>=0.35)return false;
        haruSpecialUsed=true;
        label.textContent='SPECIAL SKILL';
        line.innerHTML='<strong>하루 — 천체낙하</strong><br>푸른 천체의 빛이 적 전체를 덮쳤다. 24의 광역 피해!';
        await effects.playAttack({
          attacker:haruElement,
          target:enemyElement,
          type:'energy',
          projectileType:'energy',
          damage:24,
          heavy:true,
          onImpact:()=>{enemy-=24;sync();}
        });
        return true;
      }

      async function playerAttack(){
        if(actionLocked||phase!=='player')return;
        actionLocked=true;
        setPhase('player');
        const damage=10;
        line.textContent=`${state.playerName}이 맨손으로 파고들었다. ${damage}의 피해.`;
        await effects.playAttack({
          attacker:playerElement,
          target:enemyElement,
          type:'impact',
          damage,
          onImpact:()=>{enemy-=damage;sync();}
        });
        if(enemy<=0){victory();return;}
        await effects.wait(180);
        actionLocked=false;
        line.textContent='하루의 차례입니다. 카드를 터치하세요.';
        setPhase('haru');
      }

      async function haruAttack(){
        if(actionLocked||phase!=='haru')return;
        actionLocked=true;
        setPhase('haru');
        const damage=14;
        line.textContent='하루의 빛의 화살이 검은 몸을 꿰뚫었다.';
        await effects.playAttack({
          attacker:haruElement,
          target:enemyElement,
          type:'pierce',
          projectileType:'arrow',
          damage,
          onImpact:()=>{enemy-=damage;sync();}
        });
        if(enemy<=0){victory();return;}
        await effects.wait(180);
        if(await tryHaruSpecial()){
          if(enemy<=0){await effects.wait(350);victory();return;}
          await effects.wait(260);
        }
        enemyTurn();
      }

      function bindCard(card,handler){
        card.addEventListener('click',handler);
        card.addEventListener('keydown',event=>{
          if(event.key==='Enter'||event.key===' '){event.preventDefault();handler();}
        });
      }

      bindCard(playerElement,playerAttack);
      bindCard(haruElement,haruAttack);
      sync();
      line.textContent=`${state.playerName}의 차례입니다. 카드를 터치하세요.`;
      setPhase('player');
    });
  };
})();