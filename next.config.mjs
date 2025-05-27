// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ["plus.unsplash.com", "images.unsplash.com", "localhost"],
//   },
//   reactStrictMode: true,
//   experimental: {
//     turbo: {
//       resolveAlias: {
//         "*.node": false,
//       },
//     },
//   },
//   eslint: {
//     ignoreDuringBuilds: true, // Disable ESLint during dev
//   },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/api/**",
      },
    ],
    unoptimized: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
