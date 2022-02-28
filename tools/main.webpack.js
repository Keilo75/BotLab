module.exports = {
  plugins: [
  ],
  resolve: {
    extensions: ['.ts', '.js']
  },
  entry: './src/main/main.ts',
  module: {
    rules: [
      ...require('./rules.webpack'),
      {
        test: /\.(m?js|node)$/,
        parser: { amd: false },
        use: {
          loader: '@vercel/webpack-asset-relocator-loader',
          options: {
            outputAssetBase: 'native_modules',
          },
        },
      }
    ]
  }
}