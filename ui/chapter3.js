(()=>{
  const previousRenderScene=renderScene;

  function renderMomoService(){
    mount(`<main class="screen lodging">
      <section class="box">
        <div class="text">처음 보는 여자아이가—<br><br>바로 옆에서 자고 있었다.</div>
      </section>
      <div class="hint">터치하여 계속</div>
      <div class="version">Ver. 1.5</div>
    </main>`,()=>app.firstElementChild.onclick=next);
  }

  function renderMomoAwake(scene){
    mount(`<main class="screen lodging">
      <section class="box">
        <div class="speaker">${scene.speaker}</div>
        <div class="text">${scene.text}</div>
      </section>
      <div class="version">Ver. 1.5</div>
    </main>`);
  }

  renderScene=function(scene){
    if(scene.type==='momo-service'){renderMomoService();return;}
    if(scene.type==='momo-awake'){renderMomoAwake(scene);return;}
    previousRenderScene(scene);
  };
})();
