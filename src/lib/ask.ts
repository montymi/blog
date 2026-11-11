/** Put a sentence on the front page's command line, from anywhere on the page. */
export const ASK_EVENT = 'montymi:ask';

export function askAbove(sentence: string) {
  window.dispatchEvent(new CustomEvent(ASK_EVENT, { detail: sentence }));
}
