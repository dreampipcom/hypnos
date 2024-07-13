/** @type {import('next').NextConfig} */
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');

// const headers = [
//   'Accept',
//   'Accept-Version',
//   'Content-Length',
//   'Content-MD5',
//   'Content-Type',
//   'Date',
//   'X-Api-Version',
//   'X-CSRF-Token',
//   'X-Requested-With',
// ];
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  },
  basePath: process.env.NEXUS_BASE_PATH,
  transpilePackages: ['next-auth'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rickandmortyapi.com',
      },
    ],
  },
  async redirects() {
    return [
      // {
      //   source: '/signin',
      //   destination: '/api/auth/signin',
      //   permanent: false,
      // },
    ];
  },
  reactStrictMode: true,
  async headers() {
    return [
      // {
      //   source: '/api/(.*)',
      //   headers: [
      //     { key: 'Access-Control-Allow-Credentials', value: 'false' },
      //     { key: 'Access-Control-Allow-Origin', value: '*' },
      //     { key: 'Access-Control-Allow-Private-Network', value: 'true' },
      //     {
      //       key: 'Access-Control-Allow-Methods',
      //       value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      //     },
      //     {
      //       key: 'Access-Control-Allow-Headers',
      //       value: headers.join(', '),
      //     },
      //   ],
      // },
    ];
  },
};

module.exports = nextConfig;

// Injected content via Sentry wizard below

// const { withSentryConfig } = require('@sentry/nextjs');

// module.exports = withSentryConfig(
//   module.exports,
//   {
//     // For all available options, see:
//     // https://github.com/getsentry/sentry-webpack-plugin#options

//     // Suppresses source map uploading logs during build
//     silent: true,
//     org: 'dreampip',
//     project: 'hypnos',
//   },
//   {
//     // For all available options, see:
//     // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

//     // Upload a larger set of source maps for prettier stack traces (increases build time)
//     widenClientFileUpload: true,

//     // Transpiles SDK to be compatible with IE11 (increases bundle size)
//     transpileClientSDK: true,

//     // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
//     // This can increase your server load as well as your hosting bill.
//     // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
//     // side errors will fail.
//     // tunnelRoute: "/monitoring",

//     // Hides source maps from generated client bundles
//     hideSourceMaps: true,

//     // Automatically tree-shake Sentry logger statements to reduce bundle size
//     disableLogger: true,

//     // Enables automatic instrumentation of Vercel Cron Monitors.
//     // See the following for more information:
//     // https://docs.sentry.io/product/crons/
//     // https://vercel.com/docs/cron-jobs
//     automaticVercelMonitors: true,
//   },
// );
