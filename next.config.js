/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Allow Server Actions behind Codespaces/Vercel-style proxies
    serverActions: {
      allowedOrigins: ["*.app.github.dev", "*.githubpreview.dev", "localhost:3000"],
    },
  },
};

module.exports = nextConfig;
