'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, useGLTF, MeshTransmissionMaterial, Environment, Stars } from '@react-three/drei'
import * as THREE from 'three'
import invitees from '../data/invitees'

const colors = {
  lightGreen: '#E7F5DC',
  mediumLightGreen: '#CFE1B9',
  mediumGreen: '#B6C99B',
  mediumDarkGreen: '#98A77C',
  darkGreen: '#88976C',
  deepGreen: '#728156',
}

const GraduationCapScene = () => {
  const { scene } = useGLTF('/models/graduation.glb')
  const group = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    group.current.rotation.y = Math.sin(t / 2) * 0.1 + Math.PI / 4
    group.current.position.y = Math.sin(t) * 0.1 + 0.5
  })

  return (
    <motion.group
      ref={group}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      <primitive object={scene} scale={0.5} />
    </motion.group>
  )
}

const FloatingDiploma = () => {
  const { scene } = useGLTF('/models/frank.glb')
  const group = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    group.current.rotation.z = Math.sin(t / 3) * 0.1
    group.current.position.y = Math.sin(t / 2) * 0.1 + 0.2
  })

  return (
    <motion.group
      ref={group}
      initial={{ scale: 0 }}
      animate={{ scale: 0.3 }}
      transition={{ duration: 2, delay: 1, ease: "easeOut" }}
    >
      <primitive object={scene} position={[1.5, 0, 0]} />
    </motion.group>
  )
}

const RotatingRing = () => {
  const ring = useRef()
  
  useFrame((state) => {
    ring.current.rotation.z += 0.001
    ring.current.rotation.x = Math.sin(state.clock.getElapsedTime() / 2) * 0.1
  })

  return (
    <motion.group
      ref={ring}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
    >
      <Text
        curve={2}
        fontSize={0.4}
        color={colors.mediumDarkGreen}
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

const FloatingLeaves = () => {
  const leaves = useRef()
  const leafCount = 50
  const [leafPositions] = useState(() => {
    return Array.from({ length: leafCount }, () => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ],
      speed: Math.random() * 0.02 + 0.01
    }))
  })

  useFrame((state) => {
    leaves.current.children.forEach((leaf, i) => {
      leaf.position.y -= leafPositions[i].speed
      leaf.rotation.x += 0.01
      leaf.rotation.y += 0.01
      if (leaf.position.y < -5) {
        leaf.position.y = 5
      }
    })
  })

  return (
    <group ref={leaves}>
      {leafPositions.map((leaf, i) => (
        <mesh key={i} position={leaf.position} rotation={leaf.rotation}>
          <planeGeometry args={[0.2, 0.2]} />
          <meshStandardMaterial color={colors.mediumGreen} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

const EcoLuxuryScene = () => {
  return (
    <>
      <color attach="background" args={[colors.lightGreen]} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.5} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <FloatingLeaves />
      <GraduationCapScene />
      <FloatingDiploma />
      <RotatingRing />
      <Environment preset="forest" />
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  )
}

export default function EcoLuxuryInvitationPage({ params }) {
  const [invitee, setInvitee] = useState(null)
  const [showContent, setShowContent] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const foundInvitee = invitees.find(i => i.slug === params.invitee)
    if (foundInvitee) {
      setInvitee(foundInvitee)
      setTimeout(() => setShowContent(true), 3000) // Delay content reveal
    } else {
      router.push('/404')
    }
  }, [params.invitee, router])

  if (!invitee) {
    return null
  }

  return (
    <div className="w-full h-screen overflow-hidden relative" style={{ backgroundColor: colors.lightGreen }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Suspense fallback={null}>
          <EcoLuxuryScene />
        </Suspense>
      </Canvas>
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-white bg-opacity-80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 max-w-4xl w-full text-center pointer-events-auto" style={{ border: `4px solid ${colors.deepGreen}` }}>
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-5xl font-serif mb-8" style={{ color: colors.deepGreen }}
              >
                Trân trọng kính mời
              </motion.h1>
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-6xl font-bold mb-10" style={{ color: colors.darkGreen }}
              >
                {invitee.name}
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="text-3xl mb-10" style={{ color: colors.mediumDarkGreen }}
              >
                Tới dự Lễ Tốt Nghiệp của
              </motion.p>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="text-4xl font-medium mb-10" style={{ color: colors.deepGreen }}
              >
                Đại học Công nghiệp Thành phố Hồ Chí Minh
              </motion.p>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.8 }}
                className="text-5xl font-bold mb-12 font-serif" style={{ color: colors.darkGreen }}
              >
                Ngày 30 tháng 11 năm 2024, 14:00
              </motion.p>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="italic mb-12 text-2xl font-light" style={{ color: colors.mediumDarkGreen }}
              >
                Sự hiện diện của {invitee.name} sẽ là niềm vinh hạnh tuyệt vời cho chúng tôi.
              </motion.p>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.7, duration: 0.8 }}
                whileHover={{ scale: 1.05, boxShadow: `0 0 15px ${colors.mediumGreen}` }}
                whileTap={{ scale: 0.95 }}
                className="confirm-button font-bold py-4 px-10 rounded-full text-2xl transition-all duration-300" 
                style={{ backgroundColor: colors.deepGreen, color: colors.lightGreen }}
              >
                Xác nhận tham dự
              </motion.button>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.9, duration: 0.8 }}
                className="mt-10 text-sm" style={{ color: colors.mediumDarkGreen }}
              >
                Vui lòng xác nhận tham dự trước ngày 15/11/2024.
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}