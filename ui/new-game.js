(()=>{
  const saveApi=window.MONGYEONG_SAVE;
  const root=document.getElementById('app');
  if(!saveApi||!root)return;

  const saved=saveApi.readSave?.();
  if(!saved?.savedAt||Number(saved.progress?.sceneIndex)<0)return;

  const titleScreen=root.querySelector('.screen.title');
  if(!titleScreen)return;

  const continueButton=titleScreen.querySelector('.continue-button');
  const button=document.createElement('button');
  button.type='button';
  button.className='confirm new-game-button';
  button.textContent='새로하기';
  button.style.marginTop='10px';
  button.style.minWidth='180px';
  button.style.position='relative';
  button.style.zIndex='3';
  button.style.opacity='0.82';

  if(continueButton)continueButton.insertAdjacentElement('afterend',button);
  else{
    const version=titleScreen.querySelector('.version');
    if(version)version.insertAdjacentElement('beforebegin',button);
    else titleScreen.appendChild(button);
  }

  function showConfirm(){
    mount(`<main class="screen black"><section class="relationship-confirm-box"><div class="relationship-confirm-mark">◇</div><div class="relationship-confirm-title">처음부터 다시 시작할까요?</div><div class="relationship-confirm-text">현재 진행 기록과 호감도는 모두 삭제됩니다.<br>삭제한 기록은 되돌릴 수 없습니다.</div><div class="relationship-confirm-actions"><button id="newGameCancel">취소</button><button id="newGameConfirm">새로 시작한다</button></div></section><div class="version">${window.gameVersionText?.()||'Ver. 4.3'}</div></main>`,()=>{
      document.getElementById('newGameCancel').onclick=()=>location.reload();
      document.getElementById('newGameConfirm').onclick=startNewGame;
    });
  }

  function startNewGame(){
    if(!saveApi.clearSave?.())return;
    const cleanUrl=`${location.origin}${location.pathname}`;
    location.replace(cleanUrl);
  }

  button.addEventListener('click',event=>{
    event.preventDefault();
    event.stopPropagation();
    showConfirm();
  });
})();