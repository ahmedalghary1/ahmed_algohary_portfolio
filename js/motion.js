import { projectShowcase } from './motion/project-showcase.js';
function loadScript(path) {
 return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=new URL(path,import.meta.url);s.onload=resolve;s.onerror=reject;document.head.append(s);});
}
export async function initMotion(signal) {
 await loadScript('../assets/vendor/gsap.min.js');await loadScript('../assets/vendor/ScrollTrigger.min.js');if(signal.aborted)return;
 const {gsap,ScrollTrigger}=window;gsap.registerPlugin(ScrollTrigger);
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),button=document.querySelector('[data-motion-switch]');
 let paused=new URL(location.href).searchParams.get('motion')==='off',controller,context;
 function labels(){const ar=document.documentElement.lang==='ar';button.textContent=paused||reduced.matches?(ar?'تفعيل الحركة':'Enable motion'):(ar?'إيقاف الحركة':'Pause motion');button.setAttribute('aria-pressed',String(paused||reduced.matches));document.querySelector('[data-project-previous]').setAttribute('aria-label',ar?'المشروع السابق':'Previous project');document.querySelector('[data-project-next]').setAttribute('aria-label',ar?'المشروع التالي':'Next project');}
 function stop(){controller?.abort();context?.revert();controller=null;context=null;document.documentElement.dataset.motion='off';}
 function start(){
  stop();labels();if(paused||reduced.matches||signal.aborted)return;
  controller=new AbortController();const life=controller.signal;document.documentElement.dataset.motion='on';
  context=gsap.context(()=>{
   gsap.from('.hero-line',{y:18,clipPath:'inset(0 0 95% 0)',duration:.8,stagger:.1,ease:'power3.out',clearProps:'all'});
   projectShowcase(gsap,ScrollTrigger,life);
   if(!document.querySelector('#work').classList.contains('is-horizontal'))document.querySelectorAll('.project-window').forEach(el=>gsap.from(el,{rotationY:innerWidth>600?8:0,rotationX:innerWidth>600?5:0,y:24,duration:.7,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%',toggleActions:'play none none reverse'},clearProps:'transform'}));
   document.querySelectorAll('.section-heading h2,.about-copy,.contact h2,.contact-channel,.contact-form').forEach(el=>gsap.from(el,{y:18,clipPath:'inset(0 0 8% 0)',duration:.7,scrollTrigger:{trigger:el,start:'top 95%',once:true},clearProps:'all'}));
   document.querySelectorAll('.skill-category,.process-list li').forEach(el=>gsap.from(el,{y:16,duration:.6,scrollTrigger:{trigger:el,start:'top 94%',once:true},clearProps:'transform'}));
   document.querySelectorAll('.skill-category').forEach(el=>gsap.from(el.querySelectorAll('.skill-token'),{y:8,opacity:.6,stagger:.025,duration:.35,scrollTrigger:{trigger:el,start:'top 94%',once:true},clearProps:'all'}));
   gsap.from('.featured-technology',{y:12,stagger:.035,duration:.5,scrollTrigger:{trigger:'.featured-stack',start:'top 92%',once:true},clearProps:'transform'});
   if(innerWidth>600)gsap.to('.about .portrait',{y:-20,ease:'none',scrollTrigger:{trigger:'#about',start:'top bottom',end:'bottom top',scrub:.6}});
  });
  document.querySelectorAll('.project-visual').forEach(el=>{
   el.addEventListener('pointermove',e=>{if(!matchMedia('(pointer:fine)').matches)return;const r=el.getBoundingClientRect();el.style.transform=`rotateX(${-(e.clientY-r.top-r.height/2)/r.height*3}deg) rotateY(${(e.clientX-r.left-r.width/2)/r.width*3}deg)`;},{signal:life});
   el.addEventListener('pointerleave',()=>el.style.removeProperty('transform'),{signal:life});
   life.addEventListener('abort',()=>el.style.removeProperty('transform'),{once:true});
  });
  import('./motion/scene-manager.js').then(m=>m.sceneManager(gsap,ScrollTrigger,life)).catch(()=>{});ScrollTrigger.refresh();
 }
 button.hidden=false;button.addEventListener('click',()=>{paused=!paused;start();},{signal});reduced.addEventListener('change',start,{signal});matchMedia('(max-width:600px)').addEventListener('change',start,{signal});document.addEventListener('portfolio:language',labels,{signal});document.querySelectorAll('details').forEach(d=>d.addEventListener('toggle',()=>ScrollTrigger.refresh(),{signal}));signal.addEventListener('abort',stop,{once:true});start();
}
