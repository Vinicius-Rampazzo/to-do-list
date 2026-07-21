import { storageService } from './storageService.js';

const SESSIONS_KEY = 'wb-time-sessions';
const ACTIVE_TIMER_KEY = 'wb-active-timer';

function generateId() {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const timerRepository = {
  getAll() {
    return storageService.get(SESSIONS_KEY, []);
  },

  getTodaySessions() {
    const today = new Date().toISOString().split('T')[0];
    return this.getAll().filter(s => {
      if (!s.endedAt) return false;
      return s.endedAt.split('T')[0] === today;
    });
  },

  getTotalFocusToday() {
    const sessions = this.getTodaySessions();
    return sessions.reduce((total, session) => total + session.durationInSeconds, 0);
  },

  create(sessionData) {
    const sessions = this.getAll();
    const newSession = {
      id: generateId(),
      taskId: sessionData.taskId || null,
      type: sessionData.type || 'stopwatch',
      startedAt: sessionData.startedAt || new Date().toISOString(),
      endedAt: sessionData.endedAt || new Date().toISOString(),
      durationInSeconds: sessionData.durationInSeconds || 0,
      label: sessionData.label || ''
    };

    sessions.push(newSession);
    storageService.set(SESSIONS_KEY, sessions);
    return newSession;
  },

  // Estado do timer ativo (para persistir entre reloads da página)
  getActiveTimer() {
    return storageService.get(ACTIVE_TIMER_KEY, null);
  },

  setActiveTimer(timerState) {
    storageService.set(ACTIVE_TIMER_KEY, timerState);
  },

  clearActiveTimer() {
    storageService.remove(ACTIVE_TIMER_KEY);
  },

  clearTodaySessions() {
    const today = new Date().toISOString().split('T')[0];
    const all = this.getAll();
    const remaining = all.filter(s => {
      if (!s.endedAt) return true;
      return s.endedAt.split('T')[0] !== today;
    });
    storageService.set(SESSIONS_KEY, remaining);
  }
};
