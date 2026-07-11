(()=>{
  const $=s=>document.querySelector(s);
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const lobby=$('#main-lobby');
  const menu=$('.lobby-menu');
  const quest=$('.quest-toast b');
  if(!lobby||!menu)return;

  const affinity=document.createElement('button');
  affinity.className='locked affinity-tile';
  affinity.innerHTML='<b>호감도</b><span>🔒 잠김</span>';

  const village=document.createElement('button');
  village.className='locked village-tile';
  village.innerHTML='<b>마을</b><span>잠김</span>';
  menu.append(affinity,village);

  const scene=document.createElement('section');
  scene.className='day2-scene';
  scene.innerHTML='<div class="day2-bg"></div><div class="day2-dialog"><b id="d2-speaker"></b><p id="d2-text"></p><small>화면을 터치해 계속</small></div>';
  document.body.appendChild(scene);

  const mission=document.createElement('section');
  mission.className='mission-card';
  mission.innerHTML='<div><small>F-RANK REQUEST</small><h2>의료 물자 전달</h2><p>상업 구역의 물약 상점에 협회 의료용 약초 꾸러미를 전달하고, 수령 확인서를 받아오세요.</p><b>보상 500 크레딧</b><button>임무 수락</button></div>';
  document.body.appendChild(mission);

  const map=document.createElement('section');
  map.className='village-map';
  map.innerHTML=`
    <header><div><small>COMMERCIAL DISTRICT</small><h2>마을 지도</h2></div><button id="map-back">로비로</button></header>
    <div class="map-grid">
      <button class="shop potion objective" data-place="potion"><span>목적지</span><b>물약 상점</b><small>의료 물자 전달</small></button>
      <button class="shop weapon" data-place="weapon"><b>장비 상점</b><small>잠김</small></button>
      <button class="shop food" data-place="food"><b>식료품점</b><small>준비 중</small></button>
      <button class="shop broker" data-place="broker"><b>잡화 중개소</b><small>준비 중</small></button>
      <div class="map-core"><i></i><b>상업 구역 중앙광장</b></div>
    </div>
    <div class="map-hint">반짝이는 목적지를 선택하세요.</div>`;
  document.body.appendChild(map);

  const style=document.createElement('style');
  style.textContent=`
    .day2-scene{position:fixed;inset:0;z-index:120;background:#050807;color:#fff;opacity:0;visibility:hidden;transition:.45s}
    .day2-scene.show{opacity:1;visibility:visible}
    .day2-bg{position:absolute;inset:0;background:radial-gradient(circle at 70% 20%,#66887a44,transparent 32%),linear-gradient(145deg,#18231f,#050807 65%)}
    .day2-dialog{position:absolute;left:5%;right:5%;bottom:5%;padding:18px 20px;border:1px solid #ffffff22;border-radius:14px;background:#07100eef;min-height:105px;cursor:pointer}
    .day2-dialog b{color:#8ee7bf;font-size:12px}.day2-dialog p{font-family:'Noto Serif KR',serif;font-size:clamp(16px,2.5vw,22px);line-height:1.65;margin:8px 0}.day2-dialog small{color:#ffffff55}
    .mission-card{position:fixed;inset:0;z-index:130;display:flex;align-items:center;justify-content:center;background:#000c;opacity:0;visibility:hidden;transition:.4s}
    .mission-card.show{opacity:1;visibility:visible}.mission-card>div{width:min(520px,88vw);padding:25px;border:1px solid #8ee7bf55;border-radius:16px;background:#0a1411;color:#fff}.mission-card small,.mission-card b{color:#8ee7bf}.mission-card p{line-height:1.7;color:#ffffffb5}.mission-card button{width:100%;margin-top:18px;padding:14px;border:1px solid #8ee7bf66;border-radius:10px;background:#13241e;color:#fff}
    .lobby-menu .affinity-tile,.lobby-menu .village-tile{display:flex}
    .village-tile.unlocked{opacity:1!important;filter:none!important;border-color:#8ee7bf55!important}
    .village-tile.unlocked span{color:#8ee7bf!important}
    .village-tile.guided{animation:destinationPulse 1.15s ease-in-out infinite;box-shadow:0 0 24px #8ee7bf55}
    .village-map{position:fixed;inset:0;z-index:125;background:radial-gradient(circle at 50% 38%,#29433e,#091011 72%);color:#fff;opacity:0;visibility:hidden;transition:.5s;overflow:hidden}
    .village-map.show{opacity:1;visibility:visible}
    .village-map header{position:absolute;left:0;right:0;top:0;z-index:4;display:flex;justify-content:space-between;align-items:center;padding:20px 5%;background:linear-gradient(#030706ef,transparent)}
    .village-map header small{color:#8ee7bf;font-size:9px;letter-spacing:.18em}.village-map header h2{margin:4px 0}.village-map header button{padding:9px 13px;border:1px solid #ffffff24;border-radius:999px;background:#07100dcc;color:#fff}
    .map-grid{position:absolute;left:50%;top:52%;width:min(850px,92vw);height:min(560px,68vh);transform:translate(-50%,-50%);border:1px solid #ffffff16;border-radius:28px;background:radial-gradient(circle,#628d7d21,transparent 55%),linear-gradient(135deg,#11201d,#0a1112);box-shadow:0 30px 90px #000a;overflow:hidden}
    .map-grid:before,.map-grid:after{content:'';position:absolute;background:#ffffff0c}.map-grid:before{left:49%;top:0;bottom:0;width:7%}.map-grid:after{top:47%;left:0;right:0;height:8%}
    .shop{position:absolute;width:27%;min-height:105px;padding:14px;border:1px solid #ffffff20;border-radius:16px;background:#101a19e8;color:#fff;text-align:left;z-index:2}
    .shop b,.shop small,.shop span{display:block}.shop b{font-size:15px}.shop small{margin-top:6px;color:#ffffff72}.shop span{margin-bottom:8px;color:#8ee7bf;font-size:9px;letter-spacing:.14em}
    .shop.potion{left:8%;top:13%}.shop.weapon{right:8%;top:13%}.shop.food{left:8%;bottom:13%}.shop.broker{right:8%;bottom:13%}
    .shop.objective{border-color:#9ef0cf;background:linear-gradient(135deg,#1d4034,#10201d);animation:objectiveSpark 1.2s ease-in-out infinite}
    .map-core{position:absolute;left:50%;top:50%;z-index:3;transform:translate(-50%,-50%);width:150px;height:150px;border:1px solid #8ee7bf35;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:#0c1715;box-shadow:0 0 50px #8ee7bf24}
    .map-core i{width:36px;height:36px;border:2px solid #8ee7bf;border-radius:50%;margin-bottom:8px}.map-core b{font-size:12px}
    .map-hint{position:absolute;left:50%;bottom:4%;transform:translateX(-50%);color:#ffffff83;font-size:11px;letter-spacing:.08em}
    @keyframes destinationPulse{50%{transform:translateY(-3px);border-color:#b8ffe1;box-shadow:0 0 0 8px #8ee7bf00,0 0 30px #8ee7bf7a}}
    @keyframes objectiveSpark{50%{transform:translateY(-3px) scale(1.015);box-shadow:0 0 32px #8ee7bf70}}
    @media(max-width:600px){.map-grid{height:63vh}.shop{width:35%;min-height:92px;padding:11px}.shop.potion,.shop.food{left:5%}.shop.weapon,.shop.broker{right:5%}.map-core{width:115px;height:115px}.map-core b{font-size:10px}}
  `;
  document.head.appendChild(style);

  const speaker=$('#d2-speaker');
  const text=$('#d2-text');

  async function waitForFreshTap(){
    await wait(260);
    await new Promise(resolve=>{
      const handler=e=>{
        e.preventDefault();
        scene.removeEventListener('click',handler);
        resolve();
      };
      scene.addEventListener('click',handler);
    });
  }

  async function lines(items){
    scene.classList.add('show');
    for(const [s,t] of items){
      speaker.textContent=s;
      text.textContent=t;
      await waitForFreshTap();
      await wait(120);
    }
    scene.classList.remove('show');
    await wait(350);
  }

  async function narration(items){
    await lines(items.map(t=>['',t]));
  }

  async function startDay2(){
    localStorage.setItem('projectLiaDay','2');
    await narration([
      '희미한 아침빛이 창문 틈으로 스며들었다. 낯선 천장, 낯선 방. 그리고 여전히 아무것도 떠오르지 않는 기억.',
      '어제와 달라진 것은 없었다. 내가 누구인지도, 왜 숲에서 눈을 떴는지도 알 수 없었다.',
      '하지만 언제까지고 모르는 것만 붙잡고 있을 수는 없다. 지금 내게 있는 건 빌린 방 하나와 텅 빈 주머니뿐이었다.'
    ]);
    await lines([
      ['PLAYER','살아가려면 돈이 필요해. 우선 일부터 찾아야겠어.'],
      ['PLAYER','어제 갔던 헌터 협회라면... 뭔가 일거리가 있을지도 몰라.']
    ]);
    await narration(['나는 다시 헌터 협회로 향했다. 입구에 가까워지자, 안쪽에서 누군가의 큰 목소리가 터져 나왔다.']);
    await lines([
      ['???','아니, 여기가 언제부터 무료 숙박소가 됐지? 신원도 제대로 모르는 사람을 덥석 재워줘?'],
      ['안내원','하지만 정말 곤란한 상황이었고, 리아 님께서도 부탁하셔서...'],
      ['PLAYER','그 사람이라면 나야.'],
      ['???','...호오. 제 발로 찾아왔군.'],
      ['PLAYER','신세를 진 건 알아. 갚을 생각도 있고. 일자리를 찾고 있어.'],
      ['협회장','갚겠다? 좋아. 마침 F급도 하기 싫어하는 잡일이 하나 남아 있군.'],
      ['협회장','리아가 데려왔다고 특별대우 받을 생각은 하지 마.']
    ]);
    await narration(['협회장은 의뢰서를 데스크 위에 툭 내려놓고는, 더 볼 일 없다는 듯 자리를 떠났다.']);
    await lines([
      ['안내원','너무 신경 쓰지 마세요. 원래 말투가 조금 저러세요.'],
      ['안내원','그래도 정말 싫은 사람이었다면... 일거리조차 주지 않으셨을 거예요.'],
      ['안내원','일을 받으시려면 먼저 헌터 등급을 확인해야 해요. 잠시 측정기에 손을 올려주시겠어요?']
    ]);
    await narration([
      '차가운 측정판 위에 손을 올렸다. 짧은 전자음과 함께 수치가 빠르게 올라가기 시작했다.',
      'ERROR.',
      '안내원은 미간을 좁히고 다시 측정을 시작했다. 두 번째도, 세 번째도 결과는 같았다.',
      '또 오류다. 어제 검문소에서도 그랬다.'
    ]);
    await lines([
      ['안내원','이상하네요... 측정기가 고장 난 걸까요?'],
      ['안내원','일단 능력을 확인할 수 없으니 규정상 임시 F등급으로 등록해 드릴게요.'],
      ['안내원','F등급 일이 내키지 않으실 수도 있지만, 우선 이것부터 시작해 보시는 건 어떨까요?']
    ]);
    mission.classList.add('show');
  }

  mission.querySelector('button').addEventListener('click',()=>{
    mission.classList.remove('show');
    village.classList.remove('locked');
    village.classList.add('unlocked','guided');
    village.querySelector('span').textContent='새 목적지';
    quest.textContent='마을로 이동해 F등급 임무를 수행하세요.';
    lobby.classList.add('show');
    localStorage.setItem('projectLiaMission','f_delivery_active');
  });

  village.addEventListener('click',()=>{
    if(village.classList.contains('locked'))return;
    village.classList.remove('guided');
    lobby.classList.remove('show');
    map.classList.add('show');
  });

  map.querySelector('#map-back').addEventListener('click',()=>{
    map.classList.remove('show');
    lobby.classList.add('show');
  });

  map.addEventListener('click',async e=>{
    const place=e.target.closest('.shop[data-place]');
    if(!place)return;
    if(place.dataset.place!=='potion'){
      const old=map.querySelector('.map-hint').textContent;
      map.querySelector('.map-hint').textContent='아직 이용할 수 없는 시설이다.';
      setTimeout(()=>map.querySelector('.map-hint').textContent=old,1300);
      return;
    }

    map.classList.remove('show');
    await narration([
      '돔의 상업 구역은 협회와는 전혀 다른 활기로 가득했다. 작은 상점과 사람들의 목소리가 이어지고, 인공 조명 아래에서도 하루는 분명히 흘러가고 있었다.',
      '목적지로 표시된 물약 상점 앞에 도착했다. 유리 진열장 너머로 약초와 회복제가 가지런히 놓여 있었다.',
      '나는 협회에서 받은 의료용 약초 꾸러미를 상점 주인에게 건넸다.'
    ]);
    await lines([
      ['물약 상인','협회에서 왔군. 물건은 이상 없어. 여기 수령 확인서 받아가.'],
      ['PLAYER','이걸 협회에 가져다주면 되는 거지?'],
      ['물약 상인','그래. 첫 임무인가 본데, 너무 긴장할 것 없어. 이런 일도 누군가는 해야 하니까.']
    ]);
    await narration([
      '별다른 사건은 없었다. 물건을 전달하고 확인서를 받았다. 그렇게 내 첫 F등급 임무는 무사히 끝났다.',
      '나는 수령 확인서를 들고 다시 헌터 협회로 돌아왔다.'
    ]);
    await lines([
      ['안내원','확인했습니다. 첫 임무 완료네요. 수고하셨어요.'],
      ['안내원','보상 500 크레딧을 지급해 드릴게요.']
    ]);

    const credits=Number(localStorage.getItem('projectLiaCredits')||0)+500;
    localStorage.setItem('projectLiaCredits',String(credits));
    const creditValue=$('#credit-value');
    if(creditValue)creditValue.textContent=credits.toLocaleString();
    localStorage.setItem('projectLiaMission','f_delivery_complete');
    quest.textContent='F등급 임무 완료';
    place.classList.remove('objective');
    place.querySelector('span')?.remove();
    place.querySelector('small').textContent='임무 완료';
    lobby.classList.add('show');
  });

  const rest=$('#room-rest');
  if(rest){
    rest.addEventListener('click',async e=>{
      if(localStorage.getItem('projectLiaDay2Started'))return;
      e.stopImmediatePropagation();
      e.preventDefault();
      localStorage.setItem('projectLiaDay2Started','1');
      const room=$('.lodging-scene');
      if(room)room.classList.remove('show');
      await wait(350);
      await narration([
        '침대에 몸을 눕히자, 하루 동안 억눌러 두었던 피로가 한꺼번에 밀려왔다.',
        '라군, 리아, 돔... 알 수 없는 것투성이인 하루였다.',
        '나는 천천히 눈을 감았다.'
      ]);
      await startDay2();
    },true);
  }
})();