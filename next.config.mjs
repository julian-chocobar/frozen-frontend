/** @type {import('next').NextConfig} */
const nextConfig = {

  async rewrites() {
    // Usar variable de entorno para la URL del backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
    
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig

