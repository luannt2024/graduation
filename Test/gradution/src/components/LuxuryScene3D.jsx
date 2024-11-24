import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text3D, Center, useTexture, MeshTransmissionMaterial } from '@react-three/drei'
import { motion } from 'framer-motion-3d'
import * as THREE from 'three'

const FloatingGem = ({ position }) => {
  const meshRef = useRef()
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    meshRef.current.position.y = position[1] + Math.sin(t + position[0]) * 0.1
    meshRef.current.rotation.y = t * 0.2
    meshRef.current.rotation.z = t * 0.1
  })

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[0.2, 0]} />
      <MeshTransmissionMaterial
        backside
        samples={16}
        resolution={512}
        transmission={1}
        roughness={0.0}
        clearcoat={1}
        clearcoatRoughness={0.0}
        thickness={0.5}
        ior={1.5}
        chromaticAberration={1}
        anisotropy={20}
        distortion={0}
        distortionScale={0}
        temporalDistortion={0}
        attenuationDistance={0.5}
        attenuationColor="#ffffff"
        color="#ff9cf5"
      />
    </mesh>
  )
}

const ParticleRing = () => {
  const count = 1000
  const radius = 5

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5
      pos[i * 3 + 2] = Math.sin(angle) * radius
    }
    return pos
  }, [count, radius])

  const pointsRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.1
    pointsRef.current.rotation.y = t
    const positions = pointsRef.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3 + 1] = Math.sin(t + positions[i3]) * 0.5
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffd700" sizeAttenuation transparent opacity={0.8} />
    </points>
  )
}

const GraduationCap = () => {
  const texture = useTexture('/textures/gold_fabric.jpg')
  const meshRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.y = Math.sin(t * 0.5) * 0.1
    meshRef.current.position.y = Math.sin(t) * 0.05 + 0.1
  })

  return (
    <motion.group
      ref={meshRef}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial map={texture} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.2, 0.4, 0.2, 32]} />
        <meshStandardMaterial map={texture} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.4, 0.2, 0.4]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.1, 0.02, 0.5]} />
        <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.2} />
      </mesh>
    </motion.group>
  )
}

const UltraLuxuryScene = () => {
  return (
    <>
      <color attach="background" args={['#000']} />
      <fog attach="fog" args={['#000', 5, 15]} />
      <ambientLight intensity={0.2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.5} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <ParticleRing />
      
      <Center>
        <Text3D
          font="/fonts/Roboto_Bold.json"
          size={0.5}
          height={0.1}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          Lễ Tốt Nghiệp 2024
          <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
        </Text3D>
      </Center>
      
      <GraduationCap />
      
      <FloatingGem position={[-2, 1, -1]} />
      <FloatingGem position={[2, -1, 1]} />
      <FloatingGem position={[-1, -2, 2]} />
      <FloatingGem position={[1, 2, -2]} />
    </>
  )
}

export default UltraLuxuryScene