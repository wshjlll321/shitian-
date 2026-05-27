/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow LAN access in dev mode — Next.js 15+ blocks cross-origin
  // HMR / dev-resource requests by default, which leaves visitors on the
  // LAN seeing only the empty app shell.
  allowedDevOrigins: ["192.168.3.174", "192.168.3.*", "localhost", "127.0.0.1"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.shitianuav.com"
      }
    ]
  }
};

export default nextConfig;
