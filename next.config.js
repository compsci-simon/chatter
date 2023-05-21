module.exports = {
  publicRuntimeConfig: {
    // Will be available on both server and client
    NEXT_PUBLIC_HOST: process.env.NEXT_PUBLIC_HOST,
    NEXT_PUBLIC_HTTP_PORT: process.env.NEXT_PUBLIC_HTTP_PORT,
    NEXT_PUBLIC_WSS_PORT: process.env.NEXT_PUBLIC_WSS_PORT
  },
  /** We run eslint as a separate task in CI */
  eslint: { ignoreDuringBuilds: !!process.env.CI },
};