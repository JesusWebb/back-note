import js from '@eslint/js'
import globals from 'globals'

export default [
  { ignores: ['dist', 'node_modules', 'eslint.config.js',] },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...js.configs.recommended.rules,

      // --- Estilo y consistencia ---
      'indent': ['error', 2],
      'semi': ['error', 'never'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'eol-last': ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'space-before-function-paren': ['error', 'always'],
      'keyword-spacing': ['error', { before: true, after: true }],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-trailing-spaces': 'error',

      // --- Buenas prácticas ---
      'eqeqeq': ['error', 'always'],
      'no-console': 'warn',
      'no-alert': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'no-duplicate-imports': 'error',
      'no-magic-numbers': ['warn', { ignore: [0, 1], enforceConst: true }],
      'no-return-await': 'error',
      'consistent-return': 'error',

      // --- Posibles errores ---
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'no-undef': 'error',
      'no-redeclare': 'error',
      'no-dupe-keys': 'error',
      'no-empty': ['error', { allowEmptyCatch: false }],
      'valid-typeof': 'error',
      'no-unreachable': 'error',

      // --- Seguridad ---
      'no-new-func': 'error',
      'no-proto': 'error',
      'no-iterator': 'error',

      // --- ECMAScript moderno ---
      'prefer-template': 'error',
      'template-curly-spacing': ['error', 'never'],
      'symbol-description': 'error',
    },
  },
]
