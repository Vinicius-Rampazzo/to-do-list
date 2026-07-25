(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={get(e,t=null){try{let n=localStorage.getItem(e);return n?JSON.parse(n):t}catch(n){return console.error(`Erro ao ler ${e} do localStorage:`,n),t}},set(e,t){try{return localStorage.setItem(e,JSON.stringify(t)),!0}catch(t){return console.error(`Erro ao salvar ${e} no localStorage:`,t),!1}},remove(e){try{localStorage.removeItem(e)}catch(t){console.error(`Erro ao remover ${e}:`,t)}},clear(){try{localStorage.clear()}catch(e){console.error(`Erro ao limpar localStorage:`,e)}}},t=`wb-tasks`,n=`imobi-todo-tasks`;function r(){return`task-${Date.now()}-${Math.random().toString(36).slice(2,7)}`}var i={migrateLegacyTasks(){let i=localStorage.getItem(n);if(i)try{let a=JSON.parse(i).map((e,t)=>({id:e.id||r(),title:e.text||`Tarefa sem título`,description:``,completed:!!e.completed,priority:`medium`,category:``,dueDate:null,createdAt:new Date().toISOString(),completedAt:e.completed?new Date().toISOString():null,order:t,totalTimeSeconds:0}));e.get(t)||e.set(t,a),localStorage.removeItem(n)}catch(e){console.error(`Erro ao migrar tarefas antigas:`,e)}},getAll(){return e.get(t,[])},getById(e){return this.getAll().find(t=>t.id===e)||null},getPending(){return this.getAll().filter(e=>!e.completed)},getCompleted(){return this.getAll().filter(e=>e.completed)},getCompletedToday(){let e=new Date().toISOString().split(`T`)[0];return this.getCompleted().filter(t=>t.completedAt?t.completedAt.split(`T`)[0]===e:!1)},create(n){let i=this.getAll(),a={id:r(),title:n.title,description:n.description||``,completed:!1,priority:n.priority||`medium`,category:n.category||``,dueDate:n.dueDate||null,createdAt:new Date().toISOString(),completedAt:null,order:i.length>0?Math.max(...i.map(e=>e.order))+1:0,totalTimeSeconds:0,...n};return i.push(a),e.set(t,i),a},update(n,r){let i=this.getAll(),a=i.findIndex(e=>e.id===n);return a===-1?null:(r.completed!==void 0&&r.completed!==i[a].completed&&(r.completed?r.completedAt=new Date().toISOString():r.completedAt=null),i[a]={...i[a],...r},e.set(t,i),i[a])},delete(n){let r=this.getAll();r=r.filter(e=>e.id!==n),e.set(t,r)},reorder(n,r){let i=this.getAll(),a=i.findIndex(e=>e.id===n),o=i.findIndex(e=>e.id===r);if(a===-1||o===-1)return;let[s]=i.splice(a,1);i.splice(o,0,s),i.forEach((e,t)=>e.order=t),e.set(t,i)},addTime(n,r){let i=this.getAll(),a=i.findIndex(e=>e.id===n);return a===-1?null:(i[a].totalTimeSeconds=(i[a].totalTimeSeconds||0)+r,e.set(t,i),i[a])}},a=`wb-settings`,o={userName:`Usuário`,pomodoroDuration:25,breakDuration:5,longBreakDuration:15,longBreakInterval:4,theme:`light`,categories:[`Trabalho`,`Pessoal`,`Estudo`,`Projetos`]},s={get(){return e.get(a,o)},update(t){let n={...this.get(),...t};return e.set(a,n),n}},c={routes:{},currentRoute:null,container:null,init(e){this.container=document.getElementById(e),window.addEventListener(`popstate`,()=>this.handleRoute()),document.addEventListener(`click`,e=>{let t=e.target.closest(`a[href]`);if(!t)return;let n=t.getAttribute(`href`);!n||n.startsWith(`http`)||n.startsWith(`mailto`)||n.startsWith(`javascript`)||t.getAttribute(`target`)!==`_blank`&&(e.preventDefault(),window.location.pathname+window.location.search!==n&&window.history.pushState(null,``,n),this.handleRoute())}),this.handleRoute()},add(e,t){this.routes[e]=t},async handleRoute(){let e=window.location.pathname||`/hoje`,t=this.routes[e];if(!t){let n=Object.keys(this.routes).find(t=>t!==`/`&&e.startsWith(t+`/`));n&&(t=this.routes[n])}t?(this.currentRoute&&this.currentRoute.destroy&&this.currentRoute.destroy(),this.currentRoute=t,t.render&&(this.container.innerHTML=await t.render()),t.init&&t.init(),document.querySelectorAll(`.nav-item`).forEach(t=>{let n=t.getAttribute(`href`);n&&t.classList.toggle(`active`,e===n||e.startsWith(n+`/`))}),window.lucide&&window.lucide.createIcons()):(window.history.replaceState(null,``,`/hoje`),this.handleRoute())}};function l(){return`
    <div class="sidebar-header">
      <div class="brand-icon"><i data-lucide="layout-dashboard"></i></div>
      <div>
        <h1 class="brand-title">WorkBase</h1>
        <span class="brand-sub">DocWork</span>
      </div>
    </div>
    <nav class="sidebar-nav">
      <a href="/hoje" class="nav-item"><i data-lucide="sun"></i> Hoje</a>
      <a href="/tarefas" class="nav-item"><i data-lucide="check-square"></i> Tarefas</a>
      <a href="/foco" class="nav-item"><i data-lucide="timer"></i> Foco</a>
      <a href="/notas" class="nav-item"><i data-lucide="sticky-note"></i> Notas</a>
      <a href="/ferramentas" class="nav-item"><i data-lucide="wrench"></i> Ferramentas</a>
    </nav>
    <div class="sidebar-footer">
      <button id="theme-toggle-btn" class="theme-toggle-btn" aria-label="Alternar tema">
        <i data-lucide="moon" id="theme-toggle-icon"></i>
        <span id="theme-toggle-text">Modo Escuro</span>
      </button>
      <a href="/configuracoes" class="nav-item"><i data-lucide="settings"></i> Configurações</a>
    </div>
  `}function u(){return`
    <a href="/hoje" class="nav-item"><i data-lucide="sun"></i><span>Hoje</span></a>
    <a href="/tarefas" class="nav-item"><i data-lucide="check-square"></i><span>Tarefas</span></a>
    <a href="/foco" class="nav-item"><i data-lucide="timer"></i><span>Foco</span></a>
    <a href="/notas" class="nav-item"><i data-lucide="sticky-note"></i><span>Notas</span></a>
    <button id="theme-toggle-btn-mobile" class="nav-item" style="background:none; border:none; cursor:pointer;" aria-label="Alternar Tema">
      <i data-lucide="moon" id="theme-toggle-icon-mobile"></i><span>Tema</span>
    </button>
  `}var d=`wb-time-sessions`,f=`wb-active-timer`;function p(){return`session-${Date.now()}-${Math.random().toString(36).slice(2,7)}`}var m={getAll(){return e.get(d,[])},getTodaySessions(){let e=new Date().toISOString().split(`T`)[0];return this.getAll().filter(t=>t.endedAt?t.endedAt.split(`T`)[0]===e:!1)},getTotalFocusToday(){return this.getTodaySessions().reduce((e,t)=>e+t.durationInSeconds,0)},create(t){let n=this.getAll(),r={id:p(),taskId:t.taskId||null,type:t.type||`stopwatch`,startedAt:t.startedAt||new Date().toISOString(),endedAt:t.endedAt||new Date().toISOString(),durationInSeconds:t.durationInSeconds||0,label:t.label||``};return n.push(r),e.set(d,n),r},getActiveTimers(){let t=e.get(`wb-active-timers`,null);if(t)return t;let n=e.get(f,null);if(n&&n.mode){let t={stopwatch:null,timer:null,pomodoro:null};return t[n.mode]=n,e.remove(f),e.set(`wb-active-timers`,t),t}return{stopwatch:null,timer:null,pomodoro:null}},setActiveTimers(t){e.set(`wb-active-timers`,t)},clearActiveTimers(){e.remove(`wb-active-timers`)},clearTodaySessions(){let t=new Date().toISOString().split(`T`)[0],n=this.getAll().filter(e=>!e.endedAt||e.endedAt.split(`T`)[0]!==t);e.set(d,n)}},h=null;function g(){if(!h){let e=window.AudioContext||window.webkitAudioContext;e&&(h=new e)}return h&&h.state===`suspended`&&h.resume().catch(()=>{}),h}typeof window<`u`&&[`click`,`touchstart`,`keydown`,`mousedown`].forEach(e=>{window.addEventListener(e,()=>{g()},{passive:!0})});var _=new class{constructor(){this.intervalId=null,this.listeners=new Set,this.lastTimerMins=25;let e=s.get();this.pomodoroDuration=(e.pomodoroDuration||25)*60,this.breakDuration=(e.breakDuration||5)*60,this.longBreakDuration=(e.longBreakDuration||15)*60,this.longBreakInterval=e.longBreakInterval||4,this.resetAllStates(),this.restoreState(),document.addEventListener(`visibilitychange`,()=>{document.visibilityState===`visible`&&this.hasRunningTimers()&&this.tick()})}createDefaultTimerState(e){let t=1500;e===`timer`&&(this.timers&&this.timers.timer&&this.timers.timer.initialSeconds>0?t=this.timers.timer.initialSeconds:this.lastTimerMins>0&&(t=this.lastTimerMins*60));let n={mode:e,seconds:e===`timer`?t:0,initialSeconds:e===`timer`?t:0,isRunning:!1,isCompleted:!1,taskId:null,startedAt:null,lastTick:null};return e===`pomodoro`?{...n,phase:`focus`,completedCycles:0,seconds:this.pomodoroDuration,initialSeconds:this.pomodoroDuration,pomodoroDuration:this.pomodoroDuration,breakDuration:this.breakDuration,longBreakDuration:this.longBreakDuration,longBreakInterval:this.longBreakInterval}:n}resetAllStates(){this.timers={stopwatch:this.createDefaultTimerState(`stopwatch`),timer:this.createDefaultTimerState(`timer`),pomodoro:this.createDefaultTimerState(`pomodoro`)}}resetTimerState(e){if(this.timers[e]){let t=this.timers[e].initialSeconds;this.timers[e]=this.createDefaultTimerState(e),e===`timer`&&t>0&&(this.timers[e].initialSeconds=t,this.timers[e].seconds=t)}}restoreState(){let e=m.getActiveTimers();e&&[`stopwatch`,`timer`,`pomodoro`].forEach(t=>{if(e[t]){this.timers[t]=e[t];let n=this.timers[t];if(t===`timer`&&n.initialSeconds>0&&(this.lastTimerMins=Math.floor(n.initialSeconds/60)),n.isRunning&&n.lastTick){let e=Date.now(),t=Math.floor((e-n.lastTick)/1e3);n.mode===`stopwatch`?n.seconds+=t:(n.seconds-=t,n.seconds<=0&&(n.seconds=0,this.handleCompletion(n))),n.lastTick=e}}}),this.hasRunningTimers()?this.ensureTickRunning():this.saveState()}get state(){return this.timers.stopwatch.isRunning?this.timers.stopwatch:this.timers.pomodoro.isRunning?this.timers.pomodoro:this.timers.timer.isRunning?this.timers.timer:this.timers.stopwatch}getTimer(e){return this.timers[e]||null}getAllTimers(){return this.timers}hasRunningTimers(){return Object.values(this.timers).some(e=>e.isRunning)}getActiveTimersList(){return Object.values(this.timers).filter(e=>e.isRunning||e.seconds>0||e.startedAt||e.isCompleted)}saveState(){m.setActiveTimers(this.timers),this.notifyListeners()}startStopwatch(e=null){let t=this.timers.stopwatch;!t.isRunning&&t.seconds===0&&this.resetTimerState(`stopwatch`),this.timers.stopwatch.taskId=e,this.timers.stopwatch.isCompleted=!1,this.start(`stopwatch`)}startTimer(e=null,t=null){let n=this.timers.timer,r=e||(n.initialSeconds>0?Math.floor(n.initialSeconds/60):this.lastTimerMins||25);this.lastTimerMins=r,n.seconds=r*60,n.initialSeconds=r*60,n.taskId=t,n.isCompleted=!1,this.start(`timer`)}startPomodoro(e=null,t=null,n=null,r=null,i=null){let a=this.timers.pomodoro;t&&(a.pomodoroDuration=t*60),n&&(a.breakDuration=n*60),r&&(a.longBreakDuration=r*60),i&&(a.longBreakInterval=parseInt(i)||4),!a.isRunning&&(!a.startedAt||a.seconds===0||a.isCompleted)&&(a.phase=`focus`,a.seconds=a.pomodoroDuration,a.initialSeconds=a.pomodoroDuration),a.taskId=e,a.isCompleted=!1,this.start(`pomodoro`)}start(e){let t=this.timers[e];!t||t.isRunning||(t.startedAt||=new Date().toISOString(),t.isRunning=!0,t.isCompleted=!1,t.lastTick=Date.now(),this.saveState(),this.ensureTickRunning())}pause(e){let t=this.timers[e];!t||!t.isRunning||(t.isRunning=!1,this.saveState(),this.checkTickStatus())}stop(e){let t=this.timers[e];if(t){if(t.isRunning=!1,t.startedAt){let e=t.mode===`stopwatch`?t.seconds:t.initialSeconds-t.seconds;e>0&&(m.create({taskId:t.taskId,type:t.mode,startedAt:t.startedAt,endedAt:new Date().toISOString(),durationInSeconds:e,label:t.phase||``}),t.taskId&&i.addTime(t.taskId,e))}this.resetTimerState(e),this.saveState(),this.checkTickStatus()}}dismissCompleted(e){this.timers[e]&&(this.resetTimerState(e),this.saveState(),this.checkTickStatus())}ensureTickRunning(){this.intervalId||=setInterval(()=>{this.tick()},200)}checkTickStatus(){!this.hasRunningTimers()&&this.intervalId&&(clearInterval(this.intervalId),this.intervalId=null)}tick(){let e=Date.now(),t=!1;Object.values(this.timers).forEach(n=>{if(!n.isRunning||!n.lastTick)return;let r=Math.floor((e-n.lastTick)/1e3);r<=0||(n.lastTick+=r*1e3,t=!0,n.mode===`stopwatch`?n.seconds+=r:(n.seconds-=r,n.seconds<=0&&(n.seconds=0,this.handleCompletion(n))))}),t&&this.saveState()}handleCompletion(e){if(this.playNotificationSound(),e.mode===`pomodoro`){let t=e.phase===`focus`;if(e.startedAt){let t=e.initialSeconds;m.create({taskId:e.taskId,type:e.mode,startedAt:e.startedAt,endedAt:new Date().toISOString(),durationInSeconds:t,label:e.phase||``}),e.taskId&&i.addTime(e.taskId,t)}this.advancePomodoroPhase(e);let n=t?`Foco concluído! ${e.phase===`longBreak`?`Descanso Longo`:`Descanso`} iniciado.`:`Descanso encerrado! Nova sessão de Foco iniciada.`,r=t?`Aproveite ${Math.floor(e.seconds/60)} min para descansar.`:`Voltando ao trabalho por ${Math.floor(e.seconds/60)} min.`;this.showBrowserNotification(n,r),e.isRunning=!0,e.isCompleted=!1,e.startedAt=new Date().toISOString(),e.lastTick=Date.now(),this.saveState(),this.ensureTickRunning()}else{if(e.startedAt){let t=e.initialSeconds;m.create({taskId:e.taskId,type:e.mode,startedAt:e.startedAt,endedAt:new Date().toISOString(),durationInSeconds:t,label:e.phase||``}),e.taskId&&i.addTime(e.taskId,t)}this.showBrowserNotification(`Temporizador concluído!`,`Sua sessão foi concluída.`),e.isCompleted=!0,e.isRunning=!1,e.seconds=0,this.saveState()}}advancePomodoroPhase(e){if(e.phase===`focus`){e.completedCycles++;let t=e.longBreakInterval&&e.longBreakInterval>=1?e.longBreakInterval:4;e.completedCycles%t===0?(e.phase=`longBreak`,e.seconds=e.longBreakDuration,e.initialSeconds=e.longBreakDuration):(e.phase=`break`,e.seconds=e.breakDuration,e.initialSeconds=e.breakDuration)}else e.phase=`focus`,e.seconds=e.pomodoroDuration,e.initialSeconds=e.pomodoroDuration}playNotificationSound(){try{let e=g();if(!e)return;e.state===`suspended`&&e.resume();let t=e.currentTime,n=(t,n,r)=>{let i=e.createOscillator(),a=e.createGain();i.type=`sine`,i.frequency.setValueAtTime(t,n),a.gain.setValueAtTime(.4,n),a.gain.exponentialRampToValueAtTime(.001,n+r),i.connect(a),a.connect(e.destination),i.start(n),i.stop(n+r)};n(523.25,t,.2),n(659.25,t+.2,.2),n(783.99,t+.4,.35),n(523.25,t+.8,.2),n(659.25,t+1,.2),n(783.99,t+1.2,.45)}catch(e){console.log(`Áudio não suportado ou bloqueado`,e)}}showBrowserNotification(e,t){`Notification`in window&&(Notification.permission===`granted`?new Notification(e,{body:t,icon:`/favicon.svg`}):Notification.permission!==`denied`&&Notification.requestPermission().then(n=>{n===`granted`&&new Notification(e,{body:t,icon:`/favicon.svg`})}))}addListener(e){this.listeners.add(e),e(this.timers)}removeListener(e){this.listeners.delete(e)}notifyListeners(){this.listeners.forEach(e=>e(this.timers))}};function v(){return`
    <div id="floating-timer" class="floating-timer-container" style="display: none;">
      <!-- Conteúdo renderizado dinamicamente -->
    </div>
  `}function y(){let e=document.getElementById(`floating-timer`);if(!e)return;e.addEventListener(`click`,e=>{let t=e.target.closest(`.btn-floating-playpause`);if(t){e.preventDefault(),e.stopPropagation();let n=t.dataset.mode,r=_.getTimer(n);r&&(r.isRunning?_.pause(n):_.start(n));return}let n=e.target.closest(`.btn-floating-dismiss`);if(n){e.preventDefault(),e.stopPropagation();let t=n.dataset.mode;_.dismissCompleted(t);return}});let t={stopwatch:`Cronômetro`,timer:`Temporizador`,pomodoro:`Pomodoro`},n={stopwatch:`stopwatch`,timer:`hourglass`,pomodoro:`timer`},r={focus:`Foco`,break:`Descanso Curto`,longBreak:`Descanso Longo`};_.addListener(a=>{let o=window.location.pathname.startsWith(`/foco`),s=Object.values(a).filter(e=>!!(e.isCompleted||e.isRunning||e.startedAt||e.mode===`timer`&&e.seconds>0&&e.seconds<e.initialSeconds||e.mode===`stopwatch`&&e.seconds>0||e.mode===`pomodoro`&&e.seconds>0&&e.seconds<e.initialSeconds));if(s.length===0||o){e.style.display=`none`,e.innerHTML=``;return}e.style.display=`flex`,s.forEach(a=>{let o=Math.floor(a.seconds/3600).toString().padStart(2,`0`),s=Math.floor(a.seconds%3600/60).toString().padStart(2,`0`),c=(a.seconds%60).toString().padStart(2,`0`),l=a.mode===`stopwatch`?`${o}:${s}:${c}`:`${s}:${c}`;a.isCompleted&&(l=`Concluído! 🎉`);let u=r[a.phase]||`Foco`,d=`Sessão livre`;if(a.taskId){let e=i.getById(a.taskId),t=e?e.title:`Tarefa excluída`;d=a.mode===`pomodoro`?`${u} · ${t}`:t}else d=a.mode===`pomodoro`?u:`Sessão livre`;let f=e.querySelector(`.floating-timer-item[data-mode="${a.mode}"]`),p=a.isCompleted?`floating-timer-completed`:``;if(!f||f.classList.contains(`floating-timer-completed`)!==a.isCompleted){let r=t[a.mode]||a.mode,i=a.isRunning?`pause`:`play`,o=a.isCompleted?``:`
          <button class="btn-icon btn-floating-playpause" data-mode="${a.mode}" data-current-icon="${i}" aria-label="Pausar/Retomar">
            <i data-lucide="${i}"></i>
          </button>
        `,s=a.isCompleted?`
          <button class="btn-icon btn-floating-dismiss" data-mode="${a.mode}" aria-label="Fechar" title="Fechar notificação">
            <i data-lucide="x"></i>
          </button>
        `:`
          <a href="/foco?tab=${a.mode}" class="btn-icon" aria-label="Ir ao foco" title="Ir ao modo ${r}">
            <i data-lucide="external-link"></i>
          </a>
        `,c=`
          <div class="floating-timer-item ${p}" data-mode="${a.mode}">
            <div class="floating-timer-info">
              <div class="floating-timer-header-row">
                <span class="floating-mode-tag"><i data-lucide="${n[a.mode]}"></i> ${r}</span>
                <span class="floating-time" style="${a.isCompleted?`color: var(--clr-accent); font-size: var(--fs-sm);`:``}">${l}</span>
              </div>
              <span class="floating-task" title="${d}">${d}</span>
            </div>
            <div class="floating-timer-actions">
              ${o}
              ${s}
            </div>
          </div>
        `;f?f.outerHTML=c:e.insertAdjacentHTML(`beforeend`,c),window.lucide&&window.lucide.createIcons()}else{let e=f.querySelector(`.floating-time`),t=f.querySelector(`.floating-task`),n=f.querySelector(`.btn-floating-playpause`);if(e&&e.textContent!==l&&(e.textContent=l),t&&t.textContent!==d&&(t.textContent=d,t.title=d),n){let e=a.isRunning?`pause`:`play`;n.dataset.currentIcon!==e&&(n.dataset.currentIcon=e,n.innerHTML=`<i data-lucide="${e}"></i>`,window.lucide&&window.lucide.createIcons())}}});let c=s.map(e=>e.mode);e.querySelectorAll(`.floating-timer-item`).forEach(e=>{c.includes(e.dataset.mode)||e.remove()})})}var b=`wb-notes`;function x(){return`note-${Date.now()}-${Math.random().toString(36).slice(2,7)}`}var S={getAll(){return e.get(b,[])},getById(e){return this.getAll().find(t=>t.id===e)||null},getPinned(){return this.getAll().filter(e=>e.pinned)},search(e){if(!e)return this.getAll();let t=e.toLowerCase();return this.getAll().filter(e=>e.content.toLowerCase().includes(t))},create(t,n=!1){let r=this.getAll(),i=r.length>0?Math.max(...r.map(e=>e.order||0)):0,a={id:x(),content:t,pinned:n,order:i+1,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};return r.push(a),e.set(b,r),a},update(t,n){let r=this.getAll(),i=r.findIndex(e=>e.id===t);return i===-1?null:(n.updatedAt=new Date().toISOString(),r[i]={...r[i],...n},e.set(b,r),r[i])},delete(t){let n=this.getAll();n=n.filter(e=>e.id!==t),e.set(b,n)},togglePin(e){let t=this.getById(e);return t?this.update(e,{pinned:!t.pinned}):null},reorder(t,n){let r=this.getAll();r.sort((e,t)=>e.pinned===t.pinned?(e.order||0)-(t.order||0):t.pinned?1:-1);let i=r.findIndex(e=>e.id===t),a=r.findIndex(e=>e.id===n);if(i===-1||a===-1||r[i].pinned||r[a].pinned)return;let[o]=r.splice(i,1);r.splice(a,0,o);let s=1;r.forEach(e=>{e.pinned||(e.order=s++)}),e.set(b,r)}},C={render(){s.get();let e=i.getPending(),t=i.getCompleted(),n=i.getCompletedToday(),r=m.getTotalFocusToday(),a=m.getTodaySessions(),o=S.getAll(),c=o.filter(e=>e.pinned),l=Math.floor(r/3600),u=Math.floor(r%3600/60),d=l>0?`${l}h${u}min`:`${u}min`;return`
      <div class="module-header">
        <h2>Veja seu resumo</h2>
        <p class="text-muted">Aqui está o panorama da sua produtividade.</p>
      </div>

      <!-- Cards de resumo do DIA -->
      <div class="dashboard-cards" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
        <div class="dash-card">
          <div class="dash-icon" style="background: rgba(249, 115, 22, 0.1); color: #f97316;">
            <i data-lucide="circle-dashed"></i>
          </div>
          <div class="dash-info">
            <span class="dash-value">${e.length}</span>
            <span class="dash-label">Pendentes</span>
          </div>
        </div>
        
        <div class="dash-card">
          <div class="dash-icon success">
            <i data-lucide="check-circle-2"></i>
          </div>
          <div class="dash-info">
            <span class="dash-value">${n.length}</span>
            <span class="dash-label">Concluídas hoje</span>
          </div>
        </div>

        <div class="dash-card">
          <div class="dash-icon focus">
            <i data-lucide="timer"></i>
          </div>
          <div class="dash-info">
            <span class="dash-value">${d}</span>
            <span class="dash-label">Foco hoje</span>
          </div>
        </div>

        <div class="dash-card">
          <div class="dash-icon" style="background: rgba(168, 85, 247, 0.1); color: #a855f7;">
            <i data-lucide="activity"></i>
          </div>
          <div class="dash-info">
            <span class="dash-value">${a.length}</span>
            <span class="dash-label">Sessões hoje</span>
          </div>
        </div>
      </div>

      <div class="dashboard-actions">
        <a href="/foco" class="btn btn-primary"><i data-lucide="play"></i> Iniciar sessão de foco</a>
      </div>

      <!-- Grid de seções -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: var(--space-4);">
        
        <!-- Tarefas do dia -->
        <div class="dashboard-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
            <h3>Próximas tarefas</h3>
            <a href="/tarefas" style="font-size: var(--fs-sm); color: var(--clr-accent); text-decoration: none; font-weight: 600;">Ver todas →</a>
          </div>
          <ul class="task-list" id="hoje-task-list">
            <!-- preenchido via JS -->
          </ul>
        </div>

        <!-- Notas fixadas / recentes -->
        <div class="dashboard-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
            <h3>${c.length>0?`Notas fixadas`:`Notas recentes`}</h3>
            <a href="/notas" style="font-size: var(--fs-sm); color: var(--clr-accent); text-decoration: none; font-weight: 600;">Ver todas →</a>
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
            <div style="font-size: var(--fs-xl); font-weight: 700; color: var(--clr-text-primary);">${e.length+t.length}</div>
            <div style="font-size: var(--fs-xs); color: var(--clr-text-muted); text-transform: uppercase;">Total de tarefas</div>
          </div>
          <div style="text-align: center; padding: var(--space-4); background: var(--clr-bg); border-radius: var(--radius-md);">
            <div style="font-size: var(--fs-xl); font-weight: 700; color: var(--clr-accent);">${t.length}</div>
            <div style="font-size: var(--fs-xs); color: var(--clr-text-muted); text-transform: uppercase;">Total concluídas</div>
          </div>
          <div style="text-align: center; padding: var(--space-4); background: var(--clr-bg); border-radius: var(--radius-md);">
            <div style="font-size: var(--fs-xl); font-weight: 700; color: #a855f7;">${o.length}</div>
            <div style="font-size: var(--fs-xs); color: var(--clr-text-muted); text-transform: uppercase;">Notas salvas</div>
          </div>
          <div style="text-align: center; padding: var(--space-4); background: var(--clr-bg); border-radius: var(--radius-md);">
            <div style="font-size: var(--fs-xl); font-weight: 700; color: #3b82f6;">${this.getTotalFocusFormatted()}</div>
            <div style="font-size: var(--fs-xs); color: var(--clr-text-muted); text-transform: uppercase;">Foco total</div>
          </div>
        </div>
      </div>
    `},getTotalFocusFormatted(){let e=m.getAll().reduce((e,t)=>e+(t.durationInSeconds||0),0),t=Math.floor(e/3600),n=Math.floor(e%3600/60);return t>0?`${t}h${n}m`:`${n}min`},init(){this.renderTasks(),this.renderNotes()},renderTasks(){let e=document.getElementById(`hoje-task-list`);if(!e)return;let t=i.getPending().slice(0,5);if(t.length===0){e.innerHTML=`<p class="text-muted" style="padding: var(--space-3) 0;">Nenhuma tarefa pendente. Parabéns! 🎉</p>`;return}e.innerHTML=t.map(e=>`
      <li class="task-item-simple">
        <div style="display: flex; align-items: center; gap: var(--space-3);">
          <span style="color: var(--clr-text-muted);"><i data-lucide="circle-dashed" style="width: 16px; height: 16px;"></i></span>
          <span class="task-text">${e.title}</span>
        </div>
      </li>
    `).join(``),window.lucide&&window.lucide.createIcons()},renderNotes(){let e=document.getElementById(`hoje-notes-list`);if(!e)return;let t=S.getAll(),n=t.filter(e=>e.pinned),r=n.length>0?n.slice(0,4):t.sort((e,t)=>new Date(t.updatedAt)-new Date(e.updatedAt)).slice(0,4);if(r.length===0){e.innerHTML=`<p class="text-muted" style="padding: var(--space-3) 0;">Nenhuma nota salva ainda.</p>`;return}e.innerHTML=r.map(e=>{let t=e.content.split(`
`)[0].substring(0,80);return`
        <li class="task-item-simple">
          <div style="display: flex; align-items: center; gap: var(--space-3);">
            <span style="color: ${e.pinned?`var(--clr-accent)`:`var(--clr-text-muted)`};"><i data-lucide="${e.pinned?`pin`:`file-text`}" style="width: 16px; height: 16px;"></i></span>
            <span class="task-text" style="color: var(--clr-text-secondary);">${this.escapeHtml(t)}${e.content.length>80?`...`:``}</span>
          </div>
        </li>
      `}).join(``),window.lucide&&window.lucide.createIcons()},escapeHtml(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)},destroy(){}},w=null,T={render(){return`
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
      `,n.querySelector(`.task-checkbox`).addEventListener(`click`,t=>{t.stopPropagation(),i.update(e.id,{completed:!e.completed}),this.renderTasks()}),n.querySelector(`.btn-delete-item`).addEventListener(`click`,t=>{t.stopPropagation(),i.delete(e.id),this.renderTasks()}),n.addEventListener(`dblclick`,e=>{e.target.closest(`.btn-delete-item`)||e.target.closest(`.task-checkbox`)||e.target.closest(`.expanded-actions`)||this.toggleExpand(n)});let r=n.querySelector(`.btn-copy-action`);r.addEventListener(`click`,t=>{t.stopPropagation(),navigator.clipboard.writeText(e.title).then(()=>{r.innerHTML=`<i data-lucide="check"></i> Copiado!`,r.classList.add(`btn-copy-success`),window.lucide&&window.lucide.createIcons(),setTimeout(()=>{r.innerHTML=`<i data-lucide="copy"></i> Copiar`,r.classList.remove(`btn-copy-success`),window.lucide&&window.lucide.createIcons()},1800)})}),n.querySelector(`.btn-start-timer`).addEventListener(`click`,t=>{t.stopPropagation(),_.startStopwatch(e.id),window.history.pushState(null,``,`/foco`),window.router&&window.router.handleRoute()}),n.addEventListener(`dragstart`,this.onDragStart.bind(this)),n.addEventListener(`dragenter`,this.onDragEnter.bind(this)),n.addEventListener(`dragover`,this.onDragOver.bind(this)),n.addEventListener(`dragleave`,this.onDragLeave.bind(this)),n.addEventListener(`drop`,this.onDrop.bind(this)),n.addEventListener(`dragend`,this.onDragEnd.bind(this)),this.listaTarefas.appendChild(n)}),this.updateCounters(e),e.length===0?this.emptyState.removeAttribute(`hidden`):this.emptyState.setAttribute(`hidden`,``),window.lucide&&window.lucide.createIcons()},toggleExpand(e){let t=e.classList.contains(`expanded`);this.listaTarefas.querySelectorAll(`.task-item.expanded`).forEach(e=>{e.classList.remove(`expanded`),e.setAttribute(`draggable`,`true`)}),t||(e.classList.add(`expanded`),e.setAttribute(`draggable`,`false`),e.querySelector(`.expanded-text`)?.focus())},onDragStart(e){w=e.currentTarget.dataset.id,e.currentTarget.classList.add(`dragging`),e.dataTransfer.effectAllowed=`move`,e.dataTransfer.setData(`text/plain`,w)},onDragEnter(e){e.preventDefault();let t=e.currentTarget;t.dataset.id!==w&&t.classList.add(`drag-over`)},onDragOver(e){e.preventDefault(),e.dataTransfer.dropEffect=`move`},onDragLeave(e){e.currentTarget.classList.remove(`drag-over`)},onDrop(e){e.preventDefault();let t=e.currentTarget.dataset.id;e.currentTarget.classList.remove(`drag-over`),!(!w||w===t)&&(i.reorder(w,t),this.renderTasks())},onDragEnd(e){e.currentTarget.classList.remove(`dragging`),this.listaTarefas.querySelectorAll(`.drag-over`).forEach(e=>{e.classList.remove(`drag-over`)}),w=null},updateCounters(e){let t=e.filter(e=>!e.completed).length,n=e.filter(e=>e.completed).length;this.countPending.textContent=t,this.countDone.textContent=n},escapeHtml(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)},destroy(){document.removeEventListener(`keydown`,this.handleEscape),document.removeEventListener(`click`,this.handleClickOutside)}},E={render(){return`
      <div class="module-header">
        <h2>Foco</h2>
        <p class="text-muted">Concentre-se em suas tarefas e registre seu tempo.</p>
      </div>

      <div class="tabs-nav">
        <button class="tab-btn active" data-tab="stopwatch">
          Cronômetro <span id="badge-tab-stopwatch" class="tab-active-dot" style="display:none;">•</span>
        </button>
        <button class="tab-btn" data-tab="timer">
          Temporizador <span id="badge-tab-timer" class="tab-active-dot" style="display:none;">•</span>
        </button>
        <button class="tab-btn" data-tab="pomodoro">
          Pomodoro <span id="badge-tab-pomodoro" class="tab-active-dot" style="display:none;">•</span>
        </button>
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
            <input type="number" id="input-timer-mins" class="task-input" min="1" max="180" style="width: 80px; text-align: center; padding: var(--space-1);" />
            <span class="text-muted" style="font-size: var(--fs-sm);">min</span>
          </div>
        </div>

        <!-- Controles Pomodoro -->
        <div id="controls-pomodoro" style="display: none; margin-bottom: var(--space-5);">
          <!-- Presets de Pomodoro -->
          <div style="display: flex; justify-content: center; gap: var(--space-2); margin-bottom: var(--space-4); flex-wrap: wrap;">
            <button class="btn btn-secondary btn-sm preset-pomo-btn" data-focus="25" data-break="5" data-longbreak="15" data-cycles="4">Tradicional (25m/5m)</button>
            <button class="btn btn-secondary btn-sm preset-pomo-btn" data-focus="45" data-break="15" data-longbreak="30" data-cycles="4">Longo (45m/15m)</button>
            <button class="btn btn-secondary btn-sm preset-pomo-btn" data-focus="15" data-break="3" data-longbreak="10" data-cycles="3">Rápido (15m/3m)</button>
          </div>

          <!-- Configurações Personalizadas do Pomodoro -->
          <div style="display: flex; justify-content: center; align-items: center; gap: var(--space-3); flex-wrap: wrap;">
            <div>
              <label class="text-muted" style="display: block; font-size: var(--fs-xs); margin-bottom: 2px;">Foco (min)</label>
              <input type="number" id="input-pomo-focus" class="task-input" value="25" min="1" max="180" style="width: 75px; text-align: center; padding: var(--space-1);" />
            </div>
            <div>
              <label class="text-muted" style="display: block; font-size: var(--fs-xs); margin-bottom: 2px;">Descanso (min)</label>
              <input type="number" id="input-pomo-break" class="task-input" value="5" min="1" max="60" style="width: 75px; text-align: center; padding: var(--space-1);" />
            </div>
            <div>
              <label class="text-muted" style="display: block; font-size: var(--fs-xs); margin-bottom: 2px;">Desc. Longo (min)</label>
              <input type="number" id="input-pomo-long-break" class="task-input" value="15" min="1" max="120" style="width: 75px; text-align: center; padding: var(--space-1);" />
            </div>
            <div>
              <label class="text-muted" style="display: block; font-size: var(--fs-xs); margin-bottom: 2px;">Ciclos p/ D. Longo</label>
              <input type="number" id="input-pomo-cycles" class="task-input" value="4" min="1" max="12" style="width: 75px; text-align: center; padding: var(--space-1);" />
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

      <!-- Bloco de Explicação do Modo Selecionado (Posicionado abaixo do card) -->
      <div id="explanation-box" class="dashboard-section" style="margin-top: var(--space-6);">
        <!-- Conteúdo renderizado dinamicamente via updateExplanation -->
      </div>

      <div class="dashboard-section" style="margin-top: var(--space-6);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
          <h3>Sessões de hoje</h3>
          <button id="btn-clear-sessions" class="btn btn-secondary btn-sm"><i data-lucide="trash"></i> Limpar Tudo</button>
        </div>
        <ul id="sessions-list" class="task-list"></ul>
      </div>
    `},init(){this.display=document.getElementById(`timer-display`),this.btnStart=document.getElementById(`btn-start`),this.btnPause=document.getElementById(`btn-pause`),this.btnStop=document.getElementById(`btn-stop`),this.taskSelect=document.getElementById(`task-select`),this.tabBtns=document.querySelectorAll(`.tab-btn`),this.controlsTimer=document.getElementById(`controls-timer`),this.controlsPomodoro=document.getElementById(`controls-pomodoro`),this.pomodoroInfo=document.getElementById(`pomodoro-info`),this.inputTimerMins=document.getElementById(`input-timer-mins`),this.inputPomoFocus=document.getElementById(`input-pomo-focus`),this.inputPomoBreak=document.getElementById(`input-pomo-break`),this.inputPomoLongBreak=document.getElementById(`input-pomo-long-break`),this.inputPomoCycles=document.getElementById(`input-pomo-cycles`);let e=new URLSearchParams(window.location.search).get(`tab`);e&&[`stopwatch`,`timer`,`pomodoro`].includes(e)?this.currentTab=e:this.currentTab=`stopwatch`,this.populateTasks(),this.renderSessions(),this.bindEvents(),this.bindSessionsEvents(),this.onStateChange=this.updateUI.bind(this),_.addListener(this.onStateChange),this.switchTab(this.currentTab)},populateTasks(){let e=i.getPending().map(e=>`<option value="${e.id}">${e.title}</option>`).join(``);this.taskSelect.insertAdjacentHTML(`beforeend`,e)},bindEvents(){this.tabBtns.forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget.dataset.tab;this.switchTab(t)})}),document.querySelectorAll(`.preset-timer-btn`).forEach(e=>{e.addEventListener(`click`,e=>{let t=parseInt(e.currentTarget.dataset.time)||10;this.inputTimerMins.value=t;let n=_.getTimer(`timer`);n&&(n.initialSeconds=t*60,n.seconds=t*60,n.isCompleted=!1,_.lastTimerMins=t,_.saveState()),this.updateDisplayPreview()})}),this.inputTimerMins.addEventListener(`input`,()=>{let e=parseInt(this.inputTimerMins.value);if(!isNaN(e)&&e>0){let t=_.getTimer(`timer`);t&&!t.isRunning&&!t.startedAt&&(t.initialSeconds=e*60,t.seconds=e*60,t.isCompleted=!1,_.lastTimerMins=e,_.saveState())}this.updateDisplayPreview()}),document.querySelectorAll(`.preset-pomo-btn`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget.dataset;this.inputPomoFocus.value=t.focus,this.inputPomoBreak.value=t.break,t.longbreak&&(this.inputPomoLongBreak.value=t.longbreak),t.cycles&&(this.inputPomoCycles.value=t.cycles),this.updateDisplayPreview()})}),[this.inputPomoFocus,this.inputPomoBreak,this.inputPomoLongBreak,this.inputPomoCycles].forEach(e=>{e&&e.addEventListener(`input`,()=>this.updateDisplayPreview())}),this.btnStart.addEventListener(`click`,()=>{let e=this.taskSelect.value||null;if(this.currentTab===`stopwatch`)_.startStopwatch(e);else if(this.currentTab===`timer`){let t=_.getTimer(`timer`),n=t&&t.initialSeconds>0?Math.floor(t.initialSeconds/60):_.lastTimerMins||25,r;if(t&&t.isCompleted)r=n;else{let e=parseInt(this.inputTimerMins.value);r=!isNaN(e)&&e>0?e:n}this.inputTimerMins.value=r,_.startTimer(r,e)}else if(this.currentTab===`pomodoro`){let t=parseInt(this.inputPomoFocus.value)||25,n=parseInt(this.inputPomoBreak.value)||5,r=parseInt(this.inputPomoLongBreak.value)||15,i=parseInt(this.inputPomoCycles.value)||4;_.startPomodoro(e,t,n,r,i)}}),this.btnPause.addEventListener(`click`,()=>{let e=_.getTimer(this.currentTab);e&&e.isRunning?_.pause(this.currentTab):_.start(this.currentTab)}),this.btnStop.addEventListener(`click`,()=>{_.stop(this.currentTab),this.renderSessions(),this.updateDisplayPreview()})},switchTab(e){this.currentTab=e,this.tabBtns.forEach(t=>t.classList.toggle(`active`,t.dataset.tab===e)),this.updateExplanation(e);let t=_.getAllTimers();this.updateUI(t)},updateExplanation(e){let t=document.getElementById(`explanation-box`);t&&(e===`stopwatch`?t.innerHTML=`
        <div style="display: flex; align-items: center; gap: var(--space-2); font-weight: 700; color: var(--clr-accent); font-size: var(--fs-sm); margin-bottom: var(--space-2);">
          <i data-lucide="info"></i> Como funciona o Cronômetro?
        </div>
        <div style="font-size: var(--fs-xs); color: var(--clr-text-secondary); line-height: 1.6;">
          <p style="margin-bottom: 4px;">• O <strong>Cronômetro</strong> realiza uma contagem progressiva (crescente) a partir do zero (00:00:00).</p>
          <p style="margin-bottom: 4px;">• Ideal para registrar o tempo livre gasto em tarefas contínuas sem um tempo limite predefinido.</p>
          <p>• Você pode vincular uma tarefa opcional para contabilizar o tempo trabalhado diretamente no histórico dela.</p>
        </div>
      `:e===`timer`?t.innerHTML=`
        <div style="display: flex; align-items: center; gap: var(--space-2); font-weight: 700; color: var(--clr-accent); font-size: var(--fs-sm); margin-bottom: var(--space-2);">
          <i data-lucide="info"></i> Como funciona o Temporizador?
        </div>
        <div style="font-size: var(--fs-xs); color: var(--clr-text-secondary); line-height: 1.6;">
          <p style="margin-bottom: 4px;">• O <strong>Temporizador</strong> realiza uma contagem regressiva a partir da duração definida por você.</p>
          <p style="margin-bottom: 4px;">• Escolha um tempo rápido (10m, 20m, 30m, 45m, 60m) ou digite uma duração personalizada em minutos.</p>
          <p>• Quando o tempo esgotar, um sinal sonoro será emitido e a notificação permanecerá fixa no menu flutuante até você fechar.</p>
        </div>
      `:e===`pomodoro`&&(t.innerHTML=`
        <div style="display: flex; align-items: center; gap: var(--space-2); font-weight: 700; color: var(--clr-accent); font-size: var(--fs-sm); margin-bottom: var(--space-2);">
          <i data-lucide="info"></i> Como funciona a Técnica Pomodoro?
        </div>
        <div style="font-size: var(--fs-xs); color: var(--clr-text-secondary); line-height: 1.6;">
          <p style="margin-bottom: 4px;">• Trabalhe com <strong>foco total</strong> no tempo configurado para Foco (ex: 25 minutos).</p>
          <p style="margin-bottom: 4px;">• Ao encerrar a sessão de Foco, um som é emitido e o ciclo avança automaticamente para o <strong>Descanso Curto</strong>.</p>
          <p>• A cada <strong>X ciclos de foco concluídos</strong> (configurável acima), você terá um <strong>Descanso Longo</strong> para recompor a energia.</p>
        </div>
      `),window.lucide&&window.lucide.createIcons())},updateDisplayPreview(){let e=_.getTimer(this.currentTab);if(!(e&&(e.isRunning||e.startedAt||e.isCompleted))){if(this.currentTab===`stopwatch`)this.display.textContent=`00:00:00`;else if(this.currentTab===`timer`){let e=_.getTimer(`timer`),t=e&&e.initialSeconds>0?Math.floor(e.initialSeconds/60):_.lastTimerMins||25,n=parseInt(this.inputTimerMins.value),r=!isNaN(n)&&n>0?n:t;this.inputTimerMins.value=r,this.display.textContent=`${r.toString().padStart(2,`0`)}:00`}else if(this.currentTab===`pomodoro`){let e=parseInt(this.inputPomoFocus.value)||0,t=parseInt(this.inputPomoBreak.value)||0,n=parseInt(this.inputPomoCycles.value)||4;this.display.textContent=`${e.toString().padStart(2,`0`)}:00`;let r=document.getElementById(`pomodoro-phase`),i=document.getElementById(`pomodoro-desc`);r&&(r.textContent=`FOCO — Ciclo 1 de ${n}`),r&&(r.style.color=`var(--clr-accent)`),i&&(i.textContent=`${e} minutos de foco, depois ${t} minutos de descanso.`)}}},updateUI(e){if(!e)return;[`stopwatch`,`timer`,`pomodoro`].forEach(t=>{let n=e[t],r=document.getElementById(`badge-tab-${t}`);r&&(n&&(n.isRunning||n.startedAt||n.isCompleted||n.mode===`stopwatch`&&n.seconds>0)?(r.style.display=`inline`,r.style.color=n.isRunning||n.isCompleted?`var(--clr-accent)`:`var(--clr-text-muted)`):r.style.display=`none`)});let t=e[this.currentTab]||_.createDefaultTimerState(this.currentTab),n=this.currentTab===`stopwatch`,r=Math.floor(t.seconds/3600).toString().padStart(2,`0`),i=Math.floor(t.seconds%3600/60).toString().padStart(2,`0`),a=(t.seconds%60).toString().padStart(2,`0`),o=t.isRunning||t.startedAt!==null||t.isCompleted||t.mode===`stopwatch`&&t.seconds>0;if(o?t.isCompleted?this.display.textContent=`Concluído!`:this.display.textContent=n?`${r}:${i}:${a}`:`${i}:${a}`:this.updateDisplayPreview(),this.currentTab===`timer`&&t.initialSeconds>0&&this.inputTimerMins&&document.activeElement!==this.inputTimerMins&&(this.inputTimerMins.value=Math.floor(t.initialSeconds/60)),o?(this.controlsTimer.style.display=`none`,this.controlsPomodoro.style.display=`none`,this.pomodoroInfo.style.display=this.currentTab===`pomodoro`?`block`:`none`):(this.controlsTimer.style.display=this.currentTab===`timer`?`block`:`none`,this.controlsPomodoro.style.display=this.currentTab===`pomodoro`?`block`:`none`,this.pomodoroInfo.style.display=this.currentTab===`pomodoro`?`block`:`none`),t.isRunning?(this.btnStart.style.display=`none`,this.btnPause.style.display=`inline-flex`,this.btnStop.style.display=`inline-flex`,this.btnPause.innerHTML=`<i data-lucide="pause"></i> Pausar`,this.taskSelect.disabled=!0,t.taskId&&(this.taskSelect.value=t.taskId)):t.startedAt!==null&&!t.isCompleted?(this.btnStart.style.display=`none`,this.btnPause.style.display=`inline-flex`,this.btnStop.style.display=`inline-flex`,this.btnPause.innerHTML=`<i data-lucide="play"></i> Retomar`,this.taskSelect.disabled=!0,t.taskId&&(this.taskSelect.value=t.taskId)):t.isCompleted?(this.btnStart.style.display=`inline-flex`,this.btnStart.innerHTML=`<i data-lucide="rotate-ccw"></i> Reiniciar`,this.btnPause.style.display=`none`,this.btnStop.style.display=`inline-flex`,this.taskSelect.disabled=!1):(this.btnStart.style.display=`inline-flex`,this.btnStart.innerHTML=`<i data-lucide="play"></i> Iniciar`,this.btnPause.style.display=`none`,this.btnStop.style.display=`none`,this.taskSelect.disabled=!1,t.taskId||(this.taskSelect.value=``)),this.currentTab===`pomodoro`&&t.mode===`pomodoro`){let e=t.longBreakInterval||parseInt(this.inputPomoCycles?.value)||4,n=t.completedCycles%e+1,r=document.getElementById(`pomodoro-phase`),i=document.getElementById(`pomodoro-desc`);if(r&&i){let a=Math.floor(t.pomodoroDuration/60),o=Math.floor(t.breakDuration/60),s=Math.floor(t.longBreakDuration/60);t.phase===`focus`?(r.textContent=`🟢 FOCO — Ciclo ${n} de ${e}`,r.style.color=`var(--clr-accent)`,i.textContent=`Focando agora. O descanso será de ${o} minutos.`):t.phase===`break`?(r.textContent=`☕ DESCANSO CURTO — Ciclo ${n} de ${e}`,r.style.color=`#f59e0b`,i.textContent=`Descansando por ${o} min antes da próxima sessão de foco de ${a} min.`):(r.textContent=`🎉 DESCANSO LONGO`,r.style.color=`#3b82f6`,i.textContent=`Você completou ${e} ciclos! Descansando por ${s} minutos.`)}}window.lucide&&window.lucide.createIcons()},renderSessions(){let e=document.getElementById(`sessions-list`),t=m.getTodaySessions();if(e){if(t.length===0){e.innerHTML=`<p class="text-muted">Nenhuma sessão registrada hoje.</p>`;return}e.innerHTML=t.reverse().map(e=>{let t=e.taskId?i.getById(e.taskId):null,n=Math.ceil(e.durationInSeconds/60),r=e.type;return e.type===`pomodoro`&&e.label&&(r=`Pomodoro (${e.label})`),`
        <li class="task-item-simple">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-weight: 500; display: block;">${t?t.title:`Sessão livre`}</span>
              <span class="text-muted" style="font-size: 11px; text-transform: capitalize;">${r}</span>
            </div>
            <span class="text-muted" style="font-weight: 600;">${n} min</span>
          </div>
        </li>
      `}).join(``)}},bindSessionsEvents(){let e=document.getElementById(`btn-clear-sessions`);e&&e.addEventListener(`click`,()=>{confirm(`Deseja excluir todas as sessões de hoje?`)&&(m.clearTodaySessions(),this.renderSessions())})},destroy(){_.removeListener(this.onStateChange)}},D=null,O=null,k={render(){return`
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
    `},init(){this.noteInput=document.getElementById(`note-input`),this.btnAddNote=document.getElementById(`btn-add-note`),this.searchNote=document.getElementById(`search-note`),this.notesList=document.getElementById(`notes-list`),this.saveStatus=document.getElementById(`save-status`),this.currentNoteId=null,this.bindEvents(),this.renderNotes()},bindEvents(){this.noteInput.addEventListener(`input`,()=>{this.saveStatus.textContent=`Salvando...`,clearTimeout(D),D=setTimeout(()=>this.saveCurrentNote(),500)}),this.btnAddNote.addEventListener(`click`,()=>{this.saveCurrentNote(),this.currentNoteId=null,this.noteInput.value=``,this.noteInput.focus(),this.saveStatus.textContent=``}),this.searchNote.addEventListener(`input`,()=>{this.renderNotes(this.searchNote.value)})},saveCurrentNote(){let e=this.noteInput.value.trim();if(!e){this.saveStatus.textContent=``;return}if(this.currentNoteId)S.update(this.currentNoteId,{content:e});else{let t=S.create(e);this.currentNoteId=t.id}this.saveStatus.textContent=`Salvo!`,this.renderNotes(this.searchNote.value)},renderNotes(e=``){let t=S.search(e).sort((e,t)=>e.pinned===t.pinned?(e.order||0)-(t.order||0):t.pinned?-1:1);if(this.notesList.innerHTML=``,t.length===0&&!e){this.notesList.innerHTML=`<p class="text-muted" style="grid-column: 1/-1; text-align: center; padding: 2rem;">Nenhuma nota criada ainda.</p>`;return}t.forEach(t=>{let n=document.createElement(`div`);n.className=`app-card task-item`,n.dataset.id=t.id,n.style.cssText=`padding: var(--space-4); position: relative; cursor: pointer; display: flex; flex-direction: column;`,t.pinned?n.style.borderColor=`var(--clr-accent)`:n.setAttribute(`draggable`,`true`),t.id===this.currentNoteId&&(n.style.boxShadow=`0 0 0 2px var(--clr-accent-subtle)`),n.innerHTML=`
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
`)[0].substring(0,100);i.create({title:n,description:t.content}),alert(`Tarefa criada com sucesso!`)}),n.querySelector(`[data-action="pin"]`).addEventListener(`click`,e=>{e.stopPropagation(),S.togglePin(t.id),this.renderNotes(this.searchNote.value)}),n.querySelector(`[data-action="delete"]`).addEventListener(`click`,e=>{e.stopPropagation(),confirm(`Excluir esta nota?`)&&(S.delete(t.id),this.currentNoteId===t.id&&(this.currentNoteId=null,this.noteInput.value=``),this.renderNotes(this.searchNote.value))}),!t.pinned&&!e&&(n.addEventListener(`dragstart`,this.onDragStart.bind(this)),n.addEventListener(`dragenter`,this.onDragEnter.bind(this)),n.addEventListener(`dragover`,this.onDragOver.bind(this)),n.addEventListener(`dragleave`,this.onDragLeave.bind(this)),n.addEventListener(`drop`,this.onDrop.bind(this)),n.addEventListener(`dragend`,this.onDragEnd.bind(this))),this.notesList.appendChild(n)}),window.lucide&&window.lucide.createIcons()},onDragStart(e){O=e.currentTarget.dataset.id,e.currentTarget.classList.add(`dragging`),e.dataTransfer.effectAllowed=`move`,e.dataTransfer.setData(`text/plain`,O)},onDragEnter(e){e.preventDefault();let t=e.currentTarget;t.dataset.id!==O&&t.classList.add(`drag-over`)},onDragOver(e){e.preventDefault(),e.dataTransfer.dropEffect=`move`},onDragLeave(e){e.currentTarget.classList.remove(`drag-over`)},onDrop(e){e.preventDefault();let t=e.currentTarget.dataset.id;e.currentTarget.classList.remove(`drag-over`),!(!O||O===t)&&(S.reorder(O,t),this.renderNotes(this.searchNote.value))},onDragEnd(e){e.currentTarget.classList.remove(`dragging`),this.notesList.querySelectorAll(`.drag-over`).forEach(e=>{e.classList.remove(`drag-over`)}),O=null},escapeHtml(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)},destroy(){this.saveCurrentNote()}},A={"/ferramentas/corrigir-pontuacao":{tool:`text`,action:`punct`},"/ferramentas/maiusculas":{tool:`text`,action:`uppercase`},"/ferramentas/minusculas":{tool:`text`,action:`lowercase`},"/ferramentas/capitalizar-frases":{tool:`text`,action:`capitalize`},"/ferramentas/remover-espacos-extras":{tool:`text`,action:`trim`},"/ferramentas/remover-linhas-vazias":{tool:`text`,action:`empty`},"/ferramentas/gerador-de-senha":{tool:`password`},"/ferramentas/contador-de-caracteres":{tool:`counter`},"/ferramentas/formatador-json":{tool:`json`},"/ferramentas/gerador-qr-code":{tool:`qrcode`},"/ferramentas/organizador-de-texto":{tool:`text`,action:`punct`}},j={punct:`/ferramentas/corrigir-pontuacao`,uppercase:`/ferramentas/maiusculas`,lowercase:`/ferramentas/minusculas`,capitalize:`/ferramentas/capitalizar-frases`,trim:`/ferramentas/remover-espacos-extras`,empty:`/ferramentas/remover-linhas-vazias`},M={password:`/ferramentas/gerador-de-senha`,counter:`/ferramentas/contador-de-caracteres`,json:`/ferramentas/formatador-json`,qrcode:`/ferramentas/gerador-qr-code`,text:`/ferramentas/corrigir-pontuacao`},N={render(){return`
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
          <p>Selecione uma ferramenta acima para começar.</p>
        </div>
      </div>
    `},init(){this.toolContainer=document.getElementById(`tool-container`),this.cards=document.querySelectorAll(`.tool-card`),this.cards.forEach(e=>{e.addEventListener(`mouseenter`,()=>e.style.transform=`translateY(-2px)`),e.addEventListener(`mouseleave`,()=>e.style.transform=`translateY(0)`),e.addEventListener(`click`,()=>{let t=M[e.dataset.tool]||`/ferramentas/corrigir-pontuacao`;window.history.pushState(null,``,t),this.loadToolFromPath()})}),this.loadToolFromPath()},loadToolFromPath(){let e=window.location.pathname;if(e===`/ferramentas`||e===`/ferramentas/`){this.cards.forEach(e=>e.style.borderColor=`var(--clr-border)`),this.toolContainer.innerHTML=`
        <div class="empty-state">
          <span class="empty-icon"><i data-lucide="wrench"></i></span>
          <p>Selecione uma ferramenta acima para começar.</p>
        </div>
      `,window.lucide&&window.lucide.createIcons();return}let t=A[e]||{tool:`text`,action:`punct`};this.loadTool(t.tool,t.action||`punct`)},loadTool(e,t=`punct`){this.cards.forEach(e=>e.style.borderColor=`var(--clr-border)`);let n=document.querySelector(`[data-tool="${e}"]`);switch(n&&(n.style.borderColor=`var(--clr-accent)`),e){case`password`:this.renderPasswordGenerator();break;case`counter`:this.renderCharCounter();break;case`json`:this.renderJsonFormatter();break;case`qrcode`:this.renderQrCode();break;case`text`:this.renderTextOrganizer(t);break}},renderPasswordGenerator(){this.toolContainer.innerHTML=`
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
    `,window.lucide&&window.lucide.createIcons();let e=document.getElementById(`pwd-result`),t=document.getElementById(`pwd-len`),n=document.getElementById(`pwd-len-val`),r=document.getElementById(`pwd-uc`),i=document.getElementById(`pwd-lc`),a=document.getElementById(`pwd-num`),o=document.getElementById(`pwd-sym`),s=document.getElementById(`pwd-strength-text`),c=document.getElementById(`pwd-strength-bar`),l=document.getElementById(`pwd-bits-text`),u=e=>{if(!e||e.startsWith(`Selecione`)){s.textContent=`Indefinida`,c.style.width=`0%`,c.style.background=`var(--clr-border)`,l.textContent=`0 bits`;return}let t=0;e.length>=10&&t++,e.length>=16&&t++,e.length>=24&&t++,/[A-Z]/.test(e)&&t++,/[a-z]/.test(e)&&t++,/[0-9]/.test(e)&&t++,/[^A-Za-z0-9]/.test(e)&&t++,t<=3?(s.textContent=`Fraca`,s.style.color=`var(--clr-danger)`,c.style.width=`25%`,c.style.background=`var(--clr-danger)`):t<=5?(s.textContent=`Média`,s.style.color=`#f59e0b`,c.style.width=`55%`,c.style.background=`#f59e0b`):t<=6?(s.textContent=`Forte`,s.style.color=`#10b981`,c.style.width=`80%`,c.style.background=`#10b981`):(s.textContent=`Muito Forte`,s.style.color=`var(--clr-accent)`,c.style.width=`100%`,c.style.background=`var(--clr-accent)`);let n=0;r.checked&&(n+=26),i.checked&&(n+=26),a.checked&&(n+=10),o.checked&&(n+=30);let u=Math.floor(e.length*Math.log2(n||1));l.textContent=`~${u} bits de segurança`},d=()=>{let n={uc:`ABCDEFGHIJKLMNOPQRSTUVWXYZ`,lc:`abcdefghijklmnopqrstuvwxyz`,num:`0123456789`,sym:"!@#$%^&*()_+~`|}{[]:;?><,./-="},s=``;if(r.checked&&(s+=n.uc),i.checked&&(s+=n.lc),a.checked&&(s+=n.num),o.checked&&(s+=n.sym),!s){e.value=`Selecione ao menos uma opção`,u(``);return}let c=``,l=parseInt(t.value);for(let e=0;e<l;e++)c+=s.charAt(Math.floor(Math.random()*s.length));e.value=c,u(c)};t.addEventListener(`input`,()=>{n.textContent=`${t.value} caracteres`,d()}),[r,i,a,o].forEach(e=>e.addEventListener(`change`,d)),document.getElementById(`btn-gen-pwd`).addEventListener(`click`,d),document.getElementById(`btn-copy-pwd`).addEventListener(`click`,()=>{if(!e.value||e.value.startsWith(`Selecione`))return;navigator.clipboard.writeText(e.value);let t=document.getElementById(`btn-copy-pwd`),n=t.innerHTML;t.innerHTML=`<i data-lucide="check"></i> Copiado!`,window.lucide&&window.lucide.createIcons(),setTimeout(()=>{t.innerHTML=n,window.lucide&&window.lucide.createIcons()},1500)}),d()},renderCharCounter(){this.toolContainer.innerHTML=`
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
    `,window.lucide&&window.lucide.createIcons();let e=document.getElementById(`qr-input`),t=document.getElementById(`qr-img`),n=document.getElementById(`qr-placeholder`);document.getElementById(`btn-qr-gen`).addEventListener(`click`,()=>{let r=e.value.trim();if(!r)return;let i=`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(r)}`;t.src=i,t.style.display=`block`,n.style.display=`none`}),document.getElementById(`btn-qr-clear`).addEventListener(`click`,()=>{e.value=``,t.src=``,t.style.display=`none`,n.style.display=`block`})},renderTextOrganizer(e=`punct`){let t=t=>t===e?`btn-primary active`:`btn-secondary`;this.toolContainer.innerHTML=`
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

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2);">
        <h3>Organizador de Texto</h3>
        <button id="btn-txt-clear" class="btn btn-secondary btn-sm"><i data-lucide="trash"></i> Limpar Tudo</button>
      </div>
      
      <div style="margin-bottom: var(--space-2); font-size: var(--fs-xs); font-weight: 600; color: var(--clr-text-muted); text-transform: uppercase; letter-spacing: 0.5px;">
        Selecione a ação desejada:
      </div>

      <div style="display: flex; gap: var(--space-2); flex-wrap: wrap; margin-bottom: var(--space-4);">
        <button class="btn btn-sm text-action action-chip ${t(`punct`)}" data-action="punct"><i data-lucide="sparkles"></i> Corrigir Pontuação</button>
        <button class="btn btn-sm text-action action-chip ${t(`uppercase`)}" data-action="uppercase">MAIÚSCULAS</button>
        <button class="btn btn-sm text-action action-chip ${t(`lowercase`)}" data-action="lowercase">minúsculas</button>
        <button class="btn btn-sm text-action action-chip ${t(`capitalize`)}" data-action="capitalize">Capitalizar Frases</button>
        <button class="btn btn-sm text-action action-chip ${t(`trim`)}" data-action="trim">Remover Espaços Extras</button>
        <button class="btn btn-sm text-action action-chip ${t(`empty`)}" data-action="empty">Remover Linhas Vazias</button>
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
    `,window.lucide&&window.lucide.createIcons();let n=document.getElementById(`txt-input`),r=document.getElementById(`txt-output`),i=document.getElementById(`btn-process-text`),a=e;document.querySelectorAll(`.text-action`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget;a=t.dataset.action;let n=j[a];n&&window.history.pushState(null,``,n),document.querySelectorAll(`.text-action`).forEach(e=>{e.classList.remove(`active`,`btn-primary`),e.classList.add(`btn-secondary`)}),t.classList.remove(`btn-secondary`),t.classList.add(`active`,`btn-primary`)})}),i.addEventListener(`click`,async()=>{let e=n.value;if(!e)return;let t=document.getElementById(`txt-report`),o=document.getElementById(`txt-report-list`),s=document.getElementById(`txt-report-title`);switch(t&&o&&s&&(o.innerHTML=``,t.style.display=`none`),a){case`uppercase`:{let n=0;for(let t=0;t<e.length;t++)e[t]!==e[t].toUpperCase()&&n++;e=e.toUpperCase(),t&&o&&s&&(s.innerHTML=`<i data-lucide="arrow-up-circle"></i> Conversão para Maiúsculas`,o.innerHTML=`<li>Convertidos <strong>${n}</strong> caracteres de minúsculo para maiúsculo.</li>`,t.style.display=`block`);break}case`lowercase`:{let n=0;for(let t=0;t<e.length;t++)e[t]!==e[t].toLowerCase()&&n++;e=e.toLowerCase(),t&&o&&s&&(s.innerHTML=`<i data-lucide="arrow-down-circle"></i> Conversão para Minúsculas`,o.innerHTML=`<li>Convertidos <strong>${n}</strong> caracteres de maiúsculo para minúsculo.</li>`,t.style.display=`block`);break}case`trim`:{let n=e.length;e=e.split(`
`).map(e=>e.trim().replace(/\s+/g,` `)).join(`
`);let r=Math.max(0,n-e.length);t&&o&&s&&(s.innerHTML=`<i data-lucide="align-justify"></i> Limpeza de Espaços`,o.innerHTML=`<li>Removidos <strong>${r}</strong> espaços desnecessários e tabs.</li>`,t.style.display=`block`);break}case`empty`:{let n=e.split(`
`).length,r=e.split(`
`).filter(e=>e.trim()!==``);e=r.join(`
`);let i=Math.max(0,n-r.length);t&&o&&s&&(s.innerHTML=`<i data-lucide="rows"></i> Remoção de Linhas`,o.innerHTML=`<li>Eliminadas <strong>${i}</strong> linhas vazias.</li>`,t.style.display=`block`);break}case`capitalize`:{let n=0;e=e.replace(/(^\s*|[.!?]\s+)([a-zà-úç])/g,(e,t,r)=>(n++,t+r.toUpperCase())),t&&o&&s&&(s.innerHTML=`<i data-lucide="type"></i> Capitalização de Sentenças`,o.innerHTML=`<li>Capitalizado o início de <strong>${n}</strong> frase(s) ou parágrafo(s).</li>`,t.style.display=`block`);break}case`punct`:{let n=i.innerHTML;i.disabled=!0,i.innerHTML=`<i data-lucide="loader" class="spin-loader"></i> Processando Texto...`,window.lucide&&window.lucide.createIcons();try{let n=await P(e),{corrected:r,changes:i}=F(e,n.matches);e=r;let a=I(e);e=a.corrected;let c=i.concat(a.changes);t&&o&&s&&(s.innerHTML=`<i data-lucide="sparkles"></i> Análise de Pontuação e Ortografia`,c.length>0?o.innerHTML=c.map(e=>`
                  <li>
                    <span class="badge" style="background: var(--clr-accent-subtle); color: var(--clr-accent); padding: 2px 6px; border-radius: 4px; font-weight: 600; font-size: 11px; margin-right: 8px;">${e.category}</span>
                    ${e.description} (de <del style="color:var(--clr-danger); font-family: monospace;">${e.original}</del> para <strong style="color:var(--clr-success); font-family: monospace;">${e.corrected}</strong>)
                  </li>
                `).join(``):o.innerHTML=`<li>Nenhuma alteração de pontuação ou grafia foi necessária. O texto está perfeito!</li>`,t.style.display=`block`)}catch(n){console.warn(`LanguageTool API failed, falling back to local checker`,n);let r=L(e);e=r.corrected,t&&o&&s&&(s.innerHTML=`<i data-lucide="alert-triangle" style="color: var(--clr-danger);"></i> Análise de Pontuação (Modo Offline)`,r.changes.length>0?o.innerHTML=`
                  <li style="color: var(--clr-text-secondary); margin-bottom: var(--space-2); font-style: italic;">
                    ⚠️ A API de correção online está temporariamente inacessível. Usando o corretor básico local.
                  </li>
                `+r.changes.map(e=>`
                  <li>
                    <span class="badge" style="background: var(--clr-danger-light); color: var(--clr-danger); padding: 2px 6px; border-radius: 4px; font-weight: 600; font-size: 11px; margin-right: 8px;">${e.category}</span>
                    ${e.description} (de <del style="color:var(--clr-danger);">${e.original}</del> para <strong style="color:var(--clr-success);">${e.corrected}</strong>)
                  </li>
                `).join(``):o.innerHTML=`<li>⚠️ Modo Offline: Nenhuma alteração básica de pontuação foi detectada.</li>`,t.style.display=`block`)}finally{i.disabled=!1,i.innerHTML=n,window.lucide&&window.lucide.createIcons()}break}}r.value=e,window.lucide&&window.lucide.createIcons()}),document.getElementById(`btn-txt-copy`).addEventListener(`click`,()=>{r.value&&navigator.clipboard.writeText(r.value)}),document.getElementById(`btn-txt-clear`).addEventListener(`click`,()=>{n.value=``,r.value=``;let e=document.getElementById(`txt-report`);e&&(e.style.display=`none`)})}};async function P(e){let t=new URLSearchParams;t.append(`text`,e),t.append(`language`,`pt-BR`),t.append(`level`,`picky`);let n=await fetch(`https://api.languagetool.org/v2/check`,{method:`POST`,headers:{"Content-Type":`application/x-www-form-urlencoded;charset=UTF-8`},body:t});if(!n.ok)throw Error(`LanguageTool API HTTP Error: `+n.status);return await n.json()}function F(e,t){if(!t||t.length===0)return{corrected:e,changes:[]};let n=e,r=[],i=[...t].sort((e,t)=>t.offset-e.offset),a=1/0;return i.forEach(e=>{if(!(e.offset+e.length>a)&&e.replacements&&e.replacements.length>0){let t=e.replacements[0].value,i=n.slice(e.offset,e.offset+e.length);n=n.slice(0,e.offset)+t+n.slice(e.offset+e.length),a=e.offset;let o=`Ortografia`;e.rule&&e.rule.issueType===`punctuation`?o=`Pontuação`:e.rule&&e.rule.category&&e.rule.category.name&&(o=e.rule.category.name),r.unshift({category:o,description:e.message||`Correção sugerida pelo dicionário.`,original:i,corrected:t})}}),{corrected:n,changes:r}}function I(e){let t=e,n=[],r=/\b([a-zà-úç]+)\s+(muito\s+obrigad[oa]|obrigad[oa]|por\s+favor|por\s+gentileza|desde\s+já\s+agradeço|grat[oa])\b/gi,i=t.match(r)||[];if(i.length>0){let e=!1;t=t.replace(r,(t,n,r)=>[`um`,`o`,`meu`,`de`,`para`,`em`,`com`,`sem`,`por`,`que`,`se`,`e`,`mas`,`ou`].includes(n.toLowerCase())?t:(e=!0,`${n}. ${r.charAt(0).toUpperCase()+r.slice(1)}`)),e&&n.push({category:`Pontuação`,description:`Adicionada conclusão de oração e ponto final antes de termo de cortesia.`,original:i[0],corrected:i[0].replace(/\b(muito\s+obrigad[oa]|obrigad[oa]|por\s+favor|por\s+gentileza|desde\s+já\s+agradeço|grat[oa])\b/gi,e=>`. ${e.charAt(0).toUpperCase()+e.slice(1)}`)})}let a=/\b([a-zà-úç]+|\.)\s+(fico\s+[áa]\s+disposição|fico\s+[áa]\s+disposicao|atenciosamente|cordialmente|um\s+abraço|abraços|saudações)\b/gi,o=t.match(a)||[];if(o.length>0){let e=!1;t=t.replace(a,(t,n,r)=>{if(n===`.`)return t;e=!0;let i=r.replace(/fico\s+[áa]\s+disposição/i,`fico à disposição`).replace(/fico\s+[áa]\s+disposicao/i,`fico à disposição`);return`${n}. ${i.charAt(0).toUpperCase()+i.slice(1)}`}),e&&n.push({category:`Pontuação`,description:`Adicionado ponto final e maiúscula antes de frase de fechamento.`,original:o[0],corrected:o[0].replace(/\b(fico\s+[áa]\s+disposiçã|fico\s+[áa]\s+disposicao|atenciosamente|cordialmente|um\s+abraço|abraços|saudações)/gi,e=>`. ${e.charAt(0).toUpperCase()+e.slice(1)}`)})}let s=/\b(olá|ola|oi|bom\s+dia|boa\s+tarde|boa\s+noite)\s+([a-zà-úç]+)?\s*(tudo\s+bem|tudo\s+bom|como\s+vai|como\s+está|como\s+esta)([\?!.])?/gi,c=t.match(s)||[];c.length>0&&(t=t.replace(s,(e,t,n,r,i)=>{let a=t.toLowerCase().replace(`ola`,`olá`),o=a.charAt(0).toUpperCase()+a.slice(1),s=i||`?`;return n&&![`tudo`,`como`].includes(n.toLowerCase())?`${o}, ${n.charAt(0).toUpperCase()+n.slice(1)}, ${r}${s}`:`${o}, ${r}${s}`}),n.push({category:`Pontuação`,description:`Adicionada vírgula de vocativo em saudação.`,original:c[0],corrected:`Saudação padronizada`}));let l=/\b([a-zà-úç]{3,})\s+([a-zà-úç]{3,})\s+([a-zà-úç]{3,})\s+(e|ou)\s+([a-zà-úç]{3,})\b/gi,u=t.match(l)||[];u.length>0&&(t=t.replace(l,(e,t,n,r,i,a)=>{let o=[`que`,`para`,`como`,`mais`,`onde`,`quando`];return o.includes(t.toLowerCase())||o.includes(n.toLowerCase())?e:`${t}, ${n}, ${r} ${i} ${a}`}),n.push({category:`Pontuação`,description:`Adicionadas vírgulas de enumeração em lista.`,original:u[0],corrected:`[Lista pontuada]`}));let d=/([^,;:.!?\s])\s+\b(mas|porém|todavia|contudo|entretanto|portanto)\b/gi,f=t.match(d)||[];f.length>0&&(t=t.replace(d,`$1, $2`),n.push({category:`Pontuação`,description:`Adicionada vírgula antes de conjunção.`,original:f[0],corrected:f[0].replace(/\s+/,`, `)}));let p=/(^|[\n.!?…]\s+)(Além disso|Por isso|Portanto|Ou seja|Por exemplo|No entanto|Entretanto|Contudo|Todavia|Desse modo|Desta forma|Em suma)\s+([^,;.\s])/gi,m=t.match(p)||[];m.length>0&&(t=t.replace(p,`$1$2, $3`),n.push({category:`Pontuação`,description:`Adicionada vírgula após termo introdutório.`,original:m[0],corrected:m[0].replace(/([a-zà-úç]+)\s+([a-zà-úç]+)/i,`$1, $2`)}));let h=/\b(São Paulo|Rio de Janeiro|Belo Horizonte|Curitiba|Porto Alegre|Brasília|Salvador|Recife|Fortaleza)\s+(\d{1,2}\s+de\s+[a-z]+)\b/gi,g=t.match(h)||[];g.length>0&&(t=t.replace(h,`$1, $2`),n.push({category:`Pontuação`,description:`Adicionada vírgula entre cidade e data.`,original:g[0],corrected:g[0].replace(/\s+(\d)/,`, $1`)}));let _=/\besta\s+([a-zà-úç]+(?:ando|endo|indo))\b/gi;_.test(t)&&(t=t.replace(_,`está $1`),n.push({category:`Ortografia`,description:`Corrigida a grafia do verbo "está" antes de gerúndio.`,original:`esta`,corrected:`está`}));let v=/\b(ele|ela|isso|isto|aquilo|você|voce|o\s+que)\s+e\b/gi;v.test(t)&&(t=t.replace(v,`$1 é`),n.push({category:`Ortografia`,description:`Corrigido verbo "é" após pronome.`,original:`e`,corrected:`é`}));let y=t.split(`
`),b=0,x=y.map(e=>{let t=e.trim();return t.length>0&&!/[.!?:"')\]…]$/.test(t)&&!t.endsWith(`”`)&&!t.endsWith(`’`)?(b++,e+`.`):e});b>0&&(t=x.join(`
`),n.push({category:`Pontuação`,description:`Adicionado ponto final no encerramento da frase.`,original:`[Fim de frase]`,corrected:`.`}));let S=/(^|[\n.!?…]\s+)([a-zà-úç])/g,C=t.match(S)||[];return C.length>0&&(t=t.replace(S,(e,t,n)=>t+n.toUpperCase()),n.push({category:`Maiúsculas`,description:`Capitalizada letra inicial de frase/parágrafo.`,original:C[0].trim(),corrected:C[0].trim().toUpperCase()})),t=t.replace(/[ \t]{2,}/g,` `).replace(/\.\./g,`.`),{corrected:t,changes:n}}function L(e){let t=e;return t=t.replace(/\s+/g,` `),t=t.replace(/\s+([.,!?:;])/g,`$1`),t=t.replace(/([.,!?:;])(?=[a-zA-Zà-úÀ-Ú])/g,`$1 `),{corrected:t,changes:[]}}var R={render(){return`
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
    `},init(){document.getElementById(`btn-export`).addEventListener(`click`,()=>{let t={tasks:e.get(`wb-tasks`,[]),sessions:e.get(`wb-time-sessions`,[]),settings:e.get(`wb-settings`,{})},n=new Blob([JSON.stringify(t,null,2)],{type:`application/json`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=`workbase-backup-${new Date().toISOString().split(`T`)[0]}.json`,i.click(),URL.revokeObjectURL(r)}),document.getElementById(`input-import`).addEventListener(`change`,t=>{let n=t.target.files[0];if(!n)return;let r=new FileReader;r.onload=t=>{try{let n=JSON.parse(t.target.result);n.tasks&&e.set(`wb-tasks`,n.tasks),n.sessions&&e.set(`wb-time-sessions`,n.sessions),n.settings&&e.set(`wb-settings`,n.settings),alert(`Backup importado com sucesso! A página será recarregada.`),window.location.reload()}catch{alert(`Erro ao importar arquivo. Formato inválido.`)}},r.readAsText(n)}),document.getElementById(`btn-clear`).addEventListener(`click`,()=>{confirm(`Tem certeza? ISSO APAGARÁ TODAS AS TAREFAS E SESSÕES.`)&&(e.clear(),alert(`Dados apagados. A página será recarregada.`),window.location.reload())})}};function z(e){let t=e===`dark`;t?document.documentElement.setAttribute(`data-theme`,`dark`):document.documentElement.removeAttribute(`data-theme`);let n=document.getElementById(`theme-toggle-icon`),r=document.getElementById(`theme-toggle-text`),i=document.getElementById(`theme-toggle-icon-mobile`);n&&n.setAttribute(`data-lucide`,t?`sun`:`moon`),r&&(r.textContent=t?`Modo Claro`:`Modo Escuro`),i&&i.setAttribute(`data-lucide`,t?`sun`:`moon`),window.lucide&&window.lucide.createIcons()}function B(){z(s.get().theme||`light`);let e=document.getElementById(`theme-toggle-btn`),t=document.getElementById(`theme-toggle-btn-mobile`),n=()=>{let e=(s.get().theme||`light`)===`dark`?`light`:`dark`;s.update({theme:e}),z(e)};e&&e.addEventListener(`click`,n),t&&t.addEventListener(`click`,n)}function V(){i.migrateLegacyTasks(),document.getElementById(`sidebar`).innerHTML=l(),document.getElementById(`bottom-nav`).innerHTML=u(),document.body.insertAdjacentHTML(`beforeend`,v()),B(),c.add(`/hoje`,C),c.add(`/tarefas`,T),c.add(`/foco`,E),c.add(`/notas`,k),c.add(`/ferramentas`,N),c.add(`/configuracoes`,R),window.router=c,c.init(`app-content`),y(),window.addEventListener(`popstate`,()=>{_.notifyListeners()}),window.lucide&&window.lucide.createIcons()}document.addEventListener(`DOMContentLoaded`,V);