export const createInitialGameState = () => ({
  currentChapter: 1,
  currentScene: 'prologue-title',

  affection: {
    haru: 0,
    momo: 0,
  },

  trust: {
    haru: 0,
    momo: 0,
  },

  traits: {
    cautious: 0,
    brave: 0,
    considerate: 0,
  },

  flags: {},
  choiceHistory: [],
});

export const recordChoice = (state, choice) => {
  const nextState = structuredClone(state);

  Object.entries(choice.affection || {}).forEach(([character, amount]) => {
    nextState.affection[character] = (nextState.affection[character] || 0) + amount;
  });

  Object.entries(choice.trust || {}).forEach(([character, amount]) => {
    nextState.trust[character] = (nextState.trust[character] || 0) + amount;
  });

  Object.entries(choice.traits || {}).forEach(([trait, amount]) => {
    nextState.traits[trait] = (nextState.traits[trait] || 0) + amount;
  });

  (choice.flags || []).forEach((flag) => {
    nextState.flags[flag] = true;
  });

  nextState.choiceHistory.push({
    chapter: nextState.currentChapter,
    scene: nextState.currentScene,
    choiceId: choice.id,
    label: choice.label,
    affection: choice.affection || {},
    trust: choice.trust || {},
    traits: choice.traits || {},
    flags: choice.flags || [],
    selectedAt: Date.now(),
  });

  return nextState;
};
