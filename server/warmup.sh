#!/bin/bash
# 모델을 메모리에 올리고 발표에서 쓸 질문의 프롬프트 프리픽스까지 미리 평가시킨다.
# 처음 보는 프롬프트는 첫 토큰까지 3초대, 한 번 데운 프롬프트는 0.3초대다.
QUESTIONS=(
  "2030 뚜벅이인데 1박 코스 짜줘"
  "묵호에서 저녁 먹을 데 알려줘"
  "2일권은 뭐가 포함돼"
  "밤에 동해에서 할 거 추천해줘"
)
for q in "${QUESTIONS[@]}"; do
  printf '  %s ... ' "$q"
  curl -s -X POST http://localhost:3000/api/sovereign/chat \
    -H "Content-Type: application/json" \
    -d "{\"message\": \"$q\"}" > /dev/null
  echo "완료"
done
echo "워밍업 완료. 위 네 질문은 첫 토큰이 0.3초대로 나온다."
