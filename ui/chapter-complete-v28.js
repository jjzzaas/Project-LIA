(()=>{
  const VERSION='2.8';
  const levelLimits={1:3,2:4,3:5};

  function normalize(array){
    if(!Array.isArray(array))return;
    for(let i=0;i<array.length;i+=1){
      const scene=array[i];
      if(!scene?.clear)continue;
      const chapter=Number(scene.chapter||1);
      const nextScene=array[i+1];
      array[i]={type:'chapterComplete',chapter,title:scene.title||''};
      if(nextScene?.type==='levelup')array.splice(i+1,1);
    }
  }

  const uniqueArrays=new Set([window.CHAPTER_1,window.CHAPTER_2,window.CHAPTER_3]);
  uniqueArrays.forEach(normalize);

  function renderChapterComplete(scene){
    const chapter=Number(scene.chapter||window.SELECTED_CHAPTER||state.chapter||1);
    const limit=levelLimits[chapter]||state.level+1;
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
            const canLevel=before<limit;
            state.level=canLevel?before+1:limit;
            state.exp=0;
            localStorage.setItem(`mongyeong.chapterClear.${chapter}`,'1');
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
    if(scene.type==='chapterComplete'){
      renderChapterComplete(scene);
      return;
    }
    previousRenderScene(scene);
  };
})();