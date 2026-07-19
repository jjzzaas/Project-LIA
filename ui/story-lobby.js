(()=>{
  const root=document.getElementById('app');
  const saveApi=window.MONGYEONG_SAVE;
  if(!root||!saveApi)return;

  const TILE_INFO={
    guild:{label:'길드',number:'01',description:'의뢰와 헌터들의 소식이 모이는 곳'},
    lodging:{label:'숙소',number:'02',description:'잠시 쉬며 몸과 마음을 정리하는 곳'},
    exterior:{label:'외곽',number:'03',description:'도시 밖 임무와 악몽 사냥으로 이어지는 곳'},
    village:{label:'헌터 지구',number:'04',description:'훈련과 장비 준비를 할 수 있는 구역'}
  };

  const blockedTypes=new Set([
    'battle','reward','levelup','chapter2','relationshipChoice','relationshipResponse',
    'relationshipUnlock','chapterComplete','chapterTransition','mainLobby'
  ]);

  function currentScene(){
    if(!Array.isArray(window.scenes)&&typeof scenes==='undefined')return null;
    try{return Array.isArray(scenes)?scenes[index]:null;}catch{return null;}
  }

  function canShowLobby(){
    const scene=currentScene();
    const chapter=Number(state?.chapter||scene?.chapter||window.SELECTED_CHAPTER||1);
    if(chapter<=1||!scene)return false;
    if(scene.clear||scene.opening||blockedTypes.has(scene.type))return false;

    const screen=root.firstElementChild;
    if(!screen)return false;
    if(screen.matches('.title,.main-lobby,.battle-screen,.battle-intro,.reward-screen,.status,.cinematic-chapter,.relationship-choice,.relationship-unlock'))return false;
    return true;
  }

  function saveCheckpoint(){
    const previous=saveApi.readSave?.()||saveApi.createDefaultSave();
    const scene=currentScene();
    if(!scene||typeof index!=='number'||index<0)return;

    saveApi.writeSave({
      ...previous,
      progress:{
        ...previous.progress,
        chapter:Number(state?.chapter||scene.chapter||previous.progress.chapter||1),
        sceneId:scene.id||scene.type||null,
        sceneIndex:index
      }
    });
  }

  function unlockedTiles(){
    return saveApi.getUnlockedLobbyTiles?.().filter(id=>TILE_INFO[id])||[];
  }

  function renderLocation(panel,tileId){
    const info=TILE_INFO[tileId];
    if(!info)return;
    panel.innerHTML=`
      <div class="story-lobby__location">
        <div class="story-lobby__location-number">${info.number}</div>
        <div class="story-lobby__location-kicker">LOBBY LOCATION</div>
        <h2>${info.label}</h2>
        <p>${info.description}</p>
        <div class="story-lobby__location-note">현재 스토리 진행은 유지됩니다.</div>
        <button class="story-lobby__back" type="button">로비 목록으로</button>
      </div>`;
    panel.querySelector('.story-lobby__back').addEventListener('click',()=>renderTileList(panel));
  }

  function renderTileList(panel){
    const unlocked=unlockedTiles();
    const tiles=Object.entries(TILE_INFO).map(([id,info])=>{
      const isUnlocked=unlocked.includes(id);
      return `<button class="story-lobby__tile ${isUnlocked?'is-unlocked':'is-locked'}" type="button" data-tile="${id}" ${isUnlocked?'':'disabled'}>
        <span>${info.number}</span><strong>${isUnlocked?info.label:'잠김'}</strong>
      </button>`;
    }).join('');

    panel.innerHTML=`
      <div class="story-lobby__heading">
        <div><small>STORY LOBBY</small><h2>로비</h2></div>
        <button class="story-lobby__close" type="button" aria-label="스토리로 복귀">스토리 복귀</button>
      </div>
      <div class="story-lobby__tiles">${tiles}</div>
      <p class="story-lobby__guide">해금된 장소를 선택하세요.</p>`;

    panel.querySelector('.story-lobby__close').addEventListener('click',closeLobby);
    panel.querySelectorAll('.story-lobby__tile.is-unlocked').forEach(button=>{
      button.addEventListener('click',()=>renderLocation(panel,button.dataset.tile));
    });
  }

  function closeLobby(){
    document.querySelector('.story-lobby-overlay')?.remove();
  }

  function openLobby(event){
    event?.preventDefault();
    event?.stopPropagation();
    if(document.querySelector('.story-lobby-overlay'))return;
    saveCheckpoint();

    const overlay=document.createElement('section');
    overlay.className='story-lobby-overlay';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-label','스토리 로비');
    overlay.innerHTML='<div class="story-lobby__panel"></div>';
    document.body.appendChild(overlay);
    renderTileList(overlay.querySelector('.story-lobby__panel'));
  }

  function syncButton(){
    const screen=root.firstElementChild;
    if(!screen)return;
    const existing=screen.querySelector(':scope > .story-lobby-button');

    if(!canShowLobby()){
      existing?.remove();
      closeLobby();
      return;
    }

    if(existing)return;
    const button=document.createElement('button');
    button.type='button';
    button.className='story-lobby-button';
    button.textContent='로비';
    button.addEventListener('click',openLobby);
    screen.appendChild(button);
  }

  const observer=new MutationObserver(()=>queueMicrotask(syncButton));
  observer.observe(root,{childList:true,subtree:false});
  syncButton();
})();