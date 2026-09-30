import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { Music, Volume2, VolumeX, ChevronRight, Heart, Gift, Camera, RotateCcw } from "lucide-react";
import { birthdayConfig as cfg } from "./data/birthdayConfig";

const memories = [
  { title: "Tiny wonders", subtitle: "A little world full of big imagination", year: "Then", position: [-2.8, 1.2, -1] },
  { title: "Growing dreams", subtitle: "Learning, laughing, changing — one day at a time", year: "Along the way", position: [0.1, 2.1, -2] },
  { title: "The people who stayed", subtitle: "The quiet comfort of knowing you are loved", year: "Always", position: [2.9, 0.6, -1.5] },
  { title: "A light of your own", subtitle: "The person you are becoming", year: "Today", position: [0, -1.5, -2.5] }
];

function FloatingOrb({ position, scale = 1, color = "#f6c8ff" }) {
  return (
    <Float speed={1.2} rotationIntensity={0.35} floatIntensity={1}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.4} transparent opacity={0.8} />
      </mesh>
    </Float>
  );
}

function ParticleUniverse({ scene }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * (0.025 + scene * 0.008);
  });
  const positions = useMemo(() => {
    const a = [];
    for (let i = 0; i < 900; i++) {
      const r = 5 + Math.random() * 11;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      a.push(Math.sin(p) * Math.cos(t) * r, Math.cos(p) * r, Math.sin(p) * Math.sin(t) * r);
    }
    return new Float32Array(a);
  }, []);
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} /></bufferGeometry>
      <pointsMaterial size={0.018} color="#f6ddff" transparent opacity={0.72} sizeAttenuation />
    </points>
  );
}

function Constellation({ active, onSelect }) {
  const group = useRef();
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.055;
  });
  return (
    <group ref={group}>
      {memories.map((m, i) => (
        <group key={m.title}>
          <Float speed={1 + i * 0.15} floatIntensity={0.35} rotationIntensity={0.2}>
            <mesh position={m.position} onClick={(e) => { e.stopPropagation(); onSelect(i); }}>
              <sphereGeometry args={[active === i ? 0.24 : 0.15, 24, 24]} />
              <meshStandardMaterial
                color={active === i ? "#fff1fb" : "#d9b8ff"}
                emissive={active === i ? "#ff9bd7" : "#a86de0"}
                emissiveIntensity={active === i ? 4 : 2}
              />
            </mesh>
          </Float>
        </group>
      ))}
      {memories.slice(0, -1).map((m, i) => {
        const next = memories[i + 1];
        const a = new THREE.Vector3(...m.position);
        const b = new THREE.Vector3(...next.position);
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const len = a.distanceTo(b);
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
        return (
          <mesh key={"line" + i} position={mid} quaternion={q}>
            <cylinderGeometry args={[0.012, 0.012, len, 8]} />
            <meshBasicMaterial color="#b88ad7" transparent opacity={0.32} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.1, -3]}>
        <torusGeometry args={[2.5, 0.018, 8, 96]} />
        <meshBasicMaterial color="#c98ce8" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

function ChildhoodRoom() {
  return (
    <group>
      <Float speed={0.7} rotationIntensity={0.12} floatIntensity={0.3}>
        <mesh position={[-2.5, -0.8, -1]}>
          <boxGeometry args={[1.4, 1.2, 1.1]} />
          <meshStandardMaterial color="#8b587d" roughness={0.8} />
        </mesh>
        <mesh position={[-2.5, -0.08, -1]}>
          <sphereGeometry args={[0.52, 20, 20]} />
          <meshStandardMaterial color="#f0b8d5" roughness={0.65} />
        </mesh>
      </Float>
      <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.7}>
        <mesh position={[2.3, 0.3, -1.4]} rotation={[0.2, 0.4, 0]}>
          <boxGeometry args={[1.4, 1.7, 0.12]} />
          <meshStandardMaterial color="#5c426f" emissive="#26162f" emissiveIntensity={0.4} />
        </mesh>
      </Float>
      <FloatingOrb position={[-1, 1.7, -2]} color="#ffd1e9" scale={1.1} />
      <FloatingOrb position={[1.8, 1.8, -2.2]} color="#cbb2ff" scale={0.8} />
    </group>
  );
}

function GiftBox({ open, onOpen }) {
  const lid = useRef();
  useEffect(() => {
    if (!lid.current) return;
    gsap.to(lid.current.rotation, { x: open ? -0.75 : 0, z: open ? -0.15 : 0, duration: 1.2, ease: "back.out(1.5)" });
    gsap.to(lid.current.position, { y: open ? 1.15 : 0.8, duration: 1.2, ease: "power3.out" });
  }, [open]);
  return (
    <group onClick={(e) => { e.stopPropagation(); onOpen(); }}>
      <mesh position={[0, -0.65, 0]} castShadow>
        <boxGeometry args={[2.5, 1.65, 2]} />
        <meshStandardMaterial color="#9b527e" metalness={0.15} roughness={0.55} />
      </mesh>
      <mesh position={[0, -0.65, 1.02]}>
        <boxGeometry args={[0.34, 1.67, 0.03]} />
        <meshStandardMaterial color="#f5c3df" emissive="#f5a7d5" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, -0.65, -1.02]}>
        <boxGeometry args={[0.34, 1.67, 0.03]} />
        <meshStandardMaterial color="#f5c3df" emissive="#f5a7d5" emissiveIntensity={0.5} />
      </mesh>
      <group ref={lid} position={[0, 0.8, 0]}>
        <mesh>
          <boxGeometry args={[2.75, 0.28, 2.22]} />
          <meshStandardMaterial color="#c66ca0" metalness={0.15} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.34, 0.3, 2.25]} />
          <meshStandardMaterial color="#f5c3df" emissive="#f5a7d5" emissiveIntensity={0.6} />
        </mesh>
      </group>
      {open && (
        <pointLight position={[0, 0.3, 0]} intensity={5} distance={7} color="#ffd7ee" />
      )}
    </group>
  );
}

function HeartShape({ final }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.18;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.035;
    }
  });
  const curve = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 180; i++) {
      const t = (i / 180) * Math.PI * 2;
      pts.push(new THREE.Vector3(
        0.22 * 16 * Math.pow(Math.sin(t), 3),
        0.22 * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)),
        0
      ));
    }
    return new THREE.CatmullRomCurve3(pts, true);
  }, []);
  return (
    <group ref={ref} scale={final ? 0.11 : 0.08}>
      <mesh>
        <tubeGeometry args={[curve, 180, 0.45, 10, true]} />
        <meshStandardMaterial color="#ffacd8" emissive="#e45b9d" emissiveIntensity={2.3} transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

function Scene({ scene, selectedMemory, setSelectedMemory, giftOpen, setGiftOpen }) {
  const target = scene === 0 ? [0, 0, 6.5] : scene === 1 ? [0, 0.2, 7] : scene === 2 ? [0, 0, 8] : scene === 3 ? [0, 0.2, 7] : [0, 0, 8];
  const camera = useRef();
  useFrame((state) => {
    camera.current?.position.lerp(new THREE.Vector3(...target), 0.035);
    camera.current?.lookAt(0, 0, 0);
  });
  return (
    <>
      <perspectiveCamera ref={camera} makeDefault position={[0, 0, 9]} fov={48} />
      <ambientLight intensity={0.32} />
      <pointLight position={[0, 3, 4]} intensity={2.5} color="#ffd7f0" />
      <pointLight position={[-4, -2, 3]} intensity={1.6} color="#9b7bff" />
      <Stars radius={80} depth={40} count={1200} factor={2} saturation={0} fade speed={0.35} />
      <ParticleUniverse scene={scene} />
      <Sparkles count={scene === 4 ? 180 : 90} scale={12} size={scene === 4 ? 3 : 2} speed={0.25} color="#ffd8ed" />
      {scene === 0 && <>
        <HeartShape final={false} />
        <FloatingOrb position={[-2.4, 1.5, -1]} scale={1.5} />
        <FloatingOrb position={[2.3, 0.7, -1]} scale={1.2} color="#bba7ff" />
      </>}
      {scene === 1 && <ChildhoodRoom />}
      {scene === 2 && <Constellation active={selectedMemory} onSelect={setSelectedMemory} />}
      {scene === 3 && <>
        <HeartShape final={false} />
        <FloatingOrb position={[-2.4, 1.3, -2]} color="#f8bddb" />
        <FloatingOrb position={[2.5, 1.6, -2]} color="#c5b1ff" />
        <FloatingOrb position={[0, -1.8, -1]} color="#ffd7aa" />
      </>}
      {scene === 4 && <GiftBox open={giftOpen} onOpen={() => setGiftOpen(true)} />}
    </>
  );
}

function PhotoSlot({ slot }) {
  const [src, setSrc] = useState(null);
  return (
    <label className="photo-slot">
      {src ? <img src={src} alt={slot.label} /> : <div className="photo-empty"><Camera size={20}/><span>{slot.label}</span><small>{slot.hint}</small></div>}
      <input type="file" accept="image/*" onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) setSrc(URL.createObjectURL(file));
      }} />
    </label>
  );
}

function Melody({ enabled }) {
  const ctx = useRef(null);
  const timer = useRef(null);
  useEffect(() => {
    if (!enabled) {
      if (timer.current) clearInterval(timer.current);
      return;
    }
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    ctx.current = ctx.current || new AudioContext();
    const notes = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 392];
    let i = 0;
    const play = () => {
      const c = ctx.current;
      if (!c) return;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = "sine";
      osc.frequency.value = notes[i++ % notes.length];
      gain.gain.setValueAtTime(0, c.currentTime);
      gain.gain.linearRampToValueAtTime(0.045, c.currentTime + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.5);
      osc.connect(gain).connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + 1.55);
    };
    play();
    timer.current = setInterval(play, 1750);
    return () => clearInterval(timer.current);
  }, [enabled]);
  return null;
}

function App() {
  const [scene, setScene] = useState(0);
  const [selectedMemory, setSelectedMemory] = useState(0);
  const [giftOpen, setGiftOpen] = useState(false);
  const [music, setMusic] = useState(false);
  const [started, setStarted] = useState(false);

  const chapter = cfg.chapters[Math.min(scene - 1, cfg.chapters.length - 1)];

  const next = () => {
    setGiftOpen(false);
    setScene((s) => Math.min(4, s + 1));
  };
  const replay = () => {
    setGiftOpen(false); setSelectedMemory(0); setScene(0); setStarted(false);
  };

  return (
    <main className="experience">
      <Melody enabled={music && started} />
      <div className="canvas-wrap">
        <Canvas dpr={[1, 1.7]} gl={{ antialias: true, powerPreference: "high-performance" }}>
          <Suspense fallback={null}>
            <Scene scene={scene} selectedMemory={selectedMemory} setSelectedMemory={setSelectedMemory} giftOpen={giftOpen} setGiftOpen={setGiftOpen} />
          </Suspense>
        </Canvas>
      </div>

      <div className="vignette" />
      <header className="topbar">
        <div className="brand"><span className="brand-dot" /> a little journey</div>
        <button className="icon-button" onClick={() => setMusic(v => !v)} aria-label="Toggle music">
          {music ? <Volume2 size={18}/> : <VolumeX size={18}/>} <span>{music ? "Melody on" : "Melody off"}</span>
        </button>
      </header>

      {!started && (
        <section className="intro-screen">
          <div className="intro-glow" />
          <p className="eyebrow">A birthday story, made with love</p>
          <h1>For someone who<br/><em>grew into a beautiful story.</em></h1>
          <p className="intro-copy">There are moments we remember, moments we imagine, and moments still waiting to happen. This little journey holds all three.</p>
          <button className="primary-button" onClick={() => setStarted(true)}>Begin the journey <ChevronRight size={19}/></button>
          <span className="tiny-note">Headphones recommended · sound is optional</span>
        </section>
      )}

      {started && scene > 0 && scene < 4 && (
        <section className="chapter-copy">
          <p className="eyebrow">{chapter.eyebrow}</p>
          <h2>{chapter.title}</h2>
          <p>{chapter.text}</p>
          <span className="chapter-note">{chapter.note}</span>
          {scene === 1 && <div className="photo-row"><PhotoSlot slot={cfg.photoSlots[0]} /><PhotoSlot slot={cfg.photoSlots[1]} /></div>}
          {scene === 3 && <div className="photo-row"><PhotoSlot slot={cfg.photoSlots[2]} /></div>}
        </section>
      )}

      {started && scene === 0 && (
        <section className="scene-caption">
          <p className="eyebrow">Chapter I · The beginning</p>
          <h2>Before the name was revealed…</h2>
          <p>Some stories deserve to unfold slowly.</p>
        </section>
      )}

      {started && scene === 2 && (
        <section className="memory-panel">
          <p className="eyebrow">Memory constellation</p>
          <h3>{memories[selectedMemory].title}</h3>
          <p>{memories[selectedMemory].subtitle}</p>
          <span>{memories[selectedMemory].year}</span>
        </section>
      )}

      {started && scene === 4 && !giftOpen && (
        <section className="final-prompt">
          <p className="eyebrow">One last thing…</p>
          <h2>A little surprise is waiting.</h2>
          <p>Tap the gift in the center.</p>
          <Gift size={22}/>
        </section>
      )}

      {started && scene === 4 && giftOpen && (
        <section className="final-message">
          <div className="final-heart"><Heart fill="currentColor" size={24}/></div>
          <p className="eyebrow">And now the name can finally be said.</p>
          <h1>Happy Birthday,<br/><em>Nandini.</em></h1>
          <div className="message-lines">
            {cfg.finalMessage.slice(1).map((line) => <p key={line}>{line}</p>)}
          </div>
          <button className="replay-button" onClick={replay}><RotateCcw size={16}/> Replay the journey</button>
        </section>
      )}

      {started && scene < 4 && (
        <button className="next-button" onClick={next}>
          {scene === 3 ? "Open the final chapter" : "Continue"} <ChevronRight size={18}/>
        </button>
      )}

      {started && <div className="progress"><span style={{ width: ((scene + 1) / 5) * 100 + "%" }} /></div>}
    </main>
  );
}

export default App;