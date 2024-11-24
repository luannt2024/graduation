'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import invitees from '../data/invitees'
import { motion, AnimatePresence } from 'framer-motion'

const LuxuryScene3D = dynamic(() => import('../../components/LuxuryScene3D'), { ssr: false })

export default function InvitationPage({ params }) {
  const [invitee, setInvitee] = useState(null)
  const [isMounted, setIsMounted] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
    const foundInvitee = invitees.find(i => i.slug === params.invitee)
    if (foundInvitee) {
      setInvitee(foundInvitee)
      setTimeout(() => setShowContent(true), 3000) // Delay content reveal
    } else {
      router.push('/404')
    }
  }, [params.invitee, router])

  if (!invitee) return null

  return (
    <div className="invitation-container w-full h-screen bg-black overflow-hidden">
      {isMounted && <LuxuryScene3D />}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-black bg-opacity-70 backdrop-blur-md rounded-2xl shadow-2xl p-12 max-w-4xl w-full text-center text-white border-2 border-gold pointer-events-auto">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-4xl font-serif mb-6 text-gold"
              >
                Thân mời
              </motion.h1>
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-5xl font-bold mb-8 text-gold"
              >
                {invitee.name}
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="text-2xl mb-8"
              >
                Tới dự Lễ Tốt Nghiệp của
              </motion.p>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="text-3xl font-medium mb-8"
              >
                Đại học Công nghiệp Thành phố Hồ Chí Minh
              </motion.p>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.8 }}
                className="text-4xl font-bold mb-12 text-gold font-serif"
              >
                Ngày 30/11/2024, 14:00
              </motion.p>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="italic mb-10 text-2xl font-light"
              >
                Sự hiện diện của {invitee.name} sẽ là niềm vinh hạnh cho chúng tôi.
              </motion.p>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.7, duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="confirm-button bg-gold text-black font-bold py-3 px-8 rounded-full text-xl transition-all duration-300 hover:bg-white"
              >
                Xác nhận tham dự
              </motion.button>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.9, duration: 0.8 }}
                className="mt-8 text-sm text-gold"
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