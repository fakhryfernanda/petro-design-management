/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: '/home/fakhry/dev/petro',
  // Pisahkan output build production dari cache dev (`.next`) agar
  // `npm run build` tidak merusak dev server yang sedang berjalan.
  distDir: process.env.NODE_ENV === 'production' ? '.next-build' : '.next',
}
export default nextConfig
