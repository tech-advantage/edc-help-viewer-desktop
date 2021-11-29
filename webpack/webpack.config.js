const FileManagerPlugin = require('filemanager-webpack-plugin');
const path = require('path');
const SaveRemoteFilePlugin = require('save-remote-file-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin-next');

const config = {
  entry: './main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  watch: true,
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    fallback: {
      fs: false,
      path: require.resolve("path-browserify")
    }
  },
  plugins: [
    new SaveRemoteFilePlugin([{
      url: 'https://github.com/tech-advantage/edc-help-viewer/releases/download/v3.2.2/edc-help-viewer.3.2.2.zip',
      filepath: 'zip/edc_zip.zip',
    }]),
    new WebpackShellPlugin({
      onBuildEnd:{
        scripts: ['npm run init-viewer'],
        blocking: true,
        parallel: false
      },
    }),
    new FileManagerPlugin({
      events: {
        onEnd: {
          move: [
            { source: process.cwd() + '/edc-help-viewer.3.2.2/help', destination: process.cwd() + '/webpack/dist/help' },
          ],
          delete: [process.cwd() + '/edc-help-viewer.3.2.2', process.cwd() + '/webpack/dist/zip'],
        },
      },
    }),
  ],
};

module.exports = config