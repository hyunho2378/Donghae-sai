import assert from 'node:assert/strict'
import { stripEmoji } from '../src/lib/stripEmoji.js'

assert.equal(stripEmoji('묵호 🌊 산책 ✨ 좋아요'), '묵호  산책  좋아요')
assert.equal(stripEmoji('가족 👨‍👩‍👧‍👦 여행'), '가족  여행')
assert.equal(stripEmoji('1️⃣ 코스'), '1 코스')
assert.equal(stripEmoji('- **묵호항**: 산책하기 좋아요.'), '- **묵호항**: 산책하기 좋아요.')

console.log('chat display helpers ok')
