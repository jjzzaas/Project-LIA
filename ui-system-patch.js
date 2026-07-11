(()=>{
  const $=s=>document.querySelector(s);
  const today=()=>new Date().toLocaleDateString('en-CA');

  // One-time migration: current tutorial starts with empty fatigue.
  if(!localStorage.getItem('projectLiaFatigueRuleV2')){
    localStorage.setItem('projectLiaFatigue','0');
    localStorage.setItem('projectLiaFatigueRuleV2','1');
  }

  const mainLobby=$('#main-lobby');
  const stats=$('.lobby-stats');
  if(mainLobby&&stats&&!$('#affinity-locked')){
    const tile=document.createElement('div');
    tile.id='affinity-locked';
    tile.className='affinity-locked';
    tile.innerHTML='<small>호감도</small><b>🔒 잠김</b>';
    tile.title='스토리 진행 후 해금됩니다.';
    stats.appendChild(tile);
  }

  const style=document.createElement('style');
  style.textContent=`
    .affinity-locked{opacity:.68}.affinity-locked b{color:#c6d0cb!important}
    #room-rest.used{opacity:.42!important;border-color:#ffffff24!important;color:#ffffff77!important}
    .daily-rest-note{position:fixed;left:50%;bottom:18%;z-index:130;transform:translateX(-50%);padding:12px 16px;border:1px solid #ffffff24;border-radius:12px;background:#08100ef2;color:#fff;font-size:13px;opacity:0;transition:.35s;pointer-events:none}.daily-rest-note.show{opacity:1}
  `;
  document.head.appendChild(style);

  // Keep the hidden affinity seed accumulated by each relationship choice.
  document.addEventListener('click',e=>{
    const b=e.target.closest('.farewell-choice button[data-choice]');
    if(!b)return;
    const current=Number(localStorage.getItem('liaAffinitySeed')||0);
    const gain=b.dataset.choice==='interest'?2:b.dataset.choice==='thanks'?1:0;
    localStorage.setItem('liaAffinitySeed',String(current+gain));
  },true);

  // Daily rest: one use per local calendar day, 0 -> 100 charge.
  const note=document.createElement('div');
  note.className='daily-rest-note';
  document.body.appendChild(note);
  let noteTimer=0;
  function showNote(text){
    note.textContent=text;note.classList.add('show');
    clearTimeout(noteTimer);noteTimer=setTimeout(()=>note.classList.remove('show'),1800);
  }
  function syncFatigue(value){
    localStorage.setItem('projectLiaFatigue',String(value));
    const el=$('#fatigue-value');if(el)el.textContent=`${value}/100`;
  }
  function syncRestButton(){
    const btn=$('#room-rest');if(!btn)return;
    const used=localStorage.getItem('projectLiaLastRestDate')===today();
    btn.classList.toggle('used',used);
    btn.textContent=used?'오늘 휴식 완료':'휴식하기';
  }
  const roomObserver=new MutationObserver(syncRestButton);
  roomObserver.observe(document.body,{childList:true,subtree:true});
  syncFatigue(Number(localStorage.getItem('projectLiaFatigue')||0));
  syncRestButton();

  document.addEventListener('click',async e=>{
    const btn=e.target.closest('#room-rest');
    if(!btn)return;
    e.preventDefault();e.stopImmediatePropagation();
    if(localStorage.getItem('projectLiaLastRestDate')===today()){
      showNote('오늘은 이미 충분히 쉬었다.');
      syncRestButton();
      return;
    }
    localStorage.setItem('projectLiaLastRestDate',today());
    syncFatigue(100);
    syncRestButton();
    const room=$('.lodging-scene');
    if(room)room.classList.remove('show');
    const overlay=$('.smooth-story');
    if(overlay){
      const p=overlay.querySelector('p');
      overlay.classList.add('show');
      p.textContent='침대에 몸을 눕히자, 하루 동안 쌓인 피로가 천천히 가라앉았다.';
      await new Promise(resolve=>{
        const done=()=>{overlay.removeEventListener('click',done);resolve()};
        overlay.addEventListener('click',done);
      });
      p.textContent='깊은 잠에서 깨어났을 때, 몸은 다시 움직일 준비를 마친 뒤였다.';
      await new Promise(resolve=>{
        const done=()=>{overlay.removeEventListener('click',done);resolve()};
        overlay.addEventListener('click',done);
      });
      overlay.classList.remove('show');
    }
    if(room)room.classList.add('show');
  },true);

  // Two-tap dialogue rule. Override the original typewriter safely after it loads.
  const dialogueBox=$('#dialogue-box');
  const dialogueText=$('#dialogue-text');
  let typing={active:false,full:'',token:0};
  const patchedTypeText=async(text,speed=55)=>{
    const token=++typing.token;
    typing.active=true;typing.full=String(text);dialogueText.textContent='';
    for(const ch of typing.full){
      if(token!==typing.token)return;
      if(!typing.active){dialogueText.textContent=typing.full;return}
      dialogueText.textContent+=ch;
      await new Promise(r=>setTimeout(r,speed));
    }
    if(token===typing.token)typing.active=false;
  };
  try{window.typeText=patchedTypeText}catch(_){ }

  if(dialogueBox){
    dialogueBox.addEventListener('click',e=>{
      if(!typing.active)return;
      e.preventDefault();e.stopImmediatePropagation();
      typing.active=false;typing.token++;
      dialogueText.textContent=typing.full;
    },true);
  }

  // Association dialogue uses direct text changes; give it the same visual typing rule.
  const associationText=$('#association-text');
  const associationBox=$('.association-dialogue');
  if(associationText&&associationBox){
    let assocTyping={active:false,full:'',token:0,internal:false};
    const observer=new MutationObserver(()=>{
      if(assocTyping.internal)return;
      const full=associationText.textContent;
      if(!full)return;
      const token=++assocTyping.token;
      assocTyping.full=full;assocTyping.active=true;assocTyping.internal=true;associationText.textContent='';assocTyping.internal=false;
      (async()=>{
        for(const ch of full){
          if(token!==assocTyping.token)return;
          if(!assocTyping.active){assocTyping.internal=true;associationText.textContent=full;assocTyping.internal=false;return}
          assocTyping.internal=true;associationText.textContent+=ch;assocTyping.internal=false;
          await new Promise(r=>setTimeout(r,38));
        }
        if(token===assocTyping.token)assocTyping.active=false;
      })();
    });
    observer.observe(associationText,{childList:true,characterData:true,subtree:true});
    associationBox.addEventListener('click',e=>{
      if(!assocTyping.active)return;
      e.preventDefault();e.stopImmediatePropagation();
      assocTyping.active=false;assocTyping.token++;
      assocTyping.internal=true;associationText.textContent=assocTyping.full;assocTyping.internal=false;
    },true);
  }
})();