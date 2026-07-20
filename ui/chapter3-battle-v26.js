(()=>{
  const VERSION='8.5';
  const effects=window.BattleEffects;

  if(window.CHAPTER_3&&!window.CHAPTER_3.some(scene=>scene.type==='chapter3Battle')){
    window.CHAPTER_3.push(
      {type:'chapter3Battle'},
      {type:'black',text:'시야가 흔들렸다.\n\n손끝에 힘이 빠지고, 무릎이 천천히 꺾였다.'},
      {type:'black',text:'두 악몽의 그림자가 눈앞을 뒤덮었다.\n\n의식이 끊어지려던 순간—'},
      {type:'haruRescue'},
      {type:'outskirts',text:'푸른빛이 가라앉자 악몽의 흔적은 남아 있지 않았다.\n모모는 아직 겁에 질린 채 굳어 있었고, 나는 제대로 일어서기도 힘들었다.'},
      {type:'outskirts',speaker:'하루',text:'두 분 다 크게 다친 곳은 없나요?'},
      {type:'outskirts',speaker:'모모',text:'……응. 나는 괜찮아.\n그런데 이 사람은…….'},
      {type:'outskirts',text:'하루는 내 상태를 빠르게 살핀 뒤 더 묻지 않았다.\n지금은 설명보다 이곳을 벗어나는 일이 먼저라는 듯했다.'},
      {type:'outskirts',speaker:'하루',text:'이야기는 돌아가서 듣겠습니다.\n\n지금은 길드로 돌아가죠.'},
      {type:'chapter',clear:true,chapter:3,title:'낯선 동침자'},
      {type:'levelup',from:4,to:5}
    );
  }

  const wait=ms=>effects?.wait?effects.wait(ms):new Promise(resolve=>setTimeout(resolve,ms));

  function showSpecial(name,detail){
    document.querySelector('.special-skill-banner')?.remove();
    const banner=document.createElement('div');
    banner.className='special-skill-banner';
    banner.innerHTML=`<span>SPECIAL SKILL</span><strong>${name}</strong>`;
    document.body.appendChild(banner);
    setTimeout(()=>banner.remove(),1300);
    const line=document.getElementById('battleLine');
    const label=document.getElementById('turnLabel');
    if(label)label.textContent='SPECIAL SKILL';
    if(line)line.innerHTML=`<strong>${name}</strong><br>${detail}`;
  }

  function renderChapter3Battle(){
    mount(`<main class="screen battle-intro">
      <div class="battle-start-flash">BATTLE START</div>
      <div class="battle-start-sub">악몽 둘이 길을 막아섰습니다</div>
      <div class="version">${window.gameVersionText?window.gameVersionText():`Ver. ${VERSION}`}</div>
    </main>`,()=>setTimeout(startBattle,1050));
  }

  function startBattle(){
    const allies=[
      {id:'player',name:state.playerName,hp:42,maxHp:42,damage:8,hiddenTurns:0,attackType:'impact'},
      {id:'momo',name:'모모',hp:30,maxHp:30,damage:4,hiddenTurns:0,attackType:'pierce',projectileType:'knife'}
    ];
    const enemies=[
      {id:'nightmare1',name:'악몽 1',hp:38,maxHp:38,damage:7,attackType:'claw'},
      {id:'nightmare2',name:'악몽 2',hp:38,maxHp:38,damage:7,attackType:'claw'}
    ];
    const acted=new Set();
    let selectedEnemyId='nightmare1';
    let enemyActing=false;
    let momoSpecialUsed=false;
    let ended=false;

    mount(`<style>
      .chapter3-effect-battle{padding-top:calc(env(safe-area-inset-top) + 14px);padding-bottom:42px}
      .chapter3-effect-battle .battle-controls{left:auto;right:14px;top:calc(env(safe-area-inset-top) + 12px);display:flex;justify-content:flex-end;gap:6px;z-index:5}
      .chapter3-effect-battle .control-btn{min-width:52px;padding:7px 8px;border-radius:9px;font-size:11px;white-space:nowrap}
      .chapter3-effect-battle .battle-layout{position:relative;width:min(860px,100%);height:100%;display:grid;grid-template-rows:auto 1fr auto;gap:10px;padding-top:48px}
      .chapter3-effect-battle .enemy-formation{align-self:start}
      .chapter3-effect-battle .battle-middle{position:absolute;left:0;right:0;top:53%;transform:translateY(-50%);min-height:0;gap:6px;padding:0 12px}
      .chapter3-effect-battle .turn-label{font-size:13px;font-weight:800;letter-spacing:.12em}
      .chapter3-effect-battle .battle-line{min-height:42px;padding:5px 12px}
      .chapter3-effect-battle .battle-cards{align-self:end;margin-top:auto}
      .battle-result-overlay{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;flex-direction:column;background:rgba(2,7,18,.76);backdrop-filter:blur(2px);opacity:0;pointer-events:none;transition:opacity .28s ease}
      .battle-result-overlay.show{opacity:1}
      .battle-result-overlay.ready{pointer-events:auto}
      .battle-result-title{font-size:clamp(38px,11vw,72px);font-weight:900;letter-spacing:.16em;text-shadow:0 0 18px currentColor;transform:scale(.82);opacity:0;animation:resultPop .7s ease forwards}
      .battle-result-overlay.defeat{color:#ff4d57;background:radial-gradient(circle,rgba(110,0,12,.28),rgba(2,7,18,.9) 62%)}
      .battle-result-overlay.victory{color:#ffd866;background:radial-gradient(circle,rgba(125,91,0,.24),rgba(2,7,18,.9) 62%)}
      .battle-result-hint{margin-top:24px;color:#e8edf7;font-size:13px;letter-spacing:.08em;opacity:0;transition:opacity .25s ease}
      .battle-result-overlay.ready .battle-result-hint{opacity:.88}
      .chapter3-effect-battle.result-shake{animation:resultShake .45s ease}
      @keyframes resultPop{to{transform:scale(1);opacity:1}}
      @keyframes resultShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}50%{transform:translateX(7px)}75%{transform:translateX(-4px)}}
      @media(max-height:700px){
        .chapter3-effect-battle .battle-layout{padding-top:42px;gap:6px}
        .chapter3-effect-battle .battle-middle{top:51%}
        .chapter3-effect-battle .battle-line{min-height:34px}
      }
    </style><main class="screen battle-screen chapter3-effect-battle">
      <div class="battle-controls"><button class="control-btn locked">×1 잠김</button><button class="control-btn locked">AUTO 잠김</button></div>
      <div class="battle-layout battle-layout-v24">
        <section class="enemy-formation chapter3-enemies">
          ${enemies.map(enemy=>`<button class="battle-enemy-card" data-event-enemy="${enemy.id}">
            <strong>${enemy.name}</strong>
            <div class="hp enemy-hp"><span id="${enemy.id}Hp"></span></div>
            <em id="${enemy.id}Text">${enemy.hp} / ${enemy.maxHp}</em>
          </button>`).join('')}
          ${[3,4,5].map(slot=>`<div class="battle-enemy-card is-empty"><span>적 ${slot}</span></div>`).join('')}
        </section>
        <section class="battle-middle">
          <div class="turn-label" id="turnLabel">아군 행동</div>
          <div class="battle-line" id="battleLine">행동할 캐릭터 카드를 터치하세요.</div>
        </section>
        <section class="battle-cards">
          ${allies.map(ally=>`<button class="battle-character-card" data-event-ally="${ally.id}">
            <span class="battle-card-order"></span>
            <strong>${ally.name}</strong>
            <small>${ally.id==='momo'?'투척 단검':'맨손 공격'} · 피해 ${ally.damage}</small>
            <div class="hp"><span id="${ally.id}Hp"></span></div>
            <em id="${ally.id}Text">${ally.hp} / ${ally.maxHp}</em>
          </button>`).join('')}
          ${[3,4].map(slot=>`<div class="battle-character-card is-locked"><strong>슬롯 ${slot}</strong><small>파티원 미합류</small></div>`).join('')}
        </section>
      </div>
      <div class="battle-version">${window.gameVersionText?window.gameVersionText():`Ver. ${VERSION}`}</div>
    </main>`,()=>{
      const line=document.getElementById('battleLine');
      const label=document.getElementById('turnLabel');
      const battleRoot=app.firstElementChild;
      const allyCards=Array.from(document.querySelectorAll('[data-event-ally]'));
      const enemyCards=Array.from(document.querySelectorAll('[data-event-enemy]'));
      const livingEnemies=()=>enemies.filter(enemy=>enemy.hp>0);
      const selectedEnemy=()=>enemies.find(enemy=>enemy.id===selectedEnemyId&&enemy.hp>0)||livingEnemies()[0];
      const momo=allies.find(ally=>ally.id==='momo');

      function sync(){
        enemies.forEach(enemy=>{
          document.getElementById(`${enemy.id}Hp`).style.width=`${Math.max(0,enemy.hp)/enemy.maxHp*100}%`;
          document.getElementById(`${enemy.id}Text`).textContent=`${Math.max(0,enemy.hp)} / ${enemy.maxHp}`;
          const card=document.querySelector(`[data-event-enemy="${enemy.id}"]`);
          card.classList.toggle('is-targeted',enemy.id===selectedEnemyId&&enemy.hp>0);
          card.classList.toggle('is-defeated',enemy.hp<=0);
          card.disabled=enemy.hp<=0||enemyActing||ended;
        });
        allies.forEach(ally=>{
          document.getElementById(`${ally.id}Hp`).style.width=`${Math.max(0,ally.hp)/ally.maxHp*100}%`;
          document.getElementById(`${ally.id}Text`).textContent=ally.hiddenTurns>0?`다크사이트 · ${ally.hiddenTurns}턴`:`${Math.max(0,ally.hp)} / ${ally.maxHp}`;
          const card=document.querySelector(`[data-event-ally="${ally.id}"]`);
          card.classList.toggle('is-hidden-unit',ally.hiddenTurns>0);
          card.classList.toggle('unit-defeated',ally.hp<=0);
        });
      }

      function availableAllies(){return allies.filter(ally=>ally.hp>0&&ally.hiddenTurns===0)}

      function showResult(type){
        if(ended)return;
        ended=true;
        enemyActing=true;
        allyCards.forEach(card=>card.disabled=true);
        enemyCards.forEach(card=>card.disabled=true);
        label.textContent=type==='victory'?'VICTORY':'DEFEAT';
        line.textContent=type==='victory'?'전투에서 승리했습니다.':'의식이 흐려집니다……';
        battleRoot.classList.add('result-shake');
        const overlay=document.createElement('div');
        overlay.className=`battle-result-overlay ${type}`;
        overlay.innerHTML=`<div class="battle-result-title">${type==='victory'?'VICTORY':'DEFEAT'}</div><div class="battle-result-hint">화면을 터치하여 계속</div>`;
        document.body.appendChild(overlay);
        requestAnimationFrame(()=>overlay.classList.add('show'));
        setTimeout(()=>{
          overlay.classList.add('ready');
          overlay.addEventListener('click',()=>{overlay.remove();next();},{once:true});
        },1000);
      }

      function resetTurn(){
        if(ended)return;
        acted.clear();
        enemyActing=false;
        allyCards.forEach(card=>{
          const ally=allies.find(item=>item.id===card.dataset.eventAlly);
          card.classList.remove('is-acted');
          card.querySelector('.battle-card-order').textContent='';
          card.disabled=!ally||ally.hiddenTurns>0||ally.hp<=0;
        });
        enemyCards.forEach(card=>card.disabled=card.classList.contains('is-defeated'));
        label.textContent='아군 행동';
        line.textContent=momo.hiddenTurns>0?`모모는 다크사이트 상태입니다. ${momo.hiddenTurns}턴 동안 행동하지 않습니다.`:'행동할 캐릭터 카드를 터치하세요.';
        sync();
      }

      function finishEnemyRound(){
        if(momo.hiddenTurns>0){
          momo.hiddenTurns-=1;
          if(momo.hiddenTurns===0){
            line.textContent='모모의 다크사이트가 해제되었습니다.';
            sync();
            setTimeout(resetTurn,700);
            return;
          }
        }
        setTimeout(resetTurn,650);
      }

      function enemyTurn(){
        if(ended)return;
        enemyActing=true;
        allyCards.forEach(card=>card.disabled=true);
        enemyCards.forEach(card=>card.disabled=true);
        const attackers=livingEnemies();
        let order=0;
        const act=async()=>{
          if(ended)return;
          if(order>=attackers.length){finishEnemyRound();return;}
          const enemy=attackers[order++];
          const targets=availableAllies();
          if(!targets.length){showResult('defeat');return;}
          const target=targets[Math.floor(Math.random()*targets.length)];
          label.textContent=`적 ${order} · ${enemy.name}`;
          await wait(220);
          if(effects?.playAttack){
            await effects.playAttack({
              attacker:document.querySelector(`[data-event-enemy="${enemy.id}"]`),
              target:document.querySelector(`[data-event-ally="${target.id}"]`),
              type:enemy.attackType,
              damage:enemy.damage,
              onImpact:()=>{target.hp-=enemy.damage;line.textContent=`${enemy.name}의 공격. ${target.name}에게 ${enemy.damage}의 피해.`;sync();}
            });
          }else{
            target.hp-=enemy.damage;
            line.textContent=`${enemy.name}의 공격. ${target.name}에게 ${enemy.damage}의 피해.`;
            sync();
          }
          if(target.id==='player'&&target.hp<=0){await wait(500);showResult('defeat');return;}
          await wait(220);
          act();
        };
        act();
      }

      function afterAllyAction(ally){
        if(ended)return;
        if(ally.id==='momo'&&!momoSpecialUsed){
          momoSpecialUsed=true;
          setTimeout(()=>{
            showSpecial('모모 — 다크사이트','모모가 3턴 동안 공격받지 않지만 행동할 수도 없습니다.');
            ally.hiddenTurns=3;
            const card=document.querySelector('[data-event-ally="momo"]');
            card.disabled=true;
            card.classList.add('is-acted','is-hidden-unit');
            sync();
            setTimeout(()=>{
              if(availableAllies().every(member=>acted.has(member.id)))enemyTurn();
              else{
                label.textContent='아군 행동';
                line.textContent='주인공의 카드를 터치하세요.';
              }
            },950);
          },350);
          return;
        }
        if(!livingEnemies().length){showResult('victory');return;}
        if(availableAllies().every(member=>acted.has(member.id)))setTimeout(enemyTurn,450);
        else{
          label.textContent='아군 행동';
          line.textContent='다음 행동할 캐릭터 카드를 터치하세요.';
        }
      }

      enemyCards.forEach(card=>card.onclick=()=>{
        if(enemyActing||card.disabled||ended)return;
        selectedEnemyId=card.dataset.eventEnemy;
        sync();
      });

      allyCards.forEach(card=>card.onclick=async()=>{
        if(enemyActing||card.disabled||ended)return;
        const ally=allies.find(item=>item.id===card.dataset.eventAlly);
        const target=selectedEnemy();
        if(!ally||!target||ally.hiddenTurns>0||acted.has(ally.id))return;
        acted.add(ally.id);
        card.disabled=true;
        card.classList.add('is-acted');
        card.querySelector('.battle-card-order').textContent=`${acted.size}번째 행동`;
        line.textContent=ally.id==='momo'?`모모가 눈을 질끈 감고 단검을 던졌습니다.`:`${ally.name}이 맨손으로 파고들었습니다.`;
        if(effects?.playAttack){
          await effects.playAttack({
            attacker:card,
            target:document.querySelector(`[data-event-enemy="${target.id}"]`),
            type:ally.attackType,
            projectileType:ally.projectileType,
            damage:ally.damage,
            onImpact:()=>{target.hp-=ally.damage;sync();}
          });
        }else{
          target.hp-=ally.damage;
          sync();
        }
        line.textContent=ally.id==='momo'?`모모의 투척 단검. ${ally.damage}의 피해.`:`${ally.name}의 맨손 공격. ${ally.damage}의 피해.`;
        if(target.hp<=0){
          const nextTarget=livingEnemies()[0];
          if(nextTarget)selectedEnemyId=nextTarget.id;
        }
        sync();
        await wait(300);
        afterAllyAction(ally);
      });

      sync();
      resetTurn();
    });
  }

  function renderHaruRescue(){
    mount(`<main class="screen haru-rescue-scene rescue-unified">
      <div class="haru-rescue-result" id="haruRescueResult">하루의 목소리가 들린 순간, 머리 위로 푸른빛이 모여들었다.</div>
      <div class="hint" style="opacity:0">터치하여 계속</div>
      <div class="version">${window.gameVersionText?window.gameVersionText():`Ver. ${VERSION}`}</div>
    </main>`,()=>{
      setTimeout(()=>{
        showSpecial('하루 — 천체낙하','푸른 천체의 빛이 악몽 둘을 동시에 덮쳤습니다.');
        setTimeout(()=>{
          const result=document.getElementById('haruRescueResult');
          result.innerHTML='푸른빛이 폭발하듯 번졌다.<br>두 악몽은 비명조차 남기지 못한 채 소멸했다.';
          const hint=app.querySelector('.hint');
          hint.style.opacity='1';
          app.firstElementChild.onclick=next;
        },1250);
      },350);
    });
  }

  const previousRenderScene=renderScene;
  renderScene=function(scene){
    if(scene.type==='chapter3Battle'){renderChapter3Battle();return;}
    if(scene.type==='haruRescue'){renderHaruRescue();return;}
    previousRenderScene(scene);
  };
})();