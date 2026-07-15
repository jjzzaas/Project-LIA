(()=>{
  const versionText=()=>window.gameVersionText?.()||'Ver. 3.7';

  function renderHunterDistrict(){
    const facilities=[
      {name:'훈련 센터',desc:'기초 전투와 구현화 훈련',open:true},
      {name:'장비 정비소',desc:'장비 점검 및 조정',open:false},
      {name:'강화 연구소',desc:'능력 강화 시스템',open:false},
      {name:'구현화 실험실',desc:'정신 에너지 구현 연구',open:false}
    ];
    mount(`<main class="screen hunter-district-screen"><section class="district-panel"><div class="district-kicker">HUNTER DISTRICT</div><h1>헌터 지구</h1><p>헌터들이 훈련하고 장비를 관리하는 전문 구역이다.</p><div class="district-grid">${facilities.map((facility,index)=>`<button class="district-card ${facility.open?'is-open':'is-locked'}" data-index="${index}" ${facility.open?'':'disabled'}><span>0${index+1}</span><strong>${facility.name}</strong><small>${facility.desc}</small>${facility.open?'':'<em>잠김</em>'}</button>`).join('')}</div></section><div class="version">${versionText()}</div></main>`,()=>{document.querySelector('.district-card.is-open').onclick=next;});
  }

  function renderTrainingMap(scene){
    const unlocked=Math.max(1,Math.min(3,scene.unlocked||1));
    const titles={1:'기초 공격 훈련',2:'모모의 차례',3:'무기 발현'};
    const stages=Array.from({length:10},(_,index)=>index+1);
    mount(`<main class="screen training-map-screen"><header class="training-map-header"><div class="training-map-kicker">TRAINING CENTER</div><h1>기초 훈련 과정</h1><p>아래에서 위로 순서대로 진행됩니다.</p></header><section class="training-route">${stages.slice().reverse().map(stage=>`<div class="training-node-row stage-${stage}"><button class="training-node ${stage<=unlocked?'is-open':'is-locked'}" ${stage<=unlocked?'':'disabled'} data-stage="${stage}"><span>1-${stage}</span><small>${titles[stage]||'잠김'}</small></button></div>`).join('')}<div class="training-route-line"></div></section><div class="version">${versionText()}</div></main>`,()=>{
      document.querySelectorAll('.training-node.is-open').forEach(button=>{
        button.onclick=()=>{
          const stage=Number(button.dataset.stage);
          if(stage===unlocked)next();
        };
      });
      document.querySelector(`.stage-${unlocked} .training-node`)?.scrollIntoView({block:'center',behavior:'instant'});
    });
  }

  const originalRenderScene=renderScene;
  renderScene=function(scene){
    if(scene.type==='hunterDistrict'){renderHunterDistrict();return;}
    if(scene.type==='trainingMap'){renderTrainingMap(scene);return;}
    originalRenderScene(scene);
  };
})();
