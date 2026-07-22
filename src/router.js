export const router = {
  routes: {},
  currentRoute: null,
  container: null,

  init(containerId) {
    this.container = document.getElementById(containerId);
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Inicia rota baseada no hash atual ou cai no default
    this.handleRoute();
  },

  add(path, module) {
    this.routes[path] = module;
  },

  async handleRoute() {
    const hash = window.location.hash || '#/hoje';
    const path = hash.split('?')[0];

    const module = this.routes[path];
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
        el.classList.toggle('active', el.getAttribute('href') === path);
      });

      if (window.lucide) {
        window.lucide.createIcons();
      }
    } else {
      window.location.hash = '#/hoje'; // redirect
    }
  }
};
