export const chapter003 = {
  id: 3,
  title: '낯선 동행',
  scenes: [
    { id: 'c3-title', mode: 'black', center: 'CHAPTER 3\n\n낯선 동행' },
    { id: 'c3-morning-light', mode: 'black', narration: true, text: '희미한 아침빛에 눈을 떴다. 낯선 천장이 먼저 보였고, 그제야 어젯밤 임시 숙소에 들어왔다는 사실이 떠올랐다.' },
    { id: 'c3-sound', mode: 'black', center: '새근……\n\n새근……' },
    { id: 'c3-turn', mode: 'city', narration: true, text: '바로 옆 침상에서 인기척이 들렸다. 고개를 돌리자 처음 보는 소녀가 이불을 끌어안은 채 깊이 잠들어 있었다.' },
    { id: 'c3-confused', mode: 'city', speaker: '주인공', text: '누구지……? 어젯밤에 누가 들어온 건가?' },
    { id: 'c3-choice-first', mode: 'city', speaker: '주인공', text: '소녀를 깨우지 않도록 조용히 움직여야겠다.', choices: [
      {
        id: 'c3-first-quiet',
        label: '조용히 옷을 챙겨 입고 나간다.',
        reply: '괜히 깨우지 말자. 일단 길드에 가서 상황부터 확인해야겠다.',
        traits: { cautious: 1, considerate: 1 },
        followUp: [
          { id: 'c3-first-quiet-action', mode: 'city', narration: true, text: '소리가 나지 않도록 천천히 옷을 챙겨 입고 문고리를 잡았다.' },
          { id: 'c3-first-quiet-look', mode: 'city', narration: true, text: '문을 닫기 전 다시 한번 돌아봤지만 소녀는 여전히 깊이 잠들어 있었다.' }
        ]
      },
      {
        id: 'c3-first-check',
        label: '잠든 소녀를 잠시 살펴본다.',
        reply: '처음 보는 사람이다. 어젯밤에 들어온 것 같지만 지금 깨울 필요는 없겠지.',
        traits: { cautious: 1 },
        followUp: [
          { id: 'c3-first-check-breath', mode: 'city', narration: true, text: '소녀는 이불을 끌어안은 채 고른 숨을 내쉬고 있었다. 당장 깨어날 기색은 없었다.' },
          { id: 'c3-first-check-leave', mode: 'city', narration: true, text: '정체는 길드에서 확인하기로 하고 조용히 숙소를 나섰다.' }
        ]
      },
      {
        id: 'c3-first-wait',
        label: '상황을 정리한 뒤 나간다.',
        reply: '섣불리 판단하지 말자. 기억나는 것부터 차근차근 정리해 보자.',
        traits: { cautious: 1 },
        followUp: [
          { id: 'c3-first-wait-think', mode: 'city', narration: true, text: '어제 숲에서 깨어났고, 하루 씨를 따라 도시에 들어왔다. 하지만 이 소녀에 관한 기억은 어디에도 없었다.' },
          { id: 'c3-first-wait-rise', mode: 'city', narration: true, text: '생각을 마친 뒤 조용히 몸을 일으켰다. 소녀는 여전히 깊이 잠들어 있었다.' }
        ]
      }
    ] },
    { id: 'c3-leave-alone', mode: 'guild-front', narration: true, text: '혼자 숙소를 나와 길드로 향했다. 잠들어 있던 소녀가 누구인지는 나중에 알게 될지도 모른다.' },
    { id: 'c3-guild-voice', mode: 'guild-front', narration: true, text: '길드 문 앞에 도착하자 홀 안쪽에서 높아진 목소리가 새어 나왔다.' },
    { id: 'c3-master-scold', mode: 'guild-front', speaker: '길드장', text: '아무 정보도 없는 외지인을 숙소에 들였다고? 무슨 일이 생기면 어쩌려고 그랬지?' },
    { id: 'c3-guide-defend', mode: 'guild-front', speaker: '안내원', text: '하루 씨가 직접 데려왔고, 밖에 그대로 둘 수도 없었어요. 하룻밤만 임시로 허가한 겁니다.' },
    { id: 'c3-mc-realize', mode: 'guild-front', speaker: '주인공', text: '……아무래도 제 이야기인 것 같습니다.' },
    { id: 'c3-guild-enter', mode: 'city', narration: true, text: '문을 열고 홀 안으로 들어서자 안내원과 길드장이 동시에 이쪽을 바라봤다.' },
    { id: 'c3-master-first', mode: 'city', speaker: '길드장', text: '네가 그 외지인이냐.' },
    { id: 'c3-guide-explain', mode: 'city', speaker: '안내원', text: '하루 씨가 몽환 숲에서 발견한 분이에요. 기억을 잃었고, 확인할 수 있는 신원 정보도 아직 없습니다.' },
    { id: 'c3-master-distrust', mode: 'city', speaker: '길드장', text: '이름도, 출신도, 여기 온 이유도 모른다라……. 하루가 데려왔다고 해도 선뜻 마음 놓을 상황은 아니군.' },
    { id: 'c3-mc-answer', mode: 'city', speaker: '주인공', text: '의심받는 건 당연했다. 나조차 내가 누구인지 알지 못한다.' },
    { id: 'c3-choice-repay', mode: 'city', speaker: '주인공', text: '그래도 도움만 받고 있을 수는 없었다.', choices: [
      { id: 'c3-repay-work', label: '잡일이라도 하겠다고 말한다.', reply: '숙소까지 내주셨는데 가만히 있을 수는 없습니다. 잡일이라도 좋으니 시켜주십시오.', traits: { brave: 1, justice: 1 } },
      { id: 'c3-repay-labor', label: '힘쓰는 일을 돕겠다고 말한다.', reply: '힘을 쓰는 일이라도 괜찮습니다. 제가 할 수 있는 일은 돕겠습니다.', traits: { justice: 1, considerate: 1 } },
      { id: 'c3-repay-follow', label: '길드의 지시에 따르겠다고 한다.', reply: '경계하시는 건 이해합니다. 우선 시키시는 일부터 하겠습니다.', traits: { cautious: 1 } }
    ] },
    { id: 'c3-master-dismissive', mode: 'city', speaker: '길드장', text: '말은 잘하는군. 그럼 잔심부름이라도 하든가.' },
    { id: 'c3-master-errand', mode: 'city', speaker: '길드장', text: '외곽 방호 장치에 교체할 부품이 있다. 가져가서 작업을 거들고 와. 별것 아닌 일이니 괜한 문제만 만들지 말고.' },
    { id: 'c3-door-open', mode: 'city', narration: true, text: '그때 길드 문이 열리고 한 소녀가 조심스럽게 안으로 들어왔다. 아침에 숙소에서 잠들어 있던 바로 그 소녀였다.' },
    { id: 'c3-master-calls-momo', mode: 'city', speaker: '길드장', text: '모모. 마침 잘 왔다.' },
    { id: 'c3-name-realize', mode: 'city', narration: true, text: '그제야 소녀의 이름이 모모라는 것을 알았다. 모모는 홀에 서 있는 낯선 남자를 보고 걸음을 멈췄다.' },
    { id: 'c3-momo-question', mode: 'city', speaker: '모모', text: '저 사람은 누구예요……?' },
    { id: 'c3-master-assign', mode: 'city', speaker: '길드장', text: '오늘 아침 들어온 외지인이다. 외곽까지 데려가서 길만 알려줘. 작업도 제대로 거드는지 옆에서 보고.' },
    { id: 'c3-momo-fear', mode: 'city', narration: true, text: '모모는 낯선 사람과 함께 가야 한다는 말에 불안한 표정을 지었다.' },
    { id: 'c3-momo-accept', mode: 'city', speaker: '모모', text: '……네. 가라면 가야죠.' },
    { id: 'c3-choice-momo', mode: 'city', speaker: '주인공', text: '부담스러워하는 모모에게 어떻게 말할까.', choices: [
      { id: 'c3-momo-distance', label: '필요한 거리만 유지하겠다고 말한다.', reply: '불편하게 하지 않겠습니다. 길만 알려주시면 됩니다.', trust: { momo: 1 }, traits: { considerate: 1 } },
      { id: 'c3-momo-return', label: '문제가 생기면 바로 돌아오겠다고 한다.', reply: '조금이라도 문제가 생기면 바로 돌아오겠습니다.', affection: { momo: 1 }, traits: { cautious: 1 } },
      { id: 'c3-momo-silent', label: '말없이 준비를 기다린다.', reply: '……알겠습니다.', traits: { cautious: 1 } }
    ] },
    { id: 'c3-tools', mode: 'city', narration: true, text: '모모는 공구와 교체 부품을 챙기면서도 낯선 사람인 나를 계속 신경 썼다. 가까이 다가가면 슬쩍 거리를 벌리고, 시선이 마주치면 먼저 피했다.' },
    { id: 'c3-depart', mode: 'city-gate', narration: true, text: '준비를 마친 뒤 우리는 중앙도시 외곽으로 향했다.' },
    { id: 'c3-road-first', mode: 'forest-exit', speaker: '모모', text: '저기요…… 저는 길이랑 작업 순서만 알려드릴 거예요. 이상한 행동을 하면 바로 길드로 돌아갈 거고요.' },
    { id: 'c3-choice-road', mode: 'forest-exit', speaker: '주인공', text: '모모는 나보다 몇 걸음 앞서 걸으며 계속 주변을 확인했다.', choices: [
      { id: 'c3-road-agree', label: '조용히 동의한다.', reply: '네. 그렇게 하겠습니다.', trust: { momo: 1 } },
      { id: 'c3-road-apology', label: '억지로 동행하게 해 미안하다고 한다.', reply: '원해서 오신 게 아닌데 죄송합니다. 최대한 빨리 끝내겠습니다.', affection: { momo: 2 }, traits: { considerate: 1 } },
      { id: 'c3-road-question', label: '점검 순서를 물어본다.', reply: '먼저 어떤 장치부터 확인하면 됩니까?', trust: { momo: 1 }, traits: { cautious: 1 } }
    ] },
    { id: 'c3-momo-that-person', mode: 'forest-exit', speaker: '모모', text: '그쪽은…… 생각보다 말이 잘 통하네요.' },
    { id: 'c3-mc-soften', mode: 'forest-exit', speaker: '주인공', text: '그렇게 위험한 사람처럼 보였습니까?' },
    { id: 'c3-momo-honest', mode: 'forest-exit', speaker: '모모', text: '조금은요. 아니, 꽤 많이요…….' },
    { id: 'c3-outskirts-view', mode: 'forest-exit', narration: true, text: '짧은 대화가 끝난 뒤에도 어색함은 남아 있었다. 그래도 모모의 걸음은 처음보다 조금 느려져 있었다.' },
    { id: 'c3-arrive', mode: 'city-gate', speaker: '모모', text: '저기예요. 저 장치부터 확인하면 돼요. 끝날 때까지 제가 옆에서 보고 있을게요.' },
    { id: 'c3-clear', mode: 'black', center: 'CHAPTER 3 CLEAR' },
    { id: 'c3-end', mode: 'black', ending: true, center: '정식 의뢰가 아닌 잔심부름. 낯선 두 사람의 불편한 동행이 시작되었다.' }
  ]
};