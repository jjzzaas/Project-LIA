(()=>{
  const SPEED_UNLOCK_KEY='mongyeong.speedUnlocked';
  const SPEED_KEY='mongyeong.battleSpeed';

  function applyTrainingSpeedLock(){
    const button=document.getElementById('trainingSpeed');
    if(!button)return;

    const unlocked=localStorage.getItem(SPEED_UNLOCK_KEY)==='1';
    if(unlocked)return;

    localStorage.setItem(SPEED_KEY,'1');
    button.textContent='🔒 ×1';
    button.classList.add('locked');
    button.disabled=true;
    button.setAttribute('aria-label','1-1 클리어 후 배속 기능이 해금됩니다.');
  }

  const observer=new MutationObserver(applyTrainingSpeedLock);
  observer.observe(document.getElementById('app'),{childList:true,subtree:true});
  applyTrainingSpeedLock();
})();