import { storageService } from './storageService.js';

const NOTES_KEY = 'wb-notes';

function generateId() {
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const noteRepository = {
  getAll() {
    return storageService.get(NOTES_KEY, []);
  },

  getById(id) {
    const notes = this.getAll();
    return notes.find(n => n.id === id) || null;
  },

  getPinned() {
    return this.getAll().filter(n => n.pinned);
  },

  search(query) {
    if (!query) return this.getAll();
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter(n => n.content.toLowerCase().includes(lowerQuery));
  },

  create(content, pinned = false, taskId = null) {
    const notes = this.getAll();
    const maxOrder = notes.length > 0 ? Math.max(...notes.map(n => n.order || 0)) : 0;
    const newNote = {
      id: generateId(),
      content: content,
      pinned: pinned,
      taskId: taskId || null,
      order: maxOrder + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    notes.push(newNote);
    storageService.set(NOTES_KEY, notes);
    return newNote;
  },

  update(id, changes) {
    const notes = this.getAll();
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) return null;

    changes.updatedAt = new Date().toISOString();
    notes[index] = { ...notes[index], ...changes };
    storageService.set(NOTES_KEY, notes);
    return notes[index];
  },

  delete(id) {
    let notes = this.getAll();
    notes = notes.filter(n => n.id !== id);
    storageService.set(NOTES_KEY, notes);
  },

  deleteByTaskId(taskId) {
    let notes = this.getAll();
    notes = notes.filter(n => n.taskId !== taskId);
    storageService.set(NOTES_KEY, notes);
  },

  togglePin(id) {
    const note = this.getById(id);
    if (note) {
      return this.update(id, { pinned: !note.pinned });
    }
    return null;
  },

  reorder(sourceId, targetId) {
    const notes = this.getAll();
    
    // Sort array identically to how it's rendered
    notes.sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
      return (a.order || 0) - (b.order || 0);
    });

    const sourceIndex = notes.findIndex(n => n.id === sourceId);
    const targetIndex = notes.findIndex(n => n.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) return;
    if (notes[sourceIndex].pinned || notes[targetIndex].pinned) return;

    const [movedNote] = notes.splice(sourceIndex, 1);
    notes.splice(targetIndex, 0, movedNote);

    let currentOrder = 1;
    notes.forEach(note => {
      if (!note.pinned) {
        note.order = currentOrder++;
      }
    });

    storageService.set(NOTES_KEY, notes);
  }
};
