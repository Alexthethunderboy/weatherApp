/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_WEATHER_KEY: process.env.NEXT_PUBLIC_WEATHER_KEY,
    NEXT_PUBLIC_NEWS_API_KEY: process.env.NEXT_PUBLIC_NEWS_API_KEY,
    NEXT_PUBLIC_VISUAL_CROSSING_KEY: process.env.NEXT_PUBLIC_VISUAL_CROSSING_KEY,
  },
}

module.exports = nextConfig

