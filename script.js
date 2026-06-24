const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const ELEMENT_OF_STEM = {
  甲: "木", 乙: "木", 丙: "火", 丁: "火", 戊: "土", 己: "土", 庚: "金", 辛: "金", 壬: "水", 癸: "水"
};
const ELEMENT_OF_BRANCH = {
  子: "水", 丑: "土", 寅: "木", 卯: "木", 辰: "土", 巳: "火", 午: "火", 未: "土", 申: "金", 酉: "金", 戌: "土", 亥: "水"
};
const ELEMENT_COLORS = { 木: "#69975d", 火: "#b8583b", 土: "#b3945d", 金: "#bfb7a3", 水: "#557a9a" };
const GENERATES = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
const CONTROLS = { 木: "土", 土: "水", 水: "火", 火: "金", 金: "木" };
const SOLAR_MONTHS = [
  { m: 2, d: 4, branch: "寅" },
  { m: 3, d: 6, branch: "卯" },
  { m: 4, d: 5, branch: "辰" },
  { m: 5, d: 6, branch: "巳" },
  { m: 6, d: 6, branch: "午" },
  { m: 7, d: 7, branch: "未" },
  { m: 8, d: 8, branch: "申" },
  { m: 9, d: 8, branch: "酉" },
  { m: 10, d: 8, branch: "戌" },
  { m: 11, d: 7, branch: "亥" },
  { m: 12, d: 7, branch: "子" },
  { m: 1, d: 6, branch: "丑" }
];
const MONTH_START_STEM = { 甲: 2, 己: 2, 乙: 4, 庚: 4, 丙: 6, 辛: 6, 丁: 8, 壬: 8, 戊: 0, 癸: 0 };
const HOUR_START_STEM = { 甲: 0, 己: 0, 乙: 2, 庚: 2, 丙: 4, 辛: 4, 丁: 6, 壬: 6, 戊: 8, 癸: 8 };
const PILLAR_NAMES = ["年", "月", "日", "时"];
const PILLAR_KEYS = ["year", "month", "day", "hour"];
const YANG_STEMS = ["甲", "丙", "戊", "庚", "壬"];
const PILLAR_MEANINGS = {
  年: "祖上、早年、外缘与社会背景",
  月: "父母、成长环境、事业根基与青年阶段",
  日: "日主自身、伴侣关系与核心选择",
  时: "子女、志向、作品成果与晚年阶段"
};
const TOPICS = {
  career: { label: "事业", scoreLabel: "事业", accent: "#d6aa59" },
  health: { label: "健康", scoreLabel: "健康", accent: "#4f8c78" },
  romance: { label: "桃花", scoreLabel: "桃花", accent: "#d88a8a" },
  wealth: { label: "财运", scoreLabel: "财运", accent: "#bfb7a3" }
};
const TOPIC_ORDER = ["career", "health", "romance", "wealth"];
const STORAGE_KEY = "bazi-site.records.v1";
const appState = {
  selectedTopic: "career",
  expandedLuck: null,
  expandedAnnual: null,
  activeRecordId: null,
  records: [],
  chart: null,
  fortune: null,
  birth: null,
  profile: null
};

const stemTargets = (values) => ({ stems: values });
const branchTargets = (values) => ({ branches: values });

const SHEN_SHA = [
  {
    name: "天乙贵人",
    calc: ({ dayStem }) => ({
      甲: ["丑", "未"], 戊: ["丑", "未"], 庚: ["丑", "未"],
      乙: ["子", "申"], 己: ["子", "申"],
      丙: ["亥", "酉"], 丁: ["亥", "酉"],
      壬: ["卯", "巳"], 癸: ["卯", "巳"],
      辛: ["寅", "午"]
    })[dayStem],
    note: "遇事易得助力，适合主动建立良师益友关系。"
  },
  {
    name: "太极贵人",
    calc: ({ dayStem }) => ({
      甲: ["子", "午"], 乙: ["子", "午"],
      丙: ["卯", "酉"], 丁: ["卯", "酉"],
      戊: ["辰", "戌", "丑", "未"], 己: ["辰", "戌", "丑", "未"],
      庚: ["寅", "亥"], 辛: ["寅", "亥"],
      壬: ["巳", "申"], 癸: ["巳", "申"]
    })[dayStem],
    note: "重悟性与精神追求，适合研究抽象系统。"
  },
  {
    name: "天德贵人",
    calc: ({ monthBranch }) => ({
      寅: stemTargets(["丁"]), 卯: branchTargets(["申"]), 辰: stemTargets(["壬"]), 巳: stemTargets(["辛"]),
      午: branchTargets(["亥"]), 未: stemTargets(["甲"]), 申: stemTargets(["癸"]), 酉: branchTargets(["寅"]),
      戌: stemTargets(["丙"]), 亥: stemTargets(["乙"]), 子: branchTargets(["巳"]), 丑: stemTargets(["庚"])
    })[monthBranch],
    note: "有化解与修德之象，宜以正直、善意处事。"
  },
  {
    name: "月德贵人",
    calc: ({ monthBranch }) => {
      const stem = branchByGroup(monthBranch, { "寅午戌": "丙", "申子辰": "壬", "亥卯未": "甲", "巳酉丑": "庚" });
      return stemTargets(stem);
    },
    note: "主温和、包容与人情助力，利合作。"
  },
  {
    name: "文昌贵人",
    calc: ({ dayStem }) => ({ 甲: ["巳"], 乙: ["午"], 丙: ["申"], 丁: ["酉"], 戊: ["申"], 己: ["酉"], 庚: ["亥"], 辛: ["子"], 壬: ["寅"], 癸: ["卯"] })[dayStem],
    note: "重学习表达，利文字、策划、研究与考试。"
  },
  {
    name: "国印贵人",
    calc: ({ dayStem }) => ({ 甲: ["戌"], 乙: ["亥"], 丙: ["丑"], 丁: ["寅"], 戊: ["丑"], 己: ["寅"], 庚: ["辰"], 辛: ["巳"], 壬: ["未"], 癸: ["申"] })[dayStem],
    note: "重规章、资质与信任背书，利管理与公信力。"
  },
  {
    name: "学堂",
    calc: ({ dayStem }) => ({ 甲: ["亥"], 乙: ["午"], 丙: ["寅"], 丁: ["酉"], 戊: ["寅"], 己: ["酉"], 庚: ["巳"], 辛: ["子"], 壬: ["申"], 癸: ["卯"] })[dayStem],
    note: "利学习传承，适合把经验系统化。"
  },
  {
    name: "天厨贵人",
    calc: ({ dayStem }) => ({ 甲: ["巳"], 乙: ["午"], 丙: ["巳"], 丁: ["午"], 戊: ["申"], 己: ["酉"], 庚: ["亥"], 辛: ["子"], 壬: ["寅"], 癸: ["卯"] })[dayStem],
    note: "与饮食、口福、照料和生活品味有关。"
  },
  {
    name: "禄神",
    calc: ({ dayStem }) => ({ 甲: ["寅"], 乙: ["卯"], 丙: ["巳"], 丁: ["午"], 戊: ["巳"], 己: ["午"], 庚: ["申"], 辛: ["酉"], 壬: ["亥"], 癸: ["子"] })[dayStem],
    note: "象征根基与资源，做事宜稳扎稳打。"
  },
  {
    name: "羊刃",
    calc: ({ dayStem }) => ({ 甲: ["卯"], 乙: ["寅"], 丙: ["午"], 丁: ["巳"], 戊: ["午"], 己: ["巳"], 庚: ["酉"], 辛: ["申"], 壬: ["子"], 癸: ["亥"] })[dayStem],
    note: "行动力强，也要留意急躁和硬碰硬。"
  },
  {
    name: "金舆",
    calc: ({ dayStem }) => ({ 甲: ["辰"], 乙: ["巳"], 丙: ["未"], 丁: ["申"], 戊: ["未"], 己: ["申"], 庚: ["戌"], 辛: ["亥"], 壬: ["丑"], 癸: ["寅"] })[dayStem],
    note: "重体面、承载与资源配置，利稳健积累。"
  },
  {
    name: "桃花",
    calc: ({ dayBranch }) => branchByGroup(dayBranch, { "申子辰": "酉", "寅午戌": "卯", "亥卯未": "子", "巳酉丑": "午" }),
    note: "人缘与审美较显，宜把吸引力用在沟通和作品上。"
  },
  {
    name: "红鸾",
    calc: ({ yearBranch }) => ({ 子: ["卯"], 丑: ["寅"], 寅: ["丑"], 卯: ["子"], 辰: ["亥"], 巳: ["戌"], 午: ["酉"], 未: ["申"], 申: ["未"], 酉: ["午"], 戌: ["巳"], 亥: ["辰"] })[yearBranch],
    note: "主喜庆、人缘与情感机缘，宜自然经营关系。"
  },
  {
    name: "天喜",
    calc: ({ yearBranch }) => ({ 子: ["酉"], 丑: ["申"], 寅: ["未"], 卯: ["午"], 辰: ["巳"], 巳: ["辰"], 午: ["卯"], 未: ["寅"], 申: ["丑"], 酉: ["子"], 戌: ["亥"], 亥: ["戌"] })[yearBranch],
    note: "有喜事与社交热度之象，利庆典、合作与公开表达。"
  },
  {
    name: "驿马",
    calc: ({ dayBranch }) => branchByGroup(dayBranch, { "申子辰": "寅", "寅午戌": "申", "亥卯未": "巳", "巳酉丑": "亥" }),
    note: "动象明显，利迁动、出差、跨领域发展。"
  },
  {
    name: "华盖",
    calc: ({ dayBranch }) => branchByGroup(dayBranch, { "申子辰": "辰", "寅午戌": "戌", "亥卯未": "未", "巳酉丑": "丑" }),
    note: "适合专研技艺，也需避免过度孤高。"
  },
  {
    name: "将星",
    calc: ({ dayBranch }) => branchByGroup(dayBranch, { "申子辰": "子", "寅午戌": "午", "亥卯未": "卯", "巳酉丑": "酉" }),
    note: "有掌控与组织意识，适合承担明确职责。"
  },
  {
    name: "亡神",
    calc: ({ dayBranch }) => branchByGroup(dayBranch, { "申子辰": "亥", "寅午戌": "巳", "亥卯未": "寅", "巳酉丑": "申" }),
    note: "思虑深、敏感度高，宜避免内耗与暗处用力。"
  },
  {
    name: "劫煞",
    calc: ({ dayBranch }) => branchByGroup(dayBranch, { "申子辰": "巳", "寅午戌": "亥", "亥卯未": "申", "巳酉丑": "寅" }),
    note: "有竞争与突发之象，宜谨慎处理冲动决策。"
  },
  {
    name: "灾煞",
    calc: ({ dayBranch }) => branchByGroup(dayBranch, { "申子辰": "午", "寅午戌": "子", "亥卯未": "酉", "巳酉丑": "卯" }),
    note: "提醒规避风险，凡事留余地、重流程。"
  },
  {
    name: "孤辰",
    calc: ({ yearBranch }) => branchByGroup(yearBranch, { "亥子丑": "寅", "寅卯辰": "巳", "巳午未": "申", "申酉戌": "亥" }),
    note: "独立性强，宜把独处转化为专注。"
  },
  {
    name: "寡宿",
    calc: ({ yearBranch }) => branchByGroup(yearBranch, { "亥子丑": "戌", "寅卯辰": "丑", "巳午未": "辰", "申酉戌": "未" }),
    note: "情感表达偏收敛，关系中宜多沟通。"
  },
  {
    name: "天医",
    calc: ({ monthBranch }) => {
      const index = BRANCHES.indexOf(monthBranch);
      return [BRANCHES[mod(index - 1, 12)]];
    },
    note: "与疗愈、照护、健康意识有关。"
  },
  {
    name: "空亡",
    calc: ({ dayCycleIndex }) => {
      const groups = [["戌", "亥"], ["申", "酉"], ["午", "未"], ["辰", "巳"], ["寅", "卯"], ["子", "丑"]];
      return groups[Math.floor(dayCycleIndex / 10)];
    },
    note: "象征虚位与落空感，宜看具体组合，不可孤立论断。"
  }
];

function branchByGroup(branch, map) {
  const found = Object.entries(map).find(([group]) => group.includes(branch));
  return found ? [found[1]] : [];
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function getPillar(stemIndex, branchIndex) {
  return {
    stem: STEMS[mod(stemIndex, 10)],
    branch: BRANCHES[mod(branchIndex, 12)],
    label: `${STEMS[mod(stemIndex, 10)]}${BRANCHES[mod(branchIndex, 12)]}`
  };
}

function shiftPillar(pillar, offset) {
  const index = getCycleIndex(pillar.stem, pillar.branch);
  return getPillar(index + offset, index + offset);
}

function julianDayNumber(y, m, d) {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

function parseBirth(dateValue, timeValue) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hour, minute] = timeValue.split(":").map(Number);
  return { year, month, day, hour, minute };
}

function getBaziYear({ year, month, day }) {
  const beforeLiChun = month < 2 || (month === 2 && day < 4);
  return beforeLiChun ? year - 1 : year;
}

function getYearPillar(baziYear) {
  return getPillar(baziYear - 4, baziYear - 4);
}

function getSolarMonthIndex({ month, day }) {
  if (month === 1) return day >= 6 ? 11 : 10;
  let active = 11;
  for (let i = 0; i < SOLAR_MONTHS.length - 1; i += 1) {
    const item = SOLAR_MONTHS[i];
    if (month > item.m || (month === item.m && day >= item.d)) active = i;
  }
  return active;
}

function getMonthPillar(birth, yearStem) {
  const solarIndex = getSolarMonthIndex(birth);
  const monthBranchesFromYin = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"];
  const branch = monthBranchesFromYin[solarIndex];
  const stemIndex = MONTH_START_STEM[yearStem] + solarIndex;
  return { ...getPillar(stemIndex, BRANCHES.indexOf(branch)), solarIndex };
}

function getDayPillar({ year, month, day, hour }) {
  let y = year;
  let m = month;
  let d = day;
  if (hour >= 23) {
    const next = new Date(year, month - 1, day + 1);
    y = next.getFullYear();
    m = next.getMonth() + 1;
    d = next.getDate();
  }
  const index = mod(julianDayNumber(y, m, d) + 49, 60);
  return getPillar(index, index);
}

function getHourPillar({ hour }, dayStem) {
  const branchIndex = Math.floor((hour + 1) / 2) % 12;
  return getPillar(HOUR_START_STEM[dayStem] + branchIndex, branchIndex);
}

function buildChart(birth) {
  const baziYear = getBaziYear(birth);
  const year = getYearPillar(baziYear);
  const month = getMonthPillar(birth, year.stem);
  const day = getDayPillar(birth);
  const hour = getHourPillar(birth, day.stem);
  const pillars = { year, month, day, hour };
  const branches = Object.values(pillars).map((p) => p.branch);
  const stems = Object.values(pillars).map((p) => p.stem);
  const elements = countElements(stems, branches);
  const shenSha = findShenSha({ pillars, stems, branches });
  return { baziYear, pillars, stems, branches, elements, shenSha };
}

function countElements(stems, branches) {
  const counts = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  stems.forEach((stem) => counts[ELEMENT_OF_STEM[stem]] += 1);
  branches.forEach((branch) => counts[ELEMENT_OF_BRANCH[branch]] += 1.2);
  return counts;
}

function findShenSha({ pillars, branches }) {
  const stems = Object.values(pillars).map((p) => p.stem);
  const context = {
    yearBranch: pillars.year.branch,
    monthBranch: pillars.month.branch,
    dayStem: pillars.day.stem,
    dayBranch: pillars.day.branch,
    dayCycleIndex: getCycleIndex(pillars.day.stem, pillars.day.branch)
  };
  return SHEN_SHA.map((item) => {
    const targets = normalizeTargets(item.calc(context));
    const hitDetails = [
      ...stems.flatMap((stem, index) => targets.stems.includes(stem) ? [{ pillar: PILLAR_NAMES[index], part: "干" }] : []),
      ...branches.flatMap((branch, index) => targets.branches.includes(branch) ? [{ pillar: PILLAR_NAMES[index], part: "支" }] : [])
    ];
    const hits = hitDetails.map((hit) => `${hit.pillar}${hit.part}`);
    return { ...item, targets, hits, hitDetails, present: hits.length > 0 };
  });
}

function normalizeTargets(value) {
  if (!value) return { stems: [], branches: [] };
  if (Array.isArray(value)) return { stems: [], branches: value };
  return {
    stems: value.stems || [],
    branches: value.branches || []
  };
}

function getCycleIndex(stem, branch) {
  for (let i = 0; i < 60; i += 1) {
    if (STEMS[i % 10] === stem && BRANCHES[i % 12] === branch) return i;
  }
  return 0;
}

function getChartMeta(chart) {
  const dayElement = ELEMENT_OF_STEM[chart.pillars.day.stem];
  const mother = Object.entries(GENERATES).find(([, child]) => child === dayElement)?.[0];
  const child = GENERATES[dayElement];
  const wealth = CONTROLS[dayElement];
  const officer = Object.entries(CONTROLS).find(([, controlled]) => controlled === dayElement)?.[0];
  const same = chart.elements[dayElement];
  const support = same + (chart.elements[mother] || 0);
  const drain = (chart.elements[child] || 0) + (chart.elements[wealth] || 0) + (chart.elements[officer] || 0);
  const strength = support >= drain ? "偏旺" : "偏弱";
  const sorted = Object.entries(chart.elements).sort((a, b) => b[1] - a[1]);
  const top = sorted[0][0];
  const low = sorted[sorted.length - 1][0];
  const useful = strength === "偏旺" ? [child, wealth, officer] : [mother, dayElement];
  return { dayElement, mother, child, wealth, officer, strength, sorted, top, low, useful };
}

function analyze(chart, profile, fortune) {
  const meta = getChartMeta(chart);
  const presentShen = chart.shenSha.filter((item) => item.present);
  const shen = presentShen.map((s) => s.name).join("、") || "神煞不显";
  const placeText = profile.place ? `，出生地 ${profile.place}` : "";

  return [
    {
      title: "命局总览",
      paragraphs: [
        `${profile.name}，${profile.gender}${placeText}。日主为${chart.pillars.day.stem}${meta.dayElement}，命局五行以${meta.top}较显，${meta.low}相对不足，整体日主判断为${meta.strength}。`,
        `五行排序为${meta.sorted.map(([element, value]) => `${element}${value.toFixed(1)}`).join("、")}。${meta.top}偏显，容易成为外在表现和事件主题；${meta.low}偏弱，代表相关能力或资源需要后天经营。`,
        meta.strength === "偏旺"
          ? `日主偏旺时，宜用${meta.useful.join("、")}来疏泄、成事和落地。具体做法是把精力放在输出、执行、合作和结果承载上，避免只凭主观意气硬推。`
          : `日主偏弱时，宜用${meta.useful.join("、")}来扶身、蓄能和稳住根基。具体做法是先补方法、资质、人脉与长期节奏，再逐步扩大承担范围。`
      ]
    },
    {
      title: "神煞落柱",
      paragraphs: [
        `本盘命中神煞为${shen}。神煞不是单独断吉凶的按钮，要看它落在哪一柱：年柱看外缘与早年，月柱看成长环境和事业根基，日柱看自身与亲密关系，时柱看志向、作品、子女和晚景。`,
        ...buildPillarShenInsights(chart)
      ]
    },
    {
      title: "大运流年提要",
      paragraphs: buildFortuneInsights(chart, fortune, meta)
    }
  ];
}

function buildPillarShenInsights(chart) {
  return PILLAR_NAMES.map((pillarName) => {
    const items = chart.shenSha
      .filter((item) => item.hitDetails.some((hit) => hit.pillar === pillarName))
      .map((item) => {
        const hitParts = item.hitDetails
          .filter((hit) => hit.pillar === pillarName)
          .map((hit) => hit.part)
          .join("、");
        return { ...item, hitParts };
      });
    if (!items.length) return `${pillarName}柱（${PILLAR_MEANINGS[pillarName]}）未见主要神煞，解读时以干支五行为主。`;
    const detail = items.map((item) => `${item.name}落${hitPartsText(item.hitParts)}，${trimEndingPunctuation(item.note)}`).join("；");
    return `${pillarName}柱（${PILLAR_MEANINGS[pillarName]}）见${items.map((item) => item.name).join("、")}。${detail}。这一柱被触发时，相关人事与阶段主题会更明显。`;
  });
}

function trimEndingPunctuation(text) {
  return text.replace(/[。；;]+$/g, "");
}

function hitPartsText(parts) {
  if (!parts) return "该柱";
  const readable = parts.replaceAll("干", "天干").replaceAll("支", "地支");
  return readable.includes("、") ? `该柱${readable}` : `${readable}位`;
}

function buildFortuneInsights(chart, fortune, meta) {
  const current = fortune.currentLuck;
  const firstYears = fortune.annuals.slice(0, 4)
    .map((item) => `${item.year}${item.pillar.label}（${describePillarRelation(item.pillar, chart, meta)}）`)
    .join("；");
  const currentText = current
    ? `当前约在${current.startAgeText}至${current.endAgeText}的${current.pillar.label}大运，${describePillarRelation(current.pillar, chart, meta)}`
    : `当前尚未正式入第一步大运，仍以原局月柱气势为主，起运约在${fortune.startAgeText}。`;
  return [
    `${fortune.directionText}，起运约${fortune.startAgeText}，按十年一步排列。${currentText}`,
    `大运像十年的底色，流年像当年的触发器。近年可重点看：${firstYears}`,
    `若流年或大运出现参考喜用${meta.useful.join("、")}，通常更利主动布局；若反复触发命局偏旺或偏弱的一端，则宜先守节奏、补短板，再求突破。`
  ];
}

function buildFortune(birth, profile, chart) {
  const yearStemIsYang = YANG_STEMS.includes(chart.pillars.year.stem);
  const forward = profile.gender === "男" ? yearStemIsYang : profile.gender === "女" ? !yearStemIsYang : yearStemIsYang;
  const direction = forward ? 1 : -1;
  const start = getStartLuck(birth, forward);
  const today = new Date();
  const currentAge = getAge(birth, today);
  const lucks = Array.from({ length: 8 }, (_, index) => {
    const pillar = shiftPillar(chart.pillars.month, direction * (index + 1));
    const startAge = start.age + index * 10;
    const endAge = startAge + 10;
    const startYear = Math.max(1, Math.floor(birth.year + startAge));
    return {
      index,
      pillar,
      startAge,
      endAge,
      startAgeText: formatAge(startAge),
      endAgeText: formatAge(endAge),
      annuals: Array.from({ length: 10 }, (_, yearOffset) => buildAnnual(startYear + yearOffset))
    };
  });
  const currentLuck = lucks.find((luck) => currentAge >= luck.startAge && currentAge < luck.endAge) || null;
  const currentYear = today.getFullYear();
  const annuals = Array.from({ length: 6 }, (_, index) => {
    const year = currentYear + index;
    return buildAnnual(year);
  });
  const currentAnnual = buildAnnual(currentYear);
  return {
    forward,
    directionText: forward ? "大运顺排" : "大运逆排",
    startAgeText: formatAge(start.age),
    currentAge,
    currentLuck,
    currentAnnual,
    lucks,
    annuals
  };
}

function buildAnnual(year) {
  const pillar = getYearPillar(year);
  return {
    year,
    key: String(year),
    pillar,
    months: buildAnnualMonths(year, pillar.stem)
  };
}

function buildAnnualMonths(year, yearStem) {
  const monthBranchesFromYin = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"];
  const startStem = MONTH_START_STEM[yearStem];
  return monthBranchesFromYin.map((branch, index) => {
    const term = SOLAR_MONTHS[index];
    return {
      index,
      label: `${term.m}月${term.d}日后`,
      pillar: getPillar(startStem + index, BRANCHES.indexOf(branch)),
      branch
    };
  });
}

function getStartLuck(birth, forward) {
  const born = new Date(birth.year, birth.month - 1, birth.day, birth.hour, birth.minute || 0);
  const terms = [birth.year - 1, birth.year, birth.year + 1]
    .flatMap((year) => SOLAR_MONTHS.map((item) => ({ date: new Date(year, item.m - 1, item.d, 0, 0), branch: item.branch })))
    .sort((a, b) => a.date - b.date);
  const target = forward
    ? terms.find((item) => item.date > born)
    : terms.filter((item) => item.date < born).pop();
  const days = Math.max(1, Math.abs(target.date - born) / 86400000);
  return { age: days / 3 };
}

function getAge(birth, today) {
  let age = today.getFullYear() - birth.year;
  const birthdayThisYear = new Date(today.getFullYear(), birth.month - 1, birth.day);
  if (today < birthdayThisYear) age -= 1;
  const lastBirthdayYear = today < birthdayThisYear ? today.getFullYear() - 1 : today.getFullYear();
  const lastBirthday = new Date(lastBirthdayYear, birth.month - 1, birth.day);
  const nextBirthday = new Date(lastBirthdayYear + 1, birth.month - 1, birth.day);
  const fraction = (today - lastBirthday) / (nextBirthday - lastBirthday);
  return Math.max(0, age + fraction);
}

function formatAge(age) {
  const years = Math.floor(age);
  const months = Math.round((age - years) * 12);
  if (years <= 0) return `${Math.max(1, months)}个月`;
  if (months === 0 || months === 12) return `${years + (months === 12 ? 1 : 0)}岁`;
  return `${years}岁${months}个月`;
}

function relationToDay(dayElement, incomingElement) {
  if (incomingElement === dayElement) return "比劫";
  if (GENERATES[incomingElement] === dayElement) return "印星";
  if (GENERATES[dayElement] === incomingElement) return "食伤";
  if (CONTROLS[dayElement] === incomingElement) return "财星";
  if (CONTROLS[incomingElement] === dayElement) return "官杀";
  return "平气";
}

function describePillarRelation(pillar, chart, meta = getChartMeta(chart)) {
  const stemElement = ELEMENT_OF_STEM[pillar.stem];
  const branchElement = ELEMENT_OF_BRANCH[pillar.branch];
  const stemRole = relationToDay(meta.dayElement, stemElement);
  const branchRole = relationToDay(meta.dayElement, branchElement);
  const usefulHit = [stemElement, branchElement].filter((element) => meta.useful.includes(element));
  const usefulText = usefulHit.length
    ? `其中${[...new Set(usefulHit)].join("、")}与参考喜用相合，宜主动把握。`
    : `与参考喜用不算贴合，行事宜稳，先控节奏与风险。`;
  return `天干为${stemRole}、地支为${branchRole}，${usefulText}`;
}

function calculateScores(chart, fortune) {
  const meta = getChartMeta(chart);
  const names = new Set(chart.shenSha.filter((item) => item.present).map((item) => item.name));
  const has = (...items) => items.some((item) => names.has(item));
  const currentLuckElements = fortune.currentLuck
    ? [ELEMENT_OF_STEM[fortune.currentLuck.pillar.stem], ELEMENT_OF_BRANCH[fortune.currentLuck.pillar.branch]]
    : [];
  const currentAnnualElements = fortune.currentAnnual
    ? [ELEMENT_OF_STEM[fortune.currentAnnual.pillar.stem], ELEMENT_OF_BRANCH[fortune.currentAnnual.pillar.branch]]
    : [];
  const currentElements = [...currentLuckElements, ...currentAnnualElements];
  const currentRoles = currentElements.map((element) => relationToDay(meta.dayElement, element));
  const values = Object.values(chart.elements);
  const spread = Math.max(...values) - Math.min(...values);
  const balanceBonus = clamp(Math.round(12 - spread * 3), 0, 12);
  const luckUsefulBonus = currentLuckElements.some((element) => meta.useful.includes(element)) ? 5 : 0;
  const annualUsefulBonus = currentAnnualElements.some((element) => meta.useful.includes(element)) ? 6 : 0;
  const annualTone = fortune.currentAnnual ? "今年" : "当前阶段";

  const romance = clamp(
    52 +
    (has("桃花") ? 18 : 0) +
    (has("红鸾") ? 12 : 0) +
    (has("天喜") ? 10 : 0) +
    (has("文昌贵人") ? 4 : 0) -
    (has("孤辰") ? 7 : 0) -
    (has("寡宿") ? 7 : 0) +
    topicPillarScore("romance", fortune.currentAnnual?.pillar, chart, meta),
    35,
    96
  );

  const career = clamp(
    56 +
    (has("将星") ? 12 : 0) +
    (has("文昌贵人") ? 10 : 0) +
    (has("国印贵人") ? 9 : 0) +
    (has("天乙贵人", "天德贵人", "月德贵人") ? 7 : 0) +
    (currentRoles.includes("官杀") || currentRoles.includes("印星") ? 8 : 0) +
    luckUsefulBonus +
    annualUsefulBonus +
    topicPillarScore("career", fortune.currentAnnual?.pillar, chart, meta) -
    (has("空亡") ? 4 : 0),
    35,
    98
  );

  const wealth = clamp(
    54 +
    (has("禄神") ? 12 : 0) +
    (has("金舆") ? 10 : 0) +
    (has("天厨贵人") ? 5 : 0) +
    (currentRoles.includes("财星") ? 12 : 0) +
    (chart.elements[meta.wealth] >= 2.2 ? 6 : 0) +
    luckUsefulBonus +
    annualUsefulBonus +
    topicPillarScore("wealth", fortune.currentAnnual?.pillar, chart, meta) -
    (has("劫煞") ? 6 : 0),
    32,
    96
  );

  const health = clamp(
    58 +
    balanceBonus +
    (has("天医") ? 12 : 0) +
    (has("天德贵人", "月德贵人") ? 7 : 0) -
    (has("羊刃") ? 7 : 0) -
    (has("灾煞") ? 8 : 0) -
    (has("劫煞") ? 5 : 0) -
    (spread > 3 ? 6 : 0) +
    topicPillarScore("health", fortune.currentAnnual?.pillar, chart, meta),
    30,
    95
  );

  const scoreMap = {
    career: {
      key: "career",
      label: "事业",
      score: career,
      text: scoreText(career, `${annualTone}${has("将星", "文昌贵人", "国印贵人") ? "事业侧重组织、表达与专业背书" : "事业更依赖长期积累和阶段选择"}`)
    },
    health: {
      key: "health",
      label: "健康",
      score: health,
      text: scoreText(health, `${annualTone}${has("天医") ? "有天医照护象，重在规律养护" : "五行偏差处是调养重点"}`)
    },
    romance: {
      key: "romance",
      label: "桃花",
      score: romance,
      text: scoreText(romance, `${annualTone}${has("桃花", "红鸾", "天喜") ? "人缘与情感触发点较明显" : "感情缘分以经营和主动表达为主"}`)
    },
    wealth: {
      key: "wealth",
      label: "财运",
      score: wealth,
      text: scoreText(wealth, `${annualTone}${currentRoles.includes("财星") ? "运势带财星，适合关注资源转化" : "财运宜从能力、稳定收入和风险控制入手"}`)
    }
  };
  return TOPIC_ORDER.map((key) => scoreMap[key]);
}

function topicPillarScore(topic, pillar, chart, meta = getChartMeta(chart)) {
  if (!pillar) return 0;
  const roles = [
    relationToDay(meta.dayElement, ELEMENT_OF_STEM[pillar.stem]),
    relationToDay(meta.dayElement, ELEMENT_OF_BRANCH[pillar.branch])
  ];
  const usefulHit = [ELEMENT_OF_STEM[pillar.stem], ELEMENT_OF_BRANCH[pillar.branch]]
    .some((element) => meta.useful.includes(element));
  const roleScore = {
    career: { 官杀: 10, 印星: 8, 食伤: 5, 财星: 4, 比劫: 2 },
    health: { 印星: 8, 比劫: 5, 食伤: 2, 财星: -3, 官杀: -5 },
    romance: { 财星: 8, 官杀: 8, 食伤: 5, 比劫: 1, 印星: -2 },
    wealth: { 财星: 12, 食伤: 7, 官杀: 3, 印星: -2, 比劫: -5 }
  }[topic];
  return roles.reduce((sum, role) => sum + (roleScore[role] || 0), 0) + (usefulHit ? 4 : -2);
}

function scoreText(score, text) {
  if (score >= 82) return `${text}，整体较强。`;
  if (score >= 68) return `${text}，整体中上。`;
  if (score >= 55) return `${text}，整体平稳。`;
  return `${text}，需要后天补足。`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function renderPillars(pillars) {
  const labels = [
    ["year", "年柱", "祖上 / 早年"],
    ["month", "月柱", "环境 / 青年"],
    ["day", "日柱", "日主 / 自我"],
    ["hour", "时柱", "志向 / 晚景"]
  ];
  document.querySelector("#pillarGrid").innerHTML = labels.map(([key, title, foot]) => {
    const p = pillars[key];
    return `
      <article class="pillar-card">
        <span>${title}</span>
        <strong>${p.label}</strong>
        <em>${ELEMENT_OF_STEM[p.stem]}干 · ${ELEMENT_OF_BRANCH[p.branch]}支</em>
        <small>${foot}</small>
      </article>
    `;
  }).join("");
}

function renderElements(elements) {
  const max = Math.max(...Object.values(elements), 1);
  document.querySelector("#elementBars").innerHTML = Object.entries(elements).map(([element, value]) => {
    const width = Math.max(8, Math.round((value / max) * 100));
    return `
      <div class="bar-row">
        <span>${element}</span>
        <div class="track"><div class="fill" style="--w:${width}%;--c:${ELEMENT_COLORS[element]}"></div></div>
        <strong>${value.toFixed(1)}</strong>
      </div>
    `;
  }).join("");
}

function renderScores(scores) {
  document.querySelector("#scorePanel").innerHTML = scores.map((item) => `
    <article class="score-card score-${item.key} ${item.key === appState.selectedTopic ? "is-active" : ""}" data-topic="${item.key}" tabindex="0">
      <div class="score-ring" style="--score:${item.score * 3.6}deg">
        <strong>${item.score}</strong>
        <span>分</span>
      </div>
      <div>
        <h3>${item.label}</h3>
        <p>${escapeHtml(item.text)}</p>
      </div>
    </article>
  `).join("");
}

function renderShenSha(items) {
  const list = document.querySelector("#shenShaList");
  const presentItems = items.filter((item) => item.present);
  if (!presentItems.length) {
    list.innerHTML = `<span class="muted">本盘未见当前系统收录的主要神煞。</span>`;
    return;
  }
  list.innerHTML = presentItems.map((item) => {
    const targetText = [
      item.targets.stems.length ? `天干${item.targets.stems.join("/")}` : "",
      item.targets.branches.length ? `地支${item.targets.branches.join("/")}` : ""
    ].filter(Boolean).join(" · ");
    const hitText = item.present ? item.hits.join("、") : "未见";
    return `
      <article class="shen-item is-present">
        <div>
          <strong>${item.name}</strong>
          <span>${hitText}</span>
        </div>
        <p>${targetText || "依命局组合判定"}。${item.note}</p>
      </article>
    `;
  }).join("");
}

function renderAnalysis(sections) {
  document.querySelector("#analysisText").innerHTML = sections.map((section) => `
    <section class="analysis-section">
      <h3>${escapeHtml(section.title)}</h3>
      ${section.paragraphs.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
    </section>
  `).join("");
}

function renderFortune(fortune, chart) {
  const meta = getChartMeta(chart);
  const topic = appState.selectedTopic;
  const topicLabel = TOPICS[topic].label;
  const currentLuckLabel = fortune.currentLuck ? `${fortune.currentLuck.pillar.label}大运` : "未入大运";
  document.querySelector("#fortunePanel").innerHTML = `
    <div class="fortune-summary">
      <div>
        <span>起运</span>
        <strong>${fortune.startAgeText}</strong>
      </div>
      <div>
        <span>排法</span>
        <strong>${fortune.directionText}</strong>
      </div>
      <div>
        <span>当前</span>
        <strong>${currentLuckLabel}</strong>
      </div>
    </div>
    <h3 class="subhead">${topicLabel}大运</h3>
    <div class="luck-grid">
      ${fortune.lucks.map((luck) => renderLuckCard(luck, chart, meta, topic, fortune)).join("")}
    </div>
    <h3 class="subhead">近年${topicLabel}流年</h3>
    <div class="annual-grid">
      ${fortune.annuals.map((annual) => `
        <article class="annual-card">
          <button class="card-button" type="button">
            <span>${annual.year}</span>
            <strong>${annual.pillar.label}</strong>
            <p>${topicPillarText(topic, annual.pillar, chart, meta, `${annual.year}流年`)}</p>
          </button>
        </article>
      `).join("")}
    </div>
  `;
}

function renderLuckCard(luck, chart, meta, topic, fortune) {
  const expanded = appState.expandedLuck === luck.index;
  const currentClass = luck === fortune.currentLuck ? "is-current" : "";
  return `
    <article class="luck-card ${currentClass} ${expanded ? "is-expanded" : ""}">
      <button class="card-button luck-toggle" type="button" data-luck="${luck.index}" aria-expanded="${expanded}">
        <span>${luck.startAgeText} - ${luck.endAgeText}</span>
        <strong>${luck.pillar.label}</strong>
        <p>${topicPillarText(topic, luck.pillar, chart, meta, "大运")}</p>
        <em>${expanded ? "收起流年" : "查看流年"}</em>
      </button>
    </article>
    ${expanded ? renderLuckDetail(luck, chart, meta, topic) : ""}
  `;
}

function renderLuckDetail(luck, chart, meta, topic) {
  return `
    <section class="luck-detail">
      <h4>${luck.pillar.label}大运 · ${TOPICS[topic].label}流年</h4>
      <p>${topicPillarText(topic, luck.pillar, chart, meta, `${luck.startAgeText}至${luck.endAgeText}`)}</p>
      <div class="annual-grid annual-grid-detail">
        ${luck.annuals.map((annual) => {
          const annualKey = `${luck.index}-${annual.year}`;
          const expanded = appState.expandedAnnual === annualKey;
          return `
            <article class="annual-card ${expanded ? "is-expanded" : ""}">
              <button class="card-button annual-toggle" type="button" data-luck="${luck.index}" data-annual="${annualKey}" aria-expanded="${expanded}">
                <span>${annual.year}</span>
                <strong>${annual.pillar.label}</strong>
                <p>${topicPillarText(topic, annual.pillar, chart, meta, `${annual.year}流年`)}</p>
                <em>${expanded ? "收起流月" : "查看流月"}</em>
              </button>
            </article>
            ${expanded ? renderAnnualDetail(annual, chart, meta, topic) : ""}
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderAnnualDetail(annual, chart, meta, topic) {
  return `
    <section class="annual-detail">
      <h4>${annual.year}${annual.pillar.label} · ${TOPICS[topic].label}流月</h4>
      <div class="month-grid">
        ${annual.months.map((month) => `
          <article class="month-card">
            <span>${month.label}</span>
            <strong>${month.pillar.label}</strong>
            <p>${topicPillarText(topic, month.pillar, chart, meta, "流月")}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function topicPillarText(topic, pillar, chart, meta = getChartMeta(chart), scope = "阶段") {
  const relation = describePillarRelation(pillar, chart, meta);
  const score = topicPillarScore(topic, pillar, chart, meta);
  const trend = score >= 16 ? "助力明显" : score >= 8 ? "有可用之机" : score >= 0 ? "平稳观察" : "需谨慎经营";
  const advice = {
    career: {
      high: "适合争取职责、考试评审、项目推进和专业曝光。",
      mid: "适合梳理流程、累积作品、稳住合作关系。",
      low: "事业上先稳边界，少做情绪化承诺，重要决定多复核。"
    },
    health: {
      high: "有利恢复秩序，适合建立作息、运动和复查计划。",
      mid: "健康重点在稳定节奏，少熬夜，饮食与压力管理要同步。",
      low: "要减少硬扛和过劳，避免急躁、碰撞、炎症或旧疾反复。"
    },
    romance: {
      high: "人缘与情感互动较活跃，适合主动表达、修复关系和拓展社交。",
      mid: "桃花以温和经营为主，慢热互动比强推进更合适。",
      low: "感情上宜少猜测、多沟通，避免把压力带进亲密关系。"
    },
    wealth: {
      high: "财务转化机会较清楚，适合谈资源、预算、回款和稳定增收。",
      mid: "财运重在执行和复盘，适合稳健配置与长期项目。",
      low: "不宜重仓冒进，借贷、合伙和冲动消费都要留余地。"
    }
  }[topic];
  const line = score >= 16 ? advice.high : score >= 4 ? advice.mid : advice.low;
  return `${scope}${trend}：${relation}${line}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function fillSample() {
  appState.activeRecordId = null;
  document.querySelector("#userName").value = "林清和";
  document.querySelector("#gender").value = "女";
  document.querySelector("#birthPlace").value = "香港";
  document.querySelector("#birthDate").value = "1994-08-18";
  document.querySelector("#birthTime").value = "09:28";
  renderRecordList();
}

function clearForm() {
  document.querySelector("#userName").value = "";
  document.querySelector("#gender").value = "男";
  document.querySelector("#birthPlace").value = "";
  document.querySelector("#birthDate").value = "";
  document.querySelector("#birthTime").value = "";
  appState.activeRecordId = null;
  appState.chart = null;
  appState.fortune = null;
  renderRecordList();
  resetResults();
  document.querySelector("#userName").focus();
}

function resetResults() {
  document.querySelector("#summaryTitle").textContent = "等待排盘";
  document.querySelector("#summaryText").textContent = "填写左侧资料后，这里会显示四柱与基础倾向。";
  document.querySelector("#pillarGrid").innerHTML = ["年柱", "月柱", "日柱", "时柱"].map((title) => `
    <article class="pillar-card empty">
      <span>${title}</span>
      <strong>--</strong>
      <small>待生成</small>
    </article>
  `).join("");
  document.querySelector("#scorePanel").innerHTML = `<p class="muted">排盘后显示桃花、事业、财运、健康评分。</p>`;
  document.querySelector("#elementBars").innerHTML = "";
  document.querySelector("#shenShaList").innerHTML = `<span class="muted">待生成</span>`;
  document.querySelector("#analysisText").innerHTML = `<p>排盘后将从日主、五行偏重、神煞意象三个角度给出简要分析。</p>`;
  document.querySelector("#fortunePanel").innerHTML = `<p class="muted">排盘后显示起运、当前大运与近年流年。</p>`;
}

function getFormPayload() {
  return {
    profile: {
      name: document.querySelector("#userName").value.trim(),
      gender: document.querySelector("#gender").value,
      place: document.querySelector("#birthPlace").value.trim()
    },
    birth: parseBirth(document.querySelector("#birthDate").value, document.querySelector("#birthTime").value),
    date: document.querySelector("#birthDate").value,
    time: document.querySelector("#birthTime").value
  };
}

function fillFormFromRecord(record) {
  document.querySelector("#userName").value = record.profile?.name || "";
  document.querySelector("#gender").value = record.profile?.gender || "男";
  document.querySelector("#birthPlace").value = record.profile?.place || "";
  document.querySelector("#birthDate").value = record.date || "";
  document.querySelector("#birthTime").value = record.time || "";
}

function loadRecords() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    appState.records = Array.isArray(parsed) ? parsed : [];
  } catch {
    appState.records = [];
  }
}

function persistRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState.records));
}

function saveCurrentRecord(profile, birth, chart) {
  const date = document.querySelector("#birthDate").value;
  const time = document.querySelector("#birthTime").value;
  const labels = Object.values(chart.pillars).map((p) => p.label).join(" · ");
  const now = new Date().toISOString();
  const base = {
    id: appState.activeRecordId || `record-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    profile,
    birth,
    date,
    time,
    summary: labels,
    updatedAt: now
  };
  const existingIndex = appState.records.findIndex((record) => record.id === base.id);
  if (existingIndex >= 0) appState.records[existingIndex] = base;
  else appState.records.unshift(base);
  appState.activeRecordId = base.id;
  appState.records.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  persistRecords();
  renderRecordList();
}

function renderRecordList() {
  const list = document.querySelector("#recordList");
  document.querySelector("#recordCount").textContent = `${appState.records.length}人`;
  if (!appState.records.length) {
    list.innerHTML = `<p class="muted">排盘后自动保存到这里。</p>`;
    return;
  }
  list.innerHTML = appState.records.map((record) => `
    <article class="record-item ${record.id === appState.activeRecordId ? "is-active" : ""}">
      <button class="record-load" type="button" data-record="${record.id}">
        <strong>${escapeHtml(record.profile?.name || "未命名")}</strong>
        <span>${escapeHtml(record.profile?.gender || "未填")} · ${escapeHtml(record.date || "未填日期")} ${escapeHtml(record.time || "")}${record.profile?.place ? ` · ${escapeHtml(record.profile.place)}` : ""}</span>
        <small>${escapeHtml(record.summary || "未生成四柱")}</small>
      </button>
      <button class="record-delete" type="button" data-delete-record="${record.id}" aria-label="删除${escapeHtml(record.profile?.name || "记录")}">×</button>
    </article>
  `).join("");
}

function activateRecord(recordId) {
  const record = appState.records.find((item) => item.id === recordId);
  if (!record) return;
  appState.activeRecordId = record.id;
  fillFormFromRecord(record);
  runAnalysis({ save: false });
  renderRecordList();
}

function deleteRecord(recordId) {
  appState.records = appState.records.filter((record) => record.id !== recordId);
  if (appState.activeRecordId === recordId) appState.activeRecordId = null;
  persistRecords();
  renderRecordList();
}

function runAnalysis({ save = true } = {}) {
  const { profile, birth } = getFormPayload();
  const chart = buildChart(birth);
  const fortune = buildFortune(birth, profile, chart);
  appState.profile = profile;
  appState.birth = birth;
  appState.chart = chart;
  appState.fortune = fortune;
  appState.expandedLuck = fortune.currentLuck ? fortune.currentLuck.index : 0;
  appState.expandedAnnual = fortune.currentLuck?.annuals.some((annual) => annual.year === fortune.currentAnnual.year)
    ? `${fortune.currentLuck.index}-${fortune.currentAnnual.year}`
    : null;
  const labels = Object.values(chart.pillars).map((p) => p.label).join(" · ");
  document.querySelector("#summaryTitle").textContent = `${profile.name || "命主"}：${labels}`;
  document.querySelector("#summaryText").textContent = `年柱${chart.pillars.year.label}，月柱${chart.pillars.month.label}，日柱${chart.pillars.day.label}，时柱${chart.pillars.hour.label}。日主为${chart.pillars.day.stem}${ELEMENT_OF_STEM[chart.pillars.day.stem]}。`;
  renderPillars(chart.pillars);
  renderElements(chart.elements);
  renderShenSha(chart.shenSha);
  renderAnalysis(analyze(chart, profile, fortune));
  renderDynamicPanels();
  if (save) saveCurrentRecord(profile, birth, chart);
}

document.querySelector("#sampleBtn").addEventListener("click", fillSample);

document.querySelector("#newRecordBtn").addEventListener("click", clearForm);

document.querySelector("#recordList").addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-record]");
  if (deleteButton) {
    deleteRecord(deleteButton.dataset.deleteRecord);
    return;
  }
  const loadButton = event.target.closest("[data-record]");
  if (loadButton) activateRecord(loadButton.dataset.record);
});

document.querySelector("#topicTabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-topic]");
  if (!button) return;
  setTopic(button.dataset.topic);
});

document.querySelector("#scorePanel").addEventListener("click", (event) => {
  const card = event.target.closest("[data-topic]");
  if (!card) return;
  setTopic(card.dataset.topic);
});

document.querySelector("#scorePanel").addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest("[data-topic]");
  if (!card) return;
  event.preventDefault();
  setTopic(card.dataset.topic);
});

document.querySelector("#fortunePanel").addEventListener("click", (event) => {
  const annualButton = event.target.closest("[data-annual]");
  if (annualButton && annualButton.dataset.annual.includes("-")) {
    appState.expandedAnnual = appState.expandedAnnual === annualButton.dataset.annual ? null : annualButton.dataset.annual;
    renderFortune(appState.fortune, appState.chart);
    return;
  }

  const luckButton = event.target.closest("[data-luck]");
  if (!luckButton || luckButton.dataset.luck === "recent") return;
  const nextLuck = Number(luckButton.dataset.luck);
  appState.expandedLuck = appState.expandedLuck === nextLuck ? null : nextLuck;
  appState.expandedAnnual = null;
  renderFortune(appState.fortune, appState.chart);
});

function setTopic(topic) {
  if (!TOPICS[topic] || !appState.chart || !appState.fortune) return;
  appState.selectedTopic = topic;
  renderDynamicPanels();
}

function renderDynamicPanels() {
  updateTopicTabs();
  renderScores(calculateScores(appState.chart, appState.fortune));
  renderFortune(appState.fortune, appState.chart);
}

function updateTopicTabs() {
  document.querySelectorAll("#topicTabs [data-topic]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.topic === appState.selectedTopic);
  });
}

document.querySelector("#birthForm").addEventListener("submit", (event) => {
  event.preventDefault();
  runAnalysis({ save: true });
});

loadRecords();
renderRecordList();
fillSample();
runAnalysis({ save: false });
