(()=>{
  const VERSION='2.5';
  const selectedChapter=Number(window.SELECTED_CHAPTER||1);
  const chapterStart={1:2,2:3,3:4};
  const chapterLimit={1:3,2:4,3:5};
  const overallLimit=5;

  state.level=Math.min(state.level,overallLimit);
  const selectedClear=localStorage.getItem(`mongyeong.chapterClear.${selectedChapter}`)==='1';
  if(!selectedClear&&state.level>chapterStart[selectedChapter]){
    state.level=chapterStart[selectedChapter];
    state.exp=0;
  }
  save();

  const momoResponseIndex=window.CHAPTER_3?.findIndex(scene=>scene.type==='relationshipResponse'&&scene.speaker==='모모')??-1;
  if(momoResponseIndex>=0&&!window.CHAPTER_3.some(scene=>scene.type==='relationshipUnlock'&&scene.character==='모모')){
    window.CHAPTER_3.splice(momoResponseIndex+1,0,{type:'relationshipUnlock',character:'모모',storageKey:'mongyeong.momoRelationshipUnlocked'});
  }

  renderLevelUp=function(){
    const chapter=Number(window.SELECTED_CHAPTER||state.chapter||1);
    const limit=chapterLimit[chapter]||state.level+1;
    const before=Math.min(state.level,limit);
    const canRise=before<limit;

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
        state.level=canRise?before+1:limit;
        state.exp=0;
        localStorage.setItem(`mongyeong.chapterClear.${chapter}`,'1');
        save();
        const title=canRise?'LEVEL UP':'LEVEL LIMIT';
        const detail=canRise?`Lv. ${before} → Lv. ${state.level}`:`현재 챕터 최대 레벨 Lv. ${limit}`;
        mount(`<main class="screen status ${levelTheme(state.level)}">
          <section class="box">
            <div class="chapter-title">${title}</div>
            <div class="text" style="margin-top:18px">${detail}</div>
          </section>
          <div class="hint">터치하여 계속</div>
          <div class="version">Ver. ${VERSION}</div>
        </main>`,()=>app.firstElementChild.onclick=next);
      };
    });
  };

  const previousRenderScene=renderScene;
  renderScene=function(scene){
    if(scene.type==='relationshipUnlock'){
      const character=scene.character||'하루';
      const storageKey=scene.storageKey||'mongyeong.relationshipUnlocked';
      localStorage.setItem(storageKey,'true');
      mount(`<main class="screen relationship-unlock">
        <section class="relationship-unlock__panel">
          <div class="relationship-unlock__kicker">RELATIONSHIP</div>
          <div class="relationship-unlock__title">${character}</div>
          <div class="relationship-unlock__text">새로운 관계가 시작되었습니다.</div>
          <div class="relationship-unlock__hidden">호감도는 아직 공개되지 않습니다.</div>
        </section>
        <div class="hint">터치하여 계속</div>
        <div class="version">Ver. ${VERSION}</div>
      </main>`,()=>app.firstElementChild.onclick=next);
      return;
    }
    previousRenderScene(scene);
  };

  let bannerTimer=null;
  function showSpecialBanner(){
    const line=document.getElementById('battleLine');
    const name=line?.querySelector('strong')?.textContent||'SPECIAL SKILL';
    document.querySelector('.special-skill-banner')?.remove();
    const banner=document.createElement('div');
    banner.className='special-skill-banner';
    banner.innerHTML=`<span>SPECIAL SKILL</span><strong>${name}</strong>`;
    document.body.appendChild(banner);
    clearTimeout(bannerTimer);
    bannerTimer=setTimeout(()=>banner.remove(),1300);
  }

  const appObserver=new MutationObserver(()=>{
    const label=document.getElementById('turnLabel');
    if(label?.textContent==='SPECIAL SKILL'&&!document.querySelector('.special-skill-banner'))showSpecialBanner();
  });
  appObserver.observe(app,{childList:true,subtree:true,characterData:true});
})();