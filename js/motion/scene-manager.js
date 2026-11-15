import { MOTION, qualityTier } from './config.js';
import { frameScheduler, pixelRatio } from './performance-manager.js';
import { vertexShader, fragmentShader } from './shaders.js';
export async function sceneManager(gsap, ScrollTrigger, signal) {
  if (qualityTier() === 'light') return;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2', { alpha:true, antialias:true, powerPreference:'low-power' });
  if (!context) return;
  const T = await import('../../assets/vendor/three.module.min.js');
  if (signal.aborted) return;
  const renderer = new T.WebGLRenderer({canvas,context,alpha:true,antialias:true});
  canvas.className='cinematic-canvas'; canvas.setAttribute('aria-hidden','true');
  document.body.append(canvas);
  const scene=new T.Scene(), camera=new T.PerspectiveCamera(35,1,.1,60), group=new T.Group();
  const geometry=new T.BoxGeometry(1,.065,.065);
  const metal=new T.MeshStandardMaterial({color:MOTION.metal,metalness:.72,roughness:.32});
  const accent=new T.MeshStandardMaterial({color:MOTION.accent,metalness:.45,roughness:.4});
  for(let i=0;i<6;i++) {
    const frame=new T.Group();
    for(let j=0;j<4;j++) {
      const mesh=new T.Mesh(geometry,j===i%4?accent:metal);
      const a=j*Math.PI/2;mesh.position.set(Math.sin(a)*.5,Math.cos(a)*.5,0);mesh.rotation.z=a;
      frame.add(mesh);
    }
    frame.position.z=(i-2.5)*.2;frame.rotation.z=i*.13;group.add(frame);
  }
  // Batch the 24 structural beams into two draw calls, one per material.
  group.updateMatrixWorld(true);
  const metalBatch=new T.InstancedMesh(geometry,metal,18),accentBatch=new T.InstancedMesh(geometry,accent,6);
  let mi=0,ai=0;
  group.traverse(node=>{if(node.isMesh){if(node.material===accent)accentBatch.setMatrixAt(ai++,node.matrixWorld);else metalBatch.setMatrixAt(mi++,node.matrixWorld);}});
  group.clear();group.add(metalBatch,accentBatch);
  scene.add(group,new T.HemisphereLight(0xffffff,0x57574f,2));
  const light=new T.DirectionalLight(0xfff5e6, MOTION.light);light.position.set(3,4,5);scene.add(light);
  const slots=[...document.querySelectorAll('.scene-slot')];
  let lost=false, intro=performance.now(), pointer=0;
  const images=[], imageScene=new T.Scene(), imageCamera=new T.OrthographicCamera(-1,1,1,-1,0,2);
  imageCamera.position.z=1;
  const plane=new T.PlaneGeometry(2,2);
  const loader=new T.TextureLoader();
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting || qualityTier()!=='desktop')return;
    observer.unobserve(entry.target);
    loader.load(entry.target.currentSrc||entry.target.src,texture=>{
      if(signal.aborted){texture.dispose();return;}
      texture.colorSpace=T.SRGBColorSpace;
      const material=new T.ShaderMaterial({vertexShader,fragmentShader,transparent:true,depthTest:false,uniforms:{image:{value:texture},progress:{value:0}}});
      const mesh=new T.Mesh(plane,material);imageScene.add(mesh);
      images.push({element:entry.target,mesh,texture,start:performance.now()});scheduler.invalidate();
    },undefined,()=>{});
  }),{threshold:.3});
  const state={rotation:0,z:4.2,scale:1,x:0,cameraX:.3,closingRotation:1.5};
  const timeline=gsap.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:MOTION.scrub}})
    .to(state,{rotation:1.5,z:5.8,scale:.8,x:.15,cameraX:1,ease:'none'});
  const closingTimeline=gsap.to(state,{closingRotation:.6,ease:'none',scrollTrigger:{trigger:'#contact',start:'top bottom',end:'top 25%',scrub:MOTION.scrub}});
  let frames=0;
  const scheduler=frameScheduler(time=>{
    if(lost)return false;
    renderer.info.autoReset=false;renderer.info.reset();
    renderer.setScissorTest(false);renderer.clear();renderer.setScissorTest(true);
    let visible=false;
    for(const slot of slots){
      const r=slot.getBoundingClientRect();
      if(r.bottom<0||r.top>innerHeight||!r.width)continue;
      visible=true;
      renderer.setViewport(r.left,innerHeight-r.bottom,r.width,r.height);
      renderer.setScissor(Math.max(0,r.left),Math.max(0,innerHeight-r.bottom),Math.min(r.width,innerWidth-r.left),Math.min(r.height,innerHeight-r.top));
      const closing=slot.dataset.scene==='contact';
      camera.aspect=r.width/r.height;camera.position.set(closing?.6:state.cameraX,.6,closing?4.5:state.z);camera.lookAt(0,0,0);camera.updateProjectionMatrix();
      group.scale.setScalar(closing?1:state.scale);group.position.x=closing?0:state.x;
      const idle=Math.min(1,(time-intro)/(MOTION.idleSeconds*1000));
      group.rotation.set(.3,closing?state.closingRotation:state.rotation+idle*.35+pointer*.08,closing?-.2:.15);
      renderer.render(scene,camera);slot.dataset.webgl='true';
    }
    let revealing=false;
    for(const image of images){
      const p=Math.min(1,(time-image.start)/(MOTION.shaderSeconds*1000));
      image.mesh.material.uniforms.progress.value=p;
      if(p>=1)continue;
      const r=image.element.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight||r.right<0||r.left>innerWidth)continue;
      imageScene.children.forEach(mesh=>mesh.visible=mesh===image.mesh);
      renderer.setViewport(r.left,innerHeight-r.bottom,r.width,r.height);
      renderer.setScissor(Math.max(0,r.left),Math.max(0,innerHeight-r.bottom),Math.min(r.width,innerWidth-r.left),Math.min(r.height,innerHeight-r.top));
      renderer.clearDepth();renderer.render(imageScene,imageCamera);revealing=true;
    }
    canvas.dataset.frames=String(++frames);
    canvas.dataset.drawCalls=String(renderer.info.render.calls);
    return revealing || (visible && time-intro<MOTION.idleSeconds*1000);
  },signal);
  const resize=()=>{renderer.setPixelRatio(pixelRatio(qualityTier()));renderer.setSize(innerWidth,innerHeight,false);scheduler.invalidate();};
  document.querySelectorAll('.project-visual img').forEach(image=>observer.observe(image));
  window.addEventListener('resize',resize,{signal});
  window.addEventListener('scroll',scheduler.invalidate,{passive:true,signal});
  document.addEventListener('portfolio:motion-frame',scheduler.invalidate,{signal});
  window.addEventListener('pointermove',e=>{if(matchMedia('(pointer:fine)').matches){pointer=e.clientX/innerWidth-.5;scheduler.invalidate();}},{passive:true,signal});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;slots.forEach(s=>delete s.dataset.webgl);},{signal});
  canvas.addEventListener('webglcontextrestored',()=>{lost=false;resize();},{signal});
  signal.addEventListener('abort',()=>{observer.disconnect();images.forEach(i=>{i.texture.dispose();i.mesh.material.dispose();});plane.dispose();closingTimeline.scrollTrigger?.kill();closingTimeline.kill();timeline.scrollTrigger?.kill();timeline.kill();geometry.dispose();metal.dispose();accent.dispose();renderer.dispose();canvas.remove();slots.forEach(s=>delete s.dataset.webgl);},{once:true});
  resize();
}
