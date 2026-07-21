export const chapter004 = {
  id: 4,
  title: '외곽의 악몽',
  scenes: [
    { id: 'c4-title', mode: 'black', center: 'CHAPTER 4\n\n외곽의 악몽' },
    { id: 'c4-work-start', mode: 'city-gate', narration: true, text: '고장 난 방호 장치는 생각보다 단순했다. 문제는 무겁고 녹슨 부품을 하나씩 분해해야 한다는 점이었다.' },
    { id: 'c4-momo-work', mode: 'city-gate', speaker: '모모', text: '전투보다 이런 일이 더 힘든 것 같아요…….' },
    { id: 'c4-choice-work', mode: 'city-gate', speaker: '주인공', text: '모모는 낡은 볼트를 붙잡고 끙끙거리고 있었다.', choices: [
      { id: 'c4-work-help', label: '말없이 옆에서 힘을 보탠다.', reply: '제가 잡겠습니다. 같이 돌려보죠.', affection: { momo: 1 }, trust: { momo: 1 }, traits: { considerate: 1 } },
      { id: 'c4-work-rest', label: '잠깐 쉬자고 제안한다.', reply: '조금 쉬었다가 하죠. 무리하다 다치면 더 늦어집니다.', affection: { momo: 1 }, traits: { cautious: 1 } },
      { id: 'c4-work-joke', label: '전투가 아니라 다행이라고 말한다.', reply: '그래도 이건 우리를 물어뜯지는 않으니까요.', affection: { momo: 1 }, traits: { brave: 1 } }
    ] },
    { id: 'c4-repair', mode: 'city-gate', narration: true, text: '둘이 힘을 합치자 작업은 예상보다 빠르게 끝났다. 마지막 부품을 끼우자 방호 장치에 희미한 빛이 돌아왔다.' },
    { id: 'c4-finished', mode: 'city-gate', speaker: '모모', text: '됐다! 생각보다 일찍 끝났어요.' },
    { id: 'c4-return', mode: 'forest-exit', narration: true, text: '남은 공구를 챙긴 뒤 우리는 해가 지기 전에 길드로 돌아가기로 했다.' },
    { id: 'c4-quiet', mode: 'danger', narration: true, text: '그런데 돌아오는 길은 올 때보다 이상할 만큼 조용했다. 바람이 멎고, 길가의 풀이 검게 말라 있었다.' },
    { id: 'c4-momo-stop', mode: 'danger', speaker: '모모', text: '잠깐만요. 이 흔적…… 악몽이 지나간 자리예요.' },
    { id: 'c4-nightmare', mode: 'danger', narration: true, text: '말이 끝나기도 전에 바위 뒤에서 검은 형체가 튀어나왔다. 챕터 1에서 마주친 것보다 훨씬 컸다.' },
    { id: 'c4-momo-fear', mode: 'danger', narration: true, text: '모모는 반사적으로 단검을 꺼냈지만 손이 떨리고 있었다. 악몽이 포효하자 얼굴에서 핏기가 사라졌다.' },
    { id: 'c4-darksite', mode: 'battle', speaker: '모모', text: '다, 다크사이트……!' },
    { id: 'c4-momo-hide', mode: 'battle', narration: true, text: '모모의 형체가 어둠 속으로 녹아들 듯 사라졌다. 악몽의 시선은 홀로 남은 나에게 고정됐다.' },
    { id: 'c4-status-check', mode: 'status', center: '스테이터스\n\n레벨  1\n힘  1   민첩  1\n체력  1   정신력  1\n\n스킬  없음\n구현 무기  없음' },
    { id: 'c4-mc-realize', mode: 'battle', speaker: '주인공', text: '여전히 무기도 스킬도 없다. 그래도 등을 보일 수는 없어.' },
    { id: 'c4-choice-fight', mode: 'battle', speaker: '주인공', text: '악몽이 거리를 좁혀 온다.', choices: [
      { id: 'c4-fight-delay', label: '모모가 도망칠 시간을 번다.', reply: '모모 씨, 뒤도 보지 말고 도시로 가세요!', affection: { momo: 2 }, traits: { brave: 2, considerate: 1 }, flags: ['protected_momo'] },
      { id: 'c4-fight-tool', label: '공구 상자를 무기로 사용한다.', reply: '맨손보다는 낫다. 이걸로 어떻게든 막아야 해.', traits: { cautious: 1, brave: 1 } },
      { id: 'c4-fight-call', label: '모모에게 함께 버티자고 외친다.', reply: '모모 씨! 혼자서는 어렵습니다. 같이 버텨야 합니다!', trust: { momo: 1 }, traits: { brave: 1 } }
    ] },
    { id: 'c4-clash', mode: 'battle', narration: true, text: '공격을 피하며 몇 번이고 반격했지만 이번 악몽은 맨주먹으로 쓰러뜨릴 상대가 아니었다.' },
    { id: 'c4-hit', mode: 'battle', narration: true, text: '굵은 앞발이 옆구리를 후려쳤다. 몸이 바닥을 구르며 숨이 막혔다.' },
    { id: 'c4-danger', mode: 'battle', narration: true, text: '다시 일어나려 했지만 다리에 힘이 들어가지 않았다. 악몽의 발톱이 머리 위로 치켜올라갔다.' },
    { id: 'c4-light', mode: 'battle', center: '파앗—!' },
    { id: 'c4-haru-arrive', mode: 'battle', narration: true, text: '푸른빛의 화살이 악몽의 몸을 꿰뚫었다. 뒤이어 날아온 화살들이 검은 형체를 연달아 밀어냈다.' },
    { id: 'c4-haru-line', mode: 'battle', speaker: '하루', text: '두 분 모두 뒤로 물러나세요!' },
    { id: 'c4-haru-finish', mode: 'battle', narration: true, text: '하루가 마지막 화살을 놓자 악몽은 거대한 안개 덩어리로 흩어졌다.' },
    { id: 'c4-momo-return', mode: 'after-battle', narration: true, text: '다크사이트가 풀리며 모모가 모습을 드러냈다. 그녀는 고개를 들지 못한 채 주먹만 꽉 쥐고 있었다.' },
    { id: 'c4-haru-check', mode: 'after-battle', speaker: '하루', text: '많이 다치셨어요? 걸을 수 있겠어요?' },
    { id: 'c4-choice-after', mode: 'after-battle', speaker: '주인공', text: '옆구리가 욱신거렸지만 모모의 표정이 더 신경 쓰였다.', choices: [
      { id: 'c4-after-fine', label: '괜찮다고 말해 모모를 안심시킨다.', reply: '괜찮습니다. 크게 다친 건 아닙니다.', affection: { momo: 1 }, traits: { considerate: 1 } },
      { id: 'c4-after-haru', label: '하루에게 감사한다.', reply: '조금만 늦었으면 위험했습니다. 구해주셔서 감사합니다.', affection: { haru: 2 }, trust: { haru: 1 } },
      { id: 'c4-after-reflect', label: '자신의 부족함을 인정한다.', reply: '아무것도 하지 못했습니다. 지금 실력으로는 버틸 수 없습니다.', traits: { cautious: 1 }, flags: ['recognized_weakness'] }
    ] },
    { id: 'c4-haru-return', mode: 'forest-exit', speaker: '하루', text: '여기서 오래 머물면 또 악몽이 올 수 있어요. 이야기는 길드에 돌아가서 해요.' },
    { id: 'c4-walk-back', mode: 'city-gate', narration: true, text: '하루의 인솔 아래 우리는 중앙도시로 돌아갔다. 모모는 오는 내내 한마디도 하지 않았다.' },
    { id: 'c4-clear', mode: 'black', center: 'CHAPTER 4 CLEAR' },
    { id: 'c4-end', mode: 'black', ending: true, center: '무사히 돌아왔지만, 아무도 임무가 성공했다고 웃지 못했다.' }
  ]
};