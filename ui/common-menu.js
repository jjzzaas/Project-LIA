(()=>{
  const root=document.getElementById('app');
  if(!root)return;

  const saveApi=window.MONGYEONG_SAVE;
  const blockedSelectors='.title,.main-lobby,.battle-screen,.battle-intro,.reward-screen,.status,.cinematic-chapter,.relationship-choice,.relationship-unlock,.chapter-complete-screen';

  function currentScene(){
    try{return Array.isArray(scenes)&&typeof index==='number'?scenes[index]:null;}catch{return null;}
  }

  function currentChapter(){
    const saved=saveApi?.readSave?.();
    const scene=currentScene();
    return Math.max(1,Number(state?.chapter||scene?.chapter||saved?.progress?.chapter||1));
  }

  function saveCheckpoint(){
    if(!saveApi?.writeSave)return;
    const scene=currentScene();
    if(!scene||typeof index!=='number'||index<0)return;
    const previous=saveApi.readSave?.()||saveApi.createDefaultSave?.()||{};
    saveApi.writeSave({
      ...previous,
      progress:{
        ...(previous.progress||{}),
        chapter:currentChapter(),
        sceneId:scene.id||scene.type||null,
        sceneIndex:index
      }
    });
  }

  function chapterTitle(chapter){
    const titles={1:'몽환 숲',2:'헌터 등록',3:'첫 임무',4:'훈련',5:'정식 의뢰',6:'첫 정식 의뢰'};
    return titles[chapter]||`Chapter ${chapter}`;
  }

  function renderStory(panel){
    const current=currentChapter();
    const rows=Array.from({length:current},(_,i)=>i+1).map(chapter=>{
      const active=chapter===current;
      return `<button class="common-menu__chapter ${active?'is-current':'is-complete'}" type="button" ${active?'data-resume="true"':'disabled'}>
        <span class="common-menu__chapter-number">CHAPTER ${chapter}</span>
        <strong>${chapterTitle(chapter)}</strong>
        <i>${active?'진행 중':'완료'}</i>
      </button>${chapter<current?'<div class="common-menu__line"></div>':''}`;
    }).join('');
    panel.innerHTML=`<div class="common-menu__page-head"><button class="common-menu__back" type="button">‹</button><h2>메인 스토리</h2></div><div class="common-menu__story-map">${rows}</div>`;
    panel.querySelector('.common-menu__back').onclick=()=>renderHome(panel);
    panel.querySelector('[data-resume="true"]')?.addEventListener('click',closeMenu);
  }

  function reachedScenes(){
    try{
      if(!Array.isArray(scenes))return [];
      const end=Math.max(0,Math.min(index,scenes.length-1));
      return scenes.slice(0,end+1).filter(scene=>scene&&scene.text&&!['battle','reward','levelup'].includes(scene.type));
    }catch{return [];}
  }

  function renderHistory(panel){
    const grouped=new Map();
    reachedScenes().forEach(scene=>{
      const chapter=Number(scene.chapter||1);
      if(!grouped.has(chapter))grouped.set(chapter,[]);
      grouped.get(chapter).push(scene);
    });
    const content=[...grouped.entries()].reverse().map(([chapter,items])=>`<section class="common-menu__history-chapter"><h3>CHAPTER ${chapter}</h3>${items.map(scene=>`<div class="common-menu__log">${scene.speaker?`<strong>${scene.speaker}</strong>`:''}<p>${String(scene.text).replace(/</g,'&lt;').replace(/\n/g,'<br>')}</p></div>`).join('')}</section>`).join('')||'<p class="common-menu__empty">아직 기록된 이야기가 없습니다.</p>';
    panel.innerHTML=`<div class="common-menu__page-head"><button class="common-menu__back" type="button">‹</button><h2>히스토리</h2></div><div class="common-menu__scroll">${content}</div>`;
    panel.querySelector('.common-menu__back').onclick=()=>renderHome(panel);
  }

  function relationStage(value){
    if(value>=8)return '신뢰';
    if(value>=4)return '조금 가까워짐';
    if(value>=1)return '관심';
    if(value<=-3)return '경계';
    return '낯섦';
  }

  function relationCard(name,key){
    const value=Number(localStorage.getItem(`mongyeong.${key}`)||state?.[key]||0);
    return `<div class="common-menu__relation"><div><span>${name}</span><strong>${relationStage(value)}</strong></div><div class="common-menu__relation-bar"><i style="width:${Math.max(12,Math.min(100,36+value*6))}%"></i></div></div>`;
  }

  function renderRelationship(panel){
    panel.innerHTML=`<div class="common-menu__page-head"><button class="common-menu__back" type="button">‹</button><h2>호감도</h2></div><div class="common-menu__relations">${relationCard('하루','haruAffinity')}${relationCard('모모','momoAffinity')}<p>관계 수치는 공개되지 않습니다.</p></div>`;
    panel.querySelector('.common-menu__back').onclick=()=>renderHome(panel);
  }

  function renderSettings(panel){
    const textSpeed=localStorage.getItem('mongyeong.textSpeed')||'normal';
    const sound=localStorage.getItem('mongyeong.sound')!=='off';
    const vibration=localStorage.getItem('mongyeong.vibration')!=='off';
    panel.innerHTML=`<div class="common-menu__page-head"><button class="common-menu__back" type="button">‹</button><h2>설정</h2></div><div class="common-menu__settings">
      <label><span>텍스트 속도</span><select id="menuTextSpeed"><option value="slow">느림</option><option value="normal">보통</option><option value="fast">빠름</option></select></label>
      <label><span>효과음</span><input id="menuSound" type="checkbox" ${sound?'checked':''}></label>
      <label><span>진동</span><input id="menuVibration" type="checkbox" ${vibration?'checked':''}></label>
    </div>`;
    panel.querySelector('.common-menu__back').onclick=()=>renderHome(panel);
    const speed=panel.querySelector('#menuTextSpeed');
    speed.value=textSpeed;
    speed.onchange=()=>localStorage.setItem('mongyeong.textSpeed',speed.value);
    panel.querySelector('#menuSound').onchange=e=>localStorage.setItem('mongyeong.sound',e.target.checked?'on':'off');
    panel.querySelector('#menuVibration').onchange=e=>localStorage.setItem('mongyeong.vibration',e.target.checked?'on':'off');
  }

  function renderHome(panel){
    panel.innerHTML=`<div class="common-menu__brand"><small>夢境</small><h2>메뉴</h2></div><nav class="common-menu__nav">
      <button type="button" data-page="story"><span>01</span><strong>메인 스토리</strong><i>›</i></button>
      <button type="button" data-page="history"><span>02</span><strong>히스토리</strong><i>›</i></button>
      <button type="button" data-page="relationship"><span>03</span><strong>호감도</strong><i>›</i></button>
      <button type="button" data-page="settings"><span>04</span><strong>설정</strong><i>›</i></button>
    </nav><button class="common-menu__resume" type="button">게임으로 복귀</button>`;
    panel.querySelector('[data-page="story"]').onclick=()=>renderStory(panel);
    panel.querySelector('[data-page="history"]').onclick=()=>renderHistory(panel);
    panel.querySelector('[data-page="relationship"]').onclick=()=>renderRelationship(panel);
    panel.querySelector('[data-page="settings"]').onclick=()=>renderSettings(panel);
    panel.querySelector('.common-menu__resume').onclick=closeMenu;
  }

  function closeMenu(){document.querySelector('.common-menu-overlay')?.remove();}

  function openMenu(event){
    event?.preventDefault();event?.stopPropagation();
    if(document.querySelector('.common-menu-overlay'))return;
    saveCheckpoint();
    document.querySelector('.story-lobby-overlay')?.remove();
    const overlay=document.createElement('section');
    overlay.className='common-menu-overlay';
    overlay.innerHTML='<div class="common-menu__panel"></div>';
    document.body.appendChild(overlay);
    renderHome(overlay.querySelector('.common-menu__panel'));
  }

  function canShow(){
    const screen=root.firstElementChild;
    if(!screen||screen.matches(blockedSelectors))return false;
    return Boolean(currentScene());
  }

  function syncButton(){
    document.querySelectorAll('.story-lobby-button').forEach(el=>el.remove());
    document.querySelector('.story-lobby-overlay')?.remove();
    const screen=root.firstElementChild;
    if(!screen)return;
    const existing=screen.querySelector(':scope > .common-menu-button');
    if(!canShow()){existing?.remove();closeMenu();return;}
    if(existing)return;
    const button=document.createElement('button');
    button.type='button';button.className='common-menu-button';button.setAttribute('aria-label','공용 메뉴 열기');
    button.innerHTML='<span></span><span></span><span></span>';
    button.onclick=openMenu;
    screen.appendChild(button);
  }

  const observer=new MutationObserver(()=>queueMicrotask(syncButton));
  observer.observe(root,{childList:true,subtree:false});
  syncButton();
})();