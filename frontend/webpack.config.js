const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.ts',
  devtool: 'source-map',
  resolve: { extensions: ['.ts', '.js'] },
  module: {
    rules: [
      { test: /\.html$/, use: 'raw-loader' },
      { test: /\.ts$/, use: ['ts-loader'], exclude: /node_modules/ },
      { 
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('autoprefixer')
                ]
              }
            }
          }
        ]
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  devServer: {
    port: 4200,
    historyApiFallback: true,
    client: { overlay: true },
    proxy: [
      {
        context: ['/api', '/health'],
        target: 'http://localhost:4000',
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' })
  ]
};