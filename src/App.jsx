import React,{Suspense,useEffect,useMemo,useRef,useState}from"react";
import{Canvas,useFrame}from"@react-three/fiber";
import{Float,Stars,Sparkles,Text,Environment}from"@react-three/drei";
import*as THREE from"three";
import gsap from"gsap";
import{ChevronRight,Volume2,VolumeX,Heart as HeartIcon,Gift as GiftIcon,Camera,RotateCcw,Play,ArrowLeft,ArrowRight}from"lucide-react";
import{birthdayConfig as cfg}from"./data/birthdayConfig";

const memories=[
 {title:"Tiny wonders",subtitle:"A little world full of big imagination",year:"Then",color:"#ffb5d9",p:[-2.35,1.25,.2]},
 {title:"Growing dreams",subtitle:"Learning, laughing, changing — one day at a time",year:"Along the way",color:"#c8b5ff",p:[2.15,1.45,-.1]},
 {title:"The people who stayed",subtitle:"The quiet comfort of knowing you are loved",year:"Always",color:"#ffd9a8",p:[2.25,-1.25,.15]},
 {title:"A light of your own",subtitle:"The person you are becoming",year:"Today",color:"#f7b8dc",p:[-2.2,-1.3,-.15]}
];
const constellation=[
 [-1.8,1.35,.25],[-1.05,1.8,.1],[0,1.35,.05],[1.05,1.8,.1],[1.8,1.35,.25],
 [1.25,.45,0],[.75,-.2,.05],[0,-1.25,.1],[-.75,-.2,.05],[-1.25,.45,0]
];
const links=[[0,1],[1,2],[2,3],[3,4],[0,9],[9,8],[8,7],[7,6],[6,5],[5,4],[5,6],[6,7],[7,8],[8,9]];
function MemoryGalaxy({active,setActive}){
 const g=useRef();
 const focus=memories[active]?.p||[0,0,0];
 useFrame((s,d)=>{
   if(g.current){
     g.current.rotation.y+=d*.025;
     g.current.rotation.x=Math.sin(s.clock.elapsedTime*.25)*.025;
   }
 });
 return <group ref={g}>
   <pointLight position={[0,0,2]} color="#dca8ff" intensity={3.5} distance={7}/>
   <Sparkles count={180} scale={7} size={2.8} speed={.45} color="#f9d9ef"/>
   {links.map(([a,b],i)=>{
     const A=new THREE.Vector3(...constellation[a]),B=new THREE.Vector3(...constellation[b]);
     return <line key={i}>
       <bufferGeometry><bufferAttribute attach="attributes-position" count={2} array={new Float32Array([...A.toArray(),...B.toArray()])} itemSize={3}/></bufferGeometry>
       <lineBasicMaterial color="#e9a9d7" transparent opacity={.34}/>
     </line>
   })}
   {constellation.map((p,i)=><Float key={i} speed={.7+i*.03} floatIntensity={.12}>
     <mesh position={p} scale={i===0||i===4?1.15:.7}>
       <sphereGeometry args={[.045,16,16]}/>
       <meshBasicMaterial color="#ffdff1"/>
     </mesh>
   </Float>)}
   <Heart scale={.085} wire/>
   {memories.map((m,i)=><Float key={m.title} speed={1+i*.12} floatIntensity={.45} rotationIntensity={.15}>
     <group position={m.p}>
       <mesh onClick={e=>{e.stopPropagation();setActive(i)}} scale={active===i?1.55:1}>
         <sphereGeometry args={[.16,32,32]}/>
         <meshStandardMaterial color={m.color} emissive={m.color} emissiveIntensity={active===i?8:4} metalness={.2} roughness={.16}/>
       </mesh>
       <mesh scale={active===i?2.15:1.55}>
         <sphereGeometry args={[.16,20,20]}/>
         <meshBasicMaterial color={m.color} transparent opacity={active===i?.12:.045}/>
       </mesh>
       <pointLight color={m.color} intensity={active===i?4:1.2} distance={3.5}/>
     </group>
   </Float>)}
 </group>
}
function Gift({open,onOpen}){const lid=useRef();useEffect(()=>{if(!lid.current)return;gsap.to(lid.current.rotation,{z:open?-.65:0,x:open?-.65:0,duration:1.3,ease:"back.out(1.6)"});gsap.to(lid.current.position,{y:open?1.45:.75,duration:1.3,ease:"power3.out"})},[open]);return <group onClick={e=>{e.stopPropagation();onOpen()}}><pointLight position={[0,1,1]} color="#ffd4eb" intensity={open?10:2} distance={7}/><mesh position={[0,-.55,0]}><boxGeometry args={[2.35,1.6,1.9]}/><meshStandardMaterial color="#8d416f" metalness={.25} roughness={.4}/></mesh><mesh position={[0,-.55,1]}><boxGeometry args={[.3,1.62,.03]}/><meshStandardMaterial color="#f3bfdc" emissive="#e879b0" emissiveIntensity={1}/></mesh><group ref={lid} position={[0,.75,0]}><mesh><boxGeometry args={[2.6,.28,2.12]}/><meshStandardMaterial color="#c65f9b" metalness={.25} roughness={.35}/></mesh><mesh><boxGeometry args={[.3,.31,2.15]}/><meshStandardMaterial color="#f3bfdc" emissive="#e879b0" emissiveIntensity={1}/></mesh></group>{open&&<Sparkles count={220} scale={6} size={4} speed={1.8} color="#fff0f8"/>}</group>}

function Scene({scene,active,setActive,open,setOpen}){const cam=useRef();const mobile=window.innerWidth<700;const targets=[[0,0,mobile?9:8],[0,.1,mobile?9.5:8.5],[0,0,mobile?10:8.8],[0,.1,mobile?9.5:8.5],[0,0,mobile?10:8.8]];useFrame((s)=>{if(cam.current){const focus=scene===2?memories[active]?.p||[0,0,0]:[0,0,0];const t=targets[scene].slice();if(scene===2){t[0]+=focus[0]*.16;t[1]+=focus[1]*.08;t[2]-=.25}cam.current.position.lerp(new THREE.Vector3(...t),.035);cam.current.lookAt(0,0,0)}});return <><perspectiveCamera ref={cam} makeDefault position={[0,0,9]} fov={mobile?55:48}/><ambientLight intensity={.3}/><pointLight position={[0,4,4]} intensity={3} color="#ffd9ed"/><pointLight position={[-5,-2,2]} intensity={2} color="#9380ff"/><Stars radius={75} depth={45} count={mobile?650:1200} factor={2} fade speed={.25}/><StarField/><Environment preset="night"/>{scene===0&&<><Portal/><Heart scale={.065}/><Orb p={[-3,1.4,-1]} color="#f2a7cf" scale={1.2}/><Orb p={[3,.8,-1]} color="#a99af3"/></>}{scene===1&&<ChildhoodWorld/>}{scene===2&&<MemoryGalaxy active={active} setActive={setActive}/>} {scene===3&&<><Portal/><Heart scale={.09}/><Sparkles count={130} scale={8} size={3.5} speed={.7}/><Orb p={[-2.7,1.5,-1]} color="#f7b8d9"/><Orb p={[2.7,1.5,-1]} color="#b6a4ff"/><Orb p={[0,-1.8,-1]} color="#ffd5a8"/></>}{scene===4&&<Gift open={open} onOpen={()=>setOpen(true)}/>}</>}

function MemoryFrame({src,label,caption}){const[failed,setFailed]=useState(false);return <div className="memory-frame">{failed?<div className="frame-empty"><Camera size={28}/><b>Upload to GitHub</b><small>public/photos/{src.split("/").pop()}</small></div>:<img src={src} alt={label} onError={()=>setFailed(true)}/>}<div className="frame-caption"><span>{caption}</span><strong>{label}</strong></div></div>}

function Melody({on}){const c=useRef(),timer=useRef();useEffect(()=>{if(!on){if(timer.current)clearInterval(timer.current);return}const A=window.AudioContext||window.webkitAudioContext;if(!A)return;c.current=c.current||new A();const n=[261.63,329.63,392,329.63,293.66,349.23,440,392];let i=0;const play=()=>{const o=c.current.createOscillator(),g=c.current.createGain();o.type="sine";o.frequency.value=n[i++%n.length];g.gain.setValueAtTime(.001,c.current.currentTime);g.gain.exponentialRampToValueAtTime(.045,c.current.currentTime+.1);g.gain.exponentialRampToValueAtTime(.001,c.current.currentTime+1.5);o.connect(g).connect(c.current.destination);o.start();o.stop(c.current.currentTime+1.55)};play();timer.current=setInterval(play,1750);return()=>clearInterval(timer.current)},[on]);return null}

export default function App(){const[scene,setScene]=useState(0),[active,setActive]=useState(0),[open,setOpen]=useState(false),[started,setStarted]=useState(false),[music,setMusic]=useState(false);const touch=useRef(null);const next=()=>{setOpen(false);setScene(s=>Math.min(4,s+1))};const prev=()=>setScene(s=>Math.max(0,s-1));const restart=()=>{setStarted(false);setOpen(false);setActive(0);setScene(0)};const swipeStart=e=>touch.current=e.touches[0].clientX;const swipeEnd=e=>{if(touch.current==null||!started)return;const dx=e.changedTouches[0].clientX-touch.current;touch.current=null;if(Math.abs(dx)>60){dx<0?next():prev()}};return <main className="experience" onTouchStart={swipeStart} onTouchEnd={swipeEnd}><Melody on={music&&started}/><div className="canvas-wrap"><Canvas dpr={[1,1.5]} gl={{antialias:true,powerPreference:"high-performance"}}><Suspense fallback={null}><Scene scene={scene} active={active} setActive={setActive} open={open} setOpen={setOpen}/></Suspense></Canvas></div><div className="vignette"/><header><div className="logo"><i/>SSV <span>presents</span></div><button className="sound" onClick={()=>setMusic(v=>!v)}>{music?<Volume2 size={16}/>:<VolumeX size={16}/>}<span>{music?"Sound on":"Sound"}</span></button></header>{!started&&<section className="hero"><div className="date">01 · 10 · 2005 <span>✦</span> A private little universe</div><div className="hero-badge">FOR NANDINI</div><h1>Some people<br/><em>deserve a universe.</em></h1><p>So this one is being made just for you.</p><button className="begin" onClick={()=>setStarted(true)}><Play size={16} fill="currentColor"/> Enter the story <ChevronRight size={18}/></button><small>Turn your phone upright · headphones optional</small></section>}{started&&scene===0&&<section className="overlay left"><div className="chapter">01 / THE BEGINNING</div><h2>Before the name,<br/><em>there was a story.</em></h2><p>Every beautiful life begins as a tiny universe waiting to be discovered.</p></section>}{started&&scene===1&&<section className="overlay left"><div className="chapter">02 / THE EARLY YEARS</div><h2>A little girl.<br/><em>A thousand little worlds.</em></h2><p>An imagined tribute to childhood — the wonder, laughter and dreams that slowly become who we are.</p><MemoryFrame src="/sister-birthday-3d-surprise/photos/childhood.jpg" label="A childhood memory" caption="A little piece of the story"/></section>}{started&&scene===2&&<section className="overlay galaxy"><div className="chapter">03 / MEMORY GALAXY</div><h2>Touch a star.<br/><em>Find a memory.</em></h2><div className="memory-card"><span>0{active+1} · {memories[active].year}</span><h3>{memories[active].title}</h3><p>{memories[active].subtitle}</p><small>Tap another glowing star to travel to a different memory.</small></div><div className="galaxy-photo"><MemoryFrame src={`/sister-birthday-3d-surprise/photos/${["childhood","growing","always","today"][active]}.jpg`} label={memories[active].title} caption="A memory, slowly revealed"/></div></section>}{started&&scene===3&&<section className="overlay center"><div className="chapter">04 / GROWING UP</div><h2>And somehow,<br/><em>you became you.</em></h2><p>Keep the softness. Keep the dreams. Keep becoming more yourself.</p><MemoryFrame src="/sister-birthday-3d-surprise/photos/today.jpg" label="Nandini, today" caption="And then… you grew"/></section>}{started&&scene===4&&!open&&<section className="overlay center final-prompt"><div className="chapter">05 / THE SURPRISE</div><h2>There is one thing<br/><em>left to open.</em></h2><p>Tap the glowing gift in the center.</p><GiftIcon size={24}/></section>}{started&&scene===4&&open&&<section className="final"><div className="chapter">FOR NANDINI · 01 OCTOBER</div><div className="heart-icon"><HeartIcon fill="currentColor"/></div><h1>Happy Birthday,<br/><em>Nandini.</em></h1><div className="letter">{cfg.finalMessage.slice(1).map(x=><p key={x}>{x}</p>)}</div><button className="replay" onClick={restart}><RotateCcw size={15}/> Begin again</button></section>}{started&&scene<4&&<div className="nav"><button onClick={prev} disabled={scene===0}><ArrowLeft size={16}/></button><div><span>0{scene+1}</span><i/><span>05</span></div><button onClick={next}><span className="desktop-next">{scene===3?"The reveal":"Next"}</span><ArrowRight size={16}/></button></div>}{started&&<div className="progress"><span style={{width:(scene+1)*20+"%"}}/></div>}</main>}