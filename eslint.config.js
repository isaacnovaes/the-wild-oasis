import eslintPlugin from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import pluginRouter from '@tanstack/eslint-plugin-router';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslintPlugin from 'typescript-eslint';

export default tseslintPlugin.config(
    {
        languageOptions: { globals: globals.browser },
        rules: {
            ...eslintPlugin.configs.recommended.rules,
            'array-callback-return': 'warn',
            'no-duplicate-imports': 'warn',
            'no-self-compare': 'error',
            'no-template-curly-in-string': 'error',
            'no-useless-assignment': 'error',
            'require-atomic-updates': 'warn',
            'default-case': 'warn',
            'default-case-last': 'warn',
            'guard-for-in': 'error',
            'no-console': 'warn',
            'no-lone-blocks': 'error',
            'no-param-reassign': 'error',
            'no-else-return': ['error', { allowElseIf: false }],
            'no-extra-boolean-cast': ['error', { enforceForInnerExpressions: true }],
            'no-implicit-coercion': 'error',
            'no-lonely-if': 'error',
            'no-unneeded-ternary': ['error', { defaultAssignment: false }],
            'no-useless-computed-key': 'warn',
            'no-useless-return': 'error',
            'no-var': 'error',
            'object-shorthand': 'warn',
            'prefer-const': 'error',
            'prefer-object-has-own': 'error',
            'prefer-template': 'error',
            yoda: 'error',
            camelcase: 'error',
        },
    },
    eslintPluginPrettierRecommended,
    ...tseslintPlugin.configs.recommendedTypeChecked.map((config) => ({
        ...config,
        files: ['**/*.{ts,tsx}'], // We use TS config only for TS files
    })),
    ...tseslintPlugin.configs.strictTypeChecked.map((config) => ({
        ...config,
        files: ['**/*.{ts,tsx}'], // We use TS config only for TS files
    })),
    ...pluginQuery.configs['flat/recommended'],
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2023,
            globals: globals.browser,
            parserOptions: {
                projectService: true,
                project: ['./tsconfig.node.json', './tsconfig.app.json'],
                tsconfigRootDir: import.meta.dirname,
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: { react: { version: '19.0.0' } },
        plugins: {
            'react-hooks': reactHooksPlugin,
            'react-refresh': reactRefreshPlugin,
            react: reactPlugin,
            'jsx-a11y': jsxA11yPlugin,
            '@tanstack/router': pluginRouter,
        },
        rules: {
            // Typescript ---------------------------------------------------------------

            '@typescript-eslint/consistent-type-exports': 'warn',
            '@typescript-eslint/consistent-type-imports': [
                'warn',
                { fixStyle: 'inline-type-imports' },
            ],
            '@typescript-eslint/no-import-type-side-effects': 'warn',
            '@typescript-eslint/method-signature-style': 'warn',
            '@typescript-eslint/promise-function-async': 'error',
            '@typescript-eslint/no-useless-empty-export': 'warn',
            '@typescript-eslint/no-unsafe-type-assertion': 'error',
            'require-await': 'off',
            '@typescript-eslint/require-await': 'error',
            'no-empty-function': 'off',
            '@typescript-eslint/no-empty-function': 'error',
            'prefer-destructuring': 'off',
            '@typescript-eslint/prefer-destructuring': 'error',
            'no-magic-numbers': 'off',
            '@typescript-eslint/no-magic-numbers': [
                'warn',
                {
                    enforceConst: true,
                    detectObjects: true,
                    ignoreEnums: true,
                    ignoreNumericLiteralTypes: true,
                },
            ],
            'no-redeclare': 'off',
            '@typescript-eslint/no-redeclare': ['error'],
            'no-shadow': 'off',
            '@typescript-eslint/no-shadow': ['warn', { hoist: 'all' }],
            'no-unused-expressions': 'off',
            '@typescript-eslint/no-unused-expressions': 'error',
            'no-use-before-define': 'off',
            '@typescript-eslint/no-use-before-define': 'warn',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],

            // React ------------------------------------------------------

            ...reactPlugin.configs.flat.recommended.rules,
            ...reactPlugin.configs.flat['jsx-runtime'].rules,
            ...reactHooksPlugin.configs.recommended.rules,
            ...jsxA11yPlugin.flatConfigs.strict.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            'react/boolean-prop-naming': ['warn', { validateNested: true }],
            'react/button-has-type': 'warn',
            'react/destructuring-assignment': 'off',
            'react/jsx-boolean-value': 'warn',
            'react/jsx-child-element-spacing': 'warn',
            'react/jsx-handler-names': [
                'warn',
                { checkLocalVariables: true, checkInlineFunction: false },
            ],
            'react/jsx-no-constructed-context-values': 'warn',
            'react/jsx-no-leaked-render': ['warn', { validStrategies: ['ternary', 'coerce'] }],
            'react/jsx-no-useless-fragment': 'warn',
            'react/jsx-sort-props': [
                'warn',
                {
                    ignoreCase: true,
                    callbacksLast: true,
                    reservedFirst: ['key', 'ref'],
                },
            ],
            'react/no-array-index-key': 'warn',
            'react/no-unstable-nested-components': 'error',
            'react/no-unused-prop-types': 'warn',
            'react/prefer-read-only-props': 'warn',
            'react/self-closing-comp': 'warn',
            'react/style-prop-object': 'warn',
            '@typescript-eslint/naming-convention': [
                'warn',
                {
                    selector: 'function',
                    format: ['PascalCase', 'camelCase'],
                },
            ], // avoid react component naming warning
            '@tanstack/router/create-route-property-order': 'warn',
        },
    }
);
