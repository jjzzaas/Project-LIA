(()=>{
  const params=new URLSearchParams(location.search);
  const selected=Number(params.get('chapter')||1);
  window.__MONGYEONG_SELECTED_CHAPTER__=selected===2?2:1;

  if(window.__MONGYEONG_SELECTED_CHAPTER__===2&&Array.isArray(window.CHAPTER_1)){
    const startIndex=window.CHAPTER_1.findIndex(scene=>scene.type==='chapter2');
    if(startIndex>=0)window.CHAPTER_1=window.CHAPTER_1.slice(startIndex);
  }
})();