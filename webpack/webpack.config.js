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
  mode: 'production',
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    fallback: {
      fs: false,
      path: require.resolve("path-browserify")
    }
  },
  plugins: [
    // Fetch the remote zip
    new SaveRemoteFilePlugin([{
      url: 'https://github.com/tech-advantage/edc-help-viewer/releases/download/v3.2.2/edc-help-viewer.3.2.2.zip',
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
    // Replace the url base in index.html from viewer
    new ReplaceInFileWebpackPlugin([{
      dir: ROOT_FOLDER + '/static/help',
      files: ['index.html'],
      rules: [{
          search: '/help/',
          replace: './'
      }]
    }]),
    // Move, copy and delete content from viewer directory unzipped, thats actions fire after build completes
    new FileManagerPlugin({
      events: {
        onEnd: {
          move: [
            { source: ROOT_FOLDER + '/'+ EDC_VIEWER_FOLDER_VERSION +'/help', destination: ROOT_FOLDER + '/static/help' },
          ],
          copy: [
            { source: ROOT_FOLDER + '/conf/config.json', destination: ROOT_FOLDER + '/static/help/assets/config.json'},
          ],
          delete: [ROOT_FOLDER + '/'+ EDC_VIEWER_FOLDER_VERSION + '', ROOT_FOLDER + '/dist/zip'],
        },
      },
      runTasksInSeries: true,
    }),
  ],
};

module.exports = config;