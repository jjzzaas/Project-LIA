export const CHAPTER_COUNT = 100;

const padChapter = (number) => String(number).padStart(3, '0');

const getRangeFolder = (chapter) => {
  const start = Math.floor((chapter - 1) / 10) * 10 + 1;
  const end = Math.min(start + 9, CHAPTER_COUNT);
  return `${padChapter(start)}-${padChapter(end)}`;
};

export const chapterRegistry = Array.from({ length: CHAPTER_COUNT }, (_, index) => {
  const chapter = index + 1;
  const number = padChapter(chapter);

  return {
    id: chapter,
    title: chapter === 1 ? '낯선 세계' : `CHAPTER ${chapter}`,
    status: chapter === 1 ? 'complete' : 'empty',
    path: `./${getRangeFolder(chapter)}/chapter-${number}.js`,
  };
});

export const getChapterInfo = (chapter) =>
  chapterRegistry.find((item) => item.id === chapter) || null;
