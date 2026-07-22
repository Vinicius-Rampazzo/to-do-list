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
      card.addEventListener('click', () => this.loadTool(card.dataset.tool));
    });
  },

  loadTool(tool) {
    this.cards.forEach(c => c.style.borderColor = 'var(--clr-border)');
    document.querySelector(`[data-tool="${tool}"]`).style.borderColor = 'var(--clr-accent)';

    switch(tool) {
      case 'password': this.renderPasswordGenerator(); break;
      case 'counter': this.renderCharCounter(); break;
      case 'json': this.renderJsonFormatter(); break;
      case 'qrcode': this.renderQrCode(); break;
      case 'text': this.renderTextOrganizer(); break;
    }
  },

  renderPasswordGenerator() {
    this.toolContainer.innerHTML = `
      <h3 style="margin-bottom: var(--space-4);">Gerador de Senha</h3>
      
      <div style="display: flex; gap: var(--space-2); margin-bottom: var(--space-4);">
        <input type="text" id="pwd-result" class="task-input" readonly style="font-family: monospace; font-size: var(--fs-lg);" />
        <button id="btn-copy-pwd" class="btn btn-primary"><i data-lucide="copy"></i> Copiar</button>
      </div>

      <div style="margin-bottom: var(--space-4);">
        <label style="display: flex; justify-content: space-between; margin-bottom: var(--space-2);">
          <span>Tamanho: <span id="pwd-len-val">16</span></span>
        </label>
        <input type="range" id="pwd-len" min="8" max="64" value="16" style="width: 100%;" />
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); margin-bottom: var(--space-4);">
        <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer;">
          <input type="checkbox" id="pwd-uc" checked /> Maiúsculas (A-Z)
        </label>
        <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer;">
          <input type="checkbox" id="pwd-lc" checked /> Minúsculas (a-z)
        </label>
        <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer;">
          <input type="checkbox" id="pwd-num" checked /> Números (0-9)
        </label>
        <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer;">
          <input type="checkbox" id="pwd-sym" checked /> Símbolos (!@#$...)
        </label>
      </div>

      <button id="btn-gen-pwd" class="btn btn-secondary" style="width: 100%; justify-content: center;"><i data-lucide="refresh-cw"></i> Gerar Outra</button>
    `;
    if (window.lucide) window.lucide.createIcons();

    const result = document.getElementById('pwd-result');
    const len = document.getElementById('pwd-len');
    const lenVal = document.getElementById('pwd-len-val');
    const uc = document.getElementById('pwd-uc');
    const lc = document.getElementById('pwd-lc');
    const num = document.getElementById('pwd-num');
    const sym = document.getElementById('pwd-sym');

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
        return;
      }
      
      let pwd = '';
      const length = parseInt(len.value);
      for(let i=0; i<length; i++) {
        pwd += allowed.charAt(Math.floor(Math.random() * allowed.length));
      }
      result.value = pwd;
    };

    len.addEventListener('input', () => { lenVal.textContent = len.value; generate(); });
    [uc, lc, num, sym].forEach(el => el.addEventListener('change', generate));
    document.getElementById('btn-gen-pwd').addEventListener('click', generate);
    
    document.getElementById('btn-copy-pwd').addEventListener('click', () => {
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

  renderTextOrganizer() {
    this.toolContainer.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
        <h3>Organizador de Texto</h3>
        <button id="btn-txt-clear" class="btn btn-secondary btn-sm"><i data-lucide="trash"></i> Limpar Tudo</button>
      </div>
      
      <div style="display: flex; gap: var(--space-2); flex-wrap: wrap; margin-bottom: var(--space-3);">
        <button class="btn btn-secondary btn-sm text-action" data-action="uppercase">MAIÚSCULAS</button>
        <button class="btn btn-secondary btn-sm text-action" data-action="lowercase">minúsculas</button>
        <button class="btn btn-secondary btn-sm text-action" data-action="capitalize">Capitalizar Frases</button>
        <button class="btn btn-secondary btn-sm text-action" data-action="punct">Corrigir Pontuação</button>
        <button class="btn btn-secondary btn-sm text-action" data-action="trim">Remover Espaços Extras</button>
        <button class="btn btn-secondary btn-sm text-action" data-action="empty">Remover Linhas Vazias</button>
      </div>

      <div style="display: flex; gap: var(--space-3);">
        <div style="flex: 1;">
          <textarea id="txt-input" class="task-input" placeholder="Texto original..." style="min-height: 250px; resize: vertical;"></textarea>
        </div>
        <div style="display: flex; flex-direction: column; justify-content: center; color: var(--clr-text-muted);">
          <i data-lucide="arrow-right"></i>
        </div>
        <div style="flex: 1; position: relative;">
          <textarea id="txt-output" class="task-input" placeholder="Resultado..." readonly style="min-height: 250px; resize: vertical; background: var(--clr-bg);"></textarea>
          <button id="btn-txt-copy" class="btn btn-primary btn-sm" style="position: absolute; bottom: var(--space-3); right: var(--space-3);"><i data-lucide="copy"></i> Copiar</button>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();

    const input = document.getElementById('txt-input');
    const output = document.getElementById('txt-output');

    document.querySelectorAll('.text-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        let text = input.value;
        if (!text) return;
        
        const action = e.target.dataset.action;

        switch(action) {
          case 'uppercase': 
            text = text.toUpperCase(); 
            break;
          case 'lowercase': 
            text = text.toLowerCase(); 
            break;
          case 'trim': 
            text = text.split('\n').map(l => l.trim().replace(/\s+/g, ' ')).join('\n'); 
            break;
          case 'empty': 
            text = text.split('\n').filter(l => l.trim() !== '').join('\n'); 
            break;
          case 'punct':
            // Corrigir espaços em pontuações
            // Ex: "texto , texto" -> "texto, texto"
            text = text.replace(/\s+([.,!?:;])/g, '$1');
            // Garante espaço APÓS pontuação se a próxima letra for palavra, mas preserva acrônimos ou números
            text = text.replace(/([.,!?:;])([^\s\d"'\\])/g, '$1 $2');
            break;
          case 'capitalize':
            // Capitaliza o início do parágrafo
            text = text.replace(/(^\s*|[.!?]\s+)([a-z])/g, (match, sep, char) => {
              return sep + char.toUpperCase();
            });
            break;
        }
        
        output.value = text;
      });
    });

    document.getElementById('btn-txt-copy').addEventListener('click', () => {
      if (output.value) navigator.clipboard.writeText(output.value);
    });

    document.getElementById('btn-txt-clear').addEventListener('click', () => {
      input.value = '';
      output.value = '';
    });
  }
};
