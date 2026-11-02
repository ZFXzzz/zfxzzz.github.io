/* Project wheel: selection rotates the ring; case evidence stays in the original dialogs. */
(()=>{
 const root=document.querySelector('#app'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const names=[['K3 · H20-3e','K3 · H20-3e'],['K2 / 1P1D','K2 / 1P1D'],['离线语音','Speech'],['多卡排障','Multi-GPU'],['GPU 恢复','GPU recovery'],['服务网关','Gateway'],['训练验证','Training']];
 const summaries=[['双节点 · 16 张 H20-3e','Two nodes · 16 H20-3e GPUs'],['服务交付与 Prefill / Decode 路径','Serving and prefill / decode paths'],['中英泰 ASR / TTS 服务','Chinese / English / Thai ASR & TTS'],['从模型切分到跨节点通信','From model sharding to communication'],['隔离异常，恢复真实观测','Contain incidents and restore telemetry'],['路由、鉴权与并发预留','Routing, authentication and capacity'],['数据、训练与部署验证','Data, training and deployment checks']];
 let dispose=()=>{};
 function mount(){
  const system=root.querySelector('.hero-grid>.system');if(!system)return;
  dispose();const en=document.documentElement.lang==='en',t=(a)=>a[en?1:0];
  const host=document.createElement('div');host.className='wheel-panel';
  host.innerHTML=`<div class="wheel-heading"><span>PROJECT ORBIT / 07</span><button class="wheel-play" aria-pressed="${!reduced.matches}">${t(['暂停轮播','Pause rotation'])}</button></div><div class="project-wheel" role="region" aria-label="${t(['项目轮盘','Project wheel'])}"><div class="wheel-halo" aria-hidden="true"></div><div class="wheel-ticks" aria-hidden="true"></div><div class="wheel-ring">${projects.map((p,i)=>{const a=i*2*Math.PI/7;return `<button class="wheel-node" style="left:${50+40*Math.sin(a)}%;top:${50-40*Math.cos(a)}%" data-orbit="${i}" aria-pressed="${i===0}" aria-label="${t(p.title)}"><small>0${i+1}</small><span>${t(names[i])}</span></button>`}).join('')}</div><div class="wheel-core"><span class="wheel-counter">01 / 07</span><h2></h2><p></p><button class="wheel-open">${t(['查看案例 ↗','Read case ↗'])}</button></div></div><div class="wheel-controls"><button class="wheel-prev" aria-label="${t(['上一项目','Previous project'])}">←</button><span>${t(['拖动轮盘 · 点击项目','Drag to rotate · Select a project'])}</span><button class="wheel-next" aria-label="${t(['下一项目','Next project'])}">→</button></div><details class="wheel-architecture"><summary>${t(['展开部署架构示意','Explore the deployment schematic'])} <span>＋</span></summary></details>`;
  system.replaceWith(host);host.querySelector('details').append(system);
  const wheel=host.querySelector('.project-wheel'),ring=host.querySelector('.wheel-ring'),core=host.querySelector('.wheel-core'),play=host.querySelector('.wheel-play');
  let index=0,rotation=0,playing=!reduced.matches,paused=false,startX=null;
  function select(next){const n=(next+7)%7;let delta=n-index;if(delta>3)delta-=7;if(delta< -3)delta+=7;rotation-=delta*360/7;index=n;ring.style.setProperty('--wheel-rotation',`${rotation}deg`);core.querySelector('h2').textContent=t(names[n]);core.querySelector('p').textContent=t(summaries[n]);core.querySelector('.wheel-counter').textContent=`0${n+1} / 07`;host.querySelectorAll('.wheel-node').forEach((b,i)=>b.setAttribute('aria-pressed',i===n));if(!reduced.matches)core.animate([{opacity:.25,transform:'scale(.96)'},{opacity:1,transform:'scale(1)'}],{duration:450,easing:'ease-out'})}
  function setPlay(value){playing=value;play.setAttribute('aria-pressed',playing);play.textContent=playing?t(['暂停轮播','Pause rotation']):t(['播放轮播','Play rotation'])}
  select(0);setPlay(playing);
  host.querySelectorAll('[data-orbit]').forEach(b=>b.onclick=()=>{select(Number(b.dataset.orbit));setPlay(false)});
  host.querySelector('.wheel-prev').onclick=()=>{select(index-1);setPlay(false)};host.querySelector('.wheel-next').onclick=()=>{select(index+1);setPlay(false)};
  host.querySelector('.wheel-open').onclick=()=>openCase(projects[index].id);
  play.onclick=()=>setPlay(!playing);
  wheel.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;startX=e.clientX;wheel.setPointerCapture(e.pointerId)});
  wheel.addEventListener('pointerup',e=>{if(startX===null)return;const delta=e.clientX-startX;startX=null;if(Math.abs(delta)>25){select(index+(delta<0?1:-1));setPlay(false)}});
  wheel.addEventListener('pointercancel',()=>startX=null);
  host.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();select(index+(e.key==='ArrowRight'?1:-1));setPlay(false)}});
  host.addEventListener('pointerenter',()=>paused=true);host.addEventListener('pointerleave',()=>paused=false);
  const timer=setInterval(()=>{if(playing&&!paused&&!document.hidden&&!host.contains(document.activeElement)&&!document.querySelector('dialog[open]')&&!reduced.matches&&host.getBoundingClientRect().bottom>0&&host.getBoundingClientRect().top<innerHeight)select(index+1)},5500);
  const onReduced=()=>{if(reduced.matches)setPlay(false)};reduced.addEventListener('change',onReduced);
  dispose=()=>{clearInterval(timer);reduced.removeEventListener('change',onReduced)};
 }
 new MutationObserver(mount).observe(root,{childList:true});mount();
})();
