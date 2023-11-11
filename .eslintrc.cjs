module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        '@electron-toolkit/eslint-config-ts/recommended',
        '@electron-toolkit/eslint-config-prettier'
    ],
    'rules': {
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        "no-empty-function": "off",
        '@typescript-eslint/no-empty-pattern': 'off'
    }
};
