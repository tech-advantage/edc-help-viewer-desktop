require('./src/server.js');
const configViewer = require('./conf/config_electron_viewer.json');
const path = require('path');
var fs = require('fs');

window.addEventListener('DOMContentLoaded', () => {

  let imgContent = document.querySelector('.img-content');
  let imgViewer = document.querySelector('.img-content img');

  if(imgContent == null){

    var scriptRuntimeEs2015 = document.createElement('script');
    scriptRuntimeEs2015.src = '/help/runtime-es2015.js';
    scriptRuntimeEs2015.type = 'module';
    scriptRuntimeEs2015.async;
    
    var scriptPolyfillsEs2015 = document.createElement('script');
    scriptPolyfillsEs2015.src = '/help/polyfills-es2015.js';
    scriptPolyfillsEs2015.type = 'module';
    scriptPolyfillsEs2015.async;
    
    var scriptStylesEs2015 = document.createElement('script');
    scriptStylesEs2015.src = '/help/styles-es2015.js';
    scriptStylesEs2015.type = 'module';
    scriptStylesEs2015.async;

    var scriptVendorEs2015 = document.createElement('script');
    scriptVendorEs2015.src = '/help/vendor-es2015.js';
    scriptVendorEs2015.type = 'module';
    scriptVendorEs2015.async;
    
    var scriptMainEs2015 = document.createElement('script');
    scriptMainEs2015.src = '/help/main-es2015.js';
    scriptMainEs2015.type = 'module';
    scriptMainEs2015.async;

    let rootElemBase = document.querySelector('app-root');

    if(!rootElemBase){
      var base = document.createElement('base');
      base.href = '/help/';
      
      document.getElementsByTagName('head')[0].appendChild(base);
      var head = document.getElementsByTagName('head')[0];
      let cssFiles = fs.readdirSync(path.join(__dirname, './static/help/assets/style'))
      
      for(let file of cssFiles){
        var link  = document.createElement('link');
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = `http://localhost:60000/help/assets/style/${file}`;
        head.appendChild(link);
      }

      let elem = document.createElement('app-root')
      document.body.prepend(elem);
    }
  
    document.body.appendChild(scriptRuntimeEs2015);
    document.body.appendChild(scriptPolyfillsEs2015);
    document.body.appendChild(scriptStylesEs2015);
    document.body.appendChild(scriptVendorEs2015);
    document.body.appendChild(scriptMainEs2015);

  } else {
    imgViewer.src = configViewer.img_loader;
  }
})