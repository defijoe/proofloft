/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      { source: "/api/wall/:path*", headers: [{ key: "Access-Control-Allow-Origin", value: "*" }] },
      { source: "/embed.js", headers: [{ key: "Access-Control-Allow-Origin", value: "*" }] },
    ];
  },
};
export default nextConfig;
