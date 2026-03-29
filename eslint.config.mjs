import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
  rules: {
        'react/no-unescaped-entities': 'off',
        '@next/next/no-img-element': 'off',
        'react-hooks/exhaustive-deps': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-unused-expressions': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        'react/jsx-no-undef': 'off',
      },
  },
]

export default eslintConfig
