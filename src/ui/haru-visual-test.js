const shell = document.querySelector('.vn-shell');
const speaker = document.querySelector('#speaker');

if (shell && speaker) {
  const visual = document.createElement('img');
  visual.className = 'haru-visual-test';
  visual.src = './images/characters/haru/haru-vn-test.svg';
  visual.alt = '';
  visual.setAttribute('aria-hidden', 'true');
  shell.insertBefore(visual, shell.querySelector('.vn-vignette'));

  const syncHaruVisual = () => {
    const isHaruScene = speaker.textContent.trim() === '하루' && !document.querySelector('#dialogue')?.classList.contains('vn-hidden');
    visual.classList.toggle('is-visible', isHaruScene);
  };

  new MutationObserver(syncHaruVisual).observe(speaker, {
    childList: true,
    characterData: true,
    subtree: true,
  });

  new MutationObserver(syncHaruVisual).observe(document.querySelector('#dialogue'), {
    attributes: true,
    attributeFilter: ['class'],
  });

  visual.addEventListener('load', syncHaruVisual, { once: true });
  syncHaruVisual();
}
