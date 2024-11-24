'use client'

import { Canvas } from '@react-three/fiber'
import { Text3D, Center, Stars } from '@react-three/drei'

export default function NotFoundScene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <Center>
        <Text3D
          font="/fonts/Roboto_Bold.json"
          size={1.5}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          404
          <meshStandardMaterial color="gold" metalness={0.8} roughness={0.2} />
        </Text3D>
      </Center>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </Canvas>
  )
}