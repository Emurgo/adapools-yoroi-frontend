module.exports = {
  extends: ['airbnb', 'prettier', 'eslint:recommended', 'plugin:react/recommended'],
  env: {
    browser: true,
    es2020: true,
  },
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    indent: 'off',
    'implicit-arrow-linebreak': 'off',
    'prefer-const': 1,
    'object-curly-spacing': 1,
    'spaced-comment': 1,
    quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    'import/imports-first': 1,
    'import/no-cycle': 'off',
    'no-multiple-empty-lines': 1,
  },
  plugins: ['import', 'react', 'flowtype'],
};
