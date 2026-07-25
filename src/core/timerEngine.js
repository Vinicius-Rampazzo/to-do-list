import { timerRepository } from './timerRepository.js';
import { settingsRepository } from './settingsRepository.js';
import { taskRepository } from './taskRepository.js';

let globalAudioCtx = null;

function getAudioContext() {
  if (!globalAudioCtx) {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (AudioCtxClass) {
      globalAudioCtx = new AudioCtxClass();
    }
  }
  if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
    globalAudioCtx.resume().catch(() => {});
  }
  return globalAudioCtx;
}

if (typeof window !== 'undefined') {
  ['click', 'touchstart', 'keydown', 'mousedown'].forEach(evt => {
    window.addEventListener(evt, () => {
      getAudioContext();
    }, { passive: true });
  });
}

class TimerEngine {
  constructor() {
    this.intervalId = null;
    this.listeners = new Set();
    this.lastTimerMins = 25;
    
    // Configurações padrão do Pomodoro
    const settings = settingsRepository.get();
    this.pomodoroDuration = (settings.pomodoroDuration || 25) * 60;
    this.breakDuration = (settings.breakDuration || 5) * 60;
    this.longBreakDuration = (settings.longBreakDuration || 15) * 60;
    this.longBreakInterval = settings.longBreakInterval || 4;

    this.resetAllStates();
    this.restoreState();

    // Quando a aba volta ao foco, recalcula o tempo de todos os timers ativos
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.hasRunningTimers()) {
        this.tick();
      }
    });
  }

  createDefaultTimerState(mode) {
    let lastTimerSecs = 1500; // default 25m
    if (mode === 'timer') {
      if (this.timers && this.timers.timer && this.timers.timer.initialSeconds > 0) {
        lastTimerSecs = this.timers.timer.initialSeconds;
      } else if (this.lastTimerMins > 0) {
        lastTimerSecs = this.lastTimerMins * 60;
      }
    }

    const base = {
      mode,
      seconds: mode === 'timer' ? lastTimerSecs : 0,
      initialSeconds: mode === 'timer' ? lastTimerSecs : 0,
      isRunning: false,
      isCompleted: false,
      taskId: null,
      startedAt: null,
      lastTick: null
    };

    if (mode === 'pomodoro') {
      return {
        ...base,
        phase: 'focus', // focus | break | longBreak
        completedCycles: 0,
        seconds: this.pomodoroDuration,
        initialSeconds: this.pomodoroDuration,
        pomodoroDuration: this.pomodoroDuration,
        breakDuration: this.breakDuration,
        longBreakDuration: this.longBreakDuration,
        longBreakInterval: this.longBreakInterval
      };
    }

    return base;
  }

  resetAllStates() {
    this.timers = {
      stopwatch: this.createDefaultTimerState('stopwatch'),
      timer: this.createDefaultTimerState('timer'),
      pomodoro: this.createDefaultTimerState('pomodoro')
    };
  }

  resetTimerState(mode) {
    if (this.timers[mode]) {
      const prevInitial = this.timers[mode].initialSeconds;
      this.timers[mode] = this.createDefaultTimerState(mode);
      if (mode === 'timer' && prevInitial > 0) {
        this.timers[mode].initialSeconds = prevInitial;
        this.timers[mode].seconds = prevInitial;
      }
    }
  }

  restoreState() {
    const saved = timerRepository.getActiveTimers();
    if (saved) {
      ['stopwatch', 'timer', 'pomodoro'].forEach(mode => {
        if (saved[mode]) {
          this.timers[mode] = saved[mode];
          const t = this.timers[mode];

          if (mode === 'timer' && t.initialSeconds > 0) {
            this.lastTimerMins = Math.floor(t.initialSeconds / 60);
          }

          if (t.isRunning && t.lastTick) {
            const now = Date.now();
            const elapsed = Math.floor((now - t.lastTick) / 1000);

            if (t.mode === 'stopwatch') {
              t.seconds += elapsed;
            } else {
              t.seconds -= elapsed;
              if (t.seconds <= 0) {
                t.seconds = 0;
                this.handleCompletion(t);
              }
            }
            t.lastTick = now;
          }
        }
      });
    }

    if (this.hasRunningTimers()) {
      this.ensureTickRunning();
    } else {
      this.saveState();
    }
  }

  // Getter de compatibilidade
  get state() {
    return this.timers.stopwatch.isRunning ? this.timers.stopwatch :
           this.timers.pomodoro.isRunning ? this.timers.pomodoro :
           this.timers.timer.isRunning ? this.timers.timer :
           this.timers.stopwatch;
  }

  getTimer(mode) {
    return this.timers[mode] || null;
  }

  getAllTimers() {
    return this.timers;
  }

  hasRunningTimers() {
    return Object.values(this.timers).some(t => t.isRunning);
  }

  getActiveTimersList() {
    return Object.values(this.timers).filter(t => t.isRunning || t.seconds > 0 || t.startedAt || t.isCompleted);
  }

  saveState() {
    timerRepository.setActiveTimers(this.timers);
    this.notifyListeners();
  }

  startStopwatch(taskId = null) {
    const t = this.timers.stopwatch;
    if (!t.isRunning && t.seconds === 0) {
      this.resetTimerState('stopwatch');
    }
    this.timers.stopwatch.taskId = taskId;
    this.timers.stopwatch.isCompleted = false;
    this.start('stopwatch');
  }

  startTimer(minutes = null, taskId = null) {
    const t = this.timers.timer;
    const selectedMins = minutes || (t.initialSeconds > 0 ? Math.floor(t.initialSeconds / 60) : this.lastTimerMins || 25);
    this.lastTimerMins = selectedMins;
    
    t.seconds = selectedMins * 60;
    t.initialSeconds = selectedMins * 60;
    t.taskId = taskId;
    t.isCompleted = false;
    this.start('timer');
  }

  startPomodoro(taskId = null, focusMins = null, breakMins = null, longBreakMins = null, cycleInterval = null) {
    const t = this.timers.pomodoro;
    if (focusMins) t.pomodoroDuration = focusMins * 60;
    if (breakMins) t.breakDuration = breakMins * 60;
    if (longBreakMins) t.longBreakDuration = longBreakMins * 60;
    if (cycleInterval) t.longBreakInterval = parseInt(cycleInterval) || 4;

    if (!t.isRunning && (!t.startedAt || t.seconds === 0 || t.isCompleted)) {
      t.phase = 'focus';
      t.seconds = t.pomodoroDuration;
      t.initialSeconds = t.pomodoroDuration;
    }
    t.taskId = taskId;
    t.isCompleted = false;
    this.start('pomodoro');
  }

  start(mode) {
    const t = this.timers[mode];
    if (!t || t.isRunning) return;

    if (!t.startedAt) {
      t.startedAt = new Date().toISOString();
    }
    t.isRunning = true;
    t.isCompleted = false;
    t.lastTick = Date.now();
    this.saveState();
    this.ensureTickRunning();
  }

  pause(mode) {
    const t = this.timers[mode];
    if (!t || !t.isRunning) return;

    t.isRunning = false;
    this.saveState();
    this.checkTickStatus();
  }

  stop(mode) {
    const t = this.timers[mode];
    if (!t) return;

    t.isRunning = false;

    if (t.startedAt) {
      const duration = t.mode === 'stopwatch'
        ? t.seconds
        : (t.initialSeconds - t.seconds);

      if (duration > 0) {
        timerRepository.create({
          taskId: t.taskId,
          type: t.mode,
          startedAt: t.startedAt,
          endedAt: new Date().toISOString(),
          durationInSeconds: duration,
          label: t.phase || ''
        });

        if (t.taskId) {
          taskRepository.addTime(t.taskId, duration);
        }
      }
    }

    this.resetTimerState(mode);
    this.saveState();
    this.checkTickStatus();
  }

  dismissCompleted(mode) {
    const t = this.timers[mode];
    if (!t) return;
    this.resetTimerState(mode);
    this.saveState();
    this.checkTickStatus();
  }

  ensureTickRunning() {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.tick();
      }, 200);
    }
  }

  checkTickStatus() {
    if (!this.hasRunningTimers() && this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  tick() {
    const now = Date.now();
    let updated = false;

    Object.values(this.timers).forEach(t => {
      if (!t.isRunning || !t.lastTick) return;

      const elapsed = Math.floor((now - t.lastTick) / 1000);
      if (elapsed <= 0) return;

      t.lastTick += elapsed * 1000;
      updated = true;

      if (t.mode === 'stopwatch') {
        t.seconds += elapsed;
      } else {
        t.seconds -= elapsed;
        if (t.seconds <= 0) {
          t.seconds = 0;
          this.handleCompletion(t);
        }
      }
    });

    if (updated) {
      this.saveState();
    }
  }

  handleCompletion(t) {
    // Toca o alarme sonoro
    this.playNotificationSound();
    
    if (t.mode === 'pomodoro') {
      const isFocusPhase = t.phase === 'focus';

      // 1. Grava a sessão concluída no histórico
      if (t.startedAt) {
        const duration = t.initialSeconds;
        timerRepository.create({
          taskId: t.taskId,
          type: t.mode,
          startedAt: t.startedAt,
          endedAt: new Date().toISOString(),
          durationInSeconds: duration,
          label: t.phase || ''
        });

        if (t.taskId) {
          taskRepository.addTime(t.taskId, duration);
        }
      }

      // 2. Avança a fase do Pomodoro
      this.advancePomodoroPhase(t);

      // 3. Notificação sonora e de navegador
      const title = isFocusPhase 
        ? `Foco concluído! ${t.phase === 'longBreak' ? 'Descanso Longo' : 'Descanso'} iniciado.`
        : 'Descanso encerrado! Nova sessão de Foco iniciada.';
      const body = isFocusPhase
        ? `Aproveite ${Math.floor(t.seconds / 60)} min para descansar.`
        : `Voltando ao trabalho por ${Math.floor(t.seconds / 60)} min.`;

      this.showBrowserNotification(title, body);

      // 4. Manter o Pomodoro rodando continuamente para a nova fase
      t.isRunning = true;
      t.isCompleted = false;
      t.startedAt = new Date().toISOString();
      t.lastTick = Date.now();
      this.saveState();
      this.ensureTickRunning();
    } else {
      // Para temporizador simples (timer)
      if (t.startedAt) {
        const duration = t.initialSeconds;
        timerRepository.create({
          taskId: t.taskId,
          type: t.mode,
          startedAt: t.startedAt,
          endedAt: new Date().toISOString(),
          durationInSeconds: duration,
          label: t.phase || ''
        });

        if (t.taskId) {
          taskRepository.addTime(t.taskId, duration);
        }
      }

      this.showBrowserNotification('Temporizador concluído!', 'Sua sessão foi concluída.');
      t.isCompleted = true;
      t.isRunning = false;
      t.seconds = 0;
      this.saveState();
    }
  }

  advancePomodoroPhase(t) {
    if (t.phase === 'focus') {
      t.completedCycles++;
      const interval = (t.longBreakInterval && t.longBreakInterval >= 1) ? t.longBreakInterval : 4;
      if (t.completedCycles % interval === 0) {
        t.phase = 'longBreak';
        t.seconds = t.longBreakDuration;
        t.initialSeconds = t.longBreakDuration;
      } else {
        t.phase = 'break';
        t.seconds = t.breakDuration;
        t.initialSeconds = t.breakDuration;
      }
    } else {
      t.phase = 'focus';
      t.seconds = t.pomodoroDuration;
      t.initialSeconds = t.pomodoroDuration;
    }
  }

  playNotificationSound() {
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx) return;

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;

      const playNote = (freq, startTime, duration) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.4, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      // Toca uma melodia marcante de 2 rajadas (Dó-Mí-Sol ... Dó-Mí-Sol)
      playNote(523.25, now, 0.2);       // C5
      playNote(659.25, now + 0.2, 0.2); // E5
      playNote(783.99, now + 0.4, 0.35); // G5

      playNote(523.25, now + 0.8, 0.2);   // C5
      playNote(659.25, now + 1.0, 0.2);   // E5
      playNote(783.99, now + 1.2, 0.45);  // G5
    } catch (e) {
      console.log('Áudio não suportado ou bloqueado', e);
    }
  }

  showBrowserNotification(title, body) {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: '/favicon.svg' });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(title, { body, icon: '/favicon.svg' });
        }
      });
    }
  }

  addListener(callback) {
    this.listeners.add(callback);
    callback(this.timers);
  }

  removeListener(callback) {
    this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.timers));
  }
}

export const timerEngine = new TimerEngine();
