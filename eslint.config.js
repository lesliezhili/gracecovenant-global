import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Allow unescaped Chinese characters in JSX (they're not ambiguous)
      'react/no-unescaped-entities': 'off',
      // Allow `any` in a few places during rapid dev
      '@typescript-eslint/no-explicit-any': 'warn',
      // Allow unused vars prefixed with _ (common in Next.js catch blocks)
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
]

export default eslintConfig
