(()=>{
  const previousRenderScene=renderScene;

  function renderMomoService(){
    mount(`<main class="screen lodging">
      <section class="box">
        <div class="text">처음 보는 여자아이가—<br><br>바로 옆에서 자고 있었다.</div>
      </section>
      <div class="hint">터치하여 계속</div>
      <div class="version">Ver. 1.7</div>
    </main>`,()=>app.firstElementChild.onclick=next);
  }

  function renderMomoAwake(scene){
    mount(`<main class="screen lodging">
      <section class="box">
        <div class="speaker">${scene.speaker}</div>
        <div class="text">${scene.text}</div>
      </section>
      <div class="hint">터치하여 계속</div>
      <div class="version">Ver. 1.7</div>
    </main>`,()=>app.firstElementChild.onclick=next);
  }

  function renderLodgingExit(scene){
    mount(`<main class="screen lodging">
      <button id="lodgingBack" aria-label="숙소에서 나가기" style="position:absolute;left:18px;top:calc(18px + env(safe-area-inset-top));z-index:4;border:1px solid rgba(255,255,255,.28);background:rgba(5,8,14,.72);color:#fff;border-radius:12px;padding:11px 15px;font-size:15px;backdrop-filter:blur(8px)">← 나가기</button>
      <section class="box"><div class="text">${scene.text}</div></section>
      <div class="version">Ver. 1.7</div>
    </main>`,()=>document.getElementById('lodgingBack').onclick=next);
  }

  renderScene=function(scene){
    if(scene.type==='momo-service'){renderMomoService();return;}
    if(scene.type==='momo-awake'){renderMomoAwake(scene);return;}
    if(scene.type==='lodgingExit'){renderLodgingExit(scene);return;}
    previousRenderScene(scene);
  };
})();
