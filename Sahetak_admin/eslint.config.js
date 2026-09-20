import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Fetching data on mount legitimately updates state from an effect.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    // Context modules intentionally export their provider and context object.
    files: ['src/context/**/*.jsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
