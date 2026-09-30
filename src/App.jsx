import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { Music, Volume2, VolumeX, ChevronRight, Heart, Gift, Camera, RotateCcw, Sparkles as SparkleIcon } from "lucide-react";
import { birthdayConfig as cfg } from "./data/birthdayConfig";

const memories = [
  { title: "Tiny wonders", subtitle: "A little world full of big imagination", year: "Then", position: [-2.7, 1.1, -1.2] },
  { title: "Growing dreams", subtitle: "Learning, laughing, changing — one day at a time", year: "Along the way", position: [0.2, 2.15, -2] },
  { title: "The people who stayed", subtitle: "The quiet comfort of knowing you are loved", year: "Always", position: [2.75, 0.45, -1.4] },
  { title: "A light of your own", subtitle: "The person you are becoming", year: "Today", position: [0, -1.55, -2.6] }
];

function FloatingOrb({ position, scale=1, color="#f6c8ff" }) {
  return <Float speed={1.1} rotationIntensity={0.4} floatIntensity={0.8}>
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[0.11, 20, 20]}/>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} transparent opacity={0.9}/>
    </mesh>
  </Float>;
}

function Aurora({ scene }) {
  const ref=useRef();
  useFrame((state,delta)=>{
    if(ref.current){
      ref.current.rotation.z += delta*0.018;
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime*0.18)*0.12;
    }
  });
  return <group ref={ref}>
    {[0,1,2].map(i=><mesh key={i} position={[i*1.4-1.4,0,-5-i*.5]} rotation={[0.15,i*.65,0.2]}>
      <torusGeometry args={[3.8+i*.7,0.012,8,128]}/>
      <meshBasicMaterial color={i===1?"#f0a4d2":"#9f8be8"} transparent opacity={0.14}/>
    </mesh>)}
  </group>;
}

function ParticleUniverse({ scene, finale }) {
  const ref=useRef();
  const positions=useMemo(()=>{
    const a=[];
    const count=window.innerWidth<700?500:900;
    for(let i=0;i<count;i++){
      const r=4.5+Math.random()*12;
      const t=Math.random()*Math.PI*2;
      const p=Math.acos(2*Math.random()-1);
      a.push(Math.sin(p)*Math.cos(t)*r,Math.cos(p)*r,Math.sin(p)*Math.sin(t)*r);
    }
    return new Float32Array(a);
  },[]);
  useFrame((_,delta)=>{ if(ref.current) ref.current.rotation.y+=delta*(finale?0.06:0.025+scene*.008); });
  return <points ref={ref}>
    <bufferGeometry><bufferAttribute attach="attributes-position" count={positions.length/3} array={positions} itemSize={3}/></bufferGeometry>
    <pointsMaterial size={window.innerWidth<700?.025:.018} color="#f6ddff" transparent opacity={.7} sizeAttenuation/>
  </points>;
}

function HeartShape({scale=.08, glow=true}) {
  const ref=useRef();
  const curve=useMemo(()=>{
    const pts=[];
    for(let i=0;i<180;i++){
      const t=i/180*Math.PI*2;
      pts.push(new THREE.Vector3(
        .22*16*Math.pow(Math.sin(t),3),
        .22*(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t)),0
      ));
    }
    return new THREE.CatmullRomCurve3(pts,true);
  },[]);
  useFrame((state)=>{
    if(ref.current){
      ref.current.rotation.y=Math.sin(state.clock.elapsedTime*.55)*.18;
      ref.current.rotation.z=Math.sin(state.clock.elapsedTime*.4)*.035;
    }
  });
  return <group ref={ref} scale={scale}>
    <mesh>
      <tubeGeometry args={[curve,180,.42,10,true]}/>
      <meshStandardMaterial color="#ffacd8" emissive={glow?"#e45b9d":"#a94c83"} emissiveIntensity={glow?2.6:1.3} transparent opacity={.95}/>
    </mesh>
  </group>;
}

function Constellation({active,onSelect}) {
  const group=useRef();
  useFrame((_,delta)=>{if(group.current) group.current.rotation.y+=delta*.045;});
  return <group ref={group}>
    {memories.map((m,i)=><Float key={m.title} speed={1+i*.13} floatIntensity={.4} rotationIntensity={.25}>
      <group position={m.position}>
        <mesh onClick={(e)=>{e.stopPropagation();onSelect(i);}}>
          <sphereGeometry args={[active===i?.25:.14,24,24]}/>
          <meshStandardMaterial color={active===i?"#fff1fb":"#d9b8ff"} emissive={active===i?"#ff77c7":"#a86de0"} emissiveIntensity={active===i?5:2.2}/>
        </mesh>
        <pointLight intensity={active===i?1.7:.35} distance={2.5} color="#eaa9dc"/>
      </group>
    </Float>)}
    {memories.slice(0,-1).map((m,i)=>{
      const a=new THREE.Vector3(...m.position),b=new THREE.Vector3(...memories[i+1].position);
      const mid=a.clone().add(b).multiplyScalar(.5),len=a.distanceTo(b);
      const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize());
      return <mesh key={"line"+i} position={mid} quaternion={q}><cylinderGeometry args={[.012,.012,len,8]}/><meshBasicMaterial color="#e2a4d2" transparent opacity={.34}/></mesh>;
    })}
    <HeartShape scale={.06}/>
  </group>;
}

function ChildhoodRoom() {
  const group=useRef();
  useFrame((state)=>{if(group.current) group.current.rotation.y=Math.sin(state.clock.elapsedTime*.25)*.08;});
  return <group ref={group}>
    <mesh position={[0,-1.65,-2.5]} rotation={[-Math.PI/2,0,0]}>
      <circleGeometry args={[4.4,64]}/><meshStandardMaterial color="#291735" roughness={.9}/>
    </mesh>
    <Float speed={.7} rotationIntensity={.15} floatIntensity={.35}>
      <mesh position={[-2.4,-.55,-1]}><boxGeometry args={[1.35,1.1,1.1]}/><meshStandardMaterial color="#805174" roughness={.75}/></mesh>
      <mesh position={[-2.4,.1,-1]}><sphereGeometry args={[.5,20,20]}/><meshStandardMaterial color="#f0b8d5" roughness={.65}/></mesh>
    </Float>
    <Float speed={1} rotationIntensity={.25} floatIntensity={.6}>
      <mesh position={[2.15,.25,-1.2]} rotation={[.2,.4,0]}><boxGeometry args={[1.35,1.7,.14]}/><meshStandardMaterial color="#5c426f" emissive="#26162f" emissiveIntensity={.5}/></mesh>
    </Float>
    <Float speed={1.2} floatIntensity={.8}><mesh position={[1.15,-.75,-1.6]} rotation={[0,.2,.15]}><boxGeometry args={[.9,.22,.9]}/><meshStandardMaterial color="#d59ac2"/></mesh></Float>
    <FloatingOrb position={[-1.1,1.7,-2]} color="#ffd1e9" scale={1.1}/>
    <FloatingOrb position={[1.8,1.75,-2.2]} color="#cbb2ff" scale={.8}/>
    <Sparkles count={45} scale={6} size={2.5} speed={.45} color="#ffd8ed"/>
  </group>;
}

function GiftBox({open,onOpen}) {
  const lid=useRef();
  useEffect(()=>{
    if(!lid.current)return;
    gsap.to(lid.current.rotation,{x:open?-0.9:0,z:open?-0.16:0,duration:1.25,ease:"back.out(1.5)"});
    gsap.to(lid.current.position,{y:open?1.35:.8,duration:1.25,ease:"power3.out"});
  },[open]);
  return <group onClick={(e)=>{e.stopPropagation();onOpen();}}>
    <pointLight position={[0,.4,1]} intensity={open?7:1.4} distance={8} color="#ffd4ed"/>
    <mesh position={[0,-.65,0]} castShadow><boxGeometry args={[2.5,1.65,2]}/><meshStandardMaterial color="#9b527e" metalness={.18} roughness={.48}/></mesh>
    <mesh position={[0,-.65,1.02]}><boxGeometry args={[.34,1.67,.03]}/><meshStandardMaterial color="#f5c3df" emissive="#f5a7d5" emissiveIntensity={.7}/></mesh>
    <mesh position={[0,-.65,-1.02]}><boxGeometry args={[.34,1.67,.03]}/><meshStandardMaterial color="#f5c3df" emissive="#f5a7d5" emissiveIntensity={.7}/></mesh>
    <group ref={lid} position={[0,.8,0]}>
      <mesh><boxGeometry args={[2.75,.28,2.22]}/><meshStandardMaterial color="#c66ca0" metalness={.15} roughness={.45}/></mesh>
      <mesh position={[0,.02,0]}><boxGeometry args={[.34,.3,2.25]}/><meshStandardMaterial color="#f5c3df" emissive="#f5a7d5" emissiveIntensity={.8}/></mesh>
    </group>
    {open&&<Sparkles count={120} scale={5} size={4} speed={1.5} color="#ffe2f1"/>}
  </group>;
}

function Scene({scene,selectedMemory,setSelectedMemory,giftOpen,setGiftOpen}) {
  const camera=useRef();
  const isMobile=typeof window!=="undefined"&&window.innerWidth<700;
  const target=scene===0?[0,0,isMobile?7.8:6.5]:scene===1?[0,.15,isMobile?8.6:7]:scene===2?[0,0,isMobile?9.2:8]:scene===3?[0,.2,isMobile?8.5:7]:[0,0,isMobile?9.5:8];
  useFrame(()=>{
    if(camera.current){
      camera.current.position.lerp(new THREE.Vector3(...target),.035);
      camera.current.lookAt(0,0,0);
    }
  });
  return <>
    <perspectiveCamera ref={camera} makeDefault position={[0,0,9]} fov={isMobile?58:48}/>
    <ambientLight intensity={.34}/>
    <pointLight position={[0,3,4]} intensity={2.6} color="#ffd7f0"/>
    <pointLight position={[-4,-2,3]} intensity={1.8} color="#9b7bff"/>
    <pointLight position={[4,1,-2]} intensity={1.1} color="#e88fbe"/>
    <Stars radius={80} depth={45} count={isMobile?700:1300} factor={isMobile?1.7:2.1} saturation={0} fade speed={.3}/>
    <ParticleUniverse scene={scene} finale={scene===4}/>
    <Aurora scene={scene}/>
    <Sparkles count={scene===4?220:isMobile?70:110} scale={12} size={scene===4?3.5:2} speed={.3} color="#ffd8ed"/>
    {scene===0&&<><HeartShape scale={.08}/><FloatingOrb position={[-2.4,1.5,-1]} scale={1.5}/><FloatingOrb position={[2.3,.7,-1]} scale={1.2} color="#bba7ff"/></>}
    {scene===1&&<ChildhoodRoom/>}
    {scene===2&&<Constellation active={selectedMemory} onSelect={setSelectedMemory}/>}
    {scene===3&&<><HeartShape scale={.075}/><FloatingOrb position={[-2.4,1.3,-2]} color="#f8bddb"/><FloatingOrb position={[2.5,1.6,-2]} color="#c5b1ff"/><FloatingOrb position={[0,-1.8,-1]} color="#ffd7aa"/></>}
    {scene===4&&<GiftBox open={giftOpen} onOpen={()=>setGiftOpen(true)}/>}
  </>;
}

function PhotoSlot({slot}) {
  const [src,setSrc]=useState(null);
  return <label className="photo-slot">
    {src?<img src={src} alt={slot.label}/>:<div className="photo-empty"><Camera size={19}/><span>{slot.label}</span><small>{slot.hint}</small></div>}
    <input type="file" accept="image/*" onChange={(e)=>{const f=e.target.files?.[0];if(f)setSrc(URL.createObjectURL(f));}}/>
  </label>;
}

function Melody({enabled}) {
  const ctx=useRef(null),timer=useRef(null);
  useEffect(()=>{
    if(!enabled){if(timer.current)clearInterval(timer.current);return;}
    const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return;
    ctx.current=ctx.current||new AudioContext();
    const notes=[261.63,329.63,392,329.63,293.66,349.23,440,392];let i=0;
    const play=()=>{
      const c=ctx.current;if(!c)return;
      if(c.state==="suspended")c.resume();
      const osc=c.createOscillator(),gain=c.createGain();osc.type="sine";osc.frequency.value=notes[i++%notes.length];
      gain.gain.setValueAtTime(0,c.currentTime);gain.gain.linearRampToValueAtTime(.045,c.currentTime+.12);gain.gain.exponentialRampToValueAtTime(.001,c.currentTime+1.5);
      osc.connect(gain).connect(c.destination);osc.start();osc.stop(c.currentTime+1.55);
    };
    play();timer.current=setInterval(play,1750);return()=>clearInterval(timer.current);
  },[enabled]);
  return null;
}

function App() {
  const [scene,setScene]=useState(0),[selectedMemory,setSelectedMemory]=useState(0),[giftOpen,setGiftOpen]=useState(false),[music,setMusic]=useState(false),[started,setStarted]=useState(false);
  const touchStart=useRef(null);
  const chapter=cfg.chapters[Math.min(scene-1,cfg.chapters.length-1)];
  const next=()=>{setGiftOpen(false);setScene(s=>Math.min(4,s+1));};
  const replay=()=>{setGiftOpen(false);setSelectedMemory(0);setScene(0);setStarted(false);};
  const onTouchStart=e=>{touchStart.current=e.touches[0].clientX;};
  const onTouchEnd=e=>{
    if(touchStart.current===null)return;
    const dx=e.changedTouches[0].clientX-touchStart.current;touchStart.current=null;
    if(Math.abs(dx)>70&&started&&!giftOpen){if(dx<0)next();else if(scene>0)setScene(s=>s-1);}
  };
  return <main className="experience" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
    <Melody enabled={music&&started}/>
    <div className="canvas-wrap"><Canvas dpr={[1,1.5]} gl={{antialias:true,powerPreference:"high-performance"}} camera={{fov:50,position:[0,0,9]}}>
      <Suspense fallback={null}><Scene scene={scene} selectedMemory={selectedMemory} setSelectedMemory={setSelectedMemory} giftOpen={giftOpen} setGiftOpen={setGiftOpen}/></Suspense>
    </Canvas></div>
    <div className="vignette"/><div className="grain"/>

    <header className="topbar">
      <div className="brand"><span className="brand-dot"/><span>A little journey</span></div>
      <button className="icon-button" onClick={()=>setMusic(v=>!v)} aria-label="Toggle music">
        {music?<Volume2 size={17}/>:<VolumeX size={17}/>}<span>{music?"Melody on":"Melody off"}</span>
      </button>
    </header>

    {!started&&<section className="intro-screen">
      <div className="intro-orbit"><div/><div/><div/></div>
      <p className="eyebrow">01 · 10 · 2005 <span>✦</span> A birthday story</p>
      <h1>For someone who<br/><em>grew into a beautiful story.</em></h1>
      <p className="intro-copy">A little universe of memories, dreams and love — created for one very special person.</p>
      <button className="primary-button" onClick={()=>setStarted(true)}><SparkleIcon size={17}/> Begin the journey <ChevronRight size={18}/></button>
      <span className="tiny-note">Best experienced with headphones · swipe to explore on mobile</span>
    </section>}

    {started&&scene>0&&scene<4&&<section className="chapter-copy">
      <p className="eyebrow">{chapter.eyebrow}</p><h2>{chapter.title}</h2><p>{chapter.text}</p><span className="chapter-note">{chapter.note}</span>
      {scene===1&&<div className="photo-row"><PhotoSlot slot={cfg.photoSlots[0]}/><PhotoSlot slot={cfg.photoSlots[1]}/></div>}
      {scene===3&&<div className="photo-row"><PhotoSlot slot={cfg.photoSlots[2]}/></div>}
    </section>}

    {started&&scene===0&&<section className="scene-caption"><p className="eyebrow">Chapter I · The beginning</p><h2>Before the name was revealed…</h2><p>Some stories deserve to unfold slowly.</p></section>}

    {started&&scene===2&&<section className="memory-panel">
      <p className="eyebrow">Memory constellation</p><div className="memory-number">0{selectedMemory+1}</div><h3>{memories[selectedMemory].title}</h3><p>{memories[selectedMemory].subtitle}</p><span>{memories[selectedMemory].year}</span>
      <div className="memory-dots">{memories.map((_,i)=><button key={i} className={i===selectedMemory?"active":""} onClick={()=>setSelectedMemory(i)} aria-label={"Memory "+(i+1)}/>)}</div>
    </section>}

    {started&&scene===4&&!giftOpen&&<section className="final-prompt"><div className="final-ring"/><p className="eyebrow">One last thing…</p><h2>A little surprise<br/>is waiting.</h2><p>Tap the glowing gift.</p><Gift size={22}/></section>}

    {started&&scene===4&&giftOpen&&<section className="final-message">
      <div className="final-heart"><Heart fill="currentColor" size={22}/></div><p className="eyebrow">And now the name can finally be said.</p><h1>Happy Birthday,<br/><em>Nandini.</em></h1>
      <div className="message-lines">{cfg.finalMessage.slice(1).map(line=><p key={line}>{line}</p>)}</div>
      <button className="replay-button" onClick={replay}><RotateCcw size={15}/> Replay the journey</button>
    </section>}

    {started&&scene<4&&<button className="next-button" onClick={next}>{scene===3?"Open the final chapter":"Continue"}<ChevronRight size={18}/></button>}
    {started&&<div className="swipe-hint">{scene<4&&!giftOpen?"Swipe or tap Continue":" "}</div>}
    {started&&<div className="progress"><span style={{width:((scene+1)/5)*100+"%"}}/></div>}
  </main>;
}

export default App;
