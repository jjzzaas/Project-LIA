(()=>{
  if(sessionStorage.getItem('mongyeong.devLobby')!=='1')return;
  const original=window.CHAPTER_1;
  if(!Array.isArray(original))return;
  const lobbyIndex=original.findIndex(scene=>scene.type==='mainLobby');
  if(lobbyIndex<0)return;
  window.CHAPTER_1=original.slice(lobbyIndex);
  window.__MONGYEONG_DEV_LOBBY__=true;
})();