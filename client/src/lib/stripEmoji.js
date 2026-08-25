const EMOJI_CODEPOINTS = /[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu
const EMOJI_JOINERS = /[\uFE0E\uFE0F\u200D\u20E3]/g

// 답변 표시 직전에만 적용한다. 원본 메시지와 서버 로그는 그대로 유지한다.
export function stripEmoji(text = '') {
  return text.replace(EMOJI_CODEPOINTS, '').replace(EMOJI_JOINERS, '')
}
