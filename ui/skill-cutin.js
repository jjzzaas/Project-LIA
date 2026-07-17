(()=>{
  const nativeSetTimeout=window.setTimeout.bind(window);
  const CUTIN_DURATION=1900;
  const MIN_SPECIAL_DELAY=2050;
  let activeUntil=0;
  let lastKey='';

  const skillDetails={
    '모모 — 다크사이트':'3턴 동안 적의 공격 대상이 되지 않습니다.\n효과가 유지되는 동안 행동할 수 없습니다.',
    '하루 — 천체낙하':'푸른 천체의 빛이 적 전체를 덮칩니다.\n적 전체에 강한 피해를 줍니다.'
  };

  function escapeHtml(value){
    return String(value).replace(/[&<>'"]/g,char=>({
      '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
    })[char]);
  }

  function readSpecial(){
    const banner=document.querySelector('.special-skill-banner');
    const label=document.getElementById('turnLabel');
    const line=document.getElementById('battleLine');
    const isSpecial=Boolean(banner)||label?.textContent?.trim()==='SPECIAL SKILL';
    if(!isSpecial)return null;

    const bannerName=banner?.querySelector('strong')?.textContent?.trim();
    const lineStrong=line?.querySelector('strong')?.textContent?.trim();
    const name=bannerName||lineStrong||'SPECIAL SKILL';
    const rawDetail=line?.textContent?.replace(name,'').trim();
    const detail=skillDetails[name]||rawDetail||'스킬 효과가 발동했습니다.';
    return {name,detail};
  }

  function showCutin(skill){
    const key=`${skill.name}|${skill.detail}`;
    if(key===lastKey&&Date.now()<activeUntil)return;
    lastKey=key;
    activeUntil=Date.now()+CUTIN_DURATION;

    document.querySelector('.brief-skill-cutin')?.remove();
    const overlay=document.createElement('div');
    overlay.className='brief-skill-cutin';
    overlay.innerHTML=`
      <div class="brief-skill-cutin__panel">
        <span>SPECIAL SKILL</span>
        <strong>${escapeHtml(skill.name)}</strong>
        <p>${escapeHtml(skill.detail).replace(/\n/g,'<br>')}</p>
      </div>`;
    document.body.appendChild(overlay);
    document.documentElement.classList.add('skill-cutin-active');

    nativeSetTimeout(()=>{
      overlay.classList.add('is-leaving');
      nativeSetTimeout(()=>overlay.remove(),220);
      document.documentElement.classList.remove('skill-cutin-active');
    },CUTIN_DURATION);
  }

  const observer=new MutationObserver(()=>{
    const skill=readSpecial();
    if(skill)showCutin(skill);
  });
  observer.observe(document.documentElement,{childList:true,subtree:true,characterData:true});

  window.setTimeout=function(callback,delay=0,...args){
    const skill=readSpecial();
    if(skill){
      showCutin(skill);
      delay=Math.max(Number(delay)||0,MIN_SPECIAL_DELAY);
    }
    return nativeSetTimeout(callback,delay,...args);
  };
})();