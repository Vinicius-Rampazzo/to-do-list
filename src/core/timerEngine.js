import { timerRepository } from './timerRepository.js';
import { settingsRepository } from './settingsRepository.js';
import { taskRepository } from './taskRepository.js';

class TimerEngine {
  constructor() {
    this.intervalId = null;
    this.listeners = new Set();
    
    // Configurações padrão do Pomodoro
    const settings = settingsRepository.get();
    this.pomodoroDuration = settings.pomodoroDuration * 60;
    this.breakDuration = settings.breakDuration * 60;
    this.longBreakDuration = settings.longBreakDuration * 60;
    this.longBreakInterval = settings.longBreakInterval;

    this.restoreState();
  }

  restoreState() {
    const saved = timerRepository.getActiveTimer();
    if (saved) {
      this.state = saved;
      if (this.state.isRunning) {
        // Corrige o tempo se a página ficou fechada
        const now = Date.now();
        const elapsed = Math.floor((now - this.state.lastTick) / 1000);
        
        if (this.state.mode === 'stopwatch') {
          this.state.seconds += elapsed;
        } else {
          this.state.seconds -= elapsed;
          if (this.state.seconds <= 0) {
            this.state.seconds = 0;
            this.state.isRunning = false;
            this.handleCompletion();
          }
        }
        
        this.state.lastTick = now;
        
        if (this.state.isRunning) {
          this.startTick();
        } else {
          this.saveState();
        }
      }
    } else {
      this.resetState();
    }
  }

  resetState() {
    this.state = {
      mode: 'stopwatch', // stopwatch | timer | pomodoro
      phase: 'focus', // focus | break | longBreak
      seconds: 0,
      initialSeconds: 0,
      isRunning: false,
      taskId: null,
      startedAt: null,
      lastTick: null,
      completedCycles: 0,
      pomodoroDuration: this.pomodoroDuration,
      breakDuration: this.breakDuration,
      longBreakDuration: this.longBreakDuration
    };
    this.saveState();
  }

  saveState() {
    timerRepository.setActiveTimer(this.state);
    this.notifyListeners();
  }

  startStopwatch(taskId = null) {
    this.resetState();
    this.state.mode = 'stopwatch';
    this.state.taskId = taskId;
    this.start();
  }

  startTimer(minutes, taskId = null) {
    this.resetState();
    this.state.mode = 'timer';
    this.state.seconds = minutes * 60;
    this.state.initialSeconds = minutes * 60;
    this.state.taskId = taskId;
    this.start();
  }

  startPomodoro(taskId = null, focusMins = null, breakMins = null) {
    this.resetState();
    this.state.mode = 'pomodoro';
    this.state.phase = 'focus';
    
    if (focusMins) this.state.pomodoroDuration = focusMins * 60;
    if (breakMins) this.state.breakDuration = breakMins * 60;
    
    this.state.seconds = this.state.pomodoroDuration;
    this.state.initialSeconds = this.state.pomodoroDuration;
    this.state.taskId = taskId;
    this.start();
  }

  start() {
    if (this.state.isRunning) return;
    
    if (!this.state.startedAt) {
      this.state.startedAt = new Date().toISOString();
    }
    this.state.isRunning = true;
    this.state.lastTick = Date.now();
    this.saveState();
    this.startTick();
  }

  pause() {
    if (!this.state.isRunning) return;
    
    this.state.isRunning = false;
    clearInterval(this.intervalId);
    this.saveState();
  }

  stop() {
    this.pause();
    
    if (this.state.startedAt) {
      const duration = this.state.mode === 'stopwatch' 
        ? this.state.seconds 
        : (this.state.initialSeconds - this.state.seconds);
        
      if (duration > 0) {
        timerRepository.create({
          taskId: this.state.taskId,
          type: this.state.mode,
          startedAt: this.state.startedAt,
          endedAt: new Date().toISOString(),
          durationInSeconds: duration,
          label: this.state.phase
        });
        
        if (this.state.taskId) {
          taskRepository.addTime(this.state.taskId, duration);
        }
      }
    }
    
    this.resetState();
    timerRepository.clearActiveTimer();
  }

  startTick() {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      this.state.lastTick = Date.now();
      
      if (this.state.mode === 'stopwatch') {
        this.state.seconds++;
      } else {
        this.state.seconds--;
        if (this.state.seconds <= 0) {
          this.state.seconds = 0;
          this.pause();
          this.handleCompletion();
          return;
        }
      }
      
      this.saveState();
    }, 1000);
  }

  handleCompletion() {
    this.playNotificationSound();
    this.showBrowserNotification('Tempo esgotado!', 'Sua sessão foi concluída.');
    
    // Salva a sessão atual
    if (this.state.startedAt) {
      const duration = this.state.initialSeconds;
      timerRepository.create({
        taskId: this.state.taskId,
        type: this.state.mode,
        startedAt: this.state.startedAt,
        endedAt: new Date().toISOString(),
        durationInSeconds: duration,
        label: this.state.phase
      });
      
      if (this.state.taskId) {
        taskRepository.addTime(this.state.taskId, duration);
      }
    }

    if (this.state.mode === 'pomodoro') {
      this.advancePomodoroPhase();
    } else {
      this.resetState();
      timerRepository.clearActiveTimer();
    }
  }

  advancePomodoroPhase() {
    if (this.state.phase === 'focus') {
      this.state.completedCycles++;
      if (this.state.completedCycles % this.state.longBreakInterval === 0) {
        this.state.phase = 'longBreak';
        this.state.seconds = this.state.longBreakDuration;
        this.state.initialSeconds = this.state.longBreakDuration;
      } else {
        this.state.phase = 'break';
        this.state.seconds = this.state.breakDuration;
        this.state.initialSeconds = this.state.breakDuration;
      }
    } else {
      this.state.phase = 'focus';
      this.state.seconds = this.state.pomodoroDuration;
      this.state.initialSeconds = this.state.pomodoroDuration;
    }
    
    this.state.startedAt = null; // reseta para nova sessão
    this.saveState();
  }

  playNotificationSound() {
    // Implementação de som simplificada usando Web Audio API ou um audio nativo curto
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.log('Audio não suportado ou bloqueado', e);
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
    callback(this.state);
  }

  removeListener(callback) {
    this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.state));
  }
}

export const timerEngine = new TimerEngine();
