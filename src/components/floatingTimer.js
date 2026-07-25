import { timerEngine } from '../core/timerEngine.js';
import { taskRepository } from '../core/taskRepository.js';

export function renderFloatingTimer() {
  return `
    <div id="floating-timer" class="floating-timer-container" style="display: none;">
      <!-- Conteúdo renderizado dinamicamente -->
    </div>
  `;
}

export function initFloatingTimer() {
  const container = document.getElementById('floating-timer');
  if (!container) return;

  // 1. Event Delegation: listener único para cliques no container (sem recriar a cada tick)
  container.addEventListener('click', (e) => {
    const playPauseBtn = e.target.closest('.btn-floating-playpause');
    if (playPauseBtn) {
      e.preventDefault();
      e.stopPropagation();
      const mode = playPauseBtn.dataset.mode;
      const timerObj = timerEngine.getTimer(mode);
      if (timerObj) {
        if (timerObj.isRunning) {
          timerEngine.pause(mode);
        } else {
          timerEngine.start(mode);
        }
      }
      return;
    }

    const dismissBtn = e.target.closest('.btn-floating-dismiss');
    if (dismissBtn) {
      e.preventDefault();
      e.stopPropagation();
      const mode = dismissBtn.dataset.mode;
      timerEngine.dismissCompleted(mode);
      return;
    }
  });

  const modeTitles = {
    stopwatch: 'Cronômetro',
    timer: 'Temporizador',
    pomodoro: 'Pomodoro'
  };

  const modeIcons = {
    stopwatch: 'stopwatch',
    timer: 'hourglass',
    pomodoro: 'timer'
  };

  const phases = {
    focus: 'Foco',
    break: 'Descanso Curto',
    longBreak: 'Descanso Longo'
  };

  // 2. Listener do timerEngine: atualizações direcionadas sem recriar o DOM a cada segundo
  timerEngine.addListener((timersMap) => {
    const isFocoPage = window.location.pathname.startsWith('/foco');
    
    // Obter lista de timers ativos ou concluídos
    const activeTimers = Object.values(timersMap).filter(t => {
      if (t.isCompleted) return true;
      if (t.isRunning) return true;
      if (t.startedAt) return true;
      if (t.mode === 'timer' && t.seconds > 0 && t.seconds < t.initialSeconds) return true;
      if (t.mode === 'stopwatch' && t.seconds > 0) return true;
      if (t.mode === 'pomodoro' && t.seconds > 0 && t.seconds < t.initialSeconds) return true;
      return false;
    });

    if (activeTimers.length === 0 || isFocoPage) {
      container.style.display = 'none';
      container.innerHTML = '';
      document.body.classList.remove('has-floating-timer');
      return;
    }

    container.style.display = 'flex';
    document.body.classList.add('has-floating-timer');

    activeTimers.forEach(t => {
      const hrs = Math.floor(t.seconds / 3600).toString().padStart(2, '0');
      const mins = Math.floor((t.seconds % 3600) / 60).toString().padStart(2, '0');
      const secs = (t.seconds % 60).toString().padStart(2, '0');
      
      let timeStr = t.mode === 'stopwatch' ? `${hrs}:${mins}:${secs}` : `${mins}:${secs}`;
      if (t.isCompleted) {
        timeStr = 'Concluído! 🎉';
      }

      const currentPhaseName = phases[t.phase] || 'Foco';
      let taskName = 'Sessão livre';
      if (t.taskId) {
        const task = taskRepository.getById(t.taskId);
        const taskTitle = task ? task.title : 'Tarefa excluída';
        taskName = t.mode === 'pomodoro' ? `${currentPhaseName} · ${taskTitle}` : taskTitle;
      } else {
        taskName = t.mode === 'pomodoro' ? currentPhaseName : 'Sessão livre';
      }

      const itemEl = container.querySelector(`.floating-timer-item[data-mode="${t.mode}"]`);
      const isCompletedClass = t.isCompleted ? 'floating-timer-completed' : '';
      const needsFullRebuild = !itemEl || itemEl.classList.contains('floating-timer-completed') !== t.isCompleted;

      if (needsFullRebuild) {
        const modeTitle = modeTitles[t.mode] || t.mode;
        const currentIconState = t.isRunning ? 'pause' : 'play';
        const playPauseBtn = t.isCompleted ? '' : `
          <button class="btn-icon btn-floating-playpause" data-mode="${t.mode}" data-current-icon="${currentIconState}" aria-label="Pausar/Retomar">
            <i data-lucide="${currentIconState}"></i>
          </button>
        `;

        const actionBtn = t.isCompleted ? `
          <button class="btn-icon btn-floating-dismiss" data-mode="${t.mode}" aria-label="Fechar" title="Fechar notificação">
            <i data-lucide="x"></i>
          </button>
        ` : `
          <a href="/foco?tab=${t.mode}" class="btn-icon" aria-label="Ir ao foco" title="Ir ao modo ${modeTitle}">
            <i data-lucide="external-link"></i>
          </a>
        `;

        const html = `
          <div class="floating-timer-item ${isCompletedClass}" data-mode="${t.mode}">
            <div class="floating-timer-info">
              <div class="floating-timer-header-row">
                <span class="floating-mode-tag"><i data-lucide="${modeIcons[t.mode]}"></i> ${modeTitle}</span>
                <span class="floating-time" style="${t.isCompleted ? 'color: var(--clr-accent); font-size: var(--fs-sm);' : ''}">${timeStr}</span>
              </div>
              <span class="floating-task" title="${taskName}">${taskName}</span>
            </div>
            <div class="floating-timer-actions">
              ${playPauseBtn}
              ${actionBtn}
            </div>
          </div>
        `;

        if (itemEl) {
          itemEl.outerHTML = html;
        } else {
          container.insertAdjacentHTML('beforeend', html);
        }
        if (window.lucide) window.lucide.createIcons();
      } else {
        // Atualização ultra-rápida sem reconstruir botões/DOM
        const timeEl = itemEl.querySelector('.floating-time');
        const taskEl = itemEl.querySelector('.floating-task');
        const playBtn = itemEl.querySelector('.btn-floating-playpause');

        if (timeEl && timeEl.textContent !== timeStr) {
          timeEl.textContent = timeStr;
        }
        if (taskEl && taskEl.textContent !== taskName) {
          taskEl.textContent = taskName;
          taskEl.title = taskName;
        }
        if (playBtn) {
          const expectedIcon = t.isRunning ? 'pause' : 'play';
          if (playBtn.dataset.currentIcon !== expectedIcon) {
            playBtn.dataset.currentIcon = expectedIcon;
            playBtn.innerHTML = `<i data-lucide="${expectedIcon}"></i>`;
            if (window.lucide) window.lucide.createIcons();
          }
        }
      }
    });

    // Remover itens do DOM que não estão mais ativos
    const activeModes = activeTimers.map(t => t.mode);
    container.querySelectorAll('.floating-timer-item').forEach(item => {
      if (!activeModes.includes(item.dataset.mode)) {
        item.remove();
      }
    });
  });
}
