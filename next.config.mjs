import createNextIntlPlugin from "next-intl/plugin";

const nextConfig = {
  devIndicators: false,
  reactCompiler: true,
  productionBrowserSourceMaps: true,
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.js");
export default withNextIntl(nextConfig);
