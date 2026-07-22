import { timerEngine } from '../core/timerEngine.js';
import { taskRepository } from '../core/taskRepository.js';

export function renderFloatingTimer() {
  return `
    <div id="floating-timer" class="floating-timer" style="display: none;">
      <div class="floating-timer-info">
        <span id="floating-timer-display" class="floating-time">00:00:00</span>
        <span id="floating-timer-task" class="floating-task">Sem tarefa</span>
      </div>
      <div class="floating-timer-actions">
        <button id="floating-btn-playpause" class="btn-icon" aria-label="Pausar/Retomar">
          <i data-lucide="pause"></i>
        </button>
        <a href="/foco" class="btn-icon" aria-label="Ir ao foco">
          <i data-lucide="external-link"></i>
        </a>
      </div>
    </div>
  `;
}

export function initFloatingTimer() {
  const el = document.getElementById('floating-timer');
  const display = document.getElementById('floating-timer-display');
  const taskLabel = document.getElementById('floating-timer-task');
  const btnPlayPause = document.getElementById('floating-btn-playpause');
  
  if (!el) return;

  timerEngine.addListener((state) => {
    // Mostrar somente se houver timer ativo (rodando ou pausado) e NÃO estivermos na rota de foco
    const isFocoPage = window.location.pathname.startsWith('/foco');
    const hasActiveTimer = state.seconds > 0 || state.isRunning || state.startedAt;
    
    if (hasActiveTimer && !isFocoPage) {
      el.style.display = 'flex';
      
      // Update time
      const hrs = Math.floor(state.seconds / 3600).toString().padStart(2, '0');
      const mins = Math.floor((state.seconds % 3600) / 60).toString().padStart(2, '0');
      const secs = (state.seconds % 60).toString().padStart(2, '0');
      
      display.textContent = state.mode === 'stopwatch' 
        ? `${hrs}:${mins}:${secs}`
        : `${mins}:${secs}`;
        
      // Update task
      if (state.taskId) {
        const task = taskRepository.getById(state.taskId);
        taskLabel.textContent = task ? task.title : 'Tarefa excluída';
      } else {
        if (state.mode === 'pomodoro') {
          const phases = { focus: 'Foco', break: 'Descanso', longBreak: 'Descanso Longo' };
          taskLabel.textContent = `Pomodoro: ${phases[state.phase]}`;
        } else {
          taskLabel.textContent = 'Sessão livre';
        }
      }

      // Update button
      btnPlayPause.innerHTML = state.isRunning ? '<i data-lucide="pause"></i>' : '<i data-lucide="play"></i>';
      if (window.lucide) window.lucide.createIcons();

    } else {
      el.style.display = 'none';
    }
  });

  btnPlayPause.addEventListener('click', () => {
    if (timerEngine.state.isRunning) {
      timerEngine.pause();
    } else {
      timerEngine.start();
    }
  });
}
