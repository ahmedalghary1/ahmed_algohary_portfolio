import { MOTION } from './config.js';
export const vertexShader=`varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
export const fragmentShader=`uniform sampler2D image;uniform float progress;varying vec2 vUv;
float noise(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){float pulse=sin(progress*3.14159265);float edge=progress*1.3-.15;float n=noise(floor(vUv*64.0));float band=1.0-smoothstep(0.02,0.16,abs(vUv.x-edge+(n-.5)*.035));vec2 uv=vUv+vec2(sin(vUv.y*18.0)*${MOTION.distortion},0.0)*pulse*band;vec4 c=texture2D(image,clamp(uv,0.0,1.0));gl_FragColor=vec4(c.rgb,band*pulse*.7);}`;
