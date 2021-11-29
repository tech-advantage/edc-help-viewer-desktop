const {compiler, afterResolvers, hooks, tap} = require('webpack');
const path = require('path');

const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const SaveRemoteFilePlugin = require('save-remote-file-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin-next');
// Create a new compiler instance

const patterns = [
  { from: process.cwd() + '/edc-help-viewer.3.2.2/help', to: 'help' },
];

const config = {
  entry: './main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),

  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],// other stuff
    fallback: {
      fs: false,
      path: require.resolve("path-browserify")
    },
    
    
  },
  plugins: [
    new SaveRemoteFilePlugin([{
      url: 'https://github.com/tech-advantage/edc-help-viewer/releases/download/v3.2.2/edc-help-viewer.3.2.2.zip',
      filepath: 'zip/edc_zip.zip',
    }]),
    new WebpackShellPlugin({
      onBuildEnd:{
        scripts: ['npm run init-viewer'],
        blocking: false,
        parallel: true
      },
    }, new CopyWebpackPlugin({
      patterns
    })),
    
    {
      apply: (compiler) => {
        compiler.hooks.done.tap("WebpackShellPlugin", (compiler) => {
          console.log('Je suis le done')   
        })
    },
  },
  ],
};

// if (patterns.length > 0) {
//   config.plugins.push(new CopyWebpackPlugin({ patterns }));
// }

module.exports = config