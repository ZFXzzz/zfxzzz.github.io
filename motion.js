/* A local, deterministic project explorer. No model API or chat transcript. */
(()=>{
 const root=document.querySelector('#app');
 const zh=()=>document.documentElement.lang.startsWith('zh');
 function mount(){
  const hero=root.querySelector('.hero-copy');
  if(!hero||hero.querySelector('.explorer'))return;
  const box=document.createElement('div');box.className='explorer';
  box.innerHTML=`<div class="explorer-label"><span class="explorer-star">✳</span> ${zh()?'从一个工程问题开始':'Start with an engineering question'}<small>EXPLORE / 07</small></div><form class="explorer-form"><input aria-label="${zh()?'搜索项目':'Search projects'}" placeholder="${zh()?'想了解 H20-3e 部署、排障，还是开源贡献？':'Explore H20-3e deployment, speech or debugging…'}" autocomplete="off"><button aria-label="${zh()?'查找案例':'Find cases'}">↗</button></form><div class="explorer-prompts">${(zh()?['H20-3e 部署','CUDA 排障','语音服务']:['H20-3e deployment','CUDA debugging','Speech service']).map((x,i)=>`<button type="button" data-explore="${['H20-3e','CUDA','speech'][i]}">${x} <span>↗</span></button>`).join('')}</div><div class="explorer-results" role="region" aria-label="${zh()?'项目搜索结果':'Project search results'}" hidden></div><div class="explorer-status" role="status"></div>`;
  hero.append(box);
  const input=box.querySelector('input'),results=box.querySelector('.explorer-results'),status=box.querySelector('.explorer-status');
  function search(query){
   const q=query.trim().toLowerCase();
   if(!q){results.hidden=true;status.textContent='';return}
   const terms=q.split(/\s+/).filter(Boolean);
   const aliases={speech:'speech',语音:'speech',开源:'k3',贡献:'k3',flashinfer:'k3',debugging:'multimodel',排障:'multimodel'};
   const found=projects.filter(p=>{const text=[p.id,...p.title,...p.desc,...p.tags].join(' ').toLowerCase();return terms.some(t=>text.includes(t)||aliases[t]===p.id)}).slice(0,4);
   results.hidden=false;
   results.replaceChildren();
   found.forEach((p,i)=>{const b=document.createElement('button');b.type='button';b.className='explorer-result';b.style.setProperty('--result-index',i);const n=document.createElement('small');n.textContent=`0${projects.indexOf(p)+1}`;const label=document.createElement('span');label.textContent=p.title[zh()?0:1];const arrow=document.createElement('span');arrow.textContent='↗';b.append(n,label,arrow);b.onclick=()=>openCase(p.id);results.append(b)});
   status.textContent=found.length?(zh()?`${found.length} 个相关案例 · 点击查看工程细节`:`${found.length} related cases · Open the engineering details`):(zh()?'暂无匹配，试试 H20-3e、CUDA、ASR 或 Ray。':'No match. Try H20-3e, CUDA, ASR or Ray.');
  }
  box.querySelector('form').onsubmit=e=>{e.preventDefault();search(input.value)};
  box.querySelectorAll('[data-explore]').forEach(b=>b.onclick=()=>{input.value=b.dataset.explore;search(input.value)});
  input.addEventListener('input',()=>search(input.value));
  input.addEventListener('keydown',e=>{if(e.key==='Escape'){input.value='';search('')}if(e.key==='ArrowDown'){e.preventDefault();results.querySelector('button')?.focus()}});
 }
 new MutationObserver(mount).observe(root,{childList:true});mount();
 let frame=0,lastTarget=null;
 root.addEventListener('pointermove',e=>{
  if(e.pointerType==='touch'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const card=e.target.closest('.project,.system,.explorer');if(!card)return;
  if(lastTarget&&lastTarget!==card)lastTarget.classList.remove('pointer-active');lastTarget=card;
  if(frame)return;
  const x=e.clientX,y=e.clientY;
  frame=requestAnimationFrame(()=>{const r=card.getBoundingClientRect();card.style.setProperty('--pointer-x',`${x-r.left}px`);card.style.setProperty('--pointer-y',`${y-r.top}px`);card.classList.add('pointer-active');frame=0});
 },{passive:true});
 root.addEventListener('pointerleave',()=>lastTarget?.classList.remove('pointer-active'));
})();
