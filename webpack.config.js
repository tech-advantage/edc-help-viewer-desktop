const path = require('path');

module.exports = {
  entry: './main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],// other stuff
    fallback: {
      "fs": false,
      "path": require.resolve("path-browserify")
    }
  },
};