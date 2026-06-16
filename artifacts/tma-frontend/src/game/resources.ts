export type ResourceId =
  | "crude_oil"
  | "refined_fuel"
  | "coins"
  | "xp"
  | "workers"
  | "crisis_tokens";

export interface Resource {
  id: ResourceId;
  name: string;
  icon: string;
  color: string;
  maxStorage: number;
}

export const RESOURCES: Record<ResourceId, Resource> = {
  crude_oil:     { id: "crude_oil",     name: "Сырая нефть",   icon: "🛢️", color: "#8B4513", maxStorage: 500 },
  refined_fuel:  { id: "refined_fuel",  name: "Топливо",       icon: "⛽", color: "#3b82f6", maxStorage: 1000 },
  coins:         { id: "coins",         name: "Монеты",        icon: "💰", color: "#f59e0b", maxStorage: Infinity },
  xp:            { id: "xp",            name: "Опыт",          icon: "⭐", color: "#8b5cf6", maxStorage: Infinity },
  workers:       { id: "workers",       name: "Рабочие",       icon: "👷", color: "#10b981", maxStorage: 20 },
  crisis_tokens: { id: "crisis_tokens", name: "Кризис-токены", icon: "🔴", color: "#ef4444", maxStorage: 100 },
};
