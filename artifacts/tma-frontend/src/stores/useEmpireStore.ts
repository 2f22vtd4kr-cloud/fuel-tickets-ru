import { create } from "zustand";
import {
  fetchEmpire,
  collectEmpireCoins,
  buildEmpireBuilding,
  claimEmpireDailyReward,
  fetchEmpireLeaderboard,
  type EmpireState,
  type EmpireLeaderboardEntry,
} from "@/api/client";

interface EmpireStore {
  data: EmpireState | null;
  leaderboard: EmpireLeaderboardEntry[];
  loading: boolean;
  buildingLoading: string | null;
  localCoins: number;
  fetch: (userId: number) => Promise<void>;
  collect: (userId: number) => Promise<number>;
  build: (userId: number, buildingType: string) => Promise<EmpireBuildResult>;
  claimDailyReward: (userId: number) => Promise<{ day: number; coins: number }>;
  fetchLeaderboard: () => Promise<void>;
  tickCoins: (deltaCoins: number) => void;
}

interface EmpireBuildResult {
  new_level: number;
  xp_cost: number;
  available_xp: number;
  empire_level: number;
}

export const useEmpireStore = create<EmpireStore>((set, get) => ({
  data: null,
  leaderboard: [],
  loading: false,
  buildingLoading: null,
  localCoins: 0,

  fetch: async (userId) => {
    set({ loading: true });
    try {
      const data = await fetchEmpire(userId);
      set({ data, loading: false, localCoins: 0 });
    } catch {
      set({ loading: false });
    }
  },

  collect: async (userId) => {
    const result = await collectEmpireCoins(userId);
    set((s) => ({
      data: s.data
        ? { ...s.data, coins: result.new_balance, pending_coins: 0 }
        : s.data,
      localCoins: 0,
    }));
    return result.collected;
  },

  build: async (userId, buildingType) => {
    set({ buildingLoading: buildingType });
    try {
      const result = await buildEmpireBuilding(userId, buildingType);
      const { data } = get();
      if (data) {
        set({
          data: {
            ...data,
            buildings: { ...data.buildings, [buildingType]: result.new_level },
            empire_level: result.empire_level,
            available_xp: result.available_xp,
            xp_spent: data.xp_spent + result.xp_cost,
          },
          buildingLoading: null,
        });
      }
      return result;
    } catch (e) {
      set({ buildingLoading: null });
      throw e;
    }
  },

  claimDailyReward: async (userId) => {
    const result = await claimEmpireDailyReward(userId);
    set((s) => ({
      data: s.data
        ? {
            ...s.data,
            coins: s.data.coins + result.coins,
            daily_reward_day: result.day,
            daily_reward_available: false,
            next_daily_reward_in: 86400,
          }
        : s.data,
    }));
    return { day: result.day, coins: result.coins };
  },

  fetchLeaderboard: async () => {
    try {
      const res = await fetchEmpireLeaderboard();
      set({ leaderboard: res.entries });
    } catch {}
  },

  tickCoins: (deltaCoins) => {
    set((s) => ({ localCoins: s.localCoins + deltaCoins }));
  },
}));
