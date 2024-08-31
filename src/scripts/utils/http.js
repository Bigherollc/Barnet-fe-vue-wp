import { GMAP_URL, DEFAULT_AJAX_OPTS } from './variables';
import { wait } from './index';
import { $win } from '../utils/doms';
import cookie from './cookies';

const SCRIPT_CACHED = {};

function getScript (src) {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script');

    script.async = true;
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;

    document.head.appendChild(script);
  });
}

export function loadScript (url) {
  if (!SCRIPT_CACHED[url]) {
    SCRIPT_CACHED[url] = getScript(url);
  }

  return SCRIPT_CACHED[url];
}

export function callApi (opts) {
  return new Promise((resolve, reject) => {
    const isString = typeof opts === 'string';
    const hasPid = cookie.check('pid');
    const pid = cookie.get('pid') || '';
    const hasUtk = cookie.check('wp-utk');
    const utk = cookie.get('wp-utk') || '';

    let options = {
      ...DEFAULT_AJAX_OPTS,
      data: {},
      url: isString ? opts : ''
    };

    if (!isString) {
      options = { ...options, ...opts };
    }

    hasPid && Object.assign(options, {
      headers: { pid }
    });

    hasUtk && Object.assign(options, {
      headers: { Authorization: `Bearer ${utk}` }
    });

    $('[data-loading]').removeClass('d-none');
    $.ajax(options)
      .done((data) => {
        resolve(data);
        $('[data-loading]').addClass('d-none');
      })
      .fail((mess, statusText, errorThrown) => {
        reject(mess);
        $win.trigger('open-confirm-popup', {
          text: `Api fetching error\nUrl: ${options.url}\n${errorThrown}`,
          type: 'close-popup'
        });
        $('[data-loading]').addClass('d-none');
      });
  });
}

export async function loadMapApi () {
  await loadScript(GMAP_URL);

  return window.google.maps;
}

export async function download (url, fileName = '') {
  if (!url) {
    return;
  }

  const $link = $('<a />', {
    href: url,
    download: fileName,
    style: 'display:none'
  });

  $link
    .on('click', e => e.stopImmediatePropagation())
    .appendTo('body')[0]
    .click();

  await wait();

  $link.remove();
}

export function getParamValue (url) {
  const vars = {};
  const aURL = url || window.location.search;
  let hashes = null;

  if (aURL.indexOf('?') > -1) {
    hashes = aURL.slice(aURL.indexOf('?') + 1).split('&');

    for (let i = 0; i < hashes.length; i++) {
      let hash = hashes[i].split('=');
      if ( hash.length > 1 ) {
        vars[hash[0]] = window.decodeURIComponent(hash[1]);
      }
    }
  }
  return vars;
}

export function updateParamValue( param, data, useReplace ) {
  const url = new URL(window.location);

  data
    ? url.searchParams.set(param, data)
    : url.searchParams.delete(param);

  const href = url.href.replace(/(%2C)/g, ',');
  const urlNew = Object.assign(url, { href });
  window.history[useReplace ? 'replaceState' : 'pushState']({}, '', urlNew);
}
