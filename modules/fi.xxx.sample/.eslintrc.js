module.exports = {
  extends: 'airbnb',
  env: {
    node: true,
    es6: true
  },
  ecmaFeatures: {
    generators: true
  },
  rules: {
    strict: 0,
    'arrow-body-style': [ 2, 'always' ],
    'prefer-const': 1,
    'class-methods-use-this': 0,
    'quotes': [ 1, 'single', { "allowTemplateLiterals": true} ]
  }
};
