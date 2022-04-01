const FileManagerPlugin = require('filemanager-webpack-plugin');
const path = require('path');
const SaveRemoteFilePlugin = require('save-remote-file-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin-next');
const EDC_VIEWER_FOLDER_VERSION = 'edc-help-viewer.3.2.5';
const {ROOT_FOLDER} = require('../conf/edc_const')

const config = {
  entry: ROOT_FOLDER + '/main.js',
  mode: 'development',
  output: {
    filename: 'main.js',
    path: path.resolve(ROOT_FOLDER, 'dist'),
  },
  externals: {
    'app': 'require("electron")',
    'shell': 'require("shell")',
    'fs': 'require("fs")',
    'electron-log': 'require("electron-log")'
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    fallback: {
      fs: false,
      path: require.resolve("path-browserify")
    }
  },
  plugins: [
    // Fetch the remote zip viewer
    new SaveRemoteFilePlugin([{
      url: 'https://github.com/tech-advantage/edc-help-viewer/releases/download/v3.2.5/edc-help-viewer.3.2.5.zip',
      filepath: 'zip/edc_zip.zip',
    }]),
    // Run the unzip script describe in package.json
    new WebpackShellPlugin({
      onBuildEnd:{
        scripts: ['npm run unzip-viewer'],
        blocking: true,
        parallel: false
      },
    }),
    // Move, copy and delete content from viewer directory unzipped, thats actions fire after build completes
    new FileManagerPlugin({
      events: {
        onEnd: {
          move: [
            { source: ROOT_FOLDER + '/dist', destination: ROOT_FOLDER + '/static/help' },
          ],
          copy: [
            { source: ROOT_FOLDER + '/conf/config.json', destination: ROOT_FOLDER + '/static/help/assets/config.json'},
            { source: ROOT_FOLDER + '/conf/index.html', destination: ROOT_FOLDER + '/static/help/'},
          ],
          delete: [ROOT_FOLDER + '/'+ EDC_VIEWER_FOLDER_VERSION + '', ROOT_FOLDER + '/dist/zip'],
        },
      },
      runTasksInSeries: true,
    }),
  ],
};

module.exports = config;