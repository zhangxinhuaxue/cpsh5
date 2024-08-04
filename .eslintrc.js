module.exports = {
  root: true,
  env: {
    node: true
  },
  globals: {
    Sentry: true,
    window: true,
    aixuedai: true,
    $: true,
    axdApp: true,
},
  extends: [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-empty': 'off',
    'no-unused-vars': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
