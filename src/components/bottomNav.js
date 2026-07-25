export function renderBottomNav() {
  return `
    <a href="/hoje" class="nav-item"><i data-lucide="sun"></i><span>Hoje</span></a>
    <a href="/tarefas" class="nav-item"><i data-lucide="check-square"></i><span>Tarefas</span></a>
    <a href="/notas" class="nav-item"><i data-lucide="sticky-note"></i><span>Notas</span></a>
    <a href="/foco" class="nav-item"><i data-lucide="timer"></i><span>Foco</span></a>
    <button id="theme-toggle-btn-mobile" class="nav-item" style="background:none; border:none; cursor:pointer;" aria-label="Alternar Tema">
      <i data-lucide="moon" id="theme-toggle-icon-mobile"></i><span>Tema</span>
    </button>
  `;
}
