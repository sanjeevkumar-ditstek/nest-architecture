module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 72], // Limit header to 72 characters
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore'],
    ],
    'type-empty': [2, 'never'], // Type should not be empty
    'subject-empty': [2, 'never'], // Subject should not be empty
  },
  
};
