const centerText = document.querySelector('#centerText');
const shell = document.querySelector('.vn-shell');
const versionButton = document.querySelector('#versionButton');

if (versionButton) versionButton.textContent = 'VN 1.5';

function escapeHtml(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function systemWindow({ label, title, body = '', hint = '화면을 터치해 계속', variant = '' }) {
  return `
    <div class="system-window ${variant ? `system-window--${variant}` : ''}">
      <div class="system-window__scan" aria-hidden="true"></div>
      <span class="system-window__label">${escapeHtml(label)}</span>
      <h2>${escapeHtml(title)}</h2>
      ${body}
      <div class="system-window__line"></div>
      <small>${escapeHtml(hint)}</small>
    </div>
  `;
}

function statusRow(label, value, extraClass = '') {
  return `
    <div class="system-window__status-row ${extraClass}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function readValue(text, pattern, fallback = '없음') {
  return text.match(pattern)?.[1]?.trim() || fallback;
}

function makeStatusWindow(text) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  const name = readValue(normalized, /이름\s+(.+?)\s+레벨/,'알 수 없음');
  const level = readValue(normalized, /레벨\s+(\d+)/, '1');
  const strength = readValue(normalized, /힘\s+(\d+)/, '1');
  const agility = readValue(normalized, /민첩\s+(\d+)/, '1');
  const stamina = readValue(normalized, /체력\s+(\d+)/, '1');
  const spirit = readValue(normalized, /정신력\s+(\d+)/, '1');
  const skillRaw = readValue(normalized, /스킬\s+(.+?)\s+구현 무기/, '없음');
  const weaponRaw = readValue(normalized, /구현 무기\s+(.+)$/, '없음');
  const skill = skillRaw === '없음' ? '미습득' : skillRaw;
  const weapon = weaponRaw === '없음' ? '미구현' : weaponRaw;

  const rows = [
    statusRow('이름', name),
    statusRow('레벨', `Lv.${level}`, 'system-window__status-row--level'),
    statusRow('힘', strength),
    statusRow('민첩', agility),
    statusRow('체력', stamina),
    statusRow('정신력', spirit),
    statusRow('스킬', skill),
    statusRow('구현 무기', weapon),
  ].join('');

  return systemWindow({
    label: 'STATUS',
    title: '스테이터스',
    body: `<div class="system-window__status">${rows}</div>`,
    variant: 'status',
  });
}

function unifyCenterWindow() {
  if (!centerText || centerText.classList.contains('vn-hidden')) return;
  if (centerText.querySelector('.system-window')) return;

  const plainText = centerText.innerText.trim();
  if (!plainText) return;

  const chapterTitle = plainText.match(/^CHAPTER\s+(\d+)\s+(.+)$/s);
  if (chapterTitle && !plainText.includes('CLEAR')) {
    const chapterNumber = chapterTitle[1];
    const subtitle = chapterTitle[2].trim().replace(/\s+/g, ' ');
    shell?.setAttribute('data-mode', 'status');
    centerText.classList.add('vn-center-text--system');
    centerText.innerHTML = systemWindow({
      label: 'CHAPTER',
      title: `CHAPTER ${chapterNumber}`,
      body: `<p class="system-window__subtitle">${escapeHtml(subtitle)}</p>`,
      variant: 'chapter',
    });
    return;
  }

  if (plainText.startsWith('스테이터스')) {
    shell?.setAttribute('data-mode', 'status');
    centerText.classList.add('vn-center-text--system');
    centerText.innerHTML = makeStatusWindow(plainText);
    return;
  }

  const clearMatch = plainText.match(/CHAPTER\s+(\d+)\s+CLEAR/i);
  if (clearMatch) {
    const legacyTitle = centerText.querySelector('.chapter-clear-card__title')?.textContent.trim();
    shell?.setAttribute('data-mode', 'status');
    centerText.classList.add('vn-center-text--system');
    centerText.innerHTML = systemWindow({
      label: 'MISSION COMPLETE',
      title: `CHAPTER ${clearMatch[1]} CLEAR`,
      body: legacyTitle ? `<p class="system-window__subtitle">${escapeHtml(legacyTitle)}</p>` : '',
      variant: 'clear',
    });
    return;
  }

  const legacyStatus = centerText.querySelector('.status-window');
  if (legacyStatus) {
    legacyStatus.classList.add('system-window', 'system-window--level');
    legacyStatus.querySelector('.status-window__scan')?.classList.add('system-window__scan');
    legacyStatus.querySelector('.status-window__label')?.classList.add('system-window__label');
    legacyStatus.querySelector('.status-window__line')?.classList.add('system-window__line');
  }
}

if (centerText) {
  const observer = new MutationObserver(() => queueMicrotask(unifyCenterWindow));
  observer.observe(centerText, { childList: true, subtree: true, characterData: true, attributes: true });
  unifyCenterWindow();
}
