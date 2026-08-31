import createNextIntlPlugin from "next-intl/plugin";

const nextConfig = {
  devIndicators: false,
  reactCompiler: true,
  productionBrowserSourceMaps: true,

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "tictactoe-4x4.vercel.app" }],
        destination: "https://tictactoe.moamalalaa.com/:path*",
        permanent: true,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.js");
export default withNextIntl(nextConfig);
