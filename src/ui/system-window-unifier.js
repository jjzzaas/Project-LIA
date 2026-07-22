const centerText = document.querySelector('#centerText');
const shell = document.querySelector('.vn-shell');
const versionButton = document.querySelector('#versionButton');

if (versionButton) versionButton.textContent = 'VN 1.4';

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

function makeStatusWindow(text) {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const rows = lines.slice(1).map((line) => {
    const parts = line.split(/\s{2,}/).filter(Boolean);
    if (parts.length > 1) {
      return `<div class="system-window__status-row">${parts.map((part) => `<span>${escapeHtml(part)}</span>`).join('')}</div>`;
    }

    const match = line.match(/^(이름|레벨|스킬|구현 무기)\s+(.+)$/);
    if (match) {
      return `<div class="system-window__status-row system-window__status-row--single"><span>${escapeHtml(match[1])}</span><strong>${escapeHtml(match[2])}</strong></div>`;
    }

    return `<div class="system-window__status-row system-window__status-row--single"><span>${escapeHtml(line)}</span></div>`;
  }).join('');

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

  const plainText = centerText.textContent.trim();
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
