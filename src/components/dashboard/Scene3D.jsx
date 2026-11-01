import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, Sparkles } from '@react-three/drei';

function Coin({ scale = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.008;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={1.5}>
      <mesh ref={meshRef} scale={scale}>
        <cylinderGeometry args={[1.2, 1.2, 0.15, 64]} />
        <meshStandardMaterial
          color="#a78bfa"
          metalness={0.9}
          roughness={0.1}
          emissive="#6366f1"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Inner ring */}
      <mesh scale={scale * 0.85} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.8, 0.04, 16, 64]} />
        <meshStandardMaterial
          color="#f59e0b"
          metalness={1}
          roughness={0.05}
          emissive="#f59e0b"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* ₹ symbol sphere in center */}
      <mesh scale={scale * 0.3}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#34d399"
          speed={3}
          distort={0.3}
          metalness={0.8}
          roughness={0.2}
          emissive="#10b981"
          emissiveIntensity={0.4}
        />
      </mesh>
    </Float>
  );
}

function FloatingOrbs() {
  const group = useRef();

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={group}>
      {[...Array(5)].map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        const radius = 2.5;
        return (
          <Float key={i} speed={1.5 + i * 0.3} floatIntensity={0.5}>
            <mesh position={[Math.cos(angle) * radius, Math.sin(angle) * 0.5, Math.sin(angle) * radius]}>
              <sphereGeometry args={[0.08 + i * 0.02, 16, 16]} />
              <meshStandardMaterial
                color={['#6366f1', '#8b5cf6', '#a855f7', '#34d399', '#f59e0b'][i]}
                emissive={['#6366f1', '#8b5cf6', '#a855f7', '#34d399', '#f59e0b'][i]}
                emissiveIntensity={0.8}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

export default function Scene3D({ height = '280px', coinScale = 1.2 }) {
  return (
    <div style={{ width: '100%', height, position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#6366f1" />
        <pointLight position={[-5, -3, 3]} intensity={0.5} color="#a855f7" />
        <pointLight position={[0, -5, 0]} intensity={0.3} color="#34d399" />

        <Coin scale={coinScale} />
        <FloatingOrbs />

        <Sparkles
          count={60}
          scale={6}
          size={2}
          speed={0.4}
          color="#a78bfa"
          opacity={0.6}
        />

        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
