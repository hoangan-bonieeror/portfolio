import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, Html, Line, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/**
 * The hero's 3D scene: a tiny "system" of a client, an API server,
 * a PostgreSQL database and a factory robot, with data packets
 * travelling between them. It follows the cursor gently.
 *
 * Loaded lazily (see Hero.tsx) so text renders before the 3D engine.
 */

export interface ScenePalette {
  accent: string;
  mint: string;
  amber: string;
  surface: string;
  surface2: string;
  ink: string;
  muted: string;
  dark: boolean;
}

interface Props {
  palette: ScenePalette;
  animate: boolean;
  active: boolean;
}

/* Positions of the four nodes. */
const API = new THREE.Vector3(0, 0.55, 0);
const DB = new THREE.Vector3(-2.5, 0.2, 1.3);
const ROBOT = new THREE.Vector3(2.5, 0.1, 1.2);
const CLIENT = new THREE.Vector3(-1.6, 2.2, -1.9);

function curveBetween(a: THREE.Vector3, b: THREE.Vector3, lift = 1.1) {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  mid.y += lift;
  return new THREE.QuadraticBezierCurve3(a.clone(), mid, b.clone());
}

/* ------------------------------------------------------------------ */

function Label({ text, color, y = 0 }: { text: string; color: string; y?: number }) {
  return (
    <Html position={[0, y, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
      <div
        className="whitespace-nowrap rounded-full border border-line bg-surface/90 px-2.5 py-1 font-mono text-[11px] font-medium text-ink shadow-soft backdrop-blur"
        style={{ borderColor: color }}
      >
        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ background: color }} />
        {text}
      </div>
    </Html>
  );
}

function ApiServer({ p }: { p: ScenePalette }) {
  const leds = useRef<THREE.Mesh[]>([]);
  useFrame(({ clock }) => {
    leds.current.forEach((m, i) => {
      if (!m) return;
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.2 + Math.sin(clock.elapsedTime * 3 + i * 1.7) * 0.9;
    });
  });
  return (
    <group position={API}>
      {[0, 1, 2].map((i) => (
        <group key={i} position={[0, i * 0.44 - 0.44, 0]}>
          <RoundedBox args={[1.8, 0.36, 1.3]} radius={0.08} smoothness={4}>
            <meshStandardMaterial color={p.accent} roughness={0.35} metalness={0.1} />
          </RoundedBox>
          {/* front panel */}
          <mesh position={[0, 0, 0.655]}>
            <planeGeometry args={[1.6, 0.22]} />
            <meshStandardMaterial color={p.dark ? "#1b1a3d" : "#3a31c4"} roughness={0.6} />
          </mesh>
          {[0, 1, 2].map((j) => (
            <mesh
              key={j}
              ref={(m) => {
                if (m) leds.current[i * 3 + j] = m;
              }}
              position={[-0.62 + j * 0.16, 0, 0.66]}
            >
              <circleGeometry args={[0.035, 16]} />
              <meshStandardMaterial color={p.mint} emissive={p.mint} emissiveIntensity={1.5} />
            </mesh>
          ))}
          <mesh position={[0.45, 0, 0.66]}>
            <planeGeometry args={[0.55, 0.05]} />
            <meshStandardMaterial color={p.dark ? "#4b45a8" : "#8d86f7"} />
          </mesh>
        </group>
      ))}
      <Label text="api · flask" color={p.accent} y={0.95} />
    </group>
  );
}

function Database({ p }: { p: ScenePalette }) {
  return (
    <group position={DB}>
      {[0, 1, 2].map((i) => (
        <group key={i} position={[0, i * 0.34 - 0.2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.62, 0.62, 0.28, 48]} />
            <meshStandardMaterial color={p.mint} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.141, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.4, 0.46, 48]} />
            <meshStandardMaterial color={p.dark ? "#1f8f74" : "#0b7a60"} />
          </mesh>
        </group>
      ))}
      <Label text="postgres" color={p.mint} y={0.95} />
    </group>
  );
}

function Robot({ p, animate }: { p: ScenePalette; animate: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const lidar = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!animate) return;
    const t = clock.elapsedTime;
    if (ref.current) {
      ref.current.position.x = ROBOT.x + Math.sin(t * 0.6) * 0.35;
      ref.current.position.z = ROBOT.z + Math.cos(t * 0.6) * 0.2;
      ref.current.rotation.y = -0.5 + Math.cos(t * 0.6) * 0.3;
    }
    if (lidar.current) lidar.current.rotation.y = t * 4;
  });
  const wheel = p.dark ? "#2a2f47" : "#3b3f52";
  return (
    <group ref={ref} position={ROBOT} rotation={[0, -0.5, 0]}>
      <RoundedBox args={[1.1, 0.42, 0.8]} radius={0.12} smoothness={4} position={[0, 0.12, 0]}>
        <meshStandardMaterial color={p.amber} roughness={0.35} />
      </RoundedBox>
      {/* bumper stripe */}
      <mesh position={[0, 0.05, 0.405]}>
        <planeGeometry args={[0.9, 0.06]} />
        <meshStandardMaterial color={wheel} />
      </mesh>
      {[
        [-0.38, -0.12, 0.42],
        [0.38, -0.12, 0.42],
        [-0.38, -0.12, -0.42],
        [0.38, -0.12, -0.42],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.1, 24]} />
          <meshStandardMaterial color={wheel} roughness={0.8} />
        </mesh>
      ))}
      {/* lidar */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.14, 24]} />
        <meshStandardMaterial color={wheel} />
      </mesh>
      <mesh ref={lidar} position={[0, 0.52, 0]}>
        <boxGeometry args={[0.26, 0.05, 0.05]} />
        <meshStandardMaterial color={p.mint} emissive={p.mint} emissiveIntensity={1.2} />
      </mesh>
      <Label text="robot · ros2" color={p.amber} y={1.0} />
    </group>
  );
}

function ClientWindow({ p }: { p: ScenePalette }) {
  return (
    <group position={CLIENT} rotation={[0, 0.45, 0]}>
      <RoundedBox args={[1.9, 1.2, 0.08]} radius={0.06} smoothness={4}>
        <meshStandardMaterial color={p.surface} roughness={0.5} />
      </RoundedBox>
      {/* top bar */}
      <mesh position={[0, 0.48, 0.045]}>
        <planeGeometry args={[1.8, 0.14]} />
        <meshStandardMaterial color={p.surface2} />
      </mesh>
      {[p.accent, p.amber, p.mint].map((c, i) => (
        <mesh key={i} position={[-0.8 + i * 0.1, 0.48, 0.05]}>
          <circleGeometry args={[0.03, 16]} />
          <meshStandardMaterial color={c} />
        </mesh>
      ))}
      {/* chart bars */}
      {[0.35, 0.6, 0.45, 0.8, 0.55, 0.7].map((h, i) => (
        <mesh key={i} position={[-0.6 + i * 0.24, -0.45 + h / 2, 0.05]}>
          <planeGeometry args={[0.14, h]} />
          <meshStandardMaterial color={i % 2 ? p.accent : p.mint} />
        </mesh>
      ))}
      <Label text="dashboard" color={p.muted} y={0.85} />
    </group>
  );
}

function Packets({ curve, color, count = 2, speed = 0.22, animate }: { curve: THREE.Curve<THREE.Vector3>; color: string; count?: number; speed?: number; animate: boolean }) {
  const refs = useRef<THREE.Mesh[]>([]);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ clock }) => {
    refs.current.forEach((m, i) => {
      if (!m) return;
      const t = animate ? (clock.elapsedTime * speed + i / count) % 1 : (i + 0.5) / count;
      curve.getPoint(t, tmp);
      m.position.copy(tmp);
      const s = 0.7 + Math.sin(t * Math.PI) * 0.6;
      m.scale.setScalar(s);
    });
  });
  const points = useMemo(() => curve.getPoints(48), [curve]);
  return (
    <group>
      <Line points={points} color={color} lineWidth={1.5} dashed dashSize={0.12} gapSize={0.1} transparent opacity={0.55} />
      {Array.from({ length: count }).map((_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            if (m) refs.current[i] = m;
          }}
        >
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Rig({ children, animate }: { children: ReactNode; animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const idle = animate ? Math.sin(clock.elapsedTime * 0.25) * 0.12 : 0;
    const targetY = -0.35 + idle + (animate ? pointer.current.x * 0.25 : 0);
    const targetX = animate ? pointer.current.y * 0.06 : 0;
    const k = 1 - Math.pow(0.001, delta);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, k);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, k);
  });

  return (
    <group ref={group} rotation={[0, -0.35, 0]}>
      {children}
    </group>
  );
}

export default function HeroScene({ palette: p, animate, active }: Props) {
  const curves = useMemo(
    () => ({
      clientApi: curveBetween(CLIENT.clone().add(new THREE.Vector3(0.3, -0.6, 0.2)), API.clone().add(new THREE.Vector3(0, 0.5, 0)), 0.4),
      apiDb: curveBetween(API.clone().add(new THREE.Vector3(-0.8, 0, 0.3)), DB.clone().add(new THREE.Vector3(0.4, 0.4, 0)), 0.9),
      apiRobot: curveBetween(API.clone().add(new THREE.Vector3(0.8, 0, 0.3)), ROBOT.clone().add(new THREE.Vector3(-0.3, 0.4, 0)), 0.9),
    }),
    [],
  );

  const Wrap = animate ? Float : Group;

  return (
    <Canvas
      camera={{ position: [7.4, 6.2, 9.8], fov: 34 }}
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      aria-hidden
    >
      <ambientLight intensity={p.dark ? 0.55 : 0.85} />
      <hemisphereLight args={[p.dark ? "#8b84ff" : "#ffffff", p.dark ? "#0d0f1a" : "#e8e2d6", p.dark ? 0.6 : 0.5]} />
      <directionalLight position={[5, 8, 6]} intensity={p.dark ? 1.3 : 1.6} />
      <directionalLight position={[-6, 3, -4]} intensity={0.35} color={p.dark ? "#3dd6ae" : "#ffffff"} />

      <group position={[-0.2, -0.3, 0]}>
        <Rig animate={animate}>
          {/* platform */}
          <RoundedBox args={[7.0, 0.18, 4.6]} radius={0.09} smoothness={4} position={[0, -0.42, 0.3]}>
            <meshStandardMaterial color={p.surface} roughness={0.9} />
          </RoundedBox>
          <gridHelper args={[7, 14, p.dark ? "#2b3150" : "#ddd6c8", p.dark ? "#20253d" : "#e9e4d9"]} position={[0, -0.32, 0.3]} scale={[1, 1, 4.5 / 7]} />

          <Wrap speed={1.4} rotationIntensity={0.08} floatIntensity={0.25}>
            <ApiServer p={p} />
          </Wrap>
          <Wrap speed={1.1} rotationIntensity={0.05} floatIntensity={0.2}>
            <Database p={p} />
          </Wrap>
          <Robot p={p} animate={animate} />
          <Wrap speed={1.2} rotationIntensity={0.1} floatIntensity={0.5}>
            <ClientWindow p={p} />
          </Wrap>

          <Packets curve={curves.clientApi} color={p.accent} animate={animate} speed={0.28} />
          <Packets curve={curves.apiDb} color={p.mint} animate={animate} count={3} speed={0.2} />
          <Packets curve={curves.apiRobot} color={p.amber} animate={animate} speed={0.24} />

          <ContactShadows position={[0, -0.33, 0.3]} opacity={p.dark ? 0.5 : 0.3} scale={9} blur={2.4} far={3} frames={animate ? Infinity : 1} />
        </Rig>
      </group>
    </Canvas>
  );
}

function Group({ children }: { children: ReactNode; speed?: number; rotationIntensity?: number; floatIntensity?: number }) {
  return <group>{children}</group>;
}
