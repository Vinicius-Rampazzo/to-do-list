/**
 * WorkBase — Storage Service
 * Abstração para acessar o localStorage e permitir futura migração para IndexedDB.
 */

export const storageService = {
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        return JSON.parse(raw);
      }
      return defaultValue;
    } catch (e) {
      console.error(`Erro ao ler ${key} do localStorage:`, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Erro ao salvar ${key} no localStorage:`, e);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Erro ao remover ${key}:`, e);
    }
  },

  clear() {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Erro ao limpar localStorage:', e);
    }
  }
};
