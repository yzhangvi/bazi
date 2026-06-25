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
  study: { label: "学业", scoreLabel: "学业", accent: "#8bb6d8" },
  health: { label: "健康", scoreLabel: "健康", accent: "#4f8c78" },
  romance: { label: "桃花", scoreLabel: "桃花", accent: "#d88a8a" },
  wealth: { label: "财运", scoreLabel: "财运", accent: "#bfb7a3" }
};
const TOPIC_ORDER = ["career", "study", "health", "romance", "wealth"];
const STORAGE_KEY = "bazi-site.records.v1";
const PLACES = {
  "hong-kong": { name: "香港", longitude: 114.17, standardMeridian: 120 },
  macau: { name: "澳门", longitude: 113.55, standardMeridian: 120 },
  taipei: { name: "台北", longitude: 121.56, standardMeridian: 120 },
  beijing: { name: "北京", longitude: 116.40, standardMeridian: 120 },
  shanghai: { name: "上海", longitude: 121.47, standardMeridian: 120 },
  guangzhou: { name: "广州", longitude: 113.26, standardMeridian: 120 },
  shenzhen: { name: "深圳", longitude: 114.06, standardMeridian: 120 },
  hangzhou: { name: "杭州", longitude: 120.16, standardMeridian: 120 },
  nanjing: { name: "南京", longitude: 118.80, standardMeridian: 120 },
  chengdu: { name: "成都", longitude: 104.07, standardMeridian: 120 },
  chongqing: { name: "重庆", longitude: 106.55, standardMeridian: 120 },
  wuhan: { name: "武汉", longitude: 114.31, standardMeridian: 120 },
  xian: { name: "西安", longitude: 108.94, standardMeridian: 120 },
  changsha: { name: "长沙", longitude: 112.94, standardMeridian: 120 },
  kunming: { name: "昆明", longitude: 102.83, standardMeridian: 120 },
  urumqi: { name: "乌鲁木齐", longitude: 87.62, standardMeridian: 120 },
  harbin: { name: "哈尔滨", longitude: 126.64, standardMeridian: 120 },
  shenyang: { name: "沈阳", longitude: 123.43, standardMeridian: 120 }
};
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
    name: "福星贵人",
    calc: ({ dayStem }) => ({
      甲: ["寅", "子"], 丙: ["寅", "子"], 戊: ["申"], 己: ["未"], 丁: ["亥"],
      乙: ["丑", "卯"], 癸: ["丑", "卯"], 庚: ["午"], 辛: ["巳"], 壬: ["辰"]
    })[dayStem],
    note: "有福气、口碑和生活顺遂之象，宜珍惜善缘与稳定资源。"
  },
  {
    name: "天官贵人",
    calc: ({ dayStem }) => ({ 甲: ["未"], 乙: ["辰"], 丙: ["巳"], 丁: ["酉"], 戊: ["戌"], 己: ["卯"], 庚: ["亥"], 辛: ["申"], 壬: ["寅"], 癸: ["午"] })[dayStem],
    note: "重职位、名誉、规则与被认可，适合走资质和组织路线。"
  },
  {
    name: "天福贵人",
    calc: ({ dayStem }) => ({ 甲: ["酉"], 乙: ["申"], 丙: ["子"], 丁: ["亥"], 戊: ["卯"], 己: ["寅"], 庚: ["午"], 辛: ["巳"], 壬: ["午"], 癸: ["巳"] })[dayStem],
    note: "主生活助力、长辈缘和贵人扶持，适合稳中求进。"
  },
  {
    name: "德秀贵人",
    calc: ({ monthBranch }) => {
      const stems = branchByGroup(monthBranch, { "寅午戌": "丙丁", "申子辰": "壬癸", "亥卯未": "甲乙", "巳酉丑": "庚辛" });
      return stemTargets(stems[0] ? stems[0].split("") : []);
    },
    note: "有才华、审美和修养之象，适合把专业做得精致。"
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
    name: "暗禄",
    calc: ({ dayStem }) => ({ 甲: ["亥"], 乙: ["戌"], 丙: ["申"], 丁: ["未"], 戊: ["申"], 己: ["未"], 庚: ["巳"], 辛: ["辰"], 壬: ["寅"], 癸: ["丑"] })[dayStem],
    note: "暗处有资源和机会，适合低调积累、长期经营。"
  },
  {
    name: "桃花",
    calc: ({ dayBranch }) => branchByGroup(dayBranch, { "申子辰": "酉", "寅午戌": "卯", "亥卯未": "子", "巳酉丑": "午" }),
    note: "人缘与审美较显，宜把吸引力用在沟通和作品上。"
  },
  {
    name: "红艳",
    calc: ({ dayStem }) => ({ 甲: ["午"], 乙: ["申"], 丙: ["寅"], 丁: ["未"], 戊: ["辰"], 己: ["辰"], 庚: ["戌"], 辛: ["酉"], 壬: ["子"], 癸: ["申"] })[dayStem],
    note: "个人魅力、异性缘和表现力较强，也要避免情感选择过急。"
  },
  {
    name: "流霞",
    calc: ({ dayStem }) => ({ 甲: ["酉"], 乙: ["戌"], 丙: ["未"], 丁: ["申"], 戊: ["巳"], 己: ["午"], 庚: ["辰"], 辛: ["卯"], 壬: ["亥"], 癸: ["寅"] })[dayStem],
    note: "情绪与人际波动较明显，感情和口舌事务宜谨慎。"
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
    name: "天罗地网",
    calc: () => ["辰", "戌"],
    note: "容易感到受限或压力缠绕，遇事宜拆解问题、慢慢推进。"
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

function parseBirth(dateValue, timeValue, placeKey = "hong-kong") {
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hour, minute] = timeValue.split(":").map(Number);
  const place = getPlace(placeKey);
  const correctionMinutes = Math.round((place.longitude - place.standardMeridian) * 4);
  const solarDate = new Date(year, month - 1, day, hour, minute + correctionMinutes);
  return {
    year: solarDate.getFullYear(),
    month: solarDate.getMonth() + 1,
    day: solarDate.getDate(),
    hour: solarDate.getHours(),
    minute: solarDate.getMinutes(),
    clockYear: year,
    clockMonth: month,
    clockDay: day,
    clockHour: hour,
    clockMinute: minute,
    placeKey,
    place,
    correctionMinutes
  };
}

function getPlace(placeKey) {
  return PLACES[placeKey] || PLACES["hong-kong"];
}

function formatClockTime(hour, minute) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function formatCorrection(minutes) {
  if (minutes === 0) return "无修正";
  const sign = minutes > 0 ? "加" : "减";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${sign}${h ? `${h}小时` : ""}${m ? `${m}分钟` : ""}`;
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
        ...buildPillarShenInsights(chart, fortune, meta)
      ]
    },
    {
      title: "大运流年提要",
      paragraphs: buildFortuneInsights(chart, fortune, meta)
    },
    {
      title: "正缘与关系",
      paragraphs: buildPartnerInsights(chart, profile, fortune, meta)
    },
    {
      title: "职业方向",
      paragraphs: buildCareerInsights(chart, fortune, meta)
    }
  ];
}

function buildPillarShenInsights(chart, fortune, meta = getChartMeta(chart)) {
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
    const pillar = chart.pillars[PILLAR_KEYS[PILLAR_NAMES.indexOf(pillarName)]];
    const stemRole = relationToDay(meta.dayElement, ELEMENT_OF_STEM[pillar.stem]);
    const branchRole = relationToDay(meta.dayElement, ELEMENT_OF_BRANCH[pillar.branch]);
    const pillarContext = `${pillarName}柱为${pillar.label}，天干${pillar.stem}属${ELEMENT_OF_STEM[pillar.stem]}、对日主是${stemRole}，地支${pillar.branch}属${ELEMENT_OF_BRANCH[pillar.branch]}、对日主是${branchRole}。`;
    if (!items.length) return `${pillarName}柱（${PILLAR_MEANINGS[pillarName]}）未见主要神煞。${pillarContext}${pillarNoShenAdvice(pillarName, [stemRole, branchRole], meta)}`;
    const detail = items
      .map((item) => `${item.name}落${hitPartsText(item.hitParts)}，${shenShaContextText(item, chart, meta, fortune, { pillarName, compact: true })}`)
      .join("；");
    return `${pillarName}柱（${PILLAR_MEANINGS[pillarName]}）见${items.map((item) => item.name).join("、")}。${pillarContext}${detail}`;
  });
}

function pillarNoShenAdvice(pillarName, roles, meta) {
  const roleText = [...new Set(roles)].map((role) => roleFocusText(role)).join("；");
  const stageText = {
    年: "外部环境和早年机会",
    月: "成长方式、专业根基和事业入口",
    日: "自我选择、亲密关系和日常决策",
    时: "长期目标、作品成果和后期发展"
  }[pillarName];
  return `${stageText}主要看十神和五行：${roleText}。命局${meta.strength}，此处宜围绕喜用${meta.useful.join("、")}来取舍。`;
}

function shenShaContextText(item, chart, meta = getChartMeta(chart), fortune = null, options = {}) {
  const hits = item.hitDetails.map((hit) => {
    const key = PILLAR_KEYS[PILLAR_NAMES.indexOf(hit.pillar)];
    const pillar = chart.pillars[key];
    const element = hit.part === "干" ? ELEMENT_OF_STEM[pillar.stem] : ELEMENT_OF_BRANCH[pillar.branch];
    const role = relationToDay(meta.dayElement, element);
    return { ...hit, pillarKey: key, pillar, element, role };
  });
  const hitPillars = [...new Set(hits.map((hit) => hit.pillar))];
  const roles = [...new Set(hits.map((hit) => hit.role))];
  const elements = [...new Set(hits.map((hit) => hit.element))];
  const usefulHits = elements.filter((element) => meta.useful.includes(element));
  const topHits = elements.filter((element) => element === meta.top);
  const lowHits = elements.filter((element) => element === meta.low);
  const stageText = hitPillars.map((pillar) => `${pillar}柱主${PILLAR_MEANINGS[pillar]}`).join("；");
  const roleText = roles.map((role) => roleFocusText(role)).join("；");
  const elementText = `落点五行为${elements.join("、")}，对${chart.pillars.day.stem}${meta.dayElement}日主表现为${roles.join("、")}。`;
  const usefulText = usefulHits.length
    ? `其中${[...new Set(usefulHits)].join("、")}属于此盘参考喜用，说明这个神煞的正面作用更容易被用出来。`
    : `它没有直接落在喜用${meta.useful.join("、")}上，发挥时更要靠现实计划和后天经营来承接。`;
  const balanceText = [
    topHits.length ? `同时触及命局偏重的${meta.top}，容易把原本的性格或事件主题放大，宜防过度。` : "",
    lowHits.length ? `也触及命局较弱的${meta.low}，提示这部分能力可以补，但需要慢慢养成。` : ""
  ].filter(Boolean).join("");
  const timingText = shenShaTimingText(item, fortune);
  const themeText = shenShaThemeText(item.name, hits, meta);
  const compactPrefix = options.compact ? "" : `${stageText}。${elementText}`;
  return `${compactPrefix}${themeText}${roleText ? `结合十神看，${roleText}。` : ""}${usefulText}${balanceText}${timingText}`;
}

function shenShaThemeText(name, hits, meta) {
  const hasBranch = hits.some((hit) => hit.part === "支");
  const hasStem = hits.some((hit) => hit.part === "干");
  const groundText = hasBranch ? "落在地支，重点不是表面声势，而是实际人事、环境和长期承接。" : "";
  const visibleText = hasStem ? "落在天干，表现会更外显，容易被别人看见或评价。" : "";
  const common = `${visibleText}${groundText}`;
  const textMap = {
    天乙贵人: "贵人不等于坐等帮助，本盘要把问题说清楚、把合作边界立住，助力才容易出现。",
    太极贵人: "悟性和抽象理解力较强，适合研究体系、技术、命理、哲学或需要耐心推演的内容。",
    天德贵人: "有缓和矛盾、逢凶化缓的倾向，但前提是行事守规矩、少走极端。",
    月德贵人: "人情缓冲和合作缘较好，越能保持温和可信，越容易得到回旋空间。",
    福星贵人: "生活助力和口碑缘较明显，适合把稳定资源经营成长期底盘。",
    天官贵人: "重名誉、职位和规则，适合通过制度、资质、头衔或专业身份获得认可。",
    天福贵人: "长辈缘、照拂和稳定资源较容易出现，适合稳中求进。",
    德秀贵人: "审美、修养和专业细节是优势，适合把能力打磨得精致、有作品感。",
    文昌贵人: "学习、表达、考试和文字策划是发力点，越系统输出越能见成果。",
    国印贵人: "适合走证书、制度、管理、公信力路线，重要文件和规则意识要做扎实。",
    学堂: "学习吸收和经验传承能力较好，适合建立自己的知识框架。",
    天厨贵人: "与饮食、照料、生活品质和服务体验有关，可转化为审美、照护或生活型资源。",
    禄神: "有根基和资源意识，适合稳扎稳打，不宜只追短期刺激。",
    羊刃: "行动力强，遇事敢冲，但也容易硬碰硬，要把力气放到训练、执行和边界管理上。",
    金舆: "重体面、承载和资源配置，适合稳健积累与提升生活品质。",
    暗禄: "资源常在暗处，不一定一开始就显现，适合低调积累、人脉维护和长期经营。",
    桃花: "人缘、审美和吸引力较明显，但要看是否能被夫妻宫和现实责任承接。",
    红艳: "个人魅力和情感吸引强，选择关系时要慢一点，避免被短期热度牵着走。",
    流霞: "情绪、人际口舌或感情波动较容易被放大，重要沟通宜留证据、少冲动。",
    红鸾: "喜庆与关系机会较容易出现，适合自然推进，不宜急着定性。",
    天喜: "社交热度和好消息较容易被触发，利公开表达、合作和喜事安排。",
    驿马: "动象明显，适合迁动、出差、跨城市或跨领域发展，但要先定好节奏。",
    华盖: "专注、审美和研究能力强，也容易显得孤高，适合把独处变成作品。",
    将星: "组织力和掌控意识较强，适合承担责任、带项目或做关键决策。",
    亡神: "心思深、敏感度高，适合研究和洞察，但要防过度内耗。",
    劫煞: "竞争、突发和抢夺感较强，投资、合伙、冲动决策要留余地。",
    灾煞: "风险提示较明显，流程、健康、安全和合规要比平时更重视。",
    孤辰: "独立性强，适合深度专注；关系里要主动表达需求，别让别人全靠猜。",
    寡宿: "情感表达偏收敛，容易慢热或保持距离，亲密关系需要更多沟通。",
    天医: "健康意识、照护能力和修复力较明显，适合规律养护或从事照护服务类事务。",
    天罗地网: "容易有被事务缠住、被规则限制的感觉，适合拆小问题、一步步处理。",
    空亡: `空亡落地支时，重点是“期待和现实承接之间有落差”，不是简单断坏。此盘日主${meta.strength}，要看它空在哪一柱、是否碰到喜用，以及有没有大运流年来填实；若落到喜用，常表现为想要的资源来得慢，需要靠计划补上；若落到忌性偏重处，反而能减轻一部分压力。`
  };
  return `${common}${textMap[name] || trimEndingPunctuation(SHEN_SHA.find((item) => item.name === name)?.note || "")}。`;
}

function shenShaTimingText(item, fortune) {
  if (!fortune) return "";
  const checks = [
    fortune.currentLuck ? ["当前大运", fortune.currentLuck.pillar] : null,
    fortune.currentAnnual ? [`${fortune.currentAnnual.year}流年`, fortune.currentAnnual.pillar] : null
  ].filter(Boolean);
  const triggered = checks
    .filter(([, pillar]) => item.targets.stems.includes(pillar.stem) || item.targets.branches.includes(pillar.branch))
    .map(([label, pillar]) => `${label}${pillar.label}`);
  return triggered.length
    ? `当前${triggered.join("、")}又触到这个神煞，相关主题近期会更容易被看见，需要主动安排，而不是等事情自然变好。`
    : "";
}

function roleFocusText(role) {
  return {
    比劫: "比劫代表自我、同辈和竞争，宜用在协作与执行，少陷入逞强",
    印星: "印星代表学习、贵人、资质和保护，宜补方法、证书、知识体系",
    食伤: "食伤代表表达、作品、技能输出和创意，宜把想法落成成果",
    财星: "财星代表资源、客户、金钱和现实承接，宜重视预算与交换价值",
    官杀: "官杀代表规则、责任、压力和职位，宜建立边界、流程和长期目标"
  }[role] || "";
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
    `本盘日主${meta.strength}，参考喜用为${meta.useful.join("、")}。看流年流月时，遇到喜用五行通常代表有可借之力；遇到命局已偏重的${meta.top}，容易把原来的主题放大，宜先守节奏、补短板，再求突破。`
  ];
}

function buildPartnerInsights(chart, profile, fortune, meta) {
  const spouseBranch = chart.pillars.day.branch;
  const spouseElement = ELEMENT_OF_BRANCH[spouseBranch];
  const spouseRole = relationToDay(meta.dayElement, spouseElement);
  const partnerStar = profile.gender === "男" ? "财星" : profile.gender === "女" ? "官杀" : "伴侣星";
  const partnerElement = profile.gender === "男" ? meta.wealth : profile.gender === "女" ? meta.officer : spouseElement;
  const partnerStrength = chart.elements[partnerElement] || 0;
  const shenNames = new Set(chart.shenSha.filter((item) => item.present).map((item) => item.name));
  const hasRomance = ["桃花", "红鸾", "天喜"].filter((name) => shenNames.has(name));
  const hasSolitude = ["孤辰", "寡宿", "华盖"].filter((name) => shenNames.has(name));
  const currentAnnual = fortune.currentAnnual;
  const annualRomanceScore = currentAnnual ? topicPillarScore("romance", currentAnnual.pillar, chart, meta) : 0;
  const partnerType = {
    木: "气质温和、有成长心和学习力，重视价值观与长期建设",
    火: "表达直接、热情明亮，行动快，重视互动感和被看见",
    土: "稳定务实、责任感强，重视安全感、生活秩序和承诺",
    金: "原则清楚、审美与边界感较强，重视效率、专业和体面",
    水: "聪明灵活、感受力强，重视沟通、空间和精神流动"
  }[partnerElement];
  const spouseHouseText = `日支夫妻宫为${spouseBranch}${spouseElement}，对日主呈${spouseRole}关系。它说明亲密关系中最容易被触发的是“${spouseRole}”主题：${roleRelationshipMeaning(spouseRole)}。`;
  const starText = `${partnerStar}对应五行为${partnerElement}，在原局分值约${partnerStrength.toFixed(1)}。${partnerStrength >= 2.2 ? "伴侣缘分不算弱，关系往往会通过现实事务、合作场景或共同目标显现。" : "伴侣星不算特别旺，正缘更依赖主动经营、稳定社交圈和清晰表达需求。"}`;
  const romanceText = hasRomance.length
    ? `命中见${hasRomance.join("、")}，说明桃花与喜庆机缘较容易被触发；但真正稳定的关系仍要看夫妻宫和大运流年是否能承接。`
    : `原局桃花类神煞不算突出，感情更偏慢热型，适合在稳定圈层、长期合作或共同兴趣中自然发展。`;
  const cautionText = hasSolitude.length
    ? `同时见${hasSolitude.join("、")}，容易有独处、精神要求高或慢热的一面。择偶时不宜只看一时吸引，更要看对方能否尊重节奏、沟通边界。`
    : `关系阻滞不重，关键是避免在压力期把事业、家庭或情绪问题带入亲密沟通。`;
  const timingText = currentAnnual
    ? `${currentAnnual.year}${currentAnnual.pillar.label}流年${annualRomanceScore >= 16 ? "感情互动会更活跃，适合主动认识人或推进关系" : annualRomanceScore >= 8 ? "有机会遇到聊得来的人，适合多参加稳定社交" : annualRomanceScore >= 0 ? "感情节奏偏平稳，重点是把话说清楚、把关系养熟" : "容易有误会或距离感，感情上要少猜、多沟通"}。`
    : `当前流年宜以稳定社交与清晰表达为主。`;
  return [
    spouseHouseText,
    starText,
    `正缘画像偏向：${partnerType}。适合选择能长期配合你的节奏、愿意一起建设生活秩序的人，而不是只凭短期新鲜感推进。`,
    romanceText,
    cautionText,
    timingText
  ];
}

function roleRelationshipMeaning(role) {
  return {
    比劫: "需要平等与空间，容易被独立、有主见的人吸引，也要避免互不相让",
    印星: "需要理解、照顾与精神支持，适合能给你稳定感的人",
    食伤: "重视表达、趣味和生活体验，关系中要留意说话锋芒",
    财星: "重视现实照顾、资源安排与生活品质，关系会牵动金钱和承诺议题",
    官杀: "重视责任、边界和承诺，容易被成熟、有担当或有规则感的人吸引"
  }[role] || "需要结合现实互动观察";
}

function buildCareerInsights(chart, fortune, meta) {
  const shenNames = new Set(chart.shenSha.filter((item) => item.present).map((item) => item.name));
  const roles = Object.values(chart.pillars).flatMap((pillar) => [
    relationToDay(meta.dayElement, ELEMENT_OF_STEM[pillar.stem]),
    relationToDay(meta.dayElement, ELEMENT_OF_BRANCH[pillar.branch])
  ]);
  const roleCounts = roles.reduce((acc, role) => {
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});
  const strongestRoles = Object.entries(roleCounts).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([role]) => role);
  const elementJobs = {
    木: "教育培训、文化出版、咨询策划、产品经理、用户研究、园林环保、医养康复",
    火: "传媒内容、品牌营销、设计视觉、互联网运营、演讲培训、餐饮娱乐、能源电子",
    土: "地产建筑、工程项目、供应链、行政管理、人力资源、农业食品、风控合规",
    金: "金融法务、审计风控、数据分析、硬件制造、医美器械、珠宝审美、制度管理",
    水: "贸易物流、跨境业务、咨询顾问、数据流量、旅游交通、心理沟通、金融流动性业务"
  };
  const roleJobs = {
    印星: "研究、教育、资质型岗位、专业顾问、知识管理、医药护理、后台支持",
    食伤: "内容表达、设计创意、产品策划、销售转化、技术输出、培训讲师",
    财星: "商业运营、销售、投资理财、供应链、客户经营、资源整合",
    官杀: "管理、法务合规、公职体系、项目负责人、流程制度、组织协调",
    比劫: "创业合伙、团队协作、社群运营、竞技型业务、需要强执行的岗位"
  };
  const shenCareer = [
    shenNames.has("文昌贵人") ? "文昌入命，适合文字表达、学习考试、策划研究、知识型行业。" : "",
    shenNames.has("将星") ? "将星入命，适合承担负责人、项目统筹、组织管理类角色。" : "",
    shenNames.has("国印贵人") ? "国印入命，适合资质、制度、公信力、证照和管理背书强的行业。" : "",
    shenNames.has("驿马") ? "驿马入命，适合跨区域、外勤、流动性强、出差或跨境相关工作。" : ""
  ].filter(Boolean);
  const currentLuck = fortune.currentLuck
    ? `${fortune.currentLuck.pillar.label}大运对事业为：${topicPillarText("career", fortune.currentLuck.pillar, chart, meta, "当前大运")}`
    : "当前尚未入大运，事业判断以原局月柱和日主强弱为主。";
  return [
    `事业结构看，命局中较明显的十神主题为${strongestRoles.join("、")}。${strongestRoles.map((role) => roleJobs[role]).join("；")}会比较容易发挥。`,
    `从喜用五行看，当前参考喜用为${meta.useful.join("、")}，适合优先考虑：${meta.useful.map((element) => `${element}类：${elementJobs[element]}`).join("；")}。`,
    shenCareer.length ? shenCareer.join("") : "命中事业类神煞不算集中，职业选择更要看五行喜用、技能积累和现实平台。",
    currentLuck,
    "总体建议：优先选择能长期累积专业、能形成作品或资质、且节奏可持续的方向。若要创业或转型，应选择与自身喜用五行相合、能把表达和资源承接起来的项目。"
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
  const baseYear = birth.clockYear || birth.year;
  const baseMonth = birth.clockMonth || birth.month;
  const baseDay = birth.clockDay || birth.day;
  let age = today.getFullYear() - baseYear;
  const birthdayThisYear = new Date(today.getFullYear(), baseMonth - 1, baseDay);
  if (today < birthdayThisYear) age -= 1;
  const lastBirthdayYear = today < birthdayThisYear ? today.getFullYear() - 1 : today.getFullYear();
  const lastBirthday = new Date(lastBirthdayYear, baseMonth - 1, baseDay);
  const nextBirthday = new Date(lastBirthdayYear + 1, baseMonth - 1, baseDay);
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

  const study = clamp(
    55 +
    (has("文昌贵人") ? 14 : 0) +
    (has("学堂") ? 12 : 0) +
    (has("德秀贵人") ? 9 : 0) +
    (has("太极贵人") ? 7 : 0) +
    (has("国印贵人") ? 5 : 0) +
    (currentRoles.includes("印星") ? 8 : 0) +
    (currentRoles.includes("食伤") ? 5 : 0) +
    luckUsefulBonus +
    annualUsefulBonus +
    topicPillarScore("study", fortune.currentAnnual?.pillar, chart, meta) -
    (has("空亡") ? 4 : 0),
    35,
    98
  );

  const scoreMap = {
    career: {
      key: "career",
      label: "事业",
      score: career,
      text: scoreText(career, `${annualTone}${has("将星", "文昌贵人", "国印贵人") ? "事业侧重组织、表达与专业背书" : "事业更依赖长期积累和阶段选择"}`)
    },
    study: {
      key: "study",
      label: "学业",
      score: study,
      text: scoreText(study, `${annualTone}${has("文昌贵人", "学堂", "德秀贵人") ? "学习、考试和表达能力更容易发挥" : "学习更依赖计划、复盘和长期坚持"}`)
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
    study: { 印星: 12, 食伤: 8, 官杀: 5, 比劫: 2, 财星: -2 },
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

function renderShenSha(items, chart, fortune) {
  const list = document.querySelector("#shenShaList");
  const presentItems = items.filter((item) => item.present);
  if (!presentItems.length) {
    list.innerHTML = `<span class="muted">本盘未见当前系统收录的主要神煞。</span>`;
    return;
  }
  const meta = getChartMeta(chart);
  list.innerHTML = presentItems.map((item) => {
    const targetText = [
      item.targets.stems.length ? `天干${item.targets.stems.join("/")}` : "",
      item.targets.branches.length ? `地支${item.targets.branches.join("/")}` : ""
    ].filter(Boolean).join(" · ");
    const hitText = item.present ? item.hits.join("、") : "未见";
    const contextText = shenShaContextText(item, chart, meta, fortune);
    return `
      <article class="shen-item is-present">
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          <span>${escapeHtml(hitText)}</span>
        </div>
        <p>${escapeHtml(targetText || "依命局组合判定")}。${escapeHtml(contextText)}</p>
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
  const trend = score >= 16 ? "比较顺，适合主动推进" : score >= 8 ? "有机会，可以认真把握" : score >= 0 ? "节奏平稳，适合稳扎稳打" : "阻力偏多，需要谨慎一点";
  const stemElement = ELEMENT_OF_STEM[pillar.stem];
  const branchElement = ELEMENT_OF_BRANCH[pillar.branch];
  const stemRole = relationToDay(meta.dayElement, stemElement);
  const branchRole = relationToDay(meta.dayElement, branchElement);
  const usefulHit = [stemElement, branchElement].filter((element) => meta.useful.includes(element));
  const pressureHit = [stemElement, branchElement].filter((element) => element === meta.top && !meta.useful.includes(element));
  const baziContext = `此柱天干${pillar.stem}${stemElement}为${stemRole}，地支${pillar.branch}${branchElement}为${branchRole}；${usefulHit.length ? `触及喜用${[...new Set(usefulHit)].join("、")}，可借势主动推进` : `未明显触及喜用${meta.useful.join("、")}，更适合稳扎稳打`}${pressureHit.length ? `；同时放大原局偏重的${meta.top}，要防一端过旺` : ""}。`;
  const advice = {
    career: {
      high: `事业上适合争取职责、考试评审、项目推进和专业曝光，尤其利${careerDirectionByRoles([stemRole, branchRole])}。`,
      mid: `事业适合梳理流程、累积作品、稳住合作关系，可把重点放在${careerDirectionByRoles([stemRole, branchRole])}。`,
      low: "事业上先稳边界，少做情绪化承诺，重要决定多复核。"
    },
    study: {
      high: `学业上适合备考、复盘、写作输出和考证进阶，重点放在${studyCueByRoles([stemRole, branchRole])}。`,
      mid: `学习适合按计划推进，把知识点拆小，边学边做检查，重点看${studyCueByRoles([stemRole, branchRole])}。`,
      low: "学习上先减少分心和拖延，固定作息与复习节奏，不要把任务都压到最后。"
    },
    health: {
      high: `健康有利恢复秩序，适合建立作息、运动和复查计划，重点照看${healthFocusByElements([stemElement, branchElement])}。`,
      mid: `健康重点在稳定节奏，少熬夜，饮食与压力管理要同步，留意${healthFocusByElements([stemElement, branchElement])}。`,
      low: `要减少硬扛和过劳，避免急躁、碰撞、炎症或旧疾反复，尤其留意${healthFocusByElements([stemElement, branchElement])}。`
    },
    romance: {
      high: `人缘与情感互动较活跃，适合主动表达、修复关系和拓展社交；正缘观察重点是${partnerCueByRoles([stemRole, branchRole])}。`,
      mid: `桃花以温和经营为主，慢热互动比强推进更合适；可多留意${partnerCueByRoles([stemRole, branchRole])}。`,
      low: "感情上宜少猜测、多沟通，避免把压力带进亲密关系。"
    },
    wealth: {
      high: `财务转化机会较清楚，适合谈资源、预算、回款和稳定增收，优先做${wealthCueByRoles([stemRole, branchRole])}。`,
      mid: `财运重在执行和复盘，适合稳健配置与长期项目，重点看${wealthCueByRoles([stemRole, branchRole])}。`,
      low: "不宜重仓冒进，借贷、合伙和冲动消费都要留余地。"
    }
  }[topic];
  const line = score >= 16 ? advice.high : score >= 4 ? advice.mid : advice.low;
  return `${scope}${trend}：${baziContext}${line}`;
}

function careerDirectionByRoles(roles) {
  const map = {
    印星: "学习研究、资质证书、专业顾问、后台支持",
    食伤: "表达输出、内容产品、设计策划、技术作品",
    财星: "客户经营、商业转化、资源整合、预算回款",
    官杀: "管理责任、制度流程、项目统筹、合规执行",
    比劫: "团队协作、合伙创业、竞争执行、社群运营"
  };
  return [...new Set(roles.map((role) => map[role]).filter(Boolean))].join("与") || "稳健执行";
}

function studyCueByRoles(roles) {
  const map = {
    印星: "理解记忆、系统学习、教材和老师资源",
    食伤: "表达输出、刷题复盘、写作展示",
    财星: "实用技能、项目练习、把知识变成成果",
    官杀: "考试规则、时间管理、证书目标",
    比劫: "同伴监督、小组学习、竞争动力"
  };
  return [...new Set(roles.map((role) => map[role]).filter(Boolean))].join("、") || "稳定复习节奏";
}

function healthFocusByElements(elements) {
  const map = {
    木: "肝胆、筋骨、眼睛和情绪疏泄",
    火: "心血管、睡眠、炎症和上火问题",
    土: "脾胃、消化、代谢和湿重",
    金: "呼吸道、皮肤、鼻喉和压力紧绷",
    水: "肾水、泌尿、腰部、内分泌和寒湿"
  };
  return [...new Set(elements.map((element) => map[element]))].join("、");
}

function partnerCueByRoles(roles) {
  const map = {
    印星: "能给予理解、照顾与精神支持的人",
    食伤: "表达轻松、有生活趣味、能一起创造体验的人",
    财星: "务实可靠、愿意共同规划生活资源的人",
    官杀: "成熟有担当、边界清楚、重承诺的人",
    比劫: "独立有主见、能平等协作但也需要空间的人"
  };
  return [...new Set(roles.map((role) => map[role]).filter(Boolean))].join("，");
}

function wealthCueByRoles(roles) {
  const map = {
    印星: "知识变现、资质背书和长期积累",
    食伤: "作品输出、内容转化和销售表达",
    财星: "直接交易、客户资源和现金流管理",
    官杀: "制度化收入、职位责任和稳定项目",
    比劫: "团队合作、渠道共创和资源互换"
  };
  return [...new Set(roles.map((role) => map[role]).filter(Boolean))].join("、") || "稳健现金流";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clearForm() {
  document.querySelector("#userName").value = "";
  document.querySelector("#gender").value = "男";
  document.querySelector("#birthPlace").value = "hong-kong";
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
  document.querySelector("#scorePanel").innerHTML = `<p class="muted">排盘后显示事业、学业、健康、桃花、财运评分。</p>`;
  document.querySelector("#elementBars").innerHTML = "";
  document.querySelector("#shenShaList").innerHTML = `<span class="muted">待生成</span>`;
  document.querySelector("#analysisText").innerHTML = `<p>排盘后将从日主、五行偏重、神煞意象三个角度给出简要分析。</p>`;
  document.querySelector("#fortunePanel").innerHTML = `<p class="muted">排盘后显示起运、当前大运与近年流年。</p>`;
}

function getFormPayload() {
  const placeKey = document.querySelector("#birthPlace").value || "hong-kong";
  const place = getPlace(placeKey);
  return {
    profile: {
      name: document.querySelector("#userName").value.trim(),
      gender: document.querySelector("#gender").value,
      place: place.name,
      placeKey
    },
    birth: parseBirth(document.querySelector("#birthDate").value, document.querySelector("#birthTime").value, placeKey),
    date: document.querySelector("#birthDate").value,
    time: document.querySelector("#birthTime").value
  };
}

function fillFormFromRecord(record) {
  document.querySelector("#userName").value = record.profile?.name || "";
  document.querySelector("#gender").value = record.profile?.gender || "男";
  document.querySelector("#birthPlace").value = record.profile?.placeKey && PLACES[record.profile.placeKey]
    ? record.profile.placeKey
    : placeKeyFromName(record.profile?.place);
  document.querySelector("#birthDate").value = record.date || "";
  document.querySelector("#birthTime").value = record.time || "";
}

function placeKeyFromName(name) {
  const found = Object.entries(PLACES).find(([, place]) => place.name === name);
  return found ? found[0] : "hong-kong";
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
  document.querySelector("#summaryText").textContent = `年柱${chart.pillars.year.label}，月柱${chart.pillars.month.label}，日柱${chart.pillars.day.label}，时柱${chart.pillars.hour.label}。日主为${chart.pillars.day.stem}${ELEMENT_OF_STEM[chart.pillars.day.stem]}。出生地${profile.place}，钟表时间${formatClockTime(birth.clockHour, birth.clockMinute)}，真太阳时约${formatClockTime(birth.hour, birth.minute)}（${formatCorrection(birth.correctionMinutes)}）。`;
  renderPillars(chart.pillars);
  renderElements(chart.elements);
  renderShenSha(chart.shenSha, chart, fortune);
  renderAnalysis(analyze(chart, profile, fortune));
  renderDynamicPanels();
  if (save) saveCurrentRecord(profile, birth, chart);
}

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
resetResults();
