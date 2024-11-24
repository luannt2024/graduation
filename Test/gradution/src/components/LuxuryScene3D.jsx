'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Text, Stars } from '@react-three/drei'
import { motion } from 'framer-motion-3d'
import * as THREE from 'three'

const GraduationCapScene = () => {
  const { scene } = useGLTF('/models/graduation.glb')
  const group = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    group.current.rotation.y = Math.sin(t / 2) * 0.1 + Math.PI / 4
    group.current.position.y = Math.sin(t) * 0.1
  })

  return (
    <motion.group
      ref={group}
      initial={{ scale: 0 }}
      animate={{ scale: 0.5 }}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      <primitive object={scene} position={[0, -1, 0]} />
    </motion.group>
  )
}

const RotatingRing = () => {
  const ring = useRef()
  
  useFrame((state) => {
    ring.current.rotation.z += 0.002
  })

  return (
    <motion.group
      ref={ring}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 2, delay: 1 }}
    >
      <Text
        curve={2}
        fontSize={0.5}
        color="gold"
        anchorX="center"
        anchorY="middle"
        rotation={[0, 0, 0]}
        position={[0, 0, 0]}
      >
        Lễ Tốt Nghiệp 2024 • Đại học Công nghiệp Thành phố Hồ Chí Minh •
      </Text>
    </motion.group>
  )
}

const Particles = () => {
  const points = useRef()
  const particlesCount = 5000
  const [positions] = useState(() => {
    const arr = new Float32Array(particlesCount * 3)
    for (let i = 0; i < particlesCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return arr
  })

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3
      points.current.geometry.attributes.position.array[i3 + 1] = 
        positions[i3 + 1] + Math.sin(time + positions[i3]) * 0.1
    }
    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.01} color="gold" sizeAttenuation transparent opacity={0.8} />
    </points>
  )
}

const LuxuryScene3D = () => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
      <color attach="background" args={['#000']} />
      <ambientLight intensity={0.2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Particles />
      <GraduationCapScene />
      <RotatingRing />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  )
}

export default LuxuryScene3D