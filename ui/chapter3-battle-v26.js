(()=>{
  const VERSION='2.7';

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
      <div class="version">Ver. ${VERSION}</div>
    </main>`,()=>setTimeout(startBattle,1050));
  }

  function startBattle(){
    const allies=[
      {id:'player',name:state.playerName,hp:42,maxHp:42,damage:8,hiddenTurns:0},
      {id:'momo',name:'모모',hp:30,maxHp:30,damage:4,hiddenTurns:0}
    ];
    const enemies=[
      {id:'nightmare1',name:'악몽 1',hp:38,maxHp:38,damage:7},
      {id:'nightmare2',name:'악몽 2',hp:38,maxHp:38,damage:7}
    ];
    const acted=new Set();
    let selectedEnemyId='nightmare1';
    let enemyActing=false;
    let momoSpecialUsed=false;
    let ended=false;

    mount(`<main class="screen battle-screen">
      <div class="battle-controls"><button class="control-btn locked">🔒 ×1</button><button class="control-btn locked">🔒 AUTO</button></div>
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
          <div class="turn-label" id="turnLabel">아군 턴 · 원하는 순서로 선택</div>
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
      <div class="battle-version">Ver. ${VERSION}</div>
    </main>`,()=>{
      const line=document.getElementById('battleLine');
      const label=document.getElementById('turnLabel');
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
          card.disabled=enemy.hp<=0||enemyActing;
        });
        allies.forEach(ally=>{
          document.getElementById(`${ally.id}Hp`).style.width=`${Math.max(0,ally.hp)/ally.maxHp*100}%`;
          document.getElementById(`${ally.id}Text`).textContent=ally.hiddenTurns>0?`다크사이트 · ${ally.hiddenTurns}턴`:`${Math.max(0,ally.hp)} / ${ally.maxHp}`;
          const card=document.querySelector(`[data-event-ally="${ally.id}"]`);
          card.classList.toggle('is-hidden-unit',ally.hiddenTurns>0);
        });
      }

      function availableAllies(){return allies.filter(ally=>ally.hp>0&&ally.hiddenTurns===0)}

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
        label.textContent='아군 턴 · 원하는 순서로 선택';
        line.textContent=momo.hiddenTurns>0?`모모는 다크사이트 상태입니다. ${momo.hiddenTurns}턴 동안 행동하지 않습니다.`:'행동할 캐릭터 카드를 터치하세요.';
        sync();
      }

      function defeat(){
        if(ended)return;
        ended=true;
        allyCards.forEach(card=>card.disabled=true);
        enemyCards.forEach(card=>card.disabled=true);
        label.textContent='DEFEAT';
        line.textContent='의식이 흐려집니다……';
        app.firstElementChild.classList.add('battle-defeat');
        setTimeout(next,1200);
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
        enemyActing=true;
        allyCards.forEach(card=>card.disabled=true);
        enemyCards.forEach(card=>card.disabled=true);
        const attackers=livingEnemies();
        let order=0;
        const act=()=>{
          if(ended)return;
          if(order>=attackers.length){finishEnemyRound();return;}
          const enemy=attackers[order++];
          const targets=availableAllies();
          if(!targets.length){finishEnemyRound();return;}
          const target=targets[Math.floor(Math.random()*targets.length)];
          label.textContent=`적 ${order} · ${enemy.name}`;
          setTimeout(()=>{
            target.hp-=enemy.damage;
            line.textContent=`${enemy.name}이 ${target.name}을 공격했습니다. ${enemy.damage}의 피해.`;
            sync();
            if(target.id==='player'&&target.hp<=0){setTimeout(defeat,550);return;}
            setTimeout(act,600);
          },450);
        };
        act();
      }

      function afterAllyAction(ally){
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
                label.textContent='아군 턴 · 남은 캐릭터 선택';
                line.textContent='주인공의 카드를 터치하세요.';
              }
            },950);
          },350);
          return;
        }
        if(availableAllies().every(member=>acted.has(member.id)))setTimeout(enemyTurn,450);
        else{
          label.textContent='아군 턴 · 남은 캐릭터 선택';
          line.textContent='다음 행동할 캐릭터 카드를 터치하세요.';
        }
      }

      enemyCards.forEach(card=>card.onclick=()=>{
        if(enemyActing||card.disabled)return;
        selectedEnemyId=card.dataset.eventEnemy;
        sync();
      });

      allyCards.forEach(card=>card.onclick=()=>{
        if(enemyActing||card.disabled||ended)return;
        const ally=allies.find(item=>item.id===card.dataset.eventAlly);
        const target=selectedEnemy();
        if(!ally||!target||ally.hiddenTurns>0||acted.has(ally.id))return;
        acted.add(ally.id);
        target.hp-=ally.damage;
        card.disabled=true;
        card.classList.add('is-acted');
        card.querySelector('.battle-card-order').textContent=`${acted.size}번째 행동`;
        line.textContent=ally.id==='momo'?`모모가 눈을 질끈 감고 단검을 던졌습니다. ${ally.damage}의 피해.`:`${ally.name}이 맨손으로 공격했습니다. ${ally.damage}의 피해.`;
        if(target.hp<=0){
          const nextTarget=livingEnemies()[0];
          if(nextTarget)selectedEnemyId=nextTarget.id;
        }
        sync();
        setTimeout(()=>afterAllyAction(ally),350);
      });

      sync();
      resetTurn();
    });
  }

  function renderHaruRescue(){
    mount(`<main class="screen haru-rescue-scene rescue-unified">
      <div class="haru-rescue-result" id="haruRescueResult">하루의 목소리가 들린 순간, 머리 위로 푸른빛이 모여들었다.</div>
      <div class="hint" style="opacity:0">터치하여 계속</div>
      <div class="version">Ver. ${VERSION}</div>
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