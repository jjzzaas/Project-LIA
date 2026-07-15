(()=>{
  const app=document.getElementById('app');
  if(!app)return;

  function apply(){
    document.querySelectorAll('.version,.battle-version').forEach(el=>{
      if(el.textContent!=='Ver. 2.6')el.textContent='Ver. 2.6';
    });
    const title=document.querySelector('.chapter-title');
    if(title?.textContent?.trim()==='CHAPTER 1'&&!title.parentElement?.querySelector('.chapter-sub')){
      const sub=document.createElement('div');
      sub.className='chapter-sub';
      sub.textContent='낯선 숲';
      title.insertAdjacentElement('afterend',sub);
    }
  }

  const observer=new MutationObserver(apply);
  observer.observe(app,{childList:true,subtree:true});
  apply();
})();