export function renderSidebar() {
  return `
    <div class="sidebar-header">
      <div class="brand-icon"><i data-lucide="layout-dashboard"></i></div>
      <div>
        <h1 class="brand-title">WorkBase</h1>
        <span class="brand-sub">DocWork</span>
      </div>
    </div>
    <nav class="sidebar-nav">
      <a href="/hoje" class="nav-item"><i data-lucide="sun"></i> Hoje</a>
      <a href="/tarefas" class="nav-item"><i data-lucide="check-square"></i> Tarefas</a>
      <a href="/foco" class="nav-item"><i data-lucide="timer"></i> Foco</a>
      <a href="/notas" class="nav-item"><i data-lucide="sticky-note"></i> Notas</a>
      <a href="/ferramentas" class="nav-item"><i data-lucide="wrench"></i> Ferramentas</a>
    </nav>
    <div class="sidebar-footer">
      <button id="theme-toggle-btn" class="theme-toggle-btn" aria-label="Alternar tema">
        <i data-lucide="moon" id="theme-toggle-icon"></i>
        <span id="theme-toggle-text">Modo Escuro</span>
      </button>
      <a href="/configuracoes" class="nav-item"><i data-lucide="settings"></i> Configurações</a>
    </div>
  `;
}
