import { storageService } from '../../core/storageService.js';

export default {
  render() {
    return `
      <div class="module-header">
        <h2>Configurações</h2>
        <p class="text-muted">Personalize e gerencie seus dados.</p>
      </div>

      <div class="app-card">
        <h3 style="font-size: var(--fs-lg); margin-bottom: var(--space-4);">Dados e Backup</h3>
        <p class="text-muted" style="margin-bottom: var(--space-4); font-size: var(--fs-sm);">
          Seus dados ficam salvos apenas neste navegador. Faça backups regulares.
        </p>

        <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
          <button id="btn-export" class="btn btn-primary"><i data-lucide="download"></i> Exportar Backup</button>
          
          <label class="btn btn-secondary" style="cursor: pointer;">
            <i data-lucide="upload"></i> Importar Backup
            <input type="file" id="input-import" accept=".json" style="display: none;" />
          </label>
          
          <button id="btn-clear" class="btn btn-danger"><i data-lucide="trash-2"></i> Apagar Tudo</button>
        </div>
      </div>
    `;
  },

  init() {
    document.getElementById('btn-export').addEventListener('click', () => {
      const data = {
        tasks: storageService.get('wb-tasks', []),
        sessions: storageService.get('wb-time-sessions', []),
        settings: storageService.get('wb-settings', {})
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workbase-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    document.getElementById('input-import').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (data.tasks) storageService.set('wb-tasks', data.tasks);
          if (data.sessions) storageService.set('wb-time-sessions', data.sessions);
          if (data.settings) storageService.set('wb-settings', data.settings);
          alert('Backup importado com sucesso! A página será recarregada.');
          window.location.reload();
        } catch (err) {
          alert('Erro ao importar arquivo. Formato inválido.');
        }
      };
      reader.readAsText(file);
    });

    document.getElementById('btn-clear').addEventListener('click', () => {
      if (confirm('Tem certeza? ISSO APAGARÁ TODAS AS TAREFAS E SESSÕES.')) {
        storageService.clear();
        alert('Dados apagados. A página será recarregada.');
        window.location.reload();
      }
    });
  }
};
