module.exports = {
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        ecmaFeatures: {
            jsx: true // Allows for the parsing of JSX
        }
    },
    settings: {
        react: {
            version: 'detect' // Tells eslint-plugin-react to automatically detect the version of React to use
        }
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        'prettier/prettier': 'warn',
        'no-unused-vars': 1,
        'no-empty': 1
    },
    env: {
        node: true,
        es6: true,
        browser: true
    },
    overrides: [
        {
            files: ['example/**/*.ts', 'example/**/*.tsx'],
            parser: '@typescript-eslint/parser', // Specifies the ESLint parser
            extends: [
                'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
                'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
                'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
                'plugin:react-hooks/recommended'
            ],
            rules: {
                'prettier/prettier': 'warn',
                '@typescript-eslint/no-var-requires': 0,
                '@typescript-eslint/no-empty-interface': 0,
                '@typescript-eslint/no-namespace': 0,
                '@typescript-eslint/ban-ts-comment': 0,
                '@typescript-eslint/no-unused-vars': 1,
                '@typescript-eslint/no-explicit-any': 0,
                '@typescript-eslint/explicit-module-boundary-types': 0,
                'react/jsx-no-undef': 2,
                'react/no-unknown-property': 2,
                'react-hooks/exhaustive-deps': 0,
                'react/prop-types': 'off',
                'prefer-spread': 0,
                'no-restricted-imports': [
                    'error',
                    {
                        patterns: [
                            '@material-ui/*/*/*',
                            '!@material-ui/core/test-utils/*'
                        ]
                    }
                ]
            }
        }
    ]
};
