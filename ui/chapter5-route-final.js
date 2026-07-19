(()=>{
  const previousRenderScene=window.renderScene;
  if(typeof previousRenderScene!=='function')return;

  function normalizeTrainingCenterTerms(scene){
    if(!scene||typeof scene!=='object')return scene;
    const normalized={...scene};
    if(typeof normalized.text==='string'){
      normalized.text=normalized.text.replaceAll('훈련장','훈련 센터').replaceAll('훈련소','훈련 센터');
    }
    return normalized;
  }

  function renderGuildRouteFinal(){
    if(typeof window.renderMainLobby==='function'){
      window.renderMainLobby({
        destination:'guild',
        speaker:'주인공',
        text:'길드장님께서 찾고 계신다.\n메인 로비에서 길드로 이동하자.',
        missionTitle:'CHAPTER 5 · 혼자 걷는 첫걸음',
        missionGoal:'길드로 이동하세요.',
        missionProgress:90
      });
      return;
    }
    previousRenderScene({type:'mainLobby',destination:'guild',speaker:'주인공',text:'길드장님께서 찾고 계신다.\n메인 로비에서 길드로 이동하자.'});
  }

  window.renderScene=function(scene){
    const normalized=normalizeTrainingCenterTerms(scene);
    if(normalized?.type==='guildRoute'){
      renderGuildRouteFinal();
      return;
    }
    previousRenderScene(normalized);
  };
})();