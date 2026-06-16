import type { BuildingId } from "./buildings";
import type { ResourceId } from "./resources";

export interface CrisisEffect {
  type: "production_multiplier" | "storage_cap" | "coin_bonus" | "worker_loss";
  targetBuilding?: BuildingId;
  targetResource?: ResourceId;
  value: number;
}

export interface CrisisEvent {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: number;
  effects: CrisisEffect[];
  rewardOnResolve: Partial<Record<ResourceId, number>>;
  triggerChance: number;
  minPlayerLevel: number;
}

export const CRISIS_EVENTS: CrisisEvent[] = [
  {
    id: "supply_disruption",
    name: "⚠️ Перебои поставок",
    description: "Трасса М04 закрыта. Производство скважин −50% на 3 мин.",
    icon: "🚧", duration: 180,
    effects: [{ type: "production_multiplier", targetBuilding: "oil_well", value: 0.5 }],
    rewardOnResolve: { crisis_tokens: 10, coins: 200 },
    triggerChance: 0.15, minPlayerLevel: 2,
  },
  {
    id: "price_spike",
    name: "📈 Скачок цен",
    description: "Цены на топливо выросли! АЗС приносят ×2 монет 5 минут!",
    icon: "💹", duration: 300,
    effects: [{ type: "production_multiplier", targetBuilding: "fuel_station", value: 2.0 }],
    rewardOnResolve: { crisis_tokens: 15, xp: 50 },
    triggerChance: 0.12, minPlayerLevel: 4,
  },
  {
    id: "worker_strike",
    name: "✊ Забастовка рабочих",
    description: "Потеря 3 рабочих на 2 минуты. Здания под угрозой простоя.",
    icon: "🪧", duration: 120,
    effects: [{ type: "worker_loss", value: 3 }],
    rewardOnResolve: { crisis_tokens: 8, coins: 150 },
    triggerChance: 0.1, minPlayerLevel: 3,
  },
  {
    id: "pipeline_rupture",
    name: "💧 Прорыв нефтепровода",
    description: "Транспортные потери ×3 на 4 минуты!",
    icon: "🔥", duration: 240,
    effects: [{ type: "production_multiplier", targetResource: "crude_oil", value: 0.3 }],
    rewardOnResolve: { crisis_tokens: 20, refined_fuel: 50 },
    triggerChance: 0.08, minPlayerLevel: 4,
  },
  {
    id: "government_audit",
    name: "🏛️ Государственная проверка",
    description: "Всё производство заморожено на 1 минуту.",
    icon: "📋", duration: 60,
    effects: [{ type: "production_multiplier", targetResource: "coins", value: 0 }],
    rewardOnResolve: { xp: 100, crisis_tokens: 5 },
    triggerChance: 0.06, minPlayerLevel: 5,
  },
  {
    id: "fuel_shortage_mega",
    name: "🚨 МЕГА-КРИЗИС: Дефицит топлива",
    description: "Все АЗС ×5 монет, но нефть расходуется ×3. Выживите 10 минут!",
    icon: "🆘", duration: 600,
    effects: [
      { type: "production_multiplier", targetBuilding: "fuel_station", value: 5.0 },
      { type: "production_multiplier", targetBuilding: "refinery", value: 3.0 },
    ],
    rewardOnResolve: { crisis_tokens: 50, coins: 2000, xp: 200 },
    triggerChance: 0.03, minPlayerLevel: 6,
  },
];
