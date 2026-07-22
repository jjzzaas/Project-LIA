import { chapter001 } from './src/chapters/001-010/chapter-001.js';
import { chapter002 } from './src/chapters/001-010/chapter-002.js';
import { chapter003 } from './src/chapters/001-010/chapter-003.js';
import { chapter004 } from './src/chapters/001-010/chapter-004.js';
import { chapter005 } from './src/chapters/001-010/chapter-005.js';
import { chapter006 } from './src/chapters/001-010/chapter-006.js';
import { createInitialGameState, recordChoice } from './src/config/game-state.js';
import { createDeveloperTapDetector, getDeveloperSnapshot } from './src/config/developer-mode.js';
import { createDeveloperPanel, openDeveloperPanel } from './src/ui/developer-panel.js';

const app = document.querySelector('#app');
const chapters = [chapter001, chapter002, chapter003, chapter004, chapter005, chapter006];
const SAVE_KEY = 'mongyeong-vn-save-v2';
const NORMAL_INPUT_GUARD_MS = 280;
const CHOICE_INPUT_GUARD_MS = 550;
const IMPORTANT_INPUT_GUARD_MS = 650;

let chapterIndex = 0;
let scenes = chapters[chapterIndex].scenes.map((scene) => ({ ...scene }));
let index = 0;
let started = false;
let locked = false;
let typing = false;
let typeTimer = null;
let fullText = '';
let gameState = createInitialGameState();
let inputBlockedUntil = 0;
let dialogueLog = [];
let loggedSceneKeys = new Set();

app.innerHTML = `
  <main class="vn-shell blackout" aria-label="夢境 비주얼 노벨">
    <div class="vn-bg" aria-hidden="true"></div>
    <div class="vn-vignette" aria-hidden="true"></div>

    <header class="vn-topbar">
      <span class="vn-title-mark">夢境 : 잠든 세계</span>
      <button class="vn-version" id="versionButton" type="button" aria-label="버전 정보">VN 1.4</button>
    </header>

    <div class="vn-controls">
      <button class="vn-btn" id="logButton" type="button" aria-label="대화 기록 열기">로그</button>
      <button class="vn-btn" id="restart" type="button">처음부터</button>
    </div>

    <section class="vn-center-text vn-hidden" id="centerText" aria-live="polite"></section>
    <section class="vn-choices vn-hidden" id="choices" aria-label="선택지"></section>

    <section class="vn-dialogue vn-hidden" id="dialogue" aria-live="polite">
      <div class="vn-name" id="speaker"></div>
      <div class="vn-text" id="text"></div>
      <div class="vn-next">▼</div>
    </section>

    <section class="vn-log vn-hidden" id="dialogueLog" aria-label="대화 기록" aria-modal="true" role="dialog">
      <div class="vn-log__panel">
        <header class="vn-log__header">
          <div>
            <span>STORY LOG</span>
            <h2>대화 기록</h2>
          </div>
          <button id="closeLogButton" type="button" aria-label="대화 기록 닫기">닫기</button>
        </header>
        <div class="vn-log__content" id="dialogueLogContent"></div>
      </div>
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
const logButton = document.querySelector('#logButton');
const dialogueLogPanel = document.querySelector('#dialogueLog');
const dialogueLogContent = document.querySelector('#dialogueLogContent');
const closeLogButton = document.querySelector('#closeLogButton');

const developerPanel = createDeveloperPanel();
shell.appendChild(developerPanel);

const detectDeveloperTap = createDeveloperTapDetector({
  onUnlock: () => openDeveloperPanel(developerPanel, getDeveloperSnapshot(gameState)),
});

function getCurrentChapter() {
  return chapters[chapterIndex];
}

function blockInput(duration = NORMAL_INPUT_GUARD_MS) {
  inputBlockedUntil = Math.max(inputBlockedUntil, performance.now() + duration);
  shell.classList.add('vn-input-guarded');
  window.setTimeout(() => {
    if (performance.now() >= inputBlockedUntil) shell.classList.remove('vn-input-guarded');
  }, duration + 20);
}

function isInputBlocked() {
  return performance.now() < inputBlockedUntil;
}

function loadChapter(nextChapterIndex, nextSceneIndex = 0) {
  chapterIndex = Math.max(0, Math.min(nextChapterIndex, chapters.length - 1));
  scenes = getCurrentChapter().scenes.map((scene) => ({ ...scene }));
  index = Math.max(0, Math.min(nextSceneIndex, scenes.length - 1));
  locked = false;
  stopTyping();
  blockInput(IMPORTANT_INPUT_GUARD_MS);
}

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
    chapterIndex,
    index,
    gameState,
    dialogueLog,
    savedAt: Date.now(),
  }));
  continueButton.classList.remove('vn-hidden');
}

function getCenterContent(scene) {
  if (scene.id === 'c1-clear') {
    return `
      <div class="chapter-clear-card">
        <span class="chapter-clear-card__eyebrow">MISSION COMPLETE</span>
        <strong>CHAPTER 1 CLEAR</strong>
        <span class="chapter-clear-card__title">낯선 세계</span>
        <small>화면을 터치해 계속</small>
      </div>
    `;
  }

  if (scene.id === 'c1-end') {
    return `
      <div class="status-window">
        <div class="status-window__scan" aria-hidden="true"></div>
        <span class="status-window__label">STATUS UPDATE</span>
        <h2>레벨 상승</h2>
        <div class="status-window__level">
          <span>Lv. 1</span><b>→</b><strong>Lv. 2</strong>
        </div>
        <div class="status-window__line"></div>
        <p>챕터 1 클리어 보상이 적용되었습니다.</p>
        <small>화면을 터치해 계속</small>
      </div>
    `;
  }

  return scene.center ? scene.center.replaceAll('\n', '<br>') : '';
}

function getSceneLogKey(scene) {
  return `${getCurrentChapter().id}:${scene.id}:${index}`;
}

function recordSceneInLog(scene) {
  const value = scene.text || scene.center || '';
  if (!value) return;

  const key = getSceneLogKey(scene);
  if (loggedSceneKeys.has(key)) return;
  loggedSceneKeys.add(key);

  dialogueLog.push({
    chapter: getCurrentChapter().id,
    sceneId: scene.id,
    speaker: scene.narration ? '내레이션' : (scene.speaker || (scene.center ? '시스템' : '')),
    text: value,
  });

  if (dialogueLog.length > 250) dialogueLog = dialogueLog.slice(-250);
}

function renderDialogueLog() {
  if (!dialogueLog.length) {
    dialogueLogContent.innerHTML = '<p class="vn-log__empty">아직 기록된 대사가 없습니다.</p>';
    return;
  }

  dialogueLogContent.innerHTML = dialogueLog.map((entry) => `
    <article class="vn-log__entry">
      <span>${entry.speaker || '기록'}</span>
      <p>${escapeHtml(entry.text).replaceAll('\n', '<br>')}</p>
    </article>
  `).join('');

  dialogueLogContent.scrollTop = dialogueLogContent.scrollHeight;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function openDialogueLog(event) {
  event?.stopPropagation();
  if (!started) return;
  stopTyping(true);
  renderDialogueLog();
  dialogueLogPanel.classList.remove('vn-hidden');
  blockInput(350);
}

function closeDialogueLog(event) {
  event?.stopPropagation();
  dialogueLogPanel.classList.add('vn-hidden');
  blockInput(350);
}

function isImportantScene(scene) {
  return Boolean(
    scene.important ||
    scene.center ||
    scene.mode === 'status' ||
    /clear|end|level|status|chapter/i.test(scene.id || '')
  );
}

function renderScene() {
  const scene = scenes[index];
  if (!scene) return;

  gameState.currentChapter = getCurrentChapter().id;
  gameState.currentScene = scene.id;

  const isStatusScene = scene.id === 'c1-end';
  applyMode(isStatusScene ? 'status' : (scene.mode || 'black'));
  centerText.classList.toggle('vn-hidden', !scene.center);
  centerText.classList.toggle('vn-center-text--system', scene.id === 'c1-clear' || isStatusScene);
  centerText.innerHTML = getCenterContent(scene);

  const hasDialogue = Boolean(scene.text || scene.speaker || scene.narration);
  dialogue.classList.toggle('vn-hidden', !hasDialogue);
  speaker.textContent = scene.narration ? '' : (scene.speaker || '');
  dialogue.classList.toggle('narration', Boolean(scene.narration));
  typeDialogue(scene.text || '');

  choices.innerHTML = '';
  choices.classList.add('vn-hidden');
  locked = false;

  recordSceneInLog(scene);

  const guardDuration = scene.choices
    ? CHOICE_INPUT_GUARD_MS
    : (isImportantScene(scene) ? IMPORTANT_INPUT_GUARD_MS : NORMAL_INPUT_GUARD_MS);
  blockInput(guardDuration);

  if (scene.choices) {
    locked = true;
    choices.classList.remove('vn-hidden');

    scene.choices.forEach((choice) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'vn-choice';
      button.textContent = choice.label;
      button.disabled = true;

      window.setTimeout(() => {
        button.disabled = false;
      }, CHOICE_INPUT_GUARD_MS);

      button.addEventListener('click', (event) => {
        event.stopPropagation();
        if (button.disabled || isInputBlocked()) return;

        const requiresConfirmation = Boolean(choice.important || scene.importantChoice);
        if (requiresConfirmation && !window.confirm('이 선택은 이후 관계나 이야기에 영향을 줄 수 있습니다.\n정말 선택하시겠습니까?')) {
          blockInput(300);
          return;
        }

        stopTyping(true);
        locked = false;

        gameState.currentScene = scene.id;
        gameState = recordChoice(gameState, choice);
        dialogueLog.push({
          chapter: getCurrentChapter().id,
          sceneId: scene.id,
          speaker: '선택',
          text: choice.label,
        });

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

function advance(event) {
  if (event?.target?.closest('button, .vn-log, .developer-panel')) return;
  if (!started || locked || !developerPanel.hidden || !dialogueLogPanel.classList.contains('vn-hidden')) return;
  if (isInputBlocked()) return;

  if (typing) {
    stopTyping(true);
    blockInput(180);
    return;
  }

  if (index < scenes.length - 1) {
    if (scenes[index]?.temporary) scenes.splice(index, 1);
    else index += 1;
    renderScene();
    return;
  }

  if (chapterIndex < chapters.length - 1) {
    loadChapter(chapterIndex + 1, 0);
    renderScene();
    saveProgress();
  }
}

function rebuildLoggedSceneKeys() {
  loggedSceneKeys = new Set(dialogueLog.map((entry, entryIndex) => `${entry.chapter}:${entry.sceneId}:${entryIndex}`));
}

function startGame(fromSave = false) {
  started = true;
  locked = false;
  dialogueLog = [];
  loggedSceneKeys = new Set();

  if (fromSave) {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    const savedChapter = Number.isInteger(saved.chapterIndex) ? saved.chapterIndex : 0;
    const savedScene = Number.isInteger(saved.index) ? saved.index : 0;
    loadChapter(savedChapter, savedScene);
    gameState = saved.gameState || createInitialGameState();
    dialogueLog = Array.isArray(saved.dialogueLog) ? saved.dialogueLog : [];
    rebuildLoggedSceneKeys();
  } else {
    loadChapter(0, 0);
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
  dialogueLog = [];
  loggedSceneKeys = new Set();
  loadChapter(0, 0);
  gameState = createInitialGameState();
  developerPanel.hidden = true;
  dialogueLogPanel.classList.add('vn-hidden');
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
logButton.addEventListener('click', openDialogueLog);
closeLogButton.addEventListener('click', closeDialogueLog);
dialogueLogPanel.addEventListener('click', (event) => {
  if (event.target === dialogueLogPanel) closeDialogueLog(event);
});
versionButton.addEventListener('click', (event) => {
  event.stopPropagation();
  detectDeveloperTap();
});
shell.addEventListener('click', advance);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !dialogueLogPanel.classList.contains('vn-hidden')) {
    closeDialogueLog(event);
    return;
  }
  if (event.key === 'Enter' || event.key === ' ') advance(event);
});
