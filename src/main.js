import './style.less';
import pageManager from './libs/page-manager';
import Alert from './libs/alert';
import Home from './pages/home';
import About from './pages/about';
import Func from './pages/function';
import Qrcode from './pages/qrcode';
import ImageToBase64 from './pages/imageToBase64';

function setPageManager () {
  const pages = {
    home: Home,
    function: Func,
    about: About,
    qrcode: Qrcode,
    imageToBase64: ImageToBase64
  }
  pages.home.url = '#';

  for (let page in pages) {
    pages[page].url = `#${pages[page].name}`
    pageManager.push(pages[page]);
  }
  pageManager.setDefault('home').init();
}

function hideSplashscreen () {
  const splashscreen = document.querySelector('#splashscreen');
  if (window.innerWidth >= 576) {
    document.body.removeChild(splashscreen);
    return;
  }
  console.log(splashscreen)
  splashscreen.querySelector('.button').addEventListener('click', () => {
    splashscreen.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(splashscreen);
    }, 300)
  })
}

function _init_ () {
  setPageManager();
  window.log = console.log.bind(console);
  window.pageManager = pageManager;
  window.Alert = Alert;
  window.home = function () {
    this.location.hash = ''
  }
  hideSplashscreen();
}

window.onload = _init_;
