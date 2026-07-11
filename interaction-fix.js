(()=>{
  const $=s=>document.querySelector(s);
  const armed=new WeakMap();
  const pressed=new WeakMap();

  function activeOverlayFrom(target){
    const el=target?.closest?.('.smooth-story.show, .day2-scene.show');
    return el||null;
  }

  function armOverlay(el){
    if(!el)return;
    armed.set(el,Date.now()+650);
    pressed.set(el,false);
  }

  document.querySelectorAll('.smooth-story.show,.day2-scene.show').forEach(armOverlay);

  const observer=new MutationObserver(records=>{
    for(const record of records){
      const el=record.target;
      if(!(el instanceof Element))continue;
      if(el.matches('.smooth-story.show,.day2-scene.show'))armOverlay(el);
    }
  });
  observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});

  document.addEventListener('pointerdown',e=>{
    const overlay=activeOverlayFrom(e.target);
    if(!overlay)return;
    if(Date.now()<(armed.get(overlay)||0)){
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    pressed.set(overlay,true);
  },true);

  document.addEventListener('click',e=>{
    const overlay=activeOverlayFrom(e.target);
    if(!overlay)return;
    const ready=Date.now()>=(armed.get(overlay)||0);
    const freshPress=pressed.get(overlay)===true;
    if(!ready||!freshPress){
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    pressed.set(overlay,false);
  },true);

  function syncVillage(){
    const tile=$('.village-tile');
    if(!tile)return;
    const state=localStorage.getItem('projectLiaMission');
    if(state==='f_delivery_active'||state==='f_delivery_complete'){
      tile.classList.remove('locked');
      tile.classList.add('unlocked');
      const label=tile.querySelector('span');
      if(label&&state==='f_delivery_active')label.textContent='새 목적지';
      if(state==='f_delivery_active')tile.classList.add('guided');
    }
  }

  syncVillage();

  document.addEventListener('click',e=>{
    const accept=e.target.closest('.mission-card button');
    if(accept)setTimeout(syncVillage,0);
  },true);

  document.addEventListener('click',e=>{
    const tile=e.target.closest('.village-tile');
    if(!tile)return;
    const state=localStorage.getItem('projectLiaMission');
    if(state!=='f_delivery_active'&&state!=='f_delivery_complete')return;

    e.preventDefault();
    e.stopImmediatePropagation();

    tile.classList.remove('locked','guided');
    tile.classList.add('unlocked');
    const lobby=$('#main-lobby');
    const map=$('.village-map');
    if(lobby)lobby.classList.remove('show');
    if(map)map.classList.add('show');
  },true);
})();