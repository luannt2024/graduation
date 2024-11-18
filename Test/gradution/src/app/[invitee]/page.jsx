'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, useGLTF, Environment, Stars, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import Image from 'next/image'
import invitees from '../data/invitees'

const colors = {
  lightGreen: '#E7F5DC',
  mediumLightGreen: '#CFE1B9',
  mediumGreen: '#B6C99B',
  mediumDarkGreen: '#98A77C',
  darkGreen: '#88976C',
  deepGreen: '#728156',
  gold: '#FFD700',
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

const FloatingLeaves = ({ count = 50 }) => {
  const leaves = useRef()
  const [leafPositions] = useState(() => {
    return Array.from({ length: count }, () => ({
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
      speed: Math.random() * 0.02 + 0.01,
      size: Math.random() * 0.1 + 0.05
    }))
  })

  useFrame((state) => {
    leaves.current.children.forEach((leaf, i) => {
      leaf.position.y -= leafPositions[i].speed
      leaf.rotation.x += 0.01
      leaf.rotation.y += 0.01
      if (leaf.position.y < -5) {
        leaf.position.y = 10
        leaf.position.x = (Math.random() - 0.5) * 10
        leaf.position.z = (Math.random() - 0.5) * 10
      }
    })
  })

  return (
    <group ref={leaves}>
      {leafPositions.map((leaf, i) => (
        <mesh key={i} position={leaf.position} rotation={leaf.rotation} scale={[leaf.size, leaf.size, leaf.size]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color={colors.mediumGreen} side={THREE.DoubleSide} transparent opacity={0.7} />
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
      <FloatingLeaves count={100} />
      <FrankModel />
      <Environment preset="forest" />
      <OrbitControls enableZoom={false} enablePan={false} />
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
    </>
  )
}

const AnimatedText = ({ children, delay = 0, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const BloomingFlower = ({ delay = 0, size = 100, position = { top: '50%', left: '50%' } }) => {
  const flowerVariants = {
    hidden: { scale: 0, opacity: 0, rotate: -90 },
    visible: { 
      scale: 1, 
      opacity: 1,
      rotate: 0,
      transition: { 
        duration: 2,
        delay,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      variants={flowerVariants}
      initial="hidden"
      animate="visible"
      className="absolute"
      style={{
        width: size,
        height: size,
        ...position,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Image
  src="https://e7.pngegg.com/pngimages/14/852/png-clipart-flower-watercolor-painting-pink-hand-painted-flowers-pink-flower-color-cartoon.png"
  alt="Blooming Flower"
  width={100}
  height={100}
/>

    </motion.div>
  )
}

const InteractiveButton = ({ children, onClick, style }) => {
  const controls = useAnimation()

  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255,215,0,0.5)' }}
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

const StoryIntro = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const steps = [
    "Trong khoảnh khắc tĩnh lặng của một buổi chiều mùa thu...",
    "Khi những chiếc lá vàng nhẹ nhàng rơi xuống mặt đất...",
    "Một câu chuyện về sự kiên trì, đam mê và thành công bắt đầu được kể...",
    "Đó là câu chuyện của bạn - người đã vượt qua mọi thử thách...",
    "Để đạt đến đỉnh cao của hành trình học tập tại Đại học Công nghiệp TP.HCM.",
    "Và giờ đây, chúng tôi mời bạn chia sẻ khoảnh khắc vinh quang này...",
  ]

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => setCurrentStep(currentStep + 1), 3000)
      return () => clearTimeout(timer)
    } else {
      onComplete()
    }
  }, [currentStep, steps.length, onComplete])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <AnimatePresence mode="wait">
        {currentStep < steps.length && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-white text-3xl text-center max-w-2xl px-8"
          >
            {steps[currentStep]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function LuxuriousGraduationInvitation({ params }) {
  const [invitee, setInvitee] = useState(null)
  const [showContent, setShowContent] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const router = useRouter()
  const [flowers, setFlowers] = useState([])

  useEffect(() => {
    const foundInvitee = invitees.find(i => i.slug === params.invitee)
    if (foundInvitee) {
      setInvitee(foundInvitee)
      setTimeout(() => setShowContent(true), 2000)
    } else {
      router.push('/404')
    }
  }, [params.invitee, router])

  useEffect(() => {
    if (showContent) {
      const flowerCount = 8
      const newFlowers = Array.from({ length: flowerCount }, (_, i) => ({
        id: i,
        delay: i * 0.3,
        size: Math.random() * 60 + 40,
        position: {
          top: `${Math.random() * 80 + 10}%`,
          left: `${Math.random() * 80 + 10}%`,
        }
      }))
      setFlowers(newFlowers)
    }
  }, [showContent])

  if (!invitee) {
    return null
  }

  return (
    <div className="w-full h-screen overflow-hidden relative flex" style={{ backgroundColor: colors.lightGreen }}>
      {showIntro && <StoryIntro onComplete={() => setShowIntro(false)} />}
      <div className="w-1/2 h-full p-8 flex items-center justify-center relative">
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-white bg-opacity-80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center relative overflow-hidden"
              style={{ border: `4px solid ${colors.gold}` }}
            >
              {flowers.map(flower => (
                <BloomingFlower key={flower.id} delay={flower.delay} size={flower.size} position={flower.position} />
              ))}
              <AnimatedText delay={0.2} className="relative z-10">
                <h1 className="text-5xl font-serif mb-8" style={{ color: colors.deepGreen }}>
                  Trân trọng kính mời
                </h1>
              </AnimatedText>
              <AnimatedText delay={0.4} className="relative z-10">
                <h2 className="text-6xl font-bold mb-10" style={{ color: colors.darkGreen }}>
                  {invitee.name}
                </h2>
              </AnimatedText>
              <AnimatedText delay={0.6} className="relative z-10">
                <p className="text-3xl mb-10" style={{ color: colors.mediumDarkGreen }}>
                  Tới dự Lễ Tốt Nghiệp danh giá của
                </p>
              </AnimatedText>
              <AnimatedText delay={0.8} className="relative z-10">
                <p className="text-4xl font-medium mb-10" style={{ color: colors.deepGreen }}>
                  Đại học Công nghiệp Thành phố Hồ Chí Minh
                </p>
              </AnimatedText>
              <AnimatedText delay={1} className="relative z-10">
                <p className="text-5xl font-bold mb-12 font-serif" style={{ color: colors.darkGreen }}>
                  Ngày 30 tháng 11 năm 2024, 14:00
                </p>
              </AnimatedText>
              <AnimatedText delay={1.2} className="relative z-10">
                <p className="italic mb-12 text-2xl font-light" style={{ color: colors.mediumDarkGreen }}>
                  Sự hiện diện của {invitee.name} sẽ là niềm vinh hạnh tuyệt vời, đánh dấu một cột mốc quan trọng trong hành trình học vấn và khởi đầu cho những thành công mới trong tương lai.
                </p>
              </AnimatedText>
              <AnimatedText delay={1.4} className="relative z-10">
                <InteractiveButton
                  onClick={() => setConfirmed(true)}
                  style={{ backgroundColor: colors.gold, color: colors.deepGreen }}
                >
                  {confirmed ? "Đã xác nhận tham dự" : "Xác nhận tham dự"}
                </InteractiveButton>
              </AnimatedText>
              <AnimatedText delay={1.6} className="relative z-10">
                <p className="mt-10 text-sm" style={{ color: colors.mediumDarkGreen }}>
                  Vui lòng xác nhận tham dự trước ngày 15/11/2024 để chúng tôi có thể chuẩn bị chu đáo nhất cho sự kiện trọng đại này.
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
      <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <FloatingLeaves count={50} />
      </Canvas>
    </div>
  )
}