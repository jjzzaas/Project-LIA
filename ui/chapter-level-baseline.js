(()=>{
  const selected=Number(window.SELECTED_CHAPTER||1);
  const startLevels={1:2,2:3,3:4};
  const minimum=startLevels[selected]||2;
  if(state.level<minimum){
    state.level=minimum;
    state.exp=0;
    save();
  }
})();