// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (config, options, targetOptions) => {

  /**
   * Process svg assets
   */
  config.module.rules.push(
    {
      test: /\.svg$/,
      use: [
        {
          loader: 'svg-sprite-loader',
          options: {
            runtimeCompat: true,
            symbolId: '[hash]_[name]_svg'
          }
        }
      ]
    }
  )

  config.module.plugins

  /**
   * Add Plugin analyzed
   */
  // config.plugins.push(
  //   new BundleAnalyzerPlugin(),
  // )

  return config;
};
