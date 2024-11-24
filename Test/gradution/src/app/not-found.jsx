'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

const NotFoundScene = dynamic(() => import('../components/NotFoundScene'), { ssr: false })

export default function NotFound() {
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
        <h1 className="text-5xl font-bold mb-6 text-gold font-serif">404 - Không tìm thấy</h1>
        <div className="h-64 mb-8">
          {isMounted && <NotFoundScene />}
        </div>
        <p className="mb-8 text-xl font-light">Xin lỗi, chúng tôi không tìm thấy lời mời bạn yêu cầu.</p>
        <Link href="/" className="text-gold hover:underline text-xl font-serif">
          Quay về trang chủ
        </Link>
      </motion.div>
    </div>
  )
}