(()=>{
  const saveApi=window.MONGYEONG_SAVE;
  const root=document.getElementById('app');
  if(!saveApi||!root)return;

  const saved=saveApi.readSave?.();
  if(!saved?.savedAt||Number(saved.progress?.sceneIndex)<0)return;

  const titleScreen=root.querySelector('.screen.title');
  if(!titleScreen)return;

  const startText=titleScreen.querySelector('.start');
  if(startText)startText.textContent='저장된 기록이 있습니다';

  const button=document.createElement('button');
  button.type='button';
  button.className='confirm continue-button';
  button.textContent='이어하기';
  button.style.marginTop='22px';
  button.style.minWidth='180px';
  button.style.position='relative';
  button.style.zIndex='3';

  const version=titleScreen.querySelector('.version');
  if(version)version.insertAdjacentElement('beforebegin',button);
  else titleScreen.appendChild(button);

  function restoreLegacyStorage(player,relationships){
    localStorage.setItem('mongyeong.playerName',player.name);
    localStorage.setItem('mongyeong.level',String(player.level));
    localStorage.setItem('mongyeong.exp',String(player.exp));
    localStorage.setItem('mongyeong.credits',String(player.credits));
    localStorage.setItem('mongyeong.stamina',String(player.stamina));
    localStorage.setItem('mongyeong.maxStamina',String(player.maxStamina));
    localStorage.setItem('mongyeong.nightmareEssence',String(player.nightmareEssence));
    localStorage.setItem('mongyeong.haruAffinity',String(relationships.haru));
    localStorage.setItem('mongyeong.momoAffinity',String(relationships.momo));
  }

  function continueGame(){
    const normalized=saveApi.normalizeSave(saved);
    const player=normalized.player;
    const relationships=normalized.relationships;
    const chapter=Math.min(4,Math.max(1,Number(normalized.progress.chapter)||1));
    const chapterScenes=window[`CHAPTER_${chapter}`];

    if(!Array.isArray(chapterScenes)||chapterScenes.length===0){
      console.warn('[continue] 저장된 챕터를 찾지 못했습니다.');
      return;
    }

    Object.assign(state,{
      playerName:player.name,
      level:Number(player.level)||1,
      exp:Number(player.exp)||0,
      chapter,
      stamina:Number(player.stamina)||200,
      maxStamina:Number(player.maxStamina)||200,
      credits:Number(player.credits)||0,
      nightmareEssence:Number(player.nightmareEssence)||0,
      haruAffinity:Number(relationships.haru)||0,
      momoAffinity:Number(relationships.momo)||0
    });

    restoreLegacyStorage(player,relationships);
    window.SELECTED_CHAPTER=chapter;
    scenes=chapterScenes;
    index=Math.min(Math.max(0,Number(normalized.progress.sceneIndex)||0),scenes.length-1);

    const scene=scenes[index];
    if(scene?.type==='name')renderName();
    else renderScene(scene);
  }

  button.addEventListener('click',event=>{
    event.preventDefault();
    event.stopPropagation();
    continueGame();
  });
})();