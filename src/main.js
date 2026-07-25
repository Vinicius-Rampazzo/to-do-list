import './app.css';
import { taskRepository } from './core/taskRepository.js';
import { settingsRepository } from './core/settingsRepository.js';
import { router } from './router.js';

import { renderSidebar } from './components/sidebar.js';
import { renderBottomNav } from './components/bottomNav.js';
import { renderFloatingTimer, initFloatingTimer } from './components/floatingTimer.js';
import { timerEngine } from './core/timerEngine.js';

// Módulos
import hojeModule from './modules/hoje/hoje.js';
import tarefasModule from './modules/tarefas/tarefas.js';
import focoModule from './modules/foco/foco.js';
import notasModule from './modules/notas/notas.js';
import ferramentasModule from './modules/ferramentas/ferramentas.js';
import configuracoesModule from './modules/configuracoes/configuracoes.js';

function applyTheme(theme) {
  const isDark = theme === 'dark';
  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  const icon = document.getElementById('theme-toggle-icon');
  const text = document.getElementById('theme-toggle-text');
  const iconMobile = document.getElementById('theme-toggle-icon-mobile');

  if (icon) icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
  if (text) text.textContent = isDark ? 'Modo Claro' : 'Modo Escuro';
  if (iconMobile) iconMobile.setAttribute('data-lucide', isDark ? 'sun' : 'moon');

  if (window.lucide) window.lucide.createIcons();
}

function initTheme() {
  const settings = settingsRepository.get();
  const currentTheme = settings.theme || 'light';
  applyTheme(currentTheme);

  const toggleBtn = document.getElementById('theme-toggle-btn');
  const toggleBtnMobile = document.getElementById('theme-toggle-btn-mobile');

  const toggleHandler = () => {
    const current = settingsRepository.get().theme || 'light';
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    settingsRepository.update({ theme: nextTheme });
    applyTheme(nextTheme);
  };

  if (toggleBtn) toggleBtn.addEventListener('click', toggleHandler);
  if (toggleBtnMobile) toggleBtnMobile.addEventListener('click', toggleHandler);
}

function bootstrap() {
  // Migra dados antigos se existirem
  taskRepository.migrateLegacyTasks();

  // Renderiza layout shell
  document.getElementById('sidebar').innerHTML = renderSidebar();
  document.getElementById('bottom-nav').innerHTML = renderBottomNav();
  document.body.insertAdjacentHTML('beforeend', renderFloatingTimer());

  // Inicializa gerenciamento de tema
  initTheme();

  // Registra rotas
  router.add('/hoje', hojeModule);
  router.add('/tarefas', tarefasModule);
  router.add('/foco', focoModule);
  router.add('/notas', notasModule);
  router.add('/ferramentas', ferramentasModule);
  router.add('/configuracoes', configuracoesModule);

  // Expõe router globalmente para navegação programática
  window.router = router;

  // Inicializa router no elemento principal
  router.init('app-content');
  initFloatingTimer();
  
  // Update floating timer se estiver visível
  window.addEventListener('popstate', () => {
    timerEngine.notifyListeners();
  });
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

document.addEventListener('DOMContentLoaded', bootstrap);
