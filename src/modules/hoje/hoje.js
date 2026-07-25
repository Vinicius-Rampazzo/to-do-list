import { settingsRepository } from '../../core/settingsRepository.js';
import { taskRepository } from '../../core/taskRepository.js';
import { timerRepository } from '../../core/timerRepository.js';
import { noteRepository } from '../../core/noteRepository.js';

export default {
  render() {
    const settings = settingsRepository.get();
    const allPending = taskRepository.getPending();
    const allCompleted = taskRepository.getCompleted();
    const completedToday = taskRepository.getCompletedToday();
    const focusSeconds = timerRepository.getTotalFocusToday();
    const todaySessions = timerRepository.getTodaySessions();
    const allNotes = noteRepository.getAll();
    const pinnedNotes = allNotes.filter(n => n.pinned);
    
    const hours = Math.floor(focusSeconds / 3600);
    const minutes = Math.floor((focusSeconds % 3600) / 60);
    const focusTimeStr = hours > 0 ? `${hours}h${minutes}min` : `${minutes}min`;

    return `
      <div class="module-header">
        <h2>Veja seu resumo</h2>
        <p class="text-muted">Aqui está o panorama da sua produtividade.</p>
      </div>

      <!-- Cards de resumo do DIA -->
      <div class="dashboard-cards" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
        <div class="dash-card">
          <div class="dash-icon" style="background: rgba(249, 115, 22, 0.1); color: #f97316;">
            <i data-lucide="circle-dashed"></i>
          </div>
          <div class="dash-info">
            <span class="dash-value">${allPending.length}</span>
            <span class="dash-label">Pendentes</span>
          </div>
        </div>
        
        <div class="dash-card">
          <div class="dash-icon success">
            <i data-lucide="check-circle-2"></i>
          </div>
          <div class="dash-info">
            <span class="dash-value">${completedToday.length}</span>
            <span class="dash-label">Concluídas hoje</span>
          </div>
        </div>

        <div class="dash-card">
          <div class="dash-icon focus">
            <i data-lucide="timer"></i>
          </div>
          <div class="dash-info">
            <span class="dash-value">${focusTimeStr}</span>
            <span class="dash-label">Foco hoje</span>
          </div>
        </div>

        <div class="dash-card">
          <div class="dash-icon" style="background: rgba(168, 85, 247, 0.1); color: #a855f7;">
            <i data-lucide="activity"></i>
          </div>
          <div class="dash-info">
            <span class="dash-value">${todaySessions.length}</span>
            <span class="dash-label">Sessões hoje</span>
          </div>
        </div>
      </div>

      <div class="dashboard-actions">
        <a href="/foco" class="btn btn-primary"><i data-lucide="play"></i> Iniciar sessão de foco</a>
      </div>

      <!-- Grid de seções -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: var(--space-4);">
        
        <!-- Tarefas do dia -->
        <div class="dashboard-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
            <h3>Próximas tarefas</h3>
            <a href="/tarefas" style="font-size: var(--fs-sm); color: var(--clr-accent); text-decoration: none; font-weight: 600;">Ver todas →</a>
          </div>
          <ul class="task-list" id="hoje-task-list">
            <!-- preenchido via JS -->
          </ul>
        </div>

        <!-- Notas recentes / fixadas -->
        <div class="dashboard-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
            <h3>Notas</h3>
            <a href="/notas" style="font-size: var(--fs-sm); color: var(--clr-accent); text-decoration: none; font-weight: 600;">Ver todas →</a>
          </div>
          <ul class="task-list" id="hoje-notes-list">
            <!-- preenchido via JS -->
          </ul>
        </div>
      </div>

      <!-- Visão geral -->
      <div class="dashboard-section" style="margin-top: var(--space-4);">
        <h3 style="margin-bottom: var(--space-4);">Visão geral</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: var(--space-4);">
          <div style="text-align: center; padding: var(--space-4); background: var(--clr-bg); border-radius: var(--radius-md);">
            <div style="font-size: var(--fs-xl); font-weight: 700; color: var(--clr-text-primary);">${allPending.length + allCompleted.length}</div>
            <div style="font-size: var(--fs-xs); color: var(--clr-text-muted); text-transform: uppercase;">Total de tarefas</div>
          </div>
          <div style="text-align: center; padding: var(--space-4); background: var(--clr-bg); border-radius: var(--radius-md);">
            <div style="font-size: var(--fs-xl); font-weight: 700; color: var(--clr-accent);">${allCompleted.length}</div>
            <div style="font-size: var(--fs-xs); color: var(--clr-text-muted); text-transform: uppercase;">Total concluídas</div>
          </div>
          <div style="text-align: center; padding: var(--space-4); background: var(--clr-bg); border-radius: var(--radius-md);">
            <div style="font-size: var(--fs-xl); font-weight: 700; color: #a855f7;">${allNotes.length}</div>
            <div style="font-size: var(--fs-xs); color: var(--clr-text-muted); text-transform: uppercase;">Notas salvas</div>
          </div>
          <div style="text-align: center; padding: var(--space-4); background: var(--clr-bg); border-radius: var(--radius-md);">
            <div style="font-size: var(--fs-xl); font-weight: 700; color: #3b82f6;">${this.getTotalFocusFormatted()}</div>
            <div style="font-size: var(--fs-xs); color: var(--clr-text-muted); text-transform: uppercase;">Foco total</div>
          </div>
        </div>
      </div>
    `;
  },

  getTotalFocusFormatted() {
    const allSessions = timerRepository.getAll();
    const totalSecs = allSessions.reduce((sum, s) => sum + (s.durationInSeconds || 0), 0);
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    if (h > 0) return `${h}h${m}m`;
    return `${m}min`;
  },

  init() {
    this.renderTasks();
    this.renderNotes();
  },

  renderTasks() {
    const list = document.getElementById('hoje-task-list');
    if (!list) return;

    const pendingTasks = taskRepository.getPending().slice(0, 5);
    
    if (pendingTasks.length === 0) {
      list.innerHTML = `<p class="text-muted" style="padding: var(--space-3) 0;">Nenhuma tarefa pendente. Parabéns! 🎉</p>`;
      return;
    }

    list.innerHTML = pendingTasks.map(t => `
      <li class="task-item-simple">
        <div style="display: flex; align-items: center; gap: var(--space-3);">
          <span style="color: var(--clr-text-muted);"><i data-lucide="circle-dashed" style="width: 16px; height: 16px;"></i></span>
          <span class="task-text">${t.title}</span>
        </div>
      </li>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  renderNotes() {
    const list = document.getElementById('hoje-notes-list');
    if (!list) return;

    const allNotes = noteRepository.getAll();
    const displayNotes = [...allNotes].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return (a.order || 0) - (b.order || 0);
    }).slice(0, 5);

    if (displayNotes.length === 0) {
      list.innerHTML = `<p class="text-muted" style="padding: var(--space-3) 0;">Nenhuma nota salva ainda.</p>`;
      return;
    }

    list.innerHTML = displayNotes.map(n => {
      const preview = n.content.split('\n')[0].substring(0, 80);
      return `
        <li class="task-item-simple">
          <div style="display: flex; align-items: center; gap: var(--space-3);">
            <span style="color: ${n.pinned ? 'var(--clr-accent)' : 'var(--clr-text-muted)'};"><i data-lucide="${n.pinned ? 'pin' : 'file-text'}" style="width: 16px; height: 16px;"></i></span>
            <span class="task-text" style="color: var(--clr-text-secondary);">${this.escapeHtml(preview)}${n.content.length > 80 ? '...' : ''}</span>
          </div>
        </li>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },

  destroy() {
    // cleanup se necessário
  }
};
