import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface HierarchyPyramidProps {
  position: [number, number, number];
  departments: number;
  classes: number;
  students: number;
}

export default function HierarchyPyramid({ 
  position, 
  departments, 
  classes, 
  students 
}: HierarchyPyramidProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Top tier - Departments */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[1.5, 0.3, 1.5]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.3}
          metalness={0.8}
        />
      </mesh>
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.3}
        color="#00f5ff"
        anchorX="center"
        anchorY="middle"
      >
        {departments} Depts
      </Text>

      {/* Middle tier - Classes */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[2.5, 0.3, 2.5]} />
        <meshStandardMaterial
          color="#bf40bf"
          emissive="#bf40bf"
          emissiveIntensity={0.3}
          metalness={0.8}
        />
      </mesh>
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.3}
        color="#bf40bf"
        anchorX="center"
        anchorY="middle"
      >
        {classes} Classes
      </Text>

      {/* Bottom tier - Students */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.5, 0.3, 3.5]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={0.3}
          metalness={0.8}
        />
      </mesh>
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.3}
        color="#00ff88"
        anchorX="center"
        anchorY="middle"
      >
        {students} Students
      </Text>

      {/* Connecting lines */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, 2, 0, 0, 1, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" opacity={0.3} transparent />
      </line>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, 1, 0, 0, 0, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" opacity={0.3} transparent />
      </line>
    </group>
  );
}
