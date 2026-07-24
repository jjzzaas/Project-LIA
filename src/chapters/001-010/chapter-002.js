export const chapter002 = {
  id: 2,
  title: '기록되지 않은 사람',
  scenes: [
    { id: 'c2-title', mode: 'black', center: 'CHAPTER 2\n\n기록되지 않은 사람' },
    { id: 'c2-guild-open', mode: 'guild-front', narration: true, text: '길드의 문이 열리자 사람들의 목소리와 발걸음이 한꺼번에 밀려왔다.' },
    { id: 'c2-hall', mode: 'city', narration: true, text: '벽에는 수많은 의뢰서가 붙어 있었고, 무기를 든 사람들이 접수대와 게시판 사이를 오갔다.' },
    { id: 'c2-guide', mode: 'city', speaker: '안내원', text: '하루 씨, 임무 보고인가요?' },
    { id: 'c2-haru-report', mode: 'city', speaker: '하루', text: '네. 그리고 확인해 주셨으면 하는 사람이 있어요. 몽환 숲에서 발견했는데 기억이 전혀 없대요.' },
    { id: 'c2-guide-to-mc', mode: 'city', speaker: '안내원', text: '성함과 소속을 말씀해 주시겠어요?' },
    { id: 'c2-choice-answer', mode: 'city', speaker: '주인공', text: '아는 것이 거의 없다.', choices: [
      { id: 'c2-answer-honest', label: '기억이 없다고 솔직히 말한다.', reply: '죄송하지만 이름도 소속도 기억나지 않습니다.', trust: { haru: 1 }, traits: { considerate: 1 } },
      { id: 'c2-answer-status', label: '스테이터스 결과를 말한다.', reply: '스테이터스에는 이름을 알 수 없다고 표시됩니다.', traits: { cautious: 1 }, flags: ['reported_unknown_status'] },
      { id: 'c2-answer-forest', label: '숲에서 깨어났다고 설명한다.', reply: '몽환 숲에서 눈을 떴습니다. 그 이전은 전혀 기억나지 않습니다.', traits: { cautious: 1 } }
    ] },
    { id: 'c2-status-question', mode: 'city', speaker: '안내원', text: '본인 스테이터스 창은 열 수 있나요? 신원 확인에 필요한 항목만 길드 등록 장치에 공유해 주세요.' },
    { id: 'c2-status-consent', mode: 'status', important: true, center: '<div class="system-window system-window--consent"><div class="system-window__scan" aria-hidden="true"></div><span class="system-window__label">ACCESS REQUEST</span><h2>정보 제공 요청</h2><p class="system-window__message">길드 등록소에서 신원 확인에 필요한 정보를 요청했습니다.</p><div class="system-window__permission"><span>제공 항목</span><strong>이름 · 레벨 · 등록 상태</strong></div><div class="system-window__line"></div><p class="system-window__notice">상세 능력치와 스킬은 공개되지 않습니다.</p></div>', choices: [
      { id: 'c2-consent-yes', label: '필요한 정보 제공에 동의한다.', reply: '동의하겠습니다.', flags: ['status_share_consented'] },
      { id: 'c2-consent-no', label: '어떤 정보가 공개되는지 다시 묻는다.', reply: '제 정보가 어디까지 보이는지 먼저 설명해 주시겠습니까?', traits: { cautious: 1 } }
    ] },
    { id: 'c2-consent-explain', mode: 'city', speaker: '안내원', text: '등록에 필요한 이름, 레벨, 등록 상태만 확인돼요. 상세 능력치나 스킬은 본인의 허가 없이 볼 수 없습니다.' },
    { id: 'c2-status-show', mode: 'status', important: true, center: '스테이터스 정보 공유\n\n이름  열람 제한\n레벨  2\n등록 상태  미등록\n\n신원 정보가 존재하지만 현재 열람할 수 없습니다.' },
    { id: 'c2-guide-confirm', mode: 'city', speaker: '안내원', text: '본래 신원 정보는 존재하는 것 같지만 지금은 열람이 제한되어 있네요. 기억을 잃은 동안 계속 이름 없이 지낼 수는 없으니 임시 등록을 먼저 해둘게요.' },
    { id: 'c2-guide-name', mode: 'city', speaker: '안내원', text: '기억을 되찾을 때까지 사용할 이름을 정해 주세요. 본래 신원이 확인되면 나중에 변경할 수 있습니다.' },
    { id: 'c2-name-input', mode: 'status', important: true, center: '임시 등록명 설정\n\n기억을 되찾을 때까지 사용할 이름을 입력해 주세요.\n\n이 이름은 대화와 스테이터스에 저장됩니다.' },
    { id: 'c2-name-complete', mode: 'city', speaker: '안내원', text: '{{playerName}} 님으로 임시 등록을 마쳤습니다. 기억을 되찾거나 본인 확인이 완료되면 원래 이름으로 변경할 수 있어요.' },
    { id: 'c2-haru-room', mode: 'city', speaker: '하루', text: '그럼 오늘 밤만이라도 임시 숙소를 쓸 수 없을까요? 저 상태로 밖에 둘 수는 없잖아요.' },
    { id: 'c2-guide-hesitate', mode: 'city', speaker: '안내원', text: '정식 등록 절차가 끝나기 전이라 원칙상 어렵지만…… 하루 씨가 발견 경위를 보증한다면 하룻밤은 가능해요.' },
    { id: 'c2-choice-room', mode: 'city', speaker: '주인공', text: '두 사람의 배려를 어떻게 받아들일까.', choices: [
      { id: 'c2-room-thanks', label: '두 사람에게 감사한다.', reply: '감사합니다. 신세를 반드시 갚겠습니다.', affection: { haru: 2 }, trust: { haru: 1 }, traits: { considerate: 1 } },
      { id: 'c2-room-work', label: '대가를 치르겠다고 말한다.', reply: '그냥 받을 수는 없습니다. 제가 할 수 있는 일이 있다면 시켜주세요.', traits: { justice: 1, brave: 1 }, flags: ['offered_to_repay_room'] },
      { id: 'c2-room-cautious', label: '숙소 규칙을 먼저 확인한다.', reply: '허락해 주신다면 규칙을 지키겠습니다. 주의할 점을 알려주세요.', traits: { cautious: 1 } }
    ] },
    { id: 'c2-haru-leave', mode: 'city', speaker: '하루', text: '저는 남은 임무 보고를 마치고 바로 다른 일정으로 가야 해요. 내일 다시 길드로 오세요.' },
    { id: 'c2-guide-key', mode: 'city', speaker: '안내원', text: '임시 숙소는 공동 사용 구역이에요. 빈 침상을 하나 쓰시면 됩니다. 오늘 밤까지만 허가할게요.' },
    { id: 'c2-room-walk', mode: 'city', narration: true, text: '안내원을 따라 길드 뒤편의 낡은 숙소 건물로 향했다. 화려하지는 않았지만 비바람을 피할 수 있는 곳이었다.' },
    { id: 'c2-room-enter', mode: 'black', narration: true, text: '방 안에는 침상 하나와 작은 창문, 낡은 옷장이 전부였다.' },
    { id: 'c2-alone', mode: 'black', speaker: '주인공', text: '하룻밤뿐이다. 내일은 내가 누구인지, 여기서 무엇을 해야 하는지 알아내야 한다.' },
    { id: 'c2-sleep', mode: 'black', narration: true, text: '몸을 눕히자 하루 동안 억지로 붙잡고 있던 긴장이 풀렸다. 의식은 금세 깊은 어둠 속으로 가라앉았다.' },
    { id: 'c2-clear', mode: 'black', center: 'CHAPTER 2 CLEAR' },
    { id: 'c2-end', mode: 'black', ending: true, center: '기억을 되찾을 때까지 사용할 이름과, 단 하룻밤의 거처를 얻었다.' }
  ]
};