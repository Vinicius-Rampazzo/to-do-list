(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={get(e,t=null){try{let n=localStorage.getItem(e);return n?JSON.parse(n):t}catch(n){return console.error(`Erro ao ler ${e} do localStorage:`,n),t}},set(e,t){try{return localStorage.setItem(e,JSON.stringify(t)),!0}catch(t){return console.error(`Erro ao salvar ${e} no localStorage:`,t),!1}},remove(e){try{localStorage.removeItem(e)}catch(t){console.error(`Erro ao remover ${e}:`,t)}},clear(){try{localStorage.clear()}catch(e){console.error(`Erro ao limpar localStorage:`,e)}}},t=`wb-tasks`,n=`imobi-todo-tasks`;function r(){return`task-${Date.now()}-${Math.random().toString(36).slice(2,7)}`}var i={migrateLegacyTasks(){let i=localStorage.getItem(n);if(i)try{let a=JSON.parse(i).map((e,t)=>({id:e.id||r(),title:e.text||`Tarefa sem título`,description:``,completed:!!e.completed,priority:`medium`,category:``,dueDate:null,createdAt:new Date().toISOString(),completedAt:e.completed?new Date().toISOString():null,order:t,totalTimeSeconds:0}));e.get(t)||e.set(t,a),localStorage.removeItem(n)}catch(e){console.error(`Erro ao migrar tarefas antigas:`,e)}},getAll(){return e.get(t,[])},getById(e){return this.getAll().find(t=>t.id===e)||null},getPending(){return this.getAll().filter(e=>!e.completed)},getCompleted(){return this.getAll().filter(e=>e.completed)},getCompletedToday(){let e=new Date().toISOString().split(`T`)[0];return this.getCompleted().filter(t=>t.completedAt?t.completedAt.split(`T`)[0]===e:!1)},create(n){let i=this.getAll(),a={id:r(),title:n.title,description:n.description||``,completed:!1,priority:n.priority||`medium`,category:n.category||``,dueDate:n.dueDate||null,createdAt:new Date().toISOString(),completedAt:null,order:i.length>0?Math.max(...i.map(e=>e.order))+1:0,totalTimeSeconds:0,...n};return i.push(a),e.set(t,i),a},update(n,r){let i=this.getAll(),a=i.findIndex(e=>e.id===n);return a===-1?null:(r.completed!==void 0&&r.completed!==i[a].completed&&(r.completed?r.completedAt=new Date().toISOString():r.completedAt=null),i[a]={...i[a],...r},e.set(t,i),i[a])},delete(n){let r=this.getAll();r=r.filter(e=>e.id!==n),e.set(t,r)},reorder(n,r){let i=this.getAll(),a=i.findIndex(e=>e.id===n),o=i.findIndex(e=>e.id===r);if(a===-1||o===-1)return;let[s]=i.splice(a,1);i.splice(o,0,s),i.forEach((e,t)=>e.order=t),e.set(t,i)},addTime(n,r){let i=this.getAll(),a=i.findIndex(e=>e.id===n);return a===-1?null:(i[a].totalTimeSeconds=(i[a].totalTimeSeconds||0)+r,e.set(t,i),i[a])}},a={routes:{},currentRoute:null,container:null,init(e){this.container=document.getElementById(e),window.addEventListener(`hashchange`,()=>this.handleRoute()),this.handleRoute()},add(e,t){this.routes[e]=t},async handleRoute(){let e=(window.location.hash||`#/hoje`).split(`?`)[0],t=this.routes[e];t?(this.currentRoute&&this.currentRoute.destroy&&this.currentRoute.destroy(),this.currentRoute=t,t.render&&(this.container.innerHTML=await t.render()),t.init&&t.init(),document.querySelectorAll(`.nav-item`).forEach(t=>{t.classList.toggle(`active`,t.getAttribute(`href`)===e)}),window.lucide&&window.lucide.createIcons()):window.location.hash=`#/hoje`}};function o(){return`
    <div class="sidebar-header">
      <div class="brand-icon"><i data-lucide="layout-dashboard"></i></div>
      <div>
        <h1 class="brand-title">WorkBase</h1>
        <span class="brand-sub">ImobiBrasil</span>
      </div>
    </div>
    <nav class="sidebar-nav">
      <a href="#/hoje" class="nav-item"><i data-lucide="sun"></i> Hoje</a>
      <a href="#/tarefas" class="nav-item"><i data-lucide="check-square"></i> Tarefas</a>
      <a href="#/foco" class="nav-item"><i data-lucide="timer"></i> Foco</a>
      <a href="#/notas" class="nav-item"><i data-lucide="sticky-note"></i> Notas</a>
      <a href="#/ferramentas" class="nav-item"><i data-lucide="wrench"></i> Ferramentas</a>
    </nav>
    <div class="sidebar-footer">
      <a href="#/configuracoes" class="nav-item"><i data-lucide="settings"></i> Configurações</a>
    </div>
  `}function s(){return`
    <a href="#/hoje" class="nav-item"><i data-lucide="sun"></i><span>Hoje</span></a>
    <a href="#/tarefas" class="nav-item"><i data-lucide="check-square"></i><span>Tarefas</span></a>
    <a href="#/foco" class="nav-item"><i data-lucide="timer"></i><span>Foco</span></a>
    <a href="#/notas" class="nav-item"><i data-lucide="sticky-note"></i><span>Notas</span></a>
    <a href="#/ferramentas" class="nav-item"><i data-lucide="more-horizontal"></i><span>Mais</span></a>
  `}var c=`wb-time-sessions`,l=`wb-active-timer`;function u(){return`session-${Date.now()}-${Math.random().toString(36).slice(2,7)}`}var d={getAll(){return e.get(c,[])},getTodaySessions(){let e=new Date().toISOString().split(`T`)[0];return this.getAll().filter(t=>t.endedAt?t.endedAt.split(`T`)[0]===e:!1)},getTotalFocusToday(){return this.getTodaySessions().reduce((e,t)=>e+t.durationInSeconds,0)},create(t){let n=this.getAll(),r={id:u(),taskId:t.taskId||null,type:t.type||`stopwatch`,startedAt:t.startedAt||new Date().toISOString(),endedAt:t.endedAt||new Date().toISOString(),durationInSeconds:t.durationInSeconds||0,label:t.label||``};return n.push(r),e.set(c,n),r},getActiveTimer(){return e.get(l,null)},setActiveTimer(t){e.set(l,t)},clearActiveTimer(){e.remove(l)},clearTodaySessions(){let t=new Date().toISOString().split(`T`)[0],n=this.getAll().filter(e=>!e.endedAt||e.endedAt.split(`T`)[0]!==t);e.set(c,n)}},f=`wb-settings`,p={userName:`Vinícius`,pomodoroDuration:25,breakDuration:5,longBreakDuration:15,longBreakInterval:4,theme:`light`,categories:[`Trabalho`,`Pessoal`,`Estudo`,`Projetos`]},m={get(){return e.get(f,p)},update(t){let n={...this.get(),...t};return e.set(f,n),n}},h=new class{constructor(){this.intervalId=null,this.listeners=new Set;let e=m.get();this.pomodoroDuration=e.pomodoroDuration*60,this.breakDuration=e.breakDuration*60,this.longBreakDuration=e.longBreakDuration*60,this.longBreakInterval=e.longBreakInterval,this.restoreState()}restoreState(){let e=d.getActiveTimer();if(e){if(this.state=e,this.state.isRunning){let e=Date.now(),t=Math.floor((e-this.state.lastTick)/1e3);this.state.mode===`stopwatch`?this.state.seconds+=t:(this.state.seconds-=t,this.state.seconds<=0&&(this.state.seconds=0,this.state.isRunning=!1,this.handleCompletion())),this.state.lastTick=e,this.state.isRunning?this.startTick():this.saveState()}}else this.resetState()}resetState(){this.state={mode:`stopwatch`,phase:`focus`,seconds:0,initialSeconds:0,isRunning:!1,taskId:null,startedAt:null,lastTick:null,completedCycles:0,pomodoroDuration:this.pomodoroDuration,breakDuration:this.breakDuration,longBreakDuration:this.longBreakDuration},this.saveState()}saveState(){d.setActiveTimer(this.state),this.notifyListeners()}startStopwatch(e=null){this.resetState(),this.state.mode=`stopwatch`,this.state.taskId=e,this.start()}startTimer(e,t=null){this.resetState(),this.state.mode=`timer`,this.state.seconds=e*60,this.state.initialSeconds=e*60,this.state.taskId=t,this.start()}startPomodoro(e=null,t=null,n=null){this.resetState(),this.state.mode=`pomodoro`,this.state.phase=`focus`,t&&(this.state.pomodoroDuration=t*60),n&&(this.state.breakDuration=n*60),this.state.seconds=this.state.pomodoroDuration,this.state.initialSeconds=this.state.pomodoroDuration,this.state.taskId=e,this.start()}start(){this.state.isRunning||(this.state.startedAt||(this.state.startedAt=new Date().toISOString()),this.state.isRunning=!0,this.state.lastTick=Date.now(),this.saveState(),this.startTick())}pause(){this.state.isRunning&&(this.state.isRunning=!1,clearInterval(this.intervalId),this.saveState())}stop(){if(this.pause(),this.state.startedAt){let e=this.state.mode===`stopwatch`?this.state.seconds:this.state.initialSeconds-this.state.seconds;e>0&&(d.create({taskId:this.state.taskId,type:this.state.mode,startedAt:this.state.startedAt,endedAt:new Date().toISOString(),durationInSeconds:e,label:this.state.phase}),this.state.taskId&&i.addTime(this.state.taskId,e))}this.resetState(),d.clearActiveTimer()}startTick(){clearInterval(this.intervalId),this.intervalId=setInterval(()=>{if(this.state.lastTick=Date.now(),this.state.mode===`stopwatch`)this.state.seconds++;else if(this.state.seconds--,this.state.seconds<=0){this.state.seconds=0,this.pause(),this.handleCompletion();return}this.saveState()},1e3)}handleCompletion(){if(this.playNotificationSound(),this.showBrowserNotification(`Tempo esgotado!`,`Sua sessão foi concluída.`),this.state.startedAt){let e=this.state.initialSeconds;d.create({taskId:this.state.taskId,type:this.state.mode,startedAt:this.state.startedAt,endedAt:new Date().toISOString(),durationInSeconds:e,label:this.state.phase}),this.state.taskId&&i.addTime(this.state.taskId,e)}this.state.mode===`pomodoro`?this.advancePomodoroPhase():(this.resetState(),d.clearActiveTimer())}advancePomodoroPhase(){this.state.phase===`focus`?(this.state.completedCycles++,this.state.completedCycles%this.state.longBreakInterval===0?(this.state.phase=`longBreak`,this.state.seconds=this.state.longBreakDuration,this.state.initialSeconds=this.state.longBreakDuration):(this.state.phase=`break`,this.state.seconds=this.state.breakDuration,this.state.initialSeconds=this.state.breakDuration)):(this.state.phase=`focus`,this.state.seconds=this.state.pomodoroDuration,this.state.initialSeconds=this.state.pomodoroDuration),this.state.startedAt=null,this.saveState()}playNotificationSound(){try{let e=new(window.AudioContext||window.webkitAudioContext),t=e.createOscillator(),n=e.createGain();t.connect(n),n.connect(e.destination),t.type=`sine`,t.frequency.setValueAtTime(800,e.currentTime),t.frequency.exponentialRampToValueAtTime(400,e.currentTime+.3),n.gain.setValueAtTime(1,e.currentTime),n.gain.exponentialRampToValueAtTime(.01,e.currentTime+.3),t.start(),t.stop(e.currentTime+.3)}catch(e){console.log(`Audio não suportado ou bloqueado`,e)}}showBrowserNotification(e,t){`Notification`in window&&(Notification.permission===`granted`?new Notification(e,{body:t,icon:`/favicon.svg`}):Notification.permission!==`denied`&&Notification.requestPermission().then(n=>{n===`granted`&&new Notification(e,{body:t,icon:`/favicon.svg`})}))}addListener(e){this.listeners.add(e),e(this.state)}removeListener(e){this.listeners.delete(e)}notifyListeners(){this.listeners.forEach(e=>e(this.state))}};function g(){return`
    <div id="floating-timer" class="floating-timer" style="display: none;">
      <div class="floating-timer-info">
        <span id="floating-timer-display" class="floating-time">00:00:00</span>
        <span id="floating-timer-task" class="floating-task">Sem tarefa</span>
      </div>
      <div class="floating-timer-actions">
        <button id="floating-btn-playpause" class="btn-icon" aria-label="Pausar/Retomar">
          <i data-lucide="pause"></i>
        </button>
        <a href="#/foco" class="btn-icon" aria-label="Ir ao foco">
          <i data-lucide="external-link"></i>
        </a>
      </div>
    </div>
  `}function _(){let e=document.getElementById(`floating-timer`),t=document.getElementById(`floating-timer-display`),n=document.getElementById(`floating-timer-task`),r=document.getElementById(`floating-btn-playpause`);e&&(h.addListener(a=>{let o=window.location.hash.startsWith(`#/foco`);if((a.seconds>0||a.isRunning||a.startedAt)&&!o){e.style.display=`flex`;let o=Math.floor(a.seconds/3600).toString().padStart(2,`0`),s=Math.floor(a.seconds%3600/60).toString().padStart(2,`0`),c=(a.seconds%60).toString().padStart(2,`0`);if(t.textContent=a.mode===`stopwatch`?`${o}:${s}:${c}`:`${s}:${c}`,a.taskId){let e=i.getById(a.taskId);n.textContent=e?e.title:`Tarefa excluída`}else a.mode===`pomodoro`?n.textContent=`Pomodoro: ${{focus:`Foco`,break:`Descanso`,longBreak:`Descanso Longo`}[a.phase]}`:n.textContent=`Sessão livre`;r.innerHTML=a.isRunning?`<i data-lucide="pause"></i>`:`<i data-lucide="play"></i>`,window.lucide&&window.lucide.createIcons()}else e.style.display=`none`}),r.addEventListener(`click`,()=>{h.state.isRunning?h.pause():h.start()}))}var v=`wb-notes`;function y(){return`note-${Date.now()}-${Math.random().toString(36).slice(2,7)}`}var b={getAll(){return e.get(v,[])},getById(e){return this.getAll().find(t=>t.id===e)||null},getPinned(){return this.getAll().filter(e=>e.pinned)},search(e){if(!e)return this.getAll();let t=e.toLowerCase();return this.getAll().filter(e=>e.content.toLowerCase().includes(t))},create(t,n=!1){let r=this.getAll(),i=r.length>0?Math.max(...r.map(e=>e.order||0)):0,a={id:y(),content:t,pinned:n,order:i+1,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};return r.push(a),e.set(v,r),a},update(t,n){let r=this.getAll(),i=r.findIndex(e=>e.id===t);return i===-1?null:(n.updatedAt=new Date().toISOString(),r[i]={...r[i],...n},e.set(v,r),r[i])},delete(t){let n=this.getAll();n=n.filter(e=>e.id!==t),e.set(v,n)},togglePin(e){let t=this.getById(e);return t?this.update(e,{pinned:!t.pinned}):null},reorder(t,n){let r=this.getAll();r.sort((e,t)=>e.pinned===t.pinned?(e.order||0)-(t.order||0):t.pinned?1:-1);let i=r.findIndex(e=>e.id===t),a=r.findIndex(e=>e.id===n);if(i===-1||a===-1||r[i].pinned||r[a].pinned)return;let[o]=r.splice(i,1);r.splice(a,0,o);let s=1;r.forEach(e=>{e.pinned||(e.order=s++)}),e.set(v,r)}},x={render(){let e=m.get(),t=i.getPending(),n=i.getCompleted(),r=i.getCompletedToday(),a=d.getTotalFocusToday(),o=d.getTodaySessions(),s=b.getAll(),c=s.filter(e=>e.pinned),l=Math.floor(a/3600),u=Math.floor(a%3600/60),f=l>0?`${l}h${u}min`:`${u}min`,p=new Date().getHours(),h=`Bom dia`;return p>=12&&p<18&&(h=`Boa tarde`),p>=18&&(h=`Boa noite`),`
      <div class="module-header">
        <h2>${h}, ${e.userName}</h2>
        <p class="text-muted">Aqui está o panorama da sua produtividade.</p>
      </div>

      <!-- Cards de resumo do DIA -->
      <div class="dashboard-cards" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
        <div class="dash-card">
          <div class="dash-icon" style="background: rgba(249, 115, 22, 0.1); color: #f97316;">
            <i data-lucide="circle-dashed"></i>
          </div>
          <div class="dash-info">
            <span class="dash-value">${t.length}</span>
            <span class="dash-label">Pendentes</span>
          </div>
        </div>
        
        <div class="dash-card">
          <div class="dash-icon success">
            <i data-lucide="check-circle-2"></i>
          </div>
          <div class="dash-info">
            <span class="dash-value">${r.length}</span>
            <span class="dash-label">Concluídas hoje</span>
          </div>
        </div>

        <div class="dash-card">
          <div class="dash-icon focus">
            <i data-lucide="timer"></i>
          </div>
          <div class="dash-info">
            <span class="dash-value">${f}</span>
            <span class="dash-label">Foco hoje</span>
          </div>
        </div>

        <div class="dash-card">
          <div class="dash-icon" style="background: rgba(168, 85, 247, 0.1); color: #a855f7;">
            <i data-lucide="activity"></i>
          </div>
          <div class="dash-info">
            <span class="dash-value">${o.length}</span>
            <span class="dash-label">Sessões hoje</span>
          </div>
        </div>
      </div>

      <div class="dashboard-actions">
        <a href="#/foco" class="btn btn-primary"><i data-lucide="play"></i> Iniciar sessão de foco</a>
      </div>

      <!-- Grid de seções -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: var(--space-4);">
        
        <!-- Tarefas do dia -->
        <div class="dashboard-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
            <h3>Próximas tarefas</h3>
            <a href="#/tarefas" style="font-size: var(--fs-sm); color: var(--clr-accent); text-decoration: none; font-weight: 600;">Ver todas →</a>
          </div>
          <ul class="task-list" id="hoje-task-list">
            <!-- preenchido via JS -->
          </ul>
        </div>

        <!-- Notas fixadas / recentes -->
        <div class="dashboard-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
            <h3>${c.length>0?`Notas fixadas`:`Notas recentes`}</h3>
            <a href="#/notas" style="font-size: var(--fs-sm); color: var(--clr-accent); text-decoration: none; font-weight: 600;">Ver todas →</a>
          </div>
          <ul class="task-list" id="hoje-notes-list">
            <!-- preenchido via JS -->
          </ul>
        </div>
      </div>

      <!-- Visão geral -->
      <div class="dashboard-section" style="margin-top: var(--space-4);">
        <h3 style="margin-bottom: var(--space-4);">Visão geral</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: var(--space-4);">
          <div style="text-align: center; padding: var(--space-4); background: var(--clr-bg); border-radius: var(--radius-md);">
            <div style="font-size: var(--fs-xl); font-weight: 700; color: var(--clr-text-primary);">${t.length+n.length}</div>
            <div style="font-size: var(--fs-xs); color: var(--clr-text-muted); text-transform: uppercase;">Total de tarefas</div>
          </div>
          <div style="text-align: center; padding: var(--space-4); background: var(--clr-bg); border-radius: var(--radius-md);">
            <div style="font-size: var(--fs-xl); font-weight: 700; color: var(--clr-accent);">${n.length}</div>
            <div style="font-size: var(--fs-xs); color: var(--clr-text-muted); text-transform: uppercase;">Total concluídas</div>
          </div>
          <div style="text-align: center; padding: var(--space-4); background: var(--clr-bg); border-radius: var(--radius-md);">
            <div style="font-size: var(--fs-xl); font-weight: 700; color: #a855f7;">${s.length}</div>
            <div style="font-size: var(--fs-xs); color: var(--clr-text-muted); text-transform: uppercase;">Notas salvas</div>
          </div>
          <div style="text-align: center; padding: var(--space-4); background: var(--clr-bg); border-radius: var(--radius-md);">
            <div style="font-size: var(--fs-xl); font-weight: 700; color: #3b82f6;">${this.getTotalFocusFormatted()}</div>
            <div style="font-size: var(--fs-xs); color: var(--clr-text-muted); text-transform: uppercase;">Foco total</div>
          </div>
        </div>
      </div>
    `},getTotalFocusFormatted(){let e=d.getAll().reduce((e,t)=>e+(t.durationInSeconds||0),0),t=Math.floor(e/3600),n=Math.floor(e%3600/60);return t>0?`${t}h${n}m`:`${n}min`},init(){this.renderTasks(),this.renderNotes()},renderTasks(){let e=document.getElementById(`hoje-task-list`);if(!e)return;let t=i.getPending().slice(0,5);if(t.length===0){e.innerHTML=`<p class="text-muted" style="padding: var(--space-3) 0;">Nenhuma tarefa pendente. Parabéns! 🎉</p>`;return}e.innerHTML=t.map(e=>`
      <li class="task-item-simple">
        <div style="display: flex; align-items: center; gap: var(--space-3);">
          <span style="color: var(--clr-text-muted);"><i data-lucide="circle-dashed" style="width: 16px; height: 16px;"></i></span>
          <span class="task-text">${e.title}</span>
        </div>
      </li>
    `).join(``),window.lucide&&window.lucide.createIcons()},renderNotes(){let e=document.getElementById(`hoje-notes-list`);if(!e)return;let t=b.getAll(),n=t.filter(e=>e.pinned),r=n.length>0?n.slice(0,4):t.sort((e,t)=>new Date(t.updatedAt)-new Date(e.updatedAt)).slice(0,4);if(r.length===0){e.innerHTML=`<p class="text-muted" style="padding: var(--space-3) 0;">Nenhuma nota salva ainda.</p>`;return}e.innerHTML=r.map(e=>{let t=e.content.split(`
`)[0].substring(0,80);return`
        <li class="task-item-simple">
          <div style="display: flex; align-items: center; gap: var(--space-3);">
            <span style="color: ${e.pinned?`var(--clr-accent)`:`var(--clr-text-muted)`};"><i data-lucide="${e.pinned?`pin`:`file-text`}" style="width: 16px; height: 16px;"></i></span>
            <span class="task-text" style="color: var(--clr-text-secondary);">${this.escapeHtml(t)}${e.content.length>80?`...`:``}</span>
          </div>
        </li>
      `}).join(``),window.lucide&&window.lucide.createIcons()},escapeHtml(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)},destroy(){}},S=null,C={render(){return`
      <div class="module-header">
        <h2>Tarefas</h2>
      </div>

      <div class="dashboard-cards" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-bottom: var(--space-6);">
        <div class="dash-card">
          <div class="dash-icon" style="background: rgba(249, 115, 22, 0.1); color: #f97316;">
            <i data-lucide="circle-dashed"></i>
          </div>
          <div class="dash-info">
            <span class="dash-value" id="count-pending">0</span>
            <span class="dash-label">Pendentes</span>
          </div>
        </div>
        <div class="dash-card">
          <div class="dash-icon success">
            <i data-lucide="check-circle-2"></i>
          </div>
          <div class="dash-info">
            <span class="dash-value" id="count-done">0</span>
            <span class="dash-label">Concluídas</span>
          </div>
        </div>
      </div>

      <div class="app-card">
        <section class="add-task-section">
          <div class="input-wrapper">
            <span class="input-icon"><i data-lucide="plus"></i></span>
            <input type="text" id="input-nova-tarefa" class="task-input" placeholder="Nova tarefa..." autocomplete="off" />
          </div>
          <button id="btn-adicionar" class="btn btn-primary"><i data-lucide="plus-circle"></i> Adicionar</button>
        </section>

        <p class="hint-text"><i data-lucide="info"></i> Duplo clique para expandir · Arraste para reordenar</p>

        <ol id="lista-tarefas" class="task-list"></ol>

        <div id="empty-state" class="empty-state" hidden>
          <span class="empty-icon"><i data-lucide="clipboard-list"></i></span>
          <p>Nenhuma tarefa ainda.</p>
        </div>
      </div>
      
      <footer class="app-footer">
        <button id="btn-remover-finalizados" class="btn btn-secondary"><i data-lucide="trash-2"></i> Remover Concluídas</button>
      </footer>
    `},init(){this.listaTarefas=document.getElementById(`lista-tarefas`),this.inputNovaTarefa=document.getElementById(`input-nova-tarefa`),this.btnAdicionar=document.getElementById(`btn-adicionar`),this.emptyState=document.getElementById(`empty-state`),this.countPending=document.getElementById(`count-pending`),this.countDone=document.getElementById(`count-done`),this.bindEvents(),this.renderTasks()},bindEvents(){this.btnAdicionar.addEventListener(`click`,()=>this.addTask()),this.inputNovaTarefa.addEventListener(`keydown`,e=>{e.key===`Enter`&&this.addTask()}),document.getElementById(`btn-remover-finalizados`).addEventListener(`click`,()=>{i.getCompleted().forEach(e=>i.delete(e.id)),this.renderTasks()}),document.addEventListener(`keydown`,this.handleEscape.bind(this)),document.addEventListener(`click`,this.handleClickOutside.bind(this))},handleEscape(e){e.key===`Escape`&&this.listaTarefas&&this.listaTarefas.querySelectorAll(`.task-item.expanded`).forEach(e=>{e.classList.remove(`expanded`),e.setAttribute(`draggable`,`true`)})},handleClickOutside(e){this.listaTarefas&&!e.target.closest(`.task-item`)&&!e.target.closest(`#btn-remover-finalizados`)&&this.listaTarefas.querySelectorAll(`.task-item.expanded`).forEach(e=>{e.classList.remove(`expanded`),e.setAttribute(`draggable`,`true`)})},addTask(){let e=this.inputNovaTarefa.value.trim();e&&(i.create({title:e}),this.inputNovaTarefa.value=``,this.inputNovaTarefa.focus(),this.renderTasks())},renderTasks(){if(!this.listaTarefas)return;let e=i.getAll().sort((e,t)=>e.order-t.order);this.listaTarefas.innerHTML=``,e.forEach((e,t)=>{let n=document.createElement(`li`);n.className=`task-item`,n.setAttribute(`data-id`,e.id),n.setAttribute(`draggable`,`true`),e.completed&&n.classList.add(`completed`),n.innerHTML=`
        <div class="item-main-row">
          <span class="drag-handle"><i data-lucide="grip-vertical"></i></span>
          <span class="task-num">${t+1}</span>
          <span class="task-checkbox" role="checkbox" aria-checked="${e.completed}"></span>
          <span class="task-text">${this.escapeHtml(e.title)}</span>
          <button class="btn-delete-item" data-id="${e.id}"><i data-lucide="x"></i></button>
        </div>
        <div class="expanded-content">
          <p class="expanded-text" tabindex="0">${this.escapeHtml(e.title)}</p>
          <div class="expanded-actions">
            <span class="expanded-hint"><i data-lucide="mouse-pointer-2"></i> Selecione para copiar</span>
            <div style="display: flex; gap: var(--space-2);">
              <button class="btn-copy-task btn-start-timer" data-id="${e.id}"><i data-lucide="timer"></i> Focar</button>
              <button class="btn-copy-task btn-copy-action"><i data-lucide="copy"></i> Copiar</button>
            </div>
          </div>
        </div>
      `,n.querySelector(`.task-checkbox`).addEventListener(`click`,t=>{t.stopPropagation(),i.update(e.id,{completed:!e.completed}),this.renderTasks()}),n.querySelector(`.btn-delete-item`).addEventListener(`click`,t=>{t.stopPropagation(),i.delete(e.id),this.renderTasks()}),n.addEventListener(`dblclick`,e=>{e.target.closest(`.btn-delete-item`)||e.target.closest(`.task-checkbox`)||e.target.closest(`.expanded-actions`)||this.toggleExpand(n)});let r=n.querySelector(`.btn-copy-action`);r.addEventListener(`click`,t=>{t.stopPropagation(),navigator.clipboard.writeText(e.title).then(()=>{r.innerHTML=`<i data-lucide="check"></i> Copiado!`,r.classList.add(`btn-copy-success`),window.lucide&&window.lucide.createIcons(),setTimeout(()=>{r.innerHTML=`<i data-lucide="copy"></i> Copiar`,r.classList.remove(`btn-copy-success`),window.lucide&&window.lucide.createIcons()},1800)})}),n.querySelector(`.btn-start-timer`).addEventListener(`click`,t=>{t.stopPropagation(),h.startStopwatch(e.id),window.location.hash=`#/foco`}),n.addEventListener(`dragstart`,this.onDragStart.bind(this)),n.addEventListener(`dragenter`,this.onDragEnter.bind(this)),n.addEventListener(`dragover`,this.onDragOver.bind(this)),n.addEventListener(`dragleave`,this.onDragLeave.bind(this)),n.addEventListener(`drop`,this.onDrop.bind(this)),n.addEventListener(`dragend`,this.onDragEnd.bind(this)),this.listaTarefas.appendChild(n)}),this.updateCounters(e),e.length===0?this.emptyState.removeAttribute(`hidden`):this.emptyState.setAttribute(`hidden`,``),window.lucide&&window.lucide.createIcons()},toggleExpand(e){let t=e.classList.contains(`expanded`);this.listaTarefas.querySelectorAll(`.task-item.expanded`).forEach(e=>{e.classList.remove(`expanded`),e.setAttribute(`draggable`,`true`)}),t||(e.classList.add(`expanded`),e.setAttribute(`draggable`,`false`),e.querySelector(`.expanded-text`)?.focus())},onDragStart(e){S=e.currentTarget.dataset.id,e.currentTarget.classList.add(`dragging`),e.dataTransfer.effectAllowed=`move`,e.dataTransfer.setData(`text/plain`,S)},onDragEnter(e){e.preventDefault();let t=e.currentTarget;t.dataset.id!==S&&t.classList.add(`drag-over`)},onDragOver(e){e.preventDefault(),e.dataTransfer.dropEffect=`move`},onDragLeave(e){e.currentTarget.classList.remove(`drag-over`)},onDrop(e){e.preventDefault();let t=e.currentTarget.dataset.id;e.currentTarget.classList.remove(`drag-over`),!(!S||S===t)&&(i.reorder(S,t),this.renderTasks())},onDragEnd(e){e.currentTarget.classList.remove(`dragging`),this.listaTarefas.querySelectorAll(`.drag-over`).forEach(e=>{e.classList.remove(`drag-over`)}),S=null},updateCounters(e){let t=e.filter(e=>!e.completed).length,n=e.filter(e=>e.completed).length;this.countPending.textContent=t,this.countDone.textContent=n},escapeHtml(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)},destroy(){document.removeEventListener(`keydown`,this.handleEscape),document.removeEventListener(`click`,this.handleClickOutside)}},w={render(){return`
      <div class="module-header">
        <h2>Foco</h2>
        <p class="text-muted">Concentre-se em suas tarefas e registre seu tempo.</p>
      </div>

      <div class="tabs-nav">
        <button class="tab-btn active" data-tab="stopwatch">Cronômetro</button>
        <button class="tab-btn" data-tab="timer">Temporizador</button>
        <button class="tab-btn" data-tab="pomodoro">Pomodoro</button>
      </div>

      <div class="app-card" style="text-align: center; padding: var(--space-8) var(--space-6);">
        
        <!-- Controles Temporizador -->
        <div id="controls-timer" style="display: none; margin-bottom: var(--space-5);">
          <div style="display: flex; justify-content: center; gap: var(--space-2); margin-bottom: var(--space-3); flex-wrap: wrap;">
            <button class="btn btn-secondary btn-sm preset-timer-btn" data-time="10">10m</button>
            <button class="btn btn-secondary btn-sm preset-timer-btn" data-time="20">20m</button>
            <button class="btn btn-secondary btn-sm preset-timer-btn" data-time="30">30m</button>
            <button class="btn btn-secondary btn-sm preset-timer-btn" data-time="45">45m</button>
            <button class="btn btn-secondary btn-sm preset-timer-btn" data-time="60">60m</button>
          </div>
          <div style="display: flex; justify-content: center; align-items: center; gap: var(--space-2);">
            <label class="text-muted" style="font-size: var(--fs-sm);">Personalizado:</label>
            <input type="number" id="input-timer-mins" class="task-input" value="25" min="1" max="180" style="width: 80px; text-align: center; padding: var(--space-1);" />
            <span class="text-muted" style="font-size: var(--fs-sm);">min</span>
          </div>
        </div>

        <!-- Controles Pomodoro -->
        <div id="controls-pomodoro" style="display: none; margin-bottom: var(--space-5);">
          <div style="display: flex; justify-content: center; gap: var(--space-2); margin-bottom: var(--space-3); flex-wrap: wrap;">
            <button class="btn btn-secondary btn-sm preset-pomo-btn" data-focus="25" data-break="5">Tradicional (25m/5m)</button>
            <button class="btn btn-secondary btn-sm preset-pomo-btn" data-focus="45" data-break="15">Longo (45m/15m)</button>
            <button class="btn btn-secondary btn-sm preset-pomo-btn" data-focus="15" data-break="3">Rápido (15m/3m)</button>
          </div>
          <div style="display: flex; justify-content: center; align-items: center; gap: var(--space-4);">
            <div>
              <label class="text-muted" style="display: block; font-size: var(--fs-xs);">Foco (min)</label>
              <input type="number" id="input-pomo-focus" class="task-input" value="25" min="1" style="width: 70px; text-align: center; padding: var(--space-1);" />
            </div>
            <div>
              <label class="text-muted" style="display: block; font-size: var(--fs-xs);">Descanso (min)</label>
              <input type="number" id="input-pomo-break" class="task-input" value="5" min="1" style="width: 70px; text-align: center; padding: var(--space-1);" />
            </div>
          </div>
        </div>

        <!-- Estado do Pomodoro -->
        <div id="pomodoro-info" style="display: none; margin-bottom: var(--space-4); background: var(--clr-bg); padding: var(--space-3); border-radius: var(--radius-md);">
          <span id="pomodoro-phase" style="font-weight: 700; color: var(--clr-accent); text-transform: uppercase; letter-spacing: 1px; font-size: var(--fs-sm);">FOCO — Ciclo 1 de 4</span>
          <div id="pomodoro-desc" style="margin-top: var(--space-1); color: var(--clr-text-muted); font-size: var(--fs-sm);">25 minutos de foco, depois 5 minutos de descanso</div>
        </div>

        <div id="timer-display" style="font-size: 4rem; font-weight: 700; font-variant-numeric: tabular-nums; color: var(--clr-text-primary); margin-bottom: var(--space-4);">
          00:00:00
        </div>
        
        <div style="max-width: 300px; margin: 0 auto var(--space-6);">
          <label style="display: block; text-align: left; font-size: var(--fs-sm); font-weight: 600; margin-bottom: var(--space-2);">Vincular à tarefa (opcional)</label>
          <select id="task-select" class="task-input" style="width: 100%; padding-left: var(--space-3);">
            <option value="">Nenhuma tarefa</option>
            <!-- preenchido via js -->
          </select>
        </div>

        <div style="display: flex; gap: var(--space-3); justify-content: center;">
          <button id="btn-start" class="btn btn-primary"><i data-lucide="play"></i> Iniciar</button>
          <button id="btn-pause" class="btn btn-secondary" style="display: none;"><i data-lucide="pause"></i> Pausar</button>
          <button id="btn-stop" class="btn btn-danger" style="display: none;"><i data-lucide="square"></i> Finalizar</button>
        </div>
      </div>

      <div class="dashboard-section" style="margin-top: var(--space-6);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
          <h3>Sessões de hoje</h3>
          <button id="btn-clear-sessions" class="btn btn-secondary btn-sm"><i data-lucide="trash"></i> Limpar Tudo</button>
        </div>
        <ul id="sessions-list" class="task-list"></ul>
      </div>
    `},init(){this.display=document.getElementById(`timer-display`),this.btnStart=document.getElementById(`btn-start`),this.btnPause=document.getElementById(`btn-pause`),this.btnStop=document.getElementById(`btn-stop`),this.taskSelect=document.getElementById(`task-select`),this.tabBtns=document.querySelectorAll(`.tab-btn`),this.controlsTimer=document.getElementById(`controls-timer`),this.controlsPomodoro=document.getElementById(`controls-pomodoro`),this.pomodoroInfo=document.getElementById(`pomodoro-info`),this.inputTimerMins=document.getElementById(`input-timer-mins`),this.inputPomoFocus=document.getElementById(`input-pomo-focus`),this.inputPomoBreak=document.getElementById(`input-pomo-break`),this.currentTab=h.state.mode,this.populateTasks(),this.renderSessions(),this.bindEvents(),this.bindSessionsEvents(),this.onStateChange=this.updateUI.bind(this),h.addListener(this.onStateChange),this.switchTab(this.currentTab)},populateTasks(){let e=i.getPending().map(e=>`<option value="${e.id}">${e.title}</option>`).join(``);this.taskSelect.insertAdjacentHTML(`beforeend`,e)},bindEvents(){this.tabBtns.forEach(e=>{e.addEventListener(`click`,e=>{if(h.state.isRunning){if(!confirm(`Um timer está rodando. Deseja parar e trocar de modo?`))return;h.stop()}this.switchTab(e.target.dataset.tab)})}),document.querySelectorAll(`.preset-timer-btn`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.target.dataset.time;this.inputTimerMins.value=t,this.updateDisplayPreview()})}),this.inputTimerMins.addEventListener(`input`,()=>this.updateDisplayPreview()),document.querySelectorAll(`.preset-pomo-btn`).forEach(e=>{e.addEventListener(`click`,e=>{this.inputPomoFocus.value=e.target.dataset.focus,this.inputPomoBreak.value=e.target.dataset.break,this.updateDisplayPreview()})}),this.inputPomoFocus.addEventListener(`input`,()=>this.updateDisplayPreview()),this.inputPomoBreak.addEventListener(`input`,()=>this.updateDisplayPreview()),this.btnStart.addEventListener(`click`,()=>{let e=this.taskSelect.value||null;if(this.currentTab===`stopwatch`)h.startStopwatch(e);else if(this.currentTab===`timer`){let t=parseInt(this.inputTimerMins.value)||25;h.startTimer(t,e)}else if(this.currentTab===`pomodoro`){let t=parseInt(this.inputPomoFocus.value)||25,n=parseInt(this.inputPomoBreak.value)||5;h.startPomodoro(e,t,n)}}),this.btnPause.addEventListener(`click`,()=>{h.state.isRunning?h.pause():h.start()}),this.btnStop.addEventListener(`click`,()=>{h.stop(),this.renderSessions(),this.updateDisplayPreview()})},switchTab(e){this.currentTab=e,this.tabBtns.forEach(t=>t.classList.toggle(`active`,t.dataset.tab===e));let t=h.state.isRunning||h.state.seconds>0||h.state.startedAt;this.controlsTimer.style.display=e===`timer`&&!t?`block`:`none`,this.controlsPomodoro.style.display=e===`pomodoro`&&!t?`block`:`none`,this.pomodoroInfo.style.display=e===`pomodoro`?`block`:`none`,this.updateDisplayPreview()},updateDisplayPreview(){if(!(h.state.isRunning||h.state.seconds>0||h.state.startedAt)){if(this.currentTab===`stopwatch`)this.display.textContent=`00:00:00`;else if(this.currentTab===`timer`){let e=parseInt(this.inputTimerMins.value)||0;this.display.textContent=`${e.toString().padStart(2,`0`)}:00`}else if(this.currentTab===`pomodoro`){let e=parseInt(this.inputPomoFocus.value)||0,t=parseInt(this.inputPomoBreak.value)||0;this.display.textContent=`${e.toString().padStart(2,`0`)}:00`,document.getElementById(`pomodoro-phase`).textContent=`FOCO — Ciclo 1 de 4`,document.getElementById(`pomodoro-phase`).style.color=`var(--clr-accent)`,document.getElementById(`pomodoro-desc`).textContent=`${e} minutos de foco, depois ${t} minutos de descanso.`}}},updateUI(e){this.currentTab!==e.mode&&(e.isRunning||e.seconds>0||e.startedAt)&&this.switchTab(e.mode);let t=e.mode===`stopwatch`,n=Math.floor(e.seconds/3600).toString().padStart(2,`0`),r=Math.floor(e.seconds%3600/60).toString().padStart(2,`0`),i=(e.seconds%60).toString().padStart(2,`0`);if((e.isRunning||e.seconds>0||e.startedAt)&&(this.display.textContent=t?`${n}:${r}:${i}`:`${r}:${i}`),e.isRunning||e.seconds>0||e.startedAt?(this.controlsTimer.style.display=`none`,this.controlsPomodoro.style.display=`none`):(this.currentTab===`timer`&&(this.controlsTimer.style.display=`block`),this.currentTab===`pomodoro`&&(this.controlsPomodoro.style.display=`block`)),e.isRunning?(this.btnStart.style.display=`none`,this.btnPause.style.display=`inline-flex`,this.btnStop.style.display=`inline-flex`,this.btnPause.innerHTML=`<i data-lucide="pause"></i> Pausar`,this.taskSelect.disabled=!0,e.taskId&&(this.taskSelect.value=e.taskId),this.tabBtns.forEach(e=>e.disabled=!0)):e.seconds>0||e.startedAt?(this.btnStart.style.display=`none`,this.btnPause.style.display=`inline-flex`,this.btnStop.style.display=`inline-flex`,this.btnPause.innerHTML=`<i data-lucide="play"></i> Retomar`,this.tabBtns.forEach(e=>e.disabled=!1)):(this.btnStart.style.display=`inline-flex`,this.btnPause.style.display=`none`,this.btnStop.style.display=`none`,this.taskSelect.disabled=!1,e.taskId||(this.taskSelect.value=``),this.tabBtns.forEach(e=>e.disabled=!1)),e.mode===`pomodoro`){let t=e.completedCycles%h.longBreakInterval+1,n=document.getElementById(`pomodoro-phase`),r=document.getElementById(`pomodoro-desc`),i=Math.floor(e.pomodoroDuration/60),a=Math.floor(e.breakDuration/60),o=Math.floor(e.longBreakDuration/60);e.phase===`focus`?(n.textContent=`🟢 FOCO — Ciclo ${t} de 4`,n.style.color=`var(--clr-accent)`,r.textContent=`Focando agora. O descanso será de ${a} minutos.`):e.phase===`break`?(n.textContent=`☕ DESCANSO — Ciclo ${t} de 4`,n.style.color=`#f59e0b`,r.textContent=`Descansando antes do próximo foco de ${i} minutos.`):(n.textContent=`🎉 DESCANSO LONGO`,n.style.color=`#3b82f6`,r.textContent=`Você completou 4 ciclos! Descansando por ${o} minutos.`)}window.lucide&&window.lucide.createIcons()},renderSessions(){let e=document.getElementById(`sessions-list`),t=d.getTodaySessions();if(t.length===0){e.innerHTML=`<p class="text-muted">Nenhuma sessão registrada hoje.</p>`;return}e.innerHTML=t.reverse().map(e=>{let t=e.taskId?i.getById(e.taskId):null,n=Math.ceil(e.durationInSeconds/60),r=e.type;return e.type===`pomodoro`&&e.label&&(r=`Pomodoro (${e.label})`),`
        <li class="task-item-simple">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-weight: 500; display: block;">${t?t.title:`Sessão livre`}</span>
              <span class="text-muted" style="font-size: 11px; text-transform: capitalize;">${r}</span>
            </div>
            <span class="text-muted" style="font-weight: 600;">${n} min</span>
          </div>
        </li>
      `}).join(``)},bindSessionsEvents(){document.getElementById(`btn-clear-sessions`).addEventListener(`click`,()=>{confirm(`Deseja excluir todas as sessões de hoje?`)&&(d.clearTodaySessions(),this.renderSessions())})},destroy(){h.removeListener(this.onStateChange)}},T=null,E=null,D={render(){return`
      <div class="module-header">
        <h2>Notas Rápidas</h2>
        <p class="text-muted">Anotações temporárias durante o trabalho.</p>
      </div>

      <div class="app-card" style="margin-bottom: var(--space-6);">
        <textarea id="note-input" class="task-input" placeholder="Escreva algo e será salvo automaticamente..." style="min-height: 100px; padding-top: var(--space-3); resize: vertical;"></textarea>
        <div style="display: flex; justify-content: flex-end; margin-top: var(--space-3);">
          <span id="save-status" class="text-muted" style="font-size: var(--fs-xs); align-self: center; margin-right: var(--space-4);"></span>
          <button id="btn-add-note" class="btn btn-primary"><i data-lucide="plus"></i> Nova Nota</button>
        </div>
      </div>

      <div style="margin-bottom: var(--space-4);">
        <input type="text" id="search-note" class="task-input" placeholder="Buscar notas..." style="padding-left: var(--space-3);" />
      </div>

      <div id="notes-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-4);">
        <!-- render via js -->
      </div>
    `},init(){this.noteInput=document.getElementById(`note-input`),this.btnAddNote=document.getElementById(`btn-add-note`),this.searchNote=document.getElementById(`search-note`),this.notesList=document.getElementById(`notes-list`),this.saveStatus=document.getElementById(`save-status`),this.currentNoteId=null,this.bindEvents(),this.renderNotes()},bindEvents(){this.noteInput.addEventListener(`input`,()=>{this.saveStatus.textContent=`Salvando...`,clearTimeout(T),T=setTimeout(()=>this.saveCurrentNote(),500)}),this.btnAddNote.addEventListener(`click`,()=>{this.saveCurrentNote(),this.currentNoteId=null,this.noteInput.value=``,this.noteInput.focus(),this.saveStatus.textContent=``}),this.searchNote.addEventListener(`input`,()=>{this.renderNotes(this.searchNote.value)})},saveCurrentNote(){let e=this.noteInput.value.trim();if(!e){this.saveStatus.textContent=``;return}if(this.currentNoteId)b.update(this.currentNoteId,{content:e});else{let t=b.create(e);this.currentNoteId=t.id}this.saveStatus.textContent=`Salvo!`,this.renderNotes(this.searchNote.value)},renderNotes(e=``){let t=b.search(e).sort((e,t)=>e.pinned===t.pinned?(e.order||0)-(t.order||0):t.pinned?-1:1);if(this.notesList.innerHTML=``,t.length===0&&!e){this.notesList.innerHTML=`<p class="text-muted" style="grid-column: 1/-1; text-align: center; padding: 2rem;">Nenhuma nota criada ainda.</p>`;return}t.forEach(t=>{let n=document.createElement(`div`);n.className=`app-card task-item`,n.dataset.id=t.id,n.style.cssText=`padding: var(--space-4); position: relative; cursor: pointer; display: flex; flex-direction: column;`,t.pinned?n.style.borderColor=`var(--clr-accent)`:n.setAttribute(`draggable`,`true`),t.id===this.currentNoteId&&(n.style.boxShadow=`0 0 0 2px var(--clr-accent-subtle)`),n.innerHTML=`
        <div style="display: flex; gap: var(--space-2); margin-bottom: var(--space-3);">
          ${t.pinned?`<span style="color: var(--clr-accent);"><i data-lucide="pin"></i></span>`:`<span class="drag-handle" style="opacity: 1; margin: -5px 0 0 -5px;"><i data-lucide="grip-vertical"></i></span>`}
        </div>
        <div style="white-space: pre-wrap; font-size: var(--fs-sm); margin-bottom: var(--space-4); max-height: 150px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 6; -webkit-box-orient: vertical;">${this.escapeHtml(t.content)}</div>
        
        <div style="display: flex; gap: var(--space-2); flex-wrap: wrap; margin-top: auto; padding-top: var(--space-3); border-top: 1px solid var(--clr-border);">
          <button class="btn-icon btn-action" data-action="copy" title="Copiar"><i data-lucide="copy"></i></button>
          <button class="btn-icon btn-action" data-action="task" title="Transformar em Tarefa"><i data-lucide="check-square"></i></button>
          <button class="btn-icon btn-action" data-action="pin" title="${t.pinned?`Desafixar`:`Fixar`}" style="color: ${t.pinned?`var(--clr-accent)`:``}"><i data-lucide="pin"></i></button>
          <div style="flex: 1;"></div>
          <button class="btn-icon btn-action" data-action="delete" title="Excluir" style="color: var(--clr-danger);"><i data-lucide="trash-2"></i></button>
        </div>
      `,n.addEventListener(`click`,e=>{e.target.closest(`.btn-action`)||e.target.closest(`.drag-handle`)||(this.saveCurrentNote(),this.currentNoteId=t.id,this.noteInput.value=t.content,this.saveStatus.textContent=``,this.renderNotes(this.searchNote.value))}),n.querySelector(`[data-action="copy"]`).addEventListener(`click`,e=>{e.stopPropagation(),navigator.clipboard.writeText(t.content)}),n.querySelector(`[data-action="task"]`).addEventListener(`click`,e=>{e.stopPropagation();let n=t.content.split(`
`)[0].substring(0,100);i.create({title:n,description:t.content}),alert(`Tarefa criada com sucesso!`)}),n.querySelector(`[data-action="pin"]`).addEventListener(`click`,e=>{e.stopPropagation(),b.togglePin(t.id),this.renderNotes(this.searchNote.value)}),n.querySelector(`[data-action="delete"]`).addEventListener(`click`,e=>{e.stopPropagation(),confirm(`Excluir esta nota?`)&&(b.delete(t.id),this.currentNoteId===t.id&&(this.currentNoteId=null,this.noteInput.value=``),this.renderNotes(this.searchNote.value))}),!t.pinned&&!e&&(n.addEventListener(`dragstart`,this.onDragStart.bind(this)),n.addEventListener(`dragenter`,this.onDragEnter.bind(this)),n.addEventListener(`dragover`,this.onDragOver.bind(this)),n.addEventListener(`dragleave`,this.onDragLeave.bind(this)),n.addEventListener(`drop`,this.onDrop.bind(this)),n.addEventListener(`dragend`,this.onDragEnd.bind(this))),this.notesList.appendChild(n)}),window.lucide&&window.lucide.createIcons()},onDragStart(e){E=e.currentTarget.dataset.id,e.currentTarget.classList.add(`dragging`),e.dataTransfer.effectAllowed=`move`,e.dataTransfer.setData(`text/plain`,E)},onDragEnter(e){e.preventDefault();let t=e.currentTarget;t.dataset.id!==E&&t.classList.add(`drag-over`)},onDragOver(e){e.preventDefault(),e.dataTransfer.dropEffect=`move`},onDragLeave(e){e.currentTarget.classList.remove(`drag-over`)},onDrop(e){e.preventDefault();let t=e.currentTarget.dataset.id;e.currentTarget.classList.remove(`drag-over`),!(!E||E===t)&&(b.reorder(E,t),this.renderNotes(this.searchNote.value))},onDragEnd(e){e.currentTarget.classList.remove(`dragging`),this.notesList.querySelectorAll(`.drag-over`).forEach(e=>{e.classList.remove(`drag-over`)}),E=null},escapeHtml(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)},destroy(){this.saveCurrentNote()}},O={render(){return`
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
    `},init(){this.toolContainer=document.getElementById(`tool-container`),this.cards=document.querySelectorAll(`.tool-card`),this.cards.forEach(e=>{e.addEventListener(`mouseenter`,()=>e.style.transform=`translateY(-2px)`),e.addEventListener(`mouseleave`,()=>e.style.transform=`translateY(0)`),e.addEventListener(`click`,()=>this.loadTool(e.dataset.tool))})},loadTool(e){switch(this.cards.forEach(e=>e.style.borderColor=`var(--clr-border)`),document.querySelector(`[data-tool="${e}"]`).style.borderColor=`var(--clr-accent)`,e){case`password`:this.renderPasswordGenerator();break;case`counter`:this.renderCharCounter();break;case`json`:this.renderJsonFormatter();break;case`qrcode`:this.renderQrCode();break;case`text`:this.renderTextOrganizer();break}},renderPasswordGenerator(){this.toolContainer.innerHTML=`
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
    `,window.lucide&&window.lucide.createIcons();let e=document.getElementById(`pwd-result`),t=document.getElementById(`pwd-len`),n=document.getElementById(`pwd-len-val`),r=document.getElementById(`pwd-uc`),i=document.getElementById(`pwd-lc`),a=document.getElementById(`pwd-num`),o=document.getElementById(`pwd-sym`),s=()=>{let n={uc:`ABCDEFGHIJKLMNOPQRSTUVWXYZ`,lc:`abcdefghijklmnopqrstuvwxyz`,num:`0123456789`,sym:"!@#$%^&*()_+~`|}{[]:;?><,./-="},s=``;if(r.checked&&(s+=n.uc),i.checked&&(s+=n.lc),a.checked&&(s+=n.num),o.checked&&(s+=n.sym),!s){e.value=`Selecione ao menos uma opção`;return}let c=``,l=parseInt(t.value);for(let e=0;e<l;e++)c+=s.charAt(Math.floor(Math.random()*s.length));e.value=c};t.addEventListener(`input`,()=>{n.textContent=t.value,s()}),[r,i,a,o].forEach(e=>e.addEventListener(`change`,s)),document.getElementById(`btn-gen-pwd`).addEventListener(`click`,s),document.getElementById(`btn-copy-pwd`).addEventListener(`click`,()=>{navigator.clipboard.writeText(e.value);let t=document.getElementById(`btn-copy-pwd`),n=t.innerHTML;t.innerHTML=`<i data-lucide="check"></i> Copiado!`,window.lucide&&window.lucide.createIcons(),setTimeout(()=>{t.innerHTML=n,window.lucide&&window.lucide.createIcons()},1500)}),s()},renderCharCounter(){this.toolContainer.innerHTML=`
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
    `,window.lucide&&window.lucide.createIcons();let e=document.getElementById(`cc-input`),t=document.getElementById(`cc-spaces`),n=document.getElementById(`cc-chars`),r=document.getElementById(`cc-words`),i=document.getElementById(`cc-lines`),a=()=>{let a=e.value;i.textContent=a?a.split(`
`).length:0;let o=a.trim().split(/\s+/);r.textContent=a.trim()===``?0:o.length,t.checked||(a=a.replace(/\s/g,``)),n.textContent=a.length};e.addEventListener(`input`,a),t.addEventListener(`change`,a),document.getElementById(`btn-cc-clear`).addEventListener(`click`,()=>{e.value=``,a()})},renderJsonFormatter(){this.toolContainer.innerHTML=`
      <h3 style="margin-bottom: var(--space-4);">Formatador JSON</h3>
      
      <div style="display: flex; gap: var(--space-2); margin-bottom: var(--space-3);">
        <button id="btn-json-fmt" class="btn btn-primary"><i data-lucide="align-left"></i> Formatar</button>
        <button id="btn-json-min" class="btn btn-secondary"><i data-lucide="minimize-2"></i> Minificar</button>
        <div style="flex: 1;"></div>
        <button id="btn-json-copy" class="btn btn-secondary"><i data-lucide="copy"></i> Copiar</button>
      </div>

      <div id="json-error" style="color: var(--clr-danger); font-size: var(--fs-sm); margin-bottom: var(--space-2); display: none;">JSON Inválido</div>
      <textarea id="json-input" class="task-input" placeholder='Cole seu JSON aqui... ex: {"nome": "workbase"}' style="min-height: 300px; resize: vertical; font-family: monospace; font-size: 13px;"></textarea>
    `,window.lucide&&window.lucide.createIcons();let e=document.getElementById(`json-input`),t=document.getElementById(`json-error`),n=n=>{try{if(t.style.display=`none`,!e.value.trim())return;let r=JSON.parse(e.value);e.value=JSON.stringify(r,null,n)}catch(e){t.style.display=`block`,t.textContent=`Erro: `+e.message}};document.getElementById(`btn-json-fmt`).addEventListener(`click`,()=>n(2)),document.getElementById(`btn-json-min`).addEventListener(`click`,()=>n(0)),document.getElementById(`btn-json-copy`).addEventListener(`click`,()=>{navigator.clipboard.writeText(e.value)})},renderQrCode(){this.toolContainer.innerHTML=`
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
    `,window.lucide&&window.lucide.createIcons();let e=document.getElementById(`qr-input`),t=document.getElementById(`qr-img`),n=document.getElementById(`qr-placeholder`);document.getElementById(`btn-qr-gen`).addEventListener(`click`,()=>{let r=e.value.trim();if(!r)return;let i=`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(r)}`;t.src=i,t.style.display=`block`,n.style.display=`none`}),document.getElementById(`btn-qr-clear`).addEventListener(`click`,()=>{e.value=``,t.src=``,t.style.display=`none`,n.style.display=`block`})},renderTextOrganizer(){this.toolContainer.innerHTML=`
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
    `,window.lucide&&window.lucide.createIcons();let e=document.getElementById(`txt-input`),t=document.getElementById(`txt-output`);document.querySelectorAll(`.text-action`).forEach(n=>{n.addEventListener(`click`,n=>{let r=e.value;if(r){switch(n.target.dataset.action){case`uppercase`:r=r.toUpperCase();break;case`lowercase`:r=r.toLowerCase();break;case`trim`:r=r.split(`
`).map(e=>e.trim().replace(/\s+/g,` `)).join(`
`);break;case`empty`:r=r.split(`
`).filter(e=>e.trim()!==``).join(`
`);break;case`punct`:r=r.replace(/\s+([.,!?:;])/g,`$1`),r=r.replace(/([.,!?:;])([^\s\d"'\\])/g,`$1 $2`);break;case`capitalize`:r=r.replace(/(^\s*|[.!?]\s+)([a-z])/g,(e,t,n)=>t+n.toUpperCase());break}t.value=r}})}),document.getElementById(`btn-txt-copy`).addEventListener(`click`,()=>{t.value&&navigator.clipboard.writeText(t.value)}),document.getElementById(`btn-txt-clear`).addEventListener(`click`,()=>{e.value=``,t.value=``})}},k={render(){return`
      <div class="module-header">
        <h2>Configurações</h2>
        <p class="text-muted">Personalize e gerencie seus dados.</p>
      </div>

      <div class="app-card">
        <h3 style="font-size: var(--fs-lg); margin-bottom: var(--space-4);">Dados e Backup</h3>
        <p class="text-muted" style="margin-bottom: var(--space-4); font-size: var(--fs-sm);">
          Seus dados ficam salvos apenas neste navegador. Faça backups regulares.
        </p>

        <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
          <button id="btn-export" class="btn btn-primary"><i data-lucide="download"></i> Exportar Backup</button>
          
          <label class="btn btn-secondary" style="cursor: pointer;">
            <i data-lucide="upload"></i> Importar Backup
            <input type="file" id="input-import" accept=".json" style="display: none;" />
          </label>
          
          <button id="btn-clear" class="btn btn-danger"><i data-lucide="trash-2"></i> Apagar Tudo</button>
        </div>
      </div>
    `},init(){document.getElementById(`btn-export`).addEventListener(`click`,()=>{let t={tasks:e.get(`wb-tasks`,[]),sessions:e.get(`wb-time-sessions`,[]),settings:e.get(`wb-settings`,{})},n=new Blob([JSON.stringify(t,null,2)],{type:`application/json`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=`workbase-backup-${new Date().toISOString().split(`T`)[0]}.json`,i.click(),URL.revokeObjectURL(r)}),document.getElementById(`input-import`).addEventListener(`change`,t=>{let n=t.target.files[0];if(!n)return;let r=new FileReader;r.onload=t=>{try{let n=JSON.parse(t.target.result);n.tasks&&e.set(`wb-tasks`,n.tasks),n.sessions&&e.set(`wb-time-sessions`,n.sessions),n.settings&&e.set(`wb-settings`,n.settings),alert(`Backup importado com sucesso! A página será recarregada.`),window.location.reload()}catch{alert(`Erro ao importar arquivo. Formato inválido.`)}},r.readAsText(n)}),document.getElementById(`btn-clear`).addEventListener(`click`,()=>{confirm(`Tem certeza? ISSO APAGARÁ TODAS AS TAREFAS E SESSÕES.`)&&(e.clear(),alert(`Dados apagados. A página será recarregada.`),window.location.reload())})}};function A(){i.migrateLegacyTasks(),document.getElementById(`sidebar`).innerHTML=o(),document.getElementById(`bottom-nav`).innerHTML=s(),document.body.insertAdjacentHTML(`beforeend`,g()),a.add(`#/hoje`,x),a.add(`#/tarefas`,C),a.add(`#/foco`,w),a.add(`#/notas`,D),a.add(`#/ferramentas`,O),a.add(`#/configuracoes`,k),a.init(`app-content`),_(),window.addEventListener(`hashchange`,()=>{h.notifyListeners()}),window.lucide&&window.lucide.createIcons()}document.addEventListener(`DOMContentLoaded`,A);