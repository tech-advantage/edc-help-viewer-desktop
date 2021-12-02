const FileManagerPlugin = require('filemanager-webpack-plugin');
const path = require('path');
const SaveRemoteFilePlugin = require('save-remote-file-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin-next');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');

const {ROOT_FOLDER, EDC_VIEWER_FOLDER_VERSION} = require('../conf/edc_const')

const config = {
  entry: './src/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(ROOT_FOLDER, 'dist'),
  },
  
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
        scripts: ['npm run unzip-viewer'],
        blocking: true,
        parallel: false
      },
    }),
    new ReplaceInFileWebpackPlugin([{
      dir: process.cwd() + '/static/help',
      files: ['index.html'],
      rules: [{
          search: '/help/',
          replace: './'
      }]
    }]),
    new FileManagerPlugin({
      events: {
        onEnd: {
          move: [
            { source: process.cwd() + '/'+ EDC_VIEWER_FOLDER_VERSION +'/help', destination: ROOT_FOLDER + '/static/help' },
          ],
          copy: [
            { source: process.cwd() + '/conf/config.json', destination: ROOT_FOLDER + '/static/help/assets/config.json'},
          ],
          delete: [process.cwd() + '/'+ EDC_VIEWER_FOLDER_VERSION + '', ROOT_FOLDER + '/dist/zip'],
        },
      },
      runTasksInSeries: true,
    }),
  ],
};

module.exports = config