import eslintPlugin from '@eslint/js';
import globals from 'globals';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import tseslintPlugin from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslintPlugin.config(
    { ignores: ['dist'] },
    {
        extends: [
            eslintPlugin.configs.recommended,
            ...tseslintPlugin.configs.strict,
            ...tseslintPlugin.configs.stylistic,
        ],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            'react-hooks': reactHooksPlugin,
            'react-refresh': reactRefreshPlugin,
        },
        rules: {
            ...reactHooksPlugin.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            // 'prettier/prettier': [
            // 	'warn',
            // 	{
            // 		endOfLine: 'auto',
            // 		singleQuote: true,
            // 		jsxSingleQuote: true,
            // 		printWidth: 100,
            // 	},
            // ],
            'no-duplicate-imports': ['warn', { includeExports: true }],
            'no-template-curly-in-string': 'warn',
            camelcase: ['warn', { properties: 'always' }],
            'default-case': 'warn',
            'no-lone-blocks': 'warn',
            'prefer-const': 'warn',
            yoda: 'error',
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
            '@typescript-eslint/no-redeclare': ['warn'], // overwrite base no-redeclare eslint
            'no-shadow': 'off',
            '@typescript-eslint/no-shadow': ['warn', { hoist: 'all' }], // overwrite base no-shadow eslint
            'no-unused-expressions': 'off',
            '@typescript-eslint/no-unused-expressions': ['warn'], // overwrite base no-unused-expressions eslint
            'no-use-before-define': 'off',
            '@typescript-eslint/no-use-before-define': 'warn', // overwrite base no-use-before-define eslint
            'react/boolean-prop-naming': ['warn', { validateNested: true }],
            'react/button-has-type': 'warn',
            'react/no-array-index-key': 'warn',
            'react/no-unstable-nested-components': 'error',
            'react/no-unused-prop-types': 'warn',
            'react/no-unused-state': 'warn',
            'react/self-closing-comp': 'warn',
            'react/jsx-no-constructed-context-values': 'warn',
            'react/jsx-no-leaked-render': ['warn', { validStrategies: ['ternary', 'coerce'] }],
            'import/no-unresolved': 'error',
            'import/no-cycle': 'error',
            'import/first': 'error',
            'import/group-exports': 'error',
            'import/newline-after-import': 'error',
            'import/order': 'error',
        },
    },
    eslintPluginPrettierRecommended,
    {
        files: ['**/*.css'],
        plugins: ['stylelint-prettier'],
        rules: {
            'prettier/prettier': true,
        },
    }
);
