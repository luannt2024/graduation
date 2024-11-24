'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

const Scene3D = dynamic(() => import('../components/Scene3D'), { ssr: false })

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-black bg-opacity-50 backdrop-blur-lg rounded-xl shadow-2xl p-8 max-w-4xl w-full text-center text-white border border-gold"
      >
        <h1 className="text-5xl font-bold mb-6 text-gold font-serif">Lễ Tốt Nghiệp</h1>
        <p className="text-2xl mb-4 font-light">của</p>
        <div className="h-96 mb-8">
          {isMounted && <Scene3D />}
        </div>
        <p className="mb-4 text-xl font-light">Đại học Công nghiệp Thành phố Hồ Chí Minh</p>
        <p className="text-3xl font-medium mb-8 text-gold font-serif">Ngày 30/11/2024, 14:00</p>
        <p className="mb-6 text-xl font-light">Để xem lời mời của bạn, vui lòng truy cập đường dẫn cá nhân.</p>
        <p className="text-sm text-gray-400">Ví dụ: loimoi.com/[mã định danh]</p>
      </motion.div>
    </div>
  )
}