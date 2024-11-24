'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, useGLTF, MeshTransmissionMaterial, Environment, Stars, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import invitees from '../data/invitees'

const colors = {
  gold: '#FFD700',
  cream: '#FFFDD0',
  darkGold: '#996515',
  navy: '#000080',
  lightBlue: '#ADD8E6',
  white: '#FFFFFF',
}

const FrankModel = () => {
  const { scene } = useGLTF('/models/frank.glb')
  const group = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    group.current.rotation.y = Math.sin(t / 3) * 0.1
    group.current.position.y = Math.sin(t / 2) * 0.1
  })

  return (
    <motion.group
      ref={group}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      <primitive object={scene} scale={0.4} position={[-2, -1, 0]} />
    </motion.group>
  )
}

const GraduationModel = () => {
  const { scene } = useGLTF('/models/graduation.glb')
  const group = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    group.current.rotation.y = Math.sin(t / 4) * 0.1
  })

  return (
    <motion.group
      ref={group}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
    >
      <primitive object={scene} scale={0.3} position={[0, -1, 0]} />
    </motion.group>
  )
}

const GraduationCapModel = () => {
  const { scene } = useGLTF('/models/graduation-cap.glb')
  const group = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    group.current.rotation.z = Math.sin(t / 2) * 0.1
    group.current.position.y = Math.sin(t) * 0.1 + 1.5
  })

  return (
    <motion.group
      ref={group}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 2, ease: "easeOut", delay: 1 }}
    >
      <primitive object={scene} scale={0.2} position={[2, 0, 0]} />
    </motion.group>
  )
}

const FloatingParticles = () => {
  const particles = useRef()
  const particleCount = 100
  const [particlePositions] = useState(() => {
    return Array.from({ length: particleCount }, () => ({
      position: [
        (Math.random() - 0.5) * 10,
        Math.random() * 10,
        (Math.random() - 0.5) * 10
      ],
      speed: Math.random() * 0.02 + 0.01
    }))
  })

  useFrame((state) => {
    particles.current.children.forEach((particle, i) => {
      particle.position.y -= particlePositions[i].speed
      if (particle.position.y < -5) {
        particle.position.y = 10
      }
    })
  })

  return (
    <group ref={particles}>
      {particlePositions.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color={colors.gold} emissive={colors.gold} emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  )
}

const LuxuryScene = () => {
  return (
    <>
      <color attach="background" args={[colors.navy]} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.5} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <FloatingParticles />
      <FrankModel />
      <GraduationModel />
      <GraduationCapModel />
      <Environment preset="night" />
      <OrbitControls enableZoom={false} enablePan={false} />
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={75} />
    </>
  )
}

const AnimatedText = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  )
}

const InteractiveButton = ({ children, onClick, style }) => {
  const controls = useAnimation()

  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: `0 0 15px ${colors.gold}` }}
      whileTap={{ scale: 0.95 }}
      animate={controls}
      onClick={async () => {
        await controls.start({ rotate: [0, -10, 10, -10, 10, 0], transition: { duration: 0.5 } })
        onClick()
      }}
      className="font-bold py-4 px-10 rounded-full text-2xl transition-all duration-300"
      style={style}
    >
      {children}
    </motion.button>
  )
}

export default function LuxuryGraduationInvitationPage({ params }) {
  const [invitee, setInvitee] = useState(null)
  const [showContent, setShowContent] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const foundInvitee = invitees.find(i => i.slug === params.invitee)
    if (foundInvitee) {
      setInvitee(foundInvitee)
      setTimeout(() => setShowContent(true), 2000)
    } else {
      router.push('/404')
    }
  }, [params.invitee, router])

  if (!invitee) {
    return null
  }

  return (
    <div className="w-full h-screen overflow-hidden relative flex" style={{ backgroundColor: colors.navy }}>
      <div className="w-1/2 h-full p-8 flex items-center justify-center">
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-opacity-80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center"
              style={{ backgroundColor: colors.cream, border: `4px solid ${colors.gold}` }}
            >
              <AnimatedText delay={0.2}>
                <h1 className="text-5xl font-serif mb-8" style={{ color: colors.darkGold }}>
                  Trân trọng kính mời
                </h1>
              </AnimatedText>
              <AnimatedText delay={0.4}>
                <h2 className="text-6xl font-bold mb-10" style={{ color: colors.navy }}>
                  {invitee.name}
                </h2>
              </AnimatedText>
              <AnimatedText delay={0.6}>
                <p className="text-3xl mb-10" style={{ color: colors.darkGold }}>
                  Tới dự Lễ Tốt Nghiệp của
                </p>
              </AnimatedText>
              <AnimatedText delay={0.8}>
                <p className="text-4xl font-medium mb-10" style={{ color: colors.navy }}>
                  Đại học Công nghiệp Thành phố Hồ Chí Minh
                </p>
              </AnimatedText>
              <AnimatedText delay={1}>
                <p className="text-5xl font-bold mb-12 font-serif" style={{ color: colors.darkGold }}>
                  Ngày 30 tháng 11 năm 2024, 14:00
                </p>
              </AnimatedText>
              <AnimatedText delay={1.2}>
                <p className="italic mb-12 text-2xl font-light" style={{ color: colors.navy }}>
                  Sự hiện diện của {invitee.name} sẽ là niềm vinh hạnh tuyệt vời cho chúng tôi.
                </p>
              </AnimatedText>
              <AnimatedText delay={1.4}>
                <InteractiveButton
                  onClick={() => setConfirmed(true)}
                  style={{ backgroundColor: colors.gold, color: colors.navy }}
                >
                  {confirmed ? "Đã xác nhận" : "Xác nhận tham dự"}
                </InteractiveButton>
              </AnimatedText>
              <AnimatedText delay={1.6}>
                <p className="mt-10 text-sm" style={{ color: colors.darkGold }}>
                  Vui lòng xác nhận tham dự trước ngày 15/11/2024.
                </p>
              </AnimatedText>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="w-1/2 h-full">
        <Canvas>
          <Suspense fallback={null}>
            <LuxuryScene />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}