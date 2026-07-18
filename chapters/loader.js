(()=>{
  const params=new URLSearchParams(location.search);
  const requested=Number(params.get('chapter')||1);
  const selected=[1,2,3,4,5].includes(requested)?requested:1;
  window.SELECTED_CHAPTER=selected;

  // Keep every chapter array independent. Older loader code replaced CHAPTER_1
  // with the selected chapter, which made later chapter transitions reuse the
  // wrong scene array (for example chapter 4 could display chapter 2 scenes).
  window.INITIAL_CHAPTER_SCENES=window[`CHAPTER_${selected}`]||window.CHAPTER_1;
})();