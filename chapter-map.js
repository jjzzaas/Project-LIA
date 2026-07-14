(()=>{
  const chapterMatch=location.hash.match(/^#chapter-(\d+)$/);
  const selectedChapter=chapterMatch?Number(chapterMatch[1]):1;
  const allScenes=window.CHAPTER_1;

  if(Array.isArray(allScenes)&&selectedChapter===2){
    const startIndex=allScenes.findIndex(scene=>scene.type==='chapter2');
    if(startIndex>=0)window.CHAPTER_1=allScenes.slice(startIndex);
  }

  function createMap(){
    if(document.querySelector('.chapter-map'))return;
    const map=document.createElement('nav');
    map.className='chapter-map';
    map.setAttribute('aria-label','챕터 선택');
    map.innerHTML=`
      <div class="chapter-map-line"></div>
      <button type="button" class="chapter-node ${selectedChapter===1?'active':''}" data-chapter="1" aria-label="챕터 1 낯선 숲"><span>1</span><small>낯선 숲</small></button>
      <button type="button" class="chapter-node ${selectedChapter===2?'active':''}" data-chapter="2" aria-label="챕터 2 기록되지 않은 사람"><span>2</span><small>기록되지 않은 사람</small></button>`;
    map.querySelectorAll('.chapter-node').forEach(button=>{
      button.addEventListener('click',event=>{
        event.preventDefault();
        event.stopPropagation();
        const chapter=button.dataset.chapter;
        location.hash=`chapter-${chapter}`;
        location.reload();
      });
    });
    document.body.appendChild(map);
  }

  function decorate(){
    document.querySelectorAll('.version,.battle-version').forEach(el=>el.textContent='Ver. 1.0');
    const title=document.querySelector('.chapter-title');
    if(title?.textContent?.trim()==='CHAPTER 1'&&!title.parentElement?.querySelector('.chapter-sub')){
      const sub=document.createElement('div');
      sub.className='chapter-sub';
      sub.textContent='낯선 숲';
      title.insertAdjacentElement('afterend',sub);
    }
  }

  const app=document.getElementById('app');
  if(app){
    const observer=new MutationObserver(decorate);
    observer.observe(app,{childList:true,subtree:true});
  }

  createMap();
  decorate();
})();