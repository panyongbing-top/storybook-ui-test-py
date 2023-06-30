const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const glob = require('glob');

const getStyleLoader = (importLoaders, loaderName) => {
  return [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        importLoaders
      }
    },
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
    loaderName
  ].filter(Boolean);
}

const entries = {};
const fileNames = glob.sync('./src/**/*.js?(x)');
// console.log('fileNames: ', fileNames);
fileNames.forEach(file => {
  const filePath = file.replace(/^\.\/src\/(.+)\.jsx?$/, '$1');
  entries[filePath] = file;
})

module.exports = {
  mode: 'production',
  entry: entries,
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: '[name].js',
    clean: true,
    library: {
      name: 'storybook-ui',
      type: 'umd'
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: getStyleLoader(1)
      },
      {
        test: /\.less$/,
        use: getStyleLoader(2, 'less-loader')
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'chunk'
    },
    minimizer: [
      new CssMinimizerPlugin()
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    }
  }
}