# -*- coding: utf-8 -*-
"""화면 데이터를 챗봇 자료집으로 변환한다. 손 전사 금지, 파서로만."""
import json, re, os

ROOT = "/Users/juhyunho/Desktop/00. 26-2학기/04. 성우킴/01. 동해시 AX 연구/06. 리빙랩/04. 프로토타입/G-Local-Station-main"
D = os.path.join(ROOT, "client/src/data")
KB = os.path.join(ROOT, "server/data/donghae-knowledge.json")

load = lambda f: json.load(open(os.path.join(D, f), encoding="utf-8"))
curated = json.load(open(KB, encoding="utf-8"))
curated_ids = {c["id"] for c in curated}

TYPE_KW = {
    "eat":  ("맛집", ["맛집", "식당", "먹을", "음식"]),
    "stay": ("숙소", ["숙소", "숙박", "잘 곳", "묵을"]),
    "see":  ("관광지", ["관광", "명소", "볼거리", "구경"]),
    "play": ("체험", ["체험", "액티비티", "놀거리"]),
}
JOURNAL_KW = {
    "place": ("카페", ["카페", "커피", "디저트"]),
    "shop":  ("소품샵", ["소품샵", "굿즈", "기념품", "쇼핑"]),
    "book":  ("책방", ["책방", "서점", "독립서점"]),
}
UNKNOWN = "확인 안 됨"

def night_keywords(hours, text):
    """영업 종료가 21시 이후이거나 원문에 야간이 명시된 항목만 밤 자원으로 본다.
    주소는 넘기지 않는다. 일출로는 도로명이라 일출 자원이 아니다."""
    hours = hours or ""
    close = max((int(h) for h, _ in re.findall(r"(\d{1,2}):(\d{2})", hours)), default=0)
    blob = hours + " " + (text or "")
    kw, is_night = [], False
    if close >= 21 or re.search(r"야간|야경|야시장|심야|일몰|별빛", blob):
        kw += ["밤", "야간"]
        is_night = True
    if "야경" in blob:
        kw.append("야경")
    if re.search(r"일출(?!로)", blob):
        kw.append("일출")
    return sorted(set(kw)), is_night

def clean(words):
    out = []
    for w in words:
        w = (w or "").strip()
        if w and w != UNKNOWN and w not in out:
            out.append(w)
    return out

items, night_list = [], []

# 1. 스팟 122건
for s in load("stays.json"):
    label, kws = TYPE_KW[s["type"]]
    desc = s.get("short_description") or ""
    region = s.get("region") or UNKNOWN
    parts = [f"{s['name']}는 {region} 권역의 {label}다."]
    if desc and desc != UNKNOWN:
        parts.append(f"{desc}.")
    parts.append(f"주소는 {s.get('address') or UNKNOWN}.")
    parts.append(f"영업시간은 {s.get('hours') or UNKNOWN}.")
    if s.get("price_label") and s["price_label"] != UNKNOWN:
        parts.append(f"가격은 {s['price_label']}.")
    if s.get("target") and s["target"] != UNKNOWN:
        parts.append(f"추천 대상은 {s['target']}.")
    if s["type"] in ("eat", "stay"):
        parts.append("제휴가 확정된 곳이 아니라 연계 후보다.")

    nk, is_night = night_keywords(s.get("hours"), desc + " " + s["name"])
    if is_night:
        night_list.append((s["name"], region, label, s.get("hours") or UNKNOWN))
    items.append({
        "id": s["id"], "weight": 1,
        "keywords": clean([s["name"], *s["name"].split(), region, *kws, *s.get("tags", []), *nk]),
        "content": " ".join(parts)
    })

# 2. 저널 15건은 모두 stays.json에 같은 상호로 존재한다. 항목을 새로 만들지 않고
#    본문과 메뉴만 해당 스팟 항목에 덧붙여 정보를 합친다
by_name = {}
for it, src in zip(items, load("stays.json")):
    by_name[src["name"]] = (it, src)

for j in load("journal.json"):
    hit = by_name.get(j["title"])
    if not hit:
        continue
    it, src = hit
    label, kws = JOURNAL_KW.get(j.get("category"), ("로컬 가게", ["로컬", "가게"]))
    extra = []
    if j.get("body"):
        extra.append(j["body"])
    menu = j.get("menu")
    if isinstance(menu, list):
        menu = ", ".join(map(str, menu))
    if menu and menu != UNKNOWN:
        extra.append(f"메뉴는 {menu}.")
    if extra:
        it["content"] += " " + " ".join(extra)
    it["keywords"] = clean(it["keywords"] + kws)
    nk, is_night = night_keywords(src.get("hours"), j.get("body", "") + " " + (j.get("subtitle") or ""))
    if nk:
        it["keywords"] = clean(it["keywords"] + nk)
    if is_night and not any(n[0] == j["title"] for n in night_list):
        night_list.append((j["title"], src.get("region") or UNKNOWN, label, src.get("hours") or UNKNOWN))

# 3. 프로그램 10건. 코스 8건과 패스 3종은 기존 자료집에 이미 있어 건너뛴다
for p in load("packages.json"):
    if p["id"] in curated_ids or p.get("category") != "program":
        continue
    flow = []
    for day in p.get("itinerary", []):
        acts = ", ".join(x["activity"] for x in day["schedule"])
        flow.append(f"{day['title']}는 {acts}.")
    meals = ", ".join(o["name"] for o in p.get("meal_options", []))
    stays_ = ", ".join(o["name"] for o in p.get("stay_options", []))
    parts = [f"{p['name']}는 {p['target_persona'][0]} 대상 1박 2일 프로그램이다.",
             f"{p.get('short_description') or ''}.".replace("..", "."),
             f"{p.get('long_description') or ''}".strip(),
             *flow]
    if meals:
        parts.append(f"식사 후보는 {meals}.")
    if stays_:
        parts.append(f"숙소 후보는 {stays_}.")
    if p.get("signature_experience"):
        parts.append(f"핵심 체험은 {p['signature_experience']}")
    parts.append("식당과 숙소는 연계 후보이며 제휴 확정이 아니다.")
    blob = " ".join(parts)
    nk, _ = night_keywords("", blob)
    items.append({
        "id": p["id"], "weight": 1.3,
        "keywords": clean([p["name"], *p["name"].split(), "프로그램", "1박 2일",
                           p["target_persona"][0], p.get("region"), *p.get("tags", []), *nk]),
        "content": " ".join(x for x in parts if x.strip())
    })

# 3-1. 동쪽바다중앙시장 야시장. stays.json에 없고 원본에만 있어 원문을 그대로 옮긴다
#      동해_로컬자원_통합정리.md 831에서 838행
for it, src in zip(items, load("stays.json")):
    if src["name"] == "동쪽바다중앙시장":
        it["content"] += (" 주말 야시장은 7월부터 8월 금요일과 토요일 17시부터 21시까지 계절 한정으로 운영한다."
                          " 문어 컵회와 묵호김밥을 야시장 먹거리로 판매한다."
                          " 출처는 동해_로컬자원_통합정리.md다.")
        it["keywords"] = clean(it["keywords"] + ["밤", "야간", "야시장", "문어", "문어 컵회", "묵호김밥"])
        night_list.append((src["name"], src.get("region") or UNKNOWN, "시장",
                           "야시장 7월에서 8월 금요일과 토요일 17:00부터 21:00"))
        break

# 3-2. 기존 23건 중에도 본문에 야간 운영이 적힌 항목이 있다. 같은 규칙으로 판정한다
#      밤 안내 목록에는 넣지 않는다. 코스와 패스는 장소가 아니라 상품이다
for c in curated:
    nk, _ = night_keywords("", c["content"])
    if nk:
        c["keywords"] = clean(c["keywords"] + nk)

# 4. 밤 안내. 위에서 야간으로 판정된 항목만 모아 만든다. 지어낸 항목 없음
# 맛집만 줄줄이 나오지 않게 볼거리와 카페를 앞에 둔다. 모델이 시간을 오독하지 않게 완성 문장으로 쓴다
ORDER = {"관광지": 0, "체험": 1, "시장": 2, "카페": 3, "맛집": 4, "숙소": 5}
night_list.sort(key=lambda x: (ORDER.get(x[2], 9), x[0]))
night_lines = [f"{n}는 {r} 권역의 {c}이고 영업시간은 {h}이다." for n, r, c, h in night_list]
items.append({
    "id": "night-guide", "weight": 2,
    "keywords": ["밤", "야간", "야경", "밤에", "밤 활동", "야간 개장", "저녁 이후", "늦게"],
    "content": ("동해에서 밤에 이용할 수 있는 곳은 아래와 같다. 영업 종료가 21시 이후이거나 야간 운영이 확인된 곳만 모았다.\n"
                + "\n".join(night_lines)
                + "\n방문 전에 영업일과 휴무를 확인해야 한다.")
})

# 기존 23건은 손대지 않는다. 요약형이라 개별 항목보다 우선하게 가중치를 준다
SUMMARY = {"food-mukho", "food-cheonok-hanseom", "food-mangsang", "food-chuam", "food-muleung", "positioning"}
for c in curated:
    c["weight"] = 1.6 if c["id"] in SUMMARY else 1.3

merged = curated + items
seen = set()
for m in merged:
    assert m["id"] not in seen, m["id"]
    seen.add(m["id"])

json.dump(merged, open(KB, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print("자료집", len(merged), "= 기존", len(curated), "+ 신규", len(items))
print("야간 판정", len(night_list), "건")
for n, r, c, h in night_list:
    print("  -", n, "|", c, "|", h[:46])
