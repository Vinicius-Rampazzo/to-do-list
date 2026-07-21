import { timerEngine } from '../../core/timerEngine.js';
import { timerRepository } from '../../core/timerRepository.js';
import { taskRepository } from '../../core/taskRepository.js';

export default {
  render() {
    return `
      <div class="module-header">
        <h2>Foco</h2>
        <p class="text-muted">Concentre-se em suas tarefas e registre seu tempo.</p>
      </div>

      <div class="tabs-nav">
        <button class="tab-btn active" data-tab="stopwatch">Cronômetro</button>
        <button class="tab-btn" data-tab="timer">Temporizador</button>
        <button class="tab-btn" data-tab="pomodoro">Pomodoro</button>
      </div>

      <div class="app-card" style="text-align: center; padding: var(--space-8) var(--space-6);">
        
        <!-- Controles Temporizador -->
        <div id="controls-timer" style="display: none; margin-bottom: var(--space-5);">
          <div style="display: flex; justify-content: center; gap: var(--space-2); margin-bottom: var(--space-3); flex-wrap: wrap;">
            <button class="btn btn-secondary btn-sm preset-timer-btn" data-time="10">10m</button>
            <button class="btn btn-secondary btn-sm preset-timer-btn" data-time="20">20m</button>
            <button class="btn btn-secondary btn-sm preset-timer-btn" data-time="30">30m</button>
            <button class="btn btn-secondary btn-sm preset-timer-btn" data-time="45">45m</button>
            <button class="btn btn-secondary btn-sm preset-timer-btn" data-time="60">60m</button>
          </div>
          <div style="display: flex; justify-content: center; align-items: center; gap: var(--space-2);">
            <label class="text-muted" style="font-size: var(--fs-sm);">Personalizado:</label>
            <input type="number" id="input-timer-mins" class="task-input" value="25" min="1" max="180" style="width: 80px; text-align: center; padding: var(--space-1);" />
            <span class="text-muted" style="font-size: var(--fs-sm);">min</span>
          </div>
        </div>

        <!-- Controles Pomodoro -->
        <div id="controls-pomodoro" style="display: none; margin-bottom: var(--space-5);">
          <div style="display: flex; justify-content: center; gap: var(--space-2); margin-bottom: var(--space-3); flex-wrap: wrap;">
            <button class="btn btn-secondary btn-sm preset-pomo-btn" data-focus="25" data-break="5">Tradicional (25m/5m)</button>
            <button class="btn btn-secondary btn-sm preset-pomo-btn" data-focus="45" data-break="15">Longo (45m/15m)</button>
            <button class="btn btn-secondary btn-sm preset-pomo-btn" data-focus="15" data-break="3">Rápido (15m/3m)</button>
          </div>
          <div style="display: flex; justify-content: center; align-items: center; gap: var(--space-4);">
            <div>
              <label class="text-muted" style="display: block; font-size: var(--fs-xs);">Foco (min)</label>
              <input type="number" id="input-pomo-focus" class="task-input" value="25" min="1" style="width: 70px; text-align: center; padding: var(--space-1);" />
            </div>
            <div>
              <label class="text-muted" style="display: block; font-size: var(--fs-xs);">Descanso (min)</label>
              <input type="number" id="input-pomo-break" class="task-input" value="5" min="1" style="width: 70px; text-align: center; padding: var(--space-1);" />
            </div>
          </div>
        </div>

        <!-- Estado do Pomodoro -->
        <div id="pomodoro-info" style="display: none; margin-bottom: var(--space-4); background: var(--clr-bg); padding: var(--space-3); border-radius: var(--radius-md);">
          <span id="pomodoro-phase" style="font-weight: 700; color: var(--clr-accent); text-transform: uppercase; letter-spacing: 1px; font-size: var(--fs-sm);">FOCO — Ciclo 1 de 4</span>
          <div id="pomodoro-desc" style="margin-top: var(--space-1); color: var(--clr-text-muted); font-size: var(--fs-sm);">25 minutos de foco, depois 5 minutos de descanso</div>
        </div>

        <div id="timer-display" style="font-size: 4rem; font-weight: 700; font-variant-numeric: tabular-nums; color: var(--clr-text-primary); margin-bottom: var(--space-4);">
          00:00:00
        </div>
        
        <div style="max-width: 300px; margin: 0 auto var(--space-6);">
          <label style="display: block; text-align: left; font-size: var(--fs-sm); font-weight: 600; margin-bottom: var(--space-2);">Vincular à tarefa (opcional)</label>
          <select id="task-select" class="task-input" style="width: 100%; padding-left: var(--space-3);">
            <option value="">Nenhuma tarefa</option>
            <!-- preenchido via js -->
          </select>
        </div>

        <div style="display: flex; gap: var(--space-3); justify-content: center;">
          <button id="btn-start" class="btn btn-primary"><i data-lucide="play"></i> Iniciar</button>
          <button id="btn-pause" class="btn btn-secondary" style="display: none;"><i data-lucide="pause"></i> Pausar</button>
          <button id="btn-stop" class="btn btn-danger" style="display: none;"><i data-lucide="square"></i> Finalizar</button>
        </div>
      </div>

      <div class="dashboard-section" style="margin-top: var(--space-6);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
          <h3>Sessões de hoje</h3>
          <button id="btn-clear-sessions" class="btn btn-secondary btn-sm"><i data-lucide="trash"></i> Limpar Tudo</button>
        </div>
        <ul id="sessions-list" class="task-list"></ul>
      </div>
    `;
  },

  init() {
    this.display = document.getElementById('timer-display');
    this.btnStart = document.getElementById('btn-start');
    this.btnPause = document.getElementById('btn-pause');
    this.btnStop = document.getElementById('btn-stop');
    this.taskSelect = document.getElementById('task-select');
    this.tabBtns = document.querySelectorAll('.tab-btn');
    
    this.controlsTimer = document.getElementById('controls-timer');
    this.controlsPomodoro = document.getElementById('controls-pomodoro');
    this.pomodoroInfo = document.getElementById('pomodoro-info');
    
    this.inputTimerMins = document.getElementById('input-timer-mins');
    this.inputPomoFocus = document.getElementById('input-pomo-focus');
    this.inputPomoBreak = document.getElementById('input-pomo-break');
    
    this.currentTab = timerEngine.state.mode;
    
    this.populateTasks();
    this.renderSessions();
    this.bindEvents();
    this.bindSessionsEvents();

    this.onStateChange = this.updateUI.bind(this);
    timerEngine.addListener(this.onStateChange);
    
    this.switchTab(this.currentTab);
  },

  populateTasks() {
    const tasks = taskRepository.getPending();
    const options = tasks.map(t => `<option value="${t.id}">${t.title}</option>`).join('');
    this.taskSelect.insertAdjacentHTML('beforeend', options);
  },

  bindEvents() {
    // Abas
    this.tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (timerEngine.state.isRunning) {
          if(!confirm('Um timer está rodando. Deseja parar e trocar de modo?')) return;
          timerEngine.stop();
        }
        this.switchTab(e.target.dataset.tab);
      });
    });

    // Presets Temporizador
    document.querySelectorAll('.preset-timer-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mins = e.target.dataset.time;
        this.inputTimerMins.value = mins;
        this.updateDisplayPreview();
      });
    });

    this.inputTimerMins.addEventListener('input', () => this.updateDisplayPreview());

    // Presets Pomodoro
    document.querySelectorAll('.preset-pomo-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.inputPomoFocus.value = e.target.dataset.focus;
        this.inputPomoBreak.value = e.target.dataset.break;
        this.updateDisplayPreview();
      });
    });

    this.inputPomoFocus.addEventListener('input', () => this.updateDisplayPreview());
    this.inputPomoBreak.addEventListener('input', () => this.updateDisplayPreview());

    // Controles principais
    this.btnStart.addEventListener('click', () => {
      const taskId = this.taskSelect.value || null;
      if (this.currentTab === 'stopwatch') {
        timerEngine.startStopwatch(taskId);
      } else if (this.currentTab === 'timer') {
        const mins = parseInt(this.inputTimerMins.value) || 25;
        timerEngine.startTimer(mins, taskId);
      } else if (this.currentTab === 'pomodoro') {
        const focusMins = parseInt(this.inputPomoFocus.value) || 25;
        const breakMins = parseInt(this.inputPomoBreak.value) || 5;
        timerEngine.startPomodoro(taskId, focusMins, breakMins);
      }
    });

    this.btnPause.addEventListener('click', () => {
      if (timerEngine.state.isRunning) {
        timerEngine.pause();
      } else {
        timerEngine.start();
      }
    });

    this.btnStop.addEventListener('click', () => {
      timerEngine.stop();
      this.renderSessions(); 
      this.updateDisplayPreview();
    });
  },

  switchTab(tab) {
    this.currentTab = tab;
    this.tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
    
    // Mostra controles se não estiver rodando
    const isRunningOrPaused = timerEngine.state.isRunning || timerEngine.state.seconds > 0 || timerEngine.state.startedAt;
    
    this.controlsTimer.style.display = (tab === 'timer' && !isRunningOrPaused) ? 'block' : 'none';
    this.controlsPomodoro.style.display = (tab === 'pomodoro' && !isRunningOrPaused) ? 'block' : 'none';
    this.pomodoroInfo.style.display = tab === 'pomodoro' ? 'block' : 'none';
    
    this.updateDisplayPreview();
  },

  updateDisplayPreview() {
    if (timerEngine.state.isRunning || timerEngine.state.seconds > 0 || timerEngine.state.startedAt) return;
    
    if (this.currentTab === 'stopwatch') {
      this.display.textContent = '00:00:00';
    } else if (this.currentTab === 'timer') {
      const mins = parseInt(this.inputTimerMins.value) || 0;
      this.display.textContent = `${mins.toString().padStart(2, '0')}:00`;
    } else if (this.currentTab === 'pomodoro') {
      const fMins = parseInt(this.inputPomoFocus.value) || 0;
      const bMins = parseInt(this.inputPomoBreak.value) || 0;
      this.display.textContent = `${fMins.toString().padStart(2, '0')}:00`;
      
      document.getElementById('pomodoro-phase').textContent = 'FOCO — Ciclo 1 de 4';
      document.getElementById('pomodoro-phase').style.color = 'var(--clr-accent)';
      document.getElementById('pomodoro-desc').textContent = `${fMins} minutos de foco, depois ${bMins} minutos de descanso.`;
    }
  },

  updateUI(state) {
    if (this.currentTab !== state.mode && (state.isRunning || state.seconds > 0 || state.startedAt)) {
      this.switchTab(state.mode);
    }

    const isHours = state.mode === 'stopwatch';
    const hrs = Math.floor(state.seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((state.seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (state.seconds % 60).toString().padStart(2, '0');
    
    // Só atualiza o display se estiver rodando ou em estado salvo. 
    // Se estiver 0 e não iniciado, o updateDisplayPreview cuida.
    if (state.isRunning || state.seconds > 0 || state.startedAt) {
      this.display.textContent = isHours ? `${hrs}:${mins}:${secs}` : `${mins}:${secs}`;
    }

    // Esconde controles de configuração quando ativo
    if (state.isRunning || state.seconds > 0 || state.startedAt) {
      this.controlsTimer.style.display = 'none';
      this.controlsPomodoro.style.display = 'none';
    } else {
      if (this.currentTab === 'timer') this.controlsTimer.style.display = 'block';
      if (this.currentTab === 'pomodoro') this.controlsPomodoro.style.display = 'block';
    }

    // Botões
    if (state.isRunning) {
      this.btnStart.style.display = 'none';
      this.btnPause.style.display = 'inline-flex';
      this.btnStop.style.display = 'inline-flex';
      this.btnPause.innerHTML = '<i data-lucide="pause"></i> Pausar';
      this.taskSelect.disabled = true;
      if (state.taskId) this.taskSelect.value = state.taskId;
      this.tabBtns.forEach(b => b.disabled = true);
    } else if (state.seconds > 0 || state.startedAt) {
      this.btnStart.style.display = 'none';
      this.btnPause.style.display = 'inline-flex';
      this.btnStop.style.display = 'inline-flex';
      this.btnPause.innerHTML = '<i data-lucide="play"></i> Retomar';
      this.tabBtns.forEach(b => b.disabled = false);
    } else {
      this.btnStart.style.display = 'inline-flex';
      this.btnPause.style.display = 'none';
      this.btnStop.style.display = 'none';
      this.taskSelect.disabled = false;
      if (!state.taskId) this.taskSelect.value = '';
      this.tabBtns.forEach(b => b.disabled = false);
    }

    // Pomodoro Info Atualizada
    if (state.mode === 'pomodoro') {
      const cycleNum = (state.completedCycles % timerEngine.longBreakInterval) + 1;
      const phaseEl = document.getElementById('pomodoro-phase');
      const descEl = document.getElementById('pomodoro-desc');
      
      let fMins = Math.floor(state.pomodoroDuration / 60);
      let bMins = Math.floor(state.breakDuration / 60);
      let lbMins = Math.floor(state.longBreakDuration / 60);

      if (state.phase === 'focus') {
        phaseEl.textContent = `🟢 FOCO — Ciclo ${cycleNum} de 4`;
        phaseEl.style.color = 'var(--clr-accent)';
        descEl.textContent = `Focando agora. O descanso será de ${bMins} minutos.`;
      } else if (state.phase === 'break') {
        phaseEl.textContent = `☕ DESCANSO — Ciclo ${cycleNum} de 4`;
        phaseEl.style.color = '#f59e0b'; // amber
        descEl.textContent = `Descansando antes do próximo foco de ${fMins} minutos.`;
      } else {
        phaseEl.textContent = `🎉 DESCANSO LONGO`;
        phaseEl.style.color = '#3b82f6'; // blue
        descEl.textContent = `Você completou 4 ciclos! Descansando por ${lbMins} minutos.`;
      }
    }
    
    if (window.lucide) window.lucide.createIcons();
  },

  renderSessions() {
    const list = document.getElementById('sessions-list');
    const sessions = timerRepository.getTodaySessions();
    
    if (sessions.length === 0) {
      list.innerHTML = '<p class="text-muted">Nenhuma sessão registrada hoje.</p>';
      return;
    }

    list.innerHTML = sessions.reverse().map(s => {
      const task = s.taskId ? taskRepository.getById(s.taskId) : null;
      const mins = Math.ceil(s.durationInSeconds / 60);
      let label = s.type;
      if (s.type === 'pomodoro' && s.label) label = `Pomodoro (${s.label})`;
      
      return `
        <li class="task-item-simple">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-weight: 500; display: block;">${task ? task.title : 'Sessão livre'}</span>
              <span class="text-muted" style="font-size: 11px; text-transform: capitalize;">${label}</span>
            </div>
            <span class="text-muted" style="font-weight: 600;">${mins} min</span>
          </div>
        </li>
      `;
    }).join('');
  },

  bindSessionsEvents() {
    document.getElementById('btn-clear-sessions').addEventListener('click', () => {
      if (confirm('Deseja excluir todas as sessões de hoje?')) {
        timerRepository.clearTodaySessions();
        this.renderSessions();
      }
    });
  },

  destroy() {
    timerEngine.removeListener(this.onStateChange);
  }
};
