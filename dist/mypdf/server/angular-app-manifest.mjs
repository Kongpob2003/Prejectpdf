
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/login",
    "route": "/"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-DWXZUNMZ.js",
      "chunk-PLFIUDVV.js",
      "chunk-Z7YLOZ62.js"
    ],
    "route": "/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-4IMMOYSR.js",
      "chunk-PLFIUDVV.js",
      "chunk-Z7YLOZ62.js",
      "chunk-7O6VSLQY.js"
    ],
    "route": "/home"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-2HHGBUJ6.js",
      "chunk-PLFIUDVV.js",
      "chunk-Z7YLOZ62.js",
      "chunk-7O6VSLQY.js"
    ],
    "route": "/adddeleteuser"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-XU2DHZUU.js",
      "chunk-Z7YLOZ62.js",
      "chunk-7O6VSLQY.js"
    ],
    "route": "/category"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-JV7BSTNS.js",
      "chunk-PLFIUDVV.js",
      "chunk-Z7YLOZ62.js",
      "chunk-7O6VSLQY.js"
    ],
    "route": "/qualityassurance"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-J3XED77J.js",
      "chunk-NBBKA3AT.js",
      "chunk-4CIMSWBD.js",
      "chunk-PLFIUDVV.js",
      "chunk-Z7YLOZ62.js",
      "chunk-7O6VSLQY.js"
    ],
    "route": "/relation"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-CZ3DOSWK.js",
      "chunk-2V7U64DJ.js",
      "chunk-4CIMSWBD.js",
      "chunk-Z7YLOZ62.js",
      "chunk-7O6VSLQY.js"
    ],
    "route": "/jae"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-5TISNRFE.js",
      "chunk-7O6VSLQY.js"
    ],
    "route": "/menubook"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-HWRW4SZI.js",
      "chunk-JEPGJEA3.js",
      "chunk-PLFIUDVV.js",
      "chunk-Z7YLOZ62.js"
    ],
    "route": "/userhome"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-34T3V6SU.js",
      "chunk-JEPGJEA3.js",
      "chunk-PLFIUDVV.js",
      "chunk-Z7YLOZ62.js"
    ],
    "route": "/userprofile"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-2YAQJVPB.js",
      "chunk-JEPGJEA3.js",
      "chunk-PLFIUDVV.js",
      "chunk-Z7YLOZ62.js"
    ],
    "route": "/usercalender"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-RDFHOWK2.js",
      "chunk-JEPGJEA3.js",
      "chunk-NBBKA3AT.js",
      "chunk-4CIMSWBD.js",
      "chunk-PLFIUDVV.js",
      "chunk-Z7YLOZ62.js"
    ],
    "route": "/userrelation"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-FY5ZV4RB.js",
      "chunk-2V7U64DJ.js",
      "chunk-JEPGJEA3.js",
      "chunk-4CIMSWBD.js",
      "chunk-Z7YLOZ62.js"
    ],
    "route": "/userjae"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-7DXB7K6W.js",
      "chunk-JEPGJEA3.js",
      "chunk-Z7YLOZ62.js"
    ],
    "route": "/userqualityassurance"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-JSDZHHQD.js",
      "chunk-PLFIUDVV.js",
      "chunk-Z7YLOZ62.js",
      "chunk-7O6VSLQY.js"
    ],
    "route": "/profile"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-HVCPQKTF.js",
      "chunk-PLFIUDVV.js",
      "chunk-Z7YLOZ62.js",
      "chunk-7O6VSLQY.js"
    ],
    "route": "/calender"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-M7HMJEPX.js",
      "chunk-JEPGJEA3.js"
    ],
    "route": "/sidebar"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-GA6QSL3L.js",
      "chunk-7O6VSLQY.js"
    ],
    "route": "/adminsidebar"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-326U5HUG.js"
    ],
    "route": "/review"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 24695, hash: 'fa3afa243fc36015768c9610addb7a25a069780e17dc99d377b2a75d939c124d', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17153, hash: '8b1c1ff93063584adffd027ce4765d119c3b808debc96f5edaa78dd7b9d69779', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'relation/index.html': {size: 35396, hash: 'c1962502a769f389cd6ace06ed95c51f313bcf2b9499448873372ac0eca69e95', text: () => import('./assets-chunks/relation_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 28822, hash: 'a003f3472bbda5d4c6c21520dce09bca8384ac63a584756616a0d9db2006e4a4', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'home/index.html': {size: 42057, hash: 'c68f0626485b03de0828e1f8715b6c7471b9896f09695b1ec9743be4ceeb8d59', text: () => import('./assets-chunks/home_index_html.mjs').then(m => m.default)},
    'jae/index.html': {size: 33669, hash: 'e3902035fda28e65a4472985870c9f1707e4d69ae9f4c6148aad39f8cd5b9adc', text: () => import('./assets-chunks/jae_index_html.mjs').then(m => m.default)},
    'usercalender/index.html': {size: 52727, hash: 'a7013e39a7b92097240813a2016760dc32c5c7ccfdac87969baad622a3d5dd2c', text: () => import('./assets-chunks/usercalender_index_html.mjs').then(m => m.default)},
    'review/index.html': {size: 25166, hash: '1085fbe37a98d75ed06f78ff7d9bf05481a5fb1912d6c9ef52c9385c0e1473dc', text: () => import('./assets-chunks/review_index_html.mjs').then(m => m.default)},
    'sidebar/index.html': {size: 29269, hash: '43f78859684684325e61a254dba338b381d1d854148ca9141389812a982a041b', text: () => import('./assets-chunks/sidebar_index_html.mjs').then(m => m.default)},
    'userjae/index.html': {size: 32905, hash: '6395d32938fd016df7d5bac4be1069fd780fb3d8026cc33f38ba9ed8afa66edc', text: () => import('./assets-chunks/userjae_index_html.mjs').then(m => m.default)},
    'profile/index.html': {size: 34974, hash: '9d986665d41b88f89ff6650b3af3dabbf40ce6a651962474a62e0686db8d27fe', text: () => import('./assets-chunks/profile_index_html.mjs').then(m => m.default)},
    'category/index.html': {size: 34624, hash: '540490d0bd18d7d272fd065953359a493b8e8a92fe62c9a37de6f7e498e18b78', text: () => import('./assets-chunks/category_index_html.mjs').then(m => m.default)},
    'adminsidebar/index.html': {size: 29752, hash: '563b23133129a3b72c72567db53b4487d927f352007e96c1f86d73a219b510e4', text: () => import('./assets-chunks/adminsidebar_index_html.mjs').then(m => m.default)},
    'userqualityassurance/index.html': {size: 37061, hash: '9acde75a613a3e976c3aa04820963e81c569f196c82db1699528f0d8fc294ef3', text: () => import('./assets-chunks/userqualityassurance_index_html.mjs').then(m => m.default)},
    'menubook/index.html': {size: 31560, hash: '0df35c978d1efdb6c966dd8a62fc7f0425ec9af82ce568ca0a4fb2e32f42a311', text: () => import('./assets-chunks/menubook_index_html.mjs').then(m => m.default)},
    'userprofile/index.html': {size: 34471, hash: '9e3f63c54d0ccd4c5c5a2fa816396dfde9fd5b3f0820effe4fbd18f350354628', text: () => import('./assets-chunks/userprofile_index_html.mjs').then(m => m.default)},
    'qualityassurance/index.html': {size: 36420, hash: 'b314b962b3c287ba3cf52a3faaaafafdf56f2e8d5ebf60623627f12739bb3847', text: () => import('./assets-chunks/qualityassurance_index_html.mjs').then(m => m.default)},
    'userrelation/index.html': {size: 34943, hash: 'a39d673cca9fcb414a6a53a12695fb4ddc1ef821d8ca1569d5ca38f85fb6959d', text: () => import('./assets-chunks/userrelation_index_html.mjs').then(m => m.default)},
    'userhome/index.html': {size: 34742, hash: '55b565640bc0c7c4b45c45e1a3c082139da28b6439287df2292c51f1f43869f8', text: () => import('./assets-chunks/userhome_index_html.mjs').then(m => m.default)},
    'adddeleteuser/index.html': {size: 40647, hash: '5e701bb73078b1aaf22e61ac0ff5053507dd5c521c1592a8a86975ae47414b63', text: () => import('./assets-chunks/adddeleteuser_index_html.mjs').then(m => m.default)},
    'calender/index.html': {size: 56223, hash: 'c2d3d1c70f6c51a8b4446e9726d28e4b9d211cefa7a9b0bffb5af2560bbb5269', text: () => import('./assets-chunks/calender_index_html.mjs').then(m => m.default)},
    'styles-QFW5E3L7.css': {size: 8569, hash: '+YPudm6BnSg', text: () => import('./assets-chunks/styles-QFW5E3L7_css.mjs').then(m => m.default)}
  },
};
