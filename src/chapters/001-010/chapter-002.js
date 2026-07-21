export const chapter002 = {
  id: 2,
  title: '길드와 임시 숙소',
  scenes: [
    { id: 'c2-title', mode: 'black', center: 'CHAPTER 2\n\n길드와 임시 숙소' },
    { id: 'c2-guild-hall', mode: 'guild-front', narration: true, text: '문이 열리자 넓은 길드 홀이 모습을 드러냈다. 사람들의 시선이 잠시 우리에게 모였다.' },
    { id: 'c2-reception', mode: 'city', speaker: '접수원', text: '처음 보는 분이네요. 무슨 일로 오셨나요?' },
    { id: 'c2-haru-report', mode: 'city', speaker: '하루', text: '몽환 숲에서 발견했어요. 기억을 전부 잃은 상태예요.' },
    { id: 'c2-choice-intro', mode: 'city', speaker: '접수원', text: '본인이 설명할 수 있는 건 없으신가요?', choices: [
      { id: 'c2-intro-honest', label: '아무것도 기억나지 않는다고 솔직히 말한다.', reply: '죄송하지만 정말 아무것도 기억나지 않습니다.', trust: { haru: 1 }, traits: { considerate: 1 } },
      { id: 'c2-intro-calm', label: '침착하게 상황부터 정리해 달라고 부탁한다.', reply: '제가 해야 할 일이 있다면 순서대로 알려주세요.', traits: { cautious: 1 } },
      { id: 'c2-intro-haru', label: '하루에게 설명을 부탁한다.', reply: '하루 씨가 발견 당시 상황을 설명해 주실 수 있을까요?', affection: { haru: 1 } }
    ] },
    { id: 'c2-guildmaster-enter', mode: 'city', speaker: '길드장', text: '소란은 그만. 내가 직접 확인하지.' },
    { id: 'c2-interview', mode: 'city', narration: true, text: '길드장은 몇 가지 질문을 던졌지만, 나는 제대로 답할 수 없었다.' },
    { id: 'c2-choice-attitude', mode: 'city', speaker: '길드장', text: '신원도 기억도 없다. 그래도 이 도시에서 살아가려면 책임은 져야 한다.', choices: [
      { id: 'c2-attitude-accept', label: '할 수 있는 일부터 하겠다고 답한다.', reply: '알겠습니다. 제가 할 수 있는 일부터 하겠습니다.', traits: { brave: 1 }, flags: ['accepted_city_rules'] },
      { id: 'c2-attitude-question', label: '기억을 찾는 방법부터 묻는다.', reply: '기억을 찾을 방법이 있는지부터 알고 싶습니다.', traits: { cautious: 1 } },
      { id: 'c2-attitude-silent', label: '말없이 고개를 끄덕인다.', reply: '……알겠습니다.', trust: { haru: 1 } }
    ] },
    { id: 'c2-temp-room', mode: 'city', speaker: '길드장', text: '오늘은 길드 임시 숙소를 쓰게 해 주지. 내일부터 간단한 일을 맡기겠다.' },
    { id: 'c2-haru-guide', mode: 'city', speaker: '하루', text: '숙소까지 안내해 드릴게요.' },
    { id: 'c2-walk', mode: 'city', narration: true, text: '길드를 나와 골목을 걷는 동안 하루는 도시의 기본적인 규칙을 설명해 주었다.' },
    { id: 'c2-choice-haru', mode: 'city', speaker: '하루', text: '오늘 많이 힘드셨죠?', choices: [
      { id: 'c2-haru-thanks', label: '도와줘서 고맙다고 말한다.', reply: '하루 씨가 없었다면 여기까지 오지 못했을 겁니다. 감사합니다.', affection: { haru: 2 }, trust: { haru: 1 } },
      { id: 'c2-haru-fine', label: '괜찮다고 답한다.', reply: '괜찮습니다. 걱정해 주셔서 감사합니다.', affection: { haru: 1 } },
      { id: 'c2-haru-question', label: '내일부터 무슨 일을 하게 되는지 묻는다.', reply: '내일부터 맡게 될 일은 어떤 건가요?', traits: { cautious: 1 } }
    ] },
    { id: 'c2-room', mode: 'black', narration: true, text: '작은 방이었지만 침대와 책상은 갖춰져 있었다. 문이 닫히자 비로소 혼자가 되었다.' },
    { id: 'c2-monologue', mode: 'black', speaker: '주인공', text: '내가 누구인지도 모르지만, 가만히 있을 수는 없다. 내일부터 하나씩 알아가 보자.' },
    { id: 'c2-clear', mode: 'black', center: 'CHAPTER 2 CLEAR' },
    { id: 'c2-end', mode: 'black', ending: true, center: 'CHAPTER 2\n\n완료' }
  ]
};