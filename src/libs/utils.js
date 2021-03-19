
export const template = (tpl, data) => {
  const code = 'var p=[];with(this){p.push(\'' +
    tpl
      .replace(/[\r\t\n]/g, ' ')
      .split('<%').join('\t')
      .replace(/((^|%>)[^\t]*)'/g, '$1\r')
      .replace(/\t=(.*?)%>/g, '\',$1,\'')
      .split('\t').join('\');')
      .split('%>').join('p.push(\'')
      .split('\r').join('\\\'')
    + '\');}return p.join(\'\');';
  return new Function(code).apply(data);
}

export const parseElement = (htmlString) => {
  return new DOMParser().parseFromString(htmlString, 'text/html').body.childNodes[0]
}

export const on = (dom, type, eventHandler) => {
  const $els = document.querySelectorAll(dom);
  if ($els.length === 1) {
    $els[0].addEventListener(type, eventHandler);
  }
  else {
    $els.forEach(el => {
      el[0].addEventListener(type, eventHandler);
    })
  }
}

export const off = (dom, type, eventHandler) => {
  const $els = document.querySelectorAll(dom);
  if ($els.length === 1) {
    $els[0].removeEventListener(type, eventHandler);
  }
  else {
    $els.forEach(el => {
      el[0].removeEventListener(type, eventHandler);
    })
  }
}

export const offAll = (dom) => {
  const $els = document.querySelectorAll(dom);
  $els.forEach(($el, index) => {
    const clone = $el.cloneNode(true);
    $el.parentNode.replaceChild(clone, $el);
    $els[index] = clone;
  });
}

export const getUrlParams = (url = window.location.href) => {
  return Object.assign(
    ...url.match(/([^?=&]+)(=([^&]*))?/g).map(m => {
      let [f, v] = m.split('=');
      return {
        [f]: v
      };
    })
  );
}
