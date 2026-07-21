import { noteRepository } from '../../core/noteRepository.js';
import { taskRepository } from '../../core/taskRepository.js';

let saveTimeout = null;
let dragSourceId = null;

export default {
  render() {
    return `
      <div class="module-header">
        <h2>Notas Rápidas</h2>
        <p class="text-muted">Anotações temporárias durante o trabalho.</p>
      </div>

      <div class="app-card" style="margin-bottom: var(--space-6);">
        <textarea id="note-input" class="task-input" placeholder="Escreva algo e será salvo automaticamente..." style="min-height: 100px; padding-top: var(--space-3); resize: vertical;"></textarea>
        <div style="display: flex; justify-content: flex-end; margin-top: var(--space-3);">
          <span id="save-status" class="text-muted" style="font-size: var(--fs-xs); align-self: center; margin-right: var(--space-4);"></span>
          <button id="btn-add-note" class="btn btn-primary"><i data-lucide="plus"></i> Nova Nota</button>
        </div>
      </div>

      <div style="margin-bottom: var(--space-4);">
        <input type="text" id="search-note" class="task-input" placeholder="Buscar notas..." style="padding-left: var(--space-3);" />
      </div>

      <div id="notes-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-4);">
        <!-- render via js -->
      </div>
    `;
  },

  init() {
    this.noteInput = document.getElementById('note-input');
    this.btnAddNote = document.getElementById('btn-add-note');
    this.searchNote = document.getElementById('search-note');
    this.notesList = document.getElementById('notes-list');
    this.saveStatus = document.getElementById('save-status');

    this.currentNoteId = null;

    this.bindEvents();
    this.renderNotes();
  },

  bindEvents() {
    this.noteInput.addEventListener('input', () => {
      this.saveStatus.textContent = 'Salvando...';
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => this.saveCurrentNote(), 500);
    });

    this.btnAddNote.addEventListener('click', () => {
      this.saveCurrentNote();
      this.currentNoteId = null;
      this.noteInput.value = '';
      this.noteInput.focus();
      this.saveStatus.textContent = '';
    });

    this.searchNote.addEventListener('input', () => {
      this.renderNotes(this.searchNote.value);
    });
  },

  saveCurrentNote() {
    const content = this.noteInput.value.trim();
    if (!content) {
      this.saveStatus.textContent = '';
      return;
    }

    if (this.currentNoteId) {
      noteRepository.update(this.currentNoteId, { content });
    } else {
      const newNote = noteRepository.create(content);
      this.currentNoteId = newNote.id;
    }
    
    this.saveStatus.textContent = 'Salvo!';
    this.renderNotes(this.searchNote.value);
  },

  renderNotes(query = '') {
    const notes = noteRepository.search(query).sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned ? -1 : 1;
      return (a.order || 0) - (b.order || 0);
    });

    this.notesList.innerHTML = '';

    if (notes.length === 0 && !query) {
      this.notesList.innerHTML = '<p class="text-muted" style="grid-column: 1/-1; text-align: center; padding: 2rem;">Nenhuma nota criada ainda.</p>';
      return;
    }

    notes.forEach(note => {
      const div = document.createElement('div');
      div.className = 'app-card task-item'; // using task-item for styles
      div.dataset.id = note.id;
      div.style.cssText = `padding: var(--space-4); position: relative; cursor: pointer; display: flex; flex-direction: column;`;
      
      if (note.pinned) {
        div.style.borderColor = 'var(--clr-accent)';
      } else {
        div.setAttribute('draggable', 'true');
      }

      if (note.id === this.currentNoteId) {
        div.style.boxShadow = '0 0 0 2px var(--clr-accent-subtle)';
      }

      div.innerHTML = `
        <div style="display: flex; gap: var(--space-2); margin-bottom: var(--space-3);">
          ${!note.pinned ? '<span class="drag-handle" style="opacity: 1; margin: -5px 0 0 -5px;"><i data-lucide="grip-vertical"></i></span>' : '<span style="color: var(--clr-accent);"><i data-lucide="pin"></i></span>'}
        </div>
        <div style="white-space: pre-wrap; font-size: var(--fs-sm); margin-bottom: var(--space-4); max-height: 150px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 6; -webkit-box-orient: vertical;">${this.escapeHtml(note.content)}</div>
        
        <div style="display: flex; gap: var(--space-2); flex-wrap: wrap; margin-top: auto; padding-top: var(--space-3); border-top: 1px solid var(--clr-border);">
          <button class="btn-icon btn-action" data-action="copy" title="Copiar"><i data-lucide="copy"></i></button>
          <button class="btn-icon btn-action" data-action="task" title="Transformar em Tarefa"><i data-lucide="check-square"></i></button>
          <button class="btn-icon btn-action" data-action="pin" title="${note.pinned ? 'Desafixar' : 'Fixar'}" style="color: ${note.pinned ? 'var(--clr-accent)' : ''}"><i data-lucide="pin"></i></button>
          <div style="flex: 1;"></div>
          <button class="btn-icon btn-action" data-action="delete" title="Excluir" style="color: var(--clr-danger);"><i data-lucide="trash-2"></i></button>
        </div>
      `;

      div.addEventListener('click', (e) => {
        if (e.target.closest('.btn-action') || e.target.closest('.drag-handle')) return;
        this.saveCurrentNote(); 
        this.currentNoteId = note.id;
        this.noteInput.value = note.content;
        this.saveStatus.textContent = '';
        this.renderNotes(this.searchNote.value);
      });

      // Ações
      div.querySelector('[data-action="copy"]').addEventListener('click', (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(note.content);
      });

      div.querySelector('[data-action="task"]').addEventListener('click', (e) => {
        e.stopPropagation();
        const lines = note.content.split('\n');
        const title = lines[0].substring(0, 100);
        taskRepository.create({ title, description: note.content });
        alert('Tarefa criada com sucesso!');
      });

      div.querySelector('[data-action="pin"]').addEventListener('click', (e) => {
        e.stopPropagation();
        noteRepository.togglePin(note.id);
        this.renderNotes(this.searchNote.value);
      });

      div.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Excluir esta nota?')) {
          noteRepository.delete(note.id);
          if (this.currentNoteId === note.id) {
            this.currentNoteId = null;
            this.noteInput.value = '';
          }
          this.renderNotes(this.searchNote.value);
        }
      });

      if (!note.pinned && !query) {
        div.addEventListener('dragstart', this.onDragStart.bind(this));
        div.addEventListener('dragenter', this.onDragEnter.bind(this));
        div.addEventListener('dragover', this.onDragOver.bind(this));
        div.addEventListener('dragleave', this.onDragLeave.bind(this));
        div.addEventListener('drop', this.onDrop.bind(this));
        div.addEventListener('dragend', this.onDragEnd.bind(this));
      }

      this.notesList.appendChild(div);
    });

    if (window.lucide) window.lucide.createIcons();
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

    noteRepository.reorder(dragSourceId, targetId);
    this.renderNotes(this.searchNote.value);
  },

  onDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
    this.notesList.querySelectorAll('.drag-over').forEach(el => {
      el.classList.remove('drag-over');
    });
    dragSourceId = null;
  },

  escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  },

  destroy() {
    this.saveCurrentNote(); 
  }
};
