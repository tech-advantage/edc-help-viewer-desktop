import { APP_ROOT } from '../conf/edc-const';
import { unzipViewer } from './unzip-help-viewer';
import * as webpack from 'webpack';
import FileManagerPlugin from 'filemanager-webpack-plugin';
import SaveRemoteFilePlugin from 'save-remote-file-webpack-plugin';
import WebpackShellPlugin from 'webpack-shell-plugin-next';
import nodeExternals from 'webpack-node-externals';

const config: webpack.Configuration = {
  entry: APP_ROOT + '/webpack/webpack.main.config.ts',
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|\.webpack)/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },
  plugins: [
    // Fetch the remote zip viewer
    new SaveRemoteFilePlugin([
      {
        url: 'https://github.com/tech-advantage/edc-help-viewer/releases/download/v3.3.2/edc-help-viewer.3.3.2.zip',
        filepath: 'zip/edc-help-viewer.zip',
      },
    ]),
    // Run the unzip script describe in package.json
    new WebpackShellPlugin({
      onBuildEnd: {
        scripts: [
          () => {
            unzipViewer();
          },
        ],
        blocking: true,
        parallel: false,
      },
    }),
    // Move, copy and delete content from viewer directory unzipped, thats actions fire after build completes
    new FileManagerPlugin({
      events: {
        onEnd: {
          move: [
            {
              source: APP_ROOT + '/dist/',
              destination: APP_ROOT + '/static/help',
            },
          ],
          copy: [
            {
              source: APP_ROOT + '/conf/config.json',
              destination: APP_ROOT + '/static/help/assets/config.json',
            },
            {
              source: APP_ROOT + '/conf/index.html',
              destination: APP_ROOT + '/static/help/',
            },
          ],
          delete: [APP_ROOT + '/static/help/zip'],
        },
      },
      runTasksInSeries: true,
    }),
  ],
};

export default config;
