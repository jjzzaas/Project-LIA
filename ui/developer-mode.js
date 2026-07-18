(()=>{
  const root=document.getElementById('app');
  if(!root)return;

  const DEV_PARAM='dev';
  const BACKUP_KEY='mongyeong.devBackup';
  const isDev=new URLSearchParams(location.search).get(DEV_PARAM)==='1';
  let tapCount=0;
  let tapTimer=null;

  function captureStorage(){
    if(sessionStorage.getItem(BACKUP_KEY))return;
    const snapshot={};
    for(let i=0;i<localStorage.length;i+=1){
      const key=localStorage.key(i);
      if(key?.startsWith('mongyeong.'))snapshot[key]=localStorage.getItem(key);
    }
    sessionStorage.setItem(BACKUP_KEY,JSON.stringify(snapshot));
  }

  function restoreStorage(){
    const raw=sessionStorage.getItem(BACKUP_KEY);
    if(!raw)return;
    let snapshot={};
    try{snapshot=JSON.parse(raw)||{};}catch(_error){return;}
    const keys=[];
    for(let i=0;i<localStorage.length;i+=1){
      const key=localStorage.key(i);
      if(key?.startsWith('mongyeong.'))keys.push(key);
    }
    keys.forEach(key=>localStorage.removeItem(key));
    Object.entries(snapshot).forEach(([key,value])=>localStorage.setItem(key,value));
  }

  function chapterUrl(chapter){
    const url=new URL(location.href);
    url.search='';
    url.searchParams.set('chapter',String(chapter));
    url.searchParams.set(DEV_PARAM,'1');
    return url.toString();
  }

  function closeMenu(){
    document.getElementById('developerModeOverlay')?.remove();
  }

  function openMenu(){
    closeMenu();
    const overlay=document.createElement('div');
    overlay.id='developerModeOverlay';
    overlay.innerHTML=`
      <section class="developer-mode-panel" role="dialog" aria-modal="true" aria-label="개발자 모드">
        <div class="developer-mode-kicker">DEVELOPER MODE</div>
        <h2>챕터 바로가기</h2>
        <p>선택한 챕터의 처음부터 재생합니다.<br>개발자 모드의 진행은 실제 저장 기록에 반영되지 않습니다.</p>
        <div class="developer-mode-grid">
          ${[1,2,3,4,5].map(chapter=>`<button type="button" data-dev-chapter="${chapter}">챕터 ${chapter}</button>`).join('')}
        </div>
        <button type="button" class="developer-mode-close">닫기</button>
        ${isDev?'<button type="button" class="developer-mode-exit">개발자 모드 종료</button>':''}
      </section>`;
    document.body.appendChild(overlay);

    overlay.querySelectorAll('[data-dev-chapter]').forEach(button=>{
      button.onclick=()=>{
        captureStorage();
        location.href=chapterUrl(Number(button.dataset.devChapter));
      };
    });
    overlay.querySelector('.developer-mode-close').onclick=closeMenu;
    overlay.querySelector('.developer-mode-exit')?.addEventListener('click',()=>{
      restoreStorage();
      sessionStorage.removeItem(BACKUP_KEY);
      location.href=`${location.origin}${location.pathname}`;
    });
    overlay.addEventListener('click',event=>{
      if(event.target===overlay)closeMenu();
    });
  }

  const style=document.createElement('style');
  style.textContent=`
    #developerModeOverlay{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:24px;background:rgba(0,4,12,.86);backdrop-filter:blur(8px)}
    .developer-mode-panel{width:min(420px,100%);padding:28px 22px;border:1px solid rgba(117,201,255,.45);border-radius:18px;background:linear-gradient(180deg,rgba(9,24,43,.98),rgba(2,8,18,.98));box-shadow:0 24px 70px rgba(0,0,0,.6);text-align:center;color:#eef8ff}
    .developer-mode-kicker{font-size:12px;letter-spacing:.22em;color:#73cfff}
    .developer-mode-panel h2{margin:10px 0 8px;font-size:25px}
    .developer-mode-panel p{margin:0 0 20px;font-size:14px;line-height:1.65;color:#afc5d6}
    .developer-mode-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
    .developer-mode-grid button,.developer-mode-close,.developer-mode-exit{min-height:48px;border:1px solid rgba(116,202,255,.34);border-radius:12px;background:rgba(45,114,160,.18);color:#f4fbff;font:inherit}
    .developer-mode-grid button:last-child{grid-column:1/-1}
    .developer-mode-close,.developer-mode-exit{width:100%;margin-top:12px;background:rgba(255,255,255,.07)}
    .developer-mode-exit{border-color:rgba(255,152,152,.35);color:#ffd0d0}
    .developer-mode-badge{position:fixed;right:12px;top:max(12px,env(safe-area-inset-top));z-index:9998;padding:7px 10px;border:1px solid rgba(115,207,255,.45);border-radius:999px;background:rgba(2,12,25,.78);color:#8edaff;font-size:11px;letter-spacing:.12em}
  `;
  document.head.appendChild(style);

  if(isDev){
    captureStorage();
    const badge=document.createElement('button');
    badge.type='button';
    badge.className='developer-mode-badge';
    badge.textContent='DEV';
    badge.onclick=openMenu;
    document.body.appendChild(badge);
    window.addEventListener('pagehide',restoreStorage);
  }

  document.addEventListener('click',event=>{
    const version=event.target.closest?.('.version,.battle-version');
    if(!version)return;
    event.preventDefault();
    event.stopPropagation();
    clearTimeout(tapTimer);
    tapCount+=1;
    tapTimer=setTimeout(()=>{tapCount=0;},1600);
    if(tapCount>=5){
      tapCount=0;
      openMenu();
    }
  },true);
})();