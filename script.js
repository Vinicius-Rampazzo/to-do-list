/**
 * ToDo List ImobiBrasil — script.js
 * Arquitetura baseada em estado (array de objetos).
 * Autosave via localStorage a cada mutação.
 */

// ============================================================
// ESTADO DA APLICAÇÃO
// ============================================================

/** @typedef {{ id: string, text: string, completed: boolean }} Task */

/** @type {Task[]} */
let tasks = [];

/** ID da tarefa sendo arrastada no drag & drop */
let dragSourceId = null;

// ============================================================
// REFERÊNCIAS DO DOM
// ============================================================

const inputNovaTarefa = document.getElementById('input-nova-tarefa');
const btnAdicionar    = document.getElementById('btn-adicionar');
const listaTarefas    = document.getElementById('lista-tarefas');
const emptyState      = document.getElementById('empty-state');

const countPending = document.getElementById('count-pending');
const countDone    = document.getElementById('count-done');

const btnRemoverFinalizados  = document.getElementById('btn-remover-finalizados');
const btnRemoverSelecionados = document.getElementById('btn-remover-selecionado');
const btnApagarTudo          = document.getElementById('btn-apagar-tudo');

// ============================================================
// PERSISTÊNCIA — localStorage
// ============================================================

const STORAGE_KEY = 'imobi-todo-tasks';

/**
 * Carrega tarefas do localStorage.
 * @returns {Task[]}
 */
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Salva o estado atual no localStorage.
 */
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ============================================================
// UTILITÁRIOS
// ============================================================

/**
 * Gera um ID único simples.
 * @returns {string}
 */
function generateId() {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Aplica a classe de bump no contador para animar o número.
 * @param {HTMLElement} el
 */
function bumpCounter(el) {
  el.classList.remove('bump');
  // Re-trigger da animação via reflow
  void el.offsetWidth;
  el.classList.add('bump');
  setTimeout(() => el.classList.remove('bump'), 400);
}

// ============================================================
// RENDER — CONTADORES
// ============================================================

function updateCounters() {
  const pending = tasks.filter((t) => !t.completed).length;
  const done    = tasks.filter((t) => t.completed).length;

  if (countPending.textContent !== String(pending)) {
    countPending.textContent = pending;
    bumpCounter(countPending);
  }

  if (countDone.textContent !== String(done)) {
    countDone.textContent = done;
    bumpCounter(countDone);
  }
}

// ============================================================
// RENDER — EMPTY STATE
// ============================================================

function updateEmptyState() {
  if (tasks.length === 0) {
    emptyState.removeAttribute('hidden');
  } else {
    emptyState.setAttribute('hidden', '');
  }
}

// ============================================================
// RENDER — ITEM DE TAREFA
// ============================================================

/**
 * Cria o elemento <li> de uma tarefa.
 * @param {Task} task
 * @param {number} index
 * @returns {HTMLLIElement}
 */
function createTaskElement(task, index) {
  const li = document.createElement('li');
  li.className = 'task-item';
  li.setAttribute('data-id', task.id);
  li.setAttribute('draggable', 'true');
  li.setAttribute('role', 'listitem');

  if (task.completed) li.classList.add('completed');

  li.innerHTML = `
    <span class="drag-handle" aria-hidden="true" title="Arraste para reordenar">
      <i data-lucide="grip-vertical"></i>
    </span>
    <span class="task-num" aria-hidden="true">${index + 1}</span>
    <span
      class="task-checkbox"
      role="checkbox"
      aria-checked="${task.completed}"
      aria-label="Marcar como concluída"
      tabindex="0"
    ></span>
    <span class="task-text">${escapeHtml(task.text)}</span>
    <button
      class="btn-delete-item"
      aria-label="Remover tarefa: ${escapeHtml(task.text)}"
      data-action="delete"
      title="Remover tarefa"
    ><i data-lucide="x"></i></button>
  `;

  // ── Eventos do item ──

  // Clique simples → selecionar
  li.addEventListener('click', (e) => {
    if (e.target.dataset.action === 'delete') return;
    if (e.target.classList.contains('task-checkbox')) return;
    li.classList.toggle('selected');
  });

  // Duplo clique → concluir/desfazer
  li.addEventListener('dblclick', () => {
    toggleComplete(task.id);
  });

  // Checkbox → concluir
  const checkbox = li.querySelector('.task-checkbox');
  checkbox.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleComplete(task.id);
  });
  checkbox.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleComplete(task.id);
    }
  });

  // Botão de deletar individual
  li.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
    e.stopPropagation();
    removeTaskWithAnimation(task.id);
  });

  // ── Drag & Drop ──
  li.addEventListener('dragstart', onDragStart);
  li.addEventListener('dragenter', onDragEnter);
  li.addEventListener('dragover', onDragOver);
  li.addEventListener('dragleave', onDragLeave);
  li.addEventListener('drop', onDrop);
  li.addEventListener('dragend', onDragEnd);

  return li;
}

/**
 * Escapa HTML para evitar XSS ao renderizar texto do usuário.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================
// RENDER — LISTA COMPLETA
// ============================================================

function renderTasks() {
  listaTarefas.innerHTML = '';

  tasks.forEach((task, index) => {
    const el = createTaskElement(task, index);
    listaTarefas.appendChild(el);
  });

  updateCounters();
  updateEmptyState();

  // Inicializa os ícones Lucide nos elementos recém-criados
  if (window.lucide) {
    lucide.createIcons();
  }
}

// ============================================================
// AÇÕES — CRUD
// ============================================================

/**
 * Adiciona uma nova tarefa ao estado e re-renderiza.
 * @param {string} text
 */
function addTask(text) {
  const trimmed = text.trim();

  if (!trimmed) {
    // Feedback visual de erro no input
    inputNovaTarefa.classList.add('input-error');
    inputNovaTarefa.focus();
    setTimeout(() => inputNovaTarefa.classList.remove('input-error'), 600);
    return;
  }

  /** @type {Task} */
  const newTask = {
    id: generateId(),
    text: trimmed,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  inputNovaTarefa.value = '';
  inputNovaTarefa.focus();
}

/**
 * Alterna o estado de conclusão de uma tarefa pelo ID.
 * @param {string} id
 */
function toggleComplete(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

/**
 * Remove uma tarefa com animação de saída.
 * @param {string} id
 */
function removeTaskWithAnimation(id) {
  const el = listaTarefas.querySelector(`[data-id="${id}"]`);
  if (!el) return;

  el.classList.add('removing');
  el.addEventListener('animationend', () => {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    renderTasks();
  }, { once: true });
}

/**
 * Remove todas as tarefas com a classe `completed`.
 */
function removeCompleted() {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  renderTasks();
}

/**
 * Remove todas as tarefas que estão com a classe `selected` no DOM.
 */
function removeSelected() {
  const selectedEls = listaTarefas.querySelectorAll('.task-item.selected');
  const selectedIds = Array.from(selectedEls).map((el) => el.dataset.id);
  tasks = tasks.filter((t) => !selectedIds.includes(t.id));
  saveTasks();
  renderTasks();
}

/**
 * Apaga todas as tarefas.
 */
function clearAll() {
  tasks = [];
  saveTasks();
  renderTasks();
}

// ============================================================
// DRAG & DROP
// ============================================================

function onDragStart(e) {
  dragSourceId = e.currentTarget.dataset.id;
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', dragSourceId);
}

function onDragEnter(e) {
  e.preventDefault();
  const target = e.currentTarget;
  if (target.dataset.id !== dragSourceId) {
    target.classList.add('drag-over');
  }
}

function onDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function onDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function onDrop(e) {
  e.preventDefault();
  const targetId = e.currentTarget.dataset.id;
  e.currentTarget.classList.remove('drag-over');

  if (!dragSourceId || dragSourceId === targetId) return;

  const fromIndex = tasks.findIndex((t) => t.id === dragSourceId);
  const toIndex   = tasks.findIndex((t) => t.id === targetId);

  if (fromIndex === -1 || toIndex === -1) return;

  // Reordena o array
  const [moved] = tasks.splice(fromIndex, 1);
  tasks.splice(toIndex, 0, moved);

  saveTasks();
  renderTasks();
}

function onDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  // Limpa qualquer drag-over residual
  listaTarefas.querySelectorAll('.drag-over').forEach((el) => {
    el.classList.remove('drag-over');
  });
  dragSourceId = null;
}

// ============================================================
// EVENT LISTENERS — INPUTS E BOTÕES
// ============================================================

btnAdicionar.addEventListener('click', () => {
  addTask(inputNovaTarefa.value);
});

inputNovaTarefa.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTask(inputNovaTarefa.value);
  }
});

btnRemoverFinalizados.addEventListener('click', removeCompleted);
btnRemoverSelecionados.addEventListener('click', removeSelected);
btnApagarTudo.addEventListener('click', clearAll);

// ============================================================
// INICIALIZAÇÃO
// ============================================================

function init() {
  tasks = loadTasks();
  renderTasks();

  // Garante que os ícones estáticos do HTML também sejam renderizados
  if (window.lucide) {
    lucide.createIcons();
  }
}

init();
