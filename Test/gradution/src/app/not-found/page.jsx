'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

const NotFoundScene = dynamic(() => import('../../components/Scene404'), { ssr: false })

export default function NotFound() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-black bg-opacity-60 backdrop-blur-lg rounded-xl shadow-2xl p-12 max-w-5xl w-full text-center text-white border-4 border-yellow-400"
      >
        <h1 className="text-7xl sm:text-8xl font-extrabold mb-6 text-gradient-to-r from-yellow-500 to-red-500 font-serif leading-tight">
          404 - Không tìm thấy
        </h1>
        <div className="h-96 sm:h-112 mb-8">
          {isMounted && <NotFoundScene />}
        </div>
        <p className="mb-12 text-xl sm:text-2xl font-light leading-relaxed text-white opacity-80">
          Xin lỗi, chúng tôi không thể tìm thấy lời mời bạn yêu cầu. Đừng lo, chúng tôi sẽ giúp bạn quay lại đúng hướng.
        </p>
        <Link
          href="/"
          className="text-yellow-400 hover:text-yellow-500 text-2xl sm:text-3xl font-semibold transition-all duration-300 transform hover:scale-105"
        >
          Quay về trang chủ
        </Link>
      </motion.div>
    </div>
  )
}
