(()=>{
  const saveApi=window.MONGYEONG_SAVE;
  const root=document.getElementById('app');
  if(!saveApi||!root)return;

  const developerMode=new URLSearchParams(location.search).get('dev')==='1';
  if(developerMode)return;

  let scheduled=false;

  function numberFromState(key,storageKey,fallback=0){
    const stateValue=Number(state?.[key]);
    if(Number.isFinite(stateValue))return stateValue;
    const storedValue=Number(localStorage.getItem(storageKey));
    return Number.isFinite(storedValue)?storedValue:fallback;
  }

  function buildSnapshot(){
    if(typeof index!=='number'||index<0)return null;

    const previous=saveApi.readSave?.()||saveApi.createDefaultSave();
    const scene=Array.isArray(scenes)?scenes[index]:null;
    const chapter=Number(state?.chapter||scene?.chapter||previous.progress.chapter||1);
    const completed=new Set(previous.progress.completedChapters||[]);
    if(scene?.clear)completed.add(Number(scene.chapter||chapter));

    return {
      ...previous,
      player:{
        ...previous.player,
        name:state?.playerName||'여행자',
        level:numberFromState('level','mongyeong.level',1),
        exp:numberFromState('exp','mongyeong.exp',0),
        stamina:numberFromState('stamina','mongyeong.stamina',200),
        maxStamina:numberFromState('maxStamina','mongyeong.maxStamina',200),
        credits:numberFromState('credits','mongyeong.credits',0),
        nightmareEssence:numberFromState('nightmareEssence','mongyeong.nightmareEssence',0)
      },
      progress:{
        ...previous.progress,
        chapter:Number.isFinite(chapter)?chapter:1,
        sceneId:scene?.id||scene?.type||null,
        sceneIndex:index,
        completedChapters:[...completed].sort((a,b)=>a-b)
      },
      relationships:{
        ...previous.relationships,
        haru:numberFromState('haruAffinity','mongyeong.haruAffinity',previous.relationships.haru||0),
        momo:numberFromState('momoAffinity','mongyeong.momoAffinity',previous.relationships.momo||0)
      }
    };
  }

  function autoSave(){
    scheduled=false;
    const snapshot=buildSnapshot();
    if(snapshot)saveApi.writeSave(snapshot);
  }

  function scheduleAutoSave(){
    if(scheduled)return;
    scheduled=true;
    queueMicrotask(autoSave);
  }

  const observer=new MutationObserver(mutations=>{
    if(mutations.some(mutation=>mutation.type==='childList'))scheduleAutoSave();
  });

  observer.observe(root,{childList:true});
  window.addEventListener('pagehide',autoSave);
})();