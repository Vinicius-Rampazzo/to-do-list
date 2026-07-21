import { storageService } from './storageService.js';

const TASKS_KEY = 'wb-tasks';
const LEGACY_KEY = 'imobi-todo-tasks';

function generateId() {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const taskRepository = {
  migrateLegacyTasks() {
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (!legacy) return;

    try {
      const oldTasks = JSON.parse(legacy);
      const newTasks = oldTasks.map((t, i) => ({
        id: t.id || generateId(),
        title: t.text || 'Tarefa sem título',
        description: '',
        completed: !!t.completed,
        priority: 'medium',
        category: '',
        dueDate: null,
        createdAt: new Date().toISOString(),
        completedAt: t.completed ? new Date().toISOString() : null,
        order: i,
        totalTimeSeconds: 0
      }));

      // Salva no novo formato se ainda não existirem tarefas na nova chave
      const currentTasks = storageService.get(TASKS_KEY);
      if (!currentTasks) {
        storageService.set(TASKS_KEY, newTasks);
      }
      
      // Limpa a chave antiga para não migrar novamente
      localStorage.removeItem(LEGACY_KEY);
    } catch (e) {
      console.error('Erro ao migrar tarefas antigas:', e);
    }
  },

  getAll() {
    return storageService.get(TASKS_KEY, []);
  },

  getById(id) {
    const tasks = this.getAll();
    return tasks.find(t => t.id === id) || null;
  },

  getPending() {
    return this.getAll().filter(t => !t.completed);
  },

  getCompleted() {
    return this.getAll().filter(t => t.completed);
  },

  getCompletedToday() {
    const today = new Date().toISOString().split('T')[0];
    return this.getCompleted().filter(t => {
      if (!t.completedAt) return false;
      return t.completedAt.split('T')[0] === today;
    });
  },

  create(taskData) {
    const tasks = this.getAll();
    const newTask = {
      id: generateId(),
      title: taskData.title,
      description: taskData.description || '',
      completed: false,
      priority: taskData.priority || 'medium',
      category: taskData.category || '',
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      order: tasks.length > 0 ? Math.max(...tasks.map(t => t.order)) + 1 : 0,
      totalTimeSeconds: 0,
      ...taskData
    };
    
    tasks.push(newTask);
    storageService.set(TASKS_KEY, tasks);
    return newTask;
  },

  update(id, changes) {
    const tasks = this.getAll();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    if (changes.completed !== undefined && changes.completed !== tasks[index].completed) {
      if (changes.completed) {
        changes.completedAt = new Date().toISOString();
      } else {
        changes.completedAt = null;
      }
    }

    tasks[index] = { ...tasks[index], ...changes };
    storageService.set(TASKS_KEY, tasks);
    return tasks[index];
  },

  delete(id) {
    let tasks = this.getAll();
    tasks = tasks.filter(t => t.id !== id);
    storageService.set(TASKS_KEY, tasks);
  },

  reorder(movedId, targetId) {
    const tasks = this.getAll();
    const fromIndex = tasks.findIndex(t => t.id === movedId);
    const toIndex = tasks.findIndex(t => t.id === targetId);

    if (fromIndex === -1 || toIndex === -1) return;

    const [moved] = tasks.splice(fromIndex, 1);
    tasks.splice(toIndex, 0, moved);

    // Atualiza campo 'order' para persistir a nova ordem
    tasks.forEach((t, i) => t.order = i);
    storageService.set(TASKS_KEY, tasks);
  },

  addTime(id, seconds) {
    const tasks = this.getAll();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    tasks[index].totalTimeSeconds = (tasks[index].totalTimeSeconds || 0) + seconds;
    storageService.set(TASKS_KEY, tasks);
    return tasks[index];
  }
};
