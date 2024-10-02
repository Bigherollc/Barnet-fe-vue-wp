module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset', // Vue CLI Babel preset
    ['@babel/preset-env', {
      targets: { esmodules: true },
      useBuiltIns: 'usage',
      corejs: { version: 3, proposals: true } // CoreJS configuration
    }],
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      corejs: 3,  // Make sure this matches your `core-js` version
      helpers: true,
      regenerator: true,
      useESModules: true
    }]
  ]
};
