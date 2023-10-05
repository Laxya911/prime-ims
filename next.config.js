/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'delivery.fastlineindia.com',  
          },
          {
            protocol: 'https',
            hostname: 'res.cloudinary.com'
          },
          {
            protocol:'https',
            hostname:'fastline.vercel.app'
          },
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com'
          }
        ],
      },
      // typescript: {
      //   ignoreBuildErrors: true,
      // },
}

module.exports = nextConfig
