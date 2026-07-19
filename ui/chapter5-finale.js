(()=>{
  const previousRenderScene=window.renderScene;
  if(typeof previousRenderScene!=='function')return;

  function versionText(){
    return typeof window.gameVersionText==='function'?window.gameVersionText():'Ver. 6.7';
  }

  function renderMissionLobby(){
    const app=document.getElementById('app');
    const level=Number(localStorage.getItem('mongyeong.level')||5);
    const credits=Number(localStorage.getItem('mongyeong.credits')||0);

    app.innerHTML=`<main class="screen main-lobby chapter5-mission-lobby">
      <header class="lobby-top">
        <div class="level-badge">Lv. ${level}</div>
        <div class="stamina"><span>활력</span><b>200 / 200</b></div>
        <div class="credits"><span>크레딧</span><b>${credits.toLocaleString()}</b></div>
        <button class="mission-btn mission-btn-alert" id="chapter5MissionButton">임무</button>
      </header>
      <section class="hero-zone">
        <div class="hero-placeholder">HEROINE</div>
        <div class="speech"><strong>주인공</strong><p>길드장실에서 나왔다.<br>등록된 의뢰서를 확인해보자.</p></div>
      </section>
      <nav class="tiles">
        <button class="tile" disabled><span>01</span><strong>길드</strong></button>
        ${[2,3,4,5,6].map(n=>`<button class="tile" disabled><span>0${n}</span><strong>잠김</strong></button>`).join('')}
      </nav>
      <div class="mission-guide">우측 상단 임무 버튼을 선택하세요.</div>
      <div class="version">${versionText()}</div>
    </main>`;

    document.getElementById('chapter5MissionButton').onclick=()=>window.next();
  }

  function renderOfficialMission(){
    const app=document.getElementById('app');
    app.innerHTML=`<main class="screen official-mission-screen">
      <section class="official-mission-card">
        <div class="official-mission-kicker">정식 의뢰</div>
        <h1>호송 물자 인계 지원</h1>

        <div class="mission-field">
          <span>내용</span>
          <p>인접 도시에서 출발한 호송대와 도시 외곽 관문에서 접선한다.<br>길드 보급 물자를 인계받아 길드까지 안전하게 운반한다.</p>
        </div>
        <div class="mission-grid">
          <div class="mission-field"><span>집결 장소</span><p>도시 외곽 관문</p></div>
          <div class="mission-field"><span>출발</span><p>다음 날 아침</p></div>
        </div>
        <div class="mission-field warning"><span>주의 사항</span><p>이동 중 악몽 출몰 가능성 있음.</p></div>
        <div class="mission-field"><span>보상</span><p>길드 규정에 따른 보수 지급</p></div>

        <button id="chapter5MissionConfirm" class="mission-confirm-btn">의뢰서 확인 완료</button>
      </section>
      <div class="version">${versionText()}</div>
    </main>`;

    document.getElementById('chapter5MissionConfirm').onclick=()=>window.next();
  }

  window.renderScene=function(scene){
    if(scene?.type==='missionLobby'){
      renderMissionLobby();
      return;
    }
    if(scene?.type==='officialMission'){
      renderOfficialMission();
      return;
    }
    previousRenderScene(scene);
  };
})();