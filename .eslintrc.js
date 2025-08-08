module.exports = {
  root: true,
  extends: ['universe/native', 'plugin:react-hooks/recommended'],
  parserOptions: { tsconfigRootDir: __dirname, project: ['./tsconfig.json'] },
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
  }
};
