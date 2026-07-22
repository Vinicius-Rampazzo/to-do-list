import { storageService } from './storageService.js';

const SETTINGS_KEY = 'wb-settings';

const defaultSettings = {
  userName: 'Vinícius',
  pomodoroDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  theme: 'light',
  categories: ['Trabalho', 'Pessoal', 'Estudo', 'Projetos']
};

export const settingsRepository = {
  get() {
    return storageService.get(SETTINGS_KEY, defaultSettings);
  },

  update(changes) {
    const current = this.get();
    const updated = { ...current, ...changes };
    storageService.set(SETTINGS_KEY, updated);
    return updated;
  }
};
