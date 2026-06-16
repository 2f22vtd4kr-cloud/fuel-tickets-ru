/**
 * Deep-link parser for Telegram Mini App startParam.
 *
 * Supported payload formats:
 *   map             → Map tab
 *   map_<id>        → Map tab, station <id> pre-selected
 *   catalog         → Catalog (Талоны) tab
 *   catalog_<id>    → Catalog tab, station <id> pre-selected
 *   ai              → AI-советник tab
 *   games           → Игры tab
 *   news            → Новости tab
 *   vault / vault_<id>  → Redirects to catalog (wallet is now in catalog)
 *   analytics / reserve / empire → Legacy redirects to relevant new tabs
 *   (empty / unknown) → default: Map tab
 */

import type { TabId } from "@/types";

export interface DeepLinkState {
  tab: TabId;
  stationId?: number;
  purchaseId?: number;
}

export function parseStartParam(param: string | undefined | null): DeepLinkState {
  if (!param || typeof param !== "string") return { tab: "map" };

  const underscoreIdx = param.indexOf("_");
  const key   = underscoreIdx >= 0 ? param.slice(0, underscoreIdx) : param;
  const rawId = underscoreIdx >= 0 ? param.slice(underscoreIdx + 1) : undefined;
  const numId = rawId ? parseInt(rawId, 10) : undefined;
  const id    = numId && !isNaN(numId) ? numId : undefined;

  switch (key) {
    case "map":     return { tab: "map",     stationId: id };
    case "catalog": return { tab: "catalog", stationId: id };
    case "ai":      return { tab: "ai" };
    case "games":   return { tab: "games" };
    case "news":    return { tab: "news" };

    // Legacy deep-links → redirect to closest new tab
    case "vault":     return { tab: "catalog", purchaseId: id };
    case "analytics": return { tab: "news" };
    case "reserve":   return { tab: "games" };
    case "empire":    return { tab: "games" };

    default: {
      const validTabs: TabId[] = ["map", "catalog", "ai", "games", "news"];
      if (validTabs.includes(param as TabId)) return { tab: param as TabId };
      return { tab: "map" };
    }
  }
}

export function buildStartParam(tab: TabId, id?: number): string {
  return id !== undefined ? `${tab}_${id}` : tab;
}
