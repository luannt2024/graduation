/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push({
      'react-native-config': 'react-native-config',
    });
    return config;
  },
  images: {
    domains: ['e7.pngegg.com'], // Thêm hostname của ảnh bên ngoài tại đây
  },
};

export default nextConfig;
