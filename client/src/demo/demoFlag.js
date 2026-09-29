// 자동 시연 모드 스위치. 주소 뒤에 ?demo=1 을 붙여 들어오면 켜진다.
// 새로고침하면 주소를 다시 읽으므로 저장소를 쓰지 않는다. 일반 접속에는 아무 영향이 없다
let on = false
if (typeof window !== 'undefined') {
  try { on = new URLSearchParams(window.location.search).get('demo') === '1' } catch { on = false }
}
export const isDemoOn = () => on
export const setDemoOn = (v) => { on = v }
