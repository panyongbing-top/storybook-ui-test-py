const path = require('path');

module.exports = {
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  "framework": "@storybook/react",
  core: {
    builder: {
      name: 'webpack5',
      options: {
        lazyCompilation: true,
        fsCache: true
      }
    },
  },
  webpackFinal: async (config, { configType }) => {
    // 配置支持less
    // 配置支持postcss兼容
    config.module.rules.push({
      test: /\.less$/,
      include: path.resolve(__dirname, '../src'),
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                'postcss-preset-env'
              ]
            }
          }
        },
        'less-loader'
      ]
    });

    return config;
  }
}