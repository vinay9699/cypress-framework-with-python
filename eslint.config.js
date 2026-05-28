const cypress = require('eslint-plugin-cypress')

// configs.recommended is a single flat-config object (not an array), so
// we place it as-is and then add a second entry to override project rules.
module.exports = [
  // Allow CJS globals in Node.js config files (require, module, exports)
  {
    files: ['eslint.config.js', 'cypress.config.js', 'cypress/plugins/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'writable',
        exports: 'writable',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
      },
    },
  },
  // Ignore TypeScript declaration files — they are type-only, not real source
  { ignores: ['**/*.d.ts'] },
  cypress.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-undef': 'error',
      eqeqeq: ['error', 'always'],
      'prefer-const': 'warn',
      'no-var': 'error',
      'no-duplicate-imports': 'error',
    },
  },
]
