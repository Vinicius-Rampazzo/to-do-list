const TOOL_SLUGS = {
  '/ferramentas/corrigir-pontuacao': { tool: 'text', action: 'punct' },
  '/ferramentas/maiusculas': { tool: 'text', action: 'uppercase' },
  '/ferramentas/minusculas': { tool: 'text', action: 'lowercase' },
  '/ferramentas/capitalizar-frases': { tool: 'text', action: 'capitalize' },
  '/ferramentas/remover-espacos-extras': { tool: 'text', action: 'trim' },
  '/ferramentas/remover-linhas-vazias': { tool: 'text', action: 'empty' },
  '/ferramentas/gerador-de-senha': { tool: 'password' },
  '/ferramentas/contador-de-caracteres': { tool: 'counter' },
  '/ferramentas/formatador-json': { tool: 'json' },
  '/ferramentas/gerador-qr-code': { tool: 'qrcode' },
  '/ferramentas/organizador-de-texto': { tool: 'text', action: 'punct' }
};

const REVERSE_ACTION_SLUGS = {
  'punct': '/ferramentas/corrigir-pontuacao',
  'uppercase': '/ferramentas/maiusculas',
  'lowercase': '/ferramentas/minusculas',
  'capitalize': '/ferramentas/capitalizar-frases',
  'trim': '/ferramentas/remover-espacos-extras',
  'empty': '/ferramentas/remover-linhas-vazias'
};

const REVERSE_TOOL_SLUGS = {
  'password': '/ferramentas/gerador-de-senha',
  'counter': '/ferramentas/contador-de-caracteres',
  'json': '/ferramentas/formatador-json',
  'qrcode': '/ferramentas/gerador-qr-code',
  'text': '/ferramentas/corrigir-pontuacao'
};

export default {
  render() {
    return `
      <div class="module-header">
        <h2>Ferramentas Rápidas</h2>
        <p class="text-muted">Utilitários para o dia a dia.</p>
      </div>

      <div class="dashboard-cards" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); margin-bottom: var(--space-6);">
        
        <div class="dash-card tool-card" data-tool="password" style="cursor: pointer; transition: transform var(--transition-fast);">
          <div class="dash-icon" style="background: var(--clr-accent-subtle); color: var(--clr-accent);"><i data-lucide="key"></i></div>
          <div class="dash-info"><span class="dash-value" style="font-size: var(--fs-base);">Senha</span></div>
        </div>

        <div class="dash-card tool-card" data-tool="counter" style="cursor: pointer; transition: transform var(--transition-fast);">
          <div class="dash-icon" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;"><i data-lucide="bar-chart-2"></i></div>
          <div class="dash-info"><span class="dash-value" style="font-size: var(--fs-base);">Contador</span></div>
        </div>

        <div class="dash-card tool-card" data-tool="json" style="cursor: pointer; transition: transform var(--transition-fast);">
          <div class="dash-icon" style="background: rgba(168, 85, 247, 0.1); color: #a855f7;"><i data-lucide="code"></i></div>
          <div class="dash-info"><span class="dash-value" style="font-size: var(--fs-base);">JSON</span></div>
        </div>

        <div class="dash-card tool-card" data-tool="qrcode" style="cursor: pointer; transition: transform var(--transition-fast);">
          <div class="dash-icon" style="background: rgba(249, 115, 22, 0.1); color: #f97316;"><i data-lucide="qr-code"></i></div>
          <div class="dash-info"><span class="dash-value" style="font-size: var(--fs-base);">QR Code</span></div>
        </div>

        <div class="dash-card tool-card" data-tool="text" style="cursor: pointer; transition: transform var(--transition-fast);">
          <div class="dash-icon" style="background: rgba(236, 72, 153, 0.1); color: #ec4899;"><i data-lucide="file-text"></i></div>
          <div class="dash-info"><span class="dash-value" style="font-size: var(--fs-base);">Texto</span></div>
        </div>

      </div>

      <div id="tool-container" class="app-card">
        <div class="empty-state">
          <span class="empty-icon"><i data-lucide="wrench"></i></span>
          <p>Selecione uma ferramenta acima.</p>
        </div>
      </div>
    `;
  },

  init() {
    this.toolContainer = document.getElementById('tool-container');
    this.cards = document.querySelectorAll('.tool-card');
    
    this.cards.forEach(card => {
      card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-2px)');
      card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');
      card.addEventListener('click', () => {
        const tool = card.dataset.tool;
        const slug = REVERSE_TOOL_SLUGS[tool] || '/ferramentas/corrigir-pontuacao';
        window.history.pushState(null, '', slug);
        this.loadToolFromPath();
      });
    });

    this.loadToolFromPath();
  },

  loadToolFromPath() {
    let path = window.location.pathname;
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      path = window.location.hash.replace('#', '');
    }

    const config = TOOL_SLUGS[path] || { tool: 'text', action: 'punct' };

    if (path === '/ferramentas' || path === '/ferramentas/') {
      window.history.replaceState(null, '', '/ferramentas/corrigir-pontuacao');
    }

    this.loadTool(config.tool, config.action || 'punct');
  },

  loadTool(tool, initialAction = 'punct') {
    this.cards.forEach(c => c.style.borderColor = 'var(--clr-border)');
    const selectedCard = document.querySelector(`[data-tool="${tool}"]`);
    if (selectedCard) selectedCard.style.borderColor = 'var(--clr-accent)';

    switch(tool) {
      case 'password': this.renderPasswordGenerator(); break;
      case 'counter': this.renderCharCounter(); break;
      case 'json': this.renderJsonFormatter(); break;
      case 'qrcode': this.renderQrCode(); break;
      case 'text': this.renderTextOrganizer(initialAction); break;
    }
  },

  renderPasswordGenerator() {
    this.toolContainer.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
        <h3>Gerador de Senha Forte</h3>
        <button id="btn-gen-pwd" class="btn btn-secondary btn-sm"><i data-lucide="refresh-cw"></i> Gerar Outra</button>
      </div>
      
      <!-- Output Container -->
      <div style="background: var(--clr-bg-card); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); padding: var(--space-4); margin-bottom: var(--space-4); box-shadow: var(--shadow-card);">
        <div style="display: flex; gap: var(--space-2); align-items: center; margin-bottom: var(--space-3);">
          <input type="text" id="pwd-result" class="task-input" readonly style="font-family: monospace; font-size: var(--fs-xl); font-weight: 700; letter-spacing: 1px; color: var(--clr-accent); background: var(--clr-bg);" />
          <button id="btn-copy-pwd" class="btn btn-primary" style="white-space: nowrap; height: 44px;"><i data-lucide="copy"></i> Copiar</button>
        </div>

        <!-- Strength Indicator Bar -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; font-size: var(--fs-xs); color: var(--clr-text-muted);">
          <span>Força da Senha: <strong id="pwd-strength-text" style="color: var(--clr-accent);">Forte</strong></span>
          <span id="pwd-bits-text">~128 bits</span>
        </div>
        <div style="width: 100%; height: 6px; background: var(--clr-bg); border-radius: var(--radius-full); overflow: hidden;">
          <div id="pwd-strength-bar" style="height: 100%; width: 80%; background: var(--clr-accent); transition: all 0.3s ease;"></div>
        </div>
      </div>

      <!-- Controls Card -->
      <div style="background: var(--clr-bg); border: 1px solid var(--clr-border); border-radius: var(--radius-md); padding: var(--space-4); margin-bottom: var(--space-4);">
        <div style="margin-bottom: var(--space-4);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2);">
            <label style="font-size: var(--fs-sm); font-weight: 600; color: var(--clr-text);">Tamanho da Senha</label>
            <span id="pwd-len-val" style="background: var(--clr-accent-subtle); color: var(--clr-accent); font-weight: 700; font-size: var(--fs-sm); padding: 2px 10px; border-radius: var(--radius-full);">16 caracteres</span>
          </div>
          <input type="range" id="pwd-len" min="6" max="64" value="16" style="width: 100%; cursor: pointer; accent-color: var(--clr-accent);" />
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--space-3);">
          <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer; padding: var(--space-2); background: var(--clr-bg-card); border-radius: var(--radius-md); border: 1px solid var(--clr-border); font-size: var(--fs-sm); font-weight: 500;">
            <input type="checkbox" id="pwd-uc" checked style="accent-color: var(--clr-accent);" /> Maiúsculas (A-Z)
          </label>
          <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer; padding: var(--space-2); background: var(--clr-bg-card); border-radius: var(--radius-md); border: 1px solid var(--clr-border); font-size: var(--fs-sm); font-weight: 500;">
            <input type="checkbox" id="pwd-lc" checked style="accent-color: var(--clr-accent);" /> Minúsculas (a-z)
          </label>
          <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer; padding: var(--space-2); background: var(--clr-bg-card); border-radius: var(--radius-md); border: 1px solid var(--clr-border); font-size: var(--fs-sm); font-weight: 500;">
            <input type="checkbox" id="pwd-num" checked style="accent-color: var(--clr-accent);" /> Números (0-9)
          </label>
          <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer; padding: var(--space-2); background: var(--clr-bg-card); border-radius: var(--radius-md); border: 1px solid var(--clr-border); font-size: var(--fs-sm); font-weight: 500;">
            <input type="checkbox" id="pwd-sym" checked style="accent-color: var(--clr-accent);" /> Símbolos (!@#$...)
          </label>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();

    const result = document.getElementById('pwd-result');
    const len = document.getElementById('pwd-len');
    const lenVal = document.getElementById('pwd-len-val');
    const uc = document.getElementById('pwd-uc');
    const lc = document.getElementById('pwd-lc');
    const num = document.getElementById('pwd-num');
    const sym = document.getElementById('pwd-sym');
    const strengthText = document.getElementById('pwd-strength-text');
    const strengthBar = document.getElementById('pwd-strength-bar');
    const bitsText = document.getElementById('pwd-bits-text');

    const updateStrength = (pwd) => {
      if (!pwd || pwd.startsWith('Selecione')) {
        strengthText.textContent = 'Indefinida';
        strengthBar.style.width = '0%';
        strengthBar.style.background = 'var(--clr-border)';
        bitsText.textContent = '0 bits';
        return;
      }

      let score = 0;
      if (pwd.length >= 10) score++;
      if (pwd.length >= 16) score++;
      if (pwd.length >= 24) score++;
      if (/[A-Z]/.test(pwd)) score++;
      if (/[a-z]/.test(pwd)) score++;
      if (/[0-9]/.test(pwd)) score++;
      if (/[^A-Za-z0-9]/.test(pwd)) score++;

      if (score <= 3) {
        strengthText.textContent = 'Fraca';
        strengthText.style.color = 'var(--clr-danger)';
        strengthBar.style.width = '25%';
        strengthBar.style.background = 'var(--clr-danger)';
      } else if (score <= 5) {
        strengthText.textContent = 'Média';
        strengthText.style.color = '#f59e0b';
        strengthBar.style.width = '55%';
        strengthBar.style.background = '#f59e0b';
      } else if (score <= 6) {
        strengthText.textContent = 'Forte';
        strengthText.style.color = '#10b981';
        strengthBar.style.width = '80%';
        strengthBar.style.background = '#10b981';
      } else {
        strengthText.textContent = 'Muito Forte';
        strengthText.style.color = 'var(--clr-accent)';
        strengthBar.style.width = '100%';
        strengthBar.style.background = 'var(--clr-accent)';
      }

      let poolSize = 0;
      if (uc.checked) poolSize += 26;
      if (lc.checked) poolSize += 26;
      if (num.checked) poolSize += 10;
      if (sym.checked) poolSize += 30;
      const bits = Math.floor(pwd.length * Math.log2(poolSize || 1));
      bitsText.textContent = `~${bits} bits de segurança`;
    };

    const generate = () => {
      const chars = {
        uc: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lc: 'abcdefghijklmnopqrstuvwxyz',
        num: '0123456789',
        sym: '!@#$%^&*()_+~`|}{[]:;?><,./-='
      };
      let allowed = '';
      if (uc.checked) allowed += chars.uc;
      if (lc.checked) allowed += chars.lc;
      if (num.checked) allowed += chars.num;
      if (sym.checked) allowed += chars.sym;
      
      if (!allowed) {
        result.value = 'Selecione ao menos uma opção';
        updateStrength('');
        return;
      }
      
      let pwd = '';
      const length = parseInt(len.value);
      for(let i=0; i<length; i++) {
        pwd += allowed.charAt(Math.floor(Math.random() * allowed.length));
      }
      result.value = pwd;
      updateStrength(pwd);
    };

    len.addEventListener('input', () => { 
      lenVal.textContent = `${len.value} caracteres`; 
      generate(); 
    });
    [uc, lc, num, sym].forEach(el => el.addEventListener('change', generate));
    document.getElementById('btn-gen-pwd').addEventListener('click', generate);
    
    document.getElementById('btn-copy-pwd').addEventListener('click', () => {
      if (!result.value || result.value.startsWith('Selecione')) return;
      navigator.clipboard.writeText(result.value);
      const btn = document.getElementById('btn-copy-pwd');
      const original = btn.innerHTML;
      btn.innerHTML = '<i data-lucide="check"></i> Copiado!';
      if (window.lucide) window.lucide.createIcons();
      setTimeout(() => { btn.innerHTML = original; if (window.lucide) window.lucide.createIcons(); }, 1500);
    });

    generate();
  },

  renderCharCounter() {
    this.toolContainer.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
        <h3>Contador de Caracteres</h3>
        <button id="btn-cc-clear" class="btn btn-secondary btn-sm"><i data-lucide="trash"></i> Limpar</button>
      </div>
      
      <div style="display: flex; gap: var(--space-4); margin-bottom: var(--space-4); flex-wrap: wrap;">
        <div style="flex: 1; min-width: 100px; background: var(--clr-bg); padding: var(--space-3); border-radius: var(--radius-md); text-align: center;">
          <div id="cc-chars" style="font-size: var(--fs-xl); font-weight: 700; color: var(--clr-accent);">0</div>
          <div style="font-size: var(--fs-xs); color: var(--clr-text-muted); text-transform: uppercase;">Caracteres</div>
        </div>
        <div style="flex: 1; min-width: 100px; background: var(--clr-bg); padding: var(--space-3); border-radius: var(--radius-md); text-align: center;">
          <div id="cc-words" style="font-size: var(--fs-xl); font-weight: 700; color: var(--clr-accent);">0</div>
          <div style="font-size: var(--fs-xs); color: var(--clr-text-muted); text-transform: uppercase;">Palavras</div>
        </div>
        <div style="flex: 1; min-width: 100px; background: var(--clr-bg); padding: var(--space-3); border-radius: var(--radius-md); text-align: center;">
          <div id="cc-lines" style="font-size: var(--fs-xl); font-weight: 700; color: var(--clr-accent);">0</div>
          <div style="font-size: var(--fs-xs); color: var(--clr-text-muted); text-transform: uppercase;">Linhas</div>
        </div>
      </div>

      <textarea id="cc-input" class="task-input" placeholder="Cole ou digite seu texto aqui..." style="min-height: 200px; resize: vertical; margin-bottom: var(--space-3);"></textarea>
      
      <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer; font-size: var(--fs-sm);">
        <input type="checkbox" id="cc-spaces" checked /> Contar espaços
      </label>
    `;
    if (window.lucide) window.lucide.createIcons();

    const input = document.getElementById('cc-input');
    const spaces = document.getElementById('cc-spaces');
    const chars = document.getElementById('cc-chars');
    const words = document.getElementById('cc-words');
    const lines = document.getElementById('cc-lines');

    const update = () => {
      let text = input.value;
      
      lines.textContent = text ? text.split('\n').length : 0;
      
      const wordsArr = text.trim().split(/\s+/);
      words.textContent = text.trim() === '' ? 0 : wordsArr.length;

      if (!spaces.checked) {
        text = text.replace(/\s/g, '');
      }
      chars.textContent = text.length;
    };

    input.addEventListener('input', update);
    spaces.addEventListener('change', update);
    
    document.getElementById('btn-cc-clear').addEventListener('click', () => {
      input.value = '';
      update();
    });
  },

  renderJsonFormatter() {
    this.toolContainer.innerHTML = `
      <h3 style="margin-bottom: var(--space-4);">Formatador JSON</h3>
      
      <div style="display: flex; gap: var(--space-2); margin-bottom: var(--space-3);">
        <button id="btn-json-fmt" class="btn btn-primary"><i data-lucide="align-left"></i> Formatar</button>
        <button id="btn-json-min" class="btn btn-secondary"><i data-lucide="minimize-2"></i> Minificar</button>
        <div style="flex: 1;"></div>
        <button id="btn-json-copy" class="btn btn-secondary"><i data-lucide="copy"></i> Copiar</button>
      </div>

      <div id="json-error" style="color: var(--clr-danger); font-size: var(--fs-sm); margin-bottom: var(--space-2); display: none;">JSON Inválido</div>
      <textarea id="json-input" class="task-input" placeholder='Cole seu JSON aqui... ex: {"nome": "workbase"}' style="min-height: 300px; resize: vertical; font-family: monospace; font-size: 13px;"></textarea>
    `;
    if (window.lucide) window.lucide.createIcons();

    const input = document.getElementById('json-input');
    const error = document.getElementById('json-error');

    const processJson = (space) => {
      try {
        error.style.display = 'none';
        if (!input.value.trim()) return;
        const obj = JSON.parse(input.value);
        input.value = JSON.stringify(obj, null, space);
      } catch (e) {
        error.style.display = 'block';
        error.textContent = 'Erro: ' + e.message;
      }
    };

    document.getElementById('btn-json-fmt').addEventListener('click', () => processJson(2));
    document.getElementById('btn-json-min').addEventListener('click', () => processJson(0));
    document.getElementById('btn-json-copy').addEventListener('click', () => {
      navigator.clipboard.writeText(input.value);
    });
  },

  renderQrCode() {
    this.toolContainer.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
        <h3>Gerador de QR Code</h3>
        <button id="btn-qr-clear" class="btn btn-secondary btn-sm"><i data-lucide="trash"></i> Limpar</button>
      </div>
      
      <div style="display: flex; gap: var(--space-4); flex-wrap: wrap;">
        <div style="flex: 1; min-width: 250px;">
          <label style="display: block; margin-bottom: var(--space-2); font-size: var(--fs-sm); font-weight: 600;">URL ou Texto</label>
          <textarea id="qr-input" class="task-input" placeholder="https://..." style="min-height: 100px; resize: vertical; margin-bottom: var(--space-4);"></textarea>
          <button id="btn-qr-gen" class="btn btn-primary" style="width: 100%; justify-content: center;"><i data-lucide="qr-code"></i> Gerar QR Code</button>
        </div>
        
        <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--clr-bg); border-radius: var(--radius-md); padding: var(--space-4);">
          <img id="qr-img" src="" style="display: none; max-width: 200px; width: 100%; border-radius: 8px; box-shadow: var(--shadow-sm);" />
          <div id="qr-placeholder" class="text-muted" style="text-align: center; font-size: var(--fs-sm);">
            <i data-lucide="image" style="width: 48px; height: 48px; margin-bottom: var(--space-2); opacity: 0.5;"></i><br>O QR Code aparecerá aqui
          </div>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();

    const input = document.getElementById('qr-input');
    const img = document.getElementById('qr-img');
    const ph = document.getElementById('qr-placeholder');

    document.getElementById('btn-qr-gen').addEventListener('click', () => {
      const text = input.value.trim();
      if (!text) return;
      
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
      
      img.src = url;
      img.style.display = 'block';
      ph.style.display = 'none';
    });

    document.getElementById('btn-qr-clear').addEventListener('click', () => {
      input.value = '';
      img.src = '';
      img.style.display = 'none';
      ph.style.display = 'block';
    });
  },

  renderTextOrganizer(initialAction = 'punct') {
    const isAct = (act) => act === initialAction ? 'btn-primary active' : 'btn-secondary';

    this.toolContainer.innerHTML = `
      <style>
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-loader {
          animation: spin 1s linear infinite;
          display: inline-block;
        }
        .action-chip {
          transition: all 0.2s ease;
          border-radius: var(--radius-full);
          padding: 6px 14px;
          font-weight: 500;
          cursor: pointer;
        }
        .action-chip.active {
          background: var(--clr-accent) !important;
          color: white !important;
          border-color: var(--clr-accent) !important;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
        }
      </style>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
        <h3>Organizador de Texto</h3>
        <button id="btn-txt-clear" class="btn btn-secondary btn-sm"><i data-lucide="trash"></i> Limpar Tudo</button>
      </div>
      
      <div style="margin-bottom: var(--space-2); font-size: var(--fs-xs); font-weight: 600; color: var(--clr-text-muted); text-transform: uppercase; letter-spacing: 0.5px;">
        Selecione a ação desejada:
      </div>

      <div style="display: flex; gap: var(--space-2); flex-wrap: wrap; margin-bottom: var(--space-4);">
        <button class="btn btn-sm text-action action-chip ${isAct('punct')}" data-action="punct"><i data-lucide="sparkles"></i> Corrigir Pontuação</button>
        <button class="btn btn-sm text-action action-chip ${isAct('uppercase')}" data-action="uppercase">MAIÚSCULAS</button>
        <button class="btn btn-sm text-action action-chip ${isAct('lowercase')}" data-action="lowercase">minúsculas</button>
        <button class="btn btn-sm text-action action-chip ${isAct('capitalize')}" data-action="capitalize">Capitalizar Frases</button>
        <button class="btn btn-sm text-action action-chip ${isAct('trim')}" data-action="trim">Remover Espaços Extras</button>
        <button class="btn btn-sm text-action action-chip ${isAct('empty')}" data-action="empty">Remover Linhas Vazias</button>
      </div>

      <div style="display: flex; gap: var(--space-3); margin-bottom: var(--space-3);">
        <div style="flex: 1;">
          <textarea id="txt-input" class="task-input" placeholder="Cole ou digite seu texto original aqui..." style="min-height: 230px; resize: vertical;"></textarea>
        </div>
        <div style="display: flex; flex-direction: column; justify-content: center; color: var(--clr-text-muted);">
          <i data-lucide="arrow-right"></i>
        </div>
        <div style="flex: 1; position: relative;">
          <textarea id="txt-output" class="task-input" placeholder="O resultado aparecerá aqui após clicar em 'Processar Texto'..." readonly style="min-height: 230px; resize: vertical; background: var(--clr-bg);"></textarea>
          <button id="btn-txt-copy" class="btn btn-primary btn-sm" style="position: absolute; bottom: var(--space-3); right: var(--space-3);"><i data-lucide="copy"></i> Copiar</button>
        </div>
      </div>

      <div style="margin-bottom: var(--space-4);">
        <button id="btn-process-text" class="btn btn-primary" style="width: 100%; justify-content: center; font-weight: 600; padding: var(--space-3); font-size: var(--fs-base); border-radius: var(--radius-md); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);">
          <i data-lucide="wand-2"></i> Processar Texto
        </button>
      </div>

      <div id="txt-report" style="margin-top: var(--space-4); display: none; padding: var(--space-4); background: var(--clr-bg-card); border-radius: var(--radius-md); border: 1px solid var(--clr-border); box-shadow: var(--shadow-card);">
        <h4 id="txt-report-title" style="margin-top: 0; margin-bottom: var(--space-3); display: flex; align-items: center; gap: 8px; font-size: var(--fs-base); color: var(--clr-accent);">
          <i data-lucide="sparkles"></i> Análise do Texto
        </h4>
        <ul id="txt-report-list" style="margin: 0; padding-left: 20px; font-size: var(--fs-sm); display: flex; flex-direction: column; gap: var(--space-2); color: var(--clr-text-secondary);">
          <!-- Alterações inseridas dinamicamente -->
        </ul>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();

    const input = document.getElementById('txt-input');
    const output = document.getElementById('txt-output');
    const btnProcess = document.getElementById('btn-process-text');
    let selectedAction = initialAction; // Action selected from URL or initial default

    // Selection mode: clicking chips highlights them and updates URL hash without re-rendering
    document.querySelectorAll('.text-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget;
        selectedAction = target.dataset.action;

        const slug = REVERSE_ACTION_SLUGS[selectedAction];
        if (slug) {
          window.history.pushState(null, '', slug);
        }

        document.querySelectorAll('.text-action').forEach(b => {
          b.classList.remove('active', 'btn-primary');
          b.classList.add('btn-secondary');
        });

        target.classList.remove('btn-secondary');
        target.classList.add('active', 'btn-primary');
      });
    });

    // Execution mode: clicking Processar Texto runs the conversion
    btnProcess.addEventListener('click', async () => {
      let text = input.value;
      if (!text) return;
      
      const reportDiv = document.getElementById('txt-report');
      const reportList = document.getElementById('txt-report-list');
      const reportTitle = document.getElementById('txt-report-title');

      if (reportDiv && reportList && reportTitle) {
        reportList.innerHTML = '';
        reportDiv.style.display = 'none';
      }

      switch(selectedAction) {
        case 'uppercase': {
          let count = 0;
          for (let i = 0; i < text.length; i++) {
            if (text[i] !== text[i].toUpperCase()) count++;
          }
          text = text.toUpperCase();
          if (reportDiv && reportList && reportTitle) {
            reportTitle.innerHTML = `<i data-lucide="arrow-up-circle"></i> Conversão para Maiúsculas`;
            reportList.innerHTML = `<li>Convertidos <strong>${count}</strong> caracteres de minúsculo para maiúsculo.</li>`;
            reportDiv.style.display = 'block';
          }
          break;
        }
        case 'lowercase': {
          let count = 0;
          for (let i = 0; i < text.length; i++) {
            if (text[i] !== text[i].toLowerCase()) count++;
          }
          text = text.toLowerCase();
          if (reportDiv && reportList && reportTitle) {
            reportTitle.innerHTML = `<i data-lucide="arrow-down-circle"></i> Conversão para Minúsculas`;
            reportList.innerHTML = `<li>Convertidos <strong>${count}</strong> caracteres de maiúsculo para minúsculo.</li>`;
            reportDiv.style.display = 'block';
          }
          break;
        }
        case 'trim': {
          const origLen = text.length;
          text = text.split('\n').map(l => l.trim().replace(/\s+/g, ' ')).join('\n');
          const diff = Math.max(0, origLen - text.length);
          if (reportDiv && reportList && reportTitle) {
            reportTitle.innerHTML = `<i data-lucide="align-justify"></i> Limpeza de Espaços`;
            reportList.innerHTML = `<li>Removidos <strong>${diff}</strong> espaços desnecessários e tabs.</li>`;
            reportDiv.style.display = 'block';
          }
          break;
        }
        case 'empty': {
          const origLines = text.split('\n').length;
          const newLines = text.split('\n').filter(l => l.trim() !== '');
          text = newLines.join('\n');
          const diff = Math.max(0, origLines - newLines.length);
          if (reportDiv && reportList && reportTitle) {
            reportTitle.innerHTML = `<i data-lucide="rows"></i> Remoção de Linhas`;
            reportList.innerHTML = `<li>Eliminadas <strong>${diff}</strong> linhas vazias.</li>`;
            reportDiv.style.display = 'block';
          }
          break;
        }
        case 'capitalize': {
          let count = 0;
          text = text.replace(/(^\s*|[.!?]\s+)([a-zà-úç])/g, (match, sep, char) => {
            count++;
            return sep + char.toUpperCase();
          });
          if (reportDiv && reportList && reportTitle) {
            reportTitle.innerHTML = `<i data-lucide="type"></i> Capitalização de Sentenças`;
            reportList.innerHTML = `<li>Capitalizado o início de <strong>${count}</strong> frase(s) ou parágrafo(s).</li>`;
            reportDiv.style.display = 'block';
          }
          break;
        }
        case 'punct': {
          const originalBtnContent = btnProcess.innerHTML;
          btnProcess.disabled = true;
          btnProcess.innerHTML = `<i data-lucide="loader" class="spin-loader"></i> Processando Texto...`;
          if (window.lucide) window.lucide.createIcons();

          try {
            const data = await checkWithLanguageTool(text);
            const { corrected, changes } = applyLanguageToolFixes(text, data.matches);
            text = corrected;

            // Run custom heuristics to add the "feeling" (greetings, courtesy terms, gerunds, pronoun verb agreements, periods)
            const heuristicResult = applyCustomHeuristics(text);
            text = heuristicResult.corrected;
            const allChanges = changes.concat(heuristicResult.changes);

            if (reportDiv && reportList && reportTitle) {
              reportTitle.innerHTML = `<i data-lucide="sparkles"></i> Análise de Pontuação e Ortografia`;
              if (allChanges.length > 0) {
                reportList.innerHTML = allChanges.map(c => `
                  <li>
                    <span class="badge" style="background: var(--clr-accent-subtle); color: var(--clr-accent); padding: 2px 6px; border-radius: 4px; font-weight: 600; font-size: 11px; margin-right: 8px;">${c.category}</span>
                    ${c.description} (de <del style="color:var(--clr-danger); font-family: monospace;">${c.original}</del> para <strong style="color:var(--clr-success); font-family: monospace;">${c.corrected}</strong>)
                  </li>
                `).join('');
              } else {
                reportList.innerHTML = `<li>Nenhuma alteração de pontuação ou grafia foi necessária. O texto está perfeito!</li>`;
              }
              reportDiv.style.display = 'block';
            }
          } catch (err) {
            console.warn('LanguageTool API failed, falling back to local checker', err);
            const result = correctPunctuation(text);
            text = result.corrected;

            if (reportDiv && reportList && reportTitle) {
              reportTitle.innerHTML = `<i data-lucide="alert-triangle" style="color: var(--clr-danger);"></i> Análise de Pontuação (Modo Offline)`;
              if (result.changes.length > 0) {
                reportList.innerHTML = `
                  <li style="color: var(--clr-text-secondary); margin-bottom: var(--space-2); font-style: italic;">
                    ⚠️ A API de correção online está temporariamente inacessível. Usando o corretor básico local.
                  </li>
                ` + result.changes.map(c => `
                  <li>
                    <span class="badge" style="background: var(--clr-danger-light); color: var(--clr-danger); padding: 2px 6px; border-radius: 4px; font-weight: 600; font-size: 11px; margin-right: 8px;">${c.category}</span>
                    ${c.description} (de <del style="color:var(--clr-danger);">${c.original}</del> para <strong style="color:var(--clr-success);">${c.corrected}</strong>)
                  </li>
                `).join('');
              } else {
                reportList.innerHTML = `<li>⚠️ Modo Offline: Nenhuma alteração básica de pontuação foi detectada.</li>`;
              }
              reportDiv.style.display = 'block';
            }
          } finally {
            btnProcess.disabled = false;
            btnProcess.innerHTML = originalBtnContent;
            if (window.lucide) window.lucide.createIcons();
          }
          break;
        }
      }
      
      output.value = text;
      if (window.lucide) window.lucide.createIcons();
    });

    document.getElementById('btn-txt-copy').addEventListener('click', () => {
      if (output.value) navigator.clipboard.writeText(output.value);
    });

    document.getElementById('btn-txt-clear').addEventListener('click', () => {
      input.value = '';
      output.value = '';
      const reportDiv = document.getElementById('txt-report');
      if (reportDiv) reportDiv.style.display = 'none';
    });
  }
};

async function checkWithLanguageTool(text) {
  const params = new URLSearchParams();
  params.append('text', text);
  params.append('language', 'pt-BR');
  params.append('level', 'picky');

  const response = await fetch('https://api.languagetool.org/v2/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: params.toString()
  });

  if (!response.ok) {
    throw new Error(`LanguageTool API responded with status ${response.status}`);
  }

  return await response.json();
}

function applyLanguageToolFixes(text, matches) {
  let corrected = text;
  const changes = [];

  const fixableMatches = matches.filter(m => m.replacements && m.replacements.length > 0);
  fixableMatches.sort((a, b) => b.offset - a.offset);

  let lastReplacedOffset = corrected.length;

  fixableMatches.forEach(match => {
    const offset = match.offset;
    const length = match.length;

    if (offset + length > lastReplacedOffset) {
      return;
    }

    const replacement = match.replacements[0].value;
    const originalText = corrected.substring(offset, offset + length);

    corrected = corrected.substring(0, offset) + replacement + corrected.substring(offset + length);
    lastReplacedOffset = offset;

    let category = 'Gramática';
    const catId = match.rule && match.rule.category && match.rule.category.id;
    const catName = match.rule && match.rule.category && match.rule.category.name;
    
    if (catId === 'PUNCTUATION') {
      category = 'Pontuação';
    } else if (catId === 'TYPOGRAPHY') {
      category = 'Tipografia';
    } else if (catId === 'CASING') {
      category = 'Maiúsculas';
    } else if (catId === 'TYPOS' || catId === 'MISSPELLED') {
      category = 'Ortografia';
    } else if (catName) {
      category = catName;
    }

    changes.unshift({
      category,
      description: match.message,
      original: originalText,
      corrected: replacement
    });
  });

  return { corrected, changes };
}

function applyCustomHeuristics(text) {
  let corrected = text;
  const changes = [];

  // 1. Structural Discourse Pipeline: Content Clause -> Courtesy Clause
  const courtesyClauseRegex = /\b([a-zà-úç]+)\s+(muito\s+obrigad[oa]|obrigad[oa]|por\s+favor|por\s+gentileza|desde\s+já\s+agradeço|grat[oa])\b/gi;
  const courtesyMatches = corrected.match(courtesyClauseRegex) || [];
  if (courtesyMatches.length > 0) {
    let replacedAny = false;
    corrected = corrected.replace(courtesyClauseRegex, (match, word, phrase) => {
      const skipWords = ['um', 'o', 'meu', 'de', 'para', 'em', 'com', 'sem', 'por', 'que', 'se', 'e', 'mas', 'ou'];
      if (skipWords.includes(word.toLowerCase())) {
        return match;
      }
      replacedAny = true;
      const capPhrase = phrase.charAt(0).toUpperCase() + phrase.slice(1);
      return `${word}. ${capPhrase}`;
    });
    if (replacedAny) {
      changes.push({
        category: 'Pontuação',
        description: 'Adicionada conclusão de oração e ponto final antes de termo de cortesia.',
        original: courtesyMatches[0],
        corrected: courtesyMatches[0].replace(/\b(muito\s+obrigad[oa]|obrigad[oa]|por\s+favor|por\s+gentileza|desde\s+já\s+agradeço|grat[oa])\b/gi, (m) => `. ${m.charAt(0).toUpperCase() + m.slice(1)}`)
      });
    }
  }

  // 2. Closure terms after courtesy/content (e.g. "pelo atendimento fico a disposição")
  const closureClauseRegex = /\b([a-zà-úç]+|\.)\s+(fico\s+[áa]\s+disposição|fico\s+[áa]\s+disposicao|atenciosamente|cordialmente|um\s+abraço|abraços|saudações)\b/gi;
  const closureMatches = corrected.match(closureClauseRegex) || [];
  if (closureMatches.length > 0) {
    let replacedAny = false;
    corrected = corrected.replace(closureClauseRegex, (match, word, phrase) => {
      if (word === '.') return match;
      replacedAny = true;
      const cleanPhrase = phrase.replace(/fico\s+[áa]\s+disposição/i, 'fico à disposição')
                                .replace(/fico\s+[áa]\s+disposicao/i, 'fico à disposição');
      const capPhrase = cleanPhrase.charAt(0).toUpperCase() + cleanPhrase.slice(1);
      return `${word}. ${capPhrase}`;
    });
    if (replacedAny) {
      changes.push({
        category: 'Pontuação',
        description: 'Adicionado ponto final e maiúscula antes de frase de fechamento.',
        original: closureMatches[0],
        corrected: closureMatches[0].replace(/\b(fico\s+[áa]\s+disposiçã|fico\s+[áa]\s+disposicao|atenciosamente|cordialmente|um\s+abraço|abraços|saudações)/gi, (m) => `. ${m.charAt(0).toUpperCase() + m.slice(1)}`)
      });
    }
  }

  // 3. Greetings and Vocatives (e.g. "ola tudo bem?", "olá joão tudo bem?")
  const greetingVocativeRegex = /\b(olá|ola|oi|bom\s+dia|boa\s+tarde|boa\s-noite)\s+([a-zà-úç]+)?\s*(tudo\s+bem|tudo\s+bom|como\s+vai|como\s+está|como\s+esta)([\?!.])?/gi;
  const greetingMatches = corrected.match(greetingVocativeRegex) || [];
  if (greetingMatches.length > 0) {
    corrected = corrected.replace(greetingVocativeRegex, (match, p1, name, p2, punct) => {
      const cleanP1 = p1.toLowerCase().replace('ola', 'olá');
      const capP1 = cleanP1.charAt(0).toUpperCase() + cleanP1.slice(1);
      const endPunct = punct || '?';
      if (name && !['tudo', 'como'].includes(name.toLowerCase())) {
        const capName = name.charAt(0).toUpperCase() + name.slice(1);
        return `${capP1}, ${capName}, ${p2}${endPunct}`;
      }
      return `${capP1}, ${p2}${endPunct}`;
    });
    changes.push({
      category: 'Pontuação',
      description: 'Adicionada vírgula de vocativo em saudação.',
      original: greetingMatches[0],
      corrected: 'Saudação padronizada'
    });
  }

  // 4. Enumeration Comma (e.g. "comprei pão leite café e açúcar")
  const enumRegex = /\b([a-zà-úç]{3,})\s+([a-zà-úç]{3,})\s+([a-zà-úç]{3,})\s+(e|ou)\s+([a-zà-úç]{3,})\b/gi;
  const enumMatches = corrected.match(enumRegex) || [];
  if (enumMatches.length > 0) {
    corrected = corrected.replace(enumRegex, (match, w1, w2, w3, conj, w4) => {
      const stopWords = ['que', 'para', 'como', 'mais', 'onde', 'quando'];
      if (stopWords.includes(w1.toLowerCase()) || stopWords.includes(w2.toLowerCase())) {
        return match;
      }
      return `${w1}, ${w2}, ${w3} ${conj} ${w4}`;
    });
    changes.push({
      category: 'Pontuação',
      description: 'Adicionadas vírgulas de enumeração em lista.',
      original: enumMatches[0],
      corrected: '[Lista pontuada]'
    });
  }

  // 5. Mandatory Comma before Adversative / Conclusive Conjunctions
  const conjRegex = /([^,;:.!?\s])\s+\b(mas|porém|todavia|contudo|entretanto|portanto)\b/gi;
  const conjMatches = corrected.match(conjRegex) || [];
  if (conjMatches.length > 0) {
    corrected = corrected.replace(conjRegex, '$1, $2');
    changes.push({
      category: 'Pontuação',
      description: 'Adicionada vírgula antes de conjunção.',
      original: conjMatches[0],
      corrected: conjMatches[0].replace(/\s+/, ', ')
    });
  }

  // 6. Introductory Terms Comma
  const introRegex = /(^|[\n.!?…]\s+)(Além disso|Por isso|Portanto|Ou seja|Por exemplo|No entanto|Entretanto|Contudo|Todavia|Desse modo|Desta forma|Em suma)\s+([^,;.\s])/gi;
  const introMatches = corrected.match(introRegex) || [];
  if (introMatches.length > 0) {
    corrected = corrected.replace(introRegex, '$1$2, $3');
    changes.push({
      category: 'Pontuação',
      description: 'Adicionada vírgula após termo introdutório.',
      original: introMatches[0],
      corrected: introMatches[0].replace(/([a-zà-úç]+)\s+([a-zà-úç]+)/i, '$1, $2')
    });
  }

  // 7. City / Date Comma
  const cityDateRegex = /\b(São Paulo|Rio de Janeiro|Belo Horizonte|Curitiba|Porto Alegre|Brasília|Salvador|Recife|Fortaleza)\s+(\d{1,2}\s+de\s+[a-z]+)\b/gi;
  const cityMatches = corrected.match(cityDateRegex) || [];
  if (cityMatches.length > 0) {
    corrected = corrected.replace(cityDateRegex, '$1, $2');
    changes.push({
      category: 'Pontuação',
      description: 'Adicionada vírgula entre cidade e data.',
      original: cityMatches[0],
      corrected: cityMatches[0].replace(/\s+(\d)/, ', $1')
    });
  }

  // 8. "esta" + gerund & pronoun + "é"
  const gerundRegex = /\besta\s+([a-zà-úç]+(?:ando|endo|indo))\b/gi;
  if (gerundRegex.test(corrected)) {
    corrected = corrected.replace(gerundRegex, 'está $1');
    changes.push({
      category: 'Ortografia',
      description: 'Corrigida a grafia do verbo "está" antes de gerúndio.',
      original: 'esta',
      corrected: 'está'
    });
  }

  const eVsERegex = /\b(ele|ela|isso|isto|aquilo|você|voce|o\s+que)\s+e\b/gi;
  if (eVsERegex.test(corrected)) {
    corrected = corrected.replace(eVsERegex, '$1 é');
    changes.push({
      category: 'Ortografia',
      description: 'Corrigido verbo "é" após pronome.',
      original: 'e',
      corrected: 'é'
    });
  }

  // 9. Paragraph Endings & First Letter Capitalization
  const lines = corrected.split('\n');
  let paragraphPeriodsAdded = 0;
  const processedLines = lines.map((line) => {
    const trimmed = line.trim();
    if (trimmed.length > 0) {
      if (!/[.!?:"')\]…]$/.test(trimmed) && !trimmed.endsWith('”') && !trimmed.endsWith('’')) {
        paragraphPeriodsAdded++;
        return line + '.';
      }
    }
    return line;
  });
  if (paragraphPeriodsAdded > 0) {
    corrected = processedLines.join('\n');
    changes.push({
      category: 'Pontuação',
      description: 'Adicionado ponto final no encerramento da frase.',
      original: '[Fim de frase]',
      corrected: '.'
    });
  }

  const capRegex = /(^|[\n.!?…]\s+)([a-zà-úç])/g;
  const capMatches = corrected.match(capRegex) || [];
  if (capMatches.length > 0) {
    corrected = corrected.replace(capRegex, (match, sep, char) => sep + char.toUpperCase());
    changes.push({
      category: 'Maiúsculas',
      description: 'Capitalizada letra inicial de frase/parágrafo.',
      original: capMatches[0].trim(),
      corrected: capMatches[0].trim().toUpperCase()
    });
  }

  // Clean up double spaces & double periods
  corrected = corrected.replace(/[ \t]{2,}/g, ' ').replace(/\.\./g, '.');

  return { corrected, changes };
}

function correctPunctuation(text) {
  let corrected = text;
  let changes = [];

  const spacesMatches = (corrected.match(/[ \t]{2,}/g) || []).length;
  if (spacesMatches > 0) {
    corrected = corrected.replace(/[ \t]+/g, ' ');
    changes.push({
      category: 'Espaçamento',
      description: 'Corrigidos espaçamentos múltiplos entre palavras.',
      original: '[Espaços extras]',
      corrected: '[Espaço simples]'
    });
  }

  const poremMatches = (corrected.match(/\bporem\b/gi) || []).length;
  if (poremMatches > 0) {
    corrected = corrected.replace(/\bporem\b/gi, 'porém');
    changes.push({
      category: 'Ortografia',
      description: 'Corrigida a grafia de "porem" para "porém".',
      original: 'porem',
      corrected: 'porém'
    });
  }

  const initialCommas = (corrected.match(/,,+/g) || []).length;
  if (initialCommas > 0) {
    corrected = corrected.replace(/,,+/g, ',');
    changes.push({
      category: 'Pontuação',
      description: 'Corrigidas ocorrências de vírgulas duplicadas/múltiplas.',
      original: ',,',
      corrected: ','
    });
  }

  let ellipsisCount = 0;
  corrected = corrected.replace(/\.{3,}/g, () => {
    ellipsisCount++;
    return '…';
  });

  let doublePeriodsCount = 0;
  corrected = corrected.replace(/\.{2}/g, () => {
    doublePeriodsCount++;
    return '.';
  });

  if (doublePeriodsCount > 0) {
    changes.push({
      category: 'Pontuação',
      description: 'Corrigidas ocorrências de pontos finais duplicados (..).',
      original: '..',
      corrected: '.'
    });
  }
  if (ellipsisCount > 0) {
    changes.push({
      category: 'Pontuação',
      description: 'Padronizadas ocorrências de reticências (...)',
      original: '...',
      corrected: '...'
    });
  }

  const spacePunctMatches = (corrected.match(/\s+([.,!?:;…])/g) || []).length;
  if (spacePunctMatches > 0) {
    corrected = corrected.replace(/\s+([.,!?:;…])/g, '$1');
    changes.push({
      category: 'Espaçamento',
      description: 'Removidos espaços desnecessários antes de pontuações.',
      original: ' [pontuação]',
      corrected: '[pontuação]'
    });
  }

  const missingSpaceMatches = (corrected.match(/([.,!?:;…])([^\s\d"'\\])/g) || []).length;
  if (missingSpaceMatches > 0) {
    corrected = corrected.replace(/([.,!?:;…])([^\s\d"'\\])/g, '$1 $2');
    changes.push({
      category: 'Espaçamento',
      description: 'Adicionados espaços necessários após pontuações.',
      original: '[pontuação][letra]',
      corrected: '[pontuação] [letra]'
    });
  }

  // Apply custom context heuristics
  const heuristicResult = applyCustomHeuristics(corrected);
  corrected = heuristicResult.corrected;
  changes = changes.concat(heuristicResult.changes);

  corrected = corrected.replace(/…/g, '...');

  return { corrected, changes };
}
