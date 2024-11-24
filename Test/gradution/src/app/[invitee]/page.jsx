'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, useGLTF, MeshTransmissionMaterial, Environment, Stars, PerspectiveCamera } from '@react-three/drei'
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
      <primitive object={scene} scale={0.5} position={[0, -1, 0]} />
    </motion.group>
  )
}

const FloatingLeaves = () => {
  const leaves = useRef()
  const leafCount = 30
  const [leafPositions] = useState(() => {
    return Array.from({ length: leafCount }, () => ({
      position: [
        (Math.random() - 0.5) * 10,
        Math.random() * 10,
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
        leaf.position.y = 10
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
      <FrankModel />
      <Environment preset="forest" />
      <OrbitControls enableZoom={false} enablePan={false} />
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
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
      whileHover={{ scale: 1.05 }}
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

export default function InteractiveEcoLuxuryInvitationPage({ params }) {
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
    <div className="w-full h-screen overflow-hidden relative flex" style={{ backgroundColor: colors.lightGreen }}>
      <div className="w-1/2 h-full p-8 flex items-center justify-center">
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-white bg-opacity-80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center"
              style={{ border: `4px solid ${colors.deepGreen}` }}
            >
              <AnimatedText delay={0.2}>
                <h1 className="text-5xl font-serif mb-8" style={{ color: colors.deepGreen }}>
                  Trân trọng kính mời
                </h1>
              </AnimatedText>
              <AnimatedText delay={0.4}>
                <h2 className="text-6xl font-bold mb-10" style={{ color: colors.darkGreen }}>
                  {invitee.name}
                </h2>
              </AnimatedText>
              <AnimatedText delay={0.6}>
                <p className="text-3xl mb-10" style={{ color: colors.mediumDarkGreen }}>
                  Tới dự Lễ Tốt Nghiệp của
                </p>
              </AnimatedText>
              <AnimatedText delay={0.8}>
                <p className="text-4xl font-medium mb-10" style={{ color: colors.deepGreen }}>
                  Đại học Công nghiệp Thành phố Hồ Chí Minh
                </p>
              </AnimatedText>
              <AnimatedText delay={1}>
                <p className="text-5xl font-bold mb-12 font-serif" style={{ color: colors.darkGreen }}>
                  Ngày 30 tháng 11 năm 2024, 14:00
                </p>
              </AnimatedText>
              <AnimatedText delay={1.2}>
                <p className="italic mb-12 text-2xl font-light" style={{ color: colors.mediumDarkGreen }}>
                  Sự hiện diện của {invitee.name} sẽ là niềm vinh hạnh tuyệt vời cho chúng tôi.
                </p>
              </AnimatedText>
              <AnimatedText delay={1.4}>
                <InteractiveButton
                  onClick={() => setConfirmed(true)}
                  style={{ backgroundColor: colors.deepGreen, color: colors.lightGreen }}
                >
                  {confirmed ? "Đã xác nhận" : "Xác nhận tham dự"}
                </InteractiveButton>
              </AnimatedText>
              <AnimatedText delay={1.6}>
                <p className="mt-10 text-sm" style={{ color: colors.mediumDarkGreen }}>
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
            <EcoLuxuryScene />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}