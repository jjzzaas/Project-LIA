(()=>{
  const previousRenderScene=renderScene;

  function renderMomoService(){
    mount(`<main class="screen momo-service">
      <div class="momo-service__light"></div>
      <section class="momo-service__figure" aria-label="침대 옆에서 자고 있는 낯선 소녀">
        <div class="momo-service__hair"></div>
        <div class="momo-service__face"></div>
        <div class="momo-service__blanket"></div>
      </section>
      <div class="momo-service__caption">처음 보는 여자아이가 바로 옆에서 자고 있었다.</div>
      <div class="hint">터치하여 계속</div>
      <div class="version">Ver. 1.5</div>
    </main>`,()=>app.firstElementChild.onclick=next);
  }

  function renderMomoAwake(scene){
    mount(`<main class="screen momo-awake">
      <div class="momo-awake__light"></div>
      <section class="momo-awake__portrait">
        <div class="momo-awake__hair"></div>
        <div class="momo-awake__face"><span></span><span></span></div>
      </section>
      <section class="box momo-awake__dialogue">
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
