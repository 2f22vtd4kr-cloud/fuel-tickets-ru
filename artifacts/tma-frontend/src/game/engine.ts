import type { GameState } from "./store";
import type { ResourceId } from "./resources";
import type { BuildingId } from "./buildings";
import { BUILDINGS } from "./buildings";
import { CRISIS_EVENTS } from "./events";

function getStorageCap(resId: ResourceId, state: GameState): number {
  if (resId === "coins" || resId === "xp" || resId === "crisis_tokens") return Infinity;
  if (resId === "crude_oil") {
    const tanks = state.buildings.filter(b => b.id === "storage_tank");
    return 500 + tanks.reduce((sum, b) => sum + 500 * b.level, 0);
  }
  if (resId === "refined_fuel") return 1000;
  if (resId === "workers") return 20 + state.buildings.filter(b => b.id === "worker_camp").length * 5;
  return Infinity;
}

function getPumpStationBonus(building: { id: string; col: number; row: number }, allBuildings: { id: string; col: number; row: number; level: number }[]): number {
  if (building.id !== "oil_well") return 1;
  const pumps = allBuildings.filter(b => b.id === "pump_station");
  for (const pump of pumps) {
    const dist = Math.abs(building.col - pump.col) + Math.abs(building.row - pump.row);
    if (dist <= 2) return 1 + 0.6 * pump.level;
  }
  return 1;
}

function getPipelineEfficiency(building: { col: number; row: number }, allBuildings: { id: string; col: number; row: number }[]): number {
  const pipes = allBuildings.filter(b => b.id === "pipeline");
  for (const pipe of pipes) {
    const dist = Math.abs(building.col - pipe.col) + Math.abs(building.row - pipe.row);
    if (dist <= 1) return 1.3;
  }
  return 1;
}

function getActiveCrisisMultipliers(
  activeCrisisId: string | null,
  crisisDamageReduction: number,
): Record<string, Record<string, number>> {
  if (!activeCrisisId) return {};
  const crisis = CRISIS_EVENTS.find(e => e.id === activeCrisisId);
  if (!crisis) return {};
  const result: Record<string, Record<string, number>> = {};
  for (const effect of crisis.effects) {
    if (effect.type === "production_multiplier" && effect.targetBuilding) {
      const effective = effect.value < 1
        ? effect.value + crisisDamageReduction * (1 - effect.value)
        : effect.value;
      result[effect.targetBuilding] = result[effect.targetBuilding] ?? {};
      for (const resId of Object.keys(BUILDINGS[effect.targetBuilding]?.produces ?? {})) {
        result[effect.targetBuilding][resId] = effective;
      }
    }
  }
  return result;
}

export function tick(state: GameState, dt: number): GameState {
  const newResources = { ...state.resources };
  const newNotifications = [...(state.notifications ?? [])];

  const hqBuilding = state.buildings.find(b => b.id === "corporate_hq");
  const globalMultiplier = hqBuilding ? 1 + 0.25 * hqBuilding.level : 1;

  const productionBoostActive = state.productionBoostEndsAt && Date.now() < state.productionBoostEndsAt;
  const boostMult = productionBoostActive ? (state.productionBoost2x ?? 1) : 1;

  const securityBuildings = state.buildings.filter(b => b.id === "security_post");
  const crisisDamageReduction = securityBuildings.length * 0.2;

  const crisisMultipliers = getActiveCrisisMultipliers(state.activeCrisis, crisisDamageReduction);

  const totalWorkers = 10 + state.buildings.filter(b => b.id === "worker_camp").length * 5
    + (state.workerTempEndsAt && Date.now() < state.workerTempEndsAt ? state.workerTempBonus : 0);
  const usedWorkers = state.buildings.reduce((sum, b) => sum + (BUILDINGS[b.id]?.workersRequired ?? 0), 0);

  for (const building of state.buildings) {
    const def = BUILDINGS[building.id];
    if (!def) continue;
    if (!def.produces || Object.keys(def.produces).length === 0) continue;
    if (usedWorkers > totalWorkers) continue;

    const pumpBonus = getPumpStationBonus(building, state.buildings);
    const pipelineEff = getPipelineEfficiency(building, state.buildings);
    const levelMult = Math.pow(def.productionPerLevel, building.level - 1);
    const effMult = globalMultiplier * pumpBonus * pipelineEff * levelMult * boostMult;

    let canProduce = true;
    for (const [resId, baseRate] of Object.entries(def.consumes) as [ResourceId, number][]) {
      const consumed = (baseRate as number) * Math.pow(def.productionPerLevel, building.level - 1) * dt;
      if ((newResources[resId] ?? 0) < consumed) { canProduce = false; break; }
    }
    if (!canProduce) continue;

    for (const [resId, baseRate] of Object.entries(def.consumes) as [ResourceId, number][]) {
      const consumed = (baseRate as number) * Math.pow(def.productionPerLevel, building.level - 1) * dt;
      newResources[resId] = Math.max(0, (newResources[resId] ?? 0) - consumed);
    }

    for (const [resId, baseRate] of Object.entries(def.produces) as [ResourceId, number][]) {
      const crisisMult = crisisMultipliers[building.id]?.[resId] ?? 1;
      const produced = (baseRate as number) * effMult * crisisMult * dt;
      const cap = getStorageCap(resId as ResourceId, state);
      newResources[resId as ResourceId] = Math.min((newResources[resId as ResourceId] ?? 0) + produced, cap);
    }
  }

  let newActiveCrisis = state.activeCrisis;
  let newCrisisTimeLeft = state.crisisTimeLeft;

  if (newActiveCrisis) {
    newCrisisTimeLeft -= dt;
    if (newCrisisTimeLeft <= 0) {
      const crisis = CRISIS_EVENTS.find(e => e.id === newActiveCrisis);
      if (crisis) {
        for (const [res, amount] of Object.entries(crisis.rewardOnResolve) as [ResourceId, number][]) {
          newResources[res] = (newResources[res] ?? 0) + amount;
        }
        newNotifications.push({ id: Date.now(), text: `✅ Кризис "${crisis.name}" разрешён!`, type: "success" });
      }
      newActiveCrisis = null;
      newCrisisTimeLeft = 0;
    }
  } else if (Math.random() < 0.0003 * dt) {
    const eligible = CRISIS_EVENTS.filter(e => e.minPlayerLevel <= state.level && Math.random() < e.triggerChance);
    if (eligible.length > 0) {
      const crisis = eligible[Math.floor(Math.random() * eligible.length)];
      newActiveCrisis = crisis.id;
      newCrisisTimeLeft = crisis.duration;
      newNotifications.push({ id: Date.now(), text: `⚠️ ${crisis.name}`, type: "crisis" });
    }
  }

  const trimmedNotifications = newNotifications.slice(-5);

  return {
    ...state,
    resources: newResources,
    activeCrisis: newActiveCrisis,
    crisisTimeLeft: newCrisisTimeLeft,
    notifications: trimmedNotifications,
    particles: (state.particles ?? [])
      .map(p => ({ ...p, x: p.x + p.vx * dt, y: p.y + p.vy * dt, life: p.life - dt * 0.5 }))
      .filter(p => p.life > 0),
  };
}

export function getProductionRates(state: GameState): Partial<Record<ResourceId, number>> {
  const rates: Partial<Record<ResourceId, number>> = {};
  const hqBuilding = state.buildings.find(b => b.id === "corporate_hq");
  const globalMultiplier = hqBuilding ? 1 + 0.25 * hqBuilding.level : 1;

  for (const building of state.buildings) {
    const def = BUILDINGS[building.id];
    if (!def?.produces) continue;
    const pumpBonus = getPumpStationBonus(building, state.buildings);
    const pipelineEff = getPipelineEfficiency(building, state.buildings);
    const levelMult = Math.pow(def.productionPerLevel, building.level - 1);
    const effMult = globalMultiplier * pumpBonus * pipelineEff * levelMult;
    for (const [resId, baseRate] of Object.entries(def.produces) as [ResourceId, number][]) {
      rates[resId as ResourceId] = (rates[resId as ResourceId] ?? 0) + (baseRate as number) * effMult;
    }
  }
  return rates;
}

export function getUpgradeCost(building: { id: BuildingId; level: number }): number {
  const def = BUILDINGS[building.id];
  if (!def) return 0;
  return Math.round((def.buildCost.coins ?? 0) * Math.pow(def.upgradeCostMultiplier, building.level));
}
