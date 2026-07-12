(()=>{
  const $=s=>document.querySelector(s);
  const mainLobby=$('#main-lobby');
  const association=$('.association-scene');
  const associationSpeaker=$('#association-speaker');
  const associationText=$('#association-text');
  const lodging=$('.lobby-menu button:nth-child(4)');
  const quest=$('.quest-toast b');
  if(!mainLobby)return;

  const version=document.createElement('div');
  version.className='game-version';
  version.textContent='Ver. 4.8';
  document.body.appendChild(version);

  const transition=document.createElement('section');
  transition.className='desk-lodging-transition';
  transition.innerHTML='<div><p></p><small>화면을 터치해 계속</small></div>';
  document.body.appendChild(transition);

  const style=document.createElement('style');
  style.textContent=`
    .game-version{position:fixed;left:max(10px,env(safe-area-inset-left));bottom:max(8px,env(safe-area-inset-bottom));z-index:300;color:#ffffff70;font:500 10px/1 'Noto Sans KR',sans-serif;letter-spacing:.08em;pointer-events:none;text-shadow:0 1px 4px #000}
    .desk-lodging-transition{position:fixed;inset:0;z-index:220;display:flex;align-items:center;justify-content:center;padding:28px;background:#000;opacity:0;visibility:hidden;transition:.35s;cursor:pointer}
    .desk-lodging-transition.show{opacity:1;visibility:visible}
    .desk-lodging-transition>div{width:min(820px,90vw);text-align:center}
    .desk-lodging-transition p{color:#f4f1e9;font-family:'Noto Serif KR',serif;font-size:clamp(18px,3vw,27px);line-height:1.8}
    .desk-lodging-transition small{color:#ffffff5f;font-size:10px}
  `;
  document.head.appendChild(style);

  let farewellPending=false;
  let transitionIndex=0;
  const transitionLines=[
    '리아와 안내원의 도움으로, 오늘 밤 머물 수 있는 임시 숙소를 배정받았다.',
    '나는 두 사람에게 다시 한번 고개를 숙인 뒤, 안내받은 숙소로 향했다.'
  ];

  function unlockLodging(){
    if(lodging){
      lodging.classList.remove('locked');
      lodging.classList.add('unlocked','guided');
      const label=lodging.querySelector('span');
      if(label)label.textContent='이동 가능';
    }
    if(quest)quest.textContent='숙소로 이동해 휴식을 취하세요.';
    mainLobby.classList.add('show');
  }

  document.addEventListener('click',e=>{
    const button=e.target.closest('.farewell-choice button[data-choice]');
    if(!button)return;

    e.preventDefault();
    e.stopImmediatePropagation();

    const type=button.dataset.choice;
    const current=Number(localStorage.getItem('liaAffinitySeed')||0);
    const gain=type==='interest'?2:type==='thanks'?1:0;
    localStorage.setItem('liaAffinitySeed',String(current+gain));

    const panel=$('.farewell-choice');
    if(panel)panel.classList.remove('show');

    if(associationSpeaker)associationSpeaker.textContent='리아';
    if(associationText){
      associationText.textContent=type==='interest'
        ? '네. 아마 내일도 협회에 있을 거예요.'
        : type==='thanks'
          ? '저야말로 무사하셔서 다행이에요. 오늘은 푹 쉬세요.'
          : '...네. 내일 봬요.';
    }
    if(association)association.classList.add('show');
    farewellPending=true;
  },true);

  document.addEventListener('click',e=>{
    if(!farewellPending)return;
    if(!e.target.closest('.association-dialogue'))return;

    e.preventDefault();
    e.stopImmediatePropagation();

    farewellPending=false;
    if(association)association.classList.remove('show');
    transitionIndex=0;
    transition.querySelector('p').textContent=transitionLines[0];
    transition.classList.add('show');
  },true);

  transition.addEventListener('click',()=>{
    transitionIndex+=1;
    if(transitionIndex<transitionLines.length){
      transition.querySelector('p').textContent=transitionLines[transitionIndex];
      return;
    }
    transition.classList.remove('show');
    unlockLodging();
  });
})();