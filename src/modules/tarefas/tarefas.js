import { taskRepository } from '../../core/taskRepository.js';
import { timerEngine } from '../../core/timerEngine.js';

let dragSourceId = null;

export default {
  render() {
    return `
      <div class="module-header">
        <h2>Tarefas</h2>
      </div>

      <div class="dashboard-cards" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-bottom: var(--space-6);">
        <div class="dash-card">
          <div class="dash-icon" style="background: rgba(249, 115, 22, 0.1); color: #f97316;">
            <i data-lucide="circle-dashed"></i>
          </div>
          <div class="dash-info">
            <span class="dash-value" id="count-pending">0</span>
            <span class="dash-label">Pendentes</span>
          </div>
        </div>
        <div class="dash-card">
          <div class="dash-icon success">
            <i data-lucide="check-circle-2"></i>
          </div>
          <div class="dash-info">
            <span class="dash-value" id="count-done">0</span>
            <span class="dash-label">Concluídas</span>
          </div>
        </div>
      </div>

      <div class="app-card">
        <section class="add-task-section">
          <div class="input-wrapper">
            <span class="input-icon"><i data-lucide="plus"></i></span>
            <input type="text" id="input-nova-tarefa" class="task-input" placeholder="Nova tarefa..." autocomplete="off" />
          </div>
          <button id="btn-adicionar" class="btn btn-primary"><i data-lucide="plus-circle"></i> Adicionar</button>
        </section>

        <p class="hint-text"><i data-lucide="info"></i> Duplo clique para expandir · Arraste para reordenar</p>

        <ol id="lista-tarefas" class="task-list"></ol>

        <div id="empty-state" class="empty-state" hidden>
          <span class="empty-icon"><i data-lucide="clipboard-list"></i></span>
          <p>Nenhuma tarefa ainda.</p>
        </div>
      </div>
      
      <footer class="app-footer">
        <button id="btn-remover-finalizados" class="btn btn-secondary"><i data-lucide="trash-2"></i> Remover Concluídas</button>
      </footer>
    `;
  },

  init() {
    this.listaTarefas = document.getElementById('lista-tarefas');
    this.inputNovaTarefa = document.getElementById('input-nova-tarefa');
    this.btnAdicionar = document.getElementById('btn-adicionar');
    this.emptyState = document.getElementById('empty-state');
    
    this.countPending = document.getElementById('count-pending');
    this.countDone = document.getElementById('count-done');

    this.bindEvents();
    this.renderTasks();
  },

  bindEvents() {
    this.btnAdicionar.addEventListener('click', () => this.addTask());
    this.inputNovaTarefa.addEventListener('keydown', e => {
      if (e.key === 'Enter') this.addTask();
    });

    document.getElementById('btn-remover-finalizados').addEventListener('click', () => {
      const completed = taskRepository.getCompleted();
      completed.forEach(t => taskRepository.delete(t.id));
      this.renderTasks();
    });

    // Colapsa cards ao pressionar Escape
    document.addEventListener('keydown', this.handleEscape.bind(this));
    // Colapsa ao clicar fora
    document.addEventListener('click', this.handleClickOutside.bind(this));
  },

  handleEscape(e) {
    if (e.key === 'Escape' && this.listaTarefas) {
      this.listaTarefas.querySelectorAll('.task-item.expanded').forEach(el => {
        el.classList.remove('expanded');
        el.setAttribute('draggable', 'true');
      });
    }
  },

  handleClickOutside(e) {
    if (this.listaTarefas && !e.target.closest('.task-item') && !e.target.closest('#btn-remover-finalizados')) {
      this.listaTarefas.querySelectorAll('.task-item.expanded').forEach(el => {
        el.classList.remove('expanded');
        el.setAttribute('draggable', 'true');
      });
    }
  },

  addTask() {
    const text = this.inputNovaTarefa.value.trim();
    if (!text) return;

    taskRepository.create({ title: text });
    this.inputNovaTarefa.value = '';
    this.inputNovaTarefa.focus();
    this.renderTasks();
  },

  renderTasks() {
    if (!this.listaTarefas) return; // componente já destruído
    const tasks = taskRepository.getAll().sort((a, b) => a.order - b.order);
    this.listaTarefas.innerHTML = '';
    
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = 'task-item';
      li.setAttribute('data-id', task.id);
      li.setAttribute('draggable', 'true');
      if (task.completed) li.classList.add('completed');
      
      li.innerHTML = `
        <div class="item-main-row">
          <span class="drag-handle"><i data-lucide="grip-vertical"></i></span>
          <span class="task-num">${index + 1}</span>
          <span class="task-checkbox" role="checkbox" aria-checked="${task.completed}"></span>
          <span class="task-text">${this.escapeHtml(task.title)}</span>
          <button class="btn-delete-item" data-id="${task.id}"><i data-lucide="x"></i></button>
        </div>
        <div class="expanded-content">
          <p class="expanded-text" tabindex="0">${this.escapeHtml(task.title)}</p>
          <div class="expanded-actions">
            <span class="expanded-hint"><i data-lucide="mouse-pointer-2"></i> Selecione para copiar</span>
            <div style="display: flex; gap: var(--space-2);">
              <button class="btn-copy-task btn-start-timer" data-id="${task.id}"><i data-lucide="timer"></i> Focar</button>
              <button class="btn-copy-task btn-copy-action"><i data-lucide="copy"></i> Copiar</button>
            </div>
          </div>
        </div>
      `;

      // Eventos principais
      const checkbox = li.querySelector('.task-checkbox');
      checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
        taskRepository.update(task.id, { completed: !task.completed });
        this.renderTasks();
      });

      const btnDelete = li.querySelector('.btn-delete-item');
      btnDelete.addEventListener('click', (e) => {
        e.stopPropagation();
        taskRepository.delete(task.id);
        this.renderTasks();
      });

      // Expandir card
      li.addEventListener('dblclick', (e) => {
        if (e.target.closest('.btn-delete-item') || e.target.closest('.task-checkbox') || e.target.closest('.expanded-actions')) return;
        this.toggleExpand(li);
      });

      // Ações do card expandido
      const btnCopy = li.querySelector('.btn-copy-action');
      btnCopy.addEventListener('click', (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(task.title).then(() => {
          btnCopy.innerHTML = '<i data-lucide="check"></i> Copiado!';
          btnCopy.classList.add('btn-copy-success');
          if (window.lucide) window.lucide.createIcons();
          setTimeout(() => {
            btnCopy.innerHTML = '<i data-lucide="copy"></i> Copiar';
            btnCopy.classList.remove('btn-copy-success');
            if (window.lucide) window.lucide.createIcons();
          }, 1800);
        });
      });

      const btnFocar = li.querySelector('.btn-start-timer');
      btnFocar.addEventListener('click', (e) => {
        e.stopPropagation();
        timerEngine.startStopwatch(task.id);
        window.history.pushState(null, '', '/foco');
        if (window.router) window.router.handleRoute();
      });

      // Drag & Drop
      li.addEventListener('dragstart', this.onDragStart.bind(this));
      li.addEventListener('dragenter', this.onDragEnter.bind(this));
      li.addEventListener('dragover', this.onDragOver.bind(this));
      li.addEventListener('dragleave', this.onDragLeave.bind(this));
      li.addEventListener('drop', this.onDrop.bind(this));
      li.addEventListener('dragend', this.onDragEnd.bind(this));

      this.listaTarefas.appendChild(li);
    });

    this.updateCounters(tasks);

    if (tasks.length === 0) {
      this.emptyState.removeAttribute('hidden');
    } else {
      this.emptyState.setAttribute('hidden', '');
    }

    if (window.lucide) window.lucide.createIcons();
  },

  toggleExpand(li) {
    const isExpanded = li.classList.contains('expanded');

    this.listaTarefas.querySelectorAll('.task-item.expanded').forEach(el => {
      el.classList.remove('expanded');
      el.setAttribute('draggable', 'true');
    });

    if (!isExpanded) {
      li.classList.add('expanded');
      li.setAttribute('draggable', 'false');
      li.querySelector('.expanded-text')?.focus();
    }
  },

  onDragStart(e) {
    dragSourceId = e.currentTarget.dataset.id;
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dragSourceId);
  },

  onDragEnter(e) {
    e.preventDefault();
    const target = e.currentTarget;
    if (target.dataset.id !== dragSourceId) {
      target.classList.add('drag-over');
    }
  },

  onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  },

  onDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
  },

  onDrop(e) {
    e.preventDefault();
    const targetId = e.currentTarget.dataset.id;
    e.currentTarget.classList.remove('drag-over');

    if (!dragSourceId || dragSourceId === targetId) return;

    taskRepository.reorder(dragSourceId, targetId);
    this.renderTasks();
  },

  onDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
    this.listaTarefas.querySelectorAll('.drag-over').forEach(el => {
      el.classList.remove('drag-over');
    });
    dragSourceId = null;
  },

  updateCounters(tasks) {
    const pending = tasks.filter(t => !t.completed).length;
    const done = tasks.filter(t => t.completed).length;
    this.countPending.textContent = pending;
    this.countDone.textContent = done;
  },

  escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  },

  destroy() {
    document.removeEventListener('keydown', this.handleEscape);
    document.removeEventListener('click', this.handleClickOutside);
  }
};
