// src/utils/tableOfContentsParser.js
// SPEC-09: supports [lesson:url] for remote lesson files fetched at runtime.
// SPEC-10: called with text fetched from a remote URL (configured in config.js).
// SPEC-11: parser is now fully synchronous — no fetch calls. Content loaded on demand by LessonPage.

const TableOfContentsParser = (tocContent) => {
  const lines = tocContent.split('\n').map(line => line.trim()).filter(line => line !== '');
  const sections = [];
  let lessonCounter = 0;

  for (const line of lines) {
    // Disabled entries (prefixed with **)
    if (line.startsWith('**')) continue;

    if (line.startsWith('[t]')) {
      const label = line.slice(3).trim();
      const id = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      sections.push({ type: 'title', id, label });

    } else if (line.startsWith('[d]')) {
      sections.push({ type: 'divider' });

    } else if (line.startsWith('[lesson:url]')) {
      // Parse optional inline label: [lesson:url] <url> | <label>
      const raw = line.slice(12).trim();
      const pipeIndex = raw.indexOf('|');
      const url = (pipeIndex !== -1 ? raw.slice(0, pipeIndex) : raw).trim();
      const inlineLabel = pipeIndex !== -1 ? raw.slice(pipeIndex + 1).trim() : null;
      const filenameLabel = url.split('/').pop(); // e.g. "lesson7.md"
      const lessonId = ++lessonCounter;

      sections.push({
        type: 'lesson',
        source: 'remote',
        id: String(lessonId),
        label: inlineLabel || filenameLabel,
        url,
        rawContent: null, // loaded on demand by LessonPage via LessonContentCache
      });

    } else if (line.startsWith('[lesson]')) {
      // Local lesson — URL-only mode, ignore
      console.warn(`[TableOfContentsParser] Entrada local ignorada en modo URL: ${line}`);
    }
  }

  return sections;
};

export default TableOfContentsParser;
