(()=>{
  const params=new URLSearchParams(location.search);
  const requested=Number(params.get('chapter')||1);
  const selected=[1,2,3,4].includes(requested)?requested:1;
  window.SELECTED_CHAPTER=selected;
  if(selected===2)window.CHAPTER_1=window.CHAPTER_2;
  if(selected===3)window.CHAPTER_1=window.CHAPTER_3;
  if(selected===4)window.CHAPTER_1=window.CHAPTER_4;
})();
