(() => {
  const SAVE_KEY = 'mongyeong-vn-save-v2';

  function makeEntryKey(entry) {
    return [
      entry?.chapter ?? '',
      entry?.sceneId ?? '',
      entry?.speaker ?? '',
      entry?.text ?? '',
    ].join('\u0001');
  }

  function cleanSavedDialogueLog() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;

      const save = JSON.parse(raw);
      if (!Array.isArray(save.dialogueLog)) return;

      const seen = new Set();
      const cleaned = save.dialogueLog.filter((entry) => {
        const key = makeEntryKey(entry);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      if (cleaned.length !== save.dialogueLog.length) {
        save.dialogueLog = cleaned;
        localStorage.setItem(SAVE_KEY, JSON.stringify(save));
      }
    } catch (error) {
      console.warn('대화 기록 중복 정리에 실패했습니다.', error);
    }
  }

  cleanSavedDialogueLog();

  const originalSetHas = Set.prototype.has;
  Set.prototype.has = function patchedSetHas(value) {
    if (typeof value === 'string' && /^\d+:[^:]+:\d+$/.test(value)) {
      const separator = value.lastIndexOf(':');
      const scenePrefix = `${value.slice(0, separator)}:`;

      for (const item of this) {
        if (typeof item === 'string' && item.startsWith(scenePrefix)) return true;
      }
    }

    return originalSetHas.call(this, value);
  };
})();
