(()=>{
  const VERSION='2.9';
  const MAX_IMPLEMENTED_CHAPTER=3;

  function isCleared(chapter){
    return localStorage.getItem(`mongyeong.chapterClear.${chapter}`)==='1';
  }

  function clearedChapterCount(){
    let count=0;
    for(let chapter=1;chapter<=MAX_IMPLEMENTED_CHAPTER;chapter+=1){
      if(!isCleared(chapter))break;
      count+=1;
    }
    return count;
  }

  // 레벨은 반복 전투 횟수가 아니라 완료한 챕터 수를 기준으로 복구한다.
  // 시작 Lv.1 / 챕터 1 클리어 Lv.2 / 챕터 2 클리어 Lv.3 / 챕터 3 클리어 Lv.4
  const correctedLevel=1+clearedChapterCount();
  if(state.level!==correctedLevel){
    state.level=correctedLevel;
    state.exp=0;
    save();
  }

  function renderCorrectChapterComplete(scene){
    const chapter=Number(scene.chapter||window.SELECTED_CHAPTER||state.chapter||1);
    const limit=chapter+1;
    const clearKey=`mongyeong.chapterClear.${chapter}`;
    const alreadyCleared=localStorage.getItem(clearKey)==='1';
    const before=Math.min(state.level,limit);

    mount(`<main class="screen chapter cinematic-chapter">
      <div class="chapter-title">CHAPTER ${chapter} CLEAR</div>
      ${scene.title?`<div class="chapter-sub">${scene.title}</div>`:''}
      <div class="hint">터치하여 계속</div>
      <div class="version">Ver. ${VERSION}</div>
    </main>`,()=>{
      app.firstElementChild.onclick=()=>{
        state.exp=100;
        save();
        mount(`<main class="screen status ${levelTheme(limit)}">
          <section class="box">
            <div class="chapter-title">EXP MAX</div>
            <div class="exp-track"><span style="width:100%"></span></div>
            <div class="text" style="margin-top:18px">챕터 경험치가 모두 채워졌습니다.</div>
          </section>
          <div class="hint">터치하여 계속</div>
          <div class="version">Ver. ${VERSION}</div>
        </main>`,()=>{
          app.firstElementChild.onclick=()=>{
            const canLevel=!alreadyCleared&&before<limit;
            state.level=canLevel?limit:Math.min(state.level,limit);
            state.exp=0;
            localStorage.setItem(clearKey,'1');
            save();
            mount(`<main class="screen status ${levelTheme(state.level)}">
              <section class="box">
                <div class="chapter-title">${canLevel?'LEVEL UP':'LEVEL LIMIT'}</div>
                <div class="text" style="margin-top:18px">${canLevel?`Lv. ${before} → Lv. ${state.level}`:`현재 챕터 최대 레벨 Lv. ${limit}`}</div>
              </section>
              <div class="hint">터치하여 계속</div>
              <div class="version">Ver. ${VERSION}</div>
            </main>`,()=>app.firstElementChild.onclick=next);
          };
        });
      };
    });
  }

  const previousRenderScene=renderScene;
  renderScene=function(scene){
    if(scene?.type==='chapterComplete'){
      renderCorrectChapterComplete(scene);
      return;
    }
    previousRenderScene(scene);
  };

  // 챕터 1 주인공은 아직 특수 스킬을 보유하지 않는다.
  // 현재 전투 데이터에서도 주인공 specialChance는 0이며, 아래 감시는 회귀 오류를 막는 안전장치다.
  const specialGuard=new MutationObserver(()=>{
    if(Number(window.SELECTED_CHAPTER||state.chapter||1)!==1)return;
    const label=document.getElementById('turnLabel');
    const line=document.getElementById('battleLine');
    const skillName=line?.querySelector('strong')?.textContent||'';
    if(label?.textContent==='SPECIAL SKILL'&&skillName.startsWith(`${state.playerName} —`)){
      document.querySelector('.special-skill-banner')?.remove();
      label.textContent='아군 턴';
      line.textContent='주인공은 아직 특수 스킬을 사용할 수 없습니다.';
    }
  });
  specialGuard.observe(app,{childList:true,subtree:true,characterData:true});
})();
