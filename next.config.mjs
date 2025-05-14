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
    domains: ["plus.unsplash.com", "images.unsplash.com", "localhost"],
  },
  reactStrictMode: false,
};

export default nextConfig;
