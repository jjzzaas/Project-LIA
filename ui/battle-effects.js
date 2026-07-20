(()=>{
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

  function resolveElement(target){
    if(!target)return null;
    if(target instanceof Element)return target;
    return document.querySelector(target);
  }

  function getBattleRoot(){
    return document.querySelector('.battle-screen')||document.querySelector('.screen')||document.body;
  }

  function ensureLayer(root=getBattleRoot()){
    let layer=root.querySelector(':scope > .battle-effect-layer');
    if(!layer){
      layer=document.createElement('div');
      layer.className='battle-effect-layer';
      layer.setAttribute('aria-hidden','true');
      root.appendChild(layer);
    }
    return layer;
  }

  function centerOf(element,root){
    const rect=element.getBoundingClientRect();
    const rootRect=root.getBoundingClientRect();
    return {
      x:rect.left-rootRect.left+rect.width/2,
      y:rect.top-rootRect.top+rect.height/2
    };
  }

  function addTemporaryClass(element,className,duration){
    if(!element)return Promise.resolve();
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
    return wait(duration).then(()=>element.classList.remove(className));
  }

  async function hit(target,options={}){
    const element=resolveElement(target);
    if(!element)return;
    const duration=options.duration??360;
    element.classList.remove('battle-hit','battle-hit-heavy');
    void element.offsetWidth;
    element.classList.add(options.heavy?'battle-hit-heavy':'battle-hit');
    await wait(duration);
    element.classList.remove('battle-hit','battle-hit-heavy');
  }

  async function lunge(attacker,options={}){
    const element=resolveElement(attacker);
    if(!element)return;
    const direction=options.direction==='left'?'left':'right';
    const className=direction==='left'?'battle-lunge-left':'battle-lunge-right';
    await addTemporaryClass(element,className,options.duration??420);
  }

  function damagePopup(target,value,options={}){
    const element=resolveElement(target);
    if(!element)return;
    const root=getBattleRoot();
    const layer=ensureLayer(root);
    const point=centerOf(element,root);
    const popup=document.createElement('div');
    popup.className=`battle-damage-popup${options.heal?' is-heal':''}${options.critical?' is-critical':''}`;
    popup.textContent=options.heal?`+${Math.abs(value)}`:`-${Math.abs(value)}`;
    popup.style.left=`${point.x}px`;
    popup.style.top=`${point.y}px`;
    layer.appendChild(popup);
    setTimeout(()=>popup.remove(),850);
  }

  function impact(target,type='slash',options={}){
    const element=resolveElement(target);
    if(!element)return;
    const root=getBattleRoot();
    const layer=ensureLayer(root);
    const point=centerOf(element,root);
    const effect=document.createElement('div');
    effect.className=`battle-impact battle-impact-${type}`;
    effect.style.left=`${point.x}px`;
    effect.style.top=`${point.y}px`;
    if(options.scale)effect.style.setProperty('--effect-scale',String(options.scale));
    layer.appendChild(effect);
    setTimeout(()=>effect.remove(),600);
  }

  function projectile(attacker,target,type='arrow',options={}){
    const from=resolveElement(attacker);
    const to=resolveElement(target);
    if(!from||!to)return Promise.resolve();
    const root=getBattleRoot();
    const layer=ensureLayer(root);
    const start=centerOf(from,root);
    const end=centerOf(to,root);
    const shot=document.createElement('div');
    shot.className=`battle-projectile battle-projectile-${type}`;
    shot.style.left=`${start.x}px`;
    shot.style.top=`${start.y}px`;
    shot.style.setProperty('--travel-x',`${end.x-start.x}px`);
    shot.style.setProperty('--travel-y',`${end.y-start.y}px`);
    const angle=Math.atan2(end.y-start.y,end.x-start.x)*180/Math.PI;
    shot.style.setProperty('--travel-angle',`${angle}deg`);
    layer.appendChild(shot);
    const duration=options.duration??420;
    shot.style.setProperty('--travel-duration',`${duration}ms`);
    return wait(duration).then(()=>shot.remove());
  }

  async function screenShake(options={}){
    const root=getBattleRoot();
    const className=options.heavy?'battle-screen-shake-heavy':'battle-screen-shake';
    await addTemporaryClass(root,className,options.duration??340);
  }

  async function playAttack(options={}){
    const {
      attacker,
      target,
      type='slash',
      damage,
      heavy=false,
      projectileType,
      onImpact
    }=options;

    const attackerElement=resolveElement(attacker);
    const targetElement=resolveElement(target);
    if(!targetElement){
      if(typeof onImpact==='function')onImpact();
      return;
    }

    if(projectileType){
      if(attackerElement)await addTemporaryClass(attackerElement,'battle-ranged-cast',220);
      await projectile(attackerElement,targetElement,projectileType,options);
    }else if(attackerElement){
      const a=attackerElement.getBoundingClientRect();
      const t=targetElement.getBoundingClientRect();
      await lunge(attackerElement,{direction:a.left<t.left?'right':'left',duration:300});
    }

    impact(targetElement,type,{scale:heavy?1.25:1});
    if(typeof onImpact==='function')onImpact();
    if(Number.isFinite(damage))damagePopup(targetElement,damage,{critical:options.critical});
    await Promise.all([
      hit(targetElement,{heavy,duration:heavy?460:340}),
      heavy?screenShake({heavy:true,duration:420}):Promise.resolve()
    ]);
  }

  window.BattleEffects={
    wait,
    hit,
    lunge,
    impact,
    projectile,
    damagePopup,
    screenShake,
    playAttack
  };
})();