module.exports = {
   env: {
      browser: true,
      es2020: true,
   },
   extends: ['airbnb-base'],
   parserOptions: {
      ecmaVersion: 11,
      sourceType: 'module',
   },
   rules: {
      indent: ['error', 3],

      'import/extensions': ['warn', { js: 'never' }],
      'import/no-unresolved': 'off',
      'import/prefer-default-export': 'off',
      'func-names': 'off',
   },
};
