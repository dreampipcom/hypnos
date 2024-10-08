import { withSentryConfig } from '@sentry/nextjs';
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';

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
  output:
    process.env.NEXUS_STANDALONE === 'true' && process.env.NEXUS_STANDALONE_PRISMA_ONLY !== 'true'
      ? 'standalone'
      : undefined,
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

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: 'dreampip',
  project: 'hypnos',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
