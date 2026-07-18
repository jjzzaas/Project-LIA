(()=>{
  const LAST_CHAPTER=5;
  const originalNext=next;

  function openChapter(chapter){
    const chapterScenes=window[`CHAPTER_${chapter}`];
    if(!Array.isArray(chapterScenes)||chapterScenes.length===0){
      console.warn(`[chapter-transition] CHAPTER_${chapter} 데이터를 찾지 못했습니다.`);
      return false;
    }

    state.chapter=chapter;
    window.SELECTED_CHAPTER=chapter;
    scenes=chapterScenes;
    index=0;
    locked=false;

    const scene=scenes[index];
    if(scene?.type==='name')renderName();
    else renderScene(scene);
    return true;
  }

  next=function(){
    const currentScene=Array.isArray(scenes)?scenes[index]:null;
    if(currentScene?.type==='chapterComplete'){
      const currentChapter=Number(currentScene.chapter||state.chapter||1);
      if(currentChapter<LAST_CHAPTER&&openChapter(currentChapter+1))return;
    }

    originalNext();
  };
})();