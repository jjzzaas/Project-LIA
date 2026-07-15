(()=>{
  const app=document.getElementById('app');
  if(!app)return;

  const VERSION='3.0';

  function apply(){
    document.querySelectorAll('.version,.battle-version').forEach(el=>{
      if(el.textContent!==`Ver. ${VERSION}`)el.textContent=`Ver. ${VERSION}`;
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
