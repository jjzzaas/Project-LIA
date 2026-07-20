const app = document.querySelector('#app');

const scenes = [
  { mode: 'black', center: '……' },
  { mode: 'black', center: '쿵……\n\n쿵……' },
  { mode: 'black', speaker: '주인공', text: '……여긴…… 어디지?' },
  { mode: 'black', speaker: '주인공', text: '머리가 깨질 듯 아프다. 뭔가를 떠올리려 해도 아무것도 잡히지 않는다.' },
  { mode: 'black', speaker: '주인공', text: '내 이름도. 왜 이곳에 있는지도.' },
  { mode: 'black', center: '바스락……\n\n바스락……' },
  { mode: 'black', speaker: '???', text: '거기 계세요?!' },
  { mode: 'black', speaker: '???', text: '괜찮으세요?' },
  { mode: 'forest', speaker: '주인공', text: '천천히 눈을 뜨자, 낯선 숲과 한 소녀의 모습이 시야에 들어왔다.' },
  { mode: 'forest', speaker: '???', text: '다행이다…… 정신을 차리셨네요.' },
  { mode: 'forest', speaker: '주인공', text: '……죄송한데, 혹시 여기가 어디인지 알 수 있을까요?' },
  { mode: 'forest', speaker: '???', text: '……네?', choices: ['주변을 천천히 둘러본다.', '소녀에게 다시 묻는다.', '아무 말 없이 기억을 더듬는다.'] },
  { mode: 'forest', speaker: '???', text: '잠시만요. 정말…… 아무것도 기억나지 않으세요?' },
  { mode: 'forest', speaker: '주인공', text: '네. 제 이름조차도요.' },
  { mode: 'forest', speaker: '하루', text: '저는 하루예요. 우선 여기서 벗어나요. 이 숲은 오래 머물 곳이 아니에요.' },
  { mode: 'forest', speaker: '주인공', text: '하루 씨…… 알겠습니다.' },
  { mode: 'forest', center: 'CHAPTER 1\n\n낯선 세계' }
];

let index = 0;
let started = false;
let locked = false;
let selectedChoice = '';

app.innerHTML = `
  <main class="vn-shell blackout" aria-label="夢境 비주얼 노벨">
    <div class="vn-bg" aria-hidden="true"></div>

    <header class="vn-topbar">
      <span class="vn-title-mark">夢境 : 잠든 세계</span>
      <span class="vn-version">VN 0.1</span>
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
      <button id="startButton" type="button">새로 시작</button>
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

function renderScene() {
  const scene = scenes[index];
  if (!scene) return;

  shell.classList.toggle('blackout', scene.mode === 'black');

  centerText.classList.toggle('vn-hidden', !scene.center);
  centerText.innerHTML = scene.center ? scene.center.replaceAll('\n', '<br>') : '';

  const hasDialogue = Boolean(scene.text || scene.speaker);
  dialogue.classList.toggle('vn-hidden', !hasDialogue);
  speaker.textContent = scene.speaker || '';
  text.textContent = scene.text || '';

  choices.innerHTML = '';
  choices.classList.add('vn-hidden');

  if (scene.choices) {
    locked = true;
    choices.classList.remove('vn-hidden');
    scene.choices.forEach((label) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'vn-choice';
      button.textContent = label;
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        selectedChoice = label;
        locked = false;
        index += 1;
        renderScene();
      });
      choices.appendChild(button);
    });
  }
}

function advance() {
  if (!started || locked) return;
  if (index < scenes.length - 1) {
    index += 1;
    renderScene();
  }
}

function startGame() {
  started = true;
  index = 0;
  selectedChoice = '';
  startScreen.classList.add('vn-hidden');
  renderScene();
}

function restartGame(event) {
  event.stopPropagation();
  started = false;
  locked = false;
  index = 0;
  startScreen.classList.remove('vn-hidden');
  choices.classList.add('vn-hidden');
  dialogue.classList.add('vn-hidden');
  centerText.classList.add('vn-hidden');
  shell.classList.add('blackout');
}

document.querySelector('#startButton').addEventListener('click', (event) => {
  event.stopPropagation();
  startGame();
});

document.querySelector('#restart').addEventListener('click', restartGame);
shell.addEventListener('click', advance);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') advance();
});