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
        <button class="tab-btn active" data-tab="stopwatch">
          Cronômetro <span id="badge-tab-stopwatch" class="tab-active-dot" style="display:none;">•</span>
        </button>
        <button class="tab-btn" data-tab="timer">
          Temporizador <span id="badge-tab-timer" class="tab-active-dot" style="display:none;">•</span>
        </button>
        <button class="tab-btn" data-tab="pomodoro">
          Pomodoro <span id="badge-tab-pomodoro" class="tab-active-dot" style="display:none;">•</span>
        </button>
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
            <input type="number" id="input-timer-mins" class="task-input" min="1" max="180" style="width: 80px; text-align: center; padding: var(--space-1);" />
            <span class="text-muted" style="font-size: var(--fs-sm);">min</span>
          </div>
        </div>

        <!-- Controles Pomodoro -->
        <div id="controls-pomodoro" style="display: none; margin-bottom: var(--space-5);">
          <!-- Presets de Pomodoro -->
          <div style="display: flex; justify-content: center; gap: var(--space-2); margin-bottom: var(--space-4); flex-wrap: wrap;">
            <button class="btn btn-secondary btn-sm preset-pomo-btn" data-focus="25" data-break="5" data-longbreak="15" data-cycles="4">Tradicional (25m/5m)</button>
            <button class="btn btn-secondary btn-sm preset-pomo-btn" data-focus="45" data-break="15" data-longbreak="30" data-cycles="4">Longo (45m/15m)</button>
            <button class="btn btn-secondary btn-sm preset-pomo-btn" data-focus="15" data-break="3" data-longbreak="10" data-cycles="3">Rápido (15m/3m)</button>
          </div>

          <!-- Configurações Personalizadas do Pomodoro -->
          <div style="display: flex; justify-content: center; align-items: center; gap: var(--space-3); flex-wrap: wrap;">
            <div>
              <label class="text-muted" style="display: block; font-size: var(--fs-xs); margin-bottom: 2px;">Foco (min)</label>
              <input type="number" id="input-pomo-focus" class="task-input" value="25" min="1" max="180" style="width: 75px; text-align: center; padding: var(--space-1);" />
            </div>
            <div>
              <label class="text-muted" style="display: block; font-size: var(--fs-xs); margin-bottom: 2px;">Descanso (min)</label>
              <input type="number" id="input-pomo-break" class="task-input" value="5" min="1" max="60" style="width: 75px; text-align: center; padding: var(--space-1);" />
            </div>
            <div>
              <label class="text-muted" style="display: block; font-size: var(--fs-xs); margin-bottom: 2px;">Desc. Longo (min)</label>
              <input type="number" id="input-pomo-long-break" class="task-input" value="15" min="1" max="120" style="width: 75px; text-align: center; padding: var(--space-1);" />
            </div>
            <div>
              <label class="text-muted" style="display: block; font-size: var(--fs-xs); margin-bottom: 2px;">Ciclos p/ D. Longo</label>
              <input type="number" id="input-pomo-cycles" class="task-input" value="4" min="1" max="12" style="width: 75px; text-align: center; padding: var(--space-1);" />
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

      <!-- Bloco de Explicação do Modo Selecionado (Posicionado abaixo do card) -->
      <div id="explanation-box" class="dashboard-section" style="margin-top: var(--space-6);">
        <!-- Conteúdo renderizado dinamicamente via updateExplanation -->
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
    this.inputPomoLongBreak = document.getElementById('input-pomo-long-break');
    this.inputPomoCycles = document.getElementById('input-pomo-cycles');
    
    const urlParams = new URLSearchParams(window.location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl && ['stopwatch', 'timer', 'pomodoro'].includes(tabFromUrl)) {
      this.currentTab = tabFromUrl;
    } else {
      this.currentTab = 'stopwatch';
    }
    
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
    // Abas (troca de modo sem bloquear)
    this.tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetTab = e.currentTarget.dataset.tab;
        this.switchTab(targetTab);
      });
    });

    // Presets Temporizador
    document.querySelectorAll('.preset-timer-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mins = parseInt(e.currentTarget.dataset.time) || 10;
        this.inputTimerMins.value = mins;
        const timerObj = timerEngine.getTimer('timer');
        if (timerObj) {
          timerObj.initialSeconds = mins * 60;
          timerObj.seconds = mins * 60;
          timerObj.isCompleted = false;
          timerEngine.lastTimerMins = mins;
          timerEngine.saveState();
        }
        this.updateDisplayPreview();
      });
    });

    this.inputTimerMins.addEventListener('input', () => {
      const val = parseInt(this.inputTimerMins.value);
      if (!isNaN(val) && val > 0) {
        const timerObj = timerEngine.getTimer('timer');
        if (timerObj && !timerObj.isRunning && !timerObj.startedAt) {
          timerObj.initialSeconds = val * 60;
          timerObj.seconds = val * 60;
          timerObj.isCompleted = false;
          timerEngine.lastTimerMins = val;
          timerEngine.saveState();
        }
      }
      this.updateDisplayPreview();
    });

    // Presets Pomodoro
    document.querySelectorAll('.preset-pomo-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ds = e.currentTarget.dataset;
        this.inputPomoFocus.value = ds.focus;
        this.inputPomoBreak.value = ds.break;
        if (ds.longbreak) this.inputPomoLongBreak.value = ds.longbreak;
        if (ds.cycles) this.inputPomoCycles.value = ds.cycles;
        this.updateDisplayPreview();
      });
    });

    [this.inputPomoFocus, this.inputPomoBreak, this.inputPomoLongBreak, this.inputPomoCycles].forEach(input => {
      if (input) input.addEventListener('input', () => this.updateDisplayPreview());
    });

    // Controles principais do timer da aba atual
    this.btnStart.addEventListener('click', () => {
      const taskId = this.taskSelect.value || null;
      if (this.currentTab === 'stopwatch') {
        timerEngine.startStopwatch(taskId);
      } else if (this.currentTab === 'timer') {
        const timerObj = timerEngine.getTimer('timer');
        const savedMins = (timerObj && timerObj.initialSeconds > 0) 
          ? Math.floor(timerObj.initialSeconds / 60) 
          : (timerEngine.lastTimerMins || 25);
        
        let mins;
        if (timerObj && timerObj.isCompleted) {
          // Quando clica em "Reiniciar" num timer que acabou, reinicia o timer com o exato tempo que acabou!
          mins = savedMins;
        } else {
          // Se for "Iniciar", pega do campo de texto (se preenchido) ou do tempo salvo
          const inputVal = parseInt(this.inputTimerMins.value);
          mins = (!isNaN(inputVal) && inputVal > 0) ? inputVal : savedMins;
        }

        this.inputTimerMins.value = mins;
        timerEngine.startTimer(mins, taskId);
      } else if (this.currentTab === 'pomodoro') {
        const focusMins = parseInt(this.inputPomoFocus.value) || 25;
        const breakMins = parseInt(this.inputPomoBreak.value) || 5;
        const longBreakMins = parseInt(this.inputPomoLongBreak.value) || 15;
        const cycles = parseInt(this.inputPomoCycles.value) || 4;
        timerEngine.startPomodoro(taskId, focusMins, breakMins, longBreakMins, cycles);
      }
    });

    this.btnPause.addEventListener('click', () => {
      const t = timerEngine.getTimer(this.currentTab);
      if (t && t.isRunning) {
        timerEngine.pause(this.currentTab);
      } else {
        timerEngine.start(this.currentTab);
      }
    });

    this.btnStop.addEventListener('click', () => {
      timerEngine.stop(this.currentTab);
      this.renderSessions(); 
      this.updateDisplayPreview();
    });
  },

  switchTab(tab) {
    this.currentTab = tab;
    this.tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
    
    this.updateExplanation(tab);
    const timers = timerEngine.getAllTimers();
    this.updateUI(timers);
  },

  updateExplanation(tab) {
    const el = document.getElementById('explanation-box');
    if (!el) return;

    if (tab === 'stopwatch') {
      el.innerHTML = `
        <div style="display: flex; align-items: center; gap: var(--space-2); font-weight: 700; color: var(--clr-accent); font-size: var(--fs-sm); margin-bottom: var(--space-2);">
          <i data-lucide="info"></i> Como funciona o Cronômetro?
        </div>
        <div style="font-size: var(--fs-xs); color: var(--clr-text-secondary); line-height: 1.6;">
          <p style="margin-bottom: 4px;">• O <strong>Cronômetro</strong> realiza uma contagem progressiva (crescente) a partir do zero (00:00:00).</p>
          <p style="margin-bottom: 4px;">• Ideal para registrar o tempo livre gasto em tarefas contínuas sem um tempo limite predefinido.</p>
          <p>• Você pode vincular uma tarefa opcional para contabilizar o tempo trabalhado diretamente no histórico dela.</p>
        </div>
      `;
    } else if (tab === 'timer') {
      el.innerHTML = `
        <div style="display: flex; align-items: center; gap: var(--space-2); font-weight: 700; color: var(--clr-accent); font-size: var(--fs-sm); margin-bottom: var(--space-2);">
          <i data-lucide="info"></i> Como funciona o Temporizador?
        </div>
        <div style="font-size: var(--fs-xs); color: var(--clr-text-secondary); line-height: 1.6;">
          <p style="margin-bottom: 4px;">• O <strong>Temporizador</strong> realiza uma contagem regressiva a partir da duração definida por você.</p>
          <p style="margin-bottom: 4px;">• Escolha um tempo rápido (10m, 20m, 30m, 45m, 60m) ou digite uma duração personalizada em minutos.</p>
          <p>• Quando o tempo esgotar, um sinal sonoro será emitido e a notificação permanecerá fixa no menu flutuante até você fechar.</p>
        </div>
      `;
    } else if (tab === 'pomodoro') {
      el.innerHTML = `
        <div style="display: flex; align-items: center; gap: var(--space-2); font-weight: 700; color: var(--clr-accent); font-size: var(--fs-sm); margin-bottom: var(--space-2);">
          <i data-lucide="info"></i> Como funciona a Técnica Pomodoro?
        </div>
        <div style="font-size: var(--fs-xs); color: var(--clr-text-secondary); line-height: 1.6;">
          <p style="margin-bottom: 4px;">• Trabalhe com <strong>foco total</strong> no tempo configurado para Foco (ex: 25 minutos).</p>
          <p style="margin-bottom: 4px;">• Ao encerrar a sessão de Foco, um som é emitido e o ciclo avança automaticamente para o <strong>Descanso Curto</strong>.</p>
          <p>• A cada <strong>X ciclos de foco concluídos</strong> (configurável acima), você terá um <strong>Descanso Longo</strong> para recompor a energia.</p>
        </div>
      `;
    }

    if (window.lucide) window.lucide.createIcons();
  },

  updateDisplayPreview() {
    const t = timerEngine.getTimer(this.currentTab);
    if (t && (t.isRunning || t.startedAt || t.isCompleted)) return;
    
    if (this.currentTab === 'stopwatch') {
      this.display.textContent = '00:00:00';
    } else if (this.currentTab === 'timer') {
      const timerObj = timerEngine.getTimer('timer');
      const savedMins = (timerObj && timerObj.initialSeconds > 0) ? Math.floor(timerObj.initialSeconds / 60) : (timerEngine.lastTimerMins || 25);
      const inputVal = parseInt(this.inputTimerMins.value);
      const mins = (!isNaN(inputVal) && inputVal > 0) ? inputVal : savedMins;
      this.inputTimerMins.value = mins;
      this.display.textContent = `${mins.toString().padStart(2, '0')}:00`;
    } else if (this.currentTab === 'pomodoro') {
      const fMins = parseInt(this.inputPomoFocus.value) || 0;
      const bMins = parseInt(this.inputPomoBreak.value) || 0;
      const cycles = parseInt(this.inputPomoCycles.value) || 4;
      this.display.textContent = `${fMins.toString().padStart(2, '0')}:00`;
      
      const phaseEl = document.getElementById('pomodoro-phase');
      const descEl = document.getElementById('pomodoro-desc');
      if (phaseEl) phaseEl.textContent = `FOCO — Ciclo 1 de ${cycles}`;
      if (phaseEl) phaseEl.style.color = 'var(--clr-accent)';
      if (descEl) descEl.textContent = `${fMins} minutos de foco, depois ${bMins} minutos de descanso.`;
    }
  },

  updateUI(timersMap) {
    if (!timersMap) return;

    // 1. Atualiza indicadores de cada aba (bolinha de status rodando)
    ['stopwatch', 'timer', 'pomodoro'].forEach(mode => {
      const t = timersMap[mode];
      const badge = document.getElementById(`badge-tab-${mode}`);
      if (badge) {
        const isTabActive = t && (t.isRunning || t.startedAt || t.isCompleted || (t.mode === 'stopwatch' && t.seconds > 0));
        if (isTabActive) {
          badge.style.display = 'inline';
          badge.style.color = (t.isRunning || t.isCompleted) ? 'var(--clr-accent)' : 'var(--clr-text-muted)';
        } else {
          badge.style.display = 'none';
        }
      }
    });

    // 2. Atualiza os dados da aba atual
    const t = timersMap[this.currentTab] || timerEngine.createDefaultTimerState(this.currentTab);
    const isHours = this.currentTab === 'stopwatch';
    const hrs = Math.floor(t.seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((t.seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (t.seconds % 60).toString().padStart(2, '0');

    // Um timer está ativo/em andamento se estiver rodando, pausado (startedAt != null) ou concluído
    const isStartedOrRunning = t.isRunning || t.startedAt !== null || t.isCompleted || (t.mode === 'stopwatch' && t.seconds > 0);
    
    if (isStartedOrRunning) {
      if (t.isCompleted) {
        this.display.textContent = 'Concluído!';
      } else {
        this.display.textContent = isHours ? `${hrs}:${mins}:${secs}` : `${mins}:${secs}`;
      }
    } else {
      this.updateDisplayPreview();
    }

    // Atualiza o valor do input de minutos com a duração salva do temporizador
    if (this.currentTab === 'timer' && t.initialSeconds > 0 && this.inputTimerMins) {
      if (document.activeElement !== this.inputTimerMins) {
        this.inputTimerMins.value = Math.floor(t.initialSeconds / 60);
      }
    }

    // Esconde/Mostra controles de configuração da aba atual
    if (isStartedOrRunning) {
      this.controlsTimer.style.display = 'none';
      this.controlsPomodoro.style.display = 'none';
      this.pomodoroInfo.style.display = (this.currentTab === 'pomodoro') ? 'block' : 'none';
    } else {
      this.controlsTimer.style.display = (this.currentTab === 'timer') ? 'block' : 'none';
      this.controlsPomodoro.style.display = (this.currentTab === 'pomodoro') ? 'block' : 'none';
      this.pomodoroInfo.style.display = (this.currentTab === 'pomodoro') ? 'block' : 'none';
    }

    // Botões
    if (t.isRunning) {
      this.btnStart.style.display = 'none';
      this.btnPause.style.display = 'inline-flex';
      this.btnStop.style.display = 'inline-flex';
      this.btnPause.innerHTML = '<i data-lucide="pause"></i> Pausar';
      this.taskSelect.disabled = true;
      if (t.taskId) this.taskSelect.value = t.taskId;
    } else if (t.startedAt !== null && !t.isCompleted) {
      // Pausado (começou mas está pausado)
      this.btnStart.style.display = 'none';
      this.btnPause.style.display = 'inline-flex';
      this.btnStop.style.display = 'inline-flex';
      this.btnPause.innerHTML = '<i data-lucide="play"></i> Retomar';
      this.taskSelect.disabled = true;
      if (t.taskId) this.taskSelect.value = t.taskId;
    } else if (t.isCompleted) {
      // Concluído
      this.btnStart.style.display = 'inline-flex';
      this.btnStart.innerHTML = '<i data-lucide="rotate-ccw"></i> Reiniciar';
      this.btnPause.style.display = 'none';
      this.btnStop.style.display = 'inline-flex';
      this.taskSelect.disabled = false;
    } else {
      // Nunca iniciado
      this.btnStart.style.display = 'inline-flex';
      this.btnStart.innerHTML = '<i data-lucide="play"></i> Iniciar';
      this.btnPause.style.display = 'none';
      this.btnStop.style.display = 'none';
      this.taskSelect.disabled = false;
      if (!t.taskId) this.taskSelect.value = '';
    }

    // Pomodoro Info Atualizada
    if (this.currentTab === 'pomodoro' && t.mode === 'pomodoro') {
      const interval = t.longBreakInterval || parseInt(this.inputPomoCycles?.value) || 4;
      const cycleNum = (t.completedCycles % interval) + 1;
      const phaseEl = document.getElementById('pomodoro-phase');
      const descEl = document.getElementById('pomodoro-desc');

      if (phaseEl && descEl) {
        let fMins = Math.floor(t.pomodoroDuration / 60);
        let bMins = Math.floor(t.breakDuration / 60);
        let lbMins = Math.floor(t.longBreakDuration / 60);

        if (t.phase === 'focus') {
          phaseEl.textContent = `🟢 FOCO — Ciclo ${cycleNum} de ${interval}`;
          phaseEl.style.color = 'var(--clr-accent)';
          descEl.textContent = `Focando agora. O descanso será de ${bMins} minutos.`;
        } else if (t.phase === 'break') {
          phaseEl.textContent = `☕ DESCANSO CURTO — Ciclo ${cycleNum} de ${interval}`;
          phaseEl.style.color = '#f59e0b';
          descEl.textContent = `Descansando por ${bMins} min antes da próxima sessão de foco de ${fMins} min.`;
        } else {
          phaseEl.textContent = `🎉 DESCANSO LONGO`;
          phaseEl.style.color = '#3b82f6';
          descEl.textContent = `Você completou ${interval} ciclos! Descansando por ${lbMins} minutos.`;
        }
      }
    }
    
    if (window.lucide) window.lucide.createIcons();
  },

  renderSessions() {
    const list = document.getElementById('sessions-list');
    const sessions = timerRepository.getTodaySessions();
    
    if (!list) return;

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
    const clearBtn = document.getElementById('btn-clear-sessions');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Deseja excluir todas as sessões de hoje?')) {
          timerRepository.clearTodaySessions();
          this.renderSessions();
        }
      });
    }
  },

  destroy() {
    timerEngine.removeListener(this.onStateChange);
  }
};
