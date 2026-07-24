const HARU_IMAGE_PATH = './public/images/characters/haru/file_0000000068a48206b6b471ee80304517.png';

function mountHaruPortrait() {
  const shell = document.querySelector('.vn-shell');
  const speaker = document.querySelector('#speaker');
  const dialogue = document.querySelector('#dialogue');

  if (!shell || !speaker || !dialogue) return false;
  if (shell.querySelector('.haru-default-portrait')) return true;

  const portrait = document.createElement('img');
  portrait.className = 'haru-default-portrait';
  portrait.src = HARU_IMAGE_PATH;
  portrait.alt = '하루 기본 일러스트';
  portrait.setAttribute('aria-hidden', 'true');

  const vignette = shell.querySelector('.vn-vignette');
  shell.insertBefore(portrait, vignette || shell.firstChild);

  const syncPortrait = () => {
    const speakerName = speaker.textContent.trim();
    const dialogueVisible = !dialogue.classList.contains('vn-hidden');
    portrait.classList.toggle('is-visible', speakerName === '하루' && dialogueVisible);
  };

  new MutationObserver(syncPortrait).observe(speaker, {
    childList: true,
    characterData: true,
    subtree: true,
  });

  new MutationObserver(syncPortrait).observe(dialogue, {
    attributes: true,
    attributeFilter: ['class'],
  });

  portrait.addEventListener('load', syncPortrait, { once: true });
  syncPortrait();
  return true;
}

if (!mountHaruPortrait()) {
  const appObserver = new MutationObserver(() => {
    if (mountHaruPortrait()) appObserver.disconnect();
  });

  appObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
