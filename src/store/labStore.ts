import { create } from 'zustand';

interface LabState {
  selectedSimulation: number | null;
  gasolineQuality: 'premium' | 'suspect';
  currentTheme: 'huashu' | 'stitch';
  setSelectedSimulation: (id: number | null) => void;
  setGasolineQuality: (quality: 'premium' | 'suspect') => void;
  setCurrentTheme: (theme: 'huashu' | 'stitch') => void;
}

export const useLabStore = create<LabState>((set) => ({
  selectedSimulation: null,
  gasolineQuality: 'premium',
  currentTheme: 'huashu',
  setSelectedSimulation: (id) => set({ selectedSimulation: id }),
  setGasolineQuality: (quality) => set({ gasolineQuality: quality }),
  setCurrentTheme: (theme) => set({ currentTheme: theme }),
}));
