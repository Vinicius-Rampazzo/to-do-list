export const router = {
  routes: {},
  currentRoute: null,
  container: null,

  init(containerId) {
    this.container = document.getElementById(containerId);
    
    // Inicia ouvintes de popstate (botões avançar/voltar do navegador) e hashchange (fallback)
    window.addEventListener('popstate', () => this.handleRoute());
    window.addEventListener('hashchange', () => this.handleRoute());

    // Intercepta cliques em links internos com href que começam com / ou #/
    document.body.addEventListener('click', (e) => {
      const anchor = e.target.closest('a');
      if (anchor && anchor.getAttribute('href') && !anchor.getAttribute('target')) {
        const href = anchor.getAttribute('href');
        if (href.startsWith('/') || href.startsWith('#/')) {
          e.preventDefault();
          const cleanPath = href.replace(/^#/, '');
          window.history.pushState(null, '', cleanPath);
          this.handleRoute();
        }
      }
    });

    this.handleRoute();
  },

  add(path, module) {
    // Normaliza rota registrando tanto com barra quanto com hash pra compatibilidade
    const cleanPath = path.replace(/^#/, '');
    this.routes[cleanPath] = module;
    this.routes['#' + cleanPath] = module;
  },

  async handleRoute() {
    let path = window.location.pathname;

    // Se houver hash #/ na URL, converte para pathname limpo
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      path = window.location.hash.replace('#', '');
      window.history.replaceState(null, '', path);
    }

    if (!path || path === '/') {
      path = '/hoje';
      window.history.replaceState(null, '', '/hoje');
    }

    // Busca rota exata ou rota base (ex: /ferramentas/corrigir-pontuacao -> /ferramentas)
    let module = this.routes[path];

    if (!module) {
      const baseRoute = Object.keys(this.routes).find(r => !r.startsWith('#') && path.startsWith(r + '/'));
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

      // Atualiza active state na navegação lateral e inferior
      document.querySelectorAll('.nav-item').forEach(el => {
        const href = el.getAttribute('href');
        if (href) {
          const cleanHref = href.replace(/^#/, '');
          el.classList.toggle('active', path === cleanHref || path.startsWith(cleanHref + '/'));
        }
      });

      if (window.lucide) {
        window.lucide.createIcons();
      }
    } else {
      window.history.replaceState(null, '', '/hoje');
      this.handleRoute();
    }
  }
};
