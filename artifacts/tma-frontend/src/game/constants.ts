export const TILE_W = 96;
export const TILE_H = 48;
export const SAVE_KEY = "oil_empire_save_v1";
export const OFFLINE_MAX_SEC = 3600 * 4;
export const OFFLINE_MULTIPLIER = 0.5;
export const AUTOSAVE_INTERVAL_MS = 30_000;
export const TICK_RATE_MS = 1000;

export const LEVEL_THRESHOLDS = [
  0, 200, 600, 1500, 4000, 10000, 25000, 60000, 150000, 400000,
];

export const LEVEL_TITLES = [
  "Деревня", "Посёлок", "Городок", "Город", "Регион",
  "Корпорация", "Концерн", "Холдинг", "Синдикат", "Нефтяной Магнат",
];

export const GRID_SIZE_BY_LEVEL = [4, 5, 6, 7, 8, 9, 10, 11, 12, 14];

export const DAILY_REWARDS = [
  { day: 1, coins: 500,   xp: 10,  crisis_tokens: 0,  label: "День 1" },
  { day: 2, coins: 1000,  xp: 25,  crisis_tokens: 0,  label: "День 2" },
  { day: 3, coins: 2000,  xp: 50,  crisis_tokens: 0,  label: "День 3" },
  { day: 4, coins: 1500,  xp: 40,  crisis_tokens: 5,  label: "День 4" },
  { day: 5, coins: 3000,  xp: 80,  crisis_tokens: 0,  label: "День 5" },
  { day: 6, coins: 2500,  xp: 60,  crisis_tokens: 10, label: "День 6" },
  { day: 7, coins: 10000, xp: 200, crisis_tokens: 25, label: "День 7 🎉" },
];

export const CRISIS_SHOP = [
  { id: "instant_oil",      name: "Мгновенная нефть",     cost: 5,  icon: "🛢️", reward_type: "crude_oil",   reward_value: 100 },
  { id: "instant_coins",    name: "Монеты",                cost: 10, icon: "💰", reward_type: "coins",       reward_value: 1000 },
  { id: "worker_boost",     name: "+5 раб. на 5 мин",      cost: 8,  icon: "👷", reward_type: "workers_temp",reward_value: 5 },
  { id: "production_boost", name: "×2 производство 2 мин", cost: 15, icon: "⚡", reward_type: "boost_2x",    reward_value: 120 },
  { id: "skip_crisis",      name: "Отменить кризис",        cost: 20, icon: "🛡️", reward_type: "cancel_crisis",reward_value: 1 },
];
