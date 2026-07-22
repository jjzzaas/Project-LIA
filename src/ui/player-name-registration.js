const SAVE_KEY = 'mongyeong-vn-save-v2';
const PLAYER_NAME_KEY = 'mongyeong-player-name';
const NAME_SCENE_MARKER = '임시 등록명 설정';
const INVALID_NAMES = new Set(['주인공', '미상', '알 수 없음', '없음']);

const originalSetItem = localStorage.setItem.bind(localStorage);

function sanitizeName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function isValidName(value) {
  const name = sanitizeName(value);
  if (name.length < 1 || name.length > 8) return false;
  if (INVALID_NAMES.has(name)) return false;
  return /^[가-힣a-zA-Z0-9]+$/.test(name);
}

function getSavedPlayerName() {
  const directName = sanitizeName(localStorage.getItem(PLAYER_NAME_KEY));
  if (isValidName(directName)) return directName;

  try {
    const save = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    const statusName = sanitizeName(save?.gameState?.status?.이름);
    if (isValidName(statusName)) return statusName;
  } catch {
    // 손상된 저장 데이터는 이름 등록 화면에서 다시 입력하도록 둔다.
  }

  return '';
}

function injectNameIntoSave(rawValue) {
  const playerName = getSavedPlayerName();
  if (!playerName) return rawValue;

  try {
    const save = JSON.parse(rawValue);
    save.gameState ||= {};
    save.gameState.status ||= {};
    save.gameState.status.이름 = playerName;
    save.gameState.flags ||= {};
    save.gameState.flags.temporary_name_registered = true;
    return JSON.stringify(save);
  } catch {
    return rawValue;
  }
}

localStorage.setItem = (key, value) => {
  if (key === SAVE_KEY) {
    originalSetItem(key, injectNameIntoSave(value));
    return;
  }
  originalSetItem(key, value);
};

const overlay = document.createElement('section');
overlay.className = 'player-name-modal player-name-modal--hidden';
overlay.setAttribute('role', 'dialog');
overlay.setAttribute('aria-modal', 'true');
overlay.setAttribute('aria-labelledby', 'playerNameTitle');
overlay.innerHTML = `
  <div class="player-name-modal__panel">
    <span class="player-name-modal__eyebrow">TEMPORARY ID</span>
    <h2 id="playerNameTitle">임시 등록명 설정</h2>
    <p>기억을 되찾을 때까지 사용할 이름을 입력해 주세요.</p>
    <label for="playerNameInput">등록 이름</label>
    <input id="playerNameInput" type="text" maxlength="8" autocomplete="off" inputmode="text" placeholder="1~8자" />
    <small id="playerNameError" aria-live="polite">한글, 영문, 숫자만 사용할 수 있습니다.</small>
    <div class="player-name-modal__actions">
      <button id="playerNameConfirm" type="button">이 이름으로 등록</button>
    </div>
  </div>
`;
document.body.appendChild(overlay);

const input = overlay.querySelector('#playerNameInput');
const confirmButton = overlay.querySelector('#playerNameConfirm');
const errorText = overlay.querySelector('#playerNameError');
let modalOpen = false;

function persistPlayerName(name) {
  originalSetItem(PLAYER_NAME_KEY, name);

  try {
    const save = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    save.gameState ||= {};
    save.gameState.status ||= {};
    save.gameState.status.이름 = name;
    save.gameState.flags ||= {};
    save.gameState.flags.temporary_name_registered = true;
    originalSetItem(SAVE_KEY, JSON.stringify(save));
  } catch {
    // 다음 자동저장 때 localStorage 래퍼가 이름을 주입한다.
  }
}

function applyPlayerName() {
  const name = getSavedPlayerName();
  if (!name) return;

  const speaker = document.querySelector('#speaker');
  if (speaker?.textContent?.trim() === '주인공') speaker.textContent = name;

  const text = document.querySelector('#text');
  if (text?.textContent?.includes('{{playerName}}')) {
    text.textContent = text.textContent.replaceAll('{{playerName}}', name);
  }

  document.querySelectorAll('.vn-log__entry span').forEach((label) => {
    if (label.textContent.trim() === '주인공') label.textContent = name;
  });

  document.querySelectorAll('.vn-log__entry p').forEach((paragraph) => {
    if (paragraph.textContent.includes('{{playerName}}')) {
      paragraph.textContent = paragraph.textContent.replaceAll('{{playerName}}', name);
    }
  });
}

function openNameModal() {
  if (modalOpen || getSavedPlayerName()) return;
  modalOpen = true;
  overlay.classList.remove('player-name-modal--hidden');
  input.value = '';
  errorText.textContent = '한글, 영문, 숫자만 사용할 수 있습니다.';
  window.setTimeout(() => input.focus(), 80);
}

function closeNameModal() {
  modalOpen = false;
  overlay.classList.add('player-name-modal--hidden');
}

function registerName() {
  const name = sanitizeName(input.value);
  if (!isValidName(name)) {
    errorText.textContent = '1~8자의 한글, 영문, 숫자로 입력해 주세요.';
    input.focus();
    return;
  }

  if (!window.confirm(`‘${name}’으로 임시 등록하시겠습니까?`)) {
    input.focus();
    return;
  }

  persistPlayerName(name);
  closeNameModal();
  applyPlayerName();
}

confirmButton.addEventListener('click', (event) => {
  event.stopPropagation();
  registerName();
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    event.stopPropagation();
    registerName();
  }
});

overlay.addEventListener('click', (event) => event.stopPropagation());
window.addEventListener('click', (event) => {
  if (modalOpen && !event.target.closest('.player-name-modal')) {
    event.stopPropagation();
    event.preventDefault();
  }
}, true);

const observer = new MutationObserver(() => {
  const centerText = document.querySelector('#centerText');
  const isNameScene = centerText && !centerText.classList.contains('vn-hidden') && centerText.textContent.includes(NAME_SCENE_MARKER);

  if (isNameScene) openNameModal();
  applyPlayerName();
});

observer.observe(document.querySelector('#app'), {
  childList: true,
  subtree: true,
  characterData: true,
  attributes: true,
  attributeFilter: ['class'],
});

document.querySelector('#restart')?.addEventListener('click', () => {
  localStorage.removeItem(PLAYER_NAME_KEY);
  closeNameModal();
}, true);

document.querySelector('#startButton')?.addEventListener('click', () => {
  localStorage.removeItem(PLAYER_NAME_KEY);
}, true);

applyPlayerName();