(()=>{
  const VERSION='5.3';
  const MAX_IMPLEMENTED_CHAPTER=4;

  function isCleared(chapter){
    return localStorage.getItem(`mongyeong.chapterClear.${chapter}`)==='1';
  }

  function markCleared(chapter){
    localStorage.setItem(`mongyeong.chapterClear.${chapter}`,'1');
  }

  // 이전 버전 저장 데이터는 레벨은 저장되어 있어도 챕터 클리어 표식이 없을 수 있다.
  // 현재 레벨을 기준으로 이미 완료한 챕터 표식을 복구하되 현재 진행 중인 챕터 연출은 막지 않는다.
  const clearedFromSavedLevel=Math.max(0,Math.min(MAX_IMPLEMENTED_CHAPTER,Number(state.level||1)-1));
  for(let chapter=1;chapter<=clearedFromSavedLevel;chapter+=1){
    if(!isCleared(chapter))markCleared(chapter);
  }

  function clearedChapterCount(){
    let count=0;
    for(let chapter=1;chapter<=MAX_IMPLEMENTED_CHAPTER;chapter+=1){
      if(!isCleared(chapter))break;
      count+=1;
    }
    return count;
  }

  // 시작 Lv.1 / 챕터 1~4 클리어 시 각각 Lv.2~5
  const correctedLevel=1+clearedChapterCount();
  if(state.level<correctedLevel){
    state.level=correctedLevel;
    state.exp=0;
    save();
  }

  function renderCorrectChapterComplete(scene){
    const chapter=Number(scene.chapter||window.SELECTED_CHAPTER||state.chapter||1);
    const limit=chapter+1;
    const before=Math.max(1,limit-1);
    const clearKey=`mongyeong.chapterClear.${chapter}`;

    mount(`<main class="screen chapter cinematic-chapter">
      <div class="chapter-title">CHAPTER ${chapter} CLEAR</div>
      ${scene.title?`<div class="chapter-sub">${scene.title}</div>`:''}
      <div class="hint">터치하여 계속</div>
      <div class="version">${window.gameVersionText?.()||`Ver. ${VERSION}`}</div>
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
          <div class="version">${window.gameVersionText?.()||`Ver. ${VERSION}`}</div>
        </main>`,()=>{
          app.firstElementChild.onclick=()=>{
            state.level=Math.max(state.level,limit);
            state.exp=0;
            localStorage.setItem(clearKey,'1');
            save();
            mount(`<main class="screen status ${levelTheme(limit)}">
              <section class="box">
                <div class="chapter-title">LEVEL UP</div>
                <div class="text" style="margin-top:18px">Lv. ${before} → Lv. ${limit}</div>
              </section>
              <div class="hint">터치하여 계속</div>
              <div class="version">${window.gameVersionText?.()||`Ver. ${VERSION}`}</div>
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