export const chapter001 = {
  id: 1,
  title: '낯선 세계',
  scenes: [
    { id: 'c1-title', mode: 'black', center: 'CHAPTER 1\n\n낯선 세계' },
    { id: 'c1-heartbeat', mode: 'black', center: '쿵……\n\n쿵……' },
    { id: 'c1-wake-1', mode: 'black', speaker: '주인공', text: '……여긴 어디지?' },
    { id: 'c1-wake-2', mode: 'black', narration: true, text: '머릿속은 텅 비어 있었다. 이름도, 과거도, 이곳에 온 이유도 떠오르지 않았다.' },
    { id: 'c1-forest-open', mode: 'forest', narration: true, text: '눈을 뜨자 푸른 안개가 깔린 숲이 보였다. 흙냄새와 차가운 공기가 지나치게 선명했다.' },
    { id: 'c1-status-instinct', mode: 'forest', narration: true, text: '몸을 일으키려는 순간, 머릿속에 낯선 감각이 스쳤다. 무언가를 확인해야 한다는 본능적인 감각이었다.' },
    { id: 'c1-status-open', mode: 'status', center: '스테이터스\n\n이름  알 수 없음\n레벨  1\n힘  1   민첩  1\n체력  1   정신력  1\n\n스킬  없음\n구현 무기  없음' },
    { id: 'c1-status-reaction', mode: 'forest', speaker: '주인공', text: '……스테이터스?' },
    { id: 'c1-status-close', mode: 'forest', narration: true, text: '의문을 품는 순간 반투명한 창은 허공에서 사라졌다. 낯선 현상이었지만, 이상하게 사용법만큼은 알고 있었다.' },
    { id: 'c1-rustle', mode: 'danger', center: '바스락……' },
    { id: 'c1-nightmare-appear', mode: 'danger', narration: true, text: '나무 사이의 어둠이 꿈틀거리더니 검은 생명체가 모습을 드러냈다. 짐승과 비슷했지만 눈도 입도 제자리에 있지 않았다.' },
    { id: 'c1-choice-first-danger', mode: 'danger', speaker: '주인공', text: '무기도 없다. 지금 할 수 있는 건…….', choices: [
      { id: 'c1-danger-run', label: '주변 지형을 살피며 물러난다.', reply: '정면으로 맞서면 위험하다. 빠져나갈 길부터 찾아야 해.', traits: { cautious: 2 } },
      { id: 'c1-danger-guard', label: '두 팔을 들어 공격에 대비한다.', reply: '도망칠 틈이 없다면, 어떻게든 막아야 한다.', traits: { brave: 1 } },
      { id: 'c1-danger-stone', label: '발밑의 돌을 집어 든다.', reply: '무기가 없다면 만들면 된다. 지금은 이거라도 써야 해.', traits: { cautious: 1, brave: 1 } }
    ] },
    { id: 'c1-first-hit', mode: 'battle', narration: true, text: '악몽이 달려들었다. 몸을 비트는 순간 발톱이 옷자락을 찢고 지나갔다.' },
    { id: 'c1-counter', mode: 'battle', narration: true, text: '나는 그대로 몸을 낮춰 악몽의 옆구리를 주먹으로 내리쳤다.' },
    { id: 'c1-impact', mode: 'battle', center: '퍽—!' },
    { id: 'c1-strange-power', mode: 'battle', narration: true, text: '맨손으로 때렸을 뿐인데 검은 몸체가 크게 흔들렸다. 손등은 찢어졌지만, 악몽의 형체도 함께 일그러졌다.' },
    { id: 'c1-finish', mode: 'battle', narration: true, text: '달려드는 머리를 팔로 막고 몇 번이고 주먹을 내질렀다. 마지막 타격이 박히자 악몽은 검은 안개가 되어 무너졌다.' },
    { id: 'c1-after', mode: 'after-battle', narration: true, text: '숨이 턱 끝까지 차올랐다. 손에서는 피가 흘렀고, 발밑에는 붉고 검은 결정 하나가 남아 있었다.' },
    { id: 'c1-voice', mode: 'forest', speaker: '???', text: '거기 계세요?!' },
    { id: 'c1-haru-enter', mode: 'forest', narration: true, text: '활을 든 여자가 나무 사이에서 뛰어나왔다. 그녀는 쓰러진 악몽의 흔적과 피 묻은 내 손을 번갈아 보았다.' },
    { id: 'c1-haru-shock', mode: 'forest', speaker: '???', text: '설마…… 무기도 없이 잡으신 거예요?' },
    { id: 'c1-choice-haru-first', mode: 'forest', speaker: '주인공', text: '처음 보는 사람이다. 뭐라고 답해야 할까.', choices: [
      { id: 'c1-haru-honest', label: '상황을 솔직하게 말한다.', reply: '저도 모르겠습니다. 눈을 뜨자마자 저게 나타났습니다.', trust: { haru: 1 } },
      { id: 'c1-haru-location', label: '여기가 어디인지 먼저 묻는다.', reply: '죄송하지만…… 여기가 어디인지 알려주실 수 있습니까?', traits: { cautious: 1 } },
      { id: 'c1-haru-help', label: '다친 손을 보여주며 도움을 청한다.', reply: '괜찮다면 치료할 방법부터 알려주시겠습니까?', affection: { haru: 1 }, traits: { considerate: 1 } }
    ] },
    { id: 'c1-haru-intro', mode: 'forest', speaker: '하루', text: '저는 하루예요. 우선 상처부터 볼게요.' },
    { id: 'c1-memory-check', mode: 'forest', speaker: '하루', text: '이름은요? 왜 혼자 몽환 숲에 계셨던 거예요?' },
    { id: 'c1-memory-answer', mode: 'forest', speaker: '주인공', text: '모르겠습니다. 제 이름도, 제가 누구인지도 기억나지 않습니다.' },
    { id: 'c1-haru-concern', mode: 'forest', narration: true, text: '하루의 표정에서 경계심이 잠시 짙어졌다. 그러나 피가 흐르는 손을 본 뒤에는 한숨을 내쉬며 붕대를 꺼냈다.' },
    { id: 'c1-haru-city', mode: 'forest', speaker: '하루', text: '여기 혼자 두고 갈 수는 없겠네요. 중앙도시로 가요. 길드에서 신원을 확인해 볼 수 있을 거예요.' },
    { id: 'c1-choice-follow', mode: 'forest-exit', speaker: '하루', text: '걸을 수 있으세요?', choices: [
      { id: 'c1-follow-trust', label: '하루를 믿고 따라간다.', reply: '네. 지금은 하루 씨를 믿겠습니다.', affection: { haru: 1 }, trust: { haru: 2 }, flags: ['haru_first_trust'] },
      { id: 'c1-follow-question', label: '악몽이 무엇인지 묻는다.', reply: '따라가겠습니다. 다만 방금 그 생명체가 무엇인지 알려주세요.', trust: { haru: 1 }, traits: { cautious: 1 } },
      { id: 'c1-follow-thanks', label: '도움을 받아들인다.', reply: '도와주셔서 감사합니다. 폐를 끼치지 않겠습니다.', affection: { haru: 2 }, traits: { considerate: 1 } }
    ] },
    { id: 'c1-world-explain', mode: 'forest-exit', speaker: '하루', text: '방금 싸운 건 악몽이에요. 사람의 정신을 먹고 자라는 존재죠. 자세한 이야기는 안전한 곳에 도착한 뒤에 해요.' },
    { id: 'c1-city-view', mode: 'city-gate', narration: true, text: '숲을 빠져나오자 거대한 성벽과 수많은 건물이 모습을 드러냈다. 처음 보는 도시인데도 어딘가 익숙한 기분이 들었다.' },
    { id: 'c1-haru-arrive', mode: 'city-gate', speaker: '하루', text: '저기가 중앙도시예요. 이제 조금은 안심하셔도 돼요.' },
    { id: 'c1-guild-front', mode: 'guild-front', narration: true, text: '하루를 따라 도시 중심부에 도착하자 검과 날개 문장이 걸린 거대한 건물이 보였다.' },
    { id: 'c1-final', mode: 'guild-front', speaker: '하루', text: '여기가 길드예요. 들어가서 당신에 관한 기록부터 찾아봐요.' },
    { id: 'c1-clear', mode: 'black', center: 'CHAPTER 1 CLEAR' },
    { id: 'c1-end', mode: 'black', ending: true, center: '낯선 세계에서 살아남았다.' }
  ]
};