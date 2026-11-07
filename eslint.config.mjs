import frontendConfig from './frontend/eslint.config.js';

export default [
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/target/**',
      'legacy/**',
      'docs/**',
      'backend/**',
      '*.config.*',
    ],
  },
  ...frontendConfig,
];

