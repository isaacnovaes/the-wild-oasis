import eslintPlugin from '@eslint/js';
import globals from 'globals';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import tseslintPlugin from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';

export default tseslintPlugin.config(
    eslintPlugin.configs.recommended,
    tseslintPlugin.configs.strict,
    tseslintPlugin.configs.stylistic,
    eslintPluginPrettierRecommended,
    reactPlugin.configs.flat.recommended,
    reactPlugin.configs.flat['jsx-runtime'],
    jsxA11yPlugin.flatConfigs.strict,
    { ignores: ['dist'] },
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: '2023',
            globals: globals.browser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            'react-hooks': reactHooksPlugin,
            'react-refresh': reactRefreshPlugin,
            react: reactPlugin,
        },
        rules: {
            'array-callback-return': 'warn',
            'no-duplicate-imports': ['warn', { includeExports: true }],
            'no-self-compare': 'error',
            'no-template-curly-in-string': 'error',
            'no-useless-assignment': 'error',
            'require-atomic-updates': 'warn',
            'default-case': 'warn',
            'default-case-last': 'warn',
            'guard-for-in': 'error',
            'no-console': 'warn',
            'no-empty-function': 'error',
            'no-lone-blocks': 'error',
            'no-magic-numbers': ['warn', { enforceConst: true, detectObjects: true }],
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
            'prefer-destructuring': 'error',
            'prefer-object-has-own': 'error',
            'prefer-template': 'error',
            'require-await': 'warn',
            'sort-imports': 'warn',
            'sort-keys': ['warn', 'asc', { natural: true }],
            'sort-vars': 'warn',
            yoda: 'error',
            camelcase: 'error',
            ...reactHooksPlugin.configs.recommended.rules,
            '@typescript-eslint/consistent-type-definitions': 'off',
            '@typescript-eslint/consistent-type-exports': 'warn',
            '@typescript-eslint/consistent-type-imports': 'warn',
            '@typescript-eslint/method-signature-style': 'warn',
            '@typescript-eslint/naming-convention': [
                'warn',
                {
                    selector: 'function',
                    format: ['PascalCase', 'camelCase'],
                },
            ], // avoid react component naming warning
            '@typescript-eslint/no-redundant-type-constituents': 'warn',
            '@typescript-eslint/no-useless-empty-export': 'warn',
            'no-redeclare': 'off',
            '@typescript-eslint/no-redeclare': ['error'], // overwrite base no-redeclare eslint
            'no-shadow': 'off',
            '@typescript-eslint/no-shadow': ['warn', { hoist: 'all' }], // overwrite base no-shadow eslint
            'no-unused-expressions': 'off',
            '@typescript-eslint/no-unused-expressions': ['error'], // overwrite base no-unused-expressions eslint
            'no-use-before-define': 'off',
            '@typescript-eslint/no-use-before-define': 'warn', // overwrite base no-use-before-define eslint
            '@typescript-eslint/no-unused-vars': 'off', // ts already does it
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            'react/boolean-prop-naming': ['warn', { validateNested: true }],
            'react/button-has-type': 'warn',
            'react/destructuring-assignment': [
                'warn',
                'always',
                { ignoreClassFields: true, destructureInSignature: 'always' },
            ],
            'react/jsx-boolean-value': 'warn',
            'react/jsx-child-element-spacing': 'warn',
            'react/jsx-handler-names': [
                'warn',
                { checkLocalVariables: true, checkInlineFunction: false },
            ],
            'react/jsx-no-leaked-render': ['warn', { validStrategies: ['ternary', 'coerce'] }],
            'react/jsx-no-useless-fragment': 'warn',
            'react/jsx-sort-props': [
                'warn',
                { ignoreCase: true, callbacksLast: true, reservedFirst: ['key', 'ref'] },
            ],
            'react/no-array-index-key': 'warn',
            'react/no-unstable-nested-components': 'error',
            'react/no-unused-prop-types': 'warn',
            'react/prefer-read-only-props': 'warn',
            'react/self-closing-comp': 'warn',
            'react/jsx-no-constructed-context-values': 'warn',
            'react/style-prop-object': 'warn',
        },
    }
);
