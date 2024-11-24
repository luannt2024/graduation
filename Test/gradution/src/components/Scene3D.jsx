// components/Scene3D.js
'use client'

import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { motion } from 'framer-motion'

const GraduationCapScene = () => {
  const { scene } = useGLTF('/models/graduation.glb')
  const group = useRef()

  useEffect(() => {
    if (group.current) {
      group.current.rotation.y = Math.PI / 4 // Rotate the model
    }
  }, [])

  return (
    <motion.group
      ref={group}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <primitive object={scene} scale={0.5} position={[0, -1, 0]} />
    </motion.group>
  )
}

const Scene3D = () => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
      <GraduationCapScene />
      <OrbitControls />
    </Canvas>
  )
}

export default Scene3D
