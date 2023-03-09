import { ConfigElectronViewer } from './utils/config-electron-viewer';
import { UrlUtils } from './utils/url-utils';
import { PathResolver } from './utils/path-resolver';
import { FsUtils } from './utils/fs-utils';
import { server } from './expressServer/server';

const baseHref = '/help/';

window.addEventListener('DOMContentLoaded', () => {
  const imgViewer: HTMLImageElement = document.querySelector('.img-content img')!;
  const imgContent: HTMLElement = document.querySelector('.img-content');

  if (ConfigElectronViewer.getServerPortConfig() !== null) {
    server();
    if (window.origin === UrlUtils.getUrl()) {
      if (imgContent == null) {
        const esScripts = [
          createEsScript('runtime-es2015.js'),
          createEsScript('polyfills-es2015.js'),
          createEsScript('main-es2015.js'),
        ];
        const rootElemBase = document.querySelector('app-root');
        if (!rootElemBase) {
          document.getElementsByTagName('head')[0].appendChild(createBaseTag());
          createBaseTag();
          insertLinkStyleSheet();
          const appRoot = document.createElement('app-root');
          document.body.prepend(appRoot);
        }
        for (const esScript of esScripts) {
          document.body.appendChild(esScript);
        }
      } else {
        imgViewer.src = ConfigElectronViewer.getImgLoaderConfig();
      }
    }
  }
});

function createBaseTag(): HTMLBaseElement {
  const base: HTMLBaseElement = document.createElement('base');
  base.href = baseHref;
  return base;
}

function insertLinkStyleSheet(): void {
  const head = document.getElementsByTagName('head')[0];
  const cssFiles = FsUtils.readDirSync(PathResolver.getCssFiles(), null);
  const urlConfig: string = `${ConfigElectronViewer.getHostName()}:${ConfigElectronViewer.getServerPortConfig()}`;
  const linkStyleBase: HTMLLinkElement = createLinkStyleSheet('styles.css');
  head.appendChild(linkStyleBase);
  for (const file of cssFiles) {
    const linksStyleAssets = createLinkStyleSheet(`${urlConfig}/help/assets/style/${file}`);
    head.appendChild(linksStyleAssets);
  }
}

function createLinkStyleSheet(fileName: string): HTMLLinkElement {
  const link: HTMLLinkElement = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = fileName;
  return link;
}

function createEsScript(fileName: string): HTMLScriptElement {
  const esScript: HTMLScriptElement = document.createElement('script');
  esScript.src = baseHref + fileName;
  esScript.type = 'module';
  esScript.async;
  return esScript;
}
