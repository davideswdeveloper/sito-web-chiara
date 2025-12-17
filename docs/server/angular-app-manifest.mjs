
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: './',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/home",
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/servizi"
  },
  {
    "renderMode": 2,
    "route": "/ricette"
  },
  {
    "renderMode": 2,
    "route": "/home"
  },
  {
    "renderMode": 2,
    "route": "/chi-sono"
  },
  {
    "renderMode": 2,
    "route": "/db"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 1321, hash: 'e7d006e4fa8192d701b010374adba1ae2760c83094196a9ee2a1583ce17cc8d9', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1163, hash: 'd7b1397bc48d8824a7e25ad3e37644531c8a25fedd9c76c22a31a15926ee6d05', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'servizi/index.html': {size: 16949, hash: '0bb60fa83ef3ec45c46065564958b35dec818c2e01464369fda26096890b7f0f', text: () => import('./assets-chunks/servizi_index_html.mjs').then(m => m.default)},
    'chi-sono/index.html': {size: 13740, hash: '0c5d32dcbf2108dfc2a0f56769a7b4adac4ee35b01b6de4b4ff0294844bab83e', text: () => import('./assets-chunks/chi-sono_index_html.mjs').then(m => m.default)},
    'ricette/index.html': {size: 27004, hash: '891621c76c1cc6c1850a7d9c9a0eac595268cfd50d401b06c0da36795b5451a3', text: () => import('./assets-chunks/ricette_index_html.mjs').then(m => m.default)},
    'home/index.html': {size: 21663, hash: 'fd2c61cff40d7d517ad903ca6592263e0f604f11c66ba83fa740df964919ff33', text: () => import('./assets-chunks/home_index_html.mjs').then(m => m.default)},
    'db/index.html': {size: 14837, hash: 'b4649d1f93a687b20cc0f8c5bde3ac86507608ad5d19cb5bef887775e413f13c', text: () => import('./assets-chunks/db_index_html.mjs').then(m => m.default)},
    'styles-X7PXL24D.css': {size: 2631, hash: 'eSKXJd9dP+I', text: () => import('./assets-chunks/styles-X7PXL24D_css.mjs').then(m => m.default)}
  },
};
