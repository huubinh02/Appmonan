module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['prettier', 'react-hooks'],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'no-unused-vars': 'warn',
    'react-native/no-inline-styles': 'off',
    'prettier/prettier': ['error', {endOfLine: 'auto'}],
    'no-console': 'off',
    'no-debugger': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
