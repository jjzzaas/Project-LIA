(()=>{
  const effects=window.BattleEffects;
  if(!effects||typeof window.renderBattle!=='function')return;

  window.renderBattle=function renderChapter1BattleWithEffects(){
    let enemy=90;
    let player=42;
    let haru=48;
    let phase='player';
    let focused=false;
    let guard=false;
    let haruSpecialUsed=false;
    let actionLocked=false;

    mount(`<main class="screen battle-screen chapter1-effect-battle">
      <div class="battle-controls">
        <button class="control-btn locked">🔒 ×1</button>
        <button class="control-btn locked">🔒 AUTO</button>
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
          <div class="ally-panel" id="chapter1Player">
            <div class="unit-head"><span>${state.playerName}</span><span id="playerText">42 / 42</span></div>
            <div class="hp"><span id="playerHp"></span></div>
            <div class="cards">
              <button class="card-btn player-card" data-card="strike"><strong>공격</strong><small>피해 10</small></button>
              <button class="card-btn player-card" data-card="guard"><strong>방어</strong><small>피해 감소</small></button>
              <button class="card-btn player-card" data-card="wait"><strong>틈 보기</strong><small>다음 공격 강화</small></button>
            </div>
          </div>
          <div class="ally-panel" id="chapter1Haru">
            <div class="unit-head"><span>하루</span><span id="haruText">48 / 48</span></div>
            <div class="hp"><span id="haruHp"></span></div>
            <div class="cards">
              <button class="card-btn haru-card" data-card="arrow"><strong>빛의 화살</strong><small>피해 14</small></button>
              <button class="card-btn haru-card" data-card="pierce"><strong>관통 사격</strong><small>피해 18</small></button>
              <button class="card-btn haru-card" data-card="cover"><strong>엄호</strong><small>피해 감소</small></button>
            </div>
          </div>
        </section>
      </div>
      <div class="battle-version">${window.gameVersionText?window.gameVersionText():'Ver. 8.0'}</div>
    </main>`,()=>{
      const line=document.getElementById('battleLine');
      const label=document.getElementById('turnLabel');
      const buttons=Array.from(document.querySelectorAll('.card-btn'));
      const enemyElement=document.getElementById('chapter1Enemy');
      const playerElement=document.getElementById('chapter1Player');
      const haruElement=document.getElementById('chapter1Haru');

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
        buttons.forEach(button=>{
          if(actionLocked){button.disabled=true;return;}
          if(phase==='player')button.disabled=!button.classList.contains('player-card');
          else if(phase==='haru')button.disabled=!button.classList.contains('haru-card');
          else button.disabled=true;
        });
        if(phase==='player')label.textContent=`아군 1 · ${state.playerName}`;
        else if(phase==='haru')label.textContent='아군 2 · 하루';
        else label.textContent='적 1 · 정체불명의 생명체';
      }

      function victory(){
        actionLocked=true;
        buttons.forEach(button=>button.disabled=true);
        label.textContent='VICTORY';
        line.textContent='화면을 터치하여 계속';
        app.firstElementChild.addEventListener('click',next,{once:true});
      }

      async function enemyTurn(){
        actionLocked=true;
        setPhase('enemy');
        await effects.wait(300);
        const targetPlayer=Math.random()<0.5;
        const damage=guard?4:8;
        guard=false;
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
        line.textContent=`${state.playerName}의 차례입니다.`;
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

      buttons.forEach(button=>{
        button.onclick=async()=>{
          if(actionLocked)return;
          actionLocked=true;
          buttons.forEach(item=>item.disabled=true);
          const card=button.dataset.card;
          let damage=0;
          let attackOptions=null;

          if(card==='strike'){
            damage=focused?18:10;
            focused=false;
            line.textContent=`${state.playerName}의 공격. ${damage}의 피해.`;
            attackOptions={attacker:playerElement,target:enemyElement,type:'slash',damage};
          }else if(card==='guard'){
            guard=true;
            line.textContent='공격에 대비해 자세를 낮췄다.';
          }else if(card==='wait'){
            focused=true;
            line.textContent='움직임을 읽으며 공격할 틈을 기다렸다.';
          }else if(card==='arrow'){
            damage=14;
            line.textContent='하루의 빛의 화살이 검은 몸을 꿰뚫었다.';
            attackOptions={attacker:haruElement,target:enemyElement,type:'pierce',projectileType:'arrow',damage};
          }else if(card==='pierce'){
            damage=18;
            line.textContent='푸른 섬광이 적을 관통했다.';
            attackOptions={attacker:haruElement,target:enemyElement,type:'pierce',projectileType:'arrow',damage,heavy:true};
          }else if(card==='cover'){
            guard=true;
            line.textContent='하루가 빛으로 적의 움직임을 묶었다.';
          }

          if(attackOptions){
            await effects.playAttack({...attackOptions,onImpact:()=>{enemy-=damage;sync();}});
          }else{
            await effects.wait(320);
          }

          if(enemy<=0){victory();return;}

          if(phase==='player'){
            await effects.wait(180);
            actionLocked=false;
            line.textContent='하루의 차례입니다.';
            setPhase('haru');
            return;
          }

          await effects.wait(180);
          if(await tryHaruSpecial()){
            if(enemy<=0){await effects.wait(350);victory();}
            else{await effects.wait(260);enemyTurn();}
          }else{
            enemyTurn();
          }
        };
      });

      sync();
      line.textContent=`${state.playerName}의 차례입니다.`;
      setPhase('player');
    });
  };
})();