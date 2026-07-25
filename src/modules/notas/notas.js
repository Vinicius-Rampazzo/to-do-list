import { noteRepository } from '../../core/noteRepository.js';
import { taskRepository } from '../../core/taskRepository.js';

let saveTimeout = null;

const COLOR_PALETTE = {
  emerald: { name: 'emerald', bg: '#064e3b', text: '#34d399' },
  violet: { name: 'violet', bg: '#3b0764', text: '#c084fc' },
  blue: { name: 'blue', bg: '#1e3a8a', text: '#60a5fa' },
  amber: { name: 'amber', bg: '#451a03', text: '#fbbf24' },
  rose: { name: 'rose', bg: '#4c0519', text: '#fb7185' },
  cyan: { name: 'cyan', bg: '#083344', text: '#22d3ee' }
};

const PALETTE_KEYS = Object.keys(COLOR_PALETTE);
const EMOJI_OPTIONS = ['📌', '📝', '🎯', '⚡', '🚀', '💡', '🔥', '⭐', '🎨', '📚', '💻', '✅'];

function getTaskColor(task) {
  if (!task) return COLOR_PALETTE.emerald;
  if (task.color && COLOR_PALETTE[task.color]) {
    return COLOR_PALETTE[task.color];
  }
  let hash = 0;
  for (let i = 0; i < task.id.length; i++) {
    hash = task.id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETTE_KEYS.length;
  return COLOR_PALETTE[PALETTE_KEYS[index]];
}

export default {
  render() {
    return `
      <div class="module-header">
        <h2>Notas Rápidas</h2>
        <p class="text-muted">Anotações vinculadas a tarefas organizadas em colunas Kanban.</p>
      </div>

      <div class="app-card" style="margin-bottom: var(--space-6);">
        <textarea id="note-input" class="task-input" placeholder="Escreva sua anotação..." style="min-height: 90px; padding-top: var(--space-3); resize: vertical; margin-bottom: var(--space-3);"></textarea>
        
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-3);">
          <div style="display: flex; align-items: center; gap: var(--space-2); min-width: 240px; flex: 1;">
            <label for="note-task-select" style="font-size: var(--fs-xs); font-weight: 600; color: var(--clr-text-muted); white-space: nowrap;">Vincular à tarefa:</label>
            <select id="note-task-select" class="task-input" style="padding: var(--space-1) var(--space-2); font-size: var(--fs-xs);">
              <option value="">📌 Nenhuma tarefa (Nota Geral)</option>
              <!-- preenchido via js -->
            </select>
          </div>

          <div style="display: flex; align-items: center; gap: var(--space-3);">
            <span id="save-status" class="text-muted" style="font-size: var(--fs-xs);"></span>
            <button id="btn-add-note" class="btn btn-primary"><i data-lucide="plus"></i> Nova Nota</button>
          </div>
        </div>
      </div>

      <div id="kanban-board-container" class="kanban-board">
        <!-- Renderizado em colunas Kanban via JS -->
      </div>
    `;
  },

  init() {
    this.noteInput = document.getElementById('note-input');
    this.noteTaskSelect = document.getElementById('note-task-select');
    this.btnAddNote = document.getElementById('btn-add-note');
    this.kanbanBoardContainer = document.getElementById('kanban-board-container');
    this.saveStatus = document.getElementById('save-status');

    this.currentNoteId = null;
    this.activeEmojiPickerTaskId = null;

    this.populateTasks();
    this.bindEvents();
    this.initKanbanScrollDrag();
    this.renderNotes();
  },

  populateTasks() {
    if (!this.noteTaskSelect) return;
    const tasks = taskRepository.getAll().sort((a, b) => (a.order || 0) - (b.order || 0));
    const options = tasks.map(t => {
      const shortTitle = t.title.length > 20 ? t.title.substring(0, 18) + '...' : t.title;
      const emoji = t.emoji || '📌';
      return `<option value="${t.id}">${t.completed ? '✓ ' : ''}${emoji} ${shortTitle}</option>`;
    }).join('');
    this.noteTaskSelect.innerHTML = `<option value="">📌 Nenhuma tarefa (Nota Geral)</option>${options}`;
  },

  bindEvents() {
    this.noteInput.addEventListener('input', () => {
      this.saveStatus.textContent = 'Salvando...';
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => this.saveCurrentNote(), 500);
    });

    this.noteTaskSelect.addEventListener('change', () => {
      this.saveStatus.textContent = 'Salvando...';
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => this.saveCurrentNote(), 300);
    });

    this.btnAddNote.addEventListener('click', () => {
      this.saveCurrentNote();
      this.currentNoteId = null;
      this.noteInput.value = '';
      this.noteTaskSelect.value = '';
      this.noteInput.focus();
      this.saveStatus.textContent = '';
    });

    // Fecha o emoji picker ao clicar fora
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.btn-emoji-picker') && !e.target.closest('.emoji-popover')) {
        const popover = document.querySelector('.emoji-popover');
        if (popover) popover.remove();
        this.activeEmojiPickerTaskId = null;
      }
    });
  },

  initKanbanScrollDrag() {
    const container = this.kanbanBoardContainer;
    if (!container) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener('mousedown', (e) => {
      if (
        e.target.closest('.note-card') ||
        e.target.closest('.btn-emoji-picker') ||
        e.target.closest('.btn-color-dot') ||
        e.target.closest('.btn-action') ||
        e.target.closest('.column-drag-handle') ||
        e.target.closest('.drag-handle') ||
        e.target.closest('button') ||
        e.target.closest('input') ||
        e.target.closest('select')
      ) {
        return;
      }

      isDown = true;
      container.classList.add('active-drag-scroll');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
      isDown = false;
      container.classList.remove('active-drag-scroll');
    });

    container.addEventListener('mouseup', () => {
      isDown = false;
      container.classList.remove('active-drag-scroll');
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    });
  },

  saveCurrentNote() {
    const content = this.noteInput.value.trim();
    const taskId = this.noteTaskSelect.value || null;

    if (!content) {
      this.saveStatus.textContent = '';
      return;
    }

    if (this.currentNoteId) {
      noteRepository.update(this.currentNoteId, { content, taskId });
    } else {
      const newNote = noteRepository.create(content, false, taskId);
      this.currentNoteId = newNote.id;
    }
    
    this.saveStatus.textContent = 'Salvo!';
    this.renderNotes();
  },

  renderNotes() {
    // 1. Limpeza de notas órfãs (cujo taskId foi excluído do taskRepository)
    const rawNotes = noteRepository.getAll();
    const validNotes = [];
    rawNotes.forEach(n => {
      if (n.taskId && !taskRepository.getById(n.taskId)) {
        noteRepository.delete(n.id);
      } else {
        validNotes.push(n);
      }
    });

    // Sort: Pinned no topo, novas no fim
    validNotes.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return (a.order || 0) - (b.order || 0);
    });

    this.kanbanBoardContainer.innerHTML = '';

    if (validNotes.length === 0) {
      this.kanbanBoardContainer.innerHTML = '<p class="text-muted" style="grid-column: 1/-1; text-align: center; padding: 2rem;">Nenhuma nota criada ainda.</p>';
      return;
    }

    // 2. Organizar notas por tarefas ordenadas
    const allTasks = taskRepository.getAll().sort((a, b) => (a.order || 0) - (b.order || 0));
    const groups = new Map();
    
    // Coluna "none" (Notas Gerais) vem primeiro
    groups.set('none', { taskId: null, notes: [] });

    // Preenche colunas para tarefas existentes em ordem de tarefas
    allTasks.forEach(task => {
      groups.set(task.id, { taskId: task.id, notes: [] });
    });

    // Distribui as notas nas colunas
    validNotes.forEach(note => {
      const key = note.taskId || 'none';
      if (groups.has(key)) {
        groups.get(key).notes.push(note);
      }
    });

    // Renderiza cada coluna Kanban
    groups.forEach((group, groupKey) => {
      if (group.notes.length === 0 && groupKey !== 'none') return;

      const columnEl = document.createElement('div');
      columnEl.className = 'kanban-column';
      columnEl.dataset.taskId = groupKey;

      let columnTitle = 'Notas Gerais';
      let fullTaskTitle = 'Notas Gerais';
      let statusTextHtml = '<span style="font-size: 11px; font-weight: 600; color: var(--clr-text-muted);">📌 Geral</span>';
      let colorStyle = COLOR_PALETTE.emerald;
      let taskEmoji = '📌';
      let isTaskCompleted = false;

      if (group.taskId) {
        const task = taskRepository.getById(group.taskId);
        if (task) {
          colorStyle = getTaskColor(task);
          taskEmoji = task.emoji || '📌';
          isTaskCompleted = !!task.completed;
          fullTaskTitle = task.title;

          // Truncamento rígido do título da coluna (máximo 12 caracteres)
          const shortTaskTitle = task.title.length > 14 ? task.title.substring(0, 12) + '...' : task.title;
          columnTitle = this.escapeHtml(shortTaskTitle);

          statusTextHtml = `
            <span style="font-size: 11px; font-weight: 600; color: ${colorStyle.text}; display: inline-flex; align-items: center; gap: 4px;">
              <i data-lucide="${isTaskCompleted ? 'check-circle-2' : 'clock'}" style="width:12px; height:12px;"></i> ${isTaskCompleted ? 'Concluída' : 'Pendente'}
            </span>
          `;
        }
      }

      const columnTitleStyle = isTaskCompleted 
        ? 'text-decoration: line-through; opacity: 0.7; color: var(--clr-text-primary);' 
        : 'color: var(--clr-text-primary);';

      let colorBarHtml = '';
      if (group.taskId) {
        const activeColor = getTaskColor(taskRepository.getById(group.taskId)).name;
        colorBarHtml = `
          <div style="display: flex; gap: 6px; margin-top: var(--space-2); align-items: center; padding-top: var(--space-2); border-top: 1px dashed var(--clr-border);">
            <span style="font-size: 10px; color: var(--clr-text-muted); font-weight: 600;">Cor:</span>
            ${PALETTE_KEYS.map(k => {
              const c = COLOR_PALETTE[k];
              const isSelected = activeColor === k;
              return `
                <button class="btn-color-dot" data-task-id="${group.taskId}" data-color="${k}" title="Mudar cor para ${k}" 
                        style="background: ${c.text}; width: 14px; height: 14px; border-radius: 50%; border: ${isSelected ? '2px solid var(--clr-text-primary)' : 'none'}; cursor: pointer; padding: 0;">
                </button>
              `;
            }).join('')}
          </div>
        `;
      }

      // Repartição separada no cabeçalho: Status na linha superior, Título na linha inferior
      columnEl.innerHTML = `
        <div class="kanban-column-header">
          <div style="display: flex; flex-direction: column; width: 100%; gap: var(--space-2);">
            
            <!-- Linha Superior Separada: Status & Contagem de Notas -->
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
              ${statusTextHtml}
              <span style="font-size: 10px; color: var(--clr-text-muted); font-weight: 700; background: var(--clr-bg-item); padding: 1px 7px; border-radius: var(--radius-full); border: 1px solid var(--clr-border);">
                ${group.notes.length} ${group.notes.length === 1 ? 'nota' : 'notas'}
              </span>
            </div>

            <!-- Linha Inferior: Emoji + Título Principal da Coluna -->
            <div style="display: flex; align-items: center; width: 100%;">
              <div class="kanban-column-title">
                ${group.taskId ? `
                  <span class="column-drag-handle" title="Arraste a coluna para reordenar">
                    <i data-lucide="grip-vertical" style="width: 14px; height: 14px;"></i>
                  </span>
                  <div style="position: relative; display: inline-block;">
                    <button class="btn-emoji-picker" data-task-id="${group.taskId}" title="Clique para mudar o emoji (estilo Notion)">
                      ${taskEmoji}
                    </button>
                  </div>
                ` : `<span style="font-size: 16px; margin-right: 4px;">📌</span>`}
                <span style="${columnTitleStyle}" title="${this.escapeHtml(fullTaskTitle)}">${columnTitle}</span>
              </div>
            </div>

            ${colorBarHtml}
          </div>
        </div>

        <div class="kanban-notes-list" data-task-id="${groupKey}"></div>
      `;

      const listContainer = columnEl.querySelector('.kanban-notes-list');

      if (group.notes.length === 0) {
        listContainer.innerHTML = '<p class="text-muted" style="font-size: var(--fs-xs); padding: var(--space-2) 0;">Nenhuma nota geral.</p>';
      }

      group.notes.forEach(note => {
        const linkedTask = note.taskId ? taskRepository.getById(note.taskId) : null;
        const isNoteTaskCompleted = linkedTask ? linkedTask.completed : false;

        const card = document.createElement('div');
        card.className = `note-card task-item ${isNoteTaskCompleted ? 'completed-note' : ''}`;
        card.dataset.id = note.id;
        card.dataset.pinned = note.pinned ? 'true' : 'false';
        
        if (isNoteTaskCompleted) {
          card.style.opacity = '0.65';
        }
        if (note.pinned) {
          card.style.borderColor = 'var(--clr-accent)';
        }

        if (note.id === this.currentNoteId) {
          card.style.boxShadow = '0 0 0 2px var(--clr-accent-subtle)';
        }

        let tagHtml = '';
        if (linkedTask) {
          const color = getTaskColor(linkedTask);
          const shortTagTitle = linkedTask.title.length > 14 ? linkedTask.title.substring(0, 12) + '...' : linkedTask.title;
          
          // Tag sem emoji e sem borda (badge escura e limpa)
          tagHtml = `
            <span style="font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 6px; background: ${color.bg}; color: ${color.text}; border: none; max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${isNoteTaskCompleted ? '✓ ' : ''}${this.escapeHtml(shortTagTitle)}
            </span>
          `;
        }

        const noteTextStyle = isNoteTaskCompleted ? 'text-decoration: line-through; color: var(--clr-text-muted);' : '';
        const trimmedContent = note.content.trim();

        card.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-1); gap: var(--space-2);">
            <div>
              ${!note.pinned ? '<span class="drag-handle" title="Arraste para reordenar a nota" style="opacity: 1; margin: -2px 0 0 -2px;"><i data-lucide="grip-vertical"></i></span>' : '<span style="color: var(--clr-accent);"><i data-lucide="pin"></i></span>'}
            </div>
            ${tagHtml}
          </div>

          <div class="note-card-content" style="${noteTextStyle}">${this.escapeHtml(trimmedContent)}</div>

          <div style="display: flex; gap: var(--space-2); flex-wrap: wrap; margin-top: auto; padding-top: var(--space-2); border-top: 1px solid var(--clr-border);">
            <button class="btn-icon btn-action" data-action="copy" title="Copiar"><i data-lucide="copy"></i></button>
            <button class="btn-icon btn-action" data-action="pin" title="${note.pinned ? 'Desafixar' : 'Fixar no topo'}" style="color: ${note.pinned ? 'var(--clr-accent)' : ''}"><i data-lucide="pin"></i></button>
            <div style="flex: 1;"></div>
            <button class="btn-icon btn-action" data-action="delete" title="Excluir" style="color: var(--clr-danger);"><i data-lucide="trash-2"></i></button>
          </div>
        `;

        card.addEventListener('click', (e) => {
          if (e.target.closest('.btn-action') || e.target.closest('.drag-handle')) return;
          this.saveCurrentNote(); 
          this.currentNoteId = note.id;
          this.noteInput.value = note.content;
          this.noteTaskSelect.value = note.taskId || '';
          this.saveStatus.textContent = '';
          this.renderNotes();
        });

        card.querySelector('[data-action="copy"]').addEventListener('click', (e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(note.content);
        });

        card.querySelector('[data-action="pin"]').addEventListener('click', (e) => {
          e.stopPropagation();
          noteRepository.togglePin(note.id);
          this.renderNotes();
        });

        card.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm('Excluir esta nota?')) {
            noteRepository.delete(note.id);
            if (this.currentNoteId === note.id) {
              this.currentNoteId = null;
              this.noteInput.value = '';
              this.noteTaskSelect.value = '';
            }
            this.renderNotes();
          }
        });

        listContainer.appendChild(card);

        // Pointer Drag para Cards de Notas
        if (!note.pinned) {
          this.initPointerDragForNoteCard(card, note.id);
        }
      });

      // Eventos das Cores
      columnEl.querySelectorAll('.btn-color-dot').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const tId = e.currentTarget.dataset.taskId;
          const colorName = e.currentTarget.dataset.color;
          taskRepository.update(tId, { color: colorName });
          this.renderNotes();
        });
      });

      // Eventos do Emoji Picker
      const btnEmoji = columnEl.querySelector('.btn-emoji-picker');
      if (btnEmoji) {
        btnEmoji.addEventListener('click', (e) => {
          e.stopPropagation();
          const tId = e.currentTarget.dataset.taskId;
          this.toggleEmojiPicker(btnEmoji, tId);
        });
      }

      this.kanbanBoardContainer.appendChild(columnEl);

      // Pointer Drag para Colunas Kanban
      if (group.taskId) {
        this.initPointerDragForColumn(columnEl, group.taskId);
      }
    });

    if (window.lucide) window.lucide.createIcons();
  },

  toggleEmojiPicker(targetBtn, taskId) {
    const existingPopover = document.querySelector('.emoji-popover');
    if (existingPopover) existingPopover.remove();

    if (this.activeEmojiPickerTaskId === taskId) {
      this.activeEmojiPickerTaskId = null;
      return;
    }

    this.activeEmojiPickerTaskId = taskId;

    const popover = document.createElement('div');
    popover.className = 'emoji-popover';
    popover.innerHTML = EMOJI_OPTIONS.map(emoji => `
      <button class="emoji-option" data-emoji="${emoji}">${emoji}</button>
    `).join('');

    targetBtn.parentElement.appendChild(popover);

    popover.querySelectorAll('.emoji-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedEmoji = e.currentTarget.dataset.emoji;
        taskRepository.update(taskId, { emoji: selectedEmoji });
        popover.remove();
        this.activeEmojiPickerTaskId = null;
        this.populateTasks();
        this.renderNotes();
      });
    });
  },

  // Pointer Drag para Colunas Kanban (Transição suave de troca sem cintilação)
  initPointerDragForColumn(columnEl, taskId) {
    const handle = columnEl.querySelector('.column-drag-handle');
    if (!handle) return;

    handle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();

      const container = this.kanbanBoardContainer;
      const allCols = Array.from(container.children);

      const draggableCols = allCols.filter(c => c.dataset.taskId && c.dataset.taskId !== 'none');
      const currentIndex = draggableCols.indexOf(columnEl);
      if (currentIndex === -1) return;

      const colPositions = draggableCols.map(c => {
        const rect = c.getBoundingClientRect();
        return {
          el: c,
          width: rect.width,
          left: rect.left,
          centerX: rect.left + rect.width / 2
        };
      });

      const draggedColInfo = colPositions[currentIndex];
      const startMouseX = e.clientX;
      const gap = 20;
      const shiftOffset = draggedColInfo.width + gap;

      columnEl.classList.add('column-dragging');
      document.body.classList.add('is-dragging-item');

      let newTargetIndex = currentIndex;

      const onMouseMove = (moveEvent) => {
        moveEvent.preventDefault();
        const deltaX = moveEvent.clientX - startMouseX;
        columnEl.style.transform = `translate3d(${deltaX}px, 0, 0)`;

        const currentCenterX = draggedColInfo.centerX + deltaX;
        let targetIdx = currentIndex;

        if (deltaX > 0) {
          for (let i = currentIndex + 1; i < colPositions.length; i++) {
            const sib = colPositions[i];
            if (currentCenterX > sib.left + sib.width * 0.2) {
              targetIdx = i;
            } else {
              break;
            }
          }
        } else if (deltaX < 0) {
          for (let i = currentIndex - 1; i >= 0; i--) {
            const sib = colPositions[i];
            if (currentCenterX < sib.left + sib.width * 0.8) {
              targetIdx = i;
            } else {
              break;
            }
          }
        }

        newTargetIndex = targetIdx;

        draggableCols.forEach((col, idx) => {
          if (col === columnEl) return;

          if (currentIndex < newTargetIndex) {
            if (idx > currentIndex && idx <= newTargetIndex) {
              col.style.transform = `translate3d(-${shiftOffset}px, 0, 0)`;
            } else {
              col.style.transform = '';
            }
          } else if (currentIndex > newTargetIndex) {
            if (idx >= newTargetIndex && idx < currentIndex) {
              col.style.transform = `translate3d(${shiftOffset}px, 0, 0)`;
            } else {
              col.style.transform = '';
            }
          } else {
            col.style.transform = '';
          }
        });
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        columnEl.classList.remove('column-dragging');
        document.body.classList.remove('is-dragging-item');

        if (newTargetIndex !== currentIndex) {
          draggableCols.forEach(c => {
            c.style.transition = 'none';
          });

          const targetCol = draggableCols[newTargetIndex];
          if (newTargetIndex > currentIndex) {
            container.insertBefore(columnEl, targetCol.nextSibling);
          } else {
            container.insertBefore(columnEl, targetCol);
          }

          draggableCols.forEach(c => {
            c.style.transform = '';
          });

          void container.offsetHeight;

          draggableCols.forEach(c => {
            c.style.transition = '';
          });

          const finalColumns = Array.from(container.children);
          let orderIndex = 0;
          finalColumns.forEach(col => {
            const tId = col.dataset.taskId;
            if (tId && tId !== 'none') {
              taskRepository.update(tId, { order: orderIndex++ });
            }
          });
        } else {
          draggableCols.forEach(c => {
            c.style.transform = '';
          });
        }
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  },

  // Pointer Drag para Cartões de Notas (Bloqueia cartões fixados)
  initPointerDragForNoteCard(card, noteId) {
    if (card.dataset.pinned === 'true') return;

    card.addEventListener('mousedown', (e) => {
      if (card.dataset.pinned === 'true') return;

      const handle = e.target.closest('.drag-handle');
      if (!handle) return;

      e.stopPropagation();
      e.preventDefault();

      const listContainer = card.closest('.kanban-notes-list');
      if (!listContainer) return;

      const allCards = Array.from(listContainer.children);
      // Filtra APENAS cartões não-fixados (cartões fixados ficam 100% congelados no topo)
      const draggableCards = allCards.filter(c => c.dataset.pinned !== 'true');
      const currentIndex = draggableCards.indexOf(card);
      if (currentIndex === -1) return;

      const cardPositions = draggableCards.map((c) => {
        const rect = c.getBoundingClientRect();
        return {
          el: c,
          height: rect.height,
          top: rect.top,
          centerY: rect.top + rect.height / 2
        };
      });

      const draggedCardInfo = cardPositions[currentIndex];
      const startMouseY = e.clientY;
      const gap = 12;
      const shiftOffset = draggedCardInfo.height + gap;

      card.classList.add('dragging');
      document.body.classList.add('is-dragging-item');

      let newTargetIndex = currentIndex;

      const onMouseMove = (moveEvent) => {
        moveEvent.preventDefault();
        const deltaY = moveEvent.clientY - startMouseY;
        card.style.transform = `translate3d(0, ${deltaY}px, 0)`;

        const currentCenterY = draggedCardInfo.centerY + deltaY;
        let targetIdx = currentIndex;

        if (deltaY > 0) {
          for (let i = currentIndex + 1; i < cardPositions.length; i++) {
            const sib = cardPositions[i];
            if (currentCenterY > sib.top + sib.height * 0.2) {
              targetIdx = i;
            } else {
              break;
            }
          }
        } else if (deltaY < 0) {
          for (let i = currentIndex - 1; i >= 0; i--) {
            const sib = cardPositions[i];
            if (currentCenterY < sib.top + sib.height * 0.8) {
              targetIdx = i;
            } else {
              break;
            }
          }
        }

        newTargetIndex = targetIdx;

        draggableCards.forEach((c, idx) => {
          if (c === card) return;

          if (currentIndex < newTargetIndex) {
            if (idx > currentIndex && idx <= newTargetIndex) {
              c.style.transform = `translate3d(0, -${shiftOffset}px, 0)`;
            } else {
              c.style.transform = '';
            }
          } else if (currentIndex > newTargetIndex) {
            if (idx >= newTargetIndex && idx < currentIndex) {
              c.style.transform = `translate3d(0, ${shiftOffset}px, 0)`;
            } else {
              c.style.transform = '';
            }
          } else {
            c.style.transform = '';
          }
        });
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        card.classList.remove('dragging');
        document.body.classList.remove('is-dragging-item');

        if (newTargetIndex !== currentIndex) {
          draggableCards.forEach(c => {
            c.style.transition = 'none';
          });

          const targetCard = draggableCards[newTargetIndex];
          if (newTargetIndex > currentIndex) {
            listContainer.insertBefore(card, targetCard.nextSibling);
          } else {
            listContainer.insertBefore(card, targetCard);
          }

          draggableCards.forEach(c => {
            c.style.transform = '';
          });

          void listContainer.offsetHeight;

          draggableCards.forEach(c => {
            c.style.transition = '';
          });

          // Persiste a nova ordem de notas no noteRepository
          const allContainers = this.kanbanBoardContainer.querySelectorAll('.kanban-notes-list');
          let orderIndex = 1;
          allContainers.forEach(container => {
            Array.from(container.children).forEach(c => {
              const id = c.dataset.id;
              if (id) {
                noteRepository.update(id, { order: orderIndex++ });
              }
            });
          });
        } else {
          draggableCards.forEach(c => {
            c.style.transform = '';
          });
        }
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  },

  escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  },

  destroy() {
    this.saveCurrentNote(); 
  }
};
