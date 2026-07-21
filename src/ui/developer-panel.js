const 표시이름 = {
  주요인물4: '주요인물 4',
  주요인물5: '주요인물 5',
  주요인물6: '주요인물 6',
};

const formatValues = (values = {}) =>
  Object.entries(values)
    .map(([name, value]) => `<li><span>${표시이름[name] || name}</span><strong>${value}</strong></li>`)
    .join('') || '<li>기록 없음</li>';

export const createDeveloperPanel = ({ onClose } = {}) => {
  const panel = document.createElement('aside');
  panel.className = 'developer-panel';
  panel.hidden = true;
  panel.innerHTML = `
    <div class="developer-panel__header">
      <h2>개발자 모드</h2>
      <button type="button" data-developer-close>닫기</button>
    </div>

    <section>
      <h3>현재 위치</h3>
      <p data-developer-location>확인 전</p>
    </section>

    <section>
      <h3>호감도 · 주요 인물 6명</h3>
      <ul data-developer-affection></ul>
    </section>

    <section>
      <h3>신뢰도 · 주요 인물 6명</h3>
      <ul data-developer-trust></ul>
    </section>

    <section>
      <h3>플레이어 성향</h3>
      <ul data-developer-traits></ul>
    </section>

    <section>
      <h3>플래그</h3>
      <ul data-developer-flags></ul>
    </section>

    <section>
      <h3>선택 기록</h3>
      <ol data-developer-history></ol>
    </section>
  `;

  panel.addEventListener('click', (event) => event.stopPropagation());

  panel.querySelector('[data-developer-close]').addEventListener('click', () => {
    panel.hidden = true;
    onClose?.();
  });

  return panel;
};

export const updateDeveloperPanel = (panel, snapshot) => {
  panel.querySelector('[data-developer-location]').textContent =
    `챕터 ${snapshot.currentChapter} / 장면 ${snapshot.currentScene}`;

  panel.querySelector('[data-developer-affection]').innerHTML = formatValues(snapshot.affection);
  panel.querySelector('[data-developer-trust]').innerHTML = formatValues(snapshot.trust);
  panel.querySelector('[data-developer-traits]').innerHTML = formatValues(snapshot.traits);
  panel.querySelector('[data-developer-flags]').innerHTML = formatValues(snapshot.flags);

  panel.querySelector('[data-developer-history]').innerHTML =
    snapshot.choiceHistory
      .map((choice) => `<li>챕터 ${choice.chapter} · ${choice.label}</li>`)
      .join('') || '<li>선택 기록 없음</li>';
};

export const openDeveloperPanel = (panel, snapshot) => {
  updateDeveloperPanel(panel, snapshot);
  panel.hidden = false;
};