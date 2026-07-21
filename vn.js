import { chapter001 } from './src/chapters/001-010/chapter-001.js';
import { createInitialGameState, recordChoice } from './src/config/game-state.js';
import { createDeveloperTapDetector, getDeveloperSnapshot } from './src/config/developer-mode.js';
import { createDeveloperPanel, openDeveloperPanel } from './src/ui/developer-panel.js';

const app = document.querySelector('#app');
const scenes = chapter001.scenes.map((scene) => ({ ...scene }));
const SAVE_KEY = 'mongyeong-vn-chapter1';

let index = 0;
let started = false;
let locked = false;
let typing = false;
let typeTimer = null;
let fullText = '';
let gameState = createInitialGameState();

app.innerHTML = `
  <main class="vn-shell blackout" aria-label="夢境 비주얼 노벨">
    <div class="vn-bg" aria-hidden="true"></div>
    <div class="vn-vignette" aria-hidden="true"></div>

    <header class="vn-topbar">
      <span class="vn-title-mark">夢境 : 잠든 세계</span>
      <button class="vn-version" id="versionButton" type="button" aria-label="버전 정보">VN 1.1</button>
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
const versionButton = document.querySelector('#versionButton');

const developerPanel = createDeveloperPanel();
shell.appendChild(developerPanel);

const detectDeveloperTap = createDeveloperTapDetector({
  onUnlock: () => openDeveloperPanel(developerPanel, getDeveloperSnapshot(gameState)),
});

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
  localStorage.setItem(SAVE_KEY, JSON.stringify({
    index,
    gameState,
    savedAt: Date.now(),
  }));
  continueButton.classList.remove('vn-hidden');
}

function renderScene() {
  const scene = scenes[index];
  if (!scene) return;

  gameState.currentChapter = chapter001.id;
  gameState.currentScene = scene.id;

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

        gameState.currentScene = scene.id;
        gameState = recordChoice(gameState, choice);

        const nextScene = scenes[index + 1];
        if (nextScene && choice.reply) {
          scenes.splice(index + 1, 0, {
            id: `choice-reply-${scene.id}`,
            mode: scene.mode,
            speaker: '주인공',
            text: choice.reply,
            temporary: true,
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
  if (!started || locked || !developerPanel.hidden) return;

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
    gameState = saved.gameState || createInitialGameState();
  } else {
    index = 0;
    gameState = createInitialGameState();
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
  gameState = createInitialGameState();
  developerPanel.hidden = true;
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
versionButton.addEventListener('click', (event) => {
  event.stopPropagation();
  detectDeveloperTap();
});
shell.addEventListener('click', advance);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') advance();
});
