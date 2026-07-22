export function renderBottomNav() {
  return `
    <a href="/hoje" class="nav-item"><i data-lucide="sun"></i><span>Hoje</span></a>
    <a href="/tarefas" class="nav-item"><i data-lucide="check-square"></i><span>Tarefas</span></a>
    <a href="/foco" class="nav-item"><i data-lucide="timer"></i><span>Foco</span></a>
    <a href="/notas" class="nav-item"><i data-lucide="sticky-note"></i><span>Notas</span></a>
    <a href="/ferramentas/corrigir-pontuacao" class="nav-item"><i data-lucide="more-horizontal"></i><span>Mais</span></a>
  `;
}
