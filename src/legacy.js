/**
 * ========================================
 * F1 26 Career Simulator - 核心游戏引擎
 * ========================================
 *
 * 文件说明：
 * 这是游戏的主要逻辑文件，包含所有数据定义和游戏函数。
 * 采用传统JavaScript编写以保持兼容性，使用全局变量和函数。
 *
 * 主要模块：
 * 1. 数据定义: 车手、车队、赛历等
 * 2. 状态管理: 游戏状态跟踪
 * 3. UI 渲染: 各种页面和模块的渲染函数
 * 4. 游戏逻辑: 比赛模拟、研发管理等
 * 5. 存档系统: 自动存档和手动存档
 *
 * 编程规范：
 * - 函数名采用驼峰命名法 (camelCase)
 * - 常量采用全大写 (CONSTANT_NAME)
 * - 注释使用中文，便于国际化
 */

/* ========== 1. 游戏数据定义 ========== */

/**
 * 2026赛季驾驶员列表
 * 数据结构: [姓名, 车队, 综合评分, 经验, 技巧, 意识, 速度]
 * 评分范围: 0-100
 */
const drivers = [
  // Red Bull Racing - 红牛车队 (总体OVR: 66)
  ["Max Verstappen", "Red Bull Racing", 96, 85, 97, 94, 97],
  ["Isack Hadjar", "Red Bull Racing", 78, 50, 79, 75, 80],

  // Ferrari - 法拉利车队 (总体OVR: 70)
  ["Lewis Hamilton", "Ferrari", 92, 99, 91, 92, 90],
  ["Charles Leclerc", "Ferrari", 92, 78, 91, 90, 95],

  // McLaren - 迈凯伦车队 (总体OVR: 69)
  ["Lando Norris", "McLaren", 93, 76, 93, 90, 94],
  ["Oscar Piastri", "McLaren", 91, 65, 92, 88, 92],

  // Mercedes - 梅赛德斯车队 (总体OVR: 72) - 最强车队
  ["George Russell", "Mercedes", 90, 75, 91, 85, 91],
  ["Kimi Antonelli", "Mercedes", 87, 58, 87, 83, 90],

  // Aston Martin - 阿斯顿马丁车队 (总体OVR: 49)
  ["Fernando Alonso", "Aston Martin", 89, 99, 93, 95, 85],
  ["Lance Stroll", "Aston Martin", 81, 85, 81, 78, 80],

  // Williams - 威廉姆斯车队 (总体OVR: 58)
  ["Carlos Sainz", "Williams", 89, 82, 90, 91, 88],
  ["Alexander Albon", "Williams", 86, 75, 86, 83, 86],

  // Alpine - 阿尔卑斯车队 (总体OVR: 55)
  ["Pierre Gasly", "Alpine", 85, 80, 84, 84, 85],
  ["Franco Colapinto", "Alpine", 81, 55, 84, 80, 81],

  // Haas - 哈斯车队 (总体OVR: 56)
  ["Esteban Ocon", "Haas F1 Team", 85, 82, 86, 81, 85],
  ["Oliver Bearman", "Haas F1 Team", 80, 55, 80, 78, 83],

  // Racing Bulls - 赛车公牛车队 (总体OVR: 59)
  ["Liam Lawson", "Racing Bulls", 82, 60, 83, 82, 82],
  ["Arvid Lindblad", "Racing Bulls", 76, 45, 77, 74, 78],

  // Audi - 奥迪车队 (总体OVR: 52)
  ["Nico Hulkenberg", "Audi", 84, 90, 83, 84, 83],
  ["Gabriel Bortoleto", "Audi", 79, 50, 80, 79, 81],

  // Cadillac - 凯迪拉克车队 (总体OVR: 45) - 新进入F1
  ["Sergio Perez", "Cadillac", 83, 92, 85, 80, 81],
  ["Valtteri Bottas", "Cadillac", 83, 95, 80, 85, 80],
];

/* PERSONAL_DRIVER_NUMBER_RULE_V40:
 *
 * 车号规则说明：
 * - 车号是永久性的个人号码
 * - #1号reserved for reigning champion eligibility (卫冕冠军资格)
 * - #1号从不硬编码为任何车手的永久号码
 * - 这保证了#1号的特殊地位
 */
const driverProfiles = {
  "Max Verstappen": {
    number: 3,
    nation: "荷兰",
    debut: 2015,
    season2025: "P2 · 421分",
    titles: 4,
    wins: 71,
    podiums: 127,
    poles: 48,
    best: "2021–2024 四届世界冠军",
  },
  "Isack Hadjar": {
    number: 6,
    nation: "法国",
    debut: 2025,
    season2025: "P12 · 51分",
    titles: 0,
    wins: 0,
    podiums: 1,
    poles: 0,
    best: "2025 荷兰站首次领奖台",
  },
  "Lewis Hamilton": {
    number: 44,
    nation: "英国",
    debut: 2007,
    season2025: "P6 · 156分",
    titles: 7,
    wins: 105,
    podiums: 202,
    poles: 104,
    best: "七届世界冠军 · F1历史标杆级履历",
  },
  "Charles Leclerc": {
    number: 16,
    nation: "摩纳哥",
    debut: 2018,
    season2025: "P5 · 242分",
    titles: 0,
    wins: 8,
    podiums: 50,
    poles: 27,
    best: "2022 世界亚军 · 8场大奖赛胜利",
  },
  "Lando Norris": {
    number: 4,
    nation: "英国",
    debut: 2019,
    season2025: "P1 · 423分",
    titles: 1,
    wins: 11,
    podiums: 44,
    poles: 16,
    best: "2025 世界冠军",
  },
  "Oscar Piastri": {
    number: 81,
    nation: "澳大利亚",
    debut: 2023,
    season2025: "P3 · 410分",
    titles: 0,
    wins: 9,
    podiums: 26,
    poles: 6,
    best: "2025 争冠至收官战 · 年度季军",
  },
  "George Russell": {
    number: 63,
    nation: "英国",
    debut: 2019,
    season2025: "P4 · 319分",
    titles: 0,
    wins: 5,
    podiums: 24,
    poles: 8,
    best: "多场大奖赛冠军 · 2025年度P4",
  },
  "Kimi Antonelli": {
    number: 12,
    nation: "意大利",
    debut: 2025,
    season2025: "P7 · 150分",
    titles: 0,
    wins: 0,
    podiums: 3,
    poles: 0,
    best: "2025 新秀赛季三次登台",
  },
  "Fernando Alonso": {
    number: 14,
    nation: "西班牙",
    debut: 2001,
    season2025: "P10 · 56分",
    titles: 2,
    wins: 32,
    podiums: 106,
    poles: 22,
    best: "2005、2006 世界冠军",
  },
  "Lance Stroll": {
    number: 18,
    nation: "加拿大",
    debut: 2017,
    season2025: "P16 · 33分",
    titles: 0,
    wins: 0,
    podiums: 3,
    poles: 1,
    best: "3次领奖台 · 2020土耳其站杆位",
  },
  "Carlos Sainz": {
    number: 55,
    nation: "西班牙",
    debut: 2015,
    season2025: "P9 · 64分",
    titles: 0,
    wins: 4,
    podiums: 29,
    poles: 6,
    best: "4场大奖赛胜利",
  },
  "Alexander Albon": {
    number: 23,
    nation: "泰国",
    debut: 2019,
    season2025: "P8 · 73分",
    titles: 0,
    wins: 0,
    podiums: 2,
    poles: 0,
    best: "2次领奖台 · 2025年度P8",
  },
  "Pierre Gasly": {
    number: 10,
    nation: "法国",
    debut: 2017,
    season2025: "P18 · 22分",
    titles: 0,
    wins: 1,
    podiums: 5,
    poles: 0,
    best: "2020 意大利大奖赛冠军",
  },
  "Franco Colapinto": {
    number: 43,
    nation: "阿根廷",
    debut: 2024,
    season2025: "P20 · 0分",
    titles: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    best: "2024中途加入Williams并取得积分",
  },
  "Esteban Ocon": {
    number: 31,
    nation: "法国",
    debut: 2016,
    season2025: "P15 · 38分",
    titles: 0,
    wins: 1,
    podiums: 4,
    poles: 0,
    best: "2021 匈牙利大奖赛冠军",
  },
  "Oliver Bearman": {
    number: 87,
    nation: "英国",
    debut: 2024,
    season2025: "P13 · 41分",
    titles: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    best: "2024沙特代打首秀P7",
  },
  "Liam Lawson": {
    number: 30,
    nation: "新西兰",
    debut: 2023,
    season2025: "P14 · 38分",
    titles: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    best: "多次Q3与积分完赛",
  },
  "Arvid Lindblad": {
    number: 41,
    nation: "英国",
    debut: 2026,
    season2025: "F2赛季 · 晋升F1",
    titles: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    best: "2026唯一F1新秀 · 青年梯队快速晋升",
  },
  "Nico Hulkenberg": {
    number: 27,
    nation: "德国",
    debut: 2010,
    season2025: "P11 · 51分",
    titles: 0,
    wins: 0,
    podiums: 1,
    poles: 1,
    best: "2025取得生涯首个F1领奖台",
  },
  "Gabriel Bortoleto": {
    number: 5,
    nation: "巴西",
    debut: 2025,
    season2025: "P19 · 19分",
    titles: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    best: "F3、F2连续夺冠后进入F1",
  },
  "Sergio Perez": {
    number: 11,
    nation: "墨西哥",
    debut: 2011,
    season2025: "未参赛 · 2026随Cadillac回归",
    titles: 0,
    wins: 6,
    podiums: 39,
    poles: 3,
    best: "6场大奖赛胜利 · 2023世界亚军",
  },
  "Valtteri Bottas": {
    number: 77,
    nation: "芬兰",
    debut: 2013,
    season2025: "Mercedes储备车手 · 2026回归",
    titles: 0,
    wins: 10,
    podiums: 67,
    poles: 20,
    best: "10场大奖赛胜利 · 两届世界亚军",
  },
};
const teams = {
  "Red Bull Racing": {
    ovr: 66,
    budget: 118,
    dev: 89,
    parts: {
      底板: 68,
      底盘: 65,
      前翼: 67,
      后翼: 66,
      悬挂: 65,
      冷却: 63,
      动力单元: 68,
    },
  },
  Ferrari: {
    ovr: 70,
    budget: 128,
    dev: 92,
    parts: {
      底板: 71,
      底盘: 70,
      前翼: 72,
      后翼: 69,
      悬挂: 69,
      冷却: 68,
      动力单元: 71,
    },
  },
  McLaren: {
    ovr: 69,
    budget: 124,
    dev: 91,
    parts: {
      底板: 71,
      底盘: 70,
      前翼: 70,
      后翼: 68,
      悬挂: 69,
      冷却: 66,
      动力单元: 69,
    },
  },
  Mercedes: {
    ovr: 72,
    budget: 132,
    dev: 94,
    parts: {
      底板: 74,
      底盘: 73,
      前翼: 72,
      后翼: 71,
      悬挂: 72,
      冷却: 70,
      动力单元: 72,
    },
  },
  "Aston Martin": {
    ovr: 49,
    budget: 135,
    dev: 96,
    parts: {
      底板: 49,
      底盘: 48,
      前翼: 50,
      后翼: 48,
      悬挂: 50,
      冷却: 51,
      动力单元: 47,
    },
  },
  Williams: {
    ovr: 58,
    budget: 104,
    dev: 86,
    parts: {
      底板: 56,
      底盘: 57,
      前翼: 58,
      后翼: 57,
      悬挂: 58,
      冷却: 59,
      动力单元: 64,
    },
  },
  Alpine: {
    ovr: 55,
    budget: 98,
    dev: 84,
    parts: {
      底板: 56,
      底盘: 55,
      前翼: 55,
      后翼: 54,
      悬挂: 56,
      冷却: 52,
      动力单元: 57,
    },
  },
  "Haas F1 Team": {
    ovr: 56,
    budget: 92,
    dev: 82,
    parts: {
      底板: 56,
      底盘: 55,
      前翼: 57,
      后翼: 56,
      悬挂: 54,
      冷却: 53,
      动力单元: 61,
    },
  },
  "Racing Bulls": {
    ovr: 59,
    budget: 96,
    dev: 87,
    parts: {
      底板: 60,
      底盘: 59,
      前翼: 58,
      后翼: 59,
      悬挂: 60,
      冷却: 57,
      动力单元: 60,
    },
  },
  Audi: {
    ovr: 52,
    budget: 140,
    dev: 95,
    parts: {
      底板: 50,
      底盘: 51,
      前翼: 52,
      后翼: 51,
      悬挂: 53,
      冷却: 54,
      动力单元: 55,
    },
  },
  Cadillac: {
    ovr: 45,
    budget: 150,
    dev: 93,
    parts: {
      底板: 44,
      底盘: 45,
      前翼: 43,
      后翼: 44,
      悬挂: 46,
      冷却: 48,
      动力单元: 47,
    },
  },
};
const baseTeams = JSON.parse(JSON.stringify(teams));

const personnel = {
  "Red Bull Racing": {
    principal: "Laurent Mekies",
    engineers: {
      "Max Verstappen": "Gianpiero Lambiase",
      "Isack Hadjar": "Richard Wood",
    },
  },
  Ferrari: {
    principal: "Frédéric Vasseur",
    engineers: {
      "Charles Leclerc": "Bryan Bozzi",
      "Lewis Hamilton": "Carlo Santi",
    },
  },
  McLaren: {
    principal: "Andrea Stella",
    engineers: {
      "Lando Norris": "Will Joseph",
      "Oscar Piastri": "Tom Stallard",
    },
  },
  Mercedes: {
    principal: "Toto Wolff",
    engineers: {
      "George Russell": "Marcus Dudley",
      "Kimi Antonelli": "Peter Bonnington",
    },
  },
  "Aston Martin": {
    principal: "Adrian Newey",
    engineers: {
      "Fernando Alonso": "Andrew Vizard",
      "Lance Stroll": "Stephen Glass",
    },
  },
  Williams: {
    principal: "James Vowles",
    engineers: {
      "Alexander Albon": "James Urwin",
      "Carlos Sainz": "Gaëtan Jego",
    },
  },
  Alpine: {
    principal: "Flavio Briatore / Steve Nielsen",
    engineers: {
      "Pierre Gasly": "Josh Peckett",
      "Franco Colapinto": "Stuart Barlow",
    },
  },
  "Haas F1 Team": {
    principal: "Ayao Komatsu",
    engineers: {
      "Esteban Ocon": "Laura Müller",
      "Oliver Bearman": "Ronan O’Hare",
    },
  },
  "Racing Bulls": {
    principal: "Alan Permane",
    engineers: {
      "Liam Lawson": "Alexandre Iliopoulos",
      "Arvid Lindblad": "Pierre Hamelin",
    },
  },
  Audi: {
    principal: "Mattia Binotto",
    engineers: {
      "Nico Hulkenberg": "Steven Petrik",
      "Gabriel Bortoleto": "José Manuel López",
    },
  },
  Cadillac: {
    principal: "Graeme Lowdon",
    engineers: {
      "Sergio Perez": "Carlo Pasetti",
      "Valtteri Bottas": "John Howard",
    },
  },
};
/* ========== 3. 赛历数据 ========== */

/**
 * 2026年完整赛历
 *
 * 数据结构: [轮次, 大奖赛名称, 举办地, 日期范围, 是否包含短程赛(Sprint)]
 *
 * 赛历特点：
 * - 总共23场大奖赛
 * - 6场包含Sprint短程赛（提供额外积分）
 * - 赛季从3月开始，12月收官
 * - 包括新增城市赛(Madrid, Singapore等)
 */
const calendar = [
  [1, "澳大利亚大奖赛", "墨尔本", "03月06日–03月08日", false],
  [2, "中国大奖赛", "上海", "03月13日–03月15日", true],
  [3, "日本大奖赛", "铃鹿", "03月27日–03月29日", false],
  [4, "迈阿密大奖赛", "迈阿密", "05月01日–05月03日", true],
  [5, "加拿大大奖赛", "蒙特利尔", "05月22日–05月24日", true],
  [6, "摩纳哥大奖赛", "蒙特卡洛", "06月05日–06月07日", false],
  [
    7,
    "巴塞罗那-加泰罗尼亚大奖赛",
    "巴塞罗那-加泰罗尼亚",
    "06月12日–06月14日",
    false,
  ],
  [8, "奥地利大奖赛", "斯皮尔伯格", "06月26日–06月28日", false],
  [9, "英国大奖赛", "银石", "07月03日–07月05日", true],
  [10, "比利时大奖赛", "斯帕-弗朗科尔尚", "07月17日–07月19日", false],
  [11, "匈牙利大奖赛", "布达佩斯", "07月24日–07月26日", false],
  [12, "荷兰大奖赛", "赞德沃特", "08月21日–08月23日", true],
  [13, "意大利大奖赛", "蒙扎", "09月04日–09月06日", false],
  [14, "西班牙大奖赛", "马德里", "09月11日–09月13日", false],
  [15, "阿塞拜疆大奖赛", "巴库", "09月24日–09月26日", false],
  [16, "巴林大奖赛 · 马来西亚", "雪邦", "10月02日–10月04日", false],
  [17, "新加坡大奖赛", "滨海湾", "10月09日–10月11日", true],
  [18, "美国大奖赛", "奥斯汀", "10月23日–10月25日", false],
  [19, "墨西哥城大奖赛", "墨西哥城", "10月30日–11月01日", false],
  [20, "圣保罗大奖赛", "因特拉格斯", "11月06日–11月08日", false],
  [21, "拉斯维加斯大奖赛", "拉斯维加斯", "11月19日–11月21日", false],
  [22, "卡塔尔大奖赛", "卢赛尔", "11月27日–11月29日", false],
  [23, "阿布扎比大奖赛", "亚斯码头", "12月04日–12月06日", false],
];

/**
 * 当前选中的车手
 * 保存全局状态，用于追踪玩家选择的车手
 */
let selected = null;

/* ========== 4. 车手关系系统 ========== */

/**
 * 车手之间的基础关系度
 *
 * 说明：
 * - 键值对格式: "车手A|车手B"（字母顺序排列）
 * - 值为基础关系度 (0-100)
 * - 同队车手默认关系度为63（需要共同工作）
 * - 未明确定义的车手对关系度为50（职业中立）
 * - 这些数值会在游戏中根据玩家行动而动态调整
 */
const relationPairs = {
  "Charles Leclerc|Pierre Gasly": 86, // 非常亲近
  "Carlos Sainz|Lando Norris": 85, // 非常亲近
  "Alexander Albon|Carlos Sainz": 78, // 友好
  "Gabriel Bortoleto|Nico Hulkenberg": 80, // 友好
  "Fernando Alonso|Lance Stroll": 76, // 友好
  "Lando Norris|Oscar Piastri": 68, // 友好
  "Charles Leclerc|Carlos Sainz": 73, // 友好
  "Lando Norris|Max Verstappen": 72, // 友好
  "Charles Leclerc|Max Verstappen": 67, // 不错
  "Lewis Hamilton|Valtteri Bottas": 79, // 友好
  "George Russell|Lewis Hamilton": 63, // 不错
  "Charles Leclerc|Lewis Hamilton": 68, // 不错
  "Max Verstappen|Sergio Perez": 58, // 不错
  "Alexander Albon|Max Verstappen": 61, // 不错
  "Carlos Sainz|Max Verstappen": 56, // 不错
  "Esteban Ocon|Pierre Gasly": 52, // 职业关系
  "Esteban Ocon|Max Verstappen": 40, // 有些紧张
  "George Russell|Max Verstappen": 24, // 关系紧张
  "Esteban Ocon|Oliver Bearman": 65, // 不错
  "Gabriel Bortoleto|Fernando Alonso": 74, // 友好
  "George Russell|Kimi Antonelli": 67, // 不错
  "Pierre Gasly|Franco Colapinto": 62, // 不错
  "Sergio Perez|Valtteri Bottas": 63, // 不错
  "Isack Hadjar|Max Verstappen": 64, // 不错
  "Arvid Lindblad|Liam Lawson": 60, // 不错
  "Isack Hadjar|Arvid Lindblad": 58, // 不错
  "Oliver Bearman|Charles Leclerc": 61, // 不错
  "Oliver Bearman|Lewis Hamilton": 60, // 不错
  "Franco Colapinto|Alexander Albon": 59, // 不错
  "Nico Hulkenberg|Esteban Ocon": 57, // 不错
};

/**
 * 生成关系对的排序键值
 * 确保 pairKey("A", "B") === pairKey("B", "A")
 */
function pairKey(a, b) {
  return [a, b].sort().join("|");
}

/**
 * 计算两个车手之间的基础关系度
 *
 * 规则：
 * 1. 自己和自己关系度为100 (完美)
 * 2. 查询relationPairs中的预定义关系度
 * 3. 同队车手默认关系度为63
 * 4. 其他默认关系度为50
 */
function relationshipBase(a, b) {
  if (a === b) return 100;
  const direct =
    relationPairs[a + "|" + b] ??
    relationPairs[b + "|" + a] ??
    relationPairs[pairKey(a, b)];
  if (direct != null) return direct;
  const da = drivers.find((d) => d[0] === a),
    db = drivers.find((d) => d[0] === b);
  if (da && db && da[1] === db[1]) return 63;
  return 50;
}

/**
 * 根据数值返回关系度的文字标签
 * 用于UI展示
 */
function relationshipLabel(v) {
  if (v >= 80) return "非常亲近";
  if (v >= 68) return "友好";
  if (v >= 57) return "不错";
  if (v >= 45) return "职业关系";
  if (v >= 32) return "有些紧张";
  return "关系紧张";
}

/**
 * 为新车手初始化与所有其他车手的关系度
 * 用于游戏开始时的初始化
 */
function buildInitialDriverRelations(name) {
  const o = {};
  drivers.forEach((d) => {
    if (d[0] !== name) o[d[0]] = relationshipBase(name, d[0]);
  });
  return o;
}

/* ========== 5. 游戏全局状态 ========== */

/**
 * 游戏状态对象 - 追踪所有游戏进度
 *
 * 属性说明：
 * - round: 当前赛季轮次 (1-23)
 * - budget: 可用研发预算 (百万欧元)
 * - projects: 进行中的研发项目数组
 * - trainingUsed: 本周是否已安排训练
 * - prep: 训练准备数据 (提升单圈和长距离能力)
 * - relations: 与领队和工程师的关系度
 * - driverRelations: 与其他车手的关系度
 * - prUsed: 本周是否已使用媒体互动名额
 * - driverPoints: 个人积分
 * - teamPoints: 车队积分
 * - history: 赛季历史记录数组
 * - weekend: 比赛周末的临时数据
 */
let state = {
  round: 1,
  budget: 0,
  projects: [],
  trainingUsed: false,
  prep: { round: 1, type: null, qual: 0, race: 0, control: 0 },
  relations: { principal: 65, engineer: 70 },
  driverRelations: {},
  prUsed: { team: null, driver: null },
  lastPR: { team: null, driver: null },
  driverPoints: 0,
  teamPoints: 0,
  history: [],
  weekend: {
    qualStrategy: null,
    raceStrategy: null,
    qualResult: null,
    raceResult: null,
    qualField: null,
    pendingPhase: null,
    pendingEvent: null,
    lastDecision: null,
  },
};

/* ========== 6. UI 视图切换函数 ========== */

/**
 * 显示指定的视图
 *
 * 功能：
 * 1. 隐藏所有其他视图 (移除 .active 类)
 * 2. 显示目标视图 (添加 .active 类)
 * 3. 触发页面进入动画
 * 4. 滚动到页面顶部
 *
 * @param {string} id - 要显示的视图元素的ID
 */
function showView(id) {
  const target = document.getElementById(id);
  document
    .querySelectorAll(".view")
    .forEach((v) => v.classList.remove("active"));
  void target.offsetWidth; // 触发重排，确保动画正确执行
  target.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * 比赛过渡动画
 *
 * 在不同比赛阶段（排位赛→正赛等）之间显示过渡屏幕
 *
 * @param {string} title - 过渡标题
 * @param {string} sub - 副标题
 * @param {string} kicker - 上标文字 (如 "QUALIFYING" 或 "RACE")
 * @param {string} target - 过渡后要显示的视图ID
 */
function raceTransition(title, sub, kicker, target) {
  const el = document.getElementById("sessionTransition");
  document.getElementById("transitionTitle").textContent = title;
  document.getElementById("transitionSub").textContent = sub;
  document.getElementById("transitionKicker").textContent =
    kicker || "RACE WEEKEND";
  el.classList.add("show");
  setTimeout(() => {
    showView(target);
  }, 280);
  setTimeout(() => {
    el.classList.remove("show");
  }, 720);
}

/**
 * 打开车手选择模态框
 *
 * 生成所有22名F1车手的选择网格
 * 显示车手号码、名字、国籍和车队
 */
function openDriverSelect() {
  document.getElementById("modalTitle").textContent =
    "SELECT YOUR DRIVER · 2026";
  document.getElementById("modalBody").innerHTML =
    '<div class="drivergrid">' +
    drivers
      .map((d, i) => {
        const p = driverProfiles[d[0]];
        return `<div class="driverchoice" onclick="chooseDriver(${i})"><span class="ovr">${d[2]}</span><b>#${p.number} ${d[0]}</b><small>${p.nation} · ${d[1]}</small></div>`;
      })
      .join("") +
    "</div>";
  document.getElementById("overlay").classList.add("open");
}

/**
 * 关闭模态框
 */
function closeOverlay() {
  document.getElementById("overlay").classList.remove("open");
}

/**
 * 选择车手并进入车手档案页面
 *
 * @param {number} i - 车手在drivers数组中的索引
 */
function chooseDriver(i) {
  selected = drivers[i];
  closeOverlay();
  renderProfile();
  showView("profile");
}

/**
 * 渲染车手档案页面
 *
 * 显示选中车手的详细信息：
 * - 姓名和车队
 * - 五项属性 (综合、经验、技巧、意识、速度) 的进度条
 */
function renderProfile() {
  if (!selected) return;
  const d = selected;
  document.getElementById("pname").textContent = d[0];
  document.getElementById("pteam").textContent = d[1];
  const attrs = [
    ["综合", d[2]],
    ["经验", d[3]],
    ["技巧", d[4]],
    ["意识", d[5]],
    ["速度", d[6]],
  ];
  document.getElementById("driverAttrs").innerHTML = attrs
    .map(
      (a) =>
        `<div class="attr"><span>${a[0]}</span><div class="bar"><div class="fill" style="width:${a[1]}%"></div></div><strong>${a[1]}</strong></div>`,
    )
    .join("");
}

/**
 * 打开2026赛历查看模态框
 * 显示所有23场大奖赛的日期和地点
 */
function openCalendar() {
  document.getElementById("modalTitle").textContent =
    "2026 REVISED RACE CALENDAR · CAREER START";
  document.getElementById("modalBody").innerHTML =
    '<div style="padding:15px"><div class="calendargrid">' +
    calendar
      .map(
        (r, i) =>
          `<div class="cal ${i === 0 ? "current" : ""}"><span class="r">R${String(r[0]).padStart(2, "0")}</span><b>${r[1]}</b><small>${r[2]} · ${r[3]}</small>${r[4] ? '<small class="sprint"> · SPRINT</small>' : ""}</div>`,
      )
      .join("") +
    "</div></div>";
  document.getElementById("overlay").classList.add("open");
}

/**
 * 开始生涯模式
 *
 * 初始化游戏状态：
 * 1. 重置所有车队性能为基础值
 * 2. 初始化玩家预算
 * 3. 初始化车手关系
 * 4. 初始化游戏状态
 * 5. 渲染生涯中心UI
 * 6. 自动保存游戏
 */
function startCareer() {
  // 重置车队性能到初始值
  Object.keys(teams).forEach((k) => delete teams[k]);
  Object.assign(teams, JSON.parse(JSON.stringify(baseTeams)));
  const t = teams[selected[1]];

  // 初始化游戏状态
  state.round = 1;
  state.budget = t.budget;
  state.projects = [];
  state.trainingUsed = false;
  state.prep = { round: 1, type: null, qual: 0, race: 0, control: 0 };
  state.prUsed = { team: null, driver: null };
  state.lastPR = { team: null, driver: null };
  state.driverRelations = buildInitialDriverRelations(selected[0]);
  state.relations = { principal: 65, engineer: 70 };
  state.driverPoints = 0;
  state.teamPoints = 0;
  state.history = [];
  resetWeekend();

  // 更新UI并保存
  renderHub();
  autosave();
  showView("career");
}
function renderHub() {
  completeProjects();
  ensurePrep();
  const r = calendar[Math.min(state.round - 1, calendar.length - 1)];
  document.getElementById("devCount").textContent = state.projects.length;
  const ts = document.getElementById("trainingStatus");
  if (ts)
    ts.textContent = state.trainingUsed
      ? prepPlanName(state.prep.type) || "已完成"
      : "未安排";
  document.getElementById("hubDriver").textContent = selected[0];
  document.getElementById("hubTeam").textContent = selected[1];
  document.getElementById("hubOvr").textContent = selected[2];
  document.getElementById("hubBudget").textContent =
    "€ " + state.budget.toFixed(1) + "M";
  document.getElementById("nextRace").textContent = r ? r[1] : "赛季结束";
  document.getElementById("nextDate").textContent = r
    ? r[2] + " · " + r[3]
    : "2026赛季已完成";
  document.getElementById("hubDate").textContent = r
    ? `ROUND ${String(state.round).padStart(2, "0")} · ${r[1].replace("大奖赛", "")}`
    : "SEASON COMPLETE";
  document.getElementById("driverPts").textContent = state.driverPoints;
  document.getElementById("teamPts").textContent = state.teamPoints;
  document.getElementById("roundStatus").textContent =
    Math.min(state.round, 23) + " / 23";
  const rmR = document.getElementById("raceModuleRound"),
    rmN = document.getElementById("raceModuleName");
  if (rmR) rmR.textContent = "ROUND " + String(state.round).padStart(2, "0");
  if (rmN) rmN.textContent = r ? r[1].replace("大奖赛", "") : "赛季结束";
  const a = [
    ["OVR", selected[2]],
    ["EXP", selected[3]],
    ["RAC", selected[4]],
    ["AWA", selected[5]],
    ["PAC", selected[6]],
  ];
  document.getElementById("hubDriverStats").innerHTML = a
    .map(
      (x) => `<div class="driverstat"><span>${x[0]}</span><b>${x[1]}</b></div>`,
    )
    .join("");
}
function openModule(id) {
  if (id === "development") {
    renderDevelopment();
    showView("development");
    return;
  }
  if (id === "media") {
    renderMedia();
    showView("media");
    return;
  }
  if (id === "race") {
    openRaceWeekend();
    return;
  }
}
function recalcTeamOvr(t) {
  const vals = Object.values(t.parts);
  t.ovr = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}
function completeProjects() {
  if (!selected || !state.projects.length) return;
  const t = teams[selected[1]];
  const finished = state.projects.filter((p) => state.round >= p.finish);
  if (!finished.length) return;
  finished.forEach((p) => {
    t.parts[p.part] = Math.min(100, t.parts[p.part] + p.gain);
  });
  state.projects = state.projects.filter((p) => state.round < p.finish);
  recalcTeamOvr(t);
}
function renderPerformanceTable() {
  const box = document.getElementById("performanceTable");
  if (!box) return;
  const keys = ["底板", "底盘", "前翼", "后翼", "悬挂", "冷却", "动力单元"];
  const rows = Object.entries(teams).sort((a, b) => b[1].ovr - a[1].ovr);
  box.innerHTML = `<div class="perfwrap"><table class="perftable"><thead><tr><th>#</th><th>车队</th><th>综合</th>${keys.map((k) => `<th>${k}</th>`).join("")}</tr></thead><tbody>${rows.map(([name, t], i) => `<tr class="${name === selected[1] ? "mine" : ""}"><td class="rank">${i + 1}</td><td class="teamname">${name}</td><td class="overall">${t.ovr}</td>${keys.map((k) => `<td>${t.parts[k]}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function renderDevelopment() {
  completeProjects();
  const t = teams[selected[1]];
  recalcTeamOvr(t);
  document.getElementById("devBudget").textContent =
    "€ " + state.budget.toFixed(1) + "M";
  const locked = state.projects.length > 0;
  document.getElementById("devParts").innerHTML =
    (locked
      ? '<div class="locknote">研发中心正在执行项目。当前项目完成前，所有新研发选项均已锁定。</div>'
      : "") +
    Object.entries(t.parts)
      .map(([k, v]) => {
        const cost = Math.max(5, Math.round((100 - v) * 0.28 + 3));
        const races = 3 + Math.floor(Math.random() * 3);
        return `<div class="devitem"><h3>${k} <span class="small">当前 ${v}</span></h3><div class="meta"><span>完成后随机 +1～+4</span><span>€${cost}M</span><span>${races} 场大奖赛</span></div><button class="mini" ${locked ? "disabled" : ""} onclick="startDev('${k}',${cost},${races})">${locked ? "研发中 · 锁定" : "开始研发"}</button></div>`;
      })
      .join("");
  renderProjects();
  renderPerformanceTable();
}
function startDev(part, cost, races) {
  if (state.projects.length) {
    alert("研发中心已有进行中的项目。必须等待该项目结束后才能选择下一项研发。");
    return;
  }
  if (state.budget < cost) {
    alert("研发预算不足");
    return;
  }
  const gain = 1 + Math.floor(Math.random() * 4);
  state.budget -= cost;
  state.projects.push({
    part,
    cost,
    races,
    gain,
    start: state.round,
    finish: state.round + races,
  });
  renderDevelopment();
  renderHub();
  autosave();
}
function renderProjects() {
  const box = document.getElementById("projects");
  if (!state.projects.length) {
    box.innerHTML =
      '<div class="hint">尚无研发项目。研发周期约为 3–5 场大奖赛，完成前不会改变赛车性能。</div>';
    return;
  }
  box.innerHTML = state.projects
    .map(
      (p) =>
        `<div class="project"><b>${p.part} · 研发进行中</b><small>R${String(p.start).padStart(2, "0")} 开始 → R${String(p.finish).padStart(2, "0")} 完成 · 剩余 ${Math.max(0, p.finish - state.round)} 场 · 实际提升完成后揭晓（+1～+4）</small></div>`,
    )
    .join("");
}
function ensurePrep() {
  if (!state.prep || state.prep.round !== state.round)
    state.prep = {
      round: state.round,
      type: null,
      qual: 0,
      race: 0,
      control: 0,
    };
  if (typeof state.trainingUsed !== "boolean")
    state.trainingUsed = !!state.prep.type;
}
function prepPlanName(type) {
  return (
    {
      qual: "单圈线路熟悉",
      race: "长距离模拟",
      starts: "起步与攻防演练",
      balanced: "完整周末模拟",
    }[type] || ""
  );
}
function baseFamiliarity() {
  const exp = selected ? selected[3] : 60;
  return Math.max(42, Math.min(62, Math.round(43 + exp * 0.19)));
}
function prepScores() {
  ensurePrep();
  const base = baseFamiliarity();
  return {
    qual: Math.min(100, base + (state.prep.qual || 0)),
    race: Math.min(100, base + (state.prep.race || 0)),
    control: state.prep.control || 0,
    base,
  };
}
function renderMedia() {
  const p = personnel[selected[1]];
  const teamUsed = state.prUsed.team === state.round;
  const driverUsed = state.prUsed.driver === state.round;
  const tq = document.getElementById("teamQuota"),
    dq = document.getElementById("driverQuota");
  tq.className = "quotabox " + (teamUsed ? "used" : "available");
  dq.className = "quotabox " + (driverUsed ? "used" : "available");
  tq.innerHTML = `<span>队内沟通 · 1 / 周</span><b><i class="quotadot"></i>${teamUsed ? "本周已安排" : "本周可用"}</b><small>${teamUsed ? state.lastPR.team || "下一比赛周恢复名额" : "领队 / 比赛工程师 二选一"}</small>`;
  dq.innerHTML = `<span>车手社交 · 1 / 周</span><b><i class="quotadot"></i>${driverUsed ? "本周已安排" : "本周可用"}</b><small>${driverUsed ? state.lastPR.driver || "下一比赛周恢复名额" : "另外 21 位车手中选择一人"}</small>`;
  const rels = [
    ["领队", p.principal, state.relations.principal, "principal"],
    [
      "比赛工程师 / RE",
      p.engineers[selected[0]] || "待确认",
      state.relations.engineer,
      "engineer",
    ],
  ];
  document.getElementById("teamRelations").innerHTML = rels
    .map(
      (r) =>
        `<div class="relation"><div class="relbar"><span><b style="color:#ddd">${r[0]}</b><div class="personrole">${r[1]}</div></span><div class="bar"><div class="goodfill" style="width:${r[2]}%"></div></div><strong>${r[2]}</strong></div><div class="actionrow"><button class="mini" ${teamUsed ? "disabled" : ""} onclick="openTeamPR('${r[3]}','${r[0]}','${String(r[1]).replace(/'/g, "\\'")}')">${teamUsed ? "本周名额已用" : "安排沟通"}</button></div></div>`,
    )
    .join("");
  const others = drivers.filter((d) => d[0] !== selected[0]);
  document.getElementById("driverRelations").innerHTML =
    `<div class="driverrail">${others
      .map((d) => {
        const v =
          state.driverRelations[d[0]] ?? relationshipBase(selected[0], d[0]);
        return `<div class="driverpill"><b>${d[0]} <span class="relationtag">${relationshipLabel(v)}</span></b><div class="personrole">${d[1]}</div><div class="pillscore"><span>关系</span><strong>${v}</strong></div><div class="bar"><div class="goodfill" style="width:${v}%"></div></div><button class="mini" ${driverUsed ? "disabled" : ""} onclick="openDriverPR('${String(d[0]).replace(/'/g, "\\'")}')">${driverUsed ? "本周名额已用" : "安排互动"}</button></div>`;
      })
      .join("")}</div>`;
}
function openTeamPR(k, role, name) {
  if (state.prUsed.team === state.round) {
    alert("本周的队内沟通名额已经使用。");
    return;
  }
  const actions =
    k === "engineer"
      ? [
          ["赛后技术复盘", "针对调校、轮胎和比赛反馈做一次完整复盘", 4],
          ["调校反馈会议", "把驾驶感受转化为下一站的设定方向", 3],
          ["策略沟通", "讨论策略偏好和比赛中的决策习惯", 2],
        ]
      : [
          ["一对一沟通", "与领队讨论近期表现和赛季目标", 3],
          ["赛季目标复盘", "确认车队期待、个人目标与阶段重点", 2],
          ["资源优先级沟通", "就研发与比赛资源表达自己的需求", 1],
        ];
  document.getElementById("modalTitle").textContent =
    `队内沟通 · ${role} · ${name}`;
  document.getElementById("modalBody").innerHTML =
    '<div class="actionpicker">' +
    actions
      .map(
        (a) =>
          `<div class="actionchoice" onclick="performTeamPR('${k}','${a[0]}',${a[2]})"><div><b>${a[0]}</b><small>${a[1]}</small></div><strong>关系 +${a[2]}</strong></div>`,
      )
      .join("") +
    "</div>";
  document.getElementById("overlay").classList.add("open");
}
function performTeamPR(k, action, delta) {
  state.relations[k] = Math.max(0, Math.min(100, state.relations[k] + delta));
  state.prUsed.team = state.round;
  state.lastPR.team = action;
  closeOverlay();
  renderMedia();
  autosave();
}
function openDriverPR(name) {
  if (state.prUsed.driver === state.round) {
    alert("本周的车手社交名额已经使用。");
    return;
  }
  const actions = [
    ["赛后交流", "比赛结束后在围场里聊几句，交换对比赛的看法", 3],
    ["联合媒体活动", "参加同一场官方拍摄、采访或赞助商活动", 2],
    ["车手会议后交流", "在车手会议结束后继续讨论规则或赛道问题", 2],
    ["赛后祝贺", "在对方取得好成绩后主动致意", 1],
  ];
  document.getElementById("modalTitle").textContent = `围场互动 · ${name}`;
  document.getElementById("modalBody").innerHTML =
    '<div class="actionpicker">' +
    actions
      .map(
        (a) =>
          `<div class="actionchoice" onclick="performDriverPR('${String(name).replace(/'/g, "\\'")}','${a[0]}',${a[2]})"><div><b>${a[0]}</b><small>${a[1]}</small></div><strong>关系 +${a[2]}</strong></div>`,
      )
      .join("") +
    "</div>";
  document.getElementById("overlay").classList.add("open");
}
function performDriverPR(name, action, delta) {
  state.driverRelations[name] = Math.max(
    0,
    Math.min(100, (state.driverRelations[name] ?? 50) + delta),
  );
  state.prUsed.driver = state.round;
  state.lastPR.driver = `${name} · ${action}`;
  closeOverlay();
  renderMedia();
  autosave();
}

const strategyDefs = {
  qual: {
    aggressive: {
      name: "激进 · 极限窗口",
      desc: "更晚出场、更少保留，把一次飞驰圈的上限放到第一位。成功时可以一次跳过多台车，但失误、交通和黄旗的代价也最大。",
      eventMod: 5,
      risk: 0.24,
      swing: "大幅上升空间 · 高波动",
    },
    normal: {
      name: "正常 · 标准计划",
      desc: "按常规节奏完成准备圈与飞驰圈，兼顾有效圈和赛道进化。多数情况下围绕赛车正常竞争力波动。",
      eventMod: 2,
      risk: 0.1,
      swing: "中等上升空间 · 中等波动",
    },
    conservative: {
      name: "保守 · 先拿有效圈",
      desc: "提前建立基准成绩并给黄旗、交通留余量。很难突然爆出极限圈，但也更不容易因为一次失误彻底掉出位置。",
      eventMod: 0,
      risk: 0.035,
      swing: "小幅上升空间 · 低波动",
    },
  },
  race: {
    aggressive: {
      name: "激进 · 主动进攻",
      desc: "更主动使用轮胎、电量和进站窗口来抢赛道位置。上限最高，但一旦判断错误，损失也会集中出现。",
      eventMod: 5,
      risk: 0.22,
      swing: "可能连续超越 · 也可能明显回落",
    },
    normal: {
      name: "正常 · 平衡执行",
      desc: "围绕车队预设窗口比赛，根据交通、轮胎和安全车调整，不主动放大也不刻意压低风险。",
      eventMod: 2,
      risk: 0.09,
      swing: "围绕当前竞争力上下波动",
    },
    conservative: {
      name: "保守 · 长距离管理",
      desc: "优先保护轮胎、避免低成功率攻防并确保把赛车带到终点。位置变化通常较小，爆发力有限。",
      eventMod: 0,
      risk: 0.025,
      swing: "更容易守住位置 · 上升幅度有限",
    },
  },
};
const trackProfiles = {
  澳大利亚大奖赛: {
    qual: "高速变向与刹车稳定性",
    race: "安全车概率高 · 前轮管理",
    window: "中性胎起步 / 一停倾向",
  },
  中国大奖赛: {
    qual: "长弯前轴与尾速平衡",
    race: "长直道攻防 · 前胎颗粒化",
    window: "一停与两停都有空间",
  },
  日本大奖赛: {
    qual: "S弯节奏与高速信心",
    race: "轮胎热衰减 · 赛道位置重要",
    window: "中性胎长stint",
  },
  迈阿密大奖赛: {
    qual: "慢弯牵引与长直道",
    race: "高温 · 安全车窗口",
    window: "硬胎延长窗口",
  },
  加拿大大奖赛: {
    qual: "重刹车与路肩使用",
    race: "刹车温度 · 安全车",
    window: "一停为主",
  },
  摩纳哥大奖赛: {
    qual: "排位几乎决定周末上限",
    race: "赛道位置压倒性重要",
    window: "等待安全车 / 超长stint",
  },
  "巴塞罗那-加泰罗尼亚大奖赛": {
    qual: "长弯空气动力效率",
    race: "高前胎负荷",
    window: "两停更有攻击性",
  },
  奥地利大奖赛: {
    qual: "短圈 · 赛道限制",
    race: "DRS列车与制动攻防",
    window: "一停为主",
  },
  英国大奖赛: {
    qual: "高速弯与阵风",
    race: "高能量弯角 · 天气变化",
    window: "天气可能改写窗口",
  },
  比利时大奖赛: {
    qual: "低下压力与天气",
    race: "超车多 · 局部天气",
    window: "轮胎与天气双变量",
  },
  匈牙利大奖赛: {
    qual: "排位重要 · 连续中速弯",
    race: "跟车困难 · undercut强",
    window: "偏两停",
  },
  荷兰大奖赛: {
    qual: "高倾角弯与阵风",
    race: "赛道位置重要",
    window: "一停 / 安全车变量",
  },
  意大利大奖赛: {
    qual: "低阻力 · 尾流与重刹",
    race: "尾速与制动稳定性",
    window: "一停为主",
  },
  阿塞拜疆大奖赛: {
    qual: "街道赛极限与尾速",
    race: "安全车 · 长直道",
    window: "窗口高度不确定",
  },
  新加坡大奖赛: {
    qual: "街道赛精度",
    race: "高温高湿 · 体能",
    window: "安全车影响巨大",
  },
  美国大奖赛: {
    qual: "高速S弯 + 慢弯牵引",
    race: "轮胎磨损与超车",
    window: "一停/两停开放",
  },
  墨西哥城大奖赛: {
    qual: "高海拔低空气密度",
    race: "冷却与刹车温度",
    window: "硬胎耐久关键",
  },
  圣保罗大奖赛: {
    qual: "短圈 · 天气快速变化",
    race: "天气与安全车",
    window: "策略波动很大",
  },
  拉斯维加斯大奖赛: {
    qual: "低温轮胎准备",
    race: "长直道与低抓地",
    window: "暖胎速度关键",
  },
  卡塔尔大奖赛: {
    qual: "高速连续弯",
    race: "轮胎负荷与体能",
    window: "强制式多停倾向",
  },
  阿布扎比大奖赛: {
    qual: "慢弯牵引与最后一段",
    race: "赛道位置 + undercut",
    window: "一停为主",
  },
};
const qualEvents = [
  {
    title: "最后一轮飞驰圈的出场窗口正在收窄",
    scene:
      "距离本节结束只剩 3 分 20 秒。维修区出口已经排起车队，工程师估计你如果现在出场，会在最后一个弯附近遇到两辆正在做准备圈的赛车。赛道还在继续变快，但再等 25 秒就可能只剩一次机会。",
    choices: [
      [
        "现在出场，自己处理交通",
        "你可以尝试在准备圈最后两个弯主动创造间隔。",
        82,
        0.18,
        "风险较高",
      ],
      [
        "再等二十秒，赌更干净的窗口",
        "赛道状态更好，但黄旗或出场拥堵都可能直接毁掉这一轮。",
        88,
        0.29,
        "高风险",
      ],
      [
        "立刻完成一圈保险，再看剩余时间",
        "先把有效圈装进口袋，第二圈轮胎状态不会完美。",
        72,
        0.05,
        "稳妥",
      ],
    ],
  },
  {
    title: "前轴温度没有进入目标窗口",
    scene:
      "准备圈最后一个慢弯结束后，方向盘提示左前胎温度低于目标。工程师问你是否要再做一次激烈蛇形和重刹来补温，但这会让后胎略微过热。",
    choices: [
      [
        "继续加热前胎，再开始飞驰圈",
        "前轴响应会更清晰，但后轴在最后一段可能开始滑。",
        80,
        0.13,
        "中风险",
      ],
      [
        "按计划直接推",
        "保持整车温度平衡，第一段需要更谨慎。",
        74,
        0.07,
        "较稳",
      ],
      [
        "放掉这一圈，重新准备",
        "牺牲时间，换取下一圈最完整的轮胎窗口。",
        78,
        0.11,
        "中风险",
      ],
    ],
  },
  {
    title: "最后一段出现慢车",
    scene:
      "你已经刷紫前两个计时段，但前方一辆刚完成飞驰圈的赛车正在慢速回场。工程师只能给你大约半秒钟做决定。",
    choices: [
      [
        "不收油，从外线直接处理",
        "如果对方及时让开，圈速损失最小。",
        86,
        0.25,
        "高风险",
      ],
      [
        "提前收一点油，换干净最后一弯",
        "会丢一点时间，但更容易保住有效圈。",
        76,
        0.06,
        "稳妥",
      ],
      [
        "放弃本圈，保护轮胎再来一次",
        "取决于剩余时间，下一圈可能更快也可能来不及。",
        79,
        0.16,
        "中风险",
      ],
    ],
  },
  {
    title: "赛道边界警告已经累计到最后一次",
    scene:
      "前一圈你在高速弯出口被删除圈速。现在只剩最后一套软胎，工程师提醒同一个位置的白线仍然很难判断，尤其在低油量下赛车会多向外漂半个车宽。",
    choices: [
      [
        "照旧压路肩，圈速优先",
        "如果控制住边界，这是理论最快线路。",
        88,
        0.28,
        "高风险",
      ],
      [
        "出口提前收半脚油门",
        "损失很小，但能大幅提高有效圈概率。",
        78,
        0.05,
        "稳妥",
      ],
      [
        "入口少带一点速度，换更早开油",
        "牺牲入弯峰值，尝试从出口把时间拿回来。",
        82,
        0.11,
        "中风险",
      ],
    ],
  },
  {
    title: "风向突然改变，上一圈的刹车点不再可靠",
    scene:
      "主直道尾风增强，工程师报告 1 号弯制动距离可能多出两到三米。你正处在一圈的最后准备阶段，没有时间再完整验证新刹车点。",
    choices: [
      [
        "按新风向直接修正刹车点",
        "相信工程师数据，立刻改变肌肉记忆。",
        84,
        0.14,
        "中风险",
      ],
      [
        "保持原点但增加一点刹车压力",
        "更容易锁胎，但不用完全重置节奏。",
        79,
        0.12,
        "中风险",
      ],
      [
        "提前两米制动，先保住第一段",
        "圈速上限降低，但第一弯事故风险最小。",
        72,
        0.035,
        "稳妥",
      ],
    ],
  },
  {
    title: "红旗后只剩一次真正的飞驰机会",
    scene:
      "赛道刚刚恢复绿旗，所有赛车都在抢同一个出场窗口。轮胎毯温度已经足够，但你无法再靠第二圈修正任何判断。",
    choices: [
      [
        "尽早排到出口最前面",
        "避免计时结束，却可能在赛道最脏的时候完成圈速。",
        80,
        0.1,
        "中风险",
      ],
      [
        "等主车群走掉再出场",
        "可能拿到更干净的空气，但留给自己的时间非常紧。",
        87,
        0.23,
        "高风险",
      ],
      [
        "跟在一台快车后面利用节奏",
        "能获得参照和一点尾流，也可能被对方准备圈拖慢。",
        83,
        0.15,
        "中风险",
      ],
    ],
  },
  {
    title: "软胎只剩一套，Q2 与 Q3 的取舍提前出现",
    scene:
      "车队估计你现在的圈速大概率足够晋级，但安全余量并不大。如果再用一套新软胎，Q3 可用的新胎会减少；如果不出场，就要承担赛道快速进化的风险。",
    choices: [
      [
        "留在车库，保住新胎",
        "把资源留给下一节，接受被最后一波圈速挤下去的风险。",
        80,
        0.18,
        "策略风险",
      ],
      [
        "旧软胎再跑一圈",
        "不给晋级留下太大风险，同时尽量保住最后一套新胎。",
        76,
        0.08,
        "平衡",
      ],
      [
        "直接上新软胎确保晋级",
        "本节最稳，但下一节少一套最有价值的轮胎。",
        84,
        0.04,
        "稳妥",
      ],
    ],
  },
  {
    title: "方向盘出现短暂换挡提示异常",
    scene:
      "系统没有报码，但上一圈出慢弯时升挡提示延迟了一瞬。工程师认为可能只是传感器抖动，也可能在下一圈重现。距离飞驰圈开始只剩两个弯。",
    choices: [
      [
        "继续飞驰圈，不改变操作",
        "问题如果不再出现，你不会损失任何时间。",
        84,
        0.2,
        "高风险",
      ],
      [
        "手动提前一点升挡",
        "牺牲一点牵引，降低再次触发异常的影响。",
        77,
        0.07,
        "稳妥",
      ],
      [
        "放弃本圈回维修区检查",
        "最安全，但可能错过这一节最好的赛道窗口。",
        68,
        0.04,
        "很稳",
      ],
    ],
  },
  {
    title: "前车给出尾流，但距离正在迅速缩短",
    scene:
      "你在长直道上吃到了明显尾流，计时预测正在变绿；但按照当前速度差，你会在下一组技术弯追到前车。如果现在退一点距离，直道红利会立刻消失。",
    choices: [
      [
        "继续贴住，把尾流吃到底",
        "直道收益最大，技术段交通风险也最高。",
        89,
        0.24,
        "高风险",
      ],
      [
        "直道末端提前松油创造间隔",
        "保留一部分尾流收益，并换回技术段净空。",
        82,
        0.09,
        "平衡",
      ],
      [
        "完全退出尾流，重新准备下一圈",
        "放弃本圈的优势，换一个完整干净圈。",
        74,
        0.06,
        "稳妥",
      ],
    ],
  },
  {
    title: "赛道温度突然下降，新胎启动速度变慢",
    scene:
      "云层遮住太阳后，赛道温度在十分钟内下降数度。第一圈使用新软胎的车手普遍第一段偏慢，但第二圈后胎又可能开始过热。",
    choices: [
      [
        "准备圈更激烈，第一圈就推",
        "争取立刻把胎叫醒，但后段温度可能过头。",
        84,
        0.17,
        "中高风险",
      ],
      [
        "第一圈建立胎温，第二圈全推",
        "理论上温度更完整，但会多消耗一次胎面。",
        86,
        0.12,
        "中风险",
      ],
      [
        "按原计划，不额外改变程序",
        "保持熟悉节奏，把变化交给驾驶修正。",
        74,
        0.06,
        "稳妥",
      ],
    ],
  },
];
const raceEvents = [
  {
    title: "虚拟安全车突然出现，窗口正好卡在你面前",
    scene:
      "前方赛车停在危险位置，VSC 已经启动。你距离维修区入口不到十秒，而原计划还要再跑六圈。工程师快速报出：现在进站会省下一大段时间，但第二段轮胎必须被迫拉长。",
    choices: [
      [
        "立即进站，吃掉VSC红利",
        "你会牺牲后段轮胎寿命换取即时赛道位置。",
        88,
        0.15,
        "机会很大",
      ],
      [
        "留在赛道，坚持原策略",
        "不会被突然拉长的stint拖累，但可能把便宜进站送给对手。",
        70,
        0.05,
        "稳妥",
      ],
      [
        "反向策略，换更硬的胎跑到底",
        "策略跨度最大，如果赛道位置合适可能直接跳过一批赛车。",
        84,
        0.24,
        "高风险",
      ],
    ],
  },
  {
    title: "前胎开始颗粒化，身后进入DRS",
    scene:
      "连续几圈你在中高速弯失去前轴，圈速比目标慢了约半秒。身后的赛车已经进入 DRS 区间，而正常进站窗口还差四圈。",
    choices: [
      [
        "继续push，优先打断对手DRS",
        "能守住赛道位置，但可能把轮胎彻底推过临界点。",
        82,
        0.22,
        "高风险",
      ],
      [
        "提前进站做undercut",
        "放弃眼前的位置，用新胎圈速尝试把对手切回来。",
        84,
        0.12,
        "中风险",
      ],
      [
        "开始管理，撑到原定窗口",
        "短期会更慢，但第二段更容易回到计划。",
        70,
        0.04,
        "稳妥",
      ],
    ],
  },
  {
    title: "天气雷达出现一小片雨云",
    scene:
      "工程师报告赛道另一端已经有零星雨点，但你的这一段仍是干地。预计两到四圈后才知道雨会不会真正覆盖赛道。",
    choices: [
      [
        "继续干胎全速跑，等明确降雨",
        "如果只是短暂飘雨，这是最快的选择。",
        86,
        0.23,
        "高风险",
      ],
      [
        "提前降低攻弯，观察两圈",
        "会损失一些时间，但可以避免湿地突然失控。",
        73,
        0.06,
        "稳妥",
      ],
      [
        "赌雨会扩大，提前换半雨胎",
        "如果判断正确会直接获得巨大优势，判断错误则会损失一整次进站。",
        92,
        0.34,
        "极高风险",
      ],
    ],
  },
  {
    title: "你已经贴到前车变速箱后方",
    scene:
      "前车直道速度很强，但在最后一组弯明显更慢。继续跟车会让前胎越来越热，工程师提醒你最好在两圈内做出处理。",
    choices: [
      [
        "下一次机会直接发动进攻",
        "尽快解决交通，接受轮对轮接触和锁死的风险。",
        85,
        0.19,
        "高风险",
      ],
      [
        "先观察一圈，布置下一次进攻",
        "多牺牲一圈轮胎，但可以寻找对方电量或防守习惯。",
        79,
        0.08,
        "中风险",
      ],
      [
        "拉开距离冷却轮胎，等待策略交叉",
        "不在赛道上硬解，把超越交给轮胎差。",
        69,
        0.035,
        "稳妥",
      ],
    ],
  },
  {
    title: "安全车即将结束，你的轮胎比前车更新",
    scene:
      "比赛控制刚刚宣布 Safety Car 本圈结束。你使用较新的中性胎，前车则已经跑了二十多圈。工程师提醒后方也有人用新胎，重启的第一圈会非常拥挤。",
    choices: [
      [
        "重启立刻进攻，不给前车升温机会",
        "利用轮胎差在第一圈直接解决位置。",
        89,
        0.22,
        "高风险",
      ],
      [
        "先守住后车，再找第二圈机会",
        "减少三车并排的概率，保留轮胎优势。",
        82,
        0.08,
        "平衡",
      ],
      [
        "优先把胎温拉起来",
        "放弃第一时间攻击，换后续几圈更稳定的抓地力。",
        74,
        0.04,
        "稳妥",
      ],
    ],
  },
  {
    title: "车队给出“Plan B”，需要你现在决定是否执行",
    scene:
      "对手已经提前进站，车队认为原定策略可能会被 undercut。Plan B 会让你延长当前 stint，并在后半程使用更快的轮胎，但这几圈必须在旧胎上顶住时间损失。",
    choices: [
      [
        "切到 Plan B，延长当前stint",
        "用后半程速度换现在的压力。",
        84,
        0.13,
        "中风险",
      ],
      [
        "坚持 Plan A，马上覆盖对手",
        "避免赛道位置被切走，但会进入对方熟悉的策略节奏。",
        80,
        0.08,
        "平衡",
      ],
      [
        "再等两圈，根据对手新胎速度决定",
        "信息更多，但可能已经来不及覆盖。",
        76,
        0.16,
        "策略风险",
      ],
    ],
  },
  {
    title: "刹车温度逼近警戒线",
    scene:
      "连续跟车后前刹温度持续上升，工程师要求你至少处理三圈。现在你仍在 DRS 内，一旦主动退开就可能失去下一次攻击机会。",
    choices: [
      [
        "继续贴住，短暂改变制动分配",
        "保持进攻位置，用驾驶调整来控制温度。",
        83,
        0.19,
        "高风险",
      ],
      [
        "退出DRS半圈冷却刹车",
        "主动丢一点时间，尽快恢复系统窗口。",
        72,
        0.04,
        "稳妥",
      ],
      [
        "直道多lift-and-coast但不退出DRS",
        "折中控制温度，圈速会小幅下降。",
        78,
        0.08,
        "平衡",
      ],
    ],
  },
  {
    title: "慢停让你从维修区出来后掉进车群",
    scene:
      "本次进站比预期慢了接近两秒。你重新上赛道时正好落在三台速度较慢的赛车后面，新胎最宝贵的前两圈正在被交通消耗。",
    choices: [
      [
        "立刻连续进攻，尽快清掉车群",
        "最大化新胎优势，但轮对轮风险连续叠加。",
        88,
        0.25,
        "高风险",
      ],
      [
        "一台一台处理，不强求同圈完成",
        "仍然利用胎差，但不把所有风险压在两圈内。",
        81,
        0.1,
        "平衡",
      ],
      [
        "先保护轮胎，等待对方进站周期",
        "损失新胎即时优势，换一个更安静的后半段。",
        70,
        0.04,
        "稳妥",
      ],
    ],
  },
  {
    title: "能量回收系统可用电量不足",
    scene:
      "连续几圈攻防后，工程师报告电量已经低于目标。下一条主直道仍有超车机会，但如果现在把剩余能量用完，之后两圈几乎无法防守。",
    choices: [
      [
        "把剩余能量全部用于这次进攻",
        "赌这一次超车能直接改变比赛局面。",
        87,
        0.22,
        "高风险",
      ],
      [
        "本圈充电，下一圈再进攻",
        "主动放弃一次机会，换更完整的下一轮攻击。",
        80,
        0.08,
        "平衡",
      ],
      [
        "开始管理，优先保证防守能力",
        "降低进攻欲望，让比赛回到稳定节奏。",
        72,
        0.035,
        "稳妥",
      ],
    ],
  },
  {
    title: "蓝旗车流打乱了你和对手的间隔",
    scene:
      "领先集团正在套圈慢车。你和前车之间的差距在两个弯内从 1.4 秒缩到 0.6 秒，但下一台慢车又可能把你挡住。工程师问是否要立即发动攻击。",
    choices: [
      [
        "利用混乱立即进攻",
        "机会窗口可能只有这一次，但线路会比正常超车更复杂。",
        88,
        0.23,
        "高风险",
      ],
      [
        "等慢车全部处理完再进攻",
        "失去突袭机会，换更清晰的两车对决。",
        78,
        0.07,
        "平衡",
      ],
      [
        "拉开一点距离保护前胎",
        "不被脏空气拖累，把机会留到下一阶段。",
        69,
        0.03,
        "稳妥",
      ],
    ],
  },
  {
    title: "前翼端板疑似轻微受损",
    scene:
      "刚才的并排争夺里你压过路肩，工程师从数据上看到前轴下压力略有下降，但暂时没有必要强制进站。接下来高速弯会明显更难。",
    choices: [
      [
        "继续比赛，不额外进站",
        "接受操控下降，尽量把损失控制在驾驶里。",
        79,
        0.16,
        "中风险",
      ],
      [
        "下次正常窗口提前进站并更换前翼",
        "多花维修时间，换回后半程完整速度。",
        82,
        0.1,
        "平衡",
      ],
      [
        "立即进站处理",
        "损失最大，但彻底排除损伤继续扩大的风险。",
        68,
        0.03,
        "稳妥",
      ],
    ],
  },
  {
    title: "最后十圈，身前与身后都在一秒以内",
    scene:
      "你夹在两台赛车之间：前车轮胎比你旧，后车却拥有更高直道速度。工程师表示剩余轮胎足够一次持续 push，但不够从现在开始每圈都全力。",
    choices: [
      [
        "先攻前车，把位置拿到手再防守",
        "主动决定比赛，轮胎和电量会快速消耗。",
        88,
        0.22,
        "高风险",
      ],
      [
        "维持节奏，等待前车轮胎掉速",
        "把决定拖到更有把握的时候。",
        80,
        0.08,
        "平衡",
      ],
      [
        "优先防守身后，确保当前名次",
        "降低丢位概率，但也可能错过前方机会。",
        71,
        0.035,
        "稳妥",
      ],
    ],
  },
];
const specialEvents = [
  {
    phase: "qual",
    race: "摩纳哥大奖赛",
    driver: "Charles Leclerc",
    title: "家乡排位：港口看台突然安静下来",
    scene:
      "Q3最后一次出场。你驶出 Rascasse 时，工程师提醒前方完全净空。这里没有真正的“安全圈”：Sainte Dévote、赌场弯和游泳池只要留一点余量，就可能是两三个发车位。",
    choices: [
      [
        "把最后一圈当成唯一的一圈",
        "从第一弯就完全进攻，接受擦墙风险。",
        94,
        0.28,
        "彩蛋 · 极限",
      ],
      [
        "前两段极限，最后一段留半步",
        "先建立优势，再确保赛车完整回到终点线。",
        86,
        0.12,
        "彩蛋",
      ],
      [
        "复制上一圈节奏，只吃赛道进化",
        "不额外冒险，把提升交给抓地力。",
        78,
        0.05,
        "彩蛋",
      ],
    ],
  },
  {
    phase: "qual",
    race: "意大利大奖赛",
    team: "Ferrari",
    title: "Monza：两台红车需要决定尾流顺序",
    scene:
      "Q3最后一轮出场前，车队发现单跑可能损失接近一个尾流优势。你和另一台 Ferrari 都需要干净圈，维修区正在等你的决定。",
    choices: [
      [
        "你先出场，给队友尾流",
        "牺牲一点自己的直道收益，换取更可控的准备圈。",
        78,
        0.06,
        "Ferrari 彩蛋",
      ],
      [
        "要求队友先走，你吃尾流",
        "理论圈速更快，但更容易在最后一弯追上前车。",
        91,
        0.21,
        "Ferrari 彩蛋",
      ],
      [
        "错开，两台车各跑自己的圈",
        "没有尾流红利，也不会互相干扰。",
        82,
        0.08,
        "Ferrari 彩蛋",
      ],
    ],
  },
  {
    phase: "race",
    race: "奥地利大奖赛",
    team: "Red Bull Racing",
    title: "主场看台前的进攻机会",
    scene:
      "重启后你紧贴前车进入 3 号弯。车队无线电非常简短：前车电量偏低，但你自己的后胎温度已经接近上限。",
    choices: [
      [
        "3号弯直接晚刹车",
        "主场最直接的进攻方式，成功就能立刻打开比赛。",
        91,
        0.25,
        "Red Bull 彩蛋",
      ],
      [
        "留到4号弯用更完整的DRS",
        "少一次并排风险，等待更稳的制动区。",
        84,
        0.11,
        "Red Bull 彩蛋",
      ],
      [
        "不进攻，先把轮胎温度降下来",
        "放弃眼前机会，保护下一段比赛。",
        70,
        0.04,
        "Red Bull 彩蛋",
      ],
    ],
  },
  {
    phase: "qual",
    race: "荷兰大奖赛",
    driver: "Max Verstappen",
    title: "橙色看台的最后一圈",
    scene:
      "风从海边方向横穿 7 号弯，最后一套软胎只剩一次机会。工程师告诉你，赛道刚刚又快了约十分之一。",
    choices: [
      [
        "完全相信前轴，最后一圈全压",
        "高倾角弯里几乎不留余量。",
        93,
        0.25,
        "主场彩蛋",
      ],
      [
        "第一段建立节奏，第二段再释放",
        "减少第一段出界风险，把攻击留给后半圈。",
        86,
        0.11,
        "主场彩蛋",
      ],
      [
        "先确保有效圈，不追最后十分之一",
        "把主场压力排除在驾驶之外。",
        77,
        0.04,
        "主场彩蛋",
      ],
    ],
  },
  {
    phase: "race",
    race: "英国大奖赛",
    team: "McLaren",
    title: "Silverstone：风向改变了高速弯平衡",
    scene:
      "Maggotts–Becketts 的横风比开赛时更强，前车在这一段明显犹豫。车队认为你的赛车在高速段仍有优势，但软胎已经过了最佳阶段。",
    choices: [
      [
        "高速段继续施压，Hangar直道完成超车",
        "利用赛车强项主动制造机会。",
        89,
        0.2,
        "McLaren 彩蛋",
      ],
      [
        "等下一次进站窗口用undercut解决",
        "不在高速弯承担并排风险。",
        83,
        0.1,
        "McLaren 彩蛋",
      ],
      [
        "先管理软胎，等待对手犯错",
        "风险低，但可能错过最佳窗口。",
        71,
        0.04,
        "McLaren 彩蛋",
      ],
    ],
  },
  {
    phase: "race",
    race: "美国大奖赛",
    team: "Cadillac",
    title: "Cadillac 的第一场美国主场战",
    scene:
      "COTA 看台和车队嘉宾区都盯着这场比赛。你正在积分区边缘，前车比你慢但防守很强。车队询问是否要为主场结果提前动用更激进的策略。",
    choices: [
      [
        "提前进站，主动做undercut",
        "把主场压力变成主动权。",
        88,
        0.16,
        "Cadillac 彩蛋",
      ],
      [
        "留在赛道，等正常窗口",
        "不让情绪改变原定比赛。",
        76,
        0.06,
        "Cadillac 彩蛋",
      ],
      [
        "延长stint，赌后段安全车",
        "如果机会出现收益巨大，否则会丢掉轮胎优势。",
        85,
        0.24,
        "Cadillac 彩蛋",
      ],
    ],
  },
  {
    phase: "qual",
    race: "巴塞罗那-加泰罗尼亚大奖赛",
    driver: "Fernando Alonso",
    title: "主场最后一次Q3尝试",
    scene:
      "看台在你驶过最后一个弯时突然爆发出声音。工程师报告前方净空，但你这一圈必须自己决定是否在高速弯多留一点余量。",
    choices: [
      [
        "利用经验把每个弯都压到边界",
        "不靠莽撞，用完整一圈积累时间。",
        90,
        0.16,
        "主场彩蛋",
      ],
      [
        "最后一段额外进攻",
        "前两段稳住，最后再拿风险换圈速。",
        86,
        0.18,
        "主场彩蛋",
      ],
      [
        "保持基准圈，不被主场氛围改变节奏",
        "稳定但上限略低。",
        77,
        0.04,
        "主场彩蛋",
      ],
    ],
  },
  {
    phase: "race",
    race: "摩纳哥大奖赛",
    driver: "Charles Leclerc",
    title: "摩纳哥：赛道位置比圈速更值钱",
    scene:
      "你在家门口的街道上被一列赛车压住，前车速度并不快，但几乎没有正常超车点。车队发现身后已经出现一个可以换胎的空窗。",
    choices: [
      [
        "提前进站赌undercut",
        "用新胎的少数几圈争取从维修区交换位置。",
        90,
        0.17,
        "主场彩蛋",
      ],
      [
        "继续留在赛道等待安全车",
        "摩纳哥的安全车概率让等待并非没有价值。",
        83,
        0.13,
        "主场彩蛋",
      ],
      [
        "坚持赛道位置，不主动做交换",
        "避免一次进站把自己直接送进更慢的车流。",
        76,
        0.04,
        "主场彩蛋",
      ],
    ],
  },
  {
    phase: "race",
    race: "荷兰大奖赛",
    driver: "Max Verstappen",
    title: "赞德沃特：主场重启",
    scene:
      "安全车离开后，橙色看台的声音几乎盖过无线电。你和前车都使用同规格轮胎，但你的温度准备更好，1号弯会是第一机会。",
    choices: [
      [
        "重启立刻强攻1号弯",
        "利用轮胎温度和主场节奏抢第一拍。",
        92,
        0.24,
        "主场彩蛋",
      ],
      [
        "把机会留给下一圈DRS",
        "不在最拥挤的重启阶段冒险。",
        84,
        0.09,
        "主场彩蛋",
      ],
      [
        "先守后车，建立正常节奏",
        "把主场情绪完全排除在比赛计划之外。",
        74,
        0.035,
        "主场彩蛋",
      ],
    ],
  },
  {
    phase: "race",
    race: "意大利大奖赛",
    team: "Ferrari",
    title: "Monza：看台要求进攻，但轮胎已经在掉",
    scene:
      "你在主直道上进入前车 DRS，红色看台已经站了起来。工程师却提醒后胎温度正在接近极限，再连续进攻两圈可能会影响整段 stint。",
    choices: [
      [
        "现在就发动进攻",
        "把赛道位置放在轮胎管理之前。",
        91,
        0.23,
        "Ferrari 彩蛋",
      ],
      [
        "先冷却一圈再进攻",
        "让看台再等一圈，换更完整的制动和牵引。",
        83,
        0.08,
        "Ferrari 彩蛋",
      ],
      [
        "交给策略，不在赛道上硬解",
        "保护轮胎，等待进站周期制造位置交换。",
        73,
        0.035,
        "Ferrari 彩蛋",
      ],
    ],
  },
  {
    phase: "qual",
    race: "英国大奖赛",
    driver: "Lando Norris",
    title: "Silverstone：最后一个高速段",
    scene:
      "Q3最后一圈已经进入最后两个计时段。前两个 sector 只差暂定杆位不到一成秒，Maggotts–Becketts 的风却比上一圈更乱。",
    choices: [
      [
        "高速段不留余量",
        "把差距全部压在自己最有信心的部分。",
        92,
        0.25,
        "主场彩蛋",
      ],
      [
        "只在Becketts最后一个方向变化留一点",
        "尽量保住高速收益，同时避免出界。",
        86,
        0.11,
        "主场彩蛋",
      ],
      [
        "复制上一圈，不追最后一点",
        "确保有效圈，把赛道进化当作主要提升来源。",
        78,
        0.04,
        "主场彩蛋",
      ],
    ],
  },
  {
    phase: "race",
    race: "澳大利亚大奖赛",
    driver: "Oscar Piastri",
    title: "墨尔本：主场的第一圈机会",
    scene:
      "Albert Park 第一圈车群仍然紧密，前车在 9–10 号高速变向前犹豫了一下。你的轮胎已经进入窗口，但外线会非常脏。",
    choices: [
      [
        "利用犹豫从外线并排",
        "主场第一圈就主动拿位置，风险也集中在高速变向。",
        90,
        0.24,
        "主场彩蛋",
      ],
      [
        "等下一条DRS直道",
        "放弃高风险外线，换更标准的超车机会。",
        83,
        0.08,
        "主场彩蛋",
      ],
      [
        "先稳住位置，让轮胎完全起来",
        "不让主场气氛改变第一圈计划。",
        74,
        0.035,
        "主场彩蛋",
      ],
    ],
  },
  {
    phase: "race",
    race: "加拿大大奖赛",
    driver: "Lance Stroll",
    title: "蒙特利尔：主场安全车窗口",
    scene:
      "安全车刚刚出动，你距离维修区入口很近。主看台开始躁动，而车队的模拟显示现在进站与留在赛道的净差距非常接近。",
    choices: [
      ["立刻进站拿新胎", "利用安全车成本抢主动权。", 88, 0.15, "主场彩蛋"],
      [
        "保持赛道位置",
        "如果后面还有安全车，你会保留更灵活的轮胎选择。",
        80,
        0.08,
        "主场彩蛋",
      ],
      [
        "换硬胎尝试直接跑到终点",
        "一次性把策略变得极端简单。",
        85,
        0.22,
        "主场彩蛋",
      ],
    ],
  },
  {
    phase: "qual",
    race: "墨西哥城大奖赛",
    driver: "Sergio Perez",
    title: "墨西哥城：体育场段前的最后一圈",
    scene:
      "最后一圈进入第三计时段，Foro Sol 看台的声音通过头盔都能听见。你的前两个 sector 已经比基准快，但慢速体育场段很容易因为后胎过热把时间吐回去。",
    choices: [
      [
        "最后一段继续全压",
        "把主场最后几弯当成决定性机会。",
        91,
        0.23,
        "主场彩蛋",
      ],
      [
        "提前保护后胎，确保牵引",
        "用更稳定的出口速度守住前两个 sector 的收益。",
        85,
        0.09,
        "主场彩蛋",
      ],
      [
        "复制上一圈的体育场段",
        "不再追加风险，只靠前半圈提升。",
        77,
        0.04,
        "主场彩蛋",
      ],
    ],
  },
  {
    phase: "race",
    race: "中国大奖赛",
    team: "Audi",
    title: "上海：新项目第一次面对长距离轮胎考验",
    scene:
      "连续长弯让前胎退化速度高于车队预估。作为新厂队项目，这套数据会直接影响之后几站的设定方向，但你眼下还在积分区边缘。",
    choices: [
      [
        "继续按比赛需求push",
        "先争结果，赛后再分析数据。",
        86,
        0.19,
        "Audi 彩蛋",
      ],
      [
        "开始管理并完整执行测试窗口",
        "牺牲眼前一点圈速，为后续研发留下更干净的数据。",
        76,
        0.04,
        "Audi 彩蛋",
      ],
      [
        "提前换胎，直接验证第二套方案",
        "把比赛和开发结合，但策略风险会被放大。",
        84,
        0.17,
        "Audi 彩蛋",
      ],
    ],
  },
];
function resetWeekend() {
  state.weekend = {
    qualStrategy: null,
    raceStrategy: null,
    qualResult: null,
    raceResult: null,
    qualField: null,
    pendingPhase: null,
    pendingEvent: null,
    lastDecision: null,
  };
}
function currentRace() {
  return calendar[Math.min(state.round - 1, calendar.length - 1)];
}
function getTrackProfile() {
  const r = currentRace();
  return (
    trackProfiles[r[1]] || {
      qual: "综合单圈表现",
      race: "轮胎与赛道位置",
      window: "根据实时情况调整",
    }
  );
}
function raceTarget() {
  const rank =
    Object.entries(teams)
      .sort((a, b) => b[1].ovr - a[1].ovr)
      .findIndex(([n]) => n === selected[1]) + 1;
  if (rank <= 2) return "前排 / 胜利";
  if (rank <= 4) return "Q3 / 领奖台机会";
  if (rank <= 7) return "积分区";
  return "争取进入Q2 / 抓住混乱";
}
function openRaceWeekend() {
  if (!selected) return;
  if (state.weekend.raceResult) {
    renderWeekendResult();
    showView("weekendresult");
  } else if (state.weekend.qualResult) {
    renderGrandPrix();
    raceTransition(
      "RACE DAY",
      `P${state.weekend.qualResult.position} START · ${currentRace()[1]}`,
      "SUNDAY · GRAND PRIX",
      "grandprix",
    );
  } else {
    renderQualifying();
    raceTransition(
      "RACE WEEKEND",
      currentRace()[1],
      "SATURDAY · QUALIFYING",
      "qualifying",
    );
  }
}
function renderStrategies(phase) {
  const box = document.getElementById(
    phase === "qual" ? "qualStrategies" : "raceStrategies",
  );
  if (!box) return;
  box.innerHTML = Object.entries(strategyDefs[phase])
    .map(
      ([k, v]) =>
        `<div class="strategychoice ${state.weekend[phase + "Strategy"] === k ? "selected" : ""}" onclick="selectRaceStrategy('${phase}','${k}')"><b>${v.name}</b><small>${v.desc}</small><span class="risk">${k === "aggressive" ? "高波动" : k === "normal" ? "平衡" : "低风险"}</span><span class="swing">${v.swing}</span><span class="approach">点击选择</span></div>`,
    )
    .join("");
}
function selectRaceStrategy(phase, key) {
  if (state.weekend[phase + "Result"]) return;
  state.weekend[phase + "Strategy"] = key;
  if (phase === "qual") renderQualifying();
  else renderGrandPrix();
}
function renderQualifying() {
  const r = currentRace(),
    tp = getTrackProfile();
  document.getElementById("qualBreadcrumb").textContent =
    `ROUND ${String(state.round).padStart(2, "0")} · ${r[2]}`;
  document.getElementById("qualRaceName").textContent = r[1];
  document.getElementById("qualRaceMeta").textContent =
    `${r[2]} · ${r[3]}${r[4] ? " · Sprint Weekend" : ""}`;
  document.getElementById("qualCarContext").textContent =
    `${selected[1]} · 性能 ${teams[selected[1]].ovr}`;
  document.getElementById("qualTrackContext").textContent = tp.qual;
  document.getElementById("qualTarget").textContent = raceTarget();
  document.getElementById("qualBrief").textContent =
    `排位将决定周日的赛道位置。工程师已经完成基础设定，你只需要决定这一节更偏向极限圈速还是稳定执行。`;
  const ps = prepScores();
  document.getElementById("qualWeekendInfo").textContent =
    `当前赛车在全场性能排名第 ${
      Object.entries(teams)
        .sort((a, b) => b[1].ovr - a[1].ovr)
        .findIndex(([n]) => n === selected[1]) + 1
    }。${tp.qual} 会明显影响今天的发挥。赛前模拟器准备：${state.trainingUsed ? prepPlanName(state.prep.type) : "未安排"}，排位熟练度 ${ps.qual}。`;
  document.getElementById("qualHistory").innerHTML = state.history.length
    ? state.history
        .slice(-3)
        .reverse()
        .map(
          (h) =>
            `<div>R${String(h.round).padStart(2, "0")} ${h.race} · 发车 P${h.grid} → 完赛 P${h.finish}</div>`,
        )
        .join("")
    : "<div>这是本赛季第一个比赛周末。</div>";
  renderStrategies("qual");
  document.getElementById("qualStart").disabled = !state.weekend.qualStrategy;
}
function renderGrandPrix() {
  if (!state.weekend.qualResult) {
    renderQualifying();
    showView("qualifying");
    return;
  }
  const r = currentRace(),
    tp = getTrackProfile(),
    q = state.weekend.qualResult;
  document.getElementById("raceBreadcrumb").textContent =
    `ROUND ${String(state.round).padStart(2, "0")} · ${r[2]}`;
  document.getElementById("gpRaceName").textContent = r[1];
  document.getElementById("gpRaceMeta").textContent =
    `${r[2]} · ${r[3]} · 正赛`;
  document.getElementById("gpGrid").textContent = `P${q.position}`;
  document.getElementById("gpWindow").textContent = tp.window;
  document.getElementById("gpFocus").textContent = tp.race;
  const ps = prepScores();
  document.getElementById("gpBrief").textContent =
    `排位已经结束，你将从 P${q.position} 发车。正赛计划会改变轮胎使用、攻防倾向和面对突发状况时的风险水平。当前正赛熟练度 ${ps.race}。`;
  renderStrategies("race");
  document.getElementById("raceStart").disabled = !state.weekend.raceStrategy;
  document.getElementById("qualGridPreview").innerHTML = renderClassification(
    q.field,
    10,
    false,
  );
}
function chooseEvent(phase) {
  const r = currentRace();
  const specials = specialEvents.filter(
    (e) =>
      e.phase === phase &&
      (!e.race || e.race === r[1]) &&
      (!e.team || e.team === selected[1]) &&
      (!e.driver || e.driver === selected[0]),
  );
  if (specials.length && Math.random() < 0.48)
    return {
      ...specials[Math.floor(Math.random() * specials.length)],
      special: true,
    };
  const arr = phase === "qual" ? qualEvents : raceEvents;
  return { ...arr[Math.floor(Math.random() * arr.length)], special: false };
}
function startRacePhase(phase) {
  const sk = state.weekend[phase + "Strategy"];
  if (!sk) {
    alert("请先选择本阶段的比赛计划。");
    return;
  }
  if (phase === "race" && !state.weekend.qualResult) {
    showView("qualifying");
    return;
  }
  const ev = chooseEvent(phase);
  state.weekend.pendingPhase = phase;
  state.weekend.pendingEvent = ev;
  document.getElementById("modalTitle").textContent =
    phase === "qual" ? "排位赛 · 临场决定" : "正赛 · 临场决定";
  document.getElementById("modalBody").innerHTML =
    `<div class="eventcard">${ev.special ? '<span class="easter">SPECIAL PADDOCK EVENT</span>' : ""}<div class="kicker">LIVE DECISION</div><h3>${ev.title}</h3><div class="eventscene">${ev.scene}</div>${ev.choices.map((c, i) => `<div class="eventchoice" onclick="resolveRaceEvent(${i})"><b>${c[0]}</b><span>${c[3]}</span><small>${c[1]}</small></div>`).join("")}</div>`;
  document.getElementById("overlay").classList.add("open");
}
function driverPhaseRating(d, phase) {
  return phase === "qual"
    ? d[6] * 0.58 + d[5] * 0.22 + d[2] * 0.2
    : d[4] * 0.48 + d[5] * 0.3 + d[6] * 0.12 + d[2] * 0.1;
}
function strategyPositionDelta(phase, key) {
  const r = Math.random();
  if (key === "aggressive") {
    if (r < 0.3) return -(2 + Math.floor(Math.random() * 6));
    if (r < 0.7) return 1 + Math.floor(Math.random() * 3);
    return Math.floor(Math.random() * 3) - 1;
  }
  if (key === "conservative") {
    if (r < 0.7) return Math.floor(Math.random() * 3) - 1;
    if (r < 0.9) return -(1 + Math.floor(Math.random() * 3));
    return 1 + Math.floor(Math.random() * 2);
  }
  return Math.floor(Math.random() * 7) - 3;
}
function applyStrategyToField(field, mineName, phase, key) {
  const idx = field.findIndex((x) => x.name === mineName);
  if (idx < 0) return field;
  const delta = strategyPositionDelta(phase, key),
    target = Math.max(0, Math.min(field.length - 1, idx + delta));
  if (target === idx) return field;
  const [mine] = field.splice(idx, 1);
  field.splice(target, 0, mine);
  return field;
}
function simulateAIField(phase) {
  return drivers
    .filter((d) => d[0] !== selected[0])
    .map((d) => {
      let eq = 48 + Math.random() * 38;
      if (phase === "race" && state.weekend.qualField) {
        const qpos =
          state.weekend.qualField.findIndex((x) => x.name === d[0]) + 1;
        if (qpos > 0) eq += Math.max(-5, (12 - qpos) * 0.45);
      }
      const luck = Math.random() * 100;
      const sc = computeScore(d, phase, Math.max(25, Math.min(95, eq)), luck);
      return { name: d[0], team: d[1], total: sc.total };
    });
}
function resolveRaceEvent(choiceIndex) {
  const phase = state.weekend.pendingPhase,
    ev = state.weekend.pendingEvent;
  if (!phase || !ev) return;
  const choice = ev.choices[choiceIndex],
    strategy = strategyDefs[phase][state.weekend[phase + "Strategy"]],
    ps = prepScores();
  let eventQuality = choice[2] + strategy.eventMod;
  const prepControl =
    (ps.control || 0) +
    (phase === "qual"
      ? (ps.qual - ps.base) * 0.16
      : (ps.race - ps.base) * 0.16);
  const risk = Math.max(
    0.01,
    Math.min(0.48, choice[3] + strategy.risk * 0.55 - prepControl * 0.006),
  );
  let outcome = "执行顺利";
  if (Math.random() < risk) {
    const loss = 10 + Math.random() * 22;
    eventQuality -= loss;
    outcome = loss > 22 ? "决定遭遇严重反噬" : "执行中出现损失";
  } else if (
    state.weekend[phase + "Strategy"] === "aggressive" &&
    Math.random() < 0.3
  ) {
    eventQuality += 4 + Math.random() * 8;
    outcome = "激进计划兑现了额外收益";
  } else if (
    state.weekend[phase + "Strategy"] === "conservative" &&
    Math.random() < 0.26
  ) {
    eventQuality += 2 + Math.random() * 4;
    outcome = "稳定执行避免了额外损失";
  }
  eventQuality = Math.max(15, Math.min(100, eventQuality));
  if (phase === "race" && state.weekend.qualResult)
    eventQuality = Math.max(
      15,
      Math.min(
        100,
        eventQuality + (12 - state.weekend.qualResult.position) * 0.35,
      ),
    );
  const luck = Math.random() * 100;
  const sc = computeScore(selected, phase, eventQuality, luck);
  let field = simulateAIField(phase);
  field.push({
    name: selected[0],
    team: selected[1],
    total: sc.total,
    mine: true,
  });
  field.sort((a, b) => b.total - a.total);
  field = applyStrategyToField(
    field,
    selected[0],
    phase,
    state.weekend[phase + "Strategy"],
  );
  field.forEach((x, i) => (x.position = i + 1));
  const mine = field.find((x) => x.mine);
  mine.field = field.map((x) => ({
    name: x.name,
    team: x.team,
    total: x.total,
    position: x.position,
    mine: !!x.mine,
  }));
  mine.note = `${strategy.name}；${choice[0]}。${outcome}。`;
  mine.choice = choice[0];
  mine.eventTitle = ev.title;
  mine.special = !!ev.special;
  mine.points = 0;
  if (phase === "qual") {
    state.weekend.qualResult = mine;
    state.weekend.qualField = field;
    state.weekend.raceStrategy = null;
    state.weekend.lastDecision = {
      phase,
      title: ev.title,
      choice: choice[0],
      outcome,
    };
    state.weekend.pendingPhase = null;
    state.weekend.pendingEvent = null;
    closeOverlay();
    autosave();
    renderGrandPrix();
    raceTransition(
      "QUALIFYING COMPLETE",
      `P${mine.position} · ${currentRace()[1]}`,
      "SUNDAY · GRAND PRIX",
      "grandprix",
    );
  } else {
    const pts = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
    mine.points = pts[mine.position - 1] || 0;
    state.weekend.raceResult = mine;
    state.driverPoints += mine.points;
    state.teamPoints += mine.points;
    state.history.push({
      round: state.round,
      race: currentRace()[1],
      grid: state.weekend.qualResult.position,
      finish: mine.position,
      points: mine.points,
    });
    state.weekend.lastDecision = {
      phase,
      title: ev.title,
      choice: choice[0],
      outcome,
    };
    state.weekend.pendingPhase = null;
    state.weekend.pendingEvent = null;
    closeOverlay();
    renderHub();
    autosave();
    renderWeekendResult();
    raceTransition(
      "CHEQUERED FLAG",
      `${selected[0]} · P${mine.position}`,
      "OFFICIAL CLASSIFICATION",
      "weekendresult",
    );
  }
}
function renderClassification(field, limit = 22, showScore = false) {
  if (!field) return '<div class="hint">暂无结果</div>';
  let rows = field
    .slice(0, limit)
    .map(
      (x) =>
        `<div class="resultrow ${x.mine ? "mine" : ""}"><span class="pos">P${x.position}</span><b>${x.name}</b><span class="rteam">${x.team}</span>${showScore ? `<strong>${x.total.toFixed(1)}</strong>` : ""}</div>`,
    )
    .join("");
  const mine = field.find((x) => x.mine);
  if (limit < 22 && mine && mine.position > limit)
    rows += `<div class="resultrow mine"><span class="pos">P${mine.position}</span><b>${mine.name}</b><span class="rteam">${mine.team}</span>${showScore ? `<strong>${mine.total.toFixed(1)}</strong>` : ""}</div>`;
  return `<div class="resultlist">${rows}</div>`;
}
function renderWeekendResult() {
  const rr = state.weekend.raceResult,
    q = state.weekend.qualResult,
    r = currentRace();
  if (!rr) {
    openRaceWeekend();
    return;
  }
  document.getElementById("resultBreadcrumb").textContent =
    `ROUND ${String(state.round).padStart(2, "0")} · ${r[2]}`;
  document.getElementById("finishPos").textContent = `P${rr.position}`;
  document.getElementById("finishDriver").textContent = selected[0];
  document.getElementById("finishTeam").textContent = selected[1];
  document.getElementById("finishGrid").textContent = `P${q.position}`;
  document.getElementById("finishPoints").textContent = `+${rr.points}`;
  document.getElementById("finishRound").textContent =
    `R${String(state.round).padStart(2, "0")}`;
  document.getElementById("resultRaceName").textContent = r[1];
  let movement = q.position - rr.position;
  document.getElementById("resultNarrative").textContent =
    movement > 0
      ? `从 P${q.position} 发车后净提升 ${movement} 个位置。比赛中的关键决定帮助你把赛车带到了 P${rr.position}。`
      : movement < 0
        ? `从 P${q.position} 发车，最终以 P${rr.position} 完赛。比赛中的事件和赛道位置让这场比赛比预期更困难。`
        : `从 P${q.position} 发车并以同一位置完赛。整场比赛的核心是守住节奏和赛道位置。`;
  document.getElementById("resultDecision").textContent =
    `关键事件：${rr.eventTitle}；你的选择：${rr.choice}。${rr.note}`;
  document.getElementById("finalClassification").innerHTML =
    renderClassification(rr.field, drivers.length, false);
}
function advanceRound() {
  if (!state.weekend.raceResult) return;
  if (state.round >= calendar.length) {
    alert(`2026赛季结束！你共获得 ${state.driverPoints} 分。`);
    autosave();
    showView("career");
    return;
  }
  state.round++;
  state.trainingUsed = false;
  state.prep = { round: state.round, type: null, qual: 0, race: 0, control: 0 };
  state.prUsed = { team: null, driver: null };
  state.lastPR = { team: null, driver: null };
  resetWeekend();
  completeProjects();
  renderHub();
  autosave();
  showView("career");
}

function openCareerDriverDetail() {
  if (!selected) return;
  const d = selected,
    p = driverProfiles[d[0]],
    attrs = [
      ["OVR", d[2]],
      ["EXP", d[3]],
      ["RAC", d[4]],
      ["AWA", d[5]],
      ["PAC", d[6]],
    ];
  const hist = state.history.length
    ? state.history
        .slice(-5)
        .reverse()
        .map(
          (h) =>
            `<div class="historyline"><b>${h.race}</b> · P${h.grid} → P${h.finish} · ${h.points}分</div>`,
        )
        .join("")
    : '<div class="historyline">2026 生涯尚未完成比赛。</div>';
  document.getElementById("modalTitle").textContent =
    "DRIVER PROFILE · CAREER HUB";
  document.getElementById("modalBody").innerHTML =
    `<div class="driverdetail"><div class="driverdetailtop"><div><div class="kicker">${p.nation} · ${d[1]}</div><div class="driverdetailname">${d[0]}</div><span class="driverbadge">#${p.number}</span><span class="driverbadge">F1 DEBUT ${p.debut}</span></div><div class="drivernumber">#${p.number}</div></div><div class="detailgrid"><div><h3 class="sectiontitle">当前能力</h3><div class="detailstats">${attrs.map((a) => `<div class="detailstat"><span>${a[0]}</span><b>${a[1]}</b></div>`).join("")}</div><h3 class="sectiontitle" style="margin-top:15px">进入 2026 前的现实履历</h3><div class="historyline"><b>2025：</b>${p.season2025}</div><div class="historyline"><b>代表成绩：</b>${p.best}</div></div><div><h3 class="sectiontitle">F1 生涯成绩</h3><div class="historygrid"><div class="historybox"><span>世界冠军</span><b>${p.titles}</b></div><div class="historybox"><span>胜利</span><b>${p.wins}</b></div><div class="historybox"><span>领奖台</span><b>${p.podiums}</b></div><div class="historybox"><span>杆位</span><b>${p.poles}</b></div></div><h3 class="sectiontitle" style="margin-top:15px">本存档最近成绩</h3>${hist}</div></div></div>`;
  document.getElementById("overlay").classList.add("open");
}

const SAVE_PREFIX = "f126sim_v7_";
function deepCloneForSave(value) {
  if (value === undefined) return undefined;
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_err) {
    return value;
  }
}
function normalizeLoadedState(savedState, fallbackState = {}) {
  // 如果有加载的状态，优先使用它，不做部分合并
  // 这确保从任何年份的存档读档时，数据完全恢复
  if (
    savedState &&
    typeof savedState === "object" &&
    Object.keys(savedState).length > 0
  ) {
    const incoming = deepCloneForSave(savedState);
    // 确保关键数组和对象字段存在
    if (!Array.isArray(incoming.history)) incoming.history = [];
    if (!Array.isArray(incoming.seasonResults)) incoming.seasonResults = [];
    if (
      !incoming.driverStandings ||
      typeof incoming.driverStandings !== "object"
    ) {
      incoming.driverStandings = {};
    }
    if (!incoming.teamStandings || typeof incoming.teamStandings !== "object") {
      incoming.teamStandings = {};
    }
    if (
      !incoming.driverSeasonStats ||
      typeof incoming.driverSeasonStats !== "object"
    ) {
      incoming.driverSeasonStats = {};
    }
    if (!incoming.weekend || typeof incoming.weekend !== "object") {
      incoming.weekend = {};
    }
    return incoming;
  }
  // 如果没有加载状态，使用备用状态
  const incoming = deepCloneForSave(savedState || {});
  const fallback = deepCloneForSave(fallbackState || {});
  const merged = {
    ...fallback,
    ...incoming,
  };
  merged.driverStandings = {
    ...deepCloneForSave(fallback.driverStandings || {}),
    ...deepCloneForSave(incoming.driverStandings || {}),
  };
  merged.teamStandings = {
    ...deepCloneForSave(fallback.teamStandings || {}),
    ...deepCloneForSave(incoming.teamStandings || {}),
  };
  merged.driverSeasonStats = {
    ...deepCloneForSave(fallback.driverSeasonStats || {}),
    ...deepCloneForSave(incoming.driverSeasonStats || {}),
  };
  if (!Array.isArray(merged.history)) merged.history = [];
  if (!Array.isArray(merged.seasonResults)) merged.seasonResults = [];
  if (!merged.weekend || typeof merged.weekend !== "object") {
    merged.weekend = deepCloneForSave(fallback.weekend || {});
  }
  return merged;
}
function snapshot() {
  // 确保所有关键字段在保存前存在并有效
  if (!state.driverStandings) state.driverStandings = {};
  if (!state.teamStandings) state.teamStandings = {};
  if (!state.driverSeasonStats) state.driverSeasonStats = {};
  if (!state.history) state.history = [];
  if (!state.seasonResults) state.seasonResults = [];
  return {
    version: 9,
    savedAt: new Date().toISOString(),
    selected: selected ? selected[0] : null,
    state: deepCloneForSave(state),
    teams: deepCloneForSave(teams),
  };
}
function restoreSnapshot(data) {
  if (!data || !data.selected) return false;
  const d = drivers.find((x) => x[0] === data.selected);
  if (!d) return false;
  selected = d;
  Object.keys(teams).forEach((k) => delete teams[k]);
  Object.assign(teams, deepCloneForSave(data.teams || baseTeams));
  // 完全用加载的状态替换当前状态，确保跨年份读档时数据完整恢复
  state = normalizeLoadedState(data.state);
  // 只在必要时补充关键关系数据
  if (!state.driverRelations || !Object.keys(state.driverRelations).length)
    state.driverRelations = buildInitialDriverRelations(selected[0]);
  ensureStateV11();
  ensurePrep();
  renderProfile();
  renderHub();
  return true;
}
function autosave() {
  if (!selected) return;
  try {
    localStorage.setItem(SAVE_PREFIX + "autosave", JSON.stringify(snapshot()));
    updateResumeButton();
  } catch (e) {}
}
function quickSave() {
  if (!selected) return;
  try {
    localStorage.setItem(SAVE_PREFIX + "slot1", JSON.stringify(snapshot()));
    autosave();
    alert("已保存到存档槽 1。");
  } catch (e) {
    alert("浏览器未允许本地存档。");
  }
}
function saveSlot(n) {
  if (!selected) {
    alert("当前没有可保存的生涯。");
    return;
  }
  try {
    localStorage.setItem(SAVE_PREFIX + "slot" + n, JSON.stringify(snapshot()));
    autosave();
    openSaveManager("save");
  } catch (e) {
    alert("浏览器未允许本地存档。");
  }
}
function loadSlot(n) {
  try {
    const raw = localStorage.getItem(SAVE_PREFIX + "slot" + n);
    if (!raw) {
      alert("这个存档槽是空的。");
      return;
    }
    if (restoreSnapshot(JSON.parse(raw))) {
      closeOverlay();
      showView("career");
      autosave();
    }
  } catch (e) {
    alert("存档读取失败。");
  }
}
function loadAutosave() {
  try {
    const raw = localStorage.getItem(SAVE_PREFIX + "autosave");
    if (!raw) return;
    if (restoreSnapshot(JSON.parse(raw))) {
      showView("career");
    }
  } catch (e) {}
}
function deleteSlot(n) {
  if (confirm("删除这个存档槽？")) {
    localStorage.removeItem(SAVE_PREFIX + "slot" + n);
    openSaveManager("load");
  }
}
function slotInfo(n) {
  try {
    const raw = localStorage.getItem(SAVE_PREFIX + "slot" + n);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}
function openSaveManager(mode = "load") {
  document.getElementById("modalTitle").textContent =
    mode === "save" ? "SAVE CAREER · 手动存档" : "LOAD CAREER · 读取存档";
  document.getElementById("modalBody").innerHTML = `<div class="savegrid">${[
    1, 2, 3,
  ]
    .map((n) => {
      const d = slotInfo(n);
      let p = d ? driverProfiles[d.selected] : null;
      return `<div class="savecard"><h3>存档槽 ${n}</h3><p>${d ? `${d.selected}<br>${d.state?.round ? `ROUND ${String(d.state.round).padStart(2, "0")}` : ""} · ${d.state?.driverPoints || 0}分<br>${new Date(d.savedAt).toLocaleString()}` : "空存档槽"}</p><div class="saveactions">${mode === "save" ? `<button class="mini" onclick="saveSlot(${n})">${d ? "覆盖" : "保存"}</button>` : `<button class="mini" ${d ? "" : "disabled"} onclick="loadSlot(${n})">读取</button>`}${d ? `<button class="mini" onclick="deleteSlot(${n})">删除</button>` : ""}</div></div>`;
    })
    .join(
      "",
    )}</div><div class="autosavenote">比赛结果、研发、公关与训练操作会同时写入自动存档。只要使用同一浏览器重新打开本页面，就可以从主菜单继续。</div>`;
  document.getElementById("overlay").classList.add("open");
}
function updateResumeButton() {
  const b = document.getElementById("resumeCareer"),
    t = document.getElementById("resumeText");
  if (!b) return;
  try {
    const raw = localStorage.getItem(SAVE_PREFIX + "autosave");
    if (raw) {
      const d = JSON.parse(raw);
      b.classList.add("show");
      if (t)
        t.textContent = `${d.selected} · ROUND ${String(d.state?.round || 1).padStart(2, "0")} · ${d.state?.driverPoints || 0}分`;
    } else b.classList.remove("show");
  } catch (e) {
    b.classList.remove("show");
  }
}
updateResumeButton();

/* legacy-script */

const CAR_ATTRS_V10 = [
  "动力单元",
  "空力效率",
  "赛车平衡",
  "机械抓地",
  "轮胎管理",
  "可靠性/冷却",
];
const CAR_BASE_V10 = {
  "Red Bull Racing": [80, 71, 68, 69, 68, 73],
  Ferrari: [72, 73, 76, 75, 73, 78],
  McLaren: [75, 76, 75, 74, 77, 70],
  Mercedes: [76, 73, 74, 72, 74, 69],
  "Racing Bulls": [78, 68, 69, 68, 67, 75],
  Alpine: [74, 65, 66, 66, 64, 68],
  Audi: [63, 65, 66, 65, 65, 63],
  "Haas F1 Team": [71, 62, 61, 63, 60, 76],
  Williams: [74, 61, 60, 65, 58, 67],
  "Aston Martin": [57, 64, 62, 65, 63, 54],
  Cadillac: [70, 53, 51, 56, 52, 68],
};
const TEAM_PRESTIGE_V10 = {
  Mercedes: 96,
  Ferrari: 95,
  McLaren: 94,
  "Red Bull Racing": 94,
  "Aston Martin": 82,
  Williams: 78,
  Audi: 77,
  Alpine: 74,
  "Racing Bulls": 72,
  "Haas F1 Team": 68,
  Cadillac: 66,
};
const BIG_TEAMS_V10 = new Set([
  "Mercedes",
  "Ferrari",
  "McLaren",
  "Red Bull Racing",
]);
const TRACK_DEMANDS_V10 = {
  墨尔本: { q: [15, 25, 25, 20, 10, 5], r: [12, 20, 20, 18, 20, 10] },
  上海: { q: [20, 20, 22, 15, 15, 8], r: [18, 18, 18, 14, 22, 10] },
  铃鹿: { q: [10, 32, 30, 12, 11, 5], r: [10, 25, 23, 10, 25, 7] },
  迈阿密: { q: [22, 15, 18, 28, 10, 7], r: [18, 14, 16, 22, 20, 10] },
  蒙特利尔: { q: [28, 10, 14, 30, 10, 8], r: [24, 8, 12, 24, 16, 16] },
  蒙特卡洛: { q: [5, 15, 28, 38, 10, 4], r: [4, 12, 23, 30, 19, 12] },
  "巴塞罗那-加泰罗尼亚": {
    q: [12, 30, 28, 12, 13, 5],
    r: [10, 25, 23, 10, 25, 7],
  },
  斯皮尔伯格: { q: [25, 18, 20, 22, 10, 5], r: [22, 15, 17, 18, 18, 10] },
  银石: { q: [12, 32, 28, 12, 11, 5], r: [10, 27, 23, 10, 23, 7] },
  "斯帕-弗朗科尔尚": { q: [28, 28, 20, 10, 9, 5], r: [24, 24, 18, 8, 18, 8] },
  布达佩斯: { q: [8, 20, 28, 30, 10, 4], r: [6, 18, 23, 25, 22, 6] },
  赞德沃特: { q: [10, 28, 30, 18, 10, 4], r: [8, 23, 25, 16, 22, 6] },
  蒙扎: { q: [38, 30, 10, 14, 4, 4], r: [32, 25, 10, 14, 10, 9] },
  马德里: { q: [18, 20, 22, 25, 10, 5], r: [15, 18, 18, 22, 18, 9] },
  巴库: { q: [35, 18, 12, 25, 5, 5], r: [30, 15, 10, 20, 12, 13] },
  雪邦: { q: [18, 25, 22, 15, 14, 6], r: [15, 20, 18, 13, 23, 11] },
  滨海湾: { q: [8, 15, 25, 34, 10, 8], r: [6, 12, 20, 28, 20, 14] },
  奥斯汀: { q: [16, 25, 24, 20, 10, 5], r: [14, 20, 20, 18, 20, 8] },
  墨西哥城: { q: [24, 18, 18, 20, 10, 10], r: [20, 15, 15, 18, 17, 15] },
  因特拉格斯: { q: [18, 20, 22, 20, 15, 5], r: [15, 17, 18, 17, 22, 11] },
  拉斯维加斯: { q: [38, 22, 10, 20, 6, 4], r: [32, 18, 10, 18, 12, 10] },
  卢赛尔: { q: [14, 30, 28, 10, 13, 5], r: [12, 24, 22, 8, 26, 8] },
  亚斯码头: { q: [20, 18, 20, 25, 12, 5], r: [16, 16, 18, 20, 20, 10] },
};
const RACE_EXTRA_V10 = [
  {
    title: "一号弯后轮胎出现明显平点",
    scene:
      "刚才为了避免前车你短暂锁死了右前胎。方向盘震动已经能感觉到，但工程师认为仍可继续比赛。下一次正常进站窗口还有八圈。",
    choices: [
      [
        "继续撑到原窗口",
        "避免额外进站，但高速弯震动会持续放大。",
        74,
        0.15,
        "中风险",
        { dnfRisk: 0.015 },
      ],
      [
        "提前进站换胎",
        "失去赛道位置，换回完整的轮胎状态。",
        80,
        0.06,
        "平衡",
        { posMod: 1 },
      ],
      [
        "继续push，不让前车拉开",
        "不接受圈速损失，轮胎结构风险会更高。",
        86,
        0.25,
        "高风险",
        { dnfRisk: 0.045 },
      ],
    ],
  },
  {
    title: "对手在你出站圈发起强硬攻击",
    scene:
      "你的新胎尚未完全进入窗口，对手已经利用热胎贴到侧箱位置。接下来两个弯都可以并排通过，但任何一次碰撞都可能损伤前翼或悬挂。",
    choices: [
      [
        "守住内线，不主动让出位置",
        "保住赛道位置，接触风险最高。",
        86,
        0.24,
        "高风险",
        { dnfRisk: 0.035 },
      ],
      [
        "留一个车宽并尝试交叉线",
        "允许短暂并排，用下一弯重新拿回主动。",
        82,
        0.1,
        "平衡",
        {},
      ],
      [
        "不纠缠，先把轮胎带起来",
        "主动丢掉一个位置，换后续完整速度。",
        70,
        0.03,
        "稳妥",
        { posMod: 1 },
      ],
    ],
  },
  {
    title: "赛车底板在路肩上遭到重击",
    scene:
      "刚才高速切弯时车底发出明显撞击声。数据暂时没有结构性报警，但下压力读数出现轻微波动。工程师问你是否需要立刻改变驾驶方式。",
    choices: [
      [
        "继续原节奏",
        "如果只是瞬时读数，你不会损失时间。",
        82,
        0.18,
        "中高风险",
        { dnfRisk: 0.025 },
      ],
      [
        "减少攻击路肩",
        "每圈损失少量时间，显著降低进一步损伤。",
        75,
        0.05,
        "稳妥",
        {},
      ],
      [
        "进站检查底板",
        "几乎肯定掉出当前集团，但能排除结构风险。",
        62,
        0.02,
        "非常保守",
        { posMod: 3 },
      ],
    ],
  },
  {
    title: "最后一次进站后你拥有明显轮胎优势",
    scene:
      "前方两台车的轮胎都比你旧十圈以上，但比赛只剩七圈。工程师认为理论上有机会连续完成两次超车，只是每一次都会消耗大量电量。",
    choices: [
      [
        "连续进攻，两台都要",
        "把轮胎差全部兑现，接触与过热风险显著上升。",
        91,
        0.27,
        "极限",
        { dnfRisk: 0.035, posMod: -1 },
      ],
      [
        "先解决最近的一台",
        "把目标拆开，保留一部分电量应对最后几圈。",
        84,
        0.11,
        "平衡",
        {},
      ],
      [
        "只在绝对机会出现时进攻",
        "更容易把现有成绩带回来，但可能浪费轮胎优势。",
        73,
        0.04,
        "稳妥",
        {},
      ],
    ],
  },
  {
    title: "车队发现燃油消耗高于模型",
    scene:
      "剩余里程与燃油预测出现偏差。若继续当前速度，最后几圈需要明显 lift-and-coast；现在开始管理，则会立刻损失圈速。",
    choices: [
      [
        "现在开始管理燃油",
        "把损失平均摊开，最后阶段仍可正常攻防。",
        78,
        0.05,
        "稳妥",
        {},
      ],
      [
        "维持速度，最后五圈再集中管理",
        "先守住赛道位置，但最后阶段会很被动。",
        83,
        0.13,
        "中风险",
        {},
      ],
      [
        "继续全速，赌安全车或短比赛",
        "如果没有中和，最后阶段风险非常大。",
        89,
        0.29,
        "高风险",
        { dnfRisk: 0.02 },
      ],
    ],
  },
  {
    title: "前方两车开始互相缠斗",
    scene:
      "你原本落后前车 2.4 秒，但他们连续并排后差距已经缩到 0.8 秒。轮胎仍在工作窗口，工程师提醒这是不用额外消耗就能接近的机会。",
    choices: [
      [
        "立刻加入战斗",
        "三车缠斗可能让你一次拿两个位置，也可能把所有人拖慢。",
        89,
        0.22,
        "高风险",
        { dnfRisk: 0.025, posMod: -1 },
      ],
      [
        "留半秒观察冲突",
        "等待其中一人犯错，再选择最安全的线路。",
        84,
        0.09,
        "平衡",
        {},
      ],
      [
        "不改变节奏",
        "避免卷入事故，把比赛交给正常策略。",
        73,
        0.03,
        "稳妥",
        {},
      ],
    ],
  },
  {
    title: "动力单元进入保护模式提示",
    scene:
      "主直道末端，工程师报告能量系统出现瞬时温度峰值。系统尚未强制降功率，但如果继续全额部署，保护模式可能自动介入。",
    choices: [
      [
        "维持全额部署",
        "保住当前攻防能力，温度继续上升。",
        87,
        0.23,
        "高风险",
        { dnfRisk: 0.06 },
      ],
      [
        "降低部署两圈",
        "会失去一点尾速，但有机会把系统拉回窗口。",
        77,
        0.06,
        "稳妥",
        { dnfRisk: 0.005 },
      ],
      [
        "大幅管理，确保完赛",
        "接受明显圈速损失，优先把赛车带回终点。",
        66,
        0.02,
        "非常保守",
        { posMod: 2 },
      ],
    ],
  },
  {
    title: "雨后干线正在快速形成",
    scene:
      "赛道大部分仍潮湿，但赛车已经开始集中压出一条干线。半雨胎温度正在上升，干胎却仍然可能在离线区域瞬间失去抓地。",
    choices: [
      [
        "抢先换干胎",
        "如果干线继续扩大，你会获得一到两圈巨大优势。",
        93,
        0.34,
        "赌博",
        { dnfRisk: 0.025 },
      ],
      ["等待一圈确认", "放弃最早窗口，降低选错胎的概率。", 81, 0.1, "平衡", {}],
      [
        "继续半雨胎直到完全干燥",
        "最安全，但很可能被提前换胎的赛车undercut。",
        70,
        0.04,
        "稳妥",
        { posMod: 1 },
      ],
    ],
  },
];

function setupCarsV10() {
  Object.entries(CAR_BASE_V10).forEach(([name, vals]) => {
    const shape = {};
    CAR_ATTRS_V10.forEach((a, i) => (shape[a] = vals[i]));
    if (!baseTeams[name]) baseTeams[name] = { budget: 100, dev: 85, parts: {} };
    baseTeams[name].parts = JSON.parse(JSON.stringify(shape));
    baseTeams[name].ovr = Math.round(
      vals.reduce((a, b) => a + b, 0) / vals.length,
    );
    if (teams[name]) {
      teams[name].parts = JSON.parse(JSON.stringify(shape));
      teams[name].ovr = baseTeams[name].ovr;
    }
  });
}
setupCarsV10();
function teamCarIndexV10(name) {
  const t = teams[name];
  return (
    CAR_ATTRS_V10.reduce((s, a) => s + (t.parts[a] || 50), 0) /
    CAR_ATTRS_V10.length
  );
}
function recalcTeamOvr(t) {
  t.ovr = Math.round(
    CAR_ATTRS_V10.reduce((s, a) => s + (t.parts[a] || 50), 0) /
      CAR_ATTRS_V10.length,
  );
  return t.ovr;
}
function teammateV10(name = selected?.[0]) {
  const d = drivers.find((x) => x[0] === name);
  return d ? drivers.find((x) => x[1] === d[1] && x[0] !== name) : null;
}
function ensureStateV10() {
  if (!state.driverStandings) {
    state.driverStandings = {};
    drivers.forEach((d) => (state.driverStandings[d[0]] = 0));
  }
  if (!state.teamStandings) {
    state.teamStandings = {};
    Object.keys(teams).forEach((t) => (state.teamStandings[t] = 0));
  }
  if (!state.driverSeasonStats) {
    state.driverSeasonStats = {};
    drivers.forEach(
      (d) =>
        (state.driverSeasonStats[d[0]] = {
          wins: 0,
          podiums: 0,
          poles: 0,
          dnfs: 0,
        }),
    );
  }
  if (state.teamRelation == null) {
    const tm = teammateV10();
    state.teamRelation = tm
      ? Math.max(35, Math.min(82, relationshipBase(selected?.[0], tm[0])))
      : 60;
  }
  if (!state.rivalry)
    state.rivalry = {
      playerAhead: 0,
      teammateAhead: 0,
      orders: 0,
      clashes: 0,
      streak: 0,
    };
  if (!state.contract)
    state.contract = {
      nextTeam: null,
      signedRound: null,
      offers: [],
      lastRefresh: 0,
    };
  if (!state.aiDevNews) state.aiDevNews = [];
  if (!state.aiPrep) state.aiPrep = {};
  if (!state.teamWeekEvent) state.teamWeekEvent = null;
  if (!state.seasonResults) state.seasonResults = [];
  if (state.teamWeekModifier == null) state.teamWeekModifier = 0;
  ensureAITrainingV10();
  state.driverPoints = selected ? state.driverStandings[selected[0]] || 0 : 0;
  state.teamPoints = selected ? state.teamStandings[selected[1]] || 0 : 0;
}
function relationStatusV10(v = state.teamRelation) {
  return v >= 72
    ? "关系良好"
    : v >= 55
      ? "风平浪静"
      : v >= 38
        ? "略有摩擦"
        : "矛盾严重";
}
function currentDemandV10(phase = "race", round = state.round) {
  const r = calendar[Math.min(round - 1, calendar.length - 1)];
  const d = TRACK_DEMANDS_V10[r?.[2]] || {
    q: [17, 20, 20, 18, 15, 10],
    r: [15, 18, 18, 17, 20, 12],
  };
  return phase === "qual" ? d.q : d.r;
}
function topNeedsV10(phase = "race", round = state.round, n = 2) {
  const w = currentDemandV10(phase, round);
  return CAR_ATTRS_V10.map((a, i) => [a, w[i]])
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map((x) => x[0]);
}
function carRankAtTrackV10(team, phase = "race", round = state.round) {
  return (
    Object.keys(teams)
      .map((n) => [n, trackFitV10(n, phase, round)])
      .sort((a, b) => b[1] - a[1])
      .findIndex((x) => x[0] === team) + 1
  );
}
function driverRankV10(name = selected?.[0]) {
  ensureStateV10();
  return (
    Object.entries(state.driverStandings)
      .sort(
        (a, b) =>
          b[1] - a[1] ||
          drivers.findIndex((d) => d[0] === a[0]) -
            drivers.findIndex((d) => d[0] === b[0]),
      )
      .findIndex((x) => x[0] === name) + 1
  );
}
function teamRankV10(name = selected?.[1]) {
  ensureStateV10();
  return (
    Object.entries(state.teamStandings)
      .sort((a, b) => b[1] - a[1])
      .findIndex((x) => x[0] === name) + 1
  );
}
function expectedRangeV10(phase = "race") {
  const base = drivers
    .map((d) => {
      const car = trackFitV10(d[1], phase),
        dr = driverPhaseRating(d, phase),
        prep =
          d[0] === selected?.[0]
            ? 0
            : (state.aiPrep[d[0]]?.[phase === "qual" ? "qual" : "race"] || 0) *
              0.18;
      return { name: d[0], score: car * 0.86 + dr * 0.14 + prep };
    })
    .sort((a, b) => b.score - a.score);
  const p = base.findIndex((x) => x.name === selected[0]) + 1;
  return [Math.max(1, p - 2), Math.min(drivers.length, p + 2), p];
}

renderProfile = function () {
  if (!selected) return;
  const d = selected;
  document.getElementById("pname").textContent = d[0];
  document.getElementById("pteam").textContent = d[1];
  const attrs = [
    ["综合", d[2]],
    ["经验", d[3]],
    ["技巧", d[4]],
    ["意识", d[5]],
    ["速度", d[6]],
  ];
  document.getElementById("driverAttrs").innerHTML = attrs
    .map(
      (a) =>
        `<div class="attr"><span>${a[0]}</span><div class="bar"><div class="fill" style="width:${a[1]}%"></div></div><strong>${a[1]}</strong></div>`,
    )
    .join("");
};
startCareer = function () {
  setupCarsV10();
  Object.keys(teams).forEach((k) => {
    teams[k] = JSON.parse(JSON.stringify(baseTeams[k]));
  });
  const t = teams[selected[1]];
  state = {
    round: 1,
    budget: t.budget,
    projects: [],
    trainingUsed: false,
    prep: { round: 1, type: null, qual: 0, race: 0, control: 0 },
    relations: { principal: 65, engineer: 70 },
    driverRelations: {},
    prUsed: {},
    lastPR: {},
    driverPoints: 0,
    teamPoints: 0,
    history: [],
    driverStandings: {},
    teamStandings: {},
    driverSeasonStats: {},
    seasonResults: [],
    aiDevNews: [],
    aiPrep: {},
    teamWeekEvent: null,
    teamWeekModifier: 0,
    rivalry: {
      playerAhead: 0,
      teammateAhead: 0,
      orders: 0,
      clashes: 0,
      streak: 0,
    },
    contract: { nextTeam: null, signedRound: null, offers: [], lastRefresh: 0 },
    weekend: {},
  };
  drivers.forEach((d) => {
    state.driverStandings[d[0]] = 0;
    state.driverSeasonStats[d[0]] = { wins: 0, podiums: 0, poles: 0, dnfs: 0 };
  });
  Object.keys(teams).forEach((n) => (state.teamStandings[n] = 0));
  const tm = teammateV10();
  state.teamRelation = tm
    ? Math.max(35, Math.min(82, relationshipBase(selected[0], tm[0])))
    : 60;
  resetWeekend();
  ensureAITrainingV10(true);
  refreshContractMarketV10(true);
  renderHub();
  autosave();
  showView("career");
};

resetWeekend = function () {
  state.weekend = {
    qualStrategy: null,
    raceStrategy: null,
    qualResult: null,
    raceResult: null,
    qualField: null,
    pendingPhase: null,
    pendingEvent: null,
    eventQueue: [],
    eventIndex: 0,
    eventSum: 0,
    eventCount: 0,
    eventRisk: 0,
    dnfRisk: 0,
    positionMod: 0,
    eventNotes: [],
    lastDecision: null,
    attritionFactor: 0.55 + Math.random() * 1.7,
  };
};
function ensureAITrainingV10(force = false) {
  if (!selected) return;
  if (
    !force &&
    state.aiPrepRound === state.round &&
    state.aiPrep &&
    Object.keys(state.aiPrep).length
  )
    return;
  state.aiPrep = {};
  drivers.forEach((d) => {
    if (d[0] === selected[0]) return;
    const exp = d[3],
      base = 1 + Math.random() * 4 + (exp > 85 ? 1 : 0);
    const focus = Math.random();
    state.aiPrep[d[0]] = {
      qual: Math.round(base + (focus < 0.34 ? 4 : 0)),
      race: Math.round(base + (focus > 0.66 ? 4 : 0)),
      control: Math.round(1 + Math.random() * 4),
    };
  });
  state.aiPrepRound = state.round;
}

renderHub = function () {
  ensureStateV10();
  completeProjects();
  ensurePrep();
  refreshContractMarketV10();
  const r = calendar[Math.min(state.round - 1, calendar.length - 1)],
    fr = expectedRangeV10("race");
  document.getElementById("devCount").textContent = state.projects.length;
  document.getElementById("trainingStatus").textContent = state.trainingUsed
    ? prepPlanName(state.prep.type) || "已完成"
    : "未安排";
  document.getElementById("hubDriver").textContent = selected[0];
  document.getElementById("hubTeam").textContent = selected[1];
  document.getElementById("hubOvr").textContent = selected[2];
  document.getElementById("hubBudget").textContent =
    "€ " + state.budget.toFixed(1) + "M";
  document.getElementById("nextRace").textContent = r ? r[1] : "赛季结束";
  document.getElementById("nextDate").textContent = r
    ? r[2] + " · " + r[3]
    : "2026赛季已完成";
  document.getElementById("hubDate").textContent = r
    ? `ROUND ${String(state.round).padStart(2, "0")} · ${r[1].replace("大奖赛", "")}`
    : "SEASON COMPLETE";
  state.driverPoints = state.driverStandings[selected[0]] || 0;
  state.teamPoints = state.teamStandings[selected[1]] || 0;
  document.getElementById("driverPts").textContent = state.driverPoints;
  document.getElementById("teamPts").textContent = state.teamPoints;
  document.getElementById("roundStatus").textContent =
    Math.min(state.round, 23) + " / 23";
  document.getElementById("raceModuleRound").textContent =
    "ROUND " + String(state.round).padStart(2, "0");
  document.getElementById("raceModuleName").textContent = r
    ? r[1].replace("大奖赛", "")
    : "赛季结束";
  document.getElementById("hubChampRank").textContent = "P" + driverRankV10();
  document.getElementById("contractStatus").textContent = state.contract
    .nextTeam
    ? `已签 ${state.contract.nextTeam}`
    : state.round < 6
      ? "窗口未开放"
      : "市场开放";
  const a = [
    ["OVR", selected[2]],
    ["EXP", selected[3]],
    ["RAC", selected[4]],
    ["AWA", selected[5]],
    ["PAC", selected[6]],
  ];
  document.getElementById("hubDriverStats").innerHTML = a
    .map(
      (x) => `<div class="driverstat"><span>${x[0]}</span><b>${x[1]}</b></div>`,
    )
    .join("");
  const brief = document.getElementById("briefing");
  if (brief) {
    const needs = topNeedsV10("race");
    brief.innerHTML = `下一站预计正赛竞争力 <b>P${fr[0]}–P${fr[1]}</b>。${r ? `${r[2]}最看重 ${needs.join(" / ")}。` : ""}<div class="aiNews">${
      state.aiDevNews.length
        ? state.aiDevNews
            .slice(0, 3)
            .map((x) => `<span>${x}</span>`)
            .join("")
        : "<span>围场研发动态尚少</span>"
    }</div>`;
  }
};
openModule = function (id) {
  if (id === "development") {
    renderDevelopment();
    showView("development");
    return;
  }
  if (id === "media") {
    renderMedia();
    showView("media");
    return;
  }
  if (id === "race") {
    openRaceWeekend();
    return;
  }
  if (id === "contracts") {
    renderContractsV10();
    showView("contracts");
    return;
  }
  if (id === "season") {
    renderSeasonV10();
    showView("season");
    return;
  }
};

renderPerformanceTable = function () {
  const box = document.getElementById("performanceTable");
  if (!box) return;
  const sorted = Object.keys(teams).sort(
    (a, b) => teamCarIndexV10(b) - teamCarIndexV10(a),
  );
  box.innerHTML = `<div class="teamperf10"><table><thead><tr><th>#</th><th>车队</th>${CAR_ATTRS_V10.map((a) => `<th>${a}</th>`).join("")}</tr></thead><tbody>${sorted
    .map((n, i) => {
      const vals = CAR_ATTRS_V10.map((a) => teams[n].parts[a]),
        mx = Math.max(...vals);
      return `<tr class="${n === selected[1] ? "mine" : ""}"><td class="rank">${i + 1}</td><td class="teamname">${n}</td>${vals.map((v) => `<td class="${v === mx ? "best" : ""}">${v}</td>`).join("")}</tr>`;
    })
    .join("")}</tbody></table></div>`;
};
renderDevelopment = function () {
  ensureStateV10();
  completeProjects();
  document.getElementById("devBudget").textContent =
    "€ " + state.budget.toFixed(1) + "M";
  const t = teams[selected[1]],
    locked = state.projects.length > 0;
  const carLabel = document.getElementById("playerCarTeamLabel"),
    carSummary = document.getElementById("playerCarSummary");
  if (carLabel) carLabel.textContent = selected[1] + " · 当前六项整车能力";
  if (carSummary)
    carSummary.innerHTML = `<div class="car6grid">${CAR_ATTRS_V10.map((a) => `<div class="car6"><span>${a}</span><b>${t.parts[a]}</b></div>`).join("")}</div>`;
  const impacts = {
    动力单元: "直线速度、出弯部署与高功率赛道",
    空力效率: "高速弯下压力与低阻力效率",
    赛车平衡: "连续变向、前后轴稳定与可预测性",
    机械抓地: "慢弯、路肩与低速牵引",
    轮胎管理: "暖胎、热衰减与长距离保持",
    "可靠性/冷却": "系统耐久、散热与故障风险",
  };
  document.getElementById("devParts").innerHTML =
    (locked
      ? '<div class="locknote">当前研发项目完成前无法启动新项目。</div>'
      : "") +
    CAR_ATTRS_V10.map((a) => {
      const v = t.parts[a],
        cost = Math.max(6, Math.round((88 - v) * 0.32 + 5)),
        races = 2 + Math.floor(Math.random() * 4);
      return `<div class="devitem"><h3>${a} <span class="small">当前 ${v}</span></h3><div class="meta"><span>${impacts[a]}</span><span>€${cost}M</span><span>${races}站</span></div><button class="mini" ${locked ? "disabled" : ""} onclick="startDev('${a}',${cost},${races})">${locked ? "研发中" : "启动项目"}</button></div>`;
    }).join("");
  renderProjects();
  renderPerformanceTable();
};
startDev = function (part, cost, races) {
  if (state.projects.length || state.budget < cost) {
    alert(state.projects.length ? "已有研发项目正在进行。" : "研发预算不足。");
    return;
  }
  const gain = 1 + Math.floor(Math.random() * 4);
  state.budget -= cost;
  state.projects.push({
    part,
    cost,
    races,
    gain,
    start: state.round,
    finish: state.round + races,
  });
  renderDevelopment();
  renderHub();
  autosave();
};
completeProjects = function () {
  if (!selected) return;
  const t = teams[selected[1]],
    done = state.projects.filter((p) => p.finish <= state.round);
  done.forEach((p) => {
    if (t.parts[p.part] != null)
      t.parts[p.part] = Math.min(90, t.parts[p.part] + p.gain);
  });
  if (done.length) {
    state.projects = state.projects.filter((p) => p.finish > state.round);
    recalcTeamOvr(t);
  }
};
renderProjects = function () {
  const box = document.getElementById("projects");
  if (!box) return;
  if (!state.projects.length) {
    box.innerHTML =
      '<div class="hint">尚无研发项目。AI车队也会在每个比赛周期独立决定自己的升级方向。</div>';
    return;
  }
  box.innerHTML = state.projects
    .map(
      (p) =>
        `<div class="project"><b>${p.part} · 完成后揭晓 +1～+4</b><small>R${String(p.start).padStart(2, "0")} → R${String(p.finish).padStart(2, "0")} · 剩余 ${Math.max(0, p.finish - state.round)} 站</small></div>`,
    )
    .join("");
};

const TEAM_WEEK_EVENTS_V10 = [
  {
    title: "升级件只有一套",
    body: "工程部门在下一站前只完成了一套关键升级。车队需要决定谁先使用，新件可能直接改变这个周末的赛车平衡。",
    choices: [
      [
        "主动让队友先用",
        "关系明显改善，但你本周无法获得这套升级带来的数据优势。",
        4,
        0.04,
      ],
      [
        "要求按积分排名分配",
        "如果你排名更高，这是最有说服力的立场；如果更低，会显得有些强硬。",
        1,
        0.13,
      ],
      [
        "坚持自己先用",
        "保护自己的成绩上限，但队友一侧会认为资源开始倾斜。",
        -4,
        0.18,
      ],
    ],
  },
  {
    title: "赛后复盘开始比较两台车的数据",
    body: "工程师把你和队友的长距离曲线放到了同一张图上。媒体已经开始讨论谁更能代表车队真正的速度。",
    choices: [
      [
        "公开共享全部驾驶数据",
        "减少内部猜疑，代价是你的个人优势更难保留。",
        3,
        0.04,
      ],
      [
        "只讨论技术，不比较车手",
        "维持职业边界，关系通常不会大幅变化。",
        0,
        0.06,
      ],
      [
        "强调自己的数据更有代表性",
        "可能争取到研发方向的话语权，也容易激化竞争。",
        -3,
        0.16,
      ],
    ],
  },
  {
    title: "策略组询问下一站的优先权",
    body: "两台赛车预计会处在相近的发车集团，车队希望提前确定首轮进站和 undercut 的优先次序。",
    choices: [
      ["接受根据赛道位置实时决定", "关系较稳，也保留了比赛中的弹性。", 2, 0.05],
      [
        "要求领先车手拥有优先权",
        "规则清楚，但一旦两人位置反复交换就容易产生争议。",
        0,
        0.11,
      ],
      [
        "要求自己拥有第一策略权",
        "如果当前成绩足够强势可能奏效，否则会被视为越界。",
        -4,
        0.2,
      ],
    ],
  },
  {
    title: "记者再次追问“谁是车队的一号车手”",
    body: "你和队友最近几站积分差距很小，发布会上问题开始从赛车转向内部竞争。任何一句话都会被放大。",
    choices: [
      ["强调车队目标高于个人排名", "风险最低，也最容易让队友接受。", 3, 0.03],
      ["回答“赛道上自然会证明”", "保持竞争姿态，关系不会立刻破裂。", -1, 0.09],
      [
        "直接说自己应该得到优先支持",
        "可能强化车队地位，也可能把矛盾公开化。",
        -5,
        0.22,
      ],
    ],
  },
  {
    title: "模拟器时间发生冲突",
    body: "下一站准备时间有限，你和队友都希望占用同一个高精度模拟器时段。车队建议两边自己协商。",
    choices: [
      ["交换时段并共享结论", "损失一点个人准备便利，换来更高合作度。", 4, 0.04],
      ["按车手积分排名决定", "成绩越好越容易被接受。", 1, 0.1],
      [
        "不让时段，坚持原安排",
        "你的准备最完整，但会把竞争带回车队内部。",
        -4,
        0.18,
      ],
    ],
  },
];
function ensureTeamWeekEventV10() {
  if (state.teamWeekEvent && state.teamWeekEvent.round === state.round) return;
  let pool = TEAM_WEEK_EVENTS_V10.slice();
  const tm = teammateV10(),
    gap = tm
      ? (state.driverStandings[selected[0]] || 0) -
        (state.driverStandings[tm[0]] || 0)
      : 0;
  const e = JSON.parse(
    JSON.stringify(pool[Math.floor(Math.random() * pool.length)]),
  );
  if (Math.abs(gap) < 12 && state.round > 3)
    e.body += " 目前你们在积分榜上的差距很小，这让任何资源决定都更加敏感。";
  state.teamWeekEvent = {
    round: state.round,
    event: e,
    resolved: false,
    outcome: null,
  };
}
renderMedia = function () {
  ensureStateV10();
  ensureTeamWeekEventV10();
  const tm = teammateV10(),
    v = state.teamRelation,
    evt = state.teamWeekEvent;
  document.getElementById("teamRelationStatus").textContent =
    relationStatusV10(v);
  document.getElementById("teamRelationPair").textContent =
    `${selected[0]} ↔ ${tm?.[0] || "队友"} · ${v}/100`;
  document.getElementById("teamRelationBar").style.width = v + "%";
  document.getElementById("rivalStats").innerHTML =
    `<div><span>你领先队友</span><b>${state.rivalry.playerAhead}</b></div><div><span>队友领先你</span><b>${state.rivalry.teammateAhead}</b></div><div><span>让车 / 冲突</span><b>${state.rivalry.orders} / ${state.rivalry.clashes}</b></div>`;
  const box = document.getElementById("teamWeekEvent");
  if (evt.resolved) {
    box.innerHTML = `<div class="kicker">THIS WEEK · RESOLVED</div><h2>${evt.event.title}</h2><p>${evt.outcome}</p><div class="hint">本周队内事件已处理。下一站会根据最新成绩重新生成。</div>`;
  } else {
    box.innerHTML = `<div class="kicker">THIS WEEK · TEAM EVENT</div><h2>${evt.event.title}</h2><p>${evt.event.body}</p><div class="weeklyChoices">${evt.event.choices.map((c, i) => `<div class="weeklyChoice" onclick="resolveTeamWeekEventV10(${i})"><b>${c[0]}</b><span>${c[1]}</span><small>存在收益与风险</small></div>`).join("")}</div>`;
  }
};
function resolveTeamWeekEventV10(i) {
  const w = state.teamWeekEvent;
  if (!w || w.resolved) return;
  const c = w.event.choices[i];
  let delta = c[2];
  if (Math.random() < c[3]) delta -= 2 + Math.floor(Math.random() * 4);
  else if (delta >= 0 && Math.random() < 0.35) delta += 1;
  state.teamRelation = Math.max(0, Math.min(100, state.teamRelation + delta));
  state.teamWeekModifier = i === 0 ? -0.7 : i === 1 ? 0.2 : 1.1;
  if (delta < c[2]) state.teamWeekModifier -= 0.4;
  w.resolved = true;
  const perf =
    state.teamWeekModifier > 0.7
      ? "你争取到了更多本周资源，但内部压力也更高。"
      : state.teamWeekModifier < 0
        ? "你牺牲了一点个人资源来换取更平稳的合作。"
        : "本周资源倾向基本保持中性。";
  w.outcome = `你选择了「${c[0]}」。队内关系 ${delta >= 0 ? "+" : ""}${delta}，当前为 ${relationStatusV10()}。${perf}`;
  renderMedia();
  renderHub();
  autosave();
}

/* legacy-script */

function prepBonusForDriverV10(d, phase, noBonus = false) {
  if (noBonus) return 0;
  if (d[0] === selected[0]) {
    const ps = prepScores(),
      teamMod = state.teamWeekModifier || 0;
    return (
      (phase === "qual"
        ? (ps.qual - ps.base) * 0.11
        : (ps.race - ps.base) * 0.11) + teamMod
    );
  }
  const p = state.aiPrep[d[0]] || {};
  return (p[phase === "qual" ? "qual" : "race"] || 0) * 0.18;
}
function aiStrategyV10() {
  const r = Math.random();
  return r < 0.24 ? "aggressive" : r < 0.78 ? "normal" : "conservative";
}
function retirementChanceV10(d, strategy = "normal", extra = 0) {
  const rel = teams[d[1]].parts["可靠性/冷却"] || 60;
  let p = 0.012 + Math.max(0, 76 - rel) * 0.0032;
  p *= state.weekend.attritionFactor || 1;
  if (strategy === "aggressive") p += 0.026;
  if (strategy === "conservative") p -= 0.006;
  p += extra;
  return Math.max(0.004, Math.min(0.24, p));
}
function applyStrategyShiftV10(field, name, phase, key) {
  const idx = field.findIndex((x) => x.name === name);
  if (idx < 0 || field[idx].dnf) return field;
  let delta = 0,
    r = Math.random();
  if (key === "aggressive") {
    if (r < 0.32) delta = -(1 + Math.floor(Math.random() * 7));
    else if (r < 0.7) delta = 1 + Math.floor(Math.random() * 4);
    else delta = Math.floor(Math.random() * 3) - 1;
  } else if (key === "conservative") {
    if (r < 0.68) delta = Math.floor(Math.random() * 3) - 1;
    else if (r < 0.88) delta = 1 + Math.floor(Math.random() * 2);
    else delta = -(1 + Math.floor(Math.random() * 3));
  } else delta = Math.floor(Math.random() * 5) - 2;
  const target = Math.max(0, Math.min(field.length - 1, idx + delta));
  const [x] = field.splice(idx, 1);
  field.splice(target, 0, x);
  return field;
}

function chooseRaceEventsV10() {
  const r = currentRace(),
    queue = [];
  const generic = [...raceEvents, ...RACE_EXTRA_V10];
  const picks = 2 + (Math.random() < 0.35 ? 1 : 0),
    used = new Set();
  for (let i = 0; i < picks; i++) {
    let x;
    do {
      x = generic[Math.floor(Math.random() * generic.length)];
    } while (used.has(x.title) && used.size < generic.length);
    used.add(x.title);
    queue.push({ ...x, special: false });
  }
  const sp = specialEvents.filter(
    (e) =>
      e.phase === "race" &&
      (!e.race || e.race === r[1]) &&
      (!e.team || e.team === selected[1]) &&
      (!e.driver || e.driver === selected[0]),
  );
  if (sp.length && Math.random() < 0.42)
    queue.splice(1, 0, {
      ...sp[Math.floor(Math.random() * sp.length)],
      special: true,
    });
  const order = makeTeamOrderEventV10();
  if (order)
    queue.splice(
      Math.min(1 + Math.floor(Math.random() * queue.length), queue.length),
      0,
      order,
    );
  const tech = makeTechnicalEventV10();
  if (tech) queue.push(tech);
  return queue.slice(0, 5);
}
function makeTeamOrderEventV10() {
  const tm = teammateV10();
  if (!tm) return null;
  const forecast = expectedRangeV10("race"),
    big = BIG_TEAMS_V10.has(selected[1]),
    base = big ? 0.38 : 0.11;
  let prob = base;
  if (
    state.round > 5 &&
    Math.abs(
      (state.driverStandings[selected[0]] || 0) -
        (state.driverStandings[tm[0]] || 0),
    ) < 25
  )
    prob += 0.1;
  if (Math.random() > prob) return null;
  const good = state.teamRelation >= 55,
    cost = good ? 1 : 2;
  if (selected[1] === "McLaren" && Math.random() < 0.65)
    return {
      special: true,
      title: "PAPAYA RULES：两台车已经在赛道上相遇",
      scene: `工程师提醒你们仍然可以自由竞争，但必须把两台橙色赛车都带回终点。当前队内关系是「${relationStatusV10()}」，这会决定一次强硬攻防究竟只是比赛，还是会变成内部问题。`,
      choices: [
        [
          "接受 Papaya Rules，留足空间",
          "继续竞争，但不在低成功率位置强插。",
          80,
          0.06,
          "McLaren 彩蛋",
          { relation: 2 },
        ],
        [
          "要求车队明确优先顺序",
          "把赛道问题交给车队决定，可能换来更清晰的策略。",
          76,
          0.1,
          "McLaren 彩蛋",
          { relation: good ? 0 : -2, posMod: cost },
        ],
        [
          "无论如何都要先过队友",
          "保留最大进攻机会，关系差时风险会急剧放大。",
          90,
          good ? 0.18 : 0.34,
          "McLaren 彩蛋",
          {
            relation: -5,
            dnfRisk: good ? 0.02 : 0.075,
            clash: true,
            posMod: -1,
          },
        ],
      ],
    };
  return {
    special: true,
    title: "车队指令：两台车的策略已经发生交叉",
    scene: `你和 ${tm[0]} 正在同一集团。车队认为其中一台赛车需要优先释放速度。大车队更常处理这种局面，而你们当前的队内关系是「${relationStatusV10()}」。`,
    choices: [
      [
        "立即配合交换位置",
        "关系越好，交换过程越干净；关系差时会损失更多赛道时间。",
        72,
        0.04,
        "车队指令",
        { relation: 4, posMod: cost, order: true },
      ],
      [
        "要求“如果追不上就换回来”",
        "接受指令，但为自己保留一个明确条件。",
        80,
        0.1,
        "条件式配合",
        { relation: 1, posMod: good ? 0 : 1, order: true },
      ],
      [
        "拒绝让车，继续比赛",
        "短期保住位置，但会把内部竞争直接带到赛道上。",
        89,
        good ? 0.18 : 0.36,
        "强硬拒绝",
        {
          relation: -7,
          dnfRisk: good ? 0.018 : 0.085,
          clash: true,
          order: true,
        },
      ],
    ],
  };
}
function makeTechnicalEventV10() {
  const rel = teams[selected[1]].parts["可靠性/冷却"],
    strat = state.weekend.raceStrategy || "normal";
  let p =
    0.13 + Math.max(0, 72 - rel) * 0.012 + (strat === "aggressive" ? 0.09 : 0);
  if (Math.random() > Math.min(0.48, p)) return null;
  const variants = [
    {
      title: "冷却系统温度持续爬升",
      scene: "连续跟车让进气温度高于模型，动力与制动系统都开始接近保护窗口。",
      choices: [
        [
          "继续全速，保持赛道位置",
          "性能不受影响，但机械风险显著上升。",
          88,
          0.24,
          "高风险",
          { dnfRisk: 0.085 },
        ],
        [
          "执行两圈 lift-and-coast",
          "损失少量时间，把温度重新压回目标范围。",
          76,
          0.05,
          "管理",
          { dnfRisk: 0.008 },
        ],
        [
          "大幅降低模式直到窗口恢复",
          "最稳妥，但可能连续丢掉位置。",
          65,
          0.02,
          "保守",
          { posMod: 2 },
        ],
      ],
    },
    {
      title: "变速箱数据出现间歇性报警",
      scene:
        "工程师看到一次异常换挡压力峰值。现在还没有强制进站，但继续高负荷换挡可能把小问题放大。",
      choices: [
        [
          "继续正常比赛",
          "如果是传感器误报，你不会损失任何位置。",
          84,
          0.2,
          "风险",
          { dnfRisk: 0.07 },
        ],
        [
          "提前升挡并减少路肩冲击",
          "牺牲牵引力，降低机械负荷。",
          74,
          0.05,
          "管理",
          { dnfRisk: 0.01 },
        ],
        [
          "进站检查",
          "几乎肯定掉出当前集团，但最大限度规避退赛。",
          60,
          0.02,
          "保守",
          { posMod: 4, dnfRisk: 0.002 },
        ],
      ],
    },
  ];
  return {
    ...variants[Math.floor(Math.random() * variants.length)],
    special: true,
  };
}
function normaliseChoiceV10(c) {
  return {
    label: c[0],
    desc: c[1],
    quality: c[2],
    risk: c[3],
    tag: c[4],
    effect: c[5] || {},
  };
}
chooseEvent = function (phase) {
  if (phase === "race") {
    const q = chooseRaceEventsV10();
    return q[0];
  }
  const r = currentRace(),
    sp = specialEvents.filter(
      (e) =>
        e.phase === "qual" &&
        (!e.race || e.race === r[1]) &&
        (!e.team || e.team === selected[1]) &&
        (!e.driver || e.driver === selected[0]),
    );
  if (sp.length && Math.random() < 0.42)
    return { ...sp[Math.floor(Math.random() * sp.length)], special: true };
  return {
    ...qualEvents[Math.floor(Math.random() * qualEvents.length)],
    special: false,
  };
};
function showPendingEventV10() {
  const ev = state.weekend.eventQueue[state.weekend.eventIndex];
  if (!ev) {
    finalizeRacePhaseV10(state.weekend.pendingPhase);
    return;
  }
  state.weekend.pendingEvent = ev;
  document.getElementById("modalTitle").textContent =
    state.weekend.pendingPhase === "qual"
      ? "排位赛 · 临场决定"
      : "正赛 · 实时事件";
  document.getElementById("modalBody").innerHTML =
    `<div class="eventcard"><div class="eventProgress">事件 ${state.weekend.eventIndex + 1} / ${state.weekend.eventQueue.length}</div>${ev.special ? '<span class="easter">SPECIAL EVENT</span>' : ""}<div class="kicker">LIVE DECISION</div><h3>${ev.title}</h3><div class="eventscene">${ev.scene}</div>${ev.choices
      .map((raw, i) => {
        const c = normaliseChoiceV10(raw);
        return `<div class="eventchoice" onclick="resolveRaceEvent(${i})"><b>${c.label}</b><span>${c.tag || "策略选择"}</span><small>${c.desc}</small></div>`;
      })
      .join("")}</div>`;
  document.getElementById("overlay").classList.add("open");
}
startRacePhase = function (phase) {
  const sk = state.weekend[phase + "Strategy"];
  if (!sk) {
    alert("请先选择本阶段的比赛计划。");
    return;
  }
  if (phase === "race" && !state.weekend.qualResult) {
    showView("qualifying");
    return;
  }
  state.weekend.pendingPhase = phase;
  state.weekend.eventQueue =
    phase === "qual" ? [chooseEvent("qual")] : chooseRaceEventsV10();
  state.weekend.eventIndex = 0;
  state.weekend.eventSum = 0;
  state.weekend.eventCount = 0;
  state.weekend.eventRisk = 0;
  state.weekend.dnfRisk = 0;
  state.weekend.positionMod = 0;
  state.weekend.eventNotes = [];
  showPendingEventV10();
};
resolveRaceEvent = function (choiceIndex) {
  const phase = state.weekend.pendingPhase,
    ev = state.weekend.eventQueue[state.weekend.eventIndex];
  if (!phase || !ev) return;
  const c = normaliseChoiceV10(ev.choices[choiceIndex]),
    strategy = strategyDefs[phase][state.weekend[phase + "Strategy"]],
    ps = prepScores();
  let quality = c.quality + strategy.eventMod,
    risk = c.risk + strategy.risk * 0.45;
  const control =
    (ps.control || 0) +
    (phase === "qual"
      ? (ps.qual - ps.base) * 0.12
      : (ps.race - ps.base) * 0.12);
  risk = Math.max(0.01, Math.min(0.52, risk - control * 0.005));
  let outcome = "执行顺利";
  if (Math.random() < risk) {
    const loss = 8 + Math.random() * 20;
    quality -= loss;
    outcome = loss > 20 ? "执行遭遇严重反噬" : "执行中出现损失";
    state.weekend.dnfRisk += (c.effect.dnfRisk || 0) * 1.2;
  } else {
    state.weekend.dnfRisk += (c.effect.dnfRisk || 0) * 0.45;
    if (
      state.weekend[phase + "Strategy"] === "aggressive" &&
      Math.random() < 0.24
    ) {
      quality += 4 + Math.random() * 7;
      outcome = "高风险选择获得额外回报";
    }
  }
  state.weekend.eventSum += Math.max(15, Math.min(100, quality));
  state.weekend.eventCount++;
  state.weekend.positionMod += c.effect.posMod || 0;
  if (c.effect.relation) {
    state.teamRelation = Math.max(
      0,
      Math.min(100, state.teamRelation + c.effect.relation),
    );
  }
  if (c.effect.order) state.rivalry.orders++;
  if (c.effect.clash && Math.random() < risk * 0.55) {
    state.teamRelation = Math.max(0, state.teamRelation - 4);
    state.rivalry.clashes++;
    state.weekend.dnfRisk += 0.035;
  }
  state.weekend.eventNotes.push(`${ev.title}：${c.label}（${outcome}）`);
  state.weekend.lastDecision = {
    phase,
    title: ev.title,
    choice: c.label,
    outcome,
  };
  state.weekend.eventIndex++;
  closeOverlay();
  if (state.weekend.eventIndex < state.weekend.eventQueue.length) {
    setTimeout(showPendingEventV10, 110);
  } else finalizeRacePhaseV10(phase);
};
function finalizeRacePhaseV10(phase, noBonus = false) {
  const strategyKey = state.weekend[phase + "Strategy"] || "normal",
    strategy = strategyDefs[phase][strategyKey] || strategyDefs[phase].normal,
    eventQ = state.weekend.eventCount
      ? state.weekend.eventSum / state.weekend.eventCount
      : 62,
    luck = Math.random() * 100,
    sc = computeScore(selected, phase, eventQ, luck, noBonus);
  let field = simulateAIFieldV10(phase, noBonus);
  field.push({
    name: selected[0],
    team: selected[1],
    total: sc.total,
    mine: true,
    strategy: strategyKey,
  });
  field.sort((a, b) => b.total - a.total);
  field = applyStrategyShiftV10(field, selected[0], phase, strategyKey);
  if (phase === "race") {
    const idx = field.findIndex((x) => x.mine);
    if (idx >= 0 && state.weekend.positionMod) {
      const target = Math.max(
        0,
        Math.min(field.length - 1, idx + state.weekend.positionMod),
      );
      const [m] = field.splice(idx, 1);
      field.splice(target, 0, m);
    }
    applyAttritionV10(field);
  }
  field.forEach((x, i) => (x.position = i + 1));
  const mine = field.find((x) => x.mine);
  mine.field = field.map((x) => ({ ...x }));
  mine.note = state.weekend.eventNotes.length
    ? state.weekend.eventNotes.join("；")
    : noBonus
      ? "一键模拟：未使用训练、事件选择或主动策略加成。"
      : "";
  mine.choice = state.weekend.lastDecision?.choice || "—";
  mine.eventTitle = state.weekend.lastDecision?.title || "自动模拟";
  mine.points = 0;
  state.weekend.pendingPhase = null;
  state.weekend.pendingEvent = null;
  if (phase === "qual") {
    state.weekend.qualResult = mine;
    state.weekend.qualField = field;
    if (!mine.dnf && mine.position === 1)
      state.driverSeasonStats[selected[0]].poles++;
    state.weekend.raceStrategy = null;
    autosave();
    renderGrandPrix();
    raceTransition(
      "QUALIFYING COMPLETE",
      `${mine.dnf ? "NO TIME" : "P" + mine.position} · ${currentRace()[1]}`,
      "SUNDAY · GRAND PRIX",
      "grandprix",
    );
  } else {
    completeRaceResultV10(field, mine, noBonus);
  }
}
function completeRaceResultV10(field, mine, noBonus = false) {
  const pts = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
  let fin = 0;
  field.forEach((x) => {
    if (!x.dnf) {
      fin++;
      x.position = fin;
      x.points = pts[fin - 1] || 0;
    } else {
      x.position = fin + 1;
      x.points = 0;
    }
  });
  field.filter((x) => x.dnf).forEach((x, i) => (x.position = fin + i + 1));
  awardStandingsV10(field);
  const m = field.find((x) => x.mine);
  Object.assign(m, mine);
  m.field = field.map((x) => ({ ...x }));
  m.points = m.dnf ? 0 : pts[m.position - 1] || 0;
  m.note = (mine.note || "") + (m.dnf ? "；比赛以退赛结束。" : "");
  state.weekend.raceResult = m;
  state.history.push({
    round: state.round,
    race: currentRace()[1],
    grid: state.weekend.qualResult?.position || 22,
    finish: m.position,
    points: m.points,
    dnf: !!m.dnf,
  });
  state.seasonResults.push({
    round: state.round,
    race: currentRace()[1],
    field: field.map((x) => ({
      name: x.name,
      team: x.team,
      position: x.position,
      points: x.points,
      dnf: !!x.dnf,
      status: x.status || "",
    })),
  });
  updateRivalryAfterRaceV10(field);
  state.driverPoints = state.driverStandings[selected[0]] || 0;
  state.teamPoints = state.teamStandings[selected[1]] || 0;
  renderHub();
  autosave();
  renderWeekendResult();
  raceTransition(
    "CHEQUERED FLAG",
    `${selected[0]} · ${m.dnf ? "DNF" : "P" + m.position}`,
    "OFFICIAL CLASSIFICATION",
    "weekendresult",
  );
}
function awardStandingsV10(field) {
  ensureStateV10();
  field.forEach((x) => {
    state.driverStandings[x.name] =
      (state.driverStandings[x.name] || 0) + (x.points || 0);
    state.teamStandings[x.team] =
      (state.teamStandings[x.team] || 0) + (x.points || 0);
    const st = state.driverSeasonStats[x.name];
    if (x.dnf) st.dnfs++;
    else {
      if (x.position === 1) st.wins++;
      if (x.position <= 3) st.podiums++;
    }
  });
}
function updateRivalryAfterRaceV10(field) {
  const tm = teammateV10();
  if (!tm) return;
  const me = field.find((x) => x.name === selected[0]),
    other = field.find((x) => x.name === tm[0]);
  if (!me || !other) return;
  if (me.dnf && !other.dnf) {
    state.rivalry.teammateAhead++;
    state.teamRelation -= 1;
  } else if (other.dnf && !me.dnf) {
    state.rivalry.playerAhead++;
    state.teamRelation -= 1;
  } else if (me.position < other.position) {
    state.rivalry.playerAhead++;
    state.rivalry.streak =
      state.rivalry.streak >= 0 ? state.rivalry.streak + 1 : 1;
  } else {
    state.rivalry.teammateAhead++;
    state.rivalry.streak =
      state.rivalry.streak <= 0 ? state.rivalry.streak - 1 : -1;
  }
  if (!me.dnf && !other.dnf && Math.abs(me.position - other.position) <= 2) {
    let tension = BIG_TEAMS_V10.has(selected[1]) ? 2 : 1;
    const myRank = driverRankV10(selected[0]),
      tmRank = driverRankV10(tm[0]);
    if (state.round > 5 && myRank <= 8 && tmRank <= 8) tension += 1;
    if (
      Math.abs(
        (state.driverStandings[selected[0]] || 0) -
          (state.driverStandings[tm[0]] || 0),
      ) < 20
    )
      tension += 1;
    state.teamRelation -= tension;
    if (Math.abs(state.rivalry.streak) >= 3) state.teamRelation -= 1;
  }
  state.teamRelation = Math.max(0, Math.min(100, state.teamRelation));
}

renderClassification = function (field, limit = drivers.length) {
  if (!field) return '<div class="hint">暂无结果</div>';
  return `<div class="resultlist">${field
    .slice(0, limit)
    .map(
      (x) =>
        `<div class="resultrow ${x.mine ? "mine" : ""}"><span class="pos ${x.dnf ? "dnf" : ""}">${x.dnf ? "DNF" : "P" + x.position}</span><b>${x.name}</b><span class="rteam">${x.team}</span><span class="status">${x.dnf ? "退赛" : x.points ? `+${x.points}` : ""}</span></div>`,
    )
    .join("")}</div>`;
};
renderWeekendResult = function () {
  const rr = state.weekend.raceResult,
    q = state.weekend.qualResult,
    r = currentRace();
  if (!rr) {
    openRaceWeekend();
    return;
  }
  document.getElementById("resultBreadcrumb").textContent =
    `ROUND ${String(state.round).padStart(2, "0")} · ${r[2]}`;
  document.getElementById("finishPos").textContent = rr.dnf
    ? "DNF"
    : `P${rr.position}`;
  document.getElementById("finishDriver").textContent = selected[0];
  document.getElementById("finishTeam").textContent = selected[1];
  document.getElementById("finishGrid").textContent = `P${q?.position || 22}`;
  document.getElementById("finishPoints").textContent = `+${rr.points || 0}`;
  document.getElementById("finishRound").textContent =
    `R${String(state.round).padStart(2, "0")}`;
  document.getElementById("resultRaceName").textContent = r[1];
  const movement = (q?.position || 22) - rr.position;
  document.getElementById("resultNarrative").textContent = rr.dnf
    ? `这场比赛没有跑到终点。策略风险、赛车可靠性和赛道中的事件共同决定了退赛概率。`
    : movement > 0
      ? `从 P${q.position} 发车后净提升 ${movement} 个位置，最终 P${rr.position}。`
      : movement < 0
        ? `从 P${q.position} 发车，最终 P${rr.position}。这一站的赛道适配和比赛事件没有完全站在你这一边。`
        : `从 P${q.position} 发车并以 P${rr.position} 完赛。`;
  document.getElementById("resultDecision").textContent =
    rr.note || "比赛已完成。";
  document.getElementById("finalClassification").innerHTML =
    renderClassification(rr.field, drivers.length);
};

openRaceWeekend = function () {
  ensureStateV10();
  if (state.round > calendar.length) {
    showSeasonFinaleV10();
    return;
  }
  if (state.weekend.raceResult) {
    renderWeekendResult();
    showView("weekendresult");
    return;
  }
  if (state.weekend.qualResult) {
    renderGrandPrix();
    showView("grandprix");
    return;
  }
  renderQualifying();
  showView("qualifying");
};
renderQualifying = function () {
  ensureStateV10();
  const r = currentRace(),
    tp = getTrackProfile(),
    fr = expectedRangeV10("qual"),
    cr = carRankAtTrackV10(selected[1], "qual"),
    needs = topNeedsV10("qual");
  document.getElementById("qualBreadcrumb").textContent =
    `ROUND ${String(state.round).padStart(2, "0")} · ${r[2]}`;
  document.getElementById("qualRaceName").textContent = r[1];
  document.getElementById("qualRaceMeta").textContent = `${r[2]} · ${r[3]}`;
  document.getElementById("qualCarContext").textContent = `赛道适配第 ${cr}`;
  document.getElementById("qualTrackContext").textContent = needs.join(" / ");
  document.getElementById("qualTarget").textContent =
    `预计 P${fr[0]}–P${fr[1]}`;
  document.getElementById("qualBrief").textContent =
    `这台车在 ${r[2]} 的排位重点是 ${needs.join(" 与 ")}。赛前模型给出的基准位置约为 P${fr[2]}，实际结果仍会受到策略、临场事件和周末准备影响。`;
  renderStrategies("qual");
  const ps = prepScores();
  document.getElementById("qualWeekendInfo").innerHTML =
    `<b>排位赛前预测：P${fr[0]}–P${fr[1]}</b><br>赛车适配：全场第 ${cr}<br>模拟器熟练度：${state.trainingUsed ? ps.qual : "未完成专项准备"}<br><br>预测不是锁定结果，只代表在当前赛车与赛道需求匹配下的常规竞争区间。`;
  document.getElementById("qualHistory").innerHTML = state.history.length
    ? state.history
        .slice(-3)
        .reverse()
        .map(
          (h) =>
            `<div>R${String(h.round).padStart(2, "0")} ${h.race} · 发车 P${h.grid} → ${h.dnf ? "DNF" : "完赛 P" + h.finish}</div>`,
        )
        .join("")
    : "<div>这是本赛季第一个比赛周末。</div>";
  document.getElementById("qualStart").disabled = !state.weekend.qualStrategy;
};
renderGrandPrix = function () {
  ensureStateV10();
  const r = currentRace(),
    q = state.weekend.qualResult;
  if (!q) {
    renderQualifying();
    showView("qualifying");
    return;
  }
  const tp = getTrackProfile(),
    fr = expectedRangeV10("race"),
    cr = carRankAtTrackV10(selected[1], "race"),
    needs = topNeedsV10("race");
  document.getElementById("raceBreadcrumb").textContent =
    `ROUND ${String(state.round).padStart(2, "0")} · ${r[2]}`;
  document.getElementById("gpRaceName").textContent = r[1];
  document.getElementById("gpRaceMeta").textContent = `${r[2]} · ${r[3]}`;
  document.getElementById("gpGrid").textContent = `P${q.position}`;
  document.getElementById("gpWindow").textContent = tp?.window || "策略开放";
  document.getElementById("gpFocus").textContent =
    `${needs.join(" / ")} · 预计P${fr[0]}–P${fr[1]}`;
  document.getElementById("gpBrief").textContent =
    `正赛模型重新按 ${r[2]} 的长距离需求评估赛车：当前适配约全场第 ${cr}。发车位置、队友关系、让车可能性、可靠性、超车选择和多次随机事件都会让结果偏离预测。`;
  renderStrategies("race");
  document.getElementById("qualGridPreview").innerHTML = renderClassification(
    q.field,
    10,
  );
  document.getElementById("raceStart").disabled = !state.weekend.raceStrategy;
};

function quickSimCurrentRound() {
  if (!selected || state.weekend.raceResult) return;
  if (
    !confirm(
      "一键模拟会跳过你的训练收益、临场事件选择与主动策略加成，直接计算本轮排位和正赛。继续吗？",
    )
  )
    return;
  ensureStateV10();
  state.weekend.qualStrategy = "normal";
  state.weekend.raceStrategy = "normal";
  const qField = simulateDirectSessionV10("qual");
  state.weekend.qualField = qField;
  state.weekend.qualResult = qField.find((x) => x.mine);
  if (state.weekend.qualResult.position === 1)
    state.driverSeasonStats[selected[0]].poles++;
  const rField = simulateDirectSessionV10("race");
  const mine = rField.find((x) => x.mine);
  mine.field = rField.map((x) => ({ ...x }));
  mine.note = "一键模拟：未获得本周训练、主动策略和事件选择加成。";
  mine.choice = "自动";
  mine.eventTitle = "快速模拟";
  completeRaceResultV10(rField, mine, true);
}

function generateContractInterestV10(team) {
  const rank = driverRankV10(),
    prest = TEAM_PRESTIGE_V10[team] || 70,
    form = state.history.slice(-4).reduce((s, h) => s + (h.points || 0), 0) / 4,
    ovr = selected[2];
  let x =
    ovr * 0.42 +
    Math.max(0, 105 - rank * 5) * 0.38 +
    Math.min(30, form * 2) * 0.2 -
    prest * 0.3 +
    24;
  if (team === selected[1]) x += 9;
  if (BIG_TEAMS_V10.has(team) && rank > 8 && ovr < 91) x -= 16;
  return Math.max(8, Math.min(96, Math.round(x)));
}
function refreshContractMarketV10(force = false) {
  ensureStateV10();
  if (state.contract.nextTeam) return;
  if (state.round < 6 && !force) return;
  if (
    !force &&
    state.contract.lastRefresh &&
    state.round - state.contract.lastRefresh < 3
  )
    return;
  state.contract.lastRefresh = state.round;
  state.contract.offers = Object.keys(teams).map((team) => {
    const interest = generateContractInterestV10(team),
      rank = driverRankV10(),
      prest = TEAM_PRESTIGE_V10[team] || 70;
    let status = interest >= 65 ? "offer" : interest >= 46 ? "watch" : "cold";
    if (team === selected[1] && interest >= 52) status = "offer";
    const salary = Math.round(
        5 + prest * 0.12 + selected[2] * 0.11 + Math.max(0, 12 - rank) * 0.7,
      ),
      years = rank <= 5 ? 2 : 1 + Math.floor(Math.random() * 2),
      role = rank <= 4 ? "争冠核心" : rank <= 9 ? "平等竞争" : "长期计划";
    return { team, interest, status, salary, years, role };
  });
}
function renderContractsV10() {
  ensureStateV10();
  refreshContractMarketV10();
  const c = state.contract,
    rank = driverRankV10(),
    signed = c.nextTeam;
  document.getElementById("contractContent").innerHTML =
    `<div class="contractTop"><div class="contractCurrent"><div class="kicker">CURRENT CONTRACT</div><h2>${selected[1]}</h2><div class="small">合同至 2026 赛季结束 · 当前车手排名 P${rank}</div><div class="forecastStrip"><div class="forecastBox"><span>市场价值</span><b>${rank <= 3 ? "顶级" : rank <= 8 ? "很高" : rank <= 14 ? "稳定" : "待证明"}</b></div><div class="forecastBox"><span>2027 去向</span><b>${signed || "未签约"}</b></div><div class="forecastBox"><span>谈判窗口</span><b>${state.round < 6 ? "尚未开放" : "开放"}</b></div></div></div><div class="card"><h2 class="sectiontitle">合同逻辑</h2><div class="hint">车队兴趣会随当前积分排名、近期成绩和车手基础能力变化。强队门槛更高；赛季中后期市场会每隔几站刷新一次。已经签下 2027 合同后，本赛季不会再更改。</div></div></div><div class="contractMarket">${c.offers.map((o) => `<div class="contractCard ${signed === o.team ? "signed" : o.status === "offer" ? "offer" : ""}"><div class="cHead"><h3>${o.team}</h3><span class="interest">兴趣 ${o.interest}%</span></div><div class="interestBar"><div style="width:${o.interest}%"></div></div><div class="contractTerms">${o.status === "offer" ? `€${o.salary}M / 年 · ${o.years}年<br>${o.role}` : o.status === "watch" ? "正在观察你的后续成绩" : "暂未进入主要候选名单"}</div><button class="mini" ${signed || state.round < 6 || o.status !== "offer" ? "disabled" : ""} onclick="openContractNegotiationV10('${o.team}')">${signed === o.team ? "已签约" : o.status === "offer" ? "进入谈判" : "暂无报价"}</button></div>`).join("")}</div>`;
}
function openContractNegotiationV10(team) {
  const o = state.contract.offers.find((x) => x.team === team);
  if (!o || state.contract.nextTeam) return;
  document.getElementById("modalTitle").textContent =
    `CONTRACT NEGOTIATION · ${team}`;
  document.getElementById("modalBody").innerHTML =
    `<div class="driverdetail"><div class="kicker">2027 DRIVER MARKET</div><div class="driverdetailname">${team}</div><div class="historyline">初步报价：€${o.salary}M / 年 · ${o.years} 年 · ${o.role}</div><div class="weeklyChoices"><div class="weeklyChoice" onclick="resolveContractV10('${team}','accept')"><b>接受当前报价</b><span>立即确定 2027 去向，不再参与其他车队谈判。</span></div><div class="weeklyChoice" onclick="resolveContractV10('${team}','role')"><b>要求更高队内地位</b><span>争取核心席位；成绩越好，车队越容易同意。</span></div><div class="weeklyChoice" onclick="resolveContractV10('${team}','salary')"><b>继续抬价</b><span>要求更高薪资。成功则改善合同，失败可能让谈判冷却。</span></div></div></div>`;
  document.getElementById("overlay").classList.add("open");
}
function resolveContractV10(team, type) {
  const o = state.contract.offers.find((x) => x.team === team);
  if (!o) return;
  let ok = true;
  if (type === "role")
    ok =
      Math.random() <
      Math.min(
        0.9,
        0.36 +
          (driverRankV10() <= 5 ? 0.32 : 0) +
          (selected[2] >= 92 ? 0.14 : 0),
      );
  if (type === "salary")
    ok =
      Math.random() <
      Math.min(
        0.88,
        0.48 + (driverRankV10() <= 8 ? 0.18 : 0) + (o.interest - 60) / 100,
      );
  if (!ok) {
    o.status = "watch";
    o.interest = Math.max(35, o.interest - 12);
    closeOverlay();
    renderContractsV10();
    autosave();
    alert("谈判没有达成一致。车队会继续观察你的后续成绩。");
    return;
  }
  if (type === "role") o.role = "一号车手 / 核心席位";
  if (type === "salary") o.salary = Math.round(o.salary * 1.22);
  state.contract.nextTeam = team;
  state.contract.signedRound = state.round;
  closeOverlay();
  renderContractsV10();
  renderHub();
  autosave();
}

function renderSeasonV10() {
  ensureStateV10();
  const ds = Object.entries(state.driverStandings).sort((a, b) => b[1] - a[1]),
    ts = Object.entries(state.teamStandings).sort((a, b) => b[1] - a[1]);
  const hist = state.history.length
    ? state.history
        .map(
          (h) =>
            `<div class="historyRace"><span>R${String(h.round).padStart(2, "0")}</span><b>${h.race}</b><small>发车 P${h.grid} · ${h.dnf ? "DNF" : "完赛 P" + h.finish} · ${h.points}分</small></div>`,
        )
        .join("")
    : '<div class="hint">赛季尚未完成比赛。</div>';
  document.getElementById("seasonContent").innerHTML =
    `<div class="standingsLayout"><div class="card"><h2 class="sectiontitle">车手积分榜</h2><table class="standingTable"><thead><tr><th>#</th><th>车手</th><th>车队</th><th>积分</th><th>胜</th><th>DNF</th></tr></thead><tbody>${ds
      .map(([n, p], i) => {
        const d = drivers.find((x) => x[0] === n),
          st = state.driverSeasonStats[n];
        return `<tr class="${n === selected[0] ? "mine" : ""}"><td>${i + 1}</td><td>${n}</td><td>${d[1]}</td><td><b>${p}</b></td><td>${st.wins}</td><td>${st.dnfs}</td></tr>`;
      })
      .join(
        "",
      )}</tbody></table></div><div class="card"><h2 class="sectiontitle">车队积分榜</h2><table class="standingTable"><thead><tr><th>#</th><th>车队</th><th>积分</th></tr></thead><tbody>${ts.map(([n, p], i) => `<tr class="${n === selected[1] ? "mine" : ""}"><td>${i + 1}</td><td>${n}</td><td><b>${p}</b></td></tr>`).join("")}</tbody></table></div></div><div class="card" style="margin-top:12px"><div class="relationhead"><h2 class="sectiontitle" style="margin:0">本赛季过往成绩</h2><div class="small">${state.history.length} / ${calendar.length} 站</div></div><div class="historyCards" style="margin-top:12px">${hist}</div></div>`;
}

advanceRound = function () {
  if (!state.weekend.raceResult) return;
  if (state.round >= calendar.length) {
    showSeasonFinaleV10();
    autosave();
    return;
  }
  state.round++;
  processAIDevelopmentV10();
  state.trainingUsed = false;
  state.prep = { round: state.round, type: null, qual: 0, race: 0, control: 0 };
  state.teamWeekEvent = null;
  state.teamWeekModifier = 0;
  resetWeekend();
  completeProjects();
  ensureAITrainingV10(true);
  refreshContractMarketV10();
  renderHub();
  autosave();
  showView("career");
};
function showSeasonFinaleV10() {
  ensureStateV10();
  const rank = driverRankV10(),
    teamRank = teamRankV10(),
    st = state.driverSeasonStats[selected[0]],
    tm = teammateV10(),
    next = state.contract.nextTeam;
  let title, text;
  if (rank === 1) {
    title = "世界冠军";
    text = `你把 2026 赛季变成了职业生涯的冠军赛季。无论赛车在哪些赛道占优，最终真正决定全年结果的是你在不同周末持续把机会兑换成积分。`;
  } else if (rank <= 3) {
    title = "距离冠军只差一步";
    text =
      "你整个赛季都留在争冠核心区域。某些周末的赛车适配、退赛或策略事件让最终差距形成，但这个赛季已经足以改变围场对你的评价。";
  } else if (rank <= 6) {
    title = "顶级车手赛季";
    text =
      "你稳定留在前列，并且拥有足够多的强势周末。这个成绩通常会让大车队在合同市场上认真考虑你。";
  } else if (rank <= 10) {
    title = "中上游的支点";
    text =
      "你拿到了大量决定车队排名的关键积分。赛车并不总能提供领奖台速度，但你已经建立了一条清晰的上升轨迹。";
  } else {
    title = "漫长而真实的一年";
    text =
      "2026 并没有轻易奖励你。研发、赛道适配和可靠性留下了大量损失，但完整跑完一个动态赛季本身也让下一年的选择变得更重要。";
  }
  document.getElementById("finalChampRank").textContent = "P" + rank;
  document.getElementById("finalTitle").textContent = title;
  document.getElementById("finalText").textContent = text;
  document.getElementById("finalStats").innerHTML =
    `<div><span>车手积分</span><b>${state.driverStandings[selected[0]]}</b></div><div><span>胜利</span><b>${st.wins}</b></div><div><span>领奖台</span><b>${st.podiums}</b></div><div><span>车队排名</span><b>P${teamRank}</b></div>`;
  document.getElementById("finalContract").textContent = next
    ? `2027：你已经与 ${next} 签下合同。这个赛季的成绩最终改变了下一年的座舱。`
    : `2027：你尚未签下新合同。最终存档会保留当前市场状态。`;
  showView("seasonfinale");
}

snapshot = function () {
  ensureStateV10();
  // 确保所有关键字段在保存前存在并有效
  if (!state.driverStandings) state.driverStandings = {};
  if (!state.teamStandings) state.teamStandings = {};
  if (!state.driverSeasonStats) state.driverSeasonStats = {};
  if (!state.history) state.history = [];
  if (!state.seasonResults) state.seasonResults = [];
  return {
    version: 10,
    savedAt: new Date().toISOString(),
    selected: selected ? selected[0] : null,
    state: deepCloneForSave(state),
    teams: deepCloneForSave(teams),
  };
};
restoreSnapshot = function (data) {
  if (!data || !data.selected) return false;
  const d = drivers.find((x) => x[0] === data.selected);
  if (!d) return false;
  selected = d;
  setupCarsV10();
  Object.keys(teams).forEach((k) => {
    teams[k] = deepCloneForSave(baseTeams[k]);
  });
  if (data.version >= 10 && data.teams) {
    Object.keys(data.teams).forEach((k) => {
      if (data.teams[k]?.parts?.["动力单元"] != null) teams[k] = data.teams[k];
    });
  }
  state = normalizeLoadedState(data.state);
  if (!state.weekend) resetWeekend();
  ensureStateV10();
  renderProfile();
  renderHub();
  return true;
};

/* legacy-script */

const CAR_BASE_V11 = {
  Mercedes: [77, 79, 80, 77, 78, 69],
  Ferrari: [67, 79, 80, 77, 75, 80],
  McLaren: [75, 77, 75, 74, 76, 71],
  "Red Bull Racing": [82, 69, 67, 68, 67, 73],
  "Racing Bulls": [79, 68, 69, 68, 67, 74],
  Alpine: [74, 66, 67, 66, 64, 68],
  "Haas F1 Team": [69, 63, 62, 64, 61, 76],
  Williams: [74, 64, 63, 66, 60, 67],
  Audi: [64, 66, 67, 65, 66, 64],
  "Aston Martin": [58, 65, 63, 66, 64, 55],
  Cadillac: [67, 55, 53, 57, 54, 69],
};
const OLD_CAR_BASE_V10 = {
  "Red Bull Racing": [80, 71, 68, 69, 68, 73],
  Ferrari: [72, 73, 76, 75, 73, 78],
  McLaren: [75, 76, 75, 74, 77, 70],
  Mercedes: [76, 73, 74, 72, 74, 69],
  "Racing Bulls": [78, 68, 69, 68, 67, 75],
  Alpine: [74, 65, 66, 66, 64, 68],
  Audi: [63, 65, 66, 65, 65, 63],
  "Haas F1 Team": [71, 62, 61, 63, 60, 76],
  Williams: [74, 61, 60, 65, 58, 67],
  "Aston Martin": [57, 64, 62, 65, 63, 54],
  Cadillac: [70, 53, 51, 56, 52, 68],
};
const TEAM_BUDGET_V11 = {
  Mercedes: 40,
  Ferrari: 40,
  McLaren: 39,
  "Red Bull Racing": 38,
  "Racing Bulls": 30,
  Alpine: 32,
  "Haas F1 Team": 28,
  Williams: 31,
  Audi: 45,
  "Aston Martin": 42,
  Cadillac: 45,
};
Object.entries(CAR_BASE_V11).forEach(([n, v]) => (CAR_BASE_V10[n] = v.slice()));
Object.entries(TEAM_BUDGET_V11).forEach(([n, b]) => {
  if (baseTeams[n]) baseTeams[n].budget = b;
  if (teams[n]) teams[n].budget = b;
});
setupCarsV10();
Object.entries(TEAM_BUDGET_V11).forEach(([n, b]) => {
  baseTeams[n].budget = b;
  teams[n].budget = b;
});

const DRIVER_CONTRACTS_V11 = {
  "Max Verstappen": {
    end: 2028,
    label: "至 2028",
    clause: true,
    note: "含表现相关退出条款",
  },
  "Isack Hadjar": {
    end: 2026,
    label: "2026",
    option: true,
    note: "席位取决于红牛体系评估",
  },
  "Charles Leclerc": {
    end: 2029,
    label: "至少至 2029",
    clause: true,
    note: "2026年续签的长期协议",
  },
  "Lewis Hamilton": {
    end: 2027,
    label: "多年度 · 至少覆盖 2027",
    option: true,
    note: "长期协议含选项",
  },
  "Lando Norris": {
    end: 2027,
    label: "多年度",
    clause: true,
    note: "至少覆盖2026，含潜在退出机制",
  },
  "Oscar Piastri": {
    end: 2027,
    label: "至少至 2027",
    option: true,
    note: "长期续约",
  },
  "George Russell": {
    end: 2027,
    label: "多年度",
    option: true,
    note: "2026之后存在续约/选项结构",
  },
  "Kimi Antonelli": {
    end: 2026,
    label: "2026",
    option: true,
    note: "Mercedes拥有继续合作空间",
  },
  "Fernando Alonso": {
    end: 2026,
    label: "2026",
    option: true,
    note: "赛季末去向取决于双方选择",
  },
  "Lance Stroll": {
    end: 2026,
    label: "滚动/长期",
    option: true,
    note: "实际席位稳定性高于纸面期限",
  },
  "Carlos Sainz": {
    end: 2026,
    label: "至少至 2026",
    option: true,
    note: "多年度协议带灵活条款",
  },
  "Alexander Albon": {
    end: 2027,
    label: "2026/27 条款型",
    clause: true,
    note: "表现条款可能影响实际期限",
  },
  "Pierre Gasly": {
    end: 2028,
    label: "至 2028",
    option: false,
    note: "Alpine长期合同",
  },
  "Franco Colapinto": {
    end: 2026,
    label: "2026",
    option: true,
    note: "后续席位需重新确认",
  },
  "Esteban Ocon": {
    end: 2027,
    label: "多年度",
    option: true,
    note: "Haas长期协议",
  },
  "Oliver Bearman": {
    end: 2027,
    label: "多年度",
    option: true,
    note: "Haas长期协议",
  },
  "Liam Lawson": {
    end: 2026,
    label: "2026",
    option: true,
    note: "红牛体系年度评估",
  },
  "Arvid Lindblad": {
    end: 2026,
    label: "2026",
    option: true,
    note: "新秀合同，后续看表现",
  },
  "Nico Hulkenberg": {
    end: 2027,
    label: "多年度",
    option: true,
    note: "Audi项目长期安排",
  },
  "Gabriel Bortoleto": {
    end: 2026,
    label: "至少至 2026",
    option: true,
    note: "Audi拥有继续合作空间",
  },
  "Sergio Perez": {
    end: 2027,
    label: "至少至 2027",
    option: true,
    note: "Cadillac多年度合同",
  },
  "Valtteri Bottas": {
    end: 2027,
    label: "至少至 2027",
    option: true,
    note: "Cadillac多年度合同",
  },
};

function ensureStateV11() {
  ensureStateV10();
  if (!state.seasonYear) state.seasonYear = 2026;
  if (!state.devMode) state.devMode = "current";
  if (!state.nextSeasonResearch) state.nextSeasonResearch = {};
  if (state.nextSeasonFund == null) state.nextSeasonFund = 0;
  if (!state.aiNextSeasonResearch) state.aiNextSeasonResearch = {};
  if (!state.contract.pending) state.contract.pending = null;
  if (!state.contractHistory) state.contractHistory = [];
  if (!state.driverContracts)
    state.driverContracts = JSON.parse(JSON.stringify(DRIVER_CONTRACTS_V11));
  CAR_ATTRS_V10.forEach((a) => {
    if (state.nextSeasonResearch[a] == null) state.nextSeasonResearch[a] = 0;
  });
  Object.keys(teams).forEach((t) => {
    if (!state.aiNextSeasonResearch[t]) state.aiNextSeasonResearch[t] = {};
    CAR_ATTRS_V10.forEach((a) => {
      if (state.aiNextSeasonResearch[t][a] == null)
        state.aiNextSeasonResearch[t][a] = 0;
    });
  });
}
function seasonYearV11() {
  ensureStateV11();
  return state.seasonYear || 2026;
}
function nextSeasonUnlockedV11() {
  return state.round >= 10;
}
function monthForRoundV11(r) {
  const raw = calendar[Math.max(0, Math.min(calendar.length - 1, r - 1))][3];
  const m = parseInt(raw.slice(0, 2), 10);
  return Number.isFinite(m) ? m : 3;
}
function nextMonthResolveRoundV11(r) {
  const m = monthForRoundV11(r);
  for (let i = r + 1; i <= calendar.length; i++)
    if (monthForRoundV11(i) !== m) return i;
  return calendar.length + 1;
}
function contractInfoV11(name) {
  ensureStateV11();
  return (
    state.driverContracts[name] ||
    DRIVER_CONTRACTS_V11[name] || {
      end: seasonYearV11(),
      label: "待确认",
      option: true,
      note: "合同状态未公开",
    }
  );
}
function seatAvailabilityV11(team) {
  const y = seasonYearV11(),
    roster = drivers.filter((d) => d[1] === team);
  const flexible = roster.filter((d) => {
    const c = contractInfoV11(d[0]);
    return c.end <= y || c.option || c.clause;
  });
  return { roster, flexible, count: flexible.length };
}

// New career baseline / budget
startCareer = function () {
  setupCarsV10();
  Object.keys(teams).forEach((k) => {
    teams[k] = JSON.parse(JSON.stringify(baseTeams[k]));
    teams[k].budget = TEAM_BUDGET_V11[k] || 32;
  });
  const t = teams[selected[1]];
  state = {
    seasonYear: 2026,
    round: 1,
    budget: t.budget,
    projects: [],
    devMode: "current",
    nextSeasonResearch: {},
    nextSeasonFund: 0,
    aiNextSeasonResearch: {},
    trainingUsed: false,
    prep: { round: 1, type: null, qual: 0, race: 0, control: 0 },
    relations: { principal: 65, engineer: 70 },
    driverRelations: {},
    prUsed: {},
    lastPR: {},
    driverPoints: 0,
    teamPoints: 0,
    history: [],
    driverStandings: {},
    teamStandings: {},
    driverSeasonStats: {},
    seasonResults: [],
    aiDevNews: [],
    aiPrep: {},
    teamWeekEvent: null,
    teamWeekModifier: 0,
    rivalry: {
      playerAhead: 0,
      teammateAhead: 0,
      orders: 0,
      clashes: 0,
      streak: 0,
    },
    contract: {
      nextTeam: null,
      signedRound: null,
      offers: [],
      lastRefresh: 0,
      pending: null,
    },
    contractHistory: [],
    driverContracts: JSON.parse(JSON.stringify(DRIVER_CONTRACTS_V11)),
    weekend: {},
  };
  CAR_ATTRS_V10.forEach((a) => (state.nextSeasonResearch[a] = 0));
  Object.keys(teams).forEach((n) => {
    state.teamStandings[n] = 0;
    state.aiNextSeasonResearch[n] = {};
    CAR_ATTRS_V10.forEach((a) => (state.aiNextSeasonResearch[n][a] = 0));
  });
  drivers.forEach((d) => {
    state.driverStandings[d[0]] = 0;
    state.driverSeasonStats[d[0]] = { wins: 0, podiums: 0, poles: 0, dnfs: 0 };
  });
  const tm = teammateV10();
  state.teamRelation = tm
    ? Math.max(35, Math.min(82, relationshipBase(selected[0], tm[0])))
    : 60;
  resetWeekend();
  ensureAITrainingV10(true);
  refreshContractMarketV10(true);
  renderHub();
  autosave();
  showView("career");
};

// R&D: two simultaneous projects + next-season research
function setDevModeV11(mode) {
  ensureStateV11();
  if (mode === "next" && !nextSeasonUnlockedV11()) {
    alert("下赛季研发将在 R10 后开放。");
    return;
  }
  state.devMode = mode;
  renderDevelopment();
  autosave();
}
function reserveAllBudgetV11() {
  ensureStateV11();
  if (!nextSeasonUnlockedV11()) {
    alert("进入赛季后半段后才能锁定下赛季预算。");
    return;
  }
  if (state.budget <= 0) {
    alert("当前没有可转入的预算。");
    return;
  }
  state.nextSeasonFund += state.budget;
  state.budget = 0;
  renderDevelopment();
  renderHub();
  autosave();
}
renderProjects = function () {
  const box = document.getElementById("projects");
  if (!box) return;
  if (!state.projects.length) {
    box.innerHTML =
      '<div class="hint">当前没有项目。研发中心最多可同时运行两项；赛季后半段可以把资源转向下一代赛车。</div>';
    return;
  }
  box.innerHTML = state.projects
    .map(
      (p, i) =>
        `<div class="project ${p.seasonTarget === "next" ? "future" : "current"}"><b>${p.part} · ${p.seasonTarget === "next" ? "下赛季研究" : "本赛季升级"} <span class="projectSlot">SLOT ${i + 1}</span></b><small>R${String(p.start).padStart(2, "0")} → R${String(p.finish).padStart(2, "0")} · 剩余 ${Math.max(0, p.finish - state.round)} 站 · 完成后揭晓 +1～+4</small></div>`,
    )
    .join("");
};
renderDevelopment = function () {
  ensureStateV11();
  completeProjects();
  const t = teams[selected[1]],
    mode = state.devMode || "current",
    full = state.projects.length >= 2;
  document.getElementById("devBudget").textContent =
    "€ " + state.budget.toFixed(1) + "M";
  const carLabel = document.getElementById("playerCarTeamLabel"),
    carSummary = document.getElementById("playerCarSummary");
  if (carLabel) carLabel.textContent = selected[1] + " · 当前六项整车能力";
  if (carSummary)
    carSummary.innerHTML = `<div class="car6grid">${CAR_ATTRS_V10.map((a) => `<div class="car6"><span>${a}</span><b>${t.parts[a]}</b></div>`).join("")}</div>`;
  const b1 = document.getElementById("devModeCurrent"),
    b2 = document.getElementById("devModeNext");
  if (b1) b1.classList.toggle("active", mode === "current");
  if (b2) {
    b2.classList.toggle("active", mode === "next");
    b2.disabled = !nextSeasonUnlockedV11();
  }
  const hint = document.getElementById("devSeasonHint");
  if (hint)
    hint.textContent = nextSeasonUnlockedV11()
      ? "下赛季研发已开放：可以继续追赶今年，也可以提前押注下一代赛车。"
      : "下赛季研发将在 R10 开放；在此之前所有项目都服务当前赛车。";
  const ff = document.getElementById("futureFund");
  if (ff) ff.textContent = "€ " + state.nextSeasonFund.toFixed(1) + "M";
  const rc = Object.values(state.nextSeasonResearch).reduce((a, b) => a + b, 0);
  const frc = document.getElementById("futureResearchCount");
  if (frc) frc.textContent = rc + " 点";
  const rb = document.getElementById("reserveAllBtn");
  if (rb) rb.disabled = !nextSeasonUnlockedV11() || state.budget <= 0;
  const impacts = {
    动力单元: "直线速度、出弯部署与高功率赛道",
    空力效率: "高速弯下压力与低阻力效率",
    赛车平衡: "连续变向、前后轴稳定与可预测性",
    机械抓地: "慢弯、路肩与低速牵引",
    轮胎管理: "暖胎、热衰减与长距离保持",
    "可靠性/冷却": "系统耐久、散热与故障风险",
  };
  document.getElementById("devParts").innerHTML =
    (full
      ? '<div class="locknote">两个研发槽都已占用。等待任一项目完成后才能继续立项。</div>'
      : "") +
    CAR_ATTRS_V10.map((a) => {
      const v =
        mode === "next"
          ? (CAR_BASE_V11[selected[1]]?.[CAR_ATTRS_V10.indexOf(a)] ||
              t.parts[a]) + state.nextSeasonResearch[a]
          : t.parts[a];
      const cost = Math.max(
        4,
        Math.min(
          9,
          Math.round((88 - v) * 0.18 + 2) + (mode === "next" ? 0 : 1),
        ),
      );
      const races =
        mode === "next"
          ? 3 + Math.floor(Math.random() * 3)
          : 2 + Math.floor(Math.random() * 3);
      const dup = state.projects.some(
        (p) => p.part === a && p.seasonTarget === mode,
      );
      return `<div class="devitem"><h3>${a} <span class="small">${mode === "next" ? "研究基线" : "当前"} ${v}</span></h3><div class="meta"><span>${impacts[a]}</span><span>€${cost}M</span><span>${races}站</span></div><button class="mini" ${full || dup || state.budget < cost ? "disabled" : ""} onclick="startDevV11('${a}',${cost},${races},'${mode}')">${dup ? "同类项目进行中" : mode === "next" ? "研究下一代" : "启动升级"}</button></div>`;
    }).join("");
  const future = document.getElementById("playerCarSummary");
  renderProjects();
  renderPerformanceTable();
};
function startDevV11(part, cost, races, target) {
  ensureStateV11();
  if (state.projects.length >= 2) {
    alert("两个研发槽都已占用。");
    return;
  }
  if (target === "next" && !nextSeasonUnlockedV11()) {
    alert("下赛季研发尚未开放。");
    return;
  }
  if (
    state.projects.some((p) => p.part === part && p.seasonTarget === target)
  ) {
    alert("同一方向已有项目正在进行。");
    return;
  }
  if (state.budget < cost) {
    alert("研发预算不足。");
    return;
  }
  const gain = 1 + Math.floor(Math.random() * 4);
  state.budget -= cost;
  state.projects.push({
    part,
    cost,
    races,
    gain,
    start: state.round,
    finish: state.round + races,
    seasonTarget: target,
  });
  renderDevelopment();
  renderHub();
  autosave();
}
startDev = function (part, cost, races) {
  startDevV11(part, cost, races, state.devMode || "current");
};
completeProjects = function () {
  if (!selected || !state.projects) return;
  ensureStateV11();
  const t = teams[selected[1]],
    done = state.projects.filter((p) => p.finish <= state.round);
  done.forEach((p) => {
    if (p.seasonTarget === "next")
      state.nextSeasonResearch[p.part] =
        (state.nextSeasonResearch[p.part] || 0) + p.gain;
    else if (t.parts[p.part] != null) {
      const cap =
        typeof customConfigV19 !== "undefined" &&
        customConfigV19 &&
        selected?.[1] === customConfigV19.teamName
          ? 99
          : 92;
      t.parts[p.part] = Math.min(cap, t.parts[p.part] + p.gain);
    }
    state.aiDevNews.unshift(
      `${selected[1]}：${p.seasonTarget === "next" ? "下一代 " + p.part + " 研究完成" : "当前 " + p.part + " +" + p.gain}`,
    );
  });
  if (done.length) {
    state.projects = state.projects.filter((p) => p.finish > state.round);
    recalcTeamOvr(t);
    state.aiDevNews = state.aiDevNews.slice(0, 12);
  }
};

// AI current-season / next-season development

// News ticker in driver profile
function generateNewsFeedV11() {
  ensureStateV11();
  const r = calendar[Math.min(state.round - 1, calendar.length - 1)],
    needs = topNeedsV10("race"),
    tm = teammateV10();
  let arr = [];
  if (r)
    arr.push(
      `下一站 ${r[1]}：${r[2]} 的长距离模型最看重 ${needs.join(" 与 ")}。`,
    );
  arr.push(...state.aiDevNews.slice(0, 4));
  const rumorTeams = Object.keys(teams).filter((t) => t !== selected[1]);
  const rt = rumorTeams[(state.round + selected[0].length) % rumorTeams.length];
  arr.push(
    `围场传闻：${rt} 的工程会议比预计晚结束了四十分钟——没人愿意承认这和升级方向有关。`,
  );
  if (tm)
    arr.push(
      `${selected[1]} 内部消息：${tm[0]} 本周模拟器长距离反馈与主模型存在一点分歧。`,
    );
  arr.push(`Paddock：某位车手再次坚持酒店早餐比赛车调校更难达成共识。`);
  arr.push(
    `轮胎供应商提醒：${r ? r[2] : "下一站"} 的赛道温度变化可能比天气预报本身更值得担心。`,
  );
  if (state.contract?.pending)
    arr.push(
      `车手市场：${state.contract.pending.team} 与 ${selected[0]} 的谈判文件已经递交，围场预计下个月才会有明确答复。`,
    );
  return arr.filter(Boolean);
}
openCareerDriverDetail = function () {
  if (!selected) return;
  ensureStateV11();
  const d = selected,
    p = driverProfiles[d[0]],
    attrs = [
      ["OVR", d[2]],
      ["EXP", d[3]],
      ["RAC", d[4]],
      ["AWA", d[5]],
      ["PAC", d[6]],
    ];
  const hist = state.history.length
    ? state.history
        .slice(-5)
        .reverse()
        .map(
          (h) =>
            `<div class="historyline"><b>${h.race}</b> · P${h.grid} → ${h.dnf ? "DNF" : "P" + h.finish} · ${h.points}分</div>`,
        )
        .join("")
    : '<div class="historyline">本赛季尚未完成比赛。</div>';
  const feed = generateNewsFeedV11();
  document.getElementById("modalTitle").textContent =
    `DRIVER PROFILE · ${seasonYearV11()}`;
  document.getElementById("modalBody").innerHTML =
    `<div class="driverdetail"><div class="driverdetailtop"><div><div class="kicker">${p.nation} · ${d[1]}</div><div class="driverdetailname">${d[0]} <span class="seasonBadge">${seasonYearV11()}</span></div><span class="driverbadge">#${p.number}</span><span class="driverbadge">F1 DEBUT ${p.debut}</span></div><div class="drivernumber">#${p.number}</div></div><div class="detailgrid"><div><h3 class="sectiontitle">当前能力</h3><div class="detailstats">${attrs.map((a) => `<div class="detailstat"><span>${a[0]}</span><b>${a[1]}</b></div>`).join("")}</div><h3 class="sectiontitle" style="margin-top:15px">进入 2026 前的现实履历</h3><div class="historyline"><b>2025：</b>${p.season2025}</div><div class="historyline"><b>代表成绩：</b>${p.best}</div></div><div><h3 class="sectiontitle">F1 生涯成绩</h3><div class="historygrid"><div class="historybox"><span>世界冠军</span><b>${p.titles}</b></div><div class="historybox"><span>胜利</span><b>${p.wins}</b></div><div class="historybox"><span>领奖台</span><b>${p.podiums}</b></div><div class="historybox"><span>杆位</span><b>${p.poles}</b></div></div><h3 class="sectiontitle" style="margin-top:15px">本存档最近成绩</h3>${hist}</div></div><div class="newsTickerWrap"><div class="newsTickerHead"><b>PADDOCK WIRE · 围场快讯</b><span class="small">滚动播报</span></div><div class="newsTicker"><div class="newsTrack">${feed
      .concat(feed)
      .map(
        (x, i) =>
          `<span class="newsItem"><b>${i % 2 ? "RUMOUR" : "NEWS"}</b>${x}</span>`,
      )
      .join("")}</div></div></div></div>`;
  document.getElementById("overlay").classList.add("open");
};

// Expanded team relation events with explicit trade-offs
TEAM_WEEK_EVENTS_V10.splice(
  0,
  TEAM_WEEK_EVENTS_V10.length,
  {
    title: "升级件只有一套",
    body: "工程部门只完成了一套关键升级，两位车手都希望在下一站优先使用。",
    choices: [
      [
        "主动让队友先用",
        "先让出新件，换取更高合作意愿。",
        7,
        0.04,
        {
          perf: -0.8,
          benefit: "关系 +7～+9；未来让车损失更小",
          loss: "本周个人竞争力约 -0.8",
        },
      ],
      [
        "按积分排名分配",
        "把规则交给当前积分榜，风险取决于你是否领先。",
        1,
        0.14,
        {
          perf: 0.3,
          benefit: "若排名领先，可获得约 +0.3 周末资源",
          loss: "若排名落后或风险触发，关系可能 -3～-6",
        },
      ],
      [
        "坚持自己先用",
        "确保自己拿到升级，直接加剧内部竞争。",
        -7,
        0.22,
        {
          perf: 1.0,
          benefit: "本周个人竞争力约 +1.0",
          loss: "关系 -7，风险触发时可能进一步恶化",
        },
      ],
    ],
  },
  {
    title: "策略组要求提前确定首轮进站优先权",
    body: "两台车预计会处在同一个集团，under-cut窗口可能只有一圈。",
    choices: [
      [
        "接受赛道位置优先",
        "谁在前谁优先，规则简单。",
        5,
        0.05,
        {
          perf: 0,
          benefit: "关系 +5；车队指令执行更干净",
          loss: "你无法保证自己拿到最佳窗口",
        },
      ],
      [
        "要求积分领先者优先",
        "把赛季地位带入单场策略。",
        -1,
        0.12,
        {
          perf: 0.5,
          benefit: "若你领先积分，策略资源约 +0.5",
          loss: "关系小幅下降，积分接近时风险更高",
        },
      ],
      [
        "要求自己拥有第一策略权",
        "直接争夺核心车手待遇。",
        -8,
        0.24,
        {
          perf: 1.1,
          benefit: "本周策略资源约 +1.1",
          loss: "关系 -8；高概率制造后续冲突",
        },
      ],
    ],
  },
  {
    title: "赛后数据复盘变成了“谁更快”的讨论",
    body: "媒体已经拿到两台车的长距离曲线，车队内部也在比较谁的反馈更值得作为研发基准。",
    choices: [
      [
        "共享全部数据和方向盘设置",
        "最大化团队协作。",
        6,
        0.04,
        {
          perf: -0.3,
          benefit: "关系 +6；降低队友事件冲突概率",
          loss: "个人数据优势减少，约 -0.3",
        },
      ],
      [
        "只讨论技术，不讨论车手高低",
        "保持职业边界。",
        1,
        0.07,
        { perf: 0, benefit: "关系基本稳定", loss: "不会获得额外资源" },
      ],
      [
        "强调自己的反馈应成为研发基准",
        "争取技术话语权。",
        -6,
        0.19,
        {
          perf: 0.8,
          benefit: "研发/周末资源约 +0.8",
          loss: "关系 -6，风险触发时更差",
        },
      ],
    ],
  },
  {
    title: "模拟器黄金时段发生冲突",
    body: "高精度平台只剩一个完整时段，你和队友都希望拿来准备下一站。",
    choices: [
      [
        "拆分时间并共享结论",
        "两边都不完美，但合作最稳定。",
        7,
        0.04,
        {
          perf: -0.4,
          benefit: "关系 +7；双方训练都保留",
          loss: "你的专项训练收益略降",
        },
      ],
      [
        "用近期三站平均成绩决定",
        "让数据决定资源。",
        0,
        0.11,
        {
          perf: 0.4,
          benefit: "表现占优时资源约 +0.4",
          loss: "表现落后时可能失去黄金时段",
        },
      ],
      [
        "直接保留原本属于自己的时段",
        "优先个人准备。",
        -7,
        0.2,
        {
          perf: 0.9,
          benefit: "本周个人准备约 +0.9",
          loss: "关系 -7；让车事件更容易僵持",
        },
      ],
    ],
  },
  {
    title: "记者追问“车队到底有没有一号车手”",
    body: "你们最近几站积分非常接近，任何回答都可能被队友和管理层反复引用。",
    choices: [
      [
        "强调车队利益高于个人",
        "把矛盾压在围场内部。",
        6,
        0.03,
        {
          perf: -0.2,
          benefit: "关系 +6；媒体压力下降",
          loss: "个人地位诉求暂时弱化",
        },
      ],
      [
        "回答“赛道上自然会证明”",
        "保留竞争姿态。",
        -1,
        0.09,
        {
          perf: 0.2,
          benefit: "个人气势小幅提升",
          loss: "关系 -1，存在被媒体放大的风险",
        },
      ],
      [
        "明确表示自己应该得到优先支持",
        "公开争夺核心位置。",
        -9,
        0.25,
        {
          perf: 1.0,
          benefit: "短期资源约 +1.0",
          loss: "关系 -9；冲突和拒绝让车风险显著上升",
        },
      ],
    ],
  },
  {
    title: "两台车在最后一圈互相抢最快圈",
    body: "车队原本要求把赛车安全带回，但你和队友都在准备最后一次全力飞驰。",
    choices: [
      [
        "取消尝试，按车队要求收车",
        "把合作放在额外一分之前。",
        5,
        0.03,
        { perf: -0.3, benefit: "关系 +5", loss: "放弃一次潜在最快圈/表现收益" },
      ],
      [
        "谁有空间谁做",
        "保留公平竞争。",
        1,
        0.09,
        {
          perf: 0.2,
          benefit: "保留有限机会",
          loss: "若交通重叠可能小幅关系下降",
        },
      ],
      [
        "抢先要求工程师给自己净空",
        "直接争夺最后资源。",
        -6,
        0.18,
        {
          perf: 0.7,
          benefit: "获得更好的飞驰准备",
          loss: "关系 -6；队友可能采取同样强硬方式",
        },
      ],
    ],
  },
  {
    title: "车队希望一位车手承担实验调校",
    body: "新部件数据不足，需要一台车在练习中牺牲常规程序收集极端设定数据。",
    choices: [
      [
        "主动承担实验程序",
        "帮助车队理解升级。",
        8,
        0.05,
        {
          perf: -0.8,
          benefit: "关系 +8；未来研发新闻更积极",
          loss: "本周准备约 -0.8",
        },
      ],
      [
        "两台车各承担一半",
        "平均分配代价。",
        3,
        0.07,
        { perf: -0.2, benefit: "关系 +3", loss: "双方都损失一点准备时间" },
      ],
      [
        "要求队友承担",
        "保护自己的比赛程序。",
        -7,
        0.2,
        { perf: 0.8, benefit: "个人准备约 +0.8", loss: "关系 -7；队友不满" },
      ],
    ],
  },
  {
    title: "车队指令无线电被媒体完整放出",
    body: "上站的一段内部沟通突然成为热点，外界开始猜测两位车手是否已经失去信任。",
    choices: [
      [
        "私下先和队友把话说开",
        "主动降温。",
        8,
        0.04,
        {
          perf: -0.2,
          benefit: "关系 +8；下一次让车事件风险明显下降",
          loss: "没有额外竞技收益",
        },
      ],
      [
        "统一使用车队公关口径",
        "把问题维持在职业层面。",
        2,
        0.08,
        {
          perf: 0,
          benefit: "关系 +2；舆论风险下降",
          loss: "内部问题没有真正解决",
        },
      ],
      [
        "公开说明自己当时不同意指令",
        "坚持立场。",
        -8,
        0.23,
        {
          perf: 0.6,
          benefit: "强化个人立场",
          loss: "关系 -8；以后拒绝让车更可能两败俱伤",
        },
      ],
    ],
  },
  {
    title: "排位尾声出现互相拖车的机会",
    body: "你们两台车都需要最后一圈，但最佳出场顺序只能让其中一人获得明显尾流。",
    choices: [
      [
        "这次给队友尾流，下次交换",
        "建立明确互惠。",
        7,
        0.06,
        {
          perf: -0.5,
          benefit: "关系 +7；以后类似事件更容易互换",
          loss: "本轮排位收益约 -0.5",
        },
      ],
      [
        "按上一站排位更差者优先",
        "用补偿逻辑分配。",
        3,
        0.09,
        { perf: 0, benefit: "关系 +3", loss: "不一定符合你当前利益" },
      ],
      [
        "要求自己拿尾流",
        "把单圈放在第一位。",
        -7,
        0.21,
        {
          perf: 0.9,
          benefit: "排位准备约 +0.9",
          loss: "关系 -7；队友可能拒绝以后配合",
        },
      ],
    ],
  },
  {
    title: "积分榜差距突然缩小",
    body: "连续两站之后，你和队友只差个位数积分。车队管理层要求你们在内部会议上明确竞争边界。",
    choices: [
      [
        "同意自由竞争但禁止低成功率强插",
        "设定清楚红线。",
        5,
        0.05,
        {
          perf: 0.1,
          benefit: "关系 +5；碰撞风险下降",
          loss: "极端超车机会会被主动放弃",
        },
      ],
      [
        "保持现状，不增加额外规则",
        "相信职业判断。",
        0,
        0.1,
        {
          perf: 0.2,
          benefit: "保持最大自由度",
          loss: "关系不会改善，冲突仍可能升级",
        },
      ],
      [
        "拒绝任何限制",
        "把争冠/排名放在内部秩序前。",
        -8,
        0.24,
        {
          perf: 0.8,
          benefit: "进攻自由度最大",
          loss: "关系 -8；直接碰撞风险提高",
        },
      ],
    ],
  },
);
renderMedia = function () {
  ensureStateV11();
  ensureTeamWeekEventV10();
  const tm = teammateV10(),
    v = state.teamRelation,
    evt = state.teamWeekEvent;
  document.getElementById("teamRelationStatus").textContent =
    relationStatusV10(v);
  document.getElementById("teamRelationPair").textContent =
    `${selected[0]} ↔ ${tm?.[0] || "队友"} · ${v}/100`;
  document.getElementById("teamRelationBar").style.width = v + "%";
  document.getElementById("rivalStats").innerHTML =
    `<div><span>你领先队友</span><b>${state.rivalry.playerAhead}</b></div><div><span>队友领先你</span><b>${state.rivalry.teammateAhead}</b></div><div><span>让车 / 冲突</span><b>${state.rivalry.orders} / ${state.rivalry.clashes}</b></div>`;
  const box = document.getElementById("teamWeekEvent");
  if (evt.resolved) {
    box.innerHTML = `<div class="kicker">THIS WEEK · RESOLVED</div><h2>${evt.event.title}</h2><p>${evt.outcome}</p><div class="hint">本周队内事件已处理。下一轮会结合最新积分差、直接交锋和关系状态重新生成。</div>`;
  } else {
    box.innerHTML = `<div class="kicker">THIS WEEK · TEAM EVENT</div><h2>${evt.event.title}</h2><p>${evt.event.body}</p><div class="weeklyChoices">${evt.event.choices
      .map((c, i) => {
        const e = c[4] || {};
        return `<div class="weeklyChoice" onclick="resolveTeamWeekEventV10(${i})"><b>${c[0]}</b><span>${c[1]}</span><div class="choiceOutcome"><span class="gain">收益：${e.benefit || "视结果而定"}</span><span class="loss">代价/风险：${e.loss || "存在小幅随机波动"}</span></div></div>`;
      })
      .join("")}</div>`;
  }
};
resolveTeamWeekEventV10 = function (i) {
  const w = state.teamWeekEvent;
  if (!w || w.resolved) return;
  const c = w.event.choices[i],
    e = c[4] || {};
  let delta = c[2];
  if (Math.random() < c[3]) delta -= 3 + Math.floor(Math.random() * 5);
  else if (delta > 0 && Math.random() < 0.4)
    delta += 1 + Math.floor(Math.random() * 2);
  state.teamRelation = Math.max(0, Math.min(100, state.teamRelation + delta));
  state.teamWeekModifier = e.perf || 0;
  w.resolved = true;
  const perf =
    state.teamWeekModifier > 0
      ? `本周个人资源修正约 +${state.teamWeekModifier.toFixed(1)}。`
      : state.teamWeekModifier < 0
        ? `本周个人资源修正约 ${state.teamWeekModifier.toFixed(1)}。`
        : "本周竞技资源保持中性。";
  w.outcome = `你选择了「${c[0]}」。队内关系 ${delta >= 0 ? "+" : ""}${delta}，当前为「${relationStatusV10()}」。${perf}`;
  renderMedia();
  renderHub();
  autosave();
};

// Contract market: real-world contract timing + one-month response delay
function resolvePendingContractV11() {
  ensureStateV11();
  const p = state.contract.pending;
  if (!p) return;
  if (p.resolveRound <= calendar.length && state.round < p.resolveRound) return;
  if (p.resolveYear && seasonYearV11() < p.resolveYear) return;
  const o = state.contract.offers.find((x) => x.team === p.team);
  if (!o) {
    state.contract.pending = null;
    return;
  }
  let chance =
    p.type === "accept"
      ? 0.95
      : p.type === "role"
        ? Math.min(
            0.88,
            0.38 + (driverRankV10() <= 5 ? 0.28 : 0) + (o.interest - 60) / 100,
          )
        : Math.min(
            0.84,
            0.45 + (driverRankV10() <= 8 ? 0.2 : 0) + (o.interest - 60) / 120,
          );
  const ok = Math.random() < chance;
  if (ok) {
    if (p.type === "role") o.role = "一号车手 / 核心席位";
    if (p.type === "salary") o.salary = Math.round(o.salary * 1.18);
    state.contract.nextTeam = p.team;
    state.contract.signedRound = state.round;
    state.contract.nextEnd = seasonYearV11() + (o.years || 1);
    state.contractHistory.unshift(
      `${p.team}：谈判完成，${seasonYearV11() + 1} 合同已确认。`,
    );
  } else {
    o.status = "watch";
    o.interest = Math.max(30, o.interest - 10);
    state.contractHistory.unshift(`${p.team}：本轮谈判未达成，车队继续观察。`);
  }
  state.contract.pending = null;
}
refreshContractMarketV10 = function (force = false) {
  ensureStateV11();
  resolvePendingContractV11();
  if (state.contract.nextTeam) return;
  const y = seasonYearV11();
  if (state.round < 6 && !force) return;
  if (
    !force &&
    state.contract.lastRefresh &&
    state.round - state.contract.lastRefresh < 3
  )
    return;
  state.contract.lastRefresh = state.round;
  state.contract.offers = Object.keys(teams).map((team) => {
    const interest = generateContractInterestV10(team),
      rank = driverRankV10(),
      prest = TEAM_PRESTIGE_V10[team] || 70,
      seat = seatAvailabilityV11(team);
    let status = interest >= 64 ? "offer" : interest >= 44 ? "watch" : "cold";
    if (seat.count === 0 && team !== selected[1]) status = "locked";
    if (team === selected[1] && interest >= 48) status = "offer";
    const salary = Math.round(
        4 + prest * 0.1 + selected[2] * 0.09 + Math.max(0, 12 - rank) * 0.55,
      ),
      years = rank <= 5 ? 2 : 1 + Math.floor(Math.random() * 2),
      role = rank <= 4 ? "争冠核心" : rank <= 9 ? "平等竞争" : "长期计划";
    return { team, interest, status, salary, years, role, seat };
  });
};
renderContractsV10 = function () {
  ensureStateV11();
  refreshContractMarketV10();
  resolvePendingContractV11();
  const c = state.contract,
    rank = driverRankV10(),
    signed = c.nextTeam,
    y = seasonYearV11(),
    ci = contractInfoV11(selected[0]),
    pending = c.pending;
  document.querySelector("#contracts .modulehead .kicker").textContent =
    "DRIVER MARKET";
  document.querySelector("#contracts .modulehead h1").textContent =
    `车手市场 · ${y + 1}`;
  document.getElementById("contractContent").innerHTML =
    `<div class="contractTop"><div class="contractCurrent"><div class="kicker">CURRENT CONTRACT</div><h2>${selected[1]}</h2><div class="small">现实合同参考：${ci.label} · 当前车手排名 P${rank}</div><div class="contractReality">${ci.note}。游戏中的续约、执行选项和提前跳出会再结合本存档成绩决定。</div>${pending ? `<div class="contractPending">谈判已递交给 ${pending.team}。预计到下个月的比赛周才会得到正式答复。</div>` : ""}<div class="forecastStrip"><div class="forecastBox"><span>市场价值</span><b>${rank <= 3 ? "顶级" : rank <= 8 ? "很高" : rank <= 14 ? "稳定" : "待证明"}</b></div><div class="forecastBox"><span>${y + 1} 去向</span><b>${signed || "未签约"}</b></div><div class="forecastBox"><span>谈判状态</span><b>${pending ? "等待答复" : state.round < 6 ? "窗口未开放" : "可接触"}</b></div></div></div><div class="card"><h2 class="sectiontitle">合同规则</h2><div class="hint">车队只有在现实合同进入到期、选项或退出条款窗口时才更容易开放席位。提交谈判后不会立即出结果，需要等到下个月；续约会延长合同时间，提前离队则需要条款或足够高的市场价值。</div></div></div><div class="contractMarket">${c.offers
      .map((o) => {
        const roster = o.seat.roster
          .map((d) => `${d[0]}（${contractInfoV11(d[0]).label}）`)
          .join(" / ");
        return `<div class="contractCard ${signed === o.team ? "signed" : o.status === "offer" ? "offer" : ""}"><div class="cHead"><h3>${o.team}</h3><span class="interest">兴趣 ${o.interest}%</span></div><div class="interestBar"><div style="width:${o.interest}%"></div></div><div class="contractReality">现有席位：${roster}</div><div class="contractTerms">${o.status === "offer" ? `€${o.salary}M / 年 · ${o.years}年<br>${o.role}` : o.status === "locked" ? "现有合同暂时锁定两个席位" : o.status === "watch" ? "正在观察你的后续成绩" : "暂未进入主要候选名单"}</div><button class="mini" ${signed || pending || state.round < 6 || o.status !== "offer" ? "disabled" : ""} onclick="openContractNegotiationV10('${o.team}')">${signed === o.team ? "已签约" : pending && pending.team === o.team ? "等待答复" : o.status === "offer" ? "递交谈判" : "暂无报价"}</button></div>`;
      })
      .join("")}</div>`;
};
openContractNegotiationV10 = function (team) {
  const o = state.contract.offers.find((x) => x.team === team);
  if (!o || state.contract.nextTeam || state.contract.pending) return;
  document.getElementById("modalTitle").textContent =
    `CONTRACT NEGOTIATION · ${team}`;
  document.getElementById("modalBody").innerHTML =
    `<div class="driverdetail"><div class="kicker">${seasonYearV11() + 1} DRIVER MARKET</div><div class="driverdetailname">${team}</div><div class="historyline">初步条件：€${o.salary}M / 年 · ${o.years} 年 · ${o.role}</div><div class="hint">你今天只是递交谈判立场。车队不会当场给出最终答复，结果会在下个月的比赛周返回。</div><div class="weeklyChoices"><div class="weeklyChoice" onclick="resolveContractV10('${team}','accept')"><b>接受框架报价</b><span>成功率最高，但仍要等待车队完成内部审批。</span></div><div class="weeklyChoice" onclick="resolveContractV10('${team}','role')"><b>要求更高队内地位</b><span>争取核心席位；成绩越好，车队下个月批准的概率越高。</span></div><div class="weeklyChoice" onclick="resolveContractV10('${team}','salary')"><b>继续抬价</b><span>要求更高薪资，可能让谈判在下个月被拒绝。</span></div></div></div>`;
  document.getElementById("overlay").classList.add("open");
};
resolveContractV10 = function (team, type) {
  ensureStateV11();
  if (state.contract.pending || state.contract.nextTeam) return;
  const o = state.contract.offers.find((x) => x.team === team);
  if (!o) return;
  const rr = nextMonthResolveRoundV11(state.round);
  state.contract.pending = {
    team,
    type,
    submittedRound: state.round,
    resolveRound: rr,
    resolveYear: rr > calendar.length ? seasonYearV11() + 1 : seasonYearV11(),
  };
  closeOverlay();
  renderContractsV10();
  renderHub();
  autosave();
};

// Hub simplified; no duplicated season-status card
renderHub = function () {
  ensureStateV11();
  completeProjects();
  ensurePrep();
  refreshContractMarketV10();
  resolvePendingContractV11();
  const r = calendar[Math.min(state.round - 1, calendar.length - 1)];
  document.getElementById("devCount").textContent =
    `${state.projects.length} / 2`;
  document.getElementById("trainingStatus").textContent = state.trainingUsed
    ? prepPlanName(state.prep.type) || "已完成"
    : "未安排";
  document.getElementById("hubDriver").textContent = selected[0];
  document.getElementById("hubTeam").textContent = selected[1];
  document.getElementById("hubOvr").textContent = selected[2];
  document.getElementById("hubBudget").textContent =
    "€ " + state.budget.toFixed(1) + "M";
  document.getElementById("nextRace").textContent = r ? r[1] : "赛季结束";
  document.getElementById("nextDate").textContent = r
    ? r[2] + " · " + r[3]
    : `${seasonYearV11()}赛季已完成`;
  document.getElementById("hubDate").textContent = r
    ? `${seasonYearV11()} · ROUND ${String(state.round).padStart(2, "0")} · ${r[1].replace("大奖赛", "")}`
    : "SEASON COMPLETE";
  const hdr = document.querySelector("#career .careerHeader .kicker");
  if (hdr) hdr.textContent = `${seasonYearV11()} DRIVER CAREER`;
  state.driverPoints = state.driverStandings[selected[0]] || 0;
  state.teamPoints = state.teamStandings[selected[1]] || 0;
  document.getElementById("raceModuleRound").textContent =
    "ROUND " + String(state.round).padStart(2, "0");
  document.getElementById("raceModuleName").textContent = r
    ? r[1].replace("大奖赛", "")
    : "赛季结束";
  document.getElementById("hubChampRank").textContent = "P" + driverRankV10();
  document.getElementById("contractStatus").textContent = state.contract
    .nextTeam
    ? `已签 ${state.contract.nextTeam}`
    : state.contract.pending
      ? `等待 ${state.contract.pending.team}`
      : state.round < 6
        ? "窗口未开放"
        : "市场开放";
  const a = [
    ["OVR", selected[2]],
    ["EXP", selected[3]],
    ["RAC", selected[4]],
    ["AWA", selected[5]],
    ["PAC", selected[6]],
  ];
  document.getElementById("hubDriverStats").innerHTML = a
    .map(
      (x) => `<div class="driverstat"><span>${x[0]}</span><b>${x[1]}</b></div>`,
    )
    .join("");
};

// Training copy becomes track-specific every round

// Season rollover, research application, contract evolution
function applyNextSeasonResearchV11() {
  ensureStateV11();
  const oldTeam = selected[1];
  CAR_ATTRS_V10.forEach((a) => {
    teams[oldTeam].parts[a] = Math.min(
      94,
      teams[oldTeam].parts[a] + (state.nextSeasonResearch[a] || 0),
    );
    Object.keys(teams).forEach((t) => {
      teams[t].parts[a] = Math.min(
        94,
        teams[t].parts[a] + (state.aiNextSeasonResearch[t]?.[a] || 0),
      );
    });
  });
  Object.keys(teams).forEach((t) => recalcTeamOvr(teams[t]));
}
function evolveContractsV11() {
  ensureStateV11();
  const y = seasonYearV11();
  drivers.forEach((d) => {
    if (d[0] === selected[0]) return;
    const c = contractInfoV11(d[0]);
    if (c.end > y) return;
    const pts = state.driverStandings[d[0]] || 0,
      st = state.driverSeasonStats[d[0]] || { wins: 0 };
    let extend = pts >= 25 || st.wins > 0 || Math.random() < 0.55;
    if (d[0] === "Lance Stroll") extend = true;
    if (extend) {
      const yrs = pts >= 100 ? 2 : 1;
      c.end = y + yrs;
      c.label = `续约至 ${c.end}`;
      c.option = true;
      state.contractHistory.unshift(
        `${d[0]} 与 ${d[1]} 完成续约，合同延长至 ${c.end}。`,
      );
    } else
      state.contractHistory.unshift(
        `${d[0]} 的 ${d[1]} 合同到期，下一赛季席位进入开放状态。`,
      );
  });
}
function transferPlayerV11() {
  ensureStateV11();
  const target = state.contract.nextTeam;
  if (!target || target === selected[1]) {
    if (target === selected[1]) {
      const c = contractInfoV11(selected[0]);
      c.end = state.contract.nextEnd || seasonYearV11() + 1;
      c.label = `续约至 ${c.end}`;
    }
    return;
  }
  const old = selected[1],
    cands = drivers
      .filter((d) => d[1] === target && d[0] !== selected[0])
      .sort(
        (a, b) =>
          contractInfoV11(a[0]).end - contractInfoV11(b[0]).end || a[2] - b[2],
      );
  const displaced = cands[0];
  if (displaced) {
    displaced[1] = old;
    const dc = contractInfoV11(displaced[0]);
    dc.end = seasonYearV11() + 1;
    dc.label = `转投 ${old} · 至 ${dc.end}`;
  }
  selected[1] = target;
  const pc = contractInfoV11(selected[0]);
  pc.end = state.contract.nextEnd || seasonYearV11() + 1;
  pc.label = `至 ${pc.end}`;
}
function startNextSeasonV11() {
  ensureStateV11();
  const nextY = seasonYearV11() + 1,
    oldTeam = selected[1],
    savedFund = state.nextSeasonFund;
  applyNextSeasonResearchV11();
  evolveContractsV11();
  transferPlayerV11();
  if (!state.contract.nextTeam && contractInfoV11(selected[0]).end < nextY) {
    const pc = contractInfoV11(selected[0]);
    pc.end = nextY;
    pc.label = `续约至 ${nextY}`;
  }
  state.seasonYear = nextY;
  state.round = 1;
  state.budget =
    (TEAM_BUDGET_V11[selected[1]] || 32) +
    (selected[1] === oldTeam ? savedFund : 0);
  state.nextSeasonFund = 0;
  state.projects = [];
  state.devMode = "current";
  state.nextSeasonResearch = {};
  CAR_ATTRS_V10.forEach((a) => (state.nextSeasonResearch[a] = 0));
  state.aiNextSeasonResearch = {};
  Object.keys(teams).forEach((t) => {
    state.aiNextSeasonResearch[t] = {};
    CAR_ATTRS_V10.forEach((a) => (state.aiNextSeasonResearch[t][a] = 0));
  });
  state.history = [];
  state.seasonResults = [];
  state.driverStandings = {};
  state.teamStandings = {};
  state.driverSeasonStats = {};
  drivers.forEach((d) => {
    state.driverStandings[d[0]] = 0;
    state.driverSeasonStats[d[0]] = { wins: 0, podiums: 0, poles: 0, dnfs: 0 };
  });
  Object.keys(teams).forEach((t) => (state.teamStandings[t] = 0));
  state.trainingUsed = false;
  state.prep = { round: 1, type: null, qual: 0, race: 0, control: 0 };
  state.teamWeekEvent = null;
  state.teamWeekModifier = 0;
  state.rivalry = {
    playerAhead: 0,
    teammateAhead: 0,
    orders: 0,
    clashes: 0,
    streak: 0,
  };
  state.contract = {
    nextTeam: null,
    signedRound: null,
    offers: [],
    lastRefresh: 0,
    pending: null,
  };
  resetWeekend();
  const tm = teammateV10();
  state.teamRelation = tm
    ? Math.max(35, Math.min(82, relationshipBase(selected[0], tm[0])))
    : 60;
  ensureAITrainingV10(true);
  refreshContractMarketV10(true);
  renderHub();
  autosave();
  raceTransition(
    `${nextY} SEASON`,
    `新赛季研发成果已经并入赛车，合同与车手市场进入新的周期。`,
    "NEW SEASON",
    "career",
  );
}
advanceRound = function () {
  if (!state.weekend.raceResult) return;
  ensureStateV11();
  if (state.round >= calendar.length) {
    showSeasonFinaleV10();
    autosave();
    return;
  }
  state.round++;
  processAIDevelopmentV10();
  state.trainingUsed = false;
  state.prep = { round: state.round, type: null, qual: 0, race: 0, control: 0 };
  state.teamWeekEvent = null;
  state.teamWeekModifier = 0;
  resetWeekend();
  completeProjects();
  ensureAITrainingV10(true);
  resolvePendingContractV11();
  refreshContractMarketV10();
  renderHub();
  autosave();
  showView("career");
};
showSeasonFinaleV10 = function () {
  ensureStateV11();
  completeProjects();
  const rank = driverRankV10(),
    teamRank = teamRankV10(),
    st = state.driverSeasonStats[selected[0]],
    next = state.contract.nextTeam,
    y = seasonYearV11();
  let title, text;
  if (rank === 1) {
    title = "世界冠军";
    text = `${y} 是属于你的冠军赛季。赛车并非每站都拥有同样优势，但你把关键周末、策略选择与可靠性风险尽可能兑换成了积分。`;
  } else if (rank <= 3) {
    title = "争冠集团的核心人物";
    text = `你把 ${y} 赛季一直拖进争冠核心区。几次退赛、队内博弈或赛道适配差异最终决定了名次，但围场已经把你视作真正的冠军候选。`;
  } else if (rank <= 6) {
    title = "顶级赛季";
    text =
      "你稳定出现在最前列，并用多个高质量周末改变了车手市场对你的估值。下一年，目标已经不只是偶尔站上领奖台。";
  } else if (rank <= 10) {
    title = "车队不可替代的得分支点";
    text =
      "赛车并不总能提供领奖台速度，但你持续把中游机会变成积分。这个赛季最重要的成果，也许是让下一代赛车和下一份合同拥有了更好的起点。";
  } else if (rank <= 16) {
    title = "一场漫长的追赶";
    text =
      "你经历了升级失效、赛道不适配和中游混战。成绩并不耀眼，但下赛季研究和资源储备已经为下一次跃升留下空间。";
  } else {
    title = "重建，从下一年开始";
    text =
      "这是一个艰难赛季。与其粉饰结果，不如承认赛车和周末执行都没有达到目标；好消息是，你可以把今年的资源选择真正带进下一代赛车。";
  }
  document.querySelector("#seasonfinale .kicker").textContent =
    `${y} SEASON COMPLETE`;
  document.getElementById("finalChampRank").textContent = "P" + rank;
  document.getElementById("finalTitle").textContent = title;
  document.getElementById("finalText").textContent = text;
  document.getElementById("finalStats").innerHTML =
    `<div><span>车手积分</span><b>${state.driverStandings[selected[0]]}</b></div><div><span>胜利</span><b>${st.wins}</b></div><div><span>领奖台</span><b>${st.podiums}</b></div><div><span>车队排名</span><b>P${teamRank}</b></div>`;
  const research = Object.values(state.nextSeasonResearch).reduce(
    (a, b) => a + b,
    0,
  );
  document.getElementById("finalContract").innerHTML =
    `${next ? `${y + 1}：已与 <b>${next}</b> 达成合同。` : `${y + 1}：暂未签下新车队，默认继续处理当前席位。`}<br>下一代赛车研究累计 ${research} 点；另有 €${state.nextSeasonFund.toFixed(1)}M 已锁定到下一赛季。`;
  const btn = document.getElementById("nextSeasonBtn");
  if (btn) btn.textContent = `进入 ${y + 1} 赛季 →`;
  showView("seasonfinale");
};

// Snapshot v11 and migration from v10 car baselines

restoreSnapshot = function (data) {
  if (!data || !data.selected) return false;
  const d = drivers.find((x) => x[0] === data.selected);
  if (!d) return false;
  selected = d;
  Object.entries(CAR_BASE_V11).forEach(([n, vals]) => {
    const shape = {};
    CAR_ATTRS_V10.forEach((a, i) => (shape[a] = vals[i]));
    baseTeams[n].parts = JSON.parse(JSON.stringify(shape));
    baseTeams[n].budget = TEAM_BUDGET_V11[n] || 32;
    baseTeams[n].ovr = Math.round(vals.reduce((a, b) => a + b, 0) / 6);
    teams[n] = JSON.parse(JSON.stringify(baseTeams[n]));
  });
  if (data.teams) {
    Object.keys(data.teams).forEach((n) => {
      if (!teams[n] || !data.teams[n]?.parts) return;
      if ((data.version || 0) >= 11) {
        teams[n] = JSON.parse(JSON.stringify(data.teams[n]));
      } else {
        CAR_ATTRS_V10.forEach((a, i) => {
          const oldBase = OLD_CAR_BASE_V10[n]?.[i] ?? teams[n].parts[a],
            saved = data.teams[n].parts[a] ?? oldBase,
            delta = Math.max(0, saved - oldBase);
          teams[n].parts[a] = Math.min(
            92,
            (CAR_BASE_V11[n]?.[i] ?? saved) + delta,
          );
        });
        recalcTeamOvr(teams[n]);
      }
    });
  }
  state = normalizeLoadedState(data.state);
  if (!state.weekend) resetWeekend();
  ensureStateV11();
  if ((data.version || 0) < 11) {
    state.budget = Math.min(
      45,
      state.budget || TEAM_BUDGET_V11[selected[1]] || 32,
    );
    state.seasonYear = 2026;
    state.driverContracts = JSON.parse(JSON.stringify(DRIVER_CONTRACTS_V11));
    state.contract.pending = null;
  }
  renderProfile();
  renderHub();
  return true;
};

/* v12-script */

const V12_TRACK_FACTS = {
  墨尔本: [
    "Albert Park 的部分赛道来自公共道路，周末初期赛道通常会经历明显的抓地力演化。",
    "这里的制动与高速变向混在一起，赛车若前后轴不够一致，很容易在一圈里同时丢两种弯。",
  ],
  上海: [
    "上海国际赛车场的整体轮廓以汉字“上”为设计灵感。",
    "超长一号弯会持续改变前轮负荷，最后一条长直道又把动力与低阻效率重新拉回考卷。",
  ],
  铃鹿: [
    "铃鹿最著名的结构是“8”字形布局，赛道通过立交桥从自身上方跨过。",
    "S弯不是单个弯快就够了：第一处失衡往往会一路把节奏带坏到后面的连续弯。",
  ],
  迈阿密: [
    "赛道围绕 Hard Rock Stadium 建设，慢速技术区与长直道的设定需求经常彼此打架。",
    "这里的高温与低速牵引会让后胎管理成为比纸面极速更实际的问题。",
  ],
  蒙特利尔: [
    "最后减速弯出口外侧就是著名的“冠军墙”，名字来自多位世界冠军在这里撞墙。",
    "Circuit Gilles-Villeneuve 的长直道被重刹弯切开，制动稳定和牵引经常比高速弯下压力更值钱。",
  ],
  蒙特卡洛: [
    "摩纳哥仍然保留 F1 最具辨识度的隧道路段，光线变化和狭窄赛道一起考验车手判断。",
    "这里超车空间极少，排位赛得到的赛道位置通常比“理论正赛速度”更有实际价值。",
  ],
  "巴塞罗那-加泰罗尼亚": [
    "巴塞罗那长期被视作检验整车空气动力效率的综合型赛道。",
    "长弯会把平衡问题放大：一台单圈很快但吃胎的车，正赛画像可能完全不同。",
  ],
  斯皮尔伯格: [
    "红牛环单圈很短，但海拔起伏明显，几段重刹和上坡加速让动力表现非常直观。",
    "因为圈长短，排位差距常被压得很密，小失误却会掉很多名次。",
  ],
  银石: [
    "Maggotts–Becketts–Chapel 是现代 F1 最经典的高速连续变向组合之一。",
    "高速弯很多意味着空力效率重要，但侧风变化也会让一台本来平衡的车突然变得难预测。",
  ],
  "斯帕-弗朗科尔尚": [
    "斯帕单圈超过 7 公里，是现役 F1 最长的赛道之一。",
    "同一圈里不同区域出现不同天气并不稀奇，赛道长度会把换胎判断的代价放大。",
  ],
  布达佩斯: [
    "匈牙利赛道常被形容成“没有墙的摩纳哥”，连续中慢速弯让节奏与机械抓地非常重要。",
    "赛道位置重要，但高温下轮胎退化也可能把看似锁死的比赛重新打开。",
  ],
  赞德沃特: [
    "赞德沃特的 3 号和 14 号弯拥有非常醒目的倾斜弯设计。",
    "窄赛道加高速倾斜弯意味着跟车不轻松，排位和起步都很容易放大周末结果。",
  ],
  蒙扎: [
    "蒙扎被称为“速度圣殿”，车队会为这里追求极低阻力设定。",
    "动力强不等于自动快：减速弯的制动稳定与出弯牵引同样决定你能不能把直道优势兑现。",
  ],
  马德里: [
    "作为新加入赛历的场地，历史数据样本有限——这会让模型预测本身比传统赛道更不确定。",
    "新赛道的周末往往更考验车队建立基线的速度，而不是谁拥有最多旧数据。",
  ],
  巴库: [
    "巴库老城段极窄，但随后接一段超长全油门区域，是低速机械抓地和直线效率的极端混合题。",
    "这里安全车与重启经常能把原本稳定的赛道位置重新洗牌。",
  ],
  雪邦: [
    "雪邦以长直道、快速弯和热带天气闻名，空气温度与突发降雨都会给冷却和轮胎制造压力。",
    "宽赛道提供多种线路，但强降雨时视野与积水会迅速成为主要变量。",
  ],
  滨海湾: [
    "新加坡是 F1 标志性的夜赛之一，高温高湿让车手和赛车冷却都承受很大负荷。",
    "低速弯很多、墙又近，机械抓地与稳定性比单纯极速更能决定周末是否顺利。",
  ],
  奥斯汀: [
    "COTA 一号弯前是一段非常陡的上坡，起步后整个集团会在坡顶突然收紧。",
    "赛道把高速 S 弯、长直道和低速技术区放在一圈里，是典型的综合能力测试。",
  ],
  墨西哥城: [
    "墨西哥城赛道海拔超过 2200 米，稀薄空气会同时影响冷却、下压力与动力系统工作方式。",
    "即便开高下压力翼片，空气密度仍会让实际阻力和下压力表现不同于海平面赛道。",
  ],
  因特拉格斯: [
    "Interlagos 是少数逆时针 F1 赛道之一，而且单圈短、起伏大。",
    "天气和安全车经常让这里的策略窗口变得非常活跃。",
  ],
  拉斯维加斯: [
    "拉斯维加斯夜间比赛可能遇到很低的赛道温度，轮胎启动因此格外敏感。",
    "长直道让动力与低阻效率突出，但冷胎进入重刹弯会制造另一种风险。",
  ],
  卢赛尔: [
    "卢赛尔有大量中高速长弯，持续横向负荷对轮胎非常严苛。",
    "这里的单圈节奏很流畅，赛车平衡问题通常会连续影响多个弯而不是只损失一个制动点。",
  ],
  亚斯码头: [
    "阿布扎比从日落跑入夜间，赛道温度会在比赛过程中持续变化。",
    "长直道与低速弯并存，让动力效率和机械抓地都能在同一圈产生明显影响。",
  ],
};
const V12_DRIVER_FACTS = {
  "Max Verstappen": [
    "17岁完成 F1 首秀；他的生涯从一开始就伴随着“最年轻”纪录。",
    "2016 西班牙大奖赛首次代表 Red Bull 出赛就赢下比赛。",
  ],
  "Charles Leclerc": [
    "出生于摩纳哥，因此主场周末几乎真的可以步行回家。",
    "进入 F1 前连续拿下 GP3 与 F2 年度冠军。",
  ],
  "Lewis Hamilton": [
    "拥有七个 F1 世界冠军头衔，是这项运动最成功的车手之一。",
    "他的首个 F1 赛季就直接参与世界冠军争夺。",
  ],
  "Lando Norris": [
    "在卡丁车和初级方程式阶段就与多位现役车手长期同场竞争。",
    "他的无线电和赛后采访经常比车队公关稿更快成为围场梗。",
  ],
  "Oscar Piastri": [
    "进入 F1 前连续赢得 Formula Renault、F3 和 F2 重要年度冠军。",
    "以非常冷静的无线电风格出名，激烈比赛后也常像刚结束一次普通会议。",
  ],
  "George Russell": [
    "2018 年 F2 总冠军，随后从 Williams 进入 Mercedes。",
    "围场里出了名地爱做功课，工程会议风格也很“学生会主席”。",
  ],
  "Kimi Antonelli": [
    "从 Mercedes 青训体系快速晋升，是新世代车手里最受关注的名字之一。",
    "名字叫 Kimi，但不是因为 Räikkönen——至少这件事已经被解释过很多次。",
  ],
  "Fernando Alonso": [
    "2001 年完成 F1 首秀，职业生涯跨度横跨多个技术时代。",
    "两届世界冠军，也是围场里最擅长把一句无线电变成长期梗的人之一。",
  ],
  "Carlos Sainz": [
    "来自著名赛车家庭，但走的是单座方程式路线。",
    "以细致反馈和适应不同赛车的能力闻名。",
  ],
  "Pierre Gasly": [
    "2020 年在蒙扎赢得个人首场 F1 胜利。",
    "和 Leclerc 从少年时期就认识，是围场里持续时间很长的一段友谊。",
  ],
  "Esteban Ocon": [
    "2021 年匈牙利大奖赛拿到个人 F1 首胜。",
    "身高很高，所以车队拍集体照时经常天然破坏构图。",
  ],
  "Valtteri Bottas": [
    "拥有 10 场 F1 分站胜利。",
    "围场之外的自行车、咖啡和澳大利亚梗已经发展成第二职业。",
  ],
  "Sergio Perez": [
    "以轮胎管理和街道赛表现闻名，曾在多场混乱比赛中把长距离策略跑到极致。",
    "他的首胜来自一场从最后一名附近一路翻回前面的比赛。",
  ],
  "Nico Hulkenberg": [
    "长期以排位单圈和稳定反馈著称。",
    "职业生涯跨越多个时代，围场经验是新厂队非常看重的资产。",
  ],
};
function v12Pick(arr, seed = 0) {
  if (!arr || !arr.length) return "";
  return arr[Math.abs(seed) % arr.length];
}
function generateNewsFeedV12() {
  ensureStateV11();
  const r = currentRace(),
    round = state.round,
    track = r?.[2] || "围场",
    tm = teammateV10();
  const facts = V12_TRACK_FACTS[track] || [
    "这一站的数据样本会继续改变车队对赛车强弱的判断。",
  ];
  const df = V12_DRIVER_FACTS[selected[0]] || [
    "围场里真正能长期保密的东西，通常只有下一圈的轮胎温度。",
  ];
  let cards = [
    {
      type: "TRACK NOTE",
      title: `${track} · 赛道冷知识`,
      text: v12Pick(facts, round),
      meta: r?.[4] ? "SPRINT WEEKEND · 周末节奏更紧" : "GRAND PRIX WEEKEND",
    },
    {
      type: "DRIVER FILE",
      title: selected[0],
      text: v12Pick(df, round + selected[0].length),
      meta: "PADDOCK PROFILE",
    },
    {
      type: "RUMOUR",
      title: "升级件观察",
      text:
        state.aiDevNews?.[0] ||
        `${Object.keys(teams).filter((x) => x !== selected[1])[(round * 3) % 10]} 的工程师被拍到在维修区反复检查新规格部件。`,
      meta: "未经车队官方证实",
    },
    {
      type: "TEAM RADIO",
      title: tm ? `${selected[0]} / ${tm[0]}` : "车队内部",
      text: tm
        ? state.teamRelation < 38
          ? "车库气氛明显偏冷，公关部门已经开始避免让两位车手回答同一道问题。"
          : state.teamRelation > 72
            ? "两边工程组本周共享数据相当顺利——至少目前没人抢会议室白板。"
            : "双方目前保持职业合作，但下一次资源分配仍可能改变气氛。"
        : "车队本周没有明显内部风波。",
      meta: relationStatusV10(),
    },
    {
      type: "WEATHER-ish",
      title: "工程师的非天气预报",
      text: `${track} 周末真正麻烦的可能不是“会不会下雨”，而是赛道温度、风向和抓地力变化出现在哪一节。`,
      meta: "工程组拒绝为此背锅",
    },
  ];
  if (state.contract?.pending)
    cards.push({
      type: "MARKET",
      title: "车手市场",
      text: `${state.contract.pending.team} 与 ${selected[0]} 的谈判仍在等待下个月回复。现在任何一句采访都可能被解读成暗示。`,
      meta: "CONTRACT WATCH",
    });
  if (state.history?.length) {
    const h = state.history[state.history.length - 1];
    cards.push({
      type: "LAST RACE",
      title: h.race,
      text: `上站从 P${h.grid} 发车，${h.dnf ? "最终退赛" : `P${h.finish} 完赛并拿到 ${h.points} 分`}。围场已经开始拿这场表现和下一份合同联系起来。`,
      meta: "FORM GUIDE",
    });
  }
  return cards;
}
function renderPaddockWireV12() {
  const lead = document.getElementById("paddockLeadTitle");
  if (!lead || !selected) return;
  const cards = generateNewsFeedV12();
  const main = cards[0];
  lead.textContent = main.title;
  document.getElementById("paddockLeadText").textContent = main.text;
  document.getElementById("paddockLeadMeta").textContent = main.meta;
  document.getElementById("paddockRail").innerHTML = cards
    .slice(1)
    .map(
      (c) =>
        `<div class="paddockCard"><div class="type">${c.type}</div><b>${c.title}</b><p>${c.text}</p><small>${c.meta}</small></div>`,
    )
    .join("");
  const ticker = document.getElementById("paddockTickerTrack");
  if (ticker) {
    const loop = cards.concat(cards);
    ticker.innerHTML = loop
      .map(
        (c, i) =>
          `<span><b>${i % 3 === 0 ? "LIVE" : c.type}</b>${c.title}：${c.text}</span>`,
      )
      .join("");
  }
}

// Driver profile no longer owns Paddock Wire.
openCareerDriverDetail = function () {
  if (!selected) return;
  ensureStateV11();
  const d = selected,
    p = driverProfiles[d[0]],
    attrs = [
      ["OVR", d[2]],
      ["EXP", d[3]],
      ["RAC", d[4]],
      ["AWA", d[5]],
      ["PAC", d[6]],
    ];
  const hist = state.history.length
    ? state.history
        .slice(-5)
        .reverse()
        .map(
          (h) =>
            `<div class="historyline"><b>${h.race}</b> · P${h.grid} → ${h.dnf ? "DNF" : "P" + h.finish} · ${h.points}分</div>`,
        )
        .join("")
    : '<div class="historyline">本赛季尚未完成比赛。</div>';
  document.getElementById("modalTitle").textContent =
    `DRIVER PROFILE · ${seasonYearV11()}`;
  document.getElementById("modalBody").innerHTML =
    `<div class="driverdetail"><div class="driverdetailtop"><div><div class="kicker">${p.nation} · ${d[1]}</div><div class="driverdetailname">${d[0]} <span class="seasonBadge">${seasonYearV11()}</span></div><span class="driverbadge">#${p.number}</span><span class="driverbadge">F1 DEBUT ${p.debut}</span></div><div class="drivernumber">#${p.number}</div></div><div class="detailgrid"><div><h3 class="sectiontitle">当前能力</h3><div class="detailstats">${attrs.map((a) => `<div class="detailstat"><span>${a[0]}</span><b>${a[1]}</b></div>`).join("")}</div><h3 class="sectiontitle" style="margin-top:15px">进入 2026 前的现实履历</h3><div class="historyline"><b>2025：</b>${p.season2025}</div><div class="historyline"><b>代表成绩：</b>${p.best}</div></div><div><h3 class="sectiontitle">F1 生涯成绩</h3><div class="historygrid"><div class="historybox"><span>世界冠军</span><b>${p.titles}</b></div><div class="historybox"><span>胜利</span><b>${p.wins}</b></div><div class="historybox"><span>领奖台</span><b>${p.podiums}</b></div><div class="historybox"><span>杆位</span><b>${p.poles}</b></div></div><h3 class="sectiontitle" style="margin-top:15px">本存档最近成绩</h3>${hist}</div></div></div>`;
  document.getElementById("overlay").classList.add("open");
};

function teamEventReadyV12() {
  ensureStateV11();
  ensureTeamWeekEventV10();
  return !!state.teamWeekEvent?.resolved;
}
function showRaceGateV12() {
  renderMedia();
  showView("media");
  setTimeout(() => alert("比赛周末尚未开放：请先完成本周的队内关系事件。"), 50);
}

// Dashboard enrich + mandatory weekly event gate.
const renderHubV11Base = renderHub;
renderHub = function () {
  renderHubV11Base();
  ensureTeamWeekEventV10();
  renderPaddockWireV12();
  const ready = !!state.teamWeekEvent?.resolved,
    card = document.getElementById("raceModuleCard"),
    desc = document.getElementById("raceGateDesc"),
    btn = document.getElementById("quickSimBtn");
  if (card) {
    card.classList.toggle("locked", !ready);
    card.classList.toggle("ready", ready);
  }
  if (desc)
    desc.textContent = ready
      ? currentRace()?.[4]
        ? "队内事件已处理 · 本轮为冲刺周末，进入 Sprint → 排位 → 正赛。"
        : "队内事件已处理，可以进入完整比赛周末。"
      : "先完成本周队内事件，比赛日与一键模拟才会解锁。";
  if (btn) {
    btn.disabled = !ready;
    btn.textContent = ready ? "一键模拟本轮" : "需先处理事件";
  }
};

// No simulator training in v12: remove all player/AI preparation bonuses from session score.
prepBonusForDriverV10 = function () {
  return 0;
};
ensureAITrainingV10 = function () {
  state.aiPrep = {};
  state.aiPrepRound = state.round;
  drivers.forEach((d) => {
    if (!selected || d[0] !== selected[0])
      state.aiPrep[d[0]] = { qual: 0, race: 0, control: 0 };
  });
};

function attrRankV12(attr) {
  const sorted = Object.keys(teams).sort(
    (a, b) => (teams[b].parts[attr] || 0) - (teams[a].parts[attr] || 0),
  );
  return sorted.indexOf(selected[1]) + 1;
}
function attrRankHTMLV12(phase) {
  const demand = currentDemandV10(phase),
    mx = [...demand].sort((a, b) => b - a)[1] ?? 0;
  return `<div class="attrRankGrid">${CAR_ATTRS_V10.map((a, i) => {
    const v = teams[selected[1]].parts[a],
      rank = attrRankV12(a),
      focus = demand[i] >= mx;
    return `<div class="attrRankItem ${focus ? "focus" : ""}"><span>${a}</span><b>${v}<em>P${rank} / ${Object.keys(teams).length}</em></b><small>${focus ? "本场重点属性" : "本场次级影响"}</small></div>`;
  }).join("")}</div>`;
}

// Sprint weekend state support.
const resetWeekendV11Base = resetWeekend;
resetWeekend = function () {
  resetWeekendV11Base();
  Object.assign(state.weekend, {
    sprintStrategy: null,
    sprintResult: null,
    sprintField: null,
    sprintPointsApplied: false,
  });
};
function ensureSprintStateV12() {
  if (!state.weekend) resetWeekend();
  if (state.weekend.sprintStrategy === undefined)
    state.weekend.sprintStrategy = null;
  if (state.weekend.sprintResult === undefined)
    state.weekend.sprintResult = null;
  if (state.weekend.sprintPointsApplied === undefined)
    state.weekend.sprintPointsApplied = false;
}
function sprintStrategyDefsV12() {
  return strategyDefs.race;
}
function renderSprintStrategiesV12() {
  const box = document.getElementById("sprintStrategies");
  box.innerHTML = Object.entries(sprintStrategyDefsV12())
    .map(
      ([k, v]) =>
        `<div class="strategychoice ${state.weekend.sprintStrategy === k ? "selected" : ""}" onclick="selectSprintStrategyV12('${k}')"><b>${v.name}</b><small>${k === "aggressive" ? "短距离里尽早抢位置，碰撞与退赛风险也更高。" : k === "conservative" ? "优先把车带回终点，但可能错过只有几圈的进攻窗口。" : "围绕基准节奏比赛，根据前车和轮胎状态决定攻守。"}</small><span class="risk">${k === "aggressive" ? "高波动" : k === "normal" ? "平衡" : "低风险"}</span><span class="approach">点击选择</span></div>`,
    )
    .join("");
}
function selectSprintStrategyV12(k) {
  ensureSprintStateV12();
  if (state.weekend.sprintResult) return;
  state.weekend.sprintStrategy = k;
  renderSprintV12();
}
function renderSprintV12() {
  ensureStateV11();
  ensureSprintStateV12();
  const r = currentRace(),
    fr = expectedRangeV10("race"),
    cr = carRankAtTrackV10(selected[1], "race"),
    needs = topNeedsV10("race");
  document.getElementById("sprintBreadcrumb").textContent =
    `ROUND ${String(state.round).padStart(2, "0")} · ${r[2]}`;
  document.getElementById("sprintRaceName").textContent = r[1];
  document.getElementById("sprintRaceMeta").textContent =
    `${r[2]} · ${r[3]} · SPRINT WEEKEND`;
  document.getElementById("sprintCarContext").textContent = `赛道适配第 ${cr}`;
  document.getElementById("sprintTrackContext").textContent = needs.join(" / ");
  document.getElementById("sprintTarget").textContent =
    `预计 P${fr[0]}–P${Math.min(drivers.length, fr[1] + 1)}`;
  document.getElementById("sprintBrief").textContent =
    `冲刺赛距离短，策略纠错空间比周日更小。${needs.join("、")} 会主导基础速度，而第一圈攻防、可靠性与驾驶倾向更容易直接改变积分。`;
  document.getElementById("sprintAttrRanks").innerHTML =
    attrRankHTMLV12("race");
  renderSprintStrategiesV12();
  document.getElementById("sprintStart").disabled =
    !state.weekend.sprintStrategy || !!state.weekend.sprintResult;
  const after = document.getElementById("sprintAfter");
  if (state.weekend.sprintResult) {
    const m = state.weekend.sprintResult;
    after.style.display = "block";
    after.innerHTML = `<div class="sprintResultMini"><h3>SPRINT RESULT · ${m.dnf ? "DNF" : "P" + m.position}</h3><div class="sprintPts">+${m.points || 0} 分</div><div class="small">冲刺积分已经计入车手与车队积分榜。大奖赛发车位仍由随后进行的正式排位决定。</div><button class="btn primary" style="margin-top:10px" onclick="continueFromSprintV12()">进入大奖赛排位 →</button></div>`;
  } else after.style.display = "none";
}
function simulateSprintFieldV12(noPlayerChoice = false) {
  const pts = [8, 7, 6, 5, 4, 3, 2, 1];
  let field = drivers
    .map((d) => {
      const mine = d[0] === selected[0],
        strat = mine
          ? state.weekend.sprintStrategy || "normal"
          : aiStrategyV10(),
        eq = 50 + Math.random() * 38,
        luck = Math.random() * 100,
        sc = computeScore(d, "race", eq, luck, true);
      return {
        name: d[0],
        team: d[1],
        total: sc.total,
        mine,
        strategy: strat,
        dnf: false,
      };
    })
    .sort((a, b) => b.total - a.total);
  field.forEach((x) => {
    const d = drivers.find((v) => v[0] === x.name),
      base = retirementChanceV10(d, x.strategy, 0) * 0.52;
    if (Math.random() < base) {
      x.dnf = true;
      x.total -= 100;
    }
  });
  field.sort((a, b) => {
    if (a.dnf !== b.dnf) return a.dnf ? 1 : -1;
    return b.total - a.total;
  });
  if (!noPlayerChoice && state.weekend.sprintStrategy)
    applyStrategyShiftV10(
      field,
      selected[0],
      "race",
      state.weekend.sprintStrategy,
    );
  let fin = 0;
  field.forEach((x) => {
    if (!x.dnf) {
      fin++;
      x.position = fin;
      x.points = pts[fin - 1] || 0;
    } else {
      x.position = 99;
      x.points = 0;
    }
  });
  field.filter((x) => x.dnf).forEach((x, i) => (x.position = fin + i + 1));
  return field;
}
function applySprintPointsV12(field) {
  if (state.weekend.sprintPointsApplied) return;
  field.forEach((x) => {
    state.driverStandings[x.name] =
      (state.driverStandings[x.name] || 0) + (x.points || 0);
    state.teamStandings[x.team] =
      (state.teamStandings[x.team] || 0) + (x.points || 0);
  });
  state.weekend.sprintPointsApplied = true;
  state.driverPoints = state.driverStandings[selected[0]] || 0;
  state.teamPoints = state.teamStandings[selected[1]] || 0;
}
function startSprintV12() {
  ensureSprintStateV12();
  if (!state.weekend.sprintStrategy || state.weekend.sprintResult) return;
  const field = simulateSprintFieldV12(false);
  state.weekend.sprintField = field;
  state.weekend.sprintResult = {
    ...field.find((x) => x.mine),
    field: field.map((x) => ({ ...x })),
  };
  applySprintPointsV12(field);
  autosave();
  renderSprintV12();
  renderHub();
}
function continueFromSprintV12() {
  renderQualifying();
  raceTransition(
    "GRAND PRIX QUALIFYING",
    currentRace()[1],
    "SATURDAY · QUALIFYING",
    "qualifying",
  );
}

// Race entry: weekly event -> Sprint (if applicable) -> Qualifying -> Grand Prix.
const openRaceWeekendV11Base = openRaceWeekend;
openRaceWeekend = function () {
  if (!selected) return;
  if (!teamEventReadyV12()) {
    showRaceGateV12();
    return;
  }
  ensureSprintStateV12();
  const r = currentRace();
  if (r?.[4] && !state.weekend.sprintResult) {
    renderSprintV12();
    raceTransition("SPRINT WEEKEND", r[1], "SATURDAY · F1 SPRINT", "sprint");
    return;
  }
  openRaceWeekendV11Base();
};
const quickSimV11Base = quickSimCurrentRound;
quickSimCurrentRound = function () {
  if (!teamEventReadyV12()) {
    showRaceGateV12();
    return;
  }
  ensureSprintStateV12();
  if (currentRace()?.[4] && !state.weekend.sprintResult) {
    state.weekend.sprintStrategy = "normal";
    const sf = simulateSprintFieldV12(true);
    state.weekend.sprintField = sf;
    state.weekend.sprintResult = {
      ...sf.find((x) => x.mine),
      field: sf.map((x) => ({ ...x })),
    };
    applySprintPointsV12(sf);
  }
  quickSimV11Base();
};

// Qualifying / GP prediction now exposes the player's six car attribute ranks, not training values.
renderQualifying = function () {
  ensureStateV11();
  ensureSprintStateV12();
  const r = currentRace(),
    fr = expectedRangeV10("qual"),
    cr = carRankAtTrackV10(selected[1], "qual"),
    needs = topNeedsV10("qual");
  document.getElementById("qualBreadcrumb").textContent =
    `ROUND ${String(state.round).padStart(2, "0")} · ${r[2]}`;
  document.getElementById("qualRaceName").textContent = r[1];
  document.getElementById("qualRaceMeta").textContent =
    `${r[2]} · ${r[3]}${r[4] ? " · Sprint Weekend" : ""}`;
  document.getElementById("qualCarContext").textContent = `赛道适配第 ${cr}`;
  document.getElementById("qualTrackContext").textContent = needs.join(" / ");
  document.getElementById("qualTarget").textContent =
    `预计 P${fr[0]}–P${fr[1]}`;
  document.getElementById("qualBrief").textContent =
    `当前赛车在 ${r[2]} 的排位重点是 ${needs.join(" 与 ")}。下面的六项排名显示你的赛车每个能力在 11 支车队中的位置；比赛结果不会只按其中单项直接排序。`;
  renderStrategies("qual");
  const sprintNote =
    r[4] && state.weekend.sprintResult
      ? `<div class="eventGateNotice">冲刺赛：${state.weekend.sprintResult.dnf ? "DNF" : "P" + state.weekend.sprintResult.position} · +${state.weekend.sprintResult.points || 0} 分。大奖赛排位重新独立计算发车位。</div>`
      : "";
  document.getElementById("qualWeekendInfo").innerHTML =
    `<b>排位赛前预测：P${fr[0]}–P${fr[1]}</b><br>赛车赛道适配：全场第 ${cr}<br><br>${attrRankHTMLV12("qual")}${sprintNote}`;
  document.getElementById("qualHistory").innerHTML = state.history.length
    ? state.history
        .slice(-3)
        .reverse()
        .map(
          (h) =>
            `<div>R${String(h.round).padStart(2, "0")} ${h.race} · 发车 P${h.grid} → ${h.dnf ? "DNF" : "完赛 P" + h.finish}</div>`,
        )
        .join("")
    : "<div>这是本赛季第一个比赛周末。</div>";
  document.getElementById("qualStart").disabled = !state.weekend.qualStrategy;
};
renderGrandPrix = function () {
  ensureStateV11();
  const r = currentRace(),
    q = state.weekend.qualResult;
  if (!q) {
    renderQualifying();
    showView("qualifying");
    return;
  }
  const tp = getTrackProfile(),
    fr = expectedRangeV10("race"),
    cr = carRankAtTrackV10(selected[1], "race"),
    needs = topNeedsV10("race");
  document.getElementById("raceBreadcrumb").textContent =
    `ROUND ${String(state.round).padStart(2, "0")} · ${r[2]}`;
  document.getElementById("gpRaceName").textContent = r[1];
  document.getElementById("gpRaceMeta").textContent =
    `${r[2]} · ${r[3]}${r[4] ? " · Sprint Weekend" : ""}`;
  document.getElementById("gpGrid").textContent = `P${q.position}`;
  document.getElementById("gpWindow").textContent = tp?.window || "策略开放";
  document.getElementById("gpFocus").textContent =
    `${needs.join(" / ")} · 预计P${fr[0]}–P${fr[1]}`;
  document.getElementById("gpBrief").innerHTML =
    `正赛重新按 ${r[2]} 的长距离需求评估赛车。当前适配约全场第 ${cr}；发车位置、可靠性、轮胎策略、进站成本与 Race Control 会继续改变结果。<div style="margin-top:12px">${attrRankHTMLV12("race")}</div>`;
  renderStrategies("race");
  document.getElementById("qualGridPreview").innerHTML = renderClassification(
    q.field,
    10,
  );
  document.getElementById("raceStart").disabled = !state.weekend.raceStrategy;
};

// Weekly event completion instantly refreshes the race gate.
const resolveTeamWeekEventV11Base = resolveTeamWeekEventV10;
resolveTeamWeekEventV10 = function (i) {
  resolveTeamWeekEventV11Base(i);
  renderHub();
};

// Refresh hub news after each round / load.
const advanceRoundV11Base = advanceRound;
advanceRound = function () {
  advanceRoundV11Base();
  if (document.getElementById("career")?.classList.contains("active"))
    renderHub();
};

// Initial dashboard refresh when restoring saves that predate v12 sprint fields.
setTimeout(() => {
  if (selected) {
    ensureSprintStateV12();
  }
}, 0);

/* v13-script */

const V13_TRUST_EVENTS = [
  {
    type: "trust",
    title: "工程会议要求你确认下一阶段研发方向",
    body: "管理层希望把有限的风洞与设计资源集中到一个方向。你的反馈会被直接写进下一轮升级优先级。",
    choices: [
      {
        label: "支持团队当前方案",
        desc: "接受工程组的判断，优先保持内部一致。",
        delta: 7,
        race: -0.35,
        long: 0.12,
        benefit: "车队信任 +7",
        cost: "下站个人资源 -0.35",
      },
      {
        label: "提出折中方案并补充数据",
        desc: "不完全退让，也不把技术讨论变成立场对抗。",
        delta: 3,
        race: 0.25,
        long: 0.06,
        benefit: "车队信任 +3",
        cost: "下站修正 +0.25",
      },
      {
        label: "坚持以自己的反馈为研发基准",
        desc: "争取更直接的话语权，但会让工程组承担额外协调成本。",
        delta: -6,
        race: 1.05,
        long: -0.14,
        benefit: "下站资源 +1.05",
        cost: "车队信任 -6",
      },
    ],
  },
  {
    type: "trust",
    title: "赞助商临时追加一场周四活动",
    body: "活动会挤占赛前准备时间，但车队商业部门认为这次曝光非常重要。",
    choices: [
      {
        label: "完整出席并配合所有环节",
        desc: "把商业义务放在个人准备之前。",
        delta: 8,
        race: -0.55,
        long: 0.14,
        benefit: "车队信任 +8",
        cost: "下站准备 -0.55",
      },
      {
        label: "只参加核心拍摄",
        desc: "控制时间，同时给商业部门一个可交付结果。",
        delta: 3,
        race: 0.15,
        long: 0.05,
        benefit: "车队信任 +3",
        cost: "下站修正 +0.15",
      },
      {
        label: "以比赛准备为由拒绝",
        desc: "保住所有准备时间，但管理层会记住这次拒绝。",
        delta: -7,
        race: 0.9,
        long: -0.16,
        benefit: "下站准备 +0.90",
        cost: "车队信任 -7",
      },
    ],
  },
  {
    type: "trust",
    title: "策略组希望你接受更保守的周末目标",
    body: "模型认为当前赛车不值得在这一站过度冒险，车队更重视稳定拿分与数据回收。",
    choices: [
      {
        label: "接受车队目标",
        desc: "把赛季整体放在单场冒险之前。",
        delta: 6,
        race: -0.25,
        long: 0.1,
        benefit: "车队信任 +6",
        cost: "下站上限 -0.25",
      },
      {
        label: "要求保留临场进攻权限",
        desc: "总体服从，但保留比赛中的判断空间。",
        delta: 2,
        race: 0.35,
        long: 0.04,
        benefit: "车队信任 +2",
        cost: "下站修正 +0.35",
      },
      {
        label: "明确要求以领奖台为目标",
        desc: "提高资源集中度，也增加管理层对执行失败的容忍成本。",
        delta: -5,
        race: 1.1,
        long: -0.12,
        benefit: "下站资源 +1.10",
        cost: "车队信任 -5",
      },
    ],
  },
  {
    type: "trust",
    title: "车队要求公开部分赛后遥测解释失利",
    body: "公关部门希望用更透明的技术说明压住外界质疑，但这会暴露你与工程组之间的部分工作细节。",
    choices: [
      {
        label: "配合车队统一口径",
        desc: "由车队决定公开边界，你只补充驾驶感受。",
        delta: 6,
        race: -0.2,
        long: 0.11,
        benefit: "车队信任 +6",
        cost: "下站修正 -0.20",
      },
      {
        label: "只谈驾驶，不谈内部流程",
        desc: "保持职业边界，避免公开讨论责任归属。",
        delta: 2,
        race: 0.2,
        long: 0.03,
        benefit: "车队信任 +2",
        cost: "下站修正 +0.20",
      },
      {
        label: "公开强调策略与赛车问题",
        desc: "迅速保护个人评价，但会让车队内部承压。",
        delta: -8,
        race: 0.8,
        long: -0.18,
        benefit: "下站个人气势 +0.80",
        cost: "车队信任 -8",
      },
    ],
  },
  {
    type: "trust",
    title: "新零件测试需要你牺牲一部分常规练习程序",
    body: "工程部门希望你承担验证任务，数据价值很高，但这一站的个人调校时间会被压缩。",
    choices: [
      {
        label: "完整执行测试计划",
        desc: "为后续升级提供最干净的数据。",
        delta: 8,
        race: -0.65,
        long: 0.16,
        benefit: "车队信任 +8",
        cost: "下站准备 -0.65",
      },
      {
        label: "只做关键测试项目",
        desc: "保留一部分常规准备时间。",
        delta: 3,
        race: 0.1,
        long: 0.06,
        benefit: "车队信任 +3",
        cost: "下站修正 +0.10",
      },
      {
        label: "要求队友承担主要测试",
        desc: "你获得完整比赛准备，但工程组会认为合作意愿下降。",
        delta: -6,
        race: 0.95,
        long: -0.13,
        benefit: "下站准备 +0.95",
        cost: "车队信任 -6",
      },
    ],
  },
  {
    type: "trust",
    title: "领队希望提前确认赛季后半段的资源优先级",
    body: "如果争冠形势不明朗，车队必须决定继续追今年还是开始为下一年保留资源。",
    choices: [
      {
        label: "接受车队按积分形势动态决定",
        desc: "把决定权交给管理层与技术部门。",
        delta: 7,
        race: -0.15,
        long: 0.12,
        benefit: "车队信任 +7",
        cost: "下站修正 -0.15",
      },
      {
        label: "要求保留自己的关键升级",
        desc: "接受大方向，但争取个人最低资源保障。",
        delta: 2,
        race: 0.45,
        long: 0.04,
        benefit: "车队信任 +2",
        cost: "下站资源 +0.45",
      },
      {
        label: "要求继续全力投入本赛季",
        desc: "短期竞争力更高，但可能与车队长期计划冲突。",
        delta: -5,
        race: 1.15,
        long: -0.15,
        benefit: "下站资源 +1.15",
        cost: "车队信任 -5",
      },
    ],
  },
];

const V13_DRIVER_EVENTS = [
  {
    type: "driver",
    title: "关键升级目前只有一套",
    body: "两台赛车都能用上这套升级，但本周只有一套成品。谁先拿到它，会直接改变下一站的性能上限。",
    choices: [
      {
        label: "主动让队友先用",
        desc: "牺牲本周性能，换取更强的内部合作。",
        delta: 8,
        race: -0.8,
        long: 0.12,
        benefit: "车手关系 +8",
        cost: "下站资源 -0.80",
      },
      {
        label: "按积分排名决定",
        desc: "用客观规则分配，但双方都知道规则本身也是一种立场。",
        delta: 2,
        race: 0.25,
        long: 0.04,
        benefit: "车手关系 +2",
        cost: "下站修正 +0.25",
      },
      {
        label: "坚持自己先用",
        desc: "确保个人竞争力，直接提高队内紧张度。",
        delta: -7,
        race: 1.0,
        long: -0.12,
        benefit: "下站资源 +1.00",
        cost: "车手关系 -7",
      },
    ],
  },
  {
    type: "driver",
    title: "策略组要提前确定首轮进站优先权",
    body: "两台车预计会在同一集团，undercut 窗口可能只有一圈。",
    choices: [
      {
        label: "接受赛道位置优先",
        desc: "谁在前谁先停，规则最容易执行。",
        delta: 6,
        race: -0.15,
        long: 0.09,
        benefit: "车手关系 +6",
        cost: "下站修正 -0.15",
      },
      {
        label: "要求按积分排名优先",
        desc: "把赛季地位带入单场策略。",
        delta: -1,
        race: 0.45,
        long: -0.03,
        benefit: "下站策略 +0.45",
        cost: "车手关系 -1",
      },
      {
        label: "要求自己拥有第一策略权",
        desc: "直接争夺核心车手待遇。",
        delta: -8,
        race: 1.15,
        long: -0.15,
        benefit: "下站策略 +1.15",
        cost: "车手关系 -8",
      },
    ],
  },
  {
    type: "driver",
    title: "赛后数据复盘开始比较两台车的反馈",
    body: "工程师把你和队友的长距离曲线放在同一张图上，研发基准究竟听谁的开始变得敏感。",
    choices: [
      {
        label: "共享全部数据与设置",
        desc: "最大化团队协作，减少彼此猜疑。",
        delta: 7,
        race: -0.35,
        long: 0.11,
        benefit: "车手关系 +7",
        cost: "下站个人优势 -0.35",
      },
      {
        label: "只讨论技术，不评价车手",
        desc: "保持边界，避免复盘变成输赢比较。",
        delta: 2,
        race: 0.2,
        long: 0.03,
        benefit: "车手关系 +2",
        cost: "下站修正 +0.20",
      },
      {
        label: "强调自己的反馈更有代表性",
        desc: "争取更多技术话语权，也会刺激队友一侧。",
        delta: -6,
        race: 0.85,
        long: -0.11,
        benefit: "下站资源 +0.85",
        cost: "车手关系 -6",
      },
    ],
  },
  {
    type: "driver",
    title: "媒体再次追问“谁才是一号车手”",
    body: "你和队友的积分差距很小，发布会上的一句话可能会被双方工程组反复引用。",
    choices: [
      {
        label: "强调车队目标高于个人",
        desc: "公开降温，把竞争留在赛道上。",
        delta: 6,
        race: -0.2,
        long: 0.1,
        benefit: "车手关系 +6",
        cost: "下站个人声势 -0.20",
      },
      {
        label: "回答“赛道上自然会证明”",
        desc: "保留竞争姿态，但不直接要求车队站队。",
        delta: -1,
        race: 0.35,
        long: -0.02,
        benefit: "下站气势 +0.35",
        cost: "车手关系 -1",
      },
      {
        label: "明确表示自己应该得到优先支持",
        desc: "争取核心待遇，同时把矛盾公开化。",
        delta: -9,
        race: 1.05,
        long: -0.16,
        benefit: "下站资源 +1.05",
        cost: "车手关系 -9",
      },
    ],
  },
  {
    type: "driver",
    title: "两台车都想要同一个赛道工程时段",
    body: "虽然没有模拟器训练模块，但工程团队的赛道准备会议和数据窗口仍然有限。",
    choices: [
      {
        label: "拆分时段并共享结论",
        desc: "双方都少一点独占时间，但合作最稳定。",
        delta: 7,
        race: -0.4,
        long: 0.11,
        benefit: "车手关系 +7",
        cost: "下站准备 -0.40",
      },
      {
        label: "按最近三站成绩分配",
        desc: "让数据决定资源，但结果必然有人不满意。",
        delta: -1,
        race: 0.4,
        long: -0.02,
        benefit: "下站资源 +0.40",
        cost: "车手关系 -1",
      },
      {
        label: "坚持保留自己的完整时段",
        desc: "优先个人准备，让车库内部竞争进一步升温。",
        delta: -7,
        race: 0.95,
        long: -0.12,
        benefit: "下站准备 +0.95",
        cost: "车手关系 -7",
      },
    ],
  },
  {
    type: "driver",
    title: "最后一圈最快圈机会落在两台车之间",
    body: "车队不希望为了一个最快圈让两台车同时承担额外风险，但谁去尝试会影响内部气氛。",
    choices: [
      {
        label: "把机会让给更有轮胎余量的人",
        desc: "按客观条件处理，不强调个人优先。",
        delta: 6,
        race: -0.1,
        long: 0.08,
        benefit: "车手关系 +6",
        cost: "下站修正 -0.10",
      },
      {
        label: "轮流获得类似机会",
        desc: "建立长期规则，本周收益不最大但更可持续。",
        delta: 3,
        race: 0.15,
        long: 0.05,
        benefit: "车手关系 +3",
        cost: "下站修正 +0.15",
      },
      {
        label: "要求本次机会属于自己",
        desc: "保住个人数据目标，也会让下一次让车更困难。",
        delta: -6,
        race: 0.75,
        long: -0.1,
        benefit: "下站气势 +0.75",
        cost: "车手关系 -6",
      },
    ],
  },
];

function clampV13(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function signedV13(v, d = 1) {
  const n = Number(v || 0);
  return `${n > 0 ? "+" : n < 0 ? "−" : "±"}${Math.abs(n).toFixed(d)}`;
}
function teamTrustStatusV13(v = state.teamTrust) {
  return v >= 78
    ? "非常信任"
    : v >= 58
      ? "信任"
      : v >= 38
        ? "稍有怀疑"
        : "怀疑";
}
function ensureStateV13() {
  ensureStateV11();
  if (state.teamTrust == null) {
    const rel = state.relations || {};
    state.teamTrust = clampV13(
      Math.round(((rel.principal ?? 65) + (rel.engineer ?? 70)) / 2),
      30,
      88,
    );
  }
  if (state.teamAffairsWeek === undefined) state.teamAffairsWeek = null;
  if (state.affairsNextRaceModifier == null) state.affairsNextRaceModifier = 0;
  if (state.affairsLongTermModifier == null) state.affairsLongTermModifier = 0;
  if (state.seasonDividend === undefined) state.seasonDividend = null;
  if (state.lastSeasonDividend === undefined) state.lastSeasonDividend = null;
}
function shuffledV13(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function affairCountV13() {
  const r = Math.random();
  return r < 0.22 ? 0 : r < 0.66 ? 1 : r < 0.9 ? 2 : 3;
}
function ensureTeamAffairsWeekV13() {
  ensureStateV13();
  if (state.teamAffairsWeek && state.teamAffairsWeek.round === state.round)
    return;
  const count = affairCountV13(),
    pool = shuffledV13([...V13_TRUST_EVENTS, ...V13_DRIVER_EVENTS]);
  state.teamAffairsWeek = {
    round: state.round,
    events: pool.slice(0, count).map((e, i) => ({
      ...JSON.parse(JSON.stringify(e)),
      id: `R${state.round}-${i}`,
      resolved: false,
      outcome: null,
    })),
  };
  state.affairsNextRaceModifier = 0;
}
function resolveTeamAffairV13(eventIndex, choiceIndex) {
  ensureTeamAffairsWeekV13();
  const e = state.teamAffairsWeek.events[eventIndex];
  if (!e || e.resolved) return;
  const c = e.choices[choiceIndex];
  if (!c) return;
  if (e.type === "trust")
    state.teamTrust = clampV13(state.teamTrust + c.delta, 0, 100);
  else state.teamRelation = clampV13(state.teamRelation + c.delta, 0, 100);
  state.affairsNextRaceModifier = clampV13(
    (state.affairsNextRaceModifier || 0) + c.race,
    -3.5,
    3.5,
  );
  state.affairsLongTermModifier = clampV13(
    (state.affairsLongTermModifier || 0) + c.long,
    -1.8,
    1.8,
  );
  e.resolved = true;
  const status =
    e.type === "trust" ? teamTrustStatusV13() : relationStatusV10();
  e.outcome = `已选择「${c.label}」。${e.type === "trust" ? "车队信任" : "车手关系"} ${c.delta > 0 ? "+" : ""}${c.delta}，当前为「${status}」；下一场 ${signedV13(c.race, 2)}，长期 ${signedV13(c.long, 2)}。`;
  renderMedia();
  renderHub();
  autosave();
}
function renderAffairEventV13(e, i) {
  const typeLabel = e.type === "trust" ? "车队信任" : "车手关系";
  if (e.resolved)
    return `<div class="affairEvent resolved"><div class="affairEventHead"><div><span class="affairType ${e.type}">${typeLabel}</span><h3>${e.title}</h3></div><span class="small">已处理</span></div><p>${e.body}</p><div class="affairOutcome">${e.outcome}</div></div>`;
  return `<div class="affairEvent"><div class="affairEventHead"><div><span class="affairType ${e.type}">${typeLabel}</span><h3>${e.title}</h3></div><span class="small">可选</span></div><p>${e.body}</p><div class="affairChoices">${e.choices.map((c, j) => `<div class="affairChoice" onclick="resolveTeamAffairV13(${i},${j})"><b>${c.label}</b><span>${c.desc}</span><div class="affairEffects"><small>${e.type === "trust" ? "信任" : "关系"} ${c.delta > 0 ? "+" : ""}${c.delta}</small><small>下站 ${signedV13(c.race, 2)}</small><small>长期 ${signedV13(c.long, 2)}</small><small>${c.race > 0 ? "短期偏进取" : "短期偏合作"}</small></div></div>`).join("")}</div></div>`;
}

// Compatibility: the old single mandatory event is now always considered cleared.
ensureTeamWeekEventV10 = function () {
  ensureTeamAffairsWeekV13();
  state.teamWeekEvent = {
    round: state.round,
    resolved: true,
    event: { title: "车队事务", body: "", choices: [] },
    outcome: null,
  };
};
teamEventReadyV12 = function () {
  return true;
};

renderMedia = function () {
  ensureStateV13();
  ensureTeamAffairsWeekV13();
  const tm = teammateV10(),
    v = state.teamRelation,
    t = state.teamTrust,
    events = state.teamAffairsWeek.events || [];
  document.getElementById("teamTrustStatus").textContent =
    teamTrustStatusV13(t);
  document.getElementById("teamTrustValue").textContent =
    `管理层与工程组 · ${Math.round(t)}/100`;
  document.getElementById("teamTrustBar").style.width = t + "%";
  document.getElementById("teamRelationStatus").textContent =
    relationStatusV10(v);
  document.getElementById("teamRelationPair").textContent =
    `${selected[0]} ↔ ${tm?.[0] || "队友"} · ${Math.round(v)}/100`;
  document.getElementById("teamRelationBar").style.width = v + "%";
  document.getElementById("rivalStats").innerHTML =
    `<div><span>你领先队友</span><b>${state.rivalry.playerAhead}</b></div><div><span>队友领先你</span><b>${state.rivalry.teammateAhead}</b></div><div><span>让车 / 冲突</span><b>${state.rivalry.orders} / ${state.rivalry.clashes}</b></div>`;
  const unresolved = events.filter((e) => !e.resolved).length;
  document.getElementById("affairsWeekMeta").textContent =
    `R${String(state.round).padStart(2, "0")} · 本周刷新 ${events.length} 项 · ${unresolved} 项未处理 · 不影响进入比赛日`;
  document.getElementById("teamAffairsEvents").innerHTML = events.length
    ? events.map(renderAffairEventV13).join("")
    : `<div class="affairEmpty"><b>本周没有新的车队事务。</b><br>车库相对平静，你可以直接进入比赛周末；下一轮仍会重新随机刷新。</div>`;
  document.getElementById("affairsNextRace").textContent = signedV13(
    state.affairsNextRaceModifier,
    2,
  );
  document.getElementById("affairsLongTerm").textContent = signedV13(
    state.affairsLongTermModifier,
    2,
  );
};

// Team-affair effects are real simulation modifiers: one expires after this race, one persists.

// Dashboard no longer gates race entry behind optional events.
const renderHubV13Base = renderHub;
renderHub = function () {
  renderHubV13Base();
  ensureStateV13();
  ensureTeamAffairsWeekV13();
  const card = document.getElementById("raceModuleCard"),
    desc = document.getElementById("raceGateDesc"),
    btn = document.getElementById("quickSimBtn"),
    mood = document.getElementById("teamMood");
  if (card) {
    card.classList.remove("locked");
    card.classList.add("ready");
  }
  if (desc)
    desc.textContent = currentRace()?.[4]
      ? "车队事务为可选；本轮是冲刺周末，可直接进入 Sprint → 排位 → 正赛。"
      : "车队事务为可选；无需处理事件即可进入完整比赛周末。";
  if (btn) {
    btn.disabled = false;
    btn.textContent = "一键模拟本轮";
  }
  if (mood)
    mood.textContent = `${teamTrustStatusV13()} · ${relationStatusV10()}`;
};

// Remove the quick-sim explanation box from the race report entirely.
const renderWeekendResultV13Base = renderWeekendResult;
renderWeekendResult = function () {
  renderWeekendResultV13Base();
  const el = document.getElementById("resultDecision");
  if (el) {
    el.textContent = "";
    el.style.display = "none";
  }
};

function transferBudgetV13() {
  ensureStateV13();
  if (!nextSeasonUnlockedV11()) {
    alert("进入赛季后半段后才能为下赛季锁定预算。");
    return;
  }
  const input = document.getElementById("futureTransferAmount");
  let amount = Number(input?.value);
  if (!Number.isFinite(amount) || amount <= 0) {
    alert("请输入要转入的预算金额。");
    return;
  }
  amount = Math.round(amount * 10) / 10;
  if (amount > state.budget + 0.0001) {
    alert("转入金额不能超过当前可用预算。");
    return;
  }
  state.budget = Math.max(0, Math.round((state.budget - amount) * 10) / 10);
  state.nextSeasonFund = Math.round((state.nextSeasonFund + amount) * 10) / 10;
  renderDevelopment();
  renderHub();
  autosave();
}
// Old all-in function is retained only for save compatibility; it now follows the manual amount control.
reserveAllBudgetV11 = function () {
  transferBudgetV13();
};

const renderDevelopmentV13Base = renderDevelopment;
renderDevelopment = function () {
  renderDevelopmentV13Base();
  ensureStateV13();
  const y = seasonYearV11(),
    input = document.getElementById("futureTransferAmount"),
    btn = document.getElementById("futureTransferBtn"),
    rule = document.getElementById("futureFundRule"),
    nextBtn = document.getElementById("devModeNext");
  if (nextBtn) nextBtn.textContent = `${y + 1} 赛车`;
  if (input) {
    input.max = Math.max(0, state.budget).toFixed(1);
    if (Number(input.value) > state.budget)
      input.value = Math.max(1, Math.floor(state.budget || 1));
  }
  if (btn) btn.disabled = !nextSeasonUnlockedV11() || state.budget < 1;
  if (rule)
    rule.textContent = nextSeasonUnlockedV11()
      ? `已开放 ${y + 1} 预算储备。每次手动填写金额后转入，已锁定资金不能再用于 ${y} 研发。`
      : `R10 后开放 ${y + 1} 预算储备。不会提供“一键全部转入”，需要自行决定保留多少资金。`;
};

// AI philosophy: title contenders keep pushing the current car; backmarkers pivot earlier and harder to next year.

function ensureSeasonDividendV13() {
  ensureStateV13();
  const y = seasonYearV11();
  if (state.seasonDividend && state.seasonDividend.year === y)
    return state.seasonDividend;
  const order = Object.keys(teams).sort(
    (a, b) => (state.teamStandings[b] || 0) - (state.teamStandings[a] || 0),
  );
  const byTeam = {};
  order.forEach((name, i) => {
    const rank = i + 1;
    byTeam[name] = Number((9.0 + (12 - rank) * 0.4).toFixed(1));
  });
  state.seasonDividend = { year: y, byTeam };
  return state.seasonDividend;
}
const showSeasonFinaleV13Base = showSeasonFinaleV10;
showSeasonFinaleV10 = function () {
  ensureStateV13();
  const div = ensureSeasonDividendV13();
  showSeasonFinaleV13Base();
  const amt = div.byTeam[selected[1]] || 9;
  const target = document.getElementById("finalContract");
  if (target)
    target.innerHTML += `<div class="budgetDividend"><b>预算帽年终分红：€${amt.toFixed(1)}M</b><br>这笔资金会在进入 ${seasonYearV11() + 1} 赛季时加入车队研发预算；它与手动保留的下赛季储备分别结算。</div>`;
  autosave();
};

const startNextSeasonV13Base = startNextSeasonV11;
startNextSeasonV11 = function () {
  ensureStateV13();
  const oldYear = seasonYearV11(),
    oldTeam = selected[1],
    oldTrust = state.teamTrust,
    oldRelation = state.teamRelation,
    oldLong = state.affairsLongTermModifier,
    dividend = ensureSeasonDividendV13(),
    payouts = { ...dividend.byTeam };
  startNextSeasonV13Base();
  ensureStateV13();
  const payout = payouts[selected[1]] || 9;
  state.budget = Math.round((state.budget + payout) * 10) / 10;
  state.lastSeasonDividend = {
    year: oldYear,
    team: selected[1],
    amount: payout,
  };
  state.seasonDividend = null;
  state.teamAffairsWeek = null;
  state.affairsNextRaceModifier = 0;
  if (selected[1] === oldTeam) {
    state.teamTrust = clampV13(oldTrust + 1, 0, 100);
    state.teamRelation = clampV13(oldRelation + 2, 0, 100);
    state.affairsLongTermModifier = clampV13(oldLong * 0.65, -1.8, 1.8);
  } else {
    state.teamTrust = 64;
    state.affairsLongTermModifier = 0;
  }
  ensureTeamAffairsWeekV13();
  renderHub();
  autosave();
};

const advanceRoundV13Base = advanceRound;
advanceRound = function () {
  const before = state.round;
  advanceRoundV13Base();
  if (state.round !== before) {
    ensureStateV13();
    state.affairsNextRaceModifier = 0;
    ensureTeamAffairsWeekV13();
    renderHub();
    autosave();
  }
};

const startCareerV13Base = startCareer;
startCareer = function () {
  startCareerV13Base();
  ensureStateV13();
  state.teamTrust = 68;
  state.teamAffairsWeek = null;
  state.affairsNextRaceModifier = 0;
  state.affairsLongTermModifier = 0;
  state.seasonDividend = null;
  ensureTeamAffairsWeekV13();
  renderHub();
  autosave();
};

const restoreSnapshotV13Base = restoreSnapshot;
restoreSnapshot = function (data) {
  const ok = restoreSnapshotV13Base(data);
  if (ok) {
    ensureStateV13();
    ensureTeamAffairsWeekV13();
    renderHub();
  }
  return ok;
};

setTimeout(() => {
  if (selected) {
    ensureStateV13();
    ensureTeamAffairsWeekV13();
  }
}, 0);

/* v14-script */

const V14_DEV_IMPACTS = {
  动力单元: "直线速度与高功率区",
  空力效率: "高速弯与阻力效率",
  赛车平衡: "连续变向与前后轴稳定",
  机械抓地: "慢弯、路肩与牵引",
  轮胎管理: "暖胎、热衰减与长距离",
  "可靠性/冷却": "故障概率与高温表现",
};
const V14_GENERAL_TRUST = [
  {
    id: "eng_test",
    type: "trust",
    title: "工程组希望增加一段验证程序",
    body: "新方案的数据还不够干净。工程组希望占用一部分周末准备时间，再完成一轮验证。",
    choices: [
      {
        label: "完整配合验证",
        desc: "优先保证工程数据质量。",
        trust: 5,
        rel: 0,
        q: -0.18,
        r: -0.12,
      },
      {
        label: "只做关键测试",
        desc: "把验证压缩到核心项目。",
        trust: 2,
        rel: 0,
        q: 0,
        r: 0.05,
      },
      {
        label: "保留全部个人准备",
        desc: "短期更利于自己，但工程组会降低支持预期。",
        trust: -4,
        rel: 0,
        q: 0.28,
        r: 0.22,
      },
    ],
  },
  {
    id: "sponsor",
    type: "trust",
    title: "商业部门临时追加周四活动",
    body: "赞助商希望增加一段拍摄。它不会毁掉周末，但会吃掉一部分准备时间。",
    choices: [
      {
        label: "完整出席",
        desc: "把车队商业义务放在前面。",
        trust: 5,
        rel: 0,
        q: -0.16,
        r: -0.12,
      },
      {
        label: "缩短为核心流程",
        desc: "交付活动，也控制时间。",
        trust: 2,
        rel: 0,
        q: 0,
        r: 0,
      },
      {
        label: "拒绝追加安排",
        desc: "保住准备时间，管理层会记住这次拒绝。",
        trust: -4,
        rel: 0,
        q: 0.22,
        r: 0.18,
      },
    ],
  },
  {
    id: "briefing",
    type: "trust",
    title: "领队要求统一赛后公开口径",
    body: "上一站结果引发外界质疑。车队希望所有人只谈可公开的技术结论，不讨论内部责任。",
    choices: [
      {
        label: "完全按车队口径",
        desc: "降低内部摩擦。",
        trust: 5,
        rel: 0,
        q: -0.08,
        r: -0.06,
      },
      {
        label: "只谈自己的驾驶感受",
        desc: "保持边界，基本中性。",
        trust: 2,
        rel: 0,
        q: 0,
        r: 0,
      },
      {
        label: "公开强调赛车与策略问题",
        desc: "保护个人评价，但会消耗管理层信任。",
        trust: -5,
        rel: 0,
        q: 0.18,
        r: 0.14,
      },
    ],
  },
];
const V14_GENERAL_DRIVER = [
  {
    id: "data_share",
    type: "driver",
    title: "队友希望共享更多赛道数据",
    body: "两边工程组都认为共享刹车、差速器与长距离趋势能提高整体效率，但会减少个人信息优势。",
    choices: [
      {
        label: "完整共享",
        desc: "让两边都能直接使用关键结论。",
        trust: 0,
        rel: 5,
        q: -0.12,
        r: -0.08,
      },
      {
        label: "共享结论，不共享全部细节",
        desc: "合作与个人边界之间取中间值。",
        trust: 0,
        rel: 2,
        q: 0,
        r: 0,
      },
      {
        label: "保留核心数据",
        desc: "短期保住个人优势。",
        trust: 0,
        rel: -4,
        q: 0.2,
        r: 0.18,
      },
    ],
  },
  {
    id: "media_one",
    type: "driver",
    title: "记者追问车队是否存在一号车手",
    body: "你和队友最近成绩接近，任何一句强硬表态都会被带回车库。",
    choices: [
      {
        label: "强调车队利益优先",
        desc: "公开降温。",
        trust: 0,
        rel: 5,
        q: -0.06,
        r: -0.06,
      },
      {
        label: "回答“赛道上会证明”",
        desc: "保持竞争，但不要求车队站队。",
        trust: 0,
        rel: -1,
        q: 0.08,
        r: 0.08,
      },
      {
        label: "要求获得明确优先级",
        desc: "争取资源，同时让内部关系更紧张。",
        trust: 0,
        rel: -6,
        q: 0.24,
        r: 0.32,
      },
    ],
  },
];
function clampV14(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function round1V14(v) {
  return Math.round(Number(v || 0) * 10) / 10;
}
function randV14(a, b) {
  return a + Math.random() * (b - a);
}
function signed2V14(v) {
  const n = Number(v || 0);
  return `${n > 0 ? "+" : n < 0 ? "−" : "±"}${Math.abs(n).toFixed(2)}`;
}
function teamTrustCostPctV14(v = state.teamTrust) {
  return v >= 80 ? -8 : v >= 60 ? -4 : v >= 40 ? 0 : 8;
}
function teamTrustSuccessV14(v = state.teamTrust) {
  return v >= 80 ? 0.05 : v >= 60 ? 0.02 : v >= 40 ? 0 : -0.05;
}
function relationRaceV14(v = state.teamRelation) {
  return v >= 80 ? 0.2 : v >= 65 ? 0.1 : v >= 45 ? 0 : v >= 30 ? -0.12 : -0.3;
}
function seasonCompleteV14() {
  return !!(
    state &&
    state.weekend &&
    state.weekend.raceResult &&
    state.round >= calendar.length
  );
}
function ensureStateV14() {
  ensureStateV13();
  if (state.v14AffairsVersion !== 14) {
    state.teamAffairsWeek = null;
    state.affairsWeekendQual = 0;
    state.affairsWeekendRace = 0;
    state.affairsLongTermModifier = 0;
    state.affairsNextRaceModifier = 0;
    state.v14AffairsVersion = 14;
  }
  if (state.affairsWeekendQual == null) state.affairsWeekendQual = 0;
  if (state.affairsWeekendRace == null) state.affairsWeekendRace = 0;
  if (!Array.isArray(state.affairsHistory)) state.affairsHistory = [];
  if (!Array.isArray(state.devHistory)) state.devHistory = [];
}
function showToastV14(msg) {
  let el = document.getElementById("toastV14");
  if (!el) {
    el = document.createElement("div");
    el.id = "toastV14";
    el.className = "toastV14";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(showToastV14.t);
  showToastV14.t = setTimeout(() => el.classList.remove("show"), 850);
}
showView = function (id) {
  const target = document.getElementById(id);
  if (!target) return;
  document
    .querySelectorAll(".view")
    .forEach((v) => v.classList.remove("active"));
  void target.offsetWidth;
  target.classList.add("active");
  window.scrollTo({ top: 0, behavior: "auto" });
};
raceTransition = function (title, sub, kicker, target) {
  const el = document.getElementById("sessionTransition");
  document.getElementById("transitionTitle").textContent = title;
  document.getElementById("transitionSub").textContent = sub;
  document.getElementById("transitionKicker").textContent =
    kicker || "RACE WEEKEND";
  el.classList.add("show");
  setTimeout(() => showView(target), 70);
  setTimeout(() => el.classList.remove("show"), 210);
};

/* -------- R&D -------- */
function devTargetValueV14(part, target) {
  const t = teams[selected[1]];
  if (target === "next") {
    const base =
      CAR_BASE_V11[selected[1]]?.[CAR_ATTRS_V10.indexOf(part)] ?? t.parts[part];
    return round1V14(base + (state.nextSeasonResearch[part] || 0));
  }
  return round1V14(t.parts[part]);
}
function devProjectCatalogV14(part, target) {
  const v = devTargetValueV14(part, target),
    weak = clampV14((78 - v) * 0.055, -0.35, 1.15),
    costMod = 1 + teamTrustCostPctV14() / 100;
  const defs =
    target === "next"
      ? [
          ["concept", "概念研究", 2, 2.3 + weak * 0.45, 0.4, 0.8, 1, "低风险"],
          [
            "validate",
            "风洞验证",
            3,
            4.0 + weak * 0.75,
            0.8,
            1.4,
            0.9,
            "中风险",
          ],
          [
            "architecture",
            "全面研发",
            4,
            6.2 + weak * 1.05,
            1.2,
            2.0,
            0.8,
            "高投入",
          ],
        ]
      : [
          ["minor", "快速优化", 1, 2.6 + weak * 0.55, 0.35, 0.75, 1, "低风险"],
          [
            "standard",
            "标准升级",
            2,
            4.5 + weak * 0.85,
            0.75,
            1.35,
            0.92,
            "中风险",
          ],
          [
            "major",
            "大型升级",
            3,
            7.0 + weak * 1.2,
            1.25,
            2.15,
            0.78,
            "高投入",
          ],
        ];
  return defs.map((d) => ({
    key: d[0],
    label: d[1],
    duration: d[2],
    cost: round1V14(Math.max(1.8, d[3]) * costMod),
    minGain: d[4],
    maxGain: d[5],
    success: d[6],
    risk: d[7],
    underMin: 0.2,
    underMax: target === "next" ? 0.55 : 0.5,
    target,
  }));
}
function findDevOptionV14(part, target, key) {
  return devProjectCatalogV14(part, target).find((x) => x.key === key);
}
function setDevNoticeV14(msg = "") {
  const el = document.getElementById("devNotice");
  if (el) el.textContent = msg;
}
setDevModeV11 = function (mode) {
  ensureStateV14();
  if (mode === "next" && !nextSeasonUnlockedV11()) {
    state.devMode = "current";
    renderDevelopment();
    setDevNoticeV14("下一代赛车项目将在 R10 开放。");
    return;
  }
  state.devMode = mode;
  renderDevelopment();
  autosave();
};
transferBudgetV13 = function () {
  ensureStateV14();
  if (!nextSeasonUnlockedV11()) {
    setDevNoticeV14("R10 后才能锁定下赛季现金储备。");
    return;
  }
  const input = document.getElementById("futureTransferAmount");
  let amount = Number(input?.value);
  if (!Number.isFinite(amount) || amount <= 0) {
    setDevNoticeV14("填写一个大于 0 的金额。");
    return;
  }
  amount = round1V14(amount);
  if (amount > state.budget + 0.0001) {
    setDevNoticeV14("划入金额超过当前可用预算。");
    return;
  }
  state.budget = round1V14(state.budget - amount);
  state.nextSeasonFund = round1V14(state.nextSeasonFund + amount);
  renderDevelopment();
  renderHub();
  autosave();
  setDevNoticeV14(
    `已锁定 €${amount.toFixed(1)}M 到 ${seasonYearV11() + 1} 赛季。`,
  );
};
reserveAllBudgetV11 = function () {
  transferBudgetV13();
};
function openDevProjectV14(part) {
  ensureStateV14();
  const target = state.devMode || "current",
    opts = devProjectCatalogV14(part, target),
    dup = state.projects.some(
      (p) => p.part === part && p.seasonTarget === target,
    ),
    full = state.projects.length >= 2,
    remain = calendar.length - state.round;
  document.getElementById("modalTitle").textContent =
    `${part} · ${target === "next" ? "下一代研发" : "本赛季升级"}`;
  document.getElementById("modalBody").innerHTML =
    `<div class="driverdetail"><div class="kicker">PROJECT PLANNING</div><div class="driverdetailname">制定研发项目</div><div class="hint">小项目更快、更稳定；大型项目有更高上限，但成本更高且存在低于预期的概率。项目收益只在完成时结算。</div>${opts
      .map((o) => {
        const tooLate = o.duration > remain,
          disabled = full || dup || state.budget < o.cost || tooLate;
        let reason = full
          ? "两个槽位已占用"
          : dup
            ? "同一部件已有同方向项目"
            : state.budget < o.cost
              ? "预算不足"
              : tooLate
                ? "本赛季剩余轮次不足"
                : "";
        return `<div class="devProjectOption ${disabled ? "disabled" : ""}" ${disabled ? "" : `onclick="startDevProjectV14('${part}','${o.key}')"`}><div class="devProjectOptionHead"><h3>${o.label}</h3><strong>€${o.cost.toFixed(1)}M</strong></div><div class="devOptionMeta"><span>${o.duration} 站</span><span>预期 +${o.minGain.toFixed(1)}～+${o.maxGain.toFixed(1)}</span><span>兑现率 ${Math.round(clampV14(o.success + teamTrustSuccessV14(), 0.55, 1) * 100)}%</span><span>${o.risk}</span></div>${reason ? `<small style="display:block;margin-top:7px;color:#8d5b58">${reason}</small>` : ""}</div>`;
      })
      .join("")}</div>`;
  document.getElementById("overlay").classList.add("open");
}
function startDevProjectV14(part, key) {
  ensureStateV14();
  const target = state.devMode || "current",
    o = findDevOptionV14(part, target, key);
  if (!o) return;
  if (
    state.projects.length >= 2 ||
    state.projects.some((p) => p.part === part && p.seasonTarget === target) ||
    state.budget < o.cost ||
    o.duration > calendar.length - state.round
  ) {
    closeOverlay();
    renderDevelopment();
    return;
  }
  state.budget = round1V14(state.budget - o.cost);
  state.projects.push({
    v14: true,
    part,
    seasonTarget: target,
    projectType: o.key,
    label: o.label,
    cost: o.cost,
    start: state.round,
    finish: state.round + o.duration,
    duration: o.duration,
    minGain: o.minGain,
    maxGain: o.maxGain,
    success: o.success,
    underMin: o.underMin,
    underMax: o.underMax,
  });
  closeOverlay();
  renderDevelopment();
  renderHub();
  autosave();
  showToastV14(`${part} · ${o.label} 已立项`);
}
startDevV11 = function (part, cost, races, target) {
  state.devMode = target || state.devMode || "current";
  openDevProjectV14(part);
};
startDev = function (part) {
  openDevProjectV14(part);
};
completeProjects = function () {
  if (!selected || !state.projects) return;
  ensureStateV14();
  const t = teams[selected[1]],
    done = state.projects.filter((p) => p.finish <= state.round);
  if (!done.length) return;
  done.forEach((p) => {
    let gain = 0,
      ok = true;
    if (p.v14) {
      const chance = clampV14(
        (p.success ?? 0.9) + teamTrustSuccessV14(),
        0.55,
        1,
      );
      ok = Math.random() < chance;
      gain = ok
        ? randV14(p.minGain ?? 0.5, p.maxGain ?? 1)
        : randV14(p.underMin ?? 0.2, p.underMax ?? 0.5);
      gain = round1V14(gain);
    } else gain = Number(p.gain || 1);
    if (p.seasonTarget === "next")
      state.nextSeasonResearch[p.part] = round1V14(
        (state.nextSeasonResearch[p.part] || 0) + gain,
      );
    else if (t.parts[p.part] != null)
      t.parts[p.part] = round1V14(Math.min(94, t.parts[p.part] + gain));
    const label = p.label || "研发项目";
    state.devHistory.unshift({
      round: state.round,
      part: p.part,
      target: p.seasonTarget || "current",
      label,
      gain,
      ok,
    });
    state.aiDevNews.unshift(
      `${selected[1]}：${p.seasonTarget === "next" ? "下一代" : "当前"} ${p.part} ${ok ? "完成" : "低于预期"} · +${gain.toFixed(1)}`,
    );
  });
  state.projects = state.projects.filter((p) => p.finish > state.round);
  state.devHistory = state.devHistory.slice(0, 8);
  recalcTeamOvr(t);
  state.aiDevNews = state.aiDevNews.slice(0, 12);
};
renderProjects = function () {
  ensureStateV14();
  const box = document.getElementById("projects");
  if (!box) return;
  if (!state.projects.length) {
    box.innerHTML =
      '<div class="hint">当前没有项目。可以同时推进两项；同一部件不能同时做两个同方向项目。</div>';
  } else
    box.innerHTML = state.projects
      .map((p, i) => {
        const dur = Math.max(1, p.finish - p.start || p.duration || 1),
          progress = clampV14(((state.round - p.start) / dur) * 100, 0, 100),
          range = p.v14
            ? `预期 +${Number(p.minGain).toFixed(1)}～+${Number(p.maxGain).toFixed(1)}`
            : `完成后结算`;
        return `<div class="projectV14 ${p.seasonTarget === "next" ? "future" : ""}"><b>${p.part} · ${p.label || (p.seasonTarget === "next" ? "下一代研究" : "升级项目")} <span class="projectSlot">SLOT ${i + 1}</span></b><small>R${String(p.start).padStart(2, "0")} → R${String(p.finish).padStart(2, "0")} · ${range} · 剩余 ${Math.max(0, p.finish - state.round)} 站</small><div class="projectProgress"><i style="width:${progress}%"></i></div></div>`;
      })
      .join("");
  const hist = document.getElementById("devHistory");
  if (hist)
    hist.innerHTML = state.devHistory.length
      ? `<div class="small" style="margin-top:8px">最近完成</div>` +
        state.devHistory
          .slice(0, 4)
          .map(
            (h) =>
              `<div class="devHistoryRow"><b>R${String(h.round).padStart(2, "0")} · ${h.part}</b> · ${h.label} · ${h.ok ? "按计划兑现" : "低于预期"} +${Number(h.gain).toFixed(1)}</div>`,
          )
          .join("")
      : "";
};
function attrRankV14(part) {
  const rows = Object.keys(teams).sort(
    (a, b) => (teams[b].parts[part] || 0) - (teams[a].parts[part] || 0),
  );
  return rows.indexOf(selected[1]) + 1;
}
renderDevelopment = function () {
  ensureStateV14();
  completeProjects();
  const t = teams[selected[1]],
    mode = state.devMode || "current",
    full = state.projects.length >= 2,
    y = seasonYearV11();
  document.getElementById("devBudget").textContent =
    `€ ${state.budget.toFixed(1)}M`;
  document.getElementById("devSlotStatus").textContent =
    `${state.projects.length} / 2`;
  const pct = teamTrustCostPctV14();
  document.getElementById("devTrustCost").textContent =
    pct < 0 ? `成本 ${pct}%` : pct > 0 ? `成本 +${pct}%` : "标准";
  document.getElementById("devTrustCostNote").textContent =
    `${teamTrustStatusV13()} · 项目兑现率 ${teamTrustSuccessV14() > 0 ? "+" : ""}${Math.round(teamTrustSuccessV14() * 100)}%`;
  document.getElementById("playerCarTeamLabel").textContent =
    `${selected[1]} · 六项整车能力`;
  document.getElementById("playerCarSummary").innerHTML =
    `<div class="car6grid">${CAR_ATTRS_V10.map((a) => `<div class="car6"><span>${a}</span><b>${Number(t.parts[a]).toFixed(1)}</b></div>`).join("")}</div>`;
  const b1 = document.getElementById("devModeCurrent"),
    b2 = document.getElementById("devModeNext");
  b1?.classList.toggle("active", mode === "current");
  if (b2) {
    b2.classList.toggle("active", mode === "next");
    b2.disabled = !nextSeasonUnlockedV11();
    b2.textContent = `${y + 1} 赛车`;
  }
  document.getElementById("devTargetLabel").textContent =
    mode === "next" ? `${y + 1} CAR RESEARCH` : `${y} CURRENT CAR`;
  document.getElementById("devSeasonHint").textContent =
    mode === "next"
      ? `这里花掉的是今年的研发预算，但成果只进入 ${y + 1} 赛车基线。现金储备不会自动参与研究。`
      : `当前赛车升级完成后立即生效。越大的项目越慢、越贵，也越可能低于预期。`;
  document.getElementById("futureFund").textContent =
    `€ ${state.nextSeasonFund.toFixed(1)}M`;
  const rc = Object.values(state.nextSeasonResearch).reduce(
    (a, b) => a + Number(b || 0),
    0,
  );
  document.getElementById("futureResearchCount").textContent =
    `${rc.toFixed(1)} 点`;
  const input = document.getElementById("futureTransferAmount"),
    btn = document.getElementById("futureTransferBtn");
  if (input) {
    input.max = Math.max(0, state.budget).toFixed(1);
    if (Number(input.value) > state.budget)
      input.value = Math.max(0.5, Math.floor(state.budget * 2) / 2);
  }
  if (btn) btn.disabled = !nextSeasonUnlockedV11() || state.budget < 0.5;
  document.getElementById("futureFundRule").textContent =
    nextSeasonUnlockedV11()
      ? `已开放 ${y + 1} 规划。现金储备会在明年成为可花预算；下一代研究则直接改变新车基线，两者分别结算。`
      : `R10 后开放 ${y + 1} 规划。在此之前只能开发当前赛车。`;
  document.getElementById("devParts").innerHTML =
    (full
      ? '<div class="locknote">两个研发槽都已占用。完成任一项目后再立项。</div>'
      : "") +
    CAR_ATTRS_V10.map((a) => {
      const v = devTargetValueV14(a, mode),
        dup = state.projects.some(
          (p) => p.part === a && p.seasonTarget === mode,
        ),
        rank =
          mode === "current"
            ? `当前全场 P${attrRankV14(a)}`
            : `研究累计 +${Number(state.nextSeasonResearch[a] || 0).toFixed(1)}`;
      return `<div class="devPartV14"><div class="devPartTop"><div><h3>${a}</h3><div class="small">${V14_DEV_IMPACTS[a]}</div></div><div class="devPartValue">${v.toFixed(1)}</div></div><div class="devPartMeta"><span>${rank}</span><span>${dup ? "同类项目进行中" : mode === "next" ? "下一代基线" : "当前赛车"}</span></div><div class="devPartAction"><small>${dup ? "等待当前项目结束后才能继续这个方向。" : "可选择快速、标准或大型项目。"}</small><button class="mini" ${full || dup ? "disabled" : ""} onclick="openDevProjectV14('${a}')">${dup ? "研发中" : "制定项目"}</button></div></div>`;
    }).join("");
  renderProjects();
  renderPerformanceTable();
};

/* -------- Team affairs -------- */
function affairCountV14() {
  const r = Math.random();
  return r < 0.2 ? 0 : r < 0.78 ? 1 : 2;
}
function teammatePointsGapV14() {
  const tm = teammateV10();
  if (!tm) return 999;
  return Math.abs(
    (state.driverStandings[selected[0]] || 0) -
      (state.driverStandings[tm[0]] || 0),
  );
}
function contextualAffairsPoolV14() {
  let pool = [...V14_GENERAL_TRUST, ...V14_GENERAL_DRIVER];
  if (state.teamTrust < 42)
    pool.unshift({
      id: "trust_review",
      type: "trust",
      title: "管理层安排一次阶段性信任复盘",
      body: "近期几次选择让管理层对合作方式产生疑问。这不是最后通牒，但会决定之后给你的自由度。",
      choices: [
        {
          label: "主动解释并接受调整",
          desc: "先修复合作方式。",
          trust: 7,
          rel: 0,
          q: -0.1,
          r: -0.08,
        },
        {
          label: "用数据说明自己的决定",
          desc: "保持立场，同时给出可验证依据。",
          trust: 4,
          rel: 0,
          q: 0.03,
          r: 0.03,
        },
        {
          label: "明确要求更多自主权",
          desc: "短期获得空间，但关系会继续承压。",
          trust: -5,
          rel: 0,
          q: 0.24,
          r: 0.2,
        },
      ],
    });
  if (state.teamRelation < 42)
    pool.unshift({
      id: "driver_meeting",
      type: "driver",
      title: "领队建议你和队友单独谈一次",
      body: "最近几次赛道内外互动已经开始影响两边工程组。车队建议在下一个周末前把规则说清楚。",
      choices: [
        {
          label: "主动把争议说开",
          desc: "关系修复最明显。",
          trust: 0,
          rel: 8,
          q: -0.1,
          r: -0.1,
        },
        {
          label: "只确认职业边界",
          desc: "不追求亲近，但保证合作。",
          trust: 0,
          rel: 4,
          q: 0,
          r: 0,
        },
        {
          label: "认为没有必要谈",
          desc: "保留强硬姿态。",
          trust: 0,
          rel: -5,
          q: 0.16,
          r: 0.24,
        },
      ],
    });
  if (state.projects.length)
    pool.push({
      id: "upgrade_alloc",
      type: "driver",
      title: "升级件的首套成品需要分配",
      body: "项目时间表只允许先完成一套成品。谁先拿到，会影响这一站的准备与之后的内部气氛。",
      choices: [
        {
          label: "按赛道需求分配",
          desc: "让工程组根据适配度决定。",
          trust: 1,
          rel: 5,
          q: -0.1,
          r: -0.08,
        },
        {
          label: "按最近成绩分配",
          desc: "规则清楚，但竞争意味更强。",
          trust: 0,
          rel: 0,
          q: 0.1,
          r: 0.12,
        },
        {
          label: "要求自己先用",
          desc: "拿到短期资源，牺牲队友关系。",
          trust: -2,
          rel: -6,
          q: 0.3,
          r: 0.38,
        },
      ],
    });
  if (state.round >= 10)
    pool.push({
      id: "future_split",
      type: "trust",
      title: `技术部门讨论 ${seasonYearV11() + 1} 资源比例`,
      body: "赛季进入中段后，车队需要决定继续追当前成绩，还是更早押注下一代赛车。",
      choices: [
        {
          label: "接受按积分形势动态调整",
          desc: "把决定权交给技术与管理层。",
          trust: 6,
          rel: 0,
          q: -0.08,
          r: -0.06,
        },
        {
          label: "要求保留最低当前车资源",
          desc: "整体配合，同时保护本赛季底线。",
          trust: 2,
          rel: 0,
          q: 0.08,
          r: 0.08,
        },
        {
          label: "坚持继续优先当前赛车",
          desc: "短期更利于成绩，但会与长期计划产生摩擦。",
          trust: -5,
          rel: 0,
          q: 0.28,
          r: 0.24,
        },
      ],
    });
  if (teammatePointsGapV14() < 35)
    pool.push({
      id: "strategy_priority",
      type: "driver",
      title: "策略组希望提前确定双车优先规则",
      body: "你和队友积分接近，而且预计下一站会在同一集团。策略组希望提前约定谁先停、谁优先使用 undercut。",
      choices: [
        {
          label: "以赛道位置为准",
          desc: "谁在前谁先获得窗口。",
          trust: 0,
          rel: 5,
          q: 0,
          r: -0.08,
        },
        {
          label: "以积分排名为准",
          desc: "把赛季地位带进单场策略。",
          trust: 0,
          rel: -1,
          q: 0,
          r: 0.12,
        },
        {
          label: "要求自己拥有第一策略权",
          desc: "直接争取核心待遇。",
          trust: 0,
          rel: -7,
          q: 0,
          r: 0.38,
        },
      ],
    });
  return pool;
}
function ensureTeamAffairsWeekV14() {
  ensureStateV14();
  if (
    state.teamAffairsWeek &&
    state.teamAffairsWeek.round === state.round &&
    state.teamAffairsWeek.version === 14
  )
    return;
  let count = affairCountV14();
  if (state.teamTrust < 30 || state.teamRelation < 30)
    count = Math.max(1, count);
  const pool = contextualAffairsPoolV14(),
    seen = new Set(),
    picked = [];
  for (const e of shuffledV13(pool)) {
    if (seen.has(e.id)) continue;
    seen.add(e.id);
    picked.push(JSON.parse(JSON.stringify(e)));
    if (picked.length >= count) break;
  }
  state.teamAffairsWeek = {
    version: 14,
    round: state.round,
    events: picked.map((e, i) => ({
      ...e,
      id: `${e.id}-R${state.round}-${i}`,
      resolved: false,
      outcome: null,
    })),
  };
  state.affairsWeekendQual = 0;
  state.affairsWeekendRace = 0;
  state.affairsLongTermModifier = 0;
  state.affairsNextRaceModifier = 0;
}
ensureTeamAffairsWeekV13 = ensureTeamAffairsWeekV14;
ensureTeamWeekEventV10 = function () {
  ensureTeamAffairsWeekV14();
  state.teamWeekEvent = {
    round: state.round,
    resolved: true,
    event: { title: "车队事务", body: "", choices: [] },
    outcome: null,
  };
};
teamEventReadyV12 = function () {
  return true;
};
function resolveTeamAffairV14(i, j) {
  ensureTeamAffairsWeekV14();
  const e = state.teamAffairsWeek.events[i],
    c = e?.choices?.[j];
  if (!e || e.resolved || !c) return;
  state.teamTrust = clampV14(state.teamTrust + (c.trust || 0), 0, 100);
  state.teamRelation = clampV14(state.teamRelation + (c.rel || 0), 0, 100);
  state.affairsWeekendQual = clampV14(
    state.affairsWeekendQual + (c.q || 0),
    -1.5,
    1.5,
  );
  state.affairsWeekendRace = clampV14(
    state.affairsWeekendRace + (c.r || 0),
    -1.8,
    1.8,
  );
  e.resolved = true;
  e.outcome = `${c.label} · ${c.trust ? `车队信任 ${c.trust > 0 ? "+" : ""}${c.trust}` : ""}${c.trust && c.rel ? " · " : ""}${c.rel ? `车手关系 ${c.rel > 0 ? "+" : ""}${c.rel}` : ""} · 下站排位 ${signed2V14(c.q)} / 正赛 ${signed2V14(c.r)}`;
  state.affairsHistory.unshift({
    round: state.round,
    title: e.title,
    choice: c.label,
    trust: c.trust || 0,
    rel: c.rel || 0,
    q: c.q || 0,
    r: c.r || 0,
  });
  state.affairsHistory = state.affairsHistory.slice(0, 8);
  renderMedia();
  renderHub();
  autosave();
}
function renderAffairEventV14(e, i) {
  const type = e.type === "trust" ? "车队信任" : "车手关系";
  if (e.resolved)
    return `<div class="affairEvent resolved"><div class="affairEventHead"><div><span class="affairType ${e.type}">${type}</span><h3>${e.title}</h3></div><span class="small">已处理</span></div><p>${e.body}</p><div class="affairOutcome">${e.outcome}</div></div>`;
  return `<div class="affairEvent"><div class="affairEventHead"><div><span class="affairType ${e.type}">${type}</span><h3>${e.title}</h3></div><span class="small">可选</span></div><p>${e.body}</p><div class="affairChoices">${e.choices.map((c, j) => `<div class="affairChoice" onclick="resolveTeamAffairV14(${i},${j})"><b>${c.label}</b><span>${c.desc}</span><div class="affairEffectsV14">${c.trust ? `<small>信任 ${c.trust > 0 ? "+" : ""}${c.trust}</small>` : ""}${c.rel ? `<small>关系 ${c.rel > 0 ? "+" : ""}${c.rel}</small>` : ""}<small>排位 ${signed2V14(c.q)}</small><small>正赛 ${signed2V14(c.r)}</small></div></div>`).join("")}</div></div>`;
}
renderMedia = function () {
  ensureStateV14();
  ensureTeamAffairsWeekV14();
  const tm = teammateV10(),
    events = state.teamAffairsWeek.events || [],
    t = state.teamTrust,
    v = state.teamRelation,
    pct = teamTrustCostPctV14(),
    rr = relationRaceV14();
  document.getElementById("teamTrustStatus").textContent =
    teamTrustStatusV13(t);
  document.getElementById("teamTrustValue").textContent =
    `管理层与工程组 · ${Math.round(t)}/100`;
  document.getElementById("teamTrustBar").style.width = t + "%";
  document.getElementById("teamTrustEffect").textContent =
    `研发成本 ${pct > 0 ? "+" : ""}${pct}% · 项目兑现率 ${teamTrustSuccessV14() > 0 ? "+" : ""}${Math.round(teamTrustSuccessV14() * 100)}%`;
  document.getElementById("teamRelationStatus").textContent =
    relationStatusV10(v);
  document.getElementById("teamRelationPair").textContent =
    `${selected[0]} ↔ ${tm?.[0] || "队友"} · ${Math.round(v)}/100`;
  document.getElementById("teamRelationBar").style.width = v + "%";
  document.getElementById("teamRelationEffect").textContent =
    `正赛协作 ${signed2V14(rr)} · 关系越差越容易在双车互动中损失`;
  document.getElementById("rivalStats").innerHTML =
    `<div><span>你领先队友</span><b>${state.rivalry.playerAhead}</b></div><div><span>队友领先你</span><b>${state.rivalry.teammateAhead}</b></div><div><span>让车 / 冲突</span><b>${state.rivalry.orders} / ${state.rivalry.clashes}</b></div>`;
  const unresolved = events.filter((e) => !e.resolved).length;
  document.getElementById("affairsWeekMeta").textContent =
    `R${String(state.round).padStart(2, "0")} · 刷新 ${events.length} 项 · ${unresolved} 项未处理 · 可直接比赛`;
  document.getElementById("teamAffairsEvents").innerHTML = events.length
    ? events.map(renderAffairEventV14).join("")
    : `<div class="affairEmpty"><b>本周没有需要你处理的事务。</b><br>车库按常规程序运转，可以直接进入比赛周末。</div>`;
  document.getElementById("affairsWeekendQual").textContent = signed2V14(
    state.affairsWeekendQual,
  );
  document.getElementById("affairsWeekendRace").textContent = signed2V14(
    state.affairsWeekendRace,
  );
  document.getElementById("affairsHistory").innerHTML = state.affairsHistory
    .length
    ? state.affairsHistory
        .slice(0, 5)
        .map(
          (h) =>
            `<div class="affairsHistoryRow"><b>R${String(h.round).padStart(2, "0")} · ${h.title}</b><br>${h.choice}${h.trust ? ` · 信任 ${h.trust > 0 ? "+" : ""}${h.trust}` : ""}${h.rel ? ` · 关系 ${h.rel > 0 ? "+" : ""}${h.rel}` : ""}</div>`,
        )
        .join("")
    : '<div class="affairEmpty" style="padding:14px">还没有处理记录。</div>';
};

/* -------- End-of-season flow -------- */
function leaveSeasonViewV14() {
  if (seasonCompleteV14()) showSeasonFinaleV10();
  else showView("career");
}
const renderSeasonV14Base = renderSeasonV10;
renderSeasonV10 = function () {
  renderSeasonV14Base();
  const back = document.getElementById("seasonBackBtn");
  if (back) {
    back.textContent = seasonCompleteV14() ? "← 赛季总结" : "← 赛季总部";
  }
  if (seasonCompleteV14()) {
    const y = seasonYearV11(),
      box = document.getElementById("seasonContent");
    if (box && !document.getElementById("seasonCompleteActions"))
      box.insertAdjacentHTML(
        "beforeend",
        `<div class="card" id="seasonCompleteActions" style="margin-top:12px"><div class="relationhead"><div><h2 class="sectiontitle" style="margin-bottom:3px">${y} 赛季已结束</h2><div class="small">查看完积分榜后可以直接回到赛季总结，或继续进入下一年。</div></div><div class="small">SEASON COMPLETE</div></div><div class="seasonCompleteActions"><button class="btn" onclick="showSeasonFinaleV10()">返回赛季总结</button><button class="btn primary" onclick="startNextSeasonV11()">进入 ${y + 1} 赛季 →</button></div></div>`,
      );
  }
};
const renderHubV14Base = renderHub;
renderHub = function () {
  renderHubV14Base();
  ensureStateV14();
  ensureTeamAffairsWeekV14();
  const card = document.getElementById("raceModuleCard"),
    btn = document.getElementById("quickSimBtn"),
    desc = document.getElementById("raceGateDesc"),
    mood = document.getElementById("teamMood");
  if (mood)
    mood.textContent = `${teamTrustStatusV13()} · ${relationStatusV10()}`;
  if (seasonCompleteV14()) {
    if (card) {
      card.classList.remove("locked");
      card.classList.add("ready");
      card.onclick = () => showSeasonFinaleV10();
    }
    if (desc)
      desc.textContent = `${seasonYearV11()} 赛季已经结束，打开赛季总结后可继续下一年。`;
    if (btn) {
      btn.style.display = "none";
      btn.disabled = true;
    }
  } else {
    if (card) card.onclick = () => openModule("race");
    if (desc)
      desc.textContent = currentRace()?.[4]
        ? "车队事务为可选；本轮为冲刺周末，可直接进入 Sprint → 排位 → 正赛。"
        : "车队事务为可选；可以直接进入完整比赛周末。";
    if (btn) {
      btn.style.display = "";
      btn.disabled = false;
      btn.textContent = "一键模拟本轮";
    }
  }
};
const advanceRoundV14Base = advanceRound;
advanceRound = function () {
  const before = state.round;
  advanceRoundV14Base();
  if (state.round !== before) {
    ensureStateV14();
    state.teamAffairsWeek = null;
    state.affairsWeekendQual = 0;
    state.affairsWeekendRace = 0;
    ensureTeamAffairsWeekV14();
    renderHub();
    autosave();
  }
};
const startCareerV14Base = startCareer;
startCareer = function () {
  startCareerV14Base();
  ensureStateV14();
  state.v14AffairsVersion = 14;
  state.teamAffairsWeek = null;
  state.affairsWeekendQual = 0;
  state.affairsWeekendRace = 0;
  state.affairsHistory = [];
  state.devHistory = [];
  ensureTeamAffairsWeekV14();
  renderHub();
  autosave();
};
const startNextSeasonV14Base = startNextSeasonV11;
startNextSeasonV11 = function () {
  startNextSeasonV14Base();
  ensureStateV14();
  state.teamAffairsWeek = null;
  state.affairsWeekendQual = 0;
  state.affairsWeekendRace = 0;
  state.v14AffairsVersion = 14;
  ensureTeamAffairsWeekV14();
  renderHub();
  autosave();
};
const restoreSnapshotV14Base = restoreSnapshot;
restoreSnapshot = function (data) {
  const ok = restoreSnapshotV14Base(data);
  if (ok) {
    ensureStateV14();
    ensureTeamAffairsWeekV14();
    renderHub();
  }
  return ok;
};

/* Quick sim: no confirmation dialog and no explanatory box afterwards. */
quickSimCurrentRound = function () {
  if (!selected || state.weekend.raceResult || seasonCompleteV14()) return;
  ensureStateV14();
  ensureSprintStateV12();
  if (currentRace()?.[4] && !state.weekend.sprintResult) {
    state.weekend.sprintStrategy = "normal";
    const sf = simulateSprintFieldV12(true);
    state.weekend.sprintField = sf;
    state.weekend.sprintResult = {
      ...sf.find((x) => x.mine),
      field: sf.map((x) => ({ ...x })),
    };
    applySprintPointsV12(sf);
  }
  state.weekend.qualStrategy = "normal";
  state.weekend.raceStrategy = "normal";
  const qField = simulateDirectSessionV10("qual");
  state.weekend.qualField = qField;
  state.weekend.qualResult = qField.find((x) => x.mine);
  if (state.weekend.qualResult.position === 1)
    state.driverSeasonStats[selected[0]].poles++;
  const rField = simulateDirectSessionV10("race");
  const mine = rField.find((x) => x.mine);
  mine.field = rField.map((x) => ({ ...x }));
  mine.note = "";
  mine.choice = "";
  mine.eventTitle = "";
  completeRaceResultV10(rField, mine, true);
};
const renderWeekendResultV14Base = renderWeekendResult;
renderWeekendResult = function () {
  renderWeekendResultV14Base();
  const el = document.getElementById("resultDecision");
  if (el) {
    el.textContent = "";
    el.style.display = "none";
  }
  const b = document.getElementById("nextRoundBtn");
  if (b && state.round >= calendar.length)
    b.textContent = "结束赛季 · 查看年度总结 →";
};
quickSave = function () {
  if (!selected) return;
  try {
    localStorage.setItem(SAVE_PREFIX + "slot1", JSON.stringify(snapshot()));
    autosave();
    showToastV14("已保存到存档槽 1");
  } catch (e) {
    showToastV14("当前浏览器未允许本地存档");
  }
};

setTimeout(() => {
  if (selected) {
    ensureStateV14();
    ensureTeamAffairsWeekV14();
  }
}, 0);

/* v15-script */

(function () {
  function ensureStateV15() {
    ensureStateV14();
    if (state.v15Version !== 15) state.v15Version = 15;
    if (!state.contract) state.contract = {};
    if (state.contract.nextTeam === undefined) state.contract.nextTeam = null;
    if (!Array.isArray(state.contract.history)) state.contract.history = [];
    if (
      !state.marketAttemptedV15 ||
      typeof state.marketAttemptedV15 !== "object"
    )
      state.marketAttemptedV15 = {};
    if (!Array.isArray(state.marketOffersV15)) state.marketOffersV15 = [];
    if (state.marketOfferRoundV15 == null) state.marketOfferRoundV15 = 0;
    if (!state.nextSeasonResearch) {
      state.nextSeasonResearch = {};
      CAR_ATTRS_V10.forEach((a) => (state.nextSeasonResearch[a] = 0));
    }
    if (!state.aiNextSeasonResearch) {
      state.aiNextSeasonResearch = {};
      Object.keys(teams).forEach((t) => {
        state.aiNextSeasonResearch[t] = {};
        CAR_ATTRS_V10.forEach((a) => (state.aiNextSeasonResearch[t][a] = 0));
      });
    }
  }
  function marketWindowOpenV15() {
    return (
      !!selected &&
      state.round >= 14 &&
      state.round <= calendar.length &&
      !seasonCompleteV14()
    );
  }
  function teamOrderV15() {
    return Object.keys(teams).sort(
      (a, b) =>
        (state.teamStandings[b] || 0) - (state.teamStandings[a] || 0) ||
        (teams[b]?.ovr || 0) - (teams[a]?.ovr || 0) ||
        a.localeCompare(b),
    );
  }
  function teamRankV15(team) {
    const order = teamOrderV15();
    return order.indexOf(team) + 1;
  }
  function teamTierV15(rank) {
    return rank <= 3
      ? "争冠席位"
      : rank <= 6
        ? "前中游席位"
        : rank <= 8
          ? "中游席位"
          : "重建席位";
  }
  function contractChanceV15(team, kind) {
    ensureStateV14();
    const rank = driverRankV10();
    const pts = state.driverStandings[selected[0]] || 0;
    const wins = state.driverSeasonStats[selected[0]]?.wins || 0;
    const teamRank = teamRankV15(team);
    const currentRank = teamRankV15(selected[1]);
    const demand =
      (selected[2] || 80) >= 90
        ? 0.06
        : (selected[2] || 80) >= 87
          ? 0.04
          : (selected[2] || 80) >= 84
            ? 0.02
            : 0;
    let perf =
      (12 - rank) * 0.045 +
      Math.min(0.22, pts / 380) +
      Math.min(0.12, wins * 0.04);
    let base = 0.45;
    if (kind === "renew") base = 0.72 + perf;
    else if (teamRank <= 3) base = 0.18 + perf;
    else if (teamRank <= 6) base = 0.34 + perf;
    else base = 0.5 + perf;
    const jump = currentRank - teamRank;
    if (kind !== "renew") {
      if (jump > 0) base -= jump * 0.06;
      if (jump < 0) base += Math.min(0.14, Math.abs(jump) * 0.03);
      base -= demand;
    } else base += 0.08;
    return clampV14(base, 0.15, 0.93);
  }
  function chanceLabelV15(p) {
    return p >= 0.78
      ? "很高"
      : p >= 0.62
        ? "较高"
        : p >= 0.45
          ? "中等"
          : "偏低";
  }
  function generateMarketOffersV15(force) {
    ensureStateV14();
    if (!marketWindowOpenV15()) {
      state.marketOffersV15 = [];
      return [];
    }
    if (
      !force &&
      state.marketOffersV15.length &&
      state.marketOfferRoundV15 === state.round
    )
      return state.marketOffersV15;
    const order = teamOrderV15();
    const current = selected[1];
    const currentIndex = Math.max(0, order.indexOf(current));
    const rank = driverRankV10();
    let betterPool = order.filter((t, i) => t !== current && i < currentIndex);
    if (rank <= 3) betterPool = betterPool.slice(0, 5);
    else if (rank <= 8) betterPool = betterPool.slice(0, 3);
    else betterPool = betterPool.slice(0, 2);
    if (!betterPool.length)
      betterPool = order.filter((t) => t !== current).slice(0, 3);
    const betterTeam =
      betterPool[Math.floor(Math.random() * betterPool.length)] ||
      order.find((t) => t !== current);
    let saferPool = order.filter(
      (t, i) =>
        t !== current &&
        i >= Math.max(0, currentIndex - 1) &&
        i <= Math.min(order.length - 1, currentIndex + 4) &&
        t !== betterTeam,
    );
    if (!saferPool.length)
      saferPool = order.filter((t) => t !== current && t !== betterTeam);
    const saferTeam =
      saferPool[Math.floor(Math.random() * saferPool.length)] ||
      order.find((t) => t !== current && t !== betterTeam);
    state.marketOffersV15 = [
      {
        team: betterTeam,
        type: "best",
        title: "更高目标",
        kind: "team",
        chance: contractChanceV15(betterTeam, "team"),
      },
      {
        team: saferTeam,
        type: "safe",
        title: "稳妥选择",
        kind: "team",
        chance: contractChanceV15(saferTeam, "team"),
      },
      {
        team: current,
        type: "renew",
        title: "续约选项",
        kind: "renew",
        chance: contractChanceV15(current, "renew"),
      },
    ];
    state.marketOfferRoundV15 = state.round;
    return state.marketOffersV15;
  }
  function attemptContractV15(team, kind) {
    ensureStateV14();
    if (!marketWindowOpenV15() || state.contract.nextTeam) return;
    const chance = contractChanceV15(team, kind);
    const ok = Math.random() < chance;
    if (ok) {
      state.contract.nextTeam = team;
      state.contract.signedRound = state.round;
      state.contract.history.unshift(
        `R${String(state.round).padStart(2, "0")} · ${kind === "renew" ? "续约成功" : "签约成功"} · ${team}`,
      );
      showToastV14(
        kind === "renew"
          ? `已与 ${team} 完成续约`
          : `已签下 ${team} 的一年合同`,
      );
    } else {
      state.marketAttemptedV15[team] = true;
      state.contract.history.unshift(
        `R${String(state.round).padStart(2, "0")} · 谈判失败 · ${team}`,
      );
      showToastV14(`${team} 没有接受这份合同`);
    }
    renderContractsV10();
    renderHub();
    autosave();
  }
  function goHomeV15() {
    try {
      localStorage.removeItem(SAVE_PREFIX + "autosave");
    } catch (e) {}
    showView("home");
    if (typeof updateResumeButton === "function") updateResumeButton();
  }
  function aiAssignContractsV15() {
    ensureStateV14();
    const nextPlayerTeam = state.contract.nextTeam || selected[1];
    const order = teamOrderV15();
    const seats = {};
    Object.keys(teams).forEach((t) => (seats[t] = 2));
    seats[nextPlayerTeam] = 1;
    const ai = drivers
      .filter((d) => d[0] !== selected[0])
      .map((d) => ({
        ref: d,
        name: d[0],
        ovr: d[2] || 80,
        oldTeam: d[1],
        pts: state.driverStandings[d[0]] || 0,
        wins: state.driverSeasonStats[d[0]]?.wins || 0,
      }));
    ai.forEach((d) => (d.score = d.ovr + d.pts * 0.18 + d.wins * 5));
    ai.sort((a, b) => b.score - a.score);
    function expectedRank(driver) {
      return driver.score >= 125
        ? 2
        : driver.score >= 112
          ? 4
          : driver.score >= 102
            ? 6
            : driver.score >= 94
              ? 8
              : 10;
    }
    ai.forEach((driver) => {
      const available = order.filter((t) => seats[t] > 0);
      let chosen = null;
      if (seats[driver.oldTeam] > 0 && Math.random() < 0.42)
        chosen = driver.oldTeam;
      if (!chosen) {
        let bestW = -1e9;
        available.forEach((team) => {
          const rank = order.indexOf(team) + 1;
          let w =
            50 +
            (12 - rank) * 5 -
            Math.abs(rank - expectedRank(driver)) * 4 +
            (team === driver.oldTeam ? 12 : 0) +
            (Math.random() * 14 - 7);
          if (w > bestW) {
            bestW = w;
            chosen = team;
          }
        });
      }
      driver.ref[1] = chosen;
      seats[chosen]--;
    });
  }
  function applySeasonDecayAndResearchV15() {
    ensureStateV14();
    const order = teamOrderV15();
    const oldTeam = selected[1];
    Object.keys(teams).forEach((team) => {
      const rank = order.indexOf(team) + 1;
      CAR_ATTRS_V10.forEach((a, i) => {
        const base =
          (CAR_BASE_V11[team]?.[i] || teams[team].parts[a] || 70) - 1;
        const decay =
          rank <= 3
            ? randV14(3.8, 4.9)
            : rank <= 6
              ? randV14(3.2, 4.2)
              : rank <= 8
                ? randV14(2.7, 3.7)
                : randV14(2.2, 3.2);
        teams[team].parts[a] = round1V14(
          Math.max(base, (teams[team].parts[a] || base) - decay),
        );
      });
    });
    CAR_ATTRS_V10.forEach((a) => {
      teams[oldTeam].parts[a] = round1V14(
        Math.min(
          94,
          (teams[oldTeam].parts[a] || 0) + (state.nextSeasonResearch[a] || 0),
        ),
      );
      Object.keys(teams).forEach((t) => {
        if (t === oldTeam) return;
        teams[t].parts[a] = round1V14(
          Math.min(
            94,
            (teams[t].parts[a] || 0) +
              (state.aiNextSeasonResearch[t]?.[a] || 0),
          ),
        );
      });
    });
    Object.keys(teams).forEach((t) => recalcTeamOvr(teams[t]));
  }

  /* Faster animations */
  showView = function (id) {
    const target = document.getElementById(id);
    if (!target) return;
    document
      .querySelectorAll(".view")
      .forEach((v) => v.classList.remove("active"));
    void target.offsetWidth;
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "auto" });
  };
  raceTransition = function (title, sub, kicker, target) {
    const el = document.getElementById("sessionTransition");
    document.getElementById("transitionTitle").textContent = title;
    document.getElementById("transitionSub").textContent = sub;
    document.getElementById("transitionKicker").textContent =
      kicker || "RACE WEEKEND";
    el.classList.add("show");
    setTimeout(() => showView(target), 45);
    setTimeout(() => el.classList.remove("show"), 150);
  };

  /* Higher gains for three upgrade tiers */
  devProjectCatalogV14 = function (part, target) {
    const v = devTargetValueV14(part, target),
      weak = clampV14((78 - v) * 0.05, -0.3, 1.1),
      costMod = 1 + teamTrustCostPctV14() / 100;
    const defs =
      target === "next"
        ? [
            [
              "concept",
              "概念研究",
              2,
              2.8 + weak * 0.5,
              1.0,
              2.0,
              0.97,
              "低风险",
            ],
            [
              "validate",
              "风洞验证",
              3,
              4.8 + weak * 0.8,
              1.0,
              3.0,
              0.9,
              "中风险",
            ],
            [
              "architecture",
              "全面研发",
              4,
              7.4 + weak * 1.1,
              2.0,
              4.0,
              0.8,
              "高投入",
            ],
          ]
        : [
            ["minor", "快速优化", 1, 3.0 + weak * 0.55, 1.0, 2.0, 1, "低风险"],
            [
              "standard",
              "标准升级",
              2,
              5.1 + weak * 0.9,
              1.0,
              3.0,
              0.93,
              "中风险",
            ],
            [
              "major",
              "大型升级",
              3,
              7.8 + weak * 1.2,
              2.0,
              4.0,
              0.82,
              "高投入",
            ],
          ];
    return defs.map((d) => ({
      key: d[0],
      label: d[1],
      duration: d[2],
      cost: round1V14(Math.max(2, d[3]) * costMod),
      minGain: d[4],
      maxGain: d[5],
      success: d[6],
      risk: d[7],
      underMin: target === "next" ? 0.6 : 0.7,
      underMax: target === "next" ? 1.4 : 1.5,
      target,
    }));
  };

  /* R&D layout and copy */
  const renderDevelopmentV15Prev = renderDevelopment;
  renderDevelopment = function () {
    ensureStateV14();
    renderDevelopmentV15Prev();
    const t = teams[selected[1]],
      y = seasonYearV11();
    const label = document.getElementById("playerCarTeamLabel");
    if (label) label.textContent = `${selected[1]} · 六项能力与单项排名`;
    const sum = document.getElementById("playerCarSummary");
    if (sum) {
      sum.innerHTML = `<div class="car6grid">${CAR_ATTRS_V10.map((a) => `<div class="car6"><span>${a}</span><b>${Number(t.parts[a]).toFixed(1)}</b><small class="attrRankSub">当前全场 P${attrRankV14(a)}</small></div>`).join("")}</div>`;
    }
    const topCards = document.querySelectorAll(".devOverviewCard small");
    if (topCards[0])
      topCards[0].textContent = "当前赛季与下一代研究共用今年预算";
    const row = document.querySelector(".v14FundRow");
    if (row) row.remove();
    const rule = document.getElementById("futureFundRule");
    if (rule)
      rule.textContent = nextSeasonUnlockedV11()
        ? `已开放 ${y + 1} 赛车研究。所有车队在休赛期都会出现不同程度的数值衰减；提前研究越多，明年的基础越扎实。`
        : `R10 后开放 ${y + 1} 赛车研究。届时可以提前为下一代赛车打基础。`;
    const hint = document.getElementById("devSeasonHint");
    if (hint)
      hint.textContent =
        (state.devMode || "current") === "next"
          ? `这里消耗的是本赛季预算，成果会在赛季结束后的衰减结算后并入 ${y + 1} 赛车基线。`
          : `当前赛车升级会立即生效；赛季结束后所有车队都会出现一定程度衰减。`;
    let inline = document.getElementById("playerCarPerfInline");
    if (!inline) {
      inline = document.createElement("div");
      inline.id = "playerCarPerfInline";
      inline.className = "playerCarPerfInline";
      document
        .getElementById("playerCarSummary")
        .insertAdjacentElement("afterend", inline);
    }
    const perf = document.getElementById("performanceTable");
    if (perf) {
      inline.innerHTML = `<div class="relationhead"><div><h2 class="sectiontitle" style="margin-bottom:3px">赛车性能对比</h2><div class="small">与全场车队相比的当前实力排序。</div></div><div class="small">PERFORMANCE INDEX</div></div><div style="margin-top:10px">${perf.innerHTML}</div>`;
      const bottom = perf.closest(".card");
      if (bottom) bottom.style.display = "none";
    }
  };

  /* Stronger AI bias toward next year for smaller teams */

  /* New one-year market */
  renderContractsV10 = function () {
    ensureStateV14();
    const y = seasonYearV11();
    const open = marketWindowOpenV15();
    const signed = state.contract.nextTeam;
    const offers = generateMarketOffersV15(true);
    document.querySelector("#contracts .modulehead .kicker").textContent =
      "DRIVER MARKET";
    document.querySelector("#contracts .modulehead h1").textContent =
      `车手市场 · ${y + 1}`;
    const rank = driverRankV10();
    const history = (state.contract.history || []).slice(0, 6);
    if (!open) {
      document.getElementById("contractContent").innerHTML =
        `<div class="contractSimpleTop"><div class="contractCurrent"><div class="kicker">SUMMER BREAK MARKET</div><h2>市场尚未开放</h2><div class="small">一年一签制 · 夏休期开放 · 当前车手排名 P${rank}</div><div class="contractReality">到达夏休期后，你会收到两支车队的合同机会：一份更有野心，一份更稳妥；同时当前车队也会给出续约选项。成绩越好，签约成功率越高；大车队对成绩要求更高。</div><div class="forecastStrip"><div class="forecastBox"><span>开放时间</span><b>夏休期</b></div><div class="forecastBox"><span>当前状态</span><b>未开启</b></div><div class="forecastBox"><span>合同模式</span><b>一年一签</b></div></div></div><div class="card"><h2 class="sectiontitle">窗口说明</h2><div class="hint">模块在赛季中段以前会保持灰色。开放后，你可以在这里尝试续约或转会；如果到赛季结算时仍然没有拿到下一年的合同，生涯将结束并返回主菜单。</div></div></div><div class="contractClosedBox">距离市场开放还有 ${Math.max(0, 14 - state.round)} 站。<br>先用成绩把自己送进更好的谈判位置。</div>`;
      return;
    }
    const offerHtml = offers
      .map(
        (o) =>
          `<div class="contractOfferV15 ${o.type}"><div class="kicker">${o.title}</div><h3>${o.team}</h3><div class="small">${o.kind === "renew" ? "当前车队续约" : "一年合同"} · ${teamTierV15(teamRankV15(o.team))}</div><div class="contractOfferMeta"><div><span>成功率</span><b>${Math.round(o.chance * 100)}%</b></div><div><span>签约难度</span><b>${chanceLabelV15(o.chance)}</b></div></div><div class="contractTerms">${o.kind === "renew" ? "保留当前位置，尽量延续当前研发与队内关系。" : "以本赛季成绩为基础的正式报价。成绩越高，车队给你席位的意愿越强；顶级车队筛选也更苛刻。"}</div><button class="mini" ${signed || state.marketAttemptedV15[o.team] ? "disabled" : ""} onclick="attemptContractV15('${o.team}','${o.kind}')">${signed === o.team ? "已签约" : state.marketAttemptedV15[o.team] ? "已失败" : o.kind === "renew" ? "尝试续约" : "尝试签约"}</button></div>`,
      )
      .join("");
    document.getElementById("contractContent").innerHTML =
      `<div class="contractSimpleTop"><div class="contractCurrent"><div class="kicker">SUMMER BREAK MARKET</div><h2>${signed ? `已锁定 ${y + 1} · ${signed}` : "市场开放中"}</h2><div class="small">一年一签制 · 当前车手排名 P${rank}</div><div class="contractReality">系统会同时给你一份更高目标报价、一份更稳妥报价，以及当前车队的续约机会。高要求车手会更难签下顶级席位，但成绩越出色，成功率就越高。</div><div class="forecastStrip"><div class="forecastBox"><span>${y + 1} 去向</span><b>${signed || "未签约"}</b></div><div class="forecastBox"><span>当前状态</span><b>${signed ? "已完成" : "可谈判"}</b></div><div class="forecastBox"><span>合同年限</span><b>1 年</b></div></div></div><div class="card"><h2 class="sectiontitle">市场规则</h2><div class="hint">所有车手都按一年一签处理。AI 车手在年底也会重新续约或转会，因此围场阵容每年都可能变化。若你在赛季结算前仍未确定下赛季合同，游戏会在年度总结后结束。</div></div></div><div class="contractOfferGrid">${offerHtml}</div><div class="card contractLogV15"><div class="relationhead"><div><h2 class="sectiontitle" style="margin-bottom:3px">最近记录</h2><div class="small">签约成功或失败都会记录在这里。</div></div><div class="small">LOG</div></div>${history.length ? history.map((x) => `<div class="row">${x}</div>`).join("") : '<div class="row">还没有合同记录。</div>'}</div>`;
  };

  /* Season finale text and actions */
  const showSeasonFinaleV15Prev = showSeasonFinaleV10;
  showSeasonFinaleV10 = function () {
    ensureStateV14();
    showSeasonFinaleV15Prev();
    const research = Object.values(state.nextSeasonResearch || {})
      .reduce((a, b) => a + Number(b || 0), 0)
      .toFixed(1);
    const next = state.contract.nextTeam;
    const final = document.getElementById("finalContract");
    if (final)
      final.innerHTML = next
        ? `${seasonYearV11() + 1}：已与 <b>${next}</b> 达成一年合同。<br>下一代赛车研究累计 ${research} 点；休赛期所有车队都会出现一定衰减，提前研究越多，明年的基础越稳。`
        : `${seasonYearV11() + 1}：尚未获得合同或续约。<br>下一代赛车研究累计 ${research} 点，但由于没有确定下赛季席位，本次生涯将在这里结束并返回主菜单。`;
    const btn = document.getElementById("nextSeasonBtn");
    if (btn) {
      if (next) {
        btn.textContent = `进入 ${seasonYearV11() + 1} 赛季 →`;
        btn.onclick = function () {
          startNextSeasonV11();
        };
      } else {
        btn.textContent = "无合同 · 返回主菜单";
        btn.onclick = function () {
          goHomeV15();
        };
      }
    }
  };
  const renderSeasonV15Prev = renderSeasonV10;
  renderSeasonV10 = function () {
    ensureStateV14();
    renderSeasonV15Prev();
    if (seasonCompleteV14()) {
      const btn = document.querySelector("#seasonCompleteActions .primary");
      if (btn) {
        if (state.contract.nextTeam) {
          btn.textContent = `进入 ${seasonYearV11() + 1} 赛季 →`;
          btn.onclick = function () {
            startNextSeasonV11();
          };
        } else {
          btn.textContent = "无合同 · 返回主菜单";
          btn.onclick = function () {
            goHomeV15();
          };
        }
      }
    }
  };

  /* Season rollover */
  startNextSeasonV11 = function () {
    ensureStateV14();
    const nextY = seasonYearV11() + 1;
    if (!state.contract.nextTeam) {
      goHomeV15();
      return;
    }
    const nextTeam = state.contract.nextTeam;
    applySeasonDecayAndResearchV15();
    aiAssignContractsV15();
    const me = drivers.find((d) => d[0] === selected[0]);
    if (me) me[1] = nextTeam;
    selected[1] = nextTeam;
    state.seasonYear = nextY;
    state.round = 1;
    state.budget = TEAM_BUDGET_V11[selected[1]] || 32;
    state.projects = [];
    state.devMode = "current";
    state.nextSeasonFund = 0;
    state.nextSeasonResearch = {};
    CAR_ATTRS_V10.forEach((a) => (state.nextSeasonResearch[a] = 0));
    state.aiNextSeasonResearch = {};
    Object.keys(teams).forEach((t) => {
      state.aiNextSeasonResearch[t] = {};
      CAR_ATTRS_V10.forEach((a) => (state.aiNextSeasonResearch[t][a] = 0));
    });
    state.history = [];
    state.seasonResults = [];
    state.driverStandings = {};
    state.teamStandings = {};
    state.driverSeasonStats = {};
    drivers.forEach((d) => {
      state.driverStandings[d[0]] = 0;
      state.driverSeasonStats[d[0]] = {
        wins: 0,
        podiums: 0,
        poles: 0,
        dnfs: 0,
      };
    });
    Object.keys(teams).forEach((t) => (state.teamStandings[t] = 0));
    state.trainingUsed = false;
    state.prep = { round: 1, type: null, qual: 0, race: 0, control: 0 };
    state.teamWeekEvent = null;
    state.teamWeekModifier = 0;
    state.rivalry = {
      playerAhead: 0,
      teammateAhead: 0,
      orders: 0,
      clashes: 0,
      streak: 0,
    };
    state.contract = {
      nextTeam: null,
      signedRound: null,
      history: (state.contract.history || []).slice(0, 10),
    };
    state.marketOffersV15 = [];
    state.marketOfferRoundV15 = 0;
    state.marketAttemptedV15 = {};
    resetWeekend();
    const tm = teammateV10();
    state.teamRelation = tm
      ? Math.max(35, Math.min(82, relationshipBase(selected[0], tm[0])))
      : 60;
    ensureAITrainingV10(true);
    ensureTeamAffairsWeekV14();
    renderHub();
    autosave();
    raceTransition(
      `${nextY} SEASON`,
      `休赛期衰减与研究结算完成，围场完成新一轮洗牌。`,
      "NEW SEASON",
      "career",
    );
  };

  /* Hub module and status text */
  const renderHubV15Prev = renderHub;
  renderHub = function () {
    ensureStateV14();
    renderHubV15Prev();
    const status = document.getElementById("contractStatus");
    if (status)
      status.textContent = state.contract.nextTeam
        ? `已签 ${state.contract.nextTeam}`
        : marketWindowOpenV15()
          ? "市场开放"
          : "夏休未开";
    const card = document.querySelector(
      "#career .modules .module:nth-child(4)",
    );
    if (card) {
      card.classList.toggle("marketHot", marketWindowOpenV15());
      card.classList.toggle("marketCold", !marketWindowOpenV15());
      const p = card.querySelector("p");
      if (p)
        p.textContent = marketWindowOpenV15()
          ? "夏休期市场已开放：两支车队报价 + 当前车队续约，全部为一年合同。"
          : "夏休期车手市场将在赛季中段开放。开放后会出现两支车队报价与续约选项。";
    }
  };

  /* Ensure fresh state on career start / round advance */
  const startCareerV15Prev = startCareer;
  startCareer = function () {
    startCareerV15Prev();
    ensureStateV14();
    state.marketOffersV15 = [];
    state.marketOfferRoundV15 = 0;
    state.marketAttemptedV15 = {};
    state.contract = { nextTeam: null, signedRound: null, history: [] };
    renderHub();
    autosave();
  };
  const advanceRoundV15Prev = advanceRound;
  advanceRound = function () {
    advanceRoundV15Prev();
    if (selected) {
      ensureStateV14();
      if (marketWindowOpenV15() && !state.marketOffersV15.length)
        generateMarketOffersV15(true);
      renderHub();
      autosave();
    }
  };
  const restoreSnapshotV15Prev = restoreSnapshot;
  restoreSnapshot = function (data) {
    const ok = restoreSnapshotV15Prev(data);
    if (ok) {
      ensureStateV14();
      renderHub();
    }
    return ok;
  };
  setTimeout(() => {
    if (selected) {
      ensureStateV14();
    }
  }, 0);
  window.attemptContractV15 = attemptContractV15;
  window.goHomeV15 = goHomeV15;
})();

/* v16-script */

(function () {
  /* ---------- state / helpers ---------- */
  function zeroModsV16() {
    const o = {};
    CAR_ATTRS_V10.forEach((a) => (o[a] = 0));
    return o;
  }
  function ensureStateV16() {
    ensureStateV14();
    state.v16Version = 16;
    if (!state.weeklyCarModsV16) state.weeklyCarModsV16 = zeroModsV16();
    CAR_ATTRS_V10.forEach((a) => {
      if (state.weeklyCarModsV16[a] == null) state.weeklyCarModsV16[a] = 0;
    });
    if (!Array.isArray(state.relationHistoryV16)) state.relationHistoryV16 = [];
    if (!Array.isArray(state.teamEventHistoryV16))
      state.teamEventHistoryV16 = [];
    if (!Array.isArray(state.pendingOrderRelationV16))
      state.pendingOrderRelationV16 = [];
  }
  function cultureV16(team = selected?.[1]) {
    const p = TEAM_PRESTIGE_V10[team] || 72;
    return p >= 90 ? "big" : p >= 80 ? "mid" : "small";
  }
  function cultureLabelV16(team = selected?.[1]) {
    const c = cultureV16(team);
    return c === "big"
      ? "高竞争环境"
      : c === "mid"
        ? "中等竞争环境"
        : "合作倾向较高";
  }
  function initialRelationV16() {
    const tm = teammateV10(),
      pair = tm ? relationshipBase(selected[0], tm[0]) : 60,
      c = cultureV16();
    const culture = c === "big" ? 53 : c === "mid" ? 62 : 70;
    return Math.round(clampV14(culture + (pair - 60) * 0.22, 38, 82));
  }
  function signed1V16(n) {
    n = Number(n || 0);
    return `${n > 0 ? "+" : n < 0 ? "−" : "±"}${Math.abs(n).toFixed(1)}`;
  }
  function relationBenefitV16() {
    const r = state.teamRelation || 50;
    return {
      chance: clampV14(0.22 + r * 0.0065, 0.25, 0.86),
      magnitude: 1 + Math.floor(Math.max(0, r - 45) / 22),
    };
  }

  /* team trust no longer acts as a hidden R&D modifier */
  teamTrustCostPctV14 = function () {
    return 0;
  };
  teamTrustSuccessV14 = function () {
    return 0;
  };

  /* ---------- required weekly team event ---------- */
  const TEAM_EVENTS_V16 = [
    {
      title: "周五升级包只能选择一种设定方向",
      body: "工程组带来了两套互相冲突的赛道设定。你必须在比赛周末开始前决定重点，选中的方向只影响这一站。",
      choices: [
        {
          label: "优先高速效率",
          desc: "减少阻力并加强高速平台，但低速机械性能会被牺牲。",
          mods: { 空力效率: 1.7, 赛车平衡: 0.8, 机械抓地: -0.9 },
        },
        {
          label: "优先低速机械抓地",
          desc: "更适合慢弯和出弯，但会牺牲高速效率。",
          mods: { 机械抓地: 1.8, 轮胎管理: 0.7, 空力效率: -1.0 },
        },
        {
          label: "扩大冷却窗口",
          desc: "更稳定地完成长距离，代价是动力输出与车身效率。",
          mods: { "可靠性/冷却": 1.9, 动力单元: -0.8, 空力效率: -0.5 },
        },
      ],
    },
    {
      title: "动力单元部门提供三种比赛模式",
      body: "本周允许你们采用一套不同于基准程序的动力映射。每种选择都会把性能从一个区域转移到另一个区域。",
      choices: [
        {
          label: "短时高输出映射",
          desc: "排位和进攻阶段更有爆发力，但热负荷明显增加。",
          mods: { 动力单元: 2.0, "可靠性/冷却": -1.2, 轮胎管理: -0.4 },
        },
        {
          label: "热管理优先",
          desc: "降低热衰减和故障风险，但直道速度会下降。",
          mods: { "可靠性/冷却": 1.8, 动力单元: -1.0, 空力效率: 0.4 },
        },
        {
          label: "能量回收平衡方案",
          desc: "改善长距离效率，但机械抓地设定会更保守。",
          mods: { 动力单元: 0.9, 轮胎管理: 1.1, 机械抓地: -0.7 },
        },
      ],
    },
    {
      title: "底板高度窗口出现分歧",
      body: "模拟器显示两个不同的底板工作窗口。一个更快，一个更稳定，第三种方案偏向轮胎。",
      choices: [
        {
          label: "压低车身追求峰值下压力",
          desc: "空力效率更高，但底盘容错和可靠性下降。",
          mods: { 空力效率: 1.8, 赛车平衡: 0.7, "可靠性/冷却": -0.9 },
        },
        {
          label: "提高车身保证稳定平台",
          desc: "赛车更容易控制，但牺牲部分空气动力效率。",
          mods: { 赛车平衡: 1.7, "可靠性/冷却": 0.8, 空力效率: -1.0 },
        },
        {
          label: "围绕轮胎温度重新设定",
          desc: "长距离更友好，但单圈机械峰值降低。",
          mods: { 轮胎管理: 1.9, 赛车平衡: 0.6, 机械抓地: -0.8 },
        },
      ],
    },
    {
      title: "制动与前轴设定需要做最终取舍",
      body: "前轴温度与制动稳定性无法同时保持在最佳窗口，车队要求你确定比赛周末的优先级。",
      choices: [
        {
          label: "加强前轴响应",
          desc: "入弯更锐利，但后段轮胎压力会更大。",
          mods: { 赛车平衡: 1.6, 机械抓地: 0.8, 轮胎管理: -0.9 },
        },
        {
          label: "保护长距离轮胎",
          desc: "更稳定地跑长 stint，但初段响应降低。",
          mods: { 轮胎管理: 1.8, "可靠性/冷却": 0.6, 赛车平衡: -0.8 },
        },
        {
          label: "强化制动冷却",
          desc: "提升高负荷区稳定性，但空气动力效率略受损。",
          mods: { "可靠性/冷却": 1.6, 机械抓地: 0.7, 空力效率: -0.8 },
        },
      ],
    },
    {
      title: "后翼版本只够完整验证一套",
      body: "车队必须在比赛前锁定后翼版本。不同方案会改变直道、弯中稳定和轮胎消耗之间的平衡。",
      choices: [
        {
          label: "低阻力版本",
          desc: "直道效率更高，但弯中稳定性下降。",
          mods: { 空力效率: 1.9, 动力单元: 0.5, 赛车平衡: -1.0 },
        },
        {
          label: "高下压力版本",
          desc: "弯中更稳，但高速效率和轮胎负担有所损失。",
          mods: { 赛车平衡: 1.8, 机械抓地: 0.6, 空力效率: -0.9 },
        },
        {
          label: "保守通用版本",
          desc: "轮胎更容易控制，但不会拥有最强峰值。",
          mods: { 轮胎管理: 1.5, "可靠性/冷却": 0.8, 动力单元: -0.6 },
        },
      ],
    },
    {
      title: "赛车重量分配需要在封闭车检前确定",
      body: "工程组能把有限的调校余量集中到不同区域，但无法让每个指标同时变好。",
      choices: [
        {
          label: "偏向前端反应",
          desc: "赛车更愿意转向，但后轮更容易滑动。",
          mods: { 赛车平衡: 1.5, 空力效率: 0.6, 轮胎管理: -0.8 },
        },
        {
          label: "偏向后轴牵引",
          desc: "出弯更稳定，但高速转向响应下降。",
          mods: { 机械抓地: 1.7, 轮胎管理: 0.6, 赛车平衡: -0.8 },
        },
        {
          label: "保留可靠性余量",
          desc: "降低结构和温度风险，但整体峰值略低。",
          mods: { "可靠性/冷却": 1.9, 机械抓地: -0.6, 空力效率: -0.5 },
        },
      ],
    },
  ];
  function jitterModsV16(mods) {
    const out = {};
    Object.entries(mods).forEach(([k, v]) => {
      let n = v + (Math.random() * 0.32 - 0.16);
      if (v > 0) n = Math.max(0.3, n);
      if (v < 0) n = Math.min(-0.3, n);
      out[k] = round1V14(n);
    });
    return out;
  }
  function ensureTeamEventV16() {
    ensureStateV16();
    if (
      state.teamEventV16 &&
      state.teamEventV16.round === state.round &&
      state.teamEventV16.version === 16
    )
      return;
    const base =
      TEAM_EVENTS_V16[Math.floor(Math.random() * TEAM_EVENTS_V16.length)];
    const evt = JSON.parse(JSON.stringify(base));
    evt.choices = evt.choices.map((c) => ({
      ...c,
      mods: jitterModsV16(c.mods),
    }));
    state.teamEventV16 = {
      version: 16,
      round: state.round,
      title: evt.title,
      body: evt.body,
      choices: evt.choices,
      resolved: false,
      choice: null,
    };
    state.weeklyCarModsV16 = zeroModsV16();
  }
  function teamEventReadyV16() {
    ensureTeamEventV16();
    return !!state.teamEventV16.resolved;
  }
  teamEventReadyV12 = function () {
    return teamEventReadyV16();
  };
  function effectHTMLV16(mods) {
    return Object.entries(mods)
      .map(
        ([a, v]) =>
          `<small class="${v > 0 ? "up" : "down"}">${a} ${signed1V16(v)}</small>`,
      )
      .join("");
  }
  function resolveTeamEventV16(idx) {
    ensureTeamEventV16();
    const e = state.teamEventV16,
      c = e.choices[idx];
    if (e.resolved || !c) return;
    state.weeklyCarModsV16 = zeroModsV16();
    Object.entries(c.mods).forEach(
      ([a, v]) => (state.weeklyCarModsV16[a] = Number(v)),
    );
    e.resolved = true;
    e.choice = idx;
    e.outcome = `${c.label}：${Object.entries(c.mods)
      .map(([a, v]) => `${a} ${signed1V16(v)}`)
      .join(" / ")}`;
    state.teamEventHistoryV16.unshift({
      round: state.round,
      title: e.title,
      choice: c.label,
      mods: { ...c.mods },
    });
    state.teamEventHistoryV16 = state.teamEventHistoryV16.slice(0, 8);
    renderMedia();
    renderHub();
    autosave();
    showToastV14("本周车队事务已完成 · 比赛日已解锁");
  }
  window.resolveTeamEventV16 = resolveTeamEventV16;

  /* ---------- temporary car performance ---------- */
  retirementChanceV10 = function (d, strategy = "normal", extra = 0) {
    const rel = effectivePartV16(d[1], "可靠性/冷却");
    let p = 0.012 + Math.max(0, 76 - rel) * 0.0032;
    p *= state.weekend.attritionFactor || 1;
    if (strategy === "aggressive") p += 0.026;
    if (strategy === "conservative") p -= 0.006;
    p += extra;
    return Math.max(0.004, Math.min(0.24, p));
  };
  attrRankHTMLV12 = function (phase) {
    const demand = currentDemandV10(phase),
      mx = [...demand].sort((a, b) => b - a)[1] ?? 0;
    return `<div class="attrRankGrid">${CAR_ATTRS_V10.map((a, i) => {
      const v = effectivePartV16(selected[1], a),
        sorted = Object.keys(teams).sort(
          (x, y) => effectivePartV16(y, a) - effectivePartV16(x, a),
        ),
        rank = sorted.indexOf(selected[1]) + 1,
        focus = demand[i] >= mx,
        mod = effectiveModV16(a);
      return `<div class="attrRankItem ${focus ? "focus" : ""}"><span>${a}</span><b>${v.toFixed(1)}<em>P${rank} / ${Object.keys(teams).length}</em></b><small>${mod ? `本周 ${signed1V16(mod)}` : focus ? "本场重点属性" : "本场次级影响"}</small></div>`;
    }).join("")}</div>`;
  };

  /* ---------- R&D: fix second-round crash + remaining rounds ---------- */
  renderDevelopment = function () {
    ensureStateV16();
    completeProjects();
    const t = teams[selected[1]],
      mode = state.devMode || "current",
      full = state.projects.length >= 2,
      y = seasonYearV11();
    document.getElementById("devBudget").textContent =
      `€ ${state.budget.toFixed(1)}M`;
    document.getElementById("devSlotStatus").textContent =
      `${state.projects.length} / 2`;
    document.getElementById("devTrustCost").textContent = "标准";
    document.getElementById("devTrustCostNote").textContent =
      "车队事务不再提供隐藏研发加成，项目收益只由项目档位与兑现结果决定。";
    document.getElementById("playerCarTeamLabel").textContent =
      `${selected[1]} · 六项能力与单项排名`;
    document.getElementById("playerCarSummary").innerHTML =
      `<div class="car6grid">${CAR_ATTRS_V10.map((a) => `<div class="car6"><span>${a}</span><b>${Number(t.parts[a]).toFixed(1)}</b><small class="attrRankSub">当前全场 P${attrRankV14(a)}</small></div>`).join("")}</div>`;
    const b1 = document.getElementById("devModeCurrent"),
      b2 = document.getElementById("devModeNext");
    b1?.classList.toggle("active", mode === "current");
    if (b2) {
      b2.classList.toggle("active", mode === "next");
      b2.disabled = !nextSeasonUnlockedV11();
      b2.textContent = `${y + 1} 赛车`;
    }
    document.getElementById("devTargetLabel").textContent =
      mode === "next" ? `${y + 1} CAR RESEARCH` : `${y} CURRENT CAR`;
    document.getElementById("devSeasonHint").textContent =
      mode === "next"
        ? `R10 后可直接研究 ${y + 1} 赛车。研究成果会在休赛期衰减结算后并入下一年基线。`
        : `当前赛车升级完成后立即生效；赛季结束后所有车队都会出现一定程度的自然衰减。`;
    const rule = document.getElementById("futureFundRule");
    if (rule)
      rule.textContent = nextSeasonUnlockedV11()
        ? `已开放 ${y + 1} 赛车研究。强队的休赛期衰减通常略大，小车队如果提前投入下一年，有机会明显缩小差距。`
        : `R10 后开放 ${y + 1} 赛车研究。`;
    const row = document.querySelector(".v14FundRow");
    if (row) row.style.display = "none";
    document.getElementById("devParts").innerHTML =
      (full
        ? '<div class="locknote">两个研发槽都已占用。完成任一项目后再立项。</div>'
        : "") +
      CAR_ATTRS_V10.map((a) => {
        const v = devTargetValueV14(a, mode),
          dup = state.projects.some(
            (p) => p.part === a && p.seasonTarget === mode,
          ),
          rank =
            mode === "current"
              ? `当前全场 P${attrRankV14(a)}`
              : `研究累计 +${Number(state.nextSeasonResearch[a] || 0).toFixed(1)}`;
        return `<div class="devPartV14"><div class="devPartTop"><div><h3>${a}</h3><div class="small">${V14_DEV_IMPACTS[a]}</div></div><div class="devPartValue">${v.toFixed(1)}</div></div><div class="devPartMeta"><span>${rank}</span><span>${dup ? "同类项目进行中" : mode === "next" ? "下一代基线" : "当前赛车"}</span></div><div class="devPartAction"><small>${dup ? "等待当前项目结束后才能继续这个方向。" : "快速 1–2 / 标准 1–3 / 大型 2–4。"}</small><button class="mini" ${full || dup ? "disabled" : ""} onclick="openDevProjectV14('${a}')">${dup ? "研发中" : "制定项目"}</button></div></div>`;
      }).join("");
    renderProjects();
    renderPerformanceTable();
    let inline = document.getElementById("playerCarPerfInline");
    if (!inline) {
      inline = document.createElement("div");
      inline.id = "playerCarPerfInline";
      inline.className = "playerCarPerfInline";
      document
        .getElementById("playerCarSummary")
        .insertAdjacentElement("afterend", inline);
    }
    const perf = document.getElementById("performanceTable");
    if (perf) {
      inline.innerHTML = `<div class="relationhead"><div><h2 class="sectiontitle" style="margin-bottom:3px">赛车性能对比</h2><div class="small">当前基础赛车实力，不包含本周车队事务的临时修正。</div></div><div class="small">PERFORMANCE INDEX</div></div><div style="margin-top:10px">${perf.innerHTML}</div>`;
      const bottom = perf.closest(".card");
      if (bottom) bottom.style.display = "none";
    }
  };

  /* ---------- driver relationship: race choices + performance + random post-race change ---------- */
  makeTeamOrderEventV10 = function () {
    const tm = teammateV10();
    if (!tm) return null;
    const c = cultureV16(),
      close =
        Math.abs(
          (state.driverStandings[selected[0]] || 0) -
            (state.driverStandings[tm[0]] || 0),
        ) < 25;
    let prob = c === "big" ? 0.44 : c === "mid" ? 0.27 : 0.18;
    if (state.round > 5 && close) prob += 0.11;
    if (Math.random() > prob) return null;
    const rb = relationBenefitV16();
    return {
      special: true,
      title: "车队指令：双车进入同一策略窗口",
      scene: `你和 ${tm[0]} 正在同一集团。当前关系为「${relationStatusV10()}」(${Math.round(state.teamRelation)}/100)。关系越好，配合后得到位置回报、策略补偿或更干净交换的概率越高；关系差时同一个指令更容易造成时间损失。`,
      choices: [
        [
          "立即配合交换位置",
          "接受车队安排。关系好时，后续被换回或得到策略补偿的概率最高。",
          76,
          0.05,
          "车队指令",
          { order: true, orderV16: "cooperate" },
        ],
        [
          "接受，但要求“追不上就换回来”",
          "保留明确条件。关系好时车队和队友更可能兑现承诺。",
          82,
          0.1,
          "条件式配合",
          { order: true, orderV16: "conditional" },
        ],
        [
          "拒绝让车，继续比赛",
          "短期保住赛道位置，但会明显恶化关系；关系越差，发生强硬攻防的风险越高。",
          90,
          0.2,
          "强硬拒绝",
          { order: true, orderV16: "refuse", clash: true },
        ],
      ],
    };
  };
  const resolveRaceEventV16Prev = resolveRaceEvent;
  resolveRaceEvent = function (choiceIndex) {
    const ev = state.weekend?.eventQueue?.[state.weekend.eventIndex],
      raw = ev?.choices?.[choiceIndex],
      effect = raw?.[5];
    if (effect?.orderV16) {
      ensureStateV16();
      const rel = state.teamRelation || 50,
        c = cultureV16(),
        b = relationBenefitV16();
      let delta = 0,
        bonus = false;
      if (effect.orderV16 === "cooperate") {
        delta = c === "small" ? 4 : c === "mid" ? 3 : 2;
        bonus = Math.random() < b.chance;
        effect.posMod = bonus
          ? -Math.max(1, b.magnitude - 1)
          : rel < 42
            ? 2
            : 1;
        raw[2] += bonus ? 3 + b.magnitude * 2 : 0;
        effect.dnfRisk = 0;
      } else if (effect.orderV16 === "conditional") {
        delta = c === "small" ? 2 : 1;
        bonus = Math.random() < b.chance * 0.82;
        effect.posMod = bonus
          ? -Math.max(1, b.magnitude - 1)
          : rel < 38
            ? 2
            : 0;
        raw[2] += bonus ? 2 + b.magnitude * 1.6 : 0;
        effect.dnfRisk = rel < 40 ? 0.02 : 0.005;
      } else {
        delta = -(c === "big" ? 6 : c === "mid" ? 5 : 4);
        bonus = false;
        effect.posMod = 0;
        effect.dnfRisk = rel >= 70 ? 0.025 : rel >= 50 ? 0.05 : 0.09;
        raw[3] = rel >= 70 ? 0.18 : rel >= 50 ? 0.26 : 0.38;
      }
      effect.relation = delta;
      state.pendingOrderRelationV16.push({ label: raw[0], delta, bonus });
    }
    return resolveRaceEventV16Prev(choiceIndex);
  };
  updateRivalryAfterRaceV10 = function (field) {
    ensureStateV16();
    const tm = teammateV10();
    if (!tm) return;
    const me = field.find((x) => x.name === selected[0]),
      other = field.find((x) => x.name === tm[0]);
    if (!me || !other) return;
    const orderDelta = state.pendingOrderRelationV16.reduce(
        (s, x) => s + (x.delta || 0),
        0,
      ),
      postOrder = state.teamRelation,
      startRel = postOrder - orderDelta;
    if (me.dnf && !other.dnf) {
      state.rivalry.teammateAhead++;
      state.rivalry.streak =
        state.rivalry.streak <= 0 ? state.rivalry.streak - 1 : -1;
    } else if (other.dnf && !me.dnf) {
      state.rivalry.playerAhead++;
      state.rivalry.streak =
        state.rivalry.streak >= 0 ? state.rivalry.streak + 1 : 1;
    } else if (me.position < other.position) {
      state.rivalry.playerAhead++;
      state.rivalry.streak =
        state.rivalry.streak >= 0 ? state.rivalry.streak + 1 : 1;
    } else {
      state.rivalry.teammateAhead++;
      state.rivalry.streak =
        state.rivalry.streak <= 0 ? state.rivalry.streak - 1 : -1;
    }
    const c = cultureV16();
    let perf = 0;
    const gap = Math.abs(me.position - other.position),
      bothPoints =
        !me.dnf && !other.dnf && me.position <= 10 && other.position <= 10;
    if (me.dnf !== other.dnf) perf -= 1;
    if (!me.dnf && !other.dnf && gap <= 2)
      perf += c === "big" ? -2 : c === "mid" ? -1 : 0;
    if (bothPoints) perf += c === "small" ? 2 : c === "mid" ? 1 : 0;
    if (Math.abs(state.rivalry.streak) >= 3) perf += c === "big" ? -2 : -1;
    if (!me.dnf && !other.dnf && gap >= 7) perf += c === "big" ? -1 : 0;
    let rnd;
    if (c === "big") {
      const a = [-3, -2, -2, -1, -1, 0, 1];
      rnd = a[Math.floor(Math.random() * a.length)];
    } else if (c === "mid") {
      const a = [-2, -1, 0, 0, 1, 2];
      rnd = a[Math.floor(Math.random() * a.length)];
    } else {
      const a = [-1, 0, 0, 1, 1, 2, 3];
      rnd = a[Math.floor(Math.random() * a.length)];
    }
    state.teamRelation = clampV14(postOrder + perf + rnd, 0, 100);
    const total = state.teamRelation - startRel,
      orderText = state.pendingOrderRelationV16.length
        ? `让车 ${orderDelta > 0 ? "+" : ""}${orderDelta}`
        : "无让车变化";
    state.relationHistoryV16.unshift({
      round: state.round,
      race: currentRace()?.[1] || "",
      from: startRel,
      to: state.teamRelation,
      total,
      detail: `${orderText} · 成绩对比 ${perf > 0 ? "+" : ""}${perf} · 赛后随机 ${rnd > 0 ? "+" : ""}${rnd}`,
    });
    state.relationHistoryV16 = state.relationHistoryV16.slice(0, 10);
    state.pendingOrderRelationV16 = [];
  };

  /* ---------- team affairs UI ---------- */
  renderMedia = function () {
    ensureStateV16();
    ensureTeamEventV16();
    const e = state.teamEventV16,
      tm = teammateV10(),
      v = state.teamRelation || 50,
      ready = e.resolved;
    const g = document.querySelector(
      ".affairSummaryGrid .affairGauge:first-child",
    );
    if (g) g.classList.add("required");
    document.querySelector(
      ".affairSummaryGrid .affairGauge:first-child .small",
    ).textContent = "REQUIRED TEAM OPS · 本周车队事务";
    const s = document.getElementById("teamTrustStatus");
    s.textContent = ready ? "本周已完成" : "本周未完成";
    s.className = `status ${ready ? "done" : "pending"}`;
    document.getElementById("teamTrustValue").textContent = ready
      ? "比赛日与一键模拟已解锁"
      : "必须先完成本周事件，才能进入比赛日";
    const tb = document.getElementById("teamTrustBar");
    tb.style.width = ready ? "100%" : "18%";
    tb.style.background = ready ? "#159a5b" : "#e10600";
    document.getElementById("teamTrustEffect").textContent = ready
      ? `已选择：${e.choices[e.choice]?.label || ""}`
      : "等待你的赛前决策";
    const ex = document.querySelector(
      ".affairSummaryGrid .affairGauge:first-child .affairExplain",
    );
    if (ex) {
      ex.textContent =
        "车队事务每周固定刷新 1 项。三个选项都会让某些赛车性能上升、另一些下降；临时修正只持续当前比赛周末。";
    }
    document.getElementById("teamRelationStatus").textContent =
      relationStatusV10(v);
    document.getElementById("teamRelationPair").textContent =
      `${selected[0]} ↔ ${tm?.[0] || "队友"} · ${Math.round(v)}/100 · ${cultureLabelV16()}`;
    document.getElementById("teamRelationBar").style.width = v + "%";
    const b = relationBenefitV16();
    document.getElementById("teamRelationEffect").textContent =
      `让车协作回报概率约 ${Math.round(b.chance * 100)}% · 关系越高，交换位置后的补偿更容易兑现且幅度更大`;
    document.getElementById("rivalStats").innerHTML =
      `<div><span>你领先队友</span><b>${state.rivalry.playerAhead}</b></div><div><span>队友领先你</span><b>${state.rivalry.teammateAhead}</b></div><div><span>让车 / 冲突</span><b>${state.rivalry.orders} / ${state.rivalry.clashes}</b></div>`;
    document.getElementById("affairsWeekMeta").textContent =
      `R${String(state.round).padStart(2, "0")} · 每周 1 项 · 必须完成后才能比赛`;
    document.getElementById("teamAffairsEvents").innerHTML =
      `<div class="affairEvent ${ready ? "resolved" : ""}"><div class="affairEventHead"><div><span class="affairType trust">车队事件</span><h3>${e.title}</h3></div><span class="small">${ready ? "已完成" : "必须处理"}</span></div><p>${e.body}</p>${ready ? `<div class="affairOutcome">${e.outcome}</div><div class="affairRequiredNote done">这些修正只对当前比赛周末有效。进入下一站后自动恢复赛车基础数值，并刷新新的车队事务。</div>` : `<div class="affairRequiredNote">未完成本周事务，比赛日与一键模拟保持锁定。每个方案都有得有失，不存在纯粹的全属性加成。</div><div class="affairChoices">${e.choices.map((c, i) => `<div class="affairChoice" onclick="resolveTeamEventV16(${i})"><b>${c.label}</b><span>${c.desc}</span><div class="v16Effects">${effectHTMLV16(c.mods)}</div></div>`).join("")}</div>`}</div>`;
    const title = document.querySelector(
      ".affairBottomGrid .card:first-child .sectiontitle",
    );
    if (title) title.textContent = "本周赛车临时修正";
    const desc = document.querySelector(
      ".affairBottomGrid .card:first-child .small",
    );
    if (desc) desc.textContent = "仅当前比赛有效，下一站自动恢复基础性能。";
    const impact = document.querySelector(".affairImpactGrid");
    if (impact)
      ((impact.className = "affairModsGrid"),
        (impact.innerHTML = CAR_ATTRS_V10.map((a) => {
          const m = ready ? effectiveModV16(a) : 0;
          return `<div class="affairModCell"><span>${a}</span><b class="${m > 0 ? "up" : m < 0 ? "down" : "flat"}">${signed1V16(m)}</b></div>`;
        }).join("")));
    const htitle = document.querySelector(
      ".affairBottomGrid .card:nth-child(2) .sectiontitle",
    );
    if (htitle) htitle.textContent = "车手关系变化";
    const hdesc = document.querySelector(
      ".affairBottomGrid .card:nth-child(2) .small",
    );
    if (hdesc)
      hdesc.textContent =
        "只由让车选择、比赛成绩对比与每场赛后的随机气氛变化产生。";
    document.getElementById("affairsHistory").innerHTML = state
      .relationHistoryV16.length
      ? state.relationHistoryV16
          .slice(0, 6)
          .map(
            (h) =>
              `<div class="relationHistoryV16"><b>R${String(h.round).padStart(2, "0")} · ${h.race} · ${h.from} → ${h.to}</b><br>${h.detail} · 合计 ${h.total > 0 ? "+" : ""}${h.total}</div>`,
          )
          .join("")
      : '<div class="affairEmpty" style="padding:14px">完成第一场比赛后，这里会记录关系变化。</div>';
  };

  /* ---------- mandatory gate / hub badges ---------- */
  showRaceGateV12 = function () {
    renderMedia();
    showView("media");
    showToastV14("先完成本周车队事务，比赛日才会解锁");
  };
  const quickSimV16Prev = quickSimCurrentRound;
  quickSimCurrentRound = function () {
    if (!teamEventReadyV16()) {
      showRaceGateV12();
      return;
    }
    return quickSimV16Prev();
  };
  const renderHubV16Prev = renderHub;
  renderHub = function () {
    renderHubV16Prev();
    ensureStateV16();
    ensureTeamEventV16();
    const ready = teamEventReadyV16();
    const teamCard = document.querySelector(
      "#career .modules .module:nth-child(2)",
    );
    if (teamCard) {
      let badge = teamCard.querySelector(".mandatoryBadge");
      if (!badge) {
        badge = document.createElement("div");
        badge.className = "mandatoryBadge";
        teamCard.appendChild(badge);
      }
      badge.className = `mandatoryBadge ${ready ? "done" : "pending"}`;
      badge.textContent = ready ? "本周已完成" : "本周未完成";
      const p = teamCard.querySelector("p");
      if (p)
        p.textContent =
          "每周必须处理 1 项车队事件。选择会临时提高或降低赛车属性；车手关系由比赛本身决定。";
    }
    const mood = document.getElementById("teamMood");
    if (mood)
      mood.textContent = ready
        ? `${relationStatusV10()} · 已完成`
        : "本周未完成";
    const devCard = document.querySelector(
      "#career .modules .module:nth-child(1)",
    );
    if (devCard) {
      let badge = devCard.querySelector(".devRemainBadge");
      if (state.projects.length) {
        const remain = Math.min(
          ...state.projects.map((p) => Math.max(0, p.finish - state.round)),
        );
        if (!badge) {
          badge = document.createElement("div");
          badge.className = "devRemainBadge";
          devCard.appendChild(badge);
        }
        badge.textContent = `最近项目还剩 ${remain} 站`;
        badge.style.display = "block";
        const dc = document.getElementById("devCount");
        if (dc) dc.textContent = `${state.projects.length} / 2 · ${remain}站`;
      } else if (badge) badge.style.display = "none";
    }
    const race = document.getElementById("raceModuleCard"),
      btn = document.getElementById("quickSimBtn"),
      desc = document.getElementById("raceGateDesc");
    if (race) {
      race.classList.toggle("locked", !ready);
      race.classList.toggle("ready", ready);
    }
    if (btn) {
      btn.disabled = !ready;
      btn.textContent = ready ? "一键模拟本轮" : "先完成车队事务";
    }
    if (desc)
      desc.textContent = ready
        ? "车队事务已完成，比赛日已解锁。"
        : "完成本周车队事务后解锁比赛日。";
  };

  /* ---------- round / career lifecycle ---------- */
  const startCareerV16Prev = startCareer;
  startCareer = function () {
    startCareerV16Prev();
    ensureStateV16();
    state.teamRelation = initialRelationV16();
    state.teamEventV16 = null;
    state.weeklyCarModsV16 = zeroModsV16();
    state.relationHistoryV16 = [];
    state.teamEventHistoryV16 = [];
    state.pendingOrderRelationV16 = [];
    ensureTeamEventV16();
    renderHub();
    autosave();
  };
  const advanceRoundV16Prev = advanceRound;
  advanceRound = function () {
    const before = state.round;
    advanceRoundV16Prev();
    if (selected && state.round !== before) {
      ensureStateV16();
      state.teamEventV16 = null;
      state.weeklyCarModsV16 = zeroModsV16();
      state.pendingOrderRelationV16 = [];
      ensureTeamEventV16();
      renderHub();
      autosave();
    }
  };
  const startNextSeasonV16Prev = startNextSeasonV11;
  startNextSeasonV11 = function () {
    const before = seasonYearV11();
    startNextSeasonV16Prev();
    if (selected && seasonYearV11() > before) {
      ensureStateV16();
      state.teamRelation = initialRelationV16();
      state.teamEventV16 = null;
      state.weeklyCarModsV16 = zeroModsV16();
      state.relationHistoryV16 = [];
      state.pendingOrderRelationV16 = [];
      ensureTeamEventV16();
      renderHub();
      autosave();
    }
  };
  const restoreSnapshotV16Prev = restoreSnapshot;
  restoreSnapshot = function (data) {
    const ok = restoreSnapshotV16Prev(data);
    if (ok) {
      ensureStateV16();
      if (!state.teamEventV16 || state.teamEventV16.round !== state.round)
        ensureTeamEventV16();
      renderHub();
    }
    return ok;
  };

  setTimeout(() => {
    if (selected) {
      ensureStateV16();
      ensureTeamEventV16();
    }
  }, 0);
})();

/* v17-script */

(function () {
  /* ---------- Balance baseline ---------- */
  const OLD_BUDGETS_V16 = {
    Mercedes: 40,
    Ferrari: 40,
    McLaren: 39,
    "Red Bull Racing": 38,
    "Racing Bulls": 30,
    Alpine: 32,
    "Haas F1 Team": 28,
    Williams: 31,
    Audi: 45,
    "Aston Martin": 42,
    Cadillac: 45,
  };
  const BUDGETS_V17 = {
    Mercedes: 60,
    Ferrari: 65,
    "Red Bull Racing": 58,
    McLaren: 56,
    "Aston Martin": 55,
    Audi: 52,
    Cadillac: 51,
    Williams: 49,
    Alpine: 48,
    "Racing Bulls": 47,
    "Haas F1 Team": 45,
  };
  Object.assign(TEAM_BUDGET_V11, BUDGETS_V17);
  Object.entries(BUDGETS_V17).forEach(([n, b]) => {
    if (baseTeams[n]) baseTeams[n].budget = b;
    if (teams[n]) teams[n].budget = b;
  });

  /* Red Bull remains fourth by average index, but its chassis-side package is no longer artificially weak. PU stays 82. */
  const RB_V17 = [82, 73, 73, 72, 72, 74];
  CAR_BASE_V11["Red Bull Racing"] = RB_V17.slice();
  CAR_BASE_V10["Red Bull Racing"] = RB_V17.slice();
  if (baseTeams["Red Bull Racing"]) {
    CAR_ATTRS_V10.forEach(
      (a, i) => (baseTeams["Red Bull Racing"].parts[a] = RB_V17[i]),
    );
    recalcTeamOvr(baseTeams["Red Bull Racing"]);
  }
  if (teams["Red Bull Racing"]) {
    CAR_ATTRS_V10.forEach(
      (a, i) => (teams["Red Bull Racing"].parts[a] = RB_V17[i]),
    );
    recalcTeamOvr(teams["Red Bull Racing"]);
  }

  function ensureStateV17() {
    ensureStateV14();
    state.v17Version = 17;
    if (!state.weeklyCarModsV16) {
      state.weeklyCarModsV16 = {};
      CAR_ATTRS_V10.forEach((a) => (state.weeklyCarModsV16[a] = 0));
    }
    CAR_ATTRS_V10.forEach((a) => {
      if (state.weeklyCarModsV16[a] == null) state.weeklyCarModsV16[a] = 0;
    });
    if (!Array.isArray(state.relationHistoryV16)) state.relationHistoryV16 = [];
    if (!Array.isArray(state.teamEventHistoryV16))
      state.teamEventHistoryV16 = [];
    if (!Array.isArray(state.pendingOrderRelationV16))
      state.pendingOrderRelationV16 = [];
    if (!Array.isArray(state.marketOffersV17)) state.marketOffersV17 = [];
    if (state.marketOfferRoundV17 == null) state.marketOfferRoundV17 = 0;
    if (state.contractAttemptRoundV17 == null)
      state.contractAttemptRoundV17 = 0;
    if (!state.contract)
      state.contract = { nextTeam: null, signedRound: null, history: [] };
    if (!Array.isArray(state.contract.history)) state.contract.history = [];
  }
  function rnd1V17(a, b) {
    return round1V14(randV14(a, b));
  }

  /* ---------- R&D economy ---------- */
  const DEV_CATALOG_V17 = {
    quick: {
      key: "quick",
      label: "快速升级",
      duration: 1,
      cost: 2.0,
      minGain: 0.5,
      maxGain: 1.5,
      desc: "一站完成，适合快速修补短板。",
    },
    standard: {
      key: "standard",
      label: "标准研发",
      duration: 3,
      cost: 4.5,
      minGain: 2.5,
      maxGain: 5.0,
      desc: "三站周期，投入和收益最均衡。",
    },
    major: {
      key: "major",
      label: "大型升级",
      duration: 5,
      cost: 7.4,
      minGain: 6.0,
      maxGain: 8.0,
      desc: "五站周期，真正改变赛车上限。",
    },
  };
  devProjectCatalogV14 = function (part, target) {
    return Object.values(DEV_CATALOG_V17).map((x) => ({ ...x, target }));
  };
  openDevProjectV14 = function (part) {
    ensureStateV17();
    const target = state.devMode || "current",
      opts = devProjectCatalogV14(part, target),
      dup = state.projects.some(
        (p) => p.part === part && p.seasonTarget === target,
      ),
      full = state.projects.length >= 2,
      remain = calendar.length - state.round;
    document.getElementById("modalTitle").textContent =
      `${part} · ${target === "next" ? "下一代研究" : "当前赛车"}`;
    document.getElementById("modalBody").innerHTML =
      `<div class="driverdetail"><div class="kicker">R&D PROGRAM</div><div class="driverdetailname">选择研发规模</div><div class="hint">研发完成后，提升值直接在对应区间内结算。最低 €45M 的车队预算也足够覆盖 4 次大型升级 + 6 次快速升级。</div>${opts
        .map((o) => {
          const tooLate = o.duration > remain,
            disabled = full || dup || state.budget < o.cost || tooLate;
          const reason = full
            ? "两个研发槽都已占用"
            : dup
              ? "这个部件已有同方向项目"
              : state.budget < o.cost
                ? "研发预算不足"
                : tooLate
                  ? "本赛季剩余轮次不足"
                  : "";
          return `<div class="devProjectOption ${disabled ? "disabled" : ""}" ${disabled ? "" : `onclick="startDevProjectV14('${part}','${o.key}')"`}><div class="devProjectOptionHead"><h3>${o.label}</h3><strong>€${o.cost.toFixed(1)}M</strong></div><div class="devOptionMeta"><span>${o.duration} 站</span><span class="projectV17Range">+${o.minGain.toFixed(1)} ～ +${o.maxGain.toFixed(1)}</span></div><small style="display:block;margin-top:7px;color:#6f7986">${reason || o.desc}</small></div>`;
        })
        .join("")}</div>`;
    document.getElementById("overlay").classList.add("open");
  };
  startDevProjectV14 = function (part, key) {
    ensureStateV17();
    const target = state.devMode || "current",
      o = DEV_CATALOG_V17[key];
    if (!o) return;
    if (
      state.projects.length >= 2 ||
      state.projects.some(
        (p) => p.part === part && p.seasonTarget === target,
      ) ||
      state.budget < o.cost ||
      o.duration > calendar.length - state.round
    ) {
      closeOverlay();
      renderDevelopment();
      return;
    }
    state.budget = round1V14(state.budget - o.cost);
    state.projects.push({
      v17: true,
      part,
      seasonTarget: target,
      projectType: o.key,
      label: o.label,
      cost: o.cost,
      start: state.round,
      finish: state.round + o.duration,
      duration: o.duration,
      minGain: o.minGain,
      maxGain: o.maxGain,
    });
    closeOverlay();
    renderDevelopment();
    renderHub();
    autosave();
    showToastV14(`${part} · ${o.label} 已立项`);
  };
  completeProjects = function () {
    if (!selected || !state.projects) return;
    ensureStateV17();
    const t = teams[selected[1]],
      done = state.projects.filter((p) => p.finish <= state.round);
    if (!done.length) return;
    done.forEach((p) => {
      let gain;
      if (p.v17) gain = rnd1V17(p.minGain, p.maxGain);
      else if (p.v14) {
        gain = rnd1V17(p.minGain ?? 0.5, p.maxGain ?? 1.5);
      } else gain = Number(p.gain || 1);
      if (p.seasonTarget === "next")
        state.nextSeasonResearch[p.part] = round1V14(
          (state.nextSeasonResearch[p.part] || 0) + gain,
        );
      else if (t.parts[p.part] != null)
        t.parts[p.part] = round1V14(Math.min(98, t.parts[p.part] + gain));
      state.devHistory.unshift({
        round: state.round,
        part: p.part,
        target: p.seasonTarget || "current",
        label: p.label || "研发项目",
        gain,
        ok: true,
      });
      state.aiDevNews.unshift(
        `${selected[1]}：${p.seasonTarget === "next" ? "下一代" : "当前"} ${p.part} 完成 · +${gain.toFixed(1)}`,
      );
    });
    state.projects = state.projects.filter((p) => p.finish > state.round);
    state.devHistory = state.devHistory.slice(0, 8);
    recalcTeamOvr(t);
    state.aiDevNews = state.aiDevNews.slice(0, 12);
  };
  renderProjects = function () {
    ensureStateV17();
    const box = document.getElementById("projects");
    if (!box) return;
    if (!state.projects.length)
      box.innerHTML =
        '<div class="hint">暂无项目。两个研发槽可以并行使用；R10 后同样可以把项目切换到下一代赛车。</div>';
    else
      box.innerHTML = state.projects
        .map((p, i) => {
          const dur = Math.max(1, p.duration || p.finish - p.start),
            progress = clampV14(((state.round - p.start) / dur) * 100, 0, 100),
            left = Math.max(0, p.finish - state.round);
          return `<div class="projectV14 ${p.seasonTarget === "next" ? "future" : ""}"><b>${p.part} · ${p.label || "研发项目"} <span class="projectSlot">SLOT ${i + 1}</span></b><small>R${String(p.start).padStart(2, "0")} → R${String(p.finish).padStart(2, "0")} · <span class="projectV17Range">还剩 ${left} 站</span> · 完成 +${Number(p.minGain || 0).toFixed(1)}～+${Number(p.maxGain || 0).toFixed(1)}</small><div class="projectProgress"><i style="width:${progress}%"></i></div></div>`;
        })
        .join("");
  };

  const renderDevelopmentV17Prev = renderDevelopment;
  renderDevelopment = function () {
    ensureStateV17();
    renderDevelopmentV17Prev();
    const budgetCard = document.querySelector(
      "#development .devOverviewCard:first-child",
    );
    if (budgetCard && !budgetCard.querySelector(".devBudgetGuaranteeV17"))
      budgetCard.insertAdjacentHTML(
        "beforeend",
        '<div class="devBudgetGuaranteeV17">成本基准：快速 €2.0M · 标准 €4.5M · 大型 €7.4M</div>',
      );
    const hint = document.getElementById("devSeasonHint");
    if (hint)
      hint.textContent =
        (state.devMode || "current") === "next"
          ? `${seasonYearV11() + 1} 赛车研究：成果会在休赛期衰减之后并入新车基础。`
          : `当前赛车：1站快速 / 3站标准 / 5站大型，完成后立即生效。`;
    renderProjects();
  };

  function budgetRefillV17(rank) {
    const table = [0, 10, 9, 8, 7, 6, 5, 4.5, 4, 3.5, 3, 2.5];
    return table[Math.max(1, Math.min(11, rank || 11))] || 2.5;
  }

  /* ---------- Expanded mandatory team-event pool ---------- */
  function pV17() {
    return rnd1V17(2, 3.5);
  }
  function nV17() {
    return -rnd1V17(1, 1.5);
  }
  function materializeModsV17(spec) {
    const o = {};
    Object.entries(spec).forEach(([a, s]) => (o[a] = s > 0 ? pV17() : nV17()));
    return o;
  }
  const TEAM_EVENTS_V17 = [
    {
      id: "positive_windtunnel",
      tone: "positive",
      title: "风洞相关性数据超出预期",
      body: "周中的相关性复核比模型预期更好，车队得到了一次免费优化窗口。你只需要决定把这份额外收益集中在哪里。",
      choices: [
        {
          label: "集中优化空气动力平台",
          desc: "把额外窗口用于高速与连续弯。",
          spec: { 空力效率: 1, 赛车平衡: 1 },
        },
        {
          label: "集中优化机械平台",
          desc: "优先改善慢弯与轮胎使用。",
          spec: { 机械抓地: 1, 轮胎管理: 1 },
        },
        {
          label: "集中优化耐久与部署",
          desc: "把机会留给长距离稳定性。",
          spec: { 动力单元: 1, "可靠性/冷却": 1 },
        },
      ],
    },
    {
      id: "positive_parts",
      tone: "positive",
      title: "备用升级件提前通过质检",
      body: "原本计划下一站才投入的备用零件提前通过耐久验证，本周可以免费启用一套强化方案。",
      choices: [
        {
          label: "启用底板与前翼组合",
          desc: "主要增加空力与平衡。",
          spec: { 空力效率: 1, 赛车平衡: 1 },
        },
        {
          label: "启用悬挂与制动组合",
          desc: "主要增加机械抓地与轮胎管理。",
          spec: { 机械抓地: 1, 轮胎管理: 1 },
        },
        {
          label: "启用冷却与能源组合",
          desc: "主要增加动力与可靠性。",
          spec: { 动力单元: 1, "可靠性/冷却": 1 },
        },
      ],
    },
    {
      id: "negative_freight",
      tone: "negative",
      title: "运输过程中一批赛车部件受损",
      body: "车库开箱时发现一批备件出现轻微损伤，无法按原计划全部使用。你必须决定哪一部分性能损失最容易接受。",
      choices: [
        {
          label: "保住空气动力套件",
          desc: "机械与轮胎侧承担损失。",
          spec: { 机械抓地: -1, 轮胎管理: -1 },
        },
        {
          label: "保住底盘机械套件",
          desc: "空力和平衡侧承担损失。",
          spec: { 空力效率: -1, 赛车平衡: -1 },
        },
        {
          label: "保住比赛可靠性",
          desc: "动力峰值与空气动力效率略降。",
          spec: { 动力单元: -1, 空力效率: -1 },
        },
      ],
    },
    {
      id: "negative_sensor",
      tone: "negative",
      title: "关键传感器数据出现异常",
      body: "周五前的系统检查发现部分传感器读数不稳定。车队能隔离问题，但无论如何都会失去一部分性能窗口。",
      choices: [
        {
          label: "限制动力输出",
          desc: "优先保证数据和温度安全。",
          spec: { 动力单元: -1, 赛车平衡: -1 },
        },
        {
          label: "限制车身高度窗口",
          desc: "减少底板风险。",
          spec: { 空力效率: -1, 机械抓地: -1 },
        },
        {
          label: "限制长距离攻击性",
          desc: "减少热负荷与轮胎压力。",
          spec: { 轮胎管理: -1, "可靠性/冷却": -1 },
        },
      ],
    },
    {
      id: "mixed_setup",
      tone: "mixed",
      title: "两套赛道设定只能保留一套",
      body: "模拟器给出两种互相冲突的方向，第三套则偏向比赛稳定性。必须在周末开始前锁定。",
      choices: [
        {
          label: "高速效率方案",
          desc: "更快的高速平台，牺牲低速机械性能。",
          spec: { 空力效率: 1, 赛车平衡: 1, 机械抓地: -1 },
        },
        {
          label: "低速牵引方案",
          desc: "改善慢弯和出弯，牺牲空气动力效率。",
          spec: { 机械抓地: 1, 轮胎管理: 1, 空力效率: -1 },
        },
        {
          label: "长距离稳定方案",
          desc: "提高可靠性和轮胎表现，牺牲动力峰值。",
          spec: { "可靠性/冷却": 1, 轮胎管理: 1, 动力单元: -1 },
        },
      ],
    },
    {
      id: "mixed_power",
      tone: "mixed",
      title: "动力单元部门开放特殊映射",
      body: "本周允许采用一套非常规动力程序，但所有方案都会把性能从一个区域转移到另一个区域。",
      choices: [
        {
          label: "高输出映射",
          desc: "更强的部署与直道表现，增加热负担。",
          spec: { 动力单元: 1, 空力效率: 1, "可靠性/冷却": -1 },
        },
        {
          label: "高回收效率映射",
          desc: "改善比赛能源和轮胎节奏，牺牲机械峰值。",
          spec: { 动力单元: 1, 轮胎管理: 1, 机械抓地: -1 },
        },
        {
          label: "热管理映射",
          desc: "长距离更稳定，牺牲部分输出。",
          spec: { "可靠性/冷却": 1, 赛车平衡: 1, 动力单元: -1 },
        },
      ],
    },
    {
      id: "mixed_floor",
      tone: "mixed",
      title: "底板工作高度出现新的甜区",
      body: "新数据表明底板可以在三个不同高度窗口工作，但无法同时兼顾峰值、稳定与轮胎。",
      choices: [
        {
          label: "最低车高",
          desc: "追求峰值空力，减少路肩与机械容错。",
          spec: { 空力效率: 1, 赛车平衡: 1, 机械抓地: -1 },
        },
        {
          label: "中等车高",
          desc: "提升机械抓地和稳定性，牺牲部分空力。",
          spec: { 机械抓地: 1, 赛车平衡: 1, 空力效率: -1 },
        },
        {
          label: "高车高保护轮胎",
          desc: "长距离更好，但动力效率下降。",
          spec: { 轮胎管理: 1, "可靠性/冷却": 1, 动力单元: -1 },
        },
      ],
    },
    {
      id: "mixed_brakes",
      tone: "mixed",
      title: "制动冷却与前轴响应发生冲突",
      body: "更激进的前轴设定会提高单圈速度，但温度与轮胎管理会变得更困难。",
      choices: [
        {
          label: "强化前轴响应",
          desc: "入弯更锐利，轮胎压力更大。",
          spec: { 赛车平衡: 1, 机械抓地: 1, 轮胎管理: -1 },
        },
        {
          label: "强化制动冷却",
          desc: "更适合长距离，牺牲空气动力效率。",
          spec: { "可靠性/冷却": 1, 轮胎管理: 1, 空力效率: -1 },
        },
        {
          label: "保留低阻力风道",
          desc: "直道与空力效率更好，机械抓地下降。",
          spec: { 动力单元: 1, 空力效率: 1, 机械抓地: -1 },
        },
      ],
    },
    {
      id: "mixed_wing",
      tone: "mixed",
      title: "后翼只够验证一个比赛版本",
      body: "三种后翼都能工作，但分别偏向直线、弯中或轮胎。车队必须提前选定本周方向。",
      choices: [
        {
          label: "低阻力版本",
          desc: "直线更快，弯中稳定性下降。",
          spec: { 空力效率: 1, 动力单元: 1, 赛车平衡: -1 },
        },
        {
          label: "高下压力版本",
          desc: "弯中更强，可靠性冷却余量下降。",
          spec: { 赛车平衡: 1, 机械抓地: 1, "可靠性/冷却": -1 },
        },
        {
          label: "轮胎友好版本",
          desc: "长距离更稳定，牺牲直线效率。",
          spec: { 轮胎管理: 1, "可靠性/冷却": 1, 空力效率: -1 },
        },
      ],
    },
    {
      id: "mixed_weight",
      tone: "mixed",
      title: "重量分配获得一次额外调整机会",
      body: "工程组可以明显改变前后轴动态，但任何偏置都会让另一项性能受损。",
      choices: [
        {
          label: "前轴优先",
          desc: "加强转向与空力响应，后轮管理变差。",
          spec: { 赛车平衡: 1, 空力效率: 1, 轮胎管理: -1 },
        },
        {
          label: "后轴优先",
          desc: "提升牵引和轮胎稳定，削弱高速平衡。",
          spec: { 机械抓地: 1, 轮胎管理: 1, 赛车平衡: -1 },
        },
        {
          label: "结构安全优先",
          desc: "提高耐久与机械稳定，牺牲空力峰值。",
          spec: { "可靠性/冷却": 1, 机械抓地: 1, 空力效率: -1 },
        },
      ],
    },
    {
      id: "mixed_tyre",
      tone: "mixed",
      title: "轮胎供应商更新了本周压力建议",
      body: "新的最低压力窗口改变了最佳设定，车队需要重新取舍单圈、长距离和机械平台。",
      choices: [
        {
          label: "围绕单圈暖胎",
          desc: "提高机械与平衡，牺牲长距离胎耗。",
          spec: { 机械抓地: 1, 赛车平衡: 1, 轮胎管理: -1 },
        },
        {
          label: "围绕长距离管理",
          desc: "改善轮胎和可靠性，牺牲空力峰值。",
          spec: { 轮胎管理: 1, "可靠性/冷却": 1, 空力效率: -1 },
        },
        {
          label: "围绕低压阻力",
          desc: "直线与动力效率更好，机械抓地下降。",
          spec: { 动力单元: 1, 空力效率: 1, 机械抓地: -1 },
        },
      ],
    },
  ];
  function buildTeamEventV17() {
    let pool = TEAM_EVENTS_V17.filter((e) => e.id !== state.lastTeamEventIdV17);
    if (!pool.length) pool = TEAM_EVENTS_V17;
    const base = pool[Math.floor(Math.random() * pool.length)],
      evt = JSON.parse(JSON.stringify(base));
    evt.choices = evt.choices.map((c) => ({
      ...c,
      mods: materializeModsV17(c.spec),
    }));
    state.lastTeamEventIdV17 = evt.id;
    state.teamEventV16 = {
      version: 16,
      v17: true,
      id: evt.id,
      tone: evt.tone,
      round: state.round,
      title: evt.title,
      body: evt.body,
      choices: evt.choices,
      resolved: false,
      choice: null,
    };
    state.weeklyCarModsV16 = {};
    CAR_ATTRS_V10.forEach((a) => (state.weeklyCarModsV16[a] = 0));
  }
  function ensureTeamEventV17(force = false) {
    ensureStateV17();
    const e = state.teamEventV16;
    if (!force && e && e.round === state.round && e.v17) return;
    if (!force && e && e.round === state.round && e.resolved) {
      e.v17 = true;
      e.tone = e.tone || "mixed";
      return;
    }
    buildTeamEventV17();
  }
  window.ensureTeamEventV17 = ensureTeamEventV17;

  const renderMediaV17Prev = renderMedia;
  renderMedia = function () {
    ensureTeamEventV17();
    renderMediaV17Prev();
    const e = state.teamEventV16;
    const note = document.querySelector(
      "#teamAffairsEvents .affairRequiredNote",
    );
    if (note && !e.resolved)
      note.textContent =
        "本周可能刷出纯利好、纯利空或性能取舍事件。正向单项约 +2.0～+3.5，负向单项约 −1.0～−1.5；必须选择一个方案后才能比赛。";
    const tag = document.querySelector("#teamAffairsEvents .affairType");
    if (tag) {
      tag.textContent =
        e.tone === "positive"
          ? "利好事件"
          : e.tone === "negative"
            ? "负面事件"
            : "性能取舍";
      tag.insertAdjacentHTML(
        "afterend",
        `<span class="eventToneV17 ${e.tone}">${e.tone === "positive" ? "PURE +" : e.tone === "negative" ? "PURE −" : "MIXED"}</span>`,
      );
    }
    const rel = document.getElementById("teamRelationEffect");
    if (rel && state.relationHistoryV16?.length) {
      const h = state.relationHistoryV16[0];
      rel.textContent = `让车协作回报概率约 ${Math.round((0.22 + (state.teamRelation || 50) * 0.0065) * 100)}% · 上站关系 ${h.total > 0 ? "+" : ""}${h.total}`;
    }
  };

  /* ---------- One contract attempt per Grand Prix + confirmation ---------- */
  function marketOpenV17() {
    return (
      !!selected &&
      state.round >= 14 &&
      state.round <= calendar.length &&
      !seasonCompleteV14()
    );
  }
  function teamOrderV17() {
    return Object.keys(teams).sort(
      (a, b) =>
        (state.teamStandings[b] || 0) - (state.teamStandings[a] || 0) ||
        (teams[b]?.ovr || 0) - (teams[a]?.ovr || 0),
    );
  }
  function teamRankV17(team) {
    return teamOrderV17().indexOf(team) + 1;
  }
  function contractChanceV17(team, kind) {
    const rank = driverRankV10(),
      pts = state.driverStandings[selected[0]] || 0,
      wins = state.driverSeasonStats[selected[0]]?.wins || 0,
      tRank = teamRankV17(team),
      cur = teamRankV17(selected[1]),
      ovr = selected[2] || 80;
    const performance =
      (12 - rank) * 0.045 +
      Math.min(0.23, pts / 380) +
      Math.min(0.12, wins * 0.04);
    let base =
      kind === "renew" ? 0.72 : tRank <= 3 ? 0.18 : tRank <= 6 ? 0.35 : 0.52;
    if (kind !== "renew") {
      const jump = cur - tRank;
      if (jump > 0) base -= jump * 0.055;
      if (jump < 0) base += Math.min(0.13, Math.abs(jump) * 0.03);
      base -= ovr >= 90 ? 0.06 : ovr >= 87 ? 0.04 : ovr >= 84 ? 0.02 : 0;
    } else base += 0.08;
    return clampV14(base + performance, 0.15, 0.94);
  }
  function generateOffersV17() {
    ensureStateV17();
    if (!marketOpenV17()) {
      state.marketOffersV17 = [];
      return [];
    }
    if (
      state.marketOffersV17.length &&
      state.marketOfferRoundV17 === state.round
    )
      return state.marketOffersV17;
    const order = teamOrderV17(),
      current = selected[1],
      ci = Math.max(0, order.indexOf(current)),
      rank = driverRankV10();
    let high = order.filter((t, i) => t !== current && i < ci);
    if (!high.length)
      high = order.filter((t, i) => t !== current && i <= Math.min(3, ci + 2));
    if (rank > 10) high = high.slice(-Math.min(3, high.length));
    const best =
      high[Math.floor(Math.random() * high.length)] ||
      order.find((t) => t !== current);
    let safe = order.filter(
      (t, i) =>
        t !== current &&
        t !== best &&
        i >= Math.max(0, ci - 1) &&
        i <= Math.min(order.length - 1, ci + 4),
    );
    if (!safe.length) safe = order.filter((t) => t !== current && t !== best);
    const second =
      safe[Math.floor(Math.random() * safe.length)] ||
      order.find((t) => t !== current && t !== best);
    state.marketOffersV17 = [
      { team: best, kind: "team", type: "best", title: "更高目标" },
      { team: second, kind: "team", type: "safe", title: "稳妥选择" },
      { team: current, kind: "renew", type: "renew", title: "续约" },
    ].map((o) => ({ ...o, chance: contractChanceV17(o.team, o.kind) }));
    state.marketOfferRoundV17 = state.round;
    return state.marketOffersV17;
  }
  function chanceTextV17(c) {
    return c >= 0.78
      ? "很高"
      : c >= 0.62
        ? "较高"
        : c >= 0.45
          ? "中等"
          : "偏低";
  }
  function openContractConfirmV17(team, kind) {
    ensureStateV17();
    if (!marketOpenV17() || state.contract.nextTeam) return;
    if (state.contractAttemptRoundV17 === state.round) {
      showToastV14("本场大奖赛已经尝试过一次合同 · 下站再谈");
      return;
    }
    const chance = contractChanceV17(team, kind);
    document.getElementById("modalTitle").textContent = "确认合同谈判";
    document.getElementById("modalBody").innerHTML =
      `<div class="contractConfirmV17"><div class="kicker">ONE ATTEMPT · THIS GRAND PRIX</div><h2>${kind === "renew" ? "续约" : "签约"} · ${team}</h2><p>确认后会立刻进行一次谈判判定。无论成功还是失败，本场大奖赛期间都不能再尝试其他合同；失败后需要等到下一站。</p><div class="contractConfirmMeta"><div><span>成功概率</span><b>${Math.round(chance * 100)}%</b></div><div><span>难度</span><b>${chanceTextV17(chance)}</b></div></div><div class="contractConfirmActions"><button class="btn" onclick="closeOverlay()">取消</button><button class="btn primary" onclick="confirmContractAttemptV17('${String(team).replace(/'/g, "\\'")}','${kind}')">确认尝试</button></div></div>`;
    document.getElementById("overlay").classList.add("open");
  }
  function confirmContractAttemptV17(team, kind) {
    ensureStateV17();
    if (
      state.contractAttemptRoundV17 === state.round ||
      state.contract.nextTeam
    ) {
      closeOverlay();
      return;
    }
    state.contractAttemptRoundV17 = state.round;
    const chance = contractChanceV17(team, kind),
      ok = Math.random() < chance;
    if (ok) {
      state.contract.nextTeam = team;
      state.contract.signedRound = state.round;
      state.contract.history.unshift(
        `R${String(state.round).padStart(2, "0")} · ${kind === "renew" ? "续约成功" : "签约成功"} · ${team}`,
      );
      showToastV14(`合同成功 · ${team}`);
    } else {
      state.contract.history.unshift(
        `R${String(state.round).padStart(2, "0")} · 谈判失败 · ${team}`,
      );
      showToastV14(`${team} 谈判失败 · 下一站可再次尝试`);
    }
    closeOverlay();
    renderContractsV10();
    renderHub();
    autosave();
  }
  renderContractsV10 = function () {
    ensureStateV17();
    const y = seasonYearV11(),
      open = marketOpenV17(),
      signed = state.contract.nextTeam,
      used = state.contractAttemptRoundV17 === state.round,
      rank = driverRankV10();
    document.querySelector("#contracts .modulehead .kicker").textContent =
      "DRIVER MARKET";
    document.querySelector("#contracts .modulehead h1").textContent =
      `车手市场 · ${y + 1}`;
    if (!open) {
      document.getElementById("contractContent").innerHTML =
        `<div class="contractV17Head"><div><div class="kicker">SUMMER BREAK</div><h2>市场尚未开放</h2><p>一年一签。夏休期开启后每站只能尝试一次合同，失败后必须等到下一场大奖赛。</p></div><div class="contractV17State"><span>当前排名</span><b>P${rank}</b></div></div><div class="contractClosedBox">距离市场开放还有 ${Math.max(0, 14 - state.round)} 站。</div>`;
      return;
    }
    const offers = generateOffersV17();
    const lock =
      used && !signed
        ? `<div class="contractRoundLockV17">本场大奖赛的合同尝试已经用完。下一站市场会重新允许一次尝试。</div>`
        : "";
    document.getElementById("contractContent").innerHTML =
      `<div class="contractV17Head"><div><div class="kicker">SUMMER BREAK MARKET</div><h2>${signed ? `已确定 ${y + 1} · ${signed}` : "本周合同选择"}</h2><p>两支外部车队 + 当前车队续约。每个大奖赛周末只允许一次正式尝试。</p></div><div class="contractV17State"><span>当前排名</span><b>P${rank}</b></div></div>${lock}<div class="contractOfferGridV17">${offers.map((o) => `<div class="contractOfferV17 ${o.type}"><div class="kicker">${o.title}</div><h3>${o.team}</h3><p>${o.kind === "renew" ? "留在当前项目继续一年。" : "根据你本赛季表现给出的一年席位。越靠前的车队对成绩要求越高。"}</p><div class="contractChanceV17"><span>成功率 · ${chanceTextV17(o.chance)}</span><b>${Math.round(o.chance * 100)}%</b></div><button class="mini" ${signed || used ? "disabled" : ""} onclick="openContractConfirmV17('${String(o.team).replace(/'/g, "\\'")}','${o.kind}')">${signed === o.team ? "已签约" : used ? "本周已尝试" : o.kind === "renew" ? "尝试续约" : "尝试签约"}</button></div>`).join("")}</div>`;
  };
  window.openContractConfirmV17 = openContractConfirmV17;
  window.confirmContractAttemptV17 = confirmContractAttemptV17;
  window.attemptContractV15 = openContractConfirmV17;

  /* ---------- Hub / UI simplification ---------- */
  function optimizeUIV17() {
    const tools = document.querySelector("#career .careerTools");
    if (tools && !tools.querySelector(".seasonShortcutV17"))
      tools.insertAdjacentHTML(
        "afterbegin",
        '<button class="mini seasonShortcutV17" onclick="openModule(\'season\')">积分榜</button>',
      );
    const media = document.querySelector("#media .wrap"),
      summary = document.querySelector("#media .affairSummaryGrid"),
      panel = document.querySelector("#media .affairsPanel");
    if (media && summary && panel && summary.previousElementSibling !== panel)
      media.insertBefore(panel, summary);
  }
  const renderHubV17Prev = renderHub;
  renderHub = function () {
    ensureStateV17();
    ensureTeamEventV17();
    renderHubV17Prev();
    optimizeUIV17();
    const dev = document.querySelector("#career .modules .module:nth-child(1)");
    if (dev) {
      let badge = dev.querySelector(".devRemainBadge");
      if (state.projects.length) {
        const remain = Math.min(
          ...state.projects.map((p) => Math.max(0, p.finish - state.round)),
        );
        if (!badge) {
          badge = document.createElement("div");
          badge.className = "devRemainBadge";
          dev.appendChild(badge);
        }
        badge.textContent = `${state.projects.length} 项 · 最近 ${remain} 站`;
        badge.style.display = "block";
      } else if (badge) badge.style.display = "none";
    }
    const market = document.querySelector(
      "#career .modules .module:nth-child(4)",
    );
    if (market) {
      market.classList.toggle("marketHot", marketOpenV17());
      market.classList.toggle("marketCold", !marketOpenV17());
      const st = document.getElementById("contractStatus");
      if (st)
        st.textContent = state.contract.nextTeam
          ? `已签 ${state.contract.nextTeam}`
          : marketOpenV17()
            ? state.contractAttemptRoundV17 === state.round
              ? "本周已尝试"
              : "市场开放"
            : "夏休未开";
    }
    const budgetSmall = document.querySelector(
      "#career .hubtop .card:nth-child(2) .small:last-child",
    );
    if (budgetSmall) {
      const r = state.lastBudgetRefillV17;
      if (r && r.year === seasonYearV11())
        budgetSmall.textContent = `基础 €${r.base}M + 上年P${r.rank}回补 €${r.bonus}M`;
      else budgetSmall.textContent = "每年按车队基准 + 上赛季成绩回补";
    }
  };

  /* ---------- Season rollover: refill next year's research budget by prior team result ---------- */
  const startNextSeasonV17Prev = startNextSeasonV11;
  startNextSeasonV11 = function () {
    ensureStateV17();
    const before = seasonYearV11(),
      target = state.contract?.nextTeam,
      order = teamOrderV17(),
      rank = target ? order.indexOf(target) + 1 : 11;
    startNextSeasonV17Prev();
    if (selected && seasonYearV11() > before) {
      const base = BUDGETS_V17[selected[1]] || 45,
        bonus = budgetRefillV17(rank);
      state.budget = round1V14(base + bonus);
      state.lastBudgetRefillV17 = { year: seasonYearV11(), rank, base, bonus };
      state.marketOffersV17 = [];
      state.marketOfferRoundV17 = 0;
      state.contractAttemptRoundV17 = 0;
      ensureTeamEventV17(true);
      renderHub();
      autosave();
      showToastV14(
        `${seasonYearV11()} 研发预算 €${state.budget.toFixed(1)}M · 上年P${rank}回补 €${bonus.toFixed(1)}M`,
      );
    }
  };

  const showSeasonFinaleV17Prev = showSeasonFinaleV10;
  showSeasonFinaleV10 = function () {
    ensureStateV17();
    showSeasonFinaleV17Prev();
    const target = state.contract?.nextTeam;
    if (target) {
      const order = teamOrderV17(),
        rank = order.indexOf(target) + 1,
        base = BUDGETS_V17[target] || 45,
        bonus = budgetRefillV17(rank),
        el = document.getElementById("finalContract");
      if (el)
        el.insertAdjacentHTML(
          "beforeend",
          `<br>预计 ${seasonYearV11() + 1} 研发预算：€${(base + bonus).toFixed(1)}M（${target} 基础 €${base}M + 上年车队P${rank}回补 €${bonus.toFixed(1)}M）。`,
        );
    }
  };

  /* ---------- lifecycle / migration ---------- */
  const startCareerV17Prev = startCareer;
  startCareer = function () {
    startCareerV17Prev();
    ensureStateV17();
    state.marketOffersV17 = [];
    state.marketOfferRoundV17 = 0;
    state.contractAttemptRoundV17 = 0;
    state.lastBudgetRefillV17 = null;
    ensureTeamEventV17(true);
    renderHub();
    autosave();
  };
  const advanceRoundV17Prev = advanceRound;
  advanceRound = function () {
    const before = state.round;
    advanceRoundV17Prev();
    if (selected && state.round !== before) {
      ensureStateV17();
      ensureTeamEventV17(true);
      state.marketOffersV17 = [];
      state.marketOfferRoundV17 = 0;
      renderHub();
      autosave();
    }
  };
  const restoreSnapshotV17Prev = restoreSnapshot;
  restoreSnapshot = function (data) {
    const ok = restoreSnapshotV17Prev(data);
    if (ok) {
      ensureStateV17();
      if ((data?.version || 0) < 17) {
        const delta =
          (BUDGETS_V17[selected[1]] || 45) -
          (OLD_BUDGETS_V16[selected[1]] || 0);
        state.budget = round1V14((state.budget || 0) + Math.max(0, delta));
        const rb = teams["Red Bull Racing"];
        if (rb) {
          CAR_ATTRS_V10.forEach(
            (a, i) =>
              (rb.parts[a] = Math.max(Number(rb.parts[a] || 0), RB_V17[i])),
          );
          recalcTeamOvr(rb);
        }
      }
      ensureTeamEventV17(false);
      renderHub();
      autosave();
    }
    return ok;
  };
  snapshot = function () {
    ensureStateV17();
    return {
      version: 17,
      savedAt: new Date().toISOString(),
      selected: selected ? selected[0] : null,
      state: JSON.parse(JSON.stringify(state)),
      teams: JSON.parse(JSON.stringify(teams)),
    };
  };

  optimizeUIV17();
  setTimeout(() => {
    if (selected) {
      ensureStateV17();
      ensureTeamEventV17(false);
    }
  }, 0);
})();

/* v18-script */

(function () {
  openDevProjectV14 = function (part) {
    const target = state.devMode || "current",
      opts = devProjectCatalogV14(part, target),
      dup = state.projects.some(
        (p) => p.part === part && p.seasonTarget === target,
      ),
      full = state.projects.length >= 2,
      remain = calendar.length - state.round;
    document.getElementById("modalTitle").textContent =
      `${part} · ${target === "next" ? "下一代研究" : "当前赛车"}`;
    document.getElementById("modalBody").innerHTML =
      `<div class="driverdetail"><div class="kicker">R&D PROGRAM</div><div class="driverdetailname">选择研发规模</div>${opts
        .map((o) => {
          const tooLate = o.duration > remain,
            disabled = full || dup || state.budget < o.cost || tooLate,
            reason = full
              ? "两个研发槽都已占用"
              : dup
                ? "这个部件已有同方向项目"
                : state.budget < o.cost
                  ? "研发预算不足"
                  : tooLate
                    ? "本赛季剩余轮次不足"
                    : "";
          return `<div class="devProjectOption ${disabled ? "disabled" : ""}" ${disabled ? "" : `onclick="startDevProjectV14('${part}','${o.key}')"`}><div class="devProjectOptionHead"><h3>${o.label}</h3><strong>€${o.cost.toFixed(1)}M</strong></div><div class="devOptionMeta"><span>${o.duration} 站</span><span class="projectV17Range">+${o.minGain.toFixed(1)} ～ +${o.maxGain.toFixed(1)}</span></div>${reason ? `<small style="display:block;margin-top:6px;color:#8d5b58">${reason}</small>` : ""}</div>`;
        })
        .join("")}</div>`;
    document.getElementById("overlay").classList.add("open");
  };
  window.openDevProjectV14 = openDevProjectV14;

  function installFullSeasonButtonV37() {
    const tools = document.querySelector("#career .careerTools");
    if (!tools) return;
    let btn = tools.querySelector(".fullSeasonSimBtn");
    if (!btn) {
      const save = [...tools.querySelectorAll("button")].find(
        (b) => b.textContent.trim() === "存档",
      );
      btn = document.createElement("button");
      btn.className = "mini fullSeasonSimBtn";
      btn.textContent = "模拟完整赛季";
      if (save) save.insertAdjacentElement("afterend", btn);
      else tools.appendChild(btn);
    }
    btn.onclick = () => {
      const fn =
        window.runFullSeasonV36 ||
        window.runFullSeasonV27 ||
        window.runFullSeasonV18;
      if (typeof fn === "function") fn();
    };
    btn.disabled =
      !!state?.fullSeasonSimulatingV18 ||
      (typeof seasonCompleteV14 === "function" && selected
        ? seasonCompleteV14()
        : false);
  }
  window.installFullSeasonButtonV37 = installFullSeasonButtonV37;
  const renderHubBeforeFullSeasonButtonV37 = renderHub;
  renderHub = function () {
    const r = renderHubBeforeFullSeasonButtonV37.apply(this, arguments);
    installFullSeasonButtonV37();
    return r;
  };
  window.renderHub = renderHub;
  installFullSeasonButtonV37();
  setTimeout(installFullSeasonButtonV37, 0);
})();

/* v19-script */

(function () {
  /* ----------------------- custom career ----------------------- */
  let customConfigV19 = null;
  const ACTIVE_NUMBERS_V19 = new Set(
    Object.values(driverProfiles)
      .map((p) => Number(p.number))
      .filter(Number.isFinite),
  );
  const CUSTOM_MATE_POOL_V19 = [
    { name: "Mika Aalto", nation: "芬兰" },
    { name: "Theo Laurent", nation: "法国" },
    { name: "Luca Bianchi", nation: "意大利" },
    { name: "Noah Keller", nation: "德国" },
    { name: "Elias Berg", nation: "瑞典" },
    { name: "Rafael Costa", nation: "巴西" },
    { name: "Mateo Vega", nation: "西班牙" },
    { name: "Jack Rowe", nation: "英国" },
  ];
  function cleanTextV19(s, max = 28) {
    return String(s || "")
      .replace(/[<>"'&]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, max);
  }
  function freeNumberV19(exclude) {
    for (let n = 2; n <= 99; n++)
      if (!ACTIVE_NUMBERS_V19.has(n) && n !== Number(exclude)) return n;
    return 99;
  }
  function removeCustomSpecialsV19() {
    for (let i = specialEvents.length - 1; i >= 0; i--)
      if (specialEvents[i]._customV19) specialEvents.splice(i, 1);
  }
  function cleanupCustomRosterV19() {
    if (!customConfigV19) return;
    const c = customConfigV19;
    for (let i = drivers.length - 1; i >= 0; i--)
      if (drivers[i][0] === c.playerName || drivers[i][0] === c.mateName)
        drivers.splice(i, 1);
    delete driverProfiles[c.playerName];
    delete driverProfiles[c.mateName];
    delete personnel[c.teamName];
    delete teams[c.teamName];
    delete baseTeams[c.teamName];
    delete CAR_BASE_V10[c.teamName];
    delete CAR_BASE_V11[c.teamName];
    delete TEAM_BUDGET_V11[c.teamName];
    delete TEAM_PRESTIGE_V10[c.teamName];
    if (typeof DRIVER_CONTRACTS_V11 === "object") {
      delete DRIVER_CONTRACTS_V11[c.playerName];
      delete DRIVER_CONTRACTS_V11[c.mateName];
    }
    removeCustomSpecialsV19();
    customConfigV19 = null;
  }
  function installCustomRosterV19(raw, fromSave = false) {
    const c = JSON.parse(JSON.stringify(raw));
    if (customConfigV19) cleanupCustomRosterV19();
    const player = [
      c.playerName,
      c.teamName,
      c.ovr,
      c.exp,
      c.rac,
      c.awa,
      c.pac,
    ];
    const mate = [
      c.mateName,
      c.teamName,
      c.mateOvr || 76,
      c.mateExp || 52,
      c.mateRac || 76,
      c.mateAwa || 74,
      c.matePac || 77,
    ];
    drivers.push(player, mate);
    driverProfiles[c.playerName] = {
      number: c.number,
      nation: c.nation,
      debut: 2026,
      season2025: "自定义车手 · 2026 F1首秀",
      titles: 0,
      wins: 0,
      podiums: 0,
      poles: 0,
      best: "自定义生涯车手",
    };
    driverProfiles[c.mateName] = {
      number: c.mateNumber,
      nation: c.mateNation,
      debut: 2026,
      season2025: "自定义队友 · 2026 F1首秀",
      titles: 0,
      wins: 0,
      podiums: 0,
      poles: 0,
      best: "自定义车队首发车手",
    };
    const base = (c.carBase || [61, 49, 48, 50, 49, 60])
      .slice()
      .map((v) => Math.max(45, Math.min(99, Number(v) || 50)));
    const customBudget = Math.max(10, Math.min(120, Number(c.budget || 45)));
    c.carBase = base.slice();
    c.budget = customBudget;
    CAR_BASE_V10[c.teamName] = base.slice();
    CAR_BASE_V11[c.teamName] = base.slice();
    TEAM_BUDGET_V11[c.teamName] = customBudget;
    const baseAvg = base.reduce((x, y) => x + y, 0) / base.length;
    TEAM_PRESTIGE_V10[c.teamName] = Math.max(
      58,
      Math.min(99, Math.round(baseAvg + 5)),
    );
    const parts = {};
    CAR_ATTRS_V10.forEach((a, i) => (parts[a] = base[i]));
    baseTeams[c.teamName] = {
      ovr: Math.round(baseAvg),
      budget: customBudget,
      dev: 80,
      parts: JSON.parse(JSON.stringify(parts)),
    };
    teams[c.teamName] = JSON.parse(JSON.stringify(baseTeams[c.teamName]));
    personnel[c.teamName] = {
      principal: "Team Principal",
      engineers: {
        [c.playerName]: "Race Engineer",
        [c.mateName]: "Race Engineer",
      },
    };
    if (typeof DRIVER_CONTRACTS_V11 === "object") {
      DRIVER_CONTRACTS_V11[c.playerName] = {
        end: 2026,
        label: "2026 · 一年合同",
        option: true,
        note: "自定义生涯首年",
      };
      DRIVER_CONTRACTS_V11[c.mateName] = {
        end: 2026,
        label: "2026 · 一年合同",
        option: true,
        note: "自定义车队首发席位",
      };
    }
    customConfigV19 = c;
    specialEvents.push(
      {
        phase: "qual",
        race: "澳大利亚大奖赛",
        team: c.teamName,
        title: `${c.teamName}：队史第一次正式排位`,
        scene:
          "这是一支全新车队第一次参加F1排位。任何一次超出预期的圈速都会成为车队历史上的第一个标记。",
        choices: [
          [
            "最后一圈完全进攻",
            "用更大的风险争取超出赛车基准。",
            91,
            0.27,
            "自定义车队彩蛋",
          ],
          [
            "先确保有效圈，再逐段加速",
            "以完成首秀为底线，仍然保留一定上限。",
            83,
            0.1,
            "自定义车队彩蛋",
          ],
          [
            "执行保守基准程序",
            "优先拿到第一份完整排位数据。",
            74,
            0.04,
            "自定义车队彩蛋",
          ],
        ],
        _customV19: true,
      },
      {
        phase: "race",
        race: "澳大利亚大奖赛",
        team: c.teamName,
        title: `${c.teamName}：队史第一场大奖赛`,
        scene:
          "发车灯即将熄灭。车库里没有历史数据可以依赖，所有策略模型都来自冬测和模拟器。完赛本身有价值，但赛道上的每一个机会也可能成为新车队的第一个积分。",
        choices: [
          [
            "看到机会就主动进攻",
            "把首秀当作证明速度的机会。",
            88,
            0.21,
            "自定义车队彩蛋",
          ],
          [
            "按计划完成整场比赛",
            "优先把赛车和数据完整带回终点。",
            80,
            0.07,
            "自定义车队彩蛋",
          ],
          [
            "延长首个stint等待混乱",
            "等待安全车或比赛节奏变化寻找位置。",
            85,
            0.17,
            "自定义车队彩蛋",
          ],
        ],
        _customV19: true,
      },
      {
        phase: "race",
        race: "英国大奖赛",
        team: c.teamName,
        title: `${c.teamName}：赛季中段第一次真正看到升级差距`,
        scene:
          "赛季已经过半。对手的新部件开始改变中后排秩序，你的工程组想知道这支新车队究竟该继续追今年，还是尽快把资源转向下一代赛车。",
        choices: [
          [
            "继续为本赛季成绩进攻",
            "把现有赛车的价值尽量兑现。",
            86,
            0.16,
            "自定义车队彩蛋",
          ],
          [
            "用比赛执行完整测试程序",
            "牺牲一点眼前圈速换下一代数据。",
            77,
            0.05,
            "自定义车队彩蛋",
          ],
          [
            "赌一次激进策略抢结果",
            "如果安全车窗口出现，可能拿到超预期成绩。",
            90,
            0.25,
            "自定义车队彩蛋",
          ],
        ],
        _customV19: true,
      },
    );
    return player;
  }
  function openCustomCareerV19() {
    cleanupCustomRosterV19();
    selected = null;
    const used = [...ACTIVE_NUMBERS_V19].sort((a, b) => a - b).join(" / ");
    document.getElementById("modalTitle").textContent =
      "CUSTOM TEAM · 自定义车手生涯";
    document.getElementById("modalBody").innerHTML =
      `<div class="customFormV19 customFormV2"><div class="customIntro"><b>自建车队</b> · 现在可以自行决定首年研发预算、赛车六项性能以及首发队友。留空队友姓名时仍会自动生成一名年轻车手。</div><div class="customSectionV2"><div class="customSectionTitleV2">你的车手</div><div class="customFieldGridV19"><label class="customFieldV19"><span>车手姓名</span><input id="customNameV19" maxlength="24"></label><label class="customFieldV19"><span>国籍</span><input id="customNationV19" maxlength="20" placeholder="例如：中国"></label><label class="customFieldV19"><span>车号 · 2–99</span><input id="customNumberV19" type="number" min="2" max="99" inputmode="numeric" placeholder="选号"></label><label class="customFieldV19"><span>自定义车队名称</span><input id="customTeamV19" maxlength="28" placeholder="例如：Nova Racing"></label></div><div class="small" style="margin-top:7px">2026 现役已占用车号：${used}</div><div class="customStatsV19"><label class="customStatV19"><span>综合 OVR</span><input id="customOvrV19" type="number" min="50" max="99" value="82"></label><label class="customStatV19"><span>经验 EXP</span><input id="customExpV19" type="number" min="50" max="99" value="70"></label><label class="customStatV19"><span>竞速 RAC</span><input id="customRacV19" type="number" min="50" max="99" value="83"></label><label class="customStatV19"><span>意识 AWA</span><input id="customAwaV19" type="number" min="50" max="99" value="80"></label><label class="customStatV19"><span>速度 PAC</span><input id="customPacV19" type="number" min="50" max="99" value="84"></label></div></div><div class="customSectionV2"><div class="customSectionTitleV2">车队资金与 2026 赛车</div><div class="customBudgetRowV2"><label class="customFieldV19"><span>首年研发预算 · €M</span><input id="customBudgetV2" type="number" min="10" max="120" step="1" value="45" inputmode="decimal"></label><div class="customBudgetHintV2">允许 €10M–€120M。后续赛季仍按这支车队的自定基准预算 + 上赛季排名回补。</div></div><div class="customCarStatsV2">${CAR_ATTRS_V10.map((a, i) => `<label class="customStatV19"><span>${a}</span><input id="customCar${i}V2" type="number" min="45" max="99" step="0.5" value="${[61, 49, 48, 50, 49, 60][i]}" inputmode="decimal"></label>`).join("")}</div><div class="customCarPreviewV2"><span>当前自定赛车总评</span><b id="customCarOvrPreviewV2">53</b><small>六项平均值仅作整体参考，真实赛道表现仍由赛道需求和单项属性决定。</small></div></div><div class="customSectionV2"><div class="customSectionTitleV2">首发队友 <small>可自定义 / 姓名留空则随机</small></div><div class="customFieldGridV19"><label class="customFieldV19"><span>队友姓名</span><input id="customMateNameV2" maxlength="24" placeholder="留空 = 随机年轻车手"></label><label class="customFieldV19"><span>队友国籍</span><input id="customMateNationV2" maxlength="20" placeholder="例如：法国"></label><label class="customFieldV19"><span>队友车号 · 2–99</span><input id="customMateNumberV2" type="number" min="2" max="99" inputmode="numeric" placeholder="留空 = 自动选号"></label></div><div class="customStatsV19"><label class="customStatV19"><span>队友 OVR</span><input id="customMateOvrV2" type="number" min="50" max="99" value="76"></label><label class="customStatV19"><span>队友 EXP</span><input id="customMateExpV2" type="number" min="50" max="99" value="52"></label><label class="customStatV19"><span>队友 RAC</span><input id="customMateRacV2" type="number" min="50" max="99" value="76"></label><label class="customStatV19"><span>队友 AWA</span><input id="customMateAwaV2" type="number" min="50" max="99" value="74"></label><label class="customStatV19"><span>队友 PAC</span><input id="customMatePacV2" type="number" min="50" max="99" value="77"></label></div></div><div class="customTeamRuleV19"><div><span>赛车</span><b>六项自定</b></div><div><span>研发预算</span><b>自由设定</b></div><div><span>围场规模</span><b>12队 / 24人</b></div></div><div class="customErrorV19" id="customErrorV19"></div><div class="customActionsV19"><button class="btn" onclick="closeOverlay()">取消</button><button class="btn primary" onclick="createCustomCareerV19()">生成车手档案 →</button></div></div>`;
    document.getElementById("overlay").classList.add("open");
    const update = () => {
      const xs = [0, 1, 2, 3, 4, 5].map(
          (i) =>
            Number(document.getElementById("customCar" + i + "V2")?.value) || 0,
        ),
        b = document.getElementById("customCarOvrPreviewV2");
      if (b) b.textContent = Math.round(xs.reduce((a, c) => a + c, 0) / 6);
    };
    [0, 1, 2, 3, 4, 5].forEach((i) =>
      document
        .getElementById("customCar" + i + "V2")
        ?.addEventListener("input", update),
    );
    update();
  }
  function createCustomCareerV19() {
    const name = cleanTextV19(
        document.getElementById("customNameV19")?.value,
        24,
      ),
      nation = cleanTextV19(
        document.getElementById("customNationV19")?.value,
        20,
      ),
      team = cleanTextV19(document.getElementById("customTeamV19")?.value, 28),
      num = Number(document.getElementById("customNumberV19")?.value);
    const vals = ["Ovr", "Exp", "Rac", "Awa", "Pac"].map((k) =>
        Number(document.getElementById("custom" + k + "V19")?.value),
      ),
      budget = Number(document.getElementById("customBudgetV2")?.value),
      carBase = [0, 1, 2, 3, 4, 5].map((i) =>
        Number(document.getElementById("customCar" + i + "V2")?.value),
      );
    const mateInput = cleanTextV19(
        document.getElementById("customMateNameV2")?.value,
        24,
      ),
      mateNationInput = cleanTextV19(
        document.getElementById("customMateNationV2")?.value,
        20,
      ),
      mateNumRaw = document.getElementById("customMateNumberV2")?.value,
      mateVals = ["Ovr", "Exp", "Rac", "Awa", "Pac"].map((k) =>
        Number(document.getElementById("customMate" + k + "V2")?.value),
      );
    const err = document.getElementById("customErrorV19"),
      fail = (m) => {
        if (err) err.textContent = m;
      };
    if (name.length < 2) return fail("请输入至少 2 个字符的车手姓名。");
    if (nation.length < 2) return fail("请输入国籍。");
    if (team.length < 2) return fail("请输入自定义车队名称。");
    if (drivers.some((d) => d[0].toLowerCase() === name.toLowerCase()))
      return fail("这个车手姓名已经存在。");
    if (Object.keys(teams).some((t) => t.toLowerCase() === team.toLowerCase()))
      return fail("这个车队名称已经存在。");
    if (!Number.isInteger(num) || num < 2 || num > 99)
      return fail("你的车号只能选择 2–99。");
    if (ACTIVE_NUMBERS_V19.has(num))
      return fail(`#${num} 已被 2026 现役车手使用，请换一个号码。`);
    if (vals.some((v) => !Number.isFinite(v) || v < 50 || v > 99))
      return fail("你的五项车手数值都必须在 50–99 之间。");
    if (!Number.isFinite(budget) || budget < 10 || budget > 120)
      return fail("首年研发预算必须在 €10M–€120M 之间。");
    if (carBase.some((v) => !Number.isFinite(v) || v < 45 || v > 99))
      return fail("赛车六项性能都必须在 45–99 之间。");
    const mateBase =
        CUSTOM_MATE_POOL_V19[
          Math.floor(Math.random() * CUSTOM_MATE_POOL_V19.length)
        ],
      mateName = mateInput || mateBase.name,
      mateNation = mateNationInput || (mateInput ? "自定义" : mateBase.nation),
      mateNumber = mateNumRaw === "" ? freeNumberV19(num) : Number(mateNumRaw);
    if (mateName.toLowerCase() === name.toLowerCase())
      return fail("队友姓名不能和你的车手姓名相同。");
    if (drivers.some((d) => d[0].toLowerCase() === mateName.toLowerCase()))
      return fail("队友姓名与现役车手重名，请换一个名字。");
    if (!Number.isInteger(mateNumber) || mateNumber < 2 || mateNumber > 99)
      return fail("队友车号只能选择 2–99。");
    if (mateNumber === num) return fail("两名车手不能使用同一个车号。");
    if (ACTIVE_NUMBERS_V19.has(mateNumber))
      return fail(`#${mateNumber} 已被 2026 现役车手使用。`);
    if (mateVals.some((v) => !Number.isFinite(v) || v < 50 || v > 99))
      return fail("队友五项数值都必须在 50–99 之间。");
    const cfg = {
      playerName: name,
      nation,
      number: num,
      teamName: team,
      ovr: vals[0],
      exp: vals[1],
      rac: vals[2],
      awa: vals[3],
      pac: vals[4],
      mateName,
      mateNation,
      mateNumber,
      mateOvr: mateVals[0],
      mateExp: mateVals[1],
      mateRac: mateVals[2],
      mateAwa: mateVals[3],
      matePac: mateVals[4],
      carBase,
      budget,
    };
    selected = installCustomRosterV19(cfg);
    closeOverlay();
    renderProfile();
    const k = document.querySelector("#profile .kicker");
    if (k) k.textContent = "CUSTOM DRIVER PROFILE · 12 TEAM GRID";
    showView("profile");
  }
  window.openCustomCareerV19 = openCustomCareerV19;
  window.createCustomCareerV19 = createCustomCareerV19;

  /* Home menu activation and normal-mode cleanup. */
  function installCustomHomeV19() {
    const items = [...document.querySelectorAll("#home .menuitem")];
    const custom = items.find((x) => x.textContent.includes("自定义车手生涯"));
    if (custom) {
      custom.onclick = openCustomCareerV19;
      custom.querySelector("span").textContent =
        "自定车手、队友、研发预算与赛车六项性能";
    }
  }
  const openDriverSelectV19Prev = openDriverSelect;
  openDriverSelect = function () {
    cleanupCustomRosterV19();
    selected = null;
    return openDriverSelectV19Prev();
  };
  const renderProfileV19Prev = renderProfile;
  renderProfile = function () {
    renderProfileV19Prev();
    const k = document.querySelector("#profile .kicker");
    if (k)
      k.textContent =
        customConfigV19 && selected?.[0] === customConfigV19.playerName
          ? "CUSTOM DRIVER PROFILE · 12 TEAM GRID"
          : "DRIVER PROFILE";
  };

  /* Save custom roster and all driver-team assignments so AI transfers into the 12th team persist. */
  const snapshotV19Prev = snapshot;
  snapshot = function () {
    const s = snapshotV19Prev();
    s.version = 19;
    if (customConfigV19) {
      s.customV19 = JSON.parse(JSON.stringify(customConfigV19));
      s.rosterV19 = drivers.map((d) => [d[0], d[1]]);
    }
    return s;
  };
  const restoreSnapshotV19Prev = restoreSnapshot;
  restoreSnapshot = function (data) {
    if (data?.customV19) installCustomRosterV19(data.customV19, true);
    else cleanupCustomRosterV19();
    const ok = restoreSnapshotV19Prev(data);
    if (ok && data?.rosterV19) {
      data.rosterV19.forEach(([name, team]) => {
        const d = drivers.find((x) => x[0] === name);
        if (d && teams[team]) d[1] = team;
      });
      selected = drivers.find((d) => d[0] === data.selected) || selected;
      customConfigV19 = data.customV19
        ? JSON.parse(JSON.stringify(data.customV19))
        : null;
      renderProfile();
      renderHub();
    }
    return ok;
  };
  const startCareerV19Prev = startCareer;
  startCareer = function () {
    startCareerV19Prev();
    if (customConfigV19 && selected?.[0] === customConfigV19.playerName) {
      state.customModeV19 = true;
      state.customTeamNameV19 = customConfigV19.teamName;
      state.customPlayerNameV19 = customConfigV19.playerName;
    } else {
      state.customModeV19 = false;
    }
    renderHub();
    autosave();
  };

  /* Custom-team off-season driver flow: in addition to the normal AI market, the new team can attract a driver. */
  function customTeamDriverFlowV19(previousRank) {
    if (
      !customConfigV19 ||
      Math.random() >
        (previousRank <= 6 ? 0.62 : previousRank <= 9 ? 0.48 : 0.36)
    )
      return;
    const team = customConfigV19.teamName,
      current = drivers.filter((d) => d[1] === team && d[0] !== selected?.[0]);
    if (!current.length) return;
    const maxOvr = previousRank <= 6 ? 90 : previousRank <= 9 ? 86 : 82,
      candidates = drivers.filter(
        (d) => d[0] !== selected?.[0] && d[1] !== team && d[2] <= maxOvr,
      );
    if (!candidates.length) return;
    const incoming = candidates[Math.floor(Math.random() * candidates.length)],
      outgoing = current.sort((a, b) => a[2] - b[2])[0],
      old = incoming[1];
    incoming[1] = team;
    outgoing[1] = old;
    if (state?.contract?.history)
      state.contract.history.unshift(
        `休赛期 · ${incoming[0]} 转投 ${team}；${outgoing[0]} 前往 ${old}`,
      );
  }
  const startNextSeasonV19Prev = startNextSeasonV11;
  startNextSeasonV11 = function () {
    const customTeam = customConfigV19?.teamName,
      order = customTeam
        ? Object.keys(teams).sort(
            (a, b) =>
              (state.teamStandings[b] || 0) - (state.teamStandings[a] || 0),
          )
        : [],
      prevRank = customTeam ? Math.max(1, order.indexOf(customTeam) + 1) : 12;
    const before = seasonYearV11();
    startNextSeasonV19Prev();
    if (selected && customConfigV19 && seasonYearV11() > before) {
      customTeamDriverFlowV19(prevRank);
      if (
        selected[1] === customTeam &&
        Number.isFinite(Number(customConfigV19.budget))
      )
        state.budget = round1V14(
          state.budget + (Number(customConfigV19.budget) - 45),
        );
      renderHub();
      autosave();
    }
  };

  /* Custom driver detail uses created-career language instead of "real-world history". */
  const openCareerDriverDetailV19Prev = openCareerDriverDetail;
  openCareerDriverDetail = function () {
    if (!customConfigV19 || selected?.[0] !== customConfigV19.playerName)
      return openCareerDriverDetailV19Prev();
    const d = selected,
      p = driverProfiles[d[0]],
      attrs = [
        ["OVR", d[2]],
        ["EXP", d[3]],
        ["RAC", d[4]],
        ["AWA", d[5]],
        ["PAC", d[6]],
      ],
      hist = state.history.length
        ? state.history
            .slice(-5)
            .reverse()
            .map(
              (h) =>
                `<div class="historyline"><b>${h.race}</b> · P${h.grid} → ${h.dnf ? "DNF" : "P" + h.finish} · ${h.points}分</div>`,
            )
            .join("")
        : '<div class="historyline">自定义生涯尚未完成比赛。</div>';
    document.getElementById("modalTitle").textContent =
      `CUSTOM DRIVER · ${seasonYearV11()}`;
    document.getElementById("modalBody").innerHTML =
      `<div class="driverdetail"><div class="driverdetailtop"><div><div class="kicker">${p.nation} · ${d[1]}</div><div class="driverdetailname">${d[0]} <span class="seasonBadge">CUSTOM</span></div><span class="driverbadge">#${p.number}</span><span class="driverbadge">F1 DEBUT 2026</span></div><div class="drivernumber">#${p.number}</div></div><div class="detailgrid"><div><h3 class="sectiontitle">当前能力</h3><div class="detailstats">${attrs.map((a) => `<div class="detailstat"><span>${a[0]}</span><b>${a[1]}</b></div>`).join("")}</div><div class="hint" style="margin-top:12px">自定义车队以第 12 名赛车基线进入 2026。后续研发、衰减、预算回补与车手市场规则和其他车队完全一致。</div></div><div><h3 class="sectiontitle">本存档最近成绩</h3>${hist}</div></div></div>`;
    document.getElementById("overlay").classList.add("open");
  };

  /* ----------------------- more driver/team Easter eggs ----------------------- */
  specialEvents.push(
    {
      phase: "race",
      race: "英国大奖赛",
      driver: "Lewis Hamilton",
      title: "Silverstone：熟悉的看台，不熟悉的红色赛车",
      scene:
        "你穿着 Ferrari 红色在银石进入最后十五圈。前车就在DRS范围内，主看台的欢呼声却仍然像过去很多年一样熟悉。工程师提醒：后胎温度已经偏高。",
      choices: [
        [
          "现在就进攻",
          "把主场机会直接变成赛道行动。",
          91,
          0.23,
          "Hamilton 彩蛋",
        ],
        [
          "先冷却一圈再追",
          "控制温度后再用直道速度。",
          84,
          0.09,
          "Hamilton 彩蛋",
        ],
        ["交给策略窗口", "不让情绪改变轮胎计划。", 75, 0.04, "Hamilton 彩蛋"],
      ],
    },
    {
      phase: "qual",
      race: "意大利大奖赛",
      driver: "Kimi Antonelli",
      title: "Monza：意大利新星的第一排梦想",
      scene:
        "最后一次飞驰圈前，主看台已经开始追踪你的每一个sector。Mercedes 的直道效率不错，但第二减速弯的制动稳定性仍然是整圈关键。",
      choices: [
        [
          "第一计时段就全压",
          "把主场氛围转化成攻击性。",
          91,
          0.24,
          "Antonelli 彩蛋",
        ],
        [
          "前半圈稳住，Lesmo之后再释放",
          "把风险留给后半圈。",
          85,
          0.1,
          "Antonelli 彩蛋",
        ],
        ["确保有效圈", "不为主场额外增加风险。", 76, 0.04, "Antonelli 彩蛋"],
      ],
    },
    {
      phase: "race",
      race: "英国大奖赛",
      driver: "George Russell",
      title: "Silverstone：Mercedes 的主场防守战",
      scene:
        "你的轮胎比身后赛车旧，但高速弯平台仍然稳定。车队判断如果能把对手留在脏空气里两圈，下一次进站窗口会重新有利。",
      choices: [
        [
          "高速弯主动拉开",
          "利用赛车平台争取脱离DRS。",
          88,
          0.18,
          "Russell 彩蛋",
        ],
        [
          "把防守集中在直道末端",
          "节省轮胎，把风险压在重刹区。",
          82,
          0.08,
          "Russell 彩蛋",
        ],
        ["提前进站避开防守", "用策略交换赛道位置。", 80, 0.11, "Russell 彩蛋"],
      ],
    },
    {
      phase: "qual",
      race: "巴塞罗那-加泰罗尼亚大奖赛",
      driver: "Carlos Sainz",
      title: "西班牙：主场排位的最后一套软胎",
      scene:
        "你只有一套全新的软胎。Williams 的赛车在高速区并不差，但慢弯出弯仍容易丢掉一点时间。",
      choices: [
        [
          "把所有余量留给最后一圈",
          "全力争取超出赛车基准的位置。",
          90,
          0.23,
          "Sainz 彩蛋",
        ],
        [
          "两圈程序，第一圈建立温度",
          "牺牲一点胎面换更稳定窗口。",
          84,
          0.1,
          "Sainz 彩蛋",
        ],
        ["执行标准单圈", "保持车队原计划。", 76, 0.04, "Sainz 彩蛋"],
      ],
    },
    {
      phase: "race",
      race: "圣保罗大奖赛",
      driver: "Gabriel Bortoleto",
      title: "Interlagos：巴西主场的积分机会",
      scene:
        "比赛后半段出现零星小雨，你正处在积分区边缘。看台在每次通过主直道时都明显更响，但赛道另一端已经开始变滑。",
      choices: [
        ["继续干胎进攻", "赌雨不会立刻扩大。", 91, 0.28, "Bortoleto 彩蛋"],
        ["保护位置等待雷达", "用一两圈确认天气。", 82, 0.09, "Bortoleto 彩蛋"],
        [
          "提前换半雨胎",
          "如果雨势扩大，收益会非常大。",
          89,
          0.25,
          "Bortoleto 彩蛋",
        ],
      ],
    },
    {
      phase: "race",
      race: "墨西哥城大奖赛",
      driver: "Sergio Perez",
      title: "Foro Sol：主场最后十圈",
      scene:
        "体育场段的声音几乎盖过无线电。你距离前车不到一秒，但刹车温度已经接近警戒区。",
      choices: [
        [
          "继续追，主场一定要攻",
          "把剩余冷却余量换成一次进攻。",
          92,
          0.25,
          "Perez 彩蛋",
        ],
        ["直道lift两圈再追", "先让刹车回到窗口。", 84, 0.08, "Perez 彩蛋"],
        ["守住当前名次", "确保把主场成绩带回终点。", 75, 0.03, "Perez 彩蛋"],
      ],
    },
    {
      phase: "race",
      race: "巴塞罗那-加泰罗尼亚大奖赛",
      driver: "Fernando Alonso",
      title: "西班牙：经验与轮胎寿命的计算",
      scene:
        "前方赛车使用更新的轮胎，你却拥有更好的赛道位置。工程师认为再撑五圈可能等到安全车，也可能让轮胎彻底掉出窗口。",
      choices: [
        [
          "继续撑，赌比赛变化",
          "用经验把策略窗口拉到极限。",
          89,
          0.2,
          "Alonso 彩蛋",
        ],
        ["现在进站", "不让旧胎继续吞掉时间。", 83, 0.09, "Alonso 彩蛋"],
        ["两圈后再决定", "保留信息，但风险仍在累积。", 80, 0.13, "Alonso 彩蛋"],
      ],
    },
    {
      phase: "qual",
      race: "英国大奖赛",
      driver: "Arvid Lindblad",
      title: "Silverstone：新秀的主场排位",
      scene:
        "这是你第一次以F1正式车手身份在主场参加排位。高速连续弯的信心正在上升，但风向比练习赛更乱。",
      choices: [
        [
          "把最后一圈当成证明机会",
          "接受新秀在高速区的更高风险。",
          90,
          0.25,
          "Lindblad 彩蛋",
        ],
        ["逐段加速", "先确保前半圈，再压后半段。", 84, 0.11, "Lindblad 彩蛋"],
        [
          "稳定完成有效圈",
          "把经验积累放在结果之前。",
          75,
          0.04,
          "Lindblad 彩蛋",
        ],
      ],
    },
    {
      phase: "race",
      race: "英国大奖赛",
      team: "Williams",
      title: "Williams：Silverstone 的高速平台终于派上用场",
      scene:
        "赛车在高速段明显比前车稳定，但直道末端的制动区会把两台车重新拉近。车队希望你利用这一站最适合赛车的部分完成超越。",
      choices: [
        [
          "高速区持续施压",
          "用平台优势逼迫前车犯错。",
          89,
          0.19,
          "Williams 彩蛋",
        ],
        ["把超车留到策略周期", "不在高速并排。", 81, 0.08, "Williams 彩蛋"],
        ["先保护轮胎", "把优势留到比赛末段。", 74, 0.04, "Williams 彩蛋"],
      ],
    },
    {
      phase: "race",
      race: "美国大奖赛",
      team: "Haas F1 Team",
      title: "Haas：美国主场的积分窗口",
      scene:
        "COTA 的比赛进入中段，你正好卡在积分区边缘。车队希望在主场拿到结果，但前胎温度已经高于模型。",
      choices: [
        ["提前进站做undercut", "主动争取主场积分。", 88, 0.17, "Haas 彩蛋"],
        ["继续按原策略", "不给主场压力改变计划。", 79, 0.06, "Haas 彩蛋"],
        ["延长stint赌安全车", "用更高波动寻找大结果。", 87, 0.23, "Haas 彩蛋"],
      ],
    },
    {
      phase: "qual",
      race: "意大利大奖赛",
      team: "Racing Bulls",
      title: "Racing Bulls：意大利周末的低阻力设定",
      scene:
        "车队为Monza准备了更激进的低阻力包。直道速度很好，但Lesmo和Ascari的后轴稳定性变得敏感。",
      choices: [
        [
          "保留低阻力极限设定",
          "用尾速换弯中风险。",
          90,
          0.22,
          "Racing Bulls 彩蛋",
        ],
        [
          "增加一点下压力",
          "牺牲直道换更完整单圈。",
          84,
          0.09,
          "Racing Bulls 彩蛋",
        ],
        ["回到基准设定", "降低波动。", 76, 0.04, "Racing Bulls 彩蛋"],
      ],
    },
    {
      phase: "race",
      race: "比利时大奖赛",
      team: "Alpine",
      title: "Alpine：斯帕的天气让中游重新洗牌",
      scene:
        "赛道一端已经出现雨点，另一端仍然完全干燥。你的位置不足以靠正常节奏拿到大分，但天气给了策略组一次机会。",
      choices: [
        ["提前赌半雨胎", "用高风险争取大幅跃升。", 92, 0.31, "Alpine 彩蛋"],
        ["继续干胎等确认", "减少错误轮胎的代价。", 82, 0.1, "Alpine 彩蛋"],
        [
          "延长stint等待安全车",
          "把机会留给下一次中和。",
          84,
          0.17,
          "Alpine 彩蛋",
        ],
      ],
    },
    {
      phase: "race",
      race: "摩纳哥大奖赛",
      team: "Aston Martin",
      title: "Aston Martin：街道赛上的机械抓地机会",
      scene:
        "这套赛车在慢速区比赛季多数赛道更舒服。前车在发卡和Portier明显更慢，但真正的超车空间仍然极少。",
      choices: [
        [
          "提前进站做undercut",
          "把机械抓地优势转化为新胎圈速。",
          89,
          0.16,
          "Aston Martin 彩蛋",
        ],
        ["继续施压等待失误", "保持赛道位置。", 83, 0.1, "Aston Martin 彩蛋"],
        [
          "延长stint等安全车",
          "摩纳哥的高波动策略。",
          85,
          0.18,
          "Aston Martin 彩蛋",
        ],
      ],
    },
    {
      phase: "race",
      race: "拉斯维加斯大奖赛",
      team: "Cadillac",
      title: "Cadillac：拉斯维加斯的美国夜赛",
      scene:
        "美国新车队来到最醒目的夜赛。长直道让你有机会利用低下压力设定，但轮胎在低温下很难迅速进入窗口。",
      choices: [
        [
          "直道全力部署",
          "争取在轮胎完全升温前抢位置。",
          89,
          0.21,
          "Cadillac 彩蛋",
        ],
        ["先建立胎温", "放弃第一拍进攻。", 81, 0.07, "Cadillac 彩蛋"],
        [
          "提前进站换新胎尝试undercut",
          "用新胎窗口制造位置。",
          86,
          0.16,
          "Cadillac 彩蛋",
        ],
      ],
    },
    {
      phase: "race",
      race: "圣保罗大奖赛",
      team: "Mercedes",
      title: "Mercedes：Interlagos 的天气模型开始失效",
      scene:
        "短时间阵雨让模拟器模型迅速失去参考价值。你的位置不错，但任何一次错误换胎都会让整个周末反转。",
      choices: [
        [
          "相信现场感觉，延后一圈决定",
          "用车手反馈替代模型。",
          86,
          0.14,
          "Mercedes 彩蛋",
        ],
        ["立即按雷达换胎", "相信数据提前行动。", 89, 0.22, "Mercedes 彩蛋"],
        [
          "坚持当前胎直到明确湿滑",
          "最保守的确认方案。",
          77,
          0.06,
          "Mercedes 彩蛋",
        ],
      ],
    },
  );

  /* ----------------------- hub/mobile polish ----------------------- */
  const renderHubV19Prev = renderHub;
  renderHub = function () {
    renderHubV19Prev();
    installCustomHomeV19();
    if (customConfigV19) {
      const k = document.querySelector("#career .careerHeader .kicker");
      if (k)
        k.innerHTML = `${seasonYearV11()} CUSTOM CAREER <span class="customModeBadgeV19">12 TEAMS · 24 DRIVERS</span>`;
    }
  };
  installCustomHomeV19();
  setTimeout(() => {
    installCustomHomeV19();
    if (selected) renderHub();
  }, 0);
})();

/* v23-race-report-script */

(function () {
  function pickV23(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function strategyNameV23() {
    const k = state?.weekend?.raceStrategy || "normal";
    return k === "aggressive"
      ? "进攻型策略"
      : k === "conservative"
        ? "保守型策略"
        : "均衡策略";
  }
  function weeklyModSummaryV23() {
    if (!state?.weeklyCarModsV16) return null;
    const xs = Object.entries(state.weeklyCarModsV16)
      .filter(([, v]) => Math.abs(Number(v || 0)) > 0.05)
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
    if (!xs.length) return null;
    const pos = xs.find(([, v]) => v > 0),
      neg = xs.find(([, v]) => v < 0);
    if (pos && neg)
      return `车队事务带来的临时设定也留下了明显痕迹：${pos[0]}得到加强，但${neg[0]}有所牺牲。`;
    if (pos) return `本周车队事务对${pos[0]}的临时加强在比赛中提供了一些帮助。`;
    if (neg)
      return `本周车队事务让${neg[0]}暂时受损，这在长距离里放大了一部分压力。`;
    return null;
  }
  function detectEventV23(note = "") {
    const n = String(note || "");
    return {
      technical: /冷却|温度|变速箱|机械|报警|故障|可靠性|动力/.test(n),
      teammate: /车队指令|PAPAYA|队友|交换位置|让车/.test(n),
      clash: /碰撞|接触|强硬|冲突|两败俱伤/.test(n),
      tyre: /轮胎|退化|胎|graining|颗粒/.test(n),
      pit: /进站|undercut|overcut|策略窗口/.test(n),
    };
  }
  function makeStoryV23(rr, q, r) {
    const grid = q?.position || drivers.length,
      finish = rr.position || drivers.length,
      movement = grid - finish,
      note = rr.note || "",
      ev = detectEventV23(note),
      carRank =
        typeof carRankAtTrackV10 === "function"
          ? carRankAtTrackV10(selected[1], "race")
          : null,
      fr =
        typeof expectedRangeV10 === "function"
          ? expectedRangeV10("race")
          : null;
    const story = { safety: "none", contact: "none", pace: "neutral" };
    const scRoll = Math.random();
    if (scRoll < 0.24) story.safety = "SC";
    else if (scRoll < 0.41) story.safety = "VSC";
    if (rr.dnf) {
      if (ev.technical) story.contact = "technical";
      else if (ev.clash || Math.random() < 0.48) story.contact = "crash";
      else story.contact = Math.random() < 0.55 ? "technical" : "crash";
    } else if (movement <= -2 && Math.random() < 0.3) story.contact = "minor";
    else if (movement >= 2 && Math.random() < 0.18) story.contact = "avoided";
    story.pace =
      movement >= 3
        ? "strong"
        : movement <= -3
          ? "weak"
          : finish <= 3
            ? "front"
            : "neutral";
    const paras = [];
    if (rr.dnf) {
      const lap = rr.retirementLap
        ? `第 ${rr.retirementLap} 圈左右`
        : "比赛中段";
      if (story.contact === "technical")
        paras.push(
          `从 P${grid} 发车后，这场比赛最终没有跑到终点。${lap}赛车出现了机械或系统层面的异常，前面的节奏因此失去意义；在退赛之前，你仍然尽量维持了可用的比赛速度。`,
        );
      else
        paras.push(
          `从 P${grid} 发车后，你没能把赛车带到终点。${lap}附近的一次事故或接触成为比赛转折点，赛车受损后无法继续；这场退赛更多是比赛中的意外情况造成的，而不是单纯的基础速度不足。`,
        );
    } else if (movement >= 4) {
      paras.push(
        `这是一次很完整的向前推进。你从 P${grid} 发车，最终来到 P${finish}，净提升 ${movement} 个位置。起步后的第一阶段没有被车群拖住，随后又把${strategyNameV23()}执行得比较干净，轮胎和赛道位置都没有出现明显失控。`,
      );
    } else if (movement >= 1) {
      paras.push(
        `你从 P${grid} 发车，最终以 P${finish} 完赛，向前提升了 ${movement} 个位置。整场并不是靠一次突然的大幅跃升，而是在几个关键阶段逐步把位置拿回来：前半程保持在有效进攻距离，后半程再利用轮胎状态和赛道位置把结果守住。`,
      );
    } else if (movement <= -4) {
      paras.push(
        `这场比赛从 P${grid} 发车后一路变得更困难，最终只以 P${finish} 完赛，净损失 ${Math.abs(movement)} 个位置。下滑不是单一原因造成的：车群中的赛道位置限制了可用节奏，轮胎窗口和几次攻防也让比赛时间持续流失，后半程已经很难完全追回。`,
      );
    } else if (movement <= -1) {
      paras.push(
        `你从 P${grid} 发车，最终 P${finish} 完赛，丢掉了 ${Math.abs(movement)} 个位置。基础速度并没有完全崩掉，但比赛中的几个细节没有站在你这一边：跟车、轮胎状态和策略窗口共同消耗了原本的发车优势。`,
      );
    } else {
      paras.push(
        `你从 P${grid} 发车并以 P${finish} 完赛，位置没有变化，但过程并不平淡。整场最重要的是维持节奏、控制轮胎，并在前后车的策略变化中守住赛道位置；结果看起来稳定，实际却需要持续避免被 undercut 或陷入更慢的车群。`,
      );
    }
    if (!rr.dnf) {
      if (story.safety === "SC") {
        if (movement > 0)
          paras.push(
            pickV23([
              `比赛中段的安全车成为了一个重要节点。你在 SC 出动前后没有吃亏，反而借重新集结的机会缩短了与前车的差距；重启阶段处理得不错，这让前面的几个位置重新进入可争夺范围。`,
              `一段安全车阶段压缩了全场差距。车队抓住窗口处理轮胎和赛道位置，你在重启后没有被后车立刻反攻，反而利用更接近的车群完成了部分位置回收。`,
            ]),
          );
        else if (movement < 0)
          paras.push(
            pickV23([
              `中段出现过安全车，但时机对你并不理想。前面的车手获得了更便宜的进站窗口，而你原本建立的一部分赛道间隔被直接清零，重启后还要重新面对车群。`,
              `安全车把原本已经拉开的差距全部压缩。你的策略没有因此得到足够补偿，重启后反而失去了一部分节奏优势，这也是名次下滑的原因之一。`,
            ]),
          );
        else
          paras.push(
            `比赛中出现过一次安全车，整个车阵被重新压缩。你在进站与重启阶段都没有明显得利或吃亏，最终仍然回到了原本的竞争位置。`,
          );
      } else if (story.safety === "VSC") {
        if (movement > 0)
          paras.push(
            `VSC 阶段给了车队一个成本较低的调整窗口。你因此减少了进站损失，并在恢复绿旗后保住轮胎状态，这部分红利帮助你把最后的名次向前推了一点。`,
          );
        else if (movement < 0)
          paras.push(
            `比赛里出现过 VSC，但窗口并没有正好落在你的策略周期上。其他赛车利用较低的进站时间完成调整，你则没能拿到同等程度的红利。`,
          );
        else
          paras.push(
            `中段短暂的 VSC 改变了一下策略窗口，不过双方都没有得到决定性的便宜，比赛很快重新回到正常节奏。`,
          );
      } else {
        paras.push(
          pickV23([
            `这场比赛没有出现足以重置全局的安全车红利，赛道位置基本只能靠纯速度、轮胎和正常进站窗口一点点争取。`,
            `全程没有出现特别大的 SC/VSC 红利，比赛走势相对连续，因此赛车本身的长距离表现和每一次进站前后的交通状况显得更重要。`,
          ]),
        );
      }
    }
    if (story.contact === "minor")
      paras.push(
        pickV23([
          `你在车群里还有过一次轻微接触，虽然没有造成退赛，但前翼或轮胎状态受到了一些影响，之后几圈的节奏明显更保守，这部分时间最终反映在名次上。`,
          `中段轮对轮时发生了轻微碰擦。赛车还能继续，但为了确认没有进一步损伤，你不得不暂时降低进攻强度，也因此丢掉了宝贵的赛道时间。`,
        ]),
      );
    else if (story.contact === "avoided")
      paras.push(
        `前方车群一度出现接触和混乱，你没有被卷进去，反而提前收油避开事故区。虽然当下损失了一点时间，但保持赛车完整让你在之后的重启和策略阶段获得了回报。`,
      );
    if (ev.technical && !rr.dnf)
      paras.push(
        `比赛过程中赛车还出现过技术层面的警报。你没有因此退赛，但不得不通过管理温度、换挡或动力模式降低机械负荷，最终成绩是在性能与可靠性之间做出的折中。`,
      );
    if (ev.teammate)
      paras.push(
        `队友之间的赛道位置也参与了这场比赛的走势。车队指令或内部攻防改变了至少一次节奏选择，而当前的车手关系决定了这次处理究竟有多顺畅。`,
      );
    const mod = weeklyModSummaryV23();
    if (mod) paras.push(mod);
    if (!rr.dnf && carRank && fr) {
      if (finish < fr[0])
        paras.push(
          `赛前模型原本给出的常规区间约为 P${fr[0]}–P${fr[1]}，而最终 P${finish} 明显高于这一基准。以这台车在本站大约全场第 ${carRank} 的适配水平来看，这是一次超过赛车正常上限的结果。`,
        );
      else if (finish > fr[1])
        paras.push(
          `赛前模型原本预计大约在 P${fr[0]}–P${fr[1]}，最终 P${finish} 低于常规区间。基础赛车并非完全没有速度，但比赛中的交通、策略和突发状况把这部分性能消耗掉了。`,
        );
      else
        paras.push(
          `最终 P${finish} 基本落在赛前预计的 P${fr[0]}–P${fr[1]} 区间内，说明结果总体符合这台车在本站的正常竞争力。`,
        );
    }
    story.text = paras.slice(0, 5).join("");
    return story;
  }
  const renderWeekendResultV23Prev = renderWeekendResult;
  renderWeekendResult = function () {
    renderWeekendResultV23Prev();
    const rr = state?.weekend?.raceResult,
      q = state?.weekend?.qualResult,
      r = currentRace();
    if (!rr || !r) return;
    if (!rr.reportStoryV23) rr.reportStoryV23 = makeStoryV23(rr, q, r);
    const el = document.getElementById("resultNarrative");
    if (el) el.textContent = rr.reportStoryV23.text;
    try {
      autosave();
    } catch (_) {}
  };
})();

/* v25-history-script */

(function () {
  function escV25(s) {
    return String(s == null ? "" : s).replace(
      /[&<>\"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '\"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  }
  function pastRaceEntryV25(round) {
    const result = (state.seasonResults || []).find(
      (x) => Number(x.round) === Number(round),
    );
    const hist = (state.history || []).find(
      (x) => Number(x.round) === Number(round),
    );
    return { result, hist };
  }
  function fallbackPastReportV25(h) {
    if (!h) return "这场比赛的详细复盘没有保存在旧存档中。";
    if (h.dnf)
      return `从 P${h.grid} 发车，但比赛最终以退赛结束。旧存档只保留了基础结果，因此无法还原当时更具体的事故、策略或安全车过程。`;
    const move = Number(h.grid) - Number(h.finish);
    if (move >= 4)
      return `从 P${h.grid} 发车并一路推进到 P${h.finish}，净提升 ${move} 个位置。这是一场明显高于发车位置的比赛，不过旧存档没有保存更细的事件记录。`;
    if (move > 0)
      return `从 P${h.grid} 发车，最终 P${h.finish}，成功向前提升 ${move} 位。旧存档没有保存当时完整的比赛事件，因此这里只展示已记录的结果。`;
    if (move < 0)
      return `从 P${h.grid} 发车，最终 P${h.finish}，比赛中丢掉了 ${Math.abs(move)} 个位置。旧存档没有保存导致名次下滑的具体事件。`;
    return `从 P${h.grid} 发车并以 P${h.finish} 完赛，整场比赛的位置变化不大。旧存档没有保存更详细的过程记录。`;
  }
  function openPastRaceV25(round) {
    ensureStateV14();
    const { result, hist } = pastRaceEntryV25(round);
    const raceName =
      hist?.race ||
      result?.race ||
      calendar[Math.max(0, Number(round) - 1)]?.[1] ||
      `ROUND ${round}`;
    const field = (result?.field || [])
      .map((x) => ({ ...x, mine: x.name === selected[0] }))
      .sort((a, b) => (a.position || 99) - (b.position || 99));
    const mine = field.find((x) => x.mine);
    const grid = hist?.grid ?? result?.grid ?? "—";
    const finish = hist?.dnf
      ? "DNF"
      : hist?.finish
        ? `P${hist.finish}`
        : mine?.dnf
          ? "DNF"
          : mine?.position
            ? `P${mine.position}`
            : "—";
    const pts = hist?.points ?? mine?.points ?? 0;
    const narrative =
      result?.reportTextV25 ||
      result?.reportTextV23 ||
      result?.reportStoryV23?.text ||
      fallbackPastReportV25(hist);
    const rows = field.length
      ? field
          .map(
            (x) =>
              `<div class="pastRaceRow ${x.mine ? "mine" : ""}"><span class="p">${x.dnf ? "DNF" : "P" + x.position}</span><b>${escV25(x.name)}</b><span class="team">${escV25(x.team)}</span><span class="pts ${x.dnf ? "dnf" : ""}">${x.dnf ? "—" : `+${Number(x.points || 0)}`}</span></div>`,
          )
          .join("")
      : `<div class="hint" style="margin:10px">这个旧存档没有保存完整的全场比赛结果。</div>`;
    document.getElementById("modalTitle").textContent =
      `R${String(round).padStart(2, "0")} · ${raceName}`;
    document.getElementById("modalBody").innerHTML =
      `<div class="driverdetail"><div class="kicker">PAST RACE · 完整比赛结果</div><div class="driverdetailname">${escV25(raceName)}</div><div class="pastRaceTop"><div class="pastRaceStat"><span>发车</span><b>${grid === "—" ? "—" : "P" + grid}</b></div><div class="pastRaceStat"><span>完赛</span><b>${finish}</b></div><div class="pastRaceStat"><span>积分</span><b>+${Number(pts || 0)}</b></div><div class="pastRaceStat"><span>轮次</span><b>R${String(round).padStart(2, "0")}</b></div></div><div class="pastRaceReport">${escV25(narrative)}</div><div class="relationhead" style="margin-top:15px"><h2 class="sectiontitle" style="margin:0">完整比赛结果</h2><div class="small">${field.length ? field.length + " 位车手" : "暂无完整记录"}</div></div><div class="pastRaceTable">${rows}</div></div>`;
    document.getElementById("overlay").classList.add("open");
  }
  window.openPastRaceV25 = openPastRaceV25;

  /* Save the expanded report and grid context into seasonResults for later viewing. */
  const renderWeekendResultV25Prev = renderWeekendResult;
  renderWeekendResult = function () {
    renderWeekendResultV25Prev();
    try {
      const rr = state?.weekend?.raceResult,
        q = state?.weekend?.qualResult;
      if (!rr) return;
      const sr = (state.seasonResults || []).find(
        (x) => Number(x.round) === Number(state.round),
      );
      if (sr) {
        sr.grid = q?.position ?? sr.grid;
        sr.playerFinish = rr.position;
        sr.playerDnf = !!rr.dnf;
        sr.reportTextV25 =
          document.getElementById("resultNarrative")?.textContent ||
          rr.reportStoryV23?.text ||
          "";
        if (rr.reportStoryV23)
          sr.reportStoryV23 = JSON.parse(JSON.stringify(rr.reportStoryV23));
      }
      autosave();
    } catch (_) {}
  };

  /* Make past-race cards open their full classification. */
  const renderSeasonV25Prev = renderSeasonV10;
  renderSeasonV10 = function () {
    renderSeasonV25Prev();
    const box = document.getElementById("seasonContent");
    if (!box) return;
    const cards = [...box.querySelectorAll(".historyRace")];
    cards.forEach((card, i) => {
      const h = state.history?.[i];
      if (!h) return;
      card.classList.add("v25click");
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", `${h.race}，查看完整比赛结果`);
      card.onclick = () => openPastRaceV25(h.round);
      card.onkeydown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPastRaceV25(h.round);
        }
      };
    });
  };
})();

/* v2-major-script */

(function () {
  const DRIVER_PORTRAITS_V2 = {
    "Max Verstappen":
      "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/redbullracing/maxver01/2026redbullracingmaxver01right.webp",
    "Isack Hadjar":
      "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/redbullracing/isahad01/2026redbullracingisahad01right.webp",
    "Lewis Hamilton":
      "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/ferrari/lewham01/2026ferrarilewham01right.webp",
    "Charles Leclerc":
      "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/ferrari/chalec01/2026ferrarichalec01right.webp",
    "Lando Norris":
      "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/mclaren/lannor01/2026mclarenlannor01right.webp",
    "Oscar Piastri":
      "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/mclaren/oscpia01/2026mclarenoscpia01right.webp",
    "George Russell":
      "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/mercedes/georus01/2026mercedesgeorus01right.webp",
    "Kimi Antonelli":
      "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/mercedes/andant01/2026mercedesandant01right.webp",
    "Fernando Alonso":
      "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/astonmartin/feralo01/2026astonmartinferalo01right.webp",
    "Lance Stroll":
      "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/astonmartin/lanstr01/2026astonmartinlanstr01right.webp",
    "Carlos Sainz":
      "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/williams/carsai01/2026williamscarsai01right.webp",
    "Alexander Albon":
      "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/williams/alealb01/2026williamsalealb01right.webp",
    "Pierre Gasly":
      "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/alpine/piegas01/2026alpinepiegas01right.webp",
    "Franco Colapinto":
      "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/alpine/fracol01/2026alpinefracol01right.webp",
    "Esteban Ocon":
      "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/haas/estoco01/2026haasestoco01right.webp",
    "Oliver Bearman":
      "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/haas/olibea01/2026haasolibea01right.webp",
    "Liam Lawson":
      "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/racingbulls/lialaw01/2026racingbullslialaw01right.webp",
    "Arvid Lindblad":
      "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/racingbulls/arvlin01/2026racingbullsarvlin01right.webp",
    "Nico Hulkenberg":
      "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/audi/nichul01/2026audinichul01right.webp",
    "Gabriel Bortoleto":
      "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/audi/gabbor01/2026audigabbor01right.webp",
    "Sergio Perez":
      "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/cadillac/serper01/2026cadillacserper01right.webp",
    "Valtteri Bottas":
      "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/cadillac/valbot01/2026cadillacvalbot01right.webp",
  };
  window.DRIVER_PORTRAITS_V2 = DRIVER_PORTRAITS_V2;
  function initialsV2(name) {
    return (
      String(name || "?")
        .split(/\s+/)
        .map((x) => x[0] || "")
        .join("")
        .slice(0, 2)
        .toUpperCase() || "?"
    );
  }
  function portraitHTMLV2(name, cls = "v2Portrait") {
    const src = DRIVER_PORTRAITS_V2[name];
    if (!src)
      return `<div class="v2PortraitFallback">${initialsV2(name)}</div>`;
    return `<img class="${cls}" loading="lazy" alt="${String(name).replace(/"/g, "")}" src="${src}" onerror="this.outerHTML='<div class=&quot;v2PortraitFallback&quot;>${initialsV2(name)}</div>'">`;
  }
  const openDriverSelectV2Prev = openDriverSelect;
  openDriverSelect = function () {
    openDriverSelectV2Prev();
    const box = document.getElementById("modalBody");
    if (!box) return;
    box.innerHTML = `<div class="drivergrid v2DriverGrid">${drivers
      .filter((d) => DRIVER_PORTRAITS_V2[d[0]])
      .map((d) => {
        const i = drivers.indexOf(d),
          p = driverProfiles[d[0]];
        return `<div class="driverchoice v2DriverChoice" onclick="chooseDriver(${i})"><span class="ovr">${d[2]}</span><div class="v2PortraitWrap">${portraitHTMLV2(d[0])}</div><div class="v2DriverCopy"><b>#${p.number} ${d[0]}</b><small>${p.nation} · ${d[1]}<br>OVR ${d[2]} · EXP ${d[3]} · RAC ${d[4]}</small></div></div>`;
      })
      .join("")}</div>`;
  };
  window.openDriverSelect = openDriverSelect;
  const renderProfileV2Prev = renderProfile;
  renderProfile = function () {
    renderProfileV2Prev();
    if (!selected) return;
    const box = document.querySelector("#profile .profilebox");
    if (!box) return;
    box.classList.add("v2ProfileBox");
    let p = box.querySelector(".profilePortraitV2");
    if (!p) {
      p = document.createElement("div");
      p.className = "profilePortraitV2";
      box.appendChild(p);
    }
    if (p.dataset.portraitName !== selected[0] || !p.firstElementChild) {
      p.dataset.portraitName = selected[0];
      p.innerHTML = portraitHTMLV2(selected[0]);
    }
  };
  window.renderProfile = renderProfile;
  const renderHubV2Prev = renderHub;
  renderHub = function () {
    const r = renderHubV2Prev.apply(this, arguments);
    if (selected) {
      const card = document.querySelector("#career .driverhubclick");
      if (card) {
        let p = card.querySelector(".hubPortraitV2");
        if (!p) {
          p = document.createElement("div");
          p.className = "hubPortraitV2";
          card.appendChild(p);
        }
        if (p.dataset.portraitName !== selected[0] || !p.firstElementChild) {
          p.dataset.portraitName = selected[0];
          p.innerHTML = portraitHTMLV2(selected[0]);
        }
      }
    }
    return r;
  };
  window.renderHub = renderHub;
  const openCareerDriverDetailV2Prev = openCareerDriverDetail;
  openCareerDriverDetail = function () {
    openCareerDriverDetailV2Prev();
    if (!selected) return;
    const detail = document.querySelector("#modalBody .driverdetail");
    if (!detail) return;
    detail.classList.add("v2DetailPortrait");
    let p = detail.querySelector(".driverDetailPortraitV2");
    if (!p) {
      p = document.createElement("div");
      p.className = "driverDetailPortraitV2";
      detail.prepend(p);
    }
    if (p.dataset.portraitName !== selected[0] || !p.firstElementChild) {
      p.dataset.portraitName = selected[0];
      p.innerHTML = portraitHTMLV2(selected[0]);
    }
  };
  window.openCareerDriverDetail = openCareerDriverDetail;
  qualEvents.push(
    {
      title: "最后一个计时段突然出现黄旗",
      scene:
        "你前两个计时段都在提升，但前方有人冲出赛道，黄旗刚好覆盖最后一组弯。",
      choices: [
        [
          "立刻放掉本圈，准备下一次",
          "避免黄旗下风险，但会消耗一次轮胎窗口。",
          74,
          0.03,
          "稳妥",
        ],
        ["先维持节奏等待绿旗", "如果很快恢复还能救回本圈。", 82, 0.13, "观察"],
        ["尽量减少收油幅度", "争取保住圈速，但风险更高。", 86, 0.22, "高风险"],
      ],
    },
    {
      title: "路肩冲击后底板传感器异常",
      scene: "上一圈你重重压过高速弯内侧路肩，底板压力读数开始左右不一致。",
      choices: [
        ["继续全推", "赌只是瞬时读数。", 87, 0.2, "高风险"],
        ["高速弯少压一格路肩", "牺牲少量时间降低冲击。", 80, 0.07, "平衡"],
        ["回站检查底板", "安全，但可能错过赛道演化。", 68, 0.025, "保守"],
      ],
    },
    {
      title: "刹车线控模式需要临时切换",
      scene:
        "工程师要求你在飞驰圈前切换 brake-by-wire 模式，新脚感能减少后轴不稳定。",
      choices: [
        ["立即切换并进攻", "需要一圈内适应。", 85, 0.14, "技术调整"],
        ["只在重刹弯切换", "把变化限制在关键位置。", 82, 0.08, "平衡"],
        ["保持原模式", "维持熟悉感。", 75, 0.06, "稳妥"],
      ],
    },
    {
      title: "细雨落在最后两个弯",
      scene: "维修区仍是干地，但赛道远端开始有零星雨点。",
      choices: [
        ["继续按干地极限推", "雨不扩大就最快。", 90, 0.27, "高风险"],
        ["最后两个弯提前刹车", "优先确保有效圈。", 80, 0.07, "平衡"],
        [
          "放弃本圈等天气确认",
          "可能错过最后的干地窗口。",
          69,
          0.06,
          "天气赌博",
        ],
      ],
    },
    {
      title: "两台车争夺同一个尾流窗口",
      scene: "你的队友也希望在长直道获得尾流，两台车准备圈正在靠近。",
      choices: [
        ["你先走给队友尾流", "换更干净的技术段。", 78, 0.05, "团队配合"],
        ["让队友先走你吃尾流", "理论更快，交通风险更高。", 88, 0.19, "进攻"],
        ["完全错开", "没有尾流也不会互相影响。", 82, 0.07, "平衡"],
      ],
    },
    {
      title: "方向盘出现轻微偏心",
      scene: "上一圈压路肩后方向盘中心出现偏移，前束可能发生微小变化。",
      choices: [
        ["继续飞驰圈", "适应偏差，不浪费轮胎。", 82, 0.18, "风险"],
        ["弯中留更多余量", "降低峰值速度换稳定。", 75, 0.06, "稳妥"],
        ["回站检查悬挂", "放弃当前窗口。", 65, 0.02, "保守"],
      ],
    },
    {
      title: "赛道进化速度远高于预期",
      scene: "最后三分钟圈速不断刷新，晚出场可能再获得接近两成秒。",
      choices: [
        [
          "等到最后才出场",
          "吃满赛道演化，承担红黄旗风险。",
          90,
          0.26,
          "高风险",
        ],
        ["现在出场", "先拿更快的有效圈。", 82, 0.08, "平衡"],
        ["留在车库保护轮胎", "相信当前成绩足够。", 72, 0.15, "策略赌博"],
      ],
    },
    {
      title: "准备圈被后车突然打乱",
      scene: "后方飞驰赛车快速接近，你必须让车，轮胎温度和间隔都被打乱。",
      choices: [
        ["让车后重新拉开间隔", "尽量救回准备节奏。", 81, 0.09, "恢复"],
        ["再做一圈准备圈", "换回理想温度。", 85, 0.11, "平衡"],
        ["直接开始飞驰圈", "不浪费时间但窗口不理想。", 76, 0.17, "风险"],
      ],
    },
  );
  raceEvents.push(
    {
      title: "全场安全车突然出动",
      scene: "事故发生在赛道另一端，Safety Car 已经确认，你正好接近进站入口。",
      choices: [
        [
          "立即进站吃安全车窗口",
          "用更低进站损失换更长后续stint。",
          90,
          0.12,
          "SC机会",
          { posMod: -1 },
        ],
        [
          "留在赛道争位置",
          "暂时保住位置，之后仍需停站。",
          82,
          0.14,
          "赛道位置",
        ],
        ["换硬胎尝试跑到底", "把SC红利变成长策略。", 86, 0.2, "策略赌博"],
      ],
    },
    {
      title: "VSC 即将结束，你已到维修区入口",
      scene: "比赛控制提示 VSC ending，留给车队判断的时间只有几秒。",
      choices: [
        [
          "立即进站",
          "如果VSC保持到限速线收益很大。",
          89,
          0.23,
          "VSC窗口",
          { posMod: -1 },
        ],
        ["继续留在赛道", "放弃赌博维持原计划。", 76, 0.04, "稳妥"],
        ["下一圈再看", "信息更多但窗口可能消失。", 72, 0.07, "观察"],
      ],
    },
    {
      title: "红旗中断比赛，重启轮胎重新开放",
      scene: "赛道需要清理，比赛红旗暂停，重启时可以重新选择轮胎。",
      choices: [
        [
          "换新软胎抢重启",
          "短期抓地最好，寿命压力最大。",
          91,
          0.22,
          "红旗重启",
        ],
        ["换中性胎", "平衡重启和寿命。", 83, 0.08, "平衡"],
        ["上硬胎", "升温慢但减少后续进站。", 77, 0.11, "长策略"],
      ],
    },
    {
      title: "胎压传感器提示疑似慢撒气",
      scene: "右后胎压力缓慢下降，继续高速行驶可能把小问题变成爆胎。",
      choices: [
        [
          "立刻进站换胎",
          "丢位置但避免更大事故。",
          68,
          0.015,
          "安全",
          { posMod: 3, dnfRisk: 0.002 },
        ],
        [
          "再跑一圈确认",
          "多拿信息但风险上升。",
          78,
          0.15,
          "观察",
          { dnfRisk: 0.025 },
        ],
        [
          "继续到原定窗口",
          "赌传感器误报。",
          87,
          0.28,
          "高风险",
          { dnfRisk: 0.075 },
        ],
      ],
    },
    {
      title: "轻微接触后前翼端板受损",
      scene: "轮对轮碰擦后前翼仍完整，但端板缺了一小块。",
      choices: [
        ["继续到正常进站", "接受一点圈速损失。", 79, 0.13, "损伤管理"],
        ["提前换前翼", "丢位置换完整赛车。", 82, 0.07, "维修", { posMod: 2 }],
        [
          "继续强攻",
          "忽略损伤抢位置。",
          87,
          0.24,
          "高风险",
          { dnfRisk: 0.035 },
        ],
      ],
    },
    {
      title: "底板路肩冲击后性能下降",
      scene: "工程师确认底板边缘有轻微损伤，高速下压力低于开赛时。",
      choices: [
        ["调整驾驶线", "减少压路肩，接受圈速损失。", 76, 0.06, "管理"],
        [
          "保持原线路进攻",
          "不让损伤改变节奏。",
          84,
          0.19,
          "风险",
          { dnfRisk: 0.025 },
        ],
        ["以完赛为主", "不为损伤额外停站。", 72, 0.04, "保守"],
      ],
    },
    {
      title: "维修区放车险些并排",
      scene: "相邻车库也在放车，强行出车可能形成维修区并排。",
      choices: [
        [
          "立即放车抢在前面",
          "可能守位，也有不安全放车风险。",
          88,
          0.23,
          "高风险",
        ],
        ["等对方通过", "安全但会损失时间。", 70, 0.03, "稳妥", { posMod: 1 }],
        ["最后一刻判断", "折中处理。", 80, 0.1, "平衡"],
      ],
    },
    {
      title: "换胎枪卡顿，进站慢了两秒",
      scene: "右前轮枪第一次没有完全锁定，出站后你落进慢车群。",
      choices: [
        ["新胎立刻连续超车", "尽快弥补慢停。", 88, 0.23, "追赶"],
        ["先建立胎温", "短期被车群拖住。", 80, 0.08, "平衡"],
        ["延长下一段", "从策略层面追回损失。", 82, 0.14, "策略"],
      ],
    },
    {
      title: "赛道出现碳纤维碎片",
      scene: "前车接触后留下碎片，目前仍是绿旗。",
      choices: [
        [
          "正常线路通过",
          "不丢时间，承担扎胎风险。",
          86,
          0.21,
          "风险",
          { dnfRisk: 0.03 },
        ],
        ["明显绕开", "损失一点时间保护轮胎。", 75, 0.035, "稳妥"],
        ["提前抬油", "最安全但可能失去DRS。", 69, 0.02, "保守"],
      ],
    },
    {
      title: "燃油目标突然吃紧",
      scene: "前半程攻防多消耗了燃油，最后阶段需要追回目标。",
      choices: [
        ["现在开始少量lift-and-coast", "把损失平均分散。", 78, 0.04, "管理"],
        [
          "继续全速，最后再省",
          "保住眼前位置，末段风险更大。",
          86,
          0.18,
          "风险",
        ],
        ["借尾流省油", "尽量不牺牲直道速度。", 82, 0.09, "技巧"],
      ],
    },
    {
      title: "ERS 电量长期低于目标",
      scene: "连续攻防让电池处于低电量，下一次进攻后可能无力防守。",
      choices: [
        [
          "这圈把电用完完成超车",
          "赌位置更重要。",
          89,
          0.21,
          "进攻",
          { posMod: -1 },
        ],
        ["充电一圈再攻击", "换完整下一次部署。", 82, 0.07, "平衡"],
        ["转防守模式", "停止主动进攻。", 73, 0.035, "稳妥"],
      ],
    },
    {
      title: "动力单元要求短暂降额",
      scene: "温度和电气数据触发保护程序，继续高输出可能扩大风险。",
      choices: [
        [
          "执行三圈降额",
          "降低机械风险。",
          72,
          0.03,
          "保护",
          { posMod: 1, dnfRisk: 0.003 },
        ],
        [
          "只在慢速段降额",
          "折中控制温度。",
          80,
          0.08,
          "平衡",
          { dnfRisk: 0.012 },
        ],
        [
          "保持全功率",
          "不接受性能损失。",
          88,
          0.25,
          "高风险",
          { dnfRisk: 0.08 },
        ],
      ],
    },
    {
      title: "重刹锁死造成明显平斑",
      scene: "高速直道出现持续振动，继续跑会影响制动和悬挂负荷。",
      choices: [
        [
          "提前进站换胎",
          "解决平斑但打乱策略。",
          80,
          0.06,
          "维修",
          { posMod: 2 },
        ],
        ["继续到原窗口", "忍受振动降低策略损失。", 78, 0.13, "管理"],
        [
          "继续全力进攻",
          "忽略振动抢位置。",
          86,
          0.24,
          "高风险",
          { dnfRisk: 0.035 },
        ],
      ],
    },
    {
      title: "越线超车，需要决定是否还回位置",
      scene: "你完成超越但出口四轮越出白线，赛事控制很可能要求归还位置。",
      choices: [
        ["马上还回", "避免处罚。", 76, 0.03, "合规", { posMod: 1 }],
        ["等车队确认", "可能保住位置也可能被要求归还。", 82, 0.12, "观察"],
        ["坚持认为合法", "赌赛事控制不处罚。", 89, 0.28, "高风险"],
      ],
    },
    {
      title: "赛道边界警告来到最后一次",
      scene: "再出界就可能吃时间处罚，而最快线路正好最容易越线。",
      choices: [
        ["继续压极限", "保持圈速承担处罚风险。", 87, 0.23, "高风险"],
        ["出口留半个车宽", "损失少量圈速确保合规。", 78, 0.04, "稳妥"],
        ["先稳定两圈", "暂时放弃追击。", 70, 0.025, "保守"],
      ],
    },
    {
      title: "双车进站窗口重叠",
      scene: "你和队友相隔不到三秒，同时进入最佳进站圈。",
      choices: [
        [
          "两台车double-stack",
          "避免错过窗口但后车要等待。",
          80,
          0.1,
          "团队策略",
          { posMod: 1 },
        ],
        ["你多跑一圈", "给队友完整停站。", 84, 0.13, "错位策略"],
        [
          "要求自己优先进站",
          "最大化你的比赛，队友承担损失。",
          88,
          0.18,
          "强硬",
          { relation: -3 },
        ],
      ],
    },
    {
      title: "对手提前进站，undercut威胁出现",
      scene: "身后对手已经换新胎，他这一圈预计快接近一秒。",
      choices: [
        ["本圈立即覆盖", "防止位置被切走。", 83, 0.07, "覆盖"],
        ["继续一圈", "赌旧胎仍有速度。", 85, 0.15, "策略赌博"],
        ["彻底反向策略", "换后段轮胎优势。", 82, 0.17, "反向策略"],
      ],
    },
    {
      title: "准备overcut，却遇到慢车",
      scene: "对手已经进站，你本想利用净空继续两圈，但慢车正好出现在前方。",
      choices: [
        ["立即进站止损", "放弃overcut。", 79, 0.06, "止损"],
        ["强行解决慢车", "快速超越还能保住机会。", 88, 0.22, "进攻"],
        ["继续原计划", "相信速度足以抵消交通。", 82, 0.15, "坚持"],
      ],
    },
    {
      title: "雨势来到干胎与半雨胎交叉点",
      scene: "部分弯角已经有明显水光，第一批车开始尝试半雨胎。",
      choices: [
        [
          "马上换半雨胎",
          "雨继续扩大就会最早获利。",
          92,
          0.29,
          "天气赌博",
          { posMod: -1 },
        ],
        ["再等一圈", "降低错误轮胎风险。", 82, 0.1, "观察"],
        ["坚持干胎", "赌雨很快停止。", 86, 0.24, "高风险"],
      ],
    },
    {
      title: "安全车重启前车突然压阵",
      scene: "前车在最后一个弯控制重启节奏，整列赛车被压得很紧。",
      choices: [
        [
          "准备第一弯进攻",
          "把重启当超车窗口。",
          90,
          0.22,
          "SC重启",
          { posMod: -1 },
        ],
        ["先守住内线", "避免重启丢位。", 80, 0.06, "防守"],
        ["主动拉开避免接触", "牺牲第一拍降低事故风险。", 72, 0.025, "安全"],
      ],
    },
    {
      title: "前方两台车发生接触",
      scene: "事故就在你面前展开，碎片和赛车占据部分赛道。",
      choices: [
        ["立刻减速走宽线", "损失时间但最大限度避险。", 72, 0.02, "避险"],
        [
          "保持速度从缝隙穿过",
          "可能捡位置，也可能卷入事故。",
          91,
          0.31,
          "极高风险",
          { posMod: -2, dnfRisk: 0.09 },
        ],
        ["跟随前车避让线路", "风险控制在中等。", 81, 0.1, "平衡"],
      ],
    },
    {
      title: "最后五圈，后车用更新软胎逼近",
      scene: "你守着重要积分位置，但后车每圈快接近半秒。",
      choices: [
        [
          "主要制动区都防内线",
          "尽力守位，轮胎温度继续升高。",
          85,
          0.18,
          "防守",
        ],
        ["只防最佳超车点", "减少轮胎损耗。", 82, 0.08, "平衡"],
        [
          "不硬防，尝试跟住DRS",
          "降低接触风险。",
          73,
          0.035,
          "稳妥",
          { posMod: 1 },
        ],
      ],
    },
  );
  setTimeout(() => {
    if (selected) {
      try {
        renderProfile();
      } catch (_) {}
    }
  }, 0);
})();

/* v2-3-events-contracts */

(function () {
  function gridPosV23(name) {
    const f = state?.weekend?.qualField || [];
    const x = f.find((r) => r.name === name);
    return x?.position || null;
  }
  function nearGridV23(a, b, gap = 2) {
    const pa = gridPosV23(a),
      pb = gridPosV23(b);
    return !!pa && !!pb && Math.abs(pa - pb) <= gap;
  }
  function selectedIsV23() {
    return [...arguments].includes(selected?.[0]);
  }
  function pairSelectedNearV23(a, b, gap = 2) {
    return selectedIsV23(a, b) && nearGridV23(a, b, gap);
  }
  function playerTeammateNearV23(gap = 2) {
    const tm = teammateV10?.();
    return !!tm && nearGridV23(selected[0], tm[0], gap);
  }
  function otherPairV23(a, b) {
    return selected?.[0] === a ? b : a;
  }
  function currentRaceNameV23() {
    return currentRace?.()?.[1] || "";
  }
  function driverNearAnyV23(names, gap = 3) {
    return names.some(
      (n) => n !== selected?.[0] && nearGridV23(selected[0], n, gap),
    );
  }
  function pointsCloseV23(a, b, n = 30) {
    return (
      Math.abs(
        (state.driverStandings?.[a] || 0) - (state.driverStandings?.[b] || 0),
      ) <= n
    );
  }
  function isYoungV23(n) {
    return [
      "Isack Hadjar",
      "Kimi Antonelli",
      "Oliver Bearman",
      "Arvid Lindblad",
      "Gabriel Bortoleto",
      "Franco Colapinto",
    ].includes(n);
  }
  const CHAMPS_V23 = ["Max Verstappen", "Lewis Hamilton", "Fernando Alonso"];
  function C(label, desc, q, r, tag, effect = {}) {
    return [label, desc, q, r, tag, effect];
  }
  function E(id, title, scene, choices, when, priority = 2) {
    return {
      id,
      title,
      scene,
      choices,
      when,
      priority,
      special: true,
      _dynamicV23: true,
    };
  }

  const DYNAMIC_SPECIALS_V23 = [
    /* Close on-track rivalry: Verstappen / Leclerc */
    E(
      "3316-wheel",
      "又一次进入同一段 DRS 窗口",
      () =>
        `你和 ${otherPairV23("Max Verstappen", "Charles Leclerc")} 从发车位开始就没有真正拉开。两台车再次进入同一段 DRS 窗口，前方重刹区允许并排，但任何半个车身的判断错误都会把比赛变成事故。`,
      [
        C(
          "刹车点直接送进去",
          "把机会当作真正的轮对轮，不等下一圈。",
          92,
          0.25,
          "轮对轮",
          { posMod: -1, dnfRisk: 0.035 },
        ),
        C(
          "留空间打交叉线",
          "不强求第一拍，优先保证第二个弯仍能并排。",
          87,
          0.09,
          "干净攻防",
        ),
        C(
          "等下一段 DRS",
          "先把电量和轮胎留给成功率更高的位置。",
          81,
          0.04,
          "等待机会",
        ),
      ],
      () => pairSelectedNearV23("Max Verstappen", "Charles Leclerc", 2),
      5,
    ),
    E(
      "3316-sc",
      "安全车之后，对手就在身边",
      () =>
        `安全车灯熄灭，${otherPairV23("Max Verstappen", "Charles Leclerc")} 就在你前后一个位置。工程师只给了一句简短提醒：“前/后车就是他，轮胎温度正常。”`,
      [
        C("重启立刻攻击", "不给对方建立节奏的时间。", 91, 0.22, "安全车重启", {
          posMod: -1,
          dnfRisk: 0.025,
        }),
        C("先观察一圈", "确认抓地力再开始进攻。", 84, 0.06, "安全车重启"),
        C(
          "先充电，下一圈再打",
          "牺牲第一拍换下一圈完整部署。",
          86,
          0.09,
          "安全车重启",
        ),
      ],
      () => pairSelectedNearV23("Max Verstappen", "Charles Leclerc", 1),
      5,
    ),
    E(
      "3316-space",
      "连续并排：还要继续吗？",
      () =>
        `你们已经连续几个弯没有分出胜负。工程师提醒外侧还有车身，你却很清楚对方不会轻易把门彻底关死。`,
      [
        C(
          "相信他，继续并排",
          "把两个弯连成一次完整攻防。",
          92,
          0.19,
          "继续并排",
          { posMod: -1, dnfRisk: 0.02 },
        ),
        C(
          "提前收一点，准备交叉线",
          "避免把轮对轮变成前翼账单。",
          85,
          0.06,
          "交叉线",
        ),
        C("退出这次进攻", "留到下一圈再来。", 77, 0.025, "退出进攻"),
      ],
      () =>
        pairSelectedNearV23("Max Verstappen", "Charles Leclerc", 2) &&
        state.round >= 3,
      4,
    ),

    /* McLaren positive team competition */
    E(
      "814-free",
      "Papaya Rules：自由竞争",
      () =>
        `两台 McLaren 处在同一集团。车队明确表示可以自由比赛，只留下一个要求：把两台木瓜色赛车都完整带回来。当前队内关系 ${Math.round(state.teamRelation || 50)}/100。`,
      [
        C(
          "自由竞争，彼此留空间",
          "允许真正的队内对决，但把碰撞风险压低。",
          89,
          0.09,
          "自由竞争",
          { relation: 2 },
        ),
        C(
          "错开策略再决胜",
          "不用同一圈硬碰硬，用不同轮胎窗口比较速度。",
          86,
          0.06,
          "错开策略",
          { relation: 2 },
        ),
        C(
          "先互拖 DRS 甩开后车",
          "合作几圈后再开放竞争。",
          91,
          0.04,
          "队友合作",
          { relation: 4, posMod: -1 },
        ),
      ],
      () =>
        pairSelectedNearV23("Lando Norris", "Oscar Piastri", 2) &&
        selected?.[1] === "McLaren",
      5,
    ),
    E(
      "814-drs",
      "两台 McLaren 的 DRS 合作",
      () =>
        `身后的对手正在逼近，但你和 ${otherPairV23("Lando Norris", "Oscar Piastri")} 正好可以互相利用 DRS。车队提议暂时不要内耗，先把第三台车甩出一秒。`,
      [
        C("合作三圈", "两台车先共同扩大安全距离。", 90, 0.035, "DRS 合作", {
          relation: 4,
        }),
        C("只合作一圈", "很快重新开放竞争。", 85, 0.055, "DRS 合作", {
          relation: 2,
        }),
        C("现在就比赛", "不接受临时休战。", 88, 0.16, "立即竞争", {
          relation: -1,
        }),
      ],
      () =>
        pairSelectedNearV23("Lando Norris", "Oscar Piastri", 2) &&
        selected?.[1] === "McLaren",
      4,
    ),
    E(
      "814-tow",
      "从排位延续到正赛的尾流合作",
      () =>
        `排位时两台 McLaren 曾经轮流承担尾流任务。到了正赛，两边工程师都提醒：今天的合作不是队令，只是别浪费彼此能提供的速度。`,
      [
        C("继续互相利用尾流", "先合作，再比赛。", 89, 0.045, "尾流合作", {
          relation: 3,
        }),
        C("保持独立节奏", "不占队友便宜，也不主动帮忙。", 82, 0.04, "独立节奏"),
        C(
          "趁对方留空间直接进攻",
          "把合作窗口立刻变成超车机会。",
          91,
          0.19,
          "直接进攻",
          { relation: -2, posMod: -1 },
        ),
      ],
      () =>
        pairSelectedNearV23("Lando Norris", "Oscar Piastri", 3) &&
        selected?.[1] === "McLaren",
      3,
    ),

    /* Ferrari / TR */
    E(
      "ferrari-checking",
      "Ferrari TR：“We are checking.”",
      () =>
        `你询问这一圈是否应该进站。无线电里沉默了两秒，随后传来熟悉的答复：“We are checking.” 前车已经接近维修区入口，决定窗口正在迅速关闭。`,
      [
        C(
          "让他们继续 checking",
          "完全等待策略墙给最终答案。",
          81,
          0.14,
          "Ferrari TR",
        ),
        C(
          "明确要求本圈进站",
          "把决定权从策略墙拿回来。",
          88,
          0.1,
          "Ferrari TR",
          { posMod: -1 },
        ),
        C("Plan C？", "要求车队立刻给出备选方案。", 85, 0.08, "Ferrari TR"),
      ],
      () => selected?.[1] === "Ferrari",
      3,
    ),
    E(
      "leclerc-question",
      "Charles TR：“Question.”",
      () =>
        `无线电打开：“Question…” 你刚准备追问策略细节，工程师已经开始报一串轮胎、差距和能量数据，而你正在进入高速弯。`,
      [
        C(
          "认真听完",
          "拿到完整信息，但这几个弯必须分一点注意力。",
          84,
          0.08,
          "Leclerc TR",
        ),
        C(
          "打断：我现在正在比赛",
          "让工程师只报最关键的一句。",
          87,
          0.045,
          "Leclerc TR",
        ),
        C("算了，我自己开", "放弃额外策略信息。", 82, 0.07, "Leclerc TR"),
      ],
      () => selected?.[0] === "Charles Leclerc",
      3,
    ),
    E(
      "ferrari-plans",
      "Ferrari：Plan A、B、C……",
      () =>
        `“Plan B.” 几秒后无线电又响：“Actually, Plan C.” 你还没到制动区，第三句已经来了：“Forget Plan C.” 天气和安全车窗口一起把策略表搅成了一锅字母汤。`,
      [
        C(
          "完全相信车队最后口令",
          "只执行最终确认的计划。",
          84,
          0.11,
          "Ferrari · PLAN",
        ),
        C("坚持当前策略", "拒绝继续追着字母表跑。", 82, 0.07, "Ferrari · PLAN"),
        C(
          "要求一句话说清楚",
          "让工程师只回答：进，还是不进。",
          89,
          0.05,
          "Ferrari · PLAN",
        ),
      ],
      () => selected?.[1] === "Ferrari" && state.round >= 4,
      3,
    ),
    E(
      "ferrari-duel",
      "Ferrari：两台红车，别把比赛毁了",
      () =>
        `你和队友都在领奖台竞争范围，速度差很小。车队没有直接指定一号车手，只说了一句：“You are free to race. Keep it clean.”`,
      [
        C("自由竞争", "允许轮对轮，但不碰。", 89, 0.1, "Ferrari · DUEL", {
          relation: 1,
        }),
        C(
          "先合作拉开身后",
          "等安全距离建立再比赛。",
          91,
          0.05,
          "Ferrari · TEAM",
          { relation: 3 },
        ),
        C(
          "要求错开策略",
          "用轮胎差异决定谁更快。",
          86,
          0.06,
          "Ferrari · STRATEGY",
          { relation: 2 },
        ),
      ],
      () => selected?.[1] === "Ferrari" && playerTeammateNearV23(2),
      4,
    ),

    /* Max / Lewis / Alonso / Sainz / Russell */
    E(
      "max-lovely",
      "Max TR：“Simply lovely.”",
      () =>
        `你刚刚完成一次难度很高的进攻，工程师还在报差距，无线电里只回了很短的一句：“Simply lovely.”`,
      [
        C(
          "继续保持进攻节奏",
          "趁状态正热继续追下一台车。",
          91,
          0.13,
          "Max TR",
          { posMod: -1 },
        ),
        C("先把轮胎带回来", "不让一次漂亮超车变成过热。", 85, 0.04, "Max TR"),
        C("开始充电", "为下一次进攻准备完整部署。", 87, 0.055, "Max TR"),
      ],
      () =>
        selected?.[0] === "Max Verstappen" && gridPosV23("Max Verstappen") <= 8,
      3,
    ),
    E(
      "max-tyres",
      "Max TR：轮胎“很糟”——然后圈速还是紫的",
      () =>
        `你连续抱怨后轴抓地和轮胎状态，工程师却看着计时屏沉默了一下：这一圈仍然是你个人最快。数据和体感给出了完全不同的答案。`,
      [
        C("相信感觉，提前进站", "避免轮胎突然断崖。", 81, 0.07, "Max TR"),
        C("看数据，继续跑", "既然圈速还在就延长 stint。", 89, 0.13, "Max TR"),
        C("再给一圈确认", "让数据和体感多一个样本。", 86, 0.08, "Max TR"),
      ],
      () => selected?.[0] === "Max Verstappen" && state.round >= 2,
      3,
    ),
    E(
      "ham-tyres",
      "Hamilton TR：“My tyres are gone.”",
      () =>
        `你告诉工程师轮胎已经没有抓地力。对面停顿了一秒，因为计时数据显示你的圈速只比最佳阶段慢了很少。`,
      [
        C("现在就进站", "相信车手体感。", 81, 0.07, "Hamilton TR"),
        C("继续撑五圈", "相信长距离轮胎管理。", 89, 0.12, "Hamilton TR"),
        C("先报后车差距", "把决定建立在赛道位置上。", 85, 0.06, "Hamilton TR"),
      ],
      () => selected?.[0] === "Lewis Hamilton",
      3,
    ),
    E(
      "alonso-gp2",
      "Alonso TR：动力降额，熟悉的吐槽差点出口",
      () =>
        `动力单元短暂降额，你刚准备在无线电里开始评价，工程师抢先一句：“We see it. We see it.” 现在首先要决定的是要不要继续高输出。`,
      [
        C("继续全力", "先保住位置，再处理温度。", 89, 0.22, "Alonso TR", {
          dnfRisk: 0.055,
        }),
        C("保护三圈", "接受一点圈速损失。", 77, 0.03, "Alonso TR"),
        C("只在直道恢复部署", "折中保持进攻能力。", 84, 0.09, "Alonso TR"),
      ],
      () => selected?.[0] === "Fernando Alonso",
      3,
    ),
    E(
      "alonso-space",
      "Alonso TR：“All the time you have to leave the space!”",
      () =>
        `你和前车连续并排两个弯，对方在出口把你压到白线边缘。无线电立刻打开，抱怨显然比下一段直道来得更快。`,
      [
        C("下一弯强硬反击", "让对方知道空间是相互的。", 90, 0.21, "Alonso TR", {
          posMod: -1,
          dnfRisk: 0.025,
        }),
        C("向赛事控制报告", "先保留证据，再继续比赛。", 82, 0.05, "Alonso TR"),
        C("不浪费时间吵", "只专注下一次超车。", 87, 0.06, "Alonso TR"),
      ],
      () =>
        selected?.[0] === "Fernando Alonso" &&
        gridPosV23("Fernando Alonso") <= 12,
      3,
    ),
    E(
      "sainz-smooth",
      "Sainz：Smooth Operator",
      () =>
        `这一段策略执行得异常干净：进站窗口、出站交通和轮胎启动全部对上。工程师忍不住夸了一句，语气明显已经在等你接那个老梗。`,
      [
        C("继续执行同样节奏", "把策略优势稳定兑现。", 90, 0.05, "Sainz TR", {
          posMod: -1,
        }),
        C("趁窗口再追一台", "把好策略变成更大的结果。", 92, 0.18, "Sainz TR", {
          posMod: -1,
        }),
        C("先保护轮胎", "不给漂亮策略留下反噬机会。", 83, 0.035, "Sainz TR"),
      ],
      () =>
        selected?.[0] === "Carlos Sainz" && gridPosV23("Carlos Sainz") <= 12,
      3,
    ),
    E(
      "rus-max",
      "赛道边界争议被报告了",
      () =>
        `你和 ${otherPairV23("George Russell", "Max Verstappen")} 刚刚完成一次边界非常模糊的攻防。工程师告诉你：“George is reporting something.” 赛事控制暂时还没有动作。`,
      [
        C("继续比赛", "不让无线电影响下一圈。", 86, 0.07, "赛道争议"),
        C("立刻解释自己的线路", "让车队提前准备申诉。", 82, 0.06, "赛道争议"),
        C("让他们去看录像", "不退让，也不继续争论。", 89, 0.1, "赛道争议"),
      ],
      () => pairSelectedNearV23("George Russell", "Max Verstappen", 2),
      4,
    ),

    /* Hadjar */
    E(
      "hadjar-max",
      "Hadjar：前面是 Max",
      () =>
        `工程师提醒你，前车是 Max。没有额外队令，但红牛显然希望你不要因为身份关系改变自己的判断。`,
      [
        C("正常进攻", "把他当任何一台前车。", 90, 0.17, "Hadjar · RB", {
          posMod: -1,
        }),
        C("利用 DRS 一起向前", "先跟住更快节奏。", 87, 0.05, "Hadjar · RB", {
          relation: 2,
        }),
        C("保守跟随", "把完整赛车带回终点。", 77, 0.035, "Hadjar · RB"),
      ],
      () =>
        selected?.[0] === "Isack Hadjar" &&
        nearGridV23("Isack Hadjar", "Max Verstappen", 3),
      4,
    ),
    E(
      "hadjar-duel",
      "Red Bull：新老组合进入同一集团",
      () =>
        `两台 Red Bull 在积分区内连续跑了几圈。无线电只留下六个字：“No unnecessary risk.” 剩下的，由你们自己解决。`,
      [
        C(
          "干净自由比赛",
          "真正竞争，但不给车队事故。",
          89,
          0.09,
          "Red Bull · DUEL",
          { relation: 2 },
        ),
        C(
          "先共同追前车",
          "利用两车速度向前推进。",
          91,
          0.05,
          "Red Bull · TEAM",
          { relation: 3 },
        ),
        C(
          "抢第一拍",
          "谁先过谁就拿策略优先权。",
          92,
          0.2,
          "Red Bull · ATTACK",
          { relation: -2, posMod: -1 },
        ),
      ],
      () => selected?.[1] === "Red Bull Racing" && playerTeammateNearV23(2),
      4,
    ),

    /* Mercedes */
    E(
      "merc-positive",
      "Mercedes：可以比赛，但保持干净",
      () =>
        `Russell 与 Antonelli 的节奏非常接近。Mercedes 不想用队令过早冻结比赛，工程师明确告诉你们可以竞争，但不能让身后的车因此追上。`,
      [
        C("自由竞争", "保持公平且干净。", 89, 0.09, "Mercedes · DUEL", {
          relation: 2,
        }),
        C("先拉开第三名再打", "两车合作几圈。", 92, 0.04, "Mercedes · TEAM", {
          relation: 4,
        }),
        C(
          "错开策略",
          "让比赛通过轮胎窗口决定。",
          86,
          0.055,
          "Mercedes · STRATEGY",
          { relation: 2 },
        ),
      ],
      () => selected?.[1] === "Mercedes" && playerTeammateNearV23(2),
      4,
    ),
    E(
      "kimi-send",
      "Antonelli：工程师还没说完，人已经冲了",
      () =>
        `前车在制动点露出一个很小的空隙。工程师刚说到“Kimi, we think—”，你已经开始踩刹车往里线送。`,
      [
        C("既然进去了就完成它", "把动作做到底。", 93, 0.27, "Antonelli TR", {
          posMod: -1,
          dnfRisk: 0.04,
        }),
        C("中途收回来", "承认窗口不够大。", 76, 0.045, "Antonelli TR"),
        C("改成交叉线", "把临时冲动变成下一弯机会。", 87, 0.09, "Antonelli TR"),
      ],
      () =>
        selected?.[0] === "Kimi Antonelli" &&
        gridPosV23("Kimi Antonelli") <= 14,
      3,
    ),

    /* Aston Martin */
    E(
      "stroll-feedback",
      "Stroll：Lance，我们需要你的反馈",
      () =>
        `赛车在高速入弯时出现一种数据很难解释的轻微漂移。工程师连续询问方向盘、后轴和刹车感觉，希望你给出明确反馈。`,
      [
        C(
          "详细描述每个阶段",
          "信息完整，代价是无线电更繁忙。",
          86,
          0.05,
          "Stroll TR",
        ),
        C("只说“车很怪”", "让工程师自己从遥测找答案。", 81, 0.06, "Stroll TR"),
        C("让他们看数据", "停止讨论，专注驾驶。", 84, 0.07, "Stroll TR"),
      ],
      () => selected?.[0] === "Lance Stroll",
      2,
    ),
    E(
      "aston-share",
      "Aston Martin：老狐狸和少爷共享情报",
      () =>
        `两台 Aston Martin 使用接近的策略。Fernando 从前方反馈了一个轮胎温度窗口，车队问你是否愿意按队友信息调整驾驶。`,
      [
        C("采用队友反馈", "两台车共享信息。", 88, 0.04, "Aston · TEAM", {
          relation: 3,
        }),
        C(
          "只参考，不完全照做",
          "保留自己的驾驶判断。",
          85,
          0.045,
          "Aston · TEAM",
          { relation: 1 },
        ),
        C(
          "坚持自己的数据",
          "不让队友感觉改变你的比赛。",
          82,
          0.055,
          "Aston · SOLO",
        ),
      ],
      () => selected?.[1] === "Aston Martin" && playerTeammateNearV23(4),
      3,
    ),

    /* Williams */
    E(
      "williams-dual",
      "Williams：双核自由竞争",
      () =>
        `两台 Williams 的比赛速度几乎一样。车队没有指定核心车手，只提醒：“Race each other, just bring both cars home.”`,
      [
        C("自由竞争", "保持干净的队内比赛。", 89, 0.09, "Williams · DUEL", {
          relation: 2,
        }),
        C(
          "利用不同策略互相掩护",
          "一台压住车群，一台用新胎进攻。",
          91,
          0.06,
          "Williams · TEAM",
          { relation: 4 },
        ),
        C("先不互攻", "把积分位置锁住。", 82, 0.035, "Williams · SAFE", {
          relation: 2,
        }),
      ],
      () => selected?.[1] === "Williams" && playerTeammateNearV23(2),
      4,
    ),
    E(
      "albon-tyres",
      "Albon：轮胎到底还能不能跑",
      () =>
        `工程师认为轮胎已经接近进站窗口，你却感觉它还有速度。前方正好出现可能做 overcut 的净空。`,
      [
        C("相信自己继续跑", "赌轮胎还能撑出快圈。", 89, 0.17, "Albon TR", {
          posMod: -1,
        }),
        C("按车队计划进站", "放弃 overcut 风险。", 81, 0.055, "Albon TR"),
        C("只延长一圈", "用最小风险验证感觉。", 86, 0.09, "Albon TR"),
      ],
      () => selected?.[0] === "Alexander Albon",
      3,
    ),
    E(
      "sainz-clear",
      "Sainz TR：“Tell me what we are racing.”",
      () =>
        `车队给出的策略信息越来越模糊。你终于打断工程师，要求他们明确告诉你：今天到底在和哪台车、哪个位置比赛。`,
      [
        C("要求明确目标车", "策略组必须给出单一目标。", 89, 0.04, "Sainz TR"),
        C("自己根据差距判断", "不再等待策略墙整理信息。", 87, 0.08, "Sainz TR"),
        C("继续听完整信息", "保留所有数据。", 82, 0.055, "Sainz TR"),
      ],
      () => selected?.[0] === "Carlos Sainz",
      3,
    ),

    /* Alpine */
    E(
      "gasly-overperform",
      "Gasly：这台车今天居然能拿分？",
      () =>
        `赛车的赛道适配并不在前十，但你目前就在积分区。工程师承认这是明显超出模型的比赛，现在要决定是守住还是继续扩大结果。`,
      [
        C(
          "守住积分",
          "不把超预期比赛变成零分。",
          83,
          0.035,
          "Gasly · OVERPERFORM",
        ),
        C(
          "继续攻击",
          "既然已经超出模型，就再抢一个位置。",
          92,
          0.2,
          "Gasly · ATTACK",
          { posMod: -1 },
        ),
        C(
          "延长轮胎等待混乱",
          "让策略继续放大赛车上限。",
          87,
          0.13,
          "Gasly · STRATEGY",
        ),
      ],
      () =>
        selected?.[0] === "Pierre Gasly" && gridPosV23("Pierre Gasly") <= 12,
      3,
    ),
    E(
      "alpine-team",
      "Alpine：先把分带回来",
      () =>
        `两台 Alpine 都在积分边缘，身后车群速度更快。车队提出暂时合作防守，不要为了队内位置互相消耗轮胎。`,
      [
        C("合作守住车群", "共同保护积分。", 90, 0.04, "Alpine · TEAM", {
          relation: 4,
        }),
        C(
          "各自比赛",
          "不互相帮忙也不互相干扰。",
          83,
          0.055,
          "Alpine · NEUTRAL",
        ),
        C(
          "要求自己优先",
          "把车队资源向自己倾斜。",
          87,
          0.14,
          "Alpine · PRIORITY",
          { relation: -3 },
        ),
      ],
      () => selected?.[1] === "Alpine" && playerTeammateNearV23(3),
      4,
    ),
    E(
      "colapinto-crowd",
      "Colapinto：南美看台开始失控",
      () =>
        `每次经过主看台都能听见明显更大的欢呼。工程师提醒你别让情绪把轮胎和制动温度一起推过头。`,
      [
        C("借情绪全力进攻", "把主场式氛围转成速度。", 91, 0.2, "Colapinto TR", {
          posMod: -1,
        }),
        C("控制两圈再发力", "先把温度留在窗口。", 85, 0.055, "Colapinto TR"),
        C("完全按标准节奏", "不让看台改变比赛。", 79, 0.035, "Colapinto TR"),
      ],
      () =>
        selected?.[0] === "Franco Colapinto" &&
        ["圣保罗大奖赛", "墨西哥城大奖赛", "美国大奖赛"].includes(
          currentRaceNameV23(),
        ),
      3,
    ),

    /* Haas */
    E(
      "haas-duel",
      "Haas：两台车又开始硬碰硬",
      () =>
        `Ocon 和 Bearman 的节奏差很小，两台 Haas 已经开始互相占线路。工程师语气明显紧张：“Guys, remember we need both cars.”`,
      [
        C(
          "继续比赛但留一车宽",
          "允许竞争，同时保护双车。",
          88,
          0.1,
          "Haas · DUEL",
          { relation: 2 },
        ),
        C("错开策略", "避免继续轮对轮消耗。", 86, 0.055, "Haas · STRATEGY", {
          relation: 2,
        }),
        C("强硬抢位置", "先拿到队内赛道优势。", 92, 0.23, "Haas · HARD", {
          relation: -4,
          posMod: -1,
          dnfRisk: 0.035,
        }),
      ],
      () => selected?.[1] === "Haas F1 Team" && playerTeammateNearV23(2),
      4,
    ),
    E(
      "bearman-red",
      "Bearman：红车后视镜",
      () =>
        `前方是一台 Ferrari。工程师没有多说过去的故事，只提醒你：“这可能是今天最想完成的一次超车。”`,
      [
        C(
          "直接进攻",
          "把这次机会做成比赛亮点。",
          92,
          0.21,
          "Bearman · Ferrari",
          { posMod: -1 },
        ),
        C(
          "先跟一圈研究线路",
          "不因为对象特殊就乱出手。",
          86,
          0.055,
          "Bearman · Ferrari",
        ),
        C("利用 DRS 向前追", "先保持连接。", 84, 0.05, "Bearman · Ferrari"),
      ],
      () =>
        selected?.[0] === "Oliver Bearman" &&
        driverNearAnyV23(["Lewis Hamilton", "Charles Leclerc"], 3),
      4,
    ),
    E(
      "bearman-monza",
      "Bearman：这种红色压力，你以前见过",
      () =>
        `Monza 的红色看台和 Ferrari 就在附近。工程师用一句很轻的提醒告诉你：这种压力并不是第一次出现在你的职业生涯里。`,
      [
        C("把压力当经验", "正常完成比赛。", 87, 0.05, "Bearman TR"),
        C("主动追 Ferrari", "把回忆变成目标。", 91, 0.18, "Bearman TR", {
          posMod: -1,
        }),
        C("专注自己的比赛", "不让背景故事改变决策。", 83, 0.035, "Bearman TR"),
      ],
      () =>
        selected?.[0] === "Oliver Bearman" &&
        currentRaceNameV23() === "意大利大奖赛",
      3,
    ),
    E(
      "ocon-damage",
      "Ocon：比赛结束前才发现赛车一直有问题",
      () =>
        `你一直觉得转向中心有点奇怪。现在工程师终于确认某个悬挂/底板数据从前半程就已经异常——你实际上一直带着轻微损伤在跑。`,
      [
        C(
          "继续按当前节奏",
          "既然已经适应，就把它带到终点。",
          89,
          0.08,
          "Ocon · DAMAGE",
        ),
        C("减少压路肩", "保护受损部件。", 82, 0.04, "Ocon · DAMAGE"),
        C("继续全推", "不让损伤改变目标。", 91, 0.2, "Ocon · DAMAGE", {
          dnfRisk: 0.035,
        }),
      ],
      () => selected?.[0] === "Esteban Ocon" && state.round >= 3,
      3,
    ),

    /* Racing Bulls */
    E(
      "lawson-attack",
      "Lawson：我们不是来排队的",
      () =>
        `前方是一台理论上更快的赛车，但这几圈速度差并不明显。工程师问你要不要接受当前位置，你显然不太喜欢这个问题。`,
      [
        C("强硬进攻", "不因为对手更强就排队。", 92, 0.23, "Lawson · HARD", {
          posMod: -1,
          dnfRisk: 0.035,
        }),
        C(
          "等对方轮胎掉下来",
          "用耐心换更高成功率。",
          86,
          0.07,
          "Lawson · WAIT",
        ),
        C("继续施压但不出手", "逼对方先犯错。", 88, 0.1, "Lawson · PRESSURE"),
      ],
      () => selected?.[0] === "Liam Lawson" && gridPosV23("Liam Lawson") <= 14,
      3,
    ),
    E(
      "rb-juniors",
      "Racing Bulls：总部正在看",
      () =>
        `两名年轻车手在赛道上相遇。车队没有阻止竞争，只提醒一句：“总部正在看。” 这句话显然没有让任何人更放松。`,
      [
        C("干净竞争", "把表现建立在完整完赛上。", 88, 0.1, "RB JUNIORS", {
          relation: 2,
        }),
        C("先合作追前车", "别把时间浪费在队内。", 90, 0.05, "RB JUNIORS", {
          relation: 4,
        }),
        C("必须先证明自己", "把内部比较放在第一位。", 92, 0.24, "RB JUNIORS", {
          relation: -4,
          posMod: -1,
          dnfRisk: 0.035,
        }),
      ],
      () => selected?.[1] === "Racing Bulls" && playerTeammateNearV23(2),
      4,
    ),
    E(
      "lindblad-f1",
      "Lindblad TR：“这是 F1，不是模拟器。”",
      () =>
        `安全车、天气和策略信息同时涌进无线电。工程师说了太多数字，你必须在几秒里决定到底听哪一个。`,
      [
        C("完全听车队", "让策略墙处理复杂局面。", 82, 0.08, "Lindblad TR"),
        C("自己判断", "用赛道感觉做决定。", 88, 0.16, "Lindblad TR"),
        C(
          "只问最关键的信息",
          "要求工程师只给轮胎和差距。",
          89,
          0.06,
          "Lindblad TR",
        ),
      ],
      () => selected?.[0] === "Arvid Lindblad",
      3,
    ),

    /* Audi */
    E(
      "hulkenberg-podium",
      "Hülkenberg：领奖台真的就在前面",
      () =>
        `比赛已经过半，你处在 P3–P5 的竞争范围。工程师语气比平时谨慎得多：“This is a real opportunity.” 现在每个策略决定都会决定这个机会是不是能活到终点。`,
      [
        C(
          "优先守领奖台窗口",
          "不为更高位置冒不必要风险。",
          88,
          0.055,
          "Hülkenberg · PODIUM",
        ),
        C(
          "继续攻击前车",
          "机会来了就不只满足于 P3。",
          93,
          0.2,
          "Hülkenberg · PODIUM",
          { posMod: -1 },
        ),
        C(
          "提前覆盖 undercut",
          "保护赛道位置。",
          90,
          0.08,
          "Hülkenberg · PODIUM",
        ),
      ],
      () =>
        selected?.[0] === "Nico Hulkenberg" &&
        gridPosV23("Nico Hulkenberg") <= 6,
      5,
    ),
    E(
      "audi-mentor",
      "Audi：师徒局",
      () =>
        `Nico 与 Gabriel 在同一集团。前车的轮胎管理数据非常清晰，车队问后车是否愿意先学习节奏，而不是马上开始队内攻击。`,
      [
        C("共享轮胎节奏", "用队友数据改善后程。", 90, 0.04, "Audi · TEAM", {
          relation: 4,
        }),
        C("保持各自节奏", "不刻意合作。", 83, 0.05, "Audi · NEUTRAL"),
        C("现在就开放竞争", "用赛道决定谁更快。", 88, 0.14, "Audi · DUEL", {
          relation: -1,
        }),
      ],
      () => selected?.[1] === "Audi" && playerTeammateNearV23(3),
      4,
    ),
    E(
      "bortoleto-calm",
      "Bortoleto TR：“Gabriel，保持冷静。”",
      () =>
        `刚才的攻防让轮胎和情绪都升了温。工程师连续两次提醒：“Gabriel, keep calm.” 前车仍然在攻击范围。`,
      [
        C("继续进攻，我没问题", "相信自己的判断。", 90, 0.17, "Bortoleto TR", {
          posMod: -1,
        }),
        C("稳定两圈", "把温度和节奏重新拉回窗口。", 85, 0.045, "Bortoleto TR"),
        C("要求更少无线电", "减少干扰。", 84, 0.06, "Bortoleto TR"),
      ],
      () => selected?.[0] === "Gabriel Bortoleto",
      3,
    ),
    E(
      "alonso-bortoleto",
      "一场很有信息量的轮对轮",
      () =>
        `你和 ${otherPairV23("Fernando Alonso", "Gabriel Bortoleto")} 在同一段赛道。工程师没有要求任何特殊处理，只提醒这会是一场很有信息量的轮对轮。`,
      [
        C("干净地正面比赛", "彼此留足空间。", 89, 0.075, "干净轮对轮", {
          posMod: -1,
        }),
        C("先跟随学习线路", "不急着第一时间出手。", 86, 0.045, "干净轮对轮"),
        C(
          "用策略而不是轮对轮",
          "避免在赛道上直接冲突。",
          84,
          0.04,
          "干净轮对轮",
        ),
      ],
      () => pairSelectedNearV23("Fernando Alonso", "Gabriel Bortoleto", 3),
      4,
    ),

    /* Cadillac */
    E(
      "perez-tyres",
      "Perez：长 stint 的轮胎开始兑现",
      () =>
        `其他赛车已经明显掉速，你的轮胎却仍保持在工作窗口。工程师确认 overcut 正在形成，这是你最擅长的比赛类型之一。`,
      [
        C("继续延长 stint", "把轮胎优势拉到最大。", 91, 0.11, "Perez · TYRES", {
          posMod: -1,
        }),
        C("现在 push 两圈", "在进站前榨出速度。", 92, 0.18, "Perez · TYRES", {
          posMod: -1,
        }),
        C(
          "提前进站锁位置",
          "不让安全车破坏当前收益。",
          84,
          0.055,
          "Perez · TYRES",
        ),
      ],
      () => selected?.[0] === "Sergio Perez" && state.round >= 2,
      3,
    ),
    E(
      "perez-comeback",
      "Perez：前面还有机会",
      () =>
        `你已经从较后的发车位追回不少位置。工程师开始一台一台报前方差距，意思很明显：今天还没有结束。`,
      [
        C("继续追", "把 comeback 做到底。", 92, 0.18, "Perez · COMEBACK", {
          posMod: -1,
        }),
        C(
          "保护现有积分",
          "先把已经追回的位置带回去。",
          82,
          0.035,
          "Perez · COMEBACK",
        ),
        C(
          "充电一圈再发力",
          "准备最后一次大进攻。",
          88,
          0.065,
          "Perez · COMEBACK",
        ),
      ],
      () => selected?.[0] === "Sergio Perez" && gridPosV23("Sergio Perez") >= 8,
      3,
    ),
    E(
      "bottas-james",
      "Bottas TR：又有人想讨论位置",
      () =>
        `工程师小心地打开无线电：“Valtteri，我们需要讨论位置。” 你沉默了两秒。这个句式听起来实在太熟悉。`,
      [
        C(
          "配合，但要求条件",
          "如果队友追不上必须换回来。",
          84,
          0.06,
          "Bottas TR",
          { relation: 2 },
        ),
        C("直接配合", "不在无线电里浪费时间。", 80, 0.04, "Bottas TR", {
          relation: 4,
          posMod: 1,
        }),
        C("今天不接受", "保住自己的比赛。", 90, 0.18, "Bottas TR", {
          relation: -4,
        }),
      ],
      () => selected?.[0] === "Valtteri Bottas" && playerTeammateNearV23(3),
      4,
    ),
    E(
      "bottas-fastlap",
      "Bottas：最后几圈，免费停站窗口",
      () =>
        `前后位置都比较稳定，维修区计算出你拥有一次几乎免费的停站窗口。工程师问要不要换新软胎，把最后几圈当成一场单圈计时。`,
      [
        C("换软胎去冲", "把最后几圈当排位。", 91, 0.12, "Bottas · FAST LAP"),
        C("不进站", "不要为了娱乐冒任何风险。", 80, 0.025, "Bottas · SAFE"),
        C(
          "如果窗口仍免费就进",
          "再确认一次差距。",
          86,
          0.055,
          "Bottas · OPTION",
        ),
      ],
      () =>
        selected?.[0] === "Valtteri Bottas" &&
        gridPosV23("Valtteri Bottas") >= 8,
      2,
    ),

    /* old rivals / general */
    E(
      "ocon-gasly",
      "熟悉的对手再次出现在后视镜里",
      () =>
        `你和 ${otherPairV23("Esteban Ocon", "Pierre Gasly")} 再次在赛道上相邻。现在已经不是队友，但两边工程师显然都记得过去那些不必要的事故。`,
      [
        C("强硬进攻", "不因为旧历史改变比赛方式。", 91, 0.24, "强硬攻防", {
          posMod: -1,
          dnfRisk: 0.04,
        }),
        C("明确留足空间", "让今天只是一场比赛。", 86, 0.065, "留足空间"),
        C("等对方犯错", "不主动制造第二个故事。", 82, 0.045, "等待失误"),
      ],
      () => pairSelectedNearV23("Esteban Ocon", "Pierre Gasly", 2),
      4,
    ),
    E(
      "russell-penalty",
      "Russell TR：“Penalty?”",
      () =>
        `刚刚的轮对轮存在明显的赛道边界争议。你还没进入下一段直道，无线电已经问了一句：“Is that a penalty?”`,
      [
        C("继续专注比赛", "让车队自己处理申诉。", 87, 0.045, "Russell TR"),
        C("不断追问", "要求工程师更新赛事控制消息。", 80, 0.08, "Russell TR"),
        C(
          "先准备自己的解释",
          "如果被调查，车队有完整版本。",
          85,
          0.055,
          "Russell TR",
        ),
      ],
      () =>
        selected?.[0] === "George Russell" &&
        gridPosV23("George Russell") <= 12,
      3,
    ),
    E(
      "piastri-damage",
      "Piastri：极度平静的事故报告",
      () =>
        `你刚刚和前车轻轻擦到。工程师明显紧张地问赛车情况，你只回了一句：“Yeah. A little bit of damage.” 遥测显示前翼负载已经不太对称。`,
      [
        C("继续跑", "相信损伤还在可控范围。", 86, 0.13, "Piastri TR"),
        C("提前换前翼", "用位置换完整赛车。", 78, 0.045, "Piastri TR", {
          posMod: 2,
        }),
        C("再观察两圈", "先确认圈速损失。", 83, 0.075, "Piastri TR"),
      ],
      () => selected?.[0] === "Oscar Piastri",
      3,
    ),
    E(
      "norris-self",
      "Norris：无线电先骂了自己一句",
      () =>
        `你在上一弯锁胎，错过了一个本来很好的超车机会。无线电打开时，你先把责任揽到了自己身上，工程师还没来得及说话。`,
      [
        C(
          "下一圈立刻追回",
          "错误已经发生，不让它继续影响比赛。",
          90,
          0.15,
          "Norris TR",
          { posMod: -1 },
        ),
        C("先重置节奏", "用两圈把轮胎和注意力拉回来。", 85, 0.045, "Norris TR"),
        C("让工程师只报差距", "停止复盘，继续比赛。", 87, 0.055, "Norris TR"),
      ],
      () => selected?.[0] === "Lando Norris",
      3,
    ),
    E(
      "young-champion",
      "年轻车手：前面是一位世界冠军",
      () =>
        `工程师提醒你，前方是 ${CHAMPS_V23.find((n) => n !== selected[0] && nearGridV23(selected[0], n, 3)) || "一位世界冠军"}。速度差很小，这可能会成为你赛季里最值得记住的一次进攻。`,
      [
        C("把他当普通对手", "看见机会就进攻。", 92, 0.19, "YOUNG DRIVER", {
          posMod: -1,
        }),
        C("先跟一圈学习", "用对方线路判断抓地力。", 86, 0.045, "YOUNG DRIVER"),
        C("不要为了名字冒险", "优先完成自己的比赛。", 80, 0.03, "YOUNG DRIVER"),
      ],
      () => isYoungV23(selected?.[0]) && driverNearAnyV23(CHAMPS_V23, 3),
      4,
    ),
    E(
      "box-stayout",
      "TR：Box, box——不，Stay out!",
      () =>
        `你已经把赛车指向维修区入口，工程师突然改口：“Stay out! Stay out!” 留给你改变线路的距离只剩最后几十米。`,
      [
        C("立刻回赛道", "需要一次非常干净的临场反应。", 87, 0.12, "TR · CHAOS"),
        C("既然来了就进站", "拒绝最后一秒改变决定。", 82, 0.06, "TR · PIT", {
          posMod: 1,
        }),
        C(
          "先问一句你们到底在干嘛",
          "无线电很有道理，但弯不会等你。",
          79,
          0.1,
          "TR · ??",
        ),
      ],
      () => state.round >= 2,
      1,
    ),
  ];

  function materializeDynamicV23(e) {
    return {
      ...e,
      scene: typeof e.scene === "function" ? e.scene() : e.scene,
      choices: e.choices.map((x) => [...x.slice(0, 5), { ...(x[5] || {}) }]),
      special: true,
    };
  }
  function dynamicSpecialV23() {
    if (!selected || !state?.weekend?.qualResult) return null;
    if (!state.dynamicEventHistoryV23) state.dynamicEventHistoryV23 = {};
    const eligible = DYNAMIC_SPECIALS_V23.filter((e) => {
      try {
        const last = Number(state.dynamicEventHistoryV23[e.id] || -99);
        return state.round - last >= 5 && e.when();
      } catch (_) {
        return false;
      }
    });
    if (!eligible.length) return null;
    const top = Math.max(...eligible.map((e) => e.priority || 1));
    const chance = top >= 5 ? 0.56 : top >= 4 ? 0.47 : top >= 3 ? 0.38 : 0.28;
    if (Math.random() > chance) return null;
    const weighted = [];
    eligible.forEach((e) => {
      for (let i = 0; i < (e.priority || 1); i++) weighted.push(e);
    });
    const pick = weighted[Math.floor(Math.random() * weighted.length)];
    state.dynamicEventHistoryV23[pick.id] = state.round;
    return materializeDynamicV23(pick);
  }
  const chooseRaceEventsV23Prev = chooseRaceEventsV10;
  chooseRaceEventsV10 = function () {
    const queue = chooseRaceEventsV23Prev();
    const d = dynamicSpecialV23();
    if (d) {
      /* one conditional character/pair Easter egg per GP; it replaces a generic slot when needed */
      const genericIndex = queue.findIndex((x, i) => i > 0 && !x.special);
      if (queue.length >= 5 && genericIndex >= 0) queue.splice(genericIndex, 1);
      queue.splice(Math.min(1, queue.length), 0, d);
    }
    return queue.slice(0, 5);
  };
  window.DYNAMIC_SPECIALS_V23 = DYNAMIC_SPECIALS_V23;

  /* Restore McLaren-specific team-order flavor while keeping V16 relationship mechanics. */
  const makeTeamOrderV23Prev = makeTeamOrderEventV10;
  makeTeamOrderEventV10 = function () {
    const tm = teammateV10();
    if (selected?.[1] === "McLaren" && tm) {
      const close =
        playerTeammateNearV23(3) || pointsCloseV23(selected[0], tm[0], 25);
      const rel = state.teamRelation || 50;
      if (close && Math.random() < (rel >= 60 ? 0.34 : 0.24)) {
        return {
          special: true,
          title:
            rel >= 55
              ? "PAPAYA RULES：自由比赛，但两台车都要回来"
              : "PAPAYA RULES：车队开始要求边界",
          scene: `你和 ${tm[0]} 进入同一策略窗口。当前队内关系 ${Math.round(rel)}/100。车队允许竞争，但如果关系已经紧张，这条规则会更接近“最后警告”而不是自由比赛。`,
          choices: [
            [
              "接受 Papaya Rules，留足空间",
              "继续竞争，但避免低成功率强插。",
              82,
              0.06,
              "McLaren · PAPAYA",
              { order: true, orderV16: "conditional" },
            ],
            [
              "先合作拉开后车",
              "把两台车的整体结果放在第一位。",
              88,
              0.04,
              "McLaren · TEAM",
              { order: true, orderV16: "cooperate" },
            ],
            [
              "我要现在比赛",
              "不接受临时冻结位置。",
              91,
              rel >= 65 ? 0.18 : 0.31,
              "McLaren · HARD",
              { order: true, orderV16: "refuse", clash: true },
            ],
          ],
        };
      }
    }
    return makeTeamOrderV23Prev();
  };

  function teamOrderV23() {
    return Object.keys(teams).sort(
      (a, b) =>
        (state.teamStandings?.[b] || 0) - (state.teamStandings?.[a] || 0) ||
        (teams[b]?.ovr || 0) - (teams[a]?.ovr || 0),
    );
  }
  function teamRankV23(team) {
    return Math.max(1, teamOrderV23().indexOf(team) + 1);
  }
  function marketOpenV23() {
    return (
      !!selected &&
      state.round >= 14 &&
      state.round <= calendar.length &&
      !seasonCompleteV14()
    );
  }
  function contractChanceV23(team, kind) {
    const rank = driverRankV10(),
      pts = state.driverStandings?.[selected[0]] || 0,
      wins = state.driverSeasonStats?.[selected[0]]?.wins || 0;
    const tr = teamRankV23(team),
      cur = teamRankV23(selected[1]),
      ovr = selected[2] || 80;
    let base =
      kind === "renew"
        ? 0.8
        : tr <= 3
          ? 0.22
          : tr <= 6
            ? 0.43
            : tr <= 9
              ? 0.62
              : 0.74;
    const performance =
      (12 - rank) * 0.043 +
      Math.min(0.22, pts / 400) +
      Math.min(0.11, wins * 0.035);
    if (kind !== "renew") {
      const jump = cur - tr;
      if (jump > 0) base -= jump * 0.05;
      else if (jump < 0) base += Math.min(0.16, Math.abs(jump) * 0.04);
      if (tr >= 8) base += 0.06; /* smaller teams deliberately easier to sign */
      if (ovr >= 90 && tr <= 3) base -= 0.05;
    } else base += 0.05;
    return clampV14(base + performance, 0.18, 0.96);
  }
  function generateOffersV23() {
    if (!marketOpenV23()) {
      state.marketOffersV17 = [];
      return [];
    }
    if (
      state.marketOffersV17?.length &&
      state.marketOfferRoundV17 === state.round
    )
      return state.marketOffersV17;
    const order = teamOrderV23(),
      current = selected[1],
      ci = Math.max(0, order.indexOf(current)),
      rank = driverRankV10();
    let ambitious = order.filter((t, i) => t !== current && i < ci);
    if (!ambitious.length)
      ambitious = order
        .filter((t) => t !== current)
        .slice(0, Math.min(5, order.length));
    if (rank > 10) ambitious = ambitious.slice(-Math.min(3, ambitious.length));
    const best =
      ambitious[Math.floor(Math.random() * Math.max(1, ambitious.length))] ||
      order.find((t) => t !== current);
    const safePool = order.filter(
      (t, i) =>
        t !== current && t !== best && (i >= Math.max(0, ci - 1) || i >= 6),
    );
    const safe =
      safePool[Math.floor(Math.random() * Math.max(1, safePool.length))] ||
      order.find((t) => t !== current && t !== best);
    state.marketOffersV17 = [
      { team: best, kind: "team", type: "best", title: "向上挑战" },
      { team: safe, kind: "team", type: "safe", title: "更容易达成" },
      { team: current, kind: "renew", type: "renew", title: "当前车队续约" },
    ]
      .filter((o) => o.team)
      .map((o) => ({
        ...o,
        chance: contractChanceV23(o.team, o.kind),
        term: "1+1",
      }));
    state.marketOfferRoundV17 = state.round;
    return state.marketOffersV17;
  }
  function chanceTextV23(c) {
    return c >= 0.82
      ? "很高"
      : c >= 0.67
        ? "较高"
        : c >= 0.48
          ? "中等"
          : "偏低";
  }
  function dealYearsV23() {
    const y = seasonYearV11();
    return { start: y + 1, guaranteedEnd: y + 1, optionEnd: y + 2 };
  }
  function openContractConfirmV23(team, kind) {
    if (!marketOpenV23() || state.contract?.nextTeam) return;
    if (state.contractAttemptRoundV17 === state.round) {
      showToastV14("本场大奖赛已经尝试过一次合同 · 下站再谈");
      return;
    }
    const chance = contractChanceV23(team, kind),
      d = dealYearsV23();
    document.getElementById("modalTitle").textContent = "确认 1+1 合同谈判";
    document.getElementById("modalBody").innerHTML =
      `<div class="contractConfirmV17"><div class="kicker">TWO-YEAR 1+1 DEAL</div><h2>${kind === "renew" ? "续约" : "签约"} · ${team}</h2><p>新合同采用 <b>1+1</b>：${d.start} 为保证赛季，${d.optionEnd} 为选项赛季。完成第一个保证赛季后，你可以再次进入车手市场，不会被第二年选项强制锁死。</p><div class="contractConfirmMeta"><div><span>成功概率</span><b>${Math.round(chance * 100)}%</b></div><div><span>合同结构</span><b>${d.start} + ${d.optionEnd} OPTION</b></div></div><div class="contractConfirmActions"><button class="btn" onclick="closeOverlay()">取消</button><button class="btn primary" onclick="confirmContractAttemptV23('${String(team).replace(/'/g, "\\'")}','${kind}')">确认尝试</button></div></div>`;
    document.getElementById("overlay").classList.add("open");
  }
  function confirmContractAttemptV23(team, kind) {
    if (
      state.contractAttemptRoundV17 === state.round ||
      state.contract?.nextTeam
    ) {
      closeOverlay();
      return;
    }
    state.contractAttemptRoundV17 = state.round;
    const chance = contractChanceV23(team, kind),
      ok = Math.random() < chance,
      d = dealYearsV23();
    if (ok) {
      state.contract.nextTeam = team;
      state.contract.signedRound = state.round;
      state.contract.nextEnd = d.optionEnd;
      state.pendingPlayerDealV23 = {
        team,
        start: d.start,
        guaranteedEnd: d.guaranteedEnd,
        optionEnd: d.optionEnd,
        type: "1+1",
      };
      state.contract.history.unshift(
        `R${String(state.round).padStart(2, "0")} · ${kind === "renew" ? "续约成功" : "签约成功"} · ${team} · ${d.start}-${d.optionEnd} 1+1`,
      );
      showToastV14(`合同成功 · ${team} · ${d.start}-${d.optionEnd} 1+1`);
    } else {
      state.contract.history.unshift(
        `R${String(state.round).padStart(2, "0")} · 谈判失败 · ${team}`,
      );
      showToastV14(`${team} 谈判失败 · 下一站可再次尝试`);
    }
    closeOverlay();
    renderContractsV10();
    renderHub();
    autosave();
  }
  window.openContractConfirmV23 = openContractConfirmV23;
  window.confirmContractAttemptV23 = confirmContractAttemptV23;
  window.openContractConfirmV17 = openContractConfirmV23;
  window.confirmContractAttemptV17 = confirmContractAttemptV23;
  try {
    openContractConfirmV17 = openContractConfirmV23;
    confirmContractAttemptV17 = confirmContractAttemptV23;
  } catch (_) {}

  renderContractsV10 = function () {
    const y = seasonYearV11(),
      open = marketOpenV23(),
      signed = state.contract?.nextTeam,
      used = state.contractAttemptRoundV17 === state.round,
      rank = driverRankV10();
    const deal = state.playerDealV23;
    document.querySelector("#contracts .modulehead .kicker").textContent =
      "DRIVER MARKET · 1+1 CONTRACTS";
    document.querySelector("#contracts .modulehead h1").textContent =
      `车手市场 · ${y + 1}`;
    const currentDeal =
      deal && y >= deal.start && y <= deal.optionEnd
        ? `${deal.start} 保证 + ${deal.optionEnd} 选项`
        : `${y} 当前席位`;
    if (!open) {
      document.getElementById("contractContent").innerHTML =
        `<div class="contractV17Head"><div><div class="kicker">1+1 CONTRACT SYSTEM</div><h2>市场尚未开放</h2><p>所有新签合同均为两年框架：第一年保证 + 第二年选项。完成保证赛季后即可再次签约或换队。</p><span class="contractTermV23">${currentDeal}</span></div><div class="contractV17State"><span>当前排名</span><b>P${rank}</b></div></div><div class="contractClosedBox">夏休期 R14 开放，距离市场还有 ${Math.max(0, 14 - state.round)} 站。</div>`;
      return;
    }
    const offers = generateOffersV23();
    const lock =
      used && !signed
        ? `<div class="contractRoundLockV17">本场大奖赛的合同尝试已经用完。下一站可重新谈判。</div>`
        : "";
    document.getElementById("contractContent").innerHTML =
      `<div class="contractV17Head"><div><div class="kicker">1+1 DRIVER MARKET</div><h2>${signed ? `已确定 ${y + 1} · ${signed}` : "本周合同选择"}</h2><p>每份新合同都是 <b>${y + 1} 保证 + ${y + 2} 选项</b>。第一年结束后即可再次进入市场；小车队的谈判门槛也明显低于争冠车队。</p><span class="contractTermV23">当前：${currentDeal}</span></div><div class="contractV17State"><span>当前排名</span><b>P${rank}</b></div></div><div class="contractRuleV23"><b>1+1 规则：</b>${y + 1} 为保证赛季，${y + 2} 为选项赛季。即使存在第二年选项，你在完成第一个赛季后仍可为下一年签约其他车队。</div>${lock}<div class="contractOfferGridV17">${offers.map((o) => `<div class="contractOfferV17 ${o.type}"><div class="kicker">${o.title}</div><h3>${o.team}</h3><div class="contractLengthV23">${y + 1} + ${y + 2} OPTION · 1+1</div><p>${o.kind === "renew" ? "继续当前项目，但仍保留第一年后重新进入市场的自由。" : teamRankV23(o.team) >= 8 ? "中后排车队签约门槛较低，更愿意给表现中的车手机会。" : "车队级别越高，对排名、积分和基础能力的要求越严格。"}</p><div class="contractChanceV17"><span>成功率 · ${chanceTextV23(o.chance)}</span><b>${Math.round(o.chance * 100)}%</b></div><button class="mini" ${signed || used ? "disabled" : ""} onclick="openContractConfirmV23('${String(o.team).replace(/'/g, "\\'")}','${o.kind}')">${signed === o.team ? "已签 1+1" : used ? "本周已尝试" : o.kind === "renew" ? "尝试续约" : "尝试签约"}</button></div>`).join("")}</div>`;
  };
  window.renderContractsV10 = renderContractsV10;

  /* Preserve 1+1 term across rollover. Full-season auto signings are upgraded here too. */
  const startNextSeasonV23Prev = startNextSeasonV11;
  startNextSeasonV11 = function () {
    const y = seasonYearV11();
    if (state.contract?.nextTeam) {
      if (!state.contract.nextEnd) state.contract.nextEnd = y + 2;
      if (!state.pendingPlayerDealV23)
        state.pendingPlayerDealV23 = {
          team: state.contract.nextTeam,
          start: y + 1,
          guaranteedEnd: y + 1,
          optionEnd: y + 2,
          type: "1+1",
        };
    }
    const pending = state.pendingPlayerDealV23
      ? JSON.parse(JSON.stringify(state.pendingPlayerDealV23))
      : null;
    startNextSeasonV23Prev();
    if (selected && pending && seasonYearV11() === pending.start) {
      state.playerDealV23 = pending;
      state.pendingPlayerDealV23 = null;
      const pc = contractInfoV11(selected[0]);
      pc.end = pending.optionEnd;
      pc.option = true;
      pc.label = `${pending.start} + ${pending.optionEnd} 选项`;
      pc.note = "1+1：第一年保证，第二年选项；完成第一年后可重新签约";
    }
    renderHub();
    autosave();
  };
  window.startNextSeasonV11 = startNextSeasonV11;

  /* Hub contract badge and finale copy. */
  const renderHubV23Prev = renderHub;
  renderHub = function () {
    const r = renderHubV23Prev.apply(this, arguments);
    const st = document.getElementById("contractStatus");
    if (st) {
      st.textContent = state.contract?.nextTeam
        ? `已签 ${state.contract.nextTeam} · 1+1`
        : marketOpenV23()
          ? state.contractAttemptRoundV17 === state.round
            ? "本周已尝试"
            : "1+1 市场开放"
          : "R14 开放";
    }
    return r;
  };
  window.renderHub = renderHub;
  const showSeasonFinaleV23Prev = showSeasonFinaleV10;
  showSeasonFinaleV10 = function () {
    if (state.contract?.nextTeam && !state.contract.nextEnd) {
      const y = seasonYearV11();
      state.contract.nextEnd = y + 2;
      if (!state.pendingPlayerDealV23)
        state.pendingPlayerDealV23 = {
          team: state.contract.nextTeam,
          start: y + 1,
          guaranteedEnd: y + 1,
          optionEnd: y + 2,
          type: "1+1",
        };
    }
    showSeasonFinaleV23Prev();
    const el = document.getElementById("finalContract");
    if (el && state.contract?.nextTeam) {
      const y = seasonYearV11();
      el.insertAdjacentHTML(
        "beforeend",
        `<br><b>合同：</b>${y + 1} 保证 + ${y + 2} 选项（1+1）；完成 ${y + 1} 后可再次进入市场。`,
      );
    }
  };
  window.showSeasonFinaleV10 = showSeasonFinaleV10;

  /* New-career / save migration. */
  const startCareerV23Prev = startCareer;
  startCareer = function () {
    startCareerV23Prev();
    state.dynamicEventHistoryV23 = {};
    state.playerDealV23 = null;
    state.pendingPlayerDealV23 = null;
    renderHub();
    autosave();
  };
  window.startCareer = startCareer;
  const restoreSnapshotV23Prev = restoreSnapshot;
  restoreSnapshot = function (data) {
    const ok = restoreSnapshotV23Prev(data);
    if (ok) {
      if (!state.dynamicEventHistoryV23) state.dynamicEventHistoryV23 = {};
      if (state.playerDealV23 === undefined) state.playerDealV23 = null;
      if (state.pendingPlayerDealV23 === undefined)
        state.pendingPlayerDealV23 = null;
      renderHub();
    }
    return ok;
  };
  window.restoreSnapshot = restoreSnapshot;
})();

/* v2-4-portrait-layout-script */

(function () {
  function resultPortraitHTMLV24(name) {
    try {
      return typeof portraitHTMLV2 === "function"
        ? portraitHTMLV2(name)
        : '<div class="v2PortraitFallback">' +
            (name?.charAt?.(0) || "?") +
            "</div>";
    } catch (e) {
      return (
        '<div class="v2PortraitFallback">' +
        (name?.charAt?.(0) || "?") +
        "</div>"
      );
    }
  }

  const renderProfileV24Prev = renderProfile;
  renderProfile = function () {
    renderProfileV24Prev();
    if (!selected) return;
    const box = document.querySelector("#profile .profilebox");
    if (!box) return;
    box.classList.add("v2ProfileBox");
    let p = box.querySelector(".profilePortraitV2");
    if (!p) {
      p = document.createElement("div");
      p.className = "profilePortraitV2";
      box.appendChild(p);
    }
    p.innerHTML = resultPortraitHTMLV24(selected[0]);
  };
  window.renderProfile = renderProfile;

  const renderHubV24Prev = renderHub;
  renderHub = function () {
    const r = renderHubV24Prev.apply(this, arguments);
    if (selected) {
      const card = document.querySelector("#career .driverhubclick");
      if (card) {
        let p = card.querySelector(".hubPortraitV2");
        if (!p) {
          p = document.createElement("div");
          p.className = "hubPortraitV2";
          card.appendChild(p);
        }
        p.innerHTML = resultPortraitHTMLV24(selected[0]);
      }
    }
    return r;
  };
  window.renderHub = renderHub;

  const openCareerDriverDetailV24Prev = openCareerDriverDetail;
  openCareerDriverDetail = function () {
    openCareerDriverDetailV24Prev();
    if (!selected) return;
    const detail = document.querySelector("#modalBody .driverdetail");
    if (!detail) return;
    detail.classList.add("v2DetailPortrait");
    let p = detail.querySelector(".driverDetailPortraitV2");
    if (!p) {
      p = document.createElement("div");
      p.className = "driverDetailPortraitV2";
      detail.appendChild(p);
    }
    p.innerHTML = resultPortraitHTMLV24(selected[0]);
  };
  window.openCareerDriverDetail = openCareerDriverDetail;

  const renderWeekendResultV24Prev = renderWeekendResult;
  renderWeekendResult = function () {
    renderWeekendResultV24Prev();
    if (!selected) return;
    const finish = document.querySelector("#weekendresult .finishCard");
    const summary = document.querySelector("#weekendresult .resultSummary");
    if (finish) {
      let p = finish.querySelector(".resultPortraitV24");
      if (!p) {
        p = document.createElement("div");
        p.className = "resultPortraitV24";
        finish.appendChild(p);
      }
      p.innerHTML = resultPortraitHTMLV24(selected[0]);
    }
    if (summary) {
      let p2 = summary.querySelector(".resultReportPortraitV24");
      if (!p2) {
        p2 = document.createElement("div");
        p2.className = "resultReportPortraitV24";
        summary.appendChild(p2);
      }
      p2.innerHTML = resultPortraitHTMLV24(selected[0]);
    }
  };
  window.renderWeekendResult = renderWeekendResult;
})();

/* v2-8-cleanup-script */

(function () {
  function escV28(v) {
    return String(v ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  }
  try {
    Object.keys(DRIVER_PORTRAITS_V2 || {}).forEach((k) => {
      DRIVER_PORTRAITS_V2[k] = String(DRIVER_PORTRAITS_V2[k]).replace(
        "w_720",
        "w_320",
      );
    });
  } catch (_) {}

  window.retryPortraitV28 = function (img) {
    if (!img) return;
    if (!img.dataset.v28retry) {
      img.dataset.v28retry = "1";
      const base = img.getAttribute("data-base-src") || img.src;
      setTimeout(() => {
        try {
          img.src =
            base + (base.includes("?") ? "&" : "?") + "v28r=" + Date.now();
        } catch (_) {}
      }, 650);
    } else {
      img.style.display = "none";
    }
  };

  function portraitHTMLV28(name, cls = "v2Portrait") {
    const src =
      (typeof DRIVER_PORTRAITS_V2 !== "undefined" &&
        DRIVER_PORTRAITS_V2[name]) ||
      "";
    const ini =
      typeof initialsV2 === "function"
        ? initialsV2(name)
        : String(name || "?")
            .slice(0, 2)
            .toUpperCase();
    if (!src) return `<div class="v2PortraitFallback">${escV28(ini)}</div>`;
    const safe = escV28(src),
      alt = escV28(name);
    return `<div class="portraitSafeV28"><div class="v2PortraitFallback">${escV28(ini)}</div><img class="${escV28(cls)}" loading="lazy" decoding="async" fetchpriority="low" alt="${alt}" data-base-src="${safe}" src="${safe}" onload="this.parentElement.classList.add('loaded')" onerror="retryPortraitV28(this)"></div>`;
  }
  try {
    portraitHTMLV2 = portraitHTMLV28;
  } catch (_) {}
  window.portraitHTMLV2 = portraitHTMLV28;

  function refreshPortraitsV28() {
    if (!selected) return;
    const name = selected[0];
    document
      .querySelectorAll(
        ".profilePortraitV2,.hubPortraitV2,.driverDetailPortraitV2,.resultPortraitV24,.resultReportPortraitV24",
      )
      .forEach((el) => {
        if (el.dataset.portraitName !== name || !el.firstElementChild) {
          el.dataset.portraitName = name;
          el.innerHTML = portraitHTMLV28(name);
        }
      });
  }
  /* CLEAN BUILD: removed full-grid portrait preload; portraits load only when actually displayed. */
  setTimeout(refreshPortraitsV28, 80);
})();

/* v2-9-final-script */

(function () {
  function reliabilityV29(d) {
    if (!d || !teams?.[d[1]]) return 70;
    let rel = Number(teams[d[1]].parts?.["可靠性/冷却"] ?? 70);
    if (selected && d[0] === selected[0]) {
      try {
        rel +=
          Number(
            typeof effectiveModV16 === "function"
              ? effectiveModV16("可靠性/冷却")
              : 0,
          ) || 0;
      } catch (_) {}
    }
    return Math.max(40, Math.min(95, rel));
  }
  function dnsChanceV29(d) {
    const rel = reliabilityV29(d);
    // DNS is rarer than an in-race retirement. Low reliability increases the pre-start risk sharply.
    let p =
      0.0015 + Math.max(0, 74 - rel) * 0.00115 + Math.max(0, 62 - rel) * 0.0015;
    return Math.max(0.001, Math.min(0.045, p));
  }
  window.dnsChanceV29 = dnsChanceV29;

  /* Pre-grid DNS now exists for the whole field. Detailed player races are checked before the event queue. */

  const renderClassificationV29Prev = renderClassification;
  renderClassification = function (field, limit = drivers.length) {
    if (!field) return '<div class="hint">暂无结果</div>';
    return `<div class="resultlist">${field
      .slice(0, limit)
      .map((x) => {
        const dns = !!x.dns || x.status === "DNS";
        const pos = dns ? "DNS" : x.dnf ? "DNF" : "P" + x.position;
        const status = dns
          ? "未发车"
          : x.dnf
            ? "退赛"
            : x.points
              ? `+${x.points}`
              : "";
        return `<div class="resultrow ${x.mine ? "mine" : ""}"><span class="pos ${x.dnf ? "dnf" : ""}">${pos}</span><b>${x.name}</b><span class="rteam">${x.team}</span><span class="status">${status}</span></div>`;
      })
      .join("")}</div>`;
  };
  window.renderClassification = renderClassification;

  function dnsStoryV29(q) {
    const grid = q?.position || drivers.length;
    return {
      safety: "none",
      contact: "technical",
      pace: "neutral",
      text: `赛车原本已经准备从 P${grid} 发车，但在发车格/暖胎圈程序中出现了无法及时排除的技术故障。车队尝试重新执行启动程序与系统复位，最终仍未能让赛车正常参加正赛，因此本场被记录为 DNS。这个结果与比赛中的驾驶选择无关，主要反映赛车可靠性带来的赛前机械风险。`,
    };
  }
  function playerDNSV29() {
    const q = state.weekend.qualResult;
    let field = simulateAIFieldV10("race", false);
    const mine = {
      name: selected[0],
      team: selected[1],
      total: -10000,
      mine: true,
      strategy: state.weekend.raceStrategy || "normal",
      dnf: true,
      dns: true,
      status: "DNS",
      retirementLap: 0,
      points: 0,
    };
    field.push(mine);
    applyAttritionV10(field);
    field.forEach((x, i) => (x.position = i + 1));
    const me = field.find((x) => x.mine);
    me.note = "发车格技术故障：赛车未能正常完成启动程序，本场 DNS。";
    me.choice = "—";
    me.eventTitle = "发车前技术故障";
    me.reportStoryV23 = dnsStoryV29(q);
    state.weekend.pendingPhase = null;
    state.weekend.pendingEvent = null;
    closeOverlay();
    completeRaceResultV10(field, me, false);
    try {
      const h = state.history?.[state.history.length - 1];
      if (h && Number(h.round) === Number(state.round)) h.dns = true;
      const sr = state.seasonResults?.find(
        (x) => Number(x.round) === Number(state.round),
      );
      if (sr) {
        sr.playerDns = true;
        sr.reportStoryV23 = me.reportStoryV23;
      }
      state.weekend.raceResult.dns = true;
      state.weekend.raceResult.status = "DNS";
      state.weekend.raceResult.reportStoryV23 = me.reportStoryV23;
      renderWeekendResult();
      autosave();
    } catch (_) {}
  }
  window.resolvePlayerDNSV29 = playerDNSV29;

  function showPlayerDNSV29() {
    const rel = reliabilityV29(selected);
    state.weekend.playerDNSV29 = true;
    document.getElementById("modalTitle").textContent = "发车前 · 技术故障";
    document.getElementById("modalBody").innerHTML =
      `<div class="eventcard"><div class="kicker">PRE-RACE INCIDENT</div><div class="dnsNoticeV29"><div class="dnsCode">DNS</div><div class="dnsReliabilityV29">赛车可靠性 / 冷却 ${rel.toFixed(1)}</div><p>赛车已经来到发车程序，但工程师发现关键系统无法完成正常启动。车队尝试复位电子系统与动力单元程序，时间窗口已经关闭，本场无法发车。</p><div class="eventchoice" onclick="resolvePlayerDNSV29()"><b>确认比赛结果</b><span>DNS · 未发车</span><small>这不是策略选择。DNS 概率与赛车「可靠性/冷却」属性相关，可靠性越低，发生概率越高。</small></div></div></div>`;
    document.getElementById("overlay").classList.add("open");
    try {
      autosave();
    } catch (_) {}
  }
  window.showPlayerDNSV29 = showPlayerDNSV29;

  const startRacePhaseV29Prev = startRacePhase;
  startRacePhase = function (phase) {
    if (phase !== "race") return startRacePhaseV29Prev(phase);
    const sk = state.weekend?.raceStrategy;
    if (!sk) {
      alert("请先选择本阶段的比赛计划。");
      return;
    }
    if (!state.weekend.qualResult) {
      showView("qualifying");
      return;
    }
    if (state.weekend.playerDNSV29) {
      showPlayerDNSV29();
      return;
    }
    if (!state.weekend.dnsCheckedV29) {
      state.weekend.dnsCheckedV29 = true;
      if (Math.random() < dnsChanceV29(selected)) {
        showPlayerDNSV29();
        return;
      }
    }
    return startRacePhaseV29Prev(phase);
  };
  window.startRacePhase = startRacePhase;

  const renderWeekendResultV29Prev = renderWeekendResult;
  renderWeekendResult = function () {
    renderWeekendResultV29Prev();
    const rr = state?.weekend?.raceResult;
    if (!rr) return;
    const dns = !!rr.dns || rr.status === "DNS";
    if (dns) {
      const p = document.getElementById("finishPos");
      if (p) p.textContent = "DNS";
      const n = document.getElementById("resultNarrative");
      if (n)
        n.textContent =
          rr.reportStoryV23?.text || dnsStoryV29(state.weekend.qualResult).text;
      const cls = document.getElementById("finalClassification");
      if (cls) cls.innerHTML = renderClassification(rr.field, drivers.length);
    }
  };
  window.renderWeekendResult = renderWeekendResult;

  /* Existing saved race details also show DNS instead of folding it into DNF. */
  if (window.openPastRaceV25) {
    const openPastRaceV29Prev = window.openPastRaceV25;
    window.openPastRaceV25 = function (round) {
      openPastRaceV29Prev(round);
      try {
        const sr = (state.seasonResults || []).find(
          (x) => Number(x.round) === Number(round),
        );
        if (!sr) return;
        const rows = document.querySelectorAll("#modalBody .pastRaceRow");
        const field = sr.field || [];
        rows.forEach((row, i) => {
          const x = field[i];
          if (x?.status === "DNS") {
            const p = row.querySelector(".p");
            if (p) p.textContent = "DNS";
          }
        });
        if (sr.playerDns) {
          const stats = document.querySelectorAll("#modalBody .pastRaceStat b");
          if (stats[1]) stats[1].textContent = "DNS";
        }
      } catch (_) {}
    };
    try {
      openPastRaceV25 = window.openPastRaceV25;
    } catch (_) {}
  }
})();

/* v3-achievements-system */

(function () {
  const COMMON_V3 = [
    ["pole1", "第一杆", "首次获得杆位", "排位", "普通", 1, "poles"],
    ["pole5", "排位锋芒", "累计获得 5 次杆位", "排位", "普通", 5, "poles"],
    ["pole10", "星期六专家", "累计获得 10 次杆位", "排位", "稀有", 10, "poles"],
    ["pole25", "排位机器", "累计获得 25 次杆位", "排位", "稀有", 25, "poles"],
    ["pole50", "半百杆位", "累计获得 50 次杆位", "排位", "极稀有", 50, "poles"],
    [
      "pole100",
      "百杆俱乐部",
      "累计获得 100 次杆位",
      "排位",
      "传奇",
      100,
      "poles",
    ],
    ["podium1", "三级台阶", "首次登上领奖台", "领奖台", "普通", 1, "podiums"],
    [
      "podium5",
      "香槟时刻",
      "累计 5 次登上领奖台",
      "领奖台",
      "普通",
      5,
      "podiums",
    ],
    [
      "podium10",
      "颁奖台熟客",
      "累计 10 次登上领奖台",
      "领奖台",
      "稀有",
      10,
      "podiums",
    ],
    [
      "podium25",
      "方格旗下",
      "累计 25 次登上领奖台",
      "领奖台",
      "稀有",
      25,
      "podiums",
    ],
    [
      "podium50",
      "半百登台",
      "累计 50 次登上领奖台",
      "领奖台",
      "极稀有",
      50,
      "podiums",
    ],
    [
      "podium100",
      "百次荣光",
      "累计 100 次登上领奖台",
      "领奖台",
      "传奇",
      100,
      "podiums",
    ],
    ["win1", "第一座奖杯", "首次赢得大奖赛", "胜利", "普通", 1, "wins"],
    ["win5", "不是偶然", "累计赢得 5 场大奖赛", "胜利", "普通", 5, "wins"],
    ["win10", "两位数", "累计赢得 10 场大奖赛", "胜利", "稀有", 10, "wins"],
    ["win25", "赢家习惯", "累计赢得 25 场大奖赛", "胜利", "稀有", 25, "wins"],
    [
      "win50",
      "五十胜俱乐部",
      "累计赢得 50 场大奖赛",
      "胜利",
      "极稀有",
      50,
      "wins",
    ],
    ["win75", "传奇数字", "累计赢得 75 场大奖赛", "胜利", "传奇", 75, "wins"],
    [
      "win100",
      "世纪赢家",
      "累计赢得 100 场大奖赛",
      "胜利",
      "传奇",
      100,
      "wins",
    ],
    ["wdc1", "世界冠军", "首次获得车手世界冠军", "世界冠军", "稀有", 1, "wdc"],
    ["wdc2", "卫冕者", "累计获得 2 个世界冠军", "世界冠军", "稀有", 2, "wdc"],
    [
      "wdc3",
      "王朝初现",
      "累计获得 3 个世界冠军",
      "世界冠军",
      "极稀有",
      3,
      "wdc",
    ],
    [
      "wdc4",
      "四冠俱乐部",
      "累计获得 4 个世界冠军",
      "世界冠军",
      "极稀有",
      4,
      "wdc",
    ],
    ["wdc5", "五冠", "累计获得 5 个世界冠军", "世界冠军", "传奇", 5, "wdc"],
    ["wdc7", "传奇七冠", "累计获得 7 个世界冠军", "世界冠军", "传奇", 7, "wdc"],
    ["wdc8", "无人区", "累计获得 8 个世界冠军", "世界冠军", "传奇", 8, "wdc"],
    [
      "wcc1",
      "我们是冠军",
      "首次帮助车队获得车队世界冠军",
      "车队冠军",
      "稀有",
      1,
      "wcc",
    ],
    [
      "wcc3",
      "最佳搭档",
      "累计帮助车队获得 3 个 WCC",
      "车队冠军",
      "稀有",
      3,
      "wcc",
    ],
    [
      "wcc5",
      "王朝车队",
      "累计帮助车队获得 5 个 WCC",
      "车队冠军",
      "极稀有",
      5,
      "wcc",
    ],
    [
      "wcc8",
      "制造历史",
      "累计帮助车队获得 8 个 WCC",
      "车队冠军",
      "传奇",
      8,
      "wcc",
    ],
    ["dnf1", "今天到此为止", "首次 DNF", "事故 / 可靠性", "普通", 1, "dnfs"],
    ["dns1", "车甚至没出去", "首次 DNS", "事故 / 可靠性", "普通", 1, "dns"],
    ["dnf5", "维修区熟客", "累计 5 次 DNF", "事故 / 可靠性", "普通", 5, "dnfs"],
    [
      "seasonBad5",
      "这赛季有点不对劲",
      "单赛季累计 5 次 DNF / DNS",
      "事故 / 可靠性",
      "稀有",
      5,
      "seasonBad",
    ],
    [
      "careerBad10",
      "可靠性受害者协会",
      "职业生涯累计 10 次 DNF / DNS",
      "事故 / 可靠性",
      "稀有",
      10,
      "careerBad",
    ],
    ["points1", "第一分", "首次获得积分", "其他纪录", "普通", 1, "points"],
    [
      "fastest1",
      "最快的人",
      "首次做出正赛最快圈",
      "其他纪录",
      "普通",
      1,
      "fastestLaps",
    ],
    ["perfect", "完美周末", "同一周末取得杆位并赢得正赛", "其他纪录", "稀有"],
    [
      "hatTrick",
      "帽子戏法",
      "同一周末取得杆位、冠军和最快圈",
      "其他纪录",
      "极稀有",
    ],
    [
      "grandSlam",
      "大满贯",
      "杆位、冠军、最快圈，并且比赛过程中没有记录到位置损失",
      "其他纪录",
      "传奇",
    ],
    [
      "backPodium",
      "从后面杀回来",
      "P15 或更后发车并登上领奖台",
      "其他纪录",
      "稀有",
    ],
    [
      "lastToFirst",
      "最后到前面",
      "P20 或更后发车并赢得大奖赛",
      "其他纪录",
      "传奇",
    ],
    [
      "rainWin",
      "雨中生存者",
      "在实际出现雨势 / 湿地条件的大奖赛中获胜",
      "其他纪录",
      "稀有",
    ],
    [
      "cleanSeason",
      "零失误赛季",
      "整个赛季没有 DNF 或 DNS",
      "其他纪录",
      "极稀有",
    ],
    [
      "fullSeason",
      "全勤奖",
      "完成整季所有大奖赛发车，允许比赛中退赛但不能 DNS",
      "其他纪录",
      "稀有",
    ],
  ].map((x) => ({
    id: "c_" + x[0],
    title: x[1],
    desc: x[2],
    category: x[3],
    rarity: x[4],
    target: x[5] || null,
    stat: x[6] || null,
    hidden: false,
  }));

  const HIDDEN_V3 = {
    "Max Verstappen": [
      ["max_four", "四连星", "职业生涯拥有 4 个车手世界冠军", "传奇"],
      ["max_ten", "所向披靡", "单赛季取得 10 连胜", "传奇"],
    ],
    "Charles Leclerc": [
      ["lec_monaco", "家乡为我欢呼", "赢得摩纳哥大奖赛", "极稀有"],
      ["lec_ferrari_wdc", "跃马梦", "驾驶 Ferrari 获得车手世界冠军", "传奇"],
    ],
    "George Russell": [
      [
        "rus_mercedes_wdc",
        "银箭飞驰之夜",
        "驾驶 Mercedes 获得车手世界冠军",
        "传奇",
      ],
      ["rus_canada", "HAPPY HUNTING GROUND", "赢得加拿大大奖赛", "稀有"],
    ],
    "Kimi Antonelli": [
      ["ant_wdc", "新时代", "获得职业生涯首个车手世界冠军", "传奇"],
      ["ant_monza", "蒙扎的新王", "赢得意大利大奖赛", "极稀有"],
    ],
    "Lewis Hamilton": [
      ["ham_eight", "无人区", "职业生涯获得第 8 个车手世界冠军", "传奇"],
      ["ham_ferrari_wdc", "红色铭刻", "驾驶 Ferrari 获得车手世界冠军", "传奇"],
    ],
    "Lando Norris": [
      ["nor_defend", "Number 1²", "成功卫冕车手世界冠军", "传奇"],
      ["nor_mclaren200", "约定", "代表 McLaren 完成 200 场大奖赛", "极稀有"],
    ],
    "Oscar Piastri": [
      ["pia_mclaren_wdc", "回到未来", "驾驶 McLaren 获得车手世界冠军", "传奇"],
      ["pia_aus", "属于幸运的汉堡", "赢得澳大利亚大奖赛", "极稀有"],
    ],
    "Isack Hadjar": [
      [
        "had_max5",
        "第二台红牛也能赢",
        "在双方正常完赛的比赛中连续 5 次战胜 Max Verstappen",
        "极稀有",
      ],
      ["had_ned", "初生牛犊", "在荷兰大奖赛登上领奖台", "稀有"],
    ],
    "Liam Lawson": [
      ["law_win", "相信的心", "获得职业生涯首胜", "极稀有"],
      ["law_mate", "证明自己", "单赛季积分击败队友", "稀有"],
    ],
    "Arvid Lindblad": [
      ["lin_rookiepod", "第一年就来真的", "新秀赛季登上领奖台", "极稀有"],
      ["lin_redbull", "下一位？", "职业生涯加盟 Red Bull Racing", "极稀有"],
    ],
    "Pierre Gasly": [
      ["gas_monza", "Monza Again", "再次赢得意大利大奖赛", "极稀有"],
      ["gas_alpine", "法兰西最快的10号", "驾驶 Alpine 赢得大奖赛", "传奇"],
    ],
    "Franco Colapinto": [
      ["col_podium", "阿根廷之夜", "首次登上领奖台", "极稀有"],
      ["col_win", "蓝白色的星期日", "获得职业生涯首胜", "传奇"],
    ],
    "Esteban Ocon": [
      ["oco_hungary", "匈牙利记忆", "再次赢得匈牙利大奖赛", "极稀有"],
      ["oco_haas", "没人看好的星期日", "驾驶 Haas 登上领奖台", "极稀有"],
    ],
    "Oliver Bearman": [
      [
        "bea_future",
        "未来",
        "驾驶非 Ferrari 赛车，在同一场正赛中击败两台正常完赛的 Ferrari",
        "极稀有",
      ],
      ["bea_ferrari", "红色召唤", "职业生涯正式加盟 Ferrari", "传奇"],
    ],
    "Nico Hulkenberg": [
      ["hul_podium2", "那再来一次", "获得职业生涯第 2 个领奖台", "稀有"],
      ["hul_win", "等了这么久，干脆赢吧", "获得职业生涯首胜", "传奇"],
    ],
    "Gabriel Bortoleto": [
      ["bor_exam", "毕业考试", "单赛季积分击败队友 Nico Hulkenberg", "稀有"],
      ["bor_brazil", "桑巴登台", "在圣保罗大奖赛登上领奖台", "极稀有"],
    ],
    "Carlos Sainz": [
      ["sai_williams", "Smooth Operator", "驾驶 Williams 赢得大奖赛", "传奇"],
      [
        "sai_fourteams",
        "第四种颜色",
        "代表第 4 支不同车队登上领奖台",
        "极稀有",
      ],
    ],
    "Alexander Albon": [
      ["alb_williams", "Grove Reborn", "驾驶 Williams 赢得大奖赛", "传奇"],
      ["alb_wdc", "泰国之光", "获得职业生涯首个车手世界冠军", "传奇"],
    ],
    "Fernando Alonso": [
      ["alo_three", "三冠梦", "获得职业生涯第 3 个车手世界冠军", "传奇"],
      ["alo_aston", "漫长的等待", "驾驶 Aston Martin 赢得大奖赛", "传奇"],
    ],
    "Lance Stroll": [
      ["str_canada", "红枫", "在加拿大大奖赛登上领奖台", "极稀有"],
      ["str_win", "轮到我了", "获得职业生涯首胜", "传奇"],
    ],
    "Sergio Perez": [
      ["per_street6", "国防部长", "职业生涯取得第 6 场街道赛胜利", "传奇"],
      ["per_cadpod", "美洲新章", "驾驶 Cadillac 登上领奖台", "极稀有"],
    ],
    "Valtteri Bottas": [
      ["bot_win11", "双一", "取得职业生涯第 11 胜", "极稀有"],
      ["bot_cadwin", "新的银色", "驾驶 Cadillac 赢得大奖赛", "传奇"],
    ],
  };
  Object.keys(HIDDEN_V3).forEach(
    (k) =>
      (HIDDEN_V3[k] = HIDDEN_V3[k].map((x) => ({
        id: "h_" + x[0],
        title: x[1],
        desc: x[2],
        category: "隐藏成就",
        rarity: x[3],
        hidden: true,
        driver: k,
      }))),
  );
  const ALL_HIDDEN_V3 = Object.values(HIDDEN_V3).flat();
  const ALL_V3 = [...COMMON_V3, ...ALL_HIDDEN_V3];
  window.ACHIEVEMENTS_V3 = ALL_V3;

  const STREET_RACES_V3 = [
    "摩纳哥大奖赛",
    "阿塞拜疆大奖赛",
    "新加坡大奖赛",
    "拉斯维加斯大奖赛",
    "沙特阿拉伯大奖赛",
  ];
  let achTabV3 = "common";
  let toastQueueV3 = [],
    toastBusyV3 = false;

  function blankCareerV3() {
    return {
      poles: 0,
      podiums: 0,
      wins: 0,
      wdc: 0,
      wcc: 0,
      dnfs: 0,
      dns: 0,
      points: 0,
      fastestLaps: 0,
      races: 0,
      streetWins: 0,
      teamRaces: {},
      podiumTeams: {},
      currentWinStreak: 0,
      bestWinStreak: 0,
      hadjarMaxStreak: 0,
      lastWdcYear: null,
      seasons: {},
    };
  }
  function ensureAchievementsV3() {
    if (!state.achievementsV3)
      state.achievementsV3 = {
        unlocked: {},
        career: blankCareerV3(),
        processedRaces: {},
        processedQual: {},
        seasonFinalized: {},
        version: 3,
      };
    const a = state.achievementsV3;
    if (!a.unlocked) a.unlocked = {};
    if (!a.career) a.career = blankCareerV3();
    if (!a.processedRaces) a.processedRaces = {};
    if (!a.processedQual) a.processedQual = {};
    if (!a.seasonFinalized) a.seasonFinalized = {};
    const c = a.career,
      b = blankCareerV3();
    Object.keys(b).forEach((k) => {
      if (c[k] == null)
        c[k] =
          typeof b[k] === "object" && b[k] !== null
            ? JSON.parse(JSON.stringify(b[k]))
            : b[k];
    });
    if (!c.teamRaces) c.teamRaces = {};
    if (!c.podiumTeams) c.podiumTeams = {};
    if (!c.seasons) c.seasons = {};
    const y = typeof seasonYearV11 === "function" ? seasonYearV11() : 2026;
    if (!c.seasons[y])
      c.seasons[y] = {
        races: 0,
        wins: 0,
        podiums: 0,
        poles: 0,
        dnfs: 0,
        dns: 0,
        points: 0,
      };
    return a;
  }
  window.ensureAchievementsV3 = ensureAchievementsV3;

  function getAchV3(id) {
    return ALL_V3.find((a) => a.id === id);
  }
  function isUnlockedV3(id) {
    return !!ensureAchievementsV3().unlocked[id];
  }
  function queueToastV3(a) {
    toastQueueV3.push(a);
    if (!toastBusyV3) playNextToastV3();
  }
  function ensureToastV3() {
    let el = document.getElementById("achievementToastV3");
    if (!el) {
      el = document.createElement("div");
      el.id = "achievementToastV3";
      el.innerHTML =
        '<div class="achievementToastInnerV3"><div class="achievementToastIconV3">🏆</div><div class="achievementToastCopyV3"><small>ACHIEVEMENT UNLOCKED</small><b></b><span></span></div><div class="achievementToastRarityV3"></div></div>';
      document.body.appendChild(el);
    }
    return el;
  }
  function playNextToastV3() {
    if (!toastQueueV3.length) {
      toastBusyV3 = false;
      return;
    }
    toastBusyV3 = true;
    const a = toastQueueV3.shift(),
      el = ensureToastV3();
    el.querySelector("b").textContent = a.title;
    el.querySelector(".achievementToastCopyV3 span").textContent = a.desc;
    el.querySelector(".achievementToastRarityV3").textContent = a.rarity;
    el.classList.remove("show");
    void el.offsetWidth;
    el.classList.add("show");
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(playNextToastV3, 120);
    }, 3260);
  }
  function unlockAchievementV3(id, opts = {}) {
    const a = getAchV3(id);
    if (!a) return false;
    const s = ensureAchievementsV3();
    if (s.unlocked[id]) return false;
    s.unlocked[id] = {
      year: typeof seasonYearV11 === "function" ? seasonYearV11() : 2026,
      round: Number(state.round || 0),
      race: (typeof currentRace === "function" && currentRace()?.[1]) || "",
      at: Date.now(),
      legacy: !!opts.legacy,
    };
    if (!opts.silent) queueToastV3(a);
    try {
      updateAchievementHubV3();
      if (document.getElementById("achievements")?.classList.contains("active"))
        renderAchievementsV3();
      autosave();
    } catch (_) {}
    return true;
  }
  window.unlockAchievementV3 = unlockAchievementV3;

  function seedLegacyV3(show = true) {
    ensureAchievementsV3();
    return false;
  }

  function progressValueV3(a) {
    const c = ensureAchievementsV3().career;
    if (a.stat === "careerBad") return (c.dnfs || 0) + (c.dns || 0);
    if (a.stat === "seasonBad") {
      const y = seasonYearV11(),
        s = c.seasons[y] || {};
      return (s.dnfs || 0) + (s.dns || 0);
    }
    return a.stat ? Number(c[a.stat] || 0) : 0;
  }
  function checkThresholdsV3() {
    COMMON_V3.forEach((a) => {
      if (a.target != null && progressValueV3(a) >= a.target)
        unlockAchievementV3(a.id);
    });
  }

  function processQualV3() {
    if (!selected || !state.weekend?.qualResult) return;
    const a = ensureAchievementsV3(),
      y = seasonYearV11(),
      key = y + "-" + state.round;
    if (a.processedQual[key]) return;
    a.processedQual[key] = true;
    const q = state.weekend.qualResult;
    if (!q.dnf && q.position === 1) {
      a.career.poles++;
      a.career.seasons[y].poles++;
      checkThresholdsV3();
    }
    try {
      autosave();
    } catch (_) {}
  }
  window.processQualAchievementsV3 = processQualV3;

  function assignFastestLapV3(field) {
    const rr = state.weekend?.raceResult;
    if (!rr || rr.fastestLapV3) return rr?.fastestLapV3 || null;
    const live = (field || rr.field || []).filter(
      (x) => !x.dnf && !x.dns && x.status !== "DNS",
    );
    if (!live.length) return null;
    const scored = live
      .map((x) => ({
        x,
        score:
          Number(x.total || 0) +
          Math.random() * 5 +
          (x.position > 10 ? Math.random() * 1.8 : 0),
      }))
      .sort((a, b) => b.score - a.score);
    rr.fastestLapV3 = scored[0].x.name;
    return rr.fastestLapV3;
  }
  function rainyRaceV3(rr) {
    const actual = state?.weekend?.weatherV410?.actual || [];
    if (
      Array.isArray(actual) &&
      actual.some((w) => ["damp", "wet", "extreme"].includes(w))
    )
      return true;
    const t = [
      rr?.note,
      rr?.eventTitle,
      rr?.reportStoryV23?.text,
      state.weekend?.eventNotes?.join(" "),
    ]
      .filter(Boolean)
      .join(" ");
    return /雨|湿地|半雨|阵雨|降雨|wet|rain/i.test(t);
  }
  function checkHiddenRaceV3(rr, field) {
    const n = selected[0],
      team = selected[1],
      race = currentRace()?.[1] || "",
      c = ensureAchievementsV3().career,
      q = state.weekend?.qualResult,
      pos = rr.position,
      win = !rr.dnf && !rr.dns && pos === 1,
      podium = !rr.dnf && !rr.dns && pos <= 3;
    if (n === "Max Verstappen" && c.currentWinStreak >= 10)
      unlockAchievementV3("h_max_ten");
    if (n === "Charles Leclerc") {
      if (win && race === "摩纳哥大奖赛") unlockAchievementV3("h_lec_monaco");
    }
    if (n === "George Russell" && win && race === "加拿大大奖赛")
      unlockAchievementV3("h_rus_canada");
    if (n === "Kimi Antonelli" && win && race === "意大利大奖赛")
      unlockAchievementV3("h_ant_monza");
    if (n === "Lando Norris" && (c.teamRaces["McLaren"] || 0) >= 200)
      unlockAchievementV3("h_nor_mclaren200");
    if (n === "Oscar Piastri" && win && race === "澳大利亚大奖赛")
      unlockAchievementV3("h_pia_aus");
    if (n === "Isack Hadjar") {
      const mx = (field || []).find((x) => x.name === "Max Verstappen");
      if (mx && !rr.dnf && !rr.dns && !mx.dnf && !mx.dns) {
        if (pos < mx.position) c.hadjarMaxStreak = (c.hadjarMaxStreak || 0) + 1;
        else c.hadjarMaxStreak = 0;
      }
      if (c.hadjarMaxStreak >= 5) unlockAchievementV3("h_had_max5");
      if (podium && race === "荷兰大奖赛") unlockAchievementV3("h_had_ned");
    }
    if (n === "Liam Lawson" && win) unlockAchievementV3("h_law_win");
    if (n === "Arvid Lindblad" && podium && seasonYearV11() === 2026)
      unlockAchievementV3("h_lin_rookiepod");
    if (n === "Pierre Gasly") {
      if (win && race === "意大利大奖赛") unlockAchievementV3("h_gas_monza");
      if (win && team === "Alpine") unlockAchievementV3("h_gas_alpine");
    }
    if (n === "Franco Colapinto") {
      if (podium) unlockAchievementV3("h_col_podium");
      if (win) unlockAchievementV3("h_col_win");
    }
    if (n === "Esteban Ocon") {
      if (win && race === "匈牙利大奖赛") unlockAchievementV3("h_oco_hungary");
      if (podium && team === "Haas F1 Team") unlockAchievementV3("h_oco_haas");
    }
    if (n === "Oliver Bearman" && team !== "Ferrari") {
      const fs = (field || []).filter((x) => x.team === "Ferrari");
      if (
        fs.length >= 2 &&
        fs.every(
          (x) => !x.dnf && !x.dns && x.status !== "DNS" && pos < x.position,
        )
      )
        unlockAchievementV3("h_bea_future");
    }
    if (n === "Nico Hulkenberg") {
      if (c.podiums >= 2) unlockAchievementV3("h_hul_podium2");
      if (win) unlockAchievementV3("h_hul_win");
    }
    if (n === "Gabriel Bortoleto" && podium && race === "圣保罗大奖赛")
      unlockAchievementV3("h_bor_brazil");
    if (n === "Carlos Sainz") {
      if (win && team === "Williams") unlockAchievementV3("h_sai_williams");
      if (Object.keys(c.podiumTeams).length >= 4)
        unlockAchievementV3("h_sai_fourteams");
    }
    if (n === "Alexander Albon" && win && team === "Williams")
      unlockAchievementV3("h_alb_williams");
    if (n === "Fernando Alonso" && win && team === "Aston Martin")
      unlockAchievementV3("h_alo_aston");
    if (n === "Lance Stroll") {
      if (podium && race === "加拿大大奖赛")
        unlockAchievementV3("h_str_canada");
      if (win) unlockAchievementV3("h_str_win");
    }
    if (n === "Sergio Perez") {
      if (win && STREET_RACES_V3.includes(race))
        c.streetWins = (c.streetWins || 0) + 1;
      if ((c.streetWins || 0) >= 6) unlockAchievementV3("h_per_street6");
      if (podium && team === "Cadillac") unlockAchievementV3("h_per_cadpod");
    }
    if (n === "Valtteri Bottas") {
      if (c.wins >= 11) unlockAchievementV3("h_bot_win11");
      if (win && team === "Cadillac") unlockAchievementV3("h_bot_cadwin");
    }
  }
  function processRaceV3(field) {
    if (!selected || !state.weekend?.raceResult) return;
    processQualV3();
    const a = ensureAchievementsV3(),
      c = a.career,
      y = seasonYearV11(),
      key = y + "-" + state.round;
    if (a.processedRaces[key]) return;
    a.processedRaces[key] = true;
    const rr = state.weekend.raceResult,
      q = state.weekend.qualResult || {},
      team = selected[1],
      s = c.seasons[y];
    assignFastestLapV3(field);
    c.races++;
    s.races++;
    c.teamRaces[team] = (c.teamRaces[team] || 0) + 1;
    if (rr.dns || rr.status === "DNS") {
      c.dns++;
      s.dns++;
      c.currentWinStreak = 0;
    } else if (rr.dnf) {
      c.dnfs++;
      s.dnfs++;
      c.currentWinStreak = 0;
    } else {
      if (rr.position === 1) {
        c.wins++;
        s.wins++;
        c.currentWinStreak++;
        c.bestWinStreak = Math.max(c.bestWinStreak, c.currentWinStreak);
      } else c.currentWinStreak = 0;
      if (rr.position <= 3) {
        c.podiums++;
        s.podiums++;
        c.podiumTeams[team] = true;
      }
      if ((rr.points || 0) > 0) {
        c.points += rr.points;
        s.points += rr.points;
      }
    }
    if (rr.fastestLapV3 === selected[0]) c.fastestLaps++;
    checkThresholdsV3();
    const pole = !q.dnf && q.position === 1,
      win = !rr.dnf && !rr.dns && rr.position === 1,
      fast = rr.fastestLapV3 === selected[0];
    if (c.points > 0) unlockAchievementV3("c_points1");
    if (fast) unlockAchievementV3("c_fastest1");
    if (pole && win) unlockAchievementV3("c_perfect");
    if (pole && win && fast) unlockAchievementV3("c_hatTrick");
    if (pole && win && fast && (state.weekend?.positionMod || 0) >= 0)
      unlockAchievementV3("c_grandSlam");
    if (!rr.dnf && !rr.dns && rr.position <= 3 && (q.position || 1) >= 15)
      unlockAchievementV3("c_backPodium");
    if (win && (q.position || 1) >= 20) unlockAchievementV3("c_lastToFirst");
    if (win && rainyRaceV3(rr)) unlockAchievementV3("c_rainWin");
    checkHiddenRaceV3(rr, field || rr.field || []);
    try {
      autosave();
    } catch (_) {}
  }
  window.processRaceAchievementsV3 = processRaceV3;

  function processSeasonFinaleV3() {
    if (!selected) return;
    const a = ensureAchievementsV3(),
      c = a.career,
      y = seasonYearV11();
    if (a.seasonFinalized[y]) return;
    a.seasonFinalized[y] = true;
    const ds = Object.entries(state.driverStandings || {}).sort(
        (x, z) => z[1] - x[1],
      ),
      ts = Object.entries(state.teamStandings || {}).sort(
        (x, z) => z[1] - x[1],
      );
    const wdc = ds[0]?.[0] === selected[0],
      wcc = ts[0]?.[0] === selected[1],
      s = c.seasons[y] || {};
    if (wdc) {
      const prev = c.lastWdcYear;
      c.wdc++;
      if (selected[0] === "Lando Norris" && prev === y - 1)
        unlockAchievementV3("h_nor_defend");
      c.lastWdcYear = y;
    }
    if (wcc) c.wcc++;
    checkThresholdsV3();
    if ((s.dnfs || 0) + (s.dns || 0) === 0 && (s.races || 0) >= calendar.length)
      unlockAchievementV3("c_cleanSeason");
    if ((s.dns || 0) === 0 && (s.races || 0) >= calendar.length)
      unlockAchievementV3("c_fullSeason");
    const totalTitles = c.wdc;
    if (selected[0] === "Max Verstappen" && totalTitles >= 4)
      unlockAchievementV3("h_max_four");
    if (selected[0] === "Charles Leclerc" && wdc && selected[1] === "Ferrari")
      unlockAchievementV3("h_lec_ferrari_wdc");
    if (selected[0] === "George Russell" && wdc && selected[1] === "Mercedes")
      unlockAchievementV3("h_rus_mercedes_wdc");
    if (selected[0] === "Kimi Antonelli" && wdc)
      unlockAchievementV3("h_ant_wdc");
    if (selected[0] === "Lewis Hamilton") {
      if (totalTitles >= 8) unlockAchievementV3("h_ham_eight");
      if (wdc && selected[1] === "Ferrari")
        unlockAchievementV3("h_ham_ferrari_wdc");
    }
    if (selected[0] === "Oscar Piastri" && wdc && selected[1] === "McLaren")
      unlockAchievementV3("h_pia_mclaren_wdc");
    if (selected[0] === "Liam Lawson") {
      const tm = teammateV10();
      if (
        tm &&
        (state.driverStandings[selected[0]] || 0) >
          (state.driverStandings[tm[0]] || 0)
      )
        unlockAchievementV3("h_law_mate");
    }
    if (
      selected[0] === "Gabriel Bortoleto" &&
      (state.driverStandings[selected[0]] || 0) >
        (state.driverStandings["Nico Hulkenberg"] || 0)
    )
      unlockAchievementV3("h_bor_exam");
    if (selected[0] === "Alexander Albon" && wdc)
      unlockAchievementV3("h_alb_wdc");
    if (selected[0] === "Fernando Alonso" && totalTitles >= 3)
      unlockAchievementV3("h_alo_three");
    try {
      autosave();
    } catch (_) {}
  }
  window.processSeasonAchievementsV3 = processSeasonFinaleV3;

  function checkTransferHiddenV3() {
    if (!selected) return;
    if (selected[0] === "Arvid Lindblad" && selected[1] === "Red Bull Racing")
      unlockAchievementV3("h_lin_redbull");
    if (selected[0] === "Oliver Bearman" && selected[1] === "Ferrari")
      unlockAchievementV3("h_bea_ferrari");
  }

  function updateAchievementHubV3() {
    if (!selected) return;
    const a = ensureAchievementsV3(),
      own = HIDDEN_V3[selected[0]] || [],
      eligible = COMMON_V3.length + own.length,
      got = [...COMMON_V3, ...own].filter((x) => a.unlocked[x.id]).length;
    const el = document.getElementById("achievementHubCountV3");
    if (el) el.textContent = `${got} / ${eligible}`;
  }
  window.updateAchievementHubV3 = updateAchievementHubV3;
  function cardHtmlV3(a) {
    const s = ensureAchievementsV3(),
      u = s.unlocked[a.id],
      locked = a.hidden && !u,
      val = a.target != null ? Math.min(a.target, progressValueV3(a)) : null,
      pct = a.target ? Math.min(100, (val / a.target) * 100) : 0;
    return `<div class="achievementCardV3 ${u ? "unlocked" : "locked"} ${locked ? "achievementLockedV3" : ""}"><div class="achievementIconV3">${u ? "🏆" : "◇"}</div><h4>${locked ? "???" : a.title}</h4><p>${locked ? "完成一个属于这位车手的特殊条件后解锁。" : a.desc}</p>${!locked && a.target != null && !u ? `<div class="achievementProgressV3"><i style="width:${pct}%"></i></div>` : ""}<div class="achievementMetaV3"><span>${u ? (u.legacy ? "历史履历 · 已解锁" : `${u.year} · 已解锁`) : a.category}</span><b>${a.rarity}</b></div></div>`;
  }
  function renderAchievementsV3() {
    if (!selected) return;
    const s = ensureAchievementsV3(),
      own = HIDDEN_V3[selected[0]] || [],
      list = achTabV3 === "hidden" ? own : COMMON_V3,
      eligible = COMMON_V3.length + own.length,
      got = [...COMMON_V3, ...own].filter((x) => s.unlocked[x.id]).length;
    document.getElementById("achievementCountV3").textContent = got;
    document.getElementById("achievementTotalV3").textContent = "/ " + eligible;
    document.getElementById("achievementHeroTitleV3").textContent =
      achTabV3 === "hidden" ? `${selected[0]} · 隐藏成就` : "职业生涯纪录";
    document.getElementById("achievementHeroTextV3").textContent =
      achTabV3 === "hidden"
        ? own.length
          ? "未解锁的专属成就不会提前透露条件，且同样只统计这份存档里的达成情况。"
          : "自定义车手没有预设人物隐藏成就，但可以完整解锁全部通用成就。"
        : "所有成就都只统计这份存档里由你在游戏中完成的成绩，开档前的历史履历不会计入。";
    const box = document.getElementById("achievementContentV3");
    if (!box) return;
    if (achTabV3 === "hidden") {
      box.innerHTML = own.length
        ? `<div class="achievementSectionV3"><div class="achievementSectionHeadV3"><h3>车手隐藏成就</h3><span>${own.filter((x) => s.unlocked[x.id]).length} / ${own.length}</span></div><div class="achievementGridV3">${own.map(cardHtmlV3).join("")}</div></div>`
        : '<div class="card"><div class="hint">自定义车手没有人物专属隐藏成就。</div></div>';
      return;
    }
    const cats = [...new Set(COMMON_V3.map((x) => x.category))];
    box.innerHTML = cats
      .map((cat) => {
        const xs = COMMON_V3.filter((x) => x.category === cat);
        return `<div class="achievementSectionV3"><div class="achievementSectionHeadV3"><h3>${cat}</h3><span>${xs.filter((x) => s.unlocked[x.id]).length} / ${xs.length}</span></div><div class="achievementGridV3">${xs.map(cardHtmlV3).join("")}</div></div>`;
      })
      .join("");
  }
  window.renderAchievementsV3 = renderAchievementsV3;
  window.setAchievementTabV3 = function (tab) {
    achTabV3 = tab === "hidden" ? "hidden" : "common";
    document
      .getElementById("achTabCommonV3")
      ?.classList.toggle("active", achTabV3 === "common");
    document
      .getElementById("achTabHiddenV3")
      ?.classList.toggle("active", achTabV3 === "hidden");
    renderAchievementsV3();
  };

  const openModuleV3Prev = openModule;
  openModule = function (id) {
    if (id === "achievements") {
      ensureAchievementsV3();
      renderAchievementsV3();
      showView("achievements");
      return;
    }
    return openModuleV3Prev(id);
  };
  window.openModule = openModule;
  const renderHubV3Prev = renderHub;
  renderHub = function () {
    const r = renderHubV3Prev.apply(this, arguments);
    if (selected) {
      ensureAchievementsV3();
      updateAchievementHubV3();
    }
    return r;
  };
  window.renderHub = renderHub;
  const completeRaceV3Prev = completeRaceResultV10;
  completeRaceResultV10 = function (field, mine, noBonus = false) {
    const r = completeRaceV3Prev(field, mine, noBonus);
    try {
      processRaceV3(field);
    } catch (e) {
      console.error("achievement race", e);
    }
    return r;
  };
  window.completeRaceResultV10 = completeRaceResultV10;
  const finalizeRacePhaseV3Prev = finalizeRacePhaseV10;
  finalizeRacePhaseV10 = function (phase, noBonus = false) {
    const r = finalizeRacePhaseV3Prev(phase, noBonus);
    if (phase === "qual")
      try {
        processQualV3();
      } catch (e) {
        console.error("achievement qual", e);
      }
    return r;
  };
  window.finalizeRacePhaseV10 = finalizeRacePhaseV10;
  const showFinaleV3Prev = showSeasonFinaleV10;
  showSeasonFinaleV10 = function () {
    try {
      processSeasonFinaleV3();
    } catch (e) {
      console.error("achievement season", e);
    }
    const r = showFinaleV3Prev.apply(this, arguments);
    return r;
  };
  window.showSeasonFinaleV10 = showSeasonFinaleV10;
  const startCareerV3Prev = startCareer;
  startCareer = function () {
    const r = startCareerV3Prev.apply(this, arguments);
    state.achievementsV3 = {
      unlocked: {},
      career: blankCareerV3(),
      processedRaces: {},
      processedQual: {},
      seasonFinalized: {},
      version: 31,
    };
    updateAchievementHubV3();
    autosave();
    return r;
  };
  window.startCareer = startCareer;
  const nextSeasonV3Prev = startNextSeasonV11;
  startNextSeasonV11 = function () {
    try {
      processSeasonFinaleV3();
    } catch (_) {}
    const before = seasonYearV11(),
      r = nextSeasonV3Prev.apply(this, arguments);
    if (selected && seasonYearV11() > before) {
      const a = ensureAchievementsV3(),
        c = a.career;
      c.currentWinStreak = 0;
      c.hadjarMaxStreak = 0;
      if (!c.seasons[seasonYearV11()])
        c.seasons[seasonYearV11()] = {
          races: 0,
          wins: 0,
          podiums: 0,
          poles: 0,
          dnfs: 0,
          dns: 0,
          points: 0,
        };
      checkTransferHiddenV3();
      updateAchievementHubV3();
      autosave();
    }
    return r;
  };
  window.startNextSeasonV11 = startNextSeasonV11;
  function migrateOldSaveAchievementsV3() {
    const a = ensureAchievementsV3(),
      c = a.career,
      y = seasonYearV11(),
      st = state.driverSeasonStats?.[selected[0]] || {},
      hist = state.history || [];
    c.poles = Number(st.poles || 0);
    c.wins = Number(st.wins || 0);
    c.podiums = Number(st.podiums || 0);
    c.races = hist.length;
    c.points = Number(state.driverStandings?.[selected[0]] || 0);
    const dns = hist.filter((h) => h.dns).length,
      totalDnf = hist.filter((h) => h.dnf).length;
    c.dns = dns;
    c.dnfs = Math.max(0, totalDnf - dns);
    c.seasons[y] = {
      races: c.races,
      wins: c.wins,
      podiums: c.podiums,
      poles: c.poles,
      dnfs: c.dnfs,
      dns: c.dns,
      points: c.points,
    };
    c.teamRaces[selected[1]] = (c.teamRaces[selected[1]] || 0) + hist.length;
    hist.forEach((h) => {
      a.processedRaces[y + "-" + h.round] = true;
      a.processedQual[y + "-" + h.round] = true;
    });
    COMMON_V3.forEach((x) => {
      if (x.target != null && progressValueV3(x) >= x.target)
        unlockAchievementV3(x.id, { silent: true });
    });
    if (c.points > 0) unlockAchievementV3("c_points1", { silent: true });
  }
  const restoreV3Prev = restoreSnapshot;
  restoreSnapshot = function (data) {
    const hadV3 = !!data?.state?.achievementsV3;
    const ok = restoreV3Prev(data);
    if (ok && selected) {
      ensureAchievementsV3();
      if (!hadV3) migrateOldSaveAchievementsV3();
      updateAchievementHubV3();
      checkTransferHiddenV3();
      renderHub();
      autosave();
    }
    return ok;
  };
  window.restoreSnapshot = restoreSnapshot;
  const renderResultV3Prev = renderWeekendResult;
  renderWeekendResult = function () {
    const r = renderResultV3Prev.apply(this, arguments);
    const rr = state?.weekend?.raceResult;
    if (rr?.fastestLapV3 === selected?.[0]) {
      const card = document.querySelector("#weekendresult .finishCard");
      if (card && !card.querySelector(".fastestLapBadgeV3"))
        card.insertAdjacentHTML(
          "beforeend",
          '<div class="fastestLapBadgeV3">◉ FASTEST LAP · 本场最快圈</div>',
        );
    }
    return r;
  };
  window.renderWeekendResult = renderWeekendResult;

  setTimeout(() => {
    if (selected) {
      ensureAchievementsV3();
      updateAchievementHubV3();
    }
  }, 0);
})();

/* v33-legends-system */

(function () {
  const BASE_ROSTER_V33 = drivers.slice(0, 22).map((d) => d.slice());
  const BASE_PROFILE_V33 = {};
  BASE_ROSTER_V33.forEach(
    (d) =>
      (BASE_PROFILE_V33[d[0]] = JSON.parse(
        JSON.stringify(driverProfiles[d[0]] || {}),
      )),
  );
  const BASE_CONTRACT_V33 = {};
  try {
    BASE_ROSTER_V33.forEach(
      (d) =>
        (BASE_CONTRACT_V33[d[0]] = JSON.parse(
          JSON.stringify(
            DRIVER_CONTRACTS_V11[d[0]] || {
              end: 2026,
              label: "2026",
              option: true,
            },
          ),
        )),
    );
  } catch (_) {}

  function commonsV33(file) {
    return (
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/" +
      encodeURIComponent(file) +
      "?width=480"
    );
  }
  const LEGENDS_V33 = {
    "Michael Schumacher": {
      stats: [96, 99, 97, 96, 96],
      nation: "德国",
      debut: 1991,
      titles: 7,
      wins: 91,
      podiums: 155,
      poles: 68,
      best: "7届世界冠军 · 91场大奖赛胜利",
      file: "Michael Schumacher.jpg",
    },
    "Ayrton Senna": {
      stats: [96, 94, 95, 94, 99],
      nation: "巴西",
      debut: 1984,
      titles: 3,
      wins: 41,
      podiums: 80,
      poles: 65,
      best: "3届世界冠军 · 65次杆位",
      file: "Ayrton Senna 8.jpg",
    },
    "Alain Prost": {
      stats: [95, 99, 97, 98, 92],
      nation: "法国",
      debut: 1980,
      titles: 4,
      wins: 51,
      podiums: 106,
      poles: 33,
      best: "4届世界冠军 · 51场大奖赛胜利",
      file: "Alain Prost, 2009 c.jpg",
    },
    "Sebastian Vettel": {
      stats: [94, 94, 95, 92, 95],
      nation: "德国",
      debut: 2007,
      titles: 4,
      wins: 53,
      podiums: 122,
      poles: 57,
      best: "4届世界冠军 · 53场大奖赛胜利",
      file: "Sebastian Vettel (14213821433).jpg",
    },
    "Niki Lauda": {
      stats: [94, 99, 95, 98, 90],
      nation: "奥地利",
      debut: 1971,
      titles: 3,
      wins: 25,
      podiums: 54,
      poles: 24,
      best: "3届世界冠军 · Ferrari / McLaren冠军车手",
      file: "Lauda portrait.jpg",
    },
    "Jackie Stewart": {
      stats: [94, 98, 95, 98, 90],
      nation: "英国",
      debut: 1965,
      titles: 3,
      wins: 27,
      podiums: 43,
      poles: 17,
      best: "3届世界冠军 · 27场大奖赛胜利",
      file: "Stewart, Jackie (Foto Spurzem 1973).jpg",
    },
    "Kimi Räikkönen": {
      stats: [93, 97, 94, 92, 94],
      nation: "芬兰",
      debut: 2001,
      titles: 1,
      wins: 21,
      podiums: 103,
      poles: 18,
      best: "2007世界冠军 · 21场大奖赛胜利",
      file: "Kimi Räikkönen portrait.jpg",
    },
    "Nico Rosberg": {
      stats: [93, 91, 92, 93, 95],
      nation: "德国",
      debut: 2006,
      titles: 1,
      wins: 23,
      podiums: 57,
      poles: 30,
      best: "2016世界冠军 · 23场大奖赛胜利",
      file: "Nico Rosberg 2016.jpg",
    },
    "Mika Häkkinen": {
      stats: [93, 91, 93, 91, 96],
      nation: "芬兰",
      debut: 1991,
      titles: 2,
      wins: 20,
      podiums: 51,
      poles: 26,
      best: "1998、1999世界冠军 · Flying Finn",
      file: "Mika Hakkinen 2012 portrait.jpg",
    },
    "Nelson Piquet": {
      stats: [93, 96, 94, 96, 91],
      nation: "巴西",
      debut: 1978,
      titles: 3,
      wins: 23,
      podiums: 60,
      poles: 24,
      best: "3届世界冠军 · 23场大奖赛胜利",
      file: "Nelson Piquet 2015 (cropped).jpg",
    },
    "Nigel Mansell": {
      stats: [92, 91, 94, 88, 95],
      nation: "英国",
      debut: 1980,
      titles: 1,
      wins: 31,
      podiums: 59,
      poles: 32,
      best: "1992世界冠军 · 31场大奖赛胜利",
      file: "NigelMansell.jpg",
    },
    "Jenson Button": {
      stats: [91, 96, 92, 95, 88],
      nation: "英国",
      debut: 2000,
      titles: 1,
      wins: 15,
      podiums: 50,
      poles: 8,
      best: "2009世界冠军 · 复杂天气与轮胎管理专家",
      file: "Jenson Button.jpg",
    },
    "Damon Hill": {
      stats: [90, 90, 91, 90, 92],
      nation: "英国",
      debut: 1992,
      titles: 1,
      wins: 22,
      podiums: 42,
      poles: 20,
      best: "1996世界冠军 · 22场大奖赛胜利",
      file: "Damon Hill.jpg",
    },
    "Juan Pablo Montoya": {
      stats: [90, 87, 93, 85, 94],
      nation: "哥伦比亚",
      debut: 2001,
      titles: 0,
      wins: 7,
      podiums: 30,
      poles: 13,
      best: "7场大奖赛胜利 · 强硬轮对轮风格",
      file: "Juan Pablo Montoya.jpg",
    },
    "Felipe Massa": {
      stats: [89, 93, 90, 88, 92],
      nation: "巴西",
      debut: 2002,
      titles: 0,
      wins: 11,
      podiums: 41,
      poles: 16,
      best: "11场大奖赛胜利 · 2008年度亚军",
      file: "Felipe Massa.jpg",
    },
  };
  Object.entries(LEGENDS_V33).forEach(
    ([name, l]) => (l.portrait = commonsV33(l.file)),
  );
  window.LEGENDS_V33 = LEGENDS_V33;

  let legendEnabledV33 = false;
  let legendConfigV33 = {}; // legend -> original 2026 driver seat
  const legendNamesV33 = () => Object.keys(LEGENDS_V33);
  const isLegendV33 = (name) => !!LEGENDS_V33[name];

  function safeCopyV33(x) {
    return JSON.parse(JSON.stringify(x));
  }
  function clearLegendObjectsV33() {
    legendNamesV33().forEach((name) => {
      delete driverProfiles[name];
      try {
        delete DRIVER_CONTRACTS_V11[name];
      } catch (_) {}
    });
  }
  function restoreBaseObjectsV33() {
    BASE_ROSTER_V33.forEach((d) => {
      driverProfiles[d[0]] = safeCopyV33(BASE_PROFILE_V33[d[0]]);
      try {
        DRIVER_CONTRACTS_V11[d[0]] = safeCopyV33(BASE_CONTRACT_V33[d[0]]);
      } catch (_) {}
    });
  }
  function applyLegendRosterV33() {
    restoreBaseObjectsV33();
    clearLegendObjectsV33();
    const roster = BASE_ROSTER_V33.map((d) => d.slice());
    if (legendEnabledV33) {
      Object.entries(legendConfigV33).forEach(([legend, target]) => {
        const l = LEGENDS_V33[legend];
        if (!l) return;
        const idx = roster.findIndex((d) => d[0] === target);
        if (idx < 0) return;
        const base = BASE_ROSTER_V33[idx],
          p0 = BASE_PROFILE_V33[target] || {};
        roster[idx] = [legend, base[1], ...l.stats];
        driverProfiles[legend] = {
          number: p0.number,
          nation: l.nation,
          debut: l.debut,
          season2025: "LEGEND · 巅峰状态加入 2026 围场",
          titles: l.titles,
          wins: l.wins,
          podiums: l.podiums,
          poles: l.poles,
          best: l.best,
          legendV33: true,
          replacedV33: target,
        };
        try {
          DRIVER_CONTRACTS_V11[legend] = safeCopyV33(
            BASE_CONTRACT_V33[target] || {
              end: 2026,
              label: "2026 · 传奇替换席位",
              option: true,
            },
          );
        } catch (_) {}
      });
    }
    drivers.splice(0, drivers.length, ...roster);
    try {
      legendNamesV33().forEach(
        (n) => (DRIVER_PORTRAITS_V2[n] = LEGENDS_V33[n].portrait),
      );
    } catch (_) {}
    return roster;
  }
  window.applyLegendRosterV33 = applyLegendRosterV33;

  const portraitHTMLV33Prev = window.portraitHTMLV2 || portraitHTMLV2;
  function portraitHTMLV33(name, cls = "v2Portrait") {
    if (!isLegendV33(name)) return portraitHTMLV33Prev(name, cls);
    const src = LEGENDS_V33[name].portrait,
      ini =
        typeof initialsV2 === "function" ? initialsV2(name) : name.slice(0, 2),
      alt = String(name).replace(/"/g, "");
    return `<div class="portraitSafeV28"><div class="v2PortraitFallback">${ini}</div><img class="${cls} legendPortraitImgV33" loading="lazy" decoding="async" fetchpriority="low" alt="${alt}" data-base-src="${src}" src="${src}" onload="this.parentElement.classList.add('loaded')" onerror="window.retryPortraitV28?retryPortraitV28(this):(this.style.display='none')"></div>`;
  }
  try {
    portraitHTMLV2 = portraitHTMLV33;
  } catch (_) {}
  window.portraitHTMLV2 = portraitHTMLV33;

  function renderRosterCardV33(d, i) {
    const p = driverProfiles[d[0]] || {},
      legend = isLegendV33(d[0]);
    return `<div class="driverchoice v2DriverChoice ${legend ? "legendDriverChoiceV33" : ""}" onclick="chooseDriver(${i})"><span class="ovr">${d[2]}</span><div class="v2PortraitWrap">${portraitHTMLV33(d[0])}</div><div class="v2DriverCopy"><b>#${p.number ?? "—"} ${d[0]}${legend ? '<span class="legendRosterMarkV33">LEGEND</span>' : ""}</b><small>${p.nation || "—"} · ${d[1]}<br>OVR ${d[2]} · EXP ${d[3]} · RAC ${d[4]}</small></div></div>`;
  }
  function openDriverSelectV33() {
    try {
      if (typeof cleanupCustomRosterV19 === "function")
        cleanupCustomRosterV19();
    } catch (_) {}
    selected = null;
    applyLegendRosterV33();
    document.getElementById("modalTitle").textContent =
      "SELECT YOUR DRIVER · 2026";
    const box = document.getElementById("modalBody");
    if (!box) return;
    const used = Object.keys(legendConfigV33).length;
    box.innerHTML = `<div class="legendTopV33"><div><b>2026 真实车手生涯</b><span>${legendEnabledV33 ? "传奇替换已开启 · 围场仍保持 22 个正式席位" : "默认使用 2026 的 22 个正式席位"}</span></div><div class="legendTopActionsV33"><button class="mini legendToggleV33 ${legendEnabledV33 ? "on" : ""}" onclick="openLegendManagerV33()">更多车手 ${legendEnabledV33 ? "ON" : "OFF"}${used ? " · " + used : ""}</button></div></div><div class="drivergrid v2DriverGrid">${drivers.map(renderRosterCardV33).join("")}</div>`;
    document.getElementById("overlay").classList.add("open");
  }
  try {
    openDriverSelect = openDriverSelectV33;
  } catch (_) {}
  window.openDriverSelect = openDriverSelectV33;

  function legendCardV33(name) {
    const l = LEGENDS_V33[name],
      target = legendConfigV33[name],
      base = target ? BASE_ROSTER_V33.find((d) => d[0] === target) : null;
    return `<div class="legendCardV33"><div class="legendBadgeV33">LEGEND</div><div class="legendPortraitV33"><div class="legendPortraitCircleV33">${portraitHTMLV33(name)}</div></div><div class="legendCopyV33"><h3>${name}</h3><div class="legendMetaV33">${l.nation} · 巅峰平衡数值</div><div class="legendStatsV33">OVR ${l.stats[0]} EXP ${l.stats[1]} RAC ${l.stats[2]} AWA ${l.stats[3]} PAC ${l.stats[4]}</div><div class="legendSeatV33">${target ? `当前替换：${target} · ${base?.[1] || ""}` : "尚未加入当前围场"}</div></div><div class="legendCardActionsV33"><button class="mini" onclick="beginLegendReplacementV33('${name.replace(/'/g, "\\'")}')">${target ? "更换席位" : "加入围场"}</button>${target ? `<button class="mini" onclick="removeLegendV33('${name.replace(/'/g, "\\'")}')">移除</button>` : ""}</div></div>`;
  }
  window.openLegendManagerV33 = function () {
    legendEnabledV33 = true;
    applyLegendRosterV33();
    document.getElementById("modalTitle").textContent =
      "MORE DRIVERS · LEGENDS";
    document.getElementById("modalBody").innerHTML =
      `<div class="legendTopV33"><div><b>传奇替换程序</b><span>最多可让 15 位传奇同时加入，但总围场始终保持 22 人。传奇会继承被替换车手的 2026 车队席位与车号。</span></div><div class="legendTopActionsV33"><button class="mini" onclick="resetLegendsV33()">恢复默认围场</button><button class="mini primary" onclick="openDriverSelectV33()">完成 · 返回选人</button></div></div><div class="legendGridV33">${legendNamesV33().map(legendCardV33).join("")}</div><div class="legendFooterV33">头像使用公开可用的历史人物照片，并统一裁切成与现役车手相近的圆形头像框。不同年代没有统一的 F1 官方立绘，因此这里优先保持人物可辨识度和界面一致性。照片由 Wikimedia Commons 重定向加载，具体授权与作者信息可在对应 Commons 文件页查看。</div>`;
    document.getElementById("overlay").classList.add("open");
  };
  window.beginLegendReplacementV33 = function (name) {
    const current = legendConfigV33[name],
      occupied = new Set(
        Object.entries(legendConfigV33)
          .filter(([l]) => l !== name)
          .map(([, t]) => t),
      );
    document.getElementById("modalTitle").textContent =
      `选择替换席位 · ${name}`;
    document.getElementById("modalBody").innerHTML =
      `<div class="legendTopV33"><div><b>选择一名 2026 现役车手</b><span>${name} 会直接接管该车手的车队席位和车号；被替换车手不会进入这份新生涯存档。</span></div><button class="mini" onclick="openLegendManagerV33()">← 返回传奇池</button></div><div class="legendReplaceGridV33">${BASE_ROSTER_V33.map(
        (d) => {
          const used = occupied.has(d[0]),
            p = BASE_PROFILE_V33[d[0]] || {};
          return `<div class="legendSeatChoiceV33 ${used ? "used" : ""}" ${used ? "" : `onclick="assignLegendV33('${name.replace(/'/g, "\\'")}','${d[0].replace(/'/g, "\\'")}')"`}><b>#${p.number ?? "—"} ${d[0]}${current === d[0] ? '<span class="legendCurrentMarkV33">当前</span>' : ""}</b><span>${d[1]} · OVR ${d[2]}</span>${used ? "<i>已被其他传奇占用</i>" : ""}</div>`;
        },
      ).join("")}</div>`;
  };
  window.assignLegendV33 = function (name, target) {
    legendEnabledV33 = true;
    legendConfigV33[name] = target;
    applyLegendRosterV33();
    openLegendManagerV33();
  };
  window.removeLegendV33 = function (name) {
    delete legendConfigV33[name];
    if (!Object.keys(legendConfigV33).length) legendEnabledV33 = true;
    applyLegendRosterV33();
    openLegendManagerV33();
  };
  window.resetLegendsV33 = function () {
    legendConfigV33 = {};
    legendEnabledV33 = false;
    applyLegendRosterV33();
    openDriverSelectV33();
  };
  window.openDriverSelectV33 = openDriverSelectV33;

  // Custom career always starts from the normal 2026 grid.
  try {
    const customPrevV33 = window.openCustomCareerV19;
    if (customPrevV33) {
      const customWrappedV33 = function () {
        legendConfigV33 = {};
        legendEnabledV33 = false;
        applyLegendRosterV33();
        return customPrevV33.apply(this, arguments);
      };
      window.openCustomCareerV19 = customWrappedV33;
      try {
        openCustomCareerV19 = customWrappedV33;
      } catch (_) {}
    }
  } catch (_) {}

  // Persist legend replacements and rebuild them BEFORE older restore handlers search for selected driver.
  const snapshotV33Prev = snapshot;
  snapshot = function () {
    const s = snapshotV33Prev();
    s.version = 350;
    s.majorVersion = "3.5";
    s.featureSet = "achievements-legends-contract-alert-barcelona-v3";
    if (legendEnabledV33 || Object.keys(legendConfigV33).length) {
      s.legendEnabledV33 = !!legendEnabledV33;
      s.legendConfigV33 = safeCopyV33(legendConfigV33);
      s.rosterV33 = drivers.map((d) => [d[0], d[1]]);
    }
    return s;
  };
  window.snapshot = snapshot;

  const restoreV33Prev = restoreSnapshot;
  restoreSnapshot = function (data) {
    if (data?.customV19) {
      legendConfigV33 = {};
      legendEnabledV33 = false;
      applyLegendRosterV33();
    } else {
      legendConfigV33 = safeCopyV33(data?.legendConfigV33 || {});
      legendEnabledV33 =
        !!data?.legendEnabledV33 || Object.keys(legendConfigV33).length > 0;
      applyLegendRosterV33();
    }
    const ok = restoreV33Prev(data);
    if (ok && data?.rosterV33) {
      data.rosterV33.forEach(([name, team]) => {
        const d = drivers.find((x) => x[0] === name);
        if (d && teams[team]) d[1] = team;
      });
      selected = drivers.find((d) => d[0] === data.selected) || selected;
      try {
        if (state) state.legendConfigV33 = safeCopyV33(legendConfigV33);
      } catch (_) {}
      renderProfile();
      renderHub();
    }
    return ok;
  };
  window.restoreSnapshot = restoreSnapshot;

  const startCareerV33Prev = startCareer;
  startCareer = function () {
    const r = startCareerV33Prev.apply(this, arguments);
    if (selected && !state.customModeV19) {
      state.legendConfigV33 = safeCopyV33(legendConfigV33);
      state.legendEnabledV33 = legendEnabledV33;
    }
    return r;
  };
  window.startCareer = startCareer;

  // Preload only legends actually inserted into the roster; avoids 15 extra downloads by default.
  function preloadActiveLegendsV33() {
    try {
      Object.keys(legendConfigV33).forEach((n, i) =>
        setTimeout(() => {
          const im = new Image();
          im.src = LEGENDS_V33[n].portrait;
        }, i * 60),
      );
    } catch (_) {}
  }
  const applyPrevV33 = window.applyLegendRosterV33;
  window.applyLegendRosterV33 = function () {
    const r = applyPrevV33();
    preloadActiveLegendsV33();
    return r;
  };
})();

/* v34-contract-alert-script */

(function () {
  function updateContractAlertV34() {
    if (!selected) return;
    const card = document.querySelector(
      '#career .modules .module[onclick*="contracts"]',
    );
    if (!card) return;
    let open = false;
    try {
      open =
        typeof marketOpenV23 === "function"
          ? marketOpenV23()
          : state.round >= 14 && state.round <= calendar.length;
    } catch (_) {
      open = state.round >= 14;
    }
    const unsigned = open && !state.contract?.nextTeam;
    card.classList.toggle("contractAlertV34", !!unsigned);
    const st = document.getElementById("contractStatus");
    if (st && unsigned) {
      st.textContent =
        state.contractAttemptRoundV17 === state.round
          ? "未签约 · 本周已尝试"
          : "未签约 · 请处理";
    }
  }
  window.updateContractAlertV34 = updateContractAlertV34;

  const renderHubV34Prev = renderHub;
  renderHub = function () {
    const r = renderHubV34Prev.apply(this, arguments);
    try {
      updateContractAlertV34();
    } catch (_) {}
    return r;
  };
  window.renderHub = renderHub;

  const renderContractsV34Prev = renderContractsV10;
  renderContractsV10 = function () {
    const r = renderContractsV34Prev.apply(this, arguments);
    try {
      updateContractAlertV34();
    } catch (_) {}
    return r;
  };
  window.renderContractsV10 = renderContractsV10;

  setTimeout(() => {
    try {
      updateContractAlertV34();
    } catch (_) {}
  }, 0);
})();

/* v37-core-engine */

/*
  V3.7 CLEAN COMPETITION CORE
  ---------------------------------
  The older version blocks above are kept only because they contain UI features and
  save migrations. Race balance, quick simulation, AI weekend setup and AI R&D are
  centralized here so there is one active source of truth for competitive logic.
*/
(function () {
  const BALANCE_V36 = Object.freeze({
    weights: Object.freeze({ car: 50, driver: 15, event: 35, luck: 10 }),
    weightJitter: 2.0,
    directEventMin: 52,
    directEventMax: 88,
    aiEventMin: 52,
    aiEventMax: 88,
    luckSamples: 3,
    gridStep: 0.24,
    gridMin: -2.8,
    gridMax: 3.0,
    aiSetupMain: 1.55,
    aiSetupSecond: 0.7,
    aiSetupTradeoff: -0.75,
    carCeiling: 98,
  });
  window.BALANCE_V36 = BALANCE_V36;

  const TOP4_BASELINE_V36 = Object.freeze({
    Mercedes: Object.freeze([77.2, 79.2, 80, 77.5, 78.5, 71.5]),
    Ferrari: Object.freeze([66, 78.5, 79.5, 76.5, 75.8, 79.2]),
    McLaren: Object.freeze([74.5, 77.5, 75.8, 74.8, 76.8, 71.5]),
    "Red Bull Racing": Object.freeze([82, 73, 73, 72, 72, 74]),
  });
  const OLD_TOP4_BASELINE_V35 = Object.freeze({
    Mercedes: Object.freeze([78, 80, 81, 78, 79, 70]),
    Ferrari: Object.freeze([65, 77.8, 78.8, 75.8, 74.8, 79.2]),
    McLaren: Object.freeze([74.5, 76.8, 74.9, 73.9, 75.9, 71]),
    "Red Bull Racing": Object.freeze([82, 73, 73, 72, 72, 74]),
  });

  const AI_PROJECTS_V36 = Object.freeze({
    quick: Object.freeze({
      key: "quick",
      label: "快速升级",
      duration: 1,
      cost: 2.0,
      minGain: 0.5,
      maxGain: 1.5,
    }),
    standard: Object.freeze({
      key: "standard",
      label: "标准研发",
      duration: 3,
      cost: 4.5,
      minGain: 2.5,
      maxGain: 5.0,
    }),
    major: Object.freeze({
      key: "major",
      label: "大型升级",
      duration: 5,
      cost: 7.4,
      minGain: 6.0,
      maxGain: 8.0,
    }),
  });

  const clampV36 = (x, a, b) => Math.max(a, Math.min(b, x));
  const randV36 = (a, b) => a + Math.random() * (b - a);
  const round1V36 = (x) => Math.round(Number(x) * 10) / 10;
  const seasonV36 = () =>
    typeof seasonYearV11 === "function"
      ? seasonYearV11()
      : Number(state?.seasonYear || 2026);
  function setBaselineTeamV36(team, vals, applyCurrent = true) {
    if (CAR_BASE_V11?.[team]) CAR_BASE_V11[team] = vals.slice();
    if (CAR_BASE_V10?.[team]) CAR_BASE_V10[team] = vals.slice();
    if (baseTeams?.[team]) {
      CAR_ATTRS_V10.forEach((a, i) => (baseTeams[team].parts[a] = vals[i]));
      recalcTeamOvr(baseTeams[team]);
    }
    if (applyCurrent && teams?.[team]) {
      CAR_ATTRS_V10.forEach((a, i) => (teams[team].parts[a] = vals[i]));
      recalcTeamOvr(teams[team]);
    }
  }
  function applyFreshBaselineV36(applyCurrent = true) {
    Object.entries(TOP4_BASELINE_V36).forEach(([team, vals]) =>
      setBaselineTeamV36(team, vals, applyCurrent),
    );
  }
  function migrateBaselineV36() {
    Object.entries(TOP4_BASELINE_V36).forEach(([team, vals]) => {
      const old = OLD_TOP4_BASELINE_V35[team],
        car = teams?.[team];
      if (!old || !car?.parts) return;
      CAR_ATTRS_V10.forEach(
        (a, i) =>
          (car.parts[a] = round1V36(
            clampV36(
              Number(car.parts[a] || 0) + (Number(vals[i]) - Number(old[i])),
              45,
              BALANCE_V36.carCeiling,
            ),
          )),
      );
      recalcTeamOvr(car);
    });
    applyFreshBaselineV36(false);
  }

  /* ---------- shared scoring ---------- */
  function newWeightsV36() {
    const raw = {};
    let sum = 0;
    for (const k of ["car", "driver", "event", "luck"]) {
      raw[k] = Math.max(
        1,
        BALANCE_V36.weights[k] +
          randV36(-BALANCE_V36.weightJitter, BALANCE_V36.weightJitter),
      );
      sum += raw[k];
    }
    return {
      car: raw.car / sum,
      driver: raw.driver / sum,
      event: raw.event / sum,
      luck: raw.luck / sum,
    };
  }
  function ensureWeightsV36(phase, force = false) {
    if (!state.weekend) state.weekend = {};
    if (!state.weekend.scoreWeightsV36) state.weekend.scoreWeightsV36 = {};
    if (force || !state.weekend.scoreWeightsV36[phase])
      state.weekend.scoreWeightsV36[phase] = newWeightsV36();
    return state.weekend.scoreWeightsV36[phase];
  }
  function balancedLuckV36(raw) {
    let sum = Number.isFinite(Number(raw)) ? Number(raw) : Math.random() * 100;
    for (let i = 1; i < BALANCE_V36.luckSamples; i++)
      sum += Math.random() * 100;
    return clampV36(sum / BALANCE_V36.luckSamples, 0, 100);
  }
  function gridBonusV36(d, phase) {
    if (phase !== "race" || !state.weekend?.qualField) return 0;
    const q = state.weekend.qualField.find((x) => x.name === d[0]);
    if (!q || !Number.isFinite(Number(q.position))) return 0;
    return clampV36(
      (12 - Number(q.position)) * BALANCE_V36.gridStep,
      BALANCE_V36.gridMin,
      BALANCE_V36.gridMax,
    );
  }

  /* ---------- symmetric weekend setup ---------- */
  function zeroModsV36() {
    const o = {};
    CAR_ATTRS_V10.forEach((a) => (o[a] = 0));
    return o;
  }
  function ensureAIWeekendSetupV36(force = false) {
    if (!state || !selected) return;
    const key = `${seasonV36()}-${state.round}`;
    if (!force && state.aiWeekendModsV36Key === key && state.aiWeekendModsV36)
      return;
    state.aiWeekendModsV36Key = key;
    state.aiWeekendModsV36 = {};
    const q = currentDemandV10("qual", state.round),
      r = currentDemandV10("race", state.round);
    const combo = CAR_ATTRS_V10.map((a, i) => ({
      a,
      i,
      w: (Number(q[i] || 0) + Number(r[i] || 0)) / 2,
    })).sort((x, y) => y.w - x.w);
    const main = combo[0]?.a,
      second = combo[1]?.a,
      trade = combo[combo.length - 1]?.a;
    Object.keys(teams).forEach((team) => {
      const m = zeroModsV36();
      const dev = Number(teams[team]?.dev || 85),
        quality = clampV36(0.94 + (dev - 85) * 0.003, 0.9, 1.04);
      if (main)
        m[main] = round1V36(
          (BALANCE_V36.aiSetupMain + randV36(-0.18, 0.18)) * quality,
        );
      if (second)
        m[second] = round1V36(
          (BALANCE_V36.aiSetupSecond + randV36(-0.14, 0.14)) * quality,
        );
      if (trade)
        m[trade] = round1V36(
          BALANCE_V36.aiSetupTradeoff + randV36(-0.12, 0.12),
        );
      state.aiWeekendModsV36[team] = m;
    });
  }
  function teamWeekendModV36(team, attr) {
    ensureAIWeekendSetupV36(false);
    if (state?.fullSeasonNeutralV36)
      return Number(state.aiWeekendModsV36?.[team]?.[attr] || 0);
    if (!selected || team === selected[1]) {
      try {
        return Number(
          state.teamEventV16?.resolved &&
            state.teamEventV16.round === state.round
            ? state.weeklyCarModsV16?.[attr] || 0
            : 0,
        );
      } catch (_) {
        return 0;
      }
    }
    return Number(state.aiWeekendModsV36?.[team]?.[attr] || 0);
  }
  effectiveModV16 = function (attr) {
    return selected ? teamWeekendModV36(selected[1], attr) : 0;
  };
  effectivePartV16 = function (team, attr) {
    return (
      Number(teams[team]?.parts?.[attr] || 50) + teamWeekendModV36(team, attr)
    );
  };
  window.effectiveModV16 = effectiveModV16;
  window.effectivePartV16 = effectivePartV16;

  trackFitV10 = function (team, phase = "race", round = state.round) {
    const w = currentDemandV10(phase, round),
      sum = w.reduce((a, b) => a + b, 0) || 1;
    return (
      CAR_ATTRS_V10.reduce(
        (s, a, i) => s + effectivePartV16(team, a) * Number(w[i] || 0),
        0,
      ) / sum
    );
  };
  window.trackFitV10 = trackFitV10;

  computeScore = function (d, phase, eventQuality, luckRoll, noBonus = false) {
    const w = ensureWeightsV36(phase, false);
    const car = trackFitV10(d[1], phase);
    const driver = Math.min(
      100,
      driverPhaseRating(d, phase) + prepBonusForDriverV10(d, phase, noBonus),
    );
    const eventQ = clampV36(Number(eventQuality) || 60, 15, 100);
    const luck = balancedLuckV36(luckRoll);
    const gridAdj = gridBonusV36(d, phase);
    let total =
      car * w.car +
      driver * w.driver +
      eventQ * w.event +
      luck * w.luck +
      gridAdj;
    let playerDecision = 0;
    /* Manual preparation/affairs may reward the player; quick/full auto simulation receives none. */
    if (!noBonus && selected && d[0] === selected[0]) {
      const affairs =
        (state.affairsNextRaceModifier || 0) +
        (state.affairsLongTermModifier || 0);
      const weekly =
        phase === "qual"
          ? state.affairsWeekendQual || 0
          : state.affairsWeekendRace || 0;
      playerDecision = affairs + weekly;
      total += playerDecision;
    }
    return {
      total,
      car,
      driver,
      eventQuality: eventQ,
      luckRoll: luck,
      gridAdj,
      weights: { ...w },
      playerDecision,
    };
  };
  window.computeScore = computeScore;

  simulateAIFieldV10 = function (phase, noPlayerBonus = false) {
    ensureAITrainingV10();
    ensureAIWeekendSetupV36(false);
    return drivers
      .filter((d) => d[0] !== selected[0])
      .map((d) => {
        const control = Number(state.aiPrep?.[d[0]]?.control || 0);
        const eq = clampV36(
          randV36(BALANCE_V36.aiEventMin, BALANCE_V36.aiEventMax) +
            control * 0.25,
          35,
          96,
        );
        const sc = computeScore(d, phase, eq, Math.random() * 100, false);
        return {
          name: d[0],
          team: d[1],
          total: sc.total,
          strategy: aiStrategyV10(),
          mine: false,
        };
      });
  };
  simulateAIField = simulateAIFieldV10;
  window.simulateAIFieldV10 = simulateAIFieldV10;
  window.simulateAIField = simulateAIFieldV10;

  simulateDirectSessionV10 = function (phase) {
    ensureWeightsV36(phase, true);
    ensureAIWeekendSetupV36(false);
    let field = drivers
      .map((d) => {
        const eventQ = randV36(
          BALANCE_V36.directEventMin,
          BALANCE_V36.directEventMax,
        );
        const sc = computeScore(d, phase, eventQ, Math.random() * 100, true);
        /* Auto simulation treats the selected driver exactly like the rest of the grid. */
        return {
          name: d[0],
          team: d[1],
          total: sc.total,
          mine: d[0] === selected[0],
          strategy: aiStrategyV10(),
        };
      })
      .sort((a, b) => b.total - a.total);
    if (phase === "race") applyAttritionV10(field);
    field.forEach((x, i) => (x.position = i + 1));
    if (phase === "race") {
      let fin = 0;
      field.forEach((x) => {
        if (!x.dnf) {
          fin++;
          x.position = fin;
        } else x.position = 99;
      });
      field.filter((x) => x.dnf).forEach((x, i) => (x.position = fin + i + 1));
      const pts = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
      field.forEach((x) => (x.points = x.dnf ? 0 : pts[x.position - 1] || 0));
    }
    return field;
  };
  window.simulateDirectSessionV10 = simulateDirectSessionV10;

  function dnsChanceV36(d) {
    const rel = clampV36(effectivePartV16(d[1], "可靠性/冷却"), 40, 95);
    return clampV36(
      0.0015 + Math.max(0, 74 - rel) * 0.00115 + Math.max(0, 62 - rel) * 0.0015,
      0.001,
      0.045,
    );
  }
  window.dnsChanceV36 = dnsChanceV36;
  applyAttritionV10 = function (field) {
    field.forEach((x) => {
      const d = drivers.find((z) => z[0] === x.name);
      if (!d) return;
      const alreadyChecked = x.mine && state?.weekend?.dnsCheckedV29;
      if (!x.dnf && !alreadyChecked && Math.random() < dnsChanceV36(d)) {
        x.dnf = true;
        x.dns = true;
        x.status = "DNS";
        x.retirementLap = 0;
        x.total = -10000;
        return;
      }
      if (x.dnf) return;
      const extra = x.mine ? Number(state.weekend?.dnfRisk || 0) : 0;
      if (
        Math.random() < retirementChanceV10(d, x.strategy || "normal", extra)
      ) {
        x.dnf = true;
        x.status = "DNF";
        x.retirementLap = 5 + Math.floor(Math.random() * 50);
        x.total = -100 + x.retirementLap / 100;
      }
    });
    field.sort((a, b) => {
      if (!!a.dnf !== !!b.dnf) return a.dnf ? 1 : -1;
      if (a.dnf && b.dnf) {
        if (!!a.dns !== !!b.dns) return a.dns ? 1 : -1;
        return (b.retirementLap || 0) - (a.retirementLap || 0);
      }
      return b.total - a.total;
    });
  };
  window.applyAttritionV10 = applyAttritionV10;

  /* ---------- AI R&D: same budget, two-slot and project rules as player auto-R&D ---------- */
  function initialAIBudgetV36(team) {
    try {
      return Number(
        BUDGETS_V17?.[team] ??
          TEAM_BUDGET_V11?.[team] ??
          baseTeams?.[team]?.budget ??
          45,
      );
    } catch (_) {
      return Number(baseTeams?.[team]?.budget || 45);
    }
  }
  function ensureAIRDV36(reset = false) {
    if (!state || !selected) return;
    if (reset || !state.aiRDV36) state.aiRDV36 = { version: 36, teams: {} };
    if (!state.aiRDV36.teams) state.aiRDV36.teams = {};
    Object.keys(teams).forEach((team) => {
      if (!state.aiRDV36.teams[team]) {
        const elapsed = Math.max(0, Number(state.round || 1) - 1);
        state.aiRDV36.teams[team] = {
          budget: Math.max(
            0,
            round1V36(initialAIBudgetV36(team) - elapsed * 2.0),
          ),
          projects: [],
        };
      }
      if (!Array.isArray(state.aiRDV36.teams[team].projects))
        state.aiRDV36.teams[team].projects = [];
      if (!Number.isFinite(Number(state.aiRDV36.teams[team].budget)))
        state.aiRDV36.teams[team].budget = initialAIBudgetV36(team);
      if (!state.aiNextSeasonResearch?.[team]) {
        if (!state.aiNextSeasonResearch) state.aiNextSeasonResearch = {};
        state.aiNextSeasonResearch[team] = {};
        CAR_ATTRS_V10.forEach((a) => (state.aiNextSeasonResearch[team][a] = 0));
      }
    });
  }
  function teamRankV36(team) {
    const order = Object.keys(teams).sort(
      (a, b) =>
        (state.teamStandings?.[b] || 0) - (state.teamStandings?.[a] || 0) ||
        (teams[b]?.ovr || 0) - (teams[a]?.ovr || 0),
    );
    return Math.max(1, order.indexOf(team) + 1);
  }
  function aiTargetV36(team) {
    if (state.round < 10) return "current";
    const rank = teamRankV36(team),
      late = Math.max(
        0,
        (state.round - 10) / Math.max(1, calendar.length - 10),
      );
    const futureChance =
      rank <= 3
        ? 0.4 + late * 0.1
        : rank <= 7
          ? 0.45 + late * 0.11
          : 0.5 + late * 0.12;
    return Math.random() < futureChance ? "next" : "current";
  }
  function aiProjectTypeV36(budget, remain) {
    if (
      remain >= 5 &&
      budget >= AI_PROJECTS_V36.major.cost &&
      Math.random() < 0.48
    )
      return AI_PROJECTS_V36.major;
    if (
      remain >= 3 &&
      budget >= AI_PROJECTS_V36.standard.cost &&
      Math.random() < 0.62
    )
      return AI_PROJECTS_V36.standard;
    if (remain >= 1 && budget >= AI_PROJECTS_V36.quick.cost)
      return AI_PROJECTS_V36.quick;
    return null;
  }
  function aiPartV36(team, target, projects) {
    const used = new Set(
      projects.filter((p) => p.target === target).map((p) => p.part),
    );
    let attrs = CAR_ATTRS_V10.filter((a) => !used.has(a));
    if (!attrs.length) return null;
    if (target === "next")
      attrs.sort(
        (a, b) =>
          Number(state.aiNextSeasonResearch?.[team]?.[a] || 0) -
          Number(state.aiNextSeasonResearch?.[team]?.[b] || 0),
      );
    else
      attrs.sort(
        (a, b) =>
          Number(teams[team].parts[a] || 0) - Number(teams[team].parts[b] || 0),
      );
    const pool = attrs.slice(0, Math.min(3, attrs.length));
    return pool[Math.floor(Math.random() * pool.length)];
  }
  function completeAIProjectsV36(team, rd) {
    const done = rd.projects.filter((p) => p.finish <= state.round);
    if (!done.length) return;
    done.forEach((p) => {
      const gain = round1V36(randV36(p.minGain, p.maxGain));
      if (p.target === "next")
        state.aiNextSeasonResearch[team][p.part] = round1V36(
          Number(state.aiNextSeasonResearch[team][p.part] || 0) + gain,
        );
      else
        teams[team].parts[p.part] = round1V36(
          Math.min(
            BALANCE_V36.carCeiling,
            Number(teams[team].parts[p.part] || 0) + gain,
          ),
        );
      state.aiDevNews?.unshift(
        `${team}：${p.target === "next" ? "下一代" : "当前"} ${p.part} · ${p.label} 完成 +${gain.toFixed(1)}`,
      );
    });
    rd.projects = rd.projects.filter((p) => p.finish > state.round);
    recalcTeamOvr(teams[team]);
  }
  function fillAIProjectsV36(team, rd, includeSelected = false) {
    if (team === selected[1] && !includeSelected) return;
    const remain = calendar.length - state.round;
    let guard = 0;
    while (
      rd.projects.length < 2 &&
      rd.budget >= AI_PROJECTS_V36.quick.cost &&
      remain >= 1 &&
      guard++ < 5
    ) {
      const target = aiTargetV36(team),
        type = aiProjectTypeV36(rd.budget, remain),
        part = aiPartV36(team, target, rd.projects);
      if (!type || !part) break;
      rd.budget = round1V36(rd.budget - type.cost);
      rd.projects.push({
        part,
        target,
        type: type.key,
        label: type.label,
        start: state.round,
        finish: state.round + type.duration,
        minGain: type.minGain,
        maxGain: type.maxGain,
      });
      state.aiDevNews?.unshift(
        `${team}：立项 ${type.label} · ${target === "next" ? "下一代 " : ""}${part}`,
      );
    }
  }
  function aiRDStepV36(includeSelected = false) {
    ensureAIRDV36(false);
    Object.keys(teams).forEach((team) => {
      if (team === selected[1] && !includeSelected) return;
      const rd = state.aiRDV36.teams[team];
      completeAIProjectsV36(team, rd);
      fillAIProjectsV36(team, rd, includeSelected);
    });
    if (includeSelected && selected && state.aiRDV36?.teams?.[selected[1]])
      state.budget = Number(state.aiRDV36.teams[selected[1]].budget || 0);
    if (Array.isArray(state.aiDevNews))
      state.aiDevNews = state.aiDevNews.slice(0, 12);
  }
  processAIDevelopmentV10 = function () {
    aiRDStepV36(!!state?.fullSeasonNeutralV36);
  };
  window.processAIDevelopmentV10 = processAIDevelopmentV10;
  window.aiRDStepV36 = aiRDStepV36;

  /* ---------- lifecycle / save migration ---------- */
  const startRacePhaseV36Prev = startRacePhase;
  startRacePhase = function (phase) {
    if (phase === "qual") ensureWeightsV36("qual", true);
    if (phase === "race" && !state.weekend?.pendingPhase)
      ensureWeightsV36("race", true);
    ensureAIWeekendSetupV36(false);
    return startRacePhaseV36Prev.apply(this, arguments);
  };
  window.startRacePhase = startRacePhase;

  if (typeof simulateSprintFieldV12 === "function") {
    simulateSprintFieldV12 = function (noPlayerChoice = false) {
      const pts = [8, 7, 6, 5, 4, 3, 2, 1];
      ensureWeightsV36("race", true);
      ensureAIWeekendSetupV36(false);
      let field = drivers
        .map((d) => {
          const mine = d[0] === selected[0],
            strat =
              !noPlayerChoice && mine
                ? state.weekend.sprintStrategy || "normal"
                : aiStrategyV10(),
            eq = randV36(
              BALANCE_V36.directEventMin,
              BALANCE_V36.directEventMax,
            ),
            sc = computeScore(d, "race", eq, Math.random() * 100, true);
          return {
            name: d[0],
            team: d[1],
            total: sc.total,
            mine,
            strategy: strat,
            dnf: false,
          };
        })
        .sort((a, b) => b.total - a.total);
      field.forEach((x) => {
        const d = drivers.find((v) => v[0] === x.name),
          base = retirementChanceV10(d, x.strategy, 0) * 0.52;
        if (Math.random() < base) {
          x.dnf = true;
          x.total -= 100;
        }
      });
      field.sort((a, b) => {
        if (a.dnf !== b.dnf) return a.dnf ? 1 : -1;
        return b.total - a.total;
      });
      if (!noPlayerChoice && state.weekend.sprintStrategy)
        applyStrategyShiftV10(
          field,
          selected[0],
          "race",
          state.weekend.sprintStrategy,
        );
      let fin = 0;
      field.forEach((x) => {
        if (!x.dnf) {
          fin++;
          x.position = fin;
          x.points = pts[fin - 1] || 0;
        } else {
          x.position = 99;
          x.points = 0;
        }
      });
      field.filter((x) => x.dnf).forEach((x, i) => (x.position = fin + i + 1));
      return field;
    };
    window.simulateSprintFieldV12 = simulateSprintFieldV12;
  }

  const startCareerV36Prev = startCareer;
  startCareer = function () {
    const r = startCareerV36Prev.apply(this, arguments);
    if (!state?.customModeV19) applyFreshBaselineV36(true);
    ensureAIRDV36(true);
    ensureAIWeekendSetupV36(true);
    aiRDStepV36(false);
    if (state?.weekend) state.weekend.scoreWeightsV36 = {};
    try {
      renderHub();
      autosave();
    } catch (_) {}
    return r;
  };
  window.startCareer = startCareer;

  const advanceRoundV36Prev = advanceRound;
  advanceRound = function () {
    const before = state?.round;
    const r = advanceRoundV36Prev.apply(this, arguments);
    if (selected && state?.round !== before) {
      ensureAIWeekendSetupV36(true);
      if (state.weekend) state.weekend.scoreWeightsV36 = {};
    }
    return r;
  };
  window.advanceRound = advanceRound;

  const startNextSeasonV36Prev = startNextSeasonV11;
  startNextSeasonV11 = function () {
    const before = seasonV36(),
      r = startNextSeasonV36Prev.apply(this, arguments);
    if (selected && seasonV36() > before) {
      applyFreshBaselineV36(false);
      ensureAIRDV36(true);
      ensureAIWeekendSetupV36(true);
      aiRDStepV36(false);
      if (state.weekend) state.weekend.scoreWeightsV36 = {};
      try {
        autosave();
      } catch (_) {}
    }
    return r;
  };
  window.startNextSeasonV11 = startNextSeasonV11;

  const restoreV36Prev = restoreSnapshot;
  restoreSnapshot = function (data) {
    const ok = restoreV36Prev.apply(this, arguments);
    if (ok && selected) {
      if (Number(data?.version || 0) < 360 && !state?.customModeV19)
        migrateBaselineV36();
      else applyFreshBaselineV36(false);
      ensureAIRDV36(false);
      ensureAIWeekendSetupV36(true);
      if (state.weekend) state.weekend.scoreWeightsV36 = {};
      try {
        renderHub();
      } catch (_) {}
    }
    return ok;
  };
  window.restoreSnapshot = restoreSnapshot;

  function autoContractV36() {
    if (
      state.round < 14 ||
      state.contract?.nextTeam ||
      state.contractAttemptRoundV17 === state.round
    )
      return;
    try {
      if (
        !Array.isArray(state.marketOffersV17) ||
        !state.marketOffersV17.length ||
        state.marketOfferRoundV17 !== state.round
      )
        renderContractsV10();
    } catch (_) {
      return;
    }
    const offers = state.marketOffersV17 || [];
    if (!offers.length) return;
    const rank = typeof driverRankV10 === "function" ? driverRankV10() : 12,
      external = offers
        .filter((o) => o.kind === "team")
        .sort((a, b) => (b.chance || 0) - (a.chance || 0)),
      renew = offers.find((o) => o.kind === "renew");
    let pick;
    if (
      rank <= 6 &&
      external.length &&
      (external[0].chance || 0) >= 0.35 &&
      Math.random() < 0.58
    )
      pick = external[0];
    else
      pick =
        offers.slice().sort((a, b) => (b.chance || 0) - (a.chance || 0))[0] ||
        renew;
    if (!pick) return;
    state.contractAttemptRoundV17 = state.round;
    const ok = Math.random() < Number(pick.chance || 0.5);
    if (ok) {
      state.contract.nextTeam = pick.team;
      state.contract.signedRound = state.round;
      state.contract.history?.unshift(
        `R${String(state.round).padStart(2, "0")} · ${pick.kind === "renew" ? "续约成功" : "签约成功"} · ${pick.team}`,
      );
    } else
      state.contract.history?.unshift(
        `R${String(state.round).padStart(2, "0")} · 谈判失败 · ${pick.team}`,
      );
  }
  function ensureProgressV36() {
    let el = document.getElementById("fullSeasonProgressV27");
    if (!el) {
      el = document.createElement("div");
      el.id = "fullSeasonProgressV27";
      el.className = "fullSeasonProgressV27";
      el.innerHTML =
        '<div class="fullSeasonProgressBoxV27"><div class="kicker">FULL SEASON SIMULATION</div><h2>正在模拟完整赛季</h2><p></p><div class="fullSeasonBarV27"><i></i></div></div>';
      document.body.appendChild(el);
    }
    return el;
  }
  function progressV36(done, total, label = "") {
    const el = ensureProgressV36(),
      bar = el.querySelector("i"),
      p = el.querySelector("p");
    el.classList.add("show");
    if (bar)
      bar.style.width = `${clampV36((done / Math.max(1, total)) * 100, 0, 100)}%`;
    if (p) p.textContent = `${label} · ${done} / ${total}`;
  }
  function hideProgressV36() {
    document.getElementById("fullSeasonProgressV27")?.classList.remove("show");
  }
  function sleepV36(ms = 18) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function runFullSeasonV36() {
    if (!selected || state.fullSeasonSimulatingV18) return;
    if (typeof seasonCompleteV14 === "function" && seasonCompleteV14()) {
      showSeasonFinaleV10();
      return;
    }
    if (
      !confirm(
        `从 ${seasonV36()} R${String(state.round).padStart(2, "0")} 开始自动模拟到赛季结束？\n\nV3.6 自动模式下，主控车手与 AI 使用同一套比赛、周末设定和研发规则。`,
      )
    )
      return;
    state.fullSeasonSimulatingV18 = true;
    state.fullSeasonNeutralV36 = true;
    try {
      closeOverlay();
    } catch (_) {}
    ensureAIRDV36(false);
    if (state.aiRDV36?.teams?.[selected[1]]) {
      state.aiRDV36.teams[selected[1]].budget = Number(
        state.budget || initialAIBudgetV36(selected[1]),
      );
      state.aiRDV36.teams[selected[1]].projects = [];
    }
    aiRDStepV36(true);
    ensureAIWeekendSetupV36(true);
    const start = state.round,
      total = Math.max(1, calendar.length - start + 1);
    let done = 0,
      guard = 0;
    const original = {
      renderHub: window.renderHub,
      renderWeekendResult: window.renderWeekendResult,
      raceTransition: window.raceTransition,
      showView: window.showView,
      autosave: window.autosave,
    };
    try {
      window.renderHub = function () {};
      window.renderWeekendResult = function () {};
      window.raceTransition = function () {};
      window.showView = function () {};
      window.autosave = function () {};
      progressV36(0, total, currentRace()?.[1] || "");
      await sleepV36(20);
      while (selected && guard++ < 45) {
        autoContractV36();
        ensureAIWeekendSetupV36(false);
        if (currentRace()?.[4] && !state.weekend?.sprintResult) {
          state.weekend.sprintStrategy = "normal";
          const sf = simulateSprintFieldV12(true);
          state.weekend.sprintField = sf;
          state.weekend.sprintResult = {
            ...sf.find((x) => x.mine),
            field: sf.map((x) => ({ ...x })),
          };
          applySprintPointsV12(sf);
        }
        const q = simulateDirectSessionV10("qual");
        state.weekend.qualField = q;
        state.weekend.qualResult = q.find((x) => x.mine);
        if (state.weekend.qualResult?.position === 1)
          state.driverSeasonStats[selected[0]].poles++;
        const rf = simulateDirectSessionV10("race"),
          mine = rf.find((x) => x.mine);
        mine.field = rf.map((x) => ({ ...x }));
        mine.note = "完整赛季自动模拟";
        mine.choice = "自动";
        mine.eventTitle = "自动模拟";
        completeRaceResultV10(rf, mine, true);
        done++;
        progressV36(done, total, currentRace()?.[1] || "");
        if (done % 4 === 0 && typeof original.autosave === "function")
          original.autosave();
        if (state.round >= calendar.length) break;
        advanceRound();
        await sleepV36(14);
      }
    } catch (err) {
      console.error("Full season sim V36", err);
      showToastV14?.("完整赛季模拟中断 · 当前进度已保留");
    } finally {
      window.renderHub = original.renderHub;
      window.renderWeekendResult = original.renderWeekendResult;
      window.raceTransition = original.raceTransition;
      window.showView = original.showView;
      window.autosave = original.autosave;
      try {
        renderHub = original.renderHub;
        renderWeekendResult = original.renderWeekendResult;
        raceTransition = original.raceTransition;
        showView = original.showView;
        autosave = original.autosave;
      } catch (_) {}
      state.fullSeasonSimulatingV18 = false;
      state.fullSeasonNeutralV36 = false;
      hideProgressV36();
    }
    if (typeof original.autosave === "function") original.autosave();
    if (typeof original.renderHub === "function") original.renderHub();
    showSeasonFinaleV10();
    showToastV14?.(
      `完整赛季模拟完成 · R${String(start).padStart(2, "0")} → R${String(state.round).padStart(2, "0")}`,
    );
  }
  window.runFullSeasonV36 = runFullSeasonV36;
  window.runFullSeasonV27 = runFullSeasonV36;
  window.runFullSeasonV18 = runFullSeasonV36;
  try {
    runFullSeasonV18 = runFullSeasonV36;
  } catch (_) {}
  setTimeout(() => {
    const b = document.querySelector(".fullSeasonSimBtn");
    if (b) b.onclick = runFullSeasonV36;
  }, 0);

  const snapshotV36Prev = snapshot;
  snapshot = function () {
    const s = snapshotV36Prev();
    s.version = 370;
    s.majorVersion = "3.7";
    s.featureSet = "clean-core-rebalance-legends-achievements";
    return s;
  };
  window.snapshot = snapshot;

  applyFreshBaselineV36(false);
  setTimeout(() => {
    try {
      if (!selected) {
        applyFreshBaselineV36(true);
      } else {
        ensureAIRDV36(false);
        ensureAIWeekendSetupV36(true);
      }
    } catch (_) {}
  }, 0);
})();

/* v40-contract-script */

(function () {
  const CONTRACT_BASE_V40 = {
    "Max Verstappen": {
      end: 2028,
      label: "至 2028",
      clause: true,
      special: "MAX_2026_OUTSIDE_P2_BILATERAL",
      note: "仅限 2026：R10–R13 若车手积分排名跌出 P2（P3 或更低），双方解约条款触发；从夏休期开始可在合同市场使用，直至赛季结束前。",
    },
    "Isack Hadjar": {
      end: 2026,
      option: true,
      optionEnd: 2027,
      optionType: "team",
      label: "2026 + 2027 车队选项",
      note: "Red Bull 体系年度评估。",
    },
    "Charles Leclerc": {
      end: 2028,
      long: true,
      label: "长期合同 · 2028+",
      note: "长期核心合同，正常情况下不会提前进入市场。",
    },
    "Lewis Hamilton": {
      end: 2026,
      option: true,
      optionEnd: 2027,
      optionType: "driver",
      label: "2026 + 2027 选项",
      note: "2027 是否继续由合同选项与本存档表现共同决定。",
    },
    "Lando Norris": {
      end: 2027,
      long: true,
      label: "长期合同 · 2027+",
      note: "McLaren 长期核心合同。",
    },
    "Oscar Piastri": {
      end: 2028,
      long: true,
      label: "至 2028",
      note: "McLaren 长期续约。",
    },
    "George Russell": {
      end: 2026,
      option: true,
      optionEnd: 2027,
      optionType: "team",
      label: "2026 + 2027 车队选项",
      note: "Mercedes 可在 2026 后决定是否继续。",
    },
    "Kimi Antonelli": {
      end: 2026,
      option: true,
      optionEnd: 2027,
      optionType: "team",
      label: "2026 + 2027 车队选项",
      note: "Mercedes 年度评估与培养合同。",
    },
    "Fernando Alonso": {
      end: 2026,
      label: "至 2026",
      note: "2026 年底合同到期。",
    },
    "Lance Stroll": {
      end: 2026,
      rolling: true,
      label: "滚动合同",
      note: "每个赛季都会重新确认，但续留倾向较高。",
    },
    "Carlos Sainz": {
      end: 2026,
      option: true,
      optionEnd: 2027,
      optionType: "mutual",
      label: "2025–2026 + 延长选项",
      note: "Williams 拥有继续合作空间。",
    },
    "Alexander Albon": {
      end: 2026,
      option: true,
      optionEnd: 2027,
      optionType: "conditional",
      label: "2026 + 条件续约",
      note: "表现与车队规划共同影响 2027。",
    },
    "Pierre Gasly": {
      end: 2028,
      long: true,
      label: "至 2028",
      note: "Alpine 长期合同。",
    },
    "Franco Colapinto": {
      end: 2026,
      label: "至 2026",
      note: "赛季结束后需要重新争取席位。",
    },
    "Esteban Ocon": {
      end: 2026,
      label: "至 2026",
      note: "2027 席位在本存档中重新评估。",
    },
    "Oliver Bearman": {
      end: 2026,
      label: "至 2026",
      note: "2027 席位在本存档中重新评估。",
    },
    "Liam Lawson": {
      end: 2026,
      option: true,
      optionEnd: 2027,
      optionType: "team",
      label: "2026 + 2027 车队选项",
      note: "Red Bull 体系年度评估。",
    },
    "Arvid Lindblad": {
      end: 2026,
      option: true,
      optionEnd: 2027,
      optionType: "team",
      label: "2026 + 2027 车队选项",
      note: "新秀合同，后续根据表现决定。",
    },
    "Nico Hulkenberg": {
      end: 2027,
      label: "至少至 2027",
      note: "Audi 项目合同覆盖 2027。",
    },
    "Gabriel Bortoleto": {
      end: 2027,
      option: true,
      optionEnd: 2028,
      optionType: "team",
      label: "长期合同 · 至少 2027",
      note: "Audi 长期培养安排。",
    },
    "Sergio Perez": {
      end: 2027,
      option: true,
      optionEnd: 2028,
      optionType: "team",
      label: "至 2027 + 2028 选项",
      note: "Cadillac 多年度合同。",
    },
    "Valtteri Bottas": {
      end: 2027,
      option: true,
      optionEnd: 2028,
      optionType: "team",
      label: "至 2027 + 2028 选项",
      note: "Cadillac 多年度合同。",
    },
  };
  window.CONTRACT_BASE_V40 = CONTRACT_BASE_V40;
  function copyV40(x) {
    return JSON.parse(JSON.stringify(x));
  }
  function clamp40(v, a = 0, b = 100) {
    return Math.max(a, Math.min(b, v));
  }
  function y40() {
    return typeof seasonYearV11 === "function"
      ? seasonYearV11()
      : Number(state?.seasonYear || 2026);
  }
  function ensureContractsV40(reset = false) {
    if (!selected || !state) return;
    if (reset || !state.contractSystemV40Initialized) {
      if (reset || y40() === 2026)
        state.driverContracts = copyV40(CONTRACT_BASE_V40);
      else {
        if (!state.driverContracts) state.driverContracts = {};
        Object.entries(CONTRACT_BASE_V40).forEach(([n, c]) => {
          if (!state.driverContracts[n]) state.driverContracts[n] = copyV40(c);
        });
      }
      state.contractSystemV40Initialized = true;
    }
    if (!state.driverContracts)
      state.driverContracts = copyV40(CONTRACT_BASE_V40);
    if (!state.contract)
      state.contract = { nextTeam: null, signedRound: null, history: [] };
    if (!Array.isArray(state.contract.history)) state.contract.history = [];
    if (!Array.isArray(state.marketOffersV40)) state.marketOffersV40 = [];
    if (state.marketOfferRoundV40 == null) state.marketOfferRoundV40 = 0;
    if (state.contractAttemptRoundV40 == null)
      state.contractAttemptRoundV40 = 0;
    if (!state.aiClauseActivatedV40) state.aiClauseActivatedV40 = {};
    if (state.maxClauseActivatedV40 == null)
      state.maxClauseActivatedV40 = false;
    if (state.maxClauseDecisionResolvedV40 == null)
      state.maxClauseDecisionResolvedV40 = false;
    if (state.maxClauseTeamExitV40 == null) state.maxClauseTeamExitV40 = false;
    if (state.maxClauseRedBullKeepChanceV40 == null)
      state.maxClauseRedBullKeepChanceV40 = null;
  }
  function ci40(name) {
    ensureContractsV40(false);
    if (!state.driverContracts[name])
      state.driverContracts[name] = {
        end: y40(),
        label: `至 ${y40()}`,
        note: "游戏世界合同，当前赛季结束后可重新接触。",
      };
    return state.driverContracts[name];
  }
  window.contractInfoV40 = ci40;
  function driverRank40(name = selected?.[0]) {
    const arr = Object.entries(state.driverStandings || {}).sort(
      (a, b) => b[1] - a[1],
    );
    const i = arr.findIndex((x) => x[0] === name);
    return i < 0
      ? Math.max(1, typeof driverRankV10 === "function" ? driverRankV10() : 12)
      : i + 1;
  }
  function updateSpecialClausesV40() {
    ensureContractsV40(false);
    const y = y40();
    if (y === 2026 && state.round >= 10 && state.round <= 13) {
      if (
        selected?.[0] === "Max Verstappen" &&
        driverRank40("Max Verstappen") > 2
      )
        state.maxClauseActivatedV40 = true;
      if (
        state.driverStandings?.["Max Verstappen"] != null &&
        driverRank40("Max Verstappen") > 2
      )
        state.aiClauseActivatedV40["Max Verstappen"] = true;
    }
  }
  function specialOpen40(name) {
    if (name !== "Max Verstappen" || y40() !== 2026) return false;
    if (name === selected?.[0]) return !!state.maxClauseActivatedV40;
    return !!state.aiClauseActivatedV40?.[name];
  }
  function needsNewDeal40(name = selected?.[0], year = y40()) {
    const c = ci40(name);
    return !!(
      c.rolling ||
      Number(c.end || year) <= year ||
      specialOpen40(name)
    );
  }
  function contractWindowOpenV40() {
    if (!selected) return false;
    ensureContractsV40(false);
    updateSpecialClausesV40();
    return (
      state.round >= 12 &&
      state.round <= calendar.length &&
      !(typeof seasonCompleteV14 === "function" && seasonCompleteV14()) &&
      needsNewDeal40(selected[0], y40()) &&
      !state.contract.nextTeam
    );
  }
  window.contractWindowOpenV40 = contractWindowOpenV40;
  function teamOrder40() {
    const names = Object.keys(teams);
    const pts = state.teamStandings || {};
    const any = names.some((t) => Number(pts[t] || 0) > 0);
    return names.sort((a, b) =>
      any
        ? (pts[b] || 0) - (pts[a] || 0) ||
          (teams[b]?.ovr || 0) - (teams[a]?.ovr || 0)
        : (teams[b]?.ovr || 0) - (teams[a]?.ovr || 0),
    );
  }
  function teamRank40(team) {
    return Math.max(1, teamOrder40().indexOf(team) + 1);
  }
  function flexDriver40(name, year = y40()) {
    const c = ci40(name);
    return !!(
      c.rolling ||
      Number(c.end || year) <= year ||
      specialOpen40(name)
    );
  }
  function flexibleSeats40(team, year = y40()) {
    const roster = drivers.filter((d) => d[1] === team);
    const flex = roster.filter((d) =>
      d[0] === selected?.[0]
        ? needsNewDeal40(d[0], year)
        : flexDriver40(d[0], year),
    );
    return { roster, flex, count: flex.length };
  }
  function recentScore40() {
    const xs = (state.history || []).slice(-6);
    if (!xs.length) return 50;
    return Math.round(
      xs.reduce((sum, h) => {
        if (h.dns) return sum + 8;
        if (h.dnf) return sum + 14;
        const p = Number(h.finish || 22),
          pts = Number(h.points || 0);
        let s =
          p === 1
            ? 100
            : p <= 3
              ? 90
              : p <= 6
                ? 78
                : p <= 10
                  ? 65
                  : p <= 14
                    ? 49
                    : p <= 18
                      ? 36
                      : 28;
        s += Math.min(8, pts * 0.25);
        return sum + Math.min(100, s);
      }, 0) / xs.length,
    );
  }
  function competitiveScore40() {
    const pts = Number(state.driverStandings?.[selected[0]] || 0),
      leader = Math.max(
        1,
        ...Object.values(state.driverStandings || {}).map(Number),
      );
    return Math.round(clamp40(12 + 88 * (pts / leader)));
  }
  function commercialData40() {
    const p = driverProfiles?.[selected[0]] || {
        titles: 0,
        wins: 0,
        debut: y40(),
      },
      a = state.achievementsV3?.career || {};
    const titles = Number(p.titles || 0) + Number(a.wdc || 0),
      wins = Number(p.wins || 0) + Number(a.wins || 0),
      years = Math.max(0, y40() - Number(p.debut || y40()));
    const score = Math.round(
      clamp40(
        22 +
          titles * 9 +
          Math.min(34, wins * 0.48) +
          Math.min(16, years * 0.85),
      ),
    );
    return { score, titles, wins, years };
  }
  function playerArchetype40() {
    const p = driverProfiles?.[selected[0]] || {},
      comp = competitiveScore40(),
      com = commercialData40(),
      rookie = y40() - Number(p.debut || y40()) <= 2;
    if (rookie && com.titles === 0 && selected[2] < 91) return "新秀潜力";
    if (com.titles > 0 || comp >= 88 || selected[2] >= 92) return "争冠核心";
    if (selected[2] >= 86 && Number(selected[4] || 0) >= 86) return "长期核心";
    return "稳定主力";
  }
  function teamNeedRole40(team) {
    const tr = teamRank40(team),
      roster = drivers.filter((d) => d[1] === team && d[0] !== selected?.[0]),
      star = roster.some(
        (d) =>
          Number(d[2] || 0) >= 91 || (driverProfiles?.[d[0]]?.titles || 0) > 0,
      );
    if (tr <= 4) return star ? "稳定二号" : "争冠核心";
    if (tr <= 7) return "长期核心";
    return "稳定主力";
  }
  function fitScore40(team) {
    const want = teamNeedRole40(team),
      have = playerArchetype40();
    const map = {
      争冠核心: { 争冠核心: 98, 长期核心: 82, 稳定主力: 66, 新秀潜力: 58 },
      稳定二号: { 争冠核心: 72, 长期核心: 86, 稳定主力: 95, 新秀潜力: 70 },
      长期核心: { 争冠核心: 84, 长期核心: 96, 稳定主力: 82, 新秀潜力: 90 },
      稳定主力: { 争冠核心: 78, 长期核心: 88, 稳定主力: 96, 新秀潜力: 76 },
    };
    return { score: map[want]?.[have] || 70, want, have };
  }
  function needScore40(team, kind) {
    const seats = flexibleSeats40(team),
      tr = teamRank40(team);
    let score = seats.count >= 2 ? 100 : seats.count === 1 ? 88 : 24;
    if (kind === "renew") score = Math.max(score, 86);
    if (tr <= 4 && teamNeedRole40(team) === "争冠核心") score += 3;
    return Math.round(clamp40(score));
  }
  const DRIVER_BIRTH_YEAR_V40 = {
    "Max Verstappen": 1997,
    "Isack Hadjar": 2004,
    "Lewis Hamilton": 1985,
    "Charles Leclerc": 1997,
    "Lando Norris": 1999,
    "Oscar Piastri": 2001,
    "George Russell": 1998,
    "Kimi Antonelli": 2006,
    "Fernando Alonso": 1981,
    "Lance Stroll": 1998,
    "Carlos Sainz": 1994,
    "Alexander Albon": 1996,
    "Pierre Gasly": 1996,
    "Franco Colapinto": 2003,
    "Esteban Ocon": 1996,
    "Oliver Bearman": 2005,
    "Liam Lawson": 2002,
    "Arvid Lindblad": 2007,
    "Nico Hulkenberg": 1987,
    "Gabriel Bortoleto": 2004,
    "Sergio Perez": 1990,
    "Valtteri Bottas": 1989,
  };
  function driverAge40(name = selected?.[0], year = y40()) {
    const by = Number(DRIVER_BIRTH_YEAR_V40[name] || year - 27);
    return Math.max(18, Number(year) - by);
  }
  function ageMarket40(
    name = selected?.[0],
    team = selected?.[1],
    kind = "team",
  ) {
    const age = driverAge40(name),
      want = team ? teamNeedRole40(team) : "稳定主力";
    let penalty =
      age <= 31
        ? 0
        : age <= 33
          ? 2
          : age <= 35
            ? 5
            : age <= 37
              ? 9
              : age <= 39
                ? 13
                : age <= 41
                  ? 18
                  : age <= 43
                    ? 23
                    : 28;
    if (kind === "renew") penalty = Math.max(0, penalty - 2);
    if (want === "稳定主力" || want === "稳定二号")
      penalty = Math.max(0, penalty - 2);
    if (want === "长期核心") penalty += 3;
    if (team && teamRank40(team) <= 4 && age >= 36) penalty += 2;
    return { age, penalty: Math.max(0, Math.round(penalty)) };
  }
  window.driverAgeV40 = driverAge40;
  window.ageMarketV40 = ageMarket40;
  function evaluation40(team, kind = "team") {
    const comp = competitiveScore40(),
      recent = recentScore40(),
      com = commercialData40(),
      need = needScore40(team, kind),
      fit = fitScore40(team),
      pts = Number(state.driverStandings?.[selected[0]] || 0),
      agePlan = ageMarket40(selected[0], team, kind);
    let overall =
      comp * 0.32 +
      recent * 0.22 +
      com.score * 0.18 +
      need * 0.16 +
      fit.score * 0.12 -
      agePlan.penalty;
    const tr = teamRank40(team);
    if (kind !== "renew" && tr <= 4 && comp < 62) overall -= 8;
    if (kind !== "renew" && need < 40) overall -= 18;
    if (kind === "renew") overall += 4;
    if (
      selected[0] === "Lance Stroll" &&
      kind === "renew" &&
      team === "Aston Martin"
    )
      overall += 12;
    overall = Math.round(clamp40(overall, 10, 98));
    let chance = clamp40((overall - 28) * 1.25, 12, 94) / 100;
    if (need < 40 && kind !== "renew") chance = Math.min(chance, 0.28);
    // Lance Stroll -> Aston Martin renewal easter egg: Dad always says yes.
    if (
      selected[0] === "Lance Stroll" &&
      kind === "renew" &&
      team === "Aston Martin"
    )
      chance = 1;
    return {
      competitive: comp,
      recent,
      commercial: com.score,
      commercialData: com,
      need,
      fit: fit.score,
      want: fit.want,
      have: fit.have,
      overall,
      chance,
      pts,
      age: agePlan.age,
      agePenalty: agePlan.penalty,
    };
  }
  function labelOverall40(v) {
    return v >= 85
      ? "极高"
      : v >= 75
        ? "很高"
        : v >= 64
          ? "较高"
          : v >= 52
            ? "观察中"
            : "偏低";
  }
  function offerTerm40(team, kind, ev) {
    const y = y40();
    if (
      selected[0] === "Max Verstappen" &&
      team === "Red Bull Racing" &&
      specialOpen40(selected[0])
    )
      return {
        start: y + 1,
        end: 2028,
        years: Math.max(1, 2028 - y),
        label: "继续履行至 2028",
      };
    let years = ev.overall >= 82 ? 2 : 1;
    if (teamRank40(team) >= 5 && ev.overall >= 72) years = 2;
    if (kind === "renew" && ev.overall >= 76) years = 2;
    if ((ev.age || driverAge40(selected[0])) >= 35) years = 1;
    return {
      start: y + 1,
      end: y + years,
      years,
      label: `${years} 年 · 至 ${y + years}`,
    };
  }
  function weightedPick40(pool, kind, avoid = []) {
    let xs = pool
      .filter((t) => t && t !== selected[1] && !avoid.includes(t))
      .map((team) => ({ team, ev: evaluation40(team, kind) }))
      .filter((x) => x.ev.need >= 45);
    if (!xs.length)
      xs = pool
        .filter((t) => t && t !== selected[1] && !avoid.includes(t))
        .map((team) => ({ team, ev: evaluation40(team, kind) }))
        .sort((a, b) => b.ev.need - a.ev.need)
        .slice(0, 2);
    if (!xs.length) return null;
    const weights = xs.map((x) =>
        Math.max(1, (x.ev.overall - 25) * (x.ev.need / 100)),
      ),
      sum = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * sum;
    for (let i = 0; i < xs.length; i++) {
      r -= weights[i];
      if (r <= 0) return xs[i].team;
    }
    return xs[xs.length - 1].team;
  }
  function generateOffersV40(force = false) {
    ensureContractsV40(false);
    updateSpecialClausesV40();
    if (!contractWindowOpenV40()) {
      state.marketOffersV40 = [];
      state.marketOffersV17 = [];
      return [];
    }
    if (
      !force &&
      state.marketOffersV40.length &&
      state.marketOfferRoundV40 === state.round
    )
      return state.marketOffersV40;
    const order = teamOrder40(),
      bigPool = order.slice(0, Math.min(4, order.length)),
      smallPool = order.slice(Math.min(4, order.length));
    const big = weightedPick40(bigPool, "team"),
      small = weightedPick40(smallPool, "team", big ? [big] : []),
      current = selected[1];
    const raw = [
      { team: current, kind: "renew", type: "renew", title: "续约" },
      { team: big, kind: "team", type: "big", title: "强队接触" },
      { team: small, kind: "team", type: "small", title: "稳定席位" },
    ];
    state.marketOffersV40 = raw.map((o) => {
      if (!o.team) return { ...o, empty: true };
      const ev = evaluation40(o.team, o.kind),
        term = offerTerm40(o.team, o.kind, ev);
      return { ...o, ev, chance: ev.chance, term };
    });
    state.marketOfferRoundV40 = state.round;
    state.marketOffersV17 = state.marketOffersV40;
    state.marketOfferRoundV17 = state.round;
    return state.marketOffersV40;
  }
  window.generateOffersV40 = generateOffersV40;
  function evalRows40(o) {
    const e = o.ev;
    const rows = [
      ["竞技评价", e.competitive, `${e.pts}分`],
      ["近期状态", e.recent, `${e.recent}/100`],
      [
        "商业价值",
        e.commercial,
        `${e.commercialData.titles}冠 ${e.commercialData.wins}胜`,
      ],
      ["阵容需求", e.need, `${e.need}/100`],
      ["适配度", e.fit, `${e.fit}/100`],
    ];
    return rows
      .map(
        (r) =>
          `<div class="contractEvalRowV40"><span>${r[0]}</span><div class="contractEvalBarV40"><i style="width:${r[1]}%"></i></div><b>${r[2]}</b></div>`,
      )
      .join("");
  }
  function offerCard40(o, signed, used) {
    if (o.empty)
      return `<div class="contractOfferV40 empty"><div class="kicker">${o.title}</div><h3>暂无开放席位</h3><p class="offerSubV40">本周没有符合合同窗口条件的车队席位。</p></div>`;
    const e = o.ev,
      disabled = signed || used,
      isStrollDad =
        selected?.[0] === "Lance Stroll" &&
        o.kind === "renew" &&
        o.team === "Aston Martin";
    const dadBlock = isStrollDad
      ? `<div class="strollDadV40">Daaaad！</div><div class="strollYearsV40"><span>这次想续几年？自己填。</span><input id="strollContractYearsV40" type="number" min="1" max="20" step="1" value="3" ${disabled ? "disabled" : ""}></div>`
      : "";
    const termText = isStrollDad
      ? "合同年限由你决定"
      : `${o.term.start}–${o.term.end} · ${o.term.years} 年${o.kind === "renew" ? "续约" : "合同"}`;
    const action = isStrollDad
      ? `openStrollRenewalV40('${String(o.team).replace(/'/g, "\\'")}','${o.kind}')`
      : `openContractConfirmV40('${String(o.team).replace(/'/g, "\\'")}','${o.kind}')`;
    return `<div class="contractOfferV40 ${o.type}"><div class="kicker">${o.title}</div><h3>${o.team}</h3><div class="offerSubV40">${o.kind === "renew" ? "当前车队继续合作" : "当前车队级别 P" + teamRank40(o.team)} · ${isStrollDad ? "家庭特别条款" : o.term.label}</div><div class="contractRoleV40"><span>车队需求 <b>${e.want}</b></span><span>你的画像 <b>${e.have}</b></span></div><div class="contractEvalV40">${evalRows40(o)}</div><div class="contractOverallV40"><div><span>综合意向</span><strong>${e.overall}</strong> <em>${labelOverall40(e.overall)}</em></div><div style="text-align:right"><span>接触成功率</span><b>${Math.round(o.chance * 100)}%</b></div></div>${dadBlock}<div class="contractTermV40">若达成：${termText}${e.agePenalty ? ` · 年龄 ${e.age} · 长期规划 -${e.agePenalty}` : ` · 年龄 ${e.age}`}</div><button class="mini" ${disabled ? "disabled" : ""} onclick="${action}">${signed === o.team ? "已达成" : used ? "本周已接触" : o.kind === "renew" ? "接触续约" : "进行接触"}</button></div>`;
  }
  function currentContractLabel40() {
    const c = ci40(selected[0]);
    return c.label || `至 ${c.end}`;
  }
  function renderContractsV40() {
    if (!selected) return;
    ensureContractsV40(false);
    updateSpecialClausesV40();
    const y = y40(),
      open = contractWindowOpenV40(),
      signed = state.contract.nextTeam,
      used = state.contractAttemptRoundV40 === state.round,
      c = ci40(selected[0]),
      rank = driverRank40(),
      expires = Number(c.end || y) <= y || c.rolling,
      special = specialOpen40(selected[0]);
    const mh = document.querySelector("#contracts .modulehead .kicker"),
      mt = document.querySelector("#contracts .modulehead h1");
    if (mh) mh.textContent = "DRIVER CONTRACTS · BETA";
    if (mt) mt.textContent = `车手签约 · ${y + 1}`;
    const maxTeamExit =
      selected?.[0] === "Max Verstappen" &&
      y === 2026 &&
      !!state.maxClauseTeamExitV40;
    let stateText = signed
      ? `已确定 ${signed}`
      : maxTeamExit
        ? "Red Bull 已执行双向跳出"
        : open
          ? "接触窗口开放"
          : expires &&
              typeof seasonCompleteV14 === "function" &&
              seasonCompleteV14()
            ? "窗口已结束 · 未签约"
            : `现有合同有效`;
    const clause = special
      ? `<div class="contractClauseV40"><b>Max 特殊条款已触发：</b>2026 R10–R13 期间积分排名曾跌出 P2，Red Bull 与 Max 双方均拥有提前结束合同的权利。夏休期起至赛季结束前，Max 可以主动转会；Red Bull 也可以拒绝继续履行至 2028。若赛季结束前双方仍未重新确认，Red Bull 会独立作出最终决定。${maxTeamExit ? " <b>Red Bull 已执行跳出权，原 2028 合同将在 2026 年底终止。</b>" : ""}</div>`
      : "";
    const head = `<div class="contractHubV40"><div class="contractSummaryV40"><div class="kicker">CURRENT CONTRACT</div><h2>${selected[0]} · ${selected[1]}</h2><p>${currentContractLabel40()} · 当前车手积分排名 P${rank}</p><span class="contractWindowV40 ${signed ? "signed" : special ? "clause" : open ? "open" : ""}">${stateText}</span>${clause}<div class="contractMetaV40"><div><span>合同状态</span><b>${currentContractLabel40()}</b></div><div><span>接触窗口</span><b>${needsNewDeal40() ? `夏休期–赛季结束前` : `合同末年开放`}</b></div><div><span>${y + 1} 去向</span><b>${signed || (!expires && !special ? selected[1] : "未确定")}</b></div></div></div><div class="contractRuleBoxV40"><div class="kicker">MARKET RULE</div><p>只有合同进入最后一个赛季、滚动确认年或特殊解约条款被触发时，夏休期开始后开放接触，并持续到赛季结束前。每站固定出现：<b>当前车队续约 + 一支强队 + 一支中后游车队</b>。每站只能尝试一次，下一站会重新生成接触对象。</p></div></div>`;
    let body = "";
    if (signed) {
      body = `<div class="contractClosedV40">${y + 1} 已确定加盟 / 留队 <b>${signed}</b>。合同至 <b>${state.contract.nextEnd || y + 1}</b>，本赛季不再开启其他接触。</div>`;
    } else if (open) {
      const offers = generateOffersV40();
      body = `${used ? '<div class="contractRoundLockV17">本周接触机会已经使用。完成本站后，下一站会刷新三项选择。</div>' : ""}<div class="contractOfferGridV40">${offers.map((o) => offerCard40(o, signed, used)).join("")}</div>`;
    } else if (!needsNewDeal40()) {
      body = `<div class="contractClosedV40">当前合同尚未进入最后一年。<br><b>${currentContractLabel40()}</b><br>签约系统不会提前打开；等合同末年的夏休期再开始接触，并持续到赛季结束前。</div>`;
    } else if (state.round < 12) {
      body = `<div class="contractClosedV40">合同将在本赛季结束后到期 / 重新确认。<br>匈牙利站后的夏休期结束后，合同市场从荷兰站开始持续开放到赛季结束前，目前还剩 <b>${12 - state.round}</b> 站进入市场。</div>`;
    } else if (special && Number(c.end || 0) > y) {
      body = `<div class="contractClosedV40">本赛季合同市场已经关闭。你没有使用已触发的提前解约条款，现有 <b>${selected[1]}</b> 合同仍继续有效至 <b>${c.end}</b>。</div>`;
    } else {
      body = `<div class="contractClosedV40">本赛季合同市场已经关闭，而你还没有确定 ${y + 1} 席位。</div>`;
    }
    const hist = (state.contract.history || []).slice(0, 8);
    document.getElementById("contractContent").innerHTML =
      head +
      body +
      `<div class="card contractLogV40"><div class="relationhead"><div><h2 class="sectiontitle" style="margin-bottom:3px">合同记录</h2><div class="small">只记录这份存档中的接触与签约。</div></div><div class="small">LOG</div></div>${hist.length ? hist.map((x) => `<div class="row">${x}</div>`).join("") : '<div class="row">暂无合同记录。</div>'}</div>`;
  }
  window.renderContractsV40 = renderContractsV40;
  window.renderContractsV10 = renderContractsV40;
  try {
    renderContractsV10 = renderContractsV40;
  } catch (_) {}
  function normalizedCustomYearsV40(v) {
    const n = Math.round(Number(v));
    return Number.isFinite(n) ? Math.max(1, Math.min(20, n)) : 3;
  }
  function customTermV40(o, customYears) {
    if (
      !(
        selected?.[0] === "Lance Stroll" &&
        o?.kind === "renew" &&
        o?.team === "Aston Martin"
      )
    )
      return o?.term;
    const years = normalizedCustomYearsV40(customYears),
      start = y40() + 1;
    return {
      start,
      end: start + years - 1,
      years,
      label: `家庭特别合同 · ${years} 年 · 至 ${start + years - 1}`,
    };
  }
  function openStrollRenewalV40(team = "Aston Martin", kind = "renew") {
    const input = document.getElementById("strollContractYearsV40"),
      years = normalizedCustomYearsV40(input?.value);
    if (input) input.value = years;
    openContractConfirmV40(team, kind, years);
  }
  window.openStrollRenewalV40 = openStrollRenewalV40;
  function openContractConfirmV40(team, kind, customYears = null) {
    ensureContractsV40(false);
    if (!contractWindowOpenV40() || state.contract.nextTeam) return;
    if (state.contractAttemptRoundV40 === state.round) {
      showToastV14?.("本周已经进行过一次合同接触");
      return;
    }
    const o = generateOffersV40().find(
      (x) => x.team === team && x.kind === kind,
    );
    if (!o) return;
    const e = o.ev,
      isDad =
        selected?.[0] === "Lance Stroll" &&
        kind === "renew" &&
        team === "Aston Martin",
      term = isDad ? customTermV40(o, customYears) : o.term,
      yearsArg = isDad ? term.years : null;
    document.getElementById("modalTitle").textContent =
      "CONTRACT CONTACT · BETA";
    document.getElementById("modalBody").innerHTML =
      `<div class="contractConfirmV17"><div class="kicker">${kind === "renew" ? "RENEWAL CONTACT" : "TEAM CONTACT"}</div><h2>${team}</h2>${isDad ? '<div class="strollDadV40">Daaaad！</div>' : ""}<p>车队会根据五项判断综合决定是否推进合同。${isDad ? "你已经亲自决定了续约年限。" : "这里不是无条件报价：接触成功后才会锁定 " + term.start + "–" + term.end + " 的席位。"}</p><div class="contractRoleV40"><span>车队需求 <b>${e.want}</b></span><span>你的画像 <b>${e.have}</b></span></div><div class="contractEvalV40">${evalRows40(o)}</div><div class="contractConfirmMeta"><div><span>综合意向</span><b>${e.overall} · ${labelOverall40(e.overall)}</b></div><div><span>成功概率</span><b>${Math.round(o.chance * 100)}%</b></div></div><div class="contractTermV40">拟定合同：${term.label}</div><div class="contractConfirmActions"><button class="btn" onclick="closeOverlay()">取消</button><button class="btn primary" onclick="confirmContractAttemptV40('${String(team).replace(/'/g, "\\'")}','${kind}'${isDad ? "," + yearsArg : ""})">确认接触</button></div></div>`;
    document.getElementById("overlay").classList.add("open");
  }
  function signOffer40(o, auto = false, customYears = null) {
    const y = y40(),
      term = customTermV40(o, customYears) || o.term;
    state.contract.nextTeam = o.team;
    state.contract.signedRound = state.round;
    state.contract.nextEnd = term.end;
    state.contract.nextRole = o.ev.want;
    state.pendingPlayerDealV40 = {
      team: o.team,
      start: term.start || y + 1,
      end: term.end,
      years: term.years,
      role: o.ev.want,
      kind: o.kind,
    };
    state.contract.history.unshift(
      `R${String(state.round).padStart(2, "0")} · ${o.kind === "renew" ? "续约" : "签约"}成功 · ${o.team} · 至 ${term.end}${selected?.[0] === "Lance Stroll" && o.kind === "renew" && o.team === "Aston Martin" ? ` · Daaaad！${term.years}年` : ""}${auto ? " · 自动" : ""}`,
    );
    showToastV14?.(`${o.team} · 合同达成至 ${term.end}`);
  }
  function confirmContractAttemptV40(team, kind, customYears = null) {
    ensureContractsV40(false);
    if (
      state.contractAttemptRoundV40 === state.round ||
      state.contract.nextTeam
    ) {
      closeOverlay();
      return;
    }
    const o = generateOffersV40().find(
      (x) => x.team === team && x.kind === kind,
    );
    if (!o) {
      closeOverlay();
      return;
    }
    const isDad =
        selected?.[0] === "Lance Stroll" &&
        team === "Aston Martin" &&
        kind === "renew",
      years = isDad ? normalizedCustomYearsV40(customYears) : null;
    state.contractAttemptRoundV40 = state.round;
    state.contractAttemptRoundV17 = state.round;
    const ok = Math.random() < o.chance;
    if (ok) signOffer40(o, false, years);
    else {
      if (
        selected[0] === "Max Verstappen" &&
        team === "Red Bull Racing" &&
        kind === "renew" &&
        specialOpen40(selected[0])
      ) {
        const mc = ci40(selected[0]);
        mc.end = y40();
        mc.label = `至 ${y40()} · 双向条款终止`;
        state.maxClauseTeamExitV40 = true;
        state.maxClauseDecisionResolvedV40 = true;
        state.contract.history.unshift(
          `R${String(state.round).padStart(2, "0")} · Red Bull 未继续合同 · 双向解约条款执行`,
        );
        showToastV14?.("Red Bull 执行双向解约条款 · 2027 席位未定");
      } else {
        state.contract.history.unshift(
          `R${String(state.round).padStart(2, "0")} · 接触未达成 · ${team} · 综合 ${o.ev.overall}`,
        );
        showToastV14?.(`${team} 暂未推进合同 · 下一站可重新接触`);
      }
    }
    closeOverlay();
    renderContractsV40();
    renderHub();
    autosave();
  }
  window.openContractConfirmV40 = openContractConfirmV40;
  window.confirmContractAttemptV40 = confirmContractAttemptV40;
  window.openContractConfirmV23 = openContractConfirmV40;
  window.confirmContractAttemptV23 = confirmContractAttemptV40;
  window.openContractConfirmV17 = openContractConfirmV40;
  window.confirmContractAttemptV17 = confirmContractAttemptV40;
  try {
    openContractConfirmV23 = openContractConfirmV40;
    confirmContractAttemptV23 = confirmContractAttemptV40;
    openContractConfirmV17 = openContractConfirmV40;
    confirmContractAttemptV17 = confirmContractAttemptV40;
  } catch (_) {}
  function autoContactV40(forceLast = false) {
    if (
      !contractWindowOpenV40() ||
      state.contract.nextTeam ||
      state.contractAttemptRoundV40 === state.round
    )
      return;
    const os = generateOffersV40()
      .filter((o) => o.team && !o.empty)
      .sort((a, b) => b.chance - a.chance);
    if (!os.length) return;
    const o = os[0];
    state.contractAttemptRoundV40 = state.round;
    state.contractAttemptRoundV17 = state.round;
    if (forceLast || Math.random() < o.chance) signOffer40(o, true);
    else
      state.contract.history.unshift(
        `R${String(state.round).padStart(2, "0")} · 自动接触未达成 · ${o.team}`,
      );
  }
  function aiMarketScore40(d) {
    const p = driverProfiles?.[d[0]] || {},
      pts = Number(state.driverStandings?.[d[0]] || 0),
      wins = Number(state.driverSeasonStats?.[d[0]]?.wins || 0),
      agePlan = ageMarket40(d[0], d[1], "team");
    return (
      Number(d[2] || 80) +
      pts * 0.12 +
      wins * 3 +
      (p.titles || 0) * 8 +
      (p.wins || 0) * 0.18 -
      agePlan.penalty * 1.45
    );
  }
  function aiAssignContractsV40() {
    ensureContractsV40(false);
    updateSpecialClausesV40();
    const y = y40(),
      player = selected[0],
      target = state.contract.nextTeam || selected[1],
      names = Object.keys(teams),
      seats = {};
    names.forEach((t) => (seats[t] = 2));
    if (seats[target] != null) seats[target]--;
    const ai = drivers.filter((d) => d[0] !== player),
      free = [],
      locked = [];
    ai.forEach((d) => (flexDriver40(d[0], y) ? free : locked).push(d));
    locked.forEach((d) => {
      if (seats[d[1]] > 0) seats[d[1]]--;
      else free.push(d);
    });
    const uniqueFree = [...new Map(free.map((d) => [d[0], d])).values()].sort(
      (a, b) => aiMarketScore40(b) - aiMarketScore40(a),
    );
    const order = teamOrder40();
    uniqueFree.forEach((d) => {
      const avail = order.filter((t) => (seats[t] || 0) > 0);
      if (!avail.length) return;
      let best = avail[0],
        bestW = -1e9;
      avail.forEach((t) => {
        const tr = order.indexOf(t) + 1,
          old = d[1] === t ? 18 : 0,
          score = aiMarketScore40(d),
          level = score >= 125 ? 2 : score >= 108 ? 4 : score >= 94 ? 7 : 10;
        let w = 70 - Math.abs(tr - level) * 5 + old + Math.random() * 12;
        if (w > bestW) {
          bestW = w;
          best = t;
        }
      });
      const oldTeam = d[1];
      d[1] = best;
      seats[best]--;
      const c = ci40(d[0]),
        age = driverAge40(d[0], y),
        years =
          age >= 35
            ? 1
            : aiMarketScore40(d) >= 108
              ? 2
              : Math.random() < 0.62
                ? 2
                : 1;
      c.end = y + years;
      c.label = `至 ${c.end}`;
      c.option = false;
      c.rolling = false;
      c.clause = false;
      c.special = null;
      c.note = "4.0 游戏世界合同";
      state.contractHistory = state.contractHistory || [];
      state.contractHistory.unshift(
        `${d[0]} ${oldTeam === best ? "续约" : "转投 " + best} · 合同至 ${c.end}`,
      );
    });
    state.contractHistory = (state.contractHistory || []).slice(0, 30);
  }
  window.aiAssignContractsV40 = aiAssignContractsV40;
  window.aiAssignContractsV15 = aiAssignContractsV40;
  try {
    aiAssignContractsV15 = aiAssignContractsV40;
  } catch (_) {}
  function hasCurrentSeatNextYear40() {
    const c = ci40(selected[0]),
      next = y40() + 1;
    return Number(c.end || 0) >= next && !c.rolling;
  }
  function resolveMaxBilateralClauseV40() {
    ensureContractsV40(false);
    updateSpecialClausesV40();
    if (
      y40() !== 2026 ||
      selected?.[0] !== "Max Verstappen" ||
      !state.maxClauseActivatedV40 ||
      state.contract?.nextTeam
    )
      return null;
    const c = ci40("Max Verstappen");
    if (state.maxClauseTeamExitV40 || Number(c.end || 0) <= 2026) {
      state.maxClauseTeamExitV40 = true;
      state.maxClauseDecisionResolvedV40 = true;
      return "exit";
    }
    if (state.maxClauseDecisionResolvedV40) return "resolved";
    const ev = evaluation40("Red Bull Racing", "renew"),
      rank = driverRank40("Max Verstappen");
    let keepChance =
      Number(ev?.chance || 0.72) +
      (rank <= 2
        ? 0.06
        : rank === 3
          ? 0
          : rank === 4
            ? -0.06
            : rank <= 6
              ? -0.12
              : -0.18);
    keepChance = clamp40(keepChance, 0.18, 0.96);
    state.maxClauseRedBullKeepChanceV40 = keepChance;
    state.maxClauseDecisionResolvedV40 = true;
    if (Math.random() < keepChance) {
      state.maxClauseTeamExitV40 = false;
      c.end = 2028;
      c.label = "至 2028 · 双向条款未执行";
      c.note =
        "2026 双向跳出条款曾触发，但 Red Bull 最终选择继续履行原合同至 2028。";
      state.contract.history.unshift(
        `赛季末 · Red Bull 未执行双向跳出 · 原合同继续至 2028 · 留队概率 ${Math.round(keepChance * 100)}%`,
      );
      try {
        autosave?.();
      } catch (_) {}
      return "stay";
    }
    state.maxClauseTeamExitV40 = true;
    c.end = 2026;
    c.label = "至 2026 · Red Bull 执行双向跳出";
    c.note =
      "2026 双向跳出条款触发后，Red Bull 在赛季末选择终止原本至 2028 的合同。";
    state.contract.history.unshift(
      `赛季末 · Red Bull 执行双向跳出 · 原 2028 合同终止 · 留队概率 ${Math.round(keepChance * 100)}%`,
    );
    try {
      autosave?.();
    } catch (_) {}
    return "exit";
  }
  window.resolveMaxBilateralClauseV40 = resolveMaxBilateralClauseV40;
  const renderHubPrev40 = renderHub;
  renderHub = function () {
    const r = renderHubPrev40.apply(this, arguments);
    if (!selected) return r;
    ensureContractsV40(false);
    updateSpecialClausesV40();
    const card = document.querySelector(
        '#career .modules .module[onclick*="contracts"]',
      ),
      st = document.getElementById("contractStatus"),
      open = contractWindowOpenV40(),
      c = ci40(selected[0]),
      expires = Number(c.end || y40()) <= y40() || c.rolling,
      special = specialOpen40(selected[0]);
    if (card) {
      card.classList.remove("contractAlertV34", "contractContactV40");
      if (open) card.classList.add("contractContactV40");
      else if (
        expires &&
        typeof seasonCompleteV14 === "function" &&
        seasonCompleteV14() &&
        !state.contract.nextTeam
      )
        card.classList.add("contractAlertV34");
    }
    if (st) {
      if (state.contract.nextTeam)
        st.textContent = `已签 ${state.contract.nextTeam} · 至${state.contract.nextEnd || y40() + 1}`;
      else if (
        state.maxClauseTeamExitV40 &&
        selected?.[0] === "Max Verstappen" &&
        y40() === 2026
      )
        st.textContent = open
          ? "Red Bull 已跳出 · 可接触"
          : "Red Bull 已执行跳出";
      else if (open)
        st.textContent =
          state.contractAttemptRoundV40 === state.round
            ? "本周已接触"
            : "夏休期–赛季结束 · 可接触";
      else if (
        expires &&
        typeof seasonCompleteV14 === "function" &&
        seasonCompleteV14()
      )
        st.textContent = "未签约 · 窗口已结束";
      else if (
        special &&
        Number(c.end || 0) > y40() &&
        typeof seasonCompleteV14 === "function" &&
        seasonCompleteV14()
      )
        st.textContent = `特殊窗口结束 · 合同至 ${c.end}`;
      else if (needsNewDeal40())
        st.textContent = state.round < 12 ? "夏休期开启接触" : "合同待确认";
      else st.textContent = `合同至 ${c.end || "长期"}`;
    }
    return r;
  };
  window.renderHub = renderHub;
  const startCareerPrev40 = startCareer;
  startCareer = function () {
    const r = startCareerPrev40.apply(this, arguments);
    if (selected) {
      state.contractSystemV40Initialized = false;
      ensureContractsV40(true);
      state.marketOffersV40 = [];
      state.marketOfferRoundV40 = 0;
      state.contractAttemptRoundV40 = 0;
      state.maxClauseActivatedV40 = false;
      state.maxClauseDecisionResolvedV40 = false;
      state.maxClauseTeamExitV40 = false;
      state.maxClauseRedBullKeepChanceV40 = null;
      state.aiClauseActivatedV40 = {};
      state.pendingPlayerDealV40 = null;
      state.playerDealV40 = null;
      state.contract = { nextTeam: null, signedRound: null, history: [] };
      renderHub();
      autosave();
    }
    return r;
  };
  window.startCareer = startCareer;
  const advancePrev40 = advanceRound;
  advanceRound = function () {
    const before = state?.round,
      r = advancePrev40.apply(this, arguments);
    if (selected && state?.round !== before) {
      ensureContractsV40(false);
      updateSpecialClausesV40();
      state.marketOffersV40 = [];
      state.marketOfferRoundV40 = 0;
      state.marketOffersV17 = [];
      state.marketOfferRoundV17 = 0;
      if (state.fullSeasonSimulatingV18 && contractWindowOpenV40())
        autoContactV40(state.round === calendar.length);
      try {
        renderHub();
        autosave();
      } catch (_) {}
    }
    return r;
  };
  window.advanceRound = advanceRound;
  const startNextPrev40 = startNextSeasonV11;
  startNextSeasonV11 = function () {
    ensureContractsV40(false);
    if (
      y40() === 2026 &&
      selected?.[0] === "Max Verstappen" &&
      state.maxClauseActivatedV40 &&
      !state.contract?.nextTeam
    )
      resolveMaxBilateralClauseV40();
    const oldY = y40(),
      pending = state.pendingPlayerDealV40
        ? copyV40(state.pendingPlayerDealV40)
        : null,
      c = ci40(selected[0]),
      carryInfo = {
        end: Number(ci40(selected[0]).end || 0),
        label: ci40(selected[0]).label,
        note: ci40(selected[0]).note,
      };
    let carry = false;
    if (!state.contract.nextTeam && carryInfo.end >= oldY + 1) {
      state.contract.nextTeam = selected[1];
      state.contract.nextEnd = carryInfo.end;
      state.contract.v40Carry = true;
      carry = true;
    }
    const r = startNextPrev40.apply(this, arguments);
    if (selected && y40() > oldY) {
      ensureContractsV40(false);
      const pc = ci40(selected[0]);
      if (pending) {
        pc.end = pending.end;
        pc.label = `至 ${pending.end}`;
        pc.option = false;
        pc.rolling = false;
        pc.clause = false;
        pc.special = null;
        pc.note = "4.0 游戏世界合同";
        state.playerDealV40 = pending;
        state.pendingPlayerDealV40 = null;
      } else if (carry) {
        pc.end = carryInfo.end;
        pc.label = carryInfo.label || `至 ${carryInfo.end}`;
        pc.note = carryInfo.note || pc.note;
      }
      state.playerDealV23 = null;
      state.pendingPlayerDealV23 = null;
      state.contract.nextTeam = null;
      state.contract.nextEnd = null;
      state.contract.v40Carry = false;
      state.marketOffersV40 = [];
      state.marketOfferRoundV40 = 0;
      state.contractAttemptRoundV40 = 0;
      state.marketOffersV17 = [];
      state.marketOfferRoundV17 = 0;
      state.contractAttemptRoundV17 = 0;
      state.maxClauseActivatedV40 = false;
      state.maxClauseDecisionResolvedV40 = false;
      state.maxClauseTeamExitV40 = false;
      state.maxClauseRedBullKeepChanceV40 = null;
      state.aiClauseActivatedV40 = {};
      renderHub();
      autosave();
    }
    return r;
  };
  window.startNextSeasonV11 = startNextSeasonV11;
  const finalePrev40 = showSeasonFinaleV10;
  showSeasonFinaleV10 = function () {
    if (
      selected?.[0] === "Max Verstappen" &&
      y40() === 2026 &&
      state.maxClauseActivatedV40 &&
      !state.contract?.nextTeam
    )
      resolveMaxBilateralClauseV40();
    const r = finalePrev40.apply(this, arguments);
    if (!selected) return r;
    ensureContractsV40(false);
    const y = y40(),
      c = ci40(selected[0]),
      next = state.contract.nextTeam,
      valid = Number(c.end || 0) >= y + 1 && !c.rolling,
      el = document.getElementById("finalContract"),
      btn = document.getElementById("nextSeasonBtn");
    if (!next && valid) {
      if (el)
        el.innerHTML = `${y + 1}：现有 <b>${selected[1]}</b> 合同继续有效，合同至 <b>${c.end}</b>。${selected[0] === "Max Verstappen" && state.maxClauseActivatedV40 ? "<br>Red Bull 最终没有执行双向跳出权，原 2028 合同继续有效。" : ""}`;
      if (btn) {
        btn.textContent = `进入 ${y + 1} 赛季 →`;
        btn.onclick = function () {
          startNextSeasonV11();
        };
      }
    } else if (next && el) {
      el.innerHTML = `${y + 1}：已与 <b>${next}</b> 达成合同，合同至 <b>${state.contract.nextEnd || y + 1}</b>。`;
    } else if (
      selected[0] === "Max Verstappen" &&
      state.maxClauseTeamExitV40 &&
      el
    ) {
      el.innerHTML = `${y + 1}：<b>Red Bull 已执行双向跳出条款</b>，原本持续到 2028 的合同在 ${y} 年底终止。你没有提前锁定其他席位。`;
    }
    return r;
  };
  window.showSeasonFinaleV10 = showSeasonFinaleV10;
  const renderSeasonPrev40 = renderSeasonV10;
  renderSeasonV10 = function () {
    const r = renderSeasonPrev40.apply(this, arguments);
    if (
      selected &&
      typeof seasonCompleteV14 === "function" &&
      seasonCompleteV14()
    ) {
      const c = ci40(selected[0]),
        y = y40(),
        btn = document.querySelector("#seasonCompleteActions .primary");
      if (
        btn &&
        !state.contract.nextTeam &&
        Number(c.end || 0) >= y + 1 &&
        !c.rolling
      ) {
        btn.textContent = `进入 ${y + 1} 赛季 →`;
        btn.onclick = function () {
          startNextSeasonV11();
        };
      }
    }
    return r;
  };
  window.renderSeasonV10 = renderSeasonV10;
  const restorePrev40 = restoreSnapshot;
  restoreSnapshot = function (data) {
    const ok = restorePrev40.apply(this, arguments);
    if (ok && selected) {
      ensureContractsV40(false);
      if (state.contractAttemptRoundV40 == null)
        state.contractAttemptRoundV40 = 0;
      if (!Array.isArray(state.marketOffersV40)) state.marketOffersV40 = [];
      renderHub();
    }
    return ok;
  };
  window.restoreSnapshot = restoreSnapshot;
  const runFullPrev40 = window.runFullSeasonV36;
  if (typeof runFullPrev40 === "function") {
    window.runFullSeasonV36 = async function () {
      if (selected) {
        ensureContractsV40(false);
        updateSpecialClausesV40();
        if (contractWindowOpenV40())
          autoContactV40(state.round === calendar.length);
      }
      return runFullPrev40.apply(this, arguments);
    };
    window.runFullSeasonV27 = window.runFullSeasonV36;
    window.runFullSeasonV18 = window.runFullSeasonV36;
    setTimeout(() => {
      const b = document.querySelector(".fullSeasonSimBtn");
      if (b) b.onclick = window.runFullSeasonV36;
    }, 0);
  }
  const snapshotPrev40 = snapshot;
  snapshot = function () {
    const s = snapshotPrev40();
    s.version = 4138;
    s.majorVersion = "4.0";
    s.featureSet =
      "v40-strategy-review-patch13.8-summer-to-finale-contract-window";
    return s;
  };
  window.snapshot = snapshot;
  try {
    marketOpenV23 = contractWindowOpenV40;
  } catch (_) {}
  window.marketOpenV23 = contractWindowOpenV40;
  if (selected) {
    ensureContractsV40(false);
    updateSpecialClausesV40();
    renderHub();
  }
})();

/* v40-layout-standings-patch04-script */

(() => {
  const YEAR_KEY = () =>
    String(typeof seasonYearV11 === "function" ? seasonYearV11() : 2026);
  function ensureTimelineV40() {
    if (!selected || !state) return null;
    if (!state.standingsTimelineV40) state.standingsTimelineV40 = {};
    const y = YEAR_KEY();
    if (!state.standingsTimelineV40[y]) state.standingsTimelineV40[y] = {};
    return state.standingsTimelineV40[y];
  }
  function currentTeamForDriverV40(name, field = []) {
    return (
      field.find((x) => x.name === name)?.team ||
      drivers.find((d) => d[0] === name)?.[1] ||
      ""
    );
  }
  function captureStandingsRoundV40(force = false) {
    if (!selected || !state?.weekend?.raceResult) return;
    const y = YEAR_KEY(),
      r = Number(state.round || 0),
      bucket = ensureTimelineV40();
    if (!bucket || (!force && bucket[r])) return;
    const seasonResult = (state.seasonResults || []).find(
        (x) => Number(x.round) === r,
      ),
      field = (
        seasonResult?.field ||
        state.weekend.raceResult?.field ||
        []
      ).map((x) => ({ ...x }));
    const ds = Object.entries(state.driverStandings || {})
      .sort((a, b) => b[1] - a[1])
      .map(([name, points], i) => ({
        rank: i + 1,
        name,
        team: currentTeamForDriverV40(name, field),
        points: Number(points || 0),
      }));
    const ts = Object.entries(state.teamStandings || {})
      .sort((a, b) => b[1] - a[1])
      .map(([team, points], i) => ({
        rank: i + 1,
        team,
        points: Number(points || 0),
      }));
    bucket[r] = {
      year: Number(y),
      round: r,
      race: currentRace()?.[1] || seasonResult?.race || `R${r}`,
      wdc: ds,
      wcc: ts,
      result: field
        .map((x) => ({
          name: x.name,
          team: x.team,
          position: Number(x.position || 99),
          points: Number(x.points || 0),
          dnf: !!x.dnf,
          dns: !!x.dns,
          status: x.status || "",
        }))
        .sort((a, b) => a.position - b.position),
    };
  }
  window.captureStandingsRoundV40 = captureStandingsRoundV40;

  // Best-effort migration for old saves: race classification can be replayed; sprint points before this patch cannot be perfectly reconstructed.
  function rebuildTimelineV40() {
    const bucket = ensureTimelineV40();
    if (
      !bucket ||
      Object.keys(bucket).length ||
      (state.seasonResults || []).length === 0
    )
      return;
    let dp = {},
      tp = {};
    (state.seasonResults || [])
      .slice()
      .sort((a, b) => a.round - b.round)
      .forEach((sr) => {
        (sr.field || []).forEach((x) => {
          dp[x.name] = (dp[x.name] || 0) + Number(x.points || 0);
          tp[x.team] = (tp[x.team] || 0) + Number(x.points || 0);
        });
        const ds = Object.entries(dp)
          .sort((a, b) => b[1] - a[1])
          .map(([name, points], i) => ({
            rank: i + 1,
            name,
            team: currentTeamForDriverV40(name, sr.field || []),
            points,
          }));
        const ts = Object.entries(tp)
          .sort((a, b) => b[1] - a[1])
          .map(([team, points], i) => ({ rank: i + 1, team, points }));
        bucket[sr.round] = {
          year: Number(YEAR_KEY()),
          round: sr.round,
          race: sr.race || calendar[sr.round - 1]?.[1] || `R${sr.round}`,
          wdc: ds,
          wcc: ts,
          result: (sr.field || [])
            .map((x) => ({
              ...x,
              position: Number(x.position || 99),
              points: Number(x.points || 0),
            }))
            .sort((a, b) => a.position - b.position),
          migrated: true,
        };
      });
  }

  let selectedRoundV40 = null,
    selectedStandingsTabV40 = "wdc";
  function rankDeltaV40(bucket, round, type, key) {
    const now = bucket?.[round]?.[type] || [],
      prev = bucket?.[round - 1]?.[type] || [],
      find = (arr) =>
        arr.find((x) => (type === "wdc" ? x.name === key : x.team === key));
    const a = find(now),
      b = find(prev);
    if (!a || !b) return "";
    const d = b.rank - a.rank;
    if (!d) return '<span class="standingsDeltaV40">—</span>';
    return `<span class="standingsDeltaV40 ${d > 0 ? "up" : "down"}">${d > 0 ? "↑" : "↓"}${Math.abs(d)}</span>`;
  }
  function currentLiveTableV40(type) {
    if (type === "wdc") {
      const ds = Object.entries(state.driverStandings || {}).sort(
        (a, b) => b[1] - a[1],
      );
      return `<table class="standingsArchiveTableV40"><thead><tr><th>#</th><th>车手</th><th>积分</th></tr></thead><tbody>${ds
        .slice(0, 10)
        .map(
          ([n, p], i) =>
            `<tr class="${n === selected[0] ? "mine" : ""}"><td>${i + 1}</td><td>${n}</td><td><b>${p}</b></td></tr>`,
        )
        .join("")}</tbody></table>`;
    }
    const ts = Object.entries(state.teamStandings || {}).sort(
      (a, b) => b[1] - a[1],
    );
    return `<table class="standingsArchiveTableV40"><thead><tr><th>#</th><th>车队</th><th>积分</th></tr></thead><tbody>${ts.map(([n, p], i) => `<tr class="${n === selected[1] ? "mine" : ""}"><td>${i + 1}</td><td>${n}</td><td><b>${p}</b></td></tr>`).join("")}</tbody></table>`;
  }
  function archiveTableV40(snap, tab, bucket) {
    if (!snap)
      return '<div class="standingsNoDataV40">这一站还没有比赛数据。</div>';
    if (tab === "wdc")
      return `<div class="standingsTableScrollV40"><table class="standingsArchiveTableV40"><thead><tr><th>#</th><th>车手</th><th>车队</th><th>积分</th><th>变化</th></tr></thead><tbody>${snap.wdc.map((x) => `<tr class="${x.name === selected[0] ? "mine" : ""}"><td>${x.rank}</td><td>${x.name}</td><td>${x.team || "—"}</td><td><b>${x.points}</b></td><td>${rankDeltaV40(bucket, snap.round, "wdc", x.name)}</td></tr>`).join("")}</tbody></table></div>`;
    if (tab === "wcc")
      return `<div class="standingsTableScrollV40"><table class="standingsArchiveTableV40"><thead><tr><th>#</th><th>车队</th><th>积分</th><th>变化</th></tr></thead><tbody>${snap.wcc.map((x) => `<tr class="${x.team === selected[1] ? "mine" : ""}"><td>${x.rank}</td><td>${x.team}</td><td><b>${x.points}</b></td><td>${rankDeltaV40(bucket, snap.round, "wcc", x.team)}</td></tr>`).join("")}</tbody></table></div>`;
    return `<div class="standingsTableScrollV40"><table class="standingsArchiveTableV40"><thead><tr><th>#</th><th>车手</th><th>车队</th><th>积分</th><th>状态</th></tr></thead><tbody>${(
      snap.result || []
    )
      .map((x) => {
        const bad =
          x.dns || x.status === "DNS"
            ? "DNS"
            : x.dnf
              ? "DNF"
              : "P" + x.position;
        return `<tr class="${x.name === selected[0] ? "mine" : ""}"><td>${x.position}</td><td>${x.name}</td><td>${x.team}</td><td><b>+${x.points || 0}</b></td><td><span class="standingsResultTagV40 ${x.dnf || x.dns ? "dnf" : ""}">${bad}</span></td></tr>`;
      })
      .join("")}</tbody></table></div>`;
  }
  function renderStandingsArchiveV40() {
    const bucket = ensureTimelineV40();
    rebuildTimelineV40();
    const box = document.getElementById("standingsArchiveBodyV40");
    if (!box || !bucket) return;
    const rounds = Object.keys(bucket)
      .map(Number)
      .sort((a, b) => a - b);
    if (!rounds.length) {
      box.innerHTML =
        '<div class="standingsNoDataV40">完成第一场大奖赛后，这里会保存每一站结束时的 WDC、WCC 与比赛结果。</div>';
      return;
    }
    if (!selectedRoundV40 || !bucket[selectedRoundV40])
      selectedRoundV40 = rounds[rounds.length - 1];
    const s = bucket[selectedRoundV40];
    document
      .querySelectorAll(".standingsRoundBtnV40")
      .forEach((b) =>
        b.classList.toggle(
          "active",
          Number(b.dataset.round) === selectedRoundV40,
        ),
      );
    document
      .querySelectorAll(".standingsTabsV40 .mini")
      .forEach((b) =>
        b.classList.toggle("active", b.dataset.tab === selectedStandingsTabV40),
      );
    const title = document.getElementById("standingsArchiveTitleV40");
    if (title)
      title.textContent = `R${String(s.round).padStart(2, "0")} · ${s.race}`;
    const meta = document.getElementById("standingsArchiveMetaV40");
    if (meta)
      meta.textContent = s.migrated
        ? "旧存档回算 · 冲刺积分历史可能不完整"
        : "该站结束后的官方积分状态";
    box.innerHTML = archiveTableV40(s, selectedStandingsTabV40, bucket);
  }
  function selectStandingsRoundV40(r) {
    selectedRoundV40 = Number(r);
    renderStandingsArchiveV40();
  }
  function setStandingsTabV40(t) {
    selectedStandingsTabV40 = ["wdc", "wcc", "result"].includes(t) ? t : "wdc";
    renderStandingsArchiveV40();
  }
  window.selectStandingsRoundV40 = selectStandingsRoundV40;
  window.setStandingsTabV40 = setStandingsTabV40;

  function renderSeasonV40() {
    if (!selected) return;
    captureStandingsRoundV40(false);
    rebuildTimelineV40();
    const bucket = ensureTimelineV40(),
      rounds = Object.keys(bucket || {})
        .map(Number)
        .sort((a, b) => a - b),
      dr = typeof driverRankV10 === "function" ? driverRankV10() : 1,
      teamOrder = Object.entries(state.teamStandings || {}).sort(
        (a, b) => b[1] - a[1],
      ),
      tr = Math.max(1, teamOrder.findIndex((x) => x[0] === selected[1]) + 1),
      content = document.getElementById("seasonContent");
    if (!content) return;
    if (!selectedRoundV40 && rounds.length)
      selectedRoundV40 = rounds[rounds.length - 1];
    content.innerHTML = `<div class="standingsHeroV40"><div class="card standingsSummaryV40"><div class="kicker">CHAMPIONSHIP ARCHIVE</div><h2>${seasonYearV11()} 赛季积分轨迹</h2><p class="small">每场大奖赛结束后保存一次积分榜快照；可以回看当站后的 WDC、WCC 和完整比赛分类。</p><div class="standingsLiveGridV40" style="margin-top:12px"><div><div class="small">当前 WDC</div><div class="big">P${dr}</div><b>${state.driverStandings[selected[0]] || 0} 分</b></div><div><div class="small">当前 WCC</div><div class="big">P${tr}</div><b>${state.teamStandings[selected[1]] || 0} 分</b></div></div></div></div><div class="card"><div class="relationhead"><div><h2 class="sectiontitle" style="margin-bottom:3px">查看每站详情</h2><div class="small">选择一站查看当时的积分榜与正赛成绩。</div></div><div class="small">${rounds.length} / ${calendar.length} ROUNDS</div></div><div class="standingsTimelineV40">${rounds.length ? rounds.map((r) => `<button class="standingsRoundBtnV40 ${r === selectedRoundV40 ? "active" : ""}" data-round="${r}" onclick="selectStandingsRoundV40(${r})">R${String(r).padStart(2, "0")} · ${(bucket[r].race || "").replace("大奖赛", "")}</button>`).join("") : '<span class="small">尚无比赛记录</span>'}</div></div><div class="card standingsArchiveV40"><div class="standingsArchiveHeadV40"><div><div class="kicker">ROUND ARCHIVE</div><h2 id="standingsArchiveTitleV40">赛季尚未开始</h2><div class="small" id="standingsArchiveMetaV40"></div></div><div class="standingsTabsV40"><button class="mini" data-tab="wdc" onclick="setStandingsTabV40('wdc')">WDC 排名</button><button class="mini" data-tab="wcc" onclick="setStandingsTabV40('wcc')">WCC 排名</button><button class="mini" data-tab="result" onclick="setStandingsTabV40('result')">该站成绩</button></div></div><div id="standingsArchiveBodyV40"></div></div>${typeof seasonCompleteV14 === "function" && seasonCompleteV14() ? `<div class="card" id="seasonCompleteActions" style="margin-top:12px"><div class="relationhead"><div><h2 class="sectiontitle" style="margin-bottom:3px">${seasonYearV11()} 赛季已结束</h2><div class="small">查看完最终积分后可以返回赛季总结，或继续下一年。</div></div><div class="small">SEASON COMPLETE</div></div><div class="seasonCompleteActions"><button class="btn" onclick="showSeasonFinaleV10()">返回赛季总结</button><button class="btn primary" onclick="startNextSeasonV11()">进入 ${seasonYearV11() + 1} 赛季 →</button></div></div>` : ""}`;
    renderStandingsArchiveV40();
  }
  window.renderSeasonV40 = renderSeasonV40;

  function effectPreviewV40(mods) {
    return CAR_ATTRS_V10.map((a) => {
      const v = Number(mods?.[a] || 0);
      return `<div><span>${a}</span><b class="${v > 0 ? "up" : v < 0 ? "down" : "flat"}">${typeof signed1V16 === "function" ? signed1V16(v) : (v > 0 ? "+" : "") + v.toFixed(1)}</b></div>`;
    }).join("");
  }
  function renderRaceOpsV40() {
    window.ensureTeamEventV17?.();
    const e = state.teamEventV16,
      r = currentRace();
    document.getElementById("raceOpsBreadcrumb").textContent =
      `ROUND ${String(state.round).padStart(2, "0")} · ${r?.[2] || ""}`;
    document.getElementById("raceOpsName").textContent = r?.[1] || "比赛日";
    document.getElementById("raceOpsMeta").textContent =
      `${r?.[2] || ""} · ${r?.[3] || ""} · 先处理车队事务`;
    const box = document.getElementById("raceOpsEventV40");
    if (!box || !e) return;
    if (e.resolved) {
      box.innerHTML = `<div class="kicker">TEAM OPS · COMPLETE</div><h2>${e.title}</h2><p>${e.outcome || "本周事务已经完成。"}</p><button class="btn primary" style="margin-top:12px" onclick="openRaceWeekend()">进入比赛周末 →</button>`;
      document.getElementById("raceOpsEffectPreviewV40").innerHTML =
        effectPreviewV40(state.weeklyCarModsV16);
      return;
    }
    box.innerHTML = `<div class="kicker">TEAM OPS · REQUIRED</div><h2>${e.title}</h2><p>${e.body}</p><div class="raceOpsRequiredV40">选择一个方案后会直接进入本场比赛周末。临时修正只持续这一站。</div><div class="raceOpsChoiceGridV40">${e.choices.map((c, i) => `<div class="raceOpsChoiceV40" onclick="resolveTeamEventV16(${i})"><b>${c.label}</b><span>${c.desc}</span><div class="v16Effects">${effectHTMLV16(c.mods)}</div></div>`).join("")}</div>`;
    document.getElementById("raceOpsEffectPreviewV40").innerHTML =
      effectPreviewV40({});
  }
  window.renderRaceOpsV40 = renderRaceOpsV40;

  const resolveOpsPrev = window.resolveTeamEventV16;
  window.resolveTeamEventV16 = function (idx) {
    const onOps = document
      .getElementById("raceops")
      ?.classList.contains("active");
    const r = resolveOpsPrev.apply(this, arguments);
    if (onOps && state.teamEventV16?.resolved) {
      renderRaceOpsV40();
      setTimeout(() => {
        openRaceWeekend();
      }, 180);
    }
    return r;
  };
  try {
    resolveTeamEventV16 = window.resolveTeamEventV16;
  } catch (_) {}

  const openModulePrev04 = openModule;
  openModule = function (id) {
    if (id === "race") {
      window.ensureTeamEventV17?.();
      if (!state.teamEventV16?.resolved) {
        renderRaceOpsV40();
        showView("raceops");
        return;
      }
      return openRaceWeekend();
    }
    if (id === "season") {
      renderSeasonV40();
      showView("season");
      return;
    }
    if (id === "media") {
      try {
        renderMedia();
      } catch (_) {}
      showView("media");
      return;
    }
    return openModulePrev04(id);
  };
  window.openModule = openModule;

  const quickPrev04 = quickSimCurrentRound;
  quickSimCurrentRound = function () {
    window.ensureTeamEventV17?.();
    if (!state.teamEventV16?.resolved) {
      renderRaceOpsV40();
      showView("raceops");
      showToastV14?.("先在比赛日处理本周车队事务");
      return;
    }
    return quickPrev04.apply(this, arguments);
  };
  window.quickSimCurrentRound = quickSimCurrentRound;
  showRaceGateV12 = function () {
    renderRaceOpsV40();
    showView("raceops");
  };
  window.showRaceGateV12 = showRaceGateV12;

  const completePrev04 = completeRaceResultV10;
  completeRaceResultV10 = function (field, mine, noBonus = false) {
    const r = completePrev04.apply(this, arguments);
    try {
      captureStandingsRoundV40(true);
    } catch (e) {
      console.error("standings snapshot", e);
    }
    return r;
  };
  window.completeRaceResultV10 = completeRaceResultV10;

  const renderHubPrev04 = renderHub;
  renderHub = function () {
    const r = renderHubPrev04.apply(this, arguments);
    if (!selected) return r;
    document.querySelector("#career .careerTools .seasonShortcutV17")?.remove();
    const cards = document.querySelectorAll("#career .compactModules>.module");
    const race = cards[1],
      standing = cards[3],
      ach = cards[4];
    if (race) {
      race.classList.remove("locked");
      race.classList.add("ready");
      race.querySelector(".modnum").textContent = "MODULE 02";
    }
    const desc = document.getElementById("raceGateDesc");
    if (desc)
      desc.textContent = state.teamEventV16?.resolved
        ? "车队事务已完成，可以直接继续比赛周末。"
        : "进入比赛日后先处理本周车队事务，完成后直接进入比赛周末。";
    const qb = document.getElementById("quickSimBtn");
    if (qb) {
      qb.disabled = !state.teamEventV16?.resolved;
      qb.textContent = state.teamEventV16?.resolved
        ? "一键模拟本轮"
        : "比赛日内先处理事务";
    }
    if (standing) {
      standing.style.display = "block";
      standing.querySelector(".modnum").textContent = "MODULE 04";
      standing.querySelector("h2").textContent = "积分榜";
    }
    if (ach) ach.querySelector(".modnum").textContent = "MODULE 05";
    return r;
  };
  window.renderHub = renderHub;

  const advancePrev04 = advanceRound;
  advanceRound = function () {
    try {
      captureStandingsRoundV40(false);
    } catch (_) {}
    const r = advancePrev04.apply(this, arguments);
    selectedRoundV40 = null;
    return r;
  };
  window.advanceRound = advanceRound;
  const restorePrev04 = restoreSnapshot;
  restoreSnapshot = function (data) {
    const ok = restorePrev04.apply(this, arguments);
    if (ok && selected) {
      ensureTimelineV40();
      rebuildTimelineV40();
      renderHub();
    }
    return ok;
  };
  window.restoreSnapshot = restoreSnapshot;
  const startCareerPrev04 = startCareer;
  startCareer = function () {
    const r = startCareerPrev04.apply(this, arguments);
    if (selected) {
      state.standingsTimelineV40 = {};
      selectedRoundV40 = null;
      selectedStandingsTabV40 = "wdc";
      renderHub();
    }
    return r;
  };
  window.startCareer = startCareer;
  const startNextPrev04 = startNextSeasonV11;
  startNextSeasonV11 = function () {
    try {
      captureStandingsRoundV40(false);
    } catch (_) {}
    const r = startNextPrev04.apply(this, arguments);
    selectedRoundV40 = null;
    selectedStandingsTabV40 = "wdc";
    return r;
  };
  window.startNextSeasonV11 = startNextSeasonV11;

  const snapPrev04 = snapshot;
  snapshot = function () {
    const s = snapPrev04();
    s.version = 401;
    s.majorVersion = "4.0";
    s.featureSet = "v40-contract-patch04-raceday-affairs-championship-archive";
    return s;
  };
  window.snapshot = snapshot;

  setTimeout(() => {
    if (selected) {
      ensureTimelineV40();
      rebuildTimelineV40();
    }
  }, 0);
})();

/* v40-ui-patch05-script */

(() => {
  function ensureRaceLaunchV405() {
    const paddock = document.getElementById("hubPaddockWire");
    if (!paddock) return null;
    let el = document.getElementById("raceWeekendLaunchV405");
    if (!el) {
      el = document.createElement("div");
      el.id = "raceWeekendLaunchV405";
      el.className = "raceWeekendLaunchV405";
      el.onclick = () => openModule("race");
      el.innerHTML = `<div class="raceLaunchTopV405"><div class="raceLaunchKickerV405">RACE WEEKEND</div><div class="raceLaunchStateV405" id="raceLaunchStateV405">TEAM OPS</div></div><h2>进入比赛周</h2><div class="raceLaunchNameV405" id="raceLaunchNameV405">澳大利亚大奖赛</div><div class="raceLaunchMetaV405" id="raceLaunchMetaV405">ROUND 01 · 墨尔本</div><div class="raceLaunchBottomV405"><div class="raceLaunchHintV405" id="raceLaunchHintV405">进入后先处理本周事务，再继续比赛周末。</div><div class="raceLaunchGoV405">进入 →</div></div>`;
      paddock.insertAdjacentElement("afterend", el);
    }
    return el;
  }
  function syncRaceLaunchV405() {
    const el = ensureRaceLaunchV405();
    if (!el || !selected) return;
    window.ensureTeamEventV17?.();
    const r = currentRace?.(),
      done = !!state.teamEventV16?.resolved;
    const name = document.getElementById("raceLaunchNameV405"),
      meta = document.getElementById("raceLaunchMetaV405"),
      status = document.getElementById("raceLaunchStateV405"),
      hint = document.getElementById("raceLaunchHintV405");
    if (name) name.textContent = r?.[1] || "比赛周末";
    if (meta)
      meta.textContent = `ROUND ${String(state.round || 1).padStart(2, "0")} · ${r?.[2] || ""} · ${r?.[3] || ""}`;
    if (status) status.textContent = done ? "事务完成" : "事务待处理";
    if (hint)
      hint.textContent = done
        ? "本周事务已经处理，进入后点击下一步继续比赛。"
        : "进入后先处理本周车队事务，确认后再点击下一步。";
  }
  window.syncRaceLaunchV405 = syncRaceLaunchV405;

  function renderRaceOpsV405() {
    window.ensureTeamEventV17?.();
    const e = state.teamEventV16,
      r = currentRace?.();
    const crumb = document.getElementById("raceOpsBreadcrumb"),
      name = document.getElementById("raceOpsName"),
      meta = document.getElementById("raceOpsMeta"),
      box = document.getElementById("raceOpsEventV40"),
      preview = document.getElementById("raceOpsEffectPreviewV40");
    if (crumb)
      crumb.textContent = `ROUND ${String(state.round || 1).padStart(2, "0")} · ${r?.[2] || ""}`;
    if (name) name.textContent = r?.[1] || "比赛周末";
    if (meta) meta.textContent = `${r?.[2] || ""} · ${r?.[3] || ""} · 车队事务`;
    if (!box || !e) return;
    if (e.resolved) {
      box.innerHTML = `<div class="kicker">TEAM OPS · COMPLETE</div><h2>${e.title}</h2><p>${e.outcome || "本周事务已经完成。"}</p><div class="raceOpsRequiredV40">本周临时修正已经确认。点击下一步后进入原来的比赛流程。</div><div class="raceOpsNextV405"><button class="btn primary" onclick="continueRaceWeekendV405()">下一步 · 进入比赛 →</button></div>`;
      if (preview) preview.innerHTML = effectPreviewV40(state.weeklyCarModsV16);
      return;
    }
    box.innerHTML = `<div class="kicker">TEAM OPS · REQUIRED</div><h2>${e.title}</h2><p>${e.body}</p><div class="raceOpsRequiredV40">先选择本周处理方案。选择完成后会在下方出现“下一步”，不会自动跳转。</div><div class="raceOpsChoiceGridV40">${e.choices.map((c, i) => `<div class="raceOpsChoiceV40" onclick="resolveTeamEventV405(${i})"><b>${c.label}</b><span>${c.desc}</span><div class="v16Effects">${effectHTMLV16(c.mods)}</div></div>`).join("")}</div>`;
    if (preview) preview.innerHTML = effectPreviewV40({});
  }
  window.renderRaceOpsV40 = renderRaceOpsV405;
  window.continueRaceWeekendV405 = function () {
    if (!state.teamEventV16?.resolved) return;
    openRaceWeekend();
  };
  window.resolveTeamEventV405 = function (idx) {
    window.ensureTeamEventV17?.();
    const e = state.teamEventV16,
      c = e?.choices?.[idx];
    if (!e || e.resolved || !c) return;
    state.weeklyCarModsV16 = zeroModsV16();
    Object.entries(c.mods || {}).forEach(
      ([a, v]) => (state.weeklyCarModsV16[a] = Number(v)),
    );
    e.resolved = true;
    e.choice = idx;
    e.outcome = `${c.label}：${Object.entries(c.mods || {})
      .map(([a, v]) => `${a} ${signed1V16(v)}`)
      .join(" / ")}`;
    if (!state.teamEventHistoryV16) state.teamEventHistoryV16 = [];
    state.teamEventHistoryV16.unshift({
      round: state.round,
      title: e.title,
      choice: c.label,
      mods: { ...(c.mods || {}) },
    });
    state.teamEventHistoryV16 = state.teamEventHistoryV16.slice(0, 8);
    try {
      renderMedia();
    } catch (_) {}
    try {
      autosave();
    } catch (_) {}
    renderRaceOpsV405();
    syncRaceLaunchV405();
    showToastV14?.("本周事务已确认 · 点击下一步进入比赛");
  };
  /* Prevent Patch 04's automatic 180ms jump by replacing the globally-called handler. */
  window.resolveTeamEventV16 = window.resolveTeamEventV405;
  try {
    resolveTeamEventV16 = window.resolveTeamEventV405;
  } catch (_) {}

  const openModulePrev05 = openModule;
  openModule = function (id) {
    if (id === "race") {
      window.ensureTeamEventV17?.();
      renderRaceOpsV405();
      showView("raceops");
      return;
    }
    return openModulePrev05(id);
  };
  window.openModule = openModule;

  const renderHubPrev05 = renderHub;
  renderHub = function () {
    const out = renderHubPrev05.apply(this, arguments);
    if (!selected) return out;
    syncRaceLaunchV405();
    const mods = document.querySelector("#career .compactModules");
    if (mods) {
      const market = mods.children[3],
        standing = mods.children[4],
        ach = mods.children[5];
      if (market) market.querySelector(".modnum").textContent = "MODULE 04";
      if (standing) standing.querySelector(".modnum").textContent = "MODULE 05";
      if (ach) ach.querySelector(".modnum").textContent = "MODULE 06";
    }
    return out;
  };
  window.renderHub = renderHub;

  const snapPrev05 = snapshot;
  snapshot = function () {
    const s = snapPrev05();
    s.version = 403;
    s.majorVersion = "4.0";
    s.featureSet = "v40-contract-patch06-start-career-fix";
    return s;
  };
  window.snapshot = snapshot;
  setTimeout(() => {
    if (selected) {
      syncRaceLaunchV405();
    }
  }, 0);
})();

/* v40-patch06-start-fix */

(() => {
  function bindCareerLaunchV406() {
    const startBtn = document.querySelector(
      "#profile .profileactions .btn.primary",
    );
    if (startBtn) {
      startBtn.onclick = () => window.startCareer?.();
    }
    const custom = [...document.querySelectorAll("#home .menuitem")].find((x) =>
      x.textContent.includes("自定义车手生涯"),
    );
    if (custom && window.openCustomCareerV19)
      custom.onclick = () => window.openCustomCareerV19();
  }
  window.bindCareerLaunchV406 = bindCareerLaunchV406;
  bindCareerLaunchV406();
  setTimeout(bindCareerLaunchV406, 0);
})();

/* v40-patch07-race-entry-fix */

(() => {
  /* Patch 05 used a preview helper that lived inside Patch 04's IIFE.
     On the race-week tap this could throw before showView('raceops'), which made the card look unresponsive. */
  window.effectPreviewV40 = function (mods) {
    const attrs =
      typeof CAR_ATTRS_V10 !== "undefined" && Array.isArray(CAR_ATTRS_V10)
        ? CAR_ATTRS_V10
        : [
            "动力单元",
            "空力效率",
            "赛车平衡",
            "机械抓地",
            "轮胎管理",
            "可靠性/冷却",
          ];
    return attrs
      .map((a) => {
        const v = Number(mods?.[a] || 0),
          txt =
            typeof signed1V16 === "function"
              ? signed1V16(v)
              : `${v > 0 ? "+" : ""}${v.toFixed(1)}`;
        return `<div><span>${a}</span><b class="${v > 0 ? "up" : v < 0 ? "down" : "flat"}">${txt}</b></div>`;
      })
      .join("");
  };

  window.enterRaceWeekV407 = function (ev) {
    if (ev) {
      try {
        ev.preventDefault();
      } catch (_) {}
      try {
        ev.stopPropagation();
      } catch (_) {}
    }
    if (!selected) return false;
    try {
      window.ensureTeamEventV17?.();
      if (typeof window.renderRaceOpsV40 === "function")
        window.renderRaceOpsV40();
      const target = document.getElementById("raceops");
      if (!target) return false;
      document
        .querySelectorAll(".view")
        .forEach((v) => v.classList.remove("active"));
      void target.offsetWidth;
      target.classList.add("active");
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (_) {
        window.scrollTo(0, 0);
      }
      return true;
    } catch (err) {
      console.error("V4.0 race-week entry", err);
      /* Last-resort navigation: even if a cosmetic render fails, never leave the user stuck on HQ. */
      const target = document.getElementById("raceops");
      if (target) {
        document
          .querySelectorAll(".view")
          .forEach((v) => v.classList.remove("active"));
        target.classList.add("active");
        window.scrollTo(0, 0);
        return true;
      }
      return false;
    }
  };

  function bindRaceLaunchV407() {
    const el = document.getElementById("raceWeekendLaunchV405");
    if (!el) return;
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute("aria-label", "进入比赛周");
    el.onclick = window.enterRaceWeekV407;
    el.onkeydown = function (e) {
      if (e.key === "Enter" || e.key === " ") {
        window.enterRaceWeekV407(e);
      }
    };
  }
  window.bindRaceLaunchV407 = bindRaceLaunchV407;

  const openModulePrev07 = window.openModule || openModule;
  const openModuleV407 = function (id) {
    if (id === "race") return window.enterRaceWeekV407();
    return openModulePrev07(id);
  };
  window.openModule = openModuleV407;
  try {
    openModule = openModuleV407;
  } catch (_) {}

  const renderHubPrev07 = window.renderHub || renderHub;
  const renderHubV407 = function () {
    const out = renderHubPrev07.apply(this, arguments);
    bindRaceLaunchV407();
    return out;
  };
  window.renderHub = renderHubV407;
  try {
    renderHub = renderHubV407;
  } catch (_) {}

  bindRaceLaunchV407();
  setTimeout(bindRaceLaunchV407, 0);
})();

/* v40-patch08-teamops-fix */

(() => {
  const ATTRS408 = [
    "动力单元",
    "空力效率",
    "赛车平衡",
    "机械抓地",
    "轮胎管理",
    "可靠性/冷却",
  ];
  const num408 = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  const sign408 = (v) => {
    v = num408(v);
    return `${v > 0 ? "+" : ""}${v.toFixed(1)}`;
  };
  function zero408() {
    const o = {};
    ATTRS408.forEach((a) => (o[a] = 0));
    return o;
  }
  function mods408(spec) {
    const o = {};
    Object.entries(spec || {}).forEach(([k, v]) => (o[k] = num408(v)));
    return o;
  }
  const FALLBACK408 = [
    {
      id: "v408_balance",
      title: "周末设定方向需要最终确认",
      body: "工程组准备了三种本周方案。选择只影响这一站，进入下一轮后恢复基础赛车数值。",
      choices: [
        {
          label: "强化单圈窗口",
          desc: "让赛车在排位与前段更敏锐，但会牺牲部分轮胎管理。",
          mods: { 赛车平衡: 2.4, 空力效率: 1.6, 轮胎管理: -1.1 },
        },
        {
          label: "长距离优先",
          desc: "把资源放在轮胎和可靠性上，减少比赛后半程波动。",
          mods: { 轮胎管理: 2.6, "可靠性/冷却": 1.8, 动力单元: -1.0 },
        },
        {
          label: "机械平台优先",
          desc: "改善低速与出弯抓地，牺牲少量高速效率。",
          mods: { 机械抓地: 2.5, 赛车平衡: 1.5, 空力效率: -1.0 },
        },
      ],
    },
    {
      id: "v408_cooling",
      title: "冷却窗口比预期更紧",
      body: "赛道条件让工程组必须在动力输出、冷却余量和轮胎保护之间做出取舍。",
      choices: [
        {
          label: "保持高输出",
          desc: "保留更积极的动力映射，同时承担更高热负荷。",
          mods: { 动力单元: 2.7, 空力效率: 1.3, "可靠性/冷却": -1.2 },
        },
        {
          label: "保护赛车",
          desc: "扩大冷却余量并降低长距离故障风险。",
          mods: { "可靠性/冷却": 2.8, 轮胎管理: 1.5, 动力单元: -1.0 },
        },
        {
          label: "折中处理",
          desc: "没有极端优势，但整体平台更加稳定。",
          mods: { 赛车平衡: 1.8, 机械抓地: 1.5, "可靠性/冷却": 1.2 },
        },
      ],
    },
    {
      id: "v408_tyre",
      title: "轮胎工作区间出现偏移",
      body: "周末温度与赛道演化改变了最佳压力窗口，需要在暖胎、长距离和高速效率之间选择。",
      choices: [
        {
          label: "快速暖胎",
          desc: "更容易进入单圈窗口，但正赛胎耗会略高。",
          mods: { 机械抓地: 2.4, 赛车平衡: 1.7, 轮胎管理: -1.0 },
        },
        {
          label: "保护长距离",
          desc: "提升正赛轮胎表现和机械稳定。",
          mods: { 轮胎管理: 2.8, 机械抓地: 1.4, 空力效率: -1.0 },
        },
        {
          label: "降低阻力",
          desc: "偏向高速与直线表现，牺牲部分低速抓地。",
          mods: { 空力效率: 2.5, 动力单元: 1.5, 机械抓地: -1.1 },
        },
      ],
    },
  ];
  function valid408(e) {
    return !!(
      e &&
      e.round === state.round &&
      Array.isArray(e.choices) &&
      e.choices.length >= 2
    );
  }
  function ensure408(force = false) {
    if (!selected) return null;
    if (!force && valid408(state.teamEventV16)) return state.teamEventV16;
    try {
      if (typeof window.ensureTeamEventV17 === "function")
        window.ensureTeamEventV17(force);
    } catch (err) {
      console.warn("legacy team event init failed", err);
    }
    if (valid408(state.teamEventV16)) return state.teamEventV16;
    const seed =
        (Number(state.round || 1) + String(selected?.[0] || "").length) %
        FALLBACK408.length,
      base = FALLBACK408[seed];
    state.teamEventV16 = {
      version: 408,
      v17: false,
      v408: true,
      id: base.id,
      round: Number(state.round || 1),
      title: base.title,
      body: base.body,
      choices: base.choices.map((c) => ({
        label: c.label,
        desc: c.desc,
        mods: mods408(c.mods),
      })),
      resolved: false,
      choice: null,
      outcome: "",
    };
    state.weeklyCarModsV16 = zero408();
    return state.teamEventV16;
  }
  window.ensureTeamEventV408 = ensure408;

  function effects408(mods) {
    return (
      Object.entries(mods || {})
        .filter(([, v]) => num408(v) !== 0)
        .map(
          ([a, v]) =>
            `<small class="${num408(v) > 0 ? "up" : "down"}">${a} ${sign408(v)}</small>`,
        )
        .join("") || "<small>无额外修正</small>"
    );
  }
  function preview408(mods) {
    return ATTRS408.map((a) => {
      const v = num408(mods?.[a]);
      return `<div><span>${a}</span><b class="${v > 0 ? "up" : v < 0 ? "down" : "flat"}">${sign408(v)}</b></div>`;
    }).join("");
  }

  function render408() {
    const e = ensure408(),
      r = typeof currentRace === "function" ? currentRace() : null;
    const crumb = document.getElementById("raceOpsBreadcrumb"),
      name = document.getElementById("raceOpsName"),
      meta = document.getElementById("raceOpsMeta"),
      box = document.getElementById("raceOpsEventV40"),
      preview = document.getElementById("raceOpsEffectPreviewV40");
    if (crumb)
      crumb.textContent = `ROUND ${String(state.round || 1).padStart(2, "0")} · ${r?.[2] || ""}`;
    if (name) name.textContent = r?.[1] || "比赛周末";
    if (meta) meta.textContent = `${r?.[2] || ""} · ${r?.[3] || ""} · 车队事务`;
    if (!box) return;
    box.classList.add("raceOpsEventV408");
    if (!e) {
      box.innerHTML =
        '<div class="kicker">TEAM OPS</div><h2>事务载入失败</h2><p>请返回赛季总部后重新进入比赛周。</p>';
      return;
    }
    if (e.resolved) {
      box.innerHTML = `<div class="kicker">TEAM OPS · COMPLETE</div><h2>${e.title}</h2><p>${e.outcome || "本周事务已经完成。"}</p><div class="raceOpsPromptV408">本周事务已经确认。临时赛车修正只在这一站生效。</div><div class="raceOpsNextV408"><button class="btn primary" onclick="continueRaceWeekendV408()">下一步 · 进入比赛 →</button></div>`;
      if (preview) preview.innerHTML = preview408(state.weeklyCarModsV16 || {});
      return;
    }
    box.innerHTML = `<div class="kicker">TEAM OPS · REQUIRED</div><h2>${e.title}</h2><p>${e.body || ""}</p><div class="raceOpsChoiceGridV408">${e.choices.map((c, i) => `<div class="raceOpsChoiceV408" role="button" tabindex="0" onclick="resolveTeamEventV408(${i})"><b>${c.label}</b><span>${c.desc || ""}</span><div class="v408Effects">${effects408(c.mods)}</div></div>`).join("")}</div>`;
    if (preview) preview.innerHTML = preview408({});
  }
  window.renderRaceOpsV408 = render408;
  window.renderRaceOpsV40 = render408;

  window.resolveTeamEventV408 = function (idx) {
    const e = ensure408(),
      c = e?.choices?.[Number(idx)];
    if (!e || e.resolved || !c) return false;
    state.weeklyCarModsV16 = zero408();
    Object.entries(c.mods || {}).forEach(([a, v]) => {
      state.weeklyCarModsV16[a] = num408(v);
    });
    e.resolved = true;
    e.choice = Number(idx);
    e.outcome = `${c.label}：${Object.entries(c.mods || {})
      .filter(([, v]) => num408(v) !== 0)
      .map(([a, v]) => `${a} ${sign408(v)}`)
      .join(" / ")}`;
    if (!Array.isArray(state.teamEventHistoryV16))
      state.teamEventHistoryV16 = [];
    state.teamEventHistoryV16.unshift({
      round: state.round,
      title: e.title,
      choice: c.label,
      mods: { ...(c.mods || {}) },
    });
    state.teamEventHistoryV16 = state.teamEventHistoryV16.slice(0, 8);
    try {
      if (typeof autosave === "function") autosave();
    } catch (_) {}
    render408();
    try {
      window.syncRaceLaunchV405?.();
    } catch (_) {}
    try {
      window.showToastV14?.("本周事务已确认 · 点击下一步进入比赛");
    } catch (_) {}
    return true;
  };
  window.resolveTeamEventV16 = window.resolveTeamEventV408;
  try {
    resolveTeamEventV16 = window.resolveTeamEventV408;
  } catch (_) {}
  window.continueRaceWeekendV408 = function () {
    const e = ensure408();
    if (!e?.resolved) return false;
    if (typeof openRaceWeekend === "function") {
      openRaceWeekend();
      return true;
    }
    return false;
  };
  window.continueRaceWeekendV405 = window.continueRaceWeekendV408;

  const enterPrev408 = window.enterRaceWeekV407;
  window.enterRaceWeekV407 = function (ev) {
    if (ev) {
      try {
        ev.preventDefault();
      } catch (_) {}
      try {
        ev.stopPropagation();
      } catch (_) {}
    }
    if (!selected) return false;
    ensure408();
    render408();
    const target = document.getElementById("raceops");
    if (!target) return false;
    document
      .querySelectorAll(".view")
      .forEach((v) => v.classList.remove("active"));
    target.classList.add("active");
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (_) {
      try {
        window.scrollTo(0, 0);
      } catch (__) {}
    }
    return true;
  };
  function bind408() {
    const el = document.getElementById("raceWeekendLaunchV405");
    if (el) {
      el.onclick = window.enterRaceWeekV407;
      el.onkeydown = (e) => {
        if (e.key === "Enter" || e.key === " ") window.enterRaceWeekV407(e);
      };
    }
    const back = [...document.querySelectorAll("#raceops button")].find((b) =>
      b.textContent.includes("退出比赛日"),
    );
    if (back) back.textContent = "返回赛季总部";
  }
  const hubPrev408 = window.renderHub;
  window.renderHub = function () {
    const r = hubPrev408.apply(this, arguments);
    bind408();
    return r;
  };
  try {
    renderHub = window.renderHub;
  } catch (_) {}
  bind408();
  const snapPrev408 = window.snapshot;
  window.snapshot = function () {
    const s = snapPrev408.apply(this, arguments);
    s.version = 408;
    s.majorVersion = "4.0";
    s.featureSet = "v40-contract-patch08-teamops-render-fix";
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
})();

/* v40-patch10-weather-tyres-script */

(() => {
  const WX410 = {
    dry: { label: "干燥", icon: "☀️" },
    cloud: { label: "多云", icon: "☁️" },
    damp: { label: "潮湿", icon: "🌦️" },
    wet: { label: "湿地", icon: "🌧️" },
    extreme: { label: "积水", icon: "⛈️" },
  };
  /* V4.0 Patch 12: circuit-specific climate profiles. Values are gameplay tendencies, not daily forecasts. */
  const WEATHER_PROFILE_V412 = {
    澳大利亚大奖赛: {
      rain: 0.1,
      volatility: 0.66,
      storm: 0.44,
      persistence: 0.38,
      drying: 0.66,
      tag: "多变阵雨",
    },
    中国大奖赛: {
      rain: 0.08,
      volatility: 0.48,
      storm: 0.38,
      persistence: 0.48,
      drying: 0.56,
      tag: "偏稳定",
    },
    日本大奖赛: {
      rain: 0.15,
      volatility: 0.6,
      storm: 0.7,
      persistence: 0.72,
      drying: 0.34,
      tag: "雨势可持续",
    },
    迈阿密大奖赛: {
      rain: 0.12,
      volatility: 0.62,
      storm: 0.76,
      persistence: 0.48,
      drying: 0.74,
      tag: "对流阵雨",
    },
    加拿大大奖赛: {
      rain: 0.14,
      volatility: 0.6,
      storm: 0.48,
      persistence: 0.44,
      drying: 0.62,
      tag: "变化较快",
    },
    摩纳哥大奖赛: {
      rain: 0.1,
      volatility: 0.42,
      storm: 0.46,
      persistence: 0.5,
      drying: 0.44,
      tag: "偶发雨战",
    },
    "巴塞罗那-加泰罗尼亚大奖赛": {
      rain: 0.06,
      volatility: 0.3,
      storm: 0.25,
      persistence: 0.34,
      drying: 0.7,
      tag: "多数稳定",
    },
    奥地利大奖赛: {
      rain: 0.14,
      volatility: 0.68,
      storm: 0.66,
      persistence: 0.46,
      drying: 0.64,
      tag: "山区阵雨",
    },
    英国大奖赛: {
      rain: 0.2,
      volatility: 0.8,
      storm: 0.5,
      persistence: 0.48,
      drying: 0.48,
      tag: "阵雨反复",
    },
    比利时大奖赛: {
      rain: 0.28,
      volatility: 0.94,
      storm: 0.64,
      persistence: 0.56,
      drying: 0.4,
      tag: "极高变化",
    },
    匈牙利大奖赛: {
      rain: 0.09,
      volatility: 0.42,
      storm: 0.52,
      persistence: 0.36,
      drying: 0.74,
      tag: "偏热快干",
    },
    荷兰大奖赛: {
      rain: 0.16,
      volatility: 0.82,
      storm: 0.46,
      persistence: 0.56,
      drying: 0.38,
      tag: "海风多变",
    },
    意大利大奖赛: {
      rain: 0.08,
      volatility: 0.38,
      storm: 0.42,
      persistence: 0.44,
      drying: 0.6,
      tag: "多数偏干",
    },
    阿塞拜疆大奖赛: {
      rain: 0.04,
      volatility: 0.44,
      storm: 0.28,
      persistence: 0.28,
      drying: 0.72,
      tag: "偏干多风",
    },
    西班牙大奖赛: {
      rain: 0.06,
      volatility: 0.42,
      storm: 0.34,
      persistence: 0.3,
      drying: 0.72,
      tag: "以干地为主",
    },
    新加坡大奖赛: {
      rain: 0.18,
      volatility: 0.54,
      storm: 0.96,
      persistence: 0.82,
      drying: 0.18,
      tag: "热带暴雨",
    },
    美国大奖赛: {
      rain: 0.09,
      volatility: 0.52,
      storm: 0.46,
      persistence: 0.4,
      drying: 0.66,
      tag: "偶发变化",
    },
    墨西哥城大奖赛: {
      rain: 0.08,
      volatility: 0.5,
      storm: 0.64,
      persistence: 0.32,
      drying: 0.7,
      tag: "午后对流",
    },
    圣保罗大奖赛: {
      rain: 0.28,
      volatility: 0.88,
      storm: 0.9,
      persistence: 0.56,
      drying: 0.56,
      tag: "强对流多变",
    },
    拉斯维加斯大奖赛: {
      rain: 0.02,
      volatility: 0.2,
      storm: 0.1,
      persistence: 0.2,
      drying: 0.48,
      tag: "极少降雨",
    },
    卡塔尔大奖赛: {
      rain: 0.01,
      volatility: 0.12,
      storm: 0.08,
      persistence: 0.16,
      drying: 0.82,
      tag: "极稳定干燥",
    },
    阿布扎比大奖赛: {
      rain: 0.008,
      volatility: 0.1,
      storm: 0.05,
      persistence: 0.14,
      drying: 0.86,
      tag: "几乎锁定干地",
    },
    "巴林大奖赛 · 马来西亚": {
      rain: 0.3,
      volatility: 0.8,
      storm: 0.98,
      persistence: 0.84,
      drying: 0.18,
      tag: "热带骤雨",
    },
  };
  const DEFAULT_WEATHER_PROFILE_V412 = {
    rain: 0.09,
    volatility: 0.48,
    storm: 0.42,
    persistence: 0.42,
    drying: 0.58,
    tag: "常规天气",
  };
  const RAIN410 = Object.fromEntries(
    Object.entries(WEATHER_PROFILE_V412).map(([k, v]) => [k, v.rain]),
  );
  function clamp410(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }
  function currentRaceName410() {
    try {
      return currentRace()?.[1] || "";
    } catch (_) {
      return "";
    }
  }
  function weatherType410(stages) {
    const wet = stages.filter((x) => x === "wet" || x === "extreme").length,
      damp = stages.filter((x) => x === "damp").length;
    if (wet >= 2) return "wet";
    if (wet || damp) return "mixed";
    return "dry";
  }
  function profileV412(race) {
    return WEATHER_PROFILE_V412[race] || DEFAULT_WEATHER_PROFILE_V412;
  }
  function weightedPickV412(items) {
    let sum = items.reduce((a, x) => a + Math.max(0.001, x.w), 0),
      r = Math.random() * sum;
    for (const x of items) {
      r -= Math.max(0.001, x.w);
      if (r <= 0) return x.v;
    }
    return items[items.length - 1].v;
  }
  function softenExtremeV412(stages, p) {
    return stages.map((w) =>
      w === "extreme" && Math.random() > Math.max(0.08, p.storm * 0.9)
        ? "wet"
        : w === "wet" && p.storm < 0.28 && Math.random() < 0.42
          ? "damp"
          : w,
    );
  }
  function generateActualWeatherV412(p) {
    if (Math.random() >= p.rain) {
      const cloud = 0.12 + p.volatility * 0.2,
        st = [Math.random() < cloud ? "cloud" : "dry"];
      for (let i = 1; i < 3; i++) {
        const prev = st[i - 1],
          change = Math.random() < 0.1 + p.volatility * 0.18;
        st.push(change ? (prev === "dry" ? "cloud" : "dry") : prev);
      }
      return st;
    }
    const intense = p.storm > 0.74 ? "extreme" : "wet";
    const templates = [
      { v: ["dry", "damp", "wet"], w: 0.8 + p.persistence * 1.7 },
      {
        v: ["dry", "wet", intense],
        w: 0.35 + p.storm * 1.7 + p.persistence * 0.8,
      },
      {
        v: ["cloud", "damp", "dry"],
        w: 0.45 + (1 - p.persistence) * 1.25 + p.drying * 1.1,
      },
      {
        v: ["damp", "wet", "damp"],
        w: 0.55 + p.persistence * 1.6 + p.storm * 0.6,
      },
      {
        v: ["wet", "damp", "dry"],
        w: 0.35 + p.drying * 1.7 + (1 - p.persistence) * 0.7,
      },
      {
        v: ["dry", intense, p.drying > 0.55 ? "dry" : "damp"],
        w: 0.2 + p.volatility * 1.8 + p.storm * 0.9,
      },
      {
        v: ["dry", "cloud", p.storm > 0.62 ? "wet" : "damp"],
        w: 0.45 + p.volatility * 0.9,
      },
      {
        v: ["damp", "wet", intense],
        w: 0.25 + p.storm * 1.4 + p.persistence * 1.4,
      },
    ];
    return softenExtremeV412([...weightedPickV412(templates)], p);
  }
  function confidenceV412(p) {
    const score = 0.86 - p.volatility * 0.36 + (Math.random() - 0.5) * 0.16;
    return score > 0.62 ? "高" : score > 0.5 ? "中等" : "低";
  }
  function shiftWeatherV412(w, dir) {
    const opts = ["dry", "cloud", "damp", "wet", "extreme"],
      i = opts.indexOf(w);
    return i < 0 ? w : opts[clamp410(i + dir, 0, opts.length - 1)];
  }
  function makeForecast410(
    actual,
    confidence,
    p = DEFAULT_WEATHER_PROFILE_V412,
  ) {
    const f = [...actual];
    /* Patch 13.24: forecasts are usually useful. Medium/low confidence no longer guarantees an error. */
    const errorChance =
      confidence === "低"
        ? 0.28 + p.volatility * 0.08
        : confidence === "中等"
          ? 0.12 + p.volatility * 0.06
          : 0.015 + p.volatility * 0.025;
    let errors = Math.random() < errorChance ? 1 : 0;
    if (errors && confidence === "低" && Math.random() < 0.1) errors = 2;
    const used = new Set();
    for (let n = 0; n < errors; n++) {
      let idx;
      do {
        idx = Math.floor(Math.random() * 3);
      } while (used.has(idx) && used.size < 3);
      used.add(idx);
      const dir = Math.random() < 0.5 ? -1 : 1;
      f[idx] = shiftWeatherV412(f[idx], dir);
    }
    if (
      errors &&
      confidence === "低" &&
      p.volatility > 0.72 &&
      Math.random() < 0.08
    ) {
      const wetIdx = f.findIndex(
        (x) => x === "damp" || x === "wet" || x === "extreme",
      );
      if (wetIdx >= 0) {
        const to = clamp410(wetIdx + (Math.random() < 0.5 ? -1 : 1), 0, 2);
        if (to !== wetIdx) {
          const tmp = f[to];
          f[to] = f[wetIdx];
          f[wetIdx] = tmp;
        }
      }
    }
    return f;
  }
  function climateTraitV412(p) {
    const rain =
      p.rain >= 0.45
        ? "高降雨"
        : p.rain >= 0.28
          ? "较高降雨"
          : p.rain <= 0.08
            ? "极少降雨"
            : p.rain <= 0.15
              ? "低降雨"
              : "中等降雨";
    const vol =
      p.volatility >= 0.85
        ? "极高变化"
        : p.volatility >= 0.68
          ? "高变化"
          : p.volatility <= 0.22
            ? "极稳定"
            : "中等变化";
    const storm =
      p.storm >= 0.85
        ? "强暴雨倾向"
        : p.storm >= 0.62
          ? "强降雨倾向"
          : p.storm <= 0.2
            ? "弱对流"
            : "常规雨势";
    return `${rain} · ${vol} · ${storm}`;
  }
  function ensureWeatherV410(force = false) {
    if (!state?.weekend) return null;
    const race = currentRaceName410(),
      p = profileV412(race);
    if (
      !force &&
      state.weekend.weatherV410?.race === race &&
      Number(state.weekend.weatherV410?.version || 0) >= 413
    )
      return state.weekend.weatherV410;
    const actual = generateActualWeatherV412(p),
      confidence = confidenceV412(p),
      forecast = makeForecast410(actual, confidence, p);
    const wx = {
      version: 413,
      race,
      actual,
      forecast,
      confidence,
      type: weatherType410(actual),
      rainChance: Math.round(p.rain * 100),
      decision: null,
      trait: climateTraitV412(p),
      climateTag: p.tag,
      profile: {
        rain: p.rain,
        volatility: p.volatility,
        storm: p.storm,
        persistence: p.persistence,
        drying: p.drying,
      },
    };
    state.weekend.weatherV410 = wx;
    return wx;
  }
  window.ensureWeatherV410 = ensureWeatherV410;
  window.WEATHER_PROFILE_V412 = WEATHER_PROFILE_V412;

  function tyrePlans410() {
    const wx = ensureWeatherV410(),
      wetish =
        wx &&
        wx.forecast.some((x) => x === "damp" || x === "wet" || x === "extreme");
    if (wetish)
      return [
        {
          id: "flex",
          name: "灵活一停",
          route: ["M", "I"],
          desc: "中性胎起步，雨势成形后转半雨胎。最容易跟随赛道变化。",
          tags: ["平衡", "天气适应"],
        },
        {
          id: "attack",
          name: "两停进攻",
          route: ["S", "I", "S"],
          desc: "前后段都争取软胎速度，中段根据降雨切半雨胎。窗口更敏感。",
          tags: ["速度优先", "较高波动"],
        },
        {
          id: "rain",
          name: "雨势优先",
          route: ["I", "W"],
          desc: "提前为湿地做准备。真下雨很稳，但如果赛道保持干燥会付出明显代价。",
          tags: ["雨战", "保守"],
        },
      ];
    return [
      {
        id: "balanced",
        name: "标准一停",
        route: ["M", "H"],
        desc: "中性胎起步后转硬胎，兼顾赛道位置和轮胎寿命。",
        tags: ["稳定", "一停"],
      },
      {
        id: "attack",
        name: "两停进攻",
        route: ["S", "M", "S"],
        desc: "用软胎争取起步和末段速度，多一次进站换取更高上限。",
        tags: ["速度优先", "两停"],
      },
      {
        id: "reverse",
        name: "反向策略",
        route: ["H", "M"],
        desc: "硬胎拉长第一段，等待安全车或后程轮胎优势。前段速度较慢。",
        tags: ["长距离", "等待机会"],
      },
    ];
  }
  function tyreClass410(c) {
    return { S: "soft", M: "medium", H: "hard", I: "inter", W: "wet" }[c] || "";
  }
  function tyreName410(c) {
    return (
      { S: "SOFT", M: "MEDIUM", H: "HARD", I: "INTERMEDIATE", W: "WET" }[c] || c
    );
  }
  function tyreRouteHTML410(route) {
    return route
      .map(
        (c, i) =>
          `${i ? '<span class="tyreArrowV410">→</span>' : ""}<span class="tyreChipV410 ${tyreClass410(c)}">${tyreName410(c)}</span>`,
      )
      .join("");
  }
  function renderWeatherTyres410() {
    if (!state?.weekend?.qualResult) return;
    const wx = ensureWeatherV410(),
      brief = document.getElementById("gpBrief"),
      strategies = document.getElementById("raceStrategies"),
      start = document.getElementById("raceStart");
    if (!brief || !strategies) return;
    let weather = document.getElementById("weatherPanelV410");
    if (!weather) {
      weather = document.createElement("div");
      weather.id = "weatherPanelV410";
      weather.className = "weatherPanelV410";
      brief.insertAdjacentElement("afterend", weather);
    }
    const labels = ["起步", "中段", "末段"];
    weather.innerHTML = `<div class="weatherTopV410"><div><b>天气预报 · 降雨概率 ${wx.rainChance}%</b><br><small>预报可信度：${wx.confidence} · ${wx.climateTag || "常规天气"} · ${wx.trait || ""}</small></div><small>WEATHER RADAR</small></div><div class="weatherStagesV410">${wx.forecast.map((w, i) => `<div class="weatherStageV410"><span>${labels[i]}</span><em>${WX410[w]?.icon || "☀️"}</em><strong>${WX410[w]?.label || w}</strong></div>`).join("")}</div>`;
    let title = document.getElementById("raceApproachTitleV410");
    if (!title) {
      title = document.createElement("div");
      title.id = "raceApproachTitleV410";
      title.className = "raceStrategyTitleV410";
      title.innerHTML = "<b>比赛方式</b><span>激进 / 平衡 / 保守</span>";
      strategies.insertAdjacentElement("beforebegin", title);
    }
    let tyre = document.getElementById("tyreStrategyV410");
    if (!tyre) {
      tyre = document.createElement("div");
      tyre.id = "tyreStrategyV410";
      tyre.className = "raceStrategySectionV410";
      strategies.insertAdjacentElement("afterend", tyre);
    }
    const plans = tyrePlans410();
    if (!plans.some((x) => x.id === state.weekend.tyrePlanV410))
      state.weekend.tyrePlanV410 = null;
    tyre.innerHTML = `<div class="raceStrategyTitleV410"><b>轮胎策略</b><span>选择基础计划，比赛中仍可能因天气调整</span></div><div class="tyreGridV410">${plans.map((p) => `<div class="tyreChoiceV410 ${state.weekend.tyrePlanV410 === p.id ? "selected" : ""}" onclick="selectTyrePlanV410('${p.id}')"><b>${p.name}</b><div class="tyreRouteV410">${tyreRouteHTML410(p.route)}</div><small>${p.desc}</small><div class="tyreMetaV410">${p.tags.map((t) => `<span>${t}</span>`).join("")}</div></div>`).join("")}</div>`;
    if (start) {
      start.disabled = !(
        state.weekend.raceStrategy && state.weekend.tyrePlanV410
      );
      start.textContent = state.weekend.tyrePlanV410
        ? "前往发车格 · 开始正赛 →"
        : "请选择轮胎策略";
    }
  }
  window.renderWeatherTyres410 = renderWeatherTyres410;
  window.selectTyrePlanV410 = function (id) {
    state.weekend.tyrePlanV410 = id;
    try {
      autosave();
    } catch (_) {}
    renderGrandPrix();
  };

  const renderGrandPrixPrev410 = window.renderGrandPrix || renderGrandPrix;
  const renderGrandPrix410 = function () {
    const r = renderGrandPrixPrev410.apply(this, arguments);
    try {
      renderWeatherTyres410();
    } catch (err) {
      console.warn("weather/tyre render", err);
    }
    return r;
  };
  window.renderGrandPrix = renderGrandPrix410;
  try {
    renderGrandPrix = renderGrandPrix410;
  } catch (_) {}

  function planEffect410() {
    const wx = ensureWeatherV410(),
      id = state.weekend.tyrePlanV410 || "balanced",
      tm = Number(teams?.[selected?.[1]]?.parts?.["轮胎管理"] || 65),
      type = wx?.type || "dry";
    let pos = 0,
      risk = 0,
      note = "";
    if (type === "dry") {
      if (id === "rain") {
        pos += 2;
        note = "预报中的雨没有真正形成，提前偏向雨胎付出了赛道位置。";
      } else if (id === "reverse" && tm >= 74) {
        pos -= 1;
        note = "良好的轮胎管理让反向策略在后程获得回报。";
      } else if (id === "attack" && tm < 62) {
        pos += 1;
        risk += 0.008;
        note = "两停进攻放大了轮胎管理不足的问题。";
      }
    } else if (type === "mixed") {
      if (id === "flex") pos -= 1;
      else if (id === "rain") pos += 0;
      else if (id === "balanced" || id === "reverse") pos += 1;
      note = "赛道经历干湿交替，进站窗口成为比赛的一部分。";
    } else {
      if (id === "rain") pos -= 1;
      else if (id === "flex") pos += 0;
      else pos += 1;
      note = "持续湿地让雨胎选择和换胎时机主导了长距离表现。";
    }
    if (tm >= 80 && pos > 0) pos -= 1;
    if (tm < 58 && id === "attack") risk += 0.008;
    return { pos, risk, note };
  }
  const startRacePrev410 = window.startRacePhase || startRacePhase;
  const startRace410 = function (phase) {
    if (phase === "race") {
      ensureWeatherV410();
      if (!state.weekend.tyrePlanV410) {
        alert("请先选择轮胎策略。");
        return false;
      }
      const ef = planEffect410();
      state.weekend.tyrePlanEffectV410 = ef;
    }
    const r = startRacePrev410.apply(this, arguments);
    if (phase === "race" && Array.isArray(state.weekend.eventQueue)) {
      const ef = state.weekend.tyrePlanEffectV410 || {
        pos: 0,
        risk: 0,
        note: "",
      };
      state.weekend.positionMod =
        Number(state.weekend.positionMod || 0) + Number(ef.pos || 0);
      state.weekend.dnfRisk =
        Number(state.weekend.dnfRisk || 0) + Number(ef.risk || 0);
      if (ef.note) state.weekend.eventNotes.push(`轮胎策略：${ef.note}`);
    }
    return r;
  };
  window.startRacePhase = startRace410;
  try {
    startRacePhase = startRace410;
  } catch (_) {}

  const resolvePrev410 = window.resolveRaceEvent || resolveRaceEvent;
  const resolve410 = function (i) {
    const ev =
      state?.weekend?.eventQueue?.[state.weekend.eventIndex] ||
      state?.weekend?.pendingEvent;
    if (ev?.v410Weather) {
      const raw = ev.choices?.[Number(i)];
      state.weekend.weatherV410.decision = raw?.[0] || "";
      state.weekend.weatherV410.decisionRound = state.round;
    }
    return resolvePrev410.apply(this, arguments);
  };
  window.resolveRaceEvent = resolve410;
  try {
    resolveRaceEvent = resolve410;
  } catch (_) {}

  /* Give AI a small, symmetric weather-management spread rather than making every AI react identically. */
  const simAIPrev410 = window.simulateAIFieldV10 || simulateAIFieldV10;
  const simAI410 = function (phase, noPlayerBonus = false) {
    const field = simAIPrev410.apply(this, arguments);
    if (phase !== "race") return field;
    const wx = ensureWeatherV410();
    if (!wx || wx.type === "dry") return field;
    field.forEach((x) => {
      const d = drivers.find((z) => z[0] === x.name),
        awa = Number(d?.[5] || 70),
        tm = Number(teams?.[x.team]?.parts?.["轮胎管理"] || 65);
      x.total +=
        (awa - 75) * 0.018 + (tm - 70) * 0.014 + (Math.random() - 0.5) * 1.15;
    });
    return field;
  };
  window.simulateAIFieldV10 = simAI410;
  window.simulateAIField = simAI410;
  try {
    simulateAIFieldV10 = simAI410;
    simulateAIField = simAI410;
  } catch (_) {}

  const resultPrev410 = window.renderWeekendResult || renderWeekendResult;
  function weatherLabelsResultV410(arr) {
    const names = ["起步", "中段", "末段"];
    return (arr || [])
      .map((w, i) => `${names[i]}：${WX410[w]?.label || w}`)
      .join(" · ");
  }
  function renderResultWeatherBoxV410(box, wx, strategyText, note) {
    const diff = (wx?.forecast || []).reduce(
        (n, w, i) => n + (w !== wx?.actual?.[i] ? 1 : 0),
        0,
      ),
      sub = diff
        ? `赛前预测与实际有 ${diff} 处偏差。`
        : "赛前预测与实际基本一致。";
    box.innerHTML = `<div class="rwTitle">WEATHER / TYRE STRATEGY</div><div class="rwLine">${strategyText}</div><div class="rwSub">赛后天气对照：上方为赛前预测，下方为实际变化。</div><div class="resultWeatherCompareV410"><div class="resultWeatherRowV410"><span>Forecast</span><div class="weatherIconsV410">${(wx?.forecast || []).map((w) => WX410[w]?.icon || "").join(" ")}</div><div class="weatherLabelsV410">${weatherLabelsResultV410(wx?.forecast)}</div></div><div class="resultWeatherRowV410"><span>Actual</span><div class="weatherIconsV410">${(wx?.actual || []).map((w) => WX410[w]?.icon || "").join(" ")}</div><div class="weatherLabelsV410">${weatherLabelsResultV410(wx?.actual)}</div></div></div><div class="rwNote">${sub}${wx?.decision ? ` 关键天气决定：${wx.decision}。` : ""}${note || ""}</div>`;
  }
  const result410 = function () {
    const r = resultPrev410.apply(this, arguments);
    try {
      const wx = state?.weekend?.weatherV410,
        rr = state?.weekend?.raceResult;
      if (!wx || !rr) return r;
      const host =
        document.querySelector("#weekendresult .resultSummary") ||
        document.querySelector("#weekendresult .finishCard");
      if (!host) return r;
      let box = document.getElementById("resultWeatherV410");
      if (!box) {
        box = document.createElement("div");
        box.id = "resultWeatherV410";
        box.className = "resultWeatherV410";
        host.appendChild(box);
      }
      const plans = tyrePlans410(),
        p = plans.find((x) => x.id === state.weekend.tyrePlanV410);
      renderResultWeatherBoxV410(
        box,
        wx,
        `${p?.name || "自动策略"} ${p ? `· ${p.route.map(tyreName410).join(" → ")}` : ""}`,
        state.weekend.tyrePlanEffectV410?.note || "",
      );
    } catch (err) {
      console.warn("result weather", err);
    }
    return r;
  };
  window.renderWeekendResult = result410;
  try {
    renderWeekendResult = result410;
  } catch (_) {}

  const advPrev410 = window.advanceRound || advanceRound;
  const adv410 = function () {
    const r = advPrev410.apply(this, arguments);
    if (state?.weekend) {
      delete state.weekend.weatherV410;
      delete state.weekend.tyrePlanV410;
      delete state.weekend.tyrePlanEffectV410;
    }
    return r;
  };
  window.advanceRound = adv410;
  try {
    advanceRound = adv410;
  } catch (_) {}
  const snapPrev410 = window.snapshot || snapshot;
  window.snapshot = function () {
    const x = snapPrev410.apply(this, arguments);
    x.version = 410;
    x.majorVersion = "4.0";
    x.featureSet = "v40-weather-tyres-patch10";
    return x;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
})();

/* v40-patch11-race-rewrite-script */

(() => {
  const WX411 = {
    dry: ["干地", "☀️"],
    cloud: ["多云", "☁️"],
    damp: ["潮湿", "🌦️"],
    wet: ["湿地", "🌧️"],
    extreme: ["积水", "⛈️"],
  };
  const STREET411 = new Set([
    "摩纳哥大奖赛",
    "阿塞拜疆大奖赛",
    "新加坡大奖赛",
    "拉斯维加斯大奖赛",
    "迈阿密大奖赛",
  ]);
  const POWER411 = new Set([
    "意大利大奖赛",
    "比利时大奖赛",
    "奥地利大奖赛",
    "加拿大大奖赛",
    "阿塞拜疆大奖赛",
  ]);
  const TYRE411 = new Set([
    "匈牙利大奖赛",
    "巴塞罗那-加泰罗尼亚大奖赛",
    "西班牙大奖赛",
    "日本大奖赛",
    "中国大奖赛",
    "圣保罗大奖赛",
  ]);
  const clamp411 = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd411 = (a, b) => a + Math.random() * (b - a);
  const raceName411 = () => {
    try {
      return currentRace()?.[1] || "";
    } catch (_) {
      return "";
    }
  };
  const stageLabel411 = (i) =>
    ["起步阶段", "比赛中段", "比赛末段"][clamp411(Number(i) || 0, 0, 2)];
  const wxLabel411 = (w) => WX411[w]?.[0] || w || "未知";
  const wxIcon411 = (w) => WX411[w]?.[1] || "☀️";

  function ensureRaceControlView411() {
    if (document.getElementById("racecontrolV411")) return;
    const s = document.createElement("section");
    s.id = "racecontrolV411";
    s.className = "view";
    s.innerHTML = `<div class="raceControlWrapV411"><div class="raceControlHeadV411"><div><div class="kicker">RACE CONTROL · LIVE</div><div class="small" id="rcBreadcrumbV411"></div></div><span class="liveRaceTagV411"><i class="liveRaceDotV411"></i>比赛已暂停等待决策</span></div><div id="rcContentV411"></div></div>`;
    const before = document.getElementById("weekendresult");
    (before?.parentNode || document.body).insertBefore(s, before || null);
  }
  ensureRaceControlView411();

  function qualifyingDirect411() {
    if (!selected) return false;
    if (state.weekend?.qualResult) {
      renderGrandPrix();
      showView("grandprix");
      return true;
    }
    try {
      if (typeof ensureStateV10 === "function") ensureStateV10();
    } catch (_) {}
    let field =
      typeof simulateDirectSessionV10 === "function"
        ? simulateDirectSessionV10("qual")
        : [];
    if (!field?.length) return false;
    const mine = field.find((x) => x.mine || x.name === selected[0]);
    if (!mine) return false;
    mine.mine = true;
    mine.field = field.map((x) => ({ ...x }));
    mine.note = "排位自动计算完成。";
    mine.choice = "自动";
    mine.eventTitle = "排位赛";
    state.weekend.qualField = field;
    state.weekend.qualResult = mine;
    state.weekend.qualStrategy = "normal";
    state.weekend.raceStrategy = "normal";
    try {
      if (mine.position === 1) state.driverSeasonStats[selected[0]].poles++;
      window.processQualAchievementsV3?.();
      autosave();
    } catch (_) {}
    renderGrandPrix();
    try {
      raceTransition(
        "QUALIFYING COMPLETE",
        `P${mine.position} · ${raceName411()}`,
        "SUNDAY · GRAND PRIX",
        "grandprix",
      );
    } catch (_) {
      showView("grandprix");
    }
    return true;
  }
  window.runQualifyingV411 = qualifyingDirect411;

  const renderQualPrev411 = window.renderQualifying || renderQualifying;
  window.renderQualifying = function () {
    const r = renderQualPrev411.apply(this, arguments);
    const box = document.getElementById("qualStrategies");
    if (box) box.style.display = "none";
    const brief = document.getElementById("qualBrief");
    if (brief)
      brief.textContent =
        "排位不再需要额外决策。系统会按照赛车赛道适配、车手单圈能力、周末状态与随机波动直接计算发车顺序。";
    const head = box?.previousElementSibling;
    if (head && head.id === "raceApproachTitleV410")
      head.style.display = "none";
    document.getElementById("qualAutoNoteV411")?.remove();
    const btn = document.getElementById("qualStart");
    if (btn) {
      btn.disabled = false;
      btn.textContent = "开始排位 · 计算结果 →";
      btn.onclick = qualifyingDirect411;
    }
    const title = document.querySelector("#qualifying .stageBrief h2");
    if (title) title.textContent = "排位赛";
    return r;
  };
  try {
    renderQualifying = window.renderQualifying;
  } catch (_) {}

  function baseTyreEffect411() {
    const wx = window.ensureWeatherV410?.() ||
        state.weekend.weatherV410 || { type: "dry" },
      id = state.weekend.tyrePlanV410 || "balanced",
      tm = Number(teams?.[selected?.[1]]?.parts?.["轮胎管理"] || 65);
    let pos = 0,
      risk = 0,
      quality = 72,
      note = "";
    if (wx.type === "dry") {
      if (id === "balanced") {
        quality = 76;
        note = "标准一停让比赛保持在正常窗口。";
      } else if (id === "attack") {
        quality = tm >= 68 ? 80 : 72;
        pos += tm >= 76 ? -1 : 0;
        risk += tm < 62 ? 0.012 : 0.004;
        note = "两停策略用更高峰值速度交换额外进站成本。";
      } else if (id === "reverse") {
        quality = tm >= 72 ? 79 : 70;
        pos += tm >= 78 ? -1 : 0;
        note = "反向策略把机会留到后半程和潜在安全车窗口。";
      } else if (id === "rain") {
        quality = 57;
        pos += 2;
        note = "实际赛道偏干，过度偏向雨战付出了时间。";
      } else if (id === "flex") {
        quality = 70;
        note = "灵活方案在干地仍可工作，但不是理论最快。";
      }
    } else if (wx.type === "mixed") {
      if (id === "flex") {
        quality = 84;
        pos -= 1;
        note = "灵活策略与干湿交替的背景匹配。";
      } else if (id === "rain") {
        quality = 78;
        note = "雨势准备减少了 crossover 阶段的风险。";
      } else if (id === "attack") {
        quality = 77;
        risk += 0.006;
        note = "进攻方案速度不错，但窗口更依赖判断。";
      } else {
        quality = 68;
        pos += 1;
        note = "原本的干地计划在干湿变化中需要额外修正。";
      }
    } else {
      if (id === "rain") {
        quality = 84;
        pos -= 1;
        note = "持续湿地让雨战预案兑现。";
      } else if (id === "flex") {
        quality = 80;
        note = "灵活策略顺利切入湿地窗口。";
      } else if (id === "attack") {
        quality = 69;
        pos += 1;
        risk += 0.012;
        note = "持续湿地削弱了原本依赖干胎速度的进攻计划。";
      } else {
        quality = 62;
        pos += 2;
        risk += 0.016;
        note = "持续湿地迫使干地基础策略临时改线。";
      }
    }
    if (tm >= 82 && pos > 0) pos--;
    return { pos, risk, quality, note };
  }

  function weightedDriver411(mode = "incident", exclude = []) {
    const pool = drivers.filter(
      (d) => d[0] !== selected[0] && !exclude.includes(d[0]),
    );
    if (!pool.length) return null;
    const weighted = pool.map((d) => {
      const awa = Number(d[5] || 75),
        rel = Number(teams?.[d[1]]?.parts?.["可靠性/冷却"] || 70);
      let w = 1;
      if (mode === "mechanical") w += Math.max(0, 74 - rel) * 0.09;
      else w += Math.max(0, 83 - awa) * 0.06;
      return { d, w };
    });
    let n = Math.random() * weighted.reduce((s, x) => s + x.w, 0);
    for (const x of weighted) {
      n -= x.w;
      if (n <= 0) return x.d;
    }
    return weighted.at(-1).d;
  }
  function raceControlEvent411() {
    const race = raceName411(),
      wx = window.ensureWeatherV410?.() ||
        state.weekend.weatherV410 || { type: "dry" };
    let base = 0.31;
    if (STREET411.has(race)) base += 0.09;
    if (wx.type === "mixed") base += 0.07;
    if (wx.type === "wet") base += 0.13;
    if (Math.random() > clamp411(base, 0.18, 0.58)) return null;
    let roll = Math.random(),
      type = roll < 0.47 ? "VSC" : roll < 0.88 ? "SC" : "RED";
    if (wx.type === "wet" && Math.random() < 0.2) type = "RED";
    const stage = Math.random() < 0.68 ? 1 : 2,
      weather = (wx.actual || [])[stage] || "dry",
      incidentDNFs = [];
    let title = "",
      scene = "",
      driversInvolved = [];
    if (type === "VSC") {
      const mechanical = Math.random() < 0.62,
        d1 = weightedDriver411(mechanical ? "mechanical" : "incident");
      if (!d1) return null;
      driversInvolved = [d1[0]];
      incidentDNFs.push(d1[0]);
      title = "VIRTUAL SAFETY CAR";
      scene = mechanical
        ? `${d1[0]} 的赛车出现机械故障并停在赛道边。车辆没有完全阻塞赛道，但工作人员需要进入缓冲区回收。`
        : `${d1[0]} 在低速区冲出赛道，赛车停在危险位置附近。比赛控制启用 VSC 处理现场。`;
    } else if (type === "SC") {
      const two = Math.random() < 0.56,
        d1 = weightedDriver411("incident");
      if (!d1) return null;
      if (two) {
        const d2 = weightedDriver411("incident", [d1[0]]);
        driversInvolved = [d1[0], d2?.[0]].filter(Boolean);
        incidentDNFs.push(d1[0]);
        if (d2 && Math.random() < 0.58) incidentDNFs.push(d2[0]);
        title = "SAFETY CAR";
        scene = `${d1[0]}${d2 ? ` 与 ${d2[0]}` : ""} 在争夺位置时发生碰撞，赛道上留下碎片。安全车出动，车阵将被重新压缩。`;
      } else {
        driversInvolved = [d1[0]];
        incidentDNFs.push(d1[0]);
        title = "SAFETY CAR";
        scene = `${d1[0]} 在高速弯失控撞上护墙，赛车停在赛道边并留下碎片。安全车出动。`;
      }
    } else {
      const d1 = weightedDriver411("incident");
      if (!d1) return null;
      driversInvolved = [d1[0]];
      incidentDNFs.push(d1[0]);
      title = "RED FLAG";
      scene =
        weather === "wet" || weather === "extreme"
          ? `${d1[0]} 在湿滑高速区失控发生严重事故。护墙与赛道需要检查，比赛立即红旗暂停。`
          : `${d1[0]} 发生高速事故，护墙需要维修。比赛控制出示红旗，所有赛车返回维修区。`;
    }
    return {
      kind: "control",
      controlType: type,
      stage,
      title,
      scene,
      weather,
      driversInvolved,
      incidentDNFs,
    };
  }

  function buildQueue411() {
    /* Patch 13.9: circuit events and standalone weather events are retired. Manual races only stop for Race Control. */
    const q = [];
    const rc = raceControlEvent411();
    if (rc) q.push(rc);
    return q;
  }

  function estimatePosition411() {
    const q = Number(state.weekend?.qualResult?.position || 12),
      m = Number(state.weekend?.positionModV411 || 0);
    return clamp411(q + m, 1, drivers.length);
  }
  function showNormalEvent411(ev) {
    showView("grandprix");
    state.weekend.pendingEvent = ev;
    const idx = state.weekend.eventIndexV411 || 0,
      total = state.weekend.eventQueueV411?.length || 1;
    document.getElementById("modalTitle").textContent =
      ev.kind === "weather" ? "天气变化 · 实时决策" : "正赛 · 实时决策";
    document.getElementById("modalBody").innerHTML =
      `<div class="eventcard"><div class="raceEventProgressV411">事件 ${idx + 1} / ${total} · ${stageLabel411(ev.stage)}</div>${ev.special ? '<span class="easter">SPECIAL EVENT</span>' : ""}<div class="kicker">LIVE RACE DECISION</div><h3>${ev.title}</h3><div class="eventscene">${ev.scene}</div>${ev.choices.map((c, i) => `<div class="eventchoice" onclick="resolveRaceEventV411(${i})"><b>${c.label}</b><span>${c.tag || "比赛决策"}</span><small>${c.desc}</small></div>`).join("")}</div>`;
    document.getElementById("overlay").classList.add("open");
  }
  function controlChoices411(ev) {
    const weather = ev.weather,
      wet = ["damp", "wet", "extreme"].includes(weather),
      late = ev.stage >= 2;
    if (ev.controlType === "VSC")
      return [
        {
          label: "立即进站",
          desc: "VSC 下进站时间损失更低。用赛道位置交换更新的轮胎。",
          tag: "低成本进站",
          quality: 85,
          posMod: Math.random() < 0.58 ? -1 : 0,
          risk: 0.035,
        },
        {
          label: "留在赛道",
          desc: "保持当前赛道位置，不改变原来的轮胎节奏。",
          tag: "保持位置",
          quality: 76,
          posMod: 0,
          risk: 0.02,
        },
      ];
    if (ev.controlType === "SC") {
      const arr = [
        {
          label: "安全车下进站换新胎",
          desc: "利用车阵减速完成一次低成本进站；可能暂时丢掉位置，但重启时轮胎更新。",
          tag: "进站",
          quality: 86,
          posMod: Math.random() < 0.52 ? -1 : 0,
          risk: 0.035,
        },
        {
          label: "留在赛道保住位置",
          desc: "避免现在进站，但安全车重启后会面对一批更新轮胎的赛车。",
          tag: "赛道位置",
          quality: 74,
          posMod: late ? 0 : 1,
          risk: 0.045,
        },
      ];
      if (wet)
        arr.push({
          label: "直接切换半雨胎",
          desc: "安全车给了一个便宜的湿地换胎窗口。",
          tag: "天气 + SC",
          quality: weather === "extreme" ? 80 : 90,
          posMod: -1,
          risk: 0.03,
          weatherDecision: true,
        });
      return arr;
    }
    if (wet)
      return [
        {
          label: "半雨胎重启",
          desc: "适合潮湿到普通湿地，重启阶段抓地更灵活。",
          tag: "红旗换胎",
          quality: weather === "extreme" ? 80 : 91,
          posMod: weather === "extreme" ? 0 : -1,
          restartTyre: "I",
        },
        {
          label: "WET 重启",
          desc: "积水严重时最安全；如果雨势没有达到极端水平会损失速度。",
          tag: "红旗换胎",
          quality: weather === "extreme" ? 92 : 75,
          posMod: weather === "extreme" ? -1 : 1,
          restartTyre: "W",
        },
        {
          label: "赌赛道快速变干",
          desc: "选择偏干胎设定等待干线。当前仍湿时风险非常高。",
          tag: "赌博",
          quality: 55,
          posMod: 2,
          risk: 0.22,
          dnfRisk: 0.025,
          restartTyre: "M",
        },
      ];
    return [
      {
        label: "SOFT 重启",
        desc: late
          ? "剩余距离较短，优先最大化重启后的抓地。"
          : "速度最高，但剩余距离较长时退化风险明显。",
        tag: "红旗换胎",
        quality: late ? 91 : 78,
        posMod: late ? -1 : 0,
        risk: late ? 0.035 : 0.085,
        restartTyre: "S",
      },
      {
        label: "MEDIUM 重启",
        desc: "最均衡的重新起步方案。",
        tag: "红旗换胎",
        quality: 84,
        posMod: 0,
        risk: 0.035,
        restartTyre: "M",
      },
      {
        label: "HARD 重启",
        desc: "保护剩余轮胎寿命，但重启前几圈抓地较弱。",
        tag: "红旗换胎",
        quality: 72,
        posMod: 1,
        risk: 0.025,
        restartTyre: "H",
      },
    ];
  }
  function showControl411(ev) {
    ensureRaceControlView411();
    const r = currentRace(),
      pos = estimatePosition411(),
      tyre = state.weekend.tyrePlanV410 || "—",
      choices = controlChoices411(ev);
    ev.choices = choices;
    const root = document.getElementById("rcContentV411"),
      crumb = document.getElementById("rcBreadcrumbV411");
    if (crumb)
      crumb.textContent = `ROUND ${String(state.round).padStart(2, "0")} · ${r?.[1] || ""}`;
    const cls =
        ev.controlType === "VSC"
          ? "vsc"
          : ev.controlType === "SC"
            ? "sc"
            : "red",
      flag =
        ev.controlType === "VSC"
          ? "VIRTUAL SAFETY CAR"
          : ev.controlType === "SC"
            ? "SAFETY CAR"
            : "RED FLAG";
    root.innerHTML = `<div class="raceControlHeroV411 ${cls}"><div class="raceControlFlagV411">${flag}</div><h1>${ev.title}</h1><p>${ev.scene}</p><div class="raceControlMetaV411"><div><span>比赛阶段</span><b>${stageLabel411(ev.stage)}</b></div><div><span>当前估算位置</span><b>P${pos}</b></div><div><span>赛道状态</span><b>${wxIcon411(ev.weather)} ${wxLabel411(ev.weather)}</b></div></div></div><div class="raceControlPanelV411"><h2>${ev.controlType === "RED" ? "比赛暂停 · 重新选择轮胎" : "比赛控制已介入"}</h2><p>${ev.controlType === "VSC" ? "车阵不会完全重新集结，但现在进站的时间损失更低。" : ev.controlType === "SC" ? "车阵正在被重新压缩，之前的时间差优势会大幅缩小。" : "红旗期间允许重新选择轮胎，重新起步后之前建立的时间差基本消失。"}</p><div class="raceControlChoicesV411">${choices.map((c, i) => `<div class="raceControlChoiceV411" onclick="resolveRaceControlV411(${i})"><b>${c.label}</b><small>${c.desc}</small><em>${c.tag}</em></div>`).join("")}</div></div>`;
    showView("racecontrolV411");
  }

  function nextEvent411() {
    state.weekend.decisionLockV411 = false;
    const q = state.weekend.eventQueueV411 || [],
      i = Number(state.weekend.eventIndexV411 || 0);
    if (i >= q.length) {
      finalizeRace411();
      return;
    }
    const ev = q[i];
    state.weekend.pendingEvent = ev;
    if (ev.kind === "control") showControl411(ev);
    else showNormalEvent411(ev);
  }
  function applyChoice411(ev, c) {
    let quality = Number(c.quality || 76),
      risk = Number(c.risk || 0.04),
      outcome = "执行顺利";
    const awa = Number(selected?.[5] || 75);
    risk = clamp411(risk - Math.max(0, awa - 80) * 0.0015, 0.01, 0.38);
    if (Math.random() < risk) {
      quality -= rnd411(7, 18);
      state.weekend.positionModV411 =
        Number(state.weekend.positionModV411 || 0) +
        Math.max(0, Number(c.posMod || 0)) +
        1;
      state.weekend.dnfRiskV411 =
        Number(state.weekend.dnfRiskV411 || 0) +
        Number(c.dnfRisk || 0) +
        risk * 0.035;
      outcome = "执行过程中付出额外时间";
    } else {
      state.weekend.positionModV411 =
        Number(state.weekend.positionModV411 || 0) + Number(c.posMod || 0);
      state.weekend.dnfRiskV411 =
        Number(state.weekend.dnfRiskV411 || 0) + Number(c.dnfRisk || 0);
    }
    state.weekend.eventQualitySumV411 =
      Number(state.weekend.eventQualitySumV411 || 0) +
      clamp411(quality, 30, 96);
    state.weekend.eventQualityCountV411 =
      Number(state.weekend.eventQualityCountV411 || 0) + 1;
    if (c.relation)
      state.teamRelation = clamp411(
        Number(state.teamRelation || 50) + Number(c.relation),
        0,
        100,
      );
    if (c.restartTyre) state.weekend.restartTyreV411 = c.restartTyre;
    if (c.weatherDecision && state.weekend.weatherV410) {
      state.weekend.weatherV410.decision = c.label;
      state.weekend.weatherV410.decisionRound = state.round;
    }
    const line = `${ev.title}：${c.label}（${outcome}）`;
    state.weekend.raceLogV411.push(line);
    state.weekend.lastDecision = {
      phase: "race",
      title: ev.title,
      choice: c.label,
      outcome,
    };
    return outcome;
  }
  window.resolveRaceEventV411 = function (i) {
    if (state.weekend.decisionLockV411) return;
    const ev = state.weekend.pendingEvent,
      c = ev?.choices?.[Number(i)];
    if (!ev || !c) return;
    state.weekend.decisionLockV411 = true;
    applyChoice411(ev, c);
    state.weekend.pendingEvent = null;
    closeOverlay();
    state.weekend.eventIndexV411++;
    try {
      autosave();
    } catch (_) {}
    setTimeout(nextEvent411, 80);
  };
  window.resolveRaceControlV411 = function (i) {
    if (state.weekend.decisionLockV411) return;
    const ev = state.weekend.pendingEvent,
      c = ev?.choices?.[Number(i)];
    if (!ev || !c) return;
    state.weekend.decisionLockV411 = true;
    applyChoice411(ev, c);
    state.weekend.pendingEvent = null;
    state.weekend.controlChaosV411 =
      Number(state.weekend.controlChaosV411 || 0) +
      (ev.controlType === "VSC" ? 0.35 : ev.controlType === "SC" ? 0.85 : 1.25);
    state.weekend.raceControlLogV411.push(
      `${ev.controlType} · ${ev.driversInvolved.join(" / ")} · ${c.label}`,
    );
    (ev.incidentDNFs || []).forEach((n) => {
      state.weekend.incidentDNFsV411[n] = {
        type: ev.controlType,
        stage: ev.stage,
      };
    });
    state.weekend.eventIndexV411++;
    try {
      autosave();
    } catch (_) {}
    setTimeout(nextEvent411, 80);
  };

  function startRace411() {
    if (!state.weekend?.qualResult) {
      renderQualifying();
      showView("qualifying");
      return false;
    }
    if (!state.weekend.tyrePlanV410) {
      alert("请先选择轮胎策略。");
      return false;
    }
    state.weekend.raceStrategy = "normal";
    if (
      state.weekend.playerDNSV29 &&
      typeof window.showPlayerDNSV29 === "function"
    ) {
      window.showPlayerDNSV29();
      return false;
    }
    if (
      !state.weekend.dnsCheckedV29 &&
      typeof window.dnsChanceV36 === "function"
    ) {
      state.weekend.dnsCheckedV29 = true;
      if (Math.random() < window.dnsChanceV36(selected)) {
        window.showPlayerDNSV29?.();
        return false;
      }
    }
    const base = baseTyreEffect411();
    state.weekend.tyrePlanEffectV410 = {
      pos: base.pos,
      risk: base.risk,
      note: base.note,
    };
    state.weekend.positionModV411 = base.pos;
    state.weekend.dnfRiskV411 = base.risk;
    state.weekend.eventQualitySumV411 = base.quality;
    state.weekend.eventQualityCountV411 = 1;
    state.weekend.controlChaosV411 = 0;
    state.weekend.raceLogV411 = [`轮胎策略：${base.note}`];
    state.weekend.raceControlLogV411 = [];
    state.weekend.incidentDNFsV411 = {};
    state.weekend.eventQueueV411 = buildQueue411();
    state.weekend.eventIndexV411 = 0;
    state.weekend.pendingPhase = "race";
    state.weekend.raceFlowV411 = true;
    try {
      autosave();
    } catch (_) {}
    nextEvent411();
    return true;
  }
  window.startRaceV411 = startRace411;

  const startPrev411 = window.startRacePhase || startRacePhase;
  window.startRacePhase = function (phase) {
    if (phase === "qual") return qualifyingDirect411();
    if (phase === "race") return startRace411();
    return startPrev411.apply(this, arguments);
  };
  try {
    startRacePhase = window.startRacePhase;
  } catch (_) {}

  function finalizeRace411() {
    showView("grandprix");
    const eventQ = state.weekend.eventQualityCountV411
        ? state.weekend.eventQualitySumV411 /
          state.weekend.eventQualityCountV411
        : 72,
      luck = Math.random() * 100;
    let sc = computeScore(selected, "race", eventQ, luck, false),
      field = (window.simulateAIFieldV10 || simulateAIFieldV10)("race", false);
    field.forEach((x) => (x.strategy = "normal"));
    const chaos = Number(state.weekend.controlChaosV411 || 0);
    if (chaos)
      field.forEach((x) => {
        x.total += (Math.random() - 0.5) * chaos * 2.4;
      });
    const mine = {
      name: selected[0],
      team: selected[1],
      total: sc.total,
      mine: true,
      strategy: "normal",
      dnf: false,
    };
    field.push(mine);
    field.sort((a, b) => b.total - a.total);
    const move = Number(state.weekend.positionModV411 || 0);
    let idx = field.findIndex((x) => x.mine);
    if (idx >= 0 && move) {
      const target = clamp411(idx + move, 0, field.length - 1),
        [m] = field.splice(idx, 1);
      field.splice(target, 0, m);
    }
    Object.entries(state.weekend.incidentDNFsV411 || {}).forEach(
      ([name, info]) => {
        const x = field.find((v) => v.name === name);
        if (x) {
          x.dnf = true;
          x.status = "DNF";
          x.retirementLap = info.stage === 2 ? 44 : info.stage === 1 ? 26 : 10;
          x.total = -100 + x.retirementLap / 100;
        }
      },
    );
    state.weekend.dnfRisk = Number(state.weekend.dnfRiskV411 || 0);
    if (typeof applyAttritionV10 === "function") applyAttritionV10(field);
    field.forEach((x, i) => (x.position = i + 1));
    const me = field.find((x) => x.mine);
    me.field = field.map((x) => ({ ...x }));
    me.note = (state.weekend.raceLogV411 || []).join("；");
    me.choice = state.weekend.lastDecision?.choice || "轮胎策略";
    me.eventTitle = state.weekend.lastDecision?.title || "正赛策略";
    me.reportStoryV23 = me.reportStoryV23 || {
      pace: "neutral",
      safety: (state.weekend.raceControlLogV411 || []).length
        ? "control"
        : "none",
      text: me.note,
    };
    state.weekend.pendingPhase = null;
    state.weekend.pendingEvent = null;
    completeRaceResultV10(field, me, false);
  }
  window.finalizeRaceV411 = finalizeRace411;

  const renderGPPrev411 = window.renderGrandPrix || renderGrandPrix;
  window.renderGrandPrix = function () {
    const r = renderGPPrev411.apply(this, arguments);
    const strategies = document.getElementById("raceStrategies");
    if (strategies) strategies.style.display = "none";
    const oldTitle = document.getElementById("raceApproachTitleV410");
    if (oldTitle) oldTitle.style.display = "none";
    const title = document.querySelector("#grandprix .stageBrief h2");
    if (title) title.textContent = "选择轮胎策略";
    const brief = document.getElementById("gpBrief");
    if (brief)
      brief.textContent = `从 P${state.weekend?.qualResult?.position || "-"} 发车。正赛不再选择“激进 / 正常 / 保守”，你的主要控制来自基础轮胎策略与 Race Control 决策。天气不再弹出独立事件，而是作为轮胎匹配与磨损的后台条件直接结算。`;
    const btn = document.getElementById("raceStart");
    if (btn) {
      btn.disabled = !state.weekend.tyrePlanV410;
      btn.textContent = state.weekend.tyrePlanV410
        ? "开始正赛 →"
        : "请先选择轮胎策略";
      btn.onclick = startRace411;
    }
    let n = document.getElementById("raceNoApproachV411");
    if (!n && btn) {
      n = document.createElement("div");
      n.id = "raceNoApproachV411";
      n.className = "raceNoApproachV411";
      n.textContent =
        "比赛过程中只保留 Race Control：VSC、Safety Car 或红旗会在需要时进入独立决策界面。天气不会再单独弹出事件。";
      btn.insertAdjacentElement("beforebegin", n);
    }
    return r;
  };
  try {
    renderGrandPrix = window.renderGrandPrix;
  } catch (_) {}

  const resultPrev411 = window.renderWeekendResult || renderWeekendResult;
  window.renderWeekendResult = function () {
    const r = resultPrev411.apply(this, arguments);
    try {
      const host = document.querySelector("#weekendresult .resultSummary");
      if (!host || !state.weekend?.raceResult) return r;
      let box = document.getElementById("resultControlV411");
      if (!box) {
        box = document.createElement("div");
        box.id = "resultControlV411";
        box.className = "resultControlV411";
        host.appendChild(box);
      }
      const logs = state.weekend.raceControlLogV411 || [],
        race = state.weekend.raceLogV411 || [];
      box.innerHTML = `<div class="rwTitle">RACE CONTROL / KEY MOMENTS</div>${logs.length ? logs.map((x) => `<div class="rowV411">${x}</div>`).join("") : '<div class="rowV411">本场没有触发 VSC / Safety Car / 红旗。</div>'}${race
        .slice(-3)
        .map((x) => `<div class="rowV411">${x}</div>`)
        .join("")}`;
    } catch (e) {
      console.warn("v411 result", e);
    }
    return r;
  };
  try {
    renderWeekendResult = window.renderWeekendResult;
  } catch (_) {}

  /* Keep automatic/full-season simulation intact, but remove obsolete player-facing strategy language. */
  try {
    const btn = document.getElementById("qualStart");
    if (btn) btn.onclick = qualifyingDirect411;
  } catch (_) {}
  const snapPrev411 = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = snapPrev411.apply(this, arguments);
    s.version = 412;
    s.majorVersion = "4.0";
    s.featureSet = "v40-weather-profile-patch12";
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
})();

/* v40-patch13-strategy-review-script */

(() => {
  const clamp413 = (v, a, b) => Math.max(a, Math.min(b, v));
  const WX413 = {
    dry: "干地",
    cloud: "多云",
    damp: "潮湿",
    wet: "湿地",
    extreme: "积水",
  };
  const STAGE413 = ["起步阶段", "比赛中段", "比赛末段"];
  const TYRE_PLAN413 = {
    balanced: { name: "标准一停", route: "MEDIUM → HARD" },
    attack: { name: "两停进攻", route: "SOFT → MEDIUM → SOFT" },
    reverse: { name: "反向策略", route: "HARD → MEDIUM" },
    flex: { name: "灵活一停", route: "MEDIUM → INTERMEDIATE" },
    rain: { name: "雨势优先", route: "INTERMEDIATE → WET" },
  };

  function tyrePlan413() {
    const id = state?.weekend?.tyrePlanV410 || "";
    const p = TYRE_PLAN413[id] || { name: "基础策略", route: "—" };
    return { id, ...p };
  }
  function initReview413(force = false) {
    if (!state?.weekend) return null;
    const round = Number(state.round || 0),
      race = (() => {
        try {
          return currentRace()?.[1] || "";
        } catch (_) {
          return "";
        }
      })();
    if (
      !force &&
      state.weekend.strategyReviewV413?.round === round &&
      state.weekend.strategyReviewV413?.race === race
    )
      return state.weekend.strategyReviewV413;
    const eff = state.weekend.tyrePlanEffectV410 || {},
      p = tyrePlan413();
    const review = {
      version: 413,
      round,
      race,
      plan: p,
      base: {
        quality:
          Number(
            state.weekend.eventQualityCountV411
              ? state.weekend.eventQualitySumV411
              : 0,
          ) ||
          Number(eff.quality || 0) ||
          72,
        posDelta: Number(eff.pos || 0),
        risk: Number(eff.risk || 0),
        note: String(eff.note || ""),
      },
      decisions: [],
      createdAt: Date.now(),
    };
    // When called after Patch 11 has initialized the race, its event-quality accumulator contains the tyre-plan quality as the first entry.
    if (Number(state.weekend.eventQualityCountV411 || 0) === 1)
      review.base.quality = Number(state.weekend.eventQualitySumV411 || 72);
    state.weekend.strategyReviewV413 = review;
    return review;
  }

  function verdict413(q, failed = false) {
    if (failed)
      return {
        label: q >= 76 ? "判断合理 · 执行受损" : "执行失误",
        cls: "bad",
      };
    if (q >= 89) return { label: "关键决策", cls: "great" };
    if (q >= 82) return { label: "优秀", cls: "good" };
    if (q >= 74) return { label: "合理", cls: "mid" };
    if (q >= 64) return { label: "效果一般", cls: "mid" };
    return { label: "明显失误", cls: "bad" };
  }
  function impact413(pos) {
    pos = Number(pos || 0);
    if (pos <= -2) return `预计净赚 ${Math.abs(pos)} 位`;
    if (pos === -1) return "预计净赚 1 位";
    if (pos === 0) return "位置影响接近中性";
    if (pos === 1) return "预计损失 1 位";
    return `预计损失 ${pos} 位`;
  }
  function decisionComment413(d) {
    const failed = !!d.failed,
      q = Number(d.quality || 0),
      pos = Number(d.posDelta || 0),
      label = String(d.choice || "");
    if (failed)
      return `选择本身${q >= 76 ? "并非明显错误" : "质量偏低"}，但执行过程中付出了额外时间。${impact413(pos)}。`;
    if (d.kind === "weather") {
      if (/半雨胎/.test(label) && q >= 82)
        return `对赛道变湿的响应及时，踩中了干胎与半雨胎的 crossover 窗口。${impact413(pos)}。`;
      if (/继续使用干胎/.test(label) && q < 70)
        return `实际雨势已经让干胎窗口快速关闭，这次赌博代价较高。${impact413(pos)}。`;
      if (/换回干胎/.test(label) && q >= 82)
        return `干线形成后及时回到干胎，避免半雨胎继续过热。${impact413(pos)}。`;
      if (/观察|再等/.test(label))
        return `选择延后判断，减少误判风险，但也把一部分 crossover 收益留给了对手。${impact413(pos)}。`;
    }
    if (d.controlType === "VSC") {
      if (/进站/.test(label))
        return `抓住 VSC 下较低的进站时间损失完成换胎，是一次典型的低成本窗口利用。${impact413(pos)}。`;
      return `选择保留赛道位置，没有主动利用 VSC 的便宜进站窗口。${impact413(pos)}。`;
    }
    if (d.controlType === "SC") {
      if (/半雨胎/.test(label))
        return `安全车压缩车阵的同时完成湿地换胎，天气与 Race Control 两个窗口被合并利用。${impact413(pos)}。`;
      if (/进站/.test(label))
        return `利用安全车降低进站代价，重启时换取更新的轮胎。${impact413(pos)}。`;
      return `优先保住赛道位置，但重启后需要承受旧胎对新胎的压力。${impact413(pos)}。`;
    }
    if (d.controlType === "RED") {
      if (/SOFT/.test(label) && q >= 84)
        return `剩余距离适合软胎，红旗后的重新起步抓地被最大化。${impact413(pos)}。`;
      if (/半雨胎/.test(label) && q >= 84)
        return `红旗期间直接切入适合当前湿度的半雨胎，重新起步方案匹配赛道状态。${impact413(pos)}。`;
      if (/WET/.test(label) && q >= 84)
        return `积水条件下选择全雨胎，优先保证重新起步阶段的抓地与稳定。${impact413(pos)}。`;
      if (/赌/.test(label))
        return `红旗给了免费换胎机会，但你选择继续押注赛道变化，属于高风险判断。${impact413(pos)}。`;
      return `红旗让原有时间差基本清零，这次重新选胎决定了重启阶段的竞争力。${impact413(pos)}。`;
    }
    if (/undercut|提前进站|主动提前/.test(label.toLowerCase()))
      return `主动寻找 undercut 窗口，用新胎与干净空气交换赛道位置。${impact413(pos)}。`;
    if (/进攻/.test(label) && q >= 82)
      return `抓住了当前攻防窗口，速度收益足以覆盖额外风险。${impact413(pos)}。`;
    if (/延长|保护/.test(label))
      return `把策略偏移留到后半程，短期圈速让位于轮胎寿命与窗口弹性。${impact413(pos)}。`;
    return `${q >= 82 ? "决策与当时比赛环境匹配。" : q >= 74 ? "选择总体合理，没有制造明显额外损失。" : "这次选择没有完全兑现预期。"}${impact413(pos)}。`;
  }

  function recordDecision413(ev, c, before) {
    const review = initReview413(false);
    if (!review || !ev || !c) return;
    const afterQ = Number(state.weekend.eventQualitySumV411 || 0),
      afterPos = Number(state.weekend.positionModV411 || 0),
      afterRisk = Number(state.weekend.dnfRiskV411 || 0);
    const quality = clamp413(afterQ - Number(before.q || 0), 30, 96),
      posDelta = afterPos - Number(before.pos || 0),
      riskDelta = Math.max(0, afterRisk - Number(before.risk || 0));
    const outcome = String(state.weekend.lastDecision?.outcome || "执行顺利"),
      failed = !/执行顺利/.test(outcome);
    const rec = {
      kind: ev.kind || "track",
      controlType: ev.controlType || "",
      stage: Number(ev.stage || 0),
      title: String(ev.title || "比赛决策"),
      choice: String(c.label || ""),
      quality,
      posDelta,
      riskDelta,
      outcome,
      failed,
      weather: ev.weather || "",
      tag: c.tag || "",
    };
    rec.comment = decisionComment413(rec);
    review.decisions.push(rec);
  }

  const oldRaceDecision413 = window.resolveRaceEventV411;
  if (typeof oldRaceDecision413 === "function")
    window.resolveRaceEventV411 = function (i) {
      const ev = state?.weekend?.pendingEvent,
        c = ev?.choices?.[Number(i)],
        before = {
          q: Number(state?.weekend?.eventQualitySumV411 || 0),
          pos: Number(state?.weekend?.positionModV411 || 0),
          risk: Number(state?.weekend?.dnfRiskV411 || 0),
        };
      const out = oldRaceDecision413.apply(this, arguments);
      try {
        recordDecision413(ev, c, before);
        autosave?.();
      } catch (e) {
        console.warn("strategy review race decision", e);
      }
      return out;
    };
  const oldControlDecision413 = window.resolveRaceControlV411;
  if (typeof oldControlDecision413 === "function")
    window.resolveRaceControlV411 = function (i) {
      const ev = state?.weekend?.pendingEvent,
        c = ev?.choices?.[Number(i)],
        before = {
          q: Number(state?.weekend?.eventQualitySumV411 || 0),
          pos: Number(state?.weekend?.positionModV411 || 0),
          risk: Number(state?.weekend?.dnfRiskV411 || 0),
        };
      const out = oldControlDecision413.apply(this, arguments);
      try {
        recordDecision413(ev, c, before);
        autosave?.();
      } catch (e) {
        console.warn("strategy review control decision", e);
      }
      return out;
    };

  const oldStartRace413 = window.startRaceV411;
  function startRaceV413() {
    const out =
      typeof oldStartRace413 === "function"
        ? oldStartRace413.apply(this, arguments)
        : false;
    try {
      if (out !== false && state?.weekend?.raceFlowV411) initReview413(true);
    } catch (e) {
      console.warn("strategy review init", e);
    }
    return out;
  }
  window.startRaceV413 = startRaceV413;
  const oldStartPhase413 = window.startRacePhase;
  window.startRacePhase = function (phase) {
    if (phase === "race") return startRaceV413();
    return oldStartPhase413.apply(this, arguments);
  };
  try {
    startRacePhase = window.startRacePhase;
  } catch (_) {}

  function planComment413(review) {
    const q = Number(review?.base?.quality || 72),
      note = String(review?.base?.note || ""),
      wx = state?.weekend?.weatherV410?.type || "dry",
      id = review?.plan?.id;
    if (id === "balanced" && wx === "dry")
      return "标准一停与实际干地背景匹配，方案没有制造多余的进站成本。";
    if (id === "attack" && q >= 79)
      return "两停方案兑现了峰值速度，赛车的轮胎管理足以支撑额外停站。";
    if (id === "reverse" && q >= 77)
      return "反向策略成功把机会留到后半程，为安全车或轮胎差制造了弹性。";
    if (id === "flex" && wx !== "dry")
      return "赛前为天气变化预留半雨胎窗口，基础方案与实际干湿变化高度匹配。";
    if (id === "rain" && wx === "wet")
      return "雨战预案与持续湿地吻合，减少了临时重构策略的损失。";
    if (q < 65)
      return "赛前基础轮胎方案与实际比赛环境明显不匹配，开局就承担了额外策略成本。";
    return note || "基础轮胎方案总体可用，后续结果主要由临场窗口决定。";
  }
  function computeReview413() {
    const review = state?.weekend?.strategyReviewV413;
    if (!review) return null;
    const decisions = Array.isArray(review.decisions) ? review.decisions : [],
      values = [
        Number(review.base?.quality || 72),
        ...decisions.map((d) => Number(d.quality || 72)),
      ];
    const avg = values.reduce((a, b) => a + b, 0) / Math.max(1, values.length),
      totalPos = Number(
        state.weekend.positionModV411 ?? review.base?.posDelta ?? 0,
      ),
      failed = decisions.filter((d) => d.failed).length;
    let score = avg + clamp413(-totalPos * 2.5, -12, 12) - failed * 1.5;
    score = clamp413(score, 38, 97);
    let grade =
      score >= 90
        ? "S"
        : score >= 82
          ? "A"
          : score >= 73
            ? "B"
            : score >= 64
              ? "C"
              : "D";
    const best =
      [...decisions].sort(
        (a, b) =>
          b.quality - a.quality || (a.posDelta || 0) - (b.posDelta || 0),
      )[0] || null;
    const worst =
      [...decisions].sort(
        (a, b) =>
          a.quality - b.quality || (b.posDelta || 0) - (a.posDelta || 0),
      )[0] || null;
    const extraRisk = Number(state.weekend.dnfRiskV411 || 0),
      rr = state.weekend.raceResult;
    let summary = {
      S: "赛前方案与临场判断几乎都踩中了正确窗口，策略明显创造了额外赛道收益。",
      A: "大部分关键判断都正确，策略执行为最终成绩提供了清晰帮助。",
      B: "整体策略合理，没有重大失误；成绩更多由赛车基础速度与正常比赛波动决定。",
      C: "至少一个关键窗口处理不理想，策略层面留下了可以追回的位置。",
      D: "轮胎或临场判断与实际比赛环境严重错位，策略成为本场主要损失来源之一。",
    }[grade];
    if (rr?.dnf) {
      summary += " 本场最终退赛不会被自动算作策略失败。";
      if (extraRisk > 0.045)
        summary +=
          " 不过你的选择确实叠加了较明显的额外退赛风险；实际退赛仍同时受到可靠性与随机事故影响。";
      else summary += " 当前记录的额外策略风险不高，退赛更不能简单归因于策略。";
    }
    return {
      score,
      grade,
      avg,
      totalPos,
      failed,
      best,
      worst,
      summary,
      extraRisk,
    };
  }
  function escape413(s) {
    return String(s ?? "").replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[m],
    );
  }
  function weatherLine413() {
    const wx = state?.weekend?.weatherV410;
    if (!wx?.actual) return "—";
    return wx.actual.map((w) => WX413[w] || w).join(" → ");
  }
  function strategyReviewHTML413() {
    const review = state?.weekend?.strategyReviewV413;
    if (!review)
      return `<div class="strategyAutoV413"><b>STRATEGY REVIEW</b><br>本场没有可用于复盘的人工策略记录。若为一键模拟，系统不会生成 S–D 策略评分。</div>`;
    const calc = computeReview413();
    if (!calc) return "";
    const baseVerdict = verdict413(Number(review.base?.quality || 72), false),
      baseRec = {
        kind: "base",
        choice: `${review.plan?.name || "基础策略"} · ${review.plan?.route || "—"}`,
        quality: Number(review.base?.quality || 72),
        posDelta: Number(review.base?.posDelta || 0),
        failed: false,
      };
    const baseComment = planComment413(review),
      all = [
        {
          ...baseRec,
          title: "赛前轮胎策略",
          stage: -1,
          comment: baseComment,
          verdict: baseVerdict,
        },
        ...(review.decisions || []).map((d) => ({
          ...d,
          verdict: verdict413(d.quality, d.failed),
        })),
      ];
    const best = calc.best
        ? `${calc.best.title} · ${calc.best.choice}`
        : "赛前基础方案",
      worst =
        calc.worst && calc.worst.quality < 72
          ? `${calc.worst.title} · ${calc.worst.choice}`
          : "无明显关键失误";
    const net =
      calc.totalPos < 0
        ? `预计 +${Math.abs(calc.totalPos)} 位`
        : calc.totalPos > 0
          ? `预计 -${calc.totalPos} 位`
          : "约 0 位";
    return `<div class="strategyReviewHeadV413"><div class="strategyGradeV413"><span>STRATEGY</span><b>${calc.grade}</b></div><div><div class="strategyReviewLabelV413">STRATEGY REVIEW · 策略复盘</div><h3>${calc.grade === "S" ? "战略大师" : calc.grade === "A" ? "执行优秀" : calc.grade === "B" ? "基本合理" : calc.grade === "C" ? "存在失误" : "策略崩盘"}</h3><p>${escape413(calc.summary)}</p></div></div><div class="strategyReviewStatsV413"><div><span>预计策略净影响</span><b>${net}</b></div><div><span>最佳决策</span><b>${escape413(best)}</b></div><div><span>关键失误</span><b>${escape413(worst)}</b></div></div><div class="strategyReviewBodyV413"><div class="strategyReviewLabelV413">DECISION BY DECISION</div>${all.map((d, idx) => `<div class="strategyDecisionV413"><div class="strategyDecisionMarkV413">${idx === 0 ? "PLAN" : d.controlType ? escape413(d.controlType) : `S${Number(d.stage || 0) + 1}`}</div><div class="strategyDecisionCopyV413"><b>${escape413(d.title)} · ${escape413(d.choice)}</b><small>${escape413(d.comment || "")}${idx === 0 ? ` 天气过程：${escape413(weatherLine413())}。` : ""}</small></div><span class="strategyDecisionVerdictV413 ${d.verdict.cls}">${escape413(d.verdict.label)}</span></div>`).join("")}<div class="strategySummaryV413"><b>评分说明：</b>策略等级依据基础轮胎方案、每次临场选择的实际执行质量、预计位置收益/损失与执行失败情况综合计算。最终名次仍同时受到赛车性能、车手能力、发车位、运气和退赛等因素影响，因此这里显示的是“策略贡献”，不是把全部名次变化都归因于策略。</div></div>`;
  }
  function renderReview413() {
    const host = document.querySelector("#weekendresult .resultSummary");
    if (!host || !state?.weekend?.raceResult) return;
    let box = document.getElementById("strategyReviewV413");
    if (!box) {
      box = document.createElement("div");
      box.id = "strategyReviewV413";
      box.className = "strategyReviewV413";
      host.appendChild(box);
    }
    box.innerHTML = strategyReviewHTML413();
  }
  const oldRenderResult413 = window.renderWeekendResult || renderWeekendResult;
  window.renderWeekendResult = function () {
    const r = oldRenderResult413.apply(this, arguments);
    try {
      renderReview413();
    } catch (e) {
      console.warn("strategy review render", e);
    }
    return r;
  };
  try {
    renderWeekendResult = window.renderWeekendResult;
  } catch (_) {}

  const oldRenderGP413 = window.renderGrandPrix || renderGrandPrix;
  window.renderGrandPrix = function () {
    const r = oldRenderGP413.apply(this, arguments);
    try {
      const btn = document.getElementById("raceStart");
      if (btn) btn.onclick = startRaceV413;
    } catch (_) {}
    return r;
  };
  try {
    renderGrandPrix = window.renderGrandPrix;
  } catch (_) {}

  const oldSnap413 = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = oldSnap413.apply(this, arguments);
    s.version = 413;
    s.majorVersion = "4.0";
    s.featureSet = "v40-strategy-review-patch13";
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
})();

/* v40-patch131-quick-sim-script */

(() => {
  function resetManualRaceStateV4131() {
    if (!state?.weekend) return;
    state.weekend.strategyReviewV413 = null;
    state.weekend.raceFlowV411 = false;
    state.weekend.pendingPhase = null;
    state.weekend.pendingEvent = null;
    state.weekend.eventQueueV411 = [];
    state.weekend.eventIndexV411 = 0;
    state.weekend.raceLogV411 = [];
    state.weekend.raceControlLogV411 = [];
    state.weekend.incidentDNFsV411 = {};
    state.weekend.positionModV411 = 0;
    state.weekend.dnfRiskV411 = 0;
    state.weekend.eventQualitySumV411 = 0;
    state.weekend.eventQualityCountV411 = 0;
    state.weekend.controlChaosV411 = 0;
    state.weekend.quickSimV4131 = true;
  }

  window.quickSimRaceV4131 = function (ev) {
    try {
      ev?.preventDefault?.();
      ev?.stopPropagation?.();
    } catch (_) {}
    if (!selected) return false;
    try {
      closeOverlay?.();
    } catch (_) {}
    if (state?.weekend?.raceResult) {
      try {
        renderWeekendResult();
        showView("weekendresult");
      } catch (_) {}
      return true;
    }
    try {
      if (typeof ensureStateV14 === "function") ensureStateV14();
      else if (typeof ensureStateV10 === "function") ensureStateV10();
    } catch (_) {}
    try {
      if (typeof ensureSprintStateV12 === "function") ensureSprintStateV12();
    } catch (_) {}
    if (!state?.weekend) return false;
    resetManualRaceStateV4131();

    /* Sprint weekends: silently finish Sprint first so the button always lands on the GP result. */
    try {
      if (
        currentRace?.()?.[4] &&
        !state.weekend.sprintResult &&
        typeof simulateSprintFieldV12 === "function"
      ) {
        state.weekend.sprintStrategy = "normal";
        const sf = simulateSprintFieldV12(true);
        if (sf?.length) {
          state.weekend.sprintField = sf;
          state.weekend.sprintResult = {
            ...sf.find((x) => x.mine),
            field: sf.map((x) => ({ ...x })),
          };
          if (typeof applySprintPointsV12 === "function")
            applySprintPointsV12(sf);
        }
      }
    } catch (e) {
      console.warn("v4131 sprint quick sim", e);
    }

    /* Preserve an already-completed qualifying session; otherwise calculate it neutrally. */
    try {
      if (!state.weekend.qualResult) {
        state.weekend.qualStrategy = "normal";
        const qField = simulateDirectSessionV10("qual");
        state.weekend.qualField = qField;
        state.weekend.qualResult = qField.find((x) => x.mine);
        if (
          state.weekend.qualResult?.position === 1 &&
          state.driverSeasonStats?.[selected[0]]
        )
          state.driverSeasonStats[selected[0]].poles++;
      }
    } catch (e) {
      console.warn("v4131 qualifying quick sim", e);
      return false;
    }

    try {
      state.weekend.raceStrategy = "normal";
      const rField = simulateDirectSessionV10("race");
      const mine = rField.find((x) => x.mine || x.name === selected[0]);
      if (!mine) return false;
      mine.mine = true;
      mine.field = rField.map((x) => ({ ...x }));
      mine.note = "";
      mine.choice = "";
      mine.eventTitle = "一键模拟比赛";
      mine.quickSimV4131 = true;
      completeRaceResultV10(rField, mine, true);
      try {
        autosave?.();
      } catch (_) {}
      /* completeRaceResultV10 already transitions; this is a safety net for older browser timing. */
      setTimeout(() => {
        try {
          renderWeekendResult();
          showView("weekendresult");
        } catch (_) {}
      }, 40);
      return true;
    } catch (e) {
      console.warn("v4131 race quick sim", e);
      return false;
    }
  };

  function ensureQuickButtonV4131() {
    const card = document.getElementById("raceWeekendLaunchV405");
    if (!card) return null;
    let btn = document.getElementById("raceQuickSimV4131");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "raceQuickSimV4131";
      btn.type = "button";
      btn.textContent = "一键模拟比赛";
      btn.onclick = window.quickSimRaceV4131;
      const bottom = card.querySelector(".raceLaunchBottomV405"),
        go = card.querySelector(".raceLaunchGoV405");
      if (bottom) bottom.insertBefore(btn, go || null);
    }
    const done = !!state?.weekend?.raceResult;
    btn.textContent = done ? "查看比赛结果" : "一键模拟比赛";
    btn.classList.toggle("resultReady", done);
    btn.onclick = window.quickSimRaceV4131;
    return btn;
  }
  window.ensureQuickButtonV4131 = ensureQuickButtonV4131;

  const renderHubPrev131 = window.renderHub || renderHub;
  window.renderHub = function () {
    const out = renderHubPrev131.apply(this, arguments);
    try {
      ensureQuickButtonV4131();
    } catch (_) {}
    return out;
  };
  try {
    renderHub = window.renderHub;
  } catch (_) {}

  const syncPrev131 = window.syncRaceLaunchV405;
  if (typeof syncPrev131 === "function")
    window.syncRaceLaunchV405 = function () {
      const out = syncPrev131.apply(this, arguments);
      try {
        ensureQuickButtonV4131();
      } catch (_) {}
      return out;
    };

  const snapPrev131 = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = snapPrev131.apply(this, arguments);
    s.version = 4131;
    s.majorVersion = "4.0";
    s.featureSet = "v40-strategy-review-patch13.1-quick-sim";
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
  setTimeout(() => {
    if (selected) {
      try {
        ensureQuickButtonV4131();
      } catch (_) {}
    }
  }, 0);
})();

/* v40-patch132-custom-tyre-script */

(() => {
  const TYRES132 = {
    S: { name: "SOFT", short: "软胎", cls: "soft" },
    M: { name: "MEDIUM", short: "中性胎", cls: "medium" },
    H: { name: "HARD", short: "硬胎", cls: "hard" },
    I: { name: "INTERMEDIATE", short: "半雨胎", cls: "inter" },
    W: { name: "WET", short: "全雨胎", cls: "wet" },
  };
  const LEGACY_ROUTE132 = {
    balanced: ["M", "H"],
    attack: ["S", "M"],
    reverse: ["H", "M"],
    flex: ["M", "I"],
    rain: ["I", "W"],
  };
  const clamp132 = (v, a, b) => Math.max(a, Math.min(b, v));
  const wetCode132 = (c) => c === "I" || c === "W";
  const dryCode132 = (c) => c === "S" || c === "M" || c === "H";
  const routeLabel132 = (r) =>
    (r || []).map((c) => TYRES132[c]?.name || c || "—").join(" → ");
  const routeValid132 = (r) =>
    Array.isArray(r) && r.length === 2 && r[0] && r[1] && r[0] !== r[1];
  const weather132 = () => {
    try {
      return window.ensureWeatherV410?.() || state.weekend?.weatherV410;
    } catch (_) {
      return null;
    }
  };
  const tyreMgmt132 = () =>
    Number(teams?.[selected?.[1]]?.parts?.["轮胎管理"] || 65);
  const tyreDemand132 = () => {
    try {
      return Number(currentDemandV10("race", state.round)?.[4] || 20);
    } catch (_) {
      return 20;
    }
  };
  const qPos132 = () => Number(state?.weekend?.qualResult?.position || 12);

  function migrateRoute132() {
    if (!state?.weekend) return [null, null];
    if (
      Array.isArray(state.weekend.tyreCustomV4132) &&
      state.weekend.tyreCustomV4132.length === 2
    )
      return state.weekend.tyreCustomV4132;
    const old = state.weekend.tyrePlanV410;
    if (old && LEGACY_ROUTE132[old])
      state.weekend.tyreCustomV4132 = [...LEGACY_ROUTE132[old]];
    else state.weekend.tyreCustomV4132 = [null, null];
    return state.weekend.tyreCustomV4132;
  }

  function recommend132() {
    const wx = weather132() || {},
      f = wx.forecast || ["dry", "dry", "dry"],
      tm = tyreMgmt132(),
      td = tyreDemand132(),
      qp = qPos132();
    const wetish = f.some((x) => ["damp", "wet", "extreme"].includes(x)),
      startsWet = ["damp", "wet", "extreme"].includes(f[0]),
      endsDry = ["dry", "cloud"].includes(f[2]),
      severe =
        f.includes("extreme") || f.filter((x) => x === "wet").length >= 2;
    if (wetish) {
      if (startsWet && endsDry)
        return {
          route: ["I", "M"],
          reason:
            "预报起步湿滑但后段存在干线机会，先用半雨胎控制风险，再切回中性胎。",
        };
      if (startsWet)
        return {
          route: severe ? ["I", "W"] : ["I", "M"],
          reason: severe
            ? "预报存在强降雨/积水风险，半雨胎起步后为全雨胎保留升级空间。"
            : "湿地起步但雨势未必持续，半雨胎起步并保留转干胎的弹性。",
        };
      return {
        route: ["M", "I"],
        reason:
          "预报显示比赛由干转湿，中性胎起步能保留正常前段速度，降雨形成后再切半雨胎。",
      };
    }
    if (qp > 10 && tm >= 68 && td < 23)
      return {
        route: ["H", "M"],
        reason:
          "发车位置靠后，硬胎拉长第一段更容易等待安全车或制造轮胎差，后段再切中性胎。",
      };
    if (td <= 17 && tm >= 76)
      return {
        route: ["S", "M"],
        reason:
          "本场轮胎负荷较低且赛车轮胎管理较好，可以用软胎争取起步阶段，再用中性胎完成主要长距离。",
      };
    if (td >= 22 || tm < 68)
      return {
        route: ["M", "H"],
        reason: "本场长距离轮胎负荷偏高，中性胎接硬胎是更稳的两段方案。",
      };
    return {
      route: ["M", "H"],
      reason:
        "当前赛道与赛车没有明显偏向，工程师优先推荐中性胎接硬胎的标准一停思路。",
    };
  }

  window.selectTyreStintV4132 = function (stint, code) {
    if (!state?.weekend) return;
    const r = [...migrateRoute132()];
    r[Number(stint)] = code;
    state.weekend.tyreCustomV4132 = r;
    state.weekend.tyrePlanV410 = routeValid132(r) ? "custom" : null;
    try {
      autosave?.();
    } catch (_) {}
    try {
      renderGrandPrix();
    } catch (_) {
      renderBuilder132();
    }
  };
  window.applyEngineerTyreV4132 = function () {
    if (!state?.weekend) return;
    state.weekend.tyreCustomV4132 = [...recommend132().route];
    state.weekend.tyrePlanV410 = "custom";
    try {
      autosave?.();
    } catch (_) {}
    renderGrandPrix();
  };

  function renderBuilder132() {
    if (!state?.weekend?.qualResult) return;
    const host = document.getElementById("tyreStrategyV410"),
      btn = document.getElementById("raceStart");
    if (!host) return;
    const r = migrateRoute132(),
      valid = routeValid132(r),
      rec = recommend132();
    state.weekend.tyrePlanV410 = valid ? "custom" : null;
    const codes = ["S", "M", "H", "I", "W"];
    const stint = (idx, label) =>
      `<div class="customTyreStintV4132"><span>${label}</span><div class="customTyreChoicesV4132">${codes.map((c) => `<button type="button" class="customTyreChipV4132 ${TYRES132[c].cls} ${r[idx] === c ? "selected" : ""}" onclick="selectTyreStintV4132(${idx},'${c}')">${TYRES132[c].name}</button>`).join("")}</div></div>`;
    host.innerHTML = `<div class="raceStrategyTitleV410"><b>自定义轮胎策略</b><span>选择基础轮胎路线；天气不再弹出事件，SC / 红旗仍可能改变比赛节奏</span></div><div class="customTyreBuilderV4132"><div class="customTyreStintsV4132">${stint(0, "STINT 1 · 发车轮胎")}${stint(1, "STINT 2 · 计划第二套")}</div><div class="customTyreRouteV4132"><b>当前计划：</b>${valid ? routeLabel132(r) : "请选择两种不同的轮胎"}</div>${!valid && r[0] && r[1] && r[0] === r[1] ? '<div class="customTyreWarnV4132">基础计划需要选择两个不同的轮胎配方。</div>' : ""}<div class="engineerRecV4132"><div><span>ENGINEER RECOMMENDATION</span><b>${routeLabel132(rec.route)}</b><p>${rec.reason}</p></div><button type="button" onclick="applyEngineerTyreV4132()">采用推荐</button></div></div>`;
    if (btn) {
      btn.disabled = !valid;
      btn.textContent = valid ? "开始正赛 →" : "请先选择两种轮胎";
      btn.onclick = window.startRaceV4132;
    }
  }

  function legacyEffect132(id) {
    const wx = weather132() || { type: "dry" },
      tm = tyreMgmt132(),
      type = wx.type || "dry";
    let pos = 0,
      risk = 0,
      quality = 72,
      note = "";
    if (type === "dry") {
      if (id === "balanced") {
        quality = 76;
        note = "标准一停让比赛保持在正常窗口。";
      } else if (id === "attack") {
        quality = tm >= 68 ? 80 : 72;
        pos += tm >= 76 ? -1 : 0;
        risk += tm < 62 ? 0.012 : 0.004;
        note = "两停策略用更高峰值速度交换额外进站成本。";
      } else if (id === "reverse") {
        quality = tm >= 72 ? 79 : 70;
        pos += tm >= 78 ? -1 : 0;
        note = "反向策略把机会留到后半程和潜在安全车窗口。";
      } else if (id === "rain") {
        quality = 57;
        pos += 2;
        note = "实际赛道偏干，过度偏向雨战付出了时间。";
      } else if (id === "flex") {
        quality = 70;
        note = "灵活方案在干地仍可工作，但不是理论最快。";
      }
    } else if (type === "mixed") {
      if (id === "flex") {
        quality = 84;
        pos -= 1;
        note = "灵活策略与干湿交替的背景匹配。";
      } else if (id === "rain") {
        quality = 78;
        note = "雨势准备减少了 crossover 阶段的风险。";
      } else if (id === "attack") {
        quality = 77;
        risk += 0.006;
        note = "进攻方案速度不错，但窗口更依赖判断。";
      } else {
        quality = 68;
        pos += 1;
        note = "原本的干地计划在干湿变化中需要额外修正。";
      }
    } else {
      if (id === "rain") {
        quality = 84;
        pos -= 1;
        note = "持续湿地让雨战预案兑现。";
      } else if (id === "flex") {
        quality = 80;
        note = "灵活策略顺利切入湿地窗口。";
      } else if (id === "attack") {
        quality = 69;
        pos += 1;
        risk += 0.012;
        note = "持续湿地削弱了原本依赖干胎速度的进攻计划。";
      } else {
        quality = 62;
        pos += 2;
        risk += 0.016;
        note = "持续湿地迫使干地基础策略临时改线。";
      }
    }
    if (tm >= 82 && pos > 0) pos--;
    return { pos, risk, quality, note };
  }

  function customEffect132(route) {
    const wx = weather132() || { type: "dry", actual: ["dry", "dry", "dry"] },
      a = wx.actual || [],
      type = wx.type || "dry",
      tm = tyreMgmt132(),
      td = tyreDemand132(),
      qp = qPos132(),
      r = route.join("");
    let quality = 76,
      risk = 0.004,
      note = "";
    const first = route[0],
      second = route[1],
      hasWet = route.some(wetCode132),
      hasSoft = route.includes("S");
    if (type === "dry") {
      if (hasWet) {
        quality = 55;
        risk = 0.014;
        note = `${routeLabel132(route)} 与实际干地明显不匹配，雨胎阶段会付出大量圈速。`;
      } else {
        const pair = { MH: 84, HM: 81, SM: 80, SH: 78, MS: 79, HS: 77 };
        quality = pair[r] || 74;
        if (td >= 22) {
          if (r === "MH") quality += 3;
          if (r === "HM") quality += 2;
          if (first === "S") quality -= 4;
        }
        if (td <= 17) {
          if (r === "SM") quality += 3;
          if (r === "MS") quality += 2;
          if (r === "MH") quality -= 1;
        }
        if (hasSoft && tm >= 80) quality += 2;
        if (hasSoft && tm < 65) {
          quality -= 5;
          risk += 0.01;
        }
        if (r === "HM" && qp > 10) quality += 2;
        note = `${routeLabel132(route)} 根据本场轮胎负荷与赛车轮胎管理得到 ${Math.round(quality)} 的基础策略评价。`;
      }
    } else if (type === "mixed") {
      const startsWet = ["damp", "wet", "extreme"].includes(a[0]),
        endsDry = ["dry", "cloud"].includes(a[2]),
        becomesWet =
          !startsWet &&
          a.slice(1).some((x) => ["damp", "wet", "extreme"].includes(x)),
        severe =
          a.includes("extreme") || a.filter((x) => x === "wet").length >= 2;
      if (startsWet && endsDry) {
        quality =
          wetCode132(first) && dryCode132(second)
            ? 88
            : wetCode132(first)
              ? 78
              : 59;
        note =
          quality >= 85
            ? "湿地起步后转回干胎，与实际赛道变干过程高度匹配。"
            : "赛道由湿转干，但基础轮胎顺序没有完整覆盖 crossover。";
      } else if (becomesWet) {
        quality =
          dryCode132(first) && second === "I"
            ? 90
            : dryCode132(first) && second === "W"
              ? severe
                ? 86
                : 76
              : hasWet
                ? 80
                : 61;
        note =
          quality >= 86
            ? "干胎起步后及时预留半雨/雨胎阶段，与实际由干转湿的过程匹配。"
            : "比赛出现由干转湿，基础策略需要更多临场修正。";
      } else {
        quality = route.includes("I")
          ? 85
          : route.includes("W")
            ? severe
              ? 88
              : 75
            : 63;
        note = "混合天气让 crossover 时机成为轮胎策略的主要得失点。";
      }
      risk += quality < 70 ? 0.018 : 0.004;
    } else {
      const extreme = a.includes("extreme");
      if (first === "I" && second === "W") quality = extreme ? 92 : 84;
      else if (first === "W" && second === "I") quality = extreme ? 87 : 82;
      else if (wetCode132(first) && wetCode132(second)) quality = 86;
      else if (wetCode132(first) && dryCode132(second)) quality = 72;
      else if (dryCode132(first) && wetCode132(second)) quality = 64;
      else quality = 54;
      risk += quality < 70 ? 0.024 : 0.005;
      note =
        quality >= 85
          ? "基础策略完整覆盖了持续湿地与雨势强度。"
          : "持续湿地与基础轮胎顺序并不完全匹配，需要依赖比赛中的临场换胎纠正。";
    }
    quality = clamp132(quality, 45, 94);
    let pos = quality >= 89 ? -1 : quality < 62 ? 2 : quality < 72 ? 1 : 0;
    if (tm >= 82 && pos > 0) pos--;
    return { quality, pos, risk, note, route: [...route] };
  }

  function legacyIdFor132(route) {
    const r = route.join("");
    if (r === "MH") return "balanced";
    if (r === "HM") return "reverse";
    if (r === "MI") return "flex";
    if (r === "IW") return "rain";
    if (route[0] === "S") return "attack";
    return "balanced";
  }

  const startPrev132 = window.startRaceV413;
  function startRaceV4132() {
    if (!state?.weekend) return false;
    const route = [...migrateRoute132()];
    if (!routeValid132(route)) {
      alert("请先选择两种不同的轮胎。");
      return false;
    }
    const legacyId = legacyIdFor132(route),
      legacy = legacyEffect132(legacyId);
    state.weekend.tyrePlanV410 = legacyId;
    const out =
      typeof startPrev132 === "function"
        ? startPrev132.apply(this, arguments)
        : false;
    if (out === false) {
      state.weekend.tyrePlanV410 = "custom";
      return out;
    }
    try {
      const custom = customEffect132(route);
      if (Number(state.weekend.eventQualityCountV411 || 0) >= 1)
        state.weekend.eventQualitySumV411 =
          Number(state.weekend.eventQualitySumV411 || 0) -
          Number(legacy.quality || 72) +
          custom.quality;
      state.weekend.positionModV411 =
        Number(state.weekend.positionModV411 || 0) -
        Number(legacy.pos || 0) +
        custom.pos;
      state.weekend.dnfRiskV411 = Math.max(
        0,
        Number(state.weekend.dnfRiskV411 || 0) -
          Number(legacy.risk || 0) +
          custom.risk,
      );
      state.weekend.tyrePlanEffectV410 = { ...custom };
      state.weekend.tyrePlanV410 = "custom";
      if (
        Array.isArray(state.weekend.raceLogV411) &&
        state.weekend.raceLogV411.length
      )
        state.weekend.raceLogV411[0] = `轮胎策略：${custom.note}`;
      const review = state.weekend.strategyReviewV413;
      if (review) {
        review.plan = {
          id: "custom",
          name: "自定义两段",
          route: routeLabel132(route),
        };
        review.base = {
          quality: custom.quality,
          posDelta: custom.pos,
          risk: custom.risk,
          note: custom.note,
        };
      }
      try {
        autosave?.();
      } catch (_) {}
    } catch (e) {
      console.warn("v4132 custom tyre effect", e);
      state.weekend.tyrePlanV410 = "custom";
    }
    return out;
  }
  window.startRaceV4132 = startRaceV4132;

  const phasePrev132 = window.startRacePhase;
  window.startRacePhase = function (phase) {
    if (phase === "race") return startRaceV4132();
    return phasePrev132.apply(this, arguments);
  };
  try {
    startRacePhase = window.startRacePhase;
  } catch (_) {}

  const gpPrev132 = window.renderGrandPrix || renderGrandPrix;
  window.renderGrandPrix = function () {
    const out = gpPrev132.apply(this, arguments);
    try {
      renderBuilder132();
    } catch (e) {
      console.warn("v4132 tyre builder", e);
    }
    return out;
  };
  try {
    renderGrandPrix = window.renderGrandPrix;
  } catch (_) {}

  function grade132(score) {
    return score >= 90
      ? "S"
      : score >= 82
        ? "A"
        : score >= 73
          ? "B"
          : score >= 64
            ? "C"
            : "D";
  }
  function raceReviewData132() {
    const rr = state?.weekend?.raceResult;
    if (!rr || !selected) return null;
    let carFit = 0,
      carRank = 11;
    try {
      carFit = Number(trackFitV10(selected[1], "race"));
      const order = Object.keys(teams)
        .map((t) => [t, Number(trackFitV10(t, "race"))])
        .sort((a, b) => b[1] - a[1]);
      carRank = Math.max(1, order.findIndex((x) => x[0] === selected[1]) + 1);
    } catch (_) {}
    const carScore = clamp132(
        97 - (carRank - 1) * 5.8 + (carFit - 75) * 0.18,
        42,
        97,
      ),
      carGrade = grade132(carScore);
    const review = state.weekend.strategyReviewV413,
      route = Array.isArray(state.weekend.tyreCustomV4132)
        ? state.weekend.tyreCustomV4132
        : null,
      isQuick = !!state.weekend.quickSimV4131,
      tyreScore = isQuick
        ? 0
        : review
          ? Number(review.base?.quality || 72)
          : Number(state.weekend.tyrePlanEffectV410?.quality || 0),
      tyreGrade = tyreScore ? grade132(tyreScore) : "—";
    const grid = Number(state.weekend.qualResult?.position || drivers.length),
      finish = Number(rr.position || drivers.length);
    let expected = [grid, grid];
    try {
      const x = expectedRangeV10("race");
      if (Array.isArray(x)) expected = x;
    } catch (_) {}
    const expMid =
      (Number(expected[0] || grid) + Number(expected[1] || grid)) / 2;
    let executionScore = rr.dnf
        ? 48
        : clamp132(80 + (expMid - finish) * 4 + (grid - finish) * 1.4, 45, 97),
      executionGrade = grade132(executionScore);
    const decisions = review?.decisions || [],
      decisionAvg = decisions.length
        ? decisions.reduce((s, d) => s + Number(d.quality || 72), 0) /
          decisions.length
        : tyreScore || 76;
    const overallScore = rr.dnf
        ? clamp132(
            executionScore * 0.65 +
              (tyreScore || 72) * 0.2 +
              decisionAvg * 0.15,
            40,
            88,
          )
        : clamp132(
            executionScore * 0.58 +
              (tyreScore || 76) * 0.24 +
              decisionAvg * 0.18,
            45,
            97,
          ),
      overallGrade = grade132(overallScore);
    const carText =
      carRank <= 2
        ? "争胜级赛车"
        : carRank <= 4
          ? "领奖台竞争力"
          : carRank <= 7
            ? "中游竞争力"
            : "后排竞争力";
    const tyreText = isQuick
      ? "AUTO"
      : routeValid132(route)
        ? routeLabel132(route)
        : "—";
    let summary = `本场赛车赛道适配 P${carRank}/${Object.keys(teams).length}，属于${carText}。`;
    if (tyreScore)
      summary += ` 轮胎基础策略得到 ${tyreGrade} 评价（${tyreText}）。`;
    else summary += " 本场为自动模拟，没有人工轮胎策略评分。";
    if (rr.dnf)
      summary += " 最终退赛会压低比赛执行评分，但不会被简单归因于轮胎策略。";
    else
      summary += ` 从 P${grid} 发车最终 P${finish}，比赛执行评级 ${executionGrade}。`;
    return {
      overallGrade,
      overallScore,
      carGrade,
      carRank,
      carFit,
      tyreGrade,
      tyreScore,
      tyreText,
      executionGrade,
      grid,
      finish,
      summary,
    };
  }
  function renderRaceReview132() {
    const host = document.querySelector("#weekendresult .resultSummary"),
      d = raceReviewData132();
    if (!host || !d) return;
    let box = document.getElementById("raceReviewV4132");
    if (!box) {
      box = document.createElement("div");
      box.id = "raceReviewV4132";
      box.className = "raceReviewV4132";
      const before = document.getElementById("strategyReviewV413");
      if (before) host.insertBefore(box, before);
      else host.appendChild(box);
    }
    box.innerHTML = `<div class="raceReviewHeadV4132"><div class="raceReviewGradeV4132"><span>RACE</span><b>${d.overallGrade}</b></div><div><div class="strategyReviewLabelV413">RACE REVIEW · 赛后评估</div><h3>${d.overallGrade === "S" ? "完美周日" : d.overallGrade === "A" ? "出色发挥" : d.overallGrade === "B" ? "符合预期" : d.overallGrade === "C" ? "仍有损失" : "艰难一站"}</h3><p>${d.summary}</p></div></div><div class="raceReviewGridV4132"><div class="raceReviewMetricV4132"><span>赛车性能</span><b>${d.carGrade} · P${d.carRank}/${Object.keys(teams).length}</b><small>赛道适配 ${d.carFit.toFixed(1)}</small></div><div class="raceReviewMetricV4132"><span>轮胎策略</span><b>${d.tyreGrade}${d.tyreScore ? ` · ${Math.round(d.tyreScore)}` : ""}</b><small>${d.tyreText}</small></div><div class="raceReviewMetricV4132"><span>正赛执行</span><b>${d.executionGrade}</b><small>P${d.grid} → ${state.weekend.raceResult?.dnf ? "DNF" : "P" + d.finish}</small></div></div><div class="raceReviewNoteV4132"><b>评分逻辑：</b>赛车性能反映本车在本赛道的真实竞争力；轮胎策略评价你赛前选择的两段基础方案与实际天气、轮胎负荷是否匹配；正赛执行再结合发车位、预计竞争区间与最终成绩。下方 Strategy Review 继续负责逐项点评天气、VSC、Safety Car、红旗等临场决定。</div>`;
  }

  const resultPrev132 = window.renderWeekendResult || renderWeekendResult;
  window.renderWeekendResult = function () {
    const out = resultPrev132.apply(this, arguments);
    try {
      const wbox = document.getElementById("resultWeatherV410"),
        route = state?.weekend?.tyreCustomV4132;
      if (wbox && routeValid132(route)) {
        const wx = state.weekend.weatherV410;
        renderResultWeatherBoxV410(
          wbox,
          wx,
          `自定义策略 · ${routeLabel132(route)}`,
          state.weekend.tyrePlanEffectV410?.note || "",
        );
      }
      renderRaceReview132();
    } catch (e) {
      console.warn("v4132 race review", e);
    }
    return out;
  };
  try {
    renderWeekendResult = window.renderWeekendResult;
  } catch (_) {}

  const advancePrev132 = window.advanceRound || advanceRound;
  window.advanceRound = function () {
    const out = advancePrev132.apply(this, arguments);
    try {
      if (state?.weekend) delete state.weekend.tyreCustomV4132;
    } catch (_) {}
    return out;
  };
  try {
    advanceRound = window.advanceRound;
  } catch (_) {}
  const snapPrev132 = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = snapPrev132.apply(this, arguments);
    s.version = 4132;
    s.majorVersion = "4.0";
    s.featureSet = "v40-strategy-review-patch13.2-custom-tyre";
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
})();

/* v40-patch133-tyre-wear-script */

(() => {
  const T133 = {
    /* Patch 13.26 Weather+Tyre Tune: dry compounds are calibrated around a half-race one-stop stint on a neutral track (tyre demand 20 / tyre management 65): S≈55%, M≈70%, H≈78%. */
    S: {
      name: "SOFT",
      short: "软胎",
      cls: "soft",
      life: 0.29,
      loss: 22.0,
      pace: 4,
      threshold: 78,
    },
    M: {
      name: "MEDIUM",
      short: "中性胎",
      cls: "medium",
      life: 0.43,
      loss: 24.3,
      pace: 1,
      threshold: 76,
    },
    H: {
      name: "HARD",
      short: "硬胎",
      cls: "hard",
      life: 0.58,
      loss: 26.1,
      pace: -1,
      threshold: 80,
    },
    I: {
      name: "INTERMEDIATE",
      short: "半雨胎",
      cls: "inter",
      life: 0.38,
      loss: 12,
      pace: 1,
      threshold: 82,
    },
    W: {
      name: "WET",
      short: "全雨胎",
      cls: "wet",
      life: 0.42,
      loss: 10,
      pace: -1,
      threshold: 85,
    },
  };
  const CODES133 = ["S", "M", "H", "I", "W"];
  const clamp133 = (v, a, b) => Math.max(a, Math.min(b, v));
  const routeText133 = (r) =>
    (r || []).map((c) => T133[c]?.name || "—").join(" → ");
  const tyreMgmt133 = (team = selected?.[1]) =>
    Number(teams?.[team]?.parts?.["轮胎管理"] || 65);
  const tyreDemand133 = () => {
    try {
      return Number(currentDemandV10("race", state.round)?.[4] || 20);
    } catch (_) {
      return 20;
    }
  };
  const weather133 = () => {
    try {
      return window.ensureWeatherV410?.() || state?.weekend?.weatherV410;
    } catch (_) {
      return null;
    }
  };
  const dry133 = (c) => c === "S" || c === "M" || c === "H";
  const wet133 = (c) => c === "I" || c === "W";

  function routeState133() {
    if (!state?.weekend) return [null, null];
    if (
      Array.isArray(state.weekend.tyreRouteV4133) &&
      state.weekend.tyreRouteV4133.length >= 1
    )
      return state.weekend.tyreRouteV4133;
    const old = Array.isArray(state.weekend.tyreCustomV4132)
      ? state.weekend.tyreCustomV4132
      : null;
    state.weekend.tyreRouteV4133 =
      old && old.length >= 1 ? [...old] : [null, null];
    return state.weekend.tyreRouteV4133;
  }
  function validRoute133(r) {
    if (
      !Array.isArray(r) ||
      r.length < 1 ||
      !r.every((c) => CODES133.includes(c))
    )
      return false;
    /* Dry-only plans still need two different dry compounds. Once INTERMEDIATE/WET is used, that rule is waived. */
    if (r.length === 1) return wet133(r[0]);
    return r.some(wet133) || new Set(r).size >= 2;
  }
  function weatherStage133(stages, mid) {
    const a =
      Array.isArray(stages) && stages.length ? stages : ["dry", "dry", "dry"];
    return (
      a[Math.min(a.length - 1, Math.max(0, Math.floor(mid * a.length)))] ||
      "dry"
    );
  }
  function surface133(code, w) {
    /* Patch 13.5: a wrong wet/dry compound is a grip crisis, not a small strategy modifier. */
    if (w === "dry" || w === "cloud") {
      if (dry133(code))
        return {
          q: 0,
          pos: 0,
          risk: 0,
          wear: 1,
          label: "匹配干地",
          crisis: false,
        };
      if (code === "I")
        return {
          q: 68,
          pos: 7,
          risk: 0.025,
          wear: 2.65,
          label: "干地使用半雨胎",
          crisis: true,
        };
      return {
        q: 82,
        pos: 10,
        risk: 0.04,
        wear: 3.2,
        label: "干地使用全雨胎",
        crisis: true,
      };
    }
    if (w === "damp") {
      if (code === "I")
        return {
          q: 0,
          pos: 0,
          risk: 0,
          wear: 1,
          label: "潮湿路面匹配",
          crisis: false,
        };
      if (code === "W")
        return {
          q: 12,
          pos: 1,
          risk: 0.008,
          wear: 0.92,
          label: "雨胎偏重",
          crisis: false,
        };
      return {
        q: 34,
        pos: 3,
        risk: 0.055,
        wear: 1,
        label: "潮湿路面继续干胎",
        crisis: false,
      };
    }
    if (w === "wet") {
      if (code === "I")
        return {
          q: 0,
          pos: 0,
          risk: 0,
          wear: 1,
          label: "湿地匹配",
          crisis: false,
        };
      if (code === "W")
        return {
          q: 7,
          pos: 0,
          risk: 0.004,
          wear: 0.94,
          label: "全雨胎略保守",
          crisis: false,
        };
      return {
        q: 85,
        pos: 10,
        risk: 0.18,
        wear: 1,
        label: "湿地使用干胎",
        crisis: true,
      };
    }
    if (w === "extreme") {
      if (code === "W")
        return {
          q: 0,
          pos: 0,
          risk: 0,
          wear: 1,
          label: "积水路面匹配",
          crisis: false,
        };
      if (code === "I")
        return {
          q: 35,
          pos: 4,
          risk: 0.075,
          wear: 1,
          label: "积水中半雨胎不足",
          crisis: false,
        };
      return {
        q: 96,
        pos: 14,
        risk: 0.33,
        wear: 1,
        label: "积水路面使用干胎",
        crisis: true,
      };
    }
    return { q: 0, pos: 0, risk: 0, wear: 1, label: "常规", crisis: false };
  }
  function wearPenalty133(code, health) {
    const t = T133[code];
    if (!t) return 0;
    let p = 0;
    /* Dry-tyre degradation is rescaled for the lower, more realistic remaining-health numbers. A normal one-stop Soft around 55% is slow, but not an automatic collapse. */
    if (code === "S") {
      if (health < t.threshold) p += (t.threshold - health) * 0.22;
      if (health < 62) p += (62 - health) * 0.28;
      if (health < 45) p += (45 - health) * 0.55;
    } else if (code === "M") {
      if (health < t.threshold) p += (t.threshold - health) * 0.2;
      if (health < 58) p += (58 - health) * 0.28;
    } else if (code === "H") {
      if (health < t.threshold) p += (t.threshold - health) * 0.1;
      if (health < 52) p += (52 - health) * 0.18;
    } else {
      if (health < t.threshold) p += (t.threshold - health) * 0.32;
      if (health < 68) p += (68 - health) * 0.4;
    }
    return Math.max(0, p);
  }
  function trackTrafficFactor133() {
    let n = "";
    try {
      n = currentRace()?.[1] || "";
    } catch (_) {}
    const hard = {
      摩纳哥大奖赛: 1.85,
      匈牙利大奖赛: 1.55,
      新加坡大奖赛: 1.5,
      荷兰大奖赛: 1.38,
      "巴塞罗那-加泰罗尼亚大奖赛": 1.3,
      西班牙大奖赛: 1.22,
      日本大奖赛: 1.15,
    };
    const easy = {
      意大利大奖赛: 0.68,
      比利时大奖赛: 0.7,
      奥地利大奖赛: 0.76,
      阿塞拜疆大奖赛: 0.76,
      加拿大大奖赛: 0.82,
      拉斯维加斯大奖赛: 0.8,
      迈阿密大奖赛: 0.9,
    };
    return hard[n] || easy[n] || 1;
  }
  function pitLossModel133(route, execute = false, team = selected?.[1]) {
    const stops = Math.max(0, (route || []).length - 1),
      extraStops = Math.max(0, stops - 1),
      events = [];
    if (!extraStops)
      return {
        stops,
        extraStops,
        pos: 0,
        quality: 0,
        traffic: 0,
        execution: 0,
        events,
      };
    const tf = trackTrafficFactor133(),
      rac = Number(selected?.[4] || 75);
    let fit = 72;
    try {
      fit = Number(trackFitV10(team, "race") || 72);
    } catch (_) {}
    const recoverBase = clamp133(
      (rac - 68) * 0.013 + (fit - 70) * 0.008,
      0,
      0.72,
    );
    let total = 0,
      trafficTotal = 0,
      execTotal = 0;
    for (let j = 0; j < extraStops; j++) {
      const base = 1.02 + 0.42 * tf;
      let execLoss = execute ? 0 : 0.34;
      let execLabel = "预期正常";
      if (execute) {
        const er = Math.random();
        if (er < 0.66) {
          execLoss = 0;
          execLabel = "CLEAN STOP";
        } else if (er < 0.9) {
          execLoss = 0.65 + Math.random() * 0.65;
          execLabel = "SLOW STOP";
        } else if (er < 0.985) {
          execLoss = 1.45 + Math.random() * 1.15;
          execLabel = "BAD STOP";
        } else {
          execLoss = 3.0 + Math.random() * 1.25;
          execLabel = "PIT ERROR";
        }
      }
      let trafficLoss = execute ? 0 : 0.62 * tf;
      let trafficLabel = execute ? "CLEAN AIR" : "预期交通";
      if (execute) {
        const p = clamp133(0.3 + 0.2 * tf, 0.34, 0.72);
        if (Math.random() < p) {
          trafficLoss = (0.75 + Math.random() * 1.35) * tf;
          if (Math.random() < 0.18) trafficLoss += 0.8 * tf;
          trafficLabel = trafficLoss > 2.2 ? "HEAVY TRAFFIC" : "TRAFFIC";
        }
      }
      const recovery = Math.min(
        trafficLoss * 0.58,
        recoverBase * (0.55 + 0.25 * j),
      );
      trafficLoss = Math.max(0, trafficLoss - recovery);
      const loss = base + execLoss + trafficLoss;
      total += loss;
      trafficTotal += trafficLoss;
      execTotal += execLoss;
      events.push({
        stop: j + 2,
        base,
        execution: execLoss,
        executionLabel: execLabel,
        traffic: trafficLoss,
        trafficLabel,
        recovery,
        loss,
      });
    }
    return {
      stops,
      extraStops,
      pos: Math.max(0, Math.round(total)),
      quality: total * 2.15,
      traffic: trafficTotal,
      execution: execTotal,
      events,
    };
  }
  function model133(route, stages, team = selected?.[1], execute = false) {
    const r = (route || []).filter((c) => CODES133.includes(c));
    if (r.length < 1 || (r.length === 1 && !wet133(r[0]))) return null;
    const tm = tyreMgmt133(team),
      td = tyreDemand133(),
      singleWet = r.length === 1 && wet133(r[0]);
    const trackF = clamp133(0.88 + (td - 17) * 0.027, 0.82, 1.22),
      carF = clamp133(1.09 - (tm - 60) * 0.006, 0.78, 1.2);
    const weights = r.map((c) => T133[c].life),
      sum = weights.reduce((a, b) => a + b, 0) || 1;
    /* Dry strategies have no user-selectable pit lap, so split the planned race distance evenly between stints. This makes a normal one-stop a true half-race endurance reference instead of automatically shortening the soft stint. Mixed/wet plans keep compound-life weighting so weather transitions still control the usable window. */
    const dryOnly = r.every((c) => dry133(c)),
      shares = dryOnly
        ? r.map(() => 1 / r.length)
        : weights.map((x) => x / sum);
    const hasDryStage = (stages || []).some(
        (w) => w === "dry" || w === "cloud",
      ),
      hasWetStage = (stages || []).some(
        (w) => w === "damp" || w === "wet" || w === "extreme",
      ),
      mixedWeather = hasDryStage && hasWetStage;
    let cum = 0,
      weightedWear = 0,
      weightedMismatch = 0,
      mismatchPos = 0,
      risk = 0.004,
      pace = 0,
      wearPos = 0;
    const stints = [];
    r.forEach((code, i) => {
      const share = shares[i],
        mid = cum + share / 2,
        t = T133[code];
      let w = weatherStage133(stages, mid),
        rawSurf = surface133(code, w);
      cum += share;
      if (singleWet) {
        const ws =
            Array.isArray(stages) && stages.length
              ? stages
              : ["wet", "wet", "wet"],
          ss = ws.map((x) => surface133(code, x)),
          avg = (k) =>
            ss.reduce((a, b) => a + Number(b[k] || 0), 0) / ss.length;
        rawSurf = {
          q: avg("q"),
          pos: Math.round(avg("pos")),
          risk: avg("risk"),
          wear: avg("wear"),
          label: [...new Set(ss.map((x) => x.label))].join(" / "),
          crisis: ss.some((x) => x.crisis),
        };
        w = ws.every((x) => x === ws[0]) ? ws[0] : "mixed";
      }
      /* Patch 13.9: no standalone weather decision exists. Every planned stint is judged directly against the actual surface state. */
      const defer = false,
        surf = { ...rawSurf };
      /* A single INTERMEDIATE/WET set can legally run to the flag. Give wet compounds a long-run endurance model, while drying conditions still accelerate wear heavily. */
      const effectiveLife = singleWet
        ? t.life * (code === "W" ? 1.9 : 1.78)
        : t.life;
      const ratio = share / effectiveLife,
        health = clamp133(
          100 -
            t.loss *
              Math.pow(Math.max(0.35, ratio), 1.28) *
              trackF *
              carF *
              surf.wear,
          22,
          100,
        );
      const wp = wearPenalty133(code, health),
        stress = Math.max(0, ratio - 0.92) * 5.5;
      const mismatchWeight =
        surf.crisis && !defer ? Math.max(share, 0.48) : share;
      weightedWear += (wp + stress) * share;
      weightedMismatch += surf.q * mismatchWeight;
      pace += t.pace * share;
      if (surf.pos > 0) {
        const exposure = surf.crisis
          ? Math.max(0.7, Math.sqrt(share))
          : Math.max(0.55, Math.sqrt(share));
        mismatchPos += Math.max(1, Math.round(surf.pos * exposure));
      }
      risk +=
        surf.risk * (surf.crisis && !defer ? Math.max(share, 0.55) : share);
      if (health < 70) risk += (70 - health) * 0.0008;
      if (health < 55) risk += (55 - health) * 0.0014;
      const wearPosThreshold =
        code === "S" ? 48 : code === "M" ? 55 : code === "H" ? 58 : 60;
      if (health < wearPosThreshold) wearPos += 1;
      if (health < 35) wearPos += 1;
      stints.push({
        index: i + 1,
        code,
        name: t.name,
        share,
        weather: w,
        health: Math.round(health),
        wearPenalty: wp,
        surface: surf.label,
        mismatch: surf.q > 0,
        crisis: !!surf.crisis && !defer,
      });
    });
    const pit = pitLossModel133(r, execute, team),
      stops = pit.stops,
      extraStops = pit.extraStops,
      pitQuality = pit.quality,
      pitPos = pit.pos;
    let quality =
      82 + pace * 1.25 - weightedWear - weightedMismatch - pitQuality;
    quality = clamp133(quality, 18, 95);
    let pos = mismatchPos + pitPos + wearPos;
    if (quality >= 90 && pos === 0) pos = -1;
    else if (quality < 38) pos += 5;
    else if (quality < 48) pos += 4;
    else if (quality < 58) pos += 2;
    else if (quality < 68) pos += 1;
    risk = clamp133(risk, 0, 0.55);
    const avgHealth = stints.reduce((s, x) => s + x.health, 0) / stints.length;
    const mismatch = stints.filter((x) => x.mismatch),
      crises = stints.filter((x) => x.crisis);
    let note = `${routeText133(r)}：计划 ${stops} 次进站`;
    if (extraStops)
      note += `，比标准一停多 ${extraStops} 次进站；额外进站还会承担换胎执行与出站交通成本`;
    note += `；平均预计胎况 ${Math.round(avgHealth)}%。`;
    if (crises.length)
      note += ` ${crises.map((x) => `STINT ${x.index} ${x.surface}`).join("；")}，属于严重抓地错配。`;
    else if (mismatch.length)
      note += ` ${mismatch.map((x) => `STINT ${x.index} ${x.surface}`).join("；")}，轮胎与路面状态不匹配。`;
    else if (stints.some((x) => x.code === "S" && x.health < 90))
      note += ` 软胎有阶段跌破 90%，已进入明显性能衰减区。`;
    else note += " 各段轮胎与赛道状态基本匹配。";
    return {
      quality,
      pos,
      risk,
      note,
      route: [...r],
      stints,
      stops,
      extraStops,
      pitPos,
      pitQuality,
      pitEvents: pit.events,
      pitTraffic: pit.traffic,
      pitExecution: pit.execution,
      avgHealth: Math.round(avgHealth),
      mismatchCount: mismatch.length,
      crisisCount: crises.length,
    };
  }

  function recommendation133() {
    const wx = weather133() || {},
      f = wx.forecast || ["dry", "dry", "dry"],
      tm = tyreMgmt133(),
      td = tyreDemand133(),
      qp = Number(state?.weekend?.qualResult?.position || 12);
    const startsWet = ["damp", "wet", "extreme"].includes(f[0]),
      endsDry = ["dry", "cloud"].includes(f[2]),
      becomesWet =
        !startsWet &&
        f.slice(1).some((x) => ["damp", "wet", "extreme"].includes(x)),
      severe =
        f.includes("extreme") || f.filter((x) => x === "wet").length >= 2,
      allWet = f.every((x) => ["damp", "wet", "extreme"].includes(x));
    if (startsWet && endsDry)
      return {
        route: ["I", "M"],
        reason:
          "预报显示湿地起步后形成干线，半雨胎接中性胎能覆盖主要 crossover。",
      };
    if (allWet && severe)
      return {
        route: ["W"],
        reason:
          "预报显示整场持续强降雨 / 积水；可以选择单套 WET 零停跑到底，但胎耗和雨势变化仍会影响最终速度。",
      };
    if (allWet)
      return {
        route: ["I"],
        reason:
          "预报显示整场持续湿滑且雨势有限；允许单套 INTERMEDIATE 零停跑到底，是否划算取决于胎耗与实际降雨变化。",
      };
    if (startsWet)
      return {
        route: severe ? ["I", "W"] : ["I", "M"],
        reason: severe
          ? "持续强降雨概率较高，先半雨胎、雨势加重后转全雨胎。"
          : "湿地起步但强度有限，半雨胎后保留转干胎空间。",
      };
    if (becomesWet)
      return {
        route: severe ? ["M", "I", "W"] : ["M", "I"],
        reason: severe
          ? "预报由干转湿且后段可能达到积水，三段方案为半雨胎与全雨胎都留出窗口。"
          : "比赛预计由干转湿，中性胎起步后切半雨胎。",
      };
    if (td >= 24 && tm >= 74)
      return {
        route: ["S", "M", "S"],
        reason:
          "轮胎负荷高，但本车轮胎管理较好。两停会多付一次进站成本，却能避免长时间使用明显衰减的旧胎。",
      };
    if (td >= 24)
      return {
        route: ["M", "H", "M"],
        reason:
          "本场长距离退化明显。两停增加一次进站损失，但能把每段胎龄控制在更稳定的区间。",
      };
    if (qp > 10 && tm >= 68 && td < 23)
      return {
        route: ["H", "M"],
        reason: "后排发车适合用硬胎延长第一段，等待安全车或制造轮胎差。",
      };
    if (td <= 17 && tm >= 76)
      return {
        route: ["S", "M"],
        reason:
          "赛道轮胎负荷较低且本车管理较好，可以利用软胎前段速度，再由中性胎完成主要长距离。",
      };
    return {
      route: ["M", "H"],
      reason:
        "常规干地条件下，一停的时间损失最低；中性胎接硬胎是当前最稳的基础方案。",
    };
  }

  function forecastBox133(route) {
    if (!validRoute133(route)) {
      const one = Array.isArray(route) && route.length === 1 && route[0],
        msg =
          one && dry133(route[0])
            ? "单套干胎不能作为完整正赛计划；干地策略仍需要至少两种不同干胎配方。"
            : "干地策略需要至少两种不同干胎配方；INTERMEDIATE / WET 可选择单套轮胎零停跑完全程。";
      return `<div class="tyreWearForecastV4133"><div class="label">TYRE MODEL · 磨损预估</div><p>${msg}</p></div>`;
    }
    const f = weather133()?.forecast || ["dry", "dry", "dry"],
      m = model133(route, f);
    if (!m) return "";
    const pills = m.stints
      .map((s) => {
        const dangerAt =
            s.code === "S"
              ? 45
              : s.code === "M"
                ? 55
                : s.code === "H"
                  ? 60
                  : 55,
          warnAt =
            s.code === "S"
              ? 62
              : s.code === "M"
                ? 68
                : s.code === "H"
                  ? 72
                  : 68;
        const bad = s.mismatch || s.health < dangerAt,
          warn = !bad && s.health < warnAt;
        return `<span class="tyreWearPillV4133 ${bad ? "danger" : warn ? "warn" : ""}">${s.name} · ${s.health}%</span>`;
      })
      .join("");
    return `<div class="tyreWearForecastV4133"><div class="label">TYRE MODEL · 按当前预报估算</div><div class="line">${pills}<span class="tyreWearPillV4133">${m.stops} 次进站</span>${m.extraStops ? `<span class="tyreWearPillV4133 warn">额外停站/交通预计约 -${m.pitPos} 位</span>` : ""}</div><p>${m.crisisCount ? "当前计划存在严重干湿地错胎；如果预报兑现，这一段会直接进入抓地危机。" : m.mismatchCount ? "当前计划存在路面与配方错配；如果预报兑现，会产生明显时间损失。" : "磨损会结合赛道轮胎负荷与本车轮胎管理计算。标准一停长距离基准约为 SOFT 55% / MEDIUM 70% / HARD 78%；额外进站还会增加慢停与出站交通暴露。"}</p></div>`;
  }

  window.selectTyreStintV4133 = function (i, code) {
    if (!state?.weekend) return;
    const r = [...routeState133()];
    r[Number(i)] = code;
    state.weekend.tyreRouteV4133 = r;
    state.weekend.tyreCustomV4132 = r.slice(0, 2);
    try {
      autosave?.();
    } catch (_) {}
    try {
      renderGrandPrix();
    } catch (_) {}
  };
  window.addTyreStintV4133 = function () {
    if (!state?.weekend) return;
    const r = [...routeState133(), null];
    state.weekend.tyreRouteV4133 = r;
    try {
      autosave?.();
    } catch (_) {}
    renderGrandPrix();
  };
  window.removeTyreStintV4133 = function (i) {
    if (!state?.weekend) return;
    const r = [...routeState133()];
    if (r.length <= 1) return;
    r.splice(Number(i), 1);
    state.weekend.tyreRouteV4133 = r;
    state.weekend.tyreCustomV4132 = r.slice(0, 2);
    try {
      autosave?.();
    } catch (_) {}
    renderGrandPrix();
  };
  window.setSingleWetStintV41323 = function (code) {
    if (!state?.weekend || !wet133(code)) return;
    state.weekend.tyreRouteV4133 = [code];
    state.weekend.tyreCustomV4132 = [code];
    state.weekend.tyrePlanV410 = "custom";
    try {
      autosave?.();
    } catch (_) {}
    renderGrandPrix();
  };
  window.applyEngineerTyreV4133 = function () {
    if (!state?.weekend) return;
    const rec = recommendation133();
    state.weekend.tyreRouteV4133 = [...rec.route];
    state.weekend.tyreCustomV4132 = rec.route.slice(0, 2);
    try {
      autosave?.();
    } catch (_) {}
    renderGrandPrix();
  };

  function renderBuilder133() {
    if (!state?.weekend?.qualResult) return;
    const host = document.getElementById("tyreStrategyV410"),
      btn = document.getElementById("raceStart");
    if (!host) return;
    const r = routeState133(),
      valid = validRoute133(r),
      rec = recommendation133();
    state.weekend.tyrePlanV410 = valid ? "custom" : null;
    state.weekend.tyreCustomV4132 = r.slice(0, 2);
    const cards = r
      .map(
        (v, i) =>
          `<div class="tyreStintCardV4133"><div class="tyreStintHeadV4133"><span>STINT ${i + 1}${i === 0 ? " · 发车轮胎" : ""}</span>${r.length > 1 ? `<button type="button" aria-label="删除 STINT ${i + 1}" onclick="removeTyreStintV4133(${i})">−</button>` : ""}</div><div class="customTyreChoicesV4132">${CODES133.map((c) => `<button type="button" class="customTyreChipV4132 ${T133[c].cls} ${v === c ? "selected" : ""}" onclick="selectTyreStintV4133(${i},'${c}')">${T133[c].name}</button>`).join("")}</div></div>`,
      )
      .join("");
    const duplicateOnly =
        r.length > 1 &&
        r.every(Boolean) &&
        !r.some(wet133) &&
        new Set(r).size < 2,
      singleWet = r.length === 1 && wet133(r[0]);
    host.innerHTML = `<div class="raceStrategyTitleV410"><b>自定义轮胎策略</b><span>干胎需至少两种不同配方；INTERMEDIATE / WET 可单套零停跑到底</span></div><div class="customTyreBuilderV4132"><div class="tyreStintListV4133">${cards}</div><button type="button" class="tyreAddStintV4133" onclick="addTyreStintV4133()"><b>＋</b> 添加新的 STINT</button><div class="tyreSingleWetV41323"><button type="button" onclick="setSingleWetStintV41323('I')">单套 INTERMEDIATE · 0 STOP</button><button type="button" onclick="setSingleWetStintV41323('W')">单套 WET · 0 STOP</button></div><div class="tyrePlanStatusV4133 ${!valid && r.every(Boolean) ? "bad" : ""}"><strong>当前计划：</strong>${r.every(Boolean) ? routeText133(r) : "仍有 STINT 未选择轮胎"}${duplicateOnly ? " · 干胎策略至少需要两种不同配方" : ""}${singleWet ? " · 单套湿地轮胎跑到底 · 0 次计划进站" : ""}</div>${forecastBox133(r)}<div class="tyreRuleV4133"><b>规则：</b>干地比赛的干胎计划仍需使用至少两种不同干胎配方；一旦选择 INTERMEDIATE 或 WET，该不同配方要求取消，因此允许单套半雨胎 / 全雨胎零停跑完全程。胎耗、赛道变干和错胎仍会直接影响速度与退赛风险。</div><div class="engineerRecV4132"><div><span>ENGINEER RECOMMENDATION</span><b>${routeText133(rec.route)}</b><p>${rec.reason}</p></div><button type="button" onclick="applyEngineerTyreV4133()">采用推荐</button></div></div>`;
    if (btn) {
      btn.disabled = !valid;
      btn.textContent = valid ? "开始正赛 →" : "请完成轮胎策略";
      btn.onclick = window.startRaceV4133;
    }
  }

  /* Patch 13.4: validate the whole route, not only the legacy first two stints. */
  const baseStart133 = window.startRaceV413;
  function startRaceV4133() {
    if (!state?.weekend) return false;
    const full = [...routeState133()];
    if (!validRoute133(full)) {
      alert(
        full.length === 1 && dry133(full[0])
          ? "单套干胎不能跑完整正赛：干胎计划至少需要两种不同配方。"
          : "请完成轮胎策略：干胎计划至少需要两种不同配方；INTERMEDIATE / WET 可以单套零停跑到底。",
      );
      return false;
    }
    state.weekend.tyreCustomV4132 = full.slice(0, 2);
    state.weekend.tyrePlanV410 = "custom";
    const out =
      typeof baseStart133 === "function"
        ? baseStart133.apply(this, arguments)
        : false;
    if (out === false) {
      state.weekend.tyreRouteV4133 = full;
      return false;
    }
    try {
      const old = { ...(state.weekend.tyrePlanEffectV410 || {}) },
        actual = weather133()?.actual || ["dry", "dry", "dry"],
        m = model133(full, actual, selected?.[1], true);
      if (!m) return out;
      if (Number(state.weekend.eventQualityCountV411 || 0) >= 1)
        state.weekend.eventQualitySumV411 =
          Number(state.weekend.eventQualitySumV411 || 0) -
          Number(old.quality || 72) +
          m.quality;
      state.weekend.positionModV411 =
        Number(state.weekend.positionModV411 || 0) -
        Number(old.pos || 0) +
        m.pos;
      state.weekend.dnfRiskV411 = Math.max(
        0,
        Number(state.weekend.dnfRiskV411 || 0) - Number(old.risk || 0) + m.risk,
      );
      state.weekend.tyrePlanEffectV410 = { ...m };
      state.weekend.tyreWearV4133 = { ...m };
      state.weekend.tyreRouteV4133 = full;
      state.weekend.tyreCustomV4132 = full.slice(0, 2);
      state.weekend.tyrePlanV410 = "custom";
      if (
        Array.isArray(state.weekend.raceLogV411) &&
        state.weekend.raceLogV411.length
      )
        state.weekend.raceLogV411[0] = `轮胎策略：${m.note}`;
      const review = state.weekend.strategyReviewV413;
      if (review) {
        review.plan = {
          id: "custom",
          name: `自定义 ${full.length} 段`,
          route: routeText133(full),
        };
        review.base = {
          quality: m.quality,
          posDelta: m.pos,
          risk: m.risk,
          note: m.note,
        };
      }
      try {
        autosave?.();
      } catch (_) {}
    } catch (e) {
      console.warn("v4133 tyre model", e);
    }
    return out;
  }
  window.startRaceV4133 = startRaceV4133;
  window.startRaceV4132 = startRaceV4133;

  const phasePrev133 = window.startRacePhase;
  window.startRacePhase = function (phase) {
    if (phase === "race") return startRaceV4133();
    return phasePrev133.apply(this, arguments);
  };
  try {
    startRacePhase = window.startRacePhase;
  } catch (_) {}

  const gpPrev133 = window.renderGrandPrix || renderGrandPrix;
  window.renderGrandPrix = function () {
    if (state?.weekend) {
      const r = routeState133();
      state.weekend.tyreCustomV4132 = r.slice(0, 2);
    }
    const out = gpPrev133.apply(this, arguments);
    try {
      renderBuilder133();
    } catch (e) {
      console.warn("v4133 builder", e);
    }
    return out;
  };
  try {
    renderGrandPrix = window.renderGrandPrix;
  } catch (_) {}

  /* Make the live choice—not the pre-race plan—the decisive penalty when weather changes. */
  const resolveWeatherPrev133 = window.resolveRaceEventV411;
  if (typeof resolveWeatherPrev133 === "function")
    window.resolveRaceEventV411 = function (i) {
      try {
        const ev = state?.weekend?.pendingEvent,
          c = ev?.choices?.[Number(i)];
        if (ev?.kind === "weather" && c && !c.v4133Adjusted) {
          const label = String(c.label || ""),
            actual = state.weekend?.weatherV410?.actual || [],
            severe = actual.includes("wet") || actual.includes("extreme"),
            endsDry = ["dry", "cloud"].includes(actual[2]);
          if (/继续使用干胎|继续干胎/.test(label)) {
            const extreme = actual.includes("extreme");
            c.posMod = Number(c.posMod || 0) + (extreme ? 9 : severe ? 6 : 2);
            c.dnfRisk =
              Number(c.dnfRisk || 0) +
              (extreme ? 0.16 : severe ? 0.095 : 0.018);
            c.risk = Math.max(
              Number(c.risk || 0),
              extreme ? 0.55 : severe ? 0.45 : 0.2,
            );
          } else if (/再等|观察/.test(label) && severe) {
            c.posMod =
              Number(c.posMod || 0) + (actual.includes("extreme") ? 3 : 2);
            c.dnfRisk =
              Number(c.dnfRisk || 0) +
              (actual.includes("extreme") ? 0.045 : 0.022);
          } else if (/继续半雨胎/.test(label) && endsDry) {
            c.posMod = Number(c.posMod || 0) + 5;
            c.dnfRisk = Number(c.dnfRisk || 0) + 0.006;
            c.risk = Math.max(Number(c.risk || 0), 0.16);
          }
          c.v4133Adjusted = true;
        }
      } catch (e) {
        console.warn("v4133 weather mismatch", e);
      }
      return resolveWeatherPrev133.apply(this, arguments);
    };

  const resolveControlPrev133 = window.resolveRaceControlV411;
  if (typeof resolveControlPrev133 === "function")
    window.resolveRaceControlV411 = function (i) {
      try {
        const ev = state?.weekend?.pendingEvent,
          c = ev?.choices?.[Number(i)],
          wetNow = ["damp", "wet", "extreme"].includes(ev?.weather);
        if (ev?.kind === "control" && c && wetNow && !c.v4133Adjusted) {
          const label = String(c.label || "");
          if (
            (ev.controlType === "VSC" || ev.controlType === "SC") &&
            /留在赛道/.test(label)
          ) {
            c.posMod =
              Number(c.posMod || 0) + (ev.weather === "extreme" ? 7 : 4);
            c.dnfRisk =
              Number(c.dnfRisk || 0) + (ev.weather === "extreme" ? 0.12 : 0.06);
            c.risk = Math.max(
              Number(c.risk || 0),
              ev.weather === "extreme" ? 0.48 : 0.32,
            );
          }
          if (
            ev.controlType === "RED" &&
            (/赌赛道快速变干/.test(label) || c.restartTyre === "M")
          ) {
            c.posMod =
              Number(c.posMod || 0) + (ev.weather === "extreme" ? 10 : 7);
            c.dnfRisk =
              Number(c.dnfRisk || 0) + (ev.weather === "extreme" ? 0.18 : 0.11);
            c.risk = Math.max(
              Number(c.risk || 0),
              ev.weather === "extreme" ? 0.58 : 0.46,
            );
          }
          c.v4133Adjusted = true;
        }
      } catch (e) {
        console.warn("v4133 control mismatch", e);
      }
      return resolveControlPrev133.apply(this, arguments);
    };

  const resultPrev133 = window.renderWeekendResult || renderWeekendResult;
  window.renderWeekendResult = function () {
    const out = resultPrev133.apply(this, arguments);
    try {
      const r = state?.weekend?.tyreRouteV4133,
        m = state?.weekend?.tyreWearV4133,
        wbox = document.getElementById("resultWeatherV410");
      if (validRoute133(r) && wbox) {
        const wx = state.weekend.weatherV410;
        renderResultWeatherBoxV410(
          wbox,
          wx,
          `自定义 ${r.length} 段 · ${routeText133(r)}`,
          m?.note || state.weekend.tyrePlanEffectV410?.note || "",
        );
      }
      /* Detailed tyre/pit diagnostics remain in state for scoring, but are intentionally not printed in the post-race card. */
    } catch (e) {
      console.warn("v4133 result", e);
    }
    return out;
  };
  try {
    renderWeekendResult = window.renderWeekendResult;
  } catch (_) {}

  const advancePrev133 = window.advanceRound || advanceRound;
  window.advanceRound = function () {
    const out = advancePrev133.apply(this, arguments);
    try {
      if (state?.weekend) {
        delete state.weekend.tyreRouteV4133;
        delete state.weekend.tyreWearV4133;
      }
    } catch (_) {}
    return out;
  };
  try {
    advanceRound = window.advanceRound;
  } catch (_) {}
  const snapPrev133 = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = snapPrev133.apply(this, arguments);
    s.version = 4135;
    s.majorVersion = "4.0";
    s.featureSet = "v40-strategy-review-patch13.5-pit-grip-compact-rating";
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
})();

/* v40-patch136-result-script */

(() => {
  const SUBTITLE_V4136 = {
    S: "simply lovely！",
    A: "不错的周日，不是吗？",
    B: "我们需要做得更好",
    C: "It's so over.",
    D: "也许这一周并没有发生。",
  };
  const esc136 = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[m],
    );
  function grade136() {
    const g =
      document
        .querySelector("#raceReviewV4132 .raceReviewGradeV4132 b")
        ?.textContent?.trim() ||
      document
        .querySelector("#strategyReviewV413 .strategyGradeV413 b")
        ?.textContent?.trim() ||
      state?.weekend?.raceGradeV4136 ||
      state?.weekend?.raceGradeV4135 ||
      "B";
    return ["S", "A", "B", "C", "D"].includes(g) ? g : "B";
  }
  function raceDecision136(kind) {
    const ds = state?.weekend?.strategyReviewV413?.decisions || [];
    return (
      ds
        .filter((d) => (kind === "control" ? !!d.controlType : d.kind === kind))
        .sort((a, b) => Number(b.quality || 0) - Number(a.quality || 0))[0] ||
      null
    );
  }
  function comments136() {
    const rr = state?.weekend?.raceResult,
      q = state?.weekend?.qualResult,
      m = state?.weekend?.tyreWearV4133;
    if (!rr || !q) return [];
    const grid = Number(q.position || drivers.length),
      finish = Number(rr.position || drivers.length),
      move = grid - finish,
      lines = [];
    if (rr.dnf) lines.push("没有看到终点，这场周日的结果被退赛提前截断。");
    else if (move >= 5)
      lines.push(`从 P${grid} 到 P${finish}，今天把发车位远远甩在了身后。`);
    else if (move >= 2)
      lines.push(`从 P${grid} 到 P${finish}，比赛执行拿回了 ${move} 个位置。`);
    else if (move <= -5)
      lines.push(`从 P${grid} 掉到 P${finish}，这场比赛损失得相当明显。`);
    else if (move <= -2)
      lines.push(
        `从 P${grid} 到 P${finish}，最终丢掉了 ${Math.abs(move)} 个位置。`,
      );
    else if (move === 0)
      lines.push(`P${grid} 发车、P${finish} 完赛，整场基本守住了原有位置。`);
    else lines.push(`P${grid} 发车、P${finish} 完赛，位置变化不大。`);

    if (m) {
      if (Number(m.crisisCount || 0) > 0)
        lines.push("轮胎与路面出现严重错配，抓地危机直接吞掉了大量时间。");
      else if (
        Number(m.pitExecution || 0) >= 1.8 ||
        Number(m.pitTraffic || 0) >= 2.2
      )
        lines.push("多次进站碰上慢停或出站交通，新胎优势没有完整兑现。");
      else if (Number(m.extraStops || 0) >= 2)
        lines.push("三停或更多的计划让维修区时间成本变得非常沉重。");
      else if (Number(m.extraStops || 0) === 1)
        lines.push("两停保持了更新的轮胎，但额外一次进站也付出了明确代价。");
      else if (
        (m.stints || []).some(
          (s) => s.code === "S" && Number(s.health || 100) < 90,
        )
      )
        lines.push("Soft 跌破 90% 后开始明显衰减，后段速度受到了影响。");
      else if (Number(m.avgHealth || 0) >= 82)
        lines.push("轮胎寿命控制得比较干净，没有出现明显的退化崩盘。");
    }

    const weather = raceDecision136("weather"),
      control = raceDecision136("control");
    if (weather) {
      const qv = Number(weather.quality || 72);
      if (qv >= 84)
        lines.push("天气窗口处理得很及时，crossover 没有成为损失点。");
      else if (qv < 68)
        lines.push("天气判断没有踩中窗口，干湿转换阶段损失明显。");
    } else if (control) {
      const qv = Number(control.quality || 72),
        type = control.controlType || "Race Control";
      if (qv >= 84)
        lines.push(`${type} 阶段的处理很干净，没有浪费比赛控制带来的窗口。`);
      else if (qv < 68)
        lines.push(`${type} 之后的选择代价偏高，重启/进站阶段留下了时间。`);
    }
    return lines.slice(0, 3);
  }
  function compactResult136() {
    const host = document.querySelector("#weekendresult .resultSummary");
    if (!host || !state?.weekend?.raceResult) return;
    const g = grade136();
    state.weekend.raceGradeV4136 = g;
    const lines = comments136();
    host.innerHTML = `<h2 id="resultRaceName" style="display:none"></h2><p id="resultNarrative" style="display:none"></p><div id="resultDecision" style="display:none"></div><div class="compactRaceRatingV4136"><div class="grade">${g}</div><div class="subtitle ${g === "S" ? "lovely" : ""}">${esc136(SUBTITLE_V4136[g] || SUBTITLE_V4136.B)}</div>${lines.length ? `<div class="compactRaceCommentsV4136">${lines.map((x) => `<p>${esc136(x)}</p>`).join("")}</div>` : ""}</div>`;
  }
  const prev = window.renderWeekendResult || renderWeekendResult;
  window.renderWeekendResult = function () {
    const out = prev.apply(this, arguments);
    try {
      compactResult136();
    } catch (e) {
      console.warn("v4136 concise race review", e);
    }
    return out;
  };
  try {
    renderWeekendResult = window.renderWeekendResult;
  } catch (_) {}
  const advPrev = window.advanceRound || advanceRound;
  window.advanceRound = function () {
    const out = advPrev.apply(this, arguments);
    try {
      if (state?.weekend) {
        delete state.weekend.raceGradeV4136;
        delete state.weekend.raceGradeV4135;
      }
    } catch (_) {}
    return out;
  };
  try {
    advanceRound = window.advanceRound;
  } catch (_) {}
  const snapPrev = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = snapPrev.apply(this, arguments);
    s.version = 4136;
    s.majorVersion = "4.0";
    s.featureSet =
      "v40-strategy-review-patch13.6-no-track-events-concise-review";
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
})();

/* v40-patch137-long-report-script */

(() => {
  const clamp137 = (v, a, b) => Math.max(a, Math.min(b, v));
  const tyreName137 = (c) =>
    ({ S: "SOFT", M: "MEDIUM", H: "HARD", I: "INTERMEDIATE", W: "WET" })[c] ||
    c ||
    "—";
  const wxName137 = (w) =>
    ({
      dry: "干地",
      cloud: "多云",
      damp: "潮湿",
      wet: "湿地",
      extreme: "积水",
    })[w] ||
    w ||
    "未知";
  const esc137 = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[m],
    );

  function expected137(grid) {
    try {
      const x = expectedRangeV10("race");
      if (Array.isArray(x) && x.length >= 2)
        return [Number(x[0]), Number(x[1])];
    } catch (_) {}
    return [Math.max(1, grid - 2), Math.min(drivers.length, grid + 2)];
  }
  function carRank137() {
    try {
      const order = Object.keys(teams)
        .map((t) => [t, Number(trackFitV10(t, "race"))])
        .sort((a, b) => b[1] - a[1]);
      return Math.max(1, order.findIndex((x) => x[0] === selected?.[1]) + 1);
    } catch (_) {
      return null;
    }
  }
  function decisions137() {
    return state?.weekend?.strategyReviewV413?.decisions || [];
  }
  function bestDecision137(kind) {
    return (
      decisions137()
        .filter((d) => (kind === "control" ? !!d.controlType : d.kind === kind))
        .sort((a, b) => Number(b.quality || 0) - Number(a.quality || 0))[0] ||
      null
    );
  }
  function report137() {
    const rr = state?.weekend?.raceResult,
      q = state?.weekend?.qualResult;
    if (!rr || !q) return "";
    const grid = Number(q.position || drivers.length),
      finish = Number(rr.position || drivers.length),
      move = grid - finish,
      exp = expected137(grid),
      cr = carRank137();
    const m = state?.weekend?.tyreWearV4133,
      wx = state?.weekend?.weatherV410 || {},
      route = state?.weekend?.tyreRouteV4133 || [];
    const ps = [];

    if (rr.dnf) {
      const lap = rr.retirementLap
        ? `第 ${rr.retirementLap} 圈左右`
        : "比赛过程中";
      ps.push(
        `从 P${grid} 发车后，这场比赛最终没有跑到终点。${lap}出现的故障、事故或高风险状态让此前建立的节奏失去了意义；在退赛发生以前，比赛仍然按照当时的赛车竞争力与轮胎计划推进，因此这次结果不会被简单归因于单一策略选择。`,
      );
    } else if (move >= 4) {
      ps.push(
        `这是一次很完整的向前推进。你从 P${grid} 发车，最终来到 P${finish}，净提升 ${move} 个位置。比赛没有依赖已经取消的随机赛道事件来制造结果，位置主要来自赛车长距离速度、轮胎阶段、进站时间、实际路面状态与 Race Control 的共同作用；能够把这么多位置真正带回终点，说明这场比赛的整体执行明显高于发车位。`,
      );
    } else if (move >= 1) {
      ps.push(
        `你从 P${grid} 发车，最终以 P${finish} 完赛，向前提升了 ${move} 个位置。整个过程更像是一场逐步兑现速度的比赛：前半程没有让轮胎或进站窗口把自己拖出竞争区，后半程再利用剩余轮胎状态和赛道位置把结果守住，最终成绩比发车位置更好。`,
      );
    } else if (move <= -4) {
      ps.push(
        `这场比赛从 P${grid} 发车后逐渐变得困难，最终只以 P${finish} 完赛，净损失 ${Math.abs(move)} 个位置。这样的下滑通常不是一个瞬间造成的，而是轮胎状态、额外进站、维修区执行、出站交通或天气选择不断累积时间损失；一旦重新掉进车群，之后就必须再次完成超车，损失会比单纯的一次进站时间更大。`,
      );
    } else if (move <= -1) {
      ps.push(
        `你从 P${grid} 发车，最终以 P${finish} 完赛，丢掉了 ${Math.abs(move)} 个位置。基础速度并没有完全崩掉，但整场比赛没有把发车优势完整兑现：轮胎窗口、进站阶段和赛道位置中的小损失不断叠加，最后反映成了终点名次。`,
      );
    } else {
      ps.push(
        `你从 P${grid} 发车并以 P${finish} 完赛，最终位置没有变化。结果看上去很平静，但这并不意味着整场没有策略成本；轮胎寿命、进站损失和前后车节奏仍然在不断改变净比赛时间，只是这些变化最后彼此抵消，让你回到了和发车时相同的位置。`,
      );
    }

    if (m) {
      const routeText = route.length
        ? route.map(tyreName137).join(" → ")
        : "未记录";
      if (Number(m.crisisCount || 0) > 0) {
        ps.push(
          `轮胎策略是这场比赛最明显的损失来源之一。基础路线为 ${routeText}，其中出现了 ${Number(m.crisisCount || 0)} 次严重的干湿地配方错配；这类情况在模型中不再只是普通的策略扣分，而会直接触发抓地危机，大幅吞掉圈速和赛道位置，并在湿地坚持干胎时显著提高失控风险。`,
        );
      } else if (Number(m.extraStops || 0) >= 2) {
        ps.push(
          `你选择了 ${route.length} 个 STINT、总计 ${Number(m.stops || route.length - 1)} 次计划进站的 ${routeText}。更多新胎确实降低了单段磨损压力，但三停或更多意味着反复支付维修区时间，同时增加慢停、换胎失误和出站掉入车群的暴露次数；本场额外进站与交通折算大约造成 ${Math.max(1, Math.round(Number(m.pitPos || 0)))} 个位置级别的净损失，因此新胎速度并没有免费得到。`,
        );
      } else if (Number(m.extraStops || 0) === 1) {
        ps.push(
          `基础轮胎路线是 ${routeText}，这是一套两停思路。相比标准一停，你用额外一次进站换取更年轻的轮胎和更稳定的后程抓地，但同时承担了一次完整的维修区与出站交通成本；本场平均预计胎况约 ${Math.round(Number(m.avgHealth || 0))}%，这套方案最终值不值得，取决于新胎圈速是否真正覆盖了那次额外停车。`,
        );
      } else {
        const softBad = (m.stints || []).some(
          (s) => s.code === "S" && Number(s.health || 100) < 90,
        );
        ps.push(
          `基础轮胎路线为 ${routeText}，总计 ${Number(m.stops || 1)} 次计划进站，平均预计胎况约 ${Math.round(Number(m.avgHealth || 0))}%。${softBad ? "其中 Soft 在某一阶段跌破 90%，进入了明显性能衰减区，后半段速度因此受到实际惩罚。" : "轮胎没有出现灾难性的寿命崩盘，因此这部分更像是正常的一停时间管理，而不是比赛结果的主要负担。"}`,
        );
      }
    }

    const actual = Array.isArray(wx.actual) ? wx.actual : [];
    if (actual.length) {
      const mixed = actual.some((x) => ["damp", "wet", "extreme"].includes(x));
      if (mixed)
        ps.push(
          `实际赛道状态经历了 ${actual.map(wxName137).join(" → ")}。本版不再生成独立天气事件，天气影响全部通过各个 STINT 与当时路面是否匹配、轮胎磨损和抓地危机直接结算。`,
        );
      else
        ps.push(
          `实际天气基本维持在${wxName137(actual[0])}条件，比赛没有独立天气决策事件，轮胎寿命与正常进站成本因此更加直接。`,
        );
    }

    const cd = bestDecision137("control"),
      logs = state?.weekend?.raceControlLogV411 || [];
    if (cd || logs.length) {
      const qv = Number(cd?.quality || 76),
        type = cd?.controlType || "Race Control";
      ps.push(
        `比赛中还经历了 ${type} 阶段。${qv >= 84 ? "这次处理比较干净，较低的进站成本或重启窗口没有被浪费。" : qv < 68 ? "这次阶段没有处理好，进站或重启选择又留下了一部分时间。" : "这次中断改变了原有节奏，但最终没有彻底改写比赛结果。"}`,
      );
    } else {
      ps.push(
        `本场没有 VSC、Safety Car 或红旗提供低成本进站窗口，所有计划停车基本都按正常维修区代价结算，因此多停一次的成本会更加直接。`,
      );
    }

    if (!rr.dnf) {
      if (finish < exp[0])
        ps.push(
          `赛前模型给出的常规竞争区间大约是 P${exp[0]}–P${exp[1]}，最终 P${finish} 明显高于这个范围。${cr ? `以本车在本站大约第 ${cr} 的赛道适配水平来看，` : ""}这是一次超过赛车正常基准的结果。`,
        );
      else if (finish > exp[1])
        ps.push(
          `赛前模型原本预计大约在 P${exp[0]}–P${exp[1]}，最终 P${finish} 低于常规区间。${cr ? `本车本站赛道适配大约排在第 ${cr}，` : ""}说明可用的基础性能没有被完整转化成最终成绩。`,
        );
      else
        ps.push(
          `最终 P${finish} 基本落在赛前预计的 P${exp[0]}–P${exp[1]} 区间内，整体结果与赛车在本站的正常竞争力接近。`,
        );
    }
    return ps.slice(0, 5).join("");
  }

  function restoreLong137() {
    const host = document.querySelector("#weekendresult .resultSummary"),
      rr = state?.weekend?.raceResult;
    if (!host || !rr) return;
    let race = "比赛报告";
    try {
      race = currentRace()?.[1] || race;
    } catch (_) {}
    const text = report137();
    host.innerHTML = `<div class="kicker">RACE REPORT</div><div class="longRaceReportV4137"><h2 class="sectiontitle" id="resultRaceName" style="margin-top:5px">${esc137(race)}</h2><p id="resultNarrative">${esc137(text)}</p><div id="resultDecision" style="display:none"></div><div class="reportMetaV4137">报告基于本场实际发车/完赛位置、轮胎 STINT 与磨损、进站/交通成本、实际路面状态和 Race Control 过程生成。</div></div>`;
  }
  const prev = window.renderWeekendResult || renderWeekendResult;
  window.renderWeekendResult = function () {
    const out = prev.apply(this, arguments);
    try {
      restoreLong137();
    } catch (e) {
      console.warn("v4137 long race report", e);
    }
    return out;
  };
  try {
    renderWeekendResult = window.renderWeekendResult;
  } catch (_) {}
  const snapPrev = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = snapPrev.apply(this, arguments);
    s.version = 4137;
    s.majorVersion = "4.0";
    s.featureSet = "v40-strategy-review-patch13.7-long-form-race-report";
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
})();

/* v40-patch139-clean-race-variables */

(() => {
  function purgeRelation139() {
    if (!state) return;
    delete state.teamRelation;
    delete state.rivalry;
    delete state.relationHistoryV16;
    delete state.pendingOrderRelationV16;
  }
  try {
    relationRaceV14 = function () {
      return 0;
    };
  } catch (_) {}
  try {
    makeTeamOrderEventV10 = function () {
      return null;
    };
  } catch (_) {}
  try {
    updateRivalryAfterRaceV10 = function () {};
  } catch (_) {}
  try {
    renderMedia = function () {};
  } catch (_) {}
  const oldOpen139 = window.openModule || openModule;
  window.openModule = function (id) {
    if (id === "media") {
      showView("career");
      return;
    }
    return oldOpen139.apply(this, arguments);
  };
  try {
    openModule = window.openModule;
  } catch (_) {}
  const oldStart139 = window.startCareer || startCareer;
  window.startCareer = function () {
    const r = oldStart139.apply(this, arguments);
    purgeRelation139();
    try {
      autosave?.();
    } catch (_) {}
    return r;
  };
  try {
    startCareer = window.startCareer;
  } catch (_) {}
  const oldNext139 = window.startNextSeasonV11 || startNextSeasonV11;
  window.startNextSeasonV11 = function () {
    const r = oldNext139.apply(this, arguments);
    purgeRelation139();
    try {
      autosave?.();
    } catch (_) {}
    return r;
  };
  try {
    startNextSeasonV11 = window.startNextSeasonV11;
  } catch (_) {}
  const oldRestore139 = window.restoreSnapshot || restoreSnapshot;
  window.restoreSnapshot = function () {
    const r = oldRestore139.apply(this, arguments);
    if (r) purgeRelation139();
    return r;
  };
  try {
    restoreSnapshot = window.restoreSnapshot;
  } catch (_) {}
  const oldHub139 = window.renderHub || renderHub;
  window.renderHub = function () {
    const r = oldHub139.apply(this, arguments);
    purgeRelation139();
    return r;
  };
  try {
    renderHub = window.renderHub;
  } catch (_) {}
  const oldSnap139 = window.snapshot || snapshot;
  window.snapshot = function () {
    purgeRelation139();
    const s = oldSnap139.apply(this, arguments);
    if (s?.state) {
      delete s.state.teamRelation;
      delete s.state.rivalry;
      delete s.state.relationHistoryV16;
      delete s.state.pendingOrderRelationV16;
    }
    if (s) {
      s.version = 4139;
      s.majorVersion = "4.0";
      s.featureSet = "v40-strategy-review-patch13.9-clean-race-variables";
    }
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
  if (typeof state !== "undefined") purgeRelation139();
})();

/* v40-patch1310-balance-version */

(() => {
  const oldSnap1310 = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = oldSnap1310.apply(this, arguments);
    if (s) {
      s.version = 4140;
      s.majorVersion = "4.0";
      s.featureSet = "v40-strategy-review-patch13.10-race-balance-50-15-35-10";
    }
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
})();

/* v40-patch1311-standings-teams-script */

(() => {
  const esc1311 = (s) =>
    String(s ?? "").replace(
      /[&<>\"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '\"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const year1311 = () => {
    try {
      return Number(seasonYearV11?.() || 2026);
    } catch (_) {
      return 2026;
    }
  };
  const teamAccent1311 = {
    "Red Bull Racing": "#3154a5",
    Ferrari: "#e10600",
    McLaren: "#ff8700",
    Mercedes: "#00a19c",
    "Aston Martin": "#229971",
    Williams: "#2d63d7",
    Alpine: "#e85a9c",
    "Haas F1 Team": "#8e949b",
    "Racing Bulls": "#5a73d9",
    Audi: "#bb0a1e",
    Cadillac: "#c7a76a",
  };
  function ensureStats1311() {
    if (!state || !selected) return;
    if (!state.driverSeasonStats) state.driverSeasonStats = {};
    drivers.forEach((d) => {
      const st =
        state.driverSeasonStats[d[0]] || (state.driverSeasonStats[d[0]] = {});
      ["wins", "podiums", "poles", "dnfs", "fastestLaps"].forEach((k) => {
        if (st[k] == null) st[k] = 0;
      });
    });
    if (!state.seasonStatProcessedV1311) state.seasonStatProcessedV1311 = {};
  }
  function fallbackFastest1311(field) {
    const live = (field || []).filter(
      (x) => !x.dnf && !x.dns && x.status !== "DNS",
    );
    if (!live.length) return null;
    return (
      live
        .map((x) => ({ x, score: Number(x.total || 0) + Math.random() * 3 }))
        .sort((a, b) => b.score - a.score)[0]?.x?.name || null
    );
  }
  function recordRoundStats1311(field) {
    ensureStats1311();
    const key = `${year1311()}-${Number(state.round || 0)}`;
    if (state.seasonStatProcessedV1311[key]) return;
    const qf = state.weekend?.qualField || [];
    const pole = qf
      .filter((x) => !x.dnf && !x.dns && x.status !== "DNS")
      .slice()
      .sort((a, b) => Number(a.position || 99) - Number(b.position || 99))[0];
    /* The player pole is already counted by the live qualifying flow. AI poles were not, so fill only AI here. */
    if (pole?.name && pole.name !== selected[0]) {
      const st = state.driverSeasonStats[pole.name];
      if (st) st.poles = Number(st.poles || 0) + 1;
    }
    const rr = state.weekend?.raceResult;
    let fastest =
      rr?.fastestLapV3 || fallbackFastest1311(field || rr?.field || []);
    if (rr && fastest && !rr.fastestLapV3) rr.fastestLapV3 = fastest;
    if (fastest && state.driverSeasonStats[fastest])
      state.driverSeasonStats[fastest].fastestLaps =
        Number(state.driverSeasonStats[fastest].fastestLaps || 0) + 1;
    const sr = (state.seasonResults || []).find(
      (x) => Number(x.round) === Number(state.round),
    );
    if (sr) {
      sr.poleV1311 = pole?.name || null;
      sr.fastestLapV1311 = fastest || null;
    }
    state.seasonStatProcessedV1311[key] = {
      pole: pole?.name || null,
      fastest: fastest || null,
    };
  }
  function seasonStatsRows1311() {
    ensureStats1311();
    return Object.entries(state.driverStandings || {})
      .sort(
        (a, b) =>
          Number(b[1] || 0) - Number(a[1] || 0) ||
          drivers.findIndex((d) => d[0] === a[0]) -
            drivers.findIndex((d) => d[0] === b[0]),
      )
      .map(([name, pts], i) => {
        const d = drivers.find((x) => x[0] === name),
          st = state.driverSeasonStats[name] || {};
        return `<tr class="${name === selected[0] ? "mine" : ""}"><td class="rankV1311">${i + 1}</td><td class="nameV1311">${esc1311(name)}</td><td class="teamV1311">${esc1311(d?.[1] || "—")}</td><td class="pointsV1311"><b>${Number(pts || 0)}</b></td><td>${Number(st.wins || 0)}</td><td>${Number(st.poles || 0)}</td><td>${Number(st.podiums || 0)}</td><td class="fastV1311">${Number(st.fastestLaps || 0)}</td><td>${Number(st.dnfs || 0)}</td></tr>`;
      })
      .join("");
  }
  function injectSeasonStats1311() {
    if (
      !selected ||
      !document.getElementById("season")?.classList.contains("active")
    )
      return;
    ensureStats1311();
    const content = document.getElementById("seasonContent"),
      hero = content?.querySelector(".standingsHeroV40");
    if (!content || !hero) return;
    document.getElementById("seasonDriverStatsV1311")?.remove();
    hero.insertAdjacentHTML(
      "afterend",
      `<div class="card seasonDriverStatsV1311" id="seasonDriverStatsV1311"><div class="seasonDriverStatsHeadV1311"><div><div class="kicker">SEASON DRIVER STATS</div><h2>${year1311()} 单赛季车手积分榜</h2></div><div class="small">胜场 · 杆位 · 领奖台 · 最快圈 · 未完赛</div></div><div class="seasonDriverStatsScrollV1311"><table class="seasonDriverStatsTableV1311"><thead><tr><th>#</th><th>车手</th><th>车队</th><th>积分</th><th>胜场</th><th>杆位</th><th>领奖台</th><th>最快圈</th><th>未完赛</th></tr></thead><tbody>${seasonStatsRows1311()}</tbody></table></div></div>`,
    );
  }
  window.injectSeasonStatsV1311 = injectSeasonStats1311;

  function ensureDriverTeamsLink1311() {
    const card = document.querySelector("#career .driverhubclick");
    if (!card || card.querySelector(".driverHubTeamsLinkV1311")) return;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "driverHubTeamsLinkV1311";
    b.innerHTML = "<b>点击查看全部车队</b><span>→</span>";
    b.onclick = (e) => {
      e.stopPropagation();
      openAllTeamsV1311();
    };
    card.appendChild(b);
  }
  function teamRank1311(team) {
    const arr = Object.entries(state?.teamStandings || {}).sort(
      (a, b) => Number(b[1] || 0) - Number(a[1] || 0),
    );
    const i = arr.findIndex((x) => x[0] === team);
    return i < 0 ? "—" : i + 1;
  }
  function carScore1311(team) {
    try {
      return Math.round(
        Number(teamCarIndexV10(team) || teams?.[team]?.ovr || 0),
      );
    } catch (_) {
      return Math.round(Number(teams?.[team]?.ovr || 0));
    }
  }
  function initials1311(team) {
    return (
      String(team)
        .split(/\s+/)
        .map((x) => x[0])
        .join("")
        .replace(/[^A-Za-z]/g, "")
        .slice(0, 3)
        .toUpperCase() || "F1"
    );
  }
  function driverCard1311(d, accent) {
    if (!d)
      return `<div class="teamDriverV1311"><div class="teamDriverLineV1311"><strong>TBA</strong><em>—</em></div><small>席位待确认</small><div class="driverMiniStatV1311"><span>OVR</span><b>—</b></div></div>`;
    const p = driverProfiles?.[d[0]] || {},
      st = state?.driverSeasonStats?.[d[0]] || {};
    return `<div class="teamDriverV1311 ${d[0] === selected?.[0] ? "me" : ""}"><div class="teamDriverLineV1311"><strong>${esc1311(d[0])}</strong><em>#${esc1311(p.number ?? "—")}</em></div><small>${esc1311(p.nation || "")} · ${Number(state?.driverStandings?.[d[0]] || 0)} 分</small><div class="driverMiniStatV1311"><span>OVR <b>${Number(d[2] || 0)}</b></span><span>胜 <b>${Number(st.wins || 0)}</b></span></div></div>`;
  }
  function renderAllTeams1311() {
    ensureStats1311();
    const grid = document.getElementById("allTeamsGridV1311"),
      sum = document.getElementById("teamsGridSummaryV1311");
    if (!grid) return;
    const names = Object.keys(teams || {}),
      order = names.slice().sort((a, b) => {
        const ra = teamRank1311(a),
          rb = teamRank1311(b);
        if (ra === "—" && rb === "—") return carScore1311(b) - carScore1311(a);
        if (ra === "—") return 1;
        if (rb === "—") return -1;
        return ra - rb;
      });
    if (sum)
      sum.innerHTML = `<div><span>TEAMS</span><b>${names.length}</b></div><div><span>DRIVERS</span><b>${drivers.length}</b></div><div><span>YOUR TEAM</span><b>${esc1311(selected?.[1] || "—")}</b></div>`;
    grid.innerHTML = order
      .map((team) => {
        const accent = teamAccent1311[team] || "#d1201b",
          roster = drivers.filter((d) => d[1] === team),
          rank = teamRank1311(team),
          score = carScore1311(team);
        return `<div class="teamRosterCardV1311 ${team === selected?.[1] ? "mine" : ""}" style="--teamAccent:${accent}"><div class="teamRosterWaterV1311">${esc1311(initials1311(team))}</div><div class="teamRosterTopV1311"><div><div class="teamRosterRankV1311">${rank === "—" ? "WCC · —" : `WCC · P${rank}`}</div><h3>${esc1311(team)}</h3></div><div class="teamRosterMetaV1311"><span>CAR INDEX</span><b>${score}</b></div></div><div class="teamDriversV1311">${driverCard1311(roster[0], accent)}${driverCard1311(roster[1], accent)}${roster
          .slice(2)
          .map((d) => driverCard1311(d, accent))
          .join("")}</div></div>`;
      })
      .join("");
  }
  function ensureTeamsView1311() {
    let v = document.getElementById("teamsgridV1311");
    if (v) return v;
    v = document.createElement("section");
    v.id = "teamsgridV1311";
    v.className = "view";
    v.innerHTML = `<div class="wrap"><div class="modulehead"><div><div class="kicker">F1 GRID · ${year1311()}</div><h1>全部车队</h1></div><button class="btn" onclick="showView('career')">← 赛季总部</button></div><div class="teamsGridHeroV1311"><div class="kicker">PADDOCK DIRECTORY</div><h2>${year1311()} F1 GRID</h2><p>查看当前存档中的实时车手组合。转会、续约、传奇替换或自建车队都会直接反映在这里。</p><div class="teamsGridSummaryV1311" id="teamsGridSummaryV1311"></div></div><div class="allTeamsGridV1311" id="allTeamsGridV1311"></div></div>`;
    document.body.appendChild(v);
    return v;
  }
  window.openAllTeamsV1311 = function () {
    if (!selected) return;
    ensureTeamsView1311();
    renderAllTeams1311();
    showView("teamsgridV1311");
  };

  const oldComplete1311 = window.completeRaceResultV10 || completeRaceResultV10;
  window.completeRaceResultV10 = function (field, mine, noBonus = false) {
    const r = oldComplete1311.apply(this, arguments);
    try {
      recordRoundStats1311(field);
      autosave?.();
    } catch (e) {
      console.warn("v1311 season stats", e);
    }
    return r;
  };
  try {
    completeRaceResultV10 = window.completeRaceResultV10;
  } catch (_) {}
  const oldOpen1311 = window.openModule || openModule;
  window.openModule = function (id) {
    const r = oldOpen1311.apply(this, arguments);
    if (id === "season") setTimeout(injectSeasonStats1311, 0);
    return r;
  };
  try {
    openModule = window.openModule;
  } catch (_) {}
  const oldHub1311 = window.renderHub || renderHub;
  window.renderHub = function () {
    const r = oldHub1311.apply(this, arguments);
    try {
      ensureStats1311();
      ensureDriverTeamsLink1311();
    } catch (_) {}
    return r;
  };
  try {
    renderHub = window.renderHub;
  } catch (_) {}
  const oldRestore1311 = window.restoreSnapshot || restoreSnapshot;
  window.restoreSnapshot = function () {
    const r = oldRestore1311.apply(this, arguments);
    if (r) {
      ensureStats1311();
      ensureDriverTeamsLink1311();
    }
    return r;
  };
  try {
    restoreSnapshot = window.restoreSnapshot;
  } catch (_) {}
  const oldStart1311 = window.startCareer || startCareer;
  window.startCareer = function () {
    const r = oldStart1311.apply(this, arguments);
    try {
      ensureStats1311();
      state.seasonStatProcessedV1311 = {};
      ensureDriverTeamsLink1311();
    } catch (_) {}
    return r;
  };
  try {
    startCareer = window.startCareer;
  } catch (_) {}
  const oldNext1311 = window.startNextSeasonV11 || startNextSeasonV11;
  window.startNextSeasonV11 = function () {
    const r = oldNext1311.apply(this, arguments);
    try {
      ensureStats1311();
      state.seasonStatProcessedV1311 = {};
      ensureDriverTeamsLink1311();
    } catch (_) {}
    return r;
  };
  try {
    startNextSeasonV11 = window.startNextSeasonV11;
  } catch (_) {}
  const oldSnap1311 = window.snapshot || snapshot;
  window.snapshot = function () {
    ensureStats1311();
    const s = oldSnap1311.apply(this, arguments);
    if (s) {
      s.version = 4141;
      s.majorVersion = "4.0";
      s.featureSet = "v40-strategy-review-patch13.11-season-stats-team-grid";
    }
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
  setTimeout(() => {
    if (selected) {
      ensureStats1311();
      ensureDriverTeamsLink1311();
      if (document.getElementById("season")?.classList.contains("active"))
        injectSeasonStats1311();
    }
  }, 0);
})();

/* v40-patch1312-home-history-script */

(() => {
  const esc1312 = (s) =>
    String(s ?? "").replace(
      /[&<>\"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '\"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const curYear1312 = () => {
    try {
      return Number(seasonYearV11?.() || 2026);
    } catch (_) {
      return 2026;
    }
  };
  function historyYears1312() {
    const all = state?.standingsTimelineV40 || {};
    return Object.keys(all)
      .map(Number)
      .filter((y) => all[String(y)] && Object.keys(all[String(y)]).length)
      .sort((a, b) => b - a);
  }
  function lastSnapshot1312(year) {
    const b = state?.standingsTimelineV40?.[String(year)] || {},
      rs = Object.keys(b)
        .map(Number)
        .sort((a, b) => a - b);
    return rs.length ? b[rs[rs.length - 1]] : null;
  }
  function injectSeasonHistory1312() {
    if (
      !selected ||
      !document.getElementById("season")?.classList.contains("active")
    )
      return;
    document.getElementById("seasonHistoryV1312")?.remove();
    const content = document.getElementById("seasonContent");
    if (!content) return;
    const years = historyYears1312().filter((y) => y < curYear1312());
    const box = document.createElement("div");
    box.id = "seasonHistoryV1312";
    box.className = "card seasonHistoryV1312";
    let body = "";
    if (!years.length)
      body =
        '<div class="seasonHistoryEmptyV1312">完成当前赛季后，这里会保留此前赛季的最终 WDC / WCC，以及每一站的完整比赛成绩。进入下一年不会清掉这些记录。</div>';
    else
      body = `<div class="seasonHistoryGridV1312">${years
        .map((y) => {
          const s = lastSnapshot1312(y),
            bucket = state.standingsTimelineV40[String(y)] || {},
            rounds = Object.keys(bucket).length,
            dc = s?.wdc?.[0]?.name || "—",
            cc = s?.wcc?.[0]?.team || "—";
          return `<div class="seasonHistoryCardV1312" onclick="openSeasonArchiveV1312(${y})"><div class="year">${y}</div><div class="meta">${rounds} ROUNDS · 点击查看完整赛季</div><div class="champ"><span>WDC <b>${esc1312(dc)}</b></span><span>WCC <b>${esc1312(cc)}</b></span></div></div>`;
        })
        .join("")}</div>`;
    box.innerHTML = `<div class="seasonHistoryHeadV1312"><div><div class="kicker">CAREER HISTORY</div><h2>往期赛季成绩</h2></div><div class="small">保留历年积分榜与分站结果</div></div>${body}`;
    const anchor =
      document.getElementById("seasonDriverStatsV1311") ||
      content.querySelector(".standingsArchiveV40") ||
      content.lastElementChild;
    if (anchor?.parentNode) anchor.insertAdjacentElement("afterend", box);
    else content.appendChild(box);
  }
  window.injectSeasonHistoryV1312 = injectSeasonHistory1312;

  let histState1312 = { year: null, round: null, tab: "result" };
  function histBucket1312() {
    return state?.standingsTimelineV40?.[String(histState1312.year)] || {};
  }
  function rows1312(s, tab) {
    if (!s)
      return '<div class="seasonHistoryEmptyV1312">这一站没有可用数据。</div>';
    if (tab === "wdc")
      return `<div class="histTableWrapV1312"><table class="histTableV1312"><thead><tr><th>#</th><th>车手</th><th>车队</th><th>积分</th></tr></thead><tbody>${(s.wdc || []).map((x) => `<tr class="${x.name === selected?.[0] ? "mine" : ""}"><td>${Number(x.rank || 0)}</td><td>${esc1312(x.name)}</td><td>${esc1312(x.team || "—")}</td><td><b>${Number(x.points || 0)}</b></td></tr>`).join("")}</tbody></table></div>`;
    if (tab === "wcc")
      return `<div class="histTableWrapV1312"><table class="histTableV1312"><thead><tr><th>#</th><th>车队</th><th>积分</th></tr></thead><tbody>${(s.wcc || []).map((x) => `<tr class="${x.team === selected?.[1] ? "mine" : ""}"><td>${Number(x.rank || 0)}</td><td>${esc1312(x.team)}</td><td><b>${Number(x.points || 0)}</b></td></tr>`).join("")}</tbody></table></div>`;
    return `<div class="histTableWrapV1312"><table class="histTableV1312"><thead><tr><th>#</th><th>车手</th><th>车队</th><th>积分</th><th>状态</th></tr></thead><tbody>${(
      s.result || []
    )
      .map((x) => {
        const bad =
          x.dns || x.status === "DNS"
            ? "DNS"
            : x.dnf
              ? "DNF"
              : "P" + Number(x.position || 0);
        return `<tr class="${x.name === selected?.[0] ? "mine" : ""}"><td>${Number(x.position || 0)}</td><td>${esc1312(x.name)}</td><td>${esc1312(x.team || "—")}</td><td><b>+${Number(x.points || 0)}</b></td><td class="${x.dnf || x.dns ? "histDnfV1312" : ""}">${bad}</td></tr>`;
      })
      .join("")}</tbody></table></div>`;
  }
  function renderHistModal1312() {
    const b = histBucket1312(),
      rounds = Object.keys(b)
        .map(Number)
        .sort((a, b) => a - b);
    if (!rounds.length) return;
    if (!histState1312.round || !b[histState1312.round])
      histState1312.round = rounds[rounds.length - 1];
    const s = b[histState1312.round],
      last = b[rounds[rounds.length - 1]],
      wdc = last?.wdc?.[0],
      wcc = last?.wcc?.[0];
    const mb = document.getElementById("modalBody");
    if (!mb) return;
    document.getElementById("modalTitle").textContent =
      `${histState1312.year} 赛季档案`;
    mb.innerHTML = `<div style="padding:14px"><div class="histSeasonHeroV1312"><div class="kicker">CHAMPIONSHIP ARCHIVE</div><h2>${histState1312.year} SEASON</h2><div class="histSeasonSummaryV1312"><div><span>WDC</span><b>${esc1312(wdc?.name || "—")} · ${Number(wdc?.points || 0)}分</b></div><div><span>WCC</span><b>${esc1312(wcc?.team || "—")} · ${Number(wcc?.points || 0)}分</b></div><div><span>ROUNDS</span><b>${rounds.length}</b></div></div></div><div class="histRoundsV1312">${rounds.map((r) => `<button class="histRoundBtnV1312 ${r === histState1312.round ? "active" : ""}" onclick="selectHistRoundV1312(${r})">R${String(r).padStart(2, "0")} · ${esc1312(String(b[r]?.race || "").replace("大奖赛", ""))}</button>`).join("")}</div><div class="histTabsV1312"><button class="${histState1312.tab === "wdc" ? "active" : ""}" onclick="setHistTabV1312('wdc')">WDC 排名</button><button class="${histState1312.tab === "wcc" ? "active" : ""}" onclick="setHistTabV1312('wcc')">WCC 排名</button><button class="${histState1312.tab === "result" ? "active" : ""}" onclick="setHistTabV1312('result')">该站成绩</button></div><div class="small" style="margin:5px 0 8px">R${String(s.round).padStart(2, "0")} · ${esc1312(s.race || "")}</div>${rows1312(s, histState1312.tab)}</div>`;
  }
  window.openSeasonArchiveV1312 = function (year) {
    histState1312 = { year: Number(year), round: null, tab: "result" };
    const b = state?.standingsTimelineV40?.[String(year)] || {};
    if (!Object.keys(b).length) return;
    document.getElementById("overlay")?.classList.add("open");
    renderHistModal1312();
  };
  window.selectHistRoundV1312 = function (r) {
    histState1312.round = Number(r);
    renderHistModal1312();
  };
  window.setHistTabV1312 = function (t) {
    histState1312.tab = ["wdc", "wcc", "result"].includes(t) ? t : "result";
    renderHistModal1312();
  };

  const oldOpen1312 = window.openModule || openModule;
  window.openModule = function (id) {
    const r = oldOpen1312.apply(this, arguments);
    if (id === "season") setTimeout(injectSeasonHistory1312, 24);
    return r;
  };
  try {
    openModule = window.openModule;
  } catch (_) {}
  const oldNext1312 = window.startNextSeasonV11 || startNextSeasonV11;
  window.startNextSeasonV11 = function () {
    const r = oldNext1312.apply(this, arguments);
    setTimeout(() => {
      if (document.getElementById("season")?.classList.contains("active"))
        injectSeasonHistory1312();
    }, 0);
    return r;
  };
  try {
    startNextSeasonV11 = window.startNextSeasonV11;
  } catch (_) {}
  const oldRestore1312 = window.restoreSnapshot || restoreSnapshot;
  window.restoreSnapshot = function () {
    const r = oldRestore1312.apply(this, arguments);
    if (r && document.getElementById("season")?.classList.contains("active"))
      setTimeout(injectSeasonHistory1312, 20);
    return r;
  };
  try {
    restoreSnapshot = window.restoreSnapshot;
  } catch (_) {}
  const oldSnap1312 = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = oldSnap1312.apply(this, arguments);
    if (s) {
      s.version = 4142;
      s.majorVersion = "4.0";
      s.featureSet = "v40-strategy-review-patch13.12-home-two-column-history";
    }
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
})();

/* v40-patch1313-contract-rating-version */

(() => {
  const oldSnap1313 = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = oldSnap1313.apply(this, arguments);
    if (s) {
      s.version = 4143;
      s.majorVersion = "4.0";
      s.featureSet =
        "v40-strategy-review-patch13.13-max-bilateral-clause-antonelli87";
    }
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
})();

/* v40-patch1314-antonelli-ratings-version */

(() => {
  const oldSnap1314 = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = oldSnap1314.apply(this, arguments);
    if (s) {
      s.version = 4144;
      s.majorVersion = "4.0";
      s.featureSet = "v40-strategy-review-patch13.14-antonelli-full-rating-87";
    }
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
})();

/* v40-patch1315-audit-hardening */

(() => {
  const year1315 = () => {
    try {
      return Number(seasonYearV11?.() || 2026);
    } catch (_) {
      return 2026;
    }
  };
  function resolveMaxIfNeeded1315() {
    try {
      if (
        selected?.[0] === "Max Verstappen" &&
        year1315() === 2026 &&
        state?.maxClauseActivatedV40 &&
        !state?.contract?.nextTeam &&
        !state?.maxClauseDecisionResolvedV40
      ) {
        window.resolveMaxBilateralClauseV40?.();
      }
    } catch (_) {}
  }
  function currentContract1315() {
    try {
      return (
        window.contractInfoV40?.(selected?.[0]) ||
        state?.driverContracts?.[selected?.[0]] ||
        null
      );
    } catch (_) {
      return state?.driverContracts?.[selected?.[0]] || null;
    }
  }
  function hasSeat1315() {
    if (!selected || !state) return false;
    resolveMaxIfNeeded1315();
    if (state.contract?.nextTeam) return true;
    const c = currentContract1315(),
      next = year1315() + 1;
    return !!c && Number(c.end || 0) >= next && !c.rolling;
  }
  window.hasNextSeasonSeatV41315 = hasSeat1315;
  function hardenSeasonAction1315() {
    if (
      !selected ||
      typeof seasonCompleteV14 !== "function" ||
      !seasonCompleteV14()
    )
      return;
    resolveMaxIfNeeded1315();
    const btn = document.querySelector("#seasonCompleteActions .primary");
    if (!btn) return;
    if (hasSeat1315()) {
      btn.textContent = `进入 ${year1315() + 1} 赛季 →`;
      btn.onclick = function () {
        window.startNextSeasonV11?.();
      };
    } else {
      btn.textContent = "无合同 · 返回主菜单";
      btn.onclick = function () {
        if (typeof window.goHomeV15 === "function") window.goHomeV15();
        else showView("home");
      };
    }
  }
  window.hardenSeasonActionV41315 = hardenSeasonAction1315;
  const openPrev1315 = window.openModule || openModule;
  window.openModule = function (id) {
    const out = openPrev1315.apply(this, arguments);
    if (id === "season") setTimeout(hardenSeasonAction1315, 30);
    return out;
  };
  try {
    openModule = window.openModule;
  } catch (_) {}
  const nextPrev1315 = window.startNextSeasonV11 || startNextSeasonV11;
  window.startNextSeasonV11 = function () {
    if (
      selected &&
      typeof seasonCompleteV14 === "function" &&
      seasonCompleteV14() &&
      !hasSeat1315()
    ) {
      try {
        showSeasonFinaleV10();
      } catch (_) {}
      try {
        showToastV14?.("下赛季没有有效席位，无法直接进入新赛季");
      } catch (_) {}
      return false;
    }
    return nextPrev1315.apply(this, arguments);
  };
  try {
    startNextSeasonV11 = window.startNextSeasonV11;
  } catch (_) {}
  const finalePrev1315 = window.showSeasonFinaleV10 || showSeasonFinaleV10;
  window.showSeasonFinaleV10 = function () {
    resolveMaxIfNeeded1315();
    const out = finalePrev1315.apply(this, arguments);
    try {
      const btn = document.getElementById("nextSeasonBtn");
      if (btn && !hasSeat1315()) {
        btn.textContent = "无合同 · 返回主菜单";
        btn.onclick = function () {
          if (typeof window.goHomeV15 === "function") window.goHomeV15();
          else showView("home");
        };
      }
    } catch (_) {}
    return out;
  };
  try {
    showSeasonFinaleV10 = window.showSeasonFinaleV10;
  } catch (_) {}
  function purgeLegacyRelations1315() {
    try {
      delete state.teamRelation;
      delete state.rivalry;
      delete state.relationHistoryV16;
      delete state.pendingOrderRelationV16;
    } catch (_) {}
  }
  const restorePrev1315 = window.restoreSnapshot || restoreSnapshot;
  window.restoreSnapshot = function () {
    const out = restorePrev1315.apply(this, arguments);
    if (out) purgeLegacyRelations1315();
    return out;
  };
  try {
    restoreSnapshot = window.restoreSnapshot;
  } catch (_) {}
  const hubPrev1315 = window.renderHub || renderHub;
  window.renderHub = function () {
    const out = hubPrev1315.apply(this, arguments);
    try {
      const cards = document.querySelectorAll(
        "#career .compactModules>.module",
      );
      if (cards[0]?.querySelector(".modnum"))
        cards[0].querySelector(".modnum").textContent = "MODULE 01";
      if (cards[2]?.querySelector(".modnum"))
        cards[2].querySelector(".modnum").textContent = "MODULE 02";
      if (cards[3]?.querySelector(".modnum"))
        cards[3].querySelector(".modnum").textContent = "MODULE 03";
      if (cards[4]?.querySelector(".modnum"))
        cards[4].querySelector(".modnum").textContent = "MODULE 04";
    } catch (_) {}
    return out;
  };
  try {
    renderHub = window.renderHub;
  } catch (_) {}
  const snapPrev1315 = window.snapshot || snapshot;
  window.snapshot = function () {
    purgeLegacyRelations1315();
    const s = snapPrev1315.apply(this, arguments);
    if (s?.state) {
      delete s.state.teamRelation;
      delete s.state.rivalry;
      delete s.state.relationHistoryV16;
      delete s.state.pendingOrderRelationV16;
    }
    if (s) {
      s.version = 4146;
      s.majorVersion = "4.0";
      s.featureSet = "v40-strategy-review-patch13.16-bahrain-sepang-restore";
    }
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
  try {
    if (calendar?.[15]?.[2] === "雪邦")
      calendar[15][1] = "巴林大奖赛 · 马来西亚";
  } catch (_) {}
  try {
    if (document?.title) document.title = "F1 26 Career Simulator BETA";
  } catch (_) {}
  purgeLegacyRelations1315();
})();

/* beta-patch1317-strategy-script */

(() => {
  const TYRE_NAME_1317 = {
    S: "SOFT",
    M: "MEDIUM",
    H: "HARD",
    I: "INTERMEDIATE",
    W: "WET",
  };
  const APP_1317 = {
    aggressive: ["进攻", "attack"],
    normal: ["标准", ""],
    conservative: ["保守", "safe"],
  };
  const esc1317 = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[m],
    );
  const year1317 = () => {
    try {
      return Number(seasonYearV11?.() || 2026);
    } catch (_) {
      return 2026;
    }
  };
  function weatherStages1317() {
    try {
      const w = state?.weekend?.weatherV410 || window.ensureWeatherV410?.();
      const a = w?.actual;
      return Array.isArray(a) && a.length ? a : ["dry", "dry", "dry"];
    } catch (_) {
      return ["dry", "dry", "dry"];
    }
  }
  function tyreMgmt1317(name) {
    const d = drivers.find((x) => x[0] === name);
    return Number(teams?.[d?.[1]]?.parts?.["轮胎管理"] || 65);
  }
  function demand1317() {
    try {
      return Number(currentDemandV10?.("race", state.round)?.[4] || 20);
    } catch (_) {
      return 20;
    }
  }
  function aiRoute1317(name, approach = "normal") {
    const wx = weatherStages1317(),
      first = wx[0],
      last = wx[wx.length - 1],
      wet = (x) => ["damp", "wet", "extreme"].includes(x),
      severe = (x) => ["wet", "extreme"].includes(x),
      tm = tyreMgmt1317(name),
      td = demand1317();
    if (severe(first)) {
      if (first === "extreme")
        return last === "dry" || last === "cloud"
          ? ["W", "I", "M"]
          : ["W", "I"];
      return last === "dry" || last === "cloud"
        ? ["I", "M"]
        : last === "extreme"
          ? ["I", "W"]
          : ["I", "W"];
    }
    if (first === "damp")
      return last === "dry" || last === "cloud"
        ? ["I", "M"]
        : severe(last)
          ? ["I", "W"]
          : ["I", "M"];
    if (wet(last)) return severe(last) ? ["M", "I", "W"] : ["M", "I"];
    if (approach === "aggressive")
      return tm >= 72 ? ["S", "M", "S"] : ["S", "H"];
    if (approach === "conservative") return ["H", "M"];
    if (td >= 23) return tm >= 73 ? ["M", "H", "M"] : ["M", "H"];
    if (tm >= 82 && Math.random() < 0.32) return ["S", "M"];
    if (Math.random() < 0.22) return ["H", "M"];
    return ["M", "H"];
  }
  function routeText1317(route) {
    return (
      (route || []).map((c) => TYRE_NAME_1317[c] || c || "—").join(" → ") || "—"
    );
  }
  function strategyRecord1317(x, noBonus = false) {
    const isMe = x.name === selected?.[0],
      approach = x.strategy || "normal";
    let route = null,
      source = "AI";
    /* Patch 13.18 may assign the real AI tyre plan before this archive wrapper runs. Honour it instead of regenerating a post-race route. */
    if (Array.isArray(x?.tyreRouteV41317) && x.tyreRouteV41317.length) {
      route = [...x.tyreRouteV41317];
      source = x.strategySourceV41317 || (isMe ? "自动模拟" : "AI");
    } else if (
      isMe &&
      Array.isArray(state?.weekend?.tyreRouteV4133) &&
      state.weekend.tyreRouteV4133.length >= 1
    ) {
      route = [...state.weekend.tyreRouteV4133];
      source = "玩家";
    } else {
      route = aiRoute1317(x.name, approach);
      source = isMe ? "自动模拟" : "AI";
    }
    return {
      name: x.name,
      team: x.team,
      route,
      approach,
      source,
      text: x.strategyTextV41317 || routeText1317(route),
      dnf: !!x.dnf,
      dns: !!x.dns,
      status: x.status || "",
    };
  }
  function recordsForField1317(field, noBonus = false) {
    return (field || []).map((x) => strategyRecord1317(x, noBonus));
  }
  function saveRecords1317(field, noBonus = false) {
    if (!state || !selected) return [];
    const recs = recordsForField1317(field, noBonus);
    state.aiStrategyHistoryV41317 = state.aiStrategyHistoryV41317 || {};
    const y = String(year1317()),
      r = Number(state.round);
    if (!state.aiStrategyHistoryV41317[y])
      state.aiStrategyHistoryV41317[y] = {};
    state.aiStrategyHistoryV41317[y][r] = recs;
    const sr = (state.seasonResults || []).find((x) => Number(x.round) === r);
    if (sr) {
      sr.strategiesV41317 = recs.map((x) => ({ ...x, route: [...x.route] }));
      (sr.field || []).forEach((row) => {
        const z = recs.find((x) => x.name === row.name);
        if (z) {
          row.strategy = z.approach;
          row.tyreRouteV41317 = [...z.route];
          row.strategyTextV41317 = z.text;
          row.strategySourceV41317 = z.source;
        }
      });
    }
    const snap = state.standingsTimelineV40?.[y]?.[r];
    if (snap) {
      snap.strategiesV41317 = recs.map((x) => ({ ...x, route: [...x.route] }));
      (snap.result || []).forEach((row) => {
        const z = recs.find((x) => x.name === row.name);
        if (z) {
          row.strategy = z.approach;
          row.tyreRouteV41317 = [...z.route];
          row.strategyTextV41317 = z.text;
          row.strategySourceV41317 = z.source;
        }
      });
    }
    return recs;
  }
  function recsForRound1317(year, round) {
    const y = String(year),
      r = Number(round);
    const fromHist = state?.aiStrategyHistoryV41317?.[y]?.[r];
    if (Array.isArray(fromHist) && fromHist.length) return fromHist;
    const snap = state?.standingsTimelineV40?.[y]?.[r];
    if (Array.isArray(snap?.strategiesV41317)) return snap.strategiesV41317;
    const sr = (state?.seasonResults || []).find((x) => Number(x.round) === r);
    if (year === year1317() && Array.isArray(sr?.strategiesV41317))
      return sr.strategiesV41317;
    return [];
  }
  function strategyHTML1317(recs, title = "全场策略选择") {
    if (!recs?.length)
      return `<div class="strategyNoDataV41317">这一站没有保存策略记录。13.17 以前完成的旧比赛无法准确回算 AI 当时随机选择的策略。</div>`;
    const ordered = [...recs].sort((a, b) => {
      const fa =
          state?.weekend?.raceResult?.field?.find((x) => x.name === a.name)
            ?.position || 999,
        fb =
          state?.weekend?.raceResult?.field?.find((x) => x.name === b.name)
            ?.position || 999;
      return fa - fb;
    });
    return `<div class="strategyPanelHeadV41317"><div><div class="kicker">STRATEGY LOG</div><h3>${esc1317(title)}</h3></div><div class="small">轮胎路线 · 比赛取向</div></div><div class="strategyTableWrapV41317"><table class="strategyTableV41317"><thead><tr><th>车手</th><th>车队</th><th>轮胎策略</th><th>取向</th><th>来源</th></tr></thead><tbody>${ordered
      .map((x) => {
        const app = APP_1317[x.approach] || APP_1317.normal;
        return `<tr class="${x.name === selected?.[0] ? "me" : ""}"><td><b>${esc1317(x.name)}</b></td><td>${esc1317(x.team || "")}</td><td class="strategyTyresV41317">${esc1317(x.text || routeText1317(x.route))}</td><td><span class="strategyApproachV41317 ${app[1]}">${app[0]}</span></td><td>${esc1317(x.source || "AI")}</td></tr>`;
      })
      .join("")}</tbody></table></div>`;
  }
  function injectRaceResult1317() {
    const list = document.getElementById("finalClassification");
    if (!list || !state?.weekend?.raceResult) return;
    const card = list.closest(".card");
    if (!card) return;
    let p = card.querySelector(".strategyPanelV41317");
    if (!p) {
      p = document.createElement("div");
      p.className = "strategyPanelV41317";
      list.insertAdjacentElement("afterend", p);
    }
    const recs = recsForRound1317(year1317(), state.round);
    p.innerHTML = strategyHTML1317(recs, "本场每位车手的策略");
  }
  function activeRound1317() {
    const b = document.querySelector("#season .standingsRoundBtnV40.active");
    if (b) return Number(b.dataset.round);
    const t =
      document.getElementById("standingsArchiveTitleV40")?.textContent || "";
    const m = t.match(/R(\d+)/);
    return m ? Number(m[1]) : Number(state?.round || 0);
  }
  function injectStandings1317() {
    const host = document.getElementById("standingsArchiveBodyV40");
    if (!host) return;
    host.querySelector(".strategyPanelV41317")?.remove();
    const r = activeRound1317(),
      recs = recsForRound1317(year1317(), r),
      p = document.createElement("div");
    p.className = "strategyPanelV41317";
    p.innerHTML = strategyHTML1317(
      recs,
      `R${String(r).padStart(2, "0")} · AI / 玩家策略`,
    );
    host.appendChild(p);
  }
  function injectHistorical1317() {
    const mb = document.getElementById("modalBody");
    if (!mb || !mb.querySelector(".histSeasonHeroV1312")) return;
    mb.querySelector(".histStrategyMountV41317")?.remove();
    const y = Number(
        (mb.querySelector(".histSeasonHeroV1312 h2")?.textContent || "").match(
          /\d{4}/,
        )?.[0] || 0,
      ),
      b = mb.querySelector(".histRoundBtnV1312.active"),
      m = (b?.textContent || "").match(/R(\d+)/),
      r = m ? Number(m[1]) : 0;
    if (!y || !r) return;
    const p = document.createElement("div");
    p.className = "histStrategyMountV41317 strategyPanelV41317";
    p.innerHTML = strategyHTML1317(
      recsForRound1317(y, r),
      `${y} · R${String(r).padStart(2, "0")} 策略记录`,
    );
    mb.firstElementChild?.appendChild(p);
  }

  const oldComplete1317 = window.completeRaceResultV10 || completeRaceResultV10;
  window.completeRaceResultV10 = function (field, mine, noBonus = false) {
    /* Assign once before the older completion chain copies the field; persist after it captures standings. */
    const pre = recordsForField1317(field, noBonus);
    field.forEach((x) => {
      const z = pre.find((q) => q.name === x.name);
      if (z) {
        x.strategy = x.strategy || z.approach;
        x.tyreRouteV41317 = [...z.route];
        x.strategyTextV41317 = z.text;
        x.strategySourceV41317 = z.source;
      }
    });
    const out = oldComplete1317.apply(this, arguments);
    try {
      saveRecords1317(field, noBonus);
      autosave?.();
      injectRaceResult1317();
    } catch (e) {
      console.warn("strategy archive 13.17", e);
    }
    return out;
  };
  try {
    completeRaceResultV10 = window.completeRaceResultV10;
  } catch (_) {}

  const oldResult1317 = window.renderWeekendResult || renderWeekendResult;
  window.renderWeekendResult = function () {
    const out = oldResult1317.apply(this, arguments);
    try {
      injectRaceResult1317();
    } catch (_) {}
    return out;
  };
  try {
    renderWeekendResult = window.renderWeekendResult;
  } catch (_) {}

  if (typeof window.selectStandingsRoundV40 === "function") {
    const f = window.selectStandingsRoundV40;
    window.selectStandingsRoundV40 = function () {
      const r = f.apply(this, arguments);
      setTimeout(injectStandings1317, 0);
      return r;
    };
  }
  if (typeof window.setStandingsTabV40 === "function") {
    const f = window.setStandingsTabV40;
    window.setStandingsTabV40 = function () {
      const r = f.apply(this, arguments);
      setTimeout(injectStandings1317, 0);
      return r;
    };
  }
  const oldOpen1317 = window.openModule || openModule;
  window.openModule = function (id) {
    const r = oldOpen1317.apply(this, arguments);
    if (id === "season") setTimeout(injectStandings1317, 20);
    return r;
  };
  try {
    openModule = window.openModule;
  } catch (_) {}

  ["openSeasonArchiveV1312", "selectHistRoundV1312", "setHistTabV1312"].forEach(
    (k) => {
      if (typeof window[k] === "function") {
        const f = window[k];
        window[k] = function () {
          const r = f.apply(this, arguments);
          setTimeout(injectHistorical1317, 0);
          return r;
        };
      }
    },
  );

  const oldRestore1317 = window.restoreSnapshot || restoreSnapshot;
  window.restoreSnapshot = function () {
    const r = oldRestore1317.apply(this, arguments);
    if (r && state) {
      state.aiStrategyHistoryV41317 = state.aiStrategyHistoryV41317 || {};
    }
    return r;
  };
  try {
    restoreSnapshot = window.restoreSnapshot;
  } catch (_) {}
  const oldStart1317 = window.startCareer || startCareer;
  window.startCareer = function () {
    const r = oldStart1317.apply(this, arguments);
    if (state) state.aiStrategyHistoryV41317 = {};
    return r;
  };
  try {
    startCareer = window.startCareer;
  } catch (_) {}
  const oldSnap1317 = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = oldSnap1317.apply(this, arguments);
    if (s) {
      s.version = 4147;
      s.majorVersion = "beta";
      s.featureSet = "beta-patch13.17-brand-custom99-ai-strategy-history";
    }
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
})();

/* beta-patch1318-script */

(() => {
  const WXMAP1318 = {
    dry: ["☀️", "干地"],
    cloud: ["☁️", "多云"],
    damp: ["🌦️", "潮湿"],
    wet: ["🌧️", "湿地"],
    extreme: ["⛈️", "积水 / 暴雨"],
  };
  const STAGE1318 = ["起步", "中段", "末段"];
  const TYRE1318 = {
    S: "SOFT",
    M: "MEDIUM",
    H: "HARD",
    I: "INTERMEDIATE",
    W: "WET",
  };
  const esc1318 = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[m],
    );
  const weatherObj1318 = () => {
    try {
      return (
        window.ensureWeatherV410?.() ||
        state?.weekend?.weatherV410 || {
          actual: ["dry", "dry", "dry"],
          profile: {},
        }
      );
    } catch (_) {
      return { actual: ["dry", "dry", "dry"], profile: {} };
    }
  };
  const weather1318 = () => {
    const a = weatherObj1318()?.actual;
    return Array.isArray(a) && a.length ? a : ["dry", "dry", "dry"];
  };
  const driverData1318 = (name) => {
    try {
      return drivers.find((d) => d[0] === name) || null;
    } catch (_) {
      return null;
    }
  };
  const driverTeam1318 = (name) => driverData1318(name)?.[1] || "";
  const tyreMgmt1318 = (name) => {
    try {
      return Number(teams?.[driverTeam1318(name)]?.parts?.["轮胎管理"] || 65);
    } catch (_) {
      return 65;
    }
  };
  const awareness1318 = (name) => Number(driverData1318(name)?.[5] || 75);
  const raceSkill1318 = (name) => Number(driverData1318(name)?.[4] || 78);
  const demand1318 = () => {
    try {
      return Number(currentDemandV10?.("race", state.round)?.[4] || 20);
    } catch (_) {
      return 20;
    }
  };
  const isDryish1318 = (s) => s === "dry" || s === "cloud";
  const isWet1318 = (s) => s === "damp" || s === "wet" || s === "extreme";
  function hash01_1318(text) {
    let h = 2166136261;
    for (const ch of String(text)) {
      h ^= ch.charCodeAt(0);
      h = Math.imul(h, 16777619);
    }
    return ((h >>> 0) % 100000) / 100000;
  }
  function baseDryRoute1318(name, approach = "normal") {
    const tm = tyreMgmt1318(name),
      td = demand1318();
    if (approach === "aggressive")
      return tm >= 72 ? ["S", "M", "S"] : ["S", "H"];
    if (approach === "conservative") return ["H", "M"];
    if (td >= 23) return tm >= 73 ? ["M", "H", "M"] : ["M", "H"];
    if (tm >= 82) return ["S", "M"];
    return ["M", "H"];
  }
  function compact1318(route) {
    return (route || [])
      .filter(Boolean)
      .filter((x, i, a) => i === 0 || a[i - 1] !== x);
  }
  function wetTyre1318(name, stage, idx, wx) {
    if (stage === "damp") return "I";
    if (stage === "extreme") return "W";
    if (stage !== "wet") return null;
    const profile = weatherObj1318()?.profile || {},
      storm = Number(profile.storm || 0.42),
      persist = Number(profile.persistence || 0.42),
      a = wx || weather1318();
    const adjacentExtreme =
      a[idx - 1] === "extreme" || a[idx + 1] === "extreme";
    const sustained =
      a[idx - 1] === "wet" || a[idx + 1] === "wet" || adjacentExtreme;
    if (adjacentExtreme) return "W";
    /* Normal wet track is often intermediate territory. Full wets become more likely only when rain is intense and persistent. */
    const awa = awareness1318(name),
      threshold = Math.max(
        0.05,
        Math.min(
          0.72,
          0.03 +
            storm * 0.25 +
            persist * 0.08 +
            (awa - 75) * 0.002 +
            (sustained ? 0.12 : 0),
        ),
      );
    return hash01_1318(`${name}|${state?.round || 0}|${idx}|wet`) < threshold
      ? "W"
      : "I";
  }
  function buildAIPlan1318(name, approach = "normal") {
    const wx = weather1318(),
      dry = baseDryRoute1318(name, approach);
    if (wx.every(isDryish1318))
      return { route: [...dry], stageTyres: null, weather: [...wx] };
    const stageTyres = wx.map((stage, idx) => {
      if (isDryish1318(stage)) {
        if (idx === 0) return dry[0] || "M";
        /* After a wet crossover the AI rejoins the dry plan on its durable/end compound. */
        return dry[dry.length - 1] || "M";
      }
      return wetTyre1318(name, stage, idx, wx) || "I";
    });
    return { route: compact1318(stageTyres), stageTyres, weather: [...wx] };
  }
  function stagePenalty1318(tyre, stage) {
    if (isDryish1318(stage)) {
      if (tyre === "S") return 1.2;
      if (tyre === "M") return 0.6;
      if (tyre === "H") return 0.2;
      if (tyre === "I") return -10.5;
      if (tyre === "W") return -16.5;
      return 0;
    }
    if (stage === "damp") {
      if (tyre === "I") return 1.1;
      if (tyre === "W") return -2.0;
      if (tyre === "M") return -9.5;
      if (tyre === "H") return -10.8;
      if (tyre === "S") return -12.2;
      return 0;
    }
    if (stage === "wet") {
      if (tyre === "I") return 0.9;
      if (tyre === "W") return 0.5;
      if (tyre === "M") return -14.5;
      if (tyre === "H") return -15.8;
      if (tyre === "S") return -17.2;
      return 0;
    }
    if (stage === "extreme") {
      if (tyre === "W") return 1.6;
      if (tyre === "I") return -5.8;
      return -18.5;
    }
    return 0;
  }
  function trafficFactor1318() {
    let n = "";
    try {
      n = currentRace()?.[1] || "";
    } catch (_) {}
    const hard = {
      摩纳哥大奖赛: 1.85,
      匈牙利大奖赛: 1.55,
      新加坡大奖赛: 1.5,
      荷兰大奖赛: 1.38,
      "巴塞罗那-加泰罗尼亚大奖赛": 1.3,
      西班牙大奖赛: 1.22,
      日本大奖赛: 1.15,
    };
    const easy = {
      意大利大奖赛: 0.68,
      比利时大奖赛: 0.7,
      奥地利大奖赛: 0.76,
      阿塞拜疆大奖赛: 0.76,
      加拿大大奖赛: 0.82,
      拉斯维加斯大奖赛: 0.8,
      迈阿密大奖赛: 0.9,
    };
    return hard[n] || easy[n] || 1;
  }
  function strategyImpact1318(name, plan) {
    const wx = plan.weather || weather1318(),
      route = plan.route || ["M", "H"];
    const stageTyres =
      Array.isArray(plan.stageTyres) && plan.stageTyres.length === wx.length
        ? plan.stageTyres
        : wx.map(
            (_, i) =>
              route[Math.min(i, route.length - 1)] || route.at(-1) || "M",
          );
    let delta = 0,
      mismatch = 0,
      crisis = 0;
    stageTyres.forEach((tyre, i) => {
      const p = stagePenalty1318(tyre, wx[i]);
      delta += p;
      if (p <= -8) mismatch++;
      if (p <= -14) crisis++;
    });
    const extraStops = Math.max(0, route.length - 2),
      tf = trafficFactor1318();
    let pitCost = 0;
    if (extraStops) {
      const rac = raceSkill1318(name),
        recover = Math.max(0, Math.min(0.72, (rac - 68) * 0.013));
      for (let j = 0; j < extraStops; j++) {
        const roll = hash01_1318(`${name}|${state?.round || 0}|pit|${j}`),
          exec = roll < 0.66 ? 0 : roll < 0.9 ? 0.7 : roll < 0.985 ? 1.7 : 3.2;
        const traffic = Math.max(
          0,
          (0.55 +
            0.75 * hash01_1318(`${name}|${state?.round || 0}|traffic|${j}`)) *
            tf -
            recover * 0.55,
        );
        pitCost += 1.0 + 0.35 * tf + exec + traffic;
      }
      delta -= pitCost;
    }
    if (wx.some(isWet1318) && !route.some((t) => t === "I" || t === "W")) {
      delta -= 12;
      mismatch++;
      crisis++;
    }
    if (wx.every(isDryish1318) && route.some((t) => t === "I" || t === "W")) {
      delta -= 8;
      mismatch++;
    }
    return {
      delta: Math.round(delta * 10) / 10,
      pitCost: Math.round(pitCost * 10) / 10,
      mismatch,
      crisis,
      stageTyres: [...stageTyres],
    };
  }
  function routeText1318(route) {
    return (route || []).map((c) => TYRE1318[c] || c || "—").join(" → ") || "—";
  }
  function applyAIRoutes1318(field, noBonus = false) {
    const playerRoute =
      Array.isArray(state?.weekend?.tyreRouteV4133) &&
      state.weekend.tyreRouteV4133.length >= 1
        ? [...state.weekend.tyreRouteV4133]
        : null;
    /* Patch 13.20: quick/full auto simulation must treat the selected driver exactly like every AI driver.
       Manual races still use the player's chosen route and the existing detailed player tyre model, so they are not double-counted here. */
    const autoPlayer = !!noBonus;
    (field || []).forEach((x) => {
      const isMe = x.name === selected?.[0],
        approach = x.strategy || "normal",
        useManualPlayer = isMe && !autoPlayer && !!playerRoute;
      const plan = useManualPlayer
        ? { route: playerRoute, stageTyres: null, weather: weather1318() }
        : buildAIPlan1318(x.name, approach);
      x.tyreRouteV41317 = [...plan.route];
      x.strategyTextV41317 = routeText1318(plan.route);
      x.strategySourceV41317 = isMe
        ? useManualPlayer
          ? "玩家"
          : "自动模拟"
        : "AI";
      x.aiTrueRouteV41318 = [...plan.route];
      x.aiStageTyresV41318 = plan.stageTyres ? [...plan.stageTyres] : null;
      if (!isMe || autoPlayer) {
        const imp = strategyImpact1318(x.name, plan);
        x.strategyWeatherDeltaV41318 = imp.delta;
        x.strategyPitCostV41318 = imp.pitCost;
        x.strategyMismatchV41318 = imp.mismatch;
        x.strategyCrisisV41318 = imp.crisis;
        x.total = Number(x.total || 0) + imp.delta;
      }
    });
    field.sort((a, b) => {
      if (!!a.dnf !== !!b.dnf) return a.dnf ? 1 : -1;
      if (!!a.dns !== !!b.dns) return a.dns ? 1 : -1;
      return Number(b.total || 0) - Number(a.total || 0);
    });
    field.forEach((x, i) => (x.position = i + 1));
  }
  function restoreTrueRoutes1318(field) {
    (field || []).forEach((x) => {
      if (Array.isArray(x.aiTrueRouteV41318) && x.aiTrueRouteV41318.length) {
        x.tyreRouteV41317 = [...x.aiTrueRouteV41318];
        x.strategyTextV41317 = routeText1318(x.aiTrueRouteV41318);
        x.strategySourceV41317 =
          x.strategySourceV41317 ||
          (x.name === selected?.[0] ? "自动模拟" : "AI");
      }
    });
    const rr = state?.weekend?.raceResult;
    if (rr?.field)
      rr.field.forEach((row) => {
        const z = (field || []).find((x) => x.name === row.name);
        if (z?.aiTrueRouteV41318) {
          row.tyreRouteV41317 = [...z.aiTrueRouteV41318];
          row.strategyTextV41317 = routeText1318(z.aiTrueRouteV41318);
          row.strategySourceV41317 = z.strategySourceV41317;
          row.strategyWeatherDeltaV41318 = z.strategyWeatherDeltaV41318;
        }
      });
  }
  function saveStrategyHistory1318(field) {
    if (!state || !field) return;
    restoreTrueRoutes1318(field);
    const y = String(
        (() => {
          try {
            return Number(seasonYearV11?.() || 2026);
          } catch (_) {
            return 2026;
          }
        })(),
      ),
      r = Number(state.round || 0),
      actual = [...weather1318()];
    state.aiStrategyHistoryV41317 = state.aiStrategyHistoryV41317 || {};
    state.aiStrategyHistoryV41317[y] = state.aiStrategyHistoryV41317[y] || {};
    const recs = (field || []).map((x) => ({
      name: x.name,
      team: x.team,
      route: [...(x.tyreRouteV41317 || [])],
      approach: x.strategy || "normal",
      source:
        x.strategySourceV41317 ||
        (x.name === selected?.[0] &&
        Array.isArray(state?.weekend?.tyreRouteV4133)
          ? "玩家"
          : x.name === selected?.[0]
            ? "自动模拟"
            : "AI"),
      text: x.strategyTextV41317 || routeText1318(x.tyreRouteV41317 || []),
      dnf: !!x.dnf,
      dns: !!x.dns,
      status: x.status || "",
      weatherDelta: Number(x.strategyWeatherDeltaV41318 || 0),
    }));
    state.aiStrategyHistoryV41317[y][r] = recs;
    const sr = (state.seasonResults || []).find((x) => Number(x.round) === r);
    if (sr) {
      sr.weatherActualV41318 = [...actual];
      sr.strategiesV41317 = recs.map((x) => ({ ...x, route: [...x.route] }));
      if (Array.isArray(sr.field))
        sr.field.forEach((row) => {
          const z = recs.find((q) => q.name === row.name);
          if (z) {
            row.strategy = z.approach;
            row.tyreRouteV41317 = [...z.route];
            row.strategyTextV41317 = z.text;
            row.strategySourceV41317 = z.source;
            row.strategyWeatherDeltaV41318 = z.weatherDelta;
          }
        });
    }
    const snap = state.standingsTimelineV40?.[y]?.[r];
    if (snap) {
      snap.weatherActualV41318 = [...actual];
      snap.strategiesV41317 = recs.map((x) => ({ ...x, route: [...x.route] }));
      if (Array.isArray(snap.result))
        snap.result.forEach((row) => {
          const z = recs.find((q) => q.name === row.name);
          if (z) {
            row.strategy = z.approach;
            row.tyreRouteV41317 = [...z.route];
            row.strategyTextV41317 = z.text;
            row.strategySourceV41317 = z.source;
            row.strategyWeatherDeltaV41318 = z.weatherDelta;
          }
        });
    }
  }
  function weatherHTML1318() {
    const obj = weatherObj1318() || {},
      forecast =
        Array.isArray(obj.forecast) && obj.forecast.length
          ? obj.forecast
          : ["dry", "dry", "dry"],
      actual =
        Array.isArray(obj.actual) && obj.actual.length
          ? obj.actual
          : ["dry", "dry", "dry"];
    const lineHTML = (arr) =>
      arr
        .map(
          (w, i) =>
            `<span class="wtStep"><small style="font-size:10.5px;color:#7a8590">${STAGE1318[i] || `阶段${i + 1}`}</small><span>${WXMAP1318[w]?.[0] || "❔"}</span><span>${esc1318(WXMAP1318[w]?.[1] || w)}</span></span>${i < arr.length - 1 ? '<span class="wtArrow">→</span>' : ""}`,
        )
        .join("");
    const forecastSummary = forecast
      .map(
        (w, i) => `${STAGE1318[i] || `阶段${i + 1}`} ${WXMAP1318[w]?.[1] || w}`,
      )
      .join(" → ");
    const actualSummary = actual
      .map(
        (w, i) => `${STAGE1318[i] || `阶段${i + 1}`} ${WXMAP1318[w]?.[1] || w}`,
      )
      .join(" → ");
    const diff = forecast.reduce((n, w, i) => n + (w !== actual[i] ? 1 : 0), 0);
    const note = diff
      ? `赛前预测与实际有 ${diff} 处偏差。预测：${esc1318(forecastSummary)}。实际：${esc1318(actualSummary)}。`
      : `赛前预测与实际基本一致：${esc1318(actualSummary)}。`;
    return `<div class="weatherTrailV1318" id="weatherTrailV1318"><div class="wtHead">WEATHER REPORT · 天气对照</div><div class="wtBlock"><div class="wtLabel">FORECAST · 预测天气</div><div class="wtLine">${lineHTML(forecast)}</div></div><div class="wtBlock"><div class="wtLabel">ACTUAL · 真实天气</div><div class="wtLine">${lineHTML(actual)}</div></div><div class="wtNote">${note}</div></div>`;
  }
  function injectWeatherResult1318() {
    const host =
      document.querySelector(
        "#weekendresult .resultSummary .longRaceReportV4137",
      ) || document.querySelector("#weekendresult .resultSummary");
    if (!host) return;
    host.querySelector("#weatherTrailV1318")?.remove();
    const anchor = host.querySelector("#resultNarrative");
    if (anchor) anchor.insertAdjacentHTML("beforebegin", weatherHTML1318());
    else host.insertAdjacentHTML("beforeend", weatherHTML1318());
  }

  const prevComplete1318 =
    window.completeRaceResultV10 || completeRaceResultV10;
  window.completeRaceResultV10 = function (field, mine, noBonus = false) {
    try {
      applyAIRoutes1318(field, noBonus);
    } catch (e) {
      console.warn("ai route 13.18 apply", e);
    }
    const out = prevComplete1318.apply(this, arguments);
    try {
      restoreTrueRoutes1318(field);
      saveStrategyHistory1318(field);
      injectWeatherResult1318();
      autosave?.();
    } catch (e) {
      console.warn("ai route 13.18 save", e);
    }
    return out;
  };
  try {
    completeRaceResultV10 = window.completeRaceResultV10;
  } catch (_) {}

  const prevResult1318 = window.renderWeekendResult || renderWeekendResult;
  window.renderWeekendResult = function () {
    const out = prevResult1318.apply(this, arguments);
    try {
      injectWeatherResult1318();
    } catch (e) {
      console.warn("weather trail 13.18", e);
    }
    return out;
  };
  try {
    renderWeekendResult = window.renderWeekendResult;
  } catch (_) {}

  const prevSnap1318 = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = prevSnap1318.apply(this, arguments);
    if (s) {
      s.version = 4148;
      s.majorVersion = "beta";
      s.featureSet = "beta-patch13.18-real-ai-tyres-and-actual-weather-report";
    }
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
})();

/* beta-patch1319-rd-balance-script */

(() => {
  const round1319 = (v) => Math.round(Number(v || 0) * 10) / 10;
  const clamp1319 = (v, a, b) => Math.max(a, Math.min(b, v));
  const REG_FIRST_1319 = 2029,
    REG_INTERVAL_1319 = 3;
  const REG_BASE_1319 = 52,
    REG_INHERIT_1319 = 0.6;
  const ANNUAL_BASE_1319 = 55,
    SOFT_CAP_1319 = 88,
    SOFT_DECAY_1319 = 0.35;
  const RETAIN_1319 = [
    0.88, 0.89, 0.9, 0.91, 0.93, 0.93, 0.95, 0.95, 0.97, 0.97, 0.98, 0.98,
  ];
  const ATTRS1319 = () => (Array.isArray(CAR_ATTRS_V10) ? CAR_ATTRS_V10 : []);
  const year1319 = () => {
    try {
      return Number(seasonYearV11?.() || state?.seasonYear || 2026);
    } catch (_) {
      return Number(state?.seasonYear || 2026);
    }
  };
  function isRegYear1319(y) {
    return (
      Number(y) >= REG_FIRST_1319 &&
      (Number(y) - REG_FIRST_1319) % REG_INTERVAL_1319 === 0
    );
  }
  function nextReg1319(from = year1319() + 1) {
    let y = Math.max(Number(from) || REG_FIRST_1319, REG_FIRST_1319);
    while (!isRegYear1319(y)) y++;
    return y;
  }
  function carIndex1319(team) {
    const p = teams?.[team]?.parts || {};
    const a = ATTRS1319();
    return a.length
      ? a.reduce((s, k) => s + Number(p[k] || 0), 0) / a.length
      : Number(teams?.[team]?.ovr || 0);
  }
  function carOrder1319() {
    return Object.keys(teams || {}).sort(
      (a, b) =>
        carIndex1319(b) - carIndex1319(a) || String(a).localeCompare(String(b)),
    );
  }
  function carRank1319(team, order = carOrder1319()) {
    const i = order.indexOf(team);
    return i < 0 ? order.length || 1 : i + 1;
  }
  function retention1319(rank) {
    return (
      RETAIN_1319[
        Math.min(RETAIN_1319.length - 1, Math.max(0, Number(rank || 1) - 1))
      ] || 0.99
    );
  }
  function devEff1319(v) {
    v = Number(v || 0);
    if (v < 65) return 1.05;
    if (v < 75) return 1.0;
    if (v < 80) return 0.9;
    if (v < 85) return 0.7;
    if (v < 90) return 0.45;
    if (v < 95) return 0.2;
    return 0.08;
  }
  function regRankEff1319(rank) {
    rank = Number(rank || 12);
    if (rank === 1) return 0.95;
    if (rank === 2) return 0.97;
    if (rank === 3) return 0.98;
    if (rank === 4) return 0.99;
    if (rank >= 11) return 1.05;
    if (rank >= 9) return 1.03;
    return 1.0;
  }
  function annualBase1319(old, rank) {
    old = Number(old || 0);
    let n = ANNUAL_BASE_1319 + (old - ANNUAL_BASE_1319) * retention1319(rank);
    n = Math.min(old, n);
    n -= Math.max(0, old - SOFT_CAP_1319) * SOFT_DECAY_1319;
    return clamp1319(n, 45, 99);
  }
  function regulationBase1319(old) {
    return clamp1319(
      REG_BASE_1319 + (Number(old || 0) - REG_BASE_1319) * REG_INHERIT_1319,
      45,
      99,
    );
  }
  function researchForTeam1319(team, attr, playerTeam) {
    let n = Number(state?.aiNextSeasonResearch?.[team]?.[attr] || 0);
    if (team === playerTeam)
      n += Number(state?.nextSeasonResearch?.[attr] || 0);
    return n;
  }
  function projectedNext1319(team, attr) {
    const order = carOrder1319(),
      rank = carRank1319(team, order),
      old = Number(teams?.[team]?.parts?.[attr] || 0),
      research = researchForTeam1319(team, attr, selected?.[1]),
      ny = year1319() + 1;
    if (isRegYear1319(ny))
      return round1319(
        clamp1319(
          regulationBase1319(old) + research * regRankEff1319(rank),
          45,
          99,
        ),
      );
    return round1319(clamp1319(annualBase1319(old, rank) + research, 45, 99));
  }
  window.RD_BALANCE_V1319 = {
    devEfficiency: devEff1319,
    carRank: carRank1319,
    isRegulationYear: isRegYear1319,
    nextRegulationYear: nextReg1319,
    projectedNext: projectedNext1319,
  };

  /* Current and next-season R&D now use steep diminishing returns. */
  window.devTargetValueV14 = function (part, target) {
    if (!selected) return 0;
    return target === "next"
      ? projectedNext1319(selected[1], part)
      : round1319(Number(teams?.[selected[1]]?.parts?.[part] || 0));
  };
  try {
    devTargetValueV14 = window.devTargetValueV14;
  } catch (_) {}

  window.completeProjects = function () {
    if (!selected || !state?.projects) return;
    try {
      ensureStateV17?.();
    } catch (_) {}
    const team = selected[1],
      t = teams[team],
      done = state.projects.filter(
        (p) => Number(p.finish) <= Number(state.round),
      );
    if (!done.length) return;
    if (!Array.isArray(state.devHistory)) state.devHistory = [];
    if (!Array.isArray(state.aiDevNews)) state.aiDevNews = [];
    done.forEach((p) => {
      let raw;
      if (p.v17)
        raw = randV14(Number(p.minGain ?? 0.5), Number(p.maxGain ?? 1.5));
      else if (p.v14)
        raw = randV14(Number(p.minGain ?? 0.5), Number(p.maxGain ?? 1.5));
      else raw = Number(p.gain || 1);
      raw = round1319(raw);
      const base = Number(t?.parts?.[p.part] || 0),
        eff = devEff1319(base),
        gain = round1319(raw * eff);
      if (p.seasonTarget === "next")
        state.nextSeasonResearch[p.part] = round1319(
          Number(state.nextSeasonResearch?.[p.part] || 0) + gain,
        );
      else if (t?.parts?.[p.part] != null)
        t.parts[p.part] = round1319(Math.min(99, base + gain));
      state.devHistory.unshift({
        round: state.round,
        part: p.part,
        target: p.seasonTarget || "current",
        label: p.label || "研发项目",
        gain,
        rawGain: raw,
        efficiency: eff,
        ok: true,
      });
      state.aiDevNews.unshift(
        `${team}：${p.seasonTarget === "next" ? "下一代" : "当前"} ${p.part} 完成 · 实际 +${gain.toFixed(1)}（研发效率 ${Math.round(eff * 100)}%）`,
      );
    });
    state.projects = state.projects.filter(
      (p) => Number(p.finish) > Number(state.round),
    );
    state.devHistory = state.devHistory.slice(0, 8);
    state.aiDevNews = state.aiDevNews.slice(0, 12);
    try {
      recalcTeamOvr(t);
    } catch (_) {}
  };
  try {
    completeProjects = window.completeProjects;
  } catch (_) {}

  /* AI still uses the existing two-slot project planner, but actual completed gains are compressed by the same curve. */
  const aiDevPrev1319 =
    window.processAIDevelopmentV10 || processAIDevelopmentV10;
  window.processAIDevelopmentV10 = function () {
    if (!state || !teams) return aiDevPrev1319.apply(this, arguments);
    const beforeParts = {},
      beforeNext = {};
    Object.keys(teams).forEach((team) => {
      beforeParts[team] = {};
      beforeNext[team] = {};
      ATTRS1319().forEach((a) => {
        beforeParts[team][a] = Number(teams[team]?.parts?.[a] || 0);
        beforeNext[team][a] = Number(
          state?.aiNextSeasonResearch?.[team]?.[a] || 0,
        );
      });
    });
    const out = aiDevPrev1319.apply(this, arguments);
    Object.keys(teams).forEach((team) => {
      ATTRS1319().forEach((a) => {
        const old = beforeParts[team][a],
          now = Number(teams[team]?.parts?.[a] || 0),
          delta = now - old;
        if (delta > 0) {
          const eff = devEff1319(old);
          teams[team].parts[a] = round1319(Math.min(99, old + delta * eff));
        }
        const oldN = beforeNext[team][a],
          nowN = Number(state?.aiNextSeasonResearch?.[team]?.[a] || 0),
          dN = nowN - oldN;
        if (dN > 0)
          state.aiNextSeasonResearch[team][a] = round1319(
            oldN + dN * devEff1319(old),
          );
      });
      try {
        recalcTeamOvr(teams[team]);
      } catch (_) {}
    });
    return out;
  };
  try {
    processAIDevelopmentV10 = window.processAIDevelopmentV10;
  } catch (_) {}

  /* Annual convergence + a full technical reset in 2029, 2032, 2035... */
  function regulationAdaptation1322(team, newY) {
    if (!state) return 0;
    state.regulationAdaptationV1322 = state.regulationAdaptationV1322 || {};
    const y = String(newY);
    state.regulationAdaptationV1322[y] =
      state.regulationAdaptationV1322[y] || {};
    const box = state.regulationAdaptationV1322[y];
    if (!Object.prototype.hasOwnProperty.call(box, team)) {
      const dev = Number(teams?.[team]?.dev ?? baseTeams?.[team]?.dev ?? 89),
        roll = Math.random() * 5 - 2.5 + (dev - 89) * 0.12;
      box[team] = round1319(clamp1319(roll, -3.5, 3.5));
    }
    return Number(box[team] || 0);
  }
  window.applySeasonDecayAndResearchV15 = function () {
    if (!selected || !state) return;
    const oldY = year1319(),
      newY = oldY + 1,
      playerTeam = selected[1],
      order = carOrder1319(),
      reg = isRegYear1319(newY),
      changes = [];
    Object.keys(teams).forEach((team) => {
      const rank = carRank1319(team, order),
        before = carIndex1319(team),
        rankEff = regRankEff1319(rank);
      const adaptation = reg ? regulationAdaptation1322(team, newY) : 0;
      ATTRS1319().forEach((a) => {
        const old = Number(teams[team]?.parts?.[a] || 0),
          research = researchForTeam1319(team, a, playerTeam);
        let next;
        if (reg)
          next = regulationBase1319(old) + research * rankEff + adaptation;
        else next = annualBase1319(old, rank) + research;
        teams[team].parts[a] = round1319(clamp1319(next, 45, 99));
      });
      try {
        recalcTeamOvr(teams[team]);
      } catch (_) {}
      changes.push({
        team,
        rank,
        before: round1319(before),
        after: round1319(carIndex1319(team)),
        research: round1319(
          ATTRS1319().reduce(
            (s, a) => s + researchForTeam1319(team, a, playerTeam),
            0,
          ),
        ),
        regulationMultiplier: reg ? rankEff : 1,
        regulationAdaptation: adaptation,
      });
    });
    state.techBalanceHistoryV1319 = Array.isArray(state.techBalanceHistoryV1319)
      ? state.techBalanceHistoryV1319
      : [];
    state.techBalanceHistoryV1319.unshift({
      from: oldY,
      to: newY,
      type: reg ? "REGULATION_RESET" : "ANNUAL_CONVERGENCE",
      changes,
    });
    state.techBalanceHistoryV1319 = state.techBalanceHistoryV1319.slice(0, 12);
    state.lastTechBalanceV1319 = state.techBalanceHistoryV1319[0];
  };
  try {
    applySeasonDecayAndResearchV15 = window.applySeasonDecayAndResearchV15;
  } catch (_) {}

  function effClass1319(e) {
    return e >= 1 ? "hot" : e <= 0.4 ? "cold" : "";
  }
  window.openDevProjectV14 = function (part) {
    if (!selected) return;
    try {
      ensureStateV17?.();
    } catch (_) {}
    const target = state.devMode || "current",
      opts = devProjectCatalogV14(part, target),
      dup = state.projects.some(
        (p) => p.part === part && p.seasonTarget === target,
      ),
      full = state.projects.length >= 2,
      remain = calendar.length - state.round,
      base = Number(teams[selected[1]]?.parts?.[part] || 0),
      eff = devEff1319(base),
      rank = carRank1319(selected[1]),
      ny = year1319() + 1,
      reg = target === "next" && isRegYear1319(ny),
      regEff = reg ? regRankEff1319(rank) : 1;
    document.getElementById("modalTitle").textContent =
      `${part} · ${target === "next" ? (reg ? `${ny} 新规适应` : "下一代研究") : "当前赛车"}`;
    document.getElementById("modalBody").innerHTML =
      `<div class="driverdetail"><div class="kicker">R&D PROGRAM · LONG-TERM BALANCE</div><div class="driverdetailname">选择研发规模 <span class="devEffV1319 ${effClass1319(eff)}">当前效率 ${Math.round(eff * 100)}%</span></div><div class="hint">当前 ${part} 为 <b>${base.toFixed(1)}</b>。研发收益存在明显边际递减：85以上开始很难继续堆高，90以上主要用于维持优势。${reg ? `<br>${ny} 为技术规则大改年；你当前赛车性能约 P${rank}，新规研究在结算时还有 ×${regEff.toFixed(2)} 的适应倍率。` : ""}</div>${opts
        .map((o) => {
          const tooLate = o.duration > remain,
            disabled = full || dup || state.budget < o.cost || tooLate,
            em = round1319(o.minGain * eff * regEff),
            ex = round1319(o.maxGain * eff * regEff),
            reason = full
              ? "两个研发槽都已占用"
              : dup
                ? "这个部件已有同方向项目"
                : state.budget < o.cost
                  ? "研发预算不足"
                  : tooLate
                    ? "本赛季剩余轮次不足"
                    : "";
          return `<div class="devProjectOption ${disabled ? "disabled" : ""}" ${disabled ? "" : `onclick="startDevProjectV14('${part}','${o.key}')"`}><div class="devProjectOptionHead"><h3>${o.label}</h3><strong>€${Number(o.cost).toFixed(1)}M</strong></div><div class="devOptionMeta"><span>${o.duration} 站</span><span class="projectV17Range">预计实际 +${em.toFixed(1)} ～ +${ex.toFixed(1)}</span></div><small style="display:block;margin-top:7px;color:#6f7986">${reason || `${o.desc || ""} · 理论区间 +${Number(o.minGain).toFixed(1)}～+${Number(o.maxGain).toFixed(1)}`}</small></div>`;
        })
        .join("")}</div>`;
    document.getElementById("overlay").classList.add("open");
  };
  try {
    openDevProjectV14 = window.openDevProjectV14;
  } catch (_) {}

  window.renderProjects = function () {
    const box = document.getElementById("projects");
    if (!box || !selected) return;
    if (!state.projects?.length) {
      box.innerHTML =
        '<div class="hint">暂无项目。高性能赛车继续研发会受到明显边际递减；后排赛车的同等投入更容易转化为实际提升。</div>';
      return;
    }
    box.innerHTML = state.projects
      .map((p, i) => {
        const dur = Math.max(1, p.duration || p.finish - p.start),
          progress = clamp1319(((state.round - p.start) / dur) * 100, 0, 100),
          left = Math.max(0, p.finish - state.round),
          base = Number(teams[selected[1]]?.parts?.[p.part] || 0),
          eff = devEff1319(base),
          rank = carRank1319(selected[1]),
          reg = p.seasonTarget === "next" && isRegYear1319(year1319() + 1),
          mult = reg ? regRankEff1319(rank) : 1,
          lo = round1319(Number(p.minGain || p.gain || 0) * eff * mult),
          hi = round1319(Number(p.maxGain || p.gain || 0) * eff * mult);
        return `<div class="projectV14 ${p.seasonTarget === "next" ? "future" : ""}"><b>${p.part} · ${p.label || "研发项目"} <span class="projectSlot">SLOT ${i + 1}</span></b><small>R${String(p.start).padStart(2, "0")} → R${String(p.finish).padStart(2, "0")} · 还剩 ${left} 站 · 当前预计实际 +${lo.toFixed(1)}～+${hi.toFixed(1)}</small><div class="projectProgress"><i style="width:${progress}%"></i></div></div>`;
      })
      .join("");
  };
  try {
    renderProjects = window.renderProjects;
  } catch (_) {}

  function cyclePanel1319() {
    if (!selected) return "";
    const y = year1319(),
      ny = y + 1,
      rank = carRank1319(selected[1]),
      reg = isRegYear1319(ny),
      nextR = nextReg1319(ny),
      ret = Math.round(retention1319(rank) * 100),
      avg = round1319(carIndex1319(selected[1])),
      eff = Math.round(devEff1319(avg) * 100);
    return `<div class="techCyclePanelV1319 ${reg ? "reg" : ""}" id="techCyclePanelV1319"><div class="tcHead"><b>${reg ? `⚙️ ${ny} 技术规则大改` : "⚙️ 长期技术平衡"}</b><span>${reg ? "REGULATION RESET" : `NEXT MAJOR RESET · ${nextR}`}</span></div><p>${reg ? `新车继承旧技术约 60%，下一代研究改为“新规适应”。名次补偿已大幅收窄，同时每支车队会生成一次固定的新规理解度，读档不会重抽。` : `普通冬歇会按赛车性能排名收敛：你当前约 P${rank}，高于55的技术优势约保留 ${ret}%。88以上还会额外自然衰减。`}</p><div class="tcGrid"><div class="tcCell"><span>当前赛车指数</span><b>${avg.toFixed(1)} · P${rank}</b></div><div class="tcCell"><span>当前平均研发效率</span><b>${eff}%</b></div><div class="tcCell"><span>${reg ? "新规适应倍率" : "下一次技术大改"}</span><b>${reg ? "×" + regRankEff1319(rank).toFixed(2) : nextR}</b></div></div></div>`;
  }
  const renderDevPrev1319 = window.renderDevelopment || renderDevelopment;
  window.renderDevelopment = function () {
    const out = renderDevPrev1319.apply(this, arguments);
    try {
      const host =
        document.getElementById("playerCarSummary")?.parentElement ||
        document.querySelector("#development .playerCarCard");
      if (host) {
        host.querySelector("#techCyclePanelV1319")?.remove();
        host.insertAdjacentHTML("beforeend", cyclePanel1319());
      }
      const hint = document.getElementById("devSeasonHint");
      if (hint) {
        const ny = year1319() + 1;
        if ((state.devMode || "current") === "next" && isRegYear1319(ny))
          hint.textContent = `${ny} 是技术规则大改年：下一代研发会作为“新规适应”结算，而不是简单叠加到旧赛车。`;
        else if ((state.devMode || "current") === "current")
          hint.textContent =
            "当前赛车升级立即生效，但高数值研发收益会快速递减；普通冬歇前排赛车还会被更强地技术收敛。";
      }
    } catch (e) {
      console.warn("R&D balance UI 13.19", e);
    }
    return out;
  };
  try {
    renderDevelopment = window.renderDevelopment;
  } catch (_) {}

  const finalePrev1319 = window.showSeasonFinaleV10 || showSeasonFinaleV10;
  window.showSeasonFinaleV10 = function () {
    const out = finalePrev1319.apply(this, arguments);
    try {
      const el = document.getElementById("finalContract"),
        ny = year1319() + 1,
        rank = carRank1319(selected?.[1]);
      if (el && !el.querySelector?.(".techFinaleV1319"))
        el.insertAdjacentHTML(
          "beforeend",
          `<div class="techFinaleV1319" style="margin-top:9px;padding:9px 10px;border:1px solid #e0e5ea;border-radius:8px;background:#f8fafb;font-size:11px;line-height:1.6"><b>${isRegYear1319(ny) ? `⚙️ ${ny} 技术规则大改` : `⚙️ ${ny} 冬歇技术收敛`}</b><br>${isRegYear1319(ny) ? `旧车技术约保留 60%；当前赛车P${rank}的新规研究倍率为 ×${regRankEff1319(rank).toFixed(2)}，另叠加一次固定的新规理解度。` : `当前赛车约P${rank}；前排越靠前，冬季优势削减越明显。`}</div>`,
        );
    } catch (_) {}
    return out;
  };
  try {
    showSeasonFinaleV10 = window.showSeasonFinaleV10;
  } catch (_) {}

  const startPrev1319 = window.startCareer || startCareer;
  window.startCareer = function () {
    const out = startPrev1319.apply(this, arguments);
    if (state) {
      state.techBalanceHistoryV1319 = [];
      state.lastTechBalanceV1319 = null;
    }
    return out;
  };
  try {
    startCareer = window.startCareer;
  } catch (_) {}
  const restorePrev1319 = window.restoreSnapshot || restoreSnapshot;
  window.restoreSnapshot = function () {
    const out = restorePrev1319.apply(this, arguments);
    if (out && state && !Array.isArray(state.techBalanceHistoryV1319))
      state.techBalanceHistoryV1319 = [];
    return out;
  };
  try {
    restoreSnapshot = window.restoreSnapshot;
  } catch (_) {}
  const snapPrev1319 = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = snapPrev1319.apply(this, arguments);
    if (s) {
      s.version = 4150;
      s.majorVersion = "beta";
      s.featureSet = "beta-patch13.20-auto-player-tyre-parity-rd-cycle";
    }
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
})();

/* beta-patch1321-roster-persistence-script */

(() => {
  const copy1321 = (v) => {
    try {
      return JSON.parse(JSON.stringify(v));
    } catch (_) {
      return v;
    }
  };
  function captureRoster1321() {
    try {
      return (drivers || []).map((d) =>
        Array.isArray(d) ? d.slice() : copy1321(d),
      );
    } catch (_) {
      return [];
    }
  }
  function captureProfiles1321() {
    const out = {};
    try {
      (drivers || []).forEach((d) => {
        const n = d?.[0];
        if (n && driverProfiles?.[n]) out[n] = copy1321(driverProfiles[n]);
      });
    } catch (_) {}
    return out;
  }
  function putField1321(map, field) {
    if (!Array.isArray(field)) return;
    field.forEach((x) => {
      const n = x?.name || x?.[0],
        t = x?.team || x?.[1];
      if (n && t) map[String(n)] = String(t);
    });
  }
  function legacyTeamMap1321(data) {
    const map = {};
    const st = data?.state || {};
    const y = String(Number(st.seasonYear || 2026));
    /* Contract history survives season rollover, so it can recover AI transfers from older saves. */
    try {
      (st.contractHistory || []).forEach((line) => {
        const m = String(line || "").match(/^(.+?)\s+转投\s+(.+?)\s+·/);
        if (m && !map[m[1]]) map[m[1]] = m[2].trim();
      });
    } catch (_) {}
    /* Current-season race data is more authoritative than older transfer logs. */
    try {
      const tl = st.standingsTimelineV40?.[y];
      if (tl && typeof tl === "object") {
        const rs = Object.keys(tl)
          .map(Number)
          .filter(Number.isFinite)
          .sort((a, b) => a - b);
        if (rs.length) putField1321(map, tl[rs[rs.length - 1]]?.result);
      }
      const sr = (st.seasonResults || [])
        .slice()
        .sort((a, b) => Number(a?.round || 0) - Number(b?.round || 0));
      if (sr.length) putField1321(map, sr[sr.length - 1]?.field);
      putField1321(map, st.weekend?.raceResult?.field);
    } catch (_) {}
    /* Player-deal state is written after a completed offseason transfer in the modern contract system. */
    try {
      const pteam =
        st.playerDealV40?.team ||
        (Number(st.seasonYear || 2026) > 2026
          ? st.lastSeasonDividend?.team
          : null);
      if (data?.selected && pteam) map[data.selected] = String(pteam);
      if (data?.selected && !map[data.selected]) {
        const hist = st.contract?.history || [];
        for (const line of hist) {
          const m = String(line || "").match(/(?:签约|续约)成功\s*·\s*([^·]+)/);
          if (m) {
            map[data.selected] = m[1].trim();
            break;
          }
        }
      }
    } catch (_) {}
    return map;
  }
  function restoreSavedRoster1321(data) {
    if (!data || !data.selected) return false;
    const rows = Array.isArray(data.rosterCurrentV41321)
      ? data.rosterCurrentV41321
      : null;
    if (rows?.length) {
      try {
        const clean = rows
          .filter((r) => Array.isArray(r) && r.length >= 2 && r[0] && r[1])
          .map((r) => r.slice());
        if (clean.length) {
          drivers.splice(0, drivers.length, ...clean);
        }
        const prof = data.driverProfilesCurrentV41321;
        if (prof && typeof prof === "object")
          Object.entries(prof).forEach(([n, p]) => {
            if (p) driverProfiles[n] = copy1321(p);
          });
      } catch (e) {
        console.warn("roster restore 13.21", e);
      }
    } else {
      /* Best-effort migration for 13.20 and older saves that never stored the full grid. */
      const map = legacyTeamMap1321(data);
      try {
        drivers.forEach((d) => {
          if (map[d?.[0]]) d[1] = map[d[0]];
        });
      } catch (_) {}
    }
    try {
      const me = drivers.find((d) => d?.[0] === data.selected);
      if (me) selected = me;
    } catch (_) {}
    return !!selected;
  }

  window.ROSTER_PERSIST_V41321 = {
    capture: captureRoster1321,
    restore: restoreSavedRoster1321,
    legacyMap: legacyTeamMap1321,
  };

  const snapPrev1321 = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = snapPrev1321.apply(this, arguments);
    if (s) {
      s.version = 4151;
      s.majorVersion = "beta";
      s.featureSet = "beta-patch13.21-persistent-current-grid";
      s.rosterCurrentV41321 = captureRoster1321();
      s.driverProfilesCurrentV41321 = captureProfiles1321();
      s.selectedTeamV41321 = selected?.[1] || null;
    }
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}

  const restorePrev1321 = window.restoreSnapshot || restoreSnapshot;
  window.restoreSnapshot = function (data) {
    const ok = restorePrev1321.apply(this, arguments);
    if (!ok) return ok;
    try {
      restoreSavedRoster1321(data);
      /* selected must point at the restored row, not at a stale pre-load array object. */
      if (selected && data?.selected) {
        const me = drivers.find((d) => d?.[0] === data.selected);
        if (me) selected = me;
      }
      if (state) {
        state.rosterPersistenceV41321 = {
          version: 1,
          migratedLegacy: !Array.isArray(data?.rosterCurrentV41321),
          savedAt: data?.savedAt || null,
        };
      }
      try {
        renderProfile?.();
      } catch (_) {}
      try {
        renderHub?.();
      } catch (_) {}
      try {
        if (document.getElementById("season")?.classList.contains("active"))
          renderSeasonV10?.();
      } catch (_) {}
    } catch (e) {
      console.warn("persistent grid 13.21", e);
    }
    return ok;
  };
  try {
    restoreSnapshot = window.restoreSnapshot;
  } catch (_) {}
})();

/* beta-patch1322-tech-balance-meta */

(() => {
  const snapPrev1322 = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = snapPrev1322.apply(this, arguments);
    if (s) {
      s.version = 4152;
      s.majorVersion = "beta";
      s.featureSet = "beta-patch13.22-moderated-catchup-regulation-balance";
    }
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
})();

/* beta-patch1323-wet-zero-stop-meta */

(() => {
  const snapPrev1323 = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = snapPrev1323.apply(this, arguments);
    if (s) {
      s.version = 4153;
      s.majorVersion = "beta";
      s.featureSet = "beta-patch13.23-wet-zero-stop-single-set";
    }
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
})();

/* beta-patch1324-weather-balance-meta */

(() => {
  const snapPrev1324 = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = snapPrev1324.apply(this, arguments);
    if (s) {
      s.version = 4154;
      s.majorVersion = "beta";
      s.featureSet = "beta-patch13.24-weather-frequency-forecast-balance";
    }
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
})();

/* beta-patch1327-strong-reg-reset-script */

(() => {
  const round1327 = (v) => Math.round(Number(v || 0) * 10) / 10;
  const clamp1327 = (v, a, b) => Math.max(a, Math.min(b, v));
  const ATTRS1327 = () => (Array.isArray(CAR_ATTRS_V10) ? CAR_ATTRS_V10 : []);
  const year1327 = () => {
    try {
      return Number(seasonYearV11?.() || state?.seasonYear || 2026);
    } catch (_) {
      return Number(state?.seasonYear || 2026);
    }
  };
  const isReg1327 = (y) => {
    try {
      return !!window.RD_BALANCE_V1319?.isRegulationYear?.(Number(y));
    } catch (_) {
      return Number(y) >= 2029 && (Number(y) - 2029) % 3 === 0;
    }
  };
  const carIndex1327 = (team) => {
    const p = teams?.[team]?.parts || {},
      a = ATTRS1327();
    return a.length
      ? a.reduce((s, k) => s + Number(p[k] || 0), 0) / a.length
      : Number(teams?.[team]?.ovr || 0);
  };
  const carOrder1327 = () =>
    Object.keys(teams || {}).sort(
      (a, b) =>
        carIndex1327(b) - carIndex1327(a) || String(a).localeCompare(String(b)),
    );
  const carRank1327 = (team, order = carOrder1327()) => {
    const i = order.indexOf(team);
    return i < 0 ? order.length || 1 : i + 1;
  };
  function rankResearchEff1327(rank) {
    rank = Number(rank || 12);
    if (rank === 1) return 0.95;
    if (rank === 2) return 0.97;
    if (rank === 3) return 0.98;
    if (rank === 4) return 0.99;
    if (rank >= 11) return 1.05;
    if (rank >= 9) return 1.03;
    return 1;
  }
  function researchForTeam1327(team, attr, playerTeam) {
    let n = Number(state?.aiNextSeasonResearch?.[team]?.[attr] || 0);
    if (team === playerTeam)
      n += Number(state?.nextSeasonResearch?.[attr] || 0);
    return n;
  }
  function perfPenalty1327(old) {
    old = Number(old || 0);
    if (old >= 72) return 3.2;
    if (old >= 66) return 2.2;
    if (old >= 60) return 1.1;
    if (old < 50) return -1;
    return 0;
  }
  function ensureShock1327(team, attr, newY) {
    if (!state) return 16;
    state.regulationShockV1327 = state.regulationShockV1327 || {};
    const y = String(Number(newY));
    state.regulationShockV1327[y] = state.regulationShockV1327[y] || {};
    const teamBox = (state.regulationShockV1327[y][team] =
      state.regulationShockV1327[y][team] || {});
    if (!Object.prototype.hasOwnProperty.call(teamBox, attr)) {
      const old = Number(teams?.[team]?.parts?.[attr] || 0);
      const base = 13 + Math.random() * 4; // 13–17, mean 15; high-performance areas are penalized on top
      const componentSwing = Math.random() * 4 - 2; // -2–+2 between technical areas
      teamBox[attr] = round1327(
        clamp1327(base + perfPenalty1327(old) + componentSwing, 10, 22),
      );
    }
    return Number(teamBox[attr] || 0);
  }
  function protection1327(team, attr, rawLoss, rank, playerTeam) {
    const research = researchForTeam1327(team, attr, playerTeam);
    const effective = research * rankResearchEff1327(rank);
    const cap = Number(rawLoss || 0) * 0.52;
    return {
      research: round1327(research),
      effective: round1327(effective),
      cap: round1327(cap),
      offset: round1327(Math.min(effective, cap)),
    };
  }
  function projectedReg1327(team, attr, newY = year1327() + 1) {
    const old = Number(teams?.[team]?.parts?.[attr] || 0),
      order = carOrder1327(),
      rank = carRank1327(team, order),
      loss = ensureShock1327(team, attr, newY),
      prot = protection1327(team, attr, loss, rank, selected?.[1]);
    return {
      old,
      rank,
      loss,
      ...prot,
      value: round1327(clamp1327(old - loss + prot.offset, 30, 99)),
    };
  }

  const oldProjected1327 = window.RD_BALANCE_V1319?.projectedNext;
  const oldDevTarget1327 = window.devTargetValueV14 || devTargetValueV14;
  window.devTargetValueV14 = function (part, target) {
    if (!selected) return 0;
    const ny = year1327() + 1;
    if (target === "next" && isReg1327(ny))
      return projectedReg1327(selected[1], part, ny).value;
    return oldDevTarget1327.apply(this, arguments);
  };
  try {
    devTargetValueV14 = window.devTargetValueV14;
  } catch (_) {}

  const oldApply1327 =
    window.applySeasonDecayAndResearchV15 || applySeasonDecayAndResearchV15;
  window.applySeasonDecayAndResearchV15 = function () {
    if (!selected || !state) return oldApply1327.apply(this, arguments);
    const oldY = year1327(),
      newY = oldY + 1;
    if (!isReg1327(newY)) return oldApply1327.apply(this, arguments);
    const playerTeam = selected[1],
      order = carOrder1327(),
      changes = [];
    Object.keys(teams).forEach((team) => {
      const rank = carRank1327(team, order),
        before = carIndex1327(team),
        parts = [];
      ATTRS1327().forEach((attr) => {
        const info = projectedReg1327(team, attr, newY);
        teams[team].parts[attr] = info.value;
        parts.push({
          attr,
          before: round1327(info.old),
          rawLoss: round1327(info.loss),
          research: info.research,
          researchEffective: info.effective,
          protectionCap: info.cap,
          protected: info.offset,
          after: info.value,
        });
      });
      try {
        recalcTeamOvr(teams[team]);
      } catch (_) {}
      changes.push({
        team,
        rank,
        before: round1327(before),
        after: round1327(carIndex1327(team)),
        research: round1327(parts.reduce((s, p) => s + p.research, 0)),
        rawLoss: round1327(
          parts.reduce((s, p) => s + p.rawLoss, 0) / Math.max(1, parts.length),
        ),
        protected: round1327(
          parts.reduce((s, p) => s + p.protected, 0) /
            Math.max(1, parts.length),
        ),
        parts,
      });
    });
    state.techBalanceHistoryV1319 = Array.isArray(state.techBalanceHistoryV1319)
      ? state.techBalanceHistoryV1319
      : [];
    state.techBalanceHistoryV1319.unshift({
      from: oldY,
      to: newY,
      type: "REGULATION_RESET_STRONG_V1327",
      changes,
    });
    state.techBalanceHistoryV1319 = state.techBalanceHistoryV1319.slice(0, 12);
    state.lastTechBalanceV1319 = state.techBalanceHistoryV1319[0];
  };
  try {
    applySeasonDecayAndResearchV15 = window.applySeasonDecayAndResearchV15;
  } catch (_) {}

  const oldOpen1327 = window.openDevProjectV14 || openDevProjectV14;
  window.openDevProjectV14 = function (part) {
    const out = oldOpen1327.apply(this, arguments);
    try {
      if (
        selected &&
        (state?.devMode || "current") === "next" &&
        isReg1327(year1327() + 1)
      ) {
        const info = projectedReg1327(selected[1], part, year1327() + 1),
          modal = document.getElementById("modalBody"),
          hint = modal?.querySelector(".hint");
        if (hint)
          hint.innerHTML = `当前 ${part} <b>${info.old.toFixed(1)}</b>。本次大改规预计裸损失 <b>-${info.loss.toFixed(1)}</b>；已完成新规研究 ${info.research.toFixed(1)} 点，目前可抵消 <b>${info.offset.toFixed(1)}</b> 点（单项最多抵消裸损失的 52%）。按当前研究量，新车预计 <b>${info.value.toFixed(1)}</b>。高性能属性会承受额外规则惩罚。`;
      }
    } catch (e) {
      console.warn("13.27 R&D modal", e);
    }
    return out;
  };
  try {
    openDevProjectV14 = window.openDevProjectV14;
  } catch (_) {}

  const oldRenderDev1327 = window.renderDevelopment || renderDevelopment;
  window.renderDevelopment = function () {
    const out = oldRenderDev1327.apply(this, arguments);
    try {
      if (!selected) return out;
      const ny = year1327() + 1,
        reg = isReg1327(ny);
      if (!reg) return out;
      const team = selected[1],
        rank = carRank1327(team),
        infos = ATTRS1327().map((a) => projectedReg1327(team, a, ny));
      const rawAvg =
          infos.reduce((s, x) => s + x.loss, 0) / Math.max(1, infos.length),
        protAvg =
          infos.reduce((s, x) => s + x.offset, 0) / Math.max(1, infos.length),
        afterAvg =
          infos.reduce((s, x) => s + x.value, 0) / Math.max(1, infos.length);
      const panel = document.getElementById("techCyclePanelV1319");
      if (panel)
        panel.innerHTML = `<div class="tcHead"><b>⚙️ ${ny} 技术规则大改</b><span>STRONG REGULATION RESET · 13.27</span></div><p>新规不再按“旧技术继承 60%”平滑折算，而是直接产生规则损失：单项通常 -10～-22，当前赛车越强，额外惩罚越明显。下一代研发按约 1 点研究抵消 1 点规则损失结算，但每个属性最多只能救回裸损失的 52%。</p><div class="tcGrid"><div class="tcCell"><span>当前赛车指数</span><b>${carIndex1327(team).toFixed(1)} · P${rank}</b></div><div class="tcCell"><span>预计平均裸损失</span><b>-${rawAvg.toFixed(1)}</b></div><div class="tcCell"><span>当前研究后预计</span><b>${afterAvg.toFixed(1)} · 抵消 ${protAvg.toFixed(1)}</b></div></div>`;
      const hint = document.getElementById("devSeasonHint");
      if (hint && (state.devMode || "current") === "next")
        hint.textContent = `${ny} 为大改规年：下一代研发用于抵消规则损失；单项最多抵消 52%，无法完全免疫技术重置。`;
    } catch (e) {
      console.warn("13.27 R&D panel", e);
    }
    return out;
  };
  try {
    renderDevelopment = window.renderDevelopment;
  } catch (_) {}

  const oldFinale1327 = window.showSeasonFinaleV10 || showSeasonFinaleV10;
  window.showSeasonFinaleV10 = function () {
    const out = oldFinale1327.apply(this, arguments);
    try {
      if (selected && isReg1327(year1327() + 1)) {
        const ny = year1327() + 1,
          team = selected[1],
          infos = ATTRS1327().map((a) => projectedReg1327(team, a, ny)),
          raw =
            infos.reduce((s, x) => s + x.loss, 0) / Math.max(1, infos.length),
          prot =
            infos.reduce((s, x) => s + x.offset, 0) / Math.max(1, infos.length),
          after =
            infos.reduce((s, x) => s + x.value, 0) / Math.max(1, infos.length),
          el = document.querySelector(".techFinaleV1319");
        if (el)
          el.innerHTML = `<b>⚙️ ${ny} 技术规则大改 · 13.27 强重置</b><br>六项属性预计平均裸损失 <b>-${raw.toFixed(1)}</b>；当前下一代研究平均抵消 <b>${prot.toFixed(1)}</b>，新车指数预计约 <b>${after.toFixed(1)}</b>。单项规则损失范围 10～22，高性能属性额外受罚，研发最多抵消该项损失的 52%。`;
      }
    } catch (_) {}
    return out;
  };
  try {
    showSeasonFinaleV10 = window.showSeasonFinaleV10;
  } catch (_) {}

  window.RD_BALANCE_V1327 = {
    isRegulationYear: isReg1327,
    carRank: carRank1327,
    regulationShock: ensureShock1327,
    projectedRegulation: projectedReg1327,
    protection: protection1327,
    rawLossRange: [10, 22],
    protectionCap: 0.52,
  };

  const oldStart1327 = window.startCareer || startCareer;
  window.startCareer = function () {
    const out = oldStart1327.apply(this, arguments);
    try {
      if (state) state.regulationShockV1327 = {};
      autosave?.();
    } catch (_) {}
    return out;
  };
  try {
    startCareer = window.startCareer;
  } catch (_) {}
  const oldRestore1327 = window.restoreSnapshot || restoreSnapshot;
  window.restoreSnapshot = function () {
    const out = oldRestore1327.apply(this, arguments);
    try {
      if (out && state && !state.regulationShockV1327)
        state.regulationShockV1327 = {};
    } catch (_) {}
    return out;
  };
  try {
    restoreSnapshot = window.restoreSnapshot;
  } catch (_) {}
  const oldSnap1327 = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = oldSnap1327.apply(this, arguments);
    if (s) {
      s.version = 4157;
      s.majorVersion = "beta";
      s.featureSet = "beta-patch13.27-strong-regulation-reset";
    }
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
})();

/* beta-patch1327-clean-performance-script */

(() => {
  const originalRenderHub =
    window.renderHub || (typeof renderHub === "function" ? renderHub : null);
  if (originalRenderHub) {
    const bootStarted = performance.now();
    const bootWindow = 1400;
    let rendering = false;
    let lastBootRender = -1e9;
    function cleanRenderHub() {
      const now = performance.now();
      if (rendering) return;
      if (now - bootStarted < bootWindow && now - lastBootRender < 110) return;
      rendering = true;
      try {
        return originalRenderHub.apply(this, arguments);
      } finally {
        lastBootRender = performance.now();
        rendering = false;
      }
    }
    window.renderHub = cleanRenderHub;
    try {
      renderHub = cleanRenderHub;
    } catch (_) {}
    /* One final consolidated render after legacy zero-delay initializers have finished. */
    setTimeout(() => {
      if (typeof selected !== "undefined" && selected) {
        try {
          originalRenderHub();
        } catch (e) {
          console.warn("13.27 clean final boot render", e);
        }
      }
    }, 260);
  }

  /* Avoid decoding hidden images before they are needed. */
  try {
    document.querySelectorAll("img").forEach((img) => {
      if (!img.loading) img.loading = "lazy";
      if (!img.decoding) img.decoding = "async";
    });
  } catch (_) {}

  const prevSnapshot =
    window.snapshot || (typeof snapshot === "function" ? snapshot : null);
  if (prevSnapshot) {
    window.snapshot = function () {
      const s = prevSnapshot.apply(this, arguments);
      if (s) {
        s.version = 4157;
        s.majorVersion = "beta";
        s.featureSet = "beta-patch13.27-clean-build-strong-reg-reset";
      }
      return s;
    };
    try {
      snapshot = window.snapshot;
    } catch (_) {}
  }
})();

/* beta-patch1328-driver-era-script */

(() => {
  const clamp1328 = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd1328 = (a, b) => a + Math.random() * (b - a);
  const round1328 = (v) => Math.round(Number(v || 0) * 10) / 10;
  const year1328 = () =>
    Number(
      typeof seasonYearV11 === "function"
        ? seasonYearV11()
        : state?.seasonYear || 2026,
    );

  /* ---------- race result weighting: car 50 / driver 35 / strategy 20 / event 10 / luck 5 ---------- */
  const SCORE1328 = {
    weights: { car: 50, driver: 35, strategy: 20, event: 10, luck: 5 },
    jitter: 0.5,
    eventMin: 56,
    eventMax: 84,
    luckSamples: 4,
    gridStep: 0.42,
    gridMin: -4.0,
    gridMax: 4.7,
  };
  function newWeights1328() {
    const raw = {},
      keys = ["car", "driver", "strategy", "event", "luck"];
    let sum = 0;
    keys.forEach((k) => {
      raw[k] = Math.max(
        1,
        SCORE1328.weights[k] + rnd1328(-SCORE1328.jitter, SCORE1328.jitter),
      );
      sum += raw[k];
    });
    const out = {};
    keys.forEach((k) => (out[k] = raw[k] / sum));
    return out;
  }
  function weights1328(phase, force = false) {
    if (!state?.weekend) return newWeights1328();
    state.weekend.scoreWeightsV1328 = state.weekend.scoreWeightsV1328 || {};
    if (force || !state.weekend.scoreWeightsV1328[phase])
      state.weekend.scoreWeightsV1328[phase] = newWeights1328();
    return state.weekend.scoreWeightsV1328[phase];
  }
  function luck1328(raw) {
    let s = Number.isFinite(Number(raw)) ? Number(raw) : Math.random() * 100;
    for (let i = 1; i < SCORE1328.luckSamples; i++) s += Math.random() * 100;
    return clamp1328(s / SCORE1328.luckSamples, 0, 100);
  }
  function grid1328(d, phase) {
    if (phase !== "race" || !state?.weekend?.qualField) return 0;
    const q = state.weekend.qualField.find((x) => x.name === d[0]);
    if (!q || !Number.isFinite(Number(q.position))) return 0;
    return clamp1328(
      (12 - Number(q.position)) * SCORE1328.gridStep,
      SCORE1328.gridMin,
      SCORE1328.gridMax,
    );
  }
  function strategy1328(d, phase, key) {
    key =
      key ||
      (d[0] === selected?.[0]
        ? state?.weekend?.[phase + "Strategy"]
        : "normal") ||
      "normal";
    const tyre = Number(
        (typeof effectivePartV16 === "function"
          ? effectivePartV16(d[1], "轮胎管理")
          : teams?.[d[1]]?.parts?.["轮胎管理"]) || 70,
      ),
      rac = Number(d[4] || 80),
      awa = Number(d[5] || 80),
      pac = Number(d[6] || 80),
      dev = Number(teams?.[d[1]]?.dev || 88);
    let v = 73 + (tyre - 70) * 0.2 + (dev - 88) * 0.15;
    if (key === "aggressive")
      v += 2 + (rac + pac - 166) * 0.16 + rnd1328(-7, 7);
    else if (key === "conservative")
      v += 3 + (awa - 82) * 0.22 + rnd1328(-3.5, 3.5);
    else v += 5 + (rac + awa - 164) * 0.08 + rnd1328(-3, 3);
    if (phase === "qual")
      v += key === "aggressive" ? 2 : key === "conservative" ? -2 : 1;
    return clamp1328(v, 42, 96);
  }
  window.computeScore = function (
    d,
    phase,
    eventQuality,
    luckRoll,
    noBonus = false,
    strategyKey = null,
  ) {
    const w = weights1328(phase, false),
      car = Number(trackFitV10(d[1], phase)),
      driver = Math.min(
        100,
        Number(driverPhaseRating(d, phase)) +
          Number(prepBonusForDriverV10(d, phase, noBonus) || 0),
      ),
      eventQ = clamp1328(Number(eventQuality) || 65, 20, 100),
      luck = luck1328(luckRoll),
      strat = strategy1328(d, phase, strategyKey),
      gridAdj = grid1328(d, phase);
    let total =
        car * w.car +
        driver * w.driver +
        strat * w.strategy +
        eventQ * w.event +
        luck * w.luck +
        gridAdj,
      playerDecision = 0;
    if (!noBonus && selected && d[0] === selected[0]) {
      const affairs =
          Number(state.affairsNextRaceModifier || 0) +
          Number(state.affairsLongTermModifier || 0),
        weekly =
          phase === "qual"
            ? Number(state.affairsWeekendQual || 0)
            : Number(state.affairsWeekendRace || 0);
      playerDecision = affairs + weekly;
      total += playerDecision;
    }
    return {
      total,
      car,
      driver,
      strategy: strat,
      eventQuality: eventQ,
      luckRoll: luck,
      gridAdj,
      weights: { ...w },
      playerDecision,
    };
  };
  try {
    computeScore = window.computeScore;
  } catch (_) {}
  window.RACE_SCORE_V1328 = { ...SCORE1328 };

  window.simulateAIFieldV10 = function (phase, noPlayerBonus = false) {
    try {
      ensureAITrainingV10?.();
      ensureAIWeekendSetupV36?.(false);
    } catch (_) {}
    return drivers
      .filter((d) => d[0] !== selected[0])
      .map((d) => {
        const strat = aiStrategyV10(),
          control = Number(state.aiPrep?.[d[0]]?.control || 0),
          eq = clamp1328(
            rnd1328(SCORE1328.eventMin, SCORE1328.eventMax) + control * 0.18,
            35,
            94,
          ),
          sc = window.computeScore(
            d,
            phase,
            eq,
            Math.random() * 100,
            false,
            strat,
          );
        return {
          name: d[0],
          team: d[1],
          total: sc.total,
          strategy: strat,
          mine: false,
        };
      });
  };
  try {
    simulateAIFieldV10 = window.simulateAIFieldV10;
    simulateAIField = window.simulateAIFieldV10;
  } catch (_) {}
  window.simulateDirectSessionV10 = function (phase) {
    weights1328(phase, true);
    try {
      ensureAIWeekendSetupV36?.(false);
    } catch (_) {}
    let field = drivers
      .map((d) => {
        const mine = d[0] === selected[0],
          strat = mine
            ? state.weekend?.[phase + "Strategy"] || "normal"
            : aiStrategyV10(),
          eq = rnd1328(SCORE1328.eventMin, SCORE1328.eventMax),
          sc = window.computeScore(
            d,
            phase,
            eq,
            Math.random() * 100,
            true,
            strat,
          );
        return {
          name: d[0],
          team: d[1],
          total: sc.total,
          mine,
          strategy: strat,
        };
      })
      .sort((a, b) => b.total - a.total);
    if (phase === "race") applyAttritionV10(field);
    field.forEach((x, i) => (x.position = i + 1));
    if (phase === "race") {
      let fin = 0;
      field.forEach((x) => {
        if (!x.dnf) {
          fin++;
          x.position = fin;
        } else x.position = 99;
      });
      field.filter((x) => x.dnf).forEach((x, i) => (x.position = fin + i + 1));
      const pts = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
      field.forEach((x) => (x.points = x.dnf ? 0 : pts[x.position - 1] || 0));
    }
    return field;
  };
  try {
    simulateDirectSessionV10 = window.simulateDirectSessionV10;
  } catch (_) {}
  window.applyStrategyShiftV10 = function (field, name, phase, key) {
    const idx = field.findIndex((x) => x.name === name);
    if (idx < 0 || field[idx].dnf) return field;
    let delta = 0,
      r = Math.random();
    if (key === "aggressive") {
      delta =
        r < 0.24
          ? -1 - (Math.random() < 0.25 ? 1 : 0)
          : r < 0.52
            ? 1 + (Math.random() < 0.2 ? 1 : 0)
            : 0;
    } else if (key === "conservative") {
      delta = r < 0.12 ? -1 : r < 0.28 ? 1 : 0;
    } else {
      delta = r < 0.12 ? -1 : r < 0.24 ? 1 : 0;
    }
    const target = clamp1328(idx + delta, 0, field.length - 1);
    if (target !== idx) {
      const [x] = field.splice(idx, 1);
      field.splice(target, 0, x);
    }
    return field;
  };
  try {
    applyStrategyShiftV10 = window.applyStrategyShiftV10;
  } catch (_) {}
  if (typeof simulateSprintFieldV12 === "function") {
    window.simulateSprintFieldV12 = function (noPlayerChoice = false) {
      const pts = [8, 7, 6, 5, 4, 3, 2, 1];
      weights1328("race", true);
      let field = drivers
        .map((d) => {
          const mine = d[0] === selected[0],
            strat =
              !noPlayerChoice && mine
                ? state.weekend.sprintStrategy || "normal"
                : aiStrategyV10(),
            eq = rnd1328(SCORE1328.eventMin, SCORE1328.eventMax),
            sc = window.computeScore(
              d,
              "race",
              eq,
              Math.random() * 100,
              true,
              strat,
            );
          return {
            name: d[0],
            team: d[1],
            total: sc.total,
            mine,
            strategy: strat,
            dnf: false,
          };
        })
        .sort((a, b) => b.total - a.total);
      field.forEach((x) => {
        const d = drivers.find((v) => v[0] === x.name),
          base = retirementChanceV10(d, x.strategy, 0) * 0.52;
        if (Math.random() < base) {
          x.dnf = true;
          x.total -= 100;
        }
      });
      field.sort((a, b) => xSort1328(a, b));
      if (!noPlayerChoice && state.weekend.sprintStrategy)
        window.applyStrategyShiftV10(
          field,
          selected[0],
          "race",
          state.weekend.sprintStrategy,
        );
      let fin = 0;
      field.forEach((x) => {
        if (!x.dnf) {
          fin++;
          x.position = fin;
          x.points = pts[fin - 1] || 0;
        } else {
          x.position = 99;
          x.points = 0;
        }
      });
      field.filter((x) => x.dnf).forEach((x, i) => (x.position = fin + i + 1));
      return field;
    };
    try {
      simulateSprintFieldV12 = window.simulateSprintFieldV12;
    } catch (_) {}
  }
  function xSort1328(a, b) {
    if (!!a.dnf !== !!b.dnf) return a.dnf ? 1 : -1;
    return b.total - a.total;
  }

  /* ---------- 2026 F2 pool ---------- */
  const F2_BASE_1328 = [
    [
      "Nikola Tsolov",
      "Campos Racing",
      "保加利亚",
      2006,
      78,
      61,
      83,
      73,
      84,
      92,
      1,
      6,
    ],
    [
      "Gabriele Minì",
      "MP Motorsport",
      "意大利",
      2005,
      77,
      66,
      82,
      78,
      82,
      89,
      2,
      9,
    ],
    [
      "Rafael Câmara",
      "Invicta Racing",
      "巴西",
      2005,
      77,
      53,
      80,
      79,
      85,
      93,
      3,
      1,
    ],
    [
      "Alexander Dunne",
      "Rodin Motorsport",
      "爱尔兰",
      2005,
      76,
      58,
      81,
      66,
      83,
      90,
      4,
      15,
    ],
    [
      "Noel León",
      "Campos Racing",
      "墨西哥",
      2004,
      73,
      52,
      78,
      71,
      78,
      86,
      5,
      5,
    ],
    [
      "Kush Maini",
      "ART Grand Prix",
      "印度",
      2000,
      73,
      74,
      77,
      74,
      75,
      80,
      6,
      16,
    ],
    [
      "Dino Beganovic",
      "DAMS Lucas Oil",
      "瑞典",
      2004,
      74,
      58,
      78,
      75,
      80,
      88,
      7,
      7,
    ],
    ["Colton Herta", "Hitech", "美国", 2000, 78, 90, 85, 76, 79, 84, 16, 4],
    [
      "Martinius Stenshorne",
      "Rodin Motorsport",
      "挪威",
      2006,
      72,
      47,
      76,
      69,
      80,
      90,
      9,
      14,
    ],
    [
      "Joshua Dürksen",
      "Invicta Racing",
      "巴拉圭",
      2003,
      72,
      64,
      79,
      68,
      76,
      84,
      11,
      2,
    ],
    ["Ritomo Miyata", "Hitech", "日本", 1999, 73, 84, 75, 80, 73, 79, 13, 3],
    [
      "Laurens van Hoepen",
      "TRIDENT",
      "荷兰",
      2005,
      71,
      44,
      74,
      76,
      76,
      87,
      8,
      24,
    ],
    [
      "Nico Varrone",
      "Van Amersfoort Racing",
      "阿根廷",
      2000,
      71,
      78,
      76,
      81,
      67,
      77,
      19,
      22,
    ],
    [
      "Oliver Goethe",
      "MP Motorsport",
      "德国",
      2004,
      70,
      50,
      70,
      72,
      75,
      84,
      14,
      10,
    ],
    [
      "Tasanapol Inthraphuvasak",
      "ART Grand Prix",
      "泰国",
      2005,
      69,
      46,
      71,
      73,
      74,
      82,
      10,
      17,
    ],
    [
      "Sebastián Montoya",
      "PREMA Racing",
      "哥伦比亚",
      2005,
      69,
      51,
      72,
      67,
      73,
      85,
      15,
      11,
    ],
    [
      "Roman Bilinski",
      "DAMS Lucas Oil",
      "波兰",
      2004,
      68,
      43,
      69,
      75,
      72,
      84,
      17,
      8,
    ],
    [
      "Rafael Villagomez",
      "Van Amersfoort Racing",
      "墨西哥",
      2001,
      68,
      70,
      70,
      71,
      69,
      76,
      12,
      23,
    ],
    [
      "Mari Boya",
      "PREMA Racing",
      "西班牙",
      2004,
      67,
      42,
      68,
      74,
      70,
      83,
      20,
      12,
    ],
    ["John Bennett", "TRIDENT", "英国", 2003, 65, 46, 66, 69, 68, 78, 18, 25],
    [
      "Emerson Fittipaldi",
      "AIX Racing",
      "巴西",
      2007,
      65,
      39,
      65,
      70,
      68,
      80,
      21,
      20,
    ],
    [
      "Cian Shields",
      "AIX Racing",
      "英国",
      2005,
      63,
      52,
      63,
      65,
      66,
      75,
      22,
      21,
    ],
  ];
  const F1_BIRTH_1328 = {
    "Max Verstappen": 1997,
    "Isack Hadjar": 2004,
    "Lewis Hamilton": 1985,
    "Charles Leclerc": 1997,
    "Lando Norris": 1999,
    "Oscar Piastri": 2001,
    "George Russell": 1998,
    "Kimi Antonelli": 2006,
    "Fernando Alonso": 1981,
    "Lance Stroll": 1998,
    "Carlos Sainz": 1994,
    "Alexander Albon": 1996,
    "Pierre Gasly": 1996,
    "Franco Colapinto": 2003,
    "Esteban Ocon": 1996,
    "Oliver Bearman": 2005,
    "Liam Lawson": 2002,
    "Arvid Lindblad": 2007,
    "Nico Hulkenberg": 1987,
    "Gabriel Bortoleto": 2004,
    "Sergio Perez": 1990,
    "Valtteri Bottas": 1989,
  };
  F2_BASE_1328.forEach((x) => (F1_BIRTH_1328[x[0]] = x[3]));
  function initPool1328() {
    if (!state) return [];
    if (!Array.isArray(state.f2PoolV1328)) {
      state.f2PoolV1328 = F2_BASE_1328.map((x) => ({
        name: x[0],
        team: x[1],
        nation: x[2],
        birth: x[3],
        ovr: x[4],
        exp: x[5],
        rac: x[6],
        awa: x[7],
        pac: x[8],
        pot: x[9],
        rank: x[10],
        number: x[11],
        status: "F2",
        promotedYear: null,
      }));
    }
    if (!Array.isArray(state.f1FreeAgentsV1328)) state.f1FreeAgentsV1328 = [];
    if (!Array.isArray(state.retiredDriversV1328))
      state.retiredDriversV1328 = [];
    if (!Array.isArray(state.retirementQueueV1328))
      state.retirementQueueV1328 = [];
    if (!state.aiCareerV1328) state.aiCareerV1328 = {};
    if (!state.driverEraProcessedV1328) state.driverEraProcessedV1328 = {};
    return state.f2PoolV1328;
  }
  function birth1328(name) {
    const f = state?.f2PoolV1328?.find((x) => x.name === name);
    return Number(f?.birth || F1_BIRTH_1328[name] || year1328() - 27);
  }
  function age1328(name, y = year1328()) {
    return Math.max(18, Number(y) - birth1328(name));
  }
  function retirementBase1328(age) {
    if (age <= 32) return 0.001;
    if (age <= 34) return 0.003;
    if (age <= 36) return 0.01;
    if (age <= 38) return 0.025;
    if (age <= 40) return 0.045;
    if (age <= 42) return 0.075;
    if (age <= 44) return 0.12;
    if (age === 45) return 0.18;
    if (age === 46) return 0.22;
    return 0.28;
  }
  function seasonRank1328(name) {
    const a = Object.entries(state.driverStandings || {}).sort(
      (x, y) => Number(y[1] || 0) - Number(x[1] || 0),
    );
    const i = a.findIndex((x) => x[0] === name);
    return i < 0 ? 22 : i + 1;
  }
  function retirementChance1328(d, y) {
    const age = age1328(d[0], y),
      c = state.driverContracts?.[d[0]] || {},
      end = Number(c.end ?? y),
      remain = end - y;
    /* 13.28.8: an active contract means the driver stays. Retirement is evaluated only when the deal actually expires. */
    if (remain > 0) return 0;
    let p = retirementBase1328(age);
    const st = state.driverSeasonStats?.[d[0]] || {},
      rank = seasonRank1328(d[0]),
      pts = Number(state.driverStandings?.[d[0]] || 0),
      mate = drivers
        .filter((x) => x[1] === d[1] && x[0] !== d[0])
        .sort(
          (a, b) =>
            Number(state.driverStandings?.[b[0]] || 0) -
            Number(state.driverStandings?.[a[0]] || 0),
        )[0],
      matePts = Number(state.driverStandings?.[mate?.[0]] || 0);
    /* Strong form makes veterans much more likely to seek/receive another one-year deal. */
    if (rank <= 5) p *= 0.45;
    else if (rank <= 10) p *= 0.65;
    else if (rank <= 15) p *= 0.9;
    else if (rank >= 19) p *= 1.3;
    else if (rank >= 16) p *= 1.18;
    if (Number(st.wins || 0) > 0) p *= 0.78;
    if (Number(st.podiums || 0) >= 3) p *= 0.85;
    if (pts - matePts >= 25) p *= 0.72;
    else if (pts - matePts >= 10) p *= 0.86;
    if (matePts - pts >= 40) p *= 1.25;
    else if (matePts - pts >= 20) p *= 1.12;
    if (Number(d[2] || 0) >= 88) p *= 0.82;
    else if (Number(d[2] || 0) <= 82) p *= 1.12;
    const tr = teamRankSafe1328(d[1]);
    if (tr <= 4) p *= 0.9;
    else if (tr >= 9) p *= 1.1;
    return clamp1328(p, 0.0005, 0.36);
  }
  function aging1328(d, newY) {
    if (d[0] === selected?.[0]) return;
    const age = age1328(d[0], newY);
    let pac = 0,
      rac = 0,
      ovr = 0;
    if (age === 37) {
      if (Math.random() < 0.28) pac = 1;
      if (Math.random() < 0.1) ovr = 1;
    } else if (age === 38) {
      pac = Math.random() < 0.58 ? 1 : 0;
      if (Math.random() < 0.22) ovr = 1;
    } else if (age === 39) {
      pac = 1 + (Math.random() < 0.35 ? 1 : 0);
      rac = Math.random() < 0.2 ? 1 : 0;
      ovr = Math.random() < 0.48 ? 1 : 0;
    } else if (age === 40) {
      pac = 1 + (Math.random() < 0.55 ? 1 : 0);
      rac = Math.random() < 0.32 ? 1 : 0;
      ovr = 1 + (Math.random() < 0.16 ? 1 : 0);
    } else if (age >= 41) {
      pac = 1 + Math.floor(Math.random() * 3);
      rac = Math.random() < 0.5 ? 1 : 0;
      ovr = 1 + (Math.random() < 0.45 ? 1 : 0);
    }
    d[6] = Math.max(60, Number(d[6] || 70) - pac);
    d[4] = Math.max(62, Number(d[4] || 70) - rac);
    d[2] = Math.max(65, Number(d[2] || 70) - ovr);
    d[3] = Math.min(
      99,
      Number(d[3] || 70) + (age <= 39 && Math.random() < 0.35 ? 1 : 0),
    );
  }
  function recordCareer1328(y) {
    if (state.driverEraProcessedV1328[String(y)]) return;
    drivers.forEach((d) => {
      if (d[0] === selected?.[0]) return;
      const st = state.driverSeasonStats?.[d[0]] || {},
        rank = seasonRank1328(d[0]),
        c =
          state.aiCareerV1328[d[0]] ||
          (state.aiCareerV1328[d[0]] = {
            seasons: 0,
            wins: 0,
            podiums: 0,
            poles: 0,
            titles: 0,
          });
      c.seasons++;
      c.wins += Number(st.wins || 0);
      c.podiums += Number(st.podiums || 0);
      c.poles += Number(st.poles || 0);
      if (rank === 1) c.titles++;
    });
    state.driverEraProcessedV1328[String(y)] = true;
  }
  function retirementReason1328(d, y, chance) {
    const age = age1328(d[0], y),
      rank = seasonRank1328(d[0]),
      st = state.driverSeasonStats?.[d[0]] || {};
    if (rank <= 5 || Number(st.wins || 0) > 0)
      return `在合同到期后的续约评估中，${d[0]} 最终选择在仍具备前列竞争力时结束自己的F1生涯。`;
    if (rank >= 16)
      return `经历一个艰难的 ${y} 赛季后，${d[0]} 在合同到期时决定不再寻求新的F1席位。`;
    return `合同到期后，${d[0]} 在评估继续征战与续约机会后，于 ${age} 岁结束自己的F1生涯。`;
  }
  function retire1328(d, y, chance) {
    const p = driverProfiles?.[d[0]] || {},
      c = state.aiCareerV1328?.[d[0]] || {},
      news = {
        name: d[0],
        team: d[1],
        age: age1328(d[0], y),
        year: y,
        chance: Math.round(chance * 100),
        titles: Number(p.titles || 0) + Number(c.titles || 0),
        wins: Number(p.wins || 0) + Number(c.wins || 0),
        podiums: Number(p.podiums || 0) + Number(c.podiums || 0),
        reason: retirementReason1328(d, y, chance),
        replacement: null,
      };
    state.retiredDriversV1328.push({ ...news });
    state.retirementQueueV1328.push({ ...news });
    state.contractHistory = state.contractHistory || [];
    state.contractHistory.unshift(
      `BREAKING · ${d[0]} 宣布将在 ${y} 赛季后退役`,
    );
    return news;
  }
  function assignNumber1328(preferred) {
    const used = new Set(
      drivers
        .map((d) => Number(driverProfiles?.[d[0]]?.number))
        .filter(Number.isFinite),
    );
    preferred = Number(preferred);
    if (preferred >= 2 && preferred <= 99 && !used.has(preferred))
      return preferred;
    for (const n of [
      27, 28, 29, 31, 32, 34, 36, 38, 40, 42, 43, 44, 45, 46, 47, 48, 49, 51,
      52, 54, 55, 57, 58, 59, 60, 62, 63, 64, 65, 66, 67, 68, 69, 71, 72, 73,
      74, 75, 76, 77, 78, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93,
      94, 95, 97, 98, 99,
    ])
      if (!used.has(n)) return n;
    return 99;
  }
  function promote1328(f, team, y) {
    const number = assignNumber1328(f.number),
      row = [
        f.name,
        team,
        Math.round(f.ovr),
        Math.round(f.exp),
        Math.round(f.rac),
        Math.round(f.awa),
        Math.round(f.pac),
      ];
    driverProfiles[f.name] = {
      number,
      nation: f.nation,
      debut: y + 1,
      season2025: `${y} F2 · P${f.rank}`,
      titles: 0,
      wins: 0,
      podiums: 0,
      poles: 0,
      best: `F2晋升 · 潜力 ${f.pot}`,
      f2GraduateV1328: true,
      potentialV1328: f.pot,
    };
    state.driverContracts[f.name] = {
      end: y + 2,
      label: `至 ${y + 2} · F2晋升合同`,
      option: false,
      rolling: false,
      note: "13.28 F2晋升",
    };
    f.status = "F1";
    f.promotedYear = y + 1;
    f.f1Team = team;
    return row;
  }
  function f2Score1328(f, team, retirementTeams) {
    const tr = teamRankSafe1328(team),
      rankBonus =
        f.rank === 1
          ? 10
          : f.rank === 2
            ? 8
            : f.rank === 3
              ? 7
              : f.rank <= 6
                ? 4
                : f.rank <= 10
                  ? 1
                  : -3;
    let s = f.ovr + f.pot * 0.12 + rankBonus + rnd1328(-2.5, 2.5);
    if (tr <= 4) {
      if (f.rank <= 3 && f.pot >= 90 && f.ovr >= 76) s -= 3;
      else s -= 13;
    } else if (tr <= 7) s += 1;
    else s += 6;
    if (retirementTeams.has(team)) s += 5;
    return s;
  }
  function f1Score1328(x, team, y) {
    const d = x.row,
      old = x.oldTeam || d[1],
      pts = Number(x.pts || 0),
      wins = Number(x.wins || 0),
      age = age1328(d[0], y);
    return (
      Number(d[2] || 78) +
      pts * 0.035 +
      wins * 1.6 +
      (old === team ? 12 : 0) -
      Math.max(0, age - 34) * 0.45 +
      rnd1328(-3, 3)
    );
  }
  function advanceF2Pool1328(newY) {
    const xs = initPool1328().filter((f) => f.status === "F2");
    xs.forEach((f) => {
      const age = age1328(f.name, newY),
        gap = Math.max(0, f.pot - f.ovr),
        growth =
          age <= 21
            ? rnd1328(0.2, Math.min(2.0, 0.4 + gap * 0.12))
            : age <= 23
              ? rnd1328(0, Math.min(1.2, 0.2 + gap * 0.08))
              : rnd1328(-0.2, 0.5);
      f.ovr = round1328(clamp1328(f.ovr + growth, 60, f.pot));
      f.pac = round1328(clamp1328(f.pac + growth * 0.8, 60, 96));
      f.rac = round1328(clamp1328(f.rac + growth * 0.45, 60, 95));
      f.awa = round1328(clamp1328(f.awa + Math.max(0, growth) * 0.25, 60, 95));
      f.exp = round1328(clamp1328(f.exp + 1.2, 35, 95));
    });
    xs.sort(
      (a, b) =>
        b.ovr +
        b.pot * 0.16 +
        rnd1328(-7, 7) -
        (a.ovr + a.pot * 0.16 + rnd1328(-7, 7)),
    ).forEach((f, i) => (f.rank = i + 1));
  }
  function profileForFree1328(name) {
    return driverProfiles?.[name]
      ? JSON.parse(JSON.stringify(driverProfiles[name]))
      : {};
  }
  function rehydrate1328() {
    initPool1328();
    (state.f1FreeAgentsV1328 || []).forEach((x) => {
      if (x?.name && x.profile)
        driverProfiles[x.name] = JSON.parse(JSON.stringify(x.profile));
    });
    (state.f2PoolV1328 || [])
      .filter((x) => x.status === "F1")
      .forEach((f) => {
        if (!driverProfiles[f.name])
          driverProfiles[f.name] = {
            number: f.number,
            nation: f.nation,
            debut: f.promotedYear || year1328(),
            season2025: "F2晋升",
            titles: 0,
            wins: 0,
            podiums: 0,
            poles: 0,
            best: `F2晋升 · 潜力 ${f.pot}`,
            f2GraduateV1328: true,
            potentialV1328: f.pot,
          };
      });
  }

  function assignGrid1328(opts = {}) {
    initPool1328();
    rehydrate1328();
    const apply = opts.apply !== false,
      y = year1328(),
      key = String(y);
    state.offseasonPreparedV1328 = state.offseasonPreparedV1328 || {};
    const cached = state.offseasonPreparedV1328[key];
    if (cached?.done) {
      if (apply && Array.isArray(cached.roster)) {
        drivers.splice(
          0,
          drivers.length,
          ...cached.roster.map((r) => r.slice()),
        );
        try {
          selected =
            drivers.find((d) => d[0] === cached.playerName) || selected;
        } catch (_) {}
      }
      return cached.result || { retirements: [], moves: [], promotions: 0 };
    }
    const newY = y + 1,
      playerName = selected[0],
      target = state.contract?.nextTeam || selected[1];
    recordCareer1328(y);
    const retirementTeams = new Set(),
      retiredNames = new Set(),
      retireNews = [];
    const currentAI = drivers.filter((d) => d[0] !== playerName);
    currentAI.forEach((d) => {
      const chance = retirementChance1328(d, y);
      if (age1328(d[0], y) >= 33 && Math.random() < chance) {
        retiredNames.add(d[0]);
        retirementTeams.add(d[1]);
        retireNews.push(retire1328(d, y, chance));
      }
    });
    const workingAI = currentAI
      .filter((d) => !retiredNames.has(d[0]))
      .map((d) => d.slice());
    workingAI.forEach((d) => aging1328(d, newY));
    const seats = {};
    Object.keys(teams).forEach((t) => (seats[t] = 2));
    const currentPlayer = drivers.find((d) => d[0] === playerName) || selected,
      playerRow = currentPlayer.slice();
    playerRow[1] = target;
    if (seats[target] != null) seats[target]--;
    const roster = [playerRow],
      free = [];
    workingAI.forEach((d) => {
      const c = state.driverContracts?.[d[0]] || {},
        locked = Number(c.end || y) > y;
      if (locked && seats[d[1]] > 0) {
        roster.push(d);
        seats[d[1]]--;
      } else
        free.push({
          name: d[0],
          row: d,
          oldTeam: d[1],
          pts: Number(state.driverStandings?.[d[0]] || 0),
          wins: Number(state.driverSeasonStats?.[d[0]]?.wins || 0),
          profile: profileForFree1328(d[0]),
        });
    });
    (state.f1FreeAgentsV1328 || []).forEach((x) => {
      if (
        !retiredNames.has(x.name) &&
        !roster.some((d) => d[0] === x.name) &&
        !free.some((v) => v.name === x.name)
      )
        free.push({
          name: x.name,
          row: (x.row || []).slice(),
          oldTeam: x.oldTeam || x.row?.[1] || "",
          pts: 0,
          wins: 0,
          profile: x.profile || {},
        });
    });
    const order = teamOrderSafe1328(),
      openTeams = [];
    order.forEach((t) => {
      for (let n = 0; n < (seats[t] || 0); n++) openTeams.push(t);
    });
    let promotions = 0;
    const promotionCap = Math.min(
        3,
        Math.max(1, retireNews.length + (Math.random() < 0.42 ? 1 : 0)),
      ),
      moves = [];
    for (const team of openTeams) {
      const bestF1 =
        free
          .map((x, i) => ({ x, i, s: f1Score1328(x, team, y) }))
          .sort((a, b) => b.s - a.s)[0] || null;
      const f2s = state.f2PoolV1328
          .filter((f) => f.status === "F2" && f.rank <= 12)
          .map((f) => ({ f, s: f2Score1328(f, team, retirementTeams) }))
          .sort((a, b) => b.s - a.s),
        bestF2 = promotions < promotionCap ? f2s[0] : null;
      const useF2 =
        !!bestF2 &&
        (!bestF1 ||
          bestF2.s > bestF1.s + (teamRankSafe1328(team) <= 4 ? 3 : 0));
      if (useF2) {
        const row = promote1328(bestF2.f, team, y);
        roster.push(row);
        promotions++;
        moves.push({
          name: row[0],
          team,
          from: "F2",
          label: `F2 P${bestF2.f.rank} 晋升`,
        });
      } else if (bestF1) {
        const item = free.splice(bestF1.i, 1)[0],
          row = item.row;
        row[1] = team;
        roster.push(row);
        const age = age1328(row[0], y),
          years =
            age >= 35
              ? 1
              : Number(row[2] || 0) >= 86
                ? 2
                : Math.random() < 0.55
                  ? 2
                  : 1;
        state.driverContracts[row[0]] = state.driverContracts[row[0]] || {};
        Object.assign(state.driverContracts[row[0]], {
          end: y + years,
          label: `至 ${y + years}`,
          option: false,
          rolling: false,
          note: "13.28 游戏世界合同",
        });
        moves.push({
          name: row[0],
          team,
          from: item.oldTeam,
          label: item.oldTeam === team ? "续约" : "转会",
        });
      }
    }
    while (roster.length < Object.keys(teams).length * 2) {
      const team = Object.keys(teams).find(
          (t) => roster.filter((d) => d[1] === t).length < 2,
        ),
        f = state.f2PoolV1328
          .filter((x) => x.status === "F2")
          .sort((a, b) => a.rank - b.rank)[0];
      if (!team || !f) break;
      const row = promote1328(f, team, y);
      roster.push(row);
      promotions++;
      moves.push({
        name: row[0],
        team,
        from: "F2",
        label: `F2 P${f.rank} 晋升`,
      });
    }
    state.f1FreeAgentsV1328 = free
      .map((x) => ({
        name: x.name,
        row: x.row.slice(),
        oldTeam: x.oldTeam,
        profile: x.profile || profileForFree1328(x.name),
        birth: birth1328(x.name),
      }))
      .slice(0, 24);
    const preparedRoster = roster
      .slice(0, Object.keys(teams).length * 2)
      .map((r) => r.slice());
    state.offseasonMovesV1328 = moves;
    retireNews.forEach((n) => {
      const m = moves.find(
        (x) => x.team === n.team && x.name !== n.name && x.from !== n.team,
      );
      if (m) n.replacement = `${m.name}（${m.label}）`;
      else n.replacement = null;
    });
    state.retirementQueueV1328 = [];
    advanceF2Pool1328(newY);
    state.contractHistory = state.contractHistory || [];
    moves.forEach((m) =>
      state.contractHistory.unshift(
        `${newY} · ${m.name} ${m.from === "F2" ? "由F2晋升" : "加盟"} ${m.team}`,
      ),
    );
    state.contractHistory = state.contractHistory.slice(0, 40);
    const result = {
      retirements: retireNews.map((x) => ({ ...x })),
      moves: moves.map((x) => ({ ...x })),
      promotions,
    };
    state.offseasonPreparedV1328[key] = {
      done: true,
      year: y,
      playerName,
      roster: preparedRoster.map((r) => r.slice()),
      result,
    };
    if (apply) {
      drivers.splice(
        0,
        drivers.length,
        ...preparedRoster.map((r) => r.slice()),
      );
      try {
        selected = drivers.find((d) => d[0] === playerName) || selected;
      } catch (_) {}
    }
    return result;
  }
  function prepareOffseason1328() {
    return assignGrid1328({ apply: false });
  }
  window.prepareOffseason1328 = prepareOffseason1328;
  function teamOrderSafe1328() {
    const names = Object.keys(teams || {}),
      pts = state?.teamStandings || {},
      any = names.some((t) => Number(pts[t] || 0) > 0);
    return names.sort((a, b) =>
      any
        ? Number(pts[b] || 0) - Number(pts[a] || 0) ||
          Number(teams[b]?.ovr || 0) - Number(teams[a]?.ovr || 0)
        : Number(teams[b]?.ovr || 0) - Number(teams[a]?.ovr || 0),
    );
  }
  function teamRankSafe1328(team) {
    const o = teamOrderSafe1328(),
      i = o.indexOf(team);
    return i < 0 ? 8 : i + 1;
  }
  const applyPreparedGrid1328 = () => assignGrid1328({ apply: true });
  window.aiAssignContractsV40 = applyPreparedGrid1328;
  window.aiAssignContractsV15 = applyPreparedGrid1328;
  try {
    aiAssignContractsV15 = applyPreparedGrid1328;
  } catch (_) {}

  /* ---------- legacy English BREAKING popup removed in 13.28.5 ---------- */
  function esc1328(s) {
    return String(s ?? "").replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[m],
    );
  }

  /* ---------- F2 market UI + hub copy fix ---------- */
  function f2MarketHTML1328() {
    const pool = initPool1328()
      .filter((f) => f.status === "F2")
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 8);
    return `<div class="card f2Market1328" id="f2Market1328"><div class="relationhead"><div><div class="kicker">FORMULA 2 · JUNIOR MARKET</div><h2 class="sectiontitle" style="margin-bottom:3px">F2 晋升候选</h2><div class="small">F2成绩、当前能力、潜力和车队级别共同决定年底是否获得F1席位。</div></div><div class="small">${pool.length} SHOWN</div></div><div class="f2Grid1328">${pool.map((f) => `<div class="f2Card1328"><div class="f2Rank1328">P${f.rank}</div><div><b>${esc1328(f.name)}</b><small>${esc1328(f.team)} · ${esc1328(f.nation)}</small></div><div class="f2Nums1328"><strong>${Math.round(f.ovr)}</strong><em>OVR · POT ${f.pot}</em></div></div>`).join("")}</div></div>`;
  }
  const oldContracts1328 = window.renderContractsV10 || renderContractsV10;
  window.renderContractsV10 = function () {
    const r = oldContracts1328.apply(this, arguments);
    try {
      const host = document.getElementById("contractContent");
      if (host && !document.getElementById("f2Market1328"))
        host.insertAdjacentHTML("beforeend", f2MarketHTML1328());
    } catch (e) {
      console.warn("13.28 F2 market UI", e);
    }
    return r;
  };
  try {
    renderContractsV10 = window.renderContractsV10;
  } catch (_) {}
  const oldHub1328 = window.renderHub || renderHub;
  window.renderHub = function () {
    const r = oldHub1328.apply(this, arguments);
    try {
      const standings = document.querySelector(
          '#career .modules .module[onclick*="season"]',
        ),
        contracts = document.querySelector(
          '#career .modules .module[onclick*="contracts"]',
        );
      if (standings) {
        const p = standings.querySelector("p");
        if (p)
          p.textContent = "查看每站后的 WDC / WCC、分站结果与历年赛季记录。";
      }
      if (contracts) {
        const p = contracts.querySelector("p");
        if (p)
          p.textContent =
            "处理续约与转会；赛季结束后F2新秀会竞争空缺席位，老将也可能宣布退役。";
      }
    } catch (_) {}
    return r;
  };
  try {
    renderHub = window.renderHub;
  } catch (_) {}

  function injectOffseasonSummary1328() {
    try {
      const y = year1328(),
        prep = state?.offseasonPreparedV1328?.[String(y)]?.result,
        host = document.getElementById("finalContract");
      if (!prep || !host) return;
      host.querySelector?.(".offseasonSummary1328")?.remove();
      const rs = prep.retirements?.length || 0,
        ps = prep.promotions || 0,
        mv = prep.moves?.length || 0;
      host.insertAdjacentHTML(
        "beforeend",
        `<div class="offseasonSummary1328" style="margin-top:9px;padding:10px 11px;border:1px solid #dfe4ea;border-radius:9px;background:#f7f9fb;font-size:11px;line-height:1.65"><b>休赛期车手动态</b><br>${rs ? `${rs} 名车手确认退役` : "本休赛期暂无车手确认退役"} · ${ps} 名F2车手晋升 · ${mv} 个席位发生续约/转会/晋升变化。</div>`,
      );
    } catch (_) {}
  }
  const oldFinale1328 = window.showSeasonFinaleV10 || showSeasonFinaleV10;
  window.showSeasonFinaleV10 = function () {
    if (
      selected &&
      typeof seasonCompleteV14 === "function" &&
      seasonCompleteV14()
    ) {
      try {
        prepareOffseason1328();
      } catch (e) {
        console.warn("13.28.1 offseason prepare", e);
      }
    }
    const r = oldFinale1328.apply(this, arguments);
    try {
      injectOffseasonSummary1328();
      autosave?.();
    } catch (_) {}
    return r;
  };
  try {
    showSeasonFinaleV10 = window.showSeasonFinaleV10;
  } catch (_) {}
  const oldStart1328 = window.startCareer || startCareer;
  window.startCareer = function () {
    const r = oldStart1328.apply(this, arguments);
    if (state) {
      state.f2PoolV1328 = null;
      state.f1FreeAgentsV1328 = [];
      state.retiredDriversV1328 = [];
      state.retirementQueueV1328 = [];
      state.aiCareerV1328 = {};
      state.driverEraProcessedV1328 = {};
      state.offseasonMovesV1328 = [];
      state.offseasonPreparedV1328 = {};
      initPool1328();
      try {
        renderHub();
        autosave?.();
      } catch (_) {}
    }
    return r;
  };
  try {
    startCareer = window.startCareer;
  } catch (_) {}
  const oldNext1328 = window.startNextSeasonV11 || startNextSeasonV11;
  window.startNextSeasonV11 = function () {
    const before = year1328(),
      r = oldNext1328.apply(this, arguments);
    if (selected && year1328() > before) {
      try {
        if (state.weekend) state.weekend.scoreWeightsV1328 = {};
        rehydrate1328();
        renderHub();
        autosave?.();
      } catch (e) {
        console.warn("13.28 season rollover", e);
      }
    }
    return r;
  };
  try {
    startNextSeasonV11 = window.startNextSeasonV11;
  } catch (_) {}
  const oldAdvance1328 = window.advanceRound || advanceRound;
  window.advanceRound = function () {
    const r = oldAdvance1328.apply(this, arguments);
    try {
      if (state?.weekend) state.weekend.scoreWeightsV1328 = {};
    } catch (_) {}
    return r;
  };
  try {
    advanceRound = window.advanceRound;
  } catch (_) {}
  const oldRestore1328 = window.restoreSnapshot || restoreSnapshot;
  window.restoreSnapshot = function () {
    const r = oldRestore1328.apply(this, arguments);
    if (r && state) {
      rehydrate1328();
      try {
        renderHub();
      } catch (_) {}
    }
    return r;
  };
  try {
    restoreSnapshot = window.restoreSnapshot;
  } catch (_) {}
  const oldSnap1328 = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = oldSnap1328.apply(this, arguments);
    if (s) {
      s.version = 4159;
      s.majorVersion = "beta";
      s.featureSet = "beta-patch13.28.1-offseason-retirement-full-season-fix";
    }
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
  if (selected && state) {
    initPool1328();
    rehydrate1328();
    try {
      renderHub();
    } catch (_) {}
  }
})();

/* beta-patch13282-news-grid-script */

(() => {
  const esc13282 = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[m],
    );
  const y13282 = () =>
    Number(
      typeof seasonYearV11 === "function"
        ? seasonYearV11()
        : state?.seasonYear || 2026,
    );
  const copy13282 = (v) => {
    try {
      return JSON.parse(JSON.stringify(v));
    } catch (_) {
      return v;
    }
  };
  function prepared13282() {
    return state?.offseasonPreparedV1328?.[String(y13282())] || null;
  }
  function profile13282(name) {
    return driverProfiles?.[name] || {};
  }
  function nextNumber13282(preferred) {
    const used = new Set(
      (drivers || [])
        .map((d) => Number(driverProfiles?.[d?.[0]]?.number))
        .filter(Number.isFinite),
    );
    preferred = Number(preferred);
    if (preferred >= 2 && preferred <= 99 && !used.has(preferred))
      return preferred;
    for (let n = 2; n <= 99; n++) if (!used.has(n)) return n;
    return 99;
  }
  function f2Row13282(f, team, y) {
    const num = nextNumber13282(f.number);
    f.status = "F1";
    f.promotedYear = y + 1;
    f.f1Team = team;
    f.number = num;
    driverProfiles[f.name] = {
      number: num,
      nation: f.nation,
      debut: y + 1,
      season2025: `${y} F2 · P${f.rank}`,
      titles: 0,
      wins: 0,
      podiums: 0,
      poles: 0,
      best: `F2晋升 · 潜力 ${f.pot}`,
      f2GraduateV1328: true,
      potentialV1328: f.pot,
    };
    state.driverContracts = state.driverContracts || {};
    state.driverContracts[f.name] = {
      end: y + 2,
      label: `至 ${y + 2} · F2晋升合同`,
      option: false,
      rolling: false,
      note: "13.28.2 F2晋升",
    };
    return [
      f.name,
      team,
      Math.round(Number(f.ovr || 70)),
      Math.round(Number(f.exp || 50)),
      Math.round(Number(f.rac || 70)),
      Math.round(Number(f.awa || 70)),
      Math.round(Number(f.pac || 70)),
    ];
  }

  /* If a retirement happened, at least one genuine F2 rookie must reach the 22-car grid. */
  function guaranteeF2Promotion13282(prep) {
    if (!prep?.done || !prep.result || !Array.isArray(prep.roster)) return;
    const result = prep.result,
      ret = result.retirements || [],
      already = (result.moves || []).some((m) => m.from === "F2");
    if (!ret.length || already) return;
    const pool = (state.f2PoolV1328 || [])
      .filter((f) => f.status === "F2")
      .sort(
        (a, b) =>
          Number(a.rank || 99) - Number(b.rank || 99) ||
          Number(b.ovr || 0) +
            Number(b.pot || 0) * 0.18 -
            (Number(a.ovr || 0) + Number(a.pot || 0) * 0.18),
      );
    if (!pool.length) return;
    const standings = state.teamStandings || {};
    const teamOrder = Object.keys(teams || {}).sort(
      (a, b) => Number(standings[b] || 0) - Number(standings[a] || 0),
    );
    const retirementTeams = [
      ...new Set(ret.map((r) => r.team).filter(Boolean)),
    ].sort((a, b) => teamOrder.indexOf(b) - teamOrder.indexOf(a));
    let victimMove = null,
      targetTeam = null;
    for (const t of retirementTeams) {
      victimMove = (result.moves || []).find(
        (m) =>
          m.team === t &&
          m.from !== "F2" &&
          m.from !== t &&
          m.name !== selected?.[0],
      );
      if (victimMove) {
        targetTeam = t;
        break;
      }
    }
    if (!victimMove) return;
    if (!targetTeam) return;
    const f = pool[0],
      idx = prep.roster.findIndex(
        (r) => r?.[0] === victimMove?.name && r?.[1] === targetTeam,
      );
    if (idx < 0) return;
    const displaced = prep.roster[idx].slice();
    const oldMoveIndex = (result.moves || []).indexOf(victimMove);
    if (oldMoveIndex >= 0) result.moves.splice(oldMoveIndex, 1);
    prep.roster[idx] = f2Row13282(f, targetTeam, y13282());
    result.moves.push({
      name: f.name,
      team: targetTeam,
      from: "F2",
      label: `F2 P${f.rank} 晋升`,
    });
    result.promotions = Number(result.promotions || 0) + 1;
    state.contractHistory = (state.contractHistory || []).filter(
      (line) =>
        !(
          String(line).includes(String(y13282() + 1)) &&
          String(line).includes(String(victimMove?.name || "")) &&
          String(line).includes(String(targetTeam))
        ),
    );
    state.contractHistory.unshift(
      `${y13282() + 1} · ${f.name} 由F2晋升 ${targetTeam}`,
    );
    state.offseasonMovesV1328 = (result.moves || []).map((x) => ({ ...x }));
    state.f1FreeAgentsV1328 = state.f1FreeAgentsV1328 || [];
    if (
      displaced?.[0] &&
      !state.f1FreeAgentsV1328.some((x) => x.name === displaced[0])
    )
      state.f1FreeAgentsV1328.push({
        name: displaced[0],
        row: displaced,
        oldTeam: victimMove?.from || displaced[1],
        profile: copy13282(driverProfiles?.[displaced[0]] || {}),
        birth: null,
      });
    ret.forEach((n) => {
      if (n.team === targetTeam)
        n.replacement = `${f.name}（F2 P${f.rank} 晋升）`;
    });
  }

  function buildNews13282(prep) {
    if (!prep?.result) return [];
    guaranteeF2Promotion13282(prep);
    const y = Number(prep.year || y13282()),
      news = [];
    (prep.result.retirements || []).forEach((r) =>
      news.push({
        type: "retire",
        tag: "退役确认",
        headline: `时代落幕：${r.name} 确认将在 ${y} 赛季后退役`,
        lead: r.reason || `${r.name} 将结束自己的F1生涯。`,
        from: r.team,
        to: r.replacement || "席位待定",
        stats: [
          ["年龄", `${r.age} 岁`],
          ["世界冠军", r.titles || 0],
          ["F1胜利", r.wins || 0],
          ["领奖台", r.podiums || 0],
        ],
      }),
    );
    (prep.result.moves || [])
      .filter((m) => m.from === "F2")
      .forEach((m) => {
        const f = (state.f2PoolV1328 || []).find((x) => x.name === m.name),
          p = profile13282(m.name);
        news.push({
          type: "promotion",
          tag: "新秀晋升",
          headline: `新秀上位：${m.name} 获得F1席位，加盟 ${m.team}`,
          lead: `${m.name} 将在 ${y + 1} 赛季从F2升入F1，正式进入22人围场。`,
          from: `F2 · P${f?.rank ?? "—"}`,
          to: m.team,
          stats: [
            ["F2排名", `P${f?.rank ?? "—"}`],
            ["综合能力", Math.round(Number(f?.ovr || 0))],
            ["潜力", f?.pot ?? "—"],
            ["车号", `#${p.number ?? f?.number ?? "—"}`],
          ],
        });
      });
    (prep.result.moves || [])
      .filter((m) => m.from && m.from !== "F2" && m.from !== m.team)
      .forEach((m) => {
        const row = prep.roster?.find((r) => r?.[0] === m.name),
          rank =
            Object.entries(state.driverStandings || {})
              .sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0))
              .findIndex((x) => x[0] === m.name) + 1;
        news.push({
          type: "transfer",
          tag: "转会官宣",
          headline: `官宣：${m.name} 将在 ${y + 1} 赛季加盟 ${m.team}`,
          lead: `车手市场确认新的席位变动。${m.name} 将结束与 ${m.from} 的合作，并在新赛季代表 ${m.team} 出赛。`,
          from: m.from,
          to: m.team,
          stats: [
            ["本季排名", rank > 0 ? `P${rank}` : "—"],
            ["综合能力", Math.round(Number(row?.[2] || 0))],
            ["原车队", m.from],
            ["新车队", m.team],
          ],
        });
      });
    return news;
  }

  function ensureNews13282() {
    let el = document.getElementById("f1News13282");
    if (el) return el;
    el = document.createElement("div");
    el.id = "f1News13282";
    el.className = "f1News13282";
    el.innerHTML =
      '<div class="f1NewsCard13282"><div class="f1NewsTop13282"><b>F1 大新闻 · 游戏世界</b><span class="f1NewsCount13282" id="f1NewsCount13282"></span></div><div class="f1NewsBody13282" id="f1NewsBody13282"></div></div>';
    document.body.appendChild(el);
    return el;
  }
  let idx13282 = 0;
  function renderNews13282() {
    const q = state?.offseasonNewsV13282 || [],
      el = ensureNews13282();
    if (!q.length || idx13282 >= q.length) {
      el.classList.remove("open");
      state.offseasonNewsShownV13282 = state.offseasonNewsShownV13282 || {};
      state.offseasonNewsShownV13282[String(y13282())] = true;
      idx13282 = 0;
      try {
        autosave?.();
      } catch (_) {}
      return;
    }
    const n = q[idx13282],
      body = document.getElementById("f1NewsBody13282"),
      count = document.getElementById("f1NewsCount13282");
    if (count) count.textContent = `${idx13282 + 1} / ${q.length}`;
    const route =
      n.from || n.to
        ? `<div class="f1NewsRoute13282"><div><span>${n.type === "retire" ? "原效力车队" : "FROM"}</span><b>${esc13282(n.from || "—")}</b></div><div class="f1NewsArrow13282">→</div><div><span>${n.type === "retire" ? "席位去向" : "TO"}</span><b>${esc13282(n.to || "—")}</b></div></div>`
        : "";
    body.innerHTML = `<div class="f1NewsTag13282">${esc13282(n.tag)}</div><h1>${esc13282(n.headline)}</h1><p class="f1NewsLead13282">${esc13282(n.lead)}</p>${route}<div class="f1NewsStats13282">${(n.stats || []).map((x) => `<div><span>${esc13282(x[0])}</span><b>${esc13282(x[1])}</b></div>`).join("")}</div><div class="f1NewsFooter13282"><small>休赛期车手市场模拟 · 阵容变化已同步到“查看全部车队”</small><button class="f1NewsBtn13282" onclick="nextF1News13282()">${idx13282 < q.length - 1 ? "下一条大新闻 →" : "查看赛季总结 →"}</button></div>`;
    el.classList.add("open");
  }
  window.nextF1News13282 = function () {
    idx13282++;
    renderNews13282();
  };
  function queueNews13282(force = false) {
    const prep = prepared13282();
    if (!prep?.done) return;
    guaranteeF2Promotion13282(prep);
    state.retirementQueueV1328 = [];
    const shown = state.offseasonNewsShownV13282?.[String(y13282())];
    if (shown && !force) return;
    state.offseasonNewsV13282 = buildNews13282(prep);
    idx13282 = 0;
    if (state.offseasonNewsV13282.length) setTimeout(renderNews13282, 70);
  }

  /* The season-end all-team directory shows the already-generated next-year roster. */
  const accents13282 = {
    "Red Bull Racing": "#3154a5",
    Ferrari: "#e10600",
    McLaren: "#ff8700",
    Mercedes: "#00a19c",
    "Aston Martin": "#229971",
    Williams: "#2d63d7",
    Alpine: "#e85a9c",
    "Haas F1 Team": "#8e949b",
    "Racing Bulls": "#5a73d9",
    Audi: "#bb0a1e",
    Cadillac: "#c7a76a",
  };
  function initials13282(team) {
    return (
      String(team)
        .split(/\s+/)
        .map((x) => x[0])
        .join("")
        .replace(/[^A-Za-z]/g, "")
        .slice(0, 3)
        .toUpperCase() || "F1"
    );
  }
  function provisional13282() {
    const p = prepared13282();
    return !!(
      p?.done &&
      Array.isArray(p.roster) &&
      typeof seasonCompleteV14 === "function" &&
      seasonCompleteV14()
    );
  }
  function roster13282() {
    return provisional13282() ? prepared13282().roster : drivers;
  }
  function card13282(d) {
    if (!d)
      return '<div class="teamDriverV1311"><div class="teamDriverLineV1311"><strong>TBA</strong><em>—</em></div><small>席位待确认</small></div>';
    const p = profile13282(d[0]),
      f = (state.f2PoolV1328 || []).find((x) => x.name === d[0]),
      rookie = !!(
        f &&
        f.status === "F1" &&
        (Number(f.promotedYear) === y13282() ||
          (provisional13282() && Number(f.promotedYear) === y13282() + 1))
      );
    return `<div class="teamDriverV1311 ${rookie ? "f2Graduate13282" : ""}"><div class="teamDriverLineV1311"><strong>${esc13282(d[0])}</strong><em>#${esc13282(p.number ?? f?.number ?? "—")}</em></div><small>${esc13282(p.nation || f?.nation || "")} · ${provisional13282() ? "下赛季席位" : `${Number(state?.driverStandings?.[d[0]] || 0)} 分`}</small>${rookie ? '<span class="rookieBadge13282">F2 → F1 新秀</span>' : ""}<div class="driverMiniStatV1311"><span>OVR <b>${Number(d[2] || 0)}</b></span><span>${rookie ? "POT" : "胜"} <b>${rookie ? Number(f?.pot || 0) : Number(state?.driverSeasonStats?.[d[0]]?.wins || 0)}</b></span></div></div>`;
  }
  function repaintTeams13282() {
    const grid = document.getElementById("allTeamsGridV1311"),
      sum = document.getElementById("teamsGridSummaryV1311");
    if (!grid) return;
    const r = roster13282(),
      names = Object.keys(teams || {}),
      stand = state.teamStandings || {},
      order = names
        .slice()
        .sort(
          (a, b) =>
            Number(stand[b] || 0) - Number(stand[a] || 0) ||
            Number(teams[b]?.ovr || 0) - Number(teams[a]?.ovr || 0),
        );
    if (sum)
      sum.innerHTML = `<div><span>TEAMS</span><b>${names.length}</b></div><div><span>DRIVERS</span><b>${r.length}</b></div><div><span>${provisional13282() ? "STATUS" : "YOUR TEAM"}</span><b>${provisional13282() ? "NEXT GRID" : esc13282(selected?.[1] || "—")}</b></div>`;
    grid.innerHTML = order
      .map((team, i) => {
        const rr = r.filter((d) => d[1] === team),
          accent = accents13282[team] || "#d1201b";
        return `<div class="teamRosterCardV1311 ${team === selected?.[1] ? "mine" : ""}" style="--teamAccent:${accent}"><div class="teamRosterWaterV1311">${esc13282(initials13282(team))}</div><div class="teamRosterTopV1311"><div><div class="teamRosterRankV1311">${provisional13282() ? `${y13282() + 1} 暂定阵容` : `WCC · P${i + 1}`}</div><h3>${esc13282(team)}</h3></div><div class="teamRosterMetaV1311"><span>CAR INDEX</span><b>${Math.round(Number(teams?.[team]?.ovr || 0))}</b></div></div><div class="teamDriversV1311">${card13282(rr[0])}${card13282(rr[1])}${rr.slice(2).map(card13282).join("")}</div></div>`;
      })
      .join("");
    const section = document.getElementById("teamsgridV1311");
    if (section) {
      const k = section.querySelector(".modulehead .kicker"),
        h = section.querySelector(".teamsGridHeroV1311 h2"),
        p = section.querySelector(".teamsGridHeroV1311 p");
      if (k)
        k.textContent = `F1 GRID · ${provisional13282() ? y13282() + 1 : y13282()}`;
      if (h)
        h.innerHTML = `${provisional13282() ? y13282() + 1 : y13282()} F1 GRID ${provisional13282() ? '<span class="nextGridBadge13282">休赛期暂定</span>' : ""}`;
      if (p)
        p.textContent = provisional13282()
          ? "休赛期席位已经生成。退役、转会与F2晋升会直接显示在这份下一赛季暂定阵容中。"
          : "查看当前存档中的实时车手组合。";
    }
  }
  const oldOpen13282 = window.openAllTeamsV1311;
  if (typeof oldOpen13282 === "function")
    window.openAllTeamsV1311 = function () {
      const r = oldOpen13282.apply(this, arguments);
      try {
        repaintTeams13282();
      } catch (e) {
        console.warn("13.28.2 next grid render", e);
      }
      return r;
    };

  /* Replace the old retirement-only popup with a unified Chinese news stream. */
  const oldFinale13282 = window.showSeasonFinaleV10 || showSeasonFinaleV10;
  window.showSeasonFinaleV10 = function () {
    const r = oldFinale13282.apply(this, arguments);
    try {
      const prep = prepared13282();
      if (prep?.done) {
        guaranteeF2Promotion13282(prep);
        state.retirementQueueV1328 = [];
        queueNews13282(false);
      }
    } catch (e) {
      console.warn("13.28.2 news prepare", e);
    }
    return r;
  };
  try {
    showSeasonFinaleV10 = window.showSeasonFinaleV10;
  } catch (_) {}
  const oldNext13282 = window.startNextSeasonV11 || startNextSeasonV11;
  window.startNextSeasonV11 = function () {
    const oldY = y13282(),
      r = oldNext13282.apply(this, arguments);
    try {
      if (y13282() > oldY) {
        state.retirementQueueV1328 = [];
        document.getElementById("f1News13282")?.classList.remove("open");
      }
    } catch (_) {}
    return r;
  };
  try {
    startNextSeasonV11 = window.startNextSeasonV11;
  } catch (_) {}
  const oldRestore13282 = window.restoreSnapshot || restoreSnapshot;
  window.restoreSnapshot = function () {
    const r = oldRestore13282.apply(this, arguments);
    if (r) {
      try {
        state.retirementQueueV1328 = [];
        if (prepared13282()?.done) guaranteeF2Promotion13282(prepared13282());
      } catch (_) {}
    }
    return r;
  };
  try {
    restoreSnapshot = window.restoreSnapshot;
  } catch (_) {}
  const oldSnap13282 = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = oldSnap13282.apply(this, arguments);
    if (s) {
      s.version = 4160;
      s.majorVersion = "beta";
      s.featureSet =
        "beta-patch13.28.2-transfer-promotion-news-provisional-grid-fix";
    }
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
})();

/* beta-patch13283-f2-sync-script */

(() => {
  const esc13283 = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[m],
    );
  const year13283 = () =>
    Number(
      typeof seasonYearV11 === "function"
        ? seasonYearV11()
        : state?.seasonYear || 2026,
    );
  const clone13283 = (v) => {
    try {
      return JSON.parse(JSON.stringify(v));
    } catch (_) {
      return v;
    }
  };

  function prepFor13283(y) {
    state.offseasonPreparedV1328 = state.offseasonPreparedV1328 || {};
    let prep = state.offseasonPreparedV1328[String(y)];
    if (!prep?.done && typeof window.prepareOffseason1328 === "function") {
      try {
        window.prepareOffseason1328();
      } catch (e) {
        console.warn("13.28.3 prepare offseason", e);
      }
      prep = state.offseasonPreparedV1328[String(y)];
    }
    return prep || null;
  }

  function assignFreshNumber13283(preferred) {
    const used = new Set(
      (drivers || [])
        .map((d) => Number(driverProfiles?.[d?.[0]]?.number))
        .filter(Number.isFinite),
    );
    preferred = Number(preferred);
    if (preferred >= 2 && preferred <= 99 && !used.has(preferred))
      return preferred;
    for (let n = 2; n <= 99; n++) if (!used.has(n)) return n;
    return 99;
  }

  /* Direct-entry safety: even when the player skips the finale and enters next season from standings,
     a retirement year still receives at least one genuine F2 graduate. */
  function ensureF2Graduate13283(prep, y) {
    if (!prep?.done || !Array.isArray(prep.roster) || !prep.result) return prep;
    const result = prep.result,
      ret = result.retirements || [],
      moves = result.moves || (result.moves = []);
    if (!ret.length || moves.some((m) => m.from === "F2")) return prep;
    const pool = (state.f2PoolV1328 || [])
      .filter((f) => f.status === "F2")
      .sort(
        (a, b) =>
          Number(a.rank || 99) - Number(b.rank || 99) ||
          Number(b.ovr || 0) +
            Number(b.pot || 0) * 0.18 -
            (Number(a.ovr || 0) + Number(a.pot || 0) * 0.18),
      );
    if (!pool.length) return prep;
    const player = selected?.[0],
      retTeams = [...new Set(ret.map((r) => r.team).filter(Boolean))];
    let team = null,
      move = null,
      idx = -1;
    for (const t of retTeams) {
      move = moves.find(
        (m) =>
          m.team === t && m.from !== "F2" && m.from !== t && m.name !== player,
      );
      idx = prep.roster.findIndex(
        (r) =>
          r?.[1] === t &&
          r?.[0] !== player &&
          (move ? r?.[0] === move.name : true),
      );
      if (idx >= 0) {
        team = t;
        break;
      }
    }
    if (idx < 0 || !team) return prep;
    const f = pool[0],
      displaced = prep.roster[idx]?.slice(),
      num = assignFreshNumber13283(f.number);
    prep.roster[idx] = [
      f.name,
      team,
      Math.round(Number(f.ovr || 70)),
      Math.round(Number(f.exp || 50)),
      Math.round(Number(f.rac || 70)),
      Math.round(Number(f.awa || 70)),
      Math.round(Number(f.pac || 70)),
    ];
    f.status = "F1";
    f.promotedYear = y + 1;
    f.f1Team = team;
    f.number = num;
    driverProfiles[f.name] = {
      number: num,
      nation: f.nation,
      debut: y + 1,
      season2025: `${y} F2 · P${f.rank}`,
      titles: 0,
      wins: 0,
      podiums: 0,
      poles: 0,
      best: `F2晋升 · 潜力 ${f.pot}`,
      f2GraduateV1328: true,
      potentialV1328: f.pot,
    };
    state.driverContracts = state.driverContracts || {};
    state.driverContracts[f.name] = {
      end: y + 2,
      label: `至 ${y + 2} · F2晋升合同`,
      option: false,
      rolling: false,
      note: "13.28.3 F2晋升",
    };
    if (move) {
      const mi = moves.indexOf(move);
      if (mi >= 0) moves.splice(mi, 1);
    }
    moves.push({ name: f.name, team, from: "F2", label: `F2 P${f.rank} 晋升` });
    result.promotions = Number(result.promotions || 0) + 1;
    state.offseasonMovesV1328 = moves.map((x) => ({ ...x }));
    if (displaced?.[0]) {
      state.f1FreeAgentsV1328 = state.f1FreeAgentsV1328 || [];
      if (!state.f1FreeAgentsV1328.some((x) => x.name === displaced[0]))
        state.f1FreeAgentsV1328.push({
          name: displaced[0],
          row: displaced,
          oldTeam: move?.from || displaced[1],
          profile: clone13283(driverProfiles?.[displaced[0]] || {}),
          birth: null,
        });
    }
    ret
      .filter((r) => r.team === team)
      .forEach((r) => (r.replacement = `${f.name}（F2 P${f.rank} 晋升）`));
    return prep;
  }

  function rebuildLiveSeason13283(roster, playerName) {
    if (!Array.isArray(roster) || !roster.length) return false;
    const expected = Object.keys(teams || {}).length * 2;
    const clean = roster.slice(0, expected).map((r) => r.slice());
    drivers.splice(0, drivers.length, ...clean);
    const me = drivers.find((d) => d?.[0] === playerName);
    if (me) selected = me;

    /* This is the missing link in 13.28.2: standings and race simulation must be rebuilt from the live roster. */
    state.driverStandings = {};
    state.driverSeasonStats = {};
    drivers.forEach((d) => {
      state.driverStandings[d[0]] = 0;
      state.driverSeasonStats[d[0]] = {
        wins: 0,
        podiums: 0,
        poles: 0,
        dnfs: 0,
        fastestLaps: 0,
      };
    });
    state.driverPoints = 0;
    state.teamPoints = Number(state.teamStandings?.[selected?.[1]] || 0);
    state.standingsTimelineV40 = state.standingsTimelineV40 || {};
    state.standingsTimelineV40[String(year13283())] = {};
    /* Do not clear previous-season archive data here. 13.28.3 wiped the whole object, which made CAREER HISTORY disappear after rollover. */

    /* Keep relationships for surviving drivers, initialise newcomers, and drop retired names from the active relation rail. */
    const oldRel = state.driverRelations || {},
      nextRel = {};
    drivers.forEach((d) => {
      if (d[0] !== selected?.[0])
        nextRel[d[0]] =
          oldRel[d[0]] ??
          (typeof relationshipBase === "function"
            ? relationshipBase(selected[0], d[0])
            : 50);
    });
    state.driverRelations = nextRel;

    /* Old rollover code prepared AI weekend state before the new roster was committed; rebuild it now. */
    state.aiPrep = {};
    try {
      resetWeekend?.();
    } catch (_) {}
    try {
      ensureAITrainingV10?.(true);
    } catch (_) {}
    try {
      ensureAIWeekendSetupV36?.(true);
    } catch (_) {}
    try {
      ensureStats1311?.();
    } catch (_) {}
    try {
      ensureDriverTeamsLink1311?.();
    } catch (_) {}
    try {
      refreshContractMarketV10?.(true);
    } catch (_) {}
    return true;
  }

  const prevNext13283 = window.startNextSeasonV11 || startNextSeasonV11;
  window.startNextSeasonV11 = function () {
    const oldY = year13283(),
      playerName = selected?.[0];
    let prep = prepFor13283(oldY);
    prep = ensureF2Graduate13283(prep, oldY);
    const committed =
      prep?.done && Array.isArray(prep.roster)
        ? prep.roster.map((r) => r.slice())
        : null;
    const out = prevNext13283.apply(this, arguments);
    if (selected && year13283() > oldY && committed) {
      try {
        rebuildLiveSeason13283(committed, playerName);
        state.liveGridAppliedV13283 = {
          fromYear: oldY,
          toYear: year13283(),
          drivers: drivers.map((d) => d[0]),
          appliedAt: new Date().toISOString(),
        };
        try {
          renderProfile?.();
        } catch (_) {}
        try {
          renderHub?.();
        } catch (_) {}
        try {
          autosave?.();
        } catch (_) {}
      } catch (e) {
        console.error("13.28.3 live F2 grid sync", e);
      }
    }
    return out;
  };
  try {
    startNextSeasonV11 = window.startNextSeasonV11;
  } catch (_) {}

  /* Full F2 database in Driver Market. The simulation has always had the pool; now the UI exposes the whole library. */
  function renderF2Library13283() {
    const host = document.getElementById("contractContent");
    if (!host || !state) return;
    document.getElementById("f2Library13283")?.remove();
    const pool = (state.f2PoolV1328 || []).slice().sort((a, b) => {
      if (a.status !== b.status) return a.status === "F2" ? -1 : 1;
      return Number(a.rank || 99) - Number(b.rank || 99);
    });
    if (!pool.length) return;
    const active = pool.filter((f) => f.status === "F2").length,
      promoted = pool.length - active;
    const html = `<div class="card f2Library13283" id="f2Library13283"><div class="f2LibraryHead13283"><div><div class="kicker">FORMULA 2 · DRIVER DATABASE</div><h2>F2 车手库</h2><small>完整候选库会参与休赛期选人；晋升后会正式进入下一赛季22人阵容、积分榜与比赛模拟。</small></div><small>${active} ACTIVE · ${promoted} PROMOTED</small></div><div class="f2LibraryGrid13283">${pool.map((f) => `<div class="f2LibraryRow13283 ${f.status === "F1" ? "promoted" : ""}"><div class="f2LibraryRank13283">${f.status === "F2" ? `P${Number(f.rank || 0)}` : "F1"}</div><div class="f2LibraryName13283"><b>${esc13283(f.name)}</b><small>${esc13283(f.team)} · ${esc13283(f.nation)}</small></div><div class="f2LibraryNums13283"><b>${Math.round(Number(f.ovr || 0))}</b><small>OVR · POT ${Math.round(Number(f.pot || 0))}</small></div><div class="f2LibraryStatus13283"><span>${f.status === "F1" ? `${f.promotedYear || ""} 晋升` : "F2候选"}</span></div></div>`).join("")}</div></div>`;
    host.insertAdjacentHTML("beforeend", html);
  }
  const prevContracts13283 = window.renderContractsV10 || renderContractsV10;
  window.renderContractsV10 = function () {
    const out = prevContracts13283.apply(this, arguments);
    try {
      renderF2Library13283();
    } catch (e) {
      console.warn("13.28.3 F2 library render", e);
    }
    return out;
  };
  try {
    renderContractsV10 = window.renderContractsV10;
  } catch (_) {}

  /* Load-time safety for saves already advanced with 13.28.2: if the saved live grid and prepared previous-year grid disagree,
     use the persisted current roster when available; otherwise do not rewrite an in-progress season automatically. */
  const prevRestore13283 = window.restoreSnapshot || restoreSnapshot;
  window.restoreSnapshot = function (data) {
    const ok = prevRestore13283.apply(this, arguments);
    if (!ok) return ok;
    try {
      if (
        state?.liveGridAppliedV13283 &&
        Array.isArray(data?.rosterCurrentV41321)
      ) {
        rebuildLiveSeason13283(data.rosterCurrentV41321, data.selected);
      }
    } catch (e) {
      console.warn("13.28.3 roster restore", e);
    }
    return ok;
  };
  try {
    restoreSnapshot = window.restoreSnapshot;
  } catch (_) {}

  const prevSnap13283 = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = prevSnap13283.apply(this, arguments);
    if (s) {
      s.version = 4161;
      s.majorVersion = "beta";
      s.featureSet = "beta-patch13.28.3-f2-live-grid-standings-sync";
    }
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
})();

/* beta-patch13284-history-retirement-fix */

(() => {
  const clone13284 = (v) => {
    try {
      return JSON.parse(JSON.stringify(v));
    } catch (_) {
      return v;
    }
  };
  const year13284 = () =>
    Number(
      typeof seasonYearV11 === "function"
        ? seasonYearV11()
        : state?.seasonYear || 2026,
    );

  /* Freeze a final standings snapshot before rollover, and keep it outside the live-season reset path. */
  function archiveSeason13284(y) {
    if (!state || !selected) return;
    y = Number(y || year13284());
    state.seasonArchiveV13284 = state.seasonArchiveV13284 || {};
    if (state.seasonArchiveV13284[String(y)]) return;
    const bucket = state.standingsTimelineV40?.[String(y)] || {};
    const rounds = Object.keys(bucket)
      .map(Number)
      .sort((a, b) => a - b);
    let finalSnap = rounds.length
      ? clone13284(bucket[rounds[rounds.length - 1]])
      : null;
    if (!finalSnap) {
      const field = clone13284(
        state.weekend?.raceResult?.field ||
          state.seasonResults?.[state.seasonResults.length - 1]?.field ||
          [],
      );
      const wdc = Object.entries(state.driverStandings || {})
        .sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0))
        .map(([name, points], i) => ({
          rank: i + 1,
          name,
          team:
            field.find((x) => x.name === name)?.team ||
            drivers.find((d) => d[0] === name)?.[1] ||
            "",
          points: Number(points || 0),
        }));
      const wcc = Object.entries(state.teamStandings || {})
        .sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0))
        .map(([team, points], i) => ({
          rank: i + 1,
          team,
          points: Number(points || 0),
        }));
      finalSnap = {
        year: y,
        round: Number(state.round || 0),
        race: state.seasonResults?.[state.seasonResults.length - 1]?.race || "",
        wdc,
        wcc,
        result: field,
      };
    }
    state.seasonArchiveV13284[String(y)] = {
      timeline: clone13284(bucket),
      final: clone13284(finalSnap),
      seasonResults: clone13284(state.seasonResults || []),
    };
  }

  function restoreHistory13284() {
    if (!state?.seasonArchiveV13284) return;
    state.standingsTimelineV40 = state.standingsTimelineV40 || {};
    Object.entries(state.seasonArchiveV13284).forEach(([y, a]) => {
      if (
        state.standingsTimelineV40[y] &&
        Object.keys(state.standingsTimelineV40[y]).length
      )
        return;
      if (a?.timeline && Object.keys(a.timeline).length)
        state.standingsTimelineV40[y] = clone13284(a.timeline);
      else if (a?.final) {
        const r = Number(a.final.round || 1);
        state.standingsTimelineV40[y] = { [r]: clone13284(a.final) };
      }
    });
  }

  /* A renewal by the surviving team-mate is not a replacement for the retired driver's seat.
     Replacement text is derived only from a genuinely incoming driver (external F1 transfer or F2 graduate). */
  function normalizeRetirementSeats13284(y, sourceRoster) {
    const prep = state?.offseasonPreparedV1328?.[String(y)];
    if (!prep?.done || !prep.result || !Array.isArray(prep.roster)) return;
    const old =
      Array.isArray(sourceRoster) && sourceRoster.length
        ? sourceRoster
        : state.offseasonSourceRosterV13284?.[String(y)] || [];
    const moves = prep.result.moves || [];
    (prep.result.retirements || []).forEach((ret) => {
      const oldNames = new Set(
        old.filter((d) => d?.[1] === ret.team).map((d) => d[0]),
      );
      const newcomers = prep.roster.filter(
        (d) => d?.[1] === ret.team && !oldNames.has(d[0]),
      );
      let newcomer = null;
      for (const d of newcomers) {
        const m = moves.find(
          (x) => x.name === d[0] && x.team === ret.team && x.from !== ret.team,
        );
        if (m) {
          newcomer = { row: d, move: m };
          if (m.from === "F2") break;
        }
      }
      if (newcomer) {
        ret.replacement = `${newcomer.row[0]}（${newcomer.move.label || (newcomer.move.from === "F2" ? "F2晋升" : "转会")}）`;
      } else ret.replacement = null;
    });
    state.retirementQueueV1328 = [];
    if (Array.isArray(state.offseasonNewsV13282)) {
      state.offseasonNewsV13282.forEach((n) => {
        if (n?.type === "retire") {
          const r = (prep.result.retirements || []).find(
            (x) => x.name && String(n.headline || "").includes(x.name),
          );
          if (r) n.to = r.replacement || "席位待定";
        }
      });
    }
  }

  const prevPrepare13284 = window.prepareOffseason1328;
  if (typeof prevPrepare13284 === "function") {
    window.prepareOffseason1328 = function () {
      const y = year13284();
      state.offseasonSourceRosterV13284 =
        state.offseasonSourceRosterV13284 || {};
      if (!state.offseasonSourceRosterV13284[String(y)])
        state.offseasonSourceRosterV13284[String(y)] = clone13284(
          drivers || [],
        );
      const out = prevPrepare13284.apply(this, arguments);
      normalizeRetirementSeats13284(
        y,
        state.offseasonSourceRosterV13284[String(y)],
      );
      return out;
    };
    try {
      prepareOffseason1328 = window.prepareOffseason1328;
    } catch (_) {}
  }

  const prevFinale13284 = window.showSeasonFinaleV10 || showSeasonFinaleV10;
  window.showSeasonFinaleV10 = function () {
    const y = year13284(),
      source = clone13284(drivers || []);
    archiveSeason13284(y);
    state.offseasonSourceRosterV13284 = state.offseasonSourceRosterV13284 || {};
    if (!state.offseasonSourceRosterV13284[String(y)])
      state.offseasonSourceRosterV13284[String(y)] = source;
    const out = prevFinale13284.apply(this, arguments);
    normalizeRetirementSeats13284(y, source);
    try {
      autosave?.();
    } catch (_) {}
    return out;
  };
  try {
    showSeasonFinaleV10 = window.showSeasonFinaleV10;
  } catch (_) {}

  const prevNext13284 = window.startNextSeasonV11 || startNextSeasonV11;
  window.startNextSeasonV11 = function () {
    const oldY = year13284(),
      source = clone13284(drivers || []);
    archiveSeason13284(oldY);
    state.offseasonSourceRosterV13284 = state.offseasonSourceRosterV13284 || {};
    if (!state.offseasonSourceRosterV13284[String(oldY)])
      state.offseasonSourceRosterV13284[String(oldY)] = source;
    normalizeRetirementSeats13284(oldY, source);
    const keep = clone13284(state.standingsTimelineV40 || {}),
      out = prevNext13284.apply(this, arguments);
    if (state && year13284() > oldY) {
      state.standingsTimelineV40 = state.standingsTimelineV40 || {};
      Object.entries(keep).forEach(([y, b]) => {
        if (
          Number(y) < year13284() &&
          (!state.standingsTimelineV40[y] ||
            !Object.keys(state.standingsTimelineV40[y]).length)
        )
          state.standingsTimelineV40[y] = clone13284(b);
      });
      restoreHistory13284();
      state.standingsTimelineV40[String(year13284())] =
        state.standingsTimelineV40[String(year13284())] || {};
      try {
        autosave?.();
      } catch (_) {}
    }
    return out;
  };
  try {
    startNextSeasonV11 = window.startNextSeasonV11;
  } catch (_) {}

  const prevSeasonRender13284 = window.renderSeasonV40;
  if (typeof prevSeasonRender13284 === "function")
    window.renderSeasonV40 = function () {
      restoreHistory13284();
      const out = prevSeasonRender13284.apply(this, arguments);
      try {
        window.injectSeasonHistoryV1312?.();
      } catch (_) {}
      return out;
    };

  const prevRestore13284 = window.restoreSnapshot || restoreSnapshot;
  window.restoreSnapshot = function () {
    const ok = prevRestore13284.apply(this, arguments);
    if (ok) {
      try {
        restoreHistory13284();
      } catch (_) {}
    }
    return ok;
  };
  try {
    restoreSnapshot = window.restoreSnapshot;
  } catch (_) {}

  const prevSnap13284 = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = prevSnap13284.apply(this, arguments);
    if (s) {
      s.version = 4162;
      s.majorVersion = "beta";
      s.featureSet = "beta-patch13.28.4-history-retirement-seat-fix";
    }
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
})();

/* beta-patch13285-news-clean-name-lang */

(() => {
  const NAME_LANG_KEY = "f126_driver_name_language_v13285";
  const NAME_ZH_13285 = {
    "Max Verstappen": "马克斯·维斯塔潘",
    "Isack Hadjar": "伊萨克·哈贾尔",
    "Lewis Hamilton": "刘易斯·汉密尔顿",
    "Charles Leclerc": "夏尔·勒克莱尔",
    "Lando Norris": "兰多·诺里斯",
    "Oscar Piastri": "奥斯卡·皮亚斯特里",
    "George Russell": "乔治·拉塞尔",
    "Kimi Antonelli": "基米·安东内利",
    "Fernando Alonso": "费尔南多·阿隆索",
    "Lance Stroll": "兰斯·斯托尔",
    "Carlos Sainz": "卡洛斯·塞恩斯",
    "Alexander Albon": "亚历山大·阿尔本",
    "Pierre Gasly": "皮埃尔·加斯利",
    "Franco Colapinto": "弗兰科·科拉平托",
    "Esteban Ocon": "埃斯特班·奥康",
    "Oliver Bearman": "奥利弗·贝尔曼",
    "Liam Lawson": "利亚姆·劳森",
    "Arvid Lindblad": "阿维德·林德布拉德",
    "Nico Hulkenberg": "尼科·霍肯伯格",
    "Gabriel Bortoleto": "加布里埃尔·博托莱托",
    "Sergio Perez": "塞尔吉奥·佩雷兹",
    "Valtteri Bottas": "瓦尔特里·博塔斯",
    "Nikola Tsolov": "尼古拉·措洛夫",
    "Gabriele Minì": "加布里埃莱·米尼",
    "Rafael Câmara": "拉斐尔·卡马拉",
    "Alexander Dunne": "亚历山大·邓恩",
    "Noel León": "诺埃尔·莱昂",
    "Kush Maini": "库什·迈尼",
    "Dino Beganovic": "迪诺·贝加诺维奇",
    "Colton Herta": "科尔顿·赫塔",
    "Martinius Stenshorne": "马蒂尼乌斯·斯滕斯霍恩",
    "Joshua Dürksen": "约书亚·迪尔克森",
    "Ritomo Miyata": "宫田莉朋",
    "Laurens van Hoepen": "劳伦斯·范霍彭",
    "Nico Varrone": "尼科·瓦罗内",
    "Oliver Goethe": "奥利弗·歌德",
    "Tasanapol Inthraphuvasak": "塔萨纳波尔·因特拉普瓦萨克",
    "Sebastián Montoya": "塞巴斯蒂安·蒙托亚",
    "Roman Bilinski": "罗曼·比林斯基",
    "Rafael Villagomez": "拉斐尔·比利亚戈麦斯",
    "Mari Boya": "马里·博亚",
    "John Bennett": "约翰·贝内特",
    "Emerson Fittipaldi": "埃默森·菲蒂帕尔迪",
    "Cian Shields": "基安·希尔兹",
  };
  const NAME_EN_13285 = Object.fromEntries(
    Object.entries(NAME_ZH_13285).map(([en, zh]) => [zh, en]),
  );
  const sorted13285 = (o) =>
    Object.entries(o).sort((a, b) => b[0].length - a[0].length);
  const EN_PAIRS_13285 = sorted13285(NAME_ZH_13285),
    ZH_PAIRS_13285 = sorted13285(NAME_EN_13285);
  let nameLang13285 = localStorage.getItem(NAME_LANG_KEY) || "zh";
  if (nameLang13285 !== "zh" && nameLang13285 !== "en") nameLang13285 = "zh";

  function replaceNames13285(text, lang = nameLang13285) {
    if (typeof text !== "string" || !text) return text;
    let out = text,
      pairs = lang === "zh" ? EN_PAIRS_13285 : ZH_PAIRS_13285;
    for (const [from, to] of pairs)
      if (out.includes(from)) out = out.split(from).join(to);
    return out;
  }
  function translateTree13285(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      const v = replaceNames13285(root.nodeValue);
      if (v !== root.nodeValue) root.nodeValue = v;
      return;
    }
    if (
      root.nodeType !== Node.ELEMENT_NODE &&
      root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE
    )
      return;
    if (
      root.nodeType === Node.ELEMENT_NODE &&
      /^(SCRIPT|STYLE|TEXTAREA|NOSCRIPT)$/.test(root.tagName)
    )
      return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const p = n.parentElement;
        if (!p || /^(SCRIPT|STYLE|TEXTAREA|NOSCRIPT)$/.test(p.tagName))
          return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    let n;
    while ((n = walker.nextNode())) {
      const v = replaceNames13285(n.nodeValue);
      if (v !== n.nodeValue) n.nodeValue = v;
    }
  }
  function syncButtons13285() {
    document
      .getElementById("nameLangZh13285")
      ?.classList.toggle("active", nameLang13285 === "zh");
    document
      .getElementById("nameLangEn13285")
      ?.classList.toggle("active", nameLang13285 === "en");
  }
  window.driverDisplayNameV13285 = function (name) {
    return replaceNames13285(String(name ?? ""));
  };
  window.setDriverNameLanguageV13285 = function (lang) {
    if (lang !== "zh" && lang !== "en") return;
    nameLang13285 = lang;
    localStorage.setItem(NAME_LANG_KEY, lang);
    try {
      if (state) state.uiNameLanguageV13285 = lang;
    } catch (_) {}
    syncButtons13285();
    translateTree13285(document.body);
    try {
      autosave?.();
    } catch (_) {}
  };
  window.getDriverNameLanguageV13285 = () => nameLang13285;

  /* The old English retirement popup is retired completely. It must never reappear from old-save queues. */
  function killLegacyBreaking13285() {
    document.getElementById("breakingNews1328")?.remove();
    try {
      if (state) state.retirementQueueV1328 = [];
    } catch (_) {}
  }
  const observer13285 = new MutationObserver((ms) => {
    for (const m of ms) {
      if (m.type === "characterData") translateTree13285(m.target);
      else
        for (const n of m.addedNodes) {
          if (n.nodeType === Node.ELEMENT_NODE && n.id === "breakingNews1328") {
            n.remove();
            continue;
          }
          translateTree13285(n);
        }
    }
  });

  function boot13285() {
    killLegacyBreaking13285();
    syncButtons13285();
    translateTree13285(document.body);
    observer13285.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
    });
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot13285, { once: true });
  else boot13285();

  const oldFinale13285 = window.showSeasonFinaleV10;
  if (typeof oldFinale13285 === "function")
    window.showSeasonFinaleV10 = function () {
      const r = oldFinale13285.apply(this, arguments);
      killLegacyBreaking13285();
      setTimeout(killLegacyBreaking13285, 260);
      return r;
    };
  try {
    showSeasonFinaleV10 = window.showSeasonFinaleV10;
  } catch (_) {}
  const oldNext13285 = window.startNextSeasonV11;
  if (typeof oldNext13285 === "function")
    window.startNextSeasonV11 = function () {
      const r = oldNext13285.apply(this, arguments);
      killLegacyBreaking13285();
      return r;
    };
  try {
    startNextSeasonV11 = window.startNextSeasonV11;
  } catch (_) {}
  const oldRestore13285 = window.restoreSnapshot;
  if (typeof oldRestore13285 === "function")
    window.restoreSnapshot = function () {
      const r = oldRestore13285.apply(this, arguments);
      killLegacyBreaking13285();
      setTimeout(() => {
        translateTree13285(document.body);
        syncButtons13285();
      }, 0);
      return r;
    };
  try {
    restoreSnapshot = window.restoreSnapshot;
  } catch (_) {}

  const oldSnap13285 = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = oldSnap13285.apply(this, arguments);
    if (s) {
      s.version = 4163;
      s.majorVersion = "beta";
      s.featureSet =
        "beta-patch13.28.5-legacy-breaking-removed-driver-name-language";
    }
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
})();

/* beta-patch13286-settings-contract-retirement */

(() => {
  const REAL_CONTRACT_FLOOR_13286 = {
    "Max Verstappen": {
      end: 2028,
      label: "至 2028",
      note: "现实基线：Red Bull 合同至 2028；游戏不再随机提前流动",
    },
    "Isack Hadjar": { end: 2026, label: "2026", note: "现实基线：2026 席位" },
    "Charles Leclerc": {
      end: 2030,
      label: "长期 · 2030+",
      note: "现实基线：2026 续签后的长期合同，公开报道指向 2030 之后",
    },
    "Lewis Hamilton": {
      end: 2027,
      label: "至少至 2027",
      note: "现实基线：多年度合同，至少覆盖 2027",
    },
    "Lando Norris": {
      end: 2027,
      label: "至少至 2027",
      note: "现实基线：长期合同；模拟器按至少 2027 硬锁",
    },
    "Oscar Piastri": {
      end: 2028,
      label: "至少至 2028",
      note: "现实基线：长期合同，模拟器按至少 2028 硬锁",
    },
    "George Russell": {
      end: 2027,
      label: "至少至 2027",
      note: "现实基线：多年度结构，模拟器按至少 2027 硬锁",
    },
    "Kimi Antonelli": {
      end: 2026,
      label: "2026",
      note: "现实基线：已确认 2026",
    },
    "Fernando Alonso": {
      end: 2026,
      label: "2026",
      note: "现实基线：至少覆盖 2026",
    },
    "Lance Stroll": {
      end: 2026,
      label: "2026 / 长期倾向",
      note: "现实基线：2026 已确认，席位稳定性额外提高",
    },
    "Carlos Sainz": {
      end: 2026,
      label: "至少至 2026",
      note: "现实基线：Williams 合同至少覆盖 2026",
    },
    "Alexander Albon": {
      end: 2026,
      label: "至少至 2026",
      note: "现实基线：至少覆盖 2026；更长期期限取决于条款",
    },
    "Pierre Gasly": {
      end: 2028,
      label: "至 2028",
      note: "现实基线：Alpine 合同至 2028",
    },
    "Franco Colapinto": {
      end: 2026,
      label: "2026",
      note: "现实基线：2026 席位",
    },
    "Esteban Ocon": {
      end: 2026,
      label: "至 2026",
      note: "现实基线：当前确认期限至 2026 赛季末",
    },
    "Oliver Bearman": {
      end: 2026,
      label: "至 2026",
      note: "现实基线：当前确认期限至 2026 赛季末",
    },
    "Liam Lawson": { end: 2026, label: "2026", note: "现实基线：2026 席位" },
    "Arvid Lindblad": { end: 2026, label: "2026", note: "现实基线：2026 席位" },
    "Nico Hulkenberg": {
      end: 2026,
      label: "2026+ · 多年度",
      note: "现实基线：2026 已确认，2027 存在继续合作可能",
    },
    "Gabriel Bortoleto": {
      end: 2026,
      label: "2026+ · 多年度",
      note: "现实基线：至少覆盖 2026，后续年份未完全公开",
    },
    "Sergio Perez": {
      end: 2027,
      label: "至少至 2027",
      note: "现实基线：Cadillac 合同至少覆盖 2027",
    },
    "Valtteri Bottas": {
      end: 2027,
      label: "至少至 2027",
      note: "现实基线：Cadillac 合同至少覆盖 2027",
    },
  };
  window.openSettingsV13286 = function () {
    showView("settings");
    try {
      document.getElementById("settings")?.scrollTo?.(0, 0);
    } catch (_) {}
  };
  document.getElementById("homeLogo13286")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      showView("home");
    }
  });

  function applyRealityBaseline13286() {
    try {
      for (const [name, base] of Object.entries(REAL_CONTRACT_FLOOR_13286)) {
        if (
          typeof DRIVER_CONTRACTS_V11 !== "undefined" &&
          DRIVER_CONTRACTS_V11[name]
        )
          Object.assign(DRIVER_CONTRACTS_V11[name], base, {
            option: false,
            clause: false,
          });
        if (state?.driverContracts?.[name]) {
          const c = state.driverContracts[name];
          const sy = Number(state.seasonYear || 2026);
          if (sy === 2026) {
            c.end = base.end;
            c.label = base.label;
            c.note = base.note;
          } else if (Number(c.end || 0) < base.end) {
            c.end = base.end;
            c.label = base.label;
            c.note = base.note;
          }
          if (sy <= base.end) {
            c.option = false;
            c.clause = false;
          }
        }
      }
    } catch (e) {
      console.warn("13.28.6 contract baseline", e);
    }
  }
  window.applyRealityBaseline13286 = applyRealityBaseline13286;

  function contract13286(name) {
    try {
      return (
        state?.driverContracts?.[name] || DRIVER_CONTRACTS_V11?.[name] || null
      );
    } catch (_) {
      return null;
    }
  }
  function contractEnd13286(name) {
    const y = Number(
        typeof seasonYearV11 === "function"
          ? seasonYearV11()
          : state?.seasonYear || 2026,
      ),
      c = contract13286(name);
    return Number(c?.end ?? y);
  }
  function playerFree13286() {
    const y = Number(
      typeof seasonYearV11 === "function"
        ? seasonYearV11()
        : state?.seasonYear || 2026,
    );
    return !!selected && contractEnd13286(selected[0]) <= y;
  }
  function openSeat13286(team) {
    const y = Number(
      typeof seasonYearV11 === "function"
        ? seasonYearV11()
        : state?.seasonYear || 2026,
    );
    return (drivers || [])
      .filter((d) => d[1] === team && d[0] !== selected?.[0])
      .some((d) => contractEnd13286(d[0]) <= y);
  }
  window.realContractOpenSeatV13286 = openSeat13286;
  window.seatAvailabilityV11 = function (team) {
    const y = seasonYearV11(),
      roster = drivers.filter((d) => d[1] === team),
      flexible = roster.filter((d) => contractEnd13286(d[0]) <= y);
    return { roster, flexible, count: flexible.length };
  };
  try {
    seatAvailabilityV11 = window.seatAvailabilityV11;
  } catch (_) {}

  window.marketOpenV23 = function () {
    return (
      !!selected &&
      playerFree13286() &&
      state.round >= 14 &&
      state.round <= calendar.length &&
      !seasonCompleteV14()
    );
  };
  try {
    marketOpenV23 = window.marketOpenV23;
  } catch (_) {}

  window.generateOffersV23 = function () {
    if (!marketOpenV23()) {
      state.marketOffersV17 = [];
      return [];
    }
    if (
      state.marketOffersV17?.length &&
      state.marketOfferRoundV17 === state.round
    )
      return state.marketOffersV17;
    const order = teamOrderV23(),
      current = selected[1],
      ci = Math.max(0, order.indexOf(current)),
      rank = driverRankV10();
    let eligible = order.filter((t) => t !== current && openSeat13286(t));
    let ambitious = eligible.filter((t) => order.indexOf(t) < ci);
    if (!ambitious.length)
      ambitious = eligible.slice(0, Math.min(5, eligible.length));
    if (rank > 10) ambitious = ambitious.slice(-Math.min(3, ambitious.length));
    const best =
      ambitious[Math.floor(Math.random() * Math.max(1, ambitious.length))] ||
      eligible[0];
    const safePool = eligible.filter(
      (t) =>
        t !== best &&
        (order.indexOf(t) >= Math.max(0, ci - 1) || order.indexOf(t) >= 6),
    );
    const safe =
      safePool[Math.floor(Math.random() * Math.max(1, safePool.length))] ||
      eligible.find((t) => t !== best);
    const rows = [];
    if (best)
      rows.push({ team: best, kind: "team", type: "best", title: "向上挑战" });
    if (safe)
      rows.push({ team: safe, kind: "team", type: "safe", title: "可用席位" });
    rows.push({
      team: current,
      kind: "renew",
      type: "renew",
      title: "当前车队续约",
    });
    state.marketOffersV17 = rows.map((o) => ({
      ...o,
      chance: contractChanceV23(o.team, o.kind),
      term: "1+1",
    }));
    state.marketOfferRoundV17 = state.round;
    return state.marketOffersV17;
  };
  try {
    generateOffersV23 = window.generateOffersV23;
  } catch (_) {}

  const prevOpenConfirm13286 = window.openContractConfirmV23;
  window.openContractConfirmV23 = function (team, kind) {
    const y = seasonYearV11();
    if (!playerFree13286()) {
      showToastV14?.(
        `现实合同锁定至 ${contractEnd13286(selected[0])} · 到期赛季才能进入转会市场`,
      );
      return;
    }
    if (kind !== "renew" && !openSeat13286(team)) {
      showToastV14?.(`${team} 的两个席位仍在有效合同内`);
      return;
    }
    return prevOpenConfirm13286.apply(this, arguments);
  };
  window.openContractConfirmV17 = window.openContractConfirmV23;
  try {
    openContractConfirmV23 = window.openContractConfirmV23;
    openContractConfirmV17 = window.openContractConfirmV23;
  } catch (_) {}

  const prevConfirm13286 = window.confirmContractAttemptV23;
  window.confirmContractAttemptV23 = function (team, kind) {
    if (!playerFree13286() || (kind !== "renew" && !openSeat13286(team))) {
      closeOverlay?.();
      showToastV14?.("席位仍受现实合同保护，本次谈判取消");
      return;
    }
    return prevConfirm13286.apply(this, arguments);
  };
  window.confirmContractAttemptV17 = window.confirmContractAttemptV23;
  try {
    confirmContractAttemptV23 = window.confirmContractAttemptV23;
    confirmContractAttemptV17 = window.confirmContractAttemptV23;
  } catch (_) {}

  function clearIllegalPending13286() {
    try {
      const target = state?.contract?.nextTeam;
      if (target && target !== selected?.[1] && !openSeat13286(target)) {
        state.contract.nextTeam = null;
        state.contract.signedRound = null;
        state.contract.nextEnd = null;
        state.pendingPlayerDealV23 = null;
        state.contractHistory = state.contractHistory || [];
        state.contractHistory.unshift(
          `合同校正 · ${target} 两个席位仍在有效合同期内，提前转会已取消。`,
        );
      }
    } catch (_) {}
  }

  const prevRenderContracts13286 = window.renderContractsV10;
  window.renderContractsV10 = function () {
    applyRealityBaseline13286();
    clearIllegalPending13286();
    const r = prevRenderContracts13286.apply(this, arguments);
    try {
      const y = seasonYearV11(),
        end = contractEnd13286(selected[0]),
        host = document.getElementById("contractContent");
      if (host && end > y) {
        const closed = host.querySelector(".contractClosedBox");
        if (closed)
          closed.innerHTML = `现实合同保护中：<b>${selected[0]}</b> 当前合同至少持续至 <b>${end}</b> 赛季结束。合同未到期前不会随机跳队；到期赛季 R14 后才开放正式谈判。`;
        const head = host.querySelector(".contractV17Head p");
        if (head)
          head.textContent =
            "车手市场现在以现实合同期限作为硬约束。合同仍有效时，AI 与玩家都不会被随机安排提前转会。";
        if (!host.querySelector(".contractRealityLock13286"))
          host
            .querySelector(".contractV17Head")
            ?.insertAdjacentHTML(
              "afterend",
              `<div class="contractRealityLock13286">现实合同锁定 · ${end} 赛季结束前保持当前席位。选项 / 传闻不会自动等于提前解约。</div>`,
            );
      }
    } catch (_) {}
    return r;
  };
  try {
    renderContractsV10 = window.renderContractsV10;
  } catch (_) {}

  const prevRenderHub13286 = window.renderHub;
  window.renderHub = function () {
    applyRealityBaseline13286();
    clearIllegalPending13286();
    const r = prevRenderHub13286.apply(this, arguments);
    try {
      const st = document.getElementById("contractStatus"),
        y = seasonYearV11(),
        end = contractEnd13286(selected[0]);
      if (st && end > y) st.textContent = `合同锁定至 ${end}`;
    } catch (_) {}
    return r;
  };
  try {
    renderHub = window.renderHub;
  } catch (_) {}

  const prevStart13286 = window.startCareer;
  window.startCareer = function () {
    const r = prevStart13286.apply(this, arguments);
    applyRealityBaseline13286();
    try {
      renderHub();
      autosave?.();
    } catch (_) {}
    return r;
  };
  try {
    startCareer = window.startCareer;
  } catch (_) {}
  const prevRestore13286 = window.restoreSnapshot;
  window.restoreSnapshot = function () {
    const r = prevRestore13286.apply(this, arguments);
    if (r) {
      applyRealityBaseline13286();
      clearIllegalPending13286();
      try {
        renderHub();
      } catch (_) {}
    }
    return r;
  };
  try {
    restoreSnapshot = window.restoreSnapshot;
  } catch (_) {}

  applyRealityBaseline13286();
  clearIllegalPending13286();
  const prevSnap13286 = window.snapshot || snapshot;
  window.snapshot = function () {
    const s = prevSnap13286.apply(this, arguments);
    if (s) {
      s.version = 4166;
      s.majorVersion = "beta";
      s.featureSet = "beta-patch13.28.8-veteran-continuation";
    }
    return s;
  };
  try {
    snapshot = window.snapshot;
  } catch (_) {}
})();
