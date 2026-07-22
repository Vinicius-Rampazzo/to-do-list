export const router = {
  routes: {},
  currentRoute: null,
  container: null,

  init(containerId) {
    this.container = document.getElementById(containerId);
    
    // Escuta navegação pelo botão voltar/avançar do browser
    window.addEventListener('popstate', () => this.handleRoute());

    // Intercepta cliques em links internos para SPA navigation
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href]');
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      // Ignora links externos, javascript:, mailto:, etc.
      if (!href || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('javascript')) return;
      // Ignora links com target="_blank"
      if (anchor.getAttribute('target') === '_blank') return;
      
      // Navegação SPA interna
      e.preventDefault();
      if (window.location.pathname !== href) {
        window.history.pushState(null, '', href);
      }
      this.handleRoute();
    });

    // Inicia rota baseada no pathname atual
    this.handleRoute();
  },

  add(path, module) {
    this.routes[path] = module;
  },

  async handleRoute() {
    const path = window.location.pathname || '/hoje';

    // Busca rota exata ou rota base (ex: /ferramentas/corrigir-pontuacao -> /ferramentas)
    let module = this.routes[path];

    if (!module) {
      const baseRoute = Object.keys(this.routes).find(r => r !== '/' && path.startsWith(r + '/'));
      if (baseRoute) {
        module = this.routes[baseRoute];
      }
    }

    if (module) {
      if (this.currentRoute && this.currentRoute.destroy) {
        this.currentRoute.destroy();
      }

      this.currentRoute = module;
      if (module.render) {
        this.container.innerHTML = await module.render();
      }
      if (module.init) {
        module.init();
      }

      // Atualiza active state na navegação
      document.querySelectorAll('.nav-item').forEach(el => {
        const href = el.getAttribute('href');
        if (href) {
          el.classList.toggle('active', path === href || path.startsWith(href + '/'));
        }
      });

      if (window.lucide) {
        window.lucide.createIcons();
      }
    } else {
      // Redireciona para /hoje se rota não encontrada
      window.history.replaceState(null, '', '/hoje');
      this.handleRoute();
    }
  }
};
