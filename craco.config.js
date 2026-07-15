module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Ganti nama folder "static" jadi "module"
      webpackConfig.output.filename = 'module/js/eltrihidden.[contenthash:8].js';
      webpackConfig.output.chunkFilename = 'module/js/eltrichunk.[contenthash:8].js';

      // Ganti nama output file CSS lewat plugin MiniCssExtractPlugin
      webpackConfig.plugins.forEach((plugin) => {
        if (plugin.constructor.name === 'MiniCssExtractPlugin') {
          plugin.options.filename = 'module/css/eltrikatolik.[contenthash:8].css';
          plugin.options.chunkFilename = 'module/css/eltricsschunk.[contenthash:8].css';
        }
      });

      return webpackConfig;
    },
  },
};