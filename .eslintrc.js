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
    }
};
