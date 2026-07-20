const app = document.querySelector('#app');

const scenes = [
  { id: 'prologue-title', mode: 'black', center: 'CHAPTER 1\n\n낯선 세계' },
  { id: 'heartbeat-1', mode: 'black', center: '……' },
  { id: 'heartbeat-2', mode: 'black', center: '쿵……\n\n쿵……' },
  { id: 'wake-1', mode: 'black', speaker: '주인공', text: '……여긴…… 어디지?' },
  { id: 'wake-2', mode: 'black', speaker: '주인공', text: '머리가 깨질 듯 아프다. 눈을 뜨려고 해도 몸이 뜻대로 움직이지 않는다.' },
  { id: 'wake-3', mode: 'black', speaker: '주인공', text: '무언가를 떠올리려 했지만, 손에 잡히는 기억은 하나도 없었다.' },
  { id: 'wake-4', mode: 'black', speaker: '주인공', text: '내 이름도. 내가 누구였는지도. 왜 이곳에 있는지도.' },
  { id: 'rustle-1', mode: 'black', center: '바스락……\n\n바스락……' },
  { id: 'haru-call-1', mode: 'black', speaker: '???', text: '거기 계세요?!' },
  { id: 'haru-call-2', mode: 'black', speaker: '???', text: '괜찮으세요? 제 목소리 들리세요?' },
  { id: 'forest-open', mode: 'forest', narration: true, text: '천천히 눈을 뜨자, 낯선 숲과 그 사이로 스며드는 희미한 빛이 시야에 들어왔다.' },
  { id: 'haru-first', mode: 'forest', speaker: '???', text: '다행이다…… 정신을 차리셨네요.' },
  { id: 'observe-haru', mode: 'forest', narration: true, text: '소녀는 안도하면서도 경계를 늦추지 않았다. 손에는 언제든 꺼내 들 수 있도록 활이 들려 있었다.' },
  { id: 'mc-question', mode: 'forest', speaker: '주인공', text: '……죄송한데, 혹시 여기가 어디인지 알 수 있을까요?' },
  { id: 'haru-confused', mode: 'forest', speaker: '???', text: '……네?' },
  { id: 'choice-first-response', mode: 'forest', speaker: '주인공', text: '무슨 말을 먼저 해야 할까.', choices: [
    { label: '여기가 어디인지 다시 묻는다.', reply: '정말 모르겠습니다. 여기가 어디인지부터 알려주실 수 있을까요?' },
    { label: '자신이 누구인지 묻는다.', reply: '혹시…… 저를 아시나요? 제 이름조차 기억나지 않습니다.' },
    { label: '주변의 위험부터 확인한다.', reply: '아까부터 숲이 이상하게 조용합니다. 여기, 안전한 곳인가요?' }
  ] },
  { id: 'haru-memory-check', mode: 'forest', speaker: '???', text: '잠시만요. 정말…… 아무것도 기억나지 않으세요?' },
  { id: 'mc-memory', mode: 'forest', speaker: '주인공', text: '네. 제 이름도, 제가 어디에서 왔는지도 모르겠습니다.' },
  { id: 'haru-intro', mode: 'forest', speaker: '하루', text: '저는 하루예요. 자세한 이야기는 이동하면서 해요. 이 숲은 오래 머물 곳이 아니에요.' },
  { id: 'mc-name', mode: 'forest', speaker: '주인공', text: '하루 씨…… 알겠습니다.' },
  { id: 'walk-start', mode: 'forest', narration: true, text: '하루는 주변을 살핀 뒤 먼저 걸음을 옮겼다. 나는 아직 힘이 제대로 들어가지 않는 다리를 억지로 움직여 그 뒤를 따랐다.' },
  { id: 'forest-silence', mode: 'forest-deep', narration: true, text: '숲은 이상할 만큼 고요했다. 바람은 불고 있었지만 새소리도, 벌레 소리도 들리지 않았다.' },
  { id: 'mc-world-question', mode: 'forest-deep', speaker: '주인공', text: '하루 씨. 여기는…… 어떤 곳인가요?' },
  { id: 'haru-world-1', mode: 'forest-deep', speaker: '하루', text: '중앙도시 외곽에 있는 몽환 숲이에요. 보통 사람이라면 혼자 들어올 이유가 없는 곳이죠.' },
  { id: 'mc-central-city', mode: 'forest-deep', speaker: '주인공', text: '중앙도시…….' },
  { id: 'haru-notice', mode: 'forest-deep', speaker: '하루', text: '그 이름에도 반응이 없으시네요. 기억상실이라는 말이 거짓말은 아닌 것 같고…….' },
  { id: 'choice-trust', mode: 'forest-deep', speaker: '하루', text: '그래도 한 가지는 확인해야 해요. 저를 따라오실 수 있겠어요?', choices: [
    { label: '하루를 믿고 따라간다.', reply: '지금은 하루 씨를 믿겠습니다.' },
    { label: '도시에 관해 더 묻는다.', reply: '따라가겠습니다. 다만 중앙도시가 어떤 곳인지 조금만 더 설명해 주세요.' },
    { label: '자신을 경계하는 이유를 묻는다.', reply: '저를 경계하시는 것 같은데…… 이유를 물어봐도 될까요?' }
  ] },
  { id: 'haru-trust-response', mode: 'forest-deep', speaker: '하루', text: '좋아요. 대신 제 곁에서 너무 멀어지지는 마세요.' },
  { id: 'trail', mode: 'forest-deep', narration: true, text: '우리는 나무 사이로 희미하게 이어진 길을 따라 걸었다. 하루는 몇 걸음마다 멈춰 흔적을 살폈다.' },
  { id: 'black-trace', mode: 'forest-deep', narration: true, text: '얼마 지나지 않아 땅 위에 검게 그을린 듯한 자국이 보였다. 그 주변의 풀은 말라붙어 있었다.' },
  { id: 'mc-trace', mode: 'forest-deep', speaker: '주인공', text: '이건…… 불에 탄 흔적인가요?' },
  { id: 'haru-nightmare-1', mode: 'forest-deep', speaker: '하루', text: '아니요. 악몽이 지나간 흔적이에요.' },
  { id: 'mc-nightmare', mode: 'forest-deep', speaker: '주인공', text: '악몽이…… 지나갔다고요?' },
  { id: 'haru-nightmare-2', mode: 'forest-deep', speaker: '하루', text: '설명하기 쉽지는 않지만, 살아 있는 재앙이라고 생각하시면 돼요. 사람의 정신을 먹고 자라요.' },
  { id: 'mc-strange', mode: 'forest-deep', narration: true, text: '그 말은 현실감이 없었다. 그런데도 하루의 표정에는 농담이라고 넘길 여지가 없었다.' },
  { id: 'sound-stop', mode: 'danger', center: '……딱.' },
  { id: 'haru-stop', mode: 'danger', speaker: '하루', text: '멈추세요.' },
  { id: 'danger-sense', mode: 'danger', narration: true, text: '하루의 목소리가 낮아졌다. 조금 전까지 느껴지던 바람마저 끊긴 듯했다.' },
  { id: 'nightmare-growl', mode: 'danger', center: '그르르르……' },
  { id: 'nightmare-appear', mode: 'danger', narration: true, text: '나무 뒤편의 어둠이 부풀어 오르더니, 형태를 알아보기 힘든 검은 생명체가 길을 막아섰다.' },
  { id: 'haru-behind', mode: 'danger', speaker: '하루', text: '제 뒤로 가세요. 절대 가까이 오지 마세요.' },
  { id: 'mc-freeze', mode: 'danger', narration: true, text: '도망쳐야 한다고 생각했지만 몸이 굳어 움직이지 않았다. 검은 형체 안에서 수십 개의 시선이 나를 바라보는 기분이 들었다.' },
  { id: 'choice-danger', mode: 'danger', speaker: '주인공', text: '지금 내가 할 수 있는 일은…….', choices: [
    { label: '하루의 지시에 따라 뒤로 물러난다.', reply: '알겠습니다. 방해되지 않도록 물러나겠습니다.' },
    { label: '주변에서 무기가 될 만한 것을 찾는다.', reply: '저도 뭔가 도울 방법을 찾아보겠습니다.' },
    { label: '하루에게 위험을 알린다.', reply: '하루 씨, 오른쪽에서도 무언가 움직이고 있습니다!' }
  ] },
  { id: 'battle-start', mode: 'battle', center: '악몽과의 첫 조우' },
  { id: 'haru-shot-1', mode: 'battle', narration: true, text: '하루가 활시위를 당겼다. 빛으로 이루어진 화살이 어둠을 가르며 날아갔다.' },
  { id: 'impact-1', mode: 'battle', center: '쾅—!' },
  { id: 'nightmare-hit', mode: 'battle', narration: true, text: '화살이 악몽의 몸을 꿰뚫었다. 검은 안개가 사방으로 흩어졌지만, 그것은 쓰러지지 않았다.' },
  { id: 'haru-surprised', mode: 'battle', speaker: '하루', text: '한 마리가 아니었어…….' },
  { id: 'second-nightmare', mode: 'battle', narration: true, text: '등 뒤에서 차가운 기운이 밀려왔다. 고개를 돌리자 또 다른 악몽이 바로 앞까지 다가와 있었다.' },
  { id: 'mc-instinct', mode: 'battle', narration: true, text: '생각할 틈은 없었다. 몸이 먼저 움직였다.' },
  { id: 'mc-attack', mode: 'battle', narration: true, text: '나는 바닥의 굵은 나뭇가지를 움켜쥐고 악몽을 향해 힘껏 휘둘렀다.' },
  { id: 'branch-break', mode: 'battle', center: '퍽—!' },
  { id: 'branch-fail', mode: 'battle', narration: true, text: '나뭇가지는 힘없이 부러졌다. 하지만 악몽의 시선이 잠시 내게 향했다.' },
  { id: 'haru-save', mode: 'battle', speaker: '하루', text: '고개 숙이세요!' },
  { id: 'haru-shot-2', mode: 'battle', narration: true, text: '빛의 화살이 머리 위를 스쳐 지나가 악몽을 꿰뚫었다.' },
  { id: 'battle-end', mode: 'battle', center: '…….' },
  { id: 'after-battle', mode: 'after-battle', narration: true, text: '검은 형체가 무너지며 작은 결정 하나를 남겼다. 붉고 검은 빛이 내부에서 천천히 맴돌고 있었다.' },
  { id: 'haru-breath', mode: 'after-battle', speaker: '하루', text: '다친 곳은 없으세요?' },
  { id: 'mc-ok', mode: 'after-battle', speaker: '주인공', text: '네…… 괜찮습니다. 하루 씨는요?' },
  { id: 'haru-scold', mode: 'after-battle', speaker: '하루', text: '저는 괜찮아요. 하지만 방금 행동은 너무 위험했어요. 무기도 없이 악몽에게 달려들다니…….' },
  { id: 'choice-after-battle', mode: 'after-battle', speaker: '주인공', text: '하루의 말에 뭐라고 답해야 할까.', choices: [
    { label: '도움을 주고 싶었다고 말한다.', reply: '하루 씨 혼자 싸우게 두고 싶지 않았습니다.' },
    { label: '몸이 먼저 움직였다고 솔직히 말한다.', reply: '저도 모르겠습니다. 생각하기 전에 몸이 먼저 움직였습니다.' },
    { label: '걱정시켜 미안하다고 사과한다.', reply: '죄송합니다. 다음부터는 지시를 따르겠습니다.' }
  ] },
  { id: 'haru-soften', mode: 'after-battle', speaker: '하루', text: '……무사해서 다행이에요. 다음부터는 정말 조심하세요.' },
  { id: 'essence-question', mode: 'after-battle', speaker: '주인공', text: '그런데 저 결정은 뭔가요?' },
  { id: 'essence-explain', mode: 'after-battle', speaker: '하루', text: '악몽 정수예요. 악몽이 사라질 때 남기는 정신 에너지의 결정이죠.' },
  { id: 'essence-use', mode: 'after-battle', speaker: '하루', text: '도시에서는 중요한 자원으로 취급해요. 장비를 만들거나, 시설을 유지하는 데 쓰이기도 하고요.' },
  { id: 'world-doubt', mode: 'after-battle', speaker: '주인공', text: '정신 에너지…… 악몽…… 듣는 것마다 제가 알던 세상과는 너무 다릅니다.' },
  { id: 'haru-question-origin', mode: 'after-battle', speaker: '하루', text: '그렇다면 당신이 기억하던 세상은 어떤 곳이었나요?' },
  { id: 'mc-blank', mode: 'after-battle', speaker: '주인공', text: '……모르겠습니다. 다르다는 느낌만 들 뿐, 떠오르는 건 없습니다.' },
  { id: 'haru-pause', mode: 'after-battle', narration: true, text: '하루는 잠시 나를 바라보다가 더 묻지 않았다.' },
  { id: 'move-again', mode: 'forest-exit', speaker: '하루', text: '우선 도시로 가요. 길드에 가면 기억상실이나 신원 확인에 도움을 받을 수 있을 거예요.' },
  { id: 'mc-guild', mode: 'forest-exit', speaker: '주인공', text: '길드요?' },
  { id: 'haru-guild', mode: 'forest-exit', speaker: '하루', text: '악몽을 상대하고 도시를 지키는 사람들이 모인 곳이에요. 저도 그곳 소속이고요.' },
  { id: 'walk-light', mode: 'forest-exit', narration: true, text: '다시 걷기 시작한 뒤로 숲의 어둠은 조금씩 옅어졌다. 나무 사이로 따뜻한 빛이 길게 번졌다.' },
  { id: 'choice-personal', mode: 'forest-exit', speaker: '주인공', text: '도시에 도착하기 전, 하루에게 무엇을 물어볼까.', choices: [
    { label: '왜 혼자 숲에 왔는지 묻는다.', reply: '하루 씨는 왜 혼자 이런 위험한 숲에 오신 건가요?' },
    { label: '악몽과 싸우는 이유를 묻는다.', reply: '하루 씨는 언제부터 악몽과 싸우신 건가요?' },
    { label: '자신을 도와준 이유를 묻는다.', reply: '모르는 사람인 저를 왜 도와주신 건가요?' }
  ] },
  { id: 'haru-personal-answer', mode: 'forest-exit', speaker: '하루', text: '그냥 지나칠 수 없었어요. 눈앞에서 누군가 위험에 처했는데 모른 척하는 건…… 제 성격에 맞지 않거든요.' },
  { id: 'mc-thanks', mode: 'forest-exit', speaker: '주인공', text: '그렇군요. 다시 한번 감사합니다.' },
  { id: 'haru-small', mode: 'forest-exit', speaker: '하루', text: '감사는 도시까지 무사히 도착한 뒤에 받을게요.' },
  { id: 'gate-view', mode: 'city-gate', narration: true, text: '마침내 숲이 끝났다. 언덕 아래로 거대한 성벽과 그 안에 빽빽하게 들어선 건물들이 보였다.' },
  { id: 'city-first', mode: 'city-gate', narration: true, text: '낯선 도시였다. 그런데 이상하게도 처음 보는 풍경 속에서 설명하기 어려운 그리움이 스쳤다.' },
  { id: 'mc-city', mode: 'city-gate', speaker: '주인공', text: '저기가…… 중앙도시인가요?' },
  { id: 'haru-city', mode: 'city-gate', speaker: '하루', text: '네. 지금 이 세계에서 가장 많은 사람이 모여 사는 곳이에요.' },
  { id: 'gate-guard', mode: 'city-gate', speaker: '경비병', text: '하루 씨? 외곽 순찰은 끝난 겁니까? 옆에 있는 사람은…….' },
  { id: 'haru-report', mode: 'city-gate', speaker: '하루', text: '숲에서 발견했어요. 기억을 전부 잃은 상태예요. 길드로 데려가서 확인받겠습니다.' },
  { id: 'guard-warning', mode: 'city-gate', speaker: '경비병', text: '알겠습니다. 최근 외곽 상황이 좋지 않으니 바로 이동하십시오.' },
  { id: 'city-enter', mode: 'city', narration: true, text: '성문을 지나자 수많은 사람의 목소리와 발걸음이 한꺼번에 밀려왔다.' },
  { id: 'city-detail', mode: 'city', narration: true, text: '상점의 간판, 길을 오가는 차량, 멀리 솟은 탑. 분명 처음 보는 곳인데 몇몇 풍경은 묘하게 익숙했다.' },
  { id: 'mc-overwhelm', mode: 'city', speaker: '주인공', text: '사람이…… 정말 많네요.' },
  { id: 'haru-relief', mode: 'city', speaker: '하루', text: '이제 조금 안심하셔도 돼요. 적어도 성벽 안에서는 숲보다 안전하니까요.' },
  { id: 'guild-view', mode: 'guild-front', narration: true, text: '우리는 도시 중심부의 커다란 건물 앞에 멈췄다. 입구 위에는 검과 날개가 겹쳐진 길드 문장이 걸려 있었다.' },
  { id: 'haru-arrive', mode: 'guild-front', speaker: '하루', text: '도착했어요. 여기서부터는 길드가 도와줄 거예요.' },
  { id: 'mc-fear', mode: 'guild-front', narration: true, text: '문 너머에 무엇이 기다리고 있을지는 알 수 없었다. 잃어버린 기억을 찾을 실마리가 있을지도, 더 큰 혼란이 시작될지도 몰랐다.' },
  { id: 'choice-end', mode: 'guild-front', speaker: '하루', text: '들어갈 준비가 되셨나요?', choices: [
    { label: '고개를 끄덕이고 들어간다.', reply: '네. 가겠습니다.' },
    { label: '하루에게 함께 있어 달라고 부탁한다.', reply: '가능하다면…… 안에서도 잠시 함께 있어 주시겠습니까?' },
    { label: '마지막으로 도시를 돌아본다.', reply: '잠시만요. 이 풍경을 조금만 더 보고 싶습니다.' }
  ] },
  { id: 'haru-final', mode: 'guild-front', speaker: '하루', text: '괜찮아요. 혼자 두지 않을게요.' },
  { id: 'door-open', mode: 'black', center: '길드의 문이 열렸다.' },
  { id: 'chapter-end-1', mode: 'black', center: 'CHAPTER 1 CLEAR' },
  { id: 'chapter-end-2', mode: 'black', center: '낯선 세계에서의 첫날이 시작되었다.' },
  { id: 'chapter-end-menu', mode: 'black', ending: true, center: 'CHAPTER 1\n\n낯선 세계\n\n완료' }
];

const SAVE_KEY = 'mongyeong-vn-chapter1';
let index = 0;
let started = false;
let locked = false;
let typing = false;
let typeTimer = null;
let fullText = '';

app.innerHTML = `
  <main class="vn-shell blackout" aria-label="夢境 비주얼 노벨">
    <div class="vn-bg" aria-hidden="true"></div>
    <div class="vn-vignette" aria-hidden="true"></div>

    <header class="vn-topbar">
      <span class="vn-title-mark">夢境 : 잠든 세계</span>
      <span class="vn-version">VN 1.0</span>
    </header>

    <div class="vn-controls">
      <button class="vn-btn" id="restart" type="button">처음부터</button>
    </div>

    <section class="vn-center-text vn-hidden" id="centerText" aria-live="polite"></section>
    <section class="vn-choices vn-hidden" id="choices" aria-label="선택지"></section>

    <section class="vn-dialogue vn-hidden" id="dialogue" aria-live="polite">
      <div class="vn-name" id="speaker"></div>
      <div class="vn-text" id="text"></div>
      <div class="vn-next">▼</div>
    </section>

    <section class="vn-start" id="startScreen">
      <h1>夢境</h1>
      <p>잠든 세계</p>
      <div class="vn-start-actions">
        <button id="startButton" type="button">새로 시작</button>
        <button id="continueButton" class="vn-hidden" type="button">이어하기</button>
      </div>
    </section>
  </main>
`;

const shell = document.querySelector('.vn-shell');
const dialogue = document.querySelector('#dialogue');
const speaker = document.querySelector('#speaker');
const text = document.querySelector('#text');
const centerText = document.querySelector('#centerText');
const choices = document.querySelector('#choices');
const startScreen = document.querySelector('#startScreen');
const continueButton = document.querySelector('#continueButton');

function applyMode(mode) {
  shell.dataset.mode = mode;
  shell.classList.toggle('blackout', mode === 'black');
}

function stopTyping(showAll = false) {
  if (typeTimer) clearInterval(typeTimer);
  typeTimer = null;
  if (showAll) text.textContent = fullText;
  typing = false;
}

function typeDialogue(value) {
  stopTyping();
  fullText = value || '';
  text.textContent = '';
  if (!fullText) return;
  typing = true;
  let cursor = 0;
  typeTimer = setInterval(() => {
    cursor += 1;
    text.textContent = fullText.slice(0, cursor);
    if (cursor >= fullText.length) stopTyping(true);
  }, 22);
}

function saveProgress() {
  if (!started) return;
  localStorage.setItem(SAVE_KEY, JSON.stringify({ index, savedAt: Date.now() }));
  continueButton.classList.remove('vn-hidden');
}

function renderScene() {
  const scene = scenes[index];
  if (!scene) return;

  applyMode(scene.mode || 'black');
  centerText.classList.toggle('vn-hidden', !scene.center);
  centerText.innerHTML = scene.center ? scene.center.replaceAll('\n', '<br>') : '';

  const hasDialogue = Boolean(scene.text || scene.speaker || scene.narration);
  dialogue.classList.toggle('vn-hidden', !hasDialogue);
  speaker.textContent = scene.narration ? '' : (scene.speaker || '');
  dialogue.classList.toggle('narration', Boolean(scene.narration));
  typeDialogue(scene.text || '');

  choices.innerHTML = '';
  choices.classList.add('vn-hidden');
  locked = false;

  if (scene.choices) {
    locked = true;
    choices.classList.remove('vn-hidden');
    scene.choices.forEach((choice) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'vn-choice';
      button.textContent = choice.label;
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        stopTyping(true);
        locked = false;
        const nextScene = scenes[index + 1];
        if (nextScene && choice.reply) {
          scenes.splice(index + 1, 0, {
            id: `choice-reply-${Date.now()}`,
            mode: scene.mode,
            speaker: '주인공',
            text: choice.reply,
            temporary: true
          });
        }
        index += 1;
        renderScene();
        saveProgress();
      });
      choices.appendChild(button);
    });
  }

  saveProgress();
}

function advance() {
  if (!started || locked) return;
  if (typing) {
    stopTyping(true);
    return;
  }
  if (index < scenes.length - 1) {
    if (scenes[index]?.temporary) scenes.splice(index, 1);
    else index += 1;
    renderScene();
  }
}

function startGame(fromSave = false) {
  started = true;
  locked = false;
  if (fromSave) {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    index = Number.isInteger(saved.index) ? Math.min(saved.index, scenes.length - 1) : 0;
  } else {
    index = 0;
    localStorage.removeItem(SAVE_KEY);
  }
  startScreen.classList.add('vn-hidden');
  renderScene();
}

function restartGame(event) {
  event.stopPropagation();
  stopTyping();
  localStorage.removeItem(SAVE_KEY);
  started = false;
  locked = false;
  index = 0;
  startScreen.classList.remove('vn-hidden');
  continueButton.classList.add('vn-hidden');
  choices.classList.add('vn-hidden');
  dialogue.classList.add('vn-hidden');
  centerText.classList.add('vn-hidden');
  applyMode('black');
}

if (localStorage.getItem(SAVE_KEY)) continueButton.classList.remove('vn-hidden');

document.querySelector('#startButton').addEventListener('click', (event) => {
  event.stopPropagation();
  startGame(false);
});
continueButton.addEventListener('click', (event) => {
  event.stopPropagation();
  startGame(true);
});
document.querySelector('#restart').addEventListener('click', restartGame);
shell.addEventListener('click', advance);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') advance();
});
