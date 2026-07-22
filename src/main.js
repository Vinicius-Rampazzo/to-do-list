import './app.css';
import { taskRepository } from './core/taskRepository.js';
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

function bootstrap() {
  // Migra dados antigos se existirem
  taskRepository.migrateLegacyTasks();

  // Renderiza layout shell
  document.getElementById('sidebar').innerHTML = renderSidebar();
  document.getElementById('bottom-nav').innerHTML = renderBottomNav();
  document.body.insertAdjacentHTML('beforeend', renderFloatingTimer());

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
