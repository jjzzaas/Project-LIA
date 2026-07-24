import { chapter001 } from './src/chapters/001-010/chapter-001.js';
import { chapter002 } from './src/chapters/001-010/chapter-002.js';
import { chapter003 } from './src/chapters/001-010/chapter-003.js';
import { chapter004 } from './src/chapters/001-010/chapter-004.js';
import { chapter005 } from './src/chapters/001-010/chapter-005.js';
import { chapter006 } from './src/chapters/001-010/chapter-006.js';
import { chapter007 } from './src/chapters/001-010/chapter-007.js';
import { chapter008 } from './src/chapters/001-010/chapter-008.js';
import { createInitialGameState, normalizeGameState, recordChoice } from './src/config/game-state.js';
import { createDeveloperTapDetector, getDeveloperSnapshot } from './src/config/developer-mode.js';
import { createDeveloperPanel, openDeveloperPanel } from './src/ui/developer-panel.js';

const app = document.querySelector('#app');
const chapters = [chapter001, chapter002, chapter003, chapter004, chapter005, chapter006, chapter007, chapter008];
const SAVE_KEY = 'mongyeong-vn-save-v2';
const NORMAL_INPUT_GUARD_MS = 280;
const CHOICE_INPUT_GUARD_MS = 550;
const IMPORTANT_INPUT_GUARD_MS = 650;

let chapterIndex = 0;
let scenes = [];
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
let chapterStartSnapshot = null;

app.innerHTML = `
  <main class="vn-shell blackout" aria-label="夢境 비주얼 노벨">
    <div class="vn-bg" aria-hidden="true"></div>
    <div class="vn-vignette" aria-hidden="true"></div>
    <header class="vn-topbar">
      <span class="vn-title-mark">夢境 : 잠든 세계</span>
      <button class="vn-version" id="versionButton" type="button" aria-label="버전 정보">VN 3.2</button>
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
          <div><span>STORY LOG</span><h2>대화 기록</h2></div>
          <button id="closeLogButton" type="button" aria-label="대화 기록 닫기">닫기</button>
        </header>
        <div class="vn-log__content" id="dialogueLogContent"></div>
      </div>
    </section>
    <section class="vn-start" id="startScreen">
      <h1>夢境</h1><p>잠든 세계</p>
      <div class="vn-start-actions">
        <button id="startButton" type="button">새로 시작</button>
        <button id="continueButton" class="vn-hidden" type="button">이어하기</button>
      </div>
    </section>
  </main>`;

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

const clone = (value) => structuredClone(value);
const getCurrentChapter = () => chapters[chapterIndex];

function blockInput(duration = NORMAL_INPUT_GUARD_MS) {
  inputBlockedUntil = Math.max(inputBlockedUntil, performance.now() + duration);
  shell.classList.add('vn-input-guarded');
  window.setTimeout(() => {
    if (performance.now() >= inputBlockedUntil) shell.classList.remove('vn-input-guarded');
  }, duration + 20);
}

const isInputBlocked = () => performance.now() < inputBlockedUntil;

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
  typeTimer = window.setInterval(() => {
    cursor += 1;
    text.textContent = fullText.slice(0, cursor);
    if (cursor >= fullText.length) stopTyping(true);
  }, 22);
}

function loadChapter(nextChapterIndex, nextSceneIndex = 0) {
  chapterIndex = Math.max(0, Math.min(nextChapterIndex, chapters.length - 1));
  scenes = getCurrentChapter().scenes.map(clone);
  index = Math.max(0, Math.min(nextSceneIndex, scenes.length - 1));
  locked = false;
  stopTyping();
  blockInput(IMPORTANT_INPUT_GUARD_MS);
}

function captureChapterStart() {
  chapterStartSnapshot = { chapterIndex, gameState: clone(gameState), dialogueLogLength: dialogueLog.length };
}

function applyMode(mode) {
  shell.dataset.mode = mode;
  shell.classList.toggle('blackout', mode === 'black');
}

function saveProgress() {
  if (!started) return;
  localStorage.setItem(SAVE_KEY, JSON.stringify({ chapterIndex, index, gameState, dialogueLog, chapterStartSnapshot, savedAt: Date.now() }));
  continueButton.classList.remove('vn-hidden');
}

function getCenterContent(scene) {
  if (/-clear$/i.test(scene.id || '')) {
    return `<div class="chapter-clear-card"><span class="chapter-clear-card__eyebrow">MISSION COMPLETE</span><strong>CHAPTER ${getCurrentChapter().id} CLEAR</strong><span class="chapter-clear-card__title">${getCurrentChapter().title}</span><small>화면을 터치해 계속</small></div>`;
  }
  return scene.center ? scene.center.replaceAll('\n', '<br>') : '';
}

function recordSceneInLog(scene) {
  const value = scene.text || scene.center || '';
  if (!value) return;
  const key = `${getCurrentChapter().id}:${scene.id}:${index}`;
  if (loggedSceneKeys.has(key)) return;
  loggedSceneKeys.add(key);
  dialogueLog.push({ chapter: getCurrentChapter().id, sceneId: scene.id, speaker: scene.narration ? '내레이션' : (scene.speaker || (scene.center ? '시스템' : '')), text: value });
  if (dialogueLog.length > 250) dialogueLog = dialogueLog.slice(-250);
}

function rebuildLoggedSceneKeys() {
  loggedSceneKeys = new Set(dialogueLog.map((entry, entryIndex) => `${entry.chapter}:${entry.sceneId}:${entryIndex}`));
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function renderDialogueLog() {
  if (!dialogueLog.length) {
    dialogueLogContent.innerHTML = '<p class="vn-log__empty">아직 기록된 대사가 없습니다.</p>';
    return;
  }
  dialogueLogContent.innerHTML = dialogueLog.map((entry) => `<article class="vn-log__entry"><span>${entry.speaker || '기록'}</span><p>${escapeHtml(entry.text).replaceAll('\n', '<br>')}</p></article>`).join('');
  dialogueLogContent.scrollTop = dialogueLogContent.scrollHeight;
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

function appendFollowUpScenes(scene, choice) {
  const inserted = [];
  if (choice.reply) inserted.push({ id: `choice-reply-${scene.id}-${choice.id}`, mode: scene.mode, speaker: '주인공', text: choice.reply, temporary: true });
  if (Array.isArray(choice.followUp)) choice.followUp.forEach((followUp, i) => inserted.push({ ...clone(followUp), id: followUp.id || `choice-follow-up-${scene.id}-${choice.id}-${i}`, temporary: true }));
  if (inserted.length) scenes.splice(index + 1, 0, ...inserted);
}

function renderScene() {
  const scene = scenes[index];
  if (!scene) return;
  gameState.currentChapter = getCurrentChapter().id;
  gameState.currentScene = scene.id;
  applyMode(scene.mode || 'black');
  centerText.classList.toggle('vn-hidden', !scene.center);
  centerText.classList.toggle('vn-center-text--system', /-clear$/i.test(scene.id || '') || scene.mode === 'status');
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
  const important = scene.center || scene.mode === 'status' || /clear|end|level|status|chapter/i.test(scene.id || '');
  blockInput(scene.choices ? CHOICE_INPUT_GUARD_MS : (important ? IMPORTANT_INPUT_GUARD_MS : NORMAL_INPUT_GUARD_MS));
  if (scene.choices) {
    locked = true;
    choices.classList.remove('vn-hidden');
    scene.choices.forEach((choice) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'vn-choice';
      button.textContent = choice.label;
      button.disabled = true;
      window.setTimeout(() => { button.disabled = false; }, CHOICE_INPUT_GUARD_MS);
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        if (button.disabled || isInputBlocked()) return;
        if ((choice.important || scene.importantChoice) && !window.confirm('이 선택은 이후 관계나 이야기에 영향을 줄 수 있습니다.\n정말 선택하시겠습니까?')) return blockInput(300);
        stopTyping(true);
        locked = false;
        gameState.currentScene = scene.id;
        gameState = recordChoice(gameState, choice);
        dialogueLog.push({ chapter: getCurrentChapter().id, sceneId: scene.id, speaker: '선택', text: choice.label });
        appendFollowUpScenes(scene, choice);
        index += 1;
        renderScene();
        saveProgress();
      });
      choices.appendChild(button);
    });
  }
  saveProgress();
}

function makeDecisionButton(label, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'vn-choice';
  button.textContent = label;
  button.disabled = true;
  button.addEventListener('click', (event) => { event.stopPropagation(); if (!button.disabled && !isInputBlocked()) onClick(); });
  window.setTimeout(() => { button.disabled = false; }, CHOICE_INPUT_GUARD_MS);
  choices.appendChild(button);
}

function renderChapterDecision() {
  stopTyping();
  locked = true;
  applyMode('black');
  dialogue.classList.add('vn-hidden');
  centerText.classList.remove('vn-hidden');
  centerText.classList.add('vn-center-text--system');
  centerText.innerHTML = '<div class="status-window chapter-decision-window"><span class="status-window__label">CHAPTER CONFIRM</span><h2>다음 챕터로 진행하시겠습니까?</h2><div class="status-window__line"></div><p>다음 챕터로 넘어가면 현재 챕터의 선택은 확정되며 다시 변경할 수 없습니다.</p></div>';
  choices.innerHTML = '';
  choices.classList.remove('vn-hidden');
  blockInput(CHOICE_INPUT_GUARD_MS);
  makeDecisionButton('다음 챕터로 진행', confirmCurrentChapter);
  makeDecisionButton('현재 챕터 다시하기', restartCurrentChapter);
}

function restartCurrentChapter() {
  if (!chapterStartSnapshot) return;
  gameState = normalizeGameState(clone(chapterStartSnapshot.gameState));
  dialogueLog = dialogueLog.slice(0, chapterStartSnapshot.dialogueLogLength);
  rebuildLoggedSceneKeys();
  loadChapter(chapterStartSnapshot.chapterIndex, 0);
  renderScene();
  saveProgress();
}

function confirmCurrentChapter() {
  locked = true;
  const currentLevel = Number(gameState.status?.레벨 || getCurrentChapter().id);
  const nextLevel = Math.max(currentLevel, getCurrentChapter().id + 1);
  gameState = normalizeGameState(gameState);
  gameState.status.레벨 = nextLevel;
  gameState.flags[`chapter_${getCurrentChapter().id}_confirmed`] = true;
  renderLevelUp(currentLevel, nextLevel);
  saveProgress();
}

function renderLevelUp(beforeLevel, nextLevel) {
  stopTyping();
  applyMode('status');
  dialogue.classList.add('vn-hidden');
  choices.classList.add('vn-hidden');
  centerText.classList.remove('vn-hidden');
  centerText.classList.add('vn-center-text--system');
  centerText.innerHTML = `<div class="status-window"><div class="status-window__scan" aria-hidden="true"></div><span class="status-window__label">STATUS UPDATE</span><h2>레벨 상승</h2><div class="status-window__level"><span>Lv. ${beforeLevel}</span><b>→</b><strong>Lv. ${nextLevel}</strong></div><div class="status-window__line"></div><p>챕터 ${getCurrentChapter().id} 클리어 보상이 적용되었습니다.</p><small>화면을 터치해 계속</small></div>`;
  blockInput(IMPORTANT_INPUT_GUARD_MS);
  shell.addEventListener('click', finishChapterTransition, { once: true });
}

function finishChapterTransition(event) {
  if (event?.target?.closest('button, .vn-log, .developer-panel') || isInputBlocked()) {
    shell.addEventListener('click', finishChapterTransition, { once: true });
    return;
  }
  if (chapterIndex >= chapters.length - 1) {
    locked = true;
    centerText.innerHTML = '<div class="status-window"><span class="status-window__label">STORY COMPLETE</span><h2>준비된 챕터를 모두 완료했습니다.</h2></div>';
    saveProgress();
    return;
  }
  loadChapter(chapterIndex + 1, 0);
  gameState.currentChapter = getCurrentChapter().id;
  gameState.currentScene = scenes[0]?.id || '';
  captureChapterStart();
  renderScene();
  saveProgress();
}

function advance(event) {
  if (event?.target?.closest('button, .vn-log, .developer-panel')) return;
  if (!started || locked || !developerPanel.hidden || !dialogueLogPanel.classList.contains('vn-hidden') || isInputBlocked()) return;
  if (typing) { stopTyping(true); blockInput(180); return; }
  const currentScene = scenes[index];
  if (/-clear$/i.test(currentScene?.id || '')) return renderChapterDecision();
  if (index < scenes.length - 1) {
    if (currentScene?.temporary) scenes.splice(index, 1); else index += 1;
    renderScene();
    return;
  }
  renderChapterDecision();
}

function startGame(fromSave = false) {
  started = true;
  locked = false;
  dialogueLog = [];
  loggedSceneKeys = new Set();
  if (fromSave) {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    gameState = normalizeGameState(saved.gameState || createInitialGameState());
    dialogueLog = Array.isArray(saved.dialogueLog) ? saved.dialogueLog : [];
    chapterStartSnapshot = saved.chapterStartSnapshot ? clone(saved.chapterStartSnapshot) : null;
    loadChapter(Number.isInteger(saved.chapterIndex) ? saved.chapterIndex : 0, Number.isInteger(saved.index) ? saved.index : 0);
    rebuildLoggedSceneKeys();
    if (!chapterStartSnapshot) captureChapterStart();
  } else {
    gameState = createInitialGameState();
    loadChapter(0, 0);
    captureChapterStart();
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
  chapterStartSnapshot = null;
  gameState = createInitialGameState();
  loadChapter(0, 0);
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
document.querySelector('#startButton').addEventListener('click', (event) => { event.stopPropagation(); startGame(false); });
continueButton.addEventListener('click', (event) => { event.stopPropagation(); startGame(true); });
document.querySelector('#restart').addEventListener('click', restartGame);
logButton.addEventListener('click', openDialogueLog);
closeLogButton.addEventListener('click', closeDialogueLog);
dialogueLogPanel.addEventListener('click', (event) => { if (event.target === dialogueLogPanel) closeDialogueLog(event); });
versionButton.addEventListener('click', (event) => { event.stopPropagation(); detectDeveloperTap(); });
shell.addEventListener('click', advance);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !dialogueLogPanel.classList.contains('vn-hidden')) return closeDialogueLog(event);
  if (event.key === 'Enter' || event.key === ' ') advance(event);
});
