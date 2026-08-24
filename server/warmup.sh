#!/bin/bash
curl -s -X POST http://localhost:3000/api/sovereign/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "워밍업"}' > /dev/null
echo "워밍업 완료. 모델이 메모리에 올라왔다."
