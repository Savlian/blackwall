import { findAndReplace } from '../../utils/findAndReplace';
import { EscapeRule, INLINE_SEQUENCE_SET } from './inline/rules';
import { runInlineRule } from './inline/runner';

/**
 * Removes escape sequences from markdown inline elements in the given plain-text.
 * This function unescapes characters that are escaped with backslashes (e.g., `\*`, `\_`)
 * in markdown syntax, returning the original plain-text with markdown characters in effect.
 *
 * @param text - The input markdown plain-text containing escape characters (e.g., `"some \*italic\*"`)
 * @returns The plain-text with markdown escape sequences removed (e.g., `"some *italic*"`)
 */
export const unescapeMarkdownInlineSequences = (text: string): string =>
  runInlineRule(text, EscapeRule, (t) => {
    if (t === '') return t;
    return unescapeMarkdownInlineSequences(t);
  }) ?? text;

/**
 * Recovers the markdown escape sequences in the given plain-text.
 * This function adds backslashes (`\`) before markdown characters that may need escaping
 * (e.g., `*`, `_`) to ensure they are treated as literal characters and not part of markdown formatting.
 *
 * @param text - The input plain-text that may contain markdown sequences (e.g., `"some *italic*"`)
 * @returns The plain-text with markdown escape sequences added (e.g., `"some \*italic\*"`)
 */
export const escapeMarkdownInlineSequences = (text: string): string => {
  const regex = new RegExp(`(${INLINE_SEQUENCE_SET})`, 'g');
  const parts = findAndReplace(
    text,
    regex,
    (match) => {
      const [, g1] = match;
      return `\\${g1}`;
    },
    (t) => t
  );

  return parts.join('');
};
