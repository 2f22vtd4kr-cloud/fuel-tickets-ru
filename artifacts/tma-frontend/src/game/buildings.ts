import type { ResourceId } from "./resources";

export type BuildingId =
  | "oil_well"
  | "pump_station"
  | "storage_tank"
  | "refinery"
  | "fuel_station"
  | "pipeline"
  | "research_lab"
  | "corporate_hq"
  | "worker_camp"
  | "security_post";

export type TileType = "oil_well" | "pump" | "tank" | "refinery" | "fuel_station" | "pipeline" | "lab" | "hq" | "camp" | "security";

export interface BuildingDef {
  id: BuildingId;
  name: string;
  description: string;
  icon: string;
  tileType: TileType;
  tileSize: 1 | 2 | 3;
  buildCost: Partial<Record<ResourceId, number>>;
  upgradeCostMultiplier: number;
  maxLevel: number;
  produces: Partial<Record<ResourceId, number>>;
  consumes: Partial<Record<ResourceId, number>>;
  productionPerLevel: number;
  workersRequired: number;
  buildXp: number;
  unlockLevel: number;
  unique: boolean;
}

export const BUILDINGS: Record<BuildingId, BuildingDef> = {
  oil_well: {
    id: "oil_well", name: "Нефтяная скважина", description: "Добывает сырую нефть. Основа вашей империи.",
    icon: "⛏️", tileType: "oil_well", tileSize: 1,
    buildCost: { coins: 150 }, upgradeCostMultiplier: 2.2, maxLevel: 8,
    produces: { crude_oil: 0.5 }, consumes: {}, productionPerLevel: 1.6,
    workersRequired: 1, buildXp: 50, unlockLevel: 1, unique: false,
  },
  pump_station: {
    id: "pump_station", name: "Насосная станция", description: "Увеличивает производительность скважин в зоне 2 тайла.",
    icon: "🔧", tileType: "pump", tileSize: 1,
    buildCost: { coins: 500, crude_oil: 20 }, upgradeCostMultiplier: 2.5, maxLevel: 5,
    produces: {}, consumes: {}, productionPerLevel: 1.6,
    workersRequired: 1, buildXp: 80, unlockLevel: 2, unique: false,
  },
  storage_tank: {
    id: "storage_tank", name: "Резервуар хранения", description: "Увеличивает запас нефти на 500 баррелей.",
    icon: "🛢️", tileType: "tank", tileSize: 1,
    buildCost: { coins: 300 }, upgradeCostMultiplier: 1.8, maxLevel: 6,
    produces: {}, consumes: {}, productionPerLevel: 1,
    workersRequired: 0, buildXp: 60, unlockLevel: 1, unique: false,
  },
  refinery: {
    id: "refinery", name: "НПЗ (Нефтезавод)", description: "Перерабатывает нефть в топливо. 1 баррель → 2 единицы.",
    icon: "🏭", tileType: "refinery", tileSize: 2,
    buildCost: { coins: 1200, crude_oil: 50 }, upgradeCostMultiplier: 2.8, maxLevel: 6,
    produces: { refined_fuel: 1.0 }, consumes: { crude_oil: 0.5 }, productionPerLevel: 1.5,
    workersRequired: 2, buildXp: 120, unlockLevel: 3, unique: false,
  },
  fuel_station: {
    id: "fuel_station", name: "АЗС", description: "Продаёт топливо и генерирует монеты.",
    icon: "⛽", tileType: "fuel_station", tileSize: 2,
    buildCost: { coins: 2500, refined_fuel: 100 }, upgradeCostMultiplier: 3.0, maxLevel: 5,
    produces: { coins: 8.0, xp: 0.1 }, consumes: { refined_fuel: 0.3 }, productionPerLevel: 1.7,
    workersRequired: 2, buildXp: 200, unlockLevel: 4, unique: false,
  },
  pipeline: {
    id: "pipeline", name: "Нефтепровод", description: "Снижает потери при транспортировке на 30%.",
    icon: "🔩", tileType: "pipeline", tileSize: 1,
    buildCost: { coins: 250 }, upgradeCostMultiplier: 1.5, maxLevel: 3,
    produces: {}, consumes: {}, productionPerLevel: 1,
    workersRequired: 0, buildXp: 40, unlockLevel: 2, unique: false,
  },
  worker_camp: {
    id: "worker_camp", name: "Рабочий лагерь", description: "Увеличивает макс. количество рабочих на 5.",
    icon: "🏕️", tileType: "camp", tileSize: 1,
    buildCost: { coins: 800 }, upgradeCostMultiplier: 2.0, maxLevel: 4,
    produces: {}, consumes: {}, productionPerLevel: 1,
    workersRequired: 0, buildXp: 80, unlockLevel: 2, unique: false,
  },
  research_lab: {
    id: "research_lab", name: "Научная лаборатория", description: "Разблокирует технологии. +15% XP глобально.",
    icon: "🔬", tileType: "lab", tileSize: 2,
    buildCost: { coins: 5000, xp: 100 }, upgradeCostMultiplier: 3.5, maxLevel: 4,
    produces: { xp: 0.5 }, consumes: {}, productionPerLevel: 1.8,
    workersRequired: 2, buildXp: 300, unlockLevel: 5, unique: true,
  },
  corporate_hq: {
    id: "corporate_hq", name: "Корпоративный офис", description: "Увеличивает ВСЕ производство на 25% за уровень.",
    icon: "🏢", tileType: "hq", tileSize: 3,
    buildCost: { coins: 15000, refined_fuel: 500, xp: 300 }, upgradeCostMultiplier: 5.0, maxLevel: 3,
    produces: {}, consumes: {}, productionPerLevel: 1,
    workersRequired: 3, buildXp: 500, unlockLevel: 7, unique: true,
  },
  security_post: {
    id: "security_post", name: "Пост охраны", description: "Снижает потери от кризисных событий на 20%.",
    icon: "🛡️", tileType: "security", tileSize: 1,
    buildCost: { coins: 600 }, upgradeCostMultiplier: 2.0, maxLevel: 3,
    produces: {}, consumes: {}, productionPerLevel: 1,
    workersRequired: 1, buildXp: 70, unlockLevel: 3, unique: false,
  },
};

export const BUILDING_LIST = Object.values(BUILDINGS).sort((a, b) => a.unlockLevel - b.unlockLevel);
