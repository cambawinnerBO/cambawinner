import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/app-build-manifest\.json$/],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
};

export default withPWA(nextConfig);
