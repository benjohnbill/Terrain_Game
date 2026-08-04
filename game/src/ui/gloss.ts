/**
 * Korean glosses for the event log — a reading aid appended to the raw type,
 * never a replacement for it.
 *
 * The log and the turn-end tray are the only places a turn's resolution is
 * visible in these grey-box surfaces, and `front-resolved` / `shield-dissolved`
 * tell a human nothing. Every key here is an event the Runtime actually emits
 * (its `#turnEvent` call sites plus the four submit-path types); an unglossed
 * type renders bare rather than guessed at, which is why the lookup is allowed
 * to miss.
 *
 * Extracted out of `App.tsx` so the demo shell and the viewer read the same
 * table. A const move only — no behaviour and no test id changed.
 */
export const EVENT_GLOSS: Readonly<Record<string, string>> = {
  'capital-locked': '수도를 정했어요 (상대에게는 아직 비공개)',
  'capitals-revealed': '양쪽 수도가 동시에 공개됐어요',
  'commitment-allocated': '행동력을 구역에 배분했어요',
  'commitment-locked': '커밋을 잠갔어요',
  'commitments-revealed': '양쪽 커밋이 동시에 공개됐어요',
  'turn-opened': '새 턴이 열렸어요',
  'movement-planned': '행군 명령을 세웠어요',
  'detachment-moved': '야전군이 이동했어요',
  'detachment-split': '야전군을 나눴어요',
  'detachments-merged': '야전군을 합쳤어요',
  'posture-transferred': '태세를 바꿔 병력을 옮겼어요',
  'recruitment-allocated': '모병 주문을 넣었어요',
  'recruitment-resolved': '모병이 처리됐어요',
  recruited: '병력을 모았어요',
  'cohort-affiliated': '신병이 부대에 배속됐어요',
  'cohort-activated': '신병이 전투 가용이 됐어요',
  'upkeep-resolved': '피로와 보급을 정산했어요',
  'front-resolved': '전선이 해결됐어요',
  'battle-resolved': '전투가 끝났어요',
  'sector-captured': '구역을 점령했어요',
  'sector-integrated': '점령지가 편입됐어요',
  'shield-dissolved': '수비대가 해체됐어요',
  'realm-recomputed': '국력을 다시 계산했어요',
  'match-ended': '매치가 끝났어요',
  'intent-rejected': '거절됐어요',
  'preview-refused': '미리보기가 막았어요',
};
